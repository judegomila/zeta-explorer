#!/usr/bin/env python3
"""Independent replay for the effective-mixed/endpoint-jet/odd-jump checkpoint.

The verifier reconstructs every fixture from the locked integer parameter.  It
does not import the producer, accept cached matrices, or trust producer Boolean
claims.
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


PRODUCER_SCHEMA = "xi-prolate-effective-mixed-endpoint-jump-v1"
REPLAY_SCHEMA = "xi-prolate-effective-mixed-endpoint-jump-replay-v1"
LOCK = "EFFECTIVE_MIXED_ENDPOINT_JUMP_SOURCE_LOCK.json"
LOCK_SCHEMA = "xi-prolate-effective-mixed-endpoint-jump-source-lock-v1"
CLAIM_CLASS = "EFFECTIVE_MIXED_PREFIX_ENDPOINT_JET_ODD_JUMP_AUDIT"
TERMINAL_STATE = "P0_INVALIDATED"
UPDATED_DATE = "2026-08-08"
CHECKPOINT_VERSION = "0.42.0-effective-mixed-endpoint-jump"
EXPECTED_SOURCE_LOCK_SHA256 = "24ea8f8085e9e198201006f54e0499495174053e38f6c26185cd2b2f60725fcc"
EXPECTED_MPMATH_VERSION = "1.4.1"

CANONICAL_LAMBDA_NUMERATORS = {"5", "9"}
CANONICAL_DPS = {"80", "160"}
_POSITIVE_INTEGER_TEXT = re.compile(r"[1-9][0-9]*\Z")
_SHA256 = re.compile(r"[0-9a-f]{64}\Z")
_SECRET_VALUE = re.compile(
    r"(?:\bBearer\s+[A-Za-z0-9._-]+|\bsk-[A-Za-z0-9_-]{8,}|"
    r"\bgh[pousr]_[A-Za-z0-9_]{8,}|\bxox[baprs]-[A-Za-z0-9-]{8,}|"
    r"OPENAI_API_KEY\s*=)",
    re.IGNORECASE,
)

LOG2_10_UPPER_NUMERATOR = 3321928094887363
LOG2_10_UPPER_DENOMINATOR = 10**15

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
EXPECTED_DEPENDENCIES = set(EXPECTED_DEPENDENCY_HASHES)

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

EXPECTED_LIBRARIES = {
    "precision_mode": "exact reduced rationals plus outward arbitrary-precision intervals",
    "libraries": ["Python fractions.Fraction", "mpmath.iv 1.4.1"],
    "raw_interval_or_ball_output_applicable": True,
    "shared_library_with_verifier": True,
    "independent_formula_trees_required": True,
    "serialization_guard": "nondegenerate intervals receive a precision-scaled dyadic enlargement",
    "independence_limitation": "producer and verifier share Python integer/Fraction arithmetic and pinned mpmath.iv 1.4.1",
}

EXPECTED_LOGICAL_THEOREMS = {
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

EXPECTED_CHECK_KEYS = {
    "trace_stop_constants_reconstructed_exactly",
    "rational_trace_fixture_strictly_stops",
    "bridge_cross_term_retained",
    "mixed_gram_congruence_exact",
    "residual_trace_coordinate_invariant",
    "P_minus_one_is_zero",
    "endpoint_leading_coefficients_exact",
    "endpoint_vandermonde_nonzero",
    "high_label_rho_certified_below_half",
    "inclusive_prime_endpoint_complete",
    "canonical_prime_power_count",
    "odd_jump_interval_positive",
    "finite_fourier_minus_one_phase_retained",
    "actual_prolate_trace_schedule_not_executed",
    "actual_uniform_graph_error_not_claimed",
    "equation_5_2_still_open",
    "signed_floors_still_open",
    "no_secret_or_api_key_read",
}


class ReplayError(ValueError):
    """Raised when an artifact fails independent replay."""


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


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
    if not isinstance(value, dict) or set(value) != {"numerator", "denominator"}:
        raise ReplayError(f"malformed rational: {label}")
    numerator, denominator = value["numerator"], value["denominator"]
    if not isinstance(numerator, str) or not isinstance(denominator, str):
        raise ReplayError(f"non-text rational: {label}")
    try:
        result = Fraction(int(numerator), int(denominator))
    except (ValueError, ZeroDivisionError) as exc:
        raise ReplayError(f"invalid rational: {label}") from exc
    if str(result.numerator) != numerator or str(result.denominator) != denominator:
        raise ReplayError(f"noncanonical rational: {label}")
    return result


def _fraction_list(value: Any, length: int, label: str) -> list[Fraction]:
    if not isinstance(value, list) or len(value) != length:
        raise ReplayError(f"malformed vector: {label}")
    return [_fraction(item, f"{label}[{index}]") for index, item in enumerate(value)]


def _fraction_matrix(value: Any, rows: int, columns: int, label: str) -> list[list[Fraction]]:
    if not isinstance(value, list) or len(value) != rows:
        raise ReplayError(f"malformed matrix: {label}")
    return [_fraction_list(row, columns, f"{label}[{index}]") for index, row in enumerate(value)]


def _raw_fraction(value: Any, label: str) -> Fraction:
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
            raise ReplayError(f"noncanonical zero endpoint: {label}")
        return Fraction(0)
    if mantissa % 2 == 0 or bits != mantissa.bit_length():
        raise ReplayError(f"nonnormalized endpoint: {label}")
    numerator = -mantissa if sign else mantissa
    return Fraction(numerator * 2**exponent) if exponent >= 0 else Fraction(numerator, 2 ** (-exponent))


def _interval(value: Any, label: str, dps: int) -> tuple[Fraction, Fraction]:
    if not isinstance(value, dict) or set(value) != {"decimal", "dyadic"}:
        raise ReplayError(f"malformed interval: {label}")
    decimal, dyadic = value["decimal"], value["dyadic"]
    if not isinstance(decimal, list) or len(decimal) != 2 or not all(isinstance(item, str) for item in decimal):
        raise ReplayError(f"malformed decimal interval: {label}")
    if not isinstance(dyadic, dict) or set(dyadic) != {"lower", "upper"}:
        raise ReplayError(f"malformed dyadic interval: {label}")
    lo = _raw_fraction(dyadic["lower"], f"{label}.lower")
    hi = _raw_fraction(dyadic["upper"], f"{label}.upper")
    if lo > hi:
        raise ReplayError(f"reversed interval: {label}")
    try:
        decimal_lo, decimal_hi = mp.mpf(decimal[0]), mp.mpf(decimal[1])
    except ValueError as exc:
        raise ReplayError(f"unparseable decimal interval: {label}") from exc
    if not (mp.isfinite(decimal_lo) and mp.isfinite(decimal_hi)) or decimal_lo > decimal_hi:
        raise ReplayError(f"invalid decimal interval: {label}")
    scale = max(
        abs(lo.numerator).bit_length() - lo.denominator.bit_length(),
        abs(hi.numerator).bit_length() - hi.denominator.bit_length(),
        0,
    )
    digits_bits = dps * LOG2_10_UPPER_NUMERATOR // LOG2_10_UPPER_DENOMINATOR
    cap_exponent = scale - digits_bits + 24
    cap = Fraction(2**cap_exponent) if cap_exponent >= 0 else Fraction(1, 2 ** (-cap_exponent))
    if hi - lo > cap:
        raise ReplayError(f"overwide interval: {label}")
    return lo, hi


def _iv_bounds(value: object) -> tuple[Fraction, Fraction]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]

    def convert(raw: object) -> Fraction:
        sign, mantissa, exponent, _bits = (int(part) for part in raw)  # type: ignore[arg-type]
        numerator = -mantissa if sign else mantissa
        return Fraction(numerator * 2**exponent) if exponent >= 0 else Fraction(numerator, 2 ** (-exponent))

    return convert(lower), convert(upper)


def _contains(serialized: Any, expected: object, label: str, dps: int) -> None:
    lo, hi = _interval(serialized, label, dps)
    expected_lo, expected_hi = _iv_bounds(expected)
    if lo > expected_lo or hi < expected_hi:
        raise ReplayError(f"interval does not enclose independent reconstruction: {label}")


def _validate_lock() -> tuple[dict[str, Any], dict[str, Any]]:
    path = _root() / LOCK
    if _sha256(path) != EXPECTED_SOURCE_LOCK_SHA256:
        raise ReplayError("source-lock byte hash mismatch")
    lock = json.loads(path.read_text(encoding="utf-8"))
    expected_top = {
        "schema", "claim_class", "terminal_state", "updated_date", "checkpoint_version",
        "external_sources", "dependencies", "locked_conventions", "locked_formulas",
        "claim_boundary", "source_admissions",
    }
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ReplayError("source-lock inventory mismatch")
    if (
        lock["schema"] != LOCK_SCHEMA
        or lock["claim_class"] != CLAIM_CLASS
        or lock["terminal_state"] != TERMINAL_STATE
        or lock["updated_date"] != UPDATED_DATE
        or lock["checkpoint_version"] != CHECKPOINT_VERSION
    ):
        raise ReplayError("source-lock fixed metadata mutation")

    dependencies: dict[str, str] = {}
    if not isinstance(lock["dependencies"], list):
        raise ReplayError("source-lock dependency list missing")
    for item in lock["dependencies"]:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ReplayError("malformed source-lock dependency")
        relative, expected, role = item["path"], item["sha256"], item["role"]
        candidate = Path(relative) if isinstance(relative, str) else Path(".")
        if (
            not isinstance(relative, str) or not relative or candidate.is_absolute()
            or ".." in candidate.parts or relative in dependencies
            or not isinstance(expected, str) or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str) or not role
        ):
            raise ReplayError("invalid source-lock dependency")
        if EXPECTED_DEPENDENCY_HASHES.get(relative) != expected:
            raise ReplayError(f"hard-bound dependency mismatch: {relative}")
        actual = _sha256(_root() / candidate)
        if actual != expected:
            raise ReplayError(f"dependency hash mismatch: {relative}")
        dependencies[relative] = actual
    if dependencies != EXPECTED_DEPENDENCY_HASHES:
        raise ReplayError("source-lock dependency path/hash inventory mismatch")

    external_hashes: dict[str, str] = {}
    seen: set[str] = set()
    if not isinstance(lock["external_sources"], list):
        raise ReplayError("source-lock external-source list missing")
    for item in lock["external_sources"]:
        if not isinstance(item, dict) or set(item) != {"id", "version", "vendored_path", "sha256", "use"}:
            raise ReplayError("malformed external-source entry")
        source_id = item["id"]
        if source_id in seen or source_id not in EXPECTED_EXTERNAL_SOURCES:
            raise ReplayError("external-source identifier mismatch")
        expected = EXPECTED_EXTERNAL_SOURCES[source_id]
        if any(item[key] != expected[key] for key in expected):
            raise ReplayError(f"external-source metadata mismatch: {source_id}")
        actual = _sha256(_root() / item["vendored_path"])
        if actual != item["sha256"] or dependencies.get(item["vendored_path"]) != actual:
            raise ReplayError(f"external-source byte mismatch: {source_id}")
        seen.add(source_id)
        external_hashes[item["vendored_path"]] = actual
    if seen != set(EXPECTED_EXTERNAL_SOURCES):
        raise ReplayError("external-source inventory mismatch")

    binding = {
        "path": LOCK,
        "sha256": EXPECTED_SOURCE_LOCK_SHA256,
        "schema": LOCK_SCHEMA,
        "checkpoint_version": CHECKPOINT_VERSION,
        "dependency_hashes": dict(sorted(dependencies.items())),
        "external_source_hashes": dict(sorted(external_hashes.items())),
    }
    return binding, lock


def _matmul(left: list[list[Fraction]], right: list[list[Fraction]]) -> list[list[Fraction]]:
    if not left or not right or len(left[0]) != len(right):
        raise ReplayError("internal matrix dimension mismatch")
    return [
        [sum((left[i][k] * right[k][j] for k in range(len(right))), Fraction(0)) for j in range(len(right[0]))]
        for i in range(len(left))
    ]


def _transpose(matrix: list[list[Fraction]]) -> list[list[Fraction]]:
    return [list(row) for row in zip(*matrix)]


def _add(left: list[list[Fraction]], right: list[list[Fraction]]) -> list[list[Fraction]]:
    return [[a + b for a, b in zip(row_a, row_b)] for row_a, row_b in zip(left, right)]


def _inverse(matrix: list[list[Fraction]]) -> list[list[Fraction]]:
    size = len(matrix)
    if size == 0 or any(len(row) != size for row in matrix):
        raise ReplayError("internal inverse dimension mismatch")
    augmented = [row[:] + [Fraction(int(i == j)) for j in range(size)] for i, row in enumerate(matrix)]
    for column in range(size):
        pivot = next((row for row in range(column, size) if augmented[row][column]), None)
        if pivot is None:
            raise ReplayError("singular exact fixture")
        augmented[column], augmented[pivot] = augmented[pivot], augmented[column]
        scale = augmented[column][column]
        augmented[column] = [entry / scale for entry in augmented[column]]
        for row in range(size):
            if row == column:
                continue
            factor = augmented[row][column]
            augmented[row] = [a - factor * b for a, b in zip(augmented[row], augmented[column])]
    return [row[size:] for row in augmented]


def _prime_power_inventory(p: int) -> list[dict[str, Any]]:
    endpoint_numerator = p * p
    endpoint_denominator = 4
    limit = endpoint_numerator // endpoint_denominator
    rows: list[dict[str, Any]] = []
    for n in range(2, limit + 1):
        base = 0
        exponent = 0
        for candidate in range(2, n + 1):
            is_prime = True
            divisor = 2
            while divisor * divisor <= candidate:
                if candidate % divisor == 0:
                    is_prime = False
                    break
                divisor += 1
            if not is_prime:
                continue
            value = candidate
            power = 1
            while value < n:
                value *= candidate
                power += 1
            if value == n:
                base, exponent = candidate, power
                break
        if base:
            rows.append({"n": n, "prime_base": base, "exponent": exponent})
    return rows


def _dot(left: list[Fraction], right: list[Fraction]) -> Fraction:
    return sum((a * b for a, b in zip(left, right)), Fraction(0))


def _columns_to_matrix(columns: list[list[Fraction]]) -> list[list[Fraction]]:
    return [list(row) for row in zip(*columns)]


def _trace(matrix: list[list[Fraction]]) -> Fraction:
    return sum((matrix[index][index] for index in range(len(matrix))), Fraction(0))


def _subtract(left: list[list[Fraction]], right: list[list[Fraction]]) -> list[list[Fraction]]:
    return [[a - b for a, b in zip(row_a, row_b)] for row_a, row_b in zip(left, right)]


def _mixed_reconstruction(p: int) -> dict[str, Any]:
    # Reconstruct the separated synthesis from source-coordinate columns,
    # rather than starting from either producer Gram.
    separated_columns = [
        [Fraction(-1), Fraction(0), Fraction(1), Fraction(0)],
        [Fraction(-1), Fraction(1), Fraction(0), Fraction(0)],
        [Fraction(0), Fraction(1), Fraction(0), Fraction(-1)],
    ]
    c_sep = _columns_to_matrix(separated_columns)
    d_sep = [[_dot(left, right) for right in separated_columns] for left in separated_columns]
    transform = [
        [Fraction(1), Fraction(0), Fraction(0)],
        [Fraction(0), Fraction(1), Fraction(1)],
        [Fraction(0), Fraction(0), Fraction(-1)],
    ]
    c_ord = _matmul(c_sep, transform)
    d_ord = _matmul(_transpose(c_ord), c_ord)
    d_ord_congruence = _matmul(_matmul(_transpose(transform), d_sep), transform)

    x_map = [
        [Fraction(1), Fraction(0)],
        [Fraction(0), Fraction(1)],
        [Fraction(1), Fraction(-1)],
    ]
    q = [[Fraction(1)], [Fraction(1)], [Fraction(1)], [Fraction(1)]]
    r = [[Fraction(1, 8 * p), Fraction(1, 16 * p)]]
    lift = _add(_matmul(c_sep, x_map), _matmul(q, r))
    gram = _matmul(_transpose(lift), lift)

    h_sep = _matmul(_transpose(c_sep), lift)
    captured_sep = _matmul(_matmul(_transpose(h_sep), _inverse(d_sep)), h_sep)
    residual_sep = _subtract(gram, captured_sep)

    h_ord = _matmul(_transpose(c_ord), lift)
    captured_ord = _matmul(_matmul(_transpose(h_ord), _inverse(d_ord)), h_ord)
    residual_ord = _subtract(gram, captured_ord)

    projector_sep = _matmul(_matmul(c_sep, _inverse(d_sep)), _transpose(c_sep))
    identity4 = [[Fraction(int(i == j)) for j in range(4)] for i in range(4)]
    residual_direct = _matmul(
        _matmul(_transpose(lift), _subtract(identity4, projector_sep)),
        lift,
    )
    residual_trace = _trace(residual_direct)
    threshold = Fraction(1, 2 * p * p)
    return {
        "C_sep": c_sep,
        "D_sep": d_sep,
        "S": transform,
        "C_ord": c_ord,
        "D_ord": d_ord,
        "D_ord_congruence": d_ord_congruence,
        "X": x_map,
        "q": [row[0] for row in q],
        "r": r[0],
        "B": lift,
        "G": gram,
        "H_sep": h_sep,
        "H_ord": h_ord,
        "residual_sep": residual_sep,
        "residual_ord": residual_ord,
        "residual_direct": residual_direct,
        "residual_trace": residual_trace,
        "trace_stop_threshold": threshold,
        "trace_stop_margin": threshold - residual_trace,
    }


Polynomial = dict[tuple[int, int], Fraction]


def _poly_add(*terms: Polynomial) -> Polynomial:
    output: Polynomial = {}
    for term in terms:
        for monomial, coefficient in term.items():
            output[monomial] = output.get(monomial, Fraction(0)) + coefficient
    return {key: value for key, value in output.items() if value}


def _poly_scale(term: Polynomial, scalar: Fraction) -> Polynomial:
    return {key: scalar * value for key, value in term.items() if scalar * value}


def _poly_mul(term: Polynomial, factor: Polynomial) -> Polynomial:
    output: Polynomial = {}
    for (mu_a, c_a), value_a in term.items():
        for (mu_b, c_b), value_b in factor.items():
            key = (mu_a + mu_b, c_a + c_b)
            output[key] = output.get(key, Fraction(0)) + value_a * value_b
    return {key: value for key, value in output.items() if value}


def _endpoint_polynomials(maximum_k: int = 4) -> list[Polynomial]:
    # The second exponent is the exponent of c^2, not c.
    mu_minus_c2 = {(1, 0): Fraction(1), (0, 1): Fraction(-1)}
    polynomials: list[Polynomial] = [{(0, 0): Fraction(1)}, _poly_scale(mu_minus_c2, Fraction(1, 2))]
    for k in range(1, maximum_k):
        factor = _poly_add(mu_minus_c2, {(0, 0): Fraction(-k * (k + 1))})
        numerator = _poly_mul(factor, polynomials[k])
        numerator = _poly_add(
            numerator,
            _poly_scale(_poly_mul({(0, 1): Fraction(1)}, polynomials[k - 1]), Fraction(-2 * k)),
        )
        # P_{-1}=0 makes the k=1 term identically absent.
        if k >= 2:
            numerator = _poly_add(
                numerator,
                _poly_scale(_poly_mul({(0, 1): Fraction(1)}, polynomials[k - 2]), Fraction(-k * (k - 1))),
            )
        polynomials.append(_poly_scale(numerator, Fraction(1, 2 * (k + 1))))
    return polynomials


def _poly_rows(polynomial: Polynomial) -> list[dict[str, Any]]:
    return [
        {"mu_power": mu_power, "c2_power": c2_power, "coefficient": coefficient}
        for (mu_power, c2_power), coefficient in sorted(polynomial.items(), reverse=True)
    ]


def _determinant(matrix: list[list[Fraction]]) -> Fraction:
    work = [row[:] for row in matrix]
    determinant = Fraction(1)
    for column in range(len(work)):
        pivot = next((row for row in range(column, len(work)) if work[row][column]), None)
        if pivot is None:
            return Fraction(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            determinant = -determinant
        pivot_value = work[column][column]
        determinant *= pivot_value
        for row in range(column + 1, len(work)):
            factor = work[row][column] / pivot_value
            for inner in range(column + 1, len(work)):
                work[row][inner] -= factor * work[column][inner]
    return determinant


def _vandermonde_reconstruction(sign: int) -> dict[str, Any]:
    square_roots = [1, 2, 3]
    labels = [1, 4, 9]
    matrix = [
        [Fraction(sign * square_roots[column] * labels[column] ** (2 * row), 2**row * _factorial(row)) for column in range(3)]
        for row in range(3)
    ]
    direct = _determinant(matrix)
    product = Fraction(sign**3)
    for root in square_roots:
        product *= root
    for row in range(3):
        product /= 2**row * _factorial(row)
    for i in range(3):
        for j in range(i + 1, 3):
            product *= labels[j] ** 2 - labels[i] ** 2
    return {"epsilon": sign, "a": labels, "matrix": matrix, "determinant_direct": direct, "determinant_product": product}


def _factorial(value: int) -> int:
    result = 1
    for integer in range(2, value + 1):
        result *= integer
    return result


def _high_label_values(p: int) -> dict[str, object]:
    iv = mp.iv.mpf
    p_iv = iv(p)
    c_squared = mp.iv.pi**2 * p_iv**4 / iv(4)
    b_s = 2048
    plus_label = 4096 * p**4
    minus_label = plus_label + 2

    def row(label: int) -> dict[str, object]:
        gap = iv(4 * label - 2) - c_squared
        rho = iv(b_s) * c_squared / gap
        return {"label": label, "gap": gap, "rho": rho, "half_gap": iv(1) / 2 - rho}

    return {
        "k": 2,
        "s_numerator": 9,
        "s_denominator": 2,
        "B_s": b_s,
        "c_squared": c_squared,
        "plus": row(plus_label),
        "minus": row(minus_label),
    }


def _odd_jump_values(p: int) -> dict[str, object]:
    iv = mp.iv.mpf

    def iv_fraction(value: Fraction) -> object:
        return iv(value.numerator) / iv(value.denominator)

    lam = iv(p) / 2
    ell = mp.iv.log(lam)
    length = 2 * ell
    log2 = mp.iv.log(iv(2))
    half_ell = ell / 2
    sinh_half = (mp.iv.exp(half_ell) - mp.iv.exp(-half_ell)) / 2
    jump = log2 * sinh_half / mp.iv.sqrt(iv(2))
    eta = Fraction(1, 2)
    variation_fixture = 3
    threshold_real = length * variation_fixture / (2 * mp.iv.pi * iv(eta.numerator) / eta.denominator * jump)
    threshold_lo, threshold_hi = _iv_bounds(threshold_real)
    threshold_integer = (threshold_hi.numerator + threshold_hi.denominator - 1) // threshold_hi.denominator
    threshold_integer = max(1, threshold_integer)
    band_k = 8
    mode_k = 9
    x_n = mp.iv.log(iv(2) / lam)
    kappa = 2 * mp.iv.pi * mode_k / length
    theta = kappa * x_n
    phase_sign = -1
    atom_real = phase_sign * jump * mp.iv.cos(theta) / mp.iv.sqrt(length)
    atom_imag = -phase_sign * jump * mp.iv.sin(theta) / mp.iv.sqrt(length)
    leading_real = atom_imag / kappa
    leading_imag = -atom_real / kappa
    asymptotic_constant = length * jump**2 / (4 * mp.iv.pi**2)
    sum_inverse_squares = sum((Fraction(1, integer * integer) for integer in range(band_k + 1, 2 * band_k + 1)), Fraction(0))
    eta_complement_squared = (1 - eta) ** 2
    sharp_lower = (
        iv_fraction(eta_complement_squared) * length * jump**2
        / (2 * mp.iv.pi**2) * iv_fraction(sum_inverse_squares)
    )
    coarse_lower = (
        iv_fraction(eta_complement_squared) * length * jump**2
        / (8 * mp.iv.pi**2 * band_k)
    )
    return {
        "ell": ell,
        "L": length,
        "n": 2,
        "x_n": x_n,
        "jump": jump,
        "eta": eta,
        "B_fixture": variation_fixture,
        "threshold_real": threshold_real,
        "K0": threshold_integer,
        "K": band_k,
        "mode_k": mode_k,
        "phase_sign": phase_sign,
        "kappa": kappa,
        "atom_real": atom_real,
        "atom_imag": atom_imag,
        "leading_real": leading_real,
        "leading_imag": leading_imag,
        "asymptotic_constant": asymptotic_constant,
        "sum_inverse_squares": sum_inverse_squares,
        "sharp_lower": sharp_lower,
        "coarse_lower": coarse_lower,
    }


def _require_keys(value: Any, expected: set[str], label: str) -> dict[str, Any]:
    if not isinstance(value, dict) or set(value) != expected:
        raise ReplayError(f"{label} inventory mismatch")
    return value


def _check_rational(value: Any, expected: Fraction, label: str) -> None:
    if _fraction(value, label) != expected:
        raise ReplayError(f"exact rational mutation: {label}")


def _check_matrix(value: Any, expected: list[list[Fraction]], label: str) -> None:
    rows = len(expected)
    columns = len(expected[0]) if expected else 0
    if _fraction_matrix(value, rows, columns, label) != expected:
        raise ReplayError(f"exact matrix mutation: {label}")


def _check_vector(value: Any, expected: list[Fraction], label: str) -> None:
    if _fraction_list(value, len(expected), label) != expected:
        raise ReplayError(f"exact vector mutation: {label}")


def _validate_inputs(value: Any) -> tuple[str, int, str, int]:
    inputs = _require_keys(
        value,
        {
            "lambda_numerator", "lambda_denominator", "dps", "endpoint_fixture",
            "high_label_rule", "odd_jump_fixture",
        },
        "inputs",
    )
    p_text, denominator, dps_text = inputs["lambda_numerator"], inputs["lambda_denominator"], inputs["dps"]
    if (
        not isinstance(p_text, str) or p_text not in CANONICAL_LAMBDA_NUMERATORS
        or _POSITIVE_INTEGER_TEXT.fullmatch(p_text) is None
        or denominator != "2"
        or not isinstance(dps_text, str) or dps_text not in CANONICAL_DPS
        or _POSITIVE_INTEGER_TEXT.fullmatch(dps_text) is None
    ):
        raise ReplayError("noncanonical pilot inputs")
    if inputs["endpoint_fixture"] != {"K": "3", "a": ["1", "4", "9"]}:
        raise ReplayError("endpoint fixture input mutation")
    if inputs["high_label_rule"] != {"plus_label": "4096*p^4", "minus_label": "4096*p^4+2"}:
        raise ReplayError("high-label rule mutation")
    if inputs["odd_jump_fixture"] != {"prime_power_n": "2", "eta": "1/2", "variation_B_fixture": "3"}:
        raise ReplayError("odd-jump fixture input mutation")
    return p_text, int(p_text), dps_text, int(dps_text)


def _check_trace_stop(value: Any, p: int) -> None:
    fixture = _require_keys(
        value,
        {
            "lambda", "trace_stop_strict_upper", "T_norm_squared_upper",
            "operator_error_squared_strict_upper", "operator_error_strict_upper",
            "neumann_inverse_factor", "M_mu_upper", "B_norm_squared_upper",
            "right_inverse_norm_squared_upper", "source_whitened_floor",
            "intermediate_floor_formula_value", "coarse_floor_formula_value",
            "trace_interval_width_at_stage_s", "rounded_monotonicity_assumed",
            "actual_prolate_trace_schedule_executed",
        },
        "exact_trace_stop",
    )
    expected = {
        "lambda": Fraction(p, 2),
        "trace_stop_strict_upper": Fraction(1, 2 * p * p),
        "T_norm_squared_upper": Fraction(p * p, 8),
        "operator_error_squared_strict_upper": Fraction(1, 16),
        "operator_error_strict_upper": Fraction(1, 4),
        "neumann_inverse_factor": Fraction(4, 3),
        "M_mu_upper": Fraction(p),
        "B_norm_squared_upper": Fraction(p**4, 2),
        "right_inverse_norm_squared_upper": Fraction(8 * p**4, 9),
        "source_whitened_floor": Fraction(9, 8 * p**4),
        "intermediate_floor_formula_value": Fraction(9, 8 * p**4),
        "coarse_floor_formula_value": Fraction(9, 8 * p**4),
    }
    for key, expected_value in expected.items():
        _check_rational(fixture[key], expected_value, f"exact_trace_stop.{key}")
    if fixture["trace_interval_width_at_stage_s"] != "2^(-s)":
        raise ReplayError("trace interval-width rule mutation")
    if fixture["rounded_monotonicity_assumed"] is not False:
        raise ReplayError("rounded monotonicity was assumed")
    if fixture["actual_prolate_trace_schedule_executed"] is not False:
        raise ReplayError("rational fixture substituted for an actual trace schedule")


def _check_mixed_bridge(value: Any, p: int) -> None:
    fixture = _require_keys(
        value,
        {
            "fixture_scope", "u", "beta", "a", "C_sep_raw", "mixed_change",
            "C_mixed_raw", "D_sep", "D_mixed", "D_congruence_reconstruction",
            "bridge_cross_beta_u", "lift_base_coordinates", "orthogonal_complement",
            "residual_coordinates", "lift_raw", "G", "H_sep", "H_mixed",
            "captured_sep", "captured_mixed", "residual_sep", "residual_mixed",
            "residual_trace", "trace_stop_strict_upper", "trace_stop_margin",
        },
        "exact_mixed_bridge_fixture",
    )
    if fixture["fixture_scope"] != "exact rational coordinate-invariance fixture, not an executed prolate trace stage":
        raise ReplayError("mixed fixture scope mutation")
    for key in ("u", "beta", "a", "bridge_cross_beta_u"):
        _check_rational(fixture[key], Fraction(1), f"exact_mixed_bridge_fixture.{key}")

    expected = _mixed_reconstruction(p)
    mappings = {
        "C_sep_raw": "C_sep",
        "mixed_change": "S",
        "C_mixed_raw": "C_ord",
        "D_sep": "D_sep",
        "D_mixed": "D_ord",
        "D_congruence_reconstruction": "D_ord_congruence",
        "lift_base_coordinates": "X",
        "lift_raw": "B",
        "G": "G",
        "H_sep": "H_sep",
        "H_mixed": "H_ord",
        "residual_sep": "residual_sep",
        "residual_mixed": "residual_ord",
    }
    for serialized_name, local_name in mappings.items():
        _check_matrix(fixture[serialized_name], expected[local_name], f"exact_mixed_bridge_fixture.{serialized_name}")
    _check_matrix(
        fixture["orthogonal_complement"],
        [[entry] for entry in expected["q"]],
        "exact_mixed_bridge_fixture.orthogonal_complement",
    )
    _check_matrix(
        fixture["residual_coordinates"],
        [expected["r"]],
        "exact_mixed_bridge_fixture.residual_coordinates",
    )
    captured_sep = _subtract(expected["G"], expected["residual_sep"])
    captured_ord = _subtract(expected["G"], expected["residual_ord"])
    _check_matrix(fixture["captured_sep"], captured_sep, "exact_mixed_bridge_fixture.captured_sep")
    _check_matrix(fixture["captured_mixed"], captured_ord, "exact_mixed_bridge_fixture.captured_mixed")
    _check_rational(fixture["residual_trace"], expected["residual_trace"], "exact_mixed_bridge_fixture.residual_trace")
    _check_rational(
        fixture["trace_stop_strict_upper"], expected["trace_stop_threshold"],
        "exact_mixed_bridge_fixture.trace_stop_strict_upper",
    )
    _check_rational(fixture["trace_stop_margin"], expected["trace_stop_margin"], "exact_mixed_bridge_fixture.trace_stop_margin")
    if expected["residual_sep"] != expected["residual_direct"] or expected["residual_trace"] <= 0 or expected["trace_stop_margin"] <= 0:
        raise ReplayError("independent bridge residual or strict trace margin failed")


def _parse_polynomial(value: Any, index: int, label: str) -> Polynomial:
    record = _require_keys(value, {"index", "terms"}, label)
    if record["index"] != index or not isinstance(record["terms"], list):
        raise ReplayError(f"polynomial index/terms mutation: {label}")
    polynomial: Polynomial = {}
    for term_index, term_value in enumerate(record["terms"]):
        term = _require_keys(
            term_value,
            {"mu_power", "c_squared_power", "coefficient"},
            f"{label}.terms[{term_index}]",
        )
        mu_power, c_power = term["mu_power"], term["c_squared_power"]
        if type(mu_power) is not int or type(c_power) is not int or mu_power < 0 or c_power < 0:
            raise ReplayError(f"invalid polynomial exponent: {label}")
        monomial = (mu_power, c_power)
        if monomial in polynomial:
            raise ReplayError(f"duplicate polynomial monomial: {label}")
        coefficient = _fraction(term["coefficient"], f"{label}.terms[{term_index}].coefficient")
        if coefficient == 0:
            raise ReplayError(f"serialized zero polynomial term: {label}")
        polynomial[monomial] = coefficient
    return polynomial


def _evaluate_polynomial(polynomial: Polynomial, mu: Fraction, c_squared: Fraction) -> Fraction:
    return sum(
        (coefficient * mu**mu_power * c_squared**c_power for (mu_power, c_power), coefficient in polynomial.items()),
        Fraction(0),
    )


def _check_endpoint_recurrence(value: Any) -> None:
    fixture = _require_keys(
        value,
        {"variable_convention", "P_minus_one", "polynomials", "recurrence_k_values", "evaluation_oracle"},
        "endpoint_recurrence",
    )
    if fixture["variable_convention"] != "terms use powers of mu and c_squared=c^2":
        raise ReplayError("endpoint variable convention mutation")
    if _parse_polynomial(fixture["P_minus_one"], -1, "endpoint_recurrence.P_minus_one"):
        raise ReplayError("P_minus_one must be exactly zero")
    if fixture["recurrence_k_values"] != [1, 2, 3]:
        raise ReplayError("endpoint recurrence index mutation")
    if not isinstance(fixture["polynomials"], list) or len(fixture["polynomials"]) != 5:
        raise ReplayError("endpoint polynomial inventory mismatch")
    actual = [
        _parse_polynomial(item, index, f"endpoint_recurrence.polynomials[{index}]")
        for index, item in enumerate(fixture["polynomials"])
    ]
    expected = _endpoint_polynomials(4)
    if actual != expected:
        raise ReplayError("endpoint recurrence polynomial mutation")
    for index, polynomial in enumerate(actual):
        if polynomial.get((index, 0)) != Fraction(1, 2**index * _factorial(index)):
            raise ReplayError("endpoint leading coefficient mutation")
    oracle = _require_keys(fixture["evaluation_oracle"], {"mu", "c_squared", "values"}, "endpoint_recurrence.evaluation_oracle")
    _check_rational(oracle["mu"], Fraction(17), "endpoint_recurrence.evaluation_oracle.mu")
    _check_rational(oracle["c_squared"], Fraction(5), "endpoint_recurrence.evaluation_oracle.c_squared")
    expected_values = [_evaluate_polynomial(polynomial, Fraction(17), Fraction(5)) for polynomial in expected]
    _check_vector(oracle["values"], expected_values, "endpoint_recurrence.evaluation_oracle.values")


def _check_endpoint_vandermonde(value: Any) -> None:
    fixture = _require_keys(
        value,
        {
            "K", "a", "epsilon_plus", "epsilon_minus", "V_plus", "V_minus",
            "vandermonde_product_in_a_squared", "determinant_formula_plus",
            "determinant_plus", "determinant_minus",
        },
        "endpoint_vandermonde",
    )
    if fixture["K"] != 3 or fixture["epsilon_plus"] != 1 or fixture["epsilon_minus"] != -1:
        raise ReplayError("endpoint Vandermonde metadata mutation")
    _check_vector(fixture["a"], [Fraction(1), Fraction(4), Fraction(9)], "endpoint_vandermonde.a")
    plus = _vandermonde_reconstruction(1)
    minus = _vandermonde_reconstruction(-1)
    _check_matrix(fixture["V_plus"], plus["matrix"], "endpoint_vandermonde.V_plus")
    _check_matrix(fixture["V_minus"], minus["matrix"], "endpoint_vandermonde.V_minus")
    product = Fraction(1)
    labels = [1, 4, 9]
    for i in range(3):
        for j in range(i + 1, 3):
            product *= labels[j] ** 2 - labels[i] ** 2
    _check_rational(fixture["vandermonde_product_in_a_squared"], product, "endpoint_vandermonde.vandermonde_product_in_a_squared")
    for key, expected in (
        ("determinant_formula_plus", Fraction(29250)),
        ("determinant_plus", Fraction(29250)),
        ("determinant_minus", Fraction(-29250)),
    ):
        _check_rational(fixture[key], expected, f"endpoint_vandermonde.{key}")
    if plus["determinant_direct"] == 0 or minus["determinant_direct"] == 0:
        raise ReplayError("nonpositive/nonzero endpoint determinant gate failed")


def _positive_interval(value: Any, label: str, dps: int) -> None:
    lo, _hi = _interval(value, label, dps)
    if lo <= 0:
        raise ReplayError(f"nonpositive certified interval: {label}")


def _check_high_label(value: Any, p: int, dps: int) -> int:
    fixture = _require_keys(
        value,
        {
            "derivative_order_k", "twice_s_k", "B_s", "c", "c_squared", "rows",
            "scope", "actual_transition_scale_block_executed",
        },
        "high_label_rho",
    )
    if fixture["derivative_order_k"] != 2 or fixture["twice_s_k"] != 9 or fixture["B_s"] != 2048:
        raise ReplayError("high-label exponent/weight mutation")
    if fixture["scope"] != "raw sufficient high-label region; not a transition-scale endpoint certificate":
        raise ReplayError("high-label scope mutation")
    if fixture["actual_transition_scale_block_executed"] is not False:
        raise ReplayError("transition-scale endpoint block falsely reported")
    iv = mp.iv.mpf
    c_value = mp.iv.pi * iv(p * p) / 2
    c_squared = c_value**2
    _contains(fixture["c"], c_value, "high_label_rho.c", dps)
    _contains(fixture["c_squared"], c_squared, "high_label_rho.c_squared", dps)
    rows = _require_keys(fixture["rows"], {"plus_0_mod_4", "minus_2_mod_4"}, "high_label_rho.rows")
    interval_count = 2
    for family, label, residue in (
        ("plus_0_mod_4", 4096 * p**4, 0),
        ("minus_2_mod_4", 4096 * p**4 + 2, 2),
    ):
        row = _require_keys(rows[family], {"label", "label_mod_4", "g_n", "rho", "rho_strict_upper", "half_threshold_margin"}, f"high_label_rho.rows.{family}")
        if row["label"] != label or row["label_mod_4"] != residue:
            raise ReplayError(f"high-label residue/label mutation: {family}")
        _check_rational(row["rho_strict_upper"], Fraction(1, 2), f"high_label_rho.rows.{family}.rho_strict_upper")
        gap = iv(4 * label - 2) - c_squared
        rho = iv(2048) * c_squared / gap
        margin = gap - iv(4096) * c_squared
        _contains(row["g_n"], gap, f"high_label_rho.rows.{family}.g_n", dps)
        _contains(row["rho"], rho, f"high_label_rho.rows.{family}.rho", dps)
        _contains(row["half_threshold_margin"], margin, f"high_label_rho.rows.{family}.half_threshold_margin", dps)
        _positive_interval(row["g_n"], f"high_label_rho.rows.{family}.g_n", dps)
        _positive_interval(row["rho"], f"high_label_rho.rows.{family}.rho", dps)
        _positive_interval(row["half_threshold_margin"], f"high_label_rho.rows.{family}.half_threshold_margin", dps)
        _rho_lo, rho_hi = _interval(row["rho"], f"high_label_rho.rows.{family}.rho", dps)
        if rho_hi >= Fraction(1, 2):
            raise ReplayError(f"high-label rho did not certify strict half gap: {family}")
        interval_count += 3
    return interval_count


def _check_prime_inventory(value: Any, p: int) -> list[dict[str, Any]]:
    expected = _prime_power_inventory(p)
    if value != expected:
        raise ReplayError("inclusive prime-power inventory mutation or omission")
    if not expected or expected[-1]["n"] > (p * p) // 4:
        raise ReplayError("prime-power endpoint/lambda-squared reconstruction failed")
    return expected


def _check_odd_jump(value: Any, p: int, dps: int) -> int:
    fixture = _require_keys(
        value,
        {
            "prime_power_n", "prime_base", "lambda", "ell", "L", "x_n", "J_lambda_n",
            "eta", "variation_B_fixture", "variation_fixture_is_actual_B_bound", "K0_ratio",
            "K0", "dyadic_K", "fourier_mode_k", "minus_one_to_k_phase", "phase_angle",
            "derivative_atom_leading_coefficient", "F_k_jump_leading_coefficient",
            "k_squared_leading_energy", "jump_law_energy", "positive_mode_harmonic_sum",
            "sharp_dyadic_band_lower", "coarse_dyadic_band_lower", "jump_term_before_graph_error",
            "graph_half_error_threshold", "outer_cutoff_condition",
            "actual_uniform_graph_error_bound_executed", "positive_nu_gate_established",
        },
        "odd_jump_band",
    )
    if fixture["prime_power_n"] != 2 or fixture["prime_base"] != 2:
        raise ReplayError("odd jump prime-power mutation")
    _check_rational(fixture["eta"], Fraction(1, 2), "odd_jump_band.eta")
    _check_rational(fixture["variation_B_fixture"], Fraction(3), "odd_jump_band.variation_B_fixture")
    if fixture["variation_fixture_is_actual_B_bound"] is not False:
        raise ReplayError("toy variation fixture promoted to an actual bound")
    if fixture["actual_uniform_graph_error_bound_executed"] is not False:
        raise ReplayError("uniform graph error falsely reported")
    if fixture["positive_nu_gate_established"] is not False:
        raise ReplayError("positive-nu gate falsely reported")

    expected = _odd_jump_values(p)
    iv = mp.iv.mpf
    lam = iv(p) / 2
    _contains(fixture["lambda"], lam, "odd_jump_band.lambda", dps)
    for field, local in (("ell", "ell"), ("L", "L"), ("x_n", "x_n"), ("J_lambda_n", "jump"), ("K0_ratio", "threshold_real")):
        _contains(fixture[field], expected[local], f"odd_jump_band.{field}", dps)
    _positive_interval(fixture["lambda"], "odd_jump_band.lambda", dps)
    _positive_interval(fixture["J_lambda_n"], "odd_jump_band.J_lambda_n", dps)
    if fixture["K0"] != 8 or fixture["dyadic_K"] != 8 or fixture["fourier_mode_k"] != 9:
        raise ReplayError("odd jump dyadic threshold mutation")
    if fixture["minus_one_to_k_phase"] != -1 or expected["phase_sign"] != -1:
        raise ReplayError("finite-Fourier common (-1)^k phase was dropped")
    theta = expected["kappa"] * expected["x_n"]
    _contains(fixture["phase_angle"], theta, "odd_jump_band.phase_angle", dps)
    atom = _require_keys(fixture["derivative_atom_leading_coefficient"], {"real", "imag"}, "odd_jump_band.derivative_atom_leading_coefficient")
    leading = _require_keys(fixture["F_k_jump_leading_coefficient"], {"real", "imag"}, "odd_jump_band.F_k_jump_leading_coefficient")
    _contains(atom["real"], expected["atom_real"], "odd_jump_band.derivative_atom_leading_coefficient.real", dps)
    _contains(atom["imag"], expected["atom_imag"], "odd_jump_band.derivative_atom_leading_coefficient.imag", dps)
    _contains(leading["real"], expected["leading_real"], "odd_jump_band.F_k_jump_leading_coefficient.real", dps)
    _contains(leading["imag"], expected["leading_imag"], "odd_jump_band.F_k_jump_leading_coefficient.imag", dps)
    reconstructed_energy = iv(9 * 9) * (expected["leading_real"]**2 + expected["leading_imag"]**2)
    _contains(fixture["k_squared_leading_energy"], reconstructed_energy, "odd_jump_band.k_squared_leading_energy", dps)
    _contains(fixture["jump_law_energy"], expected["asymptotic_constant"], "odd_jump_band.jump_law_energy", dps)
    _check_rational(fixture["positive_mode_harmonic_sum"], expected["sum_inverse_squares"], "odd_jump_band.positive_mode_harmonic_sum")
    _contains(fixture["sharp_dyadic_band_lower"], expected["sharp_lower"], "odd_jump_band.sharp_dyadic_band_lower", dps)
    _contains(fixture["coarse_dyadic_band_lower"], expected["coarse_lower"], "odd_jump_band.coarse_dyadic_band_lower", dps)
    jump_term = Fraction(1, 2)
    jump_term_iv = iv(jump_term.numerator) / jump_term.denominator * expected["jump"] * mp.iv.sqrt(expected["L"] / (iv(8 * 8) * mp.iv.pi**2))
    _contains(fixture["jump_term_before_graph_error"], jump_term_iv, "odd_jump_band.jump_term_before_graph_error", dps)
    _contains(fixture["graph_half_error_threshold"], jump_term_iv / 2, "odd_jump_band.graph_half_error_threshold", dps)
    for field in (
        "sharp_dyadic_band_lower", "coarse_dyadic_band_lower",
        "jump_term_before_graph_error", "graph_half_error_threshold",
    ):
        _positive_interval(fixture[field], f"odd_jump_band.{field}", dps)
    coarse_lo, coarse_hi = _interval(fixture["coarse_dyadic_band_lower"], "odd_jump_band.coarse_dyadic_band_lower", dps)
    sharp_lo, _sharp_hi = _interval(fixture["sharp_dyadic_band_lower"], "odd_jump_band.sharp_dyadic_band_lower", dps)
    if coarse_lo <= 0 or coarse_hi >= sharp_lo:
        raise ReplayError("odd dyadic-band strict lower hierarchy failed")
    if fixture["outer_cutoff_condition"] != {"M_at_least": 16}:
        raise ReplayError("outer-cutoff M>=2K condition mutation")
    return 17


def _validate_admissions(admissions: Any, lock_admissions: Any) -> None:
    if admissions != lock_admissions or not isinstance(admissions, dict):
        raise ReplayError("source-admission mutation")
    true_keys = {key for key, value in admissions.items() if value is True}
    if true_keys != {"finite_computable_target_mixed_schedule_proved", "fixed_lambda_finite_jump_transfer_proved"}:
        raise ReplayError("unsafe or incomplete source admission")
    if any(type(value) is not bool for value in admissions.values()):
        raise ReplayError("non-Boolean source admission")


def replay(payload: dict[str, Any], producer_bytes: bytes | None = None) -> dict[str, Any]:
    if getattr(mp, "__version__", None) != EXPECTED_MPMATH_VERSION:
        raise ReplayError("mpmath runtime mismatch")
    _reject_float_or_secret(payload)
    top = _require_keys(
        payload,
        {"schema", "source_lock", "inputs", "terminal_state", "source_conventions", "claim_boundary", "certificate", "arithmetic_libraries"},
        "producer payload",
    )
    if top["schema"] != PRODUCER_SCHEMA:
        raise ReplayError("producer schema mutation")
    if top["terminal_state"] != TERMINAL_STATE:
        raise ReplayError("terminal-status mutation")
    if top["arithmetic_libraries"] != EXPECTED_LIBRARIES:
        raise ReplayError("arithmetic-library disclosure mutation")

    live_binding, lock = _validate_lock()
    if top["source_lock"] != live_binding:
        raise ReplayError("source-lock binding mutation")
    if top["source_conventions"] != lock["locked_conventions"]:
        raise ReplayError("source convention, Fourier sign, inversion, or normalization mutation")
    if top["claim_boundary"] != lock["claim_boundary"]:
        raise ReplayError("claim-boundary mutation")
    p_text, p, dps_text, dps = _validate_inputs(top["inputs"])
    mp.iv.dps = dps

    certificate = _require_keys(
        top["certificate"],
        {
            "exact_trace_stop", "exact_mixed_bridge_fixture", "endpoint_recurrence",
            "endpoint_vandermonde", "high_label_rho", "inclusive_prime_powers",
            "odd_jump_band", "source_admissions", "logical_theorems", "checks",
        },
        "certificate",
    )
    _validate_admissions(certificate["source_admissions"], lock["source_admissions"])
    if certificate["logical_theorems"] != EXPECTED_LOGICAL_THEOREMS:
        raise ReplayError("logical-theorem mutation or determinant-limit substitution")
    checks = certificate["checks"]
    if not isinstance(checks, dict) or set(checks) != EXPECTED_CHECK_KEYS or any(value is not True for value in checks.values()):
        raise ReplayError("producer Boolean inventory mutation")

    _check_trace_stop(certificate["exact_trace_stop"], p)
    _check_mixed_bridge(certificate["exact_mixed_bridge_fixture"], p)
    _check_endpoint_recurrence(certificate["endpoint_recurrence"])
    _check_endpoint_vandermonde(certificate["endpoint_vandermonde"])
    interval_count = _check_high_label(certificate["high_label_rho"], p, dps)
    prime_inventory = _check_prime_inventory(certificate["inclusive_prime_powers"], p)
    interval_count += _check_odd_jump(certificate["odd_jump_band"], p, dps)

    canonical = (json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n").encode("utf-8")
    if producer_bytes is not None and producer_bytes != canonical:
        raise ReplayError("producer byte stream is not canonical")
    producer_hash = hashlib.sha256(canonical).hexdigest()
    return {
        "schema": REPLAY_SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "source_lock": live_binding,
        "producer_binding": {"sha256": producer_hash, "canonical_bytes": len(canonical)},
        "reconstructed": {
            "lambda_numerator": p_text,
            "dps": dps_text,
            "dependency_count": len(EXPECTED_DEPENDENCIES),
            "external_source_count": len(EXPECTED_EXTERNAL_SOURCES),
            "prime_power_count": len(prime_inventory),
            "interval_count": interval_count,
            "trace_stop_constants_reconstructed": True,
            "mixed_bridge_gram_reconstructed_from_raw_columns": True,
            "residual_trace_invariant_by_two_paths": True,
            "endpoint_recurrence_reconstructed_with_P_minus_one_zero": True,
            "endpoint_vandermonde_determinants_reconstructed": True,
            "high_label_rho_strictly_below_half": True,
            "inclusive_prime_power_inventory_reconstructed": True,
            "odd_jump_and_common_fourier_phase_reconstructed": True,
            "dyadic_band_lower_reconstructed": True,
            "claim_boundary_retained": True,
        },
        "arithmetic_limitation": EXPECTED_LIBRARIES["independence_limitation"],
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    input_path = Path(args.input)
    producer_bytes = input_path.read_bytes()
    try:
        payload = json.loads(producer_bytes.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise ReplayError("malformed producer JSON") from exc
    report = replay(payload, producer_bytes=producer_bytes)
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(report, indent=2, sort_keys=True, allow_nan=False) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
