"""Kernel validation (PREREG section 7): float64 jets against independent mpmath references; Mellin identification
against the c12 battery value interface. Writes tables/validation.json."""
import json, math, os, sys
import numpy as np, mpmath as mp
import kern, objects
sys.path.insert(0, os.path.join(objects.C12, 'battery'))
mp.mp.dps = 110
rs = np.random.Generator(np.random.PCG64(136000))
res = {}

def th(x):
    return mp.jtheta(3, 0, mp.exp(-mp.pi * mp.exp(2 * x)))
def Kz(x):
    return mp.exp(x / 2) * th(x)

def ref_chi(o):
    q, d = o.q, o.d
    om = mp.mpc(complex(o.omega))
    vals = [mp.mpc(complex(v)) for v in o.vals]
    def f(x):
        x = mp.mpf(x)
        N = int(mp.sqrt(400 * q / (mp.pi * mp.exp(2 * x)))) + 3
        s = mp.mpf(0)
        for n in range(1, N + 1):
            if vals[n % q] != 0:
                s += 2 * vals[n % q] * n ** d * mp.exp(-mp.pi * n * n * mp.exp(2 * x) / q)
        return mp.conj(om) * mp.exp((mp.mpf(1) / 2 + d) * x) * s
    return f

def ref_ea(a):
    a = mp.mpc(a) if isinstance(a, complex) else mp.mpf(a)
    xis = lambda s: mp.pi ** (-s / 2) * mp.gamma(s / 2) * mp.zeta(s)
    c1, c2 = xis(1 + 2 * a), xis(2 * a)
    def f(x):
        y = mp.exp(x)
        N = int(300 / (2 * mp.pi * y)) + 3
        s = mp.mpf(0)
        for n in range(1, N + 1):
            sg = sum(mp.mpf(dv) ** (-2 * a) for dv in range(1, n + 1) if n % dv == 0)
            s += n ** a * sg * mp.besselk(a, 2 * mp.pi * n * y)
        return c1 * y ** (mp.mpf(1) / 2 + a) + c2 * y ** (mp.mpf(1) / 2 - a) + 4 * mp.sqrt(y) * s
    return f

def ref_nofe(o):
    a = o.a
    def f(x):
        N = int(mp.sqrt(400 / (mp.pi * mp.exp(2 * x)))) + 3
        s = mp.mpf(0)
        for n in range(1, N + 1):
            if a[n] != 0:
                s += (mp.mpc(complex(a[n])) if o.cplx else mp.mpf(float(a[n]))) * mp.exp(-mp.pi * n * n * mp.exp(2 * x))
        return mp.exp(x / 2) * (1 + 2 * s)
    return f

def Phi2(x):   # (D^2 - 1/4) K_zeta, closed form: (D^2 - 1/4)[2 e^(x/2) e^(-w)] = 2 (4w^2 - 6w) e^(x/2) e^(-w), w = pi n^2 e^(2x)
    N = int(mp.sqrt(300 / (mp.pi * mp.exp(2 * x)))) + 3
    return mp.fsum((8 * mp.pi ** 2 * n ** 4 * mp.exp(9 * x / 2) - 12 * mp.pi * n ** 2 * mp.exp(5 * x / 2)) * mp.exp(-mp.pi * n * n * mp.exp(2 * x)) for n in range(1, N + 1))

def ref_heat(tau):
    f = lambda v: mp.exp(mp.mpf(tau) * v * v / 4) * Phi2(v)
    mp.mp.dps = 30
    c = mp.quad(lambda v: f(v) * mp.exp(v / 2), mp.linspace(-3.2, 3.2, 33))
    def g(x):
        x = abs(mp.mpf(x))
        j1 = mp.quad(lambda v: f(v) * mp.exp(v / 2), mp.linspace(x, 3.2, 9))
        i2 = mp.quad(lambda v: f(v) * mp.exp(-v / 2), mp.linspace(x, 3.2, 9))
        return c * mp.exp(x / 2) + mp.exp(-x / 2) * j1 - mp.exp(x / 2) * i2
    return g

