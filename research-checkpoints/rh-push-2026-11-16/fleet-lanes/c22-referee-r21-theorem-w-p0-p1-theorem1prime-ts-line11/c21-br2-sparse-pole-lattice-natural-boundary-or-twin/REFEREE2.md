# REFEREE2: Theorem W of `c21-br2-sparse-pole-lattice-natural-boundary-or-twin/RESULT.md`

Second reading, 2026-11-20, lane `c22-referee-r21-theorem-w-p0-p1-theorem1prime-ts-line11`. Written from the
RESULT.md text alone; the lane's REFEREE.md and scripts were not opened before the verdict was fixed. Steps 0
to 5 were rederived; step 4 in detail. No statement about zeros of zeta: Theorem W is about non-continuation
of a relative Euler product over a sparse set of primes.

## Verdict

**Theorem W: holds with one correction (E1, a definition in step 3 that step 4 (b) contradicts; one-line
repair; the statement of the theorem is unchanged) and two remarks (E2, E3).**
Lemma P and Corollary P1 of the same file: hold (same inequality as Lemma P1 of the sibling lane, refereed in
`../c21-br2-relative-product-pole-lattice-census-server/REFEREE2.md`; rechecked there in balls).

## Order of the choices (asked for in the lane's weakest step 1)

D and y_c given. Then, in this order: h (window inside D); gamma and A >= (1 + gamma)/(1 - gamma) + 2; the
window b, hence C_A, C_A'; Z = sum over all k of lambda_k^-gamma; W_k (depends on h, A, Z, lambda_k only);
K_0 = K_0(h) from (0); the tail product; B and R (they depend on the tail product and on T); k_0 (depends on
B, R, h); K_1 (depends on k_0); X -> infinity. **B is fixed before k_0, and every o(X) in step 4 is for fixed
h, k_0, K_1.** No circularity. W_k does not depend on k_0.

## Steps 0 to 3 and 5

- Step 0. k lambda_k^-gamma -> 0 for a convergent series with decreasing terms, so N(Y) = o(Y^gamma).
  W_k/lambda_k = (1/h)(8 C_A Z)^(1/A) lambda_k^((1+gamma)/A - 1) <= C_2 h^-1 lambda_k^-gamma because
  (1 + gamma)/A <= 1 - gamma and lambda_k >= 1. Holds.
- Step 1. H = N_1'/N_1 has simple poles with integer residues, on the line only (N_1 is analytic and zero-free
  in Re z > 0). Pole kernel: 1/(delta + i(y - y_i)) = int_0^inf e^(-u(delta + i(y - y_i))) du gives
  int_0^inf e^(-delta u) e^(i u y_i) T^(omega - u) du, limit e^(i omega y_i)(2 pi T(y_i) - int_omega^inf T^(v) e^(-i v y_i) dv).
  Holds. Poles at the ends of the window contribute 0 (T vanishes there).
- Step 2. Dominated convergence in delta: the terms with n lambda_k > 2 omega are bounded by
  C h^(1-A) lambda_k^(1-A), summable; the others are finitely many. Holds.
- Step 3, inequality (4) and (5). Not k-bad gives C_A h lambda_k (h W_k)^-A = h lambda_k^-gamma/(8Z); summed
  over k this is at most h/8; the far lattice points give h R <= h lambda_(k0)/8. Holds (with E1).
- Step 5. (5) holds for infinitely many n; (1) is a limsup over omega -> infinity, and omega = n lambda_(k0) is
  a subsequence. Contradiction. Holds.

## Step 4

(a) K_0 < k <= K_1, k != k_0: finitely many k; lambda_(k0)/lambda_k irrational; Weyl gives
X (2 W_k/lambda_k + o(1)) bad n in [X, 2X]. Holds (W_k/lambda_k <= 1/8 by (0)).

(b) k > K_1. For a lattice point m lambda_k with m >= 1 within W_k of [X lambda_(k0), 2X lambda_(k0)]:
m lambda_k <= 2X lambda_(k0) + lambda_k/8 forces lambda_k <= (16/7) X lambda_(k0) <= Y. Number of lattice points
at most (X lambda_(k0) + 2 W_k)/lambda_k + 1; integers n within W_k of one point: at most 2 W_k/lambda_(k0) + 1.
The product is the six-term bound of the lane, term by term. Sum over K_1 < k, lambda_k <= Y: the first term
gives X sum 2 W_k/lambda_k; the second at most X/8 by the choice of K_1; the last four are at most
C N(Y)(1 + Y^(1-gamma)) (using W_k <= C_2 lambda_k^(1-gamma)/h, so W_k^2/lambda_k <= C lambda_k^(1-2 gamma)), which
is o(Y) = o(X) because N(Y) = o(Y^gamma). Holds.

