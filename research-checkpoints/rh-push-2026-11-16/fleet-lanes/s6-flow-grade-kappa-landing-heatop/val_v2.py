"""comparison of a version-1 moment table (absolute cut of the theta sum) with a version-2 table (relative cut): relative differences by order,
and whether each version-2 value lies in the ball assigned to the version-1 value by jl.Tables.arbs.  Usage: val_v2.py V1.pkl V2.pkl"""
import sys, pickle, math
from flint import arb, ctx
import jl
A = pickle.load(open(sys.argv[1], 'rb')); B = pickle.load(open(sys.argv[2], 'rb')); T = jl.Tables(sys.argv[1]); ctx.prec = A['prec'] + 100
print('versions', A.get('kversion', 1), B.get('kversion'), 'prec', A['prec'], 'jmax', A['jmax'])
for key in B['tables']:
    if key not in A['tables']: continue
    a = A['tables'][key]; b = B['tables'][key]; balls = T.arbs(key); sc = arb(2) ** (-A['prec']); viol = 0; rows = []
    for m in range(len(a)):
        d = abs(a[m] - b[m]); rel = (d.bit_length() - abs(b[m]).bit_length()) if d else -10 ** 6
        if not (abs(arb(b[m]) * sc - balls[m].mid()) <= balls[m].rad()): viol += 1
        if m % max(1, len(a) // 10) == 0 or m == len(a) - 1: rows.append('%d: 2^%d' % (m, rel))
    print(key, 'entries', len(a), '; version-2 values outside the assigned balls:', viol, '; relative difference by index:', ', '.join(rows))
