#!/usr/bin/env python3
"""Exact-rational enclosure checks for the arithmetic used by the certificate."""
from fractions import Fraction as Q
from random import Random
from verify_reserve import I


def inside(interval, exact):
    assert Q(interval.lo) <= exact <= Q(interval.hi), (interval.strings(), exact)


def main():
    rng = Random(20261021)
    count = 0
    for _ in range(1000):
        a, b, c, d = (rng.randrange(-10**6, 10**6) or 1 for _ in range(4))
        x, y = I(a)/abs(b), I(c)/abs(d)
        qx, qy = Q(a, abs(b)), Q(c, abs(d))
        inside(x+y, qx+qy)
        inside(x-y, qx-qy)
        inside(x*y, qx*qy)
        inside(x/y, qx/qy)
        inside(x**5, qx**5)
        count += 5
    for n in range(1, 101):
        root = I(n).sqrt()
        assert Q(root.lo)**2 <= n <= Q(root.hi)**2
        count += 1
    print(f'{count} exact-rational enclosure checks passed')


if __name__ == '__main__':
    main()
