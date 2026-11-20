"""Combination 1 summary: zeros of f' left of the line against the off-line zeros of f (tables of c12-control-battery-harness,
read as json).  Usage: t1_summary.py outdir"""
import sys, json, math, os
D = sys.argv[1]; TB = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'c12-control-battery-harness', 'tables')
def left_zeros(name, lo, hi):
    if name == 'DH': z = json.load(open(TB + '/zeros_DH.json'))['offline']; return [(1 - float(b), float(g)) for b, g, _ in z if lo < float(g) <= hi]
    if name.startswith('HEAT'): z = json.load(open(TB + '/zeros_HEAT-%s.json' % name[4:]))['offline']; return [(0.5 - float(e[0]), float(e[1])) for e in z if lo < float(e[1]) <= hi]
    if name == 'EA': z = json.load(open(TB + '/zeros_ZETA.json')); z = (z.get('gamma')) if isinstance(z, dict) else z; return [(0.25, float(g)) for g in z if lo < float(g) <= hi]
    if name == 'TNR': return [(0.5 - 0.40375322482772352, 2.8596008673801272 * (2 * k + 1)) for k in range(400) if lo < 2.8596008673801272 * (2 * k + 1) <= hi]
    return []
out = {}
for name in ['ZETA', 'L3', 'DH', 'EA', 'TNR', 'LIOU', 'HEAT-0.5', 'HEAT-0.1']:
    p = '%s/t1_%s.json' % (D, name)
    if not os.path.exists(p): continue
    J = json.load(open(p)); W = J['windows']; lo = W[0]['T']; hi = W[-1]['T'] + J['H']
    roots = [r for w in W for r in w['roots']]; cnt = sum(w['count'] for w in W)
    lz = left_zeros(name, lo, hi)
    r = dict(range=[lo, hi], rectangle=[J['sL'], J['sR']], windows=len(W), zeros_of_f_prime_by_winding=cnt, located_by_newton=len(roots),
             offline_zeros_of_f_in_left_rectangle=len([z for z in lz if z[0] > J['sL']]), offline_left_of_sL=len([z for z in lz if z[0] <= J['sL']]),
             max_abs_winding_residual=max(abs(w['winding'] - w['count']) for w in W), max_step=max(w['max_step'] for w in W),
             evals_winding_per_window=sum(w['evals_winding'] for w in W) / len(W))
    if roots: r['lowest_f_prime_zero'] = roots[0]
    if lz:
        r['lowest_offline_zero_left'] = list(min(lz, key=lambda z: z[1]))
        pairs = []
        for (s, t) in roots:
            z = min(lz, key=lambda z: abs(z[1] - t))
            q = {'DH': 5.0, 'TNR': 9.0}.get(name, 1.0); L = math.log(q * max(t, 10) / (2 * math.pi)); sp = 2 * math.pi / L
            pairs.append(dict(fprime=[s, t], offline=[z[0], z[1]], dt=t - z[1], dt_in_mean_spacings=(t - z[1]) / sp, delta=0.5 - z[0], x=0.5 - s,
                              x_model=(math.sqrt(4 + (0.5 - z[0]) ** 2 * L ** 2) - 2) / L))
        r['pairs_first'] = pairs[:8]
        r['max_abs_dt'] = max(abs(p['dt']) for p in pairs); r['max_abs_dt_in_mean_spacings'] = max(abs(p['dt_in_mean_spacings']) for p in pairs)
        r['min_dt'] = min(p['dt'] for p in pairs); r['n_pairs'] = len(pairs)
        if roots and lz: r['lowest_fprime_minus_lowest_offline'] = roots[0][1] - min(z[1] for z in lz)
    elif roots:
        r['roots_first'] = roots[:10]
    out[name] = r
print(json.dumps(out, indent=1))
