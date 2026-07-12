import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(here, "..", "scripts", "make-demo.js");

test("make-demo.js produces an animated SVG of a real CLI run", () => {
  const dir = mkdtempSync(join(tmpdir(), "shipnotes-demo-"));
  const out = join(dir, "demo.svg");
  try {
    execFileSync(process.execPath, [SCRIPT, out], {
      encoding: "utf8",
      env: { ...process.env, ANTHROPIC_API_KEY: "" },
    });
    const svg = readFileSync(out, "utf8");
    assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    // Real CLI output made it into the recording (the typed command is split
    // into per-character elements, so match whole output lines instead)
    assert.match(svg, /shipnotes — demo/);
    assert.match(svg, /since latest tag v1\.4\.0/);
    assert.match(svg, /## Breaking Changes/);
    assert.match(svg, /Remove the legacy v1 API/);
    assert.match(svg, /## Features/);
    // It animates and loops
    assert.match(svg, /@keyframes/);
    assert.match(svg, /infinite/);
    // No unescaped ampersands/brackets that would break XML
    assert.doesNotMatch(svg, /&(?!amp;|lt;|gt;|quot;|apos;|#)/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
