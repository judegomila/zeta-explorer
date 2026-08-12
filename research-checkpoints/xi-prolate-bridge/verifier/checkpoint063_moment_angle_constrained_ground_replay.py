#!/usr/bin/env python3
"""Independent replay for the checkpoint 0.63 source geometry pilot.

This module imports no producer code.  It reconstructs the finite Weil
matrix and prolate state through ``independent_replay.py``, uses closed
physical-moment recurrences instead of quadrature, and uses analytic Fourier
coefficients for the two pole vectors.
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

from independent_replay import (
    H,
    lambda_squared_floor_exact,
    lambda_terms,
    prolate_quadrature,
    projection,
)


ROOT = Path(__file__).resolve().parents[1]
SCHEMA = "xi-prolate-checkpoint063-moment-angle-constrained-ground-v1"
REPLAY_SCHEMA = "xi-prolate-checkpoint063-moment-angle-constrained-ground-replay-v1"
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
    "source_inventory",
    "source_geometry",
    "residual_geometry",
    "moment_profiles",
    "constrained_ground",
    "section_sha256",
    "limitations",
}
HASHED_SECTIONS = (
    "source_inventory",
    "source_geometry",
    "residual_geometry",
    "moment_profiles",
    "constrained_ground",
)


class ReplayError(ValueError):
    pass


def _source_q_kernel(n: int, m: int, x: mp.mpf, L: mp.mpf) -> mp.mpf:
    """Source overlap kernel, reconstructed locally for the verifier."""
    if n == m:
        return 2 * (L - x) * mp.cos(2 * mp.pi * n * x / L) / L
    return (
        mp.sin(2 * mp.pi * m * x / L)
        - mp.sin(2 * mp.pi * n * x / L)
    ) / (mp.pi * (n - m))


def matrix_from_source_transformed(
    lambda_text: str, N: int, dps: int
) -> tuple[mp.matrix, mp.matrix, mp.matrix, mp.matrix, list[tuple[int, mp.mpf]]]:
    """Independent source assembly with a transformed archimedean integral.

    The producer uses the distributional source formula on the physical
    ``x`` interval.  Here ``x=L*t^2`` regularizes the removable origin in a
    genuinely separate quadrature tree.  The origin value follows from
    q'(0)=-2/L for every mode pair:

        lim_(x->0) (exp(x/2)q(x)-q(0))/(2*sinh(x)) = q(0)/4-1/L.

    No finite-epsilon rectangle or cached producer matrix is used.
    """
    if not isinstance(lambda_text, str):
        raise TypeError("lambda must be exact text; binary64 is forbidden")
    if isinstance(N, bool) or not isinstance(N, int) or N < 0:
        raise TypeError("N must be a nonnegative integer")
    mp.mp.dps = dps
    lam_fraction = Fraction(lambda_text)
    if lam_fraction <= 1:
        raise ValueError("lambda must exceed one")
    lam = mp.mpf(lam_fraction.numerator) / lam_fraction.denominator
    L = 2 * mp.log(lam)
    modes = list(range(-N, N + 1))
    terms = lambda_terms(lambda_squared_floor_exact(lambda_text))
    dimension = len(modes)
    pole = mp.matrix(dimension)
    arch = mp.matrix(dimension)
    prime = mp.matrix(dimension)
    origin_threshold = mp.sqrt(mp.eps)

    for i, n in enumerate(modes):
        for j, m in enumerate(modes):
            pole[i, j] = (
                32
                * L
                * mp.sinh(L / 4) ** 2
                * (L**2 - 16 * mp.pi**2 * m * n)
                / (
                    (L**2 + 16 * mp.pi**2 * m * m)
                    * (L**2 + 16 * mp.pi**2 * n * n)
                )
            )
            q0 = _source_q_kernel(n, m, mp.mpf("0"), L)
            origin_value = q0 / 4 - 1 / L

            def transformed(t: mp.mpf) -> mp.mpf:
                x = L * t * t
                if abs(x) < origin_threshold:
                    base = origin_value
                else:
                    base = (
                        mp.exp(x / 2) * _source_q_kernel(n, m, x, L) - q0
                    ) / (2 * mp.sinh(x))
                return 2 * L * t * base

            constant = q0 / 2 * (
                mp.euler
                + mp.log(4 * mp.pi * (mp.exp(L) - 1) / (mp.exp(L) + 1))
            )
            arch[i, j] = constant + mp.quad(transformed, [0, mp.mpf("0.5"), 1])
            prime[i, j] = mp.fsum(
                value
                / mp.sqrt(k)
                * _source_q_kernel(n, m, mp.log(k), L)
                for k, value in terms
            )

    Q = pole - arch - prime
    return pole, arch, prime, Q, terms


def _sha256_bytes(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def _sha256_file(path: Path) -> str:
    return _sha256_bytes(path.read_bytes())


def dependency_hashes() -> dict[str, str]:
    return {name: _sha256_file(ROOT / name) for name in DEPENDENCIES}


def _raw_hash(value: Any) -> str:
    raw = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("ascii")
    return _sha256_bytes(raw)


def _pairs_no_duplicates(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise ReplayError(f"duplicate JSON key: {key}")
        result[key] = value
    return result


def _reject_number(text: str) -> None:
    raise ReplayError(f"binary64/non-integer JSON number forbidden: {text}")


def strict_json_loads(raw: bytes | str, label: str = "producer artifact") -> dict[str, Any]:
    if isinstance(raw, bytes):
        try:
            text = raw.decode("utf-8")
        except UnicodeDecodeError as exc:
            raise ReplayError(f"invalid {label}") from exc
    elif isinstance(raw, str):
        text = raw
    else:
        raise ReplayError(f"{label} must be bytes or text")
    try:
        value = json.loads(
            text,
            object_pairs_hook=_pairs_no_duplicates,
            parse_float=_reject_number,
            parse_constant=_reject_number,
        )
    except json.JSONDecodeError as exc:
        raise ReplayError(f"invalid {label}") from exc
    if not isinstance(value, dict):
        raise ReplayError(f"{label} root must be an object")
    _reject_binary64(value)
    return value


def _reject_binary64(value: Any, path: str = "root") -> None:
    if isinstance(value, float):
        raise ReplayError(f"binary64 value forbidden at {path}")
    if isinstance(value, dict):
        for key, item in value.items():
            _reject_binary64(item, f"{path}.{key}")
    elif isinstance(value, list):
        for index, item in enumerate(value):
            _reject_binary64(item, f"{path}[{index}]")


def _exact_keys(value: Any, expected: set[str], label: str) -> dict[str, Any]:
    if not isinstance(value, dict) or set(value) != expected:
        raise ReplayError(f"{label} field inventory mismatch")
    return value


def _mp_text(value: Any, label: str) -> mp.mpf:
    if not isinstance(value, str):
        raise ReplayError(f"{label} must be numeric text")
    try:
        result = mp.mpf(value)
    except (ValueError, TypeError) as exc:
        raise ReplayError(f"invalid {label}") from exc
    if not mp.isfinite(result):
        raise ReplayError(f"nonfinite {label}")
    return result


def _positive_rational_text(value: Any, label: str) -> Fraction:
    if not isinstance(value, str):
        raise ReplayError(f"{label} must be exact text; binary64 is forbidden")
    try:
        result = Fraction(value)
    except (ValueError, ZeroDivisionError) as exc:
        raise ReplayError(f"invalid exact {label}") from exc
    if result <= 0:
        raise ReplayError(f"{label} must be positive")
    return result


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


def _inversion(N: int) -> mp.matrix:
    dimension = 2 * N + 1
    result = mp.matrix(dimension)
    for index in range(dimension):
        result[index, dimension - 1 - index] = 1
    return result


def _orthogonal_complement(unit: mp.matrix) -> mp.matrix:
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
            raise ReplayError("reconstructed physical moment rank deficiency")
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
        raise ReplayError("failed to reconstruct moment complement")
    result = mp.matrix(W.rows, len(vectors))
    for j, vector in enumerate(vectors):
        result[:, j] = vector
    return result


def _block_diagonal(left: mp.matrix, right: mp.matrix) -> mp.matrix:
    result = mp.matrix(left.rows + right.rows)
    result[: left.rows, : left.cols] = left
    result[left.rows :, left.cols :] = right
    return result


def analytic_even_moment_columns(
    N: int, L: mp.mpf, even_complement: mp.matrix
) -> mp.matrix:
    """Closed endpoint recurrence for projected even monomials."""
    ell = L / 2
    coefficients = mp.matrix(N + 1, N)
    for j in range(N):
        degree = 2 * j
        coefficients[0, j] = 2 * ell ** (degree + 1) / (
            (degree + 1) * mp.sqrt(L)
        )
        for n in range(1, N + 1):
            omega = 2 * mp.pi * n / L
            signed_integral = mp.mpf("0")
            for power in range(2, degree + 1, 2):
                signed_integral = (
                    2 * power * ell ** (power - 1) / omega**2
                    - power * (power - 1) * signed_integral / omega**2
                )
            coefficients[n, j] = mp.sqrt(2 / L) * signed_integral
    return even_complement.T * coefficients


def analytic_pole_vectors(N: int, L: mp.mpf) -> tuple[mp.matrix, mp.matrix]:
    ell = L / 2
    scale = mp.sinh(ell / 2) / mp.sqrt(L)
    plus = mp.matrix(N + 1, 1)
    minus = mp.matrix(N, 1)
    plus[0] = 4 * scale
    for n in range(1, N + 1):
        omega = 2 * mp.pi * n / L
        denominator = omega**2 + mp.mpf(1) / 4
        plus[n] = mp.sqrt(2) * scale / denominator
        minus[n - 1] = -2 * mp.sqrt(2) * omega * scale / denominator
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
        whitened = W.T * M_inverse * W
        resolvent_values, _ = mp.eigsy((whitened + whitened.T) / 2)
        floor_resolvent = 1 / resolvent_values[-1]
        high = _orthogonal_tail(W, tolerance)
        low_block = W.T * M * W
        if high.cols:
            cross = W.T * M * high
            complete_schur = low_block - cross * _inverse(high.T * M * high) * cross.T
        else:
            complete_schur = low_block
        floor_schur = mp.eigsy(
            (complete_schur + complete_schur.T) / 2, eigvals_only=True
        )[0]
        ratio = residual / floor_resolvent
        angles: list[dict[str, Any]] = []
        for alpha_text in PROFILE_ALPHA_TEXTS:
            alpha_fraction = Fraction(alpha_text)
            alpha = mp.mpf(alpha_fraction.numerator) / alpha_fraction.denominator
            threshold = alpha * residual
            projector = mp.matrix(B.rows)
            distances: list[mp.mpf] = []
            rank = 0
            for index in range(B.rows):
                distances.append(abs(eigenvalues[index] - threshold))
                if eigenvalues[index] <= threshold:
                    projector += eigenvectors[:, index] * eigenvectors[:, index].T
                    rank += 1
            compressed = W.T * projector * W
            eta = mp.eigsy((compressed + compressed.T) / 2, eigvals_only=True)[-1]
            lower = residual * eta / (threshold + residual)
            upper = residual / (threshold + residual) + threshold * eta / (
                threshold + residual
            )
            angles.append(
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
        records.append(
            {
                "m": m,
                "moment_dimension": W.cols,
                "G": G,
                "R": R,
                "whitened_resolvent": whitened,
                "complete_schur": complete_schur,
                "floor_from_resolvent": floor_resolvent,
                "floor_from_complete_schur": floor_schur,
                "floor_agreement_signed": floor_resolvent - floor_schur,
                "r_over_floor": ratio,
                "determinant_C": mp.det(complete_schur),
                "determinant_G_over_R": mp.det(G) / mp.det(R),
                "determinant_identity_signed_residual": (
                    mp.det(complete_schur) - mp.det(G) / mp.det(R)
                ),
                "angle_profile": angles,
            }
        )
    return records


def _constrained_ground(
    Q: mp.matrix,
    pole: mp.matrix,
    terms: list[tuple[int, mp.mpf]],
    N: int,
    L: mp.mpf,
) -> dict[str, Any]:
    even, odd = _sector_bases(N)
    m0 = (
        mp.digamma(mp.mpf(1) / 4)
        - mp.log(mp.pi)
        - 2 * mp.fsum(value / mp.sqrt(n) for n, value in terms)
    )
    nonpole = Q - pole - m0 * mp.eye(2 * N + 1)
    A_plus = even.T * nonpole * even
    A_minus = odd.T * nonpole * odd
    pole_plus = even.T * pole * even
    pole_minus = odd.T * pole * odd
    p_plus, p_minus = analytic_pole_vectors(N, L)
    plus_values, plus_vectors = mp.eigsy((A_plus + A_plus.T) / 2)
    minus_values, _ = mp.eigsy((A_minus + A_minus.T) / 2)
    combined_values = sorted(list(plus_values) + list(minus_values))

    full_nonpole = _block_diagonal(A_plus, A_minus)
    w = mp.matrix(list(p_plus) + list(p_minus))
    constrained_basis = _orthogonal_complement(w / _norm(w))
    constrained_matrix = constrained_basis.T * full_nonpole * constrained_basis
    constrained_values, constrained_vectors = mp.eigsy(
        (constrained_matrix + constrained_matrix.T) / 2
    )
    zeta = constrained_values[0]
    plus_resolvent = _inverse(A_plus - zeta * mp.eye(A_plus.rows))
    minus_resolvent = _inverse(A_minus - zeta * mp.eye(A_minus.rows))
    F_plus = _dot(p_plus, plus_resolvent, p_plus)
    F_minus = _dot(p_minus, minus_resolvent, p_minus)
    critical_load = 1 / (2 * F_minus)

    phi = constrained_basis * constrained_vectors[:, 0]
    constrained_residual = (full_nonpole - zeta * mp.eye(full_nonpole.rows)) * phi
    gamma = (w.T * constrained_residual)[0] / (w.T * w)[0]
    alpha = (p_plus.T * phi[: A_plus.rows, :])[0]
    if gamma < 0:
        phi = -phi
        constrained_residual = -constrained_residual
        gamma = -gamma
        alpha = -alpha
    load_from_residual = -gamma / (2 * alpha)

    crossing_plus = A_plus + 2 * critical_load * p_plus * p_plus.T
    crossing_minus = A_minus - 2 * critical_load * p_minus * p_minus.T
    crossing_plus_ground = mp.eigsy(crossing_plus, eigvals_only=True)[0]
    crossing_minus_ground = mp.eigsy(crossing_minus, eigvals_only=True)[0]
    loaded_plus_one = A_plus + 2 * p_plus * p_plus.T
    loaded_minus_one = A_minus - 2 * p_minus * p_minus.T
    source_even_ground = mp.eigsy(loaded_plus_one, eigvals_only=True)[0]
    source_odd_ground = mp.eigsy(loaded_minus_one, eigvals_only=True)[0]
    trial_energy = _dot(phi, full_nonpole, phi)
    trial_constraint = (w.T * phi)[0]
    B_U = loaded_minus_one - trial_energy * mp.eye(A_minus.rows)
    B_U_floor = mp.eigsy((B_U + B_U.T) / 2, eigvals_only=True)[0]
    chi_U = _dot(p_minus, _inverse(B_U), p_minus)
    s_trial = 1 + 1 / (2 * chi_U)
    inverse_free_trial_reserve = 1 + B_U_floor / (2 * _norm(p_minus) ** 2)
    full_loaded_one = _block_diagonal(loaded_plus_one, loaded_minus_one)
    determinant_ratio = mp.det(
        full_loaded_one - zeta * mp.eye(full_loaded_one.rows)
    ) / mp.det(full_nonpole - zeta * mp.eye(full_nonpole.rows))
    square = (1 - 1 / critical_load) ** 2

    return {
        "m_lambda_0": m0,
        "nonpole_A_full": nonpole,
        "A_plus": A_plus,
        "A_minus": A_minus,
        "p_plus": p_plus,
        "p_minus_real_sine_coordinates": p_minus,
        "pole_even_rank_one_defect": _max_abs(pole_plus - 2 * p_plus * p_plus.T),
        "pole_odd_rank_one_defect": _max_abs(pole_minus + 2 * p_minus * p_minus.T),
        "nonpole_minimum": combined_values[0],
        "nonpole_second_eigenvalue_a2": combined_values[1],
        "nonpole_ground_even_margin": minus_values[0] - plus_values[0],
        "nonpole_ground_simplicity_gap": combined_values[1] - combined_values[0],
        "nonpole_ground_p_plus_overlap": abs((p_plus.T * plus_vectors[:, 0])[0]),
        "p_minus_norm": _norm(p_minus),
        "projected_exponential_w_norm": _norm(w),
        "constrained_matrix": constrained_matrix,
        "constrained_ground_zeta": zeta,
        "zeta_below_a2_margin": combined_values[1] - zeta,
        "zeta_distance_to_nonpole_spectrum": min(
            abs(value - zeta) for value in combined_values
        ),
        "F_plus_at_zeta": F_plus,
        "F_minus_at_zeta": F_minus,
        "paired_resolvent_signed_residual": F_plus + F_minus,
        "critical_load_s_c": critical_load,
        "critical_load_from_constrained_residual": load_from_residual,
        "critical_load_reconstruction_signed_residual": critical_load - load_from_residual,
        "critical_load_margin_s_c_minus_1": critical_load - 1,
        "source_unit_load_before_crossing_point_diagnostic": bool(critical_load > 1),
        "crossing_even_ground": crossing_plus_ground,
        "crossing_odd_ground": crossing_minus_ground,
        "crossing_even_minus_zeta": crossing_plus_ground - zeta,
        "crossing_odd_minus_zeta": crossing_minus_ground - zeta,
        "source_even_ground_at_load_1": source_even_ground,
        "source_odd_ground_at_load_1": source_odd_ground,
        "source_odd_minus_even_ground_gap": source_odd_ground - source_even_ground,
        "odd_labelled_factor_at_load_1": 1 - 2 * F_minus,
        "full_determinant_ratio_at_load_1": determinant_ratio,
        "perfect_square_value_at_load_1": square,
        "perfect_square_signed_residual": determinant_ratio - square,
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


def validate_contract(payload: dict[str, Any]) -> None:
    _reject_binary64(payload)
    _exact_keys(payload, TOP_LEVEL_KEYS, "top-level")
    if payload["schema"] != SCHEMA or payload["checkpoint_version"] != CHECKPOINT_VERSION:
        raise ReplayError("schema or checkpoint version mismatch")
    if payload["terminal_state"] != TERMINAL_STATE:
        raise ReplayError("terminal-state promotion rejected")
    if payload["claim_class"] != "FINITE_POINT_DIAGNOSTIC" or payload["analytic_uniform_claim"] is not False:
        raise ReplayError("finite diagnostic claim boundary changed")

    inputs = _exact_keys(
        payload["inputs"],
        {
            "lambda",
            "N",
            "precision_decimal_digits",
            "prolate_even_legendre_basis_size",
            "L",
            "profile_alpha_equals_u_over_r",
        },
        "inputs",
    )
    if _positive_rational_text(inputs["lambda"], "lambda") != 2 or inputs["N"] != 4:
        raise ReplayError("checkpoint source point changed")
    for key, minimum in (
        ("precision_decimal_digits", 40),
        ("prolate_even_legendre_basis_size", 12),
    ):
        if isinstance(inputs[key], bool) or not isinstance(inputs[key], int) or inputs[key] < minimum:
            raise ReplayError(f"invalid exact integer input {key}")
    _mp_text(inputs["L"], "inputs.L")
    if inputs["profile_alpha_equals_u_over_r"] != list(PROFILE_ALPHA_TEXTS):
        raise ReplayError("angle threshold profile changed")

    if payload["locked_conventions"] != LOCKED_CONVENTIONS:
        raise ReplayError("locked source convention changed")
    if payload["locked_formulas"] != LOCKED_FORMULAS:
        raise ReplayError("locked formula changed")
    if payload["provenance"] != PROVENANCE:
        raise ReplayError("producer provenance changed")
    if payload["limitations"] != LIMITATIONS:
        raise ReplayError("limitation boundary changed")
    if payload["dependency_sha256"] != dependency_hashes():
        raise ReplayError("dependency hash mismatch")
    runtime = _exact_keys(payload["runtime"], {"python", "mpmath"}, "runtime")
    if runtime != {"python": sys.version.split()[0], "mpmath": mp.__version__}:
        raise ReplayError("arithmetic runtime mismatch")

    hashes = _exact_keys(payload["section_sha256"], set(HASHED_SECTIONS), "section hashes")
    for name in HASHED_SECTIONS:
        if hashes[name] != _raw_hash(payload[name]):
            raise ReplayError(f"section hash mismatch: {name}")

    inventory = _exact_keys(
        payload["source_inventory"], {"modes", "prime_powers"}, "source inventory"
    )
    if inventory["modes"] != list(range(-4, 5)):
        raise ReplayError("mode inventory mismatch")
    expected_terms = lambda_terms(lambda_squared_floor_exact(inputs["lambda"]))
    supplied = inventory["prime_powers"]
    if (
        not isinstance(supplied, list)
        or len(supplied) != len(expected_terms)
        or not all(
            isinstance(item, dict) and set(item) == {"n", "von_mangoldt"}
            for item in supplied
        )
        or [item["n"] for item in supplied] != [n for n, _ in expected_terms]
    ):
        raise ReplayError("inclusive prime-power inventory mismatch")


def _scaled_difference(left: mp.mpf, right: mp.mpf) -> mp.mpf:
    return abs(left - right) / max(mp.mpf(1), abs(left), abs(right))


def _compare_tree(submitted: Any, expected: Any, path: str) -> mp.mpf:
    if isinstance(expected, mp.matrix):
        if (
            not isinstance(submitted, list)
            or len(submitted) != expected.rows
            or any(not isinstance(row, list) or len(row) != expected.cols for row in submitted)
        ):
            raise ReplayError(f"matrix shape mismatch: {path}")
        return max(
            (
                _scaled_difference(
                    _mp_text(submitted[i][j], f"{path}[{i},{j}]"), expected[i, j]
                )
                for i in range(expected.rows)
                for j in range(expected.cols)
            ),
            default=mp.mpf("0"),
        )
    if isinstance(expected, mp.mpf):
        return _scaled_difference(_mp_text(submitted, path), expected)
    if isinstance(expected, dict):
        if not isinstance(submitted, dict) or set(submitted) != set(expected):
            raise ReplayError(f"object inventory mismatch: {path}")
        return max(
            (_compare_tree(submitted[key], value, f"{path}.{key}") for key, value in expected.items()),
            default=mp.mpf("0"),
        )
    if isinstance(expected, list):
        if not isinstance(submitted, list) or len(submitted) != len(expected):
            raise ReplayError(f"list shape mismatch: {path}")
        return max(
            (
                _compare_tree(item, expected[index], f"{path}[{index}]")
                for index, item in enumerate(submitted)
            ),
            default=mp.mpf("0"),
        )
    if isinstance(expected, bool):
        if submitted is not expected:
            raise ReplayError(f"boolean mismatch: {path}")
        return mp.mpf("0")
    if isinstance(expected, int):
        if isinstance(submitted, bool) or submitted != expected:
            raise ReplayError(f"integer mismatch: {path}")
        return mp.mpf("0")
    if isinstance(expected, str):
        if submitted != expected:
            raise ReplayError(f"text mismatch: {path}")
        return mp.mpf("0")
    raise ReplayError(f"unsupported reconstructed value at {path}")


def replay_payload(payload: dict[str, Any], producer_sha256: str = "in_memory") -> dict[str, Any]:
    validate_contract(payload)
    inputs = payload["inputs"]
    dps = inputs["precision_decimal_digits"]
    mp.mp.dps = dps
    lambda_text = inputs["lambda"]
    N = inputs["N"]
    basis_size = inputs["prolate_even_legendre_basis_size"]
    lam_fraction = Fraction(lambda_text)
    lam = mp.mpf(lam_fraction.numerator) / lam_fraction.denominator
    L = 2 * mp.log(lam)
    tolerance = mp.power(10, -max(12, dps // 3))
    construction_tolerance = mp.power(10, -max(18, dps // 2))

    pole, arch, prime, Q, terms = matrix_from_source_transformed(lambda_text, N, dps)
    even, odd = _sector_bases(N)
    J = _inversion(N)
    prolate = prolate_quadrature(lambda_text, basis_size, dps)
    h = H(lambda_text, prolate[0], prolate[1])
    kappa, _coefficients, projection_error, projected_norm, _state_norm, _checks = projection(h, N)
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
    moment_columns = analytic_even_moment_columns(N, L, even_complement)
    profiles = _moment_profiles(B, residual, moment_columns, construction_tolerance)
    constrained = _constrained_ground(Q, pole, terms, N, L)

    expected_inventory = {
        "modes": list(range(-N, N + 1)),
        "prime_powers": [
            {"n": n, "von_mangoldt": value} for n, value in terms
        ],
    }
    expected_source = {
        "pole": pole,
        "archimedean_unsigned": arch,
        "prime_unsigned": prime,
        "Q_equals_pole_minus_arch_minus_prime": Q,
        "hermitian_defect": _max_abs(Q - Q.T),
        "inversion_commutator_defect": _max_abs(Q * J - J * Q),
    }
    expected_residual = {
        "a4": h.a4,
        "a0_lambda": h.a0,
        "h_zero_integral_defect": abs(
            h.a4 * h.integral(h.h4) - h.a0 * h.integral(h.h0)
        ),
        "projected_state_norm": projected_norm,
        "projection_error": projection_error,
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
    defects = {
        "inputs.L": _scaled_difference(_mp_text(inputs["L"], "inputs.L"), L),
        "source_inventory": _compare_tree(
            payload["source_inventory"], expected_inventory, "source_inventory"
        ),
        "source_geometry": _compare_tree(
            payload["source_geometry"], expected_source, "source_geometry"
        ),
        "residual_geometry": _compare_tree(
            payload["residual_geometry"], expected_residual, "residual_geometry"
        ),
        "moment_profiles": _compare_tree(
            payload["moment_profiles"], profiles, "moment_profiles"
        ),
        "constrained_ground": _compare_tree(
            payload["constrained_ground"], constrained, "constrained_ground"
        ),
    }

    profile_gates = all(
        record["floor_from_resolvent"] > 0
        and abs(record["floor_agreement_signed"]) <= construction_tolerance
        and abs(record["determinant_identity_signed_residual"]) <= construction_tolerance
        and all(
            angle["lower_slack"] >= -construction_tolerance
            and angle["upper_slack"] >= -construction_tolerance
            and angle["distance_to_nearest_B_eigenvalue"] > construction_tolerance
            for angle in record["angle_profile"]
        )
        for record in profiles
    )
    constrained_gates = {
        "source_matrix_hermitian_and_inversion_symmetric": bool(
            expected_source["hermitian_defect"] <= construction_tolerance
            and expected_source["inversion_commutator_defect"] <= construction_tolerance
        ),
        "raw_q_even_complement_positive": bool(B_values[0] > 0),
        "raw_q_odd_sector_positive": bool(odd_values[0] > 0),
        "moment_floor_and_angle_identities": bool(profile_gates),
        "pole_decomposition_matches_source": bool(
            constrained["pole_even_rank_one_defect"] <= construction_tolerance
            and constrained["pole_odd_rank_one_defect"] <= construction_tolerance
            and constrained["nonpole_reassembly_defect"] <= construction_tolerance
        ),
        "nonpole_ground_even_and_simple": bool(
            constrained["nonpole_minimum"] >= -construction_tolerance
            and
            constrained["nonpole_ground_even_margin"] > 0
            and constrained["nonpole_ground_simplicity_gap"] > 0
        ),
        "projected_pole_overlaps_nonzero": bool(
            constrained["nonpole_ground_p_plus_overlap"] > construction_tolerance
            and constrained["p_minus_norm"] > construction_tolerance
        ),
        "constrained_branch_nonexceptional": bool(
            constrained["zeta_below_a2_margin"] > 0
            and constrained["zeta_distance_to_nonpole_spectrum"] > 0
        ),
        "paired_resolvent_zero": bool(
            abs(constrained["paired_resolvent_signed_residual"])
            <= construction_tolerance
        ),
        "critical_load_reconstructed_twice": bool(
            constrained["critical_load_s_c"] > 0
            and abs(constrained["critical_load_reconstruction_signed_residual"])
            <= construction_tolerance
        ),
        "loaded_grounds_collide_at_zeta": bool(
            abs(constrained["crossing_even_minus_zeta"]) <= construction_tolerance
            and abs(constrained["crossing_odd_minus_zeta"]) <= construction_tolerance
        ),
        "labelled_source_load_orientation_consistent": bool(
            (constrained["critical_load_margin_s_c_minus_1"] > 0)
            == (constrained["source_odd_minus_even_ground_gap"] > 0)
            == (constrained["odd_labelled_factor_at_load_1"] > 0)
        ),
        "perfect_square_identity": bool(
            abs(constrained["perfect_square_signed_residual"])
            <= construction_tolerance
        ),
        "actual_ground_labelled_trial_regression": bool(
            constrained["labelled_trial_B_U_point_floor"] > 0
            and constrained["labelled_trial_chi_U"] > 0
            and abs(constrained["constrained_trial_norm_defect"])
            <= construction_tolerance
            and abs(constrained["constrained_trial_w_orthogonality_defect"])
            <= construction_tolerance
            and abs(constrained["constrained_trial_energy_minus_zeta"])
            <= construction_tolerance
            and abs(constrained["labelled_trial_load_bound_minus_s_c"])
            <= construction_tolerance
            and constrained["labelled_trial_is_point_only_not_interval"] is True
        ),
    }
    agrees = bool(
        all(value <= tolerance for value in defects.values())
        and all(constrained_gates.values())
    )
    if not agrees:
        raise ReplayError("independent replay disagreement or reconstructed finite gate failure")

    result = {
        "schema": REPLAY_SCHEMA,
        "checkpoint_version": CHECKPOINT_VERSION,
        "terminal_state": TERMINAL_STATE,
        "claim_class": "FINITE_POINT_DIAGNOSTIC",
        "analytic_uniform_claim": False,
        "producer_sha256": producer_sha256,
        "replay_agrees": True,
        "tolerance": mp.nstr(tolerance, dps),
        "max_scaled_defect": mp.nstr(max(defects.values()), dps),
        "scaled_defects": {
            name: mp.nstr(value, dps) for name, value in defects.items()
        },
        "independently_reconstructed_gates": constrained_gates,
        "independent_selected_values": {
            "q": mp.nstr(q, dps),
            "r": mp.nstr(residual, dps),
            "m1_floor": mp.nstr(profiles[0]["floor_from_resolvent"], dps),
            "m4_floor": mp.nstr(profiles[-1]["floor_from_resolvent"], dps),
            "m1_r_over_floor": mp.nstr(profiles[0]["r_over_floor"], dps),
            "m4_r_over_floor": mp.nstr(profiles[-1]["r_over_floor"], dps),
            "constrained_ground_zeta": mp.nstr(
                constrained["constrained_ground_zeta"], dps
            ),
            "critical_load_s_c": mp.nstr(constrained["critical_load_s_c"], dps),
            "critical_load_margin_s_c_minus_1": mp.nstr(
                constrained["critical_load_margin_s_c_minus_1"], dps
            ),
            "source_odd_minus_even_ground_gap": mp.nstr(
                constrained["source_odd_minus_even_ground_gap"], dps
            ),
            "labelled_trial_B_U_point_floor": mp.nstr(
                constrained["labelled_trial_B_U_point_floor"], dps
            ),
            "labelled_trial_chi_U": mp.nstr(
                constrained["labelled_trial_chi_U"], dps
            ),
            "labelled_trial_load_lower_bound": mp.nstr(
                constrained["labelled_trial_load_lower_bound"], dps
            ),
        },
        "independent_formula_paths": {
            "source_matrix": "closed pole formula; x=L*t^2 transformed archimedean quadrature with analytic origin value and no finite-epsilon surrogate; independent prime-factor inventory",
            "prolate_state": "differential-form prolate matrix and independent arithmetic projection",
            "physical_moments": "closed endpoint recurrence for even monomial Fourier coefficients",
            "pole_vectors": "closed Fourier coefficients for cosh and phase-adjusted sinh",
        },
        "shared_arithmetic_library_limitation": (
            "producer and verifier both use mpmath transcendental arithmetic and eigsy; "
            "their source, state, moment, and pole-vector formula trees are independent"
        ),
        "runtime": {
            "python": sys.version.split()[0],
            "mpmath": mp.__version__,
        },
        "dependency_sha256": dependency_hashes(),
    }
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
    arguments.output.write_text(text)
    print(text, end="")


if __name__ == "__main__":
    main()
