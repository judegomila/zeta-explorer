#!/usr/bin/env python3
"""Validate and summarize the bounded endpoint-border primary/replay run."""

from __future__ import annotations

import argparse
from decimal import Decimal, localcontext
import hashlib
import json
import os
from pathlib import Path
from typing import Any, Iterable


WORKSTREAM_ROOT = Path(__file__).resolve().parents[1]
CHECKPOINT_ROOT = Path(__file__).resolve().parents[3]
TASKS_PATH = WORKSTREAM_ROOT / "tasks-stage2.json"
RUN_DIR = WORKSTREAM_ROOT / "run-stage2"
PRIMARY_PATH = WORKSTREAM_ROOT / "results" / "border_endpoint_p120.json"
REPLAY_PATH = WORKSTREAM_ROOT / "results" / "border_endpoint_replay_p180.json"
OUTPUT_PATH = WORKSTREAM_ROOT / "analysis-stage2.json"
EXPECTED_TASK_IDS = ("border_endpoint_p120", "border_endpoint_replay_p180")
EXPECTED_DEGREES = tuple(range(3, 20, 2))
EXPECTED_INPUT_NAMES = {
    "egf_manifest",
    "parent_interval",
    "target_moments",
    "endpoint_certificate",
}
STABILITY_TOLERANCE = Decimal("1e-100")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def load_json(path: Path) -> dict[str, Any]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return payload


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    rows = []
    for line_number, line in enumerate(path.read_text().splitlines(), 1):
        if not line.strip():
            continue
        row = json.loads(line)
        if not isinstance(row, dict):
            raise ValueError(f"{path}:{line_number} is not a JSON object")
        rows.append(row)
    return rows


def atomic_write(path: Path, payload: object) -> None:
    encoded = (json.dumps(payload, indent=2, sort_keys=True) + "\n").encode("utf-8")
    temporary = path.with_name(path.name + f".tmp.{os.getpid()}")
    with temporary.open("wb") as handle:
        handle.write(encoded)
        handle.flush()
        os.fsync(handle.fileno())
    os.replace(temporary, path)


def decimal(value: object) -> Decimal:
    if not isinstance(value, (str, int)):
        raise ValueError(f"expected decimal string, got {type(value).__name__}")
    return Decimal(value)


def numeric_vectors(row: dict[str, Any]) -> Iterable[tuple[str, list[Decimal]]]:
    yield "parent_regression_alpha", [decimal(x) for x in row["parent_regression_alpha"]]
    yield "forcing_w", [
        decimal(x) for x in row["forcing_w_equals_bdot_minus_h_alpha"]
    ]
    target_ldl = row["target_ldl"]
    yield "pivots_s", [decimal(x) for x in target_ldl["pivots_s"]]
    yield "eta", [decimal(x) for x in target_ldl["forcing_innovations_eta"]]
    yield "eta_cost_terms", [
        decimal(x) for x in target_ldl["eta_squared_over_pivot_terms"]
    ]
    reconstruction = row["reconstruction"]
    yield "reconstruction", [
        decimal(reconstruction[name])
        for name in (
            "innovation_derivative_gain",
            "target_inverse_cost_direct",
            "target_inverse_cost_ldl",
            "surplus_sigma_direct",
            "surplus_sigma_ldl",
        )
    ]


def validate_result(
    payload: dict[str, Any],
    *,
    dps: int,
    source_sha256: str,
    expected_bindings: dict[str, dict[str, str]],
) -> dict[int, dict[str, Any]]:
    if payload.get("schema_version") != "zsv.paid_twin_border_falsifier.v1":
        raise ValueError("stage-2 result schema mismatch")
    if payload.get("status") != "finite_endpoint_border_diagnostic":
        raise ValueError("stage-2 result status mismatch")
    if payload.get("mode") != "sha_bound_endpoint_midpoint_diagnostic":
        raise ValueError("stage-2 result mode mismatch")
    parameters = payload.get("parameters")
    if not isinstance(parameters, dict) or parameters.get("dps") != dps:
        raise ValueError(f"stage-2 result dps mismatch for p{dps}")
    if parameters.get("degrees") != list(EXPECTED_DEGREES):
        raise ValueError("stage-2 result degree grid mismatch")
    checks = payload.get("checks")
    if not isinstance(checks, dict) or not checks or not all(
        value is True for value in checks.values()
    ):
        raise ValueError(f"stage-2 result p{dps} has a failed aggregate check")
    provenance = payload.get("provenance")
    if not isinstance(provenance, dict) or provenance.get("source_sha256") != source_sha256:
        raise ValueError(f"stage-2 result p{dps} source hash mismatch")
    bindings = payload.get("input_bindings")
    if not isinstance(bindings, dict) or set(bindings) != EXPECTED_INPUT_NAMES:
        raise ValueError(f"stage-2 result p{dps} input bindings missing")
    for name, binding in bindings.items():
        expected = expected_bindings[name]
        result_path = WORKSTREAM_ROOT / str(binding.get("path_relative_to_workstream"))
        expected_path = CHECKPOINT_ROOT / expected["path"]
        if result_path.resolve() != expected_path.resolve():
            raise ValueError(f"stage-2 result p{dps} {name} path mismatch")
        if (
            binding.get("sha256") != expected["sha256"]
            or binding.get("expected_sha256") != expected["sha256"]
        ):
            raise ValueError(f"stage-2 result p{dps} input hash mismatch")
    rungs = payload.get("rungs")
    if not isinstance(rungs, list) or [row.get("degree") for row in rungs] != list(
        EXPECTED_DEGREES
    ):
        raise ValueError(f"stage-2 result p{dps} rung grid mismatch")
    for row in rungs:
        row_checks = row.get("checks")
        if not isinstance(row_checks, dict) or not all(
            value is True for value in row_checks.values()
        ):
            raise ValueError(f"stage-2 result p{dps} degree {row.get('degree')} failed")
    return {int(row["degree"]): row for row in rungs}


