"""c15 referee check R4: quotient minors recomputed without funcs.det_sign (plain numpy determinants, plain
quotients): every sampled functional must have clearly positive and clearly negative training positives.
Also R5: held-out positives of the PZ near-misses of c3-T. usage: ref_check2.py <out.json>"""
import json
import sys
import numpy as np
import funcs
import jf
import nobj
import nmin

out = {}
P = [p for p in nobj.build({}, tuple(range(1, 10))) if p.group in ('P', 'PX')]
rng = np.random.Generator(np.random.PCG64(158000))
for m in (2, 3):
    tab, ngrid = nmin.gen(m, 0.001)
    ii = rng.choice(jf.nfun(tab), 300, replace=False)
    tab = jf.take(tab, ii)
    pts = jf.points('JA', m, tab)                       # (m*m, F)
    both = 0
    npos = np.zeros(300, dtype=int)
    nneg = np.zeros(300, dtype=int)
    for p in P:
        KA = np.asarray(p.A.val(pts.ravel(), True)[0]).reshape(pts.shape)
        KB = np.asarray(p.B.val(pts.ravel(), True)[0]).reshape(pts.shape)
        with np.errstate(all='ignore'):
            R = (KB / KA).T.reshape(300, m, m)
            sc = np.abs(R).max(axis=(1, 2))
            d = np.linalg.det(R / sc[:, None, None]).real
            perm = np.prod(np.abs(R / sc[:, None, None]).sum(axis=2), axis=1)   # upper bound of the permanent of moduli
        ok = np.isfinite(d) & (np.abs(d) > 1e-7 * perm)
        npos += ok & (d > 0)
        nneg += ok & (d < 0)
    out['a%d' % m] = dict(sampled=300, with_both_signs_among_529_positives=int(((npos > 0) & (nneg > 0)).sum()),
                          min_minority_count=int(np.minimum(npos, nneg).min()))
    print('R4', m, out['a%d' % m], flush=True)
J = json.load(open(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)), 'out', 'cT_summary.json')))
rows = [r for r in J['families']['c3']['rows'] if r['tier'] == 'PZ/all']
out['c3T_PZ_rows'] = dict(n=len(rows), ph_same_max=max(r['ph_same'] for r in rows), min_opp_max=max(min(r['h_opp']) for r in rows))
print('R5', out['c3T_PZ_rows'])
json.dump(out, open(sys.argv[1], 'w'), indent=1)
