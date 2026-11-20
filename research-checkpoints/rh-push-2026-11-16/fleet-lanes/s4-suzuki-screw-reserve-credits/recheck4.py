"""30-digit direct re-evaluation (mpmath, exact prime-power sums) of the modulated box Psi_alpha(L) at the reported first failures."""
import json, math, mpmath as mp
import lib
mp.mp.dps = 30
d = json.load(open('out/c4_local_1e11.json')); out = []
def direct(o, br, L, a, ws=None):
    L = mp.mpf(L); a = mp.mpf(a); v = lib.Cfun_alpha(br, L, a)
    if ws is None:
        ws = [(q, lib.obj_weight(o, p, k)) for q, p, k in lib.prime_powers(int(math.exp(float(L))) + 1)]
    for q, w in ws:
        lq = mp.log(q)
        if lq < L: v -= mp.mpf(w)*(L - lq)*mp.cos(a*lq)
    return v
lam = lib.dh_lambda(5000)
def find(name): return [r for r in d['results'] if r['obj'] == name][0]
import numpy as np
cases = [('DH', None, lib.bridge('odd', N=5)), ('Ea0.05', 'Ea0.05', None), ('Ea0.10', 'Ea0.10', None), ('Ea0.25', 'Ea0.25', None),
         ('TNR3_2.2_own', 'TNR3_2.2', None), ('TNR3_2.2_zb', 'TNR3_2.2zb', None), ('TNR3_2.01_own', 'TNR3_2.01', None), ('liouville(zeta bridge)', 'liouville', None)]
for cname, oname, br in cases:
    r = find(cname); L = r['first_L_negative']; i = r['L'].index(L); a = r['argmin'][i]; val = r['min'][i]
    if oname is None:
        ws = [(n, lam[n]/math.sqrt(n)) for n in range(2, 5000) if lam[n] != 0]; ref = direct(None, br, L, a, ws)
    else:
        o = [x for x in lib.OBJ if x['name'] == oname][0]; ref = direct(o, lib.obj_bridge(o), L, a)
    # the previous L on the grid: minimum over alpha must be >= 0 there (taken from the grid run)
    out.append(dict(obj=cname, L=L, alpha=a, grid_value=val, mp_value=float(ref), prev_L=r['L'][i-1], prev_min=r['min'][i-1]))
    print('%-24s L=%.2f alpha=%.4f  grid %.9f  mpmath %.9f   (min over alpha at L=%.2f: %+.3e)' % (cname, L, a, val, float(ref), r['L'][i-1], r['min'][i-1]))
# zeta: smallest value on the whole grid
z = find('zeta'); j = int(np.argmin(z['min'])); zo = lib.OBJ[0]
ref = direct(zo, lib.obj_bridge(zo), z['L'][j], z['argmin'][j]) if z['L'][j] < 14 else None
print('zeta: smallest value on the grid %.6e at L=%.2f alpha=%.4f ; mpmath %s' % (z['min'][j], z['L'][j], z['argmin'][j], ref))
out.append(dict(obj='zeta', min_over_grid=z['min'][j], L=z['L'][j], alpha=z['argmin'][j], mp_value=None if ref is None else float(ref)))
json.dump(out, open('out/recheck4.json', 'w'), indent=1)
