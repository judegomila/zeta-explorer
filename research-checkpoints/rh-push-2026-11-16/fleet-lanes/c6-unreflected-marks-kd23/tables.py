"""tables.py -- markdown tables for RESULT.md from msq_D*.json (set 1) and msq2_D*.json (set 2)."""
import json, glob, math
import numpy as np
def load(pref):
    runs = {}
    for f in sorted(glob.glob(pref + '_D*.json')):
        d = json.load(open(f))
        for r in d['runs']:
            runs[(d['D'], r['exp'], r['family'])] = r
    return runs
R1 = load('msq'); R2 = load('msq2')
ES = [1.0, 1.25, 1.5, 1.75, 2.0]
def Ds(R): return sorted(set(k[0] for k in R))
def cell(R, D, e, w, fam='gen', key='rho'):
    r = R.get((D, e, fam))
    return None if r is None or w not in r['w'] else r['w'][w]
def table(R, ws, es=ES, fam='gen'):
    out = ['| weight | D | ' + ' | '.join(f'e = {e}' for e in es) + ' |', '|---|---|' + '---|' * len(es)]
    for w in ws:
        for D in Ds(R):
            if D < 1e4: continue
            cs = [cell(R, D, e, w, fam) for e in es]
            if all(c is None for c in cs): continue
            out.append(f"| {w} | {D:.0e} | " + ' | '.join('-' if c is None else f"{c['rho']:.3f}" for c in cs) + ' |')
    return '\n'.join(out)
def fit(R, w, e, sub=None, Dmin=1e4):
    xs, ys, ss = [], [], []
    for D in Ds(R):
        c = cell(R, D, e, w)
        if c is None or D < Dmin: continue
        v = c['rho'] - (cell(R, D, e, sub)['rho'] if sub else 0.0)
        if v <= 0: continue
        xs.append(math.log(D)); ys.append(math.log(v)); ss.append(max(c['se'] / v, 0.01))
    if len(xs) < 4: return None
    x = np.array(xs); y = np.array(ys); wg = 1 / np.array(ss) ** 2
    xm = (wg * x).sum() / wg.sum(); ym = (wg * y).sum() / wg.sum(); sxx = (wg * (x - xm) ** 2).sum()
    b = (wg * (x - xm) * (y - ym)).sum() / sxx; res = y - ym - b * (x - xm)
    sb = math.sqrt(max((wg * res ** 2).sum() / (len(x) - 2), 1.0) / sxx)
    return b, sb, len(x)
def slopes(R, ws, es, sub=None):
    out = ['| weight | ' + ' | '.join(f'e = {e}' for e in es) + ' |', '|---|' + '---|' * len(es)]
    for w in ws:
        row = []
        for e in es:
            f = fit(R, w, e, sub)
            row.append('-' if f is None else f"{f[0]:+.3f} +- {f[1]:.3f}")
        out.append(f"| {w} | " + ' | '.join(row) + ' |')
    return '\n'.join(out)
T = {}
T['TABLE_TH'] = ("Set 1 (`msq_D*.json`):\n\n" + table(R1, ['th', 'thm4', 'thm2']) +
                 "\n\nSet 2 (`msq2_D*.json`, independent rows):\n\n" + table(R2, ['tha', 'thA', 'tham4', 'tham2']))
EA = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0]
T['TABLE_SLOPES'] = ("Set 1:\n\n" + slopes(R1, ['th', 'thm4', 'thm2', 'thr', 'thc', 'one', 'mu', 'rnd', 'rsg', 'onem4', 'rsgm4', 'c2', 's1', 'crnd'], EA) +
                     "\n\nSet 2:\n\n" + slopes(R2, ['th', 'tha', 'thA', 'tham4', 'tham2', 'thAm4', 'thar', 'mu', 'mua2', 'rnd'], [0.75, 1.0, 1.25, 1.5, 1.75, 2.0]))
ctrl = table(R1, ['c2c', 's1c', 'rnd'], [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0])
ex = ("Exponent in D of the excess rho - rho_rnd (D >= 10^4):\n\n" + slopes(R1, ['c2c', 's1c'], [0.5, 0.75, 1.0, 1.25, 1.5], sub='rnd') +
      "\n\n| prediction | e = 0.5 | e = 0.75 | e = 1.0 | e = 1.25 | e = 1.5 |\n|---|---|---|---|---|---|\n| c2c: (2 - e)/3 | 0.500 | 0.417 | 0.333 | 0.250 | 0.167 |\n| s1c: (2 - e)/6 | 0.250 | 0.208 | 0.167 | 0.125 | 0.083 |")
T['TABLE_CTRL'] = ctrl + "\n\n" + ex
frac = {'sq': lambda K: (2 ** 0.5 - 1) * K ** -0.5, 'cube': lambda K: (2 ** (1 / 3) - 1) * K ** (-2 / 3), 'fourth': lambda K: (2 ** 0.25 - 1) * K ** -0.75}
out = ['| family | weight | D | ' + ' | '.join(f'e = {e}: rho (share)' for e in [1.0, 1.25, 1.5, 2.0]) + ' |', '|---|---|---|---|---|---|---|']
mx = 0
for fam in ('sq', 'cube', 'fourth'):
    for (R, w) in ((R1, 'th'), (R2, 'tha'), (R2, 'tham4')):
        for D in Ds(R):
            if D < 1e5: continue
            row = []
            for e in [1.0, 1.25, 1.5, 2.0]:
                c = cell(R, D, e, w, fam)
                if c is None: row.append('-'); continue
                sh = c['rho'] * frac[fam](R[(D, e, fam)]['K']); mx = max(mx, sh)
                row.append(f"{c['rho']:.1f} ({sh:.0e})")
            out.append(f"| {fam} | {w} | {D:.0e} | " + ' | '.join(row) + ' |')
T['TABLE_FAM'] = '\n'.join(out) + f"\n\nshare = rho times the proportion of rows of the family in the annulus. Largest share in the table: {mx:.1e}."
mxg = {}
for R, ws in ((R1, ['th', 'thm4', 'thm2', 'rnd']), (R2, ['tha', 'thA', 'tham4', 'tham2', 'rnd'])):
    for w in ws:
        v = [R[k]['w'][w]['max'] for k in R if k[2] == 'gen' and k[1] >= 1.0 and k[0] >= 1e4]
        mxg[w] = (min(v), max(v))
T['MAX'] = '; '.join(f"{w}: {a:.1f} to {b:.1f}" for w, a, b in ((w, *mxg[w]) for w in mxg))
allth = [R[k]['w'][w]['rho'] for R, ws in ((R1, ['th', 'thm2']), (R2, ['tha', 'thA', 'tham2'])) for w in ws for k in R if k[2] == 'gen' and k[1] >= 1.0 and k[1] <= 2.0 and k[0] >= 1e4]
T['RANGE'] = f"{min(allth):.3f} to {max(allth):.3f}"
allm = [R[k]['w'][w]['rho'] for R, ws in ((R1, ['thm4']), (R2, ['tham4'])) for w in ws for k in R if k[2] == 'gen' and k[1] >= 1.0 and k[1] <= 2.0 and k[0] >= 1e4]
T['RANGEM'] = f"{min(allm):.3f} to {max(allm):.3f}"
json.dump(T, open('tables.json', 'w'), indent=1)
for k in T: print('@@' + k + '@@\n' + T[k] + '\n')
