"""(copied from s2-derivative-zeros-two-line; s5 adds L4 = L(s, chi_-4) and L5 = L(s, quadratic character mod 5)) objects (python-flint; Arb balls used as multiprecision numbers, MEASURED).
Each object has
   plain(s)   the Dirichlet-normalised function f (accepts acb or acb_series); for HEAT: F_tau(z)/g(s) with
              g(s) = (1/2) s (s-1) pi^(-s/2) Gamma(s/2) x const, so that tau = 0 gives zeta
   comp(s)    the completed function F, symmetric under s <-> 1-s (None for LIOU)
   jp(s, n) / jc(s, n)   the first n derivatives [f, f', f'', ...] of plain / comp at the acb point s.
flib.py is copied unchanged from push/s1-antibridge-cutoff-energy (completed forms of ZETA, DH, EA, TNR; heat kernel)."""
import math
from flint import acb, arb, ctx, acb_series
import flib

def _pw(base, s): return (s * arb(base).log()).exp()
def _fact(k): return math.factorial(k)

class Obj:
    name = '?'; left_edge = 0.5       # abscissa of the symmetry line of the zero set
    def comp(self, s): return None
    def _jets(self, fn, s, n):
        x = acb_series([acb(s), 1], prec=n); y = fn(x)
        return [y[i] * _fact(i) for i in range(n)]
    def jp(self, s, n=3): return self._jets(self.plain, s, n)
    def jc(self, s, n=3): return self._jets(self.comp, s, n)

def gfac(s):
    return s * (s - 1) / 2 * _pw(arb.pi(), -s / 2) * (s / 2).gamma()

class Zeta(Obj):
    name = 'ZETA'
    def plain(self, s): return s.zeta()
    def comp(self, s): return gfac(s) * s.zeta()

class L3(Obj):
    name = 'L3'      # L(s, chi_-3)
    def plain(self, s): return (s.zeta(arb(1) / 3) - s.zeta(arb(2) / 3)) * _pw(3, -s)
    def comp(self, s): return _pw(3 / arb.pi(), (s + 1) / 2) * ((s + 1) / 2).gamma() * self.plain(s)

class L4(Obj):
    name = 'L4'
    def plain(self, s): return (s.zeta(arb(1) / 4) - s.zeta(arb(3) / 4)) * _pw(4, -s)
    def comp(self, s): return _pw(4 / arb.pi(), (s + 1) / 2) * ((s + 1) / 2).gamma() * self.plain(s)

class L5(Obj):
    name = 'L5'      # even character: gamma factor Gamma(s/2)
    def plain(self, s): return (s.zeta(arb(1) / 5) - s.zeta(arb(2) / 5) - s.zeta(arb(3) / 5) + s.zeta(arb(4) / 5)) * _pw(5, -s)
    def comp(self, s): return _pw(5 / arb.pi(), s / 2) * (s / 2).gamma() * self.plain(s)

class DH(Obj):
    name = 'DH'
    def plain(self, s):
        k = flib.kappa_dh()
        return (s.zeta(arb(1) / 5) + k * s.zeta(arb(2) / 5) - k * s.zeta(arb(3) / 5) - s.zeta(arb(4) / 5)) * _pw(5, -s)
    def comp(self, s): return _pw(5 / arb.pi(), (s + 1) / 2) * ((s + 1) / 2).gamma() * self.plain(s)

class EA(Obj):
    def __init__(self, a='0.25'): self.a = a; self.name = 'EA'
    def plain(self, s): a = arb(self.a); return (s + a).zeta() * (s - a).zeta()
    def comp(self, s): a = arb(self.a); return gfac(s + a) * (s + a).zeta() * gfac(s - a) * (s - a).zeta()

class TNR(Obj):
    name = 'TNR'
    def __init__(self, q=3, c='2.2'): self.q = q; self.c = c
    def plain(self, s):
        w = s - arb(1) / 2
        return s.zeta() * (1 + arb(self.c) * _pw(self.q, -w) + _pw(self.q, -2 * w))
    def comp(self, s):
        w = s - arb(1) / 2
        return gfac(s) * s.zeta() * (_pw(self.q, w) + arb(self.c) + _pw(self.q, -w))
    def b(self): return float(((arb(self.c) / 2).acosh() / arb(self.q).log()).mid())

class Liou(Obj):
    name = 'LIOU'; left_edge = 0.25   # zeta(2s)/zeta(s): zeros on Re s = 1/4, poles on Re s = 1/2, zero at s = 1
    def plain(self, s): return (2 * s).zeta() / s.zeta()

