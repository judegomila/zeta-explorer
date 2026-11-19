"""c15 post-run recount (the run merged two histogram bins): nodes at which NO lam keeps all training positives
one-signed, for the lam-type families. Pair families: positives only (same nodes, same code path); product families:
from the saved product arrays. usage: onesigned.py <outdir> <out.json>"""
import json
import sys
import numpy as np
import nobj
import nf
import nsolve
import nc

O = sys.argv[1]
res = {}
P = [p for p in nobj.build({}, tuple(range(1, 10))) if p.group in ('P', 'PX')]
G = np.array([p.group for p in P])
d = nobj.gidx(G)
for g, fams in (('g1', ['b3-with', 'b3-without']), ('g2', ['b5l-with'])):
    nd = np.load(O + '/' + g + '_nodes.npz')
    cnt = {f: dict(nodes=0, none_PA=0, none_PZ=0) for f in fams}
    for i in range(0, len(nd['u']), 20000):
        V = nf.eval_group(g, nd['u'][i:i + 20000], nd['h'][i:i + 20000], P, fams)
        for f in fams:
            V1, E1, V2, E2 = nf.v2full(V[f])
            r, e, und, sg2 = nsolve.ratio(V1, E1, V2, E2)
            for name, pos in (('none_PA', np.arange(len(P))), ('none_PZ', d['P'])):
                ok = np.zeros(len(r), dtype=bool)
                for s in (1, -1):
                    ok |= nsolve.solve_sign(r, e, und, sg2, s, pos, [np.zeros(0, dtype=np.int64)], False)[3][:, 0] >= 0
                cnt[f][name] += int((~ok).sum())
            cnt[f]['nodes'] += len(r)
    res.update(cnt)
    print(cnt, flush=True)
for kind in ('T', 'Q'):
    Z = np.load(O + '/c%s_objects.npz' % kind)
    J = json.load(open(O + '/c%s_summary.json' % kind))
    R = [dict(C=Z['C'][i], N=Z['N'][i], M=Z['M'][i][:3 if kind == 'T' else 2], Mn=np.zeros((3 if kind == 'T' else 2, 116))) for i in range(len(Z['groups']))]
    G = Z['groups']
    d = nobj.gidx(G)
    iu, ih = nc.node_list()
    V = nc.family_values(R, iu, ih)
    for f in ('c1', 'c3'):
        keep = np.nonzero(ih >= 1)[0] if f == 'c3' else np.arange(len(iu))
        V1, E1, V2, E2 = [x[keep] for x in V[f]]
        r, e, und, sg2 = nsolve.ratio(V1, E1, V2, E2)
        c = dict(nodes=len(r))
        for name, pos in (('none_PA', np.concatenate((d['P'], d['PX']))), ('none_PZ', d['P'])):
            ok = np.zeros(len(r), dtype=bool)
            for s in (1, -1):
                ok |= nsolve.solve_sign(r, e, und, sg2, s, pos, [np.zeros(0, dtype=np.int64)], False)[3][:, 0] >= 0
            c[name] = int((~ok).sum())
        res['%s-%s' % (f, kind)] = c
        print(f, kind, c, flush=True)
json.dump(res, open(sys.argv[2], 'w'), indent=1)
