#!/usr/bin/env python3
"""Clean-room replay of the full-source coframe/rank checkpoint.

This module does not import the producer.  It reconstructs the rational
models through a separate matrix implementation, independently evaluates the
transition interval, and binds the replay to the exact producer bytes.
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


SCHEMA = "xi-prolate-full-source-coframe-rank-v1"
REPLAY_SCHEMA = "xi-prolate-full-source-coframe-rank-replay-v1"
STATUS = "FULL_SOURCE_COFRAME_RANK_COMPONENT"
PRODUCER_RESULT = "FULL_SOURCE_COFRAME_RANK_COMPONENT_PASS"
REPLAY_RESULT = "FULL_SOURCE_COFRAME_RANK_COMPONENT_REPLAY_PASS"
TERMINAL_STATE = "P0_INVALIDATED"
NOTE = "notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md"
LOCK = "FULL_SOURCE_COFRAME_RANK_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-full-source-coframe-rank-source-lock-v1"
EXPECTED_LIBRARY = "mpmath.iv 1.4.1"

PINNED_HASHES = {
    NOTE: "3f8b381d9e51e0fa0cf89928851e89dd163ec9982249af8050a90520c0389f81",
    LOCK: "155f1c0205788d689b8e819fc10e9313c2e947c7f851a5ee2f0b25bf3f091e5b",
}

_SHA256 = re.compile(r"^[0-9a-f]{64}$")
_INTEGER_TEXT = re.compile(r"0|-?[1-9][0-9]*")
_UNSIGNED_INTEGER_TEXT = re.compile(r"0|[1-9][0-9]*")
_DECIMAL_TEXT = re.compile(r"[+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:e[+-]?[0-9]+)?")
LOG2_10_UPPER_NUMERATOR = 3321928094887363
LOG2_10_UPPER_DENOMINATOR = 10**15

LOCKED_CONVENTIONS = {
    "source_interval": "[-lambda,lambda] with Lebesgue measure and zero extension; the physical interval is [lambda^(-1),lambda] with measure du/u",
    "source_domain": "H0_even consists of even L2 source functions with zero Lebesgue integral",
    "arithmetic_map": "A_lambda*f(u)=sqrt(u)*sum_(m<=lambda/u)f(m*u)",
    "inversion": "Jg(u)=g(u^(-1)) and S_sigma=(I+sigma*J)/2",
    "source_normalization": "c_(2j)=h_(2j)-(I_(2j)/I_0)*h_0 with unit-orthonormal h_j and I_j=integral h_j; arbitrary coordinate changes retain the source Gram",
    "half_integer_schedule": "lambda=p/2 for odd p>=5 and m=ceil(lambda^2)=(p^2+3)/4",
    "strict_buffer": "the transition inventory uses t<n_star and q=ceil((2/pi^2)*log(50*p^2+25)*log(20))",
    "plus_anchor": "the deflated plus comparison has row dimension N only under the explicit nonzero projected-anchor hypothesis",
    "relative_floor_strictness": "W @ D^dagger @ adjoint(W)-gamma*R positive semidefinite is a valid sharp certificate when gamma>0; gamma=0 is rejected",
    "artifact_scope": "p and dps label exact theorem regressions and source-inventory rank certificates, not physical prolate columns or a signed Weil floor",
    "arithmetic": "finite matrices and witnesses use exact reduced rationals; transition ceilings use arbitrary-precision intervals; binary64 JSON numbers are forbidden",
}

LOCKED_FORMULAS = {
    "mobius_mass": "M_mu(lambda)=sum_(n<=floor(lambda^2))abs(mu(n))/sqrt(n)<=2*lambda",
    "full_source_right_inverse": "T=P_X*S_sigma*A_lambda has a right inverse B_X with norm(B_X)<=sqrt(2)*lambda*M_mu(lambda)",
    "full_source_frame": "[2*lambda^2*M_mu(lambda)^2]^(-1)*I_X <= T @ adjoint(T) <= (lambda^2/2)*I_X, hence T @ adjoint(T)>=(8*lambda^4)^(-1)*I_X",
    "coordinate_invariant_restriction": "for source synthesis C, D=adjoint(C) @ C, W=T @ C, and F=ran(C), T @ P_F @ adjoint(T)=W @ D^dagger @ adjoint(W)",
    "normalized_tail": "R=T @ adjoint(T), Z=R^(-1/2) @ T, L_F=Z @ (I-P_F) @ adjoint(Z), and T @ P_F @ adjoint(T)=R^(1/2) @ (I-L_F) @ R^(1/2)",
    "relative_floor": "T @ P_F @ adjoint(T)>=gamma*R iff norm(L_F)<=1-gamma for 0<gamma<=1",
    "prolate_source_gram": "for C_M=(c_2,...,c_(2M)), D_M=adjoint(C_M) @ C_M=I+v @ adjoint(v) with v_j=I_(2j)/I_0",
    "finite_prefix_floor": "for every fixed lambda>1 and finite X some non-effective mixed all-even prefix has norm(L_M)<=1/2 and W_M @ D_M^(-1) @ adjoint(W_M)>=(16*lambda^4)^(-1)*I_X; in the pinned coordinates W_M @ adjoint(W_M) dominates this whitened frame",
    "buffered_counts": "r_plus=m+floor((q+2)/4)-1 and r_minus=m+floor(q/4)",
    "row_nullities": "nu_plus>=max(0,N-r_plus) and nu_minus>=max(0,N-r_minus)",
    "triple_schedule": "at N=3*m, nu_plus>=2*m-floor((q+2)/4)+1 and nu_minus>=2*m-floor(q/4)",
    "exponential_schedule": "at N=2^(2400*p^2), nu_plus>=N-r_plus and nu_minus>=N-r_minus",
    "unbuffered_matched_obstruction": "at N=m the unbuffered r_plus=r_minus=m-2 force row nullity at least two in both sectors",
}

CLAIM_SCOPE = {
    "proved": [
        "an explicit row-frame floor for the untruncated full even zero-integral source map at lambda>1 into every fixed finite physical parity space",
        "the coordinate-invariant source-Gram restriction and normalized adjoint-tail identities",
        "a non-effective source-whitened floor for some mixed all-even prolate prefix at each fixed lambda>1 and finite target space",
        "exact buffered-family row-nullity lower bounds at arbitrary Fourier bandwidth, including the triple and locked exponential schedules",
        "exact rational countermodels separating row rank, column rank, source-coordinate scaling, and a uniform floor",
    ],
    "not_proved": [
        "the prescribed separate 0 modulo 4 and 2 modulo 4 buffered coframes at matched bandwidth",
        "an effective terminal label for the mixed all-even prefix",
        "a physical prolate-column ball certificate or restricted-conditioning constant on a common unbounded schedule",
        "a residual-feature reserve or positive signed floor in either parity sector",
        "equation (5.2) of DIRECT_RH_ATTACK.md",
        "locally uniform determinant convergence",
        "the Riemann hypothesis",
    ],
}

SOURCE_ADMISSIONS = {
    "api_key_read": False,
    "binary64_parameters_used": False,
    "cached_physical_matrix_read": False,
    "cached_prolate_eigenvectors_read": False,
    "count_promoted_to_rank": False,
    "determinant_limit_claimed": False,
    "environment_secret_read": False,
    "equation_5_2_claimed": False,
    "global_weil_positivity_assumed": False,
    "inversion_reflection_dropped": False,
    "nonpositive_relative_floor_reported_as_pass": False,
    "prescribed_buffered_physical_coframe_claimed": False,
    "projected_plus_anchor_nonzero_claimed": False,
    "raw_determinant_promoted_to_invariant_floor": False,
    "rh_proved": False,
    "signed_sector_floor_claimed": False,
    "source_gram_replaced_by_identity": False,
    "unit_source_normalization_substituted": False,
    "zeros_assumed_real": False,
    "zeta_zero_table_read": False,
}

ARITHMETIC = {
    "precision_mode": "exact rational arithmetic plus outward arbitrary-precision intervals",
    "raw_interval_or_ball_output_applicable": True,
    "library": "Python fractions.Fraction and mpmath.iv 1.4.1",
    "shared_library_with_verifier": True,
    "independent_formula_trees": True,
    "serialization_guard": "exact dyadic expansion of every nondegenerate transition interval",
    "independence_limitation": "producer and replay share Python integer/Fraction arithmetic and the pinned mpmath.iv transcendental runtime",
}

Matrix = list[list[Fraction]]


class ReplayError(ValueError):
    """Raised when an artifact or an independently rebuilt identity fails."""


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _reject_number(token: str) -> None:
    raise ReplayError(f"binary64 or non-integer JSON number rejected: {token}")


def _unique_object(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise ReplayError(f"duplicate JSON object key: {key}")
        result[key] = value
    return result


def _strict_json_loads(raw: bytes | str, label: str) -> Any:
    try:
        text = raw.decode("utf-8") if isinstance(raw, bytes) else raw
    except UnicodeDecodeError as exc:
        raise ReplayError(f"{label} is not UTF-8") from exc
    try:
        value = json.loads(
            text,
            parse_float=_reject_number,
            parse_constant=_reject_number,
            object_pairs_hook=_unique_object,
        )
    except (json.JSONDecodeError, TypeError) as exc:
        raise ReplayError(f"invalid {label}") from exc
    _validate_json(value)
    return value


def _validate_json(value: Any, path: str = "payload") -> None:
    if isinstance(value, float):
        raise ReplayError(f"binary64 value at {path}")
    if value is None or isinstance(value, (str, bool, int)):
        return
    if isinstance(value, list):
        for index, item in enumerate(value):
            _validate_json(item, f"{path}[{index}]")
        return
    if isinstance(value, dict):
        for key, item in value.items():
            if not isinstance(key, str):
                raise ReplayError(f"non-string key at {path}")
            _validate_json(item, f"{path}.{key}")
        return
    raise ReplayError(f"unsupported JSON value at {path}")


def _fraction(value: Any, label: str) -> Fraction:
    if not isinstance(value, dict) or set(value) != {"numerator", "denominator"}:
        raise ReplayError(f"{label} is not a rational record")
    numerator, denominator = value["numerator"], value["denominator"]
    if (
        not isinstance(numerator, str) or _INTEGER_TEXT.fullmatch(numerator) is None
        or not isinstance(denominator, str) or _INTEGER_TEXT.fullmatch(denominator) is None
    ):
        raise ReplayError(f"{label} has noncanonical integer text")
    den = int(denominator)
    if den <= 0:
        raise ReplayError(f"{label} denominator must be positive")
    result = Fraction(int(numerator), den)
    if str(result.numerator) != numerator or str(result.denominator) != denominator:
        raise ReplayError(f"{label} is not a reduced canonical rational")
    return result


def _parse_all_rationals(value: Any, path: str = "payload") -> None:
    if isinstance(value, dict):
        if set(value) == {"numerator", "denominator"}:
            _fraction(value, path)
            return
        for key, item in value.items():
            _parse_all_rationals(item, f"{path}.{key}")
    elif isinstance(value, list):
        for index, item in enumerate(value):
            _parse_all_rationals(item, f"{path}[{index}]")


def _same_structure(actual: Any, expected: Any) -> bool:
    """Compare a decoded JSON tree without Python's bool/int coercion."""

    if type(actual) is not type(expected):
        return False
    if isinstance(expected, dict):
        return (
            actual.keys() == expected.keys()
            and all(_same_structure(actual[key], expected[key]) for key in expected)
        )
    if isinstance(expected, list):
        return len(actual) == len(expected) and all(
            _same_structure(left, right) for left, right in zip(actual, expected)
        )
    return actual == expected


