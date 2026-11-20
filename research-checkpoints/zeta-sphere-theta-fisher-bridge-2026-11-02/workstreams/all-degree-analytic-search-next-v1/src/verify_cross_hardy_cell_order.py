#!/usr/bin/env python3
"""Exact standard-library replay for CROSS_HARDY_CELL_ORDER_NEXT.md."""

from fractions import Fraction as Q
from random import Random


def trim(a):
    a = list(a)
    while len(a) > 1 and a[-1] == 0:
        a.pop()
    return a


def add(a, b):
    out = [Q(0)] * max(len(a), len(b))
    for i, x in enumerate(a):
        out[i] += x
    for i, x in enumerate(b):
        out[i] += x
    return trim(out)


def neg(a):
    return [-x for x in a]


def mul(a, b):
    out = [Q(0)] * (len(a) + len(b) - 1)
    for i, x in enumerate(a):
        for j, y in enumerate(b):
            out[i + j] += x * y
    return trim(out)


def deriv(a):
    return trim([Q(i) * a[i] for i in range(1, len(a))] or [Q(0)])


def scale(c, a):
    return trim([c * x for x in a])


def value(a, z):
    return sum((x * z**i for i, x in enumerate(a)), Q(0))


def from_cells(cells):
    return [Q(0)] + [Q(x) for x in cells]


def audit(cells, alpha):
    s = from_cells(cells)
    v = from_cells([abs(x) for x in cells])
    p = from_cells([max(x, 0) for x in cells])
    n = from_cells([max(-x, 0) for x in cells])
    m = value(v, Q(1))
    c = (Q(1) + alpha) * m
    r = add([c], neg(v))
    w = add(mul(r, deriv(s)), mul(deriv(v), s))
    d = add(mul(deriv(p), n), neg(mul(p, deriv(n))))

    # D = (V S' - S V')/2.
    assert scale(Q(2), d) == add(mul(v, deriv(s)), neg(mul(s, deriv(v))))

    # W = C(P'-N') + 2(PN'-P'N).
    rhs16 = add(
        scale(c, add(deriv(p), neg(deriv(n)))),
        scale(Q(2), add(mul(p, deriv(n)), neg(mul(deriv(p), n)))),
    )
    assert w == rhs16

    # Exact division-free hazard factorization and Mobius numerator.
    c_minus_2n = add([c], scale(Q(-2), n))
    c_minus_2p = add([c], scale(Q(-2), p))
    hazard = add(
        mul(c_minus_2n, deriv(p)),
        neg(mul(c_minus_2p, deriv(n))),
    )
    assert w == hazard
    mobius_numerator = add(
        mul(deriv(c_minus_2n), c_minus_2p),
        neg(mul(c_minus_2n, deriv(c_minus_2p))),
    )
    assert mobius_numerator == scale(Q(2), w)

    # W_alpha = G + alpha M S' for the exact alpha-feasibility envelope.
    g = add(
        mul(add([m], neg(v)), deriv(s)),
        mul(deriv(v), s),
    )
    assert w == add(g, scale(alpha * m, deriv(s)))

    # V W = 2 R D + C S V'.
    rhs17 = add(scale(Q(2), mul(r, d)), scale(c, mul(s, deriv(v))))
    assert mul(v, w) == rhs17

    # Direct ordered-pair expansion of D.
    ordered = [Q(0)] * (2 * len(cells) + 1)
    for i, ei in enumerate(cells, start=1):
        for j, ej in enumerate(cells, start=1):
            ordered[i + j - 1] += Q(i - j) * Q(max(ei, 0)) * Q(max(-ej, 0))
    assert d == trim(ordered)

    paired = [Q(0)] * (2 * len(cells) + 1)
    for i in range(1, len(cells) + 1):
        for j in range(1, i):
            ei, ej = cells[i - 1], cells[j - 1]
            paired[i + j - 1] += Q(i - j) * (
                Q(max(ei, 0)) * Q(max(-ej, 0))
                - Q(max(ej, 0)) * Q(max(-ei, 0))
            )
    assert d == trim(paired)
    return s, v, w, d


def main():
    rng = Random(20261103)
    for length in range(1, 10):
        for _ in range(100):
            cells = [rng.randrange(-9, 10) for _ in range(length)]
            alpha = Q(rng.randrange(1, 10), rng.randrange(1, 10))
            audit(cells, alpha)

    a = [-2, 11, 10, -8, -8]
    b = [2, 11, -10, -8, 8]
    sa, va, wa, _ = audit(a, Q(1, 2))
    sb, vb, wb, _ = audit(b, Q(1, 2))
    assert va == vb
    assert value(sa, Q(1, 2)) == value(sb, Q(1, 2)) == Q(9, 4)
    assert value(sa, Q(1)) == value(sb, Q(1)) == Q(3)
    assert value(deriv(sa), Q(1)) == Q(-22)
    assert value(deriv(sb), Q(1)) == Q(2)
    assert value(wa, Q(1)) == Q(-51)
    assert value(wb, Q(1)) == Q(417)
    print("PASS: 900 randomized exact identities and the exact no-go replay")


if __name__ == "__main__":
    main()
