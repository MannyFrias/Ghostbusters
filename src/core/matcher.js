// src/core/matcher.js
import { normalizePath } from "./normalize.js";

/**
 * @param {string} callPath
 * @param {string} routePath
 * @returns {boolean}
 */
function pathMatches(callPath, routePath) {
  const a = normalizePath(callPath).split("/").filter(Boolean);
  const b = normalizePath(routePath).split("/").filter(Boolean);

  if (a.length !== b.length) return false;
  // If either is not a string, we can't compare (shouldn't happen if normalized)
  if (typeof callPath !== "string" || typeof routePath !== "string") return false;

  for (let i = 0; i < a.length; i++) {
    const segA = a[i];
    const segB = b[i];

    // Express param segment matches anything (":id")
    if (segB.startsWith(":")) continue;

    if (segA !== segB) return false;
  }
  return true;
}

/**
 * Frontend often doesn’t know method (UNKNOWN). We treat UNKNOWN as match-any.
 * @param {import("./types.js").HttpMethod} callMethod
 * @param {import("./types.js").BackendRoute["method"]} routeMethod
 * @returns {boolean}
 */
function methodMatches(callMethod, routeMethod) {
  if (callMethod === "UNKNOWN") return true;
  return callMethod === routeMethod;
}

/**
 * Compare frontend calls to backend routes.
 * Buckets:
 * - matched: confirmed match
 * - unmatched: definitely missing backend route (should fail commit)
 * - unknown: dynamic/ambiguous (warn only)
 *
 * @param {import("./types.js").FrontendCall[]} calls
 * @param {import("./types.js").BackendRoute[]} routes
 * @returns {import("./types.js").MatchResult}
 */
export function matchRoutes(calls, routes) {
  /** @type {import("./types.js").MatchResult["matched"]} */
  const matched = [];
  /** @type {import("./types.js").FrontendCall[]} */
  const unmatched = [];
  /** @type {import("./types.js").FrontendCall[]} */
  const unknown = [];

  for (const call of calls) {
    if (call.isDynamic) {
      unknown.push(call);
      continue;
    }

    const found = routes.find((r) => {
      return methodMatches(call.method, r.method) && pathMatches(call.path, r.path);
    });

    if (found) matched.push({ call, route: found });
    else unmatched.push(call);
  }

  return { matched, unmatched, unknown };
}
