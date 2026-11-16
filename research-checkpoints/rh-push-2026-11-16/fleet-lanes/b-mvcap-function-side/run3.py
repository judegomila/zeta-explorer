"""Cluster half-width dependence of the minimal double-lift (eta = 1e-3) at the smallest |Z| extremum near the block centre."""
import numpy as np, math, sys, json
from model2 import *
from scipy.interpolate import CubicSpline
rows = []
for f in sys.argv[1:]:
    D = np.load(f); T0 = float(D['T0']); zs = D['zeros']; cs = CubicSpline(D['d'], D['z']); half = D['d'].max()
    L0 = math.log(T0 / (2 * math.pi)); dens = L0 / (2 * math.pi)
    g0 = zs[np.abs(zs) <= min(8, half / 2)]; ge = gap_extrema(g0); i = int(np.argmin([abs(cs(x[0])) for x in ge])); tm0 = ge[i][0]
    for h in [1.0, 2.5, 5, 10, 25, 50]:
        if h + abs(tm0) > half: continue
        g = zs[np.abs(zs - tm0) <= h]
        ge = gap_extrema(g); j = int(np.argmin([abs(x[0] - tm0) for x in ge])); tm = ge[j][0]
        m = build(g, tm, 0.0, eta=1e-3); w, r, rs = new_roots(m); nnr = int(np.sum(np.abs(w.imag) > 1e-9))
        tau = np.linspace(-4 * h - 10, 4 * h + 10, 8001); row = dict(T0=T0, h=h, k=len(g), t_m=float(tm), Zm=float(abs(cs(tm))), nonreal=nnr)
        for a in [0.5, 1.5, 2.5]:
            E = float(np.abs(ratio(m, tm + tau - 1j * a)).max()); row['E_a%.1f' % a] = E; row['E_over_scale_a%.1f' % a] = E / (abs(cs(tm)) * math.exp(-a * L0 / 2))
        rows.append(row)
        print('T0=%.3g h=%4.1f k=%3d t_m=%+.4f |Z(t_m)|=%.4g nonreal=%d | sigma=1: E=%.3e (x%.2f) | sigma=2: E=%.3e (x%.2f) | sigma=3: E=%.3e (x%.2f)   [xN = E / (|Z(t_m)| (T/2pi)^(-a/2))]' % (T0, h, len(g), tm, abs(cs(tm)), nnr, row['E_a0.5'], row['E_over_scale_a0.5'], row['E_a1.5'], row['E_over_scale_a1.5'], row['E_a2.5'], row['E_over_scale_a2.5']))
json.dump(rows, open('out_hscan.json', 'w'), indent=1)
