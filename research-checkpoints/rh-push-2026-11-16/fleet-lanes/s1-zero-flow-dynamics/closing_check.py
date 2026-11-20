"""Re-check of the close pairs with the closing sign (normalised gap < 0.2 and R_eff = g^2 B/2 > 1), CPU only.
R_eff > 1 needs B > 2/g^2, i.e. a third zero at distance g' with g'(g+g') < g^2/2 roughly (g' < 0.37 g): candidates are found from the gaps alone,
then R_eff is summed in longdouble over 4000 neighbours each side plus the continuum tail; for zeta and conductor 5 the three zeros of the cluster
are re-located at 30 digits (mpmath siegelz / flint hardy_z at 128 bits) first.
Usage: closing_check.py LIST.npy zeta|chi|chibar|dh|alt|heat"""
import sys, math, os
os.environ['RH_BACKEND'] = 'cpu'
import numpy as np, mpmath as mp
import zl
f = sys.argv[1]; kind = sys.argv[2]
g = np.load(f)
if kind in ('zeta', 'heat'): x = zl.theta(g) / math.pi
else:
    import gen_dir; x = gen_dir.vartheta(g) / math.pi
d = np.diff(x); m = float(d[1000:].mean()) if len(d) > 2000 else float(d.mean())
# local mean gap in windows (DH and heat lists have fewer real zeros than the full count)
w = 2000; n = len(d) // w; lm = np.repeat(d[:n * w].reshape(n, w).mean(1), w); lm = np.concatenate([lm, np.full(len(d) - len(lm), lm[-1])])
s = d / lm
k = np.nonzero((s[1:-1] < 0.2) & ((s[:-2] < 0.45 * s[1:-1]) | (s[2:] < 0.45 * s[1:-1])))[0] + 1
print('%s: %d zeros ; close pairs %d ; candidates (a neighbouring gap below 0.45 of the pair gap) %d' % (kind, len(g), int((s < 0.2).sum()), len(k)))
mp.mp.dps = 30
if kind == 'zeta': Z = lambda t: mp.siegelz(t)
elif kind == 'heat': Z = None
else:
    import flint
    flint.ctx.prec = 128
    c1 = flint.dirichlet_char(5, 2); c2 = flint.dirichlet_char(5, 3)
    def Z(t):
        z = flint.acb(flint.arb(mp.nstr(t, 35))); a = c1.hardy_z(z).real; b = c2.hardy_z(z).real
        return mp.mpf({'chi': a, 'chibar': b, 'dh': a + b, 'alt': a - b}[kind].mid().str(35, radius=False))
def refine(j):
    h = mp.mpf(float(min(g[j] - g[j - 1], g[j + 1] - g[j]))) / 3
    a = mp.mpf(float(g[j])) - h; b = mp.mpf(float(g[j])) + h; fa = Z(a); fb = Z(b)
    if fa * fb >= 0: return None
    for _ in range(60):
        mm = (a + b) / 2; fm = Z(mm)
        if fa * fm <= 0: b, fb = mm, fm
        else: a, fa = mm, fm
    return (a + b) / 2
LD = np.longdouble; nclosing = 0
for i in k:
    J = 4000; lo = max(0, i - J); hi = min(len(g), i + 2 + J)
    xx = (x[lo:hi].astype(LD) - LD(x[i])) / LD(lm[i])
    note = ''
    if Z is not None:
        zs = [refine(j) for j in (i - 1, i, i + 1, i + 2)]
        if all(z is not None for z in zs):
            rho = lm[i] and (x[i + 1] - x[i]) / (g[i + 1] - g[i])      # local unfolding slope
            for q, j in enumerate((i - 1, i, i + 1, i + 2)): xx[j - lo] = LD(str((zs[q] - mp.mpf(float(g[i]))) * mp.mpf(float(rho)) / mp.mpf(float(lm[i]))))
            note = '30-digit zeros %s %s %s %s' % tuple(mp.nstr(z, 18) for z in zs)
        else: note = 'no sign-change bracket for one of the zeros'
    a = xx[i - lo]; b = xx[i + 1 - lo]; gg = b - a
    oth = np.delete(xx, [i - lo, i + 1 - lo])
    B = (1 / ((a - oth) * (b - oth))).sum()
    Bt = xx[-1] + LD(0.5); At = xx[0] - LD(0.5)
    B += -(np.log((Bt - b) / (Bt - a)) + np.log((a - At) / (b - At))) / gg
    Rr = gg * gg * B / 2
    if Rr > 1:
        nclosing += 1
        print('  closing pair at %.9f: s = %.6f, neighbouring gaps %.6f %.6f (normalised), R_eff = %.6f ; %s' % (g[i], float(gg), float(xx[i - lo] - xx[i - 1 - lo]), float(xx[i + 2 - lo] - xx[i + 1 - lo]), float(Rr), note))
print('  closing close pairs: %d ; per 1e6 zeros: %.3f' % (nclosing, nclosing * 1e6 / len(g)))
