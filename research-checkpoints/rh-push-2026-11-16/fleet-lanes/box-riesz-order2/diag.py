#!/usr/bin/env python3
"""diag.py k N1,N2,...: zeros of the uncorrected Riesz section D_N^{(k)}(s) = sum_{n<=N} (1-log n/log(N+1))^k n^-s
in 0.5 < sigma < 1.2, 0.3 < t < TMAX, located by winding numbers on grid cells (float64, MEASURED) and Newton."""
import sys, math, json
import numpy as np

def D(k, N, s):
    n = np.arange(1, N + 1, dtype=float); ln = np.log(n); w = (1 - ln / math.log(N + 1)) ** k
    s = np.asarray(s)
    out = np.zeros(s.shape, complex)
    flat = s.ravel(); o = out.ravel()
    ch = max(1, int(2e7 // N))
    for i in range(0, len(flat), ch):
        o[i:i + ch] = np.exp(-np.outer(flat[i:i + ch], ln)) @ w
    return out

def dD(k, N, s):
    n = np.arange(1, N + 1, dtype=float); ln = np.log(n); w = (1 - ln / math.log(N + 1)) ** k
    e = np.exp(-s * ln) * w
    return e.sum(), -(e * ln).sum()

def zeros(k, N, tmax=40.0, slo=0.5, shi=1.2, tmin=0.3):
    hs, ht = 0.01, min(0.02, 0.6 / math.log(N + 1))
    sg = np.arange(slo, shi + hs / 2, hs); tg = np.arange(tmin, tmax, ht)
    S = sg[None, :] + 1j * tg[:, None]
    A = np.angle(D(k, N, S))
    d = lambda x: (x + np.pi) % (2 * np.pi) - np.pi
    w = (d(A[:-1, 1:] - A[:-1, :-1]) + d(A[1:, 1:] - A[:-1, 1:]) + d(A[1:, :-1] - A[1:, 1:]) + d(A[:-1, :-1] - A[1:, :-1])) / (2 * np.pi)
    res = []
    for i, j in zip(*np.nonzero(np.abs(w) > 0.5)):
        s = complex(sg[j] + hs / 2, tg[i] + ht / 2)
        for _ in range(50):
            f, fp = dD(k, N, s); s -= f / fp
        if abs(dD(k, N, s)[0]) < 1e-10:
            res.append((s.real, s.imag))
    return sorted(set((round(a, 9), round(b, 9)) for a, b in res), key=lambda z: z[1])

if __name__ == '__main__':
    k = float(sys.argv[1]); Ns = [int(x) for x in sys.argv[2].split(',')]
    tmax = float(sys.argv[3]) if len(sys.argv) > 3 else 40.0
    for N in Ns:
        z = zeros(k, N, tmax)
        zr = [a for a in z if a[0] > 0.5]
        print(json.dumps(dict(k=k, N=N, tmax=tmax, n_right=len(zr), zeros=zr[:12])), flush=True)
