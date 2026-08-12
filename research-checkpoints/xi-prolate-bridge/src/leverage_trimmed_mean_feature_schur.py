#!/usr/bin/env python3
"""Produce exact models for the trimmed-mean/feature-Schur checkpoint.

The models certify finite algebraic identities and adversarial boundaries.
They are not physical prolate--Weil pilots and prove no asymptotic schedule.
All derived values use :class:`fractions.Fraction`.
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


SCHEMA = "xi-prolate-leverage-trimmed-mean-feature-schur-v1"
STATUS = "LEVERAGE_TRIMMED_MEAN_FEATURE_SCHUR_COMPONENT"
RESULT = "LEVERAGE_TRIMMED_MEAN_FEATURE_SCHUR_COMPONENT_PASS"
TERMINAL_STATE = "P0_INVALIDATED"
NOTE = "notes/LEVERAGE_TRIMMED_MEAN_FEATURE_SCHUR.md"
LOCK = "LEVERAGE_TRIMMED_MEAN_FEATURE_SCHUR_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-leverage-trimmed-mean-feature-schur-source-lock-v1"

PINNED_HASHES = {
    NOTE: "c9f10ffb6b6ceeafe8ea63566d10c3af7eb6265c509c8d63e259bc407cc7f79a",
    LOCK: "e387fc1c539283dead8110eeac6d5c6798839a8bcfc0a17c65af87587cd3458c",
}
_SHA256 = re.compile(r"^[0-9a-f]{64}$")

LOCKED_CONVENTIONS = {
    "source_interval": "[-lambda,lambda] with Lebesgue measure and zero extension; the physical logarithmic interval is [-log(lambda),log(lambda)]",
    "fourier_sign": "fhat(t)=integral f(y)*exp(-i*t*y) dy and Plancherel measure is dt/(2*pi)",
    "prime_endpoint": "every prime power n<=lambda^2 is included and translations at magnitude 2*log(lambda) vanish by zero extension",
    "prime_sign": "m_lambda=2*theta_prime-2*sum Lambda(n)/sqrt(n)*cos(t*log(n))",
    "inversion": "multiplicatively Jf(u)=f(u^(-1)); in the additive logarithmic coordinate Jf(y)=f(-y)",
    "source_normalization": "all-even prolate combinations use the source zero-Lebesgue-integral normalization, never unit normalization",
    "strictness": "ell_H=c_minus, rho=g, or a zero Schur floor is a rejection, never a pass",
    "artifact_scope": "p and dps label exact rational theorem-regression models, not physical prolate-Weil pilot matrices or an asymptotic schedule",
    "arithmetic": "all component matrices, atom weights, exterior volumes, and reserves are exact reduced rationals; binary64 JSON numbers are forbidden",
}

LOCKED_FORMULAS = {
    "exterior_leverage": "E_(k+1)([W,a])=E_k(W)*kappa_H(a), with E_k the sum of k-column Gram determinants and E_0=1",
    "trimmed_mean": "ell_H=inf{integral alpha*w*dmu_H: 0<=alpha<=1 and integral alpha*dmu_H=1}, dmu_H=kappa_H(t)*dt/(2*pi)",
    "stop_loss": "sup_g(g-integral(g-w)_+*dmu_H)=ell_H; existence of g>0 with V_H(g)+c_minus<g is equivalent to ell_H>c_minus",
    "direct_floor": "P_H*T_(m_lambda-U)*P_H >= ell_H*I_H",
    "arch_prime": "abs(ell_H-ell_b)<=2*sqrt(M_H), b=2*theta_prime-U and M_H=integral S_lambda^2*dmu_H",
    "prime_second_moment": "M_H=(1/2)*sum_(n,m<=lambda^2)c_n*c_m*(Re Gamma_H(log(n/m))+Re Gamma_H(log(n*m))) with c_n=Lambda(n)/sqrt(n)",
    "higher_moment": "for the multiplier-only negative block, rho<=(tr R_HH^p)^(1/p)<=A_(p,H)^(1/p)+2*P_(p,H)^(1/p) for even p; an unabsorbed odd pole adds c_minus before comparison with g",
    "feature_trace": "tau_H=tr R_HH=norm(P_H*Y^*)_HS^2=inf_Z norm(Y^*-WZ)_HS^2; rho<=tau_H, with tau_H=V_H for the multiplier-only block and tau_H=V_H+c_minus when the odd pole is an additional negative feature",
    "positive_short": "C_/K=X_K^*(I-P_(ran X_H))*X_K=C_KK-C_KH*C_HH^dagger*C_HK, including singular C_HH",
    "negative_round_trip": "R_KK+R_KH*(gI-R_HH)^(-1)*R_HK=Y_K^*(I-Y_H*Y_H^*/g)^(-1)*Y_K when rho<g",
    "neumann_tail": "after terms j=0,...,q the effective-load remainder is <=((rho/g)^(q+1)/(1-rho/g))*R_KK",
    "mobius_right_inverse": "R_lambda*g(x)=sum_(n<=lambda/x)mu(n)*g(nx)/sqrt(nx), A_lambda*R_lambda*g=g, followed by an invisible central-hole correction to zero source integral",
    "prolate_common_eigensystem": "for k_c(z)=sin(c*z)/(pi*z), (L_(c,x)-L_(c,y))*k_c(x-y)=0; the sinc concentration operator commutes with the simple complete Sturm prolate operator and injectivity identifies their common modes",
    "coframe_tail": "T P_F T^*=R^(1/2)*(I-L_F)*R^(1/2), L_F=Z*(I-P_F)*Z^*, and full row rank is equivalent to norm(L_F)<1",
}

CLAIM_SCOPE = {
    "proved": [
        "the exact exterior-volume representation of leverage density and the odd pole surcharge",
        "stop-loss duality for the lower-one trimmed mean and its exact equivalence to the optimized strict trace-leverage condition",
        "the direct high-space multiplier floor and its archimedean-minus-prime-second-moment lower bound",
        "the exact feature-space positive short, negative round-trip load, and Neumann tail bound",
        "an explicit bounded Mobius right inverse after an invisible central-hole zero-integral correction",
        "eventual full row span by some finite all-even prolate prefix for every fixed finite physical parity space",
        "exact rational countermodels separating trace from norm, diagonal data from orientation, and sufficient shorting from positivity",
    ],
    "not_proved": [
        "a positive trimmed-mean margin or higher-moment high inverse on a common unbounded schedule",
        "the prescribed separate 0 mod 4 even and 2 mod 4 odd buffered coframes",
        "an effective bound on the all-even prefix terminal label",
        "the signed source-coordinate low floor or the required oriented cross estimate",
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
    "prime_block_sign_changed": False,
    "inversion_reflection_dropped": False,
    "unit_source_normalization_substituted": False,
    "trimmed_selector_capacity_omitted": False,
    "odd_pole_surcharge_omitted": False,
    "nonstrict_reserve_reported_as_pass": False,
    "trace_failure_interpreted_as_spectral_failure": False,
    "physical_schedule_bound_claimed": False,
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
        "claim_class": "LEVERAGE_TRIMMED_MEAN_FEATURE_SCHUR_REDUCTION",
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
        relative, expected, role = item["path"], item["sha256"], item["role"]
        if (
            not isinstance(relative, str) or not relative
            or Path(relative).is_absolute() or ".." in Path(relative).parts
            or relative in result or not isinstance(expected, str)
            or _SHA256.fullmatch(expected) is None
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


def _zeros(rows: int, columns: int) -> Matrix:
    return [[Fraction(0) for _ in range(columns)] for _ in range(rows)]


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
    return [[sum((left[i][k] * right[k][j] for k in range(lc)), Fraction(0))
             for j in range(rc)] for i in range(lr)]


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
    return [[value if i == j else Fraction(0) for j, value in enumerate(values)]
            for i in range(len(values))]


def _outer(left: list[Fraction], right: list[Fraction] | None = None) -> Matrix:
    other = left if right is None else right
    return [[a * b for b in other] for a in left]


def _hstack(left: Matrix, right: Matrix) -> Matrix:
    if len(left) != len(right):
        raise ValueError("row mismatch")
    return [lrow + rrow for lrow, rrow in zip(left, right)]


def _gram(matrix: Matrix) -> Matrix:
    return _matmul(_transpose(matrix), matrix)


def _trace(matrix: Matrix) -> Fraction:
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ValueError("trace requires square matrix")
    return sum((matrix[i][i] for i in range(rows)), Fraction(0))


def _determinant(matrix: Matrix) -> Fraction:
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ValueError("determinant requires square matrix")
    if rows == 0:
        return Fraction(1)
    work = [row[:] for row in matrix]
    result = Fraction(1)
    for column in range(rows):
        pivot = next((i for i in range(column, rows) if work[i][column]), None)
        if pivot is None:
            return Fraction(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            result = -result
        value = work[column][column]
        result *= value
        for i in range(column + 1, rows):
            factor = work[i][column] / value
            for j in range(column + 1, rows):
                work[i][j] -= factor * work[column][j]
    return result


def _inverse(matrix: Matrix) -> Matrix:
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ValueError("inverse requires square matrix")
    work = [row[:] + eye for row, eye in zip(matrix, _identity(rows))]
    for column in range(rows):
        pivot = next((i for i in range(column, rows) if work[i][column]), None)
        if pivot is None:
            raise ValueError("singular matrix")
        work[column], work[pivot] = work[pivot], work[column]
        value = work[column][column]
        work[column] = [entry / value for entry in work[column]]
        for i in range(rows):
            if i == column:
                continue
            factor = work[i][column]
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
        value = work[pivot_row][column]
        work[pivot_row] = [entry / value for entry in work[pivot_row]]
        for i in range(rows):
            if i == pivot_row:
                continue
            factor = work[i][column]
            work[i] = [a - factor * b for a, b in zip(work[i], work[pivot_row])]
        pivots.append(column)
        pivot_row += 1
        if pivot_row == rows:
            break
    return pivots


def _rank(matrix: Matrix) -> int:
    return len(_pivot_columns(matrix))


def _columns(matrix: Matrix, indices: Iterable[int]) -> Matrix:
    chosen = tuple(indices)
    return [[row[j] for j in chosen] for row in matrix]


def _column_projector(matrix: Matrix) -> Matrix:
    rows, _ = _shape(matrix)
    pivots = _pivot_columns(matrix)
    if not pivots:
        return _zeros(rows, rows)
    basis = _columns(matrix, pivots)
    return _matmul(_matmul(basis, _inverse(_gram(basis))), _transpose(basis))


def _pseudoinverse_psd(matrix: Matrix) -> Matrix:
    rows, columns = _shape(matrix)
    if rows != columns or matrix != _transpose(matrix):
        raise ValueError("PSD pseudoinverse requires symmetric square matrix")
    pivots = _pivot_columns(matrix)
    if not pivots:
        return _zeros(rows, rows)
    basis = _columns(matrix, pivots)
    middle = _matmul(_matmul(_transpose(basis), matrix), basis)
    return _matmul(_matmul(basis, _inverse(middle)), _transpose(basis))


def _principal(matrix: Matrix, indices: Iterable[int]) -> Matrix:
    chosen = tuple(indices)
    return [[matrix[i][j] for j in chosen] for i in chosen]


def _is_psd(matrix: Matrix) -> bool:
    rows, columns = _shape(matrix)
    if rows != columns or matrix != _transpose(matrix):
        return False
    for size in range(1, rows + 1):
        for indices in itertools.combinations(range(rows), size):
            if _determinant(_principal(matrix, indices)) < 0:
                return False
    return True


def _is_pd(matrix: Matrix) -> bool:
    rows, columns = _shape(matrix)
    if rows != columns or matrix != _transpose(matrix):
        return False
    return all(_determinant(_principal(matrix, range(size))) > 0
               for size in range(1, rows + 1))


def _exterior_volume(matrix: Matrix, order: int) -> Fraction:
    _, columns = _shape(matrix)
    if order == 0:
        return Fraction(1)
    if order < 0 or order > columns:
        return Fraction(0)
    return sum((_determinant(_gram(_columns(matrix, subset)))
                for subset in itertools.combinations(range(columns), order)),
               Fraction(0))


def _quadratic(vector: list[Fraction], matrix: Matrix) -> Fraction:
    column = [[entry] for entry in vector]
    return _matmul(_matmul([vector], matrix), column)[0][0]


def _block(matrix: Matrix, r0: int, r1: int, c0: int, c1: int) -> Matrix:
    return [row[c0:c1] for row in matrix[r0:r1]]


def _embed_top_left(matrix: Matrix, dimension: int) -> Matrix:
    rows, columns = _shape(matrix)
    if rows != columns or rows > dimension:
        raise ValueError("bad embedded block")
    result = _zeros(dimension, dimension)
    for i in range(rows):
        for j in range(rows):
            result[i][j] = matrix[i][j]
    return result


def _perfect_square_root(value: Fraction) -> Fraction:
    if value < 0:
        raise ValueError("negative rational square")
    numerator = isqrt(value.numerator)
    denominator = isqrt(value.denominator)
    if numerator * numerator != value.numerator or denominator * denominator != value.denominator:
        raise ValueError("rational is not a perfect square")
    return Fraction(numerator, denominator)


def _trimmed_mean(weights: list[Fraction], values: list[Fraction]) -> tuple[Fraction, list[Fraction], Fraction]:
    if len(weights) != len(values) or not weights:
        raise ValueError("trimmed-mean data mismatch")
    if any(weight < 0 for weight in weights) or sum(weights, Fraction(0)) < 1:
        raise ValueError("trimmed-mean mass must be at least one")
    remaining = Fraction(1)
    allocation = [Fraction(0) for _ in weights]
    threshold: Fraction | None = None
    for index in sorted(range(len(values)), key=lambda j: (values[j], j)):
        take = min(weights[index], remaining)
        allocation[index] = take
        if take:
            threshold = values[index]
        remaining -= take
        if remaining == 0:
            break
    if remaining or threshold is None:
        raise ValueError("trimmed-mean fill failed")
    value = sum((allocation[i] * values[i] for i in range(len(values))), Fraction(0))
    return value, allocation, threshold


def _stop_loss(weights: list[Fraction], values: list[Fraction], g: Fraction) -> Fraction:
    return sum((weight * max(g - value, Fraction(0))
                for weight, value in zip(weights, values)), Fraction(0))


def _weighted_frame(atoms: list[list[Fraction]], coefficients: list[Fraction]) -> Matrix:
    if len(atoms) != len(coefficients) or not atoms:
        raise ValueError("frame data mismatch")
    dimension = len(atoms[0])
    result = _zeros(dimension, dimension)
    for atom, coefficient in zip(atoms, coefficients):
        if len(atom) != dimension:
            raise ValueError("frame dimension mismatch")
        result = _add(result, _scale(coefficient, _outer(atom)))
    return result


def _exterior_trimmed_model() -> dict[str, Any]:
    W = [
        [Fraction(1), Fraction(0), Fraction(1)],
        [Fraction(0), Fraction(2), Fraction(0)],
        [Fraction(0), Fraction(0), Fraction(0)],
        [Fraction(0), Fraction(0), Fraction(0)],
    ]
    rank = _rank(W)
    E = _exterior_volume(W, rank)
    P_H = _sub(_identity(4), _column_projector(W))
    atoms = [
        [Fraction(0), Fraction(0), Fraction(1), Fraction(0)],
        [Fraction(0), Fraction(0), Fraction(1), Fraction(0)],
        [Fraction(0), Fraction(0), Fraction(0), Fraction(1)],
        [Fraction(0), Fraction(0), Fraction(0), Fraction(1)],
    ]
    quadrature = [Fraction(1, 2)] * 4
    kappas = [_quadratic(atom, P_H) for atom in atoms]
    exterior = [_exterior_volume(_hstack(W, [[x] for x in atom]), rank + 1)
                for atom in atoms]
    masses = [weight * kappa for weight, kappa in zip(quadrature, kappas)]
    frame = _weighted_frame(atoms, quadrature)

    b = [Fraction(0), Fraction(2), Fraction(5), Fraction(6)]
    prime = [Fraction(1, 4), Fraction(1, 4), Fraction(0), Fraction(0)]
    w = [b_i - 2 * s_i for b_i, s_i in zip(b, prime)]
    ell_b, allocation_b, threshold_b = _trimmed_mean(masses, b)
    ell_w, allocation_w, threshold_w = _trimmed_mean(masses, w)
    M = sum((mass * s * s for mass, s in zip(masses, prime)), Fraction(0))
    sqrt_M = _perfect_square_root(M)
    g = threshold_w
    V = _stop_loss(masses, w, g)
    T_w = _weighted_frame(atoms, [q * value for q, value in zip(quadrature, w)])
    direct_remainder = _sub(T_w, _scale(ell_w, P_H))

    p_strict = [Fraction(0), Fraction(0), Fraction(0), Fraction(1, 4)]
    p_equal = [Fraction(0), Fraction(0), Fraction(0), Fraction(1, 2)]
    pole_models = []
    for label, pole in (("strict", p_strict), ("equality", p_equal)):
        kappa = _quadratic(pole, P_H)
        ext = _exterior_volume(_hstack(W, [[x] for x in pole]), rank + 1)
        surcharge = 2 * kappa
        pole_models.append({
            "label": label,
            "pole": pole,
            "kappa_H": kappa,
            "appended_exterior_volume": ext,
            "surcharge": surcharge,
            "reserve": ell_w - surcharge,
            "strict_pass": ell_w > surcharge,
        })

    if rank != 2 or E != 8 or frame != P_H:
        raise ValueError("exterior frame regression failed")
    if any(left != E * right for left, right in zip(exterior, kappas)):
        raise ValueError("exterior leverage identity failed")
    if sum(masses, Fraction(0)) != 2 or ell_b != 1 or ell_w != Fraction(1, 2):
        raise ValueError("trimmed-mean regression failed")
    if abs(ell_w - ell_b) != 2 * sqrt_M:
        raise ValueError("archimedean-prime perturbation regression failed")
    if g - V != ell_w or not _is_psd(direct_remainder):
        raise ValueError("stop-loss/direct-floor regression failed")
    if not pole_models[0]["strict_pass"] or pole_models[1]["strict_pass"]:
        raise ValueError("strict odd-pole boundary regression failed")

    return {
        "W": W,
        "rank": rank,
        "E_rank": E,
        "P_H": P_H,
        "atoms": atoms,
        "quadrature_weights": quadrature,
        "kappa_H_atoms": kappas,
        "appended_exterior_volumes": exterior,
        "atom_masses": masses,
        "total_mass": sum(masses, Fraction(0)),
        "frame_operator": frame,
        "b_values": b,
        "prime_values": prime,
        "w_values": w,
        "prime_second_moment": M,
        "sqrt_prime_second_moment": sqrt_M,
        "ell_b": ell_b,
        "ell_w": ell_w,
        "ell_b_allocation": allocation_b,
        "ell_w_allocation": allocation_w,
        "ell_b_threshold": threshold_b,
        "ell_w_threshold": threshold_w,
        "stop_loss_g": g,
        "stop_loss_V": V,
        "stop_loss_floor": g - V,
        "T_w": T_w,
        "direct_floor_remainder": direct_remainder,
        "pole_models": pole_models,
    }


def _positive_short_model() -> dict[str, Any]:
    X_K = [
        [Fraction(1), Fraction(0)],
        [Fraction(0), Fraction(1)],
        [Fraction(1), Fraction(1)],
    ]
    X_H = [
        [Fraction(2), Fraction(0)],
        [Fraction(0), Fraction(0)],
        [Fraction(0), Fraction(0)],
    ]
    X = _hstack(X_K, X_H)
    C = _gram(X)
    C_KK = _block(C, 0, 2, 0, 2)
    C_KH = _block(C, 0, 2, 2, 4)
    C_HK = _block(C, 2, 4, 0, 2)
    C_HH = _block(C, 2, 4, 2, 4)
    C_HH_dagger = _pseudoinverse_psd(C_HH)
    short_blocks = _sub(C_KK, _matmul(_matmul(C_KH, C_HH_dagger), C_HK))
    feature_residual = _sub(_identity(3), _column_projector(X_H))
    short_features = _matmul(_matmul(_transpose(X_K), feature_residual), X_K)
    domination_remainder = _sub(C, _embed_top_left(short_blocks, 4))
    if _rank(C_HH) != 1 or short_blocks != [[Fraction(1), Fraction(1)], [Fraction(1), Fraction(2)]]:
        raise ValueError("singular positive-short model mismatch")
    if short_blocks != short_features or not _is_psd(domination_remainder):
        raise ValueError("feature positive-short identity failed")
    return {
        "X_K": X_K,
        "X_H": X_H,
        "C": C,
        "C_HH": C_HH,
        "rank_C_HH": _rank(C_HH),
        "C_HH_pseudoinverse": C_HH_dagger,
        "short_from_blocks": short_blocks,
        "feature_residual_projector": feature_residual,
        "short_from_features": short_features,
        "domination_remainder": domination_remainder,
    }


def _negative_round_trip_model(short: Matrix) -> dict[str, Any]:
    g = Fraction(2)
    Y_K = _identity(2)
    Y_H = [[Fraction(1), Fraction(0)], [Fraction(0), Fraction(1, 2)]]
    Y = _hstack(Y_K, Y_H)
    R = _gram(Y)
    R_KK = _block(R, 0, 2, 0, 2)
    R_KH = _block(R, 0, 2, 2, 4)
    R_HK = _block(R, 2, 4, 0, 2)
    R_HH = _block(R, 2, 4, 2, 4)
    Q = _matmul(Y_H, _transpose(Y_H))
    rho = max(Q[i][i] for i in range(2))
    V = _trace(R_HH)
    physical_load = _add(
        R_KK,
        _matmul(_matmul(R_KH, _inverse(_sub(_scale(g, _identity(2)), R_HH))), R_HK),
    )
    feature_load = _matmul(
        _matmul(_transpose(Y_K), _inverse(_sub(_identity(2), _scale(Fraction(1, 1) / g, Q)))),
        Y_K,
    )
    first_round_trip = _scale(Fraction(1, 1) / g, _matmul(_matmul(_transpose(Y_K), Q), Y_K))
    partial_m2 = _add(R_KK, first_round_trip)
    exact_tail = _sub(feature_load, partial_m2)
    Q2 = _matmul(Q, Q)
    moment_tail_bound = _scale(
        (Fraction(1, 1) / (g * g)) / (1 - rho / g),
        _matmul(_matmul(_transpose(Y_K), Q2), Y_K),
    )
    coarse_tail_bound = _scale((rho / g) ** 2 / (1 - rho / g), R_KK)
    exact_floor = _sub(_add(_scale(g, _identity(2)), short), feature_load)
    certificate_load = _add(partial_m2, moment_tail_bound)
    certificate_floor = _sub(_add(_scale(g, _identity(2)), short), certificate_load)
    trace_majorant = _scale(g / (g - V), R_KK)
    norm_majorant = _scale(g / (g - rho), R_KK)
    if rho >= g or physical_load != feature_load:
        raise ValueError("negative feature round-trip identity failed")
    if feature_load != _diag(Fraction(2), Fraction(8, 7)):
        raise ValueError("negative load oracle mismatch")
    if not _is_psd(_sub(moment_tail_bound, exact_tail)) or not _is_psd(_sub(coarse_tail_bound, exact_tail)):
        raise ValueError("Neumann tail bound failed")
    if not _is_psd(_sub(trace_majorant, feature_load)) or not _is_psd(_sub(norm_majorant, feature_load)):
        raise ValueError("negative-load scalar majorant failed")
    if not _is_pd(exact_floor) or not _is_pd(certificate_floor):
        raise ValueError("combined feature-Schur floor failed")
    return {
        "g": g,
        "Y_K": Y_K,
        "Y_H": Y_H,
        "R": R,
        "R_HH": R_HH,
        "Q": Q,
        "rho": rho,
        "V_H": V,
        "physical_round_trip_load": physical_load,
        "feature_round_trip_load": feature_load,
        "partial_sum_m2": partial_m2,
        "exact_tail_m2": exact_tail,
        "moment_tail_bound_m2": moment_tail_bound,
        "coarse_tail_bound_m2": coarse_tail_bound,
        "trace_majorant": trace_majorant,
        "norm_majorant": norm_majorant,
        "exact_combined_floor": exact_floor,
        "moment_certificate_floor": certificate_floor,
        "exact_floor_determinant": _determinant(exact_floor),
        "certificate_floor_determinant": _determinant(certificate_floor),
    }


def _trace_norm_model() -> dict[str, Any]:
    g = Fraction(1)
    Y_H = _diag(Fraction(3, 4), Fraction(3, 4))
    R_HH = _gram(Y_H)
    rho = max(R_HH[i][i] for i in range(2))
    V = _trace(R_HH)
    high = _sub(_scale(g, _identity(2)), R_HH)
    if not (rho < g < V) or not _is_pd(high):
        raise ValueError("trace-versus-norm countermodel failed")
    return {
        "g": g,
        "Y_H": Y_H,
        "R_HH": R_HH,
        "rho": rho,
        "V_H": V,
        "high_block": high,
        "spectral_inverse_exists": True,
        "trace_test_passes": False,
    }


def _orientation_model() -> dict[str, Any]:
    g = Fraction(1)
    Y_H = [[Fraction(1, 2)], [Fraction(0)]]
    Q = _matmul(Y_H, _transpose(Y_H))
    inverse = _inverse(_sub(_identity(2), Q))
    aligned = [[Fraction(1)], [Fraction(0)]]
    orthogonal = [[Fraction(0)], [Fraction(1)]]
    aligned_load = _matmul(_matmul(_transpose(aligned), inverse), aligned)[0][0]
    orthogonal_load = _matmul(_matmul(_transpose(orthogonal), inverse), orthogonal)[0][0]
    R_HH = _matmul(_transpose(Y_H), Y_H)
    rho = _trace(R_HH)
    V = _trace(R_HH)
    aligned_R_KK = _trace(_matmul(_transpose(aligned), aligned))
    orthogonal_R_KK = _trace(_matmul(_transpose(orthogonal), orthogonal))
    same_diagonal_data = rho == V and aligned_R_KK == orthogonal_R_KK
    determines_orientation = not (same_diagonal_data and aligned_load != orthogonal_load)
    if (
        aligned_load != Fraction(4, 3)
        or orthogonal_load != 1
        or rho != Fraction(1, 4)
        or not same_diagonal_data
        or determines_orientation
    ):
        raise ValueError("orientation countermodel failed")
    return {
        "g": g,
        "Y_H": Y_H,
        "Q": Q,
        "shared_rho": rho,
        "shared_V_H": V,
        "shared_R_KK": aligned_R_KK,
        "aligned_Y_K": aligned,
        "orthogonal_Y_K": orthogonal,
        "aligned_effective_load": aligned_load,
        "orthogonal_effective_load": orthogonal_load,
        "diagonal_data_determine_orientation": determines_orientation,
    }


def _over_shorting_model() -> dict[str, Any]:
    g = Fraction(2)
    C = [[Fraction(9), Fraction(9)], [Fraction(9), Fraction(9)]]
    R = [[Fraction(3), Fraction(0)], [Fraction(0), Fraction(0)]]
    B = _sub(_add(_scale(g, _identity(2)), C), R)
    C_short = C[0][0] - C[0][1] * C[1][1] ** -1 * C[1][0]
    short_low = g - R[0][0] + C_short
    if not _is_pd(B) or _determinant(B) != 7 or C_short != 0 or short_low != -1:
        raise ValueError("over-shorting countermodel failed")
    return {
        "g": g,
        "C": C,
        "R": R,
        "B": B,
        "determinant_B": _determinant(B),
        "C_short": C_short,
        "fully_shorted_low": short_low,
        "B_positive_definite": True,
        "fully_shorted_test_passes": False,
        "interpretation": "the shorted criterion is sufficient, not necessary",
    }


def _coframe_tail_model() -> dict[str, Any]:
    Z = [
        [Fraction(1), Fraction(0), Fraction(0)],
        [Fraction(0), Fraction(3, 5), Fraction(4, 5)],
    ]
    P_F = _diag(Fraction(1), Fraction(1), Fraction(0))
    P_bad = _diag(Fraction(1), Fraction(0), Fraction(0))
    I_source = _identity(3)
    L = _matmul(_matmul(Z, _sub(I_source, P_F)), _transpose(Z))
    L_bad = _matmul(_matmul(Z, _sub(I_source, P_bad)), _transpose(Z))
    frame = _matmul(_matmul(Z, P_F), _transpose(Z))
    frame_bad = _matmul(_matmul(Z, P_bad), _transpose(Z))
    if _matmul(Z, _transpose(Z)) != _identity(2):
        raise ValueError("coframe coisometry failed")
    if frame != _sub(_identity(2), L) or _determinant(frame) != Fraction(9, 25):
        raise ValueError("coframe tail identity failed")
    if _trace(L) >= 1 or _determinant(frame_bad) != 0 or _trace(L_bad) != 1:
        raise ValueError("coframe strict boundary failed")
    return {
        "Z": Z,
        "P_F": P_F,
        "L_F": L,
        "trace_L_F": _trace(L),
        "frame": frame,
        "frame_determinant": _determinant(frame),
        "strict_trace_certificate_passes": True,
        "boundary_P_F": P_bad,
        "boundary_L_F": L_bad,
        "boundary_trace_L_F": _trace(L_bad),
        "boundary_frame": frame_bad,
        "boundary_frame_determinant": _determinant(frame_bad),
        "boundary_passes": False,
    }


def _mobius(n: int) -> int:
    value = n
    factors = 0
    prime = 2
    while prime * prime <= value:
        if value % prime == 0:
            value //= prime
            factors += 1
            if value % prime == 0:
                return 0
            while value % prime == 0:
                value //= prime
        prime += 1
    if value > 1:
        factors += 1
    return -1 if factors % 2 else 1


def _mobius_convolution_model() -> dict[str, Any]:
    size = 6
    target = [Fraction(2), Fraction(-1), Fraction(3), Fraction(4), Fraction(-2), Fraction(5)]
    source: list[Fraction] = []
    for m in range(1, size + 1):
        source.append(sum((_mobius(n) * target[n * m - 1]
                           for n in range(1, size // m + 1)), Fraction(0)))
    reconstructed = sum(source, Fraction(0))
    divisor_coefficients = [sum((_mobius(n) for n in range(1, k + 1) if k % n == 0), 0)
                            for k in range(1, size + 1)]
    if divisor_coefficients != [1, 0, 0, 0, 0, 0] or reconstructed != target[0]:
        raise ValueError("Mobius right-inverse convolution failed")

    hole_weights = [Fraction(1), Fraction(1), Fraction(1, 2)]
    visible_source = [Fraction(2), Fraction(-1), Fraction(0)]
    hole_correction = [Fraction(0), Fraction(0), Fraction(-2)]
    corrected_source = [a + b for a, b in zip(visible_source, hole_correction)]
    physical_sampling = [
        [Fraction(1), Fraction(0), Fraction(0)],
        [Fraction(1), Fraction(1), Fraction(0)],
    ]
    visible_image = [row[0] for row in _matmul(physical_sampling, [[x] for x in visible_source])]
    corrected_image = [row[0] for row in _matmul(physical_sampling, [[x] for x in corrected_source])]
    corrected_integral = sum((w * x for w, x in zip(hole_weights, corrected_source)), Fraction(0))
    correction_changes_image = visible_image != corrected_image
    if (
        sum((w * x for w, x in zip(hole_weights, visible_source)), Fraction(0)) != 1
        or sum((w * x for w, x in zip(hole_weights, hole_correction)), Fraction(0)) != -1
        or corrected_integral != 0
        or correction_changes_image
    ):
        raise ValueError("central-hole kernel correction model failed")
    return {
        "finite_cutoff": size,
        "scaled_target_values": target,
        "mobius_values": [_mobius(n) for n in range(1, size + 1)],
        "right_inverse_source_values": source,
        "divisor_convolution_coefficients": divisor_coefficients,
        "reconstructed_first_target": reconstructed,
        "central_hole_quadrature_weights": hole_weights,
        "visible_source_model": visible_source,
        "central_hole_correction_model": hole_correction,
        "corrected_zero_integral_source_model": corrected_source,
        "physical_sampling_model": physical_sampling,
        "physical_image_before_correction": visible_image,
        "physical_image_after_correction": corrected_image,
        "central_hole_correction_changes_physical_image": correction_changes_image,
        "scope": "finite divisor-convolution and kernel-correction oracles for the continuous right inverse proof",
    }


def _exact_regressions() -> dict[str, Any]:
    exterior = _exterior_trimmed_model()
    positive = _positive_short_model()
    short = positive["short_from_blocks"]
    return _encode({
        "exterior_trimmed_stop_loss": exterior,
        "singular_positive_feature_short": positive,
        "negative_round_trip_and_tail": _negative_round_trip_model(short),
        "trace_is_not_spectral_necessity": _trace_norm_model(),
        "oriented_load_countermodel": _orientation_model(),
        "over_shorting_countermodel": _over_shorting_model(),
        "normalized_coframe_tail": _coframe_tail_model(),
        "mobius_divisor_convolution": _mobius_convolution_model(),
    })


def validate_source_admissions(admissions: dict[str, bool]) -> None:
    if admissions != SOURCE_ADMISSIONS:
        raise ValueError("source admissions must match the locked claim boundary")


def produce(lambda_numerator: int, dps: int = 80) -> dict[str, Any]:
    p = _integer(lambda_numerator, "lambda_numerator", 5)
    precision = _integer(dps, "dps", 50)
    if p % 2 == 0:
        raise ValueError("lambda_numerator must be odd")
    validate_source_admissions(dict(SOURCE_ADMISSIONS))
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
            "exact_schedule_metadata": {
                "lambda": _rational(Fraction(p, 2)),
                "N_rule": "ceil(lambda^2)",
                "N": (p * p + 3) // 4,
                "model_scope": "exact theorem regressions only; not a physical Weil pilot",
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
    encoded = json.dumps(produce(args.lambda_numerator, args.dps), indent=2, sort_keys=True) + "\n"
    if args.output:
        Path(args.output).write_text(encoded, encoding="utf-8")
    else:
        print(encoded, end="")


if __name__ == "__main__":
    main()
