# Current Agent Brief

Updated: 2026-05-03

Read this before long handoffs. This is the compact operating truth for Codex, Claude, and any other agent picking up this repo.

## Mission

The Perch brand and instrument-architecture site. Brand site for Perch — the first instrument in the Wake platform — plus the architecture page that explains how an instrument fits into the broader Wake / Candlefish substrate. Built with React + Vite + Cloudflare Workers; static assets plus a Worker handler for any dynamic routes.

Surface: `instruments.highline.work`. Brand assets live under `assets/`; Worker source under `workers/instrument-architecture/`. The architecture page should stay in sync with `architecture.highline.work` chapters in Wake (`~/Work/wake/architecture/`) — when those move, this page's references should follow.

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

- Stack: React + Vite + Cloudflare Workers.
- Worker source: `workers/instrument-architecture/`.
- Deploy: `wrangler deploy` (Cloudflare).
- Surface: `instruments.highline.work`.
- Brand assets: `assets/` (including the v11 4K reveal video bundle).

## Current Known Drift

Check `known-drift.md` before changing claims.

## First Commands

```bash
python scripts/validate_agent_runtime.py --offline
```

The offline validator may return `FLAG` items for known drift. It should not return `FAIL` unless a source-backed contract has broken.
