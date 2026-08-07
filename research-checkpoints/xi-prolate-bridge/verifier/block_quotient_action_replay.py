#!/usr/bin/env python3
"""Clean-room replay of the split-block quotient-action certificate."""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import re
from typing import Any

import mpmath as mp


SCHEMA = "xi-prolate-block-quotient-action-v1"
REPLAY_SCHEMA = "xi-prolate-block-quotient-action-replay-v1"
STATUS = "BLOCK_QUOTIENT_ACTION_COMPONENT"
RESULT = "BLOCK_QUOTIENT_ACTION_COMPONENT_PASS"
REPLAY_RESULT = "BLOCK_QUOTIENT_ACTION_COMPONENT_REPLAY_PASS"
TERMINAL_STATE = "P0_INVALIDATED"
NOTE = "notes/BLOCK_QUOTIENT_ACTION_THEOREM.md"
SOURCE_LOCK = "BLOCK_QUOTIENT_ACTION_SOURCE_LOCK.json"
PINNED_HASHES = {
    NOTE: "31c4239b2dec0114be7b8e9b42e52ebc6361130461d1225e05c81ff5b26369d4",
    SOURCE_LOCK: "1a3993f3bda080c3d9dd870c8ffffb9b4b278eb5049d0508c72389a5c15f10a4",
}
_SHA256 = re.compile(r"^[0-9a-f]{64}$")
_INTEGER = re.compile(r"^(?:0|-[1-9][0-9]*|[1-9][0-9]*)$")
_NONNEGATIVE = re.compile(r"^(?:0|[1-9][0-9]*)$")
_POSITIVE = re.compile(r"^[1-9][0-9]*$")

LOCKED_FORMULAS = {
    "block_metric": "D_L=D_8 direct_sum D_R; A_i=W_i*D_i^(-1/2); R_L=A_8*A_8^*+A_R*A_R^*",
    "quotient": "Delta_L=R_L^dagger on K_L and Delta_L^(-1)=R_L on K_L",
    "low_action": "Gamma_L<= (sqrt(C_8*M_8)+sqrt(C_R*M_R))^2",
    "arithmetic_map": "norm(T*f)^2<=lambda^2*norm(f)^2/2 for additive-even f",
    "ground_integral": "abs(I_0)^2>=1/(4*lambda)",
    "transition_point": "V0=lambda^(-1)+8*pi*lambda and abs(rho_t)^2<=4*lambda*V0=4+32*pi*lambda^2",
    "rest_inventory": "q_R=max(0,floor((n_star-1)/4)-2)<=3*lambda^2/2",
    "rest_synthesis": "d_12*M_R<=q_R*lambda^2*(5+32*pi*lambda^2)/2<=3*lambda^4*(5+32*pi*lambda^2)/4",
    "fixed_limits": "rho_8 tends to -sqrt(70)/16 and d_12/d_8 is asymptotic to (8192*pi^4/1485)*lambda^8",
    "high_extension": "Gamma(Delta_L direct_sum g*I)<=Gamma_L+B_H/g^2",
    "metric_counterexample": "W=[1,1], D_bd=2*I, D_full=[[2,-1],[-1,2]] gives Gamma_bd=1 and Gamma_full=4",
    "complement_counterexample": "Q=diag(1,-1,1), K_L=span(e1), F_high=span(e3) gives low floor 1, Fourier-high floor 1, and physical-complement floor -1",
}

SOURCE_ADMISSIONS = {
    "binary64_parameters_used": False,
    "cached_quotient_matrix_read": False,
    "zeta_zero_table_read": False,
    "zeros_assumed_real": False,
    "global_weil_positivity_assumed": False,
    "block_diagonal_metric_used": True,
    "full_metric_substituted": False,
    "cross_block_sampling_terms_retained": True,
    "low_high_sampling_terms_retained": True,
    "squared_sum_replaced_by_maximum": False,
    "physical_complement_identified_with_fourier_high": False,
    "qualitative_limits_used_as_finite_bounds": False,
    "signed_weil_floor_claimed": False,
    "equation_5_2_claimed": False,
    "determinant_limit_claimed": False,
    "rh_proved": False,
}

