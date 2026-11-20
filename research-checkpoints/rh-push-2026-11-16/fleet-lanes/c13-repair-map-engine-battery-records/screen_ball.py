"""Corrected record for c11-rs3-debranges-positivity-family/screen.json: every window of screen.py recomputed in ball arithmetic
(python-flint), with converged ordinates. Independent of the battery: own zero finder (scan at the record's step with ball-certified
signs, Newton on midpoints, then a certified sign change in [t - 1e-45, t + 1e-45]); DH in the record's character form
(L(s,chi), chi mod 5), not the coefficient form of battery/core.py.  q_h(rho) = -Re{X'(rho) X(rho+h)}/(|X'(rho)||X(rho+h)|).
Usage: python screen_ball.py <out.json>"""
import sys, json, time
from flint import acb, arb, ctx, acb_series
ctx.prec = 320
I = acb(0, 1)
def pw(base, s): return (s * arb(base).log()).exp()
def gfac(s): return s * (s - 1) * pw(arb.pi(), -s / 2) * (s / 2).gamma()
def xi(s): return gfac(s) * s.zeta()
def gam(s): return gfac(s) + gfac(1 - s)
def kap(): return ((10 - 2 * arb(5).sqrt()).sqrt() - 2) / (arb(5).sqrt() - 1)
CHI = [None, acb(1), acb(0, 1), acb(0, -1), acb(-1)]
def Lchi(s, conj=False):
    tot = 0
    for a in range(1, 5):
        c = CHI[a].conjugate() if conj else CHI[a]
        tot = tot + c * s.zeta(arb(a) / 5)
    return tot * pw(5, -s)
def dh(s):
    k = kap()
    f = (1 - I * k) / 2 * Lchi(s) + (1 + I * k) / 2 * Lchi(s, True)
    return pw(5 / arb.pi(), s / 2) * ((s + 1) / 2).gamma() * f
def val_der(X, s):
    y = X(acb_series([acb(s), 1], prec=2)); return y[0], y[1]
def line(X, t):
    """real value of X(1/2+it) and d/dt; the imaginary part must contain 0"""
    v, d = val_der(X, acb(arb(1) / 2, t))
    return v.real, (I * d).real, v
def sgn(x):
    if x > 0: return 1
    if x < 0: return -1
    return 0
def q(X, t, h):
    rho = acb(arb(1) / 2, t)
    _, d = val_der(X, rho); v = X(rho + arb(h))
    return -(d * v).real / (abs(d) * abs(v))
EPS = arb(10) ** -45
def refine(X, a, b):
    t = (a + b) / 2
    for it in range(80):
        f, d, _ = line(X, t)
        tn = arb((t - f / d).mid())
        if not (tn > a and tn < b): raise RuntimeError('Newton left the bracket %s %s' % (a, b))
        done = abs(tn - t) < EPS / 1000
        t = tn
        if done: break
    lo, hi = t - EPS, t + EPS
    sl, sh = sgn(line(X, lo)[0]), sgn(line(X, hi)[0])
    if sl * sh != -1: raise RuntimeError('sign change not certified at %s' % t)
    return lo.union(hi), it
def zeros_on_line(X, a, b, step):
    """the record's scan: t_k = a + k step while t_k < b; brackets where the sign changes"""
    zs = []; k = 0; t = arb(a); f0 = sgn(line(X, t)[0]); und = 0; nit = 0
    st = arb(step)
    while t < b:
        t1 = arb(a) + st * (k + 1); f1 = sgn(line(X, t1)[0])
        if f0 == 0 or f1 == 0: und += 1
        if f0 * f1 < 0:
            z, it = refine(X, t, t1); zs.append(z); nit = max(nit, it)
        t, f0 = t1, f1; k += 1
    return zs, und, nit
