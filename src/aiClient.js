// src/aiClient.js
//
// Handles the actual connection to the AI API:
//   - request construction + auth headers
//   - timeouts (AbortController)
//   - retries with exponential backoff + jitter for transient failures
//   - safe JSON extraction/validation from model output, with a bounded
//     number of "please fix your JSON" re-prompts

import { config, assertConfigured } from "./config.js";
import { logger } from "./logger.js";

export class AIRequestError extends Error {
  constructor(message, { status, retryable = false, cause } = {}) {
    super(message);
    this.name = "AIRequestError";
    this.status = status;
    this.retryable = retryable;
    this.cause = cause;
  }
}

export class AIOutputError extends Error {
  constructor(message, { raw, cause } = {}) {
    super(message);
    this.name = "AIOutputError";
    this.raw = raw;
    this.cause = cause;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function backoffDelay(attempt) {
  const base = config.retryBaseDelayMs * 2 ** attempt;
  const jitter = Math.random() * config.retryBaseDelayMs;
  return base + jitter;
}

function isRetryableStatus(status) {
  // 429 (rate limit), 408 (timeout), and 5xx are worth retrying.
  return status === 429 || status === 408 || (status >= 500 && status < 600);
}

/**
 * Low-level call to the AI API. Retries transient errors automatically.
 *
 * @param {object} params
 * @param {string} params.system - system prompt
 * @param {Array<{role: 'user'|'assistant', content: string}>} params.messages
 * @param {number} [params.maxTokens]
 * @param {number} [params.temperature]
 * @returns {Promise<string>} the model's raw text output
 */
export async function callAI({ system, messages, maxTokens, temperature }) {
  assertConfigured();

  let lastError;
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.requestTimeoutMs);

    try {
      const response = await fetch(config.baseUrl, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": config.apiKey,
          "anthropic-version": config.apiVersion,
        },
        body: JSON.stringify({
          model: config.model,
          max_tokens: maxTokens ?? config.maxTokens,
          temperature: temperature ?? config.temperature,
          system,
          messages,
        }),
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const bodyText = await response.text().catch(() => "");
        const retryable = isRetryableStatus(response.status);
        const err = new AIRequestError(
          `AI API returned ${response.status}: ${bodyText.slice(0, 500)}`,
          { status: response.status, retryable }
        );
        if (retryable && attempt < config.maxRetries) {
          const delay = backoffDelay(attempt);
          logger.warn("Retryable AI API error, backing off", {
            attempt,
            status: response.status,
            delayMs: Math.round(delay),
          });
          lastError = err;
          await sleep(delay);
          continue;
        }
        throw err;
      }

      const data = await response.json();
      const text = (data.content || [])
        .filter((block) => block.type === "text")
        .map((block) => block.text)
        .join("\n")
        .trim();

      if (!text) {
        throw new AIOutputError("AI API returned no text content", { raw: data });
      }

      return text;
    } catch (error) {
      clearTimeout(timeout);

      const isAbort = error.name === "AbortError";
      const isNetwork = error instanceof TypeError; // fetch network failure
      const retryable =
        isAbort || isNetwork || (error instanceof AIRequestError && error.retryable);

      if (retryable && attempt < config.maxRetries) {
        const delay = backoffDelay(attempt);
        logger.warn("Transient error calling AI API, retrying", {
          attempt,
          reason: isAbort ? "timeout" : isNetwork ? "network" : error.message,
          delayMs: Math.round(delay),
        });
        lastError = error;
        await sleep(delay);
        continue;
      }

      if (error instanceof AIRequestError || error instanceof AIOutputError) {
        throw error;
      }
      throw new AIRequestError(`Unexpected error calling AI API: ${error.message}`, {
        retryable: false,
        cause: error,
      });
    }
  }

  throw lastError || new AIRequestError("AI API call failed after retries");
}

/** Strips ```json fences etc. in case the model wraps output anyway. */
function stripCodeFences(text) {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

/** Minimal shape check — required keys present and roughly right type. */
function validateShape(obj, schema) {
  if (!schema) return { valid: true, errors: [] };
  const errors = [];
  for (const key of schema.required || []) {
    if (!(key in obj)) {
      errors.push(`missing required field "${key}"`);
      continue;
    }
    const expectedType = schema.types?.[key];
    if (expectedType === "array" && !Array.isArray(obj[key])) {
      errors.push(`field "${key}" should be an array`);
    } else if (expectedType && expectedType !== "array" && typeof obj[key] !== expectedType) {
      errors.push(`field "${key}" should be of type ${expectedType}`);
    }
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Calls the AI API and guarantees back a parsed, schema-checked JSON object.
 * If the model returns malformed or non-conforming JSON, it is re-prompted
 * (bounded number of attempts) with the specific parse/validation error so
 * it can self-correct, before finally throwing AIOutputError.
 *
 * @param {object} params
 * @param {string} params.system
 * @param {string} params.userPrompt
 * @param {object} [params.outputSchema] - { required: string[], types: {} }
 * @param {number} [params.maxTokens]
 * @param {number} [params.temperature]
 * @param {number} [params.maxJsonRetries]
 */
export async function callAIForJSON({
  system,
  userPrompt,
  outputSchema,
  maxTokens,
  temperature,
  maxJsonRetries = 2,
}) {
  const messages = [{ role: "user", content: userPrompt }];

  for (let attempt = 0; attempt <= maxJsonRetries; attempt++) {
    const rawText = await callAI({ system, messages, maxTokens, temperature });
    const cleaned = stripCodeFences(rawText);

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      logger.warn("Model output was not valid JSON, re-prompting", {
        attempt,
        preview: cleaned.slice(0, 200),
      });
      messages.push({ role: "assistant", content: rawText });
      messages.push({
        role: "user",
        content:
          "That was not valid JSON. Return ONLY a single valid JSON object, " +
          "no markdown, no commentary, no code fences.",
      });
      if (attempt === maxJsonRetries) {
        throw new AIOutputError("Model did not return valid JSON after retries", {
          raw: rawText,
          cause: parseErr,
        });
      }
      continue;
    }

    const { valid, errors } = validateShape(parsed, outputSchema);
    if (!valid) {
      logger.warn("Model JSON failed schema validation, re-prompting", {
        attempt,
        errors,
      });
      messages.push({ role: "assistant", content: rawText });
      messages.push({
        role: "user",
        content: `Your JSON was missing/invalid fields: ${errors.join(
          "; "
        )}. Return the corrected JSON object only.`,
      });
      if (attempt === maxJsonRetries) {
        throw new AIOutputError("Model JSON failed schema validation after retries", {
          raw: rawText,
        });
      }
      continue;
    }

    return parsed;
  }

  // Unreachable, but keeps linters happy.
  throw new AIOutputError("Failed to obtain valid JSON output");
}
