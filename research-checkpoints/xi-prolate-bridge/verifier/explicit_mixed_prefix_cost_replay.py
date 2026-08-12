#!/usr/bin/env python3
"""Independent replay of the explicit unsigned mixed-prefix cost artifact."""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
from math import isqrt
import json
from pathlib import Path
import re
from typing import Any

import mpmath as mp


PRODUCER_SCHEMA = "xi-prolate-explicit-mixed-prefix-cost-v1"
REPLAY_SCHEMA = "xi-prolate-explicit-mixed-prefix-cost-replay-v1"
FORMULA_VERSION = "0.43-explicit-mixed-prefix-cost-v1"
CLAIM_CLASS = "EXPLICIT_UNSIGNED_MIXED_PREFIX_COST_AUDIT"
TERMINAL_STATE = "P0_INVALIDATED"
EXPECTED_MPMATH_VERSION = "1.4.1"

CANONICAL_LAMBDAS = {"5/2", "9/2"}
CANONICAL_DPS = {"80", "160"}
_RATIONAL_TEXT = re.compile(r"[1-9][0-9]*/[1-9][0-9]*\Z")
_INTEGER_TEXT = re.compile(r"(?:0|[1-9][0-9]*)\Z")
_SECRET_VALUE = re.compile(
    r"(?:\bBearer\s+[A-Za-z0-9._-]+|\bsk-[A-Za-z0-9_-]{8,}|"
    r"\bgh[pousr]_[A-Za-z0-9_]{8,}|\bxox[baprs]-[A-Za-z0-9-]{8,}|"
    r"OPENAI_API_KEY\s*=)",
    re.IGNORECASE,
)

SOURCE_HASHES = {
    "notes/EXPLICIT_MIXED_PREFIX_COST_ATTACK.md":
        "c3b1bcc9318c417246c52cd5d3b9bbfaa2d04cd0070e0c8cdc54862f7fcf02f8",
    "EFFECTIVE_MIXED_ENDPOINT_JUMP_SOURCE_LOCK.json":
        "24ea8f8085e9e198201006f54e0499495174053e38f6c26185cd2b2f60725fcc",
    "requirements.txt":
        "458f06e2b5d6e73acc7a4f72af69afe920764c71127578555044815cd785c0fa",
}

EXPECTED_IMPLEMENTATIONS = {
    "producer": "src/explicit_mixed_prefix_cost.py",
    "verifier": "verifier/explicit_mixed_prefix_cost_replay.py",
}

EXPECTED_CONVENTIONS = {
    "source_interval": "[-lambda,lambda] with Lebesgue measure and zero extension",
    "physical_interval": "[-log(lambda),log(lambda)] with L=2*log(lambda)",
    "fourier_basis": "phi_k(s)=(-1)^k*L^(-1/2)*exp(2*pi*i*k*s/L)",
    "prolate_parameter": "c=2*pi*lambda^2",
    "target_rule": "N=ceil(lambda^2)",
    "target_dimension": "d=2*N+1=(N+1 inversion-even)+(N inversion-odd)",
    "source_prefix": "F_M=span(c_2,c_4,...,c_(2*M))",
    "terminal_label": "largest prolate mode index is 2*M",
}

