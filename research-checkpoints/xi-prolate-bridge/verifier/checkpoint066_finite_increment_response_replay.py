#!/usr/bin/env python3
"""Independent replay of checkpoint 0.66 finite determinant increments.

No checkpoint-0.66 producer module is imported.  The source matrix, prolate
anchor, limiting secant, and time-band matrix are rebuilt through the
independent checkpoint-0.64 replay path.  Determinants are reconstructed as
sums of logarithms of freshly diagonalized positive matrices rather than by
reading producer determinant values.
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

import checkpoint064_reciprocal_secant_replay as base


ROOT = Path(__file__).resolve().parents[1]
SCHEMA = "xi-prolate-checkpoint066-finite-increment-response-v1"
REPLAY_SCHEMA = "xi-prolate-checkpoint066-finite-increment-response-replay-v1"
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

TOP_LEVEL_KEYS = {
    "schema",
    "checkpoint_version",
    "terminal_state",
    "claim_class",
    "analytic_uniform_claim",
    "inputs",
    "locked_conventions",
    "locked_formulas",
    "provenance",
    "dependency_sha256",
    "runtime",
    "source_guard",
    "normalization_regression",
    "ritz_geometry",
    "finite_increment_response",
    "section_sha256",
    "limitations",
}
SECTION_NAMES = (
    "source_guard",
    "normalization_regression",
    "ritz_geometry",
    "finite_increment_response",
)


class ReplayError(ValueError):
    """Strict-contract or independent-reconstruction failure."""


def _sha256_bytes(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def _sha256_file(path: Path) -> str:
    return _sha256_bytes(path.read_bytes())


def _validate_pinned_source_hashes(actual: dict[str, str]) -> None:
    for name, expected in PINNED_SOURCE_SHA256.items():
        if actual.get(name) != expected:
            raise ReplayError(f"pinned source hash mismatch: {name}")


def _dependency_hashes() -> dict[str, str]:
    actual = {name: _sha256_file(ROOT / name) for name in DEPENDENCIES}
    _validate_pinned_source_hashes(actual)
    return actual


def _raw_hash(value: Any) -> str:
    raw = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("ascii")
    return hashlib.sha256(raw).hexdigest()


def _pairs_no_duplicates(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise ReplayError(f"duplicate JSON key: {key}")
        result[key] = value
    return result


def _reject_number(text: str) -> None:
    raise ReplayError(f"binary64/non-integer JSON number forbidden: {text}")


def strict_json_loads(raw: bytes | str) -> dict[str, Any]:
    try:
        text = raw.decode("utf-8") if isinstance(raw, bytes) else raw
        if not isinstance(text, str):
            raise ReplayError("producer artifact must be bytes or text")
        value = json.loads(
            text,
            object_pairs_hook=_pairs_no_duplicates,
            parse_float=_reject_number,
            parse_constant=_reject_number,
        )
    except (json.JSONDecodeError, UnicodeDecodeError) as exc:
        raise ReplayError("invalid producer artifact") from exc
    if not isinstance(value, dict):
        raise ReplayError("producer artifact root must be an object")
    _reject_binary64_recursive(value)
    return value


def _reject_binary64_recursive(value: Any, path: str = "root") -> None:
    if isinstance(value, float):
        raise ReplayError(f"binary64 value forbidden at {path}")
    if isinstance(value, str):
        try:
            numeric = mp.mpf(value)
        except (ValueError, TypeError):
            return
        if not mp.isfinite(numeric):
            raise ReplayError(f"nonfinite serialized numeric forbidden at {path}")
        return
    if isinstance(value, dict):
        for key, item in value.items():
            if key.lower() in {
                "pass",
                "passed",
                "certified",
                "replay_agrees",
                "asymptotic_pass",
            } and isinstance(item, bool):
                raise ReplayError(f"cached producer boolean forbidden at {path}.{key}")
            _reject_binary64_recursive(item, f"{path}.{key}")
    elif isinstance(value, list):
        for index, item in enumerate(value):
            _reject_binary64_recursive(item, f"{path}[{index}]")


def _numeric_string(value: Any) -> mp.mpf | None:
    if not isinstance(value, str):
        return None
    try:
        result = mp.mpf(value)
    except (ValueError, TypeError):
        return None
    return result if mp.isfinite(result) else None


def _canonical_L_text(lambda_text: str, dps: int) -> str:
    try:
        value = Fraction(lambda_text)
    except (TypeError, ValueError, ZeroDivisionError) as exc:
        raise ReplayError("lambda must be exact text") from exc
    with mp.workdps(dps):
        lam = mp.mpf(value.numerator) / value.denominator
        return mp.nstr(2 * mp.log(lam), dps)


def _validate_contract(payload: dict[str, Any]) -> None:
    _reject_binary64_recursive(payload)
    if set(payload) != TOP_LEVEL_KEYS:
        raise ReplayError("top-level field inventory mismatch")
    if payload.get("schema") != SCHEMA or payload.get("checkpoint_version") != CHECKPOINT_VERSION:
        raise ReplayError("wrong checkpoint schema/version")
    if payload.get("terminal_state") != TERMINAL_STATE:
        raise ReplayError("claim/state promotion rejected")
    if payload.get("claim_class") != "FINITE_POINT_DIAGNOSTIC":
        raise ReplayError("only the finite point diagnostic claim is allowed")
    if payload.get("analytic_uniform_claim") is not False:
        raise ReplayError("fake analytic/asymptotic claim rejected")
    if payload.get("locked_conventions") != base.LOCKED_CONVENTIONS:
        raise ReplayError("locked convention inventory mismatch")
    if payload.get("locked_formulas") != LOCKED_FORMULAS:
        raise ReplayError("locked formula inventory mismatch")
    if payload.get("provenance") != PROVENANCE:
        raise ReplayError("provenance inventory mismatch")
    if payload.get("limitations") != LIMITATIONS:
        raise ReplayError("limitation inventory mismatch")
    if payload.get("dependency_sha256") != _dependency_hashes():
        raise ReplayError("dependency hash mismatch")
    if payload.get("runtime") != {
        "python": sys.version.split()[0],
        "mpmath": mp.__version__,
    }:
        raise ReplayError("runtime metadata mismatch")

    inputs = payload.get("inputs")
    if not isinstance(inputs, dict) or set(inputs) != {
        "lambda",
        "N",
        "T",
        "precision_decimal_digits",
        "L",
    }:
        raise ReplayError("input inventory mismatch")
    if not isinstance(inputs["lambda"], str) or not isinstance(inputs["T"], str):
        raise ReplayError("lambda and T must be exact text")
    try:
        lam = Fraction(inputs["lambda"])
        time = Fraction(inputs["T"])
    except (TypeError, ValueError, ZeroDivisionError) as exc:
        raise ReplayError("lambda and T must be exact text") from exc
    if lam != 2 or time != 1 or inputs["N"] != 4 or isinstance(inputs["N"], bool):
        raise ReplayError("checkpoint point mismatch")
    dps = inputs["precision_decimal_digits"]
    if dps not in (40, 80) or isinstance(dps, bool):
        raise ReplayError("precision mismatch")
    canonical_L = _canonical_L_text(inputs["lambda"], dps)
    if inputs["L"] != canonical_L:
        raise ReplayError("noncanonical logarithmic length")

    hashes = payload.get("section_sha256")
    if not isinstance(hashes, dict) or set(hashes) != set(SECTION_NAMES):
        raise ReplayError("section hash inventory mismatch")
    for name in SECTION_NAMES:
        if hashes.get(name) != _raw_hash(payload.get(name)):
            raise ReplayError(f"section hash mismatch: {name}")

    guard = payload.get("source_guard")
    if not isinstance(guard, dict) or guard.get("base_checkpoint_version") != base.CHECKPOINT_VERSION:
        raise ReplayError("base checkpoint guard mismatch")
    if guard.get("prime_power_inventory") != [2, 3, 4]:
        raise ReplayError("inclusive prime-power inventory mismatch")
    for field in ("even_gap_at_q", "odd_gap_at_q"):
        value = _numeric_string(guard.get(field))
        if value is None or value <= 0:
            raise ReplayError(f"nonpositive complementary gap rejected: {field}")
    k_min = _numeric_string(guard.get("K_T_minimum_eigenvalue"))
    k_max = _numeric_string(guard.get("K_T_maximum_eigenvalue"))
    if k_min is None or k_max is None or k_min < 0 or k_max > 1:
        raise ReplayError("fixed-window positive-contraction guard failed")

    normalization = payload.get("normalization_regression")
    if not isinstance(normalization, dict) or normalization.get(
        "unit_normalized_replacement_allowed"
    ) is not False:
        raise ReplayError("source normalization replacement rejected")
    source_scalar = _numeric_string(
        normalization.get("source_limiting_Xi_transform_scalar")
    )
    unit_scalar = _numeric_string(
        normalization.get("unit_normalized_limiting_Xi_transform_scalar")
    )
    if source_scalar is None or unit_scalar is None or source_scalar == unit_scalar:
        raise ReplayError("normalization regression scalar mismatch")

    response = payload.get("finite_increment_response")
    if not isinstance(response, dict) or response.get("shift_order") != [
        "raw_q",
        "two_dimensional_ritz_u",
    ]:
        raise ReplayError("shift inventory mismatch")
    if _numeric_string(response.get("theta")) != 1:
        raise ReplayError("fixed homotopy theta must equal one")


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


def _solve_columns(A: mp.matrix, right: mp.matrix) -> mp.matrix:
    result = mp.matrix(A.rows, right.cols)
    for j in range(right.cols):
        result[:, j] = mp.lu_solve(A, right[:, j])
    return result


def _inverse(A: mp.matrix) -> mp.matrix:
    return _solve_columns(A, mp.eye(A.rows))


def _positive_logdet_eigen(A: mp.matrix) -> mp.mpf:
    values, _ = mp.eigsy((A + A.T) / 2)
    if values[0] <= 0:
        raise ReplayError("positive definite log determinant required")
    return mp.fsum(mp.log(values[j]) for j in range(values.rows))


def _symmetric_inverse_sqrt(A: mp.matrix) -> mp.matrix:
    values, vectors = mp.eigsy((A + A.T) / 2)
    if values[0] <= 0:
        raise ReplayError("positive definite inverse square root required")
    return vectors * mp.diag([1 / mp.sqrt(values[j]) for j in range(values.rows)]) * vectors.T


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


def _base_prerequisite_gates(
    live: dict[str, Any], tolerance: mp.mpf, construction_tolerance: mp.mpf
) -> dict[str, bool]:
    return {
        "base_source_hermitian": live["source_hermitian_defect"] <= construction_tolerance,
        "base_source_inversion": live["source_inversion_defect"] <= construction_tolerance,
        "base_anchor_inversion_even": live["kappa_even_defect"] <= construction_tolerance,
        "base_limiting_projection_inversion_even": live["z0_even_defect"] <= construction_tolerance,
        "base_limiting_projection_imaginary_small": live["z0_imaginary_defect"] <= construction_tolerance,
        "base_secant_orthogonalized": live["secant_orthogonality_defect"] <= construction_tolerance,
        "base_secant_normalized": live["omega_norm_defect"] <= construction_tolerance,
        "base_positive_residual": live["r"] > 0,
        "base_positive_even_gap": live["B_values"][0] > 0,
        "base_positive_odd_gap": live["odd_values"][0] > 0,
        "base_positive_secant_energy": live["epsilon"] > 0,
        "base_positive_fixed_window_capture": live["c2"] > 0,
        "base_K_positive_contraction": live["K_values"][0] >= -tolerance
        and live["K_values"][-1] <= 1 + tolerance,
        "base_D0_identity": abs(live["D0"] - live["D0_rhs"]) <= construction_tolerance,
        "base_residual_pythagoras": abs(live["residual_pythagoras"]) <= construction_tolerance,
    }


def _ritz_geometry(
    B: mp.matrix, b: mp.matrix, rho: mp.mpf, q: mp.mpf
) -> tuple[dict[str, Any], mp.mpf]:
    w = b / rho
    complement_energy = _dot(w, B, w)
    c_R = q + complement_energy
    discriminant = mp.sqrt((c_R - q) ** 2 + 4 * rho**2)
    u = (q + c_R - discriminant) / 2
    compression = mp.matrix([[q, rho], [rho, c_R]])
    return {
        "q": q,
        "residual_r": rho,
        "residual_direction_w": w,
        "residual_direction_norm_defect": abs(_norm(w) - 1),
        "residual_direction_complement_energy": complement_energy,
        "c_R": c_R,
        "two_dimensional_compression": compression,
        "two_dimensional_ritz_u": u,
        "q_minus_u": q - u,
        "ritz_characteristic_residual": mp.det(compression - u * mp.eye(2)),
    }, u


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
        raise ReplayError("shift U exceeds q")
    identity = mp.eye(B.rows)
    B_U = B + lowering * identity
    odd_gap_at_U = odd_gap_q + lowering
    A = B_U + rho * identity
    A_plus = A + rho * K
    B_values, _ = mp.eigsy((B_U + B_U.T) / 2)
    A_values, _ = mp.eigsy((A + A.T) / 2)
    A_inverse = _inverse(A)
    soft_trace = rho * _trace(A_inverse * K)
    inverse_sqrt = _symmetric_inverse_sqrt(A)
    X = rho * inverse_sqrt * K * inverse_sqrt
    X = (X + X.T) / 2
    X_values, _ = mp.eigsy(X)
    logdet_A = _positive_logdet_eigen(A)
    logdet_A_plus = _positive_logdet_eigen(A_plus)
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
    logdet_C = _positive_logdet_eigen(C)
    logdet_C_plus = _positive_logdet_eigen(C_plus)
    increment_G = logdet_C_plus - logdet_C
    increment_J = mp.log(delta_plus) - mp.log(short_delta)
    bulk_lower = increment_G / THETA
    bulk_upper = increment_G / mp.log1p(THETA)
    graph_lower = mp.expm1(increment_J) / THETA
    graph_upper = (1 + THETA) * (-mp.expm1(-increment_J)) / THETA

    det_A = mp.det(A)
    det_C = mp.det(C)
    det_A_plus = mp.det(A_plus)
    det_C_plus = mp.det(C_plus)
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
            "det_A_over_det_C": det_A / det_C,
            "short_delta_determinant_residual": short_delta - det_A / det_C,
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
            "det_A_plus_rK_over_det_C_plus": det_A_plus / det_C_plus,
            "delta_plus_determinant_residual": delta_plus - det_A_plus / det_C_plus,
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
        "short_det_residual": short_delta - det_A / det_C,
        "plus_det_residual": delta_plus - det_A_plus / det_C_plus,
    }
    return data, live


def _reconstruct(
    payload: dict[str, Any]
) -> tuple[dict[str, Any], dict[str, Any]]:
    inputs = payload["inputs"]
    dps = inputs["precision_decimal_digits"]
    mp.mp.dps = dps
    canonical_L = _canonical_L_text(inputs["lambda"], dps)
    base_inputs = {
        "lambda": inputs["lambda"],
        "N": inputs["N"],
        "T": inputs["T"],
        "precision_decimal_digits": dps,
        "prolate_even_legendre_basis_size": base.PROLATE_BASIS_SIZE,
        "limiting_arithmetic_sum_cutoff": base.ARITHMETIC_SUM_CUTOFF,
        "L": canonical_L,
    }
    base_sections, base_live = base._reconstruct({"inputs": base_inputs})
    tolerance = mp.power(10, -max(12, dps // 3))
    construction_tolerance = mp.power(10, -max(18, dps // 2))
    base_gates = _base_prerequisite_gates(
        base_live, tolerance, construction_tolerance
    )
    if not all(base_gates.values()):
        raise ReplayError("base reconstruction prerequisite gate failed")

    source = base_sections["source_geometry"]
    normalization = base_sections["normalization"]
    secant = base_sections["secant_geometry"]
    B = base_live["B"]
    K = base_live["K"]
    b = _vector(source["residual_vector_even_complement"])
    q = base_live["q"]
    rho = base_live["r"]
    epsilon = base_live["epsilon"]
    omega = _vector(secant["omega_even_complement"])

    ritz, ritz_u = _ritz_geometry(B, b, rho, q)
    F_basis = base._orthogonal_complement(omega)
    g = F_basis.T * B * omega
    C0 = F_basis.T * B * F_basis
    K_F = F_basis.T * K * F_basis
    odd_gap_q = base_live["odd_values"][0]
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
        "base_checkpoint_version": base.CHECKPOINT_VERSION,
        "prime_power_inventory": [
            item["n"] for item in base_sections["source_inventory"]["prime_powers"]
        ],
        "source_hermitian_defect": base_live["source_hermitian_defect"],
        "source_inversion_commutator_defect": base_live["source_inversion_defect"],
        "even_gap_at_q": base_live["B_values"][0],
        "odd_gap_at_q": base_live["odd_values"][0],
        "K_T_minimum_eigenvalue": base_live["K_values"][0],
        "K_T_maximum_eigenvalue": base_live["K_values"][-1],
    }
    normalization_regression = {
        "source_limiting_Xi_transform_scalar": mp.mpf(1) / 4,
        "unit_normalized_limiting_Xi_transform_scalar": mp.power(
            2, mp.mpf(17) / 4
        )
        / (4 * mp.sqrt(33)),
        "unit_normalization_limiting_scalar_difference": (
            mp.power(2, mp.mpf(17) / 4) / mp.sqrt(33) - 1
        )
        / 4,
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
        "base_prerequisite_gates": base_gates,
        "q": q,
        "ritz_u": ritz_u,
        "ritz_lowering": q - ritz_u,
        "ritz_characteristic_residual": ritz["ritz_characteristic_residual"],
        "residual_direction_norm_defect": ritz["residual_direction_norm_defect"],
        "cases": {"raw_q": q_live, "two_dimensional_ritz_u": u_live},
    }
    return sections, live


def _compare_recursive(
    actual: Any, expected: Any, path: str, defects: dict[str, mp.mpf]
) -> None:
    if isinstance(expected, dict):
        if not isinstance(actual, dict) or set(actual) != set(expected):
            raise ReplayError(f"field inventory mismatch at {path}")
        for key in expected:
            _compare_recursive(actual[key], expected[key], f"{path}.{key}", defects)
        return
    if isinstance(expected, list):
        if not isinstance(actual, list) or len(actual) != len(expected):
            raise ReplayError(f"list inventory mismatch at {path}")
        for index, (left, right) in enumerate(zip(actual, expected)):
            _compare_recursive(left, right, f"{path}[{index}]", defects)
        return
    expected_number = _numeric_string(expected)
    actual_number = _numeric_string(actual)
    if expected_number is not None or actual_number is not None:
        if expected_number is None or actual_number is None:
            raise ReplayError(f"numeric serialization mismatch at {path}")
        defects[path] = abs(actual_number - expected_number) / max(
            mp.mpf(1), abs(actual_number), abs(expected_number)
        )
        return
    if actual != expected:
        raise ReplayError(f"exact value mismatch at {path}")


def replay_payload(
    payload: dict[str, Any], producer_sha256: str = "in_memory"
) -> dict[str, Any]:
    _validate_contract(payload)
    dps = payload["inputs"]["precision_decimal_digits"]
    mp.mp.dps = dps
    expected, live = _reconstruct(payload)
    defects: dict[str, mp.mpf] = {}
    for name in SECTION_NAMES:
        _compare_recursive(payload[name], expected[name], name, defects)
    actual_L = mp.mpf(_canonical_L_text(payload["inputs"]["lambda"], dps))
    supplied_L = mp.mpf(payload["inputs"]["L"])
    defects["inputs.L"] = abs(supplied_L - actual_L) / max(
        mp.mpf(1), abs(supplied_L), abs(actual_L)
    )

    tolerance = mp.power(10, -max(12, dps // 3))
    construction_tolerance = mp.power(10, -max(18, dps // 2))
    gates: dict[str, bool] = {
        **live["base_prerequisite_gates"],
        "L_reconstructed": defects["inputs.L"] <= tolerance,
        "ritz_order": live["ritz_u"] <= live["q"] and live["ritz_lowering"] > 0,
        "ritz_characteristic_identity": abs(live["ritz_characteristic_residual"])
        <= construction_tolerance,
        "residual_direction_normalized": live["residual_direction_norm_defect"]
        <= construction_tolerance,
    }
    for label, case in live["cases"].items():
        prefix = "q" if label == "raw_q" else "ritz_u"
        gates.update(
            {
                f"{prefix}_positive_B_U": case["B_min"] > 0,
                f"{prefix}_positive_odd_gap_at_U": case["odd_gap"] > 0,
                f"{prefix}_positive_A": case["A_min"] > 0,
                f"{prefix}_X_positive_contraction": case["X_min"] >= -tolerance
                and case["X_max"] <= THETA + tolerance,
                f"{prefix}_nonnegative_increments": min(
                    case["F"], case["G"], case["J"]
                )
                >= -tolerance,
                f"{prefix}_finite_increment_bounds": case["lower_slack"]
                >= -tolerance
                and case["upper_slack"] >= -tolerance,
                f"{prefix}_bulk_increment_bounds": case["bulk_lower_slack"]
                >= -tolerance
                and case["bulk_upper_slack"] >= -tolerance,
                f"{prefix}_graph_increment_bounds": case["graph_lower_slack"]
                >= -tolerance
                and case["graph_upper_slack"] >= -tolerance,
                f"{prefix}_trace_X_identity": abs(case["soft_X_residual"])
                <= construction_tolerance,
                f"{prefix}_soft_Schur_split": abs(case["soft_split_residual"])
                <= construction_tolerance,
                f"{prefix}_increment_Schur_split": abs(
                    case["increment_split_residual"]
                )
                <= construction_tolerance,
                f"{prefix}_short_determinant_identity": abs(
                    case["short_det_residual"]
                )
                <= construction_tolerance,
                f"{prefix}_updated_short_determinant_identity": abs(
                    case["plus_det_residual"]
                )
                <= construction_tolerance,
            }
        )

    max_defect = max(defects.values(), default=mp.mpf("0"))
    agrees = max_defect <= tolerance and all(gates.values())
    result = {
        "schema": REPLAY_SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "claim_class": "FINITE_POINT_DIAGNOSTIC_REPLAY",
        "analytic_uniform_claim": False,
        "producer_sha256": producer_sha256,
        "replay_agrees": agrees,
        "tolerance": mp.nstr(tolerance, dps),
        "max_scaled_defect": mp.nstr(max_defect, dps),
        "scaled_defects": {
            name: mp.nstr(value, dps) for name, value in sorted(defects.items())
        },
        "independent_gates": gates,
        "independent_paths": {
            "source_matrix": "verifier/independent_replay distributional source formulas",
            "prolate_state": "differential-form quadrature Galerkin path",
            "time_band": "closed Si/Ci antiderivatives",
            "limiting_projection": "sum-integral exchange with incomplete-gamma segments",
            "log_determinants": "fresh symmetric eigenvalues and summed logarithms; no producer determinant read",
            "nested_secant": "fresh Householder basis and Schur solves",
        },
        "shared_library_limitation": "producer and verifier both use mpmath transcendental arithmetic and linear algebra",
        "producer_values_used_only_for_comparison": True,
    }
    if not agrees:
        raise ReplayError("independent replay disagreement or reconstructed gate failure")
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("producer", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    arguments = parser.parse_args()
    raw = arguments.producer.read_bytes()
    payload = strict_json_loads(raw)
    result = replay_payload(payload, _sha256_bytes(raw))
    text = json.dumps(result, indent=2, sort_keys=True, allow_nan=False) + "\n"
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(text, encoding="utf-8")
    print(text, end="")


if __name__ == "__main__":
    main()
