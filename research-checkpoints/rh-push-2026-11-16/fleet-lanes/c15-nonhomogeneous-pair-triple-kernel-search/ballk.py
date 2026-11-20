"""Ball-arithmetic kernels and functionals (python-flint). Mirrors kern.py / funcs.py.
bjets(obj, u, kmax, pol) -> list of arb/acb: derivatives 0..kmax of Kpol or K3 at the ball u.
Series tails are enclosed by a geometric bound (stated in tail()); HEAT with polar terms uses acb.integral.
The functional is evaluated at the exact values of its float parameters."""
import math
from fractions import Fraction
import numpy as np
from flint import arb, acb, arb_series, acb_series, ctx
import kern
import funcs

LN2 = math.log(2)


def _F(x):
    """exact arb of a python float or int"""
    return arb(x)


def _derivs(ser, kmax):
    out = []
    f = 1
    for k in range(kmax + 1):
        if k:
            f *= k
        c = ser[k] if k < ser.length() else (ser[0] * 0)
        out.append(c * f)
    return out


def _is_neg(u):
    return u < 0 if isinstance(u, arb) else False


def _radball(r):
    return arb(0, r)


def gauss_series(u, cfun, A1, beta, kmax, cplx=False, nstart=1, ncoef_max=None):
    """series (cap kmax+1) of sum_{n>=1} c(n) exp(beta x - A1 n^2 exp(2x)) at x = u + t; tail enclosed.
    cfun(n) -> arb/acb coefficient with |c(n)| <= 2 n."""
    ctx.cap = kmax + 1
    S = acb_series if cplx else arb_series
    x = S([u, 1])
    e2 = (2 * x).exp()
    tot = S([0])
    need = ctx.prec * LN2 + 60
    w1 = float((A1 * (2 * u).exp()).mid())
    N = int(math.sqrt(need / w1)) + 2
    if ncoef_max is not None and N > ncoef_max:
        raise RuntimeError('coefficient table too short: need %d' % N)
    for n in range(1, N + 1):
        c = cfun(n)
        if c is None:
            continue
        tot = tot + c * (-(A1 * (n * n)) * e2).exp()
    tot = tot * (beta * x).exp()
    # tail: sum_{n>N} 2n e^(beta u) (|beta| + 2(w_n + k))^k e^(-w_n) <= 4 T(N+1) (ratio of consecutive terms < 1/2 since w_(N+1) > 60)
    W = arb(w1 * (N + 1) ** 2 * 0.999)
    T = 8 * (N + 1) * (beta * u).exp() * (abs(beta) + 2 * (W + kmax + 1)) ** kmax * (-W).exp()
    r = float(abs(T).upper()) if float(abs(T).upper()) > 0 else 0.0
    d = _derivs(tot, kmax)
    if r > 0:
        d = [z + (acb(arb(0, r), arb(0, r)) if cplx else arb(0, r)) for z in d]
    return d


class BZeta:
    def jets(self, u, kmax, pol):
        neg = bool(u < 0)
        v = -u if neg else u
        if pol:
            ctx.cap = kmax + 1
            d = gauss_series(v, lambda n: arb(2), arb.pi(), arb(0.5), kmax)
            e = (v / 2).exp()
            d = [d[k] + e / (2 ** k) for k in range(kmax + 1)]
        else:
            s = gauss_series(v, lambda n: arb(2), arb.pi(), arb(0.5), kmax + 2)
            d = [s[k + 2] - s[k] / 4 for k in range(kmax + 1)]
        if neg:
            d = [(-x if k % 2 else x) for k, x in enumerate(d)]
        return d


BZ = BZeta()


