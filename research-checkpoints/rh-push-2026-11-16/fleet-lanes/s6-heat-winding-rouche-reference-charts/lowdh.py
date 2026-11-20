"""Low heights with the true functions (ball arithmetic, 96 bit) and the table of off-line Davenport-Heilbronn zeros to gamma = 2000.
Usage: lowdh.py kind t part nparts.   Grid: x in [200, 3992), step 1/8, levels y in LV; boxes of width 1.
kind: ZETA | DH | CHI5.  References (statistic |f Qinv - 1|):  ZETA, CHI5: own Euler product, P = 13, 97, 1000;
DH: 'a' = formal Euler factors with a(p); 'c' = the combination c1 prod(1 - chi(p) b_p p^-s*)^-1 + c2 prod(1 - chibar(p) b_p p^-s*)^-1.
True f = Lam_t(s)/M_t(s) by Gauss-Hermite (32 nodes) for t != 0."""
import sys, math, json, os
import numpy as np
from rlib import *
from flint import acb, arb, ctx
ctx.prec = 96
kind = sys.argv[1]; t = float(sys.argv[2]); part = int(sys.argv[3]); nparts = int(sys.argv[4])
LV = [float(v) for v in os.environ.get('LOW_LV', '0.03,0.1809,0.36,0.6,1.0').split(',')]
gt = GT[kind]
kap = ((arb(10) - 2*arb(5).sqrt()).sqrt() - 2) / (arb(5).sqrt() - 1)
PER = {'DH': [acb(0), acb(1), acb(kap), acb(-kap), acb(-1)], 'CHI5': [acb(0), acb(1), acb(0, 1), acb(0, -1), acb(-1)], 'CHI5B': [acb(0), acb(1), acb(0, -1), acb(0, 1), acb(-1)]}
def arith(k, s):
    if k == 'ZETA': return s.zeta()
    return sum((PER[k][a] * s.zeta(arb(a)/5) for a in range(1, 5)), acb(0)) * (-s * acb(5).log()).exp()
rn = rootnum(kind); rn = acb(complex(rn).real, complex(rn).imag)
xs_gh, ws_gh = np.polynomial.hermite_e.hermegauss(32); ws_gh = ws_gh / math.sqrt(2 * math.pi)
def true_f(x, y):
    s = acb(arb(1) + arb(y), -arb(x)) / 2
    base = g_acb(gt, s) + (arb(t)/4) * alpha_acb(gt, s)**2
    def one(sh):
        ss = s + sh
        if ss.real < 0.5:
            return (g_acb(gt, 1 - ss) - base).exp() * arith('CHI5B' if kind == 'CHI5' else kind, 1 - ss) / rn.conjugate() if kind == 'CHI5' else (g_acb(gt, 1 - ss) - base).exp() * arith(kind, 1 - ss)
        return (g_acb(gt, ss) - base).exp() * arith(kind, ss)
    if t == 0: return one(acb(0))
    c = acb(arb(t) / 2).sqrt(); tot = acb(0)
    for xk, wk in zip(xs_gh, ws_gh): tot += one(c * float(xk)) * float(wk)
    return tot
ps = primes_upto(1000)
def eul(x, y, apk):
    s = acb(arb(1) + arb(y), -arb(x)) / 2; ss = s + (arb(t)/2) * alpha_acb(gt, s); ap = coef_at_primes(apk, ps)
    E = acb(1); out = {}
    for p, a in zip(ps, ap):
        if a != 0:
            lp = arb(int(p)).log(); E = E * (1 - acb(float(np.real(a)), float(np.imag(a))) * ((arb(t)/4) * lp * lp - ss * lp).exp())
        if p in (13, 97, 997): out[{13: 13, 97: 97, 997: 1000}[int(p)]] = c128(E)
    return out
x0, x1 = 200.0, float(os.environ.get('LOW_X1', '3992'))
n = int((x1 - x0) * 8); idx = np.arange(n)[part::nparts] if False else np.arange(n * part // nparts, n * (part + 1) // nparts + 1)
c1 = (1 - 1j * KAPPA) / 2; c2 = (1 + 1j * KAPPA) / 2
res = {}
for y in LV:
    f = []; refs = {}
    for i in idx:
        x = x0 + i / 8
        fv = c128(true_f(x, y)); f.append(fv)
        if kind == 'DH':
            Ea = eul(x, y, 'DH'); E1 = eul(x, y, 'CHI5'); E2 = eul(x, y, 'CHI5B')
            for P in (13, 97, 1000):
                refs.setdefault('aP%d' % P, []).append(Ea[P]); refs.setdefault('cP%d' % P, []).append(1.0 / (c1 / E1[P] + c2 / E2[P]))
        else:
            E = eul(x, y, kind)
            for P in (13, 97, 1000): refs.setdefault('P%d' % P, []).append(E[P])
    res['f_%g' % y] = np.array(f)
    for k, v in refs.items(): res['%s_%g' % (k, y)] = np.array(v)
    print(kind, t, part, 'level', y, 'done', flush=True)
res['x'] = x0 + idx / 8
np.savez('out_lowdh/%s_%g_%d.npz' % (kind, t, part), **res)
