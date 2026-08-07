#!/usr/bin/env python3
"""Explicit constants for the complete physical-tail translation theorem.

This module serializes Theorem 1 of
``notes/OUTER_OUTER_WEIGHTED_TRANSLATION_THEOREM.md``.  It evaluates only
proved elementary constants with outward ``mpmath.iv`` intervals.  It does
not evaluate zeta zeros, a Weil matrix, or an outer--outer Weil pairing.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re
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

_DECIMAL = re.compile(r"^(?:[0-9]+)(?:\.[0-9]+)?$")


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _hash(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def verify_source_hashes() -> dict[str, str]:
    root = _root()
    for relative, expected in SOURCE_HASHES.items():
        actual = _hash(root / relative)
        if actual != expected:
            raise ValueError(f"source hash mismatch: {relative}")
    return dict(SOURCE_HASHES)


def _require_int(value: object, name: str) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{name} must be an exact integer, never binary64")
    return value


def _require_lambda(text: object) -> str:
    if not isinstance(text, str) or _DECIMAL.fullmatch(text) is None:
        raise TypeError("lambda must be an unsigned decimal string, never binary64")
    # The comparison is performed after interval parsing below as well.
    return text


def _raw_endpoint(raw: tuple[int, int, int, int]) -> list[object]:
    return [int(raw[0]), str(int(raw[1])), int(raw[2]), int(raw[3])]


def _serialize(value: Any, digits: int) -> dict[str, object]:
    lower, upper = value._mpi_
    lo = tuple(int(item) for item in lower)
    hi = tuple(int(item) for item in upper)
    with mp.workdps(digits + 20):
        return {
            "decimal": [mp.nstr(mp.mpf(lo), digits), mp.nstr(mp.mpf(hi), digits)],
            "dyadic": {
                "lower": _raw_endpoint(lo),
                "upper": _raw_endpoint(hi),
            },
        }


def _intervals(lambda_text: str, dps: int) -> dict[str, Any]:
    old = mp.iv.dps
    try:
        mp.iv.dps = dps
        lam = mp.iv.mpf(lambda_text)
        if lam.a < 2:
            raise ValueError("translation theorem requires lambda>=2")

        pi = mp.iv.pi
        a4 = mp.iv.sqrt(3) / mp.iv.power(2, mp.iv.mpf(11) / 4)
        C2 = (
            40
            * mp.iv.power(3, -mp.iv.mpf(1) / 4)
            * mp.iv.exp(-(1 + mp.iv.sqrt(3)) / 2)
            / mp.iv.power(1 - 1 / mp.iv.sqrt(3), 2)
        )
        C_phi3 = 222816 * mp.iv.sqrt(mp.iv.e)
        C_psi3 = 9 * C_phi3
        C_xpsi3 = C_psi3 + 3 * C2
        C_bump_profile = (2 * C2**2 + (C_psi3 + 4 * C2) ** 2) / 36

        endpoint_square_sum_coefficient = 2304 * pi**2 * a4**2 * lam**3
        leading_component = 32
        near_component = 256 * pi * lam**3
        far_component = 16384 * mp.iv.sqrt(2 * pi) * lam**4
        prolate_constant = (
            16
            * endpoint_square_sum_coefficient
            * (leading_component + near_component + far_component)
        )
        bump_constant = 8 * a4**2 * lam * C_bump_profile
        D_S = prolate_constant + bump_constant
        leading_degree_seven_coefficient = (
            36864
            * pi**2
            * a4**2
            * 16384
            * mp.iv.sqrt(2 * pi)
        )

        return {
            "lambda": lam,
            "a4": a4,
            "C2": C2,
            "C_phi3": C_phi3,
            "C_psi3": C_psi3,
            "C_xpsi3": C_xpsi3,
            "C_bump_profile": C_bump_profile,
            "endpoint_square_sum_coefficient": endpoint_square_sum_coefficient,
            "leading_component": mp.iv.mpf(leading_component),
            "near_component": near_component,
            "far_component": far_component,
            "prolate_constant": prolate_constant,
            "bump_constant": bump_constant,
            "D_S": D_S,
            "leading_degree_seven_coefficient": leading_degree_seven_coefficient,
        }
    finally:
        mp.iv.dps = old


def produce(lambda_text: str, dps: int = 80) -> dict[str, object]:
    lambda_text = _require_lambda(lambda_text)
    dps = _require_int(dps, "interval precision")
    if dps < 50:
        raise ValueError("at least 50 interval decimal digits are required")
    source_hashes = verify_source_hashes()
    intervals = _intervals(lambda_text, dps)
    return {
        "schema": SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "status": "ANALYTIC_UNIFORM_COMPONENT_CONSTANTS",
        "input": {
            "lambda_decimal": lambda_text,
            "interval_decimal_digits": dps,
        },
        "theorem": {
            "note": THEOREM_NOTE,
            "q": 1,
            "polynomial_degree": 7,
            "valid_lambda_minimum": "2",
            "valid_y": "abs(y)<1/2",
            "valid_h": "0<h<=1/2",
        },
        "locked_formulas": {
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
        },
        "source_hashes": source_hashes,
        "intervals": {
            key: _serialize(value, dps) for key, value in intervals.items()
        },
        "claim_scope": {
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
        },
        "arithmetic": {
            "library": "mpmath.iv",
            "shared_library_with_replay": True,
            "independence_limitation": (
                "producer and verifier use independent formula assemblies but "
                "share mpmath.iv interval arithmetic"
            ),
        },
        "producer_pass_boolean_trusted_by_replay": False,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lambda-decimal", required=True)
    parser.add_argument("--dps", type=int, default=80)
    parser.add_argument("--output")
    args = parser.parse_args()
    payload = produce(args.lambda_decimal, args.dps)
    text = json.dumps(payload, indent=2, sort_keys=True) + "\n"
    if args.output:
        Path(args.output).write_text(text)
    else:
        print(text, end="")


if __name__ == "__main__":
    main()