EXPECTED_FORMULAS = {
    "L": "2*log(lambda)",
    "c": "2*pi*lambda^2",
    "ground_supremum_upper": "sqrt(3)/2+2*c/sqrt(5)",
    "ground_integral_lower": "sqrt(lambda)/ground_supremum_upper",
    "r_lambda": "ceil(sqrt(lambda))",
    "C_lambda": "1+(44/7)*lambda^2",
    "iota_lambda": "lambda/(r_lambda*C_lambda)",
    "Gamma_lambda": "4+(132/7)*lambda^2",
    "B_lambda_N": "16*pi*N/L+4*L+14",
    "V_upper": "lambda^2*sqrt(d/L)*B_lambda_N",
    "delta": "1/(4*sqrt(d)*lambda)",
    "rho": "L/(64*Gamma_lambda^2*lambda^6*d^2*B_lambda_N^2)",
    "A_upper": "2*sqrt(2)*lambda^2",
    "R_upper": "2048*Gamma_lambda^4*lambda^12*d^4*B_lambda_N^4/L^2+2048*pi^2*Gamma_lambda^2*lambda^10*d",
    "M_expression": "16*sqrt(2)*Gamma_lambda^2*lambda^6*d^2*B_lambda_N^2/L+16*sqrt(2)*pi*Gamma_lambda*lambda^5*sqrt(d)",
    "M": "ceil(M_expression)",
    "Mhat_expression": "400*sqrt(2)*(160/7)^2*(32*pi+18)^2*lambda^18/L^3+(2560*sqrt(10)*pi/7)*lambda^8",
    "Mhat": "ceil(Mhat_expression)",
    "trace_upper": "1/(16*lambda^2)",
    "trace_stop": "1/(8*lambda^2)",
    "unsigned_coframe_floor": "9/(128*lambda^4)",
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

EXPECTED_CLAIMS = {
    "explicit_unsigned_terminal_count_proved": True,
    "full_two_parity_target_retained": True,
    "actual_first_trace_stopping_label_computed": False,
    "signed_physical_floor_proved": False,
    "equation_5_2_proved": False,
    "locally_uniform_determinant_convergence_proved": False,
    "riemann_hypothesis_proved": False,
    "api_key_read": False,
    "environment_secret_read": False,
}

EXPECTED_CHECK_KEYS = {
    "N_is_ceil_lambda_squared",
    "both_parities_fill_dimension",
    "rational_iota_below_analytic_I0_lower",
    "kappa_below_Gamma",
    "rho_strictly_between_zero_and_one",
    "split_square_root_majorant_positive",
    "terminal_integer_dominates_R",
    "simplified_terminal_dominates_general",
    "trace_bound_strictly_stops",
    "unsigned_floor_positive",
    "no_actual_prolate_trace_claim",
    "no_signed_claim",
}

LOG2_10_UPPER_NUMERATOR = 3321928094887363
LOG2_10_UPPER_DENOMINATOR = 10**15


class ReplayError(ValueError):
    """Raised when a cost artifact fails independent reconstruction."""


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _reject_float_or_secret(value: Any, location: str = "root") -> None:
    if isinstance(value, float):
        raise ReplayError(f"binary64 value at {location}")
    if isinstance(value, str):
        if _SECRET_VALUE.search(value):
            raise ReplayError(f"secret-like value at {location}")
        return
    if value is None or type(value) in (bool, int):
        return
    if isinstance(value, list):
        for index, item in enumerate(value):
            _reject_float_or_secret(item, f"{location}[{index}]")
        return
    if isinstance(value, dict):
        if any(not isinstance(key, str) for key in value):
            raise ReplayError(f"non-string key at {location}")
        for key, item in value.items():
            _reject_float_or_secret(item, f"{location}.{key}")
        return
    raise ReplayError(f"unsupported value at {location}")


def _parse_lambda(value: Any) -> Fraction:
    if not isinstance(value, str) or _RATIONAL_TEXT.fullmatch(value) is None:
        raise ReplayError("lambda must be canonical exact rational text")
    if value not in CANONICAL_LAMBDAS:
        raise ReplayError("lambda pilot inventory mismatch")
    numerator, denominator = (int(part) for part in value.split("/", 1))
    result = Fraction(numerator, denominator)
    if value != f"{result.numerator}/{result.denominator}":
        raise ReplayError("noncanonical lambda rational")
    return result


def _parse_dps(value: Any) -> int:
    if not isinstance(value, str) or value not in CANONICAL_DPS:
        raise ReplayError("precision inventory mismatch")
    return int(value)


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


def _integer_text(value: Any, label: str) -> int:
    if not isinstance(value, str) or _INTEGER_TEXT.fullmatch(value) is None:
        raise ReplayError(f"noncanonical integer text: {label}")
    return int(value)


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
            raise ReplayError(f"noncanonical zero: {label}")
        return Fraction(0)
    if mantissa % 2 == 0 or bits != mantissa.bit_length():
        raise ReplayError(f"nonnormalized dyadic: {label}")
    signed = -mantissa if sign else mantissa
    return Fraction(signed * 2**exponent) if exponent >= 0 else Fraction(signed, 2 ** (-exponent))


def _precision_bits(dps: int) -> int:
    return dps * LOG2_10_UPPER_NUMERATOR // LOG2_10_UPPER_DENOMINATOR + 2


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
        display_lo, display_hi = mp.mpf(decimal[0]), mp.mpf(decimal[1])
    except ValueError as exc:
        raise ReplayError(f"unparseable decimal interval: {label}") from exc
    if not (mp.isfinite(display_lo) and mp.isfinite(display_hi)) or display_lo > display_hi:
        raise ReplayError(f"invalid decimal interval: {label}")
    if lo != hi and label != "four_M_squared_minus_R":
        magnitude = max(abs(lo), abs(hi))
        allowed = magnitude / (1 << max(1, _precision_bits(dps) - 25))
        if magnitude == 0 or hi - lo > allowed:
            raise ReplayError(f"interval too wide for declared precision: {label}")
    return lo, hi


def _iv_bounds(value: object) -> tuple[Fraction, Fraction]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]

    def convert(raw: object) -> Fraction:
        sign, mantissa, exponent, _bits = (int(part) for part in raw)  # type: ignore[arg-type]
        signed = -mantissa if sign else mantissa
        return Fraction(signed * 2**exponent) if exponent >= 0 else Fraction(signed, 2 ** (-exponent))

    return convert(lower), convert(upper)


