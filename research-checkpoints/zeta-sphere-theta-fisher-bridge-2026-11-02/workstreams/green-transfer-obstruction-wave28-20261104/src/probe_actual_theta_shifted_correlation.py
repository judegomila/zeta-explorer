#!/usr/bin/env python3
"""Nonrigorous actual-theta probe of the wave-27 shifted correlation.

This bounded structure diagnostic evaluates the complete theta orbit series
with floating Gauss--Legendre quadrature.  It tests whether the proposed
pointwise premise K_n(t)>=0 survives at the first finite actual-theta rungs.
It is not an interval certificate and has no all-degree or RH implication.
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


ANGLE = load_module("wave28_actual_angle", ANGLE_SOURCE)
OPERATOR = load_module("wave28_operator_mining", OPERATOR_SOURCE)


def midpoint(value) -> float:
    return float(value.mid())


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


def complete_combo(
    points: np.ndarray, coefficients: dict[int, float], shift: float
) -> np.ndarray:
    maximum_order = max(coefficients) if coefficients else 0
    polynomials = OPERATOR.orbit_polynomials(maximum_order, shift)
    values, _ = OPERATOR.evaluate_complete_orbits(
        np.asarray(points).ravel(),
        polynomials,
        relative_tolerance=3.0e-15,
        absolute_tolerance=1.0e-300,
        maximum_orbit=64,
    )
    total = np.zeros(values.shape[1])
    for order, coefficient in coefficients.items():
        total += coefficient * values[order]
    return total.reshape(np.asarray(points).shape)


def sign_change_brackets(nodes: np.ndarray, values: np.ndarray) -> list[list[float]]:
    brackets: list[list[float]] = []
    for index in range(len(nodes) - 1):
        if values[index] == 0 or values[index] * values[index + 1] < 0:
            brackets.append([float(nodes[index]), float(nodes[index + 1])])
    return brackets


def atomic_write(path: Path, payload: dict[str, object]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + f".tmp.{os.getpid()}")
    temporary.write_text(
        json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n",
        encoding="utf-8",
    )
    os.replace(temporary, path)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output",
        type=Path,
        default=WORKSTREAM / "results/actual_theta_shifted_correlation_probe.json",
    )
    args = parser.parse_args()
    ctx.prec = 256
    moments, _, _, _, _, _ = ANGLE.read_inputs()

    u_raw, u_weights = leggauss(224)
    u = 0.9 * (u_raw + 1.0)
    u_weights = 0.9 * u_weights
    t_raw, t_weights = leggauss(128)
    t = 0.9 * (t_raw + 1.0)
    t_weights = 0.9 * t_weights
    shifted_grid = t[:, None] + u[None, :]

    results: list[dict[str, object]] = []
    for degree in (3, 5, 7):
        current, norm, _ = ANGLE.monic_target_polynomial(moments, degree)
        current_coefficients = {
            order: midpoint(value) for order, value in current.items()
        }
        following, _, _ = ANGLE.monic_target_polynomial(moments, degree + 1)
        residual = ANGLE.residual(following, current, degree)
        residual_coefficients = {
            order: midpoint(value) for order, value in residual.items()
        }

        feature = complete_combo(u, current_coefficients, 0.0)
        residual_feature = complete_combo(u, residual_coefficients, 0.0)
        direct_angle = float(
            np.dot(u_weights, u * feature * residual_feature)
        ) / midpoint(norm)

        arithmetic_residual = np.zeros_like(shifted_grid)
        for translate in range(1, 8):
            translated_points = shifted_grid + math.log(translate)
            translated_feature = complete_combo(
                translated_points, residual_coefficients, 2.0
            )
            arithmetic_residual += (
                np.exp(2.0 * shifted_grid)
                * (jordan_two(translate) / math.sqrt(translate))
                * translated_feature
            )

        correlation = np.sum(
            (u_weights * u * feature)[None, :] * arithmetic_residual,
            axis=1,
        )
        transfer_kernel = 2.0 * np.exp(-1.5 * t) - 3.0 * np.exp(-2.5 * t)
        green_angle = (
            -2.0
            * math.pi
            * float(np.dot(t_weights, transfer_kernel * correlation))
            / midpoint(norm)
        )
        c_three_halves = float(
            np.dot(t_weights, np.exp(-1.5 * t) * correlation)
        )
        c_five_halves = float(
            np.dot(t_weights, np.exp(-2.5 * t) * correlation)
        )
        relative_error = abs(green_angle - direct_angle) / max(
            1.0, abs(direct_angle)
        )
        if relative_error >= 1.0e-10:
            raise ArithmeticError("Green identity diagnostic did not reproduce X_n")
        minimum_index = int(np.argmin(correlation))
        maximum_index = int(np.argmax(correlation))
        minimum = float(correlation[minimum_index])
        maximum = float(correlation[maximum_index])
        if not minimum < 0.0 < maximum:
            raise ArithmeticError("expected signed shifted correlation was not observed")
        results.append(
            {
                "degree": degree,
                "direct_angle": direct_angle,
                "green_angle": green_angle,
                "relative_green_identity_error": relative_error,
                "correlation_minimum": minimum,
                "correlation_minimum_t": float(t[minimum_index]),
                "correlation_maximum": maximum,
                "correlation_maximum_t": float(t[maximum_index]),
                "negative_nodes": int(np.count_nonzero(correlation < 0.0)),
                "positive_nodes": int(np.count_nonzero(correlation > 0.0)),
                "sign_change_brackets": sign_change_brackets(t, correlation),
                "c_three_halves": c_three_halves,
                "c_five_halves": c_five_halves,
                "signed_combo": 3.0 * c_five_halves - 2.0 * c_three_halves,
            }
        )

    receipt: dict[str, object] = {
        "schema_version": "zsv.actual_theta_shifted_correlation_probe.v1",
        "status": "PASS",
        "grade": "nonrigorous_floating_structure_diagnostic",
        "strict_floating_observation": (
            "K_n(t) takes both signs on the sampled Gauss nodes for actual "
            "theta at n=3,5,7"
        ),
        "parameters": {
            "degrees": [3, 5, 7],
            "u_interval": [0.0, 1.8],
            "u_gauss_nodes": 224,
            "t_interval": [0.0, 1.8],
            "t_gauss_nodes": 128,
            "arithmetic_translates": [1, 7],
            "maximum_inner_theta_orbit": 64,
            "arb_bits_for_polynomial_reconstruction": 256,
            "arithmetic_coefficient": "standard Jordan totient J_2",
        },
        "results": results,
        "provenance": {
            "source": str(SOURCE.relative_to(CHECKPOINT)),
            "source_sha256": digest(SOURCE),
            "actual_angle_source": str(ANGLE_SOURCE.relative_to(CHECKPOINT)),
            "actual_angle_source_sha256": digest(ANGLE_SOURCE),
            "orbit_evaluator_source": str(OPERATOR_SOURCE.relative_to(CHECKPOINT)),
            "orbit_evaluator_source_sha256": digest(OPERATOR_SOURCE),
            "target_archive_sha256": digest(ANGLE.TARGET_PATH),
        },
        "runtime": {
            "python": sys.version,
            "python_executable": sys.executable,
            "platform": platform.platform(),
            "numpy": np.__version__,
            "network_used": False,
        },
        "nonclaims": [
            "The sampled sign changes are not interval-certified.",
            "The quadrature and orbit truncation are floating diagnostics.",
            "The calculation covers only degrees 3, 5, and 7.",
            "It proves no all-degree angle bound, next pivot, Xi-Laguerre inequality, or RH.",
        ],
    }
    canonical = json.dumps(
        receipt, sort_keys=True, separators=(",", ":"), ensure_ascii=True
    ).encode()
    receipt["receipt_integrity"] = {
        "definition": "sha256 of compact sorted JSON with receipt_integrity omitted",
        "payload_sha256": hashlib.sha256(canonical).hexdigest(),
    }
    atomic_write(args.output.resolve(), receipt)
    print(
        json.dumps(
            {
                "status": "PASS",
                "output": str(args.output.resolve()),
                "degrees": [3, 5, 7],
                "all_sampled_correlations_signed": True,
                "payload_sha256": receipt["receipt_integrity"]["payload_sha256"],
            },
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
