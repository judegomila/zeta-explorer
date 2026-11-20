#!/usr/bin/env python3
"""Checkpoint 0.68 Ritz projective low-mode producer.

This producer is locked to ``lambda=2, N=4, M=2, theta=1`` at 40 or 80
decimal digits.  It rebuilds checkpoint 0.64 through its live source and
prolate assembly, constructs the mandatory lower two-vector Ritz shift, and
checks the finite projective low-mode determinant gate.

The low-mode homotopy is the *full ambient* centered Fourier cutoff.  Its
even compression supplies the observation on the anchor complement, while
its odd compression and all anchor cross terms are retained in the source
Cauchy determinant factorization.  No cached matrix, eigensystem, artifact,
or zero table is read.

All reported values are arbitrary-precision point values.  They are not
interval or ball enclosures and do not prove an unbounded response rate,
locally uniform determinant convergence, equation (5.2), or RH.
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
SCHEMA = "xi-prolate-checkpoint068-ritz-projective-low-mode-v1"
CHECKPOINT_VERSION = "0.68.0-ritz-projective-low-mode-point"
TERMINAL_STATE = "P0_INVALIDATED"
LOCKED_M = 2
LOCKED_THETA_TEXT = "1"
BASE_T_TEXT = "1"
COMPACT_REAL_BOUND = mp.mpf(1)
COMPACT_ETA = mp.mpf(1) / 4

DEPENDENCIES = (
    "P0_SOURCE_LOCK.json",
    "P0_NORMALIZATION_AUDIT.md",
    "DIRECT_RH_ATTACK.md",
    "FALSE_SHORTCUTS.md",
    "vendor/CCM-ZST-2511.22755v1.pdf",
    "vendor/CCM-PROLATE-2310.18423v2.pdf",
    "notes/RITZ_PROJECTIVE_LOW_MODE_DETERMINANT_GATE.md",
    "notes/RITZ_MOMENT_SELF_REGULARIZED_TRANSFER.md",
    "notes/PROJECTIVE_LOW_MODE_DETERMINANT_BRIDGE.md",
    "notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md",
    "notes/DETERMINANT_LIMIT_AUDIT.md",
    "src/checkpoint064_reciprocal_secant.py",
    "src/checkpoint068_ritz_projective_low_mode.py",
    "src/prolate_state.py",
    "src/weil_matrix.py",
    "verifier/checkpoint064_reciprocal_secant_replay.py",
    "verifier/checkpoint068_ritz_projective_low_mode_replay.py",
    "verifier/independent_replay.py",
    "verifier/residual_ridged_fixed_window_replay.py",
    "tests/test_checkpoint064_reciprocal_secant.py",
    "tests/test_checkpoint068_ritz_projective_low_mode.py",
    "tests/test_ritz_projective_low_mode_determinant_gate.py",
)

PINNED_SOURCE_SHA256 = dict(base.PINNED_SOURCE_SHA256)

LOCKED_CONVENTIONS = dict(base.LOCKED_CONVENTIONS)
LOCKED_CONVENTIONS.update(
    {
        "checkpoint068_source_point": "lambda=2, N=4, M=2, theta=1 only; 40 or 80 decimal digits",
        "low_mode_cutoff": "full ambient centered projector onto every raw mode |n|<=M, with both parity sectors retained",
        "compact_diagnostic": "B=1 and eta=1/4; finite compact-error terms only",
        "projective_ground_scale": "s=1/gamma is paired with the source projected norm a; no unit normalization of h_lambda",
    }
)

LOCKED_FORMULAS = {
    "ambient_cutoff": "Pi_M V_n=1_(|n|<=M)V_n on the full raw mode space; K_M=W^T Pi_(M,+) W",
    "ritz_shift": "w=b/r; c_R=q+<w,B_q w>; u=(q+c_R-sqrt((c_R-q)^2+4r^2))/2; U=u; d=q-U",
    "ritz_moment": "B_U=B_q+dI; d<w,B_U w>=r^2 at the exact lower Ritz shift",
    "ground_line": "mu=lambda_min(Q_+); h=U-mu; z=(B_U+hI)^(-1)b; xi=gamma*(kappa-Wz); gamma=(1+||z||^2)^(-1/2)",
    "projective_scalar": "s=1/gamma, so s*xi-kappa=-Wz exactly",
    "A_R": "delta=d/r; A_R=1+delta+delta*(1+delta)^2/2 for delta<=1, else 1+delta+2delta^2",
    "C_R_squared": "alpha=(r/d)^2; C_R^2 is equation (3.2) of RITZ_MOMENT_SELF_REGULARIZED_TRANSFER.md",
    "low_observation": "||Pi_M(s*xi-kappa)||^2=<z,K_M z>",
    "positive_response": "H=r*tr((B_U+rI)^(-1)K_M); F=log det(B_U+rI+theta*r*K_M)-log det(B_U+rI)",
    "response_bounds": "F/theta<=H<=F/log(1+theta); <z,K_M z><=A_R*H<=A_R*F/log(1+theta)",
    "source_homotopy": "Q_t=Q+t*Pi_M at zeta=U-r; t in {0,theta*r}; full even, odd, anchor, and cross terms retained",
    "source_factorization": "det(O_t)=det(A_t)*m_t=det(D_t)*sigma_t*m_t",
    "factorized_increment": "F=log(det O_(theta*r)/det O_0)-log((sigma_(theta*r)m_(theta*r))/(sigma_0 m_0))",
    "compact_split": "the three finite terms are exactly equation (3.8) of PROJECTIVE_LOW_MODE_DETERMINANT_BRIDGE.md",
}

PROVENANCE = {
    "cached_matrix_read": False,
    "cached_eigensystem_read": False,
    "cached_artifact_read": False,
    "zeta_zero_table_read": False,
    "global_weil_positivity_assumed": False,
    "binary64_parameter_used": False,
    "asymptotic_claim_made": False,
    "locally_uniform_claim_made": False,
    "equation_5_2_claim_made": False,
    "rh_proof_claim_made": False,
    "producer_source_path": "checkpoint-0.64 live distributional pole--archimedean--minus-prime assembly",
    "producer_prolate_path": "checkpoint-0.64 live source-normalized Legendre recurrence",
    "producer_ritz_path": "fresh natural-parity and anchor-complement reconstruction from the complete source matrix",
    "producer_cutoff_path": "fresh full ambient centered raw-mode projector; no compressed projector is trusted",
    "producer_factorization_path": "fresh even/odd source-Cauchy determinants with anchor cross terms at both homotopy endpoints",
    "shared_arithmetic_limitation": "producer and verifier share mpmath transcendental point arithmetic",
}

LIMITATIONS = [
    "finite arbitrary-precision point diagnostic, not an interval or ball enclosure",
    "producer and verifier share mpmath transcendental arithmetic and linear algebra",
    "the source-normalized prolate state remains a fixed 30-mode Galerkin truncation without a tail enclosure",
    "the finite true-ground eigensystem is freshly reconstructed only as a diagnostic",
    "the full ambient cutoff preserves the finite source Cauchy algebra, but no unbounded source response estimate is proved",
    "the compact bridge values are three finite terms at one point and are not an asymptotic convergence test",
    "no locally uniform determinant conclusion is inferred from finite real-axis or log-determinant agreement",
    "no conclusion about DIRECT_RH_ATTACK equation (5.2), a new Lambda bound, or RH is claimed",
]


class Checkpoint068Error(ValueError):
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
            raise Checkpoint068Error(f"pinned source hash mismatch: {name}")


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


def _max_abs(A: mp.matrix) -> mp.mpf:
    if A.rows == 0 or A.cols == 0:
        return mp.mpf(0)
    return max(abs(A[i, j]) for i in range(A.rows) for j in range(A.cols))


def _symmetrize(A: mp.matrix) -> mp.matrix:
    return (A + A.T) / 2


def _inverse(A: mp.matrix) -> mp.matrix:
    if A.rows != A.cols:
        raise Checkpoint068Error("matrix inverse requires a square matrix")
    result = mp.matrix(A.rows)
    for j in range(A.rows):
        unit = mp.matrix(A.rows, 1)
        unit[j] = 1
        result[:, j] = mp.lu_solve(A, unit)
    return result


def _positive_logdet(A: mp.matrix) -> mp.mpf:
    determinant = mp.det(A)
    if not determinant > 0:
        raise Checkpoint068Error("positive determinant required")
    return mp.log(determinant)


def _symmetric_inverse_sqrt(A: mp.matrix) -> mp.matrix:
    values, vectors = mp.eigsy(_symmetrize(A))
    if values[0] <= 0:
        raise Checkpoint068Error("positive inverse square root requires A>0")
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


def _ritz_constants(d: mp.mpf, residual_r: mp.mpf) -> dict[str, Any]:
    if not (d > 0 and residual_r > 0):
        raise Checkpoint068Error("locked Ritz constants require d>0 and r>0")
    delta = d / residual_r
    alpha = (residual_r / d) ** 2
    if alpha <= mp.mpf(1) / 2:
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
        "C_R": mp.sqrt(C_R_squared),
        "C_R_branch": C_branch,
        "A_R": A_R,
        "A_R_branch": A_branch,
        "A_cert": (1 + delta) * (1 + 2 * delta),
    }


def _factor_endpoint(
    label: str,
    t: mp.mpf,
    Q_even: mp.matrix,
    Q_odd: mp.matrix,
    Pi_even: mp.matrix,
    Pi_odd: mp.matrix,
    kappa_even: mp.matrix,
    W: mp.matrix,
    b: mp.matrix,
    B_U: mp.matrix,
    d: mp.mpf,
    residual_r: mp.mpf,
    zeta: mp.mpf,
    K_M: mp.matrix,
    eta_even: mp.matrix,
    e0_even: mp.matrix,
) -> tuple[dict[str, Any], dict[str, mp.mpf]]:
    even_identity = mp.eye(Q_even.rows)
    odd_identity = mp.eye(Q_odd.rows)
    complement_identity = mp.eye(B_U.rows)
    A_t = _symmetrize(Q_even - zeta * even_identity + t * Pi_even)
    O_t = _symmetrize(Q_odd - zeta * odd_identity + t * Pi_odd)
    D_t = _symmetrize(B_U + residual_r * complement_identity + t * K_M)
    b_t = b + t * W.T * Pi_even * kappa_even
    a_t = d + residual_r + t * _dot(kappa_even, Pi_even, kappa_even)
    D_inverse = _inverse(D_t)
    sigma_t = a_t - (b_t.T * D_inverse * b_t)[0]
    m_t = (eta_even.T * _inverse(A_t) * e0_even)[0]
    det_A = mp.det(A_t)
    det_O = mp.det(O_t)
    det_D = mp.det(D_t)
    if min(det_A, det_O, det_D, sigma_t, m_t) <= 0:
        raise Checkpoint068Error(f"nonpositive source factor at {label}")
    direct_a = _dot(kappa_even, A_t, kappa_even)
    direct_b = W.T * A_t * kappa_even
    anchor_reconstruction = mp.matrix(A_t.rows)
    anchor_reconstruction[0, 0] = a_t
    anchor_reconstruction[0, 1:] = b_t.T
    anchor_reconstruction[1:, 0] = b_t
    anchor_reconstruction[1:, 1:] = D_t
    basis_change = mp.matrix(A_t.rows)
    basis_change[:, 0] = kappa_even
    basis_change[:, 1:] = W
    direct_anchor_matrix = basis_change.T * A_t * basis_change
    det_anchor_residual = det_A - det_D * sigma_t
    det_source_residual = det_O - det_A * m_t
    combined_residual = det_O - det_D * sigma_t * m_t
    data = {
        "label": label,
        "t": t,
        "A_t_even": A_t,
        "O_t_odd": O_t,
        "D_t_complement": D_t,
        "b_t_cross": b_t,
        "a_t_anchor": a_t,
        "direct_anchor_scalar": direct_a,
        "direct_cross_vector": direct_b,
        "anchor_scalar_residual": direct_a - a_t,
        "cross_vector_residual_norm": _norm(direct_b - b_t),
        "anchor_complement_reconstruction": anchor_reconstruction,
        "direct_anchor_basis_matrix": direct_anchor_matrix,
        "anchor_matrix_reconstruction_defect": _max_abs(
            direct_anchor_matrix - anchor_reconstruction
        ),
        "sigma_t": sigma_t,
        "m_t": m_t,
        "det_A_t": det_A,
        "det_O_t": det_O,
        "det_D_t": det_D,
        "det_A_minus_det_D_sigma": det_anchor_residual,
        "det_O_minus_det_A_m": det_source_residual,
        "det_O_minus_det_D_sigma_m": combined_residual,
        "logdet_D_t": mp.log(det_D),
        "logdet_O_t": mp.log(det_O),
        "log_sigma_m": mp.log(sigma_t * m_t),
    }
    live = {
        "a_residual": direct_a - a_t,
        "b_residual": _norm(direct_b - b_t),
        "matrix_residual": _max_abs(direct_anchor_matrix - anchor_reconstruction),
        "det_anchor_residual": det_anchor_residual,
        "det_source_residual": det_source_residual,
        "combined_residual": combined_residual,
        "det_scale": max(mp.mpf(1), abs(det_A), abs(det_O), abs(det_D)),
        "positive_minimum": min(det_A, det_O, det_D, sigma_t, m_t),
        "logdet_D": mp.log(det_D),
        "logdet_O": mp.log(det_O),
        "log_sigma_m": mp.log(sigma_t * m_t),
    }
    return data, live


def _compute_sections(
    base_payload: dict[str, Any], M: int, theta: mp.mpf, dps: int
) -> tuple[dict[str, Any], dict[str, Any]]:
    source = base_payload["source_geometry"]
    normalization = base_payload["normalization"]
    N = int(base_payload["inputs"]["N"])
    L = mp.mpf(base_payload["inputs"]["L"])
    lam = mp.mpf(base_payload["inputs"]["lambda"])

    pole = _matrix(source["pole"])
    arch = _matrix(source["archimedean_unsigned"])
    prime = _matrix(source["prime_unsigned"])
    Q = _matrix(source["Q_equals_pole_minus_archimedean_minus_prime"])
    kappa = _vector(normalization["kappa_modes_minusN_to_N"])
    even, odd = base._sector_bases(N)
    J = base.inversion(N)
    mode = mp.diag(list(range(-N, N + 1)))
    Q_even = _symmetrize(even.T * Q * even)
    Q_odd = _symmetrize(odd.T * Q * odd)
    kappa_even = even.T * kappa
    W = base._orthogonal_complement(kappa_even)
    q = _dot(kappa_even, Q_even, kappa_even)
    b = W.T * (Q_even * kappa_even - q * kappa_even)
    residual_r = _norm(b)
    if not residual_r > 0:
        raise Checkpoint068Error("checkpoint 0.68 requires the positive-residual branch")
    w = b / residual_r
    B_q = _symmetrize(W.T * Q_even * W - q * mp.eye(N))
    complement_energy_q = _dot(w, B_q, w)
    c_R = q + complement_energy_q
    discriminant = mp.sqrt((c_R - q) ** 2 + 4 * residual_r**2)
    u = (q + c_R - discriminant) / 2
    d = q - u
    constants = _ritz_constants(d, residual_r)
    A_R = constants["A_R"]
    C_R_squared = constants["C_R_squared"]
    C_R = constants["C_R"]
    if not all(isinstance(value, mp.mpf) for value in (A_R, C_R_squared, C_R)):
        raise Checkpoint068Error("finite Ritz constants required")
    B_U = _symmetrize(B_q + d * mp.eye(N))
    B_values, _ = mp.eigsy(B_U)
    odd_shifted = _symmetrize(Q_odd - u * mp.eye(N))
    odd_values, _ = mp.eigsy(odd_shifted)
    ritz_moment = _dot(w, B_U, w)
    ritz_matrix = mp.matrix([[q, residual_r], [residual_r, c_R]])
    ritz_characteristic_residual = mp.det(ritz_matrix - u * mp.eye(2))
    ritz_moment_residual = residual_r**2 - d * ritz_moment

    even_values, even_vectors = mp.eigsy(Q_even)
    mu = even_values[0]
    h = u - mu
    z = mp.lu_solve(B_U + h * mp.eye(N), b)
    z_norm_squared = (z.T * z)[0]
    gamma = 1 / mp.sqrt(1 + z_norm_squared)
    projective_scalar_s = 1 / gamma
    coefficient_ground_even = kappa_even - W * z
    unit_ground_even = gamma * coefficient_ground_even
    fresh_ground = even_vectors[:, 0]
    if (fresh_ground.T * unit_ground_even)[0] < 0:
        fresh_ground = -fresh_ground
    ground_eigen_residual = Q_even * unit_ground_even - mu * unit_ground_even
    feshbach_residual = (B_U + h * mp.eye(N)) * z - b
    feshbach_scalar_residual = d + h - (b.T * z)[0]
    projective_identity_residual = (
        projective_scalar_s * unit_ground_even - kappa_even + W * z
    )

    Pi_raw = mp.diag(
        [mp.mpf(1) if abs(n) <= M else mp.mpf(0) for n in range(-N, N + 1)]
    )
    Pi_even = _symmetrize(even.T * Pi_raw * even)
    Pi_odd = _symmetrize(odd.T * Pi_raw * odd)
    K_M = _symmetrize(W.T * Pi_even * W)
    K_values, _ = mp.eigsy(K_M)
    D = _symmetrize(B_U + residual_r * mp.eye(N))
    D_plus = _symmetrize(D + theta * residual_r * K_M)
    D_inverse = _inverse(D)
    H = residual_r * _trace(D_inverse * K_M)
    F = _positive_logdet(D_plus) - _positive_logdet(D)
    inverse_sqrt = _symmetric_inverse_sqrt(D)
    X = _symmetrize(residual_r * inverse_sqrt * K_M * inverse_sqrt)
    X_values, _ = mp.eigsy(X)
    low_vector_even = Pi_even * W * z
    high_vector_even = (mp.eye(N + 1) - Pi_even) * W * z
    actual_low_squared = (low_vector_even.T * low_vector_even)[0]
    actual_zKz = _dot(z, K_M, z)
    actual_high_norm = _norm(high_vector_even)
    actual_low_norm = mp.sqrt(max(mp.mpf(0), actual_low_squared))
    actual_total_split_residual = (
        actual_low_squared + actual_high_norm**2 - z_norm_squared
    )
    response_lower = F / theta
    response_upper = F / mp.log1p(theta)
    A_R_H = A_R * H
    A_R_F_bound = A_R * response_upper
    loewner = _symmetrize(A_R * residual_r * D_inverse - z * z.T)
    loewner_values, _ = mp.eigsy(loewner)

    eta_raw = mp.matrix([mp.mpf(1) for _ in range(2 * N + 1)])
    eta_even = even.T * eta_raw
    e0_even = mp.matrix(N + 1, 1)
    e0_even[0] = 1
    zeta = u - residual_r
    endpoint_0, endpoint_0_live = _factor_endpoint(
        "t_zero",
        mp.mpf(0),
        Q_even,
        Q_odd,
        Pi_even,
        Pi_odd,
        kappa_even,
        W,
        b,
        B_U,
        d,
        residual_r,
        zeta,
        K_M,
        eta_even,
        e0_even,
    )
    endpoint_r, endpoint_r_live = _factor_endpoint(
        "t_theta_r",
        theta * residual_r,
        Q_even,
        Q_odd,
        Pi_even,
        Pi_odd,
        kappa_even,
        W,
        b,
        B_U,
        d,
        residual_r,
        zeta,
        K_M,
        eta_even,
        e0_even,
    )
    factorized_F = (
        endpoint_r_live["logdet_O"]
        - endpoint_0_live["logdet_O"]
        - endpoint_r_live["log_sigma_m"]
        + endpoint_0_live["log_sigma_m"]
    )
    factorization_residual = F - factorized_F
    mode_cutoff_commutator = mode * Pi_raw - Pi_raw * mode
    inversion_cutoff_commutator = J * Pi_raw - Pi_raw * J
    source_displacement_preservation = (
        mode * (Q + theta * residual_r * Pi_raw)
        - (Q + theta * residual_r * Pi_raw) * mode
        - (mode * Q - Q * mode)
    )

    projection_error = mp.mpf(normalization["projection_error"])
    projected_state_norm = mp.mpf(normalization["projected_state_norm"])
    lambda_to_eta = lam**COMPACT_ETA
    compact_radius = mp.sqrt(COMPACT_REAL_BOUND**2 + COMPACT_ETA**2)
    cutoff_frequency = 2 * mp.pi * (M + 1) / L
    projection_term = 4 * mp.sqrt(L) * lambda_to_eta * projection_error
    low_term = (
        4
        * projected_state_norm
        * mp.sqrt(L)
        * lambda_to_eta
        * actual_low_norm
    )
    high_term = (
        8
        * mp.sqrt(2)
        / mp.pi
        * projected_state_norm
        * lambda_to_eta
        * mp.sqrt(L / M)
        * actual_high_norm
    )
    low_term_theorem_bound = (
        4
        * projected_state_norm
        * mp.sqrt(L)
        * lambda_to_eta
        * mp.sqrt(max(mp.mpf(0), A_R_F_bound))
    )
    high_term_C_R_bound = (
        8
        * mp.sqrt(2)
        / mp.pi
        * projected_state_norm
        * lambda_to_eta
        * mp.sqrt(L / M)
        * C_R
    )

    source_guard = {
        "base_schema": base_payload["schema"],
        "base_checkpoint_version": base_payload["checkpoint_version"],
        "base_terminal_state": base_payload["terminal_state"],
        "prime_power_inventory": [
            item["n"] for item in base_payload["source_inventory"]["prime_powers"]
        ],
        "expected_prime_power_inventory": [2, 3, 4],
        "prime_endpoint_lambda_squared_included": True,
        "source_prime_block_sign": "minus",
        "pole_block": pole,
        "archimedean_unsigned_block": arch,
        "prime_unsigned_block": prime,
        "full_Q_pole_minus_archimedean_minus_prime": Q,
        "full_Q_reconstruction_defect": _max_abs(Q - (pole - arch - prime)),
        "inversion_J": J,
        "integer_mode_operator": mode,
        "natural_even_basis": even,
        "natural_odd_basis": odd,
        "natural_even_basis_orthonormality_defect": _max_abs(
            even.T * even - mp.eye(N + 1)
        ),
        "natural_odd_basis_orthonormality_defect": _max_abs(
            odd.T * odd - mp.eye(N)
        ),
        "parity_basis_cross_defect": _max_abs(even.T * odd),
        "Q_even": Q_even,
        "Q_odd": Q_odd,
        "kappa_modes_minusN_to_N": kappa,
        "kappa_even_coordinates": kappa_even,
        "anchor_complement_W": W,
        "W_orthonormality_defect": _max_abs(W.T * W - mp.eye(N)),
        "W_anchor_orthogonality_defect": _norm(W.T * kappa_even),
        "source_hermitian_defect": _max_abs(Q - Q.T),
        "source_inversion_commutator_defect": _max_abs(Q * J - J * Q),
        "cached_matrix_read": False,
        "cached_eigensystem_read": False,
        "cached_artifact_read": False,
        "zeta_zero_table_read": False,
        "global_weil_positivity_assumed": False,
        "binary64_parameter_used": False,
    }
    normalization_regression = {
        "a4": mp.mpf(normalization["a4"]),
        "a0_lambda": mp.mpf(normalization["a0_lambda"]),
        "projected_state_norm_a": projected_state_norm,
        "projection_error_e": projection_error,
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
    ritz_ground_geometry = {
        "q": q,
        "residual_vector_b": b,
        "residual_r": residual_r,
        "residual_direction_w": w,
        "residual_direction_norm_defect": abs(_norm(w) - 1),
        "B_q": B_q,
        "residual_direction_energy_at_q": complement_energy_q,
        "c_R_two_vector_lower_right_entry": c_R,
        "two_vector_matrix": ritz_matrix,
        "two_vector_ritz_U_equals_u": u,
        "d_q_minus_U": d,
        "ritz_characteristic_residual": ritz_characteristic_residual,
        "B_U": B_U,
        "B_U_eigenvalues": B_values,
        "odd_shifted_eigenvalues_at_U": odd_values,
        "ritz_moment_w_B_U_w": ritz_moment,
        "d_times_ritz_moment": d * ritz_moment,
        "r_squared": residual_r**2,
        "ritz_moment_residual": ritz_moment_residual,
        **constants,
        "complete_even_eigenvalues": even_values,
        "true_even_ground_mu": mu,
        "u_minus_mu_h": h,
        "r_minus_h": residual_r - h,
        "ground_correction_z": z,
        "z_norm_squared": z_norm_squared,
        "C_R_squared_minus_z_norm_squared": C_R_squared - z_norm_squared,
        "gamma_unit_ground_coefficient": gamma,
        "projective_scalar_s_equals_one_over_gamma": projective_scalar_s,
        "coefficient_normalized_ground_even": coefficient_ground_even,
        "unit_ground_even": unit_ground_even,
        "fresh_eigsy_unit_ground_even": fresh_ground,
        "fresh_ground_vector_defect": _norm(unit_ground_even - fresh_ground),
        "ground_eigen_residual_norm": _norm(ground_eigen_residual),
        "feshbach_vector_residual_norm": _norm(feshbach_residual),
        "feshbach_scalar_residual": feshbach_scalar_residual,
        "projective_identity_s_xi_minus_kappa_plus_Wz_norm": _norm(
            projective_identity_residual
        ),
    }
    low_mode_observation = {
        "M": M,
        "theta": theta,
        "full_ambient_Pi_M": Pi_raw,
        "Pi_M_even": Pi_even,
        "Pi_M_odd": Pi_odd,
        "Pi_M_projector_defect": _max_abs(Pi_raw * Pi_raw - Pi_raw),
        "K_M_WT_Pi_even_W": K_M,
        "K_M_eigenvalues": K_values,
        "K_M_minimum_eigenvalue": K_values[0],
        "K_M_maximum_eigenvalue": K_values[-1],
        "D_B_U_plus_rI": D,
        "X_r_D_inverse_half_K_D_inverse_half_eigenvalues": X_values,
        "X_minimum_eigenvalue": X_values[0],
        "X_maximum_eigenvalue": X_values[-1],
        "actual_low_vector_Pi_M_Wz": low_vector_even,
        "actual_low_squared_norm": actual_low_squared,
        "actual_zT_K_M_z": actual_zKz,
        "low_squared_identity_residual": actual_low_squared - actual_zKz,
        "actual_high_vector_I_minus_Pi_M_Wz": high_vector_even,
        "actual_high_norm": actual_high_norm,
        "actual_total_z_norm": mp.sqrt(z_norm_squared),
        "low_high_pythagoras_residual": actual_total_split_residual,
        "C_R_high_norm_bound": C_R,
        "C_R_minus_actual_high_norm": C_R - actual_high_norm,
        "soft_trace_H": H,
        "log_increment_F": F,
        "determinant_ratio": mp.exp(F),
        "F_over_theta_lower_bound": response_lower,
        "F_over_log1p_theta_upper_bound": response_upper,
        "H_minus_F_over_theta": H - response_lower,
        "F_over_log1p_theta_minus_H": response_upper - H,
        "A_R_times_H": A_R_H,
        "A_R_times_F_over_log1p_theta": A_R_F_bound,
        "A_R_H_minus_actual_low_squared": A_R_H - actual_low_squared,
        "A_R_F_bound_minus_actual_low_squared": A_R_F_bound - actual_low_squared,
        "Ritz_Loewner_matrix": loewner,
        "Ritz_Loewner_eigenvalues": loewner_values,
        "Ritz_Loewner_minimum_eigenvalue": loewner_values[0],
    }
    full_source_factorization = {
        "full_ambient_homotopy_required": True,
        "compressed_only_homotopy_allowed": False,
        "zeta_U_minus_r": zeta,
        "homotopy_endpoints": [mp.mpf(0), theta * residual_r],
        "eta_even_boundary_vector": eta_even,
        "e0_even": e0_even,
        "mode_Pi_commutator": mode_cutoff_commutator,
        "mode_Pi_commutator_defect": _max_abs(mode_cutoff_commutator),
        "J_Pi_minus_Pi_J": inversion_cutoff_commutator,
        "J_Pi_commutator_defect": _max_abs(inversion_cutoff_commutator),
        "source_displacement_change_under_homotopy": source_displacement_preservation,
        "source_displacement_preservation_defect": _max_abs(
            source_displacement_preservation
        ),
        "t_zero": endpoint_0,
        "t_theta_r": endpoint_r,
        "F_direct_complement_logdet_increment": F,
        "F_from_full_source_odd_boundary_anchor_factors": factorized_F,
        "full_source_factorization_residual": factorization_residual,
    }
    compact_bridge_diagnostic = {
        "finite_diagnostic_only": True,
        "asymptotic_pass_claim": False,
        "locally_uniform_claim": False,
        "real_compact_bound_B": COMPACT_REAL_BOUND,
        "strip_height_eta": COMPACT_ETA,
        "compact_radius_sqrt_B2_plus_eta2": compact_radius,
        "cutoff_frequency_2pi_Mplus1_over_L": cutoff_frequency,
        "required_twice_compact_radius": 2 * compact_radius,
        "cutoff_condition_slack": cutoff_frequency - 2 * compact_radius,
        "lambda_to_eta": lambda_to_eta,
        "projected_state_norm_a": projected_state_norm,
        "projection_error_e": projection_error,
        "projective_difference_s_xi_minus_kappa": -W * z,
        "term_1_projection_4_sqrtL_lambdaeta_e": projection_term,
        "term_2_low_4a_sqrtL_lambdaeta_low_norm": low_term,
        "term_3_high_8sqrt2_over_pi_a_lambdaeta_sqrtL_over_M_high_norm": high_term,
        "sum_of_three_exact_projective_split_terms": (
            projection_term + low_term + high_term
        ),
        "theorem_term_1_projection": projection_term,
        "theorem_term_2_Ritz_logdet_upper_bound": low_term_theorem_bound,
        "theorem_term_3_C_R_upper_bound": high_term_C_R_bound,
        "sum_of_three_theorem_terms": (
            projection_term + low_term_theorem_bound + high_term_C_R_bound
        ),
        "low_mode_rate_scalar_a2_L_lambda2eta_A_R_F_over_log1p_theta": (
            projected_state_norm**2
            * L
            * lam ** (2 * COMPACT_ETA)
            * A_R
            * F
            / mp.log1p(theta)
        ),
        "high_mode_rate_scalar_a_lambdaeta_sqrtL_over_M_C_R": (
            projected_state_norm * lambda_to_eta * mp.sqrt(L / M) * C_R
        ),
    }

    raw_sections = {
        "source_guard": source_guard,
        "normalization_regression": normalization_regression,
        "ritz_ground_geometry": ritz_ground_geometry,
        "low_mode_observation": low_mode_observation,
        "full_source_factorization": full_source_factorization,
        "compact_bridge_diagnostic": compact_bridge_diagnostic,
    }
    sections = {name: _encode(value, dps) for name, value in raw_sections.items()}
    live = {
        "source": source_guard,
        "normalization": normalization_regression,
        "ritz": {
            "u": u,
            "q": q,
            "d": d,
            "r": residual_r,
            "B_min": B_values[0],
            "odd_min": odd_values[0],
            "ritz_characteristic_residual": ritz_characteristic_residual,
            "ritz_moment_residual": ritz_moment_residual,
            "w_norm_defect": abs(_norm(w) - 1),
            "h": h,
            "r_minus_h": residual_r - h,
            "C_norm_slack": C_R_squared - z_norm_squared,
            "ground_gap": even_values[1] - even_values[0],
            "ground_defect": _norm(unit_ground_even - fresh_ground),
            "ground_residual": _norm(ground_eigen_residual),
            "feshbach_vector_residual": _norm(feshbach_residual),
            "feshbach_scalar_residual": feshbach_scalar_residual,
            "projective_identity_residual": _norm(projective_identity_residual),
        },
        "low": {
            "Pi_defect": _max_abs(Pi_raw * Pi_raw - Pi_raw),
            "K_min": K_values[0],
            "K_max": K_values[-1],
            "X_min": X_values[0],
            "X_max": X_values[-1],
            "F": F,
            "H": H,
            "low_identity_residual": actual_low_squared - actual_zKz,
            "pythagoras_residual": actual_total_split_residual,
            "high_bound_slack": C_R - actual_high_norm,
            "response_lower_slack": H - response_lower,
            "response_upper_slack": response_upper - H,
            "trace_transfer_slack": A_R_H - actual_low_squared,
            "determinant_transfer_slack": A_R_F_bound - actual_low_squared,
            "loewner_min": loewner_values[0],
        },
        "factor": {
            "mode_commutator": _max_abs(mode_cutoff_commutator),
            "inversion_commutator": _max_abs(inversion_cutoff_commutator),
            "displacement_preservation": _max_abs(source_displacement_preservation),
            "endpoints": [endpoint_0_live, endpoint_r_live],
            "F_residual": factorization_residual,
        },
        "compact": {
            "cutoff_slack": cutoff_frequency - 2 * compact_radius,
            "terms": [projection_term, low_term, high_term],
            "upper_terms": [projection_term, low_term_theorem_bound, high_term_C_R_bound],
        },
    }
    return sections, live


def _validate_live(live: dict[str, Any], dps: int) -> None:
    tolerance = mp.power(10, -max(12, dps // 3))
    construction_tolerance = mp.power(10, -max(18, dps // 2))
    source = live["source"]
    if source["base_terminal_state"] != TERMINAL_STATE:
        raise Checkpoint068Error("unexpected base terminal state")
    if source["prime_power_inventory"] != [2, 3, 4]:
        raise Checkpoint068Error("prime-power inventory or inclusive endpoint changed")
    if source["source_prime_block_sign"] != "minus":
        raise Checkpoint068Error("source prime-block minus sign changed")
    for field in (
        "full_Q_reconstruction_defect",
        "natural_even_basis_orthonormality_defect",
        "natural_odd_basis_orthonormality_defect",
        "parity_basis_cross_defect",
        "W_orthonormality_defect",
        "W_anchor_orthogonality_defect",
        "source_hermitian_defect",
        "source_inversion_commutator_defect",
    ):
        if abs(source[field]) > construction_tolerance:
            raise Checkpoint068Error(f"source construction failed: {field}")
    if any(
        source[field]
        for field in (
            "cached_matrix_read",
            "cached_eigensystem_read",
            "cached_artifact_read",
            "zeta_zero_table_read",
            "global_weil_positivity_assumed",
            "binary64_parameter_used",
        )
    ):
        raise Checkpoint068Error("forbidden source or parameter path")
    normalization = live["normalization"]
    if normalization["unit_normalized_replacement_allowed"]:
        raise Checkpoint068Error("unit-normalized replacement was not rejected")
    if normalization["unit_normalization_limiting_scalar_difference"] == 0:
        raise Checkpoint068Error("normalization regression did not change the limit")

    ritz = live["ritz"]
    if not (ritz["u"] < ritz["q"] and ritz["d"] > 0 and ritz["r"] > 0):
        raise Checkpoint068Error("invalid lower two-vector Ritz geometry")
    if ritz["B_min"] <= 0 or ritz["odd_min"] <= 0:
        raise Checkpoint068Error("nonpositive Ritz-shifted sector gate")
    for field in (
        "ritz_characteristic_residual",
        "ritz_moment_residual",
        "w_norm_defect",
        "ground_defect",
        "ground_residual",
        "feshbach_vector_residual",
        "feshbach_scalar_residual",
        "projective_identity_residual",
    ):
        if abs(ritz[field]) > construction_tolerance:
            raise Checkpoint068Error(f"Ritz or ground identity failed: {field}")
    if ritz["ground_gap"] <= 0:
        raise Checkpoint068Error("fresh even ground is not simple")
    if ritz["h"] < -tolerance or ritz["r_minus_h"] < -tolerance:
        raise Checkpoint068Error("automatic residual ridge failed")
    if ritz["C_norm_slack"] < -tolerance:
        raise Checkpoint068Error("C_R correction norm bound failed")

    low = live["low"]
    if low["Pi_defect"] > construction_tolerance:
        raise Checkpoint068Error("ambient low-mode cutoff is not a projector")
    if low["K_min"] < -tolerance or low["K_max"] > 1 + tolerance:
        raise Checkpoint068Error("compressed low-mode observation is not a contraction")
    if low["X_min"] < -tolerance or low["X_max"] > 1 + tolerance:
        raise Checkpoint068Error("normalized low-mode response is not a contraction")
    if low["F"] < -tolerance or low["H"] < -tolerance:
        raise Checkpoint068Error("positive response became negative")
    for field in (
        "low_identity_residual",
        "pythagoras_residual",
    ):
        if abs(low[field]) > construction_tolerance:
            raise Checkpoint068Error(f"low-mode identity failed: {field}")
    for field in (
        "high_bound_slack",
        "response_lower_slack",
        "response_upper_slack",
        "trace_transfer_slack",
        "determinant_transfer_slack",
        "loewner_min",
    ):
        if low[field] < -tolerance:
            raise Checkpoint068Error(f"low-mode inequality failed: {field}")

    factor = live["factor"]
    for field in ("mode_commutator", "inversion_commutator", "displacement_preservation"):
        if factor[field] > construction_tolerance:
            raise Checkpoint068Error(f"ambient source homotopy failed: {field}")
    for endpoint in factor["endpoints"]:
        if endpoint["positive_minimum"] <= 0:
            raise Checkpoint068Error("source factor is nonpositive")
        for field in ("a_residual", "b_residual", "matrix_residual"):
            if abs(endpoint[field]) > construction_tolerance:
                raise Checkpoint068Error(f"anchor cross reconstruction failed: {field}")
        for field in ("det_anchor_residual", "det_source_residual", "combined_residual"):
            if abs(endpoint[field]) > construction_tolerance * endpoint["det_scale"]:
                raise Checkpoint068Error(f"source determinant identity failed: {field}")
    if abs(factor["F_residual"]) > tolerance:
        raise Checkpoint068Error("full source factorization does not reproduce F")

    compact = live["compact"]
    if compact["cutoff_slack"] <= 0:
        raise Checkpoint068Error("compact Fourier cutoff condition failed")
    if any(term < -tolerance for term in compact["terms"] + compact["upper_terms"]):
        raise Checkpoint068Error("compact bridge term became negative")


def produce(
    lambda_text: str,
    N: int,
    M: int,
    theta_text: str,
    dps: int,
) -> dict[str, Any]:
    if not isinstance(lambda_text, str) or not isinstance(theta_text, str):
        raise TypeError("lambda and theta must be exact text; binary64 is forbidden")
    if isinstance(N, bool) or not isinstance(N, int):
        raise TypeError("N must be an exact integer")
    if isinstance(M, bool) or not isinstance(M, int):
        raise TypeError("M must be an exact integer")
    if isinstance(dps, bool) or not isinstance(dps, int):
        raise TypeError("precision must be an exact integer")
    try:
        lambda_fraction = Fraction(lambda_text)
        theta_fraction = Fraction(theta_text)
    except (ValueError, ZeroDivisionError) as exc:
        raise Checkpoint068Error("lambda and theta must be exact rational text") from exc
    if lambda_fraction != 2 or N != 4 or M != LOCKED_M or theta_fraction != 1:
        raise Checkpoint068Error(
            "checkpoint 0.68 is locked to lambda=2, N=4, M=2, theta=1"
        )
    if not (1 <= M < N):
        raise Checkpoint068Error("projective low cutoff must satisfy 1<=M<N")
    if dps not in (40, 80):
        raise Checkpoint068Error("checkpoint 0.68 permits only 40 or 80 decimal digits")

    mp.mp.dps = dps
    theta = mp.mpf(theta_fraction.numerator) / theta_fraction.denominator
    base_payload = base.produce(lambda_text, N, BASE_T_TEXT, dps)
    sections, live = _compute_sections(base_payload, M, theta, dps)
    _validate_live(live, dps)
    inputs = {
        "lambda": lambda_text,
        "N": N,
        "M": M,
        "theta": theta_text,
        "base_checkpoint064_T": BASE_T_TEXT,
        "precision_decimal_digits": dps,
        "L": base_payload["inputs"]["L"],
        "compact_real_bound_B": "1",
        "compact_strip_eta": "1/4",
    }
    return {
        "schema": SCHEMA,
        "checkpoint_version": CHECKPOINT_VERSION,
        "terminal_state": TERMINAL_STATE,
        "claim_class": "FINITE_POINT_DIAGNOSTIC",
        "analytic_uniform_claim": False,
        "equation_5_2_claim": False,
        "rh_proof_claim": False,
        "inputs": inputs,
        "locked_conventions": LOCKED_CONVENTIONS,
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
    parser.add_argument("--M", type=int, required=True)
    parser.add_argument("--theta", dest="theta_text", required=True)
    parser.add_argument("--dps", type=int, required=True)
    parser.add_argument("--output", type=Path, required=True)
    arguments = parser.parse_args()
    result = produce(
        arguments.lambda_text,
        arguments.N,
        arguments.M,
        arguments.theta_text,
        arguments.dps,
    )
    text = json.dumps(result, indent=2, sort_keys=True, allow_nan=False) + "\n"
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(text, encoding="utf-8")
    print(text, end="")


if __name__ == "__main__":
    main()
