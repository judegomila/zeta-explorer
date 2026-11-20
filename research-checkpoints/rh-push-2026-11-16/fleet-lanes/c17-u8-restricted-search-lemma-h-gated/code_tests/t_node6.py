"""the one node at which the two-class tier {T-NR, HEAT} passes the hold-out read (TMt6, K3, stream id 6)."""
import json, math
import du
from flint import ctx, arb
O = du.build_objects()
nd = {'u0': -0.06964389020860917, 'h': 0.1518523779459632, 'g': 0.0, 'k': -0.11546771043556521, 'id': 6}
fam = 'TMt6'
ctx.prec = 512
ev = du.NodeEval(fam, nd, False)
ev.level = {o.name: 2 for o in O}
ev.maxlev = 2
items = [ev.V(o) + (o.grp, o.name) for o in O]
rz = items[0][0] / items[0][1]
rel = lambda it: float(((it[0] / it[1] - rz) / rz).mid())
out = dict(node=nd, family=fam, read='K3', points=sorted(round(x, 4) for x in du.node_points_float(fam, nd)))
out['r_zeta'] = rz.str(30)
out['V2_sign'] = {g: sorted(set(int(it[1] > 0) - int(it[1] < 0) for it in items if it[2] == g)) for g in ('P', 'PH', 'T', 'hT', 'E', 'hE', 'H', 'hH')}
for g in ('P', 'PH', 'T', 'hT', 'E', 'hE', 'H', 'hH'):
    v = sorted(rel(it) for it in items if it[2] == g and it[3] != 'ZETA')
    out['rel_' + g] = dict(n=len(v), min=v[0], max=v[-1], n_neg=sum(1 for x in v if x < 0), n_pos=sum(1 for x in v if x > 0),
                           smallest_abs=min(abs(x) for x in v))
# scan: certified hold-out intervals of the tier TH
pos = []
ivs = du.scan_core(du.ball_objs(items), True, pos)
segs = []
for i, cnt in enumerate(ivs):
    for s in (1, -1):
        if du.train_state(cnt, du.TIERS['TH'], s) == 2 and du.hold_state(cnt, du.TIERS['TH'], s) == 2:
            lo = None if i == 0 else float(((pos[i - 1] - rz) / rz).mid())
            hi = None if i == len(pos) else float(((pos[i] - rz) / rz).mid())
            segs.append(dict(rel_lo=lo, rel_hi=hi, s=s, counts={g: cnt[g] for g in cnt}))
out['certified_TH_hold_segments'] = segs
# tau* at the midpoint of the widest certified segment: root of r_tau = lam (C4)
def r_tau(tau):
    pts = du.node_points(fam, nd)
    z = [du.ballk.BZ.jets(u, 0, False)[0] * (arb(tau) * u * u / 4).exp() for u in pts]
    d, pr = du.minor_V(z, 6)
    return d / pr
if segs:
    sg = max(segs, key=lambda x: abs((x['rel_hi'] or 0) - (x['rel_lo'] or 0)))
    lam_rel = ((sg['rel_lo'] or 0) + (sg['rel_hi'] or 0)) / 2
    lam = rz * (1 + arb(lam_rel))
    f = lambda t: r_tau(t) - lam
    s0 = f(0.0) > 0
    a, b = 0.0, None
    for k in range(60, -1, -1):
        t = -0.005 * 2.0 ** -k
        if (f(t) > 0) != s0:
            b = t
            break
        a = t
    if b is not None:
        for _ in range(60):
            m = (a + b) / 2
            if (f(m) > 0) == s0:
                a = m
            else:
                b = m
    out['single_threshold'] = dict(rel_margin_of_zeta=lam_rel, tau_star=None if b is None else abs(b))
    out['d_log_r_d_tau_at_0'] = float((((r_tau(-1e-6) / rz).log()) / arb(-1e-6)).mid())
json.dump(out, open('node6_TH.json', 'w'), indent=1)
print(json.dumps(out, indent=1)[:3500])
