"""Two thin sets. chi(p) = -1 on S1 (greedy, density t^(b1-1)/log t), chi(p) = -p^(i tau) on S2 (greedy on the
remaining primes, density t^(b2-1)/log t), chi(p) = 1 otherwise.  Predicted: G = F/zeta ~ (s-b1)^2 (s-b2)(s-b2-i tau) e^h,
so F vanishes at b1 (double), b2, b2 + i tau, and not at b2 - i tau.  Planned memory about 40 N bytes (N=3e7: 1.2 GB)."""
import sys, json, math, time
import numpy as np
from scipy.special import expi, exp1
b1, b2, tau, N = 0.9, 0.75, 5.0, int(float(sys.argv[1]))
print(f"planned peak about {40*N/1e9:.2f} GB", flush=True)
def primes_upto(n):
    s = np.ones(n // 2 + 1, dtype=bool); s[0] = False
    for i in range(1, int(n ** 0.5) // 2 + 1):
        if s[i]: s[2 * i * (i + 1)::2 * i + 1] = False
    p = 2 * np.nonzero(s)[0] + 1
    return np.concatenate(([2], p[p <= n]))
P = primes_upto(N); lp = np.log(P.astype(float))
T1 = (expi(b1 * lp) - expi(b1 * math.log(2))).tolist(); T2 = (expi(b2 * lp) - expi(b2 * math.log(2))).tolist()
lab = np.zeros(len(P), dtype=np.int8); c1 = c2 = 0
for i in range(len(P)):
    if c1 + 1 <= T1[i]: lab[i] = 1; c1 += 1
    elif c2 + 1 <= T2[i]: lab[i] = 2; c2 += 1
print("sizes", c1, c2, "final target gaps", T1[-1] - c1, T2[-1] - c2)
ph = np.zeros(N + 1)
for p, l, L in zip(P.tolist(), lab.tolist(), lp.tolist()):
    if l == 0: continue
    f = math.pi if l == 1 else math.pi + tau * L
    q = p
    while q <= N: ph[q::q] += f; q *= p
chi = np.exp(1j * ph); chi[0] = 0; del ph
chp = np.where(lab == 1, -1.0, np.where(lab == 2, -np.exp(1j * tau * lp), 1.0)); Pf = P.astype(float)
# tail of sum (chi(p)-1)/p: S1: -2 E1((1-b1) log N); S2: -E1((1-b2) log N) - E1((1-b2-i tau) log N) (second is oscillatory, small)
import mpmath as mp
tail = -2 * exp1((1 - b1) * math.log(N)) - exp1((1 - b2) * math.log(N)) - complex(mp.e1((1 - b2 - 1j * tau) * math.log(N)))
c = complex(np.exp(np.sum(np.log1p(-1 / Pf) - np.log(1 - chp / Pf)))) * np.exp(tail)
cs = np.cumsum(chi[1:]); print("c", c, "S(N)/N", cs[-1] / N)
blocks = []; k = 8
while 2 ** (k + 1) <= N:
    lo, hi = 2 ** k, 2 ** (k + 1); E = cs[lo - 1:hi - 1] - c * np.arange(lo, hi, dtype=float)
    blocks.append(dict(k=k, max=float(np.max(np.abs(E))), rms=float(np.sqrt(np.mean(np.abs(E) ** 2))))); print(blocks[-1]); k += 1
def fit(key, km):
    xs = [(bk["k"] + .5) * math.log(2) for bk in blocks if bk["k"] >= km]; ys = [math.log(bk[key]) for bk in blocks if bk["k"] >= km]
    return float(np.polyfit(xs, ys, 1)[0])
fits = {f"{key}_k>={km}": fit(key, km) for key in ("max", "rms") for km in (12, 16)}; print(fits)
EN = cs[-1] - c * N
def F(s):
    tot = 0j
    for a in range(1, N + 1, 10 ** 7):
        n = np.arange(a, min(a + 10 ** 7, N + 1), dtype=float); tot += np.sum(chi[a:a + len(n)] * np.exp(-s * np.log(n)))
    return tot + c * N ** (1 - s) / (s - 1) - EN * N ** (-s)
pts = [0.9, 0.75, complex(0.75, 5), complex(0.75, -5), complex(0.75, 2.5), complex(0.75, -2.5), complex(0.8, 5), complex(0.8, -5), 0.8, 2.0]
res = {str(s): str(F(s)) for s in pts}
for kv in res.items(): print(kv)
json.dump(dict(b1=b1, b2=b2, tau=tau, N=N, sizes=[c1, c2], c=str(c), blocks=blocks, fits=fits, F=res), open(f"two_set_N{N}.json", "w"), indent=1)
