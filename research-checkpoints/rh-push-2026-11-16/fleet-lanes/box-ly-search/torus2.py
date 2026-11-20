#!/usr/bin/env python3
"""torus2.py <input> <weight> <out.jsonl> [N list]: gradient descent for min over the torus of |B(sigma; theta)|
at sigma = 0.5001 (and with sigma free in [0.5001, 0.99]); float64, multi-start; MEASURED upper bounds for the
minimum (a value < 1e-9 means a torus zero was found; a positive value is the best of the starts, not a proof)."""
import json, math, sys
import numpy as np
import torus as T


def descend(c, L, V, sig, th, iters=3000):
    a = c * np.exp(-sig * L)
    lr = 0.5 / max(1e-9, float(np.sum(np.abs(a) * V.sum(1))))
    f_old = None
    for it in range(iters):
        e = np.exp(1j * (V @ th))
        Bv = a @ e
        f = abs(Bv) ** 2
        if f < 1e-24:
            break
        g = 2 * np.real(np.conj(Bv) * (1j * (a * e) @ V))
        # backtracking
        step = lr * 8
        for _ in range(30):
            th2 = th - step * g
            f2 = abs(a @ np.exp(1j * (V @ th2))) ** 2
            if f2 < f:
                break
            step /= 2
        else:
            break
        th = th2
        if f_old is not None and abs(f_old - f2) < 1e-18 * max(1.0, f2):
            break
        f_old = f2
    return math.sqrt(abs(a @ np.exp(1j * (V @ th))) ** 2), th


if __name__ == '__main__':
    inp, w, out = sys.argv[1], sys.argv[2], sys.argv[3]
    Ns = [int(x) for x in sys.argv[4].split(',')] if len(sys.argv) > 4 else [100, 150, 200, 300, 400, 600, 800, 1000, 1500, 2000]
    rng = np.random.default_rng(7)
    f = open(out, 'a')
    for N in Ns:
        c, L, V, ps = T.setup(inp, w, N)
        best = 1e9
        starts = 40 if N <= 400 else 12
        for s in range(starts):
            th0 = rng.uniform(0, 2 * math.pi, len(ps)) if s else np.full(len(ps), math.pi)
            m, th = descend(c, L, V, 0.5001, th0)
            best = min(best, m)
            if best < 1e-9:
                break
        rec = dict(input=inp, weight=w, N=N, primes=len(ps), sigma=0.5001, min_abs_B=float(best), starts=s + 1)
        f.write(json.dumps(rec) + '\n')
        f.flush()
        print(json.dumps(rec), flush=True)
