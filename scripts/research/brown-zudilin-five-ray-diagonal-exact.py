"""Exact diagonal checks for the Brown--Zudilin five-ray cone.

For a_n=n*(1,0,0,0,1,2,2,1), this script implements the finite
partial-fraction/beta-derivative formula for the rational projected moment
I'(a_n).  It is an independent exact check of the p-adic theorem proved in
the accompanying denominator-obstruction note; it is not a substitute for
that uniform proof.

Requires SymPy 1.14. Example:
    python brown_zudilin_five_ray_diagonal_exact.py --max-n 30
"""

from __future__ import annotations

import argparse
from functools import lru_cache

import sympy as sp


y = sp.symbols("y")


@lru_cache(maxsize=None)
def harmonic(n: int, power: int = 1) -> sp.Rational:
    return sum((sp.Rational(1, k**power) for k in range(1, n + 1)), sp.S.Zero)


@lru_cache(maxsize=None)
def rational_log_moment(log_power: int, exponent: int) -> sp.Rational:
    """Rational part of integral_0^1 y^exponent log(1-y)^log_power dy."""
    if exponent >= 0:
        h1 = harmonic(exponent + 1)
        h2 = harmonic(exponent + 1, 2)
        return (
            sp.Rational(1, exponent + 1),
            -h1 / (exponent + 1),
            (h1**2 + h2) / (exponent + 1),
        )[log_power]
    if exponent == -1:
        return sp.S.Zero

    r = -exponent - 1
    h1 = harmonic(r - 1)
    h2 = harmonic(r - 1, 2)
    return (
        -sp.Rational(1, r),
        h1 / r - sp.Rational(1, r**2),
        (-h1**2 + 3 * h2) / r + 2 * h1 / r**2,
    )[log_power]


@lru_cache(maxsize=None)
def diagonal_polynomials(n: int) -> tuple[sp.Poly, sp.Poly]:
    """Return P_n,Q_n with F_n=(P_n+Q_n log(1-y))/... ."""
    q_expr = sp.S.Zero
    for j in range(n + 1):
        coefficient = (
            sp.binomial(n, j)
            * sp.binomial(2 * n + j, j)
            / sp.Rational(n + j)
        )
        q_expr += coefficient * y ** (n - j) * (1 - y) ** (n + j)
    q_poly = sp.Poly(sp.expand(q_expr), y)

    # P_n=-T_{<=3n}(Q_n log(1-y)), and
    # log(1-y)=-sum_{m>=1} y^m/m.
    p_expr = sp.S.Zero
    for degree in range(1, 3 * n + 1):
        coefficient = sum(
            q_poly.coeff_monomial(y**k) / sp.Rational(degree - k)
            for k in range(degree)
        )
        p_expr += coefficient * y**degree
    return sp.Poly(sp.expand(p_expr), y), q_poly


@lru_cache(maxsize=None)
def projected_diagonal_moment(n: int) -> sp.Rational:
    """Return I'(n*(1,0,0,0,1,2,2,1)) exactly."""
    if n < 1:
        raise ValueError("n must be positive")
    p_poly, q_poly = diagonal_polynomials(n)
    coefficient_polynomials = (
        p_poly * p_poly,
        2 * p_poly * q_poly,
        q_poly * q_poly,
    )
    shift = 5 * n + 1
    rational_part = sp.S.Zero
    for log_power, polynomial in enumerate(coefficient_polynomials):
        for (degree,), coefficient in polynomial.terms():
            rational_part += coefficient * rational_log_moment(
                log_power, degree - shift
            )
    # Q(a_n)=0, so I'(a_n) is half the rational part of I(a_n).
    return sp.factor(rational_part / 2)


def lcm_through(n: int) -> int:
    value = 1
    for k in range(1, n + 1):
        value = int(sp.ilcm(value, k))
    return value


def p_adic_valuation(value: sp.Rational, prime: int) -> int:
    numerator = abs(int(sp.numer(value)))
    denominator = int(sp.denom(value))
    valuation = 0
    while numerator and numerator % prime == 0:
        numerator //= prime
        valuation += 1
    while denominator % prime == 0:
        denominator //= prime
        valuation -= 1
    return valuation


def residue_mod_prime(value: sp.Rational, prime: int) -> int:
    numerator = int(sp.numer(value)) % prime
    denominator = int(sp.denom(value)) % prime
    if denominator == 0:
        raise ValueError("value is not p-integral")
    return numerator * pow(denominator, -1, prime) % prime


def audit(max_n: int) -> None:
    assert projected_diagonal_moment(1) == -sp.Rational(5, 96)
    assert projected_diagonal_moment(2) == -sp.Rational(2299, 414720)

    for n in range(1, max_n + 1):
        moment = projected_diagonal_moment(n)
        multiplier = lcm_through(2 * n) ** 5
        residual_denominator = int(sp.denom(sp.factor(multiplier * moment)))
        prime = 2 * n + 1
        fields = [
            f"n={n}",
            f"I'={moment}",
            f"five_lcm_residual={residual_denominator}",
        ]
        if sp.isprime(prime) and prime >= 5:
            valuation = p_adic_valuation(moment, prime)
            residue = residue_mod_prime(prime * moment, prime)
            assert valuation == -1
            assert residue == 4
            fields += [f"p={prime}", f"v_p={valuation}", f"pI'_mod_p={residue}"]

        safe_multiplier = (
            2
            * lcm_through(2 * n) ** 2
            * lcm_through(3 * n) ** 2
            * lcm_through(5 * n) ** 3
        )
        assert sp.denom(sp.factor(safe_multiplier * moment)) == 1
        print("  ".join(fields))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--max-n", type=int, default=12)
    arguments = parser.parse_args()
    audit(arguments.max_n)
