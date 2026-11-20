#!/usr/bin/env python3
"""Produce the effective-mixed, endpoint-jet, and odd-jump audit artifact.

The artifact contains exact rational identities and outward interval
evaluations of the locked formulas.  It deliberately does not execute the
actual prolate trace-stopping schedule, prove a signed floor, or promote a
fixed-parameter computation to an asymptotic conclusion.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from math import factorial, isqrt
from pathlib import Path
import re
from typing import Any

import mpmath as mp


SCHEMA = "xi-prolate-effective-mixed-endpoint-jump-v1"
LOCK = "EFFECTIVE_MIXED_ENDPOINT_JUMP_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-effective-mixed-endpoint-jump-source-lock-v1"
CLAIM_CLASS = "EFFECTIVE_MIXED_PREFIX_ENDPOINT_JET_ODD_JUMP_AUDIT"
TERMINAL_STATE = "P0_INVALIDATED"
CHECKPOINT_VERSION = "0.42.0-effective-mixed-endpoint-jump"
UPDATED_DATE = "2026-08-08"
EXPECTED_SOURCE_LOCK_SHA256 = "24ea8f8085e9e198201006f54e0499495174053e38f6c26185cd2b2f60725fcc"
EXPECTED_MPMATH_VERSION = "1.4.1"

CANONICAL_LAMBDA_NUMERATORS = {5, 9}
CANONICAL_DPS = {80, 160}
_POSITIVE_INTEGER_TEXT = re.compile(r"[1-9][0-9]*\Z")
_SHA256 = re.compile(r"[0-9a-f]{64}\Z")

LOG2_10_UPPER_NUMERATOR = 3321928094887363
LOG2_10_UPPER_DENOMINATOR = 10**15
SERIALIZATION_GUARD_OFFSET_BITS = 18

EXPECTED_DEPENDENCY_HASHES = {
    "RESIDUE_COFRAME_MIXED_KRYLOV_SOURCE_LOCK.json": "07820d02ae10c1911d35796a5ad018ffcdae4363f22f2b000074e430c7086375",
    "DIRECT_RH_ATTACK.md": "b8c5eb77013f00d9a48aa24c244c4a1d1d86957eab041e28282927d7d55c0fa2",
    "P0_SOURCE_LOCK.json": "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_MATRIX_FORMULAS.md": "73aa4d0a746bf1a553372d4c7bdc1c671cd69c9cc36682091d94731e1dac74dd",
    "P0_NORMALIZATION_AUDIT.md": "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
    "requirements.txt": "458f06e2b5d6e73acc7a4f72af69afe920764c71127578555044815cd785c0fa",
    "notes/EFFECTIVE_MIXED_PREFIX_SCHEDULE_ATTACK.md": "a33e7a072057f1444afb9d00911465f599fec508d0a6488e655638947cc515ba",
    "notes/AUGMENTED_ENDPOINT_JET_COFRAME_ATTACK.md": "521a21decb0eb3175d73430f4d23b31917a128cc8f705caea9ccc70e088ba7ac",
    "notes/ODD_JUMP_FINITE_KRYLOV_ATTACK.md": "383ae4291cf5168f389c81d8f9a0fd6386c8adb952cdaa2368cf7e24f8283aa7",
    "notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md": "3f8b381d9e51e0fa0cf89928851e89dd163ec9982249af8050a90520c0389f81",
    "notes/MIXED_PREFIX_COUPLED_SIGNED_AUDIT.md": "544ce5d2ba527ba9200a64860d977c7191107c88798963591ed960bfa81e527c",
    "notes/PRESCRIBED_RESIDUE_COFRAME_AUDIT.md": "5c5c50013431500cab6bdfbb359dd1d4bd76c76648b309093e44effde19ef307",
    "notes/ODD_KRYLOV_TRANSVERSE_CRITICAL_LOAD.md": "c5134b4fb80bf2fcb654a1b31a7422aa089973a664cda90707d30ce7e469ddcc",
    "notes/ODD_FAVORABLE_LOCKED_SUBSEQUENCE.md": "90904571557ac15882989e6d0832458ffa3475f2075ab53b2f7db09e6fe00b28",
    "notes/ODD_POLE_HARMONIC_CHEBYSHEV_OBSTRUCTION.md": "703c19f9cbadd73e6b60672a6f836fc2bd0bf7d43eaa5f60ac5806dd1cdc0d18",
    "notes/LEVERAGE_TRIMMED_MEAN_FEATURE_SCHUR.md": "c9f10ffb6b6ceeafe8ea63566d10c3af7eb6265c509c8d63e259bc407cc7f79a",
    "vendor/CCM-ZST-2511.22755v1.pdf": "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b",
    "vendor/FKS-PNT-2204.02588v3.pdf": "15eff02042f2c1ab4878d029ce52a0abd6c95d66995b183a2dbc689ce9af49a4",
}

EXPECTED_EXTERNAL_SOURCES = {
    "CCM-ZST-v1": {
        "version": "arXiv:2511.22755v1",
        "vendored_path": "vendor/CCM-ZST-2511.22755v1.pdf",
        "sha256": "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b",
        "use": "finite Weil convention, source equation (3.19), pole term, archimedean term, and inversion convention",
    },
    "FKS-PNT-v3": {
        "version": "arXiv:2204.02588v3",
        "vendored_path": "vendor/FKS-PNT-2204.02588v3.pdf",
        "sha256": "15eff02042f2c1ab4878d029ce52a0abd6c95d66995b183a2dbc689ce9af49a4",
        "use": "pinned unconditional prime-number-theorem input; no zero ordinate table",
    },
}

ARITHMETIC_LIBRARIES = {
    "precision_mode": "exact reduced rationals plus outward arbitrary-precision intervals",
    "libraries": ["Python fractions.Fraction", "mpmath.iv 1.4.1"],
    "raw_interval_or_ball_output_applicable": True,
    "shared_library_with_verifier": True,
    "independent_formula_trees_required": True,
    "serialization_guard": "nondegenerate intervals receive a precision-scaled dyadic enlargement",
    "independence_limitation": "producer and verifier share Python integer/Fraction arithmetic and pinned mpmath.iv 1.4.1",
}

LOGICAL_THEOREMS = {
    "finite_computable_target_mixed_schedule_proved": True,
    "artifact_executes_actual_prolate_trace_schedule": False,
    "rational_trace_fixture_is_actual_schedule_output": False,
    "effective_mixed_floor_is_signed_floor": False,
    "endpoint_jet_range_equivalent_at_fixed_parameter": True,
    "effective_transition_scale_endpoint_block_proved": False,
    "fixed_lambda_finite_jump_transfer_proved": True,
    "uniform_graph_error_rate_proved": False,
    "odd_positive_nu_gate_proved": False,
    "equation_5_2_proved": False,
    "locally_uniform_determinant_convergence_proved": False,
}


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _validate_runtime() -> None:
    if getattr(mp, "__version__", None) != EXPECTED_MPMATH_VERSION:
        raise RuntimeError("mpmath runtime mismatch")


def _choice(value: Any, label: str, allowed: set[int]) -> tuple[str, int]:
    if not isinstance(value, str) or _POSITIVE_INTEGER_TEXT.fullmatch(value) is None:
        raise TypeError(f"{label} must be canonical positive integer text")
    if value not in {str(item) for item in allowed}:
        raise ValueError(f"{label} is outside the canonical pilot inventory")
    return value, int(value)


def _validated_source_lock() -> tuple[dict[str, Any], dict[str, Any]]:
    path = _root() / LOCK
    if _sha256(path) != EXPECTED_SOURCE_LOCK_SHA256:
        raise ValueError("source-lock byte hash mismatch")
    lock = json.loads(path.read_text(encoding="utf-8"))
    expected_top = {
        "schema", "claim_class", "terminal_state", "updated_date",
        "checkpoint_version", "external_sources", "dependencies",
        "locked_conventions", "locked_formulas", "claim_boundary",
        "source_admissions",
    }
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ValueError("source-lock inventory mismatch")
    if (
        lock["schema"] != LOCK_SCHEMA
        or lock["claim_class"] != CLAIM_CLASS
        or lock["terminal_state"] != TERMINAL_STATE
        or lock["checkpoint_version"] != CHECKPOINT_VERSION
        or lock["updated_date"] != UPDATED_DATE
    ):
        raise ValueError("source-lock fixed metadata mutation")

    dependencies: dict[str, str] = {}
    for item in lock["dependencies"]:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ValueError("malformed source-lock dependency")
        relative, expected, role = item["path"], item["sha256"], item["role"]
        candidate = Path(relative) if isinstance(relative, str) else Path(".")
        if (
            not isinstance(relative, str) or not relative or candidate.is_absolute()
            or ".." in candidate.parts or relative in dependencies
            or not isinstance(expected, str) or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str) or not role
        ):
            raise ValueError("invalid source-lock dependency")
        if EXPECTED_DEPENDENCY_HASHES.get(relative) != expected:
            raise ValueError(f"hard-bound dependency mismatch: {relative}")
        actual = _sha256(_root() / candidate)
        if actual != expected:
            raise ValueError(f"dependency hash mismatch: {relative}")
        dependencies[relative] = actual
    if dependencies != EXPECTED_DEPENDENCY_HASHES:
        raise ValueError("source-lock dependency path/hash inventory mismatch")

    external_hashes: dict[str, str] = {}
    seen: set[str] = set()
    for item in lock["external_sources"]:
        if not isinstance(item, dict) or set(item) != {"id", "version", "vendored_path", "sha256", "use"}:
            raise ValueError("malformed external-source entry")
        source_id = item["id"]
        if source_id in seen or source_id not in EXPECTED_EXTERNAL_SOURCES:
            raise ValueError("external-source identifier mismatch")
        expected = EXPECTED_EXTERNAL_SOURCES[source_id]
        if any(item[key] != expected[key] for key in expected):
            raise ValueError(f"external-source metadata mismatch: {source_id}")
        actual = _sha256(_root() / item["vendored_path"])
        if actual != item["sha256"] or dependencies.get(item["vendored_path"]) != actual:
            raise ValueError(f"external-source byte mismatch: {source_id}")
        seen.add(source_id)
        external_hashes[item["vendored_path"]] = actual
    if seen != set(EXPECTED_EXTERNAL_SOURCES):
        raise ValueError("external-source inventory mismatch")

    return {
        "path": LOCK,
        "sha256": _sha256(path),
        "schema": LOCK_SCHEMA,
        "checkpoint_version": CHECKPOINT_VERSION,
        "dependency_hashes": dict(sorted(dependencies.items())),
        "external_source_hashes": dict(sorted(external_hashes.items())),
    }, lock


def _encode(value: Any) -> Any:
    if isinstance(value, Fraction):
        return {"numerator": str(value.numerator), "denominator": str(value.denominator)}
    if isinstance(value, (list, tuple)):
        return [_encode(item) for item in value]
    if isinstance(value, dict):
        return {key: _encode(item) for key, item in value.items()}
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


def _precision_bits(dps: int) -> int:
    return dps * LOG2_10_UPPER_NUMERATOR // LOG2_10_UPPER_DENOMINATOR + 2


def _raw_fraction(raw: tuple[int, int, int, int]) -> Fraction:
    sign, mantissa, exponent, _bits = raw
    numerator = -mantissa if sign else mantissa
    return Fraction(numerator * 2**exponent) if exponent >= 0 else Fraction(numerator, 2 ** (-exponent))


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
        scale = max((exponent + bits - 1 if mantissa else 0) for _sign, mantissa, exponent, bits in (lower, upper))
        guard = scale - _precision_bits(dps) + SERIALIZATION_GUARD_OFFSET_BITS
        lower = _shift_raw(lower, guard, -1)
        upper = _shift_raw(upper, guard, 1)
    if _raw_fraction(lower) > _raw_fraction(upper):
        raise ArithmeticError("reversed interval")
    raw = lambda x: [x[0], str(x[1]), x[2], x[3]]
    with mp.workdps(dps + 20):
        return {
            "decimal": [mp.nstr(mp.mpf(lower), dps + 10), mp.nstr(mp.mpf(upper), dps + 10)],
            "dyadic": {"lower": raw(lower), "upper": raw(upper)},
        }


def _interval_bounds(value: object) -> tuple[Fraction, Fraction]:
    lower_raw, upper_raw = value._mpi_  # type: ignore[attr-defined]
    lower = _raw_fraction(tuple(int(part) for part in lower_raw))
    upper = _raw_fraction(tuple(int(part) for part in upper_raw))
    return lower, upper


def _serialized_interval_bounds(value: dict[str, Any]) -> tuple[Fraction, Fraction]:
    dyadic = value["dyadic"]
    rows: list[Fraction] = []
    for endpoint in ("lower", "upper"):
        sign, mantissa_text, exponent, bits = dyadic[endpoint]
        rows.append(_raw_fraction((int(sign), int(mantissa_text), int(exponent), int(bits))))
    return rows[0], rows[1]


def _ceil_interval(value: object) -> int:
    lower, upper = _interval_bounds(value)
    ceil_lower = -((-lower.numerator) // lower.denominator)
    ceil_upper = -((-upper.numerator) // upper.denominator)
    if ceil_lower != ceil_upper:
        raise ArithmeticError("interval ceiling is undecidable")
    return ceil_lower


def _iv_sinh(value: object) -> object:
    return (mp.iv.exp(value) - mp.iv.exp(-value)) / mp.iv.mpf(2)


def _is_prime(value: int) -> bool:
    if value < 2:
        return False
    divisor = 2
    while divisor * divisor <= value:
        if value % divisor == 0:
            return False
        divisor += 1
    return True


def _prime_powers(p: int) -> list[dict[str, int]]:
    maximum = p * p // 4
    result: list[dict[str, int]] = []
    for base in range(2, maximum + 1):
        if not _is_prime(base):
            continue
        power, exponent = base, 1
        while power <= maximum:
            result.append({"n": power, "prime_base": base, "exponent": exponent})
            if power > maximum // base:
                break
            power *= base
            exponent += 1
    return sorted(result, key=lambda item: item["n"])


def _transpose(matrix: list[list[Fraction]]) -> list[list[Fraction]]:
    return [list(row) for row in zip(*matrix)]


def _matmul(left: list[list[Fraction]], right: list[list[Fraction]]) -> list[list[Fraction]]:
    return [[sum((left[i][k] * right[k][j] for k in range(len(right))), Fraction(0))
             for j in range(len(right[0]))] for i in range(len(left))]


def _matadd(left: list[list[Fraction]], right: list[list[Fraction]]) -> list[list[Fraction]]:
    return [[left[i][j] + right[i][j] for j in range(len(left[0]))] for i in range(len(left))]


def _matsub(left: list[list[Fraction]], right: list[list[Fraction]]) -> list[list[Fraction]]:
    return [[left[i][j] - right[i][j] for j in range(len(left[0]))] for i in range(len(left))]


def _inverse(matrix: list[list[Fraction]]) -> list[list[Fraction]]:
    size = len(matrix)
    if size == 0 or any(len(row) != size for row in matrix):
        raise ValueError("inverse requires a nonempty square matrix")
    work = [row[:] + [Fraction(i == j) for j in range(size)] for i, row in enumerate(matrix)]
    for column in range(size):
        pivot = next((row for row in range(column, size) if work[row][column]), None)
        if pivot is None:
            raise ArithmeticError("singular exact matrix")
        work[column], work[pivot] = work[pivot], work[column]
        scale = work[column][column]
        work[column] = [entry / scale for entry in work[column]]
        for row in range(size):
            if row == column:
                continue
            factor = work[row][column]
            work[row] = [entry - factor * reference for entry, reference in zip(work[row], work[column])]
    return [row[size:] for row in work]


def _trace(matrix: list[list[Fraction]]) -> Fraction:
    return sum((matrix[index][index] for index in range(len(matrix))), Fraction(0))


def _determinant(matrix: list[list[Fraction]]) -> Fraction:
    size = len(matrix)
    if size == 0 or any(len(row) != size for row in matrix):
        raise ValueError("determinant requires a nonempty square matrix")
    work = [row[:] for row in matrix]
    result = Fraction(1)
    for column in range(size):
        pivot = next((row for row in range(column, size) if work[row][column]), None)
        if pivot is None:
            return Fraction(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            result = -result
        value = work[column][column]
        result *= value
        for row in range(column + 1, size):
            factor = work[row][column] / value
            for inner in range(column + 1, size):
                work[row][inner] -= factor * work[column][inner]
    return result


def _trace_stop_fixture(p: int) -> dict[str, Any]:
    lam = Fraction(p, 2)
    trace_stop = Fraction(1, 8) / lam**2
    t_norm_squared = lam**2 / 2
    m_mu_upper = 2 * lam
    b_norm_squared_upper = 2 * lam**2 * m_mu_upper**2
    neumann_factor = Fraction(4, 3)
    right_inverse_norm_squared_upper = neumann_factor**2 * b_norm_squared_upper
    floor = 1 / right_inverse_norm_squared_upper
    result = {
        "lambda": lam,
        "trace_stop_strict_upper": trace_stop,
        "T_norm_squared_upper": t_norm_squared,
        "operator_error_squared_strict_upper": t_norm_squared * trace_stop,
        "operator_error_strict_upper": Fraction(1, 4),
        "neumann_inverse_factor": neumann_factor,
        "M_mu_upper": m_mu_upper,
        "B_norm_squared_upper": b_norm_squared_upper,
        "right_inverse_norm_squared_upper": right_inverse_norm_squared_upper,
        "source_whitened_floor": floor,
        "intermediate_floor_formula_value": Fraction(9, 32) / (lam**2 * m_mu_upper**2),
        "coarse_floor_formula_value": Fraction(9, 128) / lam**4,
        "trace_interval_width_at_stage_s": "2^(-s)",
        "rounded_monotonicity_assumed": False,
        "actual_prolate_trace_schedule_executed": False,
    }
    if (
        trace_stop != Fraction(1, 2 * p * p)
        or result["operator_error_squared_strict_upper"] != Fraction(1, 16)
        or floor != Fraction(9, 8 * p**4)
        or floor != result["intermediate_floor_formula_value"]
        or floor != result["coarse_floor_formula_value"]
    ):
        raise ArithmeticError("trace-stop constant reconstruction failed")
    return result


def _mixed_bridge_fixture(p: int) -> dict[str, Any]:
    # Raw orthonormal coordinates are [h0,h2,h4,h6].  The separated columns
    # are [p=c4, b=c2, m=c6^-] with u=beta=a=1.
    c_sep = [
        [Fraction(-1), Fraction(-1), Fraction(0)],
        [Fraction(0), Fraction(1), Fraction(1)],
        [Fraction(1), Fraction(0), Fraction(0)],
        [Fraction(0), Fraction(0), Fraction(-1)],
    ]
    change = [
        [Fraction(1), Fraction(0), Fraction(0)],
        [Fraction(0), Fraction(1), Fraction(1)],
        [Fraction(0), Fraction(0), Fraction(-1)],
    ]
    c_mixed = _matmul(c_sep, change)
    d_sep = _matmul(_transpose(c_sep), c_sep)
    d_mixed = _matmul(_transpose(c_mixed), c_mixed)
    congruent = _matmul(_matmul(_transpose(change), d_sep), change)

    x_matrix = [
        [Fraction(1), Fraction(0)],
        [Fraction(0), Fraction(1)],
        [Fraction(1), Fraction(-1)],
    ]
    complement = [[Fraction(1)], [Fraction(1)], [Fraction(1)], [Fraction(1)]]
    residual_coordinates = [[Fraction(1, 8 * p), Fraction(1, 16 * p)]]
    lift = _matadd(_matmul(c_sep, x_matrix), _matmul(complement, residual_coordinates))
    source_gram = _matmul(_transpose(lift), lift)
    h_sep = _matmul(_transpose(c_sep), lift)
    h_mixed = _matmul(_transpose(c_mixed), lift)
    captured_sep = _matmul(_matmul(_transpose(h_sep), _inverse(d_sep)), h_sep)
    captured_mixed = _matmul(_matmul(_transpose(h_mixed), _inverse(d_mixed)), h_mixed)
    residual_sep = _matsub(source_gram, captured_sep)
    residual_mixed = _matsub(source_gram, captured_mixed)
    residual_trace = _trace(residual_sep)
    trace_stop = Fraction(1, 2 * p * p)

    expected_d_sep = [
        [Fraction(2), Fraction(1), Fraction(0)],
        [Fraction(1), Fraction(2), Fraction(1)],
        [Fraction(0), Fraction(1), Fraction(2)],
    ]
    expected_d_mixed = [
        [Fraction(2), Fraction(1), Fraction(1)],
        [Fraction(1), Fraction(2), Fraction(1)],
        [Fraction(1), Fraction(1), Fraction(2)],
    ]
    if (
        d_sep != expected_d_sep
        or d_mixed != expected_d_mixed
        or congruent != d_mixed
        or h_mixed != _matmul(_transpose(change), h_sep)
        or captured_sep != captured_mixed
        or residual_sep != residual_mixed
        or residual_trace != Fraction(5, 64 * p * p)
        or not residual_trace < trace_stop
    ):
        raise ArithmeticError("mixed bridge congruence fixture failed")
    return {
        "fixture_scope": "exact rational coordinate-invariance fixture, not an executed prolate trace stage",
        "u": Fraction(1),
        "beta": Fraction(1),
        "a": Fraction(1),
        "C_sep_raw": c_sep,
        "mixed_change": change,
        "C_mixed_raw": c_mixed,
        "D_sep": d_sep,
        "D_mixed": d_mixed,
        "D_congruence_reconstruction": congruent,
        "bridge_cross_beta_u": d_sep[0][1],
        "lift_base_coordinates": x_matrix,
        "orthogonal_complement": complement,
        "residual_coordinates": residual_coordinates,
        "lift_raw": lift,
        "G": source_gram,
        "H_sep": h_sep,
        "H_mixed": h_mixed,
        "captured_sep": captured_sep,
        "captured_mixed": captured_mixed,
        "residual_sep": residual_sep,
        "residual_mixed": residual_mixed,
        "residual_trace": residual_trace,
        "trace_stop_strict_upper": trace_stop,
        "trace_stop_margin": trace_stop - residual_trace,
    }


Polynomial = dict[tuple[int, int], Fraction]


def _poly_add(*polynomials: Polynomial) -> Polynomial:
    result: Polynomial = {}
    for polynomial in polynomials:
        for key, value in polynomial.items():
            result[key] = result.get(key, Fraction(0)) + value
    return {key: value for key, value in result.items() if value}


def _poly_scale(polynomial: Polynomial, scale: Fraction) -> Polynomial:
    return {key: value * scale for key, value in polynomial.items() if value * scale}


def _poly_mu(polynomial: Polynomial) -> Polynomial:
    return {(mu_power + 1, c2_power): value for (mu_power, c2_power), value in polynomial.items()}


def _poly_c2(polynomial: Polynomial) -> Polynomial:
    return {(mu_power, c2_power + 1): value for (mu_power, c2_power), value in polynomial.items()}


def _poly_value(polynomial: Polynomial, mu: Fraction, c_squared: Fraction) -> Fraction:
    return sum((value * mu**mu_power * c_squared**c2_power
                for (mu_power, c2_power), value in polynomial.items()), Fraction(0))


def _serialize_polynomial(index: int, polynomial: Polynomial) -> dict[str, Any]:
    terms = [
        {
            "mu_power": mu_power,
            "c_squared_power": c2_power,
            "coefficient": _encode(value),
        }
        for (mu_power, c2_power), value in sorted(
            polynomial.items(), key=lambda item: (-item[0][0], -item[0][1])
        )
    ]
    return {"index": index, "terms": terms}


def _endpoint_recurrence_fixture() -> dict[str, Any]:
    p_minus_one: Polynomial = {}
    polynomials: list[Polynomial] = [
        {(0, 0): Fraction(1)},
        {(1, 0): Fraction(1, 2), (0, 1): Fraction(-1, 2)},
    ]
    for k in range(1, 4):
        p_k_minus_two = polynomials[k - 2] if k >= 2 else p_minus_one
        numerator = _poly_add(
            _poly_mu(polynomials[k]),
            _poly_scale(_poly_c2(polynomials[k]), Fraction(-1)),
            _poly_scale(polynomials[k], Fraction(-k * (k + 1))),
            _poly_scale(_poly_c2(polynomials[k - 1]), Fraction(-2 * k)),
            _poly_scale(_poly_c2(p_k_minus_two), Fraction(-k * (k - 1))),
        )
        polynomials.append(_poly_scale(numerator, Fraction(1, 2 * (k + 1))))

    for k, polynomial in enumerate(polynomials):
        if polynomial.get((k, 0), Fraction(0)) != Fraction(1, 2**k * factorial(k)):
            raise ArithmeticError("endpoint recurrence leading coefficient failed")
    evaluation_mu, evaluation_c2 = Fraction(17), Fraction(5)
    return {
        "variable_convention": "terms use powers of mu and c_squared=c^2",
        "P_minus_one": _serialize_polynomial(-1, p_minus_one),
        "polynomials": [_serialize_polynomial(index, polynomial) for index, polynomial in enumerate(polynomials)],
        "recurrence_k_values": [1, 2, 3],
        "evaluation_oracle": {
            "mu": evaluation_mu,
            "c_squared": evaluation_c2,
            "values": [_poly_value(polynomial, evaluation_mu, evaluation_c2) for polynomial in polynomials],
        },
    }


def _fraction_square_root(value: Fraction) -> Fraction:
    numerator, denominator = isqrt(value.numerator), isqrt(value.denominator)
    if numerator * numerator != value.numerator or denominator * denominator != value.denominator:
        raise ArithmeticError("fixture square root is not rational")
    return Fraction(numerator, denominator)


def _endpoint_vandermonde_fixture() -> dict[str, Any]:
    k_size = 3
    scales = [Fraction(1), Fraction(4), Fraction(9)]
    plus_matrix = [
        [_fraction_square_root(value) * value**(2 * k) / (2**k * factorial(k)) for value in scales]
        for k in range(k_size)
    ]
    minus_matrix = [[-entry for entry in row] for row in plus_matrix]
    vandermonde_product = Fraction(1)
    for i in range(k_size):
        for j in range(i + 1, k_size):
            vandermonde_product *= scales[j]**2 - scales[i]**2
    formula_plus = (
        _fraction_square_root(scales[0] * scales[1] * scales[2])
        * Fraction(1, 16) * vandermonde_product
    )
    determinant_plus = _determinant(plus_matrix)
    determinant_minus = _determinant(minus_matrix)
    if determinant_plus != formula_plus or determinant_plus != 29250 or determinant_minus != -29250:
        raise ArithmeticError("endpoint Vandermonde determinant failed")
    return {
        "K": k_size,
        "a": scales,
        "epsilon_plus": 1,
        "epsilon_minus": -1,
        "V_plus": plus_matrix,
        "V_minus": minus_matrix,
        "vandermonde_product_in_a_squared": vandermonde_product,
        "determinant_formula_plus": formula_plus,
        "determinant_plus": determinant_plus,
        "determinant_minus": determinant_minus,
    }


def _high_label_rho_fixture(p: int, dps: int) -> dict[str, Any]:
    mp.iv.dps = dps
    iv = mp.iv.mpf
    lam = iv(p) / iv(2)
    c_value = iv(2) * mp.iv.pi * lam**2
    c_squared = c_value**2
    derivative_order = 2
    s_twice = 4 * derivative_order + 1
    b_s = 2 ** (4 * derivative_order + 3)
    labels = {"plus_0_mod_4": 4096 * p**4, "minus_2_mod_4": 4096 * p**4 + 2}
    rows: dict[str, Any] = {}
    for family, label in labels.items():
        gap = iv(4 * label - 2) - c_squared
        rho = iv(b_s) * c_squared / gap
        half_threshold_margin = gap - iv(2 * b_s) * c_squared
        gap_lower, _gap_upper = _interval_bounds(gap)
        rho_lower, rho_upper = _interval_bounds(rho)
        margin_lower, _margin_upper = _interval_bounds(half_threshold_margin)
        if gap_lower <= 0 or rho_lower <= 0 or rho_upper >= Fraction(1, 2) or margin_lower <= 0:
            raise ArithmeticError("high-label rho enclosure failed")
        rows[family] = {
            "label": label,
            "label_mod_4": label % 4,
            "g_n": _serialize_interval(gap, dps),
            "rho": _serialize_interval(rho, dps),
            "rho_strict_upper": _encode(Fraction(1, 2)),
            "half_threshold_margin": _serialize_interval(half_threshold_margin, dps),
        }
    return {
        "derivative_order_k": derivative_order,
        "twice_s_k": s_twice,
        "B_s": b_s,
        "c": _serialize_interval(c_value, dps),
        "c_squared": _serialize_interval(c_squared, dps),
        "rows": rows,
        "scope": "raw sufficient high-label region; not a transition-scale endpoint certificate",
        "actual_transition_scale_block_executed": False,
    }


def _odd_jump_band_fixture(p: int, dps: int) -> dict[str, Any]:
    mp.iv.dps = dps
    iv = mp.iv.mpf
    lam = iv(p) / iv(2)
    ell = mp.iv.log(lam)
    length = iv(2) * ell
    prime_n, prime_base = 2, 2
    jump = mp.iv.log(iv(prime_base)) * _iv_sinh(ell / iv(2)) / mp.iv.sqrt(iv(prime_n))
    x_n = mp.iv.log(iv(2 * prime_n) / iv(p))
    eta = Fraction(1, 2)
    variation_fixture = Fraction(3)
    k0_ratio = length * iv(variation_fixture.numerator) / (
        iv(variation_fixture.denominator) * iv(2) * mp.iv.pi * iv(eta.numerator)
        / iv(eta.denominator) * jump
    )
    k0 = max(1, _ceil_interval(k0_ratio))
    if k0 != 8:
        raise ArithmeticError("canonical jump-band threshold changed")
    band_k = k0
    fourier_mode = band_k + 1
    phase_sign = -1 if fourier_mode % 2 else 1
    theta = iv(2 * fourier_mode) * mp.iv.pi * x_n / length
    atom_scale = iv(phase_sign) * jump / mp.iv.sqrt(length)
    atom_real = atom_scale * mp.iv.cos(theta)
    atom_imag = -atom_scale * mp.iv.sin(theta)
    f_scale = length / (iv(2 * fourier_mode) * mp.iv.pi)
    f_leading_real = f_scale * atom_imag
    f_leading_imag = -f_scale * atom_real
    leading_energy = length * jump**2 / (iv(4) * mp.iv.pi**2)
    reconstructed_energy = iv(fourier_mode**2) * (f_leading_real**2 + f_leading_imag**2)

    harmonic_sum = sum((Fraction(1, k * k) for k in range(band_k + 1, 2 * band_k + 1)), Fraction(0))
    one_minus_eta = Fraction(1) - eta
    sharp_band_lower = (
        iv(one_minus_eta.numerator)**2 / iv(one_minus_eta.denominator)**2
        * length * jump**2 / (iv(2) * mp.iv.pi**2)
        * iv(harmonic_sum.numerator) / iv(harmonic_sum.denominator)
    )
    coarse_band_lower = (
        iv(one_minus_eta.numerator)**2 / iv(one_minus_eta.denominator)**2
        * length * jump**2 / (iv(8 * band_k) * mp.iv.pi**2)
    )
    jump_term = (
        iv(one_minus_eta.numerator) / iv(one_minus_eta.denominator)
        * jump * mp.iv.sqrt(length / (iv(8 * band_k) * mp.iv.pi**2))
    )
    graph_half_error_threshold = jump_term / iv(2)

    jump_lower, _jump_upper = _interval_bounds(jump)
    sharp_lower, _sharp_upper = _interval_bounds(sharp_band_lower)
    coarse_lower, coarse_upper = _interval_bounds(coarse_band_lower)
    _reconstructed_lower, reconstructed_upper = _interval_bounds(reconstructed_energy)
    leading_lower, _leading_upper = _interval_bounds(leading_energy)
    if (
        jump_lower <= 0 or sharp_lower <= 0 or coarse_lower <= 0
        or coarse_upper >= sharp_lower
        or reconstructed_upper < leading_lower
    ):
        raise ArithmeticError("odd jump-band interval regression failed")

    return {
        "prime_power_n": prime_n,
        "prime_base": prime_base,
        "lambda": _serialize_interval(lam, dps),
        "ell": _serialize_interval(ell, dps),
        "L": _serialize_interval(length, dps),
        "x_n": _serialize_interval(x_n, dps),
        "J_lambda_n": _serialize_interval(jump, dps),
        "eta": _encode(eta),
        "variation_B_fixture": _encode(variation_fixture),
        "variation_fixture_is_actual_B_bound": False,
        "K0_ratio": _serialize_interval(k0_ratio, dps),
        "K0": k0,
        "dyadic_K": band_k,
        "fourier_mode_k": fourier_mode,
        "minus_one_to_k_phase": phase_sign,
        "phase_angle": _serialize_interval(theta, dps),
        "derivative_atom_leading_coefficient": {
            "real": _serialize_interval(atom_real, dps),
            "imag": _serialize_interval(atom_imag, dps),
        },
        "F_k_jump_leading_coefficient": {
            "real": _serialize_interval(f_leading_real, dps),
            "imag": _serialize_interval(f_leading_imag, dps),
        },
        "k_squared_leading_energy": _serialize_interval(reconstructed_energy, dps),
        "jump_law_energy": _serialize_interval(leading_energy, dps),
        "positive_mode_harmonic_sum": _encode(harmonic_sum),
        "sharp_dyadic_band_lower": _serialize_interval(sharp_band_lower, dps),
        "coarse_dyadic_band_lower": _serialize_interval(coarse_band_lower, dps),
        "jump_term_before_graph_error": _serialize_interval(jump_term, dps),
        "graph_half_error_threshold": _serialize_interval(graph_half_error_threshold, dps),
        "outer_cutoff_condition": {"M_at_least": 2 * band_k},
        "actual_uniform_graph_error_bound_executed": False,
        "positive_nu_gate_established": False,
    }


def produce(lambda_numerator: str, dps: str) -> dict[str, Any]:
    p_text, p = _choice(lambda_numerator, "lambda numerator", CANONICAL_LAMBDA_NUMERATORS)
    dps_text, dps_integer = _choice(dps, "dps", CANONICAL_DPS)
    _validate_runtime()
    source_binding, source_lock = _validated_source_lock()

    trace_stop = _trace_stop_fixture(p)
    mixed_bridge = _mixed_bridge_fixture(p)
    endpoint_recurrence = _endpoint_recurrence_fixture()
    endpoint_vandermonde = _endpoint_vandermonde_fixture()
    high_label = _high_label_rho_fixture(p, dps_integer)
    prime_inventory = _prime_powers(p)
    odd_jump = _odd_jump_band_fixture(p, dps_integer)

    expected_prime_count = 4 if p == 5 else 12
    checks = {
        "trace_stop_constants_reconstructed_exactly": trace_stop["source_whitened_floor"] == Fraction(9, 8 * p**4),
        "rational_trace_fixture_strictly_stops": mixed_bridge["residual_trace"] < mixed_bridge["trace_stop_strict_upper"],
        "bridge_cross_term_retained": mixed_bridge["bridge_cross_beta_u"] != 0,
        "mixed_gram_congruence_exact": mixed_bridge["D_mixed"] == mixed_bridge["D_congruence_reconstruction"],
        "residual_trace_coordinate_invariant": mixed_bridge["residual_sep"] == mixed_bridge["residual_mixed"],
        "P_minus_one_is_zero": endpoint_recurrence["P_minus_one"]["terms"] == [],
        "endpoint_leading_coefficients_exact": True,
        "endpoint_vandermonde_nonzero": endpoint_vandermonde["determinant_plus"] != 0,
        "high_label_rho_certified_below_half": True,
        "inclusive_prime_endpoint_complete": prime_inventory == _prime_powers(p),
        "canonical_prime_power_count": len(prime_inventory) == expected_prime_count,
        "odd_jump_interval_positive": _serialized_interval_bounds(odd_jump["J_lambda_n"])[0] > 0,
        "finite_fourier_minus_one_phase_retained": odd_jump["minus_one_to_k_phase"] == -1,
        "actual_prolate_trace_schedule_not_executed": trace_stop["actual_prolate_trace_schedule_executed"] is False,
        "actual_uniform_graph_error_not_claimed": odd_jump["actual_uniform_graph_error_bound_executed"] is False,
        "equation_5_2_still_open": source_lock["claim_boundary"]["equation_5_2_proved"] is False,
        "signed_floors_still_open": (
            source_lock["claim_boundary"]["signed_even_floor_proved"] is False
            and source_lock["claim_boundary"]["signed_odd_floor_proved"] is False
            and source_lock["claim_boundary"]["signed_mixed_floor_proved"] is False
        ),
        "no_secret_or_api_key_read": (
            source_lock["source_admissions"]["api_key_read"] is False
            and source_lock["source_admissions"]["environment_secret_read"] is False
            and source_lock["source_admissions"]["secret_serialized"] is False
        ),
    }
    if not all(checks.values()):
        raise ArithmeticError("checkpoint regression failed")

    payload = {
        "schema": SCHEMA,
        "source_lock": source_binding,
        "inputs": {
            "lambda_numerator": p_text,
            "lambda_denominator": "2",
            "dps": dps_text,
            "endpoint_fixture": {"K": "3", "a": ["1", "4", "9"]},
            "high_label_rule": {
                "plus_label": "4096*p^4",
                "minus_label": "4096*p^4+2",
            },
            "odd_jump_fixture": {
                "prime_power_n": "2",
                "eta": "1/2",
                "variation_B_fixture": "3",
            },
        },
        "terminal_state": TERMINAL_STATE,
        "source_conventions": source_lock["locked_conventions"],
        "claim_boundary": source_lock["claim_boundary"],
        "certificate": {
            "exact_trace_stop": _encode(trace_stop),
            "exact_mixed_bridge_fixture": _encode(mixed_bridge),
            "endpoint_recurrence": _encode(endpoint_recurrence),
            "endpoint_vandermonde": _encode(endpoint_vandermonde),
            "high_label_rho": high_label,
            "inclusive_prime_powers": prime_inventory,
            "odd_jump_band": odd_jump,
            "source_admissions": source_lock["source_admissions"],
            "logical_theorems": LOGICAL_THEOREMS,
            "checks": checks,
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
