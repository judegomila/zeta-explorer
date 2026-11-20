import du, json
from flint import ctx, arb
O = du.build_objects()
ctx.prec = 128
nd = {"u": 0.02685590329937515, "h": 0.1857637732063288, "id": 35, "srho": -1.0, "Lr": 2.8106152535909974}
ev = du.NodeEval('T3', nd, False)
ev.level = {'ZETA': 3, 'TNR11_2.658646': 3}
items = [ev.V(o) + (o.grp, o.name) for o in O if o.grp in du.TRAIN]
wild = []; pos = []
ivs = du.scan_core(du.ball_objs(items), True, pos, wild)
names = [it[3] for it in items]
ctx.prec = 1024
rz = ev.V(O[0])[0] / ev.V(O[0])[1]
for i, (cnt, w) in enumerate(zip(ivs, wild)):
    for s in (1, -1):
        for k, cl in du.TIERS.items():
            st = du.train_state(cnt, cl, s)
            if st: print('interval', i, 'tier', k, 's', s, 'state', st, cnt, [names[j] for j in w],
                         'lo/rz', None if i == 0 else (pos[i-1] / rz).str(12), 'hi/rz', None if i == len(pos) else (pos[i] / rz).str(12))
# order of breakpoints near zeta
import functools
bo = du.ball_objs(items)
near = sorted([(float(((b[0] + b[1]) / 2 / rz).mid()), names[i], b[2]) for i, b in enumerate(bo) if b[0] is not None], key=lambda x: x[0])
iz = [n for _, n, _ in near].index('ZETA')
print(near[max(0, iz - 6): iz + 8])
