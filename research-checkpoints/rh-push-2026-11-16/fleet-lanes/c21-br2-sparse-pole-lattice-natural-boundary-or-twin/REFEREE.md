# REFEREE.md: c21-br2-sparse-pole-lattice-natural-boundary-or-twin

**Status of this file: author's adversarial pass, not an independent referee.** This lane had no means to
start a separate referee process. An independent pass is owed; referees = 0 stands. What follows: re-derivations
by a second route where one exists, numeric cross-checks with a second implementation, the corrections the
pass forced on RESULT.md, and the points an independent referee should attack first.

## 1. Re-derivations

1. Lemma P. Factor at p: alpha_p p^-s = p^(1/2) e^(i theta) p^(-1/2 - delta) e^(-i t log p) = p^(-delta) at
   t = (theta + 2 pi n)/log p. Checked. Other factors: abs(1 - q^-s) >= 1 - q^(-1/2 - delta) >= 1 - q^(-1/2);
   abs(1 - alpha_q q^-s) <= 1 + q^(-delta). c_S > 0 needs sum q^(-1/2) finite: true in regime (K).
   L(delta) by Stieltjes integration by parts: boundary terms vanish (N(0) = 0, log(1 + e^(-delta x)) N(x) -> 0).
   Second route for the lacunary case: lambda_k >= c a^k gives sum over k of log(1 + e^(-c a^k delta)) <=
   log 2 times #{k: a^k <= 1/(c delta)} + sum over j >= 0 of e^(-a^j) = (log 2/log a) log(1/delta) + O(1). Same
   exponent. Agrees with the sibling's pre-run item P1.
2. Telescoping identity. (1 - w) prod_{k=0}^{K} (1 + w^(2^k)) = 1 - w^(2^(K+1)) by induction. In the lane's
   notation 1 - e^(i theta_k - lambda_k z) with theta_k = pi, lambda_k = 2^k lambda_0 is 1 + w^(2^k). Checked; and
   L(delta)/log(1/delta) -> 1 for this set (measured 0.9986 at delta = 1e-30).
3. Theorem W, step 1 by a second route. A simple pole r/(z - i y_i) is r times the Laplace transform of
   e^(i u y_i) on u > 0, so its contribution to I(omega, 0+) is r int_0^inf e^(i u y_i) T^(omega - u) du, which is
   r e^(i omega y_i) times the integral of T^(v) e^(-i v y_i) over v < omega; the full integral is 2 pi T(y_i)
   (Fourier inversion). Agrees with the text. Numeric: `ref_check.log` item 3 (8.3773 against
   2 pi T(0) = 8.3776 at omega = 20, delta = 1e-6).
4. Theorem W, step 2: one lattice, by Poisson summation. lambda sum over n in Z of T^(omega - n lambda) e^(i n theta)
   = 2 pi sum over lattice points a of T(a) e^(i omega a): the product side for a single factor equals the
   meromorphic side with residue +1 at each lattice point. So (1) and (2) agree for finite products, as
   they must, and the contradiction comes only from the infinite tail. Numeric check of (2) at delta = 0.05
   against direct quadrature, three frequencies, 10 digits: `ref_check.log` item 2.
5. Step 3: (h W_k)^A = 8 C_A Z lambda_k^(1+gamma) gives C_A h lambda_k (h W_k)^(-A) = h lambda_k^(-gamma)/(8 Z); the sum
   over k is at most h/8. Checked. Step 4 (b): the product (X lambda_0/lambda_k + 2 W_k/lambda_k + 1)(2 W_k/lambda_0 + 1)
   expanded term by term; the six terms are as written.
6. Order of choices in Theorem W: D, then h and A and the window; Z (a constant of S); K_0 from (0); the tail
   and its poles in the window, hence B; then k_0 (depends on B, h, R); then K_1 (depends on k_0); then X.
   Every o(X) is for fixed k_0, K_1. No circularity after correction C2 below.
7. CYC against Theorem W: lambda_(k0)/lambda_k = 2^(k0-k) is rational; for k < k_0 every n is k-bad with d = 0;
   the heights add to lambda_(k0) - lambda_0. The spike identity of remark (v) holds numerically
   (`ref_check.log` item 1). So the theorem's only arithmetic step is where the control leaves.

## 2. Numeric cross-checks (second implementation)

