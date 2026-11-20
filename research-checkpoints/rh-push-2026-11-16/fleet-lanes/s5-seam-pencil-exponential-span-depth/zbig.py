import sys, json
from flint import acb, ctx
ctx.prec = 80; n = int(sys.argv[1])
zs = []
for a in range(1, n + 1, 500):
    zs += acb.zeta_zeros(a, min(500, n - a + 1)); print(a, flush=True)
json.dump([float(z.imag.mid()) for z in zs], open('zeta_big.json', 'w')); print(n, float(zs[-1].imag.mid()))
