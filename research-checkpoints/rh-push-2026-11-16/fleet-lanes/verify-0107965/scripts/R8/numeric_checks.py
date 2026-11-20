#!/usr/bin/env python3
"""Referee R8 numeric checks (mpmath, own code). argv[1] = plan JSON, argv[2] = output JSON.
R(d,b) is built straight from eq (30) (complex form), jets by mp.diff in the probe height.
Checks: (84) on the boundary, (85) in the interior, own-pair formulas (83)/(88) and monotonicity,
the strip-Poisson identity behind Lemma 2.6, the pair-contribution sign in (38)."""
import sys, json, random
from mpmath import mp, mpf, mpc, quad, cosh, cos, sin, pi, diff, inf, factorial, sqrt
mp.dps = 40
random.seed(20261117)
plan = json.load(open(sys.argv[1]))

def F(x):
    a, _, b = x.partition('/')
    return mpf(int(a)) / mpf(int(b or 1))

def K(h, d, b):
    # eq (30) via -Im[1/(z-a-ib) + 1/(z-a+ib)], z - a = d + ih
    return -(1 / mpc(d, h - b) + 1 / mpc(d, h + b)).imag

def make_R(row):
    nodes = [(F(n['height']), F(n['shift']), F(n['weight'])) for n in row['nodes']]
    ov = row.get('joint_jet_overlay')
    alpha = F(ov['alpha']) if ov else mpf(1)
    cents = [(F(c['p']), [F(x) for x in c['b']]) for c in ov['centres']] if ov else []
    def R(d, b):
        tot = mpf(0)
        for h, v, w in nodes:
            tot += w / 2 * (K(h, d + v, b) + K(h, d - v, b))
        tot *= alpha
        for p, bs in cents:
            for r, br in enumerate(bs):
                if br == 0: continue
                der = K(p, d, b) if r == 0 else diff(lambda hh: K(hh, d, b), p, r)
                tot += 2 * br * p ** (r - 1) / factorial(r) * der
        return tot
    def O_formula(q):
        # paper (83)/(87) and (88)
        tot = mpf(0)
        for h, v, w in nodes:
            tot += 2 * w * h * (h * h + v * v - q) / ((h * h + v * v - q) ** 2 + 4 * v * v * q)
        tot *= alpha
        for p, bs in cents:
            for r, br in enumerate(bs):
                if br == 0: continue
                der = 2 * p / (p * p - q) if r == 0 else diff(lambda pp: 2 * pp / (pp * pp - q), p, r)
                tot += 2 * br * p ** (r - 1) / factorial(r) * der
        return tot
    return R, O_formula

out = {}
# 1. Poisson identity of Lemma 2.6
def strip_poisson_equal(d, b, y):
    th = pi * b / (2 * y); c = cosh(pi * d / (2 * y))
    return cos(th) / (4 * y) * (1 / (c - sin(th)) + 1 / (c + sin(th)))
worst = 0
for (y, d, b) in [(mpf('0.7'), mpf('0.3'), mpf('0.2')), (mpf('0.4'), mpf('1.1'), mpf('0.39')), (mpf('0.25'), mpf(0), mpf(0)), (mpf('0.75'), mpf('-2'), mpf('0.6'))]:
    integ = quad(lambda t: strip_poisson_equal(d - t, b, y) * 2 / (t * t + 4 * y * y), [-inf, -5, d - 1, d, d + 1, 5, inf])
    lhs = integ + pi / y * strip_poisson_equal(d, b, y)
    rhs = K(y, d, b) / y
    worst = max(worst, abs(lhs - rhs))
    # normalisation of the kernel: integral 1
out['poisson_identity_max_abs_error'] = float(worst)
out['poisson_kernel_mass'] = float(quad(lambda t: strip_poisson_equal(t, mpf('0.2'), mpf('0.7')), [-inf, -3, 0, 3, inf]))
# 2. sign in (38): Im of 2/(z - rho) + 2/(z - conj rho) at z = x + iy equals -2 K_y(d, b)
x, y, a, b = mpf('1.3'), mpf('0.6'), mpf('0.4'), mpf('0.25')
z = mpc(x, y)
out['zero_ode_pair_check'] = float(abs((2 / (z - mpc(a, b)) + 2 / (z - mpc(a, -b))).imag + 2 * K(y, x - a, b)))
out['own_conjugate_check'] = float(abs((2 / (z - mpc(x, -y))).imag + 1 / y))

rows = [0, 1, 16, 22, 30, 44, 55, 66]
res = {}
for idx in rows:
    row = plan['rows'][idx]
    cap = F(row['q_interval'][1])
    R, Of = make_R(row)
    heights = [F(n['height']) for n in row['nodes']]
    rec = {'cap': float(cap), 'min_height_sq_minus_cap': float(min(heights) ** 2 - cap)}
    # boundary: normalised defect g = 1 - (d^2 + 4q) R(d, sqrt q)/4
    mn = (mpf(10), None)
    pts = [(mpf(dd), cap * mpf(qq)) for dd in ['0', '0.01', '0.1', '0.3', '0.6', '1', '1.5', '2', '2.5', '3', '4', '6', '10', '30', '100', '1e3', '1e5']
           for qq in ['1e-12', '1e-6', '0.01', '0.1', '0.3', '0.5', '0.7', '0.9', '1']]
    pts += [(mpf(random.uniform(0, 8)), cap * mpf(random.random())) for _ in range(200)]
    for d, q in pts:
        g = 1 - (d * d + 4 * q) * R(d, sqrt(q)) / 4
        if g < mn[0]: mn = (g, (float(d), float(q / cap)))
    rec['boundary_min_normalised_defect'] = (float(mn[0]), mn[1])
    rec['far_field_limit_defect_d=1e8'] = float(1 - (mpf(10) ** 16 + 4 * cap) * R(mpf(10) ** 8, sqrt(cap)) / 4)
    # interior (85): K_y(d,b) - (y/2) R(d,b) >= 0
    mi = (mpf(10), None)
    for _ in range(300):
        q = cap * mpf(random.random()); yy = sqrt(q); b = yy * mpf(random.random()); d = mpf(random.uniform(-6, 6))
        val = (K(yy, d, b) - yy / 2 * R(d, b)) / K(yy, d, b)
        if val < mi[0]: mi = (val, (float(d), float(b / yy), float(q / cap)))
    for d in ['0', '1e-3', '0.5', '2', '50']:
        for bb in ['0', '0.5', '0.999', '1']:
            if d == '0' and bb == '1': continue
            yy = sqrt(cap); b = yy * mpf(bb)
            val = (K(yy, mpf(d), b) - yy / 2 * R(mpf(d), b)) / K(yy, mpf(d), b)
            if val < mi[0]: mi = (val, (float(d), float(bb), 1.0))
    rec['interior_min_relative_defect'] = (float(mi[0]), mi[1])
    # own pair
    qs = [cap * mpf(k) / 200 for k in range(201)]
    Ov = [R(mpf(0), sqrt(q)) for q in qs]
    rec['own_pair_formula_max_abs_diff'] = float(max(abs(Ov[k] - Of(qs[k])) for k in range(0, 201, 10)))
    rec['own_pair_min_increment'] = float(min(Ov[k + 1] - Ov[k] for k in range(200)))
    rec['own_pair_at_0_and_cap'] = (float(Ov[0]), float(Ov[-1]))
    res[idx] = rec
    print(idx, json.dumps(rec), flush=True)
out['rows'] = res
json.dump(out, open(sys.argv[2], 'w'), indent=1)
print(json.dumps({k: v for k, v in out.items() if k != 'rows'}))
