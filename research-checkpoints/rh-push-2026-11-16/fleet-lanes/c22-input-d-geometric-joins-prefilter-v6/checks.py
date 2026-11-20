# Exact integer checks for RESULT.md (planned memory: 6 integer lists of length N+1 = 200001, < 20 MB).
import math, sys
from fractions import Fraction
N = 200000
print("planned allocation: 6 lists of", N + 1, "python ints, < 20 MB")
spf = list(range(N + 1))
for i in range(2, int(N ** 0.5) + 1):
    if spf[i] == i:
        for j in range(i * i, N + 1, i):
            if spf[j] == j: spf[j] = i
primes = [p for p in range(2, N + 1) if spf[p] == p]
# THIN set S (b = 0.9): greedy, pi_S(x) tracks (1/2) int_2^x t^(b-1)/log t dt; 2, 3 excluded
b = 0.9; S = set(); acc = 0.0; prev = 2
for p in primes:
    acc += 0.5 * (p - prev) * (p ** (b - 1)) / math.log(p); prev = p
    if p > 3 and len(S) + 1 <= acc: S.add(p)
def cm(val):  # completely multiplicative from prime values
    f = [0] * (N + 1); f[1] = 1
    for n in range(2, N + 1):
        p = spf[n]; f[n] = f[n // p] * val(p)
    return f
lam = cm(lambda p: -1)
eps = cm(lambda p: -1 if p in S else 1)          # THIN
g = [lam[n] * eps[n] for n in range(N + 1)]      # Liouville x THIN (completely multiplicative, +-1)
def v6(n):
    k = 0
    while n % 6 == 0: n //= 6; k += 1
    return k
V6 = [0] + [(-1) ** v6(n) for n in range(1, N + 1)]
lamV6 = [lam[n] * V6[n] for n in range(N + 1)]   # not multiplicative, abs = 1
def psum(f):
    s = [0] * (N + 1)
    for n in range(1, N + 1): s[n] = s[n - 1] + f[n]
    return s
L, G, LV = psum(lam), psum(g), psum(lamV6)
isq = math.isqrt
ok1 = ok2 = ok3 = ok4 = True
xs = list(range(1, 3001)) + [N - k * 997 for k in range(60)]
for x in xs:
    # (1) sum_{n<=x} L(x/n) = floor(sqrt x)
    if sum(L[x // n] for n in range(1, x + 1)) != isq(x): ok1 = False
    # (2) Liouville x THIN: sum_{n<=x} eps(n) G(x/n) = floor(sqrt x)
    if sum(eps[n] * G[x // n] for n in range(1, x + 1)) != isq(x): ok2 = False
    # (3) lam*V6: partial sums = sum_k w(6^k) L(x/6^k), w(1)=1, w(6^k)=2(-1)^k
    t = L[x]; k = 1
    while 6 ** k <= x: t += 2 * (-1) ** k * L[x // 6 ** k]; k += 1
    if t != LV[x]: ok3 = False
    # (4) lam*V6: sum_{n<=x} LV(x/n) = sum_k w(6^k) floor(sqrt(x/6^k))
    t = isq(x); k = 1
    while 6 ** k <= x: t += 2 * (-1) ** k * isq(x // 6 ** k); k += 1
    if sum(LV[x // n] for n in range(1, x + 1)) != t: ok4 = False
print("(1) sum L(x/n) = floor sqrt x:", ok1, " points:", len(xs))
print("(2) Liouville x THIN relation with weights eps_S:", ok2, " |S| =", len(S))
print("(3) partial sums of lam*V6 = sum_k w(6^k) L(x/6^k):", ok3)
print("(4) lam*V6 all-n relation:", ok4)
# multiplicativity defect of lam*V6 and the convolution-square test f*f = d f (n <= 2000)
def conv_sq_fail(f, M=2000):
    for n in range(1, M + 1):
        s = 0; d = 0
        for a in range(1, n + 1):
            if n % a == 0: s += f[a] * f[n // a]; d += 1
        if s != d * f[n]: return n, s, d * f[n]
    return None
print("(5) f*f = d f first failure: lam", conv_sq_fail(lam), " eps", conv_sq_fail(eps), " g", conv_sq_fail(g),
      " V6", conv_sq_fail(V6), " lam*V6", conv_sq_fail(lamV6))
# rank of the multiplicative Hankel matrix (f(mn))_{m,n<=12}, exact
def rank(f, M=12):
    A = [[Fraction(f[m * n]) for n in range(1, M + 1)] for m in range(1, M + 1)]
    r = 0
    for c in range(M):
        piv = next((i for i in range(r, M) if A[i][c] != 0), None)
        if piv is None: continue
        A[r], A[piv] = A[piv], A[r]
        for i in range(M):
            if i != r and A[i][c] != 0:
                q = A[i][c] / A[r][c]; A[i] = [x - q * y for x, y in zip(A[i], A[r])]
        r += 1
    return r
print("(6) rank of (f(mn)), m,n<=12: lam", rank(lam), " g", rank(g), " V6", rank(V6), " lam*V6", rank(lamV6))
# sizes: L, G, LV at the top
for x in (10 ** 3, 10 ** 4, 10 ** 5, N):
    print("x=%d  L=%d  LV=%d  G(lam x THIN)=%d  log|G|/log x=%.3f  sqrt x=%.1f" %
          (x, L[x], LV[x], G[x], math.log(abs(G[x]) + 1) / math.log(x), x ** 0.5))
print("max |LV(x)|/sqrt(x), x in [100, N]: %.4f ; max |L(x)|/sqrt(x): %.4f" %
      (max(abs(LV[x]) / x ** 0.5 for x in range(100, N + 1)), max(abs(L[x]) / x ** 0.5 for x in range(100, N + 1))))
