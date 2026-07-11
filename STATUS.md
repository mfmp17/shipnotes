# Status

**Last session:** 2026-07-12 (day 1 — CLI MVP built)
**Phase:** 0 — CLI MVP (nearly done)

## Current state
Working CLI: `shipnotes generate` reads git log between refs (auto-detects
latest tag), groups commits (conventional-commit + heuristic classification,
breaking-change detection, noise filtering), renders Markdown or standalone
HTML, with `--since-tag/--from/--to/--repo/--format/-o/--all/--no-hashes`
flags. Claude rewrite pass (`src/llm.js`, opus-4-8, structured output via
json_schema) runs when `ANTHROPIC_API_KEY` is set and degrades gracefully
when absent or on API error. 22 unit + e2e tests pass (`npm test`, offline).
Verified manually on real clones of express and expressjs/execa in both
formats. Only dependency: `@anthropic-ai/sdk`.

## Next single most important thing
When the API key lands (see NEEDS_INVESTOR), verify the LLM rewrite live on
express/execa and iterate on the prompt until output reads like a great
product changelog. If still blocked: finish Phase 0's last item (demo
recording is key-blocked too — heuristic demo possible) or start Phase 1
(landing page copy in `site/` needs no accounts).

## Open risks / notes
- LLM pass is code-complete but never run against the live API — prompt
  quality unproven. Don't publish to npm before verifying it.
- Heuristic mode lets some noise through on repos with sloppy commit style
  (seen on express: "Qs@^6.14.1", emoji-prefixed notes). That's acceptable —
  it's the free tier's pitch for the LLM mode.
- npm publish (Phase 1) needs an npm account → future NEEDS_INVESTOR entry.