def _same(actual: Any, expected: Any, label: str) -> None:
    if not _same_structure(actual, expected):
        raise ReplayError(f"{label} mismatch")


def _source_hashes() -> dict[str, str]:
    if set(PINNED_HASHES) != {NOTE, LOCK}:
        raise ReplayError("source pins must contain exactly the note and lock")
    result: dict[str, str] = {}
    for relative, expected in PINNED_HASHES.items():
        path = Path(relative)
        if (
            _SHA256.fullmatch(expected) is None or path.is_absolute()
            or ".." in path.parts
        ):
            raise ReplayError(f"invalid finalized source pin: {relative}")
        if _digest(_root() / relative) != expected:
            raise ReplayError(f"source byte hash mismatch: {relative}")
        result[relative] = expected
    lock = _strict_json_loads((_root() / LOCK).read_bytes(), "source lock")
    top = {
        "schema", "claim_class", "terminal_state", "updated_date",
        "external_sources", "dependencies", "locked_conventions",
        "locked_formulas", "claim_boundary",
    }
    if not isinstance(lock, dict) or set(lock) != top:
        raise ReplayError("source-lock inventory mismatch")
    fixed = {
        "schema": LOCK_SCHEMA,
        "claim_class": "FULL_SOURCE_COFRAME_RANK_REDUCTION",
        "terminal_state": TERMINAL_STATE,
        "updated_date": "2026-08-08",
        "external_sources": [],
        "locked_conventions": LOCKED_CONVENTIONS,
        "locked_formulas": LOCKED_FORMULAS,
        "claim_boundary": CLAIM_SCOPE,
    }
    for key, expected in fixed.items():
        _same(lock[key], expected, f"source-lock {key}")
    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list) or not dependencies:
        raise ReplayError("source-lock dependencies missing")
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ReplayError("malformed source-lock dependency")
        relative, expected, role = item["path"], item["sha256"], item["role"]
        path = Path(relative) if isinstance(relative, str) else Path(".")
        if (
            not isinstance(relative, str) or not relative or path.is_absolute()
            or ".." in path.parts or relative in result
            or not isinstance(expected, str) or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str) or not role
        ):
            raise ReplayError("invalid source-lock dependency")
        if _digest(_root() / relative) != expected:
            raise ReplayError(f"dependency hash mismatch: {relative}")
        result[relative] = expected
    return dict(sorted(result.items()))


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


