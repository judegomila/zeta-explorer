"""Monotonicity of the margin between consecutive windows: T(N+1) - T(N) on blocks of consecutive N, zeta (primes <= 11 and <= 3) and controls."""
import sys, json, math
from lib import *
BL = int(sys.argv[1]) if len(sys.argv) > 1 else 300
starts = [1000, 3000, 10000, 30000, 100000, 300000, 690988, 1000000, 2000000, 3840000 - BL]
NMAX = 3840000; out = []
dh = {int(d): v for d, v in json.load(open('dh_lam_690988_t0.json')).items()}
cases = [('ZETA P11', 'ZETA', euler_moll('ZETA', (2, 3, 5, 7, 11), T0)), ('ZETA P3', 'ZETA', euler_moll('ZETA', (2, 3), T0)), ('LCHI5 P11', 'LCHI5', euler_moll('LCHI5', (2, 3, 5, 7, 11), T0)),
         ('DH optimised mollifier of N = 690988', 'DH', (dh, 72072)), ('DH no mollifier', 'DH', ({1: 1.0}, 1)), ('TNR own', 'TNR', euler_moll('TNR', (2, 3, 5, 7, 11), T0))]
for name, base, (lam, D) in cases:
    tr = Tri(coefs(base, NMAX), D, NMAX)
    for s in starts:
        v = np.array([tr.value(N, T0, Y0, lam) - err_budget(N, T0, Y0) for N in range(s, s + BL + 1)]); d = np.diff(v)
        r = dict(F=name, N0=s, steps=BL, decreasing_steps=int((d < 0).sum()), largest_drop=float(max(0.0, -d.min())), mean_step=float(d.mean()), delta_first=float(v[0]), delta_last=float(v[-1]))
        out.append(r); print(json.dumps(r), flush=True)
    del tr
json.dump(out, open('c4_consec.json', 'w'), indent=1)
