"""Suzuki truncated operator K^{omega,nu}[t] for zeta / Davenport-Heilbronn / sign-twist.

K(x) = sum_{n <= e^x} q(n) n^{-1/2} G(x - log n),  G = inverse Laplace of (gamma(s-om)/gamma(s+om))^nu
K[t] : L^2(-t,t) -> L^2(-t,t), kernel K(x+y).
Galerkin in orthonormal Legendre basis (degree < p). Float64 linear algebra; G table via mpmath Talbot.

M_ij = int_0^{2t} K(u) C_ij(u) du,  C_ij(u) = int_{u-t}^{t} phi_i(x) phi_j(u-x) dx  (polynomial, deg <= 2p-1)
     = sum_k kappa_k C_ij(u_k),  kappa_k = w_k sum_j Phat_j(u_k) mhat_j,  mhat_j = int_0^{2t} K Phat_j.
"""
import sys, json, math
import numpy as np
import mpmath as mp
from numpy.polynomial import legendre as L, chebyshev as Ch
from scipy.special import roots_jacobi

# ---------------- arithmetic coefficients ----------------
def dirichlet_conv(a, b, N):
    c = np.zeros(N + 1)
    for d in range(1, N + 1):
        if a[d] == 0.0:
            continue
        m = np.arange(1, N // d + 1)
        c[d * m] += a[d] * b[m]
    return c

def dirichlet_inv(a, N):
    b = np.zeros(N + 1)
    b[1] = 1.0 / a[1]
    for n in range(2, N + 1):
        s = 0.0
        for d in range(1, int(n ** 0.5) + 1):
            if n % d == 0:
                e = n // d
                if d < n:
                    s += a[n // d] * b[d]
                if e != d and e < n:
                    s += a[n // e] * b[e]
        b[n] = -s / a[1]
    return b

def coeffs(kind, om, nu, N):
    n = np.arange(0, N + 1, dtype=float)
    if kind in ("zeta", "twist2", "twistall"):
        a = np.ones(N + 1); a[0] = 0
        if kind == "zeta":
            num = a * n ** om            # zeta(s-om)
            mu = dirichlet_inv(a, N)
            den = mu * np.where(n > 0, n, 1) ** (-om)   # 1/zeta(s+om)
            c1 = dirichlet_conv(num, den, N)
        else:
            # Lambda(n) -> eps_n Lambda(n): eps=-1 on powers of 2 (twist2) or on all n (twistall)
            if kind == "twistall":
                # exp(-sum Lambda ...) : zeta(s+om)/zeta(s-om)
                num = a * np.where(n > 0, n, 1) ** (-om); num[0] = 0
                mu = dirichlet_inv(a, N)
                den = mu * n ** om
                c1 = dirichlet_conv(num, den, N)
            else:
                # invert only the Euler factor at 2
                z = dirichlet_conv(a * n ** om, dirichlet_inv(a, N) * np.where(n > 0, n, 1) ** (-om), N)
                # multiply by [(1-2^{-s+om})/(1-2^{-s-om})]^2
                f = np.zeros(N + 1); f[1] = 1.0
                k = 1
                while 2 ** k <= N:
                    f[2 ** k] = 2.0 ** (-om * k) * (1 - 2.0 ** (2 * om)); k += 1
                c1 = dirichlet_conv(dirichlet_conv(z, f, N), f, N)
    elif kind == "dh":
        s5 = math.sqrt(5.0)
        kap = (math.sqrt(10 - 2 * s5) - 2) / (s5 - 1)
        tab = [0.0, 1.0, kap, -kap, -1.0]
        a = np.array([0.0] + [tab[m % 5] for m in range(1, N + 1)])
        b = dirichlet_inv(a, N)
        num = a * n ** om
        den = b * np.where(n > 0, n, 1) ** (-om)
        c1 = dirichlet_conv(num, den, N)
    else:
        raise ValueError(kind)
    c = c1.copy()
    for _ in range(nu - 1):
        c = dirichlet_conv(c, c1, N)
    return c

# ---------------- gamma kernel G via Talbot ----------------
def Fgamma(kind, om, nu):
    om = mp.mpf(om)
    if kind == "dh":
        lc = -om * mp.log(mp.mpf(5) / mp.pi)
        def F(s):
            return mp.exp(nu * (lc + mp.loggamma((s + 1 - om) / 2) - mp.loggamma((s + 1 + om) / 2)))
        sig = om - 1
    else:
        lc = om * mp.log(mp.pi)
        def F(s):
            return ((s - om - 1) / (s + om - 1)) ** nu * mp.exp(
                nu * (lc + mp.loggamma((s - om) / 2 + 1) - mp.loggamma((s + om) / 2 + 1)))
        sig = 1 - om
    return F, sig

def talbot(F, sig, w, N=44):
    # G(w) = (1/2 pi i) int F(s) e^{(s-1/2) w} ds, singularities of F on (-inf, sig]
    w = mp.mpf(w)
    tot = mp.mpc(0)
    for k in range(N):
        th = -mp.pi + (2 * k + 1) * mp.pi / N
        c = mp.mpf('0.6407') * th
        ct = mp.cot(c)
        z = (N / w) * (mp.mpf('0.5017') * th * ct - mp.mpf('0.6122') + mp.mpc(0, 1) * mp.mpf('0.2645') * th)
        dz = (N / w) * (mp.mpf('0.5017') * ct - mp.mpf('0.5017') * mp.mpf('0.6407') * th / mp.sin(c) ** 2
                        + mp.mpc(0, 1) * mp.mpf('0.2645'))
        s = sig + z
        tot += mp.exp((s - mp.mpf(1) / 2) * w) * F(s) * dz
    return (tot / (mp.mpc(0, 1) * N)).real

class GTable:
    """A(w) = G(w)/w^beta on [0,W], Chebyshev panels of width h."""
    def __init__(self, kind, om, nu, W, h=0.5, deg=26, dps=40, NT=44):
        mp.mp.dps = dps
        self.beta = nu * om - 1.0
        self.h = h
        self.np_ = int(math.ceil(W / h)) + 1
        F, sig = Fgamma(kind, om, nu)
        self.cf = []
        xk = np.cos(np.pi * (np.arange(deg + 1) + 0.5) / (deg + 1))
        for i in range(self.np_):
            lo = i * h
            ws = lo + (xk + 1) * h / 2
            vals = np.array([float(talbot(F, sig, w, NT) / mp.mpf(w) ** self.beta) for w in ws])
            self.cf.append(Ch.chebfit(xk, vals, deg))
        self.cf = np.array(self.cf)
    def A(self, w):
        w = np.asarray(w, dtype=float)
        i = np.minimum((w / self.h).astype(int), self.np_ - 1)
        x = 2 * (w - i * self.h) / self.h - 1
        out = np.zeros_like(w)
        for j in np.unique(i):
            m = (i == j)
            out[m] = Ch.chebval(x[m], self.cf[j])
        return out
    def G(self, w):
        return np.asarray(w, float) ** self.beta * self.A(w)

# ---------------- Galerkin ----------------
def leg_orthonormal(x, n, a, b):
    """values of orthonormal Legendre on [a,b], degrees 0..n-1, shape (n, len(x))"""
    xi = (2 * x - (a + b)) / (b - a)
    V = L.legvander(xi, n - 1).T
    return V * np.sqrt((2 * np.arange(n) + 1) / (b - a))[:, None]

def moments(tab, a_n, t, nq, panel=0.5, qn=None):
    """mhat_j = int_0^{2t} K(u) Phat_j(u) du, j < nq (orthonormal Legendre on [0,2t])"""
    if qn is None:
        qn = nq // 2 + 24
    T2 = 2 * t
    beta = tab.beta
    xj, wj = roots_jacobi(qn, 0.0, beta)       # weight (1+x)^beta on [-1,1]
    xl, wl = L.leggauss(qn)
    m = np.zeros(nq)
    N = int(math.floor(math.exp(T2) + 1e-12))
    for n in range(1, N + 1):
        if a_n[n] == 0.0:
            continue
        ln = math.log(n)
        Ln = T2 - ln
        if Ln <= 0:
            continue
        h0 = min(panel, Ln)
        # first panel [0,h0] with Jacobi weight w^beta
        w = (xj + 1) * h0 / 2
        wt = wj * (h0 / 2) ** (beta + 1)
        acc = (leg_orthonormal(w + ln, nq, 0.0, T2) * (wt * tab.A(w))[None, :]).sum(axis=1)
        lo = h0
        while lo < Ln - 1e-15:
            hi = min(lo + panel, Ln)
            w = lo + (xl + 1) * (hi - lo) / 2
            wt = wl * (hi - lo) / 2
            acc += (leg_orthonormal(w + ln, nq, 0.0, T2) * (wt * tab.G(w))[None, :]).sum(axis=1)
            lo = hi
        m += a_n[n] / math.sqrt(n) * acc
    return m

def galerkin(tab, a_n, t, p):
    nq = 2 * p + 2
    T2 = 2 * t
    mh = moments(tab, a_n, t, nq)
    xg, wg = L.leggauss(nq)
    u = (xg + 1) * t
    wu = wg * t
    kappa = wu * (leg_orthonormal(u, nq, 0.0, T2) * mh[:, None]).sum(axis=0)
    xq, wq = L.leggauss(p + 1)
    M = np.zeros((p, p))
    for k in range(nq):
        lo, hi = u[k] - t, t
        x = lo + (xq + 1) * (hi - lo) / 2
        wx = wq * (hi - lo) / 2
        X = leg_orthonormal(x, p, -t, t)
        Y = leg_orthonormal(u[k] - x, p, -t, t)
        M += kappa[k] * (X * wx[None, :]) @ Y.T
    return 0.5 * (M + M.T), mh

def analyse(M):
    ev = np.linalg.eigvalsh(M)
    lam_max, lam_min = ev[-1], ev[0]
    sdp, ldp = np.linalg.slogdet(np.eye(len(M)) + M)
    sdm, ldm = np.linalg.slogdet(np.eye(len(M)) - M)
    return dict(lam_max=float(lam_max), lam_min=float(lam_min), norm=float(max(abs(lam_max), abs(lam_min))),
                gap_plus=float(1 - lam_max), gap_minus=float(1 + lam_min),
                sign_det_plus=float(sdp), logabs_det_plus=float(ldp),
                sign_det_minus=float(sdm), logabs_det_minus=float(ldm),
                hs2=float((ev ** 2).sum()), tr=[float((ev ** k).sum()) for k in range(1, 9)],
                n_neg_1mK=int((ev > 1).sum()), n_neg_1pK=int((ev < -1).sum()),
                top=[float(v) for v in ev[-4:]], bottom=[float(v) for v in ev[:4]])

if __name__ == "__main__":
    kind = sys.argv[1]; om = float(sys.argv[2]); nu = int(sys.argv[3])
    ts = [float(v) for v in sys.argv[4].split(",")]
    ps = [int(v) for v in sys.argv[5].split(",")]
    out = sys.argv[6]
    tmax = max(ts)
    N = int(math.floor(math.exp(2 * tmax))) + 1
    a_n = coeffs(kind, om, nu, N)
    tab = GTable(kind, om, nu, 2 * tmax + 0.01)
    res = []
    for t in ts:
        for p in ps:
            M, mh = galerkin(tab, a_n, t, p)
            r = analyse(M)
            r.update(kind=kind, om=om, nu=nu, t=t, p=p)
            res.append(r)
            print(json.dumps({k: r[k] for k in ("kind", "om", "nu", "t", "p", "lam_max", "lam_min", "gap_plus",
                                                  "gap_minus", "sign_det_plus", "logabs_det_plus",
                                                  "sign_det_minus", "logabs_det_minus", "hs2")}), flush=True)
            json.dump(res, open(out, "w"))
