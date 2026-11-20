"""c16: full held-out counts (no early exit) at sampled ball T-train nodes, at three thresholds of the feasible interval.
usage: diag2.py <merged.json> <outjson> <fam> <n> <seed>"""
import json, sys, random
import numpy as np
import cball, nball, nf, nsolve
d = json.load(open(sys.argv[1]))
fam, n, seed = sys.argv[3], int(sys.argv[4]), int(sys.argv[5])
cball.setup()
D = cball.D
rows = [q for q in d['rows'] if q['fam'] == fam and q['res'] == 'ttrain']
rows = random.Random(seed).sample(rows, n)
g = nball.group_of(fam)
pos = np.concatenate((D['P'], D['PX']))
cls = [D['C%d' % k] for k in cball.CANON]
train = np.concatenate([pos] + cls)
out = []
for q in rows:
    u, h = np.array([q['u']]), np.array([q['h']])
    nball._CACHE.clear()
    V1, E1, V2, E2 = nf.v2full(nf.eval_group(g, u, h, cball.PAIRS, [fam])[fam])
    r, e, und, sg2 = nsolve.ratio(V1, E1, V2, E2)
    row = cball.Row(fam, u[0], h[0], r[0], e[0], und[0], sg2[0])
    status, ints, info = cball.resolve(row, pos, cls, train)
    s, lo, up = ints[0]
    for key in ('PH', 'H2', 'H3', 'H4'):
        for j in D[key]:
            row.ball(int(j))
    rec = dict(fam=fam, node=q['node'], u=q['u'], h=q['h'], status=status, s=s, lo=lo, up=up, failed=len(row.failed), counts={})
    for name, t in (('near_zeta_end', 0.01 if s == -1 else 0.99), ('mid', 0.5), ('near_heat_end', 0.99 if s == -1 else 0.01)):
        lam = lo + t * (up - lo)
        rec['counts'][name] = cball._counts(row, ('PH', 'H2', 'H3', 'H4'), lam, s)
    # held-out values relative to the interval: how many held-out members of each class lie inside it
    rec['inside'] = {key: int(sum(1 for j in D[key] if lo < row.r[0, int(j)] < up)) for key in ('PH', 'H2', 'H3', 'H4')}
    print(rec, flush=True)
    out.append(rec)
json.dump(out, open(sys.argv[2], 'w'), indent=1)
print('DIAG2-DONE')
