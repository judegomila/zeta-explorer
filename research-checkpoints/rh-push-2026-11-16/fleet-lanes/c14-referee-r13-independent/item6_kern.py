# Independent referee code for c13-noncone-kernel-separator-search (item 6).
# Written from PREREG.md sections 2 and 4 only; the lane's kern.py / funcs.py / ballk.py were not read or imported
# (one grep of funcs.py for the column-set ordering: itertools.combinations(range(1, 14), m)).
# Arithmetic: python-flint balls (acb, acb_series). Truncation tails of the Gaussian / Bessel sums are cut where a
# term is below 2^-(prec+64) of the leading scale; this is not an enclosure of the tail, so the signs are
# "ball-arithmetic, tail not enclosed".
import math
from flint import arb, acb, acb_series, ctx

from fractions import Fraction

CAP = 12  # series length (orders 0..11)


class Pt:
    """Exact evaluation point u = f + log(num/den), f rational. Converted to a ball at the current precision
    each time it is used, so that a change of working precision does not inherit an old radius."""

    def __init__(self, f, num=1, den=1):
        self.f = Fraction(f)
        self.num = num
        self.den = den

    def b(self):
        x = arb(self.f.numerator) / self.f.denominator
        if self.num != 1:
            x = x + arb(self.num).log()
        if self.den != 1:
            x = x - arb(self.den).log()
        return x

    def __float__(self):
        return float(self.f) + math.log(self.num) - math.log(self.den)

    def add(self, r):
        return Pt(self.f + Fraction(r), self.num, self.den)

    def mlog(self, n):
        return Pt(self.f, self.num * n, self.den)

    def dlog(self, n):
        return Pt(self.f, self.num, self.den * n)

    def neg(self):
        return Pt(-self.f, self.den, self.num)


def ub(u0):
    return acb(u0.b())


def setprec(p):
    ctx.prec = p
    ctx.cap = CAP


def coeffs(s, n=CAP):
    return [s[k] for k in range(n)]


def D(c):
    return [c[k + 1] * (k + 1) for k in range(len(c) - 1)]


def lin(c1, a1, c2=None, a2=None):
    n = len(c1) if c2 is None else min(len(c1), len(c2))
    if c2 is None:
        return [c1[k] * a1 for k in range(n)]
    return [c1[k] * a1 + c2[k] * a2 for k in range(n)]


def mul(c1, c2):
    n = min(len(c1), len(c2))
    out = []
    for k in range(n):
        s = acb(0)
        for j in range(k + 1):
            s += c1[j] * c2[k - j]
        out.append(s)
    return out


def exp_lin_jet(alpha, u0, n=CAP):
    # Taylor coefficients in t of exp(alpha (u0 + t))
    a = acb(alpha)
    e0 = (a * u0).exp()
    out = []
    f = acb(1)
    for k in range(n):
        if k > 0:
            f = f * a / k
        out.append(e0 * f)
    return out


def nterms_gauss(u0, q):
    # pi n^2 e^(2u0)/q > (prec + 64) ln 2
    return int(math.sqrt((ctx.prec + 64) * 0.6932 * q / (math.pi * math.exp(2 * u0)))) + 3


def gauss_sum_series(u0, coef, d, q):
    """acb_series in t of sum_{n>=1} coef(n) n^d exp((1/2+d)(u0+t) - pi n^2 e^(2(u0+t))/q)."""
    t = acb_series([0, 1])
    U = ub(u0)
    E = (2 * t).exp() * (2 * U).exp() * acb.pi() / q
    L = acb_series([(acb(1) / 2 + d) * U, acb(1) / 2 + d])
    N = nterms_gauss(float(u0), q)
    tot = acb_series([0])
    for n in range(1, N + 1):
        c = coef(n)
        if c is None:
            continue
        if d:
            c = c * n
        tot = tot + (L - (n * n) * E).exp() * c
    return tot


# ---------- ZETA ----------
def zeta_parts(u0):
    """(polar jet, nonpolar jet) of Kpol = e^(u/2) theta(e^(2u))."""
    pol = exp_lin_jet(acb(1) / 2, ub(u0))
    non = coeffs(gauss_sum_series(u0, lambda n: acb(2), 0, 1))
    return pol, non


