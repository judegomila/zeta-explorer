#!/usr/bin/env python3
"""Independent interval replay of the explicit prolate tail envelope.

This verifier deliberately does not import ``src/prolate_tail_envelope.py``
or ``src/transition_window_bound.py``.  It reconstructs every transcendental
quantity from the exact textual value of ``lambda`` using ``mpmath.iv`` and
compares its enclosures with the producer's serialized enclosures.

The replay checks only the explicit far-frequency envelope.  It makes no
claim about the near Chebyshev integral, a signed Weil comparison, equation
(5.2) of ``DIRECT_RH_ATTACK.md``, or RH.
"""
from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from fractions import Fraction
from pathlib import Path
from typing import Mapping, Sequence

import mpmath as mp


LOCKED_BETA_FORMULA = "(2/pi^2)*log(200*lambda^2+25)"
LOCKED_D_FORMULA = "10*exp(-(floor(4*lambda^2)-11)/beta)"
LOCKED_A4_FORMULA = "sqrt(3)/2^(11/4)"
LOCKED_CPSI_FORMULA = (
    "40*3^(-1/4)*exp(-(1+sqrt(3))/2)/(1-1/sqrt(3))^2"
)
LOCKED_MODE_TERM_FORMULA = (
    "16*pi*a4*(1+2*sqrt(2)*lambda)*lambda^(3/2)*sqrt(D)"
)
LOCKED_BUMP_TERM_FORMULA = (
    "(2*sqrt(2)*a4/pi)*Cpsi*lambda^(3/2)*D"
)
LOCKED_ENDPOINT_TERM_FORMULA = (
    "16*pi*a4*(1+2*sqrt(2)*lambda)*sqrt(lambda*D)"
)
LOCKED_FOURIER_SIGN = "exp(+2*pi*i*x*xi)"
LOCKED_CONCENTRATION_SQUARE = "Lambda_n=chi_n^2; d_n=1-chi_n^2"
LOCKED_NORMALIZATION = "source_limit_h"
# Descriptive aliases keep the replay API readable without importing or
# depending on the producer module.
LOCKED_FOURIER_CONVENTION = LOCKED_FOURIER_SIGN
LOCKED_DEFECT_FORMULA = LOCKED_CONCENTRATION_SQUARE
LOCKED_MODE_TERM = LOCKED_MODE_TERM_FORMULA
LOCKED_BUMP_TERM = LOCKED_BUMP_TERM_FORMULA
LOCKED_ENDPOINT_TERM = LOCKED_ENDPOINT_TERM_FORMULA

LOCKED_FORMULAS = {
    "Fourier": LOCKED_FOURIER_SIGN,
    "beta": LOCKED_BETA_FORMULA,
    "concentration": LOCKED_CONCENTRATION_SQUARE,
    "D": LOCKED_D_FORMULA,
    "a4": LOCKED_A4_FORMULA,
    "Cpsi": LOCKED_CPSI_FORMULA,
    "mode_term": LOCKED_MODE_TERM_FORMULA,
    "bump_term": LOCKED_BUMP_TERM_FORMULA,
    "endpoint_term": LOCKED_ENDPOINT_TERM_FORMULA,
    "normalization": LOCKED_NORMALIZATION,
}

INTERVAL_KEYS = (
    "beta",
    "D",
    "a4",
    "Cpsi",
    "11_over_sqrt2",
    "c_squared_over_8_minus_20",
    "mode_term",
    "bump_term",
    "total_bound_B_f",
    "corrected_endpoint_bound",
    "uniform_test_vector_C_lambda_N",
    "elementary_prime_tail",
    "far_prime_pairing_bound",
)


@dataclass(frozen=True)
class ClosedInterval:
    """A copied pair of outward endpoints."""

    lower: mp.mpf
    upper: mp.mpf

    def __post_init__(self) -> None:
        if self.lower > self.upper:
            raise ValueError("interval endpoints are reversed")


