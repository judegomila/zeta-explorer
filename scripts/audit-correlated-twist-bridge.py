"""Exact and interval checks for correlated sign twists; no RH certificate."""
import argparse
from fractions import Fraction as Q
from hashlib import sha256
from itertools import product
import json
from math import prod
from pathlib import Path
from flint import arb, ctx


def ball(q):
    q = Q(q)
    return arb(q.numerator)/q.denominator


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output')
    args = parser.parse_args()
    ctx.prec = 192
    primes = (2, 3, 5, 7)
    signs = list(product((-1, 1), repeat=len(primes)))
    checks = 0
    for delta in (1, 2):
        densities = [prod(1-e*Q(1, p**delta) for p, e in zip(primes, eps)) for eps in signs]
        G = [prod(1+e*Q(1, p**2) for p, e in zip(primes, eps)) for eps in signs]
        assert sum(densities)/len(signs) == 1
        assert sum(d*d for d in densities)/len(signs) == prod(1+Q(1, p**(2*delta)) for p in primes)
        assert sum(d*g for d, g in zip(densities, G))/len(signs) == prod(1-Q(1, p**(2+delta)) for p in primes)
        checks += 3
    for rho in (Q(1, 3), Q(1, 2), Q(2, 3)):
        densities = [prod(1-rho*e for e in eps) for eps in signs]
        assert sum(densities)/len(signs) == 1
        assert sum(d*d for d in densities)/len(signs) == (1+rho*rho)**len(primes)
        assert sum(d*g for d, g in zip(densities, G))/len(signs) == prod(1-rho*Q(1, p**2) for p in primes)
        checks += 3

    # Check the independently expanded, absolutely convergent H_rho correction.
    bias_checks = []
    for rho in (Q(1, 3), Q(1, 2), Q(2, 3)):
        r, sigma = ball(rho), arb(3)/4
        direct, series, tail = arb(0), arb(0), arb(0)
        K = 80
        for p in primes:
            x = (-sigma*arb(p).log()).exp()
            direct += (1-r*x).log()-r*(1-x).log()
            series += sum((r-r**k)*x**k/k for k in range(2, K+1))
            tail += r*x**(K+1)/((K+1)*(1-x))
        assert abs(direct-series) < tail
        bias_checks.append({'rho': str(rho), 'log_H_direct': str(direct), 'series_error_enclosure': str(direct-series), 'tail_bound': str(tail)})
        checks += 1

    # Critical-line bridge at t=0, shared signs between s and 1-s.
    bs = [2*arb(p).sqrt()/(p+1) for p in primes]
    assert all(1-b > 0 for b in bs)
    values = [prod(1+e*b for e, b in zip(eps, bs)) for eps in signs]
    mean_error = sum(values)/len(signs)-1
    second = prod(Q(1)+Q(4*p, (p+1)**2) for p in primes)
    second_error = sum(v*v for v in values)/len(signs)-ball(second)
    assert mean_error.contains(0) and abs(mean_error) < arb('1e-40')
    assert second_error.contains(0) and abs(second_error) < arb('1e-40')
    checks += 3

    limit = 100000
    sieve = bytearray(b'\x01')*(limit+1)
    sieve[:2] = b'\x00\x00'
    for p in range(2, 317):
        if sieve[p]:
            sieve[p*p:limit+1:p] = b'\x00'*(((limit-p*p)//p)+1)
    log_second, log_geometric, count = arb(0), arb(0), 0
    table = []
    for p in range(2, limit+1):
        if sieve[p]:
            count += 1
            log_second += (1+arb(4*p)/(p+1)**2).log()
            log_geometric += (arb(p-1)/(p+1)).log()
        if p in (10, 100, 1000, 10000, 100000):
            table.append({'prime_cutoff': p, 'prime_count': count, 'mean': '1 (exact)',
                          'second_moment_enclosure': str(log_second.exp()),
                          'geometric_mean_enclosure': str(log_geometric.exp())})
    result = {'status': 'passed', 'scope': 'correlated-twist algebra and finite moments; not RH',
              'checks': checks, 'precision_bits': ctx.prec, 'bias_factorizations': bias_checks,
              'four_prime_bridge_mean_error': str(mean_error),
              'four_prime_bridge_second_moment_error': str(second_error),
              'critical_bridge_table': table,
              'script_sha256': sha256(Path(__file__).read_bytes()).hexdigest()}
    payload = json.dumps(result, indent=2)+'\n'
    if args.output:
        Path(args.output).write_text(payload)
    print(payload)


if __name__ == '__main__':
    main()
