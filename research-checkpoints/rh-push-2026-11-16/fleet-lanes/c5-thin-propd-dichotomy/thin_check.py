"""thin_check.py -- the split-variant thin sets used here: discrepancy pi_S(p) - L(p) over the rational primes p = 1 mod 3
up to the table bound, and density of S among those primes. Usage: python thin_check.py table.npz"""
import sys, json
import numpy as np
import prep
d = np.load(sys.argv[1]); pp = d['pp']; pin = d['pinert']
p1 = np.unique(pp[~pin]); out = {}
for b in (0.99, 0.97, 0.95, 0.90, 0.60):
    mem = prep.thin_set(p1, b)
    c = np.cumsum(mem); D = c - prep.Lfun(p1.astype(float), b)
    row = {'primes_1mod3': int(len(p1)), 'in_S': int(mem.sum()), 'D_min': float(D.min()), 'D_max': float(D.max()),
           'D_min_above_1e4': float(D[p1 > 1e4].min()), 'D_max_above_1e4': float(D[p1 > 1e4].max()),
           'density_last_decade': float(mem[p1 > p1[-1] / 10].mean()), 'first': [int(x) for x in p1[mem][:8]]}
    out[str(b)] = row
    print(b, row)
json.dump(out, open('thin_check.json', 'w'), indent=1)
