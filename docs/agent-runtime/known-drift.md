# Known Drift

Updated: 2026-04-30

This page keeps Codex and Claude from rediscovering the same sharp edges. A drift item can be true and still be unfixed. Do not promote a drift item into a clean demo claim until the validator or a direct source check confirms it.

(No drift items recorded yet — add entries here as they surface, and mirror their ids in `../contracts/known-drift.json` so the validator can check coherence.)

## Pattern

Each entry should follow:

```
## drift-id-here

Status: open | closed YYYY-MM-DD

Short prose: what the drift is, where it shows up, and how to verify whether it is still true. If closed, include the closure evidence (commit, validator output, or source path).
```
