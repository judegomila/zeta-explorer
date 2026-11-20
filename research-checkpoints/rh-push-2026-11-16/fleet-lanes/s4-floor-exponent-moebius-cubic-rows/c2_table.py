# Combination 2: final numbers. usage: c2_table.py prefix X X2
import sys, json, math, numpy as np
pref, X, X2 = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
SEG = 1 << 24; NI = 5; PB = 16
cp = np.loadtxt(pref + '.cp'); xs = cp[:, 0]
seg = np.fromfile(pref + '.seg', np.dtype([('base', '<i8'), ('mn', '<i4'), ('mx', '<i4')])).reshape(-1, NI); lo = np.arange(len(seg), dtype=float)*SEG
def blocks(xv, yv, a, b):
    s = (xv >= a) & (xv <= b); bb = np.floor(PB*np.log10(xv[s])).astype(int); ub = np.unique(bb)
    sup = np.array([yv[s][bb == u].max() for u in ub]); xc = 10**((ub + 0.5)/PB); sl, ic = np.polyfit(np.log(xc), np.log(sup), 1, cov=True)
    return float(sl[0]), float(math.sqrt(ic[0, 0])), float(sup.max()), float(sup[0]), float(sup[-1]), len(ub)
out = {}
def rep(nm, xv, yv, ranges):
    out[nm] = {}
    for a, b in ranges:
        if b < a*20: continue
        sl, se, mx, f, l, nb = blocks(xv, yv, a, b); out[nm]['%g..%g' % (a, b)] = dict(exponent=0.5 + sl, se=se, sup=mx, first=f, last=l, nbins=nb)
        print('%-34s [%g, %g]: exponent of block suprema of |M| = %.3f +- %.3f ; sup |M|/sqrt x = %.4g (first block %.4g, last %.4g; %d blocks)' % (nm, a, b, 0.5 + sl, se, mx, f, l, nb))
for c, nm in enumerate(['zeta', 'L(chi_-4)', 'L(chi_-3)', 'Liouville twist', 'hash sign twist']):
    hi = X if c < 4 else X2; m = (lo >= (1 << 26)) & (lo + SEG <= hi + 1)
    a = np.maximum(np.abs(seg['base'][m, c] + seg['mn'][m, c]), np.abs(seg['base'][m, c] + seg['mx'][m, c])).astype(float)
    rep(nm, lo[m], a/np.sqrt(lo[m]), [(1e9, hi), (1e8, hi), (1e7, 1e10)])
    if c == 0:
        k = int(np.argmax(a/np.sqrt(lo[m]))); print('   zeta: largest block value %.5f in the segment starting at %.6g (published maximum 0.570591 at 7766842813)' % ((a/np.sqrt(lo[m]))[k], lo[m][k]))
s2 = (xs <= X2) & (xs >= 10)
rep('unimodular twist zeta(s + i alpha)', xs[s2], np.hypot(cp[s2, 6], cp[s2, 7])/np.sqrt(xs[s2]), [(1e9, X2), (1e8, X2), (1e7, X2)])
for j, a in ((8, 0.125), (9, 0.25)): rep('E_a inverse, a = %g' % a, xs[s2], np.abs(cp[s2, j])/np.sqrt(xs[s2]), [(1e9, X2), (1e8, X2), (1e7, X2), (1e3, 1e7)])
Mof = {int(x): int(m) for x, m in zip(xs, cp[:, 1])}
c_ = 2.2; q = 3; h = [1.0, -c_*math.sqrt(q)]
for k in range(2, 40): h.append(-c_*math.sqrt(q)*h[-1] - q*h[-2])
tn = []
for x in sorted(set(int(round(10**(j/32))) for j in range(32, int(32*math.log10(X)) + 1))):
    y = x; k = 0; s = 0.0; ok = True
    while y >= 1:
        if y not in Mof: ok = False; break
        s += h[k]*Mof[y]; y //= 3; k += 1
    if ok: tn.append((x, abs(s)/math.sqrt(x)))
tn = np.array(tn); rep('T-NR(3, 2.2) inverse', tn[:, 0], tn[:, 1], [(1e9, X), (1e8, X), (1e3, 1e7)])
print('   T-NR: |M_NR(x)|/sqrt x at x = 10, 100, 1000:', [round(float(tn[np.argmin(abs(tn[:, 0] - v)), 1]), 2) for v in (10, 100, 1000)], ' beta_max = %.4f' % (0.5 + math.acosh(1.1)/math.log(3)))
S = np.loadtxt('dh_1e9.sup')
for a, b in ((1e7, 1e9), (1e5, 1e9), (1e3, 1e5)):
    s = (S[:, 0] >= a) & (S[:, 0] < b); sl, ic = np.polyfit(np.log(S[s, 0]), np.log(S[s, 1]), 1, cov=True)
    print('%-34s [%g, %g]: exponent of block suprema of |M| = %.3f +- %.3f ; sup |M|/sqrt x = %.4g' % ('DH inverse (32 blocks per decade)', a, b, 0.5 + sl[0], math.sqrt(ic[0, 0]), S[s, 1].max()))
    out.setdefault('DH', {})['%g..%g' % (a, b)] = dict(exponent=0.5 + float(sl[0]), se=float(math.sqrt(ic[0, 0])), sup=float(S[s, 1].max()))
json.dump(out, open(pref + '_table.json', 'w'), indent=1)
