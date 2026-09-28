// src/config.js
// Single place to read connection + behavior settings from environment
// variables, with sane defaults so the module still runs in dev.

function num(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export const config = {
  apiKey: process.env.AI_API_KEY || "",
  baseUrl: process.env.AI_API_BASE_URL || "https://api.anthropic.com/v1/messages",
  model: process.env.AI_API_MODEL || "claude-sonnet-4-6",
  apiVersion: process.env.AI_API_VERSION || "2023-06-01",

  maxTokens: num(process.env.AI_MAX_TOKENS, 1000),
  temperature: num(process.env.AI_TEMPERATURE, 0.4),

  maxRetries: num(process.env.AI_MAX_RETRIES, 3),
  retryBaseDelayMs: num(process.env.AI_RETRY_BASE_DELAY_MS, 500),
  requestTimeoutMs: num(process.env.AI_REQUEST_TIMEOUT_MS, 20000),
};

export function assertConfigured() {
  if (!config.apiKey) {
    throw new Error(
      "AI_API_KEY is not set. Copy .env.example to .env and fill it in."
    );
  }
}
