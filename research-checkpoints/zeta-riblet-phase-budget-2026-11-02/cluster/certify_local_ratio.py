"""Enclose the local zeta energy ratio near height 18 at every dyadic scale."""
from fractions import Fraction

import numpy as np

from certify_pair_moments import C, R, rational, source, sum_interval


def enclose_zeta(sigma, height):
    # All interval endpoints passed here, their midpoints and radii are exact dyadics.
    mid = C(R((sigma.lo + sigma.hi) / 2), R((height.lo + height.hi) / 2))
    radius = R((sigma.hi - sigma.lo + height.hi - height.lo) / 2)
    s = C(sigma, height)
    value, _ = source(s, mid, radius, modulus_bound=35)
    return value.re.square() + value.im.square()


def ratio_lower(d_min, d_max):
    half_width = 1 / 128
    center = R(18 - half_width, 18 + half_width)
    sigma = R(0.5 + d_min, 0.5 + d_max)
    numerator = enclose_zeta(sigma, center)
    numerator *= ((sigma - R(1)).square() + center.square()) * (
        sigma.square() + center.square()).inverse_positive()

    cutoff, bins = 32, 2048
    edges = np.linspace(-cutoff, cutoff, bins + 1)
    y = R(edges[:-1], edges[1:])
    # Products below are exact dyadics. Take their hull for every cell.
    ends = np.stack([d * edge for d in [d_min, d_max] for edge in [y.lo, y.hi]])
    t = R(center.lo + ends.min(axis=0), center.hi + ends.max(axis=0))
    mass = enclose_zeta(R(0.5), t)
    kernel = (R(1) + y.square()).inverse_positive()
    finite = sum_interval(mass * kernel * kernel * kernel) * R(2 * cutoff / bins)
    # On the critical line |U|=|zeta| <= 2+2|t|. Integrate both tails.
    h = Fraction(2) + 2 * Fraction(float(center.hi))
    d = Fraction(d_max)
    tail = 2 * (h*h / (5*cutoff**5) + h*d / cutoff**4 + 4*d*d / (3*cutoff**3))
    # 333/106 < pi and hence this is an upper bound for the energy.
    energy = (finite + rational(tail)) * rational(Fraction(16*106, 333))
    return float((numerator * energy.inverse_positive()).lo)


if __name__ == '__main__':
    # Check the exact decimal margins reported in the coverage note.
    for power, margin in enumerate([486, 693, 838, 924, 971], start=1):
        d = 2.0**-power
        low = ratio_lower(d, d)
        assert np.isfinite(low) and Fraction(low) > Fraction(margin, 10000)
        print(f'd={d:g}: ratio > {margin / 10000:.4f}')
    low = ratio_lower(0, 1/32)
    assert np.isfinite(low) and Fraction(low) > Fraction(469, 10000)
    print('0 < d <= 1/32: ratio > 0.0469')
