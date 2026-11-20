"""Lane s6: Jensen polynomials and their heat images from the moment tables of mom.py.
F(X) = sum_k c_k X^k with X = z^2, F(z^2) = Xi(-i z) = xi-type function at s = 1/2 + z;  gamma(k) = k! c_k.
J^{d,n}(X) = sum_j binom(d, j) gamma(n + j) X^j.   heatOp_t p = sum_k (-t)^k p^(2k) / k!."""
import pickle, math
from flint import arb, acb, arb_poly, acb_poly, ctx, fmpz

class Tables:
    def __init__(self, fn, rad_bits=None):
        d = pickle.load(open(fn, 'rb')); self.prec = d['prec']; self.t = d['tables']; self.jmax = d['jmax']
        self.rad_bits = rad_bits if rad_bits is not None else self.prec - 40
        self.v1 = d.get('kversion', 1) == 1
    def arbs(self, key):
        """entries as arb balls.  Radius: 2^-(prec-8) relative, or, for tables made with version 1 of mom.K (absolute cut of the theta
        sum at v_cut), the truncated tail of the moment integral: exp(g(v_cut) - max g) * 2^20 relative, g(v) = j log v - pi e^{2v}/q + 4.5 v + weight."""
        sc = arb(2) ** (-self.prec); tab = self.t[key]
        obj, kind, par = key.split('|'); num, den = par.split('/'); par = int(num) / int(den)
        q = {'ZETA': 1, 'L4': 4, 'L5': 5, 'DH': 5, 'L3': 3}[obj]
        lim = (self.prec + 104) * math.log(2) + 60; vcut = 0.5 * math.log(lim * q / math.pi)
        out = []
        vs = [0.02 * i for i in range(1, int(vcut / 0.02) + 2)]
        for m, v in enumerate(tab):
            x = arb(fmpz(v)) * sc
            rel = 2.0 ** (-(self.prec - 8)); lr = -(self.prec - 8) * math.log(2)
            if self.v1:
                j = 2 * m if kind == 'heat' else m
                def g(u): return j * math.log(u) - math.pi * math.exp(2 * u) / q + 4.5 * u + (par * u * u / 4 if kind == 'heat' else abs(par) * u)
                gm = max(g(u) for u in vs); lr = max(lr, g(vcut) - gm + 20 * math.log(2))
            if v != 0:
                e = int(lr / math.log(2)) + 1
                x = x + arb(0, 1) * abs(x.mid() if hasattr(x, 'mid') else x) * (arb(2) ** e)
            out.append(x)
        return out
    def series(self, obj):
        """coefficients c_k of X^k (arb list), X = z^2.  obj: ZETA, L4, L5, DH, HEAT:<num>/<den>, EA:<num>/<den>,
        TNR:<q>:<c>, PLANT:<base>:<g>:<b> (base times (1 + X/rho^2)(1 + X/conj rho^2), rho = g + i b in the w variable),
        SHIFTED variants are built by the callers."""
        p = obj.split(':')
        if p[0] in ('ZETA', 'L4', 'L5', 'DH', 'L3'):
            M = self.arbs('%s|heat|0/1' % p[0]); return self._even(M)
        if p[0] == 'HEAT':
            return self._even(self.arbs('ZETA|heat|%s' % p[1]))
        if p[0] == 'EA':
            m = self.arbs('ZETA|tilt|%s' % p[1])
            f = arb(1); P = []
            for j, v in enumerate(m):
                if j: f *= j
                P.append(v / f)
            A = arb_poly(P); B = arb_poly([(-1) ** j * v for j, v in enumerate(P)])
            n = len(P); C = A.mul_low(B, n) if hasattr(A, 'mul_low') else (A * B)
            return [C[2 * k] for k in range(n // 2)]
        if p[0] == 'TNR':
            q = arb(p[1]); c = arb(p[2]); base = self.series('ZETA'); n = len(base); lq2 = q.log() ** 2
            ch = []; f = arb(1); pw = arb(1)
            for k in range(n):
                if k: f *= (2 * k - 1) * (2 * k); pw *= lq2
                ch.append(2 * pw / f)
            ch[0] += c
            C = arb_poly(base) * arb_poly(ch)
            return [C[k] for k in range(n)]
        if p[0] == 'PLANT':
            base = self.series(':'.join(p[1:-2])); g = arb(p[-2]); b = arb(p[-1]); rho = acb(g, b)
            a1 = 2 * (1 / rho ** 2).real; a2 = 1 / (rho.abs_lower() ** 4) if False else 1 / ((g * g + b * b) ** 2)
            n = len(base)
            return [base[k] + (a1 * base[k - 1] if k >= 1 else 0) + (a2 * base[k - 2] if k >= 2 else 0) for k in range(n)]
        if p[0] == 'PLANTH':
            # PLANTH:<base>:<g>:<b>:<g1>:<g2>: the pair replaces the two on-line zeros g1, g2 of the base (division by (1 + X/g1^2)(1 + X/g2^2))
            c = self.series('PLANT:' + ':'.join(p[1:-2]))
            base = self.series(':'.join(p[1:-4]))
            for gz in p[-2:]:
                X = -arb(gz) ** 2
                for _ in range(40):          # Newton on the base series: the on-line zero to the precision of the table
                    f = arb(0); fp = arb(0)
                    for v in reversed(base): fp = fp * X + f; f = f * X + v
                    X = arb((X - f / fp).mid())
                r = -1 / X; out = []; prev = arb(0)
                for k in range(len(c)):
                    prev = c[k] - prev * r; out.append(prev)
                c = out
            return c[:len(c) - 200]
        raise ValueError(obj)
    def _even(self, M):
        out = []; f = arb(1)
        for k, v in enumerate(M):
            if k: f *= (2 * k - 1) * (2 * k)
            out.append(v / f)
        return out

def gammas(c):
    out = []; f = arb(1)
    for k, v in enumerate(c):
        if k: f *= k
        out.append(v * f)
    return out

def jensen(gam, d, n):
    """normalised Jensen polynomial in Y = X / s, s = gamma(n)/gamma(n+1): coefficients a_j = binom(d,j) gamma(n+j) s^j / gamma(n)."""
    s = gam[n] / gam[n + 1]; a = []; b = arb(1); sp = arb(1)
    for j in range(d + 1):
        if j: b = b * (d - j + 1) / j; sp *= s
        a.append(b * gam[n + j] * sp / gam[n])
    return a, s

def heat_poly(a, t):
    """e^{-t D^2} applied to the coefficient list a"""
    d = len(a) - 1; out = [arb(0)] * (d + 1); out = list(out)
    # coefficient of Y^m: sum_k (-t)^k/k! a_{m+2k} (m+2k)!/m!
    for m in range(d + 1):
        s = arb(0); term = arb(1); k = 0
        while m + 2 * k <= d:
            if k: term = term * (-t) / k * (m + 2 * k) * (m + 2 * k - 1)
            s += term * a[m + 2 * k]; k += 1
        out[m] = s
    return out

def real_root_count(a, precs=(700, 2400, None)):
    """(number of real roots, degree, certified flag) of the real polynomial with arb coefficients a.
    Roots are isolated in disjoint balls by acb_poly.roots (working precision raised along precs; None = precision of the table);
    a ball that meets the real axis and whose mirror image meets no other ball holds a real root."""
    full = ctx.prec; d = len(a) - 1; r = None
    for pr in precs:
        ctx.prec = min(full, pr) if pr else full
        try:
            p = acb_poly([acb(x) for x in a]); r = p.roots(); break
        except Exception as e:
            r = None
    ctx.prec = full
    if r is None: return None, d, False
    real = [z for z in r if z.imag.contains(0)]
    cert = True
    if real:
        rs = sorted(real, key=lambda z: float(z.real.mid()))
        for i in range(len(rs) - 1):
            if rs[i].real.overlaps(rs[i + 1].real): cert = False
        nonreal = [z for z in r if not z.imag.contains(0)]
        for z in real:
            zc = z.conjugate()
            for u in nonreal:
                if zc.overlaps(u): cert = False; break
    return len(real), d, cert

def tstar(a, e0=-12, steps=8):
    """least t >= 0 (in the normalised variable Y) with e^{-t D^2} a real-rooted; bisection on the real-root count
    (monotone in t: Polya-Schur / node poly-de-bruijn-heatop-lean).  Returns (tstar or 0.0, bracket, count at t = 0, certified flag at t = 0)."""
    d = len(a) - 1
    c0, _, cert0 = real_root_count(a)
    if c0 == d: return 0.0, (0.0, 0.0), c0, cert0
    ok = lambda e: real_root_count(heat_poly(a, arb(2) ** e))[0] == d
    e = e0
    if ok(e):
        while e > -200 and ok(e - 2): e -= 2
        hi = e; lo = e - 2
    else:
        while e < 60 and not ok(e + 2): e += 2
        if e >= 60: return float('inf'), (None, None), c0, cert0
        lo = e; hi = e + 2
    lo_t = 2.0 ** lo; hi_t = 2.0 ** hi
    for _ in range(steps):
        mid = math.sqrt(lo_t * hi_t)
        if real_root_count(heat_poly(a, arb(mid)))[0] == d: hi_t = mid
        else: lo_t = mid
    return hi_t, (lo_t, hi_t), c0, cert0
