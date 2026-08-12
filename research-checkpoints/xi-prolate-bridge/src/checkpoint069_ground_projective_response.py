#!/usr/bin/env python3
"""Checkpoint 0.69 source-compatible ground projective response producer.

This producer is locked to ``lambda=2, N=4, M=2`` at 40 or 80 decimal
digits.  It rebuilds checkpoint 0.64 through its live source and prolate
assembly.  It then reconstructs the finite even ground, its singular
adjugate, the vector-specific projective low-mode energy, the source odd
cofactor factorization, positive bordered responses at two independent
gauges, and the exact Ritz-shifted even/odd Schur sign gates.

No cached matrix, eigensystem, artifact, or zeta-zero table is read.  Every
reported number is an arbitrary-precision point value, not an interval or
ball enclosure.  In particular, this file proves no unbounded response
rate, shifted-sector theorem, locally uniform determinant limit, equation
(5.2), or Riemann-hypothesis conclusion.
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
SCHEMA = "xi-prolate-checkpoint069-ground-projective-response-v1"
CHECKPOINT_VERSION = "0.69.0-ground-projective-response-point"
TERMINAL_STATE = "P0_INVALIDATED"
LOCKED_M = 2
BASE_T_TEXT = "1"
FINITE_TAU = mp.mpf(1)

GAUGES = (
    ("rho1_s1", "1", "1"),
    ("rho2_s1over2", "2", "1/2"),
)

DEPENDENCIES = (
    "P0_SOURCE_LOCK.json",
    "P0_NORMALIZATION_AUDIT.md",
    "DIRECT_RH_ATTACK.md",
    "FALSE_SHORTCUTS.md",
    "vendor/CCM-ZST-2511.22755v1.pdf",
    "vendor/CCM-PROLATE-2310.18423v2.pdf",
    "notes/SOURCE_COMPATIBLE_GROUND_PROJECTIVE_RESPONSE.md",
    "notes/RITZ_MOMENT_SELF_REGULARIZED_TRANSFER.md",
    "notes/RITZ_PROJECTIVE_LOW_MODE_DETERMINANT_GATE.md",
    "notes/RITZ_SHIFTED_TAIL_DISCREPANCY_SCHUR_GATE.md",
    "notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md",
    "notes/OUTER_PROJECTION_RADICAL_REDUCTION.md",
    "notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md",
    "notes/ODD_RESOLVENT_WEYL_RECONSTRUCTION.md",
    "notes/UNBOUNDED_RELATIVE_ORIENTATION_INSTABILITY.md",
    "src/checkpoint064_reciprocal_secant.py",
    "src/checkpoint069_ground_projective_response.py",
    "src/prolate_state.py",
    "src/weil_matrix.py",
    "verifier/checkpoint064_reciprocal_secant_replay.py",
    "verifier/checkpoint069_ground_projective_response_replay.py",
    "verifier/independent_replay.py",
    "tests/test_checkpoint064_reciprocal_secant.py",
    "tests/test_checkpoint069_ground_projective_response.py",
    "tests/test_source_compatible_ground_projective_response.py",
)

PINNED_SOURCE_SHA256 = dict(base.PINNED_SOURCE_SHA256)

LOCKED_CONVENTIONS = dict(base.LOCKED_CONVENTIONS)
LOCKED_CONVENTIONS.update(
    {
        "checkpoint069_source_point": (
            "lambda=2, N=4, M=2 only; 40 or 80 decimal digits"
        ),
        "ground_normalization": (
            "the coefficient-normalized even ground x satisfies "
            "<kappa,x>=1; its unit scalar is serialized separately"
        ),
        "low_mode_cutoff": (
            "Pi_M is the full ambient centered projector onto raw modes "
            "|n|<=M before even/odd compression"
        ),
        "singular_response": (
            "adjugates and bordered determinants are used at the exact "
            "finite ground; no inverse of the singular even ground matrix"
        ),
        "bordered_gauges": (
            "two exact rational (rho,s) gauges are serialized; their "
            "vector-specific derivative must agree"
        ),
    }
)

LOCKED_FORMULAS = {
    "ritz_shift": (
        "w=b/r; c_R=q+<w,B_q w>; "
        "u=(q+c_R-sqrt((c_R-q)^2+4r^2))/2; d=q-u"
    ),
    "ground_block": (
        "H=Q_+-mu I=[[a,b^T],[b,D]] in kappa plus W; "
        "D=B_u+(u-mu)I; z=D^(-1)b; x=kappa-Wz"
    ),
    "adjugate": (
        "C=adj(H)=c*x*x^T; c=<kappa,C kappa>=det(D); "
        "C*kappa/c=x"
    ),
    "projective_energy": (
        "E=||Pi_M(kappa-x)||^2=<z,K_M z> with K_M=W^T Pi_(M,+) W"
    ),
    "minor_decomposition": (
        "S=partial_t det(H+t Pi)|_0=tr(adj(H)Pi); "
        "R_pm=partial_t det(H+t(kappa+-Pi*kappa)(...)^T)|_0; "
        "E=k00+S/c-(R_plus-R_minus)/(2c)"
    ),
    "high_cross": (
        "S_M=tr(Pi*adj(H))/c; R=I-Pi; "
        "S_M-k00=E-2*kappa^T*R*(x-kappa); "
        "the sign before the high cross is minus"
    ),
    "odd_reconstruction": (
        "O=Q_--mu I; O*Dmode*x=-(delta x)*beta; "
        "det(O)=delta(adj(H)e0)=c*(delta x)*(e0^T x)"
    ),
    "bordered_response": (
        "A_t=H+tPi; L_t=A_t+rho*kappa*kappa^T; g=H*kappa; "
        "D_t=det(L_t); N_t=D_t*g^T L_t^(-1)g; "
        "Phi_s(t)=log(D_t(D_0+sN_0)/(D_0(D_t+sN_t)))"
    ),
    "bordered_derivative": (
        "E=(1+s(q-mu))*Phi_s'(0)/s; "
        "N_0'D_0-N_0D_0'=-D_0^2 E"
    ),
    "finite_secant": (
        "S_tau=(alpha_0-alpha_tau)/tau; "
        "S_tau<=E<=(1+tau*Lambda_full)S_tau and "
        "E/((1+tau*Lambda_full)(1+s*alpha_0)) "
        "<=Phi_s(tau)/(s*tau)<=E"
    ),
    "even_sign_gate": (
        "y_R=kappa-(d/r)Ww; e=(Q_+-uI)y_R; "
        "B_u>0 iff C_F-e_F*e_F^T/d>0"
    ),
    "odd_sign_gate": (
        "x_D=Dmode*kappa; s_q=Dmode*(Q_+-qI)kappa-<eta,kappa>*beta; "
        "Q_--uI>0 iff A_q+dI>0 and "
        "a_q+d-c_q^T(A_q+dI)^(-1)c_q>0"
    ),
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
    "producer_source_path": (
        "checkpoint-0.64 live distributional "
        "pole--archimedean--minus-prime assembly"
    ),
    "producer_prolate_path": (
        "checkpoint-0.64 live source-normalized Legendre recurrence"
    ),
    "producer_ground_path": (
        "fresh even eigensolve followed by an independent anchor-Feshbach "
        "solve and literal cofactor minors"
    ),
    "producer_odd_path": (
        "fresh odd shifted solve and source boundary cofactor identity"
    ),
    "producer_bordered_path": (
        "literal bordered determinants plus direct positive-matrix solves"
    ),
    "shared_arithmetic_limitation": (
        "producer and verifier share mpmath transcendental point arithmetic"
    ),
}

LIMITATIONS = [
    "finite arbitrary-precision point diagnostic, not an interval or ball enclosure",
    "producer and verifier share mpmath transcendental arithmetic and linear algebra",
    "the source-normalized prolate state remains a fixed 30-mode Galerkin truncation without a tail enclosure",
    "the finite true-ground eigenvalue is freshly reconstructed but is still a point value",
    "literal adjugate minors can be ill-conditioned beyond this locked small pilot",
    "the rank-one bordered readouts do not themselves preserve the source rank-two commutator",
    "the full spectral cap is finite-point data and no unbounded cyclic-cap estimate is proved",
    "the shifted even and odd Schur margins are finite diagnostics, not schedule theorems",
    "no locally uniform determinant conclusion is inferred from finite determinant agreement",
    "no conclusion about DIRECT_RH_ATTACK equation (5.2), a new Lambda bound, or RH is claimed",
]


class Checkpoint069Error(ValueError):
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
            raise Checkpoint069Error(f"pinned source hash mismatch: {name}")


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
        raise Checkpoint069Error("matrix inverse requires a square matrix")
    result = mp.matrix(A.rows)
    for j in range(A.rows):
        unit = mp.matrix(A.rows, 1)
        unit[j] = 1
        result[:, j] = mp.lu_solve(A, unit)
    return result


def _symmetric_inverse_sqrt(A: mp.matrix) -> mp.matrix:
    values, vectors = mp.eigsy(_symmetrize(A))
    if values[0] <= 0:
        raise Checkpoint069Error("positive inverse square root requires A>0")
    diagonal = mp.diag([1 / mp.sqrt(values[j]) for j in range(values.rows)])
    return vectors * diagonal * vectors.T


def _minor(A: mp.matrix, deleted_row: int, deleted_column: int) -> mp.matrix:
    rows = [i for i in range(A.rows) if i != deleted_row]
    columns = [j for j in range(A.cols) if j != deleted_column]
    return mp.matrix([[A[i, j] for j in columns] for i in rows])


def _adjugate(A: mp.matrix) -> mp.matrix:
    if A.rows != A.cols:
        raise Checkpoint069Error("adjugate requires a square matrix")
    if A.rows == 1:
        return mp.matrix([[mp.mpf(1)]])
    result = mp.matrix(A.rows)
    for i in range(A.rows):
        for j in range(A.cols):
            result[i, j] = (-1) ** (i + j) * mp.det(_minor(A, j, i))
    return result


def _det_directional_derivative(A: mp.matrix, E: mp.matrix) -> mp.mpf:
    if A.rows != A.cols or E.rows != A.rows or E.cols != A.cols:
        raise Checkpoint069Error("determinant derivative matrix shape mismatch")
    terms: list[mp.mpf] = []
    for column in range(A.cols):
        replaced = mp.matrix(A)
        replaced[:, column] = E[:, column]
        terms.append(mp.det(replaced))
    return mp.fsum(terms)


def _bordered_D_matrix(
    A_t: mp.matrix, kappa: mp.matrix, rho: mp.mpf
) -> mp.matrix:
    n = A_t.rows
    result = mp.matrix(n + 1)
    result[:n, :n] = A_t
    result[:n, n] = kappa
    result[n, :n] = kappa.T
    result[n, n] = -1 / rho
    return result


def _bordered_N_matrix(
    A_t: mp.matrix, kappa: mp.matrix, g: mp.matrix, rho: mp.mpf
) -> mp.matrix:
    n = A_t.rows
    result = mp.matrix(n + 2)
    result[:n, :n] = A_t
    result[:n, n] = kappa
    result[n, :n] = kappa.T
    result[n, n] = -1 / rho
    result[:n, n + 1] = g
    result[n + 1, :n] = g.T
    return result


def _mixed_minor_matrix(
    H: mp.matrix, kappa: mp.matrix, mode_vector: mp.matrix
) -> mp.matrix:
    n = H.rows
    result = mp.matrix(n + 1)
    result[:n, :n] = H
    result[:n, n] = kappa
    result[n, :n] = mode_vector.T
    return result


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


def _bordered_gauge(
    label: str,
    rho: mp.mpf,
    s: mp.mpf,
    H: mp.matrix,
    Pi_even: mp.matrix,
    kappa: mp.matrix,
    g: mp.matrix,
    E: mp.mpf,
    alpha_expected: mp.mpf,
) -> tuple[dict[str, Any], dict[str, mp.mpf]]:
    tau = FINITE_TAU
    L_0 = _symmetrize(H + rho * kappa * kappa.T)
    L_tau = _symmetrize(L_0 + tau * Pi_even)
    L0_values, _ = mp.eigsy(L_0)
    Ltau_values, _ = mp.eigsy(L_tau)
    if L0_values[0] <= 0 or Ltau_values[0] <= 0:
        raise Checkpoint069Error(f"nonpositive bordered gauge matrix: {label}")
    L0_inverse = _inverse(L_0)
    Ltau_inverse = _inverse(L_tau)
    response_vector = L0_inverse * g
    alpha_0 = (g.T * response_vector)[0]
    alpha_tau = (g.T * Ltau_inverse * g)[0]

    A_0 = H
    A_tau = H + tau * Pi_even
    D_border_0 = _bordered_D_matrix(A_0, kappa, rho)
    D_border_tau = _bordered_D_matrix(A_tau, kappa, rho)
    N_border_0 = _bordered_N_matrix(A_0, kappa, g, rho)
    N_border_tau = _bordered_N_matrix(A_tau, kappa, g, rho)
    D_0_direct = mp.det(L_0)
    D_tau_direct = mp.det(L_tau)
    D_0_bordered = -rho * mp.det(D_border_0)
    D_tau_bordered = -rho * mp.det(D_border_tau)
    N_0_direct = D_0_direct * alpha_0
    N_tau_direct = D_tau_direct * alpha_tau
    N_0_bordered = rho * mp.det(N_border_0)
    N_tau_bordered = rho * mp.det(N_border_tau)

    D_prime_0 = D_0_direct * _trace(L0_inverse * Pi_even)
    N_prime_0 = D_prime_0 * alpha_0 - D_0_direct * E
    alpha_prime_quotient = (
        N_prime_0 * D_0_direct - N_0_direct * D_prime_0
    ) / D_0_direct**2
    derivative_cancellation = (
        N_prime_0 * D_0_direct
        - N_0_direct * D_prime_0
        + D_0_direct**2 * E
    )
    phi_prime_0 = s * E / (1 + s * alpha_0)
    phi_prime_from_DN = D_prime_0 / D_0_direct - (
        D_prime_0 + s * N_prime_0
    ) / (D_0_direct + s * N_0_direct)
    E_from_phi_prime = (1 + s * alpha_0) * phi_prime_0 / s

    phi_tau = mp.log(
        D_tau_direct
        * (D_0_direct + s * N_0_direct)
        / (D_0_direct * (D_tau_direct + s * N_tau_direct))
    )
    phi_tau_alpha = mp.log((1 + s * alpha_0) / (1 + s * alpha_tau))
    secant = (alpha_0 - alpha_tau) / tau
    inverse_sqrt = _symmetric_inverse_sqrt(L_0)
    cap_operator = _symmetrize(inverse_sqrt * Pi_even * inverse_sqrt)
    cap_values, _ = mp.eigsy(cap_operator)
    full_cap = cap_values[-1]
    secant_upper = (1 + tau * full_cap) * secant
    scaled_phi = phi_tau / (s * tau)
    scaled_phi_lower = E / ((1 + tau * full_cap) * (1 + s * alpha_0))
    decrement_from_phi = (1 + s * alpha_0) * (1 - mp.exp(-phi_tau)) / s

    data = {
        "label": label,
        "rho": rho,
        "s": s,
        "finite_tau": tau,
        "L_0_H_plus_rho_kappakappaT": L_0,
        "L_tau_L0_plus_tau_Pi": L_tau,
        "L_0_eigenvalues": L0_values,
        "L_tau_eigenvalues": Ltau_values,
        "g_H_kappa": g,
        "L0_inverse_g": response_vector,
        "alpha_0": alpha_0,
        "alpha_0_expected_q_minus_mu": alpha_expected,
        "alpha_0_residual": alpha_0 - alpha_expected,
        "alpha_tau": alpha_tau,
        "bordered_D_matrix_t0": D_border_0,
        "bordered_D_matrix_tau": D_border_tau,
        "bordered_N_matrix_t0": N_border_0,
        "bordered_N_matrix_tau": N_border_tau,
        "D_0_direct_det_L0": D_0_direct,
        "D_0_bordered": D_0_bordered,
        "D_0_bordered_residual": D_0_bordered - D_0_direct,
        "D_tau_direct_det_Ltau": D_tau_direct,
        "D_tau_bordered": D_tau_bordered,
        "D_tau_bordered_residual": D_tau_bordered - D_tau_direct,
        "N_0_direct_D0_alpha0": N_0_direct,
        "N_0_bordered": N_0_bordered,
        "N_0_bordered_residual": N_0_bordered - N_0_direct,
        "N_tau_direct_Dtau_alphatau": N_tau_direct,
        "N_tau_bordered": N_tau_bordered,
        "N_tau_bordered_residual": N_tau_bordered - N_tau_direct,
        "D_prime_0": D_prime_0,
        "N_prime_0": N_prime_0,
        "alpha_prime_0_from_quotient": alpha_prime_quotient,
        "alpha_prime_0_plus_E_residual": alpha_prime_quotient + E,
        "derivative_trace_cancellation_residual": derivative_cancellation,
        "Phi_s_prime_0": phi_prime_0,
        "Phi_s_prime_0_from_DN_log_derivative": phi_prime_from_DN,
        "Phi_s_prime_DN_residual": phi_prime_from_DN - phi_prime_0,
        "E_from_Phi_s_prime_0": E_from_phi_prime,
        "E_derivative_residual": E_from_phi_prime - E,
        "Phi_s_tau_from_bordered_DN": phi_tau,
        "Phi_s_tau_from_alpha_ratio": phi_tau_alpha,
        "Phi_s_tau_identity_residual": phi_tau - phi_tau_alpha,
        "finite_alpha_secant": secant,
        "alpha_decrement_from_Phi_exponential": decrement_from_phi,
        "alpha_decrement_Phi_residual": decrement_from_phi
        - (alpha_0 - alpha_tau),
        "full_cap_operator_L0_inverse_half_Pi_L0_inverse_half": cap_operator,
        "full_cap_eigenvalues": cap_values,
        "full_cap_Lambda": full_cap,
        "secant_lower_bound": secant,
        "secant_upper_bound_one_plus_tau_Lambda_times_secant": secant_upper,
        "E_minus_secant": E - secant,
        "secant_upper_minus_E": secant_upper - E,
        "scaled_finite_Phi_over_s_tau": scaled_phi,
        "scaled_Phi_lower_bound": scaled_phi_lower,
        "scaled_Phi_upper_bound_E": E,
        "scaled_Phi_minus_lower": scaled_phi - scaled_phi_lower,
        "E_minus_scaled_Phi": E - scaled_phi,
    }
    live = {
        "positive_minimum": min(L0_values[0], Ltau_values[0]),
        "alpha_residual": alpha_0 - alpha_expected,
        "response_vector": response_vector,
        "D_residual": max(
            abs(D_0_bordered - D_0_direct),
            abs(D_tau_bordered - D_tau_direct),
        ),
        "N_residual": max(
            abs(N_0_bordered - N_0_direct),
            abs(N_tau_bordered - N_tau_direct),
        ),
        "derivative_residual": max(
            abs(alpha_prime_quotient + E),
            abs(derivative_cancellation),
            abs(phi_prime_from_DN - phi_prime_0),
            abs(E_from_phi_prime - E),
        ),
        "finite_identity_residual": max(
            abs(phi_tau - phi_tau_alpha),
            abs(decrement_from_phi - (alpha_0 - alpha_tau)),
        ),
        "secant_lower_slack": E - secant,
        "secant_upper_slack": secant_upper - E,
        "phi_lower_slack": scaled_phi - scaled_phi_lower,
        "phi_upper_slack": E - scaled_phi,
    }
    return data, live


def _compute_sections(
    base_payload: dict[str, Any], M: int, dps: int
) -> tuple[dict[str, Any], dict[str, Any]]:
    source = base_payload["source_geometry"]
    normalization = base_payload["normalization"]
    N = int(base_payload["inputs"]["N"])

    pole = _matrix(source["pole"])
    arch = _matrix(source["archimedean_unsigned"])
    prime = _matrix(source["prime_unsigned"])
    Q = _matrix(source["Q_equals_pole_minus_archimedean_minus_prime"])
    kappa_raw = _vector(normalization["kappa_modes_minusN_to_N"])
    even, odd = base._sector_bases(N)
    J = base.inversion(N)
    mode = mp.diag(list(range(-N, N + 1)))
    Q_even = _symmetrize(even.T * Q * even)
    Q_odd = _symmetrize(odd.T * Q * odd)
    kappa = even.T * kappa_raw
    W = base._orthogonal_complement(kappa)
    q = _dot(kappa, Q_even, kappa)
    b = W.T * (Q_even * kappa - q * kappa)
    residual_r = _norm(b)
    if residual_r <= 0:
        raise Checkpoint069Error("checkpoint 0.69 requires the positive-residual branch")
    w = b / residual_r
    B_q = _symmetrize(W.T * Q_even * W - q * mp.eye(N))
    c_R = q + _dot(w, B_q, w)
    u = (q + c_R - mp.sqrt((c_R - q) ** 2 + 4 * residual_r**2)) / 2
    d = q - u
    if d <= 0:
        raise Checkpoint069Error("checkpoint 0.69 requires the strict lower Ritz shift")
    B_u = _symmetrize(B_q + d * mp.eye(N))
    B_u_values, _ = mp.eigsy(B_u)
    odd_u = _symmetrize(Q_odd - u * mp.eye(N))
    odd_u_values, _ = mp.eigsy(odd_u)
    ritz_moment = _dot(w, B_u, w)

    even_values, even_vectors = mp.eigsy(Q_even)
    mu = even_values[0]
    h = u - mu
    D_ground = _symmetrize(B_u + h * mp.eye(N))
    D_ground_values, _ = mp.eigsy(D_ground)
    if D_ground_values[0] <= 0:
        raise Checkpoint069Error("ground complement must be positive")
    z = mp.lu_solve(D_ground, b)
    x = kappa - W * z
    x_unit_scale = 1 / _norm(x)
    x_unit = x_unit_scale * x
    fresh_ground = even_vectors[:, 0]
    if (fresh_ground.T * x_unit)[0] < 0:
        fresh_ground = -fresh_ground
    H = _symmetrize(Q_even - mu * mp.eye(N + 1))
    H_values, _ = mp.eigsy(H)
    H_adjugate = _adjugate(H)
    cofactor_column = H_adjugate * kappa
    c_adjugate = (kappa.T * cofactor_column)[0]
    c_det_complement = mp.det(D_ground)
    if c_adjugate <= 0 or c_det_complement <= 0:
        raise Checkpoint069Error("ground cofactor normalization must be positive")
    x_from_cofactor = cofactor_column / c_adjugate
    adjugate_rank_one = c_adjugate * x * x.T

    Pi_raw = mp.diag(
        [mp.mpf(1) if abs(n) <= M else mp.mpf(0) for n in range(-N, N + 1)]
    )
    Pi_even = _symmetrize(even.T * Pi_raw * even)
    Pi_odd = _symmetrize(odd.T * Pi_raw * odd)
    R_high = mp.eye(N + 1) - Pi_even
    K_M = _symmetrize(W.T * Pi_even * W)
    K_values, _ = mp.eigsy(K_M)
    projective_vector = kappa - x
    E_direct = _dot(projective_vector, Pi_even, projective_vector)
    E_zKz = _dot(z, K_M, z)
    k00 = _dot(kappa, Pi_even, kappa)
    ground_low_mass = _dot(x, Pi_even, x)
    low_cross = _dot(kappa, Pi_even, x)
    S_adjugate = _trace(H_adjugate * Pi_even)
    S_columns = _det_directional_derivative(H, Pi_even)
    v_plus = kappa + Pi_even * kappa
    v_minus = kappa - Pi_even * kappa
    R_plus = (v_plus.T * H_adjugate * v_plus)[0]
    R_minus = (v_minus.T * H_adjugate * v_minus)[0]
    E_minor = k00 + S_adjugate / c_adjugate - (
        R_plus - R_minus
    ) / (2 * c_adjugate)
    cross_from_polarization = (R_plus - R_minus) / (4 * c_adjugate)
    mixed_mode_minors: list[dict[str, Any]] = []
    mixed_mode_sum = mp.mpf(0)
    for mode_index in range(M + 1):
        mode_vector = mp.matrix(N + 1, 1)
        mode_vector[mode_index] = 1
        border = _mixed_minor_matrix(H, kappa, mode_vector)
        minor_direct = -mp.det(border)
        minor_adjugate = (mode_vector.T * H_adjugate * kappa)[0]
        combined_minor = minor_direct - c_adjugate * (mode_vector.T * kappa)[0]
        combined_square = abs(combined_minor) ** 2
        mixed_mode_sum += combined_square
        mixed_mode_minors.append(
            {
                "even_mode_index": mode_index,
                "mode_vector": mode_vector,
                "bordered_matrix": border,
                "mixed_minor_direct": minor_direct,
                "mixed_minor_adjugate": minor_adjugate,
                "mixed_minor_residual": minor_direct - minor_adjugate,
                "combined_minor_m_minus_c_modeT_kappa": combined_minor,
                "combined_minor_absolute_square": combined_square,
            }
        )
    E_mixed_mode_minors = mixed_mode_sum / c_adjugate**2
    total_projective_squared = (projective_vector.T * projective_vector)[0]
    high_kappa = _dot(kappa, R_high, kappa)
    high_ground = _dot(x, R_high, x)
    high_cross = _dot(kappa, R_high, x)
    high_projective = _dot(projective_vector, R_high, projective_vector)
    E_high_corrected = (
        total_projective_squared - high_kappa - high_ground + 2 * high_cross
    )
    E_high_wrong_sign = (
        total_projective_squared - high_kappa - high_ground - 2 * high_cross
    )
    y_ground_minus_anchor = x - kappa
    note_high_cross = _dot(kappa, R_high, y_ground_minus_anchor)
    S_M = S_adjugate / c_adjugate
    S_minus_k00 = S_M - k00
    note_high_rhs = E_direct - 2 * note_high_cross
    E_from_note_high_cross = S_minus_k00 + 2 * note_high_cross
    E_from_wrong_note_sign = S_minus_k00 - 2 * note_high_cross
    high_anchor_tail_norm = mp.sqrt(max(mp.mpf(0), high_kappa))
    note_high_absolute_bound = 2 * high_anchor_tail_norm * _norm(
        y_ground_minus_anchor
    )

    eta_raw = mp.matrix([mp.mpf(1) for _ in range(2 * N + 1)])
    eta_even = even.T * eta_raw
    e0_even = mp.matrix(N + 1, 1)
    e0_even[0] = 1
    source_commutator = mode * Q - Q * mode
    beta_raw = source_commutator[:, N]
    beta_odd = odd.T * beta_raw
    displacement_expected = beta_raw * eta_raw.T - eta_raw * beta_raw.T
    D_mode = odd.T * mode * even
    O_ground = _symmetrize(Q_odd - mu * mp.eye(N))
    O_values, _ = mp.eigsy(O_ground)
    if O_values[0] <= 0:
        raise Checkpoint069Error("locked pilot requires a positive odd ground shift")
    odd_beta_solve = mp.lu_solve(O_ground, beta_odd)
    boundary_x = (eta_even.T * x)[0]
    central_x = (e0_even.T * x)[0]
    odd_transport_residual = O_ground * (D_mode * x) + boundary_x * beta_odd
    D_nonzero = D_mode[:, 1:]
    template = mp.matrix(N + 1, 1)
    template[1:, 0] = mp.lu_solve(D_nonzero, -odd_beta_solve)
    template[0] = 1 - (eta_even[1:, :].T * template[1:, :])[0]
    template_boundary = (eta_even.T * template)[0]
    p_mu_kappaT_Phi = (kappa.T * template)[0]
    if p_mu_kappaT_Phi == 0:
        raise Checkpoint069Error("ground template is orthogonal to the anchor")
    boundary_from_anchor = 1 / p_mu_kappaT_Phi
    x_from_odd = boundary_from_anchor * template
    Phi_mu_central = (e0_even.T * template)[0]
    if Phi_mu_central <= 0:
        raise Checkpoint069Error("source ground central coefficient must be positive")
    det_odd_ground = mp.det(O_ground)
    boundary_cofactor = (eta_even.T * H_adjugate * e0_even)[0]
    c_from_odd = (
        det_odd_ground * abs(p_mu_kappaT_Phi) ** 2 / Phi_mu_central
    )

    F_basis = base._orthogonal_complement(w)
    WF = W * F_basis
    C_even = _symmetrize(F_basis.T * B_u * F_basis)
    y_R = kappa - (d / residual_r) * W * w
    e_R = (Q_even - u * mp.eye(N + 1)) * y_R
    e_F = WF.T * e_R
    g_F = F_basis.T * B_u * w
    even_short = _symmetrize(C_even - e_F * e_F.T / d)
    C_even_values, _ = mp.eigsy(C_even)
    even_short_values, _ = mp.eigsy(even_short)
    even_basis = mp.matrix(N)
    even_basis[:, 0] = w
    even_basis[:, 1:] = F_basis
    B_u_in_wF = even_basis.T * B_u * even_basis

    x_D = D_mode * kappa
    x_D_norm = _norm(x_D)
    if x_D_norm <= 0:
        raise Checkpoint069Error("locked odd Schur gate requires D*kappa nonzero")
    y_D = x_D / x_D_norm
    G_odd = base._orthogonal_complement(y_D)
    delta_kappa = (eta_even.T * kappa)[0]
    s_q_combined = D_mode * ((Q_even - q * mp.eye(N + 1)) * kappa) - (
        delta_kappa * beta_odd
    )
    s_q_direct = (Q_odd - q * mp.eye(N)) * x_D
    a_q = (x_D.T * s_q_combined)[0] / x_D_norm**2
    c_q = G_odd.T * s_q_combined / x_D_norm
    A_q_odd = _symmetrize(G_odd.T * (Q_odd - q * mp.eye(N)) * G_odd)
    A_u_odd = _symmetrize(A_q_odd + d * mp.eye(N - 1))
    A_u_odd_values, _ = mp.eigsy(A_u_odd)
    odd_schur_scalar = a_q + d - (c_q.T * _inverse(A_u_odd) * c_q)[0]
    odd_basis = mp.matrix(N)
    odd_basis[:, 0] = y_D
    odd_basis[:, 1:] = G_odd
    odd_block_reconstruction = mp.matrix(N)
    odd_block_reconstruction[0, 0] = a_q + d
    odd_block_reconstruction[0, 1:] = c_q.T
    odd_block_reconstruction[1:, 0] = c_q
    odd_block_reconstruction[1:, 1:] = A_u_odd
    odd_direct_basis = odd_basis.T * odd_u * odd_basis

    g_ground = H * kappa
    gauges: dict[str, Any] = {}
    gauge_live: list[dict[str, mp.mpf]] = []
    for label, rho_text, s_text in GAUGES:
        rho_fraction = Fraction(rho_text)
        s_fraction = Fraction(s_text)
        rho = mp.mpf(rho_fraction.numerator) / rho_fraction.denominator
        s = mp.mpf(s_fraction.numerator) / s_fraction.denominator
        gauge, live_gauge = _bordered_gauge(
            label,
            rho,
            s,
            H,
            Pi_even,
            kappa,
            g_ground,
            E_direct,
            q - mu,
        )
        gauges[label] = gauge
        gauge_live.append(live_gauge)

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
        "Q_even": Q_even,
        "Q_odd": Q_odd,
        "source_commutator_beta_raw": beta_raw,
        "source_commutator_beta_odd": beta_odd,
        "source_displacement_matrix": source_commutator,
        "source_displacement_expected_beta_eta_minus_eta_beta": displacement_expected,
        "source_displacement_residual": _max_abs(
            source_commutator - displacement_expected
        ),
        "full_ambient_Pi_M": Pi_raw,
        "Pi_M_even": Pi_even,
        "Pi_M_odd": Pi_odd,
        "Pi_M_projector_defect": _max_abs(Pi_raw * Pi_raw - Pi_raw),
        "mode_Pi_M_commutator_defect": _max_abs(mode * Pi_raw - Pi_raw * mode),
        "inversion_Pi_M_commutator_defect": _max_abs(J * Pi_raw - Pi_raw * J),
        "natural_even_basis_orthonormality_defect": _max_abs(
            even.T * even - mp.eye(N + 1)
        ),
        "natural_odd_basis_orthonormality_defect": _max_abs(
            odd.T * odd - mp.eye(N)
        ),
        "parity_basis_cross_defect": _max_abs(even.T * odd),
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
        "projected_state_norm_a": mp.mpf(normalization["projected_state_norm"]),
        "projection_error_e": mp.mpf(normalization["projection_error"]),
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
    ritz_sign_gates = {
        "q": q,
        "residual_vector_b": b,
        "residual_r": residual_r,
        "residual_direction_w": w,
        "c_R": c_R,
        "two_vector_ritz_u": u,
        "d_q_minus_u": d,
        "ritz_characteristic_residual": (
            (q - u) * (c_R - u) - residual_r**2
        ),
        "B_q": B_q,
        "B_u": B_u,
        "B_u_eigenvalues": B_u_values,
        "ritz_moment_w_B_u_w": ritz_moment,
        "ritz_moment_residual_d_times_m_minus_r2": d * ritz_moment
        - residual_r**2,
        "F_basis_in_anchor_complement": F_basis,
        "WF_even_transverse_basis": WF,
        "B_u_in_w_plus_F_basis": B_u_in_wF,
        "C_even_transverse": C_even,
        "C_even_transverse_eigenvalues": C_even_values,
        "ritz_vector_y_R": y_R,
        "ritz_residual_e": e_R,
        "ritz_residual_e_F": e_F,
        "shift_invariant_cross_g_F": g_F,
        "e_F_plus_d_over_r_g_F_residual": _norm(
            e_F + (d / residual_r) * g_F
        ),
        "sharp_even_short_C_minus_eeT_over_d": even_short,
        "sharp_even_short_eigenvalues": even_short_values,
        "sharp_even_short_minimum": even_short_values[0],
        "B_u_positive_iff_sharp_even_short_positive": True,
        "mode_derivative_even_to_odd": D_mode,
        "x_Dmode_kappa": x_D,
        "x_Dmode_kappa_norm": x_D_norm,
        "delta_kappa_etaT_kappa": delta_kappa,
        "s_q_combined_Dresidual_minus_delta_beta": s_q_combined,
        "s_q_direct_Qodd_minus_q_times_x": s_q_direct,
        "s_q_source_identity_residual": _norm(s_q_combined - s_q_direct),
        "odd_y_x_over_norm": y_D,
        "odd_transverse_G_basis": G_odd,
        "odd_a_q": a_q,
        "odd_c_q": c_q,
        "odd_A_q": A_q_odd,
        "odd_A_u_Aq_plus_dI": A_u_odd,
        "odd_A_u_eigenvalues": A_u_odd_values,
        "odd_schur_scalar_at_u": odd_schur_scalar,
        "odd_block_from_transverse_Schur_data": odd_block_reconstruction,
        "odd_block_direct_in_y_plus_G_basis": odd_direct_basis,
        "odd_block_reconstruction_defect": _max_abs(
            odd_block_reconstruction - odd_direct_basis
        ),
        "odd_shifted_eigenvalues_at_u": odd_u_values,
        "odd_positive_iff_A_u_and_schur_scalar_positive": True,
    }
    exact_ground_adjugate = {
        "complete_even_eigenvalues": even_values,
        "true_even_ground_mu": mu,
        "ground_gap": even_values[1] - even_values[0],
        "u_minus_mu_h": h,
        "H_Q_even_minus_muI": H,
        "H_eigenvalues": H_values,
        "H_determinant": mp.det(H),
        "H_kappa": g_ground,
        "D_ground_B_u_plus_hI": D_ground,
        "D_ground_eigenvalues": D_ground_values,
        "ground_correction_z": z,
        "coefficient_normalized_ground_x": x,
        "coefficient_normalization_kappaT_x": (kappa.T * x)[0],
        "unit_ground_scale_gamma": x_unit_scale,
        "unit_ground_x": x_unit,
        "fresh_eigsy_unit_ground": fresh_ground,
        "fresh_ground_vector_defect": _norm(x_unit - fresh_ground),
        "ground_residual_Hx_norm": _norm(H * x),
        "ground_Feshbach_vector_residual": _norm(D_ground * z - b),
        "ground_Feshbach_scalar_residual": q - mu - (b.T * z)[0],
        "literal_adjugate_C": H_adjugate,
        "adjugate_left_residual_HC": _max_abs(H * H_adjugate),
        "adjugate_right_residual_CH": _max_abs(H_adjugate * H),
        "cofactor_column_C_kappa": cofactor_column,
        "c_kappaT_C_kappa": c_adjugate,
        "c_det_D_ground": c_det_complement,
        "c_adjugate_minus_detD": c_adjugate - c_det_complement,
        "x_from_cofactor_column": x_from_cofactor,
        "x_cofactor_residual": _norm(x_from_cofactor - x),
        "rank_one_adjugate_c_xxT": adjugate_rank_one,
        "rank_one_adjugate_residual": _max_abs(H_adjugate - adjugate_rank_one),
        "singular_even_inverse_used": False,
    }
    projective_minor_response = {
        "K_M_WT_Pi_even_W": K_M,
        "K_M_eigenvalues": K_values,
        "projective_vector_kappa_minus_x_equals_Wz": projective_vector,
        "projective_vector_minus_Wz_residual": _norm(projective_vector - W * z),
        "E_direct_projective_low_energy": E_direct,
        "E_zT_K_M_z": E_zKz,
        "E_direct_minus_zKz": E_direct - E_zKz,
        "k00_kappaT_Pi_kappa": k00,
        "ground_low_mass_xT_Pi_x": ground_low_mass,
        "low_cross_kappaT_Pi_x": low_cross,
        "S_unbordered_singular_derivative_adjugate": S_adjugate,
        "S_unbordered_singular_derivative_column_replacement": S_columns,
        "S_derivative_residual": S_adjugate - S_columns,
        "S_over_c_ground_low_mass": S_adjugate / c_adjugate,
        "S_over_c_minus_ground_low_mass": S_adjugate / c_adjugate
        - ground_low_mass,
        "v_plus_kappa_plus_Pi_kappa": v_plus,
        "v_minus_kappa_minus_Pi_kappa": v_minus,
        "R_plus_rank_one_minor_derivative": R_plus,
        "R_minus_rank_one_minor_derivative": R_minus,
        "cross_from_Rplus_minus_Rminus_over_4c": cross_from_polarization,
        "cross_polarization_residual": cross_from_polarization - low_cross,
        "E_from_minor_decomposition": E_minor,
        "E_minor_decomposition_residual": E_minor - E_direct,
        "mixed_mode_minor_basis_is_Ran_Pi": True,
        "mixed_mode_minor_count": len(mixed_mode_minors),
        "mixed_mode_minors": mixed_mode_minors,
        "mixed_mode_combined_absolute_square_sum": mixed_mode_sum,
        "E_from_mixed_mode_minors": E_mixed_mode_minors,
        "E_mixed_mode_minor_residual": E_mixed_mode_minors - E_direct,
        "unbordered_S_is_ground_mass_not_projective_E": True,
        "S_M_normalized_unbordered_response": S_M,
        "unbordered_S_over_c_minus_E": S_adjugate / c_adjugate - E_direct,
        "R_high_I_minus_Pi": R_high,
        "total_projective_squared_norm": total_projective_squared,
        "high_kappa_mass": high_kappa,
        "high_ground_mass": high_ground,
        "high_cross_kappaT_R_x": high_cross,
        "high_projective_squared_norm": high_projective,
        "E_from_corrected_high_cross_plus_sign": E_high_corrected,
        "corrected_high_cross_identity_residual": E_high_corrected - E_direct,
        "wrong_high_cross_minus_sign_value": E_high_wrong_sign,
        "wrong_high_cross_minus_sign_rejected": True,
        "ground_difference_y_x_minus_kappa": y_ground_minus_anchor,
        "note_high_cross_kappaT_R_times_x_minus_kappa": note_high_cross,
        "S_M_minus_k00": S_minus_k00,
        "corrected_identity_rhs_E_minus_2_high_cross": note_high_rhs,
        "S_minus_k00_identity_residual": S_minus_k00 - note_high_rhs,
        "E_from_corrected_note_high_cross": E_from_note_high_cross,
        "corrected_note_high_cross_E_residual": E_from_note_high_cross
        - E_direct,
        "E_from_wrong_opposite_note_high_cross_sign": E_from_wrong_note_sign,
        "wrong_opposite_note_high_cross_sign_rejected": True,
        "high_anchor_tail_norm": high_anchor_tail_norm,
        "absolute_high_cross_bound_2_tail_norm_times_correction_norm": (
            note_high_absolute_bound
        ),
        "absolute_difference_E_minus_SminusK00": abs(E_direct - S_minus_k00),
        "absolute_high_cross_bound_slack": note_high_absolute_bound
        - abs(E_direct - S_minus_k00),
    }
    odd_source_reconstruction = {
        "eta_even_boundary_vector": eta_even,
        "e0_even": e0_even,
        "mode_derivative_even_to_odd": D_mode,
        "O_ground_Q_odd_minus_muI": O_ground,
        "O_ground_eigenvalues": O_values,
        "beta_odd": beta_odd,
        "O_ground_inverse_beta": odd_beta_solve,
        "boundary_delta_x": boundary_x,
        "central_coefficient_e0T_x": central_x,
        "odd_transport_O_Dx_plus_delta_beta": odd_transport_residual,
        "odd_transport_residual_norm": _norm(odd_transport_residual),
        "boundary_normalized_ground_template": template,
        "Phi_mu_boundary_normalized_ground": template,
        "template_boundary_etaT_template": template_boundary,
        "p_mu_kappaT_Phi_mu": p_mu_kappaT_Phi,
        "Phi_mu_central_e0T_Phi_mu": Phi_mu_central,
        "boundary_scalar_from_anchor": boundary_from_anchor,
        "x_reconstructed_from_odd_resolvent": x_from_odd,
        "odd_resolvent_ground_reconstruction_residual": _norm(x_from_odd - x),
        "det_O_ground": det_odd_ground,
        "boundary_cofactor_delta_adjH_e0": boundary_cofactor,
        "source_characteristic_identity_residual": det_odd_ground
        - boundary_cofactor,
        "c_from_odd_det_over_boundary_times_central": c_from_odd,
        "c_source_factorization_detO_abs_p_squared_over_central": c_from_odd,
        "c_odd_factorization_residual": c_from_odd - c_adjugate,
        "singular_boundary_Weyl_scalar_evaluated_separately": False,
    }
    bordered_positive_response = {
        "g_H_kappa": g_ground,
        "alpha_0_expected_q_minus_mu": q - mu,
        "target_E": E_direct,
        "finite_tau": FINITE_TAU,
        "gauge_count": len(GAUGES),
        "gauge_order": [item[0] for item in GAUGES],
        "gauges": gauges,
        "rank_one_bordered_readout_source_commutator_preserved": False,
        "full_ambient_Pi_homotopy_source_commutator_preserved": True,
        "finite_secant_is_not_an_unbounded_rate": True,
    }

    raw_sections = {
        "source_guard": source_guard,
        "normalization_regression": normalization_regression,
        "ritz_sign_gates": ritz_sign_gates,
        "exact_ground_adjugate": exact_ground_adjugate,
        "projective_minor_response": projective_minor_response,
        "odd_source_reconstruction": odd_source_reconstruction,
        "bordered_positive_response": bordered_positive_response,
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
            "B_min": B_u_values[0],
            "even_short_min": even_short_values[0],
            "odd_transverse_min": A_u_odd_values[0],
            "odd_schur": odd_schur_scalar,
            "odd_min": odd_u_values[0],
            "ritz_characteristic_residual": (q - u) * (c_R - u)
            - residual_r**2,
            "ritz_moment_residual": d * ritz_moment - residual_r**2,
            "even_cross_residual": _norm(e_F + (d / residual_r) * g_F),
            "odd_source_residual": _norm(s_q_combined - s_q_direct),
            "odd_block_residual": _max_abs(
                odd_block_reconstruction - odd_direct_basis
            ),
        },
        "ground": {
            "gap": even_values[1] - even_values[0],
            "H_min_abs": abs(H_values[0]),
            "D_min": D_ground_values[0],
            "ground_vector_residual": _norm(H * x),
            "ground_fresh_residual": _norm(x_unit - fresh_ground),
            "feshbach_vector_residual": _norm(D_ground * z - b),
            "feshbach_scalar_residual": q - mu - (b.T * z)[0],
            "adjugate_left_residual": _max_abs(H * H_adjugate),
            "adjugate_right_residual": _max_abs(H_adjugate * H),
            "c_residual": c_adjugate - c_det_complement,
            "cofactor_residual": _norm(x_from_cofactor - x),
            "rank_one_residual": _max_abs(H_adjugate - adjugate_rank_one),
        },
        "minor": {
            "E": E_direct,
            "direct_residual": E_direct - E_zKz,
            "S_residual": S_adjugate - S_columns,
            "ground_mass_residual": S_adjugate / c_adjugate - ground_low_mass,
            "cross_residual": cross_from_polarization - low_cross,
            "minor_residual": E_minor - E_direct,
            "mixed_minor_residual": E_mixed_mode_minors - E_direct,
            "high_residual": E_high_corrected - E_direct,
            "wrong_sign_difference": E_high_wrong_sign - E_direct,
            "note_high_residual": S_minus_k00 - note_high_rhs,
            "note_high_E_residual": E_from_note_high_cross - E_direct,
            "wrong_note_sign_difference": E_from_wrong_note_sign - E_direct,
            "high_bound_slack": note_high_absolute_bound
            - abs(E_direct - S_minus_k00),
        },
        "odd": {
            "positive_min": O_values[0],
            "transport_residual": _norm(odd_transport_residual),
            "template_boundary_residual": template_boundary - 1,
            "ground_reconstruction_residual": _norm(x_from_odd - x),
            "source_characteristic_residual": det_odd_ground - boundary_cofactor,
            "c_residual": c_from_odd - c_adjugate,
        },
        "gauges": gauge_live,
    }
    return sections, live


def _validate_live(live: dict[str, Any], dps: int) -> None:
    tolerance = mp.power(10, -max(12, dps // 3))
    construction_tolerance = mp.power(10, -max(18, dps // 2))
    source = live["source"]
    if source["base_terminal_state"] != TERMINAL_STATE:
        raise Checkpoint069Error("unexpected base terminal state")
    if source["prime_power_inventory"] != [2, 3, 4]:
        raise Checkpoint069Error("prime-power inventory or inclusive endpoint changed")
    if source["source_prime_block_sign"] != "minus":
        raise Checkpoint069Error("source prime-block minus sign changed")
    for field in (
        "full_Q_reconstruction_defect",
        "source_displacement_residual",
        "Pi_M_projector_defect",
        "mode_Pi_M_commutator_defect",
        "inversion_Pi_M_commutator_defect",
        "natural_even_basis_orthonormality_defect",
        "natural_odd_basis_orthonormality_defect",
        "parity_basis_cross_defect",
        "source_hermitian_defect",
        "source_inversion_commutator_defect",
    ):
        if abs(source[field]) > construction_tolerance:
            raise Checkpoint069Error(f"source construction failed: {field}")
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
        raise Checkpoint069Error("forbidden source or parameter path")

    normalization = live["normalization"]
    if normalization["unit_normalized_replacement_allowed"]:
        raise Checkpoint069Error("unit-normalized replacement was not rejected")
    if normalization["unit_normalization_limiting_scalar_difference"] == 0:
        raise Checkpoint069Error("normalization regression did not change the limit")

    ritz = live["ritz"]
    if not (ritz["u"] < ritz["q"] and ritz["d"] > 0 and ritz["r"] > 0):
        raise Checkpoint069Error("invalid lower two-vector Ritz geometry")
    for field in (
        "B_min",
        "even_short_min",
        "odd_transverse_min",
        "odd_schur",
        "odd_min",
    ):
        if ritz[field] <= 0:
            raise Checkpoint069Error(f"nonpositive shifted sign gate: {field}")
    for field in (
        "ritz_characteristic_residual",
        "ritz_moment_residual",
        "even_cross_residual",
        "odd_source_residual",
        "odd_block_residual",
    ):
        if abs(ritz[field]) > construction_tolerance:
            raise Checkpoint069Error(f"Ritz sign identity failed: {field}")

    ground = live["ground"]
    if ground["gap"] <= 0 or ground["D_min"] <= 0:
        raise Checkpoint069Error("fresh even ground is not simple")
    for field in (
        "H_min_abs",
        "ground_vector_residual",
        "ground_fresh_residual",
        "feshbach_vector_residual",
        "feshbach_scalar_residual",
        "adjugate_left_residual",
        "adjugate_right_residual",
        "c_residual",
        "cofactor_residual",
        "rank_one_residual",
    ):
        if abs(ground[field]) > construction_tolerance:
            raise Checkpoint069Error(f"ground adjugate identity failed: {field}")

    minor = live["minor"]
    if minor["E"] < -tolerance:
        raise Checkpoint069Error("projective low energy became negative")
    for field in (
        "direct_residual",
        "S_residual",
        "ground_mass_residual",
        "cross_residual",
        "minor_residual",
        "mixed_minor_residual",
        "high_residual",
        "note_high_residual",
        "note_high_E_residual",
    ):
        if abs(minor[field]) > construction_tolerance:
            raise Checkpoint069Error(f"projective minor identity failed: {field}")
    if abs(minor["wrong_sign_difference"]) <= construction_tolerance:
        raise Checkpoint069Error("wrong high-cross sign was not rejected")
    if abs(minor["wrong_note_sign_difference"]) <= construction_tolerance:
        raise Checkpoint069Error("wrong note high-cross sign was not rejected")
    if minor["high_bound_slack"] < -tolerance:
        raise Checkpoint069Error("high-cross absolute bound failed")

    odd_live = live["odd"]
    if odd_live["positive_min"] <= 0:
        raise Checkpoint069Error("odd ground shift is nonpositive")
    for field in (
        "transport_residual",
        "template_boundary_residual",
        "ground_reconstruction_residual",
        "source_characteristic_residual",
        "c_residual",
    ):
        if abs(odd_live[field]) > construction_tolerance:
            raise Checkpoint069Error(f"odd source reconstruction failed: {field}")

    if len(live["gauges"]) < 2:
        raise Checkpoint069Error("at least two bordered gauges are mandatory")
    first_response: mp.matrix | None = None
    for gauge in live["gauges"]:
        if gauge["positive_minimum"] <= 0:
            raise Checkpoint069Error("bordered positive matrix became nonpositive")
        for field in (
            "alpha_residual",
            "D_residual",
            "N_residual",
            "derivative_residual",
            "finite_identity_residual",
        ):
            if abs(gauge[field]) > tolerance:
                raise Checkpoint069Error(f"bordered gauge identity failed: {field}")
        for field in (
            "secant_lower_slack",
            "secant_upper_slack",
            "phi_lower_slack",
            "phi_upper_slack",
        ):
            if gauge[field] < -tolerance:
                raise Checkpoint069Error(f"bordered gauge bound failed: {field}")
        if first_response is None:
            first_response = gauge["response_vector"]
        elif _norm(gauge["response_vector"] - first_response) > tolerance:
            raise Checkpoint069Error("bordered rho gauges changed the target vector")


def produce(lambda_text: str, N: int, M: int, dps: int) -> dict[str, Any]:
    if not isinstance(lambda_text, str):
        raise TypeError("lambda must be exact text; binary64 is forbidden")
    if isinstance(N, bool) or not isinstance(N, int):
        raise TypeError("N must be an exact integer")
    if isinstance(M, bool) or not isinstance(M, int):
        raise TypeError("M must be an exact integer")
    if isinstance(dps, bool) or not isinstance(dps, int):
        raise TypeError("precision must be an exact integer")
    try:
        lambda_fraction = Fraction(lambda_text)
    except (ValueError, ZeroDivisionError) as exc:
        raise Checkpoint069Error("lambda must be exact rational text") from exc
    if lambda_fraction != 2 or N != 4 or M != LOCKED_M:
        raise Checkpoint069Error(
            "checkpoint 0.69 is locked to lambda=2, N=4, M=2"
        )
    if not (1 <= M < N):
        raise Checkpoint069Error("projective low cutoff must satisfy 1<=M<N")
    if dps not in (40, 80):
        raise Checkpoint069Error("checkpoint 0.69 permits only 40 or 80 decimal digits")

    mp.mp.dps = dps
    base_payload = base.produce(lambda_text, N, BASE_T_TEXT, dps)
    sections, live = _compute_sections(base_payload, M, dps)
    _validate_live(live, dps)
    inputs = {
        "lambda": lambda_text,
        "N": N,
        "M": M,
        "base_checkpoint064_T": BASE_T_TEXT,
        "precision_decimal_digits": dps,
        "L": base_payload["inputs"]["L"],
        "finite_bordered_tau": "1",
        "bordered_gauges": [
            {"label": label, "rho": rho, "s": s} for label, rho, s in GAUGES
        ],
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
    parser.add_argument("--dps", type=int, required=True)
    parser.add_argument("--output", type=Path, required=True)
    arguments = parser.parse_args()
    result = produce(arguments.lambda_text, arguments.N, arguments.M, arguments.dps)
    text = json.dumps(result, indent=2, sort_keys=True, allow_nan=False) + "\n"
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(text, encoding="utf-8")
    print(text, end="")


if __name__ == "__main__":
    main()
