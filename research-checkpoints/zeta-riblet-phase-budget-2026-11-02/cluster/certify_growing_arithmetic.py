"""Grow a pole-neutral arithmetic filter and certify a complete height band.

NumPy least squares only proposes exact dyadic coefficients. Outward binary64
intervals certify each residual, including the entire omitted boundary.
The source domain is fixed; no all-height termination claim is made.
"""
from fractions import Fraction as Q
from math import factorial, isqrt
import json

import numpy as np

from certify_actual_window import COEFF
from certify_pair_moments import C, R, log_integer, rational, sum_interval
from certify_filtered_ratio import CENTER, JITTER, N, ORDER, PI, STEP, powers_at


WINDOW = 64
THRESHOLD = Q(15, 16)
ROUNDING = 2**24


def exact_coefficients(proposal):
    # Round a_n/n, then eliminate the pole exactly. Every final a_n is dyadic.
    free = [
        (Q(round((v/n).real*ROUNDING), ROUNDING),
         Q(round((v/n).imag*ROUNDING), ROUNDING))
        for n, v in enumerate(proposal[1:], 2)
    ]
    return [(-sum(a for a, _ in free), -sum(b for _, b in free))] + [
        (n*a, n*b) for n, (a, b) in enumerate(free, 2)
    ]


