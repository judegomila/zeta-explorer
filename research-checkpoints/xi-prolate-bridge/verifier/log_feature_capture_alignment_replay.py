#!/usr/bin/env python3
"""Clean-room replay for the log-feature capture/alignment certificate.

The verifier imports no producer module and reads no environment variables.  It
rehashes the source lock and all locked dependencies, rebuilds every rational
fixture by separate algebra, and independently encloses each transcendental
quantity.  The replay is diagnostic only and always remains P0_INVALIDATED.
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


PRODUCER_SCHEMA = "xi-prolate-log-feature-capture-alignment-v1"
REPLAY_SCHEMA = "xi-prolate-log-feature-capture-alignment-replay-v1"
SOURCE_LOCK_PATH = "LOG_FEATURE_CAPTURE_ALIGNMENT_SOURCE_LOCK.json"
SOURCE_LOCK_SCHEMA = "xi-prolate-log-feature-capture-alignment-source-lock-v1"
CLAIM_CLASS = "LOG_FEATURE_CAPTURE_ALIGNMENT_REDUCTION"
TERMINAL_STATE = "P0_INVALIDATED"
UPDATED_DATE = "2026-08-08"
EXPECTED_SOURCE_LOCK_SHA256 = "4800fc596cad791ddec7af4251604dbfe4f45b911708f48f08fc5fa658e2d40f"
EXPECTED_MPMATH_VERSION = "1.4.1"
MAX_LAMBDA_NUMERATOR = 999999
MAX_DPS = 1000
EXPECTED_DEPENDENCY_PATHS = {
    "DIRECT_RH_ATTACK.md",
    "P0_SOURCE_LOCK.json",
    "PHYSICAL_DEFECT_ADJOINT_TAIL_SOURCE_LOCK.json",
    "notes/LOG_FEATURE_CAPTURE_ALIGNMENT_REDUCTION.md",
    "notes/PHYSICAL_DEFECT_ADJOINT_TAIL_REDUCTION.md",
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

SOURCE_ADMISSIONS = {
    "api_key_read": False,
    "big_o_reported_as_strict_pass": False,
    "binary64_parameters_used": False,
    "cached_physical_matrix_read": False,
    "central_only_capture_promoted_to_full_defect": False,
    "central_taylor_capture_claimed": False,
    "determinant_limit_claimed": False,
    "environment_secret_read": False,
    "equation_5_2_claimed": False,
    "global_weil_positivity_assumed": False,
    "input_cap_bypassed": False,
    "inversion_reflection_dropped": False,
    "lambda_squared_mixed_with_lambda": False,
    "odd_pole_capture_claimed": False,
    "positive_excess_axis_condition_omitted": False,
    "prime_block_sign_changed": False,
    "prime_power_endpoint_omitted": False,
    "rank_only_capture_claimed": False,
    "rh_proved": False,
    "runtime_version_mismatch_accepted": False,
    "secret_serialized": False,
    "source_tail_scale_claimed": False,
    "spectral_endpoint_dropped": False,
    "unit_source_normalization_substituted": False,
    "zeros_assumed_real": False,
    "zeta_zero_table_read": False,
}

ARITHMETIC_LIBRARIES = {
    "precision_mode": "exact reduced rationals plus outward arbitrary-precision intervals",
    "libraries": [
        "Python fractions.Fraction",
        f"mpmath.iv {EXPECTED_MPMATH_VERSION}",
    ],
    "raw_interval_or_ball_output_applicable": True,
    "shared_library_with_verifier": True,
    "independent_formula_trees_required": True,
    "serialization_guard": "every nondegenerate interval is enlarged to a precision-scaled dyadic enclosure",
    "independence_limitation": "producer and verifier share Python integer/Fraction arithmetic and the pinned mpmath.iv transcendental runtime",
}

Matrix = list[list[Fraction]]
Vector = list[Fraction]


class ReplayError(ValueError):
    """Raised when an artifact is malformed or independent replay fails."""


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
    return {"numerator": str(item.numerator), "denominator": str(item.denominator)}


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


def _canonical_input(value: Any, label: str, minimum: int, maximum: int) -> int:
    if not isinstance(value, str):
        raise ReplayError(f"{label} must be canonical positive integer text")
    if len(value) > len(str(maximum)):
        raise ReplayError(f"{label} exceeds maximum")
    if _POSITIVE_INTEGER_TEXT.fullmatch(value) is None:
        raise ReplayError(f"{label} must be canonical positive integer text")
    lower, upper = str(minimum), str(maximum)
    if len(value) < len(lower) or (len(value) == len(lower) and value < lower):
        raise ReplayError(f"{label} below minimum")
    if len(value) > len(upper) or (len(value) == len(upper) and value > upper):
        raise ReplayError(f"{label} exceeds maximum")
    return int(value)


def _validate_source_lock(root: Path) -> tuple[dict[str, Any], dict[str, Any]]:
    raw = _read(root / SOURCE_LOCK_PATH, "source lock")
    lock_hash = _digest(raw)
    if lock_hash != EXPECTED_SOURCE_LOCK_SHA256:
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
        or lock["updated_date"] != UPDATED_DATE
        or lock["external_sources"] != []
        or lock["source_admissions"] != SOURCE_ADMISSIONS
    ):
        raise ReplayError("source-lock fixed metadata mismatch")
    if not isinstance(lock["locked_conventions"], dict) or not lock["locked_conventions"]:
        raise ReplayError("source-lock conventions missing")
    if not isinstance(lock["locked_formulas"], dict) or not lock["locked_formulas"]:
        raise ReplayError("source-lock formulas missing")
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
    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list):
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
        actual = _digest(_read(root / candidate, relative))
        if actual != expected:
            raise ReplayError(f"dependency hash mismatch: {relative}")
        found[relative] = expected
    if set(found) != EXPECTED_DEPENDENCY_PATHS:
        raise ReplayError("source-lock dependency path inventory mismatch")
    return {
        "path": SOURCE_LOCK_PATH,
        "sha256": lock_hash,
        "schema": SOURCE_LOCK_SCHEMA,
        "dependency_hashes": dict(sorted(found.items())),
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
        raise ReplayError("internal replay matrix is empty or ragged")
    return [[matrix[row][column] for row in range(len(matrix))]
            for column in range(len(matrix[0]))]


def _product(left: Matrix, right: Matrix) -> Matrix:
    if (
        not left
        or not right
        or any(len(row) != len(left[0]) for row in left)
        or any(len(row) != len(right[0]) for row in right)
        or len(left[0]) != len(right)
    ):
        raise ReplayError("internal replay matrix dimension mismatch")
    return [
        [
            sum((left[i][k] * right[k][j] for k in range(len(right))), Fraction(0))
            for j in range(len(right[0]))
        ]
        for i in range(len(left))
    ]


def _difference(left: Matrix, right: Matrix) -> Matrix:
    if len(left) != len(right) or any(len(a) != len(b) for a, b in zip(left, right)):
        raise ReplayError("internal replay matrix shape mismatch")
    return [[a - b for a, b in zip(row_a, row_b)]
            for row_a, row_b in zip(left, right)]


def _sum_matrix(left: Matrix, right: Matrix) -> Matrix:
    if len(left) != len(right) or any(len(a) != len(b) for a, b in zip(left, right)):
        raise ReplayError("internal replay matrix shape mismatch")
    return [[a + b for a, b in zip(row_a, row_b)]
            for row_a, row_b in zip(left, right)]


def _multiple(scalar: Fraction | int, matrix: Matrix) -> Matrix:
    factor = Fraction(scalar)
    return [[factor * entry for entry in row] for row in matrix]


def _outer(left: Vector, right: Vector | None = None) -> Matrix:
    other = left if right is None else right
    return [[a * b for b in other] for a in left]


def _trace(matrix: Matrix) -> Fraction:
    if not matrix or any(len(row) != len(matrix) for row in matrix):
        raise ReplayError("internal replay trace shape mismatch")
    return sum((matrix[index][index] for index in range(len(matrix))), Fraction(0))


def _dot(left: Vector, right: Vector) -> Fraction:
    if len(left) != len(right):
        raise ReplayError("internal replay vector dimension mismatch")
    return sum((a * b for a, b in zip(left, right)), Fraction(0))


def _apply(matrix: Matrix, vector: Vector) -> Vector:
    return [_dot(row, vector) for row in matrix]


def _quadratic(matrix: Matrix, vector: Vector) -> Fraction:
    return _dot(vector, _apply(matrix, vector))


def _central_reconstruction() -> dict[str, Any]:
    band = _diag(1, 0)
    target = _diag(1, 0)
    k = [Fraction(3, 5), Fraction(4, 5)]
    h = [Fraction(-4, 5), Fraction(3, 5)]
    p_k = _outer(k)
    # Reconstruct the complement from I-P_K, then separately check the given
    # orthogonal unit vector instead of using it to define the projector.
    p_h = _difference(_identity(2), p_k)
    if p_h != _outer(h) or _dot(k, h) != 0 or _dot(h, h) != 1:
        raise ReplayError("central-angle complement reconstruction failed")
    e0 = [Fraction(1), Fraction(0)]
    rejected_feature = _apply(p_h, e0)
    alpha_squared = _dot(rejected_feature, rejected_feature)
    central_trace = sum(
        (_quadratic(band, [p_h[row][column] for row in range(2)])
         for column in range(2)),
        Fraction(0),
    )
    if alpha_squared != Fraction(16, 25) or central_trace != alpha_squared:
        raise ReplayError("central-angle equality fixture failed")
    return {
        "delta": Fraction(1),
        "T_band": band,
        "P_V": target,
        "unit_K_vector": k,
        "unit_H_vector": h,
        "P_K": p_k,
        "P_H": p_h,
        "alpha_squared": alpha_squared,
        "polynomial_tail_tau": Fraction(0),
        "central_defect_trace": central_trace,
        "angle_upper_bound_squared": alpha_squared,
        "angle_bound_is_equality": central_trace == alpha_squared,
        "physical_angle_estimate_claimed": False,
        "theorem": {
            "tau_r_upper": "delta/pi*(delta/2)^(2*r)/((2*r+1)^2*(r!)^2)",
            "central_trace_upper": "(alpha*sqrt(delta/pi)+sqrt(tau_r))^2",
            "alpha": "operator_norm(P_H*P_V_r)",
        },
    }


def _source_tail_reconstruction() -> dict[str, Any]:
    source_map = [
        [Fraction(1), Fraction(0), Fraction(0)],
        [Fraction(0), Fraction(1), Fraction(0)],
    ]
    right_inverse = _transpose(source_map)
    p_f = _diag(1, 0, 0)
    p_k = _diag(1, 0)
    p_h = _difference(_identity(2), p_k)
    p_v = _diag(0, 1)
    identity_check = _product(source_map, right_inverse)
    left_side = _product(p_h, p_v)
    # Associate the five factors from the source side outward.  This differs
    # from the producer's left-to-right product while retaining exact algebra.
    missed_source = _product(_difference(_identity(3), p_f), right_inverse)
    lifted_feature = _product(source_map, _product(missed_source, p_v))
    right_side = _product(p_h, lifted_feature)
    if identity_check != _identity(2) or left_side != right_side:
        raise ReplayError("source-tail identity fixture failed")
    norm_squared = max(sum((entry * entry for entry in row), Fraction(0))
                       for row in left_side)
    return {
        "T": source_map,
        "B_X": right_inverse,
        "P_F": p_f,
        "P_K": p_k,
        "P_H": p_h,
        "P_V": p_v,
        "T_B_X": identity_check,
        "P_H_P_V": left_side,
        "P_H_T_I_minus_P_F_B_X_P_V": right_side,
        "identity_exact": left_side == right_side,
        "operator_norm_squared": norm_squared,
        "T_operator_norm_squared": Fraction(1),
        "general_T_norm_squared_upper": "lambda^2/2",
        "conditional_source_tail_squared_budget": "2*L/lambda^3",
        "conditional_alpha_squared_upper": "L/lambda",
        "big_o_is_not_a_strict_threshold": True,
        "physical_source_tail_estimate_claimed": False,
    }


def _moment_reconstruction() -> dict[str, Any]:
    q, h = Fraction(5), Fraction(2)
    spectrum = [Fraction(1), Fraction(2)]
    pole = [Fraction(1), Fraction(1)]
    mu0 = _dot(pole, pole)
    gamma = Fraction(3, 5)
    moments: list[Fraction] = []
    current = pole[:]
    for _ in range(6):
        moments.append(_dot(pole, current))
        current = [value * coordinate for value, coordinate in zip(spectrum, current)]
    exact_load = 2 * sum(
        (coordinate**2 / (q - value) for coordinate, value in zip(pole, spectrum)),
        Fraction(0),
    )
    upper: list[Fraction] = []
    direct_differences: list[Fraction] = []
    spectral_differences: list[Fraction] = []
    geometric: list[Fraction] = []
    truncated = Fraction(0)
    for order in range(5):
        if order:
            truncated += moments[order - 1] / q**order
        estimate = 2 * (truncated + moments[order] / (h * q**order))
        upper.append(estimate)
        direct_differences.append(estimate - exact_load)
        spectral_differences.append(2 * sum(
            (
                coordinate**2 * value**order * (q - h - value)
                / (h * q**order * (q - value))
                for coordinate, value in zip(pole, spectrum)
            ),
            Fraction(0),
        ))
        geometric.append(2 * mu0 * gamma**(order + 1) / h)
    if (
        exact_load != Fraction(7, 6)
        or upper != [Fraction(2), Fraction(7, 5), Fraction(31, 25),
                     Fraction(149, 125), Fraction(147, 125)]
        or direct_differences != spectral_differences
    ):
        raise ReplayError("directional-moment reconstruction failed")
    return {
        "q": q,
        "h": h,
        "R": _diag(*spectrum),
        "p": pole,
        "mu_0": mu0,
        "gamma": gamma,
        "R_upper_gamma_q": gamma * q,
        "rho_0_through_5": moments,
        "exact_load": exact_load,
        "U_0_through_4": upper,
        "exact_U_minus_load": direct_differences,
        "reconstructed_remainder_formula": spectral_differences,
        "geometric_remainder_upper": geometric,
        "geometric_formula": "(2*mu_0/h)*gamma^(k+1)",
        "U_monotone": all(a >= b for a, b in zip(upper, upper[1:])),
        "geometric_bounds_hold": all(a <= b for a, b in zip(direct_differences, geometric)),
        "strict_odd_load_claimed": False,
    }


def _excess_reconstruction() -> dict[str, Any]:
    baseline = _diag(4, 3)
    p = [Fraction(2), Fraction(0)]
    pole_matrix = _multiple(2, _outer(p))
    p_norm_squared = _dot(p, p)
    necessary_rhs = 2 * p_norm_squared**2 - _quadratic(baseline, p)

    def aligned_case(amount: Fraction) -> dict[str, Any]:
        excess = _diag(amount, 0)
        compensated = _difference(_sum_matrix(baseline, excess), pole_matrix)
        energy = _quadratic(excess, p)
        determinant = compensated[0][0] * compensated[1][1] - compensated[0][1] ** 2
        return {
            "A_plus": excess,
            "pole_axis_energy": energy,
            "necessary_rhs": necessary_rhs,
            "strict_necessary_inequality": energy > necessary_rhs,
            "compensated_odd_matrix": compensated,
            "principal_diagonal": [compensated[0][0], compensated[1][1]],
            "strict_positive": compensated[0][0] > 0 and determinant > 0,
            "singular": determinant == 0,
        }

    strict_case = aligned_case(Fraction(5))
    equality_case = aligned_case(Fraction(4))
    transverse = _diag(0, 5)
    transverse_p = [Fraction(1), Fraction(0)]
    transverse_base = _identity(2)
    transverse_matrix = _difference(
        _sum_matrix(transverse_base, transverse),
        _multiple(2, _outer(transverse_p)),
    )
    if (
        necessary_rhs != 16
        or not strict_case["strict_positive"]
        or not equality_case["singular"]
        or transverse_matrix != _diag(-1, 6)
    ):
        raise ReplayError("positive-excess reconstruction failed")
    return {
        "q": Fraction(5),
        "R": _diag(1, 2),
        "M_beta": baseline,
        "p": p,
        "p_nonzero": True,
        "pole_axis_necessary_formula": "<p,A_plus*p> > 2*||p||^4-<p,M_beta*p>",
        "necessary_rhs": necessary_rhs,
        "strict_pass": strict_case,
        "equality_boundary_rejected": equality_case,
        "transverse_orientation_counterexample": {
            "M_beta": transverse_base,
            "p": transverse_p,
            "A_plus": transverse,
            "pole_axis_energy": _quadratic(transverse, transverse_p),
            "necessary_rhs": Fraction(1),
            "compensated_odd_matrix": transverse_matrix,
            "large_transverse_excess_does_not_help": True,
        },
        "physical_positive_excess_reserve_claimed": False,
    }


def _spectral_reconstruction() -> dict[str, Any]:
    sigma = Fraction(1)
    operator = _diag(0, 1)
    open_projection = _diag(1, 0)
    closed_projection = _identity(2)
    resolvent = _diag(1, Fraction(1, 2))

    def exact_load(vector: Vector) -> Fraction:
        return 2 * _quadratic(resolvent, vector)

    small = [Fraction(1, 4), Fraction(1, 4)]
    u_bound = 2 * _dot(small, small)
    small_open = _quadratic(open_projection, small)
    small_closed = _quadratic(closed_projection, small)
    load_small = exact_load(small)
    load_upper = (u_bound + 2 * sigma * small_open) / (1 + sigma)
    necessary = [Fraction(1, 2), Fraction(1, 2)]
    necessary_closed = _quadratic(closed_projection, necessary)
    necessary_load = exact_load(necessary)
    threshold = (1 + sigma) / 2
    endpoint = [Fraction(0), Fraction(1)]
    endpoint_open = _quadratic(open_projection, endpoint)
    endpoint_closed = _quadratic(closed_projection, endpoint)
    endpoint_load = exact_load(endpoint)
    if (
        load_small != Fraction(3, 16)
        or load_upper != load_small
        or necessary_load != Fraction(3, 4)
        or endpoint_load != 1
        or endpoint_closed != 1
    ):
        raise ReplayError("spectral-alignment reconstruction failed")
    return {
        "sigma": sigma,
        "S": operator,
        "E_low_open_0_sigma": open_projection,
        "E_low_closed_0_sigma": closed_projection,
        "sufficient_open_low_mass": {
            "z": small,
            "U_k_upper_for_2_norm_z_squared": u_bound,
            "a_open": small_open,
            "a_closed": small_closed,
            "load_exact": load_small,
            "load_upper": load_upper,
            "strict_criterion_lhs": u_bound + 2 * sigma * small_open,
            "strict_criterion_rhs": 1 + sigma,
            "strict_pass": u_bound + 2 * sigma * small_open < 1 + sigma,
        },
        "necessary_closed_low_mass": {
            "z": necessary,
            "a_closed": necessary_closed,
            "necessary_strict_upper": threshold,
            "load_exact": necessary_load,
            "load_strictly_below_one": necessary_load < 1,
            "necessary_condition_holds": necessary_closed < threshold,
        },
        "eigenvalue_sigma_boundary": {
            "z": endpoint,
            "a_open": endpoint_open,
            "a_closed": endpoint_closed,
            "necessary_strict_upper": threshold,
            "load_exact": endpoint_load,
            "strict_pass": False,
            "closed_endpoint_is_mandatory": True,
        },
        "formulas": {
            "sufficient": "load <= (U_k+2*sigma*||E_[0,sigma) z||^2)/(1+sigma)",
            "necessary": "load<1 implies ||E_[0,sigma] z||^2<(1+sigma)/2",
        },
        "physical_spectral_alignment_claimed": False,
    }


def _countermodel_reconstruction() -> dict[str, Any]:
    defect = _diag(4, 1, Fraction(1, 4), Fraction(1, 16))
    feature = _diag(1, 1, 0, 0)
    good = feature
    bad = _diag(0, 0, 1, 1)
    good_complement = _difference(_identity(4), good)
    bad_complement = _difference(_identity(4), bad)
    good_residual = _trace(_product(good_complement, defect))
    bad_residual = _trace(_product(bad_complement, defect))
    # For orthogonal coordinate projectors, ||(I-P)P_V||^2 is exactly the
    # largest diagonal entry of their product.
    alpha_good = max(row[index] for index, row in enumerate(_product(good_complement, feature)))
    alpha_bad = max(row[index] for index, row in enumerate(_product(bad_complement, feature)))
    band = _diag(1, 0)
    exterior = _diag(0, 7)
    central_k = _diag(1, 0)
    central_h = _difference(_identity(2), central_k)
    central_defect = _trace(_product(central_h, band))
    exterior_defect = _trace(_product(central_h, exterior))
    if (
        good_residual != Fraction(5, 16)
        or bad_residual != 5
        or alpha_good != 0
        or alpha_bad != 1
        or central_defect != 0
        or exterior_defect != 7
    ):
        raise ReplayError("rank/orientation countermodel reconstruction failed")
    return {
        "rank_two_orientation": {
            "D": defect,
            "P_V": feature,
            "P_K_good": good,
            "P_K_bad": bad,
            "common_rank": 2,
            "good_residual_trace": good_residual,
            "bad_residual_trace": bad_residual,
            "good_alpha_squared": alpha_good,
            "bad_alpha_squared": alpha_bad,
            "rank_alone_does_not_control_capture": True,
        },
        "central_only_does_not_control_exterior": {
            "T_band": band,
            "D_exterior": exterior,
            "P_K": central_k,
            "central_defect": central_defect,
            "exterior_defect": exterior_defect,
            "central_capture_promoted_to_full_defect": False,
        },
    }


def _exact_certificate(r: int) -> tuple[dict[str, Any], dict[str, bool]]:
    central = _central_reconstruction()
    source = _source_tail_reconstruction()
    moments = _moment_reconstruction()
    excess = _excess_reconstruction()
    spectral = _spectral_reconstruction()
    countermodels = _countermodel_reconstruction()
    odd = {
        "odd_sector_only": True,
        "r_exact_integer": r,
        "r_rule": "3*bit_length(lambda_numerator)",
        "safe_r_condition": "r>=3*L/2",
        "tail_formula": "L*lambda*(L/4)^(2*r)/((2*r+1)*(r!)^2)",
        "conditional_mu0_formula": "(alpha*sqrt(sinh(L/2)-L/2)+epsilon_p)^2",
        "physical_odd_pole_capture_claimed": False,
    }
    checks = {
        "central_angle_equality_reconstructed": central["angle_bound_is_equality"],
        "central_physical_capture_not_claimed": not central["physical_angle_estimate_claimed"],
        "source_tail_identity_exact": source["identity_exact"],
        "source_tail_scale_not_claimed": not source["physical_source_tail_estimate_claimed"],
        "big_o_not_strict_pass": source["big_o_is_not_a_strict_threshold"],
        "odd_moment_remainders_exact": moments["exact_U_minus_load"]
        == moments["reconstructed_remainder_formula"],
        "odd_moment_geometric_bounds_hold": moments["geometric_bounds_hold"],
        "positive_excess_strict_axis_inequality": excess["strict_pass"]["strict_necessary_inequality"],
        "positive_excess_equality_is_singular": excess["equality_boundary_rejected"]["singular"]
        and not excess["equality_boundary_rejected"]["strict_positive"],
        "transverse_excess_rejected": excess["transverse_orientation_counterexample"]["large_transverse_excess_does_not_help"],
        "spectral_open_sufficient_fixture_passes": spectral["sufficient_open_low_mass"]["strict_pass"],
        "spectral_closed_necessary_fixture_passes": spectral["necessary_closed_low_mass"]["necessary_condition_holds"],
        "spectral_sigma_endpoint_rejected": spectral["eigenvalue_sigma_boundary"]["load_exact"] == 1
        and not spectral["eigenvalue_sigma_boundary"]["strict_pass"],
        "rank_not_orientation": countermodels["rank_two_orientation"]["rank_alone_does_not_control_capture"],
        "central_not_full_defect": not countermodels["central_only_does_not_control_exterior"]["central_capture_promoted_to_full_defect"],
        "interval_probe_not_promoted": True,
        "strict_threshold_absent": True,
    }
    if not all(checks.values()):
        raise ReplayError("independent exact fixture check failed")
    return {
        "central_taylor_angle": central,
        "exact_source_tail": source,
        "odd_pole_taylor": odd,
        "directional_moment_remainder": moments,
        "positive_excess_necessity": excess,
        "spectral_alignment": spectral,
        "rank_orientation_countermodels": countermodels,
    }, checks


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
    return (Fraction(numerator * (1 << exponent)) if exponent >= 0
            else Fraction(numerator, 1 << (-exponent)))


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
    # A precision-scale guard around a value far below one can create a long
    # normalized mantissa after the outward guard is added.  Bound the full
    # exact representation without incorrectly requiring target-scale bits.
    if bit_count > 20 * bits + 4096 or abs(exponent) > 20 * bits + 4096:
        raise ReplayError(f"{label} exceeds precision budget")
    numerator = -mantissa if sign else mantissa
    return (Fraction(numerator * (1 << exponent)) if exponent >= 0
            else Fraction(numerator, 1 << (-exponent)))


def _mpf_raw(raw: tuple[int, int, int, int], dps: int) -> Any:
    with mp.workprec(max(_precision_bits(dps) + 64, raw[3] + 16)):
        return +mp.mpf(raw)


def _submitted_interval(value: Any, label: str, dps: int) -> tuple[Fraction, Fraction]:
    if not isinstance(value, dict) or set(value) != {"decimal", "dyadic"}:
        raise ReplayError(f"{label} interval inventory mismatch")
    decimal, dyadic = value["decimal"], value["dyadic"]
    if (
        not isinstance(decimal, list)
        or len(decimal) != 2
        or any(not isinstance(item, str) or _DECIMAL_TEXT.fullmatch(item) is None
               for item in decimal)
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
    if not submitted_lower <= independent_lower <= independent_upper <= submitted_upper:
        raise ReplayError(f"{label} does not enclose independent replay")
    scale = max(Fraction(1), abs(independent_lower), abs(independent_upper))
    exponent = _precision_bits(dps) - 64
    width_limit = scale * (
        Fraction(1, 1 << exponent) if exponent >= 0 else Fraction(1 << (-exponent))
    )
    if submitted_upper - submitted_lower > width_limit:
        raise ReplayError(f"{label} interval is excessively wide")


def _factorial_product(value: int) -> int:
    result = 1
    for term in range(value, 1, -1):
        result *= term
    return result


def _interval_targets(p: int, dps: int, r: int) -> dict[str, Any]:
    """Build independent interval targets after all textual caps are checked."""
    _validate_runtime()
    mp.iv.dps = dps
    two = mp.iv.mpf(2)
    lam = mp.iv.mpf(p) / two
    length = two * mp.iv.log(lam)
    factorial = mp.iv.mpf(_factorial_product(r))
    odd_denominator = mp.iv.mpf(2 * r + 1)

    # These are the integrated Taylor bounds in expanded form.  In particular,
    # both retain the sharp 1/(2r+1) integration factor (squared for the central
    # feature after the rank-one norm conversion).
    central_tail = 1 / (
        mp.iv.pi * mp.iv.mpf(4) ** r * odd_denominator**2 * factorial**2
    )
    source_tail_squared = (two * length) / (lam * lam * lam)
    alpha_squared = length / lam
    central_trace = (
        alpha_squared / mp.iv.pi
        + central_tail
        + two * mp.iv.sqrt(alpha_squared * central_tail / mp.iv.pi)
    )
    half_length = length / two
    pole_norm_squared = (
        (mp.iv.exp(half_length) - mp.iv.exp(-half_length)) / two - half_length
    )
    pole_tail_squared = (
        lam * length ** (2 * r + 1)
        / (odd_denominator * mp.iv.mpf(16) ** r * factorial**2)
    )
    epsilon_p = mp.iv.sqrt(pole_tail_squared)
    alpha = mp.iv.sqrt(alpha_squared)
    conditional_mu0 = (
        alpha * mp.iv.sqrt(pole_norm_squared) + epsilon_p
    ) ** 2
    coarse_exponent = 1 - 6 * mp.iv.log(two)
    coarse_pole = length * mp.iv.exp(coarse_exponent * mp.iv.log(lam))
    return {
        "lambda": lam,
        "physical_length_L": length,
        "safe_r_minus_three_L_over_two": mp.iv.mpf(r) - 3 * length / two,
        "central_tau_r_upper_delta_one": central_tail,
        "conditional_source_tail_squared_budget": source_tail_squared,
        "conditional_alpha_squared_upper": alpha_squared,
        "conditional_central_trace_upper": central_trace,
        "odd_pole_norm_squared": pole_norm_squared,
        "odd_pole_taylor_tail_squared_upper": pole_tail_squared,
        "odd_pole_coarse_power_envelope": coarse_pole,
        "conditional_odd_pole_mu0_upper": conditional_mu0,
    }


def replay(payload: dict[str, Any], *, producer_bytes: bytes | None = None) -> dict[str, Any]:
    _validate_json(payload, "producer payload")
    if not isinstance(payload, dict) or set(payload) != {
        "schema", "source_lock", "inputs", "terminal_state",
        "source_conventions", "claim_boundary", "certificate",
        "arithmetic_libraries",
    }:
        raise ReplayError("producer top-level inventory mismatch")
    if payload["schema"] != PRODUCER_SCHEMA or payload["terminal_state"] != TERMINAL_STATE:
        raise ReplayError("producer schema or terminal state mismatch")

    # Lexically validate and cap every user-supplied integer before runtime
    # validation, source I/O, factorial construction, or interval setup.
    inputs = payload["inputs"]
    if not isinstance(inputs, dict) or set(inputs) != {
        "lambda_numerator_text", "lambda_denominator_text", "dps_text",
        "r_exact_integer", "r_rule",
    }:
        raise ReplayError("input inventory mismatch")
    p = _canonical_input(
        inputs["lambda_numerator_text"], "lambda numerator", 3,
        MAX_LAMBDA_NUMERATOR,
    )
    dps = _canonical_input(inputs["dps_text"], "dps", 50, MAX_DPS)
    r = 3 * p.bit_length()
    if (
        p % 2 == 0
        or inputs["lambda_denominator_text"] != "2"
        or isinstance(inputs["r_exact_integer"], bool)
        or not isinstance(inputs["r_exact_integer"], int)
        or inputs["r_exact_integer"] != r
        or inputs["r_rule"] != "3*bit_length(lambda_numerator)"
    ):
        raise ReplayError("lambda or Taylor-order input mismatch")

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
            "source_admissions": SOURCE_ADMISSIONS,
        },
        "claim boundary",
    )
    _require(payload["arithmetic_libraries"], ARITHMETIC_LIBRARIES, "arithmetic libraries")

    certificate = payload["certificate"]
    if not isinstance(certificate, dict) or set(certificate) != {
        "central_taylor_angle", "exact_source_tail", "odd_pole_taylor",
        "directional_moment_remainder", "positive_excess_necessity",
        "spectral_alignment", "rank_orientation_countermodels",
        "transcendental_intervals", "checks",
    }:
        raise ReplayError("certificate inventory mismatch")
    exact_groups, expected_checks = _exact_certificate(r)
    for name, reconstructed in exact_groups.items():
        label = (
            "rank and central orientation countermodels"
            if name == "rank_orientation_countermodels"
            else name
        )
        _require(certificate[name], _encode(reconstructed), label)

    interval_section = certificate["transcendental_intervals"]
    if not isinstance(interval_section, dict) or set(interval_section) != {
        "formula_scale_regression_only", "delta_text", "r_exact_integer",
        "r_rule", "strict_threshold_supplied",
        "physical_capture_or_odd_floor_claimed", "values",
    }:
        raise ReplayError("interval section inventory mismatch")
    _require(
        {key: interval_section[key] for key in interval_section if key != "values"},
        {
            "formula_scale_regression_only": True,
            "delta_text": "1",
            "r_exact_integer": r,
            "r_rule": "3*bit_length(lambda_numerator)",
            "strict_threshold_supplied": False,
            "physical_capture_or_odd_floor_claimed": False,
        },
        "interval metadata",
    )
    targets = _interval_targets(p, dps, r)
    values = interval_section["values"]
    if not isinstance(values, dict) or set(values) != set(targets):
        raise ReplayError("interval target inventory mismatch")
    for name, target in targets.items():
        _check_enclosure(values[name], target, f"interval.{name}", dps)
    _require(certificate["checks"], expected_checks, "producer check inventory")

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
            "exact_fixture_groups": len(exact_groups),
            "transcendental_interval_count": len(targets),
            "source_dependency_count": len(binding["dependency_hashes"]),
            "integrated_taylor_factor_checked": "1/(2*r+1)",
        },
        "checks": {
            "formula_tree_independent": True,
            "producer_module_imported": False,
            "producer_booleans_trusted": False,
            "source_lock_and_dependencies_rehashed": True,
            "producer_bytes_bound": True,
            "all_exact_rational_models_reconstructed": True,
            "all_interval_probes_independently_enclosed": True,
            "integrated_taylor_factors_retained": True,
            "api_key_or_environment_secret_read": False,
            "physical_central_capture_claimed": False,
            "physical_source_tail_scale_claimed": False,
            "physical_odd_pole_capture_claimed": False,
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
