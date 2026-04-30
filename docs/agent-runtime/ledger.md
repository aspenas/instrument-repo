# Agent Ledger

Updated: 2026-04-30

Use this as the baton between Codex, Claude, and any other agent. Keep entries short, dated, and tied to artifacts.

## 2026-04-30 - Agent-runtime scaffold installed

Pattern adopted from `~/Work/builders-warehouse` (the original scaffold). The compact runtime layer separates current claims, known drift, and machine-checkable contracts from the long-form CLAUDE.md / AGENTS.md narrative.

Files added:

- `docs/agent-runtime/README.md`
- `docs/agent-runtime/current.md`
- `docs/agent-runtime/known-drift.md`
- `docs/agent-runtime/ledger.md`
- `docs/contracts/agent-runtime-files.json`
- `docs/contracts/known-drift.json`
- `scripts/validate_agent_runtime.py`
- `tests/test_agent_runtime_validator.py`

Verification:

```bash
python scripts/validate_agent_runtime.py --offline
```

Next agent should fill in `current.md` "Mission" + "Current Source-Backed Claims" with project-specific load-bearing facts and add project-specific contracts under `docs/contracts/` as they become useful. Add live-route checks via a `live-routes.json` contract when the project has a hosted demo to validate.
