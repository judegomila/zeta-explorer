#!/usr/bin/env python3
"""Clean-room replay for the matched high-moment/coframe reduction.

The replay imports no producer module and reads no environment variables.  It
parses the exact producer bytes with duplicate-key and binary64 rejection,
rehashes the source lock and every declared dependency, and reconstructs the
certificate with a separate formula tree.  Exact finite calculations use
``fractions.Fraction``; every transcendental calculation uses outward
``mpmath.iv`` intervals.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import re
from typing import Any

import mpmath as mp


PRODUCER_SCHEMA = "xi-prolate-matched-high-moment-coframe-v1"
REPLAY_SCHEMA = "xi-prolate-matched-high-moment-coframe-replay-v1"
SOURCE_LOCK_PATH = "MATCHED_HIGH_MOMENT_COFRAME_SOURCE_LOCK.json"
SOURCE_LOCK_SCHEMA = "xi-prolate-matched-high-moment-coframe-source-lock-v1"
NOTE_PATH = "notes/MATCHED_HIGH_MOMENT_COFRAME_REDUCTION.md"
TERMINAL_STATE = "P0_INVALIDATED"
EXPECTED_SOURCE_LOCK_SHA256 = (
    "83b5ad8e7a45bbe7f4d01ba27b1ec3aae2d3846917c4942b101cd1027e66aa1d"
)
EXPECTED_DEPENDENCY_PATHS = {
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
    NOTE_PATH,
}

_SHA256 = re.compile(r"^[0-9a-f]{64}$")
_INTEGER_TEXT = re.compile(r"^(?:0|-[1-9][0-9]*|[1-9][0-9]*)$")
_UNSIGNED_INTEGER_TEXT = re.compile(r"^(?:0|[1-9][0-9]*)$")
_POSITIVE_INTEGER_TEXT = re.compile(r"^[1-9][0-9]*$")
_DECIMAL_TEXT = re.compile(
    r"^[+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:e[+-]?[0-9]+)?$"
)

# A rational upper bound for log_2(10), used only for denial-of-service and
# interval-width budgets.  It is not a transcendental input to the theorem.
_LOG2_10_UPPER_NUMERATOR = 3321928094887363
_LOG2_10_UPPER_DENOMINATOR = 10**15


ARITHMETIC_LIBRARIES = {
    "precision_mode": "exact rational arithmetic plus outward arbitrary-precision intervals",
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
    """Raised when strict parsing or an independent reconstruction fails."""


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
    """JSON equality without Python's bool/int coercion."""

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


def _require_int(
    value: Any, label: str, *, minimum: int | None = None
) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise ReplayError(f"{label} must be an exact JSON integer")
    if minimum is not None and value < minimum:
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
    numerator_text = value["numerator"]
    denominator_text = value["denominator"]
    if (
        not isinstance(numerator_text, str)
        or _INTEGER_TEXT.fullmatch(numerator_text) is None
        or not isinstance(denominator_text, str)
        or _POSITIVE_INTEGER_TEXT.fullmatch(denominator_text) is None
    ):
        raise ReplayError(f"{label} contains noncanonical integer text")
    result = Fraction(int(numerator_text), int(denominator_text))
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
    """Fail closed on truthy claim fields, including fields in the source lock."""

    forbidden_fragments = (
        "rh_proved",
        "riemann_hypothesis_proved",
        "riemann_hypothesis_claimed",
        "signed_sector_floor_claimed",
        "sector_floor_proved",
        "equation_5_2_claimed",
        "equation_5_2_proved",
        "determinant_convergence_claimed",
        "determinant_convergence_proved",
        "locally_uniform_determinant_convergence_claimed",
    )
    if isinstance(value, dict):
        for key, child in value.items():
            normalized = key.lower().replace("-", "_").replace(" ", "_")
            if any(fragment in normalized for fragment in forbidden_fragments):
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
        "riemann hypothesis",
        "equation (5.2)",
        "locally uniform determinant convergence",
        "positive signed floor",
        "signed sector floor",
        "global weil positivity",
    )
    for claim in proved:
        lowered = claim.lower()
        if any(fragment in lowered for fragment in forbidden):
            raise ReplayError(f"promoted proved claim in source lock: {claim}")


