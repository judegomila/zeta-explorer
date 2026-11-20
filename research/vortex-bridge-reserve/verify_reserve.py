#!/usr/bin/env python3
"""Recompute outward-rounded finite positivity bounds for Suzuki's Psi.

Standard library only. This proves a FINITE scalar inequality, not RH or
positivity of every compact-support Weil test. See REPORT.md for the proof.
"""
import argparse
import csv
import hashlib
import heapq
import json
from decimal import Decimal as D, Context, ROUND_FLOOR, ROUND_CEILING, getcontext
from pathlib import Path
from time import monotonic

PREC = 50
getcontext().prec = PREC
DN = Context(prec=PREC, rounding=ROUND_FLOOR)
UP = Context(prec=PREC, rounding=ROUND_CEILING)


class I:
    __slots__ = ('lo', 'hi')

    def __init__(self, lo=0, hi=None):
        if isinstance(lo, I):
            self.lo, self.hi = lo.lo, lo.hi
        else:
            self.lo = D(lo)
            self.hi = self.lo if hi is None else D(hi)
        if self.lo > self.hi:
            raise ValueError('reversed interval')

    def __add__(self, other):
        other = I(other)
        return I(DN.add(self.lo, other.lo), UP.add(self.hi, other.hi))
    __radd__ = __add__

    def __neg__(self):
        return I(self.hi.copy_negate(), self.lo.copy_negate())

    def __sub__(self, other):
        return self + (-I(other))

    def __rsub__(self, other):
        return I(other) - self

    def __mul__(self, other):
        other = I(other)
        products = [(a, b) for a in (self.lo, self.hi)
                    for b in (other.lo, other.hi)]
        return I(min(DN.multiply(a, b) for a, b in products),
                 max(UP.multiply(a, b) for a, b in products))
    __rmul__ = __mul__

    def __truediv__(self, other):
        other = I(other)
        if other.lo <= 0 <= other.hi:
            raise ZeroDivisionError('interval contains zero')
        reciprocal = I(DN.divide(D(1), other.hi),
                       UP.divide(D(1), other.lo))
        return self * reciprocal

    def __rtruediv__(self, other):
        return I(other) / self

    def __pow__(self, n):
        if not isinstance(n, int) or n < 0:
            raise ValueError('only nonnegative integer powers')
        out, base = I(1), self
        while n:
            if n & 1:
                out = out * base
            base = base * base
            n >>= 1
        return out

    def ln(self):
        if self.lo <= 0:
            raise ValueError('log domain')
        # Decimal ln/exp/sqrt are correctly rounded; expand one representable
        # value in each direction rather than assuming directed transcendental
        # rounding is respected by the implementation.
        return I(DN.next_minus(DN.ln(self.lo)), UP.next_plus(UP.ln(self.hi)))

    def exp(self):
        return I(DN.next_minus(DN.exp(self.lo)), UP.next_plus(UP.exp(self.hi)))

    def sqrt(self):
        if self.lo < 0:
            raise ValueError('sqrt domain')
        return I(DN.next_minus(DN.sqrt(self.lo)), UP.next_plus(UP.sqrt(self.hi)))

    def strings(self):
        return [str(self.lo), str(self.hi)]


def atan_small(q, terms=90):
    x = I(1) / q
    total, power = I(0), x
    for k in range(terms):
        term = power / (2*k + 1)
        total = total + term if k % 2 == 0 else total - term
        power = power * x * x
    remainder = power / (2*terms + 1)
    return total + I(-remainder.hi, remainder.hi)


def constants():
    pi = 16*atan_small(5) - 4*atan_small(239)
    bernoulli = [(1, 6), (-1, 30), (1, 42), (-1, 30), (5, 66),
                 (-691, 2730), (7, 6), (-3617, 510), (43867, 798),
                 (-174611, 330)]
    shift = 64
    z = I(shift) + I(1)/4
    psi = z.ln() - 1/(2*z)
    tri = 1/z + 1/(2*z*z)
    for k, (num, den) in enumerate(bernoulli, 1):
        b = I(num)/den
        psi = psi - b/(2*k*z**(2*k))
        tri = tri + b/z**(2*k+1)
    # Euler--Maclaurin remainder bounded by the LAST included Bernoulli
    # term via the sup norm of periodic B_(2K). This conservative bound
    # does not require differentiating a remainder inequality.
    k = len(bernoulli)
    b = I(abs(bernoulli[-1][0])) / bernoulli[-1][1]
    ep = b/(2*k*z**(2*k))
    et = b/z**(2*k+1)
    psi = psi + I(-ep.hi, ep.hi)
    tri = tri + I(-et.hi, et.hi)
    for j in range(shift):
        a = I(j) + I(1)/4
        psi = psi - 1/a
        tri = tri + 1/(a*a)
    return {'pi': pi, 'digamma_quarter': psi, 'trigamma_quarter': tri,
            'c': (psi - pi.ln())/2, 'C': tri/4}


def decaying_sums(q, power, tolerance=D('1e-38')):
    """Enclose sum e^(-lambda*t)/lambda^j, j=1,2; q=e^(-2t)."""
    j1, j2, k = I(0), I(0), 0
    while True:
        lam = I(2*k) + I('0.5')
        tail1 = power/(lam*(1-q))
        tail2 = power/(lam*lam*(1-q))
        if max(tail1.hi, tail2.hi) < tolerance:
            return j1+I(0, tail1.hi), j2+I(0, tail2.hi)
        j1, j2 = j1+power/lam, j2+power/(lam*lam)
        power = power*q
        k += 1
        if k > 20000:
            raise RuntimeError('series failed to converge')


