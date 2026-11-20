"""Second check of Theorem 2 of c5-repair-engine-map-r4 (steps (ii) and (v)) on a complex chi not used before.
chi(p) = exp(2 pi i j/5), j = 1 + (index mod 4), on a thin set S of primes p = 1 mod 4 (every time floor(sqrt(count)) increments);
chi(p) = 1 elsewhere. X = 200000. Planned memory: a few arrays of 2e5 complex128 (< 20 MB)."""
import numpy as np, cmath, math, json
X = 200000
print("planned allocation: 5 arrays of", X + 1, "complex128 =", 5 * (X + 1) * 16 / 1e6, "MB")
spf = np.zeros(X + 1, dtype=np.int64)
for i in range(2, X + 1):
    if spf[i] == 0:
        spf[i::i][spf[i::i] == 0] = i
primes = [p for p in range(2, X + 1) if spf[p] == p]
S = {}
cnt = 0; last = 0; idx = 0
for p in primes:
    if p % 4 == 1:
        cnt += 1
        r = int(math.isqrt(cnt))
        if r > last:
            last = r
            S[p] = cmath.exp(2j * math.pi * (1 + idx % 4) / 5); idx += 1
print("size of S:", len(S), "first:", sorted(S)[:6])
chi = np.ones(X + 1, dtype=complex); chi[0] = 0
g = np.zeros(X + 1, dtype=complex); g[1] = 1
for n in range(2, X + 1):
    p = int(spf[n]); m = n // p
    chi[n] = chi[m] * S.get(p, 1.0)
    # g multiplicative: g(p^k) = chi(p)^(k-1) (chi(p) - 1)
    k = 1
    while m % p == 0:
        m //= p; k += 1
    cp = S.get(p, 1.0)
    g[n] = g[m] * (cp ** (k - 1)) * (cp - 1)
Ssum = np.cumsum(chi)
# check chi = 1 * g at a few x
for x in (1000, 54321, X):
    d = np.arange(1, x + 1)
    alt = np.sum(g[1:x + 1] * (x // d))
    assert abs(alt - Ssum[x]) < 1e-6 * x, (x, alt, Ssum[x])
c = 1.0 + 0j; absall = 1.0
for p, cp in S.items():
    c *= (1 - 1 / p) / (1 - cp / p)
    absall *= 1 + abs(cp - 1) / (p - 1)
BX = float(np.sum(np.abs(g[1:])))
tail = absall - float(np.sum(np.abs(g[1:]) / np.arange(1, X + 1)))
K = BX + X * tail
xs = np.arange(0, X + 1)
E = Ssum - c * xs
# sup over real x <= X of |E(x)|: E is linear between integers; sup is at n or just below n+1
M = max(float(np.max(np.abs(E))), float(np.max(np.abs(E[:-1] - c))))
print("c =", c, "|c| =", abs(c), "B(X) =", BX, "tail =", tail, "K =", K, "M = sup|E| =", M)
n = np.arange(1, X + 1)
out = {"X": X, "S_size": len(S), "c": [c.real, c.imag], "B_X": BX, "tail": tail, "M": M, "step_ii": [], "step_v": []}
# step (ii): T(k/p) against c X (chi(p)-1)/(p-1), error bound |E(X/p)| + (X/p) tail + (p-1) B(X)
ok = True
for p in [3, 5, 13, 17, 29, 37, 101, 211]:
    cp = S.get(p, 1.0)
    for k in (1, 2, (p - 1) // 2):
        if k % p == 0: continue
        T = np.sum(chi[1:] * np.exp(-2j * np.pi * k * n / p))
        main = c * X * (cp - 1) / (p - 1)
        bound = abs(E[X // p]) + 1 + (X / p) * tail + (p - 1) * BX
        diff = abs(T - main)
        ok &= diff <= bound
        out["step_ii"].append([p, k, p in S, diff, bound])
        print("p=%d k=%d inS=%s |T-main|=%.3f bound=%.1f |main|=%.2f" % (p, k, p in S, diff, bound, abs(main)))
print("step (ii) within bound everywhere:", ok)
# step (v): |c|^2 X^2 V(Q)/(4 pi^2) <= 5 X^2 M^2 + (K^2 + 1) Q^5 / 3 for Q <= sqrt(X)
ok5 = True
for Q in (10, 30, 100, 300, int(X ** 0.5)):
    V = sum(abs(1 - S.get(p, 1.0)) ** 2 for p in primes if 3 <= p <= Q)
    lhs = abs(c) ** 2 * X ** 2 * V / (4 * math.pi ** 2)
    rhs = 5 * X ** 2 * M ** 2 + (K ** 2 + 1) * Q ** 5 / 3
    # sharper intermediate form: direct Gallagher side (pi X + Q^2) int |E|^2
    intE2 = float(np.sum((np.abs(E[:-1]) ** 2 + np.abs(E[:-1] - c) ** 2) / 2))  # trapezoid-type estimate of int_0^X |E|^2
    ok5 &= lhs <= rhs
    out["step_v"].append([Q, V, lhs, rhs, intE2])
    print("Q=%d V(Q)=%.3f lhs=%.4e rhs=%.4e ratio=%.3e  int|E|^2~%.3e" % (Q, V, lhs, rhs, lhs / rhs, intE2))
print("assembled inequality holds at every Q:", ok5)
out["ok_ii"] = bool(ok); out["ok_v"] = bool(ok5)
json.dump(out, open("thm2_check.json", "w"), indent=1)
