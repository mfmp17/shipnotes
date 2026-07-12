# Status

**Last session:** 2026-07-12 (day 2 — demo shipped, Phase 0 complete)
**Phase:** 0 done → starting Phase 1 (distribution)

## Current state
Phase 0 (CLI MVP) is complete. `shipnotes generate` reads git log between
refs (auto-detects latest tag), groups commits (conventional-commit +
heuristic classification, breaking-change detection, noise filtering),
renders Markdown or standalone HTML. Claude rewrite pass (`src/llm.js`,
opus-4-8, structured output) runs when `ANTHROPIC_API_KEY` is set and
degrades gracefully when absent. 23 unit + e2e tests pass (`npm test`,
offline). README now embeds `docs/demo.svg` — an animated terminal demo
generated from a real CLI run by `npm run demo` (scripts/make-demo.js:
builds a fixture repo, captures real output, renders looping CSS-animated
SVG; `DEMO_STATIC=1` renders the final frame for layout checks). Visually
verified via qlmanage PNG snapshot.

## Next single most important thing
Phase 1: build the landing page in `site/` (static HTML, copy + examples,
reuse the demo SVG) — needs no accounts. After that: launch copy drafts.
npm publish waits on two investor items (API key to verify the LLM pass
live, npm account) — both flagged in NEEDS_INVESTOR.md.

## Open risks / notes
- LLM pass still never run against the live API — prompt quality unproven.
  Don't publish to npm before verifying it.
- Demo shows heuristic mode (honest: command includes --no-llm). When the
  key lands, consider a second demo frame showing the LLM rewrite.
- Heuristic mode lets some noise through on repos with sloppy commit style;
  acceptable — it's the pitch for the LLM mode.
- Demo SVG animation requires CSS support; static rasterizers at t=0 show
  an empty terminal (GitHub README plays it fine; base state is the issue
  only in thumbnails).
