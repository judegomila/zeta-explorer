#!/usr/bin/env python3
"""Checkpoint 0.64 finite secant and reciprocal-tail diagnostic.

The producer is locked to ``lambda=2, N=4, T=1`` and reconstructs the
source matrix, source-normalized prolate anchor, limiting arithmetic anchor,
and fixed-window matrix from source parameters.  It is arbitrary-precision
point arithmetic, not an interval enclosure or an asymptotic result.

The limiting anchor is projected by direct x-quadrature of

    E(h)(exp(x)) = exp(x/2) sum_{m>=1} h(m exp(x)),

with a deliberately excessive Gaussian cutoff recorded in the output.  The
independent replay exchanges the sum and integral and uses incomplete-gamma
antiderivatives instead.
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

from prolate_state import (
    hermite_limit_h,
    projected_even_state,
    source_combination,
)
from weil_matrix import blocks_direct, inversion, max_abs, parse_decimal


ROOT = Path(__file__).resolve().parents[1]
SCHEMA = "xi-prolate-checkpoint064-reciprocal-secant-v1"
CHECKPOINT_VERSION = "0.64.0-reciprocal-secant-point"
TERMINAL_STATE = "P0_INVALIDATED"
PROLATE_BASIS_SIZE = 30
ARITHMETIC_SUM_CUTOFF = 32

DEPENDENCIES = (
    "P0_SOURCE_LOCK.json",
    "P0_NORMALIZATION_AUDIT.md",
    "vendor/CCM-ZST-2511.22755v1.pdf",
    "vendor/CCM-PROLATE-2310.18423v2.pdf",
    "notes/DIRECT_SOFT_TRACE_RECIPROCAL_RESERVE.md",
    "notes/PROLATE_SECANT_RADICAL_BLOCK_REDUCTION.md",
    "notes/TRANSVERSE_XI_RADICAL_MOMENT_ANGLE_OBSTRUCTION.md",
    "src/checkpoint064_reciprocal_secant.py",
    "src/prolate_state.py",
    "src/weil_matrix.py",
    "verifier/checkpoint064_reciprocal_secant_replay.py",
    "verifier/independent_replay.py",
    "verifier/residual_ridged_fixed_window_replay.py",
)

PINNED_SOURCE_SHA256 = {
    "P0_SOURCE_LOCK.json": "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md": "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
    "vendor/CCM-ZST-2511.22755v1.pdf": "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b",
    "vendor/CCM-PROLATE-2310.18423v2.pdf": "8bc197642ee9ca4f2393b6cbfd3db292be6a315ce76ad61bfb845d9fedb47f2e",
}

LOCKED_CONVENTIONS = {
    "source_point": "lambda=2, N=4, T=1 only; 40 or 80 decimal digits",
    "physical_interval": "[-L/2,L/2], L=2*log(lambda), Lebesgue measure and zero extension",
    "fourier_transform": "hat(f)(t)=integral f(x)*exp(-i*t*x) dx",
    "centered_modes": "V_n(x)=(-1)^n*L^(-1/2)*exp(+2*pi*i*n*x/L)",
    "inversion": "reflection J*V_n=V_-n is retained",
    "prime_inventory": "every prime power 1<n<=lambda^2, endpoint inclusive",
    "prime_block_sign": "Q=pole-archimedean-prime; source equation (3.19) minus sign retained",
    "source_normalization": "h_lambda=a4*h4-a0(lambda)*h0 with source-limit a4; unit normalization rejected",
    "limiting_state": "K_infinity(x)=E(h)(exp(x)), h=source-normalized Hermite 0/4 limit",
    "parameter_ingestion": "exact text without binary64",
}

LOCKED_FORMULAS = {
    "secant": "z0=P_N C_lambda K_infinity; t=(I-kappa*kappa^T)z0; beta=||t||; omega=t/beta",
    "complement": "q=<kappa,Q*kappa>; b=P_perp(Q-qI)kappa; r=||b||; B=P_perp(Q-qI)P_perp",
    "secant_energy": "epsilon=<omega,B*omega>; c2=<omega,K_T*omega>; d=<omega,b>",
    "D0_identity": "D0=<z0,(Q-qI)z0>=2*alpha*beta*d+beta^2*epsilon",
    "residual_split": "r^2=d^2+||b_perp||^2",
    "soft_trace": "S=tr(r*(B+rI)^(-1)*K_T)",
    "reciprocal": "H0=tr(B^(-1)*K_T); S<=r*H0",
    "block_lower": "S>=c2*r/(epsilon+r)",
    "crowding_reserve": "R=((epsilon+r)*S)/(c2*r)>=1",
    "tail_profile": "Phi(u)=sum_(beta_j<=u) k_j; H(u)=sum_(beta_j>u) k_j/beta_j; S<=Phi(u)+r*H(u)",
}

PROVENANCE = {
    "cached_matrix_read": False,
    "cached_eigensystem_read": False,
    "zeta_zero_table_read": False,
    "global_weil_positivity_assumed": False,
    "binary64_parameter_used": False,
    "asymptotic_claim_made": False,
    "producer_source_path": "blocks_direct distributional source assembly",
    "producer_prolate_path": "normalized Legendre recurrence",
    "producer_time_band_path": "direct evaluation-vector quadrature",
    "producer_limiting_state_path": "direct x-quadrature of a convergent arithmetic sum",
}

LIMITATIONS = [
    "finite arbitrary-precision point diagnostic, not an interval or ball enclosure",
    "producer and verifier share mpmath transcendental arithmetic and eigsy",
    "the source-normalized prolate state is a fixed 30-mode Galerkin truncation without a tail enclosure; independent assembly checks the same finite subspace, not exact eigenfunction convergence",
    "the Gaussian-tail bound expressions are nondirected mpmath point values, not outward-rounded upper endpoints",
    "no unbounded source schedule and no extrapolated exponent claim",
    "no locally uniform determinant convergence is inferred",
]


class Checkpoint064Error(ValueError):
    """Fail-closed input, source-gate, or identity error."""


def _sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1 << 20), b""):
            digest.update(chunk)
    return digest.hexdigest()


def validate_pinned_source_hashes(actual: dict[str, str]) -> None:
    for name, expected in PINNED_SOURCE_SHA256.items():
        if actual.get(name) != expected:
            raise Checkpoint064Error(f"pinned source hash mismatch: {name}")


def dependency_hashes() -> dict[str, str]:
    actual = {name: _sha256_file(ROOT / name) for name in DEPENDENCIES}
    validate_pinned_source_hashes(actual)
    return actual


def _raw_hash(value: Any) -> str:
    raw = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("ascii")
    return hashlib.sha256(raw).hexdigest()


def _parse_positive_text(value: Any, label: str) -> mp.mpf:
    if not isinstance(value, str):
        raise TypeError(f"{label} must be exact text; binary64 is forbidden")
    try:
        rational = Fraction(value)
    except (ValueError, ZeroDivisionError) as exc:
        raise Checkpoint064Error(f"invalid exact {label}") from exc
    if rational <= 0:
        raise Checkpoint064Error(f"{label} must be positive")
    return mp.mpf(rational.numerator) / rational.denominator


def _require_integer(value: Any, label: str) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{label} must be an exact integer")
    return value


def _dot(x: mp.matrix, A: mp.matrix, y: mp.matrix) -> mp.mpf:
    return (x.T * A * y)[0]


def _norm(x: mp.matrix) -> mp.mpf:
    return mp.sqrt(mp.fsum(abs(x[i]) ** 2 for i in range(x.rows)))


def _trace(A: mp.matrix) -> mp.mpf:
    return mp.fsum(A[i, i] for i in range(min(A.rows, A.cols)))


def _inverse(A: mp.matrix) -> mp.matrix:
    if A.rows != A.cols:
        raise Checkpoint064Error("matrix inverse requires a square matrix")
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
        raise Checkpoint064Error("invalid unit vector for orthogonal complement")
    e0 = mp.matrix(unit.rows, 1)
    e0[0] = 1
    sign = 1 if unit[0] >= 0 else -1
    vector = unit + sign * e0
    denominator = (vector.T * vector)[0]
    if denominator == 0:
        raise Checkpoint064Error("Householder complement is singular")
    return (mp.eye(unit.rows) - 2 * vector * vector.T / denominator)[:, 1:]


def _centered_mode_transform(n: int, t: mp.mpf, L: mp.mpf) -> mp.mpf:
    omega = 2 * mp.pi * n / L
    if t == omega:
        return mp.power(-1, n) * mp.sqrt(L)
    return 2 * mp.sin(t * L / 2) / (mp.sqrt(L) * (t - omega))


def _time_band_nodes(N: int, L: mp.mpf, T: mp.mpf) -> list[mp.mpf]:
    nodes = {-T, mp.mpf("0"), T}
    for n in range(-N, N + 1):
        omega = 2 * mp.pi * n / L
        if -T < omega < T:
            nodes.add(omega)
    return sorted(nodes)


def _time_band_direct(
    N: int, L: mp.mpf, T: mp.mpf, even_complement: mp.matrix
) -> tuple[mp.matrix, list[mp.mpf]]:
    even, _ = _sector_bases(N)
    modes = list(range(-N, N + 1))
    nodes = _time_band_nodes(N, L, T)

    def evaluation(t: mp.mpf) -> mp.matrix:
        full = mp.matrix([_centered_mode_transform(n, t, L) for n in modes])
        return even_complement.T * even.T * full

    K = mp.matrix(even_complement.cols)
    for i in range(K.rows):
        for j in range(i, K.cols):
            value = mp.fsum(
                mp.quad(
                    lambda t, i=i, j=j: evaluation(t)[i] * evaluation(t)[j],
                    [left, right],
                )
                for left, right in zip(nodes[:-1], nodes[1:])
            ) / (2 * mp.pi)
            K[i, j] = K[j, i] = value
    return K, nodes


def _limiting_arithmetic_state(x: mp.mpf, cutoff: int) -> mp.mpf:
    u = mp.exp(x)
    return mp.sqrt(u) * mp.fsum(
        hermite_limit_h(m * u) for m in range(1, cutoff + 1)
    )


def _limiting_tail_bound(lambda_value: mp.mpf, cutoff: int) -> mp.mpf:
    """Uniform absolute bound for the omitted arithmetic sum on the window.

    For ``u in [1/lambda,lambda]`` and this locked point, the Gaussian
    polynomial envelope is decreasing throughout the omitted range.
    """
    if lambda_value != 2 or cutoff < 8:
        raise Checkpoint064Error("limiting-tail bound is locked to lambda=2")

    def envelope_index(x: mp.mpf) -> mp.mpf:
        y = x / 2
        return (
            mp.pi**2 * y**4 + mp.mpf("1.5") * mp.pi * y**2
        ) * mp.exp(-mp.pi * y**2)

    start = mp.mpf(cutoff + 1)
    series_tail = envelope_index(start) + mp.quad(
        envelope_index, [start, mp.inf]
    )
    return mp.sqrt(2) * series_tail


def _limiting_projection_direct(
    N: int, L: mp.mpf, cutoff: int
) -> tuple[mp.matrix, mp.mpf, mp.mpf]:
    ell = L / 2
    coefficients: list[mp.mpf] = []
    for n in range(N + 1):
        omega = 2 * mp.pi * n / L
        value = (
            mp.power(-1, n)
            / mp.sqrt(L)
            * mp.quad(
                lambda x, omega=omega: _limiting_arithmetic_state(x, cutoff)
                * mp.cos(omega * x),
                [-ell, 0, ell],
            )
        )
        coefficients.append(value)
    vector = mp.matrix([coefficients[abs(n)] for n in range(-N, N + 1)])
    pointwise_tail = _limiting_tail_bound(mp.mpf(2), cutoff)
    coefficient_tail = mp.sqrt(L) * pointwise_tail
    return vector, pointwise_tail, coefficient_tail


def _spectral_profile(
    B: mp.matrix,
    K: mp.matrix,
    r: mp.mpf,
    epsilon: mp.mpf,
    soft_trace: mp.mpf,
) -> dict[str, Any]:
    eigenvalues, eigenvectors = mp.eigsy((B + B.T) / 2)
    spectral_K = eigenvectors.T * K * eigenvectors
    weights = [spectral_K[j, j] for j in range(B.rows)]
    thresholds: list[tuple[str, mp.mpf]] = [
        ("half_minimum_B_eigenvalue", eigenvalues[0] / 2),
        ("ridge_r", r),
        ("secant_energy_epsilon", epsilon),
    ]
    for j in range(B.rows - 1):
        thresholds.append(
            (f"geometric_gap_{j}_{j + 1}", mp.sqrt(eigenvalues[j] * eigenvalues[j + 1]))
        )
    thresholds.append(("twice_maximum_B_eigenvalue", 2 * eigenvalues[-1]))

    records = []
    for label, threshold in thresholds:
        phi = mp.mpf("0")
        reciprocal_tail = mp.mpf("0")
        rank = 0
        for eigenvalue, weight in zip(eigenvalues, weights):
            if eigenvalue <= threshold:
                phi += weight
                rank += 1
            else:
                reciprocal_tail += weight / eigenvalue
        upper = phi + r * reciprocal_tail
        records.append(
            {
                "label": label,
                "u": threshold,
                "low_rank": rank,
                "Phi": phi,
                "H_reciprocal_tail": reciprocal_tail,
                "Phi_plus_rH": upper,
                "upper_minus_soft_trace": upper - soft_trace,
            }
        )

    return {
        "B_eigenvalues": eigenvalues,
        "K_weights_in_B_eigenbasis": mp.matrix(weights),
        "K_weight_sum": mp.fsum(weights),
        "soft_trace_from_spectral_weights": mp.fsum(
            r * weight / (eigenvalue + r)
            for eigenvalue, weight in zip(eigenvalues, weights)
        ),
        "H0_from_spectral_weights": mp.fsum(
            weight / eigenvalue for eigenvalue, weight in zip(eigenvalues, weights)
        ),
        "reciprocal_tail_profile": records,
    }


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


def produce(
    lambda_text: str,
    N: int,
    T_text: str,
    dps: int,
    prolate_basis_size: int = PROLATE_BASIS_SIZE,
    arithmetic_sum_cutoff: int = ARITHMETIC_SUM_CUTOFF,
) -> dict[str, Any]:
    if not isinstance(lambda_text, str) or not isinstance(T_text, str):
        raise TypeError("lambda and T must be exact text; binary64 is forbidden")
    _require_integer(N, "N")
    _require_integer(dps, "precision")
    _require_integer(prolate_basis_size, "prolate basis size")
    _require_integer(arithmetic_sum_cutoff, "arithmetic sum cutoff")
    if Fraction(lambda_text) != 2 or N != 4 or Fraction(T_text) != 1:
        raise Checkpoint064Error("checkpoint 0.64 is locked to lambda=2, N=4, T=1")
    if dps not in (40, 80):
        raise Checkpoint064Error("checkpoint 0.64 permits only 40 or 80 decimal digits")
    if prolate_basis_size != PROLATE_BASIS_SIZE:
        raise Checkpoint064Error("checkpoint 0.64 prolate basis size must be 30")
    if arithmetic_sum_cutoff != ARITHMETIC_SUM_CUTOFF:
        raise Checkpoint064Error("checkpoint 0.64 arithmetic cutoff must be 32")

    mp.mp.dps = dps
    lam = parse_decimal(lambda_text)
    T = _parse_positive_text(T_text, "T")
    L = 2 * mp.log(lam)
    tolerance = mp.power(10, -max(12, dps // 3))
    construction_tolerance = mp.power(10, -max(18, dps // 2))

    modes, terms, pole, arch, prime, Q = blocks_direct(lambda_text, N, dps)
    J = inversion(N)
    even, odd = _sector_bases(N)

    h_lambda = source_combination(lambda_text, prolate_basis_size, dps, "recurrence")
    projection = projected_even_state(h_lambda, N)
    kappa = projection["kappa"]
    kappa_even = even.T * kappa
    complement = _orthogonal_complement(kappa_even)
    Q_even = even.T * Q * even
    Q_odd = odd.T * Q * odd
    q = _dot(kappa, Q, kappa)
    b = complement.T * (Q_even * kappa_even - q * kappa_even)
    r = _norm(b)
    B = complement.T * Q_even * complement - q * mp.eye(N)
    odd_shifted = Q_odd - q * mp.eye(N)
    B_values, _ = mp.eigsy((B + B.T) / 2)
    odd_values, _ = mp.eigsy((odd_shifted + odd_shifted.T) / 2)
    if not (r > 0 and B_values[0] > 0 and odd_values[0] > 0):
        raise Checkpoint064Error("raw-q residual or strict finite sector gate failed")

    z0, arithmetic_tail, coefficient_tail = _limiting_projection_direct(
        N, L, arithmetic_sum_cutoff
    )
    alpha = (kappa.T * z0)[0]
    secant = z0 - alpha * kappa
    beta = _norm(secant)
    if not beta > 0:
        raise Checkpoint064Error("limiting-anchor secant vanished")
    omega_full = secant / beta
    omega = complement.T * even.T * omega_full
    omega_norm_defect = abs(_norm(omega) - 1)
    epsilon = _dot(omega, B, omega)
    d = (omega.T * b)[0]
    b_perp = b - d * omega
    b_perp_norm = _norm(b_perp)
    D0 = _dot(z0, Q - q * mp.eye(2 * N + 1), z0)
    D0_rhs = 2 * alpha * beta * d + beta**2 * epsilon

    K, quadrature_nodes = _time_band_direct(N, L, T, complement)
    K_values, _ = mp.eigsy((K + K.T) / 2)
    c2 = _dot(omega, K, omega)
    B_inverse = _inverse(B)
    regularized_inverse = _inverse(B + r * mp.eye(N))
    soft_trace = _trace(r * regularized_inverse * K)
    H0 = _trace(B_inverse * K)
    reciprocal_upper = r * H0
    block_lower = c2 * r / (epsilon + r)
    tilted_remainder = soft_trace - block_lower
    crowding_reserve = (epsilon + r) * soft_trace / (c2 * r)
    profile = _spectral_profile(B, K, r, epsilon, soft_trace)

    source_inventory_numeric = {
        "modes": modes,
        "prime_powers": [
            {"n": n, "von_mangoldt": value} for n, value in terms
        ],
    }
    source_geometry_numeric = {
        "pole": pole,
        "archimedean_unsigned": arch,
        "prime_unsigned": prime,
        "Q_equals_pole_minus_archimedean_minus_prime": Q,
        "hermitian_defect": max_abs(Q - Q.T),
        "inversion_commutator_defect": max_abs(Q * J - J * Q),
        "q": q,
        "residual_r": r,
        "residual_vector_even_complement": b,
        "B_even_complement_at_q": B,
        "B_eigenvalues": B_values,
        "even_gap_at_q": B_values[0],
        "odd_gap_at_q": odd_values[0],
        "K_T_even_complement": K,
        "K_T_eigenvalue_min": K_values[0],
        "K_T_eigenvalue_max": K_values[-1],
        "K_T_hermitian_defect": max_abs(K - K.T),
        "time_band_quadrature_nodes": quadrature_nodes,
    }
    normalization_numeric = {
        "a4": h_lambda.a4,
        "a0_lambda": h_lambda.a0,
        "h_lambda_zero_integral_defect": abs(h_lambda.integral()),
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
        "projected_state_norm": projection["projected_norm"],
        "projection_error": projection["projection_error"],
        "kappa_modes_minusN_to_N": kappa,
        "kappa_inversion_even_defect": _norm(J * kappa - kappa),
        "limiting_arithmetic_sum_cutoff": arithmetic_sum_cutoff,
        "limiting_arithmetic_pointwise_tail_bound_point_value": arithmetic_tail,
        "limiting_projection_coefficient_tail_bound_point_value": coefficient_tail,
        "unit_normalized_replacement_allowed": False,
    }
    secant_numeric = {
        "z0_limiting_projection_modes_minusN_to_N": z0,
        "z0_inversion_even_defect": _norm(J * z0 - z0),
        "alpha": alpha,
        "secant_t_modes_minusN_to_N": secant,
        "secant_kappa_orthogonality_defect": abs((kappa.T * secant)[0]),
        "beta": beta,
        "lambda_squared_times_beta": lam**2 * beta,
        "omega_even_complement": omega,
        "omega_norm_defect": omega_norm_defect,
        "epsilon": epsilon,
        "c2_fixed_window_capture": c2,
        "d_signed_residual_coordinate": d,
        "d_over_r_signed": d / r,
        "captured_residual_fraction_d2_over_r2": d**2 / r**2,
        "b_perp_even_complement": b_perp,
        "b_perp_norm": b_perp_norm,
        "b_perp_fraction_squared": b_perp_norm**2 / r**2,
        "residual_pythagoras_signed_residual": r**2 - d**2 - b_perp_norm**2,
        "D0_direct": D0,
        "D0_secant_rhs": D0_rhs,
        "D0_identity_signed_residual": D0 - D0_rhs,
        "r_over_epsilon": r / epsilon,
        "L_3_over_2_times_r_over_epsilon": L ** mp.mpf("1.5") * r / epsilon,
    }
    reciprocal_numeric = {
        "soft_trace_S": soft_trace,
        "scaled_soft_trace_L_3_over_2": L ** mp.mpf("1.5") * soft_trace,
        "H0_reciprocal_trace": H0,
        "r_times_H0_upper": reciprocal_upper,
        "rH0_minus_soft_trace": reciprocal_upper - soft_trace,
        "one_vector_block_lower": block_lower,
        "soft_trace_minus_block_lower_tilted_remainder": tilted_remainder,
        "reciprocal_crowding_reserve": crowding_reserve,
        "crowding_reserve_minus_one": crowding_reserve - 1,
    }

    encoded_sections = {
        "source_inventory": _encode(source_inventory_numeric, dps),
        "source_geometry": _encode(source_geometry_numeric, dps),
        "normalization": _encode(normalization_numeric, dps),
        "secant_geometry": _encode(secant_numeric, dps),
        "reciprocal_soft_trace": _encode(reciprocal_numeric, dps),
        "spectral_profile": _encode(profile, dps),
    }

    scale_D0 = max(mp.mpf(1), abs(D0), abs(D0_rhs))
    if source_geometry_numeric["hermitian_defect"] > construction_tolerance:
        raise Checkpoint064Error("source matrix is not Hermitian")
    if source_geometry_numeric["inversion_commutator_defect"] > construction_tolerance:
        raise Checkpoint064Error("source matrix does not commute with inversion")
    if normalization_numeric["kappa_inversion_even_defect"] > construction_tolerance:
        raise Checkpoint064Error("source-normalized anchor is not inversion even")
    if secant_numeric["z0_inversion_even_defect"] > construction_tolerance:
        raise Checkpoint064Error("limiting anchor projection is not inversion even")
    if secant_numeric["secant_kappa_orthogonality_defect"] > construction_tolerance:
        raise Checkpoint064Error("secant orthogonalization failed")
    if omega_norm_defect > construction_tolerance:
        raise Checkpoint064Error("secant normalization failed")
    if abs(D0 - D0_rhs) > construction_tolerance * scale_D0:
        raise Checkpoint064Error("D0 secant identity failed")
    if abs(r**2 - d**2 - b_perp_norm**2) > construction_tolerance:
        raise Checkpoint064Error("residual Pythagoras failed")
    if K_values[0] < -tolerance or K_values[-1] > 1 + tolerance:
        raise Checkpoint064Error("K_T is not a positive contraction")
    if not (epsilon > 0 and c2 > 0 and H0 > 0):
        raise Checkpoint064Error("secant energy, capture, or reciprocal trace is nonpositive")
    if reciprocal_upper < soft_trace - tolerance:
        raise Checkpoint064Error("reciprocal upper bound failed")
    if block_lower > soft_trace + tolerance or tilted_remainder < -tolerance:
        raise Checkpoint064Error("one-vector block lower bound failed")
    if crowding_reserve < 1 - tolerance:
        raise Checkpoint064Error("reciprocal crowding reserve fell below one")
    if abs(profile["soft_trace_from_spectral_weights"] - soft_trace) > tolerance:
        raise Checkpoint064Error("spectral soft-trace reconstruction failed")
    if abs(profile["H0_from_spectral_weights"] - H0) > tolerance:
        raise Checkpoint064Error("spectral reciprocal reconstruction failed")
    if any(
        record["upper_minus_soft_trace"] < -tolerance
        for record in profile["reciprocal_tail_profile"]
    ):
        raise Checkpoint064Error("reciprocal-tail upper profile failed")

    return {
        "schema": SCHEMA,
        "checkpoint_version": CHECKPOINT_VERSION,
        "terminal_state": TERMINAL_STATE,
        "claim_class": "FINITE_POINT_DIAGNOSTIC",
        "analytic_uniform_claim": False,
        "inputs": {
            "lambda": lambda_text,
            "N": N,
            "T": T_text,
            "precision_decimal_digits": dps,
            "prolate_even_legendre_basis_size": prolate_basis_size,
            "limiting_arithmetic_sum_cutoff": arithmetic_sum_cutoff,
            "L": mp.nstr(L, dps),
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
            name: _raw_hash(value) for name, value in encoded_sections.items()
        },
        "limitations": LIMITATIONS,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lambda", dest="lambda_text", required=True)
    parser.add_argument("--N", type=int, required=True)
    parser.add_argument("--T", dest="T_text", required=True)
    parser.add_argument("--dps", type=int, required=True)
    parser.add_argument("--prolate-basis-size", type=int, default=PROLATE_BASIS_SIZE)
    parser.add_argument("--arithmetic-sum-cutoff", type=int, default=ARITHMETIC_SUM_CUTOFF)
    parser.add_argument("--output", type=Path, required=True)
    arguments = parser.parse_args()
    result = produce(
        arguments.lambda_text,
        arguments.N,
        arguments.T_text,
        arguments.dps,
        arguments.prolate_basis_size,
        arguments.arithmetic_sum_cutoff,
    )
    text = json.dumps(result, indent=2, sort_keys=True, allow_nan=False) + "\n"
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(text)
    print(text, end="")


if __name__ == "__main__":
    main()
