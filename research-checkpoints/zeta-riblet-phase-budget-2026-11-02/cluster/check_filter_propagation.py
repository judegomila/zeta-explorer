"""Transport existing arithmetic certificates and enclose a wider height band.

Finite-scale bounds depend on growing-arithmetic.json. The small-scale row
recomputes the complete boundary source and a shifted-kernel envelope.
No all-height stopping assertion is made.
"""
from fractions import Fraction as Q
from hashlib import sha256
from math import isqrt
from pathlib import Path
import json

import numpy as np

from certify_growing_arithmetic import (
    CENTER, JITTER, N, PI, STEP, THRESHOLD, WINDOW, arithmetic_values,
    boundary_source, coefficient_mass,
)
from certify_pair_moments import C, R, log_integer, rational, sum_interval


HALF_WIDTH = Q(1, 128)
UPPER_SCALE = Q(1, 256)
INNER_RADIUS = Q(1, 32)
DEPENDENCY_SHA256 = 'b10d7c89b3e439fcd9c5cbde2c312eb5b1ff6194ddda81e66ce527f13eb3989e'


def sqrt_upper(q, bits=96):
    """Exact dyadic ceiling of sqrt(q), with an integer verification."""
    assert q >= 0
    scale = 1 << bits
    k = isqrt(q.numerator*scale*scale//q.denominator)
    if k*k*q.denominator < q.numerator*scale*scale:
        k += 1
    result = Q(k, scale)
    assert result*result >= q
    if k:
        assert Q(k-1, scale)**2 < q
    return result


def transport_upper(d, other_d, shift):
    # Exact kernel supremum = (other_d/d)^2 * (x+sqrt(x^2-1))^3.
    assert d > 0 and other_d > 0
    x = (d*d+other_d*other_d+shift*shift)/(2*d*other_d)
    return (other_d/d)**2*(x+sqrt_upper(x*x-1))**3


def exact_checks():
    # Verify the eigenvalue/trace identity behind the kernel comparison.
    cases = 0
    for d in [Q(1, 2), Q(1, 16), Q(3, 4)]:
        for other_d in [d/2, d, 2*d]:
            for shift in [Q(0), d/2, -d/4, 3*d]:
                trace = (d*d+other_d*other_d+shift*shift)/(d*other_d)
                # B^{-1}A for P_other/P, using coordinates (t, 1).
                b00 = (shift*shift+other_d*other_d)/(d*other_d)
                b01 = shift*d/other_d
                b10 = shift/(d*other_d)
                b11 = d/other_d
                assert b00+b11 == trace
                assert b00*b11-b01*b10 == 1
                factor = transport_upper(d, other_d, shift)
                for t in [Q(-10), -d, Q(0), d, shift, Q(10)]:
                    ratio = (other_d/d)**5*((d*d+t*t)/
                            (other_d*other_d+(t-shift)**2))**3
                    assert ratio <= factor
                    cases += 1
                if not shift:
                    assert factor == max((other_d/d)**5, d/other_d)
    step = transport_upper(Q(1), Q(1), Q(1, 2))
    return dict(rational_kernel_comparisons=cases,
                adjacent_height_factor_upper=float(rational(step).hi),
                adjacent_height_no_repair_threshold_lower=float(rational(THRESHOLD/step).lo),
                dyadic_halving_same_center_factor=2)


def certify():
    if np.finfo(np.float64).nmant != 52:
        raise ValueError('requires binary64 with gradual underflow')
    path = Path(__file__).with_name('growing-arithmetic.json')
    raw = path.read_bytes()
    digest = sha256(raw).hexdigest()
    if digest != DEPENDENCY_SHA256:
        raise ValueError('recorded input certificate changed; review dependency')
    prior = json.loads(raw)
    assert Q(prior['center']) == Q(CENTER)
    assert Q(prior['threshold']) == THRESHOLD
    assert [Q(w['scale']) for w in prior['witnesses']] == [Q(1, 2**j) for j in range(1, 9)]
    checks = exact_checks()
    finite = []
    for witness in prior['witnesses']:
        d = Q(witness['scale'])
        factor = transport_upper(d, d, HALF_WIDTH)
        # JSON float roundtrips preserve the original binary64 upper endpoints.
        bound = Q(witness['residual_energy'][1])*factor
        assert bound < THRESHOLD
        finite.append(dict(scale=str(d), cutoff=witness['cutoff'],
            transport_factor_upper=float(rational(factor).hi),
            energy_upper=float(rational(bound).hi)))

    coeff = [(Q(a), Q(b)) for a, b in prior['small_scales']['coefficients']]
    assert prior['small_scales']['coefficients'] == prior['witnesses'][-1]['coefficients']
    assert sum(a/n for n, (a, _) in enumerate(coeff, 1)) == 0
    assert sum(b/n for n, (_, b) in enumerate(coeff, 1)) == 0
    raw_logs = [log_integer(n) for n in range(1, N+1)]
    logs = R([v.lo for v in raw_logs], [v.hi for v in raw_logs])
    offsets, source, errors = boundary_source(logs)
    value = source*arithmetic_values(coeff, offsets, logs)-C(R(1))
    square = value.re.square()+value.im.square()

    # A fixed central region contains |t-c|<=INNER_RADIUS for every new c.
    union_radius = INNER_RADIUS+HALF_WIDTH
    assert union_radius/Q(STEP) == int(union_radius/Q(STEP))
    inside = (offsets.lo >= -float(union_radius)) & (offsets.hi <= float(union_radius))
    min_abs = np.maximum(0, np.maximum(offsets.lo, -offsets.hi))
    assert np.all(min_abs[~inside] >= float(union_radius))
    assert INNER_RADIUS**2 > UPPER_SCALE**2/5
    # All inputs here are exact dyadics; subtraction is exact on this grid.
    distance = np.maximum(min_abs-float(HALF_WIDTH), 0)
    inverse = (rational(UPPER_SCALE**2)+R(distance).square()).inverse_positive()
    envelope = rational(16*UPPER_SCALE**5)*PI.inverse_positive()*inverse*inverse*inverse
    masked = R(np.where(inside, 0, square.lo), np.where(inside, 0, square.hi))
    outer = sum_interval(envelope*masked)*R(STEP)
    inner = R(6)*R(np.max(square.hi[inside]))

    # |t-C|>WINDOW implies |t-c|>WINDOW-HALF_WIDTH for all new centers.
    v = Q(WINDOW)-HALF_WIDTH
    mass = coefficient_mass(coeff)
    height_bound = abs(Q(CENTER))+HALF_WIDTH+Q(JITTER)
    j0 = rational(32*UPPER_SCALE**5/(5*v**5))*PI.inverse_positive()
    j1 = rational(8*UPPER_SCALE**5/v**4)*PI.inverse_positive()
    tail = rational(72*mass**2*(1+height_bound)+2)*j0+rational(72*mass**2)*j1
    energy = inner+outer+tail
    assert Q(float(energy.hi)) < THRESHOLD
    return dict(status='certified wider finite band; global gain theorem remains open',
        dependency=dict(file=path.name, sha256=digest), center=CENTER,
        height_half_width=str(HALF_WIDTH), widening_factor=str(HALF_WIDTH/Q(JITTER)),
        threshold=str(THRESHOLD), exact_checks=checks, finite_scales=finite,
        small_scales=dict(upper_scale=str(UPPER_SCALE), inner_radius=str(INNER_RADIUS),
            central_union_radius=str(union_radius), inner_energy_upper=float(inner.hi),
            outer_energy_upper=float(outer.hi), omitted_energy_upper=float(tail.hi),
            energy_upper=float(energy.hi), coefficients=prior['small_scales']['coefficients']),
        source_errors=errors)


if __name__ == '__main__':
    print(json.dumps(certify(), indent=2, allow_nan=False))
