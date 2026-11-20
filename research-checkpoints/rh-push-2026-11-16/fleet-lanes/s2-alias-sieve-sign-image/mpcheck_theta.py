"""mpcheck_theta.py -- theta_phys and the normaliser nu of the engine (float64) against 40-digit residue sums."""
import math, json
import numpy as np, mpmath as mp
import pklib as L
mp.mp.dps = 40
out = []
for (T0, p, h, k) in [(2 * math.pi * 690988 ** 2, 7, 3, 1), (2 * math.pi * 690988 ** 2, 5, 4, 1), (1e9, 13, 12, 1), (2 * math.pi * 6153547 ** 2, 3, 2, 2)]:
    g = L.Grid(T0, 2, 2.0, p, h, k)
    V, Pm, M1, M2, cnt = L.run_block(g)
    st = L.stats_block(g, V, Pm, M1, M2)
    j = 0
    pr = L.primes_range(g.lo, g.hi)
    c = mp.mpf(float(g.cj[j])); H = mp.mpf(float(g.H[j]))
    Pr = [[mp.mpf(0)] * p for _ in range(3)]; M = [mp.mpf(0)] * 3
    for q in pr:
        q = int(q); x = (mp.mpf(q) - c) / H
        if abs(x) > g.X: continue
        w = mp.log(q) * mp.exp(-x * x / 2 - mp.mpf(L.SIGMA_B) * mp.log(mp.mpf(q) / c))
        cf = L.coef_ref(q, 1)
        for i, vi in enumerate((0, 1, 2)):
            s = cf[vi] / cf[0]
            Pr[i][q % p] += w * s; M[i] += w
    rec = {"T0": T0, "p": p, "h": h, "k": k, "prime_powers_other_than_primes_in_block": int(cnt) - len(pr)}
    for i, (vi, name) in enumerate(((0, "ZETA"), (1, "CHI101"), (2, "SGN"))):
        Ph = np.array([complex(sum(Pr[i][r] * mp.exp(-2j * mp.pi * D * r / p) for r in range(p))) for D in range(p)])
        th = L.theta_from_fourier(p, k, Ph).real
        nu = float(sum(Pr[i]) / M[i])
        rec[name] = {"theta_mp": float(th), "theta_engine": float(st["thpos_re"][j, vi]), "nu_mp": nu, "nu_engine": float(st["nu"][j, vi])}
    out.append(rec); print(rec, flush=True)
json.dump(out, open("mpcheck_theta.json", "w"), indent=1)
