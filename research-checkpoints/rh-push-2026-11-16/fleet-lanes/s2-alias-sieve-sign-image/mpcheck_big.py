"""mpcheck_big.py -- the C engine (float64) against a 40-digit mpmath sum at contract heights (stationary-twist statistics)."""
import math, json, sys
import numpy as np, mpmath as mp
import pklib as L
mp.mp.dps = 40
out = []
for (T0, p, h, k) in [(2 * math.pi * 690988 ** 2, 2, 1, 1), (2 * math.pi * 690988 ** 2, 7, 3, 1), (2 * math.pi * 6153547 ** 2, 3, 1, 3)]:
    g = L.Grid(T0, 2, 2.0, p, h, k)
    V, Pm, M1, M2, cnt = L.run_block(g)
    st = L.stats_block(g, V, Pm, M1, M2)
    j = 0
    pr = L.primes_range(g.lo, g.hi)
    c = mp.mpf(float(g.cj[j])); H = mp.mpf(float(g.H[j])); xi = mp.mpf(k * p - h) / p
    A = [mp.mpc(0)] * 3; M1r = mp.mpf(0); M2r = mp.mpf(0); nt = 0
    sq = {(i * i) % 101 for i in range(1, 101)}
    for q in pr:
        q = int(q); x = (mp.mpf(q) - c) / H
        if abs(x) > g.X: continue
        lg = mp.log(mp.mpf(q) / c)
        w = mp.log(q) * mp.exp(-x * x / 2 - mp.mpf(L.SIGMA_B) * lg) * mp.exp(-2j * mp.pi * (xi * c * lg + mp.mpf(h * q) / p))
        cf = L.coef_ref(q, 1)
        A[0] += w; A[1] += w * (cf[1] / cf[0]); A[2] += w * (cf[2] / cf[0]); M1r += abs(w); M2r += abs(w) ** 2; nt += 1
    # main term at 40 digits (quadrature over x)
    cfrac = (mp.mpf(k * p - h) * c / p); cfrac -= mp.floor(cfrac)
    def integrand(x):
        y = x * H / c; l = mp.log1p(y)
        return mp.exp(-x * x / 2 - mp.mpf(L.SIGMA_B) * l) * mp.exp(-2j * mp.pi * xi * c * (l - y))
    I = H * mp.quad(integrand, mp.linspace(-g.X, g.X, 41)) * mp.exp(2j * mp.pi * cfrac)
    r_mp = abs(A[0] - I) / M1r; z_mp = abs(A[0] - I) / mp.sqrt(M2r)
    rec = {"T0": T0, "p": p, "h": h, "k": k, "primes_in_window": nt, "prime_squares_in_block_ignored_by_mp": int(cnt) - len(pr),
           "r_zeta_engine": float(st["r"][j, 0]), "r_zeta_mp": float(r_mp), "z_zeta_engine": float(st["z"][j, 0]), "z_zeta_mp": float(z_mp),
           "r_chi101_engine": float(st["r"][j, 1]), "r_chi101_mp": float(abs(A[1]) / M1r), "r_sgn_engine": float(st["r"][j, 2]), "r_sgn_mp": float(abs(A[2]) / M1r),
           "main_term_rel_diff": float(abs(I - complex(L.main_term(g)[j])) / abs(I))}
    out.append(rec); print(rec, flush=True)
json.dump(out, open("mpcheck_big.json", "w"), indent=1)
