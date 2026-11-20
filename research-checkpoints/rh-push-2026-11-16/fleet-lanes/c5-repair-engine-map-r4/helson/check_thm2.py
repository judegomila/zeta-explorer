"""Numeric check of the steps of Theorem 2 (RESULT.md section 3) on thin sign twists.
chi completely multiplicative, -1 on a greedy set S of primes with counting function about li(x^b), +1 elsewhere.
Checks: (i) T(k/p) = sum_{n<=X} chi(n) e(-kn/p) against c X (chi(p)-1)/(p-1), error against |E(X/p)| + C1 p B(X);
(ii) the identity T(xi) = c(1-e(-xi X))/(2 pi i xi) + e(-xi X) E(X) + 2 pi i xi Ehat(xi);
(iii) both sides of the final inequality of Theorem 2.
float64 / complex128. Planned memory: arrays of length X+1 <= 4e6 (int8, float64, complex128): under 0.3 GB."""
import sys, json, math
import numpy as np
b = float(sys.argv[1]); X = int(float(sys.argv[2]))
print('planned allocation: about %.2f GB' % ((X + 1) * (1 + 8 + 8 + 16 + 8) / 1e9), flush=True)
sieve = np.ones(X + 1, dtype=bool); sieve[:2] = False
for i in range(2, int(X ** 0.5) + 1):
    if sieve[i]: sieve[i * i::i] = False
primes = np.nonzero(sieve)[0]
# greedy S: p enters iff count + 1 <= T(p), T(x) = int_2^x t^(b-1)/log t dt (trapezoid on a log grid, then interpolation)
g = np.exp(np.linspace(math.log(2), math.log(X), 400001)); f = g ** (b - 1) / np.log(g)
Tg = np.concatenate([[0.0], np.cumsum((f[1:] + f[:-1]) / 2 * np.diff(g))]); Tp = np.interp(primes, g, Tg)
inS = np.zeros(len(primes), dtype=bool); cnt = 0
for i in range(len(primes)):
    if cnt + 1 <= Tp[i]: inS[i] = True; cnt += 1
S = primes[inS]
chi = np.ones(X + 1, dtype=np.int8); chi[0] = 0
for p in S:
    q = int(p)
    while q <= X:
        chi[q::q] *= -1; q *= int(p)
