# zq_zeros.py: two consecutive zeta zeros nearest each window centre (Arb zeta_zeros). usage: python zq_zeros.py T0 S NW out.json
import sys, json, time
from flint import arb, acb, ctx
ctx.prec = 128
T0 = float(sys.argv[1]); S = float(sys.argv[2]); NW = int(sys.argv[3])
out = {}
t0 = time.time()
for w in range(NW):
    tw = T0 + S * w
    z = acb(arb(1) / 4, arb(tw) / 2)
    th = z.lgamma().imag - arb(tw) / 2 * arb.pi().log()
    n0 = int((th / arb.pi()).mid().floor().unique_fmpz()) + 1
    zs = acb.zeta_zeros(n0, 2)
    out[str(w)] = [zs[0].imag.str(40), zs[1].imag.str(40)]
    print(w, n0, zs[0].imag.str(15), zs[1].imag.str(15), "t=%.1fs" % (time.time() - t0), flush=True)
json.dump(out, open(sys.argv[4], "w"))
