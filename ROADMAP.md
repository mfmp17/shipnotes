# Roadmap

## Phase 0 — CLI MVP (prove the core value)
- [x] `shipnotes` CLI (Node, no heavy deps): reads git log between two refs
- [x] Heuristic grouping (conventional commits → Features/Fixes/Improvements)
- [x] LLM rewrite pass (Claude API, `ANTHROPIC_API_KEY` from env, optional)
      — code complete + graceful fallback verified; live rewrite unverified
      until we have an API key (see NEEDS_INVESTOR)
- [x] Markdown + HTML output, `--since-tag`, `--output` flags
- [x] Tests against 2–3 real public repos; README with demo GIF/asciinema
      — 23 unit/e2e tests pass; verified manually on express + execa;
      README embeds an animated SVG terminal demo generated from a real
      CLI run (`npm run demo`, no capture tools or accounts needed)

## Phase 1 — Distribution of the free tool
- [ ] Publish to npm as `shipnotes` (flag npm account in NEEDS_INVESTOR.md)
- [x] Landing page (static, in `site/`) with copy + examples
      — dark single-page site; `npm run site` regenerates `site/example.html`
      from a real CLI run and syncs the demo SVG
- [x] Public GitHub repo + landing page DEPLOYED (2026-07-14)
      — https://github.com/mfmp17/shipnotes, Pages deploy via Actions on
      every push; site/README advertise `npx github:mfmp17/shipnotes
      generate` (verified working) until the npm publish lands
- [ ] Launch copy drafts: Hacker News "Show HN", Product Hunt, X thread

## Phase 2 — GitHub App (the retention hook)
- [ ] GitHub App that opens a release-notes PR on each new tag/release
- [ ] Hosted changelog page per repo (Next.js or plain static publish)
- [ ] App registration + hosting → NEEDS_INVESTOR.md when ready

## Phase 3 — Revenue
- [ ] Stripe checkout, $9/mo per private repo (Stripe account → investor)
- [ ] Free/paid gating, onboarding emails, docs

## Principles
Ship the smallest thing that a stranger could use. Every phase ends with
something publishable, not something "almost ready".