def _flip(matrix: Matrix) -> Matrix:
    if not matrix:
        return []
    width = len(matrix[0])
    if any(len(row) != width for row in matrix):
        raise ReplayError("ragged replay matrix")
    return [[matrix[i][j] for i in range(len(matrix))] for j in range(width)]


def _times(left: Matrix, right: Matrix) -> Matrix:
    if not left or not right:
        raise ReplayError("empty replay product")
    if any(len(row) != len(left[0]) for row in left) or any(len(row) != len(right[0]) for row in right):
        raise ReplayError("ragged replay product")
    if len(left[0]) != len(right):
        raise ReplayError("replay product dimension mismatch")
    return [[sum((left[i][k] * right[k][j] for k in range(len(right))), Fraction(0))
             for j in range(len(right[0]))] for i in range(len(left))]


def _minus(left: Matrix, right: Matrix) -> Matrix:
    if len(left) != len(right) or any(len(x) != len(y) for x, y in zip(left, right)):
        raise ReplayError("replay subtraction mismatch")
    return [[a - b for a, b in zip(x, y)] for x, y in zip(left, right)]


def _plus(left: Matrix, right: Matrix) -> Matrix:
    if len(left) != len(right) or any(len(x) != len(y) for x, y in zip(left, right)):
        raise ReplayError("replay addition mismatch")
    return [[a + b for a, b in zip(x, y)] for x, y in zip(left, right)]


def _multiple(value: Fraction, matrix: Matrix) -> Matrix:
    return [[value * entry for entry in row] for row in matrix]


