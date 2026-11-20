"""Combination 4, shared: prediction of the backward leaving rate from the two-point function with arithmetic terms.
Backward flow in unfolded units: dx_k/dtau = -2 sum 1/(x_k - x_j).  An adjacent pair of gap g with environment sum
B = sum_j 1/((a - x_j)(b - x_j)) obeys (g^2)' = -8 + 4 B g^2 and collides at tau_c = -log(1 - g^2 B/2)/(4B) = (g^2/8)(1 + g^2 B/4 + ..).
Number of real zeros lost by time tau, per zero:  2 P(tau_c <= tau) = 2 P2(s_eff),  s_eff = sqrt(8 tau)(1 - tau Bbar)   [pair term, triple term]
  P2(s) = int_0^s r2(u) du with r2 the Bogomolny-Keating / Conrey-Snaith two-point function (rmt.BK, primes to 1e6),
  Bbar = int rho_c(r)/r^2 dr, rho_c(r) = 1 - S(r)^2 - 3 S'(r)^2/pi^2 = density of the other points given a coincident pair at 0 (sine kernel)."""
import math, numpy as np
import rmt
def Bbar():
    f = lambda r: (1 - np.sinc(r) ** 2 - 3 * ((np.cos(math.pi * r) - np.sinc(r)) / r) ** 2 / math.pi ** 2) / r ** 2
    x, w = np.polynomial.legendre.leggauss(400)
    tot = 0.0
    edges = np.concatenate([[1e-3], np.arange(0.5, 60.01, 0.5)])
    for a, b in zip(edges[:-1], edges[1:]):
        r = 0.5 * (b - a) * x + 0.5 * (b + a); tot += float(np.sum(0.5 * (b - a) * w * f(r)))
    # r < 1e-3: rho_c ~ c r^4 negligible; r > 60: rho_c -> 1 - O(1/r^2): int 1/r^2 = 1/60 minus small
    tot += 1 / 60.0
    return 2 * tot
_BK = {}
def bk(q):
    if q not in _BK: _BK[q] = rmt.BK(q, xmax=0.6, nx=600)
    return _BK[q]
def pred(tau, L, q=1, Bb=None, model='bk'):
    """expected number of zeros lost per zero by backward time tau (unfolded), at log-conductor L"""
    s = math.sqrt(8 * tau) * (1 - tau * Bb if Bb else 1.0)
    if model == 'gue': return 2 * rmt.pair_gue(s)
    return 2 * bk(q).pair(s, L)
def tau_c(g, B):
    """collision time of a pair of unfolded gap g with environment sum B (constant-B pair ODE); inf if g^2 B >= 2"""
    x = 0.5 * g * g * B
    with np.errstate(invalid='ignore', divide='ignore'):
        out = np.where(x < 1, -np.log1p(-np.minimum(x, 0.999999)) / (4 * np.maximum(B, 1e-12)), np.inf)
    return np.where(B < 1e-9, g * g / 8, out)
def env_B(x, i, J=40):
    """B for the adjacent pairs (x_i, x_{i+1}), i an index array, from J neighbours on each side plus the continuum 2/J beyond (unit density)"""
    a = x[i]; b = x[i + 1]; s = np.zeros(len(i))
    for k in range(1, J + 1):
        lo = x[np.maximum(i - k, 0)]; hi = x[np.minimum(i + 1 + k, len(x) - 1)]
        s += 1 / ((a - lo) * (b - lo)) + 1 / ((hi - a) * (hi - b))
    return s + 2.0 / (J + 0.5)
if __name__ == '__main__':
    Bb = Bbar(); print('Bbar (sine kernel, coincident pair) = %.6f' % Bb)
    for L in (10.0, 14.3, 18.9, 21.2):
        for tau in (1e-4, 1e-3, 1e-2):
            print('L=%.1f tau=%g: GUE %.6e  BK pair %.6e  BK pair+triple %.6e' % (L, tau, pred(tau, L, model='gue'), pred(tau, L), pred(tau, L, Bb=Bb)))
