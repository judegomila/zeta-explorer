"""Certify a rational support width with every contributing prime power.

Proof: formalization/paper/weil-all-support-attempt-2026-09-30.md and its predecessor.
An interval comparison must succeed to accept. There is no floating-point slack.
This is a computer-assisted local certificate, not a proof of RH or Lean theorem.
"""
import argparse
import hashlib
import json
import sys
import time
from pathlib import Path
from fractions import Fraction
import flint
from flint import arb, acb, arb_mat, ctx


def positive(x, label):
    if not x > 0:
        raise ArithmeticError(f"Could not certify {label}: {x}")


def rational(text):
    value = Fraction(text)
    return arb(value.numerator) / value.denominator


def prime_powers(B):
    # A certified upper endpoint prevents silently missing a prime at a threshold.
    endpoint = B.exp().upper().ceil().unique_fmpz()
    if endpoint is None:
        raise ArithmeticError('Could not enclose the prime enumeration endpoint.')
    limit = int(endpoint)
    if limit > 2000:
        raise ValueError('Resource guard: exp(width) must be at most 2000.')
    sieve = [True] * (limit+1)
    sieve[:2] = [False, False]
    for p in range(2, limit+1):
        if sieve[p]:
            for n in range(p*p, limit+1, p):
                sieve[n] = False
    active = []
    for p in range(2, limit+1):
        if not sieve[p]:
            continue
        n, exponent = p, 1
        while n <= limit:
            shift = arb(n).log()
            if shift < B:
                active.append((n, p, exponent))
            elif not shift > B:
                raise ArithmeticError('Unresolved prime-power threshold; increase precision.')
            n *= p
            exponent += 1
    return sorted(active)


