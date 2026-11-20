#!/usr/bin/env python3
"""Clean-room replay for the matched breakpoint/directional-moment audit.

The replay imports no producer module and reads no environment variables.  It
binds the exact producer bytes, rejects duplicate keys and binary floating
point, rehashes the source lock and all dependencies, rebuilds every rational
fixture with ``Fraction``, and independently encloses every transcendental
formula with ``mpmath.iv``.
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


PRODUCER_SCHEMA = "xi-prolate-matched-breakpoint-directional-moment-v1"
REPLAY_SCHEMA = "xi-prolate-matched-breakpoint-directional-moment-replay-v1"
SOURCE_LOCK_PATH = "MATCHED_BREAKPOINT_DIRECTIONAL_MOMENT_SOURCE_LOCK.json"
SOURCE_LOCK_SCHEMA = (
    "xi-prolate-matched-breakpoint-directional-moment-source-lock-v1"
)
CLAIM_CLASS = "MATCHED_BREAKPOINT_DIRECTIONAL_MOMENT_AUDIT"
TERMINAL_STATE = "P0_INVALIDATED"
EXPECTED_SOURCE_LOCK_SHA256 = (
    "f60bf05e24d4503218ed34c05c5aa0236c1d331c472e068a2788882e2cafa750"
)
EXPECTED_DEPENDENCY_PATHS = {
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
    "precision_mode": (
        "exact reduced rationals plus outward arbitrary-precision intervals"
    ),
    "libraries": ["Python fractions.Fraction", f"mpmath.iv {mp.__version__}"],
    "raw_interval_or_ball_output_applicable": True,
    "shared_library_with_verifier": True,
    "independent_formula_trees_required": True,
    "serialization_guard": (
        "every nondegenerate interval is enlarged to a precision-scaled "
        "dyadic enclosure"
    ),
    "independence_limitation": (
        "producer and verifier share Python integer/Fraction arithmetic and "
        "the pinned mpmath.iv transcendental runtime"
    ),
}

Matrix = list[list[Fraction]]


class ReplayError(ValueError):
    """Raised on malformed input or a failed independent reconstruction."""


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


def _require_int(value: Any, label: str, minimum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise ReplayError(f"{label} must be an exact JSON integer")
    if value < minimum:
        raise ReplayError(f"{label} must be at least {minimum}")
    return value


def _rational(value: Fraction | int) -> dict[str, str]:
    item = value if isinstance(value, Fraction) else Fraction(value)
    return {
        "numerator": str(item.numerator),
        "denominator": str(item.denominator),
    }


def _parse_rational(value: Any, label: str) -> Fraction:
    if not isinstance(value, dict) or set(value) != {"numerator", "denominator"}:
        raise ReplayError(f"{label} must be a rational record")
    numerator = value["numerator"]
    denominator = value["denominator"]
    if (
        not isinstance(numerator, str)
        or _INTEGER_TEXT.fullmatch(numerator) is None
        or not isinstance(denominator, str)
        or _POSITIVE_INTEGER_TEXT.fullmatch(denominator) is None
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
    if isinstance(value, tuple):
        return [_encode(child) for child in value]
    if isinstance(value, list):
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
        "rh_proved",
        "equation_5_2_claimed",
        "signed_sector_floor_claimed",
        "determinant_limit_claimed",
        "physical_coframe_claimed",
        "finite_breakpoint_fixture_promoted_to_matched_coframe",
        "moment_conversion_promoted_to_physical_source_estimate",
    )
    if isinstance(value, dict):
        for key, child in value.items():
            normalized = key.lower().replace("-", "_").replace(" ", "_")
            if any(fragment in normalized for fragment in forbidden):
                if child is not False:
                    raise ReplayError(f"promoted claim rejected at {path}.{key}")
            _reject_promoted_claims(child, f"{path}.{key}")
    elif isinstance(value, list):
        for index, child in enumerate(value):
            _reject_promoted_claims(child, f"{path}[{index}]")


def _validate_lock_claim_boundary(lock: dict[str, Any]) -> None:
    boundary = lock.get("claim_boundary")
    if not isinstance(boundary, dict) or set(boundary) != {"proved", "not_proved"}:
        raise ReplayError("source-lock claim boundary is malformed")
    proved = boundary["proved"]
    not_proved = boundary["not_proved"]
    if (
        not isinstance(proved, list)
        or not isinstance(not_proved, list)
        or any(not isinstance(item, str) or not item for item in proved + not_proved)
    ):
        raise ReplayError("source-lock claim lists are malformed")
    forbidden = (
        "the riemann hypothesis",
        "equation (5.2)",
        "locally uniform determinant convergence",
        "positive complete signed floor",
        "matched coframe floor",
    )
    for claim in proved:
        if any(fragment in claim.lower() for fragment in forbidden):
            raise ReplayError(f"promoted proved claim in source lock: {claim}")


def _validate_source_lock(root: Path) -> tuple[dict[str, Any], dict[str, Any]]:
    lock_raw = _read_bytes(root / SOURCE_LOCK_PATH, "source lock")
    if _sha256_bytes(lock_raw) != EXPECTED_SOURCE_LOCK_SHA256:
        raise ReplayError("source-lock byte hash mismatch")
    lock = _strict_json_loads(lock_raw, "source lock")
    expected_top = {
        "schema", "claim_class", "terminal_state", "updated_date",
        "external_sources", "dependencies", "locked_conventions",
        "locked_formulas", "claim_boundary", "source_admissions",
    }
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ReplayError("source-lock inventory mismatch")
    if lock["schema"] != SOURCE_LOCK_SCHEMA:
        raise ReplayError("source-lock schema mismatch")
    if lock["claim_class"] != CLAIM_CLASS:
        raise ReplayError("source-lock claim class mismatch")
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
        not isinstance(admissions, dict)
        or not admissions
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
        expected = item["sha256"]
        role = item["role"]
        if (
            not isinstance(expected, str)
            or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str)
            or not role
            or relative in hashes
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
        "sha256": _sha256_bytes(lock_raw),
        "schema": SOURCE_LOCK_SCHEMA,
        "dependency_hashes": dict(sorted(hashes.items())),
    }
    return binding, lock


def _shape(matrix: Matrix) -> tuple[int, int]:
    rows = len(matrix)
    columns = len(matrix[0]) if rows else 0
    if any(len(row) != columns for row in matrix):
        raise ReplayError("ragged exact matrix")
    return rows, columns


def _identity(size: int) -> Matrix:
    return [[Fraction(i == j) for j in range(size)] for i in range(size)]


def _diagonal(values: list[Fraction]) -> Matrix:
    return [
        [value if i == j else Fraction(0) for j in range(len(values))]
        for i, value in enumerate(values)
    ]


def _transpose(matrix: Matrix) -> Matrix:
    rows, columns = _shape(matrix)
    return [[matrix[i][j] for i in range(rows)] for j in range(columns)]


def _matmul(left: Matrix, right: Matrix) -> Matrix:
    left_rows, left_columns = _shape(left)
    right_rows, right_columns = _shape(right)
    if left_columns != right_rows:
        raise ReplayError("exact matrix product dimension mismatch")
    return [
        [
            sum(
                (left[i][k] * right[k][j] for k in range(left_columns)),
                Fraction(0),
            )
            for j in range(right_columns)
        ]
        for i in range(left_rows)
    ]


def _add(left: Matrix, right: Matrix) -> Matrix:
    if _shape(left) != _shape(right):
        raise ReplayError("exact matrix addition dimension mismatch")
    return [[a + b for a, b in zip(x, y)] for x, y in zip(left, right)]


def _subtract(left: Matrix, right: Matrix) -> Matrix:
    if _shape(left) != _shape(right):
        raise ReplayError("exact matrix subtraction dimension mismatch")
    return [[a - b for a, b in zip(x, y)] for x, y in zip(left, right)]


def _scale(matrix: Matrix, scalar: Fraction) -> Matrix:
    return [[scalar * entry for entry in row] for row in matrix]


def _outer(vector: list[Fraction]) -> Matrix:
    return [[left * right for right in vector] for left in vector]


def _inverse(matrix: Matrix) -> Matrix:
    rows, columns = _shape(matrix)
    if rows == 0 or rows != columns:
        raise ReplayError("inverse requires a nonempty square matrix")
    work = [
        row[:] + [Fraction(i == j) for j in range(rows)]
        for i, row in enumerate(matrix)
    ]
    for column in range(rows):
        pivot = next(
            (row for row in range(column, rows) if work[row][column]), None
        )
        if pivot is None:
            raise ReplayError("singular exact matrix")
        work[column], work[pivot] = work[pivot], work[column]
        divisor = work[column][column]
        work[column] = [entry / divisor for entry in work[column]]
        for row in range(rows):
            if row == column:
                continue
            multiplier = work[row][column]
            work[row] = [
                a - multiplier * b for a, b in zip(work[row], work[column])
            ]
    return [row[rows:] for row in work]


def _power(matrix: Matrix, exponent: int) -> Matrix:
    rows, columns = _shape(matrix)
    if rows != columns or exponent < 0:
        raise ReplayError("invalid exact matrix power")
    result = _identity(rows)
    for _ in range(exponent):
        result = _matmul(result, matrix)
    return result


def _determinant(matrix: Matrix) -> Fraction:
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ReplayError("determinant requires a square matrix")
    result = Fraction(0)
    for permutation in itertools.permutations(range(rows)):
        inversions = sum(
            permutation[i] > permutation[j]
            for i in range(rows)
            for j in range(i + 1, rows)
        )
        term = Fraction(-1 if inversions % 2 else 1)
        for i, j in enumerate(permutation):
            term *= matrix[i][j]
        result += term
    return result


def _principal_minors(matrix: Matrix) -> list[Fraction]:
    rows, columns = _shape(matrix)
    if rows != columns:
        raise ReplayError("principal minors require a square matrix")
    result: list[Fraction] = []
    for size in range(1, rows + 1):
        for indices in itertools.combinations(range(rows), size):
            result.append(_determinant([
                [matrix[i][j] for j in indices] for i in indices
            ]))
    return result


def _quadratic(vector: list[Fraction], matrix: Matrix) -> Fraction:
    column = [[entry] for entry in vector]
    return _matmul(_matmul(_transpose(column), matrix), column)[0][0]


def _precision_bits(dps: int) -> int:
    return (
        dps * _LOG2_10_UPPER_NUMERATOR
        + _LOG2_10_UPPER_DENOMINATOR
        - 1
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
        if exponent >= 0
        else Fraction(numerator, 1 << (-exponent))
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


def _dyadic_record(raw: tuple[int, int, int, int]) -> list[Any]:
    return [raw[0], str(raw[1]), raw[2], raw[3]]


def _interval_record(value: Any, dps: int) -> dict[str, Any]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    lower_tuple = tuple(int(item) for item in lower)
    upper_tuple = tuple(int(item) for item in upper)
    with mp.workdps(dps + 20):
        decimal = [
            mp.nstr(_mpf_from_raw(lower_tuple, dps), dps + 10),
            mp.nstr(_mpf_from_raw(upper_tuple, dps), dps + 10),
        ]
    return {
        "decimal": decimal,
        "dyadic": {
            "lower": _dyadic_record(lower_tuple),
            "upper": _dyadic_record(upper_tuple),
        },
    }


def _parse_dyadic(value: Any, label: str, dps: int) -> Fraction:
    if not isinstance(value, list) or len(value) != 4:
        raise ReplayError(f"{label} must be a four-part dyadic")
    sign, mantissa_text, exponent, bit_count = value
    if isinstance(sign, bool) or sign not in (0, 1):
        raise ReplayError(f"{label} sign is invalid")
    if (
        not isinstance(mantissa_text, str)
        or _UNSIGNED_INTEGER_TEXT.fullmatch(mantissa_text) is None
    ):
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
    if bit_count > bits + 160 or abs(exponent) > 16 * bits + 2048:
        raise ReplayError(f"{label} exceeds the precision budget")
    numerator = -mantissa if sign else mantissa
    return (
        Fraction(numerator * (1 << exponent))
        if exponent >= 0
        else Fraction(numerator, 1 << (-exponent))
    )


def _submitted_interval(value: Any, label: str, dps: int) -> tuple[Fraction, Fraction]:
    if not isinstance(value, dict) or set(value) != {"decimal", "dyadic"}:
        raise ReplayError(f"{label} interval inventory mismatch")
    decimal = value["decimal"]
    dyadic = value["dyadic"]
    if (
        not isinstance(decimal, list)
        or len(decimal) != 2
        or any(
            not isinstance(item, str) or _DECIMAL_TEXT.fullmatch(item) is None
            for item in decimal
        )
        or not isinstance(dyadic, dict)
        or set(dyadic) != {"lower", "upper"}
    ):
        raise ReplayError(f"{label} interval serialization is malformed")
    lower = _parse_dyadic(dyadic["lower"], f"{label}.lower", dps)
    upper = _parse_dyadic(dyadic["upper"], f"{label}.upper", dps)
    if lower > upper:
        raise ReplayError(f"{label} interval is reversed")
    lower_raw = _fraction_to_raw(lower)
    upper_raw = _fraction_to_raw(upper)
    with mp.workdps(dps + 20):
        expected_decimal = [
            mp.nstr(_mpf_from_raw(lower_raw, dps), dps + 10),
            mp.nstr(_mpf_from_raw(upper_raw, dps), dps + 10),
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


def _check_enclosure(
    submitted: Any, independent: Any, label: str, dps: int
) -> tuple[Fraction, Fraction]:
    submitted_lower, submitted_upper = _submitted_interval(submitted, label, dps)
    independent_lower, independent_upper = _interval_bounds(independent, label)
    if not (
        submitted_lower <= independent_lower
        <= independent_upper <= submitted_upper
    ):
        raise ReplayError(f"{label} does not enclose the independent replay")
    scale = max(Fraction(1), abs(independent_lower), abs(independent_upper))
    exponent = _precision_bits(dps) - 64
    width_limit = scale * (
        Fraction(1, 1 << exponent)
        if exponent >= 0
        else Fraction(1 << (-exponent))
    )
    if submitted_upper - submitted_lower > width_limit:
        raise ReplayError(f"{label} interval is excessively wide")
    return submitted_lower, submitted_upper


def _schedule(p: int) -> dict[str, Any]:
    n = (p * p + 3) // 4
    return {
        "lambda": Fraction(p, 2),
        "N": n,
        "N_rule": "ceil(lambda^2)",
        "floor_lambda_squared": n - 1,
        "arithmetic_indices": {"first": 1, "last": n - 1, "count": n - 1},
        "prime_endpoint_rule": (
            "all prime powers n<=lambda^2; distinct from the arithmetic "
            "index inventory"
        ),
        "full_matched_breakpoint_determinant_computed": False,
    }


def _moment_record(diagonal: list[Fraction], order: int) -> dict[str, Any]:
    cap = Fraction(2)
    deficits = [cap - value for value in diagonal]
    trace_power = sum((value**order for value in deficits), Fraction(0))
    source_cap = Fraction(4)
    return {
        "A": _diagonal(diagonal),
        "order": order,
        "deficits_M_minus_A": deficits,
        "trace_deficit_power": trace_power,
        "source_moment_cap": source_cap,
        "source_moment_hypothesis": trace_power <= source_cap,
        "strict_target_power_test": source_cap < Fraction(2) ** order,
        "actual_minimum": min(diagonal),
    }


def _moment_threshold_sharpness() -> dict[str, Any]:
    return {
        "dimension_d": 4,
        "L": Fraction(1),
        "mu": Fraction(0),
        "nu": Fraction(1),
        "M": Fraction(2),
        "threshold_ratio": Fraction(2),
        "exact_identity_d_equals_ratio_power": {"power": 2, "holds": True},
        "r_star": 2,
        "least_integer_strict_order": 3,
        "boundary_equality_rejected": _moment_record(
            [Fraction(0), Fraction(2), Fraction(2), Fraction(2)], 2
        ),
        "below_threshold_counterexample": _moment_record(
            [Fraction(-1), Fraction(2), Fraction(2), Fraction(2)], 1
        ),
        "strict_order_pass_model": _moment_record(
            [Fraction(1), Fraction(2), Fraction(2), Fraction(2)], 3
        ),
    }


def _positive_pole_obstruction() -> dict[str, Any]:
    spectrum = [Fraction(7), Fraction(1), Fraction(1)]
    mean = sum(spectrum, Fraction(0)) / 3
    centered = [value - mean for value in spectrum]
    moments: list[dict[str, Any]] = []
    for k in range(1, 5):
        degree = 2 * k
        moment = sum((value**degree for value in centered), Fraction(0))
        denominator = Fraction(1) + Fraction(1, 2 ** (degree - 1))
        radius_power = moment / denominator
        if radius_power != Fraction(4) ** degree:
            raise ReplayError("centered-pole radius reconstruction failed")
        moments.append({
            "k": k,
            "degree": degree,
            "C_2k": moment,
            "complete_sign_denominator": denominator,
            "radius_power": radius_power,
            "exact_radius": Fraction(4),
            "centered_lower_bound": mean - 4,
            "matches_order_independent_formula": mean - 4 == -1,
        })
    return {
        "dimension_d": 3,
        "alpha_times_L": Fraction(1),
        "positive_pole_width_P": Fraction(6),
        "unit_pole_direction": [Fraction(1), Fraction(0), Fraction(0)],
        "A_plus": _diagonal(spectrum),
        "actual_minimum": Fraction(1),
        "mean": mean,
        "centered_diagonal": centered,
        "order_independent_centered_bound": Fraction(-1),
        "moments_k_1_through_4": moments,
        "positive_matrix_has_negative_centered_bound_at_every_tested_order": True,
        "one_sided_exact_upper_endpoint": Fraction(7),
        "one_sided_deficit_moment_formula": "trace((7*I-A_plus)^r)=2*6^r",
    }


def _rank_one_neumann_algebra() -> dict[str, Any]:
    strict_m = _diagonal([Fraction(4), Fraction(2)])
    strict_p = [Fraction(1), Fraction(0)]
    strict_inverse = _inverse(strict_m)
    strict_load = 2 * _quadratic(strict_p, strict_inverse)
    strict_a = _subtract(strict_m, _scale(_outer(strict_p), Fraction(2)))
    strict_delta = Fraction(1, 2)
    strict_reserve = _subtract(strict_a, _scale(strict_m, strict_delta))

    equality_m = _diagonal([Fraction(2), Fraction(3)])
    equality_p = [Fraction(1), Fraction(0)]
    equality_a = _subtract(equality_m, _scale(_outer(equality_p), Fraction(2)))

    neumann_m = _diagonal([Fraction(1), Fraction(3, 2)])
    neumann_p = [Fraction(1, 4), Fraction(1, 4)]
    remainder_operator = _subtract(
        _identity(2), _scale(neumann_m, Fraction(1, 2))
    )
    order = 3
    powers = [_power(remainder_operator, exponent) for exponent in range(order + 1)]
    directional = [_quadratic(neumann_p, powers[index]) for index in range(order)]
    series = [[sum((powers[j][i][k] for j in range(order)), Fraction(0))
               for k in range(2)] for i in range(2)]
    inverse_direct = _inverse(neumann_m)
    inverse_identity = _add(
        _scale(series, Fraction(1, 2)),
        _matmul(powers[order], inverse_direct),
    )
    true_load = 2 * _quadratic(neumann_p, inverse_direct)
    truncated = sum(directional, Fraction(0))
    norm_squared = sum((value * value for value in neumann_p), Fraction(0))
    remainder_upper = 2 * norm_squared * Fraction(1, 2) ** order
    upper = truncated + remainder_upper
    delta = Fraction(3, 4)
    neumann_a = _subtract(neumann_m, _scale(_outer(neumann_p), Fraction(2)))
    floor_reserve = _subtract(neumann_a, _scale(_identity(2), delta))
    return {
        "rank_one_strict_pass": {
            "M": strict_m,
            "p": strict_p,
            "load_2_p_M_inverse_p": strict_load,
            "delta": strict_delta,
            "A_minus": strict_a,
            "A_minus_minus_delta_M": strict_reserve,
            "reserve_principal_minors": _principal_minors(strict_reserve),
        },
        "rank_one_equality_rejection": {
            "M": equality_m,
            "p": equality_p,
            "load_2_p_M_inverse_p": 2 * _quadratic(
                equality_p, _inverse(equality_m)
            ),
            "A_minus": equality_a,
            "A_minus_determinant": _determinant(equality_a),
            "strict_pass": False,
        },
        "directional_neumann": {
            "a": Fraction(1),
            "c": Fraction(2),
            "L": Fraction(1),
            "M": neumann_m,
            "p": neumann_p,
            "R": remainder_operator,
            "rho": Fraction(1, 2),
            "order_s": order,
            "powers_R_0_through_s": powers,
            "directional_moments_p_Rj_p": directional,
            "finite_geometric_sum": series,
            "inverse_direct": inverse_direct,
            "inverse_from_finite_Neumann_identity": inverse_identity,
            "true_rank_one_load": true_load,
            "truncated_directional_sum": truncated,
            "remainder_upper": remainder_upper,
            "directional_load_upper": upper,
            "delta": delta,
            "one_minus_delta": 1 - delta,
            "A_minus": neumann_a,
            "A_minus_minus_delta_a_L_I": floor_reserve,
            "floor_reserve_principal_minors": _principal_minors(floor_reserve),
        },
    }


def _parity_projection_idempotence() -> dict[str, Any]:
    parity = _diagonal([
        Fraction(1), Fraction(1), Fraction(-1), Fraction(-1)
    ])
    even_projection = _diagonal([
        Fraction(1), Fraction(0), Fraction(0), Fraction(0)
    ])
    odd_projection = _diagonal([
        Fraction(0), Fraction(0), Fraction(1), Fraction(0)
    ])
    identity = _identity(4)
    even_seed = [[Fraction(2)], [Fraction(3)], [Fraction(0)], [Fraction(0)]]
    odd_seed = [[Fraction(0)], [Fraction(0)], [Fraction(2)], [Fraction(3)]]
    even_tail = _matmul(_subtract(identity, even_projection), even_seed)
    odd_tail = _matmul(_subtract(identity, odd_projection), odd_seed)
    return {
        "parity_operator_J": parity,
        "finite_even_projection": even_projection,
        "finite_odd_projection": odd_projection,
        "even_projection_squared": _matmul(even_projection, even_projection),
        "odd_projection_squared": _matmul(odd_projection, odd_projection),
        "even_seed": even_seed,
        "odd_seed": odd_seed,
        "even_tail_h_equals_I_minus_P_q": even_tail,
        "odd_tail_h_equals_I_minus_P_q": odd_tail,
        "even_projected_tail": _matmul(even_projection, even_tail),
        "odd_projected_tail": _matmul(odd_projection, odd_tail),
        "even_parity_action": _matmul(parity, even_tail),
        "odd_parity_action": _matmul(parity, odd_tail),
        "declared_jump_jet_matrix_preserved_by_smooth_projection": _identity(2),
        "function_level_scope": (
            "finite exact algebra replay of P*(I-P)=0 and parity "
            "preservation; no prolate source is inferred"
        ),
    }


def _complex_rising(omega: Any, order: int) -> tuple[Any, Any]:
    value = mp.iv.mpc(1, 0)
    for index in reversed(range(order)):
        value *= mp.iv.mpc(mp.iv.mpf(2 * index + 1) / 2, omega)
    return value.real, value.imag


def _iv_determinant(matrix: list[list[Any]]) -> Any:
    size = len(matrix)
    total = mp.iv.mpf(0)
    for permutation in itertools.permutations(range(size)):
        inversions = sum(
            permutation[i] > permutation[j]
            for i in range(size)
            for j in range(i + 1, size)
        )
        term = mp.iv.mpf(-1 if inversions % 2 else 1)
        for row, column in enumerate(permutation):
            term *= matrix[row][column]
        total += term
    return total


def _independent_intervals(p: int, dps: int) -> dict[str, Any]:
    old_dps = mp.iv.dps
    try:
        mp.iv.dps = dps
        two = mp.iv.mpf(2)
        lam = mp.iv.mpf(p) / two
        ell = mp.iv.log(mp.iv.mpf(p)) - mp.iv.log(two)
        length = ell + ell
        n_max = (p * p + 3) // 4
        sinh_ell = mp.iv.mpf(p * p - 4) / mp.iv.mpf(4 * p)
        sinh_half_squared = mp.iv.mpf((p - 2) ** 2) / mp.iv.mpf(8 * p)
        sinh_half = mp.iv.sqrt(sinh_half_squared)
        total_norm = sinh_ell + ell
        projection_sum = mp.iv.mpf(16)
        coefficients: dict[str, Any] = {}
        selected = {0, 1, n_max}
        terms: list[Any] = []
        for n in range(n_max + 1):
            omega = mp.iv.mpf(2 * n) * mp.iv.pi / length
            denominator = omega * omega + mp.iv.mpf(1) / 4
            coefficient = sinh_half / (mp.iv.sqrt(length) * denominator)
            if n in selected:
                coefficients[str(n)] = coefficient
            if n:
                terms.append(two / (denominator * denominator))
        for term in reversed(terms):
            projection_sum += term
        projection = sinh_half_squared * projection_sum / length
        tail = (
            length * length * length * sinh_half_squared
            / (mp.iv.mpf(24) * mp.iv.pi**4 * mp.iv.mpf(n_max**3))
        )
        lower = total_norm - tail

        fixture_dimension = 3
        breakpoint_index = 2
        omegas = [mp.iv.mpf(2 * n) * mp.iv.pi / length for n in range(4)]
        plus_orders = [0, 2, 4]
        odd_orders = [1, 3, 5]
        plus_matrix: list[list[Any]] = []
        for order in plus_orders:
            row: list[Any] = []
            common = (
                mp.iv.sqrt(lam / length)
                * (-lam) ** order
                / mp.iv.mpf(breakpoint_index ** (order + 1))
            )
            for n in range(3):
                real, _imag = _complex_rising(omegas[n], order)
                row.append(common * real if n == 0 else mp.iv.sqrt(two) * common * real)
            plus_matrix.append(row)
        odd_matrix: list[list[Any]] = []
        for order in odd_orders:
            row = []
            common = (
                mp.iv.sqrt(two * lam / length)
                * (-lam) ** order
                / mp.iv.mpf(breakpoint_index ** (order + 1))
            )
            for n in range(1, 4):
                _real, imag = _complex_rising(omegas[n], order)
                row.append(common * imag)
            odd_matrix.append(row)
        plus_direct = _iv_determinant(plus_matrix)
        odd_direct = _iv_determinant(odd_matrix)

        plus_formula = -1 / mp.iv.sqrt(two)
        for k in range(fixture_dimension):
            plus_formula *= (
                mp.iv.sqrt(two * lam / length)
                * lam ** (2 * k)
                / mp.iv.mpf(breakpoint_index ** (2 * k + 1))
            )
        for i, j in itertools.combinations(range(3), 2):
            plus_formula *= omegas[j] ** 2 - omegas[i] ** 2
        odd_formula = mp.iv.mpf(-1)
        for k in range(fixture_dimension):
            odd_formula *= (
                mp.iv.sqrt(two * lam / length)
                * (-lam) ** (2 * k + 1)
                / mp.iv.mpf(breakpoint_index ** (2 * k + 2))
            )
        for n in range(1, 4):
            odd_formula *= omegas[n]
        for i, j in itertools.combinations(range(1, 4), 2):
            odd_formula *= omegas[j] ** 2 - omegas[i] ** 2

        return {
            "positive": {
                "ell": ell,
                "L": length,
                "coefficients": coefficients,
                "ambient": total_norm,
                "projection": projection,
                "tail": tail,
                "lower": lower,
            },
            "breakpoint": {
                "y": mp.iv.mpf(breakpoint_index) / lam,
                "value_jump": mp.iv.sqrt(lam / length) / breakpoint_index,
                "plus_matrix": plus_matrix,
                "plus_direct": plus_direct,
                "plus_formula": plus_formula,
                "odd_matrix": odd_matrix,
                "odd_direct": odd_direct,
                "odd_formula": odd_formula,
            },
        }
    finally:
        mp.iv.dps = old_dps


def _validate_exact_section(actual: Any, expected: Any, label: str) -> None:
    _validate_all_rationals(actual, label)
    _require_same(actual, _encode(expected), label)


def _expected_checks() -> dict[str, bool]:
    return {
        "matched_schedule_reconstructed": True,
        "moment_threshold_boundary_rejected": True,
        "below_threshold_counterexample_reconstructed": True,
        "positive_pole_centered_obstruction_reconstructed": True,
        "rank_one_equality_rejected": True,
        "neumann_identity_exact": True,
        "directional_reserve_strict": True,
        "parity_projection_idempotence_exact": True,
        "positive_pole_projection_interval_positive": True,
        "breakpoint_determinants_exclude_zero": True,
        "finite_breakpoint_not_promoted_to_coframe": True,
    }


def _validate_positive_intervals(
    actual: Any, independent: dict[str, Any], p: int, dps: int
) -> dict[str, Any]:
    expected_keys = {
        "ell", "L", "sinh_ell_exact", "sinh_half_squared_exact",
        "selected_coefficients_n_0_1_N", "ambient_norm_squared",
        "matched_projection_norm_squared", "projection_tail_upper",
        "projection_lower_bound", "projection_lower_bound_strictly_positive",
        "physical_high_angle_inferred",
    }
    if not isinstance(actual, dict) or set(actual) != expected_keys:
        raise ReplayError("positive-pole interval inventory mismatch")
    _require_same(actual["sinh_ell_exact"], _rational(Fraction(p * p - 4, 4 * p)),
                  "positive_pole.sinh_ell_exact")
    _require_same(
        actual["sinh_half_squared_exact"],
        _rational(Fraction((p - 2) ** 2, 8 * p)),
        "positive_pole.sinh_half_squared_exact",
    )
    n_max = (p * p + 3) // 4
    coefficients = actual["selected_coefficients_n_0_1_N"]
    if not isinstance(coefficients, dict) or set(coefficients) != {"0", "1", str(n_max)}:
        raise ReplayError("positive-pole selected coefficient inventory mismatch")
    bounds: dict[str, Any] = {}
    bounds["ell"] = _check_enclosure(actual["ell"], independent["ell"],
                                      "positive_pole.ell", dps)
    bounds["L"] = _check_enclosure(actual["L"], independent["L"],
                                    "positive_pole.L", dps)
    for key, value in independent["coefficients"].items():
        bounds[f"coefficient_{key}"] = _check_enclosure(
            coefficients[key], value, f"positive_pole.coefficient_{key}", dps
        )
    for actual_key, independent_key in (
        ("ambient_norm_squared", "ambient"),
        ("matched_projection_norm_squared", "projection"),
        ("projection_tail_upper", "tail"),
        ("projection_lower_bound", "lower"),
    ):
        bounds[actual_key] = _check_enclosure(
            actual[actual_key], independent[independent_key],
            f"positive_pole.{actual_key}", dps,
        )
    if actual["projection_lower_bound_strictly_positive"] is not True:
        raise ReplayError("positive-pole strict interval flag was not reconstructed")
    if actual["physical_high_angle_inferred"] is not False:
        raise ReplayError("positive-pole interval promoted to a physical angle")
    if bounds["projection_lower_bound"][0] <= 0:
        raise ReplayError("positive-pole lower interval is not strictly positive")
    return bounds


def _validate_breakpoint_intervals(
    actual: Any, independent: dict[str, Any], p: int, dps: int
) -> dict[str, Any]:
    expected_keys = {
        "fixture_dimension", "breakpoint_index_m", "breakpoint_y_m",
        "breakpoint_is_interior", "raw_value_jump_independent_of_n",
        "plus_rows_n", "plus_derivative_orders", "plus_jump_matrix",
        "plus_determinant_direct", "plus_determinant_vandermonde",
        "plus_formula_overlap", "plus_determinant_excludes_zero",
        "odd_rows_n", "odd_derivative_orders", "odd_basis_global_sign",
        "odd_jump_matrix", "odd_determinant_direct",
        "odd_determinant_vandermonde", "odd_formula_overlap",
        "odd_determinant_excludes_zero", "full_matched_dimension_claimed",
        "prolate_moment_minor_inferred",
    }
    if not isinstance(actual, dict) or set(actual) != expected_keys:
        raise ReplayError("breakpoint interval inventory mismatch")
    fixed = {
        "fixture_dimension": 3,
        "breakpoint_index_m": 2,
        "breakpoint_is_interior": True,
        "plus_rows_n": [0, 1, 2],
        "plus_derivative_orders": [0, 2, 4],
        "plus_formula_overlap": True,
        "plus_determinant_excludes_zero": True,
        "odd_rows_n": [1, 2, 3],
        "odd_derivative_orders": [1, 3, 5],
        "odd_basis_global_sign": (
            "positive imaginary-part convention in equation (7.11)"
        ),
        "odd_formula_overlap": True,
        "odd_determinant_excludes_zero": True,
        "full_matched_dimension_claimed": False,
        "prolate_moment_minor_inferred": False,
    }
    for key, expected in fixed.items():
        _require_same(actual[key], expected, f"breakpoint.{key}")
    bounds: dict[str, Any] = {
        "breakpoint_y_m": _check_enclosure(
            actual["breakpoint_y_m"], independent["y"],
            "breakpoint.breakpoint_y_m", dps,
        ),
        "raw_value_jump": _check_enclosure(
            actual["raw_value_jump_independent_of_n"], independent["value_jump"],
            "breakpoint.raw_value_jump", dps,
        ),
    }
    for name in ("plus", "odd"):
        matrix = actual[f"{name}_jump_matrix"]
        expected_matrix = independent[f"{name}_matrix"]
        if (
            not isinstance(matrix, list) or len(matrix) != 3
            or any(not isinstance(row, list) or len(row) != 3 for row in matrix)
        ):
            raise ReplayError(f"breakpoint {name} jump matrix shape mismatch")
        for i in range(3):
            for j in range(3):
                bounds[f"{name}_{i}_{j}"] = _check_enclosure(
                    matrix[i][j], expected_matrix[i][j],
                    f"breakpoint.{name}_jump_matrix[{i}][{j}]", dps,
                )
        bounds[f"{name}_direct"] = _check_enclosure(
            actual[f"{name}_determinant_direct"], independent[f"{name}_direct"],
            f"breakpoint.{name}_determinant_direct", dps,
        )
        bounds[f"{name}_formula"] = _check_enclosure(
            actual[f"{name}_determinant_vandermonde"],
            independent[f"{name}_formula"],
            f"breakpoint.{name}_determinant_vandermonde", dps,
        )
        direct_lower, direct_upper = _interval_bounds(
            independent[f"{name}_direct"], f"breakpoint.{name}_direct"
        )
        formula_lower, formula_upper = _interval_bounds(
            independent[f"{name}_formula"], f"breakpoint.{name}_formula"
        )
        if direct_upper < formula_lower or formula_upper < direct_lower:
            raise ReplayError(
                f"breakpoint {name} independently reconstructed direct and "
                "Vandermonde determinant intervals do not overlap"
            )
        if bounds[f"{name}_direct"][0] <= 0 <= bounds[f"{name}_direct"][1]:
            raise ReplayError(f"breakpoint {name} determinant contains zero")
    y_lower, y_upper = bounds["breakpoint_y_m"]
    if y_lower <= 0 or y_upper >= Fraction(p, 2):
        raise ReplayError("breakpoint is not certified inside the source interval")
    return bounds


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

    inputs = payload["inputs"]
    if not isinstance(inputs, dict) or set(inputs) != {
        "lambda_numerator", "lambda_denominator", "dps"
    }:
        raise ReplayError("input inventory mismatch")
    p = _require_int(inputs["lambda_numerator"], "lambda numerator", 5)
    denominator = _require_int(inputs["lambda_denominator"], "lambda denominator", 1)
    dps = _require_int(inputs["dps"], "interval precision", 50)
    if p % 2 == 0 or denominator != 2:
        raise ReplayError("locked odd half-integer schedule changed")
    if p > 999:
        raise ReplayError("lambda numerator exceeds the replay budget")
    if dps > 10000:
        raise ReplayError("interval precision exceeds the replay budget")

    certificate = payload["certificate"]
    certificate_keys = {
        "schedule", "moment_threshold_sharpness",
        "positive_pole_centered_obstruction", "rank_one_neumann_algebra",
        "parity_projection_idempotence", "positive_pole_intervals",
        "breakpoint_intervals", "checks",
    }
    if not isinstance(certificate, dict) or set(certificate) != certificate_keys:
        raise ReplayError("certificate inventory mismatch")

    expected_schedule = _schedule(p)
    expected_threshold = _moment_threshold_sharpness()
    expected_positive = _positive_pole_obstruction()
    expected_rank_one = _rank_one_neumann_algebra()
    expected_parity = _parity_projection_idempotence()
    _validate_exact_section(certificate["schedule"], expected_schedule, "schedule")
    _validate_exact_section(
        certificate["moment_threshold_sharpness"], expected_threshold,
        "moment_threshold_sharpness",
    )
    _validate_exact_section(
        certificate["positive_pole_centered_obstruction"], expected_positive,
        "positive_pole_centered_obstruction",
    )
    _validate_exact_section(
        certificate["rank_one_neumann_algebra"], expected_rank_one,
        "rank_one_neumann_algebra",
    )
    _validate_exact_section(
        certificate["parity_projection_idempotence"], expected_parity,
        "parity_projection_idempotence",
    )

    independent = _independent_intervals(p, dps)
    positive_bounds = _validate_positive_intervals(
        certificate["positive_pole_intervals"], independent["positive"], p, dps
    )
    breakpoint_bounds = _validate_breakpoint_intervals(
        certificate["breakpoint_intervals"], independent["breakpoint"], p, dps
    )
    checks = _expected_checks()
    _require_same(certificate["checks"], checks, "certificate checks")

    boundary = expected_threshold["boundary_equality_rejected"]
    below = expected_threshold["below_threshold_counterexample"]
    direction = expected_rank_one["directional_neumann"]
    equality = expected_rank_one["rank_one_equality_rejection"]
    if (
        boundary["strict_target_power_test"]
        or boundary["actual_minimum"] != 0
        or not below["source_moment_hypothesis"]
        or below["actual_minimum"] >= 0
        or equality["strict_pass"]
        or equality["load_2_p_M_inverse_p"] != 1
        or equality["A_minus_determinant"] != 0
        or direction["inverse_direct"]
        != direction["inverse_from_finite_Neumann_identity"]
        or direction["directional_load_upper"]
        >= direction["one_minus_delta"]
        or expected_positive["actual_minimum"] <= 0
        or expected_positive["order_independent_centered_bound"] >= 0
        or any(lock_document["source_admissions"].values())
    ):
        raise ReplayError("strict theorem-boundary reconstruction failed")

    reconstructed_intervals = {
        "positive_pole": {
            key: _interval_record(value, dps)
            for key, value in independent["positive"].items()
            if key != "coefficients"
        },
        "positive_pole_coefficients": {
            key: _interval_record(value, dps)
            for key, value in independent["positive"]["coefficients"].items()
        },
        "breakpoint": {
            "y": _interval_record(independent["breakpoint"]["y"], dps),
            "value_jump": _interval_record(
                independent["breakpoint"]["value_jump"], dps
            ),
            "plus_direct": _interval_record(
                independent["breakpoint"]["plus_direct"], dps
            ),
            "plus_formula": _interval_record(
                independent["breakpoint"]["plus_formula"], dps
            ),
            "odd_direct": _interval_record(
                independent["breakpoint"]["odd_direct"], dps
            ),
            "odd_formula": _interval_record(
                independent["breakpoint"]["odd_formula"], dps
            ),
        },
    }
    producer_hash = _sha256_bytes(producer_bytes)
    return {
        "schema": REPLAY_SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "producer_binding": {
            "byte_source": "exact producer artifact bytes",
            "byte_count": len(producer_bytes),
            "sha256": producer_hash,
        },
        "source_lock": source_lock,
        "inputs": dict(inputs),
        "reconstructed": {
            "schedule": _encode(expected_schedule),
            "moment_threshold_sharpness": _encode(expected_threshold),
            "positive_pole_centered_obstruction": _encode(expected_positive),
            "rank_one_neumann_algebra": _encode(expected_rank_one),
            "parity_projection_idempotence": _encode(expected_parity),
            "intervals": reconstructed_intervals,
            "submitted_interval_bounds": {
                "positive_count": len(positive_bounds),
                "breakpoint_count": len(breakpoint_bounds),
            },
        },
        "checks": {
            "exact_producer_bytes_bound": True,
            "source_lock_hash_rebuilt_dynamically": True,
            "every_declared_dependency_rehashed": True,
            "duplicate_keys_rejected": True,
            "binary64_rejected": True,
            "producer_booleans_trusted": False,
            "formula_tree_independent": True,
            **checks,
        },
        "arithmetic_libraries": dict(ARITHMETIC_LIBRARIES),
        "claim_boundary": {
            "finite_reduction_only": True,
            "physical_source_moment_estimate": False,
            "matched_coframe": False,
            "signed_sector_floor": False,
            "equation_5_2": False,
            "locally_uniform_determinant_convergence": False,
            "riemann_hypothesis": False,
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("artifact")
    parser.add_argument("--output")
    args = parser.parse_args()
    artifact_path = Path(args.artifact)
    raw = _read_bytes(artifact_path, "producer artifact")
    payload = _strict_json_loads(raw, "producer artifact")
    if not isinstance(payload, dict):
        raise ReplayError("producer artifact must be a JSON object")
    report = replay(payload, producer_bytes=raw)
    report["producer_artifact"] = {
        "path": args.artifact,
        "sha256": report["producer_binding"]["sha256"],
    }
    encoded = json.dumps(report, indent=2, sort_keys=True) + "\n"
    if args.output:
        Path(args.output).write_text(encoded, encoding="utf-8")
    else:
        print(encoded, end="")


if __name__ == "__main__":
    main()
