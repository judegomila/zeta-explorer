#!/usr/bin/env python3
"""dh_lift.py k N1,N2,.. starts out: the same multi-start torus search for the Bohr lift of the Davenport-Heilbronn Riesz section
(coefficients a_n = ((1 - i kappa) chi(n) + (1 + i kappa) conj chi(n)) / 2, chi mod 5 with chi(2) = i).  float64, MEASURED."""
import sys, json, math
import numpy as np
import tor, gpu_torus
kap = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
chi = np.array([0, 1, 1j, -1j, -1])
orig = tor.setup
def setup(k, N, drop=(), dense=False):
    w, ln, V, ps = orig(k, N, drop, dense)
    n = np.arange(1, N + 1); c = chi[n % 5]
    return w * ((1 - 1j * kap) * c + (1 + 1j * kap) * np.conj(c)) / 2, ln, V, ps
tor.setup = setup
k = float(sys.argv[1]); f = open(sys.argv[4], 'a')
for N in [int(x) for x in sys.argv[2].split(',')]:
    best, bth, nz, d = gpu_torus.run(k, N, int(sys.argv[3]), 0.5001, ())
    rec = dict(input='dh', k=k, N=N, sigma=0.5001, starts=int(sys.argv[3]), min_abs_B=best, starts_reaching_zero=nz)
    print(json.dumps(rec), flush=True); f.write(json.dumps(rec) + '\n'); f.flush()
