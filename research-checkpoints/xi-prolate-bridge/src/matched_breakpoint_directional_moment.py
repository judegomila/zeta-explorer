#!/usr/bin/env python3
"""Produce the matched breakpoint/directional-moment audit certificate.

The certificate contains exact rational theorem regressions and outward
interval evaluations of the pinned pole and breakpoint formulas.  It does
not assemble a physical prolate or Weil matrix and proves no asymptotic
sector statement.
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


SCHEMA = "xi-prolate-matched-breakpoint-directional-moment-v1"
LOCK = "MATCHED_BREAKPOINT_DIRECTIONAL_MOMENT_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-matched-breakpoint-directional-moment-source-lock-v1"
CLAIM_CLASS = "MATCHED_BREAKPOINT_DIRECTIONAL_MOMENT_AUDIT"
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
    "MATCHED_HIGH_MOMENT_COFRAME_SOURCE_LOCK.json",
    "notes/MATCHED_HIGH_MOMENT_COFRAME_REDUCTION.md",
    "FULL_SOURCE_COFRAME_RANK_SOURCE_LOCK.json",
    "notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md",
    "PHYSICAL_SOFT_SHORT_SIGNED_SCHUR_SOURCE_LOCK.json",
    "notes/PHYSICAL_SOFT_SHORT_SIGNED_SCHUR.md",
    "notes/GROWING_WINDOW_THEOREM.md",
    "requirements.txt",
    "notes/MATCHED_BREAKPOINT_DIRECTIONAL_MOMENT_AUDIT.md",
}

LOCKED_CONVENTIONS = {
    "source_interval": "[-lambda,lambda] with Lebesgue measure and zero extension; every prolate source retains its zero-Lebesgue-integral source normalization and full source Gram",
    "physical_interval": "I_lambda=[-log(lambda),log(lambda)] with Lebesgue measure in logarithmic coordinates, equivalently du/u on [lambda^(-1),lambda]",
    "fourier_sign": "fhat(t)=integral f(x)*exp(-i*t*x)dx with Plancherel measure dt/(2*pi)",
    "centered_modes": "phi_n(x)=(-1)^n*L^(-1/2)*exp(i*omega_n*x), omega_n=2*pi*n/L, L=2*log(lambda)",
    "matched_schedule": "lambda=p/2 for odd p>=5 and N=ceil(lambda^2)=(p^2+3)/4; floor(lambda^2)=N-1",
    "prime_endpoint": "every prime power n<=lambda^2 is retained; this cutoff is distinct from the arithmetic index a<=floor(lambda^2)",
    "prime_sign": "m_lambda=2*theta_prime-2*sum_(n<=lambda^2) Lambda(n)/sqrt(n)*cos(t*log(n))",
    "inversion": "J is reflection in logarithmic coordinates; Fourier residue classes are not substituted for inversion parity",
    "pole_signs": "p_plus(x)=cosh(x/2) is positive rank one and p_minus(x)=sinh(x/2) is negative rank one in the complete signed high operator",
    "strictness": "equality at a target floor, rank-one load one, zero determinant, or nonpositive reserve is rejected",
    "artifact_scope": "exact finite-dimensional regressions and outward source-formula intervals, not a physical prolate-Weil matrix, matched coframe, or asymptotic theorem",
    "arithmetic": "finite fixtures use exact reduced rationals; logarithms, pi, square roots, pole projections, and breakpoint determinants use outward mpmath.iv intervals; binary64 JSON numbers are forbidden",
}

LOCKED_FORMULAS = {
    "moment_floor": "if A<=M*I and trace((M*I-A)^r)<=d*(M-nu*L)^r then lambda_min(A)>=M-d^(1/r)*(M-nu*L)",
    "moment_threshold": "a strict floor mu*L requires r>log(d)/log((M-mu*L)/(M-nu*L)); equality is rejected",
    "positive_pole_centered": "for A_plus=alpha*L*I+P*|u><u| the sharp centered-moment bound equals alpha*L-P*(d-2)/d at every order",
    "positive_pole_coefficient": "<phi_n,p_plus>=sinh(ell/2)/(sqrt(L)*(omega_n^2+1/4))",
    "positive_pole_projection": "norm(P_N*p_plus)^2=sinh(ell/2)^2/L*(16+2*sum_(n=1)^N(omega_n^2+1/4)^(-2))",
    "positive_pole_lower": "norm(P_N*p_plus)^2>=sinh(ell)+ell-L^3*sinh(ell/2)^2/(24*pi^4*N^3)",
    "odd_rank_one": "M-2*|p><p|>0 iff 2*<p,M^(-1)*p><1; load<=1-delta implies M-2*|p><p|>=delta*M",
    "neumann_identity": "for R=I-M/(c*L), M^(-1)=(c*L)^(-1)*sum_(j=0)^(s-1)R^j+R^s*M^(-1)",
    "directional_bound": "2*<p,M^(-1)*p><=(2/(c*L))*sum_(j=0)^(s-1)<p,R^j*p>+(2*norm(p)^2/(a*L))*(1-a/c)^s",
    "arithmetic_row": "K_n(y)=(-1)^n*L^(-1/2)*y^(-1/2-i*omega_n)*sum_(a<=lambda*y)a^(-1/2+i*omega_n)",
    "breakpoint_jump": "[K_n^(r)]_(m/lambda)=sqrt(lambda/L)*(-lambda)^r*m^(-r-1)*(1/2+i*omega_n)_r",
    "parity_projection": "h_j=(I-P_(N,s))*q_j retains every interior jump of q_j and obeys P_(N,s)*h_j=0 by idempotence",
}

CLAIM_SCOPE = {
    "proved": [
        "the sharp strict one-sided moment-order conversion and exact boundary/below-boundary regression models",
        "the exact positive-pole centered-moment obstruction at every tested order",
        "the exact odd rank-one criterion and a rational finite Neumann/directional-moment regression",
        "the exact matched positive-pole Fourier projection formula and outward lower interval",
        "the exact centered arithmetic-row derivative-jump formula and small nonzero parity confluent determinants",
        "the parity-projection idempotence countermodel at the finite algebra level",
    ],
    "not_proved": [
        "an O(L) physical spectral-width bound for either matched high multiplier",
        "the physical source trace inequality at logarithmically growing order",
        "the strict physical directional reserve for the odd rank-one criterion",
        "a nonzero normalized physical prolate minor or matched coframe floor",
        "a positive complete signed floor in either inversion sector",
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
    "determinant_limit_claimed": False,
    "environment_secret_read": False,
    "equation_5_2_claimed": False,
    "finite_breakpoint_fixture_promoted_to_matched_coframe": False,
    "finite_fourier_residue_declared_inversion_parity": False,
    "global_weil_positivity_assumed": False,
    "inversion_reflection_dropped": False,
    "lambda_squared_mixed_with_lambda": False,
    "moment_conversion_promoted_to_physical_source_estimate": False,
    "nonpositive_floor_reported_as_pass": False,
    "odd_negative_pole_omitted": False,
    "physical_coframe_claimed": False,
    "positive_pole_centered_obstruction_ignored": False,
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
    "precision_mode": "exact reduced rationals plus outward arbitrary-precision intervals",
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


def _identity(size: int) -> Matrix:
    return [[Fraction(i == j) for j in range(size)] for i in range(size)]


def _diag(*values: Fraction) -> Matrix:
    return [[value if i == j else Fraction(0) for j in range(len(values))]
            for i, value in enumerate(values)]


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


def _outer(column: list[Fraction]) -> Matrix:
    return [[left * right for right in column] for left in column]


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


def _matrix_power(matrix: Matrix, exponent: int) -> Matrix:
    if exponent < 0:
        raise ValueError("matrix power must be nonnegative")
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ValueError("matrix power requires a square matrix")
    result = _identity(rows)
    base = matrix
    power = exponent
    while power:
        if power & 1:
            result = _matmul(result, base)
        base = _matmul(base, base)
        power //= 2
    return result


def _determinant(matrix: Matrix) -> Fraction:
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ValueError("determinant requires a square matrix")
    work = [row[:] for row in matrix]
    result = Fraction(1)
    for column in range(rows):
        pivot = next((row for row in range(column, rows) if work[row][column]), None)
        if pivot is None:
            return Fraction(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            result = -result
        value = work[column][column]
        result *= value
        for row in range(column + 1, rows):
            ratio = work[row][column] / value
            for index in range(column + 1, rows):
                work[row][index] -= ratio * work[column][index]
    return result


def _principal_minors(matrix: Matrix) -> list[Fraction]:
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ValueError("principal minors require a square matrix")
    return [
        _determinant([[matrix[i][j] for j in indices] for i in indices])
        for size in range(1, rows + 1)
        for indices in itertools.combinations(range(rows), size)
    ]


def _quadratic(column: list[Fraction], matrix: Matrix) -> Fraction:
    vector = [[entry] for entry in column]
    return _matmul(_matmul(_transpose(vector), matrix), vector)[0][0]


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


def _interval_overlaps(left: object, right: object) -> bool:
    left_lo, left_hi = _capture(left)
    right_lo, right_hi = _capture(right)
    return left_lo <= right_hi and right_lo <= left_hi


def _iv_det3(matrix: list[list[object]]) -> object:
    a, b, c = matrix[0]
    d, e, f = matrix[1]
    g, h, i = matrix[2]
    return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g)


def _iv_pochhammer(omega: object, order: int) -> tuple[object, object]:
    real = mp.iv.mpf(1)
    imag = mp.iv.mpf(0)
    for index in range(order):
        scalar = mp.iv.mpf(2 * index + 1) / mp.iv.mpf(2)
        real, imag = real * scalar - imag * omega, real * omega + imag * scalar
    return real, imag


def _schedule(p: int) -> dict[str, Any]:
    n = (p * p + 3) // 4
    return {
        "lambda": Fraction(p, 2),
        "N": n,
        "N_rule": "ceil(lambda^2)",
        "floor_lambda_squared": n - 1,
        "arithmetic_indices": {"first": 1, "last": n - 1, "count": n - 1},
        "prime_endpoint_rule": "all prime powers n<=lambda^2; distinct from the arithmetic index inventory",
        "full_matched_breakpoint_determinant_computed": False,
    }


def _moment_threshold_sharpness() -> dict[str, Any]:
    dimension = 4
    length = Fraction(1)
    mu = Fraction(0)
    nu = Fraction(1)
    cap = Fraction(2)
    ratio = (cap - mu * length) / (cap - nu * length)
    boundary_order = 2
    least_strict_order = 3
    boundary = [Fraction(0), cap, cap, cap]
    below = [Fraction(-1), cap, cap, cap]
    passing = [Fraction(1), cap, cap, cap]

    def record(diagonal: list[Fraction], order: int) -> dict[str, Any]:
        deficits = [cap - value for value in diagonal]
        moment = sum((value**order for value in deficits), Fraction(0))
        source_cap = dimension * (cap - nu * length) ** order
        strict_power_test = source_cap < (cap - mu * length) ** order
        return {
            "A": _diag(*diagonal),
            "order": order,
            "deficits_M_minus_A": deficits,
            "trace_deficit_power": moment,
            "source_moment_cap": source_cap,
            "source_moment_hypothesis": moment <= source_cap,
            "strict_target_power_test": strict_power_test,
            "actual_minimum": min(diagonal),
        }

    boundary_record = record(boundary, boundary_order)
    below_record = record(below, 1)
    passing_record = record(passing, least_strict_order)
    if (
        ratio != 2
        or dimension != ratio**boundary_order
        or boundary_record["trace_deficit_power"] != boundary_record["source_moment_cap"]
        or boundary_record["actual_minimum"] != mu * length
        or not below_record["source_moment_hypothesis"]
        or below_record["actual_minimum"] >= mu * length
        or not passing_record["source_moment_hypothesis"]
        or not passing_record["strict_target_power_test"]
        or passing_record["actual_minimum"] <= mu * length
    ):
        raise ValueError("moment threshold sharpness regression failed")
    return {
        "dimension_d": dimension,
        "L": length,
        "mu": mu,
        "nu": nu,
        "M": cap,
        "threshold_ratio": ratio,
        "exact_identity_d_equals_ratio_power": {"power": boundary_order, "holds": True},
        "r_star": boundary_order,
        "least_integer_strict_order": least_strict_order,
        "boundary_equality_rejected": boundary_record,
        "below_threshold_counterexample": below_record,
        "strict_order_pass_model": passing_record,
    }


def _positive_pole_centered_obstruction() -> dict[str, Any]:
    dimension = 3
    alpha_length = Fraction(1)
    pole_width = Fraction(6)
    diagonal = [alpha_length + pole_width, alpha_length, alpha_length]
    mean = sum(diagonal, Fraction(0)) / dimension
    centered = [value - mean for value in diagonal]
    expected_bound = alpha_length - pole_width * Fraction(dimension - 2, dimension)
    moments: list[dict[str, Any]] = []
    for k in range(1, 5):
        degree = 2 * k
        moment = sum((value**degree for value in centered), Fraction(0))
        denominator = Fraction(1) + Fraction(1, (dimension - 1) ** (degree - 1))
        radius_power = moment / denominator
        if radius_power != Fraction(4) ** degree:
            raise ValueError("positive-pole centered radius is not the exact fixture power")
        bound = mean - Fraction(4)
        moments.append({
            "k": k,
            "degree": degree,
            "C_2k": moment,
            "complete_sign_denominator": denominator,
            "radius_power": radius_power,
            "exact_radius": Fraction(4),
            "centered_lower_bound": bound,
            "matches_order_independent_formula": bound == expected_bound,
        })
    if min(diagonal) != 1 or expected_bound != -1 or not all(
        item["matches_order_independent_formula"] for item in moments
    ):
        raise ValueError("positive-pole centered obstruction regression failed")
    return {
        "dimension_d": dimension,
        "alpha_times_L": alpha_length,
        "positive_pole_width_P": pole_width,
        "unit_pole_direction": [Fraction(1), Fraction(0), Fraction(0)],
        "A_plus": _diag(*diagonal),
        "actual_minimum": min(diagonal),
        "mean": mean,
        "centered_diagonal": centered,
        "order_independent_centered_bound": expected_bound,
        "moments_k_1_through_4": moments,
        "positive_matrix_has_negative_centered_bound_at_every_tested_order": True,
        "one_sided_exact_upper_endpoint": max(diagonal),
        "one_sided_deficit_moment_formula": "trace((7*I-A_plus)^r)=2*6^r",
    }


def _rank_one_neumann_algebra() -> dict[str, Any]:
    pass_m = _diag(Fraction(4), Fraction(2))
    pass_p = [Fraction(1), Fraction(0)]
    pass_load = 2 * _quadratic(pass_p, _inverse(pass_m))
    pass_a = _sub(pass_m, _scale(Fraction(2), _outer(pass_p)))
    delta = Fraction(1, 2)
    pass_reserve = _sub(pass_a, _scale(delta, pass_m))

    boundary_m = _diag(Fraction(2), Fraction(3))
    boundary_p = [Fraction(1), Fraction(0)]
    boundary_load = 2 * _quadratic(boundary_p, _inverse(boundary_m))
    boundary_a = _sub(boundary_m, _scale(Fraction(2), _outer(boundary_p)))

    a = Fraction(1)
    c = Fraction(2)
    length = Fraction(1)
    neumann_m = _diag(Fraction(1), Fraction(3, 2))
    neumann_p = [Fraction(1, 4), Fraction(1, 4)]
    neumann_r = _sub(_identity(2), _scale(Fraction(1, 2), neumann_m))
    rho = Fraction(1, 2)
    order = 3
    series = _diag(Fraction(0), Fraction(0))
    directional: list[Fraction] = []
    for j in range(order):
        power = _matrix_power(neumann_r, j)
        series = _add(series, power)
        directional.append(_quadratic(neumann_p, power))
    exact_inverse_rhs = _add(
        _scale(Fraction(1, 2), series),
        _matmul(_matrix_power(neumann_r, order), _inverse(neumann_m)),
    )
    true_load = 2 * _quadratic(neumann_p, _inverse(neumann_m))
    truncated = Fraction(2, 2) * sum(directional, Fraction(0))
    norm_squared = sum((entry * entry for entry in neumann_p), Fraction(0))
    remainder_upper = Fraction(2) * norm_squared / (a * length) * rho**order
    directional_upper = truncated + remainder_upper
    neumann_delta = Fraction(3, 4)
    neumann_a = _sub(neumann_m, _scale(Fraction(2), _outer(neumann_p)))
    neumann_floor_reserve = _sub(
        neumann_a, _scale(neumann_delta * a * length, _identity(2))
    )

    if (
        pass_load != Fraction(1, 2)
        or min(_principal_minors(pass_reserve)) < 0
        or boundary_load != 1
        or _determinant(boundary_a) != 0
        or neumann_r != _diag(Fraction(1, 2), Fraction(1, 4))
        or exact_inverse_rhs != _inverse(neumann_m)
        or true_load != Fraction(5, 24)
        or truncated != Fraction(49, 256)
        or remainder_upper != Fraction(1, 32)
        or directional_upper != Fraction(57, 256)
        or directional_upper > 1 - neumann_delta
        or min(_principal_minors(neumann_floor_reserve)) <= 0
    ):
        raise ValueError("rank-one/Neumann regression failed")
    return {
        "rank_one_strict_pass": {
            "M": pass_m,
            "p": pass_p,
            "load_2_p_M_inverse_p": pass_load,
            "delta": delta,
            "A_minus": pass_a,
            "A_minus_minus_delta_M": pass_reserve,
            "reserve_principal_minors": _principal_minors(pass_reserve),
        },
        "rank_one_equality_rejection": {
            "M": boundary_m,
            "p": boundary_p,
            "load_2_p_M_inverse_p": boundary_load,
            "A_minus": boundary_a,
            "A_minus_determinant": _determinant(boundary_a),
            "strict_pass": False,
        },
        "directional_neumann": {
            "a": a,
            "c": c,
            "L": length,
            "M": neumann_m,
            "p": neumann_p,
            "R": neumann_r,
            "rho": rho,
            "order_s": order,
            "powers_R_0_through_s": [_matrix_power(neumann_r, j) for j in range(order + 1)],
            "directional_moments_p_Rj_p": directional,
            "finite_geometric_sum": series,
            "inverse_direct": _inverse(neumann_m),
            "inverse_from_finite_Neumann_identity": exact_inverse_rhs,
            "true_rank_one_load": true_load,
            "truncated_directional_sum": truncated,
            "remainder_upper": remainder_upper,
            "directional_load_upper": directional_upper,
            "delta": neumann_delta,
            "one_minus_delta": 1 - neumann_delta,
            "A_minus": neumann_a,
            "A_minus_minus_delta_a_L_I": neumann_floor_reserve,
            "floor_reserve_principal_minors": _principal_minors(neumann_floor_reserve),
        },
    }


def _parity_projection_idempotence() -> dict[str, Any]:
    inversion = _diag(Fraction(1), Fraction(1), Fraction(-1), Fraction(-1))
    p_plus = _diag(Fraction(1), Fraction(0), Fraction(0), Fraction(0))
    p_minus = _diag(Fraction(0), Fraction(0), Fraction(1), Fraction(0))
    identity = _identity(4)
    plus_seed = [[Fraction(2)], [Fraction(3)], [Fraction(0)], [Fraction(0)]]
    minus_seed = [[Fraction(0)], [Fraction(0)], [Fraction(2)], [Fraction(3)]]
    plus_tail = _matmul(_sub(identity, p_plus), plus_seed)
    minus_tail = _matmul(_sub(identity, p_minus), minus_seed)
    zero = [[Fraction(0)] for _ in range(4)]
    if (
        _matmul(p_plus, p_plus) != p_plus
        or _matmul(p_minus, p_minus) != p_minus
        or _matmul(p_plus, plus_tail) != zero
        or _matmul(p_minus, minus_tail) != zero
        or _matmul(inversion, plus_tail) != plus_tail
        or _matmul(inversion, minus_tail) != _scale(Fraction(-1), minus_tail)
    ):
        raise ValueError("parity projection idempotence regression failed")
    return {
        "parity_operator_J": inversion,
        "finite_even_projection": p_plus,
        "finite_odd_projection": p_minus,
        "even_projection_squared": _matmul(p_plus, p_plus),
        "odd_projection_squared": _matmul(p_minus, p_minus),
        "even_seed": plus_seed,
        "odd_seed": minus_seed,
        "even_tail_h_equals_I_minus_P_q": plus_tail,
        "odd_tail_h_equals_I_minus_P_q": minus_tail,
        "even_projected_tail": _matmul(p_plus, plus_tail),
        "odd_projected_tail": _matmul(p_minus, minus_tail),
        "even_parity_action": _matmul(inversion, plus_tail),
        "odd_parity_action": _matmul(inversion, minus_tail),
        "declared_jump_jet_matrix_preserved_by_smooth_projection": _identity(2),
        "function_level_scope": "finite exact algebra replay of P*(I-P)=0 and parity preservation; no prolate source is inferred",
    }


def _positive_pole_intervals(p: int, dps: int) -> dict[str, Any]:
    n_max = (p * p + 3) // 4
    lam = mp.iv.mpf(p) / mp.iv.mpf(2)
    ell = mp.iv.log(lam)
    length = mp.iv.mpf(2) * ell
    sinh_ell = mp.iv.mpf(p * p - 4) / mp.iv.mpf(4 * p)
    sinh_half_squared = mp.iv.mpf((p - 2) ** 2) / mp.iv.mpf(8 * p)
    sinh_half = mp.iv.sqrt(sinh_half_squared)
    total_norm = sinh_ell + ell
    projection_sum = mp.iv.mpf(16)
    coefficients: dict[str, Any] = {}
    selected = {0, 1, n_max}
    for n in range(n_max + 1):
        omega = mp.iv.mpf(2 * n) * mp.iv.pi / length
        denominator = omega * omega + mp.iv.mpf(1) / mp.iv.mpf(4)
        coefficient = sinh_half / (mp.iv.sqrt(length) * denominator)
        if n in selected:
            coefficients[str(n)] = _serialize_interval(coefficient, dps)
        if n:
            projection_sum += mp.iv.mpf(2) / (denominator * denominator)
    projection = sinh_half_squared * projection_sum / length
    tail_upper = (
        length**3 * sinh_half_squared
        / (mp.iv.mpf(24) * mp.iv.pi**4 * mp.iv.mpf(n_max**3))
    )
    lower_bound = total_norm - tail_upper
    lower_lo, _lower_hi = _capture(lower_bound)
    projection_lo, _projection_hi = _capture(projection)
    if lower_lo <= 0 or projection_lo <= 0:
        raise ArithmeticError("positive-pole projection interval is not strictly positive")
    return {
        "ell": _serialize_interval(ell, dps),
        "L": _serialize_interval(length, dps),
        "sinh_ell_exact": Fraction(p * p - 4, 4 * p),
        "sinh_half_squared_exact": Fraction((p - 2) ** 2, 8 * p),
        "selected_coefficients_n_0_1_N": coefficients,
        "ambient_norm_squared": _serialize_interval(total_norm, dps),
        "matched_projection_norm_squared": _serialize_interval(projection, dps),
        "projection_tail_upper": _serialize_interval(tail_upper, dps),
        "projection_lower_bound": _serialize_interval(lower_bound, dps),
        "projection_lower_bound_strictly_positive": True,
        "physical_high_angle_inferred": False,
    }


def _breakpoint_intervals(p: int, dps: int) -> dict[str, Any]:
    fixture_dimension = 3
    breakpoint_index = 2
    lam = mp.iv.mpf(p) / mp.iv.mpf(2)
    length = mp.iv.mpf(2) * mp.iv.log(lam)
    omega = [mp.iv.mpf(2 * n) * mp.iv.pi / length for n in range(4)]
    plus_orders = [0, 2, 4]
    odd_orders = [1, 3, 5]
    plus_matrix: list[list[object]] = []
    odd_matrix: list[list[object]] = []
    for order in plus_orders:
        row: list[object] = []
        for n in range(3):
            real, _imag = _iv_pochhammer(omega[n], order)
            base = mp.iv.sqrt(lam / length) * (-lam) ** order / mp.iv.mpf(
                breakpoint_index ** (order + 1)
            )
            row.append(base * real if n == 0 else mp.iv.sqrt(mp.iv.mpf(2)) * base * real)
        plus_matrix.append(row)
    for order in odd_orders:
        row = []
        for n in range(1, 4):
            _real, imag = _iv_pochhammer(omega[n], order)
            base = mp.iv.sqrt(mp.iv.mpf(2) * lam / length) * (-lam) ** order / mp.iv.mpf(
                breakpoint_index ** (order + 1)
            )
            row.append(base * imag)
        odd_matrix.append(row)

    plus_direct = _iv_det3(plus_matrix)
    odd_direct = _iv_det3(odd_matrix)
    plus_formula = mp.iv.mpf(1) / mp.iv.sqrt(mp.iv.mpf(2))
    for k in range(fixture_dimension):
        plus_formula *= (
            mp.iv.sqrt(mp.iv.mpf(2) * lam / length)
            * lam ** (2 * k) / mp.iv.mpf(breakpoint_index ** (2 * k + 1))
        )
    plus_formula *= mp.iv.mpf(-1)
    for i in range(3):
        for j in range(i + 1, 3):
            plus_formula *= omega[j] ** 2 - omega[i] ** 2

    odd_formula = mp.iv.mpf(1)
    for k in range(fixture_dimension):
        odd_formula *= (
            mp.iv.sqrt(mp.iv.mpf(2) * lam / length)
            * (-lam) ** (2 * k + 1)
            / mp.iv.mpf(breakpoint_index ** (2 * k + 2))
        )
    odd_formula *= mp.iv.mpf(-1)
    for n in range(1, 4):
        odd_formula *= omega[n]
    for i in range(1, 4):
        for j in range(i + 1, 4):
            odd_formula *= omega[j] ** 2 - omega[i] ** 2

    plus_lo, plus_hi = _capture(plus_direct)
    odd_lo, odd_hi = _capture(odd_direct)
    if (
        plus_lo <= 0 <= plus_hi
        or odd_lo <= 0 <= odd_hi
        or not _interval_overlaps(plus_direct, plus_formula)
        or not _interval_overlaps(odd_direct, odd_formula)
    ):
        raise ArithmeticError("breakpoint determinant interval failed")
    value_jump = mp.iv.sqrt(lam / length) / mp.iv.mpf(breakpoint_index)
    return {
        "fixture_dimension": fixture_dimension,
        "breakpoint_index_m": breakpoint_index,
        "breakpoint_y_m": _serialize_interval(mp.iv.mpf(breakpoint_index) / lam, dps),
        "breakpoint_is_interior": True,
        "raw_value_jump_independent_of_n": _serialize_interval(value_jump, dps),
        "plus_rows_n": [0, 1, 2],
        "plus_derivative_orders": plus_orders,
        "plus_jump_matrix": [[_serialize_interval(value, dps) for value in row] for row in plus_matrix],
        "plus_determinant_direct": _serialize_interval(plus_direct, dps),
        "plus_determinant_vandermonde": _serialize_interval(plus_formula, dps),
        "plus_formula_overlap": True,
        "plus_determinant_excludes_zero": True,
        "odd_rows_n": [1, 2, 3],
        "odd_derivative_orders": odd_orders,
        "odd_basis_global_sign": "positive imaginary-part convention in equation (7.11)",
        "odd_jump_matrix": [[_serialize_interval(value, dps) for value in row] for row in odd_matrix],
        "odd_determinant_direct": _serialize_interval(odd_direct, dps),
        "odd_determinant_vandermonde": _serialize_interval(odd_formula, dps),
        "odd_formula_overlap": True,
        "odd_determinant_excludes_zero": True,
        "full_matched_dimension_claimed": False,
        "prolate_moment_minor_inferred": False,
    }


def _interval_data(p: int, dps: int) -> dict[str, Any]:
    if f"mpmath.iv {mp.__version__}" != EXPECTED_LIBRARY:
        raise RuntimeError("pinned mpmath.iv version is not active")
    old = mp.iv.dps
    try:
        mp.iv.dps = dps
        return {
            "positive_pole": _positive_pole_intervals(p, dps),
            "breakpoint": _breakpoint_intervals(p, dps),
        }
    finally:
        mp.iv.dps = old


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
    if p > 999:
        raise ValueError("lambda_numerator exceeds the producer work budget")
    if precision > 10000:
        raise ValueError("dps exceeds the producer work budget")
    if p % 2 == 0:
        raise ValueError("lambda_numerator must be odd")
    _validate_admissions()
    source_lock = _validated_source_lock()
    schedule = _schedule(p)
    threshold = _moment_threshold_sharpness()
    positive_pole = _positive_pole_centered_obstruction()
    rank_one = _rank_one_neumann_algebra()
    parity = _parity_projection_idempotence()
    intervals = _interval_data(p, precision)
    checks = {
        "matched_schedule_reconstructed": schedule["floor_lambda_squared"] == schedule["N"] - 1,
        "moment_threshold_boundary_rejected": (
            threshold["boundary_equality_rejected"]["actual_minimum"] == threshold["mu"] * threshold["L"]
        ),
        "below_threshold_counterexample_reconstructed": (
            threshold["below_threshold_counterexample"]["source_moment_hypothesis"]
            and threshold["below_threshold_counterexample"]["actual_minimum"] < threshold["mu"] * threshold["L"]
        ),
        "positive_pole_centered_obstruction_reconstructed": (
            positive_pole["actual_minimum"] > 0
            and positive_pole["order_independent_centered_bound"] < 0
        ),
        "rank_one_equality_rejected": not rank_one["rank_one_equality_rejection"]["strict_pass"],
        "neumann_identity_exact": (
            rank_one["directional_neumann"]["inverse_direct"]
            == rank_one["directional_neumann"]["inverse_from_finite_Neumann_identity"]
        ),
        "directional_reserve_strict": (
            rank_one["directional_neumann"]["directional_load_upper"]
            < rank_one["directional_neumann"]["one_minus_delta"]
        ),
        "parity_projection_idempotence_exact": (
            parity["even_projection_squared"] == parity["finite_even_projection"]
            and parity["odd_projection_squared"] == parity["finite_odd_projection"]
        ),
        "positive_pole_projection_interval_positive": intervals["positive_pole"]["projection_lower_bound_strictly_positive"],
        "breakpoint_determinants_exclude_zero": (
            intervals["breakpoint"]["plus_determinant_excludes_zero"]
            and intervals["breakpoint"]["odd_determinant_excludes_zero"]
        ),
        "finite_breakpoint_not_promoted_to_coframe": not intervals["breakpoint"]["prolate_moment_minor_inferred"],
    }
    if not all(checks.values()):
        raise ValueError("matched breakpoint/directional-moment audit check failed")

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
            "moment_threshold_sharpness": threshold,
            "positive_pole_centered_obstruction": positive_pole,
            "rank_one_neumann_algebra": rank_one,
            "parity_projection_idempotence": parity,
            "positive_pole_intervals": intervals["positive_pole"],
            "breakpoint_intervals": intervals["breakpoint"],
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
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(
        json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
