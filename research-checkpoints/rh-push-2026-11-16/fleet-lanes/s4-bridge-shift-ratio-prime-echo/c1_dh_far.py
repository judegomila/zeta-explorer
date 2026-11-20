"""DH row of combination (1): negative values of D_N(x, t) inside / outside the half-disks |x + i(t - gamma)| < delta of the off-line zeros,
and the exact Re(F'/F) (Arb) at the same points. usage: c1_dh_far.py out/dh_1e7_raw.npz"""
import sys, json, numpy as np
from flint import acb, arb, ctx
import lib, echo
ctx.prec = 80
z = np.load(sys.argv[1]); X = np.array(echo.X); dz = [(float(b) - 0.5, float(g)) for b, g, _ in json.load(open('dh_zeros.json'))['offline']]
o = lib.DH(); res = []
for H in ['100', '1000']:
    t = z['t_' + H]
    m = np.zeros((len(t), len(X)), bool)
    for de, g in dz: m |= (X[None, :] ** 2 + (t[:, None] - g) ** 2) < de * de
    ex = np.array([[float(lib.logder(o, acb(arb(float(x)), arb(float(v)))).real.mid()) for x in X] for v in t])
    row = dict(H=H, window=[float(t[0]), float(t[-1])], points=int(m.size), in_disks=int(m.sum()), exact_neg=int((ex <= 0).sum()), exact_neg_outside=int(((ex <= 0) & ~m).sum()), by_N={})
    for N in ['1000', '100000', '1e+07']:
        for var in ['sharp', 'fejer']:
            D = z['%s|%s|%s' % (H, var, N)][:, :len(X)]
            row['by_N']['%s|%s' % (var, N)] = dict(neg=int((D <= 0).sum()), neg_outside=int(((D <= 0) & ~m).sum()), sign_agree_with_exact=float(((D > 0) == (ex > 0)).mean()),
                                                   max_x_neg_outside=float(max([X[j] for i, j in zip(*np.nonzero((D <= 0) & ~m))] or [0])))
    res.append(row); print(json.dumps(row))
json.dump(res, open(sys.argv[1].replace('_raw.npz', '_far.json'), 'w'), indent=1)