def arch_interval(t, c):
    root = (t/2).exp()
    _, j2 = decaying_sums((-2*t).exp(), (-t/2).exp())
    return 4*(root + 1/root - 2) + c['c']*t + c['C'] - j2


def initial_segment(c):
    # For 0<t<=b, (1-exp(-lambda*t))/t decreases as t increases.
    # Drop the nonnegative cosh term and keep just 100 positive summands.
    b = I('0.1')
    beta = c['c']
    for k in range(100):
        lam = I(2*k) + I('0.5')
        beta = beta + (1-(-lam*b).exp())/(lam*lam*b)
    assert beta.lo > 0, 'initial linear lower bound failed'
    upper = I(2).ln().hi
    stack = [(D('0.1'), upper)]
    leaves = []
    while stack:
        a, b = stack.pop()
        bound = arch_interval(I(a, b), c)
        if bound.lo > 0:
            leaves.append({'left': str(a), 'right': str(b),
                           'lower': str(bound.lo)})
        else:
            if b-a < D('1e-8'):
                raise RuntimeError('could not certify initial segment')
            middle = (a+b)/2
            stack.extend([(a, middle), (middle, b)])
    return {'near_zero_interval': ['0', '0.1'],
            'near_zero_linear_coefficient_lower': str(beta.lo),
            'positive_boxes': sorted(leaves, key=lambda r: D(r['left']))}


def prime_power_events(limit):
    flags = bytearray(b'\x01')*(limit+1)
    flags[0:2] = b'\x00\x00'
    from math import isqrt
    for p in range(2, isqrt(limit)+1):
        if flags[p]:
            start = p*p
            flags[start::p] = b'\x00'*((limit-start)//p+1)
    events = []
    for p in range(2, limit+1):
        if flags[p]:
            n = p
            while n <= limit:
                events.append((n, p))
                n *= p
    return sorted(events)


def certify(limit, outdir):
    started = monotonic()
    outdir.mkdir(parents=True, exist_ok=True)
    c = constants()
    initial = initial_segment(c)
    events = prime_power_events(limit)
    s, r = I(0), I(0)
    log_cache = {}
    worst = []
    max_width = D(0)
    leaves_path = outdir/'reserve_leaves.csv'
    with leaves_path.open('w', newline='') as stream:
        writer = csv.writer(stream)
        writer.writerow(['prime_power', 'prime', 'psi_lo', 'psi_hi',
                         'slope_lo', 'slope_hi', 'curvature_lo', 'curvature_hi',
                         'reserve_lower'])
        for index, (n, p) in enumerate(events):
            t, root = I(n).ln(), I(n).sqrt()
            if p == n:
                lp = t
                log_cache[p] = lp
            else:
                lp = log_cache[p]
            weight = lp/root
            s, r = s+weight, r+weight*t
            j1, j2 = decaying_sums(I(1)/(n*n), 1/root)
            arch = 4*(root+1/root-2)+c['c']*t+c['C']-j2
            energy = arch-t*s+r
            slope = 2*(root-1/root)+c['c']+j1-s
            curvature = root - 1/(root*(n*n-1))
            assert curvature.lo > 0
            downward = min(slope.lo, D(0))
            penalty = (I(downward)*I(downward)/(2*I(curvature.lo))).hi
            reserve = DN.subtract(energy.lo, penalty)
            if reserve <= 0:
                raise ArithmeticError(f'uncertified event {n}, bound={reserve}')
            writer.writerow([n, p, *energy.strings(), *slope.strings(),
                             *curvature.strings(), str(reserve)])
            max_width = max(max_width, UP.subtract(energy.hi, energy.lo))
            worst.append((reserve, n, energy, slope, curvature))
            if len(worst) > 30:
                worst = heapq.nsmallest(10, worst, key=lambda row: row[0])
            if index and index % 20000 == 0:
                print(f'certified {index}/{len(events)} events', flush=True)
    worst = sorted(worst, key=lambda row: row[0])[:10]
    result = {
        'status': 'finite_scalar_positivity_verified',
        'claim': f'Psi(t)>0 for 0<t<=log({limit}); Psi(0)=0',
        'not_claimed': ['RH', 'a new zero-free region',
                        'full Weil form positivity on this support',
                        'global nonnegative storage or infinite-tail control'],
        'integer_cutoff': limit, 'prime_power_events': len(events),
        'precision_decimal_digits': PREC,
        'minimum_reserve_lower': str(worst[0][0]),
        'minimum_reserve_event': worst[0][1],
        'maximum_event_energy_interval_width': str(max_width),
        'constants': {k: v.strings() for k, v in c.items()},
        'initial_segment': initial,
        'worst_events': [dict(prime_power=n, reserve_lower=str(res),
                              psi=energy.strings(), slope=slope.strings(),
                              curvature=curvature.strings())
                         for res, n, energy, slope, curvature in worst],
        'leaf_file': leaves_path.name,
        'leaf_sha256': hashlib.sha256(leaves_path.read_bytes()).hexdigest(),
        'elapsed_seconds': round(monotonic()-started, 3),
    }
    (outdir/'certificate.json').write_text(json.dumps(result, indent=2)+'\n')
    print(json.dumps({k: result[k] for k in ['status','claim','prime_power_events',
          'minimum_reserve_lower','minimum_reserve_event','elapsed_seconds']}, indent=2))
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--limit', type=int, default=1000000)
    parser.add_argument('--output', type=Path, default=Path(__file__).parent/'certificate')
    args = parser.parse_args()
    if args.limit < 2:
        parser.error('limit must be at least 2')
    certify(args.limit, args.output)
