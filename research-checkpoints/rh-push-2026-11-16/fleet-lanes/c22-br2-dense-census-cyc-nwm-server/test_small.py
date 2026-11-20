import numpy as np, math, sets, subprocess
exec(open('gen_cycp.py').read())
r = sets.Row(name='c', kind='CYC', phase='pi', Lmax=32 * 2 ** 18); print('CYC', r.count)
t, c = sets.heights(r, 2000, 1e-5); print(len(t), np.bincount(c), t[:3], t.max())
r = sets.Row(name='c', kind='CYCP', phase='pi', Lmax=32 * 2 ** 18); print('CYCP', r.head_lam[:7] / (2.0 ** np.arange(7) * math.log(3)) - 1)
for kind in ('D1', 'D2', 'D4', 'DE'):
    for rs in (None, 1):
        r = sets.Row(name='x', kind=kind, phase='rand', pseed=1, rseed=rs, Lmax=64.0)
        l, th = r.chunk(0, r.count)
        print(kind, rs, 'head', r.nh, 'tail', r.tail0, r.tail1, 'count', r.count, 'first', r.head_p[:8], 'mono', bool(np.all(np.diff(l) > 0)), l[r.nh - 2:r.nh + 2], l[-1])
        t, c = sets.heights(r, 400, 1e-3); print('   heights', len(t), np.bincount(c), t.min(), t.max())
r = sets.Row(name='i', kind='INJ', phase='alt', J=2, Lmax=200.0); print('INJ2', r.count, r.head_lam[:6] / math.log(2))
print(sets.smix(np.arange(5), 1))
