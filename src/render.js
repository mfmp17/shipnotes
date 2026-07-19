import { SECTION_TITLES } from "./group.js";

const SECTION_ORDER = ["breaking", "features", "fixes", "improvements", "internal"];

export function renderMarkdown(groups, { title, date, showHashes = true } = {}) {
  const lines = [`# ${title}`, ""];
  if (date) {
    lines.push(`_${date}_`, "");
  }

  for (const section of SECTION_ORDER) {
    const entries = groups[section] ?? [];
    if (entries.length === 0) continue;
    lines.push(`## ${SECTION_TITLES[section]}`, "");
    for (const entry of entries) {
      lines.push(showHashes ? `- ${entry.text} (\`${entry.hash}\`)` : `- ${entry.text}`);
    }
    lines.push("");
  }

  return lines.join("\n").trimEnd() + "\n";
}

export function renderJson(groups, { title, date, showHashes = true } = {}) {
  const sections = [];
  for (const section of SECTION_ORDER) {
    const entries = groups[section] ?? [];
    if (entries.length === 0) continue;
    sections.push({
      id: section,
      title: SECTION_TITLES[section],
      entries: entries.map((entry) => {
        const out = { text: entry.text };
        if (showHashes && entry.hash) out.hash = entry.hash;
        if (entry.author) out.author = entry.author;
        if (entry.date) out.date = entry.date;
        return out;
      }),
    });
  }
  return JSON.stringify({ title, date, sections }, null, 2) + "\n";
}

function escapeHtml(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderHtml(groups, { title, date, showHashes = true } = {}) {
  const parts = [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${escapeHtml(title)}</title>`,
    "<style>",
    "body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:680px;margin:3rem auto;padding:0 1rem;color:#1a1a1a;line-height:1.6}",
    "h1{font-size:1.7rem;margin-bottom:.25rem}",
    "h2{font-size:1.1rem;margin-top:2rem;border-bottom:1px solid #e5e5e5;padding-bottom:.3rem}",
    ".date{color:#777;font-size:.9rem}",
    "code{background:#f4f4f4;border-radius:4px;padding:.1em .35em;font-size:.85em;color:#666}",
    "ul{padding-left:1.2rem}",
    "li{margin:.35rem 0}",
    "</style>",
    "</head>",
    "<body>",
    `<h1>${escapeHtml(title)}</h1>`,
  ];
  if (date) parts.push(`<p class="date">${escapeHtml(date)}</p>`);

  for (const section of SECTION_ORDER) {
    const entries = groups[section] ?? [];
    if (entries.length === 0) continue;
    parts.push(`<h2>${escapeHtml(SECTION_TITLES[section])}</h2>`, "<ul>");
    for (const entry of entries) {
      const hash = showHashes ? ` <code>${escapeHtml(entry.hash)}</code>` : "";
      parts.push(`<li>${escapeHtml(entry.text)}${hash}</li>`);
    }
    parts.push("</ul>");
  }

  parts.push("</body>", "</html>");
  return parts.join("\n") + "\n";
}