(c) Total at most X (1/4 + 1/8 + o(1)): more than X/2 of the X + 1 integers are good. Holds.

### E1 (correction; step 3, line "For k != k_0 let d_(n,k) be the distance from n lambda_(k0) to the lattice lambda_k Z")

With this definition the lattice contains 0, and n is k-bad as soon as n lambda_(k0) < W_k. Since
W_k = (1/h)(8 C_A Z lambda_k^(1+gamma))^(1/A) -> infinity with k, **every n is k-bad for all large k under
the definition as written**, and the conclusion of (c) is false as stated. Step 4 (b) starts with "A k-bad n
lies within W_k of a point m lambda_k, m >= 1", which is not the definition of step 3.
Repair: define d_(n,k) as the distance from n lambda_(k0) to {m lambda_k : m >= 1}. This is the set that
occurs in (2) and in E_n (both sums run over m >= 1). Inequality (4) is unchanged: if the nearest point with
m >= 1 is m*, the others are at distance at least lambda_k (j - 1/2), j >= 1 (when n lambda_(k0) < lambda_k/2
they are at distance at least d + j lambda_k). Step 4 (a) is unchanged (the count is at most the Weyl count),
and step 4 (b) is then correct as written. The theorem stands.

### E2 (remark; size of X in step 4 (a) for the set "nearest prime to exp(k^1.5)")

Weyl's theorem is applied to finitely many ratios, but the X from which the count is valid is not uniform.
For q_k = nearest prime to exp(k^beta), log q_k = k^beta up to about e^(-k^beta). When (k_0/k)^beta is rational
(beta = 1.5: k_0/k a rational square) the ratio lambda_(k0)/lambda_k is within e^(-lambda) of a rational a/b,
and for all n below about e^(lambda) the count of k-bad n is the rational one (1/b of all n, or all n when
b = 1), not X 2 W_k/lambda_k. Measured below: k_0 = 36, k = 9: ratio 8 - 4.0e-12, bad fraction 1.000 for
n <= 2e6 against the Weyl value 0.100. The theorem is not affected (X -> infinity for fixed k_0, K_1; the
ratio is irrational), but (i) the proof is ineffective in X to the extent of e^(lambda_k), and (ii) with
k_0 a multiple of 4 and k_0/4 > K_0 every feasible n is bad; a numerical illustration should take k_0
squarefree, and then the multiples k = a^2 k_0 cost a fraction at most sum_{a>=2} a^-3 = 0.202 of the n in
the pre-asymptotic range. This sharpens the lane's sentence "the theorem is asymptotic there".

### E3 (remark; hypothesis used)

The proof uses pairwise irrationality of lambda_j/lambda_k and nothing else about primes. Remark (iv) and
the R1 line of the lane say this. A Beurling system with pairwise incommensurable norms passes.

## Test on log q_k = k^1.5

Hypothesis (W): sum k^(-1.5 gamma) is finite for gamma in (2/3, 1); take gamma = 0.8, A = 11, window
b = c cos^10(pi u/2) (transform decays like xi^-11; closed form
sinc(xi) prod_{m<=5} (pi m)^2/((pi m)^2 - xi^2), checked against quadrature to 1e-75). Every step applies; the
only arithmetic input is that log q_j/log q_k is irrational for distinct primes. With the proof's own
constants K_0 is beyond any run (K_0 of order 1e9 at h = 1 by a rough estimate), so the measured quantity is the conclusion of
steps 3 and 4 itself: the fraction of n <= 1000 with E_n <= h lambda_(k0)/4, E_n computed directly from its
definition (m >= 1, five nearest lattice points per k, all k with lambda_k <= n lambda_(k0) + 400/h).

Server, through rhrun, new code (`code/ref2_w.py`, `code/ref2_w2.py`; units `rh-c22refw-1120145537`, 3 cores,
`rh-c22refw2-1120145702`, 1 core). The scan is float64 (a screen, declared); 10 values were recomputed in Arb
at 256 bits and agree to 2e-10 relative or better (`out/w_arb.json`, `out/w2.json`). Model: lambda_k = k^1.5
(the true logarithms differ by less than e^(-k^1.5)); second model lambda_k = k^1.5 + 0.3 sin(k^2) (no
rational ratios). h = 1, k_0 = first squarefree integer above K_0.

