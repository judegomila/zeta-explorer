"""c13-noncone-kernel-separator-search: kernels (float64 / complex128), PREREG section 2.

Every object has jets(u, kmax, pol) -> array (kmax+1, len(u)) of d^k/du^k of Kpol (pol=True) or K3 (pol=False).
Convention: Lambda(1/2 + z) = int (K(u) - polar) e^(zu) du; n^(-s) acts as K(u) -> n^(-1/2) K(u + log n).
"""
import math
import numpy as np

WIN = 2.6
PI = math.pi


# ---------- generic sums of e^(beta u) exp(-A e^(gamma u)) ----------
_POLY_CACHE = {}


def term_polys(beta, gamma, kmax):
    """p_k with D^k[e^(beta u) e^(-w)] = e^(beta u) e^(-w) p_k(w), w = A e^(gamma u); ascending coefficients."""
    key = (beta, gamma, kmax)
    if key in _POLY_CACHE:
        return _POLY_CACHE[key]
    P = [np.array([1.0])]
    for _ in range(kmax):
        p = P[-1]
        q = np.zeros(len(p) + 1)
        q[:len(p)] += beta * p
        q[1:] -= gamma * p
        dp = p[1:] * np.arange(1, len(p))          # p'
        q[1:len(dp) + 1] += gamma * dp             # gamma w p'
        P.append(q)
    _POLY_CACHE[key] = P
    return P


EPS = 1e-15


def expsum_jn(u, coef, A, beta, gamma, kmax):
    """sum_j coef_j e^(beta u) exp(-A_j e^(gamma u)), its u-derivatives up to kmax, and an absolute rounding-noise
    estimate EPS * sum of the moduli of the monomials (same shape)."""
    u = np.asarray(u, dtype=np.float64)
    coef = np.asarray(coef)
    dt = np.complex128 if np.iscomplexobj(coef) else np.float64
    out = np.zeros((kmax + 1, u.size), dtype=dt)
    nz = np.zeros((kmax + 1, u.size))
    P = term_polys(beta, gamma, kmax)
    AP = [np.abs(p) for p in P]
    eg = np.exp(gamma * u)
    for cj, Aj in zip(coef, A):
        if cj == 0:
            continue
        w = Aj * eg
        E0 = np.exp(-w)
        E = cj * E0
        Ea = abs(cj) * E0
        for k in range(kmax + 1):
            p = P[k]
            ap = AP[k]
            acc = np.full(u.size, p[-1])
            aac = np.full(u.size, ap[-1])
            for c, ac in zip(p[-2::-1], ap[-2::-1]):
                acc = acc * w + c
                aac = aac * w + ac
            out[k] += E * acc
            nz[k] += Ea * aac * (1.0 + w)
    eb = np.exp(beta * u)
    out *= eb
    nz *= EPS * eb
    return out, nz


def expsum_jets(u, coef, A, beta, gamma, kmax):
    return expsum_jn(u, coef, A, beta, gamma, kmax)[0]


def _even_reflect(J, u, conj=False):
    """J computed at |u|; return jets at u for an even (or hermitian: K(-u) = conj K(u)) kernel."""
    neg = u < 0
    if conj:
        J = np.where(neg[None, :], np.conj(J), J)
    sgn = np.where(neg, -1.0, 1.0)
    for k in range(1, J.shape[0], 2):
        J[k] = J[k] * sgn
    return J


def nmax_gauss(A1, umin, extra=60.0):
    """largest n with A1 n^2 e^(2 umin) <= extra (terms beyond are below e^-60 of the scale)."""
    return int(math.sqrt(extra / (A1 * math.exp(2 * umin)))) + 2


# ---------- objects ----------
class Obj:
    """jn(u, kmax, pol) -> (jets, noise): noise is an absolute rounding-error estimate of each entry."""
    name = '?'
    cplx = False

    def jn(self, u, kmax, pol):
        raise NotImplementedError

    def jets(self, u, kmax, pol):
        return self.jn(u, kmax, pol)[0]