def _validate_source_lock(root: Path) -> tuple[dict[str, Any], dict[str, Any]]:
    lock_relative = _safe_relative_path(SOURCE_LOCK_PATH, "source-lock path")
    lock_raw = _read_bytes(root / lock_relative, "source lock")
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
    if lock.get("schema") != SOURCE_LOCK_SCHEMA:
        raise ReplayError("source-lock schema mismatch")
    if "terminal_state" in lock and lock["terminal_state"] != TERMINAL_STATE:
        raise ReplayError("source-lock terminal-state promotion rejected")
    if lock["external_sources"] != []:
        raise ReplayError("unexpected external source in source lock")
    if not isinstance(lock["claim_class"], str) or not lock["claim_class"]:
        raise ReplayError("source-lock claim class is invalid")
    if not isinstance(lock["updated_date"], str) or not lock["updated_date"]:
        raise ReplayError("source-lock update date is invalid")
    for field in ("locked_conventions", "locked_formulas"):
        if not isinstance(lock[field], dict) or not lock[field] or any(
            not isinstance(key, str) or not isinstance(value, str)
            for key, value in lock[field].items()
        ):
            raise ReplayError(f"source-lock {field} is malformed")
    admissions = lock["source_admissions"]
    if (
        not isinstance(admissions, dict)
        or not admissions
        or any(type(value) is not bool for value in admissions.values())
        or any(admissions.values())
    ):
        raise ReplayError("source-lock admission violates the claim boundary")
    _validate_lock_claim_boundary(lock)
    _reject_promoted_claims(lock, "source_lock")

    dependencies = lock.get("dependencies")
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
        "schema": SOURCE_LOCK_SCHEMA,
        "sha256": _sha256_bytes(lock_raw),
        "dependency_hashes": dict(sorted(hashes.items())),
    }
    return binding, lock


def _transpose(matrix: Matrix) -> Matrix:
    if not matrix:
        return []
    width = len(matrix[0])
    if any(len(row) != width for row in matrix):
        raise ReplayError("ragged exact matrix")
    return [[matrix[row][column] for row in range(len(matrix))]
            for column in range(width)]


def _matmul(left: Matrix, right: Matrix) -> Matrix:
    if not left or not right:
        raise ReplayError("empty exact matrix product")
    if any(len(row) != len(left[0]) for row in left):
        raise ReplayError("ragged left factor")
    if any(len(row) != len(right[0]) for row in right):
        raise ReplayError("ragged right factor")
    if len(left[0]) != len(right):
        raise ReplayError("exact matrix product dimension mismatch")
    return [
        [
            sum(
                (left[i][k] * right[k][j] for k in range(len(right))),
                Fraction(0),
            )
            for j in range(len(right[0]))
        ]
        for i in range(len(left))
    ]


