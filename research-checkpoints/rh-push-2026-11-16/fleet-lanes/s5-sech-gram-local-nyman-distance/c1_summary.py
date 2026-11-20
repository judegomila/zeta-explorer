# c1_summary.py : summary tables for combination 1 (reads c1_table.json written by c1_analyze.py, out/dhbox_*.json)
import json, math, numpy as np, collections
rows = json.load(open('c1_table.json')); MU = '1e-08'
COND = {'zeta': 1, 'chi4': 4, 'chi5': 5, 'dh': 5, 'wt': 1}
def band(T):
    for b in (60, 85.7, 240.4, 280, 850, 1055.9, 1000, 10000, 100000, 1000000):
        if abs(T-b) <= 0.45*max(b, 1) and (b >= 1000) == (T >= 500 and abs(T-850) > 1 and abs(T-1055.9) > 1): return b
    return T
out = {}
print('A. main heights: mean (min, max) over windows of rel(N) at mu = 1e-8; n = number of windows')
agg = collections.defaultdict(list)
for r in rows:
    T = r['T']
    for b in (1000, 10000, 100000, 1000000):
        if abs(T-b) <= 400.5 and not (abs(T-850) < 1 or abs(T-1055.9) < 1): agg[(r['obj'], b, r['H'])].append(r)
NS = ['1', '20', '400', '2000', '20000']
for key in sorted(agg, key=lambda k: (k[1], k[2], k[0])):
    g = agg[key]; line = []
    for n in NS:
        v = [x['rel'][n][MU] for x in g if n in x['rel']]
        line.append('%.3f (%.3f, %.3f)' % (np.mean(v), min(v), max(v)) if len(v) > 1 else '%.3f' % v[0])
    th = math.log(20000)/math.log(COND.get(key[0], 1)*key[1]/(2*math.pi))
    out['%s|%g|%g' % key] = {'n': len(g), 'rel': {n: [float(np.mean([x['rel'][n][MU] for x in g])), float(min(x['rel'][n][MU] for x in g)), float(max(x['rel'][n][MU] for x in g))] for n in NS},
                             'mu_spread_at_20000': [float(np.mean([x['rel']['20000'][m] for x in g])) for m in ('0.01', '0.0001', '1e-06', '1e-08', '1e-10')]}
    print('%-11s T0=%-8g H=%-3g n=%d | %s | 1/(1+theta)=%.3f' % (key[0], key[1], key[2], len(g), ' | '.join(line), 1/(1+th)))
print('\nB. law rel ~ 1/(1+theta), theta = log N/log(q T/2 pi): rel*(1+theta) for zeta, chi4, chi5 over all windows (mean, sd)')
for n in ('20', '400', '2000', '20000'):
    v = []
    for r in rows:
        if r['obj'] in ('zeta', 'chi4', 'chi5') and n in r['rel']:
            th = math.log(int(n))/math.log(COND[r['obj']]*r['T']/(2*math.pi)); v.append(r['rel'][n][MU]*(1+th))
    print('N=%s: n=%d mean %.3f sd %.3f min %.3f max %.3f' % (n, len(v), np.mean(v), np.std(v), min(v), max(v))); out['law_N%s' % n] = [len(v), float(np.mean(v)), float(np.std(v)), float(min(v)), float(max(v))]
print('\nC. DH, H = 4, heights >= 1e4: off-line zeros by sub-box (offsets -12..12 step 4 from the centre), rel(20000), same window for zeta and chi5')
idx = {(r['obj'], round(r['T'], 1), r['H']): r for r in rows}
for T in (10000, 100000, 1000000):
    try: d = json.load(open('out/dhbox_%d.json' % T))
    except Exception: continue
    for w in d['windows']:
        c = round(w['centre'], 1); k = ('dh', c, 4.0)
        if k not in idx: continue
        cnt = [int(round(x)) for x in w['sub_box_counts']]
        print('centre %-10g boxes %s central(|d|<=4) %d | dh %.3f zeta %.3f chi5 %.3f' % (c, cnt, cnt[2]+cnt[3], idx[k]['rel']['20000'][MU], idx[('zeta', c, 4.0)]['rel']['20000'][MU], idx[('chi5', c, 4.0)]['rel']['20000'][MU]))
        out['dhbox|%g' % c] = {'boxes': cnt, 'dh': idx[k]['rel']['20000'][MU], 'zeta': idx[('zeta', c, 4.0)]['rel']['20000'][MU], 'chi5': idx[('chi5', c, 4.0)]['rel']['20000'][MU]}
json.dump(out, open('c1_summary.json', 'w'), indent=1)
