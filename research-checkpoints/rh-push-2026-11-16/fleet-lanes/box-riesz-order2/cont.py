#!/usr/bin/env python3
"""cont.py k: continuation of the diagonal zero of D_N^{(k)} down in N on the torus (float64, MEASURED).
Seed: zero of D_N0 at s0 (theta_p = -t0 log p).  For decreasing N: restrict theta to primes <= N, solve B = 0 at
sigma = 0.5 + eps, then climb in sigma."""
import sys, json, math
import numpy as np
import tor, diag
k = float(sys.argv[1]); N0 = int(sys.argv[2]); out = sys.argv[3]
z = [a for a in diag.zeros(k, N0, 30.0) if a[0] > 0.5]
print('seed zeros', z, flush=True)
s0, t0 = z[0]
w, ln, V, ps = tor.setup(k, N0)
th = -t0 * np.log(ps.astype(float)); sig = s0
print('check', abs(tor.Bval(w, ln, V, sig, th)))
N = N0; f = open(out, 'a')
ratio = float(sys.argv[4]) if len(sys.argv) > 4 else 0.9
store = {}
while N >= 3:
    w, ln, V, ps2 = tor.setup(k, N)
    th = th[:len(ps2)]
    best = None
    for sg in ([sig] if sig > 0.5 else []) + [0.56, 0.53, 0.51, 0.502, 0.5002]:
        r, th2 = tor.solve(w, ln, V, sg, th, iters=200)
        if r < 1e-12:
            best = (sg, th2); break
    if best is None:
        rec = dict(k=k, N=N, zero=False, resid=float(r))
        print(json.dumps(rec), flush=True); f.write(json.dumps(rec) + '\n'); f.flush()
        break
    sig, th = tor.climb(w, ln, V, best[0], best[1])
    rec = dict(k=k, N=N, zero=True, primes=len(ps2), sigma_max_found=sig, resid=float(abs(tor.Bval(w, ln, V, sig, th))))
    print(json.dumps(rec), flush=True); f.write(json.dumps(rec) + '\n'); f.flush()
    np.save(out.replace('.jsonl', '') + f'_theta_N{N}.npy', np.concatenate([[sig], th]))
    N2 = int(N * ratio)
    N = N2 if N2 < N else N - 1
    sig = sig - 0.01 if sig > 0.52 else 0.0
