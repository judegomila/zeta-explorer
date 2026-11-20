import sys, json, math, numpy as np
R = json.load(open(sys.argv[1]))
BLO, BW, NB = R['hist_bins']
print(f"phi grid: step {R['meta']['dphi'] / R['meta']['fine']}, phi <= {R['meta']['phimax']}; V = Re R - Re Pole - beta_F")
print('| P | family | part | points | max V | argmax phi | frac V>0 | mean V | sd | min V | max V on 1<=phi<=21.4 | V>0 there |')
print('|---|---|---|---|---|---|---|---|---|---|---|---|')
for row in R['checks']:
    for key, f in row['fams'].items():
        fam, part = key.split(':')
        if part == 'primes' and not R['meta'].get('split', 1):
            continue
        lw = f['low']
        print(f"| {row['P']:.0e} | {fam} | {part} | {f['n']:.2e} | {f['max']:+.4f} | {f['argmax']:.2f} | {f['frac_pos']:.3e} | {f['mean']:+.3f} | {f['std']:.3f} | {f['min']:+.2f} | {lw['mx']:+.4f} | {lw['pos']}/{lw['n']} |")