def zeta_pol(u0):
    p, n = zeta_parts(u0)
    return lin(p, 1, n, 1)


def zeta_k3(u0):
    p, n = zeta_parts(u0)
    return lin(D(D(n)), 1, n, acb(-1) / 4)


# ---------- characters ----------
def _primroot(q):
    phi = q - 1 if q != 9 else 6
    for g in range(2, q):
        if math.gcd(g, q) != 1:
            continue
        x, o = g % q, 1
        while x != 1:
            x = x * g % q
            o += 1
        if o == phi:
            return g, phi


def char_exponents(q, lab):
    """Conrey character chi_q(lab, .): dict n mod q -> (num, den) with chi(n) = e(num/den); None if gcd > 1."""
    if q in (3, 5, 7, 9, 11, 13):
        g, phi = _primroot(q)
        dl = {}
        x = 1
        for k in range(phi):
            dl[x] = k
            x = x * g % q
        a = dl[lab % q]
        return {n: ((a * dl[n]) % phi, phi) for n in dl}
    if q == 4:
        assert lab == 3
        return {1: (0, 2), 3: (1, 2)}
    if q == 8:
        # n = eps 5^a mod 8 ; chi(n, m) = exp(2 pi i [ (1-eps_n)(1-eps_m)/8 + a b / 2 ])
        rep = {1: (1, 0), 5: (1, 1), 7: (-1, 0), 3: (-1, 1)}
        en, a = rep[lab]
        out = {}
        for m, (em, b) in rep.items():
            num = (1 - en) * (1 - em) + 4 * a * b  # over 8
            out[m] = (num % 8, 8)
        return out
    if q == 12:
        assert lab == 11
        c4 = char_exponents(4, 3)
        c3 = char_exponents(3, 2)
        out = {}
        for n in range(12):
            if math.gcd(n, 12) == 1:
                n4, d4 = c4[n % 4]
                n3, d3 = c3[n % 3]
                out[n] = ((n4 * d3 + n3 * d4) % (d4 * d3), d4 * d3)
        return out
    raise ValueError(q)


_chi_cache = {}


def chi_values(q, lab):
    key = (q, lab, ctx.prec)
    if key not in _chi_cache:
        ex = char_exponents(q, lab)
        vals = {}
        for n, (num, den) in ex.items():
            vals[n] = (acb(0, 1) * acb.pi() * 2 * num / den).exp()
        par = 0 if ex[q - 1][0] == 0 else 1
        _chi_cache[key] = (vals, par)
    return _chi_cache[key]


_om_cache = {}


def chi_raw_series(q, lab, u0):
    vals, par = chi_values(q, lab)
    return gauss_sum_series(u0, lambda n: (vals[n % q] * 2 if (n % q) in vals else None), par, q)


def chi_omega_conj(q, lab):
    key = (q, lab, ctx.prec)
    if key not in _om_cache:
        k1 = chi_raw_series(q, lab, Pt(Fraction(-1, 5)))[0]
        k2 = chi_raw_series(q, lab, Pt(Fraction(1, 5)))[0]
        eps = k1 / k2.conjugate()
        om = eps.sqrt()  # principal branch: Re >= 0
        _om_cache[key] = (om.conjugate(), eps)
    return _om_cache[key][0]


def chi_jet(q, lab, u0):
    oc = chi_omega_conj(q, lab)
    c = coeffs(chi_raw_series(q, lab, u0))
    return [x * oc for x in c]


def dh_jet(u0):
    c = chi_jet(5, 2, u0)
    return [acb(x.real) for x in c]


# ---------- Liouville sign twist ----------
_liou = [0, 1]


def liouville(n):
    while len(_liou) <= n:
        m = len(_liou)
        k, om = m, 0
        p = 2
        while p * p <= k:
            while k % p == 0:
                k //= p
                om += 1
            p += 1
        if k > 1:
            om += 1
        _liou.append(-1 if om % 2 else 1)
    return _liou[n]


