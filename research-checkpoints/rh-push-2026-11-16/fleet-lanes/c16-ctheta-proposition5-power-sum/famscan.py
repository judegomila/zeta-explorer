"""Tapered lattice rows alone at larger n (no optimiser): u_max = 1, u in [1/2, 1]; for each n the largest A = u b_max with
min G >= -1e-3 over the family (spacing 2 pi/kappa; offsets A cos^(2p)(pi x/2) or A exp(-(x/s)^2)). float64 (MEASURED); valid for A <= 24
(cancellation e^A * 1e-16)."""
import os, json, math, sys
import numpy as np
from cluster import Cell, true_min
HERE = os.path.dirname(os.path.abspath(__file__))
cell = Cell(math.e, 1.0, None)
def row(n, kappa, kind, par, A):
    d = 2 * math.pi / kappa
    j = np.arange(n) - (n - 1) / 2
    x = j / ((n + 1) / 2)
    prof = np.cos(math.pi * x / 2) ** (2 * par) if kind == "cos" else np.exp(-(x / par) ** 2)
    return j * d, np.maximum(A * prof / prof.max(), 1e-5)
def one(n):
    best = None; table = []
    for A in (4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24):
        r = None
        for kappa in (1.05, 1.1, 1.2, 1.35, 1.6, 2.0, 3.0, 5.0):
            for kind, par in (("cos", 1), ("cos", 2), ("cos", 4), ("gauss", 0.3), ("gauss", 0.4), ("gauss", 0.5)):
                g, b = row(n, kappa, kind, par, float(A))
                m = true_min(cell, g, b, None, fine=1, us=cell.us, pad=150.0)[0]
                if r is None or m > r[0]: r = (m, kappa, kind, par)
        table.append((A,) + r)
        if r[0] >= -1e-3: best = (A,) + r
        elif best is not None and A >= best[0] + 4: break
    print("famscan n", n, "A_max", None if best is None else best, [(t[0], "%.2e" % t[1], t[2], t[3], t[4]) for t in table], flush=True)
    return dict(n=n, best=best, table=table)
if __name__ == "__main__":
    from multiprocessing import Pool
    with Pool(int(os.environ.get("RH_WORKERS", "2"))) as p:
        out = p.map(one, [12, 16, 24, 32, 40, 60, 80, 120], chunksize=1)
    json.dump(out, open(os.path.join(HERE, "out_famscan.json"), "w"))
    print("done")
