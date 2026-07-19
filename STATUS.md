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
  and X thread drafts plus a launch checklist. They use the verified
  `npx github:mfmp17/shipnotes generate` command and include the swap note for
  after npm publish.
- New: `shipnotes generate --format json` emits
  `{ title, date, sections: [{ id, title, entries }] }` with the same grouping
  as Markdown/HTML, documented in README and covered by unit + e2e tests.
27 tests pass.

## Next single most important thing
Verify the LLM rewrite live with an Anthropic API key, then publish to npm.
Both are investor-blocked and are the only remaining Phase 1 items; once the
npm package is live, swap the install command in README/site/launch copy,
regenerate demo + site, push, and launch.

## Open risks / notes
- Everything is public now, including this file, the journal and
  NEEDS_INVESTOR.md. Fine (nothing secret), but write accordingly.
- LLM pass still never run against the live API — prompt quality unproven.
  Don't publish to npm before verifying it.
- After npm publish: flip install command back to `npx shipnotes generate`
  in site/index.html + README + docs/launch-copy.md, regenerate demo/site,
  push (Pages redeploys automatically).
- Demo SVG shows an empty terminal in static rasterizers (t=0 frame); fine
  in real browsers/GitHub. Social preview images would need `DEMO_STATIC=1`.
- Rewrite before/after on the page is illustrative (LLM not yet run live);
  copy says "the kind of difference it makes" — replace with real output
  once the key lands.
- Pricing on page is the v1 hypothesis ($9/mo per private repo).
