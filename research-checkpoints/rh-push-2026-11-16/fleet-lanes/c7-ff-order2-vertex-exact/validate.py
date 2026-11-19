"""Exact validation of the closed forms in ffx.c against the definitions (brute force)."""
import sys
from exact import *
def bf_elem(R, counts):
    q = R.q; r = R.zero()
    for a in range(6):
        for b in range(q): r[(q * a + 6 * b) % R.n] += counts[a * q + b]
    return r
tot = bad = 0
for q, cases in ((7, [(0,1),(0,2),(0,3),(1,1),(1,2),(1,3),(1,4),(2,1),(2,2),(2,3),(2,4),(3,2),(3,3)]), (13, [(0,2),(1,1),(1,2),(2,2),(1,3)])):
    R = Ring(q)
    for d, k in cases:
        ck = load_ck(q, d, k)
        for line in run(['bfck', q, d, k]).split('\n'):
            if not line: continue
            t = [int(x) for x in line.split()]; m = t[0]; ref = bf_elem(R, t[1:])
            val = R.zero()
            for key, z in ck.get(m, {}).items(): val = R.add(val, R.mul(R.keymono(key), R.from_z6(z6to6(z))))
            tot += 1
            if not R.eq(val, ref): bad += 1; print('MISMATCH ck', q, d, k, m)
        print('ck', q, d, k, 'ok so far: total', tot, 'bad', bad, flush=True)
    rows = [(1,2,0,0,0,0,0,0),(2,2,0,0,2,3,3,0),(2,3,0,0,2,3,3,0),(2,2,1,0,2,3,3,0),(3,1,2,0,2,3,3,0),(1,2,1,0,3,5,3,0),(2,2,0,3,2,3,10,0),(2,2,1,2,5,0,0,0),(0,3,0,0,2,3,2,0),(3,2,1,0,3,5,2,0)] if q == 7 else [(1,2,0,0,2,3,3,0),(1,1,1,0,2,3,3,0)]
    for d, N, lam, mode, p1, p2, p3, p4 in rows:
        rw = load_row(q, d, N, lam, mode, p1, p2, p3, p4)
        for line in run(['bfrow', q, d, N, lam, mode, p1, p2, p3, p4]).split('\n'):
            if not line: continue
            t = [int(x) for x in line.split()]; m = t[0]; ref = bf_elem(R, t[1:])
            val = R.mul(R.Gpow(2, N + lam), R.from_z6(z6to6(rw[m])))
            tot += 1
            if not R.eq(val, ref): bad += 1; print('MISMATCH row', q, d, N, lam, mode, m)
        print('row', q, (d, N, lam, mode, p1, p2, p3), 'total', tot, 'bad', bad, flush=True)
print('TOTAL', tot, 'BAD', bad)
