"""analyse.py -- tables and power-law fits from msq*_D*.json. rho(K, D) = mean_m |S(m)|^2 / ||a||^2."""
import json, glob, math, sys
import numpy as np
pref = sys.argv[1] if len(sys.argv) > 1 else 'msq'
runs = {}
for f in sorted(glob.glob(pref + '_D*.json')):
    d = json.load(open(f))
    for r in d['runs']:
        runs[(d['D'], r['exp'], r['family'])] = r
Ds = sorted(set(k[0] for k in runs)); exps = sorted(set(k[1] for k in runs))
ws = list(next(iter(runs.values()))['w'].keys())
def tab(fam, key='rho'):
    for w in ws:
        if key == 'rho_cls' and 'rho_cls' not in next(iter(runs.values()))['w'][w]: continue
        print(f"\n[{fam}] weight {w}  ({key}; rows = D, columns = K = D^e)")
        print('      D  ' + ' '.join(f"e={e:<6}" for e in exps))
        for D in Ds:
            row = []
            for e in exps:
                r = runs.get((D, e, fam))
                row.append(f"{r['w'][w][key]:8.3f}" if r else '       -')
            print(f"{D:8.0e} " + ' '.join(row))
def fit(fam, w, e, Dmin=1e4, sub=None, key='rho'):
    xs, ys, ss = [], [], []
    for D in Ds:
        r = runs.get((D, e, fam))
        if r is None or D < Dmin: continue
        v = r['w'][w][key] - (r['w'][sub][key] if sub else 0.0)
        se = r['w'][w]['se']
        if v <= 0: continue
        xs.append(math.log(D)); ys.append(math.log(v)); ss.append(max(se / v, 0.01))
    if len(xs) < 3: return None
    x = np.array(xs); y = np.array(ys); wgt = 1 / np.array(ss) ** 2
    xm = (wgt * x).sum() / wgt.sum(); ym = (wgt * y).sum() / wgt.sum()
    sxx = (wgt * (x - xm) ** 2).sum(); b = (wgt * (x - xm) * (y - ym)).sum() / sxx
    res = y - ym - b * (x - xm); dof = len(x) - 2
    sb = math.sqrt(max((wgt * res ** 2).sum() / dof, 1.0) / sxx)   # scatter-inflated error
    return b, sb, len(x)
print("=== tables, generic rows"); tab('gen'); 
print("\n=== class-split tables, generic rows"); tab('gen', 'rho_cls')
print("\n=== exponent of rho in D at fixed aspect e (generic rows, D >= 1e4); K+D law: 0; (KD)^(2/3) law: (2-e)/3; sextic-pole law: (2-e)/6")
for w in ws:
    out = []
    for e in exps:
        f = fit('gen', w, e)
        out.append(f"e={e}: {f[0]:+.3f}+-{f[1]:.3f}" if f else f"e={e}: -")
    print(f"{w:6s} " + '  '.join(out))
print("\n=== exponent of the excess rho - rho_rnd in D (controls with a pole)")
for w in [x for x in ('c2c', 's1c') if x in ws]:
    out = []
    for e in exps:
        f = fit('gen', w, e, sub='rnd')
        out.append(f"e={e}: {f[0]:+.3f}+-{f[1]:.3f} (n={f[2]})" if f else f"e={e}: -")
    print(f"{w:6s} " + '  '.join(out) + f"   predicted: {'(2-e)/3' if w == 'c2c' else '(2-e)/6'}")
print("\n=== structured row families: rho and share of the total energy  share = rho_fam * (#family rows / #all rows)")
frac = {'sq': lambda K: (2 ** 0.5 - 1) * K ** -0.5, 'cube': lambda K: (2 ** (1 / 3) - 1) * K ** (-2 / 3), 'fourth': lambda K: (2 ** 0.25 - 1) * K ** -0.75}
for fam in ('sq', 'cube', 'fourth'):
    for w in [x for x in ('th', 'thc', 'tha', 'thm4', 'tham4') if x in ws]:
        print(f"\n[{fam}] weight {w}: rho (share)")
        for D in Ds:
            row = []
            for e in exps:
                r = runs.get((D, e, fam))
                row.append(f"{r['w'][w]['rho']:8.2f} ({r['w'][w]['rho'] * frac[fam](r['K']):.1e})" if r else '                  -')
            print(f"{D:8.0e} " + ' '.join(row))
print("\n=== largest single row, generic family: max_m |S(m)|^2 / ||a||^2")
for w in [x for x in ('th', 'tha', 'thm4', 'tham4', 'rnd', 'c2c') if x in ws]:
    print(f"weight {w}")
    for D in Ds:
        print(f"{D:8.0e} " + ' '.join(f"{runs[(D, e, 'gen')]['w'][w]['max']:8.2f}" if (D, e, 'gen') in runs else '       -' for e in exps))