def parse_exact_lambda(lambda_text: str) -> Fraction:
    """Parse lambda through an exact rational path; binary64 is forbidden."""
    if not isinstance(lambda_text, str):
        raise TypeError("lambda must be exact decimal text (binary64 is forbidden)")
    try:
        lam = Fraction(lambda_text)
    except (ValueError, ZeroDivisionError) as exc:
        raise ValueError("invalid exact textual lambda") from exc
    if lam < 2:
        raise ValueError("the explicit prolate tail envelope requires lambda>=2")
    return lam


def require_precision(dps: int) -> int:
    if isinstance(dps, bool) or not isinstance(dps, int):
        raise TypeError("dps must be an integer")
    if dps < 30:
        raise ValueError("at least 30 interval decimal digits are required")
    return dps


def require_locked_conventions(
    *,
    Fourier: str = LOCKED_FOURIER_SIGN,
    beta: str = LOCKED_BETA_FORMULA,
    concentration: str = LOCKED_CONCENTRATION_SQUARE,
    D: str = LOCKED_D_FORMULA,
    a4: str = LOCKED_A4_FORMULA,
    Cpsi: str = LOCKED_CPSI_FORMULA,
    mode_term: str = LOCKED_MODE_TERM_FORMULA,
    bump_term: str = LOCKED_BUMP_TERM_FORMULA,
    endpoint_term: str = LOCKED_ENDPOINT_TERM_FORMULA,
    normalization: str = LOCKED_NORMALIZATION,
) -> None:
    """Reject convention changes before evaluating any numerical quantity."""
    supplied = {
        "Fourier": Fourier,
        "beta": beta,
        "concentration": concentration,
        "D": D,
        "a4": a4,
        "Cpsi": Cpsi,
        "mode_term": mode_term,
        "bump_term": bump_term,
        "endpoint_term": endpoint_term,
        "normalization": normalization,
    }
    for name, expected in LOCKED_FORMULAS.items():
        if supplied[name] != expected:
            if name == "Fourier":
                raise ValueError("additive Fourier sign differs from the source lock")
            if name == "D":
                raise ValueError("KRD leading-defect exponent differs from the lock")
            if name == "concentration":
                raise ValueError("concentration-square convention is required")
            raise ValueError(f"locked prolate-tail formula changed: {name}")


def _copy_interval(value: object, dps: int) -> ClosedInterval:
    """Copy an ``mpmath.iv`` result into stable arbitrary-precision endpoints."""
    raw_lower, raw_upper = value._mpi_  # type: ignore[attr-defined]
    with mp.workdps(dps + 20):
        return ClosedInterval(mp.mpf(raw_lower), mp.mpf(raw_upper))


def _iv_fraction(value: Fraction) -> object:
    return mp.iv.mpf(value.numerator) / mp.iv.mpf(value.denominator)


def _require_N(N: int) -> int:
    if isinstance(N, bool) or not isinstance(N, int):
        raise TypeError("N must be an exact JSON/Python integer")
    if N < 0:
        raise ValueError("N must be nonnegative")
    return N


