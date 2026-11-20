# Formats prime_side_test_<N>_<NPTS>.json as markdown tables (stdout). Usage: make_table.py file.json
import json, sys
d = json.load(open(sys.argv[1]))
fams = d['families']; Xs = d['X_values']
def tab(block, title):
    print(f'{title}\n')
    print('| family | ' + ' | '.join(f'X = {x:.4g}: neg; min ratio; median' for x in Xs) + ' |')
    print('|---|' + '---|'*len(Xs))
    for f in fams:
        row = []
        for x in Xs:
            r = block[f'{f}|X={x:.6g}']
            row.append(f"{r['frac_negative']:.4f}; {r['min_ratio']:.4f}; {r['median_ratio']:.4f}")
        print(f'| {f} | ' + ' | '.join(row) + ' |')
    print()
tab(d['random'], f"Random points (N = {d['N']}, {d['npoints']} points, {d['seconds']:.0f} s):")
for k in d:
    if k.startswith('targeted'):
        tab(d[k], k.replace('_', ' ') + ':')
print('Fraction negative and minimum ratio by height decade, shortest and longest test:\n')
keys = [f'{f}|X={Xs[j]:.6g}' for f in fams for j in (0, len(Xs)-1)]
print('| decade of t | ' + ' | '.join(keys) + ' |'); print('|---|' + '---|'*len(keys))
for dec, v in d['by_decade_frac_negative_and_min'].items():
    print(f'| {dec} | ' + ' | '.join(f'{v[k][0]:.3f}; {v[k][1]:.3f}' for k in keys) + ' |')
