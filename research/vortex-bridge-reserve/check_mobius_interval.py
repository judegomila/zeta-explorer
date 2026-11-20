#!/usr/bin/env python3
"""Independent small-case references for the finite Mobius interval audit."""
from fractions import Fraction
from math import isqrt

from mobius_interval_audit import (
    Arithmetic, Shell, arithmetic_sieve, balanced_cutoff, intersect,
    require, validate_case,
)
from verify_reserve import I


def trial_arithmetic(n):
    remainder, factors = n, {}
    for p in range(2, isqrt(n)+1):
        while remainder % p == 0:
            factors[p] = factors.get(p, 0)+1
            remainder //= p
    if remainder > 1:
        factors[remainder] = factors.get(remainder, 0)+1
    mu = 0 if any(k > 1 for k in factors.values()) else (-1)**len(factors)
    base = next(iter(factors)) if len(factors) == 1 else 0
    return mu, base


def reference_weight(x, n):
    if 2*n <= x or n >= 2*x:
        return I(0)
    log_distance = I(x).ln()-I(n).ln() if n <= x else I(n).ln()-I(x).ln()
    return (I(2).ln()-log_distance)/I(n).sqrt()


def reference_i4(x, u, v):
    # Deliberately enumerate divisors and trial-factor each one. No production
    # sieve, beta accumulation, weight table, or row traversal is used.
    total = I(0)
    for n in range(x//2+1, 2*x):
        coefficient = I(0)
        for a in range(u+1, n+1):
            if n % a:
                continue
            d = n//a
            beta = I(0)
            for r in range(v+1, d+1):
                if d % r == 0:
                    _, p = trial_arithmetic(r)
                    if p:
                        beta = beta+I(p).ln()
            coefficient = coefficient+trial_arithmetic(a)[0]*beta
        total = total+coefficient*reference_weight(x, n)
    return total


def main():
    mu, base = arithmetic_sieve(2048)
    for n in range(1, 2049):
        require((mu[n], base[n]) == trial_arithmetic(n), f'trial factor mismatch: {n}')
    data = Arithmetic(2048, 1024)
    rational = Fraction(0)
    for n in range(1, 129):
        rational += Fraction(trial_arithmetic(n)[0], n)
        require(Fraction(data.m[n].lo) <= rational <= Fraction(data.m[n].hi),
                f'exact rational M prefix not enclosed: {n}')
    for x, u, v in ((64, 4, 4), (64, 16, 2), (65, 4, 4), (64, 8, 1)):
        shell = Shell(data, x)
        result = shell.audit(u, v)
        intersect(I(*result['I4']), reference_i4(x, u, v))
        require(shell.weights[0].lo == shell.weights[0].hi == 0, 'zero support')
        require(shell.weights[2*x].lo == shell.weights[2*x].hi == 0, 'right endpoint')
        if x % 2 == 0:
            require(shell.weights[x//2].lo == shell.weights[x//2].hi == 0, 'left endpoint')
        intersect(shell.weights[x], I(2).ln()/I(x).sqrt())
    for x in (63, 64, 65, 255, 256, 257, 65535, 65536, 65537):
        b = balanced_cutoff(x)
        require(b**8 <= x**3 < (b+1)**8, 'integer balanced cutoff')
    for bad in ((3, 1, 1), (64, 0, 1), (64, 1, 0), (64, 8, 8), (64, 1, 32),
                (64.0, 4, 4)):
        try:
            validate_case(*bad)
        except ValueError:
            pass
        else:
            raise ArithmeticError(f'invalid case accepted: {bad}')
    print('PASS: 2048 trial-factor references, 128 rational prefixes, 4 independent')
    print('divisor-sum references, exact support boundaries and cutoff validation.')


if __name__ == '__main__':
    main()