| Model | K_0 | k_0 | lambda_(k0) | fraction of n <= 1000 with E_n <= h lambda_(k0)/4 | with E_n < h lambda_(k0)/2 | median E_n/(h lambda_(k0)) |
|---|---|---|---|---|---|---|
| k^1.5 | 8 | 60 | 464.8 | 0.000 | 0.000 | 77.9 |
| k^1.5 | 100 | 101 | 1015 | 0.012 | 0.017 | 45.9 |
| k^1.5 | 600 | 601 | 1.473e+04 | 0.180 | 0.213 | 6.81 |
| k^1.5 | 2500 | 2501 | 1.251e+05 | 0.411 | 0.438 | 1.17 |
| k^1.5 | 10000 | 10001 | 1e+06 | 0.551 | 0.575 | 0.0321 |
| k^1.5 | 40000 | 40001 | 8e+06 | 0.652 | 0.664 | 2.58e-06 |
| k^1.5 + 0.3 sin(k^2) | 8 | 60 | 464.7 | 0.000 | 0.000 | 51 |
| k^1.5 + 0.3 sin(k^2) | 100 | 101 | 1015 | 0.010 | 0.013 | 38.9 |
| k^1.5 + 0.3 sin(k^2) | 600 | 601 | 1.473e+04 | 0.174 | 0.211 | 4.63 |
| k^1.5 + 0.3 sin(k^2) | 2500 | 2501 | 1.251e+05 | 0.442 | 0.477 | 0.721 |
| k^1.5 + 0.3 sin(k^2) | 10000 | 10001 | 1e+06 | 0.649 | 0.686 | 0.000316 |
| k^1.5 + 0.3 sin(k^2) | 40000 | 40001 | 8e+06 | 0.660 | 0.679 | 1.28e-06 |

Diagnostic (`code/ref2_w3.py`, unit `rh-c22refw3-1120151014`, 4 cores; float64; second model; "pair" = a lattice point
m lambda_k, m >= 1, k > K_0, within 19 = 6 pi (the main lobe of the window transform) of n lambda_(k0)):

| K_0 | k_0 | N | good fraction (quarter) | mean number of pairs per n | expected sum over k of 2 * 19/lambda_k | bad n with no pair |
|---|---|---|---|---|---|---|
| 10000 | 10001 | 1000 | 0.649 | 0.700 | 0.647 | 0.000 |
| 10000 | 10007 | 1000 | 0.670 | 0.658 | 0.647 | 0.000 |
| 10000 | 10103 | 1000 | 0.597 | 0.797 | 0.647 | 0.000 |
| 10000 | 12007 | 1000 | 0.627 | 0.771 | 0.657 | 0.000 |
| 2500 | 2503 | 1000 | 0.460 | 1.142 | 1.293 | 0.000 |
| 40000 | 40001 | 400 | 0.660 | 0.595 | 0.303 | 0.000 |
| 40000 | 40127 | 400 | 0.792 | 0.345 | 0.304 | 0.000 |

No bad n is without a pair in any row (the implication "not k-bad for every k, hence E_n small" of step 3), and
the mean pair count agrees with the equidistribution count of step 4 except at k_0 = 40001 (0.595 against
0.303), where the good fraction (0.66) is also below that of k_0 = 40127 (0.79): at N <= 1000 << k_0 the count
depends on k_0. The plateau between K_0 = 10^4 and 4 * 10^4 in the first table is this k_0 dependence.

Reading (MEASURED): the good fraction rises with K_0 as step 4 predicts (the bad fraction is of order
sum_{k > K_0} 2 W/lambda_k, which is of order K_0^(-1/2) for k^1.5) and passes 1/2 at K_0 = 10^4 at this
window (0.55 to 0.67 over five values of k_0; 0.65 to 0.79 at K_0 = 4 * 10^4). The lane's row "k^(1.5), first 8 dropped: 0.005" is reproduced in kind (0.000 at K_0 = 8 with the
quarter threshold) and is the pre-asymptotic end of the same curve. In the integer model the exact
coincidences of E2 are visible: at K_0 = 600, k_0 = 601, n = 8 the value E_n/(h lambda_(k0)) = 9.284 contains
the term 8.000 from (k, m) = (2404, 1) (lambda_2404 = 8 lambda_601 in the model; Arb).

