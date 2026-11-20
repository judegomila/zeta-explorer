"""Direct evaluation (float64 complex, Bessel values from arb) of f = E*(z, w), of T_m Lambda^T f from the
definitions, and two-dimensional quadrature of Gram matrices over F and over the strip y > 1.
Independent of amp.py: no Maass-Selberg relation, no unfolding, no incomplete beta is used here.
Largest array: (#functions) x (#x-nodes per y) complex128, well below 100 MB."""
import math, cmath
import numpy as np
from flint import acb, arb, ctx, fmpq
from math import gcd

def xi_c(s):
    ctx.prec = 200
    S = acb(s.real, s.imag)
    v = (acb.pi() ** (-S / 2)) * (S / 2).gamma() * S.zeta()
    return complex(v)

def divisors(m):
    return [a for a in range(1, m + 1) if m % a == 0]

class F:
    """f = E*(z, w), w = s/2. scale: everything is multiplied by exp(pi*|Im w|/2) to keep numbers O(1)."""
    def __init__(self, s, zero=False, sarb=None):
        self.s = complex(s); self.w = self.s / 2; self.nu = self.w - 0.5
        self.sarb = sarb if sarb is not None else acb(self.s.real, self.s.imag)
        ctx.prec = 200
        self.scale = math.exp(math.pi * abs(self.w.imag) / 2)
        S = self.sarb
        xiS = (acb.pi() ** (-S / 2)) * (S / 2).gamma() * S.zeta()
        S2 = 2 - S
        xiS2 = (acb.pi() ** (-S2 / 2)) * (S2 / 2).gamma() * S2.zeta()
        self.A = 0j if zero else complex(xiS) * self.scale
        self.B = complex(xiS2) * self.scale
        self.nmax = int((abs(self.w.imag) + 45) / (2 * math.pi * 0.86)) + 2
        self.tau = np.array([sum((a * a / n) ** self.nu for a in divisors(n)) for n in range(1, self.nmax + 1)])
        self.nuarb = self.sarb / 2 - acb(1) / 2
        self._k = {}

    def lam(self, m):
        return sum((a * a / m) ** self.nu for a in divisors(m))

    def K(self, y):
        """array over n=1..nmax of scale*K_nu(2 pi n y) (complex)."""
        v = self._k.get(y)
        if v is None:
            ctx.prec = 160
            Y = arb(y)
            sc = arb(self.scale)
            v = np.array([complex((2 * acb.pi() * n * Y).bessel_k(self.nuarb) * sc) for n in range(1, self.nmax + 1)])
            if len(self._k) < 200000: self._k[y] = v
        return v

    def c0(self, y):
        return self.A * y ** self.w + self.B * y ** (1 - self.w)

    def nonconst(self, x, y):
        """non-constant part at points (x array, scalar y)."""
        k = self.K(y) * self.tau
        n = np.arange(1, self.nmax + 1)
        return 4 * math.sqrt(y) * (np.cos(2 * math.pi * np.outer(np.atleast_1d(x), n)) @ k)

    def f(self, x, y):
        return self.c0(y) + self.nonconst(x, y)

def reduce_to_F(z):
    """returns z' in F equivalent to z (float)."""
    x, y = z.real, z.imag
    for _ in range(100000):
        x = x - round(x)
        if x * x + y * y < 1 - 1e-15:
            d = x * x + y * y
            x, y = -x / d, y / d
        else:
            break
    return complex(x, y)

def trunc_f_at(Fo, z, T):
    """(Lambda^T f)(z) for T >= 1 at an arbitrary point of the upper half plane, by automorphy."""
    zr = reduce_to_F(z)
    v = Fo.f(zr.real, zr.imag)[0]
    if zr.imag > T:
        v -= Fo.c0(zr.imag)
    return v

def hecke_def(Fo, z, T, m):
    """T_m Lambda^T f (z) from the definition."""
    tot = 0j
    for a in divisors(m):
        d = m // a
        for b in range(d):
            tot += trunc_f_at(Fo, (a * z + b) / d, T)
    return tot / math.sqrt(m)

