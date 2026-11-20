# c1_analyze.py : tables for combination 1 from out_c1/c1_*.json
import json, glob, math, sys, numpy as np
TB = '../c12-control-battery-harness/tables/'
def offl(nm, key=1):
    d = json.load(open(TB+'zeros_%s.json' % nm)); return [(float(r[1]), float(r[0])) for r in d['offline']] if nm.startswith('HEAT') else [(float(r[1]), float(r[0])-0.5) for r in d['offline']]
OFF = {'dh': offl('DH'), 'heat0.1': offl('HEAT--0.1'), 'heat0.5': offl('HEAT--0.5')}
rows = []
for f in sorted(glob.glob('out_c1/c1_*.json')):
    d = json.load(open(f))
    for c in d['cases']:
        r = {x['N']: x for x in c['rows']}
        near = None
        if c['obj'] in OFF and c['center'] < 1950:
            dd = sorted([(abs(t-c['center'])/c['H'], t, e) for t, e in OFF[c['obj']]])[0]; near = dd
        rows.append({'obj': c['obj'], 'T': c['center'], 'H': c['H'], 'mean_absF2': c['mean_absF2'], 'absmeanF2_over_meanabsF2': (c['meanF'][0]**2+c['meanF'][1]**2)/c['mean_absF2'],
                     'rank': c['rank_final'], 'rel': {n: r[n]['rel'] for n in r}, 'near_off': near, 'orth': max(x.get('orth', 0) for x in c['rows'])})
json.dump(rows, open('c1_table.json', 'w'))
def fmt(r, mu='1e-08'):
    ns = [1, 20, 400, 2000, 20000]
    return ' '.join('%.3f' % r['rel'][n][mu] for n in ns if n in r['rel'])
sel = sys.argv[1] if len(sys.argv) > 1 else ''
print('obj T H | rel(mu=1e-8) at N=1,20,400,2000,20000 | rel(20000) at mu=1e-4,1e-10 | theta=logN/log(T/2pi) at 20000 | nearest off-line zero (dist/H, t, eta)')
for r in sorted(rows, key=lambda r: (r['H'], r['T'], r['obj'])):
    if sel and sel not in r['obj']: continue
    th = math.log(20000)/math.log(r['T']/(2*math.pi))
    last = r['rel'].get(20000) or r['rel'][max(r['rel'])]
    print('%-11s %10.1f %3d | %s | %.3f %.3f | %.2f | %s' % (r['obj'], r['T'], r['H'], fmt(r), last['0.0001'], last['1e-10'], th, ('%.2f %.1f %.3f' % r['near_off']) if r['near_off'] else '-'))
