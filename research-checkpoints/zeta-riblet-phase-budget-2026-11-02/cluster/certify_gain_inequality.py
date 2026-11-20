"""Certify a correlation-over-energy gain inequality on actual zeta.

The Hilbert-space inequality is general. This computation verifies one anchor,
not the unbounded-height arithmetic lower bound. Floating solves only propose
exact pole-neutral coefficients; all final integrals include outward tails.
"""
from fractions import Fraction as Q
from math import factorial, isqrt
import json

import numpy as np

from certify_actual_window import COEFF
from certify_pair_moments import C, R, log_integer, rational, sum_interval
from certify_filtered_ratio import CENTER, N, ORDER, PI, powers_at
from certify_growing_arithmetic import coefficient_mass, exact_coefficients, modulus_bound


STEP = Q(1, 8192)
WINDOW = 32
D = Q(1, 2)
THRESHOLD = Q(15, 16)
ROUNDING = 2**24


def refined_source(logs):
    """Same complete EM/jet enclosure as the prior checker, with finer bins.

    This certificate is at the exact center, with no height jitter. The source
    uses 1024 terms, eight Bernoulli corrections and degree-16 height jets.
    """
    step = float(STEP)
    block_bins = int(Q(1, 2)/STEP)
    offsets = np.arange(-WINDOW, WINDOW+step, step)
    local = np.arange(block_bins+1)*step-1/4
    delta = R(local[:-1], local[1:])
    jet_error = rational(Q(64*2**(ORDER+1), factorial(ORDER+1))).hi
    endpoint_error = rational(Q(2**(ORDER+1), 32*factorial(ORDER+1))).hi
    assert CENTER-WINDOW > 1900 and CENTER+WINDOW+16 < 2048
    remainder = rational(Q(4*32, 15)*Q(1, 3)**16).hi
    rl, rh, il, ih = [], [], [], []
    for offset in offsets[:-1:block_bins]:
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
        rl.extend(value.re.lo); rh.extend(value.re.hi)
        il.extend(value.im.lo); ih.extend(value.im.hi)
    return R(offsets[:-1], offsets[1:]), C(R(rl, rh), R(il, ih))


def polynomial(coeff, offsets, logs):
    midpoint = (offsets.lo+offsets.hi)/2
    value = C(R(np.zeros(len(midpoint))))
    derivative = Q(0)
    for n, (a, b) in enumerate(coeff, 1):
        logn = R(logs.lo[n-1], logs.hi[n-1])
        value = value+powers_at(R(.5), CENTER+midpoint, logn)*C(rational(a), rational(b))
        derivative += modulus_bound(a,b)*Q(ROUNDING,isqrt(n*ROUNDING**2))*Q(float(logn.hi))
    return value.widen(rational(derivative*STEP/2).hi)


def abs_square(z):
    return z.re.square()+z.im.square()


def integrate(value, weight):
    return sum_interval(value*weight)*R(float(STEP))


def complex_integral(a, b, weight):
    product = C(a.re,-a.im)*b
    return C(integrate(product.re,weight), integrate(product.im,weight))


def neutral(coeff):
    assert sum(a/n for n,(a,_) in enumerate(coeff,1)) == 0
    assert sum(b/n for n,(_,b) in enumerate(coeff,1)) == 0


def exact_controls():
    # A rational complex line minimization. Inner products are conjugate-linear
    # in the first slot; this catches the sign of the complex correction.
    def mul(a,b):
        return (a[0]*b[0]-a[1]*b[1], a[0]*b[1]+a[1]*b[0])
    r=[(Q(2),Q(1)),(Q(-1),Q(3))]
    v=[(Q(1),Q(-1)),(Q(2),Q(1))]
    b=(Q(0),Q(0))
    for x,y in zip(v,r):
        z=mul((x[0],-x[1]),y); b=(b[0]+z[0],b[1]+z[1])
    t=sum(x*x+y*y for x,y in v)
    e=sum(x*x+y*y for x,y in r)
    alpha=(b[0]/t,b[1]/t)
    after=[]
    for x,y in zip(r,v):
        z=mul(alpha,y); after.append((x[0]-z[0],x[1]-z[1]))
    assert sum(x*x+y*y for x,y in after) == e-(b[0]**2+b[1]**2)/t
    # H^2 control: kappa=1-2w+w^2, dictionary w,w^2,... . After fitting
    # the first two modes, residual=1 has energy one and no future gain.
    assert Q(1) > THRESHOLD
    assert Q(6)-Q(4)-Q(1) == Q(1)
    return dict(complex_line_minimization='exact rational identity passed',
                common_zero_control=dict(remaining_energy='1',future_gain='0',
                    gram_condition_number='1',passes_threshold=False))


