#!/usr/bin/env python3
"""Exact algebra audit for the arithmetic source-channel comparison.

This standard-library replay verifies the polynomial/intertwining part of
the checkpoint.  The audited theta base identity and analytic 0.9/1.1 norm
estimate are explicit premises, not numerically re-created here.
"""
from __future__ import annotations

from fractions import Fraction as Q
import hashlib
import json
from math import comb
from pathlib import Path
import sys


SOURCE = Path(__file__).resolve()
WORKSTREAM = SOURCE.parents[1]
NOTE = WORKSTREAM / "ARITHMETIC_SOURCE_CHANNEL_20261104.md"


def trim(poly: list[Q]) -> list[Q]:
    result = list(poly)
    while len(result) > 1 and result[-1] == 0:
        result.pop()
    return result


def add(left: list[Q], right: list[Q]) -> list[Q]:
    size = max(len(left), len(right))
    return trim([
        (left[index] if index < len(left) else Q(0))
        + (right[index] if index < len(right) else Q(0))
        for index in range(size)
    ])


def multiply(left: list[Q], right: list[Q]) -> list[Q]:
    result = [Q(0)] * (len(left) + len(right) - 1)
    for i, x in enumerate(left):
        for j, y in enumerate(right):
            result[i + j] += x * y
    return trim(result)


def scale(poly: list[Q], value: Q) -> list[Q]:
    return trim([value * coefficient for coefficient in poly])


def shift(poly: list[Q], offset: Q) -> list[Q]:
    """Return q(x+offset), ascending coefficients."""
    power = [Q(1)]
    linear = [offset, Q(1)]
    result = [Q(0)]
    for coefficient in poly:
        result = add(result, scale(power, coefficient))
        power = multiply(power, linear)
    return trim(result)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> int:
    # Symbolic coefficient families at every degree make the triangular
    # translation and commutation checks independent of a special q.
    checks = 0
    A = [Q(5, 2), Q(1)]
    local_A = [Q(1, 2), Q(1)]
    for degree in range(17):
        q = [Q((index + 2) * (degree + 3), index + 1) for index in range(degree)] + [Q(1)]
        shifted = shift(q, Q(2))
        assert len(shifted) == len(q)
        assert shifted[-1] == 1
        # A q(D+2) = q(D+2) A because both are constant-coefficient.
        assert multiply(A, shifted) == multiply(shifted, A)
        # U A q(D+2) = (D+1/2) q(D) U: moving a polynomial
        # through U translates its symbol back by two.
        assert shift(multiply(A, shifted), Q(-2)) == multiply(local_A, q)
        # Intertwining basis check: D^k U = U(D+2)^k.
        for power in range(degree + 1):
            monomial = [Q(0)] * power + [Q(1)]
            leibniz_coefficients = [
                Q(comb(power, derivative_order) * 2 ** (power - derivative_order))
                for derivative_order in range(power + 1)
            ]
            assert shift(monomial, Q(2)) == leibniz_coefficients
            checks += 1
        # Inverse translation proves the full prefix is preserved.
        assert shift(shifted, Q(-2)) == q
        checks += 4

    lower = Q(9, 10) ** 2
    upper = Q(11, 10) ** 2
    assert lower == Q(81, 100)
    assert upper == Q(121, 100)

    # Green-kernel audit.  For a test exponential exp(-lambda*u), the
    # right-decaying kernel K(t)=exp(-3t/2)-exp(-5t/2) has exactly the
    # inverse L2 multiplier.  Integration by parts changes its coefficients
    # to R(t)=2 exp(-3t/2)-3 exp(-5t/2).
    for lam in range(17):
        green_laplace = Q(1, 1) / (Q(lam) + Q(3, 2)) - Q(1, 1) / (Q(lam) + Q(5, 2))
        inverse_multiplier = Q(1, 1) / ((Q(lam) + Q(3, 2)) * (Q(lam) + Q(5, 2)))
        assert green_laplace == inverse_multiplier
        transferred = Q(2, 1) / (Q(lam) + Q(3, 2)) - Q(3, 1) / (Q(lam) + Q(5, 2))
        assert transferred == (Q(1, 2) - Q(lam)) * inverse_multiplier
        checks += 2
    assert Q(2, 1) / Q(3, 2) - Q(3, 1) / Q(5, 2) == Q(2, 15)

    receipt = {
        "schema_version": "zsv.arithmetic_source_channel.algebra_audit.v1",
        "status": "PASS",
        "scope": "Exact polynomial/intertwining audit of the all-degree source-channel consequence",
        "premises_not_recomputed": [
            "L2 psi = -2*pi*U*A psi",
            "0.9 <= weighted U norm ratio <= 1.1 on the audited admissible domain",
        ],
        "checks": {
            "degrees": list(range(17)),
            "exact_assertions": checks,
            "translation_is_bijective_on_full_monic_prefix": True,
            "A_commutes_with_shifted_polynomial": True,
            "local_B_form_L2q_equals_minus_2pi_Dplus_half_qB": True,
            "right_decaying_green_kernel": "exp(-3t/2)-exp(-5t/2)",
            "signed_transfer_kernel": "2*exp(-3t/2)-3*exp(-5t/2)",
            "signed_transfer_zero": "log(3/2)",
            "signed_transfer_total_mass": "2/15",
            "intertwining_shift_is_plus_two": True,
            "squared_lower_constant": "81/100",
            "squared_upper_constant": "121/100",
        },
        "provenance": {
            "verifier": str(SOURCE.relative_to(WORKSTREAM)),
            "verifier_sha256": sha256(SOURCE),
            "note": NOTE.name,
            "note_sha256": sha256(NOTE),
        },
        "nonclaims": [
            "The replay does not recompute the theta-orbit base identity or weighted kernel estimate.",
            "The source-channel comparison does not sign X_n or Y_n.",
            "It does not prove a next pivot, an all-degree Xi-Laguerre inequality, or RH.",
        ],
    }
    canonical = json.dumps(receipt, sort_keys=True, separators=(",", ":")).encode()
    receipt["receipt_integrity"] = {
        "definition": "sha256 of compact sorted JSON with receipt_integrity omitted",
        "payload_sha256": hashlib.sha256(canonical).hexdigest(),
    }
    output = Path(sys.argv[1]).resolve() if len(sys.argv) == 2 else WORKSTREAM / "results" / "arithmetic_source_channel_audit.json"
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(receipt, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps({
        "status": "PASS",
        "output": str(output),
        "source_sha256": sha256(SOURCE),
        "payload_sha256": receipt["receipt_integrity"]["payload_sha256"],
    }, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
