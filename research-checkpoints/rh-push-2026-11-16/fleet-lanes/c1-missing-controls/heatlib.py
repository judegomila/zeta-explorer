"""Backward heat family F_tau(z) = int e^{tau u^2/16} kappa(u) e^{zu/2} du = 2 int_0^inf e^{tau u^2/16} kappa(u) cosh(zu/2) du,
   kappa(u) = Phi(u/4), Phi(v) = sum_n (2 pi^2 n^4 e^{9v} - 3 pi n^2 e^{5v}) exp(-pi n^2 e^{4v})   (de Bruijn-Newman H_tau, x = -2iz).
   F_0(z) = xi(1/2+z)/2 up to the constant checked in validate().  Composite Gauss-Legendre in python-flint (arb used as
   multiprecision floats; MEASURED, not an interval certificate: the quadrature truncation error is not enclosed)."""
from flint import arb, acb, ctx
import math

class Heat:
    def __init__(self, bits, tmax, panel=0.05, digits=None):
        ctx.prec = bits
        digits = digits or int(bits * 0.30103) - 15
        # Umax: pi e^U > digits*ln10 + margin
        self.Umax = math.log((digits * math.log(10) + 40) / math.pi) + 0.1
        npan = int(math.ceil(self.Umax / panel)); self.panel = self.Umax / npan
        wa = tmax / 2 * self.panel / 2          # (frequency) x (half width)
        m = 8
        while True:   # GL error model (e*wa/(2m))^(2m) < 10^-digits, and geometric rate >= 16 from analyticity
            if m > math.e * wa / 2 and 2 * m * math.log10(2 * m / (math.e * wa + 1e-9)) > digits and 2 * m * math.log10(16) > digits: break
            m += 4
        self.m = m; self.npan = npan
        print('Heat quad: bits %d digits %d Umax %.3f panels %d nodes/panel %d total nodes %d (planned memory ~ %.1f MB)'
              % (bits, digits, self.Umax, npan, m, npan * m, npan * m * (bits / 8 + 100) * 4 / 1e6), flush=True)
        base = [arb.legendre_p_root(m, k, weight=True) for k in range(m)]
        h = arb(self.panel) / 2
        self.u = []; self.w = []
        for p in range(npan):
            c = arb(self.panel) * p + h
            for x, w in base:
                self.u.append(c + h * x); self.w.append(h * w)
        pi = arb.pi()
        self.kw = []
        for u, w in zip(self.u, self.w):
            v = u / 4; e4 = (4 * v).exp(); e5 = (5 * v).exp(); e9 = (9 * v).exp(); s = arb(0)
            n = 1
            while True:
                ex = pi * n * n * e4
                if float(ex.mid()) > digits * 2.4 + 60 and n > 1: break
                s += (2 * pi * pi * n ** 4 * e9 - 3 * pi * n * n * e5) * (-ex).exp(); n += 1
            self.kw.append(2 * s * w)
        self.gw = {}
    def weights(self, tau):
        if tau not in self.gw:
            ta = arb(tau)
            self.gw[tau] = [k * (ta * u * u / 16).exp() for k, u in zip(self.kw, self.u)]
        return self.gw[tau]
    def Freal_axis(self, tau, t):
        """F_tau(i t), real"""
        g = self.weights(tau); th = arb(t) / 2; s = arb(0)
        for gk, u in zip(g, self.u): s += gk * (th * u).cos()
        return s
    def F(self, tau, z, deriv=False):
        g = self.weights(tau); zh = acb(z) / 2; s = acb(0); d = acb(0)
        for gk, u in zip(g, self.u):
            sh, ch = (zh * u).sinh_cosh()
            s += gk * ch
            if deriv: d += gk * u * sh
        return (s, d / 2) if deriv else s
    def newton(self, tau, z, it=40):
        z = acb(z)
        for _ in range(it):
            f, d = self.F(tau, z, True); dz = f / d; z = acb(z.real.mid(), z.imag.mid()) - acb(dz.real.mid(), dz.imag.mid())
            if float(abs(dz).mid()) < 1e-25 * max(1.0, float(abs(z).mid())): break
        return z, float(abs(dz).mid())

def xi(z):
    s = acb(1) / 2 + acb(z)
    return s * (s - 1) / 2 * acb.pi() ** (-s / 2) * (s / 2).gamma() * s.zeta()