class BChi:
    def __init__(self, o):
        self.o = o
        self.q = o.q
        self.d = o.d
        self.exps = []
        for v in o.vals:
            if abs(v) < 1e-9:
                self.exps.append(None)
            else:
                fr = Fraction(math.atan2(v.imag, v.real) / (2 * math.pi)).limit_denominator(2000)
                assert abs(np.exp(2j * math.pi * float(fr)) - v) < 1e-9
                self.exps.append(fr)
        self._om = {}

    def chi(self, n):
        e = self.exps[n % self.q]
        if e is None:
            return None
        return acb.exp_pi_i(2 * acb(e.numerator) / e.denominator)

    def raw(self, u, kmax):
        """sum 2 chi(n) n^d exp((1/2+d)x - pi n^2 e^(2x)/q), complex"""
        def c(n):
            x = self.chi(n)
            return None if x is None else 2 * x * (n ** self.d)
        return gauss_series(u, c, arb.pi() / self.q, arb(0.5 + self.d), kmax, cplx=True)

    def omega_conj(self):
        p = ctx.prec
        if p not in self._om:
            if self.o.real:
                self._om[p] = acb(1)
            else:
                u0 = arb(0.2)
                eps = self.raw(-u0, 0)[0] / self.raw(u0, 0)[0].conjugate()
                om = eps.sqrt()
                if (om.real < 0) or ((not (om.real > 0)) and om.imag < 0):
                    om = -om
                if abs(complex(om) - complex(self.o.omega)) > 1e-9:
                    om = -om
                assert abs(complex(om) - complex(self.o.omega)) < 1e-9
                self._om[p] = om.conjugate()
        return self._om[p]

    def jets(self, u, kmax, pol):
        neg = bool(u < 0)
        v = -u if neg else u
        d = [self.omega_conj() * z for z in self.raw(v, kmax)]
        if self.o.real:
            d = [z.real for z in d]
        if neg:
            d = [(z if self.o.real else z.conjugate()) * (-1 if k % 2 else 1) for k, z in enumerate(d)]
        return d


class BDH:
    def __init__(self, o):
        self.o = o
        self.c = BChi(o.chi)

    def jets(self, u, kmax, pol):
        d = self.c.jets(u, kmax, pol)
        return [(z.real if self.o.part == 'Re' else z.imag) * int(self.o.sgn) for z in d]


class BTNR:
    def __init__(self, o):
        self.o = o

    def jets(self, u, kmax, pol):
        l = arb(self.o.p0).log()
        a = BZ.jets(u + l, kmax, pol)
        b = BZ.jets(u, kmax, pol)
        c = BZ.jets(u - l, kmax, pol)
        cc = _F(self.o.c)
        return [a[k] + cc * b[k] + c[k] for k in range(kmax + 1)]


class BNoFE:
    def __init__(self, o):
        self.o = o
        self.cplx = o.cplx
        self.up = getattr(o, 'up', None)
        if self.cplx:
            assert self.up is not None
        self._c = {}

    def coef(self, n):
        if not self.cplx:
            a = self.o.a[n]
            return None if a == 0 else arb(2 * int(round(float(a))))
        key = (n, ctx.prec)
        if key not in self._c:
            th = arb(0)
            m = n
            p = 2
            while m > 1:
                while m % p == 0:
                    th += _F(float(self.up[p]))
                    m //= p
                p += 1
                if p * p > m and m > 1:
                    th += _F(float(self.up[m]))
                    m = 1
            self._c[key] = 2 * acb.exp_pi_i(2 * acb(th))
        return self._c[key]

    def jets(self, u, kmax, pol):
        if pol:
            d = gauss_series(u, self.coef, arb.pi(), arb(0.5), kmax, cplx=self.cplx, ncoef_max=len(self.o.a) - 1)
            e = (u / 2).exp()
            return [d[k] + e / (2 ** k) for k in range(kmax + 1)]
        s = gauss_series(u, self.coef, arb.pi(), arb(0.5), kmax + 2, cplx=self.cplx, ncoef_max=len(self.o.a) - 1)
        return [s[k + 2] - s[k] / 4 for k in range(kmax + 1)]


