# sym-power-positivity: positivity with symmetric-power companions (2026-11-16)

Labels: PROVED (here), CLASSICAL (literature, cited), MEASURED (numerics here), ARGUED (not written out in full), OPEN.

**Verdict: precise obstruction. No improvement of any zero-free region. NO QED on RH.**
Adding symmetric powers, Rankin-Selberg constituents and Hecke characters to the 3-4-1 argument changes neither the
shape c/log t nor the constant c of the region it yields. Two statements carry this:

* Theorem A (PROVED): every admissible positive combination projects onto a classical non-negative cosine polynomial
  on the circle with the same pole weight, the same zero weight and no larger cost. This holds even if the companion
  L-functions are given cost zero.
* Theorem B (CLASSICAL + one PROVED line): the shape 1 - a/log t is attained by a Beurling zeta function that has an
  Euler product, non-negative Lambda, a simple pole at 1 and polynomial growth. So no argument whose only inputs are
  these can pass that shape. Vinogradov-Korobov enters through growth bounds that use the additive structure of the
  integers, which no symmetric-power L-function of degree >= 2 has in known form.

## 0. Plan; what is new against the atlas and earlier attempts

* Atlas (PR #27) section 9-10: arithmetic positivity and the 7/8 boundary. It does not treat multi-companion 3-4-1.
* `rh-attempts/2026-11-01-r3-pole-pretentious.md` R2 (Lemma KL) and R3 (Lemma AC): a non-negative combination with the
  pole at 1 cancelled is zero. That is the qualitative statement "the pole cannot be removed".
* New here: the quantitative statement. With the pole kept, companions do not improve the de la Vallee Poussin
  functional at all (Theorem A, equality checked by LP to 1e-13), the limit of that functional is the
  Arestov-Kondrat'ev constant, and the shape is sharp in a model with an Euler product (Theorem B).
* Walls: DH control in section 5. Flow-blindness, MV-CAP, verified height are not engaged: the result is negative.

## 1. Setup

Fix gamma > 0. Let PI be a finite set of unitary cuspidal automorphic representations pi of GL(d_pi)/Q, none trivial,
closed under contragredient. Examples: Sym^m f for a non-CM holomorphic newform f (Newton-Thorne), Hecke characters
(by automorphic induction), any Rankin-Selberg constituent known to be automorphic.
Write -L'/L(s, pi) = sum Lambda(n) a_pi(n) n^{-s}, and a_1(n) = 1 for the trivial representation (zeta).

A *combination* is a finite real array w = (w_{pi,k}), pi in PI u {1}, |k| <= K, with w_{pi~,-k} = w_{pi,k}. Put

    c_w(n) = sum_{pi,k} w_{pi,k} a_pi(n) n^{-ik gamma}     (real),
    D_w(s) = sum_n Lambda(n) c_w(n) n^{-s} = sum_{pi,k} w_{pi,k} (-L'/L)(s + ik gamma, pi).

It is *admissible* if c_w(n) >= 0 at every prime power n. Its zeta part is the cosine polynomial

    psi_w(theta) = sum_k w_{1,k} e^{-ik theta} = a_0 + sum_{k=1..K} a_k cos(k theta),   a_0 = w_{1,0}, a_k = 2 w_{1,k}.

The 3-4-1 method (CLASSICAL; global form) evaluates D_w(sigma) >= 0 at sigma > 1, with a zero rho_0 = beta + i gamma:

    0 <= a_0/(sigma-1) - a_1/(sigma-beta) + Cost(w) + O_w(1),                                   (1)

* a_0/(sigma-1): the pole of zeta, from (1, 0).
* -a_1/(sigma-beta): the zero rho_0, from (1, +-1). Needs a_1 > 0.
* Cost(w): upper bounds for the remaining terms. For (1,k), k != 0, w >= 0: (a_k/2) log gamma (1+o(1)).
  For (pi,k), k != 0, w >= 0: w d_pi log gamma (1+o(1)) per conjugate pair, from the analytic conductor.
  For (pi,0): O(1). For w < 0 an upper bound of -Re L'/L from below is needed and costs at least as much.

Optimising sigma in (1) gives 1 - beta >= (1+o(1)) (sqrt a_1 - sqrt a_0)^2 / Cost(w). Define

    V(w) = (sqrt a_1 - sqrt a_0)^2 / Cost(w)   (to be maximised; needs a_1 > a_0 > 0).

## 2. Theorem A: projection to the circle (PROVED)

**Theorem A.** Let w be admissible (non-negativity of c_w at primes is enough). Then:

1. psi_w(theta) >= 0 for all theta.
2. psi_w has the same a_0 and a_1 as w, and its cost in (1) is the zeta part of Cost(w).
3. Hence, for any assignment of non-negative costs to the companion terms (pi != 1), including cost zero,
   V(psi_w) >= V(w). The supremum of V over all admissible combinations, over all finite PI, all K, equals the
   supremum over non-negative cosine polynomials on the circle.

*Proof of 1.* Let h(theta) = sum_{|j|<=J} h_j e^{-ij theta} >= 0 be a trigonometric polynomial. For sigma > 1,

    D_{w,h}(sigma) := sum_n Lambda(n) c_w(n) h(gamma log n) n^{-sigma}
                    = sum_j h_j sum_{pi,k} w_{pi,k} (-L'/L)(sigma + i(k+j) gamma, pi).

The left side is >= 0 up to the prime-power terms n = p^r, r >= 2, where only primes were assumed. Those terms are
bounded as sigma -> 1+ by the Luo-Rudnick-Sarnak bound |a_pi(p^r)| <= d_pi p^{r(1/2 - 1/(d_pi^2+1))} (CLASSICAL).
On the right side, the term (pi, k+j) is holomorphic at sigma = 1 unless pi = 1 and k + j = 0:
L(s, pi) is entire and non-vanishing on Re s = 1 (Jacquet-Shalika, CLASSICAL), and zeta(1 + it) != 0 for t != 0.
The remaining terms have a simple pole with total residue

    sum_k h_{-k} w_{1,k} = (1/2pi) int_0^{2pi} h(theta) psi_w(theta) d theta.

Multiply by (sigma - 1) and let sigma -> 1+: the integral is >= 0 for every non-negative trigonometric polynomial h.
Taking Fejer kernels centred at any theta_0 gives psi_w(theta_0) >= 0. QED

*Proof of 2, 3.* a_0, a_1 are read off the zeta part. Cost(w) = Cost(psi_w) + (companion costs), and the second
summand is >= 0 by hypothesis. psi_w is itself admissible (item 1), with PI empty. QED

Remarks.

* No Sato-Tate or joint equidistribution is used; only non-vanishing on Re s = 1. So the theorem covers any number of
  forms f_1, ..., f_r at once, for whichever constituents are automorphic. For constituents not known automorphic the
  inequality (1) cannot be written at all.
* Same proof for weighted versions. For any g >= 0 the inequality sum Lambda(n) c_w(n) g(n) >= 0 equals the
  psi_w-inequality (valid by itself) plus the companion sums. So Heath-Brown/Kadiri smoothing and Stechkin's device
  gain nothing from companions either, under the same proviso: companion sums are only bounded from above by
  non-negative quantities.
* Product form. exp of the Dirichlet series integral of D_w is prod L(s+ik gamma, pi)^{w}; Landau's lemma applied to it
  has abscissa 1 because a_0 > 0. This is Lemma KL / AC of round 3; nothing is added by multiplying.
* The only way a companion could help is a provable negative upper bound for its term, i.e. a proof that
  L(s, pi) has zeros within O(1/log gamma) of 1 + ik gamma. No mechanism forces this from zeta(rho_0) = 0 (ARGUED:
  in the pretentious picture p^{i gamma} ~ -1, L(s+ik gamma, pi) is close to L(s, pi)^{+-1}, which has no zeros
  near 1).

**MEASURED check (lp.py, lp-results.json).** LP on T x SU(2), characters U_m(cos alpha) cos(k theta), w >= 0,
a_0 = 1, a_1 = r fixed, minimise cost. (K,M) = (4,4), (8,6), (12,8); r = 1.5, 1.74, 1.9; three cost models for
Sym^m: degree m+1, unit, free. In all 21 feasible cases the minimum equals the circle-only minimum to 1e-13
(e.g. K=12, r=1.74: 3.5133584485192 in all four columns). With free companions the solver places companion mass up
to 19.9 and gains nothing.

## 3. The constant: limit of the circle problem (CLASSICAL + MEASURED)

By Theorem A the best constant from positivity is 1 - beta >= 1/(R log gamma) with

    R_inf = inf over non-negative cosine polynomials with a_k >= 0 of (a_1 + ... + a_K) / (2 (sqrt a_1 - sqrt a_0)^2).

* CLASSICAL: Arestov-Kondrat'ev (Mat. Zametki 47 (1990)) bound the limit of this functional: 2 R_inf lies in
  (34.468305, 34.5035864), quoted from memory of the published values; consistent with the run below.
* MEASURED (grid LP, 6001 nodes, not interval-certified): R(K) = 18.4600 (K=3), 17.4496 (K=4), 17.2700 (8),
  17.2485 (16), 17.2450 (24), 17.2445 (32), 17.2442 (40). 2R(40) = 34.4884. 3-4-1 itself gives 34.82 (K=2).
* The sequence saturates. An unbounded family of positive combinations converges to R_inf ~ 17.24; it does not
  diverge. The published constants below this (Stechkin 9.65, Kadiri 5.70, Mossinghoff-Trudgian-Yang 5.5587) come
  from the functional equation and smoothing, not from more positivity, and they keep the shape c/log t.

## 4. Theorem B: the shape is sharp for positivity plus Euler product (CLASSICAL)

**Input (Diamond-Montgomery-Vorhauer, Math. Ann. 334 (2006) 1-36, CLASSICAL).** For 1/2 < theta < 1 there is a
Beurling generalized number system with integer counting function N(x) = kappa x + O(x^theta) whose zeta function
zeta_B has infinitely many zeros on the curve sigma = 1 - a/log t, t >= 2, and none to the right of it.

**Properties of zeta_B.**

* Euler product over the generalized primes, so -zeta_B'/zeta_B has non-negative coefficients (by construction).
* Simple pole at 1, continuation to Re s > theta, and |zeta_B(s)| <= C |s|/(sigma - theta) there. PROVED in one line:
  zeta_B(s) = s int_1^inf N(x) x^{-s-1} dx = kappa s/(s-1) + s int (N(x) - kappa x) x^{-s-1} dx.

**Consequence.** Inequality (1), every non-negative cosine polynomial, Landau's and Borel-Caratheodory's local method
with a growth bound log|zeta| << log t, and Theorem A (companions enter linearly and separately, so any Satake data
may be attached to the generalized primes) all apply to zeta_B. Each is therefore unable to prove more than
sigma > 1 - a/log t. The DMV zeros are compatible with every such inequality.

**Where Vinogradov-Korobov enters (CLASSICAL).** Landau's theorem converts a bound log|zeta(s)| <= phi(t) on
sigma >= 1 - eta(t) into a zero-free region of width ~ eta(t)/phi(t). Positivity is the conversion step only.
VK supplies phi(t) = O((log t)^{2/3} ...) from exponential sums sum n^{-it} over consecutive integers; this uses
n -> n + h, which Beurling integers do not have. For L(s, Sym^m f), m >= 1, no bound better than convexity order is
known near Re s = 1, so each companion term costs d log gamma and cannot shorten Cost(w). By Theorem A it would not
matter if it did.

## 5. Controls

* **DH.** Davenport-Heilbronn has no Euler product; the coefficients of -L'/L are not non-negative, and DH has zeros in
  Re s > 1. Inequality (1) is false for DH at its first step. The step using the Euler product is c_w(n) >= 0, i.e.
  Lambda(n) >= 0 together with Satake parameters of modulus <= 1 structure in a_pi(p^r).
* **Beurling (stronger wall for this angle).** zeta_B passes every step of the positivity argument and has zeros at
  1 - a/log t. So the Euler product is necessary for (1) and insufficient for anything past de la Vallee Poussin.

## 6. Combination with the 7/8 half-plane (PROVED trivial part; ARGUED remainder)

* PROVED. Let 1 - beta >= 1/8. For every sigma > 1 the zero term in (1) is at most a_1/(sigma-beta) <= 8 a_1.
  Since a_1 > a_0 > 0, a_0 + a_1 cos(theta) is negative at theta = pi, so psi_w >= 0 forces some a_k != 0, k >= 2,
  and Cost(w) >= (1/2) sum_{k>=2} |a_k| log gamma (1+o(1)), which tends to infinity. So for gamma large in terms of w,
  (1) holds for every sigma > 1 whatever beta <= 7/8 is. Inequality (1) carries no information about zeros at
  distance >= 1/8 from the 1-line, for any admissible w.
* CLASSICAL (Lemma KL, round 3). The inequality cannot be moved to sigma < 1: D_w has abscissa 1 because a_0 > 0.
* ARGUED. The 7/8 mechanism is a mean-square/Mobius-energy argument whose obstruction (TRO6) asks for cancellation
  in signed correlations of sextic theta coefficients. Positivity is one-sided and gives no cancellation. Sextic
  Kubota theta coefficients are metaplectic and are not Satake data of any Sym^m f, so they are outside PI.

## 7. Pivot (once)

The initial angle died at Theorem A with degree costs. Pivot: give the companions everything (GRH and Lindelof, i.e.
cost zero) and ask whether positivity then gains. It does not: Theorem A item 3 covers cost zero, and the LP "free"
column confirms it. No further pivot.

## 8. Three weakest steps

1. The model inequality (1). Theorem A is exact for the coefficient function c_w, but the claim "no gain" for
   smoothed methods assumes companion sums are bounded above only by non-negative quantities. A proof that zeta(rho_0)=0
   forces companion zeros near 1 + ik gamma would escape it. ARGUED not to occur; not proved.
2. Theorem B is a statement about a class of arguments (inputs: Euler product, pole, polynomial growth). It does not
   exclude arguments that use integrality or the functional equation together with positivity. The DMV statement is
   quoted from the abstract; the constant a > (4/e)(1 - theta) is not used.
3. Section 3 numerics are grid LPs without certified error; the Arestov-Kondrat'ev interval is quoted from memory and
   only cross-checked by 2R(40) = 34.4884 lying inside it.

## Files

* `lp.py`: both LPs (run with `.venv-arb/bin/python`, about 1 minute).
* `lp-results.json`: output.

Sources: DMV https://deepblue.lib.umich.edu/handle/2027.42/46253 ; Arestov-Kondrat'ev https://mathnet.ru/eng/mzm3135 ;
Mossinghoff-Trudgian https://arxiv.org/abs/1410.3926
