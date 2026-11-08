"""Enclose three argument-principle moments on [0,1]+i[12,23].

Requires NumPy for vectorized IEEE binary64 elementary arithmetic. No libm
trig, complex division, numerical zeta, or tabulated zeros enter the enclosure.
"""
import argparse
from decimal import Decimal, localcontext
from fractions import Fraction
from math import ceil, floor, prod
import json
import numpy as np

from certify_actual_window import COEFF


def down(x):
    return np.nextafter(x, -np.inf)


def up(x):
    return np.nextafter(x, np.inf)


class R:
    def __init__(self, lo, hi=None):
        self.lo = np.asarray(lo, dtype=np.float64)
        self.hi = self.lo if hi is None else np.asarray(hi, dtype=np.float64)

    def __add__(self, b):
        return R(down(self.lo+b.lo), up(self.hi+b.hi))

    def __neg__(self):
        return R(-self.hi, -self.lo)

    def __sub__(self, b):
        return self + (-b)

    def __mul__(self, b):
        ends = [x*y for x in (self.lo, self.hi) for y in (b.lo, b.hi)]
        return R(down(np.minimum.reduce(ends)), up(np.maximum.reduce(ends)))

    def inverse_positive(self):
        if np.any(self.lo <= 0):
            raise ValueError("unresolved denominator")
        return R(down(1/self.hi), up(1/self.lo))

    def square(self):
        upper = np.maximum(abs(self.lo), abs(self.hi))
        lower = np.maximum(0, np.maximum(self.lo, -self.hi))
        return R(down(lower*lower), up(upper*upper))

    def bounds(self):
        return [float(self.lo), float(self.hi)]


def rational(q):
    # One adjacent binary64 on either side of a round-to-nearest conversion.
    x = float(q)
    return R(down(x), up(x))


class C:
    def __init__(self, re, im=None):
        self.re = re
        self.im = R(0) if im is None else im

    def __add__(self, b):
        return C(self.re+b.re, self.im+b.im)

    def __sub__(self, b):
        return C(self.re-b.re, self.im-b.im)

    def __mul__(self, b):
        return C(self.re*b.re-self.im*b.im, self.im*b.re+self.re*b.im)

    def scale(self, k):
        return C(self.re*k, self.im*k)

    def inverse(self):
        factor = (self.re.square()+self.im.square()).inverse_positive()
        return C(self.re*factor, (-self.im)*factor)

    def widen(self, radius):
        err = R(-radius, radius)
        return C(self.re+err, self.im+err)


def log_integer(n):
    with localcontext() as ctx:
        ctx.prec = 60
        v = Decimal(n).ln()
        return R(down(float(v.next_minus())), up(float(v.next_plus())))


def n_power(mid, radius, logn):
    # exp(z) by Taylor at z=-mid*log(n)/128, |z|<1. Outward Horner
    # evaluation, analytic tail <3/21!, then seven interval squarings.
    z = mid.scale(logn*R(-1/128))
    value = C(R(1))
    for j in range(20, 0, -1):
        value = C(R(1)) + (value*z).scale(rational(Fraction(1, j)))
    value = value.widen(float(up(1e-18)))
    for _ in range(7):
        value = value*value
    return value.widen((radius*logn).hi)


def source(s, mid, radius, *, modulus_bound=24):
    value, deriv = C(R(0)), C(R(0))
    for n in range(1, 17):
        logn = log_integer(n)
        v = n_power(mid, radius, logn)
        if n < 16:
            value, deriv = value+v, deriv-v.scale(logn)
    base = v
    pole = (s-C(R(1))).inverse()
    integral = (base*pole).scale(R(16))
    value = value+integral+base.scale(R(0.5))
    deriv = deriv-integral*(C(logn)+pole)-base.scale(logn*R(0.5))
    poch, dpoch, j = C(R(1)), C(R(0)), 0
    for k, coef in enumerate(COEFF, 1):
        while j < 2*k-1:
            term = s+C(R(j))
            dpoch, poch = dpoch*term+poch, poch*term
            j += 1
        factor = base.scale(rational(coef/16**(2*k-1)))
        value, deriv = value+factor*poch, deriv+factor*(dpoch-poch.scale(logn))
    rem = Fraction(4*prod(range(modulus_bound, modulus_bound+16)), 6**16*15*16**15)
    return value.widen(rational(rem).hi), deriv.widen(rational(5*rem).hi)


def sum_interval(a):
    # Explicit binary reduction so every addition is rounded outward.
    while a.lo.size > 1:
        a = R(a.lo[::2], a.hi[::2])+R(a.lo[1::2], a.hi[1::2])
    return R(a.lo.item(), a.hi.item())


def rectangle_moments(n, *, top, center, scale, degree):
    """Use a dyadic ordinate coordinate on [0,1] + i[12,top]."""
    if top not in (23, 27) or not isinstance(center, int) or scale not in (4, 8):
        raise ValueError("unsupported contour or coordinate")
    if degree not in (2, 3):
        raise ValueError("supported highest moment is two or three")
    if n < 1 or n > 65536 or n & (n-1):
        raise ValueError("choose a dyadic number of cells per side, up to 65536")
    if np.finfo(np.float64).nmant != 52:
        raise ValueError("requires binary64")
    t = np.arange(n, dtype=np.float64)
    totals = [R(0) for _ in range(degree+1)]
    # All endpoints, centers, and differentials below are exact dyadic numbers.
    height = top - 12
    for x, y, dx, dy in [(0,12,1,0),(1,12,0,height),(1,top,-1,0),(0,top,0,-height)]:
        x0, x1 = x+dx*t/n, x+dx*(t+1)/n
        y0, y1 = y+dy*t/n, y+dy*(t+1)/n
        s = C(R(np.minimum(x0,x1),np.maximum(x0,x1)),
              R(np.minimum(y0,y1),np.maximum(y0,y1)))
        mid = C(R((x0+x1)/2),R((y0+y1)/2))
        val, der = source(s, mid, R((abs(dx)+abs(dy))/(2*n)), modulus_bound=top+1)
        integral = der*val.inverse()*C(R(dx/n),R(dy/n))
        z = C(s.im-R(center), R(0.5)-s.re).scale(R(1/scale))
        for j in range(degree+1):
            totals[j] = totals[j]+sum_interval(integral.im)
            integral = integral*z
    inv_two_pi = R(2*3.140625, 2*3.142578125).inverse_positive()
    moments = [moment*inv_two_pi for moment in totals]
    if not all(np.isfinite(x) for v in moments for x in v.bounds()):
        raise ValueError("non-finite moment enclosure")
    return moments


def certify(n):
    moments = rectangle_moments(n, top=23, center=18, scale=4, degree=2)
    if ceil(moments[0].lo) != 2 or floor(moments[0].hi) != 2:
        raise ValueError(f"count unresolved: {moments[0].bounds()}")
    delta = R(2)*moments[2]-moments[1].square()
    if not all(np.isfinite(x) for v in [*moments, delta] for x in v.bounds()):
        raise ValueError("non-finite moment enclosure")
    if delta.lo <= 0:
        raise ValueError(f"pair discriminant unresolved: {delta.bounds()}")
    return dict(cells_per_side=n, contour='[0,1]+i[12,23]', coordinate='((s-1/2)/i-18)/4',
                moments=[m.bounds() for m in moments], count=2,
                discriminant=delta.bounds(), conclusion='two distinct critical-line zeros in the bounded contour')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('n', type=int, default=16384, nargs='?')
    print(json.dumps(certify(parser.parse_args().n), indent=2, allow_nan=False))
