"""s5-klein-torus-shift-bridge-charts: shared objects (python-flint).  core.py and heatlib.py are copies of the battery code
(c12-control-battery-harness).  Every object exposes
   X(w)      completed function at s = 1/2 + w (even in w, real on the real axis for the objects with s <-> 1-s)
   L(w)      X'(w)/X(w)
   off       list of (b, gamma) of the first off-line zeros (b = Re rho - 1/2 > 0), [] when none is known
Codes: ZETA, LCHI4 (chi_-4), LCHI5 (real character mod 5), EA:<num>/<den>, TNR (q = 3), TNRQ (q = 1000003), DH, HEAT:<tau>,
WT (zeta(s + i alpha): completed function of zeta translated; no s <-> 1-s symmetry)."""
import math, json, os
from flint import acb, arb, ctx, acb_series
import core
from core import Obj, _zeta, _gamma, _powconst

HERE = os.path.dirname(os.path.abspath(__file__))


class LChi(Obj):
    def __init__(self, q, vals, kappa, code):
        self.q = q; self.vals = vals; self.kappa = kappa; self.code = code
    def value(self, s):
        tot = None
        for a, c in self.vals.items():
            term = _zeta(s, arb(a) / self.q) * c
            tot = term if tot is None else tot + term
        return tot * _powconst(self.q, -s)
    def completed(self, s):
        return _powconst(self.q / arb.pi(), (s + self.kappa) / 2) * _gamma((s + self.kappa) / 2) * self.value(s)


class WTc(Obj):
    """completed zeta translated by i alpha"""
    code = 'WT'
    def __init__(self): self.z = core.Zeta(); self.wt = core.WT()
    def completed(self, s): return self.z.completed(s + acb(0, 1) * self.wt.alpha())


class HeatObj(Obj):
    kind = 'kernel'
    def __init__(self, tau, tmax=400.0, bits=None):
        import heatlib
        self.tau = tau; self.code = 'HEAT:%g' % tau
        self.bits = bits or ctx.prec
        self.h = heatlib.Heat(self.bits + 64, tmax); ctx.prec = self.bits
    def XL(self, w):
        old = ctx.prec; ctx.prec = self.bits + 64
        f, d = self.h.F(self.tau, w, True); ctx.prec = old
        return f, d / f


def get(code, **kw):
    if code == 'ZETA': o = core.Zeta(); o.off = []
    elif code == 'LCHI4': o = LChi(4, {1: 1, 3: -1}, 1, code); o.off = []
    elif code == 'LCHI5': o = LChi(5, {1: 1, 2: -1, 3: -1, 4: 1}, 0, code); o.off = []
    elif code.startswith('EA:'):
        num, den = code[3:].split('/'); o = core.EA(int(num), int(den)); o.code = code
        o.off = [(int(num) / int(den), g) for g in (14.134725141734693, 21.022039638771555, 25.010857580145688)]
    elif code == 'TNR':
        o = core.TNR(); b = float(o.beta()) - 0.5
        o.off = [(b, (2 * k + 1) * math.pi / math.log(3)) for k in range(3)]
    elif code == 'TNRQ':
        o = core.TNR(q=1000003, c='2.2'); o.code = 'TNRQ'; b = float(o.beta()) - 0.5
        o.off = [(b, (2 * k + 1) * math.pi / math.log(1000003)) for k in range(3)]
    elif code == 'DH':
        o = core.DH(); z = json.load(open(os.path.join(HERE, 'zeros_DH.json')))
        o.off = [(float(r[0]) - 0.5, float(r[1])) for r in z['offline'][:12]]
    elif code.startswith('HEAT:'):
        tau = float(code[5:]); o = HeatObj(tau, **kw)
        z = json.load(open(os.path.join(HERE, 'zeros_HEAT--0.5.json'))) if abs(tau + 0.5) < 1e-12 else {'offline': []}
        o.off = [(float(r[0]), float(r[1])) for r in z['offline'][:12]]
    elif code == 'WT': o = WTc(); o.off = []
    else: raise KeyError(code)
    return o


def X(o, w):
    if isinstance(o, HeatObj): return o.XL(w)[0]
    return o.completed(acb(w) + arb(1) / 2)


def XL(o, w):
    """(X(w), X'(w)/X(w))"""
    if isinstance(o, HeatObj): return o.XL(w)
    x = acb_series([acb(w) + arb(1) / 2, 1], prec=2)
    y = o.completed(x)
    return y[0], y[1] / y[0]


# exact transport of acb midpoints between processes
def enc(z):
    z = acb(z)
    a = z.real.mid().man_exp(); b = z.imag.mid().man_exp()
    return (int(a[0]), int(a[1]), int(b[0]), int(b[1]))


def _ld(m, e):
    x = arb(m)
    return x * (arb(2) ** e) if e else x


def dec(t):
    return acb(_ld(t[0], t[1]), _ld(t[2], t[3]))
