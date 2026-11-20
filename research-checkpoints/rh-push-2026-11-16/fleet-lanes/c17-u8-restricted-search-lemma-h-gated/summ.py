"""merge out/*.json into summary.json and a markdown table; tau*(F) for every T-train node of a K3 read."""
import sys, os, json, glob, math
from flint import arb, ctx
import du

out = sys.argv[1] if len(sys.argv) > 1 else 'out'
FAMS = ['TM5', 'TM6', 'DM5', 'DM6', 'TMt5', 'TMt6', 'DMt5', 'DMt6', 'T3', 'T6']


def r_tau(fam, node, tau):
    """breakpoint V1/V2 of the HEAT member tau from zeta's K3 values (corollary C4)."""
    pts = du.node_points(fam, node)
    z = [du.ballk.BZ.jets(u, 0, False)[0] * (arb(tau) * u * u / 4).exp() for u in pts]
    kind, m, thr = du.fam_info(fam)
    if kind in ('TM', 'DM'):
        d, pr = du.minor_V(z, m)
        return d / pr
    M1, M2, M0 = du.turan_M(z)
    return (M1 + arb(node['srho']) * arb(node['Lr']).exp() * M2) / M0


def tau_star(fam, node, lam):
    """root of r_tau = lam nearest 0 on tau < 0, searched on tau = -0.005 * 2^-k then bisected; None if no sign change
    on [-0.005, -0.005 * 2^-40]."""
    ctx.prec = 512
    f = lambda t: r_tau(fam, node, t) - lam
    s0 = f(0.0)
    taus = [-0.005 * 2.0 ** -k for k in range(40, -1, -1)]
    prev = 0.0
    for t in taus:
        v = f(t)
        if (v > 0) != (s0 > 0):
            a, b = prev, t
            for _ in range(60):
                mid = (a + b) / 2
                if (f(mid) > 0) == (s0 > 0):
                    a = mid
                else:
                    b = mid
            return abs((a + b) / 2)
        prev = t
    return None


S = {}
rows = []
RES = json.load(open(os.path.join(out, 'resolved.json'))) if os.path.exists(os.path.join(out, 'resolved.json')) else {}
for fam in FAMS:
    for pol in (0, 1):
        pass
        fs = sorted(glob.glob(os.path.join(out, '%s_%s.json' % (fam, 'pol' if pol else 'k3'))) +
                    glob.glob(os.path.join(out, '%s_%s_from*.json' % (fam, 'pol' if pol else 'k3'))),
                    key=lambda x: json.load(open(x)).get('start', 0))
        if not fs:
            continue
        d = None
        for f in fs:
            x = json.load(open(f))
            x['n_und_search'] = sum(1 for r in x['recs'] if r['res']['status'] == 'undecided')
            for rr in RES.get(os.path.basename(f), []):
                for r in x['recs']:
                    if r['node'] == rr['node'] and r['res']['status'] == 'undecided':
                        r['res'] = rr['res']
                        r['resolved'] = 1
            if d is None:
                d = x
                d['pieces'] = [[x.get('start', 0), x['done'], x['cut'], round(x['sec'])]]
                continue
            assert x.get('start', 0) == d['pieces'][-1][0] + d['pieces'][-1][1], ('gap in stream', f)
            for k, v in x['cnt'].items():
                d['cnt'][k] = d['cnt'].get(k, 0) + v
            d['recs'] += x['recs']
            d['n_und_search'] += x['n_und_search']
            d['pieces'].append([x.get('start', 0), x['done'], x['cut'], round(x['sec'])])
            d['done'] += x['done']
            d['sec'] += x['sec']
            d['cut'] = x['cut']
        c = d['cnt']
        key = '%s_%s' % (fam, 'pol' if pol else 'k3')
        kind = du.fam_info(fam)[0]
        e = dict(planned=d['planned'], done=d['done'], cut=d['cut'], sec=round(d['sec']), cnt=c, pieces=d['pieces'])
        tt = [r for r in d['recs'] if r['res']['status'] == 'ttrain']
        und = [r for r in d['recs'] if r['res']['status'] == 'undecided']
        hold = [r for r in d['recs'] if r['res']['hold'].get('full') == 1]
        e['ttrain'] = len(tt)
        e['undecided'] = len(und)
        e['undecided_in_search_runs'] = d['n_und_search']
        e['hold'] = len(hold)
        e['nodes'] = c.get('n', 0)
        e['excluded'] = e['nodes'] - len(tt) - len(und)
        e['hold_nodes'] = [r['node'] for r in hold]
        e['und_nodes'] = [r['node'] for r in und][:50]
        e['loco_hold'] = {k: sum(1 for r in d['recs'] if r['res']['hold'].get(k) == 1) for k in du.TIERS}
        e['loco_ttrain_rec'] = {k: sum(1 for r in d['recs'] if r['res']['tiers'].get(k) == 1) for k in du.TIERS}
        e['best'] = {k: max([r['res'].get('best', {}).get(k, 0) for r in d['recs']] + [0]) for k in du.TIERS}
        # tau* for K3 T-train nodes of threshold families
        ts = []
        inwin = 0
        if not pol:
            for r in tt[:400]:
                res = r['res']
                if 'segs' not in res or not res['segs']:
                    continue
                ctx.prec = 512
                lo, hi, sgn = res['segs'][0]
                rz = arb(res['rz'])
                rH = [arb(x) for x in res['rH']]
                wl = min([rz] + rH, key=lambda x: float(x.mid()) if abs(float(x.mid())) < 1e300 else 0)
                if lo is None or hi is None:
                    continue
                lam = (arb(lo) + arb(hi)) / 2
                # window test: both segment ends between min and max of {r_zeta, r_H}
                allr = [rz] + rH
                mn = allr[0]; mx = allr[0]
                for x in allr[1:]:
                    if x < mn: mn = x
                    if x > mx: mx = x
                if not (arb(lo) < mn) and not (arb(hi) > mx):
                    inwin += 1
                t = tau_star(fam, r['node'], lam)
                marg = abs(float(((lam - rz) / rz).mid()))
                ts.append(dict(id=r['node'].get('id'), srho=r['node'].get('srho'), tau_star=t, margin=marg))
        e['tau_star'] = ts[:400]
        e['in_heat_window'] = inwin
        S[key] = e
json.dump(S, open(os.path.join(out, 'summary.json'), 'w'), indent=1)
for k, e in S.items():
    c = e['cnt']
    print(k, 'nodes', e['nodes'], 'excl', e['excluded'], 'ttrain', e['ttrain'], 'hold', e['hold'], 'und', e['undecided'], 'cut', e['cut'], 'sec', e['sec'])
    print('    ', {kk: vv for kk, vv in sorted(c.items()) if vv})
    print('     loco hold', e['loco_hold'], 'loco ttrain (records)', e['loco_ttrain_rec'], 'best', e['best'])
    if e['tau_star']:
        tv = [x['tau_star'] for x in e['tau_star'] if x['tau_star'] is not None]
        print('     tau*: n', len(e['tau_star']), 'with root', len(tv), 'max', max(tv) if tv else None, 'in window', e['in_heat_window'], 'max margin', max(x['margin'] for x in e['tau_star']))
