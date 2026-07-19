import { test } from "node:test";
import assert from "node:assert/strict";
import { renderMarkdown, renderHtml, renderJson } from "../src/render.js";

const groups = {
  breaking: [],
  features: [{ text: "Add CSV export", hash: "abc1234" }],
  fixes: [{ text: "Handle <weird> & symbols", hash: "def5678" }],
  improvements: [],
  internal: [],
};

test("markdown has title, sections, entries, hashes", () => {
  const md = renderMarkdown(groups, { title: "myapp — release notes", date: "2026-07-12" });
  assert.match(md, /^# myapp — release notes/);
  assert.match(md, /## Features/);
  assert.match(md, /- Add CSV export \(`abc1234`\)/);
  assert.match(md, /## Fixes/);
  assert.doesNotMatch(md, /## Improvements/);
});

test("markdown can omit hashes", () => {
  const md = renderMarkdown(groups, { title: "t", showHashes: false });
  assert.match(md, /- Add CSV export$/m);
  assert.doesNotMatch(md, /abc1234/);
});

test("html escapes entry text", () => {
  const html = renderHtml(groups, { title: "t <script>", date: "2026-07-12" });
  assert.match(html, /Handle &lt;weird&gt; &amp; symbols/);
  assert.match(html, /<title>t &lt;script&gt;<\/title>/);
  assert.doesNotMatch(html, /<script>/);
});

test("html lists sections in order and skips empty ones", () => {
  const html = renderHtml(groups, { title: "t" });
  const features = html.indexOf("Features");
  const fixes = html.indexOf("Fixes");
  assert.ok(features !== -1 && fixes !== -1 && features < fixes);
  assert.doesNotMatch(html, /Improvements/);
});

test("json emits machine-readable sections", () => {
  const parsed = JSON.parse(renderJson(groups, { title: "t", date: "2026-07-12" }));
  assert.equal(parsed.title, "t");
  assert.equal(parsed.date, "2026-07-12");
  assert.deepEqual(parsed.sections.map((s) => s.id), ["features", "fixes"]);
  assert.equal(parsed.sections[0].title, "Features");
  assert.equal(parsed.sections[0].entries[0].text, "Add CSV export");
  assert.equal(parsed.sections[0].entries[0].hash, "abc1234");
});

test("json respects --no-hashes", () => {
  const parsed = JSON.parse(renderJson(groups, { title: "t", showHashes: false }));
  assert.equal(parsed.sections[0].entries[0].hash, undefined);
});
