#!/usr/bin/env python3
"""Twisted first moments of measured sextic theta coefficients [NUMERICAL].
T(pi, k, sigma; Q) = sum_{N(m)<=Q} rho_sigma(-e0 m) chi_pi(m)^k,  k in {0..5}, pi primary prime (and conjugate),
normalised by (sum |rho_sigma|^2)^{1/2} (random walk ~ 1).  k = 0 is the untwisted coherent first moment (with m prime to pi).
Dictionary prediction (RESULT.md section 3): a polar term of relative size ~ N(pi)^{-1/3} for exactly one sextic twist
k = +1 or -1 (k = 5), none for the other k."""
import sys, os, math, json
import numpy as np
SX = sys.argv[1]
sys.path.insert(0, SX)
import zomega as Z
d = np.load(os.path.join(SX, 'conj_rows_800.npz'))
ms = [tuple(int(v) for v in r) for r in d['ms']]; Nm = d['Nm']; rho = d['rho']
act = [s for s in range(12) if np.abs(rho[:, s]).sum() > 0 and abs(rho[:, s].sum()) > 1e-6]
print('active classes', act)
Z6 = np.exp(2j * np.pi * np.arange(6) / 6)
out = {}
rng = np.random.default_rng(7)
for p in (7, 13, 19, 31, 37, 43, 61, 67, 73, 79, 97):
    pi = Z.split_primary(p)
    for lab, pr in (('pi', pi), ('pibar', Z.primary_assoc(Z.conj(pi)))):
        P = Z.PrimeO(pr, p, False)
        ex = np.array([-1 if P.chi(m) is None else P.chi(m) for m in ms])
        ok = ex >= 0
        row = {}
        for Q in (300, 796):
            sel = ok & (Nm <= Q)
            den = np.sqrt((np.abs(rho[sel][:, act]) ** 2).sum(0))
            vals = []
            for k in range(6):
                tw = Z6[(k * ex[sel]) % 6]
                T = (rho[sel][:, act] * tw[:, None]).sum(0)
                vals.append(np.abs(T) / den)
            vals = np.array(vals)            # k x classes
            row[Q] = vals
        v = row[796]
        print(f"N={p:3d} {lab:5s} Q=796  rms over classes per k=0..5: " + ' '.join(f"{x:5.2f}" for x in np.sqrt((v ** 2).mean(1)))
              + f"   pred k0*N^-1/3={np.sqrt((v[0]**2).mean())*p**(-1/3):.2f}")
        out[f"{p}|{lab}"] = {str(Q): row[Q].tolist() for Q in row}
json.dump(out, open('twisted_first_moment.json', 'w'))
