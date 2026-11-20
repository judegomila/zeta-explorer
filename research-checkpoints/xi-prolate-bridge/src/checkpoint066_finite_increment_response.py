#!/usr/bin/env python3
"""Checkpoint 0.66 finite log-determinant increment diagnostic.

The producer is locked to ``lambda=2, N=4, T=1``.  It rebuilds the live
checkpoint-0.64 source matrix, source-normalized prolate anchor, limiting
secant, and fixed-window operator.  It then checks, at the raw Rayleigh
shift ``q`` and the lower two-vector Ritz shift ``u``, the exact finite
identity

    F = log det(A + r K) - log det(A),
    S = r tr(A^{-1} K),

and the scalar bounds ``F <= S <= F/log(2)``.  A nested secant Schur split
separates the deflated-bulk increment from the graph increment.

Only the ``U=q`` ridge has coefficient one.  At the lower Ritz shift
``U=u<q``, the Feshbach transfer has an extra ``q-U`` term.  The later
Ritz-moment theorem controls it by multiplying this checkpoint's soft trace
by the explicit factor ``A_R((q-U)/r)``; checkpoint 0.66 itself does not
serialize that factor.  The fixed-window result still does not prove the
full equation (5.2).  This checkpoint also omits the separate source-Cauchy
factors ``det O_s``, ``m_s``, ``sigma_s``, and ``delta_s``.

All values are arbitrary-precision point values.  Nothing here encloses an
infinite-dimensional limit or proves an asymptotic estimate.
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
SCHEMA = "xi-prolate-checkpoint066-finite-increment-response-v1"
CHECKPOINT_VERSION = "0.66.0-finite-increment-response-point"
TERMINAL_STATE = "P0_INVALIDATED"
THETA = mp.mpf(1)

DEPENDENCIES = (
    "P0_SOURCE_LOCK.json",
    "P0_NORMALIZATION_AUDIT.md",
    "DIRECT_RH_ATTACK.md",
    "vendor/CCM-ZST-2511.22755v1.pdf",
    "vendor/CCM-PROLATE-2310.18423v2.pdf",
    "notes/DIRECT_SOFT_TRACE_RECIPROCAL_RESERVE.md",
    "notes/PROLATE_SECANT_RADICAL_BLOCK_REDUCTION.md",
    "notes/TRANSVERSE_XI_RADICAL_MOMENT_ANGLE_OBSTRUCTION.md",
    "notes/SECANT_SHORTED_RECIPROCAL_FESHBACH.md",
    "notes/TIME_BAND_CAUCHY_DETERMINANT_RESPONSE.md",
    "notes/SECANT_BULK_POSITIVE_DETERMINANT_RESPONSE.md",
    "notes/Q_SHIFT_SECTOR_WEIL_CORE_GATE.md",
    "notes/SECANT_GRAPH_SIGNED_LEAKAGE_GATE.md",
    "notes/COMPACT_ABSOLUTE_SAMPLING_THEOREM.md",
    "notes/PROLATE_ENDPOINT_SCHUR_SINGULAR_ASYMPTOTICS.md",
    "notes/PROLATE_COMPLETE_LEAKAGE_HIGHER_RITZ_NO_GO.md",
    "notes/RELATIVE_ODD_GAP_ENDPOINT_SCHUR_GATE.md",
    "notes/ANCHOR_COMPLEMENT_PARITY_PULLBACK_REDUCTION.md",
    "notes/RAYLEIGH_SELF_REGULARIZED_OBSERVABLE.md",
    "notes/RITZ_MOMENT_SELF_REGULARIZED_TRANSFER.md",
    "src/checkpoint064_reciprocal_secant.py",
    "src/prolate_state.py",
    "src/weil_matrix.py",
    "verifier/checkpoint064_reciprocal_secant_replay.py",
    "verifier/independent_replay.py",
    "verifier/residual_ridged_fixed_window_replay.py",
    "src/checkpoint066_finite_increment_response.py",
    "verifier/checkpoint066_finite_increment_response_replay.py",
)

PINNED_SOURCE_SHA256 = dict(base.PINNED_SOURCE_SHA256)

LOCKED_FORMULAS = {
    "ritz_shift": "w=b/r; c_R=q+<w,B_q w>; u=(q+c_R-sqrt((c_R-q)^2+4r^2))/2 <= q",
    "shifted_complement": "B_U=B_q+(q-U)I>0; A_U=B_U+rI",
    "fixed_homotopy": "X_U=r*A_U^(-1/2)*K_T*A_U^(-1/2), 0<=X_U<=theta*I with theta=1",
    "finite_increment": "F_U=log det(A_U+rK_T)-log det(A_U)=log det(I+X_U)",
    "soft_trace": "S_U=r*tr(A_U^(-1)K_T)=tr(X_U)",
    "increment_bounds": "F_U/theta<=S_U<=F_U/log(1+theta), theta=1",
    "nested_block": "A_U=[[D,g*],[g,C]] in span{omega} plus F; delta=D-g*C^(-1)g",
    "soft_split": "S_U=H_graph+H_bulk; H_graph=r*<v,K_T v>/delta; H_bulk=r*tr(C^(-1)K_F)",
    "increment_split": "F_U=G_U+J_U; G_U=log det(C+rK_F)-log det(C); J_U=log(delta_plus/delta)",
    "bulk_bounds": "G_U/theta<=H_bulk<=G_U/log(1+theta)",
    "graph_bounds": "(exp(J_U)-1)/theta<=H_graph<=(1+theta)*(1-exp(-J_U))/theta",
}

PROVENANCE = {
    "cached_matrix_read": False,
    "cached_eigensystem_read": False,
    "zeta_zero_table_read": False,
    "global_weil_positivity_assumed": False,
    "binary64_parameter_used": False,
    "asymptotic_claim_made": False,
    "producer_source_path": "checkpoint-0.64 live distributional source assembly",
    "producer_prolate_path": "checkpoint-0.64 normalized Legendre recurrence",
    "producer_time_band_path": "checkpoint-0.64 direct evaluation-vector quadrature",
    "producer_limiting_state_path": "checkpoint-0.64 direct x-quadrature arithmetic sum",
    "producer_increment_path": "fresh determinant and Schur calculations; no cached matrix or spectrum",
    "ground_transfer_scope": "only U=q has coefficient one; at certified Ritz U<q the extra q-U term requires the explicit A_R((q-U)/r) multiplier from checkpoint 0.67, which is not serialized here",
    "source_cauchy_factor_replay": "not included: det O_s, m_s, sigma_s, and delta_s are not numerically replayed",
}

LIMITATIONS = [
    "finite arbitrary-precision point diagnostic, not an interval or ball enclosure",
    "producer and verifier share mpmath transcendental arithmetic and linear algebra",
    "the source-normalized prolate state remains a fixed 30-mode Galerkin truncation without a tail enclosure",
    "the finite determinant and Schur identities do not control any unbounded diagonal schedule",
    "for the Ritz shift U<q, F/G/J require the explicit A_R((q-U)/r) multiplier supplied by checkpoint 0.67; this fixed-window response alone does not prove DIRECT_RH_ATTACK equation (5.2)",
    "this checkpoint does not numerically replay the actual-source Cauchy factors det O_s, m_s, sigma_s, and delta_s; it checks only the even-block F/G/J factorization",
    "no locally uniform determinant convergence is inferred from real-axis finite determinant agreement",
    "no asymptotic theorem or Riemann-hypothesis proof is claimed",
]


class Checkpoint066Error(ValueError):
    """Fail-closed input, source-gate, or finite-identity error."""


def _sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1 << 20), b""):
            digest.update(chunk)
    return digest.hexdigest()


def validate_pinned_source_hashes(actual: dict[str, str]) -> None:
    for name, expected in PINNED_SOURCE_SHA256.items():
        if actual.get(name) != expected:
            raise Checkpoint066Error(f"pinned source hash mismatch: {name}")


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
    if A.rows != A.cols:
        raise Checkpoint066Error("matrix inverse requires a square matrix")
    result = mp.matrix(A.rows)
    for j in range(A.rows):
        unit = mp.matrix(A.rows, 1)
        unit[j] = 1
        result[:, j] = mp.lu_solve(A, unit)
    return result


def _positive_logdet(A: mp.matrix) -> mp.mpf:
    determinant = mp.det(A)
    if not determinant > 0:
        raise Checkpoint066Error("positive determinant required")
    return mp.log(determinant)


def _symmetric_inverse_sqrt(A: mp.matrix) -> mp.matrix:
    values, vectors = mp.eigsy((A + A.T) / 2)
    if values[0] <= 0:
        raise Checkpoint066Error("positive definite inverse square root required")
    diagonal = mp.diag([1 / mp.sqrt(values[j]) for j in range(values.rows)])
    return vectors * diagonal * vectors.T


def _encode(value: Any, digits: int) -> Any:
    if isinstance(value, mp.matrix):
        if value.cols == 1:
            return [mp.nstr(value[i], digits) for i in range(value.rows)]
        return [
            [mp.nstr(value[i, j], digits) for j in range(value.cols)]
            for i in range(value.rows)
        ]
    if isinstance(value, mp.mpf):
        return mp.nstr(value, digits)
    if isinstance(value, dict):
        return {key: _encode(item, digits) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [_encode(item, digits) for item in value]
    if isinstance(value, (str, int, bool)) or value is None:
        return value
    raise TypeError(f"cannot serialize {type(value).__name__}")


def _ritz_geometry(
    B: mp.matrix, b: mp.matrix, rho: mp.mpf, q: mp.mpf
) -> tuple[dict[str, Any], mp.mpf]:
    if not rho > 0:
        raise Checkpoint066Error("positive residual required for the Ritz shift")
    w = b / rho
    residual_direction_energy = _dot(w, B, w)
    c_R = q + residual_direction_energy
    discriminant = mp.sqrt((c_R - q) ** 2 + 4 * rho**2)
    u = (q + c_R - discriminant) / 2
    lowering = q - u
    compression = mp.matrix([[q, rho], [rho, c_R]])
    characteristic_residual = mp.det(compression - u * mp.eye(2))
    data = {
        "q": q,
        "residual_r": rho,
        "residual_direction_w": w,
        "residual_direction_norm_defect": abs(_norm(w) - 1),
        "residual_direction_complement_energy": residual_direction_energy,
        "c_R": c_R,
        "two_dimensional_compression": compression,
        "two_dimensional_ritz_u": u,
        "q_minus_u": lowering,
        "ritz_characteristic_residual": characteristic_residual,
    }
    return data, u


def _shift_case(
    label: str,
    shift_U: mp.mpf,
    q: mp.mpf,
    B: mp.matrix,
    K: mp.matrix,
    rho: mp.mpf,
    epsilon: mp.mpf,
    omega: mp.matrix,
    F_basis: mp.matrix,
    g: mp.matrix,
    C0: mp.matrix,
    K_F: mp.matrix,
    odd_gap_q: mp.mpf,
) -> tuple[dict[str, Any], dict[str, Any]]:
    lowering = q - shift_U
    if lowering < 0:
        raise Checkpoint066Error("shift U must not exceed q")

    identity = mp.eye(B.rows)
    B_U = B + lowering * identity
    odd_gap_at_U = odd_gap_q + lowering
    A = B_U + rho * identity
    A_plus = A + rho * K
    B_values, _ = mp.eigsy((B_U + B_U.T) / 2)
    A_values, _ = mp.eigsy((A + A.T) / 2)
    if B_values[0] <= 0 or A_values[0] <= 0:
        raise Checkpoint066Error("shifted complement or ridged block is nonpositive")

    A_inverse = _inverse(A)
    soft_trace = rho * _trace(A_inverse * K)
    A_inverse_sqrt = _symmetric_inverse_sqrt(A)
    X = rho * A_inverse_sqrt * K * A_inverse_sqrt
    X = (X + X.T) / 2
    X_values, _ = mp.eigsy(X)
    logdet_A = _positive_logdet(A)
    logdet_A_plus = _positive_logdet(A_plus)
    increment_F = logdet_A_plus - logdet_A
    lower_bound = increment_F / THETA
    upper_bound = increment_F / mp.log1p(THETA)

    D = epsilon + lowering + rho
    C = C0 + (lowering + rho) * mp.eye(C0.rows)
    C_inverse = _inverse(C)
    y = C_inverse * g
    graph_vector = omega - F_basis * y
    short_delta = D - (g.T * y)[0]
    k00 = _dot(omega, K, omega)
    k_F0 = F_basis.T * K * omega
    tilted_capture = _dot(graph_vector, K, graph_vector)
    H_graph = rho * tilted_capture / short_delta
    H_bulk = rho * _trace(C_inverse * K_F)

    C_plus = C + rho * K_F
    g_plus = g + rho * k_F0
    D_plus = D + rho * k00
    delta_plus = D_plus - (g_plus.T * _inverse(C_plus) * g_plus)[0]
    logdet_C = _positive_logdet(C)
    logdet_C_plus = _positive_logdet(C_plus)
    increment_G = logdet_C_plus - logdet_C
    increment_J = mp.log(delta_plus) - mp.log(short_delta)

    bulk_lower = increment_G / THETA
    bulk_upper = increment_G / mp.log1p(THETA)
    graph_lower = mp.expm1(increment_J) / THETA
    graph_upper = (1 + THETA) * (-mp.expm1(-increment_J)) / THETA

    data = {
        "label": label,
        "U": shift_U,
        "q_minus_U": lowering,
        "B_U_eigenvalues": B_values,
        "odd_gap_at_U": odd_gap_at_U,
        "A_eigenvalues": A_values,
        "X_eigenvalues": X_values,
        "X_maximum_eigenvalue": X_values[-1],
        "X_trace": _trace(X),
        "soft_trace_S": soft_trace,
        "logdet_A": logdet_A,
        "logdet_A_plus_rK": logdet_A_plus,
        "log_increment_F": increment_F,
        "determinant_ratio": mp.exp(increment_F),
        "F_over_theta_lower_bound": lower_bound,
        "F_over_log1p_theta_upper_bound": upper_bound,
        "soft_minus_lower_bound": soft_trace - lower_bound,
        "upper_bound_minus_soft": upper_bound - soft_trace,
        "soft_minus_X_trace": soft_trace - _trace(X),
        "nested_secant": {
            "D": D,
            "g_F": g,
            "C": C,
            "K_F": K_F,
            "k00": k00,
            "k_F0": k_F0,
            "short_delta": short_delta,
            "det_A_over_det_C": mp.det(A) / mp.det(C),
            "short_delta_determinant_residual": short_delta - mp.det(A) / mp.det(C),
            "graph_vector_v": graph_vector,
            "tilted_capture": tilted_capture,
            "H_graph": H_graph,
            "H_bulk": H_bulk,
            "H_graph_plus_H_bulk": H_graph + H_bulk,
            "soft_split_residual": H_graph + H_bulk - soft_trace,
            "D_plus": D_plus,
            "g_plus_F": g_plus,
            "C_plus": C_plus,
            "delta_plus": delta_plus,
            "det_A_plus_rK_over_det_C_plus": mp.det(A_plus) / mp.det(C_plus),
            "delta_plus_determinant_residual": delta_plus - mp.det(A_plus) / mp.det(C_plus),
            "G_bulk_increment": increment_G,
            "J_graph_increment": increment_J,
            "G_plus_J": increment_G + increment_J,
            "F_minus_G_plus_J": increment_F - (increment_G + increment_J),
            "G_over_theta_lower_bound": bulk_lower,
            "G_over_log1p_theta_upper_bound": bulk_upper,
            "H_bulk_minus_lower_bound": H_bulk - bulk_lower,
            "bulk_upper_bound_minus_H_bulk": bulk_upper - H_bulk,
            "exp_J_minus_one_over_theta_lower_bound": graph_lower,
            "one_plus_theta_times_one_minus_exp_minus_J_over_theta_upper_bound": graph_upper,
            "H_graph_minus_lower_bound": H_graph - graph_lower,
            "graph_upper_bound_minus_H_graph": graph_upper - H_graph,
        },
    }
    live = {
        "B_min": B_values[0],
        "odd_gap": odd_gap_at_U,
        "A_min": A_values[0],
        "X_min": X_values[0],
        "X_max": X_values[-1],
        "F": increment_F,
        "G": increment_G,
        "J": increment_J,
        "S": soft_trace,
        "H_bulk": H_bulk,
        "H_graph": H_graph,
        "lower_slack": soft_trace - lower_bound,
        "upper_slack": upper_bound - soft_trace,
        "bulk_lower_slack": H_bulk - bulk_lower,
        "bulk_upper_slack": bulk_upper - H_bulk,
        "graph_lower_slack": H_graph - graph_lower,
        "graph_upper_slack": graph_upper - H_graph,
        "soft_X_residual": soft_trace - _trace(X),
        "soft_split_residual": H_graph + H_bulk - soft_trace,
        "increment_split_residual": increment_F - increment_G - increment_J,
        "short_det_residual": short_delta - mp.det(A) / mp.det(C),
        "plus_det_residual": delta_plus - mp.det(A_plus) / mp.det(C_plus),
    }
    return data, live


def _compute_sections(
    base_payload: dict[str, Any], dps: int
) -> tuple[dict[str, Any], dict[str, Any]]:
    source = base_payload["source_geometry"]
    normalization = base_payload["normalization"]
    secant = base_payload["secant_geometry"]

    B = _matrix(source["B_even_complement_at_q"])
    K = _matrix(source["K_T_even_complement"])
    b = _vector(source["residual_vector_even_complement"])
    q = mp.mpf(source["q"])
    rho = mp.mpf(source["residual_r"])
    epsilon = mp.mpf(secant["epsilon"])
    omega = _vector(secant["omega_even_complement"])

    ritz, ritz_u = _ritz_geometry(B, b, rho, q)
    F_basis = base._orthogonal_complement(omega)
    g = F_basis.T * B * omega
    C0 = F_basis.T * B * F_basis
    K_F = F_basis.T * K * F_basis
    odd_gap_q = mp.mpf(source["odd_gap_at_q"])

    q_case, q_live = _shift_case(
        "raw_q", q, q, B, K, rho, epsilon, omega, F_basis, g, C0, K_F,
        odd_gap_q,
    )
    u_case, u_live = _shift_case(
        "two_dimensional_ritz_u",
        ritz_u,
        q,
        B,
        K,
        rho,
        epsilon,
        omega,
        F_basis,
        g,
        C0,
        K_F,
        odd_gap_q,
    )

    source_guard = {
        "base_checkpoint_version": base_payload["checkpoint_version"],
        "prime_power_inventory": [
            item["n"] for item in base_payload["source_inventory"]["prime_powers"]
        ],
        "source_hermitian_defect": mp.mpf(source["hermitian_defect"]),
        "source_inversion_commutator_defect": mp.mpf(
            source["inversion_commutator_defect"]
        ),
        "even_gap_at_q": mp.mpf(source["even_gap_at_q"]),
        "odd_gap_at_q": mp.mpf(source["odd_gap_at_q"]),
        "K_T_minimum_eigenvalue": mp.mpf(source["K_T_eigenvalue_min"]),
        "K_T_maximum_eigenvalue": mp.mpf(source["K_T_eigenvalue_max"]),
    }
    normalization_regression = {
        "source_limiting_Xi_transform_scalar": mp.mpf(
            normalization["source_limiting_Xi_transform_scalar"]
        ),
        "unit_normalized_limiting_Xi_transform_scalar": mp.mpf(
            normalization["unit_normalized_limiting_Xi_transform_scalar"]
        ),
        "unit_normalization_limiting_scalar_difference": mp.mpf(
            normalization["unit_normalization_limiting_scalar_difference"]
        ),
        "unit_normalized_replacement_allowed": False,
    }
    response = {
        "theta": THETA,
        "ridge_r": rho,
        "homotopy_increment_s_equals_theta_r": THETA * rho,
        "shift_order": ["raw_q", "two_dimensional_ritz_u"],
        "raw_q": q_case,
        "two_dimensional_ritz_u": u_case,
    }
    sections = {
        "source_guard": _encode(source_guard, dps),
        "normalization_regression": _encode(normalization_regression, dps),
        "ritz_geometry": _encode(ritz, dps),
        "finite_increment_response": _encode(response, dps),
    }
    live = {
        "ritz_u": ritz_u,
        "q": q,
        "ritz_lowering": q - ritz_u,
        "ritz_characteristic_residual": ritz["ritz_characteristic_residual"],
        "residual_direction_norm_defect": ritz["residual_direction_norm_defect"],
        "cases": {"raw_q": q_live, "two_dimensional_ritz_u": u_live},
    }
    return sections, live


def _validate_live(live: dict[str, Any], dps: int) -> None:
    tolerance = mp.power(10, -max(12, dps // 3))
    construction_tolerance = mp.power(10, -max(18, dps // 2))
    if not (live["ritz_u"] <= live["q"] and live["ritz_lowering"] > 0):
        raise Checkpoint066Error("invalid lower two-vector Ritz shift")
    if abs(live["ritz_characteristic_residual"]) > construction_tolerance:
        raise Checkpoint066Error("Ritz characteristic identity failed")
    if live["residual_direction_norm_defect"] > construction_tolerance:
        raise Checkpoint066Error("residual direction is not normalized")

    for label, case in live["cases"].items():
        if case["B_min"] <= 0 or case["odd_gap"] <= 0 or case["A_min"] <= 0:
            raise Checkpoint066Error(f"nonpositive shifted block: {label}")
        if case["X_min"] < -tolerance or case["X_max"] > THETA + tolerance:
            raise Checkpoint066Error(f"fixed-homotopy contraction failed: {label}")
        for field in ("F", "G", "J", "S", "H_bulk", "H_graph"):
            if case[field] < -tolerance:
                raise Checkpoint066Error(f"negative increment quantity {field}: {label}")
        for field in (
            "lower_slack",
            "upper_slack",
            "bulk_lower_slack",
            "bulk_upper_slack",
            "graph_lower_slack",
            "graph_upper_slack",
        ):
            if case[field] < -tolerance:
                raise Checkpoint066Error(f"finite increment bound failed {field}: {label}")
        for field in (
            "soft_X_residual",
            "soft_split_residual",
            "increment_split_residual",
            "short_det_residual",
            "plus_det_residual",
        ):
            if abs(case[field]) > construction_tolerance:
                raise Checkpoint066Error(f"finite increment identity failed {field}: {label}")


def produce(lambda_text: str, N: int, T_text: str, dps: int) -> dict[str, Any]:
    if not isinstance(lambda_text, str) or not isinstance(T_text, str):
        raise TypeError("lambda and T must be exact text; binary64 is forbidden")
    if isinstance(N, bool) or not isinstance(N, int):
        raise TypeError("N must be an exact integer")
    if isinstance(dps, bool) or not isinstance(dps, int):
        raise TypeError("precision must be an exact integer")
    if Fraction(lambda_text) != 2 or N != 4 or Fraction(T_text) != 1:
        raise Checkpoint066Error("checkpoint 0.66 is locked to lambda=2, N=4, T=1")
    if dps not in (40, 80):
        raise Checkpoint066Error("checkpoint 0.66 permits only 40 or 80 decimal digits")

    mp.mp.dps = dps
    base_payload = base.produce(lambda_text, N, T_text, dps)
    sections, live = _compute_sections(base_payload, dps)
    _validate_live(live, dps)

    inputs = {
        "lambda": lambda_text,
        "N": N,
        "T": T_text,
        "precision_decimal_digits": dps,
        "L": base_payload["inputs"]["L"],
    }
    return {
        "schema": SCHEMA,
        "checkpoint_version": CHECKPOINT_VERSION,
        "terminal_state": TERMINAL_STATE,
        "claim_class": "FINITE_POINT_DIAGNOSTIC",
        "analytic_uniform_claim": False,
        "inputs": inputs,
        "locked_conventions": base.LOCKED_CONVENTIONS,
        "locked_formulas": LOCKED_FORMULAS,
        "provenance": PROVENANCE,
        "dependency_sha256": dependency_hashes(),
        "runtime": {"python": sys.version.split()[0], "mpmath": mp.__version__},
        **sections,
        "section_sha256": {
            name: _raw_hash(value) for name, value in sections.items()
        },
        "limitations": LIMITATIONS,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lambda", dest="lambda_text", required=True)
    parser.add_argument("--N", type=int, required=True)
    parser.add_argument("--T", dest="T_text", required=True)
    parser.add_argument("--dps", type=int, required=True)
    parser.add_argument("--output", type=Path, required=True)
    arguments = parser.parse_args()
    result = produce(
        arguments.lambda_text, arguments.N, arguments.T_text, arguments.dps
    )
    text = json.dumps(result, indent=2, sort_keys=True, allow_nan=False) + "\n"
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(text, encoding="utf-8")
    print(text, end="")


if __name__ == "__main__":
    main()
