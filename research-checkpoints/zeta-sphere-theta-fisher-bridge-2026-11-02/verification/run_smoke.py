#!/usr/bin/env python3
"""Run dependency-light verifier scripts without mutating frozen evidence."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile


ROOT = Path(__file__).resolve().parents[1]
V18 = ROOT / "evidence" / "v18-curated"
CP62 = ROOT / "evidence" / "cp62"

CASES = (
    ("h5-analytic-tail", V18 / "h5_tail_v1", "analytic_tail_checks.py", "passed"),
    ("grouped-gram", V18 / "modular_epstein_v3", "verify_grouped_certificate.py", "PASS"),
    ("zero-window", V18 / "modular_v2", "verify_zero_window.py", "PASS"),
    ("cluster-certificate", V18 / "confluent_v4", "verify_cluster_certificate.py", "PASS"),
    ("cp62-joint-source", CP62 / "root", "verify_joint_source.py", '"controls": 39'),
    ("cp62-matrix-anchor", CP62 / "anchor_audit", "verify_matrix_anchor.py", '"controls": 25'),
)

GENERATED_OUTPUTS = {
    "cp62-joint-source": (
        "joint_source_controls.json",
        "b798b5f0e4bb65b179fb30f0160b516b4714f1f7f716487dffffa085b69e0e17",
    ),
    "cp62-matrix-anchor": (
        "matrix_anchor_controls.json",
        "6a6cc65f555a5879bc2031a9ea35e49d0ca578fa36a21b6990dc0632bddf80dc",
    ),
}


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> int:
    results = []
    with tempfile.TemporaryDirectory(prefix="zsv-smoke-") as temporary:
        temp = Path(temporary)
        for name, source, script, expected in CASES:
            target = temp / name
            shutil.copytree(source, target)
            completed = subprocess.run(
                [sys.executable, script],
                cwd=target,
                text=True,
                capture_output=True,
                check=False,
            )
            output_ok = expected.lower() in completed.stdout.lower()
            generated_ok = True
            if name in GENERATED_OUTPUTS:
                relative, expected_hash = GENERATED_OUTPUTS[name]
                generated_ok = digest(target / relative) == expected_hash
            results.append(
                {
                    "name": name,
                    "returncode": completed.returncode,
                    "expected_output_seen": output_ok,
                    "generated_output_hash_ok": generated_ok,
                    "stdout": completed.stdout.strip(),
                    "stderr": completed.stderr.strip(),
                }
            )
    v19_completed = subprocess.run(
        [sys.executable, str(ROOT / "verification" / "check_v19_certificates.py")],
        cwd=ROOT,
        text=True,
        capture_output=True,
        check=False,
    )
    results.append(
        {
            "name": "v19-certificate-summaries",
            "returncode": v19_completed.returncode,
            "expected_output_seen": '"status": "PASS"' in v19_completed.stdout,
            "generated_output_hash_ok": True,
            "stdout": v19_completed.stdout.strip(),
            "stderr": v19_completed.stderr.strip(),
        }
    )
    passed = all(
        row["returncode"] == 0
        and row["expected_output_seen"]
        and row["generated_output_hash_ok"]
        for row in results
    )
    print(json.dumps({"status": "PASS" if passed else "FAIL", "checks": results}, indent=2))
    return 0 if passed else 1


if __name__ == "__main__":
    sys.exit(main())

