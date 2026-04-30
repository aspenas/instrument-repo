# Current Agent Brief

Updated: 2026-04-30

Read this before long handoffs. This is the compact operating truth for Codex, Claude, and any other agent picking up this repo.

## Mission

(instrument-repo — fill in the load-bearing thing this repo currently exists to do.)

## Role Split

Codex owns verifiable loops:

- route checks, cache checks, browser checks, tests, JSON contracts, docs drift, and small scoped code fixes
- keeping source-backed claims connected to files and repeatable commands
- surfacing failures early instead of smoothing them into narrative

Claude owns high-context synthesis:

- memos, strategy framing, transcript synthesis, and long-form handoffs
- interpretation tasks where human judgment is still needed
- turning verified facts into clear executive language

Both agents write claims using these labels:

- `source-backed`: directly supported by a repo artifact, test, endpoint, or command
- `inferred`: plausible from source-backed facts but not directly proven
- `demo-only`: suitable for the current hosted demo, not implementation-grade

## Current Source-Backed Claims

(Project-specific — list the small set of facts the current demo or hand-off depends on. Anything that lands here should be machine-checkable via the validator or a one-line shell command.)

## Current Known Drift

Check `known-drift.md` before changing claims.

## First Commands

```bash
python scripts/validate_agent_runtime.py --offline
```

The offline validator may return `FLAG` items for known drift. It should not return `FAIL` unless a source-backed contract has broken.
