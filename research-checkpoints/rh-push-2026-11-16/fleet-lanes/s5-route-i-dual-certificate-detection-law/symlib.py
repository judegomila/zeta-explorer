"""Lane s5-route-i-dual-certificate-detection-law: Weil forms in an exponential frame (float64 screen).

Form (convention of lanes s2/s4): for g in L^2(-a,a), h(u) = int g(x) conj g(x-u) dx,
  W(g) = int_{-2a}^{2a} K(u) h(u) du,   K(-u) = conj K(u),
  K = K_arch + 2 log Q delta_0 + sum_poles 2 cosh(p u) - sum_n c(n) n^{-1/2} (delta_{log n} + conj. at -log n)
      + sum_planted 4 cosh(b u) cos(gamma0 u).
Frame e_nu(x) = exp(i nu x) on [-a,a].  h(u) = sum c_k conj(c_l) H_kl(u),
  H_kl(u) = (e^{ida} e^{i nu_l u} - e^{-ida} e^{i nu_k u}) / (i d),  d = nu_k - nu_l   (symmetric in k,l),
so with the one-sided symbol A(nu) = int_0^{2a} K(u) e^{i nu u} du and B(nu) = int_0^{2a} K(u) (2a-u) e^{i nu u} du:
  W(g) = c^H M c,  M_lk = 2 Re[(e^{ida} A(nu_l) - e^{-ida} A(nu_k)) / (i d)]  (l != k),  M_kk = 2 Re B(nu_k),
  Gram_lk = 2 sin(d a)/d.   M is real symmetric for every object (real form: g(x) = conj g(-x)).
Closed forms:
  arch, gamma factor pi^{-s/2} Gamma((s+kappa)/2), z = 1/4 + kappa/2:
     A = (psi(z - i nu/2) - log pi)/2 + sum_j e^{-2a s_j}/s_j,  s_j = 2z + 2j - i nu
     B = a (psi(z - i nu/2) - log pi) + psi'(z - i nu/2)/4 - sum_j e^{-2a s_j}/s_j^2
  conductor: A = log Q, B = 2a log Q
  exponential e^{kappa u} (poles: kappa = +-p; planted: kappa = +-b +- i gamma0):
     A = (e^{2a(kappa + i nu)} - 1)/(kappa + i nu),  B = (e^{2a k'} - 1 - 2a k')/k'^2, k' = kappa + i nu
  primes: A = -sum_{log n < 2a} c(n) n^{-1/2} n^{i nu},  B = -sum c(n) n^{-1/2} (2a - log n) n^{i nu}
"""
import math, time, sys
import numpy as np
from scipy.special import digamma

LOGPI = math.log(math.pi)

def trigamma_c(s):
    s = np.asarray(s, dtype=complex).copy(); acc = np.zeros_like(s)
    for _ in range(14):
        acc += 1.0 / (s * s); s = s + 1.0
    inv = 1.0 / s; i2 = inv * inv
    return acc + inv + i2 / 2 + inv * i2 * (1 / 6 - i2 * (1 / 30 - i2 * (1 / 42 - i2 * (1 / 30 - i2 * 5 / 66))))

# ---------------- coefficient tables ----------------
def sieve_primes(n):
    s = np.ones(n + 1, bool); s[:2] = False
    for p in range(2, int(n ** 0.5) + 1):
        if s[p]: s[p * p::p] = False
    return np.nonzero(s)[0]

def lambda_table(X, eps=None):
    """prime powers n <= X with c(n) = eps(p)^k log p; eps: None (zeta) or function array_of_primes -> array"""
    ps = sieve_primes(int(X))
    e = np.ones(len(ps), complex) if eps is None else np.asarray(eps(ps), complex)
    ns = []; cs = []
    k = 1
    while True:
        m = ps[ps.astype(float) ** k <= X + 0.5]
        if len(m) == 0: break
        ns.append(m.astype(np.int64) ** k); cs.append(e[:len(m)] ** k * np.log(m)); k += 1
    ns = np.concatenate(ns); cs = np.concatenate(cs); o = np.argsort(ns)
    return ns[o], cs[o]

