import sys, json, math
import mpmath as mp, numpy as np
from lib import *
mp.mp.dps = 40
K = consts(); a, b, Tinf = K['a'], K['b'], K['Tinf']
out = {}
# 1. zeta path against the PR-23 receipts (closed reserve)
N = int(float(sys.argv[1])) if len(sys.argv) > 1 else 10**4
pp = prime_powers(N)
S = mp.mpf(0); J = mp.mpf(0); R = None; nneg = npos = 0; minM = None; credit = mp.mpf(0); debt = mp.mpf(0)
d0 = mp.mpf(8)/15*mp.mpf(2)**(-2.5)
brz = bridge('zeta')
maxdiffC = 0
for i, (q, p, k) in enumerate(pp):
    w = mp.log(p)/mp.mpf(q)**0.5; r = mp.log(q)
    if R is not None:
        H = S - b; c = w*mp.log(q/(H/2)**2); z = w/H; d = 2*H*((1 + z)*mp.log(1 + z) - z)
        credit += c; debt += d
    S += w; J += w*r; H = S - b
    Rn = J - 2*H*(mp.log(H/2) - 1) - 4 + Tinf
    if R is not None:
        if Rn < R: nneg += 1
        else: npos += 1
    R = Rn
    xm = ((H - d0)/2)**2; eps = mp.mpf(4)/25*xm**(-2.5)/(1 - xm**(-2))
    M = Rn - eps
    if minM is None or M < minM[0]: minM = (M, q)
    if i < 40:   # C in Suzuki's form vs generic bridge
        Cs = 4*mp.exp(r/2) + b*r - 4 + Tinf - (U(mp.mpf(1)/2, r) - mp.exp(-r/2)*4)
        maxdiffC = max(maxdiffC, abs(Cs - Cfun(brz, r)))
out['events'] = len(pp); out['last'] = pp[-1][0]; out['Rfinal'] = mp.nstr(R, 22)
out['minMlower'] = (mp.nstr(minM[0], 22), minM[1]); out['negR_updates'] = nneg; out['posR_updates'] = npos
out['credit'] = mp.nstr(credit, 12); out['debt'] = mp.nstr(debt, 12); out['C_generic_vs_suzuki'] = float(maxdiffC)
print(json.dumps(out, indent=1))
