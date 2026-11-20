"""Recheck of engine values against the true functions in ball arithmetic.  Usage: recheck.py X t kind nboxes [nodes] [prec]
True f = Lam_t(s)/M_t(s): Gauss-Hermite (nodes) over 'prec'-bit values of the completed function (zeta / Hurwitz zeta of Arb);
reference E_P(s*) = prod_{p<=P} (1 - a_p b_p p^{-s*}) directly in ball arithmetic.  For each sampled box and the levels 0.03, 0.1809, 1.0:
points x = box start + 0, 1/4, 1/2, 3/4, 1.  Output: largest |f_engine - f_true|, largest relative error of E_1000, and for P = 1000
the values max |f E - 1| from the engine and from the true function with the count of boxes whose sign of 1 - max differs."""
import sys, math, json, time
import numpy as np
import rlib
from rlib import *
from flint import acb, arb, ctx
X = float(sys.argv[1]); t = float(sys.argv[2]); kind = sys.argv[3]; nbx = int(sys.argv[4])
nodes = int(sys.argv[5]) if len(sys.argv) > 5 else 40
prec = int(sys.argv[6]) if len(sys.argv) > 6 else 160
def arith(kind, s):
    if kind == 'ZETA': return s.zeta()
    if kind == 'CHI4': return (s.zeta(arb(1)/4) - s.zeta(arb(3)/4)) * (-s * acb(4).log()).exp()
    if kind == 'DH':
        k = ((arb(10) - 2*arb(5).sqrt()).sqrt() - 2) / (arb(5).sqrt() - 1); per = [acb(0), acb(1), acb(k), acb(-k), acb(-1)]
        return sum((per[a] * s.zeta(arb(a)/5) for a in range(1, 5)), acb(0)) * (-s * acb(5).log()).exp()
xs_gh, ws_gh = np.polynomial.hermite_e.hermegauss(nodes); ws_gh = ws_gh / math.sqrt(2 * math.pi)
def true_f(x, y):
    gt = GT[kind]; s = acb(arb(1) + arb(y), -arb(x)) / 2
    def one(sh):
        ss = s + sh
        if ss.real < 0.5:      # completed function is symmetric (root number 1 for these kinds): keep the arithmetic factor right of 1/2
            return (g_acb(gt, 1 - ss) - g_acb(gt, s) - (arb(t)/4) * alpha_acb(gt, s)**2).exp() * arith(kind, 1 - ss)
        return (g_acb(gt, ss) - g_acb(gt, s) - (arb(t)/4) * alpha_acb(gt, s)**2).exp() * arith(kind, ss)
    if t == 0: return one(acb(0))
    c = acb(arb(t) / 2).sqrt(); tot = acb(0)
    for xk, wk in zip(xs_gh, ws_gh): tot += one(c * float(xk)) * float(wk)
    return tot
ps = primes_upto(1000); ap = coef_at_primes(kind, ps)
def true_E(x, y):
    gt = GT[kind]; s = acb(arb(1) + arb(y), -arb(x)) / 2; ss = s + (arb(t)/2) * alpha_acb(gt, s)
    E = acb(1)
    for p, a in zip(ps, ap):
        if a == 0: continue
        lp = arb(int(p)).log(); E *= 1 - acb(float(np.real(a)), float(np.imag(a))) * ((arb(t)/4) * lp * lp - ss * lp).exp()
    return E
Lc, nchunk = chunk_plan(X, 262144); M = int(Lc / H); xc = X + Lc / 2
ch = Chunk(xc, M, nmax_for(['DH'], X + Lc))
rng = np.random.default_rng(int(X) % 1000003 + int(1000 * t) + len(kind))
boxes = sorted(rng.integers(0, M // 16 - 1, nbx).tolist())
levels = [0.03, 0.1809, 1.0]
ctx.prec = prec
res = dict(X=X, t=t, kind=kind, nodes=nodes, prec=prec, boxes=boxes, rows=[]); t0 = time.time()
dfmax = 0.0; demax = 0.0; flips = 0; radmax = 0.0
for y in levels:
    row = make_row(ch, kind, t, y, with_refs=True)
    fe = asnp(row['f']); key = 'cP1000' if kind == 'DH' else 'P1000'
    Ee = asnp(row['refs']['aP1000' if kind == 'DH' else 'P1000'])
    for k in boxes:
        ge = []; gtv = []
        for j in range(16 * k, 16 * k + 17, 4):
            x = xc + (j - M // 2) * H
            ctx.prec = prec
            ft = true_f(x, y); Et = true_E(x, y)
            radmax = max(radmax, float(ft.real.rad()), float(ft.imag.rad()))
            ftc = c128(ft); Etc = c128(Et)
            dfmax = max(dfmax, abs(ftc - fe[j])); demax = max(demax, abs(Etc - Ee[j]) / abs(Etc))
            ge.append(abs(fe[j] * Ee[j] - 1)); gtv.append(abs(ftc * Etc - 1))
        a, b = max(ge), max(gtv); flips += int((a < 1) != (b < 1))
        res['rows'].append(dict(y=y, box=k, engine=a, true=b))
        print('y %.4f box %d engine %.6f true %.6f  (%.0fs)' % (y, k, a, b, time.time() - t0), flush=True)
res.update(max_abs_f_diff=dfmax, max_rel_E_diff=demax, sign_flips=flips, max_ball_radius=radmax)
print('SUMMARY', json.dumps({k: v for k, v in res.items() if k not in ('rows', 'boxes')}))
json.dump(res, open('recheck_%s_%g_%g.json' % (kind, X, t), 'w'), indent=0)