Weyl step on true primes (q_k = nearest prime to exp(k^1.5), k = 2..36, exact search; logarithms in Arb;
fraction of n <= 2e6 with distance of n lambda_(k0)/lambda_k to the integers below 0.05; Weyl value 0.100):

| (k_0, k) | ratio | bad fraction |
|---|---|---|
| (7, 3), (7, 4), (7, 5), (7, 9), (7, 16), (7, 36) | generic | 0.099999 to 0.100002 |
| (9, 3), (9, 4), (9, 5), (9, 28) | generic | 0.099993 to 0.100001 |
| (12, 3), (12, 4), (12, 5), (12, 9), (12, 16), (12, 28), (12, 36) | generic | 0.099998 to 0.100003 |
| (36, 3), (36, 4), (36, 5), (36, 28) | generic | 0.099994 to 0.100001 |
| (7, 28) | 1/8 - 2.0e-11 | 0.125 |
| (9, 16) | 27/64 + 2.1e-13 | 0.109375 |
| (9, 36) | 1/8 + 6.3e-14 | 0.125 |
| (36, 16) | 27/8 (to 1e-16) | 0.125 |
| (36, 9) | 8 - 4.0e-12 | 1.000 |

So step 4 (a) is confirmed where the ratio is generic, and the rows with a rational square k_0/k show E2.

## Test on CYC (lambda_k = 2^k log 3, theta_k = pi)

Hypothesis (W) holds (geometric growth). Steps 0 to 3 and step 4 (b) apply as written (they use no
arithmetic). **Step 4 (a) fails, at the irrationality:** lambda_(k0)/lambda_k = 2^(k0 - k) is an integer for
k < k_0, so n lambda_(k0) is a lattice point of every such k for every n: all n are k-bad, the count is X, not
X 2 W_k/lambda_k. Measured (same count as above, w = 0.05): (k_0, k) = (6, 0), (6, 3), (6, 5), (9, 0), (9, 3),
(9, 5): bad fraction 1.000; (9, 12): 0.125. E_n/(h lambda_(k0)) over n <= 400 (float64): minimum 1.007 to 1.48,
median 2.0 to 2.5, for (k_0, h) = (6, 1), (9, 1), (9, 0.25), (12, 1): no good n.

Signed sum in Arb (the left side of (2) at omega = n lambda_(k0), 80 factors):

| k_0, h, n | spike h lambda_(k0) | signed sum I | closed form -lambda_0 sum_m T^(omega - m lambda_0) | difference (upper bound) |
|---|---|---|---|---|
| 6, 1, 1 | 70.31 | -12.765836814595 | -12.765836814594 | 8.4e-13 |
| 6, 1, 7 | 70.31 | -12.765836814588 | -12.765836814586 | 1.7e-12 |
| 9, 1, 3 | 562.49 | -12.765836814588 | -12.765836814586 | 1.7e-12 |
| 9, 0.25, 5 | 140.62 | -12.765836814588 | -12.765836814586 | 1.5e-12 |
| 12, 1, 2 | 4499.9 | -12.765836814588 | -12.765836814586 | 1.7e-12 |
| 12, 0.25, 11 | 1125.0 | -12.765836814588 | -12.765836814586 | 1.5e-12 |

(The differences are the truncation of the lattice sums at abs(h xi) <= 90.) The value is
-2 pi T(0) = -2 pi b(0)/1 = -2 pi (1024/504) = -12.76584 at h = 1 (one pole of H in the window, residue -1,
at y = 0), and the same at h = 0.25 by Poisson summation: abs(I) equals the bound B of step 1 and does not
grow with the spike. So for CYC the two sides of the proof agree, (5) fails for every n, and the failure is
located at step 4 (a), as the lane states in remark (v).

## Dependence

Theorem W is used by: `c22-br2-dense-remainder-integer-quantization` and `c22-br2-dense-census-cyc-nwm-server`
(the open remainder is defined as its complement), `c22-no-stage-objects-axis-support-weyl-independence-prefilter`
(moves the Weyl-independence step), the BR-2 node of the engine, and the round-21 lesson (i) of ROUND_LOG.md.
With E1 repaired the statement they use is unchanged. Any lane that copies step 3 should copy the repaired
definition. Referees for Theorem W: 1 (this file); the lane's count "referees = 0" can be raised to 1.

## Comparison with the first referee file (made after the verdict above was fixed)

The lane's `REFEREE.md` contains an item E1 with the same defect and the same repair (distance to
{m lambda_k : m >= 1}). The two readings agree on it; found independently here. E2 was not looked for there.