def liou_parts(u0):
    pol = exp_lin_jet(acb(1) / 2, ub(u0))
    non = coeffs(gauss_sum_series(u0, lambda n: acb(2 * liouville(n)), 0, 1))
    return pol, non


# ---------- E_a / EIS-w ----------
def xistar(s):
    s = acb(s)
    return acb.pi() ** (-s / 2) * (s / 2).gamma() * s.zeta()


def cfrac(a):
    """a = (re, im) as Fractions -> acb at the current precision."""
    re, im = a
    return acb(arb(re.numerator) / re.denominator, arb(im.numerator) / im.denominator)


def bessel_jet(afr, nn, u0, n=CAP):
    """Taylor coefficients in t of K_a(x e^t), x = 2 pi nn e^(u0), from f'' = (a^2 + x^2 e^(2t)) f.
    Arb's bessel_k loses about 2x/ln 2 bits to cancellation at moderate x and amplifies the radius of its
    inputs by the same factor, so x and a are rebuilt from exact data at a raised precision."""
    p0 = ctx.prec
    xf = 2 * math.pi * nn * math.exp(float(u0))
    ctx.prec = p0 + int(2.9 * xf) + 64
    a = cfrac(afr)
    x = acb.pi() * 2 * nn * ub(u0).exp()
    f0 = x.bessel_k(a)
    # x K_a'(x) = -x K_(a-1)(x) - a K_a(x)   (K_(a+1) = K_(a-1) + (2a/x) K_a; the direct call at order a+1 is slow)
    f1 = -x * x.bessel_k(a - 1) - a * f0
    ctx.prec = p0
    a = cfrac(afr)
    x = acb.pi() * 2 * nn * ub(u0).exp()
    c = [f0, f1]
    e = [acb(1)]
    for j in range(1, n):
        e.append(e[-1] * 2 / j)
    x2 = x * x
    a2 = a * a
    for k in range(n - 2):
        s = a2 * c[k]
        for j in range(k + 1):
            s += x2 * e[j] * c[k - j]
        c.append(s / ((k + 2) * (k + 1)))
    return c


def ea_parts(u0, afr):
    a = cfrac(afr)
    U = ub(u0)
    half = acb(1) / 2
    p1 = lin(exp_lin_jet(half + a, U), xistar(1 + 2 * a))
    p2 = lin(exp_lin_jet(half - a, U), xistar(2 * a))
    pol = lin(p1, 1, p2, 1)
    eu = math.exp(float(u0))
    N = int((ctx.prec + 64) * 0.6932 / (2 * math.pi * eu)) + 3
    tot = [acb(0)] * CAP
    for n in range(1, N + 1):
        sig = acb(0)
        for dd in range(1, n + 1):
            if n % dd == 0:
                sig += acb(dd) ** (-2 * a)
        w = acb(n) ** a * sig
        bj = bessel_jet(afr, n, u0)
        tot = [tot[k] + w * bj[k] for k in range(CAP)]
    non = lin(mul(exp_lin_jet(half, U), tot), 4)
    return pol, non, a


def ea_pol(u0, a):
    p, n, _ = ea_parts(u0, a)
    return lin(p, 1, n, 1)


def ea_k3(u0, a):
    p, n, a = ea_parts(u0, a)
    half = acb(1) / 2
    x = lin(D(D(n)), 1, n, -(half + a) ** 2)
    return lin(D(D(x)), 1, x, -(half - a) ** 2)


# ---------- theta^w ----------
def thw_pol(u0, w):
    p, n = zeta_parts(u0)
    s = acb_series(lin(p, 1, n, 1))
    return coeffs((s.log() * tq(w)).exp())


def thw_k3(u0, w):
    c = thw_pol(u0, w)
    return lin(D(D(c)), 1, c, -tq(w) * tq(w) / 4)


# ---------- T-NR ----------
def tnr(base, u0, p0, c):
    a = base(u0.mlog(p0))
    b = base(u0)
    d = base(u0.dlog(p0))
    cc = arb(c.numerator) / c.denominator
    return [a[k] + b[k] * cc + d[k] for k in range(min(len(a), len(b), len(d)))]


# ---------- HEAT ----------
def tq(tau):
    return acb(arb(tau.numerator) / tau.denominator)


