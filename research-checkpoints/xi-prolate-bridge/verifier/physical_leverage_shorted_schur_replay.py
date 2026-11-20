#!/usr/bin/env python3
"""Clean-room replay of the physical-leverage/shorted-Schur checkpoint.

The replay imports neither the producer nor project arithmetic helpers.  It
reconstructs every regression from small integer matrices using ``Fraction``
arithmetic, checks the relevant positive-semidefinite statements directly,
and binds its report to the exact producer bytes.  Producer pass flags and
serialized derived matrices are never trusted.

The producer and verifier both use Python's ``fractions.Fraction`` standard
library.  Their formula assemblies are independent, but that shared exact
arithmetic implementation is an explicit independence limitation.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import itertools
import json
from pathlib import Path
import re
from typing import Any


SCHEMA = "xi-prolate-physical-leverage-shorted-schur-v1"
REPLAY_SCHEMA = "xi-prolate-physical-leverage-shorted-schur-replay-v1"
STATUS = "PHYSICAL_LEVERAGE_SHORTED_SCHUR_COMPONENT"
RESULT = "PHYSICAL_LEVERAGE_SHORTED_SCHUR_COMPONENT_PASS"
REPLAY_RESULT = "PHYSICAL_LEVERAGE_SHORTED_SCHUR_COMPONENT_REPLAY_PASS"
TERMINAL_STATE = "P0_INVALIDATED"
NOTE = "notes/PHYSICAL_LEVERAGE_SHORTED_SCHUR.md"
LOCK = "PHYSICAL_LEVERAGE_SHORTED_SCHUR_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-physical-leverage-shorted-schur-source-lock-v1"

# Frozen component-note and source-lock bytes.
PINNED_HASHES = {
    NOTE: "39147b7fcd5c71304c6977272b72a3f07a789b7c4fb34d2e2ebf51e3b60589f3",
    LOCK: "61c9adb35ca643de78dfb71407272dc68ba086952ed7b89001bba490ab2fb097",
}

_SHA256 = re.compile(r"^[0-9a-f]{64}$")
_INTEGER_TEXT = re.compile(r"^(?:0|-[1-9][0-9]*|[1-9][0-9]*)$")
_POSITIVE_TEXT = re.compile(r"^[1-9][0-9]*$")


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


ARITHMETIC = {
    "precision_mode": "exact rational arithmetic",
    "raw_interval_or_ball_output_applicable": False,
    "library": "Python fractions.Fraction",
    "shared_library_with_verifier": True,
    "independent_formula_trees": True,
    "independence_limitation": "producer and replay share Python integer and Fraction arithmetic",
}


class ReplayError(ValueError):
    """Raised when source bytes, exact arithmetic, or claim scope fail replay."""


Matrix = list[list[Fraction]]


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    try:
        return hashlib.sha256(path.read_bytes()).hexdigest()
    except OSError as exc:
        raise ReplayError(f"cannot read pinned source: {path}") from exc


def _reject_number(token: str) -> None:
    raise ReplayError(f"non-integer JSON number {token!r} is forbidden")


def _unique_object(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise ReplayError(f"duplicate JSON object key: {key}")
        result[key] = value
    return result


def _validate_json(value: Any, path: str = "payload") -> None:
    if value is None or isinstance(value, (str, bool, int)):
        return
    if isinstance(value, float):
        raise ReplayError(f"binary64 value at {path} is forbidden")
    if isinstance(value, list):
        for index, child in enumerate(value):
            _validate_json(child, f"{path}[{index}]")
        return
    if isinstance(value, dict):
        for key, child in value.items():
            if not isinstance(key, str):
                raise ReplayError(f"non-string JSON key at {path}")
            _validate_json(child, f"{path}.{key}")
        return
    raise ReplayError(f"non-JSON value at {path}")


def _strict_json_loads(raw: bytes | str, label: str) -> Any:
    try:
        value = json.loads(
            raw,
            parse_float=_reject_number,
            parse_constant=_reject_number,
            object_pairs_hook=_unique_object,
        )
    except ReplayError:
        raise
    except (UnicodeError, json.JSONDecodeError) as exc:
        raise ReplayError(f"{label} is not strict JSON") from exc
    _validate_json(value, label)
    return value


def _same(left: Any, right: Any) -> bool:
    if type(left) is not type(right):
        return False
    if isinstance(left, dict):
        return set(left) == set(right) and all(_same(left[key], right[key]) for key in left)
    if isinstance(left, list):
        return len(left) == len(right) and all(_same(a, b) for a, b in zip(left, right))
    return left == right


def _int(value: Any, label: str, minimum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise ReplayError(f"{label} must be an exact JSON integer")
    if value < minimum:
        raise ReplayError(f"{label} must be at least {minimum}")
    return value


def _rational(value: Fraction) -> dict[str, str]:
    return {"numerator": str(value.numerator), "denominator": str(value.denominator)}


def _encode(value: Any) -> Any:
    if isinstance(value, Fraction):
        return _rational(value)
    if isinstance(value, list):
        return [_encode(item) for item in value]
    if isinstance(value, dict):
        return {key: _encode(item) for key, item in value.items()}
    return value


def _parse_rational(value: Any, label: str) -> Fraction:
    if not isinstance(value, dict) or set(value) != {"numerator", "denominator"}:
        raise ReplayError(f"{label} must be an exact rational object")
    numerator = value["numerator"]
    denominator = value["denominator"]
    if (
        not isinstance(numerator, str)
        or _INTEGER_TEXT.fullmatch(numerator) is None
        or not isinstance(denominator, str)
        or _POSITIVE_TEXT.fullmatch(denominator) is None
    ):
        raise ReplayError(f"{label} has noncanonical integer text")
    result = Fraction(int(numerator), int(denominator))
    if (str(result.numerator), str(result.denominator)) != (numerator, denominator):
        raise ReplayError(f"{label} is not reduced canonically")
    return result


def _shape(matrix: Matrix) -> tuple[int, int]:
    if not matrix or not matrix[0] or any(len(row) != len(matrix[0]) for row in matrix):
        raise ReplayError("internal exact matrix is empty or ragged")
    return len(matrix), len(matrix[0])


def _transpose(matrix: Matrix) -> Matrix:
    rows, columns = _shape(matrix)
    return [[matrix[i][j] for i in range(rows)] for j in range(columns)]


def _product(left: Matrix, right: Matrix) -> Matrix:
    left_rows, shared = _shape(left)
    right_rows, columns = _shape(right)
    if shared != right_rows:
        raise ReplayError("internal exact matrix shape mismatch")
    return [
        [sum(left[i][k] * right[k][j] for k in range(shared)) for j in range(columns)]
        for i in range(left_rows)
    ]


def _add(left: Matrix, right: Matrix) -> Matrix:
    if _shape(left) != _shape(right):
        raise ReplayError("internal exact matrix addition shape mismatch")
    return [[a + b for a, b in zip(x, y)] for x, y in zip(left, right)]


def _subtract(left: Matrix, right: Matrix) -> Matrix:
    if _shape(left) != _shape(right):
        raise ReplayError("internal exact matrix subtraction shape mismatch")
    return [[a - b for a, b in zip(x, y)] for x, y in zip(left, right)]


def _scale(value: Fraction, matrix: Matrix) -> Matrix:
    return [[value * entry for entry in row] for row in matrix]


def _identity(size: int) -> Matrix:
    return [[Fraction(i == j) for j in range(size)] for i in range(size)]


def _diag(values: list[Fraction]) -> Matrix:
    return [[values[i] if i == j else Fraction(0) for j in range(len(values))] for i in range(len(values))]


def _outer(left: list[Fraction], right: list[Fraction] | None = None) -> Matrix:
    if right is None:
        right = left
    return [[x * y for y in right] for x in left]


def _trace(matrix: Matrix) -> Fraction:
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ReplayError("internal trace of nonsquare matrix")
    return sum(matrix[i][i] for i in range(rows))


def _determinant(matrix: Matrix) -> Fraction:
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ReplayError("internal determinant of nonsquare matrix")
    work = [row[:] for row in matrix]
    sign = Fraction(1)
    determinant = Fraction(1)
    for column in range(columns):
        pivot = next((row for row in range(column, rows) if work[row][column] != 0), None)
        if pivot is None:
            return Fraction(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            sign = -sign
        pivot_value = work[column][column]
        determinant *= pivot_value
        for row in range(column + 1, rows):
            multiplier = work[row][column] / pivot_value
            for j in range(column + 1, columns):
                work[row][j] -= multiplier * work[column][j]
    return sign * determinant


def _principal(matrix: Matrix, indices: tuple[int, ...]) -> Matrix:
    return [[matrix[i][j] for j in indices] for i in indices]


def _is_symmetric(matrix: Matrix) -> bool:
    return matrix == _transpose(matrix)


def _is_psd(matrix: Matrix) -> bool:
    rows, columns = _shape(matrix)
    if rows != columns or not _is_symmetric(matrix):
        return False
    return all(
        _determinant(_principal(matrix, indices)) >= 0
        for size in range(1, rows + 1)
        for indices in itertools.combinations(range(rows), size)
    )


def _is_pd(matrix: Matrix) -> bool:
    rows, columns = _shape(matrix)
    if rows != columns or not _is_symmetric(matrix):
        return False
    return all(_determinant(_principal(matrix, tuple(range(size)))) > 0 for size in range(1, rows + 1))


def _inverse(matrix: Matrix) -> Matrix:
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ReplayError("internal inverse of nonsquare matrix")
    work = [row[:] + identity for row, identity in zip(matrix, _identity(rows))]
    for column in range(columns):
        pivot = next((row for row in range(column, rows) if work[row][column]), None)
        if pivot is None:
            raise ReplayError("internal inverse of singular matrix")
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
        pivot_value = work[column][column]
        work[column] = [entry / pivot_value for entry in work[column]]
        for row in range(rows):
            if row == column:
                continue
            multiplier = work[row][column]
            if multiplier:
                work[row] = [a - multiplier * b for a, b in zip(work[row], work[column])]
    return [row[rows:] for row in work]


def _rref(matrix: Matrix) -> tuple[Matrix, list[int]]:
    rows, columns = _shape(matrix)
    work = [row[:] for row in matrix]
    pivots: list[int] = []
    pivot_row = 0
    for column in range(columns):
        pivot = next((row for row in range(pivot_row, rows) if work[row][column]), None)
        if pivot is None:
            continue
        work[pivot_row], work[pivot] = work[pivot], work[pivot_row]
        pivot_value = work[pivot_row][column]
        work[pivot_row] = [entry / pivot_value for entry in work[pivot_row]]
        for row in range(rows):
            if row == pivot_row:
                continue
            multiplier = work[row][column]
            if multiplier:
                work[row] = [a - multiplier * b for a, b in zip(work[row], work[pivot_row])]
        pivots.append(column)
        pivot_row += 1
        if pivot_row == rows:
            break
    return work, pivots


def _rank(matrix: Matrix) -> int:
    return len(_rref(matrix)[1])


def _nullspace(matrix: Matrix) -> Matrix:
    reduced, pivots = _rref(matrix)
    _rows, columns = _shape(matrix)
    free = [column for column in range(columns) if column not in pivots]
    if not free:
        return [[] for _ in range(columns)]
    basis: Matrix = []
    for free_column in free:
        vector = [Fraction(0) for _ in range(columns)]
        vector[free_column] = Fraction(1)
        for row, pivot_column in enumerate(pivots):
            vector[pivot_column] = -reduced[row][free_column]
        basis.append(vector)
    return _transpose(basis)


def _pseudoinverse_symmetric(matrix: Matrix) -> Matrix:
    """Exact symmetric pseudoinverse via the null-space projector.

    This intentionally differs from the producer's rank-factorization path.
    For symmetric A and the orthogonal projector P0 onto ker(A),
    A^dagger=(A+P0)^(-1)-P0.
    """
    rows, columns = _shape(matrix)
    if rows != columns or not _is_symmetric(matrix):
        raise ReplayError("symmetric pseudoinverse requires a symmetric square matrix")
    null_basis = _nullspace(matrix)
    if null_basis and len(null_basis[0]) > 0:
        gram = _product(_transpose(null_basis), null_basis)
        projector = _product(_product(null_basis, _inverse(gram)), _transpose(null_basis))
    else:
        projector = [[Fraction(0) for _ in range(rows)] for _ in range(rows)]
    candidate = _subtract(_inverse(_add(matrix, projector)), projector)
    if _product(_product(matrix, candidate), matrix) != matrix:
        raise ReplayError("first independent Penrose identity failed")
    if _product(_product(candidate, matrix), candidate) != candidate:
        raise ReplayError("second independent Penrose identity failed")
    if not _is_symmetric(_product(matrix, candidate)):
        raise ReplayError("third independent Penrose identity failed")
    if not _is_symmetric(_product(candidate, matrix)):
        raise ReplayError("fourth independent Penrose identity failed")
    return candidate


def _block(matrix: Matrix, row_stop: int, column_stop: int, row_start: int = 0, column_start: int = 0) -> Matrix:
    return [row[column_start:column_stop] for row in matrix[row_start:row_stop]]


def _short(matrix: Matrix, k_dimension: int) -> tuple[Matrix, Matrix, Matrix, Matrix, Matrix]:
    dimension, columns = _shape(matrix)
    if dimension != columns or not 0 < k_dimension < dimension:
        raise ReplayError("internal short dimensions invalid")
    C_KK = _block(matrix, k_dimension, k_dimension)
    C_KH = _block(matrix, k_dimension, dimension, column_start=k_dimension)
    C_HH = _block(matrix, dimension, dimension, row_start=k_dimension, column_start=k_dimension)
    C_HH_dagger = _pseudoinverse_symmetric(C_HH)
    short = _subtract(C_KK, _product(_product(C_KH, C_HH_dagger), _transpose(C_KH)))
    return short, C_KK, C_KH, C_HH, C_HH_dagger


def _embed_short(short: Matrix, dimension: int) -> Matrix:
    k_dimension, columns = _shape(short)
    if k_dimension != columns or k_dimension >= dimension:
        raise ReplayError("internal embedded-short dimensions invalid")
    zero = Fraction(0)
    return [
        [short[i][j] if i < k_dimension and j < k_dimension else zero for j in range(dimension)]
        for i in range(dimension)
    ]


def _perfect_square_root(value: Fraction) -> Fraction:
    from math import isqrt

    if value < 0:
        raise ReplayError("internal negative rational square")
    numerator = isqrt(value.numerator)
    denominator = isqrt(value.denominator)
    if numerator * numerator != value.numerator or denominator * denominator != value.denominator:
        raise ReplayError("internal rational square is not perfect")
    return Fraction(numerator, denominator)


def _success_model() -> dict[str, Any]:
    Delta = _identity(2)
    g = Fraction(5)
    C: Matrix = [[Fraction(1), Fraction(2), Fraction(2)], [Fraction(2), Fraction(5), Fraction(4)], [Fraction(2), Fraction(4), Fraction(4)]]
    R: Matrix = [[Fraction(3), Fraction(0), Fraction(1)], [Fraction(0), Fraction(1), Fraction(0)], [Fraction(1), Fraction(0), Fraction(1)]]
    short, C_KK, C_KH, C_HH, C_HH_dagger = _short(C, 2)
    R_KK = _block(R, 2, 2)
    R_KH = _block(R, 2, 3, column_start=2)
    R_HH = _block(R, 3, 3, row_start=2, column_start=2)
    B = _subtract(_add(_scale(g, _identity(3)), C), R)
    short_remainder = _subtract(C, _embed_short(short, 3))
    if not (_is_psd(C) and _is_psd(R) and _is_psd(short_remainder)):
        raise ReplayError("independent success-model PSD reconstruction failed")
    if short != [[Fraction(0), Fraction(0)], [Fraction(0), Fraction(1)]]:
        raise ReplayError("independent success-model short mismatch")

    rho = R_HH[0][0]
    eta = g - rho
    beta = max(R_KK[0][0], R_KK[1][1])
    alpha_matrix = _add(_scale(g, _identity(2)), short)
    alpha = min(alpha_matrix[0][0], alpha_matrix[1][1])
    mu = alpha - beta
    low = _add(_subtract(_scale(g, _identity(2)), R_KK), short)
    actual_cross_squared = _product(_transpose(R_KH), R_KH)[0][0]
    automatic_cross_upper = rho * beta
    cross_matrix_margin = _subtract(_scale(rho, R_KK), _product(R_KH, _transpose(R_KH)))
    if not _is_psd(cross_matrix_margin) or actual_cross_squared > automatic_cross_upper:
        raise ReplayError("independent automatic-cross reconstruction failed")
    reserve = eta * mu - automatic_cross_upper
    chi_bar_squared = automatic_cross_upper / eta
    discriminant = (mu - 1) ** 2 + 4 * chi_bar_squared
    glued_factor = (mu + 1 - _perfect_square_root(discriminant)) / 2
    high_inverse = _inverse(_subtract(_scale(g, _identity(1)), R_HH))
    anisotropic_schur = _subtract(low, _product(_product(R_KH, high_inverse), _transpose(R_KH)))
    scalar_comparator = [[mu, Fraction(0), -R_KH[0][0]], [Fraction(0), mu, -R_KH[1][0]], [-R_KH[0][0], -R_KH[1][0], eta]]
    shorted_lower_matrix = [
        [low[0][0], low[0][1], -R_KH[0][0]],
        [low[1][0], low[1][1], -R_KH[1][0]],
        [-R_KH[0][0], -R_KH[1][0], eta],
    ]
    if _subtract(B, shorted_lower_matrix) != short_remainder:
        raise ReplayError("independent shorted PSD domination identity failed")
    if reserve <= 0 or glued_factor != Fraction(1, 2):
        raise ReplayError("independent scalar reserve reconstruction failed")
    if anisotropic_schur != _diag([Fraction(7, 4), Fraction(5)]) or not _is_pd(anisotropic_schur):
        raise ReplayError("independent anisotropic Schur reconstruction failed")
    if not _is_pd(scalar_comparator) or not _is_pd(B):
        raise ReplayError("independent success gluing positivity failed")
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
        "short_domination_remainder": short_remainder,
        "R_KK": R_KK,
        "R_KH": R_KH,
        "R_HH": R_HH,
        "alpha": alpha,
        "beta": beta,
        "mu": mu,
        "rho": rho,
        "eta": eta,
        "low_matrix": low,
        "actual_cross_norm_squared": actual_cross_squared,
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
        C = _diag([Fraction(4), Fraction(0)])
        R = _scale(Fraction(8, 3), [[Fraction(1), Fraction(1)], [Fraction(1), Fraction(1)]])
    elif kind == "supercritical":
        C = _diag([Fraction(4), Fraction(0)])
        R = _scale(Fraction(3), [[Fraction(1), Fraction(1)], [Fraction(1), Fraction(1)]])
    else:
        raise ReplayError("unknown independent scalar model")
    if not (_is_psd(C) and _is_psd(R)):
        raise ReplayError("independent scalar input is not PSD")
    short, _C_KK, C_KH, C_HH, C_HH_dagger = _short(C, 1)
    R_KK = R[0][0]
    R_KH = R[0][1]
    rho = R[1][1]
    eta = g - rho
    beta = R_KK / Delta[0][0]
    alpha = (g + short[0][0]) / Delta[0][0]
    mu = alpha - beta
    actual_cross_squared = R_KH**2 / Delta[0][0]
    automatic_cross_upper = rho * beta
    reserve = eta * mu - automatic_cross_upper
    B = _subtract(_add(_scale(g, _identity(2)), C), R)
    comparator = [[mu * Delta[0][0], -R_KH], [-R_KH, eta]]
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
    C: Matrix = [[Fraction(2), Fraction(2), Fraction(2), Fraction(0)], [Fraction(2), Fraction(6), Fraction(4), Fraction(0)], [Fraction(2), Fraction(4), Fraction(4), Fraction(0)], [Fraction(0), Fraction(0), Fraction(0), Fraction(0)]]
    short, C_KK, C_KH, C_HH, C_HH_dagger = _short(C, 2)
    range_residual = _product(C_KH, _subtract(_identity(2), _product(C_HH_dagger, C_HH)))
    domination_remainder = _subtract(C, _embed_short(short, 4))
    if range_residual != [[Fraction(0), Fraction(0)], [Fraction(0), Fraction(0)]]:
        raise ReplayError("independent singular-short range compatibility failed")
    if not (_is_psd(C) and _is_psd(short) and _is_psd(domination_remainder)):
        raise ReplayError("independent singular-short PSD reconstruction failed")
    return {
        "k_dimension": 2,
        "h_dimension": 2,
        "C": C,
        "C_KK": C_KK,
        "C_KH": C_KH,
        "C_HH": C_HH,
        "C_HH_rank": _rank(C_HH),
        "C_HH_dagger": C_HH_dagger,
        "range_compatibility_residual": range_residual,
        "C_short_K": short,
        "short_domination_remainder": domination_remainder,
    }


def _capture_raw_cross_model() -> dict[str, Any]:
    g = Fraction(2)
    C = _outer([Fraction(2), Fraction(0), Fraction(3)])
    R = _diag([Fraction(3), Fraction(0), Fraction(0)])
    B = _subtract(_add(_scale(g, _identity(3)), C), R)
    short, _C_KK, _C_KH, _C_HH, _C_HH_dagger = _short(C, 2)
    B_KK = _block(B, 2, 2)
    B_KH = _block(B, 2, 3, column_start=2)
    B_HH = B[2][2]
    low_floor = min(B_KK[0][0], B_KK[1][1])
    raw_cross_squared = _product(_transpose(B_KH), B_KH)[0][0]
    determinant = _determinant(B)
    if R[2][2] != 0 or low_floor <= 0 or B_HH <= 0 or determinant != -6 or _is_psd(B):
        raise ReplayError("independent raw-cross obstruction failed")
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
    W: Matrix = [[Fraction(1), Fraction(0), Fraction(1)], [Fraction(0), Fraction(2), Fraction(0)], [Fraction(1), Fraction(0), Fraction(1)]]
    T_v = _diag([Fraction(1), Fraction(2), Fraction(3)])
    G = _product(_transpose(W), W)
    G_dagger = _pseudoinverse_symmetric(G)
    P_K = _product(_product(W, G_dagger), _transpose(W))
    P_H = _subtract(_identity(3), P_K)
    compressed_moment = _product(_product(_transpose(W), T_v), W)
    total_trace = _trace(T_v)
    captured_trace = _trace(_product(G_dagger, compressed_moment))
    direct_high_trace = _trace(_product(_product(P_H, T_v), P_H))
    difference_trace = total_trace - captured_trace
    g = Fraction(3)
    if _product(P_K, P_K) != P_K or _product(P_H, P_H) != P_H:
        raise ReplayError("independent leverage projectors are not idempotent")
    if direct_high_trace != difference_trace or direct_high_trace != 2:
        raise ReplayError("independent leverage trace identity failed")
    return {
        "W": W,
        "G": G,
        "G_rank": _rank(G),
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
    a4_fourth = Fraction(9, 2048)
    inverse_fourth = Fraction(1, 1) / a4_fourth
    radical_coefficient = Fraction(32, 3)
    if inverse_fourth != Fraction(2048, 9):
        raise ReplayError("independent anchor inverse fourth power failed")
    if radical_coefficient**2 * 2 != inverse_fourth:
        raise ReplayError("independent anchor inverse-square radical failed")
    return {
        "a4_definition": "sqrt(3)/2^(11/4)",
        "a4_fourth_power": a4_fourth,
        "a4_inverse_fourth_power": inverse_fourth,
        "a4_inverse_square": {
            "rational_coefficient": radical_coefficient,
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
    regressions = {
        "shorted_schur_success": _success_model(),
        "scalar_success": _scalar_model("success"),
        "strictness_equality": _scalar_model("equality"),
        "supercritical_failure": _scalar_model("supercritical"),
        "singular_C_HH_pseudoinverse": _singular_short_model(),
        "capture_does_not_control_raw_cross": _capture_raw_cross_model(),
        "physical_leverage_trace_identity": _leverage_trace_model(),
        "anchor_scaling_arithmetic": _anchor_scaling_model(),
    }
    if regressions["scalar_success"]["strict_reserve"] != 5:
        raise ReplayError("independent scalar-success reserve mismatch")
    if regressions["strictness_equality"]["strict_reserve"] != 0:
        raise ReplayError("independent equality boundary was not rejected")
    if regressions["supercritical_failure"]["strict_reserve"] != -1:
        raise ReplayError("independent supercritical boundary was not rejected")
    return _encode(regressions)


def reconstruct(lambda_numerator: int, dps: int) -> dict[str, Any]:
    p = _int(lambda_numerator, "lambda_numerator", 5)
    digits = _int(dps, "precision_label_decimal_digits", 50)
    if p % 2 == 0:
        raise ReplayError("lambda numerator must be odd")
    # ``digits`` is intentionally metadata: all reconstructed values are exact.
    _ = digits
    return {
        "exact_schedule": {
            "lambda": _rational(Fraction(p, 2)),
            "N_rule": "ceil(lambda^2)",
            "N": (p * p + 3) // 4,
            "model_scope": "exact regression models only; not a physical Weil pilot",
        },
        "exact_regressions": _exact_regressions(),
    }


def _source_hashes() -> dict[str, str]:
    root = _root()
    for relative, expected in PINNED_HASHES.items():
        if _SHA256.fullmatch(expected) is None:
            raise ReplayError(f"PINNED_HASHES placeholder not finalized: {relative}")
        if _sha256(root / relative) != expected:
            raise ReplayError(f"source byte hash mismatch: {relative}")

    lock = _strict_json_loads((root / LOCK).read_bytes(), "source lock")
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
        raise ReplayError("physical-leverage source-lock inventory mismatch")
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
        if not _same(lock[key], expected):
            raise ReplayError(f"physical-leverage source-lock {key} mutation")

    result = dict(PINNED_HASHES)
    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list) or not dependencies:
        raise ReplayError("physical-leverage source-lock dependencies missing")
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ReplayError("malformed physical-leverage dependency")
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
            raise ReplayError("invalid physical-leverage dependency fields")
        if _sha256(root / relative) != expected:
            raise ReplayError(f"dependency hash mismatch: {relative}")
        result[relative] = expected
    return dict(sorted(result.items()))


def replay(payload: Any, producer_bytes: bytes | None = None) -> dict[str, Any]:
    if producer_bytes is None:
        raise ReplayError("exact producer artifact bytes are required")
    decoded = _strict_json_loads(producer_bytes, "producer artifact bytes")
    if not _same(decoded, payload):
        raise ReplayError("payload and exact producer bytes do not decode exactly")
    if not isinstance(payload, dict):
        raise ReplayError("producer artifact must be an object")
    expected_top = {
        "schema",
        "status",
        "terminal_state",
        "input",
        "source_hashes",
        "locked_conventions",
        "locked_formulas",
        "source_admissions",
        "certificate",
        "arithmetic",
        "producer_pass_boolean_trusted_by_replay",
        "claim_scope",
        "result",
    }
    if set(payload) != expected_top:
        raise ReplayError("producer top-level inventory mismatch")
    fixed = {
        "schema": SCHEMA,
        "status": STATUS,
        "terminal_state": TERMINAL_STATE,
        "locked_conventions": LOCKED_CONVENTIONS,
        "locked_formulas": LOCKED_FORMULAS,
        "source_admissions": SOURCE_ADMISSIONS,
        "arithmetic": ARITHMETIC,
        "producer_pass_boolean_trusted_by_replay": False,
        "claim_scope": CLAIM_SCOPE,
        "result": RESULT,
    }
    for key, expected in fixed.items():
        if not _same(payload[key], expected):
            raise ReplayError(f"producer {key} mutation")

    source_hashes = _source_hashes()
    if not _same(payload["source_hashes"], source_hashes):
        raise ReplayError("source-hash inventory mismatch")

    inputs = payload["input"]
    if not isinstance(inputs, dict) or set(inputs) != {
        "lambda_numerator",
        "lambda_denominator",
        "precision_label_decimal_digits",
    }:
        raise ReplayError("input inventory mismatch")
    p = _int(inputs["lambda_numerator"], "lambda_numerator", 5)
    denominator = _int(inputs["lambda_denominator"], "lambda_denominator", 1)
    dps = _int(
        inputs["precision_label_decimal_digits"],
        "precision_label_decimal_digits",
        50,
    )
    if denominator != 2 or p % 2 == 0:
        raise ReplayError("half-integer matched schedule violation")

    expected_certificate = reconstruct(p, dps)
    if not _same(payload["certificate"], expected_certificate):
        raise ReplayError("exact certificate reconstruction mismatch")

    producer_digest = hashlib.sha256(producer_bytes).hexdigest()
    return {
        "schema": REPLAY_SCHEMA,
        "status": REPLAY_RESULT,
        "terminal_state": TERMINAL_STATE,
        "producer_binding": {
            "byte_source": "exact artifact file bytes",
            "byte_count": len(producer_bytes),
            "sha256": producer_digest,
        },
        "input": {
            "lambda_numerator": p,
            "lambda_denominator": denominator,
            "precision_label_decimal_digits": dps,
        },
        "source_hashes": source_hashes,
        "reconstructed_certificate": expected_certificate,
        "checks": {
            "source_note_lock_and_dependencies_rehashed": True,
            "producer_bytes_bound_exactly": True,
            "Krein_short_reconstructed": True,
            "positive_short_domination_pass": True,
            "automatic_cross_matrix_inequality_pass": True,
            "rho_eta_beta_reconstructed": True,
            "strict_scalar_reserve_pass": True,
            "conservative_relative_floor_one_half_pass": True,
            "anisotropic_Schur_floor_seven_fourths_pass": True,
            "leverage_trace_identity_pass": True,
            "anchor_scaling_arithmetic_pass": True,
            "eventual_anchor_nonvanishing_only": True,
            "equality_and_supercritical_reserves_rejected": True,
            "singular_H_Moore_Penrose_short_pass": True,
            "raw_positive_cross_shortcut_rejected": True,
            "full_certificate_tamper_surface_reconstructed": True,
            "fourier_minus_sign_locked": True,
            "inversion_reflection_locked": True,
            "producer_booleans_trusted": False,
            "cached_matrices_read": False,
            "binary64_parameters_used": False,
        },
        "arithmetic": dict(ARITHMETIC),
        "claim_boundary": {
            "finite_input_anchor_nonzero": False,
            "analytic_physical_leverage_capture": False,
            "signed_low_comparison": False,
            "physical_coframe": False,
            "signed_sector_floor": False,
            "equation_5_2": False,
            "locally_uniform_determinant_convergence": False,
            "rh_proved": False,
        },
        "result": REPLAY_RESULT,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("artifact")
    parser.add_argument("--output")
    args = parser.parse_args()
    raw = Path(args.artifact).read_bytes()
    payload = _strict_json_loads(raw, "producer artifact")
    report = replay(payload, producer_bytes=raw)
    encoded = json.dumps(report, indent=2, sort_keys=True) + "\n"
    if args.output:
        Path(args.output).write_text(encoded, encoding="utf-8")
    else:
        print(encoded, end="")


if __name__ == "__main__":
    main()
