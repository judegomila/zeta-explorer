#!/usr/bin/env python3
"""Checkpoint 0.65 graph-shorted secant diagnostic.

This producer reuses the source-pinned checkpoint-0.64 producer assembly and
then performs a one-step Feshbach split along the canonical limiting-state
secant.  It emits only finite arbitrary-precision point diagnostics.  The
independent replay rebuilds the source matrix, prolate state, time-band
operator, and limiting state through the checkpoint-0.64 verifier path.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import sys
from typing import Any

import mpmath as mp

import checkpoint064_reciprocal_secant as base


ROOT = Path(__file__).resolve().parents[1]
SCHEMA = "xi-prolate-checkpoint065-shorted-secant-v1"
CHECKPOINT_VERSION = "0.65.0-shorted-secant-point"
TERMINAL_STATE = "P0_INVALIDATED"

DEPENDENCIES = (
    "P0_SOURCE_LOCK.json",
    "P0_NORMALIZATION_AUDIT.md",
    "vendor/CCM-ZST-2511.22755v1.pdf",
    "vendor/CCM-PROLATE-2310.18423v2.pdf",
    "notes/DIRECT_SOFT_TRACE_RECIPROCAL_RESERVE.md",
    "notes/PROLATE_SECANT_RADICAL_BLOCK_REDUCTION.md",
    "notes/TRANSVERSE_XI_RADICAL_MOMENT_ANGLE_OBSTRUCTION.md",
    "notes/SECANT_SHORTED_RECIPROCAL_FESHBACH.md",
    "notes/TIME_BAND_CAUCHY_DETERMINANT_RESPONSE.md",
    "notes/POLYNOMIAL_XI_RADICAL_TOWER_COVARIANCE_FLOOR_OBSTRUCTION.md",
    "src/checkpoint064_reciprocal_secant.py",
    "src/prolate_state.py",
    "src/weil_matrix.py",
    "verifier/checkpoint064_reciprocal_secant_replay.py",
    "verifier/independent_replay.py",
    "verifier/residual_ridged_fixed_window_replay.py",
    "src/checkpoint065_shorted_secant.py",
    "verifier/checkpoint065_shorted_secant_replay.py",
)

PINNED_SOURCE_SHA256 = dict(base.PINNED_SOURCE_SHA256)

LOCKED_FORMULAS = {
    "regularized_block": "B+rI=[[epsilon+r,g*],[g,C+rI]] in span{omega} plus F",
    "shorted_energy": "delta_r=epsilon+r-g*(C+rI)^(-1)g",
    "graph_vector": "v_r=omega-U(C+rI)^(-1)g",
    "inverse_split": "(B+rI)^(-1)=delta_r^(-1)|v_r><v_r|+U(C+rI)^(-1)U*",
    "soft_split": "S=r*<v_r,K_T v_r>/delta_r+r*tr((C+rI)^(-1)K_F)",
    "unregularized_split": "H0=<v_0,K_T v_0>/delta_0+tr(C^(-1)K_F)",
    "shorted_minimum": "delta_0=min_{<omega,x>=1}<x,Bx>=det(B)/det(C)=1/<omega,B^(-1)omega>",
    "graph_load": "a0_F=alpha*b_F+beta*g",
    "reserve_envelope": "a^(-1)(1-sqrt((1-a)x))_+^2+x <= R <= a^(-1)(1+sqrt((1-a)x))^2+x",
}

PROVENANCE = {
    "cached_matrix_read": False,
    "cached_eigensystem_read": False,
    "zeta_zero_table_read": False,
    "global_weil_positivity_assumed": False,
    "binary64_parameter_used": False,
    "asymptotic_claim_made": False,
    "producer_source_path": "checkpoint-0.64 live source assembly, then graph-shorted Feshbach algebra",
    "producer_time_band_path": "checkpoint-0.64 direct evaluation-vector quadrature",
    "producer_limiting_state_path": "checkpoint-0.64 direct x-quadrature arithmetic sum",
}

LIMITATIONS = [
    "finite arbitrary-precision point diagnostic, not an interval or ball enclosure",
    "producer and verifier share mpmath transcendental arithmetic and linear algebra",
    "the source-normalized prolate state remains a fixed 30-mode Galerkin truncation without a tail enclosure",
    "the graph-shorted identities are exact finite-dimensional algebra but no unbounded schedule is proved",
    "no locally uniform determinant convergence is inferred",
]


class Checkpoint065Error(ValueError):
    """Fail-closed source, input, or Feshbach identity error."""


def _sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1 << 20), b""):
            digest.update(chunk)
    return digest.hexdigest()


def validate_pinned_source_hashes(actual: dict[str, str]) -> None:
    for name, expected in PINNED_SOURCE_SHA256.items():
        if actual.get(name) != expected:
            raise Checkpoint065Error(f"pinned source hash mismatch: {name}")


def dependency_hashes() -> dict[str, str]:
    actual = {name: _sha256_file(ROOT / name) for name in DEPENDENCIES}
    validate_pinned_source_hashes(actual)
    return actual


def _raw_hash(value: Any) -> str:
    raw = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("ascii")
    return hashlib.sha256(raw).hexdigest()


def _vector(values: list[str]) -> mp.matrix:
    return mp.matrix([mp.mpf(value) for value in values])


def _matrix(values: list[list[str]]) -> mp.matrix:
    return mp.matrix([[mp.mpf(value) for value in row] for row in values])


def _dot(x: mp.matrix, A: mp.matrix, y: mp.matrix) -> mp.mpf:
    return (x.T * A * y)[0]


def _norm(x: mp.matrix) -> mp.mpf:
    return mp.sqrt(mp.fsum(abs(x[i]) ** 2 for i in range(x.rows)))


def _trace(A: mp.matrix) -> mp.mpf:
    return mp.fsum(A[i, i] for i in range(min(A.rows, A.cols)))


def _inverse(A: mp.matrix) -> mp.matrix:
    result = mp.matrix(A.rows)
    for j in range(A.rows):
        e = mp.matrix(A.rows, 1)
        e[j] = 1
        result[:, j] = mp.lu_solve(A, e)
    return result


def _max_abs(A: mp.matrix) -> mp.mpf:
    return max((abs(A[i, j]) for i in range(A.rows) for j in range(A.cols)), default=mp.mpf("0"))


def _encode(value: Any, digits: int) -> Any:
    if isinstance(value, mp.matrix):
        if value.cols == 1:
            return [mp.nstr(value[i], digits) for i in range(value.rows)]
        return [[mp.nstr(value[i, j], digits) for j in range(value.cols)] for i in range(value.rows)]
    if isinstance(value, mp.mpf):
        return mp.nstr(value, digits)
    if isinstance(value, dict):
        return {key: _encode(item, digits) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [_encode(item, digits) for item in value]
    if isinstance(value, (str, int, bool)) or value is None:
        return value
    raise TypeError(f"cannot serialize {type(value).__name__}")


def _compute_sections(base_payload: dict[str, Any], dps: int) -> dict[str, Any]:
    source = base_payload["source_geometry"]
    normalization = base_payload["normalization"]
    secant = base_payload["secant_geometry"]
    reciprocal = base_payload["reciprocal_soft_trace"]
    inputs = base_payload["inputs"]
    N = inputs["N"]

    B = _matrix(source["B_even_complement_at_q"])
    K = _matrix(source["K_T_even_complement"])
    b = _vector(source["residual_vector_even_complement"])
    omega = _vector(secant["omega_even_complement"])
    rho = mp.mpf(source["residual_r"])
    epsilon = mp.mpf(secant["epsilon"])
    c2 = mp.mpf(secant["c2_fixed_window_capture"])
    soft_trace = mp.mpf(reciprocal["soft_trace_S"])
    H0 = mp.mpf(reciprocal["H0_reciprocal_trace"])
    crowding_reserve = mp.mpf(reciprocal["reciprocal_crowding_reserve"])
    alpha = mp.mpf(secant["alpha"])
    beta = mp.mpf(secant["beta"])

    U = base._orthogonal_complement(omega)
    g = U.T * B * omega
    C = U.T * B * U
    K_F = U.T * K * U
    C_r = C + rho * mp.eye(C.rows)
    C_r_inverse = _inverse(C_r)
    y_r = C_r_inverse * g
    v_r = omega - U * y_r
    delta_r = epsilon + rho - (g.T * y_r)[0]
    tilted_capture = _dot(v_r, K, v_r)
    rank_soft = rho * tilted_capture / delta_r
    bulk_trace = _trace(C_r_inverse * K_F)
    bulk_soft = rho * bulk_trace
    soft_sum = rank_soft + bulk_soft

    a = delta_r / (epsilon + rho)
    x = (epsilon + rho) * bulk_trace / c2
    if not (a > 0 and a <= 1 and x >= 0):
        raise Checkpoint065Error("invalid shorted reserve domain")
    normalized_rank = (epsilon + rho) * tilted_capture / (c2 * delta_r)
    normalized_bulk = x
    envelope_root = mp.sqrt((1 - a) * x)
    envelope_lower = max(mp.mpf("0"), 1 - envelope_root) ** 2 / a + x
    envelope_upper = (1 + envelope_root) ** 2 / a + x

    C_inverse = _inverse(C)
    y0 = C_inverse * g
    v0 = omega - U * y0
    delta0 = epsilon - (g.T * y0)[0]
    rank_H0 = _dot(v0, K, v0) / delta0
    bulk_H0 = _trace(C_inverse * K_F)
    H0_sum = rank_H0 + bulk_H0
    B_inverse = _inverse(B)
    determinant_ratio = mp.det(B) / mp.det(C)
    inverse_rayleigh = 1 / _dot(omega, B_inverse, omega)
    Bv_residual = B * v0 - delta0 * omega

    even, _odd = base._sector_bases(N)
    kappa = _vector(normalization["kappa_modes_minusN_to_N"])
    kappa_even = even.T * kappa
    complement = base._orthogonal_complement(kappa_even)
    Q = _matrix(source["Q_equals_pole_minus_archimedean_minus_prime"])
    q = mp.mpf(source["q"])
    z0 = _vector(secant["z0_limiting_projection_modes_minusN_to_N"])
    direct_load = U.T * complement.T * even.T * (
        Q - q * mp.eye(2 * N + 1)
    ) * z0
    b_F = U.T * b
    reconstructed_load = alpha * b_F + beta * g
    graph_mismatch = direct_load - reconstructed_load

    source_guard = {
        "base_checkpoint_version": base_payload["checkpoint_version"],
        "prime_power_inventory": [item["n"] for item in base_payload["source_inventory"]["prime_powers"]],
        "source_hermitian_defect": mp.mpf(source["hermitian_defect"]),
        "source_inversion_commutator_defect": mp.mpf(source["inversion_commutator_defect"]),
        "even_gap_at_q": mp.mpf(source["even_gap_at_q"]),
        "odd_gap_at_q": mp.mpf(source["odd_gap_at_q"]),
    }
    normalization_regression = {
        "source_limiting_Xi_transform_scalar": mp.mpf(normalization["source_limiting_Xi_transform_scalar"]),
        "unit_normalized_limiting_Xi_transform_scalar": mp.mpf(normalization["unit_normalized_limiting_Xi_transform_scalar"]),
        "unit_normalization_limiting_scalar_difference": mp.mpf(normalization["unit_normalization_limiting_scalar_difference"]),
        "unit_normalized_replacement_allowed": False,
    }
    shorted = {
        "regularized": {
            "g_F": g,
            "g_norm": _norm(g),
            "C_F": C,
            "K_F": K_F,
            "delta_r": delta_r,
            "delta_over_epsilon_plus_r": a,
            "schur_fraction": 1 - a,
            "y_r": y_r,
            "v_r": v_r,
            "v_minus_omega_norm": _norm(v_r - omega),
            "v_norm": _norm(v_r),
            "tilted_capture": tilted_capture,
            "rank_one_soft_contribution": rank_soft,
            "deflated_bulk_soft_contribution": bulk_soft,
            "soft_sum": soft_sum,
            "soft_trace_identity_residual": soft_sum - soft_trace,
            "normalized_rank_one_reserve": normalized_rank,
            "normalized_deflated_bulk_reserve": normalized_bulk,
            "reserve_sum": normalized_rank + normalized_bulk,
            "reserve_identity_residual": normalized_rank + normalized_bulk - crowding_reserve,
            "reserve_envelope_lower": envelope_lower,
            "reserve_envelope_upper": envelope_upper,
        },
        "unregularized": {
            "delta_0": delta0,
            "det_B_over_det_C": determinant_ratio,
            "inverse_omega_B_inverse_omega": inverse_rayleigh,
            "determinant_identity_residual": delta0 - determinant_ratio,
            "inverse_rayleigh_identity_residual": delta0 - inverse_rayleigh,
            "v_0": v0,
            "Bv_minus_delta_omega_norm": _norm(Bv_residual),
            "v0_energy_minus_delta": _dot(v0, B, v0) - delta0,
            "rank_one_H0_contribution": rank_H0,
            "deflated_bulk_H0_contribution": bulk_H0,
            "H0_sum": H0_sum,
            "H0_identity_residual": H0_sum - H0,
            "delta0_over_minimum_B_eigenvalue": delta0 / mp.mpf(source["B_eigenvalues"][0]),
        },
        "graph_load": {
            "a0_F_direct": direct_load,
            "b_F": b_F,
            "alpha_bF_plus_beta_g": reconstructed_load,
            "identity_residual": graph_mismatch,
            "identity_residual_norm": _norm(graph_mismatch),
        },
    }
    return {
        "source_guard": _encode(source_guard, dps),
        "normalization_regression": _encode(normalization_regression, dps),
        "shorted_reciprocal": _encode(shorted, dps),
    }


def produce(lambda_text: str, N: int, T_text: str, dps: int) -> dict[str, Any]:
    if not isinstance(lambda_text, str) or not isinstance(T_text, str):
        raise TypeError("lambda and T must be exact text; binary64 is forbidden")
    if isinstance(N, bool) or not isinstance(N, int):
        raise TypeError("N must be an exact integer")
    if isinstance(dps, bool) or not isinstance(dps, int):
        raise TypeError("precision must be an exact integer")
    if Fraction(lambda_text) != 2 or N != 4 or Fraction(T_text) != 1:
        raise Checkpoint065Error("checkpoint 0.65 is locked to lambda=2, N=4, T=1")
    if dps not in (40, 80):
        raise Checkpoint065Error("checkpoint 0.65 permits only 40 or 80 decimal digits")

    mp.mp.dps = dps
    base_payload = base.produce(lambda_text, N, T_text, dps)
    sections = _compute_sections(base_payload, dps)
    regularized = sections["shorted_reciprocal"]["regularized"]
    unregularized = sections["shorted_reciprocal"]["unregularized"]
    tolerance = mp.power(10, -max(12, dps // 3))
    construction_tolerance = mp.power(10, -max(18, dps // 2))

    for field in ("delta_r", "tilted_capture", "rank_one_soft_contribution"):
        if mp.mpf(regularized[field]) <= 0:
            raise Checkpoint065Error(f"nonpositive regularized field: {field}")
    if mp.mpf(regularized["deflated_bulk_soft_contribution"]) < -tolerance:
        raise Checkpoint065Error("negative deflated bulk contribution")
    if abs(mp.mpf(regularized["soft_trace_identity_residual"])) > construction_tolerance:
        raise Checkpoint065Error("regularized Feshbach identity failed")
    if abs(mp.mpf(regularized["reserve_identity_residual"])) > construction_tolerance:
        raise Checkpoint065Error("reserve split failed")
    reserve = mp.mpf(regularized["reserve_sum"])
    if not (
        mp.mpf(regularized["reserve_envelope_lower"]) - tolerance
        <= reserve
        <= mp.mpf(regularized["reserve_envelope_upper"]) + tolerance
    ):
        raise Checkpoint065Error("reserve envelope failed")
    if mp.mpf(unregularized["delta_0"]) <= 0:
        raise Checkpoint065Error("nonpositive unregularized shorted energy")
    for field in (
        "determinant_identity_residual",
        "inverse_rayleigh_identity_residual",
        "Bv_minus_delta_omega_norm",
        "v0_energy_minus_delta",
        "H0_identity_residual",
    ):
        if abs(mp.mpf(unregularized[field])) > construction_tolerance:
            raise Checkpoint065Error(f"unregularized identity failed: {field}")
    if mp.mpf(sections["shorted_reciprocal"]["graph_load"]["identity_residual_norm"]) > construction_tolerance:
        raise Checkpoint065Error("graph-load identity failed")

    encoded_inputs = {
        "lambda": lambda_text,
        "N": N,
        "T": T_text,
        "precision_decimal_digits": dps,
        "L": base_payload["inputs"]["L"],
    }
    result = {
        "schema": SCHEMA,
        "checkpoint_version": CHECKPOINT_VERSION,
        "terminal_state": TERMINAL_STATE,
        "claim_class": "FINITE_POINT_DIAGNOSTIC",
        "analytic_uniform_claim": False,
        "inputs": encoded_inputs,
        "locked_conventions": base.LOCKED_CONVENTIONS,
        "locked_formulas": LOCKED_FORMULAS,
        "provenance": PROVENANCE,
        "dependency_sha256": dependency_hashes(),
        "runtime": {"python": sys.version.split()[0], "mpmath": mp.__version__},
        **sections,
        "section_sha256": {name: _raw_hash(value) for name, value in sections.items()},
        "limitations": LIMITATIONS,
    }
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lambda", dest="lambda_text", required=True)
    parser.add_argument("--N", type=int, required=True)
    parser.add_argument("--T", dest="T_text", required=True)
    parser.add_argument("--dps", type=int, required=True)
    parser.add_argument("--output", type=Path, required=True)
    arguments = parser.parse_args()
    result = produce(arguments.lambda_text, arguments.N, arguments.T_text, arguments.dps)
    text = json.dumps(result, indent=2, sort_keys=True, allow_nan=False) + "\n"
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(text, encoding="utf-8")
    print(text, end="")


if __name__ == "__main__":
    main()
