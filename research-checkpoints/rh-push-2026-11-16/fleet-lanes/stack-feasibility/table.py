import json, glob, numpy as np
def f(x): return 'feasible' if x is None else ('all' if x < 2e-3 else f'> {x:.3f}')
for mode in ('high', 'low1000', 'low15000'):
    fs = sorted(glob.glob(f'cg_{mode}_*.json'), key=lambda s: float(s.split('_')[-1][:-5]))
    print(f'\n{mode}:  excluded delta ("all" = every delta >= 0.001 excluded; "feasible" = no exclusion up to the model limit)')
    print('| L | N = e^L | M1 pair | M1 gap | M2(3/8) pair | M2(3/8) gap | M2(1/2) pair | M2(1/2) gap |'); print('|---|---|---|---|---|---|---|---|')
    for fn in fs:
        c = json.load(open(fn)); r = {x['model']: x for x in c['rows']}
        if len(r) < 3: print(f"| {c['L']:g} | incomplete |"); continue
        print(f"| {c['L']:g} | {np.exp(c['L']):.3g} | " + ' | '.join(f(r[m].get(p)) for m in ('M1', 'M2_3/8', 'M2_1/2') for p in ('pair', 'gap')) + ' |')
        bs = [r[m]['base_s'] for m in r]; assert max(bs) == 0, bs
print()
for r in json.load(open('min_offline.json')):
    print(r)
rows = json.load(open('surgery2.json'))
for fn in sorted(glob.glob('surgery2_1*.json')): rows += json.load(open(fn))
print('\nresidual sup|E| vs K:')
for L, d in ((6.0, 0.1), (6.0, 0.3), (8.0, 0.1), (10.0, 0.02), (12.0, 0.02), (14.0, 0.02), (16.0, 0.02)):
    print(L, d, {r['K']: f"{r['sup_E']:.1e}" for r in rows if r['L'] == L and r['delta'] == d})