def reconstruct(
    lambda_text: str, N: int, dps: int
) -> dict[str, ClosedInterval | int]:
    """Independently reconstruct beta, D, constants, and both tail terms."""
    lam_exact = parse_exact_lambda(lambda_text)
    N = _require_N(N)
    dps = require_precision(dps)
    lambda_squared = lam_exact * lam_exact
    four_lambda_squared = 4 * lambda_squared
    floor_4lambda2 = four_lambda_squared.numerator // four_lambda_squared.denominator
    floor_lambda2 = lambda_squared.numerator // lambda_squared.denominator
    exponent_numerator = floor_4lambda2 - 11
    if exponent_numerator <= 0:
        raise ValueError("the locked KRD leading exponent must be positive")

    old_iv_dps = mp.iv.dps
    try:
        mp.iv.dps = dps
        lam = _iv_fraction(lam_exact)
        beta = (mp.iv.mpf(2) / mp.iv.pi**2) * mp.iv.log(
            200 * lam**2 + 25
        )
        D = 10 * mp.iv.exp(-mp.iv.mpf(exponent_numerator) / beta)
        a4 = mp.iv.sqrt(3) / mp.iv.power(2, mp.iv.mpf(11) / 4)

        # phi'' changes sign only at x0=3^(-1/4).  Therefore
        # ||phi''||_1=8*x0*phi(x0)/(1-x0^2)^2.  Applying the triangle
        # inequality to psi''=8*phi''(2x)-phi''(x) gives
        # ||psi''||_1 <= 5||phi''||_1, namely this explicit Cpsi.
        x0 = mp.iv.power(3, -mp.iv.mpf(1) / 4)
        Cpsi = (
            40
            * x0
            * mp.iv.exp(-(1 + mp.iv.sqrt(3)) / 2)
            / (1 - 1 / mp.iv.sqrt(3)) ** 2
        )
        lambda_3_over_2 = lam * mp.iv.sqrt(lam)
        mode_term = (
            16
            * mp.iv.pi
            * a4
            * (1 + 2 * mp.iv.sqrt(2) * lam)
            * lambda_3_over_2
            * mp.iv.sqrt(D)
        )
        bump_term = (
            (2 * mp.iv.sqrt(2) * a4 / mp.iv.pi)
            * Cpsi
            * lambda_3_over_2
            * D
        )
        total_bound = mode_term + bump_term
        endpoint_bound = (
            16
            * mp.iv.pi
            * a4
            * (1 + 2 * mp.iv.sqrt(2) * lam)
            * mp.iv.sqrt(lam * D)
        )
        primitive_constant = 11 / mp.iv.sqrt(2)
        c_squared = (2 * mp.iv.pi * lam**2) ** 2
        mu_margin = c_squared / 8 - 20

        # Independently reconstruct the uniform trigonometric-polynomial
        # constants entering the far-prime correlation estimate.
        L = 2 * mp.iv.log(lam)
        M0 = mp.iv.sqrt(mp.iv.mpf(2 * N + 1) / L)
        M1 = (
            2
            * mp.iv.pi
            / (L * mp.iv.sqrt(L))
            * mp.iv.sqrt(
                mp.iv.mpf(N * (N + 1) * (2 * N + 1)) / 3
            )
        )
        inverse_lambda_3_over_2 = 1 / lambda_3_over_2
        test_vector_C = M0 * (
            lambda_3_over_2 + inverse_lambda_3_over_2
        ) + (mp.iv.mpf(2) / 3) * (
            lambda_3_over_2 - inverse_lambda_3_over_2
        ) * (
            M1 + M0 / 2
        )
        elementary_prime_tail = (mp.iv.log(floor_lambda2) + 1) / floor_lambda2
        far_prime_pairing = (
            mp.iv.pi
            / 12
            * total_bound
            * test_vector_C
            * elementary_prime_tail
        )
        results = {
            "floor_4lambda2": floor_4lambda2,
            "leading_exponent_numerator": exponent_numerator,
            "floor_lambda2": floor_lambda2,
            "beta": _copy_interval(beta, dps),
            "D": _copy_interval(D, dps),
            "a4": _copy_interval(a4, dps),
            "Cpsi": _copy_interval(Cpsi, dps),
            "11_over_sqrt2": _copy_interval(primitive_constant, dps),
            "c_squared_over_8_minus_20": _copy_interval(mu_margin, dps),
            "mode_term": _copy_interval(mode_term, dps),
            "bump_term": _copy_interval(bump_term, dps),
            "total_bound_B_f": _copy_interval(total_bound, dps),
            "corrected_endpoint_bound": _copy_interval(
                endpoint_bound, dps
            ),
            "uniform_test_vector_C_lambda_N": _copy_interval(
                test_vector_C, dps
            ),
            "elementary_prime_tail": _copy_interval(
                elementary_prime_tail, dps
            ),
            "far_prime_pairing_bound": _copy_interval(
                far_prime_pairing, dps
            ),
        }
    finally:
        mp.iv.dps = old_iv_dps

    D_interval = results["D"]
    assert isinstance(D_interval, ClosedInterval)
    if D_interval.upper > mp.mpf("0.5"):
        raise ArithmeticError("locked KRD estimate does not establish D<=1/2")
    primitive = results["11_over_sqrt2"]
    margin = results["c_squared_over_8_minus_20"]
    assert isinstance(primitive, ClosedInterval)
    assert isinstance(margin, ClosedInterval)
    if primitive.upper >= 8:
        raise ArithmeticError("the primitive constant is not enclosed below 8")
    if margin.lower <= 0:
        raise ArithmeticError("the independently reconstructed mu4 margin is nonpositive")
    return results


