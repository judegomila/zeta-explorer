#!/usr/bin/env python3
"""Produce an outward transition-prolate outer-mode certificate."""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import re
from typing import Any

import mpmath as mp

from transition_window_bound import transition_window_bound


SCHEMA = "xi-prolate-transition-outer-v1"
STATUS = "TRANSITION_PROLATE_OUTER_COMPONENT"
TERMINAL_STATE = "P0_INVALIDATED"
RESULT = "TRANSITION_PROLATE_OUTER_COMPONENT_PASS"
NOTE = "notes/TRANSITION_PROLATE_OUTER_THEOREM.md"
SOURCE_LOCK = "TRANSITION_PROLATE_OUTER_SOURCE_LOCK.json"
PINNED_HASHES = {
    NOTE: "215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6",
    SOURCE_LOCK: "463511b13e9313178980c57cdd7bfd008f84d447a3d8e20c3774e4b1b498be9d",
}
_SHA256 = re.compile(r"^[0-9a-f]{64}$")

LOCKED_FORMULAS = {
    "beta": "beta=(2/pi^2)*log(200*lambda^2+25)",
    "buffer": "b=6+ceil(beta*log(20))",
    "transition_index": (
        "n_star=4*lambda^2+b with n_star itself excluded from the low window"
    ),
    "differential_bound": (
        "n<n_star implies mu_n(c)<3*c^2; d_n<1/2 implies n<n_star"
    ),
    "liouville_frequency": (
        "Omega^2=k^2+(c^2-mu_n)/(t^2-lambda^2)+"
        "lambda^2/(t^2-lambda^2)^2"
    ),
    "endpoint_bound": "abs(h_n(lambda))^2<=2592*pi^2*lambda*d_n",
    "far_remainder": (
        "R_n=H_n-(h_n(lambda)/(pi*t))*sin(k*t); "
        "abs(R_n)<=18*A*K/t^2 and abs(R_n')<=24*A*k*K/t^2"
    ),
    "sampled_series": (
        "abs(sum_(m>=2) H_n(m*u))<=28*A*u^(-1)*"
        "(1+log(2+K/u)) for even n"
    ),
    "weighted_norm": (
        "norm(e^(y*.)*O_n)^2<=1062724*lambda*L_lambda^2*"
        "epsilon^(-1)*d_n"
    ),
    "near_constant": (
        "C_near=1119744*pi^2*lambda^5+290304*pi^2*lambda^3+"
        "320*c^4*lambda"
    ),
    "translation_constant": (
        "D_tr=6*(82944*pi^2*lambda+C_near+10^9*K^2/lambda)"
    ),
    "weighted_translation": (
        "norm(tau_h(e^(y*.)*O_n)-e^(y*.)*O_n)^2<="
        "D_tr*epsilon^(-1)*h^epsilon*d_n"
    ),
}

SOURCE_ADMISSIONS = {
    "binary64_parameters_used": False,
    "numerical_prolate_eigenvalues_read": False,
    "stored_eigenvectors_read": False,
    "zeta_zero_table_read": False,
    "global_weil_positivity_assumed": False,
    "odd_label_harmonic_bound_claimed": False,
    "growing_family_loewner_bound_claimed": False,
    "signed_weil_floor_claimed": False,
    "equation_5_2_claimed": False,
    "rh_proved": False,
}

ARITHMETIC = {
    "precision_mode": "outward arbitrary-precision intervals",
    "raw_interval_or_ball_output_applicable": True,
    "library": f"mpmath.iv {mp.__version__}",
    "shared_library_with_verifier": True,
    "independence_limitation": (
        "producer and verifier independently assemble every formula but both use "
        "mpmath.iv for transcendental interval arithmetic"
    ),
}

