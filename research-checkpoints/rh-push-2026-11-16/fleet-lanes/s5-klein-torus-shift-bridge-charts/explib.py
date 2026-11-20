"""Shared pieces of the analysis of combination (4)."""
import math, json
import numpy as np
from numpy.polynomial.legendre import leggauss
from scipy.special import digamma

_GX, _GW = leggauss(48)
_BW = _GW * (35.0 / 32.0) * (1 - _GX ** 2) ** 3

def betahat(z):
    """int_{-1}^{1} beta(x) e^{z x} dx for complex z (array), beta = (35/32)(1-x^2)^3.
    Closed form 105 [(z^3 + 15 z) cosh z - (6 z^2 + 15) sinh z] / z^7 for |z| > 4; 48-node Gauss-Legendre for |z| <= 4."""
    z = np.asarray(z, complex); out = np.empty(z.shape, complex); big = np.abs(z) > 4
    zb = z[big]
    e1 = np.exp(zb); e2 = np.exp(-zb); ch = (e1 + e2) / 2; sh = (e1 - e2) / 2
    out[big] = 105 * ((zb ** 3 + 15 * zb) * ch - (6 * zb * zb + 15) * sh) / zb ** 7
    zs = z[~big]
    out[~big] = np.exp(np.multiply.outer(zs, _GX)) @ _BW if zs.size else 0
    return out

def Phi(z, X, eta):
    return np.exp((math.log(X) - eta) * z) * betahat(eta * z)

def zero_kernel(x, t, b, g, X, eta):
    """sum over the zeros (b_j, g_j) of (1 - Phi(rho - s))/(s - rho) at s = 1/2 + x + i t (t array); returns complex array"""
    out = np.zeros(len(t), complex)
    for j0 in range(0, len(g), 64):
        z = (b[j0:j0 + 64][None, :] - x) + 1j * (g[j0:j0 + 64][None, :] - t[:, None])       # rho - s
        out += ((1 - Phi(z, X, eta)) / (-z)).sum(axis=1)
    return out

def lorentz(x, t, b, g):
    out = np.zeros(len(t), complex)
    for j0 in range(0, len(g), 256):
        z = (b[j0:j0 + 256][None, :] - x) + 1j * (g[j0:j0 + 256][None, :] - t[:, None])
        out += (1 / (-z)).sum(axis=1)
    return out

def gamma_part(model, s, X, eta):
    """G(s): A_X = Re(-S_v + G)"""
    if model in ('ZETA', 'TNR', 'TNRQ') or model.startswith('SGN'):
        return 1 / s + 1 / (s - 1) - 0.5 * math.log(math.pi) + 0.5 * digamma(s / 2) + Phi(1 - s, X, eta) / (1 - s)
    if model == 'LCHI4': return 0.5 * math.log(4 / math.pi) + 0.5 * digamma((s + 1) / 2)
    if model == 'LCHI5': return 0.5 * math.log(5 / math.pi) + 0.5 * digamma(s / 2)
    if model == 'DH': return 0.5 * math.log(5 / math.pi) + 0.5 * digamma((s + 1) / 2)
    if model.startswith('EA'):
        a = float(model.split(':')[1]); o = 0
        for sh in (a, -a):
            u = s + sh; o = o + 1 / u + 1 / (u - 1) - 0.5 * math.log(math.pi) + 0.5 * digamma(u / 2) + Phi(1 - u, X, eta) / (1 - u)
        return o
    raise KeyError(model)

def tail_model(x, t, W, cond=1.0):
    """x * sum over zeros with |gamma - t| > W of 1/(x^2 + d^2) with the smooth density log(cond t/2 pi)/(2 pi) on both sides"""
    dens = np.log(cond * np.abs(t) / (2 * math.pi)) / (2 * math.pi)
    return 2 * dens * (math.pi / 2 - np.arctan(W / x))

def tnr_delta(q, c, x, t, X, eta):
    """prime-side terms of the local factor D(s) = 1 + c q^(1/2-s) + q^(1-2s) (added to -S_v of zeta), plus log q of q^s"""
    lq = math.log(q); s1 = -c * math.sqrt(q); pk_2 = 2.0; pk_1 = s1; out = np.zeros(len(t), complex) + lq
    k = 1; yc = math.log(X) - eta
    while k * lq < math.log(X):
        pk = pk_1 if k == 1 else None
        if k > 1:
            pk = s1 * pk_1 - q * pk_2; pk_2, pk_1 = pk_1, pk
        xx = min(1.0, max(-1.0, (k * lq - yc) / eta)); v = 0.5 - (35.0 / 32.0) * (xx - xx ** 3 + 0.6 * xx ** 5 - xx ** 7 / 7.0)
        out += lq * pk * np.exp(-k * lq * (0.5 + x + 1j * t)) * v
        k += 1
    return out

def tnr_exact(q, c, x, t):
    lq = math.log(q); s = 0.5 + x + 1j * t
    u = np.exp(lq * (0.5 - s)); D = 1 + c * u + u * u
    return lq + lq * (-c * u - 2 * u * u) / D
