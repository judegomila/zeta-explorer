"""Rigorous enclosures of the first N zeta zeros (Arb acb_dirichlet_zeta_zeros:
isolates the n-th zero on the critical line, counting verified)."""
import sys, json, time
from flint import acb, ctx
N = int(sys.argv[1]); ctx.prec = 96
t0 = time.time(); out = []
B = 500
for start in range(1, N + 1, B):
    for z in acb.zeta_zeros(start, min(B, N + 1 - start)):
        assert z.real == 0.5 or (z.real - 0.5).is_zero() or abs((z.real-0.5).mid()) == 0
        im = z.imag
        out.append([im.lower().str(30, radius=False), im.upper().str(30, radius=False)])
json.dump({"N": N, "prec": 96, "enclosures": out}, open(f"zeros_{N}.json", "w"))
print("done", N, time.time() - t0, out[0], out[-1])
