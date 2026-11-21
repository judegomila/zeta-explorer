"""Finite identities and certified tails for renormalized twists; not RH."""
import argparse
from fractions import Fraction as F
from hashlib import sha256
from itertools import product
import json
from math import prod, isqrt
from pathlib import Path
from flint import arb, acb, ctx


def close_zero(x):
    assert x.contains(0), str(x)
    assert abs(x) < arb('1e-40'), str(x)


def local(b, sign):
    return (1+sign*b)*(-sign*b+b*b/2).exp()


def primes_through(n):
    sieve = bytearray(b'\x01')*(n+1)
    sieve[:2] = b'\x00\x00'
    for p in range(2, isqrt(n)+1):
        if sieve[p]:
            sieve[p*p:n+1:p] = b'\x00'*((n-p*p)//p+1)
    return [p for p in range(2, n+1) if sieve[p]]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output')
    args = parser.parse_args()
    ctx.prec = 192
    ps = [2, 3, 5, 7]
    checks = []

    # Exact finite zeta factors: detects reversal of the u+v normalization.
    for u, v in [(2, 2), (2, 3), (3, 4)]:
        def zp(k):
            return prod(1/(1-F(1, p**k)) for p in ps)
        direct = prod((1-F(1, p**u))*(1-F(1, p**v))/(1+F(1, p**(u+v))) for p in ps)
        correct = zp(2*u+2*v)/(zp(u+v)*zp(u)*zp(v))
        reversed_ratio = zp(u+v)/(zp(2*u+2*v)*zp(u)*zp(v))
        assert direct == correct and direct != reversed_ratio
        checks.append(f'exact Euler reconstruction and reversed-ratio control: {u},{v}')

    # All 16 sign assignments; complex samples include outside critical slice.
    samples = [(acb(arb(1)/2, arb(7)/10), acb(arb(1)/2, -arb(7)/10)),
               (acb(arb(3)/5, arb(7)/10), acb(2)),
               (acb(2, arb(1)/3), acb(3, -arb(1)/5))]
    for index, (u, v) in enumerate(samples):
        bs = []
        for p in ps:
            x, y = (-u*arb(p).log()).exp(), (-v*arb(p).log()).exp()
            b = (x+y)/(1+x*y)
            bs.append(b)
            for e in (-1, 1):
                close_zero((1+e*x)*(1+e*y)/(1+x*y)-(1+e*b))
        checks.append(f'complex bridge local factors: sample {index}')
        values = []
        for eps in product((-1, 1), repeat=4):
            normalized = prod(local(b, e) for b, e in zip(bs, eps))
            raw = prod(1+e*b for b, e in zip(bs, eps))
            correction = sum(-e*b+b*b/2 for b, e in zip(bs, eps)).exp()
            close_zero(normalized-raw*correction)
            opposite = prod(local(b, -e) for b, e in zip(bs, eps))
            close_zero(normalized*opposite-prod((1-b*b)*(b*b).exp() for b in bs))
            values.append(normalized)
        checks.append(f'complex normalization and opposite-sign identity: sample {index}')
        mean = prod((b*b/2).exp()*(b.cosh()-b*b.sinh()) for b in bs)
        close_zero(sum(values)/16-mean)
        checks.append(f'exhaustive sign expectation: sample {index}')

    # Taylor remainder bound tested separately from the local product formula.
    for b in [arb(1)/10, arb(1)/3, arb(1)/2]:
        bound = b**3/(3*(1-b))
        for e in (-1, 1):
            r = (1+e*b).log()-e*b+b*b/2
            assert abs(r) < bound
        checks.append(f'log remainder bound at {b}')

    # Rigorous all-prime tail at the center, via sum_{n>P} n^-3/2 <= 2/sqrt(P).
    cutoff = 10000
    primes = primes_through(cutoff)
    log_plus, log_minus, log_mean = arb(0), arb(0), arb(0)
    for p in primes:
        b = 2*arb(p).sqrt()/(p+1)
        rp = (1+b).log()-b+b*b/2
        rm = (1-b).log()+b+b*b/2
        assert rp > rm
        log_plus += rp
        log_minus += rm
        log_mean += ((b*b/2).exp()*(b.cosh()-b*b.sinh())).log()
    tail = 16/(3*(1-2/arb(cutoff).sqrt())*arb(cutoff).sqrt())
    assert tail > 0 and tail < arb('0.055')
    # For each remaining prime |r_e| is bounded; its positive mean lies between
    # exp(-bound) and exp(bound), so the same log-tail bound applies to the mean.
    bounds = {}
    for name, value in [('all_plus', log_plus), ('all_minus', log_minus), ('mean', log_mean)]:
        lower, upper = (value-tail).exp(), (value+tail).exp()
        assert lower > 0 and upper > lower
        bounds[name] = {'finite_log_enclosure': str(value),
                        'lower_bound_enclosure': str(lower),
                        'upper_bound_enclosure': str(upper)}
    # Safe rational bounds, independent of rounding displayed Arb enclosures.
    assert (log_minus-tail).exp() > arb(34)/1000
    assert (log_plus+tail).exp() < arb(2237)/1000
    assert (log_mean-tail).exp() > arb(4078)/10000
    assert (log_mean+tail).exp() < arb(4548)/10000
    checks.append('center infinite tails, positivity, and universal bounds')
    result = {'status': 'passed', 'scope': 'renormalized twist identities and tails; not an RH proof',
              'precision_bits': ctx.prec, 'checks': checks, 'check_count': len(checks),
              'prime_cutoff': cutoff, 'prime_count': len(primes),
              'absolute_log_tail_bound_enclosure': str(tail), 'center_limits': bounds,
              'all_sign_center_bounds': '0.034 < R_epsilon(1/2,1/2) < 2.237',
              'script_sha256': sha256(Path(__file__).read_bytes()).hexdigest()}
    payload = json.dumps(result, indent=2)+'\n'
    if args.output:
        Path(args.output).write_text(payload)
    print(payload)


if __name__ == '__main__':
    main()
