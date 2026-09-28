// src/logger.js
// Minimal structured logger. Swap this out for the team's shared logger
// (winston/pino/etc.) later without touching the rest of the pipeline —
// every other file only calls logger.info/warn/error.

function ts() {
  return new Date().toISOString();
}

export const logger = {
  info: (msg, meta = {}) =>
    console.log(`[genai-pipeline] ${ts()} INFO  ${msg}`, meta),
  warn: (msg, meta = {}) =>
    console.warn(`[genai-pipeline] ${ts()} WARN  ${msg}`, meta),
  error: (msg, meta = {}) =>
    console.error(`[genai-pipeline] ${ts()} ERROR ${msg}`, meta),
};
