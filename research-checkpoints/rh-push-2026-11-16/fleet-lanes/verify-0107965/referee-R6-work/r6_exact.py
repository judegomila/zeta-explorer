"""R6 referee: independent recomputation of the certificate arithmetic (own code; exact Fractions + mpmath 60 digits).
arg1 = inputs/workspace root. Not interval arithmetic for transcendental parts: margins are reported so that the
reader can compare them with 1e-50 working precision."""
import sys, json, math, itertools, time
from fractions import Fraction as F
from pathlib import Path
import mpmath as mp
import numpy as np
mp.mp.dps = 60
W = Path(sys.argv[1]); T0 = time.time()
K = 4096; N0 = 690988; UNIT = 1 << 128
def read(p): return json.loads(Path(p).read_text())
def mf(q): q = F(q); return mp.mpf(q.numerator) / q.denominator
root = W / 'attack/latest_lambda_reconstructed/workspace'
BASE = root / 'continuation_20261022b/deliverables/Lambda_Joint_Phases_and_Contact_Slab_Proof_Package_2026-10-22/recovered/package/Lambda_Continuation_Proof_Package_2026-10-22/recovered/base/continuation_package'
ANG = root / 'continuation_20261022b/deliverables/Lambda_Joint_Phases_and_Contact_Slab_Proof_Package_2026-10-22/global_source_progress/candidate'
HYB = root / 'continuation_20261022e/probe_optimisation'
hybrid = read(HYB / 'SHARED_HYBRID_PLAN.json')['rows']
sharp = read(W / 'attack/heat_source/SHARP_SOURCE_256.json')
weighted = read(W / 'strategy_round5/lambda_native_force/weights_v2/WEIGHTED_SOURCE.json')['records']
wcert = {r['row']: r for r in read(W / 'strategy_round5/lambda_native_force/weights_v2/WEIGHTED_CERTIFICATE.json')['rows']}
reports = {r['row']: r for r in read(W / 'corner_search/adversarial_joint_relation_source_receipt.json')['reports']}
raw = read(BASE / 'inputs/source_tree/unconditional_20261020/physical_check/SOURCE.json')['lanes']['B']
resources = read(BASE / 'inputs/source_tree/continuation_20261020/physical/COMPOSITE_SOURCE_EXACT_RECEIPT.json')['records']
angp = read(ANG / 'JOINT_ANGULAR_SOURCE_PRODUCER.json')
affine = read(BASE / 'candidate/JOINT_SOURCE_PRODUCER.json')['rows']
prop = {r['row']: r for r in read(W / 'lambda_round15/director/COMMON_CLOCK_MAIN_39_ROW_SOURCE_PROPOSAL_V2.json')['rows']}
eighth = read(W / 'lambda_round15/new_relations/EIGHT_RELATION_ROW8_SOURCE_PROPOSAL_V1.json')
final = read(W / 'lambda_round15/flow_main_v2/MAIN_CLOCK_SOURCE.json')['records']
m8 = read(W / 'lambda_round14/material/m8_late/M8_LATE_SOURCE.json')['records']
m8plan = read(W / 'lambda_round14/material/m8_late/M8_LATE_PLAN.json')['rows']
bad = []
def need(ok, msg):
    if not ok: bad.append(msg); print('  *** FAIL', msg, flush=True)
mlog = [mp.mpf(0), mp.mpf(0)] + [mp.log(n) for n in range(2, K + 1)]
divs = [[] for _ in range(K + 1)]
for d in range(2, K + 1):
    for n in range(2 * d, K + 1, d): divs[n].append(d)
