"""R5: own exact recomputation (Fractions; mpmath for exp) of caps (124), near/far affine inequality (70),
refund factor kappa (C.4), refund (126) and its validity on both affine branches. Packet JSON read as data."""
import sys, json
from fractions import Fraction as F
from mpmath import mp, mpf, exp
mp.dps = 60
I = sys.argv[1]
ld = lambda p: json.load(open(p if p.startswith(I) else p.replace('/workspace', I, 1)))
cp = ld(I + '/lambda_round13/flow/PHYSICAL_REFINEMENT_CERTIFICATE.json')
PHc = cp['inputs']
nat = ld(PHc['native_primitives']['path'])['blocks']; act = ld(PHc['activation']['path'])['blocks']
old = ld(PHc['old_plan']['path'])['blocks']; orig = ld(PHc['parent_source']['path'])['records']
aff = ld(PHc['affine_receipt']['path'])['rows']
final_plan = ld(I + '/lambda_round14/material/m8_late/M8_LATE_PLAN.json')['rows']
hyb = ld(I + '/attack/latest_lambda_reconstructed/workspace/continuation_20261022e/probe_optimisation/SHARED_HYBRID_PLAN.json')['rows']
refined = ld(I + '/lambda_round13/flow/PHYSICAL_REFINED_SOURCE.json')['records']
import os
envdir = os.path.dirname(PHc['old_plan']['path'].replace('/workspace', I, 1)) + '/envelopes/'
e0 = F(1, 2000000); e1 = F(1, 20000); fix = F(2, 10 ** 12); DEL = F(1, 10 ** 12); VP = F(6723, 500); cs = F(2689, 400)
def cap(n, aa, dd, kap=F(1)):
    A, B, P, P1, DU, DM, Z, T = (F(n[k]) for k in ('prefix_A_upper', 'prefix_B_upper', 'Euler_norm_upper', 'Euler_log_moment_upper', 'D_upper', 'D_match_lower', 'overlap_Z_match_lower', 'Euler_tail_upper'))
    a = P * aa; b = 2 * P * dd + P1 * aa; g = 1 - A - a; r0 = kap * e0 * P; r1 = kap * (e1 * P + e0 * P1 / 2)
    R = B - (1 - A) * DM - 2 * Z
    assert R >= 0 and g > e0 * P > 0 and A < 1
    return (R + b + a * DU) / (2 * g) + T / 2, r1 / (g - r0) + (B + b) * r0 / (2 * g * (g - r0)), g