HS = ['0.1', '0.25', '0.5', '1', '2', '4']; KEY = {'0.1': '0.1', '0.25': '0.25', '0.5': '0.5', '1': '1.0', '2': '2.0', '4': '4.0'}
def window(X, zs):
    fails = {KEY[h]: 0 for h in HS}; mn = {KEY[h]: None for h in HS}; ball = {KEY[h]: None for h in HS}; und = 0; realdef = arb(0)
    for z in zs:
        v0 = X(acb(arb(1) / 2, z))
        for h in HS:
            v = q(X, z, h)
            if v < 0: fails[KEY[h]] += 1
            elif not (v > 0): und += 1
            if mn[KEY[h]] is None or v.mid() < mn[KEY[h]]: mn[KEY[h]] = v.mid(); ball[KEY[h]] = v
    return dict(fails=fails, min_q={k: float(v) for k, v in mn.items()}, min_q_ball={k: v.str(25) for k, v in ball.items()}, undecided_signs=und)
out = dict(note='corrected record; ball arithmetic at %d bits; ordinates enclosed in intervals of width 2e-45 with a certified sign change; '
                'supersedes the DH and GAM windows of c11-rs3-debranges-positivity-family/screen.json (mpmath findroot, unconverged above height 1000)' % ctx.prec)
T0 = time.time()
r34 = acb.zeta_zeros(34, 1)[0]
v, d = val_der(xi, r34)
out['CL_3.2'] = (-(d * xi(r34 + 1)).real).str(30)
out['CL_3.4'] = (xi(acb(1, 282)) / xi(acb(2, 282))).real.str(30)
print(out['CL_3.2'], out['CL_3.4'], flush=True)
res = {}
for name, (n0, n1) in {'n1-100': (1, 100), 'n620-680(t~1000)': (620, 680), 'n10112-10172(t~1e4)': (10112, 10172)}.items():
    zs = [z.imag for z in acb.zeta_zeros(n0, n1 - n0 + 1)]
    w = window(xi, zs); w = dict(N=len(zs), t=[float(zs[0].mid()), float(zs[-1].mid())], **w); res[name] = w
    print('zeta', name, w, '%.0f s' % (time.time() - T0), flush=True)
out['zeta'] = res
res = {}
for name, (a, b, st) in {'t10-200': (10, 200, '0.2'), 't1000-1040': (1000, 1040, '0.1'), 't10000-10030': (10000, 10030, '0.05')}.items():
    zs, und, nit = zeros_on_line(gam, a, b, st)
    w = window(gam, zs); w = dict(N=len(zs), scan_undetermined=und, newton_iterations_max=nit, ordinates=[z.mid().str(40, radius=False) for z in zs], **w); res[name] = w
    print('GAM', name, {k: v for k, v in w.items() if k != 'ordinates'}, '%.0f s' % (time.time() - T0), flush=True)
out['GAM'] = res
res = {}
for name, (a, b, st) in {'t0-200': (1, 200, '0.05'), 't1000-1020': (1000, 1020, '0.03'), 't10000-10008': (10000, 10008, '0.02')}.items():
    zs, und, nit = zeros_on_line(dh, a, b, st)
    w = window(dh, zs); w = dict(N_online=len(zs), scan_undetermined=und, newton_iterations_max=nit, ordinates=[z.mid().str(40, radius=False) for z in zs], **w); res[name] = w
    print('DH', name, {k: v for k, v in w.items() if k != 'ordinates'}, '%.0f s' % (time.time() - T0), flush=True)
out['DH'] = res
out['DH_offline'] = []
for zr, zi in (('0.8085171825', '85.6993484854'), ('0.6508300806', '114.1633427308')):
    z = acb(arb(zr), arb(zi))
    for it in range(30):
        f, d = val_der(dh, z); dz = f / d
        z = acb(z.real.mid(), z.imag.mid()) - acb(dz.real.mid(), dz.imag.mid())
        if abs(dz) < arb(10) ** -60: break
    f, d = val_der(dh, z)
    out['DH_offline'].append(dict(record_point='(%s + %sj)' % (zr, zi), converged_zero=[z.real.str(40, radius=False), z.imag.str(40, radius=False)], newton_residual=float((abs(f) / abs(d)).upper())))
json.dump(out, open(sys.argv[1], 'w'), indent=1)
print('done %.0f s' % (time.time() - T0))
