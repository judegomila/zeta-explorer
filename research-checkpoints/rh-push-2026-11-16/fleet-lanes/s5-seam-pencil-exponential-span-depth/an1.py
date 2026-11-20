"""Combination 1: join prime side R_F(d) with the zero-side majorants.  Output an1.json + an1.md."""
import json, math, sys, os
P = json.load(open(sys.argv[1])); X = P['X']; T = math.log(X)
if len(sys.argv) > 2:
    P2 = json.load(open(sys.argv[2])); P['objects']['DH'] = P2['objects']['DH']; P['N0'] = P2['N0']
Z = {}
for fn in ['t1_zero_f.jsonl', 't1_zero_a.jsonl']:
    if os.path.exists(fn):
        for l in open(fn):
            r = json.loads(l)
            if 'logLam' in r: Z[(r['spec'], r['c'], r['mode'][0])] = r
def Rcurve(name, c):
    e = P['objects'][name]['c=%g' % c]
    t = e['t_exact'] + e.get('t_bin', []); J = e['J_exact'] + e.get('J_bin', []); Jtot = e.get('J_X', e['J_N0'])
    return [(tt, max(1 - j / Jtot, 0.0)) for tt, j in zip(t, J)], (T if 'J_X' in e else math.log(P['N0']))
def interp(rec, d):
    ds = rec['d']; L = rec['logLam']
    if d <= ds[0]: return L[0]
    for i in range(1, len(ds)):
        if d <= ds[i] + 1e-12:
            w = (d - ds[i - 1]) / (ds[i] - ds[i - 1]); return L[i - 1] * (1 - w) + L[i] * w
    return None
MAJ = {'ZETA': 'ZETA:on', 'LCHI4': 'LCHI4:on', 'LCHI5': 'LCHI5:on', 'DH': 'DH:on', 'TNR-q1000003': 'ZETA:on', 'TNR-q3': 'ZETA:on', 'WT': 'ZETA:on', 'LIOU': 'ZETA:on', 'SGN': 'ZETA:on', 'UNI': 'ZETA:on', 'EA-1/4': 'ZETA:on', 'EA-1/8': 'ZETA:on'}
out = {}; md = []
for c in (0.5, 0.25):
    md.append('\n### c = %g, X = %.0e\n' % (c, X))
    md.append('| object | majorant nodes | log R(d) + 2cd at d = 2, 4, 6, 8, 10, 12, 16, 20, 24, 27 | first d with R > Lambda_on (N = 100 / 400 / all) | first d with R e^{2cd} > 10^3 |')
    md.append('|---|---|---|---|---|')
    for name in P['objects']:
        cur, Tend = Rcurve(name, c)
        row = []
        for d0 in (2, 4, 6, 8, 10, 12, 16, 20, 24, 27):
            v = [r for t, r in cur if abs(t - d0) < 0.13]
            row.append('%.2f' % (math.log(v[0]) + 2 * c * d0) if v and v[0] > 0 and d0 < Tend - 0.5 else '-')
        firsts = []
        for N in ('100', '400', '0'):
            key = None
            for mode in ('a', 'f'):
                for NN in ([N] if N != '0' else ['0', '1517']):
                    k = (MAJ[name] + ':' + NN, c, mode)
                    if k in Z and key is None: key = k
            if key is None: firsts.append('n/a'); continue
            fd = None
            for t, r in cur:
                if t > Tend - 1.0 or r <= 0: continue
                L = interp(Z[key], t)
                if L is None: break
                if key[2] == 'f' and L < -18: break       # float screen not valid below e^-18
                if math.log(r) > L + 0.01: fd = t; break
            firsts.append("%.2f" % fd if fd is not None else "none")
        f3 = None
        for t, r in cur:
            if t > Tend - 1.0 or r <= 0: continue
            if math.log(r) + 2 * c * t > math.log(1e3): f3 = t; break
        out['%s|c=%g' % (name, c)] = dict(curve=cur, first=firsts, first_1e3=f3, T=Tend)
        md.append('| %s | %s | %s | %s | %s |' % (name, MAJ[name], ', '.join(row), ' / '.join(firsts), '%.2f' % f3 if f3 else 'none'))
md.append('\n### zero side: log Lambda(d) + 2cd (amplification over the single-rate floor), and TILT-DET\n')
md.append('| nodes | c | mode | K | n_off | min Re nu | log Lambda at d = 1, 2, 4, 6, 8, 10, 15, 20, 25, 30 | log Lambda + 2 (min Re nu) d at d = 10, 20, 30 |')
md.append('|---|---|---|---|---|---|---|---|')
for (spec, c, mode), r in sorted(Z.items()):
    g = lambda d: interp(r, d)
    md.append('| %s | %g | %s | %d | %d | %.4f | %s | %s |' % (spec, c, r['mode'], r['K'], r['n_off'], r['min_re'], ', '.join('%.2f' % g(d) if g(d) is not None else '-' for d in (1, 2, 4, 6, 8, 10, 15, 20, 25, 30)),
              ', '.join('%.2f' % (g(d) + 2 * r['min_re'] * d) if g(d) is not None else '-' for d in (10, 20, 30))))
json.dump(out, open('an1.json', 'w')); open('an1.md', 'w').write('\n'.join(md)); print('\n'.join(md))
