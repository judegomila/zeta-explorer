"""Higher-precision re-check of the numbers that carry a pass/fail statement (CPU only).
For the closest pair of a list: (a) the four zeros around it are re-located at 30 digits (mpmath siegelz for zeta; flint hardy_z at 128 bits
for conductor 5 and for the Davenport-Heilbronn combination), with a sign-change certificate for the pair; (b) the window flow (beta at f = 0.5, 0.05
and t_c) is repeated in numpy longdouble (80-bit on x86) with an independent implementation.
Usage: recheck.py LIST.npy zeta|chi|chibar|dh|alt TESTS.json [N]"""
import sys, json, math, os
os.environ['RH_BACKEND'] = 'cpu'
import numpy as np, mpmath as mp
f = sys.argv[1]; kind = sys.argv[2]; tj = json.load(open(sys.argv[3]))
g = np.load(f); N = int(float(sys.argv[4])) if len(sys.argv) > 4 else len(g)
gr = np.diff(g[:N]); i = int(gr.argmin())
mp.mp.dps = 30
if kind == 'zeta':
    Z = lambda t: mp.siegelz(t)
else:
    import flint
    flint.ctx.prec = 128
    c1 = flint.dirichlet_char(5, 2); c2 = flint.dirichlet_char(5, 3)
    def Z(t):
        z = flint.acb(flint.arb(str(t)))
        a = c1.hardy_z(z).real; b = c2.hardy_z(z).real
        v = {'chi': a, 'chibar': b, 'dh': a + b, 'alt': a - b}[kind]
        return mp.mpf(v.mid().str(35, radius=False))
def refine(t0, h):
    a = mp.mpf(float(t0)) - h; b = mp.mpf(float(t0)) + h; fa = Z(a); fb = Z(b)
    assert fa * fb < 0, 'no sign change'
    for _ in range(56):
        m = (a + b) / 2; fm = Z(m)
        if fa * fm <= 0: b, fb = m, fm
        else: a, fa = m, fm
    return (a + b) / 2
h = mp.mpf(float(gr[i])) / 4
zs = [refine(g[j], min(h, mp.mpf(float(min(g[j] - g[j - 1], g[j + 1] - g[j]))) / 4)) for j in (i - 1, i, i + 1, i + 2)]
mid = (zs[1] + zs[2]) / 2
print('%s N=%d closest pair index %d: float64 list %.12f %.12f gap %.6e' % (kind, N, i, g[i], g[i + 1], gr[i]))
print('  30-digit zeros %s %s gap %s ; relative gap difference %.2e ; sign of Z left/mid/right of the pair: %+d %+d %+d' % (mp.nstr(zs[1], 20), mp.nstr(zs[2], 20), mp.nstr(zs[2] - zs[1], 12),
      float((zs[2] - zs[1]) / mp.mpf(float(gr[i])) - 1), int(mp.sign(Z(zs[1] - h))), int(mp.sign(Z(mid))), int(mp.sign(Z(zs[2] + h)))))
# (b) longdouble window flow, independent implementation
LD = np.longdouble
a = max(0, i - 1000); b = min(N, i + 1002)
x = g[a:b].astype(LD) - LD(g[i])
for k, j in enumerate((i - 1, i, i + 1, i + 2)): x[j - a] = LD(str(zs[k] - mp.mpf(float(g[i]))))
def F(x):
    D = x[:, None] - x[None, :]; np.fill_diagonal(D, np.inf); return (1 / D).sum(1)
def diag(x):
    Fv = F(x); gg = np.diff(x); return Fv, gg, (Fv[:-1] - Fv[1:] + 2 / gg) / gg
Fv, gg, B = diag(x); g0 = gg.min(); beta = B.max(); s = LD(0); snaps = {}; todo = [0.5, 0.25, 0.1, 0.05]
while True:
    gm = gg.min(); dt = LD(0.01) * gm * gm
    k1 = -2 * Fv; k2 = -2 * F(x + dt / 2 * k1); k3 = -2 * F(x + dt / 2 * k2); k4 = -2 * F(x + dt * k3)
    x = x + dt / 6 * (k1 + 2 * k2 + 2 * k3 + k4); s += dt
    Fv, gg, B = diag(x); gm = gg.min(); j = int(gg.argmin()); beta = max(beta, B.max())
    while todo and gm <= todo[0] * g0: snaps[todo.pop(0)] = float(beta)
    if gm <= 1e-3 * g0:
        R = gm * gm * B[j] / 2; tc = s + gm * gm / (8 * (1 - R)); break
row = [r for r in tj['grid'] if r['N'] == N][0]
print('  longdouble (eps %.1e) window flow, step factor 0.01: t_c = %.10e  (float64 run: %s ; pair value %.10e) ; beta(0.5) = %.8g (float64 window value %s) ; beta(0.05) = %.8g (%s)' % (
    float(np.finfo(LD).eps), float(tc), row.get('tc_local'), float(g0 * g0 / 8), snaps[0.5], (row.get('beta_local') or row.get('beta_full') or {}).get('0.5'), snaps[0.05], (row.get('beta_local') or row.get('beta_full') or {}).get('0.05')))
