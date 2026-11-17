#!/usr/bin/env python3
"""Bohr-lift (torus) test of the Riesz-mean Dirichlet factor.  For t large compared with N the pole correction is
O(t^-(k+1)) and D_N(sigma + it) = B(sigma; theta) at theta_p = -t log p, where
    B(sigma; theta) = sum_{n<=N} w_n a_n n^-sigma exp(i sum_p v_p(n) theta_p).
By Kronecker (log p linearly independent over Q) the points (t log p mod 2 pi)_p are dense in the torus, so
D_N has zeros with Re s near sigma* at arbitrarily large heights whenever B(sigma*; theta*) = 0 has a solution
that is a transversal zero in (sigma, one phase).  This script estimates
    m(N) = min over theta and sigma in [slo, shi] of |B|
by multi-start descent (float64; MEASURED), and the fraction of random torus points with a sign-changing
winding of B along sigma (density estimate of heights carrying a zero).   python torus.py <input> <weight> <out>"""
import json, math, sys
import numpy as np
import fscreen as S


def setup(inp, w, N):
    c = S.coefs(inp, N) * S.weights(w, N)
    ps = S.primes_upto(N)
    idx = np.nonzero(c)[0]
    V = np.zeros((len(idx), len(ps)))
    for i, n in enumerate(idx):
        m = int(n)
        for j, p in enumerate(ps):
            while m % p == 0:
                V[i, j] += 1
                m //= int(p)
    return c[idx], np.log(idx.astype(float)), V, ps


def B(c, L, V, sig, th):
    return (c * np.exp(-sig * L)) @ np.exp(1j * (V @ th))


def minimise(c, L, V, slo, shi, starts, rng):
    best = (1e9, None, None)
    k = V.shape[1]
    for _ in range(starts):
        x = np.concatenate([[rng.uniform(slo, shi)], rng.uniform(0, 2 * math.pi, k)])
        f = abs(B(c, L, V, x[0], x[1:]))
        step = 0.3
        for it in range(4000):
            y = x + step * rng.standard_normal(k + 1) * np.concatenate([[0.15], np.ones(k)])
            y[0] = min(shi, max(slo, y[0]))
            g = abs(B(c, L, V, y[0], y[1:]))
            if g < f:
                x, f = y, g
            else:
                step *= 0.995
            if f < 1e-13 or step < 1e-12:
                break
        if f < best[0]:
            best = (f, x[0], x[1:] % (2 * math.pi))
        if best[0] < 1e-12:
            break
    return best


if __name__ == '__main__':
    inp, w, out = sys.argv[1], sys.argv[2], sys.argv[3]
    slo, shi = float(sys.argv[4]) if len(sys.argv) > 4 else 0.52, 0.99
    rng = np.random.default_rng(1)
    f = open(out, 'a')
    for N in list(range(2, 41)) + [50, 75, 100]:
        c, L, V, ps = setup(inp, w, N)
        m, sg, th = minimise(c, L, V, slo, shi, 60 if N <= 40 else 20, rng)
        rec = dict(input=inp, weight=w, N=N, primes=len(ps), min_abs_B=float(m), sigma=float(sg),
                   theta=[float(x) for x in th], sum_abs_tail=float(np.sum(np.abs(c[1:]) * np.exp(-slo * L[1:]))))
        f.write(json.dumps(rec) + '\n')
        f.flush()
        print('N=%d primes=%d  min|B|=%.3e at sigma=%.4f   (sum_{n>=2}|w_n a_n| n^-slo = %.3f)' % (N, len(ps), m, sg, rec['sum_abs_tail']), flush=True)
