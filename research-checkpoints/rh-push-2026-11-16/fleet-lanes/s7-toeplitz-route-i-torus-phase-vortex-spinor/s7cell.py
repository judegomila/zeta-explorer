"""Shared code, lane s7: cell (step-function) sections of the Weil form and of its skew companion, float64.
Weil form of an object F on step functions of mesh h (orthonormal cells), convention of lanes s2/s4 (family.py):
   H_{h,m} = Toeplitz(q_d),  q_d = arch_d + 2 log Q [d=0] + pole_d - sum_n c(n) n^{-1/2} hat(log n / h - d),  hat(x) = max(0, 1-|x|).
Distribution on the difference variable x: K(x) = const delta - sum_z e^{-2z|x|}/(1-e^{-2|x|}) (finite part) + sum_p 2cosh(p x) - sum_n c(n) n^{-1/2} delta(|x| - log n).
Skew companion: kernel x K(x) (odd): a_d = int x K(x) hat(x/h - d) dx; delta and finite part at 0 are killed by the factor x.
"""
import math, numpy as np
from scipy.special import digamma, polygamma
ALPHA = 1.2393168126993495
KAP = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)

def prime_powers(X):
    sv = np.ones(X + 1, dtype=bool); sv[:2] = False
    for i in range(2, int(X ** 0.5) + 1):
        if sv[i]: sv[i * i::i] = False
    primes = np.nonzero(sv)[0].astype(np.int64); del sv
    ns = [primes]; ps = [primes]; ks = [np.ones(len(primes), dtype=np.int64)]
    for p in primes[primes <= int(X ** 0.5) + 1]:
        v = p * p; k = 2
        while v <= X:
            ns.append(np.array([v])); ps.append(np.array([p])); ks.append(np.array([k])); v *= p; k += 1
    PN = np.concatenate(ns); PP = np.concatenate(ps); PK = np.concatenate(ks)
    o = np.argsort(PN)
    return PN[o], PP[o], PK[o]

