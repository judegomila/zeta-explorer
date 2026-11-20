# first K ordinates of zeta zeros as text (python-flint, 40 digits); no repo data used
import sys, flint
K = int(sys.argv[1]) if len(sys.argv) > 1 else 2000
flint.ctx.prec = 160
try:
    zs = flint.acb.zeta_zeros(1, K)
except Exception as e:
    print("zeta_zeros failed", e, file=sys.stderr)
    zs = [flint.acb.zeta_zero(n) for n in range(1, K + 1)]
with open("zeros.txt", "w") as f:
    for z in zs:
        f.write(z.imag.str(30, radius=False) + "\n")
print("wrote", len(zs), "zeros; last", zs[-1].imag.str(20))