def _determinant(matrix: Matrix) -> Fraction:
    size = len(matrix)
    if any(len(row) != size for row in matrix):
        raise ReplayError("determinant requires a square exact matrix")
    if size == 0:
        return Fraction(1)
    work = [row[:] for row in matrix]
    result = Fraction(1)
    for column in range(size):
        pivot = next(
            (row for row in range(column, size) if work[row][column] != 0),
            None,
        )
        if pivot is None:
            return Fraction(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            result = -result
        pivot_value = work[column][column]
        result *= pivot_value
        for row in range(column + 1, size):
            multiplier = work[row][column] / pivot_value
            for j in range(column + 1, size):
                work[row][j] -= multiplier * work[column][j]
    return result


def _inverse(matrix: Matrix) -> Matrix:
    size = len(matrix)
    if size == 0 or any(len(row) != size for row in matrix):
        raise ReplayError("inverse requires a nonempty square exact matrix")
    augmented = [
        row[:] + [Fraction(i == j) for j in range(size)]
        for i, row in enumerate(matrix)
    ]
    for column in range(size):
        pivot = next(
            (row for row in range(column, size) if augmented[row][column] != 0),
            None,
        )
        if pivot is None:
            raise ReplayError("singular exact matrix")
        augmented[column], augmented[pivot] = augmented[pivot], augmented[column]
        scale = augmented[column][column]
        augmented[column] = [entry / scale for entry in augmented[column]]
        for row in range(size):
            if row == column:
                continue
            scale = augmented[row][column]
            if scale:
                augmented[row] = [
                    a - scale * b
                    for a, b in zip(augmented[row], augmented[column])
                ]
    return [row[size:] for row in augmented]


def _rank(matrix: Matrix) -> int:
    if not matrix:
        return 0
    width = len(matrix[0])
    if any(len(row) != width for row in matrix):
        raise ReplayError("rank received a ragged exact matrix")
    work = [row[:] for row in matrix]
    pivot_row = 0
    for column in range(width):
        pivot = next(
            (row for row in range(pivot_row, len(work)) if work[row][column]),
            None,
        )
        if pivot is None:
            continue
        work[pivot_row], work[pivot] = work[pivot], work[pivot_row]
        pivot_value = work[pivot_row][column]
        for row in range(pivot_row + 1, len(work)):
            value = work[row][column]
            if value:
                work[row] = [
                    pivot_value * a - value * b
                    for a, b in zip(work[row], work[pivot_row])
                ]
        pivot_row += 1
        if pivot_row == len(work):
            break
    return pivot_row


def _diagonal(values: list[Fraction]) -> Matrix:
    return [
        [value if i == j else Fraction(0) for j, _ in enumerate(values)]
        for i, value in enumerate(values)
    ]


def _outer(vector: list[Fraction]) -> Matrix:
    return [[left * right for right in vector] for left in vector]


def _add(left: Matrix, right: Matrix) -> Matrix:
    if len(left) != len(right) or any(len(a) != len(b) for a, b in zip(left, right)):
        raise ReplayError("exact matrix addition dimension mismatch")
    return [[a + b for a, b in zip(x, y)] for x, y in zip(left, right)]


def _trace(matrix: Matrix) -> Fraction:
    if any(len(row) != len(matrix) for row in matrix):
        raise ReplayError("trace requires a square matrix")
    return sum((matrix[i][i] for i in range(len(matrix))), Fraction(0))


def _principal_minors(matrix: Matrix) -> list[Fraction]:
    size = len(matrix)
    if any(len(row) != size for row in matrix):
        raise ReplayError("principal minors require a square matrix")
    records: list[Fraction] = []
    # Bit masks give a formula path independent of producer combinations.
    for count in range(1, size + 1):
        for mask in range(1, 1 << size):
            indices = [index for index in range(size) if mask & (1 << index)]
            if len(indices) != count:
                continue
            records.append(_determinant([
                [matrix[i][j] for j in indices] for i in indices
            ]))
    return records


def _matrix_vector(matrix: Matrix, vector: list[Fraction]) -> list[Fraction]:
    product = _matmul(matrix, [[entry] for entry in vector])
    return [row[0] for row in product]


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
    if sign not in (0, 1) or not all(isinstance(x, int) for x in raw):
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
    if exponent >= 0:
        return Fraction(numerator * (1 << exponent))
    return Fraction(numerator, 1 << (-exponent))


def _dyadic_record(raw: tuple[int, int, int, int]) -> list[Any]:
    sign, mantissa, exponent, bit_count = raw
    return [sign, str(mantissa), exponent, bit_count]


def _mpf_from_raw(raw: tuple[int, int, int, int], dps: int) -> Any:
    bit_count = raw[3]
    with mp.workprec(max(_precision_bits(dps) + 64, bit_count + 16)):
        return +mp.mpf(raw)


def _fraction_to_raw(value: Fraction) -> tuple[int, int, int, int]:
    """Convert an exactly dyadic Fraction to normalized mpmath raw form."""

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


def _interval_record(value: Any, dps: int) -> dict[str, Any]:
    lower_raw, upper_raw = value._mpi_  # type: ignore[attr-defined]
    lower_tuple = tuple(int(item) for item in lower_raw)
    upper_tuple = tuple(int(item) for item in upper_raw)
    lower = _mpf_from_raw(lower_tuple, dps)
    upper = _mpf_from_raw(upper_tuple, dps)
    with mp.workdps(dps + 20):
        decimals = [mp.nstr(lower, dps + 10), mp.nstr(upper, dps + 10)]
    return {
        "decimal": decimals,
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
    if exponent >= 0:
        return Fraction(numerator * (1 << exponent))
    return Fraction(numerator, 1 << (-exponent))


def _submitted_interval(
    value: Any, label: str, dps: int
) -> tuple[Fraction, Fraction]:
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
    # The denominator is a power of two by construction.  Compare the text
    # to the exact dyadic endpoints, so decorative decimal strings cannot lie.
    with mp.workdps(dps + 20):
        expected_decimal = [
            mp.nstr(_mpf_from_raw(lower_raw, dps), dps + 10),
            mp.nstr(_mpf_from_raw(upper_raw, dps), dps + 10),
        ]
    if decimal != expected_decimal:
        raise ReplayError(f"{label} decimal text does not match its dyadics")
    return lower, upper


def _independent_intervals(p: int, n: int, dps: int) -> dict[str, Any]:
    """Use a formula tree distinct from the locked display formulas."""

    old_dps = mp.iv.dps
    try:
        mp.iv.dps = dps
        two = mp.iv.mpf(2)
        p_iv = mp.iv.mpf(p)
        lambda_iv = p_iv / two

        # log(p/2) and the transition argument are deliberately factored.
        ell = mp.iv.log(p_iv) - mp.iv.log(two)
        length = ell + ell
        q_log = mp.iv.log(mp.iv.mpf(25)) + mp.iv.log(mp.iv.mpf(2 * p * p + 1))
        log_twenty = two * mp.iv.log(two) + mp.iv.log(mp.iv.mpf(5))
        q_argument = two * q_log * log_twenty / (mp.iv.pi * mp.iv.pi)

        # sinh(ell)=(lambda-lambda^-1)/2 and
        # sinh(ell/2)^2=(lambda+lambda^-1-2)/4.
        inverse_lambda = 1 / lambda_iv
        hyperbolic_remainder = (lambda_iv - inverse_lambda) / two - ell
        correction = (
            ell * (lambda_iv + inverse_lambda - two)
            / ((mp.iv.pi * mp.iv.pi) * mp.iv.mpf(n))
        )
        pole_b = hyperbolic_remainder - correction
        pole_g = ell / two
        angle = ell / (mp.iv.mpf(4) * pole_b)

        q_lower_raw, q_upper_raw = q_argument._mpi_  # type: ignore[attr-defined]
        q_lower = _raw_mpf_fraction(tuple(q_lower_raw), "q lower")
        q_upper = _raw_mpf_fraction(tuple(q_upper_raw), "q upper")
        q_from_lower = (q_lower.numerator + q_lower.denominator - 1) // q_lower.denominator
        q_from_upper = (q_upper.numerator + q_upper.denominator - 1) // q_upper.denominator
        if q_from_lower != q_from_upper:
            raise ReplayError("transition ceiling is not separated at requested precision")

        return {
            "q": q_from_lower,
            "q_argument": q_argument,
            "ell": ell,
            "L": length,
            "pole_norm_squared": hyperbolic_remainder,
            "projection_tail_upper": correction,
            "B_pole": pole_b,
            "g_equals_kappa_L": pole_g,
            "angle": angle,
        }
    finally:
        mp.iv.dps = old_dps


def _interval_bounds(value: Any, label: str) -> tuple[Fraction, Fraction]:
    lower_raw, upper_raw = value._mpi_  # type: ignore[attr-defined]
    return (
        _raw_mpf_fraction(tuple(lower_raw), f"{label} lower"),
        _raw_mpf_fraction(tuple(upper_raw), f"{label} upper"),
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
    scale = max(
        Fraction(1),
        abs(independent_lower),
        abs(independent_upper),
    )
    exponent = _precision_bits(dps) - 64
    width_limit = scale * (
        Fraction(1, 1 << exponent) if exponent >= 0 else Fraction(1 << (-exponent))
    )
    if submitted_upper - submitted_lower > width_limit:
        raise ReplayError(f"{label} interval is excessively wide")
    return submitted_lower, submitted_upper


def _integer_nth_root_exact(value: int, order: int) -> int:
    if value < 0 or order <= 0:
        raise ReplayError("invalid exact root request")
    if value in (0, 1):
        return value
    low, high = 0, 1
    while high**order < value:
        high *= 2
    while high - low > 1:
        middle = (low + high) // 2
        if middle**order < value:
            low = middle
        else:
            high = middle
    if high**order != value:
        raise ReplayError("fixture root is not exact")
    return high


def _fraction_nth_root_exact(value: Fraction, order: int) -> Fraction:
    return Fraction(
        _integer_nth_root_exact(value.numerator, order),
        _integer_nth_root_exact(value.denominator, order),
    )


def _centered_record(eigenvalues: list[Fraction], k: int) -> dict[str, Any]:
    dimension = len(eigenvalues)
    if dimension < 2:
        raise ReplayError("centered fixture must have dimension at least two")
    mean = sum(eigenvalues, Fraction(0)) / dimension
    deviations = [value - mean for value in eigenvalues]
    order = 2 * k
    moment = sum((value**order for value in deviations), Fraction(0))
    sharp_factor = Fraction(1) + Fraction(1, (dimension - 1) ** (order - 1))
    radius_power = moment / sharp_factor
    radius = _fraction_nth_root_exact(radius_power, order)
    floor = mean - radius
    return {
        "eigenvalues": eigenvalues,
        "dimension": dimension,
        "mean": mean,
        "deviations": deviations,
        "k": k,
        "order": order,
        "centered_moment": moment,
        "sharp_zero_sum_factor": sharp_factor,
        "radius_power": radius_power,
        "radius": radius,
        "moment_floor": floor,
        "actual_minimum": min(eigenvalues),
        "floor_valid": min(eigenvalues) >= floor,
        "floor_sharp": min(eigenvalues) == floor,
    }


def _centered_fixture_payload(
    eigenvalues: list[Fraction], label: str
) -> dict[str, Any]:
    mean = sum(eigenvalues, Fraction(0)) / len(eigenvalues)
    centered = [value - mean for value in eigenvalues]
    actual_minimum = min(eigenvalues)
    moments = []
    for k in range(1, 5):
        record = _centered_record(eigenvalues, k)
        moments.append({
            "k": k,
            "degree": 2 * k,
            "C_2k": record["centered_moment"],
            "complete_sign_denominator": record["sharp_zero_sum_factor"],
            "radius_power": record["radius_power"],
            "radius": record["radius"],
            "lower_bound": record["moment_floor"],
            "sharp_equality": record["moment_floor"] == actual_minimum,
        })
    return {
        "label": label,
        "matrix": _diagonal(eigenvalues),
        "dimension": len(eigenvalues),
        "mean": mean,
        "centered_diagonal": centered,
        "actual_minimum": actual_minimum,
        "moments": moments,
    }


def _centered_moment_floors() -> dict[str, Any]:
    bad = _centered_fixture_payload(
        [Fraction(-1, 2), Fraction(5, 2), Fraction(5, 2)], "sharp_bad",
    )
    good = _centered_fixture_payload(
        [Fraction(7, 2), Fraction(1, 2), Fraction(1, 2)], "moment_twin_good",
    )
    positive = _centered_fixture_payload(
        [Fraction(1), Fraction(3)], "positive_sharp",
    )
    bad_moments = [record["C_2k"] for record in bad["moments"]]
    good_moments = [record["C_2k"] for record in good["moments"]]
    if (
        bad["mean"] != Fraction(3, 2)
        or good["mean"] != Fraction(3, 2)
        or bad_moments != [Fraction(2 ** (2 * k) + 2) for k in range(1, 5)]
        or bad_moments != good_moments
        or not all(record["sharp_equality"] for record in bad["moments"])
        or not all(
            record["C_2k"] == 2
            and record["lower_bound"] == 1
            and record["sharp_equality"]
            for record in positive["moments"]
        )
    ):
        raise ReplayError("centered high-moment fixture reconstruction failed")
    return {
        "sharp_bad": bad,
        "moment_twin_good": good,
        "positive_sharp": positive,
        "same_even_moments_do_not_determine_lower_sign": {
            "same_C_2k_for_k_1_through_4": True,
            "bad_actual_minimum": bad["actual_minimum"],
            "good_actual_minimum": good["actual_minimum"],
            "positive_floor_inferred_from_shared_moments": False,
        },
    }


def _one_sided_exact() -> dict[str, Any]:
    eigenvalues = [Fraction(1), Fraction(2), Fraction(3)]
    ceiling = Fraction(3)
    order = 2
    deficits = [ceiling - value for value in eigenvalues]
    moment = sum((value**order for value in deficits), Fraction(0))
    if moment != 5:
        raise ReplayError("one-sided moment fixture changed")
    return {
        "A": _diagonal(eigenvalues),
        "M": ceiling,
        "p": order,
        "M_I_minus_A": _diagonal(deficits),
        "trace_deficit_power": moment,
        "symbolic_lower_bound": "3-sqrt(5)",
        "actual_minimum": min(eigenvalues),
    }


def _one_sided_intervals(dps: int) -> dict[str, Any]:
    old_dps = mp.iv.dps
    try:
        mp.iv.dps = dps
        radius = mp.iv.sqrt(mp.iv.mpf(5))
        floor = mp.iv.mpf(3) - radius
        return {"radius": radius, "floor": floor}
    finally:
        mp.iv.dps = old_dps


def _schedule(p: int, q: int) -> dict[str, Any]:
    m = (p * p + 3) // 4
    plus = m + (q + 2) // 4 - 1
    minus = m + q // 4
    return {
        "lambda": Fraction(p, 2),
        "N": m,
        "N_rule": "ceil(lambda^2)",
        "q": q,
        "n_star": p * p + 6 + q,
        "r_plus_buffered": plus,
        "r_minus_buffered": minus,
        "plus_excess_columns": plus - m,
        "minus_excess_columns": minus - m,
        "buffered_count_forces_plus_row_rank": False,
        "buffered_count_forces_minus_row_rank": False,
        "unbuffered_r_plus": m - 2,
        "unbuffered_r_minus": m - 2,
        "unbuffered_forced_row_nullity_each_sector": 2,
    }


def _full_source(p: int) -> dict[str, Any]:
    floor = Fraction(2, p**4)
    return {
        "lambda": Fraction(p, 2),
        "row_floor_one_over_8_lambda_fourth": floor,
        "operator_upper_lambda_squared_over_2": Fraction(p * p, 8),
        "floor_strictly_positive": floor > 0,
        "prescribed_matched_family_floor_inferred": False,
    }


def _coframe_fixtures() -> dict[str, Any]:
    identity = _diagonal([Fraction(1), Fraction(1)])
    source_metric = _diagonal([Fraction(2), Fraction(8)])
    metric_inverse = _inverse(source_metric)
    good = _diagonal([Fraction(1), Fraction(1, 3)])
    zero = _diagonal([Fraction(1), Fraction(0)])
    corrected_good = _matmul(_matmul(good, metric_inverse), _transpose(good))
    corrected_zero = _matmul(_matmul(zero, metric_inverse), _transpose(zero))
    raw_good = _matmul(good, _transpose(good))
    normalized_minor_squared = _determinant(good) ** 2 / _determinant(source_metric)
    fixture_lambda = Fraction(5, 2)
    dimension = 2
    normalized_operator_upper = Fraction(1)
    relative_minor_floor = normalized_minor_squared / normalized_operator_upper
    full_source_floor = Fraction(1, 8) / fixture_lambda**4
    absolute_minor_floor = relative_minor_floor / (8 * fixture_lambda**4)
    if (
        corrected_good != _diagonal([Fraction(1, 2), Fraction(1, 72)])
        or corrected_zero != _diagonal([Fraction(1, 2), Fraction(0)])
        or normalized_minor_squared != Fraction(1, 144)
        or relative_minor_floor != Fraction(1, 144)
        or full_source_floor != Fraction(2, 625)
        or absolute_minor_floor != Fraction(1, 45000)
    ):
        raise ReplayError("coframe/minor fixture reconstruction failed")

    a = [Fraction(1, 2), Fraction(1, 3)]
    alpha = [Fraction(1, 2), Fraction(1, 3)]
    b = [Fraction(1, 4), Fraction(-1, 5)]
    b_minus = _add(identity, _outer(a))
    b_plus = _add(_add(identity, _outer(alpha)), _outer(b))
    a_norm = sum((entry * entry for entry in a), Fraction(0))
    alpha_norm = sum((entry * entry for entry in alpha), Fraction(0))
    b_norm = sum((entry * entry for entry in b), Fraction(0))
    oriented_area = alpha[0] * b[1] - alpha[1] * b[0]
    b_minus_formula = Fraction(1) + a_norm
    b_plus_formula = Fraction(1) + alpha_norm + b_norm + oriented_area**2
    if (
        _determinant(b_minus) != b_minus_formula
        or b_minus_formula != Fraction(49, 36)
        or _determinant(b_plus) != b_plus_formula
        or b_plus_formula != Fraction(539, 360)
    ):
        raise ReplayError("source-Gram determinant lemma fixture failed")

    return {
        "normalized_minor_pass": {
            "fixture_lambda": fixture_lambda,
            "ambient_full_frame_R": identity,
            "p5_full_source_floor": full_source_floor,
            "R_minus_full_source_floor_I_principal_minors": [
                Fraction(1) - full_source_floor,
                Fraction(1) - full_source_floor,
                (Fraction(1) - full_source_floor) ** 2,
            ],
            "source_gram_B": source_metric,
            "physical_columns_W": good,
            "raw_frame": raw_good,
            "source_gram_corrected_frame": corrected_good,
            "normalized_minor_squared": normalized_minor_squared,
            "relative_operator_upper_U": normalized_operator_upper,
            "relative_minor_gamma": relative_minor_floor,
            "absolute_minor_floor_from_full_source": absolute_minor_floor,
            "actual_relative_floor": Fraction(1, 72),
            "passes": relative_minor_floor > 0,
        },
        "zero_minor_rejection": {
            "source_gram_B": source_metric,
            "physical_columns_W": zero,
            "source_gram_corrected_frame": corrected_zero,
            "normalized_minor_squared": (
                _determinant(zero) ** 2 / _determinant(source_metric)
            ),
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


def _countermodels() -> dict[str, Any]:
    b = [Fraction(5), Fraction(5)]
    prime = [Fraction(4), Fraction(1)]
    sign_flipped = [-value for value in prime]
    w = [base - 2 * value for base, value in zip(b, prime)]
    w_flipped = [base - 2 * value for base, value in zip(b, sign_flipped)]
    prime_even_moments = [{
        "k": k,
        "P_2k": sum((abs(value) ** (2 * k) for value in prime), Fraction(0)),
    } for k in range(1, 5)]
    if w != [Fraction(-3), Fraction(3)] or w_flipped != [Fraction(13), Fraction(7)]:
        raise ReplayError("prime-sign countermodel reconstruction failed")
    return {
        "absolute_prime_sign": {
            "atom_weights": [Fraction(1), Fraction(1)],
            "archimedean_b": b,
            "prime_S": prime,
            "locked_b_minus_2S": w,
            "sign_flipped_b_plus_2S": w_flipped,
            "locked_lower_one": min(w),
            "sign_flipped_lower_one": min(w_flipped),
            "localized_upper_one_S_squared": max(value * value for value in prime),
            "absolute_even_prime_moments": prime_even_moments,
            "absolute_moments_identical_under_prime_sign_flip": True,
            "prime_sign_determined_by_absolute_moments": False,
        },
    }


def _projection_rank_model() -> dict[str, Any]:
    lifted: Matrix = [
        [Fraction(1), Fraction(0), Fraction(1)],
        [Fraction(0), Fraction(1), Fraction(1)],
        [Fraction(1), Fraction(2), Fraction(4)],
    ]
    projected: Matrix = [lifted[0][:], lifted[1][:], [Fraction(0)] * 3]
    source_gram = _diagonal([Fraction(2), Fraction(3), Fraction(5)])
    null_witness = [Fraction(1), Fraction(1), Fraction(-1)]
    lifted_action = _matrix_vector(lifted, null_witness)
    projected_action = _matrix_vector(projected, null_witness)
    corrected = _matmul(
        _matmul(projected, _inverse(source_gram)), _transpose(projected)
    )
    if (
        _determinant(lifted) != 1
        or _rank(lifted) != 3
        or _rank(projected) != 2
        or projected_action != [Fraction(0)] * 3
        or lifted_action == [Fraction(0)] * 3
        or _determinant(corrected) != 0
    ):
        raise ReplayError("continuous/projected-rank countermodel failed")
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
        "right_null_witness": [[entry] for entry in null_witness],
        "projected_witness_action": [[entry] for entry in projected_action],
        "lifted_witness_action": [[entry] for entry in lifted_action],
        "continuous_injectivity_implies_projected_row_rank": False,
    }


def _expected_checks() -> dict[str, bool]:
    return {
        "matched_counts_reconstructed": True,
        "count_not_promoted_to_rank": True,
        "full_source_floor_reconstructed": True,
        "source_grams_retained": True,
        "positive_normalized_minor_floor_reconstructed": True,
        "zero_minor_rejected": True,
        "centered_moments_k_1_through_4_reconstructed": True,
        "same_even_moment_sign_obstruction_reconstructed": True,
        "one_sided_positive_interval_reconstructed": True,
        "absolute_prime_sign_countermodel_reconstructed": True,
        "continuous_injective_projected_rank_countermodel_reconstructed": True,
        "odd_pole_interval_positive": True,
        "odd_pole_angle_is_only_necessary": True,
    }


def _validate_exact_section(actual: Any, expected: Any, label: str) -> None:
    _validate_all_rationals(actual, label)
    _require_same(actual, _encode(expected), label)


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
        "schema",
        "terminal_state",
        "source_lock",
        "inputs",
        "source_conventions",
        "claim_boundary",
        "certificate",
        "arithmetic_libraries",
    }
    if set(payload) != expected_top:
        raise ReplayError("producer top-level inventory mismatch")
    source_lock, lock_document = _validate_source_lock(_root())
    expected_source_conventions = {
        "locked_conventions": lock_document["locked_conventions"],
        "locked_formulas": lock_document["locked_formulas"],
    }
    expected_claim_boundary = {
        "claim_class": lock_document["claim_class"],
        "proved": lock_document["claim_boundary"]["proved"],
        "not_proved": lock_document["claim_boundary"]["not_proved"],
        "source_admissions": lock_document["source_admissions"],
    }
    fixed = {
        "schema": PRODUCER_SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "source_conventions": expected_source_conventions,
        "claim_boundary": expected_claim_boundary,
        "arithmetic_libraries": ARITHMETIC_LIBRARIES,
    }
    for key, expected in fixed.items():
        _require_same(payload[key], expected, key)
    _reject_promoted_claims(payload, "artifact")
    _validate_all_rationals(payload)

    inputs = payload["inputs"]
    if not isinstance(inputs, dict) or set(inputs) != {
        "lambda_numerator", "lambda_denominator", "dps"
    }:
        raise ReplayError("input inventory mismatch")
    p = _require_int(inputs["lambda_numerator"], "lambda numerator", minimum=5)
    denominator = _require_int(
        inputs["lambda_denominator"], "lambda denominator", minimum=1
    )
    dps = _require_int(inputs["dps"], "interval precision", minimum=50)
    if p % 2 == 0 or denominator != 2:
        raise ReplayError("locked odd half-integer schedule changed")
    if dps > 10000:
        raise ReplayError("interval precision exceeds the replay budget")

    _require_same(payload["source_lock"], source_lock, "source-lock binding")

    certificate = payload["certificate"]
    certificate_keys = {
        "schedule",
        "full_source",
        "coframe_fixtures",
        "centered_moment_floors",
        "one_sided_floor",
        "countermodels",
        "projection_rank_model",
        "odd_pole_intervals",
        "checks",
    }
    if not isinstance(certificate, dict) or set(certificate) != certificate_keys:
        raise ReplayError("certificate inventory mismatch")

    independent = _independent_intervals(p, (p * p + 3) // 4, dps)
    schedule = certificate["schedule"]
    expected_schedule = _schedule(p, independent["q"])
    if not isinstance(schedule, dict) or set(schedule) != (
        set(expected_schedule) | {"transition_argument"}
    ):
        raise ReplayError("schedule inventory mismatch")
    schedule_exact = {
        key: value for key, value in schedule.items() if key != "transition_argument"
    }
    _validate_exact_section(
        schedule_exact, expected_schedule, "schedule exact fields"
    )
    _check_enclosure(
        schedule["transition_argument"], independent["q_argument"],
        "schedule.transition_argument", dps,
    )

    _validate_exact_section(
        certificate["full_source"], _full_source(p), "full_source"
    )
    coframes = _coframe_fixtures()
    _validate_exact_section(
        certificate["coframe_fixtures"], coframes, "coframe_fixtures"
    )
    centered = _centered_moment_floors()
    _validate_exact_section(
        certificate["centered_moment_floors"], centered,
        "centered_moment_floors",
    )

    one_sided = certificate["one_sided_floor"]
    if not isinstance(one_sided, dict) or set(one_sided) != {
        "A", "M", "p", "M_I_minus_A", "trace_deficit_power",
        "symbolic_lower_bound", "sqrt_five", "lower_bound",
        "strictly_positive", "actual_minimum",
    }:
        raise ReplayError("one-sided floor inventory mismatch")
    one_sided_exact = {
        key: value
        for key, value in one_sided.items()
        if key not in {"sqrt_five", "lower_bound", "strictly_positive"}
    }
    _validate_exact_section(
        one_sided_exact, _one_sided_exact(), "one_sided exact fields"
    )
    if one_sided["strictly_positive"] is not True:
        raise ReplayError("one-sided strict positivity was not reconstructed")
    one_sided_iv = _one_sided_intervals(dps)
    radius_bounds = _check_enclosure(
        one_sided["sqrt_five"], one_sided_iv["radius"],
        "one_sided.sqrt_five", dps,
    )
    floor_bounds = _check_enclosure(
        one_sided["lower_bound"], one_sided_iv["floor"],
        "one_sided.lower_bound", dps,
    )
    if radius_bounds[0] <= 2 or radius_bounds[1] >= 3:
        raise ReplayError("sqrt(5) interval is not separated inside (2,3)")
    if floor_bounds[0] <= 0 or floor_bounds[1] >= 1:
        raise ReplayError("one-sided floor interval is not separated inside (0,1)")

    countermodels = _countermodels()
    _validate_exact_section(
        certificate["countermodels"], countermodels, "countermodels"
    )
    projection = _projection_rank_model()
    _validate_exact_section(
        certificate["projection_rank_model"], projection,
        "projection_rank_model",
    )

    odd = certificate["odd_pole_intervals"]
    if not isinstance(odd, dict) or set(odd) != {
        "ell", "L", "pole_norm_squared", "projection_tail_upper",
        "B_pole", "kappa", "g_equals_kappa_L", "angle",
        "angle_classification_against_one", "positivity", "logical_role",
    }:
        raise ReplayError("odd-pole interval inventory mismatch")
    if _parse_rational(odd["kappa"], "odd_pole.kappa") != Fraction(1, 4):
        raise ReplayError("odd-pole kappa changed")
    odd_bounds = {
        key: _check_enclosure(
            odd[key], independent[key], f"odd_pole.{key}", dps
        )
        for key in (
            "ell", "L", "pole_norm_squared", "projection_tail_upper",
            "B_pole", "g_equals_kappa_L", "angle",
        )
    }
    if any(bounds[0] <= 0 for bounds in odd_bounds.values()):
        raise ReplayError("odd-pole replay did not prove strict positivity")
    angle_lower, angle_upper = _interval_bounds(independent["angle"], "angle")
    if angle_upper < 1:
        angle_classification = "strictly_below_one"
    elif angle_lower >= 1:
        angle_classification = "at_least_one"
    else:
        angle_classification = "unresolved_against_one"
    if odd["angle_classification_against_one"] != angle_classification:
        raise ReplayError("odd-pole angle classification mismatch")
    if odd["positivity"] is not True:
        raise ReplayError("odd-pole positivity flag disagrees with replay")
    if odd["logical_role"] != (
        "eta_pole<angle is necessary for the separated odd-pole trace test; "
        "it is not a sufficient capture certificate"
    ):
        raise ReplayError("odd-pole logical role was promoted")

    checks = _expected_checks()
    _require_same(certificate["checks"], checks, "certificate checks")
    if (
        coframes["normalized_minor_pass"]["relative_minor_gamma"]
        != Fraction(1, 144)
        or coframes["zero_minor_rejection"]["row_rank"] != 1
        or coframes["zero_minor_rejection"]["normalized_minor_squared"] != 0
        or coframes["zero_minor_rejection"]["passes"]
        or not all(
            record["lower_bound"] == Fraction(-1, 2)
            for record in centered["sharp_bad"]["moments"]
        )
        or not all(
            record["lower_bound"] == Fraction(1)
            for record in centered["positive_sharp"]["moments"]
        )
        or projection["projected_rank"] == projection["lifted_rank"]
        or any(lock_document["source_admissions"].values())
    ):
        raise ReplayError("strict theorem-boundary reconstruction failed")

    reconstructed_intervals = {
        "schedule_q_argument": _interval_record(independent["q_argument"], dps),
        "one_sided_radius": _interval_record(one_sided_iv["radius"], dps),
        "one_sided_floor": _interval_record(one_sided_iv["floor"], dps),
        "odd_pole_ell": _interval_record(independent["ell"], dps),
        "odd_pole_L": _interval_record(independent["L"], dps),
        "odd_pole_norm_squared": _interval_record(
            independent["pole_norm_squared"], dps
        ),
        "odd_pole_projection_tail": _interval_record(
            independent["projection_tail_upper"], dps
        ),
        "odd_pole_B": _interval_record(independent["B_pole"], dps),
        "odd_pole_g": _interval_record(independent["g_equals_kappa_L"], dps),
        "odd_pole_angle": _interval_record(independent["angle"], dps),
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
            "schedule": _encode(_schedule(p, independent["q"])),
            "full_source": _encode(_full_source(p)),
            "coframe_fixtures": _encode(coframes),
            "centered_moment_floors": _encode(centered),
            "one_sided_exact": _encode(_one_sided_exact()),
            "countermodels": _encode(countermodels),
            "projection_rank_model": _encode(projection),
            "intervals": reconstructed_intervals,
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
