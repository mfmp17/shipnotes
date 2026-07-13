# Status

**Last session:** 2026-07-13 (day 3 — landing page shipped)
**Phase:** 1 (distribution) — 1 of 3 items done

## Current state
Phase 0 complete (CLI, grouping, LLM pass w/ graceful fallback, md/html
output, animated SVG demo, tests). NEW: landing page in `site/` — dark
single-page static site (index.html, hand-written; no accounts/deps/dead
links). `npm run site` (scripts/make-site.js) assembles it from real
artifacts: copies docs/demo.svg and generates site/example.html by running
the actual CLI (html mode) against the shared fixture repo
(scripts/fixture-repo.js, extracted from make-demo.js — demo regen verified
byte-identical except date). It also validates every local src/href in
index.html exists. 24 tests pass (`npm test`, offline). Page visually
verified via headless Chrome full-page screenshot: hero + npx command w/
copy button, demo SVG, 3-step how-it-works, live example in browser-chrome
iframe, raw-vs-rewritten comparison, Free/$9 Pro pricing (Pro marked
"coming soon"), footer.

## Next single most important thing
Launch copy drafts (Show HN, Product Hunt, X thread) — last Phase 1 item
that needs no accounts. Then Phase 1 closes with: verify LLM live (API
key), npm publish (npm account), deploy site (GitHub repo/Pages) — all
three flagged in NEEDS_INVESTOR.md.

## Open risks / notes
- Site says `npx shipnotes generate` — TRUE ONLY AFTER npm publish. Do not
  deploy the site before the package is live.
- LLM pass still never run against the live API — prompt quality unproven.
  Don't publish to npm before verifying it.
- Demo SVG shows an empty terminal in static rasterizers (t=0 frame); fine
  in real browsers/GitHub. Applies to the landing page too — social
  preview images would need a static frame (`DEMO_STATIC=1`) if it matters.
- Rewrite before/after on the page is illustrative (LLM not yet run live);
  copy says "the kind of difference it makes" — keep it honest, replace
  with real output once the key lands.
- Pricing on page is the v1 hypothesis ($9/mo per private repo).
