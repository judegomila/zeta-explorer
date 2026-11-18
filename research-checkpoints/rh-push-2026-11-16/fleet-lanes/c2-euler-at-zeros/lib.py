"""c2-euler-at-zeros: partial Euler products sampled at zeros. float64. Planned allocations are printed by callers."""
import numpy as np, json, math, os
from scipy.special import digamma
HERE = os.path.dirname(os.path.abspath(__file__))
def zeta_zeros():
    d = json.load(open(os.path.join(HERE, '..', '..', 'pick', 'zeros_20000.json')))
    return np.array([0.5 * (float(a) + float(b)) for a, b in d['enclosures']])
def primes_upto(X):
    s = np.ones(int(X) + 1, dtype=bool); s[:2] = False
    for i in range(2, int(X ** 0.5) + 1):
        if s[i]: s[i * i::i] = False
    return np.nonzero(s)[0]
def zS(s, ps, chunk=200000, deriv=False, sign=1.0):
    """zeta_S(s) = prod_p (1 - sign p^-s)^-1 at complex points s; optionally also zeta_S'/zeta_S."""
    s = np.asarray(s, dtype=np.complex128); out = np.empty(s.shape, np.complex128)
    ld = np.empty(s.shape, np.complex128) if deriv else None
    lp = np.log(np.asarray(ps, dtype=np.float64))
    for i in range(0, s.size, chunk):
        ss = s.ravel()[i:i + chunk]
        acc = np.zeros(ss.shape, np.complex128); dacc = np.zeros(ss.shape, np.complex128)
        for l in lp:
            x = sign * np.exp(-l * ss)
            acc -= np.log1p(-x)
            if deriv: dacc -= l * x / (1 - x)
        out.ravel()[i:i + chunk] = np.exp(acc)
        if deriv: ld.ravel()[i:i + chunk] = dacc
    return (out, ld) if deriv else out
def Omega(tau):
    """2 Re G(i tau), G = archimedean part of xi'/xi(1/2+z): -log pi + Re psi(1/4 + i tau/2)."""
    return -math.log(math.pi) + np.real(digamma(0.25 + 0.5j * np.asarray(tau)))
def L1(ps):
    ps = np.asarray(ps, dtype=float); return float(np.sum(np.log(ps) / (ps - 1)))
def smooth_numbers(ps, N):
    v = np.array([1], dtype=np.int64)
    for p in ps:
        new = [v]; cur = v
        while True:
            cur = cur[cur <= N // p] * p
            if cur.size == 0: break
            new.append(cur)
        v = np.concatenate(new)
    return np.sort(v)
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
def dh_coeff(n):
    return np.array([0.0, 1.0, KAPPA, -KAPPA, -1.0])[np.asarray(n) % 5]
def dirpoly(s, ns, an, chunk=20000):
    s = np.asarray(s, dtype=np.complex128); out = np.empty(s.shape, np.complex128); ln = np.log(ns.astype(float))
    for i in range(0, s.size, chunk):
        ss = s.ravel()[i:i + chunk]
        out.ravel()[i:i + chunk] = np.exp(-np.outer(ss, ln)) @ an
    return out