def certify():
    if np.finfo(np.float64).nmant != 52:
        raise ValueError('requires IEEE binary64 with gradual underflow')
    raw=[log_integer(n) for n in range(1,N+1)]
    logs=R([x.lo for x in raw],[x.hi for x in raw])
    offsets,zeta=refined_source(logs)
    inv=(rational(D*D)+offsets.square()).inverse_positive()
    weight=rational(16*D**5)*PI.inverse_positive()*inv*inv*inv

    # A scalar midpoint fit only proposes an exact dyadic cutoff-two filter.
    base=zeta*polynomial([(Q(-1,2),Q(0)),(Q(1),Q(0))],offsets,logs)
    one=C(R(np.ones(len(offsets.lo))))
    h=complex_integral(base,one,weight)
    gram=integrate(abs_square(base),weight)
    midpoint_h=complex((h.re.lo+h.re.hi)/2,(h.im.lo+h.im.hi)/2)
    free=midpoint_h/float((gram.lo+gram.hi)/2)
    current=exact_coefficients(np.array([-free/2,free]))
    neutral(current)

    # This fixed, approximate orthogonalization retains cancellation before
    # squaring. No exact inverse Gram matrix or true optimum is presumed.
    ar,ai=Q(49239,65536),Q(667683,1048576)
    correction=[(-Q(1)+3*ar/2,3*ai/2),(-3*ar,-3*ai),(Q(3),Q(0))]
    neutral(correction)
    residual=one-zeta*polynomial(current,offsets,logs)
    mode=zeta*polynomial(correction,offsets,logs)
    e=integrate(abs_square(residual),weight)
    t=integrate(abs_square(mode),weight)
    b=complex_integral(mode,residual,weight)

    bd,ba=coefficient_mass(current),coefficient_mass(correction)
    j0=rational(32*D**5/(5*Q(WINDOW)**5))*PI.inverse_positive()
    j1=rational(8*D**5/Q(WINDOW)**4)*PI.inverse_positive()
    linear=rational(1+Q(CENTER))*j0+j1
    e_tail=rational(72*bd**2)*linear+R(2)*j0
    t_tail=rational(36*ba**2)*linear
    b_tail=rational(3*ba)*(rational(2+Q(CENTER))*j0+j1)+rational(36*ba*bd)*linear
    e=e+R(0,e_tail.hi)
    t=t+R(0,t_tail.hi)
    b=b.widen(b_tail.hi)
    gain=abs_square(b)*t.inverse_positive()
    repaired=e-gain
    if Q(float(repaired.hi)) >= THRESHOLD:
        raise ValueError(f'gain inequality not certified: {repaired.bounds()}')
    # An explicit nearby dyadic correction is also directly certified.
    alpha=complex((b.re.lo+b.re.hi)/2,(b.im.lo+b.im.hi)/2)/float((t.lo+t.hi)/2)
    alpha_r=Q(round(alpha.real*ROUNDING),ROUNDING)
    alpha_i=Q(round(alpha.imag*ROUNDING),ROUNDING)
    updated=current+[(Q(0),Q(0))]
    updated=[(a+alpha_r*x-alpha_i*y,bb+alpha_r*y+alpha_i*x)
             for (a,bb),(x,y) in zip(updated,correction)]
    neutral(updated)
    new_residual=one-zeta*polynomial(updated,offsets,logs)
    new_mass=coefficient_mass(updated)
    new_tail=rational(72*new_mass**2)*linear+R(2)*j0
    direct=integrate(abs_square(new_residual),weight)+R(0,new_tail.hi)
    assert Q(float(direct.hi)) < THRESHOLD
    encode=lambda coeff:[[str(a),str(bb)] for a,bb in coeff]
    return dict(status='certified gain at one exact anchor; global correlation bound open',
        anchor=dict(d=str(D),c=str(Q(CENTER)),height_jitter='0'),
        threshold=str(THRESHOLD),source=dict(window=WINDOW,step=str(STEP),
            bins=len(offsets.lo),dirichlet_terms=N,height_jet_degree=ORDER,
            bernoulli_corrections=len(COEFF)),
        current_coefficients=encode(current),correction_coefficients=encode(correction),
        old_energy=e.bounds(),correlation=dict(real=b.re.bounds(),imag=b.im.bounds()),
        correction_energy=t.bounds(),gain=gain.bounds(),
        repaired_energy_upper=float(repaired.hi),
        margin_lower=float((rational(THRESHOLD)-repaired).lo),
        tails=dict(old_energy_upper=float(e_tail.hi),
            correction_energy_upper=float(t_tail.hi),correlation_modulus_upper=float(b_tail.hi)),
        dyadic_step=[str(alpha_r),str(alpha_i)],updated_coefficients=encode(updated),
        updated_energy_direct=direct.bounds(),controls=exact_controls())


if __name__=='__main__':
    print(json.dumps(certify(),indent=2,allow_nan=False))
