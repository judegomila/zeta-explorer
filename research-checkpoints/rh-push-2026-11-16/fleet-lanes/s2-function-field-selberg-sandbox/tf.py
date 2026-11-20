"""tf.py: Selberg trace formula as an explicit formula. Linear functionals on even test functions g (h(r) = int g(u) e^{iru} du).
Twisted Gamma(2), character singular at the three cusps (area 2 pi, no continuous spectrum):
   sum_j h(r_j) = I_{2pi}[g] + Hyp_chi[g] - g(0) sum_j log(2 sin(pi alpha_j))
PSL2(Z) (area pi/3):
   sum_{j>=0} h(r_j) = I_{pi/3}[g] + Hyp[g] + Ell[g] + g(0) log(pi/2) - P1[g] - P2[g] + 2 sum_n Lambda(n) g(2 log n)/n
   (j = 0 is the constant function, r_0 = i/2; the last term is the continuous spectrum, phi = Lambda(2s-1)/Lambda(2s)).
I_A[g] = -(A/2pi) int_0^inf g'(u)/sinh(u/2) du,  Hyp[g] = sum_t l_t w_t g(l_t)/(N_t^{1/2} - N_t^{-1/2}),
Ell[g] = int_0^inf g(u) [ (1/4)/cosh(u/2) + (2/3) cosh(u/2)/(cosh u + 1/2) ] du   (overall factor fixed by tf_validate.py),
P1 = (1/2pi) int h psi(1+ir) = -gamma g(0) + int_0^inf (g(0) - g(u))/(e^u - 1) du,
P2 = (1/2pi) int h psi(1/2+ir) = -gamma g(0) + int_0^inf (g(0) e^{-u} - g(u) e^{-u/2})/(1 - e^{-u}) du."""
import math
import numpy as np
EULER = 0.5772156649015329
def load_geod(path):
    with open(path) as f:
        f.readline(); a = [float(x) for x in f.readline().split()[2:]]; b = [float(x) for x in f.readline().split()[2:]]
    d = np.loadtxt(path)
    t = d[:, 0]
    sq = (t + np.sqrt(t * t - 4.0)) / 2
    ell = 2 * np.log(sq); amp = ell / (sq - 1 / sq)
    return dict(t=t, ell=ell, amp=amp, cnt=d[:, 1], tw=d[:, 2:], a=a, b=b)
def cusp_const(a, b):
    al = [x % 1.0 for x in (a, b, a - b)]
    return sum(math.log(2 * math.sin(math.pi * x)) for x in al)
def mangoldt_upto(n):
    lam = np.zeros(n + 1); sieve = np.ones(n + 1, bool); sieve[:2] = False
    for p in range(2, n + 1):
        if sieve[p]:
            sieve[p * p::p] = False
            pk = p
            while pk <= n: lam[pk] = math.log(p); pk *= p
    return lam
# ---------- generic (callable g, gp = g') functionals by quadrature on [0, S] ----------
_gl = np.polynomial.legendre.leggauss(24)
def _quad(fun, lo, hi, pieces):
    edges = np.linspace(lo, hi, pieces + 1); tot = 0.0
    x, w = _gl
    for a_, b_ in zip(edges[:-1], edges[1:]):
        u = 0.5 * (b_ - a_) * x + 0.5 * (a_ + b_); tot += 0.5 * (b_ - a_) * np.dot(w, fun(u))
    return tot
def ident(g, gp, S, area, pieces=400):
    return -(area / (2 * math.pi)) * _quad(lambda u: gp(u) / np.sinh(u / 2), 0, S, pieces)
def ell_term(g, S, pieces=400):
    return _quad(lambda u: g(u) * (0.25 / np.cosh(u / 2) + (2 / 3) * np.cosh(u / 2) / (np.cosh(u) + 0.5)), 0, S, pieces)
def P1(g, S, pieces=400):
    g0 = float(g(np.array([0.0]))[0])
    return -EULER * g0 + _quad(lambda u: (g0 - g(u)) / np.expm1(u), 0, S, pieces) - g0 * math.log1p(-math.exp(-S))
