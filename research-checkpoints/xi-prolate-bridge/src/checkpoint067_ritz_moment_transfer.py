#!/usr/bin/env python3
"""Checkpoint 0.67 Ritz-moment self-regularized transfer producer.

The producer is locked to ``lambda=2, N=4, T=1`` at 40 or 80 decimal
digits.  It rebuilds checkpoint 0.64 through its live producer, reconstructs
the lower two-vector Ritz shift, and evaluates the finite transfer theorem in
``notes/RITZ_MOMENT_SELF_REGULARIZED_TRANSFER.md``.

The exact finite ground of the reconstructed even matrix is evaluated only as
a diagnostic regression.  It is not cached, imported, or used to manufacture
the Ritz multiplier.  Every matrix entering an inverse or determinant is the
already-combined source pole--archimedean--minus-prime matrix.

All outputs are arbitrary-precision point values.  They are not interval or
ball enclosures, do not establish an unbounded response rate, and do not prove
equation (5.2) of ``DIRECT_RH_ATTACK.md``.
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
SCHEMA = "xi-prolate-checkpoint067-ritz-moment-transfer-v1"
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


class Checkpoint067Error(ValueError):
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
            raise Checkpoint067Error(f"pinned source hash mismatch: {name}")


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


def _symmetrize(A: mp.matrix) -> mp.matrix:
    return (A + A.T) / 2


def _inverse(A: mp.matrix) -> mp.matrix:
    if A.rows != A.cols:
        raise Checkpoint067Error("matrix inverse requires a square matrix")
    result = mp.matrix(A.rows)
    for j in range(A.rows):
        unit = mp.matrix(A.rows, 1)
        unit[j] = 1
        result[:, j] = mp.lu_solve(A, unit)
    return result


def _positive_logdet(A: mp.matrix) -> mp.mpf:
    determinant = mp.det(A)
    if not determinant > 0:
        raise Checkpoint067Error("positive determinant required")
    return mp.log(determinant)


def _symmetric_inverse_sqrt(A: mp.matrix) -> mp.matrix:
    values, vectors = mp.eigsy(_symmetrize(A))
    if values[0] <= 0:
        raise Checkpoint067Error("positive inverse square root requires A>0")
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


def _ritz_constants(d: mp.mpf, residual_r: mp.mpf) -> dict[str, mp.mpf | str]:
    if d < 0 or residual_r <= 0:
        raise Checkpoint067Error("Ritz constants require d>=0 and r>0")
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
    half = mp.mpf(1) / 2
    if alpha <= half:
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
    A_cert = (1 + delta) * (1 + 2 * delta)
    return {
        "delta_d_over_r": delta,
        "alpha_r_squared_over_d_squared": alpha,
        "C_R_squared": C_R_squared,
        "C_R_branch": C_branch,
        "A_R": A_R,
        "A_R_branch": A_branch,
        "A_cert": A_cert,
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
    F = _positive_logdet(D_plus) - _positive_logdet(D)
    inverse_sqrt = _symmetric_inverse_sqrt(D)
    X = residual_r * inverse_sqrt * K * inverse_sqrt
    X = _symmetrize(X)
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
    for j in range(values.rows):
        eigenvalue = values[j]
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
                "index": j,
                "B_U_eigenvalue": eigenvalue,
                "branch": branch,
                "strictly_below_d": is_low,
                "distance_from_d": eigenvalue - d,
                "K_T_leverage": K_in_basis[j, j],
                "main_ridged_weight": main,
                "low_band_correction_weight": correction,
                "Fopt_weight": total,
                "piecewise_expected_weight": expected,
                "piecewise_identity_residual": total - expected,
                "K_T_Fopt_trace_contribution": K_in_basis[j, j] * total,
            }
        )

    main_matrix = vectors * mp.diag(main_weights) * vectors.T
    correction_matrix = vectors * mp.diag(correction_weights) * vectors.T
    Fopt = _symmetrize(main_matrix + correction_matrix)
    Fopt_values, _ = mp.eigsy(Fopt)
    clean = d * _inverse(B_U) + rho * _inverse(B_U + rho * mp.eye(B_U.rows))
    clean = _symmetrize(clean)
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
        "Fopt_identity_trace_minus_actual": fopt_identity_trace - actual_norm_squared,
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


def _compute_sections(
    base_payload: dict[str, Any], dps: int
) -> tuple[dict[str, Any], dict[str, Any]]:
    source = base_payload["source_geometry"]
    normalization = base_payload["normalization"]
    B_q = _matrix(source["B_even_complement_at_q"])
    K_T = _matrix(source["K_T_even_complement"])
    b = _vector(source["residual_vector_even_complement"])
    q = mp.mpf(source["q"])
    residual_r = mp.mpf(source["residual_r"])
    if residual_r <= 0:
        raise Checkpoint067Error("checkpoint 0.67 requires the positive-residual branch")

    w = b / residual_r
    complement_energy_q = _dot(w, B_q, w)
    c_R = q + complement_energy_q
    discriminant = mp.sqrt((c_R - q) ** 2 + 4 * residual_r**2)
    u = (q + c_R - discriminant) / 2
    d = q - u
    if d <= 0:
        raise Checkpoint067Error("lower Ritz shift must satisfy u<q")
    identity = mp.eye(B_q.rows)
    B_U = _symmetrize(B_q + d * identity)
    B_values, _ = mp.eigsy(B_U)
    odd_gap_at_U = mp.mpf(source["odd_gap_at_q"]) + d
    ritz_moment = _dot(w, B_U, w)
    ritz_moment_defect = residual_r**2 - d * ritz_moment
    ritz_matrix = mp.matrix([[q, residual_r], [residual_r, c_R]])
    ritz_characteristic_residual = mp.det(ritz_matrix - u * mp.eye(2))

    rho_raw = (mp.sqrt(d**2 + 4 * residual_r**2) - d) / 2
    rho_stable = 2 * residual_r**2 / (
        mp.sqrt(d**2 + 4 * residual_r**2) + d
    )
    rho = rho_stable
    constants = _ritz_constants(d, residual_r)
    C_R_squared = constants["C_R_squared"]
    A_R = constants["A_R"]
    A_cert = constants["A_cert"]
    if not isinstance(C_R_squared, mp.mpf):
        raise Checkpoint067Error("finite C_R value required")
    if not isinstance(A_R, mp.mpf) or not isinstance(A_cert, mp.mpf):
        raise Checkpoint067Error("finite A_R values required")

    complete_even = mp.matrix(B_q.rows + 1)
    complete_even[0, 0] = q
    for j in range(B_q.rows):
        complete_even[0, j + 1] = b[j]
        complete_even[j + 1, 0] = b[j]
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
        raise Checkpoint067Error("diagnostic even ground is orthogonal to the anchor")
    z_from_eigenvector = -eigen_ground[1:, 0] / eigen_ground[0]
    feshbach_vector_residual = shifted_ground_block * z - b
    feshbach_scalar_residual = d + h - (b.T * z)[0]

    D = B_U + residual_r * identity
    D_inverse = _inverse(D)
    A_actual_formula = (
        d + h + (residual_r - h) * z_norm_squared
    ) / residual_r
    A_actual_quadratic = _dot(z, B_U + residual_r * identity, z) / residual_r
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
        "base_schema": base_payload["schema"],
        "base_checkpoint_version": base_payload["checkpoint_version"],
        "base_terminal_state": base_payload["terminal_state"],
        "prime_power_inventory": [
            item["n"] for item in base_payload["source_inventory"]["prime_powers"]
        ],
        "expected_prime_power_inventory": [2, 3, 4],
        "prime_endpoint_lambda_squared_included": True,
        "source_hermitian_defect": mp.mpf(source["hermitian_defect"]),
        "source_inversion_commutator_defect": mp.mpf(
            source["inversion_commutator_defect"]
        ),
        "B_U_minimum_eigenvalue": B_values[0],
        "odd_gap_at_U": odd_gap_at_U,
        "K_T_minimum_eigenvalue": mp.mpf(source["K_T_eigenvalue_min"]),
        "K_T_maximum_eigenvalue": mp.mpf(source["K_T_eigenvalue_max"]),
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
        "rho_stable_rationalized_formula": rho_stable,
        "rho_formula_residual": rho_raw - rho_stable,
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
        "odd_minimum_reconstructed_from_q_gap": q + mp.mpf(source["odd_gap_at_q"]),
        "odd_minimum_minus_true_even_ground": (
            q + mp.mpf(source["odd_gap_at_q"]) - mu
        ),
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
            abs(actual_loewner_values[j]) for j in range(actual_loewner_values.rows)
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
    sections = {name: _encode(value, dps) for name, value in raw_sections.items()}
    live = {
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
        "rho_formula_residual": rho_raw - rho_stable,
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
            abs(actual_loewner_values[j]) for j in range(actual_loewner_values.rows)
        ),
        "time_band": time_band_live,
        "identity": identity_live,
        "fopt": fopt_live,
    }
    return sections, live


def _validate_live(live: dict[str, Any], dps: int) -> None:
    tolerance = mp.power(10, -max(12, dps // 3))
    construction_tolerance = mp.power(10, -max(18, dps // 2))
    source = live["source_guard"]
    if source["base_terminal_state"] != TERMINAL_STATE:
        raise Checkpoint067Error("unexpected base terminal state")
    if source["prime_power_inventory"] != [2, 3, 4]:
        raise Checkpoint067Error("prime-power inventory or inclusive endpoint changed")
    if source["source_hermitian_defect"] > construction_tolerance:
        raise Checkpoint067Error("source Hermitian symmetry failed")
    if source["source_inversion_commutator_defect"] > construction_tolerance:
        raise Checkpoint067Error("source inversion commutation failed")
    if not source["prime_endpoint_lambda_squared_included"]:
        raise Checkpoint067Error("prime endpoint lambda^2 was omitted")
    if source["binary64_parameter_used"]:
        raise Checkpoint067Error("binary64 parameter path is forbidden")
    if source["cached_matrix_read"] or source["cached_eigensystem_read"]:
        raise Checkpoint067Error("cached matrix or eigensystem is forbidden")
    if source["zeta_zero_table_read"] or source["global_weil_positivity_assumed"]:
        raise Checkpoint067Error("forbidden zero or positivity premise")
    if live["normalization"]["unit_normalized_replacement_allowed"]:
        raise Checkpoint067Error("unit-normalized replacement was not rejected")
    if live["normalization"]["unit_normalization_limiting_scalar_difference"] == 0:
        raise Checkpoint067Error("normalization regression failed to change the limit")

    if not (live["u"] < live["q"] and live["d"] > 0 and live["r"] > 0):
        raise Checkpoint067Error("invalid lower two-vector Ritz geometry")
    if live["B_min"] <= 0 or live["odd_gap"] <= 0:
        raise Checkpoint067Error("nonpositive Ritz-shifted sector gate")
    for field in (
        "ritz_moment_defect",
        "ritz_characteristic_residual",
        "w_norm_defect",
        "rho_formula_residual",
        "rho_quadratic_residual",
        "ground_vector_residual",
        "ground_eigenvector_defect",
        "feshbach_vector_residual",
        "feshbach_scalar_residual",
        "A_actual_residual",
    ):
        if abs(live[field]) > construction_tolerance:
            raise Checkpoint067Error(f"finite construction identity failed: {field}")
    if live["ground_gap"] <= 0:
        raise Checkpoint067Error("diagnostic even ground is not simple")
    if live["h"] < -tolerance or live["rho"] - live["h"] < -tolerance:
        raise Checkpoint067Error("automatic displacement ridge failed")
    if live["r_minus_h"] < -tolerance:
        raise Checkpoint067Error("residual ridge does not dominate h")
    for field in ("C_norm_slack", "A_cert_slack", "A_R_slack"):
        if live[field] < -tolerance:
            raise Checkpoint067Error(f"Ritz transfer bound failed: {field}")
    if live["loewner_min"] < -tolerance or live["loewner_defect"] > tolerance:
        raise Checkpoint067Error("Ritz Loewner transfer failed")
    if live["minimal_loewner_min"] < -tolerance:
        raise Checkpoint067Error("diagnostic minimal Loewner coefficient is not positive semidefinite")
    if live["minimal_loewner_zero"] > tolerance:
        raise Checkpoint067Error("diagnostic minimal Loewner coefficient is not sharp")

    for label in ("time_band", "identity"):
        observation = live[label]
        if observation["K_min"] < -tolerance or observation["K_max"] > 1 + tolerance:
            raise Checkpoint067Error(f"observation is not a positive contraction: {label}")
        if observation["X_min"] < -tolerance or observation["X_max"] > 1 + tolerance:
            raise Checkpoint067Error(f"normalized response is not a contraction: {label}")
        if observation["H"] < -tolerance or observation["F"] < -tolerance:
            raise Checkpoint067Error(f"negative positive-response quantity: {label}")
        for field in (
            "lower_slack",
            "upper_slack",
            "trace_transfer_slack",
            "determinant_transfer_slack",
        ):
            if observation[field] < -tolerance:
                raise Checkpoint067Error(f"observation response bound failed: {label}/{field}")

    fopt = live["fopt"]
    if fopt["distance_to_boundary"] <= construction_tolerance:
        raise Checkpoint067Error("Fopt low-band branch is unresolved at working precision")
    if fopt["piecewise_residual"] > construction_tolerance:
        raise Checkpoint067Error("Fopt piecewise spectral identity failed")
    for field in ("fopt_loewner_min", "clean_loewner_min", "K_slack", "I_slack"):
        if fopt[field] < -tolerance:
            raise Checkpoint067Error(f"Fopt bound failed: {field}")


def produce(lambda_text: str, N: int, T_text: str, dps: int) -> dict[str, Any]:
    if not isinstance(lambda_text, str) or not isinstance(T_text, str):
        raise TypeError("lambda and T must be exact text; binary64 is forbidden")
    if isinstance(N, bool) or not isinstance(N, int):
        raise TypeError("N must be an exact integer")
    if isinstance(dps, bool) or not isinstance(dps, int):
        raise TypeError("precision must be an exact integer")
    try:
        lambda_fraction = Fraction(lambda_text)
        T_fraction = Fraction(T_text)
    except (ValueError, ZeroDivisionError) as exc:
        raise Checkpoint067Error("lambda and T must be exact rational text") from exc
    if lambda_fraction != 2 or N != 4 or T_fraction != 1:
        raise Checkpoint067Error("checkpoint 0.67 is locked to lambda=2, N=4, T=1")
    if dps not in (40, 80):
        raise Checkpoint067Error("checkpoint 0.67 permits only 40 or 80 decimal digits")

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
        "equation_5_2_claim": False,
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