def _parse_text_interval(value: object, dps: int, name: str) -> ClosedInterval:
    """Parse a producer enclosure from decimal strings, never JSON floats."""
    if (
        not isinstance(value, Sequence)
        or isinstance(value, (str, bytes))
        or len(value) != 2
    ):
        raise TypeError(f"producer interval {name} must be a two-element array")
    lower_text, upper_text = value
    if not isinstance(lower_text, str) or not isinstance(upper_text, str):
        raise TypeError(
            f"producer interval {name} endpoints must be exact decimal text"
        )
    old_iv_dps = mp.iv.dps
    try:
        mp.iv.dps = dps
        parsed = mp.iv.mpf([lower_text, upper_text])
        result = _copy_interval(parsed, dps)
    finally:
        mp.iv.dps = old_iv_dps
    if not mp.isfinite(result.lower) or not mp.isfinite(result.upper):
        raise ValueError(f"producer interval {name} must have finite endpoints")
    if result.lower <= 0:
        raise ValueError(f"producer interval {name} must be strictly positive")
    return result


def intervals_overlap(left: ClosedInterval, right: ClosedInterval) -> bool:
    return max(left.lower, right.lower) <= min(left.upper, right.upper)


def _intersection(left: ClosedInterval, right: ClosedInterval) -> ClosedInterval | None:
    lower = max(left.lower, right.lower)
    upper = min(left.upper, right.upper)
    return ClosedInterval(lower, upper) if lower <= upper else None


def _artifact_dps(inputs: Mapping[str, object]) -> int:
    for key in ("interval_decimal_digits", "precision_decimal_digits", "dps"):
        if key in inputs:
            return require_precision(inputs[key])  # type: ignore[arg-type]
    raise KeyError("producer artifact omits its interval precision")


