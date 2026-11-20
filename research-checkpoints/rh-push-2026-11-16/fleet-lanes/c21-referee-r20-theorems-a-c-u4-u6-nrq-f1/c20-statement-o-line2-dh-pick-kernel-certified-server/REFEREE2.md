# REFEREE2: c20-statement-o-line2-dh-pick-kernel-certified-server (Theorem C; one certified configuration recomputed)

Second referee, lane `c21-referee-r20-theorems-a-c-u4-u6-nrq-f1`, 2026-11-20. Written from `RESULT.md` of the
refereed lane only; its scripts and its `REFEREE.md` (a second pass by the same agent) were not opened. Recomputation:
`pick_ref2.py` (own code), server units `rh-c21ref2-1120102305` (4 cores, 8 GB limit) and `rh-c21half-1120102637`
(1 core, 4 GB), both finished; outputs `out_*.json`, `log_*.txt` copied here. Ball arithmetic (python-flint, Arb),
12000 bits. No statement about zeros of zeta; the functions are controls.

## Verdict

**Theorem C: holds (PROVED-2), on bounded node ranges as stated. The recomputed certified configurations agree
with the lane in every sign and in every printed digit.** One remark on wording (not an error).

## 1. Recomputation with independent code

Differences from the lane's two builds as described in its RESULT: real `arb_series` throughout; DH through the
non-deflated Hurwitz series in s at s_0 = 1/2 + a (anchor a = 1; at a = 1/2, where s_0 = 1 is the Hurwitz pole,
the deflated series, the pole terms cancelling because sum a(r) = 0); gamma part as the derivative of an lgamma
series; E_q part from exp series; jets by the recurrence 2a P[i][j] + P[i-1][j] + P[i][j-1] = l_i [j=0] + l_j [i=0]
(only l_0 .. l_(N-1) are needed); decision by an own row-oriented LDL^T on lists of balls, no pivoting. Every pivot
ball excludes 0 (no undecided pivot in any run).

| run | function | anchor | order | negative pivots (here) | lane | d_148 (here) | d_149 (here) | lane's d_149 | lowest rel. accuracy |
|---|---|---|---|---|---|---|---|---|---|
| R-DH | DH | 1 | 256 | 149, 150, 218, 219 | 149, 150, 218, 219 | 7.5950316525e-564 | -6.233227522696339855141e-569 +/- 1.5e-591 | -6.2332275226963398551e-569 | 8340 bits |
| R-DH-half | DH | 1/2 | 200 | 149, 150 | 149, 150 | 8.6885990448e-564 | -7.597167730462748438955e-569 +/- 1.8e-591 | -7.5971677304627484390e-569 | 8940 bits |
| R-ZETA | zeta | 1 | 256 | none | none | 4.29e-628 | 6.69e-633 (positive) | - | 8043 bits |
| R-DHQ | DH * B_2 B_3 B_4 B_9 (Theorem C instance, conductor 1080) | 1 | 256 | **none** | none to 256 | 1.3230e-439 | 2.2216e-443 (positive) | - | 8227 bits |

Further agreement: L_DH(1) = 0.1927572239684354733178490 (lane: 0.19275722396843547332); L_xi(1) =
0.04613592806046257535946601 (lane: 0.04613592806046257536); zeta's d_256 = 3.652484198918908686e-1167 (lane:
3.65e-1167); the lowest relative accuracy of the zeta run, 8043 bits, equals the lane's figure. Small self-tests:
E_2 alone, order 24, all pivots positive (Lemma 2 (d)); zeta, order 40, all positive.
f_DH(3/2) = 0.9748279599700761881934854, f_DH(1) = 0.9228018738028908721819653 (positive, Lemma 3).

So the configuration "DH at a = 1: positive definite at orders <= 148, indefinite at 149; DH times four line-zero
factors: positive definite at every order <= 256" is certified by a third and a second independent code
respectively. The nested-node runs and the B_c^m runs were not recomputed.

## 2. Theorem C, re-derived

