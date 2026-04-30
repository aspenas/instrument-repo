# Agent Runtime Layer

This folder is the compact operating truth for any agent (Codex, Claude, others) that picks up this repo. It is intentionally short — read it before changing claims, demos, or memos that touch shared state.

Files:

- `current.md` — what is currently true about this project. First-context brief.
- `known-drift.md` — items that are true and unfixed. Do not promote a drift item to a clean claim until verified.
- `ledger.md` — short, dated baton entries between agents. Append after meaningful changes.

Sibling contracts live in `../contracts/*.json` and back the validator at `../../scripts/validate_agent_runtime.py`.

## First commands

```bash
python scripts/validate_agent_runtime.py --offline   # before changing claims
python scripts/validate_agent_runtime.py --live      # before any public/demo claim, when applicable
```

The offline pass must show `0 fail`. `FLAG` items are documented drift — check `known-drift.md` before claiming a FLAG is fixed.
