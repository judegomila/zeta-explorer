#!/usr/bin/env python3
"""Produce the explicit unsigned mixed-prefix cost certificate.

This bounded executable evaluates the explicit majorant proved in
``notes/EXPLICIT_MIXED_PREFIX_COST_ATTACK.md``.  It does not execute the
actual prolate trace schedule and proves no signed floor or RH statement.
"""
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


SCHEMA = "xi-prolate-explicit-mixed-prefix-cost-v1"
FORMULA_VERSION = "0.43-explicit-mixed-prefix-cost-v1"
CLAIM_CLASS = "EXPLICIT_UNSIGNED_MIXED_PREFIX_COST_AUDIT"
TERMINAL_STATE = "P0_INVALIDATED"
EXPECTED_MPMATH_VERSION = "1.4.1"

CANONICAL_LAMBDAS = {"5/2", "9/2"}
CANONICAL_DPS = {"80", "160"}
_RATIONAL_TEXT = re.compile(r"[1-9][0-9]*/[1-9][0-9]*\Z")
_POSITIVE_INTEGER_TEXT = re.compile(r"[1-9][0-9]*\Z")

SOURCE_HASHES = {
    "notes/EXPLICIT_MIXED_PREFIX_COST_ATTACK.md":
        "c3b1bcc9318c417246c52cd5d3b9bbfaa2d04cd0070e0c8cdc54862f7fcf02f8",
    "EFFECTIVE_MIXED_ENDPOINT_JUMP_SOURCE_LOCK.json":
        "24ea8f8085e9e198201006f54e0499495174053e38f6c26185cd2b2f60725fcc",
    "requirements.txt":
        "458f06e2b5d6e73acc7a4f72af69afe920764c71127578555044815cd785c0fa",
}

LOG2_10_UPPER_NUMERATOR = 3321928094887363
LOG2_10_UPPER_DENOMINATOR = 10**15
SERIALIZATION_GUARD_OFFSET_BITS = 18

SOURCE_CONVENTIONS = {
    "source_interval": "[-lambda,lambda] with Lebesgue measure and zero extension",
    "physical_interval": "[-log(lambda),log(lambda)] with L=2*log(lambda)",
    "fourier_basis": "phi_k(s)=(-1)^k*L^(-1/2)*exp(2*pi*i*k*s/L)",
    "prolate_parameter": "c=2*pi*lambda^2",
    "target_rule": "N=ceil(lambda^2)",
    "target_dimension": "d=2*N+1=(N+1 inversion-even)+(N inversion-odd)",
    "source_prefix": "F_M=span(c_2,c_4,...,c_(2*M))",
    "terminal_label": "largest prolate mode index is 2*M",
}

