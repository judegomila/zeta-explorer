from flint import arb, acb, ctx
import core, hankel, sys
sys.path.insert(0, '../s3-lacunary-pick-ghost-index')
for prec in (2000, 3000):
    ctx.prec = prec
    s = hankel.moments0('HEAT-0.5', 30)
    print(prec, 'tail', core.taylor_F.heat_tail, [x.str(12) for x in s[:4]])
    f = core.taylor_F('HEAT-0.5', 0, 6); print([x.str(15) for x in f[:5]])
ctx.prec = 400
import lib
h = lib.Heat(-0.5)
v, d = h.val_der(arb(0)); print('s3 quadrature F(0)', v.str(15))
v2, d2 = h.val_der(arb('0.3')); print('F(0.3)', v2.str(15), 'taylor', sum(f[k] * arb('0.3') ** k for k in range(6)).str(15))
# zero check at the tabulated off-line zero through the Taylor data at a = 20 is not possible; check F(20) instead
ctx.prec = 3000
f20 = core.taylor_F('HEAT-0.5', 20, 4)
ctx.prec = 400
v3, d3 = h.val_der(arb(20)); print('F(20)', v3.str(20), f20[0].str(20), 'F\'(20)', d3.str(20), f20[1].str(20))