class BThetaW:
    def __init__(self, o):
        self.o = o

    def jets(self, u, kmax, pol):
        neg = bool(u < 0)
        v = -u if neg else u
        w = _F(self.o.w)
        K = kmax if pol else kmax + 2
        ctx.cap = K + 1
        x = arb_series([v, 1])
        e2 = (2 * x).exp()
        eps = arb_series([0])
        need = ctx.prec * LN2 + 60
        w1 = float((arb.pi() * (2 * v).exp()).mid())
        N = int(math.sqrt(need / w1)) + 2
        for n in range(1, N + 1):
            eps = eps + 2 * (-(arb.pi() * (n * n)) * e2).exp()
        W = arb(w1 * (N + 1) ** 2 * 0.999)
        r = float((8 * (N + 1) * (2 * (W + K + 1)) ** K * (-W).exp()).upper())
        eps = eps + arb_series([arb(0, r)] * (K + 1))
        g = (w * (1 + eps).log()).exp()
        if pol:
            ser = (w * x / 2).exp() * g
            d = _derivs(ser, kmax)
        else:
            gc = [g[k] if k < g.length() else arb(0) for k in range(K + 1)]
            rr = arb_series([(k + 2) * (k + 1) * gc[k + 2] + w * (k + 1) * gc[k + 1] for k in range(kmax + 1)])
            ctx.cap = kmax + 1
            x2 = arb_series([v, 1])
            ser = (w * x2 / 2).exp() * rr
            d = _derivs(ser, kmax)
        if neg:
            d = [(-z if k % 2 else z) for k, z in enumerate(d)]
        return d


class BEA:
    """E*(i e^u, 1/2 + a). Bessel jets through f'' = (X^2 + a^2) f for f(x) = K_a(c e^x); tail by K_a <= K_(1/2)."""

    def __init__(self, o):
        self.o = o
        self.cplx = o.cplx
        self._k = {}

    def consts(self):
        p = ctx.prec
        if p not in self._k:
            a = acb(_F(self.o.a.real), _F(self.o.a.imag)) if self.cplx else acb(_F(self.o.a))
            xis = lambda s: (acb.pi() ** (-s / 2)) * (s / 2).gamma() * s.zeta()
            self._k[p] = (a, xis(1 + 2 * a), xis(2 * a))
        return self._k[p]

    def bessel_part(self, v, K):
        """Taylor coefficients 0..K of B(x) = 4 sqrt(y) sum n^a sigma_(-2a)(n) K_a(2 pi n y), y = e^x, at x = v >= 0."""
        a, _, _ = self.consts()
        ctx.cap = K + 1
        x = acb_series([acb(v), 1])
        ex = x.exp()
        tot = acb_series([0])
        need = ctx.prec * LN2 + 60
        y = float(v.exp().mid()) if isinstance(v, arb) else math.exp(float(v))
        N = int(need / (2 * math.pi * y)) + 2
        for n in range(1, N + 1):
            c = 2 * arb.pi() * n
            X = acb(c * v.exp())
            k0 = X.bessel_k(a)
            km = X.bessel_k(a - 1)
            f = [k0, -X * km - a * k0]
            Wser = (c * c) * (2 * x).exp() + a * a          # X^2 + a^2 as a series
            Wc = [Wser[j] if j < Wser.length() else acb(0) for j in range(K + 1)]
            for k in range(K - 1):
                s = acb(0)
                for j in range(k + 1):
                    s += Wc[j] * f[k - j]
                f.append(s / ((k + 2) * (k + 1)))
            sig = acb(0)
            for dv in range(1, n + 1):
                if n % dv == 0:
                    sig += (-2 * a * acb(dv).log()).exp()
            cn = 4 * (a * acb(n).log()).exp() * sig
            tot = tot + cn * acb_series(f[:K + 1])
        tot = tot * (x / 2).exp()
        Xn = 2 * math.pi * (N + 1) * y * 0.999
        r = 64 * (N + 1) ** 2 * math.exp(float(v.mid()) / 2) * (Xn + abs(complex(a)) + K + 1) ** K * math.exp(-Xn)
        return [(tot[k] if k < tot.length() else acb(0)) + acb(arb(0, r), arb(0, r)) for k in range(K + 1)]

    def jets(self, u, kmax, pol):
        neg = bool(u < 0)
        v = -u if neg else u
        a, c1, c2 = self.consts()
        e1 = acb(0.5) + a
        e2 = acb(0.5) - a
        if pol:
            B = self.bessel_part(v, kmax)
            x1 = c1 * (e1 * v).exp()
            x2 = c2 * (e2 * v).exp()
            f = 1
            d = []
            for k in range(kmax + 1):
                if k:
                    f *= k
                d.append(B[k] * f + x1 * e1 ** k + x2 * e2 ** k)
        else:
            B = self.bessel_part(v, kmax + 4)
            fac = [math.factorial(k) for k in range(kmax + 5)]
            D = [B[k] * fac[k] for k in range(kmax + 5)]
            b1 = e1 * e1
            b2 = e2 * e2
            d = [D[k + 4] - (b1 + b2) * D[k + 2] + b1 * b2 * D[k] for k in range(kmax + 1)]
        if not self.cplx:
            d = [z.real for z in d]
        if neg:
            d = [(-z if k % 2 else z) for k, z in enumerate(d)]
        return d


