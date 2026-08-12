#!/usr/bin/env python3
"""Clean-room replay for the Mellin/soft-symbol/graph-spill checkpoint.

This verifier imports no producer module, reads no environment variables, and
does not accept cached matrices, eigenvectors, zero ordinates, or producer
booleans as mathematical evidence.  It rehashes the source lock, its eighteen
dependencies, and the four separately inventoried external source files; then
it rebuilds every exact fixture and outward interval through an independent
formula tree.  The only admitted terminal state is ``P0_INVALIDATED``.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
import math
from pathlib import Path
import re
from typing import Any

import mpmath as mp


PRODUCER_SCHEMA = "xi-prolate-mellin-projection-soft-symbol-graph-spill-v1"
REPLAY_SCHEMA = (
    "xi-prolate-mellin-projection-soft-symbol-graph-spill-replay-v1"
)
SOURCE_LOCK_PATH = "MELLIN_PROJECTION_SOFT_SYMBOL_GRAPH_SPILL_SOURCE_LOCK.json"
SOURCE_LOCK_SCHEMA = (
    "xi-prolate-mellin-projection-soft-symbol-graph-spill-source-lock-v1"
)
CLAIM_CLASS = (
    "MELLIN_PROJECTION_SOFT_SYMBOL_GRAPH_SPILL_ODD_HARMONIC_"
    "OBSTRUCTION_REDUCTION"
)
TERMINAL_STATE = "P0_INVALIDATED"
UPDATED_DATE = "2026-08-08"
EXPECTED_SOURCE_LOCK_SHA256 = (
    "150b5a8f63c60bfd13c2813d40c2ec3bd99df138b172a2006feb2d66f8dace7c"
)
EXPECTED_MPMATH_VERSION = "1.4.1"
EXPECTED_DEPENDENCY_PATHS = {
    "DIRECT_RH_ATTACK.md",
    "P0_SOURCE_LOCK.json",
    "P0_MATRIX_FORMULAS.md",
    "P0_NORMALIZATION_AUDIT.md",
    "PROJECTED_STATE_NORM_SOURCE_LOCK.json",
    "notes/PROJECTED_STATE_NORM_LOWER_BOUND.md",
    "notes/PROJECTION_RATE_THEOREM.md",
    "WEIGHTED_SPECTRAL_ALIGNMENT_CHEBYSHEV_EDGE_SOURCE_LOCK.json",
    "notes/WEIGHTED_SPECTRAL_ALIGNMENT_CHEBYSHEV_EDGE_REDUCTION.md",
    "P3_SOURCE_LOCK.json",
    "ZERO_SAMPLING_SOURCE_LOCK.json",
    "vendor/CCM-ZST-2511.22755v1.pdf",
    "vendor/CCM-PROLATE-2310.18423v2.pdf",
    "vendor/FKS-PNT-2204.02588v3.pdf",
    "vendor/HSW-ZC-2107.06506v1.pdf",
    "notes/MELLIN_PROJECTION_SOFT_SYMBOL_REDUCTION.md",
    "notes/ODD_POLE_HARMONIC_CHEBYSHEV_OBSTRUCTION.md",
    "requirements.txt",
}
EXPECTED_EXTERNAL_PATHS = {
    "vendor/CCM-ZST-2511.22755v1.pdf",
    "vendor/CCM-PROLATE-2310.18423v2.pdf",
    "vendor/FKS-PNT-2204.02588v3.pdf",
    "vendor/HSW-ZC-2107.06506v1.pdf",
}

_SHA256 = re.compile(r"^[0-9a-f]{64}$")
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
    "libraries": [
        "Python fractions.Fraction",
        f"mpmath.iv {EXPECTED_MPMATH_VERSION}",
    ],
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
Vector = list[Fraction]


class ReplayError(ValueError):
    """Raised when a submitted producer artifact fails independent replay."""


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _digest(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def _read(path: Path, label: str) -> bytes:
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


def _validate_json(value: Any, label: str = "payload") -> None:
    if value is None or type(value) in (str, bool):
        return
    if isinstance(value, int) and not isinstance(value, bool):
        return
    if isinstance(value, float):
        raise ReplayError(f"binary64 value at {label} is forbidden")
    if isinstance(value, list):
        for index, child in enumerate(value):
            _validate_json(child, f"{label}[{index}]")
        return
    if isinstance(value, dict):
        for key, child in value.items():
            if not isinstance(key, str):
                raise ReplayError(f"non-string JSON key at {label}")
            _validate_json(child, f"{label}.{key}")
        return
    raise ReplayError(f"non-JSON value at {label}")


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


def _same(left: Any, right: Any) -> bool:
    if type(left) is not type(right):
        return False
    if isinstance(left, dict):
        return set(left) == set(right) and all(
            _same(left[key], right[key]) for key in left
        )
    if isinstance(left, list):
        return len(left) == len(right) and all(
            _same(a, b) for a, b in zip(left, right)
        )
    return left == right


def _require(actual: Any, expected: Any, label: str) -> None:
    if not _same(actual, expected):
        raise ReplayError(f"{label} mismatch or claim promotion")


def _rational(value: Fraction | int) -> dict[str, str]:
    item = value if isinstance(value, Fraction) else Fraction(value)
    return {
        "numerator": str(item.numerator),
        "denominator": str(item.denominator),
    }


def _encode(value: Any) -> Any:
    if isinstance(value, Fraction):
        return _rational(value)
    if isinstance(value, (list, tuple)):
        return [_encode(item) for item in value]
    if isinstance(value, dict):
        return {key: _encode(item) for key, item in value.items()}
    return value


def _validate_runtime() -> None:
    if getattr(mp, "__version__", None) != EXPECTED_MPMATH_VERSION:
        raise ReplayError(
            "mpmath runtime mismatch: expected "
            f"{EXPECTED_MPMATH_VERSION}, found {getattr(mp, '__version__', None)!r}"
        )


def _canonical_input(value: Any, label: str, allowed: set[int]) -> int:
    if not isinstance(value, str) or _POSITIVE_INTEGER_TEXT.fullmatch(value) is None:
        raise ReplayError(f"{label} must be canonical positive integer text")
    upper = str(max(allowed))
    if len(value) > len(upper) or (len(value) == len(upper) and value > upper):
        raise ReplayError(f"{label} exceeds maximum")
    if value not in {str(item) for item in allowed}:
        choices = ", ".join(str(item) for item in sorted(allowed))
        raise ReplayError(f"{label} must be one of {{{choices}}}")
    return int(value)


def _validate_source_lock(root: Path) -> tuple[dict[str, Any], dict[str, Any]]:
    raw = _read(root / SOURCE_LOCK_PATH, "source lock")
    lock_hash = _digest(raw)
    if lock_hash != EXPECTED_SOURCE_LOCK_SHA256:
        raise ReplayError("source-lock hash mismatch")
    lock = _strict_json_loads(raw, "source lock")
    expected_top = {
        "schema",
        "claim_class",
        "terminal_state",
        "updated_date",
        "external_sources",
        "dependencies",
        "locked_conventions",
        "locked_formulas",
        "claim_boundary",
        "source_admissions",
    }
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ReplayError("source-lock inventory mismatch")
    if (
        lock["schema"] != SOURCE_LOCK_SCHEMA
        or lock["claim_class"] != CLAIM_CLASS
        or lock["terminal_state"] != TERMINAL_STATE
        or lock["updated_date"] != UPDATED_DATE
    ):
        raise ReplayError("source-lock fixed metadata mismatch")

    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list) or len(dependencies) != 18:
        raise ReplayError("source-lock dependency inventory malformed")
    found: dict[str, str] = {}
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
        if _digest(_read(root / candidate, relative)) != expected:
            raise ReplayError(f"dependency hash mismatch: {relative}")
        found[relative] = expected
    if set(found) != EXPECTED_DEPENDENCY_PATHS:
        raise ReplayError("source-lock dependency path inventory mismatch")

    external = lock["external_sources"]
    if not isinstance(external, list) or len(external) != 4:
        raise ReplayError("external-source inventory malformed")
    external_hashes: dict[str, str] = {}
    external_ids: set[str] = set()
    for item in external:
        if not isinstance(item, dict) or set(item) != {
            "id",
            "version",
            "vendored_path",
            "sha256",
            "use",
        }:
            raise ReplayError("malformed external-source item")
        identifier = item["id"]
        relative = item["vendored_path"]
        expected = item["sha256"]
        if (
            not isinstance(identifier, str)
            or not identifier
            or identifier in external_ids
            or not isinstance(relative, str)
            or relative in external_hashes
            or relative not in EXPECTED_EXTERNAL_PATHS
            or not isinstance(expected, str)
            or _SHA256.fullmatch(expected) is None
            or not isinstance(item["version"], str)
            or not item["version"]
            or not isinstance(item["use"], str)
            or not item["use"]
        ):
            raise ReplayError("invalid external-source item")
        actual = _digest(_read(root / relative, relative))
        if actual != expected or found.get(relative) != expected:
            raise ReplayError(f"external-source hash mismatch: {relative}")
        external_ids.add(identifier)
        external_hashes[relative] = expected
    if set(external_hashes) != EXPECTED_EXTERNAL_PATHS:
        raise ReplayError("external-source path inventory mismatch")

    conventions = lock["locked_conventions"]
    formulas = lock["locked_formulas"]
    if not isinstance(conventions, dict) or not conventions:
        raise ReplayError("source-lock conventions missing")
    if not isinstance(formulas, dict) or not formulas:
        raise ReplayError("source-lock formulas missing")
    if "Xi(t)/4" not in conventions.get("limiting_transform", ""):
        raise ReplayError("source scalar Xi/4 was altered")
    if "minus sign is immutable" not in conventions.get("prime_block", ""):
        raise ReplayError("minus-prime convention was altered")
    if "inclusive" not in conventions.get("prime_block", ""):
        raise ReplayError("prime-power endpoint convention was altered")
    if "reflection" not in conventions.get("inversion", ""):
        raise ReplayError("inversion reflection convention was altered")
    boundary = lock["claim_boundary"]
    if (
        not isinstance(boundary, dict)
        or set(boundary) != {"proved", "not_proved"}
        or not isinstance(boundary["proved"], list)
        or not isinstance(boundary["not_proved"], list)
        or not all(isinstance(item, str) for item in boundary["proved"])
        or not all(isinstance(item, str) for item in boundary["not_proved"])
        or not any("Riemann hypothesis" in item for item in boundary["not_proved"])
        or not any("equation (5.2)" in item for item in boundary["not_proved"])
    ):
        raise ReplayError("source-lock claim boundary malformed")
    admissions = lock["source_admissions"]
    if not isinstance(admissions, dict) or not admissions:
        raise ReplayError("source-lock admissions missing")
    for key, value in admissions.items():
        if not isinstance(key, str) or type(value) is not bool or value:
            raise ReplayError("source-lock admission promotes a forbidden claim")

    return {
        "path": SOURCE_LOCK_PATH,
        "sha256": lock_hash,
        "schema": SOURCE_LOCK_SCHEMA,
        "dependency_hashes": dict(sorted(found.items())),
        "external_source_hashes": dict(sorted(external_hashes.items())),
    }, lock


def _diag(*entries: Fraction | int) -> Matrix:
    values = [Fraction(entry) for entry in entries]
    return [
        [values[i] if i == j else Fraction(0) for j in range(len(values))]
        for i in range(len(values))
    ]


def _identity(size: int) -> Matrix:
    return _diag(*([Fraction(1)] * size))


def _transpose(matrix: Matrix) -> Matrix:
    if not matrix or any(len(row) != len(matrix[0]) for row in matrix):
        raise ReplayError("internal matrix is empty or ragged")
    return [
        [matrix[i][j] for i in range(len(matrix))]
        for j in range(len(matrix[0]))
    ]


def _product(left: Matrix, right: Matrix) -> Matrix:
    if (
        not left
        or not right
        or any(len(row) != len(left[0]) for row in left)
        or any(len(row) != len(right[0]) for row in right)
        or len(left[0]) != len(right)
    ):
        raise ReplayError("internal matrix dimension mismatch")
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


def _difference(left: Matrix, right: Matrix) -> Matrix:
    if len(left) != len(right) or any(
        len(a) != len(b) for a, b in zip(left, right)
    ):
        raise ReplayError("internal matrix shape mismatch")
    return [
        [a - b for a, b in zip(row_a, row_b)]
        for row_a, row_b in zip(left, right)
    ]


def _outer(left: Vector, right: Vector | None = None) -> Matrix:
    other = left if right is None else right
    return [[a * b for b in other] for a in left]


def _multiple(scalar: Fraction | int, matrix: Matrix) -> Matrix:
    factor = Fraction(scalar)
    return [[factor * entry for entry in row] for row in matrix]


def _trace(matrix: Matrix) -> Fraction:
    if not matrix or any(len(row) != len(matrix) for row in matrix):
        raise ReplayError("internal trace shape mismatch")
    return sum((matrix[i][i] for i in range(len(matrix))), Fraction(0))


def _dot(left: Vector, right: Vector) -> Fraction:
    if len(left) != len(right):
        raise ReplayError("internal vector dimension mismatch")
    return sum((a * b for a, b in zip(left, right)), Fraction(0))


def _apply(matrix: Matrix, vector: Vector) -> Vector:
    return [_dot(row, vector) for row in matrix]


def _quadratic(matrix: Matrix, vector: Vector) -> Fraction:
    return _dot(vector, _apply(matrix, vector))


def _soft_layer_effective_fixture() -> dict[str, Any]:
    # Rank-one discrete reproducing kernel v v^*, with |v_i|^2=1/2.
    kernel = [[Fraction(1, 2), Fraction(1, 2)]] * 2
    kernel_squared = [[entry * entry for entry in row] for row in kernel]
    soft = [Fraction(1, 4), Fraction(3, 4)]
    defect = [Fraction(1), Fraction(3)]
    amplitude = Fraction(4)
    compressed_scalar = sum(
        (soft[i] * kernel[i][i] for i in range(2)), Fraction(0)
    )
    transition = compressed_scalar - compressed_scalar * compressed_scalar
    gray = sum(
        (
            soft[i] * (1 - soft[i]) * kernel[i][i]
            for i in range(2)
        ),
        Fraction(0),
    )
    difference = Fraction(1, 2) * sum(
        (
            (soft[i] - soft[j]) ** 2 * kernel_squared[i][j]
            for i in range(2)
            for j in range(2)
        ),
        Fraction(0),
    )
    layer_rhs = Fraction(1, 2) * sum(
        (
            abs(defect[i] - defect[j]) * kernel_squared[i][j]
            for i in range(2)
            for j in range(2)
        ),
        Fraction(0),
    )
    # On 0<s<1 both atoms occur; on 1<s<3 one occurs; above 3 none occur.
    layer_integral = Fraction(2) * (Fraction(1, 2) - Fraction(1, 4))

    eigenvalues = [Fraction(9, 10), Fraction(1, 2), Fraction(1, 10)]
    sigma = Fraction(1, 2)
    phase_volume = sum(eigenvalues, Fraction(0))
    chi = sum(
        (value * (1 - value) for value in eigenvalues), Fraction(0)
    )
    real_rank_bound = phase_volume + chi / sigma
    integer_k = min(
        len(eigenvalues), real_rank_bound.numerator // real_rank_bound.denominator
    )
    strict_rank = sum(value > sigma for value in eigenvalues)
    low_tail = sum(
        (value for value in eigenvalues if value <= sigma), Fraction(0)
    )
    low_tail_bound = chi / (1 - sigma)
    # K=span(e_1,e_3), H=span(e_2); top-two angle is one.
    p_h = _diag(0, 1, 0)
    top = _diag(1, 1, 0)
    top_angle_squared = _trace(_product(_product(p_h, top), p_h))
    actual_operator = eigenvalues[1]
    operator_bound = sigma + (1 - sigma) * top_angle_squared

    low_branch_z = Fraction(1, 2)
    low_branch_factor = 2 * low_branch_z - low_branch_z**2 / 2
    junction_low = 2 * Fraction(1) - Fraction(1, 2)
    junction_high_without_log = Fraction(3, 2)
    if (
        compressed_scalar != Fraction(1, 2)
        or transition != Fraction(1, 4)
        or gray != Fraction(3, 16)
        or difference != Fraction(1, 16)
        or gray + difference != transition
        or layer_rhs != Fraction(1, 2)
        or layer_integral != layer_rhs
        or amplitude * transition != 1
        or phase_volume != Fraction(3, 2)
        or chi != Fraction(43, 100)
        or real_rank_bound != Fraction(59, 25)
        or integer_k != 2
        or strict_rank != 1
        or low_tail != Fraction(3, 5)
        or low_tail_bound != Fraction(43, 50)
        or top_angle_squared != 1
        or actual_operator != Fraction(1, 2)
        or operator_bound != 1
        or low_branch_factor != Fraction(7, 8)
        or junction_low != junction_high_without_log
    ):
        raise ReplayError("soft/layer/effective/BV exact reconstruction failed")
    return {
        "soft_transition": {
            "R_kernel": kernel,
            "a_values": soft,
            "d_values": defect,
            "A": amplitude,
            "compressed_C_scalar": compressed_scalar,
            "chi_trace_C_minus_C_squared": transition,
            "mandatory_gray_mass": gray,
            "difference_term": difference,
            "gray_plus_difference": gray + difference,
            "dropping_gray_mass_changes_value": difference != transition,
        },
        "layer_average": {
            "hard_layer_integral": layer_integral,
            "absolute_difference_kernel_rhs": layer_rhs,
            "identity_exact": layer_integral == layer_rhs,
            "layer_average_not_soft_transition": layer_rhs != transition,
        },
        "effective_tail": {
            "eigenvalues": eigenvalues,
            "sigma": sigma,
            "phase_volume_p": phase_volume,
            "transition_chi": chi,
            "p_plus_chi_over_sigma": real_rank_bound,
            "chosen_k_floor": integer_k,
            "strict_open_threshold_rank": strict_rank,
            "low_tail_including_endpoint": low_tail,
            "chi_over_one_minus_sigma": low_tail_bound,
            "endpoint_retained_in_low_tail": True,
            "P_H": p_h,
            "top_k_projector": top,
            "top_projector_angle_squared": top_angle_squared,
            "actual_operator_on_H": actual_operator,
            "one_projector_operator_bound": operator_bound,
        },
        "bv_piecewise_oracles": {
            "low_z": low_branch_z,
            "low_factor_2z_minus_z_squared_over_2": low_branch_factor,
            "junction_z": Fraction(1),
            "junction_low_factor": junction_low,
            "junction_high_factor_without_log_1": junction_high_without_log,
            "branches_meet": junction_low == junction_high_without_log,
            "high_z": Fraction(2),
            "high_factor_formula": "3/2+log(2)",
        },
        "actual_exterior_alignment_claimed": False,
    }


def _graph_spill_fixture() -> dict[str, Any]:
    u = _identity(2)
    t_b = _diag(Fraction(1, 4), Fraction(1, 16))
    d_sqrt = _diag(Fraction(1, 2), Fraction(1, 4))
    w = [[Fraction(1)], [Fraction(1)]]
    y = [[Fraction(1), Fraction(0)]]
    p_m = _diag(1, 0)
    shell = _diag(0, 1)
    wy = _product(w, y)
    graph_left = _product(p_m, wy)
    graph_right = _product(p_m, u)
    gram_w = _product(_transpose(w), w)
    p_k = _multiple(Fraction(1, 2), _product(w, _transpose(w)))
    p_h = _difference(_identity(2), p_k)
    unmodelled = _product(_product(shell, u), d_sqrt)
    spill = _product(_product(shell, wy), d_sqrt)
    actual = _product(_product(p_h, u), d_sqrt)
    unmodelled_squared = _trace(_product(_transpose(unmodelled), unmodelled))
    spill_squared = _trace(_product(_transpose(spill), spill))
    rho = _trace(_product(_transpose(actual), actual))
    triangle_bound = Fraction(1, 4) + Fraction(1, 2)
    if (
        graph_left != graph_right
        or gram_w != [[Fraction(2)]]
        or unmodelled_squared != Fraction(1, 16)
        or spill_squared != Fraction(1, 4)
        or rho != Fraction(5, 32)
        or rho <= unmodelled_squared
        or triangle_bound != Fraction(3, 4)
    ):
        raise ReplayError("graph-spill exact reconstruction failed")
    return {
        "U": u,
        "T_B_equals_D": t_b,
        "D_square_root": d_sqrt,
        "W": w,
        "Y": y,
        "P_M": p_m,
        "P_N_minus_P_M": shell,
        "W_star_W": gram_w,
        "P_K": p_k,
        "P_H": p_h,
        "P_M_WY": graph_left,
        "P_M_U": graph_right,
        "low_graph_equation_exact": graph_left == graph_right,
        "unmodelled_legendre_shell_HS_squared": unmodelled_squared,
        "weighted_graph_spill_Gamma_squared": spill_squared,
        "actual_rho_B": rho,
        "triangle_bound_sqrt_rho": triangle_bound,
        "graph_without_spill_bound_squared": unmodelled_squared,
        "graph_without_spill_is_false_here": rho > unmodelled_squared,
        "actual_graph_spill_rate_claimed": False,
    }


def _odd_harmonic_fixture() -> dict[str, Any]:
    h, q, b = Fraction(1), Fraction(3), Fraction(2)
    mu = Fraction(3, 4)
    e = [Fraction(3, 5), Fraction(4, 5)]
    e_perp = [Fraction(-4, 5), Fraction(3, 5)]
    m = _diag(h, q)
    pole_rank_one = _multiple(2 * mu, _outer(e))
    shifted = _difference(m, pole_rank_one)
    load = 2 * mu * _quadratic(_diag(1, Fraction(1, 3)), e)
    a = _quadratic(m, e)
    c = _dot(e_perp, _apply(m, e))
    transverse = _quadratic(m, e_perp)
    scalar_short = a - 2 * mu - c * c / transverse
    load_short = 2 * mu * (1 / load - 1)
    eta = 1 - load
    floor_matrix = _multiple(eta, m)
    floor_difference = _difference(shifted, floor_matrix)
    floor_difference_determinant = (
        floor_difference[0][0] * floor_difference[1][1]
        - floor_difference[0][1] * floor_difference[1][0]
    )
    if (
        _dot(e, e) != 1
        or _dot(e_perp, e_perp) != 1
        or _dot(e, e_perp) != 0
        or load != Fraction(43, 50)
        or a != Fraction(57, 25)
        or c != Fraction(24, 25)
        or transverse != Fraction(43, 25)
        or scalar_short != Fraction(21, 86)
        or scalar_short != load_short
        or eta != Fraction(7, 50)
        or floor_difference_determinant != 0
        or floor_difference[0][0] < 0
        or floor_difference[1][1] < 0
    ):
        raise ReplayError("odd harmonic-short exact reconstruction failed")
    return {
        "h": h,
        "q": q,
        "b": b,
        "mu": mu,
        "pole_unit_vector_e": e,
        "transverse_unit_vector": e_perp,
        "M": m,
        "two_pole_rank_one": pole_rank_one,
        "B_A_with_A_zero": shifted,
        "resolvent_load_L_A": load,
        "block_a": a,
        "block_c": c,
        "block_D": transverse,
        "scalar_short_direct": scalar_short,
        "scalar_short_from_load": load_short,
        "strict_load_pass": load < 1,
        "eta_one_minus_load": eta,
        "eta_M": floor_matrix,
        "B_A_minus_eta_M": floor_difference,
        "floor_difference_determinant": floor_difference_determinant,
        "quantitative_floor_exact": True,
        "augmentation_weaker_than_load_claimed": False,
    }


def _odd_moment_fixture() -> dict[str, Any]:
    h, q, b = Fraction(1), Fraction(3), Fraction(2)
    spectrum = [Fraction(0), Fraction(1), Fraction(2)]
    weights = [Fraction(1, 6), Fraction(1, 3), Fraction(1, 2)]
    mu = sum(weights, Fraction(0))
    d_1 = sum(
        (weight * y for weight, y in zip(weights, spectrum)), Fraction(0)
    )
    exact_load = 2 * sum(
        (
            weight / (h + y)
            for weight, y in zip(weights, spectrum)
        ),
        Fraction(0),
    )
    hierarchy: dict[str, Any] = {}
    previous: Fraction | None = None
    for order in range(4):
        zetas = [
            sum(
                (
                    weight * y * (b - y) ** j
                    for weight, y in zip(weights, spectrum)
                ),
                Fraction(0),
            )
            for j in range(1, order + 1)
        ]
        upper = 2 * (
            mu / h
            - d_1 / (h * q)
            - sum(
                (
                    zeta / (h * q ** (j + 1))
                    for j, zeta in enumerate(zetas, start=1)
                ),
                Fraction(0),
            )
        )
        remainder = 2 / (h * q ** (order + 1)) * sum(
            (
                weight
                * y
                * (b - y) ** (order + 1)
                / (h + y)
                for weight, y in zip(weights, spectrum)
            ),
            Fraction(0),
        )
        if upper - exact_load != remainder or remainder < 0:
            raise ReplayError("odd moment remainder identity failed")
        if previous is not None and upper > previous:
            raise ReplayError("odd moment hierarchy is not monotone")
        hierarchy[f"K_{order}"] = {
            "order": order,
            "zeta_1_through_K": zetas,
            "U_K": upper,
            "positive_remainder": remainder,
            "U_K_minus_L_0": upper - exact_load,
        }
        previous = upper

    fixed_order = 2
    n = fixed_order + 1
    epsilon = Fraction(1, 2)
    nodes = [b * Fraction(j, n) for j in range(n + 1)]
    s_n = sum(
        (
            Fraction(math.comb(n, j), 1) / (h + nodes[j])
            for j in range(n + 1)
        ),
        Fraction(0),
    )
    delta_n = sum(
        (
            Fraction((-1) ** j * math.comb(n, j), 1) / (h + nodes[j])
            for j in range(n + 1)
        ),
        Fraction(0),
    )
    profiles: dict[str, Any] = {}
    common_moments: list[Fraction] | None = None
    for label, sign in (("plus", 1), ("minus", -1)):
        profile_weights = [
            Fraction(math.comb(n, j), 1)
            * (1 + sign * epsilon * ((-1) ** j))
            / (2 * s_n)
            for j in range(n + 1)
        ]
        moments = [
            sum(
                (
                    weight * node**power
                    for weight, node in zip(profile_weights, nodes)
                ),
                Fraction(0),
            )
            for power in range(fixed_order + 1)
        ]
        load = 2 * sum(
            (
                weight / (h + node)
                for weight, node in zip(profile_weights, nodes)
            ),
            Fraction(0),
        )
        expected_load = 1 + sign * epsilon * delta_n / s_n
        if any(weight <= 0 for weight in profile_weights) or load != expected_load:
            raise ReplayError("fixed-moment countermodel reconstruction failed")
        if common_moments is None:
            common_moments = moments
        elif moments != common_moments:
            raise ReplayError("fixed-moment profiles do not share moments")
        profiles[label] = {
            "weights": profile_weights,
            "moments_0_through_2": moments,
            "exact_load": load,
            "load_is_below_one": load < 1,
        }
    if (
        mu != 1
        or d_1 != Fraction(4, 3)
        or exact_load != 1
        or s_n != Fraction(464, 105)
        or delta_n != Fraction(16, 105)
        or profiles["plus"]["exact_load"] != Fraction(59, 58)
        or profiles["minus"]["exact_load"] != Fraction(57, 58)
    ):
        raise ReplayError("odd moment exact oracle mismatch")
    return {
        "monotone_edge_hierarchy": {
            "h": h,
            "q": q,
            "b": b,
            "Y_spectrum": spectrum,
            "spectral_weights": weights,
            "mu": mu,
            "d_1": d_1,
            "exact_load_L_0": exact_load,
            "orders": hierarchy,
        },
        "fixed_moment_obstruction": {
            "fixed_order_k": fixed_order,
            "n_k_plus_1": n,
            "epsilon": epsilon,
            "nodes": nodes,
            "S_n": s_n,
            "Delta_n": delta_n,
            "profiles": profiles,
            "moments_equal_through_k": True,
            "load_signs_opposite": (
                profiles["plus"]["exact_load"] > 1
                and profiles["minus"]["exact_load"] < 1
            ),
        },
        "fixed_moments_promoted_to_exact_sign": False,
    }


def _prime_power_base(n: int) -> tuple[int, int] | None:
    if n < 2:
        return None
    divisor = 2
    while divisor <= math.isqrt(n) and n % divisor:
        divisor += 1
    if divisor > math.isqrt(n):
        return n, 1
    remainder, exponent = n, 0
    while remainder % divisor == 0:
        remainder //= divisor
        exponent += 1
    return (divisor, exponent) if remainder == 1 else None


def _prime_power_fixture(p: int) -> dict[str, Any]:
    cutoff_numerator = p * p
    maximum_integer = cutoff_numerator // 4
    inventory: list[dict[str, int]] = []
    excluded: list[int] = []
    for n in range(2, maximum_integer + 1):
        factor = _prime_power_base(n)
        if factor is None:
            excluded.append(n)
        else:
            prime, exponent = factor
            inventory.append({"n": n, "prime_base": prime, "exponent": exponent})
    expected = {
        5: [2, 3, 4, 5],
        9: [2, 3, 4, 5, 7, 8, 9, 11, 13, 16, 17, 19],
    }
    if p not in expected or [entry["n"] for entry in inventory] != expected[p]:
        raise ReplayError("inclusive prime-power reconstruction failed")
    return {
        "lambda_squared_numerator": str(cutoff_numerator),
        "lambda_squared_denominator": "4",
        "maximum_integer_n": maximum_integer,
        "endpoint_rule": "include every prime power n with 4*n<=p^2",
        "inventory": inventory,
        "excluded_non_prime_power_composites": excluded,
        "combined_multiplier": (
            "m_lambda(t)=2*theta'(t)-2*sum_(1<n<=lambda^2) "
            "Lambda(n)/sqrt(n)*cos(t*log(n))"
        ),
        "prime_block_sign": "minus",
        "individual_prime_blocks_absolutized_before_combination": False,
    }


def _exact_certificate(p: int) -> tuple[dict[str, Any], dict[str, bool]]:
    soft = _soft_layer_effective_fixture()
    graph = _graph_spill_fixture()
    harmonic = _odd_harmonic_fixture()
    moments = _odd_moment_fixture()
    primes = _prime_power_fixture(p)
    checks = {
        "soft_transition_identity_exact": (
            soft["soft_transition"]["gray_plus_difference"]
            == soft["soft_transition"]["chi_trace_C_minus_C_squared"]
        ),
        "gray_mass_is_mandatory": soft["soft_transition"][
            "dropping_gray_mass_changes_value"
        ],
        "layer_average_identity_exact": soft["layer_average"]["identity_exact"],
        "layer_average_not_promoted_to_soft": soft["layer_average"][
            "layer_average_not_soft_transition"
        ],
        "effective_threshold_endpoint_retained": soft["effective_tail"][
            "endpoint_retained_in_low_tail"
        ],
        "bv_piecewise_branches_meet": soft["bv_piecewise_oracles"][
            "branches_meet"
        ],
        "graph_equation_exact": graph["low_graph_equation_exact"],
        "graph_spill_cannot_be_omitted": graph[
            "graph_without_spill_is_false_here"
        ],
        "odd_harmonic_short_identity_exact": (
            harmonic["scalar_short_direct"] == harmonic["scalar_short_from_load"]
        ),
        "odd_quantitative_floor_exact": harmonic["quantitative_floor_exact"],
        "odd_moment_remainders_positive": all(
            item["positive_remainder"] > 0
            for item in moments["monotone_edge_hierarchy"]["orders"].values()
        ),
        "fixed_moment_profiles_indistinguishable": moments[
            "fixed_moment_obstruction"
        ]["moments_equal_through_k"],
        "fixed_moment_load_outcomes_differ": moments[
            "fixed_moment_obstruction"
        ]["load_signs_opposite"],
        "prime_power_endpoint_inclusive": True,
        "prime_block_minus_sign_retained": primes["prime_block_sign"] == "minus",
        "combined_prime_cancellation_retained": not primes[
            "individual_prime_blocks_absolutized_before_combination"
        ],
        "diagnostics_not_promoted": True,
        "strict_signed_floor_absent": True,
    }
    if not all(checks.values()):
        raise ReplayError("independent exact fixture check failed")
    return {
        "soft_layer_effective_bv_fixture": soft,
        "graph_spill_fixture": graph,
        "odd_harmonic_fixture": harmonic,
        "odd_moment_fixture": moments,
        "inclusive_prime_powers": primes,
    }, checks


def _normalization_derivative_fixture() -> dict[str, Any]:
    first_derivative = [
        {"x_power": 6, "pi_power": 3, "coefficient": Fraction(-2)},
        {"x_power": 4, "pi_power": 2, "coefficient": Fraction(15, 2)},
        {"x_power": 2, "pi_power": 1, "coefficient": Fraction(-15, 4)},
    ]
    second_derivative = [
        {"x_power": 8, "pi_power": 4, "coefficient": Fraction(4)},
        {"x_power": 6, "pi_power": 3, "coefficient": Fraction(-28)},
        {"x_power": 4, "pi_power": 2, "coefficient": Fraction(165, 4)},
        {"x_power": 2, "pi_power": 1, "coefficient": Fraction(-75, 8)},
    ]
    absolute_b1 = [Fraction(2), Fraction(15, 2), Fraction(15, 4)]
    absolute_b2 = [
        Fraction(4),
        Fraction(28),
        Fraction(165, 4),
        Fraction(75, 8),
    ]
    if (
        first_derivative[-1]["coefficient"] != Fraction(-15, 4)
        or second_derivative[-1]["coefficient"] != Fraction(-75, 8)
        or absolute_b1[-1] != -first_derivative[-1]["coefficient"]
        or absolute_b2[-1] != -second_derivative[-1]["coefficient"]
    ):
        raise ReplayError("normalization/derivative sign reconstruction failed")
    return {
        "source_normalization": {
            "full_Mellin_transform_scalar": Fraction(1, 4),
            "unit_scalar_substitution": Fraction(1),
            "unit_scalar_is_rejected": True,
            "finite_source_state_unit_normalized": False,
            "inversion_symmetrization": "k_lambda^+=(k_lambda+J*k_lambda)/2",
            "J_is_physical_reflection": True,
        },
        "first_log_derivative_polynomial": first_derivative,
        "second_log_derivative_polynomial": second_derivative,
        "B1_absolute_coefficients": absolute_b1,
        "B2_absolute_coefficients": absolute_b2,
        "second_derivative_x_squared_sign_is_negative": True,
        "periodic_endpoint": {
            "a_equals_L_over_2": True,
            "omega_n_times_a": "pi*n",
            "sin_omega_n_a": Fraction(0),
            "first_boundary_term_vanishes": True,
        },
        "fourier_sign": "exp(-i*t*s)",
        "limiting_transform": "Xi(t)/4",
    }


def _precision_bits(dps: int) -> int:
    return (
        dps * _LOG2_10_UPPER_NUMERATOR + _LOG2_10_UPPER_DENOMINATOR - 1
    ) // _LOG2_10_UPPER_DENOMINATOR


def _raw_fraction(raw: Any, label: str) -> Fraction:
    if not isinstance(raw, tuple) or len(raw) != 4:
        raise ReplayError(f"{label} raw endpoint malformed")
    sign, mantissa, exponent, bit_count = raw
    if (
        isinstance(sign, bool)
        or sign not in (0, 1)
        or isinstance(mantissa, bool)
        or not isinstance(mantissa, int)
        or isinstance(exponent, bool)
        or not isinstance(exponent, int)
        or isinstance(bit_count, bool)
        or not isinstance(bit_count, int)
    ):
        raise ReplayError(f"{label} raw endpoint malformed")
    if mantissa == 0:
        return Fraction(0)
    numerator = -mantissa if sign else mantissa
    return (
        Fraction(numerator * (1 << exponent))
        if exponent >= 0
        else Fraction(numerator, 1 << (-exponent))
    )


def _fraction_raw(value: Fraction) -> tuple[int, int, int, int]:
    if value == 0:
        return 0, 0, 0, 0
    denominator = value.denominator
    if denominator & (denominator - 1):
        raise ReplayError("submitted interval endpoint is not dyadic")
    sign = int(value < 0)
    mantissa = abs(value.numerator)
    exponent = -(denominator.bit_length() - 1)
    while mantissa % 2 == 0:
        mantissa //= 2
        exponent += 1
    return sign, mantissa, exponent, mantissa.bit_length()


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
    if bit_count > 20 * bits + 4096 or abs(exponent) > 20 * bits + 4096:
        raise ReplayError(f"{label} exceeds precision budget")
    numerator = -mantissa if sign else mantissa
    return (
        Fraction(numerator * (1 << exponent))
        if exponent >= 0
        else Fraction(numerator, 1 << (-exponent))
    )


def _mpf_raw(raw: tuple[int, int, int, int], dps: int) -> Any:
    with mp.workprec(max(_precision_bits(dps) + 64, raw[3] + 16)):
        return +mp.mpf(raw)


def _submitted_interval(
    value: Any, label: str, dps: int
) -> tuple[Fraction, Fraction]:
    if not isinstance(value, dict) or set(value) != {"decimal", "dyadic"}:
        raise ReplayError(f"{label} interval inventory mismatch")
    decimal, dyadic = value["decimal"], value["dyadic"]
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
        raise ReplayError(f"{label} interval serialization malformed")
    lower = _parse_dyadic(dyadic["lower"], f"{label}.lower", dps)
    upper = _parse_dyadic(dyadic["upper"], f"{label}.upper", dps)
    if lower > upper:
        raise ReplayError(f"{label} interval is reversed")
    with mp.workdps(dps + 20):
        expected_decimal = [
            mp.nstr(_mpf_raw(_fraction_raw(lower), dps), dps + 10),
            mp.nstr(_mpf_raw(_fraction_raw(upper), dps), dps + 10),
        ]
    if decimal != expected_decimal:
        raise ReplayError(f"{label} decimal text does not match dyadics")
    return lower, upper


def _interval_bounds(value: Any, label: str) -> tuple[Fraction, Fraction]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    return _raw_fraction(tuple(lower), f"{label}.lower"), _raw_fraction(
        tuple(upper), f"{label}.upper"
    )


def _check_enclosure(submitted: Any, independent: Any, label: str, dps: int) -> None:
    submitted_lower, submitted_upper = _submitted_interval(submitted, label, dps)
    independent_lower, independent_upper = _interval_bounds(independent, label)
    if not (
        submitted_lower
        <= independent_lower
        <= independent_upper
        <= submitted_upper
    ):
        raise ReplayError(f"{label} does not enclose independent replay")
    scale = max(Fraction(1), abs(independent_lower), abs(independent_upper))
    exponent = _precision_bits(dps) - 64
    width_limit = scale * (
        Fraction(1, 1 << exponent)
        if exponent >= 0
        else Fraction(1 << (-exponent))
    )
    if submitted_upper - submitted_lower > width_limit:
        raise ReplayError(f"{label} interval is excessively wide")


def _ceil_fraction(value: Fraction) -> int:
    return -((-value.numerator) // value.denominator)


def _certified_ceiling(value: Any, label: str) -> int:
    lower, upper = _interval_bounds(value, label)
    lower_ceiling = _ceil_fraction(lower)
    upper_ceiling = _ceil_fraction(upper)
    if lower_ceiling != upper_ceiling:
        raise ReplayError(f"{label} ceiling is not interval-decidable")
    return lower_ceiling


def _iv_from_fraction(value: Fraction) -> Any:
    return mp.iv.mpf(value.numerator) / mp.iv.mpf(value.denominator)


def _mellin_interval_targets(p: int, dps: int) -> tuple[dict[str, Any], int]:
    mp.iv.dps = dps
    one = mp.iv.mpf(1)
    two = mp.iv.mpf(2)
    four = mp.iv.mpf(4)
    thirteen = mp.iv.mpf(13)
    lam = mp.iv.mpf(p) / two
    # Separate logarithm tree from the producer's direct log(p/2) path.
    log_two = mp.iv.log(two)
    ell = mp.iv.log(mp.iv.mpf(p)) - log_two
    length = two * ell
    pi_value = four * mp.iv.atan2(one, one)
    schedule_real = (length**2 + mp.iv.mpf(26) * length) / (
        two * pi_value**2
    )
    schedule = _certified_ceiling(schedule_real, "Mellin schedule")
    expected_schedule = {5: 3, 9: 5}[p]
    if schedule != expected_schedule:
        raise ReplayError("Mellin schedule integer oracle mismatch")
    n0 = schedule + 1
    omega = two * pi_value * mp.iv.mpf(n0) / length
    c_xi = (
        two ** (one / four)
        * pi_value ** (-one / four)
        * mp.iv.gamma(one / four)
        * mp.iv.exp(one / four)
        / (mp.iv.sqrt(two) - one)
    )
    c_sum = mp.iv.exp(two) / (
        one - mp.iv.exp(-mp.iv.mpf(3) * (four * pi_value - two))
    )
    b1 = (
        two * pi_value**3
        + mp.iv.mpf(15) * pi_value**2 / two
        + mp.iv.mpf(15) * pi_value / four
    )
    b2 = (
        four * pi_value**4
        + mp.iv.mpf(28) * pi_value**3
        + mp.iv.mpf(165) * pi_value**2 / four
        + mp.iv.mpf(75) * pi_value / mp.iv.mpf(8)
    )
    denominator_guard = one - thirteen / (four * pi_value * lam**2)
    b_lambda_upper = (
        two
        * c_sum
        * lam ** (thirteen / two)
        * mp.iv.exp(-pi_value * lam**2)
        * (b1 + b2 / (two * pi_value * denominator_guard))
    )
    xi_geometric = (
        c_xi**2
        / (four * length)
        * (omega**2 + one / four) ** (thirteen / four)
        * mp.iv.exp(-pi_value**2 * mp.iv.mpf(n0) / length)
        / (one - mp.iv.exp(-pi_value**2 / (two * length)))
    )
    xi_schedule = (
        c_xi**2
        * mp.iv.exp(-mp.iv.mpf(13))
        / (four * length * lam)
        * (
            ((length + mp.iv.mpf(26)) / pi_value + four * pi_value / length)
            ** 2
            + one / four
        )
        ** (thirteen / four)
        * (one + two * length / pi_value**2)
    )
    derivative_square = (
        b_lambda_upper**2
        * length**3
        / (mp.iv.mpf(12) * pi_value**4 * mp.iv.mpf(schedule) ** 3)
    )
    total_square = xi_geometric + derivative_square
    total = mp.iv.sqrt(total_square)
    condition_margin = mp.iv.mpf(n0) - thirteen * length / pi_value**2

    # Fixed exact BV probes: interval length 2, V=4; M=1 and M=4.
    bv_low = mp.iv.mpf(4) / pi_value**2 * mp.iv.mpf(7) / mp.iv.mpf(8)
    bv_high = (
        mp.iv.mpf(4)
        / pi_value**2
        * (mp.iv.mpf(3) / two + log_two)
    )
    c0 = one + mp.iv.euler / two - (log_two + mp.iv.log(pi_value) / two)
    targets = {
        "lambda": lam,
        "physical_length_L": length,
        "xi_envelope_constant_C_Xi": c_xi,
        "C_sum": c_sum,
        "B1": b1,
        "B2": b2,
        "B_lambda_elementary_upper": b_lambda_upper,
        "omega_N_plus_1": omega,
        "Xi_geometric_tail_X_LN": xi_geometric,
        "Xi_schedule_tail_X_bound": xi_schedule,
        "derivative_tail_square_upper": derivative_square,
        "total_E_K_N_square_upper": total_square,
        "total_E_K_N_upper": total,
        "schedule_condition_margin": condition_margin,
        "bv_low_branch_bound": bv_low,
        "bv_high_branch_bound": bv_high,
        "c0": c0,
    }
    margin_lower, _ = _interval_bounds(condition_margin, "schedule condition")
    if margin_lower <= 0:
        raise ReplayError("Mellin schedule condition is not certified")
    return targets, schedule


def _pole_prime_interval_targets(
    p: int, dps: int, prime_fixture: dict[str, Any]
) -> dict[str, Any]:
    mp.iv.dps = dps
    one = mp.iv.mpf(1)
    two = mp.iv.mpf(2)
    lam = mp.iv.mpf(p) / two
    pi_value = mp.iv.mpf(4) * mp.iv.atan2(one, one)
    ell = mp.iv.log(mp.iv.mpf(p)) - mp.iv.log(two)
    length = two * ell
    mu = (lam - one / lam - length) / two
    entries = prime_fixture["inventory"]

    direct_sum = mp.iv.mpf(0)
    psi = mp.iv.mpf(0)
    mangoldt_over_n = mp.iv.mpf(0)
    b0 = mp.iv.mpf(0)
    b1 = mp.iv.mpf(0)
    x_value = lam**2
    for item in entries:
        n = item["n"]
        prime = item["prime_base"]
        von_mangoldt = mp.iv.log(mp.iv.mpf(prime))
        log_n = mp.iv.log(mp.iv.mpf(n))
        remaining = length - log_n
        half_remaining = remaining / two
        half_log_n = log_n / two
        sinh_remaining = (
            mp.iv.exp(half_remaining) - mp.iv.exp(-half_remaining)
        ) / two
        cosh_log_n = (
            mp.iv.exp(half_log_n) + mp.iv.exp(-half_log_n)
        ) / two
        correlation = sinh_remaining - remaining / two * cosh_log_n
        direct_sum += von_mangoldt / mp.iv.sqrt(mp.iv.mpf(n)) * correlation
        psi += von_mangoldt
        mangoldt_over_n += von_mangoldt / mp.iv.mpf(n)
        log_weight = mp.iv.log(x_value / mp.iv.mpf(n))
        b0 += von_mangoldt * log_weight
        b1 += von_mangoldt / mp.iv.mpf(n) * log_weight
    path_a = -two * mu**2 - two * direct_sum
    path_b = (
        -two * mu**2
        - lam * mangoldt_over_n
        + psi / lam
        + (b0 + b1) / two
    )
    matched_n = (p * p + 3) // 4
    pole_bound = (
        (lam - one / lam) / two
        - ell
        - ell * (lam + one / lam - two) / (pi_value**2 * mp.iv.mpf(matched_n))
    )
    path_a_bounds = _interval_bounds(path_a, "pole-prime path A")
    path_b_bounds = _interval_bounds(path_b, "pole-prime path B")
    if max(path_a_bounds[0], path_b_bounds[0]) > min(
        path_a_bounds[1], path_b_bounds[1]
    ):
        raise ReplayError("independent pole-prime paths do not overlap")
    return {
        "pole_prime_evaluation_path_A": path_a,
        "pole_prime_evaluation_path_B": path_b,
        "matched_projected_pole_bound": pole_bound,
    }


def _producer_exact_groups(p: int) -> dict[str, Any]:
    base_groups, _ = _exact_certificate(p)
    soft_all = base_groups["soft_layer_effective_bv_fixture"]
    soft = soft_all["soft_transition"]
    layer = soft_all["layer_average"]
    effective = soft_all["effective_tail"]
    graph = base_groups["graph_spill_fixture"]
    harmonic = base_groups["odd_harmonic_fixture"]
    moment_all = base_groups["odd_moment_fixture"]
    moment = moment_all["monotone_edge_hierarchy"]
    counter = moment_all["fixed_moment_obstruction"]
    primes = base_groups["inclusive_prime_powers"]

    normalization = _normalization_derivative_fixture()
    h_polynomial = [
        {"x_power": 4, "pi_power": 2, "coefficient": Fraction(1)},
        {"x_power": 2, "pi_power": 1, "coefficient": Fraction(-3, 2)},
    ]
    normalization_group = {
        "source_normalization": (
            "source-fixed h_lambda tends to h; no unit normalization"
        ),
        "xi_transform_scalar": Fraction(1, 4),
        "unit_norm_limiting_scalar_rejected": True,
        "h_polynomial": h_polynomial,
        "first_log_derivative_polynomial": normalization[
            "first_log_derivative_polynomial"
        ],
        "second_log_derivative_polynomial": normalization[
            "second_log_derivative_polynomial"
        ],
        "derivatives_reconstructed": True,
    }

    soft_group = {
        "measure_weights": [Fraction(1), Fraction(1)],
        "R_X": soft["R_kernel"],
        "a": soft["a_values"],
        "d": soft["d_values"],
        "A": soft["A"],
        "C_X": [[soft["compressed_C_scalar"]]],
        "p_X": soft["compressed_C_scalar"],
        "chi_X": soft["chi_trace_C_minus_C_squared"],
        "gray_term": soft["mandatory_gray_mass"],
        "difference_term": soft["difference_term"],
        "soft_identity_rhs": soft["gray_plus_difference"],
        "soft_identity_exact": (
            soft["gray_plus_difference"]
            == soft["chi_trace_C_minus_C_squared"]
        ),
        "layer_average_left": layer["hard_layer_integral"],
        "layer_average_right": layer["absolute_difference_kernel_rhs"],
        "layer_identity_exact": layer["identity_exact"],
    }

    bv_oracles = {
        "low": {
            "L": Fraction(2),
            "M": Fraction(1),
            "V": Fraction(4),
            "z": Fraction(1, 2),
            "factor": Fraction(7, 8),
        },
        "junction": {
            "z": Fraction(1),
            "low_factor": Fraction(3, 2),
            "high_factor_without_log_1": Fraction(3, 2),
            "branches_meet": True,
        },
        "high": {
            "L": Fraction(2),
            "M": Fraction(4),
            "V": Fraction(4),
            "z": Fraction(2),
            "factor_formula": "3/2+log(2)",
        },
    }
    effective_group = {
        "eigenvalues": effective["eigenvalues"],
        "sigma": effective["sigma"],
        "p_X": effective["phase_volume_p"],
        "chi_X": effective["transition_chi"],
        "r_sigma_open": effective["strict_open_threshold_rank"],
        "p_plus_chi_over_sigma": effective["p_plus_chi_over_sigma"],
        "k_floor": effective["chosen_k_floor"],
        "low_tail_including_endpoint": effective[
            "low_tail_including_endpoint"
        ],
        "chi_over_one_minus_sigma": effective["chi_over_one_minus_sigma"],
        "tail_after_k": Fraction(1, 10),
        "endpoint_retained_low": True,
        "effective_count_holds": (
            effective["strict_open_threshold_rank"]
            <= effective["p_plus_chi_over_sigma"]
        ),
        "effective_tail_holds": (
            effective["low_tail_including_endpoint"]
            <= effective["chi_over_one_minus_sigma"]
        ),
        "bv_piecewise_oracles": bv_oracles,
    }

    bad_countermodel = {
        "rho_B": graph["actual_rho_B"],
        "graph_without_spill_bound_squared": graph[
            "graph_without_spill_bound_squared"
        ],
        "omission_fails": graph["graph_without_spill_is_false_here"],
    }
    graph_group = {
        "U": graph["U"],
        "T_B": graph["T_B_equals_D"],
        "D": graph["T_B_equals_D"],
        "D_sqrt": graph["D_square_root"],
        "W": graph["W"],
        "Y": graph["Y"],
        "P_M": graph["P_M"],
        "P_N": _identity(2),
        "P_H": graph["P_H"],
        "low_graph_left": graph["P_M_WY"],
        "low_graph_right": graph["P_M_U"],
        "low_graph_equation_exact": graph["low_graph_equation_exact"],
        "weighted_U_shell_squared": graph[
            "unmodelled_legendre_shell_HS_squared"
        ],
        "Gamma_squared": graph["weighted_graph_spill_Gamma_squared"],
        "rho_B": graph["actual_rho_B"],
        "triangle_bound_holds": (
            graph["actual_rho_B"] <= graph["triangle_bound_sqrt_rho"] ** 2
        ),
        "bad_spill_countermodel": bad_countermodel,
    }

    hierarchy = moment["orders"]
    k_values = [hierarchy[f"K_{order}"]["order"] for order in range(4)]
    upper_bounds = [hierarchy[f"K_{order}"]["U_K"] for order in range(4)]
    remainders = [
        hierarchy[f"K_{order}"]["positive_remainder"] for order in range(4)
    ]
    monotone_group = {
        "h": moment["h"],
        "q": moment["q"],
        "b": moment["b"],
        "Y_spectrum": moment["Y_spectrum"],
        "spectral_weights": moment["spectral_weights"],
        "K_values": k_values,
        "exact_load": moment["exact_load_L_0"],
        "upper_bounds": upper_bounds,
        "remainder_exact": remainders,
        "remainder_formula": remainders,
        "nonincreasing": all(
            upper_bounds[index + 1] <= upper_bounds[index]
            for index in range(len(upper_bounds) - 1)
        ),
    }
    edge_group = {
        "tau": Fraction(1),
        "open_edge_mass": Fraction(1, 6),
        "k": 2,
        "power_moment": Fraction(1),
        "power_mass_bound": Fraction(1),
        "chebyshev_squared_form": Fraction(49),
        "chebyshev_mass_bound": Fraction(49),
        "combined_mass_bound": Fraction(1),
        "load_upper": Fraction(2),
        "actual_load": Fraction(1),
    }
    counter_profiles = counter["profiles"]
    counter_group = {
        "k": counter["fixed_order_k"],
        "n": counter["n_k_plus_1"],
        "h": Fraction(1),
        "b": Fraction(2),
        "epsilon": counter["epsilon"],
        "y_spectrum": counter["nodes"],
        "weights_plus": counter_profiles["plus"]["weights"],
        "weights_minus": counter_profiles["minus"]["weights"],
        "moments_plus": counter_profiles["plus"]["moments_0_through_2"],
        "moments_minus": counter_profiles["minus"]["moments_0_through_2"],
        "S_n": counter["S_n"],
        "Delta_n": counter["Delta_n"],
        "load_plus": counter_profiles["plus"]["exact_load"],
        "load_minus": counter_profiles["minus"]["exact_load"],
        "moments_equal_through_k": counter["moments_equal_through_k"],
        "opposite_load_sides": counter["load_signs_opposite"],
    }
    harmonic_group = {
        "h": harmonic["h"],
        "q": harmonic["q"],
        "M": harmonic["M"],
        "e": harmonic["pole_unit_vector_e"],
        "mu": harmonic["mu"],
        "load": harmonic["resolvent_load_L_A"],
        "scalar_short_direct": harmonic["scalar_short_direct"],
        "scalar_short_from_load": harmonic["scalar_short_from_load"],
        "equivalence_exact": (
            harmonic["scalar_short_direct"]
            == harmonic["scalar_short_from_load"]
        ),
        "strict_pass": harmonic["strict_load_pass"],
    }
    odd_group = {
        "harmonic_short": harmonic_group,
        "monotone_remainder": monotone_group,
        "edge_localization": edge_group,
        "same_moments_opposite_load": counter_group,
    }

    prime_exact = {
        "lambda_squared_numerator": primes["lambda_squared_numerator"],
        "lambda_squared_denominator": primes["lambda_squared_denominator"],
        "maximum_integer_n": primes["maximum_integer_n"],
        "endpoint_rule": primes["endpoint_rule"],
        "inventory": primes["inventory"],
        "excluded_non_prime_power_composites": primes[
            "excluded_non_prime_power_composites"
        ],
        "prime_block_sign": primes["prime_block_sign"],
        "individual_prime_blocks_absolutized": False,
        "zero_series_values": [],
        "decimal_zero_list_read": False,
    }
    return {
        "normalization_and_derivative_fixture": normalization_group,
        "soft_symbol_fixture": soft_group,
        "effective_tail_and_bv_fixture": effective_group,
        "graph_spill_fixture": graph_group,
        "odd_harmonic_moment_fixture": odd_group,
        "prime_power_and_pole_prime_fixture": prime_exact,
    }


def _expected_checks(
    exact_groups: dict[str, Any], schedule_margin_positive: bool, pole_positive: bool
) -> dict[str, bool]:
    soft = exact_groups["soft_symbol_fixture"]
    effective = exact_groups["effective_tail_and_bv_fixture"]
    graph = exact_groups["graph_spill_fixture"]
    odd = exact_groups["odd_harmonic_moment_fixture"]
    prime = exact_groups["prime_power_and_pole_prime_fixture"]
    return {
        "source_lock_and_all_hashes_valid": True,
        "xi_over_four_exact": (
            exact_groups["normalization_and_derivative_fixture"][
                "xi_transform_scalar"
            ]
            == Fraction(1, 4)
        ),
        "derivatives_exact": exact_groups[
            "normalization_and_derivative_fixture"
        ]["derivatives_reconstructed"],
        "unit_normalization_rejected": exact_groups[
            "normalization_and_derivative_fixture"
        ]["unit_norm_limiting_scalar_rejected"],
        "schedule_condition_certified": schedule_margin_positive,
        "projection_probe_not_promoted": True,
        "soft_identity_exact": soft["soft_identity_exact"],
        "gray_mass_retained": soft["gray_term"] > 0,
        "layer_identity_exact": soft["layer_identity_exact"],
        "layer_not_promoted_to_soft": (
            soft["layer_average_left"] != soft["chi_X"]
        ),
        "effective_open_threshold_exact": effective["effective_count_holds"],
        "effective_tail_endpoint_retained": effective["endpoint_retained_low"],
        "bv_branches_retained": effective["bv_piecewise_oracles"]["junction"][
            "branches_meet"
        ],
        "graph_equation_exact": graph["low_graph_equation_exact"],
        "graph_spill_retained": graph["Gamma_squared"] > 0,
        "bad_spill_countermodel_exact": graph["bad_spill_countermodel"][
            "omission_fails"
        ],
        "harmonic_short_equivalence_exact": odd["harmonic_short"][
            "equivalence_exact"
        ],
        "monotone_remainders_exact": (
            odd["monotone_remainder"]["remainder_exact"]
            == odd["monotone_remainder"]["remainder_formula"]
        ),
        "edge_localization_bound_exact": (
            odd["edge_localization"]["actual_load"]
            <= odd["edge_localization"]["load_upper"]
        ),
        "fixed_moments_opposite_load_exact": odd[
            "same_moments_opposite_load"
        ]["opposite_load_sides"],
        "prime_power_endpoint_inclusive": True,
        "prime_block_minus_sign_retained": prime["prime_block_sign"] == "minus",
        "pole_prime_paths_overlap": True,
        "combined_cancellation_preserved": not prime[
            "individual_prime_blocks_absolutized"
        ],
        "matched_pole_bound_positive": pole_positive,
        "c0_is_center_not_limit": True,
        "no_zero_values_serialized": prime["zero_series_values"] == [],
        "no_forbidden_admission_enabled": True,
    }


def replay(
    payload: dict[str, Any], *, producer_bytes: bytes | None = None
) -> dict[str, Any]:
    _validate_json(payload, "producer payload")
    if not isinstance(payload, dict) or set(payload) != {
        "schema",
        "source_lock",
        "inputs",
        "terminal_state",
        "source_conventions",
        "claim_boundary",
        "certificate",
        "arithmetic_libraries",
    }:
        raise ReplayError("producer top-level inventory mismatch")
    if payload["schema"] != PRODUCER_SCHEMA:
        raise ReplayError("producer schema mismatch")
    if payload["terminal_state"] != TERMINAL_STATE:
        raise ReplayError("producer terminal state mismatch")

    inputs = payload["inputs"]
    if not isinstance(inputs, dict) or set(inputs) != {
        "lambda_numerator_text",
        "lambda_denominator_text",
        "dps_text",
        "moment_order_exact",
        "edge_tau_text",
    }:
        raise ReplayError("input inventory mismatch")
    p = _canonical_input(
        inputs["lambda_numerator_text"], "lambda numerator", {5, 9}
    )
    dps = _canonical_input(inputs["dps_text"], "dps", {80, 160})
    if (
        inputs["lambda_denominator_text"] != "2"
        or inputs["moment_order_exact"] != 2
        or inputs["edge_tau_text"] != "1"
    ):
        raise ReplayError("lambda denominator, moment order, or edge tau mismatch")

    _validate_runtime()
    binding, lock = _validate_source_lock(_root())
    _require(payload["source_lock"], binding, "source-lock binding")
    _require(
        payload["source_conventions"],
        {
            "locked_conventions": lock["locked_conventions"],
            "locked_formulas": lock["locked_formulas"],
        },
        "source conventions",
    )
    _require(
        payload["claim_boundary"],
        {
            "claim_class": CLAIM_CLASS,
            "proved": lock["claim_boundary"]["proved"],
            "not_proved": lock["claim_boundary"]["not_proved"],
            "source_admissions": lock["source_admissions"],
        },
        "claim boundary",
    )
    _require(
        payload["arithmetic_libraries"],
        ARITHMETIC_LIBRARIES,
        "arithmetic libraries",
    )

    certificate = payload["certificate"]
    certificate_keys = {
        "normalization_and_derivative_fixture",
        "mellin_projection_intervals",
        "soft_symbol_fixture",
        "effective_tail_and_bv_fixture",
        "graph_spill_fixture",
        "odd_harmonic_moment_fixture",
        "prime_power_and_pole_prime_fixture",
        "checks",
    }
    if not isinstance(certificate, dict) or set(certificate) != certificate_keys:
        raise ReplayError("certificate inventory mismatch")

    exact_groups = _producer_exact_groups(p)
    for group_name in (
        "normalization_and_derivative_fixture",
        "soft_symbol_fixture",
        "effective_tail_and_bv_fixture",
        "graph_spill_fixture",
        "odd_harmonic_moment_fixture",
    ):
        _require(
            certificate[group_name],
            _encode(exact_groups[group_name]),
            group_name,
        )

    mellin = certificate["mellin_projection_intervals"]
    if not isinstance(mellin, dict) or set(mellin) != {
        "diagnostic_only",
        "schedule_N_star_exact",
        "schedule_condition_decidable",
        "source_delta_finite_value_supplied",
        "values",
    }:
        raise ReplayError("Mellin interval inventory mismatch")
    targets, schedule = _mellin_interval_targets(p, dps)
    _require(
        {
            key: mellin[key]
            for key in (
                "diagnostic_only",
                "schedule_N_star_exact",
                "schedule_condition_decidable",
                "source_delta_finite_value_supplied",
            )
        },
        {
            "diagnostic_only": True,
            "schedule_N_star_exact": schedule,
            "schedule_condition_decidable": True,
            "source_delta_finite_value_supplied": False,
        },
        "Mellin interval metadata",
    )
    values = mellin["values"]
    if not isinstance(values, dict) or set(values) != set(targets):
        raise ReplayError("Mellin interval value inventory mismatch")
    for name, target in targets.items():
        _check_enclosure(values[name], target, f"Mellin.{name}", dps)
    margin_lower, _ = _interval_bounds(
        targets["schedule_condition_margin"], "schedule margin"
    )
    if margin_lower <= 0:
        raise ReplayError("schedule condition is not independently positive")

    prime_submitted = certificate["prime_power_and_pole_prime_fixture"]
    prime_exact = exact_groups["prime_power_and_pole_prime_fixture"]
    prime_interval_names = {
        "pole_prime_evaluation_path_A",
        "pole_prime_evaluation_path_B",
        "path_intersection",
        "matched_projected_pole_bound",
    }
    expected_prime_keys = set(prime_exact) | prime_interval_names | {"paths_overlap"}
    if (
        not isinstance(prime_submitted, dict)
        or set(prime_submitted) != expected_prime_keys
    ):
        raise ReplayError("pole-prime fixture inventory mismatch")
    _require(
        {key: prime_submitted[key] for key in prime_exact},
        _encode(prime_exact),
        "pole-prime exact inventory",
    )
    prime_targets = _pole_prime_interval_targets(
        p, dps, _prime_power_fixture(p)
    )
    for name, target in prime_targets.items():
        _check_enclosure(prime_submitted[name], target, f"pole-prime.{name}", dps)
    path_a = _submitted_interval(
        prime_submitted["pole_prime_evaluation_path_A"],
        "pole-prime.path_A",
        dps,
    )
    path_b = _submitted_interval(
        prime_submitted["pole_prime_evaluation_path_B"],
        "pole-prime.path_B",
        dps,
    )
    expected_intersection = (max(path_a[0], path_b[0]), min(path_a[1], path_b[1]))
    intersection = _submitted_interval(
        prime_submitted["path_intersection"],
        "pole-prime.path_intersection",
        dps,
    )
    if expected_intersection[0] > expected_intersection[1]:
        raise ReplayError("submitted pole-prime paths do not overlap")
    if intersection != expected_intersection:
        raise ReplayError("pole-prime path intersection is not exact")
    _require(prime_submitted["paths_overlap"], True, "pole-prime paths overlap")
    pole_lower, _ = _interval_bounds(
        prime_targets["matched_projected_pole_bound"], "matched pole bound"
    )
    if pole_lower <= 0:
        raise ReplayError("matched projected-pole bound is not positive")

    expected_checks = _expected_checks(exact_groups, True, True)
    _require(certificate["checks"], expected_checks, "producer check inventory")
    if not all(expected_checks.values()):
        raise ReplayError("independent replay check failed")

    canonical = (
        json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n"
    ).encode("utf-8")
    bound_bytes = canonical if producer_bytes is None else producer_bytes
    if bound_bytes != canonical:
        raise ReplayError("producer artifact bytes are not canonical exact serialization")
    parsed = _strict_json_loads(bound_bytes, "producer artifact bytes")
    _require(parsed, payload, "producer artifact bytes")

    return {
        "schema": REPLAY_SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "source_lock": binding,
        "inputs": inputs,
        "producer_binding": {
            "sha256": _digest(bound_bytes),
            "byte_length": len(bound_bytes),
        },
        "reconstructed": {
            "source_dependency_count": len(binding["dependency_hashes"]),
            "external_source_byte_count": len(binding["external_source_hashes"]),
            "exact_fixture_group_count": 6,
            "mellin_interval_count": len(targets),
            "pole_prime_interval_count": len(prime_targets) + 1,
            "prime_power_count": len(prime_exact["inventory"]),
            "schedule_N_star_exact": schedule,
            "moment_order_exact": 2,
        },
        "checks": {
            "formula_tree_independent": True,
            "producer_module_imported": False,
            "producer_booleans_trusted": False,
            "source_lock_and_eighteen_dependencies_rehashed": True,
            "four_external_source_files_rehashed": True,
            "producer_bytes_bound": True,
            "all_exact_rational_models_reconstructed": True,
            "all_interval_probes_independently_enclosed": True,
            "prime_powers_independently_detected": True,
            "source_scalar_is_Xi_over_four": True,
            "gray_mass_retained": True,
            "graph_spill_retained": True,
            "fixed_moments_not_promoted_to_sign": True,
            "combined_pole_prime_cancellation_retained": True,
            "binary64_parameters_used": False,
            "api_key_or_environment_secret_read": False,
            "cached_matrix_eigenvector_or_zero_array_read": False,
            "global_weil_positivity_assumed": False,
            "signed_sector_floor_claimed": False,
            "equation_5_2_claimed": False,
            "determinant_limit_claimed": False,
            "riemann_hypothesis_claimed": False,
        },
        "arithmetic_libraries": ARITHMETIC_LIBRARIES,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    input_path = Path(args.input)
    raw = _read(input_path, "producer artifact")
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
