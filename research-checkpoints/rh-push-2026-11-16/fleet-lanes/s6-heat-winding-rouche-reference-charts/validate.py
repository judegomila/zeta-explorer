"""Validation of rlib: (1) NUFFT against direct sums; (2) engine rows against an independent 256-bit evaluation of the same
two-ladder formula; (3) the two-ladder formula against the true heat-evolved completed function (Gauss-Hermite in ball arithmetic)."""
import sys, math, json
import numpy as np
import rlib
from rlib import *
from flint import acb, arb, ctx
ctx.prec = 256
out = {}
rng = np.random.default_rng(1)

# (1) NUFFT
M = 4096; nf = get_nufft(M); N = 3000
u = rng.uniform(0, 0.5, N); w = rng.normal(size=N) + 1j * rng.normal(size=N)
G = asnp(nf.run(nf.plan(u), w)); j = np.arange(-M // 2, M // 2)
Gd = np.array([np.sum(w * np.exp(1j * jj * u)) for jj in j[::37]])
out['nufft_relerr'] = float(np.abs(G[::37] - Gd).max() / np.abs(w).sum()); print('nufft', out['nufft_relerr'])

def A5(a): return [acb(complex(c).real, complex(c).imag) for c in a]
def arith(kind, s):
    if kind in ('ZETA',): return s.zeta()
    if kind == 'CHI4': return (s.zeta(arb(1)/4) - s.zeta(arb(3)/4)) * (-s * acb(4).log()).exp()
    if kind in ('CHI5', 'DH'):
        per = A5(CHI5 if kind == 'CHI5' else DHPER)
        if kind == 'DH':
            k = ((arb(10) - 2*arb(5).sqrt()).sqrt() - 2) / (arb(5).sqrt() - 1); per = [acb(0), acb(1), acb(k), acb(-k), acb(-1)]
        return sum((per[a] * s.zeta(arb(a)/5) for a in range(1, 5)), acb(0)) * (-s * acb(5).log()).exp()
    raise ValueError(kind)

xs_gh, ws_gh = np.polynomial.hermite_e.hermegauss(48); ws_gh = ws_gh / math.sqrt(2 * math.pi)
def true_f(kind, t, x, y):
    """Lam_t(s)/normaliser by Gauss-Hermite, s = (1+y-ix)/2"""
    s = acb(arb(1) + arb(y), -arb(x)) / 2
    c = acb(arb(t) / 2).sqrt()
    def Xi_over(sh):          # Xi(s+sh)/normaliser
        ss = s + sh
        if kind in GT and kind not in ('SGN', 'U'):
            gt = GT[kind]
            return (g_acb(gt, ss) - g_acb(gt, s) - (arb(t)/4) * alpha_acb(gt, s)**2).exp() * arith(kind, ss)
        if kind == 'EA':
            a = arb(EA_A)
            return (g_acb('Z', ss + a) + g_acb('Z', ss - a) - g_acb('Z', s + a) - g_acb('Z', s - a)).exp() * (ss + a).zeta() * (ss - a).zeta()
        if kind.startswith('TNR'):
            q = int(kind[3:]); lam = arb(q).log(); s0 = s + lam * arb(t) / 2
            lognorm = lam * lam * arb(t) / 4 + (s - acb(0.5)) * lam + g_acb('Z', s0) + (arb(t)/4) * alpha_acb('Z', s0)**2
            wq = (ss - acb(0.5)) * lam
            # xi(ss) (q^{ss-1/2} + q^{1/2-ss} + c) / norm, organised to avoid overflow
            return ((g_acb('Z', ss) + wq - lognorm).exp() + (g_acb('Z', ss) - wq - lognorm).exp() + arb(TNR_C) * (g_acb('Z', ss) - lognorm).exp()) * ss.zeta()
    if t == 0: return Xi_over(acb(0))
    tot = acb(0)
    for xk, wk in zip(xs_gh, ws_gh):
        tot += Xi_over(c * float(xk)) * float(wk)
    return tot

def formula_f(kind, t, x, y):
    """independent 256-bit evaluation of the two-ladder formula for a base kind"""
    gt = GT[kind]; q = QQ[gt]
    s = acb(arb(1) + arb(y), -arb(x)) / 2; w = 1 - s
    N = int(math.floor(math.sqrt(q * x / (4 * math.pi) + t / 16)))
    a = coefs(kind, N)
    ss = s + (arb(t)/2) * alpha_acb(gt, s); ws = w + (arb(t)/2) * alpha_acb(gt, w)
    D = acb(0); R = acb(0)
    for n in range(1, N + 1):
        if a[n] == 0: continue
        ln = arb(n).log(); b = ((arb(t)/4) * ln * ln).exp(); an = acb(complex(a[n]).real, complex(a[n]).imag)
        D += an * b * (-ss * ln).exp(); R += an.conjugate() * b * (-ws * ln).exp()
    LR = g_acb(gt, w) - g_acb(gt, s) + (arb(t)/4) * (alpha_acb(gt, w)**2 - alpha_acb(gt, s)**2)
    r = rootnum(kind)
    return D + acb(r.real, r.imag) * LR.exp() * R if isinstance(r, complex) else D + LR.exp() * R

cases = [('ZETA', 0.0), ('ZETA', 0.16), ('ZETA', 0.5), ('ZETA', -0.1), ('CHI4', 0.0), ('CHI4', 0.16), ('CHI5', 0.0), ('CHI5', 0.16), ('DH', 0.0), ('DH', 0.16),
         ('SGN', 0.05), ('U', 0.05), ('EA', 0.0), ('TNR3', 0.0), ('TNR3', 0.16), ('TNR3', 0.5), ('TNR1000003', 0.0), ('TNR1000003', 0.05), ('TNR1000003', 0.16)]
X = float(sys.argv[1]) if len(sys.argv) > 1 else 1.0e6
Mc = int(sys.argv[2]) if len(sys.argv) > 2 else 2**15
xc = X + Mc * H / 2
ch = Chunk(xc, Mc, nmax_for(['DH'], xc + Mc * H))
jj = sorted(rng.integers(0, Mc, 4).tolist()) + [Mc - 1, 0]
res = []
for kind, t in cases:
    for y in (0.03, 0.1809, 1.0):
        row = make_row(ch, kind, t, y, with_refs=False)
        f = asnp(row['f'])[jj]
        e1 = e2 = None
        ft = []
        for k, j_ in enumerate(jj):
            x = xc + (j_ - Mc // 2) * H
            if kind in GT:
                ff = c128(formula_f(kind, t, x, y)); e1 = max(e1 or 0, abs(ff - f[k]) / max(1, abs(ff)))
            if kind not in ('SGN', 'U') and k < 3:
                tv = c128(true_f(kind, t, x, y)); e2 = max(e2 or 0, abs(tv - f[k]) / max(1, abs(tv))); ft.append(abs(tv))
        res.append(dict(kind=kind, t=t, y=y, engine_vs_formula=e1, engine_vs_true=e2, abs_true=ft))
        print(kind, t, y, 'engine-formula', e1, 'engine-true', e2, 'abs true', ['%.3g' % v for v in ft], flush=True)
out['X'] = X; out['rows'] = res
json.dump(out, open('validate_%g.json' % X, 'w'), indent=0)
