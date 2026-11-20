#!/usr/bin/env python3
"""Generate the bounded SHA-bound endpoint-border diagnostic queue.

This queue replays already certified finite odd endpoint rungs and emits
target-LDL forcing coordinates. It is a midpoint diagnostic, not an interval
certificate, an all-degree sign result, or evidence proving RH.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
from typing import Any


SCHEMA_VERSION = "zsv.paid_twin_border_tasks.v1"
WORKSTREAM = "workstreams/all-degree-analytic-search-next-v1"
WORKSTREAM_ROOT = Path(__file__).resolve().parents[1]
CHECKPOINT_ROOT = Path(__file__).resolve().parents[3]
WORKER = f"{WORKSTREAM}/src/paid_twin_border_falsifier.py"

INPUTS = {
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
    if egf.get("status") != "exact_egf_identity":
        raise ValueError("EGF input did not pass the exact status gate")
    checks = egf.get("checks")
    if not isinstance(checks, dict) or checks.get("all_exact_checks_passed") is not True:
        raise ValueError("EGF input did not pass every exact check")
    return bindings


def build_task(dps: int, replay: bool) -> dict[str, Any]:
    tag = "replay_" if replay else ""
    task_id = f"border_endpoint_{tag}p{dps}"
    return {
        "id": task_id,
        "worker": WORKER,
        "argv": [
            "--mode",
            "endpoint-midpoint",
            "--egf-manifest",
            INPUTS["egf_manifest"][0],
            "--parent-interval",
            INPUTS["parent_interval"][0],
            "--target-moments",
            INPUTS["target_moments"][0],
            "--endpoint-certificate",
            INPUTS["endpoint_certificate"][0],
            "--dps",
            str(dps),
            "--max-seconds",
            "60",
            "--max-output-bytes",
            "4194304",
        ],
        "output": f"{WORKSTREAM}/results/{task_id}.json",
        "expected_status": "finite_endpoint_border_diagnostic",
        "expected_parameters": {
            "dps": dps,
            "degrees": list(range(3, 20, 2)),
            "max_seconds": 60,
            "reconstruction": "midpoints of SHA-bound certified input intervals",
        },
    }


def build_manifest() -> dict[str, Any]:
    bindings = validate_inputs()
    worker_path = CHECKPOINT_ROOT / WORKER
    return {
        "schema_version": SCHEMA_VERSION,
        "stage": 2,
        "status": "bounded_endpoint_midpoint_queue",
        "purpose": (
            "Primary/replay diagnostic of the already certified odd endpoint "
            "rungs, exposing target-LDL forcing coordinates. Midpoint output is "
            "not an interval certificate or an all-degree/RH result."
        ),
        "input_bindings": bindings,
        "worker_binding": {"path": WORKER, "sha256": sha256(worker_path)},
        "resource_contract": {
            "tasks": 2,
            "single_threaded": True,
            "cooperative_seconds_per_task": 60,
            "output_bytes_per_task": 4194304,
            "supervisor_required_for_production_run": True,
        },
        "tasks": [build_task(120, False), build_task(180, True)],
    }


def atomic_write(path: Path, payload: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + f".tmp.{os.getpid()}")
    with temporary.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2, sort_keys=True)
        handle.write("\n")
        handle.flush()
        os.fsync(handle.fileno())
    os.replace(temporary, path)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output", type=Path, default=WORKSTREAM_ROOT / "tasks-stage2.json"
    )
    args = parser.parse_args()
    atomic_write(args.output, build_manifest())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
