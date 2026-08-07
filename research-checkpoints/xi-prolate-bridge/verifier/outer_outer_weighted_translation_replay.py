#!/usr/bin/env python3
"""Independent replay of the complete weighted translation constants.

The replay does not import the producer.  It hashes every admitted source,
reconstructs the constants from the decimal lambda parameter through an
algebraically different expression, and requires interval overlap for every
field.  Both paths share ``mpmath.iv``; this limitation is mandatory metadata.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import mpmath as mp


SCHEMA = "xi-prolate-outer-outer-weighted-translation-v1"
TERMINAL_STATE = "P0_INVALIDATED"
THEOREM_NOTE = "notes/OUTER_OUTER_WEIGHTED_TRANSLATION_THEOREM.md"
LOCKED_SAWTOOTH = (
    "||Delta[1_(s>=0)*exp(-delta*s)*P(A*exp(s))]||_2^2"
    "<=128*delta^(-1)*A^delta*h^delta"
)
REJECTED_SAWTOOTH = (
    "||Delta[1_(s>=0)*exp(-delta*s)*P(A*exp(s))]||_2^2"
    "<=64*delta^(-1)*h^delta"
)
LOCKED_DECOMPOSITION = (
    "full leading sawtooth + exact m=1 near edge + complete Volterra "
    "R-series + artificial joins + invisible bump"
)
LOCKED_REFLECTION = (
    "O=(1-C)*(1+J)/2*E(tilde_h); both inversion-reflected tails included"
)
LOCKED_FINAL = (
    "||Delta_h(exp(y*t)*O)||_2^2"
    "<=D_S(lambda)*epsilon(y)^(-1)*h^epsilon(y)*d4"
)
SOURCE_HASHES = {
    "P0_SOURCE_LOCK.json": "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P1_SOURCE_LOCK.json": "63b83879c52382c6c524b3137b25ea9f1882a24c5518374d487469ecf0e077d2",
    "P2_SOURCE_LOCK.json": "8b731d499903041ef68e7722ebd085d22673c022655431dcca27c9cac6f4730a",
    "vendor/CCM-ZST-2511.22755v1.pdf": (
        "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b"
    ),
    "vendor/KRD-PSWF-2006.00427v2.pdf": (
        "7c56255db5bd6454e3fc926952052fe466ffd49c4961ad8206638dcac1dd39a0"
    ),
}
INTERVAL_KEYS = {
    "lambda",
    "a4",
    "C2",
    "C_phi3",
    "C_psi3",
    "C_xpsi3",
    "C_bump_profile",
    "endpoint_square_sum_coefficient",
    "leading_component",
    "near_component",
    "far_component",
    "prolate_constant",
    "bump_constant",
    "D_S",
    "leading_degree_seven_coefficient",
}


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _hash(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _capture(value: Any) -> tuple[mp.mpf, mp.mpf]:
    lower, upper = value._mpi_
    lo_raw = tuple(lower)
    hi_raw = tuple(upper)
    bits = max(int(lo_raw[3]), int(hi_raw[3])) + 32
    with mp.workprec(bits):
        return mp.mpf(lo_raw), mp.mpf(hi_raw)


def _payload_interval(item: object) -> tuple[mp.mpf, mp.mpf]:
    if not isinstance(item, dict) or set(item) != {"decimal", "dyadic"}:
        raise ValueError("invalid producer interval inventory")
    dyadic = item["dyadic"]
    if not isinstance(dyadic, dict) or set(dyadic) != {"lower", "upper"}:
        raise ValueError("invalid producer dyadic interval")
    raws: list[tuple[int, int, int, int]] = []
    for endpoint in ("lower", "upper"):
        raw = dyadic[endpoint]
        if not isinstance(raw, list) or len(raw) != 4:
            raise ValueError("invalid producer dyadic endpoint")
        raws.append((int(raw[0]), int(raw[1]), int(raw[2]), int(raw[3])))
    bits = max(raws[0][3], raws[1][3]) + 32
    with mp.workprec(bits):
        values = [mp.mpf(raws[0]), mp.mpf(raws[1])]
    if values[0] > values[1]:
        raise ValueError("producer interval endpoints reversed")
    return values[0], values[1]


def _reconstruct(lambda_text: str, dps: int) -> dict[str, tuple[mp.mpf, mp.mpf]]:
    old = mp.iv.dps
    try:
        mp.iv.dps = dps
        x = mp.iv.mpf(lambda_text)
        pi = mp.iv.pi
        ln2 = mp.iv.log(2)
        a4 = mp.iv.sqrt(3) * mp.iv.exp(-mp.iv.mpf(11) * ln2 / 4)

        sqrt3 = mp.iv.sqrt(3)
        C2 = (
            40
            * mp.iv.exp(-mp.iv.log(3) / 4 - (1 + sqrt3) / 2)
            * (sqrt3 / (sqrt3 - 1)) ** 2
        )

        # Reconstruct the bump derivative constant from the incomplete-gamma
        # evaluation rather than use the producer's simplified 222816*sqrt(e).
        half = mp.iv.mpf(1) / 2
        gamma5half = (
            24
            * mp.iv.exp(-half)
            * sum(half**j / mp.iv.mpf(math.factorial(j)) for j in range(5))
        )
        C_phi3 = 5632 * mp.iv.e * gamma5half
        C_psi3 = 9 * C_phi3
        C_xpsi3 = C_psi3 + 3 * C2
        Cb = (C2**2 / 18) + ((C_xpsi3 + C2) ** 2 / 36)

        endpoint = 2304 * pi**2 * a4**2 * x**3
        leading = mp.iv.mpf(32)
        near = 128 * (2 * pi * x) * x**2
        far = (4096 / pi**2) * (2 * pi * x) ** 2 * x**2 * mp.iv.sqrt(2 * pi)
        # Expand the product instead of reading the producer's bracket.
        prolate = 16 * endpoint * leading + 16 * endpoint * near + 16 * endpoint * far
        bump = 8 * a4**2 * x * Cb
        total = prolate + bump
        degree7 = 16 * 2304 * pi**2 * a4**2 * 16384 * mp.iv.sqrt(2 * pi)

        return {
            "lambda": _capture(x),
            "a4": _capture(a4),
            "C2": _capture(C2),
            "C_phi3": _capture(C_phi3),
            "C_psi3": _capture(C_psi3),
            "C_xpsi3": _capture(C_xpsi3),
            "C_bump_profile": _capture(Cb),
            "endpoint_square_sum_coefficient": _capture(endpoint),
            "leading_component": _capture(leading),
            "near_component": _capture(near),
            "far_component": _capture(far),
            "prolate_constant": _capture(prolate),
            "bump_constant": _capture(bump),
            "D_S": _capture(total),
            "leading_degree_seven_coefficient": _capture(degree7),
        }
    finally:
        mp.iv.dps = old


def replay(payload: dict[str, object]) -> dict[str, object]:
    if payload.get("schema") != SCHEMA or payload.get("terminal_state") != TERMINAL_STATE:
        raise ValueError("schema or terminal state mismatch")
    if payload.get("producer_pass_boolean_trusted_by_replay") is not False:
        raise ValueError("replay must not trust a producer pass boolean")

    inputs = payload.get("input")
    if not isinstance(inputs, dict) or set(inputs) != {
        "lambda_decimal",
        "interval_decimal_digits",
    }:
        raise ValueError("input inventory mismatch")
    lambda_text = inputs["lambda_decimal"]
    dps = inputs["interval_decimal_digits"]
    if not isinstance(lambda_text, str):
        raise TypeError("lambda must remain a decimal string")
    if isinstance(dps, bool) or not isinstance(dps, int):
        raise TypeError("precision must remain an exact integer")

    theorem = payload.get("theorem")
    expected_theorem = {
        "note": THEOREM_NOTE,
        "q": 1,
        "polynomial_degree": 7,
        "valid_lambda_minimum": "2",
        "valid_y": "abs(y)<1/2",
        "valid_h": "0<h<=1/2",
    }
    if theorem != expected_theorem:
        raise ValueError("theorem scope or polynomial degree mismatch")

    formulas = payload.get("locked_formulas")
    if not isinstance(formulas, dict):
        raise ValueError("locked formulas missing")
    required = {
        "sawtooth": LOCKED_SAWTOOTH,
        "rejected_sawtooth": REJECTED_SAWTOOTH,
        "decomposition": LOCKED_DECOMPOSITION,
        "reflection": LOCKED_REFLECTION,
        "final": LOCKED_FINAL,
        "source_normalization": (
            "a4=sqrt(3)/2^(11/4); abs(a0/a4)<=2*sqrt(2)*lambda"
        ),
        "bump": (
            "tilde_h=h_lambda-h_lambda(0)*psi(2*lambda*x); "
            "psi=2*phi(2*x)-phi(x)"
        ),
    }
    if formulas != required:
        raise ValueError("locked formula, normalization, reflection, or decomposition mismatch")

    root = _root()
    pins = payload.get("source_hashes")
    if pins != SOURCE_HASHES:
        raise ValueError("producer source hashes mismatch")
    for relative, expected in SOURCE_HASHES.items():
        if _hash(root / relative) != expected:
            raise ValueError(f"source hash mismatch: {relative}")

    arithmetic = payload.get("arithmetic")
    if not isinstance(arithmetic, dict) or arithmetic.get("shared_library_with_replay") is not True:
        raise ValueError("arithmetic independence limitation missing")

    scope = payload.get("claim_scope")
    expected_scope = {
        "proved": (
            "complete weighted translation modulus for the actual corrected "
            "and reflected physical outer state"
        ),
        "not_proved": [
            "outer--outer Weil pairing bound",
            "signed sector floor",
            "weighted equation (5.2)",
            "determinant limit",
        ],
    }
    if scope != expected_scope:
        raise ValueError("claim scope mismatch")

    producer_intervals = payload.get("intervals")
    if not isinstance(producer_intervals, dict) or set(producer_intervals) != INTERVAL_KEYS:
        raise ValueError("interval inventory mismatch")
    reconstructed = _reconstruct(lambda_text, dps)
    comparisons: dict[str, object] = {}
    for key in sorted(INTERVAL_KEYS):
        p_lo, p_hi = _payload_interval(producer_intervals[key])
        r_lo, r_hi = reconstructed[key]
        overlap = max(p_lo, r_lo) <= min(p_hi, r_hi)
        if not overlap:
            raise ValueError(f"interval nonoverlap for {key}")
        comparisons[key] = {
            "overlap": True,
            "producer_decimal": [mp.nstr(p_lo, 25), mp.nstr(p_hi, 25)],
            "replay_decimal": [mp.nstr(r_lo, 25), mp.nstr(r_hi, 25)],
        }

    return {
        "schema": SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "status": "ANALYTIC_UNIFORM_COMPONENT_REPLAY_PASS",
        "input": dict(inputs),
        "source_hashes_rechecked": True,
        "intervals_reconstructed_from_decimal_parameter": True,
        "producer_booleans_trusted": False,
        "interval_comparisons": comparisons,
        "arithmetic": dict(arithmetic),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("artifact")
    parser.add_argument("--output")
    args = parser.parse_args()
    payload = json.loads(Path(args.artifact).read_text())
    result = replay(payload)
    text = json.dumps(result, indent=2, sort_keys=True) + "\n"
    if args.output:
        Path(args.output).write_text(text)
    else:
        print(text, end="")


if __name__ == "__main__":
    main()
