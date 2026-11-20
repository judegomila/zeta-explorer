"""Combination 1, statistic: Lambda_H / kappa_H against height, from per-pair landing tables (c1_flow.py output; z units, Y = 2 (beta - 1/2)).
Lambda_H = largest landing time among pairs below H (inner 80 % of the run), kappa_H = largest Y^2/2 below H = (2 theta_H - 1)^2/2.
Usage: c1_grade.py FLOW.json [FLOW.json ...]"""
import sys, json, math, numpy as np
out = {}
for fn in sys.argv[1:]:
    d = json.load(open(fn)); p = d['pairs']; g = np.array(p['gamma']); x = np.array(p['x']); land = np.array(p['land'], dtype=float); db = np.array(p['debruijn'])
    Hg = d['Hgamma']; inner = g < 0.8 * Hg; ok = inner & np.isfinite(land)
    print('== %s H=%g: pairs %d (inner landed %d); Lambda >= %.6f at height %.3f (beta-1/2 = %.4f, de Bruijn %.6f); largest de Bruijn value %.6f at height %.1f' % (
        d['obj'], Hg, len(g), int(ok.sum()), land[ok].max(), g[ok][land[ok].argmax()], x[ok][land[ok].argmax()], db[ok][land[ok].argmax()], db[inner].max(), g[inner][db[inner].argmax()]))
    rows = []
    edges = np.unique(np.concatenate([[0.0], np.geomspace(max(g.min() * 1.0001, 1e-3) if g.min() < 30 else 30, 0.8 * Hg, 12)]))
    edges = [e for e in edges]
    for H in edges[1:]:
        m = ok & (g <= H)
        if not m.any(): continue
        lam = land[m].max(); kap = db[inner & (g <= H)].max(); b = ok & (g <= H) & (g > edges[edges.index(H) - 1]); r = land[b] / db[b] if b.any() else np.array([np.nan])
        rows.append(dict(H=float(H), Lambda_H=float(lam), kappa_H=float(kap), ratio=float(lam / kap), band_pairs=int(b.sum()), band_ratio_median=float(np.nanmedian(r)), band_ratio_min=float(np.nanmin(r)), band_ratio_max=float(np.nanmax(r)),
                         band_max_land=float(land[b].max()) if b.any() else None, band_max_db=float(db[b].max()) if b.any() else None))
        print('   H=%-9.4g Lambda_H %.6f kappa_H %.6f ratio %.4f | band: %4d pairs, landing/de Bruijn median %.4f [%.4f, %.4f], max landing %.4f, max de Bruijn %.4f' % (
            H, lam, kap, lam / kap, rows[-1]['band_pairs'], rows[-1]['band_ratio_median'], rows[-1]['band_ratio_min'], rows[-1]['band_ratio_max'], rows[-1]['band_max_land'] or 0, rows[-1]['band_max_db'] or 0))
    out[fn] = dict(obj=d['obj'], Hgamma=Hg, rows=rows)
json.dump(out, open('out/c1_grade.json', 'w'), indent=0)
