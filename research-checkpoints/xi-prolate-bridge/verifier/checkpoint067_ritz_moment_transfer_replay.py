#!/usr/bin/env python3
"""Independent replay of checkpoint 0.67 Ritz-moment transfer.

The checkpoint-0.67 producer is deliberately not imported.  The finite Weil
matrix, source-normalized prolate anchor, and fixed time-band observation are
rebuilt through the checkpoint-0.64 independent distributional,
differential-prolate, and closed Si/Ci replay path.  Producer matrices,
eigensystems, booleans, and transcendental values are comparison data only.
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
SCHEMA = "xi-prolate-checkpoint067-ritz-moment-transfer-v1"
REPLAY_SCHEMA = "xi-prolate-checkpoint067-ritz-moment-transfer-replay-v1"
CHECKPOINT_VERSION = "0.67.0-ritz-moment-transfer-point"
TERMINAL_STATE = "P0_INVALIDATED"
THETA = mp.mpf(1)

DEPENDENCIES = (
    "P0_SOURCE_LOCK.json",
    "P0_NORMALIZATION_AUDIT.md",
    "DIRECT_RH_ATTACK.md",
    "vendor/CCM-ZST-2511.22755v1.pdf",
    "vendor/CCM-PROLATE-2310.18423v2.pdf",
    "notes/RITZ_MOMENT_SELF_REGULARIZED_TRANSFER.md",
    "notes/RAYLEIGH_SELF_REGULARIZED_OBSERVABLE.md",
    "notes/TIME_BAND_CAUCHY_DETERMINANT_RESPONSE.md",
    "notes/SECANT_BULK_POSITIVE_DETERMINANT_RESPONSE.md",
    "notes/Q_SHIFT_SECTOR_WEIL_CORE_GATE.md",
    "notes/PROJECTIVE_LOW_MODE_DETERMINANT_BRIDGE.md",
    "src/checkpoint064_reciprocal_secant.py",
    "src/checkpoint066_finite_increment_response.py",
    "src/checkpoint067_ritz_moment_transfer.py",
    "src/prolate_state.py",
    "src/weil_matrix.py",
    "verifier/checkpoint064_reciprocal_secant_replay.py",
    "verifier/checkpoint066_finite_increment_response_replay.py",
    "verifier/checkpoint067_ritz_moment_transfer_replay.py",
    "verifier/independent_replay.py",
    "verifier/residual_ridged_fixed_window_replay.py",
    "tests/test_checkpoint066_finite_increment_response.py",
    "tests/test_checkpoint067_ritz_moment_transfer.py",
    "tests/test_ritz_moment_self_regularized_transfer.py",
)

PINNED_SOURCE_SHA256 = dict(base.PINNED_SOURCE_SHA256)

LOCKED_FORMULAS = {
    "ritz_shift": "w=b/r; c_R=q+<w,B_q w>; u=(q+c_R-sqrt((c_R-q)^2+4r^2))/2; d=q-u",
    "ritz_moment": "B_U=B_q+dI; m=<w,B_U w>; d*m=r^2 at exact U=u",
    "ground_displacement": "mu=lambda_min(Q_+); h=u-mu; z=(B_U+hI)^(-1)b; d+h=<b,z>",
    "automatic_ridge": "rho=(sqrt(d^2+4r^2)-d)/2; 0<=h<=rho<=r",
    "C_R_squared": "alpha=(r/d)^2; C_R^2 is equation (3.2) of RITZ_MOMENT_SELF_REGULARIZED_TRANSFER.md",
    "A_R": "delta=d/r; A_R=1+delta+delta*(1+delta)^2/2 for delta<=1, else 1+delta+2delta^2",
    "A_cert": "A_cert=(1+delta)*(1+2delta)>=A_R; point evaluation, not outward interval arithmetic",
    "minimal_ridge": "A_actual=<z,(B_U+rI)z>/r=(d+h+(r-h)||z||^2)/r",
    "ritz_loewner": "z*z^T<=A_R*r*(B_U+rI)^(-1)",
    "positive_increment": "H_K=r*tr((B_U+rI)^(-1)K); F_K=log det(B_U+rI+rK)-log det(B_U+rI)",
    "increment_bounds": "F_K<=H_K<=F_K/log(2); <z,Kz><=A_R*H_K<=A_R*F_K/log(2)",
    "unrestricted_envelope": "Fopt=(d+rho)(B_U+rho I)^(-1)+rho(dI-B_U)_+B_U^(-1)(B_U+rho I)^(-1)",
    "low_band_partition": "use 1_(0,d)(B_U) and 1_[d,infinity)(B_U); the endpoint is not double-counted",
}

PROVENANCE = {
    "cached_matrix_read": False,
    "cached_eigensystem_read": False,
    "zeta_zero_table_read": False,
    "global_weil_positivity_assumed": False,
    "binary64_parameter_used": False,
    "asymptotic_claim_made": False,
    "equation_5_2_claim_made": False,
    "producer_source_path": "checkpoint-0.64 live distributional source assembly",
    "producer_prolate_path": "checkpoint-0.64 normalized Legendre recurrence",
    "producer_time_band_path": "checkpoint-0.64 direct evaluation-vector quadrature",
    "producer_ritz_path": "fresh two-vector compression from q, b, and the complete even complement",
    "producer_ground_path": "fresh eigsy reconstruction of the complete even block; diagnostic only",
    "producer_transfer_path": "Ritz moment and residual-ridged theorem formulas; no cached finite spectrum",
    "shared_arithmetic_limitation": "producer and verifier share mpmath transcendental arithmetic",
}

LIMITATIONS = [
    "finite arbitrary-precision point diagnostic, not an interval or ball enclosure",
    "producer and verifier share mpmath transcendental arithmetic and linear algebra",
    "the source-normalized prolate state remains a fixed 30-mode Galerkin truncation without a tail enclosure",
    "the finite true-ground eigensystem is freshly reconstructed only as a diagnostic and is not an analytic input",
    "the time-band observation controls a fixed real transform window and is not by itself locally uniform complex convergence",
    "the identity observation is a finite full-L2 diagnostic; no unbounded decay estimate is proved",
    "the piecewise A_R and branch-free A_cert values are point values, not outward-rounded certificates",
    "no sector sign, determinant-response decay, or ratio bound is proved on an unbounded schedule",
    "no conclusion about DIRECT_RH_ATTACK equation (5.2) is inferred from this finite pilot",
]

TOP_LEVEL_KEYS = {
    "schema",
    "checkpoint_version",
    "terminal_state",
    "claim_class",
    "analytic_uniform_claim",
    "equation_5_2_claim",
    "inputs",
    "locked_conventions",
    "locked_formulas",
    "provenance",
    "dependency_sha256",
    "runtime",
    "source_guard",
    "normalization_regression",
    "ritz_moment_geometry",
    "true_ground_diagnostic",
    "residual_ridge_transfer",
    "positive_observations",
    "Fopt_rho",
    "section_sha256",
    "limitations",
}

SECTION_NAMES = (
    "source_guard",
    "normalization_regression",
    "ritz_moment_geometry",
    "true_ground_diagnostic",
    "residual_ridge_transfer",
    "positive_observations",
    "Fopt_rho",
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
            lower = key.lower()
            if lower in {
                "pass",
                "passed",
                "certified",
                "replay_agrees",
                "asymptotic_pass",
            } and isinstance(item, bool):
                raise ReplayError(f"cached producer boolean forbidden at {path}.{key}")
            if lower in {
                "cached_matrix_read",
                "cached_eigensystem_read",
                "zeta_zero_table_read",
                "global_weil_positivity_assumed",
                "binary64_parameter_used",
            } and item is not False:
                raise ReplayError(f"forbidden producer premise at {path}.{key}")
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
    if (
        payload.get("schema") != SCHEMA
        or payload.get("checkpoint_version") != CHECKPOINT_VERSION
    ):
        raise ReplayError("wrong checkpoint schema/version")
    if payload.get("terminal_state") != TERMINAL_STATE:
        raise ReplayError("claim/state promotion rejected")
    if payload.get("claim_class") != "FINITE_POINT_DIAGNOSTIC":
        raise ReplayError("only the finite point diagnostic claim is allowed")
    if payload.get("analytic_uniform_claim") is not False:
        raise ReplayError("fake analytic/asymptotic claim rejected")
    if payload.get("equation_5_2_claim") is not False:
        raise ReplayError("equation (5.2) claim promotion rejected")
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
    if (
        lam != 2
        or time != 1
        or inputs["N"] != 4
        or isinstance(inputs["N"], bool)
    ):
        raise ReplayError("checkpoint point mismatch")
    dps = inputs["precision_decimal_digits"]
    if dps not in (40, 80) or isinstance(dps, bool):
        raise ReplayError("precision mismatch")
    if inputs["L"] != _canonical_L_text(inputs["lambda"], dps):
        raise ReplayError("noncanonical logarithmic length")

    hashes = payload.get("section_sha256")
    if not isinstance(hashes, dict) or set(hashes) != set(SECTION_NAMES):
        raise ReplayError("section hash inventory mismatch")
    for name in SECTION_NAMES:
        if hashes.get(name) != _raw_hash(payload.get(name)):
            raise ReplayError(f"section hash mismatch: {name}")

    guard = payload.get("source_guard")
    if not isinstance(guard, dict):
        raise ReplayError("source guard missing")
    if guard.get("base_checkpoint_version") != base.CHECKPOINT_VERSION:
        raise ReplayError("base checkpoint guard mismatch")
    if guard.get("prime_power_inventory") != [2, 3, 4]:
        raise ReplayError("inclusive prime-power inventory mismatch")
    if guard.get("expected_prime_power_inventory") != [2, 3, 4]:
        raise ReplayError("expected prime-power inventory mismatch")
    if guard.get("prime_endpoint_lambda_squared_included") is not True:
        raise ReplayError("prime endpoint lambda^2 was omitted")
    for field in ("B_U_minimum_eigenvalue", "odd_gap_at_U"):
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

    ground = payload.get("true_ground_diagnostic")
    if not isinstance(ground, dict):
        raise ReplayError("ground diagnostic missing")
    if ground.get("diagnostic_only") is not True:
        raise ReplayError("ground eigensystem may only be diagnostic")
    if ground.get("used_to_construct_Ritz_constants") is not False:
        raise ReplayError("cached ground eigensystem used to construct theorem constants")

    observations = payload.get("positive_observations")
    if not isinstance(observations, dict) or _numeric_string(
        observations.get("theta")
    ) != 1:
        raise ReplayError("fixed homotopy theta must equal one")
    if not isinstance(observations.get("time_band"), dict) or observations[
        "time_band"
    ].get("label") != "K_T_fixed_time_band":
        raise ReplayError("time-band observation inventory mismatch")
    if not isinstance(observations.get("identity"), dict) or observations[
        "identity"
    ].get("label") != "identity_full_L2":
        raise ReplayError("identity observation inventory mismatch")

    fopt = payload.get("Fopt_rho")
    if not isinstance(fopt, dict) or fopt.get(
        "low_band_endpoint_convention"
    ) != "strictly below d is low; equality belongs only to the high branch":
        raise ReplayError("Fopt low-band endpoint convention mismatch")


def _dot(x: mp.matrix, A: mp.matrix, y: mp.matrix) -> mp.mpf:
    return (x.T * A * y)[0]


def _norm(x: mp.matrix) -> mp.mpf:
    return mp.sqrt(mp.fsum(abs(x[i]) ** 2 for i in range(x.rows)))


def _trace(A: mp.matrix) -> mp.mpf:
    return mp.fsum(A[i, i] for i in range(min(A.rows, A.cols)))


def _symmetrize(A: mp.matrix) -> mp.matrix:
    return (A + A.T) / 2


def _solve_columns(A: mp.matrix, right: mp.matrix) -> mp.matrix:
    result = mp.matrix(A.rows, right.cols)
    for column in range(right.cols):
        result[:, column] = mp.lu_solve(A, right[:, column])
    return result


def _inverse(A: mp.matrix) -> mp.matrix:
    if A.rows != A.cols:
        raise ReplayError("matrix inverse requires a square matrix")
    return _solve_columns(A, mp.eye(A.rows))


def _positive_logdet_eigen(A: mp.matrix) -> mp.mpf:
    values, _ = mp.eigsy(_symmetrize(A))
    if values[0] <= 0:
        raise ReplayError("positive definite log determinant required")
    return mp.fsum(mp.log(values[index]) for index in range(values.rows))


def _symmetric_inverse_sqrt(A: mp.matrix) -> mp.matrix:
    values, vectors = mp.eigsy(_symmetrize(A))
    if values[0] <= 0:
        raise ReplayError("positive definite inverse square root required")
    return vectors * mp.diag(
        [1 / mp.sqrt(values[index]) for index in range(values.rows)]
    ) * vectors.T


def _encode(value: Any, digits: int) -> Any:
    if isinstance(value, mp.matrix):
        if value.cols == 1:
            return [mp.nstr(value[index], digits) for index in range(value.rows)]
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
        "base_source_hermitian": live["source_hermitian_defect"]
        <= construction_tolerance,
        "base_source_inversion": live["source_inversion_defect"]
        <= construction_tolerance,
        "base_anchor_inversion_even": live["kappa_even_defect"]
        <= construction_tolerance,
        "base_limiting_projection_inversion_even": live["z0_even_defect"]
        <= construction_tolerance,
        "base_limiting_projection_imaginary_small": live["z0_imaginary_defect"]
        <= construction_tolerance,
        "base_secant_orthogonalized": live["secant_orthogonality_defect"]
        <= construction_tolerance,
        "base_secant_normalized": live["omega_norm_defect"]
        <= construction_tolerance,
        "base_positive_residual": live["r"] > 0,
        "base_positive_even_gap": live["B_values"][0] > 0,
        "base_positive_odd_gap": live["odd_values"][0] > 0,
        "base_positive_secant_energy": live["epsilon"] > 0,
        "base_positive_fixed_window_capture": live["c2"] > 0,
        "base_K_positive_contraction": live["K_values"][0] >= -tolerance
        and live["K_values"][-1] <= 1 + tolerance,
        "base_D0_identity": abs(live["D0"] - live["D0_rhs"])
        <= construction_tolerance,
        "base_residual_pythagoras": abs(live["residual_pythagoras"])
        <= construction_tolerance,
    }


def _ritz_constants(d: mp.mpf, residual_r: mp.mpf) -> dict[str, Any]:
    if d < 0 or residual_r <= 0:
        raise ReplayError("Ritz constants require d>=0 and r>0")
    if d == 0:
        return {
            "delta_d_over_r": mp.mpf(0),
            "alpha_r_squared_over_d_squared": mp.inf,
            "C_R_squared": mp.mpf(1),
            "C_R_branch": "rayleigh_endpoint_d_equals_zero",
            "A_R": mp.mpf(1),
            "A_R_branch": "delta_at_most_one",
            "A_cert": mp.mpf(1),
        }

    delta = d / residual_r
    alpha = (residual_r / d) ** 2
    if alpha <= mp.mpf("0.5"):
        C_R_squared = 1 + 2 / alpha
        C_branch = "alpha_at_most_one_half"
    else:
        root = mp.sqrt(1 + 6 * alpha)
        C_R_squared = 1 + 4 * (2 * root - 1) / (3 * (root - 1) ** 2)
        C_branch = "alpha_at_least_one_half"

    if delta <= 1:
        A_R = 1 + delta + delta * (1 + delta) ** 2 / 2
        A_branch = "delta_at_most_one"
    else:
        A_R = 1 + delta + 2 * delta**2
        A_branch = "delta_at_least_one"
    return {
        "delta_d_over_r": delta,
        "alpha_r_squared_over_d_squared": alpha,
        "C_R_squared": C_R_squared,
        "C_R_branch": C_branch,
        "A_R": A_R,
        "A_R_branch": A_branch,
        "A_cert": (1 + delta) * (1 + 2 * delta),
    }


def _observation_response(
    label: str,
    K: mp.matrix,
    B_U: mp.matrix,
    residual_r: mp.mpf,
    z: mp.matrix,
    A_R: mp.mpf,
    A_cert: mp.mpf,
) -> tuple[dict[str, Any], dict[str, mp.mpf]]:
    identity = mp.eye(B_U.rows)
    D = B_U + residual_r * identity
    D_plus = D + THETA * residual_r * K
    D_inverse = _inverse(D)
    H = residual_r * _trace(D_inverse * K)
    F = _positive_logdet_eigen(D_plus) - _positive_logdet_eigen(D)
    inverse_sqrt = _symmetric_inverse_sqrt(D)
    X = _symmetrize(residual_r * inverse_sqrt * K * inverse_sqrt)
    X_values, _ = mp.eigsy(X)
    K_values, _ = mp.eigsy(_symmetrize(K))
    actual = _dot(z, K, z)
    lower = F / THETA
    upper = F / mp.log1p(THETA)
    theorem_trace_bound = A_R * H
    theorem_determinant_bound = A_R * upper
    cert_trace_bound = A_cert * H
    cert_determinant_bound = A_cert * upper
    data = {
        "label": label,
        "K_eigenvalues": K_values,
        "K_minimum_eigenvalue": K_values[0],
        "K_maximum_eigenvalue": K_values[-1],
        "X_eigenvalues": X_values,
        "X_minimum_eigenvalue": X_values[0],
        "X_maximum_eigenvalue": X_values[-1],
        "soft_trace_H": H,
        "log_increment_F": F,
        "determinant_ratio": mp.exp(F),
        "F_over_theta_lower_bound": lower,
        "F_over_log1p_theta_upper_bound": upper,
        "H_minus_lower_bound": H - lower,
        "upper_bound_minus_H": upper - H,
        "actual_zKz": actual,
        "A_R_times_H_upper_bound": theorem_trace_bound,
        "A_R_times_F_over_log1p_theta_upper_bound": theorem_determinant_bound,
        "A_cert_times_H_upper_bound": cert_trace_bound,
        "A_cert_times_F_over_log1p_theta_upper_bound": cert_determinant_bound,
        "A_R_H_minus_actual": theorem_trace_bound - actual,
        "A_R_F_bound_minus_actual": theorem_determinant_bound - actual,
        "A_cert_H_minus_actual": cert_trace_bound - actual,
        "A_cert_F_bound_minus_actual": cert_determinant_bound - actual,
    }
    live = {
        "K_min": K_values[0],
        "K_max": K_values[-1],
        "X_min": X_values[0],
        "X_max": X_values[-1],
        "H": H,
        "F": F,
        "lower_slack": H - lower,
        "upper_slack": upper - H,
        "trace_transfer_slack": theorem_trace_bound - actual,
        "determinant_transfer_slack": theorem_determinant_bound - actual,
    }
    return data, live


def _fopt_inventory(
    B_U: mp.matrix,
    d: mp.mpf,
    rho: mp.mpf,
    K_T: mp.matrix,
    z: mp.matrix,
) -> tuple[dict[str, Any], dict[str, mp.mpf]]:
    values, vectors = mp.eigsy(_symmetrize(B_U))
    K_in_basis = vectors.T * K_T * vectors
    main_weights: list[mp.mpf] = []
    correction_weights: list[mp.mpf] = []
    total_weights: list[mp.mpf] = []
    inventory: list[dict[str, Any]] = []
    low_count = 0
    distance_to_boundary = mp.inf
    for index in range(values.rows):
        eigenvalue = values[index]
        main = (d + rho) / (eigenvalue + rho)
        is_low = eigenvalue < d
        if is_low:
            correction = rho * (d - eigenvalue) / (
                eigenvalue * (eigenvalue + rho)
            )
            branch = "strict_low_0_to_d"
            low_count += 1
            expected = d / eigenvalue
        else:
            correction = mp.mpf(0)
            branch = "high_d_to_infinity"
            expected = main
        total = main + correction
        distance_to_boundary = min(distance_to_boundary, abs(eigenvalue - d))
        main_weights.append(main)
        correction_weights.append(correction)
        total_weights.append(total)
        inventory.append(
            {
                "index": index,
                "B_U_eigenvalue": eigenvalue,
                "branch": branch,
                "strictly_below_d": is_low,
                "distance_from_d": eigenvalue - d,
                "K_T_leverage": K_in_basis[index, index],
                "main_ridged_weight": main,
                "low_band_correction_weight": correction,
                "Fopt_weight": total,
                "piecewise_expected_weight": expected,
                "piecewise_identity_residual": total - expected,
                "K_T_Fopt_trace_contribution": K_in_basis[index, index] * total,
            }
        )

    main_matrix = vectors * mp.diag(main_weights) * vectors.T
    correction_matrix = vectors * mp.diag(correction_weights) * vectors.T
    Fopt = _symmetrize(main_matrix + correction_matrix)
    Fopt_values, _ = mp.eigsy(Fopt)
    clean = _symmetrize(
        d * _inverse(B_U)
        + rho * _inverse(B_U + rho * mp.eye(B_U.rows))
    )
    actual_outer = z * z.T
    fopt_slack_values, _ = mp.eigsy(_symmetrize(Fopt - actual_outer))
    clean_slack_values, _ = mp.eigsy(_symmetrize(clean - Fopt))
    fopt_K_trace = _trace(Fopt * K_T)
    fopt_identity_trace = _trace(Fopt)
    actual_K = _dot(z, K_T, z)
    actual_norm_squared = (z.T * z)[0]
    data = {
        "sigma_rho": rho,
        "B_U_eigenvalues": values,
        "strict_low_band_count": low_count,
        "high_band_count": values.rows - low_count,
        "distance_to_nearest_d_boundary": distance_to_boundary,
        "low_band_endpoint_convention": "strictly below d is low; equality belongs only to the high branch",
        "spectral_inventory": inventory,
        "main_ridged_matrix": main_matrix,
        "low_band_correction_matrix": correction_matrix,
        "Fopt_matrix": Fopt,
        "Fopt_spectral_weights_in_B_order": mp.matrix(total_weights),
        "Fopt_eigenvalues": Fopt_values,
        "Fopt_K_T_trace": fopt_K_trace,
        "Fopt_identity_trace": fopt_identity_trace,
        "actual_zK_T_z": actual_K,
        "actual_z_norm_squared": actual_norm_squared,
        "Fopt_K_T_trace_minus_actual": fopt_K_trace - actual_K,
        "Fopt_identity_trace_minus_actual": fopt_identity_trace
        - actual_norm_squared,
        "Fopt_minus_zzT_eigenvalues": fopt_slack_values,
        "Fopt_Loewner_minimum_eigenvalue": fopt_slack_values[0],
        "clean_source_separable_bound_matrix": clean,
        "clean_bound_minus_Fopt_eigenvalues": clean_slack_values,
        "clean_bound_minus_Fopt_minimum_eigenvalue": clean_slack_values[0],
    }
    live = {
        "distance_to_boundary": distance_to_boundary,
        "piecewise_residual": max(
            abs(item["piecewise_identity_residual"]) for item in inventory
        ),
        "fopt_loewner_min": fopt_slack_values[0],
        "clean_loewner_min": clean_slack_values[0],
        "K_slack": fopt_K_trace - actual_K,
        "I_slack": fopt_identity_trace - actual_norm_squared,
    }
    return data, live


def _reconstruct(payload: dict[str, Any]) -> tuple[dict[str, Any], dict[str, Any]]:
    inputs = payload["inputs"]
    dps = inputs["precision_decimal_digits"]
    mp.mp.dps = dps
    base_inputs = {
        "lambda": inputs["lambda"],
        "N": inputs["N"],
        "T": inputs["T"],
        "precision_decimal_digits": dps,
        "prolate_even_legendre_basis_size": base.PROLATE_BASIS_SIZE,
        "limiting_arithmetic_sum_cutoff": base.ARITHMETIC_SUM_CUTOFF,
        "L": _canonical_L_text(inputs["lambda"], dps),
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
    B_q = base_live["B"]
    K_T = base_live["K"]
    b = mp.matrix([mp.mpf(value) for value in source["residual_vector_even_complement"]])
    q = base_live["q"]
    residual_r = base_live["r"]
    if residual_r <= 0:
        raise ReplayError("checkpoint 0.67 requires the positive-residual branch")

    w = b / residual_r
    complement_energy_q = _dot(w, B_q, w)
    c_R = q + complement_energy_q
    discriminant = mp.sqrt(complement_energy_q**2 + 4 * residual_r**2)
    u = (q + c_R - discriminant) / 2
    d = q - u
    if d <= 0:
        raise ReplayError("lower Ritz shift must satisfy u<q")
    identity = mp.eye(B_q.rows)
    B_U = _symmetrize(B_q + d * identity)
    B_values, _ = mp.eigsy(B_U)
    odd_gap_at_U = base_live["odd_values"][0] + d
    ritz_moment = _dot(w, B_U, w)
    ritz_moment_defect = residual_r**2 - d * ritz_moment
    ritz_matrix = mp.matrix([[q, residual_r], [residual_r, c_R]])
    ritz_characteristic_residual = mp.det(ritz_matrix - u * mp.eye(2))

    rho_raw = (mp.sqrt(d**2 + 4 * residual_r**2) - d) / 2
    rho = 2 * residual_r**2 / (
        mp.sqrt(d**2 + 4 * residual_r**2) + d
    )
    constants = _ritz_constants(d, residual_r)
    C_R_squared = constants["C_R_squared"]
    A_R = constants["A_R"]
    A_cert = constants["A_cert"]
    if not all(isinstance(value, mp.mpf) for value in (C_R_squared, A_R, A_cert)):
        raise ReplayError("finite Ritz constants required")

    complete_even = mp.matrix(B_q.rows + 1)
    complete_even[0, 0] = q
    for index in range(B_q.rows):
        complete_even[0, index + 1] = b[index]
        complete_even[index + 1, 0] = b[index]
    complete_even[1:, 1:] = B_q + q * identity
    even_values, even_vectors = mp.eigsy(_symmetrize(complete_even))
    mu = even_values[0]
    h = u - mu
    shifted_ground_block = B_U + h * identity
    z = mp.lu_solve(shifted_ground_block, b)
    z_norm_squared = (z.T * z)[0]
    coefficient_line = mp.matrix(B_q.rows + 1, 1)
    coefficient_line[0] = 1
    coefficient_line[1:, 0] = -z
    ground_line_residual = complete_even * coefficient_line - mu * coefficient_line
    eigen_ground = even_vectors[:, 0]
    if abs(eigen_ground[0]) == 0:
        raise ReplayError("diagnostic even ground is orthogonal to the anchor")
    z_from_eigenvector = -eigen_ground[1:, 0] / eigen_ground[0]
    feshbach_vector_residual = shifted_ground_block * z - b
    feshbach_scalar_residual = d + h - (b.T * z)[0]

    D = B_U + residual_r * identity
    D_inverse = _inverse(D)
    A_actual_formula = (
        d + h + (residual_r - h) * z_norm_squared
    ) / residual_r
    A_actual_quadratic = _dot(z, D, z) / residual_r
    theorem_loewner = _symmetrize(
        A_R * residual_r * D_inverse - z * z.T
    )
    actual_loewner = _symmetrize(
        A_actual_formula * residual_r * D_inverse - z * z.T
    )
    theorem_loewner_values, _ = mp.eigsy(theorem_loewner)
    actual_loewner_values, _ = mp.eigsy(actual_loewner)
    loewner_defect = max(mp.mpf(0), -theorem_loewner_values[0])

    time_band, time_band_live = _observation_response(
        "K_T_fixed_time_band",
        K_T,
        B_U,
        residual_r,
        z,
        A_R,
        A_cert,
    )
    identity_observation, identity_live = _observation_response(
        "identity_full_L2",
        identity,
        B_U,
        residual_r,
        z,
        A_R,
        A_cert,
    )
    fopt, fopt_live = _fopt_inventory(B_U, d, rho, K_T, z)

    source_guard = {
        "base_schema": base_sections.get("schema", base.SCHEMA),
        "base_checkpoint_version": base.CHECKPOINT_VERSION,
        "base_terminal_state": base.TERMINAL_STATE,
        "prime_power_inventory": [
            item["n"] for item in base_sections["source_inventory"]["prime_powers"]
        ],
        "expected_prime_power_inventory": [2, 3, 4],
        "prime_endpoint_lambda_squared_included": True,
        "source_hermitian_defect": base_live["source_hermitian_defect"],
        "source_inversion_commutator_defect": base_live["source_inversion_defect"],
        "B_U_minimum_eigenvalue": B_values[0],
        "odd_gap_at_U": odd_gap_at_U,
        "K_T_minimum_eigenvalue": base_live["K_values"][0],
        "K_T_maximum_eigenvalue": base_live["K_values"][-1],
        "cached_matrix_read": False,
        "cached_eigensystem_read": False,
        "zeta_zero_table_read": False,
        "global_weil_positivity_assumed": False,
        "binary64_parameter_used": False,
    }
    normalization_regression = {
        "a4": mp.mpf(normalization["a4"]),
        "a0_lambda": mp.mpf(normalization["a0_lambda"]),
        "projected_state_norm": mp.mpf(normalization["projected_state_norm"]),
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
    ritz_geometry = {
        "q": q,
        "residual_r": residual_r,
        "residual_direction_w": w,
        "residual_direction_norm_defect": abs(_norm(w) - 1),
        "residual_direction_complement_energy_at_q": complement_energy_q,
        "c_R": c_R,
        "two_vector_matrix": ritz_matrix,
        "two_vector_ritz_u": u,
        "d_q_minus_u": d,
        "ritz_characteristic_residual": ritz_characteristic_residual,
        "B_U": B_U,
        "B_U_eigenvalues": B_values,
        "ritz_moment_w_B_U_w": ritz_moment,
        "r_squared": residual_r**2,
        "d_times_ritz_moment": d * ritz_moment,
        "ritz_moment_defect_r_squared_minus_d_m": ritz_moment_defect,
        "odd_gap_at_U": odd_gap_at_U,
        "rho_raw_quadratic_formula": rho_raw,
        "rho_stable_rationalized_formula": rho,
        "rho_formula_residual": rho_raw - rho,
        "rho_quadratic_identity_residual": rho * (d + rho) - residual_r**2,
        **constants,
        "A_cert_minus_A_R": A_cert - A_R,
    }
    ground_diagnostic = {
        "diagnostic_only": True,
        "used_to_construct_Ritz_constants": False,
        "complete_even_matrix_in_anchor_complement_basis": complete_even,
        "complete_even_eigenvalues": even_values,
        "true_even_ground_mu": mu,
        "even_ground_simplicity_gap": even_values[1] - even_values[0],
        "u_minus_mu_h": h,
        "rho_minus_h": rho - h,
        "r_minus_h": residual_r - h,
        "coefficient_normalized_ground_correction_z": z,
        "z_from_fresh_ground_eigenvector": z_from_eigenvector,
        "z_eigenvector_reconstruction_defect": _norm(z - z_from_eigenvector),
        "z_norm_squared": z_norm_squared,
        "C_R_squared_norm_upper_bound": C_R_squared,
        "C_R_squared_minus_z_norm_squared": C_R_squared - z_norm_squared,
        "feshbach_vector_residual_norm": _norm(feshbach_vector_residual),
        "feshbach_scalar_residual": feshbach_scalar_residual,
        "coefficient_ground_line_residual_norm": _norm(ground_line_residual),
        "odd_minimum_reconstructed_from_q_gap": q + base_live["odd_values"][0],
        "odd_minimum_minus_true_even_ground": q
        + base_live["odd_values"][0]
        - mu,
    }
    transfer = {
        "ridge_r": residual_r,
        "minimal_ridge_coefficient_A_actual_formula": A_actual_formula,
        "minimal_ridge_coefficient_A_actual_quadratic": A_actual_quadratic,
        "A_actual_formula_residual": A_actual_formula - A_actual_quadratic,
        "A_R": A_R,
        "A_cert": A_cert,
        "A_R_minus_A_actual": A_R - A_actual_formula,
        "A_cert_minus_A_actual": A_cert - A_actual_formula,
        "theorem_Loewner_matrix_A_R_r_Dinv_minus_zzT": theorem_loewner,
        "theorem_Loewner_eigenvalues": theorem_loewner_values,
        "theorem_Loewner_minimum_eigenvalue": theorem_loewner_values[0],
        "Loewner_defect_negative_part": loewner_defect,
        "minimal_coefficient_Loewner_eigenvalues": actual_loewner_values,
        "minimal_coefficient_Loewner_minimum_eigenvalue": actual_loewner_values[0],
        "minimal_coefficient_Loewner_minimum_absolute_value": min(
            abs(actual_loewner_values[index])
            for index in range(actual_loewner_values.rows)
        ),
    }
    observations = {
        "theta": THETA,
        "homotopy_increment_theta_r": THETA * residual_r,
        "time_band": time_band,
        "identity": identity_observation,
    }
    raw_sections = {
        "source_guard": source_guard,
        "normalization_regression": normalization_regression,
        "ritz_moment_geometry": ritz_geometry,
        "true_ground_diagnostic": ground_diagnostic,
        "residual_ridge_transfer": transfer,
        "positive_observations": observations,
        "Fopt_rho": fopt,
    }
    sections = {
        name: _encode(value, dps) for name, value in raw_sections.items()
    }
    live = {
        "base_prerequisite_gates": base_gates,
        "source_guard": source_guard,
        "normalization": normalization_regression,
        "d": d,
        "r": residual_r,
        "u": u,
        "q": q,
        "B_min": B_values[0],
        "odd_gap": odd_gap_at_U,
        "ritz_moment_defect": ritz_moment_defect,
        "ritz_characteristic_residual": ritz_characteristic_residual,
        "w_norm_defect": abs(_norm(w) - 1),
        "rho_formula_residual": rho_raw - rho,
        "rho_quadratic_residual": rho * (d + rho) - residual_r**2,
        "rho": rho,
        "h": h,
        "r_minus_h": residual_r - h,
        "ground_gap": even_values[1] - even_values[0],
        "ground_vector_residual": _norm(ground_line_residual),
        "ground_eigenvector_defect": _norm(z - z_from_eigenvector),
        "feshbach_vector_residual": _norm(feshbach_vector_residual),
        "feshbach_scalar_residual": feshbach_scalar_residual,
        "C_norm_slack": C_R_squared - z_norm_squared,
        "A_cert_slack": A_cert - A_R,
        "A_actual_residual": A_actual_formula - A_actual_quadratic,
        "A_R_slack": A_R - A_actual_formula,
        "loewner_min": theorem_loewner_values[0],
        "loewner_defect": loewner_defect,
        "minimal_loewner_min": actual_loewner_values[0],
        "minimal_loewner_zero": min(
            abs(actual_loewner_values[index])
            for index in range(actual_loewner_values.rows)
        ),
        "time_band": time_band_live,
        "identity": identity_live,
        "fopt": fopt_live,
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
        "source_normalization_replacement_rejected": live["normalization"][
            "unit_normalized_replacement_allowed"
        ]
        is False,
        "normalization_changes_limiting_scalar": live["normalization"][
            "unit_normalization_limiting_scalar_difference"
        ]
        != 0,
        "positive_Ritz_geometry": live["u"] < live["q"]
        and live["d"] > 0
        and live["r"] > 0,
        "positive_Ritz_shifted_even_complement": live["B_min"] > 0,
        "positive_Ritz_shifted_odd_gap": live["odd_gap"] > 0,
        "Ritz_moment_identity": abs(live["ritz_moment_defect"])
        <= construction_tolerance,
        "Ritz_characteristic_identity": abs(live["ritz_characteristic_residual"])
        <= construction_tolerance,
        "residual_direction_normalized": live["w_norm_defect"]
        <= construction_tolerance,
        "rho_formulas_agree": abs(live["rho_formula_residual"])
        <= construction_tolerance,
        "rho_quadratic_identity": abs(live["rho_quadratic_residual"])
        <= construction_tolerance,
        "automatic_ridge_dominates_ground_displacement": live["h"]
        >= -tolerance
        and live["rho"] - live["h"] >= -tolerance
        and live["r_minus_h"] >= -tolerance,
        "diagnostic_ground_simple": live["ground_gap"] > 0,
        "diagnostic_ground_line_identity": live["ground_vector_residual"]
        <= construction_tolerance,
        "diagnostic_ground_eigenvector_reconstruction": live[
            "ground_eigenvector_defect"
        ]
        <= construction_tolerance,
        "Feshbach_vector_identity": live["feshbach_vector_residual"]
        <= construction_tolerance,
        "Feshbach_scalar_identity": abs(live["feshbach_scalar_residual"])
        <= construction_tolerance,
        "sharp_norm_bound": live["C_norm_slack"] >= -tolerance,
        "branch_free_coefficient_dominates_piecewise": live["A_cert_slack"]
        >= -tolerance,
        "minimal_coefficient_identity": abs(live["A_actual_residual"])
        <= construction_tolerance,
        "piecewise_coefficient_dominates_actual": live["A_R_slack"]
        >= -tolerance,
        "Ritz_Loewner_transfer": live["loewner_min"] >= -tolerance
        and live["loewner_defect"] <= tolerance,
        "minimal_Loewner_coefficient_positive_semidefinite": live[
            "minimal_loewner_min"
        ]
        >= -tolerance,
        "minimal_Loewner_coefficient_sharp": live["minimal_loewner_zero"]
        <= tolerance,
    }
    for label in ("time_band", "identity"):
        observation = live[label]
        prefix = "time_band" if label == "time_band" else "identity"
        gates.update(
            {
                f"{prefix}_positive_contraction": observation["K_min"]
                >= -tolerance
                and observation["K_max"] <= 1 + tolerance,
                f"{prefix}_normalized_response_contraction": observation[
                    "X_min"
                ]
                >= -tolerance
                and observation["X_max"] <= 1 + tolerance,
                f"{prefix}_nonnegative_response": observation["H"]
                >= -tolerance
                and observation["F"] >= -tolerance,
                f"{prefix}_increment_bounds": observation["lower_slack"]
                >= -tolerance
                and observation["upper_slack"] >= -tolerance,
                f"{prefix}_trace_transfer": observation["trace_transfer_slack"]
                >= -tolerance,
                f"{prefix}_determinant_transfer": observation[
                    "determinant_transfer_slack"
                ]
                >= -tolerance,
            }
        )
    fopt = live["fopt"]
    gates.update(
        {
            "Fopt_branch_separated_from_boundary": fopt["distance_to_boundary"]
            > construction_tolerance,
            "Fopt_piecewise_identity": fopt["piecewise_residual"]
            <= construction_tolerance,
            "Fopt_Loewner_transfer": fopt["fopt_loewner_min"] >= -tolerance,
            "Fopt_clean_bound": fopt["clean_loewner_min"] >= -tolerance,
            "Fopt_time_band_response": fopt["K_slack"] >= -tolerance,
            "Fopt_identity_response": fopt["I_slack"] >= -tolerance,
        }
    )

    max_defect = max(defects.values(), default=mp.mpf(0))
    agrees = max_defect <= tolerance and all(gates.values())
    result = {
        "schema": REPLAY_SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "claim_class": "FINITE_POINT_DIAGNOSTIC_REPLAY",
        "analytic_uniform_claim": False,
        "equation_5_2_claim": False,
        "producer_sha256": producer_sha256,
        "replay_agrees": agrees,
        "tolerance": mp.nstr(tolerance, dps),
        "max_scaled_defect": mp.nstr(max_defect, dps),
        "scaled_defects": {
            name: mp.nstr(value, dps) for name, value in sorted(defects.items())
        },
        "independent_gates": gates,
        "independent_paths": {
            "source_matrix": "verifier/independent_replay distributional source formulas; no producer matrix read",
            "prolate_state": "differential-form quadrature Galerkin path; no producer state read",
            "time_band": "closed Si/Ci antiderivatives; no producer K_T read",
            "Ritz_geometry": "fresh q, residual, complement moment, and two-vector characteristic root",
            "ground_diagnostic": "fresh complete-even eigensystem reconstructed only after the Ritz constants",
            "log_determinants": "fresh positive eigenvalues and summed logarithms; no producer determinant read",
            "Loewner_transfer": "fresh solves and eigenvalues for theorem, minimal, Fopt, and clean envelopes",
            "normalization": "source-normalized prolate reconstruction plus independently evaluated limiting-scalar regression",
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