def cosets(hmin, ymin, xmax=0.5):
    """all (c, d), c >= 1, gcd = 1, for which {Im g z > hmin} meets {y >= ymin, |x| <= xmax}."""
    out = []
    c = 1
    while c * c * hmin * ymin < 1:
        r = 1.0 / (2 * c * c * hmin)             # horodisc radius, centre (-d/c, r)
        dmax = int(c * (xmax + r)) + 1
        for d in range(-dmax, dmax + 1):
            if gcd(c, abs(d)) == 1:
                out.append((c, d))
        c += 1
    return out

def pieces_for(Fo, T, m):
    """list of (h, kappa, exponent) : Psi_m = sum kappa y^e 1_(y>h)."""
    out = []
    for a in divisors(m):
        d = m // a
        h = T * d / a
        r = (a / d) ** Fo.nu
        if Fo.A != 0: out.append((h, r * Fo.A, Fo.w))
        out.append((h, Fo.B / r, 1 - Fo.w))
    return out

def hecke_formula(Fo, x, y, T, m, cos_list):
    """lambda(m) f - E(z | Psi_m) at points (x array, y scalar), z in a region where cos_list is complete."""
    x = np.atleast_1d(x)
    val = Fo.lam(m) * Fo.f(x, y)
    pcs = pieces_for(Fo, T, m)
    us = [np.full_like(x, y)] + [y / ((c * x + d) ** 2 + (c * y) ** 2) for (c, d) in cos_list]
    for u in us:
        lu = np.log(u)
        for (h, kap, e) in pcs:
            val = val - np.where(u > h, kap * np.exp(e * lu), 0)
    return val

# ---------------- quadrature ----------------
def gl(n):
    return np.polynomial.legendre.leggauss(n)

_GLX = gl(20)

def tanh_sinh(n=40, hstep=None):
    """nodes/weights on (-1, 1), double exponential; returns also 1-|x| accurately."""
    hstep = hstep or 3.2 / n
    k = np.arange(-n, n + 1)
    t = k * hstep
    u = 0.5 * math.pi * np.sinh(t)
    xk = np.tanh(u)
    wk = hstep * 0.5 * math.pi * np.cosh(t) / np.cosh(u) ** 2
    om = 1 / (np.exp(np.abs(u)) * np.cosh(u))     # 1 - abs(x)
    return xk, wk, om

def circ_intersections(c1, c2):
    """y-coordinates of the intersections of two circles ((x0, y0), r)."""
    (x1, y1, r1), (x2, y2, r2) = c1, c2
    dx, dy = x2 - x1, y2 - y1
    d = math.hypot(dx, dy)
    if d == 0 or d >= r1 + r2 or d <= abs(r1 - r2): return []
    a = (r1 * r1 - r2 * r2 + d * d) / (2 * d)
    hh = r1 * r1 - a * a
    if hh <= 0: return []
    hh = math.sqrt(hh)
    ym = y1 + a * dy / d
    return [ym + hh * dx / d, ym - hh * dx / d]

