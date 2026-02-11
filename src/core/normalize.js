// src/core/normalize.js

/**
 * Normalize a URL path so that comparisons are consistent.
 * - ensures leading slash
 * - collapses double slashes
 * - removes trailing slash (except root "/")
 * @param {string} input
 * @returns {string}
 */
export function normalizePath(input) {
  let p = (input ?? "").trim();

  if (!p.startsWith("/")) p = "/" + p;

  // Collapse multiple slashes (// -> /)
  p = p.replace(/\/{2,}/g, "/");

  // Remove trailing slash unless it's the root "/"
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);

  return p;
}