def P2(g, S, pieces=400):
    g0 = float(g(np.array([0.0]))[0])
    return -EULER * g0 + _quad(lambda u: (g0 * np.exp(-u) - g(u) * np.exp(-u / 2)) / (-np.expm1(-u)), 0, S, pieces) - g0 * math.log1p(-math.exp(-S))
def hyp(g, G, w):
    return float(np.sum(G['amp'] * w * g(G['ell'])))
def prime_term(g, S):
    n = int(math.exp(S / 2)) + 1; lam = mangoldt_upto(n); idx = np.nonzero(lam)[0]
    return float(2 * np.sum(lam[idx] / idx * g(2 * np.log(idx))))
def psl_all(g, gp, S, G, pieces=400):
    """returns the pieces of the PSL2(Z) geometric side; sum = sum_{j>=0} h(r_j)."""
    g0 = float(g(np.array([0.0]))[0])
    return dict(I=ident(g, gp, S, math.pi / 3, pieces), Hyp=hyp(g, G, G['cnt']), Ell=ell_term(g, S, pieces), const=g0 * math.log(math.pi / 2),
                P1=-P1(g, S, pieces), P2=-P2(g, S, pieces), prime=prime_term(g, S))
def tw_all(g, gp, S, G, c, pieces=400):
    g0 = float(g(np.array([0.0]))[0])
    return dict(I=ident(g, gp, S, 2 * math.pi, pieces), Hyp=hyp(g, G, G['tw'][:, c]), par=-g0 * cusp_const(G['a'][c], G['b'][c]))
# ---------- spline (hat-function) Galerkin: Toeplitz matrices ----------
def B3(x):
    x = np.abs(x); out = np.zeros_like(x)
    m1 = x < 1; m2 = (x >= 1) & (x < 2)
    out[m1] = 2 / 3 - x[m1] ** 2 + x[m1] ** 3 / 2
    out[m2] = (2 - x[m2]) ** 3 / 6
    return out
def B3p(x):
    s = np.sign(x); x = np.abs(x); out = np.zeros_like(x)
    m1 = x < 1; m2 = (x >= 1) & (x < 2)
    out[m1] = -2 * x[m1] + 1.5 * x[m1] ** 2
    out[m2] = -0.5 * (2 - x[m2]) ** 2
    return s * out
def Gk(k, d):
    """even function G_k(u) = (d/2)[B3((u - k d)/d) + B3((u + k d)/d)] and its derivative; f_i = hat at (i+1)d, <f_i * f_j~> gives G_{|i-j|}."""
    g = lambda u: 0.5 * d * (B3((u - k * d) / d) + B3((u + k * d) / d))
    gp = lambda u: 0.5 * (B3p((u - k * d) / d) + B3p((u + k * d) / d))
    return g, gp
def deposit(ell, amp, d, n):
    """m_k = sum amp * G_k(ell), k = 0..n-1 (ell > 0)."""
    m = np.zeros(n + 4)
    k0 = np.floor(ell / d).astype(np.int64)
    for off in (-1, 0, 1, 2):
        k = k0 + off; ok = (k >= 0) & (k < n)
        val = 0.5 * d * B3(ell[ok] / d - k[ok]) * amp[ok]
        np.add.at(m, k[ok], val)
    # k = 0: G_0(u) = d B3(u/d) (both halves coincide)
    m[0] *= 2
    return m[:n]
def arch_entries(n, d, func):
    """m_k = func(g, gp, S) for G_k, k = 0..n-1; quadrature on knot intervals."""
    out = np.zeros(n)
    for k in range(n):
        g, gp = Gk(k, d); S = (k + 2) * d
        out[k] = func(g, gp, S, k + 2)
    return out
def toeplitz(m, n):
    idx = np.abs(np.arange(n)[:, None] - np.arange(n)[None, :]); return m[idx]
def gram(n, d):
    m = np.zeros(n); m[0] = d * 2 / 3
    if n > 1: m[1] = d / 6
    return toeplitz(m, n)
def min_eig(M, Gm):
    from scipy.linalg import eigh
    w, v = eigh(M, Gm, subset_by_index=[0, 0]); return float(w[0]), v[:, 0]
