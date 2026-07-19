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
Publish to npm, then launch. Both former investor blockers cleared on
2026-07-19: the LLM rewrite ran live against a real repo (claude-opus-4-8,
key in macOS Keychain, loaded by scripts/daily-run.sh) and `npm login` is
done as `mfmp17`. Once the npm package is live, swap the install command in
README/site/launch copy, regenerate demo + site, push, and post.

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
- Pricing on page is the v1 hypothesis ($9/mo per private repo).