c = float(np.prod((1 - 1 / S) / (1 + 1 / S)))            # tail beyond X neglected: sum_{p in S, p > X} 2/p is about 2 X^(b-1)/(1-b)/log X
tail = 2 * X ** (b - 1) / ((1 - b) * math.log(X))
Sx = np.cumsum(chi.astype(np.int64)); n = np.arange(X + 1)
# c from the partial sums, more accurate than the truncated product: least squares slope on the upper half
c_fit = float(np.sum(Sx[X // 2:].astype(float) * n[X // 2:].astype(float)) / np.sum(n[X // 2:].astype(float) ** 2))   # float: the int64 product overflows near X = 4e6
print('b %.2f X %d |S| %d  c(product, truncated) %.6f  tail estimate %.3f  c(fit) %.6f' % (b, X, len(S), c, tail, c_fit))
c = c_fit
E = Sx - c * n; M = float(np.max(np.abs(E)))
# g = chi * mu: |g(d)| = 2^(number of prime factors in S) if every prime of d lies in S, else 0
gabs = np.zeros(X + 1); gabs[1] = 1
om = np.zeros(X + 1, dtype=np.int16); bad = np.zeros(X + 1, dtype=bool)
Sset = np.zeros(X + 1, dtype=bool); Sset[S] = True
for p in primes:
    if Sset[p]:
        om[p::p] += 1
    else:
        bad[p::p] = True
gabs = np.where(bad, 0.0, 2.0 ** om); gabs[0] = 0
B = np.cumsum(gabs)
ys = [10 ** k for k in range(2, int(math.log10(X)) + 1)]
beta = max(math.log(B[y]) / math.log(y) for y in ys); Cb = max(B[y] / y ** beta for y in ys)
print('sup |E| on [0,X] = %.1f (X^%.3f);  B(X) = sum_{d<=X}|g(d)| = %.0f (X^%.3f)' % (M, math.log(M) / math.log(X), B[X], math.log(B[X]) / math.log(X)))
out = dict(b=b, X=X, c=c, supE=M, BX=float(B[X]), rows=[])
rows = []
for p in [3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 97, 101, 199, 211, 499, 503, 997]:
    for k in (1, 2):
        xi = k / p
        ph = np.exp(-2j * np.pi * ((k * n) % p) / p)
        T = complex(np.sum(chi * ph))
        chip = -1 if Sset[p] else 1
        main = c * X * (chip - 1) / (p - 1)
        errbound = abs(E[X // p]) + (p - 1) * B[X] + (X / p) * 0   # tail term of c_p(X) omitted: c is fitted
        # identity (ii): Ehat by exact integration on unit intervals
        w = 2 * np.pi * xi
        e0 = np.exp(-1j * w * n[:-1]); e1 = np.exp(-1j * w * n[1:])
        I0 = (e1 - e0) / (-1j * w)                                   # int_n^{n+1} e(-xi x) dx
        I1 = (n[1:] * e1 - n[:-1] * e0) / (-1j * w) - (e1 - e0) / (-1j * w) ** 2   # int x e(-xi x) dx
        Ehat = complex(np.sum(Sx[:-1] * I0 - c * I1))
        rhs = c * (1 - np.exp(-1j * w * X)) / (1j * w) + np.exp(-1j * w * X) * E[X] + 1j * w * Ehat
        rows.append((p, k, chip, T, main, abs(T - main), errbound, abs(T - rhs)))
        out['rows'].append(dict(p=p, k=k, chi_p=chip, T=[T.real, T.imag], main=main, abs_diff=abs(T - main), proved_bound=float(errbound), identity_residual=abs(T - rhs)))
print('  p  k chi(p)        Re T        Im T        main   |T-main|  bound |E(X/p)|+(p-1)B(X)   identity residual')
for r in rows:
    print('%4d %d %3d %12.1f %10.1f %12.1f %9.1f %14.0f %14.2e' % (r[0], r[1], r[2], r[3].real, r[3].imag, r[4], r[5], r[6], r[7]))
# inequality of Theorem 2 with beta, C from the data: V(X^delta) <= (4 pi^2/c^2)(5 M^2 + (C1^2+1)/3)
C1 = Cb * (1 + 1 / (1 - beta)); delta = 2 * (1 - beta) / 5; Q = X ** delta
V = 4.0 * int(np.sum(S[(S >= 3) & (S <= Q)] > 0))
print('beta %.3f C %.3f C1 %.2f delta %.4f Q = X^delta = %.2f;  V(Q) = sum_{3<=p<=Q}|1-chi(p)|^2 = %.0f;  right side %.3e' % (
    beta, Cb, C1, delta, Q, V, 4 * math.pi ** 2 / c ** 2 * (5 * M * M + (C1 * C1 + 1) / 3)))
# the mean-square content: sum over p <= Q0 of the main terms against the measured int |E|^2
for Q0 in (50, 200, 1000):
    Vq = 4.0 * int(np.sum((S >= 3) & (S <= Q0)))
    lhs = c * c * X * X / (4 * math.pi ** 2) * Vq
    intE2 = float(np.sum(E[:-1].astype(float) ** 2))             # crude: E at integers (E varies by c < 1 inside a unit interval)
    print('Q0 %5d: V = %4.0f  main c^2 X^2 V/(4 pi^2) = %.3e   (pi X + Q0^2) int|E|^2 = %.3e   ratio %.3e' % (Q0, Vq, lhs, (math.pi * X + Q0 ** 2) * intE2, lhs / ((math.pi * X + Q0 ** 2) * intE2)))
    out['Q0_%d' % Q0] = dict(V=Vq, main=lhs, sieve_side=(math.pi * X + Q0 ** 2) * intE2)
json.dump(out, open('check_thm2_b%s_X%d.json' % (sys.argv[1], X), 'w'), indent=1)