def replay_artifact(path: Path, dps: int | None = None) -> dict[str, object]:
    """Replay a producer artifact and require overlap for every enclosure."""
    producer = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(producer, Mapping):
        raise TypeError("producer artifact must contain a JSON object")
    inputs = producer.get("inputs")
    if not isinstance(inputs, Mapping):
        raise KeyError("producer artifact omits inputs")
    lambda_text = inputs.get("lambda")
    if not isinstance(lambda_text, str):
        raise TypeError("producer lambda must be exact text, never binary64")
    lambda_exact = parse_exact_lambda(lambda_text)
    supplied_lambda_exact = inputs.get("lambda_exact")
    if not isinstance(supplied_lambda_exact, str):
        raise TypeError("producer lambda_exact must be exact rational text")
    if supplied_lambda_exact != str(lambda_exact):
        raise ValueError("producer lambda_exact disagrees with textual lambda")
    N = _require_N(inputs.get("N"))  # type: ignore[arg-type]
    used_dps = require_precision(dps) if dps is not None else _artifact_dps(inputs)

    formulas = producer.get("locked_formulas")
    if not isinstance(formulas, Mapping):
        raise KeyError("producer artifact omits locked_formulas")
    missing_formulas = [key for key in LOCKED_FORMULAS if key not in formulas]
    if missing_formulas:
        raise KeyError(f"producer omits locked formulas: {missing_formulas}")
    require_locked_conventions(
        **{key: formulas[key] for key in LOCKED_FORMULAS}  # type: ignore[arg-type]
    )

    supplied_values = producer.get("outward_intervals")
    if not isinstance(supplied_values, Mapping):
        raise KeyError("producer artifact omits outward_intervals")
    missing_intervals = [key for key in INTERVAL_KEYS if key not in supplied_values]
    if missing_intervals:
        raise KeyError(f"producer omits outward intervals: {missing_intervals}")

    reconstructed = reconstruct(lambda_text, N, used_dps)
    supplied: dict[str, ClosedInterval] = {}
    overlap: dict[str, bool] = {}
    intersections: dict[str, ClosedInterval | None] = {}
    for key in INTERVAL_KEYS:
        supplied[key] = _parse_text_interval(
            supplied_values[key], used_dps, key
        )
        independent = reconstructed[key]
        assert isinstance(independent, ClosedInterval)
        overlap[key] = intervals_overlap(supplied[key], independent)
        intersections[key] = _intersection(supplied[key], independent)

    exact_integer_data = producer.get("exact_integer_data")
    if not isinstance(exact_integer_data, Mapping):
        raise KeyError("producer artifact omits exact_integer_data")
    integer_key_map = {
        "floor_4lambda_squared": "floor_4lambda2",
        "leading_exponent_numerator": "leading_exponent_numerator",
        "floor_lambda_squared": "floor_lambda2",
    }
    supplied_integers: dict[str, int] = {}
    integer_agreement: dict[str, bool] = {}
    for supplied_key, reconstructed_key in integer_key_map.items():
        supplied_value = exact_integer_data.get(supplied_key)
        if isinstance(supplied_value, bool) or not isinstance(supplied_value, int):
            raise TypeError(
                f"producer integer {supplied_key} must be an exact JSON integer"
            )
        supplied_integers[supplied_key] = supplied_value
        integer_agreement[supplied_key] = (
            supplied_value == reconstructed[reconstructed_key]
        )
    passed = all(integer_agreement.values()) and all(overlap.values())

    digits = used_dps + 10

    def interval_strings(value: ClosedInterval) -> list[str]:
        return [mp.nstr(value.lower, digits), mp.nstr(value.upper, digits)]

    return {
        "terminal_state": "P0_INVALIDATED",
        "claim_class": "EXPLICIT_PROLATE_TAIL_ENVELOPE_INTERVAL_REPLAY",
        "far_prime_component_analytic_uniform_claim": True,
        "full_residual_analytic_uniform_claim": False,
        "input_artifact": str(path),
        "inputs": {
            "lambda": lambda_text,
            "N": N,
            "interval_decimal_digits": used_dps,
            "arithmetic_library": f"mpmath.iv {mp.__version__}",
        },
        "locked_formulas": dict(LOCKED_FORMULAS),
        "exact_indices": {
            "producer": supplied_integers,
            "reconstructed": {
                supplied_key: reconstructed[reconstructed_key]
                for supplied_key, reconstructed_key in integer_key_map.items()
            },
            "agreement": integer_agreement,
        },
        "reconstructed_outward_intervals": {
            key: interval_strings(reconstructed[key])  # type: ignore[arg-type]
            for key in INTERVAL_KEYS
        },
        "producer_outward_intervals": {
            key: interval_strings(supplied[key]) for key in INTERVAL_KEYS
        },
        "intersection_intervals": {
            key: (
                interval_strings(intersections[key])
                if intersections[key] is not None
                else None
            )
            for key in INTERVAL_KEYS
        },
        "intervals_overlap": overlap,
        "producer_values_used_only_for_comparison": True,
        "replay_agrees": passed,
        "limitations": [
            "producer and verifier share the mpmath.iv arithmetic library",
            "mpmath.iv is outward interval arithmetic but is not an independent Arb/MPFI implementation",
            "this replays only the explicit far-frequency prolate envelope",
            "no near-prime signed comparison, physical-map conditioning, determinant convergence, or RH claim",
        ],
    }


