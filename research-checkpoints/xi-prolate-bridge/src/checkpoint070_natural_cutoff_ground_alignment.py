#!/usr/bin/env python3
"""Checkpoint 0.70 natural-cutoff ground-alignment producer.

This producer is locked to ``lambda=2, N=8, M=2`` at 40 or 80 decimal
digits and to a 60-dimensional even Legendre prolate truncation.  It builds
the Weil matrix, source-normalized prolate anchor, true finite even ground,
and the pole--archimedean--minus-prime discrepancy normal form live from
source parameters.  No stored matrix, eigensystem, artifact, or zeta-zero
table is read.

The central diagnostic uses the *same combined shifted inverse* for the
archimedean-tail and weighted-PNT-discrepancy forcing vectors.  Their
projected responses are subtracted before a norm is taken.  Inverting the
two blocks separately would not represent the ground alignment and is not
done here.

All outputs are arbitrary-precision point values.  They are finite
diagnostics, not interval enclosures, an asymptotic alignment estimate,
equation (5.2), a locally uniform determinant theorem, or an RH proof.
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
import pnt_discrepancy_normal_form as pnt
from prolate_state import projected_even_state, source_combination
from weil_matrix import blocks_direct, blocks_split, inversion, max_abs, parse_decimal


ROOT = Path(__file__).resolve().parents[1]
SCHEMA = "xi-prolate-checkpoint070-natural-cutoff-ground-alignment-v1"
CHECKPOINT_VERSION = "0.70.0-natural-cutoff-ground-alignment-point"
TERMINAL_STATE = "P0_INVALIDATED"
LOCKED_LAMBDA = Fraction(2, 1)
LOCKED_N = 8
LOCKED_M = 2
PROLATE_BASIS_SIZE = 60


DEPENDENCIES = (
    "P0_SOURCE_LOCK.json",
    "P0_NORMALIZATION_AUDIT.md",
    "WEIGHTED_PNT_DISCREPANCY_NORMAL_FORM_SOURCE_LOCK.json",
    "DIRECT_RH_ATTACK.md",
    "FALSE_SHORTCUTS.md",
    "vendor/CCM-ZST-2511.22755v1.pdf",
    "vendor/CCM-PROLATE-2310.18423v2.pdf",
    "notes/SOURCE_COMPATIBLE_GROUND_PROJECTIVE_RESPONSE.md",
    "notes/WEIGHTED_PNT_DISCREPANCY_NORMAL_FORM.md",
    "notes/CHEBYSHEV_ERROR_REWRITE.md",
    "notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md",
    "notes/RITZ_MOMENT_SELF_REGULARIZED_TRANSFER.md",
    "notes/NATURAL_CUTOFF_SIGNED_GROUND_ALIGNMENT.md",
    "src/checkpoint064_reciprocal_secant.py",
    "src/checkpoint070_natural_cutoff_ground_alignment.py",
    "src/pnt_discrepancy_normal_form.py",
    "src/prolate_state.py",
    "src/weil_matrix.py",
    "verifier/checkpoint064_reciprocal_secant_replay.py",
    "verifier/checkpoint070_natural_cutoff_ground_alignment_replay.py",
    "verifier/independent_replay.py",
    "tests/test_checkpoint070_natural_cutoff_ground_alignment.py",
    "tests/test_natural_cutoff_signed_ground_alignment.py",
)

PINNED_SOURCE_SHA256 = dict(base.PINNED_SOURCE_SHA256)

LOCKED_CONVENTIONS = dict(base.LOCKED_CONVENTIONS)
LOCKED_CONVENTIONS.update(
    {
        "checkpoint070_source_point": (
            "lambda=2, N=8, M=2 only; 40 or 80 decimal digits; "
            "prolate even Legendre basis size 60"
        ),
        "natural_cutoff": (
            "M=ceil(lambda)=2; Pi_M is the full ambient centered raw-mode "
            "projector |n|<=M before parity compression"
        ),
        "ground_normalization": (
            "x is the coefficient-normalized finite even ground: "
            "<kappa,x>=1; no unit replacement of the source anchor"
        ),
        "normal_form": (
            "Q=c_* I+A_tail-T_D with the complete signed discrepancy; "
            "all block responses use the common full B_mu inverse"
        ),
        "kernel_boundary": (
            "D(0)=0 and every response correlation has C(0)=C(L)=0; "
            "a prime power at lambda^2 is retained although C(L) kills it"
        ),
    }
)

LOCKED_FORMULAS = {
    "source_normal_form": "Q=c_* I+A_tail-T_D",
    "tail_primitive": (
        "H_tail(t)=integral_t^infinity exp(-5u/2)/(1-exp(-2u)) du="
        "0.5*log((1+exp(-t/2))/(1-exp(-t/2)))+atan(exp(-t/2))-2*exp(-t/2)"
    ),
    "alignment_discrepancy": (
        "F_align(t)=D(t)-H_tail(t), D(t)=sum_(1<n<=exp(t)) "
        "Lambda(n)/sqrt(n)-2*(exp(t/2)-1)"
    ),
    "boundary_discrepancy": (
        "H_0(t)=integral_t^infinity exp(-u/2)/(1-exp(-2u)) du; "
        "F_boundary(t)=D(t)-H_0(t); "
        "F_align=F_boundary+2*exp(-t/2)"
    ),
    "chebyshev_kernel": (
        "G(t)=exp(t)-psi_C(exp(t))-0.5*log(1-exp(-2t)); "
        "dF_align=-exp(-t/2)*dG including every prime-power atom"
    ),
    "response_equivalence": (
        "for C(0)=C(L)=0: integral_0^L F_align*C'="
        "-integral_0^L G*(exp(-t/2)*C)'="
        "integral_0^L exp(-t/2)*C dt-integral_[0,L] C dF_boundary"
    ),
    "ground_block": (
        "K=kappa^perp; b=P_K(A_tail-T_D)kappa; "
        "B_mu=P_K(Q-mu I)P_K; z=B_mu^(-1)b; x=kappa-z"
    ),
    "resolved_split": (
        "z_A=B_mu^(-1)P_K A_tail kappa; "
        "z_D=B_mu^(-1)P_K T_D kappa; z=z_A-z_D; "
        "separate block inverses are forbidden"
    ),
    "anchor_transverse_projector": (
        "p=Pi_M kappa; k00=<p,p>; P_L=Pi_M-p*p^T/k00"
    ),
    "alignment": (
        "A_M=||P_L x||^2=b^T B_mu^(-1)P_L B_mu^(-1)b="
        "||P_L(z_A-z_D)||^2"
    ),
    "adjugate_response": (
        "S_M=tr(Pi_M*adj(Q_+-mu I))/(kappa^T adj(Q_+-mu I) kappa)="
        "<x,Pi_M x>"
    ),
    "high_cross": (
        "R=I-Pi_M; h=<R kappa,R(x-kappa)>; "
        "S_M-k00=A_M+|h|^2/k00-2*Re(h)"
    ),
    "ritz_constant": (
        "||x-kappa||^2=||z||^2<=C_R(delta)^2; "
        "C_R(delta), not C_R(delta)^2, bounds ||z|| and the linear high cross"
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
    "producer_source_paths": (
        "live direct source quadrature, live split source formulas, and "
        "live weighted-PNT-discrepancy normal-form assembly"
    ),
    "producer_prolate_path": (
        "live source-normalized 60-mode even Legendre recurrence"
    ),
    "producer_ground_path": (
        "fresh finite even eigensolve plus common-inverse Feshbach replay"
    ),
    "shared_arithmetic_limitation": (
        "producer and verifier share mpmath transcendental point arithmetic"
    ),
}

LIMITATIONS = [
    "finite arbitrary-precision point diagnostic, not an interval or ball enclosure",
    "producer and verifier share mpmath transcendental arithmetic and linear algebra",
    "the 60-mode prolate Galerkin truncation has no outward tail enclosure in this producer",
    "the Gevrey cutoff theorem has noncomputed asymptotic thresholds and is not certified by this finite pilot",
    "the true finite ground and strict shifted signs are freshly computed point diagnostics",
    "the alignment response is not proved to decay on an unbounded arithmetic schedule",
    "separate A_tail and T_D norms are diagnostic; triangle bounds do not preserve their cancellation",
    "no real-axis eigenvalue agreement is promoted to locally uniform determinant convergence",
    "no conclusion about DIRECT_RH_ATTACK equation (5.2), a new Lambda bound, or RH is claimed",
]


class Checkpoint070Error(ValueError):
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
            raise Checkpoint070Error(f"pinned source hash mismatch: {name}")


def dependency_hashes() -> dict[str, str]:
    actual = {name: _sha256_file(ROOT / name) for name in DEPENDENCIES}
    validate_pinned_source_hashes(actual)
    return actual


def _raw_hash(value: Any) -> str:
    raw = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("ascii")
    return hashlib.sha256(raw).hexdigest()


def _require_integer(value: Any, label: str) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{label} must be an exact integer; binary64 is forbidden")
    return value


def _dot(x: mp.matrix, A: mp.matrix, y: mp.matrix) -> mp.mpf:
    return (x.T * A * y)[0]


def _norm(x: mp.matrix) -> mp.mpf:
    return mp.sqrt(mp.fsum(abs(x[i]) ** 2 for i in range(x.rows)))


def _frobenius(A: mp.matrix) -> mp.mpf:
    return mp.sqrt(
        mp.fsum(abs(A[i, j]) ** 2 for i in range(A.rows) for j in range(A.cols))
    )


def _trace(A: mp.matrix) -> mp.mpf:
    return mp.fsum(A[i, i] for i in range(min(A.rows, A.cols)))


def _symmetrize(A: mp.matrix) -> mp.matrix:
    return (A + A.T) / 2


def _inverse(A: mp.matrix) -> mp.matrix:
    if A.rows != A.cols:
        raise Checkpoint070Error("matrix inverse requires a square matrix")
    result = mp.matrix(A.rows)
    for j in range(A.rows):
        e = mp.matrix(A.rows, 1)
        e[j] = 1
        result[:, j] = mp.lu_solve(A, e)
    return result


def _sector_bases(N: int) -> tuple[mp.matrix, mp.matrix]:
    dimension = 2 * N + 1
    even = mp.matrix(dimension, N + 1)
    odd = mp.matrix(dimension, N)
    even[N, 0] = 1
    root2 = mp.sqrt(2)
    for n in range(1, N + 1):
        even[N - n, n] = even[N + n, n] = 1 / root2
        odd[N + n, n - 1] = 1 / root2
        odd[N - n, n - 1] = -1 / root2
    return even, odd


def _orthogonal_complement(unit: mp.matrix) -> mp.matrix:
    if unit.cols != 1 or unit.rows < 2:
        raise Checkpoint070Error("invalid unit vector for orthogonal complement")
    e0 = mp.matrix(unit.rows, 1)
    e0[0] = 1
    sign = 1 if unit[0] >= 0 else -1
    vector = unit + sign * e0
    denominator = (vector.T * vector)[0]
    if denominator == 0:
        raise Checkpoint070Error("Householder complement is singular")
    return (mp.eye(unit.rows) - 2 * vector * vector.T / denominator)[:, 1:]


def _minor(A: mp.matrix, deleted_row: int, deleted_column: int) -> mp.matrix:
    rows = [i for i in range(A.rows) if i != deleted_row]
    columns = [j for j in range(A.cols) if j != deleted_column]
    return mp.matrix([[A[i, j] for j in columns] for i in rows])


def _adjugate(A: mp.matrix) -> mp.matrix:
    if A.rows != A.cols:
        raise Checkpoint070Error("adjugate requires a square matrix")
    if A.rows == 1:
        return mp.matrix([[1]])
    result = mp.matrix(A.rows)
    for i in range(A.rows):
        for j in range(A.cols):
            result[j, i] = (-1) ** (i + j) * mp.det(_minor(A, i, j))
    return result


def _ritz_constants(delta: mp.mpf) -> tuple[mp.mpf, mp.mpf]:
    if delta < 0:
        raise Checkpoint070Error("Ritz ratio delta must be nonnegative")
    if delta == 0:
        return mp.mpf(1), mp.mpf(1)
    alpha = delta ** -2
    if alpha <= mp.mpf("0.5"):
        C_R_squared = 1 + 2 / alpha
    else:
        root = mp.sqrt(1 + 6 * alpha)
        C_R_squared = 1 + 4 * (2 * root - 1) / (3 * (root - 1) ** 2)
    C_R = mp.sqrt(C_R_squared)
    return C_R_squared, C_R


def _cancellation_record(left: mp.matrix, right: mp.matrix) -> dict[str, Any]:
    combined = left - right
    left_norm = _norm(left)
    right_norm = _norm(right)
    combined_norm = _norm(combined)
    triangle = left_norm + right_norm
    cross = (left.T * right)[0]
    return {
        "left_norm": left_norm,
        "right_norm": right_norm,
        "combined_norm": combined_norm,
        "left_norm_squared": left_norm**2,
        "right_norm_squared": right_norm**2,
        "combined_norm_squared": combined_norm**2,
        "signed_cross_inner_product": cross,
        "squared_norm_decomposition_residual": (
            combined_norm**2 - left_norm**2 - right_norm**2 + 2 * cross
        ),
        "combined_over_triangle_ratio": (
            combined_norm / triangle if triangle != 0 else None
        ),
        "triangle_loss_factor": (
            triangle / combined_norm if combined_norm != 0 else None
        ),
    }


def _encode(value: Any, digits: int) -> Any:
    if isinstance(value, mp.matrix):
        if value.cols == 1:
            return [mp.nstr(value[i], digits) for i in range(value.rows)]
        return [
            [mp.nstr(value[i, j], digits) for j in range(value.cols)]
            for i in range(value.rows)
        ]
    if isinstance(value, (mp.mpf, mp.mpc)):
        return mp.nstr(value, digits)
    if isinstance(value, dict):
        return {key: _encode(item, digits) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [_encode(item, digits) for item in value]
    if isinstance(value, (str, int, bool)) or value is None:
        return value
    raise TypeError(f"cannot serialize {type(value).__name__}")


def _validate_inputs(
    lambda_text: Any, N: Any, M: Any, dps: Any, basis_size: Any
) -> None:
    if not isinstance(lambda_text, str):
        raise TypeError("lambda must be exact text; binary64 is forbidden")
    try:
        exact_lambda = Fraction(lambda_text)
    except (ValueError, ZeroDivisionError) as exc:
        raise Checkpoint070Error("invalid exact lambda") from exc
    _require_integer(N, "N")
    _require_integer(M, "M")
    _require_integer(dps, "precision")
    _require_integer(basis_size, "prolate basis size")
    if exact_lambda != LOCKED_LAMBDA or N != LOCKED_N or M != LOCKED_M:
        raise Checkpoint070Error(
            "checkpoint 0.70 is locked to lambda=2, N=8, M=2"
        )
    if dps not in (40, 80):
        raise Checkpoint070Error("checkpoint 0.70 permits only 40 or 80 digits")
    if basis_size != PROLATE_BASIS_SIZE:
        raise Checkpoint070Error("checkpoint 0.70 prolate basis size must be 60")
    if not (1 <= M < N):
        raise Checkpoint070Error("natural cutoff requires 1<=M<N")


def _compute_sections(
    lambda_text: str, N: int, M: int, dps: int, basis_size: int
) -> dict[str, dict[str, Any]]:
    mp.mp.dps = dps
    lam = parse_decimal(lambda_text)
    exact_lam = Fraction(lambda_text)
    exact_lambda_squared = exact_lam * exact_lam
    L = 2 * mp.log(lam)
    dimension = 2 * N + 1
    tolerance = mp.power(10, -max(12, dps // 3))
    construction_tolerance = mp.power(10, -max(18, dps // 2))

    direct = blocks_direct(lambda_text, N, dps)
    split = blocks_split(lambda_text, N, dps)
    modes, terms, pole_direct, arch_direct, prime_direct, Q_direct = direct
    split_modes, split_terms, pole_split, arch_split, prime_split, Q_split = split
    if modes != split_modes or [n for n, _ in terms] != [n for n, _ in split_terms]:
        raise Checkpoint070Error("direct and split prime inventories disagree")

    normal_modes, inventory, normal, scalars = pnt._normal_form_blocks(
        lambda_text, N, dps
    )
    if modes != normal_modes or [n for n, _ in terms] != [
        n for n, _p, _exponent in inventory
    ]:
        raise Checkpoint070Error("normal-form prime inventory disagrees")

    c_identity = normal["normal_form_c_star_identity"]
    A_tail_full = normal["normal_form_A_tail"]
    T_atoms_full = normal["normal_form_T_D_atoms"]
    T_continuous_full = normal["normal_form_T_D_continuous"]
    T_D_full = normal["normal_form_T_D_equals_atoms_minus_continuous"]
    Q_normal = normal["normal_form_Q_equals_cI_plus_A_tail_minus_T_D"]
    direct_split_residual = Q_direct - Q_split
    direct_normal_residual = Q_direct - Q_normal

    J = inversion(N)
    even, odd = _sector_bases(N)
    Q_even = _symmetrize(even.T * Q_direct * even)
    Q_odd = _symmetrize(odd.T * Q_direct * odd)
    A_tail_even = _symmetrize(even.T * A_tail_full * even)
    T_D_even = _symmetrize(even.T * T_D_full * even)

    h_lambda = source_combination(lambda_text, basis_size, dps, "recurrence")
    projection = projected_even_state(h_lambda, N)
    kappa_full = projection["kappa"]
    kappa = even.T * kappa_full
    complement = _orthogonal_complement(kappa)
    complement_defect = max_abs(complement.T * complement - mp.eye(N))

    q = _dot(kappa, Q_even, kappa)
    b = complement.T * Q_even * kappa
    residual_r = _norm(b)
    A = _symmetrize(complement.T * Q_even * complement)

    even_values, even_vectors = mp.eigsy(Q_even)
    odd_values, _ = mp.eigsy(Q_odd)
    mu = even_values[0]
    xi = even_vectors[:, 0]
    if (kappa.T * xi)[0] < 0:
        xi = -xi
    gamma = (kappa.T * xi)[0]
    if gamma == 0:
        raise Checkpoint070Error("finite even ground is orthogonal to anchor")
    x = xi / gamma

    B_mu = _symmetrize(A - mu * mp.eye(N))
    B_mu_values, _ = mp.eigsy(B_mu)
    B_mu_inverse = _inverse(B_mu)
    z = B_mu_inverse * b
    x_feshbach = kappa - complement * z

    if residual_r <= 0:
        raise Checkpoint070Error("finite residual must be positive")
    w = b / residual_r
    a_w = _dot(w, A, w)
    u = (q + a_w - mp.sqrt((q - a_w) ** 2 + 4 * residual_r**2)) / 2
    d = q - u
    delta = d / residual_r
    B_u = _symmetrize(A - u * mp.eye(N))
    B_u_values, _ = mp.eigsy(B_u)
    odd_at_u = _symmetrize(Q_odd - u * mp.eye(N))
    odd_at_u_values, _ = mp.eigsy(odd_at_u)
    ritz_moment = d * _dot(w, B_u, w)
    C_R_squared, C_R = _ritz_constants(delta)

    Pi_full = mp.matrix(dimension)
    mode_operator = mp.matrix(dimension)
    for index, mode in enumerate(modes):
        mode_operator[index, index] = mode
        if abs(mode) <= M:
            Pi_full[index, index] = 1
    Pi = _symmetrize(even.T * Pi_full * even)
    p = Pi * kappa
    k00 = (p.T * p)[0]
    if k00 <= 0:
        raise Checkpoint070Error("cutoff-visible anchor vanished")
    P_L = _symmetrize(Pi - p * p.T / k00)
    R = mp.eye(N + 1) - Pi
    t_kappa = _norm(R * kappa)

    b_A = complement.T * A_tail_even * kappa
    b_T = complement.T * T_D_even * kappa
    b_combined = b_A - b_T
    z_A = B_mu_inverse * b_A
    z_T = B_mu_inverse * b_T
    z_split_subtraction = z_A - z_T
    z_combined_direct = B_mu_inverse * b_combined
    response_A = P_L * complement * z_A
    response_T = P_L * complement * z_T
    response_split_subtraction = response_A - response_T
    response_combined_direct = P_L * complement * z_combined_direct
    ground_alignment_vector = P_L * x
    alignment_energy = (ground_alignment_vector.T * ground_alignment_vector)[0]
    alignment_from_combined = (
        response_combined_direct.T * response_combined_direct
    )[0]

    ground_action_A = P_L * A_tail_even * x
    ground_action_T = P_L * T_D_even * x
    ground_action_split_subtraction = ground_action_A - ground_action_T
    ground_action_combined_direct = P_L * (A_tail_even - T_D_even) * x
    ground_action_eigen_rhs = (mu - scalars["c_star"]) * ground_alignment_vector

    H = _symmetrize(Q_even - mu * mp.eye(N + 1))
    adjugate_H = _adjugate(H)
    c_kappa = _dot(kappa, adjugate_H, kappa)
    if c_kappa == 0:
        raise Checkpoint070Error("ground cofactor normalization vanished")
    S_numerator = _trace(Pi * adjugate_H)
    S_M = S_numerator / c_kappa
    S_state = _dot(x, Pi, x)
    alignment_adjugate_numerator = _trace(P_L * adjugate_H)
    alignment_adjugate_ratio = alignment_adjugate_numerator / c_kappa
    Pi_x = Pi * x
    low_wedge_squared = k00 * (Pi_x.T * Pi_x)[0] - abs((p.T * Pi_x)[0]) ** 2
    low_wedge_ratio = low_wedge_squared / k00
    E_M = _norm(Pi * (x - kappa)) ** 2
    high_cross = (R * kappa).T * (R * (x - kappa))
    high_cross = high_cross[0]
    high_alignment = abs(high_cross) ** 2 / k00
    high_identity_rhs = alignment_energy + high_alignment - 2 * high_cross

    source_guard = {
        "modes_minusN_to_N": modes,
        "prime_powers": [
            {
                "n": n,
                "prime": prime,
                "exponent": exponent,
                "von_mangoldt_symbolic": f"log({prime})",
            }
            for n, prime, exponent in inventory
        ],
        "prime_endpoint_lambda_squared_included": any(
            exact_lambda_squared.denominator == 1
            and n == exact_lambda_squared.numerator
            for n, _prime, _exponent in inventory
        ),
        "pole_direct": pole_direct,
        "archimedean_unsigned_direct": arch_direct,
        "prime_unsigned_direct": prime_direct,
        "Q_direct_equals_pole_minus_archimedean_minus_prime": Q_direct,
        "Q_split_equals_pole_minus_archimedean_minus_prime": Q_split,
        "normal_form_c_star_identity": c_identity,
        "normal_form_A_tail": A_tail_full,
        "normal_form_T_D_atoms": T_atoms_full,
        "normal_form_T_D_continuous": T_continuous_full,
        "normal_form_T_D": T_D_full,
        "Q_normal_equals_cI_plus_A_tail_minus_T_D": Q_normal,
        "direct_minus_split_Q_before_absolute_values": direct_split_residual,
        "direct_minus_normal_Q_before_absolute_values": direct_normal_residual,
        "direct_split_Q_max_abs_defect": max_abs(direct_split_residual),
        "direct_normal_Q_max_abs_defect": max_abs(direct_normal_residual),
        "Q_hermitian_defect": max_abs(Q_direct - Q_direct.T),
        "Q_inversion_commutator_defect": max_abs(Q_direct * J - J * Q_direct),
        "c_star": scalars["c_star"],
        "D_at_L": scalars["D_at_2a"],
        "source_formula_prime_sign_is_minus": True,
        "Fourier_sign_is_locked_positive_modes": True,
        "lambda_squared_not_lambda_prime_cutoff": True,
    }

    normalization_regression = {
        "a4": h_lambda.a4,
        "a0_lambda": h_lambda.a0,
        "zero_integral_defect": abs(h_lambda.integral()),
        "prolate_h0_eigenvalue": h_lambda.h0.eigenvalue,
        "prolate_h4_eigenvalue": h_lambda.h4.eigenvalue,
        "projected_state_norm": projection["projected_norm"],
        "full_state_norm_point_value": projection["state_norm"],
        "projection_error_point_value": projection["projection_error"],
        "projection_error_method": projection["projection_error_method"],
        "projection_error_parseval_crosscheck": projection[
            "projection_error_parseval_crosscheck"
        ],
        "kappa_full_modes_minusN_to_N": kappa_full,
        "kappa_even_coordinates": kappa,
        "kappa_norm_defect": abs(_norm(kappa) - 1),
        "kappa_inversion_even_defect": _norm(J * kappa_full - kappa_full),
        "limiting_h_L2_norm": mp.sqrt(33) / mp.power(2, mp.mpf(17) / 4),
        "source_limiting_Xi_transform_scalar": mp.mpf(1) / 4,
        "unit_normalization_limit_multiplier": mp.power(2, mp.mpf(17) / 4)
        / mp.sqrt(33),
        "unit_normalized_limiting_Xi_transform_scalar": mp.power(
            2, mp.mpf(17) / 4
        )
        / (4 * mp.sqrt(33)),
        "unit_normalization_limiting_scalar_difference": (
            mp.power(2, mp.mpf(17) / 4) / mp.sqrt(33) - 1
        )
        / 4,
        "unit_normalized_replacement_allowed": False,
        "unit_normalization_rejected": True,
    }

    natural_cutoff_geometry = {
        "Pi_M_full_raw_modes": Pi_full,
        "Pi_M_even": Pi,
        "Pi_projector_defect": max_abs(Pi * Pi - Pi),
        "Pi_mode_commutator_defect": max_abs(
            Pi_full * mode_operator - mode_operator * Pi_full
        ),
        "Pi_inversion_commutator_defect": max_abs(Pi_full * J - J * Pi_full),
        "visible_anchor_p": p,
        "k00": k00,
        "P_L_anchor_transverse": P_L,
        "P_L_projector_defect": max_abs(P_L * P_L - P_L),
        "P_L_anchor_defect": _norm(P_L * kappa),
        "P_L_Pi_commutator_defect": max_abs(P_L * Pi - Pi * P_L),
        "finite_P_L_trace": _trace(P_L),
        "t_kappa_high_mode_norm": t_kappa,
        "k00_plus_t_kappa_squared_minus_one": k00 + t_kappa**2 - 1,
        "natural_cutoff_equals_ceil_lambda": M
        == -(-exact_lam.numerator // exact_lam.denominator),
        "asymptotic_gevrey_threshold_certified_at_pilot": False,
    }

    ritz_ground_geometry = {
        "Q_even": Q_even,
        "Q_odd": Q_odd,
        "q": q,
        "residual_b_complement": b,
        "residual_r": residual_r,
        "A_even_complement": A,
        "mu_true_even_ground": mu,
        "even_eigenvalues": even_values,
        "odd_eigenvalues": odd_values,
        "xi_unit_even_ground": xi,
        "gamma_kappa_overlap": gamma,
        "x_coefficient_normalized_ground": x,
        "x_feshbach_reconstruction": x_feshbach,
        "x_reconstruction_defect": _norm(x - x_feshbach),
        "ground_equation_defect": _norm(H * x),
        "B_mu": B_mu,
        "B_mu_eigenvalues": B_mu_values,
        "z_common_shifted_solve": z,
        "z_norm_squared": _norm(z) ** 2,
        "u_lower_two_vector_Ritz": u,
        "d_q_minus_u": d,
        "delta_d_over_r": delta,
        "B_u_eigenvalues": B_u_values,
        "odd_at_u_eigenvalues": odd_at_u_values,
        "even_shift_sign_strict": B_u_values[0] > 0,
        "odd_shift_sign_strict": odd_at_u_values[0] > 0,
        "ritz_moment_left_d_times_wBuw": ritz_moment,
        "ritz_moment_right_r_squared": residual_r**2,
        "ritz_moment_defect": ritz_moment - residual_r**2,
        "C_R_squared": C_R_squared,
        "C_R": C_R,
        "C_R_squared_minus_z_norm_squared": C_R_squared - _norm(z) ** 2,
        "complement_basis_orthonormality_defect": complement_defect,
    }

    signed_block_response = {
        "b_A_tail": b_A,
        "b_T_D": b_T,
        "b_combined_A_tail_minus_T_D": b_combined,
        "b_direct_from_Q": b,
        "b_combined_minus_direct_defect": _norm(b_combined - b),
        "forcing_cancellation": _cancellation_record(b_A, b_T),
        "common_inverse_B_mu": B_mu_inverse,
        "separate_block_inverses_used": False,
        "z_A_tail_through_common_inverse": z_A,
        "z_T_D_through_common_inverse": z_T,
        "z_split_subtraction_A_tail_minus_T_D": z_split_subtraction,
        "z_combined_direct_solve": z_combined_direct,
        "z_combined_direct_minus_ground_z_defect": _norm(
            z_combined_direct - z
        ),
        "z_split_subtraction_minus_direct_defect": _norm(
            z_split_subtraction - z_combined_direct
        ),
        "response_A_tail_even": response_A,
        "response_T_D_even": response_T,
        "response_split_subtraction_A_tail_minus_T_D_even": (
            response_split_subtraction
        ),
        "response_combined_direct_even": response_combined_direct,
        "response_split_subtraction_minus_direct_defect": _norm(
            response_split_subtraction - response_combined_direct
        ),
        "ground_alignment_vector_P_L_x": ground_alignment_vector,
        "ground_alignment_plus_combined_response_defect": _norm(
            ground_alignment_vector + response_combined_direct
        ),
        "resolved_low_cancellation": _cancellation_record(response_A, response_T),
        "alignment_energy": alignment_energy,
        "alignment_from_combined_response": alignment_from_combined,
        "alignment_energy_identity_defect": alignment_energy
        - alignment_from_combined,
        "ground_action_A_tail_P_L_A_tail_x": ground_action_A,
        "ground_action_T_D_P_L_T_D_x": ground_action_T,
        "ground_action_split_subtraction": ground_action_split_subtraction,
        "ground_action_combined_direct": ground_action_combined_direct,
        "ground_action_split_minus_direct_defect": _norm(
            ground_action_split_subtraction - ground_action_combined_direct
        ),
        "ground_action_eigen_identity_rhs_mu_minus_cstar_P_L_x": (
            ground_action_eigen_rhs
        ),
        "ground_action_eigen_identity_defect": _norm(
            ground_action_combined_direct - ground_action_eigen_rhs
        ),
        "ground_action_cancellation": _cancellation_record(
            ground_action_A, ground_action_T
        ),
        "combined_response_preserved_before_absolute_values": True,
    }

    adjugate_alignment = {
        "H_even_at_mu": H,
        "H_adjugate": adjugate_H,
        "c_kappa": c_kappa,
        "adjugate_rank_one_reconstruction_defect": max_abs(
            adjugate_H - c_kappa * x * x.T
        ),
        "S_numerator_trace_Pi_adjugate": S_numerator,
        "S_M_adjugate_ratio": S_M,
        "S_M_state_quadratic": S_state,
        "S_M_ratio_minus_state_defect": S_M - S_state,
        "alignment_adjugate_numerator_trace_P_L_adjugate": (
            alignment_adjugate_numerator
        ),
        "alignment_adjugate_ratio": alignment_adjugate_ratio,
        "alignment_adjugate_ratio_minus_energy_defect": (
            alignment_adjugate_ratio - alignment_energy
        ),
        "low_wedge_squared": low_wedge_squared,
        "low_wedge_ratio_by_k00": low_wedge_ratio,
        "low_wedge_ratio_minus_energy_defect": low_wedge_ratio
        - alignment_energy,
        "k00": k00,
        "S_M_minus_k00": S_M - k00,
        "E_M_Pi_ground_correction_squared": E_M,
        "alignment_energy": alignment_energy,
        "high_cross_h": high_cross,
        "high_cross_absolute": abs(high_cross),
        "high_cross_linear_Ritz_bound": t_kappa * C_R,
        "high_alignment_abs_h_squared_over_k00": high_alignment,
        "high_alignment_quadratic_Ritz_bound": t_kappa**2
        * C_R_squared
        / k00,
        "S_minus_k00_identity_rhs": high_identity_rhs,
        "S_minus_k00_identity_defect": S_M - k00 - high_identity_rhs,
        "E_alignment_decomposition_defect": E_M
        - alignment_energy
        - high_alignment,
        "C_R_used_linearly_for_high_cross": True,
        "C_R_squared_used_for_squared_energy": True,
    }

    finite_diagnostics = {
        "tolerance": tolerance,
        "construction_tolerance": construction_tolerance,
        "direct_split_Q_scaled_defect": max_abs(direct_split_residual)
        / max(mp.mpf(1), max_abs(Q_direct), max_abs(Q_split)),
        "direct_normal_Q_scaled_defect": max_abs(direct_normal_residual)
        / max(mp.mpf(1), max_abs(Q_direct), max_abs(Q_normal)),
        "A_tail_frobenius_norm": _frobenius(A_tail_full),
        "T_D_frobenius_norm": _frobenius(T_D_full),
        "combined_H_D_frobenius_norm": _frobenius(A_tail_full - T_D_full),
        "finite_alignment_nonnegative": alignment_energy >= 0,
        "all_required_finite_gates_pass": True,
        "claim_class": "FINITE_POINT_DIAGNOSTIC",
        "unbounded_alignment_rate_claimed": False,
        "locally_uniform_determinant_convergence_claimed": False,
        "equation_5_2_claimed": False,
        "RH_claimed": False,
    }

    scale_Q = max(mp.mpf(1), max_abs(Q_direct), max_abs(Q_split), max_abs(Q_normal))
    if max_abs(Q_direct - Q_direct.T) > construction_tolerance:
        raise Checkpoint070Error("direct source matrix is not Hermitian")
    if max_abs(Q_direct * J - J * Q_direct) > construction_tolerance:
        raise Checkpoint070Error("direct source matrix does not commute with inversion")
    if max_abs(direct_split_residual) > construction_tolerance * scale_Q:
        raise Checkpoint070Error("direct and split source paths disagree")
    if max_abs(direct_normal_residual) > tolerance * scale_Q:
        raise Checkpoint070Error("source and discrepancy-normal-form paths disagree")
    if not source_guard["prime_endpoint_lambda_squared_included"]:
        raise Checkpoint070Error("prime power at lambda^2 was omitted")
    if normalization_regression["kappa_norm_defect"] > construction_tolerance:
        raise Checkpoint070Error("prolate anchor normalization failed")
    if normalization_regression["kappa_inversion_even_defect"] > construction_tolerance:
        raise Checkpoint070Error("prolate anchor is not inversion even")
    if natural_cutoff_geometry["Pi_projector_defect"] > construction_tolerance:
        raise Checkpoint070Error("Pi_M is not a projector")
    if natural_cutoff_geometry["Pi_mode_commutator_defect"] > construction_tolerance:
        raise Checkpoint070Error("Pi_M does not commute with the mode operator")
    if natural_cutoff_geometry["Pi_inversion_commutator_defect"] > construction_tolerance:
        raise Checkpoint070Error("Pi_M does not commute with inversion")
    if natural_cutoff_geometry["P_L_projector_defect"] > construction_tolerance:
        raise Checkpoint070Error("P_L is not a projector")
    if natural_cutoff_geometry["P_L_anchor_defect"] > construction_tolerance:
        raise Checkpoint070Error("P_L does not kill the visible anchor")
    if B_mu_values[0] <= 0:
        raise Checkpoint070Error("true-ground complement is not positive")
    if B_u_values[0] <= 0 or odd_at_u_values[0] <= 0:
        raise Checkpoint070Error("required finite exact-u sector sign failed")
    if abs(ritz_moment - residual_r**2) > tolerance * max(
        mp.mpf(1), residual_r**2
    ):
        raise Checkpoint070Error("two-vector Ritz moment identity failed")
    if C_R_squared < _norm(z) ** 2 - tolerance:
        raise Checkpoint070Error("Ritz squared-norm bound failed")
    if _norm(b_combined - b) > tolerance * max(mp.mpf(1), _norm(b)):
        raise Checkpoint070Error("combined source forcing does not equal direct forcing")
    if _norm(z_combined_direct - z) > tolerance * max(mp.mpf(1), _norm(z)):
        raise Checkpoint070Error("common-inverse split does not reconstruct ground solve")
    if _norm(z_split_subtraction - z_combined_direct) > tolerance * max(
        mp.mpf(1), _norm(z_combined_direct)
    ):
        raise Checkpoint070Error("split response subtraction lost certified digits")
    if _norm(ground_alignment_vector + response_combined_direct) > tolerance:
        raise Checkpoint070Error("resolved block response does not reconstruct alignment")
    if abs(alignment_energy - alignment_from_combined) > tolerance:
        raise Checkpoint070Error("alignment energy decomposition failed")
    if _norm(ground_action_split_subtraction - ground_action_combined_direct) > tolerance:
        raise Checkpoint070Error("direct and split ground actions disagree")
    if _norm(ground_action_combined_direct - ground_action_eigen_rhs) > tolerance:
        raise Checkpoint070Error("combined ground-action eigen identity failed")
    if max_abs(adjugate_H - c_kappa * x * x.T) > tolerance * max(
        mp.mpf(1), max_abs(adjugate_H)
    ):
        raise Checkpoint070Error("ground adjugate rank-one identity failed")
    if abs(S_M - S_state) > tolerance * max(mp.mpf(1), abs(S_state)):
        raise Checkpoint070Error("adjugate ratio does not equal ground response")
    if abs(alignment_adjugate_ratio - alignment_energy) > tolerance:
        raise Checkpoint070Error("adjugate alignment ratio failed")
    if abs(low_wedge_ratio - alignment_energy) > tolerance:
        raise Checkpoint070Error("low wedge alignment ratio failed")
    if abs(S_M - k00 - high_identity_rhs) > tolerance:
        raise Checkpoint070Error("high-cross response identity failed")
    if abs(E_M - alignment_energy - high_alignment) > tolerance:
        raise Checkpoint070Error("orthogonal alignment decomposition failed")
    if abs(high_cross) > t_kappa * C_R + tolerance:
        raise Checkpoint070Error("linear Ritz high-cross bound failed")

    return {
        "source_guard": source_guard,
        "normalization_regression": normalization_regression,
        "natural_cutoff_geometry": natural_cutoff_geometry,
        "ritz_ground_geometry": ritz_ground_geometry,
        "signed_block_response": signed_block_response,
        "adjugate_alignment": adjugate_alignment,
        "finite_diagnostics": finite_diagnostics,
    }


def produce(
    lambda_text: str,
    N: int,
    M: int,
    dps: int,
    basis_size: int = PROLATE_BASIS_SIZE,
) -> dict[str, Any]:
    _validate_inputs(lambda_text, N, M, dps, basis_size)
    sections = _compute_sections(lambda_text, N, M, dps, basis_size)
    encoded_sections = {
        name: _encode(section, dps) for name, section in sections.items()
    }
    return {
        "schema": SCHEMA,
        "checkpoint_version": CHECKPOINT_VERSION,
        "terminal_state": TERMINAL_STATE,
        "claim_class": "FINITE_POINT_DIAGNOSTIC",
        "analytic_uniform_claim": False,
        "inputs": {
            "lambda": lambda_text,
            "N": N,
            "M": M,
            "precision_decimal_digits": dps,
            "prolate_even_legendre_basis_size": basis_size,
            "L": mp.nstr(2 * mp.log(parse_decimal(lambda_text)), dps),
        },
        "locked_conventions": LOCKED_CONVENTIONS,
        "locked_formulas": LOCKED_FORMULAS,
        "provenance": PROVENANCE,
        "dependency_sha256": dependency_hashes(),
        "runtime": {
            "python": sys.version.split()[0],
            "mpmath": mp.__version__,
        },
        **encoded_sections,
        "section_sha256": {
            name: _raw_hash(section) for name, section in encoded_sections.items()
        },
        "limitations": LIMITATIONS,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lambda", dest="lambda_text", required=True)
    parser.add_argument("--N", type=int, required=True)
    parser.add_argument("--M", type=int, required=True)
    parser.add_argument("--dps", type=int, required=True)
    parser.add_argument(
        "--basis-size", type=int, default=PROLATE_BASIS_SIZE
    )
    parser.add_argument("--output", type=Path, required=True)
    arguments = parser.parse_args()
    result = produce(
        arguments.lambda_text,
        arguments.N,
        arguments.M,
        arguments.dps,
        arguments.basis_size,
    )
    text = json.dumps(result, indent=2, sort_keys=True, allow_nan=False) + "\n"
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(text)
    print(text, end="")


if __name__ == "__main__":
    main()
