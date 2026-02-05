// src/core/format.js

/**
 * Format the Ghostbuster report into readable terminal output.
 *
 * @param {import("./types.js").GhostbusterReport} report
 * @returns {string}
 */
export function formatReport(report) {
  /** @type {string[]} */
  const lines = [];

  lines.push("Ghostbuster Report");
  lines.push(`- Frontend calls: ${report.stats.frontendCalls}`);
  lines.push(`- Backend routes: ${report.stats.backendRoutes}`);
  lines.push(`- Matched: ${report.stats.matched}`);
  lines.push(`- Unmatched: ${report.stats.unmatched}`);
  lines.push(`- Unknown: ${report.stats.unknown}`);
  lines.push("");

  if (report.unmatched.length) {
    lines.push("❌ Unmatched calls:");
    for (const c of report.unmatched) {
      const loc = c.line ? `:${c.line}` : "";
      lines.push(`- ${c.method} ${c.path}  (${c.file}${loc})`);
    }
    lines.push("");
  }

  if (report.unknown.length) {
    lines.push("⚠️ Unknown (dynamic/ambiguous) calls:");
    for (const c of report.unknown) {
      const loc = c.line ? `:${c.line}` : "";
      lines.push(`- ${c.method} ${c.path}  (${c.file}${loc})`);
    }
    lines.push("");
  }

  if (!report.unmatched.length) lines.push("✅ No ghost routes found.");

  return lines.join("\n");
}