CLAIM_SCOPE = {
    "proved": [
        "n<n_star forces mu_n(c)<3*c^2 and d_n<1/2 forces n<n_star on the locked schedule",
        "an explicit defect-relative endpoint and far Volterra bound for each low mode",
        "an explicit complete weighted norm and polynomial translation modulus for each even low mode",
    ],
    "not_proved": [
        "the corrected growing-family source Gram or compact projection remainder",
        "the blockwise quotient action estimate",
        "a shifted signed Weil-sector floor",
        "equation (5.2) of DIRECT_RH_ATTACK.md",
        "locally uniform determinant convergence",
        "the Riemann hypothesis",
    ],
}


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _verified_source_hashes() -> dict[str, str]:
    root = _root()
    lock = json.loads((root / SOURCE_LOCK).read_text(encoding="utf-8"))
    expected_top = {
        "schema",
        "claim_class",
        "terminal_state",
        "updated_date",
        "dependencies",
        "locked_conventions",
        "locked_formulas",
        "claim_boundary",
    }
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ValueError("transition-outer source-lock inventory mismatch")
    if lock["schema"] != "xi-prolate-transition-outer-source-lock-v1":
        raise ValueError("transition-outer source-lock schema mismatch")
    if lock["terminal_state"] != TERMINAL_STATE:
        raise ValueError("transition-outer terminal-state mutation")
    if lock["locked_formulas"] != LOCKED_FORMULAS:
        raise ValueError("transition-outer locked-formula mutation")

    result = dict(PINNED_HASHES)
    for relative, expected in PINNED_HASHES.items():
        if _SHA256.fullmatch(expected) is None or _sha256(root / relative) != expected:
            raise ValueError(f"source byte hash mismatch: {relative}")
    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list) or not dependencies:
        raise ValueError("transition-outer dependencies missing")
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ValueError("malformed transition-outer dependency")
        relative = item["path"]
        expected = item["sha256"]
        role = item["role"]
        if (
            not isinstance(relative, str)
            or not relative
            or Path(relative).is_absolute()
            or ".." in Path(relative).parts
            or not isinstance(expected, str)
            or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str)
            or not role
            or relative in result
        ):
            raise ValueError("invalid transition-outer dependency fields")
        if _sha256(root / relative) != expected:
            raise ValueError(f"dependency hash mismatch: {relative}")
        result[relative] = expected
    return dict(sorted(result.items()))