def _diagonal(*values: Fraction) -> Matrix:
    return [[values[i] if i == j else Fraction(0) for j in range(len(values))]
            for i in range(len(values))]


def _adjugate_inverse(matrix: Matrix) -> Matrix:
    size = len(matrix)
    if size == 0 or any(len(row) != size for row in matrix):
        raise ReplayError("invalid replay inverse")
    determinant = _det(matrix)
    if determinant == 0:
        raise ReplayError("singular replay inverse")
    if size == 1:
        return [[1 / determinant]]
    cofactors: Matrix = []
    for row in range(size):
        cofactor_row: list[Fraction] = []
        for column in range(size):
            minor = [
                source_row[:column] + source_row[column + 1:]
                for index, source_row in enumerate(matrix)
                if index != row
            ]
            sign = Fraction(-1 if (row + column) % 2 else 1)
            cofactor_row.append(sign * _det(minor))
        cofactors.append(cofactor_row)
    adjugate = _flip(cofactors)
    return [[entry / determinant for entry in row] for row in adjugate]


def _det(matrix: Matrix) -> Fraction:
    size = len(matrix)
    if any(len(row) != size for row in matrix):
        raise ReplayError("invalid replay determinant")
    if size == 0:
        return Fraction(1)
    if size == 1:
        return matrix[0][0]
    result = Fraction(0)
    for column, entry in enumerate(matrix[0]):
        minor = [row[:column] + row[column + 1:] for row in matrix[1:]]
        result += (-1 if column % 2 else 1) * entry * _det(minor)
    return result


def _matrix_rank(matrix: Matrix) -> int:
    if not matrix:
        return 0
    rows, columns = len(matrix), len(matrix[0])
    work = [row[:] for row in matrix]
    pivot_row = 0
    for column in range(columns):
        pivot = next((row for row in range(pivot_row, rows) if work[row][column] != 0), None)
        if pivot is None:
            continue
        work[pivot_row], work[pivot] = work[pivot], work[pivot_row]
        for row in range(pivot_row + 1, rows):
            if work[row][column] == 0:
                continue
            left, right = work[pivot_row][column], work[row][column]
            work[row] = [left * a - right * b for a, b in zip(work[row], work[pivot_row])]
        pivot_row += 1
        if pivot_row == rows:
            break
    return pivot_row


def _minor_records(matrix: Matrix) -> list[dict[str, Any]]:
    size = len(matrix)
    records: list[dict[str, Any]] = []
    for count in range(1, size + 1):
        for indices in itertools.combinations(range(size), count):
            principal = [[matrix[i][j] for j in indices] for i in indices]
            records.append({"indices": list(indices), "determinant": _det(principal)})
    return records


def _psd(matrix: Matrix) -> bool:
    return all(record["determinant"] >= 0 for record in _minor_records(matrix))


def _replay_frame(metric: Matrix, mapping: Matrix, coordinates: Matrix) -> dict[str, Any]:
    metric_inverse = _adjugate_inverse(metric)
    full = _times(_times(mapping, metric_inverse), _flip(mapping))
    gram = _times(_times(_flip(coordinates), metric), coordinates)
    columns = _times(mapping, coordinates)
    corrected = _times(_times(columns, _adjugate_inverse(gram)), _flip(columns))
    raw = _times(columns, _flip(columns))
    return {
        "source_metric": metric,
        "full_map": mapping,
        "synthesis": coordinates,
        "full_frame_R": full,
        "source_gram": gram,
        "physical_columns_W": columns,
        "gram_corrected_frame": corrected,
        "raw_row_frame": raw,
        "row_rank": _matrix_rank(columns),
        "column_rank": _matrix_rank(_flip(columns)),
        "row_count": len(columns),
        "column_count": len(columns[0]),
        "corrected_frame_determinant": _det(corrected),
        "raw_frame_determinant": _det(raw),
    }


def _replay_penrose(matrix: Matrix, dagger: Matrix) -> dict[str, Any]:
    forward_projector = _times(matrix, dagger)
    reverse_projector = _times(dagger, matrix)
    first_round_trip = _times(forward_projector, matrix)
    second_round_trip = _times(reverse_projector, dagger)
    equations = {
        "G_Gdagger_G_equals_G": first_round_trip == matrix,
        "Gdagger_G_Gdagger_equals_Gdagger": second_round_trip == dagger,
        "G_Gdagger_is_self_adjoint": _flip(forward_projector) == forward_projector,
        "Gdagger_G_is_self_adjoint": _flip(reverse_projector) == reverse_projector,
    }
    return {
        "G_Gdagger": forward_projector,
        "Gdagger_G": reverse_projector,
        "G_Gdagger_G": first_round_trip,
        "Gdagger_G_Gdagger": second_round_trip,
        "equations": equations,
        "all_four_hold": all(equations.values()),
    }


