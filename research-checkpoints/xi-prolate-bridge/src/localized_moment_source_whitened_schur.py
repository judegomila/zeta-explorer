#!/usr/bin/env python3
"""Produce exact models for the localized-moment/source-Schur checkpoint.

The artifact contains exact rational theorem regressions.  It is not a
physical prolate--Weil pilot and makes no asymptotic or RH claim.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from math import isqrt
from pathlib import Path
import re
from typing import Any


SCHEMA = "xi-prolate-localized-moment-source-whitened-schur-v1"
STATUS = "LOCALIZED_MOMENT_SOURCE_WHITENED_SCHUR_COMPONENT"
RESULT = "LOCALIZED_MOMENT_SOURCE_WHITENED_SCHUR_COMPONENT_PASS"
TERMINAL_STATE = "P0_INVALIDATED"
NOTE = "notes/LOCALIZED_MOMENT_SOURCE_WHITENED_SCHUR.md"
LOCK = "LOCALIZED_MOMENT_SOURCE_WHITENED_SCHUR_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-localized-moment-source-whitened-schur-source-lock-v1"

PINNED_HASHES = {
    NOTE: "39695c4823f19f1a03b9e9434a88763564cc0e2e086a12b65412d2551b5f4982",
    LOCK: "fd8b2296e653910fd72ea6d1311e3f1512bfd697f5ea91d3d763f71013f51941",
}
_SHA256 = re.compile(r"^[0-9a-f]{64}$")

LOCKED_CONVENTIONS = {
    "source_interval": "[-lambda,lambda] with Lebesgue measure and zero extension; the physical logarithmic interval is [-log(lambda),log(lambda)]",
    "fourier_sign": "fhat(t)=integral f(y)*exp(-i*t*y) dy and Plancherel measure is dt/(2*pi)",
    "prime_endpoint": "every prime power n<=lambda^2 is included and translations at magnitude 2*log(lambda) vanish by zero extension",
    "prime_sign": "m_lambda=2*theta_prime-2*sum Lambda(n)/sqrt(n)*cos(t*log(n))",
    "inversion": "multiplicatively Jf(u)=f(u^(-1)); in the additive logarithmic coordinate Jf(y)=f(-y)",
    "source_normalization": "all prolate combinations use the source zero-Lebesgue-integral normalization, never unit normalization",
    "strictness": "equality in a high margin, theta=1, rho=g, or a zero quotient-relative floor is a rejection",
    "finite_parity": "Fourier residue class is not identified with inversion parity at finite lambda; (I+J)/2 and (I-J)/2 remain explicit",
    "artifact_scope": "p and dps label exact rational theorem-regression models, not physical prolate-Weil pilot matrices or an asymptotic schedule",
    "arithmetic": "all component matrices, selector weights, moments, contractions, and reserves are exact reduced rationals; binary64 JSON numbers are forbidden",
}

LOCKED_FORMULAS = {
    "upper_one_dual": "sup_(0<=alpha<=1,int alpha=1) int alpha*x*dmu = inf_a(a+int(x-a)_+*dmu)",
    "localized_prime_energy": "Mtop_H=sup_alpha int alpha*S_lambda^2*dmu_H and abs(ell_H(w)-ell_H(b))<=2*sqrt(Mtop_H)",
    "lower_one_variance": "ell_mu(w)>=m-sigma*sqrt(d-1), m=d^(-1)int w*dmu, sigma^2=d^(-1)int(w-m)^2*dmu",
    "stop_loss_witness": "for d>1 and sigma>0, eta=d*sigma/(2*sqrt(d-1)), g=m+(2-d)*sigma/(2*sqrt(d-1)), and V(g)<=eta",
    "matrix_variance": "lambda_min(A)>=tr(A)/n-sqrt((n-1)/n*tr((A-tr(A)I/n)^2))",
    "trace_square": "tr((P_H*T_w*P_H)^2)=double_integral w(s)w(t)|K_H(s,t)|^2 ds dt/(2*pi)^2",
    "source_metric": "on X0=(ker A)^perp, Delta=(AA*)^dagger on K=ran(A) and <Ax,Delta Ax>=||x||^2",
    "positive_source": "G_plus=g*A* A+(Q_X*X_K*A)*(Q_X*X_K*A), never g*I unless A is an isometry",
    "shorted_contraction": "A*S_sh*A=G_plus-N*N with N=(I-Y_H*Y_H*/g)^(-1/2)*Y_K*A; theta=||N*G_plus^(-1/2)||^2<1",
    "full_signed_feature": "for B=gI+F*J*F and M_H=J+F_H*F_H*/g, S_B=gI+F_K*M_H^(-1)*F_K",
    "full_signed_contraction": "if M_H^(-1)=L_plus-L_minus, G=g*A*A+(sqrt(L_plus)*F_K*A)*(sqrt(L_plus)*F_K*A), N=sqrt(L_minus)*F_K*A, then B>0 iff B_HH>0 and ||N*G^(-1/2)||^2<1",
    "coframe_necessity": "gI-R_KK+C_/K>=mu*Delta implies A*A>=mu/(g+||C_/K||)*I",
}

CLAIM_SCOPE = {
    "proved": [
        "the upper-one stop-gain dual and localized prime-energy sharpening of the trimmed-mean comparison",
        "the sharp lower-one mean--variance floor with explicit strict stop-loss witnesses and edge cases",
        "the Hermitian trace--variance minimum-eigenvalue floor and its projection-kernel trace-square reconstruction",
        "the exact source-whitened positive-shorted contraction criterion with the g*A*A source metric retained",
        "the exact complete signature-feature Schur identity and contraction criterion for the original signed operator",
        "the quantitative physical coframe necessity and exact rational separation models",
    ],
    "not_proved": [
        "a localized prime-energy or covariance margin on a common unbounded schedule",
        "the prescribed separate 0 mod 4 even and 2 mod 4 odd growing prolate coframes",
        "a growing-label physical coframe constant",
        "a source-whitened contraction reserve for the physical prolate--Weil operator",
        "a positive signed floor in either parity sector",
        "equation (5.2) of DIRECT_RH_ATTACK.md",
        "locally uniform determinant convergence",
        "the Riemann hypothesis",
    ],
}

SOURCE_ADMISSIONS = {
    "binary64_parameters_used": False,
    "cached_weil_matrix_read": False,
    "zeta_zero_table_read": False,
    "zeros_assumed_real": False,
    "global_weil_positivity_assumed": False,
    "prime_power_endpoint_omitted": False,
    "lambda_squared_mixed_with_lambda": False,
    "prime_block_sign_changed": False,
    "inversion_reflection_dropped": False,
    "unit_source_normalization_substituted": False,
    "selector_capacity_omitted": False,
    "odd_pole_surcharge_omitted": False,
    "shorted_criterion_claimed_necessary_for_original": False,
    "source_metric_replaced_by_identity": False,
    "finite_fourier_residue_declared_inversion_parity": False,
    "physical_schedule_bound_claimed": False,
    "signed_sector_floor_claimed": False,
    "equation_5_2_claimed": False,
    "determinant_limit_claimed": False,
    "nonpositive_complementary_gap_reported_as_pass": False,
    "real_axis_eigenvalue_agreement_substituted_for_determinant_convergence": False,
    "rh_proved": False,
}

ARITHMETIC = {
    "precision_mode": "exact rational arithmetic",
    "raw_interval_or_ball_output_applicable": False,
    "library": "Python fractions.Fraction",
    "shared_library_with_verifier": True,
    "independent_formula_trees": True,
    "independence_limitation": "producer and replay share Python integer and Fraction arithmetic",
}

Matrix = list[list[Fraction]]


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _verified_source_hashes() -> dict[str, str]:
    if set(PINNED_HASHES) != {NOTE, LOCK}:
        raise ValueError("source pins must contain the note and lock")
    result: dict[str, str] = {}
    for relative, expected in PINNED_HASHES.items():
        if _SHA256.fullmatch(expected) is None:
            raise ValueError(f"unfinalized source hash: {relative}")
        path = Path(relative)
        if path.is_absolute() or ".." in path.parts:
            raise ValueError(f"unsafe source path: {relative}")
        if _sha256(_root() / path) != expected:
            raise ValueError(f"source byte hash mismatch: {relative}")
        result[relative] = expected

    lock = json.loads((_root() / LOCK).read_text(encoding="utf-8"))
    expected_top = {
        "schema", "claim_class", "terminal_state", "updated_date",
        "external_sources", "dependencies", "locked_conventions",
        "locked_formulas", "claim_boundary",
    }
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ValueError("source-lock inventory mismatch")
    fixed = {
        "schema": LOCK_SCHEMA,
        "claim_class": "LOCALIZED_MOMENT_SOURCE_WHITENED_SIGNED_SCHUR_REDUCTION",
        "terminal_state": TERMINAL_STATE,
        "updated_date": "2026-08-07",
        "external_sources": [],
        "locked_conventions": LOCKED_CONVENTIONS,
        "locked_formulas": LOCKED_FORMULAS,
        "claim_boundary": CLAIM_SCOPE,
    }
    for key, expected in fixed.items():
        if lock[key] != expected:
            raise ValueError(f"source-lock {key} mutation")
    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list) or not dependencies:
        raise ValueError("source-lock dependencies missing")
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ValueError("malformed source-lock dependency")
        relative = item["path"]
        expected = item["sha256"]
        role = item["role"]
        path = Path(relative) if isinstance(relative, str) else Path(".")
        if (
            not isinstance(relative, str) or not relative
            or path.is_absolute() or ".." in path.parts or relative in result
            or not isinstance(expected, str) or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str) or not role
        ):
            raise ValueError("invalid source-lock dependency")
        if _sha256(_root() / relative) != expected:
            raise ValueError(f"dependency hash mismatch: {relative}")
        result[relative] = expected
    return dict(sorted(result.items()))


def _integer(value: Any, label: str, minimum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{label} must be an exact integer")
    if value < minimum:
        raise ValueError(f"{label} must be at least {minimum}")
    return value


def _rational(value: Fraction) -> dict[str, str]:
    return {"numerator": str(value.numerator), "denominator": str(value.denominator)}


def _encode(value: Any) -> Any:
    if isinstance(value, Fraction):
        return _rational(value)
    if isinstance(value, list):
        return [_encode(item) for item in value]
    if isinstance(value, tuple):
        return [_encode(item) for item in value]
    if isinstance(value, dict):
        return {key: _encode(item) for key, item in value.items()}
    return value


def _shape(matrix: Matrix) -> tuple[int, int]:
    rows = len(matrix)
    columns = len(matrix[0]) if rows else 0
    if any(len(row) != columns for row in matrix):
        raise ValueError("ragged matrix")
    return rows, columns


def _transpose(matrix: Matrix) -> Matrix:
    rows, columns = _shape(matrix)
    if rows == 0:
        return [[] for _ in range(columns)]
    return [list(column) for column in zip(*matrix)]


def _matmul(left: Matrix, right: Matrix) -> Matrix:
    lr, lc = _shape(left)
    rr, rc = _shape(right)
    if lc != rr:
        raise ValueError("matrix dimension mismatch")
    return [
        [
            sum((left[i][k] * right[k][j] for k in range(lc)), Fraction(0))
            for j in range(rc)
        ]
        for i in range(lr)
    ]


def _add(left: Matrix, right: Matrix) -> Matrix:
    if _shape(left) != _shape(right):
        raise ValueError("matrix dimension mismatch")
    return [[a + b for a, b in zip(lrow, rrow)]
            for lrow, rrow in zip(left, right)]


def _sub(left: Matrix, right: Matrix) -> Matrix:
    if _shape(left) != _shape(right):
        raise ValueError("matrix dimension mismatch")
    return [[a - b for a, b in zip(lrow, rrow)]
            for lrow, rrow in zip(left, right)]


def _scale(value: Fraction, matrix: Matrix) -> Matrix:
    return [[value * entry for entry in row] for row in matrix]


def _identity(size: int) -> Matrix:
    return [[Fraction(i == j) for j in range(size)] for i in range(size)]


def _diag(*values: Fraction) -> Matrix:
    return [[value if i == j else Fraction(0)
             for j, value in enumerate(values)] for i in range(len(values))]


def _determinant(matrix: Matrix) -> Fraction:
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ValueError("determinant requires square matrix")
    if rows == 0:
        return Fraction(1)
    work = [row[:] for row in matrix]
    result = Fraction(1)
    for column in range(rows):
        pivot = next((row for row in range(column, rows)
                      if work[row][column]), None)
        if pivot is None:
            return Fraction(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            result = -result
        value = work[column][column]
        result *= value
        for row in range(column + 1, rows):
            factor = work[row][column] / value
            for col in range(column + 1, rows):
                work[row][col] -= factor * work[column][col]
    return result


def _inverse(matrix: Matrix) -> Matrix:
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ValueError("inverse requires square matrix")
    work = [row[:] + identity_row[:] for row, identity_row
            in zip(matrix, _identity(rows))]
    for column in range(rows):
        pivot = next((row for row in range(column, rows)
                      if work[row][column]), None)
        if pivot is None:
            raise ValueError("singular matrix")
        work[column], work[pivot] = work[pivot], work[column]
        value = work[column][column]
        work[column] = [entry / value for entry in work[column]]
        for row in range(rows):
            if row == column:
                continue
            factor = work[row][column]
            work[row] = [entry - factor * pivot_entry
                         for entry, pivot_entry in zip(work[row], work[column])]
    return [row[rows:] for row in work]


def _trace(matrix: Matrix) -> Fraction:
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ValueError("trace requires square matrix")
    return sum((matrix[i][i] for i in range(rows)), Fraction(0))


def _perfect_sqrt(value: Fraction) -> Fraction:
    if value < 0:
        raise ValueError("negative rational square")
    numerator = isqrt(value.numerator)
    denominator = isqrt(value.denominator)
    if numerator * numerator != value.numerator or denominator * denominator != value.denominator:
        raise ValueError("non-square rational")
    return Fraction(numerator, denominator)


def _lower_trim(weights: list[Fraction], values: list[Fraction]) -> tuple[Fraction, list[Fraction]]:
    if len(weights) != len(values) or any(weight < 0 for weight in weights):
        raise ValueError("invalid lower-one atoms")
    if sum(weights, Fraction(0)) < 1:
        raise ValueError("selector mass must be at least one")
    allocation = [Fraction(0) for _ in weights]
    remaining = Fraction(1)
    for index in sorted(range(len(values)), key=lambda i: (values[i], i)):
        take = min(weights[index], remaining)
        allocation[index] = take
        remaining -= take
        if remaining == 0:
            break
    return sum((a * v for a, v in zip(allocation, values)), Fraction(0)), allocation


def _upper_trim(weights: list[Fraction], values: list[Fraction]) -> tuple[Fraction, list[Fraction]]:
    if len(weights) != len(values) or any(weight < 0 for weight in weights):
        raise ValueError("invalid upper-one atoms")
    if sum(weights, Fraction(0)) < 1:
        raise ValueError("selector mass must be at least one")
    allocation = [Fraction(0) for _ in weights]
    remaining = Fraction(1)
    for index in sorted(range(len(values)), key=lambda i: (-values[i], i)):
        take = min(weights[index], remaining)
        allocation[index] = take
        remaining -= take
        if remaining == 0:
            break
    return sum((a * v for a, v in zip(allocation, values)), Fraction(0)), allocation


def _stop_loss(weights: list[Fraction], values: list[Fraction], g: Fraction) -> Fraction:
    return sum((weight * max(g - value, 0)
                for weight, value in zip(weights, values)), Fraction(0))


def _stop_gain(weights: list[Fraction], values: list[Fraction], a: Fraction) -> Fraction:
    return a + sum((weight * max(value - a, 0)
                    for weight, value in zip(weights, values)), Fraction(0))


def _localized_moment_model() -> dict[str, Any]:
    weights = [Fraction(1), Fraction(1)]
    b = [Fraction(10), Fraction(10)]
    prime = [Fraction(4), Fraction(-4)]
    w = [b_i - 2 * s_i for b_i, s_i in zip(b, prime)]
    squares = [s_i * s_i for s_i in prime]
    ell_b, lower_b = _lower_trim(weights, b)
    ell_w, lower_w = _lower_trim(weights, w)
    localized, upper = _upper_trim(weights, squares)
    threshold = Fraction(16)
    dual = _stop_gain(weights, squares, threshold)
    total = sum((weight * value for weight, value in zip(weights, squares)), Fraction(0))
    mass = sum(weights, Fraction(0))
    mean = sum((weight * value for weight, value in zip(weights, w)), Fraction(0)) / mass
    variance = sum((weight * (value - mean) ** 2
                    for weight, value in zip(weights, w)), Fraction(0)) / mass
    sigma = _perfect_sqrt(variance)
    variance_floor = mean - sigma * _perfect_sqrt(mass - 1)
    eta = mass * sigma / (2 * _perfect_sqrt(mass - 1))
    g = variance_floor + eta
    stop_loss = _stop_loss(weights, w, g)
    strict_c = Fraction(1)
    equality_c = Fraction(2)
    strict_reserve = g - stop_loss - strict_c
    equality_reserve = g - stop_loss - equality_c
    localized_gap = ell_b - 2 * _perfect_sqrt(localized)
    total_separated_left = (ell_b - strict_c) ** 2
    total_separated_right = 4 * total
    if (
        w != [Fraction(2), Fraction(18)]
        or ell_b != 10 or ell_w != 2 or localized != 16 or dual != localized
        or total != 32 or mean != 10 or variance != 64 or sigma != 8
        or variance_floor != 2 or eta != 8 or g != 10 or stop_loss != 8
        or localized_gap != 2 or strict_reserve != 1 or equality_reserve != 0
        or not total_separated_left < total_separated_right
    ):
        raise ValueError("localized moment regression failed")
    return {
        "atom_weights": weights,
        "archimedean_values": b,
        "prime_values": prime,
        "combined_values": w,
        "lower_archimedean_allocation": lower_b,
        "lower_combined_allocation": lower_w,
        "upper_energy_allocation": upper,
        "ell_b": ell_b,
        "ell_w": ell_w,
        "localized_prime_energy": localized,
        "stop_gain_threshold": threshold,
        "stop_gain_dual_value": dual,
        "total_prime_second_moment": total,
        "localized_comparison_floor": localized_gap,
        "mean": mean,
        "variance": variance,
        "sigma": sigma,
        "mean_variance_floor": variance_floor,
        "stop_loss_g": g,
        "stop_loss_eta": eta,
        "stop_loss_V": stop_loss,
        "strict_margin": {
            "c_minus": strict_c,
            "reserve": strict_reserve,
            "passes": strict_reserve > 0,
        },
        "equality_boundary": {
            "c_minus": equality_c,
            "reserve": equality_reserve,
            "passes": equality_reserve > 0,
        },
        "total_moment_separated_test": {
            "left_square": total_separated_left,
            "right_four_M": total_separated_right,
            "passes": total_separated_left > total_separated_right,
        },
    }


def _matrix_variance_model() -> dict[str, Any]:
    matrix = [
        [Fraction(306, 25), Fraction(-192, 25)],
        [Fraction(-192, 25), Fraction(194, 25)],
    ]
    dimension = 2
    trace = _trace(matrix)
    mean = trace / dimension
    centered = _sub(matrix, _scale(mean, _identity(dimension)))
    centered_square = _matmul(centered, centered)
    trace_square = _trace(centered_square)
    variance = trace_square / dimension
    sigma = _perfect_sqrt(variance)
    floor = mean - sigma * _perfect_sqrt(Fraction(dimension - 1))
    shifted = _sub(matrix, _scale(floor, _identity(dimension)))
    determinant = _determinant(matrix)
    characteristic_at_floor = _determinant(shifted)
    if (
        trace != 20 or mean != 10 or trace_square != 128
        or variance != 64 or sigma != 8 or floor != 2
        or determinant != 36 or characteristic_at_floor != 0
        or shifted[0][0] <= 0 or shifted[1][1] <= 0
    ):
        raise ValueError("matrix variance regression failed")
    return {
        "matrix": matrix,
        "dimension": dimension,
        "trace": trace,
        "mean": mean,
        "centered_matrix": centered,
        "centered_square": centered_square,
        "trace_centered_square": trace_square,
        "variance": variance,
        "sigma": sigma,
        "trace_variance_floor": floor,
        "determinant": determinant,
        "shifted_by_floor": shifted,
        "characteristic_at_floor": characteristic_at_floor,
        "floor_is_exact": True,
    }


def _mean_variance_edge_model() -> dict[str, Any]:
    zero_weights = [Fraction(1), Fraction(2)]
    zero_values = [Fraction(5), Fraction(5)]
    zero_mass = sum(zero_weights, Fraction(0))
    zero_mean = sum((a * b for a, b in zip(zero_weights, zero_values)), Fraction(0)) / zero_mass
    zero_variance = sum((a * (b - zero_mean) ** 2
                         for a, b in zip(zero_weights, zero_values)), Fraction(0)) / zero_mass
    zero_ell, zero_allocation = _lower_trim(zero_weights, zero_values)
    zero_g = zero_mean
    zero_V = _stop_loss(zero_weights, zero_values, zero_g)

    one_weights = [Fraction(1, 2), Fraction(1, 2)]
    one_values = [Fraction(6), Fraction(14)]
    one_mass = sum(one_weights, Fraction(0))
    one_mean = sum((a * b for a, b in zip(one_weights, one_values)), Fraction(0)) / one_mass
    one_variance = sum((a * (b - one_mean) ** 2
                        for a, b in zip(one_weights, one_values)), Fraction(0)) / one_mass
    one_sigma = _perfect_sqrt(one_variance)
    one_ell, one_allocation = _lower_trim(one_weights, one_values)
    c = Fraction(8)
    y = Fraction(3)
    g = one_mean + y
    eta = _perfect_sqrt(y * y + one_variance)
    quadratic_bound = (y + eta) / 2
    V = _stop_loss(one_weights, one_values, g)
    reserve = g - V - c
    if (
        zero_mass != 3 or zero_mean != 5 or zero_variance != 0
        or zero_ell != 5 or zero_g != 5 or zero_V != 0
        or one_mass != 1 or one_mean != 10 or one_variance != 16
        or one_sigma != 4 or one_ell != one_mean
        or one_allocation != one_weights or eta != 5 or quadratic_bound != 4
        or V != Fraction(7, 2) or reserve != Fraction(3, 2)
    ):
        raise ValueError("mean-variance edge regression failed")
    return {
        "sigma_zero": {
            "weights": zero_weights,
            "values": zero_values,
            "mass": zero_mass,
            "mean": zero_mean,
            "variance": zero_variance,
            "ell": zero_ell,
            "allocation": zero_allocation,
            "g": zero_g,
            "V": zero_V,
            "c_minus": Fraction(4),
            "reserve": zero_g - zero_V - 4,
            "passes": zero_g - zero_V - 4 > 0,
        },
        "mass_one_nonconstant": {
            "weights": one_weights,
            "values": one_values,
            "mass": one_mass,
            "mean": one_mean,
            "variance": one_variance,
            "sigma": one_sigma,
            "ell": one_ell,
            "allocation": one_allocation,
            "c_minus": c,
            "y": y,
            "g": g,
            "eta": eta,
            "quadratic_stop_loss_bound": quadratic_bound,
            "V": V,
            "reserve": reserve,
            "passes": reserve > 0,
        },
    }


def _shorted_source_model() -> dict[str, Any]:
    g = Fraction(1)
    A = _identity(2)
    delta = _identity(2)
    X = [[Fraction(2), Fraction(0), Fraction(0)]]
    Y = [
        [Fraction(1), Fraction(0), Fraction(1, 2)],
        [Fraction(0), Fraction(0), Fraction(1, 2)],
        [Fraction(0), Fraction(0), Fraction(1, 2)],
    ]
    C = _matmul(_transpose(X), X)
    R = _matmul(_transpose(Y), Y)
    C_short = _diag(Fraction(4), Fraction(0))
    R_KK = [row[:2] for row in R[:2]]
    R_KH = [[row[2]] for row in R[:2]]
    R_HK = [R[2][:2]]
    R_HH = R[2][2]
    high = g - R_HH
    direct_low = _sub(_add(_scale(g, _identity(2)), C_short), R_KK)
    round_trip = _scale(1 / high, _matmul(R_KH, R_HK))
    effective_load = _add(R_KK, round_trip)
    G_plus = _add(_scale(g, _matmul(_transpose(A), A)), C_short)
    schur = _sub(G_plus, effective_load)
    theta = max(effective_load[i][i] / G_plus[i][i] for i in range(2))
    alpha = min(G_plus[i][i] for i in range(2))
    certified_floor = (1 - theta) * alpha
    rho = R_HH
    beta = max(R_KK[i][i] for i in range(2))
    eta = g - rho
    mu = min(direct_low[i][i] for i in range(2))
    scalar_left = rho * beta
    scalar_right = eta * mu
    scaled_A = _diag(Fraction(2), Fraction(1))
    scaled_delta = _inverse(_matmul(scaled_A, _transpose(scaled_A)))
    scaled_baseline = _scale(g, _matmul(_transpose(scaled_A), scaled_A))
    scaled_positive = _matmul(_matmul(_transpose(scaled_A), C_short), scaled_A)
    scaled_G = _add(scaled_baseline, scaled_positive)
    scaled_negative = _matmul(_matmul(_transpose(scaled_A), effective_load), scaled_A)
    scaled_pulled_schur = _matmul(_matmul(_transpose(scaled_A), schur), scaled_A)
    scaled_theta = max(scaled_negative[i][i] / scaled_G[i][i] for i in range(2))
    scaled_alpha = min(scaled_G[i][i] for i in range(2))
    scaled_floor = (1 - scaled_theta) * scaled_alpha
    scaled_physical_floor = _scale(scaled_floor, scaled_delta)
    if (
        C != _diag(Fraction(4), Fraction(0), Fraction(0))
        or R != [
            [Fraction(1), Fraction(0), Fraction(1, 2)],
            [Fraction(0), Fraction(0), Fraction(0)],
            [Fraction(1, 2), Fraction(0), Fraction(3, 4)],
        ]
        or high != Fraction(1, 4)
        or G_plus != _diag(Fraction(5), Fraction(1))
        or effective_load != _diag(Fraction(2), Fraction(0))
        or schur != _diag(Fraction(3), Fraction(1))
        or theta != Fraction(2, 5) or alpha != 1
        or certified_floor != Fraction(3, 5)
        or not scalar_left > scalar_right
        or scaled_delta != _diag(Fraction(1, 4), Fraction(1))
        or scaled_baseline != _diag(Fraction(4), Fraction(1))
        or scaled_positive != _diag(Fraction(16), Fraction(0))
        or scaled_G != _diag(Fraction(20), Fraction(1))
        or scaled_negative != _diag(Fraction(8), Fraction(0))
        or scaled_pulled_schur != _diag(Fraction(12), Fraction(1))
        or scaled_theta != Fraction(2, 5) or scaled_floor != Fraction(3, 5)
    ):
        raise ValueError("shorted source model failed")
    return {
        "g": g,
        "A": A,
        "Delta": delta,
        "X_feature": X,
        "Y_feature": Y,
        "C": C,
        "R": R,
        "C_short": C_short,
        "R_KK": R_KK,
        "R_KH": R_KH,
        "R_HH": R_HH,
        "high_block": high,
        "direct_low": direct_low,
        "round_trip_correction": round_trip,
        "effective_negative_load": effective_load,
        "G_plus": G_plus,
        "exact_schur": schur,
        "theta": theta,
        "alpha": alpha,
        "certified_quotient_floor": certified_floor,
        "scalar_reserve": {
            "rho": rho,
            "beta": beta,
            "eta": eta,
            "mu": mu,
            "left_rho_beta": scalar_left,
            "right_eta_mu": scalar_right,
            "passes": scalar_left < scalar_right,
        },
        "anisotropic_contraction_passes": theta < 1,
        "nonisometric_source_metric": {
            "A": scaled_A,
            "Delta": scaled_delta,
            "g_A_star_A": scaled_baseline,
            "wrong_g_identity": _scale(g, _identity(2)),
            "positive_pullback": scaled_positive,
            "G_plus": scaled_G,
            "negative_pullback": scaled_negative,
            "pulled_schur": scaled_pulled_schur,
            "theta": scaled_theta,
            "alpha": scaled_alpha,
            "source_floor": scaled_floor,
            "physical_quotient_floor": scaled_physical_floor,
        },
    }


def _full_signed_feature_model() -> dict[str, Any]:
    g = Fraction(1)
    J = _diag(Fraction(1), Fraction(-1))
    F = [[Fraction(2), Fraction(1)], [Fraction(1), Fraction(0)]]
    B = _add(_identity(2), _matmul(_matmul(_transpose(F), J), F))
    F_K = [[row[0]] for row in F]
    F_H = [[row[1]] for row in F]
    high = B[1][1]
    schur = B[0][0] - B[0][1] * B[1][0] / high
    M = _add(J, _matmul(F_H, _transpose(F_H)))
    M_inverse = _inverse(M)
    feature_schur = g + _matmul(_matmul(_transpose(F_K), M_inverse), F_K)[0][0]
    A = [[Fraction(2)]]
    source_gram = _matmul(_transpose(A), A)[0][0]
    delta = Fraction(1, 4)
    T = _matmul(F_K, A)
    L_plus = _diag(Fraction(1, 2), Fraction(0))
    L_minus = _diag(Fraction(0), Fraction(1))
    positive_feature = _matmul(_matmul(_transpose(T), L_plus), T)[0][0]
    negative_feature = _matmul(_matmul(_transpose(T), L_minus), T)[0][0]
    G = g * source_gram + positive_feature
    pulled_schur = source_gram * schur
    theta = negative_feature / G
    source_floor = (1 - theta) * G
    physical_floor = source_floor * delta
    boundary_F = [[Fraction(0), Fraction(1)], [Fraction(1), Fraction(0)]]
    boundary_B = _add(_identity(2), _matmul(_matmul(_transpose(boundary_F), J), boundary_F))
    boundary_F_H = [[row[1]] for row in boundary_F]
    boundary_M = _add(J, _matmul(boundary_F_H, _transpose(boundary_F_H)))
    boundary_M_inverse = _inverse(boundary_M)
    boundary_G = Fraction(1)
    boundary_negative = Fraction(1)
    boundary_theta = boundary_negative / boundary_G
    boundary_schur = boundary_B[0][0]
    if (
        B != [[Fraction(4), Fraction(2)], [Fraction(2), Fraction(2)]]
        or _determinant(B) != 4 or high != 2 or schur != 2
        or M != _diag(Fraction(2), Fraction(-1))
        or M_inverse != _diag(Fraction(1, 2), Fraction(-1))
        or feature_schur != schur or source_gram != 4
        or positive_feature != 8 or negative_feature != 4
        or G != 12 or pulled_schur != 8 or theta != Fraction(1, 3)
        or source_floor != 8 or physical_floor != 2
        or boundary_B != _diag(Fraction(0), Fraction(2))
        or boundary_M_inverse != _diag(Fraction(1, 2), Fraction(-1))
        or boundary_theta != 1 or boundary_schur != 0
    ):
        raise ValueError("full signed feature model failed")
    return {
        "g": g,
        "J": J,
        "F": F,
        "B": B,
        "B_determinant": _determinant(B),
        "high_block": high,
        "physical_schur": schur,
        "F_K": F_K,
        "F_H": F_H,
        "M_H": M,
        "M_H_inverse": M_inverse,
        "feature_schur": feature_schur,
        "A": A,
        "Delta": delta,
        "source_gram_A_star_A": source_gram,
        "wrong_isometric_baseline": Fraction(1),
        "T": T,
        "L_plus": L_plus,
        "L_minus": L_minus,
        "positive_feature_pullback": positive_feature,
        "negative_feature_pullback": negative_feature,
        "G": G,
        "pulled_schur": pulled_schur,
        "theta_full": theta,
        "source_floor": source_floor,
        "physical_quotient_floor": physical_floor,
        "complete_contraction_passes": high > 0 and theta < 1,
        "equality_boundary": {
            "F": boundary_F,
            "B": boundary_B,
            "high_block": boundary_B[1][1],
            "M_H": boundary_M,
            "M_H_inverse": boundary_M_inverse,
            "G": boundary_G,
            "negative_feature_pullback": boundary_negative,
            "theta_full": boundary_theta,
            "physical_schur": boundary_schur,
            "passes": boundary_B[1][1] > 0 and boundary_theta < 1,
        },
    }


def _coframe_necessity_model() -> dict[str, Any]:
    g = Fraction(1)
    A = _diag(Fraction(1, 3), Fraction(1))
    gram = _matmul(_transpose(A), A)
    delta = _inverse(_matmul(A, _transpose(A)))
    low = _identity(2)
    mu = Fraction(1, 9)
    bound = mu / g
    quotient_remainder = _sub(low, _scale(mu, delta))
    gram_remainder = _sub(gram, _scale(bound, _identity(2)))
    if (
        gram != _diag(Fraction(1, 9), Fraction(1))
        or delta != _diag(Fraction(9), Fraction(1))
        or quotient_remainder != _diag(Fraction(0), Fraction(8, 9))
        or gram_remainder != _diag(Fraction(0), Fraction(8, 9))
        or _determinant(A) == 0
    ):
        raise ValueError("coframe necessity model failed")
    return {
        "g": g,
        "A": A,
        "rank_A": 2,
        "A_star_A": gram,
        "Delta": delta,
        "low_operator": low,
        "mu": mu,
        "necessary_gram_floor": bound,
        "quotient_remainder": quotient_remainder,
        "gram_remainder": gram_remainder,
        "qualitative_rank_determines_uniform_floor": False,
    }


def _regressions() -> dict[str, Any]:
    return {
        "localized_prime_energy_and_variance": _localized_moment_model(),
        "mean_variance_edge_cases": _mean_variance_edge_model(),
        "hermitian_trace_variance": _matrix_variance_model(),
        "positive_shorted_source_contraction": _shorted_source_model(),
        "complete_signed_feature_contraction": _full_signed_feature_model(),
        "quantitative_coframe_necessity": _coframe_necessity_model(),
    }


def validate_source_admissions(admissions: dict[str, bool]) -> None:
    if admissions != SOURCE_ADMISSIONS or any(admissions.values()):
        raise ValueError("source admission violates the claim boundary")


def produce(lambda_numerator: int, dps: int) -> dict[str, Any]:
    p = _integer(lambda_numerator, "lambda_numerator", 5)
    precision = _integer(dps, "dps", 50)
    if p % 2 == 0:
        raise ValueError("lambda_numerator must be odd")
    validate_source_admissions(SOURCE_ADMISSIONS)
    source_hashes = _verified_source_hashes()
    N = (p * p + 3) // 4
    certificate = {
        "exact_schedule_metadata": {
            "lambda": Fraction(p, 2),
            "N": N,
            "N_rule": "ceil(lambda^2)",
            "dps_label": precision,
            "model_scope": "exact rational theorem regressions; not a physical Weil pilot",
        },
        "exact_regressions": _regressions(),
        "theorem_checks": {
            "upper_one_dual_reconstructed": True,
            "localized_energy_strict_and_equality_boundaries_present": True,
            "mean_variance_witness_reconstructed": True,
            "mean_variance_edge_cases_reconstructed": True,
            "matrix_trace_variance_floor_reconstructed": True,
            "g_A_star_A_metric_retained": True,
            "shorted_minorant_not_promoted_to_original_necessity": True,
            "complete_signed_feature_identity_reconstructed": True,
            "quantitative_coframe_necessity_reconstructed": True,
        },
    }
    return _encode({
        "schema": SCHEMA,
        "status": STATUS,
        "terminal_state": TERMINAL_STATE,
        "input": {"lambda_numerator": p, "dps": precision},
        "source_hashes": source_hashes,
        "locked_conventions": LOCKED_CONVENTIONS,
        "locked_formulas": LOCKED_FORMULAS,
        "claim_scope": CLAIM_SCOPE,
        "source_admissions": SOURCE_ADMISSIONS,
        "arithmetic": ARITHMETIC,
        "certificate": certificate,
        "result": RESULT,
    })


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lambda-numerator", type=int, required=True)
    parser.add_argument("--dps", type=int, required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    payload = produce(args.lambda_numerator, args.dps)
    Path(args.output).write_text(
        json.dumps(payload, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
