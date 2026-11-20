#!/usr/bin/env python3
"""Probe the signed arithmetic-variation identities at n=3 and n=5.

This is a bounded floating structure diagnostic. It reconstructs the
SHA-bound actual-theta polynomial prefix with Arb, then evaluates the complete
theta series and the x/u quadratures in double precision. Agreement of the
direct, Laplace, Abel, and common-scale Stieltjes representations checks the
implementation and suggests analytic lemmas; it is not an interval certificate
and has no all-degree or RH implication.
"""
from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import math
import os
from pathlib import Path
import platform
import sys
from typing import Any

import numpy as np
from flint import ctx
from numpy.polynomial.legendre import leggauss


SOURCE = Path(__file__).resolve()
WORKSTREAM = SOURCE.parents[1]
CHECKPOINT = SOURCE.parents[3]
ANGLE_SOURCE = (
    CHECKPOINT
    / "workstreams/actual-theta-angle-wave27-20261103/src/"
    "certify_actual_theta_angle.py"
)
OPERATOR_SOURCE = (
    CHECKPOINT
    / "workstreams/all-degree-analytic-search/src/operator_mining.py"
)
SCHEMA_VERSION = "zsv.signed_arithmetic_variation.v1"
DEGREES = (3, 5)
ZETA_THREE = 1.2020569031595942854


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"cannot load {path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


ANGLE = load_module("wave29_actual_angle", ANGLE_SOURCE)
OPERATOR = load_module("wave29_operator_mining", OPERATOR_SOURCE)


def progress(enabled: bool, event: str, **fields: object) -> None:
    if enabled:
        print(
            json.dumps({"event": event, **fields}, sort_keys=True),
            file=sys.stderr,
            flush=True,
        )


def atomic_write(path: Path, payload: dict[str, object]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + f".tmp.{os.getpid()}")
    with temporary.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2, sort_keys=True, allow_nan=False)
        handle.write("\n")
        handle.flush()
        os.fsync(handle.fileno())
    os.replace(temporary, path)


def receipt_payload_sha256(payload: dict[str, object]) -> str:
    stripped = dict(payload)
    stripped.pop("receipt_integrity", None)
    canonical = json.dumps(
        stripped, sort_keys=True, separators=(",", ":"), ensure_ascii=True
    ).encode()
    return hashlib.sha256(canonical).hexdigest()


def midpoint(value: Any) -> float:
    return float(value.mid())


def finite(value: float) -> float:
    result = float(value)
    if not math.isfinite(result):
        raise FloatingPointError(f"non-finite diagnostic value: {result}")
    return result


def jordan_two(n: int) -> int:
    """Return the standard Jordan totient J_2(n)."""
    result = n * n
    remainder = n
    prime = 2
    while prime * prime <= remainder:
        if remainder % prime == 0:
            result = result // (prime * prime) * (prime * prime - 1)
            while remainder % prime == 0:
                remainder //= prime
        prime += 1
    if remainder > 1:
        result = result // (remainder * remainder) * (remainder * remainder - 1)
    return result


def coefficient_midpoints(polynomial: dict[int, Any]) -> dict[int, float]:
    return {order: midpoint(value) for order, value in polynomial.items()}


def combine_rows(values: np.ndarray, coefficients: dict[int, float]) -> np.ndarray:
    total = np.zeros(values.shape[1:], dtype=float)
    for order, coefficient in coefficients.items():
        total += coefficient * values[order]
    return total


def relative_error(observed: float, reference: float) -> float:
    return abs(observed - reference) / max(abs(reference), 1.0e-30)


