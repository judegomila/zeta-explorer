"""Local factors for the swap test. A local factor at p is L_p(s) = A(z)/B(z), z = p^{-s} (polynomials, low degree first).
Semilocal Fourier multiplier at p on the critical line: rho_p(t) = L_p(1/2+it) / conj(L_p(1/2+it))   (= L_p(s)/L~_p(1-s)).
Laurent form rho_p = sum_n c_n z^n (annulus containing |z| = p^{-1/2}); the cos-kernel is K(t) = 2 sum_n c_n cos(2 pi p^n t).
zeta: A = 1, B = 1 - z  ->  c_{-1} = -1/p, c_n = 1 - 1/p (n >= 0)."""
import math, cmath
import numpy as np
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)   # Davenport-Heilbronn constant 0.2840790438

def factor(name, p):
    """return (A, B) coefficient lists (complex allowed) for control `name` at prime p"""
    if name in ('zeta', 'tnr'):   # T-NR multiplies L_p by a function symmetric under s -> 1-s: rho_p is unchanged (checked in spec.py)
        return [1.0], [1.0, -1.0]
    if name == 'sign': return [1.0], [1.0, 1.0]
    if name == 'ntp':  a = p ** 0.2;  return [1.0], [1.0, -a]          # non-tempered, |alpha| = p^{0.2} > 1
    if name == 'ntm':  a = p ** -0.2; return [1.0], [1.0, -a]          # |alpha| = p^{-0.2} < 1
    if name == 'ea':   a = p ** 0.2;  return [1.0], list(np.convolve([1.0, -a], [1.0, -1 / a]))   # zeta(s+a)zeta(s-a), a = 0.2
    if name == 'uni':  a = cmath.exp(1j); return [1.0], [1.0, -a]      # unimodular twist alpha = e^{i}
    if name == 'l2':   return [1.0], [1.0, 0.0, 1.0]                   # local factor of L(s,chi)L(s,chibar) at a prime with chi(p) = i (degree 2 Euler product; positive comparison for dh)
    if name == 'dh':   # p-part of the Davenport-Heilbronn Dirichlet series: sum_k a(p^k) z^k
        if p == 2: return [1.0, KAPPA], [1.0, 0.0, 1.0]
        if p == 3: return [1.0, -KAPPA], [1.0, 0.0, 1.0]
        if p == 5: return [1.0], [1.0]
    raise ValueError(name)

def Lval(name, p, t):
    """L_p(1/2 + i t) (vectorised)"""
    A, B = factor(name, p); z = p ** (-0.5 - 1j * np.asarray(t, dtype=float))
    return np.polyval(A[::-1], z) / np.polyval(B[::-1], z)

def rho(name, p, t):
    L = Lval(name, p, t)
    if name == 'tnr':   # explicit symmetric multiplier 2cosh((s-1/2) log p) + c, c = 2.1 (real and positive on the line)
        L = L * (2 * np.cos(np.asarray(t) * math.log(p)) + 2.1)
    return L / np.conj(L)

def logderiv2re(name, p, t):
    """2 Re (L_p'/L_p)(1/2+it)  ( = -m_p(t) for zeta )"""
    A, B = factor(name, p); z = p ** (-0.5 - 1j * np.asarray(t, dtype=float))
    dA = np.polyval(np.polyder(np.poly1d(A[::-1])).coeffs, z) if len(A) > 1 else 0 * z
    dB = np.polyval(np.polyder(np.poly1d(B[::-1])).coeffs, z)
    ld = -math.log(p) * z * (dA / np.polyval(A[::-1], z) - dB / np.polyval(B[::-1], z))
    return 2 * ld.real

def _inv_series(P, n):
    """power series of 1/P(y) to order n (P[0] != 0)"""
    out = np.zeros(n + 1, dtype=complex); out[0] = 1 / P[0]
    for k in range(1, n + 1):
        s = 0
        for j in range(1, min(k, len(P) - 1) + 1): s += P[j] * out[k - j]
        out[k] = -s / P[0]
    return out

def laurent(name, p, npos=140, nneg=60):
    """c_n for n in [-nneg-deg, npos]: rho = A(z) Bc(1/(pz)) / (B(z) Ac(1/(pz))), Ac, Bc = conjugated coefficients.
    returns (nmin, array)"""
    A, B = factor(name, p); A = np.array(A, dtype=complex); B = np.array(B, dtype=complex)
    invB = _inv_series(B, npos + 4)                         # powers z^k, k >= 0
    Ay = np.conj(A) * (1.0 / p) ** np.arange(len(A))        # Ac(1/(pz)) = sum conj(A_k) p^{-k} z^{-k}
    By = np.conj(B) * (1.0 / p) ** np.arange(len(B))
    invAy = _inv_series(Ay, nneg) if len(A) > 1 else np.array([1 / Ay[0]])
    pos = np.convolve(A, invB)[:npos + 1]                   # z^0 .. z^npos
    neg = np.convolve(By, invAy)                            # y^0 .. , y = z^{-1}
    nm = len(neg) - 1
    c = np.zeros(nm + npos + 1, dtype=complex)              # index i <-> n = i - nm
    for k in range(len(neg)):
        c[nm - k: nm - k + npos + 1] += neg[k] * pos
    return -nm, c

if __name__ == '__main__':
    # self-test: Laurent series reproduces rho on the line; zeta coefficients
    for p in (2, 3, 5):
        for name in ('zeta', 'sign', 'ntp', 'ntm', 'ea', 'uni', 'dh'):
            nmin, c = laurent(name, p)
            t = np.linspace(-7, 7, 15)
            z = p ** (-0.5 - 1j * t); n = nmin + np.arange(len(c))
            val = np.array([np.sum(c * zz ** n) for zz in z])
            r = rho(name, p, t)
            print(p, name, 'max|laurent - rho| = %.2e' % np.max(np.abs(val - r)), ' max||rho|-1| = %.1e' % np.max(np.abs(np.abs(r) - 1)), ' c[-1],c[0],c[1] =', np.round(c[-nmin - 1:-nmin + 2], 6))
        print(p, 'tnr rho == zeta rho: %.1e' % np.max(np.abs(rho('tnr', p, np.linspace(-9, 9, 37)) - rho('zeta', p, np.linspace(-9, 9, 37)))))