def gauss_jet(tau, u0, n=CAP):
    t = acb_series([0, 1])
    s = acb_series([ub(u0), 1])
    return coeffs((s * s * (tq(tau) / 4)).exp(), n)


def heat_k3(u0, tau):
    return mul(gauss_jet(tau, u0), zeta_k3(u0))


def _k3zeta_point(v, N):
    # closed form: 2 sum (4 pi^2 n^4 e^(4v) - 6 pi n^2 e^(2v)) exp(v/2 - pi n^2 e^(2v))
    e2 = (2 * v).exp()
    pi = acb.pi()
    tot = acb(0)
    for n in range(1, N + 1):
        x = pi * (n * n) * e2
        tot += (4 * x * x - 6 * x) * (v / 2 - x).exp()
    return 2 * tot


_heat_cache = {}
UMAX = 4.6


def _heat_int(tau, lo, sgn):
    """int_lo^UMAX K3_tau(v) e^(sgn v/2) dv  (lo >= 0; lo a Pt or None for 0)."""
    key = (tau, None if lo is None else (lo.f, lo.num, lo.den), sgn, ctx.prec)
    if key not in _heat_cache:
        N = nterms_gauss(0.0, 1) + 2
        tt = tq(tau) / 4
        hs = acb(sgn) / 2

        def f(v, analytic):
            return (tt * v * v).exp() * _k3zeta_point(v, N) * (hs * v).exp()
        a = acb(0) if lo is None else ub(lo)
        _heat_cache[key] = acb.integral(f, a, acb(UMAX))
    return _heat_cache[key]


def heat_pol(u0, tau):
    if float(u0) < 0:
        c = heat_pol(u0.neg(), tau)
        return [(-x if k % 2 else x) for k, x in enumerate(c)]
    U = ub(u0)
    cc = _heat_int(tau, None, 1) + _heat_int(tau, None, -1)  # c = int_R K3 e^(v/2) = int_0^inf K3 (e^(v/2)+e^(-v/2))
    A0 = _heat_int(tau, u0, 1)
    B0 = _heat_int(tau, u0, -1)
    k3 = heat_k3(u0, tau)
    ep = exp_lin_jet(acb(1) / 2, U)
    em = exp_lin_jet(acb(-1) / 2, U)
    ia = mul(k3, ep)
    ib = mul(k3, em)
    L = len(ia) + 1
    A = [A0] + [-ia[k - 1] / k for k in range(1, L)]
    B = [B0] + [-ib[k - 1] / k for k in range(1, L)]
    t1 = mul(em, A)
    t2 = mul(ep, B)
    return [cc * ep[k] + t1[k] - t2[k] for k in range(min(L, CAP))]


# ---------- object table ----------
def make_objects(names):
    """name -> (pol(u0), k3(u0)) for the objects this referee implements."""
    obj = {}
    for nm in names:
        if nm == 'ZETA':
            obj[nm] = (zeta_pol, zeta_k3)
        elif nm.startswith('chi'):
            q, lab = nm[3:].rstrip('c').split('.')
            q, lab = int(q), int(lab)
            if q > 13:
                continue
            f = (lambda q, lab: (lambda u0: chi_jet(q, lab, u0)))(q, lab)
            obj[nm] = (f, f)
        elif nm == 'DH':
            obj[nm] = (dh_jet, dh_jet)
        elif nm == 'TNR3_2.2':
            obj[nm] = (lambda u0: tnr(zeta_pol, u0, 3, Fraction(22, 10)), lambda u0: tnr(zeta_k3, u0, 3, Fraction(22, 10)))
        elif nm in ('EA0.125', 'EA0.250'):
            a = (Fraction(1, 8), Fraction(0)) if nm == 'EA0.125' else (Fraction(1, 4), Fraction(0))
            obj[nm] = ((lambda a: (lambda u0: ea_pol(u0, a)))(a), (lambda a: (lambda u0: ea_k3(u0, a)))(a))
        elif nm in ('EIS0.20+3.00i', 'EIS0.10+5.00i'):
            a = (Fraction(1, 5), Fraction(3)) if nm.startswith('EIS0.20') else (Fraction(1, 10), Fraction(5))
            obj[nm] = ((lambda a: (lambda u0: ea_pol(u0, a)))(a), (lambda a: (lambda u0: ea_k3(u0, a)))(a))
        elif nm in ('HEAT-0.10', 'HEAT-0.50'):
            tau = Fraction(-1, 10) if nm == 'HEAT-0.10' else Fraction(-1, 2)
            obj[nm] = ((lambda tau: (lambda u0: heat_pol(u0, tau)))(tau), (lambda tau: (lambda u0: heat_k3(u0, tau)))(tau))
        elif nm == 'SGN-LIOU':
            def lp(u0):
                p, n = liou_parts(u0)
                return lin(p, 1, n, 1)

            def l3(u0):
                p, n = liou_parts(u0)
                return lin(D(D(n)), 1, n, acb(-1) / 4)
            obj[nm] = (lp, l3)
        elif nm in ('THW0.50', 'THW3.00'):
            w = Fraction(1, 2) if nm == 'THW0.50' else Fraction(3)
            obj[nm] = ((lambda w: (lambda u0: thw_pol(u0, w)))(w), (lambda w: (lambda u0: thw_k3(u0, w)))(w))
    return obj