def _rebuild_models() -> dict[str, Any]:
    metric = _diagonal(Fraction(2), Fraction(3), Fraction(5))
    mapping = [[Fraction(1), Fraction(0), Fraction(1)],
               [Fraction(0), Fraction(1), Fraction(1)]]
    ordinary = [[Fraction(1), Fraction(0)],
                [Fraction(0), Fraction(1)],
                [Fraction(0), Fraction(0)]]
    base = _replay_frame(metric, mapping, ordinary)
    sharp_gamma = Fraction(1, 2)
    sharp_difference = _minus(base["gram_corrected_frame"], _multiple(sharp_gamma, base["full_frame_R"]))
    above_gamma = Fraction(3, 5)
    above_difference = _minus(base["gram_corrected_frame"], _multiple(above_gamma, base["full_frame_R"]))

    bad_coordinates = [[Fraction(1), Fraction(0)],
                       [Fraction(0), Fraction(-1)],
                       [Fraction(0), Fraction(1)]]
    obstruction = _replay_frame(metric, mapping, bad_coordinates)
    witness = [[Fraction(0)], [Fraction(1)]]
    witness_action = _times(_flip(obstruction["physical_columns_W"]), witness)

    coordinate_change = _diagonal(Fraction(2), Fraction(1, 3))
    changed = _replay_frame(metric, mapping, _times(ordinary, coordinate_change))

    redundancy = [[Fraction(1), Fraction(0), Fraction(1)],
                  [Fraction(0), Fraction(1), Fraction(1)]]
    redundant_coordinates = _times(ordinary, redundancy)
    redundant_gram = _times(
        _times(_flip(redundant_coordinates), metric), redundant_coordinates,
    )
    redundant_columns = _times(mapping, redundant_coordinates)
    null_witness = [[Fraction(-1)], [Fraction(-1)], [Fraction(1)]]
    null_norm_squared = _times(_flip(null_witness), null_witness)[0][0]
    null_projector = _multiple(
        1 / null_norm_squared, _times(null_witness, _flip(null_witness)),
    )
    regularized_gram = _plus(redundant_gram, null_projector)
    redundant_dagger = _minus(_adjugate_inverse(regularized_gram), null_projector)
    redundant_corrected = _times(
        _times(redundant_columns, redundant_dagger), _flip(redundant_columns),
    )
    redundant_null_action = _times(redundant_gram, null_witness)
    redundant_penrose = _replay_penrose(redundant_gram, redundant_dagger)
    factor_left = _times(_flip(redundancy), base["source_gram"])
    factor_right = redundancy

    epsilon_cases = []
    for epsilon in [Fraction(1, 2), Fraction(1, 5)]:
        small_map = _diagonal(Fraction(1), epsilon)
        small_frame = _times(small_map, _flip(small_map))
        epsilon_cases.append({
            "epsilon": epsilon,
            "map": small_map,
            "row_frame": small_frame,
            "rank": _matrix_rank(small_map),
            "exact_floor": epsilon**2,
            "determinant": _det(small_frame),
        })

    wide = [[Fraction(1), Fraction(0), Fraction(0)],
            [Fraction(0), Fraction(1), Fraction(0)]]
    tall = _flip(wide)
    wide_row, wide_column = _times(wide, _flip(wide)), _times(_flip(wide), wide)
    tall_row, tall_column = _times(tall, _flip(tall)), _times(_flip(tall), tall)

    vector = [[Fraction(1)], [Fraction(2)]]
    outer = _times(vector, _flip(vector))
    special_metric = [[outer[i][j] + Fraction(i == j) for j in range(2)] for i in range(2)]
    special_W = [[Fraction(1), Fraction(1)], [Fraction(0), Fraction(1)]]
    special_white = _times(_times(special_W, _adjugate_inverse(special_metric)), _flip(special_W))
    special_raw = _times(special_W, _flip(special_W))
    special_difference = _minus(special_raw, special_white)

    return {
        "sharp_relative_floor": {
            "model": base,
            "gamma_zero_rejection": {
                "gamma": Fraction(0),
                "difference_is_psd": _psd(base["gram_corrected_frame"]),
                "accepted": False,
                "reason": "gamma must be strictly positive",
            },
            "gamma_sharp_pass": {
                "gamma": sharp_gamma,
                "difference": sharp_difference,
                "principal_minors": _minor_records(sharp_difference),
                "difference_is_psd": _psd(sharp_difference),
                "determinant_zero_equality": _det(sharp_difference) == 0,
                "accepted": sharp_gamma > 0 and _psd(sharp_difference),
            },
            "gamma_above_rejection": {
                "gamma": above_gamma,
                "difference": above_difference,
                "principal_minors": _minor_records(above_difference),
                "difference_is_psd": _psd(above_difference),
                "accepted": False,
            },
        },
        "count_not_rank": {
            "model": obstruction,
            "left_null_witness": witness,
            "left_null_action": witness_action,
            "columns_equal_rows": obstruction["column_count"] == obstruction["row_count"],
            "full_row_rank": obstruction["row_rank"] == obstruction["row_count"],
        },
        "coordinate_change": {
            "original": base,
            "change_of_coordinates": coordinate_change,
            "change_determinant": _det(coordinate_change),
            "changed": changed,
            "corrected_frame_preserved": changed["gram_corrected_frame"] == base["gram_corrected_frame"],
            "raw_determinant_changed": changed["raw_frame_determinant"] != base["raw_frame_determinant"],
        },
        "redundant_columns_pseudoinverse": {
            "source_metric": metric,
            "full_map": mapping,
            "synthesis_C_redundant": redundant_coordinates,
            "source_gram_G": redundant_gram,
            "source_gram_rank": _matrix_rank(redundant_gram),
            "source_gram_determinant": _det(redundant_gram),
            "physical_columns_W": redundant_columns,
            "full_rank_factorization": {
                "left": factor_left,
                "right": factor_right,
                "reconstruction": _times(factor_left, factor_right),
                "left_rank": _matrix_rank(factor_left),
                "right_rank": _matrix_rank(factor_right),
            },
            "exact_null_witness": null_witness,
            "null_action": redundant_null_action,
            "G_dagger": redundant_dagger,
            "penrose": redundant_penrose,
            "gram_corrected_frame": redundant_corrected,
            "base_corrected_frame": base["gram_corrected_frame"],
            "corrected_frame_equals_base": redundant_corrected == base["gram_corrected_frame"],
            "producer_derivation": "full-rank factorization; singular G is never passed to ordinary inverse",
            "replay_required_derivation": "exact null projector regularization (G+P_null)^(-1)-P_null",
            "ordinary_inverse_of_singular_gram_used": False,
        },
        "epsilon_full_rank_no_uniform_floor": {
            "symbolic_family": "diag(1,epsilon), epsilon>0, has exact row-frame floor epsilon^2",
            "cases": epsilon_cases,
            "all_cases_full_rank": all(case["rank"] == 2 for case in epsilon_cases),
            "floor_decreases": epsilon_cases[1]["exact_floor"] < epsilon_cases[0]["exact_floor"],
            "uniform_positive_floor_claimed": False,
        },
        "row_vs_column_gram": {
            "row_full_column_singular": {
                "W": wide,
                "row_gram": wide_row,
                "column_gram": wide_column,
                "row_gram_rank": _matrix_rank(wide_row),
                "column_gram_rank": _matrix_rank(wide_column),
                "row_coframe": True,
                "column_gram_positive_definite": False,
            },
            "column_full_row_singular": {
                "W": tall,
                "row_gram": tall_row,
                "column_gram": tall_column,
                "row_gram_rank": _matrix_rank(tall_row),
                "column_gram_rank": _matrix_rank(tall_column),
                "row_coframe": False,
                "column_gram_positive_definite": True,
            },
        },
        "special_prolate_gram": {
            "v": vector,
            "D_equals_I_plus_vv_star": special_metric,
            "D_inverse": _adjugate_inverse(special_metric),
            "W": special_W,
            "raw_frame": special_raw,
            "whitened_frame": special_white,
            "raw_minus_whitened": special_difference,
            "difference_principal_minors": _minor_records(special_difference),
            "whitened_below_raw": _psd(special_difference),
        },
    }


