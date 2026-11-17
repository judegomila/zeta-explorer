#!/usr/bin/env python3
"""pole_probe.py -- which index eta*lambda^k and class u (mod 4) carries the theta pole at m = 1 (growth Z^{3/4})."""
import sys, os, math
import numpy as np
sys.argv = [sys.argv[0], sys.argv[1] if len(sys.argv) > 1 else '60000']
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ms4
X = int(float(sys.argv[1]))
primes = ms4.build_primes(X)
gam = np.array([ms4.gauss_task(P) for P in primes])
norms, G, MU, FAC, VAL = ms4.enumerate_sf(primes, gam, X)
i4 = np.array([1, 1j, -1, -1j])
def symvec(z):
    out = np.zeros(len(norms), dtype=np.int64)
    for k, fac in enumerate(FAC):
        out[k] = sum(ms4.sym(primes[f], z) for f in fac) % 4
    return out
ei = symvec((0, 1)); el = symvec((1, 1))
cls = np.array([0 if ((v[0] - 1) % 4 == 0 and v[1] % 4 == 0) else 1 for v in VAL])
print('classes mod 4: u=1: %d, u=1+lambda^3: %d' % ((cls == 0).sum(), (cls == 1).sum()))
Zs = [X / 3.5 / 16, X / 3.5 / 4, X / 3.5]
print('S = sum_a conj(chi_a(eta lambda^k)) gamma_1(a) 1[a = u] w(N a/Z); column: |S|/Z^(3/4) at Z = %s; slope between last two' % [int(z) for z in Zs])
for e in range(4):
    for k in range(4):
        for u in (0, 1, 2):
            sel = np.ones(len(norms), bool) if u == 2 else (cls == u)
            ph = np.conj(i4[(e * ei + k * el) % 4]) * G
            v = []
            for Z in Zs:
                w = (norms / Z) * np.exp(-(norms / Z) ** 2)
                v.append(abs((ph * w)[sel].sum()))
            print('  eta=i^%d k=%d u=%s : %s   slope %.2f' % (e, k, ['1', '1+l^3', 'all'][u], ' '.join('%7.4f' % (x / Z ** .75) for x, Z in zip(v, Zs)), math.log(v[2] / v[1]) / math.log(4)))
