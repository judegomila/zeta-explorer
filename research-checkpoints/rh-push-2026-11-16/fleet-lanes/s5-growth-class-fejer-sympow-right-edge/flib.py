"""s1-antibridge-cutoff-energy: exact (python-flint) evaluators of the even completed functions F(z), z = s - 1/2.
Objects: ZETA, CHI4 (L(s, chi_-4)), DH (Davenport-Heilbronn), EA (zeta(s+a) zeta(s-a), a = 1/4), TNR (q = 3, c = 2.2),
HEAT (tau = -0.5; kernel quadrature).  Formulas of DH, EA, TNR re-typed from push/c12-control-battery-harness/battery/core.py.
taylor(z, n) returns [F(z), F'(z), F''(z)/2, ...] (n coefficients).  Arb balls are used as multiprecision numbers."""
import math
from flint import acb, arb, ctx, acb_series, arb_poly, acb_poly

def kappa_dh():
    return ((10 - 2 * arb(5).sqrt()).sqrt() - 2) / (arb(5).sqrt() - 1)

def _pw(base, s):
    return (s * arb(base).log()).exp()

class Obj:
    name = '?'
    def comp(self, s): raise NotImplementedError
    def taylor(self, z, n=3):
        x = acb_series([acb(1) / 2 + acb(z), 1], prec=n)
        y = self.comp(x)
        return [y[i] for i in range(n)]

class Zeta(Obj):
    name = 'ZETA'
    def comp(self, s):
        return s * (s - 1) / 2 * _pw(arb.pi(), -s / 2) * (s / 2).gamma() * s.zeta()

class Chi4(Obj):
    name = 'CHI4'
    def comp(self, s):
        L = (s.zeta(arb(1) / 4) - s.zeta(arb(3) / 4)) * _pw(4, -s)
        return _pw(4 / arb.pi(), (s + 1) / 2) * ((s + 1) / 2).gamma() * L

class DH(Obj):
    name = 'DH'
    def comp(self, s):
        k = kappa_dh()
        f = (s.zeta(arb(1) / 5) + k * s.zeta(arb(2) / 5) - k * s.zeta(arb(3) / 5) - s.zeta(arb(4) / 5)) * _pw(5, -s)
        return _pw(5 / arb.pi(), (s + 1) / 2) * ((s + 1) / 2).gamma() * f

class EA(Obj):
    def __init__(self, a='0.25'):
        self.as_ = a; self.name = 'EA'
        self.z = Zeta()
    def comp(self, s):
        a = arb(self.as_)
        return self.z.comp(s + a) * self.z.comp(s - a)

class TNR(Obj):
    name = 'TNR'
    def __init__(self, q=3, c='2.2'):
        self.q = q; self.cs = c; self.z = Zeta()
    def comp(self, s):
        w = s - arb(1) / 2
        return self.z.comp(s) * (_pw(self.q, w) + arb(self.cs) + _pw(self.q, -w))
    def b(self):
        return (arb(self.cs) / 2).acosh() / arb(self.q).log()

def kappa_theta(u, coef, q, prec_digits):
    """kernel kappa(u), u >= 0 (arb), of the completed function: F(z) = int kappa(u) e^{zu/2} du.
    coef = 'zeta' or a tuple (period, list a_n for n = 1..period) for an odd self-dual periodic sequence."""
    pi = arb.pi(); y = u.exp(); s = arb(0); n = 1
    if coef == 'zeta':
        e9 = (9 * u / 4).exp(); e5 = (5 * u / 4).exp()
        while True:
            ex = pi * n * n * y
            if float(ex.mid()) > prec_digits * 2.4 + 60 and n > 1: break
            s += (2 * pi * pi * n ** 4 * e9 - 3 * pi * n * n * e5) * (-ex).exp(); n += 1
        return s        # = Phi(u/4)
    per, a = coef
    e3 = (3 * u / 4).exp()
    while True:
        ex = pi * n * n * y / q
        if float(ex.mid()) > prec_digits * 2.4 + 60 and n > 1: break
        an = a[(n - 1) % per]
        if an != 0: s += an * n * (-ex).exp()
        n += 1
    return s * e3

