// src/generators/followUpMessage.js
import { getTemplate } from "../promptTemplates.js";
import { sanitizeUserInput } from "../promptInjectionGuard.js";
import { validateCitations } from "../policyContext.js";
import { callAIForJSON } from "../aiClient.js";
import { logger } from "../logger.js";

/**
 * Generates a follow-up / status-nudge message for an open case.
 *
 * @param {object} params
 * @param {string} params.complaintText - original complaint text (untrusted)
 * @param {object} [params.context]
 * @param {number|string} [params.daysOpen]
 * @param {Array<object>} [params.policies] - structured, retrieved policy
 *   chunks: [{ source_id, title, section, last_updated, text }]
 * @param {string} [params.templateVersion]
 */
export async function generateFollowUpMessage({
  complaintText,
  context = {},
  daysOpen,
  policies = [],
  templateVersion,
}) {
  const { safeBlock, flagged, matches } = sanitizeUserInput(complaintText);
  if (flagged) {
    logger.warn("Possible prompt injection detected in follow_up_message input", {
      matches,
    });
  }

  const template = getTemplate("follow_up_message", templateVersion);
  const userPrompt = template.buildUserPrompt({
    context,
    daysOpen,
    safeComplaintBlock: safeBlock,
    policies,
  });

  const result = await callAIForJSON({
    system: template.system,
    userPrompt,
    outputSchema: template.outputSchema,
  });

  const citationCheck = validateCitations(result.citations, policies);
  if (!citationCheck.valid) {
    logger.warn("follow_up_message cited a policy that was never retrieved", {
      fabricatedCitations: citationCheck.fabricatedCitations,
    });
  }

  return {
    ...result,
    _promptInjectionFlagged: flagged,
    _citationValidation: citationCheck,
  };
}
