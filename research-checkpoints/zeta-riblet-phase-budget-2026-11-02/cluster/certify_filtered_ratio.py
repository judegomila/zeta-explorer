"""Interval certificate for a false low raw ratio and its degree-one repair."""
from fractions import Fraction as Q
from math import factorial

import numpy as np

from certify_actual_window import COEFF
from certify_pair_moments import C, R, log_integer, rational, sum_interval, up


CENTER = 1967 + 13/32
JITTER = 1/4096
N = 1024
ORDER = 16
STEP = 1/512
PI = R(333/106, 355/113)  # These rounded endpoints still strictly enclose pi.


def em_error():
    # Uniform for 1950 < t < 1985 and 1/2 <= sigma <= 1.
    rate = Q(2016, N)
    corrections = sum(abs(c) * rate**(2*k-1)/32 for k, c in enumerate(COEFF, 1))
    bound = Q(32,1950) + Q(1,64) + corrections + Q(4*32,15)*(rate/6)**16
    assert bound < Q(1,25)
    return rational(bound).hi


def powers_at(sigma, height, logs):
    # exp(-s log(n)/2^14) has argument of modulus < 1. Scale and square.
    z = C(sigma, R(height)).scale(logs * R(-1/16384))
    value = C(R(1))
    for k in range(20, 0, -1):
        value = C(R(1)) + (value*z).scale(rational(Q(1,k)))
    value = value.widen(up(1e-18))
    for _ in range(14):
        value = value*value
    return value


def boundary_bins(logs, error):
    # Integrate at offsets v about every permitted c. These bin and block
    # endpoints are exact dyadics. Enlarge the height jets by JITTER only.
    offsets = np.arange(-16, 16 + STEP, STEP)
    per_block = 256
    local = np.arange(per_block+1)*STEP - 1/4
    delta = R(local[:-1] - JITTER, local[1:] + JITTER)
    taylor_error = rational(Q(64 * 2**(ORDER+1), factorial(ORDER+1))).hi
    lower, upper = [], []
    for offset in offsets[:-1:per_block]:
        term = powers_at(R(0.5), CENTER + offset + 1/4, logs)
        jets = []
        for k in range(ORDER+1):
            jets.append(C(sum_interval(term.re), sum_interval(term.im)))
            if k < ORDER:
                factor = logs * rational(Q(1,k+1))
                term = C(term.im*factor, (-term.re)*factor)
        value = jets[-1]
        for jet in reversed(jets[:-1]):
            value = jet + value.scale(delta)
        value = value.widen(taylor_error).widen(error)
        mass = value.re.square() + value.im.square()
        lower.extend(mass.lo)
        upper.extend(mass.hi)
    return R(offsets[:-1], offsets[1:]), R(lower, upper)


def numerator(d, small_scales, logs, error):
    # For small_scales cover 0 <= displacement <= d by variation along sigma.
    sigma = R(0.5 if small_scales else 0.5+d)
    terms = powers_at(sigma, CENTER, logs)
    value = C(sum_interval(terms.re), sum_interval(terms.im))
    variation = 448 * (JITTER + (d if small_scales else 0))
    value = value.widen(variation).widen(error)
    modulus = value.re.square() + value.im.square()
    real = R(0.5 if small_scales else 0.5+d, 0.5+d)
    t2 = R(CENTER-JITTER, CENTER+JITTER).square()
    return modulus * ((real-R(1)).square()+t2) * (real.square()+t2).inverse_positive()


def tail_bound(d, cutoff_y, q):
    h = Q(2) + 2*Q(CENTER+JITTER)
    d, y = Q(d), Q(cutoff_y)
    integral = h*h/(5*y**5) + h*d/y**4 + 4*d*d/(3*y**3)
    return R(32) * PI.inverse_positive() * rational(integral*(1+Q(q))**2)


def energy(d, q, offsets, mass):
    v2 = offsets.square()
    total = R(d*d) + v2
    inv = total.inverse_positive()
    weight = R(16*d**5) * PI.inverse_positive() * inv * inv * inv
    # w=(iv-d)/(iv+d) on the boundary and p(w)=1+q w.
    filter_sq = (R(((1-q)*d)**2) + R((1+q)**2)*v2) * inv if q else R(1)
    finite = sum_interval(mass*weight*filter_sq) * R(STEP)
    tail = tail_bound(d, 16/d, q)
    return finite + R(0, tail.hi)


def certify():
    logs = [log_integer(n) for n in range(1,N+1)]
    logs = R([x.lo for x in logs], [x.hi for x in logs])
    error = em_error()
    offsets, mass = boundary_bins(logs, error)
    bounds = {}
    for j in range(1,8):
        d = 2.0**-j
        num = numerator(d, False, logs, error)
        raw = num * energy(d, 0, offsets, mass).inverse_positive()
        if j == 1:
            bounds['raw, d=1/2'] = raw.bounds()
            assert Q(float(raw.hi)) < Q(247, 10000)
            repaired = num * energy(d, 0.75, offsets, mass).inverse_positive()
            bounds['linear filter, d=1/2'] = repaired.bounds()
            assert Q(float(repaired.lo)) > Q(44, 1000)
        else:
            bounds[f'raw, d=1/{2**j}'] = raw.bounds()
            assert Q(float(raw.lo)) > Q(455, 10000)

    # In the scaled integral |y|<=32 entails |v|<=1/4 at d<=1/128.
    # The positive kernel has total mass six. Bound the remainder separately.
    inner = (offsets.lo >= -1/4) & (offsets.hi <= 1/4)
    d = 1/128
    energy_upper = R(6)*R(np.max(mass.hi[inner])) + tail_bound(d, 32, 0)
    low = numerator(d, True, logs, error) * energy_upper.inverse_positive()
    bounds['raw, all 0<d<=1/128'] = [float(low.lo), 1.0]
    assert Q(float(low.lo)) > Q(523, 10000)
    return bounds


if __name__ == '__main__':
    for label, (low, high) in certify().items():
        print(f'{label}: [{low:.7f}, {high:.7f}] (rounded display)')
