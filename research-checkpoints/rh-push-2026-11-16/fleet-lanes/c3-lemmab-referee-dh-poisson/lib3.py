"""c3-lemmab-referee-dh-poisson: shared helpers. float64 + python-flint (Arb midpoints). MEASURED unless stated."""
import numpy as np, json, math, os
from scipy.special import digamma
from flint import acb, acb_series, ctx
HERE = os.path.dirname(os.path.abspath(__file__))
EULER = 0.5772156649015329
def zeta_zeros():
    d = json.load(open(os.path.join(HERE, '..', '..', 'pick', 'zeros_20000.json')))
    return np.array([0.5 * (float(a) + float(b)) for a, b in d['enclosures']])
def zS(s, ps):
    """prod_{p in ps} (1 - p^-s)^-1, meromorphic continuation (any complex s)."""
    s = np.asarray(s, dtype=np.complex128); out = np.ones(s.shape, np.complex128)
    for p in ps: out = out / (1 - np.exp(-math.log(p) * s))
    return out
def Omega(tau):
    return -math.log(math.pi) + np.real(digamma(0.25 + 0.5j * np.asarray(tau)))
def coef(m):
    return {j: math.comb(2 * m, m - abs(j)) * (-1) ** j / 4.0 ** m for j in range(-m, m + 1)}
def Wfun(z, T, Tw, m=3):
    """W(z) = int_0^Tw e^{iTt} sin^{2m}(pi t/Tw) e^{-zt} dt."""
    u = np.asarray(z, dtype=np.complex128) - 1j * T
    out = np.zeros(u.shape, np.complex128)
    for j, c in coef(m).items():
        a = u - 2j * math.pi * j / Tw
        a = np.where(np.abs(a) < 1e-12, 1e-12, a)
        out += c * (-np.expm1(-a * Tw)) / a
    return out
def Cb(x, Tw, m=3):
    """autocorrelation of b = sin^{2m}(pi t/Tw) 1_[0,Tw]: C_b(x) = int b(v+x) b(v) dv (even, support |x| <= Tw). Closed form."""
    x = np.abs(np.asarray(x, dtype=np.float64)); a = np.clip(Tw - x, 0.0, None)
    out = np.zeros(x.shape, np.complex128); cs = coef(m)
    for j, cj in cs.items():
        ej = np.exp(2j * math.pi * j * x / Tw)
        for l, cl in cs.items():
            if j + l == 0: out += cj * cl * ej * a
            else:
                om = 2 * math.pi * (j + l) / Tw
                out += cj * cl * ej * (np.exp(1j * om * a) - 1) / (1j * om)
    return out.real
def Cw(x, T, Tw, m=3):
    """C_w(x) = int w(v+x) conj w(v) dv for w = e^{iTt} b."""
    return np.exp(1j * T * np.asarray(x)) * Cb(x, Tw, m)
def zlogder(t, sigma=1.0):
    """zeta'/zeta(sigma+it) (python-flint, 64-bit balls, midpoint)."""
    s = acb_series([acb(sigma, float(t)), 1], prec=2).zeta()
    v = s[1] / s[0]
    return complex(float(v.real.mid()), float(v.imag.mid()))
def primes_upto(X):
    s = np.ones(int(X) + 1, dtype=bool); s[:2] = False
    for i in range(2, int(X ** 0.5) + 1):
        if s[i]: s[i * i::i] = False
    return np.nonzero(s)[0]
def prime_powers(X):
    """sorted arrays (n, Lambda(n)) for prime powers n <= X."""
    ps = primes_upto(X); ns = [ps.astype(np.float64)]; ls = [np.log(ps.astype(np.float64))]
    for p in ps[ps <= int(X ** 0.5) + 1]:
        q = p * p
        while q <= X:
            ns.append(np.array([float(q)])); ls.append(np.array([math.log(p)])); q *= p
    n = np.concatenate(ns); l = np.concatenate(ls); o = np.argsort(n)
    return n[o], l[o]
