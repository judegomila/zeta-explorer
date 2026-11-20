"""PREREGISTRATION section 9: controls on the pipeline.  Uses the dev node stream and synthetic sets only."""
import sys, json, math, time
import numpy as np
from flint import arb, acb, ctx
import du, kern, ballk

out = {}
t0 = time.time()
# ---- 1a planted separator, sign minors
OP = du.build_planted('minor')
res = {}
for fam in ('TM5', 'TM6', 'DM5', 'DM6'):
    nodes = du.draw_nodes(fam, True, 25, dev=True)          # window 3
    R = [du.decide(fam, n, False, OP, loco=True) for n in nodes]
    res[fam] = dict(n=len(R), ttrain=sum(r['status'] == 'ttrain' for r in R), hold=sum(r['hold']['full'] == 1 for r in R),
                    undecided=sum(r['status'] == 'undecided' for r in R), prec=sorted(set(r['prec'] for r in R)))
out['planted_minor'] = res
print('planted minor', res, flush=True)
# thresholded minors on the planted set: T-train must be found as well (threshold 0 lies in a passing segment)
res = {}
for fam in ('TMt5', 'DMt6'):
    nodes = du.draw_nodes(fam, True, 10, dev=True)
    R = [du.decide(fam, n, False, OP, need=tuple(du.TIERS), lazy=False) for n in nodes]
    res[fam] = dict(n=len(R), ttrain=sum(r['status'] == 'ttrain' for r in R), hold=sum(r['hold']['full'] == 1 for r in R),
                    undecided=sum(r['status'] == 'undecided' for r in R))
out['planted_minor_thr'] = res
print('planted minor thr', res, flush=True)
# ---- 1b planted separator, T3 / T6
OT = du.build_planted('turan')
r = np.random.Generator(np.random.PCG64(175001))
res = {}
for fam in ('T3', 'T6'):
    tot = {}
    nrec = 0
    for j in range(40):
        nd = dict(u=float(r.uniform(-0.05, 0.05)), h=float(r.uniform(0.05, 0.3)), id='pl%s%d' % (fam, j))
        du.VALCACHE.clear()
        c, recs = du.turan_node(fam, nd, False, OT)
        for k, v in c.items():
            tot[k] = tot.get(k, 0) + v
        # restrict the claim to abs(rho) <= 1e-2
        nrec += sum(1 for x in recs if abs(x['node']['srho']) <= 1e-2 and x['res']['hold']['full'] == 1)
    res[fam] = dict(cnt=tot, hold_small_rho=nrec)
out['planted_turan'] = res
print('planted turan', res, flush=True)
# ---- 2 zeta positive rows
O = du.build_objects()
Z = O[0]
r = np.random.Generator(np.random.PCG64(175002))
ok = und = 0
okf = 0
for j in range(2000):
    while True:
        u = float(r.uniform(-4, 4)); h = float(r.uniform(0.02, 2))
        if abs(u) + h <= 4:
            break
    for pr in du.LADDER:
        ctx.prec = pr
        a, b, c = Z.vals([arb(u), arb(u) - arb(h), arb(u) + arb(h)], False)
        d = a * a - b * c
        if d > 0:
            ok += 1
            break
        if d < 0:
            break
    else:
        und += 1
    ctx.prec = 128
    la, lb, lc = [du.ball_log_phase(x)[0] for x in Z.vals([arb(u), arb(u) - arb(h), arb(u) + arb(h)], False)]
    okf += int(2 * la > lb + lc)