class Zeta(Obj):
    name = 'ZETA'

    def _sum(self, v, kmax):
        n = np.arange(1, nmax_gauss(PI, 0.0) + 1)
        return expsum_jn(v, 2.0 * np.ones(len(n)), PI * n * n, 0.5, 2.0, kmax)

    def jn(self, u, kmax, pol):
        u = np.asarray(u, dtype=np.float64)
        v = np.abs(u)
        if pol:
            J, N = self._sum(v, kmax)
            e = np.exp(v / 2)
            for k in range(kmax + 1):
                J[k] += e * 0.5 ** k
                N[k] += EPS * e * 0.5 ** k
        else:
            S, M = self._sum(v, kmax + 2)
            J = S[2:] - 0.25 * S[:-2]
            N = M[2:] + 0.25 * M[:-2]
        return _even_reflect(J, u), N


ZETA = Zeta()


class Chi(Obj):
    """primitive character kernel conj(omega) e^((1/2+d)u) sum 2 chi(n) n^d exp(-pi n^2 e^(2u)/q); K(-u) = conj K(u)."""

    def __init__(self, q, vals, name):
        self.q = q
        self.vals = np.asarray(vals, dtype=np.complex128)
        self.name = name
        self.d = 0 if abs(self.vals[q - 1] - 1) < 1e-9 else 1
        self.real = bool(np.max(np.abs(self.vals.imag)) < 1e-12)
        self.cplx = not self.real
        N = nmax_gauss(PI / q, 0.0)
        n = np.arange(1, N + 1)
        self.n = n
        self.c0 = 2.0 * self.vals[n % q] * n.astype(np.float64) ** self.d
        self.A = PI * n * n / q
        self.omega = 1.0 + 0j
        # measure eps from the series: K(-u) = eps conj K(u)
        eps = []
        for u0 in (0.2, 0.35):
            Nn = nmax_gauss(PI / q, -u0)
            nn = np.arange(1, Nn + 1)
            cc = 2.0 * self.vals[nn % q] * nn.astype(np.float64) ** self.d
            a = expsum_jets(np.array([-u0]), cc, PI * nn * nn / q, 0.5 + self.d, 2.0, 0)[0, 0]
            b = expsum_jets(np.array([u0]), cc, PI * nn * nn / q, 0.5 + self.d, 2.0, 0)[0, 0]
            eps.append(a / np.conj(b))
        self.eps = eps[0]
        self.eps_check = abs(eps[0] - eps[1]), abs(abs(eps[0]) - 1)
        om = np.sqrt(self.eps)
        if om.real < 0 or (abs(om.real) < 1e-12 and om.imag < 0):
            om = -om
        self.omega = om
        self.c = np.conj(om) * self.c0
        if self.real:
            assert abs(om - 1) < 1e-9, (name, om)
            self.c = self.c0.real.copy()

    def jn(self, u, kmax, pol):
        u = np.asarray(u, dtype=np.float64)
        J, N = expsum_jn(np.abs(u), self.c, self.A, 0.5 + self.d, 2.0, kmax)
        return _even_reflect(J, u, conj=self.cplx), N


class DHType(Obj):
    """Re or Im part of a complex primitive character kernel; sign: first non-zero coefficient positive."""

    def __init__(self, chi, part, name):
        assert chi.cplx
        self.chi = chi
        self.part = part
        self.name = name
        co = chi.c.real if part == 'Re' else chi.c.imag
        nz = np.nonzero(np.abs(co) > 1e-9)[0][0]
        self.sgn = 1.0 if co[nz] > 0 else -1.0
        self.coef = self.sgn * co               # 2 a(n) n^d, real

    def jn(self, u, kmax, pol):
        J, N = self.chi.jn(u, kmax, pol)
        return self.sgn * (J.real if self.part == 'Re' else J.imag), N


