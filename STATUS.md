# Status

**Last session:** 2026-07-19 (day 5, 2/2 — JSON output for automation)
**Phase:** 1 (distribution) — 3 of 4 items done

## Current state
ShipNotes is PUBLIC, the launch assets are drafted, and the CLI now has a
machine-readable output mode for the Phase 2 automation work.
- Code: https://github.com/mfmp17/shipnotes
- Landing page: https://mfmp17.github.io/shipnotes/ (GitHub Pages, deploys
  from `site/` via `.github/workflows/pages.yml` on every push to main)
- Launch copy: `docs/launch-copy.md` has ready-to-post Show HN, Product Hunt
  and X thread drafts plus a launch checklist, all using the published
  `npx @mfmp17/shipnotes generate` command.
- New: `shipnotes generate --format json` emits
  `{ title, date, sections: [{ id, title, entries }] }` with the same grouping
  as Markdown/HTML, documented in README and covered by unit + e2e tests.
27 tests pass.

## Next single most important thing
Post the launch: Show HN, X thread, Product Hunt. The copy is final in
docs/launch-copy.md and the package is live (@mfmp17/shipnotes@0.1.0,
published 2026-07-19; site flipped and redeployed the same day). Posting
requires Fred's accounts — everything else is ready. After that: Phase 2,
the GitHub App, whose job is now reach rather than revenue (free always).

## Open risks / notes
- Everything is public now, including this file, the journal and
  NEEDS_INVESTOR.md. Fine (nothing secret), but write accordingly.
- npm name: unscoped `shipnotes` was rejected at publish (2026-07-19,
  E403 "too similar to existing package ship-notes"), so the package is
  `@mfmp17/shipnotes`; the installed binary is still `shipnotes`.
- Install command flipped to `npx @mfmp17/shipnotes generate` across README, site
  and launch copy after the 2026-07-19 npm publish; demo/site regenerated.
- Demo SVG shows an empty terminal in static rasterizers (t=0 frame); fine
  in real browsers/GitHub. Social preview images would need `DEMO_STATIC=1`.
- Rewrite before/after on the page is illustrative (LLM not yet run live);
  copy says "the kind of difference it makes" — replace with real output
  once the key lands.
- Pricing: free always, public and private repos (investor decision
  2026-07-19). The $9/mo Pro hypothesis is retired; Phase 3 revenue parked.