class BHeat:
    VMAX = 4.0

    def __init__(self, o):
        self.o = o
        self._c = {}

    def f_jets(self, v, kmax):
        ctx.cap = kmax + 1
        z = BZ.jets(v, kmax, False)
        fac = [math.factorial(k) for k in range(kmax + 1)]
        zs = arb_series([z[k] / fac[k] for k in range(kmax + 1)])
        x = arb_series([v, 1])
        ser = (_F(self.o.tau) * x * x / 4).exp() * zs
        return _derivs(ser, kmax)

    def _integrand(self, sgn):
        tau = _F(self.o.tau)

        def g(t, _):
            # K3_zeta(t) e^(tau t^2/4) e^(sgn t/2), analytic in t
            e2 = (2 * t).exp()
            s = acb(0)
            need = ctx.prec * LN2 + 60
            w1 = max(float((arb.pi() * e2.real).mid()), 1e-3)
            N = min(int(math.sqrt(need / w1)) + 2, 400)
            for n in range(1, N + 1):
                w = arb.pi() * (n * n) * e2
                s += 2 * ((acb(0.5) - 2 * w) ** 2 - 4 * w - acb(0.25)) * (-w).exp()
            return s * (t / 2).exp() * (tau * t * t / 4).exp() * (sgn * t / 2).exp()
        return g

    def tails(self, v):
        """J1 = int_v^inf f e^(t/2), I2 = int_v^inf f e^(-t/2); truncation beyond VMAX enclosed by 2^-13000."""
        tol = arb(2) ** (-ctx.prec)
        j1 = acb.integral(self._integrand(1), acb(v), acb(self.VMAX), rel_tol=tol, abs_tol=arb(2) ** (-ctx.prec - 3000)).real
        i2 = acb.integral(self._integrand(-1), acb(v), acb(self.VMAX), rel_tol=tol, abs_tol=arb(2) ** (-ctx.prec - 3000)).real
        r = arb(0, 2.0 ** -1000) * arb(2) ** (-12000)
        return j1 + r, i2 + r

    def jets(self, u, kmax, pol):
        if not pol:
            return self.f_jets(u, kmax)
        neg = bool(u < 0)
        v = -u if neg else u
        p = ctx.prec
        if p not in self._c:
            j, i = self.tails(arb(0))
            self._c[p] = j + i
        c = self._c[p]
        j1, i2 = self.tails(v)
        ep = (v / 2).exp()
        em = (-v / 2).exp()
        d = [c * ep + em * j1 - ep * i2]
        if kmax >= 1:
            d.append((c * ep - em * j1 - ep * i2) / 2)
        if kmax >= 2:
            F = self.f_jets(v, kmax - 2)
            for k in range(kmax - 1):
                d.append(d[k] / 4 + F[k])
        if neg:
            d = [(-z if k % 2 else z) for k, z in enumerate(d)]
        return d


def wrap(o):
    if isinstance(o, kern.Zeta):
        return BZ
    if isinstance(o, kern.Chi):
        return BChi(o)
    if isinstance(o, kern.DHType):
        return BDH(o)
    if isinstance(o, kern.TNR):
        return BTNR(o)
    if isinstance(o, kern.NoFE):
        return BNoFE(o)
    if isinstance(o, kern.ThetaW):
        return BThetaW(o)
    if isinstance(o, kern.EA):
        return BEA(o)
    if isinstance(o, kern.Heat):
        return BHeat(o)
    raise TypeError(type(o))