`ref_cells.py`: four cells of `radial.json` recomputed by a direct complex product at 60 digits with no
shared code (one pole point and one generic point for e^k, the same for k^3): differences 1.4e-14, 0, 0, 0
at 12 printed digits. A first version of this check read the generic t from the stored float and disagreed
by 4.5 at delta = 1e-20: the stored value is rounded and t log q is of order 1e21 there. The check now
regenerates t from the seed. Consequence for readers: the "t" column of `radial.json` identifies generic
points only through the seed.

## 3. Corrections made during the pass

C1. Lemma P, constant: the first draft bounded int_1^inf log u/(e^u + 1) du by 0.05; it is about 0.2
(at most 0.2194). C_1 corrected. No effect on any exponent.
C2. Theorem W, step 0: the first draft defined Z as the sum over k > K_0 and then chose K_0 using W_k, which
depends on Z. Z is now the sum over all k, fixed before K_0.
C3. Section 4 reading: "ratio 1.386" for e^(k/2) was kappa log 2 = 1.386 (the ratio is 1.65). Corrected.
C4. Section 4, near-common poles of k^3 at theta = 0: the first draft said the offsets separate below
delta = 1e-14; with log q_3 = 27 + 1.35e-11 the phase offset relative to delta log q is
1.2e-13 n/delta. Corrected.

## 4. Points for an independent referee

P1. Theorem W, step 4 (a). Weyl's theorem is applied to finitely many k and gives the density of k-bad n as
exactly 2 W_k/lambda_k. Check that W_k < lambda_k/2 there (it is below lambda_k/8 by (0)) and that no
uniformity in k is used.
P2. Step 4 (b): the crude count uses only the spacing lambda_(k0) of the tested frequencies and the spacing
lambda_k of the lattice; it is where sum 1/lambda_k finite is needed. A referee could try to weaken (W) to
sum 1/lambda_k finite (gamma = 1) with a window of faster decay; the lane did not.
P3. Step 1 assumes meromorphic continuation to a full disc. Continuation in weaker senses is not covered.
P4. The claim "no function meromorphic on C agrees with G on Re s > 1" rests on: G is meromorphic in
Re s > 1/2 (zeta times a locally uniformly convergent product) and a meromorphic function on C that agrees
with it on Re s > 1 agrees on Re s > 1/2 and would continue it across the line.
P5. Sharpness statement (verdict item 2): "no argument that reads only the sizes of the factors can pass
ratio 2" is proved in the sense that CYC satisfies every size hypothesis of Lemma P at kappa log 2 = 1 and
the conclusion fails. For 1 < kappa log 2 with real frequencies and no arithmetic the lane has no example
and no theorem; the sentence should not be read as covering that range.
P6. Literature. Natural boundaries of sparse Euler products and of products with dense local singular
lattices may be on file elsewhere (the lane opened nothing). The map row should carry "elementary; not
checked against the literature".
P7. Section 4, isolation table: float64, a C^3-type window, sizes far from the constants of the proof for
k^2 and k^(1.5). It illustrates the counting step and the CYC failure; it supports nothing else.

## 5. Controls

Section 5 of RESULT.md was rechecked row by row. One control (CYC) leaves at a named step; HQ1, DEL, THIN
are outside the hypothesis class; the theorem is base-blind. R3 is not met and is not claimed.

## 6. Verdict of the pass

Lemma P, Corollary P1, the telescoping example and Theorem W survived the re-derivations with corrections
C1 to C4 entered. Outcome: a natural-boundary row for BR-2 in class (W); no twin there; the remainder of
regime (K) open. No statement about zeros of zeta. Flags R1 = R2 = R3 = R4 = false. Independent referee: owed.

---

# Independent referee pass (lens: general), 2026-11-20

Separate process from the author; the author's pass above is left unchanged. Scratch code was kept outside
the lane (`/tmp/ref_c21br2/chk.py`, `iso2.py`; run through `scripts/memcap.sh 8`, python3.14, mpmath 60 digits
and float64; server not used). Only this file was written.

## R.0 Verdict

**Holds, with one required erratum (E1) and three minor ones.** Lemma P, Corollary P1, the telescoping
example and Theorem W were re-derived line by line and are confirmed. E1 is a misstated definition in step 3
of Theorem W under which the proof as literally written does not go through; the repair is one line and
step 4 (b) already uses the repaired form. The claimed verdict (partial result, natural-boundary row, score
0, no statement about zeros of zeta) is accurate. Nothing assumes RH; nothing restates verified height;
zeta enters only as "a function meromorphic near the line". Flags: R1 = R2 = R3 = R4 = false, as claimed.
Referee count for this lane: 1 (this pass).

