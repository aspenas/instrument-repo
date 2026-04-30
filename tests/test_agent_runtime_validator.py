"""Agent-runtime contract validator tests.

Guards the offline path only: no public tunnel or browser state is
required for CI-style checks.
"""

from __future__ import annotations

import importlib.util
import json
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
VALIDATOR = REPO / "scripts" / "validate_agent_runtime.py"


def _load_validator():
    assert VALIDATOR.is_file(), f"missing validator script at {VALIDATOR}"
    spec = importlib.util.spec_from_file_location("validate_agent_runtime", VALIDATOR)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    # Register in sys.modules before exec so @dataclass can resolve
    # the module via cls.__module__ during class creation.
    sys.modules[spec.name] = module
    try:
        spec.loader.exec_module(module)
    except Exception:
        sys.modules.pop(spec.name, None)
        raise
    return module


def test_offline_agent_runtime_contract_has_no_failures() -> None:
    module = _load_validator()
    results = module.run_checks(REPO, live=False)
    failures = [r for r in results if r.status == "FAIL"]
    assert not failures, "\n".join(f"{r.check}: {r.evidence}" for r in failures)
    checks = {r.check for r in results}
    assert "files.required_paths" in checks
    assert "runtime.current_doc" in checks
    assert "runtime.known_drift" in checks


def test_validator_json_cli_output_is_machine_readable() -> None:
    completed = subprocess.run(
        [sys.executable, str(VALIDATOR), "--offline", "--json"],
        cwd=REPO,
        text=True,
        capture_output=True,
        check=True,
    )
    payload = json.loads(completed.stdout)
    assert payload["summary"]["fail"] == 0
    assert payload["summary"]["total"] >= 3
    assert any(item["check"] == "files.required_paths" for item in payload["results"])