def _precision_bits(dps: int) -> int:
    return (dps * LOG2_10_UPPER_NUMERATOR + LOG2_10_UPPER_DENOMINATOR - 1) // LOG2_10_UPPER_DENOMINATOR


def _transition_interval(p: int, dps: int) -> tuple[tuple[mp.mpf, mp.mpf], int]:
    if f"mpmath.iv {mp.__version__}" != EXPECTED_LIBRARY:
        raise ReplayError("pinned mpmath.iv version is not active")
    old = mp.iv.dps
    try:
        mp.iv.dps = dps
        two = mp.iv.mpf(2)
        first = mp.iv.log(mp.iv.mpf(25)) + mp.iv.log(mp.iv.mpf(2 * p * p + 1))
        second = two * mp.iv.log(two) + mp.iv.log(mp.iv.mpf(5))
        value = two * first * second / (mp.iv.pi**2)
        lower_raw, upper_raw = value._mpi_  # type: ignore[attr-defined]
        bits = max(int(lower_raw[3]), int(upper_raw[3])) + 48
        with mp.workprec(bits):
            lower, upper = +mp.mpf(tuple(lower_raw)), +mp.mpf(tuple(upper_raw))
        q_lower, q_upper = int(mp.ceil(lower)), int(mp.ceil(upper))
        if q_lower != q_upper:
            raise ReplayError("independent transition ceiling is not separated")
        return (lower, upper), q_lower
    finally:
        mp.iv.dps = old


def _raw_endpoint(value: Any, label: str, dps: int) -> mp.mpf:
    if not isinstance(value, list) or len(value) != 4:
        raise ReplayError(f"{label} must be a four-part dyadic endpoint")
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
    elif mantissa % 2 == 0 or mantissa.bit_length() != bit_count:
        raise ReplayError(f"{label} is not a normalized dyadic")
    if bit_count > _precision_bits(dps) + 128 or abs(exponent) > 16 * _precision_bits(dps) + 1024:
        raise ReplayError(f"{label} exceeds the precision budget")
    try:
        with mp.workprec(max(64, bit_count + 16)):
            return +mp.mpf((sign, mantissa, exponent, bit_count))
    except (TypeError, ValueError, OverflowError) as exc:
        raise ReplayError(f"{label} is not a finite dyadic") from exc


