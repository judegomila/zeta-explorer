"""c1-spinor-hecke-primitive: one-sided Weil form Q_L on box-Fourier modes, prime side.

Test space: v_m(t) = T^{-1/2} exp(i w_m t) 1_[0,T](t), w_m = gc + 2 pi m / T (orthonormal in L^2(0,inf)).
Form: Q(f,g) = <K, f * g~>, K the even distribution with Laplace transform L = F'/F (centered variable z).
Q(S_s v_j, v_k) = [E_s(w_k) - E_s(w_j)] / (2 pi i (m_j - m_k)),  diag D_s(w_j), with
  E_s(w) = <K(y), sgn(y-s) e^{i w (y-s)} 1_{|y-s|<T}>,  D_s(w) = <K(y), (1-|y-s|/T) e^{i w (y-s)} 1_{|y-s|<T}>.
K = atoms (primes, constants) + smooth part + regularised gamma part.
float64 throughout; planned allocations are printed by callers.
"""
import numpy as np, math
from numpy.polynomial.legendre import leggauss
from scipy.special import exp1

KAPPA_DH = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)

def primes_upto(X):
    X = int(X)
    s = np.ones(X + 1, dtype=bool); s[:2] = False
    for i in range(2, int(X ** 0.5) + 1):
        if s[i]: s[i * i::i] = False
    return np.nonzero(s)[0]

def prime_power_atoms(X, sign=None, hfun=None):
    """atoms (y=log n, w=-c(n)/sqrt n) for c(n)=Lambda(n)*sign(p,k)*hfun(log n), n<=X."""
    ps = primes_upto(X)
    ys, ws = [], []
    k = 1
    while True:
        pk = ps[ps.astype(np.float64) ** k <= X]
        if len(pk) == 0: break
        lp = np.log(pk.astype(np.float64))
        y = k * lp
        w = -lp * np.exp(-0.5 * y)
        if sign is not None: w = w * sign(pk, k)
        if hfun is not None: w = w * hfun(y)
        ys.append(y); ws.append(w); k += 1
    return np.concatenate(ys), np.concatenate(ws)

