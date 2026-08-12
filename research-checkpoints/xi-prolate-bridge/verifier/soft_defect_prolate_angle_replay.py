#!/usr/bin/env python3
"""Clean-room replay for the soft-defect/prolate-angle certificate.

This module imports no producer code and reads no environment variables.  It
binds exact producer bytes, rehashes a pinned source lock and every dependency,
rebuilds all rational fixtures, and independently encloses every
transcendental formula with ``mpmath.iv``.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import itertools
import json
from math import comb, factorial, isqrt
from pathlib import Path
import re
from typing import Any

import mpmath as mp


PRODUCER_SCHEMA = "xi-prolate-soft-defect-prolate-angle-v1"
REPLAY_SCHEMA = "xi-prolate-soft-defect-prolate-angle-replay-v1"
SOURCE_LOCK_PATH = "SOFT_DEFECT_PROLATE_ANGLE_SOURCE_LOCK.json"
SOURCE_LOCK_SCHEMA = "xi-prolate-soft-defect-prolate-angle-source-lock-v1"
CLAIM_CLASS = "SOFT_DEFECT_PROLATE_ANGLE_REDUCTION"
TERMINAL_STATE = "P0_INVALIDATED"
EXPECTED_SOURCE_LOCK_SHA256 = "e714bbc772881ac4e1c59446c492018d21852f8e9fe539c408a706892256d6e1"
EXPECTED_DEPENDENCY_PATHS = {
    "P0_SOURCE_LOCK.json",
    "P3_SOURCE_LOCK.json",
    "DIRECT_RH_ATTACK.md",
    "notes/PROJECTION_RATE_THEOREM.md",
    "FULL_SOURCE_COFRAME_RANK_SOURCE_LOCK.json",
    "notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md",
    "MATCHED_HIGH_MOMENT_COFRAME_SOURCE_LOCK.json",
    "notes/MATCHED_HIGH_MOMENT_COFRAME_REDUCTION.md",
    "MATCHED_BREAKPOINT_DIRECTIONAL_MOMENT_SOURCE_LOCK.json",
    "notes/MATCHED_BREAKPOINT_DIRECTIONAL_MOMENT_AUDIT.md",
    "PHYSICAL_LEVERAGE_SHORTED_SCHUR_SOURCE_LOCK.json",
    "notes/PHYSICAL_LEVERAGE_SHORTED_SCHUR.md",
    "PHYSICAL_SOFT_SHORT_SIGNED_SCHUR_SOURCE_LOCK.json",
    "notes/PHYSICAL_SOFT_SHORT_SIGNED_SCHUR.md",
    "PROJECTED_STATE_NORM_SOURCE_LOCK.json",
    "notes/PROJECTED_STATE_NORM_LOWER_BOUND.md",
    "requirements.txt",
    "notes/SOFT_DEFECT_PROLATE_ANGLE_REDUCTION.md",
}

_SHA256 = re.compile(r"^[0-9a-f]{64}$")
_INTEGER_TEXT = re.compile(r"^(?:0|-[1-9][0-9]*|[1-9][0-9]*)$")
_UNSIGNED_INTEGER_TEXT = re.compile(r"^(?:0|[1-9][0-9]*)$")
_POSITIVE_INTEGER_TEXT = re.compile(r"^[1-9][0-9]*$")
_DECIMAL_TEXT = re.compile(
    r"^[+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:e[+-]?[0-9]+)?$"
)
_LOG2_10_UPPER_NUMERATOR = 3321928094887363
_LOG2_10_UPPER_DENOMINATOR = 10**15

ARITHMETIC_LIBRARIES = {
    "precision_mode": "exact reduced rationals plus outward arbitrary-precision intervals",
    "libraries": ["Python fractions.Fraction", f"mpmath.iv {mp.__version__}"],
    "raw_interval_or_ball_output_applicable": True,
    "shared_library_with_verifier": True,
    "independent_formula_trees_required": True,
    "serialization_guard": "every nondegenerate interval is enlarged to a precision-scaled dyadic enclosure",
    "independence_limitation": "producer and verifier share Python integer/Fraction arithmetic and the pinned mpmath.iv transcendental runtime",
}

Matrix = list[list[Fraction]]


class ReplayError(ValueError):
    """Raised on malformed input or a failed independent reconstruction."""


class _IntervalTarget:
    def __init__(self, value: Any) -> None:
        self.value = value


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256_bytes(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def _read_bytes(path: Path, label: str) -> bytes:
    try:
        return path.read_bytes()
    except OSError as exc:
        raise ReplayError(f"cannot read {label}: {path}") from exc


def _reject_json_number(token: str) -> None:
    raise ReplayError(f"binary64 or non-integer JSON number rejected: {token}")


def _unique_object(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise ReplayError(f"duplicate JSON object key: {key}")
        result[key] = value
    return result


def _validate_json(value: Any, path: str = "payload") -> None:
    if value is None or isinstance(value, (str, bool)):
        return
    if isinstance(value, int):
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
        text = raw.decode("utf-8") if isinstance(raw, bytes) else raw
    except UnicodeDecodeError as exc:
        raise ReplayError(f"{label} is not UTF-8") from exc
    try:
        value = json.loads(
            text,
            parse_float=_reject_json_number,
            parse_constant=_reject_json_number,
            object_pairs_hook=_unique_object,
        )
    except ReplayError:
        raise
    except (json.JSONDecodeError, TypeError) as exc:
        raise ReplayError(f"{label} is not strict JSON") from exc
    _validate_json(value, label)
    return value


def _same_json(left: Any, right: Any) -> bool:
    if type(left) is not type(right):
        return False
    if isinstance(left, dict):
        return set(left) == set(right) and all(
            _same_json(left[key], right[key]) for key in left
        )
    if isinstance(left, list):
        return len(left) == len(right) and all(
            _same_json(a, b) for a, b in zip(left, right)
        )
    return left == right


def _require_same(actual: Any, expected: Any, label: str) -> None:
    if not _same_json(actual, expected):
        raise ReplayError(f"{label} mismatch or claim promotion")


def _rational(value: Fraction | int) -> dict[str, str]:
    item = value if isinstance(value, Fraction) else Fraction(value)
    return {"numerator": str(item.numerator), "denominator": str(item.denominator)}


def _parse_rational(value: Any, label: str) -> Fraction:
    if not isinstance(value, dict) or set(value) != {"numerator", "denominator"}:
        raise ReplayError(f"{label} must be a rational record")
    numerator, denominator = value["numerator"], value["denominator"]
    if (
        not isinstance(numerator, str) or _INTEGER_TEXT.fullmatch(numerator) is None
        or not isinstance(denominator, str) or _POSITIVE_INTEGER_TEXT.fullmatch(denominator) is None
    ):
        raise ReplayError(f"{label} contains noncanonical integer text")
    result = Fraction(int(numerator), int(denominator))
    if _rational(result) != value:
        raise ReplayError(f"{label} is not a reduced canonical rational")
    return result


def _validate_all_rationals(value: Any, path: str = "payload") -> None:
    if isinstance(value, dict):
        if set(value) == {"numerator", "denominator"}:
            _parse_rational(value, path)
            return
        for key, child in value.items():
            _validate_all_rationals(child, f"{path}.{key}")
    elif isinstance(value, list):
        for index, child in enumerate(value):
            _validate_all_rationals(child, f"{path}[{index}]")


def _encode(value: Any) -> Any:
    if isinstance(value, Fraction):
        return _rational(value)
    if isinstance(value, (tuple, list)):
        return [_encode(child) for child in value]
    if isinstance(value, dict):
        return {key: _encode(child) for key, child in value.items()}
    return value


def _safe_relative_path(value: Any, label: str) -> str:
    if not isinstance(value, str) or not value:
        raise ReplayError(f"{label} must be a nonempty relative path")
    path = Path(value)
    if path.is_absolute() or ".." in path.parts or value != path.as_posix():
        raise ReplayError(f"unsafe {label}: {value!r}")
    return value


def _reject_promoted_claims(value: Any, path: str) -> None:
    forbidden = (
        "rh_proved", "equation_5_2_claimed", "signed_sector_floor_claimed",
        "determinant_limit_claimed", "physical_coframe_claimed",
        "matched_prolate_coframe_inferred", "actual_prolate_determinant_nonzero_claimed",
        "locally_uniform_determinant_convergence_claimed",
        "central_probe_promoted_to_schedule_certificate",
        "sqrt_schedule_projection_promoted_to_residual_gap_limit",
        "source_gram_replaced_by_identity", "environment_secret_read", "api_key_read",
    )
    if isinstance(value, dict):
        for key, child in value.items():
            normalized = key.lower().replace("-", "_").replace(" ", "_")
            if any(fragment in normalized for fragment in forbidden) and child is not False:
                raise ReplayError(f"promoted claim rejected at {path}.{key}")
            _reject_promoted_claims(child, f"{path}.{key}")
    elif isinstance(value, list):
        for index, child in enumerate(value):
            _reject_promoted_claims(child, f"{path}[{index}]")


def _validate_lock_claim_boundary(lock: dict[str, Any]) -> None:
    boundary = lock.get("claim_boundary")
    if not isinstance(boundary, dict) or set(boundary) != {"proved", "not_proved"}:
        raise ReplayError("source-lock claim boundary is malformed")
    proved, not_proved = boundary["proved"], boundary["not_proved"]
    if (
        not isinstance(proved, list) or not isinstance(not_proved, list)
        or any(not isinstance(item, str) or not item for item in proved + not_proved)
    ):
        raise ReplayError("source-lock claim lists are malformed")
    forbidden = (
        "the riemann hypothesis", "equation (5.2)",
        "locally uniform determinant convergence", "positive complete signed floor",
        "normalized tail theta<1 for the prescribed matched prolate",
    )
    for claim in proved:
        if any(fragment in claim.lower() for fragment in forbidden):
            raise ReplayError(f"promoted proved claim in source lock: {claim}")


def _validate_source_lock(root: Path) -> tuple[dict[str, Any], dict[str, Any]]:
    if _SHA256.fullmatch(EXPECTED_SOURCE_LOCK_SHA256) is None:
        raise ReplayError("source-lock hash placeholder has not been pinned")
    raw = _read_bytes(root / SOURCE_LOCK_PATH, "source lock")
    if _sha256_bytes(raw) != EXPECTED_SOURCE_LOCK_SHA256:
        raise ReplayError("source-lock byte hash mismatch")
    lock = _strict_json_loads(raw, "source lock")
    expected_top = {
        "schema", "claim_class", "terminal_state", "updated_date",
        "external_sources", "dependencies", "locked_conventions",
        "locked_formulas", "claim_boundary", "source_admissions",
    }
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ReplayError("source-lock inventory mismatch")
    if lock["schema"] != SOURCE_LOCK_SCHEMA or lock["claim_class"] != CLAIM_CLASS:
        raise ReplayError("source-lock schema or claim class mismatch")
    if lock["terminal_state"] != TERMINAL_STATE:
        raise ReplayError("source-lock terminal-state promotion rejected")
    if lock["external_sources"] != []:
        raise ReplayError("unexpected external source in source lock")
    if not isinstance(lock["updated_date"], str) or not lock["updated_date"]:
        raise ReplayError("source-lock update date is invalid")
    for field in ("locked_conventions", "locked_formulas"):
        if not isinstance(lock[field], dict) or not lock[field] or any(
            not isinstance(key, str) or not isinstance(item, str)
            for key, item in lock[field].items()
        ):
            raise ReplayError(f"source-lock {field} is malformed")
    admissions = lock["source_admissions"]
    if (
        not isinstance(admissions, dict) or not admissions
        or any(type(item) is not bool for item in admissions.values())
        or any(admissions.values())
    ):
        raise ReplayError("source-lock admission violates the claim boundary")
    _validate_lock_claim_boundary(lock)
    _reject_promoted_claims(lock, "source_lock")
    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list) or not dependencies:
        raise ReplayError("source-lock dependencies are missing")
    hashes: dict[str, str] = {}
    for index, item in enumerate(dependencies):
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ReplayError(f"source-lock dependency {index} is malformed")
        relative = _safe_relative_path(item["path"], f"dependency {index} path")
        expected, role = item["sha256"], item["role"]
        if (
            not isinstance(expected, str) or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str) or not role or relative in hashes
            or relative == SOURCE_LOCK_PATH
        ):
            raise ReplayError(f"source-lock dependency {index} fields are invalid")
        actual = _sha256_bytes(_read_bytes(root / relative, f"dependency {relative}"))
        if actual != expected:
            raise ReplayError(f"source-lock dependency hash mismatch: {relative}")
        hashes[relative] = actual
    if set(hashes) != EXPECTED_DEPENDENCY_PATHS:
        raise ReplayError("source-lock dependency path inventory mismatch")
    binding = {
        "path": SOURCE_LOCK_PATH,
        "sha256": _sha256_bytes(raw),
        "schema": SOURCE_LOCK_SCHEMA,
        "dependency_hashes": dict(sorted(hashes.items())),
    }
    return binding, lock


def _shape(matrix: Matrix) -> tuple[int, int]:
    height = len(matrix)
    width = len(matrix[0]) if height else 0
    if any(len(row) != width for row in matrix):
        raise ReplayError("ragged exact matrix")
    return height, width


def _eye(size: int) -> Matrix:
    return [[Fraction(row == column) for column in range(size)] for row in range(size)]


def _diagonal(values: list[Fraction]) -> Matrix:
    return [[values[row] if row == column else Fraction(0)
             for column in range(len(values))] for row in range(len(values))]


def _T(matrix: Matrix) -> Matrix:
    rows, columns = _shape(matrix)
    return [[matrix[row][column] for row in range(rows)] for column in range(columns)]


def _product(left: Matrix, right: Matrix) -> Matrix:
    lr, lc = _shape(left)
    rr, rc = _shape(right)
    if lc != rr:
        raise ReplayError("exact matrix product dimension mismatch")
    answer: Matrix = []
    for row in range(lr):
        answer_row: list[Fraction] = []
        for column in range(rc):
            answer_row.append(sum(
                (left[row][middle] * right[middle][column] for middle in range(lc)),
                Fraction(0),
            ))
        answer.append(answer_row)
    return answer


def _plus(left: Matrix, right: Matrix) -> Matrix:
    if _shape(left) != _shape(right):
        raise ReplayError("exact matrix sum dimension mismatch")
    return [[a + b for a, b in zip(lrow, rrow)] for lrow, rrow in zip(left, right)]


def _minus(left: Matrix, right: Matrix) -> Matrix:
    if _shape(left) != _shape(right):
        raise ReplayError("exact matrix difference dimension mismatch")
    return [[a - b for a, b in zip(lrow, rrow)] for lrow, rrow in zip(left, right)]


def _times(matrix: Matrix, scalar: Fraction) -> Matrix:
    return [[scalar * value for value in row] for row in matrix]


def _rank_one(vector: list[Fraction]) -> Matrix:
    return [[left * right for right in vector] for left in vector]


def _inv(matrix: Matrix) -> Matrix:
    n, m = _shape(matrix)
    if n == 0 or n != m:
        raise ReplayError("exact inverse requires a square matrix")
    work = [row[:] + unit[:] for row, unit in zip(matrix, _eye(n))]
    for column in range(n):
        pivot = next((row for row in range(column, n) if work[row][column]), None)
        if pivot is None:
            raise ReplayError("singular exact matrix")
        work[column], work[pivot] = work[pivot], work[column]
        scale = work[column][column]
        work[column] = [entry / scale for entry in work[column]]
        for row in range(n):
            if row == column:
                continue
            coefficient = work[row][column]
            work[row] = [a - coefficient * b for a, b in zip(work[row], work[column])]
    return [row[n:] for row in work]


def _det(matrix: Matrix) -> Fraction:
    n, m = _shape(matrix)
    if n != m:
        raise ReplayError("determinant requires a square matrix")
    work = [row[:] for row in matrix]
    result = Fraction(1)
    for column in range(n):
        pivot = next((row for row in range(column, n) if work[row][column]), None)
        if pivot is None:
            return Fraction(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            result = -result
        diagonal = work[column][column]
        result *= diagonal
        for row in range(column + 1, n):
            ratio = work[row][column] / diagonal
            for index in range(column + 1, n):
                work[row][index] -= ratio * work[column][index]
    return result


def _minors(matrix: Matrix) -> list[Fraction]:
    n, m = _shape(matrix)
    if n != m:
        raise ReplayError("principal minors require a square matrix")
    return [_det([[matrix[i][j] for j in subset] for i in subset])
            for size in range(1, n + 1)
            for subset in itertools.combinations(range(n), size)]


def _tr(matrix: Matrix) -> Fraction:
    n, m = _shape(matrix)
    if n != m:
        raise ReplayError("trace requires a square matrix")
    return sum((matrix[i][i] for i in range(n)), Fraction(0))


def _quad(vector: list[Fraction], matrix: Matrix) -> Fraction:
    return _product(_product([vector], matrix), [[entry] for entry in vector])[0][0]


def _clip_record(diagonal: list[Fraction], order: int) -> dict[str, Any]:
    cap, nu, dimension = Fraction(5), Fraction(3), 4
    defect = [max(Fraction(0), cap - value) for value in diagonal]
    moment = sum((value**order for value in defect), Fraction(0))
    source_cap = dimension * (cap - nu) ** order
    return {
        "A": _diagonal(diagonal),
        "order_r": order,
        "clipped_defect_diagonal": defect,
        "trace_clipped_defect_power": moment,
        "source_moment_cap": source_cap,
        "source_moment_hypothesis": moment <= source_cap,
        "strict_target_power_test": source_cap < (cap - 1) ** order,
        "actual_minimum": min(diagonal),
    }


def _ideal_clip_model() -> dict[str, Any]:
    boundary = _clip_record([Fraction(1), Fraction(5), Fraction(5), Fraction(5)], 2)
    outlier = _clip_record([Fraction(1), Fraction(500), Fraction(5), Fraction(5)], 2)
    strict = _clip_record([Fraction(3), Fraction(5), Fraction(5), Fraction(5)], 3)
    if (
        boundary["trace_clipped_defect_power"] != 16
        or boundary["source_moment_cap"] != 16
        or boundary["actual_minimum"] != 1
        or boundary["strict_target_power_test"]
        or boundary["clipped_defect_diagonal"] != outlier["clipped_defect_diagonal"]
        or not strict["source_moment_hypothesis"]
        or not strict["strict_target_power_test"]
        or strict["actual_minimum"] <= 1
    ):
        raise ReplayError("independent clipped-defect model failed")
    return {
        "dimension_d": 4,
        "L": Fraction(1),
        "M": Fraction(5),
        "mu": Fraction(1),
        "nu": Fraction(3),
        "threshold_ratio": Fraction(2),
        "r_star": 2,
        "least_integer_strict_order": 3,
        "boundary_equality_rejected": {**boundary, "strict_pass": False},
        "strict_order_model": strict,
        "positive_outlier_reference": boundary,
        "positive_outlier_raised_to_500": outlier,
        "clipped_defect_is_positive_outlier_invariant": True,
        "upper_bound_A_le_M_assumed": False,
    }


def _soft_leverage_model() -> dict[str, Any]:
    positive = [[Fraction(1), Fraction(1)], [Fraction(1), Fraction(1)]]
    negative = _diagonal([Fraction(4), Fraction(0)])
    block = _minus(_plus(_times(_eye(2), Fraction(5)), positive), negative)
    commutator = _minus(_product(positive, negative), _product(negative, positive))

    multiplier = _diagonal([Fraction(8), Fraction(2), Fraction(1)])
    excess = _diagonal([Fraction(5), Fraction(0), Fraction(0)])
    captured = [Fraction(1), Fraction(0), Fraction(0)]
    rotated = [Fraction(3, 5), Fraction(4, 5), Fraction(0)]
    captured_h = _minus(_eye(3), _rank_one(captured))
    rotated_h = _minus(_eye(3), _rank_one(rotated))
    captured_excess = _tr(_product(captured_h, excess))
    rotated_excess = _tr(_product(rotated_h, excess))
    signed_base = _minus(_times(_eye(3), Fraction(6)), multiplier)
    rotated_compression = _product(_product(rotated_h, signed_base), rotated_h)
    h_direction = [Fraction(-4, 5), Fraction(3, 5), Fraction(0)]
    true_rotated = _quad(h_direction, rotated_compression)
    if (
        block != [[Fraction(2), Fraction(1)], [Fraction(1), Fraction(6)]]
        or commutator == [[Fraction(0), Fraction(0)], [Fraction(0), Fraction(0)]]
        or captured_excess != 0 or rotated_excess != Fraction(16, 5)
        or 6 - 3 - rotated_excess != Fraction(-1, 5)
        or true_rotated != Fraction(4, 25)
        or Fraction(1, 27) * 3**3 != 1
    ):
        raise ReplayError("independent source-soft/leverage model failed")
    return {
        "noncommuting_soft_block": {
            "g": Fraction(5),
            "T_a_positive": positive,
            "T_v_negative": negative,
            "B_plus_without_pole": block,
            "commutator_Ta_Tv": commutator,
            "characteristic_polynomial": "x^2-8*x+11",
            "eigenvalue_formula": ["4-sqrt(5)", "4+sqrt(5)"],
            "clipped_square_moment_formula": "(1+sqrt(5))^2=6+2*sqrt(5)",
            "target_defect_power": Fraction(16),
            "strict_floor_one_witness": "sqrt(5)<3 because 5<9",
            "commutation_assumed": False,
        },
        "leverage_excess_orientation": {
            "T_v": multiplier,
            "g": Fraction(6),
            "tau": Fraction(3),
            "positive_excess_operator_Tv_minus_tau": excess,
            "captured_K_unit_vector": captured,
            "captured_H_projector": captured_h,
            "captured_excess_trace": captured_excess,
            "captured_scalar_lower_bound": Fraction(3),
            "rotated_K_unit_vector": rotated,
            "rotated_H_projector": rotated_h,
            "rotated_excess_trace": rotated_excess,
            "rotated_scalar_lower_bound": Fraction(-1, 5),
            "rotated_true_minimum_on_H": true_rotated,
            "orientation_is_mandatory": True,
        },
        "sharp_scalar_excess_moment": {
            "r": 3,
            "tau": Fraction(2),
            "sharp_constant": Fraction(1, 27),
            "equality_x": Fraction(3),
            "positive_excess_at_equality": Fraction(1),
            "constant_times_x_power": Fraction(1),
            "global_factorization": "x^3/27-x+2=(x-3)^2*(x+6)/27 for x>=2",
            "factorization_coefficients_low_to_high": [
                Fraction(2), Fraction(-1), Fraction(0), Fraction(1, 27)
            ],
            "equality_is_sharp_not_strict": True,
        },
    }


def _odd_cap_model() -> dict[str, Any]:
    remainder = _diagonal([Fraction(0), Fraction(3)])
    base = _minus(_times(_eye(2), Fraction(5)), remainder)
    p = [Fraction(1, 2), Fraction(1, 2)]
    mu0 = _quad(p, _eye(2))
    rho1 = _quad(p, remainder)
    annihilator = _product(
        _product(_minus(_times(_eye(2), Fraction(3)), remainder), remainder),
        _inv(base),
    )
    chi = _quad(p, annihilator)
    load = 2 * _quad(p, _inv(base))
    formula_load = 2 * (2 * mu0 + rho1 - chi) / 10
    delta = Fraction(1, 2)
    signed = _minus(base, _times(_rank_one(p), Fraction(2)))
    reserve = _minus(signed, _eye(2))
    equality_p = [Fraction(0), Fraction(1)]
    equality_load = 2 * _quad(equality_p, _inv(base))
    equality_signed = _minus(base, _times(_rank_one(equality_p), Fraction(2)))
    if (
        mu0 != Fraction(1, 2) or rho1 != Fraction(3, 4) or chi != 0
        or load != Fraction(7, 20) or formula_load != load
        or min(_minors(reserve)) <= 0 or equality_load != 1
        or _det(equality_signed) != 0
    ):
        raise ReplayError("independent capped odd rank-one model failed")
    return {
        "strict_reserve_model": {
            "c": Fraction(5), "a": Fraction(2), "L": Fraction(1),
            "R": remainder,
            "R_squared": _product(remainder, remainder),
            "rho_cap_times_R": _times(remainder, Fraction(3)),
            "M0": base, "p": p,
            "mu0_norm_p_squared": mu0,
            "rho1_p_R_p": rho1,
            "chi_operator": annihilator,
            "chi": chi,
            "load_direct": load,
            "load_from_capped_identity": formula_load,
            "delta": delta,
            "reserve_condition_lhs": rho1 + 2 * mu0,
            "reserve_condition_rhs": Fraction(5, 2),
            "reserve_condition_holds": True,
            "M0_minus_2pp": signed,
            "M0_minus_2pp_minus_delta_a_L_I": reserve,
            "reserve_principal_minors": _minors(reserve),
        },
        "load_one_equality_rejection": {
            "M0": base, "p": equality_p, "load": equality_load,
            "M0_minus_2pp": equality_signed,
            "determinant": _det(equality_signed),
            "strict_pass": False,
        },
    }


def _angle_model() -> dict[str, Any]:
    one = [Fraction(1)] * 4
    e = _diagonal([Fraction(1), Fraction(1), Fraction(1), Fraction(0)])
    one_e = [row[0] for row in _product(e, [[x] for x in one])]
    s = sum((x * x for x in one_e), Fraction(0))
    factor = Fraction(4, 3)
    z = [
        [Fraction(1, 2), Fraction(1, 2), Fraction(-1, 2), Fraction(-1, 2)],
        [Fraction(1, 2), Fraction(-1, 2), Fraction(1, 2), Fraction(-1, 2)],
    ]
    t = _product(_diagonal([Fraction(2), Fraction(3)]), z)
    r = _product(t, _T(t))
    c = [[Fraction(1), Fraction(1)], [Fraction(-1), Fraction(0)],
         [Fraction(0), Fraction(-1)], [Fraction(0), Fraction(0)]]
    b = _product(_T(c), c)
    p_f = _product(_product(c, _inv(b)), _T(c))
    e_tail = _product(_product(z, _minus(_eye(4), e)), _T(z))
    e_tail_determinant = _det(e_tail)
    raw_norm = _tr(e_tail)
    theta = factor * raw_norm
    frame = _product(_product(z, p_f), _T(z))
    w = _product(t, c)
    raw_det = _det(w)
    volume = raw_det**2 / (_det(b) * _det(r))
    if (
        _product(z, _T(z)) != _eye(2) or s != 3
        or min(_minors(e_tail)) < 0 or e_tail_determinant != 0
        or raw_norm != Fraction(1, 2)
        or theta != Fraction(2, 3) or b != [[Fraction(2), Fraction(1)], [Fraction(1), Fraction(2)]]
        or raw_det != -6 or _det(frame) != Fraction(1, 3)
        or volume != Fraction(1, 3) or (1 - theta) ** 2 != Fraction(1, 9)
    ):
        raise ReplayError("independent principal-angle model failed")
    return {
        "ambient_one_vector": one,
        "E_projector": e,
        "P_E_one": one_e,
        "s_norm_P_E_one_squared": s,
        "lambda_fixture": Fraction(2),
        "factor_2lambda_over_s": factor,
        "Z_coisometry": z,
        "Z_Z_star": _product(z, _T(z)),
        "T_equals_diag_2_3_Z": t,
        "R_TT_star": r,
        "source_columns_C": c,
        "source_gram_B": b,
        "det_source_gram_B": _det(b),
        "F_projector_C_B_inverse_C_star": p_f,
        "raw_E_tail": e_tail,
        "raw_E_tail_determinant": e_tail_determinant,
        "raw_E_tail_is_positive_rank_one": True,
        "raw_E_tail_operator_norm": raw_norm,
        "Theta": theta,
        "Theta_strictly_below_one": True,
        "physical_columns_W_TC": w,
        "raw_physical_determinant_D": raw_det,
        "whitened_frame_Z_PF_Z_star": frame,
        "whitened_volume_direct": _det(frame),
        "whitened_volume_from_determinants": volume,
        "angle_lower_bound_one_minus_Theta_power_dimX": Fraction(1, 9),
        "boundary_Theta_one_is_rejected": True,
        "matched_prolate_coframe_inferred": False,
    }


def _augmented_model() -> dict[str, Any]:
    raw = [[Fraction(2), Fraction(3), Fraction(5)],
           [Fraction(1), Fraction(4), Fraction(2)],
           [Fraction(0), Fraction(1), Fraction(3)]]
    corrected = [
        [raw[row][column] - raw[0][column] / raw[0][0] * raw[row][0]
         for column in (1, 2)]
        for row in (1, 2)
    ]
    odd = [[-entry for entry in row] for row in corrected]
    raw_one = [[Fraction(2), Fraction(3)], [Fraction(1), Fraction(4)]]
    plus_one = raw_one[1][1] - raw_one[0][1] / raw_one[0][0] * raw_one[1][0]
    if (
        _det(raw) != 16 or _det(corrected) != 8 or _det(odd) != 8
        or plus_one != Fraction(5, 2) or -plus_one != Fraction(-5, 2)
    ):
        raise ReplayError("independent augmented determinant model failed")
    return {
        "dimension_N_2": {
            "raw_augmented_matrix_integral_row_first": raw,
            "integrals_I0_I1_I2": raw[0],
            "raw_determinant": _det(raw),
            "plus_corrected_physical_matrix": corrected,
            "plus_corrected_determinant": _det(corrected),
            "plus_det_augmented_over_I0": _det(raw) / raw[0][0],
            "odd_columns_are_negatives_of_plus_corrected": odd,
            "odd_sign_factor_minus_one_power_N": Fraction(1),
            "odd_corrected_determinant": _det(odd),
            "odd_signed_det_augmented_over_I2": _det(raw) / raw[0][0],
        },
        "dimension_N_1_sign_regression": {
            "raw_augmented_matrix": raw_one,
            "raw_determinant": _det(raw_one),
            "plus_corrected_scalar": plus_one,
            "odd_sign_factor_minus_one_power_N": Fraction(-1),
            "odd_corrected_scalar": -plus_one,
            "odd_signed_det_augmented_over_I2": -_det(raw_one) / raw_one[0][0],
        },
        "actual_prolate_determinant_nonzero_claimed": False,
        "locally_uniform_determinant_convergence_claimed": False,
    }


def _precision_bits(dps: int) -> int:
    return (
        dps * _LOG2_10_UPPER_NUMERATOR + _LOG2_10_UPPER_DENOMINATOR - 1
    ) // _LOG2_10_UPPER_DENOMINATOR


def _raw_mpf_fraction(raw: Any, label: str) -> Fraction:
    if not isinstance(raw, tuple) or len(raw) != 4:
        raise ReplayError(f"{label} is not a raw mpmath endpoint")
    sign, mantissa, exponent, bit_count = raw
    if sign not in (0, 1) or not all(isinstance(item, int) for item in raw):
        raise ReplayError(f"{label} raw endpoint fields are invalid")
    if mantissa < 0 or bit_count < 0:
        raise ReplayError(f"{label} raw endpoint is invalid")
    if mantissa == 0:
        if (sign, exponent, bit_count) != (0, 0, 0):
            raise ReplayError(f"{label} raw zero is noncanonical")
        return Fraction(0)
    if mantissa % 2 == 0 or mantissa.bit_length() != bit_count:
        raise ReplayError(f"{label} raw dyadic is not normalized")
    numerator = -mantissa if sign else mantissa
    return (
        Fraction(numerator * (1 << exponent))
        if exponent >= 0 else Fraction(numerator, 1 << (-exponent))
    )


def _fraction_to_raw(value: Fraction) -> tuple[int, int, int, int]:
    if value == 0:
        return (0, 0, 0, 0)
    denominator = value.denominator
    if denominator & (denominator - 1):
        raise ReplayError("submitted interval endpoint is not dyadic")
    sign = 1 if value < 0 else 0
    mantissa = abs(value.numerator)
    exponent = -(denominator.bit_length() - 1)
    while mantissa % 2 == 0:
        mantissa //= 2
        exponent += 1
    return (sign, mantissa, exponent, mantissa.bit_length())


def _mpf_from_raw(raw: tuple[int, int, int, int], dps: int) -> Any:
    with mp.workprec(max(_precision_bits(dps) + 64, raw[3] + 16)):
        return +mp.mpf(raw)


def _parse_dyadic(value: Any, label: str, dps: int) -> Fraction:
    if not isinstance(value, list) or len(value) != 4:
        raise ReplayError(f"{label} must be a four-part dyadic")
    sign, mantissa_text, exponent, bit_count = value
    if isinstance(sign, bool) or sign not in (0, 1):
        raise ReplayError(f"{label} sign is invalid")
    if not isinstance(mantissa_text, str) or _UNSIGNED_INTEGER_TEXT.fullmatch(mantissa_text) is None:
        raise ReplayError(f"{label} mantissa is noncanonical")
    if isinstance(exponent, bool) or not isinstance(exponent, int):
        raise ReplayError(f"{label} exponent is invalid")
    if isinstance(bit_count, bool) or not isinstance(bit_count, int) or bit_count < 0:
        raise ReplayError(f"{label} bit count is invalid")
    mantissa = int(mantissa_text)
    if mantissa == 0:
        if (sign, exponent, bit_count) != (0, 0, 0):
            raise ReplayError(f"{label} zero is noncanonical")
        return Fraction(0)
    if mantissa % 2 == 0 or mantissa.bit_length() != bit_count:
        raise ReplayError(f"{label} dyadic is not normalized")
    bits = _precision_bits(dps)
    if bit_count > bits + 192 or abs(exponent) > 20 * bits + 4096:
        raise ReplayError(f"{label} exceeds the precision budget")
    numerator = -mantissa if sign else mantissa
    return (
        Fraction(numerator * (1 << exponent))
        if exponent >= 0 else Fraction(numerator, 1 << (-exponent))
    )


def _submitted_interval(value: Any, label: str, dps: int) -> tuple[Fraction, Fraction]:
    if not isinstance(value, dict) or set(value) != {"decimal", "dyadic"}:
        raise ReplayError(f"{label} interval inventory mismatch")
    decimal, dyadic = value["decimal"], value["dyadic"]
    if (
        not isinstance(decimal, list) or len(decimal) != 2
        or any(not isinstance(item, str) or _DECIMAL_TEXT.fullmatch(item) is None for item in decimal)
        or not isinstance(dyadic, dict) or set(dyadic) != {"lower", "upper"}
    ):
        raise ReplayError(f"{label} interval serialization is malformed")
    lower = _parse_dyadic(dyadic["lower"], f"{label}.lower", dps)
    upper = _parse_dyadic(dyadic["upper"], f"{label}.upper", dps)
    if lower > upper:
        raise ReplayError(f"{label} interval is reversed")
    with mp.workdps(dps + 20):
        expected_decimal = [
            mp.nstr(_mpf_from_raw(_fraction_to_raw(lower), dps), dps + 10),
            mp.nstr(_mpf_from_raw(_fraction_to_raw(upper), dps), dps + 10),
        ]
    if decimal != expected_decimal:
        raise ReplayError(f"{label} decimal text does not match its dyadics")
    return lower, upper


def _interval_bounds(value: Any, label: str) -> tuple[Fraction, Fraction]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    return (
        _raw_mpf_fraction(tuple(lower), f"{label} lower"),
        _raw_mpf_fraction(tuple(upper), f"{label} upper"),
    )


def _check_enclosure(submitted: Any, independent: Any, label: str, dps: int) -> None:
    submitted_lower, submitted_upper = _submitted_interval(submitted, label, dps)
    independent_lower, independent_upper = _interval_bounds(independent, label)
    if not submitted_lower <= independent_lower <= independent_upper <= submitted_upper:
        raise ReplayError(f"{label} does not enclose the independent replay")
    scale = max(Fraction(1), abs(independent_lower), abs(independent_upper))
    exponent = _precision_bits(dps) - 64
    width_limit = scale * (
        Fraction(1, 1 << exponent) if exponent >= 0 else Fraction(1 << (-exponent))
    )
    if submitted_upper - submitted_lower > width_limit:
        raise ReplayError(f"{label} interval is excessively wide")


def _iv_fraction(value: Fraction) -> Any:
    return mp.iv.mpf(value.numerator) / mp.iv.mpf(value.denominator)


def _hull(lower: Fraction, upper: Fraction) -> Any:
    lo = _iv_fraction(lower)._mpi_[0]  # type: ignore[attr-defined]
    hi = _iv_fraction(upper)._mpi_[1]  # type: ignore[attr-defined]
    return mp.iv.mpf((lo, hi))


def _alternating_enclosure(generator: Any, bits: int) -> Any:
    partial = Fraction(0)
    stream = iter(generator)
    while True:
        first = next(stream)
        partial += first
        second = next(stream)
        if abs(second) < Fraction(1, 2**bits):
            return _hull(min(partial, partial + second), max(partial, partial + second))
        partial += second


def _zeta3(dps: int) -> Any:
    def summands() -> Any:
        index = 1
        sign = 1
        while True:
            yield Fraction(5 * sign, 2 * index**3 * comb(2 * index, index))
            index += 1
            sign = -sign
    return _alternating_enclosure(summands(), _precision_bits(dps) + 96)


def _plus_band(dps: int) -> Any:
    # Directly integrate 2*(1-cos(s))/s^2 over [0,1], then divide by pi.
    def summands() -> Any:
        k = 1
        while True:
            yield Fraction(2 * (-1) ** (k + 1), factorial(2 * k) * (2 * k - 1))
            k += 1
    integral = _alternating_enclosure(summands(), _precision_bits(dps) + 96)
    return integral / mp.iv.pi


def _sin2_weighted(j: int, dps: int) -> Any:
    def summands() -> Any:
        k = 1
        while True:
            yield Fraction((-1) ** (k + 1), 2 * factorial(2 * k) * (2 * j + 2 * k + 1))
            k += 1
    return _alternating_enclosure(summands(), _precision_bits(dps) + 112)


def _minus_band(dps: int) -> Any:
    q = 1 / (4 * mp.iv.pi**2)
    q_upper = _raw_mpf_fraction(tuple(q._mpi_[1]), "q upper")  # type: ignore[attr-defined]
    tolerance = Fraction(1, 2 ** (_precision_bits(dps) + 96))
    stop = 1
    while True:
        omitted = q_upper**stop * ((stop + 1) - stop * q_upper) / (1 - q_upper) ** 2
        if omitted < tolerance:
            break
        stop += 1
    total = mp.iv.mpf(0)
    # Recompute q^j directly rather than using the producer recurrence.
    for j in range(stop):
        total += (j + 1) * q**j * _sin2_weighted(j, dps)
    total += _hull(Fraction(0), omitted)
    return 2 * total / mp.iv.pi**3


def _positive_part(value: Any) -> Any:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    lo = _raw_mpf_fraction(tuple(lower), "positive-part lower")
    hi = _raw_mpf_fraction(tuple(upper), "positive-part upper")
    if hi <= 0:
        return mp.iv.mpf(0)
    if lo >= 0:
        return value
    return mp.iv.mpf(((0, 0, 0, 0), upper))


def _theta_constant(length: Any, zeta_three: Any) -> Any:
    psi_quarter = -mp.iv.euler - mp.iv.pi / 2 - 3 * mp.iv.log(2)
    return (
        psi_quarter - mp.iv.log(mp.iv.pi)
        + (mp.iv.pi**3 + 28 * zeta_three) / (4 * length**2)
    )


def _central(length: Any, lam: Any, zeta_three: Any) -> dict[str, Any]:
    coefficient = mp.iv.mpf(461011) / 50000
    decay = mp.iv.mpf(2119209) / 2500000
    epsilon = coefficient * length**(mp.iv.mpf(3) / 2) * mp.iv.exp(-decay * mp.iv.sqrt(length))
    theta = _theta_constant(length, zeta_three)
    uncapped = 2 * mp.iv.cos(1) * (1 - epsilon) * lam - length - theta
    return {"epsilon": epsilon, "theta": theta, "uncapped": uncapped, "positive": _positive_part(uncapped)}


def _ceil_sqrt_lambda(p: int) -> int:
    result = isqrt((p + 1) // 2)
    while 2 * result * result < p:
        result += 1
    while result and 2 * (result - 1) * (result - 1) >= p:
        result -= 1
    return result


def _interval_targets(p: int, dps: int) -> dict[str, Any]:
    old = mp.iv.dps
    try:
        mp.iv.dps = dps
        lam = mp.iv.mpf(p) / 2
        ell = mp.iv.log(lam)
        length = 2 * ell
        schedule_n = _ceil_sqrt_lambda(p)
        projection = (mp.iv.mpf(6006) / 1000) * ell / (mp.iv.pi * (schedule_n + 1))
        root5 = mp.iv.sqrt(5)
        zeta_three = _zeta3(dps)
        plus_band = _plus_band(dps)
        minus_band = _minus_band(dps)
        schedule = _central(length, lam, zeta_three)
        probe_lambda = mp.iv.exp(200)
        probe = _central(mp.iv.mpf(400), probe_lambda, zeta_three)
        return {
            "noncommuting_soft_spectrum": {
                "sqrt_5": _IntervalTarget(root5),
                "lambda_min_4_minus_sqrt_5": _IntervalTarget(4 - root5),
                "lambda_max_4_plus_sqrt_5": _IntervalTarget(4 + root5),
                "clipped_square_moment_6_plus_2sqrt_5": _IntervalTarget((1 + root5) ** 2),
                "clipped_square_moment_at_most_16": True,
                "minimum_strictly_above_1": True,
            },
            "band_energies_delta_1": {
                "delta": Fraction(1),
                "b_plus": _IntervalTarget(plus_band),
                "b_minus": _IntervalTarget(minus_band),
                "both_strictly_positive": True,
                "fourier_transform_plus": "2*sin(s/2)/s with removable value 1 at s=0",
                "fourier_transform_minus": "4*sqrt(2)*pi*i*sin(s/2)/(s^2-4*pi^2)",
            },
            "sqrt_projection_schedule": {
                "lambda": Fraction(p, 2),
                "ell_log_lambda": _IntervalTarget(ell),
                "L_2log_lambda": _IntervalTarget(length),
                "N_rule": "ceil(sqrt(lambda))",
                "N": schedule_n,
                "C_K_safe_input_fraction_text": "6006/1000",
                "C_K_safe_rational": Fraction(6006, 1000),
                "projection_coefficient_CK_loglambda_over_pi_Nplus1": _IntervalTarget(projection),
                "signed_residual_or_coframe_transfer_claimed": False,
            },
            "central_outlier_schedule_diagnostic": {
                "lambda": Fraction(p, 2),
                "L": _IntervalTarget(length),
                "delta": Fraction(1), "C_B": Fraction(1),
                "PNT_A_exact_decimal": "9.22022",
                "PNT_alpha_exact_decimal": "0.8476836",
                "epsilon_L": _IntervalTarget(schedule["epsilon"]),
                "C_theta": _IntervalTarget(schedule["theta"]),
                "uncapped_lower_expression": _IntervalTarget(schedule["uncapped"]),
                "V_L_positive_part": _IntervalTarget(schedule["positive"]),
                "plus_Rayleigh_lower_b_plus_times_V_L": _IntervalTarget(plus_band * schedule["positive"]),
                "minus_Rayleigh_lower_b_minus_times_V_L": _IntervalTarget(minus_band * schedule["positive"]),
                "finite_diagnostic_only": True,
                "positive_signed_floor_claimed": False,
            },
            "central_formula_scale_probe": {
                "L_probe_exact": Fraction(400),
                "lambda_probe_exp_200": _IntervalTarget(probe_lambda),
                "delta": Fraction(1), "C_B": Fraction(1),
                "epsilon_L": _IntervalTarget(probe["epsilon"]),
                "epsilon_strictly_below_one": True,
                "C_theta": _IntervalTarget(probe["theta"]),
                "uncapped_lower_expression": _IntervalTarget(probe["uncapped"]),
                "V_L_positive_part": _IntervalTarget(probe["positive"]),
                "V_L_strictly_positive": True,
                "plus_Rayleigh_lower_b_plus_times_V_L": _IntervalTarget(plus_band * probe["positive"]),
                "minus_Rayleigh_lower_b_minus_times_V_L": _IntervalTarget(minus_band * probe["positive"]),
                "formula_scale_regression_only": True,
                "finite_prolate_or_Weil_certificate": False,
                "schedule_datum": False,
            },
            "special_constants": {
                "zeta_3_via_Apery_series": _IntervalTarget(zeta_three),
                "hurwitz_identity": "zeta(3,1/4)=pi^3+28*zeta(3)",
                "digamma_identity": "digamma(1/4)=-EulerGamma-pi/2-3*log(2)",
            },
        }
    finally:
        mp.iv.dps = old


def _target_bounds(target: Any, label: str) -> tuple[Fraction, Fraction]:
    if not isinstance(target, _IntervalTarget):
        raise ReplayError(f"{label} is not an independently reconstructed interval")
    return _interval_bounds(target.value, label)


def _validate_interval_semantics(targets: dict[str, Any]) -> None:
    """Derive every positive/strict interval boolean from independent endpoints."""

    try:
        spectrum = targets["noncommuting_soft_spectrum"]
        bands = targets["band_energies_delta_1"]
        probe = targets["central_formula_scale_probe"]
        minimum_lower, _ = _target_bounds(
            spectrum["lambda_min_4_minus_sqrt_5"], "independent minimum"
        )
        _, moment_upper = _target_bounds(
            spectrum["clipped_square_moment_6_plus_2sqrt_5"],
            "independent clipped moment",
        )
        plus_lower, _ = _target_bounds(bands["b_plus"], "independent plus band")
        minus_lower, _ = _target_bounds(bands["b_minus"], "independent minus band")
        _, epsilon_upper = _target_bounds(probe["epsilon_L"], "independent probe epsilon")
        v_lower, _ = _target_bounds(
            probe["V_L_positive_part"], "independent probe positive part"
        )
    except (KeyError, TypeError) as exc:
        raise ReplayError("independent interval semantic inventory mismatch") from exc
    if minimum_lower <= 1 or moment_upper > 16:
        raise ReplayError("independent soft-spectrum strict inequalities failed")
    if plus_lower <= 0 or minus_lower <= 0:
        raise ReplayError("independent band energies are not strictly positive")
    if epsilon_upper >= 1 or v_lower <= 0:
        raise ReplayError("independent central probe strict inequalities failed")


def _validate_interval_tree(actual: Any, expected: Any, path: str, dps: int) -> int:
    if isinstance(expected, _IntervalTarget):
        _check_enclosure(actual, expected.value, path, dps)
        return 1
    if isinstance(expected, Fraction):
        if _parse_rational(actual, path) != expected:
            raise ReplayError(f"{path} rational mismatch")
        return 0
    if isinstance(expected, dict):
        if not isinstance(actual, dict) or set(actual) != set(expected):
            raise ReplayError(f"{path} inventory mismatch")
        return sum(_validate_interval_tree(actual[key], expected[key], f"{path}.{key}", dps)
                   for key in expected)
    if isinstance(expected, list):
        if not isinstance(actual, list) or len(actual) != len(expected):
            raise ReplayError(f"{path} list mismatch")
        return sum(_validate_interval_tree(a, e, f"{path}[{i}]", dps)
                   for i, (a, e) in enumerate(zip(actual, expected)))
    if type(actual) is not type(expected) or actual != expected:
        raise ReplayError(f"{path} mismatch or claim promotion")
    return 0


def _canonical_input(value: Any, label: str, minimum: int) -> int:
    if not isinstance(value, str) or _POSITIVE_INTEGER_TEXT.fullmatch(value) is None:
        raise ReplayError(f"{label} must be canonical positive integer text")
    integer = int(value)
    if integer < minimum:
        raise ReplayError(f"{label} must be at least {minimum}")
    return integer


def _expected_checks() -> dict[str, bool]:
    return {
        "clipped_boundary_equality_rejected": True,
        "positive_outlier_invariance_exact": True,
        "noncommuting_soft_model_reconstructed": True,
        "leverage_orientation_loss_reconstructed": True,
        "scalar_excess_constant_sharp": True,
        "odd_capped_identity_exact": True,
        "odd_reserve_strict": True,
        "odd_load_one_rejected": True,
        "principal_angle_factor_exact": True,
        "source_gram_retained": True,
        "whitened_volume_exact": True,
        "augmented_column_operations_exact": True,
        "central_probe_not_promoted": True,
        "sqrt_schedule_not_promoted": True,
    }


def replay(payload: dict[str, Any], *, producer_bytes: bytes | None = None) -> dict[str, Any]:
    """Strictly replay a decoded payload bound to its exact producer bytes."""

    _validate_json(payload)
    if producer_bytes is None or not isinstance(producer_bytes, bytes):
        raise ReplayError("exact producer artifact bytes are required")
    decoded = _strict_json_loads(producer_bytes, "producer artifact bytes")
    if not _same_json(decoded, payload):
        raise ReplayError("producer bytes do not decode exactly to replay payload")
    if not isinstance(payload, dict):
        raise ReplayError("producer artifact must be a JSON object")
    expected_top = {
        "schema", "source_lock", "inputs", "terminal_state",
        "source_conventions", "claim_boundary", "certificate",
        "arithmetic_libraries",
    }
    if set(payload) != expected_top:
        raise ReplayError("producer top-level inventory mismatch")

    inputs = payload["inputs"]
    if not isinstance(inputs, dict) or set(inputs) != {
        "lambda_numerator_text", "lambda_denominator_text", "dps_text"
    }:
        raise ReplayError("input inventory mismatch")
    p = _canonical_input(inputs["lambda_numerator_text"], "lambda numerator", 5)
    denominator = _canonical_input(inputs["lambda_denominator_text"], "lambda denominator", 1)
    dps = _canonical_input(inputs["dps_text"], "interval precision", 50)
    if p > 999:
        raise ReplayError("lambda numerator exceeds the replay work budget")
    if dps > 10000:
        raise ReplayError("dps exceeds the replay work budget")
    if p % 2 == 0 or denominator != 2:
        raise ReplayError("locked odd half-integer schedule changed")

    source_lock, lock_document = _validate_source_lock(_root())
    fixed = {
        "schema": PRODUCER_SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "source_conventions": {
            "locked_conventions": lock_document["locked_conventions"],
            "locked_formulas": lock_document["locked_formulas"],
        },
        "claim_boundary": {
            "claim_class": CLAIM_CLASS,
            "proved": lock_document["claim_boundary"]["proved"],
            "not_proved": lock_document["claim_boundary"]["not_proved"],
            "source_admissions": lock_document["source_admissions"],
        },
        "arithmetic_libraries": ARITHMETIC_LIBRARIES,
    }
    for key, expected in fixed.items():
        _require_same(payload[key], expected, key)
    _require_same(payload["source_lock"], source_lock, "source-lock binding")
    _reject_promoted_claims(payload, "artifact")
    _validate_all_rationals(payload)

    certificate = payload["certificate"]
    expected_certificate_keys = {
        "ideal_clipped_defect", "source_soft_and_leverage",
        "capped_odd_rank_one", "principal_angle_coframe",
        "augmented_determinant", "transcendental_intervals", "checks",
    }
    if not isinstance(certificate, dict) or set(certificate) != expected_certificate_keys:
        raise ReplayError("certificate inventory mismatch")
    exact = {
        "ideal_clipped_defect": _ideal_clip_model(),
        "source_soft_and_leverage": _soft_leverage_model(),
        "capped_odd_rank_one": _odd_cap_model(),
        "principal_angle_coframe": _angle_model(),
        "augmented_determinant": _augmented_model(),
    }
    for key, expected in exact.items():
        _require_same(certificate[key], _encode(expected), key)
    checks = _expected_checks()
    _require_same(certificate["checks"], checks, "certificate checks")

    targets = _interval_targets(p, dps)
    _validate_interval_semantics(targets)
    interval_count = _validate_interval_tree(
        certificate["transcendental_intervals"], targets,
        "transcendental_intervals", dps,
    )
    clipped = exact["ideal_clipped_defect"]
    odd = exact["capped_odd_rank_one"]
    angle = exact["principal_angle_coframe"]
    if (
        clipped["boundary_equality_rejected"]["strict_pass"]
        or clipped["boundary_equality_rejected"]["actual_minimum"] != clipped["mu"] * clipped["L"]
        or odd["load_one_equality_rejection"]["strict_pass"]
        or odd["load_one_equality_rejection"]["load"] != 1
        or odd["load_one_equality_rejection"]["determinant"] != 0
        or angle["factor_2lambda_over_s"] != Fraction(4, 3)
        or angle["source_gram_B"] == _eye(2)
        or angle["Theta"] >= 1
        or any(lock_document["source_admissions"].values())
    ):
        raise ReplayError("strict theorem-boundary reconstruction failed")

    return {
        "schema": REPLAY_SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "producer_binding": {
            "byte_source": "exact producer artifact bytes",
            "byte_count": len(producer_bytes),
            "sha256": _sha256_bytes(producer_bytes),
        },
        "source_lock": source_lock,
        "inputs": dict(inputs),
        "reconstructed": {
            **{key: _encode(value) for key, value in exact.items()},
            "transcendental_interval_count": interval_count,
        },
        "checks": {
            "exact_producer_bytes_bound": True,
            "source_lock_hash_rebuilt_dynamically": True,
            "every_declared_dependency_rehashed": True,
            "duplicate_keys_rejected": True,
            "binary64_rejected": True,
            "producer_booleans_trusted": False,
            "formula_tree_independent": True,
            "interval_semantic_booleans_reconstructed": True,
            **checks,
        },
        "arithmetic_libraries": dict(ARITHMETIC_LIBRARIES),
        "claim_boundary": {
            "finite_reduction_only": True,
            "physical_source_soft_estimate": False,
            "actual_odd_directional_reserve": False,
            "matched_prolate_coframe": False,
            "signed_sector_floor": False,
            "equation_5_2": False,
            "locally_uniform_determinant_convergence": False,
            "riemann_hypothesis": False,
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    raw = _read_bytes(Path(args.input), "producer artifact")
    payload = _strict_json_loads(raw, "producer artifact")
    report = replay(payload, producer_bytes=raw)
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(
        json.dumps(report, indent=2, sort_keys=True, allow_nan=False) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
