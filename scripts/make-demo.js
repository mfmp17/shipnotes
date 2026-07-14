#!/usr/bin/env node
// Generates docs/demo.svg — an animated terminal recording of a real
// `shipnotes generate` run. No screen-capture tools, no network, no API key:
// it builds a fixture repo, captures the CLI's actual output, and renders the
// session as a looping CSS-animated SVG that GitHub plays inline.

import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildFixtureRepo } from "./fixture-repo.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const BIN = join(root, "bin", "shipnotes.js");
const TMP = join(root, ".demo-tmp");
const FIXTURE = join(TMP, "acme-app"); // repo name shows up in the notes title
const OUT = process.argv[2] ?? join(root, "docs", "demo.svg");
// DEMO_STATIC=1 renders the final frame with no animation (layout preview).
const STATIC = process.env.DEMO_STATIC === "1";

// --- 1. Build a realistic fixture repo --------------------------------------

buildFixtureRepo(FIXTURE);

// --- 2. Run the real CLI, capturing stdout and stderr -----------------------

const run = spawnSync(
  process.execPath,
  [BIN, "generate", "--repo", FIXTURE, "--no-llm", "--no-hashes"],
  { encoding: "utf8", env: { ...process.env, ANTHROPIC_API_KEY: "" } },
);
rmSync(TMP, { recursive: true, force: true });
if (run.status !== 0) {
  console.error(run.stderr || run.stdout);
  throw new Error(`shipnotes exited with ${run.status}`);
}

const stderrLines = run.stderr.replace(/\n+$/, "").split("\n");
const stdoutLines = run.stdout.replace(/\n+$/, "").split("\n");

// --- 3. Compose the terminal session ----------------------------------------

const COMMAND = "shipnotes generate --no-llm --no-hashes";

const C = {
  bg: "#0d1117",
  chrome: "#161b22",
  border: "#30363d",
  fg: "#e6edf3",
  dim: "#8b949e",
  faint: "#484f58",
  green: "#3fb950",
  blue: "#79c0ff",
  orange: "#ffa657",
};

// Each row: { spans: [{ text, color, bold?, italic? }], t: seconds it appears }
const rows = [];
let t = 0.6;

// Typed command: one span per character so it "types".
const promptRow = {
  spans: [{ text: "$ ", color: C.green, bold: true, t: 0.2 }],
  typed: true,
};
for (const ch of COMMAND) {
  t += 0.035;
  promptRow.spans.push({ text: ch, color: C.fg, t });
}
rows.push(promptRow);

t += 0.5;
for (const line of stderrLines) {
  rows.push({ spans: [{ text: line, color: C.dim, italic: true, t }] });
  t += 0.35;
}
rows.push({ spans: [{ text: "", color: C.fg, t }] });

t += 0.3;
for (const line of stdoutLines) {
  rows.push({ spans: [styleMarkdownLine(line, t)] });
  t += 0.12;
}
const HOLD = 5; // seconds the finished screen stays before the loop restarts
const TOTAL = t + HOLD;

function styleMarkdownLine(line, at) {
  if (line.startsWith("# ")) return { text: line, color: C.blue, bold: true, t: at };
  if (line.startsWith("## ")) return { text: line, color: C.orange, bold: true, t: at };
  if (line.startsWith("_")) return { text: line, color: C.dim, italic: true, t: at };
  return { text: line, color: C.fg, t: at };
}

// --- 4. Render the SVG -------------------------------------------------------

const FONT = "13px";
const CHAR_W = 7.83; // Menlo/SF Mono at 13px
const LINE_H = 20;
const PAD = 18;
const BAR_H = 34;

const cols = Math.max(
  ...rows.map((r) => r.spans.reduce((n, s) => n + s.text.length, 0)),
  COMMAND.length + 2,
);
const W = Math.ceil(cols * CHAR_W + PAD * 2);
const H = BAR_H + rows.length * LINE_H + PAD * 2;

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// One keyframes rule per distinct start time: hidden until its offset,
// visible until 100%, then the infinite loop rewinds everything at once.
const times = [...new Set(rows.flatMap((r) => r.spans.map((s) => s.t)))].sort(
  (a, b) => a - b,
);
const cls = new Map(times.map((time, i) => [time, `a${i}`]));
const css = [
  `text { font-family: "SF Mono", SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; font-size: ${FONT}; }`,
  ...(STATIC ? [] : times).map((time) => {
    const p = Math.max(((time / TOTAL) * 100), 0.001).toFixed(3);
    const before = Math.max(p - 0.001, 0).toFixed(3);
    return (
      `.${cls.get(time)} { animation: k${cls.get(time)} ${TOTAL.toFixed(2)}s step-end infinite; }\n` +
      `@keyframes k${cls.get(time)} { 0% { opacity: 0; } ${before}% { opacity: 0; } ${p}% { opacity: 1; } 100% { opacity: 1; } }`
    );
  }),
].join("\n");

let body = "";
rows.forEach((row, i) => {
  const y = BAR_H + PAD + (i + 0.75) * LINE_H;
  let x = PAD;
  for (const span of row.spans) {
    if (!span.text) continue;
    const style = [
      span.bold ? "font-weight:600" : "",
      span.italic ? "font-style:italic" : "",
    ]
      .filter(Boolean)
      .join(";");
    body +=
      `<text x="${x.toFixed(2)}" y="${y.toFixed(2)}" fill="${span.color}" ` +
      `class="${cls.get(span.t)}"${style ? ` style="${style}"` : ""} xml:space="preserve">` +
      `${esc(span.text)}</text>\n`;
    x += span.text.length * CHAR_W;
  }
});

// Blinking cursor after the typed command.
const cursorX = PAD + (COMMAND.length + 2) * CHAR_W + 2;
const cursorY = BAR_H + PAD + 0.75 * LINE_H;
body +=
  `<rect x="${cursorX.toFixed(2)}" y="${(cursorY - 11).toFixed(2)}" width="7" height="14" fill="${C.green}">` +
  `<animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite"/></rect>\n`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Terminal recording: shipnotes generate turning git commits into grouped release notes">
<style>${css}</style>
<rect width="${W}" height="${H}" rx="10" fill="${C.bg}" stroke="${C.border}"/>
<path d="M0 10 a10 10 0 0 1 10 -10 h${W - 20} a10 10 0 0 1 10 10 v${BAR_H - 10} h-${W} z" fill="${C.chrome}"/>
<circle cx="20" cy="${BAR_H / 2}" r="5.5" fill="#ff5f56"/>
<circle cx="40" cy="${BAR_H / 2}" r="5.5" fill="#ffbd2e"/>
<circle cx="60" cy="${BAR_H / 2}" r="5.5" fill="#27c93f"/>
<text x="${W / 2}" y="${BAR_H / 2 + 4.5}" fill="${C.dim}" text-anchor="middle">shipnotes — demo</text>
${body}</svg>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, svg);
console.log(
  `wrote ${OUT} (${rows.length} rows, ${(TOTAL).toFixed(1)}s loop, ${W}x${H})`,
);
