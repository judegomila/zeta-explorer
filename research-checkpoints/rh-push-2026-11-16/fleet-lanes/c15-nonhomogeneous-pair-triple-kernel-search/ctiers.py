"""c15 amendment A6: tiers canon and six for the product families, from the saved product arrays (member noise 0).
usage: ctiers.py <outdir> <out.json>"""
import json
import sys
import numpy as np
import nobj
import nsolve
import nc

res = {}
for kind in ('T', 'Q'):
    Z = np.load(sys.argv[1] + '/c%s_objects.npz' % kind)
    m = 3 if kind == 'T' else 2
    R = [dict(C=Z['C'][i], N=Z['N'][i], M=Z['M'][i][:m], Mn=np.zeros((m, 116))) for i in range(len(Z['groups']))]
    d = nobj.gidx(Z['groups'])
    iu, ih = nc.node_list()
    V = nc.family_values(R, iu, ih)
    for f in ('c1', 'c2', 'c3'):
        keep = np.nonzero(ih >= 1)[0] if f == 'c3' else np.arange(len(iu))
        V1, E1, V2, E2 = [x[keep] for x in V[f]]
        s, rows = nsolve.analyse(V1, E1, V2, E2, d, nobj.ALLC, nobj.FE_CLASSES, extra=True)
        res['%s-%s' % (f, kind)] = {t: {k: s[t][k] for k in ('ttrain', 'undecided', 'full', 'best_min_heldout', 'nrej_hist', 'rejected')} for t in ('PA/all', 'PA/FE', 'PA/canon', 'PA/six', 'PZ/all')}
        res['%s-%s' % (f, kind)]['rows'] = [r for r in rows if r['tier'] in ('PA/canon', 'PA/six')][:200]
        print(f, kind, {t: (s[t]['ttrain'], s[t]['undecided'], s[t]['full'], s[t]['best_min_heldout']) for t in ('PA/all', 'PA/FE', 'PA/canon', 'PA/six', 'PZ/all')}, 'no one-signed lam (PA):', s['PA/all']['nrej_hist'][0], flush=True)
json.dump(res, open(sys.argv[2], 'w'), indent=1)
