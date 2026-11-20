"""c15 identity check of the paper deletions (PREREG section 2): on every HEAT pair (g K3_zeta, g K_chi) the deleted
families must equal those of the positive pair (zeta, chi); L2 shifts must equal tau h^2 / 2. usage: ncheck.py <out.json>"""
import json
import sys
import numpy as np
import kern
import jk
import jobj
import nobj
import nf

P = nobj.build({}, (1, 2, 3, 5, 6, 7, 8, 9))
heat = [p for p in P if p.group in ('C4', 'H4')]
Z = jk.W(kern.ZETA)
r = np.random.Generator(np.random.PCG64(155000))
res = {}
for g, dele, shifted in (('g0', ['a1-without'], []), ('g1', ['b4m-without', 'b6-without'], ['b1-Ao', 'b1-B']), ('g2', ['b2-without', 'b2-B', 'b5m-without'], [])):
    u = r.uniform(-2.6, 2.6, 4000)
    h = r.uniform(0.005, 1.7, 4000)
    ok = np.abs(u) + nf.REACH[g] * h <= 2.6
    u, h = u[ok][:2000], h[ok][:2000]
    for fam in dele + shifted:
        worst = 0.0
        n = 0
        for p in heat:
            pp = jobj.Pair('P', Z, p.B.b)
            V = nf.eval_group(g, u, h, [p, pp], [fam])[fam]
            d = V[0][:, 0] - V[0][:, 1]
            if fam in shifted:
                d = d - p.B.tau * h * h / 2
            tol = V[1][:, 0] + V[1][:, 1]
            okk = np.isfinite(d) & np.isfinite(tol)
            sc = np.maximum(np.abs(V[0][:, 1]), 1.0)
            worst = max(worst, float(np.max(np.abs(d[okk]) / (sc[okk] + 1e6 * tol[okk]))))
            n += int(okk.sum())
        res[fam] = dict(kind='shift tau h^2/2' if fam in shifted else 'equal', pairs=len(heat), entries=n, worst_scaled_difference=worst)
        print(fam, res[fam], flush=True)
json.dump(res, open(sys.argv[1], 'w'), indent=1)