def _contains(serialized: Any, reconstructed: object, label: str, dps: int) -> tuple[Fraction, Fraction]:
    lo, hi = _interval(serialized, label, dps)
    expected_lo, expected_hi = _iv_bounds(reconstructed)
    if lo > expected_lo or hi < expected_hi:
        raise ReplayError(f"interval misses independent reconstruction: {label}")
    return lo, hi


def _ceil_interval(value: object) -> int:
    lo, hi = _iv_bounds(value)
    ceil_lo = -((-lo.numerator) // lo.denominator)
    ceil_hi = -((-hi.numerator) // hi.denominator)
    if ceil_lo != ceil_hi:
        raise ReplayError("independent interval ceiling undecidable")
    return ceil_lo


def _validate_bindings(binding: Any) -> None:
    if not isinstance(binding, dict) or set(binding) != {"formula_version", "source_hashes", "implementation_hashes"}:
        raise ReplayError("source binding inventory mismatch")
    if binding["formula_version"] != FORMULA_VERSION or binding["source_hashes"] != dict(sorted(SOURCE_HASHES.items())):
        raise ReplayError("formula/source binding mutation")
    for relative, expected in SOURCE_HASHES.items():
        if _sha256(_root() / relative) != expected:
            raise ReplayError(f"live source hash mismatch: {relative}")
    implementations = binding["implementation_hashes"]
    if not isinstance(implementations, dict) or set(implementations) != set(EXPECTED_IMPLEMENTATIONS):
        raise ReplayError("implementation hash inventory mismatch")
    for name, relative in EXPECTED_IMPLEMENTATIONS.items():
        item = implementations[name]
        if not isinstance(item, dict) or item.get("path") != relative or set(item) != {"path", "sha256"}:
            raise ReplayError(f"implementation binding mutation: {name}")
        if item["sha256"] != _sha256(_root() / relative):
            raise ReplayError(f"implementation byte mismatch: {name}")


def _ceil_sqrt_by_search(value: Fraction) -> int:
    candidate = max(1, isqrt(value.numerator) // max(1, isqrt(value.denominator)))
    while Fraction(candidate * candidate) < value:
        candidate += 1
    while candidate > 1 and Fraction((candidate - 1) ** 2) >= value:
        candidate -= 1
    return candidate


def _reconstruct(lam: Fraction, dps: int) -> tuple[dict[str, Any], dict[str, object]]:
    square = Fraction(lam.numerator**2, lam.denominator**2)
    n_value = (square.numerator + square.denominator - 1) // square.denominator
    d_value = 2 * n_value + 1
    even_d, odd_d = n_value + 1, n_value
    r_value = _ceil_sqrt_by_search(lam)
    c_fraction = Fraction(7 + 44 * square, 7)
    iota = lam / (r_value * c_fraction)
    gamma = Fraction(28 + 132 * square, 7)
    exact = {
        "lambda": lam,
        "lambda_squared": square,
        "N": n_value,
        "d": d_value,
        "inversion_even_dimension": even_d,
        "inversion_odd_dimension": odd_d,
        "r_lambda": r_value,
        "C_lambda": c_fraction,
        "iota_lambda": iota,
        "Gamma_lambda": gamma,
        "delta_squared": Fraction(1, 16 * d_value) / square,
        "trace_upper": Fraction(1, 16) / square,
        "trace_stop": Fraction(1, 8) / square,
        "unsigned_coframe_floor": Fraction(9, 128) / square**2,
    }

    mp.iv.dps = dps
    iv = mp.iv.mpf
    x = iv(lam.numerator) / iv(lam.denominator)
    ell = mp.iv.log(x)
    length = ell + ell
    gamma_iv = iv(gamma.numerator) / iv(gamma.denominator)
    c_value = mp.iv.pi * (iv(2) * x**2)
    ground_sup = mp.iv.sqrt(iv(3)) / iv(2) + iv(4) * mp.iv.pi * x**2 / mp.iv.sqrt(iv(5))
    ground_integral = mp.iv.sqrt(x) / ground_sup
    kappa = iv(1) + mp.iv.sqrt(iv(2) * x) / (iv(iota.numerator) / iv(iota.denominator))
    b_value = iv(8 * n_value) * mp.iv.pi / ell + iv(8) * ell + iv(14)
    v_upper = b_value * x**2 * mp.iv.sqrt(iv(d_value) / length)
    delta = iv(1) / (mp.iv.sqrt(iv(16 * d_value)) * x)
    rho = delta**2 / (iv(4) * gamma_iv**2 * v_upper**2)
    a_upper = mp.iv.sqrt(iv(8)) * x**2
    r_upper = (
        iv(2048) * gamma_iv**2 * x**10 * iv(d_value)
        * (
            gamma_iv**2 * x**2 * iv(d_value**3) * b_value**4 / length**2
            + mp.iv.pi**2
        )
    )
    root_r = mp.iv.sqrt(r_upper) / iv(2)
    first_m = iv(16) * mp.iv.sqrt(iv(2)) * (gamma_iv * x**3 * iv(d_value) * b_value) ** 2 / length
    second_m = iv(16) * mp.iv.sqrt(iv(2 * d_value)) * mp.iv.pi * gamma_iv * x**5
    m_expression = first_m + second_m
    mhat_expression = (
        (iv(10240000) / iv(49)) * mp.iv.sqrt(iv(2))
        * (iv(32) * mp.iv.pi + iv(18))**2 * x**18 / length**3
        + (iv(2560) / iv(7)) * mp.iv.sqrt(iv(10)) * mp.iv.pi * x**8
    )
    m_value = _ceil_interval(m_expression)
    intervals: dict[str, object] = {
        "L": length,
        "c": c_value,
        "ground_supremum_upper": ground_sup,
        "analytic_I0_lower_expression": ground_integral,
        "kappa_from_rational_iota": kappa,
        "B_lambda_N": b_value,
        "V_upper": v_upper,
        "delta": delta,
        "rho": rho,
        "A_upper": a_upper,
        "R_upper": r_upper,
        "sqrt_R_over_2": root_r,
        "M_expression": m_expression,
        "Mhat_expression": mhat_expression,
        "four_M_squared_minus_R": iv(4 * m_value * m_value) - r_upper,
    }
    return exact, intervals


def replay(payload: dict[str, Any], producer_bytes: bytes | None = None) -> dict[str, Any]:
    _reject_float_or_secret(payload)
    if getattr(mp, "__version__", None) != EXPECTED_MPMATH_VERSION:
        raise ReplayError("mpmath runtime mismatch")
    expected_top = {
        "schema", "formula_version", "claim_class", "terminal_state", "inputs",
        "source_binding", "source_conventions", "formula_inventory", "certificate",
        "claim_boundary", "arithmetic_libraries",
    }
    if not isinstance(payload, dict) or set(payload) != expected_top:
        raise ReplayError("producer artifact inventory mismatch")
    if (
        payload["schema"] != PRODUCER_SCHEMA
        or payload["formula_version"] != FORMULA_VERSION
        or payload["claim_class"] != CLAIM_CLASS
        or payload["terminal_state"] != TERMINAL_STATE
    ):
        raise ReplayError("fixed metadata mutation")
    if payload["source_conventions"] != EXPECTED_CONVENTIONS:
        raise ReplayError("source convention mutation")
    if payload["formula_inventory"] != EXPECTED_FORMULAS:
        raise ReplayError("formula inventory mutation")
    if payload["claim_boundary"] != EXPECTED_CLAIMS:
        raise ReplayError("claim boundary mutation")
    if payload["arithmetic_libraries"] != EXPECTED_LIBRARIES:
        raise ReplayError("arithmetic library disclosure mutation")
    _validate_bindings(payload["source_binding"])

    inputs = payload["inputs"]
    if not isinstance(inputs, dict) or set(inputs) != {"lambda", "dps", "N_rule"}:
        raise ReplayError("input inventory mismatch")
    if inputs["N_rule"] != "ceil(lambda^2)":
        raise ReplayError("N rule mutation")
    lam = _parse_lambda(inputs["lambda"])
    dps = _parse_dps(inputs["dps"])

    certificate = payload["certificate"]
    if not isinstance(certificate, dict) or set(certificate) != {"exact", "intervals", "integers", "checks"}:
        raise ReplayError("certificate inventory mismatch")
    exact_expected, interval_expected = _reconstruct(lam, dps)
    exact_artifact = certificate["exact"]
    if not isinstance(exact_artifact, dict) or set(exact_artifact) != set(exact_expected):
        raise ReplayError("exact inventory mismatch")
    for key, expected in exact_expected.items():
        if isinstance(expected, Fraction):
            actual: Any = _fraction(exact_artifact[key], key)
        elif type(expected) is int:
            actual = exact_artifact[key]
            if type(actual) is not int:
                raise ReplayError(f"non-integer exact field: {key}")
        else:
            raise ReplayError(f"unexpected exact reconstruction type: {key}")
        if actual != expected:
            raise ReplayError(f"exact formula mismatch: {key}")

    interval_artifact = certificate["intervals"]
    if not isinstance(interval_artifact, dict) or set(interval_artifact) != set(interval_expected):
        raise ReplayError("interval inventory mismatch")
    serialized_bounds = {
        key: _contains(interval_artifact[key], value, key, dps)
        for key, value in interval_expected.items()
    }

    integers = certificate["integers"]
    expected_integer_keys = {
        "terminal_count_M", "terminal_mode_index_2M",
        "simplified_terminal_count_Mhat", "simplified_terminal_mode_index_2Mhat",
    }
    if not isinstance(integers, dict) or set(integers) != expected_integer_keys:
        raise ReplayError("integer output inventory mismatch")
    terminal = _integer_text(integers["terminal_count_M"], "M")
    terminal_mode = _integer_text(integers["terminal_mode_index_2M"], "2M")
    simplified = _integer_text(integers["simplified_terminal_count_Mhat"], "Mhat")
    simplified_mode = _integer_text(integers["simplified_terminal_mode_index_2Mhat"], "2Mhat")
    reconstructed_terminal = _ceil_interval(interval_expected["M_expression"])
    reconstructed_simplified = _ceil_interval(interval_expected["Mhat_expression"])
    if (
        terminal != reconstructed_terminal or terminal_mode != 2 * terminal
        or simplified != reconstructed_simplified or simplified_mode != 2 * simplified
    ):
        raise ReplayError("terminal integer reconstruction mismatch")

    checks_artifact = certificate["checks"]
    if not isinstance(checks_artifact, dict) or set(checks_artifact) != EXPECTED_CHECK_KEYS:
        raise ReplayError("producer check inventory mismatch")
    if any(value is not True for value in checks_artifact.values()):
        raise ReplayError("producer reports a failed check")

    rho_lo, rho_hi = _iv_bounds(interval_expected["rho"])
    i0_lo, _i0_hi = _iv_bounds(interval_expected["analytic_I0_lower_expression"])
    _kappa_lo, kappa_hi = _iv_bounds(interval_expected["kappa_from_rational_iota"])
    margin_lo, _margin_hi = _iv_bounds(interval_expected["four_M_squared_minus_R"])
    split_lo, _split_hi = _iv_bounds(
        interval_expected["M_expression"] - interval_expected["sqrt_R_over_2"]  # type: ignore[operator]
    )
    independently_passed = {
        "N_is_ceil_not_floor": exact_expected["N"] > exact_expected["lambda_squared"],
        "full_two_parity_dimension": (
            exact_expected["inversion_even_dimension"] + exact_expected["inversion_odd_dimension"]
            == exact_expected["d"]
        ),
        "rational_iota_below_I0_expression": exact_expected["iota_lambda"] <= i0_lo,
        "kappa_below_Gamma": kappa_hi <= exact_expected["Gamma_lambda"],
        "rho_in_unit_interval": rho_lo > 0 and rho_hi < 1,
        "terminal_split_above_sqrt_R": split_lo > 0,
        "terminal_margin_positive": margin_lo > 0,
        "simplified_terminal_dominates": simplified >= terminal,
        "trace_strictly_stops": exact_expected["trace_upper"] < exact_expected["trace_stop"],
        "unsigned_floor_positive": exact_expected["unsigned_coframe_floor"] > 0,
        "signed_claim_absent": payload["claim_boundary"]["signed_physical_floor_proved"] is False,
    }
    if not all(independently_passed.values()):
        raise ReplayError("independent theorem gate failed")

    if producer_bytes is None:
        producer_bytes = (json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n").encode("utf-8")
    return {
        "schema": REPLAY_SCHEMA,
        "formula_version": FORMULA_VERSION,
        "terminal_state": TERMINAL_STATE,
        "inputs": dict(inputs),
        "producer_binding": {"sha256": hashlib.sha256(producer_bytes).hexdigest()},
        "reconstructed": {
            "N": exact_expected["N"],
            "d": exact_expected["d"],
            "inversion_even_dimension": exact_expected["inversion_even_dimension"],
            "inversion_odd_dimension": exact_expected["inversion_odd_dimension"],
            "interval_count": len(interval_expected),
            "terminal_count_M": str(terminal),
            "simplified_terminal_count_Mhat": str(simplified),
            "source_hash_count": len(SOURCE_HASHES),
            "implementation_hash_count": len(EXPECTED_IMPLEMENTATIONS),
        },
        "independent_checks": independently_passed,
        "arithmetic_libraries": EXPECTED_LIBRARIES,
    }


def canonical_bytes(payload: dict[str, Any]) -> bytes:
    return (json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n").encode("utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    input_path = Path(args.input)
    raw = input_path.read_bytes()
    try:
        payload = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise ReplayError("invalid producer JSON") from exc
    report = replay(payload, producer_bytes=raw)
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes(canonical_bytes(report))


if __name__ == "__main__":
    main()
