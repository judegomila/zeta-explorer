#!/usr/bin/env python3
"""Outward-rounded finite centered Vaughan audit; no asymptotic bound.

All cutoffs/support decisions are integer operations. Non-integer arithmetic
uses the existing Decimal interval engine. See MOBIUS_INTERVAL.md for scope.
"""
import argparse
import hashlib
import json
from math import isqrt
from pathlib import Path
from decimal import getcontext

import verify_reserve as engine
from verify_reserve import I, D, DN, UP

ROOT = Path(__file__).resolve().parent


def require(condition, message):
    if not condition:
        raise ArithmeticError(message)


def absolute(value):
    if value.lo >= 0:
        return I(value)
    if value.hi <= 0:
        return -value
    return I(0, max(value.lo.copy_negate(), value.hi))


def sign(value):
    return 'positive' if value.lo > 0 else 'negative' if value.hi < 0 else 'unresolved'


def width(value):
    return UP.subtract(value.hi, value.lo)


def intersect(left, right):
    lo, hi = max(left.lo, right.lo), min(left.hi, right.hi)
    require(lo <= hi, 'disjoint enclosures of an exact identity')
    return I(lo, hi)


def validate_case(x, u, v):
    if not all(type(n) is int for n in (x, u, v)):
        raise ValueError('x, U and V must be integers')
    if x < 4 or u < 1 or v < 1 or 2*u*v > x or 2*v >= x:
        raise ValueError('require x>=4, U,V>=1, 2*U*V<=x and 2*V<x')


def balanced_cutoff(x):
    # floor(x**(3/8)), with no floating boundary decisions.
    lo, hi, target = 0, x+1, x**3
    while hi-lo > 1:
        mid = (lo+hi)//2
        if mid**8 <= target:
            lo = mid
        else:
            hi = mid
    return lo


