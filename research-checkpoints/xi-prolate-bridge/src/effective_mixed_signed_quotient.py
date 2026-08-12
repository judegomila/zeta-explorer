#!/usr/bin/env python3
"""Produce the bounded effective-mixed signed-quotient replay artifact.

All finite matrix statements are exact rational identities.  The sole
transcendental fixture is the actual-node jump Vandermonde, evaluated with
outward mpmath intervals.  This artifact does not assert a signed Weil floor
or promote fixed-parameter capture to an asymptotic theorem.
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


SCHEMA = "xi-prolate-effective-mixed-signed-quotient-v1"
TERMINAL_STATE = "P0_INVALIDATED"
CHECKPOINT_VERSION = "0.43.0-effective-mixed-signed-quotient"
UPDATED_DATE = "2026-08-08"
EXPECTED_MPMATH_VERSION = "1.4.1"

CANONICAL_LAMBDA_NUMERATORS = {5, 9}
CANONICAL_DPS = {80, 160}
_POSITIVE_INTEGER_TEXT = re.compile(r"[1-9][0-9]*\Z")

LOG2_10_UPPER_NUMERATOR = 3321928094887363
LOG2_10_UPPER_DENOMINATOR = 10**15
SERIALIZATION_GUARD_OFFSET_BITS = 18

EXPECTED_DEPENDENCY_HASHES = {
    "notes/EFFECTIVE_MIXED_SIGNED_QUOTIENT_ATTACK.md": "e2e9485d8ee03717af790cb7740fbb2228cc96f04009698cdc51a7fd943634ea",
    "notes/EFFECTIVE_MIXED_PREFIX_SCHEDULE_ATTACK.md": "a33e7a072057f1444afb9d00911465f599fec508d0a6488e655638947cc515ba",
    "EFFECTIVE_MIXED_ENDPOINT_JUMP_SOURCE_LOCK.json": "24ea8f8085e9e198201006f54e0499495174053e38f6c26185cd2b2f60725fcc",
    "P0_SOURCE_LOCK.json": "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_MATRIX_FORMULAS.md": "73aa4d0a746bf1a553372d4c7bdc1c671cd69c9cc36682091d94731e1dac74dd",
    "requirements.txt": "458f06e2b5d6e73acc7a4f72af69afe920764c71127578555044815cd785c0fa",
}

CONVENTIONS = {
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

CLAIM_BOUNDARY = {
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

ARITHMETIC_LIBRARIES = {
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
Polynomial = list[Fraction]


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _validated_dependencies() -> dict[str, str]:
    actual: dict[str, str] = {}
    for relative, expected in EXPECTED_DEPENDENCY_HASHES.items():
        digest = _sha256(_root() / relative)
        if digest != expected:
            raise ValueError(f"dependency hash mismatch: {relative}")
        actual[relative] = digest
    return dict(sorted(actual.items()))


def _choice(value: Any, label: str, allowed: set[int]) -> tuple[str, int]:
    if not isinstance(value, str) or _POSITIVE_INTEGER_TEXT.fullmatch(value) is None:
        raise TypeError(f"{label} must be canonical positive integer text")
    if value not in {str(item) for item in allowed}:
        raise ValueError(f"{label} is outside the canonical pilot inventory")
    return value, int(value)


def _encode(value: Any) -> Any:
    if isinstance(value, Fraction):
        return {"numerator": str(value.numerator), "denominator": str(value.denominator)}
    if isinstance(value, (list, tuple)):
        return [_encode(item) for item in value]
    if isinstance(value, dict):
        return {str(key): _encode(item) for key, item in value.items()}
    return value


def _assert_strict_json(value: Any) -> None:
    if isinstance(value, float):
        raise TypeError("binary floating-point value reached serialization")
    if value is None or type(value) in (bool, int, str):
        return
    if isinstance(value, list):
        for item in value:
            _assert_strict_json(item)
        return
    if isinstance(value, dict):
        if any(not isinstance(key, str) for key in value):
            raise TypeError("non-string JSON key")
        for item in value.values():
            _assert_strict_json(item)
        return
    raise TypeError(f"unsupported JSON value: {type(value).__name__}")


def _zero(rows: int, columns: int) -> Matrix:
    return [[Q(0) for _ in range(columns)] for _ in range(rows)]


def _eye(size: int) -> Matrix:
    return [[Q(i == j) for j in range(size)] for i in range(size)]


def _diag(values: list[Fraction]) -> Matrix:
    result = _zero(len(values), len(values))
    for index, value in enumerate(values):
        result[index][index] = value
    return result


def _transpose(matrix: Matrix) -> Matrix:
    return [list(row) for row in zip(*matrix)]


def _matmul(left: Matrix, right: Matrix) -> Matrix:
    return [
        [sum((left[i][k] * right[k][j] for k in range(len(right))), Q(0))
         for j in range(len(right[0]))]
        for i in range(len(left))
    ]


def _matadd(left: Matrix, right: Matrix) -> Matrix:
    return [[a + b for a, b in zip(row_a, row_b)] for row_a, row_b in zip(left, right)]


def _matsub(left: Matrix, right: Matrix) -> Matrix:
    return [[a - b for a, b in zip(row_a, row_b)] for row_a, row_b in zip(left, right)]


def _scale(value: Fraction, matrix: Matrix) -> Matrix:
    return [[value * entry for entry in row] for row in matrix]


def _outer(vector: list[Fraction]) -> Matrix:
    return [[left * right for right in vector] for left in vector]


def _minor(matrix: Matrix, omit_row: int, omit_column: int) -> Matrix:
    return [
        [entry for column, entry in enumerate(row) if column != omit_column]
        for row_index, row in enumerate(matrix) if row_index != omit_row
    ]


def _determinant(matrix: Matrix) -> Fraction:
    size = len(matrix)
    if size == 0:
        return Q(1)
    if any(len(row) != size for row in matrix):
        raise ValueError("determinant requires a square matrix")
    if size == 1:
        return matrix[0][0]
    return sum(
        (Q(-1 if column % 2 else 1) * matrix[0][column]
         * _determinant(_minor(matrix, 0, column)) for column in range(size)),
        Q(0),
    )


def _permutation_sign(permutation: tuple[int, ...]) -> int:
    inversions = sum(
        permutation[i] > permutation[j]
        for i in range(len(permutation)) for j in range(i + 1, len(permutation))
    )
    return -1 if inversions % 2 else 1


def _poly_add(left: Polynomial, right: Polynomial) -> Polynomial:
    size = max(len(left), len(right))
    result = [Q(0)] * size
    for index in range(size):
        result[index] = (left[index] if index < len(left) else Q(0)) + (
            right[index] if index < len(right) else Q(0)
        )
    while len(result) > 1 and result[-1] == 0:
        result.pop()
    return result


def _poly_mul(left: Polynomial, right: Polynomial) -> Polynomial:
    result = [Q(0)] * (len(left) + len(right) - 1)
    for i, a in enumerate(left):
        for j, b in enumerate(right):
            result[i + j] += a * b
    while len(result) > 1 and result[-1] == 0:
        result.pop()
    return result


def _determinant_polynomial(matrix: list[list[Polynomial]]) -> Polynomial:
    size = len(matrix)
    total: Polynomial = [Q(0)]
    for permutation in itertools.permutations(range(size)):
        term: Polynomial = [Q(_permutation_sign(permutation))]
        for row, column in enumerate(permutation):
            term = _poly_mul(term, matrix[row][column])
        total = _poly_add(total, term)
    return total


def _pencil_polynomial(left: Matrix, metric: Matrix) -> Polynomial:
    return _determinant_polynomial([
        [[left[i][j], -metric[i][j]] for j in range(len(left))]
        for i in range(len(left))
    ])


def _principal_submatrix(matrix: Matrix, indices: tuple[int, ...]) -> Matrix:
    return [[matrix[i][j] for j in indices] for i in indices]


def _all_principal_minors(matrix: Matrix) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for size in range(1, len(matrix) + 1):
        for indices in itertools.combinations(range(len(matrix)), size):
            rows.append({
                "indices": [str(index) for index in indices],
                "determinant": _determinant(_principal_submatrix(matrix, indices)),
            })
    return rows


def _inertia_certificate(matrix: Matrix) -> dict[str, Any]:
    leading = [Q(1)]
    for size in range(1, len(matrix) + 1):
        leading.append(_determinant([row[:size] for row in matrix[:size]]))
    if any(value == 0 for value in leading):
        raise ArithmeticError("fixture has a zero leading principal minor")
    pivots = [leading[index] / leading[index - 1] for index in range(1, len(leading))]
    return {
        "leading_principal_minors": leading[1:],
        "ldl_pivots": pivots,
        "positive": sum(value > 0 for value in pivots),
        "negative": sum(value < 0 for value in pivots),
        "zero": 0,
    }


def _whole_target_fixture() -> dict[str, Any]:
    pole = [[Q(2), Q(1), Q(0)], [Q(1), Q(1), Q(0)], [Q(0), Q(0), Q(0)]]
    arch = [[Q(3), Q(0), Q(1)], [Q(0), Q(2), Q(1)], [Q(1), Q(1), Q(4)]]
    prime = [[Q(1), Q(0), Q(1)], [Q(0), Q(4), Q(-1)], [Q(1), Q(-1), Q(1)]]
    complete = _matsub(_matadd(pole, arch), prime)
    tau = Q(2)
    shifted = _matsub(complete, _scale(tau, _eye(3)))

    unitary = [
        [Q(3, 5), Q(-4, 5), Q(0)],
        [Q(4, 5), Q(3, 5), Q(0)],
        [Q(0), Q(0), Q(-1)],
    ]
    singular_scale = _diag([Q(2), Q(3), Q(5)])
    a0 = _matmul(unitary, singular_scale)
    gram = _matmul(_transpose(a0), a0)
    gram_inverse_sqrt = _diag([Q(1, 2), Q(1, 3), Q(1, 5)])
    pulled = _matmul(_transpose(a0), _matmul(shifted, a0))
    normalized_pullback = _matmul(gram_inverse_sqrt, _matmul(pulled, gram_inverse_sqrt))
    normalized_unitary = _matmul(_transpose(unitary), _matmul(shifted, unitary))

    physical_characteristic = _pencil_polynomial(shifted, _eye(3))
    normalized_characteristic = _pencil_polynomial(normalized_pullback, _eye(3))
    generalized_numerator = _pencil_polynomial(pulled, gram)
    det_gram = _determinant(gram)
    generalized_ratio = [coefficient / det_gram for coefficient in generalized_numerator]

    if (
        _matmul(_transpose(unitary), unitary) != _eye(3)
        or normalized_pullback != normalized_unitary
        or physical_characteristic != normalized_characteristic
        or physical_characteristic != generalized_ratio
    ):
        raise ArithmeticError("whole-target quotient identity failed")

    physical_inertia = _inertia_certificate(shifted)
    normalized_inertia = _inertia_certificate(normalized_pullback)
    pullback_inertia = _inertia_certificate(pulled)
    counts = lambda item: (item["positive"], item["negative"], item["zero"])
    if counts(physical_inertia) != counts(normalized_inertia) or counts(physical_inertia) != counts(pullback_inertia):
        raise ArithmeticError("inertia congruence failed")

    return {
        "physical_blocks": {"pole": pole, "archimedean": arch, "prime": prime},
        "shift_tau": tau,
        "complete_Q": complete,
        "shifted_B": shifted,
        "polar_data": {
            "unitary_U": unitary,
            "singular_scale_S": singular_scale,
            "A0": a0,
            "G": gram,
            "G_inverse_sqrt": gram_inverse_sqrt,
            "U_star_U_minus_I": _matsub(_matmul(_transpose(unitary), unitary), _eye(3)),
        },
        "pullback": pulled,
        "normalized_from_pullback": normalized_pullback,
        "normalized_from_unitary": normalized_unitary,
        "normalized_identity_residual": _matsub(normalized_pullback, normalized_unitary),
        "physical_characteristic_polynomial_det_B_minus_zI": physical_characteristic,
        "normalized_characteristic_polynomial": normalized_characteristic,
        "generalized_numerator_det_pullback_minus_zG": generalized_numerator,
        "det_G": det_gram,
        "generalized_ratio_polynomial": generalized_ratio,
        "inertia": {
            "physical": physical_inertia,
            "normalized": normalized_inertia,
            "pullback": pullback_inertia,
        },
    }


def _raw_bridge_columns() -> Matrix:
    # Rows are e_0,e_2,e_4,e_6; columns are p,b,m.
    return [[Q(-1), Q(-1), Q(0)], [Q(0), Q(1), Q(1)], [Q(1), Q(0), Q(0)], [Q(0), Q(0), Q(-1)]]


def _pencil_fixture(complete_q: Matrix) -> dict[str, Any]:
    raw_columns = _raw_bridge_columns()
    d_sep = _matmul(_transpose(raw_columns), raw_columns)
    w = [[Q(1), Q(1), Q(0)], [Q(0), Q(1), Q(1)], [Q(1), Q(0), Q(1)]]
    physical_gram = _matmul(_transpose(w), w)
    q_pull = _matmul(_transpose(w), _matmul(complete_q, w))
    tau, delta, mu = Q(2), Q(1, 3), Q(2, 5)
    physical_pencil = _matsub(q_pull, _scale(tau + delta, physical_gram))
    source_pencil = _matsub(_matsub(q_pull, _scale(tau, physical_gram)), _scale(mu, d_sep))
    if d_sep[0][1] == 0 or physical_pencil == source_pencil:
        raise ArithmeticError("bridge pencil distinction failed")
    return {
        "raw_source_columns_p_b_m": raw_columns,
        "D_sep": d_sep,
        "W": w,
        "physical_gram_R": physical_gram,
        "Q_pullback": q_pull,
        "shift_tau": tau,
        "physical_floor_delta": delta,
        "source_metric_mu": mu,
        "physical_pencil_Q_minus_tau_plus_delta_R": physical_pencil,
        "source_pencil_Q_minus_tau_R_minus_mu_D": source_pencil,
        "cross_blocks": {
            "D_02": [d_sep[0][1], d_sep[0][2]],
            "R_02": [physical_gram[0][1], physical_gram[0][2]],
            "Q_02": [q_pull[0][1], q_pull[0][2]],
            "physical_02": [physical_pencil[0][1], physical_pencil[0][2]],
            "source_02": [source_pencil[0][1], source_pencil[0][2]],
        },
    }


def _metric_pair(vector: list[Fraction], defects: list[Fraction], d0: Fraction) -> tuple[Matrix, Matrix]:
    outer = _outer(vector)
    return _matadd(_eye(len(vector)), outer), _matadd(_diag(defects), _scale(d0, outer))


def _low_defect_fixture(p: int) -> dict[str, Any]:
    beta = Q(p - 1, p + 1)
    d0, d2 = Q(1, p**6), Q(1, p**4)
    short_vector = [beta]
    long_vector = [beta, Q(1, 3), Q(-2, 5), Q(1, 7)]
    long_defects = [d2, Q(1, 3), Q(1, 2), Q(3, 4)]
    short_d, short_h = _metric_pair(short_vector, [d2], d0)
    long_d, long_h = _metric_pair(long_vector, long_defects, d0)
    numerator = d2 + d0 * beta * beta
    denominator = Q(1) + beta * beta
    rayleigh = numerator / denominator
    if not (d0 <= rayleigh <= d2):
        raise ArithmeticError("low-defect Rayleigh ordering failed")
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


def _high_tail_fixture(p: int) -> dict[str, Any]:
    vector = [Q(1, 3), Q(-1, 4), Q(1, 5)]
    defects = [Q(1, 2), Q(2, 3), Q(3, 4)]
    d0 = Q(1, p**6)
    d_metric, h_metric = _metric_pair(vector, defects, d0)
    eta = sum((value * value for value in vector), Q(0))
    delta = min(defects)
    comparison = delta / (Q(1) + eta)
    cauchy = _matsub(_scale(eta, _eye(3)), _outer(vector))
    defect_excess = _diag([value - delta for value in defects])
    rank_one = _scale(d0, _outer(vector))
    cauchy_term = _scale(comparison, cauchy)
    lower_residual = _matsub(h_metric, _scale(comparison, d_metric))
    lower_decomposition = _matadd(_matadd(defect_excess, rank_one), cauchy_term)
    quarter = Q(1, 4)
    quarter_residual = _matsub(h_metric, _scale(quarter, d_metric))
    upper_residual = _matsub(d_metric, h_metric)
    cauchy_minors = _all_principal_minors(cauchy)
    quarter_minors = _all_principal_minors(quarter_residual)
    upper_minors = _all_principal_minors(upper_residual)
    if (
        comparison < quarter
        or lower_residual != lower_decomposition
        or any(item["determinant"] < 0 for item in cauchy_minors + quarter_minors + upper_minors)
    ):
        raise ArithmeticError("high-tail defect comparison failed")
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
        "cauchy_principal_minors": cauchy_minors,
        "lower_residual_H_minus_comparison_D": lower_residual,
        "lower_residual_decomposition": lower_decomposition,
        "quarter_residual_H_minus_quarter_D": quarter_residual,
        "quarter_residual_principal_minors": quarter_minors,
        "upper_residual_D_minus_H": upper_residual,
        "upper_residual_principal_minors": upper_minors,
        "logical_role": "source_metric_comparison_only",
    }


def _weighted_gram(columns: Matrix, weights: list[Fraction]) -> Matrix:
    weighted = [[weights[i] * columns[i][j] for j in range(len(columns[0]))] for i in range(len(columns))]
    return _matmul(_transpose(columns), weighted)


def _bridge_countermodel_fixture(p: int) -> dict[str, Any]:
    columns = _raw_bridge_columns()
    epsilon = Q(1, p * p)
    d_metric = _matmul(_transpose(columns), columns)
    h_metric = _weighted_gram(columns, [epsilon, epsilon, Q(1), Q(1)])
    four_i_minus_d = _matsub(_scale(Q(4), _eye(3)), d_metric)
    h_leading = [_determinant([row[:size] for row in h_metric[:size]]) for size in (1, 2, 3)]
    coframe_leading = [_determinant([row[:size] for row in four_i_minus_d[:size]]) for size in (1, 2, 3)]
    middle = [Q(0), Q(1), Q(0)]
    physical_upper = _matmul([middle], _matmul(h_metric, _transpose([middle])))[0][0]
    if (
        h_leading != [Q(1) + epsilon, Q(2) * epsilon + epsilon * epsilon, Q(2) * epsilon * (Q(1) + epsilon)]
        or coframe_leading != [Q(2), Q(3), Q(4)]
        or physical_upper != Q(2) * epsilon
    ):
        raise ArithmeticError("bridge countermodel identity failed")
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
        "source_floor_residual_Q_minus_mu_H": _zero(3, 3),
        "four_I_minus_D": four_i_minus_d,
        "four_I_minus_D_leading_minors": coframe_leading,
        "H_leading_minors": h_leading,
        "bridge_cross_D_pb": d_metric[0][1],
        "bridge_cross_H_pb": h_metric[0][1],
        "bridge_cross_H_bm": h_metric[1][2],
        "middle_coordinate_physical_rayleigh": physical_upper,
        "logical_role": "physical_floor_upper_test_and_scale_collapse_only",
    }


def _precision_bits(dps: int) -> int:
    return dps * LOG2_10_UPPER_NUMERATOR // LOG2_10_UPPER_DENOMINATOR + 2


def _raw_fraction(raw: tuple[int, int, int, int]) -> Fraction:
    sign, mantissa, exponent, _bits = raw
    numerator = -mantissa if sign else mantissa
    return Q(numerator * 2**exponent) if exponent >= 0 else Q(numerator, 2 ** (-exponent))


def _normalize_dyadic(value: int, exponent: int) -> tuple[int, int, int, int]:
    if value == 0:
        return 0, 0, 0, 0
    sign = int(value < 0)
    mantissa = abs(value)
    while mantissa % 2 == 0:
        mantissa //= 2
        exponent += 1
    return sign, mantissa, exponent, mantissa.bit_length()


def _shift_raw(raw: tuple[int, int, int, int], power: int, direction: int) -> tuple[int, int, int, int]:
    sign, mantissa, exponent, _bits = raw
    signed = -mantissa if sign else mantissa
    base = min(exponent, power)
    shifted = (signed << (exponent - base)) + direction * (1 << (power - base))
    return _normalize_dyadic(shifted, base)


def _serialize_interval(value: object, dps: int) -> dict[str, object]:
    lower_raw, upper_raw = value._mpi_  # type: ignore[attr-defined]
    lower = tuple(int(part) for part in lower_raw)
    upper = tuple(int(part) for part in upper_raw)
    if lower != upper:
        scale = max(
            exponent + bits - 1 if mantissa else 0
            for _sign, mantissa, exponent, bits in (lower, upper)
        )
        guard = scale - _precision_bits(dps) + SERIALIZATION_GUARD_OFFSET_BITS
        lower = _shift_raw(lower, guard, -1)
        upper = _shift_raw(upper, guard, 1)
    if _raw_fraction(lower) > _raw_fraction(upper):
        raise ArithmeticError("reversed interval")
    raw = lambda item: [item[0], str(item[1]), item[2], item[3]]
    with mp.workdps(dps + 20):
        return {
            "decimal": [mp.nstr(mp.mpf(lower), dps + 10), mp.nstr(mp.mpf(upper), dps + 10)],
            "dyadic": {"lower": raw(lower), "upper": raw(upper)},
        }


def _serialize_complex(value: object, dps: int) -> dict[str, object]:
    return {"real": _serialize_interval(value.real, dps), "imag": _serialize_interval(value.imag, dps)}


def _interval_bounds(value: object) -> tuple[Fraction, Fraction]:
    lower_raw, upper_raw = value._mpi_  # type: ignore[attr-defined]
    return (
        _raw_fraction(tuple(int(part) for part in lower_raw)),
        _raw_fraction(tuple(int(part) for part in upper_raw)),
    )


def _complex_determinant_permutations(matrix: list[list[object]]) -> object:
    size = len(matrix)
    total = mp.iv.mpc(0)
    for permutation in itertools.permutations(range(size)):
        term = mp.iv.mpc(_permutation_sign(permutation))
        for row, column in enumerate(permutation):
            term *= matrix[row][column]
        total += term
    return total


def _overlap(left: object, right: object) -> bool:
    left_lo, left_hi = _interval_bounds(left)
    right_lo, right_hi = _interval_bounds(right)
    return max(left_lo, right_lo) <= min(left_hi, right_hi)


def _actual_node_vandermonde(p: int, dps: int) -> dict[str, Any]:
    mp.iv.dps = dps
    iv = mp.iv.mpf
    lam = iv(p) / iv(2)
    length = iv(2) * mp.iv.log(lam)
    n_value, breakpoint = 2, 2
    indices = list(range(-n_value, n_value + 1))
    nodes = [mp.iv.mpc(iv(1) / iv(2), iv(2) * mp.iv.pi * index / length) for index in indices]

    rising: list[list[object]] = []
    for order in range(2 * n_value + 1):
        row: list[object] = []
        for node in nodes:
            value = mp.iv.mpc(1)
            for offset in range(order):
                value *= node + offset
            row.append(value)
        rising.append(row)
    rising_determinant = _complex_determinant_permutations(rising)

    vandermonde = mp.iv.mpc(1)
    for left in range(len(nodes)):
        for right in range(left + 1, len(nodes)):
            vandermonde *= nodes[right] - nodes[left]

    scales = [
        mp.iv.sqrt(lam / length) * ((-lam) ** order) / (iv(breakpoint) ** (order + 1))
        for order in range(2 * n_value + 1)
    ]
    jump_matrix = [[scales[row] * rising[row][column] for column in range(len(nodes))] for row in range(len(nodes))]
    jump_determinant = _complex_determinant_permutations(jump_matrix)
    jump_formula = vandermonde
    for scale in scales:
        jump_formula *= scale

    if (
        not _overlap(rising_determinant.real, vandermonde.real)
        or not _overlap(rising_determinant.imag, vandermonde.imag)
        or not _overlap(jump_determinant.real, jump_formula.real)
        or not _overlap(jump_determinant.imag, jump_formula.imag)
        or _interval_bounds(vandermonde.real)[1] >= 0
        or _interval_bounds(jump_formula.real)[1] >= 0
    ):
        raise ArithmeticError("actual-node Vandermonde enclosure failed")

    return {
        "N": str(n_value),
        "breakpoint_m": str(breakpoint),
        "L_two_log_lambda": _serialize_interval(length, dps),
        "nodes_s_k": [
            {"k": str(index), **_serialize_complex(node, dps)} for index, node in zip(indices, nodes)
        ],
        "jump_row_scales": [_serialize_interval(value, dps) for value in scales],
        "rising_factorial_determinant_direct": _serialize_complex(rising_determinant, dps),
        "vandermonde_product": _serialize_complex(vandermonde, dps),
        "jump_determinant_direct": _serialize_complex(jump_determinant, dps),
        "jump_determinant_formula": _serialize_complex(jump_formula, dps),
    }


def produce(lambda_numerator: str, dps: str) -> dict[str, Any]:
    p_text, p = _choice(lambda_numerator, "lambda numerator", CANONICAL_LAMBDA_NUMERATORS)
    dps_text, dps_integer = _choice(dps, "dps", CANONICAL_DPS)
    if getattr(mp, "__version__", None) != EXPECTED_MPMATH_VERSION:
        raise RuntimeError("mpmath runtime mismatch")
    dependencies = _validated_dependencies()

    whole_target = _whole_target_fixture()
    complete_q = whole_target["complete_Q"]
    payload = {
        "schema": SCHEMA,
        "checkpoint_version": CHECKPOINT_VERSION,
        "updated_date": UPDATED_DATE,
        "terminal_state": TERMINAL_STATE,
        "source_binding": {"dependency_hashes": dependencies},
        "inputs": {
            "lambda_numerator": p_text,
            "lambda_denominator": "2",
            "dps": dps_text,
            "fourier_N": "2",
            "breakpoint_m": "2",
        },
        "conventions": CONVENTIONS,
        "claim_boundary": CLAIM_BOUNDARY,
        "certificate": {
            "whole_target_quotient": _encode(whole_target),
            "physical_vs_source_pencil": _encode(_pencil_fixture(complete_q)),
            "permanent_low_defect_test": _encode(_low_defect_fixture(p)),
            "high_tail_defect_comparison": _encode(_high_tail_fixture(p)),
            "epsilon_bridge_countermodel": _encode(_bridge_countermodel_fixture(p)),
            "actual_node_vandermonde": _actual_node_vandermonde(p, dps_integer),
        },
        "arithmetic_libraries": ARITHMETIC_LIBRARIES,
    }
    _assert_strict_json(payload)
    return payload


def _canonical_bytes(payload: dict[str, Any]) -> bytes:
    return (json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n").encode("utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lambda-numerator", required=True)
    parser.add_argument("--dps", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    payload = produce(args.lambda_numerator, args.dps)
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes(_canonical_bytes(payload))


if __name__ == "__main__":
    main()