class Kernel:
    """kappa on the grid u_j = j*eta, j = -J..J, for one object, at ctx.prec; trapezoid rule (geometric convergence:
    kappa is analytic in |Im u| < pi/2, error ~ exp(-pi^2/eta))."""
    def __init__(self, name, eta, digits, tau=None, ea=None, tnr=None, norm=True):
        self.name = name; self.eta = arb(eta); self.digits = digits
        Umax = math.log((digits * math.log(10) + 40) / math.pi) + 0.1      # pi e^U > digits ln 10 + 40
        if name in ('CHI4',): Umax += math.log(4)
        if name in ('DH',): Umax += math.log(5)
        J = int(math.ceil(Umax / float(eta)))
        base = name if name in ('CHI4', 'DH') else 'ZETA'
        if base == 'ZETA': coef, q = 'zeta', 1
        elif base == 'CHI4': coef, q = (4, [1, 0, -1, 0]), 4
        else:
            k = kappa_dh(); coef, q = (5, [arb(1), k, -k, arb(-1), 0]), 5
        half = [kappa_theta(self.eta * j, coef, q, digits) for j in range(J + 1)]
        if name == 'HEAT':
            ta = arb(tau)
            half = [h * (ta * (self.eta * j) ** 2 / 16).exp() for j, h in enumerate(half)]
        full = half[:0:-1] + half           # index j + J
        self.J = J
        if name == 'TNR':
            q_, c_ = tnr
            sh = 2 * math.log(q_) / float(eta)
            assert abs(sh - round(sh)) < 1e-12, 'eta must divide 2 log q'
            sh = int(round(sh)); c_ = arb(c_)
            J2 = J + sh; out = [arb(0)] * (2 * J2 + 1)
            for i, v in enumerate(full):
                j = i - J
                out[j + J2] = out[j + J2] + c_ * v
                out[j + sh + J2] = out[j + sh + J2] + v
                out[j - sh + J2] = out[j - sh + J2] + v
            full = out; self.J = J2
        if name == 'EA':
            a = arb(ea)
            p1 = arb_poly([v * (a * self.eta * (i - J) / 2).exp() for i, v in enumerate(full)])
            p2 = arb_poly([v * (-a * self.eta * (i - J) / 2).exp() for i, v in enumerate(full)])
            pr = p1 * p2
            full = [pr[i] * self.eta for i in range(4 * J + 1)]; self.J = 2 * J
        self.k = full
    def F(self, z, deriv=0):
        """trapezoid value of int kappa(u) u^deriv/2^deriv e^{zu/2} du"""
        z = acb(z); s = acb(0)
        for i, v in enumerate(self.k):
            u = self.eta * (i - self.J)
            term = (z * u / 2).exp() * v
            if deriv: term = term * (u / 2) ** deriv
            s += term
        return s * self.eta

OBJ = {'ZETA': Zeta(), 'CHI4': Chi4(), 'DH': DH(), 'EA': EA('0.25'), 'TNR': TNR()}

class HeatObj(Obj):
    """F_tau by trapezoid quadrature of the kernel; taylor through moments."""
    name = 'HEAT'
    def __init__(self, tau, eta, digits):
        self.K = Kernel('HEAT', eta, digits, tau=tau)
        self.tau = tau
    def taylor(self, z, n=3):
        K = self.K; z = acb(z)
        out = [acb(0)] * n
        zh = z / 2
        for i, v in enumerate(K.k):
            j = i - K.J
            if j < 0: continue
            u = K.eta * j
            sh, ch = (zh * u).sinh_cosh()
            w = v * (1 if j == 0 else 2)
            hu = u / 2; p = arb(1); f = 1
            for m in range(n):
                out[m] = out[m] + w * p * (ch if m % 2 == 0 else sh) / f
                p = p * hu; f *= (m + 1)
        return [o * K.eta for o in out]
