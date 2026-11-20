#!/usr/bin/env python3
"""Deterministically summarize the signed modular-pair scaling experiment.

The analyzer is deliberately independent of the numerical worker.  It first
binds every accepted result to the task manifest and supervisor receipt, then
computes only reproducible finite diagnostics.  Nothing reported here is a
certificate of the target inequality or of RH.
"""

from __future__ import annotations

import argparse
from decimal import Decimal, InvalidOperation, localcontext
import hashlib
import json
import os
from pathlib import Path
import sys
from typing import Any, Iterable


WORKSTREAM_ROOT = Path(__file__).resolve().parents[1]
CHECKPOINT_ROOT = Path(__file__).resolve().parents[3]
EXPECTED_STATUS = "signed_h_pair_diagnostic"
EXPECTED_EGF_STATUS = "exact_egf_identity"
EXPECTED_SCALES = (
    (1, "0.25"),
    (1, "1"),
    (1, "4"),
    (2, "0.25"),
    (2, "1"),
    (2, "4"),
)
EXPECTED_SCALE_GRID_ID = "beta1_beta2_c0p25_1_4"
EXPECTED_MAX_ORBIT = 96
EXPECTED_PRIMARY_N_DPS = ((8, 372), (12, 468), (16, 564), (20, 660), (24, 756))
EXPECTED_REPLAY_N_DPS = ((16, 724), (24, 916))
SCALE_METRICS = (
    "direct_ell",
    "paired_ell",
    "signed_numerator",
    "signed_denominator",
    "total_variation",
    "total_variation_over_abs_signed_total",
    "positive_contribution_sum",
    "negative_contribution_abs_sum",
    "local_feature_energy_0_to_h_simpson16",
)
CENTER_METRICS = (
    "ell_A",
    "scaled_interpolation_condition_inf",
)


class AnalysisError(ValueError):
    """Raised when an input cannot be bound to the recorded experiment."""