def dh_atoms(X):
    """-f'/f = sum c(n) n^-s for Davenport-Heilbronn; returns atoms (log n, -c(n)/sqrt n)."""
    X = int(X)
    a5 = np.array([0.0, 1.0, KAPPA_DH, -KAPPA_DH, -1.0])
    n = np.arange(X + 1)
    a = a5[n % 5]
    lam = a * np.log(np.maximum(n, 1))
    lam[0] = 0.0
    # lam(n) = a(n) log n - sum_{d|n, 1<d<n} lam(d) a(n/d); lam(1)=0
    for d in range(2, X // 2 + 1):
        ld = lam[d]
        if ld != 0.0:
            m = X // d
            lam[2 * d::d] -= ld * a[2:m + 1]
    idx = np.nonzero(lam)[0]
    y = np.log(idx.astype(np.float64))
    return y, -lam[idx] * np.exp(-0.5 * y)

class Kernel:
    """K = sum_i w_i delta(y - y_i)  +  h(y) [ pol * 2cosh(y/2) - r_b(|y|) ]  + regularised 1/(2|y|) part scaled by h."""
    def __init__(self, name, ay, aw, b=0.25, pol=1.0, ha=0.0, nh=1.0, arch=True):
        o = np.argsort(ay, kind='stable')
        self.name = name; self.ay = np.asarray(ay)[o]; self.aw = np.asarray(aw)[o]
        self.b = b; self.pol = pol; self.ha = ha; self.nh = nh; self.arch = arch
    def h(self, u):
        return self.nh * np.cosh(self.ha * u)
    def r(self, u):
        u = np.abs(u)
        small = u < 1e-4
        us = np.where(small, 1.0, u)
        val = np.exp(-2 * self.b * us) / (-np.expm1(-2 * us)) - np.exp(-2 * us) / (2 * us)
        return np.where(small, (3 - 2 * self.b) / 2, val)
    def smooth(self, y):
        return self.h(y) * (self.pol * 2 * np.cosh(y / 2) - self.r(y))

def sym_atoms(y, w):
    return np.concatenate([y, -y]), np.concatenate([w, w])

def make_kernel(name, X, **kw):
    lp = math.log(math.pi)
    if name == 'zeta':
        y, w = prime_power_atoms(X); y, w = sym_atoms(y, w)
        return Kernel(name, np.append(y, 0.0), np.append(w, -lp))
    if name == 'tw':  # Liouville sign twist: Lambda(n) -> lambda(n) Lambda(n); archimedean and pole terms kept
        y, w = prime_power_atoms(X, sign=lambda p, k: (-1.0) ** k); y, w = sym_atoms(y, w)
        return Kernel(name, np.append(y, 0.0), np.append(w, -lp))
    if name == 'ea':  # zeta(s+a) zeta(s-a)
        a = kw.get('a', 0.2)
        y, w = prime_power_atoms(X, hfun=lambda u: 2 * np.cosh(a * u)); y, w = sym_atoms(y, w)
        return Kernel(name, np.append(y, 0.0), np.append(w, -2 * lp), ha=a, nh=2.0)
    if name == 'nr':  # xi(s) (q^z + q^-z + c)
        q = kw.get('q', 2.0); c = kw.get('c', 2.05)
        r = (c - math.sqrt(c * c - 4)) / 2
        y, w = prime_power_atoms(X)
        ks = np.arange(1, int(math.log(X) / math.log(q)) + 1)
        y2 = ks * math.log(q); w2 = math.log(q) * (-1.0) ** ks * (r ** ks + r ** (-ks))
        y, w = sym_atoms(np.concatenate([y, y2]), np.concatenate([w, w2]))
        return Kernel(name, np.append(y, 0.0), np.append(w, -lp + 2 * math.log(q)))
    if name == 'dh':
        y, w = dh_atoms(X); y, w = sym_atoms(y, w)
        return Kernel(name, np.append(y, 0.0), np.append(w, math.log(5 / math.pi)), b=0.75, pol=0.0)
    if name == 'gram':
        return Kernel(name, np.array([0.0]), np.array([1.0]), arch=False)
    raise ValueError(name)

_GX, _GW = leggauss(6)

def gl_nodes(A, B, breaks, step):
    pts = [A, B] + [x for x in breaks if A < x < B]
    pts = np.unique(np.array(pts))
    xs, ws = [], []
    for lo, hi in zip(pts[:-1], pts[1:]):
        n = max(1, int(math.ceil((hi - lo) / step)))
        e = np.linspace(lo, hi, n + 1)
        mid = 0.5 * (e[1:] + e[:-1]); hw = 0.5 * (e[1:] - e[:-1])
        xs.append((mid[:, None] + hw[:, None] * _GX[None, :]).ravel())
        ws.append((hw[:, None] * _GW[None, :]).ravel())
    return np.concatenate(xs), np.concatenate(ws)

def psiE(x, T):  # envelope of sgn(x) 1_{|x|<T}
    return np.sign(x) * (np.abs(x) < T)
def psiD(x, T):
    return np.clip(1 - np.abs(x) / T, 0.0, None)

def ED(kern, T, omegas, shifts, step=0.01):
    """returns E[s,w], D[s,w] (complex)."""
    om = np.asarray(omegas, dtype=np.float64)
    ns, nw = len(shifts), len(om)
    E = np.zeros((ns, nw), dtype=np.complex128); D = np.zeros_like(E)
    # atoms
    y, w = kern.ay, kern.aw
    idx = []
    for s in shifts:
        idx.append((np.searchsorted(y, s - T, 'right'), np.searchsorted(y, s, 'left'),
                    np.searchsorted(y, s, 'right'), np.searchsorted(y, s + T, 'left')))
    idx = np.array(idx)
    sh = np.asarray(shifts, dtype=np.float64)
    for iw, o in enumerate(om):
        ph = w * np.exp(1j * o * y)
        C0 = np.concatenate([[0], np.cumsum(ph)]); C1 = np.concatenate([[0], np.cumsum(ph * y)])
        i1, i2, i2p, i3 = idx[:, 0], idx[:, 1], idx[:, 2], idx[:, 3]
        up0 = C0[i3] - C0[i2p]; lo0 = C0[i2] - C0[i1]; up1 = C1[i3] - C1[i2p]; lo1 = C1[i2] - C1[i1]
        rot = np.exp(-1j * o * sh)
        E[:, iw] = rot * (up0 - lo0)
        D[:, iw] = rot * ((1 + sh / T) * up0 - up1 / T + (1 - sh / T) * lo0 + lo1 / T + (C0[i2p] - C0[i2]))
    if not kern.arch:
        return E, D
    h0 = float(kern.h(0.0))
    for isx, s in enumerate(shifts):
        # smooth part: int K_sm(y) psi(y-s) e^{i w (y-s)} dy over (s-T, s+T)
        yy, ww = gl_nodes(s - T, s + T, [0.0, s], step)
        x = yy - s
        ks = kern.smooth(yy) * ww
        ph = np.exp(1j * np.outer(om, x))
        E[isx] += ph @ (ks * psiE(x, T)); D[isx] += ph @ (ks * psiD(x, T))
        # regularised part: int_0^U e^{-2u}/(2u) [2 h(0) phi(0) - h(u)(phi(u)+phi(-u))] du + h(0) phi(0) E1(2U)
        U = abs(s) + T
        uu, wu = gl_nodes(0.0, U, [abs(s), abs(s - T), abs(s + T)], step)
        ker = np.exp(-2 * uu) / (2 * uu) * wu
        hu = kern.h(uu)
        for (psi, OUT) in ((psiE, E), (psiD, D)):
            phi0 = psi(np.array([-s]), T)[0] * np.exp(-1j * om * s)          # phi(0) = psi(-s) e^{-i w s}
            pp = np.exp(1j * np.outer(om, uu - s)) * psi(uu - s, T)[None, :]
            pm = np.exp(1j * np.outer(om, -uu - s)) * psi(-uu - s, T)[None, :]
            val = (2 * h0 * phi0[:, None] - hu[None, :] * (pp + pm)) @ ker
            OUT[isx] += val + h0 * phi0 * exp1(2 * U)
    return E, D

def loewner(Ev, Dv, mm):
    """Q[j,k] = (E(w_k)-E(w_j))/(2 pi i (m_j-m_k)), diag D."""
    dm = mm[:, None] - mm[None, :]
    num = Ev[None, :] - Ev[:, None]
    with np.errstate(divide='ignore', invalid='ignore'):
        Q = num / (2j * np.pi * dm)
    Q[np.diag_indices(len(mm))] = Dv
    return Q

def mode_index(N):
    m = [0]
    k = 1
    while len(m) < N:
        m.append(k)
        if len(m) < N: m.append(-k)
        k += 1
    return np.array(m)

def squarefree_divisors(ps):
    ds = [(1, 1)]
    for p in ps:
        ds += [(d * p, -mu) for (d, mu) in ds]
    return ds

def mobius_ratio_table(ps):
    """M = prod (1-U_p), U_p = p^{-1/2} S_{log p}.  M* M = sum_r g(r) S_{log r}; returns list (s=log(d/e), coeff) for
    Q(M f, M g) = sum_{d,e} mu(d) mu(e) (de)^{-1/2} Q(S_{log d - log e} f, g)."""
    from fractions import Fraction
    tab = {}
    ds = squarefree_divisors(ps)
    for d, mud in ds:
        for e, mue in ds:
            r = Fraction(d, e)
            tab[r] = tab.get(r, 0.0) + mud * mue / math.sqrt(d * e)
    return [(math.log(r.numerator) - math.log(r.denominator), c) for r, c in sorted(tab.items())]
