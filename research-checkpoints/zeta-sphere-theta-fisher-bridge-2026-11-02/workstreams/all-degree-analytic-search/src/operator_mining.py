#!/usr/bin/env python3
"""Mine finite reflected-operator sections for possible all-degree structure.

This is a structure-discovery experiment, not a positivity certificate.  It
uses exact polynomial recurrences for derivatives of each complete-theta
orbit, numerical orbit summation, and Gauss--Legendre quadrature.  The output
is intended to falsify or suggest bounded-rank/banded factorization ansatzes;
no finite result has an all-degree or RH implication.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
import platform
import sys
import time
from pathlib import Path
from typing import Any

import numpy as np
from scipy import linalg


SCHEMA_VERSION = 1
SOURCE_PATH = Path(__file__).resolve()
PARENT_RCOND = 1.0e-12
STRUCTURE_RTOLS = (1.0e-6, 1.0e-8, 1.0e-10)


def progress(enabled: bool, event: str, **fields: object) -> None:
    if enabled:
        print(
            json.dumps({"event": event, **fields}, sort_keys=True),
            file=sys.stderr,
            flush=True,
        )


def atomic_write_json(path: Path, payload: dict[str, object]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + f".tmp.{os.getpid()}")
    with temporary.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2, sort_keys=True, allow_nan=False)
        handle.write("\n")
        handle.flush()
        os.fsync(handle.fileno())
    os.replace(temporary, path)


def finite_float(value: float) -> float | None:
    value = float(value)
    return value if math.isfinite(value) else None


def float_list(values: np.ndarray) -> list[float | None]:
    return [finite_float(value) for value in np.asarray(values).ravel()]


def orbit_polynomials(max_order: int, shift: float) -> list[np.ndarray]:
    """Return exact-in-u polynomial recurrences for (D+shift)^k psi_n.

    For z=pi*n^2*exp(2u), a single orbit is

        psi_n(u) = exp(u/2-z) * (8 z^2 - 12 z).

    If exp(u/2-z) P(z) is known, applying D+shift replaces P by

        2 z P'(z) + (1/2 + shift - 2 z) P(z).

    Thus no numerical differentiation is used.  Coefficients are stored from
    low to high degree for numpy.polynomial.polynomial.polyval.
    """

    polynomials = [np.array([0.0, -12.0, 8.0], dtype=float)]
    for _ in range(max_order):
        current = polynomials[-1]
        following = np.zeros(len(current) + 1, dtype=float)
        following[: len(current)] += (0.5 + shift) * current
        following[1:] -= 2.0 * current
        derivative = np.arange(1, len(current), dtype=float) * current[1:]
        following[1 : 1 + len(derivative)] += 2.0 * derivative
        polynomials.append(following)
    return polynomials


def scaled_polynomial_orbit(
    z: np.ndarray, log_common: np.ndarray, polynomial: np.ndarray
) -> np.ndarray:
    """Evaluate exp(log_common) P(z) without inf-times-zero overflow.

    Large quadrature nodes can make P(z) overflow even though exp(-z)P(z)
    is far below floating-point range.  A log absolute-coefficient envelope
    first discards only values whose *entire polynomial upper bound* is below
    the underflow floor.  Horner evaluation is then restricted to the active
    range, where it is numerically representable for the supported degrees.
    """

    log_z = np.log(z)
    maximum = np.full_like(z, -np.inf)
    term_logs: list[tuple[int, float]] = []
    for power, coefficient in enumerate(polynomial):
        if coefficient == 0.0:
            continue
        log_coefficient = math.log(abs(float(coefficient)))
        term_logs.append((power, log_coefficient))
        maximum = np.maximum(maximum, log_coefficient + power * log_z)
    if not term_logs:
        return np.zeros_like(z)
    scaled_sum = np.zeros_like(z)
    for power, log_coefficient in term_logs:
        scaled_sum += np.exp(log_coefficient + power * log_z - maximum)
    log_upper = maximum + np.log(scaled_sum)
    active = log_common + log_upper > -750.0
    result = np.zeros_like(z)
    if not np.any(active):
        return result
    polynomial_value = np.polynomial.polynomial.polyval(
        z[active], polynomial
    )
    if not np.all(np.isfinite(polynomial_value)):
        raise FloatingPointError("active scaled polynomial evaluation overflowed")
    nonzero = polynomial_value != 0.0
    active_result = np.zeros_like(polynomial_value)
    active_result[nonzero] = np.sign(polynomial_value[nonzero]) * np.exp(
        log_common[active][nonzero]
        + np.log(np.abs(polynomial_value[nonzero]))
    )
    result[active] = active_result
    return result


def evaluate_complete_orbits(
    u: np.ndarray,
    polynomials: list[np.ndarray],
    *,
    relative_tolerance: float = 2.0e-15,
    absolute_tolerance: float = 1.0e-300,
    maximum_orbit: int = 256,
) -> tuple[np.ndarray, dict[str, object]]:
    """Numerically sum all theta orbits with a recorded truncation diagnostic."""

    values = np.zeros((len(polynomials), len(u)), dtype=float)
    exp_two_u = np.exp(2.0 * u)
    absolute_accumulator = 0.0
    previous_norm: float | None = None
    last_norm = 0.0
    small_run = 0
    max_order = len(polynomials) - 1
    # The leading high-derivative orbit envelope peaks near z=max_order+2.
    # Do not permit a tail decision until safely beyond that discrete peak.
    minimum_orbit = max(8, int(math.ceil(math.sqrt((max_order + 4) / math.pi))) + 4)
    cutoff = maximum_orbit

    for orbit in range(1, maximum_orbit + 1):
        z = math.pi * orbit * orbit * exp_two_u
        log_common = 0.5 * u - z
        orbit_values = np.vstack(
            [
                scaled_polynomial_orbit(z, log_common, polynomial)
                for polynomial in polynomials
            ]
        )
        if not np.all(np.isfinite(orbit_values)):
            raise FloatingPointError(
                f"non-finite orbit evaluation at n={orbit}; reduce --degree"
            )
        values += orbit_values
        term_norm = float(np.max(np.abs(orbit_values)))
        absolute_accumulator += term_norm
        last_norm = term_norm
        threshold = absolute_tolerance + relative_tolerance * max(
            1.0, absolute_accumulator
        )
        if orbit >= minimum_orbit and term_norm <= threshold:
            small_run += 1
        else:
            small_run = 0
        if small_run >= 3:
            cutoff = orbit
            break
        previous_norm = term_norm
    else:
        raise RuntimeError(
            f"orbit summation did not converge by n={maximum_orbit}"
        )

    tail_ratio = None
    tail_estimate = last_norm
    if previous_norm and previous_norm > 0.0:
        ratio = last_norm / previous_norm
        tail_ratio = ratio
        if ratio < 1.0:
            tail_estimate = last_norm * ratio / max(1.0e-300, 1.0 - ratio)

    return values, {
        "orbit_cutoff": cutoff,
        "minimum_tail_check_orbit": minimum_orbit,
        "last_orbit_max_abs": last_norm,
        "geometric_tail_ratio_estimate": finite_float(tail_ratio)
        if tail_ratio is not None
        else None,
        "geometric_tail_max_abs_estimate": finite_float(tail_estimate),
        "relative_tolerance": relative_tolerance,
        "rigorous_tail_bound": False,
    }


def gauss_legendre_grid(nodes: int, upper: float) -> tuple[np.ndarray, np.ndarray]:
    raw_nodes, raw_weights = np.polynomial.legendre.leggauss(nodes)
    u = 0.5 * upper * (raw_nodes + 1.0)
    weights = 0.5 * upper * raw_weights
    return u, weights


def numerical_rank(singular_values: np.ndarray, rtol: float) -> int:
    if singular_values.size == 0 or singular_values[0] == 0.0:
        return 0
    return int(np.count_nonzero(singular_values > rtol * singular_values[0]))


def displacement_report(matrix: np.ndarray) -> dict[str, object]:
    singular_values = linalg.svdvals(matrix)
    norm = float(singular_values[0]) if singular_values.size else 0.0
    return {
        "singular_values": float_list(singular_values),
        "frobenius_norm": float(linalg.norm(matrix, ord="fro")),
        "relative_ranks": {
            f"{rtol:.0e}": numerical_rank(singular_values, rtol)
            for rtol in STRUCTURE_RTOLS
        },
        "rank_at_1e-8": numerical_rank(singular_values, 1.0e-8),
        "norm": norm,
    }


def bandwidth_ratios(matrix: np.ndarray, maximum: int = 6) -> dict[str, float]:
    total = float(linalg.norm(matrix, ord="fro"))
    if total == 0.0:
        return {str(width): 0.0 for width in range(maximum + 1)}
    rows, columns = np.indices(matrix.shape)
    result: dict[str, float] = {}
    for width in range(min(maximum, max(0, matrix.shape[0] - 1)) + 1):
        outside = np.where(np.abs(rows - columns) > width, matrix, 0.0)
        result[str(width)] = float(linalg.norm(outside, ord="fro") / total)
    return result


def hankel_deviation(matrix: np.ndarray) -> float:
    approximation = np.zeros_like(matrix)
    for diagonal_sum in range(2 * matrix.shape[0] - 1):
        mask = np.add.outer(
            np.arange(matrix.shape[0]), np.arange(matrix.shape[1])
        ) == diagonal_sum
        approximation[mask] = float(np.mean(matrix[mask]))
    denominator = float(linalg.norm(matrix, ord="fro"))
    return (
        float(linalg.norm(matrix - approximation, ord="fro") / denominator)
        if denominator
        else 0.0
    )


def generalized_component_spectrum(
    numerator: np.ndarray, denominator: np.ndarray
) -> dict[str, object]:
    diagonal = np.diag(denominator)
    if np.any(diagonal <= 0.0):
        return {"available": False, "reason": "nonpositive denominator diagonal"}
    scale = np.sqrt(diagonal)
    den = denominator / np.outer(scale, scale)
    num = numerator / np.outer(scale, scale)
    den = 0.5 * (den + den.T)
    num = 0.5 * (num + num.T)
    eigenvalues, eigenvectors = linalg.eigh(den)
    keep = eigenvalues > PARENT_RCOND * max(1.0, float(eigenvalues[-1]))
    if not np.any(keep):
        return {"available": False, "reason": "denominator numerical rank zero"}
    whitening = eigenvectors[:, keep] / np.sqrt(eigenvalues[keep])[None, :]
    relative = whitening.T @ num @ whitening
    relative = 0.5 * (relative + relative.T)
    spectrum = linalg.eigvalsh(relative)
    return {
        "available": True,
        "effective_dimension": int(np.count_nonzero(keep)),
        "eigenvalues": float_list(spectrum),
        "minimum": float(spectrum[0]),
        "maximum": float(spectrum[-1]),
        "denominator_condition_retained": float(
            eigenvalues[keep][-1] / eigenvalues[keep][0]
        ),
    }


def analyze_parity(
    name: str,
    degrees: list[int],
    positive_extended: np.ndarray,
    negative_extended: np.ndarray,
) -> dict[str, object]:
    """Whiten one parity block and mine multiplication/displacement structure."""

    basis_dimension = len(degrees) - 1
    base_degrees = degrees[:-1]
    if basis_dimension == 0:
        return {"available": False, "reason": "no basis at requested degree"}

    parent_extended = positive_extended + negative_extended
    signed_extended = positive_extended - negative_extended
    parent = 0.5 * (
        parent_extended[:basis_dimension, :basis_dimension]
        + parent_extended[:basis_dimension, :basis_dimension].T
    )
    signed = 0.5 * (
        signed_extended[:basis_dimension, :basis_dimension]
        + signed_extended[:basis_dimension, :basis_dimension].T
    )
    positive = positive_extended[:basis_dimension, :basis_dimension]
    negative = negative_extended[:basis_dimension, :basis_dimension]

    diagonal = np.diag(parent)
    if np.any(diagonal <= 0.0) or not np.all(np.isfinite(diagonal)):
        return {
            "available": False,
            "reason": "nonpositive or non-finite positive-parent diagonal",
            "degrees": base_degrees,
        }
    scales = np.sqrt(np.diag(parent_extended))
    parent_correlation = parent / np.outer(scales[:basis_dimension], scales[:basis_dimension])
    signed_correlation = signed / np.outer(scales[:basis_dimension], scales[:basis_dimension])
    parent_correlation = 0.5 * (parent_correlation + parent_correlation.T)
    signed_correlation = 0.5 * (signed_correlation + signed_correlation.T)

    parent_eigenvalues, parent_eigenvectors = linalg.eigh(parent_correlation)
    threshold = PARENT_RCOND * max(1.0, float(parent_eigenvalues[-1]))
    keep = parent_eigenvalues > threshold
    if not np.any(keep):
        return {
            "available": False,
            "reason": "positive parent has zero numerical rank",
            "degrees": base_degrees,
            "parent_eigenvalues": float_list(parent_eigenvalues),
        }
    whitening = parent_eigenvectors[:, keep] / np.sqrt(
        parent_eigenvalues[keep]
    )[None, :]
    signed_relative = whitening.T @ signed_correlation @ whitening
    signed_relative = 0.5 * (signed_relative + signed_relative.T)
    signed_spectrum = linalg.eigvalsh(signed_relative)

    # Compression of multiplication by x=t^2.  The final column projects the
    # one-degree extension back into the current positive-parent space.
    shift = np.zeros((basis_dimension, basis_dimension), dtype=float)
    for column in range(basis_dimension - 1):
        shift[column + 1, column] = scales[column + 1] / scales[column]
    cross = parent_extended[:basis_dimension, basis_dimension] / (
        scales[:basis_dimension] * scales[basis_dimension]
    )
    projected_last, *_ = linalg.lstsq(
        parent_correlation, cross, cond=PARENT_RCOND
    )
    shift[:, basis_dimension - 1] = projected_last
    multiplication = (
        whitening.T @ parent_correlation @ shift @ whitening
    )
    multiplication_symmetric = 0.5 * (multiplication + multiplication.T)
    multiplication_norm = float(linalg.norm(multiplication, ord="fro"))
    adjoint_defect = float(
        linalg.norm(multiplication - multiplication.T, ord="fro")
        / max(1.0e-300, multiplication_norm)
    )

    jb_minus_bj = (
        multiplication_symmetric @ signed_relative
        - signed_relative @ multiplication_symmetric
    )
    jb_plus_bj = (
        multiplication_symmetric @ signed_relative
        + signed_relative @ multiplication_symmetric
    )
    raw_adjoint_displacement = (
        multiplication @ signed_relative
        - signed_relative @ multiplication.T
    )

    signed_bandwidth = bandwidth_ratios(signed_relative)
    multiplication_bandwidth = bandwidth_ratios(multiplication_symmetric)
    cholesky_bandwidth: dict[str, float] | None = None
    if signed_spectrum[0] > 1.0e-10:
        cholesky_bandwidth = bandwidth_ratios(
            linalg.cholesky(signed_relative, lower=True)
        )

    commutator = displacement_report(jb_minus_bj)
    anticommutator = displacement_report(jb_plus_bj)
    raw_displacement = displacement_report(raw_adjoint_displacement)
    smallest_offband = min(
        signed_bandwidth.get(str(width), 1.0)
        for width in range(min(4, basis_dimension - 1) + 1)
    )
    low_rank_candidate = min(
        commutator["rank_at_1e-8"], anticommutator["rank_at_1e-8"]
    ) <= min(4, signed_relative.shape[0])

    target_norm = float(
        parent_extended[basis_dimension, basis_dimension]
        / (scales[basis_dimension] * scales[basis_dimension])
    )
    projection_residual = target_norm - float(cross @ projected_last)

    return {
        "available": True,
        "parity": name,
        "basis_degrees": base_degrees,
        "multiplication_variable": "t^2",
        "basis_dimension": basis_dimension,
        "effective_dimension": int(np.count_nonzero(keep)),
        "parent": {
            "correlation_eigenvalues": float_list(parent_eigenvalues),
            "retained_condition": float(
                parent_eigenvalues[keep][-1] / parent_eigenvalues[keep][0]
            ),
            "raw_diagonal_min": float(np.min(diagonal)),
            "raw_diagonal_max": float(np.max(diagonal)),
            "raw_diagonal_dynamic_range": float(
                np.max(diagonal) / np.min(diagonal)
            ),
            "numerical_rank": int(np.count_nonzero(keep)),
            "hankel_relative_deviation": hankel_deviation(parent_correlation),
        },
        "signed_relative_parent": {
            "eigenvalues": float_list(signed_spectrum),
            "minimum": float(signed_spectrum[0]),
            "maximum": float(signed_spectrum[-1]),
            "singular_values": float_list(linalg.svdvals(signed_relative)),
            "bandwidth_outside_frobenius_ratios": signed_bandwidth,
        },
        "negative_relative_positive_component": generalized_component_spectrum(
            negative, positive
        ),
        "parent_multiplication": {
            "symmetric_eigenvalues": float_list(
                linalg.eigvalsh(multiplication_symmetric)
            ),
            "adjoint_defect_relative_frobenius": adjoint_defect,
            "projected_extension_residual": float(projection_residual),
            "bandwidth_outside_frobenius_ratios": multiplication_bandwidth,
        },
        "displacements": {
            "JB_minus_BJ": commutator,
            "JB_plus_BJ": anticommutator,
            "J_B_minus_B_J_transpose": raw_displacement,
        },
        "factorization_diagnostics": {
            "finite_signed_psd_at_1e-8": bool(signed_spectrum[0] >= -1.0e-8),
            "strict_cholesky_available_at_1e-10": cholesky_bandwidth is not None,
            "cholesky_bandwidth_outside_frobenius_ratios": cholesky_bandwidth,
            "bounded_rank_le_4_candidate_at_1e-8": bool(low_rank_candidate),
            "narrow_bandwidth_le_4_candidate_at_1e-6": bool(
                smallest_offband <= 1.0e-6
            ),
            "falsifier_flags": {
                "finite_signed_indefinite_below_minus_1e-6": bool(
                    signed_spectrum[0] < -1.0e-6
                ),
                "no_commutator_or_anticommutator_rank_le_4_at_1e-8": bool(
                    not low_rank_candidate
                ),
                "no_signed_bandwidth_le_4_at_1e-6": bool(
                    smallest_offband > 1.0e-6
                ),
                "parent_compression_not_nearly_self_adjoint": bool(
                    adjoint_defect > 1.0e-6
                ),
            },
        },
    }


def feature_grams(
    degree: int,
    shift: float,
    u: np.ndarray,
    weights: np.ndarray,
    derivative_values: dict[str, np.ndarray],
) -> tuple[dict[str, tuple[list[int], np.ndarray, np.ndarray]], dict[str, object]]:
    result: dict[str, tuple[list[int], np.ndarray, np.ndarray]] = {}
    boundary_maxima: dict[str, object] = {}
    for parity, start in (("even", 0), ("odd", 1)):
        base_degrees = list(range(start, degree + 1, 2))
        if not base_degrees:
            continue
        degrees = base_degrees + [base_degrees[-1] + 2]
        if shift == 0.0:
            derivatives = derivative_values["zero"]
            positive_features = []
            negative_features = []
            for order in degrees:
                derivative = derivatives[order]
                previous = (
                    order * derivatives[order - 1]
                    if order > 0
                    else np.zeros_like(derivative)
                )
                positive_features.append(2.0 * u * derivative + previous)
                negative_features.append(previous)
            positive_array = np.asarray(positive_features)
            negative_array = np.asarray(negative_features)
            square_weight = np.sqrt(weights)
        else:
            plus = derivative_values["plus"]
            minus = derivative_values["minus"]
            positive_array = np.asarray(
                [np.exp(shift * u) * plus[order] for order in degrees]
            )
            negative_array = np.asarray(
                [np.exp(-shift * u) * minus[order] for order in degrees]
            )
            square_weight = np.sqrt(weights * u)
        weighted_positive = positive_array * square_weight[None, :]
        weighted_negative = negative_array * square_weight[None, :]
        positive_gram = weighted_positive @ weighted_positive.T
        negative_gram = weighted_negative @ weighted_negative.T
        result[parity] = (degrees, positive_gram, negative_gram)
        boundary_maxima[parity] = {
            "positive_feature_max_abs_at_last_node": float(
                np.max(np.abs(positive_array[:, -1]))
            ),
            "negative_feature_max_abs_at_last_node": float(
                np.max(np.abs(negative_array[:, -1]))
            ),
        }
    return result, boundary_maxima


def run_experiment(args: argparse.Namespace) -> dict[str, object]:
    started = time.time()
    shift_text = str(args.shift)
    shift_value = float(shift_text)
    if args.degree < 0 or args.degree > 64:
        raise ValueError("--degree must lie between 0 and 64")
    if not (0.0 <= shift_value <= 0.5):
        raise ValueError("--shift must lie in [0, 1/2]")
    if args.nodes < 32 or args.nodes > 4096:
        raise ValueError("--nodes must lie between 32 and 4096")

    maximum_order = args.degree + 2
    integration_upper = max(
        4.0, 0.5 * math.log((maximum_order + 6.0) / math.pi) + 2.75
    )
    progress(
        args.progress,
        "quadrature_start",
        nodes=args.nodes,
        upper=integration_upper,
    )
    u, weights = gauss_legendre_grid(args.nodes, integration_upper)

    derivative_values: dict[str, np.ndarray] = {}
    orbit_reports: dict[str, object] = {}
    if shift_value == 0.0:
        polynomials = orbit_polynomials(maximum_order, 0.0)
        derivative_values["zero"], orbit_reports["zero"] = evaluate_complete_orbits(
            u, polynomials
        )
    else:
        plus_polynomials = orbit_polynomials(maximum_order, shift_value)
        minus_polynomials = orbit_polynomials(maximum_order, -shift_value)
        derivative_values["plus"], orbit_reports["plus"] = evaluate_complete_orbits(
            u, plus_polynomials
        )
        derivative_values["minus"], orbit_reports["minus"] = evaluate_complete_orbits(
            u, minus_polynomials
        )
    progress(args.progress, "orbit_sum_complete", reports=orbit_reports)

    grams, boundary_maxima = feature_grams(
        args.degree, shift_value, u, weights, derivative_values
    )
    parities: dict[str, object] = {}
    for name, (degrees, positive, negative) in grams.items():
        progress(args.progress, "parity_analysis_start", parity=name)
        parities[name] = analyze_parity(name, degrees, positive, negative)
        progress(args.progress, "parity_analysis_complete", parity=name)

    source_hash = hashlib.sha256(SOURCE_PATH.read_bytes()).hexdigest()
    return {
        "schema_version": SCHEMA_VERSION,
        "status": "analytic_structure_experiment",
        "experiment": "complete-theta-reflected-operator-mining",
        "parameters": {
            "degree": args.degree,
            # Preserve the CLI spelling because the checkpoint governor uses
            # exact task-parameter equality when deciding whether to restart.
            "shift": shift_text,
            "shift_numeric": shift_value,
            "nodes": args.nodes,
            "maximum_derivative_order": maximum_order,
            "integration_upper": integration_upper,
        },
        "normalization": (
            "a=0 normalized anticommutator-minus-commutator form"
            if shift_value == 0.0
            else "positive-shift reflected T_plus/T_minus form"
        ),
        "quadrature": {
            "rule": "single-panel Gauss-Legendre",
            "nodes": args.nodes,
            "interval": [0.0, integration_upper],
            "rigorous_error_bound": False,
            "last_node": float(u[-1]),
            "boundary_feature_diagnostics": boundary_maxima,
        },
        "orbit_evaluation": orbit_reports,
        "parities": parities,
        "provenance": {
            "source_sha256": source_hash,
            "python": sys.version,
            "python_executable": sys.executable,
            "numpy": np.__version__,
            "scipy": __import__("scipy").__version__,
            "platform": platform.platform(),
            "pid": os.getpid(),
        },
        "timing_seconds": time.time() - started,
        "scope": (
            "Exploratory finite-section structure discovery only. Numerical "
            "rank, bandwidth, or positivity observations are not interval "
            "certificates, all-degree statements, or evidence proving RH."
        ),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--degree", type=int, required=True)
    parser.add_argument("--shift", required=True)
    parser.add_argument("--nodes", type=int, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--progress", action="store_true")
    args = parser.parse_args()
    payload = run_experiment(args)
    atomic_write_json(args.output, payload)
    print(
        json.dumps(
            {
                "status": payload["status"],
                "output": str(args.output),
                "degree": args.degree,
                "shift": args.shift,
                "nodes": args.nodes,
                "timing_seconds": payload["timing_seconds"],
            },
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