def gram_region(Fo, funcs_builder, heights, ylo, yhi, below_arc=True, nts=36, maxw=0.11, verbose=False):
    """Gram matrix int f_i conj(f_j) dx dy / y^2 over {|x| <= 1/2, ylo < y < yhi} intersected with |z| >= 1.
    funcs_builder(x, y, cos_list) -> array (nfun, len(x)).
    heights: all thresholds h used by the functions (to locate discontinuities)."""
    hmin = min(heights)
    cl = cosets(hmin, ylo, xmax=0.5)
    # circles: boundary of {Im g z > h} = centre (-d/c, r), r = 1/(2 c^2 h)
    circs = []
    for h in sorted(set(heights)):
        for (c, d) in cl:
            r = 1.0 / (2 * c * c * h)
            if 2 * r > ylo and abs(-d / c) - r < 0.5 + 1.0:      # keep those within one period of the strip
                circs.append((-d / c, r, r, c, d, h))
    crit = {ylo, yhi}
    for h in set(heights):
        if ylo < h < yhi: crit.add(h)
    geo = [(x0, y0, r) for (x0, y0, r, c, d, h) in circs]
    for (x0, y0, r) in geo:
        if ylo < 2 * r < yhi: crit.add(2 * r)
    allg = geo + ([(0.0, 0.0, 1.0)] if ylo < 1 else [])
    for i in range(len(allg)):
        for j in range(i + 1, len(allg)):
            for yy in circ_intersections(allg[i], allg[j]):
                if ylo < yy < yhi: crit.add(yy)
    if ylo < 1 < yhi: crit.add(1.0)
    crit = sorted(crit)
    # merge near-duplicates
    cr = [crit[0]]
    for v in crit[1:]:
        if v - cr[-1] > 1e-12: cr.append(v)
    crit = cr
    xk, wk, om = tanh_sinh(nts)
    gx, gw = _GLX
    G = None
    npts = 0
    for pa, pb in zip(crit[:-1], crit[1:]):
        half = 0.5 * (pb - pa)
        for k in range(len(xk)):
            # accurate node position near the ends
            if xk[k] >= 0: y = pb - half * om[k]
            else: y = pa + half * om[k]
            if not (pa < y < pb): continue
            wy = wk[k] * half / (y * y)
            if wy < 1e-300: continue
            # x breakpoints
            bps = [-0.5, 0.5]
            for (x0, y0, r, c, d, h) in circs:
                q = r * r - (y - y0) ** 2
                if q > 0:
                    sq = math.sqrt(q)
                    for xb in (x0 - sq, x0 + sq):
                        if -0.5 < xb < 0.5: bps.append(xb)
            xa = 0.0
            if y < 1:
                xa = math.sqrt(1 - y * y)
                bps += [-xa, xa]
            bps = sorted(bps)
            xs = []; ws = []
            for a, b in zip(bps[:-1], bps[1:]):
                if b - a < 1e-15: continue
                mid = 0.5 * (a + b)
                if y < 1 and abs(mid) < xa: continue          # below the arc: outside F
                nsub = max(1, int(math.ceil((b - a) / maxw)))
                edges = np.linspace(a, b, nsub + 1)
                for e0, e1 in zip(edges[:-1], edges[1:]):
                    xs.append(0.5 * (e0 + e1) + 0.5 * (e1 - e0) * gx)
                    ws.append(0.5 * (e1 - e0) * gw)
            if not xs: continue
            xs = np.concatenate(xs); ws = np.concatenate(ws)
            vals = funcs_builder(xs, y, cl)
            npts += len(xs)
            contrib = (vals * ws) @ vals.conj().T * wy
            G = contrib if G is None else G + contrib
    if verbose: print("   crit", [round(c, 6) for c in crit][:40]); print("   gram_region: panels", len(crit) - 1, "circles", len(circs), "cosets", len(cl), "points", npts, flush=True)
    return G

def J_tail(Fo, Y, nu_cut=None):
    """L(Y) = 8 sum_n |tau(n)|^2 int_(2 pi n Y)^inf |K|^2 du/u (scaled by scale^2), by Gauss-Legendre panels."""
    gx, gw = gl(40)
    tot = 0.0
    ctx.prec = 160
    sc = arb(Fo.scale)
    t0 = abs(Fo.w.imag)
    for n in range(1, Fo.nmax + 1):
        a = 2 * math.pi * n * Y
        top = max(a, t0) + 60
        edges = np.linspace(a, top, int((top - a) / 1.5) + 2)
        s = 0.0
        for e0, e1 in zip(edges[:-1], edges[1:]):
            u = 0.5 * (e0 + e1) + 0.5 * (e1 - e0) * gx
            kv = np.array([abs(complex(acb(float(uu)).bessel_k(Fo.nuarb) * sc)) ** 2 for uu in u])
            s += float(np.sum(0.5 * (e1 - e0) * gw * kv / u))
        tot += 8 * abs(Fo.tau[n - 1]) ** 2 * s
    return tot