## R.1 Re-derivation of each PROVED step

- Lemma P. alpha_p p^-s = p^(-delta) at t = (theta + 2 pi n)/log p: confirmed. Factor bounds confirmed.
  L(delta) = delta int N(x)/(e^(delta x) + 1) dx: confirmed (parts; boundary terms vanish).
  int_0^inf du/(e^u + 1) = log 2 and int_1^inf log u/(e^u + 1) du < 0.2194: confirmed. Exponent
  1 - kappa log 2: confirmed. Uniform in p and n: confirmed.
- Corollary P1. The pole lattices have spacing 2 pi/log q_j -> 0, so pole points are dense on the line;
  those with zeta(1/2 + it) != 0 remain dense; a function meromorphic in a disc that tends to infinity along
  a ray into a point has a pole there; poles are isolated. Confirmed. lambda_(k+1)/lambda_k >= a > 2 gives
  kappa = 1/log a: confirmed.
- Telescoping example. (1 - w) prod_{k <= K} (1 + w^(2^k)) = 1 - w^(2^(K+1)); N_1 = 1/(1 - w) for abs w < 1;
  N(x) = log_2(x/lambda_0) + O(1), so kappa log 2 = 1. Confirmed. The identity itself is CLASSICAL (Euler);
  what the lane adds is its use as a control.
- Theorem W. Expansion of H; window bound abs(T^(xi)) <= C_A h (1 + h abs xi)^(-A); step 0 (exponent
  (1 + gamma)/A - 1 <= -gamma iff A >= (1 + gamma)/(1 - gamma); k lambda_k^(-gamma) -> 0 for a decreasing summable
  sequence); step 1 (poles of H in the closed half-strip lie on Re z = 0, are simple with integer residues;
  Laplace form of the pole kernel; limit 2 pi T(y_i) minus a tail that vanishes as omega -> infinity;
  Riemann-Lebesgue for H_0); step 2 (dominated convergence: the terms with n lambda_k > 2 omega are bounded
  by C h^(1-A) lambda_k^(1-A), summable since A - 1 >= gamma and lambda_k >= 1); step 3 arithmetic
  (C_A h lambda_k (h W_k)^(-A) = h lambda_k^(-gamma)/(8 Z)); step 4 (a) Weyl for finitely many k; step 4 (b)
  product expansion (six terms as written), range lambda_k <= (16/7) X lambda_(k0), remainder
  N(Y)(1 + Y^(1-gamma)) = o(Y); step 4 (c) total X (1/4 + 1/8 + o(1)). Order of choices (h, A, b; Z; K_0; tail,
  poles, B; k_0; K_1; X): no circularity; B does not depend on k_0. All confirmed subject to E1.
- "G continues iff N_1 continues": G = zeta/(N_1 U), U analytic and zero-free in Re s > 0 under (W).
  Confirmed.

## R.2 Errata

**E1 (required; step 3 / step 4 (b) of Theorem W).** Step 3 defines d_(n,k) as the distance from
n lambda_(k0) to the lattice lambda_k Z, and "k-bad" as d_(n,k) < W_k. The lattice lambda_k Z contains 0. For
any fixed n, every k with lambda_k > 2 n lambda_(k0) has d_(n,k) = n lambda_(k0), while
W_k = h^-1 (8 C_A Z lambda_k^(1+gamma))^(1/A) -> infinity. So with the definition as written every n is k-bad
for all sufficiently large k, the set of good n is empty, and the sentence of step 4 (b) "a k-bad n lies
within W_k of a point m lambda_k, m >= 1" is false. Repair: define d_(n,k) as the distance from n lambda_(k0)
to {m lambda_k : m >= 1}. This is the set over which E_n sums (identity (2) has n >= 1 only). Inequality (4)
holds with this definition: the nearest point contributes the first term, the remaining points are at
distances >= lambda_k (j - 1/2), at most two per j >= 1. Step 4 (a) is unchanged for large X (finitely many
k, n lambda_(k0) > lambda_k). Step 4 (b) is then correct as written. With this repair the proof is complete.
The author's own `isolation.py` already uses the repaired form (mask `mm >= 1`).

E2 (minor; Lemma P constant). The hypothesis is stated for x >= 3, i.e. lambda >= log 3. If 2 is in S, the
bound N(x) <= kappa log^+ x + C_0 on [log 2, 1) needs C_0 >= 1, which the hypothesis gives only as
C_0 >= 1 - 0.094 kappa. C_1 changes by at most a bounded amount; no exponent changes. State "C_0 >= 1" or
exclude the prime 2.

