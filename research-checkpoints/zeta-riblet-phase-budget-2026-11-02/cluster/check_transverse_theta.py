"""Enclose the transverse squared-modulus polynomial on all of [32,64]."""
from fractions import Fraction
from math import factorial
import json

import numpy as np

from certify_pair_moments import R, down, up, rational
from check_theta_centroid import theta_moments


ORDER = 14
INTEGER_SAMPLE = 11
TAYLOR = 96
GRID = 1024


def derivative_enclosures(midpoint):
    """Normalized derivatives of Xi at every height in a dyadic subcell."""
    moments = theta_moments(midpoint, 2 * ORDER + TAYLOR)
    factorials = [factorial(k) for k in range(max(2 * ORDER, TAYLOR) + 1)]
    edges = np.arange(GRID + 1, dtype=np.float64) / (GRID // 4) - 2
    delta = R(edges[:-1], edges[1:])
    error = up(1e-65)
    jets = []
    for j in range(2 * ORDER + 1):
        value = R(0)
        for k in range(TAYLOR, -1, -1):
            coefficient = moments[j+k] / (factorials[j] * factorials[k])
            term = R(down(float(coefficient.lo)), up(float(coefficient.hi)))
            value = value * delta + term
        jets.append(value + R(-error, error))
    return jets


def coefficient(jets, n):
    # Pair j and 2n-j before enclosing the central square.
    value = jets[n].square()
    for j in range(n):
        term = R(2) * jets[j] * jets[2*n-j]
        value = value - term if (n+j) % 2 else value + term
    return value


def certify_window(left):
    jets = derivative_enclosures(left + 2)
    # Bound Xi(2k) in its absolutely convergent half-plane.
    k = INTEGER_SAMPLE
    budget = Fraction(2*k*(2*k-1)*factorial(k-1), 3**k)**2
    derivative_tail = 4 * (ORDER+1) * budget / (4*k-1)**(2*(ORDER+1))
    margin = coefficient(jets, 1) - rational(derivative_tail)
    for n in range(2, ORDER + 1):
        low = np.minimum(0, coefficient(jets, n).lo)
        margin += R(low) * R(n * 0.25**(n-1))
    lower = float(np.min(margin.lo))
    if not np.isfinite(lower) or lower <= 0:
        raise ValueError(f'unresolved transverse margin on [{left},{left+4}]: {lower}')
    return dict(heights=[left, left+4], transverse_derivative_lower=lower)


def check_models():
    # f(z)=z^2+s gives |f(ib)|^2=(s-b^2)^2.
    for offset in [0, 0.125, -0.125]:
        jets = [R(offset), R(0), R(1), R(0), R(0)]
        for n, expected in enumerate([offset**2, -2*offset, 1]):
            bound = coefficient(jets, n)
            assert bound.lo <= expected <= bound.hi
        x = Fraction(1, 8)
        transverse = sum(Fraction(a) * x**n for n, a in
                         enumerate([offset**2, -2*offset, 1]))
        assert (transverse == 0) == (offset == x)
    # Exact coefficients of the shifted Gaussian example with cosh(b)=9/8.
    cosh_b = Fraction(9, 8)
    gap = cosh_b - 1
    raw = [gap**2, -gap]
    for n in range(2, 21):
        raw.append((2**(2*n-1) - 2*cosh_b) / factorial(2*n))
    for n in range(1, len(raw)):
        term = sum(raw[j] / factorial(n-j) for j in range(n+1))
        assert (term < 0) == (n == 1) and term != 0


if __name__ == '__main__':
    check_models()
    print(json.dumps(dict(order=ORDER, integer_xi_argument=2*INTEGER_SAMPLE,
                          height_subcells_per_window=GRID,
                          horizontal_taylor_degree=TAYLOR,
                          windows=[certify_window(k) for k in range(32,64,4)]),
                     indent=2, allow_nan=False))
