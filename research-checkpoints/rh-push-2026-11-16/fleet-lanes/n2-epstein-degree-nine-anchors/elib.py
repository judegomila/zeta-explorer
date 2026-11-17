"""F(z,s) = exp(pi|t|/2) * E*(z,s),  E*(z,s)=pi^-s Gamma(s) (1/2) sum' y^s/|mz+n|^(2s)  (Chowla-Selberg, arb 128 bit -> complex)."""
from flint import acb, arb, ctx
import math, cmath
ctx.prec = 128
PI = math.pi

def _c(v):
    return complex(float(v.real.mid()), float(v.imag.mid()))

def Lam(s):
    return (acb(arb.pi()) ** (-s / 2)) * (s / 2).gamma() * s.zeta()

class Eis:
    def __init__(self, sigma, t, extra=40.0):
        self.sigma, self.t = sigma, t
        self.s = complex(sigma, t)
        sa = acb(sigma, t)
        self.nu_a = sa - acb(0.5)
        self.nu = complex(sigma - 0.5, t)
        self.scale = arb(PI * abs(t) / 2).exp()
        self.A = _c(Lam(2 * sa) * self.scale)       # coefficient of y^s
        self.B = _c(Lam(2 - 2 * sa) * self.scale)   # coefficient of y^(1-s)
        self.X = abs(t) * PI / 2 + extra + 4 * abs(sigma)   # Bessel argument cutoff
        nmax = int(self.X / (2 * PI * 0.8)) + 2
        self.coef = [0j] * (nmax + 1)
        for n in range(1, nmax + 1):
            sg = sum(cmath.exp(-2 * self.nu * math.log(d)) for d in range(1, n + 1) if n % d == 0)
            self.coef[n] = cmath.exp(self.nu * math.log(n)) * sg
        self.kc = {}
        self.nb = 0; self.nesc = 0

    def K(self, x):
        v = self.kc.get(x)
        if v is None:
            prec = 128
            while True:
                ctx.prec = prec
                w = acb(x).bessel_k(self.nu_a) * self.scale
                rad = max(float(w.real.rad()), float(w.imag.rad()))
                mag = abs(_c(w))
                if rad <= 1e-13 * mag + 1e-25 or prec >= 2048:
                    break
                prec *= 2
            ctx.prec = 128
            if rad > 1e-13 * mag + 1e-25:
                raise ArithmeticError("bessel precision %r %r" % (x, self.nu))
            self.nesc += prec > 128
            v = _c(w)
            self.kc[x] = v; self.nb += 1
        return v

    def F(self, x, y):
        ly = math.log(y)
        tot = self.A * cmath.exp(self.s * ly) + self.B * cmath.exp((1 - self.s) * ly)
        N = min(int(self.X / (2 * PI * y)), len(self.coef) - 1)
        acc = 0j
        for n in range(1, N + 1):
            acc += self.coef[n] * self.K(2 * PI * n * y) * math.cos(2 * PI * n * x)
        return tot + 4 * math.sqrt(y) * acc

    def Fz(self, z):
        return self.F(z.real, z.imag)

def loop_param(Y):
    """counterclockwise boundary of K_Y = {0<=x<=1/2, |z|>=1, y<=Y}; returns list of (name, func u in[0,1] -> (x,y))."""
    r3 = math.sqrt(3) / 2
    lr3, lY = math.log(r3), math.log(Y)
    segs = [
        ("arc",  lambda u: (math.sin(u * PI / 6), math.cos(u * PI / 6))),            # i -> rho
        ("half", lambda u: (0.5, math.exp(lr3 + u * (lY - lr3)))),                    # rho -> 1/2+iY
        ("top",  lambda u: (0.5 * (1 - u), Y)),                                       # -> iY
        ("imag", lambda u: (0.0, math.exp(lY * (1 - u)))),                            # iY -> i
    ]
    return segs

def winding(E, Y, n0=(24, 160, 4, 160), dmax=0.6, depth=18):
    """winding number of F along the ccw loop, adaptive in each segment. returns (W_float, min|F|/scale, details)."""
    segs = loop_param(Y)
    total = 0.0; minabs = float("inf"); mininfo = None; per = {}
    for (name, f), n in zip(segs, n0):
        us = [k / n for k in range(n + 1)]
        vals = [E.F(*f(u)) for u in us]
        acc = 0.0
        stack = [(us[k], vals[k], us[k + 1], vals[k + 1], 0) for k in range(n - 1, -1, -1)]
        while stack:
            u0, v0, u1, v1, d = stack.pop()
            dth = cmath.phase(v1 / v0) if v0 != 0 else 0.0
            if abs(dth) > dmax and d < depth:
                um = 0.5 * (u0 + u1); vm = E.F(*f(um))
                stack.append((um, vm, u1, v1, d + 1)); stack.append((u0, v0, um, vm, d + 1))
            else:
                acc += dth
                a = abs(v0)
                if a < minabs: minabs = a; mininfo = (name, u0)
        per[name] = acc
        total += acc
    return total / (2 * PI), minabs, mininfo, per
