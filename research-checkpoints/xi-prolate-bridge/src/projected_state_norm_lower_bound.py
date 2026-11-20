#!/usr/bin/env python3
"""Interval producer for the projected-state norm lower-bound theorem."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re
from typing import Any

import mpmath as mp


SCHEMA = "xi-prolate-projected-state-norm-lower-bound-v1"
STATUS = "PROJECTED_STATE_NORM_LOWER_BOUND_COMPONENT"
TERMINAL_STATE = "P0_INVALIDATED"
NOTE = "notes/PROJECTED_STATE_NORM_LOWER_BOUND.md"
SOURCE_LOCK = "PROJECTED_STATE_NORM_SOURCE_LOCK.json"
MPMATH_VERSION = "1.4.1"
TIGHTNESS_GUARD_DIGITS = 12
_DECIMAL = re.compile(r"^[0-9]+(?:\.[0-9]+)?$")
_SHA256 = re.compile(r"^[0-9a-f]{64}$")

PINNED_HASHES = {
    NOTE: "3847cbcb6e5bfc458af7bf957ff67afb0b943155d62f4239129b40332d270fbf",
    SOURCE_LOCK: "6c765b4d70969a7868f01641fdbc592907e8c32ae7d315a3ef39306f9389b213",
}

RUNTIME_HASHES = {
    "requirements.txt": (
        "458f06e2b5d6e73acc7a4f72af69afe920764c71127578555044815cd785c0fa"
    )
}

LOCKED_FORMULAS = {
    "limiting_norm_lower": "K_star=h(1)^2/(2*sqrt(2)*C_star)",
    "comparison_error": (
        "A=delta_upper*sqrt(lambda^3-lambda)+R_h(lambda)"
    ),
    "projection_tail": "F=C_star*log(lambda)/(pi*(N+1))",
    "gamma_majorant": (
        "G_(1/2)(x)=exp(-x)/sqrt(x); "
        "G_(r+1)(x)=r*G_r(x)+x^r*exp(-x)"
    ),
    "limiting_tail": (
        "T_bar=pi^2*S4_bar*sqrt(G_(9/2)(2*pi*lambda^2)/(2*pi)^(9/2))"
    ),
    "finite_lower": "a>=K_star-sqrt((A+F)^2+T_bar^2)",
    "norm_limit": "a_(lambda,N(lambda))->||E(h)(exp(.))||_2>0",
    "normalized_shift": (
        "epsilon_lambda=o(d6) and liminf a_(lambda,N)>0 imply U_Z=o(d6)"
    ),
    "unit_norm_rejection": "wrong multiplier=2^(17/4)/sqrt(33)!=1",
}

SOURCE_ADMISSIONS = {
    "binary64_parameters_used": False,
    "fourier_sign_changed": False,
    "lambda_mixed_with_lambda_squared": False,
    "inversion_reflection_dropped": False,
    "both_inversion_reflected_limiting_tails_retained": True,
    "invisible_bump_changes_projected_state": False,
    "unit_norm_substitution_accepted": False,
    "effective_delta_threshold_claimed": False,
    "signed_odd_floor_proved": False,
    "signed_even_floor_proved": False,
    "graph_dual_action_proved": False,
    "equation_5_2_proved": False,
    "rh_proved": False,
}

CLAIM_SCOPE = {
    "proved": [
        "explicit positive lower bound for the locked limiting-state norm",
        "finite projected-norm lower formula conditional on delta_upper",
        "projected-state norm convergence in the fixed source normalization",
        "normalized common Ritz upper shift U_Z=o(d6) on the locked schedule",
        "unit-normalization limiting scalar is different and rejected",
    ],
    "not_proved": [
        "an effective source enclosure for delta_lambda at the supplied input",
        "an odd-sector or even-complement signed floor",
        "a graph-dual residual-action estimate",
        "equation (5.2) of DIRECT_RH_ATTACK.md",
        "locally uniform determinant convergence",
        "the Riemann hypothesis",
    ],
}


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _locked_dependency_hashes(root: Path) -> dict[str, str]:
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
        raise ValueError("projected-state source-lock inventory mismatch")
    if lock.get("schema") != "xi-prolate-projected-state-norm-source-lock-v1":
        raise ValueError("projected-state source-lock schema mismatch")
    dependencies = lock.get("dependencies")
    if not isinstance(dependencies, list) or not dependencies:
        raise ValueError("projected-state source-lock dependencies missing")
    result: dict[str, str] = {}
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ValueError("projected-state source-lock dependency malformed")
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
        ):
            raise ValueError("projected-state dependency fields malformed")
        if relative in result:
            raise ValueError(f"duplicate projected-state dependency: {relative}")
        if _sha256(root / relative) != expected:
            raise ValueError(f"source-lock dependency hash mismatch: {relative}")
        result[relative] = expected
    return dict(sorted(result.items()))


def _verified_source_hashes(root: Path) -> dict[str, str]:
    for relative, expected in PINNED_HASHES.items():
        if _sha256(root / relative) != expected:
            raise ValueError(f"pinned component hash mismatch: {relative}")
    combined = dict(PINNED_HASHES)
    for relative, expected in _locked_dependency_hashes(root).items():
        if relative in combined and combined[relative] != expected:
            raise ValueError(f"conflicting component hash: {relative}")
        combined[relative] = expected
    return dict(sorted(combined.items()))


def _verified_runtime_hashes(root: Path) -> dict[str, str]:
    if mp.__version__ != MPMATH_VERSION:
        raise ValueError(
            f"mpmath runtime mismatch: expected {MPMATH_VERSION}, got {mp.__version__}"
        )
    for relative, expected in RUNTIME_HASHES.items():
        if _sha256(root / relative) != expected:
            raise ValueError(f"runtime dependency hash mismatch: {relative}")
    return dict(RUNTIME_HASHES)


def _decimal_text(value: object, name: str) -> str:
    if not isinstance(value, str) or _DECIMAL.fullmatch(value) is None:
        raise TypeError(f"{name} must be an unsigned decimal string, never binary64")
    return value


def _integer(value: object, name: str, minimum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{name} must be an exact integer")
    if value < minimum:
        raise ValueError(f"{name} must be at least {minimum}")
    return value


def _capture(value: Any) -> tuple[mp.mpf, mp.mpf]:
    lower, upper = value._mpi_
    lo_raw = tuple(lower)
    hi_raw = tuple(upper)
    bits = max(int(lo_raw[3]), int(hi_raw[3])) + 32
    with mp.workprec(bits):
        return mp.mpf(lo_raw), mp.mpf(hi_raw)


def _raw_endpoint(raw: tuple[int, int, int, int]) -> list[object]:
    return [int(raw[0]), str(int(raw[1])), int(raw[2]), int(raw[3])]


def _serialize(value: Any, digits: int) -> dict[str, object]:
    lower, upper = value._mpi_
    lo = tuple(int(item) for item in lower)
    hi = tuple(int(item) for item in upper)
    with mp.workdps(digits + 20):
        return {
            "decimal": [mp.nstr(mp.mpf(lo), digits), mp.nstr(mp.mpf(hi), digits)],
            "dyadic": {"lower": _raw_endpoint(lo), "upper": _raw_endpoint(hi)},
        }


def _gamma_half_majorant(x: Any, recurrences: int) -> Any:
    """Elementary upper bound for Gamma(1/2+recurrences,x)."""
    exponential = mp.iv.exp(-x)
    value = exponential / mp.iv.sqrt(x)
    order = mp.iv.mpf(1) / 2
    for _ in range(recurrences):
        value = order * value + mp.iv.power(x, order) * exponential
        order += 1
    return value


def _interval_assembly(
    lambda_text: str, N: int, delta_upper_text: str, dps: int
) -> dict[str, Any]:
    old = mp.iv.dps
    try:
        mp.iv.dps = dps
        lam = mp.iv.mpf(lambda_text)
        delta = mp.iv.mpf(delta_upper_text)
        if _capture(lam)[0] < 2:
            raise ValueError("lambda must be at least 2")
        if _capture(delta)[0] < 0:
            raise ValueError("delta_upper must be nonnegative")

        pi = +mp.iv.pi
        c_star = mp.iv.mpf(3003) / 500
        h_one = pi * (2 * pi - 3) * mp.iv.exp(-pi) / 2
        k_star = h_one**2 / (2 * mp.iv.sqrt(2) * c_star)

        endpoint = (
            pi
            * lam**2
            * (2 * pi * lam**2 - 3)
            * mp.iv.exp(-pi * lam**2)
            / 2
        )
        tail_integral = pi * lam**3 * mp.iv.exp(-pi * lam**2) / 2
        r_h_squared = (
            (lam - 1 / lam) * (endpoint**2 + tail_integral**2)
            + 4 * endpoint * tail_integral * mp.iv.log(lam)
        )
        r_h = mp.iv.sqrt(r_h_squared)
        comparison = delta * mp.iv.sqrt(lam**3 - lam) + r_h
        projection = c_star * mp.iv.log(lam) / (pi * (N + 1))

        gamma5 = _gamma_half_majorant(pi, 2)
        s4_bar = 1 + mp.iv.exp(pi) * gamma5 / (2 * pi ** (mp.iv.mpf(5) / 2))
        gamma9_argument = 2 * pi * lam**2
        gamma9 = _gamma_half_majorant(gamma9_argument, 4)
        limiting_tail = (
            pi**2
            * s4_bar
            * mp.iv.sqrt(gamma9 / (2 * pi) ** (mp.iv.mpf(9) / 2))
        )
        convergence_error = mp.iv.sqrt(
            (comparison + projection) ** 2 + limiting_tail**2
        )
        lower_margin = k_star - convergence_error

        h_norm = mp.iv.sqrt(33) / mp.iv.power(2, mp.iv.mpf(17) / 4)
        unit_rescale = 1 / h_norm
        unit_rescale_difference = unit_rescale - 1

        return {
            "lambda": lam,
            "delta_upper": delta,
            "pi": pi,
            "C_star": c_star,
            "h_one": h_one,
            "K_star": k_star,
            "h_endpoint": endpoint,
            "h_tail_integral": tail_integral,
            "R_h_squared": r_h_squared,
            "R_h": r_h,
            "source_comparison_error": comparison,
            "projection_tail": projection,
            "gamma_5_over_2_majorant_at_pi": gamma5,
            "S4_bar": s4_bar,
            "gamma_9_over_2_argument": gamma9_argument,
            "gamma_9_over_2_majorant": gamma9,
            "limiting_state_tail": limiting_tail,
            "convergence_error_bound": convergence_error,
            "projected_norm_lower_margin": lower_margin,
            "source_h_norm": h_norm,
            "unit_norm_rescale_factor": unit_rescale,
            "unit_norm_rescale_minus_one": unit_rescale_difference,
        }
    finally:
        mp.iv.dps = old


def constants(
    lambda_text: str, N: int, delta_upper_text: str, dps: int = 80
) -> dict[str, Any]:
    _decimal_text(lambda_text, "lambda")
    _decimal_text(delta_upper_text, "delta_upper")
    _integer(N, "N", 0)
    _integer(dps, "interval precision", 50)
    return _interval_assembly(lambda_text, N, delta_upper_text, dps)


def produce(
    lambda_text: str, N: int, delta_upper_text: str, dps: int = 80
) -> dict[str, Any]:
    lambda_text = _decimal_text(lambda_text, "lambda")
    delta_upper_text = _decimal_text(delta_upper_text, "delta_upper")
    N = _integer(N, "N", 0)
    dps = _integer(dps, "interval precision", 50)
    root = _root()
    source_hashes = _verified_source_hashes(root)
    runtime_hashes = _verified_runtime_hashes(root)
    values = _interval_assembly(lambda_text, N, delta_upper_text, dps)
    margin_lower, _ = _capture(values["projected_norm_lower_margin"])
    return {
        "schema": SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "status": STATUS,
        "input": {
            "lambda_decimal": lambda_text,
            "N": N,
            "delta_upper_decimal": delta_upper_text,
            "interval_decimal_digits": dps,
        },
        "theorem": {
            "note": NOTE,
            "valid_lambda_minimum": "2",
            "qualitative_norm_limit": "||E(h)(exp(.))||_2",
            "qualitative_result": "U_Z=o(d6)",
            "supplied_delta_is_an_effective_source_enclosure": False,
            "finite_margin_positive": margin_lower > 0,
        },
        "locked_formulas": dict(LOCKED_FORMULAS),
        "source_hashes": source_hashes,
        "runtime_hashes": runtime_hashes,
        "source_admissions": dict(SOURCE_ADMISSIONS),
        "intervals": {key: _serialize(value, dps) for key, value in values.items()},
        "claim_scope": {key: list(value) for key, value in CLAIM_SCOPE.items()},
        "arithmetic": {
            "library": "mpmath.iv",
            "library_version": MPMATH_VERSION,
            "shared_library_with_replay": True,
            "independence_limitation": (
                "producer and verifier use independent formula assemblies but "
                "share mpmath.iv interval arithmetic"
            ),
            "raw_exact_dyadic_endpoints_serialized": True,
            "incomplete_gamma_point_values_used": False,
            "interval_tightness_guard_decimal_digits": TIGHTNESS_GUARD_DIGITS,
            "interval_tightness_rule": (
                "width <= 10^(-(dps-12))*max(1,abs(lower),abs(upper))"
            ),
        },
        "producer_pass_boolean_trusted_by_replay": False,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lambda-decimal", required=True)
    parser.add_argument("--N", required=True, type=int)
    parser.add_argument("--delta-upper-decimal", required=True)
    parser.add_argument("--dps", type=int, default=80)
    parser.add_argument("--output")
    args = parser.parse_args()
    payload = produce(
        args.lambda_decimal, args.N, args.delta_upper_decimal, args.dps
    )
    encoded = json.dumps(payload, indent=2, sort_keys=True) + "\n"
    if args.output:
        Path(args.output).write_text(encoded, encoding="utf-8")
    else:
        print(encoded, end="")


if __name__ == "__main__":
    main()
