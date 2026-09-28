// src/policyContext.js
//
// Formats retrieved policy text for inclusion in a prompt, and validates
// that any citations the model returns actually correspond to policy
// chunks that were retrieved — catching fabricated/hallucinated citations.
//
// Expected shape of a retrieved policy chunk (structured, not plain text):
//   {
//     source_id: "POL-REFUND-003",
//     title: "Refund Processing Policy",
//     section: "3.2 Standard Timeline",
//     last_updated: "2026-06-01",
//     text: "Refunds are processed within 5-7 business days..."
//   }
// This is deliberately structured rather than a plain concatenated blob so
// that (a) the model can cite which specific policy backs a claim, (b) we
// can trace a bad answer back to a source, and (c) we can flag stale
// policies. See feature/genai-pipeline README for the full rationale.

const POLICY_DELIMITER_OPEN = "<<<POLICY_CONTEXT>>>";
const POLICY_DELIMITER_CLOSE = "<<<END_POLICY_CONTEXT>>>";

export const POLICY_CONTEXT_CLAUSE = `
Policy grounding rule: Only state policy facts (timelines, eligibility,
required documentation, coverage, fees, etc.) that appear in the
${POLICY_DELIMITER_OPEN} / ${POLICY_DELIMITER_CLOSE} block below. Never
invent or assume a policy detail that isn't there. Whenever your answer
relies on a fact from that block, add its "source_id" to the "citations"
array in your JSON output. If no policy context is provided, or none of it
is relevant, return an empty "citations" array and avoid stating specific
policy facts — say the team will confirm details instead of guessing.
`.trim();

/**
 * Formats an array of retrieved policy chunks into a delimited block for
 * inclusion in a prompt.
 * @param {Array<object>} [policies]
 * @returns {string}
 */
export function formatPolicyBlock(policies = []) {
  if (!policies || policies.length === 0) {
    return `${POLICY_DELIMITER_OPEN}\n(No policy context retrieved for this request.)\n${POLICY_DELIMITER_CLOSE}`;
  }

  const entries = policies.map((p, i) => {
    const {
      source_id = `UNKNOWN-${i}`,
      title = "Untitled policy",
      section = "",
      last_updated = "unknown",
      text = "",
    } = p;
    return [
      `[${i + 1}] source_id: ${source_id}`,
      `title: ${title}`,
      section ? `section: ${section}` : null,
      `last_updated: ${last_updated}`,
      `text: ${text}`,
    ]
      .filter(Boolean)
      .join("\n");
  });

  return [POLICY_DELIMITER_OPEN, ...entries, POLICY_DELIMITER_CLOSE].join("\n\n");
}

/**
 * Validates citations the model claims it used against the policies that
 * were actually retrieved/provided. Flags fabricated citations (IDs that
 * don't exist in the retrieved set) and stale ones (older than threshold).
 *
 * @param {string[]} citations - source_ids the model says it used
 * @param {Array<object>} policies - the policies actually provided to it
 * @param {object} [opts]
 * @param {number} [opts.staleAfterDays=365]
 * @returns {{
 *   valid: boolean,
 *   validCitations: string[],
 *   fabricatedCitations: string[],
 *   staleCitations: string[]
 * }}
 */
export function validateCitations(
  citations = [],
  policies = [],
  { staleAfterDays = 365 } = {}
) {
  const byId = new Map(policies.map((p) => [p.source_id, p]));
  const validCitations = [];
  const fabricatedCitations = [];
  const staleCitations = [];
  const now = Date.now();

  for (const id of citations || []) {
    const policy = byId.get(id);
    if (!policy) {
      fabricatedCitations.push(id);
      continue;
    }
    validCitations.push(id);
    if (policy.last_updated) {
      const updated = new Date(policy.last_updated).getTime();
      if (Number.isFinite(updated)) {
        const ageDays = (now - updated) / (1000 * 60 * 60 * 24);
        if (ageDays > staleAfterDays) staleCitations.push(id);
      }
    }
  }

  return {
    valid: fabricatedCitations.length === 0,
    validCitations,
    fabricatedCitations,
    staleCitations,
  };
}
