# Status

**Last session:** 2026-07-21 (day 7 — Action promoted everywhere, v1 frozen)
**Phase:** 2 (CI integration) — 3 of 5 items done; launch posting still on Fred

## Current state
The Action is now the headline, and it has a stable version:
- Code: https://github.com/mfmp17/shipnotes · npm: @mfmp17/shipnotes@0.1.0
- Landing page: https://mfmp17.github.io/shipnotes/ — new "Set it up once"
  section right after the hero with the copy-pasteable workflow; Action
  listed in the free-today plan; deployed and verified live.
- Launch copy (docs/launch-copy.md): HN, PH and X all pitch the Action as
  live (`uses: mfmp17/shipnotes@v1`) with our dogfood PR as proof; "coming
  next" is now the hosted changelog page.
- **v1 tag frozen.** Annotated tag; dogfood release-notes workflow triggers
  on `v*.*.*` only so the bare pointer tag doesn't open a bogus PR.
  Verified by `.github/workflows/action-smoke.yml` (manual dispatch): it
  consumes `mfmp17/shipnotes@v1` exactly like an external repo, asserts
  notes generate — run succeeded on GitHub's runners.
- 33 tests pass.

## Release procedure note (for future me)
When shipping a new release: push `vX.Y.Z` (triggers the changelog PR),
then move the pointer `git tag -fa v1 -m ... && git push -f origin v1`,
then dispatch "Action smoke test (v1)" to verify the moved pointer.

## Next single most important thing
Still: Fred posts the launch (NEEDS_INVESTOR.md, copy final in
docs/launch-copy.md — now Action-first). My next build increment: the
hosted changelog page (Phase 2 item 4) — static publish per repo, with the
CLI's JSON output as the feed; likely a `--format html` changelog page the
Action can push to GitHub Pages, so it needs no hosting from us.

## Open risks / notes
- Action CI runs are heuristic-only on our repo (no key in CI); optional
  investor ask open to add ANTHROPIC_API_KEY as a repo secret.
- Rewrite before/after on the landing page is illustrative; replace with
  real Claude output some session (key works locally).
- Backfilling notes for an *older* tag inserts at the top of CHANGELOG.md;
  harmless, human-fixable in the PR.
- Demo SVG shows an empty terminal in static rasterizers (t=0 frame); fine
  in real browsers/GitHub.
- Pricing: free always, public and private repos (investor decision
  2026-07-19). No paid tier without investor sign-off.
