# DH: direct Hurwitz evaluation against the reflected form (functional equation) at points left of Re u = 1/2
import table11 as T
from flint import arb, acb, ctx
ctx.prec = 256
c = T.ctrl('DH')
for u in (acb(arb(-3)/2, arb(85)), acb(arb(-3), arb('85.5')), acb(arb(-12), arb(86)), acb(arb(1)/4, arb(84))):
    a = T.jets(c.dh_direct(u)); b = T.jets(c.dh_reflected(u))
    print(u, [ (float(abs(x - y).mid() + abs(x-y).rad()), float(abs(x).mid())) for x, y in zip(a, b)], [ (x-y).real.contains(0) and (x-y).imag.contains(0) for x, y in zip(a, b)])
import time
t0 = time.time(); w = acb(arb(-12, arb('1e-3')), arb(86, arb('1e-3'))); print('wide ball reflected:', T.jets(c.dh_reflected(w))[0], time.time() - t0)
print('wide ball direct:', T.jets(c.dh_direct(w))[0])