def analyze() -> dict[str, Any]:
    tasks = load_json(TASKS_PATH)
    if tasks.get("schema_version") != "zsv.paid_twin_border_tasks.v1":
        raise ValueError("stage-2 task schema mismatch")
    task_rows = tasks.get("tasks")
    if not isinstance(task_rows, list) or tuple(row.get("id") for row in task_rows) != EXPECTED_TASK_IDS:
        raise ValueError("stage-2 task grid mismatch")
    worker_binding = tasks.get("worker_binding")
    if not isinstance(worker_binding, dict):
        raise ValueError("stage-2 worker binding missing")
    worker_path = CHECKPOINT_ROOT / str(worker_binding.get("path"))
    worker_sha = sha256(worker_path)
    if worker_sha != worker_binding.get("sha256"):
        raise ValueError("stage-2 worker hash mismatch")
    input_bindings = tasks.get("input_bindings")
    if not isinstance(input_bindings, dict) or set(input_bindings) != EXPECTED_INPUT_NAMES:
        raise ValueError("stage-2 queue input-binding grid mismatch")
    for binding in input_bindings.values():
        path = CHECKPOINT_ROOT / str(binding.get("path"))
        if sha256(path) != binding.get("sha256"):
            raise ValueError(f"stage-2 queue input changed: {path}")

    completed = load_jsonl(RUN_DIR / "completed.jsonl")
    failed = load_jsonl(RUN_DIR / "failed.jsonl")
    events = load_jsonl(RUN_DIR / "events.jsonl")
    if failed:
        raise ValueError("stage-2 run contains failed receipts")
    completed_ids = [row.get("task") for row in completed]
    if (
        len(completed_ids) != len(EXPECTED_TASK_IDS)
        or len(set(completed_ids)) != len(completed_ids)
        or set(completed_ids) != set(EXPECTED_TASK_IDS)
    ):
        raise ValueError("stage-2 completed receipt grid mismatch")
    if not events or events[-1].get("event") != "queue_complete":
        raise ValueError("stage-2 run lacks a terminal queue_complete event")
    forbidden_events = {
        "signal",
        "signal_refused",
        "load_sample_failed",
        "worker_failed",
        "protected_job_finished",
    }
    observed_events = [str(row.get("event")) for row in events]
    bad_events = sorted(set(observed_events) & forbidden_events)
    if bad_events:
        raise ValueError(f"stage-2 run contains forbidden events: {bad_events}")

    task_by_id = {row["id"]: row for row in task_rows}
    receipt_bindings: dict[str, dict[str, str]] = {}
    receipt_by_task = {str(receipt["task"]): receipt for receipt in completed}
    for task_id in EXPECTED_TASK_IDS:
        receipt = receipt_by_task[task_id]
        if receipt.get("returncode") != 0:
            raise ValueError(f"nonzero completed receipt for {task_id}")
        task = task_by_id[task_id]
        output = CHECKPOINT_ROOT / str(task["output"])
        if Path(str(receipt["output"])).resolve() != output.resolve():
            raise ValueError(f"receipt output mismatch for {task_id}")
        observed_sha = sha256(output)
        if observed_sha != receipt.get("sha256"):
            raise ValueError(f"receipt hash mismatch for {task_id}")
        receipt_bindings[task_id] = {
            "output": str(task["output"]),
            "sha256": observed_sha,
        }

    primary = load_json(PRIMARY_PATH)
    replay = load_json(REPLAY_PATH)
    primary_rungs = validate_result(
        primary,
        dps=120,
        source_sha256=worker_sha,
        expected_bindings=input_bindings,
    )
    replay_rungs = validate_result(
        replay,
        dps=180,
        source_sha256=worker_sha,
        expected_bindings=input_bindings,
    )

    max_absolute_difference = Decimal(0)
    max_scaled_difference = Decimal(0)
    max_location = ""
    with localcontext() as context:
        context.prec = 260
        for degree in EXPECTED_DEGREES:
            primary_vectors = dict(numeric_vectors(primary_rungs[degree]))
            replay_vectors = dict(numeric_vectors(replay_rungs[degree]))
            if primary_vectors.keys() != replay_vectors.keys():
                raise ValueError(f"stability field mismatch at degree {degree}")
            for field, left in primary_vectors.items():
                right = replay_vectors[field]
                if len(left) != len(right):
                    raise ValueError(f"stability vector size mismatch: {degree} {field}")
                for index, (x, y) in enumerate(zip(left, right)):
                    absolute = abs(x - y)
                    scaled = absolute / max(Decimal(1), abs(x), abs(y))
                    if absolute > max_absolute_difference:
                        max_absolute_difference = absolute
                        max_location = f"degree={degree}:{field}[{index}]"
                    max_scaled_difference = max(max_scaled_difference, scaled)
    if max_scaled_difference > STABILITY_TOLERANCE:
        raise ValueError(
            f"primary/replay stability failed at {max_location}: {max_scaled_difference}"
        )

    degree19 = replay_rungs[19]
    reconstruction = degree19["reconstruction"]
    terms = [decimal(value) for value in degree19["target_ldl"]["eta_squared_over_pivot_terms"]]
    cost = decimal(reconstruction["target_inverse_cost_ldl"])
    largest_index = max(range(len(terms)), key=terms.__getitem__)
    old_degrees = tuple(range(1, 19, 2))
    largest_ratio = terms[largest_index] / cost

    heartbeat = load_json(RUN_DIR / "heartbeat.json")
    if heartbeat.get("fourct_done") is not False or heartbeat.get("fourct_misses") != 0:
        raise ValueError("stage-2 heartbeat did not preserve the protected job")
    if heartbeat.get("fourct_detail") != "protected command and cwd matched":
        raise ValueError("stage-2 protected PID/CWD match failed")

    return {
        "schema_version": "zsv.paid_twin_border_analysis.v1",
        "status": "finite_endpoint_border_analysis",
        "scope": (
            "Deterministic analysis of a SHA-bound midpoint diagnostic for the "
            "already certified odd endpoint rungs 3..19. The archived intervals, "
            "not these midpoint eta coordinates, carry the finite certificate. "
            "This is not an all-degree result or an RH proof."
        ),
        "bindings": {
            "tasks_sha256": sha256(TASKS_PATH),
            "worker_sha256": worker_sha,
            "analysis_source_sha256": sha256(Path(__file__).resolve()),
            "receipts": receipt_bindings,
        },
        "run_audit": {
            "completed_tasks": list(EXPECTED_TASK_IDS),
            "failed_tasks": 0,
            "event_sequence": observed_events,
            "forbidden_events_observed": bad_events,
            "lock_state_at_last_heartbeat": heartbeat.get("lock_state"),
            "host_busy_percent_at_last_heartbeat": heartbeat.get("host_busy_percent"),
            "hard_worker_cap": heartbeat.get("hard_worker_cap"),
            "protected_job_detail": heartbeat.get("fourct_detail"),
        },
        "stability": {
            "primary_dps": 120,
            "replay_dps": 180,
            "threshold": str(STABILITY_TOLERANCE),
            "max_absolute_difference": str(max_absolute_difference),
            "max_scaled_difference": str(max_scaled_difference),
            "max_difference_location": max_location,
            "passed": True,
        },
        "degree19": {
            "gain": reconstruction["innovation_derivative_gain"],
            "inverse_cost": reconstruction["target_inverse_cost_ldl"],
            "surplus_new_degree19_pivot": reconstruction["surplus_sigma_ldl"],
            "old_target_last_degree17_pivot": degree19["target_ldl"]["pivots_s"][-1],
            "largest_cost_term": str(terms[largest_index]),
            "largest_cost_term_old_degree": old_degrees[largest_index],
            "largest_cost_fraction": str(largest_ratio),
        },
        "checks": {
            "queue_and_inputs_hash_bound": True,
            "both_receipts_hash_match": True,
            "all_worker_hard_gates_pass": True,
            "primary_replay_stable": True,
            "protected_job_preserved": True,
            "no_signal_or_load_failure_events": True,
            "all_checks_passed": True,
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=OUTPUT_PATH)
    args = parser.parse_args()
    atomic_write(args.output, analyze())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
