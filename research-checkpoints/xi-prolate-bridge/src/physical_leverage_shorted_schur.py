#!/usr/bin/env python3
"""Produce exact finite models for the physical-leverage/shorted-Schur route.

This component records algebraic reductions and adversarial finite models only.
It does not promote a finite model to an asymptotic estimate or a theorem about
the Weil operator.  Every model calculation uses ``fractions.Fraction``.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import itertools
import json
from math import isqrt
from pathlib import Path
import re
from typing import Any, Iterable


SCHEMA = "xi-prolate-physical-leverage-shorted-schur-v1"
STATUS = "PHYSICAL_LEVERAGE_SHORTED_SCHUR_COMPONENT"
RESULT = "PHYSICAL_LEVERAGE_SHORTED_SCHUR_COMPONENT_PASS"
TERMINAL_STATE = "P0_INVALIDATED"
NOTE = "notes/PHYSICAL_LEVERAGE_SHORTED_SCHUR.md"
LOCK = "PHYSICAL_LEVERAGE_SHORTED_SCHUR_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-physical-leverage-shorted-schur-source-lock-v1"

PINNED_HASHES = {
    NOTE: "39147b7fcd5c71304c6977272b72a3f07a789b7c4fb34d2e2ebf51e3b60589f3",
    LOCK: "61c9adb35ca643de78dfb71407272dc68ba086952ed7b89001bba490ab2fb097",
}
_SHA256 = re.compile(r"^[0-9a-f]{64}$")

LOCKED_CONVENTIONS = {
    "source_interval": "[-lambda,lambda] with Lebesgue measure and zero extension; the zero-Lebesgue-integral source normalization and full source Gram C^*C are retained",
    "physical_interval": "I_lambda=[-log(lambda),log(lambda)] with Lebesgue measure in logarithmic coordinates, equivalently du/u on [lambda^(-1),lambda]",
    "fourier_sign": "fhat(t)=integral f(y)*exp(-i*t*y) dy",
    "prime_endpoint": "every prime power n<=lambda^2 is included",
    "prime_sign": "m_lambda=2*theta_prime-2*sum Lambda(n)/sqrt(n)*cos(t*log(n))",
    "inversion": "multiplicatively Jf(u)=f(u^(-1)); in the additive logarithmic coordinate Jf(x)=f(-x), and reflection is retained before forming the inversion-even state",
    "matched_schedule": "lambda=p/2 for odd p>=5 and N=ceil(lambda^2)=(p^2+3)/4",
    "anchor_scope": "p_4=a_4^(-1)*P_N*k_lambda^+ is nonzero eventually on the matched schedule; no finite p=5 or p=7 nonvanishing certificate is claimed",
    "positive_negative_split": "C and R remain separate positive operators in B=g*I+C-R before C is shorted to the physical range",
    "artifact_scope": "p and dps label deterministic matched-schedule metadata and doubled replay settings for exact rational theorem-regression models, not physical prolate-Weil pilot matrices",
    "arithmetic": "all component regression matrices and reported reserves are exact reduced rationals; no binary64 parameter is accepted",
}

LOCKED_FORMULAS = {
    "anchor_identity": "h_lambda=a_4*c_4 and P_N*k_lambda^+=a_4*p_4 with a_4=sqrt(3)/2^(11/4)>0",
    "matched_anchor_limit": "||p_4||=a_4^(-1)*a_(lambda,N) tends to a_infty/a_4>=K_star/a_4>0 when log(lambda)/(N+1) tends to zero",
    "parity_split": "even: C=T_a+2|p_+><p_+| and R=T_v; odd: C=T_a and R=T_v+2|p_-><p_-|",
    "leverage_density": "kappa_H(t)=kappa_X(t)-mathcal_W(t)*G^dagger*mathcal_W(t)^*, G=W^*W and mathcal_W is the Fourier evaluation row",
    "leverage_trace": "tr(P_H*T_v*P_H)=tr(T_v)-tr(G^dagger*W^*T_v*W)=integral v(t)*kappa_H(t) dt/(2*pi)",
    "prime_second_moment": "M_H=(1/2)*sum_(n,m<=lambda^2)c_n*c_m*(Re Gamma_H(log(n/m))+Re Gamma_H(log(n*m))) with c_n=Lambda(n)/sqrt(n)",
    "positive_short": "C_/K=C_KK-C_KH*C_HH^dagger*C_HK and C>=diag(C_/K,0)",
    "shorted_lower_matrix": "B>=M=[[gI-R_KK+C_/K,-R_KH],[-R_HK,gI-R_HH]]",
    "automatic_cross": "||R_HK*Delta^(-1/2)||^2<=rho*beta where rho>=||R_HH|| and beta=||Delta^(-1/2)*R_KK*Delta^(-1/2)||",
    "scalar_gluing": "eta=g-rho, chi^2=rho*beta/eta, and rho*beta<eta*mu imply B>=nu*(Delta direct-sum eta*I), nu=(mu+1-sqrt((mu-1)^2+4*chi^2))/2>0",
    "anisotropic_schur": "gI-R_KK+C_/K-R_KH*(gI-R_HH)^(-1)*R_HK>0 is the sharper sufficient condition",
    "source_beta": "for A=W*D^(-1/2) and Delta=(A*A^*)^dagger on K, beta=||A^*R*A||",
    "coframe_determinants": "det_(p4_perp)(W_+W_+^*)=D_+/||p_4||^2 and det(W_-W_-^*)=D_- by Cauchy-Binet",
}

SOURCE_ADMISSIONS = {
    "binary64_parameters_used": False,
    "cached_weil_matrix_read": False,
    "zeta_zero_table_read": False,
    "zeros_assumed_real": False,
    "global_weil_positivity_assumed": False,
    "finite_p_projected_anchor_nonzero_claimed": False,
    "capture_implies_raw_cross_control": False,
    "diagonal_blocks_imply_full_positivity": False,
    "nonstrict_reserve_reported_as_pass": False,
    "physical_high_floor_claimed": False,
    "signed_sector_floor_claimed": False,
    "equation_5_2_claimed": False,
    "determinant_limit_claimed": False,
    "rh_proved": False,
}

CLAIM_SCOPE = {
    "proved": [
        "eventual nonvanishing of the matched quadratic projected comparison anchor with no effective finite threshold",
        "exact physical leverage density and trace-deficit identities",
        "exact finite prime second-moment expansion after leverage removal",
        "Krein-short lower comparison that absorbs all positive-part low-high coupling",
        "automatic quotient-relative cross estimate for the negative operator and scalar or anisotropic Schur sufficiency",
        "exact countermodel rejecting capture-to-raw-cross inference",
        "exact co-frame determinant target with the eventual anchor denominator caveat removed",
    ],
    "not_proved": [
        "finite projected-anchor nonvanishing at p=5 or p=7",
        "the signed source-coordinate low bound",
        "a physical leverage deficit smaller than g on an unbounded schedule",
        "the scalar reserve inequality or anisotropic Schur condition for the prolate-Weil operators",
        "a quantitative physical co-frame lower bound",
        "a positive signed floor in either parity sector",
        "equation (5.2) of DIRECT_RH_ATTACK.md",
        "locally uniform determinant convergence",
        "the Riemann hypothesis",
    ],
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
    """Rehash the component lock, note, and every locked dependency."""
    if set(PINNED_HASHES) != {NOTE, LOCK}:
        raise ValueError("physical-leverage source pins must contain NOTE and LOCK")
    for relative, expected in PINNED_HASHES.items():
        if _SHA256.fullmatch(expected) is None:
            raise ValueError(f"PINNED_HASHES placeholder not finalized: {relative}")
        if Path(relative).is_absolute() or ".." in Path(relative).parts:
            raise ValueError(f"unsafe pinned path: {relative}")
        if _sha256(_root() / relative) != expected:
            raise ValueError(f"source byte hash mismatch: {relative}")

    lock = json.loads((_root() / LOCK).read_text(encoding="utf-8"))
    expected_top = {
        "schema",
        "claim_class",
        "terminal_state",
        "updated_date",
        "external_sources",
        "dependencies",
        "locked_conventions",
        "locked_formulas",
        "claim_boundary",
    }
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ValueError("physical-leverage source-lock inventory mismatch")
    fixed = {
        "schema": LOCK_SCHEMA,
        "claim_class": "PHYSICAL_LEVERAGE_AND_SHORTED_POSITIVE_SCHUR_REDUCTION",
        "terminal_state": TERMINAL_STATE,
        "updated_date": "2026-08-08",
        "external_sources": [],
        "locked_conventions": LOCKED_CONVENTIONS,
        "locked_formulas": LOCKED_FORMULAS,
        "claim_boundary": CLAIM_SCOPE,
    }
    for key, expected in fixed.items():
        if lock[key] != expected:
            raise ValueError(f"physical-leverage source-lock {key} mutation")

    result = dict(PINNED_HASHES)
    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list) or not dependencies:
        raise ValueError("physical-leverage source-lock dependencies missing")
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ValueError("malformed physical-leverage dependency")
        relative = item["path"]
        expected = item["sha256"]
        role = item["role"]
        if (
            not isinstance(relative, str)
            or not relative
            or Path(relative).is_absolute()
            or ".." in Path(relative).parts
            or relative in result
            or not isinstance(expected, str)
            or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str)
            or not role
        ):
            raise ValueError("invalid physical-leverage dependency fields")
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


def _zeros(rows: int, columns: int) -> Matrix:
    return [[Fraction(0) for _ in range(columns)] for _ in range(rows)]


def _transpose(matrix: Matrix) -> Matrix:
    rows, columns = _shape(matrix)
    if rows == 0:
        return [[] for _ in range(columns)]
    return [list(column) for column in zip(*matrix)]


def _matmul(left: Matrix, right: Matrix) -> Matrix:
    left_rows, left_columns = _shape(left)
    right_rows, right_columns = _shape(right)
    if left_columns != right_rows:
        raise ValueError("matrix dimension mismatch")
    if left_rows == 0:
        return []
    if right_columns == 0:
        return [[] for _ in range(left_rows)]
    right_t = _transpose(right)
    return [
        [sum(a * b for a, b in zip(row, column)) for column in right_t]
        for row in left
    ]


def _add(left: Matrix, right: Matrix) -> Matrix:
    if _shape(left) != _shape(right):
        raise ValueError("matrix dimension mismatch")
    return [
        [a + b for a, b in zip(row_a, row_b)]
        for row_a, row_b in zip(left, right)
    ]


def _sub(left: Matrix, right: Matrix) -> Matrix:
    if _shape(left) != _shape(right):
        raise ValueError("matrix dimension mismatch")
    return [
        [a - b for a, b in zip(row_a, row_b)]
        for row_a, row_b in zip(left, right)
    ]


def _scale(value: Fraction, matrix: Matrix) -> Matrix:
    return [[value * entry for entry in row] for row in matrix]


def _identity(size: int) -> Matrix:
    return [[Fraction(i == j) for j in range(size)] for i in range(size)]


def _diag(*entries: Fraction) -> Matrix:
    return [
        [entry if i == j else Fraction(0) for j in range(len(entries))]
        for i, entry in enumerate(entries)
    ]


def _outer(left: list[Fraction], right: list[Fraction] | None = None) -> Matrix:
    if right is None:
        right = left
    return [[a * b for b in right] for a in left]


def _trace(matrix: Matrix) -> Fraction:
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ValueError("trace requires a square matrix")
    return sum(matrix[i][i] for i in range(rows))


def _determinant(matrix: Matrix) -> Fraction:
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ValueError("determinant requires a square matrix")
    work = [row[:] for row in matrix]
    result = Fraction(1)
    for column in range(rows):
        pivot = next((i for i in range(column, rows) if work[i][column]), None)
        if pivot is None:
            return Fraction(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            result = -result
        pivot_value = work[column][column]
        result *= pivot_value
        for j in range(column, rows):
            work[column][j] /= pivot_value
        for i in range(column + 1, rows):
            factor = work[i][column]
            if factor:
                for j in range(column, rows):
                    work[i][j] -= factor * work[column][j]
    return result


def _inverse(matrix: Matrix) -> Matrix:
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ValueError("inverse requires a square matrix")
    work = [row[:] + identity_row for row, identity_row in zip(matrix, _identity(rows))]
    for column in range(rows):
        pivot = next((i for i in range(column, rows) if work[i][column]), None)
        if pivot is None:
            raise ValueError("singular matrix")
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
        pivot_value = work[column][column]
        work[column] = [entry / pivot_value for entry in work[column]]
        for i in range(rows):
            if i == column:
                continue
            factor = work[i][column]
            if factor:
                work[i] = [a - factor * b for a, b in zip(work[i], work[column])]
    return [row[rows:] for row in work]


def _pivot_columns(matrix: Matrix) -> list[int]:
    rows, columns = _shape(matrix)
    work = [row[:] for row in matrix]
    pivots: list[int] = []
    pivot_row = 0
    for column in range(columns):
        pivot = next((i for i in range(pivot_row, rows) if work[i][column]), None)
        if pivot is None:
            continue
        work[pivot_row], work[pivot] = work[pivot], work[pivot_row]
        pivot_value = work[pivot_row][column]
        work[pivot_row] = [entry / pivot_value for entry in work[pivot_row]]
        for i in range(rows):
            if i == pivot_row:
                continue
            factor = work[i][column]
            if factor:
                work[i] = [a - factor * b for a, b in zip(work[i], work[pivot_row])]
        pivots.append(column)
        pivot_row += 1
        if pivot_row == rows:
            break
    return pivots


def _pseudoinverse(matrix: Matrix) -> Matrix:
    """Exact Moore-Penrose inverse through a rational rank factorization."""
    rows, columns = _shape(matrix)
    pivots = _pivot_columns(matrix)
    if not pivots:
        return _zeros(columns, rows)
    F = [[matrix[i][j] for j in pivots] for i in range(rows)]
    F_t = _transpose(F)
    F_left = _matmul(_inverse(_matmul(F_t, F)), F_t)
    G = _matmul(F_left, matrix)
    G_t = _transpose(G)
    G_right = _matmul(G_t, _inverse(_matmul(G, G_t)))
    candidate = _matmul(G_right, F_left)
    # Exact Penrose identities are part of the producer's own self-check.
    if _matmul(_matmul(matrix, candidate), matrix) != matrix:
        raise ArithmeticError("first Penrose identity failed")
    if _matmul(_matmul(candidate, matrix), candidate) != candidate:
        raise ArithmeticError("second Penrose identity failed")
    if _transpose(_matmul(matrix, candidate)) != _matmul(matrix, candidate):
        raise ArithmeticError("third Penrose identity failed")
    if _transpose(_matmul(candidate, matrix)) != _matmul(candidate, matrix):
        raise ArithmeticError("fourth Penrose identity failed")
    return candidate


def _principal_submatrix(matrix: Matrix, indices: Iterable[int]) -> Matrix:
    selected = list(indices)
    return [[matrix[i][j] for j in selected] for i in selected]


def _is_psd(matrix: Matrix) -> bool:
    rows, columns = _shape(matrix)
    if rows != columns or matrix != _transpose(matrix):
        return False
    # For Hermitian matrices, nonnegativity of every principal minor is
    # equivalent to positive semidefiniteness.  Models here have size <= 4.
    for size in range(1, rows + 1):
        for indices in itertools.combinations(range(rows), size):
            if _determinant(_principal_submatrix(matrix, indices)) < 0:
                return False
    return True


def _block(matrix: Matrix, row_start: int, row_stop: int, col_start: int, col_stop: int) -> Matrix:
    return [row[col_start:col_stop] for row in matrix[row_start:row_stop]]


def _short(matrix: Matrix, k_dimension: int) -> tuple[Matrix, Matrix, Matrix, Matrix, Matrix]:
    rows, columns = _shape(matrix)
    if rows != columns or not 0 < k_dimension < rows:
        raise ValueError("invalid short block dimensions")
    C_KK = _block(matrix, 0, k_dimension, 0, k_dimension)
    C_KH = _block(matrix, 0, k_dimension, k_dimension, rows)
    C_HK = _transpose(C_KH)
    C_HH = _block(matrix, k_dimension, rows, k_dimension, rows)
    C_HH_dagger = _pseudoinverse(C_HH)
    short = _sub(C_KK, _matmul(_matmul(C_KH, C_HH_dagger), C_HK))
    return short, C_KK, C_KH, C_HH, C_HH_dagger


def _perfect_square_root(value: Fraction) -> Fraction:
    if value < 0:
        raise ValueError("negative radicand")
    numerator = isqrt(value.numerator)
    denominator = isqrt(value.denominator)
    if numerator * numerator != value.numerator or denominator * denominator != value.denominator:
        raise ValueError("radicand is not a rational square")
    return Fraction(numerator, denominator)


def _success_model() -> dict[str, Any]:
    # K=Q^2 and H=Q.  C has a nonzero K-H block, while its short is
    # diag(0,1).  R is independently PSD and supplies the adverse cross.
    Delta = _identity(2)
    g = Fraction(5)
    C = [
        [Fraction(1), Fraction(2), Fraction(2)],
        [Fraction(2), Fraction(5), Fraction(4)],
        [Fraction(2), Fraction(4), Fraction(4)],
    ]
    R = [
        [Fraction(3), Fraction(0), Fraction(1)],
        [Fraction(0), Fraction(1), Fraction(0)],
        [Fraction(1), Fraction(0), Fraction(1)],
    ]
    short, C_KK, C_KH, C_HH, C_HH_dagger = _short(C, 2)
    R_KK = _block(R, 0, 2, 0, 2)
    R_KH = _block(R, 0, 2, 2, 3)
    R_HH = _block(R, 2, 3, 2, 3)
    B = _sub(_add(_scale(g, _identity(3)), C), R)
    rho = Fraction(1)
    eta = g - rho
    beta = Fraction(3)
    alpha = Fraction(5)
    mu = alpha - beta
    low = _add(_sub(_scale(g, _identity(2)), R_KK), short)
    cross_squared = _matmul(_transpose(R_KH), _matmul(_inverse(Delta), R_KH))[0][0]
    automatic_cross_upper = rho * beta
    reserve = eta * mu - automatic_cross_upper
    chi_bar_squared = automatic_cross_upper / eta
    discriminant = (mu - 1) ** 2 + 4 * chi_bar_squared
    glued_factor = (mu + 1 - _perfect_square_root(discriminant)) / 2
    high_inverse = _inverse(_sub(_scale(g, _identity(1)), R_HH))
    anisotropic_schur = _sub(low, _matmul(_matmul(R_KH, high_inverse), _transpose(R_KH)))
    short_domination_remainder = _sub(C, [
        [short[0][0], short[0][1], Fraction(0)],
        [short[1][0], short[1][1], Fraction(0)],
        [Fraction(0), Fraction(0), Fraction(0)],
    ])
    scalar_comparator = [
        [mu, Fraction(0), -R_KH[0][0]],
        [Fraction(0), mu, -R_KH[1][0]],
        [-R_KH[0][0], -R_KH[1][0], eta],
    ]
    if not (_is_psd(C) and _is_psd(R) and _is_psd(short_domination_remainder)):
        raise ArithmeticError("success model PSD self-check failed")
    if reserve <= 0 or glued_factor <= 0 or not _is_psd(scalar_comparator):
        raise ArithmeticError("success model gluing self-check failed")
    return {
        "k_dimension": 2,
        "h_dimension": 1,
        "Delta": Delta,
        "g": g,
        "C": C,
        "R": R,
        "B": B,
        "C_KK": C_KK,
        "C_KH": C_KH,
        "C_HH": C_HH,
        "C_HH_dagger": C_HH_dagger,
        "C_short_K": short,
        "short_domination_remainder": short_domination_remainder,
        "R_KK": R_KK,
        "R_KH": R_KH,
        "R_HH": R_HH,
        "alpha": alpha,
        "beta": beta,
        "mu": mu,
        "rho": rho,
        "eta": eta,
        "low_matrix": low,
        "actual_cross_norm_squared": cross_squared,
        "automatic_cross_upper": automatic_cross_upper,
        "strict_reserve": reserve,
        "chi_bar_squared": chi_bar_squared,
        "glued_factor_discriminant": discriminant,
        "glued_lower_factor": glued_factor,
        "anisotropic_schur": anisotropic_schur,
        "scalar_comparator": scalar_comparator,
        "sufficient_leverage_sum": beta / alpha + rho / g,
    }


def _scalar_model(kind: str) -> dict[str, Any]:
    Delta = [[Fraction(4)]]
    g = Fraction(4)
    if kind == "success":
        C = [[Fraction(8), Fraction(2)], [Fraction(2), Fraction(1)]]
        R = [[Fraction(1), Fraction(1)], [Fraction(1), Fraction(1)]]
    elif kind == "equality":
        C = [[Fraction(4), Fraction(0)], [Fraction(0), Fraction(0)]]
        R = _scale(Fraction(8, 3), [[Fraction(1), Fraction(1)], [Fraction(1), Fraction(1)]])
    elif kind == "supercritical":
        C = [[Fraction(4), Fraction(0)], [Fraction(0), Fraction(0)]]
        R = _scale(Fraction(3), [[Fraction(1), Fraction(1)], [Fraction(1), Fraction(1)]])
    else:
        raise ValueError("unknown scalar model")
    short, _C_KK, C_KH, C_HH, C_HH_dagger = _short(C, 1)
    R_KK = R[0][0]
    R_KH = R[0][1]
    rho = R[1][1]
    eta = g - rho
    beta = R_KK / Delta[0][0]
    alpha = (g + short[0][0]) / Delta[0][0]
    mu = alpha - beta
    actual_cross_squared = R_KH * R_KH / Delta[0][0]
    automatic_cross_upper = rho * beta
    reserve = eta * mu - automatic_cross_upper
    B = _sub(_add(_scale(g, _identity(2)), C), R)
    comparator = [[mu * Delta[0][0], -R_KH], [-R_KH, eta]]
    if not (_is_psd(C) and _is_psd(R)):
        raise ArithmeticError("scalar input PSD self-check failed")
    return {
        "Delta": Delta,
        "g": g,
        "C": C,
        "R": R,
        "B": B,
        "C_KH": C_KH,
        "C_HH": C_HH,
        "C_HH_dagger": C_HH_dagger,
        "C_short_K": short,
        "alpha": alpha,
        "beta": beta,
        "mu": mu,
        "rho": rho,
        "eta": eta,
        "actual_cross_norm_squared": actual_cross_squared,
        "automatic_cross_upper": automatic_cross_upper,
        "strict_reserve": reserve,
        "comparator": comparator,
        "comparator_determinant": _determinant(comparator),
        "B_determinant": _determinant(B),
        "sufficient_leverage_sum": beta / alpha + rho / g,
        "strict_condition_holds": reserve > 0,
        "full_B_psd": _is_psd(B),
    }


def _singular_short_model() -> dict[str, Any]:
    C = [
        [Fraction(2), Fraction(2), Fraction(2), Fraction(0)],
        [Fraction(2), Fraction(6), Fraction(4), Fraction(0)],
        [Fraction(2), Fraction(4), Fraction(4), Fraction(0)],
        [Fraction(0), Fraction(0), Fraction(0), Fraction(0)],
    ]
    short, C_KK, C_KH, C_HH, C_HH_dagger = _short(C, 2)
    range_compatibility = _matmul(
        C_KH,
        _sub(_identity(2), _matmul(C_HH_dagger, C_HH)),
    )
    domination_remainder = _sub(C, [
        [short[0][0], short[0][1], Fraction(0), Fraction(0)],
        [short[1][0], short[1][1], Fraction(0), Fraction(0)],
        [Fraction(0), Fraction(0), Fraction(0), Fraction(0)],
        [Fraction(0), Fraction(0), Fraction(0), Fraction(0)],
    ])
    if range_compatibility != _zeros(2, 2):
        raise ArithmeticError("singular short range condition failed")
    if not (_is_psd(C) and _is_psd(short) and _is_psd(domination_remainder)):
        raise ArithmeticError("singular short PSD self-check failed")
    return {
        "k_dimension": 2,
        "h_dimension": 2,
        "C": C,
        "C_KK": C_KK,
        "C_KH": C_KH,
        "C_HH": C_HH,
        "C_HH_rank": len(_pivot_columns(C_HH)),
        "C_HH_dagger": C_HH_dagger,
        "range_compatibility_residual": range_compatibility,
        "C_short_K": short,
        "short_domination_remainder": domination_remainder,
    }


def _capture_raw_cross_countermodel() -> dict[str, Any]:
    g = Fraction(2)
    positive_vector = [Fraction(2), Fraction(0), Fraction(3)]
    C = _outer(positive_vector)
    R = _diag(Fraction(3), Fraction(0), Fraction(0))
    B = _sub(_add(_scale(g, _identity(3)), C), R)
    short, _C_KK, _C_KH, _C_HH, _C_HH_dagger = _short(C, 2)
    B_KK = _block(B, 0, 2, 0, 2)
    B_KH = _block(B, 0, 2, 2, 3)
    B_HH = B[2][2]
    low_floor = min(B_KK[0][0], B_KK[1][1])
    raw_cross_squared = _matmul(_transpose(B_KH), B_KH)[0][0]
    determinant = _determinant(B)
    if R[2][2] != 0 or low_floor <= 0 or B_HH <= 0 or determinant >= 0:
        raise ArithmeticError("raw-cross countermodel self-check failed")
    return {
        "g": g,
        "C": C,
        "R": R,
        "B": B,
        "C_short_K": short,
        "negative_part_high_compression": R[2][2],
        "B_KK": B_KK,
        "B_HH": B_HH,
        "low_floor": low_floor,
        "raw_cross_squared": raw_cross_squared,
        "low_floor_times_high_floor": low_floor * B_HH,
        "B_determinant": determinant,
        "diagonal_blocks_positive": True,
        "full_B_psd": False,
        "capture_implies_raw_cross_control": False,
    }


def _leverage_trace_model() -> dict[str, Any]:
    # W has a repeated column, so G is singular and the dagger is essential.
    W = [
        [Fraction(1), Fraction(0), Fraction(1)],
        [Fraction(0), Fraction(2), Fraction(0)],
        [Fraction(1), Fraction(0), Fraction(1)],
    ]
    T_v = _diag(Fraction(1), Fraction(2), Fraction(3))
    G = _matmul(_transpose(W), W)
    G_dagger = _pseudoinverse(G)
    P_K = _matmul(_matmul(W, G_dagger), _transpose(W))
    P_H = _sub(_identity(3), P_K)
    compressed_moment = _matmul(_matmul(_transpose(W), T_v), W)
    total_trace = _trace(T_v)
    captured_trace = _trace(_matmul(G_dagger, compressed_moment))
    direct_high_trace = _trace(_matmul(_matmul(P_H, T_v), P_H))
    difference_trace = total_trace - captured_trace
    g = Fraction(3)
    if direct_high_trace != difference_trace:
        raise ArithmeticError("leverage trace identity failed")
    if not (_is_psd(T_v) and _is_psd(P_K) and _is_psd(P_H)):
        raise ArithmeticError("leverage projector self-check failed")
    return {
        "W": W,
        "G": G,
        "G_rank": len(_pivot_columns(G)),
        "G_dagger": G_dagger,
        "P_K": P_K,
        "P_H": P_H,
        "T_v": T_v,
        "W_T_T_v_W": compressed_moment,
        "total_trace": total_trace,
        "captured_trace": captured_trace,
        "direct_high_trace": direct_high_trace,
        "difference_high_trace": difference_trace,
        "g": g,
        "trace_based_high_floor": g - direct_high_trace,
    }


def _anchor_scaling_model() -> dict[str, Any]:
    return {
        "a4_definition": "sqrt(3)/2^(11/4)",
        "a4_fourth_power": Fraction(9, 2048),
        "a4_inverse_fourth_power": Fraction(2048, 9),
        "a4_inverse_square": {
            "rational_coefficient": Fraction(32, 3),
            "square_root_radicand": 2,
        },
        "source_anchor": "c4=e4+rho4*e0 with rho4=-I4/I0",
        "state_identity": "h_lambda=a4*c4",
        "projected_anchor_identity": "p4=a4^(-1)*P_N*k_lambda^+",
        "schedule_hypothesis": "log(lambda)/(N+1)->0",
        "consequence": "norm(p4)->a_infty/a4>0",
        "threshold_effective": False,
        "finite_p_nonzero_claimed": False,
    }


def _exact_regressions() -> dict[str, Any]:
    return _encode({
        "shorted_schur_success": _success_model(),
        "scalar_success": _scalar_model("success"),
        "strictness_equality": _scalar_model("equality"),
        "supercritical_failure": _scalar_model("supercritical"),
        "singular_C_HH_pseudoinverse": _singular_short_model(),
        "capture_does_not_control_raw_cross": _capture_raw_cross_countermodel(),
        "physical_leverage_trace_identity": _leverage_trace_model(),
        "anchor_scaling_arithmetic": _anchor_scaling_model(),
    })


def validate_source_admissions(admissions: dict[str, bool]) -> None:
    """Reject unsupported promotions before an artifact can be emitted."""
    if admissions != SOURCE_ADMISSIONS:
        raise ValueError("source admissions must match the locked claim boundary")


def produce(lambda_numerator: int, dps: int = 80) -> dict[str, Any]:
    p = _integer(lambda_numerator, "lambda_numerator", 5)
    precision = _integer(dps, "dps", 50)
    if p % 2 == 0:
        raise ValueError("lambda_numerator must be odd")
    validate_source_admissions(dict(SOURCE_ADMISSIONS))
    N = (p * p + 3) // 4
    return {
        "schema": SCHEMA,
        "status": STATUS,
        "terminal_state": TERMINAL_STATE,
        "input": {
            "lambda_numerator": p,
            "lambda_denominator": 2,
            "precision_label_decimal_digits": precision,
        },
        "source_hashes": _verified_source_hashes(),
        "locked_conventions": dict(LOCKED_CONVENTIONS),
        "locked_formulas": dict(LOCKED_FORMULAS),
        "source_admissions": dict(SOURCE_ADMISSIONS),
        "certificate": {
            "exact_schedule": {
                "lambda": _rational(Fraction(p, 2)),
                "N_rule": "ceil(lambda^2)",
                "N": N,
                "model_scope": "exact regression models only; not a physical Weil pilot",
            },
            "exact_regressions": _exact_regressions(),
        },
        "arithmetic": dict(ARITHMETIC),
        "producer_pass_boolean_trusted_by_replay": False,
        "claim_scope": {key: list(value) for key, value in CLAIM_SCOPE.items()},
        "result": RESULT,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lambda-numerator", type=int, required=True)
    parser.add_argument("--dps", type=int, default=80)
    parser.add_argument("--output")
    args = parser.parse_args()
    encoded = json.dumps(
        produce(args.lambda_numerator, args.dps), indent=2, sort_keys=True
    ) + "\n"
    if args.output:
        Path(args.output).write_text(encoded, encoding="utf-8")
    else:
        print(encoded, end="")


if __name__ == "__main__":
    main()