out['zeta_logconcave'] = dict(n=2000, ball_positive=ok, undecided=und, float_positive=okf)
print('zeta log-concavity', out['zeta_logconcave'], flush=True)
res = {}
for m in (2, 3):
    good = bad = und = 0
    for j in range(500):
        while True:
            u0 = float(r.uniform(-4, 4)); h = float(r.uniform(0.05, 1.2)); g = float(r.uniform(-0.1, 0.1))
            k = float(r.uniform(0.05, 1.2)) * (1 if r.random() < 0.5 else -1)
            xs = [u0 + i * h + i * i * g for i in range(m)]
            pts = [x + jj * k for x in xs for jj in range(m)]
            if max(abs(p) for p in pts) <= 4 and all(xs[i + 1] > xs[i] + 1e-3 for i in range(m - 1)):
                break
        exp_sign = (-1) ** (m * (m - 1) // 2) if k > 0 else 1
        s = 0
        for pr in du.LADDER:
            ctx.prec = pr
            x = [arb(u0) + i * arb(h) + i * i * arb(g) for i in range(m)]
            v = Z.vals([xx + jj * arb(k) for xx in x for jj in range(m)], False)
            d, _ = du.minor_V(v, m)
            if d > 0:
                s = 1; break
            if d < 0:
                s = -1; break
        good += int(s == exp_sign); bad += int(s == -exp_sign); und += int(s == 0)
    res[m] = dict(n=500, expected_sign=good, opposite=bad, undecided=und)
out['zeta_minor_rows'] = res
print('zeta minors', res, flush=True)
# (iii) P = {zeta}: one-signed at every node
OZ = [o for o in O if not (o.grp == 'P' and o.kind == 'chi')]
nodes = du.draw_nodes('TM5', False, 20, dev=True)
R = [du.decide('TM5', n, False, OZ, loco=True) for n in nodes]
out['P_zeta_only'] = dict(n=20, onesigned=sum(1 for x in R if x.get('onesigned')), status=[x['status'] for x in R])
print('P = {zeta}', out['P_zeta_only'], flush=True)
# ---- 3 float64 scan against ball scan (T3, T6; both reads), dev nodes
res = {}
for fam in ('T3', 'T6'):
    for pol in (False, True):
        nodes = du.draw_nodes(fam, pol, 40, dev=True)
        agree = dis = fund = und = 0
        tr = [o for o in O if o.grp in du.TRAIN]
        gt = [o.grp for o in tr]
        wt = [(o.kind == 'heat' and pol) or o.kind == 'ea' for o in tr]
        for nd in nodes:
            du.VALCACHE.clear()
            ctx.prec = 128
            L, C = du.turan_logs(fam, nd, pol, tr)
            for srho in du.RHO[::3]:
                ivs = du.scan_core(du.float_objs(*du.float_items(L, C, srho), gt, wt), False)
                tf = {k: du.tier_status(ivs, cl) for k, cl in du.TIERS.items()}
                n2 = dict(nd, srho=srho, Lr=float(L[0, 0] - L[0, 1]))
                dec = [k for k in du.TIERS if tf[k] != -1]
                fund += len(du.TIERS) - len(dec)
                if not dec:
                    continue
                rb = du.decide(fam, n2, pol, O, need=tuple(dec), lazy=False)
                if rb['status'] == 'undecided':
                    und += 1
                    continue
                for k in dec:
                    ok = tf[k] == rb['tiers'][k]
                    agree += int(ok); dis += int(not ok)
        res['%s_%s' % (fam, 'pol' if pol else 'k3')] = dict(agree=agree, disagree=dis, float_undecided_tiers=fund, ball_undecided=und)
        print('float vs ball', fam, pol, res['%s_%s' % (fam, 'pol' if pol else 'k3')], flush=True)
out['float_vs_ball'] = res
# HEAT Kpol: float64 quadrature against balls
ctx.prec = 128
mx = 0.0
rr = np.random.Generator(np.random.PCG64(175004))
for o in [x for x in O if x.kind == 'heat'][:6]:
    us = [float(x) for x in rr.uniform(-3, 3, 6)]
    fb = o.vals([arb(u) for u in us], True)
    ff = o.heat_float(us)
    mx = max(mx, max(abs(float(b.mid()) / f - 1) for b, f in zip(fb, ff)))
out['heat_pol_float_vs_ball_maxrel'] = mx
print('HEAT Kpol float vs ball, max relative difference', mx, flush=True)
# E_a: float64 kernel against balls
mxe = {False: 0.0, True: 0.0}
sg_bad = 0
for o in [x for x in O if x.kind == 'ea'][:8]:
    for pol in (False, True):
        us = [float(x) for x in rr.uniform(-du.WIN[pol], du.WIN[pol], 150)]
        la, sg = o.ea_float(us, pol)
        fb = o.vals([arb(u) for u in us], pol)
        for b, l, s_ in zip(fb, la, sg):
            lb = float(abs(b.mid()).log())
            mxe[pol] = max(mxe[pol], abs(lb - l))
            sg_bad += int((b.mid() > 0) != (s_ > 0))
out['ea_float_vs_ball_max_abs_log_diff'] = dict(k3=mxe[False], pol=mxe[True], sign_mismatch=sg_bad)
print('E_a float vs ball', out['ea_float_vs_ball_max_abs_log_diff'], flush=True)
# ---- 4 Lemma H as a tie (K3 read): monomial on a HEAT member built by ballk.BHeat.f_jets (series product) against
# exp(tau S/4) times zeta's monomial
r = np.random.Generator(np.random.PCG64(175003))
ties = 0
maxrel = 0.0
ctx.prec = 256
for j in range(200):
    tau = -10 ** float(r.uniform(-4, math.log10(0.005)))
    k = int(r.integers(3, 6))
    us = [float(x) for x in r.uniform(-3.5, 3.5, k)]
    es = [int(x) for x in r.choice([-2, -1, 1, 2], k)]
    bh = ballk.BHeat(kern.Heat(tau, 'h'))
    Mh = arb(1); Mz = arb(1); S = arb(0)
    for u, e in zip(us, es):
        Mh *= bh.f_jets(arb(u), 0)[0] ** e
        Mz *= ballk.BZ.jets(arb(u), 0, False)[0] ** e
        S += e * arb(u) * arb(u)
    d = Mh - (arb(tau) * S / 4).exp() * Mz
    ties += int(d.contains(0))
    maxrel = max(maxrel, float((d.rad() / abs(Mh.mid())).upper()))
out['lemmaH_tie'] = dict(n=200, contain0=ties, max_rel_radius=maxrel)
print('Lemma H tie', out['lemmaH_tie'], flush=True)
out['sec'] = time.time() - t0
json.dump(out, open(sys.argv[1] if len(sys.argv) > 1 else 'tests.json', 'w'), indent=1)
print('tests done', out['sec'])
