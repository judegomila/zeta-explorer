#!/usr/bin/env python3
"""Clean-room replay of the trimmed-mean/feature-Schur checkpoint.

The replay imports no producer or project arithmetic helper.  It rebuilds
the fixed models from integer data, binds the result to the raw producer
artifact bytes, and never trusts producer pass booleans.  Both paths use
Python ``Fraction`` arithmetic; that shared library is disclosed.
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
REPLAY_SCHEMA = "xi-prolate-leverage-trimmed-mean-feature-schur-replay-v1"
STATUS = "LEVERAGE_TRIMMED_MEAN_FEATURE_SCHUR_COMPONENT"
RESULT = "LEVERAGE_TRIMMED_MEAN_FEATURE_SCHUR_COMPONENT_PASS"
REPLAY_RESULT = "LEVERAGE_TRIMMED_MEAN_FEATURE_SCHUR_COMPONENT_REPLAY_PASS"
TERMINAL_STATE = "P0_INVALIDATED"
NOTE = "notes/LEVERAGE_TRIMMED_MEAN_FEATURE_SCHUR.md"
LOCK = "LEVERAGE_TRIMMED_MEAN_FEATURE_SCHUR_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-leverage-trimmed-mean-feature-schur-source-lock-v1"

PINNED_HASHES = {
    NOTE: "c9f10ffb6b6ceeafe8ea63566d10c3af7eb6265c509c8d63e259bc407cc7f79a",
    LOCK: "e387fc1c539283dead8110eeac6d5c6798839a8bcfc0a17c65af87587cd3458c",
}
_SHA256 = re.compile(r"^[0-9a-f]{64}$")
_INTEGER_TEXT = re.compile(r"^(?:0|-[1-9][0-9]*|[1-9][0-9]*)$")
_POSITIVE_TEXT = re.compile(r"^[1-9][0-9]*$")

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


class ReplayError(ValueError):
    """Raised when exact replay or claim validation fails."""


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
    if isinstance(value, tuple):
        return [_encode(item) for item in value]
    if isinstance(value, dict):
        return {key: _encode(item) for key, item in value.items()}
    return value


def _parse_rational(value: Any, label: str) -> Fraction:
    if not isinstance(value, dict) or set(value) != {"numerator", "denominator"}:
        raise ReplayError(f"{label} must be a canonical rational object")
    numerator, denominator = value["numerator"], value["denominator"]
    if not isinstance(numerator, str) or _INTEGER_TEXT.fullmatch(numerator) is None:
        raise ReplayError(f"{label}.numerator is not canonical")
    if not isinstance(denominator, str) or _POSITIVE_TEXT.fullmatch(denominator) is None:
        raise ReplayError(f"{label}.denominator is not canonical")
    result = Fraction(int(numerator), int(denominator))
    if str(result.numerator) != numerator or str(result.denominator) != denominator:
        raise ReplayError(f"{label} is not reduced")
    return result


def _dims(matrix: Matrix) -> tuple[int, int]:
    height = len(matrix)
    width = len(matrix[0]) if height else 0
    if any(len(row) != width for row in matrix):
        raise ReplayError("ragged matrix")
    return height, width


def _zero(height: int, width: int) -> Matrix:
    return [[Fraction(0) for _ in range(width)] for _ in range(height)]


def _T(matrix: Matrix) -> Matrix:
    height, width = _dims(matrix)
    if height == 0:
        return [[] for _ in range(width)]
    return [list(row) for row in zip(*matrix)]


def _product(left: Matrix, right: Matrix) -> Matrix:
    lh, lw = _dims(left)
    rh, rw = _dims(right)
    if lw != rh:
        raise ReplayError("product dimension mismatch")
    answer = _zero(lh, rw)
    for i in range(lh):
        for k in range(lw):
            for j in range(rw):
                answer[i][j] += left[i][k] * right[k][j]
    return answer


def _plus(left: Matrix, right: Matrix) -> Matrix:
    if _dims(left) != _dims(right):
        raise ReplayError("sum dimension mismatch")
    return [[left[i][j] + right[i][j] for j in range(len(left[i]))]
            for i in range(len(left))]


def _minus(left: Matrix, right: Matrix) -> Matrix:
    if _dims(left) != _dims(right):
        raise ReplayError("difference dimension mismatch")
    return [[left[i][j] - right[i][j] for j in range(len(left[i]))]
            for i in range(len(left))]


def _times(value: Fraction, matrix: Matrix) -> Matrix:
    return [[value * entry for entry in row] for row in matrix]


def _eye(size: int) -> Matrix:
    return [[Fraction(i == j) for j in range(size)] for i in range(size)]


def _diagonal(values: list[Fraction]) -> Matrix:
    return [[values[i] if i == j else Fraction(0) for j in range(len(values))]
            for i in range(len(values))]


def _dyad(left: list[Fraction], right: list[Fraction] | None = None) -> Matrix:
    other = left if right is None else right
    return [[x * y for y in other] for x in left]


def _join(left: Matrix, right: Matrix) -> Matrix:
    if len(left) != len(right):
        raise ReplayError("join row mismatch")
    return [a + b for a, b in zip(left, right)]


def _det(matrix: Matrix) -> Fraction:
    size, width = _dims(matrix)
    if size != width:
        raise ReplayError("determinant requires square matrix")
    if size == 0:
        return Fraction(1)
    total = Fraction(0)
    for permutation in itertools.permutations(range(size)):
        inversions = sum(permutation[i] > permutation[j]
                         for i in range(size) for j in range(i + 1, size))
        term = Fraction(-1 if inversions % 2 else 1)
        for i, j in enumerate(permutation):
            term *= matrix[i][j]
        total += term
    return total


def _inv(matrix: Matrix) -> Matrix:
    size, width = _dims(matrix)
    if size != width:
        raise ReplayError("inverse requires square matrix")
    determinant = _det(matrix)
    if determinant == 0:
        raise ReplayError("singular inverse")
    if size == 1:
        return [[1 / matrix[0][0]]]
    answer = _zero(size, size)
    for i in range(size):
        for j in range(size):
            minor = [[matrix[r][c] for c in range(size) if c != i]
                     for r in range(size) if r != j]
            answer[i][j] = Fraction(-1 if (i + j) % 2 else 1) * _det(minor) / determinant
    return answer


def _trace(matrix: Matrix) -> Fraction:
    size, width = _dims(matrix)
    if size != width:
        raise ReplayError("trace requires square matrix")
    return sum((matrix[i][i] for i in range(size)), Fraction(0))


def _rref(matrix: Matrix) -> tuple[Matrix, list[int]]:
    height, width = _dims(matrix)
    work = [row[:] for row in matrix]
    pivots: list[int] = []
    row = 0
    for column in range(width):
        pivot = next((r for r in range(row, height) if work[r][column]), None)
        if pivot is None:
            continue
        work[row], work[pivot] = work[pivot], work[row]
        scale = work[row][column]
        work[row] = [entry / scale for entry in work[row]]
        for r in range(height):
            if r == row:
                continue
            factor = work[r][column]
            work[r] = [x - factor * y for x, y in zip(work[r], work[row])]
        pivots.append(column)
        row += 1
        if row == height:
            break
    return work, pivots


def _rank(matrix: Matrix) -> int:
    return len(_rref(matrix)[1])


def _nullspace(matrix: Matrix) -> Matrix:
    reduced, pivots = _rref(matrix)
    _, width = _dims(matrix)
    free = [column for column in range(width) if column not in pivots]
    columns: list[list[Fraction]] = []
    for free_column in free:
        vector = [Fraction(0) for _ in range(width)]
        vector[free_column] = 1
        for row, pivot in enumerate(pivots):
            vector[pivot] = -reduced[row][free_column]
        columns.append(vector)
    if not columns:
        return _zero(width, 0)
    return [list(row) for row in zip(*columns)]


def _null_projector(matrix: Matrix) -> Matrix:
    basis = _nullspace(_T(matrix))
    _, count = _dims(basis)
    dimension, _ = _dims(matrix)
    if count == 0:
        return _zero(dimension, dimension)
    metric = _product(_T(basis), basis)
    return _product(_product(basis, _inv(metric)), _T(basis))


def _pinv_psd_via_null(matrix: Matrix) -> Matrix:
    """Derive a symmetric PSD pseudoinverse from its null projector."""
    height, width = _dims(matrix)
    if height != width or matrix != _T(matrix) or not _psd(matrix):
        raise ReplayError("PSD pseudoinverse requires a symmetric PSD matrix")
    null = _null_projector(matrix)
    dagger = _minus(_inv(_plus(matrix, null)), null)
    left = _product(matrix, dagger)
    right = _product(dagger, matrix)
    if (
        _product(left, matrix) != matrix
        or _product(right, dagger) != dagger
        or left != _T(left)
        or right != _T(right)
    ):
        raise ReplayError("derived pseudoinverse failed a Penrose identity")
    return dagger


def _minor(matrix: Matrix, rows: tuple[int, ...], columns: tuple[int, ...]) -> Matrix:
    return [[matrix[i][j] for j in columns] for i in rows]


def _exterior_by_double_minors(matrix: Matrix, order: int) -> Fraction:
    height, width = _dims(matrix)
    if order == 0:
        return Fraction(1)
    if order > min(height, width):
        return Fraction(0)
    return sum((_det(_minor(matrix, rows, columns)) ** 2
                for rows in itertools.combinations(range(height), order)
                for columns in itertools.combinations(range(width), order)), Fraction(0))


def _qform(vector: list[Fraction], matrix: Matrix) -> Fraction:
    return _product(_product([vector], matrix), [[x] for x in vector])[0][0]


def _block(matrix: Matrix, first_rows: tuple[int, int], first_cols: tuple[int, int]) -> Matrix:
    r0, r1 = first_rows
    c0, c1 = first_cols
    return [row[c0:c1] for row in matrix[r0:r1]]


def _embed(matrix: Matrix, size: int) -> Matrix:
    height, width = _dims(matrix)
    if height != width or height > size:
        raise ReplayError("bad block embedding")
    answer = _zero(size, size)
    for i in range(height):
        for j in range(width):
            answer[i][j] = matrix[i][j]
    return answer


def _principal(matrix: Matrix, indices: tuple[int, ...]) -> Matrix:
    return [[matrix[i][j] for j in indices] for i in indices]


def _psd(matrix: Matrix) -> bool:
    size, width = _dims(matrix)
    if size != width or matrix != _T(matrix):
        return False
    return all(_det(_principal(matrix, indices)) >= 0
               for order in range(1, size + 1)
               for indices in itertools.combinations(range(size), order))


def _pd(matrix: Matrix) -> bool:
    size, width = _dims(matrix)
    if size != width or matrix != _T(matrix):
        return False
    return all(_det(_principal(matrix, tuple(range(order)))) > 0
               for order in range(1, size + 1))


def _sqrt_rational(value: Fraction) -> Fraction:
    if value < 0:
        raise ReplayError("negative square root")
    top, bottom = isqrt(value.numerator), isqrt(value.denominator)
    if top * top != value.numerator or bottom * bottom != value.denominator:
        raise ReplayError("non-rational square root")
    return Fraction(top, bottom)


def _dual_trim(weights: list[Fraction], values: list[Fraction]) -> tuple[Fraction, list[Fraction], Fraction]:
    if len(weights) != len(values) or sum(weights, Fraction(0)) < 1:
        raise ReplayError("invalid lower-tail measure")
    candidates = sorted(set(values))
    scores = [(g - sum((weight * max(g - value, Fraction(0))
                        for weight, value in zip(weights, values)), Fraction(0)), g)
              for g in candidates]
    optimum, threshold = max(scores, key=lambda pair: (pair[0], -pair[1]))
    allocation = [weight if value < threshold else Fraction(0)
                  for weight, value in zip(weights, values)]
    remaining = 1 - sum(allocation, Fraction(0))
    for index in sorted((i for i, value in enumerate(values) if value == threshold)):
        take = min(weights[index], remaining)
        allocation[index] = take
        remaining -= take
    if remaining:
        raise ReplayError("dual threshold did not fill one unit")
    primal = sum((allocation[i] * values[i] for i in range(len(values))), Fraction(0))
    if primal != optimum:
        raise ReplayError("stop-loss duality failed")
    return optimum, allocation, threshold


def _frame(atoms: list[list[Fraction]], coefficients: list[Fraction]) -> Matrix:
    dimension = len(atoms[0])
    answer = _zero(dimension, dimension)
    for atom, coefficient in zip(atoms, coefficients):
        answer = _plus(answer, _times(coefficient, _dyad(atom)))
    return answer


def _exterior_trimmed_model() -> dict[str, Any]:
    W = [
        [Fraction(1), Fraction(0), Fraction(1)],
        [Fraction(0), Fraction(2), Fraction(0)],
        [Fraction(0), Fraction(0), Fraction(0)],
        [Fraction(0), Fraction(0), Fraction(0)],
    ]
    rank = _rank(W)
    exterior = _exterior_by_double_minors(W, rank)
    P_H = _null_projector(W)
    atoms = [
        [Fraction(0), Fraction(0), Fraction(1), Fraction(0)],
        [Fraction(0), Fraction(0), Fraction(1), Fraction(0)],
        [Fraction(0), Fraction(0), Fraction(0), Fraction(1)],
        [Fraction(0), Fraction(0), Fraction(0), Fraction(1)],
    ]
    quadrature = [Fraction(1, 2)] * 4
    kappas = [_qform(atom, P_H) for atom in atoms]
    appended = [_exterior_by_double_minors(_join(W, [[x] for x in atom]), rank + 1)
                for atom in atoms]
    masses = [q * k for q, k in zip(quadrature, kappas)]
    frame = _frame(atoms, quadrature)
    b = [Fraction(0), Fraction(2), Fraction(5), Fraction(6)]
    prime = [Fraction(1, 4), Fraction(1, 4), Fraction(0), Fraction(0)]
    w = [x - 2 * y for x, y in zip(b, prime)]
    ell_b, alloc_b, q_b = _dual_trim(masses, b)
    ell_w, alloc_w, q_w = _dual_trim(masses, w)
    moment = sum((mass * value * value for mass, value in zip(masses, prime)), Fraction(0))
    root_moment = _sqrt_rational(moment)
    stop_loss = sum((mass * max(q_w - value, Fraction(0))
                     for mass, value in zip(masses, w)), Fraction(0))
    T_w = _frame(atoms, [weight * value for weight, value in zip(quadrature, w)])
    remainder = _minus(T_w, _times(ell_w, P_H))
    poles: list[dict[str, Any]] = []
    for label, coordinate in (("strict", Fraction(1, 4)), ("equality", Fraction(1, 2))):
        pole = [Fraction(0), Fraction(0), Fraction(0), coordinate]
        kappa = _qform(pole, P_H)
        ext = _exterior_by_double_minors(_join(W, [[x] for x in pole]), rank + 1)
        surcharge = 2 * kappa
        poles.append({
            "label": label,
            "pole": pole,
            "kappa_H": kappa,
            "appended_exterior_volume": ext,
            "surcharge": surcharge,
            "reserve": ell_w - surcharge,
            "strict_pass": ell_w > surcharge,
        })
    if exterior != 8 or frame != P_H or not _psd(remainder):
        raise ReplayError("independent exterior/direct-floor reconstruction failed")
    if any(appended[i] != exterior * kappas[i] for i in range(4)):
        raise ReplayError("independent exterior identity failed")
    if ell_b != 1 or ell_w != Fraction(1, 2) or abs(ell_w - ell_b) != 2 * root_moment:
        raise ReplayError("independent trimmed perturbation failed")
    if q_w - stop_loss != ell_w or not poles[0]["strict_pass"] or poles[1]["strict_pass"]:
        raise ReplayError("independent strict stop-loss boundary failed")
    return {
        "W": W,
        "rank": rank,
        "E_rank": exterior,
        "P_H": P_H,
        "atoms": atoms,
        "quadrature_weights": quadrature,
        "kappa_H_atoms": kappas,
        "appended_exterior_volumes": appended,
        "atom_masses": masses,
        "total_mass": sum(masses, Fraction(0)),
        "frame_operator": frame,
        "b_values": b,
        "prime_values": prime,
        "w_values": w,
        "prime_second_moment": moment,
        "sqrt_prime_second_moment": root_moment,
        "ell_b": ell_b,
        "ell_w": ell_w,
        "ell_b_allocation": alloc_b,
        "ell_w_allocation": alloc_w,
        "ell_b_threshold": q_b,
        "ell_w_threshold": q_w,
        "stop_loss_g": q_w,
        "stop_loss_V": stop_loss,
        "stop_loss_floor": q_w - stop_loss,
        "T_w": T_w,
        "direct_floor_remainder": remainder,
        "pole_models": poles,
    }


def _positive_short_model() -> dict[str, Any]:
    X_K = [[Fraction(1), Fraction(0)], [Fraction(0), Fraction(1)], [Fraction(1), Fraction(1)]]
    X_H = [[Fraction(2), Fraction(0)], [Fraction(0), Fraction(0)], [Fraction(0), Fraction(0)]]
    X = _join(X_K, X_H)
    C = _product(_T(X), X)
    C_KK = _block(C, (0, 2), (0, 2))
    C_KH = _block(C, (0, 2), (2, 4))
    C_HK = _block(C, (2, 4), (0, 2))
    C_HH = _block(C, (2, 4), (2, 4))
    C_HH_dagger = _pinv_psd_via_null(C_HH)
    block_short = _minus(C_KK, _product(_product(C_KH, C_HH_dagger), C_HK))
    residual = _null_projector(X_H)
    feature_short = _product(_product(_T(X_K), residual), X_K)
    domination = _minus(C, _embed(feature_short, 4))
    if (
        block_short != feature_short
        or not _psd(domination)
        or _rank(C_HH) != 1
        or _product(residual, X_H) != _zero(3, 2)
        or _product(residual, residual) != residual
        or residual != _T(residual)
    ):
        raise ReplayError("independent singular feature short failed")
    return {
        "X_K": X_K,
        "X_H": X_H,
        "C": C,
        "C_HH": C_HH,
        "rank_C_HH": _rank(C_HH),
        "C_HH_pseudoinverse": C_HH_dagger,
        "short_from_blocks": block_short,
        "feature_residual_projector": residual,
        "short_from_features": feature_short,
        "domination_remainder": domination,
    }


def _negative_model(short: Matrix) -> dict[str, Any]:
    g = Fraction(2)
    Y_K = _eye(2)
    Y_H = _diagonal([Fraction(1), Fraction(1, 2)])
    Y = _join(Y_K, Y_H)
    R = _product(_T(Y), Y)
    R_KK = _block(R, (0, 2), (0, 2))
    R_KH = _block(R, (0, 2), (2, 4))
    R_HK = _block(R, (2, 4), (0, 2))
    R_HH = _block(R, (2, 4), (2, 4))
    Q = _product(Y_H, _T(Y_H))
    rho, V = max(Q[0][0], Q[1][1]), _trace(R_HH)
    if rho >= g or V >= g:
        raise ReplayError("independent scalar feature-load premise is not strict")
    feature_inverse = _inv(_minus(_eye(2), _times(1 / g, Q)))
    feature_load = _product(_product(_T(Y_K), feature_inverse), Y_K)
    physical_load = _plus(
        R_KK,
        _product(_product(R_KH, _inv(_minus(_times(g, _eye(2)), R_HH))), R_HK),
    )
    partial = _plus(R_KK, _times(1 / g, _product(_product(_T(Y_K), Q), Y_K)))
    tail = _minus(feature_load, partial)
    Q_squared = _product(Q, Q)
    moment_bound = _times((1 / (g * g)) / (1 - rho / g),
                          _product(_product(_T(Y_K), Q_squared), Y_K))
    coarse_bound = _times((rho / g) ** 2 / (1 - rho / g), R_KK)
    exact_floor = _minus(_plus(_times(g, _eye(2)), short), feature_load)
    certified_load = _plus(partial, moment_bound)
    certified_floor = _minus(_plus(_times(g, _eye(2)), short), certified_load)
    trace_majorant = _times(g / (g - V), R_KK)
    norm_majorant = _times(g / (g - rho), R_KK)
    if feature_load != physical_load or not _psd(_minus(moment_bound, tail)):
        raise ReplayError("independent round-trip/tail reconstruction failed")
    if not _psd(_minus(coarse_bound, tail)) or not _pd(exact_floor) or not _pd(certified_floor):
        raise ReplayError("independent feature-Schur certificate failed")
    if (
        not _psd(_minus(trace_majorant, feature_load))
        or not _psd(_minus(norm_majorant, feature_load))
    ):
        raise ReplayError("independent scalar feature-load majorant failed")
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
        "partial_sum_m2": partial,
        "exact_tail_m2": tail,
        "moment_tail_bound_m2": moment_bound,
        "coarse_tail_bound_m2": coarse_bound,
        "trace_majorant": trace_majorant,
        "norm_majorant": norm_majorant,
        "exact_combined_floor": exact_floor,
        "moment_certificate_floor": certified_floor,
        "exact_floor_determinant": _det(exact_floor),
        "certificate_floor_determinant": _det(certified_floor),
    }


def _trace_norm_model() -> dict[str, Any]:
    g = Fraction(1)
    Y_H = _diagonal([Fraction(3, 4), Fraction(3, 4)])
    R_HH = _product(_T(Y_H), Y_H)
    rho, V = max(R_HH[0][0], R_HH[1][1]), _trace(R_HH)
    high = _minus(_times(g, _eye(2)), R_HH)
    if not (rho < g < V) or not _pd(high):
        raise ReplayError("independent trace/norm countermodel failed")
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
    Q = _product(Y_H, _T(Y_H))
    resolvent = _inv(_minus(_eye(2), Q))
    aligned = [[Fraction(1)], [Fraction(0)]]
    orthogonal = [[Fraction(0)], [Fraction(1)]]
    aligned_load = _product(_product(_T(aligned), resolvent), aligned)[0][0]
    orthogonal_load = _product(_product(_T(orthogonal), resolvent), orthogonal)[0][0]
    R_HH = _product(_T(Y_H), Y_H)
    rho = _trace(R_HH)
    V = _trace(R_HH)
    aligned_R_KK = _trace(_product(_T(aligned), aligned))
    orthogonal_R_KK = _trace(_product(_T(orthogonal), orthogonal))
    same_diagonal_data = rho == V and aligned_R_KK == orthogonal_R_KK
    determines_orientation = not (same_diagonal_data and aligned_load != orthogonal_load)
    if (
        aligned_load != Fraction(4, 3)
        or orthogonal_load != Fraction(1)
        or rho != Fraction(1, 4)
        or not same_diagonal_data
        or determines_orientation
    ):
        raise ReplayError("independent oriented-load countermodel failed")
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
    B = _minus(_plus(_times(g, _eye(2)), C), R)
    short = C[0][0] - C[0][1] * (1 / C[1][1]) * C[1][0]
    low = g - R[0][0] + short
    if not _pd(B) or _det(B) != 7 or low != -1:
        raise ReplayError("independent over-shorting countermodel failed")
    return {
        "g": g,
        "C": C,
        "R": R,
        "B": B,
        "determinant_B": _det(B),
        "C_short": short,
        "fully_shorted_low": low,
        "B_positive_definite": True,
        "fully_shorted_test_passes": False,
        "interpretation": "the shorted criterion is sufficient, not necessary",
    }


def _coframe_model() -> dict[str, Any]:
    Z = [[Fraction(1), Fraction(0), Fraction(0)],
         [Fraction(0), Fraction(3, 5), Fraction(4, 5)]]
    P_F = _diagonal([Fraction(1), Fraction(1), Fraction(0)])
    P_bad = _diagonal([Fraction(1), Fraction(0), Fraction(0)])
    L = _product(_product(Z, _minus(_eye(3), P_F)), _T(Z))
    L_bad = _product(_product(Z, _minus(_eye(3), P_bad)), _T(Z))
    frame = _product(_product(Z, P_F), _T(Z))
    bad_frame = _product(_product(Z, P_bad), _T(Z))
    strict_trace = _trace(L) < 1
    boundary_passes = _trace(L_bad) < 1 and _det(bad_frame) > 0
    if (
        _product(Z, _T(Z)) != _eye(2)
        or frame != _minus(_eye(2), L)
        or not strict_trace
        or _det(frame) <= 0
        or _trace(L_bad) != 1
        or _det(bad_frame) != 0
        or boundary_passes
    ):
        raise ReplayError("independent coframe tail identity failed")
    return {
        "Z": Z,
        "P_F": P_F,
        "L_F": L,
        "trace_L_F": _trace(L),
        "frame": frame,
        "frame_determinant": _det(frame),
        "strict_trace_certificate_passes": strict_trace,
        "boundary_P_F": P_bad,
        "boundary_L_F": L_bad,
        "boundary_trace_L_F": _trace(L_bad),
        "boundary_frame": bad_frame,
        "boundary_frame_determinant": _det(bad_frame),
        "boundary_passes": boundary_passes,
    }


def _mobius_sieve(size: int) -> list[int]:
    values: list[int] = []
    for n in range(1, size + 1):
        square_factor = any(n % (p * p) == 0 for p in range(2, n + 1))
        if square_factor:
            values.append(0)
            continue
        distinct = sum(n % p == 0 and all(p % q for q in range(2, isqrt(p) + 1))
                       for p in range(2, n + 1))
        values.append(-1 if distinct % 2 else 1)
    return values


def _mobius_model() -> dict[str, Any]:
    size = 6
    target = [Fraction(2), Fraction(-1), Fraction(3), Fraction(4), Fraction(-2), Fraction(5)]
    mu = _mobius_sieve(size)
    source = [sum((mu[n - 1] * target[n * m - 1]
                   for n in range(1, size // m + 1)), Fraction(0))
              for m in range(1, size + 1)]
    divisor = [sum(mu[d - 1] for d in range(1, k + 1) if k % d == 0)
               for k in range(1, size + 1)]
    reconstructed = sum(source, Fraction(0))
    if divisor != [1, 0, 0, 0, 0, 0] or reconstructed != target[0]:
        raise ReplayError("independent Mobius convolution failed")

    hole_weights = [Fraction(1), Fraction(1), Fraction(1, 2)]
    visible_source = [Fraction(2), Fraction(-1), Fraction(0)]
    hole_correction = [Fraction(0), Fraction(0), Fraction(-2)]
    corrected_source = [a + b for a, b in zip(visible_source, hole_correction)]
    physical_sampling = [
        [Fraction(1), Fraction(0), Fraction(0)],
        [Fraction(1), Fraction(1), Fraction(0)],
    ]
    visible_image = [row[0] for row in _product(physical_sampling, [[x] for x in visible_source])]
    corrected_image = [row[0] for row in _product(physical_sampling, [[x] for x in corrected_source])]
    corrected_integral = sum((w * x for w, x in zip(hole_weights, corrected_source)), Fraction(0))
    correction_changes_image = visible_image != corrected_image
    if (
        sum((w * x for w, x in zip(hole_weights, visible_source)), Fraction(0)) != 1
        or sum((w * x for w, x in zip(hole_weights, hole_correction)), Fraction(0)) != -1
        or corrected_integral != 0
        or correction_changes_image
    ):
        raise ReplayError("independent central-hole kernel correction failed")
    return {
        "finite_cutoff": size,
        "scaled_target_values": target,
        "mobius_values": mu,
        "right_inverse_source_values": source,
        "divisor_convolution_coefficients": divisor,
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


def _regressions() -> dict[str, Any]:
    positive = _positive_short_model()
    return _encode({
        "exterior_trimmed_stop_loss": _exterior_trimmed_model(),
        "singular_positive_feature_short": positive,
        "negative_round_trip_and_tail": _negative_model(positive["short_from_blocks"]),
        "trace_is_not_spectral_necessity": _trace_norm_model(),
        "oriented_load_countermodel": _orientation_model(),
        "over_shorting_countermodel": _over_shorting_model(),
        "normalized_coframe_tail": _coframe_model(),
        "mobius_divisor_convolution": _mobius_model(),
    })


def reconstruct(lambda_numerator: int, dps: int) -> dict[str, Any]:
    p = _int(lambda_numerator, "lambda_numerator", 5)
    precision = _int(dps, "precision_label_decimal_digits", 50)
    if p % 2 == 0:
        raise ReplayError("lambda numerator must be odd")
    _ = precision
    return {
        "exact_schedule_metadata": {
            "lambda": _rational(Fraction(p, 2)),
            "N_rule": "ceil(lambda^2)",
            "N": (p * p + 3) // 4,
            "model_scope": "exact theorem regressions only; not a physical Weil pilot",
        },
        "exact_regressions": _regressions(),
    }


def _source_hashes() -> dict[str, str]:
    root = _root()
    result: dict[str, str] = {}
    for relative, expected in PINNED_HASHES.items():
        if _SHA256.fullmatch(expected) is None or _sha256(root / relative) != expected:
            raise ReplayError(f"source byte hash mismatch: {relative}")
        result[relative] = expected
    lock = _strict_json_loads((root / LOCK).read_bytes(), "source lock")
    expected_top = {
        "schema", "claim_class", "terminal_state", "updated_date",
        "external_sources", "dependencies", "locked_conventions",
        "locked_formulas", "claim_boundary",
    }
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ReplayError("source-lock inventory mismatch")
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
        if not _same(lock[key], expected):
            raise ReplayError(f"source-lock {key} mutation")
    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list) or not dependencies:
        raise ReplayError("source-lock dependencies missing")
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ReplayError("malformed source-lock dependency")
        relative, expected, role = item["path"], item["sha256"], item["role"]
        if (
            not isinstance(relative, str) or not relative
            or Path(relative).is_absolute() or ".." in Path(relative).parts
            or relative in result or not isinstance(expected, str)
            or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str) or not role
        ):
            raise ReplayError("invalid source-lock dependency")
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
        "schema", "status", "terminal_state", "input", "source_hashes",
        "locked_conventions", "locked_formulas", "source_admissions",
        "certificate", "arithmetic", "producer_pass_boolean_trusted_by_replay",
        "claim_scope", "result",
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
    hashes = _source_hashes()
    if not _same(payload["source_hashes"], hashes):
        raise ReplayError("source-hash inventory mismatch")
    inputs = payload["input"]
    if not isinstance(inputs, dict) or set(inputs) != {
        "lambda_numerator", "lambda_denominator", "precision_label_decimal_digits"
    }:
        raise ReplayError("input inventory mismatch")
    p = _int(inputs["lambda_numerator"], "lambda_numerator", 5)
    denominator = _int(inputs["lambda_denominator"], "lambda_denominator", 1)
    dps = _int(inputs["precision_label_decimal_digits"], "precision_label_decimal_digits", 50)
    if denominator != 2 or p % 2 == 0:
        raise ReplayError("half-integer metadata violation")
    expected_certificate = reconstruct(p, dps)
    if not _same(payload["certificate"], expected_certificate):
        raise ReplayError("exact certificate reconstruction mismatch")
    return {
        "schema": REPLAY_SCHEMA,
        "status": REPLAY_RESULT,
        "terminal_state": TERMINAL_STATE,
        "producer_binding": {
            "byte_source": "exact artifact file bytes",
            "byte_count": len(producer_bytes),
            "sha256": hashlib.sha256(producer_bytes).hexdigest(),
        },
        "input": {
            "lambda_numerator": p,
            "lambda_denominator": denominator,
            "precision_label_decimal_digits": dps,
        },
        "source_hashes": hashes,
        "reconstructed_certificate": expected_certificate,
        "checks": {
            "source_note_lock_and_dependencies_rehashed": True,
            "producer_bytes_bound_exactly": True,
            "exterior_volume_rebuilt_by_double_minors": True,
            "physical_complement_rebuilt_from_nullspace": True,
            "trimmed_mean_rebuilt_from_stop_loss_dual": True,
            "strict_odd_pole_boundary_rejected": True,
            "singular_positive_short_rebuilt_from_feature_residual": True,
            "negative_round_trip_rebuilt_from_feature_resolvent": True,
            "nonunit_g_neumann_tail_rebuilt": True,
            "trace_norm_orientation_and_overshorting_countermodels_rebuilt": True,
            "coframe_tail_and_mobius_convolution_rebuilt": True,
            "no_physical_schedule_or_RH_claim": True,
        },
        "arithmetic": ARITHMETIC,
        "claim_scope": CLAIM_SCOPE,
        "producer_pass_boolean_trusted": False,
        "result": REPLAY_RESULT,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("artifact")
    parser.add_argument("--output")
    args = parser.parse_args()
    raw = Path(args.artifact).read_bytes()
    payload = _strict_json_loads(raw, "producer artifact")
    encoded = json.dumps(replay(payload, raw), indent=2, sort_keys=True) + "\n"
    if args.output:
        Path(args.output).write_text(encoded, encoding="utf-8")
    else:
        print(encoded, end="")


if __name__ == "__main__":
    main()
