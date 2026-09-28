// src/generators/customerReply.js
import { getTemplate } from "../promptTemplates.js";
import { sanitizeUserInput } from "../promptInjectionGuard.js";
import { validateCitations } from "../policyContext.js";
import { callAIForJSON } from "../aiClient.js";
import { logger } from "../logger.js";

/**
 * Generates a customer-facing reply for a complaint.
 *
 * @param {object} params
 * @param {string} params.complaintText - raw customer message (untrusted)
 * @param {object} [params.context] - { category, subcategory, department, urgency, sentiment, customerName }
 * @param {Array<object>} [params.policies] - structured, retrieved policy
 *   chunks: [{ source_id, title, section, last_updated, text }]. See
 *   src/policyContext.js for the rationale on why this is structured
 *   rather than plain concatenated text.
 * @param {string} [params.templateVersion]
 * @returns {Promise<{reply: string, tone: string, suggested_next_step: string, citations: string[]}>}
 */
export async function generateCustomerReply({
  complaintText,
  context = {},
  policies = [],
  templateVersion,
}) {
  const { safeBlock, flagged, matches } = sanitizeUserInput(complaintText);
  if (flagged) {
    logger.warn("Possible prompt injection detected in customer_reply input", {
      matches,
    });
  }

  const template = getTemplate("customer_reply", templateVersion);
  const userPrompt = template.buildUserPrompt({
    complaintText,
    context,
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
    logger.warn("customer_reply cited a policy that was never retrieved", {
      fabricatedCitations: citationCheck.fabricatedCitations,
    });
  }
  if (citationCheck.staleCitations.length > 0) {
    logger.warn("customer_reply cited a stale policy", {
      staleCitations: citationCheck.staleCitations,
    });
  }

  return {
    ...result,
    _promptInjectionFlagged: flagged,
    _citationValidation: citationCheck,
  };
}