def standalone_report(lambda_text: str, N: int, dps: int) -> dict[str, object]:
    """Emit an independent enclosure without reading a producer artifact."""
    reconstructed = reconstruct(lambda_text, N, dps)
    digits = dps + 10

    def interval_strings(value: ClosedInterval) -> list[str]:
        return [mp.nstr(value.lower, digits), mp.nstr(value.upper, digits)]

    return {
        "terminal_state": "P0_INVALIDATED",
        "claim_class": "EXPLICIT_PROLATE_TAIL_ENVELOPE_INTERVAL_RECONSTRUCTION",
        "far_prime_component_analytic_uniform_claim": True,
        "full_residual_analytic_uniform_claim": False,
        "inputs": {
            "lambda": lambda_text,
            "N": N,
            "interval_decimal_digits": dps,
            "arithmetic_library": f"mpmath.iv {mp.__version__}",
        },
        "locked_formulas": dict(LOCKED_FORMULAS),
        "exact_integer_data": {
            "floor_4lambda_squared": reconstructed["floor_4lambda2"],
            "leading_exponent_numerator": reconstructed[
                "leading_exponent_numerator"
            ],
            "floor_lambda_squared": reconstructed["floor_lambda2"],
        },
        "outward_intervals": {
            key: interval_strings(reconstructed[key])  # type: ignore[arg-type]
            for key in INTERVAL_KEYS
        },
        "limitations": [
            "producer and verifier share the mpmath.iv arithmetic library when compared",
            "standalone reconstruction only; no producer comparison was requested",
            "far-frequency envelope only; no signed Weil positivity or RH claim",
        ],
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("artifact", nargs="?", type=Path)
    parser.add_argument("--lambda", dest="lambda_text")
    parser.add_argument("--N", type=int, default=12)
    parser.add_argument("--dps", type=int)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()

    if args.artifact is not None and args.lambda_text is not None:
        parser.error("choose either a producer artifact or --lambda, not both")
    if args.artifact is not None:
        result = replay_artifact(args.artifact, args.dps)
    else:
        if args.lambda_text is None:
            parser.error("supply a producer artifact or exact textual --lambda")
        result = standalone_report(args.lambda_text, args.N, args.dps or 80)

    text = json.dumps(result, indent=2) + "\n"
    if args.output is not None:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(text, encoding="utf-8")
    print(text, end="")
    if result.get("replay_agrees") is False:
        raise SystemExit(1)


__all__ = [
    "ClosedInterval",
    "INTERVAL_KEYS",
    "LOCKED_A4_FORMULA",
    "LOCKED_BETA_FORMULA",
    "LOCKED_BUMP_TERM_FORMULA",
    "LOCKED_BUMP_TERM",
    "LOCKED_CONCENTRATION_SQUARE",
    "LOCKED_CPSI_FORMULA",
    "LOCKED_DEFECT_FORMULA",
    "LOCKED_D_FORMULA",
    "LOCKED_ENDPOINT_TERM",
    "LOCKED_ENDPOINT_TERM_FORMULA",
    "LOCKED_FOURIER_CONVENTION",
    "LOCKED_FOURIER_SIGN",
    "LOCKED_FORMULAS",
    "LOCKED_MODE_TERM",
    "LOCKED_MODE_TERM_FORMULA",
    "LOCKED_NORMALIZATION",
    "intervals_overlap",
    "parse_exact_lambda",
    "reconstruct",
    "replay_artifact",
    "require_locked_conventions",
    "standalone_report",
]


if __name__ == "__main__":
    main()
