"""Extremes of |m_P(i tau)|^2 = prod_{p<=P} |1 - p^{-1/2 - i tau}|^2 on [0,H] against the Kronecker bounds."""
import numpy as np, json
from plib import primes_upto
out = {}
for P in (7, 100):
    ps = primes_upto(P).astype(float)
    kmin = float(np.prod((1 - ps ** -0.5) ** 2)); kmax = float(np.prod((1 + ps ** -0.5) ** 2)); mean = float(np.prod(1 + 1 / ps))
    rows = []; lo, hi, edge = np.inf, 0.0, 0.0
    for H in (1e2, 1e3, 1e4, 1e5, 1e6):
        while edge < H:
            tau = np.arange(edge, min(edge + 2e4, H), 0.01)   # planned: 2e6 floats per chunk, 16 MB
            lg = np.zeros_like(tau)
            for p in ps:
                lg += np.log1p(-2 * p ** -0.5 * np.cos(tau * np.log(p)) + 1 / p)
            lo = min(lo, float(np.exp(lg.min()))); hi = max(hi, float(np.exp(lg.max()))); edge = min(edge + 2e4, H)
        rows.append({"H": H, "min": lo, "max": hi}); print(P, rows[-1], flush=True)
    out[P] = {"kronecker_min": kmin, "kronecker_max": kmax, "mean": mean, "rows": rows}
    print(P, kmin, kmax, mean)
json.dump(out, open(__file__.rsplit('/', 1)[0] + '/kron.json', 'w'), indent=1)