class TNR(Obj):
    def __init__(self, p0, c, name):
        self.p0 = p0
        self.c = c
        self.name = name
        self.l = math.log(p0)

    def jn(self, u, kmax, pol):
        u = np.asarray(u, dtype=np.float64)
        a, na = ZETA.jn(u + self.l, kmax, pol)
        b, nb = ZETA.jn(u, kmax, pol)
        c, nc = ZETA.jn(u - self.l, kmax, pol)
        return a + self.c * b + c, na + abs(self.c) * nb + nc


class EA(Obj):
    """E*(i e^u, 1/2 + a); a real in (0, 1/2) (E_a) or complex (EIS-w)."""
    HT = 0.08
    NB = 8

    def __init__(self, a, name):
        import mpmath as mp
        self.a = a
        self.name = name
        self.cplx = isinstance(a, complex) and a.imag != 0
        mp.mp.dps = 30
        am = mp.mpc(a) if self.cplx else mp.mpf(a)

        def xis(s):
            return mp.pi ** (-s / 2) * mp.gamma(s / 2) * mp.zeta(s)
        c1 = xis(1 + 2 * am)
        c2 = xis(2 * am)
        cv = complex if self.cplx else float
        self.c1 = cv(c1)
        self.c2 = cv(c2)
        ac = complex(a) if self.cplx else float(a)
        self.e1 = 0.5 + ac
        self.e2 = 0.5 - ac
        coef = []
        A = []
        tmax = math.acosh(1 + 50.0 / (2 * PI))
        nt = int(tmax / self.HT) + 2
        for n in range(1, self.NB + 1):
            sig = sum(d ** (-2 * ac) for d in range(1, n + 1) if n % d == 0)
            cn = 4 * n ** ac * sig
            for j in range(nt):
                t = j * self.HT
                wt = self.HT * (0.5 if j == 0 else 1.0)
                coef.append(cn * wt * (np.cosh(ac * t)))
                A.append(2 * PI * n * math.cosh(t))
        self.coef = np.array(coef)
        self.A = np.array(A)
        b1 = self.e1 ** 2
        b2 = self.e2 ** 2
        self.P = (b1 * b2, -(b1 + b2), 1.0)      # P(D) = D^4 - (b1+b2) D^2 + b1 b2

    def jn(self, u, kmax, pol):
        u = np.asarray(u, dtype=np.float64)
        v = np.abs(u)
        if pol:
            J, N = expsum_jn(v, self.coef, self.A, 0.5, 1.0, kmax)
            if self.cplx and not np.iscomplexobj(J):
                J = J.astype(np.complex128)
            x1 = self.c1 * np.exp(self.e1 * v)
            x2 = self.c2 * np.exp(self.e2 * v)
            N = 100 * N                                   # quadrature of the Bessel integral: relative 1e-13 of the abs-sum
            for k in range(kmax + 1):
                J[k] += x1 * self.e1 ** k + x2 * self.e2 ** k
                N[k] += 4 * EPS * (np.abs(x1) * abs(self.e1) ** k + np.abs(x2) * abs(self.e2) ** k)
        else:
            S, M = expsum_jn(v, self.coef, self.A, 0.5, 1.0, kmax + 4)
            J = self.P[0] * S[:kmax + 1] + self.P[1] * S[2:kmax + 3] + self.P[2] * S[4:kmax + 5]
            N = 100 * (abs(self.P[0]) * M[:kmax + 1] + abs(self.P[1]) * M[2:kmax + 3] + abs(self.P[2]) * M[4:kmax + 5])
        return _even_reflect(J, u), N


_GL = None


def _gl(n=24):
    global _GL
    if _GL is None:
        _GL = np.polynomial.legendre.leggauss(n)
    return _GL


