"""Certify the last Hermite pivot on [0,1] + i[12,27] from Hardy signs.

Run with NumPy and Python 3. Reuse the outward Euler–Maclaurin enclosures
from certify_pair_moments. No zero ordinates are supplied.
"""
import argparse
from decimal import Decimal, localcontext
from fractions import Fraction
import json
from math import ceil, floor

import numpy as np

from certify_pair_moments import C, R, down, rational, rectangle_moments, source, up


PI = R(3.140625, 3.142578125)
THIRD = rational(Fraction(1, 3))


def monotone_decimal(interval, operation):
    """Enclose log or sqrt on a strictly positive binary64 interval."""
    if not 0 < interval.lo <= interval.hi:
        raise ValueError(f"{operation} requires a positive interval")
    with localcontext() as ctx:
        ctx.prec = 60
        lo, hi = (Decimal.from_float(x) for x in interval.bounds())
        left = getattr(ctx, operation)(lo).next_minus()
        right = getattr(ctx, operation)(hi).next_plus()
        return R(down(float(left)), up(float(right)))


def hardy_sign(height):
    # Round to a dyadic cover. All segment ends, midpoints and radii are exact.
    left, right = floor(64*height.lo), ceil(64*height.hi)
    if left < 12*64 or right > 27*64:
        raise ValueError("sign node outside the certified rectangle")
    starts = np.arange(left*16, right*16, dtype=np.float64)
    if left == right:
        lower = upper = np.array([left/64])
    else:
        lower, upper = starts/1024, (starts+1)/1024
    s = C(R(0.5), R(lower, upper))
    mid = C(R(0.5), R((lower+upper)/2))
    zeta, _ = source(s, mid, R((upper-lower)/2), modulus_bound=28)
    real = R(np.min(zeta.re.lo), np.max(zeta.re.hi))
    if real.lo > 0:
        zeta_sign = 1
    elif real.hi < 0:
        zeta_sign = -1
    else:
        raise ValueError(f"unresolved Re(zeta) on node interval: {real.bounds()}")

    # At y=t/2, theta = y(log(y/pi)-1)-pi/8 + error, |error| <= 25/(96y).
    y = R(left/128, right/128)
    log_ratio = monotone_decimal(y*PI.inverse_positive(), 'ln')
    radius = (rational(Fraction(25, 96))*y.inverse_positive()).hi
    phase = (y*(log_ratio-R(1))-PI*R(0.125)+R(-radius, radius))*PI.inverse_positive()
    band = round((float(phase.lo)+float(phase.hi))/2)
    if not band-0.5 < phase.lo <= phase.hi < band+0.5:
        raise ValueError(f"unresolved cosine sign: theta/pi in {phase.bounds()}")
    return dict(height_dyadic_cover=[left/64, right/64], real_zeta=real.bounds(),
                theta_over_pi=phase.bounds(), hardy_sign=zeta_sign*(-1 if band % 2 else 1))


def certify(n):
    moments = rectangle_moments(n, top=27, center=20, scale=8, degree=3)
    count, first, second, third = moments
    if ceil(count.lo) != 3 or floor(count.hi) != 3:
        raise ValueError(f"count unresolved: {count.bounds()}")
    mean = first*THIRD
    norm = second-first.square()*THIRD  # ||x-mean||^2
    if norm.lo <= 0:
        raise ValueError("lower Hermite block unresolved")
    # q_2=x^2-S*x+constant. Its larger root is the larger Jacobi eigenvalue.
    trace = (third-mean*second)*norm.inverse_positive()
    half_trace = trace*R(0.5)
    gap = monotone_decimal((mean-half_trace).square()+norm*THIRD, 'sqrt')

    def to_height(x):
        return R(20)+R(8)*x

    gaussian = hardy_sign(to_height(half_trace+gap))
    edge = hardy_sign(R(27))
    if gaussian['hardy_sign']*edge['hardy_sign'] != -1:
        raise ValueError("last pivot did not certify positive")

    # A second test uses only p_0,p_1,p_2 to find the cubic derivative nodes.
    critical_gap = monotone_decimal((R(3)*second-first.square())*R(0.5), 'sqrt')
    maximum = hardy_sign(to_height((first-critical_gap)*THIRD))
    minimum = hardy_sign(to_height((first+critical_gap)*THIRD))
    if (maximum['hardy_sign'] != edge['hardy_sign'] or
            minimum['hardy_sign'] != -edge['hardy_sign']):
        raise ValueError("critical-value test unresolved")
    return dict(contour='[0,1]+i[12,27]', coordinate='((s-1/2)/i-20)/8',
                cells_per_side=n, moments=[x.bounds() for x in moments], count=3,
                lower_block_schur_pivot=norm.bounds(), largest_gaussian_node=gaussian,
                right_edge=edge, cubic_local_maximum=maximum, cubic_local_minimum=minimum,
                last_pivot_sign=1, distinct_critical_line_zeros=3)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('n', type=int, default=65536, nargs='?')
    print(json.dumps(certify(parser.parse_args().n), indent=2, allow_nan=False))
