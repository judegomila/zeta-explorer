# REFEREE2: the V6 test of `c21-c4-r1-flag-test-lemma-e-hq-beurling/RESULT.md`

Second reading, 2026-11-20, lane `c22-referee-r21-theorem-w-p0-p1-theorem1prime-ts-line11`. Item read: step (a)
(hypothesis H(a): a_n = kappa(n) - Re l_f(n) >= 0 for every n >= 2) on V6, HQ1 to HQ4 and E_a. The lane's
scripts and REFEREE.md were not opened. Theorem 1' was read for the V6 instance only. No statement about
zeros of zeta.

## Verdict

**Holds.** V6 passes step (a); HQ1, HQ2, HQ3, HQ4 and E_a fail it at the coefficients the lane names, with
the values the lane prints. No correction.

## By hand

V6. (1 - u)/(1 + u) = 1 + 2 sum_{k>=1} (-1)^k u^k with u = 6^-s, so
f(n) = 1 + 2 sum_{k=1}^{v} (-1)^k = (-1)^v, v = v_6(n). Not multiplicative (f(6) = -1, f(2) f(3) = 1);
abs f = 1. log F = log zeta - 2 sum_{k odd} u^k/k, so a_n = 2/k at n = 6^k with k odd and a_n = 0 elsewhere:
H(a) holds, A = 2 sum_{k odd} 6^(-ks)/k. Partial sums: sum_k c_k floor(x/6^k) = x (1 - 2/7) + O(log x) = 5x/7 + O(log x).
All as stated.

HQ1 (q, eps): log(1 + eps y/(1 - y)^2) = eps y + O(y^2), y = q^(1/2) q^-s: l_f(q) = 1 + eps q^(1/2),
a_q = -eps q^(1/2). HQ2: first term eps y^2: a_(q^2) = -eps q. HQ3: log of (1 - alpha y + y^2)/(1 - beta y + y^2)
has coefficient (q^(kb) + q^(-kb) - q^(ka) - q^(-ka))/k at y^k, positive for b > a: a_(q^k) = -c_k q^(k/2)/k < 0
for every k. HQ4: coefficient at y is alpha + beta. E_a: l_f(p) = p^a + p^-a, a_p = 1 - p^a - p^-a < 0 at
every prime. All as stated.

## Recomputation (Arb, 300 bits, n <= 3000; new code `code/ref2_misc.py`, unit `rh-c22refm-1120145537`, `out/misc.json`)

Coefficients f(n) built from the local series, Lambda_F by the recursion f(n) log n = sum_{d | n} Lambda_F(d) f(n/d),
a_n = kappa(n) - Re(Lambda_F(n)/log n); "negative" means the ball is entirely below 0.

| Object | Negative a_n, n <= 3000 | First negative | Lane's value |
|---|---|---|---|
| zeta | 0 (max abs a_n 3.5e-77) | - | - |
| V6 | 0; f(n) = (-1)^(v_6(n)) at every n <= 3000; max a_n = 2 (n = 6); partial sum minus 5x/7 = 0.571, -0.286, 1.143 at x = 100, 1000, 3000 | - | passes |
| HQ1, q = 2, eps = 1 | 10 | a_2 = -1.4142135623730951 | -1.4142 |
| HQ1, q = 2, eps = 5 | 6 | a_2 = -7.0710678118654755 | -7.0711 |
| HQ2, q = 7, eps = 0.2 | 3 | a_49 = -1.4 | -1.4 |
| HQ3 (5; 0.07, 0.31) | 4 (n = 5, 25, 125, 625: every power of 5 below 3000) | a_5 = -0.5398489898667593 | -0.5398 |
| HQ4 (5; 0.07, 0.31) | 4 | a_5 = -9.540943203746677 | -9.5409 |
| E_a, a = 0.2 | 466 | a_2 = -1.0192489182931592 | -1.0192 |
| Liouville (contrast) | 0 (max a_n = 2) | - | passes |

So the lane's reading stands: step (a) is passed by a non-multiplicative unimodular member (V6) and failed by
multiplicative members with zeta's functional equation (HQ1 to HQ4, E_a), each at one prime power. The R1
flag of the c4 lane is not supported by step (a).

Remark on the V6 instance of Theorem 1' (read, not refereed in full): theta = 0+, c = 5/7, no real zero of F
in (0, inf), so sigma_0 = 0; the extra zeros and poles of F (6^-s = 1, 6^-s = -1) are on Re s = 0, consistent
with the conclusion ord_F(s_0) + ord_F(conj s_0) = 2 ord_zeta(s_0) for Re s_0 > 0.

## Dependence

V6 and THIN x V6 are entered as control rows by the record lane of round 22 and are used as the R1 test by
lanes 3 and 4. This reading confirms the row for V6. THIN x V6 was not recomputed.
