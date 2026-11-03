#!/usr/bin/env python3
"""Generate the one-task governed M0 primary/parameter-replay manifest.

The single worker performs both numerical parameter sets. The replay changes
precision, quadrature step, orbit cutoff, and spatial cutoff, but it uses the
same implementation and is not an independent algorithm. The task remains a
finite floating diagnostic, not an interval certificate or an RH proof.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
from typing import Any


SCHEMA_VERSION = "zsv.m0_inertia_tasks.v1"
WORKSTREAM = "workstreams/all-degree-analytic-search-next-v1"
WORKSTREAM_ROOT = Path(__file__).resolve().parents[1]
CHECKPOINT_ROOT = Path(__file__).resolve().parents[3]
WORKER = f"{WORKSTREAM}/src/m0_inertia_probe.py"
TASK_ID = "m0_inertia_primary_parameter_replay"
OUTPUT = f"{WORKSTREAM}/results/{TASK_ID}.json"
REQUIRED_PYTHON = "/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python"

INPUTS = {
    "egf_source": (
        f"{WORKSTREAM}/src/egf_identity.py",
        "d7c777d34c5684f133ce536166617c389492db0f678602e65f324c0a8220d9c4",
    ),
    "egf_manifest": (
        f"{WORKSTREAM}/results/egf_identity_j128.json",
        "354703546a02d24f41699a47739686057a94270103589a62601181043ad9c83c",
    ),
    "parent_interval": (
        "evidence/v19-delta/fisher_bridge_v3/parent_interval_1000.json",
        "7e62d06a0ba7eec5fd7a80e4e5f63a35cf87875d92d73b04314259ae596ef928",
    ),
    "target_moments": (
        "evidence/v18-curated/full_split_audit/actual_total_certificate.json",
        "06b56542d907b50d397263a88da4a39da75ac94463cd48d54da8a5e43198b536",
    ),
    "endpoint_certificate": (
        "evidence/v19-delta/fisher_bridge_v3/endpoint_certificate_1000.json",
        "6042e7989864e2e64f89989bb82329d2bf3af91fe848bed722496ae364335509",
    ),
}

PARAMETERS = {
    "primary": {
        "dps": 100,
        "step_denominator": 128,
        "theta_orbits": 12,
        "h_cutoff": "3",
        "t_extent": "4",
    },
    "replay": {
        "dps": 160,
        "step_denominator": 256,
        "theta_orbits": 16,
        "h_cutoff": "4",
        "t_extent": "5",
    },
    "max_seconds_per_run": 120,
    "max_output_bytes": 4194304,
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def validate_inputs() -> dict[str, dict[str, str]]:
    bindings: dict[str, dict[str, str]] = {}
    for name, (relative, expected) in INPUTS.items():
        path = CHECKPOINT_ROOT / relative
        observed = sha256(path)
        if observed != expected:
            raise ValueError(
                f"{name} SHA-256 mismatch: expected {expected}, observed {observed}"
            )
        bindings[name] = {"path": relative, "sha256": observed}
    egf = json.loads((CHECKPOINT_ROOT / INPUTS["egf_manifest"][0]).read_text())
    checks = egf.get("checks") if isinstance(egf, dict) else None
    if (
        not isinstance(egf, dict)
        or egf.get("status") != "exact_egf_identity"
        or not isinstance(checks, dict)
        or checks.get("all_exact_checks_passed") is not True
        or any(value is not True for value in checks.values())
    ):
        raise ValueError("EGF exact-pass input gate failed")
    return bindings


def build_task() -> dict[str, Any]:
    primary = PARAMETERS["primary"]
    replay = PARAMETERS["replay"]
    return {
        "id": TASK_ID,
        "worker": WORKER,
        "argv": [
            "--egf-source",
            INPUTS["egf_source"][0],
            "--egf-manifest",
            INPUTS["egf_manifest"][0],
            "--parent-interval",
            INPUTS["parent_interval"][0],
            "--target-moments",
            INPUTS["target_moments"][0],
            "--endpoint-certificate",
            INPUTS["endpoint_certificate"][0],
            "--primary-dps",
            str(primary["dps"]),
            "--primary-step-denominator",
            str(primary["step_denominator"]),
            "--primary-orbits",
            str(primary["theta_orbits"]),
            "--primary-h-cutoff",
            str(primary["h_cutoff"]),
            "--primary-t-extent",
            str(primary["t_extent"]),
            "--replay-dps",
            str(replay["dps"]),
            "--replay-step-denominator",
            str(replay["step_denominator"]),
            "--replay-orbits",
            str(replay["theta_orbits"]),
            "--replay-h-cutoff",
            str(replay["h_cutoff"]),
            "--replay-t-extent",
            str(replay["t_extent"]),
            "--max-seconds-per-run",
            str(PARAMETERS["max_seconds_per_run"]),
            "--max-output-bytes",
            str(PARAMETERS["max_output_bytes"]),
        ],
        "output": OUTPUT,
        "expected_schema_version": "zsv.m0_inertia_probe.v1",
        "expected_status": "finite_floating_m0_inertia_diagnostic",
        "expected_mode": "sha_bound_endpoint_primary_replay",
        "expected_parameters": {
            "primary": primary,
            "replay": replay,
        },
    }


def build_manifest() -> dict[str, Any]:
    bindings = validate_inputs()
    worker_path = CHECKPOINT_ROOT / WORKER
    return {
        "schema_version": SCHEMA_VERSION,
        "stage": "m0-inertia-prefix-diagnostic",
        "status": "bounded_single_task_parameter_replay_queue",
        "purpose": (
            "One SHA-bound floating M0 reconstruction on the archived odd ladder. "
            "The worker performs a primary calculation and a materially different "
            "parameter replay using the same algorithm. It is not degree escalation, "
            "an independent implementation, an interval certificate, or an RH proof."
        ),
        "input_bindings": bindings,
        "worker_binding": {"path": WORKER, "sha256": sha256(worker_path)},
        "python_binding": {
            "path": REQUIRED_PYTHON,
            "required": True,
            "reason": "ambient python3 does not provide the bound mpmath environment",
        },
        "replay_contract": {
            "kind": "same_worker_parameter_replay",
            "independent_algorithm": False,
            "varied_parameters": [
                "dps",
                "step_denominator",
                "theta_orbits",
                "h_cutoff",
                "t_extent",
            ],
        },
        "resource_contract": {
            "tasks": 1,
            "single_threaded": True,
            "cooperative_seconds_per_numeric_run": PARAMETERS[
                "max_seconds_per_run"
            ],
            "numeric_runs_inside_task": 2,
            "output_bytes_per_task": PARAMETERS["max_output_bytes"],
            "supervisor_required_for_production_run": True,
            "governor_and_protected_pid_must_be_rechecked_before_launch": True,
        },
        "tasks": [build_task()],
    }


def atomic_write(path: Path, payload: object) -> None:
    encoded = (json.dumps(payload, indent=2, sort_keys=True) + "\n").encode("utf-8")
    destination = path.resolve()
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_name(destination.name + f".tmp.{os.getpid()}")
    try:
        with temporary.open("wb") as handle:
            handle.write(encoded)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, destination)
    finally:
        try:
            temporary.unlink()
        except FileNotFoundError:
            pass


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output", type=Path, default=WORKSTREAM_ROOT / "tasks-m0-inertia.json"
    )
    args = parser.parse_args()
    atomic_write(args.output, build_manifest())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