def dirichlet_log_deriv(a, X):
    """c = coefficients of -F'/F for F = sum a(n) n^{-s}, a(1) = 1, a given as array of length X+1"""
    X = int(X); c = a[:X + 1].astype(complex) * np.log(np.maximum(np.arange(X + 1), 1))
    for d in range(2, X // 2 + 1):
        cd = c[d]
        if cd == 0: continue
        m = np.arange(2, X // d + 1)
        c[d * m] -= cd * a[m]
    return c

def kappa_dh():
    s5 = math.sqrt(5.0)
    return (math.sqrt(10 - 2 * s5) - 2) / (s5 - 1)

def periodic(tab, X):
    q = len(tab); return np.asarray(tab, complex)[np.arange(int(X) + 1) % q]

def chi_table(D):
    q = abs(D)
    tabs = {-3: [0, 1, -1], -4: [0, 1, 0, -1], 5: [0, 1, -1, -1, 1], 8: [0, 1, 0, -1, 0, -1, 0, 1]}
    if D in tabs: return tabs[D]
    qr = {(x * x) % q for x in range(1, q)}
    return [0] + [1 if x in qr else -1 for x in range(1, q)]

def make_object(name, X, seed=120000):
    """returns dict(zs, logQ, poles, ns, cn (= c(n) n^{-1/2}), planted=[], pf_poles)"""
    X = float(X)
    def pack(ns, c):
        keep = c != 0
        return ns[keep], (c[keep] / np.sqrt(ns[keep])).astype(complex)
    if name == 'ZETA':
        ns, c = lambda_table(X); ns, cn = pack(ns, c)
        return dict(zs=[0.25], logQ=0.0, poles=[0.5], ns=ns, cn=cn, planted=[])
    if name.startswith('CHI'):
        D = int(name[3:]); tab = chi_table(D)
        ns, c = lambda_table(X); c = c * np.asarray(tab, float)[ns % abs(D)]; ns, cn = pack(ns, c)
        return dict(zs=[0.25 if D > 0 else 0.75], logQ=0.5 * math.log(abs(D)), poles=[], ns=ns, cn=cn, planted=[])
    if name == 'DH':
        kap = kappa_dh(); a = periodic([0, 1, kap, -kap, -1], X); c = dirichlet_log_deriv(a, X)
        ns = np.arange(2, int(X) + 1); ns, cn = pack(ns, c[2:])
        return dict(zs=[0.75], logQ=0.5 * math.log(5), poles=[], ns=ns, cn=cn, planted=[])
    if name.startswith('EA'):           # zeta(s+b) zeta(s-b)
        b = float(name[2:]); ns, c = lambda_table(X); c = c * (ns.astype(float) ** b + ns.astype(float) ** (-b)); ns, cn = pack(ns, c)
        return dict(zs=[0.25 + b / 2, 0.25 - b / 2], logQ=0.0, poles=[0.5 + b, 0.5 - b], ns=ns, cn=cn, planted=[])
    if name.startswith('TNR'):          # TNR:q:c   zeta(s)(1 + c q^{1/2-s} + q^{1-2s})
        _, q, cpar = name.split(':'); q = int(q); cpar = float(cpar)
        ns, c = lambda_table(X); c = c.copy()
        s0, s1 = 2.0, -cpar * math.sqrt(q); n = q
        extra_n = []; extra_c = []
        while n <= X:
            j = np.searchsorted(ns, n)
            if j < len(ns) and ns[j] == n: c[j] -= s1 * math.log(q)
            else: extra_n.append(n); extra_c.append(-s1 * math.log(q))
            s0, s1 = s1, (-cpar * math.sqrt(q)) * s1 - q * s0; n *= q
        if extra_n:
            ns = np.concatenate([ns, np.array(extra_n, np.int64)]); c = np.concatenate([c, np.array(extra_c, complex)])
            o = np.argsort(ns); ns, c = ns[o], c[o]
        ns, cn = pack(ns, c)
        return dict(zs=[0.25], logQ=math.log(q), poles=[0.5], ns=ns, cn=cn, planted=[])
    if name == 'LIOU':
        ns, c = lambda_table(X, lambda p: -np.ones(len(p))); ns, cn = pack(ns, c)
        return dict(zs=[0.25], logQ=0.0, poles=[], pf_poles=[0.5], ns=ns, cn=cn, planted=[])
    if name == 'SGNR':                  # random sign per prime, completely multiplicative on prime powers
        rng = np.random.Generator(np.random.PCG64(seed))
        ns, c = lambda_table(X, lambda p: rng.choice([-1.0, 1.0], size=len(p))); ns, cn = pack(ns, c)
        return dict(zs=[0.25], logQ=0.0, poles=[], pf_poles=[0.5], ns=ns, cn=cn, planted=[])
    if name == 'UNI':                   # random phase per prime
        rng = np.random.Generator(np.random.PCG64(seed))
        ns, c = lambda_table(X, lambda p: np.exp(2j * np.pi * rng.random(len(p)))); ns, cn = pack(ns, c)
        return dict(zs=[0.25], logQ=0.0, poles=[], pf_poles=[0.5], ns=ns, cn=cn, planted=[])
    if name.startswith('WT'):           # zeta(s + i alpha) in zeta's gamma factor
        al = float(name[2:]); ns, c = lambda_table(X); c = c * ns.astype(float) ** (-1j * al); ns, cn = pack(ns, c)
        return dict(zs=[0.25], logQ=0.0, poles=[], pf_poles=[0.5], ns=ns, cn=cn, planted=[])
    raise ValueError(name)

def with_planted(obj, gamma0, b):
    o = dict(obj); o['planted'] = list(obj.get('planted', [])) + [(float(gamma0), float(b))]; return o

# ---------------- one-sided symbols ----------------
def _expAB(kp, a):
    """A, B for the kernel e^{kappa u}, kp = kappa + i nu (array, nonzero)"""
    e = np.exp(2 * a * kp)
    return (e - 1) / kp, (e - 1 - 2 * a * kp) / (kp * kp)

def prime_sums(nu, logn, cn, a, xp=np, chunk=4_000_000):
    """S0 = sum cn e^{i nu logn}, S1 = sum cn (2a - logn) e^{i nu logn} over logn < 2a"""
    keep = logn < 2 * a
    ln = logn[keep]; c = cn[keep]
    S0 = np.zeros(len(nu), complex); S1 = np.zeros(len(nu), complex)
    if len(ln) == 0: return S0, S1
    if xp is not np:
        ln_g = xp.asarray(ln); c_g = xp.asarray(c); w_g = c_g * (2 * a - ln_g)
    step = max(1, chunk // len(ln))
    for i in range(0, len(nu), step):
        v = nu[i:i + step]
        if xp is np:
            E = np.exp(1j * np.outer(v, ln))
            S0[i:i + step] = E @ c; S1[i:i + step] = E @ (c * (2 * a - ln))
        else:
            E = xp.exp(1j * xp.outer(xp.asarray(v), ln_g))
            S0[i:i + step] = xp.asnumpy(E @ c_g); S1[i:i + step] = xp.asnumpy(E @ w_g)
    return S0, S1

def symbols(obj, nu, a, with_pole=True, xp=np, parts=False, prime_center=None):
    """A(nu), B(nu) of the object on support 2a"""
    nu = np.asarray(nu, float)
    A = np.zeros(len(nu), complex); B = np.zeros(len(nu), complex)
    J = int(40 / (4 * a)) + 2
    for z in obj['zs']:
        s = z - 0.5j * nu
        ps = digamma(s) - LOGPI
        A += 0.5 * ps; B += a * ps + 0.25 * trigamma_c(s)
        for j in range(J):
            sj = 2 * z + 2 * j - 1j * nu
            e = np.exp(-2 * a * sj)
            A += e / sj; B -= e / (sj * sj)
    A += obj['logQ']; B += 2 * a * obj['logQ']
    Aa, Ba = A.copy(), B.copy()
    if with_pole:
        for p in obj['poles']:
            for sg in (1, -1):
                dA, dB = _expAB(sg * p + 1j * nu, a); A += dA; B += dB
    for (g0, b) in obj.get('planted', []):
        for s1 in (1, -1):
            for s2 in (1, -1):
                dA, dB = _expAB(s1 * b + 1j * (nu + s2 * g0), a); A += dA; B += dB
    logn = np.log(obj['ns'].astype(float))
    if prime_center is None: S0, S1 = prime_sums(nu, logn, obj['cn'], a, xp=xp)
    else: S0, S1 = prime_sums(nu - prime_center, logn, obj['cn_tw'], a, xp=xp)     # cn_tw = cn e^{i center log n}, phases reduced in long double
    A -= S0; B -= S1
    if parts: return A, B, Aa, Ba, S0, S1
    return A, B

def loewner(nu, A, B, a, xp=np):
    """M (real symmetric) and Gram for the frame e^{i nu_k x} on [-a,a]"""
    nu_ = xp.asarray(nu); A_ = xp.asarray(A); B_ = xp.asarray(B)
    d = nu_[None, :] - nu_[:, None]            # d[l,k] = nu_k - nu_l
    n = len(nu)
    idx = xp.arange(n)
    d[idx, idx] = 1.0
    ph = xp.exp(1j * d * a)
    M = 2 * xp.real((ph * A_[:, None] - xp.conj(ph) * A_[None, :]) / (1j * d))
    G = 2 * xp.sin(d * a) / d
    M[idx, idx] = 2 * xp.real(B_)
    G[idx, idx] = 2 * a
    return M, G

def pole_constraints(nu, a, p):
    """real constraint vectors for ghat(+-ip) = 0 on real coefficient vectors"""
    kp = p + 1j * np.asarray(nu, float)
    v = 2 * np.sinh(kp * a) / kp
    return [v.real, v.imag]

def lowest(M, G, cons=(), cut=1e-9, xp=np, nev=1, orth=False):
    """lowest eigenvalue of M relative to G on the subspace orthogonal to the constraint vectors.
    Gram whitening with relative cut-off `cut` (frame may be redundant). Returns (eigs[:nev], coefficient vectors, rank)."""
    n = M.shape[0]
    if orth:
        gdiag = float(G[0, 0]); Wm = xp.eye(n) / math.sqrt(gdiag); rank = n
    else:
        lam, V = xp.linalg.eigh(G)
        keep = lam > cut * lam[-1]
        Wm = V[:, keep] / xp.sqrt(lam[keep])[None, :]; rank = int(keep.sum())
    if len(cons):
        C = xp.asarray(np.array(cons)).T                   # n x c, constraints c^T x = 0 for coefficient vector x = Wm y
        Cy = Wm.T @ C
        Qc, _ = xp.linalg.qr(Cy, mode='complete')
        Wm = Wm @ Qc[:, C.shape[1]:]
    Mw = Wm.T @ (M @ Wm); Mw = (Mw + Mw.T) / 2
    w, U = xp.linalg.eigh(Mw)
    vec = Wm @ U[:, :nev]
    return w[:nev], vec, rank

def lattice(a, Omega, os_=2.0, center=0.0):
    step = math.pi / (a * os_)
    K = int(Omega / step)
    return center + step * np.arange(-K, K + 1)

def lam_min(obj, a, Omega, os_=2.0, center=0.0, pf=False, xp=np, cut=1e-9, nev=1, want_vec=False):
    nu = lattice(a, Omega, os_, center)
    A, B = symbols(obj, nu, a, with_pole=not pf, xp=xp)
    M, G = loewner(nu, A, B, a, xp=xp)
    cons = []
    if pf:
        for p in list(obj['poles']) + list(obj.get('pf_poles', [])): cons += pole_constraints(nu, a, p)
    w, vec, rank = lowest(M, G, cons, cut=cut, xp=xp, nev=nev, orth=(os_ == 1.0))
    w = np.asarray(w.get() if hasattr(w, 'get') else w)
    if want_vec:
        vec = np.asarray(vec.get() if hasattr(vec, 'get') else vec)
        return w, nu, vec, rank
    return w, len(nu), rank

def twist_coefficients(obj, center):
    """cn e^{i center log n} with the phase center*log n reduced mod 2 pi in long double (x86: 64-bit mantissa)"""
    ld = np.longdouble
    th = ld(center) * np.log(obj['ns'].astype(ld))
    twopi = ld(2) * np.arctan2(ld(0), ld(-1))
    th = th - twopi * np.floor(th / twopi)
    o = dict(obj); o['cn_tw'] = obj['cn'] * np.exp(1j * th.astype(float)); return o