def _require_exact_int(value: Any, label: str, minimum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{label} must be an exact integer")
    if value < minimum:
        raise ValueError(f"{label} must be at least {minimum}")
    return value


def _raw_endpoint(value: mp.mpf) -> list[object]:
    sign, mantissa, exponent, bit_count = value._mpf_
    return [int(sign), str(mantissa), int(exponent), int(bit_count)]


def _capture(value: object, dps: int) -> dict[str, object]:
    raw_lower, raw_upper = value._mpi_  # type: ignore[attr-defined]
    with mp.workdps(dps + 20):
        lower = +mp.mpf(raw_lower)
        upper = +mp.mpf(raw_upper)
        digits = dps + 10
        return {
            "decimal": [mp.nstr(lower, digits), mp.nstr(upper, digits)],
            "dyadic": {
                "lower": _raw_endpoint(lower),
                "upper": _raw_endpoint(upper),
            },
        }


def _intervals(p: int, n_max: int, dps: int) -> dict[str, dict[str, object]]:
    old_dps = mp.iv.dps
    try:
        mp.iv.dps = dps
        lam = mp.iv.mpf(p) / 2
        pi = mp.iv.pi
        k = 2 * pi * lam
        c = k * lam
        K = k * lam**2
        beta = 2 / pi**2 * mp.iv.log(200 * lam**2 + 25)
        buffer = beta * mp.iv.log(20)
        L = 1 + mp.iv.log(2 + 2 * pi * lam**2)
        mu_ratio = 1 + mp.iv.mpf(n_max * (n_max + 1)) / c**2
        endpoint = 2592 * pi**2 * lam
        weighted_norm = 1_062_724 * lam * L**2
        near = (
            1_119_744 * pi**2 * lam**5
            + 290_304 * pi**2 * lam**3
            + 320 * c**4 * lam
        )
        translation = 6 * (
            82_944 * pi**2 * lam + near + 1_000_000_000 * K**2 / lam
        )
        return {
            "beta": _capture(beta, dps),
            "beta_log20": _capture(buffer, dps),
            "mu_upper_over_c_squared": _capture(mu_ratio, dps),
            "margin_below_3c_squared": _capture(3 - mu_ratio, dps),
            "endpoint_square_coefficient": _capture(endpoint, dps),
            "L_lambda": _capture(L, dps),
            "weighted_norm_coefficient": _capture(weighted_norm, dps),
            "C_near": _capture(near, dps),
            "D_tr": _capture(translation, dps),
        }
    finally:
        mp.iv.dps = old_dps


def _rational(value: Fraction) -> dict[str, str]:
    return {"numerator": str(value.numerator), "denominator": str(value.denominator)}


def produce(lambda_numerator: int, dps: int = 80) -> dict[str, Any]:
    p = _require_exact_int(lambda_numerator, "lambda_numerator", 5)
    if p % 2 == 0:
        raise ValueError("lambda_numerator must be odd")
    dps = _require_exact_int(dps, "dps", 40)

    lam = Fraction(p, 2)
    transition = transition_window_bound(str(lam), dps)
    if transition.shannon_index.denominator != 1:
        raise ArithmeticError("locked schedule must have integral Shannon index")
    n_star = transition.n_star
    n_max = n_star - 1
    six_lambda_squared = 6 * lam**2
    if Fraction(n_max) > six_lambda_squared:
        raise ArithmeticError("exact n<=6*lambda^2 reduction failed")

    certificate = {
        "lambda": _rational(lam),
        "lambda_squared": _rational(lam**2),
        "shannon_index": int(transition.shannon_index),
        "buffer_ceil": transition.buffer_ceil,
        "buffer_with_plus_six": 6 + transition.buffer_ceil,
        "n_star": n_star,
        "max_low_index": n_max,
        "n_star_is_excluded": True,
        "six_lambda_squared": _rational(six_lambda_squared),
        "exact_index_margin": _rational(six_lambda_squared - n_max),
        "endpoint_constant_integer": 2592,
        "far_remainder_constants": {"value": 18, "derivative": 24},
        "sampled_series_constant": 28,
        "weighted_norm_integer": 1_062_724,
        "far_translation_integer": 1_000_000_000,
        "translation_collection_factor": 6,
        "outward_intervals": _intervals(p, n_max, transition.interval_dps),
    }

    margin = certificate["outward_intervals"]["margin_below_3c_squared"]
    lower_text = margin["decimal"][0]  # type: ignore[index]
    if mp.mpf(lower_text) <= 0:
        raise ArithmeticError("interval replay did not prove mu_n<3*c^2")

    return {
        "schema": SCHEMA,
        "status": STATUS,
        "terminal_state": TERMINAL_STATE,
        "input": {
            "lambda_numerator": p,
            "lambda_denominator": 2,
            "interval_decimal_digits": transition.interval_dps,
        },
        "source_hashes": _verified_source_hashes(),
        "locked_formulas": dict(LOCKED_FORMULAS),
        "source_admissions": dict(SOURCE_ADMISSIONS),
        "arithmetic": dict(ARITHMETIC),
        "certificate": certificate,
        "producer_pass_boolean_trusted_by_replay": False,
        "claim_scope": {key: list(value) for key, value in CLAIM_SCOPE.items()},
        "result": RESULT,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lambda-numerator", type=int, required=True)
    parser.add_argument("--dps", type=int, default=80)
    parser.add_argument("--output")
    args = parser.parse_args()
    encoded = json.dumps(
        produce(args.lambda_numerator, args.dps), indent=2, sort_keys=True
    ) + "\n"
    if args.output:
        Path(args.output).write_text(encoded, encoding="utf-8")
    else:
        print(encoded, end="")


if __name__ == "__main__":
    main()
