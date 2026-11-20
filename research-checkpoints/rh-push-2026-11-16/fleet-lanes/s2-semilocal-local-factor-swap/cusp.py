#!/usr/bin/env python3
"""Combination 2: cusp out-fraction f_out(rho) at rho = p^k for swapped local factors.
Increment per step of log_p(1/eps): I_S(j) = delta_S(p^k(1+p^-j)) - delta_S(p^k(1+p^-(j-1))), same for delta_in.
f_out(j) = 1 - I_in(j)/I_S(j); Aitken on the last three j. Law to test: f_out -> 1 - 1/rho."""
import sys, math, json, os
import numpy as np
import sisum, lf
p = int(sys.argv[1]); KMAX = int(sys.argv[2]); JMAX = int(sys.argv[3]); OUT = sys.argv[4] if len(sys.argv) > 4 else 'out'
os.makedirs(OUT, exist_ok=True)
names = ['zeta', 'sign', 'ntp', 'ntm', 'ea'] + (['dh', 'l2'] if p in (2, 3) else [])
rows = []
for name in names:
    npos = int(JMAX + KMAX + 110 / math.log2(p) * (2.6 if name in ('ntp', 'ea') else 1) + 10)
    for k in range(1, KMAX + 1):
        rho0 = float(p) ** k; dS = []; dI = []; rS = []; rI = []
        for j in range(4, JMAX + 1):
            eps = float(p) ** (-j)
            tS, resS = sisum.br_res(name, p, k, eps, npos)
            tI, resI = sisum.br_res(name, p, -k, -eps / (1 + eps), npos)
            r = rho0 * (1 + eps)
            dS.append(math.sqrt(r) * tS); dI.append(tI / math.sqrt(r)); rS.append(math.sqrt(r) * resS); rI.append(resI / math.sqrt(r))
        dS, dI, rS, rI = map(np.array, (dS, dI, rS, rI))
        IS = np.diff(dS); II = np.diff(dI)
        with np.errstate(divide='ignore', invalid='ignore'): f = 1 - II / IS
        a, b, c = f[-3], f[-2], f[-1]
        den = (c - b) - (b - a); ait = c - (c - b) ** 2 / den if abs(den) > 1e-300 else c
        # non-resonant remainder must be smooth in eps: its increments -> 0
        smooth = float(np.max(np.abs(np.diff(dS - rS)[-3:])))
        law = 1 - 1 / rho0
        A, B = lf.factor(name, p)
        amax = max(abs(x) for x in np.roots(np.array(B)[::-1]) ** -1) if len(B) > 1 else 0.0   # largest |alpha|
        pred = 1 - (amax ** 2 / p) ** k
        rows.append(dict(name=name, p=p, k=k, rho=rho0, incS_last=float(IS[-1]), incIn_last=float(II[-1]), f_last=float(c), f_aitken=float(ait),
                         law=law, dev=float(ait - law), pred_alpha=pred, dev_pred=float(ait - pred), nonres_incr=smooth, f_tail=[float(z) for z in f[-6:]]))
        print(f'{name:5s} p={p} k={k} incS={IS[-1]:+.6e} incIn={II[-1]:+.6e} f_out(last)={c:.9f} aitken={ait:.9f} | 1-1/rho={law:.9f} dev={ait-law:+.2e} | 1-(|a|^2/p)^k={pred:.9f} dev={ait-pred:+.2e} | nonres incr {smooth:.1e}', flush=True)
json.dump(rows, open(f'{OUT}/cusp_p{p}.json', 'w'))
