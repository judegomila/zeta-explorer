from flint import acb, arb, ctx
import json
ctx.prec = 80
N = 900
zs = acb.zeta_zeros(1, N)
g = [float(z.imag.mid()) for z in zs]
json.dump(g, open('zeta_zeros_900.json','w'))
print('zeros', N, 'max height', g[-1])
gaps = sorted((g[i+1]-g[i], g[i], g[i+1]) for i in range(N-1))
for d,a,b in gaps[:25]: print('gap %.4f  at %.4f %.4f  isolated-pair collision tau ~ %.4f' % (d,a,b,-d*d/2))
# running minimum gap by height
m = 9
for i in range(N-1):
    d = g[i+1]-g[i]
    if d < m: m = d; print('record gap %.4f at %.3f (tau_c ~ %.3f)' % (d, g[i], -d*d/2))
