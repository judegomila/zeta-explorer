#!/usr/bin/env python3
"""Produce the matched high-moment/coframe reduction certificate.

The payload contains exact rational separation models and outward interval
evaluations of source formulas.  It does not contain physical prolate
columns, a signed Weil-sector certificate, or an asymptotic RH conclusion.
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

import mpmath as mp


SCHEMA = "xi-prolate-matched-high-moment-coframe-v1"
LOCK = "MATCHED_HIGH_MOMENT_COFRAME_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-matched-high-moment-coframe-source-lock-v1"
CLAIM_CLASS = "MATCHED_HIGH_MOMENT_COFRAME_REDUCTION"
TERMINAL_STATE = "P0_INVALIDATED"
UPDATED_DATE = "2026-08-08"
EXPECTED_LIBRARY = "mpmath.iv 1.4.1"

_SHA256 = re.compile(r"^[0-9a-f]{64}$")
LOG2_10_UPPER_NUMERATOR = 3321928094887363
LOG2_10_UPPER_DENOMINATOR = 10**15
SERIALIZATION_GUARD_OFFSET_BITS = 16

EXPECTED_DEPENDENCIES = {
    "P0_SOURCE_LOCK.json",
    "DIRECT_RH_ATTACK.md",
    "FULL_SOURCE_COFRAME_RANK_SOURCE_LOCK.json",
    "notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md",
    "PHYSICAL_SOFT_SHORT_SIGNED_SCHUR_SOURCE_LOCK.json",
    "notes/PHYSICAL_SOFT_SHORT_SIGNED_SCHUR.md",
    "LOCALIZED_MOMENT_SOURCE_WHITENED_SCHUR_SOURCE_LOCK.json",
    "notes/LOCALIZED_MOMENT_SOURCE_WHITENED_SCHUR.md",
    "LEVERAGE_TRIMMED_MEAN_FEATURE_SCHUR_SOURCE_LOCK.json",
    "notes/LEVERAGE_TRIMMED_MEAN_FEATURE_SCHUR.md",
    "PROJECTED_STATE_NORM_SOURCE_LOCK.json",
    "notes/PROJECTED_STATE_NORM_LOWER_BOUND.md",
    "requirements.txt",
    "notes/GROWING_WINDOW_THEOREM.md",
    "notes/MATCHED_HIGH_MOMENT_COFRAME_REDUCTION.md",
}

LOCKED_CONVENTIONS = {
    "source_interval": "[-lambda,lambda] with Lebesgue measure and zero extension; physical measure is du/u on [lambda^(-1),lambda]",
    "fourier_sign": "fhat(t)=integral f(y)*exp(-i*t*y)dy with Plancherel measure dt/(2*pi)",
    "prime_endpoint": "every prime power n<=lambda^2 is retained",
    "prime_sign": "m_lambda=2*theta_prime-2*sum_(n<=lambda^2) Lambda(n)/sqrt(n)*cos(t*log(n))",
    "inversion": "Jg(u)=g(u^(-1)); in logarithmic coordinates J is reflection",
    "source_normalization": "zero-Lebesgue-integral prolate sources retain their full source Gram; it is never replaced by the identity",
    "matched_schedule": "lambda=p/2 for odd p>=5 and N=m=ceil(lambda^2)=(p^2+3)/4",
    "strict_buffer": "q=ceil((2/pi^2)*log(50*p^2+25)*log(20)), n_star=p^2+6+q, and targets satisfy t<n_star",
    "moment_sign": "centered even moments are formed from the complete signed Hermitian matrix; absolute prime moments do not determine the source minus sign",
    "odd_pole": "p_minus(x)=sinh(x/2) remains a negative odd-sector feature unless its projected direction is explicitly captured",
    "strictness": "a zero coframe minor, a nonpositive lower floor, or equality in a strict angle reserve is rejected",
    "artifact_scope": "exact theorem regressions and outward source-formula intervals, not physical prolate-Weil matrices or an asymptotic schedule certificate",
    "arithmetic": "finite fixtures use exact reduced rationals; logarithms, pi, square roots, and pole thresholds use outward mpmath.iv intervals; binary64 JSON numbers are forbidden",
}

LOCKED_FORMULAS = {
    "matched_counts": "m=(p^2+3)/4, r_plus=m+floor((q+2)/4)-1, r_minus=m+floor(q/4)",
    "full_source_floor": "T*T_adjoint >= (8*lambda^4)^(-1) I",
    "source_gram_frame": "for C with B=C^*C and W=T*C, T*P_(ran C)*T^*=W*B^dagger*W^*",
    "normalized_minor": "with Wtilde=R^(-1/2)*W*D^(dagger/2), Delta_J^2=abs(det(Wtilde_J))^2 and U>=norm(R^(-1/2)*W*D^dagger*W^*R^(-1/2)), the relative floor is at least Delta_J^2/U^(N-1); U=1 is always valid",
    "minus_source_gram": "B_minus=I+a*a^*",
    "plus_source_gram": "B_plus=I+alpha*alpha^*+b*b^*",
    "centered_moment_floor": "lambda_min(A)>=mean(A)-[C_(2k)/(1+(d-1)^(1-2k))]^(1/(2k))",
    "one_sided_floor": "if M*I-A>=0 then lambda_min(A)>=M-[trace((M*I-A)^p)]^(1/p)",
    "odd_pole_coefficient": "<phi_n,p_minus>=2*i*omega_n*sinh(ell/2)/(sqrt(L)*(omega_n^2+1/4))",
    "odd_pole_projection": "norm(P_N*p_minus)^2=(8*sinh(ell/2)^2/L)*sum_(n=1)^N omega_n^2/(omega_n^2+1/4)^2",
    "odd_pole_lower": "B_pole=sinh(ell)-ell-2*L*sinh(ell/2)^2/(pi^2*N)<=norm(P_N*p_minus)^2",
    "odd_pole_angle_necessity": "eta_pole<g/(2*norm(P_N*p_minus)^2)<=kappa*L/(2*B_pole), with kappa=1/4",
}

CLAIM_SCOPE = {
    "proved": [
        "the exact matched inventory counts and elementary full-source floor constant",
        "coordinate-invariant source-Gram coframe and normalized-minor regression identities",
        "the sharp finite-dimensional centered even-moment lower bound regressions for k=1 through 4",
        "the one-sided moment lower-bound regression with an outward positive interval",
        "an outward matched odd-pole projection lower bound and the resulting necessary angle threshold",
        "exact countermodels separating absolute prime moments from the locked prime sign and continuous injectivity from projected row rank",
    ],
    "not_proved": [
        "a nonzero normalized physical minor for either prescribed matched prolate family",
        "a matched physical coframe floor on an unbounded schedule",
        "a complete signed high-moment margin for the physical Weil compression",
        "the required odd-pole capture angle for the physical odd range",
        "a positive signed floor in either inversion sector",
        "equation (5.2) of DIRECT_RH_ATTACK.md",
        "locally uniform determinant convergence",
        "the Riemann hypothesis",
    ],
}

SOURCE_ADMISSIONS = {
    "absolute_prime_values_substituted_for_signed_sum": False,
    "api_key_read": False,
    "binary64_parameters_used": False,
    "cached_physical_matrix_read": False,
    "cached_prolate_eigenvectors_read": False,
    "cached_weil_matrix_read": False,
    "count_promoted_to_rank": False,
    "determinant_limit_claimed": False,
    "environment_secret_read": False,
    "equation_5_2_claimed": False,
    "finite_fourier_residue_declared_inversion_parity": False,
    "global_weil_positivity_assumed": False,
    "inversion_reflection_dropped": False,
    "lambda_squared_mixed_with_lambda": False,
    "moment_fixture_promoted_to_physical_schedule": False,
    "nonpositive_floor_reported_as_pass": False,
    "odd_negative_pole_omitted": False,
    "physical_coframe_claimed": False,
    "prime_block_sign_changed": False,
    "prime_power_endpoint_omitted": False,
    "real_axis_eigenvalue_agreement_substituted_for_determinant_convergence": False,
    "rh_proved": False,
    "secret_serialized": False,
    "signed_sector_floor_claimed": False,
    "source_gram_replaced_by_identity": False,
    "unit_source_normalization_substituted": False,
    "zeros_assumed_real": False,
    "zeta_zero_table_read": False,
}

ARITHMETIC_LIBRARIES = {
    "precision_mode": "exact rational arithmetic plus outward arbitrary-precision intervals",
    "libraries": ["Python fractions.Fraction", EXPECTED_LIBRARY],
    "raw_interval_or_ball_output_applicable": True,
    "shared_library_with_verifier": True,
    "independent_formula_trees_required": True,
    "serialization_guard": "every nondegenerate interval is enlarged to a precision-scaled dyadic enclosure",
    "independence_limitation": "producer and verifier share Python integer/Fraction arithmetic and the pinned mpmath.iv transcendental runtime",
}

Matrix = list[list[Fraction]]


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _validated_source_lock() -> dict[str, Any]:
    path = _root() / LOCK
    lock = json.loads(path.read_text(encoding="utf-8"))
    expected_top = {
        "schema", "claim_class", "terminal_state", "updated_date",
        "external_sources", "dependencies", "locked_conventions",
        "locked_formulas", "claim_boundary", "source_admissions",
    }
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ValueError("source-lock inventory mismatch")
    fixed = {
        "schema": LOCK_SCHEMA,
        "claim_class": CLAIM_CLASS,
        "terminal_state": TERMINAL_STATE,
        "updated_date": UPDATED_DATE,
        "external_sources": [],
        "locked_conventions": LOCKED_CONVENTIONS,
        "locked_formulas": LOCKED_FORMULAS,
        "claim_boundary": CLAIM_SCOPE,
        "source_admissions": SOURCE_ADMISSIONS,
    }
    for key, expected in fixed.items():
        if lock[key] != expected:
            raise ValueError(f"source-lock {key} mutation")
    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list) or not dependencies:
        raise ValueError("source-lock dependencies missing")
    found: dict[str, str] = {}
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ValueError("malformed source-lock dependency")
        relative, expected, role = item["path"], item["sha256"], item["role"]
        candidate = Path(relative) if isinstance(relative, str) else Path(".")
        if (
            not isinstance(relative, str) or not relative
            or candidate.is_absolute() or ".." in candidate.parts
            or relative in found
            or not isinstance(expected, str) or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str) or not role
        ):
            raise ValueError("invalid source-lock dependency")
        if _sha256(_root() / candidate) != expected:
            raise ValueError(f"dependency hash mismatch: {relative}")
        found[relative] = expected
    if set(found) != EXPECTED_DEPENDENCIES:
        raise ValueError("source-lock dependency path inventory mismatch")
    return {
        "path": LOCK,
        "sha256": _sha256(path),
        "schema": LOCK_SCHEMA,
        "dependency_hashes": dict(sorted(found.items())),
    }


def _integer(value: Any, label: str, minimum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{label} must be an exact integer")
    if value < minimum:
        raise ValueError(f"{label} must be at least {minimum}")
    return value


def _encode(value: Any) -> Any:
    if isinstance(value, Fraction):
        return {"numerator": str(value.numerator), "denominator": str(value.denominator)}
    if isinstance(value, list):
        return [_encode(item) for item in value]
    if isinstance(value, tuple):
        return [_encode(item) for item in value]
    if isinstance(value, dict):
        return {key: _encode(item) for key, item in value.items()}
    return value


def _assert_strict_json(value: Any) -> None:
    if isinstance(value, float):
        raise TypeError("binary floating-point value reached JSON serialization")
    if value is None or type(value) in (bool, int, str):
        return
    if isinstance(value, list):
        for item in value:
            _assert_strict_json(item)
        return
    if isinstance(value, dict):
        if any(not isinstance(key, str) for key in value):
            raise TypeError("JSON object keys must be strings")
        for item in value.values():
            _assert_strict_json(item)
        return
    raise TypeError(f"unsupported JSON value type: {type(value).__name__}")


def _shape(matrix: Matrix) -> tuple[int, int]:
    rows = len(matrix)
    columns = len(matrix[0]) if rows else 0
    if any(len(row) != columns for row in matrix):
        raise ValueError("ragged matrix")
    return rows, columns


def _transpose(matrix: Matrix) -> Matrix:
    rows, columns = _shape(matrix)
    return [[matrix[i][j] for i in range(rows)] for j in range(columns)]


def _matmul(left: Matrix, right: Matrix) -> Matrix:
    lr, lc = _shape(left)
    rr, rc = _shape(right)
    if lc != rr:
        raise ValueError("matrix dimension mismatch")
    return [[sum((left[i][k] * right[k][j] for k in range(lc)), Fraction(0))
             for j in range(rc)] for i in range(lr)]


def _sub(left: Matrix, right: Matrix) -> Matrix:
    if _shape(left) != _shape(right):
        raise ValueError("matrix dimension mismatch")
    return [[a - b for a, b in zip(lrow, rrow)]
            for lrow, rrow in zip(left, right)]


def _identity(size: int) -> Matrix:
    return [[Fraction(i == j) for j in range(size)] for i in range(size)]


def _diag(*values: Fraction) -> Matrix:
    return [[value if i == j else Fraction(0) for j in range(len(values))]
            for i, value in enumerate(values)]


def _outer(column: list[Fraction]) -> Matrix:
    return [[left * right for right in column] for left in column]


def _add(*matrices: Matrix) -> Matrix:
    if not matrices:
        raise ValueError("at least one matrix is required")
    shape = _shape(matrices[0])
    if any(_shape(matrix) != shape for matrix in matrices[1:]):
        raise ValueError("matrix dimension mismatch")
    return [[sum((matrix[i][j] for matrix in matrices), Fraction(0))
             for j in range(shape[1])] for i in range(shape[0])]


def _inverse(matrix: Matrix) -> Matrix:
    rows, columns = _shape(matrix)
    if rows == 0 or rows != columns:
        raise ValueError("inverse requires a nonempty square matrix")
    work = [row[:] + unit[:] for row, unit in zip(matrix, _identity(rows))]
    for column in range(rows):
        pivot = next((row for row in range(column, rows) if work[row][column]), None)
        if pivot is None:
            raise ValueError("singular matrix")
        work[column], work[pivot] = work[pivot], work[column]
        divisor = work[column][column]
        work[column] = [entry / divisor for entry in work[column]]
        for row in range(rows):
            if row == column:
                continue
            multiplier = work[row][column]
            work[row] = [a - multiplier * b for a, b in zip(work[row], work[column])]
    return [row[rows:] for row in work]


def _determinant(matrix: Matrix) -> Fraction:
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ValueError("determinant requires a square matrix")
    work = [row[:] for row in matrix]
    determinant = Fraction(1)
    for column in range(rows):
        pivot = next((row for row in range(column, rows) if work[row][column]), None)
        if pivot is None:
            return Fraction(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            determinant = -determinant
        value = work[column][column]
        determinant *= value
        for row in range(column + 1, rows):
            ratio = work[row][column] / value
            for index in range(column + 1, rows):
                work[row][index] -= ratio * work[column][index]
    return determinant


def _rank(matrix: Matrix) -> int:
    rows, columns = _shape(matrix)
    work = [row[:] for row in matrix]
    rank = 0
    for column in range(columns):
        pivot = next((row for row in range(rank, rows) if work[row][column]), None)
        if pivot is None:
            continue
        work[rank], work[pivot] = work[pivot], work[rank]
        divisor = work[rank][column]
        work[rank] = [entry / divisor for entry in work[rank]]
        for row in range(rows):
            if row != rank and work[row][column]:
                ratio = work[row][column]
                work[row] = [a - ratio * b for a, b in zip(work[row], work[rank])]
        rank += 1
        if rank == rows:
            break
    return rank


def _principal_minors(matrix: Matrix) -> list[Fraction]:
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ValueError("principal minors require a square matrix")
    return [
        _determinant([[matrix[i][j] for j in indices] for i in indices])
        for size in range(1, rows + 1)
        for indices in itertools.combinations(range(rows), size)
    ]


def _integer_nth_root(value: int, degree: int) -> int:
    if value < 0 or degree < 1:
        raise ValueError("invalid integer root")
    low, high = 0, 1
    while high**degree < value:
        high *= 2
    while low + 1 < high:
        middle = (low + high) // 2
        if middle**degree < value:
            low = middle
        else:
            high = middle
    root = high if high**degree == value else low
    if root**degree != value:
        raise ArithmeticError("rational is not a perfect requested power")
    return root


def _perfect_fraction_root(value: Fraction, degree: int) -> Fraction:
    if value < 0:
        raise ValueError("even fixture roots require nonnegative rationals")
    return Fraction(
        _integer_nth_root(value.numerator, degree),
        _integer_nth_root(value.denominator, degree),
    )


def _precision_bits(dps: int) -> int:
    return (dps * LOG2_10_UPPER_NUMERATOR + LOG2_10_UPPER_DENOMINATOR - 1) // LOG2_10_UPPER_DENOMINATOR


def _raw(raw: tuple[int, int, int, int]) -> list[object]:
    return [int(raw[0]), str(int(raw[1])), int(raw[2]), int(raw[3])]


def _raw_fraction(raw: tuple[int, int, int, int]) -> Fraction:
    sign, mantissa, exponent, _bits = raw
    value = Fraction(mantissa * (1 if sign == 0 else -1))
    return value * (2**exponent if exponent >= 0 else Fraction(1, 2 ** (-exponent)))


def _power_of_two(exponent: int) -> Fraction:
    return Fraction(2**exponent) if exponent >= 0 else Fraction(1, 2 ** (-exponent))


def _normalize_signed_dyadic(value: int, exponent: int) -> tuple[int, int, int, int]:
    if value == 0:
        return (0, 0, 0, 0)
    sign = 1 if value < 0 else 0
    mantissa = abs(value)
    while mantissa % 2 == 0:
        mantissa //= 2
        exponent += 1
    return (sign, mantissa, exponent, mantissa.bit_length())


def _shift_raw(raw: tuple[int, int, int, int], power: int, direction: int) -> tuple[int, int, int, int]:
    sign, mantissa, exponent, _bits = raw
    signed = -mantissa if sign else mantissa
    base = min(exponent, power)
    shifted = (signed << (exponent - base)) + direction * (1 << (power - base))
    return _normalize_signed_dyadic(shifted, base)


def _guarded_endpoints(
    lower: tuple[int, int, int, int], upper: tuple[int, int, int, int], dps: int,
) -> tuple[tuple[int, int, int, int], tuple[int, int, int, int]]:
    if lower == upper:
        return lower, upper
    scale = 0
    for _sign, mantissa, exponent, bits in (lower, upper):
        if mantissa:
            scale = max(scale, exponent + bits - 1)
    guard = scale - _precision_bits(dps) + SERIALIZATION_GUARD_OFFSET_BITS
    return _shift_raw(lower, guard, -1), _shift_raw(upper, guard, 1)


def _capture(value: object) -> tuple[mp.mpf, mp.mpf]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    bits = max(int(lower[3]), int(upper[3])) + 48
    with mp.workprec(bits):
        return +mp.mpf(tuple(lower)), +mp.mpf(tuple(upper))


def _serialize_interval(value: object, dps: int) -> dict[str, object]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    lo, hi = _guarded_endpoints(
        tuple(int(part) for part in lower), tuple(int(part) for part in upper), dps,
    )
    scale = 0
    for _sign, mantissa, exponent, bits in (lo, hi):
        if mantissa:
            scale = max(scale, exponent + bits - 1)
    width = _raw_fraction(hi) - _raw_fraction(lo)
    cap = _power_of_two(scale - _precision_bits(dps) + 20)
    if width < 0 or width > cap:
        raise ArithmeticError("serialized interval exceeds the precision-scaled width cap")
    with mp.workdps(dps + 20):
        return {
            "decimal": [mp.nstr(mp.mpf(lo), dps + 10), mp.nstr(mp.mpf(hi), dps + 10)],
            "dyadic": {"lower": _raw(lo), "upper": _raw(hi)},
        }


def _interval_data(p: int, dps: int) -> tuple[dict[str, Any], int, dict[str, Any]]:
    if f"mpmath.iv {mp.__version__}" != EXPECTED_LIBRARY:
        raise RuntimeError("pinned mpmath.iv version is not active")
    old = mp.iv.dps
    try:
        mp.iv.dps = dps
        transition = (
            mp.iv.mpf(2) * mp.iv.log(mp.iv.mpf(50 * p * p + 25))
            * mp.iv.log(mp.iv.mpf(20)) / (mp.iv.pi * mp.iv.pi)
        )
        transition_lower, transition_upper = _capture(transition)
        q_lower, q_upper = int(mp.ceil(transition_lower)), int(mp.ceil(transition_upper))
        if q_lower != q_upper:
            raise ArithmeticError("transition ceiling is not separated")

        lam = mp.iv.mpf(p) / mp.iv.mpf(2)
        ell = mp.iv.log(lam)
        length = mp.iv.mpf(2) * ell
        n = (p * p + 3) // 4
        sinh_ell = mp.iv.mpf(p * p - 4) / mp.iv.mpf(4 * p)
        sinh_half_squared = mp.iv.mpf((p - 2) ** 2) / mp.iv.mpf(8 * p)
        tail = (
            mp.iv.mpf(2) * length * sinh_half_squared
            / (mp.iv.pi * mp.iv.pi * mp.iv.mpf(n))
        )
        pole_norm = sinh_ell - ell
        b_pole = pole_norm - tail
        kappa = mp.iv.mpf(1) / mp.iv.mpf(4)
        angle = kappa * length / (mp.iv.mpf(2) * b_pole)
        b_lower, _b_upper = _capture(b_pole)
        angle_lower, angle_upper = _capture(angle)
        if b_lower <= 0:
            raise ArithmeticError("odd-pole lower interval is not strictly positive")
        if angle_upper < 1:
            classification = "strictly_below_one"
        elif angle_lower >= 1:
            classification = "at_least_one"
        else:
            classification = "unresolved_against_one"
        pole = {
            "ell": _serialize_interval(ell, dps),
            "L": _serialize_interval(length, dps),
            "pole_norm_squared": _serialize_interval(pole_norm, dps),
            "projection_tail_upper": _serialize_interval(tail, dps),
            "B_pole": _serialize_interval(b_pole, dps),
            "kappa": Fraction(1, 4),
            "g_equals_kappa_L": _serialize_interval(kappa * length, dps),
            "angle": _serialize_interval(angle, dps),
            "angle_classification_against_one": classification,
            "positivity": True,
            "logical_role": "eta_pole<angle is necessary for the separated odd-pole trace test; it is not a sufficient capture certificate",
        }

        sqrt_five = mp.iv.sqrt(mp.iv.mpf(5))
        one_sided = {
            "sqrt_five": _serialize_interval(sqrt_five, dps),
            "bound_three_minus_sqrt_five": _serialize_interval(mp.iv.mpf(3) - sqrt_five, dps),
        }
        lower, _upper = _capture(mp.iv.mpf(3) - sqrt_five)
        if lower <= 0:
            raise ArithmeticError("one-sided fixture lower bound is not positive")
        return _serialize_interval(transition, dps), q_lower, {"pole": pole, "one_sided": one_sided}
    finally:
        mp.iv.dps = old


def _schedule(p: int, q: int, transition: dict[str, Any]) -> dict[str, Any]:
    m = (p * p + 3) // 4
    r_plus = m + (q + 2) // 4 - 1
    r_minus = m + q // 4
    return {
        "lambda": Fraction(p, 2),
        "N": m,
        "N_rule": "ceil(lambda^2)",
        "transition_argument": transition,
        "q": q,
        "n_star": p * p + 6 + q,
        "r_plus_buffered": r_plus,
        "r_minus_buffered": r_minus,
        "plus_excess_columns": r_plus - m,
        "minus_excess_columns": r_minus - m,
        "buffered_count_forces_plus_row_rank": False,
        "buffered_count_forces_minus_row_rank": False,
        "unbuffered_r_plus": m - 2,
        "unbuffered_r_minus": m - 2,
        "unbuffered_forced_row_nullity_each_sector": 2,
    }


def _full_source(p: int) -> dict[str, Any]:
    floor = Fraction(2, p**4)
    upper = Fraction(p * p, 8)
    return {
        "lambda": Fraction(p, 2),
        "row_floor_one_over_8_lambda_fourth": floor,
        "operator_upper_lambda_squared_over_2": upper,
        "floor_strictly_positive": floor > 0,
        "prescribed_matched_family_floor_inferred": False,
    }


def _coframe_fixtures() -> dict[str, Any]:
    source_gram = _diag(Fraction(2), Fraction(8))
    full_frame = _identity(2)
    good = _diag(Fraction(1), Fraction(1, 3))
    zero = _diag(Fraction(1), Fraction(0))
    corrected_good = _matmul(_matmul(good, _inverse(source_gram)), _transpose(good))
    corrected_zero = _matmul(_matmul(zero, _inverse(source_gram)), _transpose(zero))
    raw_good = _matmul(good, _transpose(good))
    normalized_minor_squared = _determinant(good) ** 2 / _determinant(source_gram)
    fixture_lambda = Fraction(5, 2)
    relative_operator_upper = Fraction(1)
    relative_minor_floor = normalized_minor_squared / relative_operator_upper
    full_source_floor = Fraction(1, 8) / fixture_lambda**4
    absolute_minor_floor = relative_minor_floor * full_source_floor

    a = [Fraction(1, 2), Fraction(1, 3)]
    alpha = [Fraction(1, 2), Fraction(1, 3)]
    b = [Fraction(1, 4), Fraction(-1, 5)]
    b_minus = _add(_identity(2), _outer(a))
    b_plus = _add(_identity(2), _outer(alpha), _outer(b))
    b_minus_formula = Fraction(1) + sum((entry * entry for entry in a), Fraction(0))
    alpha_norm = sum((entry * entry for entry in alpha), Fraction(0))
    b_norm = sum((entry * entry for entry in b), Fraction(0))
    alpha_b = sum((x * y for x, y in zip(alpha, b)), Fraction(0))
    b_plus_formula = (1 + alpha_norm) * (1 + b_norm) - alpha_b**2

    if (
        corrected_good != _diag(Fraction(1, 2), Fraction(1, 72))
        or corrected_zero != _diag(Fraction(1, 2), Fraction(0))
        or normalized_minor_squared != Fraction(1, 144)
        or relative_minor_floor != Fraction(1, 144)
        or full_source_floor != Fraction(2, 625)
        or absolute_minor_floor != Fraction(1, 45000)
        or _determinant(b_minus) != b_minus_formula
        or _determinant(b_plus) != b_plus_formula
        or min(_principal_minors(b_minus)) <= 0
        or min(_principal_minors(b_plus)) <= 0
    ):
        raise ValueError("coframe/source-Gram regression failed")
    return {
        "normalized_minor_pass": {
            "fixture_lambda": fixture_lambda,
            "ambient_full_frame_R": full_frame,
            "p5_full_source_floor": full_source_floor,
            "R_minus_full_source_floor_I_principal_minors": _principal_minors(
                _sub(full_frame, _diag(full_source_floor, full_source_floor))
            ),
            "source_gram_B": source_gram,
            "physical_columns_W": good,
            "raw_frame": raw_good,
            "source_gram_corrected_frame": corrected_good,
            "normalized_minor_squared": normalized_minor_squared,
            "relative_operator_upper_U": relative_operator_upper,
            "relative_minor_gamma": relative_minor_floor,
            "absolute_minor_floor_from_full_source": absolute_minor_floor,
            "actual_relative_floor": Fraction(1, 72),
            "passes": relative_minor_floor > 0,
        },
        "zero_minor_rejection": {
            "source_gram_B": source_gram,
            "physical_columns_W": zero,
            "source_gram_corrected_frame": corrected_zero,
            "normalized_minor_squared": _determinant(zero) ** 2 / _determinant(source_gram),
            "row_rank": _rank(zero),
            "passes": False,
        },
        "minus_source_gram": {
            "a": a,
            "B_minus_equals_I_plus_aa_star": b_minus,
            "determinant_direct": _determinant(b_minus),
            "determinant_formula": b_minus_formula,
            "principal_minors": _principal_minors(b_minus),
        },
        "plus_source_gram": {
            "alpha": alpha,
            "b": b,
            "B_plus_equals_I_plus_alphaalpha_star_plus_bb_star": b_plus,
            "determinant_direct": _determinant(b_plus),
            "determinant_formula": b_plus_formula,
            "principal_minors": _principal_minors(b_plus),
        },
    }


def _centered_fixture(diagonal: list[Fraction], label: str) -> dict[str, Any]:
    dimension = len(diagonal)
    mean = sum(diagonal, Fraction(0)) / dimension
    centered = [value - mean for value in diagonal]
    actual_minimum = min(diagonal)
    records = []
    for k in range(1, 5):
        degree = 2 * k
        moment = sum((value**degree for value in centered), Fraction(0))
        denominator = Fraction(1) + Fraction(1, (dimension - 1) ** (degree - 1))
        radius_power = moment / denominator
        radius = _perfect_fraction_root(radius_power, degree)
        bound = mean - radius
        records.append({
            "k": k,
            "degree": degree,
            "C_2k": moment,
            "complete_sign_denominator": denominator,
            "radius_power": radius_power,
            "radius": radius,
            "lower_bound": bound,
            "sharp_equality": bound == actual_minimum,
        })
    return {
        "label": label,
        "matrix": _diag(*diagonal),
        "dimension": dimension,
        "mean": mean,
        "centered_diagonal": centered,
        "actual_minimum": actual_minimum,
        "moments": records,
    }


def _centered_moment_floors() -> dict[str, Any]:
    sharp_bad = _centered_fixture(
        [Fraction(-1, 2), Fraction(5, 2), Fraction(5, 2)], "sharp_bad",
    )
    moment_twin_good = _centered_fixture(
        [Fraction(7, 2), Fraction(1, 2), Fraction(1, 2)], "moment_twin_good",
    )
    positive_sharp = _centered_fixture(
        [Fraction(1), Fraction(3)], "positive_sharp",
    )
    bad_moments = [record["C_2k"] for record in sharp_bad["moments"]]
    good_moments = [record["C_2k"] for record in moment_twin_good["moments"]]
    if (
        sharp_bad["mean"] != Fraction(3, 2)
        or moment_twin_good["mean"] != Fraction(3, 2)
        or bad_moments != [Fraction(2 ** (2 * k) + 2) for k in range(1, 5)]
        or bad_moments != good_moments
        or not all(record["sharp_equality"] for record in sharp_bad["moments"])
        or any(record["lower_bound"] > moment_twin_good["actual_minimum"]
               for record in moment_twin_good["moments"])
        or not all(record["C_2k"] == 2 and record["lower_bound"] == 1
                   and record["sharp_equality"] for record in positive_sharp["moments"])
    ):
        raise ValueError("centered moment regression failed")
    return {
        "sharp_bad": sharp_bad,
        "moment_twin_good": moment_twin_good,
        "positive_sharp": positive_sharp,
        "same_even_moments_do_not_determine_lower_sign": {
            "same_C_2k_for_k_1_through_4": bad_moments == good_moments,
            "bad_actual_minimum": sharp_bad["actual_minimum"],
            "good_actual_minimum": moment_twin_good["actual_minimum"],
            "positive_floor_inferred_from_shared_moments": False,
        },
    }


def _one_sided_floor(intervals: dict[str, Any]) -> dict[str, Any]:
    matrix = _diag(Fraction(1), Fraction(2), Fraction(3))
    cap = Fraction(3)
    power = 2
    deficit = _sub(_diag(cap, cap, cap), matrix)
    deficit_power = _matmul(deficit, deficit)
    moment = sum((deficit_power[i][i] for i in range(3)), Fraction(0))
    if deficit != _diag(Fraction(2), Fraction(1), Fraction(0)) or moment != 5:
        raise ValueError("one-sided moment regression failed")
    return {
        "A": matrix,
        "M": cap,
        "p": power,
        "M_I_minus_A": deficit,
        "trace_deficit_power": moment,
        "symbolic_lower_bound": "3-sqrt(5)",
        "sqrt_five": intervals["sqrt_five"],
        "lower_bound": intervals["bound_three_minus_sqrt_five"],
        "strictly_positive": True,
        "actual_minimum": Fraction(1),
    }


def _countermodels() -> dict[str, Any]:
    arch = [Fraction(5), Fraction(5)]
    prime = [Fraction(4), Fraction(1)]
    locked = [left - 2 * right for left, right in zip(arch, prime)]
    flipped = [left + 2 * right for left, right in zip(arch, prime)]
    moments = [
        {"k": k, "P_2k": sum((abs(value) ** (2 * k) for value in prime), Fraction(0))}
        for k in range(1, 5)
    ]
    localized_upper_one = max(value * value for value in prime)
    if (
        locked != [Fraction(-3), Fraction(3)]
        or flipped != [Fraction(13), Fraction(7)]
        or localized_upper_one != 16
        or [record["P_2k"] for record in moments]
        != [Fraction(4 ** (2 * k) + 1) for k in range(1, 5)]
    ):
        raise ValueError("absolute-prime-sign countermodel failed")
    return {
        "absolute_prime_sign": {
            "atom_weights": [Fraction(1), Fraction(1)],
            "archimedean_b": arch,
            "prime_S": prime,
            "locked_b_minus_2S": locked,
            "sign_flipped_b_plus_2S": flipped,
            "locked_lower_one": min(locked),
            "sign_flipped_lower_one": min(flipped),
            "localized_upper_one_S_squared": localized_upper_one,
            "absolute_even_prime_moments": moments,
            "absolute_moments_identical_under_prime_sign_flip": True,
            "prime_sign_determined_by_absolute_moments": False,
        },
    }


def _projection_rank_model() -> dict[str, Any]:
    lifted = [
        [Fraction(1), Fraction(0), Fraction(1)],
        [Fraction(0), Fraction(1), Fraction(1)],
        [Fraction(1), Fraction(2), Fraction(4)],
    ]
    projected = [
        [Fraction(1), Fraction(0), Fraction(1)],
        [Fraction(0), Fraction(1), Fraction(1)],
        [Fraction(0), Fraction(0), Fraction(0)],
    ]
    witness = [[Fraction(1)], [Fraction(1)], [Fraction(-1)]]
    source_gram = _diag(Fraction(2), Fraction(3), Fraction(5))
    projected_action = _matmul(projected, witness)
    lifted_action = _matmul(lifted, witness)
    corrected = _matmul(_matmul(projected, _inverse(source_gram)), _transpose(projected))
    if (
        _determinant(lifted) != 1 or _rank(lifted) != 3
        or _rank(projected) != 2
        or projected_action != [[Fraction(0)], [Fraction(0)], [Fraction(0)]]
        or lifted_action == [[Fraction(0)], [Fraction(0)], [Fraction(0)]]
        or _determinant(corrected) != 0
    ):
        raise ValueError("continuous/projected rank countermodel failed")
    return {
        "N": 3,
        "source_dimension_r": 3,
        "source_gram_B": source_gram,
        "lifted_columns": lifted,
        "lifted_determinant": _determinant(lifted),
        "lifted_rank": _rank(lifted),
        "projected_first_two_coordinate_columns": projected,
        "projected_rank": _rank(projected),
        "projected_source_gram_corrected_frame": corrected,
        "right_null_witness": witness,
        "projected_witness_action": projected_action,
        "lifted_witness_action": lifted_action,
        "continuous_injectivity_implies_projected_row_rank": False,
    }


def _validate_admissions() -> None:
    if (
        not isinstance(SOURCE_ADMISSIONS, dict)
        or any(type(value) is not bool for value in SOURCE_ADMISSIONS.values())
        or any(SOURCE_ADMISSIONS.values())
    ):
        raise ValueError("source admission violates the claim boundary")


def produce(lambda_numerator: int, dps: int) -> dict[str, Any]:
    p = _integer(lambda_numerator, "lambda_numerator", 5)
    precision = _integer(dps, "dps", 50)
    if p % 2 == 0:
        raise ValueError("lambda_numerator must be odd")
    _validate_admissions()
    source_lock = _validated_source_lock()
    transition, q, interval_data = _interval_data(p, precision)
    schedule = _schedule(p, q, transition)
    coframe = _coframe_fixtures()
    moments = _centered_moment_floors()
    one_sided = _one_sided_floor(interval_data["one_sided"])
    countermodels = _countermodels()
    projection = _projection_rank_model()
    checks = {
        "matched_counts_reconstructed": (
            schedule["r_plus_buffered"] >= schedule["N"]
            and schedule["r_minus_buffered"] >= schedule["N"] + 1
        ),
        "count_not_promoted_to_rank": (
            not schedule["buffered_count_forces_plus_row_rank"]
            and not schedule["buffered_count_forces_minus_row_rank"]
        ),
        "full_source_floor_reconstructed": _full_source(p)["row_floor_one_over_8_lambda_fourth"] == Fraction(2, p**4),
        "source_grams_retained": (
            coframe["normalized_minor_pass"]["source_gram_B"] != _identity(2)
            and coframe["zero_minor_rejection"]["source_gram_B"] != _identity(2)
        ),
        "positive_normalized_minor_floor_reconstructed": coframe["normalized_minor_pass"]["relative_minor_gamma"] > 0,
        "zero_minor_rejected": not coframe["zero_minor_rejection"]["passes"],
        "centered_moments_k_1_through_4_reconstructed": all(
            len(moments[name]["moments"]) == 4
            for name in ("sharp_bad", "moment_twin_good", "positive_sharp")
        ),
        "same_even_moment_sign_obstruction_reconstructed": moments[
            "same_even_moments_do_not_determine_lower_sign"
        ]["same_C_2k_for_k_1_through_4"],
        "one_sided_positive_interval_reconstructed": one_sided["strictly_positive"],
        "absolute_prime_sign_countermodel_reconstructed": not countermodels[
            "absolute_prime_sign"
        ]["prime_sign_determined_by_absolute_moments"],
        "continuous_injective_projected_rank_countermodel_reconstructed": (
            projection["lifted_rank"] == 3 and projection["projected_rank"] == 2
        ),
        "odd_pole_interval_positive": interval_data["pole"]["positivity"],
        "odd_pole_angle_is_only_necessary": "not a sufficient" in interval_data["pole"]["logical_role"],
    }
    if not all(checks.values()):
        raise ValueError("matched high-moment/coframe theorem check failed")

    payload = _encode({
        "schema": SCHEMA,
        "source_lock": source_lock,
        "inputs": {
            "lambda_numerator": p,
            "lambda_denominator": 2,
            "dps": precision,
        },
        "terminal_state": TERMINAL_STATE,
        "source_conventions": {
            "locked_conventions": LOCKED_CONVENTIONS,
            "locked_formulas": LOCKED_FORMULAS,
        },
        "claim_boundary": {
            "claim_class": CLAIM_CLASS,
            "proved": CLAIM_SCOPE["proved"],
            "not_proved": CLAIM_SCOPE["not_proved"],
            "source_admissions": SOURCE_ADMISSIONS,
        },
        "certificate": {
            "schedule": schedule,
            "full_source": _full_source(p),
            "coframe_fixtures": coframe,
            "centered_moment_floors": moments,
            "one_sided_floor": one_sided,
            "countermodels": countermodels,
            "projection_rank_model": projection,
            "odd_pole_intervals": interval_data["pole"],
            "checks": checks,
        },
        "arithmetic_libraries": ARITHMETIC_LIBRARIES,
    })
    _assert_strict_json(payload)
    return payload


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lambda-numerator", type=int, required=True)
    parser.add_argument("--dps", type=int, required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    payload = produce(args.lambda_numerator, args.dps)
    _assert_strict_json(payload)
    Path(args.output).write_text(
        json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
