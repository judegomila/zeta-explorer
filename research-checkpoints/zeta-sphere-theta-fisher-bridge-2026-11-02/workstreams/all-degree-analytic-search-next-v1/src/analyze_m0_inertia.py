#!/usr/bin/env python3
"""Create a deterministic receipt for an M0 primary/replay result.

The receipt checks provenance, schemas, parameter separation, inertia/gate
agreement, and reported stability margins. It does not independently recompute
the theta quadrature and does not upgrade floating data to a certificate.
"""

from __future__ import annotations

import argparse
from decimal import Decimal
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import sys
import tempfile
from types import ModuleType
from typing import Any, Sequence


SOURCE_PATH = Path(__file__).resolve()
WORKSTREAM_ROOT = SOURCE_PATH.parents[1]
CHECKPOINT_ROOT = SOURCE_PATH.parents[3]
WORKER_PATH = WORKSTREAM_ROOT / "src" / "m0_inertia_probe.py"
DEFAULT_TASKS_PATH = WORKSTREAM_ROOT / "tasks-m0-inertia.json"
DEFAULT_RUN_DIR = WORKSTREAM_ROOT / "run-m0-inertia"
SCHEMA_VERSION = "zsv.m0_inertia_analysis.v1"
STATUS = "finite_floating_m0_inertia_analysis"
HARD_MAX_OUTPUT_BYTES = 1024 * 1024


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def load_worker() -> ModuleType:
    spec = importlib.util.spec_from_file_location(
        "m0_inertia_probe_for_analysis", WORKER_PATH
    )
    if spec is None or spec.loader is None:
        raise ImportError(f"could not load worker at {WORKER_PATH}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def require_dict(value: object, label: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise ValueError(f"{label} must be an object")
    return value


def load_json(path: Path) -> dict[str, Any]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return payload


def load_required_jsonl(path: Path) -> list[dict[str, Any]]:
    if not path.is_file():
        raise ValueError(f"required supervisor receipt file is missing: {path}")
    rows: list[dict[str, Any]] = []
    for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        row = json.loads(line)
        if not isinstance(row, dict):
            raise ValueError(f"{path}:{line_number} is not a JSON object")
        rows.append(row)
    return rows


def load_optional_jsonl(path: Path) -> tuple[list[dict[str, Any]], bool]:
    if not path.exists():
        return [], False
    return load_required_jsonl(path), True


def resolve_receipt_path(value: object) -> Path:
    path = Path(str(value))
    return path.resolve() if path.is_absolute() else (CHECKPOINT_ROOT / path).resolve()


def validate_governed_run(
    *,
    worker: ModuleType,
    result_path: Path,
    tasks_path: Path,
    run_dir: Path,
) -> dict[str, Any]:
    tasks = load_json(tasks_path)
    if tasks.get("schema_version") != "zsv.m0_inertia_tasks.v1":
        raise ValueError("M0 task manifest schema mismatch")
    if tasks.get("status") != "bounded_single_task_parameter_replay_queue":
        raise ValueError("M0 task manifest status mismatch")
    replay_contract = require_dict(tasks.get("replay_contract"), "replay_contract")
    if (
        replay_contract.get("kind") != "same_worker_parameter_replay"
        or replay_contract.get("independent_algorithm") is not False
    ):
        raise ValueError("manifest does not identify same-worker parameter replay")
    task_rows = tasks.get("tasks")
    if not isinstance(task_rows, list) or len(task_rows) != 1:
        raise ValueError("M0 manifest must contain exactly one task")
    task = require_dict(task_rows[0], "tasks[0]")
    task_id = task.get("id")
    if not isinstance(task_id, str) or not task_id:
        raise ValueError("M0 task id is missing")

    worker_binding = require_dict(tasks.get("worker_binding"), "worker_binding")
    manifest_worker_path = (CHECKPOINT_ROOT / str(worker_binding.get("path"))).resolve()
    if manifest_worker_path != WORKER_PATH.resolve():
        raise ValueError("manifest worker path mismatch")
    worker_sha256 = file_sha256(WORKER_PATH)
    if worker_binding.get("sha256") != worker_sha256:
        raise ValueError("manifest worker SHA-256 mismatch")
    if task.get("worker") != worker_binding.get("path"):
        raise ValueError("task worker differs from manifest worker binding")
    python_binding = require_dict(tasks.get("python_binding"), "python_binding")
    required_python = Path(str(python_binding.get("path"))).resolve()
    if (
        python_binding.get("required") is not True
        or required_python != worker.REQUIRED_PYTHON.resolve()
    ):
        raise ValueError("manifest does not bind the required Arb Python")

    input_bindings = require_dict(tasks.get("input_bindings"), "input_bindings")
    if set(input_bindings) != set(worker.EXPECTED_SHA256):
        raise ValueError("manifest input-binding set mismatch")
    for name, expected in worker.EXPECTED_SHA256.items():
        binding = require_dict(input_bindings[name], f"input_bindings.{name}")
        bound_path = (CHECKPOINT_ROOT / str(binding.get("path"))).resolve()
        if binding.get("sha256") != expected or file_sha256(bound_path) != expected:
            raise ValueError(f"manifest input binding changed: {name}")

    expected_result_path = (CHECKPOINT_ROOT / str(task.get("output"))).resolve()
    if result_path.resolve() != expected_result_path:
        raise ValueError("result path differs from the manifest task output")
    result_sha256 = file_sha256(result_path)

    completed_path = run_dir / "completed.jsonl"
    failed_path = run_dir / "failed.jsonl"
    events_path = run_dir / "events.jsonl"
    completed = load_required_jsonl(completed_path)
    failed, failed_receipts_file_present = load_optional_jsonl(failed_path)
    events = load_required_jsonl(events_path)
    if failed:
        raise ValueError("governed M0 run contains failed receipts")
    if len(completed) != 1 or completed[0].get("task") != task_id:
        raise ValueError("governed M0 run must contain one matching completion receipt")
    receipt = completed[0]
    if receipt.get("returncode") != 0:
        raise ValueError("M0 completion receipt has a nonzero return code")
    if resolve_receipt_path(receipt.get("output")) != expected_result_path:
        raise ValueError("M0 completion receipt output path mismatch")
    if receipt.get("sha256") != result_sha256:
        raise ValueError("M0 completion receipt result hash mismatch")

    event_names = [str(row.get("event")) for row in events]
    forbidden = sorted(
        {
            name
            for name in event_names
            if name.startswith("signal")
            or name.endswith("_failed")
            or name
            in {
                "worker_failed",
                "load_sample_failed",
            }
        }
    )
    if forbidden:
        raise ValueError(f"governed M0 run contains forbidden events: {forbidden}")

    def event_index(name: str, *, task_scoped: bool = False) -> int:
        matches = [
            index
            for index, row in enumerate(events)
            if row.get("event") == name
            and (not task_scoped or row.get("task") == task_id)
        ]
        if len(matches) != 1:
            raise ValueError(f"expected exactly one {name} event for M0 task")
        return matches[0]

    ordered_indices = [
        event_index("supervisor_started"),
        event_index("worker_started", task_scoped=True),
        event_index("worker_completed", task_scoped=True),
        event_index("queue_complete"),
    ]
    if ordered_indices != sorted(ordered_indices):
        raise ValueError("governed M0 supervisor event order is invalid")
    worker_started = events[ordered_indices[1]]
    worker_completed = events[ordered_indices[2]]
    if (
        worker_completed.get("sha256") != result_sha256
        or worker_completed.get("returncode") != 0
        or resolve_receipt_path(worker_completed.get("output")) != expected_result_path
    ):
        raise ValueError("worker_completed event does not bind the result receipt")

    command = worker_started.get("command")
    argv = task.get("argv")
    if not isinstance(command, list) or not all(isinstance(value, str) for value in command):
        raise ValueError("worker_started command is missing")
    if not isinstance(argv, list) or not all(isinstance(value, str) for value in argv):
        raise ValueError("manifest task argv is invalid")
    worker_text = str(WORKER_PATH.resolve())
    try:
        worker_index = command.index(worker_text)
    except ValueError as error:
        raise ValueError("worker_started command does not contain the bound worker") from error
    if worker_index == 0 or Path(command[worker_index - 1]).resolve() != required_python:
        raise ValueError("worker_started command did not use the bound Arb Python")
    if command[worker_index + 1 : worker_index + 1 + len(argv)] != argv:
        raise ValueError("worker_started argv differs from the task manifest")
    suffix = command[worker_index + 1 + len(argv) :]
    if "--output" not in suffix:
        raise ValueError("worker_started command lacks an output argument")
    output_index = suffix.index("--output")
    if output_index + 1 >= len(suffix) or Path(suffix[output_index + 1]).resolve() != expected_result_path:
        raise ValueError("worker_started output argument differs from the task manifest")

    return {
        "tasks_sha256": file_sha256(tasks_path),
        "worker_sha256": worker_sha256,
        "required_python": str(required_python),
        "result_sha256": result_sha256,
        "completed_receipts_sha256": file_sha256(completed_path),
        "failed_receipts_file_present": failed_receipts_file_present,
        "failed_receipts_sha256": (
            file_sha256(failed_path) if failed_receipts_file_present else None
        ),
        "events_sha256": file_sha256(events_path),
        "task_id": task_id,
        "task": task,
        "event_sequence": event_names,
        "forbidden_events_observed": forbidden,
        "completion_receipt": receipt,
    }


def analyze(
    result_path: Path,
    *,
    tasks_path: Path = DEFAULT_TASKS_PATH,
    run_dir: Path = DEFAULT_RUN_DIR,
) -> dict[str, Any]:
    worker = load_worker()
    resolved = result_path.resolve()
    governed = validate_governed_run(
        worker=worker,
        result_path=resolved,
        tasks_path=tasks_path.resolve(),
        run_dir=run_dir.resolve(),
    )
    result_sha256 = governed["result_sha256"]
    result = json.loads(resolved.read_text(encoding="ascii"))
    if not isinstance(result, dict):
        raise ValueError("result must be a JSON object")
    task = governed["task"]
    if result.get("schema_version") != task.get("expected_schema_version"):
        raise ValueError("worker result schema mismatch")
    if (
        result.get("status") != task.get("expected_status")
        or result.get("mode") != task.get("expected_mode")
    ):
        raise ValueError("worker result status/mode mismatch")
    checks = require_dict(result.get("checks"), "checks")
    bindings = require_dict(result.get("input_bindings"), "input_bindings")
    primary = require_dict(result.get("primary"), "primary")
    replay = require_dict(result.get("replay"), "replay")
    comparison = require_dict(result.get("primary_replay"), "primary_replay")
    provenance = require_dict(result.get("provenance"), "provenance")

    manifest = load_json(tasks_path.resolve())
    manifest_inputs = require_dict(manifest.get("input_bindings"), "input_bindings")
    binding_checks: dict[str, bool] = {}
    for name, expected in worker.EXPECTED_SHA256.items():
        result_binding = bindings.get(name)
        manifest_binding = manifest_inputs.get(name)
        binding_checks[name] = (
            isinstance(result_binding, dict)
            and isinstance(manifest_binding, dict)
            and result_binding.get("sha256") == expected
            and result_binding.get("expected_sha256") == expected
            and manifest_binding.get("sha256") == expected
            and (
                WORKSTREAM_ROOT
                / str(result_binding.get("path_relative_to_workstream"))
            ).resolve()
            == (CHECKPOINT_ROOT / str(manifest_binding.get("path"))).resolve()
        )
    primary_parameters = require_dict(primary.get("parameters"), "primary.parameters")
    replay_parameters = require_dict(replay.get("parameters"), "replay.parameters")
    expected_parameters = require_dict(
        task.get("expected_parameters"), "task.expected_parameters"
    )
    if result.get("parameters") != expected_parameters:
        raise ValueError("top-level result parameters differ from supervisor contract")
    for name, observed_parameters in (
        ("primary", primary_parameters),
        ("replay", replay_parameters),
    ):
        expected = require_dict(expected_parameters.get(name), f"expected {name}")
        for field in ("dps", "step_denominator", "theta_orbits"):
            if observed_parameters.get(field) != expected.get(field):
                raise ValueError(f"{name} result parameter mismatch: {field}")
        for field in ("h_cutoff", "t_extent"):
            if Decimal(str(observed_parameters.get(field))) != Decimal(
                str(expected.get(field))
            ):
                raise ValueError(f"{name} result parameter mismatch: {field}")
    parameter_separation = {
        "replay_dps_greater": replay_parameters.get("dps", 0)
        > primary_parameters.get("dps", 0),
        "replay_step_denominator_greater": replay_parameters.get(
            "step_denominator", 0
        )
        > primary_parameters.get("step_denominator", 0),
        "replay_orbits_greater": replay_parameters.get("theta_orbits", 0)
        > primary_parameters.get("theta_orbits", 0),
        "replay_h_cutoff_greater": float(replay_parameters.get("h_cutoff", "nan"))
        > float(primary_parameters.get("h_cutoff", "nan")),
        "replay_t_extent_greater": float(replay_parameters.get("t_extent", "nan"))
        > float(primary_parameters.get("t_extent", "nan")),
    }
    primary_rows = primary.get("inertia_by_prefix")
    replay_rows = replay.get("inertia_by_prefix")
    if not isinstance(primary_rows, list) or not isinstance(replay_rows, list):
        raise ValueError("primary/replay inertia rows are missing")
    expected_degrees = list(worker.ODD_DEGREES)
    if [row.get("degree") for row in primary_rows] != expected_degrees:
        raise ValueError("primary degrees differ from the fixed archived ladder")
    if [row.get("degree") for row in replay_rows] != expected_degrees:
        raise ValueError("replay degrees differ from the fixed archived ladder")
    row_checks = []
    for primary_row, replay_row in zip(primary_rows, replay_rows):
        primary_gate = require_dict(primary_row.get("old_target_gate"), "primary gate")
        replay_gate = require_dict(replay_row.get("old_target_gate"), "replay gate")
        row_checks.append(
            {
                "degree": primary_row["degree"],
                "primary_ordinary_whitened_agree": (
                    primary_row.get("ordinary_inertia")
                    == primary_row.get("parent_whitened_inertia")
                ),
                "replay_ordinary_whitened_agree": (
                    replay_row.get("ordinary_inertia")
                    == replay_row.get("parent_whitened_inertia")
                ),
                "primary_replay_inertia_agree": (
                    primary_row.get("ordinary_inertia")
                    == replay_row.get("ordinary_inertia")
                ),
                "primary_gate_matches_observed_psd": primary_gate.get(
                    "gate_and_observed_psd_agree"
                )
                is True,
                "replay_gate_matches_observed_psd": replay_gate.get(
                    "gate_and_observed_psd_agree"
                )
                is True,
                "primary_replay_gate_sign_agree": primary_gate.get(
                    "gate_predicts_psd"
                )
                == replay_gate.get("gate_predicts_psd"),
            }
        )

    aggregate_checks = {
        "task_manifest_worker_inputs_and_result_bound": True,
        "single_completion_receipt_hash_matches_result": True,
        "supervisor_event_sequence_complete_and_ordered": True,
        "no_failed_receipts_or_signal_failed_events": (
            not governed["forbidden_events_observed"]
        ),
        "result_source_matches_current_worker": (
            provenance.get("source_sha256") == governed["worker_sha256"]
            and provenance.get("source_sha256_at_start")
            == governed["worker_sha256"]
            and provenance.get("source_sha256_at_end")
            == governed["worker_sha256"]
        ),
        "worker_source_unchanged_and_manifest_bound": (
            provenance.get("source_sha256_at_start")
            == provenance.get("source_sha256_at_end")
            == governed["worker_sha256"]
        ),
        "bound_arb_python_used": (
            Path(str(provenance.get("python_executable"))).resolve()
            == Path(governed["required_python"]).resolve()
            and Path(str(provenance.get("required_python_executable"))).resolve()
            == Path(governed["required_python"]).resolve()
        ),
        "all_worker_checks_passed": checks.get("all_checks_passed") is True,
        "all_input_bindings_match": all(binding_checks.values()),
        "all_primary_checks_passed": require_dict(
            primary.get("checks"), "primary.checks"
        ).get("all_numeric_reconstruction_checks_passed")
        is True,
        "all_replay_checks_passed": require_dict(
            replay.get("checks"), "replay.checks"
        ).get("all_numeric_reconstruction_checks_passed")
        is True,
        "parameter_replay_is_materially_different": all(
            parameter_separation.values()
        ),
        "all_inertia_rows_and_gates_agree": all(
            all(value for name, value in row.items() if name != "degree")
            for row in row_checks
        ),
        "reported_inertia_stability_passes": comparison.get(
            "all_inertias_agree"
        )
        is True
        and comparison.get("all_eigenvalue_margin_gates_pass") is True,
        "reported_gate_stability_passes": comparison.get(
            "all_old_target_gate_signs_agree"
        )
        is True
        and comparison.get("all_old_target_gate_margin_gates_pass") is True,
        "cutoff_diagnostics_explicitly_nonrigorous": (
            primary.get("cutoff_diagnostics_are_not_bounds") is True
            and replay.get("cutoff_diagnostics_are_not_bounds") is True
        ),
    }
    aggregate_checks["all_checks_passed"] = all(aggregate_checks.values())
    if not aggregate_checks["all_checks_passed"]:
        failed = [name for name, passed in aggregate_checks.items() if not passed]
        raise ArithmeticError(f"M0 deterministic receipt gate failed: {failed}")

    return {
        "schema_version": SCHEMA_VERSION,
        "status": STATUS,
        "scope": (
            "Deterministic structural receipt for one floating M0 parameter-replay "
            "result. This does not recompute quadrature, certify tails, prove an "
            "all-degree inequality, or prove RH."
        ),
        "result": {
            "path_relative_to_workstream": os.path.relpath(resolved, WORKSTREAM_ROOT),
            "sha256": result_sha256,
            "worker_source_sha256": provenance["source_sha256"],
        },
        "governed_bindings": {
            name: governed[name]
            for name in (
                "tasks_sha256",
                "worker_sha256",
                "result_sha256",
                "completed_receipts_sha256",
                "failed_receipts_file_present",
                "failed_receipts_sha256",
                "events_sha256",
                "task_id",
                "required_python",
            )
        },
        "supervisor_audit": {
            "event_sequence": governed["event_sequence"],
            "forbidden_events_observed": governed["forbidden_events_observed"],
            "completion_receipt": governed["completion_receipt"],
        },
        "binding_checks": binding_checks,
        "parameter_separation": parameter_separation,
        "row_checks": row_checks,
        "reported_primary_replay": comparison,
        "outcome": result.get("outcome"),
        "checks": aggregate_checks,
        "provenance": {
            "analyzer_source_sha256": file_sha256(SOURCE_PATH),
            "worker_source_sha256": file_sha256(WORKER_PATH),
        },
    }


def atomic_write_json(path: Path, payload: dict[str, Any], max_output_bytes: int) -> None:
    if not 1024 <= max_output_bytes <= HARD_MAX_OUTPUT_BYTES:
        raise ValueError(
            f"max_output_bytes must lie in [1024, {HARD_MAX_OUTPUT_BYTES}]"
        )
    encoded = (
        json.dumps(payload, ensure_ascii=True, allow_nan=False, indent=2, sort_keys=True)
        + "\n"
    ).encode("ascii")
    if len(encoded) > max_output_bytes:
        raise ValueError("analysis output exceeds the requested byte cap")
    destination = path.resolve()
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary_name: str | None = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="wb",
            prefix=f".{destination.name}.",
            suffix=".tmp",
            dir=destination.parent,
            delete=False,
        ) as handle:
            temporary_name = handle.name
            handle.write(encoded)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary_name, destination)
        temporary_name = None
    finally:
        if temporary_name is not None:
            try:
                Path(temporary_name).unlink()
            except FileNotFoundError:
                pass


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--result", type=Path, required=True)
    parser.add_argument("--tasks", type=Path, default=DEFAULT_TASKS_PATH)
    parser.add_argument("--run-dir", type=Path, default=DEFAULT_RUN_DIR)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument(
        "--max-output-bytes", type=int, default=HARD_MAX_OUTPUT_BYTES
    )
    return parser.parse_args(argv)


def main(argv: Sequence[str] | None = None) -> int:
    args = parse_args(argv)
    payload = analyze(args.result, tasks_path=args.tasks, run_dir=args.run_dir)
    atomic_write_json(args.output, payload, args.max_output_bytes)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
