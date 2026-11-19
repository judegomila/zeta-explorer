#!/usr/bin/env python3
"""Own recomputation of the three joint-derivative (jet) source records, rows 0, 16, 44.
Reads raw JSON inputs only (path given as argv[1]); exact Fractions + mpmath (60 digits).
Not interval-rigorous: comparisons are reported with their slack."""
import json, sys, math
from fractions import Fraction as F
import mpmath as mp
mp.mp.dps = 60
I = sys.argv[1]
PARENT = ('attack/latest_lambda_reconstructed/workspace/continuation_20261022b/deliverables/'
          'Lambda_Joint_Phases_and_Contact_Slab_Proof_Package_2026-10-22')
BASE = PARENT + '/recovered/package/Lambda_Continuation_Proof_Package_2026-10-22/recovered/base/continuation_package'
PHYS = BASE + '/inputs/source_tree/unconditional_20261020/physical_check'
def L(p): return json.load(open(I + '/' + p))
def mpf(x): x = F(x); return mp.mpf(x.numerator) / x.denominator
native = L(PHYS + '/retained/THERMAL_NATIVE_256_B.json')['blocks']
activ = L(PHYS + '/ACTIVATION.json')['blocks']
plan = L('lambda_round14/material/m8_late/M8_LATE_PLAN.json')['rows']
final = L('lambda_round15/flow_main_v2/MAIN_CLOCK_SOURCE.json')['records']
refined = L('lambda_round13/flow/PHYSICAL_REFINED_SOURCE.json')['records']
clock = {r['row']: r for r in L('lambda_round15/director/COMMON_CLOCK_MAIN_39_ROW_SOURCE_PROPOSAL_V2.json')['rows']}
KEYS = ('main_lo', 'native_debit', 'first_hi', 'last_hi')
e0, e1 = F(1, 2000000), F(1, 20000)

def glob_caps(i, h):
    n = next(r for r in native[i]['height_records'] if F(r['height']) == h)
    a_ = next(r for r in activ[i]['heights'] if F(r['height']) == h)
    A, B, P, P1, DU, DM, Z, T = (F(n[k]) for k in ('prefix_A_upper', 'prefix_B_upper', 'Euler_norm_upper',
        'Euler_log_moment_upper', 'D_upper', 'D_match_lower', 'overlap_Z_match_lower', 'Euler_tail_upper'))
    Aact, Dact = F(a_['Aact_upper']), F(a_['Dact_upper'])
    a = P * Aact; b = 2 * P * Dact + P1 * Aact; g = 1 - A - a
    r0 = e0 * P; r1 = e1 * P + e0 * P1 / 2
    R = B - (1 - A) * DM - 2 * Z
    assert R >= 0 and g > r0 > 0
    Ean = (R + b + a * DU) / (2 * g) + T / 2
    Eph = r1 / (g - r0) + (B + b) * r0 / (2 * g * (g - r0)) + F(2, 10**12)
    # the relation used for the circle: e0*P/g <= Eph/100
    assert e0 * P / g <= Eph / 100
    return Ean, Eph, dict(A=float(A), P=float(P), g=float(g), e0P_over_g=float(e0 * P / g), Eph_over_100=float(Eph / 100))

