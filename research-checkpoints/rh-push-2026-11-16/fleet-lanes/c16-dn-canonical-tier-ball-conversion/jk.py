"""c14: kernels of the twisted members (float64 / complex128), PREREG sections 2-4.
Every kernel object has val(u, pol) -> (K, N): values at the points u (1-D) and an absolute rounding-noise estimate.
The c13 kernels (kern.py) are wrapped by W."""
import math
import numpy as np
import kern

PI = math.pi
EPS = 1e-15
CUT = 45.0            # terms with exponent more than CUT above the leading one are dropped (e^-45 = 3e-20)
BLOCK = 4_000_000     # entries per exp-sum block (float64: 32 MB)
UMIN = -2.6


class W:
    """wrap a c13 kernel object"""

    def __init__(self, o):
        self.o = o
        self.name = o.name

    def val(self, u, pol=True):
        J, N = self.o.jn(u, 0, pol)
        return J[0], N[0]


class GS:
    """e^(beta u) sum_k c_k P(w_k) exp(-w_k), w_k = A_k e^(gamma u), P a polynomial (ascending coefficients, default 1).
    Per-point truncation: terms with (A_k - A_0) e^(gamma u) > CUT are dropped."""

    def __init__(self, coef, A, beta, gamma, name, pw=None, const=None):
        A = np.asarray(A, dtype=np.float64)
        coef = np.asarray(coef)
        o = np.argsort(A, kind='stable')
        keep = coef[o] != 0
        self.A = A[o][keep]
        self.c = coef[o][keep]
        self.beta = beta
        self.gamma = gamma
        self.name = name
        self.pw = [1.0] if pw is None else list(pw)
        self.const = const            # optional (c0, beta0): adds c0 e^(beta0 u)
        self.cplx = np.iscomplexobj(self.c)
        self.Amax_needed = self.A[0] + CUT / math.exp(gamma * UMIN)
        ca = np.abs(self.c)
        cols = []
        for k, pk in enumerate(self.pw):
            cols.append(pk * self.c * self.A ** k)
        for k, pk in enumerate(self.pw):
            cols.append(abs(pk) * ca * self.A ** k)
        cols.append(ca * self.A * sum(abs(p) for p in self.pw))
        self.C = np.stack(cols, axis=1).astype(np.complex128 if self.cplx else np.float64)

    def val(self, u, pol=True):
        u = np.asarray(u, dtype=np.float64)
        n = u.size
        K = np.zeros(n, dtype=np.complex128 if self.cplx else np.float64)
        N = np.zeros(n)
        if n == 0:
            return K, N
        order = np.argsort(-u, kind='stable')
        us = u[order]
        w = np.exp(self.gamma * us)
        npw = len(self.pw)
        i = 0
        while i < n:
            # block: points i..j; the number of terms is set by the smallest u of the block
            j = min(n, i + 4096)
            while True:
                nt = int(np.searchsorted(self.A, self.A[0] + CUT / w[j - 1], side='right'))
                nt = max(nt, 1)
                if (j - i) * nt <= BLOCK or j - i == 1:
                    break
                j = i + max(1, (j - i) // 2)
            wb = w[i:j]
            E = np.exp(-np.outer(wb, self.A[:nt]))
            R = E @ self.C[:nt]
            v = 0
            a = 0
            for k in range(npw):
                v = v + R[:, k] * wb ** k
                a = a + np.abs(R[:, npw + k]) * wb ** k
            a = a + np.abs(R[:, 2 * npw]) * wb
            eb = np.exp(self.beta * us[i:j])
            K[order[i:j]] = v * eb
            N[order[i:j]] = EPS * a * eb
            i = j
        if self.const is not None:
            c0, b0 = self.const
            e = c0 * np.exp(b0 * u)
            K = K + e
            N = N + EPS * np.abs(e)
        return K, N


def _reflect(fun, u, cplx):
    """K(-u) = conj K(u): evaluate fun at |u|."""
    u = np.asarray(u, dtype=np.float64)
    K, N = fun(np.abs(u))
    if cplx:
        K = np.where(u < 0, np.conj(K), K)
    return K, N


class Lin:
    """sum_j c_j K(u + s_j) of a base kernel object (val interface)"""

    def __init__(self, base, cs, shifts, name):
        self.base = base
        self.cs = cs
        self.shifts = shifts
        self.name = name

    def val(self, u, pol=True):
        u = np.asarray(u, dtype=np.float64)
        K = 0
        N = 0
        for c, s in zip(self.cs, self.shifts):
            k, n = self.base.val(u + s, pol)
            K = K + c * k
            N = N + abs(c) * n
        return K, N


def tnr_twist(chi, p0, c, name):
    """conj(chi(p0)) K_chi(u - l) + c K_chi(u) + chi(p0) K_chi(u + l)"""
    x = complex(chi.vals[p0 % chi.q])
    assert abs(abs(x) - 1) < 1e-9, 'p0 divides the conductor'
    if chi.real:
        x = x.real
    l = math.log(p0)
    o = Lin(W(chi), [np.conj(x), c, x], [-l, 0.0, l], name)
    o.tnr = (chi, p0, c)
    return o


class HeatX:
    def __init__(self, chi, tau, name):
        self.b = W(chi)
        self.tau = tau
        self.name = name

    def val(self, u, pol=True):
        u = np.asarray(u, dtype=np.float64)
        K, N = self.b.val(u)
        g = np.exp(self.tau * u * u / 4)
        return K * g, N * g + 2 * EPS * np.abs(K * g)


class BLS:
    """P_b(D) K, P_b(D) = D^4 - 2 Re(b^2) D^2 + |b|^4, K a c13 object (zeta or chi)"""

    def __init__(self, o, b, name):
        self.o = o
        self.b = b
        self.name = name
        self.p2 = -2 * (b * b).real
        self.p0 = abs(b) ** 4

    def val(self, u, pol=True):
        J, N = self.o.jn(u, 4, pol)
        return J[4] + self.p2 * J[2] + self.p0 * J[0], N[4] + abs(self.p2) * N[2] + self.p0 * N[0]


def general_twist(a, chi, dG, NG, name, nmax=None, src=None):
    """PREREG section 4 general rule; a[n] for n >= 1 (a[0] unused)."""
    d = (dG + chi.d) % 2
    q = chi.q
    N = int(math.sqrt(CUT * NG * q / (PI * math.exp(2 * UMIN)) + 1)) + 2
    if nmax is not None:
        assert N <= nmax, ('coefficient table too short', N, nmax)
    assert N < len(a), ('coefficient table too short', N, len(a))
    n = np.arange(1, N + 1)
    c = np.conj(chi.omega) * 2.0 * np.asarray(a)[1:N + 1] * chi.vals[n % q] * n.astype(np.float64) ** d
    g = GS(c, PI * n * n / (NG * q), 0.5 + d, 2.0, name)
    g.tw = dict(chi=chi, d=d, NG=NG, src=src)
    return g


def dh_coeffs(dh, N):
    """a_G(n), n <= N, of a kern.DHType object (without the factor 2 n^d)."""
    chi = dh.chi
    n = np.arange(0, N + 1)
    z = np.conj(chi.omega) * chi.vals[n % chi.q]
    a = dh.sgn * (z.real if dh.part == 'Re' else z.imag)
    a[0] = 0
    return a


def dh_twist(dh, psi, name):
    NG = dh.chi.q
    N = int(math.sqrt(CUT * NG * psi.q / (PI * math.exp(2 * UMIN)) + 1)) + 4
    return general_twist(dh_coeffs(dh, N), psi, dh.chi.d, NG, name, src=dh)


class EAX:
    """kernel of Lambda(s+a, chi) Lambda(s-a, chi): 4 y^(1/2+d) sum chi(n) n^(a+d) sigma_(-2a)(n) K_a(2 pi n y/q) / omega."""
    HT = 0.08

    def __init__(self, a, chi, name):
        self.a = a
        self.chi = chi
        self.name = name
        q = chi.q
        d = chi.d
        self.cplx = True
        ulow = -0.4
        x1 = 2 * PI / q
        nmax = int((x1 * math.exp(ulow) + CUT) / (x1 * math.exp(ulow))) + 1
        tmax = math.acosh(1 + CUT / (x1 * math.exp(ulow)))
        nt = int(tmax / self.HT) + 2
        t = np.arange(nt) * self.HT
        wt = np.full(nt, self.HT)
        wt[0] *= 0.5
        ct = np.cosh(t)
        coef = []
        A = []
        self.dir = np.zeros(nmax + 1, dtype=np.complex128)
        for n in range(1, nmax + 1):
            x = chi.vals[n % q]
            if abs(x) < 1e-9:
                continue
            sig = sum(dd ** (-2 * a) for dd in range(1, n + 1) if n % dd == 0)
            cn = 4 * x * n ** (a + d) * sig
            self.dir[n] = cn
            coef.append(cn * wt * np.cosh(a * t))
            A.append(x1 * n * ct)
        self.g = GS(np.concatenate(coef), np.concatenate(A), 0.5 + d, 1.0, name + '-raw')
        eps = []
        for u0 in (0.2, 0.35):
            kp = self.g.val(np.array([u0]))[0][0]
            km = self.g.val(np.array([-u0]))[0][0]
            eps.append(km / np.conj(kp))
        self.eps = eps[0]
        self.eps_check = (abs(eps[0] - eps[1]), abs(abs(eps[0]) - 1))
        om = np.sqrt(self.eps)
        if om.real < 0 or (abs(om.real) < 1e-12 and om.imag < 0):
            om = -om
        self.omega = om

    def _pos(self, v):
        K, N = self.g.val(v)
        return np.conj(self.omega) * K, 100 * N       # quadrature of the Bessel integral: relative 1e-13 of the abs-sum

    def val(self, u, pol=True):
        return _reflect(self._pos, u, True)


def theta_w_coeffs(w, M):
    """r_w(m), m = 0..M: theta^w = sum r_w(m) x^m, theta = 1 + 2 sum x^(k^2).
    Recurrence m r(m) = sum_{k>=1} 2 (w k^2 - (m - k^2)) r(m - k^2), run in exact-rounded fixed point with P bits:
    in float64 it is unstable (errors grow like the coefficients of theta_4^(-w-1), about exp(pi sqrt((w+1) m)))."""
    from fractions import Fraction
    fw = Fraction(float(w))
    wn, wd = fw.numerator, fw.denominator
    P = 192 + int(1.5 * 1.4427 * PI * math.sqrt((abs(w) + 1) * M))
    R = [0] * (M + 1)
    R[0] = 1 << P
    k2 = [k * k for k in range(1, int(math.isqrt(M)) + 1)]
    for m in range(1, M + 1):
        s = 0
        for q in k2:
            if q > m:
                break
            s += (wn * q - (m - q) * wd) * R[m - q]
        R[m] = (2 * s) // (m * wd)
    out = np.empty(M + 1)
    for m in range(M + 1):
        x = R[m]
        sh = max(0, abs(x).bit_length() - 64)
        out[m] = math.ldexp(float(x >> sh), sh - P)
    return out


def thw_twist(w, chi, name):
    q = chi.q
    M = int(CUT * q / (PI * math.exp(2 * UMIN)) + 1) + 2
    r = theta_w_coeffs(w, M)
    m = np.arange(1, M + 1)
    c = np.conj(chi.omega) * r[1:] * chi.vals[m % q]
    g = GS(c, PI * m / q, w / 2.0, 2.0, name)
    g.thw = (w, chi)
    return g


def beu_integers(delta, X, primes):
    """generalised integers nu <= X of the Beurling system q_n = p_n + delta: list of (nu, tuple of primes p)."""
    out = [(1.0, ())]
    ps = [int(p) for p in primes if p + delta <= X]

    def rec(start, nu, fac):
        for i in range(start, len(ps)):
            v = nu * (ps[i] + delta)
            if v > X:
                break
            out.append((v, fac + (ps[i],)))
            rec(i, v, fac + (ps[i],))
    rec(0, 1.0, ())
    out.sort()
    return out


class BEU:
    """e^(u/2)(1 + 2 sum_nu exp(-pi nu^2 e^(2u))); K3 = (D^2 - 1/4) of it."""

    def __init__(self, delta, primes, name):
        self.delta = delta
        self.name = name
        X = math.sqrt(CUT / (PI * math.exp(2 * UMIN)) + 1) + 2
        self.ints = beu_integers(delta, X, primes)
        nu = np.array([v for v, _ in self.ints])
        self.gp = GS(2.0 * np.ones(len(nu)), PI * nu * nu, 0.5, 2.0, name, const=(1.0, 0.5))
        self.g3 = GS(2.0 * np.ones(len(nu)), PI * nu * nu, 0.5, 2.0, name, pw=[0.0, -6.0, 4.0])

    def val(self, u, pol=True):
        return (self.gp if pol else self.g3).val(u)


def beu_twist(delta, primes, chi, name):
    q = chi.q
    d = chi.d
    X = math.sqrt(CUT * q / (PI * math.exp(2 * UMIN)) + 1) + 2
    ints = beu_integers(delta, X, primes)
    nu = np.array([v for v, _ in ints])
    x = np.array([np.prod([chi.vals[p % q] for p in fac]) if fac else 1.0 for _, fac in ints], dtype=np.complex128)
    g = GS(np.conj(chi.omega) * 2.0 * x * nu ** d, PI * nu * nu / q, 0.5 + d, 2.0, name)
    g.ints = ints
    g.beu = (delta, chi, d)
    return g


class Synth:
    """exp(-al u^2)(1 + c u^2)"""

    def __init__(self, al, c, name):
        self.al = al
        self.c = c
        self.name = name

    def val(self, u, pol=True):
        u = np.asarray(u, dtype=np.float64)
        K = np.exp(-self.al * u * u) * (1 + self.c * u * u)
        return K, 20 * EPS * np.abs(K) + 1e-300


def fe_residual(k, pts=(0.3, 0.9)):
    """measured functional-equation defect: eps from the first point, residual |K(-u) - eps conj K(u)| / (|K(-u)| + |K(u)|) at the second;
    also the same with the bilinear rule K(-u) = eps K(u)."""
    u = np.array([pts[0], -pts[0], pts[1], -pts[1]])
    K = np.asarray(k.val(u)[0], dtype=np.complex128)
    out = {}
    for lab, f in (('herm', np.conj), ('bil', lambda z: z)):
        eps = K[1] / f(K[0])
        out[lab] = float(abs(K[3] - eps * f(K[2])) / (abs(K[3]) + abs(K[2])))
        out[lab + '_abs_eps'] = float(abs(eps))
    return out