def ldl(matrix, shift):
    n = matrix.nrows()
    L = [[arb(0) for _ in range(n)] for _ in range(n)]
    ds = []
    for i in range(n):
        d = matrix[i, i] - shift
        for k in range(i):
            d -= L[i][k] ** 2 * ds[k]
        positive(d, f"LDL pivot {i}")
        ds.append(d)
        for j in range(i + 1, n):
            v = matrix[j, i]
            for k in range(i):
                v -= L[j][k] * L[i][k] * ds[k]
            L[j][i] = v / d
    return min(d.lower() for d in ds)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--width', default='1.6')
    parser.add_argument('--gap', default='0.0000000000005')
    parser.add_argument('--precision', type=int, default=384)
    parser.add_argument('--cutoff', type=int, default=160)
    parser.add_argument('--modes', type=int, default=224)
    parser.add_argument('--gauss-order', type=int, default=48)
    parser.add_argument('--floor', default='1/4')
    parser.add_argument('--penalty', default='1000')
    parser.add_argument('--output')
    args = parser.parse_args()
    if args.precision < 64:
        raise ValueError('Use at least 64 bits of interval precision.')
    ctx.prec = args.precision
    started = time.time()
    B, eps = rational(args.width), rational(args.gap)
    positive(B, 'width')
    positive(eps, 'gap')
    a, T, N, q = B / 2, args.cutoff, args.modes, args.gauss_order
    if T < 1 or N < 2 or N % 2 or q < 1:
        raise ValueError('Need integer cutoff>=1, even modes>=2, Gauss order>=1.')
    m, gamma = rational(args.floor), rational(args.penalty)
    positive(m, 'tail floor')
    positive(gamma, 'moment penalty')
    pi = arb.pi()
    active = prime_powers(B)
    logs = [arb(n).log() for n, p, k in active]
    amps = [2 * arb(p).log() / arb(n).sqrt() for n, p, k in active]
    tail_floor = acb(arb(1) / 4, arb(T) / 2).digamma().real - pi.log() - sum(amps)
    positive(tail_floor - m, 'infinite-frequency floor')
    # Holomorphic symbol on quadrature ellipses: Re(s)>=5/32, |s|<T/2+1.
    # psi(s)=-EulerGamma-1/s+sum_{k>=1} s/[k(k+s)].
    complex_bound = 1 + arb(32) / 5 + (arb(T)/2+1) * pi**2 / 6 + pi.log() + m
    complex_bound += sum(c * (arb(3) * l / 16).cosh() for c, l in zip(amps, logs))
    M = complex_bound * B * (3 * B / 16).exp() / pi
    entry_error = 4 * T * M * arb(2)**(1 - 2*q)
    quad_error = N * entry_error
    # Chebyshev truncation on the spatial ellipse rho=2.
    projection_error = 2 * (3*a*T/4).exp() * arb(2)**(1-N)
    operator_error = 2 * B * T * complex_bound * projection_error / pi
    moment_error = 8 * gamma * B * (9*a/8).exp() * arb(2)**(1-N)
    shift = eps + quad_error + operator_error + moment_error
    positive(m - eps - operator_error - moment_error, 'complement identity floor')
    print(f'Prime powers {active}; finite shift {shift}', file=sys.stderr, flush=True)
    nodes = [arb.legendre_p_root(q, k, weight=True) for k in range(q)]
    df = [1]
    for n in range(1, N):
        df.append(df[-1] * (2*n+1))
    norms = [(B*(2*n+1)).sqrt() for n in range(N)]
    columns, signed_weights = [], []
    for panel in range(2*T):
        for root, weight in nodes:
            t = arb(panel)/2 + (root+1)/4
            z = a*t
            w = acb(arb(1)/4, t/2).digamma().real - pi.log() - m
            w -= sum(c * (l*t).cos() for c, l in zip(amps, logs))
            signed_weights.append(weight*w/(4*pi))
            col = []
            power = arb(1)
            for n in range(N):
                # Equivalent interval formulas; select the less ill-conditioned
                # evaluation in each range. Both enclose the same exact j_n.
                if arb(n) < z:
                    jn = (pi/(2*z)).sqrt() * z.bessel_j(arb(n)+arb(1)/2)
                else:
                    jn = power/df[n] * (-z*z/4).hypgeom_0f1(arb(n)+arb(3)/2)
                col.append(norms[n] * (-1)**(n//2) * jn)
                power *= z
            columns.append(col)
        if panel % 20 == 19:
            print(f'Quadrature panels {panel+1}/{2*T}', file=sys.stderr, flush=True)
    blocks = []
    for parity in (0, 1):
        ns = list(range(parity, N, 2))
        U = arb_mat([[col[n] for col in columns] for n in ns])
        V = arb_mat([[col[n]*weight for n in ns] for col, weight in zip(columns, signed_weights)])
        matrix = U*V
        v = [norms[n]*(a/2)**n/df[n] * (a*a/16).hypgeom_0f1(arb(n)+arb(3)/2) for n in ns]
        for i in range(len(ns)):
            for j in range(len(ns)):
                matrix[i, j] += gamma*v[i]*v[j]
            matrix[i, i] += m
        pivot = ldl(matrix, shift)
        blocks.append({'parity': parity, 'dimension': len(ns), 'minimum_ldl_pivot_lower': str(pivot)})
        print(f'Parity {parity} certified', file=sys.stderr, flush=True)
    result = {
        'status': 'certified', 'scope': 'local pole-free Weil form; not RH',
        'width': args.width, 'gap': args.gap, 'precision_bits': args.precision,
        'N': N, 'T': T, 'gauss_order': q, 'panels': 2*T,
        'penalty': args.penalty, 'tail_identity_floor': args.floor,
        'prime_powers': [{'n': n, 'p': p, 'exponent': k} for n, p, k in active],
        'frequency_tail_lower_enclosure': str(tail_floor),
        'holomorphic_bound_enclosure': str(complex_bound),
        'quadrature_operator_error_enclosure': str(quad_error),
        'truncation_operator_error_enclosure': str(operator_error),
        'moment_operator_error_enclosure': str(moment_error), 'blocks': blocks,
        'script_sha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        'python_flint_version': flint.__version__,
        'elapsed_seconds': round(time.time()-started, 3),
    }
    payload = json.dumps(result, indent=2) + '\n'
    if args.output:
        Path(args.output).write_text(payload)
    print(payload)


if __name__ == '__main__':
    main()
