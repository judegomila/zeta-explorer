import sys, time
from flint import arb, acb, ctx, arb_series
import core
ctx.prec = 3000
N = 400; a = 20
t=time.time(); f = core.taylor_F('ZETA', a, N + 1); print('taylor', time.time()-t)
for k in (0, 100, 200, 400): print('f', k, core._l2(f[k]), core._l2r(f[k]) - core._l2(f[k]))
L = core.logder_series('ZETA', a, N, f); l = L.coeffs()
for k in (0, 100, 200, 399): print('L', k, core._l2(l[k]), core._l2r(l[k]) - core._l2(l[k]))
fm = [x.mid() for x in f]
L2 = core.logder_series('ZETA', a, N, fm); l2 = L2.coeffs()
for k in (0, 100, 200, 399): print('Lmid', k, core._l2(l2[k]), core._l2r(l2[k]) - core._l2(l2[k]), core._l2(l2[k]-l[k].mid()) - core._l2(l2[k]))
c = core.moments_from_L(arb_series([x.mid() for x in l2], prec=N), a, N)
for k in (0, 100, 200, 399): print('c', k, core._l2(c[k]), core._l2r(c[k]) - core._l2(c[k]))
print(type(f[0].mid()))
try:
    import gmpy2; print('gmpy2', gmpy2.version())
except Exception as e: print('no gmpy2', e)