def compare(name, o, fref, Pd, kpol=4, k3=2, npts=6, umax=2.4, u3max=1.0, dps=110):
    """Pd: function (fref, x, k) -> reference for D^k K3."""
    mp.mp.dps = dps
    u = rs.uniform(-umax, umax, npts)
    J = o.jets(u, kpol, True)
    e1 = 0.0
    for k in range(kpol + 1):
        for i, x in enumerate(u):
            r = mp.diff(fref, mp.mpf(float(x)), k) if k else fref(mp.mpf(float(x)))
            if abs(r) > 0:
                e1 = max(e1, float(abs(mp.mpc(complex(J[k, i])) - r) / abs(r)))
    e3 = None
    if Pd is not None:
        u = rs.uniform(-u3max, u3max, npts)
        J = o.jets(u, k3, False)
        e3 = 0.0
        for k in range(k3 + 1):
            for i, x in enumerate(u):
                r = Pd(fref, mp.mpf(float(x)), k)
                if abs(r) > 0:
                    e3 = max(e3, float(abs(mp.mpc(complex(J[k, i])) - r) / abs(r)))
    res[name] = dict(max_rel_err_Kpol_jets=e1, max_rel_err_K3_jets=e3, orders=(kpol, k3), points=npts)
    print(name, res[name], flush=True)
    os.makedirs('tables', exist_ok=True)
    json.dump(res, open('tables/validation.json', 'w'), indent=1)

def P2(c):   # D^2 - c
    return lambda f, x, k: mp.diff(f, x, k + 2) - c * mp.diff(f, x, k) if k else mp.diff(f, x, 2) - c * f(x)
def P4(a):
    b1, b2 = (mp.mpf(1) / 2 + a) ** 2, (mp.mpf(1) / 2 - a) ** 2
    def g(f, x, k):
        d = lambda n: mp.diff(f, x, n) if n else f(x)
        return d(k + 4) - (b1 + b2) * d(k + 2) + b1 * b2 * d(k)
    return g
PID = lambda f, x, k: mp.diff(f, x, k) if k else f(x)

O = objects.build()
byname = {o.name: o for _, o in O}
compare('ZETA', kern.ZETA, Kz, P2(mp.mpf(1) / 4))
for nm in ('chi5.4', 'chi7.6', 'chi13.2c', 'chi11.2c'):
    compare(nm, byname[nm], ref_chi(byname[nm]), None)
ho = [o for g, o in O if g == 'PH']
compare('heldout ' + ho[-1].name, ho[-1], ref_chi(ho[-1]), None)
dh = byname['DH']
compare('DH', dh, (lambda f: (lambda x: mp.re(f(x))))(ref_chi(dh.chi)), None)
t = byname['TNR3_2.2']
compare('TNR3_2.2', t, lambda x: Kz(x + mp.log(3)) + mp.mpf('2.2') * Kz(x) + Kz(x - mp.log(3)), P2(mp.mpf(1) / 4))
compare('SGN-00', byname['SGN-00'], ref_nofe(byname['SGN-00']), P2(mp.mpf(1) / 4))
compare('U-00', byname['U-00'], ref_nofe(byname['U-00']), P2(mp.mpf(1) / 4))
compare('DEL-0.9', byname['DEL-0.9'], ref_nofe(byname['DEL-0.9']), P2(mp.mpf(1) / 4))
for w in (0.5, 3.0):
    compare('THW%.2f' % w, byname['THW%.2f' % w], (lambda w: (lambda x: Kz(x) ** w))(mp.mpf(w)), P2(mp.mpf(w) ** 2 / 4))
