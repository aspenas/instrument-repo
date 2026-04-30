#!/usr/bin/env python3
"""Validate the compact agent-runtime contract for this repo.

The offline checks are stdlib-only and network-free so any agent
(Codex, Claude, or other) can run them before changing demo or memo
claims. Project-specific contracts (live routes, data-shape claims,
cache policy, etc.) can be added as additional `_check_*` helpers.
"""

from __future__ import annotations

import argparse
import json
import subprocess
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any

PASS = "PASS"
FLAG = "FLAG"
FAIL = "FAIL"


@dataclass(frozen=True)
class CheckResult:
    status: str
    check: str
    evidence: str


def _load_json(path: Path) -> Any:
    with path.open(encoding="utf-8") as file:
        return json.load(file)


def _result(status: str, check: str, evidence: str) -> CheckResult:
    return CheckResult(status=status, check=check, evidence=evidence)


def _pass(check: str, evidence: str) -> CheckResult:
    return _result(PASS, check, evidence)


def _flag(check: str, evidence: str) -> CheckResult:
    return _result(FLAG, check, evidence)


def _fail(check: str, evidence: str) -> CheckResult:
    return _result(FAIL, check, evidence)


def _summarize_counts(results: list[CheckResult]) -> dict[str, int]:
    return {
        "pass": sum(r.status == PASS for r in results),
        "flag": sum(r.status == FLAG for r in results),
        "fail": sum(r.status == FAIL for r in results),
        "total": len(results),
    }


def _check_required_files(repo: Path) -> CheckResult:
    contract = _load_json(repo / "docs/contracts/agent-runtime-files.json")
    missing_dirs = [p for p in contract["required_dirs"] if not (repo / p).is_dir()]
    missing_paths = [p for p in contract["required_paths"] if not (repo / p).exists()]
    if missing_dirs or missing_paths:
        evidence = {"missing_dirs": missing_dirs, "missing_paths": missing_paths}
        return _fail("files.required_paths", json.dumps(evidence, sort_keys=True))
    return _pass(
        "files.required_paths",
        f"{len(contract['required_dirs'])} dirs and {len(contract['required_paths'])} paths present",
    )


def _check_current_doc(repo: Path) -> CheckResult:
    path = repo / "docs/agent-runtime/current.md"
    text = path.read_text(encoding="utf-8")
    required_terms = [
        "Codex",
        "Claude",
        "source-backed",
        "inferred",
        "demo-only",
        "validate_agent_runtime.py",
    ]
    missing = [term for term in required_terms if term not in text]
    line_count = len(text.splitlines())
    if missing:
        return _fail("runtime.current_doc", f"missing terms: {', '.join(missing)}")
    if line_count > 200:
        return _fail("runtime.current_doc", f"too long for first-context brief: {line_count} lines")
    return _pass("runtime.current_doc", f"{line_count} lines with claim labels and role split")


def _check_known_drift_doc(repo: Path) -> CheckResult:
    contract = _load_json(repo / "docs/contracts/known-drift.json")
    text = (repo / "docs/agent-runtime/known-drift.md").read_text(encoding="utf-8")
    missing = [item["id"] for item in contract.get("items", []) if item["id"] not in text]
    if missing:
        return _fail("runtime.known_drift", f"missing drift ids: {', '.join(missing)}")
    return _pass(
        "runtime.known_drift",
        f"{len(contract.get('items', []))} drift ids documented",
    )


def _check_git_worktree(repo: Path) -> CheckResult:
    try:
        completed = subprocess.run(
            ["git", "status", "--short"],
            cwd=repo,
            check=True,
            capture_output=True,
            text=True,
        )
    except (subprocess.CalledProcessError, FileNotFoundError) as exc:
        return _flag("git.working_tree", f"git status unavailable: {exc}")
    lines = [line for line in completed.stdout.splitlines() if line.strip()]
    if lines:
        return _flag("git.working_tree", f"{len(lines)} dirty paths")
    return _pass("git.working_tree", "clean")


def run_checks(repo: Path | str, live: bool = False) -> list[CheckResult]:
    repo = Path(repo)
    results: list[CheckResult] = [
        _check_required_files(repo),
        _check_current_doc(repo),
        _check_known_drift_doc(repo),
        _check_git_worktree(repo),
    ]
    # Project-specific live route checks can be added here when the repo
    # has a hosted surface. See ~/Work/builders-warehouse for a worked
    # example with a live-routes.json contract and known-drift downgrade.
    if live:
        results.append(
            _flag(
                "live.not_configured",
                "no live-routes contract for this repo; add docs/contracts/live-routes.json + a _check_live_route loop to enable",
            )
        )
    return results


def _format_text(results: list[CheckResult]) -> str:
    lines = [f"{r.status:<4} {r.check}: {r.evidence}" for r in results]
    summary = _summarize_counts(results)
    lines.append(
        "summary: "
        f"{summary['pass']} pass, {summary['flag']} flag, {summary['fail']} fail, "
        f"{summary['total']} total"
    )
    return "\n".join(lines)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--offline", action="store_true", help="run only local checks")
    parser.add_argument("--live", action="store_true", help="include public route checks")
    parser.add_argument("--json", action="store_true", help="emit machine-readable JSON")
    parser.add_argument(
        "--strict-flags",
        action="store_true",
        help="return non-zero when FLAG items are present",
    )
    args = parser.parse_args(argv)

    repo = Path(__file__).resolve().parents[1]
    results = run_checks(repo, live=args.live and not args.offline)
    summary = _summarize_counts(results)

    if args.json:
        payload = {
            "summary": summary,
            "results": [asdict(r) for r in results],
        }
        print(json.dumps(payload, indent=2, sort_keys=True))
    else:
        print(_format_text(results))

    if summary["fail"] > 0:
        return 1
    if args.strict_flags and summary["flag"] > 0:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
