#!/usr/bin/env python3
"""Composite sextic twists chi_c = chi_p1 chi_p2 (k=1 on both; mixed signs as control), and the exponent fit at primes."""
import sys, os, itertools
import numpy as np
SX = sys.argv[1]; sys.path.insert(0, SX)
import zomega as Z
d = np.load(os.path.join(SX, 'conj_rows_800.npz'))
ms = [tuple(int(v) for v in r) for r in d['ms']]; Nm = d['Nm']; rho = d['rho']
Z6 = np.exp(2j * np.pi * np.arange(6) / 6)
def ex(p):
    P = Z.PrimeO(Z.split_primary(p), p, False)
    return np.array([-1 if P.chi(m) is None else P.chi(m) for m in ms])
E = {p: ex(p) for p in (7, 13, 19, 31, 37, 43)}
def stat(e, sel):
    den = np.sqrt((np.abs(rho[sel]) ** 2).sum(0)); den[den == 0] = 1
    T = (rho[sel] * Z6[e[sel] % 6][:, None]).sum(0)
    return np.sqrt(((np.abs(T) / den) ** 2).mean())
print("composite c = p1 p2: (++) chi_p1 chi_p2 ; (+-) chi_p1 conj chi_p2 ; (--) conj conj ; (++)*N(c)^(1/3)")
for p1, p2 in itertools.combinations(E, 2):
    sel = (E[p1] >= 0) & (E[p2] >= 0)
    a = stat(E[p1] + E[p2], sel); b = stat(E[p1] - E[p2], sel); c = stat(-E[p1] - E[p2], sel)
    print(f"  c = {p1:2d}*{p2:2d} (N={p1*p2:4d}): {a:5.2f} {b:5.2f} {c:5.2f}   {a*(p1*p2)**(1/3):5.1f}")
ps = [p for p in range(7, 400) if p % 6 == 1 and all(p % q for q in range(2, int(p**.5)+1))]
xs, ys = [], []
for p in ps:
    e = ex(p); sel = e >= 0
    xs.append(np.log(p)); ys.append(np.log(stat(e, sel)))
xs = np.array(xs); ys = np.array(ys)
for lo, hi in ((7, 400), (7, 60), (7, 100), (60, 400)):
    k = (np.exp(xs) >= lo - .5) & (np.exp(xs) <= hi)
    s, c = np.polyfit(xs[k], ys[k], 1)
    print(f"prime twists k=1, {lo} <= N(pi) <= {hi} ({k.sum()} primes): slope {s:.3f}, amplitude at N=1 {np.exp(c):.2f}")
