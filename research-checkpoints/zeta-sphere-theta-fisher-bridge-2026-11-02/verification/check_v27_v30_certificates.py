#!/usr/bin/env python3
"""Bounded V27--V30 checks; no Arb, quadrature, or pivot search is rerun."""

from __future__ import annotations

from decimal import Decimal
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile


ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = ROOT / "evidence" / "v27-v30-continuation"
ARITHMETIC = EVIDENCE / "theta_correlated_local_v1"
ARITHMETIC_AUDIT = EVIDENCE / "theta_correlated_local_audit"

EXACT_CHECKS = (
    ("degree-only-constants", "check_degree_only_constants.py", "degree_only_constants.json"),
    ("gauss-orbit-constants", "check_gauss_orbit_constants.py", "gauss_orbit_constants.json"),
    ("orbit-recurrence", "check_orbit_recurrence.py", "orbit_recurrence_check.json"),
)

AUDIT_MIRRORS = (
    ("degree_only_constants.json", "degree_only_constants_replay.json"),
    ("gauss_orbit_constants.json", "gauss_orbit_constants_replay.json"),
    ("orbit_recurrence_check.json", "orbit_recurrence_replay.json"),
)


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def fail(message: str) -> None:
    raise AssertionError(message)


def first_decimal(interval: str) -> Decimal:
    if not interval.startswith("["):
        fail(f"unexpected interval format: {interval!r}")
    return Decimal(interval[1:].split()[0])


def run_exact_checks() -> list[dict[str, object]]:
    results: list[dict[str, object]] = []
    with tempfile.TemporaryDirectory(prefix="zsv-v27-v30-") as temporary:
        target = Path(temporary) / "theta_correlated_local_v1"
        shutil.copytree(ARITHMETIC, target)
        for name, script, summary in EXACT_CHECKS:
            completed = subprocess.run(
                [sys.executable, script],
                cwd=target,
                text=True,
                capture_output=True,
                check=False,
            )
            if completed.returncode != 0:
                fail(f"{name} failed: {completed.stderr.strip()}")
            generated = json.loads(completed.stdout)
            frozen = json.loads((target / summary).read_text())
            if generated != frozen:
                fail(f"{name} output differs from frozen summary")
            results.append(
                {
                    "name": name,
                    "returncode": completed.returncode,
                    "frozen_summary_match": True,
                    "scope": generated.get("scope"),
                }
            )
    return results


def check_audit_mirrors() -> list[dict[str, object]]:
    results: list[dict[str, object]] = []
    for source_name, audit_name in AUDIT_MIRRORS:
        source_hash = digest(ARITHMETIC / source_name)
        audit_hash = digest(ARITHMETIC_AUDIT / audit_name)
        if source_hash != audit_hash:
            fail(f"source/audit replay mismatch: {source_name} vs {audit_name}")
        results.append(
            {
                "name": f"audit-mirror-{source_name}",
                "sha256": source_hash,
                "match": True,
            }
        )
    return results


def check_finite_summary() -> dict[str, object]:
    """Validate the stored A4 summary without rerunning its 2048-cell Arb job."""

    path = EVIDENCE / "source_0145_audit" / "a4_replay.json"
    data = json.loads(path.read_text())
    if data.get("PASS") is not True or data.get("cells") != 2048:
        fail("unexpected finite even-channel replay status")
    if data.get("derivatives") != 18 or data.get("declared_reserve") != "1/100":
        fail("unexpected finite even-channel replay parameters")
    lowers = [first_decimal(value) for value in data.get("gershgorin_lower", [])]
    if len(lowers) != 5 or min(lowers) <= Decimal("0.02834170721162048"):
        fail("finite even-channel Gershgorin reserve is too small")
    normalization = first_decimal(data.get("normalization_upper", ""))
    if normalization >= Decimal(4) / Decimal(125):
        fail("finite even-channel normalization is not below 4/125")
    if int(data.get("normalized_schur_lower", "0")) < 444765312500000000:
        fail("finite even-channel normalized Schur reserve is too small")
    if data.get("scope") != "Even channels0,2,4,6,8 only; not fullH8":
        fail("finite even-channel scope label changed")
    return {
        "name": "stored-even-0-2-4-6-8-summary",
        "status": "PASS",
        "rerun": False,
        "cells_recorded": 2048,
        "minimum_gershgorin_lower": str(min(lowers)),
        "normalization_upper": str(normalization),
        "scope": data["scope"],
    }


def check_diagnostic_labels() -> list[dict[str, object]]:
    labelled = (
        ("theta_boundary_trace_v1/probe_top.json", "not certified"),
        ("theta_trace_clarification_v1/probe_existing_trace.json", "not certified"),
        ("eta_positive_primitive_v1/correlated_diagnostic.json", "not a new ladder result"),
        ("eta_positive_primitive_v1/correlated_diagnostic_N2.json", "not a new positivity result"),
    )
    results: list[dict[str, object]] = []
    for relative, required in labelled:
        data = json.loads((EVIDENCE / relative).read_text())
        scope = str(data.get("scope", ""))
        if required.lower() not in scope.lower():
            fail(f"diagnostic scope missing {required!r}: {relative}")
        results.append({"name": f"scope-{relative}", "required_label_seen": True})
    return results


def main() -> int:
    checks: list[dict[str, object]] = []
    checks.extend(run_exact_checks())
    checks.extend(check_audit_mirrors())
    checks.append(check_finite_summary())
    checks.extend(check_diagnostic_labels())
    print(
        json.dumps(
            {
                "status": "PASS",
                "checks": checks,
                "scope": (
                    "Three standard-library exact checks were rerun in a temporary copy. "
                    "The 2048-cell Arb certificate was validated from its frozen summary only; "
                    "no expensive quadrature or new theta pivot was run."
                ),
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (AssertionError, OSError, ValueError, json.JSONDecodeError) as error:
        print(json.dumps({"status": "FAIL", "error": str(error)}), file=sys.stderr)
        sys.exit(1)
