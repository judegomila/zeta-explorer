"""Check of the binary128 phases of t4_prime.py: T log n mod 2 pi against mpmath with 60 digits, T = 1e10 .. 1e20, 200 values of n up to 1e10."""
import numpy as np, bl, json
from mpmath import mp, mpf, log, pi, floor
mp.dps = 60
rng = np.random.default_rng(3); n = np.unique(np.concatenate([[2, 3, 5, 7, 1000003, 9999999967], rng.integers(2, 10 ** 10, 194)])).astype(np.float64)
out = {}
for T in (1e10, 1e14, 1e18, 1e20):
    phi, lg = bl.phase_big(n, T); worst = 0.0
    for v, p in zip(n, phi):
        x = mpf(int(T)) * log(mpf(int(v))); r = x - 2 * pi * floor(x / (2 * pi) + mpf(1) / 2); d = abs(float(r - mpf(float(p))))
        d = min(d, abs(d - 2 * float(pi))); worst = max(worst, d)
    out['%g' % T] = worst; print('T = %g: largest phase error %.2e (binary128 available: %s)' % (T, worst, bl.HAVE_QUAD), flush=True)
json.dump(out, open('out/t4_phase_check.json', 'w'))
