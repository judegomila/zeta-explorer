# on-line zeros of the DH function below height T (sign changes of the real function Z(t)); bisection in arb mid arithmetic
import json, sys
from flint import arb, acb, ctx
from lib import f_dh_jet
ctx.prec = 200
def Z(t):
    s = acb(arb(1)/2, t)
    th = (((s+1)/2).lgamma() + (s/2)*(arb(5)/arb.pi()).log()).imag
    return (acb(0, th).exp()*f_dh_jet(s)[0]).real
T = float(sys.argv[1]); h = 0.01
zs = []; t = 0.005; prev = Z(arb(t))
while t < T:
    t2 = t + h; cur = Z(arb(t2))
    if (prev > 0 and cur < 0) or (prev < 0 and cur > 0):
        a, b, fa = arb(t), arb(t2), prev
        for _ in range(150):
            c = arb(((a+b)/2).mid()); fc = Z(c)
            if (fa > 0 and fc > 0) or (fa < 0 and fc < 0): a, fa = c, fc
            else: b = c
        zs.append(a.mid().str(45, radius=False))
    t, prev = t2, cur
json.dump(dict(online=zs, T=T), open('dh_zeros.json', 'w'))
print(len(zs), zs[:5], zs[-3:])
