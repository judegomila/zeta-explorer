import time, sys
from bh import *
name, n, dps = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
h = sys.argv[4] if len(sys.argv) > 4 else '0.03'
setprec(dps); o = make_obj(name); t0 = time.time()
T = lag_table(o, h, '0.75', n, dps); t1 = time.time()
rows = levinson_mid(T['mZ']); t2 = time.time()
m, d, worst = certify(toeplitz_mat(T['mZ']), rows); t3 = time.time()
pos = [i+1 for i in range(m) if d[i] > 0]
print(name, 'n', n, 'dps', dps, 'certified', m, 'pos stages', pos[:8], len(pos), 'worst row sum %.2e' % worst, 'min log10|d| %.1f' % min(log10abs(x) for x in d[:m]), 'times table %.1f lev %.1f cert %.1f' % (t1-t0, t2-t1, t3-t2))
