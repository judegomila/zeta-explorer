"""Sonine remainder for a swapped local factor at one prime p (real coefficients):
   K(t) = 2 sum_n c_n cos(2 pi p^n t),   br(r) = 2 sum_{n,m} c_n c_m [ si(r p^n + p^m) + si(|r p^n - p^m|) ],  si(x) = Si(2 pi x)/(2 pi x)
   delta_S(rho) = rho^{1/2} br(rho),  delta_in(rho) = rho^{-1/2} br(1/rho)   (zeta, p=2: the functions of tmp/sonine-closed-forms.py)."""
import math
import numpy as np
from scipy.special import sici
import lf
TWO_PI = 2 * math.pi
def si(c):
    c = np.asarray(c, dtype=float); out = np.ones_like(c); nz = c > 1e-150
    out[nz] = sici(TWO_PI * c[nz])[0] / (TWO_PI * c[nz]); return out

def coeffs(name, p, npos, nneg=60, tol=1e-17):
    nmin, c = lf.laurent(name, p, npos=npos, nneg=nneg)
    assert np.max(np.abs(c.imag)) < 1e-14, 'real coefficients only'
    c = c.real; n = nmin + np.arange(len(c))
    keep = np.abs(c) > tol
    return n[keep], c[keep]

def br_res(name, p, k, eps, npos):
    """br at r = p^k (1 + eps) (k any integer, eps real, |eps| small), with the exactly resonant differences p^m * eps
    computed without cancellation. Returns (total, resonant part)."""
    n, c = coeffs(name, p, npos)
    pn = float(p) ** n
    tot = 0.0; resn = 0.0
    idx = {int(nn): i for i, nn in enumerate(n)}
    for i, nn in enumerate(n):
        d = nn + k - n                      # exponent of p in (r p^n)/p^m before the (1+eps)
        A = float(p) ** (nn + k) * (1 + eps)
        diff = np.where(d == 0, pn * abs(eps), np.abs(pn * (float(p) ** d * (1 + eps) - 1)))
        term = c[i] * c * (si(A + pn) + si(diff))
        tot += float(np.sum(term))
        j = idx.get(int(nn + k))
        if j is not None: resn += float(c[i] * c[j] * si(np.array([pn[j] * abs(eps)]))[0])
    return 2 * tot, 2 * resn

def delta_grid(name, p, rhos):
    """delta_S(rho) on an array of rho >= 1 (plain float differences; for quadrature of the symbol)"""
    rhos = np.asarray(rhos, dtype=float)
    lr = math.log(float(np.max(rhos))) / math.log(p)
    B = lf.factor(name, p)[1]
    amax = max([abs(1 / r) for r in np.roots(np.array(B)[::-1])] + [1.0]) if len(B) > 1 else 1.0   # largest |alpha|
    dec = math.log(p) - 2 * math.log(amax)                                                          # decay rate of c_n^2 / p^n
    npos = int(lr + 37.0 / dec + 8)
    n, c = coeffs(name, p, npos)
    pn = float(p) ** n
    out = np.zeros_like(rhos)
    for i in range(len(n)):
        A = rhos * pn[i]
        acc = np.zeros_like(rhos)
        for j in range(len(n)):
            w = c[i] * c[j]
            if abs(w) / max(pn[i], pn[j], 1.0) < 1e-17 / max(1.0, 1.0): continue
            acc += w * (si(A + pn[j]) + si(np.abs(A - pn[j])))
        out += acc
    return 2 * np.sqrt(rhos) * out