def _submitted_interval(value: Any, label: str, dps: int) -> tuple[mp.mpf, mp.mpf]:
    if not isinstance(value, dict) or set(value) != {"decimal", "dyadic"}:
        raise ReplayError(f"{label} interval inventory mismatch")
    decimal, dyadic = value["decimal"], value["dyadic"]
    if not isinstance(decimal, list) or len(decimal) != 2 or any(
        not isinstance(item, str) or _DECIMAL_TEXT.fullmatch(item) is None for item in decimal
    ):
        raise ReplayError(f"{label} decimal endpoints are noncanonical")
    if not isinstance(dyadic, dict) or set(dyadic) != {"lower", "upper"}:
        raise ReplayError(f"{label} dyadic inventory mismatch")
    lower = _raw_endpoint(dyadic["lower"], f"{label}.lower", dps)
    upper = _raw_endpoint(dyadic["upper"], f"{label}.upper", dps)
    if lower > upper:
        raise ReplayError(f"{label} interval is reversed")
    with mp.workdps(dps + 20):
        if decimal != [mp.nstr(lower, dps + 10), mp.nstr(upper, dps + 10)]:
            raise ReplayError(f"{label} decimal text does not match dyadics")
    return lower, upper


def _schedule(p: int, q: int) -> dict[str, Any]:
    m = (p * p + 3) // 4
    plus = m + (q + 2) // 4 - 1
    minus = m + q // 4
    exponent = 2400 * p * p
    return {
        "lambda": Fraction(p, 2),
        "m_rule": "ceil(lambda^2)",
        "m": m,
        "q": q,
        "n_star": p * p + 6 + q,
        "r_plus_buffered": plus,
        "r_minus_buffered": minus,
        "plus_anchor": {
            "projected_nonzero_hypothesis_required": True,
            "projected_nonzero_proved": False,
            "deflated_row_dimension_rule_conditional_on_hypothesis": "N",
            "matched_N": m,
        },
        "matched_buffered": {
            "N": m,
            "plus_count_forced_row_nullity_lower_bound": max(0, m - plus),
            "minus_count_forced_row_nullity_lower_bound": max(0, m - minus),
            "count_proves_row_rank": False,
        },
        "matched_unbuffered": {
            "N": m,
            "r_plus_unbuffered": m - 2,
            "r_minus_unbuffered": m - 2,
            "plus_count_forced_row_nullity_lower_bound": 2,
            "minus_count_forced_row_nullity_lower_bound": 2,
        },
        "triple_schedule": {
            "N": 3 * m,
            "plus_count_forced_row_nullity_lower_bound": 3 * m - plus,
            "minus_count_forced_row_nullity_lower_bound": 3 * m - minus,
        },
        "locked_exponential_schedule": {
            "N_symbolic": {"base": 2, "exponent": exponent, "expression": "2^exponent"},
            "plus_nullity_symbolic": {
                "expression": "2^exponent-r_plus_buffered",
                "subtrahend": plus,
                "strictly_positive": exponent >= plus.bit_length(),
            },
            "minus_nullity_symbolic": {
                "expression": "2^exponent-r_minus_buffered",
                "subtrahend": minus,
                "strictly_positive": exponent >= minus.bit_length(),
            },
            "decimal_expansion_serialized": False,
        },
    }


def _bounds(p: int) -> dict[str, Any]:
    return {
        "mobius_elementary_upper": Fraction(p),
        "full_source_elementary_row_floor": Fraction(2, p**4),
        "full_source_operator_upper": Fraction(p * p, 8),
        "mixed_prefix_relative_gamma": Fraction(1, 2),
        "mixed_prefix_non_effective_row_floor": Fraction(1, p**4),
        "mixed_prefix_terminal_label_effective": False,
        "mixed_prefix_uses_both_residue_classes": True,
    }