CLAIM_SCOPE = {
    "proved": [
        "split-block low positive-sampling quotient action with the cross-block term retained",
        "finite physical synthesis bounds expressed through d_8 and d_12",
        "qualitative low action scale O(lambda^3*polylog(lambda)/d_8)",
        "conditional high-complement action formula and exact shortcut counterexamples",
    ],
    "not_proved": [
        "an effective threshold for the fixed-index asymptotics",
        "a finite numerical value of d_8 or d_12",
        "a signed floor on the physical complement",
        "a shifted signed comparison in either parity sector",
        "equation (5.2) of DIRECT_RH_ATTACK.md",
        "locally uniform determinant convergence",
        "the Riemann hypothesis",
    ],
}


class ReplayError(ValueError):
    pass


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    try:
        return hashlib.sha256(path.read_bytes()).hexdigest()
    except OSError as exc:
        raise ReplayError(f"cannot read pinned source: {path}") from exc


def _reject_number(token: str) -> None:
    raise ReplayError(f"non-integer JSON number {token!r} is forbidden")


def _unique(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise ReplayError(f"duplicate JSON object key: {key}")
        result[key] = value
    return result


def _validate(value: Any, path: str = "payload") -> None:
    if value is None or isinstance(value, (str, bool)):
        return
    if isinstance(value, int):
        return
    if isinstance(value, float):
        raise ReplayError(f"binary64 value at {path} is forbidden")
    if isinstance(value, list):
        for index, child in enumerate(value):
            _validate(child, f"{path}[{index}]")
        return
    if isinstance(value, dict):
        for key, child in value.items():
            if not isinstance(key, str):
                raise ReplayError(f"non-string key at {path}")
            _validate(child, f"{path}.{key}")
        return
    raise ReplayError(f"non-JSON value at {path}")


def _strict_json_loads(raw: bytes | str, label: str) -> Any:
    try:
        value = json.loads(
            raw,
            parse_float=_reject_number,
            parse_constant=_reject_number,
            object_pairs_hook=_unique,
        )
    except ReplayError:
        raise
    except (UnicodeError, json.JSONDecodeError) as exc:
        raise ReplayError(f"{label} is not strict JSON") from exc
    _validate(value, label)
    return value


def _same(left: Any, right: Any) -> bool:
    if type(left) is not type(right):
        return False
    if isinstance(left, dict):
        return set(left) == set(right) and all(_same(left[key], right[key]) for key in left)
    if isinstance(left, list):
        return len(left) == len(right) and all(_same(a, b) for a, b in zip(left, right))
    return left == right


def _int(value: Any, label: str, minimum: int | None = None) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise ReplayError(f"{label} must be an exact JSON integer")
    if minimum is not None and value < minimum:
        raise ReplayError(f"{label} must be at least {minimum}")
    return value


def _rational(value: Fraction) -> dict[str, str]:
    return {"numerator": str(value.numerator), "denominator": str(value.denominator)}


def _parse_rational(value: Any, label: str) -> Fraction:
    if not isinstance(value, dict) or set(value) != {"numerator", "denominator"}:
        raise ReplayError(f"{label} must be a rational object")
    numerator, denominator = value["numerator"], value["denominator"]
    if (
        not isinstance(numerator, str) or _INTEGER.fullmatch(numerator) is None
        or not isinstance(denominator, str) or _POSITIVE.fullmatch(denominator) is None
    ):
        raise ReplayError(f"{label} has noncanonical rational text")
    result = Fraction(int(numerator), int(denominator))
    if _rational(result) != value:
        raise ReplayError(f"{label} is not a reduced canonical rational")
    return result


def _endpoint(value: Any, label: str) -> mp.mpf:
    if not isinstance(value, list) or len(value) != 4:
        raise ReplayError(f"{label} must be a four-field endpoint")
    sign = _int(value[0], f"{label}.sign", 0)
    mantissa_text = value[1]
    exponent = _int(value[2], f"{label}.exponent")
    bit_count = _int(value[3], f"{label}.bit_count", 0)
    if (
        sign not in (0, 1) or not isinstance(mantissa_text, str)
        or _NONNEGATIVE.fullmatch(mantissa_text) is None
    ):
        raise ReplayError(f"{label} has noncanonical fields")
    mantissa = int(mantissa_text)
    raw = (sign, mantissa, exponent, bit_count)
    if mantissa == 0:
        if raw != (0, 0, 0, 0):
            raise ReplayError(f"{label} has noncanonical zero")
    elif mantissa.bit_length() != bit_count:
        raise ReplayError(f"{label} has incorrect bit count")
    with mp.workprec(max(mp.mp.prec, bit_count + 10)):
        result = +mp.mpf(raw)
    if tuple(int(part) for part in result._mpf_) != raw:
        raise ReplayError(f"{label} is not canonical")
    return result


def _interval(value: Any, label: str, dps: int) -> tuple[mp.mpf, mp.mpf]:
    if not isinstance(value, dict) or set(value) != {"decimal", "dyadic"}:
        raise ReplayError(f"{label} interval inventory mismatch")
    decimal, dyadic = value["decimal"], value["dyadic"]
    if (
        not isinstance(decimal, list) or len(decimal) != 2
        or not all(isinstance(part, str) for part in decimal)
        or not isinstance(dyadic, dict) or set(dyadic) != {"lower", "upper"}
    ):
        raise ReplayError(f"{label} interval serialization malformed")
    lower = _endpoint(dyadic["lower"], f"{label}.lower")
    upper = _endpoint(dyadic["upper"], f"{label}.upper")
    if lower > upper:
        raise ReplayError(f"{label} endpoints reversed")
    with mp.workdps(dps + 20):
        display = [mp.nstr(lower, dps + 10), mp.nstr(upper, dps + 10)]
    if decimal != display:
        raise ReplayError(f"{label} display does not match raw endpoints")
    return lower, upper


def _capture(value: object) -> tuple[mp.mpf, mp.mpf]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    bits = max(int(lower[3]), int(upper[3])) + 32
    with mp.workprec(bits):
        return +mp.mpf(tuple(lower)), +mp.mpf(tuple(upper))


def _ceiling(value: object) -> int:
    lower, upper = _capture(value)
    a, b = int(mp.ceil(lower)), int(mp.ceil(upper))
    if a != b:
        raise ReplayError("transition interval straddles an integer")
    return a


def _fraction_matrix_inverse_2(matrix: list[list[Fraction]]) -> list[list[Fraction]]:
    if len(matrix) != 2 or any(len(row) != 2 for row in matrix):
        raise ReplayError("internal two-by-two matrix inventory mismatch")
    determinant = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
    if determinant == 0:
        raise ReplayError("internal exact matrix is singular")
    return [
        [matrix[1][1] / determinant, -matrix[0][1] / determinant],
        [-matrix[1][0] / determinant, matrix[0][0] / determinant],
    ]


def _exact_regressions() -> dict[str, object]:
    # Saturating rank-one low quotient: W8=WR=1 and D8=DR=2.
    d8 = drest = Fraction(2)
    w8 = wrest = Fraction(1)
    c8 = w8 * w8 / d8
    crest = wrest * wrest / drest
    m8 = c8
    mrest = crest
    r_low = w8 * w8 / d8 + wrest * wrest / drest
    gamma_low = r_low * r_low
    root_product_8 = Fraction(1, 2)
    root_product_rest = Fraction(1, 2)
    squared_sum = (root_product_8 + root_product_rest) ** 2
    g = Fraction(3)
    bh = Fraction(1)
    gamma_full = gamma_low + bh / (g * g)

    # Nontrivial range model in Q^3.
    r00 = Fraction(1) + Fraction(3) ** 2
    r01 = Fraction(3) * Fraction(4)
    r11 = Fraction(4) ** 2
    r_inverse = _fraction_matrix_inverse_2([[r00, r01], [r01, r11]])
    if r_inverse != [[Fraction(1), Fraction(-3, 4)], [Fraction(-3, 4), Fraction(5, 8)]]:
        raise ReplayError("internal nontrivial range inverse mismatch")
    sampled_r = [r00 + r01, r01 + r11]
    nontrivial_gamma = sampled_r[0] ** 2 + sampled_r[1] ** 2
    nontrivial_bound = (Fraction(1) + Fraction(35)) ** 2

    # Full metric substitution model.
    full_inverse = _fraction_matrix_inverse_2(
        [[Fraction(2), Fraction(-1)], [Fraction(-1), Fraction(2)]]
    )
    full_r = sum((full_inverse[row][column] for row in range(2) for column in range(2)), Fraction(0))
    block_r = Fraction(1, 2) + Fraction(1, 2)

    return {
        "block_action_saturation": {
            "source_kernel_dimension": 1,
            "C_8": _rational(c8),
            "C_R": _rational(crest),
            "M_8": _rational(m8),
            "M_R": _rational(mrest),
            "C_8_times_M_8": _rational(c8 * m8),
            "C_R_times_M_R": _rational(crest * mrest),
            "low_Gamma": _rational(gamma_low),
            "squared_sum_upper": _rational(squared_sum),
            "high_metric_g": _rational(g),
            "high_sampling_B_H": _rational(bh),
            "full_Gamma": _rational(gamma_full),
            "low_plus_high_upper": _rational(gamma_full),
        },
        "nontrivial_range_action": {
            "physical_dimension": 3,
            "physical_range_dimension": 2,
            "C_8": _rational(Fraction(1)),
            "C_R": _rational(Fraction(49)),
            "M_8": _rational(Fraction(1)),
            "M_R": _rational(Fraction(25)),
            "low_Gamma": _rational(nontrivial_gamma),
            "squared_sum_upper": _rational(nontrivial_bound),
            "range_projector_trace": _rational(Fraction(2)),
        },
        "full_metric_substitution_counterexample": {
            "block_diagonal_Gamma": _rational(block_r**2),
            "full_metric_Gamma": _rational(full_r**2),
            "full_over_block_ratio": _rational((full_r / block_r) ** 2),
        },
        "physical_fourier_complement_counterexample": {
            "physical_low_floor": _rational(Fraction(1)),
            "fourier_high_floor": _rational(Fraction(1)),
            "physical_complement_floor": _rational(Fraction(-1)),
        },
        "fixed_index_coefficient_ledger": {
            "d12_over_d8_rational_prefactor": _rational(
                Fraction(16**4) * Fraction(8 * 7 * 6 * 5 * 4 * 3 * 2)
                / Fraction(12 * 11 * 10 * 9 * 8 * 7 * 6 * 5 * 4 * 3 * 2)
            ),
            "rho8_squared_limit": _rational(Fraction(70, 16**2)),
            "singleton_lambda_exponent": 1 + 2,
            "rest_lambda_exponent_after_defect_conversion": 3 + 6 - 8,
        },
    }


def _assemble(p: int, dps: int) -> tuple[dict[str, tuple[mp.mpf, mp.mpf]], dict[str, Any]]:
    old = mp.iv.dps
    try:
        mp.iv.dps = dps
        one = mp.iv.mpf(1)
        two = one + one
        pi = +mp.iv.pi
        p_iv = mp.iv.mpf(p)
        lambda_squared = p_iv * p_iv / 4
        beta = two * mp.iv.log(25 + 200 * lambda_squared) / (pi**2)
        buffer_ceil = _ceiling(mp.iv.log(20) * beta)
        n_star = p * p + buffer_ceil + 6
        modal_limit = (n_star - 1) // 4
        q_rest = max(0, modal_limit - 2)

        d4_upper = mp.iv.exp(mp.iv.log(10) - (p * p - 11) / beta)
        v0 = two / p_iv + 4 * pi * p_iv
        rho_squared = 4 + 8 * pi * p_iv * p_iv
        column_bound = (p_iv * p_iv / 8) * (5 + 8 * pi * p_iv * p_iv)
        aggregate = q_rest * column_bound
        coarse = 3 * p_iv**4 * (5 + 8 * pi * p_iv * p_iv) / 64
        ratio_coefficient = (8192 / mp.iv.mpf(1485)) * pi * pi * pi * pi
        rho8_limit = -(mp.iv.sqrt(2) * mp.iv.sqrt(35)) / 16

        if _capture(d4_upper)[1] > mp.mpf("0.5"):
            raise ReplayError("reconstructed KRD bound does not prove d_4<=1/2")
        if q_rest > Fraction(3 * p * p, 8):
            raise ReplayError("reconstructed rest inventory exceeds its coarse bound")
        intervals = {
            "beta": _capture(beta),
            "d4_upper": _capture(d4_upper),
            "V0": _capture(v0),
            "rho_rest_squared_upper": _capture(rho_squared),
            "raw_rest_column_norm_squared_upper": _capture(column_bound),
            "d12_times_M_rest_upper": _capture(aggregate),
            "d12_times_M_rest_coarse_upper": _capture(coarse),
            "fixed_d12_over_d8_coefficient": _capture(ratio_coefficient),
            "fixed_rho8_limit": _capture(rho8_limit),
        }
        exact = {
            "lambda": _rational(Fraction(p, 2)),
            "lambda_squared": _rational(Fraction(p * p, 4)),
            "shannon_index": p * p,
            "buffer_ceil": buffer_ceil,
            "n_star": n_star,
            "sampling_modal_row_limit": modal_limit,
            "physical_rest_column_count": q_rest,
            "physical_rest_targets": list(range(12, n_star, 4)),
            "ground_integral_squared_lower": _rational(Fraction(1, 2 * p)),
            "arithmetic_map_norm_squared_factor": _rational(Fraction(p * p, 8)),
            "rest_count_coarse_bound": _rational(Fraction(3 * p * p, 8)),
            "finite_defect_values_serialized": False,
            "fixed_index_limits_effective": False,
        }
        if len(exact["physical_rest_targets"]) != q_rest:
            raise ReplayError("reconstructed physical rest inventory mismatch")
        return intervals, exact
    finally:
        mp.iv.dps = old


def reconstruct(p: int, dps: int) -> tuple[dict[str, tuple[mp.mpf, mp.mpf]], dict[str, Any]]:
    p = _int(p, "lambda_numerator", 5)
    dps = _int(dps, "interval_decimal_digits", 50)
    if p % 2 == 0:
        raise ReplayError("lambda_numerator must be odd")
    return _assemble(p, dps)


def _source_hashes() -> dict[str, str]:
    root = _root()
    for relative, expected in PINNED_HASHES.items():
        if _SHA256.fullmatch(expected) is None or _sha256(root / relative) != expected:
            raise ReplayError(f"source byte hash mismatch: {relative}")
    lock = _strict_json_loads((root / SOURCE_LOCK).read_bytes(), "source lock")
    expected_top = {
        "schema", "claim_class", "terminal_state", "updated_date",
        "dependencies", "locked_conventions", "locked_formulas", "claim_boundary",
    }
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ReplayError("source-lock inventory mismatch")
    fixed = {
        "schema": "xi-prolate-block-quotient-action-source-lock-v1",
        "claim_class": "SPLIT_BLOCK_QUOTIENT_POSITIVE_ACTION_BOUND",
        "terminal_state": TERMINAL_STATE,
        "updated_date": "2026-08-07",
        "locked_formulas": LOCKED_FORMULAS,
    }
    for key, expected in fixed.items():
        if not _same(lock[key], expected):
            raise ReplayError(f"source-lock {key} mutation")
    result = dict(PINNED_HASHES)
    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list) or not dependencies:
        raise ReplayError("source-lock dependencies missing")
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ReplayError("malformed source-lock dependency")
        relative, expected, role = item["path"], item["sha256"], item["role"]
        if (
            not isinstance(relative, str) or not relative
            or Path(relative).is_absolute() or ".." in Path(relative).parts
            or relative in result
            or not isinstance(expected, str) or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str) or not role
        ):
            raise ReplayError("invalid source-lock dependency")
        if _sha256(root / relative) != expected:
            raise ReplayError(f"dependency hash mismatch: {relative}")
        result[relative] = expected
    return dict(sorted(result.items()))


