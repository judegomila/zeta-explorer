# aggregate the float stage; write the ball point list; after the ball stage, merge and print tables
import json, glob, sys, math, collections
import numpy as np
def cname(o): return o[0] if o[0] not in ('ZQ',) else 'ZQ%g' % o[1]
ORDER = ['zeta', 'EA', 'DEL', 'HQ2', 'HQ3', 'HQ4', 'ZQ0.01', 'ZQ0.1', 'chain', 'LIOU', 'TNR', 'DH', 'haar']
rows = []
for f in sorted(glob.glob('mixed_*.jsonl')):
    for l in open(f): rows.append(json.loads(l))
seen = {}
for r in rows: seen[(r['t'], r['theta'], r['w'], tuple(r['obj']))] = r
rows = list(seen.values())
G = collections.defaultdict(list)
for r in rows: G[(r['t'], r['theta'], cname(r['obj']))].append(r)
ball = {}
for f in sorted(glob.glob('ball_*.jsonl')):
    for l in open(f):
        b = json.loads(l)
        if 'T2n' in b: ball[(b['t'], b['theta'], b['w'], tuple(b['obj']), b['tau'], b.get('prec', 128))] = b
cells = sorted({(k[0], k[1]) for k in G})
pts = []; table = []
for t, th in cells:
    for c in ORDER:
        g = G.get((t, th, c))
        if not g: continue
        mn = min(g, key=lambda r: r['m'])
        nfail = sum(1 for r in g if r['m'] < 0)
        members = collections.defaultdict(list)
        for r in g: members[tuple(r['obj'])].append(r)
        mem_fail = sum(1 for v in members.values() if any(r['m'] < 0 for r in v))
        kap = [r['kappa'] for r in g if r['kappa'] is not None]
        b = ball.get((t, th, mn['w'], tuple(mn['obj']), mn['tau_min'], 128))
        b2 = ball.get((t, th, mn['w'], tuple(mn['obj']), mn['tau_min'], 256))
        row = {'t': t, 'theta': th, 'cls': c, 'P': mn['P'], 'n_windows': len(g), 'members': len(members), 'members_failing': mem_fail,
               'windows_failing': nfail, 'min_m': mn['m'], 'argmin': [mn['obj'], mn['w'], mn['tau_min']], 'T1n_at_min': mn['T1n_at_min'],
               'parts_at_min': mn['parts_at_min'], 'median_window_min': float(np.median([r['m'] for r in g])),
               'neg2_mean': float(np.mean([r['neg2'] for r in g])), 'neg1_mean': float(np.mean([r['neg1'] for r in g])), 'minT1n': min(r['minT1n'] for r in g),
               'kappa_max': max(kap) if kap else None, 'Q1_sd': float(np.mean([r['Q1_sd'] for r in g])), 'Q1_mean': float(np.mean([r['Q1_mean'] for r in g])),
               'Q2_sd': float(np.mean([r['Q2_sd'] for r in g])), 'Q2a_sd': float(np.mean([r['Q2a_sd'] for r in g])), 'Q2b_sd': float(np.mean([r['Q2b_sd'] for r in g])),
               'Q2_mean': float(np.mean([r['Q2_mean'] for r in g])),
               'meanT2n': float(np.mean([r['meanT2n'] for r in g])), 'q01': float(np.mean([r['q01'] for r in g])),
               'dS1_vs_zeta_min': min((r['dS1_vs_zeta'] for r in g if r['dS1_vs_zeta'] is not None), default=None),
               'deleted_below_P': mn.get('deleted_below_P'),
               'ball_T2n': b['T2n'] if b else None, 'ball_rad': b['T2n_rad'] if b else None, 'ball_sign': b['sign2'] if b else None,
               'float_minus_ball': (mn['m'] - b['T2n']) if b else None, 'ball256_T2n': b2['T2n'] if b2 else None, 'ball256_rad': b2['T2n_rad'] if b2 else None}
        if c == 'chain' or c == 'haar':
            mm = sorted(min(r['m'] for r in v) for v in members.values())
            row['member_min_range'] = [mm[0], mm[len(mm) // 2], mm[-1]]
            kk = [max((r['kappa'] for r in v if r['kappa'] is not None), default=None) for v in members.values()]
            row['member_kappa'] = sorted(x for x in kk if x is not None)
        row['verdict'] = ('UNDECIDED (no ball)' if not b else ('UNDECIDED' if b['sign2'] == 'undecided' else ('FAIL' if b['sign2'] == 'neg' else ('PASS' if nfail == 0 else 'INCONSISTENT'))))
        table.append(row)
        if not b and len(G[(t, th, 'zeta')]) == 24: pts.append({'t': t, 'theta': th, 'w': mn['w'], 'obj': mn['obj'], 'tau': mn['tau_min'], 'float_T2n': mn['m'], 'float_T1n': mn['T1n_at_min'], 'prec': 128})
json.dump(table, open('aggregate.json', 'w'), indent=1)
if len(sys.argv) > 1:
    todo = [p for p in pts if p['obj'][0] != 'ZQ']
    json.dump(todo, open(sys.argv[1], 'w'))
    # doubled-precision sample: every 7th point
    json.dump([dict(p, prec=256) for p in todo[::7]], open(sys.argv[1].replace('.json', '_256.json'), 'w'))
    print('ball points', len(todo), '256-bit sample', len(todo[::7]))
def f(x, d=4): return '-' if x is None else (('%.' + str(d) + 'f') % x)
print('| t | theta\' | P | class | windows (members) | windows with m<0 (members) | min m (float) | ball value at argmin | ball radius | verdict | T1/(c0 Lg) at argmin | neg fraction T2 | neg fraction T1 | kappa |')
print('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|')
for r in table:
    print('| %g | %g | %d | %s | %d (%d) | %d (%d) | %s | %s | %s | %s | %s | %.2e | %.2e | %s |' % (r['t'], r['theta'], r['P'], r['cls'], r['n_windows'], r['members'], r['windows_failing'], r['members_failing'],
          f(r['min_m']), f(r['ball_T2n'], 6), '-' if r['ball_rad'] is None else '%.1e' % r['ball_rad'], r['verdict'], f(r['T1n_at_min']), r['neg2_mean'], r['neg1_mean'], f(r['kappa_max'], 3)))
print()
print('| t | theta\' | class | Q1 mean/(R u) | Q1 sd/(R u) | Q2 sd/u^2 | Q2a sd | Q2b sd | Q2 mean/u^2 | mean T2/(c0 Lg^2) | max abs(S1 - S1_zeta)/c0 (min over windows) | deleted primes |')
print('|---|---|---|---|---|---|---|---|---|---|---|---|')
for r in table:
    print('| %g | %g | %s | %.4f | %.4f | %.4f | %.4f | %.4f | %.4f | %.4f | %s | %s |' % (r['t'], r['theta'], r['cls'], r['Q1_mean'], r['Q1_sd'], r['Q2_sd'], r['Q2a_sd'], r['Q2b_sd'], r['Q2_mean'], r['meanT2n'], '-' if r['dS1_vs_zeta_min'] is None else '%.3g' % r['dS1_vs_zeta_min'], r['deleted_below_P'] if r['deleted_below_P'] is not None else '-'))