def replay(payload: dict[str, Any], *, producer_bytes: bytes | None = None) -> dict[str, Any]:
    if producer_bytes is None:
        raise ReplayError("exact producer artifact bytes are required")
    decoded = _strict_json_loads(producer_bytes, "producer artifact")
    _same(payload, decoded, "payload versus producer bytes")
    if not isinstance(payload, dict):
        raise ReplayError("producer artifact must be an object")
    top = {
        "schema", "status", "terminal_state", "input", "source_hashes",
        "locked_conventions", "locked_formulas", "claim_scope",
        "source_admissions", "arithmetic", "certificate", "result",
    }
    if set(payload) != top:
        raise ReplayError("producer top-level inventory mismatch")
    _parse_all_rationals(payload)
    fixed = {
        "schema": SCHEMA,
        "status": STATUS,
        "terminal_state": TERMINAL_STATE,
        "locked_conventions": LOCKED_CONVENTIONS,
        "locked_formulas": LOCKED_FORMULAS,
        "claim_scope": CLAIM_SCOPE,
        "source_admissions": SOURCE_ADMISSIONS,
        "arithmetic": ARITHMETIC,
        "result": PRODUCER_RESULT,
    }
    for key, expected in fixed.items():
        _same(payload[key], expected, key)
    if any(payload["source_admissions"].values()):
        raise ReplayError("source admission violates the claim boundary")
    hashes = _source_hashes()
    _same(payload["source_hashes"], hashes, "source hashes")

    inputs = payload["input"]
    if not isinstance(inputs, dict) or set(inputs) != {"lambda_numerator", "dps"}:
        raise ReplayError("input inventory mismatch")
    p, dps = inputs["lambda_numerator"], inputs["dps"]
    if isinstance(p, bool) or not isinstance(p, int) or p < 5 or p % 2 == 0:
        raise ReplayError("invalid exact lambda numerator")
    if isinstance(dps, bool) or not isinstance(dps, int) or dps < 50:
        raise ReplayError("invalid interval precision")

    certificate = payload["certificate"]
    if not isinstance(certificate, dict) or set(certificate) != {
        "transition_ceiling_argument", "schedule", "full_source_bounds",
        "exact_regressions", "theorem_checks",
    }:
        raise ReplayError("certificate inventory mismatch")
    independent_interval, q = _transition_interval(p, dps)
    submitted = _submitted_interval(
        certificate["transition_ceiling_argument"], "transition ceiling", dps,
    )
    if not (submitted[0] <= independent_interval[0] <= independent_interval[1] <= submitted[1]):
        raise ReplayError("submitted transition interval does not contain independent replay")
    with mp.workdps(dps + 20):
        scale = max(mp.mpf(1), abs(independent_interval[0]), abs(independent_interval[1]))
        allowed_width = mp.ldexp(scale, -_precision_bits(dps) + 48)
        if submitted[1] - submitted[0] > allowed_width:
            raise ReplayError("submitted transition interval is excessively wide")

    _same(certificate["schedule"], _encode(_schedule(p, q)), "independent schedule")
    _same(certificate["full_source_bounds"], _encode(_bounds(p)), "full-source bounds")
    rebuilt_models = _rebuild_models()
    _same(certificate["exact_regressions"], _encode(rebuilt_models), "independently rebuilt regressions")
    checks = {
        "full_source_elementary_floor_constant_reconstructed": True,
        "source_gram_coordinate_invariance_reconstructed": True,
        "sharp_positive_semidefinite_equality_accepted": True,
        "gamma_zero_rejected": True,
        "gamma_above_sharp_rejected": True,
        "count_not_promoted_to_rank": True,
        "left_null_witness_reconstructed": True,
        "redundant_column_pseudoinverse_penrose_reconstructed": True,
        "row_and_column_gram_distinguished": True,
        "special_prolate_whitened_frame_below_raw": True,
        "symbolic_exponential_nullities_reconstructed_without_expansion": True,
        "plus_anchor_remains_an_unproved_hypothesis": True,
    }
    _same(certificate["theorem_checks"], checks, "theorem checks")

    sharp = rebuilt_models["sharp_relative_floor"]
    obstruction = rebuilt_models["count_not_rank"]
    coordinate = rebuilt_models["coordinate_change"]
    redundant = rebuilt_models["redundant_columns_pseudoinverse"]
    traps = rebuilt_models["row_vs_column_gram"]
    special = rebuilt_models["special_prolate_gram"]
    schedule = _schedule(p, q)
    if (
        not sharp["gamma_sharp_pass"]["accepted"]
        or not sharp["gamma_sharp_pass"]["determinant_zero_equality"]
        or sharp["gamma_zero_rejection"]["accepted"]
        or sharp["gamma_above_rejection"]["difference_is_psd"]
        or obstruction["full_row_rank"]
        or obstruction["left_null_action"] != [[Fraction(0)], [Fraction(0)]]
        or not coordinate["corrected_frame_preserved"]
        or not coordinate["raw_determinant_changed"]
        or redundant["source_gram_rank"] != 2
        or redundant["source_gram_determinant"] != 0
        or not redundant["penrose"]["all_four_hold"]
        or not redundant["corrected_frame_equals_base"]
        or redundant["ordinary_inverse_of_singular_gram_used"]
        or not traps["row_full_column_singular"]["row_coframe"]
        or traps["column_full_row_singular"]["row_coframe"]
        or not special["whitened_below_raw"]
        or schedule["matched_buffered"]["count_proves_row_rank"]
        or schedule["plus_anchor"]["projected_nonzero_proved"]
    ):
        raise ReplayError("strict coframe/rank boundary regression failed")

    return {
        "schema": REPLAY_SCHEMA,
        "status": STATUS,
        "terminal_state": TERMINAL_STATE,
        "input": inputs,
        "source_hashes": hashes,
        "producer_binding": {
            "sha256": hashlib.sha256(producer_bytes).hexdigest(),
            "bytes": len(producer_bytes),
        },
        "checks": {
            "transition_ceiling_rebuilt_from_factored_logs": True,
            "schedule_and_symbolic_nullities_rebuilt": True,
            "rational_frames_rebuilt_by_independent_matrix_path": True,
            "sharp_psd_equality_and_gamma_boundaries_rebuilt": True,
            "left_null_and_gram_traps_rebuilt": True,
            "singular_gram_pseudoinverse_rebuilt_from_null_projector": True,
            "source_coordinate_invariance_rebuilt": True,
            "plus_anchor_not_promoted": True,
        },
        "producer_pass_boolean_trusted": False,
        "arithmetic": ARITHMETIC,
        "result": REPLAY_RESULT,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--artifact", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    raw = Path(args.artifact).read_bytes()
    payload = _strict_json_loads(raw, "producer artifact")
    report = replay(payload, producer_bytes=raw)
    Path(args.output).write_text(
        json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8",
    )


if __name__ == "__main__":
    main()
