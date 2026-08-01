import { readFileSync } from "node:fs";
import { join } from "node:path";
import { marked } from "marked";

// Legal/support documents are maintained as verbatim Markdown in
// src/content/legal and rendered to HTML at build time. Do not edit the copy
// here — update the source .md files instead (see that folder's README note).
export type LegalSlug = "privacy" | "terms" | "support";

export function renderLegalDoc(slug: LegalSlug): string {
  const source = readFileSync(
    join(process.cwd(), "src", "content", "legal", `${slug}.md`),
    "utf8"
  );
  // GFM (tables, etc.) is on by default in marked.
  const html = marked.parse(source, { async: false });
  // The source docs cross-link with absolute production URLs
  // (https://transcribatron.ca/privacy). Rewrite same-origin links to
  // root-relative in the rendered output so they resolve in every environment
  // (localhost, preview, production) instead of jumping to the live domain.
  // The source .md files are left verbatim.
  return html.replace(
    /href="https:\/\/transcribatron\.ca(\/[^"]*)?"/g,
    (_match, path) => `href="${path || "/"}"`
  );
}
