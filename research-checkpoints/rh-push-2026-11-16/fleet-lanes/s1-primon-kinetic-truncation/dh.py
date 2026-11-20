#!/usr/bin/env python3
"""Davenport-Heilbronn control in n-indexed form.  f(s) = sum a(n) n^{-s}, a periodic mod 5: (1, k, -k, -1, 0), k = (sqrt(10-2 sqrt5)-2)/(sqrt5-1).
Lambda_DH defined by a(n) log n = sum_{d|n} Lambda_DH(d) a(n/d).  It is not supported on prime powers, so the p-indexed statistics are undefined;
the n-indexed analogues (cutoff n <= N) are computed.  usage: dh.py <N> <out.json>"""
import sys, json, numpy as np, mpmath as mp
N = int(float(sys.argv[1])); kap = (np.sqrt(10 - 2 * np.sqrt(5)) - 2) / (np.sqrt(5) - 1)
print("planned allocation: %.2f GB" % (N * 8 * 4 / 1e9), flush=True)
per = np.array([0.0, 1.0, kap, -kap, -1.0]); n = np.arange(N + 1); a = per[n % 5]; ln = np.zeros(N + 1); ln[1:] = np.log(n[1:])
Lam = a * ln
for d in range(2, N // 2 + 1):
    v = Lam[d]
    if v != 0.0: Lam[2 * d::d] -= v * a[2:N // d + 1]
print("Lambda_DH(n), n=2..12:", np.round(Lam[2:13], 6).tolist(), " max |Lambda_DH(n)|/log n for n<=N: %.3f" % np.max(np.abs(Lam[2:]) / ln[2:]), flush=True)
mp.mp.dps = 20
def A(s): return complex(mp.log(5 / mp.pi) / 2 + mp.digamma((mp.mpmathify(s) + 1) / 2) / 2)
out = {"N": N, "kappa": float(kap), "nonzero_on_non_prime_powers": int(np.count_nonzero(Lam[[6, 12, 14, 18, 21, 22, 24, 26, 28]]))}
Xs = [10 ** k for k in range(3, 9) if 10 ** k <= N]
# test 1 analogue: sum_{n<=X} Lambda_DH(n) log n n^{-beta}
out["t1"] = {str(b): {("%g" % X): float((Lam[2:X + 1] * ln[2:X + 1] * n[2:X + 1] ** (-float(b))).sum()) for X in Xs} for b in (1.0, 1.25, 1.5, 2.0)}
# test 2 analogue: Pick Gram of F_X(s) = A(s) - sum_{n<=X} Lambda_DH(n) n^{-s}
NUS = [0.05, 0.1, 0.2, 0.3, 0.4, 0.6, 1.0, 1.5]; out["t2"] = {}
for X in Xs:
    F = np.array([A(0.5 + nu).real - (Lam[2:X + 1] * n[2:X + 1] ** (-(0.5 + nu))).sum() for nu in NUS])
    G = (F[:, None] + F[None, :]) / (np.array(NUS)[:, None] + np.array(NUS)[None, :]); out["t2"]["%g" % X] = dict(F=F.tolist(), lam_min=float(np.linalg.eigvalsh(G)[0]))
# test 3 analogue: Fejer-smoothed margin Re[A(s) - sum Lambda_DH(n) n^{-s} (1 - log n/log X)] (no pole; trivial-zero term added as for an odd character)
XSg = [0.05, 0.1, 0.2, 0.3, 0.4, 0.5]; YS = [0.0, 5.0, 20.0, 60.0, 85.0, 85.3, 85.6993484854, 86.1, 86.5, 114.1633427308, 114.6]
out["t3"] = {"XS": XSg, "YS": YS}
for X in Xs:
    lx = np.log(X); w = Lam[2:X + 1] * (1 - ln[2:X + 1] / lx); M = np.zeros((len(XSg), len(YS)))
    for i, x in enumerate(XSg):
        amp = w * n[2:X + 1] ** (-(0.5 + x))
        for j, y in enumerate(YS):
            s = complex(0.5 + x, y); S = (amp * np.exp(-1j * y * ln[2:X + 1])).sum()
            k = np.arange(0, 3000); m = 2 * k + 1; tr = ((np.exp(-(m + s) * lx) - 1) / ((m + s) ** 2 * lx)).sum() - 1 / (2 * (6001 + s) * lx)
            M[i, j] = (A(s) - S - tr).real
    out["t3"]["%g" % X] = dict(margin=M.tolist(), min=float(M.min()), n_neg=int((M < 0).sum()), argmin=[XSg[int(np.argmin(M) // len(YS))], YS[int(np.argmin(M) % len(YS))]])
    print("X=%g  t3 min margin %.4g at %s, negatives %d/%d;  t2 lam_min %.4g;  t1(beta=1) %.5g" % (X, M.min(), out["t3"]["%g" % X]["argmin"], (M < 0).sum(), M.size, out["t2"]["%g" % X]["lam_min"], out["t1"]["1.0"]["%g" % X]), flush=True)
json.dump(out, open(sys.argv[2], "w"), indent=1)