# ---------- functionals ----------
def bdet(M):
    m = len(M)
    if m == 2:
        return M[0][0] * M[1][1] - M[0][1] * M[1][0]
    if m == 3:
        return (M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0])
                + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]))
    import itertools
    d = 0
    for a, b in itertools.combinations(range(4), 2):
        rest = [x for x in range(4) if x not in (a, b)]
        sg = (-1) ** (a + b + 1)
        d = d + sg * (M[0][a] * M[1][b] - M[0][b] * M[1][a]) * (M[2][rest[0]] * M[3][rest[1]] - M[2][rest[1]] * M[3][rest[0]])
    return d


class Evaluator:
    """value of one functional on one object as a ball; kernel values cached per (precision, point key)."""

    def __init__(self, obj):
        self.b = wrap(obj)
        self.cache = {}

    def K(self, key, ufun, kmax, pol, p=0):
        ck = (ctx.prec, key, kmax, pol, p)
        if ck not in self.cache:
            if len(self.cache) > 200000:
                self.cache.clear()
            u = ufun()
            d = self.b.jets(u, kmax, pol)
            if p:
                d2 = self.b.jets(u + arb(p).log(), kmax, pol)
                rp = arb(p).sqrt()
                d = [x - y / rp for x, y in zip(d, d2)]
            self.cache[ck] = d
        return self.cache[ck]

    def minor(self, m, cols, u0, h, g, pol):
        M = []
        for i in range(m):
            row = []
            for n in cols:
                key = ('m', u0, h, g, i, int(n))
                row.append(self.K(key, lambda: _F(float(u0)) + i * _F(float(h)) + (i * i) * _F(float(g)) + arb(int(n)).log(), 0, pol)[0])
            M.append(row)
        return bdet(M)

    def turan(self, sub, p, u, h, lam, mu, pol):
        U = _F(float(u))
        H = _F(float(h))
        L = _F(float(lam))
        Mu = _F(float(mu))
        p = int(p)
        if sub == 'F1':
            a, b, c = [self.K(('t', u, h, k), (lambda k=k: U + k * H), 0, pol, p)[0] for k in (-1, 0, 1)]
            return a * c - L * b * b
        if sub == 'F3':
            v = [self.K(('t', u, h, k), (lambda k=k: U + k * H), 0, pol, p)[0] for k in (-2, -1, 0, 1, 2)]
            return bdet([[v[i + j] for j in range(3)] for i in range(3)])
        kmax = {'F2': 2, 'F4': 4, 'F5': 3}[sub]
        J = self.K(('j', u), lambda: U, kmax, pol, p)
        if sub == 'F4':
            return bdet([[J[i + j] for j in range(3)] for i in range(3)])
        T = []
        for n in range(kmax + 1):
            s = 0
            for j in range(n + 1):
                s = s + math.comb(n, j) * Mu ** (n - j) * J[j]
            T.append(s)
        if sub == 'F2':
            return T[1] * T[1] - L * T[0] * T[2]
        A = T[1] * T[1] - T[0] * T[2]
        B = T[2] * T[2] - T[1] * T[3]
        C = T[1] * T[2] - T[0] * T[3]
        return 4 * A * B - C * C

    def value(self, fam, row):
        kind, pol, sub = funcs.fam_info(fam)
        if kind == 'minor':
            m = int(row['m'])
            return self.minor(m, funcs.COLSETS[m][int(row['ci'])], float(row['u0']), float(row['h']), float(row['g']), pol)
        return self.turan(sub, row['p'], float(row['u']), float(row['h']), float(row['lam']), float(row['mu']), pol)

    def sign(self, fam, row, precs=(256, 1024, 4096, 16384)):
        """-> (sign in {-1, 0, 1}, precision used); 0 = the ball of the real part contains 0 at the last precision."""
        for pr in precs:
            ctx.prec = pr
            try:
                v = self.value(fam, row)
            except (ValueError, ZeroDivisionError, RuntimeError, AssertionError) as e:
                continue
            re = v.real if isinstance(v, acb) else v
            if re > 0:
                return 1, pr
            if re < 0:
                return -1, pr
        return 0, precs[-1]
