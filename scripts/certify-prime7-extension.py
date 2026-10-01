"""Certify a prime-7 support extension with both large-shift couplings exact.

Proof: formalization/paper/prime7-extension-2026-10-01.md and cited predecessors.
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


def preconditioned_positive(matrix):
    """Exact dyadic congruence, then an interval Gershgorin certificate.

    Midpoint LDL is only used to choose a fixed invertible change of basis.
    No positivity conclusion is drawn from the midpoint calculation itself.
    The final interval product includes every original matrix enclosure.
    """
    n = matrix.nrows()
    midpoint = [[matrix[i,j].mid() for j in range(n)] for i in range(n)]
    L = [[arb(0) for _ in range(n)] for _ in range(n)]
    ds = []
    for i in range(n):
        d = midpoint[i][i]
        for k in range(i):
            d -= L[i][k] ** 2 * ds[k]
        d = d.mid()
        positive(d, f"preconditioner construction pivot {i}; not an acceptance test")
        ds.append(d)
        L[i][i] = arb(1)
        for j in range(i + 1, n):
            v = midpoint[j][i]
            for k in range(i):
                v -= L[j][k] * L[i][k] * ds[k]
            L[j][i] = (v/d).mid()
    inverse = arb_mat(L).inv()
    # Enforce exact triangularity and take exact dyadic midpoints. Accuracy
    # affects success, but not the logical validity of a passing certificate.
    V = arb_mat([[((inverse[i,j]/ds[i].sqrt()).mid() if j <= i else arb(0))
                  for j in range(n)] for i in range(n)])
    for i in range(n):
        positive(V[i,i], 'invertible triangular preconditioner diagonal')
    transformed = V*matrix*V.transpose()
    margins = []
    for i in range(n):
        margin = transformed[i,i]-sum(abs(transformed[i,j]) for j in range(n) if j != i)
        positive(margin, f'interval congruence Gershgorin margin {i}')
        margins.append(margin.lower())
    return min(margins)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--width', default='2')
    parser.add_argument('--gap', default='1e-24')
    parser.add_argument('--precision', type=int, default=768)
    parser.add_argument('--cutoff', type=int, default=400)
    parser.add_argument('--modes', type=int, default=576)
    parser.add_argument('--gauss-order', type=int, default=64)
    parser.add_argument('--floor', default='6/5')
    parser.add_argument('--penalty', default='1000')
    parser.add_argument('--batch-panels', type=int, default=20)
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
    if T < 1 or N < 2 or N % 2 or q < 1 or args.batch_panels < 1:
        raise ValueError('Need integer cutoff>=1, even modes>=2, Gauss order>=1.')
    m, gamma = rational(args.floor), rational(args.penalty)
    positive(m, 'tail floor')
    positive(gamma, 'moment penalty')
    pi = arb.pi()
    active = prime_powers(B)
    if active != [(2, 2, 1), (3, 3, 1), (4, 2, 2), (5, 5, 1), (7, 7, 1)]:
        raise ValueError('This checker requires exactly the prime powers 2,3,4,5,7.')
    ell5, ell7 = arb(5).log(), arb(7).log()
    c5, c7 = ell5/arb(5).sqrt(), ell7/arb(7).sqrt()
    delta7, offset = B-ell7, ell7-ell5
    positive(delta7, 'nonempty four-node components')
    positive(offset-delta7, 'nonempty remaining prime-5 pairs')
    positive(2*ell5-B, 'disjoint left and right collars')
    chain_norm = (c7+(c7*c7+4*c5*c5).sqrt())/2
    old = active[:3]
    logs = [arb(n).log() for n, p, k in old]
    amps = [2 * arb(p).log() / arb(n).sqrt() for n, p, k in old]
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
    diagonal = m-shift
    positive(diagonal-chain_norm, 'full baseline positivity, including all edge modes')
    print(f'Prime powers {active}; finite shift {shift}', file=sys.stderr, flush=True)
    nodes = [arb.legendre_p_root(q, k, weight=True) for k in range(q)]
    df = [1]
    for n in range(1, N+1):
        df.append(df[-1] * (2*n+1))
    norms = [(B*(2*n+1)).sqrt() for n in range(N)]
    columns, signed_weights = [], []
    frequency_blocks = [arb_mat(N//2, N//2), arb_mat(N//2, N//2)]
    for panel in range(2*T):
        for root, weight in nodes:
            t = arb(panel)/2 + (root+1)/4
            z = a*t
            w = acb(arb(1)/4, t/2).digamma().real - pi.log() - m
            w -= sum(c * (l*t).cos() for c, l in zip(amps, logs))
            signed_weights.append(weight*w/(4*pi))
            # Two independently enclosed high-order seeds, followed by the
            # exact downward recurrence. There is no asymptotic truncation
            # and no unproved Miller normalization.
            js = [arb(0)]*(N+1)
            for n in (N-1, N):
                js[n] = z**n/df[n] * (-z*z/4).hypgeom_0f1(arb(n)+arb(3)/2)
            for n in range(N-1, 0, -1):
                js[n-1] = (2*n+1)*js[n]/z-js[n+1]
            zero_check = js[0]-z.sin()/z
            if not zero_check.contains(0) or not abs(zero_check) < arb('1e-40'):
                raise ArithmeticError('Bessel recurrence validation inconclusive.')
            col = [norms[n] * (-1)**(n//2) * js[n] for n in range(N)]
            columns.append(col)
        if (panel+1) % args.batch_panels == 0 or panel+1 == 2*T:
            for parity in (0, 1):
                ns = list(range(parity, N, 2))
                U = arb_mat([[col[n] for col in columns] for n in ns])
                V = arb_mat([[col[n]*weight for n in ns]
                             for col, weight in zip(columns, signed_weights)])
                frequency_blocks[parity] += U*V
            del U, V
            columns, signed_weights = [], []
            print(f'Quadrature panels {panel+1}/{2*T}', file=sys.stderr, flush=True)

    # D is a direct integral of exact 4-node, 2-node and scalar blocks.
    # Begin with I/d; only the collar corrections need spatial integration.
    grams = [arb_mat(N//2, N//2), arb_mat(N//2, N//2)]
    for G in grams:
        for i in range(N//2):
            G[i, i] = 1/diagonal
    T4 = arb_mat([[0,c5,0,0], [c5,0,c7,0], [0,c7,0,c5], [0,0,c5,0]])
    T2 = arb_mat([[0,c5], [c5,0]])
    fibers = [(arb(0), delta7, [ell5, arb(0), ell7, offset], T4),
              (delta7, offset, [arb(0), ell5], T2)]
    # Products have degree <=2*N-2: N-point Gauss integrates them exactly.
    edge_nodes = [arb.legendre_p_root(N, k, weight=True) for k in range(N)]
    spatial_norms = [(arb(2*n+1)/B).sqrt() for n in range(N)]
    for lo, hi, offsets, adjacency in fibers:
        size = len(offsets)
        block = -adjacency
        for i in range(size):
            block[i, i] += diagonal
        correction = block.inv()
        for i in range(size):
            correction[i, i] -= 1/diagonal
        values, weights = [], []
        for root, weight in edge_nodes:
            y = lo+(root+1)*(hi-lo)/2
            weights.append(weight*(hi-lo)/2)
            node_values = []
            for dx in offsets:
                z = (-a+y+dx)/a
                # Direct evaluation prevents endpoint interval inflation.
                node_values.append([spatial_norms[n]*z.legendre_p(n) for n in range(N)])
            values.append(node_values)
        for parity in (0, 1):
            ns = list(range(parity, N, 2))
            X = arb_mat([[value[i][n] for value in values for i in range(size)] for n in ns])
            Y = arb_mat([[weight*sum(correction[i,j]*value[j][n] for j in range(size)) for n in ns]
                         for value, weight in zip(values, weights) for i in range(size)])
            grams[parity] += X*Y
            del X, Y
        del values
        print(f'Exact {size}-node inverse integrated', file=sys.stderr, flush=True)
    blocks = []
    for parity in (0, 1):
        ns = list(range(parity, N, 2))
        matrix = frequency_blocks[parity] + grams[parity].inv()
        # Inversion is interval-certified; no eigenvector or floating slack used.
        v = [norms[n]*(a/2)**n/df[n] * (a*a/16).hypgeom_0f1(arb(n)+arb(3)/2) for n in ns]
        for i in range(len(ns)):
            for j in range(len(ns)):
                matrix[i, j] += gamma*v[i]*v[j]
        margin = preconditioned_positive(matrix)
        blocks.append({'parity': parity, 'dimension': len(ns),
                       'minimum_congruence_gershgorin_margin_lower': str(margin)})
        print(f'Parity {parity} certified', file=sys.stderr, flush=True)
    result = {
        'status': 'certified', 'scope': 'prime-7 extension, full pole-free Weil form; not RH',
        'method': 'exact four-node and pair inverses; finite-rank Gram criterion; interval-verified dyadic congruence',
        'uniform_support_consequence': 'all smooth pole-free tests in any centered subinterval of this window',
        'prime5_coupling_enclosure': str(c5), 'prime7_coupling_enclosure': str(c7),
        'four_node_chain_norm_enclosure': str(chain_norm),
        'four_node_fiber_width_enclosure': str(delta7),
        'pair_fiber_width_enclosure': str(offset-delta7),
        'baseline_floor_after_all_errors': str(diagonal-chain_norm),
        'width': args.width, 'gap': args.gap, 'precision_bits': args.precision,
        'N': N, 'T': T, 'gauss_order': q, 'panels': 2*T, 'batch_panels': args.batch_panels,
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
