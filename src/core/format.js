// src/core/format.ts
import { GhostbusterReport } from "./types";

export function formatReport(report: GhostbusterReport): string {
  const lines: string[] = [];
  lines.push(`Ghostbuster Report`);
  lines.push(`- Frontend calls: ${report.stats.frontendCalls}`);
  lines.push(`- Backend routes: ${report.stats.backendRoutes}`);
  lines.push(`- Matched: ${report.stats.matched}`);
  lines.push(`- Unmatched: ${report.stats.unmatched}`);
  lines.push(`- Unknown: ${report.stats.unknown}`);
  lines.push("");

  if (report.unmatched.length) {
    lines.push(" Unmatched calls:");
    for (const c of report.unmatched) {
      const loc = c.line ? `:${c.line}` : "";
      lines.push(`- ${c.method} ${c.path}  (${c.file}${loc})`);
    }
    lines.push("");
  }

  if (report.unknown.length) {
    lines.push(" Unknown (dynamic/ambiguous) calls:");
    for (const c of report.unknown) {
      const loc = c.line ? `:${c.line}` : "";
      lines.push(`- ${c.method} ${c.path}  (${c.file}${loc})`);
    }
    lines.push("");
  }

  if (!report.unmatched.length) lines.push(" No ghost routes found.");

  return lines.join("\n");
}