_dc = {}
def dco(t):
    t = F(t)
    if t not in _dc:
        tt = mf(t); b = [mp.mpf(0), mp.mpf(1)] + [mp.exp(tt * mlog[n] ** 2 / 4) for n in range(2, K + 1)]
        d = [mp.mpf(0)] * (K + 1)
        for n in range(2, K + 1): d[n] = mlog[n] * b[n] - mp.fsum(d[r] * b[n // r] for r in divs[n])
        _dc[t] = d
    return _dc[t]
def fac(n):
    o = {}; v = n; p = 2
    while p * p <= v:
        while v % p == 0: o[p] = o.get(p, 0) + 1; v //= p
        p += 1
    if v > 1: o[v] = o.get(v, 0) + 1
    return o
c0 = mp.log(N0) / 2; pi = mp.pi
shape_seen = {}
def shape_grid_min(a, b, c):
    g = np.linspace(-np.pi, np.pi, 721); A_, B_ = np.meshgrid(g, g)
    return float((a * (1 - np.cos(A_)) + b * (1 - np.cos(B_)) + c * (1 + np.cos(A_ + B_))).min())
summary = {'shared': [], 'retained': []}
for i in range(67):
    spec = hybrid[i]; tl, th = map(F, spec['time'])
    nodes = [(F(v['height']), F(v['shift']), F(v['weight'])) for v in spec['nodes']]
    mass = sum(w for _, _, w in nodes)
    def filt(n): return mp.fsum(mf(w) * mp.exp(-mf(h) * mlog[n] / 2) * mp.cos(mf(v) * mlog[n] / 2) for h, v, w in nodes)
    if spec['mode'] != 'retained':
        row = sharp['records'][i]; table = read(W / 'attack/heat_source' / row['fixed_table_file'])
        pack = read(root / 'continuation_20261022f/multiplicative_budget' / table['base_table_file'])
        lower = [0, 0] + [int(v) for v in table['lower_caps']]; signs = [0, 0] + pack['signs']
        cap0 = [0, 0] + [int(v) for v in pack['caps_first']]; cap1 = [0, 0] + [int(v) for v in pack['caps_last']]
        dl, dh = dco(tl), dco(th)
        # capacities (own formulas, 60 digits)
        minrel = mp.inf; sumlogU = mp.mpf(0)
        for n in range(2, K + 1):
            f = filt(n); need((f > 0) == (signs[n] == 1) and f != 0, f'row {i} sign n={n}')
            com = abs(f) * mp.exp(-mlog[n] / 2) / 2
            lo = dl[n] * mp.exp(-mf(th) * c0 * mlog[n]) * com
            u0 = dh[n] * mp.exp(-mf(tl) * c0 * mlog[n]) * com; u1 = dh[n] * mp.exp(-mf(th) * c0 * mlog[n]) * com
            need(mp.mpf(lower[n]) / UNIT <= lo and mp.mpf(cap0[n]) / UNIT >= u0 and mp.mpf(cap1[n]) / UNIT >= u1, f'row {i} cap n={n}')
            sumlogU += mlog[n] * mp.mpf(cap0[n]) / UNIT
        mu = mf(mass) - mf(th) * sumlogU
        need(mu >= mf(row['coordinate_derivative_margin']) > 0, f'row {i} mu')   # stored margin uses rounded-up logs, so stored <= true
        # allocation
        shapes = [tuple(map(F, s)) for s in table['shapes']]; rep = set(table.get('repeat_only_shapes', []))
        for j, (a, b, c, p) in enumerate(shapes):
            key = (a, b, c)
            if key not in shape_seen: shape_seen[key] = shape_grid_min(float(a), float(b), float(c))
            need(float(p) <= shape_seen[key] * (1 + 1e-9) + 1e-12, f'row {i} shape {j} p exceeds grid minimum {float(p)} > {shape_seen[key]}')
        used = [0] * (K + 1); credit = 0
        for m_, n_, k_, j, g in table['allocation']:
            g = int(g); a, b, c, p = shapes[j]
            need(2 <= m_ <= n_ and k_ == m_ * n_ <= K and g > 0 and signs[m_] * signs[n_] * signs[k_] == -1, f'row {i} edge')
            used[m_] += int(a) * g; used[n_] += int(b) * g; used[k_] += int(c) * g; credit += int(p) * g
        need(all(0 <= used[n] <= lower[n] for n in range(K + 1)), f'row {i} capacity overspent')
        fixed = F(credit, UNIT); need(fixed == F(row['fixed_phase_credit']), f'row {i} fixed credit')
        need(table['use_fixed'] is True, f'row {i} not fixed branch')
        # relations
        rp = reports[i]; cert = wcert[i]; rank = rp['rank']; scales = [F(s) for s in rp['rational_relation_scales']]
        wts = [F(v) for v in cert['relation_weights']]; vecs = []; rhos = []; support = set(); minphase = mp.inf
        for rel in rp['relations']:
            vec = dict((p, k) for p, k in rel['pairs']); num = den = 1; gauge = 1
            for p, k in vec.items():
                need(fac(p) == {p: 1} and k != 0, 'prime')
                if k % 2: gauge *= signs[p]
                if k > 0: num *= p ** k
                else: den *= p ** (-k)
            need(gauge == 1 and num > den and str(num) == rel['ratio_numerator'] and str(den) == rel['ratio_denominator'], f'row {i} relation product/gauge')
            lg = mp.log(mp.mpf(num) / den)
            ph0 = (mp.mpf(6) * 10 ** 12 / 2 + pi * mf(tl) / 8) * lg; ph1 = (mp.mpf(66) * 10 ** 11 / 2 + pi * mf(th) / 8) * lg
            need(0 < ph0 < ph1 < 2 * pi, f'row {i} phase interval leaves (0,2pi)')
            dist = min(ph0, 2 * pi - ph1); dp = F(rel['angle_distance_paid'])
            need(0 < mf(dp) <= dist, f'row {i} paid angle distance'); minrel = min(minrel, dist - mf(dp))
            vecs.append(vec); rhos.append(dp); support.update(vec)
        res_ = {p: F(lower[p] - used[p], UNIT) for p in support}
        need(all(v > 0 for v in res_.values()), f'row {i} reserve')
        # own spectral check of V^T W V <= I  (same nonzero spectrum as W^1/2 G W^1/2), 60 digits
        G = mp.matrix(rank, rank)
        for a in range(rank):
            for b in range(rank):
                G[a, b] = mf(sum(scales[a] * vecs[a].get(p, 0) * scales[b] * vecs[b].get(p, 0) / res_[p] for p in support)) * mp.sqrt(mf(wts[a]) * mf(wts[b]))
        ev = mp.eigsy(G, eigvals_only=True); lam = max(ev)
        need(lam <= 1, f'row {i} Gram spectral bound {lam}')
        energy = sum(wts[j] * (scales[j] * rhos[j]) ** 2 for j in range(rank)); amin = min(res_.values())
        u = min(energy / amin, F(6)); poly = u / 2 - u ** 2 / 24 + u ** 3 / 720 - u ** 4 / 40320
        near = amin * poly; neartrue = mf(amin) * (1 - mp.cos(mp.sqrt(mf(u))))
        far = mu * ((1 - 4 * pi * N0 ** 2 / (mp.mpf(66) * 10 ** 11)) / 4 - mp.mpf(1) / 5000000)
        paid = F(cert['paid_credit']); coord = F(row['coordinate_derivative_margin']) / 5000000
        need(0 < paid <= near and mf(paid) <= far and mf(near) <= neartrue, f'row {i} orbit credit')
        s0 = F(sum(cap0), UNIT); s1 = F(sum(cap1), UNIT)
        need(F(weighted[i]['first_hi']) == s0 - fixed - coord - paid and F(weighted[i]['last_hi']) == s1 - fixed - coord - paid, f'row {i} head fields')
        alpha = F(m8plan[i].get('joint_jet_overlay', {}).get('alpha', '1'))
        summary['shared'].append((i, float(fixed), float(coord), float(paid), float(near), float(far), float(lam), float(u), float(minrel)))
        print(f'S {i}: fixed {float(fixed):.6f} coord {float(coord):.3e} paid {float(paid):.6f} <= near {float(near):.6f}, far {float(far):.6f}; max eig V^TWV {mp.nstr(lam, 12)}; u={float(u):.4f}; rank {rank}; min phase slack {mp.nstr(minrel, 3)}', flush=True)
    else:
        r = angp['records'][i]; rs = resources[i]; plist = angp['prime_list']
        dl = dco(tl); gau = {p: int(rs['prime_gauge'][str(p)]) for p in plist}
        def low27(n): return dl[n] * mp.exp(-(mp.mpf(1) / 2 + mf(th) * 27 / 4) * mlog[n]) / 2
        caps = {}
        for rec in rs['prime_resources']:
            p = rec['prime']; f = filt(p); need(f * gau[p] > 0, f'row {i} gauge p={p}')
            caps[p] = F(rec['capacity_lower']); need(0 < mf(caps[p]) <= low27(p) * abs(f), f'row {i} prime cap {p}')
        spent = {p: F(0) for p in plist}; tot = F(0); seen = set()
        for rec in rs['allocations']:
            n = int(rec['n']); fs = fac(n); need(n not in seen and all(p in gau for p in fs), f'row {i} alloc n'); seen.add(n)
            Om = sum(fs.values()); g = math.prod(gau[p] ** e for p, e in fs.items()); f = filt(n)
            rr = F(rec['recovered_coefficient'])
            need(Om >= 2 and g * f < 0 and 0 < mf(rr) <= low27(n) * abs(f), f'row {i} composite {n}')
            for p, e in fs.items(): spent[p] += rr * Om * e
            tot += 2 * rr
        cc = F(rs['accepted_credit']); need(0 < cc <= tot, f'row {i} composite credit')
        alpha = {}
        for p in plist:
            alpha[p] = F(r['capacity_floors'][str(p)]); need(0 < alpha[p] <= caps[p] - spent[p], f'row {i} floor p={p}')
        beta = F(affine[i]['beta']); A = (1 - beta) * mass
        gain = F(29, 10000) if i == 8 else F(prop[i]['old_source_gain']); target = F(r['credit']) + gain
        omega = 4 * target / A; V = omega / (1 - omega); need(0 < omega < F(1, 10) and 2 * mp.log(N0) + mp.log(1 + mf(V)) < 27, f'row {i} near width')
        rels = [angp['relation_catalogue'][rid] for rid in r['relations']] + ([eighth['new_relation']] if i == 8 else [])
        aj = []; hj = []
        for rel in rels:
            ex = rel['exponents']; num = math.prod(p ** e for p, e in zip(plist, ex) if e > 0); den = math.prod(p ** (-e) for p, e in zip(plist, ex) if e < 0)
            need(str(num) == str(rel['numerator']) and str(den) == str(rel['denominator']) and num > den, f'row {i} relation product')
            par = math.prod(gau[p] for p, e in zip(plist, ex) if e % 2); h = int(rel['target'])
            need(par * (-1) ** h == -1, f'row {i} parity'); aj.append(2 * N0 ** 2 * mp.log(mp.mpf(num) / den)); hj.append(h)
        ql, qh = mf(tl) / (16 * N0 ** 2), mf(th) / (16 * N0 ** 2); corners = [(mp.mpf(0), ql), (mp.mpf(0), qh), (mf(V), ql), (mf(V), qh)]
        dmax = max(abs(a * (1 + v + q) - h) for a, h in zip(aj, hj) for v, q in corners); need(dmax < 1, f'row {i} alias {dmax}')
        # multipliers
        if i == 8:
            cands = [([c['flip'] * s for s in r['patterns'][c['pattern']]['signs']] + [c['new_sigma']], [F(l) for l in c['lambdas']]) for c in eighth['patterns']]
        else:
            cands = [([fl * s for s in p['signs']], [F(l) for l in p['lambdas']]) for p in r['patterns'] for fl in (-1, 1)]
        need({tuple(c[0]) for c in cands} == set(itertools.product((-1, 1), repeat=len(rels))) and len(cands) == 2 ** len(rels), f'row {i} branches')
        def Cstar(al, b):
            al = mf(al); b = abs(mf(b)); v = [pi * b - 2 * al]
            if b < al: w = b / al; v.append(al * (w * mp.asin(w) + mp.sqrt(1 - w * w) - 1))
            return max(v)
        mmin = mp.inf; interior_min = mp.inf; umax = 0
        for sig, lam in cands:
            need(min(lam) >= 0, 'lambda sign')
            bp = [sum(l * s * rel['exponents'][k] for l, s, rel in zip(lam, sig, rels)) for k in range(len(plist))]
            sup = mp.fsum(Cstar(alpha[p], b) for p, b in zip(plist, bp)); umax = max(umax, max(abs(float(b / alpha[p])) for p, b in zip(plist, bp)))
            def Fv(v, q): return pi * mp.fsum(mf(l) * (1 + s * (a * (1 + v + q) - h)) for l, s, a, h in zip(lam, sig, aj, hj)) - sup + mf(A) / 4 * mp.log(1 + v)
            cm = min(Fv(v, q) for v, q in corners) - mf(target); mmin = min(mmin, cm)
            if sig[0] == 1 and sum(sig) in (len(sig), len(sig) - 2, 2 - len(sig)):      # concavity spot check on a 6x3 interior grid
                for a_ in range(1, 6):
                    for b_ in range(3):
                        interior_min = min(interior_min, Fv(mf(V) * a_ / 6, ql + (qh - ql) * b_ / 2) - mf(target) - cm)
        need(mmin > 0, f'row {i} corner margin {mmin}'); need(interior_min >= -mp.mpf(10) ** -40, f'row {i} interior below corners')
        need(F(raw[i]['first_hi']) - cc - target == F(m8[i]['first_hi']) - (0 if i not in (0, 16) else 0) - gain if i not in (0, 16) else True, f'row {i} head identity')
        if i not in (0, 16):
            need(F(final[i]['first_hi']) == F(raw[i]['first_hi']) - cc - target and F(final[i]['last_hi']) == F(raw[i]['last_hi']) - cc - target, f'row {i} final scalar head = raw - C_comp - d')
        summary['retained'].append((i, float(cc), float(target), float(A), float(omega), float(mmin), float(dmax), umax))
        print(f'R {i}: C_comp {float(cc):.6f} (allocated {float(tot):.6f}, {len(seen)} composites) d {float(target):.6f} A {float(A):.5f} omega {float(omega):.5f} max|delta| {mp.nstr(dmax, 6)} min corner margin {mp.nstr(mmin, 6)} interior-corners>= {mp.nstr(interior_min, 3)} max|b|/alpha {umax:.3f} branches {len(cands)}', flush=True)
print('distinct shapes checked on grid:', len(shape_seen))
print('FAILURES', len(bad), bad[:10]); print('seconds', round(time.time() - T0))
