"""Values on the physical orbit: for window N (x_N = 4 pi (N^2 - t/16)) and x = x_N + 4 pi f (2N+1), f in [0,1):
  theta_n = (x/2) ln n,  B = sum w_n e^{-i theta_n},  A = sum w'_n e^{+i theta_n}  for several weight columns at once.
Phase in turns: (N^2 - t/16) ln n [longdouble on the CPU, reduced mod 1] + f (2N+1) ln n [float64].
sigma_B, gamma are the left-edge constants of tri.consts (the certificate's chart); screen in float64."""
import math, numpy as np
import tri
from tri import xp
LD = np.longdouble

def turns0(N, t, lnld):
    return np.fmod(LD(N) * LD(N) * lnld - LD(t / 16) * lnld, LD(1)).astype(np.float64)

def sums(N, t, fr, WB, WA, chunk=None):
    """WB, WA: numpy (N, K) real or complex, row n-1. Returns B, A: numpy complex (len(fr), K)."""
    J = len(fr); K = WB.shape[1]
    lnld = np.log(np.arange(1, N + 1, dtype=LD))
    t0 = xp.asarray(turns0(N, t, lnld)); ln = xp.asarray(lnld.astype(np.float64))
    ff = xp.asarray(np.asarray(fr, dtype=np.float64) * (2 * N + 1))
    if chunk is None: chunk = max(256, int(6e7 // J))
    B = xp.zeros((J, K), dtype=xp.complex128); A = xp.zeros((J, K), dtype=xp.complex128)
    WBg = xp.asarray(WB.astype(np.complex128)); WAg = xp.asarray(WA.astype(np.complex128))
    for s in range(0, N, chunk):
        tu = t0[None, s:s + chunk] + ff[:, None] * ln[None, s:s + chunk]
        e = xp.exp((-2j * math.pi) * (tu - xp.floor(tu)))
        B += e @ WBg[s:s + chunk]; A += xp.conj(e) @ WAg[s:s + chunk]
        del tu, e
    return tri.asnp(B), tri.asnp(A)

def phases_small(N, t, fr, ns):
    """e^{-i theta_n} for a few n: numpy complex (len(fr), len(ns)); longdouble throughout"""
    l = np.log(np.asarray(ns, dtype=LD))
    tu = (LD(N) * LD(N) - LD(t / 16)) * l[None, :] + (np.asarray(fr, dtype=LD) * LD(2 * N + 1))[:, None] * l[None, :]
    tu = np.fmod(tu, LD(1)).astype(np.float64)
    return np.exp(-2j * math.pi * tu)

def moll_values(N, t, fr, lam, sigma):
    """E(s_B) = sum_d lam_d d^-sigma e^{-i theta_d} for a dict lam"""
    ds = sorted(lam); ph = phases_small(N, t, fr, ds)
    return ph @ np.array([lam[d] * d ** -sigma for d in ds])

def euler_values(N, t, fr, primes, ap, sigma):
    """prod_p (1 - a(p) b_t(p) p^-sigma e^{-i theta_p})"""
    ph = phases_small(N, t, fr, primes); E = np.ones(len(fr), dtype=complex)
    for i, p in enumerate(primes):
        E *= 1 - ap[i] * tri.bt(p, t) * p ** -sigma * ph[:, i]
    return E

def euler_dict(primes, ap, t):
    lam = {1: 1.0}
    for p, a in zip(primes, ap):
        lam.update({d * p: -v * a * tri.bt(p, t) for d, v in lam.items()})
    return {d: v for d, v in lam.items() if v != 0}
