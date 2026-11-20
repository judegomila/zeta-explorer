#!/usr/bin/env python3
"""Checkpoint generator. usage: mkcp.py XMAX out.txt [per_octave]
Writes sorted unique integer checkpoints x (2 <= x <= XMAX) at which the sieve reports cumulative sums,
and nlists.json with the N lists per statistic."""
import sys, json
from fractions import Fraction
from math import log, floor
X = int(float(sys.argv[1])); out = sys.argv[2]
PO = int(sys.argv[3]) if len(sys.argv) > 3 else 256
def geo(lo, hi, per_oct):
    s = set(); j = 0
    while True:
        v = lo * 2.0 ** (j / per_oct)
        if v > hi: break
        s.add(int(round(v))); j += 1
    return sorted(x for x in s if lo <= x <= hi)
cps = set()
lists = {}
# T88: N, 2N, 4N
n88 = sorted(set(geo(1, X // 4, PO)) | {2 ** k for k in range(0, 64) if 2 ** k <= X // 4} | {10 ** k for k in range(0, 14) if 10 ** k <= X // 4})
lists['T88'] = n88
for N in n88: cps.update((N, 2 * N, 4 * N))
# T91 a=17/9: 81N,153N,289N ; T93 a=23/15: 225N,345N,529N
n91 = sorted(set(geo(1, X // 289, PO)) | {10 ** k for k in range(0, 14) if 10 ** k <= X // 289}); lists['T91'] = n91
for N in n91: cps.update((81 * N, 153 * N, 289 * N))
n93 = sorted(set(geo(1, X // 529, PO)) | {10 ** k for k in range(0, 14) if 10 ** k <= X // 529} | {3 ** k for k in range(0, 30) if 3 ** k <= X // 529}); lists['T93'] = n93
for N in n93: cps.update((225 * N, 345 * N, 529 * N))
# T92: real knots M, c^61 M, c^62 M, c^153 M, c=124/123, M integer
c = Fraction(124, 123)
c61, c62, c153 = c ** 61, c ** 62, c ** 153
n92 = geo(16, int(X / float(c153)) - 1, PO); lists['T92'] = n92
for M in n92:
    cps.update((M, (c61 * M).__floor__(), (c62 * M).__floor__(), (c153 * M).__floor__()))
# generic grid for statistic (4)
g = geo(2, X, 4 * PO); lists['GRID'] = g
cps.update(g)
cps.add(X)
cps = sorted(x for x in cps if 2 <= x <= X)
open(out, 'w').write('\n'.join(map(str, cps)) + '\n')
json.dump(lists, open(out + '.lists.json', 'w'))
print('checkpoints', len(cps), 'max', cps[-1], {k: len(v) for k, v in lists.items()})
