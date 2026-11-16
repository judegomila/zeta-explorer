#!/usr/bin/env python3
"""As twisted_first_moment.py, all 12 classes, with a phase-randomised null (moduli kept, +-m antisymmetry kept)."""
import sys, os
import numpy as np
SX = sys.argv[1]; sys.path.insert(0, SX)
import zomega as Z
d = np.load(os.path.join(SX, 'conj_rows_800.npz'))
ms = [tuple(int(v) for v in r) for r in d['ms']]; Nm = d['Nm']; rho = d['rho']
Z6 = np.exp(2j * np.pi * np.arange(6) / 6)
rng = np.random.default_rng(11)
idx = {m: i for i, m in enumerate(ms)}
neg = np.array([idx[(-m[0], -m[1])] for m in ms])
half = np.array([i < neg[i] for i in range(len(ms))])
def null_draw():
    ph = np.exp(2j * np.pi * rng.random(rho.shape))
    r = rho * ph
    sgn = np.where(np.abs(rho[half] + rho[neg[half]]).sum(0) < 1e-9, -1.0, 1.0)   # antisymmetric classes
    r[neg[half]] = r[half] * sgn[None, :]
    return r
print("cols: rms over the 12 classes of |T_k|/||rho||, k = 0..5 ; null: mean and 99% of the same rms for k=1")
for p in (7, 13, 19, 31, 37, 43, 61, 67, 73, 79, 97, 103, 109, 127, 139, 151, 157, 163, 181, 193, 199):
    P = Z.PrimeO(Z.split_primary(p), p, False)
    ex = np.array([-1 if P.chi(m) is None else P.chi(m) for m in ms])
    sel = ex >= 0
    den = np.sqrt((np.abs(rho[sel]) ** 2).sum(0)); den[den == 0] = 1
    v = []
    for k in range(6):
        T = (rho[sel] * Z6[(k * ex[sel]) % 6][:, None]).sum(0)
        v.append(np.sqrt(((np.abs(T) / den) ** 2).mean()))
    nl = []
    for _ in range(200):
        r = null_draw()
        T = (r[sel] * Z6[ex[sel] % 6][:, None]).sum(0)
        nl.append(np.sqrt(((np.abs(T) / den) ** 2).mean()))
    nl = np.array(nl)
    print(f"N={p:3d} N mod 12={p%12:2d}: " + ' '.join(f"{x:5.2f}" for x in v) + f"   null k=1: {nl.mean():.2f} / {np.quantile(nl,.99):.2f}   k1*N^(1/3)={v[1]*p**(1/3):.1f}  k5*N^(1/3)={v[5]*p**(1/3):.1f}")
