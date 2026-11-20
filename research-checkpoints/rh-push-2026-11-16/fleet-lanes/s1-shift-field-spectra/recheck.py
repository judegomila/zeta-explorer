"""ball-arithmetic recheck (128 bits) of the sign of Re(completed F'/F) at listed points; argument: json list of [obj, sigma, t]."""
import sys, json
from flint import acb, arb, acb_series, ctx
ctx.prec = 128
def kappa(): return ((10 - 2 * arb(5).sqrt()).sqrt() - 2) / (arb(5).sqrt() - 1)
def hur(x, c):
    tot = 0
    for a in range(1, 5):
        if c[a - 1] != 0: tot = tot + c[a - 1] * x.zeta(arb(a) / 5)
    return tot * (-x * arb(5).log()).exp()
def completed(o, x):
    pi = arb.pi()
    if o == 'ZETA': return x * (x - 1) * (-x / 2 * pi.log()).exp() * (x / 2).gamma() * x.zeta()
    if o == 'LCHI': return (x / 2 * (arb(5) / pi).log()).exp() * (x / 2).gamma() * hur(x, (arb(1), arb(-1), arb(-1), arb(1)))
    if o == 'DH':
        k = kappa(); return (x / 2 * (arb(5) / pi).log()).exp() * ((x + 1) / 2).gamma() * hur(x, (arb(1), k, -k, arb(-1)))
    if o in ('EA18', 'EA14'):
        a = arb(1) / (8 if o == 'EA18' else 4)
        return (x + a) * (x + a - 1) * (x - a) * (x - a - 1) * (-x * pi.log()).exp() * ((x + a) / 2).gamma() * ((x - a) / 2).gamma() * (x + a).zeta() * (x - a).zeta()
    if o == 'TNR':
        l3 = arb(3).log(); c = arb('2.2')
        return (x * l3).exp() * completed('ZETA', x) * (1 + c * ((arb(1) / 2 - x) * l3).exp() + ((1 - 2 * x) * l3).exp())
    raise KeyError(o)
pts = json.load(open(sys.argv[1]))
out = []
for o, sg, t in pts:
    x = acb_series([acb(arb(str(sg)), arb(float(t))), 1], prec=2)
    y = completed(o, x)
    w = (y[1] / y[0]).real
    sign = 'negative' if w < 0 else ('positive' if w > 0 else 'undetermined')
    out.append(dict(obj=o, sigma=sg, t=t, re_logder_mid=float(w.mid()), rad=float(w.rad()), sign=sign))
    print(o, sg, t, w, sign)
json.dump(out, open(sys.argv[2], 'w'), indent=1)
