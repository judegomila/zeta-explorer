#!/usr/bin/env python3
"""Replay exact algebra for EWALD_ENDPOINT_PACKET_SIGN_NEXT.md.

Only the Python standard library is used.  The exact checks establish the
differential packet, Euler--Maclaurin coefficients, and explicit remainder
majorant.  The final floating samples are diagnostics, not interval proofs.
"""

from __future__ import annotations

import json
import math
from fractions import Fraction
from pathlib import Path


def add(left: dict[int, Fraction], right: dict[int, Fraction]) -> dict[int, Fraction]:
    out = left.copy()
    for degree, coefficient in right.items():
        out[degree] = out.get(degree, Fraction(0)) + coefficient
        if out[degree] == 0:
            del out[degree]
    return out


def derivative(poly: dict[int, Fraction]) -> dict[int, Fraction]:
    return {degree - 1: coefficient * degree
            for degree, coefficient in poly.items() if degree}


def gaussian_derivative(poly: dict[int, Fraction]) -> dict[int, Fraction]:
    """P -> P' - 2*u*P, since (P exp(-u^2))' has this polynomial."""
    shifted = {degree + 1: -2 * coefficient
               for degree, coefficient in poly.items()}
    return add(derivative(poly), shifted)


def odd_gaussian_moment(degree: int) -> Fraction:
    assert degree >= 1 and degree % 2 == 1
    # integral_0^infinity u^(2*j+1) exp(-u^2) du = j!/2
    j = (degree - 1) // 2
    return Fraction(math.factorial(j), 2)


def packet_sum(h: float, tolerance: float = 1e-17) -> float:
    total = 0.0
    # The direct sum is only a diagnostic.  Stop after the positive Gaussian
    # tail is far below double precision relative to the accumulated value.
    for n in range(1, 2_000_000):
        z = math.pi * n * n * math.exp(2.0 * h)
        term = 8.0 * math.exp(h / 2.0) * n * z * (z - 2.0) * math.exp(-z)
        total += term
        if n > 8 and abs(term) < tolerance * max(1.0, abs(total)) and z > 40.0:
            return total
    raise RuntimeError("diagnostic packet sum did not converge")


def main() -> None:
    # If y(h)=2*n*exp(h/2-z), z'=2z, represent y'/y by a polynomial in z.
    # L[y]/y = (D log y)^2 + D^2 log y + D log y - 3/4.
    # D log y = 1/2-2z and D^2 log y = -4z.
    # Exact expansion must be 4*z*(z-2); multiplication by y gives (7).
    log_first = {0: Fraction(1, 2), 1: Fraction(-2)}
    log_second = {1: Fraction(-4)}
    square: dict[int, Fraction] = {}
    for j, cj in log_first.items():
        for k, ck in log_first.items():
            square[j + k] = square.get(j + k, Fraction(0)) + cj * ck
    operator_poly = add(add(square, log_second), log_first)
    operator_poly[0] = operator_poly.get(0, Fraction(0)) - Fraction(3, 4)
    operator_poly = {degree: coefficient for degree, coefficient in operator_poly.items()
                     if coefficient}
    assert operator_poly == {1: Fraction(-8), 2: Fraction(4)}

    # Inverse-transform normalization for
    # B((1/2)F[f], F[g]).  Coefficients are in the monomial basis
    # (u^2, u*x, x^2).  The three terms are A'B', -AB''/2, -A''B/2.
    inverse_ap_bp = (Fraction(0), Fraction(-1, 2), Fraction(1, 2))
    inverse_minus_abpp = (Fraction(1, 4), Fraction(-1, 2), Fraction(1, 4))
    inverse_minus_appb = (Fraction(0), Fraction(0), Fraction(1, 4))
    inverse_total = tuple(sum(parts, Fraction(0)) for parts in zip(
        inverse_ap_bp, inverse_minus_abpp, inverse_minus_appb))
    assert inverse_total == (Fraction(1, 4), Fraction(-1), Fraction(1))
    # This is (u-2*x)^2/4; dx=dv/2 then gives the packet prefactor 1/8.
    correlation_prefactor = Fraction(1, 8)

    # phi=(u^5-2u^3)exp(-u^2).  Its centre jets set the first two
    # Euler--Maclaurin coefficients.
    phi_poly = {5: Fraction(1), 3: Fraction(-2)}
    jets: list[dict[int, Fraction]] = [phi_poly]
    for _ in range(6):
        jets.append(gaussian_derivative(jets[-1]))
    phi3_at_zero = jets[3].get(0, Fraction(0))
    phi5_at_zero = jets[5].get(0, Fraction(0))
    assert phi3_at_zero == -12
    assert phi5_at_zero == 360

    bernoulli4 = Fraction(-1, 30)
    bernoulli6 = Fraction(1, 42)
    coefficient_a = -bernoulli4 * phi3_at_zero / math.factorial(4)
    coefficient_a2 = -bernoulli6 * phi5_at_zero / math.factorial(6)
    assert coefficient_a == Fraction(-1, 60)
    assert coefficient_a2 == Fraction(-1, 84)

    expected_sixth = {
        1: Fraction(-10080),
        3: Fraction(40320),
        5: Fraction(-37800),
        7: Fraction(12432),
        9: Fraction(-1568),
        11: Fraction(64),
    }
    assert jets[6] == expected_sixth
    l1_triangle = sum(abs(coefficient) * odd_gaussian_moment(degree)
                      for degree, coefficient in expected_sixth.items())
    assert l1_triangle == 122952

    # 2*zeta(6)/(2*pi)^6 = 1/30240 exactly.
    remainder_factor = Fraction(1, 30240)
    leading_error_factor = abs(coefficient_a2) + remainder_factor * l1_triangle
    assert leading_error_factor == Fraction(367, 90)
    negativity_threshold = abs(coefficient_a) / leading_error_factor
    assert negativity_threshold == Fraction(3, 734)

    # Check the multiplier identity -s(2-s)=-t^2+i*t-3/4 at generic complex t.
    test_t = complex(1.25, 1.75)
    test_s = 0.5 - 1j * test_t
    assert abs(-test_s * (2.0 - test_s)
               - (-test_t * test_t + 1j * test_t - 0.75)) < 1e-14

    samples = []
    for h in (0.0, 0.5, 1.0, 2.0, 4.0):
        positive = packet_sum(h)
        reflected = packet_sum(-h)
        samples.append({
            "h": h,
            "chi_h": positive,
            "chi_minus_h": reflected,
            "eta_h": (positive + reflected) / 2.0,
        })
    assert samples[0]["eta_h"] > 0.0
    assert samples[-1]["eta_h"] < 0.0

    receipt = {
        "status": "PASS",
        "proof_checks": {
            "packet_operator_polynomial": {str(k): str(v) for k, v in operator_poly.items()},
            "inverse_correlation_coefficients_u2_ux_x2": [str(v) for v in inverse_total],
            "correlation_prefactor_after_v_change": str(correlation_prefactor),
            "phi_third_at_zero": str(phi3_at_zero),
            "phi_fifth_at_zero": str(phi5_at_zero),
            "phi_sixth_l1_triangle_bound": str(l1_triangle),
            "leading_error_factor": str(leading_error_factor),
            "rigorous_F_negative_when_a_below": str(negativity_threshold),
        },
        "floating_diagnostic_only": samples,
        "nonclaim": (
            "The samples are not interval certificates.  Packet sign change only "
            "rules out pointwise packet positivity; it does not sign S'(1)."
        ),
    }
    output = Path(__file__).resolve().parents[1] / "results" / "ewald_endpoint_packet_check.json"
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(receipt, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps(receipt, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