FORMULAS = {
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

ARITHMETIC_LIBRARIES = {
    "precision_mode": "exact reduced rationals plus outward arbitrary-precision intervals",
    "libraries": ["Python fractions.Fraction", "mpmath.iv 1.4.1"],
    "raw_interval_or_ball_output_applicable": True,
    "shared_library_with_verifier": True,
    "independent_formula_trees_required": True,
    "serialization_guard": "nondegenerate intervals receive a precision-scaled dyadic enlargement",
    "independence_limitation": "producer and verifier share Python integer/Fraction arithmetic and pinned mpmath.iv 1.4.1",
}

CLAIM_BOUNDARY = {
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


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _parse_lambda(value: Any) -> tuple[str, Fraction]:
    if not isinstance(value, str) or _RATIONAL_TEXT.fullmatch(value) is None:
        raise TypeError("lambda must be canonical exact rational text")
    numerator_text, denominator_text = value.split("/", 1)
    result = Fraction(int(numerator_text), int(denominator_text))
    canonical = f"{result.numerator}/{result.denominator}"
    if value != canonical:
        raise ValueError("lambda rational text is not reduced canonical form")
    if value not in CANONICAL_LAMBDAS:
        raise ValueError("lambda is outside the deterministic pilot inventory")
    return value, result


def _parse_dps(value: Any) -> tuple[str, int]:
    if not isinstance(value, str) or _POSITIVE_INTEGER_TEXT.fullmatch(value) is None:
        raise TypeError("dps must be canonical positive integer text")
    if value not in CANONICAL_DPS:
        raise ValueError("dps is outside the deterministic pilot inventory")
    return value, int(value)


def _ceil_fraction(value: Fraction) -> int:
    return -((-value.numerator) // value.denominator)


def _ceil_sqrt_fraction(value: Fraction) -> int:
    if value <= 0:
        raise ValueError("positive rational required")
    candidate = isqrt(value.numerator // value.denominator)
    while Fraction(candidate * candidate) < value:
        candidate += 1
    while candidate > 0 and Fraction((candidate - 1) ** 2) >= value:
        candidate -= 1
    return candidate


def _validate_runtime_and_sources() -> dict[str, Any]:
    if getattr(mp, "__version__", None) != EXPECTED_MPMATH_VERSION:
        raise RuntimeError("mpmath runtime mismatch")
    for relative, expected in SOURCE_HASHES.items():
        if _sha256(_root() / relative) != expected:
            raise ValueError(f"source binding mismatch: {relative}")
    implementation = {
        "producer": "src/explicit_mixed_prefix_cost.py",
        "verifier": "verifier/explicit_mixed_prefix_cost_replay.py",
    }
    for relative in implementation.values():
        if not (_root() / relative).is_file():
            raise ValueError(f"missing implementation path: {relative}")
    return {
        "formula_version": FORMULA_VERSION,
        "source_hashes": dict(sorted(SOURCE_HASHES.items())),
        "implementation_hashes": {
            name: {"path": relative, "sha256": _sha256(_root() / relative)}
            for name, relative in implementation.items()
        },
    }


def _encode(value: Any) -> Any:
    if isinstance(value, Fraction):
        return {"numerator": str(value.numerator), "denominator": str(value.denominator)}
    if isinstance(value, dict):
        return {key: _encode(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [_encode(item) for item in value]
    return value


def _assert_strict_json(value: Any) -> None:
    if isinstance(value, float):
        raise TypeError("binary64 value reached serialization")
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


def _serialize_interval(value: object, dps: int, scale_hint: object | None = None) -> dict[str, Any]:
    lower_raw, upper_raw = value._mpi_  # type: ignore[attr-defined]
    lower = tuple(int(part) for part in lower_raw)
    upper = tuple(int(part) for part in upper_raw)
    if lower != upper:
        scale = max(
            exponent + bits - 1 if mantissa else 0
            for _sign, mantissa, exponent, bits in (lower, upper)
        )
        if scale_hint is not None:
            hint_lower, hint_upper = scale_hint._mpi_  # type: ignore[attr-defined]
            scale = max(
                scale,
                *(
                    int(raw[2]) + int(raw[3]) - 1 if int(raw[1]) else 0
                    for raw in (hint_lower, hint_upper)
                ),
            )
        guard = scale - _precision_bits(dps) + SERIALIZATION_GUARD_OFFSET_BITS
        lower = _shift_raw(lower, guard, -1)
        upper = _shift_raw(upper, guard, 1)
    if _raw_fraction(lower) > _raw_fraction(upper):
        raise ArithmeticError("reversed interval")
    raw = lambda item: [item[0], str(item[1]), item[2], item[3]]
    with mp.workdps(dps + 20):
        return {
            "decimal": [mp.nstr(mp.mpf(lower), dps + 10), mp.nstr(mp.mpf(upper), dps + 10)],
            "dyadic": {"lower": raw(lower), "upper": raw(upper)},
        }


def _interval_bounds(value: object) -> tuple[Fraction, Fraction]:
    lower, upper = value._mpi_  # type: ignore[attr-defined]
    return (
        _raw_fraction(tuple(int(part) for part in lower)),
        _raw_fraction(tuple(int(part) for part in upper)),
    )


def _ceil_interval(value: object) -> int:
    lower, upper = _interval_bounds(value)
    low_ceil, high_ceil = _ceil_fraction(lower), _ceil_fraction(upper)
    if low_ceil != high_ceil:
        raise ArithmeticError("interval ceiling is undecidable at declared precision")
    return low_ceil


def _cost_certificate(lam: Fraction, dps: int) -> dict[str, Any]:
    lam_squared = lam * lam
    n_value = _ceil_fraction(lam_squared)
    dimension = 2 * n_value + 1
    even_dimension = n_value + 1
    odd_dimension = n_value
    r_value = _ceil_sqrt_fraction(lam)
    c_rational = Fraction(1) + Fraction(44, 7) * lam_squared
    iota = lam / (r_value * c_rational)
    gamma = Fraction(4) + Fraction(132, 7) * lam_squared
    delta_squared = Fraction(1, 16) / (dimension * lam_squared)
    trace_upper = Fraction(1, 16) / lam_squared
    trace_stop = Fraction(1, 8) / lam_squared
    floor = Fraction(9, 128) / (lam_squared * lam_squared)

    mp.iv.dps = dps
    iv = mp.iv.mpf
    lam_iv = iv(lam.numerator) / iv(lam.denominator)
    gamma_iv = iv(gamma.numerator) / iv(gamma.denominator)
    length = iv(2) * mp.iv.log(lam_iv)
    c_value = iv(2) * mp.iv.pi * lam_iv**2
    ground_sup = mp.iv.sqrt(iv(3)) / iv(2) + iv(2) * c_value / mp.iv.sqrt(iv(5))
    ground_integral_lower = mp.iv.sqrt(lam_iv) / ground_sup
    kappa_from_iota = iv(1) + mp.iv.sqrt(iv(2) * lam_iv) * iv(iota.denominator) / iv(iota.numerator)
    b_value = iv(16 * n_value) * mp.iv.pi / length + iv(4) * length + iv(14)
    v_upper = lam_iv**2 * mp.iv.sqrt(iv(dimension) / length) * b_value
    delta = iv(1) / (iv(4) * mp.iv.sqrt(iv(dimension)) * lam_iv)
    rho = length / (
        iv(64) * gamma_iv**2 * lam_iv**6 * iv(dimension**2) * b_value**2
    )
    a_upper = iv(2) * mp.iv.sqrt(iv(2)) * lam_iv**2
    r_upper = (
        iv(2048) * gamma_iv**4 * lam_iv**12 * iv(dimension**4) * b_value**4 / length**2
        + iv(2048) * mp.iv.pi**2 * gamma_iv**2 * lam_iv**10 * iv(dimension)
    )
    root_r_over_two = mp.iv.sqrt(r_upper) / iv(2)
    m_expression = (
        iv(16) * mp.iv.sqrt(iv(2)) * gamma_iv**2 * lam_iv**6
        * iv(dimension**2) * b_value**2 / length
        + iv(16) * mp.iv.sqrt(iv(2)) * mp.iv.pi * gamma_iv
        * lam_iv**5 * mp.iv.sqrt(iv(dimension))
    )
    m_value = _ceil_interval(m_expression)
    mhat_expression = (
        iv(400) * mp.iv.sqrt(iv(2)) * (iv(160) / iv(7))**2
        * (iv(32) * mp.iv.pi + iv(18))**2 * lam_iv**18 / length**3
        + iv(2560) * mp.iv.sqrt(iv(10)) * mp.iv.pi * lam_iv**8 / iv(7)
    )
    mhat_value = _ceil_interval(mhat_expression)
    terminal_margin = iv(4 * m_value * m_value) - r_upper

    i0_lower_bound = _interval_bounds(ground_integral_lower)[0]
    kappa_upper = _interval_bounds(kappa_from_iota)[1]
    rho_lower, rho_upper = _interval_bounds(rho)
    margin_lower, _margin_upper = _interval_bounds(terminal_margin)
    split_lower, _split_upper = _interval_bounds(m_expression - root_r_over_two)
    checks = {
        "N_is_ceil_lambda_squared": n_value == _ceil_fraction(lam_squared),
        "both_parities_fill_dimension": even_dimension + odd_dimension == dimension,
        "rational_iota_below_analytic_I0_lower": Fraction(iota) <= i0_lower_bound,
        "kappa_below_Gamma": kappa_upper <= gamma,
        "rho_strictly_between_zero_and_one": rho_lower > 0 and rho_upper < 1,
        "split_square_root_majorant_positive": split_lower > 0,
        "terminal_integer_dominates_R": margin_lower > 0,
        "simplified_terminal_dominates_general": mhat_value >= m_value,
        "trace_bound_strictly_stops": trace_upper < trace_stop,
        "unsigned_floor_positive": floor > 0,
        "no_actual_prolate_trace_claim": CLAIM_BOUNDARY["actual_first_trace_stopping_label_computed"] is False,
        "no_signed_claim": CLAIM_BOUNDARY["signed_physical_floor_proved"] is False,
    }
    if not all(checks.values()):
        raise ArithmeticError("explicit cost certificate regression")

    intervals = {
        "L": _serialize_interval(length, dps),
        "c": _serialize_interval(c_value, dps),
        "ground_supremum_upper": _serialize_interval(ground_sup, dps),
        "analytic_I0_lower_expression": _serialize_interval(ground_integral_lower, dps),
        "kappa_from_rational_iota": _serialize_interval(kappa_from_iota, dps),
        "B_lambda_N": _serialize_interval(b_value, dps),
        "V_upper": _serialize_interval(v_upper, dps),
        "delta": _serialize_interval(delta, dps),
        "rho": _serialize_interval(rho, dps),
        "A_upper": _serialize_interval(a_upper, dps),
        "R_upper": _serialize_interval(r_upper, dps),
        "sqrt_R_over_2": _serialize_interval(root_r_over_two, dps),
        "M_expression": _serialize_interval(m_expression, dps),
        "Mhat_expression": _serialize_interval(mhat_expression, dps),
        "four_M_squared_minus_R": _serialize_interval(terminal_margin, dps, r_upper),
    }
    return {
        "exact": _encode({
            "lambda": lam,
            "lambda_squared": lam_squared,
            "N": n_value,
            "d": dimension,
            "inversion_even_dimension": even_dimension,
            "inversion_odd_dimension": odd_dimension,
            "r_lambda": r_value,
            "C_lambda": c_rational,
            "iota_lambda": iota,
            "Gamma_lambda": gamma,
            "delta_squared": delta_squared,
            "trace_upper": trace_upper,
            "trace_stop": trace_stop,
            "unsigned_coframe_floor": floor,
        }),
        "intervals": intervals,
        "integers": {
            "terminal_count_M": str(m_value),
            "terminal_mode_index_2M": str(2 * m_value),
            "simplified_terminal_count_Mhat": str(mhat_value),
            "simplified_terminal_mode_index_2Mhat": str(2 * mhat_value),
        },
        "checks": checks,
    }


def produce(lambda_text: Any, dps_text: Any) -> dict[str, Any]:
    canonical_lambda, lam = _parse_lambda(lambda_text)
    canonical_dps, dps = _parse_dps(dps_text)
    source_binding = _validate_runtime_and_sources()
    certificate = _cost_certificate(lam, dps)
    payload = {
        "schema": SCHEMA,
        "formula_version": FORMULA_VERSION,
        "claim_class": CLAIM_CLASS,
        "terminal_state": TERMINAL_STATE,
        "inputs": {
            "lambda": canonical_lambda,
            "dps": canonical_dps,
            "N_rule": "ceil(lambda^2)",
        },
        "source_binding": source_binding,
        "source_conventions": SOURCE_CONVENTIONS,
        "formula_inventory": FORMULAS,
        "certificate": certificate,
        "claim_boundary": CLAIM_BOUNDARY,
        "arithmetic_libraries": ARITHMETIC_LIBRARIES,
    }
    _assert_strict_json(payload)
    return payload


def canonical_bytes(payload: dict[str, Any]) -> bytes:
    return (json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n").encode("utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lambda", dest="lambda_text", required=True)
    parser.add_argument("--dps", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes(canonical_bytes(produce(args.lambda_text, args.dps)))


if __name__ == "__main__":
    main()