E3 (minor; wording of verdict item 2). "No argument that reads only the sizes of the factors can pass ratio
2" is established at ratio exactly 2 by one example. It says nothing about real non-arithmetic frequency
sets with 1 < kappa log 2 (the author's own P5). Keep the sentence restricted to the threshold.

E4 (minor; literature). The Dirichlet series H(z) = sum lambda_k e^(i n theta_k) e^(-n lambda_k z) has
exponents {n lambda_k} of upper density at most sum 1/lambda_k, and the tail over k > K has density tending
to 0. This is the setting of the gap theorems for Dirichlet series (Polya, Bernstein: singular points on
every sufficiently long segment of the line of holomorphy when the exponents have small density). Whether
those theorems apply here (the exponents are not separated) and whether they would give Theorem W, possibly
under sum 1/lambda_k finite alone, was not checked by this referee either. The row must carry "elementary;
not checked against the literature; possible overlap with Polya-Bernstein gap theorems". Not claimed as new
in RESULT.md, so no correction of a claim is needed.

## R.3 Numeric reruns with different cases

| Check | Case (different from the author's) | Result |
|---|---|---|
| Lemma P inequality and slope | lambda_k = 1.1 * 3^k, 60 factors, random phases, pole points of factors 1..4, n in {1, 4, 7}, delta = 1e-1..1e-25 | max(bound - y) = -0.270 (inequality holds in all 300 cells); slopes 0.842..1.353; lemma's lower bound 0.369 |
| CYC | lambda_0 = log 5, 100 factors, same pole points | slopes between -1.9e-15 and 5.8e-15; abs((1 - w) prod(1 + w^(2^k)) - 1) = 9e-44 at a zero of factor 2 with delta = 1e-20 |
| Identity (2) | primes 3, 7, 31, 127, 8191, 131071, 524287, 2147483647, random phases, window (35/32)(1 - u^2)^3, y_c = 2.3, h = 0.7, delta = 0.02 | quadrature and spike sum agree to 11 digits at omega = 13 and omega = 3 log 127 |
| Pole kernel (step 1) | pole off the window centre (y_i = y_c + 0.3), omega = 60 | 3.73838 at delta = 1e-7 against 2 pi T(y_i) = 3.73843 |
| Counting step (author's code, new parameters, nmax = 3000, h = 0.5) | e^k, k_0 = 6 | good fraction 0.928 |
| | k^3 perturbed, k_0 = 8, first 1 dropped | 0.758 |
| | e^(k/2), k_0 = 12, first 2 dropped | 0.710 |
| | CYC, k_0 = 7 | 0.000 |

All agree with the result. The counting rows are float64 illustrations and are not proof inputs.

## R.4 Controls

No zeta-only mechanism is claimed, so there is no mechanism to run against the nine controls. Rechecked:
the theorem is base-blind (DH or a Beurling zeta as base gives the same conclusion), CYC is the one control
that exits at a named step (irrationality of lambda_(k0)/lambda_k; confirmed numerically above: no good n),
and DEL / THIN / HQ1 are outside the hypothesis class. A Beurling system with multiplicatively independent
norms satisfies the theorem unchanged. R3 is therefore not met, as RESULT.md states.

## R.5 Requirement flags (set by this referee)

- R1 false: the arithmetic input is pairwise irrationality of log q_j/log q_k on a sparse set; all primes
  together are not used and multiplicativity of zeta's coefficients is not used.
- R2 false: the conclusion is local at every point of the line but is about non-continuation of G; it gives
  no statement about zeta at any height.
- R3 false: base-blind; passes for Beurling systems with independent norms.
- R4 false: the relative product does not reach the line; nothing is transferred to the critical line.

## R.6 What survives

For an infinite set S of primes with sum over S of (log q)^(-gamma) finite for some gamma < 1 and
abs(alpha_q) = q^(1/2) on S (any phases), G = zeta * prod over S of (1 - q^-s)/(1 - alpha_q q^-s) has no
meromorphic continuation to any disc centred on Re s = 1/2 (proof complete after E1). Lemma P gives
pole-point growth delta^(-(1 - kappa log 2)) when N_S(x) <= kappa log log x + C, kappa log 2 < 1; the
telescoping product at frequencies 2^k lambda_0 is meromorphic at the threshold. Open: sets with
sum over S of 1/log q infinite. No statement about zeros of zeta. Not checked against the literature.