def modulus_bound(a, b):
    q = (a*a+b*b)*ROUNDING**2
    k = isqrt(q.numerator//q.denominator)
    if k*k*q.denominator < q.numerator:
        k += 1
    return Q(k, ROUNDING)


def coefficient_mass(coeff):
    # Integer square roots give exact rational upper bounds for 1/sqrt(n).
    return sum(modulus_bound(a, b)*Q(ROUNDING, isqrt(n*ROUNDING**2))
               for n, (a, b) in enumerate(coeff, 1))


def boundary_source(logs):
    """Complete Euler--Maclaurin correction, not a Dirichlet-sum proxy."""
    offsets = np.arange(-WINDOW, WINDOW+STEP, STEP)
    local = np.arange(257)*STEP-1/4
    delta = R(local[:-1]-JITTER, local[1:]+JITTER)
    jet_error = rational(Q(64*2**(ORDER+1), factorial(ORDER+1))).hi
    endpoint_error = rational(Q(2**(ORDER+1), 32*factorial(ORDER+1))).hi
    # In this rectangle |s+j|<2048, 0<=j<=15, sigma=1/2, N=1024.
    assert CENTER-WINDOW-JITTER > 1900
    assert CENTER+WINDOW+JITTER+16 < 2048
    remainder = rational(Q(4*32, 15)*Q(1, 3)**16).hi
    real_lo, real_hi, imag_lo, imag_hi = [], [], [], []
    for offset in offsets[:-1:256]:
        height = CENTER+offset+1/4
        term = powers_at(R(.5), height, logs)
        jets, last_jets = [], []
        for k in range(ORDER+1):
            jets.append(C(sum_interval(term.re), sum_interval(term.im)))
            last_jets.append(C(R(term.re.lo[-1], term.re.hi[-1]),
                               R(term.im.lo[-1], term.im.hi[-1])))
            if k < ORDER:
                factor = logs*rational(Q(1, k+1))
                term = C(term.im*factor, (-term.re)*factor)
        value, last = jets[-1], last_jets[-1]
        for jet, end in zip(reversed(jets[:-1]), reversed(last_jets[:-1])):
            value, last = jet+value.scale(delta), end+last.scale(delta)
        value, last = value.widen(jet_error), last.widen(endpoint_error)
        s = C(R(.5), R(height)+delta)
        correction = (s-C(R(1))).inverse().scale(R(N))-C(R(.5))
        poch, power = C(R(1)), 0
        for k, coef in enumerate(COEFF, 1):
            while power < 2*k-1:
                poch = poch*(s+C(R(power)))
                power += 1
            correction = correction+poch.scale(rational(coef/N**(2*k-1)))
        value = (value+last*correction).widen(remainder)
        real_lo.extend(value.re.lo); real_hi.extend(value.re.hi)
        imag_lo.extend(value.im.lo); imag_hi.extend(value.im.hi)
    return (R(offsets[:-1], offsets[1:]),
            C(R(real_lo, real_hi), R(imag_lo, imag_hi)),
            dict(em_remainder_upper=float(remainder),
                 source_jet_remainder_upper=float(jet_error)))


def arithmetic_values(coeff, offsets, logs):
    midpoint = (offsets.lo+offsets.hi)/2
    value = C(R(np.zeros(len(midpoint))))
    derivative = Q(0)
    for n, (a, b) in enumerate(coeff, 1):
        logn = R(logs.lo[n-1], logs.hi[n-1])
        power = powers_at(R(.5), CENTER+midpoint, logn)
        value = value+power*C(rational(a), rational(b))
        # log(n)<=n is elementary; use the already certified sharper endpoint.
        derivative += modulus_bound(a, b)*Q(ROUNDING, isqrt(n*ROUNDING**2))*Q(float(logn.hi))
    return value.widen(rational(derivative*(Q(STEP)/2+Q(JITTER))).hi)


def tail_bound(d, cutoff, mass):
    # |zeta(1/2+it)| <= 6 sqrt(1+|t|), proved in the accompanying note.
    d, cutoff = Q(d), Q(cutoff)
    j0 = rational(32*d**5/(5*cutoff**5))*PI.inverse_positive()
    j1 = rational(8*d**5/cutoff**4)*PI.inverse_positive()
    return (rational(72*mass**2*(1+Q(CENTER)+Q(JITTER))+2)*j0
            +rational(72*mass**2)*j1)


def kernel(d, offsets):
    inv = (R(d*d)+offsets.square()).inverse_positive()
    return R(16*d**5)*PI.inverse_positive()*inv*inv*inv


def propose(length, d, offsets, source):
    v = (offsets.lo+offsets.hi)/2
    s = .5+1j*(CENTER+v)
    zeta = (source.re.lo+source.re.hi)/2+1j*(source.im.lo+source.im.hi)/2
    n = np.arange(1, length+1)
    transform = np.vstack([-1/n[1:], np.eye(length-1)])
    basis = zeta[:, None]*(np.exp(-s[:, None]*np.log(n))@transform)
    weight = STEP*16*d**5/(np.pi*(d*d+v*v)**3)
    j0 = 32*d**5/(5*np.pi*WINDOW**5)
    j1 = 8*d**5/(np.pi*WINDOW**4)
    penalty = 72*((CENTER+1)*j0+j1)*length
    design = np.vstack([np.sqrt(weight)[:, None]*basis,
                        np.sqrt(penalty)*transform/np.sqrt(n)[:, None]])
    target = np.r_[np.sqrt(weight), np.zeros(length)]
    free = np.linalg.lstsq(design, target, rcond=1e-12)[0]
    return exact_coefficients(transform@free)


def residual(coeff, d, offsets, source, logs):
    value = source*arithmetic_values(coeff, offsets, logs)-C(R(1))
    square = value.re.square()+value.im.square()
    finite = sum_interval(kernel(d, offsets)*square)*R(STEP)
    tail = tail_bound(d, WINDOW, coefficient_mass(coeff))
    return finite+R(0, tail.hi), square, tail


def cutoff_two_lower(d, offsets, source, logs):
    # All D with length<=2 and D(1)=0 are multiples of 1-2*2^(-s).
    phi = source*arithmetic_values([(Q(1), Q(0)), (Q(-2), Q(0))], offsets, logs)
    weight = kernel(d, offsets)
    mass = sum_interval(weight)*R(STEP)
    gram = sum_interval(weight*(phi.re.square()+phi.im.square()))*R(STEP)
    b = C(sum_interval(weight*phi.re)*R(STEP), sum_interval(weight*phi.im)*R(STEP))
    # The whole-boundary minimum is at least the finite-window minimum.
    return mass-(b.re.square()+b.im.square())*gram.inverse_positive()


def exact_geometry():
    minimum = Q(64)/(Q(4)+Q(1, 16))**3
    assert minimum == Q(262144, 274625) > THRESHOLD
    cases = 0
    for d in [Q(1, 2), Q(1, 4), Q(1, 16)]:
        for r in [Q(1, 2), Q(3, 4), Q(1)]:
            for u in [Q(0), Q(1, 8), Q(-1, 4)]:
                b, v = r*d, u*d
                den = (b+d)**2+v*v
                wr, wi = (b*b-d*d+v*v)/den, 2*d*v/den
                defect = (1-wr*wr-wi*wi)*((1-wr)**2+wi*wi)**2
                assert defect == 64*d**5*b/den**3 >= minimum
                cases += 1
    assert 1-4*Q(1, 2)-5*Q(1, 2)**2+Q(1, 16) < 0
    return dict(exact_evaluation_cases=cases, geometric_minimum=str(minimum),
                required_energy_strict_upper=str(THRESHOLD))


def certify():
    if np.finfo(np.float64).nmant != 52:
        raise ValueError('requires binary64 with gradual underflow')
    geometry = exact_geometry()
    raw = [log_integer(n) for n in range(1, N+1)]
    logs = R([v.lo for v in raw], [v.hi for v in raw])
    offsets, source, source_errors = boundary_source(logs)
    lower = cutoff_two_lower(.5, offsets, source, logs)
    if Q(float(lower.lo)) <= THRESHOLD:
        raise ValueError('cutoff-two obstruction unresolved')
    witnesses = []
    for j in range(1, 9):
        d = 2.0**-j
        trials = []
        for length in range(2, 17):
            coeff = propose(length, d, offsets, source)
            assert sum(a/n for n, (a, _) in enumerate(coeff, 1)) == 0
            assert sum(b/n for n, (_, b) in enumerate(coeff, 1)) == 0
            energy, square, tail = residual(coeff, d, offsets, source, logs)
            trials.append(dict(cutoff=length, energy_upper=float(energy.hi)))
            if Q(float(energy.hi)) < THRESHOLD:
                witnesses.append(dict(scale=str(Q(d)), cutoff=length,
                    coefficients=[[str(a), str(b)] for a, b in coeff],
                    residual_energy=energy.bounds(), omitted_energy_upper=float(tail.hi),
                    trials=trials))
                break
        else:
            raise ValueError(f'unresolved arithmetic cutoff at scale {d}')
    # The last selected fixed D covers the entire continuum 0<d<=1/256.
    inner_radius = 1/32
    assert Q(inner_radius)**2 > Q(1, 256)**2/5
    inside = (offsets.lo >= -inner_radius) & (offsets.hi <= inner_radius)
    outside_square = R(np.where(inside, 0, square.lo), np.where(inside, 0, square.hi))
    # K_d(v) increases with d whenever 5*v^2>d^2. Thus every outer
    # cell is bounded by the largest scale, retaining actual zeta data.
    outside = sum_interval(kernel(1/256, offsets)*outside_square)*R(STEP)
    small = (R(6)*R(np.max(square.hi[inside]))+outside
             +tail_bound(1/256, WINDOW, coefficient_mass(coeff)))
    if Q(float(small.hi)) >= THRESHOLD:
        raise ValueError(f'small-scale continuum unresolved: {small.bounds()}')
    return dict(status='certified finite band; all-height gain remains open',
        center=CENTER, height_half_width=JITTER, threshold=str(THRESHOLD),
        geometry=geometry, source_errors=source_errors,
        cutoff_two_minimum_lower_at_half=float(lower.lo),
        witnesses=witnesses,
        small_scales=dict(upper_scale='1/256', inner_radius=str(Q(inner_radius)),
                          energy_upper=float(small.hi),
                          coefficients=witnesses[-1]['coefficients']))


if __name__ == '__main__':
    print(json.dumps(certify(), indent=2, allow_nan=False))