# ---------- functionals ----------
def det(M):
    n = len(M)
    if n == 2:
        return M[0][0] * M[1][1] - M[0][1] * M[1][0]
    tot = acb(0)
    for j in range(n):
        minor = [row[:j] + row[j + 1:] for row in M[1:]]
        t = M[0][j] * det(minor)
        tot = tot + t if j % 2 == 0 else tot - t
    return tot


def label_kernel(base, p):
    if p == 0:
        return base

    def k(u0):
        a = base(u0)
        b = base(u0.mlog(p))
        sc = arb(p).sqrt()
        return [a[i] - b[i] / sc for i in range(min(len(a), len(b)))]
    return k


def fact(n):
    return math.factorial(n)


def fr(x):
    return Fraction(float(x))


def farb(x):
    x = Fraction(x)
    return arb(x.numerator) / x.denominator


def evaluate(fam, par, base):
    """fam in D1,D3a (minor) or F1..F5; par dict of floats; base = jet function of the kernel (pol or k3).
    Parameters are read as the exact binary values of the stored float64 numbers."""
    if fam == 'minor':
        m, cols, u0, h, g = par['m'], par['cols'], fr(par['u0']), fr(par['h']), fr(par['g'])
        M = []
        for i in range(m):
            ui = u0 + i * h + i * i * g
            M.append([base(Pt(ui, int(n), 1))[0] for n in cols])
        return det(M)
    k = label_kernel(base, par['p'])
    u, h, lam, mu = fr(par['u']), fr(par['h']), farb(fr(par['lam'])), farb(fr(par['mu']))
    P = Pt(u)
    if fam == 'F1':
        return k(P.add(-h))[0] * k(P.add(h))[0] - lam * k(P)[0] ** 2
    if fam in ('F2', 'F5'):
        c = mul(k(P), exp_lin_jet(acb(mu), ub(P)))
        d0, d1, d2, d3 = c[0], c[1], c[2] * 2, c[3] * 6
        if fam == 'F2':
            return d1 * d1 - lam * d0 * d2
        return 4 * (d1 * d1 - d0 * d2) * (d2 * d2 - d1 * d3) - (d1 * d2 - d0 * d3) ** 2
    if fam == 'F3':
        v = [k(P.add((j - 2) * h))[0] for j in range(5)]
        return det([[v[i + j] for j in range(3)] for i in range(3)])
    if fam == 'F4':
        c = k(P)
        d = [c[j] * fact(j) for j in range(5)]
        return det([[d[i + j] for j in range(3)] for i in range(3)])
    raise ValueError(fam)


def sign_of(fam, par, base, ladder):
    for p in ladder:
        setprec(p)
        try:
            v = evaluate(fam, par, base).real
        except Exception as e:  # noqa
            return 0, 'err:' + repr(e)[:60]
        if v > 0:
            return 1, p
        if v < 0:
            return -1, p
    return 0, ladder[-1]
