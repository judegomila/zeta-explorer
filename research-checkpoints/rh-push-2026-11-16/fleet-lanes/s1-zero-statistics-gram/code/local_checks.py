"""Local cross-checks (small case, Mac): (1) DH on-line zeros below 2000 from the sampler against the battery table (independent code);
(2) small-gap Hill exponent and adjacent-box correlation on the battery HEAT tables (exact heat-deformed xi, heights below 2000)."""
import sys, json, math, numpy as np
import zstats as Z, lsample as Ls
lz, tab = sys.argv[1], sys.argv[2]
z = np.load(lz)
d = json.load(open(tab + '/zeros_DH.json')); on = np.array([float(v) for v in d['online']])
mine = z['t_DH']; mine = mine[mine < 2000]; ref = on[on >= 10]
print('DH on-line zeros in [10, 2000): sampler %d, battery %d' % (len(mine), len(ref)))
if len(mine) == len(ref): print('  max |difference| = %.3e' % np.abs(mine - ref).max())
out = dict(dh_check=dict(n_sampler=int(len(mine)), n_battery=int(len(ref)), maxdiff=float(np.abs(mine - ref).max()) if len(mine) == len(ref) else None))
for code in ('ZETA_2H', 'HEAT--0.1', 'HEAT--0.5', 'DH'):
    d = json.load(open('%s/zeros_%s.json' % (tab, code)))
    key = 'online' if 'online' in d else [k for k in d if isinstance(d[k], list) and len(d[k]) > 1000][0]
    t = np.array([float(v) for v in d[key]]); t = t[t > 10]
    g = np.diff(t); u = g / Z.moving_mean(g, 201)
    sm = u[u < 0.3]
    k = len(sm) / np.sum(np.log(0.3 / sm)) if len(sm) > 3 else float('nan')
    out[code] = dict(n=int(len(t)), n_gap_lt_0p3=int(len(sm)), n_gap_lt_0p1=int((u < 0.1).sum()), gue_lt_0p3=float(len(u) * 0.0276), gue_lt_0p1=float(len(u) * 0.00109), hill_k_s0p3=float(k), se=float(k / math.sqrt(max(len(sm), 1))))
    print(code, out[code])
json.dump(out, open(sys.argv[3], 'w'), indent=1)
