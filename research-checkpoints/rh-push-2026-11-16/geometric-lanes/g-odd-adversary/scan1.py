# One-node odd Loewner sign: D(t) = f'^2 - f f'' + f f'/t  (C_-(t,t) = alpha/pi * D).
# Scan xi and DH; report certified negative points (Arb ball strictly < 0).
import sys, json
from lib import *
ctx.prec = 400
kind = sys.argv[1]; T = float(sys.argv[2]); h = float(sys.argv[3])
neg = []; mn = None; n = int(T/h)
amb = 0
runs = []; cur = None
for i in range(1, n+1):
    t = arb(i)*arb(str(h))
    j = JET[kind](t)
    D = j[1]*j[1] - j[0]*j[2] + j[0]*j[1]/t
    R = D/(j[0]*j[0] + j[1]*j[1])
    if R < 0:
        if cur is None: cur = [float(t.mid()), float(t.mid()), float(R.mid()), float(t.mid())]
        cur[1] = float(t.mid())
        if float(R.mid()) < cur[2]: cur[2] = float(R.mid()); cur[3] = float(t.mid())
    else:
        if not (R > 0): amb += 1
        if cur is not None: runs.append(cur); cur = None
    r = float(R.mid())
    if mn is None or r < mn[0]: mn = (r, float(t.mid()))
if cur: runs.append(cur)
print(kind, 'T', T, 'h', h, 'points', n, 'ambiguous', amb, 'min R', mn)
print('negative runs [t_start,t_end,minR,argmin]:', len(runs))
for r in runs[:60]: print('  ', r)
json.dump({'kind': kind, 'T': T, 'h': h, 'ambiguous': amb, 'minR': mn, 'neg_runs': runs}, open(f'scan1_{kind}.json', 'w'))
