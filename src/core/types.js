// src/core/types.js

/**
 * @typedef {"GET"|"POST"|"PUT"|"DELETE"|"PATCH"|"UNKNOWN"} HttpMethod
 */

/**
 * Frontend API call found in client code.
 * @typedef {Object} FrontendCall
 * @property {HttpMethod} method
 * @property {string} path
 * @property {string} file
 * @property {number=} line
 * @property {boolean=} isDynamic  // true if the URL is not a plain string literal
 */

/**
 * Backend route found in server code.
 * @typedef {Object} BackendRoute
 * @property {"GET"|"POST"|"PUT"|"DELETE"|"PATCH"} method
 * @property {string} path
 * @property {string} file
 * @property {number=} line
 */

/**
 * @typedef {Object} MatchedPair
 * @property {FrontendCall} call
 * @property {BackendRoute} route
 */

/**
 * @typedef {Object} MatchResult
 * @property {MatchedPair[]} matched
 * @property {FrontendCall[]} unmatched
 * @property {FrontendCall[]} unknown
 */

/**
 * @typedef {Object} GhostbusterReport
 * @property {MatchedPair[]} matched
 * @property {FrontendCall[]} unmatched
 * @property {FrontendCall[]} unknown
 * @property {Object} stats
 * @property {number} stats.frontendCalls
 * @property {number} stats.backendRoutes
 * @property {number} stats.matched
 * @property {number} stats.unmatched
 * @property {number} stats.unknown
 */

export {};
