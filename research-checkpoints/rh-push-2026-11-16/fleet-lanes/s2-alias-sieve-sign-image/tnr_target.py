"""tnr_target.py -- windows aimed at a power of q = 3 (T-NR control), compared with a neighbouring window."""
import math, json
import numpy as np
import pklib as L
out = []
for (p, h, k, m) in [(7, 6, 1, 13), (97, 95, 1, 28), (97, 96, 1, 29), (2, 1, 1, 25), (13, 12, 1, 27)]:
    xi0 = k - h / p
    T0 = 2 * math.pi * xi0 * 3.0 ** m
    g = L.Grid(T0, 3, 2.0, p, h, k)
    V, Pm, M1, M2, cnt = L.run_block(g)
    st = L.stats_block(g, V, Pm, M1, M2)
    rec = {"p": p, "h": h, "k": k, "power": m, "n": 3 ** m, "T0": T0, "H": float(g.H[0]), "prime_powers": int(cnt)}
    for name, vi in (("ZETA", 0), ("TNR", 6)):
        rec[name] = {"window_on_power": {key: float(st[key][0, vi]) for key in ("nu", "thpos_re", "rho_raw", "r", "z")},
                     "next_window": {key: float(st[key][1, vi]) for key in ("nu", "thpos_re", "rho_raw", "r", "z")}}
    out.append(rec); print(rec)
json.dump(out, open("tnr_target.json", "w"), indent=1)
