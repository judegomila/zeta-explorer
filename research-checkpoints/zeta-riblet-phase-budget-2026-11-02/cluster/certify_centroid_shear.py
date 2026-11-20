"""Outward zeta-jet and winding certificates near height 111. Requires NumPy."""
import json
from fractions import Fraction
from math import prod

import numpy as np

from certify_pair_moments import C, R, COEFF, log_integer, n_power, rational


def cells(x, y, dx, dy, n):
    # All coordinates here are dyadic. The paths are horizontal or vertical.
    steps = np.arange(n+1, dtype=np.float64)/n
    xx, yy = x+dx*steps, y+dy*steps
    def enclosure(v):
        return R(np.minimum(v[1:], v[:-1]), np.maximum(v[1:], v[:-1]))
    s = C(enclosure(xx), enclosure(yy))
    mid = C(R((xx[1:]+xx[:-1])/2), R((yy[1:]+yy[:-1])/2))
    return s, mid, R((abs(dx)+abs(dy))/(2*n))


def zeta_jet(s, mid, radius):
    if (np.any(s.re.lo < 0) or np.any(s.re.hi > 1) or
            np.any(s.im.lo < 32) or np.any(s.im.hi > 114)):
        raise ValueError("outside the proved source domain")
    zero, one = C(R(0)), C(R(1))
    value = first = second = zero
    for n in range(1, 65):
        logn = log_integer(n)
        # Exponentiate at one fourth of the midpoint. The inner Taylor
        # argument has modulus < 115 log(64)/512 < 1.
        small = n_power(mid.scale(R(0.25)), R(0), logn)
        half = small*small
        power = (half*half).widen((radius*logn).hi)
        if n < 64:
            value = value+power
            first = first-power.scale(logn)
            second = second+power.scale(logn.square())

    pole = (s-one).inverse()
    b = pole.scale(R(64))+C(R(0.5))
    db = (pole*pole).scale(R(-64))
    ddb = (pole*pole*pole).scale(R(128))
    p, dp, ddp = one, zero, zero
    j = 0
    for k, coefficient in enumerate(COEFF, 1):
        while j < 2*k-1:
            factor = s+C(R(j))
            ddp, dp, p = ddp*factor+dp.scale(R(2)), dp*factor+p, p*factor
            j += 1
        scale = rational(coefficient/64**j)
        b, db, ddb = b+p.scale(scale), db+dp.scale(scale), ddb+ddp.scale(scale)
    value = value+power*b
    first = first+power*(db-b.scale(logn))
    second = second+power*(ddb-db.scale(R(2)*logn)+b.scale(logn.square()))
    # On every radius-1/4 Cauchy disk Re(s)>=-1/4, |s|<116.
    # Use Re(s)>=-1, integral <= 64^(-14)/14 for order 16.
    remainder = Fraction(4*prod(range(116,132)), 6**16*14*64**14)
    return (value.widen(rational(remainder).hi),
            first.widen(rational(4*remainder).hi),
            second.widen(rational(32*remainder).hi))


def count(bottom, top, n):
    sides = [(0,bottom,1,0), (1,bottom,0,top-bottom),
             (1,top,-1,0), (0,top,0,bottom-top)]
    boxes = [zeta_jet(*cells(*side,n))[0] for side in sides]
    real_lo, real_hi, imag_lo, imag_hi = [
        np.concatenate([getattr(getattr(z, part), end) for z in boxes])
        for part, end in [('re','lo'), ('re','hi'), ('im','lo'), ('im','hi')]]
    for lo, hi in [(real_lo,real_hi), (imag_lo,imag_hi)]:
        if np.any(np.maximum(lo,np.roll(lo,1)) > np.minimum(hi,np.roll(hi,1))):
            raise ValueError("disjoint consecutive boxes")
    touches_axis = (imag_lo <= 0) & (imag_hi >= 0)
    if np.any(touches_axis & (real_lo <= 0) & (real_hi >= 0)):
        raise ValueError("unresolved zero-free boundary")
    # One polygon vertex in each consecutive overlap, using its lower corner.
    y = np.maximum(imag_lo,np.roll(imag_lo,1))
    next_y = np.roll(y,-1)
    positive = real_lo > 0
    upward = np.count_nonzero(positive & (y <= 0) & (next_y > 0))
    downward = np.count_nonzero(positive & (next_y <= 0) & (y > 0))
    return int(upward-downward)


def certify(n=4096):
    if n < 1 or n > 65536 or n & (n-1):
        raise ValueError("use a supported dyadic mesh")
    outer = count(108,114,n)
    inner = count(111,112,n)
    if (inner,outer) != (2,2):
        raise ValueError(f"counts unresolved: {inner}, {outer}")
    value, first, second = zeta_jet(*cells(0.5,110.75,0,1.375,n))
    mass = value.re.square()+value.im.square()
    curvature = (first.re.square()+first.im.square()+
                 second.re*value.re+second.im*value.im-R(5.5)*mass)
    lower = float(np.min(curvature.lo))
    if not np.isfinite(lower) or lower <= 0:
        raise ValueError(f"centroid shear unresolved: {lower}")
    radius = Fraction(1,2)
    clearance = Fraction(2)
    outside = 3*(1+2/clearance**2)
    if outside*radius**2 >= 2:
        raise ValueError("isolation budget exhausted")
    return dict(cells_per_side=n, cells_on_line=n, outer_count=outer, inner_count=inner,
                cluster_height_interval=[111,112], shear_test_cover=[110.75,112.125], normalized_by_completion_squared_lower=lower,
                K=0, exterior_M_upper=str(outside), transverse_radius=str(radius),
                budget_upper=str(outside*radius**2), required_strict_upper=2,
                conclusion="two distinct critical-line zeros in the inner strip rectangle")


if __name__ == '__main__':
    print(json.dumps(certify(), indent=2, allow_nan=False))
