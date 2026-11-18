import json, glob
def f(v, err):
    if err: return 'n/c'
    return 'none' if v is None else ('all' if v < 6e-4 else f'>{v:.3f}')
for func in ('zeta', 'twist', 'liou', 'Ea'):
    print(f'\n### {func}\n| T | L/L* | L | N=e^L | base M1 | M1 pair | M1 gap | M2(3/8) pair | M2(3/8) gap | base M2(1/2) | M2(1/2) pair | M2(1/2) gap |\n|---|---|---|---|---|---|---|---|---|---|---|---|')
    for T in (1e2, 1e3, 1e4, 1e5, 1e6):
        for fac in (0.25, 0.5, 1, 2):
            try: d = json.load(open(f'out/lp_{func}_{T:g}_{fac:g}.json'))
            except FileNotFoundError: continue
            r = {x['model']: x for x in d['rows']}
            def g(m, k): return f(r[m].get(k), 'error' in r[m] and k not in r[m])
            def b(m): return 'n/c' if 'base_s' not in r[m] else ('feas' if r[m]['base_s'] <= 1e-9 else f"infeas {r[m]['base_s']:.1e}")
            print(f"| {T:g} | {fac:g} | {d['L']:.2f} | {d['N']:.1f} | {b('M1')} | {g('M1','pair')} | {g('M1','gap')} | {g('M2_3/8','pair')} | {g('M2_3/8','gap')} | {b('M2_1/2')} | {g('M2_1/2','pair')} | {g('M2_1/2','gap')} |")
            if func == 'Ea':
                for m in ('M1', 'M2_1/2'):
                    if 'scan_true_pos' in r[m]: print('|  |  |  |  | scan', m, {k: ('F' if v <= 1e-9 else f'{v:.0e}') for k, v in r[m]['scan_true_pos'].items()}, '|')
