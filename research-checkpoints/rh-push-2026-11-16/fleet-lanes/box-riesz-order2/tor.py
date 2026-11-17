#!/usr/bin/env python3
"""tor.py: Bohr lift of the order-k Riesz section, B_N(sigma; theta) = sum_{n<=N} w_n n^-sigma exp(i sum_p v_p(n) theta_p),
w_n = (1 - log n / log(N+1))^k.  float64 tools (MEASURED): min-norm Newton solve of B = 0 in theta at fixed sigma,
continuation in sigma and in N.  D_N(sigma + it) = B_N(sigma; theta_p = -t log p)."""
import math, json, sys
import numpy as np

def primes_upto(N):
    s = np.ones(N + 1, bool); s[:2] = False
    for i in range(2, int(N ** 0.5) + 1):
        if s[i]: s[i * i::i] = False
    return np.nonzero(s)[0]

def setup(k, N, drop=(), dense=False):
    """coefficients w_n, log n, exponent matrix V (n x primes).  drop: primes whose multiples are removed (character lifts)."""
    ps = primes_upto(N)
    n = np.arange(1, N + 1)
    rows, cols = [], []
    for j, p in enumerate(ps):
        q = int(p)
        while q <= N:
            r = np.arange(q - 1, N, q); rows.append(r); cols.append(np.full(len(r), j))
            q *= int(p)
    import scipy.sparse as sp
    rows = np.concatenate(rows); cols = np.concatenate(cols)
    V = sp.csr_matrix((np.ones(len(rows)), (rows, cols)), shape=(N, len(ps)))   # duplicates are summed: v_p(n)
    if dense:
        V = V.toarray()
    ln = np.log(n.astype(float))
    w = (1 - ln / math.log(N + 1)) ** k
    for p in drop:
        w[p - 1::p] = 0
    return w, ln, V, ps

def Bval(w, ln, V, sig, th):
    return (w * np.exp(-sig * ln)) @ np.exp(1j * (V @ th))

def solve(w, ln, V, sig, th, iters=60, tol=1e-13):
    """damped min-norm Newton for B(sig; theta) = 0 in theta.  Returns (|B|, theta)."""
    a = w * np.exp(-sig * ln)
    e = np.exp(1j * (V @ th)); B = a @ e
    for _ in range(iters):
        if abs(B) < tol: break
        J = 1j * (V.T @ (a * e))
        M = np.vstack([J.real, J.imag])
        d = np.linalg.lstsq(M, -np.array([B.real, B.imag]), rcond=None)[0]
        lam = 1.0
        while lam > 1e-6:
            e2 = np.exp(1j * (V @ (th + lam * d))); B2 = a @ e2
            if abs(B2) < abs(B): break
            lam /= 2
        else:
            break
        th = th + lam * d; e, B = e2, B2
    return abs(B), th

def climb(w, ln, V, sig, th, smax=1.5, step=0.02, minstep=1e-5):
    """follow the zero set to larger sigma (greedy); returns last (sigma, theta) with B = 0."""
    while step > minstep and sig < smax:
        r, th2 = solve(w, ln, V, sig + step, th)
        if r < 1e-12:
            sig, th = sig + step, th2
        else:
            step /= 2
    return sig, th
