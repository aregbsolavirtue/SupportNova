// src/generators/agentTip.js
import { getTemplate } from "../promptTemplates.js";
import { sanitizeUserInput } from "../promptInjectionGuard.js";
import { validateCitations } from "../policyContext.js";
import { callAIForJSON } from "../aiClient.js";
import { logger } from "../logger.js";

/**
 * Generates an internal-only summary + tip for the human agent working
 * this case. Never shown to the customer.
 *
 * @param {object} params
 * @param {string} params.complaintText - raw customer message (untrusted)
 * @param {object} [params.context]
 * @param {Array<object>} [params.policies] - structured, retrieved policy
 *   chunks: [{ source_id, title, section, last_updated, text }]
 * @param {string} [params.templateVersion]
 * @returns {Promise<{summary: string, agent_tip: string, risk_flags: string[], citations: string[]}>}
 */
export async function generateAgentTip({
  complaintText,
  context = {},
  policies = [],
  templateVersion,
}) {
  const { safeBlock, flagged, matches } = sanitizeUserInput(complaintText);
  if (flagged) {
    logger.warn("Possible prompt injection detected in agent_tip input", {
      matches,
    });
  }

  const template = getTemplate("agent_tip", templateVersion);
  const userPrompt = template.buildUserPrompt({
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
    logger.warn("agent_tip cited a policy that was never retrieved", {
      fabricatedCitations: citationCheck.fabricatedCitations,
    });
  }

  return {
    ...result,
    _promptInjectionFlagged: flagged,
    _citationValidation: citationCheck,
  };
}
