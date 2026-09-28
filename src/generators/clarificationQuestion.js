// src/generators/clarificationQuestion.js
import { getTemplate } from "../promptTemplates.js";
import { sanitizeUserInput } from "../promptInjectionGuard.js";
import { callAIForJSON } from "../aiClient.js";
import { logger } from "../logger.js";

/**
 * Generates clarifying question(s) needed to triage/resolve an ambiguous
 * or incomplete complaint.
 *
 * @param {object} params
 * @param {string} params.complaintText - raw customer message (untrusted)
 * @param {object} [params.context]
 * @param {string} [params.templateVersion]
 * @returns {Promise<{questions: string[], missing_info: string[]}>}
 */
export async function generateClarificationQuestion({
  complaintText,
  context = {},
  templateVersion,
}) {
  const { safeBlock, flagged, matches } = sanitizeUserInput(complaintText);
  if (flagged) {
    logger.warn("Possible prompt injection detected in clarification_question input", {
      matches,
    });
  }

  const template = getTemplate("clarification_question", templateVersion);
  const userPrompt = template.buildUserPrompt({
    context,
    safeComplaintBlock: safeBlock,
  });

  const result = await callAIForJSON({
    system: template.system,
    userPrompt,
    outputSchema: template.outputSchema,
  });

  return { ...result, _promptInjectionFlagged: flagged };
}