class Heat(Obj):
    """K3 = e^(tau u^2/4) K3_zeta; Kpol = even solution of (D^2 - 1/4) Kpol = K3 (PREREG section 2)."""
    STEP = 0.05
    UMAX = 3.0

    def __init__(self, tau, name):
        self.tau = tau
        self.name = name
        x, w = _gl()
        nb = int(round(self.UMAX / self.STEP))
        self.b = np.arange(nb + 1) * self.STEP
        mid = (self.b[:-1] + self.b[1:]) / 2
        pts = (mid[:, None] + (self.STEP / 2) * x[None, :]).ravel()
        f = self._f(pts, 0)[0].reshape(nb, len(x))
        ww = (self.STEP / 2) * w[None, :]
        p1 = (f * np.exp(pts / 2).reshape(nb, -1) * ww).sum(1)
        p2 = (f * np.exp(-pts / 2).reshape(nb, -1) * ww).sum(1)
        self.J1 = np.concatenate((np.cumsum(p1[::-1])[::-1], [0.0]))   # int_{b_j}^{UMAX}
        self.I2 = np.concatenate((np.cumsum(p2[::-1])[::-1], [0.0]))
        self.c = self.J1[0] + self.I2[0]

    def _f(self, v, kmax, noise=False):
        """jets of K3 at v (any sign)."""
        Z, NZ = ZETA.jn(v, kmax, False)
        t = self.tau
        G = np.zeros((kmax + 1, np.size(v)))
        G[0] = np.exp(t * v * v / 4)
        if kmax >= 1:
            G[1] = (t * v / 2) * G[0]
        for k in range(1, kmax):
            G[k + 1] = (t / 2) * (v * G[k] + k * G[k - 1])
        out = np.zeros_like(Z)
        nz = np.zeros_like(Z)
        for k in range(kmax + 1):
            for j in range(k + 1):
                out[k] += math.comb(k, j) * G[j] * Z[k - j]
                nz[k] += math.comb(k, j) * np.abs(G[j]) * (NZ[k - j] + 4 * EPS * np.abs(Z[k - j]))
        return (out, nz) if noise else out

    def jn(self, u, kmax, pol):
        u = np.asarray(u, dtype=np.float64)
        if not pol:
            return self._f(u, kmax, True)
        v = np.abs(u)
        vv = np.minimum(v, self.UMAX)
        j = np.minimum(np.ceil(vv / self.STEP - 1e-12).astype(int), len(self.b) - 1)
        bj = self.b[j]
        x, w = _gl()
        half = (bj - vv) / 2
        pts = vv[:, None] + half[:, None] * (x[None, :] + 1)
        f = self._f(pts.ravel(), 0)[0].reshape(pts.shape)
        j1 = self.J1[j] + (f * np.exp(pts / 2) * w[None, :]).sum(1) * half
        i2 = self.I2[j] + (f * np.exp(-pts / 2) * w[None, :]).sum(1) * half
        ep = np.exp(v / 2)
        em = np.exp(-v / 2)
        J = np.zeros((kmax + 1, u.size))
        N = np.zeros((kmax + 1, u.size))
        J[0] = self.c * ep + em * j1 - ep * i2
        N[0] = 20 * EPS * (abs(self.c) * ep + np.abs(em * j1) + np.abs(ep * i2))
        if kmax >= 1:
            J[1] = 0.5 * (self.c * ep - em * j1 - ep * i2)
            N[1] = N[0] / 2
        if kmax >= 2:
            F, NF = self._f(v, kmax - 2, True)
            for k in range(kmax - 1):
                J[k + 2] = J[k] / 4 + F[k]
                N[k + 2] = N[k] / 4 + NF[k]
        return _even_reflect(J, u), N


class NoFE(Obj):
    """e^(u/2)(1 + 2 sum a(n) exp(-pi n^2 e^(2u))); a indexed by n (a[0] unused)."""

    def __init__(self, a, name):
        self.a = np.asarray(a)
        self.name = name
        self.cplx = np.iscomplexobj(self.a)

    def _sum(self, u, kmax):
        umin = float(np.min(u)) if np.size(u) else 0.0
        N = nmax_gauss(PI, umin)
        assert N < len(self.a), ('coefficient table too short', N, len(self.a), umin)
        n = np.arange(1, N + 1)
        return expsum_jn(u, 2.0 * self.a[1:N + 1], PI * n * n, 0.5, 2.0, kmax)

    def jn(self, u, kmax, pol):
        u = np.asarray(u, dtype=np.float64)
        if pol:
            J, N = self._sum(u, kmax)
            e = np.exp(u / 2)
            for k in range(kmax + 1):
                J[k] = J[k] + e * 0.5 ** k
                N[k] = N[k] + EPS * e * 0.5 ** k
            return J, N
        S, M = self._sum(u, kmax + 2)
        return S[2:] - 0.25 * S[:-2], M[2:] + 0.25 * M[:-2]