def dh_coef(XD):
    a5 = np.array([0.0, 1.0, KAP, -KAP, -1.0])[np.arange(XD + 1) % 5]
    cd = a5 * np.log(np.maximum(np.arange(XD + 1), 1).astype(float))
    for d in range(2, XD // 2 + 1):
        v = cd[d]
        if v != 0.0: cd[2 * d::d] -= v * a5[2:XD // d + 1]
    nd = np.nonzero(cd)[0]; nd = nd[nd >= 2]
    return nd, cd[nd]

_PP = {}
def obj(name, X):
    """dict(n, c, zw, const, poles): c = coefficients of -F'/F at n <= X (nonzero ones)"""
    if X not in _PP: _PP[X] = prime_powers(X)
    PN, PP, PK = _PP[X]
    lam = np.log(PP.astype(float))
    Z = dict(zw=[(0.25, 1.0)], const=0.0, poles=[0.5])
    if name == 'zeta': return dict(n=PN, c=lam, **Z)
    if name == 'liou': return dict(n=PN, c=lam * np.where(PK % 2 == 0, 1.0, -1.0), **Z)
    if name == 'uni': return dict(n=PN, c=lam * PN.astype(float) ** (-1j * ALPHA), **Z)
    if name == 'chim4':
        chi = np.array([0, 1, 0, -1.0])[PN % 4]; s = chi != 0
        return dict(n=PN[s], c=(lam * chi)[s], zw=[(0.75, 1.0)], const=math.log(4), poles=[])
    if name == 'chi5':
        chi = np.array([0, 1, -1, -1, 1.0])[PN % 5]; s = chi != 0
        return dict(n=PN[s], c=(lam * chi)[s], zw=[(0.25, 1.0)], const=math.log(5), poles=[])
    if name.startswith('tnr'):
        _, q, cpar = name.split('-'); q = int(q); cpar = float(cpar)
        c = lam.copy(); sel = np.nonzero(PP == q)[0]
        s0, s1 = 2.0, -cpar * math.sqrt(q)
        for j in sel:
            c[j] = (1 - s1) * math.log(q)
            s0, s1 = s1, (-cpar * math.sqrt(q)) * s1 - q * s0
        return dict(n=PN, c=c, zw=[(0.25, 1.0)], const=2 * math.log(q), poles=[0.5])
    if name == 'dh':
        nd, cd = dh_coef(X)
        return dict(n=nd, c=cd, zw=[(0.75, 1.0)], const=math.log(5), poles=[])
    if name.startswith('ea'):
        b = float(name[2:])
        return dict(n=PN, c=lam * (PN.astype(float) ** b + PN.astype(float) ** (-b)), zw=[(0.25 + b / 2, 1.0), (0.25 - b / 2, 1.0)], const=0.0, poles=[0.5 + b, 0.5 - b])
    raise ValueError(name)

def E_z(z, h, M):
    """E(j) = sum_k exp(-2 (k+z) j h)/(4 (k+z)^2), j = 0..M+1"""
    out = np.zeros(M + 2); out[0] = float(polygamma(1, z)) / 4
    K = int(45 / (2 * h)) + 10
    for k in range(K):
        c = k + z
        jm = min(M + 1, int(45 / (2 * c * h)) + 1)
        j = np.arange(1, jm + 1)
        out[1:jm + 1] += np.exp(-2 * c * h * j) / (4 * c * c)
    return out

def arch_q(M, h, zw, const, poles=()):
    """entries d = 0..M-1 of the archimedean + conductor + pole part"""
    a = np.zeros(M)
    for z, w in zw:
        E = E_z(z, h, M)
        a[0] += w * (float(digamma(z)) - math.log(math.pi) + (2 / h) * (E[0] - E[1]))
        a[1:] += -w * (E[0:M - 1] - 2 * E[1:M] + E[2:M + 1]) / h
    a[0] += const
    return a + pole_q(M, h, poles)

def pole_q(M, h, poles):
    a = np.zeros(M); d = np.arange(M)
    for p in poles:
        pq = 2 * np.cosh(p * d * h) * (4 * math.sinh(p * h / 2) ** 2) / (p ** 2 * h)
        pq[0] = 8 * math.sinh(p * h / 2) ** 2 / (p ** 2 * h)
        a += pq
    return a

def bins(ell, w, h, M):
    """sum_n w_n hat(ell_n / h - d), d = 0..M-1"""
    idx = np.floor(ell / h).astype(np.int64); fr = ell / h - idx
    s = idx < M + 1
    idx, fr, w = idx[s], fr[s], w[s]
    def b(x): return np.bincount(idx, x * (1 - fr), M + 2) + np.bincount(idx + 1, x * fr, M + 2)
    out = b(w.real) + (1j * b(w.imag) if np.iscomplexobj(w) else 0)
    return out[:M]

def q_sym(o, h, M, P=None, pole=True):
    """Toeplitz entries q_0..q_{M-1} of the Weil form of object o with coefficients n <= P (None: all in the list)"""
    n, c = o['n'], o['c']
    if P is not None: s = n <= P; n, c = n[s], c[s]
    return arch_q(M, h, o['zw'], o['const'], o['poles'] if pole else ()) - bins(np.log(n.astype(float)), c / np.sqrt(n.astype(float)), h, M)

_GX, _GW = np.polynomial.legendre.leggauss(12)
def a_skew(o, h, M, P=None, pole=False):
    """entries a_0..a_{M-1} (a_{-d} = -conj a_d) of the skew section with kernel x K(x)"""
    n, c = o['n'], o['c']
    if P is not None: s = n <= P; n, c = n[s], c[s]
    ell = np.log(n.astype(float))
    a = -bins(ell, ell * c / np.sqrt(n.astype(float)), h, M)
    d = np.arange(M, dtype=float)
    def k(x):
        x = np.maximum(x, 1e-300)
        out = np.zeros_like(x)
        for z, w in o['zw']: out += -w * x * np.exp(-2 * z * x) / (-np.expm1(-2 * x))
        if pole:
            for p in o['poles']: out += 2 * x * np.cosh(p * x)
        return out
    arch = np.zeros(M)
    for lo in (-1.0, 0.0):
        s = lo + (_GX + 1) / 2; wq = _GW / 2
        for sj, wj in zip(s, wq):
            x = h * (d + sj)
            arch += h * wj * (1 - abs(sj)) * np.where(x > 0, k(np.abs(x)), -k(np.abs(x)))
    arch[0] = 0.0
    return a + arch

def toep(q, m, skew=False):
    """T_ij = q_{i-j} (i >= j), Hermitian completion (or skew completion)"""
    q = np.asarray(q[:m]); i = np.arange(m)
    d = i[:, None] - i[None, :]
    T = q[np.abs(d)]
    if skew: T = np.where(d < 0, -np.conj(T), T)
    elif np.iscomplexobj(T): T = np.where(d < 0, np.conj(T), T)
    return T

def lattice_symbol(q, phi):
    """f(phi) = q_0 + 2 Re sum_{d>=1} q_d e^{-i d phi} (Hermitian sequence), with first and second derivative"""
    d = np.arange(1, len(q))
    e = np.exp(-1j * np.outer(np.atleast_1d(phi), d))
    f = q[0].real + 2 * (e @ q[1:]).real
    f1 = 2 * ((e * (-1j * d)) @ q[1:]).real
    f2 = 2 * ((e * (-(d * d))) @ q[1:]).real
    return f, f1, f2
