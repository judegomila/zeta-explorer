# Combination 2 analysis: block suprema of |M_c(x)|/sqrt x, fitted growth exponents, T-NR from M(x/3^k), Riesz sums.
# usage: mob_an.py prefix X X2 out.json
import sys, json, math
import numpy as np
pref, X, X2, OUT = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
SEG = 1 << 24; NI = 5; INT = ['mu (zeta)', 'mu chi4 (L(chi_-4))', 'mu chi3 (L(chi_-3))', '|mu| (Liouville twist)', 'mu eps (hash sign twist)']
cp = np.loadtxt(pref + '.cp'); xs = cp[:, 0]
seg = np.fromfile(pref + '.seg', np.dtype([('base', '<i8'), ('mn', '<i4'), ('mx', '<i4')])).reshape(-1, NI)
nseg = len(seg); lo = np.arange(nseg, dtype=float)*SEG
res = dict(X=X, X2=X2, checks={}, cols={})
for x0, ref in ((1e6, 212), (1e7, 1037), (1e8, 1928), (1e9, -222), (1e10, -33722), (1e11, -87856), (1e12, 62366), (1e13, 599582)):
    i = np.flatnonzero(xs == x0)
    if len(i): res['checks']['M(%g)' % x0] = (int(cp[i[0], 1]), ref)
print('checks against published values of M(10^k):', res['checks'])
PB = 16
def binfit(xv, yv, lo_, hi_):
    s = (xv >= lo_) & (xv <= hi_) & (yv > 0)
    if s.sum() < 6: return None
    b = np.floor(PB*np.log10(xv[s])).astype(int); ub = np.unique(b); sup = np.array([yv[s][b == u].max() for u in ub]); xc = 10**((ub + 0.5)/PB)
    sl, ic = np.polyfit(np.log(xc), np.log(sup), 1); return dict(slope=float(sl), nbins=int(len(ub)), sup_first=float(sup[0]), sup_last=float(sup[-1]), sup_max=float(sup.max()))
for c, nm in enumerate(INT):
    hi_x = X if c < 4 else X2
    # segment suprema (valid for segments fully below hi_x), normalised by sqrt of the segment start (upper bound; segments with lo >= 2^26)
    m = (lo >= (1 << 26)) & (lo + SEG <= hi_x + 1)
    a = np.maximum(np.abs(seg['base'][m, c] + seg['mn'][m, c]), np.abs(seg['base'][m, c] + seg['mx'][m, c])).astype(float)
    xv = lo[m]; yv = a/np.sqrt(xv)
    sc = (xs <= min(hi_x, 1 << 26)) & (xs >= 10); xv = np.concatenate([xs[sc], xv]); yv = np.concatenate([np.abs(cp[sc, 1 + c])/np.sqrt(xs[sc]), yv])
    if c == 3: yv = np.abs(yv*np.sqrt(xv) - 6/math.pi**2*xv)/np.sqrt(xv) if False else yv
    k = int(np.argmax(yv)); rec = dict(max_ratio=float(yv[k]), at=float(xv[k]))
    for a_, b_ in ((1e9, hi_x), (1e7, hi_x), (1e5, 1e9)):
        if b_ > a_*30: rec['fit_%g_%g' % (a_, b_)] = binfit(xv, yv, a_, b_)
    # exponent of |M| itself = slope + 1/2
    res['cols'][nm] = rec; print(nm, rec)
# float columns at checkpoints (x <= X2)
s2 = xs <= X2
U = np.hypot(cp[s2, 6], cp[s2, 7])/np.sqrt(xs[s2]); res['cols']['mu n^{-i alpha} (unimodular twist zeta(s+i alpha), alpha=1.2393)'] = dict(max_ratio=float(U[xs[s2] >= 10].max()), fit=binfit(xs[s2], U, 1e7, X2), fit2=binfit(xs[s2], U, 1e5, X2))
for j, a in ((8, 0.125), (9, 0.25)):
    v = np.abs(cp[s2, j])/np.sqrt(xs[s2]); res['cols']['E_a inverse, a=%g' % a] = dict(max_ratio=float(v.max()), fit=binfit(xs[s2], v, 1e7, X2), fit2=binfit(xs[s2], v, 1e5, X2), ratio_at=[(float(x), float(r)) for x, r in zip(xs[s2][::400], v[::400])])
# T-NR(q=3, c=2.2): inverse coefficients = mu * h on powers of 3, h_k from 1/(1 + c sqrt3 T + 3 T^2)
Mof = {int(x): int(m) for x, m in zip(xs, cp[:, 1])}
c_ = 2.2; q = 3; h = [1.0, -c_*math.sqrt(q)]
for k in range(2, 40): h.append(-c_*math.sqrt(q)*h[-1] - q*h[-2])
G = [int(round(10**(j/32))) for j in range(32, int(32*math.log10(X)) + 1)]
tn = []
for x in G:
    if x < 1e6 or x > X: continue
    y = x; k = 0; s = 0.0; ok = True
    while y >= 1:
        if y not in Mof: ok = False; break
        s += h[k]*Mof[y]; y //= 3; k += 1
    if ok: tn.append((x, abs(s)/math.sqrt(x)))
tn = np.array(tn); beta = 0.5 + math.acosh(c_/2)/math.log(q)
res['cols']['T-NR(3, 2.2) inverse'] = dict(beta_max=beta, max_ratio=float(tn[:, 1].max()), fit=binfit(tn[:, 0], tn[:, 1], 1e9, X), fit2=binfit(tn[:, 0], tn[:, 1], 1e6, X), first=[float(tn[0, 0]), float(tn[0, 1])], last=[float(tn[-1, 0]), float(tn[-1, 1])])
for k in list(res['cols'])[5:]: print(k, res['cols'][k])
json.dump(res, open(OUT, 'w'), indent=1)