# ---------- Taylor-jet arithmetic (coefficients f^(k)/k!) for theta^w ----------
def _fact(kmax):
    return np.array([math.factorial(k) for k in range(kmax + 1)], dtype=np.float64)[:, None]


def tmul(a, b):
    K = a.shape[0]
    c = np.zeros_like(a)
    for k in range(K):
        for j in range(k + 1):
            c[k] += a[j] * b[k - j]
    return c


class ThetaW(Obj):
    """K_zeta^w = e^(w|u|/2) (1 + eps)^w, eps = 2 sum exp(-pi n^2 e^(2|u|))."""

    def __init__(self, w, name):
        self.w = w
        self.name = name

    def _g(self, v, K):
        """Taylor coefficients (k = 0..K) of g = (1+eps)^w at v >= 0, and g - 1 in slot 0 kept as g."""
        n = np.arange(1, nmax_gauss(PI, 0.0) + 1)
        E = expsum_jets(v, 2.0 * np.ones(len(n)), PI * n * n, 0.0, 2.0, K) / _fact(K)
        # h = log(1+eps): h' = eps'/(1+eps)
        h = np.zeros_like(E)
        h[0] = np.log1p(E[0])
        one = 1.0 + E[0]
        for k in range(1, K + 1):
            s = k * E[k]
            for j in range(1, k):
                s = s - j * h[j] * E[k - j]
            h[k] = s / (k * one)
        g = np.zeros_like(E)
        g[0] = np.exp(self.w * h[0])
        for k in range(1, K + 1):
            s = 0.0
            for j in range(1, k + 1):
                s = s + j * self.w * h[j] * g[k - j]
            g[k] = s / k
        return g

    def jn(self, u, kmax, pol):
        u = np.asarray(u, dtype=np.float64)
        v = np.abs(u)
        w = self.w
        ex = np.zeros((kmax + 1, v.size))
        e0 = np.exp(w * v / 2)
        for k in range(kmax + 1):
            ex[k] = e0 * (w / 2) ** k / math.factorial(k)
        if pol:
            g = self._g(v, kmax)
            J = tmul(ex, g) * _fact(kmax)
            N = 20 * EPS * tmul(ex, np.abs(g)) * _fact(kmax)
        else:
            g = self._g(v, kmax + 2)
            # r = g'' + w g' in Taylor coefficients
            r = np.zeros((kmax + 1, v.size))
            ra = np.zeros((kmax + 1, v.size))
            for k in range(kmax + 1):
                r[k] = (k + 2) * (k + 1) * g[k + 2] + w * (k + 1) * g[k + 1]
                ra[k] = np.abs((k + 2) * (k + 1) * g[k + 2]) + np.abs(w * (k + 1) * g[k + 1])
            J = tmul(ex, r) * _fact(kmax)
            N = 100 * EPS * tmul(ex, ra) * _fact(kmax)
        return _even_reflect(J, u), N


class Synth(Obj):
    """planted-test kernels exp(-alpha u^2)(1 + c u^2)."""

    def __init__(self, alpha, c, name):
        self.alpha = alpha
        self.c = c
        self.name = name

    def jn(self, u, kmax, pol):
        J = self._jets(u, kmax, pol)
        return J, 20 * EPS * np.abs(J) + 1e-300

    def _jets(self, u, kmax, pol):
        u = np.asarray(u, dtype=np.float64)
        al = self.alpha
        G = np.zeros((kmax + 1, u.size))
        G[0] = np.exp(-al * u * u)
        if kmax >= 1:
            G[1] = -2 * al * u * G[0]
        for k in range(1, kmax):
            G[k + 1] = -2 * al * (u * G[k] + k * G[k - 1])
        Pj = [1 + self.c * u * u, 2 * self.c * u, 2 * self.c * np.ones_like(u)]
        out = np.zeros_like(G)
        for k in range(kmax + 1):
            for j in range(min(k, 2) + 1):
                out[k] += math.comb(k, j) * Pj[j] * G[k - j]
        return out


