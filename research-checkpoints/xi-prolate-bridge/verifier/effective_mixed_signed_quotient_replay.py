#!/usr/bin/env python3
"""Independent replay for the bounded effective-mixed signed quotient.

The verifier does not import the producer.  It reconstructs the exact
fixtures with Gaussian determinants and polynomial interpolation, while the
producer uses cofactor and Leibniz expansions.  Transcendental nodes are
rebuilt from p and dps; producer matrices and Boolean promotions are never
trusted.
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


PRODUCER_SCHEMA = "xi-prolate-effective-mixed-signed-quotient-v1"
REPLAY_SCHEMA = "xi-prolate-effective-mixed-signed-quotient-replay-v1"
TERMINAL_STATE = "P0_INVALIDATED"
CHECKPOINT_VERSION = "0.43.0-effective-mixed-signed-quotient"
UPDATED_DATE = "2026-08-08"
EXPECTED_MPMATH_VERSION = "1.4.1"

CANONICAL_LAMBDA_NUMERATORS = {"5", "9"}
CANONICAL_DPS = {"80", "160"}
_POSITIVE_INTEGER_TEXT = re.compile(r"[1-9][0-9]*\Z")
_SECRET_VALUE = re.compile(
    r"(?:\bBearer\s+[A-Za-z0-9._-]+|\bsk-[A-Za-z0-9_-]{8,}|"
    r"\bgh[pousr]_[A-Za-z0-9_]{8,}|\bxox[baprs]-[A-Za-z0-9-]{8,}|"
    r"OPENAI_API_KEY\s*=)",
    re.IGNORECASE,
)

LOG2_10_UPPER_NUMERATOR = 3321928094887363
LOG2_10_UPPER_DENOMINATOR = 10**15

EXPECTED_DEPENDENCY_HASHES = {
    "notes/EFFECTIVE_MIXED_SIGNED_QUOTIENT_ATTACK.md": "e2e9485d8ee03717af790cb7740fbb2228cc96f04009698cdc51a7fd943634ea",
    "notes/EFFECTIVE_MIXED_PREFIX_SCHEDULE_ATTACK.md": "a33e7a072057f1444afb9d00911465f599fec508d0a6488e655638947cc515ba",
    "EFFECTIVE_MIXED_ENDPOINT_JUMP_SOURCE_LOCK.json": "24ea8f8085e9e198201006f54e0499495174053e38f6c26185cd2b2f60725fcc",
    "P0_SOURCE_LOCK.json": "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_MATRIX_FORMULAS.md": "73aa4d0a746bf1a553372d4c7bdc1c671cd69c9cc36682091d94731e1dac74dd",
    "requirements.txt": "458f06e2b5d6e73acc7a4f72af69afe920764c71127578555044815cd785c0fa",
}

EXPECTED_CONVENTIONS = {
    "source_interval": "[-lambda,lambda] with Lebesgue measure and zero extension",
    "physical_interval": "[-log(lambda),log(lambda)] with Lebesgue measure",
    "fourier_sign": "fhat(t)=integral f(x)*exp(-i*t*x)dx",
    "complete_operator": "pole+archimedean-prime",
    "prime_coefficient": "-1",
    "prime_endpoint": "every prime power n<=lambda^2 is retained",
    "inversion": "J is logarithmic reflection; source residue is not physical parity",
    "physical_shift_metric": "W^*W",
    "source_comparison_metric": "D=C^*C",
    "bridge_policy": "all bridge metric and signed cross terms are retained",
}

EXPECTED_CLAIM_BOUNDARY = {
    "whole_target_capture_proved_in_fixture": True,
    "normalized_quotient_isospectral_identity_checked": True,
    "rational_fixture_is_actual_finite_weil_matrix": False,
    "signed_weil_floor_proved": False,
    "defect_rayleigh_upper_test_is_lower_floor": False,
    "high_tail_source_metric_floor_is_signed_floor": False,
    "physical_floor_promoted_from_countermodel": False,
    "equation_5_2_proved": False,
    "locally_uniform_determinant_convergence_proved": False,
}

EXPECTED_LIBRARIES = {
    "precision_mode": "exact reduced rationals plus outward arbitrary-precision intervals",
    "libraries": ["Python fractions.Fraction", "mpmath.iv 1.4.1"],
    "shared_library_with_verifier": True,
    "independent_formula_trees_required": True,
    "raw_interval_or_ball_output_applicable": True,
    "serialization_guard": "nondegenerate intervals receive a precision-scaled dyadic enlargement",
    "independence_limitation": "producer and verifier share Python integer/Fraction arithmetic and pinned mpmath.iv 1.4.1",
}

Q = Fraction
Matrix = list[list[Fraction]]


class ReplayError(ValueError):
    """Raised when a producer payload fails independent reconstruction."""


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _require_keys(value: Any, keys: set[str], label: str) -> dict[str, Any]:
    if not isinstance(value, dict) or set(value) != keys:
        raise ReplayError(f"{label} key inventory mismatch")
    return value


def _reject_float_or_secret(value: Any, path: str = "root") -> None:
    if isinstance(value, float):
        raise ReplayError(f"binary64 value at {path}")
    if isinstance(value, str):
        if _SECRET_VALUE.search(value):
            raise ReplayError(f"secret-like value at {path}")
        return
    if value is None or type(value) in (bool, int):
        return
    if isinstance(value, list):
        for index, item in enumerate(value):
            _reject_float_or_secret(item, f"{path}[{index}]")
        return
    if isinstance(value, dict):
        if any(not isinstance(key, str) for key in value):
            raise ReplayError(f"non-string key at {path}")
        for key, item in value.items():
            _reject_float_or_secret(item, f"{path}.{key}")
        return
    raise ReplayError(f"unsupported value at {path}")


def _fraction(value: Any, label: str) -> Fraction:
    item = _require_keys(value, {"numerator", "denominator"}, label)
    numerator, denominator = item["numerator"], item["denominator"]
    if not isinstance(numerator, str) or not isinstance(denominator, str):
        raise ReplayError(f"non-text rational at {label}")
    try:
        result = Q(int(numerator), int(denominator))
    except (ValueError, ZeroDivisionError) as exc:
        raise ReplayError(f"invalid rational at {label}") from exc
    if str(result.numerator) != numerator or str(result.denominator) != denominator:
        raise ReplayError(f"noncanonical rational at {label}")
    return result


def _encode(value: Any) -> Any:
    if isinstance(value, Fraction):
        return {"numerator": str(value.numerator), "denominator": str(value.denominator)}
    if isinstance(value, (list, tuple)):
        return [_encode(item) for item in value]
    if isinstance(value, dict):
        return {str(key): _encode(item) for key, item in value.items()}
    return value


def _eye(size: int) -> Matrix:
    return [[Q(i == j) for j in range(size)] for i in range(size)]


def _diag(values: list[Fraction]) -> Matrix:
    return [[values[i] if i == j else Q(0) for j in range(len(values))] for i in range(len(values))]


def _transpose(matrix: Matrix) -> Matrix:
    return [[matrix[row][column] for row in range(len(matrix))] for column in range(len(matrix[0]))]


def _product(left: Matrix, right: Matrix) -> Matrix:
    result: Matrix = []
    for left_row in left:
        row: list[Fraction] = []
        for column in range(len(right[0])):
            row.append(sum((left_row[index] * right[index][column] for index in range(len(right))), Q(0)))
        result.append(row)
    return result


def _combine(left: Matrix, right: Matrix, right_scale: Fraction = Q(1)) -> Matrix:
    return [
        [left[i][j] + right_scale * right[i][j] for j in range(len(left[0]))]
        for i in range(len(left))
    ]


def _scalar(value: Fraction, matrix: Matrix) -> Matrix:
    return [[value * entry for entry in row] for row in matrix]


def _outer(vector: list[Fraction]) -> Matrix:
    return [[vector[row] * vector[column] for column in range(len(vector))] for row in range(len(vector))]


def _det_gaussian(matrix: Matrix) -> Fraction:
    size = len(matrix)
    if size == 0:
        return Q(1)
    work = [row[:] for row in matrix]
    sign = Q(1)
    determinant = Q(1)
    for column in range(size):
        pivot = next((row for row in range(column, size) if work[row][column] != 0), None)
        if pivot is None:
            return Q(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            sign = -sign
        pivot_value = work[column][column]
        determinant *= pivot_value
        for row in range(column + 1, size):
            factor = work[row][column] / pivot_value
            for j in range(column + 1, size):
                work[row][j] -= factor * work[column][j]
    return sign * determinant


def _solve(matrix: Matrix, vector: list[Fraction]) -> list[Fraction]:
    size = len(matrix)
    work = [matrix[i][:] + [vector[i]] for i in range(size)]
    for column in range(size):
        pivot = next((row for row in range(column, size) if work[row][column] != 0), None)
        if pivot is None:
            raise ReplayError("singular interpolation system")
        work[column], work[pivot] = work[pivot], work[column]
        scale = work[column][column]
        work[column] = [value / scale for value in work[column]]
        for row in range(size):
            if row == column:
                continue
            factor = work[row][column]
            work[row] = [value - factor * reference for value, reference in zip(work[row], work[column])]
    return [work[row][-1] for row in range(size)]


def _pencil_coefficients(left: Matrix, metric: Matrix) -> list[Fraction]:
    size = len(left)
    sample_points = [Q(index) for index in range(size + 1)]
    values = [
        _det_gaussian(_combine(left, _scalar(point, metric), Q(-1)))
        for point in sample_points
    ]
    vandermonde = [[point**power for power in range(size + 1)] for point in sample_points]
    return _solve(vandermonde, values)


def _principal(matrix: Matrix, indices: tuple[int, ...]) -> Matrix:
    return [[matrix[row][column] for column in indices] for row in indices]


def _principal_minors(matrix: Matrix) -> list[dict[str, Any]]:
    result: list[dict[str, Any]] = []
    for size in range(1, len(matrix) + 1):
        for indices in itertools.combinations(range(len(matrix)), size):
            result.append({
                "indices": [str(index) for index in indices],
                "determinant": _det_gaussian(_principal(matrix, indices)),
            })
    return result


def _inertia_data(matrix: Matrix) -> dict[str, Any]:
    leading = [_det_gaussian([row[:size] for row in matrix[:size]]) for size in range(1, len(matrix) + 1)]
    previous = Q(1)
    pivots: list[Fraction] = []
    for value in leading:
        if previous == 0:
            raise ReplayError("zero leading minor in fixed fixture")
        pivots.append(value / previous)
        previous = value
    if any(value == 0 for value in pivots):
        raise ReplayError("zero pivot in fixed fixture")
    return {
        "leading_principal_minors": leading,
        "ldl_pivots": pivots,
        "positive": sum(value > 0 for value in pivots),
        "negative": sum(value < 0 for value in pivots),
        "zero": 0,
    }


def _expected_whole_target() -> dict[str, Any]:
    pole = [[Q(2), Q(1), Q(0)], [Q(1), Q(1), Q(0)], [Q(0), Q(0), Q(0)]]
    arch = [[Q(3), Q(0), Q(1)], [Q(0), Q(2), Q(1)], [Q(1), Q(1), Q(4)]]
    prime = [[Q(1), Q(0), Q(1)], [Q(0), Q(4), Q(-1)], [Q(1), Q(-1), Q(1)]]
    complete = _combine(_combine(pole, arch), prime, Q(-1))
    tau = Q(2)
    shifted = _combine(complete, _scalar(tau, _eye(3)), Q(-1))
    unitary = [[Q(3, 5), Q(-4, 5), Q(0)], [Q(4, 5), Q(3, 5), Q(0)], [Q(0), Q(0), Q(-1)]]
    singular = _diag([Q(2), Q(3), Q(5)])
    a0 = _product(unitary, singular)
    gram = _product(_transpose(a0), a0)
    inverse_sqrt = _diag([Q(1, 2), Q(1, 3), Q(1, 5)])
    pullback = _product(_transpose(a0), _product(shifted, a0))
    normalized_pull = _product(inverse_sqrt, _product(pullback, inverse_sqrt))
    normalized_unitary = _product(_transpose(unitary), _product(shifted, unitary))
    physical_poly = _pencil_coefficients(shifted, _eye(3))
    normalized_poly = _pencil_coefficients(normalized_pull, _eye(3))
    numerator_poly = _pencil_coefficients(pullback, gram)
    determinant_gram = _det_gaussian(gram)
    ratio_poly = [value / determinant_gram for value in numerator_poly]
    if physical_poly != normalized_poly or physical_poly != ratio_poly:
        raise ReplayError("independent characteristic reconstruction failed")
    return {
        "physical_blocks": {"pole": pole, "archimedean": arch, "prime": prime},
        "shift_tau": tau,
        "complete_Q": complete,
        "shifted_B": shifted,
        "polar_data": {
            "unitary_U": unitary,
            "singular_scale_S": singular,
            "A0": a0,
            "G": gram,
            "G_inverse_sqrt": inverse_sqrt,
            "U_star_U_minus_I": _combine(_product(_transpose(unitary), unitary), _eye(3), Q(-1)),
        },
        "pullback": pullback,
        "normalized_from_pullback": normalized_pull,
        "normalized_from_unitary": normalized_unitary,
        "normalized_identity_residual": _combine(normalized_pull, normalized_unitary, Q(-1)),
        "physical_characteristic_polynomial_det_B_minus_zI": physical_poly,
        "normalized_characteristic_polynomial": normalized_poly,
        "generalized_numerator_det_pullback_minus_zG": numerator_poly,
        "det_G": determinant_gram,
        "generalized_ratio_polynomial": ratio_poly,
        "inertia": {
            "physical": _inertia_data(shifted),
            "normalized": _inertia_data(normalized_pull),
            "pullback": _inertia_data(pullback),
        },
    }


def _bridge_columns() -> Matrix:
    return [[Q(-1), Q(-1), Q(0)], [Q(0), Q(1), Q(1)], [Q(1), Q(0), Q(0)], [Q(0), Q(0), Q(-1)]]


def _gram(columns: Matrix, weights: list[Fraction] | None = None) -> Matrix:
    if weights is None:
        weights = [Q(1)] * len(columns)
    size = len(columns[0])
    return [[
        sum((weights[row] * columns[row][left] * columns[row][right] for row in range(len(columns))), Q(0))
        for right in range(size)
    ] for left in range(size)]


def _expected_pencil(complete: Matrix) -> dict[str, Any]:
    columns = _bridge_columns()
    d_sep = _gram(columns)
    w = [[Q(1), Q(1), Q(0)], [Q(0), Q(1), Q(1)], [Q(1), Q(0), Q(1)]]
    physical_gram = _product(_transpose(w), w)
    q_pull = _product(_transpose(w), _product(complete, w))
    tau, delta, mu = Q(2), Q(1, 3), Q(2, 5)
    physical = _combine(q_pull, _scalar(tau + delta, physical_gram), Q(-1))
    source = _combine(_combine(q_pull, _scalar(tau, physical_gram), Q(-1)), _scalar(mu, d_sep), Q(-1))
    return {
        "raw_source_columns_p_b_m": columns,
        "D_sep": d_sep,
        "W": w,
        "physical_gram_R": physical_gram,
        "Q_pullback": q_pull,
        "shift_tau": tau,
        "physical_floor_delta": delta,
        "source_metric_mu": mu,
        "physical_pencil_Q_minus_tau_plus_delta_R": physical,
        "source_pencil_Q_minus_tau_R_minus_mu_D": source,
        "cross_blocks": {
            "D_02": d_sep[0][1:],
            "R_02": physical_gram[0][1:],
            "Q_02": q_pull[0][1:],
            "physical_02": physical[0][1:],
            "source_02": source[0][1:],
        },
    }


def _metric_pair(vector: list[Fraction], defects: list[Fraction], d0: Fraction) -> tuple[Matrix, Matrix]:
    vv = _outer(vector)
    return _combine(_eye(len(vector)), vv), _combine(_diag(defects), _scalar(d0, vv))


def _expected_low_defect(p: int) -> dict[str, Any]:
    beta, d0, d2 = Q(p - 1, p + 1), Q(1, p**6), Q(1, p**4)
    short_vector = [beta]
    long_vector = [beta, Q(1, 3), Q(-2, 5), Q(1, 7)]
    long_defects = [d2, Q(1, 3), Q(1, 2), Q(3, 4)]
    short_d, short_h = _metric_pair(short_vector, [d2], d0)
    long_d, long_h = _metric_pair(long_vector, long_defects, d0)
    numerator, denominator = d2 + d0 * beta**2, Q(1) + beta**2
    rayleigh = numerator / denominator
    return {
        "beta_I2_over_I0": beta,
        "d0": d0,
        "d2": d2,
        "short_prefix": {"v": short_vector, "D": short_d, "H": short_h},
        "long_prefix": {"v": long_vector, "defects": long_defects, "D": long_d, "H": long_h},
        "c2_coordinate_numerator": numerator,
        "c2_coordinate_denominator": denominator,
        "c2_generalized_rayleigh": rayleigh,
        "short_prefix_rayleigh": short_h[0][0] / short_d[0][0],
        "long_prefix_rayleigh": long_h[0][0] / long_d[0][0],
        "lower_margin_rayleigh_minus_d0": rayleigh - d0,
        "upper_margin_d2_minus_rayleigh": d2 - rayleigh,
        "logical_role": "upper_test_for_generalized_minimum_only",
    }


def _expected_high_tail(p: int) -> dict[str, Any]:
    vector = [Q(1, 3), Q(-1, 4), Q(1, 5)]
    defects, d0 = [Q(1, 2), Q(2, 3), Q(3, 4)], Q(1, p**6)
    d_metric, h_metric = _metric_pair(vector, defects, d0)
    eta = sum((entry**2 for entry in vector), Q(0))
    delta = Q(1, 2)
    comparison = delta / (Q(1) + eta)
    cauchy = _combine(_scalar(eta, _eye(3)), _outer(vector), Q(-1))
    lower = _combine(h_metric, _scalar(comparison, d_metric), Q(-1))
    decomposition = _combine(
        _combine(_diag([entry - delta for entry in defects]), _scalar(d0, _outer(vector))),
        _scalar(comparison, cauchy),
    )
    quarter = Q(1, 4)
    quarter_residual = _combine(h_metric, _scalar(quarter, d_metric), Q(-1))
    upper_residual = _combine(d_metric, h_metric, Q(-1))
    return {
        "v": vector,
        "defects": defects,
        "d0": d0,
        "eta": eta,
        "delta": delta,
        "comparison_delta_over_one_plus_eta": comparison,
        "quarter_source_metric_floor": quarter,
        "D": d_metric,
        "H": h_metric,
        "cauchy_matrix_eta_I_minus_vv_star": cauchy,
        "cauchy_principal_minors": _principal_minors(cauchy),
        "lower_residual_H_minus_comparison_D": lower,
        "lower_residual_decomposition": decomposition,
        "quarter_residual_H_minus_quarter_D": quarter_residual,
        "quarter_residual_principal_minors": _principal_minors(quarter_residual),
        "upper_residual_D_minus_H": upper_residual,
        "upper_residual_principal_minors": _principal_minors(upper_residual),
        "logical_role": "source_metric_comparison_only",
    }


def _expected_countermodel(p: int) -> dict[str, Any]:
    columns = _bridge_columns()
    epsilon = Q(1, p * p)
    d_metric = _gram(columns)
    h_metric = _gram(columns, [epsilon, epsilon, Q(1), Q(1)])
    four_minus = _combine(_scalar(Q(4), _eye(3)), d_metric, Q(-1))
    leading = lambda matrix: [_det_gaussian([row[:size] for row in matrix[:size]]) for size in (1, 2, 3)]
    middle_rayleigh = h_metric[1][1]
    return {
        "epsilon": epsilon,
        "epsilon_family_formula": "epsilon=1/p^2",
        "raw_source_columns_p_b_m": columns,
        "raw_defect_weights": [epsilon, epsilon, Q(1), Q(1)],
        "D": d_metric,
        "H_epsilon": h_metric,
        "W": _eye(3),
        "physical_B_epsilon": h_metric,
        "source_pullback_Q": h_metric,
        "source_floor_mu": Q(1),
        "source_floor_residual_Q_minus_mu_H": [[Q(0)] * 3 for _ in range(3)],
        "four_I_minus_D": four_minus,
        "four_I_minus_D_leading_minors": leading(four_minus),
        "H_leading_minors": leading(h_metric),
        "bridge_cross_D_pb": d_metric[0][1],
        "bridge_cross_H_pb": h_metric[0][1],
        "bridge_cross_H_bm": h_metric[1][2],
        "middle_coordinate_physical_rayleigh": middle_rayleigh,
        "logical_role": "physical_floor_upper_test_and_scale_collapse_only",
    }


def _check_exact_certificate(certificate: dict[str, Any], p: int) -> dict[str, Any]:
    whole = _expected_whole_target()
    expected = {
        "whole_target_quotient": _encode(whole),
        "physical_vs_source_pencil": _encode(_expected_pencil(whole["complete_Q"])),
        "permanent_low_defect_test": _encode(_expected_low_defect(p)),
        "high_tail_defect_comparison": _encode(_expected_high_tail(p)),
        "epsilon_bridge_countermodel": _encode(_expected_countermodel(p)),
    }
    for key, expected_value in expected.items():
        if certificate[key] != expected_value:
            raise ReplayError(f"independent exact reconstruction mismatch: {key}")
    return {
        "whole": whole,
        "pencil": _expected_pencil(whole["complete_Q"]),
        "low": _expected_low_defect(p),
        "high": _expected_high_tail(p),
        "countermodel": _expected_countermodel(p),
    }


def _precision_bits(dps: int) -> int:
    return dps * LOG2_10_UPPER_NUMERATOR // LOG2_10_UPPER_DENOMINATOR + 2


def _raw_endpoint(value: Any, label: str) -> tuple[Fraction, tuple[int, int, int, int]]:
    if not isinstance(value, list) or len(value) != 4:
        raise ReplayError(f"malformed raw endpoint: {label}")
    sign, mantissa_text, exponent, bits = value
    if sign not in (0, 1) or not isinstance(mantissa_text, str) or not isinstance(exponent, int) or not isinstance(bits, int):
        raise ReplayError(f"invalid raw endpoint: {label}")
    if not mantissa_text.isdigit() or (mantissa_text.startswith("0") and mantissa_text != "0"):
        raise ReplayError(f"noncanonical mantissa: {label}")
    mantissa = int(mantissa_text)
    if mantissa == 0:
        if (sign, exponent, bits) != (0, 0, 0):
            raise ReplayError(f"noncanonical zero: {label}")
        return Q(0), (0, 0, 0, 0)
    if mantissa % 2 == 0 or bits != mantissa.bit_length():
        raise ReplayError(f"nonnormalized endpoint: {label}")
    numerator = -mantissa if sign else mantissa
    result = Q(numerator * 2**exponent) if exponent >= 0 else Q(numerator, 2 ** (-exponent))
    return result, (sign, mantissa, exponent, bits)


def _read_interval(value: Any, label: str, dps: int) -> tuple[Fraction, Fraction]:
    item = _require_keys(value, {"decimal", "dyadic"}, label)
    decimal = item["decimal"]
    dyadic = _require_keys(item["dyadic"], {"lower", "upper"}, f"{label}.dyadic")
    if not isinstance(decimal, list) or len(decimal) != 2 or not all(isinstance(entry, str) for entry in decimal):
        raise ReplayError(f"malformed decimal interval: {label}")
    lower, lower_raw = _raw_endpoint(dyadic["lower"], f"{label}.lower")
    upper, upper_raw = _raw_endpoint(dyadic["upper"], f"{label}.upper")
    if lower > upper:
        raise ReplayError(f"reversed interval: {label}")
    with mp.workdps(dps + 20):
        expected_decimal = [mp.nstr(mp.mpf(lower_raw), dps + 10), mp.nstr(mp.mpf(upper_raw), dps + 10)]
    if decimal != expected_decimal:
        raise ReplayError(f"decimal/dyadic mismatch: {label}")
    return lower, upper


def _native_bounds(value: object) -> tuple[Fraction, Fraction]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    def convert(raw: tuple[int, int, int, int]) -> Fraction:
        sign, mantissa, exponent, _bits = (int(part) for part in raw)
        numerator = -mantissa if sign else mantissa
        return Q(numerator * 2**exponent) if exponent >= 0 else Q(numerator, 2 ** (-exponent))
    return convert(lower), convert(upper)


def _validate_enclosure(
    serialized: Any,
    native: object,
    label: str,
    dps: int,
    scale_hint: Fraction | None = None,
) -> tuple[Fraction, Fraction]:
    lower, upper = _read_interval(serialized, label, dps)
    native_lower, native_upper = _native_bounds(native)
    if lower > native_lower or upper < native_upper:
        raise ReplayError(f"interval misses independent reconstruction: {label}")
    scale = max(abs(native_lower), abs(native_upper), scale_hint or Q(0), Q(1))
    tolerance = scale / (2 ** max(1, _precision_bits(dps) - 35))
    if upper - lower > native_upper - native_lower + Q(2) * tolerance:
        raise ReplayError(f"interval is implausibly broad: {label}")
    return lower, upper


def _validate_complex(
    serialized: Any,
    native: object,
    label: str,
    dps: int,
) -> tuple[tuple[Fraction, Fraction], tuple[Fraction, Fraction]]:
    item = _require_keys(serialized, {"real", "imag"}, label)
    real_native = _native_bounds(native.real)
    imag_native = _native_bounds(native.imag)
    scale = max(*(abs(value) for value in real_native + imag_native), Q(1))
    real = _validate_enclosure(item["real"], native.real, f"{label}.real", dps, scale)
    imag = _validate_enclosure(item["imag"], native.imag, f"{label}.imag", dps, scale)
    return real, imag


def _validate_actual_nodes(value: Any, p: int, dps: int) -> dict[str, Any]:
    item = _require_keys(value, {
        "N", "breakpoint_m", "L_two_log_lambda", "nodes_s_k", "jump_row_scales",
        "rising_factorial_determinant_direct", "vandermonde_product",
        "jump_determinant_direct", "jump_determinant_formula",
    }, "certificate.actual_node_vandermonde")
    if item["N"] != "2" or item["breakpoint_m"] != "2":
        raise ReplayError("actual-node integer parameters changed")
    mp.iv.dps = dps
    iv = mp.iv.mpf
    lam = iv(p) / iv(2)
    length = iv(2) * mp.iv.log(lam)
    _validate_enclosure(item["L_two_log_lambda"], length, "actual_node.L", dps)

    indices = list(range(-2, 3))
    nodes = [mp.iv.mpc(iv(1) / iv(2), iv(2) * mp.iv.pi * index / length) for index in indices]
    rows = item["nodes_s_k"]
    if not isinstance(rows, list) or len(rows) != len(nodes):
        raise ReplayError("actual-node inventory mismatch")
    for position, (row, index, node) in enumerate(zip(rows, indices, nodes)):
        node_item = _require_keys(row, {"k", "real", "imag"}, f"actual_node.nodes[{position}]")
        if node_item["k"] != str(index):
            raise ReplayError("actual-node index mutation")
        _validate_complex({"real": node_item["real"], "imag": node_item["imag"]}, node, f"actual_node.nodes[{position}]", dps)

    scales = [
        mp.iv.sqrt(lam / length) * ((-lam) ** order) / (iv(2) ** (order + 1))
        for order in range(5)
    ]
    serialized_scales = item["jump_row_scales"]
    if not isinstance(serialized_scales, list) or len(serialized_scales) != 5:
        raise ReplayError("jump-scale inventory mismatch")
    for index, (serialized, native) in enumerate(zip(serialized_scales, scales)):
        _validate_enclosure(serialized, native, f"actual_node.scales[{index}]", dps)

    # Independent determinant tree: rising factorials are a monic basis, so
    # their determinant is the ordinary node Vandermonde.
    vandermonde = mp.iv.mpc(1)
    for left in range(len(nodes)):
        for right in range(left + 1, len(nodes)):
            vandermonde *= nodes[right] - nodes[left]
    jump_formula = vandermonde
    for scale in scales:
        jump_formula *= scale

    rising_bounds = _validate_complex(
        item["rising_factorial_determinant_direct"], vandermonde,
        "actual_node.rising_direct", dps,
    )
    vandermonde_bounds = _validate_complex(
        item["vandermonde_product"], vandermonde,
        "actual_node.vandermonde", dps,
    )
    jump_direct_bounds = _validate_complex(
        item["jump_determinant_direct"], jump_formula,
        "actual_node.jump_direct", dps,
    )
    jump_formula_bounds = _validate_complex(
        item["jump_determinant_formula"], jump_formula,
        "actual_node.jump_formula", dps,
    )
    for label, bounds in (
        ("rising", rising_bounds), ("vandermonde", vandermonde_bounds),
        ("jump_direct", jump_direct_bounds), ("jump_formula", jump_formula_bounds),
    ):
        real, imag = bounds
        if real[1] >= 0 or not (imag[0] <= 0 <= imag[1]):
            raise ReplayError(f"actual-node nonzero/sign check failed: {label}")
    return {
        "node_count": len(nodes),
        "vandermonde_real_sign": "negative",
        "jump_determinant_real_sign": "negative",
    }


def _interval_count(value: Any) -> int:
    if isinstance(value, dict):
        if set(value) == {"decimal", "dyadic"}:
            return 1
        return sum(_interval_count(item) for item in value.values())
    if isinstance(value, list):
        return sum(_interval_count(item) for item in value)
    return 0


def _canonical_bytes(payload: dict[str, Any]) -> bytes:
    return (json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n").encode("utf-8")


def replay(payload: dict[str, Any], producer_bytes: bytes | None = None) -> dict[str, Any]:
    _reject_float_or_secret(payload)
    top = _require_keys(payload, {
        "schema", "checkpoint_version", "updated_date", "terminal_state", "source_binding",
        "inputs", "conventions", "claim_boundary", "certificate", "arithmetic_libraries",
    }, "payload")
    if (
        top["schema"] != PRODUCER_SCHEMA
        or top["checkpoint_version"] != CHECKPOINT_VERSION
        or top["updated_date"] != UPDATED_DATE
        or top["terminal_state"] != TERMINAL_STATE
    ):
        raise ReplayError("fixed metadata mutation")
    if top["conventions"] != EXPECTED_CONVENTIONS:
        raise ReplayError("source convention or prime-sign mutation")
    if top["claim_boundary"] != EXPECTED_CLAIM_BOUNDARY:
        raise ReplayError("false theorem or signed-floor promotion")
    if top["arithmetic_libraries"] != EXPECTED_LIBRARIES:
        raise ReplayError("arithmetic-library declaration mutation")
    if getattr(mp, "__version__", None) != EXPECTED_MPMATH_VERSION:
        raise ReplayError("mpmath runtime mismatch")

    binding = _require_keys(top["source_binding"], {"dependency_hashes"}, "source_binding")
    if binding["dependency_hashes"] != dict(sorted(EXPECTED_DEPENDENCY_HASHES.items())):
        raise ReplayError("dependency inventory mutation")
    for relative, expected in EXPECTED_DEPENDENCY_HASHES.items():
        if _sha256(_root() / relative) != expected:
            raise ReplayError(f"live dependency mismatch: {relative}")

    inputs = _require_keys(top["inputs"], {
        "lambda_numerator", "lambda_denominator", "dps", "fourier_N", "breakpoint_m",
    }, "inputs")
    p_text, dps_text = inputs["lambda_numerator"], inputs["dps"]
    if (
        not isinstance(p_text, str) or _POSITIVE_INTEGER_TEXT.fullmatch(p_text) is None
        or p_text not in CANONICAL_LAMBDA_NUMERATORS
        or not isinstance(dps_text, str) or _POSITIVE_INTEGER_TEXT.fullmatch(dps_text) is None
        or dps_text not in CANONICAL_DPS
        or inputs["lambda_denominator"] != "2"
        or inputs["fourier_N"] != "2"
        or inputs["breakpoint_m"] != "2"
    ):
        raise ReplayError("input inventory mutation")
    p, dps = int(p_text), int(dps_text)

    certificate = _require_keys(top["certificate"], {
        "whole_target_quotient", "physical_vs_source_pencil", "permanent_low_defect_test",
        "high_tail_defect_comparison", "epsilon_bridge_countermodel", "actual_node_vandermonde",
    }, "certificate")
    exact = _check_exact_certificate(certificate, p)
    interval_report = _validate_actual_nodes(certificate["actual_node_vandermonde"], p, dps)
    if _interval_count(certificate["actual_node_vandermonde"]) != 24:
        raise ReplayError("raw interval inventory mismatch")

    low = exact["low"]
    high = exact["high"]
    countermodel = exact["countermodel"]
    pencil = exact["pencil"]
    if not (
        low["d0"] <= low["c2_generalized_rayleigh"] <= low["d2"]
        and low["short_prefix_rayleigh"] == low["long_prefix_rayleigh"]
        and high["comparison_delta_over_one_plus_eta"] >= Q(1, 4)
        and all(row["determinant"] >= 0 for row in high["quarter_residual_principal_minors"])
        and countermodel["bridge_cross_H_pb"] != 0
        and countermodel["middle_coordinate_physical_rayleigh"] == Q(2, p * p)
        and pencil["cross_blocks"]["D_02"][0] != 0
        and pencil["physical_pencil_Q_minus_tau_plus_delta_R"] != pencil["source_pencil_Q_minus_tau_R_minus_mu_D"]
    ):
        raise ReplayError("post-reconstruction logical check failed")

    canonical = _canonical_bytes(payload)
    if producer_bytes is not None and producer_bytes != canonical:
        raise ReplayError("producer bytes are not canonical payload bytes")
    bound_bytes = producer_bytes if producer_bytes is not None else canonical
    report = {
        "schema": REPLAY_SCHEMA,
        "producer_schema": PRODUCER_SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "inputs": dict(inputs),
        "source_binding": {"dependency_hashes": dict(sorted(EXPECTED_DEPENDENCY_HASHES.items()))},
        "producer_binding": {
            "sha256": hashlib.sha256(bound_bytes).hexdigest(),
            "canonical_bytes": len(bound_bytes),
        },
        "reconstructed": {
            "dependency_count": len(EXPECTED_DEPENDENCY_HASHES),
            "exact_rational_section_count": 5,
            "interval_count": 24,
            "whole_target_characteristic_polynomial": _encode(
                exact["whole"]["physical_characteristic_polynomial_det_B_minus_zI"]
            ),
            "whole_target_inertia": {
                key: exact["whole"]["inertia"]["physical"][key]
                for key in ("positive", "negative", "zero")
            },
            "unitary_spectral_determinant_inertia_identity": True,
            "prime_minus_sign_reconstructed": True,
            "bridge_cross_retained": True,
            "physical_source_pencils_distinct": True,
            "low_defect_role": low["logical_role"],
            "high_tail_quarter_source_comparison": True,
            "countermodel_role": countermodel["logical_role"],
            "signed_floor_promoted": False,
            **interval_report,
        },
        "arithmetic_libraries": EXPECTED_LIBRARIES,
    }
    _reject_float_or_secret(report)
    return report


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    input_path = Path(args.input)
    raw = input_path.read_bytes()
    try:
        payload = json.loads(raw)
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise ReplayError("invalid producer JSON") from exc
    report = replay(payload, producer_bytes=raw)
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes(_canonical_bytes(report))


if __name__ == "__main__":
    main()
