// src/index.js
// Public API for the feature/genai-pipeline module.

export { generateCustomerReply } from "./generators/customerReply.js";
export { generateFollowUpMessage } from "./generators/followUpMessage.js";
export { generateClarificationQuestion } from "./generators/clarificationQuestion.js";
export { generateAgentTip } from "./generators/agentTip.js";

export { callAI, callAIForJSON, AIRequestError, AIOutputError } from "./aiClient.js";
export { PROMPT_TEMPLATES, getTemplate } from "./promptTemplates.js";
export { sanitizeUserInput, detectInjection } from "./promptInjectionGuard.js";
export { formatPolicyBlock, validateCitations } from "./policyContext.js";
export { config } from "./config.js";
