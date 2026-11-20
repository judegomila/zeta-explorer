"""Check of the covariance identity behind Lemma A on the FFT-Mellin grid, with f = exp(-pi x^2) (fhat = f):
   (F_S f)(w) - alpha (F_S f)(p w) = fhat(w) - (alpha/p) fhat(w/p)      for L_p = (1 - alpha p^{-s})^{-1}, S = {inf, p}.
In the unitary log variable gt(v) = e^{v/2} g(e^v):  g(p w) <-> p^{-1/2} gt(v + log p),  g(w/p) <-> p^{1/2} gt(v - log p)."""
import math, numpy as np, lf
PI = math.pi; delta = 1e-3; v0, v1 = -34.0, 30.0
L = int(round((v1 - v0) / delta)); L -= L % 16
v = v0 + delta * np.arange(L); x = np.exp(v)
from math import lgamma
import scipy.special as sp
tk = 2 * PI * np.fft.fftfreq(L, d=delta); s = 0.5 + 1j * tk
with np.errstate(over='ignore', invalid='ignore'):
    w = PI * s / 2
    logcos = np.where(tk >= 0, -1j * w + np.log((1 + np.exp(2j * w)) / 2), 1j * w + np.log((1 + np.exp(-2j * w)) / 2))
m = np.exp(math.log(2) - s * math.log(2 * PI) + sp.loggamma(s) + logcos)
rev = (-np.arange(L)) % L; phi = np.exp(-1j * tk * v0)
at = np.abs(tk) / (PI / delta); chi = np.where(at < 0.6, 1.0, np.where(at > 0.9, 0.0, 0.5 * (1 + np.cos(PI * (at - 0.6) / 0.3))))
g = np.exp(v / 2) * np.exp(-PI * x ** 2)
def shift(a, d):  # a(v + d) by linear interpolation
    return np.interp(v + d, v, a, left=0, right=0)
for p, name, alpha in ((2, 'zeta', 1.0), (2, 'sign', -1.0), (3, 'ntp', 3 ** 0.2), (3, 'ntm', 3 ** -0.2), (5, 'sign', -1.0)):
    mu = m * lf.rho(name, p, tk)
    Fg = np.fft.ifft(mu[rev] * np.conj(phi) ** 2 * chi * np.fft.fft(g)[rev]).real
    lhs = Fg - alpha * p ** -0.5 * shift(Fg, math.log(p))
    rhs = g - (alpha / p) * p ** 0.5 * shift(g, -math.log(p))
    win = (v > -12) & (v < 6)
    print(f'{name}@{p} alpha={alpha:+.4f}: max|lhs-rhs| = {np.max(np.abs(lhs-rhs)[win]):.2e}  (max|rhs| = {np.max(np.abs(rhs)[win]):.3f})')
