import numpy as np, math
from flint import acb, arb, ctx, acb_series
import ctl, core
ctx.prec = 100
X = 200000
for code, s in (('DH', 3.0), ('TNR', 3.0), ('EA-1/4', 3.0), ('ZETA', 3.0)):
    v, c = ctl.coeffs(code, X)
    val = np.sum(c * np.exp(-(s - 0.5) * v))
    obj = core.by_code(code); x = acb_series([acb(s), 1], prec=2); y = obj.value(x); ref = -(y[1] / y[0])
    print(code, 'sum Lambda n^-s (n<=%d)' % X, val, 'ref -F\'/F(%g)' % s, float(ref.real.mid()))
v, c = ctl.coeffs('DH', X); n = np.arange(2, X + 1)
print('DH |Lambda(n)|/n^theta growth: max |c_n| by decade', [float(np.abs(c[(n >= 10 ** k) & (n < 10 ** (k + 1))]).max()) for k in range(1, 5)])