def default_cases():
    cases = []
    for x in (64, 256, 257, 1024, 4096, 16384, 65536):
        b = balanced_cutoff(x)
        cases.extend((x, u, v) for u, v in
                     ((b, b), (2*b, max(1, b//2)), (max(1, b//2), 2*b)))
    cases.extend(((4096, isqrt(4096), 1), (256, 16, 8)))
    return cases


def arithmetic_sieve(limit):
    """Exact integer mu and prime base of each prime power (zero otherwise)."""
    spf = list(range(limit+1))
    for p in range(2, isqrt(limit)+1):
        if spf[p] == p:
            for n in range(p*p, limit+1, p):
                if spf[n] == n:
                    spf[n] = p
    mu, base = [0]*(limit+1), [0]*(limit+1)
    mu[1] = 1
    for n in range(2, limit+1):
        p = spf[n]
        q = n//p
        mu[n] = 0 if q % p == 0 else -mu[q]
        base[n] = p if q == 1 or base[q] == p else 0
    # An exact convolution check over the entire generated mu range.
    convolution = [0]*(limit+1)
    for d in range(1, limit+1):
        if mu[d]:
            for n in range(d, limit+1, d):
                convolution[n] += mu[d]
    require(convolution[1] == 1 and not any(convolution[2:]),
            'mu * 1 is not the convolution identity')
    return mu, base


class Arithmetic:
    def __init__(self, limit, prefix_limit):
        self.limit, self.prefix_limit = limit, prefix_limit
        self.mu, self.base = arithmetic_sieve(limit)
        self.logs = {1: I(0)}
        self.lam = [I(0)]*(limit+1)
        for n in range(2, limit+1):
            if self.base[n]:
                self.lam[n] = self.log(self.base[n])
        self.m, self.l = [I(0)], [I(0)]
        for a in range(1, prefix_limit+1):
            term = I(self.mu[a])/a
            self.m.append(self.m[-1]+term)
            self.l.append(self.l[-1]+term*self.log(a))

    def log(self, n):
        if n not in self.logs:
            self.logs[n] = I(n).ln()
        return self.logs[n]


class Shell:
    def __init__(self, arithmetic, x):
        self.data, self.x = arithmetic, x
        self.root, self.logx = I(x).sqrt(), arithmetic.log(x)
        root2, h = I(2).sqrt(), arithmetic.log(2)
        # Exact algebraic versions of the hyperbolic constants.
        self.c = 4*(root2+1/root2-2)
        self.c1 = 4*h*(root2-1/root2)-16*(root2+1/root2-2)
        self.cw = 4*root2+2+h
        self.cl = 8*h+2*root2*h*h
        self.weights = [I(0)]*(2*x+1)
        for n in range(x//2+1, 2*x):
            ratio = I(2*n)/x if n <= x else I(2*x)/n
            self.weights[n] = ratio.ln()/I(n).sqrt()
            require(self.weights[n].lo > 0, 'unresolved interior weight sign')
        self.value = sum((arithmetic.lam[n]*self.weights[n]
                          for n in range(x//2+1, 2*x) if arithmetic.base[n]), I(0))
        self.value = self.value-self.c*self.root

    def rows(self, u, v):
        """H(a) only for nonzero mu(a); compact support is enforced exactly."""
        dmax = (2*self.x-1)//(u+1)
        beta = [I(0)]*(dmax+1)
        for r in range(v+1, dmax+1):
            if self.data.base[r]:
                for d in range(r, dmax+1, r):
                    beta[d] = beta[d]+self.data.lam[r]
        rows = {}
        for a in range(u+1, (2*self.x-1)//(v+1)+1):
            if self.data.mu[a]:
                start = max(v+1, self.x//(2*a)+1)
                end = (2*self.x-1)//a
                rows[a] = sum((beta[d]*self.weights[a*d]
                               for d in range(start, end+1) if beta[d].hi), I(0))
        return rows

    def audit(self, u, v):
        x, data = self.x, self.data
        validate_case(x, u, v)
        k0 = (2*x+v-1)//v
        cutoffs = (k0, 2*k0, 4*k0)
        require(cutoffs[-1] <= data.prefix_limit, 'insufficient prefix range')
        av = sum((data.lam[r]/r for r in range(1, v+1) if data.base[r]), I(0))
        lead = self.c*self.logx+self.c1-self.c*av

        def correction(k):
            return self.root*(lead*data.m[k]-self.c*data.l[k]-self.c)

        rows = self.rows(u, v)
        i4 = sum((data.mu[a]*row for a, row in rows.items()), I(0))
        centering = correction(u)
        joint = i4+centering
        separate_budget = absolute(i4)+absolute(centering)
        remainder = self.value-joint
        bound = (u*(u+1)*(self.cw*data.log(2*x)+self.cl)/(32*x*self.root)
                 +self.cw*u*(u+1)*v*(v+1)*data.log(v)/(64*x*self.root))
        require(absolute(remainder).hi <= bound.lo, 'finite quadrature bound failed')

        partial, absolute_sum, common = I(0), I(0), joint
        tails = []
        for a in range(u+1, cutoffs[-1]+1):
            if data.mu[a]:
                continuum = self.root/a*(self.c*(self.logx-data.log(a))
                                        +self.c1-self.c*av)
                term = data.mu[a]*(rows.get(a, I(0))-continuum)
                partial = partial+term
                absolute_sum = absolute_sum+absolute(term)
            if a in cutoffs:
                tail = correction(a)
                corrected = partial+tail
                residual = corrected-joint
                require(residual.lo <= 0 <= residual.hi, 'centering identity failed')
                require(width(residual) < D('1e-35'), 'identity enclosure too wide')
                common = intersect(common, corrected)
                flipped = sign(partial) != 'unresolved' and sign(joint) != 'unresolved'
                flipped = flipped and sign(partial) != sign(joint)
                tails.append({
                    'K': a, 'centered_partial': partial.strings(),
                    'tail_correction': tail.strings(), 'corrected_J': corrected.strings(),
                    'identity_residual': residual.strings(),
                    'partial_sign': sign(partial), 'corrected_sign': sign(corrected),
                    'omitting_tail_reverses_sign': flipped,
                    'sum_absolute_centered_terms': absolute_sum.strings(),
                    'absolute_budget_with_tail': (absolute_sum+absolute(tail)).strings(),
                })
        require(width(joint) < D('1e-35'), 'joint enclosure too wide')
        require(len(tails) == 3, 'cutoff coverage failed')
        return {
            'x': x, 'U': u, 'V': v, 'shell': self.value.strings(),
            'I4': i4.strings(), 'centering': centering.strings(), 'J': joint.strings(),
            'J_sign': sign(joint), 'J_width': str(width(joint)),
            'common_J_enclosure': common.strings(),
            'separate_component_budget': separate_budget.strings(),
            'joint_to_separate_ratio': (absolute(joint)/separate_budget).strings()
                if separate_budget.lo > 0 else None,
            'quadrature_remainder': remainder.strings(),
            'quadrature_bound': bound.strings(), 'tails': tails,
        }


def run(cases, precision=50):
    if precision < 40:
        raise ValueError('at least 40 decimal digits required')
    for case in cases:
        validate_case(*case)
    getcontext().prec = DN.prec = UP.prec = precision
    prefix_limit = max(4*((2*x+v-1)//v) for x, _, v in cases)
    limit = max(prefix_limit, 2*max(x for x, _, _ in cases))
    data = Arithmetic(limit, prefix_limit)
    output = []
    for x in sorted({case[0] for case in cases}):
        shell = Shell(data, x)
        for _, u, v in (case for case in cases if case[0] == x):
            row = shell.audit(u, v)
            output.append(row)
            print(f'x={x}, U={u}, V={v}: J {row["J_sign"]}; 3 cutoff checks passed',
                  flush=True)
    return {
        'status': 'finite_centered_mobius_interval_audit_passed',
        'precision_decimal_digits': precision,
        'scope': 'The listed finite integer triples only; no interpolation or infinite estimate.',
        'not_claimed': ['RH', 'a new zero-free region', 'a uniform cancellation bound',
                        'an independent proof of the manuscript quadrature theorem'],
        'source_sha256': {name: hashlib.sha256((ROOT/name).read_bytes()).hexdigest()
                          for name in ('mobius_interval_audit.py', 'verify_reserve.py')},
        'sieve_limit': limit, 'mobius_convolution_checks': limit,
        'case_count': len(output), 'cutoff_count': 3*len(output),
        'certified_tail_sign_reversals': sum(t['omitting_tail_reverses_sign']
                                           for r in output for t in r['tails']),
        'maximum_J_width': str(max(D(r['J_width']) for r in output)),
        'maximum_identity_residual_width': str(max(width(I(*t['identity_residual']))
                                                  for r in output for t in r['tails'])),
        'samples': output,
    }


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--case', type=int, nargs=3, action='append', metavar=('X', 'U', 'V'))
    parser.add_argument('--precision', type=int, default=50)
    parser.add_argument('--output', type=Path, default=ROOT/'mobius_interval_audit.json')
    args = parser.parse_args()
    result = run(args.case or default_cases(), args.precision)
    args.output.write_text(json.dumps(result, indent=2)+'\n')
    print(json.dumps({k: v for k, v in result.items() if k != 'samples'}, indent=2))