def sha256_path(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def load_json(path: Path) -> dict[str, Any]:
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        raise AnalysisError(f"cannot read JSON {path}: {exc}") from exc
    if not isinstance(payload, dict):
        raise AnalysisError(f"JSON root is not an object: {path}")
    return payload


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except Exception as exc:
        raise AnalysisError(f"cannot read JSONL {path}: {exc}") from exc
    rows: list[dict[str, Any]] = []
    for line_number, line in enumerate(lines, 1):
        if not line.strip():
            continue
        try:
            row = json.loads(line)
        except Exception as exc:
            raise AnalysisError(
                f"invalid JSONL row {path}:{line_number}: {exc}"
            ) from exc
        if not isinstance(row, dict):
            raise AnalysisError(f"JSONL row is not an object: {path}:{line_number}")
        rows.append(row)
    return rows


def as_decimal(value: object, label: str) -> Decimal:
    try:
        number = Decimal(str(value))
    except (InvalidOperation, ValueError) as exc:
        raise AnalysisError(f"{label} is not a decimal: {value!r}") from exc
    if not number.is_finite():
        raise AnalysisError(f"{label} is not finite: {value!r}")
    return number


def positive_decimal(value: object, label: str) -> Decimal:
    number = as_decimal(value, label)
    if number <= 0:
        raise AnalysisError(f"{label} must be positive")
    return number


def decimal_text(value: Decimal) -> str:
    """Return a stable 30-significant-digit scientific representation."""

    if value.is_zero():
        return "0"
    return format(value, ".29E")


def log10_positive(value: object, label: str) -> Decimal:
    number = positive_decimal(value, label)
    with localcontext() as context:
        context.prec = 120
        return number.log10()


def ols(xs: Iterable[Decimal], ys: Iterable[Decimal]) -> tuple[Decimal, Decimal]:
    x_values = list(xs)
    y_values = list(ys)
    if len(x_values) != len(y_values) or len(x_values) < 2:
        raise AnalysisError("OLS requires at least two matched points")
    with localcontext() as context:
        context.prec = 120
        count = Decimal(len(x_values))
        x_mean = sum(x_values, Decimal(0)) / count
        y_mean = sum(y_values, Decimal(0)) / count
        denominator = sum((value - x_mean) ** 2 for value in x_values)
        if denominator == 0:
            raise AnalysisError("OLS x coordinates are degenerate")
        slope = sum(
            (x_value - x_mean) * (y_value - y_mean)
            for x_value, y_value in zip(x_values, y_values)
        ) / denominator
        return slope, y_mean - slope * x_mean


def scale_key(row: dict[str, Any]) -> tuple[int, str]:
    try:
        beta = int(row["beta"])
        constant = str(row["constant"])
    except Exception as exc:
        raise AnalysisError(f"invalid scale row: {exc}") from exc
    return beta, constant


def scale_sort_key(key: tuple[int, str]) -> tuple[int, Decimal]:
    return key[0], as_decimal(key[1], "scale constant")


def scale_map(payload: dict[str, Any], label: str) -> dict[tuple[int, str], dict[str, Any]]:
    rows = payload.get("scaled_h_diagnostics")
    if not isinstance(rows, list):
        raise AnalysisError(f"{label} has no scaled_h_diagnostics array")
    mapped: dict[tuple[int, str], dict[str, Any]] = {}
    for row in rows:
        if not isinstance(row, dict):
            raise AnalysisError(f"{label} contains a non-object scale row")
        key = scale_key(row)
        if key in mapped:
            raise AnalysisError(f"{label} repeats scale {key}")
        mapped[key] = row
    if set(mapped) != set(EXPECTED_SCALES):
        raise AnalysisError(
            f"{label} scale grid differs: {sorted(mapped, key=scale_sort_key)}"
        )
    return mapped


def resolve_inside(root: Path, relative: object, label: str) -> Path:
    path = Path(str(relative))
    resolved = path.resolve() if path.is_absolute() else (root / path).resolve()
    root_resolved = root.resolve()
    try:
        resolved.relative_to(root_resolved)
    except ValueError as exc:
        raise AnalysisError(f"{label} leaves analysis root: {path}") from exc
    return resolved


def validate_egf_binding(
    root: Path,
    binding: object,
    cache: dict[Path, str],
    label: str,
) -> str:
    if not isinstance(binding, dict):
        raise AnalysisError(f"{label} has no EGF manifest binding")
    if binding.get("status") != EXPECTED_EGF_STATUS:
        raise AnalysisError(f"{label} EGF status is not {EXPECTED_EGF_STATUS}")
    path = resolve_inside(root, binding.get("path"), f"{label} EGF path")
    if not path.is_file():
        raise AnalysisError(f"{label} EGF manifest does not exist: {path}")
    digest = cache.get(path)
    if digest is None:
        manifest = load_json(path)
        if manifest.get("status") != EXPECTED_EGF_STATUS:
            raise AnalysisError(f"bound EGF manifest has wrong status: {path}")
        if manifest.get("parameters") != {
            "full_polynomial_degree": 64,
            "scalar_degree": 128,
        }:
            raise AnalysisError(f"bound EGF manifest has wrong parameters: {path}")
        checks = manifest.get("checks")
        if not isinstance(checks, dict) or checks.get("all_exact_checks_passed") is not True:
            raise AnalysisError(f"bound EGF manifest did not pass exact checks: {path}")
        digest = sha256_path(path)
        cache[path] = digest
    if binding.get("sha256") != digest:
        raise AnalysisError(f"{label} EGF manifest SHA-256 mismatch")
    return digest


def expected_task_grid() -> dict[str, dict[str, object]]:
    grid: dict[str, dict[str, object]] = {}
    for replay, rows in (
        (False, EXPECTED_PRIMARY_N_DPS),
        (True, EXPECTED_REPLAY_N_DPS),
    ):
        replay_tag = "_replay" if replay else ""
        for n, dps in rows:
            for parity in ("even", "odd"):
                task_id = f"pair_n{n:02d}_{parity}{replay_tag}_p{dps}"
                grid[task_id] = {
                    "n": n,
                    "parity": parity,
                    "dps": dps,
                    "anchor_h": "0",
                    "scale_grid": EXPECTED_SCALE_GRID_ID,
                    "max_orbit": EXPECTED_MAX_ORBIT,
                }
    return grid


def option_values(argv: list[object], option: str) -> list[str]:
    values: list[str] = []
    for index, value in enumerate(argv):
        if value == option:
            if index + 1 >= len(argv):
                raise AnalysisError(f"task argv ends after {option}")
            values.append(str(argv[index + 1]))
    return values


def validate_queue_manifest(
    root: Path,
    manifest: dict[str, Any],
    tasks: dict[str, dict[str, Any]],
    egf_cache: dict[Path, str],
) -> tuple[str, Path]:
    if manifest.get("schema_version") != 1 or manifest.get("stage") != "stage1":
        raise AnalysisError("task manifest is not a schema-1 stage1 queue")
    manifest_reference = manifest.get("egf_manifest")
    manifest_sha256 = manifest.get("egf_manifest_sha256")
    if not isinstance(manifest_reference, str) or not isinstance(manifest_sha256, str):
        raise AnalysisError("task manifest lacks its EGF path/SHA-256 binding")
    if len(manifest_sha256) != 64:
        raise AnalysisError("task manifest EGF SHA-256 has the wrong length")
    actual_sha256 = validate_egf_binding(
        root,
        {
            "path": manifest_reference,
            "sha256": manifest_sha256,
            "status": EXPECTED_EGF_STATUS,
        },
        egf_cache,
        "task manifest",
    )
    expected = expected_task_grid()
    if set(tasks) != set(expected):
        missing = sorted(set(expected) - set(tasks))
        extra = sorted(set(tasks) - set(expected))
        raise AnalysisError(f"task grid differs: missing={missing}, extra={extra}")
    expected_scale_arguments = [f"{beta}:{constant}" for beta, constant in EXPECTED_SCALES]
    for task_id, task in tasks.items():
        if task.get("expected_status") != EXPECTED_STATUS:
            raise AnalysisError(f"{task_id} has the wrong expected status")
        if task.get("expected_parameters") != expected[task_id]:
            raise AnalysisError(f"{task_id} expected parameters differ from the exact grid")
        if not str(task.get("worker", "")).endswith("/src/signed_h_pair.py"):
            raise AnalysisError(f"{task_id} has the wrong worker")
        if not Path(str(task.get("output", ""))).as_posix().endswith(
            f"results/{task_id}.json"
        ):
            raise AnalysisError(f"{task_id} has the wrong output path")
        argv = task.get("argv")
        if not isinstance(argv, list):
            raise AnalysisError(f"{task_id} has no argv array")
        single_options = {
            "--n": str(expected[task_id]["n"]),
            "--parity": str(expected[task_id]["parity"]),
            "--anchor-h": "0",
            "--dps": str(expected[task_id]["dps"]),
            "--egf-manifest": manifest_reference,
            "--max-orbit": str(EXPECTED_MAX_ORBIT),
            "--max-seconds": "600",
            "--max-output-bytes": "8388608",
        }
        for option, value in single_options.items():
            if option_values(argv, option) != [value]:
                raise AnalysisError(f"{task_id} argv binding differs for {option}")
        if option_values(argv, "--scaled-h") != expected_scale_arguments:
            raise AnalysisError(f"{task_id} scaled-h grid differs")
        expected_argv = [
            "--n",
            str(expected[task_id]["n"]),
            "--parity",
            str(expected[task_id]["parity"]),
            "--anchor-h",
            "0",
            "--dps",
            str(expected[task_id]["dps"]),
        ]
        for scale in expected_scale_arguments:
            expected_argv.extend(("--scaled-h", scale))
        expected_argv.extend(
            (
                "--egf-manifest",
                manifest_reference,
                "--max-orbit",
                str(EXPECTED_MAX_ORBIT),
                "--max-seconds",
                "600",
                "--max-output-bytes",
                "8388608",
            )
        )
        if [str(value) for value in argv] != expected_argv:
            raise AnalysisError(f"{task_id} argv differs from the exact task grid")
    return actual_sha256, resolve_inside(root, manifest_reference, "queue EGF path")


def validate_result(
    root: Path,
    task: dict[str, Any],
    receipt: dict[str, Any],
    egf_cache: dict[Path, str],
) -> dict[str, Any]:
    task_id = str(task["id"])
    output_relative = str(task["output"])
    reported_output = str(receipt.get("output", ""))
    if not Path(reported_output).as_posix().endswith(Path(output_relative).as_posix()):
        raise AnalysisError(f"{task_id} receipt output does not match task manifest")
    output = resolve_inside(root, output_relative, f"{task_id} output")
    if not output.is_file():
        raise AnalysisError(f"{task_id} output is missing: {output}")
    digest = sha256_path(output)
    if receipt.get("sha256") != digest:
        raise AnalysisError(f"{task_id} output SHA-256 does not match receipt")
    payload = load_json(output)
    expected_status = task.get("expected_status", EXPECTED_STATUS)
    if payload.get("status") != expected_status:
        raise AnalysisError(f"{task_id} result status does not match manifest")
    expected_parameters = task.get("expected_parameters")
    parameters = payload.get("parameters")
    if not isinstance(expected_parameters, dict) or not isinstance(parameters, dict):
        raise AnalysisError(f"{task_id} parameters are not objects")
    mismatched = {
        key: (value, parameters.get(key))
        for key, value in expected_parameters.items()
        if parameters.get(key) != value
    }
    if mismatched:
        raise AnalysisError(f"{task_id} parameter mismatch: {mismatched}")
    if expected_status != EXPECTED_STATUS:
        raise AnalysisError(f"{task_id} is not a signed-pair task")
    for key in ("n", "parity", "dps"):
        if key not in parameters:
            raise AnalysisError(f"{task_id} lacks parameter {key}")
    center = payload.get("center_interpolant")
    if not isinstance(center, dict):
        raise AnalysisError(f"{task_id} lacks center_interpolant")
    for metric in CENTER_METRICS:
        as_decimal(center.get(metric), f"{task_id} center {metric}")
    rows = scale_map(payload, task_id)
    for key, row in rows.items():
        for metric in SCALE_METRICS:
            as_decimal(row.get(metric), f"{task_id} {key} {metric}")
        positive_decimal(row.get("h"), f"{task_id} {key} h")
        contributions = row.get("orbit_signed_contributions")
        cumulative = row.get("orbit_cumulative_signed")
        if not isinstance(contributions, list) or not isinstance(cumulative, list):
            raise AnalysisError(f"{task_id} {key} orbit profiles are not arrays")
        if not contributions or len(contributions) != len(cumulative):
            raise AnalysisError(f"{task_id} {key} orbit profiles have unequal lengths")
        for index, value in enumerate(contributions):
            as_decimal(value, f"{task_id} {key} contribution {index}")
        for index, value in enumerate(cumulative):
            as_decimal(value, f"{task_id} {key} cumulative {index}")
    egf_digest = validate_egf_binding(
        root, payload.get("egf_manifest"), egf_cache, task_id
    )
    return {
        "task": task,
        "payload": payload,
        "sha256": digest,
        "output": output_relative,
        "n": int(parameters["n"]),
        "parity": str(parameters["parity"]),
        "dps": int(parameters["dps"]),
        "scales": rows,
        "egf_sha256": egf_digest,
        "egf_path": resolve_inside(
            root,
            payload["egf_manifest"]["path"],
            f"{task_id} EGF path",
        ),
    }


def bind_inputs(
    root: Path,
    tasks_path: Path,
    completed_path: Path,
    failed_path: Path,
) -> tuple[
    list[dict[str, Any]],
    list[dict[str, Any]],
    dict[str, Any],
]:
    task_manifest = load_json(tasks_path)
    raw_tasks = task_manifest.get("tasks")
    if not isinstance(raw_tasks, list) or not raw_tasks:
        raise AnalysisError("task manifest has no tasks")
    tasks: dict[str, dict[str, Any]] = {}
    for task in raw_tasks:
        if not isinstance(task, dict) or not isinstance(task.get("id"), str):
            raise AnalysisError("task manifest contains an invalid task")
        task_id = task["id"]
        if task_id in tasks:
            raise AnalysisError(f"duplicate task id: {task_id}")
        tasks[task_id] = task

    completed_rows = load_jsonl(completed_path)
    failed_rows = load_jsonl(failed_path)
    receipts: dict[str, tuple[str, dict[str, Any]]] = {}
    for kind, rows in (("completed", completed_rows), ("failed", failed_rows)):
        for row in rows:
            task_id = row.get("task")
            if task_id not in tasks:
                raise AnalysisError(f"{kind} receipt refers to unknown task: {task_id}")
            if task_id in receipts:
                raise AnalysisError(f"task has more than one receipt: {task_id}")
            returncode = row.get("returncode")
            if kind == "completed" and returncode != 0:
                raise AnalysisError(f"completed receipt has nonzero return code: {task_id}")
            if kind == "failed" and (not isinstance(returncode, int) or returncode == 0):
                raise AnalysisError(f"failed receipt has invalid return code: {task_id}")
            receipts[str(task_id)] = (kind, row)
    missing = sorted(set(tasks) - set(receipts))
    if missing:
        raise AnalysisError(f"tasks lack terminal receipts: {missing}")

    egf_cache: dict[Path, str] = {}
    queue_egf_sha256, queue_egf_path = validate_queue_manifest(
        root, task_manifest, tasks, egf_cache
    )
    accepted: list[dict[str, Any]] = []
    failures: list[dict[str, Any]] = []
    for task_id in sorted(tasks):
        kind, receipt = receipts[task_id]
        task = tasks[task_id]
        parameters = task.get("expected_parameters")
        if not isinstance(parameters, dict):
            raise AnalysisError(f"{task_id} has no expected parameters")
        if kind == "completed":
            result = validate_result(root, task, receipt, egf_cache)
            if result["egf_sha256"] != queue_egf_sha256:
                raise AnalysisError(f"{task_id} EGF SHA-256 differs from its queue")
            if result["egf_path"] != queue_egf_path:
                raise AnalysisError(f"{task_id} EGF path differs from its queue")
            accepted.append(result)
        else:
            failures.append(
                {
                    "task_id": task_id,
                    "returncode": int(receipt["returncode"]),
                    "n": int(parameters["n"]),
                    "parity": str(parameters["parity"]),
                    "dps": int(parameters["dps"]),
                }
            )

    integrity = {
        "task_count": len(tasks),
        "completed_count": len(completed_rows),
        "failed_count": len(failed_rows),
        "all_tasks_have_one_terminal_receipt": True,
        "receipt_hashes_match": True,
        "status_and_parameter_gates_pass": True,
        "egf_manifest_bindings_pass": True,
        "queue_stage_and_exact_grid_pass": True,
        "queue_egf_manifest_sha256": queue_egf_sha256,
        "task_manifest_sha256": sha256_path(tasks_path),
        "completed_receipts_sha256": sha256_path(completed_path),
        "failed_receipts_sha256": sha256_path(failed_path),
    }
    return accepted, failures, integrity


def select_sources(
    accepted: list[dict[str, Any]],
    failures: list[dict[str, Any]],
) -> tuple[dict[tuple[int, str], dict[str, Any]], list[dict[str, Any]], str]:
    groups: dict[tuple[int, str], list[dict[str, Any]]] = {}
    for result in accepted:
        groups.setdefault((result["n"], result["parity"]), []).append(result)
    expected_groups = set(groups)
    expected_groups.update((row["n"], row["parity"]) for row in failures)
    missing = sorted(expected_groups - set(groups))
    if missing:
        raise AnalysisError(f"no accepted result covers groups: {missing}")

    selected: dict[tuple[int, str], dict[str, Any]] = {}
    rows: list[dict[str, Any]] = []
    for key in sorted(groups, key=lambda item: (item[0], item[1])):
        candidates = groups[key]
        maximum_dps = max(row["dps"] for row in candidates)
        choice = min(
            (row for row in candidates if row["dps"] == maximum_dps),
            key=lambda row: str(row["task"]["id"]),
        )
        selected[key] = choice
        rows.append(
            {
                "n": choice["n"],
                "parity": choice["parity"],
                "dps": choice["dps"],
                "task_id": choice["task"]["id"],
                "output": choice["output"],
                "sha256": choice["sha256"],
            }
        )
    return selected, rows, f"{len(selected)}/{len(expected_groups)}"


def agreement_digits(first: object, second: object, label: str) -> Decimal | None:
    left = as_decimal(first, f"{label} first")
    right = as_decimal(second, f"{label} second")
    if left == right:
        return None
    denominator = max(abs(left), abs(right))
    if denominator == 0:
        return None
    with localcontext() as context:
        context.prec = 120
        return -(abs(left - right) / denominator).log10()


def replay_gates(
    accepted: list[dict[str, Any]],
    failures: list[dict[str, Any]],
    replay_digits: Decimal,
) -> list[dict[str, Any]]:
    accepted_groups: dict[tuple[int, str], list[dict[str, Any]]] = {}
    failed_groups: dict[tuple[int, str], list[dict[str, Any]]] = {}
    for row in accepted:
        accepted_groups.setdefault((row["n"], row["parity"]), []).append(row)
    for row in failures:
        failed_groups.setdefault((row["n"], row["parity"]), []).append(row)

    output: list[dict[str, Any]] = []
    keys = set(accepted_groups) | set(failed_groups)
    for key in sorted(keys, key=lambda item: (item[0], item[1])):
        candidates = sorted(
            accepted_groups.get(key, []), key=lambda row: (row["dps"], row["task"]["id"])
        )
        failed = sorted(failed_groups.get(key, []), key=lambda row: row["dps"])
        if len(candidates) < 2 and not failed:
            continue
        selected = candidates[-1]
        if len(candidates) >= 2:
            primary = candidates[0]
            digits: list[Decimal] = []
            comparisons = 0
            for metric in CENTER_METRICS:
                value = agreement_digits(
                    primary["payload"]["center_interpolant"][metric],
                    selected["payload"]["center_interpolant"][metric],
                    f"{key} center {metric}",
                )
                comparisons += 1
                if value is not None:
                    digits.append(value)
            improvements: list[dict[str, Any]] = []
            for scale in EXPECTED_SCALES:
                first_row = primary["scales"][scale]
                second_row = selected["scales"][scale]
                for metric in SCALE_METRICS:
                    value = agreement_digits(
                        first_row[metric], second_row[metric], f"{key} {scale} {metric}"
                    )
                    comparisons += 1
                    if value is not None:
                        digits.append(value)
                first_residual = log10_positive(
                    first_row["paired_identity_relative_residual"],
                    f"{key} {scale} primary residual",
                )
                second_residual = log10_positive(
                    second_row["paired_identity_relative_residual"],
                    f"{key} {scale} replay residual",
                )
                improvements.append(
                    {
                        "beta": scale[0],
                        "constant": scale[1],
                        "primary_log10_residual": decimal_text(first_residual),
                        "replay_log10_residual": decimal_text(second_residual),
                        "improvement_decimal_orders": decimal_text(
                            first_residual - second_residual
                        ),
                    }
                )
            minimum = min(digits) if digits else None
            output.append(
                {
                    "n": key[0],
                    "parity": key[1],
                    "status": "accepted_primary_and_replay",
                    "primary_task": primary["task"]["id"],
                    "replay_task": selected["task"]["id"],
                    "emitted_values_compared": comparisons,
                    "exact_at_emitted_precision": minimum is None,
                    "minimum_agreement_decimal_digits": (
                        None if minimum is None else decimal_text(minimum)
                    ),
                    "required_decimal_digits": decimal_text(replay_digits),
                    "gate_pass": minimum is None or minimum >= replay_digits,
                    "identity_residual_improvements": improvements,
                }
            )
            continue

        center_ell = abs(
            as_decimal(
                selected["payload"]["center_interpolant"]["ell_A"],
                f"{key} selected ell",
            )
        )
        if center_ell == 0:
            raise AnalysisError(f"{key} selected ell is zero; precision budget undefined")
        with localcontext() as context:
            context.prec = 120
            ell_log = center_ell.log10()
        residual_digits = min(
            -log10_positive(
                row["paired_identity_relative_residual"],
                f"{key} selected residual",
            )
            for row in selected["scales"].values()
        )
        output.append(
            {
                "n": key[0],
                "parity": key[1],
                "status": "accepted_replay_after_failed_primary",
                "replay_task": selected["task"]["id"],
                "failed_tasks": [row["task_id"] for row in failed],
                "log10_abs_ell": decimal_text(ell_log),
                "precision_budgets": [
                    {
                        "task_id": row["task_id"],
                        "dps": row["dps"],
                        "dps_plus_log10_abs_ell": decimal_text(
                            Decimal(row["dps"]) + ell_log
                        ),
                    }
                    for row in [*failed, {
                        "task_id": selected["task"]["id"],
                        "dps": selected["dps"],
                    }]
                ],
                "minimum_identity_residual_decimal_digits": decimal_text(residual_digits),
                "required_decimal_digits": decimal_text(replay_digits),
                "numerical_accuracy_gate_pass": residual_digits >= replay_digits,
                "replay_agreement_gate_pass": False,
                "gate_pass": False,
                "gate_detail": (
                    "the accepted high-precision result has enough residual digits, "
                    "but the failed primary left no second successful result for the "
                    "documented replay-agreement gate"
                ),
            }
        )
    return output


def regression_rows(
    selected: dict[tuple[int, str], dict[str, Any]],
    fit_min_n: int,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    parities = sorted({parity for _, parity in selected})
    tv_output: list[dict[str, Any]] = []
    energy_output: list[dict[str, Any]] = []
    for parity in parities:
        n_values = sorted(n for n, candidate_parity in selected if candidate_parity == parity)
        fit_n = [n for n in n_values if n >= fit_min_n]
        if len(fit_n) < 2:
            raise AnalysisError(f"not enough {parity} degrees at or above {fit_min_n}")
        for scale in EXPECTED_SCALES:
            tv_y = [
                log10_positive(
                    selected[(n, parity)]["scales"][scale][
                        "total_variation_over_abs_signed_total"
                    ],
                    f"{parity} N={n} {scale} TV ratio",
                )
                for n in fit_n
            ]
            tv_x = [Decimal(n * n) for n in fit_n]
            tv_slope, tv_intercept = ols(tv_x, tv_y)
            tv_output.append(
                {
                    "parity": parity,
                    "beta": scale[0],
                    "constant": scale[1],
                    "n_values": fit_n,
                    "log10_values": [decimal_text(value) for value in tv_y],
                    "slope_per_n_squared": decimal_text(tv_slope),
                    "intercept": decimal_text(tv_intercept),
                }
            )

            energy_y = [
                log10_positive(
                    selected[(n, parity)]["scales"][scale][
                        "local_feature_energy_0_to_h_simpson16"
                    ],
                    f"{parity} N={n} {scale} local energy",
                )
                for n in fit_n
            ]
            energy_x = [log10_positive(n, f"N={n}") for n in fit_n]
            energy_slope, energy_intercept = ols(energy_x, energy_y)
            energy_output.append(
                {
                    "parity": parity,
                    "beta": scale[0],
                    "constant": scale[1],
                    "n_values": fit_n,
                    "log10_values": [decimal_text(value) for value in energy_y],
                    "slope_vs_log10_n": decimal_text(energy_slope),
                    "intercept": decimal_text(energy_intercept),
                }
            )
    return tv_output, energy_output


def profile_rows(
    selected: dict[tuple[int, str], dict[str, Any]],
    threshold: Decimal,
) -> list[dict[str, Any]]:
    parities = sorted({parity for _, parity in selected})
    output: list[dict[str, Any]] = []
    for parity in parities:
        degrees = sorted(n for n, candidate_parity in selected if candidate_parity == parity)
        if len(degrees) < 2:
            raise AnalysisError(f"not enough {parity} degrees for profile comparison")
        low_n, high_n = degrees[-2:]
        for scale in EXPECTED_SCALES:
            low_row = selected[(low_n, parity)]["scales"][scale]
            high_row = selected[(high_n, parity)]["scales"][scale]
            low_tv = positive_decimal(low_row["total_variation"], "low total variation")
            high_tv = positive_decimal(high_row["total_variation"], "high total variation")
            with localcontext() as context:
                context.prec = 120
                low_contributions = [
                    as_decimal(value, "low contribution") / low_tv
                    for value in low_row["orbit_signed_contributions"]
                ]
                high_contributions = [
                    as_decimal(value, "high contribution") / high_tv
                    for value in high_row["orbit_signed_contributions"]
                ]
                low_cumulative = [
                    as_decimal(value, "low cumulative") / low_tv
                    for value in low_row["orbit_cumulative_signed"]
                ]
                high_cumulative = [
                    as_decimal(value, "high cumulative") / high_tv
                    for value in high_row["orbit_cumulative_signed"]
                ]
                if len(low_contributions) != len(high_contributions):
                    raise AnalysisError(f"profile lengths differ for {parity} {scale}")
                contribution_l1 = sum(
                    (abs(left - right) for left, right in zip(low_contributions, high_contributions)),
                    Decimal(0),
                )
                cumulative_linf = max(
                    abs(left - right)
                    for left, right in zip(low_cumulative, high_cumulative)
                )
            output.append(
                {
                    "parity": parity,
                    "beta": scale[0],
                    "constant": scale[1],
                    "n_low": low_n,
                    "n_high": high_n,
                    "contribution_l1_distance": decimal_text(contribution_l1),
                    "cumulative_linf_distance": decimal_text(cumulative_linf),
                    "threshold": decimal_text(threshold),
                    "gate_pass": max(contribution_l1, cumulative_linf) <= threshold,
                }
            )
    return output


def taylor_rows(
    selected: dict[tuple[int, str], dict[str, Any]],
) -> list[dict[str, Any]]:
    output: list[dict[str, Any]] = []
    powers = {"even": 1, "odd": 3}
    for parity in sorted({parity for _, parity in selected}):
        if parity not in powers:
            raise AnalysisError(f"unknown parity for Taylor normalization: {parity}")
        degree = max(n for n, candidate_parity in selected if candidate_parity == parity)
        power = powers[parity]
        for scale in (key for key in EXPECTED_SCALES if key[0] == 2):
            row = selected[(degree, parity)]["scales"][scale]
            energy = positive_decimal(
                row["local_feature_energy_0_to_h_simpson16"], "local energy"
            )
            h_value = positive_decimal(row["h"], "h")
            with localcontext() as context:
                context.prec = 120
                normalized = energy / (h_value**power)
                normalized_log = normalized.log10()
            output.append(
                {
                    "parity": parity,
                    "n": degree,
                    "beta": scale[0],
                    "constant": scale[1],
                    "h_power": power,
                    "energy_over_h_power": decimal_text(normalized),
                    "log10_energy_over_h_power": decimal_text(normalized_log),
                }
            )
    return output


def caveats(selected: dict[tuple[int, str], dict[str, Any]]) -> dict[str, bool]:
    rows = [row for result in selected.values() for row in result["scales"].values()]
    local_rigorous = all(row.get("local_energy_is_rigorous") is True for row in rows)
    tail_rigorous = all(
        isinstance(row.get(side), dict) and row[side].get("rigorous_bound") is True
        for row in rows
        for side in ("minus_tail_diagnostic", "plus_tail_diagnostic")
    )
    return {
        "local_energy_rigorous": local_rigorous,
        "orbit_tail_bounds_rigorous": tail_rigorous,
        "shrinking_profile_promotion_gate_evaluated": False,
        "crossing_exponent_promotion_gate_evaluated": False,
        "any_scale_profile_promoted": False,
        "finite_results_prove_target": False,
    }


def build_analysis(
    *,
    root: Path,
    tasks_path: Path,
    completed_path: Path,
    failed_path: Path,
    replay_digits: Decimal = Decimal(30),
    profile_threshold: Decimal = Decimal("0.1"),
    fit_min_n: int = 12,
) -> dict[str, Any]:
    if replay_digits <= 0:
        raise AnalysisError("replay digit threshold must be positive")
    if profile_threshold <= 0:
        raise AnalysisError("profile threshold must be positive")
    accepted, failures, integrity = bind_inputs(
        root.resolve(), tasks_path.resolve(), completed_path.resolve(), failed_path.resolve()
    )
    selected, selected_rows, coverage = select_sources(accepted, failures)
    integrity["selected_group_coverage"] = coverage
    tv_regressions, energy_regressions = regression_rows(selected, fit_min_n)
    return {
        "schema_version": 1,
        "analysis": "signed_h_pair_stage1_summary",
        "scope": "finite diagnostics only; not a proof of the target inequality or RH",
        "analysis_parameters": {
            "fit_min_n": fit_min_n,
            "replay_decimal_digits": decimal_text(replay_digits),
            "profile_threshold": decimal_text(profile_threshold),
            "source_selection": (
                "highest accepted dps per (n, parity), then lexicographically first task id"
            ),
        },
        "input_integrity": integrity,
        "selected_sources": selected_rows,
        "failed_tasks": sorted(failures, key=lambda row: row["task_id"]),
        "replay_gates": replay_gates(accepted, failures, replay_digits),
        "tv_cancellation_regressions": tv_regressions,
        "local_energy_regressions": energy_regressions,
        "profile_comparisons": profile_rows(selected, profile_threshold),
        "taylor_normalizations": taylor_rows(selected),
        "caveats": caveats(selected),
    }


def encoded(payload: object) -> str:
    return json.dumps(payload, indent=2, sort_keys=True) + "\n"


def write_output(path: str, payload: object) -> None:
    text = encoded(payload)
    if path == "-":
        sys.stdout.write(text)
        return
    output = Path(path)
    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = output.with_name(f".{output.name}.{os.getpid()}.tmp")
    try:
        with temporary.open("w", encoding="utf-8") as handle:
            handle.write(text)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, output)
    finally:
        if temporary.exists():
            temporary.unlink()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=CHECKPOINT_ROOT)
    parser.add_argument("--tasks", type=Path, default=WORKSTREAM_ROOT / "tasks-stage1.json")
    parser.add_argument(
        "--completed", type=Path, default=WORKSTREAM_ROOT / "run-stage1" / "completed.jsonl"
    )
    parser.add_argument(
        "--failed", type=Path, default=WORKSTREAM_ROOT / "run-stage1" / "failed.jsonl"
    )
    parser.add_argument("--output", default="-")
    parser.add_argument("--replay-digits", type=Decimal, default=Decimal(30))
    parser.add_argument("--profile-threshold", type=Decimal, default=Decimal("0.1"))
    parser.add_argument("--fit-min-n", type=int, default=12)
    args = parser.parse_args()
    try:
        payload = build_analysis(
            root=args.root,
            tasks_path=args.tasks,
            completed_path=args.completed,
            failed_path=args.failed,
            replay_digits=args.replay_digits,
            profile_threshold=args.profile_threshold,
            fit_min_n=args.fit_min_n,
        )
        write_output(args.output, payload)
    except AnalysisError as exc:
        print(f"analysis rejected: {exc}", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