# thermal coefficients d_t(n), own implementation (Dirichlet convolution form)
NMAX = 4096
LOG = [mp.mpf(0)] * 2 + [mp.log(n) for n in range(2, NMAX + 1)]
def dcoef(t):
    t = mpf(t)
    b = [mp.mpf(0), mp.mpf(1)] + [mp.exp(t * LOG[n] ** 2 / 4) for n in range(2, NMAX + 1)]
    d = [mp.mpf(0)] * (NMAX + 1)
    # (log n) b(n) = sum_{r|n, r>=2} d(r) b(n/r)  ->  d(n) = log n b(n) - sum_{r|n, 2<=r<n} d(r) b(n/r)
    acc = [mp.mpf(0)] * (NMAX + 1)
    for r in range(2, NMAX + 1):
        d[r] = LOG[r] * b[r] - acc[r]
        assert d[r] > -mp.mpf(10) ** (-50), (r, d[r])
        for m in range(2, NMAX // r + 1):
            acc[r * m] += d[r] * b[m]
    return d

def Pb(b, z):  # sum b_r z^r / r!
    return sum(mpf(br) * z ** r / math.factorial(r) for r, br in enumerate(b))

def run(i, zp, cp_):
    z = L(zp); cp = L(cp_); j = cp['jet_source']
    ov = plan[i]['joint_jet_overlay']
    p = F(ov['centres'][0]['p']); b = [F(v) for v in ov['centres'][0]['b']]; alpha = F(ov['alpha'])
    assert F(z['alpha']) == alpha and F(z['centres'][0]['p']) == p and [F(v) for v in z['centres'][0]['b']] == b
    tl, tr = map(F, plan[i]['time'])
    if i == 44:
        h = F(j['analytic_envelope']['analytic_height']); h0 = F(j['physical_circle']['native_floor']); r = F(j['physical_circle']['radius'])
    elif i == 0:
        h = h0 = F(2); r = F(1)
    else:
        h = h0 = F(j['circle_and_envelope']['native_floor']); r = F(j['circle_and_envelope']['radius'])
    print(f'--- row {i}: p={p} order={len(b)-1} alpha={float(alpha):.12f} time=[{tl},{tr}] h_an={h} h0={h0} r={r}')
    # domain guards
    assert p - r >= h0 and p + r <= 6 and 0 < r <= F(39, 20) and h < p and b[0] >= 0 and alpha >= 0
    assert (1 + h0 - F(1, 100)) / 2 + tl * F(2689, 100) / 8 > F(5, 4)
    heights = sorted(F(x['height']) for x in native[i]['height_records'])
    assert h in heights and h0 in heights
    print('   native heights', [str(x) for x in heights], '; disk heights [%s,%s]' % (p - r, p + r))
    Ean, Eph, info = glob_caps(i, h0)
    Ean_h = glob_caps(i, h)[0]
    print('   global caps at h0: Ean=%.6e Eph=%.6e' % (float(Ean), float(Eph)), info)
    # physical circle
    if i == 44:
        S = (1 + h0 - F(1, 100)) * F(2689, 400) + tl * F(2689, 400) ** 2
        E0 = 8 * mp.exp(-mpf(S)) + mp.mpf(5) / 10**10
        E0hi = F(j['physical_circle']['new_E0_upper'])
        assert mpf(E0hi) >= E0, 'stored E0 upper below E0'
        ratio = min(F(1), E0hi / e0)
        print('   E0(h0,t-)=%s  stored upper slack=%s  ratio=%.6e' % (mp.nstr(E0, 15), mp.nstr(mpf(E0hi) - E0, 5), float(ratio)))
    else:
        ratio = F(1)
    delta = ratio * Eph / 100; eta = delta / (1 - delta)
    physical = eta / (p * r) * sum(F(m + 1) * abs(v) * (p / r) ** m for m, v in enumerate(b))
    normalizer = F(1, 10**10) / p * sum(abs(v) * (p / r) ** m for m, v in enumerate(b))
    # analytic envelope: sup_{lam >= log 4097} |P_b(-p lam/2)| e^{-a lam},  a=(p-h)/2
    a = (p - h) / 2; lam0 = mp.log(4097)
    g = lambda lam: abs(Pb(b, -mpf(p) * lam / 2)) * mp.exp(-mpf(a) * lam)
    # own critical points: roots of d/dlam P - a P
    M = len(b) - 1
    poly = [mpf(v) * (-mpf(p) / 2) ** m / math.factorial(m) for m, v in enumerate(b)]  # ascending in lam
    crit = [((m + 1) * poly[m + 1] if m < M else 0) - mpf(a) * poly[m] for m in range(M + 1)]
    roots = mp.polyroots(crit[::-1], maxsteps=500, extraprec=400)
    real_roots = sorted(mp.re(rt) for rt in roots if abs(mp.im(rt)) < mp.mpf(10) ** (-30))
    cands = [lam0] + [rt for rt in real_roots if rt > lam0]
    sup_true = max(g(c) for c in cands)
    # dense sampling cross-check (no calculus)
    samp = max(g(lam0 + k * mp.mpf('0.002')) for k in range(0, 60000))
    print('   real critical points of the envelope:', [mp.nstr(x, 12) for x in real_roots], ' log4097=', mp.nstr(lam0, 12))
    print('   sup via critical points = %s ; dense-sample max on [log4097, log4097+120] = %s' % (mp.nstr(sup_true, 15), mp.nstr(samp, 15)))
    if i == 44:
        env = j['analytic_envelope']; envhi = F(env['envelope_weight_upper'])
        left = F(env['left_rational'])
        nabove = sum(1 for rt in real_roots if rt > mpf(left))
        print('   M8: left=%s  roots above left=%d  stored count=%d  boxes=%s' % (mp.nstr(mpf(left), 15), nabove, env['total_critical_roots_above_left'],
              [(mp.nstr(mpf(bx['lo']), 12), mp.nstr(mpf(bx['hi']), 12)) for bx in env['critical_boxes']]))
        assert nabove == env['total_critical_roots_above_left'] == len(env['critical_boxes'])
        assert len(env['candidate_value_bounds']) == nabove + 1
        for bx in env['critical_boxes']:
            assert sum(1 for rt in real_roots if mpf(bx['lo']) < rt <= mpf(bx['hi'])) == 1
        # crit nonzero at Sturm evaluation points
        cq = [F(v) for v in env['critical_polynomial_descending']][::-1]
        ev = lambda x: sum(c * x ** k for k, c in enumerate(cq))
        pts = [left, F(env['cauchy_root_bound'])] + [F(bx[k]) for bx in env['critical_boxes'] for k in ('lo', 'hi')]
        assert all(ev(x) != 0 for x in pts), 'Sturm evaluated at a root'
        # multiplicity: gcd(crit, crit') trivial?  check discriminant-like via distinct roots
        dist = min(abs(roots[u] - roots[v]) for u in range(len(roots)) for v in range(u))
        print('   min distance between complex critical roots = %s (squarefree if > 0)' % mp.nstr(dist, 6))
    elif i == 0:
        envhi = F(j['monomial_envelope_weight_upper'])
    else:
        envhi = F(j['circle_and_envelope']['envelope_weight_upper'])
    assert mpf(envhi) >= sup_true and mpf(envhi) >= samp
    print('   stored envelope weight = %s  (true sup / stored = %s)' % (mp.nstr(mpf(envhi), 15), mp.nstr(sup_true / mpf(envhi), 8)))
    analytic = envhi * Ean_h / p
    native_debit = analytic + physical + normalizer
    # heads
    ds = dcoef(tr); c0 = mp.log(690988) / 2
    heads = []
    for t in (tl, tr):
        tot = mp.mpf(0)
        for n in range(2, NMAX + 1):
            x = -mpf(p) * LOG[n] / 2
            tot += ds[n] * mp.exp(-(mp.mpf(1) / 2 + mpf(t) * c0) * LOG[n]) * mp.exp(x) * abs(Pb(b, x))
        heads.append(tot / (2 * mpf(p)))
    main = mpf(b[0]) * c0 / mpf(p)
    st = {k: F(j[k]) for k in KEYS}
    print('   own: analytic=%.12e physical=%.12e normalizer=%.12e native=%.12e' % (float(analytic), float(physical), float(normalizer), float(native_debit)))
    print('   stored native_debit equal to own exact value:', st['native_debit'] == native_debit)
    print('   head first: own=%s stored=%s slack=%s' % (mp.nstr(heads[0], 18), mp.nstr(mpf(st['first_hi']), 18), mp.nstr(mpf(st['first_hi']) - heads[0], 5)))
    print('   head last : own=%s stored=%s slack=%s' % (mp.nstr(heads[1], 18), mp.nstr(mpf(st['last_hi']), 18), mp.nstr(mpf(st['last_hi']) - heads[1], 5)))
    print('   main: b0*c0/p=%s stored main_lo=%s slack=%s' % (mp.nstr(main, 18), mp.nstr(mpf(st['main_lo']), 18), mp.nstr(main - mpf(st['main_lo']), 5)))
    assert st['native_debit'] == native_debit and mpf(st['first_hi']) >= heads[0] and mpf(st['last_hi']) >= heads[1] and mpf(st['main_lo']) <= main
    # assembly against final table
    gain = F(0)
    if i in clock:
        gain = F(29, 10000) if i == 8 else F(clock[i]['old_source_gain'])
    scalar = {k: F(refined[i][k]) for k in KEYS}
    scalar['first_hi'] -= gain; scalar['last_hi'] -= gain
    want = {k: alpha * scalar[k] + 2 * st[k] for k in KEYS}
    ok = all(want[k] == F(final[i][k]) for k in KEYS)
    print('   final fields == alpha*(refined scalar - clock gain %s) + 2*jet : %s' % (gain, ok))
    for k in KEYS:
        print('      %-12s final=%.12f  alpha*scalar=%.12f  2*jet=%.12e' % (k, float(F(final[i][k])), float(alpha * scalar[k]), float(2 * st[k])))
    assert ok
    # net effect of the jet on the source floor at both ends
    for th, kk in ((0, 'first_hi'), (1, 'last_hi')):
        s_sc = scalar['main_lo'] - scalar['native_debit'] - scalar[kk]
        s_fin = F(final[i]['main_lo']) - F(final[i]['native_debit']) - F(final[i][kk])
        print('      source floor theta=%d: scalar parent %.9f -> final %.9f' % (th, float(s_sc), float(s_fin)))

run(0, 'lambda_round13/flow/MIXED_ROW000_M4_PROPOSAL.json', 'lambda_round13/flow/MIXED_ROW000_M4_SOURCE_CERTIFICATE.json')
run(16, 'lambda_round14/material/ROW016_M4_PROPOSAL.json', 'lambda_round14/material/ROW016_M4_SOURCE_CERTIFICATE.json')
run(44, 'lambda_round14/material/m8_late/ROW044_M8_PROPOSAL.json', 'lambda_round14/material/m8_late/ROW044_M8_SOURCE_CERTIFICATE.json')
print('ALL OWN JET CHECKS PASSED')
