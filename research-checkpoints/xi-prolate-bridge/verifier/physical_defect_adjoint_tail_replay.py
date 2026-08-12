#!/usr/bin/env python3
"""Clean-room replay for the physical-defect/adjoint-tail certificate.

This module imports no producer code and reads no environment variables. It
rehashes the source lock and every dependency, reconstructs all rational
fixtures through a separate formula tree, and independently encloses every
transcendental probe.
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


PRODUCER_SCHEMA = "xi-prolate-physical-defect-adjoint-tail-v1"
REPLAY_SCHEMA = "xi-prolate-physical-defect-adjoint-tail-replay-v1"
SOURCE_LOCK_PATH = "PHYSICAL_DEFECT_ADJOINT_TAIL_SOURCE_LOCK.json"
SOURCE_LOCK_SCHEMA = "xi-prolate-physical-defect-adjoint-tail-source-lock-v1"
CLAIM_CLASS = "PHYSICAL_DEFECT_ADJOINT_TAIL_REDUCTION"
TERMINAL_STATE = "P0_INVALIDATED"
EXPECTED_SOURCE_LOCK_SHA256 = "dd98654cae596acb1da19079c0cb50a37126ee90f5b79b4371c32dfc928d5377"
EXPECTED_MPMATH_VERSION = "1.4.1"
MAX_LAMBDA_NUMERATOR = 999999
MAX_DPS = 1000
EXPECTED_DEPENDENCY_PATHS = {
    "DIRECT_RH_ATTACK.md",
    "FULL_SOURCE_COFRAME_RANK_SOURCE_LOCK.json",
    "MATCHED_BREAKPOINT_DIRECTIONAL_MOMENT_SOURCE_LOCK.json",
    "MATCHED_HIGH_MOMENT_COFRAME_SOURCE_LOCK.json",
    "P0_SOURCE_LOCK.json",
    "PHYSICAL_LEVERAGE_SHORTED_SCHUR_SOURCE_LOCK.json",
    "PHYSICAL_SOFT_SHORT_SIGNED_SCHUR_SOURCE_LOCK.json",
    "SOFT_DEFECT_PROLATE_ANGLE_SOURCE_LOCK.json",
    "notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md",
    "notes/MATCHED_BREAKPOINT_DIRECTIONAL_MOMENT_AUDIT.md",
    "notes/MATCHED_HIGH_MOMENT_COFRAME_REDUCTION.md",
    "notes/PHYSICAL_DEFECT_ADJOINT_TAIL_REDUCTION.md",
    "notes/PHYSICAL_LEVERAGE_SHORTED_SCHUR.md",
    "notes/PHYSICAL_SOFT_SHORT_SIGNED_SCHUR.md",
    "notes/SOFT_DEFECT_PROLATE_ANGLE_REDUCTION.md",
    "requirements.txt",
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
    "libraries": ["Python fractions.Fraction", f"mpmath.iv {EXPECTED_MPMATH_VERSION}"],
    "raw_interval_or_ball_output_applicable": True,
    "shared_library_with_verifier": True,
    "independent_formula_trees_required": True,
    "serialization_guard": "every nondegenerate interval is enlarged to a precision-scaled dyadic enclosure",
    "independence_limitation": "producer and verifier share Python integer/Fraction arithmetic and the pinned mpmath.iv transcendental runtime",
}

Matrix = list[list[Fraction]]
Vector = list[Fraction]


class ReplayError(ValueError):
    """Raised on malformed input or failed independent reconstruction."""


def _validate_runtime() -> None:
    if mp.__version__ != EXPECTED_MPMATH_VERSION:
        raise ReplayError(
            "mpmath runtime mismatch: expected "
            f"{EXPECTED_MPMATH_VERSION}, found {mp.__version__}"
        )


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
    if isinstance(value, int) and not isinstance(value, bool):
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
        not isinstance(numerator, str)
        or _INTEGER_TEXT.fullmatch(numerator) is None
        or not isinstance(denominator, str)
        or _POSITIVE_INTEGER_TEXT.fullmatch(denominator) is None
    ):
        raise ReplayError(f"{label} rational text is noncanonical")
    result = Fraction(int(numerator), int(denominator))
    if str(result.numerator) != numerator or str(result.denominator) != denominator:
        raise ReplayError(f"{label} rational is not reduced")
    return result


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


def _validate_source_lock(root: Path) -> tuple[dict[str, Any], dict[str, Any]]:
    lock_path = root / SOURCE_LOCK_PATH
    raw = _read_bytes(lock_path, "source lock")
    digest = _sha256_bytes(raw)
    if digest != EXPECTED_SOURCE_LOCK_SHA256:
        raise ReplayError("source-lock hash mismatch")
    lock = _strict_json_loads(raw, "source lock")
    expected_top = {
        "schema", "claim_class", "terminal_state", "updated_date",
        "external_sources", "dependencies", "locked_conventions",
        "locked_formulas", "claim_boundary", "source_admissions",
    }
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ReplayError("source-lock inventory mismatch")
    if (
        lock["schema"] != SOURCE_LOCK_SCHEMA
        or lock["claim_class"] != CLAIM_CLASS
        or lock["terminal_state"] != TERMINAL_STATE
        or lock["external_sources"] != []
    ):
        raise ReplayError("source-lock fixed metadata mismatch")
    admissions = lock["source_admissions"]
    if not isinstance(admissions, dict) or not admissions or any(
        value is not False for value in admissions.values()
    ):
        raise ReplayError("source-lock admission or forbidden claim enabled")
    boundary = lock["claim_boundary"]
    if (
        not isinstance(boundary, dict)
        or set(boundary) != {"proved", "not_proved"}
        or not isinstance(boundary["proved"], list)
        or not isinstance(boundary["not_proved"], list)
        or not any("Riemann hypothesis" in item for item in boundary["not_proved"])
        or not any("equation (5.2)" in item for item in boundary["not_proved"])
    ):
        raise ReplayError("source-lock claim boundary malformed")
    found: dict[str, str] = {}
    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list):
        raise ReplayError("source-lock dependency inventory malformed")
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ReplayError("malformed source-lock dependency")
        relative, expected, role = item["path"], item["sha256"], item["role"]
        candidate = Path(relative) if isinstance(relative, str) else Path(".")
        if (
            not isinstance(relative, str)
            or not relative
            or candidate.is_absolute()
            or ".." in candidate.parts
            or relative in found
            or not isinstance(expected, str)
            or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str)
            or not role
        ):
            raise ReplayError("invalid source-lock dependency")
        actual = _sha256_bytes(_read_bytes(root / candidate, relative))
        if actual != expected:
            raise ReplayError(f"dependency hash mismatch: {relative}")
        found[relative] = expected
    if set(found) != EXPECTED_DEPENDENCY_PATHS:
        raise ReplayError("source-lock dependency path inventory mismatch")
    binding = {
        "path": SOURCE_LOCK_PATH,
        "sha256": digest,
        "schema": SOURCE_LOCK_SCHEMA,
        "dependency_hashes": dict(sorted(found.items())),
    }
    return binding, lock


def _dims(matrix: Matrix) -> tuple[int, int]:
    if not matrix:
        return 0, 0
    width = len(matrix[0])
    if any(len(row) != width for row in matrix):
        raise ReplayError("internal ragged replay matrix")
    return len(matrix), width


def _I(size: int) -> Matrix:
    return [[Fraction(i == j) for j in range(size)] for i in range(size)]


def _D(*entries: Fraction | int) -> Matrix:
    values = [Fraction(entry) for entry in entries]
    return [[values[i] if i == j else Fraction(0) for j in range(len(values))]
            for i in range(len(values))]


def _T(matrix: Matrix) -> Matrix:
    rows, columns = _dims(matrix)
    return [[matrix[row][column] for row in range(rows)] for column in range(columns)]


def _product(*matrices: Matrix) -> Matrix:
    if not matrices:
        raise ReplayError("internal empty matrix product")
    result = matrices[0]
    for right in matrices[1:]:
        lr, lc = _dims(result)
        rr, rc = _dims(right)
        if lc != rr:
            raise ReplayError("internal matrix dimension mismatch")
        result = [
            [
                sum((result[i][k] * right[k][j] for k in range(lc)), Fraction(0))
                for j in range(rc)
            ]
            for i in range(lr)
        ]
    return result


def _plus(left: Matrix, right: Matrix) -> Matrix:
    if _dims(left) != _dims(right):
        raise ReplayError("internal matrix shape mismatch")
    return [[a + b for a, b in zip(x, y)] for x, y in zip(left, right)]


def _minus(left: Matrix, right: Matrix) -> Matrix:
    if _dims(left) != _dims(right):
        raise ReplayError("internal matrix shape mismatch")
    return [[a - b for a, b in zip(x, y)] for x, y in zip(left, right)]


def _times(matrix: Matrix, scalar: Fraction | int) -> Matrix:
    factor = Fraction(scalar)
    return [[factor * value for value in row] for row in matrix]


def _rank_one(left: Vector, right: Vector | None = None) -> Matrix:
    other = left if right is None else right
    return [[x * y for y in other] for x in left]


def _det2(matrix: Matrix) -> Fraction:
    if _dims(matrix) != (2, 2):
        raise ReplayError("internal determinant fixture shape")
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]


def _inverse2_by_adjugate(matrix: Matrix) -> Matrix:
    """Invert the two-dimensional replay fixtures by the adjugate formula."""
    if _dims(matrix) != (2, 2):
        raise ReplayError("internal adjugate inverse fixture shape")
    determinant = _det2(matrix)
    if determinant == 0:
        raise ReplayError("internal singular adjugate fixture")
    return [
        [matrix[1][1] / determinant, -matrix[0][1] / determinant],
        [-matrix[1][0] / determinant, matrix[0][0] / determinant],
    ]


def _trace(matrix: Matrix) -> Fraction:
    rows, columns = _dims(matrix)
    if rows != columns:
        raise ReplayError("internal trace shape")
    return sum((matrix[i][i] for i in range(rows)), Fraction(0))


def _dot(left: Vector, right: Vector) -> Fraction:
    if len(left) != len(right):
        raise ReplayError("internal vector dimension mismatch")
    return sum((a * b for a, b in zip(left, right)), Fraction(0))


def _apply(matrix: Matrix, vector: Vector) -> Vector:
    return [_dot(row, vector) for row in matrix]


def _quad(matrix: Matrix, vector: Vector) -> Fraction:
    return _dot(vector, _apply(matrix, vector))


def _weighted_column_cost(matrix: Matrix, weights: Vector) -> Fraction:
    rows, columns = _dims(matrix)
    if columns != len(weights):
        raise ReplayError("internal weighted cost dimension")
    return sum(
        (weights[j] * matrix[i][j] ** 2 for i in range(rows) for j in range(columns)),
        Fraction(0),
    )


def _weighted_capture_model() -> dict[str, Any]:
    c, nu, length = Fraction(5), Fraction(3), Fraction(2)
    samples = [Fraction(-1), Fraction(4), Fraction(8), Fraction(13)]
    tau = (c - nu) * length
    capped = [max(max(c * length - value, 0) - tau, 0) for value in samples]
    cap_free = [max(nu * length - value, 0) for value in samples]

    defect = _D(9, 1, 4)
    columns = [
        [Fraction(1), Fraction(0)],
        [Fraction(1), Fraction(1)],
        [Fraction(0), Fraction(1)],
    ]
    # The verifier obtains the codimension-one projector from a normal vector,
    # not from the producer's W(W*W)^-1W* construction.
    complement_vector = [Fraction(-1), Fraction(1), Fraction(-1)]
    complement_norm_squared = _dot(complement_vector, complement_vector)
    p_h = _times(_rank_one(complement_vector), Fraction(1, complement_norm_squared))
    p_k = _minus(_I(3), p_h)
    residual = _quad(defect, complement_vector) / complement_norm_squared
    captured = _trace(defect) - residual

    # Output the normal-equation data, but reconstruct its 2x2 inverse through
    # a direct adjugate formula and cross-check it against the normal projector.
    gram = [
        [_dot([row[0] for row in columns], [row[0] for row in columns]),
         _dot([row[0] for row in columns], [row[1] for row in columns])],
        [_dot([row[1] for row in columns], [row[0] for row in columns]),
         _dot([row[1] for row in columns], [row[1] for row in columns])],
    ]
    gram_inverse = _inverse2_by_adjugate(gram)
    pseudoinverse = _product(gram_inverse, _T(columns))
    if _product(columns, pseudoinverse) != p_k:
        raise ReplayError("normal-vector and normal-equation projectors disagree")

    source_map = [
        [Fraction(1), Fraction(0), Fraction(0), Fraction(0)],
        [Fraction(0), Fraction(1), Fraction(0), Fraction(0)],
        [Fraction(0), Fraction(0), Fraction(1), Fraction(0)],
    ]
    right_inverse = _T(source_map)
    source_columns = [
        [Fraction(1), Fraction(0)],
        [Fraction(1), Fraction(1)],
        [Fraction(0), Fraction(1)],
        [Fraction(1), Fraction(0)],
    ]
    source_gram = [
        [Fraction(3), Fraction(1)],
        [Fraction(1), Fraction(2)],
    ]
    source_projection = _product(
        source_columns,
        _inverse2_by_adjugate(source_gram),
        _T(source_columns),
    )
    competitor = _product(source_map, _minus(_I(4), source_projection), right_inverse)
    competitor_cost = _weighted_column_cost(
        competitor, [Fraction(9), Fraction(1), Fraction(4)]
    )
    band = _D(Fraction(1), Fraction(1, 2), Fraction(0))
    band_trace = _trace(_product(p_h, band, p_h))
    band_symbol_floor = Fraction(6)
    central_defect = _times(band, band_symbol_floor)
    domination_remainder = _minus(central_defect, _times(band, band_symbol_floor))
    central_residual = _trace(_product(p_h, central_defect, p_h))
    strict_budget = Fraction(4)

    if (
        residual != Fraction(14, 3)
        or captured != Fraction(28, 3)
        or competitor_cost != Fraction(144, 25)
        or band_trace != Fraction(1, 2)
        or domination_remainder != _times(_I(3), 0)
        or central_residual != Fraction(3)
        or not central_residual < strict_budget
    ):
        raise ReplayError("independent weighted-capture fixture failed")

    return {
        "cap_cancellation": {
            "c": c,
            "nu": nu,
            "L": length,
            "w_values": samples,
            "threshold_tau": tau,
            "capped_excess_values": capped,
            "cap_free_values": cap_free,
            "pointwise_identity_exact": capped == cap_free,
            "operator_positive_part_substituted": False,
        },
        "least_squares_capture": {
            "D_nu": defect,
            "W": columns,
            "G": gram,
            "G_inverse": gram_inverse,
            "W_pseudoinverse": pseudoinverse,
            "P_K": p_k,
            "P_H": p_h,
            "total_trace": _trace(defect),
            "captured_trace": captured,
            "residual_trace": residual,
            "hilbert_schmidt_infimum": residual,
        },
        "full_source_competitor": {
            "T": source_map,
            "B_X": right_inverse,
            "C": source_columns,
            "source_gram_C_star_C": source_gram,
            "P_F": source_projection,
            "T_C": _product(source_map, source_columns),
            "T_B_X": _product(source_map, right_inverse),
            "competitor_operator": competitor,
            "competitor_cost": competitor_cost,
            "cost_above_infimum": competitor_cost - residual,
        },
        "central_band_necessity_fixture": {
            "T_band": band,
            "D_central": central_defect,
            "band_symbol_floor": band_symbol_floor,
            "domination_remainder_D_minus_A_T_band": domination_remainder,
            "domination_verified": domination_remainder == _times(_I(3), 0),
            "residual_band_trace": band_trace,
            "residual_trace": central_residual,
            "defect_lower_bound": band_symbol_floor * band_trace,
            "strict_excess_budget": strict_budget,
            "strict_budget_antecedent": central_residual < strict_budget,
            "necessary_trace_upper_bound": Fraction(2, 3),
            "one_state_estimate_promoted_to_trace": False,
        },
    }


def _coframe_model() -> dict[str, Any]:
    one = [Fraction(1)] * 5
    p_e = _D(1, 1, 1, 0, 0)
    complement = _minus(_I(5), p_e)
    u = _apply(p_e, one)
    e = _apply(complement, one)
    s = _dot(u, u)
    source_columns = [
        [Fraction(1), Fraction(0)],
        [Fraction(0), Fraction(1)],
        [Fraction(-1), Fraction(-1)],
        [Fraction(0), Fraction(0)],
        [Fraction(0), Fraction(0)],
    ]
    source_gram = [
        [Fraction(2), Fraction(1)],
        [Fraction(1), Fraction(2)],
    ]
    # The corrected source space is the sum-zero plane in the first three
    # coordinates, so reconstruct its projector directly as I_3-J_3/3.
    p_f = [
        [
            (Fraction(i == j) - Fraction(1, 3)) if i < 3 and j < 3 else Fraction(0)
            for j in range(5)
        ]
        for i in range(5)
    ]
    z_star = [
        [Fraction(-1, 2), Fraction(1, 2)],
        [Fraction(1, 2), Fraction(-1, 2)],
        [Fraction(-1, 2), Fraction(-1, 2)],
        [Fraction(1, 2), Fraction(1, 2)],
        [Fraction(0), Fraction(0)],
    ]
    z = _T(z_star)

    # Compute the full projected loss first, independently of the rank-one
    # decomposition that it will subsequently check.
    direct = _product(z, _minus(_I(5), p_f), z_star)
    direct_trace = _trace(direct)
    direct_determinant = _det2(direct)
    direct_is_positive_rank_one = (
        direct == _T(direct)
        and direct[0][0] >= 0
        and direct[1][1] >= 0
        and direct_determinant == 0
        and direct_trace > 0
    )
    if not direct_is_positive_rank_one:
        raise ReplayError("coframe characteristic-polynomial fixture is not PSD rank one")
    # Its characteristic polynomial is t(t-trace), hence the operator norm is
    # the reconstructed trace, not a hard-coded oracle.
    exact_loss_norm = direct_trace

    tail = _product(complement, z_star)
    raw = _product(_T(tail), tail)
    tail_e = _apply(_T(tail), e)
    correction = _times(_rank_one(tail_e), Fraction(1, s))
    loss = _plus(raw, correction)
    rho = _trace(raw)
    beta_e = _dot(tail_e, tail_e) / s
    theta = Fraction(5, 1) * rho / s
    volume = _det2(_minus(_I(2), loss))

    if (
        s != 3
        or _product(p_f, source_columns) != source_columns
        or direct != loss
        or exact_loss_norm != Fraction(2, 3)
        or rho != Fraction(1, 2)
        or beta_e != Fraction(1, 6)
        or volume != Fraction(1, 3)
    ):
        raise ReplayError("independent coframe reconstruction failed")

    return {
        "lambda": Fraction(5, 2),
        "constant_vector": one,
        "P_E": p_e,
        "u_P_E_one": u,
        "e_I_minus_P_E_one": e,
        "s_norm_u_squared": s,
        "corrected_source_columns_C": source_columns,
        "source_gram_C_star_C": source_gram,
        "P_F_from_full_gram": p_f,
        "Z_star": z_star,
        "Z_Z_star": _product(z, z_star),
        "one_star_Z_star": _product([one], z_star),
        "A_I_minus_P_E_Z_star": tail,
        "A_star_A": raw,
        "A_star_e": tail_e,
        "rank_one_correction": correction,
        "loss_from_exact_formula": loss,
        "loss_from_direct_projection": direct,
        "exact_loss_characteristic_trace": direct_trace,
        "exact_loss_characteristic_determinant": direct_determinant,
        "exact_loss_is_positive_rank_one": direct_is_positive_rank_one,
        "rho_norm_A_squared": rho,
        "beta_E": beta_e,
        "rho_plus_beta_E": rho + beta_e,
        "exact_loss_norm": exact_loss_norm,
        "old_cauchy_Theta": theta,
        "normalized_volume_det_I_minus_loss": volume,
        "exact_coframe_on_physical_family_claimed": False,
    }


def _odd_model(beta: Fraction) -> dict[str, Any]:
    c, a, length = Fraction(5), Fraction(2), Fraction(1)
    r_values = [Fraction(1), Fraction(2)]
    r_matrix = _D(*r_values)
    p = [Fraction(1, 2), Fraction(1, 3)]
    q, h = (c - beta) * length, (a - beta) * length
    if h <= 0 or any(q - value <= 0 for value in r_values):
        raise ReplayError("odd spectral fixture is outside its strict domain")
    denominators = [q - value for value in r_values]
    m_beta = _D(*denominators)
    inverse = _D(*(Fraction(1, value) for value in denominators))
    rhos = [
        sum((p[i] ** 2 * r_values[i] ** power for i in range(2)), Fraction(0))
        for power in range(6)
    ]
    chi_diagonal = [
        ((c - a) * length - value) * value / (q - value)
        for value in r_values
    ]
    chi_operator = _D(*chi_diagonal)
    chi = sum((p[i] ** 2 * chi_diagonal[i] for i in range(2)), Fraction(0))
    load = 2 * sum(
        (p[i] ** 2 / denominators[i] for i in range(2)), Fraction(0)
    )
    no_chi = 2 * (h * rhos[0] + rhos[1]) / (h * q)
    from_chi = no_chi - 2 * chi / (h * q)
    upper_bounds: list[Fraction] = []
    for order in range(5):
        prefix = sum((rhos[j] / q ** (j + 1) for j in range(order)), Fraction(0))
        upper_bounds.append(2 * (prefix + rhos[order] / (h * q**order)))
    differences = [upper_bounds[i] - upper_bounds[i + 1] for i in range(4)]
    remainders = [value - load for value in upper_bounds]
    difference_rhs = [
        2
        * sum(
            (
                p[i] ** 2
                * r_values[i] ** order
                * (q - h - r_values[i])
                for i in range(2)
            ),
            Fraction(0),
        )
        / (h * q ** (order + 1))
        for order in range(4)
    ]
    remainder_rhs = [
        2
        * sum(
            (
                p[i] ** 2
                * r_values[i] ** order
                * (q - h - r_values[i])
                / denominators[i]
                for i in range(2)
            ),
            Fraction(0),
        )
        / (h * q**order)
        for order in range(5)
    ]
    odd_matrix = [
        [denominators[0] - 2 * p[0] ** 2, -2 * p[0] * p[1]],
        [-2 * p[0] * p[1], denominators[1] - 2 * p[1] ** 2],
    ]
    odd_minors = [odd_matrix[0][0], _det2(odd_matrix)]

    if (
        load != from_chi
        or differences != difference_rhs
        or remainders != remainder_rhs
        or any(value < 0 for value in differences + remainders)
        or min(odd_minors) <= 0
        or rhos[0] >= q / 2
    ):
        raise ReplayError("independent shifted-odd spectral reconstruction failed")

    return {
        "beta": beta,
        "c": c,
        "a": a,
        "L": length,
        "R": r_matrix,
        "p": p,
        "q": q,
        "h": h,
        "M_beta": m_beta,
        "M_beta_inverse": inverse,
        "mu0": rhos[0],
        "rho_0_through_5": rhos,
        "chi_beta_operator": chi_operator,
        "chi_beta": chi,
        "load_direct": load,
        "load_from_chord_identity": from_chi,
        "load_if_chi_omitted": no_chi,
        "chi_omission_error": no_chi - load,
        "U_0_through_4": upper_bounds,
        "successive_U_differences": differences,
        "successive_U_difference_formula_rhs": difference_rhs,
        "U_minus_exact_load": remainders,
        "U_minus_exact_load_formula_rhs": remainder_rhs,
        "shifted_odd_matrix": odd_matrix,
        "shifted_odd_principal_minors": odd_minors,
        "necessary_pole_budget_q_over_2": q / 2,
        "necessary_pole_budget_margin": q / 2 - rhos[0],
    }


def _odd_and_excess_model() -> dict[str, Any]:
    unshifted = _odd_model(Fraction(0))
    shifted = _odd_model(Fraction(1))
    p = shifted["p"]
    u = [Fraction(1), Fraction(1)]
    excess = _rank_one(u)
    compensated = _plus(shifted["M_beta"], excess)
    denominators = [shifted["M_beta"][i][i] for i in range(2)]
    aligned = sum((u[i] * p[i] / denominators[i] for i in range(2)), Fraction(0))
    norm = sum((u[i] ** 2 / denominators[i] for i in range(2)), Fraction(0))
    correction = 2 * aligned**2 / (1 + norm)
    compensated_det = _det2(compensated)
    direct = 2 * (
        compensated[1][1] * p[0] ** 2
        - 2 * compensated[0][1] * p[0] * p[1]
        + compensated[0][0] * p[1] ** 2
    ) / compensated_det

    base = [[Fraction(5), Fraction(1)], [Fraction(1), Fraction(4)]]
    pole = [Fraction(1), Fraction(0)]
    tests: dict[str, Any] = {}
    for label, beta in (
        ("strict_floor_2", Fraction(2)),
        ("rejected_floor_5_over_2", Fraction(5, 2)),
    ):
        shifted_base = _minus(base, _times(_I(2), beta))
        odd = _minus(shifted_base, _times(_rank_one(pole), 2))
        transverse = shifted_base[1][1]
        reserve = shifted_base[0][0] - 2 - shifted_base[0][1] ** 2 / transverse
        tests[label] = {
            "beta_L": beta,
            "shifted_positive_base": shifted_base,
            "shifted_odd_matrix": odd,
            "transverse_C_beta": transverse,
            "off_diagonal_b": shifted_base[0][1],
            "schur_reserve": reserve,
            "principal_minors": [odd[0][0], _det2(odd)],
            "strict_pass": reserve > 0,
        }

    wrong_unshifted_reserve = (
        tests["strict_floor_2"]["shifted_positive_base"][0][0]
        - 2
        - tests["strict_floor_2"]["off_diagonal_b"] ** 2 / base[1][1]
    )

    load_one_m_beta = _D(3, 2)
    load_one_p = [Fraction(0), Fraction(1)]
    load_one_load = 2 * load_one_p[1] ** 2 / load_one_m_beta[1][1]
    load_one_odd = [
        [load_one_m_beta[0][0], Fraction(0)],
        [Fraction(0), load_one_m_beta[1][1] - 2 * load_one_p[1] ** 2],
    ]
    load_one_minors = [load_one_odd[0][0], _det2(load_one_odd)]
    wrong_positive_pole = [
        [load_one_m_beta[0][0], Fraction(0)],
        [Fraction(0), load_one_m_beta[1][1] + 2 * load_one_p[1] ** 2],
    ]
    wrong_positive_minors = [wrong_positive_pole[0][0], _det2(wrong_positive_pole)]
    load_one = {
        "M_beta": load_one_m_beta,
        "p": load_one_p,
        "load_direct": load_one_load,
        "shifted_odd_matrix": load_one_odd,
        "shifted_odd_principal_minors": load_one_minors,
        "strict_pass": load_one_load < 1 and min(load_one_minors) > 0,
        "wrong_positive_pole_matrix": wrong_positive_pole,
        "wrong_positive_pole_principal_minors": wrong_positive_minors,
        "wrong_positive_pole_matrix_is_positive": min(wrong_positive_minors) > 0,
        "wrong_positive_pole_sign_rejected": True,
    }

    if (
        direct != Fraction(31, 198)
        or correction != Fraction(4, 33)
        or shifted["load_direct"] - correction != direct
        or wrong_unshifted_reserve != Fraction(3, 4)
        or load_one_load != 1
        or load_one["strict_pass"]
        or load_one_minors[1] != 0
        or not load_one["wrong_positive_pole_matrix_is_positive"]
        or not load_one["wrong_positive_pole_sign_rejected"]
    ):
        raise ReplayError("independent odd boundary/sign fixture failed")

    return {
        "unshifted_beta_zero_nonzero_chi": unshifted,
        "shifted_beta_one_nonzero_chi": shifted,
        "aligned_positive_excess": {
            "A_plus": excess,
            "M_beta_plus_A": compensated,
            "base_load": shifted["load_direct"],
            "aligned_inner_u_star_M_inverse_p": aligned,
            "u_star_M_inverse_u": norm,
            "sherman_morrison_correction": correction,
            "compensated_load_formula": shifted["load_direct"] - correction,
            "compensated_load_direct": direct,
            "transverse_operator_norm_used_as_reserve": False,
        },
        "load_one_equality_oracle": load_one,
        "shifted_one_direction": {
            "M_actual_positive_base": base,
            "p": pole,
            "unshifted_transverse_wrong_reserve": wrong_unshifted_reserve,
            "unshifted_transverse_substituted": False,
            **tests,
        },
    }


def _exact_models() -> tuple[dict[str, Any], dict[str, bool]]:
    weighted = _weighted_capture_model()
    coframe = _coframe_model()
    odd = _odd_and_excess_model()
    checks = {
        "cap_parameter_cancels_exactly": weighted["cap_cancellation"]["capped_excess_values"]
        == weighted["cap_cancellation"]["cap_free_values"],
        "weighted_capture_infimum_exact": weighted["least_squares_capture"]["residual_trace"]
        == Fraction(14, 3),
        "source_tail_competitor_is_upper_bound": weighted["full_source_competitor"]["cost_above_infimum"]
        == Fraction(82, 75),
        "central_domination_fixture_exact": weighted["central_band_necessity_fixture"]["domination_verified"]
        and weighted["central_band_necessity_fixture"]["residual_trace"] == Fraction(3),
        "central_strict_budget_antecedent_true": weighted["central_band_necessity_fixture"]["strict_budget_antecedent"],
        "one_state_not_promoted_to_trace": not weighted["central_band_necessity_fixture"]["one_state_estimate_promoted_to_trace"],
        "full_source_gram_retained": coframe["source_gram_C_star_C"] != _I(2),
        "exact_coframe_correction_reconstructed": coframe["loss_from_exact_formula"]
        == coframe["loss_from_direct_projection"],
        "exact_coframe_bound_sharper_than_old_majorant": coframe["rho_plus_beta_E"]
        < coframe["old_cauchy_Theta"],
        "nonzero_chi_reconstructed_at_two_floors": odd["unshifted_beta_zero_nonzero_chi"]["chi_beta"] > 0
        and odd["shifted_beta_one_nonzero_chi"]["chi_beta"] > 0,
        "moment_hierarchy_nonincreasing": min(
            odd["shifted_beta_one_nonzero_chi"]["successive_U_differences"]
        ) >= 0,
        "moment_difference_formula_reconstructed": odd["shifted_beta_one_nonzero_chi"]["successive_U_differences"]
        == odd["shifted_beta_one_nonzero_chi"]["successive_U_difference_formula_rhs"],
        "moment_remainder_formula_reconstructed": odd["shifted_beta_one_nonzero_chi"]["U_minus_exact_load"]
        == odd["shifted_beta_one_nonzero_chi"]["U_minus_exact_load_formula_rhs"],
        "aligned_positive_excess_identity_exact": odd["aligned_positive_excess"]["compensated_load_formula"]
        == odd["aligned_positive_excess"]["compensated_load_direct"],
        "load_one_equality_rejected": not odd["load_one_equality_oracle"]["strict_pass"],
        "wrong_positive_odd_pole_sign_rejected": odd["load_one_equality_oracle"]["wrong_positive_pole_matrix_is_positive"]
        and odd["load_one_equality_oracle"]["wrong_positive_pole_sign_rejected"],
        "unshifted_transverse_not_substituted": not odd["shifted_one_direction"]["unshifted_transverse_substituted"],
        "nonpositive_shifted_reserve_rejected": not odd["shifted_one_direction"]["rejected_floor_5_over_2"]["strict_pass"],
        "interval_probe_not_promoted": True,
    }
    if not all(checks.values()):
        raise ReplayError("independent rational reconstruction failed")
    return {
        "cap_free_weighted_capture": weighted,
        "exact_coframe_loss": coframe,
        "shifted_odd_and_positive_excess": odd,
    }, checks


def _precision_bits(dps: int) -> int:
    return (
        dps * _LOG2_10_UPPER_NUMERATOR + _LOG2_10_UPPER_DENOMINATOR - 1
    ) // _LOG2_10_UPPER_DENOMINATOR


def _raw_mpf_fraction(raw: Any, label: str) -> Fraction:
    if not isinstance(raw, tuple) or len(raw) != 4:
        raise ReplayError(f"{label} raw endpoint malformed")
    sign, mantissa, exponent, bits = raw
    if sign not in (0, 1) or not all(isinstance(x, int) for x in raw):
        raise ReplayError(f"{label} raw endpoint malformed")
    if mantissa == 0:
        return Fraction(0)
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
    return sign, mantissa, exponent, mantissa.bit_length()


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
        raise ReplayError(f"{label} exceeds precision budget")
    numerator = -mantissa if sign else mantissa
    return (
        Fraction(numerator * (1 << exponent))
        if exponent >= 0
        else Fraction(numerator, 1 << (-exponent))
    )


def _submitted_interval(value: Any, label: str, dps: int) -> tuple[Fraction, Fraction]:
    if not isinstance(value, dict) or set(value) != {"decimal", "dyadic"}:
        raise ReplayError(f"{label} interval inventory mismatch")
    decimal, dyadic = value["decimal"], value["dyadic"]
    if (
        not isinstance(decimal, list)
        or len(decimal) != 2
        or any(not isinstance(item, str) or _DECIMAL_TEXT.fullmatch(item) is None for item in decimal)
        or not isinstance(dyadic, dict)
        or set(dyadic) != {"lower", "upper"}
    ):
        raise ReplayError(f"{label} interval serialization malformed")
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
        raise ReplayError(f"{label} decimal text does not match dyadics")
    return lower, upper


def _interval_bounds(value: Any, label: str) -> tuple[Fraction, Fraction]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    return _raw_mpf_fraction(tuple(lower), f"{label}.lower"), _raw_mpf_fraction(
        tuple(upper), f"{label}.upper"
    )


def _check_enclosure(submitted: Any, independent: Any, label: str, dps: int) -> None:
    submitted_lower, submitted_upper = _submitted_interval(submitted, label, dps)
    independent_lower, independent_upper = _interval_bounds(independent, label)
    if not submitted_lower <= independent_lower <= independent_upper <= submitted_upper:
        raise ReplayError(f"{label} does not enclose independent replay")
    scale = max(Fraction(1), abs(independent_lower), abs(independent_upper))
    exponent = _precision_bits(dps) - 64
    width_limit = scale * (
        Fraction(1, 1 << exponent) if exponent >= 0 else Fraction(1 << (-exponent))
    )
    if submitted_upper - submitted_lower > width_limit:
        raise ReplayError(f"{label} interval is excessively wide")


def _interval_targets(p: int, dps: int) -> dict[str, Any]:
    _validate_runtime()
    mp.iv.dps = dps
    lam = mp.iv.mpf(p) / 2
    length = mp.iv.log(lam) * 2
    return {
        "lambda": lam,
        "physical_length_L": length,
        "necessary_central_trace_scale_L_over_lambda": length / lam,
        "unit_s_old_tail_threshold": 1 / (4 * mp.iv.sqrt(lam**5)),
        "q_beta_one_with_c_five": length + length + length + length,
        "h_beta_one_with_a_two": length,
        "half_L_strict_budget_probe": length / 2,
    }


def _canonical_input(value: Any, label: str, minimum: int, maximum: int) -> int:
    if not isinstance(value, str):
        raise ReplayError(f"{label} must be canonical positive integer text")
    if len(value) > len(str(maximum)):
        raise ReplayError(f"{label} exceeds maximum")
    if _POSITIVE_INTEGER_TEXT.fullmatch(value) is None:
        raise ReplayError(f"{label} must be canonical positive integer text")
    minimum_text = str(minimum)
    maximum_text = str(maximum)
    if len(value) < len(minimum_text) or (
        len(value) == len(minimum_text) and value < minimum_text
    ):
        raise ReplayError(f"{label} below minimum")
    if len(value) > len(maximum_text) or (
        len(value) == len(maximum_text) and value > maximum_text
    ):
        raise ReplayError(f"{label} exceeds maximum")
    integer = int(value)
    return integer


def replay(payload: dict[str, Any], *, producer_bytes: bytes | None = None) -> dict[str, Any]:
    _validate_runtime()
    if not isinstance(payload, dict) or set(payload) != {
        "schema", "source_lock", "inputs", "terminal_state",
        "source_conventions", "claim_boundary", "certificate",
        "arithmetic_libraries",
    }:
        raise ReplayError("producer top-level inventory mismatch")
    if payload["schema"] != PRODUCER_SCHEMA or payload["terminal_state"] != TERMINAL_STATE:
        raise ReplayError("producer schema or terminal state mismatch")
    binding, lock = _validate_source_lock(_root())
    _require_same(payload["source_lock"], binding, "source-lock binding")
    _require_same(
        payload["source_conventions"],
        {
            "locked_conventions": lock["locked_conventions"],
            "locked_formulas": lock["locked_formulas"],
        },
        "source conventions",
    )
    _require_same(
        payload["claim_boundary"],
        {
            "claim_class": CLAIM_CLASS,
            "proved": lock["claim_boundary"]["proved"],
            "not_proved": lock["claim_boundary"]["not_proved"],
            "source_admissions": lock["source_admissions"],
        },
        "claim boundary",
    )
    _require_same(payload["arithmetic_libraries"], ARITHMETIC_LIBRARIES, "arithmetic libraries")

    inputs = payload["inputs"]
    if not isinstance(inputs, dict) or set(inputs) != {
        "lambda_numerator_text", "lambda_denominator_text", "dps_text"
    }:
        raise ReplayError("input inventory mismatch")
    p = _canonical_input(
        inputs["lambda_numerator_text"],
        "lambda numerator",
        3,
        MAX_LAMBDA_NUMERATOR,
    )
    dps = _canonical_input(inputs["dps_text"], "dps", 50, MAX_DPS)
    if p % 2 == 0 or inputs["lambda_denominator_text"] != "2":
        raise ReplayError("lambda must be an odd numerator over two")

    certificate = payload["certificate"]
    if not isinstance(certificate, dict) or set(certificate) != {
        "cap_free_weighted_capture", "exact_coframe_loss",
        "shifted_odd_and_positive_excess", "transcendental_intervals",
        "checks",
    }:
        raise ReplayError("certificate inventory mismatch")
    exact, expected_checks = _exact_models()
    for key, value in exact.items():
        _require_same(certificate[key], _encode(value), key)
    interval_section = certificate["transcendental_intervals"]
    if not isinstance(interval_section, dict) or set(interval_section) != {
        "formula_scale_regression_only",
        "physical_capture_or_coframe_estimate_claimed",
        "values",
    }:
        raise ReplayError("interval section inventory mismatch")
    if (
        interval_section["formula_scale_regression_only"] is not True
        or interval_section["physical_capture_or_coframe_estimate_claimed"] is not False
    ):
        raise ReplayError("interval probe promoted to theorem claim")
    targets = _interval_targets(p, dps)
    values = interval_section["values"]
    if not isinstance(values, dict) or set(values) != set(targets):
        raise ReplayError("interval target inventory mismatch")
    for key, target in targets.items():
        _check_enclosure(values[key], target, f"interval.{key}", dps)
    _require_same(certificate["checks"], expected_checks, "producer check inventory")

    canonical_bytes = (
        json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n"
    ).encode("utf-8")
    if producer_bytes is None:
        producer_bytes = canonical_bytes
    if producer_bytes != canonical_bytes:
        raise ReplayError("producer artifact bytes are not canonical exact serialization")
    parsed_bytes = _strict_json_loads(producer_bytes, "producer artifact bytes")
    _require_same(parsed_bytes, payload, "producer artifact bytes")

    return {
        "schema": REPLAY_SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "source_lock": binding,
        "inputs": inputs,
        "producer_binding": {
            "sha256": _sha256_bytes(producer_bytes),
            "byte_length": len(producer_bytes),
        },
        "reconstructed": {
            "exact_fixture_groups": 3,
            "transcendental_interval_count": len(targets),
            "source_dependency_count": len(binding["dependency_hashes"]),
        },
        "checks": {
            "formula_tree_independent": True,
            "producer_module_imported": False,
            "producer_booleans_trusted": False,
            "source_lock_and_dependencies_rehashed": True,
            "producer_bytes_bound": True,
            "all_exact_rational_models_reconstructed": True,
            "all_interval_probes_independently_enclosed": True,
            "api_key_or_environment_secret_read": False,
            "physical_weighted_capture_claimed": False,
            "exact_physical_coframe_claimed": False,
            "signed_sector_floor_claimed": False,
            "equation_5_2_claimed": False,
            "determinant_limit_claimed": False,
            "rh_proved": False,
        },
        "arithmetic_libraries": ARITHMETIC_LIBRARIES,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    input_path = Path(args.input)
    raw = _read_bytes(input_path, "producer artifact")
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