| step | content | label after this pass |
|---|---|---|
| Lemma 1 | K_(FG) = K_F + K_G, and the same for divided-difference matrices (L is a logarithmic derivative; divided differences are linear) | PROVED-2 |
| Lemma 2 (a), (b) | q^(s/2) B_q(s) = q^(s/2) + q^((1-s)/2), symmetric, = q^(1/4) E_q(z); zeros where q^(1/2 - s) = -1, at 1/2 + i pi (2k+1)/log q | PROVED-2 |
| Lemma 2 (c) | (log q/2) tanh(z log q/2) = sum over gamma > 0 of 2z/(z^2 + gamma^2), gamma = (2k+1) pi/log q (partial fractions of tanh: tanh w = sum 2w/(w^2 + (k + 1/2)^2 pi^2), substituted and checked); K_E(x, y) = sum_gamma 2 Re[1/((x - i gamma)(y + i gamma))] from 2x/(x^2 + gamma^2) = 1/(x - i gamma) + 1/(x + i gamma) | PROVED-2 (partial fractions CLASSICAL) |
| Lemma 2 (d) | M_E(x) = sum_gamma 2 Re[v_gamma v_gamma^*], v_gamma[i] = (-1)^(i-1)/prod_(l<=i)(x_l - i gamma) (divided differences of 1/(x - p)); for real c, c^t M c = 2 sum_gamma abs(c . v_gamma)^2; vanishing forces the polynomial sum_i c_i (-1)^(i-1) prod_(l>i)(x_l - p), of degree <= N - 1 with terms of distinct degrees, to vanish at infinitely many p = i gamma, so c = 0. The series converges uniformly in x on compacts (entries O(gamma^-2)), so x -> M_E(x) is continuous and its least eigenvalue has a positive infimum on [0, beta]^N | PROVED-2 |
| Lemma 2, B_c | zero of 1 + cX + cY + XY: Y = -(1 + cX)/(X + c), abs(Y)^2 - 1 = (1 - c^2)(1 - abs(X)^2)/abs(X + c)^2 (expanded and checked); abs X < 1 iff Re s > 1/2 iff abs Y < 1, so zeros have abs X = abs Y = 1. Completed form: 6^(1/4)[2 cosh(z log 6/2) + 2c cosh(z log(3/2)/2)], even, of order 1, so its logarithmic derivative is sum 2z/(z^2 + gamma^2) with no exponential factor | PROVED-2 |
| Lemma 3 | f_DH(s) > 0 for real s > 0: blocks of five, [g(1/5) - g(4/5)] + k0 [g(2/5) - g(3/5)] > 0 with g decreasing and k0 = 0.28408 > 0. K_DH analytic near [0, beta]^2 (L odd, so L(x) + L(y) vanishes on x + y = 0) | PROVED-2; values CERTIFIED at s = 1 and 3/2 here |
| C.1, C.2 | D_Q is an ordinary Dirichlet series; functional equation with conductor 5 prod q | PROVED-2 (functional equation of DH CLASSICAL) |
| C.3 | no Euler product: d(n) = a(n) for n prime to 6; d(91) - d(7) d(13) = 1 + k0^2 = 1.0807 (91 = 1, 7 = 2, 13 = 3 mod 5) | PROVED-2 |
| C.4, C.5 | zeros: those of f_DH and zeros on the line; kernel: sum of translates of a positive even kernel | PROVED-2 |
| C.6, C.7 | M_(D_Q) = M_DH + sum_q M_(E_q); A = sup over [0, beta]^N of norm(M_DH) finite by continuity (Hermite-Genocchi for an analytic kernel), mu = inf lambda_min(M_(E_2)) > 0; m > A/mu copies of q = 2 give M >= (m mu - A) I | PROVED-2 (Hermite-Genocchi CLASSICAL) |
| Theorem B | off-line zero implies failure at some finite order on any interval (Pick-Nevanlinna with an accumulation point; a positive-real extension would agree with L and be analytic in the right half-plane) | CLASSICAL, deduction PROVED-2 |

## 3. Remark on wording

The statement "the class {exact functional equation, ordinary Dirichlet series, positive even kernel, Pick order
<= N on [0, beta]} contains a function without Euler product whose zeros include DH's" is what Theorem C proves.
The member used in the existence proof (m copies of q = 2, m > A/mu, with A and mu not computed) is not one of the
certified instances; the certified instances are separate facts at anchor a = 1 and on one nested sequence, not on
all of [0, beta]^N. The lane says this; the line-2 wording should keep "proved for some Q depending on (N, beta);
certified for Q = {2, 3, 4, 9} at the anchor a = 1 to order 256" as two clauses.

## 4. Three weakest steps

1. Bounded node ranges only: the compactness step has no substitute for nodes tending to infinity (the lane's 3.4 (a)).
2. The kernel clause: D_Q keeps positivity and evenness of the kernel, but log-concavity is measured to fail for
   most Q (float64 grid, not certified; not rechecked here). If line 2's read class includes log-concavity,
   Theorem C does not cover it.
3. "DH passes orders <= 148" is a statement at the configurations run (now: three codes at a = 1, two at a = 1/2).
   No certificate over all node sets exists; Theorem B only says the set of passed orders on an interval is finite.

## 5. Flags

R1 false (Theorem C shows the Pick ladder at fixed order is not an Euler-product test), R2 false, R3 false, R4 false.