class Heat(Obj):
    """backward heat member F_tau; jets by trapezoid quadrature of the kernel (flib.HeatObj)."""
    def __init__(self, tau, tmax):
        self.tau = tau; self.name = 'HEAT' + tau
        self.digits = int(0.6822 * tmax / 2 + 0.6822 * tmax / 2 * 0 + 0.3411 * tmax + 45)   # e^{-pi t/4} cancellation + 45
        self.bits = int(self.digits * 3.3219) + 40
        den = int(math.ceil((math.pi * tmax / 2 + 2.303 * 45) / math.pi ** 2)) + 2             # exp(-pi^2/eta + pi t/2) < 1e-45
        ctx.prec = self.bits
        self.H = flib.HeatObj(tau, arb(1) / den, self.digits)
        H0 = flib.HeatObj('0', arb(1) / 30, 60) if tau != '0' else self.H
        z = acb(arb('0.3'), arb('2.5')); s = acb(1) / 2 + z
        self.norm = H0.taylor(z, 1)[0] / (gfac(s) * s.zeta())       # F_0 = norm * xi
    def setprec(self): ctx.prec = self.bits
    def jc(self, s, n=3):
        z = acb(s) - acb(1) / 2
        t = self.H.taylor(z, n)
        return [t[i] * _fact(i) / self.norm for i in range(n)]
    def jp(self, s, n=3):
        z = acb(s) - acb(1) / 2
        t = self.H.taylor(z, n)
        F = acb_series([c / self.norm for c in t], prec=n)
        g = gfac(acb_series([acb(s), 1], prec=n))
        y = F / g
        return [y[i] * _fact(i) for i in range(n)]

def make(name, tmax=500.0):
    if name == 'ZETA': return Zeta()
    if name == 'L3': return L3()
    if name == 'L4': return L4()
    if name == 'L5': return L5()
    if name == 'DH': return DH()
    if name == 'EA': return EA()
    if name == 'TNR': return TNR()
    if name == 'LIOU': return Liou()
    if name.startswith('HEAT'): return Heat(name[4:], tmax)
    raise KeyError(name)

def c128(v): return complex(float(v.real.mid()), float(v.imag.mid()))

if __name__ == '__main__':
    ctx.prec = 160
    s = acb(arb('0.3'), arb('37.2')); h = arb(2) ** -50
    for nm in ['ZETA', 'L3', 'DH', 'EA', 'TNR', 'LIOU']:
        o = make(nm)
        j = o.jp(s, 3)
        fd1 = (o.plain(s + h) - o.plain(s - h)) / (2 * h); fd2 = (o.plain(s + h) - 2 * o.plain(s) + o.plain(s - h)) / (h * h)
        line = '%-5s plain jets vs differences: %.1e %.1e' % (nm, float(abs(j[1] - fd1).mid()), float(abs(j[2] - fd2).mid()))
        if o.comp(s) is not None:
            a = o.comp(s); b = o.comp(1 - s)
            line += '   FE |F(s) -/+ F(1-s)|/|F| = %.1e / %.1e' % (float((abs(a - b) / abs(a)).mid()), float((abs(a + b) / abs(a)).mid()))
        print(line, flush=True)
    for tau, tm in [('-0.5', 120.0), ('0', 60.0)]:
        o = make('HEAT' + tau, tm); o.setprec()
        s = acb(arb('0.3'), arb('37.2')); h = arb(2) ** -60
        a = o.jc(s, 3); b = o.jc(1 - s, 1)
        fd = (o.jc(s + h, 1)[0] - o.jc(s - h, 1)[0]) / (2 * h)
        print('HEAT%s digits %d bits %d nodes %d  FE %.1e  jet vs difference %.1e' % (tau, o.digits, o.bits, len(o.H.K.k), float((abs(a[0] - b[0]) / abs(a[0])).mid()), float((abs(a[1] - fd) / abs(fd)).mid())), end='')
        if tau == '0':
            z = Zeta(); print('   F_0/xi - 1 = %.1e;  plain - zeta = %.1e' % (float(abs(a[0] / z.comp(s) - 1).mid()), float(abs(o.jp(s, 1)[0] - s.zeta()).mid())))
        else: print()
    # known zeros
    ctx.prec = 200
    d = make('DH'); r = acb(arb('0.80851718245663738555335196060684'), arb('85.699348485377592171929267708942'))
    print('DH at tabulated off-line zero: |f| = %.1e' % float(abs(d.plain(r)).mid()))
    o = make('HEAT-0.5', 120.0); o.setprec()
    r = acb(arb('0.5') + arb('0.24295650648697380586214604183827'), arb('111.69422767246391911622741040108'))
    v = o.jc(r, 2); print('HEAT-0.5 at tabulated off-line zero: |F/F\'| = %.1e' % float(abs(v[0] / v[1]).mid()))
