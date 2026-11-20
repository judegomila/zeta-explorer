"""synth3.py -- synthetic signed pair showing that the cluster cap is not valid for signed amplitudes (it is a theorem for a_i >= 0)."""
import math, json
import numpy as np
from an3_check import corr_closed, corr_quad, cap, mu
out = []
for D, g, s in [(8.0, 0.1, 0.1), (32.0, 0.1, 0.1), (128.0, 0.1, 0.05), (128.0, 1.0, 2.0)]:
    U, V = 100.0, 100.0 + D
    ua = [U - s - g, U - s]; aa = [-math.exp(-mu * g), 1.0]; ub = [V + s, V + s + g]; ab = [1.0, -math.exp(-mu * g)]
    r = corr_closed(ua, aa, ub, ab, U, V); q = corr_quad(ua, aa, ub, ab) / cap(D) if D <= 32 else None
    out.append(dict(D=D, pair_gap=g, distance_to_edge=s, R_closed=float(r), R_quadrature=q, limit=2 * mu * D / (1 + mu * D)))
    print(out[-1])
json.dump(out, open("synth3.json", "w"), indent=1)
