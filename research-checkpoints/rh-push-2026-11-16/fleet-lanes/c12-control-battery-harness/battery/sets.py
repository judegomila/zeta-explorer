"""Greedy floor sets (THIN, DEL): c_0 = 0, c_n = min(c_{n-1} + 1, floor(L(p_n))), S = {p_n : c_n = c_{n-1} + 1},
L(x) = m (Ei(b log x) - Ei(b log 2)); m = 1 (DEL), m = 1/2 (THIN). Rule of push/c10-thin-deletion-zero-mode-control/del_control.py
(re-typed). The floor is decided in float64 when the fractional part is at least 1e-6 from an integer and in ball arithmetic otherwise."""
import numpy as np, math
from scipy.special import expi
from flint import arb, ctx


def Lball(x, b, m):
    b = arb(b)
    return arb(m) * ((b * arb(int(x)).log()).ei() - (b * arb(2).log()).ei())


def build(primes, b, m):
    """b, m as strings (decimal) -> list of primes in S, and statistics"""
    bf = float(arb(b).mid()); mf = float(arb(m).mid())
    Lf = mf * (expi(bf * np.log(primes.astype(np.float64))) - expi(bf * math.log(2.0)))
    fl = np.floor(Lf).astype(np.int64)
    frac = Lf - fl
    risky = np.nonzero((frac < 1e-6) | (frac > 1 - 1e-6))[0]
    nball = 0
    for i in risky:
        if primes[i] == 2: fl[i] = 0; continue
        for pr in (128, 256, 512):
            ctx.prec = pr
            f = Lball(primes[i], b, m).floor().unique_fmpz()
            if f is not None: break
        else: raise RuntimeError('floor undecided at p = %d' % primes[i])
        fl[i] = int(f); nball += 1
    ctx.prec = 128
    k = 1 + np.arange(len(primes), dtype=np.int64)
    c = k + np.minimum(np.minimum.accumulate(fl - k), 0)
    cp = np.concatenate(([0], c[:-1]))
    inS = c > cp
    return primes[inS], dict(nprimes=int(len(primes)), sizeS=int(inS.sum()), floors_decided_in_balls=int(nball),
                             max_float_error_assumed=1e-6)