stats = dict(rows=0, heights=0, minR=None, min_gap=None, kappa_max=F(0), kappa_min=F(1), plan_mismatch=[], near_fail=[], far_fail=[], refund_mismatch=[], dom_fail=[], E_fail=[], guard_fail=[], slack_min=None, node_height_not_native=[])
mn = lambda a, b: b if a is None else min(a, b)
for i in range(67):
    blk = old[i]; sc = F(blk['scale']); tl = F(blk['t_lo']); tr = F(blk['t_hi'])
    nr = {F(x['height']): x for x in nat[i]['height_records']}; ar = {F(x['height']): x for x in act[i]['heights']}
    hs = [sc * F(h) for h in ('2', '109/50', '5/2', '3', '4', '5', '6')]
    nodes_old = sorted((sc * F(p['height']), sc * F(p['height']) * F(p['r']), F(p['weight']) / sc) for p in blk['probes'])
    fp = final_plan[i]
    nodes_fin = sorted((F(n['height']), F(n['shift']), F(n['weight'])) for n in fp['nodes'])
    nodes_hyb = sorted((F(n['height']), F(n['shift']), F(n['weight'])) for n in hyb[i]['nodes'])
    mode = orig[i]['mode']
    if nodes_fin != nodes_hyb or (mode == 'retained' and nodes_fin != nodes_old) or F(fp['time'][0]) != tl or F(fp['time'][1]) != tr:
        stats['plan_mismatch'].append(i)
    nodes = nodes_fin
    if any(h not in nr for h, v, w in nodes): stats['node_height_not_native'].append(i)
    # kappa from (55), own evaluation, per node height
    kap = {}
    for hp in cp['rows'][i]['heights']:
        h = F(hp['height']); S = (1 + h - F(1, 100)) * cs + tl * cs * cs
        eS = exp(-(mpf(S.numerator) / S.denominator))
        E0 = 8 * eS + mpf(5) / 10 ** 10; E1 = 800 * eS + mpf(7) / 10 ** 9
        st0 = mpf(F(hp['new_E0_upper']).numerator) / F(hp['new_E0_upper']).denominator; st1 = mpf(F(hp['new_E1_upper']).numerator) / F(hp['new_E1_upper']).denominator
        if not (S == F(hp['S']) and st0 >= E0 and st1 >= E1): stats['E_fail'].append((i, str(h)))
        k = max(F(hp['new_E0_upper']) / e0, F(hp['new_E1_upper']) / e1)
        if not (0 < k <= 1 and k == F(hp['kappa'])): stats['E_fail'].append((i, str(h), 'kappa'))
        # row guard (52)
        if not ((1 + h - F(1, 100)) / 2 + tl * F(2689, 100) / 8 > F(5, 4) and h - F(1, 100) >= 0 and h + F(1, 100) <= F(601, 100)): stats['guard_fail'].append((i, str(h)))
        kap[h] = k; stats['kappa_max'] = max(stats['kappa_max'], k); stats['kappa_min'] = min(stats['kappa_min'], k)
    if set(kap) != set(h for h, v, w in nodes): stats['E_fail'].append((i, 'height set'))
    for h in hs:
        C = F(ar[h]['C_upper']); an0, ph0, g0 = cap(nr[h], 2 * C * DEL, C * (VP + 2 * DEL) * DEL); anG, phG, gG = cap(nr[h], F(ar[h]['Aact_upper']), F(ar[h]['Dact_upper']))
        if not (phG >= ph0 and anG >= an0 and F(ar[h]['Aact_upper']) >= 2 * C * DEL and F(ar[h]['Dact_upper']) >= C * (VP + 2 * DEL) * DEL): stats['dom_fail'].append((i, str(h)))
        stats['min_gap'] = mn(stats['min_gap'], gG - e0 * F(nr[h]['Euler_norm_upper'])); stats['heights'] += 1
        A, B, DM, Z = (F(nr[h][k]) for k in ('prefix_A_upper', 'prefix_B_upper', 'D_match_lower', 'overlap_Z_match_lower')); stats['minR'] = mn(stats['minR'], B - (1 - A) * DM - 2 * Z)
    dual = [F(x) for x in json.load(open(envdir + '%03d.json' % i))['dual']]
    def total(s, branch, kappa_on):
        vals = {}
        for h in hs:
            C = F(ar[h]['C_upper'])
            if s is None: aa, dd = F(ar[h]['Aact_upper']), F(ar[h]['Dact_upper'])
            else: u = s + DEL; aa, dd = 2 * C * u, C * (VP + 2 * u) * u
            vals[h] = cap(nr[h], aa, dd, kap.get(h, F(1)) if kappa_on else F(1))
        tri = sum(abs(w) * vals[h][0] for h, v, w in nodes); com = sum(c * vals[h][0] for c, h in zip(dual, hs))
        an = min(tri, com) if branch is None else com if branch == 'joint' else tri
        return an + sum(abs(w) * (vals[h][1] + fix) for h, v, w in nodes) + F(1, 10 ** 9), vals
    if mode == 'retained':
        r = aff[i]; R = F(r['near_split_s']); beta = F(r['beta']); mass = sum(w for h, v, w in nodes); slope = beta * mass / 2
        N0v, v0 = total(F(0), r['branch'], False); NR, vR = total(R, r['branch'], False); G, vG = total(None, None, False)
        if not (NR <= N0v + slope * R and min(x[2] for x in vR.values()) > 0): stats['near_fail'].append(i)
        if not (G <= N0v + slope * R): stats['far_fail'].append(i)
        refund = sum(abs(w) * (1 - kap[h]) * v0[h][1] for h, v, w in nodes)
        # refined debit (true kappa-scaled physical errors) at s=0, s=R (near) and global, against (N0 - refund) + slope*s
        N0k, _ = total(F(0), r['branch'], True); NRk, _ = total(R, r['branch'], True); Gk, _ = total(None, None, True)
        Nmid, _ = total(R / 2, r['branch'], False); Nmidk, _ = total(R / 2, r['branch'], True)
        ok = N0k <= N0v - refund and NRk <= N0v - refund + slope * R and Gk <= N0v - refund + slope * R and Nmidk <= N0v - refund + slope * R / 2 and Nmid <= (N0v + NR) / 2
        if not ok: stats['far_fail'].append((i, 'refunded'))
        stats['slack_min'] = mn(stats['slack_min'], min(N0v - refund + slope * R - Gk, N0v - refund + slope * R - NRk))
        if not (refund == F(cp['rows'][i]['refund']) and N0v == F(orig[i]['native_debit']) and N0v - refund == F(refined[i]['native_debit'])): stats['refund_mismatch'].append(i)
    else:
        G, vG = total(None, None, False)
        refund = sum(abs(w) * (1 - kap[h]) * vG[h][1] for h, v, w in nodes)
        Gk, _ = total(None, None, True)
        if not (Gk <= G - refund): stats['far_fail'].append((i, 'shared refunded'))
        if not (refund == F(cp['rows'][i]['refund']) and F(orig[i]['native_debit']) - refund == F(refined[i]['native_debit'])): stats['refund_mismatch'].append(i)
        stats.setdefault('shared_debit_vs_my_global', []).append((i, float(F(orig[i]['native_debit'])), float(G)))
    stats['rows'] += 1
for k, v in stats.items():
    if isinstance(v, F): v = float(v)
    print(k, ':', v)