def replay(payload: dict[str, Any], *, producer_bytes: bytes | None = None) -> dict[str, Any]:
    if producer_bytes is None or not isinstance(producer_bytes, bytes):
        raise ReplayError("exact producer artifact bytes are required")
    decoded = _strict_json_loads(producer_bytes, "producer bytes")
    if not _same(decoded, payload):
        raise ReplayError("producer bytes do not decode exactly to replay payload")
    _validate(payload)
    expected_top = {
        "schema", "status", "terminal_state", "input", "source_hashes",
        "locked_formulas", "source_admissions", "certificate", "arithmetic",
        "producer_pass_boolean_trusted_by_replay", "claim_scope", "result",
    }
    if not isinstance(payload, dict) or set(payload) != expected_top:
        raise ReplayError("artifact inventory mismatch")
    fixed = {
        "schema": SCHEMA,
        "status": STATUS,
        "terminal_state": TERMINAL_STATE,
        "locked_formulas": LOCKED_FORMULAS,
        "source_admissions": SOURCE_ADMISSIONS,
        "producer_pass_boolean_trusted_by_replay": False,
        "claim_scope": CLAIM_SCOPE,
        "result": RESULT,
    }
    for key, expected in fixed.items():
        if not _same(payload[key], expected):
            raise ReplayError(f"artifact {key} mutation or claim promotion")

    arithmetic = payload["arithmetic"]
    if (
        not isinstance(arithmetic, dict)
        or set(arithmetic) != {
            "precision_mode", "raw_interval_or_ball_output_applicable", "library",
            "shared_library_with_verifier", "independent_formula_trees",
        }
        or arithmetic["precision_mode"] != "outward arbitrary-precision intervals"
        or arithmetic["raw_interval_or_ball_output_applicable"] is not True
        or arithmetic["shared_library_with_verifier"] is not True
        or arithmetic["independent_formula_trees"] is not True
        or arithmetic["library"] != f"mpmath.iv {mp.__version__}"
    ):
        raise ReplayError("arithmetic disclosure mutation")

    inputs = payload["input"]
    if not isinstance(inputs, dict) or set(inputs) != {
        "lambda_numerator", "lambda_denominator", "interval_decimal_digits",
    }:
        raise ReplayError("input inventory mismatch")
    p = _int(inputs["lambda_numerator"], "lambda_numerator", 5)
    if _int(inputs["lambda_denominator"], "lambda_denominator") != 2:
        raise ReplayError("lambda denominator mutation")
    dps = _int(inputs["interval_decimal_digits"], "interval_decimal_digits", 50)
    intervals, exact = reconstruct(p, dps)

    certificate = payload["certificate"]
    if not isinstance(certificate, dict) or set(certificate) != {
        "exact", "outward_intervals", "exact_regressions",
        "finite_product_serialized", "fixed_index_limit_classification",
    }:
        raise ReplayError("certificate inventory mismatch")
    if certificate["finite_product_serialized"] != "d_12*M_R":
        raise ReplayError("finite rest product mutation")
    if certificate["fixed_index_limit_classification"] != "qualitative_non_effective":
        raise ReplayError("fixed-index limit was promoted to a finite inequality")

    supplied_exact = certificate["exact"]
    if not isinstance(supplied_exact, dict) or set(supplied_exact) != set(exact):
        raise ReplayError("exact certificate inventory mismatch")
    rational_fields = {
        "lambda", "lambda_squared", "ground_integral_squared_lower",
        "arithmetic_map_norm_squared_factor", "rest_count_coarse_bound",
    }
    for name, expected in exact.items():
        if name in rational_fields:
            _parse_rational(supplied_exact[name], name)
        if not _same(supplied_exact[name], expected):
            raise ReplayError(f"exact field {name} differs from reconstruction")

    expected_regressions = _exact_regressions()
    if not _same(certificate["exact_regressions"], expected_regressions):
        raise ReplayError("exact regression reconstruction mismatch")
    # Parse every rational leaf as a second canonicality check.
    for section, values in expected_regressions.items():
        for name, value in values.items():
            if isinstance(value, dict) and set(value) == {"numerator", "denominator"}:
                _parse_rational(certificate["exact_regressions"][section][name], f"{section}.{name}")

    supplied_intervals = certificate["outward_intervals"]
    if not isinstance(supplied_intervals, dict) or set(supplied_intervals) != set(intervals):
        raise ReplayError("interval inventory mismatch")
    overlap: dict[str, bool] = {}
    for name, reconstructed in intervals.items():
        supplied = _interval(supplied_intervals[name], name, dps)
        if supplied[0] > reconstructed[1] or reconstructed[0] > supplied[1]:
            raise ReplayError(f"{name} producer/verifier intervals do not overlap")
        with mp.workdps(dps + 30):
            scale = max(
                mp.mpf(1), abs(supplied[0]), abs(supplied[1]),
                abs(reconstructed[0]), abs(reconstructed[1]),
            )
            tolerance = scale * mp.power(10, -dps + 8)
            if (
                abs(supplied[0] - reconstructed[0]) > tolerance
                or abs(supplied[1] - reconstructed[1]) > tolerance
            ):
                raise ReplayError(f"{name} producer interval is not precision-tight")
        overlap[name] = True

    hashes = _source_hashes()
    if not _same(payload["source_hashes"], hashes):
        raise ReplayError("source hash inventory mismatch")

    return {
        "schema": REPLAY_SCHEMA,
        "status": REPLAY_RESULT,
        "terminal_state": TERMINAL_STATE,
        "producer_binding": {
            "sha256": hashlib.sha256(producer_bytes).hexdigest(),
            "exact_bytes_required": True,
        },
        "checks": {
            "producer_booleans_trusted": False,
            "cached_quotient_matrices_trusted": False,
            "independent_formula_reconstruction": True,
            "all_interval_pairs_overlap": all(overlap.values()),
            "block_diagonal_metric_kept_distinct": True,
            "cross_block_squared_sum_retained": True,
            "low_high_additive_term_retained": True,
            "physical_complement_not_identified_with_fourier_high": True,
            "finite_artifact_serializes_only_d12_times_M_rest": True,
            "fixed_index_limits_remain_qualitative": True,
            "signed_floor_claimed": False,
        },
        "interval_overlap": overlap,
        "reconstructed_exact_certificate": exact,
        "reconstructed_exact_regressions": expected_regressions,
        "arithmetic": {
            "library": f"mpmath.iv {mp.__version__}",
            "shared_library_limitation_acknowledged": True,
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("artifact")
    parser.add_argument("--output")
    args = parser.parse_args()
    raw = Path(args.artifact).read_bytes()
    payload = _strict_json_loads(raw, "producer artifact")
    report = replay(payload, producer_bytes=raw)
    encoded = json.dumps(report, indent=2, sort_keys=True) + "\n"
    if args.output:
        Path(args.output).write_text(encoded, encoding="utf-8")
    else:
        print(encoded, end="")


if __name__ == "__main__":
    main()
