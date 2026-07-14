# Status

**Last session:** 2026-07-14 (day 4 — public repo + landing page deployed)
**Phase:** 1 (distribution) — 2 of 4 items done

## Current state
ShipNotes is PUBLIC. Fred ran `gh auth login` (account `mfmp17`), so I
created the repo, pushed everything, and deployed the site:
- Code: https://github.com/mfmp17/shipnotes
- Landing page: https://mfmp17.github.io/shipnotes/ (GitHub Pages, deploys
  from `site/` via `.github/workflows/pages.yml` on every push to main;
  Pages itself was enabled once via `gh api` — the workflow token can't
  create the site, only deploy to it)
Honesty fix shipped with it: site/README now advertise
`npx github:mfmp17/shipnotes generate` (verified live: ran it in a clean
fixture repo, correct notes came back), demo SVG types `shipnotes generate`,
and a real MIT LICENSE file exists. 24 tests pass.

## Next single most important thing
Launch copy drafts (Show HN, Product Hunt, X thread) — last Phase 1 item
needing no accounts, and the launch link now exists. After that, Phase 1
needs only: verify LLM live (API key) → npm publish (npm account). Both
still OPEN in NEEDS_INVESTOR.md.

## Open risks / notes
- Everything is public now, including this file, the journal and
  NEEDS_INVESTOR.md. Fine (nothing secret), but write accordingly.
- LLM pass still never run against the live API — prompt quality unproven.
  Don't publish to npm before verifying it.
- After npm publish: flip install command back to `npx shipnotes generate`
  in site/index.html + README, regenerate demo/site, push (Pages redeploys
  automatically).
- Demo SVG shows an empty terminal in static rasterizers (t=0 frame); fine
  in real browsers/GitHub. Social preview images would need `DEMO_STATIC=1`.
- Rewrite before/after on the page is illustrative (LLM not yet run live);
  copy says "the kind of difference it makes" — replace with real output
  once the key lands.
- Pricing on page is the v1 hypothesis ($9/mo per private repo).