h = byname['HEAT-0.50']
compare('HEAT-0.50', h, ref_heat(-0.5), None, kpol=2, npts=4, dps=30)
# K3 of HEAT against the closed form
mp.mp.dps = 40
u = rs.uniform(-2.0, 2.0, 8)
J = h.jets(u, 0, False)[0]
res['HEAT-0.50 K3'] = max(float(abs(J[i] - mp.exp(mp.mpf(-0.5) * mp.mpf(float(x)) ** 2 / 4) * Phi2(mp.mpf(float(x)))) / abs(Phi2(mp.mpf(float(x))) * mp.exp(mp.mpf(-0.5) * mp.mpf(float(x)) ** 2 / 4))) for i, x in enumerate(u))
print('HEAT K3', res['HEAT-0.50 K3'])
# E*(i, 0.7) against 2 pi^-w Gamma(w) zeta(w) L(w, chi_-4)
wv = mp.mpf('0.7')
val = 2 * mp.pi ** (-wv) * mp.gamma(wv) * mp.zeta(wv) * (mp.zeta(wv, mp.mpf(1) / 4) - mp.zeta(wv, mp.mpf(3) / 4)) / 4 ** wv
res['E*(i,0.7)'] = dict(float64=float(kern.EA(0.2, 'x').jets(np.array([0.0]), 0, True)[0, 0]), closed=float(val), c12_record=-2.33099381341482)
print(res['E*(i,0.7)'])

# Mellin identification against the battery interface: int (K3 or entire K) e^(zu) du / completed(1/2+z) constant in z
import core
from flint import acb, ctx
ctx.prec = 128
ug = np.linspace(-6, 6, 240001)
def mellin(vals, z):
    return np.trapezoid(vals * np.exp(z * ug), ug)
ident = {}
zs = [0.3 + 2.0j, -0.1 + 7.5j, 0.45 + 14.0j]
def comp(obj, z):
    v = obj.completed(acb(0.5 + z.real, z.imag))
    return complex(v)
k3z = kern.ZETA.jets(ug, 0, False)[0]
ident['ZETA: int K3 e^(zu) / completed'] = [complex(mellin(k3z, z) / comp(core.Zeta(), z)) for z in zs]
kd = dh.jets(ug, 0, True)[0]
ident['DH: int K e^(zu) / completed'] = [complex(mellin(kd, z) / comp(core.DH(), z)) for z in zs]
kt = t.jets(ug, 0, False)[0]
ident['TNR(3,2.2): int K3 e^(zu) / completed'] = [complex(mellin(kt, z) / comp(core.TNR(), z)) for z in zs]
ea = byname['EA0.250']
ke = ea.jets(ug, 0, False)[0]
ident['EA-1/4: int K3 e^(zu) / completed'] = [complex(mellin(ke, z) / comp(core.EA(1, 4), z)) for z in zs]
for k, v in ident.items():
    print(k, v, 'spread', max(abs(x - v[0]) for x in v) / abs(v[0]))
res['mellin_identification'] = {k: dict(ratios=[[x.real, x.imag] for x in v], rel_spread=float(max(abs(x - v[0]) for x in v) / abs(v[0]))) for k, v in ident.items()}
os.makedirs('tables', exist_ok=True)
json.dump(res, open('tables/validation.json', 'w'), indent=1)
compare('EA0.250', byname['EA0.250'], ref_ea(0.25), P4(mp.mpf(0.25)), kpol=2, k3=0, npts=3, umax=1.2, u3max=0.6, dps=70)
compare('EIS0.20+3.00i', byname['EIS0.20+3.00i'], ref_ea(0.2 + 3j), P4(mp.mpc(0.2, 3)), kpol=2, k3=0, npts=3, umax=1.2, u3max=0.6, dps=70)
e8 = [o for g, o in O if g == 'H8']
worst = max(e8, key=lambda o: o.a.imag)
compare('heldout ' + worst.name, worst, ref_ea(worst.a), P4(mp.mpc(worst.a)), kpol=2, k3=0, npts=3, umax=1.2, u3max=0.6, dps=70)
json.dump(res, open('tables/validation.json', 'w'), indent=1)
