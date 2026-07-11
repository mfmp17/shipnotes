# Status

**Last session:** 2026-07-12 (day 0 — founding)
**Phase:** 0 — CLI MVP

## Current state
Venture scaffolded: charter, roadmap, daily automation in place. No product
code yet.

## Next single most important thing
Build the CLI skeleton: `shipnotes generate --since-tag <tag>` that reads
`git log` from the current repo and prints grouped raw commits (no LLM pass
yet). Prove the parse→group pipeline on a real public repo clone.

## Open risks / notes
- Crowded space (github-changelog-generator, release-drafter). Differentiator
  is customer-facing language quality + hosted page, not commit dumping.
- Keep the LLM pass optional so the free CLI works with zero setup.
