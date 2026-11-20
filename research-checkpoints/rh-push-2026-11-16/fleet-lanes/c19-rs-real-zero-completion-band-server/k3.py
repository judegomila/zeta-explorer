# k3.py TAG T0 THETA W : direct ball sums over prime powers n <= X_theta at two nodes, against the engine moments (zeta and chain00).
import sys, json, math, time
import numpy as np
from flint import arb, acb, ctx
import tz
from rsc import *
from comp import files_for
ctx.prec = 128
M64 = (1 << 64) - 1
def splitmix(x):
    x = (x + 0x9E3779B97F4A7C15) & M64
    x = ((x ^ (x >> 30)) * 0xBF58476D1CE4E5B9) & M64
    x = ((x ^ (x >> 27)) * 0x94D049BB133111EB) & M64
    return x ^ (x >> 31)
tag, T0, th, w = sys.argv[1], float(sys.argv[2]), sys.argv[3], int(sys.argv[4])
cfg = json.load(open("bounds.json"))[tag]
Xb = cfg["theta"][th]
main, bnd = files_for(tag)
tw = T0 + S_WIN * w
ys = [-37.25, 11.0625]
print("planned: sieve of odd numbers to", Xb, "=", Xb // 2 / 1e9, "GB", flush=True)
sv = np.ones(Xb // 2 + 1, dtype=bool)
sv[0] = False
for i in range(3, int(math.isqrt(Xb)) + 1, 2):
    if sv[i // 2]:
        sv[i * i // 2::i] = False
primes = np.concatenate(([2], 2 * np.nonzero(sv)[0] + 1))
primes = primes[primes <= Xb]
del sv
print("primes", len(primes), flush=True)
tau = [arb(tw) + arb(y) for y in ys]
acc = [[acb(0), acb(0)] for _ in ys]     # zeta, chain00
sabs = arb(0)
mi = acb(0, -1)
t0 = time.time()
for p in primes:
    p = int(p)
    lp = arb(p).log()
    sgn = -1 if (splitmix((p * 0x9E3779B97F4A7C15 + 121000) & M64) >> 63) else 1
    pk = p
    k = 1
    while pk <= Xb:
        amp = lp / arb(pk).sqrt()
        sabs += amp
        ln = k * lp
        s = sgn if (k & 1) else 1
        for i in range(len(ys)):
            e = (mi * tau[i] * ln).exp() * amp
            acc[i][0] += e
            acc[i][1] += e * s
        pk *= p
        k += 1
print("direct sums done t=%.0fs" % (time.time() - t0), "sum amp", float(sabs.mid()), "bound 2.08 sqrt X", 2.08 * math.sqrt(Xb), flush=True)
for o, name in ((0, "zeta"), (2, "chain00")):
    Mc, ac = cellsum(main, bnd, o, w, Xb)
    d0, _ = meval(Mc, ac, np.array(ys))
    for i, y in enumerate(ys):
        a = acc[i][0 if o == 0 else 1]
        diff = abs(complex(float(a.real.mid()), float(a.imag.mid())) - d0[i])
        print(json.dumps({"tag": tag, "theta": th, "w": w, "obj": name, "y": y, "engine": [d0[i].real, d0[i].imag], "direct": [a.real.str(20), a.imag.str(20)],
                          "abs_diff": diff, "radius_used": prime_rad(Xb, abs(y)), "direct_rad": float(a.real.rad())}), flush=True)
print("K3 DONE", flush=True)
