import json, heat_fill_b as hb
from flint import acb, arb, ctx
for prec in (192,):
    hb.PREC = prec; hb.init(-0.1)
    b = json.load(open('heat_b_-0.1.json')); old = json.load(open('../c12-control-battery-harness/tables/zeros_HEAT--0.1.json'))
    rows = []
    for q in b['roots']:
        o = min(old['offline'], key=lambda o: abs(float(o[1]) - float(q[1])))
        d = abs(arb(q[0]) - arb(o[0])) + abs(arb(q[1]) - arb(o[1]))
        rows.append((float(d.mid()), q, o))
    rows.sort(key=lambda r: -r[0])
    for d, q, o in rows[:4]:
        zq = acb(arb(q[0]), arb(q[1])); zo = acb(arb(o[0]), arb(o[1]))
        fq, dq = hb.F(zq); fo, do = hb.F(zo)
        print(prec, 'diff %.2e' % d, 'Re', q[0][:20], 'Im', q[1][:22], '|F/F\'| mine %.1e table %.1e' % (float((abs(fq) / abs(dq)).mid()), float((abs(fo) / abs(do)).mid())))
# the three close on-line zeros where the float interpolation differed
hb.PREC = 192; hb.init(-0.1)
on = [x for x in old['online'] if 1309.2 < float(x) < 1309.3 or 1919.0 < float(x) < 1919.1]
for x in on:
    e = arb(10) ** -20
    s = [hb.F(acb(0, arb(x) + k * e))[0].real for k in (-1, 1)]
    print('on-line', x[:24], 'signs at +-1e-20:', [1 if v > 0 else -1 if v < 0 else 0 for v in s])
