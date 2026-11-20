#!/usr/bin/env python3
"""Checkpoint 0.63 finite source geometry diagnostic.

This producer reconstructs one deterministic ``lambda=2, N=4`` point from
the locked finite Weil formulas.  It computes

* regularized physical-moment Schur floors and low-spectral angle profiles;
* the pole-deleted constrained ground and its labelled parity-crossing load.

The calculation is an arbitrary-precision point diagnostic.  It reads no
zero table, cached matrix, eigensystem, or producer artifact and makes no
uniform or asymptotic claim.  The independent replay uses different source,
prolate, physical-moment, and pole-vector formula paths.
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

from prolate_state import projected_even_state, source_combination
from weil_matrix import blocks_direct, inversion, max_abs, parse_decimal


ROOT = Path(__file__).resolve().parents[1]
SCHEMA = "xi-prolate-checkpoint063-moment-angle-constrained-ground-v1"
CHECKPOINT_VERSION = "0.63.0-moment-angle-constrained-ground-pilot"
TERMINAL_STATE = "P0_INVALIDATED"
PROFILE_ALPHA_TEXTS = ("1/4", "1/2", "1", "1000", "15000", "40000")

DEPENDENCIES = (
    "P0_SOURCE_LOCK.json",
    "P0_NORMALIZATION_AUDIT.md",
    "vendor/CCM-ZST-2511.22755v1.pdf",
    "vendor/CCM-PROLATE-2310.18423v2.pdf",
    "notes/REGULARIZED_MOMENT_SCHUR_ANGLE_PROFILE.md",
    "notes/BIRMAN_SCHWINGER_POLE_LOAD_CROSSING_AUDIT.md",
    "notes/PAIRED_EXPONENTIAL_CONSTRAINED_GROUND_REDUCTION.md",
    "notes/CONSTRAINED_TRIAL_LABELLED_LOAD_RESERVE.md",
    "src/checkpoint063_moment_angle_constrained_ground.py",
    "src/prolate_state.py",
    "src/weil_matrix.py",
    "verifier/checkpoint063_moment_angle_constrained_ground_replay.py",
    "verifier/independent_replay.py",
)

LOCKED_CONVENTIONS = {
    "source_point": "lambda=2, N=4 only; no schedule sweep",
    "physical_interval": "I=[-ell,ell], ell=log(lambda), L=2*ell, Lebesgue measure and zero extension",
    "fourier_transform": "hat(f)(t)=integral_I f(x)*exp(-i*t*x) dx",
    "centered_modes": "V_n(x)=(-1)^n*L^(-1/2)*exp(+2*pi*i*n*x/L)",
    "inversion": "J*V_n=V_-n; reflection is retained",
    "prime_inventory": "every prime power 1<n<=lambda^2, endpoint inclusive",
    "prime_block_sign": "minus in Q=pole-archimedean-prime, as in source equation (3.19)",
    "source_normalization": "h_lambda=a4*h4-a0(lambda)*h0 with source-limit a4; unit normalization rejected",
    "nonpole_shift": "A=Q-pole-m_lambda(0)*I after complete Q assembly",
    "pole_vectors": "finite Fourier projections of cosh(x/2) and sinh(x/2), never continuum norms",
    "parameter_ingestion": "exact text parsed without binary64",
    "angle_output_scope": "eta_m(u) only; covariance-weighted Theta_(m,T)(u), Phi, K_m, and K_T are not computed in checkpoint 0.63",
}

LOCKED_FORMULAS = {
    "raw_shift": "q=<kappa,Q*kappa>, r=||(Q-qI)kappa||, B=P_(kappa_perp)^*(Q-qI)P_(kappa_perp)",
    "physical_moments": "u_j=P_(kappa_perp)P_(E_N^+)(x^(2j)), j=0,...,m-1",
    "moment_floor": "c_(r,m)=1/lambda_max(G^(-1/2)*R*G^(-1/2)), G=U^*U, R=U^*(B+rI)^(-1)U",
    "complete_schur": "C_(r,m)=M_LL-M_LH*M_HH^(-1)*M_HL with M=B+rI",
    "angle": "eta_m(u)=||1_(0,u](B)*P_m||^2",
    "angle_bounds": "r*eta/(u+r)<=r/c_(r,m)<=r/(u+r)+u*eta/(u+r)",
    "nonpole_operator": "A=Q-pole-m0*I, m0=psi(1/4)-log(pi)-2*sum_(n<=lambda^2)Lambda(n)/sqrt(n)",
    "pole_decomposition": "pole_even=2*|p_+><p_+| and pole_odd=-2*|p_-><p_-|",
    "constrained_ground": "zeta=lambda_min(P_(w_perp)*A*P_(w_perp)), w=p_+ direct-sum p_-",
    "paired_resolvent": "F_+(zeta)+F_-(zeta)=0 on the nonexceptional branch",
    "critical_load": "s_c=1/(2*F_-(zeta))=-1/(2*F_+(zeta))",
    "labelled_unit_test": "source load precedes crossing iff s_c-1>0, retaining sector labels and zeta<a2",
    "actual_ground_trial_regression": "with U=zeta and B_U=H_-(1)-U*I, chi_U=<p_-,B_U^(-1)*p_-> and s_trial=1+1/(2*chi_U)=s_c at this point",
}

PROVENANCE = {
    "cached_matrix_read": False,
    "cached_eigensystem_read": False,
    "zeta_zero_table_read": False,
    "global_weil_positivity_assumed": False,
    "binary64_parameter_used": False,
    "real_axis_determinant_proxy_used": False,
    "producer_source_path": "direct distributional Weil integrals plus recurrence prolate state",
    "producer_moment_path": "direct physical interval quadrature",
    "producer_pole_path": "direct physical interval quadrature",
}

LIMITATIONS = [
    "finite arbitrary-precision point diagnostic, not an interval or ball enclosure",
    "producer and verifier share mpmath transcendental arithmetic and eigsy",
    "the labelled critical-load margin is not a uniform source theorem",
    "the angle profile is sampled at six declared thresholds and gives no asymptotic estimate",
    "no locally uniform determinant convergence is inferred",
    "only eta_m(u) is sampled; covariance-weighted Theta/Phi and K_T are not evaluated",
    "the actual-ground B_U/chi calculation is an existential identity regression, not a constructive source trial or an independent proof of orientation",
]


class PilotError(ValueError):
    """Fail-closed checkpoint input or finite-branch error."""


def _sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1 << 20), b""):
            digest.update(chunk)
    return digest.hexdigest()


def dependency_hashes() -> dict[str, str]:
    return {name: _sha256_file(ROOT / name) for name in DEPENDENCIES}


def _raw_hash(value: Any) -> str:
    raw = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("ascii")
    return hashlib.sha256(raw).hexdigest()


def _parse_positive_rational_text(value: Any, label: str) -> mp.mpf:
    if not isinstance(value, str):
        raise TypeError(f"{label} must be exact text; binary64 is forbidden")
    try:
        rational = Fraction(value)
    except (ValueError, ZeroDivisionError) as exc:
        raise PilotError(f"invalid exact {label}") from exc
    if rational <= 0:
        raise PilotError(f"{label} must be positive")
    return mp.mpf(rational.numerator) / rational.denominator


def _require_integer(value: Any, label: str, minimum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{label} must be an exact integer")
    if value < minimum:
        raise PilotError(f"{label} must be at least {minimum}")
    return value


def _dot(x: mp.matrix, A: mp.matrix, y: mp.matrix) -> mp.mpf:
    return (x.T * A * y)[0]


def _norm(x: mp.matrix) -> mp.mpf:
    return mp.sqrt(mp.fsum(abs(x[i]) ** 2 for i in range(x.rows)))


def _max_abs(A: mp.matrix) -> mp.mpf:
    return max(
        (abs(A[i, j]) for i in range(A.rows) for j in range(A.cols)),
        default=mp.mpf("0"),
    )


def _inverse(A: mp.matrix) -> mp.matrix:
    if A.rows != A.cols:
        raise PilotError("matrix inverse requires a square matrix")
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
        raise PilotError("invalid unit vector for orthogonal complement")
    e0 = mp.matrix(unit.rows, 1)
    e0[0] = 1
    sign = 1 if unit[0] >= 0 else -1
    vector = unit + sign * e0
    return (
        mp.eye(unit.rows)
        - 2 * vector * vector.T / (vector.T * vector)[0]
    )[:, 1 : unit.rows]


def _orthonormalize_columns(columns: mp.matrix, tolerance: mp.mpf) -> mp.matrix:
    vectors: list[mp.matrix] = []
    for j in range(columns.cols):
        vector = columns[:, j].copy()
        for _pass in range(2):
            for basis_vector in vectors:
                vector -= basis_vector * (basis_vector.T * vector)[0]
        length = _norm(vector)
        if length <= tolerance:
            raise PilotError("physical moment columns are rank deficient")
        vectors.append(vector / length)
    result = mp.matrix(columns.rows, len(vectors))
    for j, vector in enumerate(vectors):
        result[:, j] = vector
    return result


def _orthogonal_tail(W: mp.matrix, tolerance: mp.mpf) -> mp.matrix:
    vectors: list[mp.matrix] = []
    for index in range(W.rows):
        vector = mp.matrix(W.rows, 1)
        vector[index] = 1
        for _pass in range(2):
            for j in range(W.cols):
                vector -= W[:, j] * (W[:, j].T * vector)[0]
            for tail in vectors:
                vector -= tail * (tail.T * vector)[0]
        length = _norm(vector)
        if length > tolerance:
            vectors.append(vector / length)
        if len(vectors) == W.rows - W.cols:
            break
    if len(vectors) != W.rows - W.cols:
        raise PilotError("failed to construct complete moment complement")
    result = mp.matrix(W.rows, len(vectors))
    for j, vector in enumerate(vectors):
        result[:, j] = vector
    return result


def _block_diagonal(left: mp.matrix, right: mp.matrix) -> mp.matrix:
    result = mp.matrix(left.rows + right.rows)
    result[: left.rows, : left.cols] = left
    result[left.rows :, left.cols :] = right
    return result


def _direct_even_moment_columns(
    N: int, L: mp.mpf, even_complement: mp.matrix
) -> mp.matrix:
    ell = L / 2

    def basis_value(n: int, x: mp.mpf) -> mp.mpf:
        if n == 0:
            return 1 / mp.sqrt(L)
        omega = 2 * mp.pi * n / L
        return mp.power(-1, n) * mp.sqrt(2 / L) * mp.cos(omega * x)

    coefficients = mp.matrix(N + 1, N)
    for j in range(N):
        degree = 2 * j
        for n in range(N + 1):
            coefficients[n, j] = mp.quad(
                lambda x, n=n, degree=degree: x**degree * basis_value(n, x),
                [-ell, 0, ell],
            )
    return even_complement.T * coefficients


def _direct_pole_vectors(N: int, L: mp.mpf) -> tuple[mp.matrix, mp.matrix]:
    ell = L / 2
    plus = mp.matrix(N + 1, 1)
    minus = mp.matrix(N, 1)
    for n in range(N + 1):
        if n == 0:
            basis = lambda x: 1 / mp.sqrt(L)
        else:
            omega = 2 * mp.pi * n / L
            basis = lambda x, n=n, omega=omega: (
                mp.power(-1, n) * mp.sqrt(2 / L) * mp.cos(omega * x)
            )
        plus[n] = mp.quad(lambda x, basis=basis: basis(x) * mp.cosh(x / 2), [-ell, 0, ell])
    for n in range(1, N + 1):
        omega = 2 * mp.pi * n / L
        minus[n - 1] = mp.quad(
            lambda x, n=n, omega=omega: (
                mp.power(-1, n)
                * mp.sqrt(2 / L)
                * mp.sin(omega * x)
                * mp.sinh(x / 2)
            ),
            [-ell, 0, ell],
        )
    return plus, minus


def _moment_profiles(
    B: mp.matrix,
    residual: mp.mpf,
    moment_columns: mp.matrix,
    tolerance: mp.mpf,
) -> list[dict[str, Any]]:
    M = B + residual * mp.eye(B.rows)
    M_inverse = _inverse(M)
    eigenvalues, eigenvectors = mp.eigsy((B + B.T) / 2)
    records: list[dict[str, Any]] = []
    for m in range(1, moment_columns.cols + 1):
        U = moment_columns[:, :m]
        W = _orthonormalize_columns(U, tolerance)
        G = U.T * U
        R = U.T * M_inverse * U
        whitened_resolvent = W.T * M_inverse * W
        resolvent_values, _ = mp.eigsy((whitened_resolvent + whitened_resolvent.T) / 2)
        floor_resolvent = 1 / resolvent_values[-1]

        high = _orthogonal_tail(W, tolerance)
        low_block = W.T * M * W
        if high.cols:
            cross = W.T * M * high
            high_block = high.T * M * high
            complete_schur = low_block - cross * _inverse(high_block) * cross.T
        else:
            complete_schur = low_block
        schur_values, _ = mp.eigsy((complete_schur + complete_schur.T) / 2)
        floor_schur = schur_values[0]
        ratio = residual / floor_resolvent

        angle_records: list[dict[str, Any]] = []
        for alpha_text in PROFILE_ALPHA_TEXTS:
            alpha = _parse_positive_rational_text(alpha_text, "angle alpha")
            threshold = alpha * residual
            projector = mp.matrix(B.rows)
            distances: list[mp.mpf] = []
            rank = 0
            for index in range(B.rows):
                distances.append(abs(eigenvalues[index] - threshold))
                if eigenvalues[index] <= threshold:
                    projector += eigenvectors[:, index] * eigenvectors[:, index].T
                    rank += 1
            compressed_projector = W.T * projector * W
            angle_values, _ = mp.eigsy(
                (compressed_projector + compressed_projector.T) / 2
            )
            eta = angle_values[-1]
            lower = residual * eta / (threshold + residual)
            upper = residual / (threshold + residual) + threshold * eta / (
                threshold + residual
            )
            if ratio < lower - tolerance or ratio > upper + tolerance:
                raise PilotError("sharp two-layer angle inequality failed")
            angle_records.append(
                {
                    "alpha_equals_u_over_r": alpha_text,
                    "u": threshold,
                    "spectral_projector_rank": rank,
                    "distance_to_nearest_B_eigenvalue": min(distances),
                    "eta": eta,
                    "lower_bound_for_r_over_c": lower,
                    "upper_bound_for_r_over_c": upper,
                    "lower_slack": ratio - lower,
                    "upper_slack": upper - ratio,
                }
            )

        determinant_left = mp.det(complete_schur)
        determinant_right = mp.det(G) / mp.det(R)
        records.append(
            {
                "m": m,
                "moment_dimension": W.cols,
                "G": G,
                "R": R,
                "whitened_resolvent": whitened_resolvent,
                "complete_schur": complete_schur,
                "floor_from_resolvent": floor_resolvent,
                "floor_from_complete_schur": floor_schur,
                "floor_agreement_signed": floor_resolvent - floor_schur,
                "r_over_floor": ratio,
                "determinant_C": determinant_left,
                "determinant_G_over_R": determinant_right,
                "determinant_identity_signed_residual": (
                    determinant_left - determinant_right
                ),
                "angle_profile": angle_records,
            }
        )
    return records


def _constrained_ground(
    Q: mp.matrix,
    pole: mp.matrix,
    terms: list[tuple[int, mp.mpf]],
    N: int,
    L: mp.mpf,
    tolerance: mp.mpf,
) -> dict[str, Any]:
    even, odd = _sector_bases(N)
    prime_mass = mp.fsum(value / mp.sqrt(n) for n, value in terms)
    m0 = mp.digamma(mp.mpf(1) / 4) - mp.log(mp.pi) - 2 * prime_mass
    nonpole = Q - pole - m0 * mp.eye(2 * N + 1)
    A_plus = even.T * nonpole * even
    A_minus = odd.T * nonpole * odd
    pole_plus = even.T * pole * even
    pole_minus = odd.T * pole * odd
    p_plus, p_minus = _direct_pole_vectors(N, L)
    plus_pole_defect = _max_abs(pole_plus - 2 * p_plus * p_plus.T)
    minus_pole_defect = _max_abs(pole_minus + 2 * p_minus * p_minus.T)
    if plus_pole_defect > tolerance or minus_pole_defect > tolerance:
        raise PilotError("projected pole-vector decomposition failed")

    plus_values, plus_vectors = mp.eigsy((A_plus + A_plus.T) / 2)
    minus_values, _ = mp.eigsy((A_minus + A_minus.T) / 2)
    combined_values = sorted(list(plus_values) + list(minus_values))
    nonpole_ground_even_margin = minus_values[0] - plus_values[0]
    nonpole_ground_simplicity_gap = combined_values[1] - combined_values[0]
    nonpole_ground_pole_overlap = abs((p_plus.T * plus_vectors[:, 0])[0])

    full_nonpole = _block_diagonal(A_plus, A_minus)
    w = mp.matrix(list(p_plus) + list(p_minus))
    w_norm = _norm(w)
    if not w_norm > tolerance:
        raise PilotError("projected one-sided exponential vanished")
    constrained_basis = _orthogonal_complement(w / w_norm)
    constrained_matrix = constrained_basis.T * full_nonpole * constrained_basis
    constrained_values, constrained_vectors = mp.eigsy(
        (constrained_matrix + constrained_matrix.T) / 2
    )
    zeta = constrained_values[0]
    zeta_below_a2_margin = combined_values[1] - zeta
    spectral_distance = min(abs(value - zeta) for value in combined_values)

    if not (
        nonpole_ground_even_margin > tolerance
        and combined_values[0] > -tolerance
        and nonpole_ground_simplicity_gap > tolerance
        and nonpole_ground_pole_overlap > tolerance
        and _norm(p_minus) > tolerance
        and zeta_below_a2_margin > tolerance
        and spectral_distance > tolerance
    ):
        raise PilotError("constrained branch labelling hypotheses failed")

    plus_resolvent = _inverse(A_plus - zeta * mp.eye(A_plus.rows))
    minus_resolvent = _inverse(A_minus - zeta * mp.eye(A_minus.rows))
    F_plus = _dot(p_plus, plus_resolvent, p_plus)
    F_minus = _dot(p_minus, minus_resolvent, p_minus)
    if not F_minus > 0 or not F_plus < 0:
        raise PilotError("paired resolvent has wrong labelled signs")
    critical_load = 1 / (2 * F_minus)
    paired_resolvent_residual = F_plus + F_minus

    phi = constrained_basis * constrained_vectors[:, 0]
    constrained_residual = (full_nonpole - zeta * mp.eye(full_nonpole.rows)) * phi
    gamma = (w.T * constrained_residual)[0] / (w.T * w)[0]
    alpha = (p_plus.T * phi[: A_plus.rows, :])[0]
    if gamma < 0:
        phi = -phi
        constrained_residual = -constrained_residual
        gamma = -gamma
        alpha = -alpha
    if abs(alpha) <= tolerance:
        raise PilotError("constrained ground orientation scalar vanished")
    critical_load_from_residual = -gamma / (2 * alpha)

    loaded_plus_crossing = A_plus + 2 * critical_load * p_plus * p_plus.T
    loaded_minus_crossing = A_minus - 2 * critical_load * p_minus * p_minus.T
    crossing_plus_ground = mp.eigsy(loaded_plus_crossing, eigvals_only=True)[0]
    crossing_minus_ground = mp.eigsy(loaded_minus_crossing, eigvals_only=True)[0]
    loaded_plus_one = A_plus + 2 * p_plus * p_plus.T
    loaded_minus_one = A_minus - 2 * p_minus * p_minus.T
    source_even_ground = mp.eigsy(loaded_plus_one, eigvals_only=True)[0]
    source_odd_ground = mp.eigsy(loaded_minus_one, eigvals_only=True)[0]

    trial_energy = _dot(phi, full_nonpole, phi)
    trial_constraint = (w.T * phi)[0]
    B_U = loaded_minus_one - trial_energy * mp.eye(A_minus.rows)
    B_U_values, _ = mp.eigsy((B_U + B_U.T) / 2)
    B_U_floor = B_U_values[0]
    if not B_U_floor > tolerance:
        raise PilotError("actual-ground labelled trial matrix is not positive at this point")
    chi_U = _dot(p_minus, _inverse(B_U), p_minus)
    if not chi_U > 0:
        raise PilotError("actual-ground labelled trial inverse quadratic form is nonpositive")
    s_trial = 1 + 1 / (2 * chi_U)
    inverse_free_trial_reserve = 1 + B_U_floor / (2 * _norm(p_minus) ** 2)

    full_loaded_one = _block_diagonal(loaded_plus_one, loaded_minus_one)
    determinant_ratio_one = mp.det(
        full_loaded_one - zeta * mp.eye(full_loaded_one.rows)
    ) / mp.det(full_nonpole - zeta * mp.eye(full_nonpole.rows))
    determinant_square_one = (1 - 1 / critical_load) ** 2
    odd_labelled_factor_one = 1 - 2 * F_minus
    if (
        abs(paired_resolvent_residual) > tolerance
        or abs(critical_load - critical_load_from_residual) > tolerance
        or abs(crossing_plus_ground - zeta) > tolerance
        or abs(crossing_minus_ground - zeta) > tolerance
        or abs(determinant_ratio_one - determinant_square_one) > tolerance
        or abs(trial_energy - zeta) > tolerance
        or abs(trial_constraint) > tolerance
        or abs(s_trial - critical_load) > tolerance
    ):
        raise PilotError("constrained-ground or labelled-load identity failed")

    return {
        "m_lambda_0": m0,
        "nonpole_A_full": nonpole,
        "A_plus": A_plus,
        "A_minus": A_minus,
        "p_plus": p_plus,
        "p_minus_real_sine_coordinates": p_minus,
        "pole_even_rank_one_defect": plus_pole_defect,
        "pole_odd_rank_one_defect": minus_pole_defect,
        "nonpole_minimum": combined_values[0],
        "nonpole_second_eigenvalue_a2": combined_values[1],
        "nonpole_ground_even_margin": nonpole_ground_even_margin,
        "nonpole_ground_simplicity_gap": nonpole_ground_simplicity_gap,
        "nonpole_ground_p_plus_overlap": nonpole_ground_pole_overlap,
        "p_minus_norm": _norm(p_minus),
        "projected_exponential_w_norm": w_norm,
        "constrained_matrix": constrained_matrix,
        "constrained_ground_zeta": zeta,
        "zeta_below_a2_margin": zeta_below_a2_margin,
        "zeta_distance_to_nonpole_spectrum": spectral_distance,
        "F_plus_at_zeta": F_plus,
        "F_minus_at_zeta": F_minus,
        "paired_resolvent_signed_residual": paired_resolvent_residual,
        "critical_load_s_c": critical_load,
        "critical_load_from_constrained_residual": critical_load_from_residual,
        "critical_load_reconstruction_signed_residual": (
            critical_load - critical_load_from_residual
        ),
        "critical_load_margin_s_c_minus_1": critical_load - 1,
        "source_unit_load_before_crossing_point_diagnostic": bool(
            critical_load > 1
        ),
        "crossing_even_ground": crossing_plus_ground,
        "crossing_odd_ground": crossing_minus_ground,
        "crossing_even_minus_zeta": crossing_plus_ground - zeta,
        "crossing_odd_minus_zeta": crossing_minus_ground - zeta,
        "source_even_ground_at_load_1": source_even_ground,
        "source_odd_ground_at_load_1": source_odd_ground,
        "source_odd_minus_even_ground_gap": source_odd_ground - source_even_ground,
        "odd_labelled_factor_at_load_1": odd_labelled_factor_one,
        "full_determinant_ratio_at_load_1": determinant_ratio_one,
        "perfect_square_value_at_load_1": determinant_square_one,
        "perfect_square_signed_residual": (
            determinant_ratio_one - determinant_square_one
        ),
        "constrained_trial_kind": "actual constrained ground reconstructed live; existential identity regression only",
        "constrained_ground_phi_even_then_odd": phi,
        "constrained_trial_norm_defect": abs(_norm(phi) - 1),
        "constrained_trial_w_orthogonality_defect": abs(trial_constraint),
        "constrained_trial_energy_U": trial_energy,
        "constrained_trial_energy_minus_zeta": trial_energy - zeta,
        "labelled_trial_B_U_equals_H_minus_1_minus_U_I": B_U,
        "labelled_trial_B_U_point_floor": B_U_floor,
        "labelled_trial_chi_U": chi_U,
        "labelled_trial_load_lower_bound": s_trial,
        "labelled_trial_load_bound_minus_s_c": s_trial - critical_load,
        "labelled_trial_inverse_free_load_lower_bound": inverse_free_trial_reserve,
        "labelled_trial_is_point_only_not_interval": True,
        "nonpole_reassembly_defect": _max_abs(
            Q - (nonpole + pole + m0 * mp.eye(2 * N + 1))
        ),
    }


def _encode(value: Any, digits: int) -> Any:
    if isinstance(value, mp.matrix):
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


def produce(
    lambda_text: str,
    N: int,
    dps: int,
    prolate_basis_size: int,
) -> dict[str, Any]:
    if not isinstance(lambda_text, str):
        raise TypeError("lambda must be exact text; binary64 is forbidden")
    _require_integer(N, "N", 2)
    _require_integer(dps, "precision", 40)
    _require_integer(prolate_basis_size, "prolate basis size", 12)
    if Fraction(lambda_text) != 2 or N != 4:
        raise PilotError("checkpoint 0.63 is locked to the small source point lambda=2, N=4")

    mp.mp.dps = dps
    lam = parse_decimal(lambda_text)
    L = 2 * mp.log(lam)
    tolerance = mp.power(10, -max(18, dps // 2))

    modes, terms, pole, arch, prime, Q = blocks_direct(lambda_text, N, dps)
    even, odd = _sector_bases(N)
    J = inversion(N)
    h = source_combination(lambda_text, prolate_basis_size, dps, "recurrence")
    projection = projected_even_state(h, N)
    kappa = projection["kappa"]
    kappa_even = even.T * kappa
    even_complement = _orthogonal_complement(kappa_even)
    Q_even = even.T * Q * even
    Q_odd = odd.T * Q * odd
    q = _dot(kappa, Q, kappa)
    residual_vector = even_complement.T * (Q_even * kappa_even - q * kappa_even)
    residual = _norm(residual_vector)
    B = even_complement.T * Q_even * even_complement - q * mp.eye(N)
    odd_shifted = Q_odd - q * mp.eye(N)
    B_values, _ = mp.eigsy((B + B.T) / 2)
    odd_values, _ = mp.eigsy((odd_shifted + odd_shifted.T) / 2)
    if not residual > 0 or not B_values[0] > 0 or not odd_values[0] > 0:
        raise PilotError("raw-q residual or sector positivity gate failed")

    moment_columns = _direct_even_moment_columns(N, L, even_complement)
    moment_profiles = _moment_profiles(B, residual, moment_columns, tolerance)
    constrained = _constrained_ground(Q, pole, terms, N, L, tolerance)

    source_geometry_numeric = {
        "pole": pole,
        "archimedean_unsigned": arch,
        "prime_unsigned": prime,
        "Q_equals_pole_minus_arch_minus_prime": Q,
        "hermitian_defect": max_abs(Q - Q.T),
        "inversion_commutator_defect": max_abs(Q * J - J * Q),
    }
    residual_geometry_numeric = {
        "a4": h.a4,
        "a0_lambda": h.a0,
        "h_zero_integral_defect": abs(h.integral()),
        "projected_state_norm": projection["projected_norm"],
        "projection_error": projection["projection_error"],
        "kappa_modes_minusN_to_N": kappa,
        "inversion_even_state_defect": _norm(J * kappa - kappa),
        "q": q,
        "residual_r": residual,
        "residual_vector_even_complement": residual_vector,
        "B_even_complement_at_q": B,
        "B_eigenvalues": B_values,
        "even_gap_at_q": B_values[0],
        "odd_gap_at_q": odd_values[0],
        "physical_even_moment_columns_j0_to_j3": moment_columns,
    }

    source_inventory = {
        "modes": modes,
        "prime_powers": [
            {"n": n, "von_mangoldt": mp.nstr(value, dps)}
            for n, value in terms
        ],
    }
    source_geometry = _encode(source_geometry_numeric, dps)
    residual_geometry = _encode(residual_geometry_numeric, dps)
    encoded_profiles = _encode(moment_profiles, dps)
    encoded_constrained = _encode(constrained, dps)
    hashed_sections = {
        "source_inventory": source_inventory,
        "source_geometry": source_geometry,
        "residual_geometry": residual_geometry,
        "moment_profiles": encoded_profiles,
        "constrained_ground": encoded_constrained,
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
            "precision_decimal_digits": dps,
            "prolate_even_legendre_basis_size": prolate_basis_size,
            "L": mp.nstr(L, dps),
            "profile_alpha_equals_u_over_r": list(PROFILE_ALPHA_TEXTS),
        },
        "locked_conventions": LOCKED_CONVENTIONS,
        "locked_formulas": LOCKED_FORMULAS,
        "provenance": PROVENANCE,
        "dependency_sha256": dependency_hashes(),
        "runtime": {
            "python": sys.version.split()[0],
            "mpmath": mp.__version__,
        },
        **hashed_sections,
        "section_sha256": {
            name: _raw_hash(value) for name, value in hashed_sections.items()
        },
        "limitations": LIMITATIONS,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lambda", dest="lambda_text", required=True)
    parser.add_argument("--N", type=int, required=True)
    parser.add_argument("--dps", type=int, required=True)
    parser.add_argument("--prolate-basis-size", type=int, required=True)
    parser.add_argument("--output", type=Path, required=True)
    arguments = parser.parse_args()
    result = produce(
        arguments.lambda_text,
        arguments.N,
        arguments.dps,
        arguments.prolate_basis_size,
    )
    text = json.dumps(result, indent=2, sort_keys=True, allow_nan=False) + "\n"
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(text)
    print(text, end="")


if __name__ == "__main__":
    main()
