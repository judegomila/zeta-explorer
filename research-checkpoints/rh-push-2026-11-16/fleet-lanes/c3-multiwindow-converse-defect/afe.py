"""Smoothed approximate functional equation with exact (quadrature) weights.
F(s) = sum a(n) n^-s V_s(n/X) + chi(s) sum conj(a(n)) n^(s-1) W_s(n X)   (pole terms < e^(-beta t^2) dropped)
V_s(y) = (1/2 pi i) int_(c) g(s+u)/g(s) y^-u exp(beta u^2 - i pi u/4) du/u,  g(s) = pi^(-s/2) Gamma(s/2)
W_s(y) = (1/2 pi i) int_(c) g(1-s+u)/g(1-s) y^-u exp(beta u^2 + i pi u/4) du/u
The factor exp(-+ i pi u/4) cancels the exponential growth of the gamma ratio (t > 0)."""
import numpy as np
from scipy.special import loggamma
BETA = 0.003; C = 0.5; DV = 0.1
VMAX = np.sqrt(36.0 / BETA)
_v = np.arange(-VMAX, VMAX + DV / 2, DV)
_u = C + 1j * _v

def lg(s):  # log of pi^(-s/2) Gamma(s/2)
    return -0.5 * s * np.log(np.pi) + loggamma(s / 2)

def chi(s):
    return np.exp(lg(1 - s) - lg(s))

def weights(s, ys_first, ys_second, chunk=4000):
    """returns V_s(ys_first), W_s(ys_second) (1-d arrays)"""
    g1 = np.exp(lg(s + _u) - lg(s) + BETA * _u**2 - 0.25j * np.pi * _u) / _u * (DV / (2 * np.pi))
    g2 = np.exp(lg(1 - s + _u) - lg(1 - s) + BETA * _u**2 + 0.25j * np.pi * _u) / _u * (DV / (2 * np.pi))
    out = []
    for g, ys in ((g1, ys_first), (g2, ys_second)):
        ly = np.log(np.asarray(ys, float)); res = np.empty(len(ly), complex)
        for i in range(0, len(ly), chunk):
            res[i:i + chunk] = np.exp(-np.outer(ly[i:i + chunk], _u)) @ g
        out.append(res)
    return out

def coeff_rows(s, Xs, N):
    """c1[j,n-1], c2[j,n-1] with A_X(s)[a] = sum_n a(n) c1 + conj(a(n)) c2"""
    n = np.arange(1, N + 1, dtype=float); J = len(Xs)
    y1 = np.concatenate([n / X for X in Xs]); y2 = np.concatenate([n * X for X in Xs])
    V, W = weights(s, y1, y2)
    c1 = V.reshape(J, N) * n**(-s)
    c2 = chi(s) * W.reshape(J, N) * n**(s - 1)
    return c1, c2

if __name__ == "__main__":
    import mpmath as mp
    for T in (100.0, 1000.0, 10000.0):
        q = np.sqrt(T / (2 * np.pi))
        for sig in (0.5, 0.75):
            s = complex(sig, T + 3.3)
            N = int(8 * q) + 1
            Xs = [0.25, 0.5, 1.0, 2.0, 4.0]
            c1, c2 = coeff_rows(s, Xs, N)
            A = (c1 + c2).sum(axis=1)
            z = complex(mp.zeta(mp.mpc(s)))
            print(T, sig, N, "max |A_X - zeta| =", np.abs(A - z).max(), "|zeta| =", abs(z))
