"""Combination 1: Levinson quantities on a window, all functions. V = F + F'/L_F on Re s = sigma0 = 1/2 - R/L_F,
mollifier psi(1/2 + it) = sum_{n<=y} b(n) (log(y/n)/log y) n^{-1/2-it}, b multiplicative with |b(p)| <= 1."""
import math, numpy as np
import core
from core import *
import os as _os
QN, CN, AE = 3, float(_os.environ.get("S2_CN", "2.2")), 0.25

def window_setup(tc, H, ymax, hfac=1.25):
    h0 = 2 * math.pi / (hfac * (math.log(5 * tc / (2 * math.pi)) + math.log(ymax)))
    M = 1 << int(math.ceil(math.log2(H / h0)))
    h = H / M
    Smax = int(max(math.sqrt(5 * (tc + H) / (2 * math.pi)) * math.exp(7.5 / 4) + 10, ymax + 1))
    return h, M, Smax

def all_V(tc, h, M, Smax, R, coefs, want=('ZETA', 'TNR', 'EA', 'LIOU', 'LCHI', 'DH')):
    """returns dict name -> V on the grid (xp complex), and the window"""
    w = Win(tc, h, M, Smax)
    L = math.log(tc / (2 * math.pi)); s0 = 0.5 - R / L
    L5 = math.log(5 * tc / (2 * math.pi)); s5 = 0.5 - R / L5
    LE = 2 * L; sE = 0.5 - R / LE
    V = {}; info = {'L': L, 'sigma0': s0, 'L5': L5, 'sigma5': s5, 'LE': LE, 'sigmaE': sE}
    z, zd = F_and_deriv(w, s0, 1, 0, coefs['one'])
    if 'ZETA' in want: V['ZETA'] = z + zd / L
    if 'TNR' in want:
        qz = math.sqrt(QN) ** (2 * s0 - 1) * phasor(math.log(QN), w)        # q^{s-1/2}
        m = qz + CN + 1 / qz; md = math.log(QN) * (qz - 1 / qz)
        V['TNR'] = z * m + (zd * m + z * md) / L
        del qz, m, md
    if 'LIOU' in want:
        w2 = Win(2 * tc, 2 * h, M, int(math.sqrt(2 * tc / (2 * math.pi)) * math.exp(7.5 / 4) + 10))
        z2, z2d = F_and_deriv(w2, 2 * s0, 1, 0, coefs['one'])
        F = z2 / z; Fd = 2 * z2d / z - z2 * zd / (z * z)
        V['LIOU'] = F + Fd / L
        del w2, z2, z2d, F, Fd
    del z, zd
    if 'EA' in want:
        za, zad = F_and_deriv(w, sE + AE, 1, 0, coefs['one']); zb, zbd = F_and_deriv(w, sE - AE, 1, 0, coefs['one'])
        V['EA'] = za * zb + (zad * zb + za * zbd) / LE
        del za, zad, zb, zbd
    if 'LCHI' in want or 'DH' in want:
        lc, lcd = F_and_deriv(w, s5, 5, 1, coefs['chi'], epsroot=EPS5)
        if 'LCHI' in want: V['LCHI'] = lc + lcd / L5
        if 'DH' in want:
            lb, lbd = F_and_deriv(w, s5, 5, 1, coefs['chib'], epsroot=np.conj(EPS5))
            V['DH'] = C1 * (lc + lcd / L5) + C2 * (lb + lbd / L5)
            del lb, lbd
        del lc, lcd
    return V, w, info

def cmult(y, cfun):
    """completely multiplicative c(n), n <= y, from cfun(p) (numpy complex array indexed 0..y)"""
    c = np.ones(y + 1, dtype=np.complex128)
    for p in primes_upto(y):
        v = cfun(int(p)); pk = p
        while pk <= y:
            c[pk::pk] *= v; pk *= p
    return c

def moll_coefs(y, dhopt=None):
    """dict name -> numpy complex array (index n-1), b(n) P(log(y/n)/log y) n^{-1/2}"""
    n = np.arange(1, y + 1)
    mu = mobius_upto(y)[1:].astype(np.complex128)
    P = np.log(y / n) / math.log(y); rt = P / np.sqrt(n)
    chi = CHI5[n % 5]
    out = {'MU': mu * rt, 'ABSMU': np.abs(mu) * rt, 'MUCHI': mu * chi * rt, 'MUCHIBAR': mu * np.conj(chi) * rt,
           'MU_NO3': mu * (n % 3 != 0) * rt}
    cre = cmult(y, lambda p: complex(CHI5[p % 5].real))          # c(p) = Re chi(p): 1, 0, 0, -1 on the classes 1, 2, 3, 4
    out['MURE'] = mu * cre[1:] * rt
    # b(p) = -1, b(p^2) = +1, b(p^k) = 0 for k >= 3
    b2 = np.ones(y + 1, dtype=np.complex128)
    for p in primes_upto(y):
        b2[p::p] *= -1
        if p * p <= y: b2[p*p::p*p] *= -1
        if p ** 3 <= y: b2[p**3::p**3] = 0
    out['MU2'] = b2[1:] * rt
    if dhopt:
        for key, par in dhopt.items():
            cl = [0] + [complex(*v) for v in par['class']]; pr = {int(k): complex(*v) for k, v in par['primes'].items()}
            c = cmult(y, lambda p: pr.get(p, cl[p % 5] if p != 5 else 0))
            out[key] = mu * c[1:] * rt
    return out

OPTIONS = {'ZETA': ['none', 'MU'], 'LCHI': ['none', 'MUCHI'], 'DH': ['none', 'MUCHI', 'MUCHIBAR', 'MURE', 'OPTJ', 'OPTG'],
           'TNR': ['none', 'MU', 'MU_NO3'], 'EA': ['none', 'MU', 'MU2'], 'LIOU': ['none', 'ABSMU']}

def stats(A2, R):
    """A2 = |V psi|^2 on the grid -> (meansq, meanlog|V psi|, kappa_J, kappa_nJ, gap)"""
    ms = float(A2.mean()); ml = 0.5 * float(xp.log(A2).mean())
    return ms, ml, 1 - math.log(ms) / R, 1 - 2 * ml / R, (math.log(ms) - 2 * ml) / R
