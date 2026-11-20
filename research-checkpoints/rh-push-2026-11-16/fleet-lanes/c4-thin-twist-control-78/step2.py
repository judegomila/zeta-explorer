# Partial sums of eps(n) and of mu(n) eps(n) up to N; comparison with c x and with the residue term at s = b.
import sys, json, time
import numpy as np, mpmath as mp
from thinlib import *
N = int(float(sys.argv[1])) if len(sys.argv) > 1 else 10**8
print(f"planned memory: two int8 arrays of N+1 = {2*(N+1)/1e9:.2f} GB, one int64 cumsum at a time = {8*(N+1)/1e9:.2f} GB, primes {8*N/np.log(N)*1.2/1e9:.2f} GB; total < {(10*(N+1))/1e9+0.5:.1f} GB", flush=True)
t0 = time.time()
P = []; M = []
for pr, inS, c, Lp in thin_segments(N): P.append(pr); M.append(inS)
P = np.concatenate(P); M = np.concatenate(M)
Sp = P[M]; Np_ = P[~M]
print(f"primes {len(P)}, in S {len(Sp)}, first S primes {Sp[:12].tolist()}  t={time.time()-t0:.0f}s", flush=True)
h = np.ones(N + 1, dtype=np.int8); e = np.ones(N + 1, dtype=np.int8); h[0] = 0; e[0] = 0
# h = mu * eps: factor -1 at primes outside S, +1 at primes in S, 0 on non-squarefree
CUT = N // 64
for p in Np_[Np_ <= CUT]:
    p = int(p); h[p::p] *= -1
big = Np_[Np_ > CUT]
for m in range(1, 64):
    idx = big[big <= N // m] * m
    if len(idx): h[idx] *= -1
for p in P[P <= int(N ** 0.5)]:
    q = int(p) * int(p); h[q::q] = 0
# eps = (-1)^(number of prime factors in S, with multiplicity)
for p in Sp:
    p = int(p); q = p
    while q <= N:
        e[q::q] *= -1; q *= p
print(f"sieved t={time.time()-t0:.0f}s", flush=True)
st = json.load(open(sys.argv[2])); sl = [complex(*z) for z in st["s_list"]]; last = st["regularised"][-1]
Gp = last["G"][sl.index(0.9)][0]; c = 0.1 * last["G"][sl.index(1.0)][0]
mp.mp.dps = 20; zb = float(mp.zeta(B)); pred = 1.0 / (B * zb * Gp)
print(f"c = G(1) = {c:.9f}   G'(b) = {Gp:.9f}   zeta(b) = {zb:.9f}   predicted M_eps(x)/x^b -> {pred:.9f}")
xs = sorted(set(int(a * 10 ** k) for k in range(2, 10) for a in (1, 2, 5) if a * 10 ** k <= N))
rows = []
ce = np.cumsum(e, dtype=np.int64); E = {x: int(ce[x]) for x in xs}
# sup of |E(x) - c x| / x^b over dyadic blocks
sup_e = []
x0 = 1000
while x0 < N:
    x1 = min(2 * x0, N); ar = np.arange(x0, x1 + 1, dtype=np.float64)
    sup_e.append((x1, float(np.abs(ce[x0:x1 + 1] - c * ar).max()))); x0 = x1
del ce
ch = np.cumsum(h, dtype=np.int64); H = {x: int(ch[x]) for x in xs}
sup_h = []
x0 = 1000
while x0 < N:
    x1 = min(2 * x0, N); ar = np.arange(x0, x1 + 1, dtype=np.float64)
    r = ch[x0:x1 + 1] / ar ** B
    sup_h.append((x1, float(r.min()), float(r.max()))); x0 = x1
del ch
print("\n      x   sum eps   (sum eps - c x)   /x^b       /x^0.5 | sum mu*eps   /x^b   prediction")
for x in xs:
    d = E[x] - c * x
    print(f"{x:9.0e} {E[x]:12d} {d:14.3f} {d/x**B:10.6f} {d/x**0.5:10.4f} | {H[x]:10d} {H[x]/x**B:10.6f} {pred:10.6f}")
    rows.append({"x": x, "sum_eps": E[x], "err": d, "sum_mueps": H[x], "ratio": H[x] / x ** B})
print("\nblock sup |sum eps - c x| over (x/2, x], and its log-log slope; block range of sum mu*eps / x^b")
prev = None
for (x1, s), (_, lo, hi) in zip(sup_e, sup_h):
    sl_ = "" if prev is None else f"{np.log(s/prev[1])/np.log(x1/prev[0]):.3f}"
    print(f"{x1:11d}  sup={s:12.2f}  slope={sl_:>6}   sup/x^b={s/x1**B:.6f}   mu*eps/x^b in [{lo:.6f},{hi:.6f}]")
    prev = (x1, s)
json.dump({"N": N, "c": c, "Gprime_b": Gp, "zeta_b": zb, "pred": pred, "rows": rows, "sup_eps": sup_e, "sup_mueps": sup_h}, open(f"step2_{N:.0e}.json", "w"), indent=1)
