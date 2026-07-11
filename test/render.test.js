import { test } from "node:test";
import assert from "node:assert/strict";
import { renderMarkdown, renderHtml } from "../src/render.js";

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
