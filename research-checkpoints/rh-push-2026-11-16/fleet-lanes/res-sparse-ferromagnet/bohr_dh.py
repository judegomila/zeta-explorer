"""Davenport-Heilbronn stage with the critical Curie-Weiss weights: zeros away from the line.
Float64. Largest planned allocation: 250 MB chunks (see evalZ)."""
import numpy as np, json
from bohr_stage import evalZ, winding
from bohr_controls_lib import general
kappa = 0.284079043840412
chi5 = {1: 1, 2: 1j, 3: -1j, 4: -1}
OUT = {}
for primes in [[2, 3], [2, 3, 7], [2, 3, 7, 11, 13], [2, 3, 7, 11, 13, 17, 19]]:
    L = sum(np.log(p) for p in primes); c = 1 / (2 * L)
    l1, w1 = general(primes, [[1, chi5[p % 5]] for p in primes], c)
    l2, w2 = general(primes, [[1, np.conj(chi5[p % 5])] for p in primes], c)
    w = ((1 - 1j * kappa) / 2 * w1 + (1 + 1j * kappa) / 2 * w2).real
    f = lambda z: evalZ(l1, w, z)
    T = 2 * np.pi * 250 / L + 0.0137; t1 = 0.0371
    res = dict(primes=primes, logM=L, T=T)
    wn, mx, _ = winding(f, -1.5, 2.5, t1, T, n_vert=1000000)
    res.update(zeros_in_box=round(wn), step_box=mx)
    for d in [0.05, 0.01]:
        wr, mxr, _ = winding(f, 0.5 + d, 2.5, t1, T, n_vert=1000000)
        wl, mxl, _ = winding(f, -1.5, 0.5 - d, t1, T, n_vert=1000000)
        res[f"right_beyond_{d}"] = round(wr); res[f"left_beyond_{d}"] = round(wl); res[f"step_{d}"] = max(mxr, mxl)
    OUT[str(primes[-1])] = res; print(json.dumps(res), flush=True)
json.dump(OUT, open("bohr_dh.json", "w"), indent=1)