def hecke_jn(obj, u, kmax, pol, p):
    """jets and noise of k = K (p = 0) or (1 - p^(-1/2) D_p) K."""
    J, N = obj.jn(u, kmax, pol)
    if p:
        J2, N2 = obj.jn(np.asarray(u) + math.log(p), kmax, pol)
        J = J - J2 / math.sqrt(p)
        N = N + N2 / math.sqrt(p) + 2 * EPS * np.abs(J2) / math.sqrt(p)
    return J, N


def hecke_jets(obj, u, kmax, pol, p):
    return hecke_jn(obj, u, kmax, pol, p)[0]


# ---------- Dirichlet characters ----------
def _factor(q):
    f = {}
    p = 2
    while p * p <= q:
        while q % p == 0:
            f[p] = f.get(p, 0) + 1
            q //= p
        p += 1
    if q > 1:
        f[q] = f.get(q, 0) + 1
    return f


def _local_exponent(p, e):
    """returns function (m, n) -> rational exponent x with chi_{p^e}(m, n) = e(x)."""
    pe = p ** e
    if p == 2:
        if e == 1:
            return lambda m, n: 0.0
        if e == 2:
            return lambda m, n: ((1 - (1 if m % 4 == 1 else -1)) * (1 - (1 if n % 4 == 1 else -1))) / 8.0
        lg = {}
        x = 1
        for b in range(2 ** (e - 2)):
            lg[x] = (1, b)
            lg[pe - x] = (-1, b)
            x = x * 5 % pe
        return lambda m, n: ((1 - lg[m % pe][0]) * (1 - lg[n % pe][0])) / 8.0 + lg[m % pe][1] * lg[n % pe][1] / 2.0 ** (e - 2)
    phi = (p - 1) * p ** (e - 1)
    g = 2
    while True:
        # primitive root mod p^e: order phi
        x = 1
        ok = True
        seen = 0
        for k in range(1, phi + 1):
            x = x * g % pe
            if x == 1:
                seen = k
                break
        if seen == phi:
            break
        g += 1
    lg = {}
    x = 1
    for b in range(phi):
        lg[x] = b
        x = x * g % pe
    return lambda m, n: lg[m % pe] * lg[n % pe] / phi


def characters(q):
    """all Dirichlet characters mod q as (m, values[0..q-1]); chi(m, n) multiplicative in both arguments."""
    fac = _factor(q)
    loc = [(p ** e, _local_exponent(p, e)) for p, e in fac.items()]
    units = [n for n in range(1, q) if math.gcd(n, q) == 1]
    out = []
    for m in units:
        v = np.zeros(q, dtype=np.complex128)
        for n in units:
            x = sum(f(m, n) for _, f in loc)
            v[n] = np.exp(2j * PI * x)
        out.append((m, v))
    return out


def is_primitive(q, v):
    for p in _factor(q):
        d = q // p
        found = False
        for n in range(1, q, d):
            if math.gcd(n, q) == 1 and abs(v[n] - 1) > 1e-9:
                found = True
                break
        if not found:
            return False
    return True


def primitive_reps(q):
    """primitive characters mod q, one per conjugate pair (smaller m); returns list of (m, values, is_real)."""
    if q < 3:
        return []
    out = []
    for m, v in characters(q):
        if not is_primitive(q, v):
            continue
        minv = pow(m, -1, q)
        if m > minv:
            continue
        v = np.where(np.abs(v.imag) < 1e-13, v.real, v)
        v = np.where(np.abs(v.real) < 1e-13, 1j * v.imag, v)
        out.append((m, v, m == minv))
    return out
