"""Residue-class counts of the greedy set S (b given) below N: is S balanced mod q?"""
import sys, math, numpy as np
from scipy.special import expi
b = float(sys.argv[1]); N = int(float(sys.argv[2]))
s = np.ones(N // 2 + 1, dtype=bool); s[0] = False
for i in range(1, int(N ** 0.5) // 2 + 1):
    if s[i]: s[2 * i * (i + 1)::2 * i + 1] = False
P = np.concatenate(([2], 2 * np.nonzero(s)[0] + 1)); P = P[P <= N]; del s
T = (expi(b * np.log(P.astype(float))) - expi(b * math.log(2.0))).tolist()
inS = np.zeros(len(P), dtype=bool); cnt = 0
for i, t in enumerate(T):
    if cnt + 1 <= t: inS[i] = True; cnt += 1
S = P[inS]; print("b", b, "N", N, "|S|", len(S))
for q in (3, 4, 5, 7):
    for x in (10 ** 6, 10 ** 7, N):
        Sx = S[S <= x]; cl = np.bincount(Sx % q, minlength=q)
        units = [r for r in range(q) if math.gcd(r, q) == 1]
        n = sum(cl[r] for r in units); dev = [(cl[r] - n / len(units)) for r in units]
        print(f" q={q} x={x:.0e} |S|={len(Sx)} dev from equal split per unit class: " + " ".join(f"{v:+.0f}" for v in dev) + f"   sqrt|S|={math.sqrt(len(Sx)):.0f}")
