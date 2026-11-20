"""zero ordinate lists (decimal strings) for the eigen-angle checks: ZETA (Arb zeta_zeros), DH (battery table, on-line)."""
import json, sys
from flint import acb, arb, ctx
ctx.prec = 200
K = int(sys.argv[1])
z = acb.zeta_zeros(1, K)
json.dump([x.imag.str(45, radius=False) for x in z], open('zeros_ZETA.json', 'w'))
try:
    d = json.load(open('../s3-lacunary-pick-ghost-index/dh_zeros.json'))
    json.dump(d['online'], open('zeros_DH.json', 'w')); json.dump(d['offline'], open('zeros_DH_off.json', 'w'))
except Exception as e: print('dh', e)
print('ok', z[0].imag.str(20), z[-1].imag.str(20))