def gauss_cells(
    nodes_per_cell: int, upper: int
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    raw_nodes, raw_weights = leggauss(nodes_per_cell)
    points: list[np.ndarray] = []
    weights: list[np.ndarray] = []
    cells: list[np.ndarray] = []
    for cell in range(1, upper):
        points.append(cell + 0.5 * (raw_nodes + 1.0))
        weights.append(0.5 * raw_weights)
        cells.append(np.full(nodes_per_cell, cell, dtype=int))
    return np.concatenate(points), np.concatenate(weights), np.concatenate(cells)


def prefix_sums(upper: int) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    jordan = np.zeros(upper + 1, dtype=float)
    s_zero = np.zeros(upper + 1, dtype=float)
    s_one = np.zeros(upper + 1, dtype=float)
    for value in range(1, upper + 1):
        jordan[value] = jordan_two(value)
        s_zero[value] = s_zero[value - 1] + jordan[value]
        s_one[value] = s_one[value - 1] + jordan[value] / value
    return jordan, s_zero, s_one


def orbit_values(
    points: np.ndarray,
    max_order: int,
    shift: float,
    maximum_orbit: int,
) -> tuple[np.ndarray, dict[str, object]]:
    polynomials = OPERATOR.orbit_polynomials(max_order, shift)
    return OPERATOR.evaluate_complete_orbits(
        np.asarray(points, dtype=float).ravel(),
        polynomials,
        relative_tolerance=3.0e-15,
        absolute_tolerance=1.0e-300,
        maximum_orbit=maximum_orbit,
    )


def probe_degree(
    degree: int,
    moments: list[Any],
    u: np.ndarray,
    u_weights: np.ndarray,
    x: np.ndarray,
    x_weights: np.ndarray,
    x_cells: np.ndarray,
    x_upper: int,
    maximum_orbit: int,
    representation_rtol: float,
) -> dict[str, object]:
    current, norm, _ = ANGLE.monic_target_polynomial(moments, degree)
    following, _, _ = ANGLE.monic_target_polynomial(moments, degree + 1)
    residual = ANGLE.residual(following, current, degree)
    current_coefficients = coefficient_midpoints(current)
    residual_coefficients = coefficient_midpoints(residual)
    physical_norm = midpoint(norm)

    direct_order = max(max(current_coefficients), max(residual_coefficients))
    direct_rows, direct_report = orbit_values(
        u, direct_order, 0.0, maximum_orbit
    )
    feature = combine_rows(direct_rows, current_coefficients)
    residual_feature = combine_rows(direct_rows, residual_coefficients)
    direct_inner = finite(np.dot(u_weights, u * feature * residual_feature))
    direct_target = direct_inner / (2.0 * math.pi)
    angle = direct_inner / physical_norm

    integers = np.arange(1, x_upper + 1, dtype=float)
    all_x = np.concatenate((x, integers))
    shifted_points = u[None, :] + np.log(all_x)[:, None]
    shifted_order = max(residual_coefficients) + 1
    shifted_rows_flat, shifted_report = orbit_values(
        shifted_points, shifted_order, 2.0, maximum_orbit
    )
    shifted_rows = shifted_rows_flat.reshape(
        shifted_rows_flat.shape[0], len(all_x), len(u)
    )
    shifted_q = combine_rows(shifted_rows, residual_coefficients)
    shifted_d2_q = np.zeros_like(shifted_q)
    for order, coefficient in residual_coefficients.items():
        shifted_d2_q += coefficient * shifted_rows[order + 1]
    shifted_d5half_q = shifted_d2_q + 0.5 * shifted_q

    base_weights = u_weights * u * np.exp(2.0 * u) * feature
    gamma_all = all_x**2 * np.einsum("xu,u->x", shifted_q, base_weights)
    gamma_prime_all = all_x * np.einsum(
        "xu,u->x", shifted_d2_q, base_weights
    )
    z_prime_all = all_x**1.5 * np.einsum(
        "xu,u->x", shifted_d5half_q, base_weights
    )
    interior_count = len(x)
    gamma = gamma_all[:interior_count]
    gamma_prime = gamma_prime_all[:interior_count]
    z_prime = z_prime_all[:interior_count]
    gamma_integer = gamma_all[interior_count:]

    jordan, s_zero_prefix, s_one_prefix = prefix_sums(x_upper)
    s_zero = s_zero_prefix[x_cells]
    s_one = s_one_prefix[x_cells]
    arithmetic_weight = x**-3 * (x * s_one - s_zero)
    p_weight = (
        -(4.0 / 3.0) * s_one * x**-1.5
        + (6.0 / 5.0) * s_zero * x**-2.5
    )

    laplace_integrand = gamma * (
        3.0 * s_zero * x**-3.5 - 2.0 * s_one * x**-2.5
    )
    abel_integrand = -arithmetic_weight * z_prime
    common_integrand = p_weight * gamma_prime
    laplace_target = finite(np.dot(x_weights, laplace_integrand))
    abel_target = finite(np.dot(x_weights, abel_integrand))

    p_upper = (
        -(4.0 / 3.0) * s_one_prefix[x_upper] * x_upper**-1.5
        + (6.0 / 5.0) * s_zero_prefix[x_upper] * x_upper**-2.5
    )
    jump_sum = float(
        np.sum(jordan[1:] * integers**-2.5 * gamma_integer)
    )
    boundary = p_upper * gamma_integer[-1]
    common_target = finite(
        -boundary
        + np.dot(x_weights, common_integrand)
        - (2.0 / 15.0) * jump_sum
    )

    representations = {
        "direct": direct_target,
        "laplace": laplace_target,
        "abel": abel_target,
        "common_scale_stieltjes": common_target,
    }
    errors = {
        name: relative_error(value, direct_target)
        for name, value in representations.items()
        if name != "direct"
    }
    if max(errors.values()) > representation_rtol:
        raise ArithmeticError(
            f"degree {degree} representation error exceeded tolerance: {errors}"
        )

    cell_rows: list[dict[str, object]] = []
    cumulative = 0.0
    cumulative_values: list[float] = [0.0]
    for cell in range(1, x_upper):
        mask = x_cells == cell
        value = finite(np.dot(x_weights[mask], abel_integrand[mask]))
        cumulative += value
        cumulative_values.append(cumulative)
        cell_rows.append(
            {
                "cell": [cell, cell + 1],
                "signed_abel_contribution": value,
                "cumulative": cumulative,
                "minimum_z_prime": finite(np.min(z_prime[mask])),
                "maximum_z_prime": finite(np.max(z_prime[mask])),
            }
        )

    gamma_one = finite(gamma_integer[0])
    z_one_payment = gamma_one / (6.0 * ZETA_THREE)
    absolute_variation_over_x = finite(
        np.dot(x_weights, np.abs(z_prime) / x)
    )
    weighted_total_variation = finite(
        0.5
        * np.dot(
            x_weights,
            (1.0 + np.log(x)) * np.abs(z_prime) / x**2,
        )
    )
    upward_variation = finite(
        np.dot(x_weights, np.maximum(z_prime, 0.0))
    )
    crude_payment = z_one_payment - 10.0 * absolute_variation_over_x
    last_cell = cell_rows[-1]["signed_abel_contribution"]
    previous_cell = cell_rows[-2]["signed_abel_contribution"]
    last_cell_ratio = abs(float(last_cell)) / max(
        abs(float(previous_cell)), 1.0e-300
    )

    return {
        "degree": degree,
        "current_coefficients": {
            str(k): v for k, v in current_coefficients.items()
        },
        "residual_coefficients": {
            str(k): v for k, v in residual_coefficients.items()
        },
        "physical_norm": physical_norm,
        "angle": finite(angle),
        "representations": representations,
        "relative_representation_errors": errors,
        "unit_cells": cell_rows,
        "cumulative_minimum": finite(min(cumulative_values)),
        "cumulative_maximum": finite(max(cumulative_values)),
        "last_cell_absolute_magnitude": finite(abs(float(last_cell))),
        "last_two_cell_absolute_ratio": finite(last_cell_ratio),
        "z_one_over_six_zeta_three": finite(z_one_payment),
        "absolute_variation_over_x": absolute_variation_over_x,
        "weighted_total_variation_term_on_sampled_range": weighted_total_variation,
        "upward_variation_on_sampled_range": upward_variation,
        "crude_absolute_variation_payment": finite(crude_payment),
        "z_prime_negative_nodes": int(np.count_nonzero(z_prime < 0.0)),
        "z_prime_positive_nodes": int(np.count_nonzero(z_prime > 0.0)),
        "monotonicity_candidate_survives": bool(np.all(z_prime <= 0.0)),
        "upper_boundary": {
            "x": x_upper,
            "gamma": finite(gamma_integer[-1]),
            "z": finite(math.sqrt(x_upper) * gamma_integer[-1]),
            "p_right": finite(p_upper),
            "p_gamma": finite(boundary),
        },
        "orbit_reports": {
            "direct_shift_zero": direct_report,
            "shifted_shift_two": shifted_report,
        },
    }


def run_probe(args: argparse.Namespace) -> dict[str, object]:
    ctx.prec = args.precision_bits
    moments, _, _, _, _, _ = ANGLE.read_inputs()
    raw_u, raw_u_weights = leggauss(args.u_nodes)
    u = 0.5 * args.u_upper * (raw_u + 1.0)
    u_weights = 0.5 * args.u_upper * raw_u_weights
    x, x_weights, x_cells = gauss_cells(
        args.x_nodes_per_cell, args.x_upper
    )
    results: list[dict[str, object]] = []
    for degree in DEGREES:
        progress(args.progress, "degree_started", degree=degree, label=args.label)
        result = probe_degree(
            degree,
            moments,
            u,
            u_weights,
            x,
            x_weights,
            x_cells,
            args.x_upper,
            args.maximum_orbit,
            args.representation_rtol,
        )
        results.append(result)
        progress(
            args.progress,
            "degree_completed",
            degree=degree,
            angle=result["angle"],
            errors=result["relative_representation_errors"],
        )

    return {
        "schema_version": SCHEMA_VERSION,
        "status": "bounded_floating_mechanism_probe",
        "verdict": "PASS",
        "grade": "nonrigorous_floating_structure_diagnostic",
        "parameters": {
            "mode": "probe",
            "label": args.label,
            "degrees": list(DEGREES),
            "precision_bits": args.precision_bits,
            "u_nodes": args.u_nodes,
            "u_upper": args.u_upper,
            "x_nodes_per_cell": args.x_nodes_per_cell,
            "x_upper": args.x_upper,
            "maximum_orbit": args.maximum_orbit,
            "representation_rtol": args.representation_rtol,
        },
        "results": results,
        "provenance": {
            "source": str(SOURCE.relative_to(CHECKPOINT)),
            "source_sha256": digest(SOURCE),
            "actual_angle_source": str(ANGLE_SOURCE.relative_to(CHECKPOINT)),
            "actual_angle_source_sha256": digest(ANGLE_SOURCE),
            "operator_source": str(OPERATOR_SOURCE.relative_to(CHECKPOINT)),
            "operator_source_sha256": digest(OPERATOR_SOURCE),
            "target_archive_sha256": digest(ANGLE.TARGET_PATH),
        },
        "runtime": {
            "python": sys.version,
            "python_executable": sys.executable,
            "platform": platform.platform(),
            "numpy": np.__version__,
            "network_used": False,
        },
        "floating_constants": {
            "zeta_three_decimal": ZETA_THREE,
            "zeta_three_use": "nonrigorous diagnostic payment only",
        },
        "nonclaims": [
            "The quadratures and theta-orbit truncations are floating diagnostics.",
            "The replay changes resolution but is not an independent implementation.",
            "Only degrees 3 and 5 are evaluated.",
            "No finite agreement proves an all-degree angle bound, next pivot, Xi-Laguerre inequality, or RH.",
        ],
    }


def run_compare(args: argparse.Namespace) -> dict[str, object]:
    primary_path = (CHECKPOINT / args.primary).resolve()
    replay_path = (CHECKPOINT / args.replay).resolve()
    for path in (primary_path, replay_path):
        if CHECKPOINT.resolve() not in path.parents:
            raise ValueError(f"comparison input escapes checkpoint root: {path}")
    primary = json.loads(primary_path.read_text(encoding="utf-8"))
    replay = json.loads(replay_path.read_text(encoding="utf-8"))
    expected_common = {
        "schema_version": SCHEMA_VERSION,
        "status": "bounded_floating_mechanism_probe",
        "verdict": "PASS",
    }
    for label, payload in (("primary", primary), ("replay", replay)):
        for key, expected in expected_common.items():
            if payload.get(key) != expected:
                raise ValueError(f"{label} input has unexpected {key}")
        parameters = payload.get("parameters")
        if not isinstance(parameters, dict):
            raise ValueError(f"{label} input parameters are missing")
        if (
            parameters.get("label") != label
            or parameters.get("degrees") != list(DEGREES)
        ):
            raise ValueError(f"{label} input identity mismatch")
        if [row.get("degree") for row in payload.get("results", [])] != list(DEGREES):
            raise ValueError(f"{label} input degree rows mismatch")
        provenance = payload.get("provenance")
        if not isinstance(provenance, dict):
            raise ValueError(f"{label} input provenance is missing")
        expected_hashes = {
            "source_sha256": digest(SOURCE),
            "actual_angle_source_sha256": digest(ANGLE_SOURCE),
            "operator_source_sha256": digest(OPERATOR_SOURCE),
            "target_archive_sha256": digest(ANGLE.TARGET_PATH),
        }
        if any(
            provenance.get(key) != value for key, value in expected_hashes.items()
        ):
            raise ValueError(f"{label} input provenance hash mismatch")
        integrity = payload.get("receipt_integrity")
        if (
            not isinstance(integrity, dict)
            or integrity.get("payload_sha256") != receipt_payload_sha256(payload)
        ):
            raise ValueError(f"{label} input receipt integrity mismatch")
    primary_by_degree = {row["degree"]: row for row in primary["results"]}
    replay_by_degree = {row["degree"]: row for row in replay["results"]}
    comparisons: list[dict[str, object]] = []
    fields = ("direct", "laplace", "abel", "common_scale_stieltjes")
    for degree in DEGREES:
        row_errors: dict[str, float] = {}
        for field in fields:
            left = float(primary_by_degree[degree]["representations"][field])
            right = float(replay_by_degree[degree]["representations"][field])
            row_errors[field] = relative_error(left, right)
        if max(row_errors.values()) > args.comparison_rtol:
            raise ArithmeticError(
                f"degree {degree} primary/replay disagreement: {row_errors}"
            )
        comparisons.append({"degree": degree, "relative_errors": row_errors})
    return {
        "schema_version": "zsv.signed_arithmetic_variation.comparison.v1",
        "status": "bounded_floating_replay_comparison",
        "verdict": "PASS",
        "grade": "same_implementation_resolution_replay",
        "parameters": {
            "mode": "compare",
            "degrees": list(DEGREES),
            "comparison_rtol": args.comparison_rtol,
        },
        "comparisons": comparisons,
        "inputs": {
            "primary": str(primary_path.relative_to(CHECKPOINT)),
            "primary_sha256": digest(primary_path),
            "replay": str(replay_path.relative_to(CHECKPOINT)),
            "replay_sha256": digest(replay_path),
        },
        "nonclaims": [
            "This is a resolution replay of one floating implementation, not an independent proof.",
            "It proves no all-degree theorem or RH claim.",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=("probe", "compare"), required=True)
    parser.add_argument("--label", default="manual")
    parser.add_argument("--precision-bits", type=int, default=256)
    parser.add_argument("--u-nodes", type=int, default=224)
    parser.add_argument("--u-upper", type=float, default=1.8)
    parser.add_argument("--x-nodes-per-cell", type=int, default=24)
    parser.add_argument("--x-upper", type=int, default=12)
    parser.add_argument("--maximum-orbit", type=int, default=64)
    parser.add_argument("--representation-rtol", type=float, default=2.0e-7)
    parser.add_argument("--primary", type=Path)
    parser.add_argument("--replay", type=Path)
    parser.add_argument("--comparison-rtol", type=float, default=2.0e-7)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--progress", action="store_true")
    args = parser.parse_args()
    if args.mode == "compare":
        if args.primary is None or args.replay is None:
            parser.error("--compare requires --primary and --replay")
        payload = run_compare(args)
    else:
        if args.u_nodes < 16 or args.x_nodes_per_cell < 8 or args.x_upper < 3:
            parser.error("probe quadrature settings are below the supported floor")
        payload = run_probe(args)
    payload["receipt_integrity"] = {
        "definition": "sha256 of compact sorted JSON with receipt_integrity omitted",
        "payload_sha256": receipt_payload_sha256(payload),
    }
    atomic_write(args.output.resolve(), payload)
    print(
        json.dumps(
            {
                "status": payload["status"],
                "verdict": payload["verdict"],
                "output": str(args.output.resolve()),
                "payload_sha256": payload["receipt_integrity"]["payload_sha256"],
            },
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
