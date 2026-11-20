#!/usr/bin/env python3
"""cont2.py k seed.npy Nstart step out.jsonl: fine continuation down in N from a stored torus zero (float64, MEASURED)."""
import sys, json
import numpy as np
import tor
k = float(sys.argv[1]); seed = np.load(sys.argv[2]); N = int(sys.argv[3]); step = int(sys.argv[4]); out = sys.argv[5]
th = seed[1:]; f = open(out, 'a'); fails = 0
while N >= 3 and fails < 6:
    w, ln, V, ps = tor.setup(k, N)
    th = th[:len(ps)]
    ok = None
    for sg in [0.52, 0.51, 0.505, 0.502, 0.5005, 0.50005]:
        r, th2 = tor.solve(w, ln, V, sg, th, iters=300)
        if r < 1e-12:
            ok = (sg, th2); break
    if ok is None:
        rec = dict(k=k, N=N, zero=False, resid_at_0p50005=float(r)); fails += 1
    else:
        sig, th = tor.climb(w, ln, V, ok[0], ok[1])
        rec = dict(k=k, N=N, zero=True, primes=len(ps), sigma_max_found=sig)
        np.save(out.replace('.jsonl', '') + f'_theta_N{N}.npy', np.concatenate([[sig], th])); fails = 0
    print(json.dumps(rec), flush=True); f.write(json.dumps(rec) + '\n'); f.flush()
    N -= step
