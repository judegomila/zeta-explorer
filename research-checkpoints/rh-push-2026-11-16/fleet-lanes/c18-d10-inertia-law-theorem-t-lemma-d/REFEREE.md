# REFEREE (lens: general) for c18-d10-inertia-law-theorem-t-lemma-d/RESULT.md

Date 2026-11-19. Verdict of the referee: **the claimed partial result holds** (Theorem Q, Theorem H with Corollary H1,
Theorem G, Lemmas L1, L2, Proposition L3 as an implication, the 600 + 600 zeta-base table). **One error of identification
was found in the secondary material (odd numbers of real zeros): section 3.5 rows, the "parity" paragraph, one control row
and note 3 of section 9 are wrong as stated.** No statement about zeros of zeta is made; RH is not assumed anywhere;
verified height is not used. Flags set by the referee: R1 false, R2 false, R3 false, R4 false.

All referee computations ran locally through `scripts/memcap.sh 8`, single process, each under 15 s, with code written for
this report (python `fractions`, no flint, no reuse of `lib.py`) unless stated. The server was not used.

## 1. Steps re-derived by hand

- Cocycle. psi(w lam)/psi(lam) with sign sgn(w) gives c(s_1) = M(z_1), c(3-cycles) = M(z_1) M(z_12), M(z_2) M(z_12),
  c(w_0) = M(z_1) M(z_2) M(z_12) with M = -b(-u)/b(u). Matches `k2.py` `orbit`. Confirmed.
- Quartet parametrisation. prod (u + a) over a = 1/2 +- eta +- i g equals (u^2+u+c)^2 - E(2u+1)^2, E = eta^2,
  c = 1/4 + eta^2 + g^2; D = {0 < E < 1/4, c > 1/4 + E}. Confirmed. F_1 identity in (eta, g) confirmed by expansion.
- Theorem Q degree bookkeeping. N is of degree 6 in the coefficients of b; these have degree <= 2 in c, <= 1 in E; H is
  linear in N. So entries <= (12, 6), 7 x 7 minors <= (84, 42), e_6 <= (72, 36). Grid 43 x 85 = 3,655 exceeds both bounds
  in each variable; 3,655 - 37*73 = 954. Basis size for degree 12 is 19. Rank histogram sums to 51 lower-rank points.
  The vanishing-on-a-product-grid argument, "rank <= 6 implies e_6 = product of the six possibly nonzero eigenvalues",
  and "constant rank on a connected set implies constant inertia" are correct.
- Theorem H. Product rule L_{b1 b2} = b_1(x) b_1(y) L_{b2} + b_2(-x) b_2(-y) L_{b1} verified by expansion. Linear factor:
  Hermitian Bezoutian of u - r equals -2 Re r (verified, including the complex case with b#(x) = conj b(-conj x)).
  Schur product of two semidefinite kernels of equal sign, multiplication by a rank-one kernel, and antisymmetrisation as
  a Gram kernel are correct. With the pole: L = (x-1)(y-1) L_g - 2 g(-x) g(-y) = (x+1)(y+1) L_g - 2 g(x) g(y) confirmed.
- L1. xi(u)/xi(u+1) = [Xi(u)/Xi(u+1)] (u+1)/(u-1) confirmed. Model: b = (u-1) g gives M = M_0 g(-u)/g(u), and
  g(u) = P(-u) with P(s) = P(1-s) gives g(-u)/g(u) = P(u)/P(u+1). Confirmed. P(s) = P(1-s) forces even degree, so
  Proposition L3 only ever uses even d; consistent.
- L2, L3. Symmetric partial products of the Hadamard product (classical); finite rational expression in values of M;
  limit of positive semidefinite Gram matrices is positive semidefinite. Correct as an implication. RH not used.

## 2. Independent computations (new cases, new code)

| check | referee result |
|---|---|
| Quartet, pole base, exact inertia of the Gram matrix N(p_i, p_j) on 26 real rational points (diagonal by polynomial extrapolation), at (eta, g) = (1/3, 7/5), (9/20, 1/10), (1/50, 40) (none used in RESULT) | (6, 0) in 3 of 3 |
| Quartet outside the strip, eta = 7/10, g = 1 | (4, 2): 2 negative squares, as stated |
| d = 6, new configuration: quartet (2/7, 3) and a pair 1/2 +- 5i/3, pole base | (15, 0), as X(6) predicts |
| Unpaired left pair 1/5 +- 2i: pole base; base -1; base +1 | (1, 2); (1, 0); (3, 0): law and Corollary H1 confirmed |
| Left pair plus a right real zero, base -1; quartet, base -1 | (3, 0); (6, 0) |
| Bezoutian identity 6N = A[LL_+ + 2 LL_-], 30 random real b of degree 1 to 6, own code | 0 failures |
| e_6: product of the listed factors re-expanded in sympy (degrees 22, 28) and compared with the charpoly coefficient of H at 6 off-grid rational points (inside and outside D; uses the lane's `Hmat`) | equal in 6 of 6; rank 6 in 6 of 6 |
| Sign certificates redone: F_1, F_2, F_4 numerators after the substitution (9, 7, 81 coefficients) | all positive (minimum 64, 16, 7372032) |
| F_3 discriminant | no real root (sympy real_roots and numeric roots); leading coefficient negative |
| Theorem G formula, all n^2 x n^2 entries, roots (1, -1/3, 2/5) and (1, -3/4, -1/5, 7/3), against polynomial extrapolation of N | 0 mismatches in 81 + 256 entries |
| Zeta base, independent mpmath implementation of K_0 (80 digits, 14 complex points, no `k2.py`): no insertion; quartet (0.3, 20); quartet (0.45, 3.3); right pair 0.8 +- 2i | 0 negative eigenvalues in each |
| Same, unpaired left pair 0.2 +- 2i | 2 negative eigenvalues (predicted 2) |
| Table of section 5.1 recounted from `inertia_64_96_128.jsonl` | 200/200/200 symmetric; 153/186/195 equal, 47/14/5 below, 0 above; all status ok at 512 bits. Matches |

The mpmath runs are floating point (not ball arithmetic); they are a cross-check of the lane's certified run, not a certificate.

## 3. Errors found

**E-1 (wrong identification; affects sections 3.3 reading, 3.5, 5.2, 8.3, 9; does not affect the headline claim).**
The model insertion is g(-u)/g(u) with g = prod (u + a_j). For odd degree this is **minus** the Blaschke product
prod (u - a)/(u + conj a) used by c17 (`k2.py` `blaschke`). So for an odd number of inserted real zeros the kernel of
b = (u - 1) g is the kernel of M_0 times (-Theta), not of M_0 Theta. The model of M_0 Theta for odd degree is
b = u (u - 1) g. Referee runs, exact:

| object | a = 3/4 | a = 1/4 | a = 11/20, 9/10 | quartet (1/4, 2) with real 3/4 | with real 1/4 |
|---|---|---|---|---|---|
| b = (u-1) g (RESULT's rows; this is -Theta) | (0, 1) | (1, 0) | (0, 1) | (6, 5) | |
| b = u (u-1) g (c17's Theta) | (2, 1) | (1, 2) | (2, 1) | (16, 1) | (15, 2) |
| zeta base, mpmath, c17's Theta | 1 negative | 2 negative | | | |
| zeta base, mpmath, -Theta | 8 negative of 14 | 8 negative of 14 | | | |

With the correct sign the model gives 1 negative square for a real zero right of 1/2 and 2 for a real zero left of 1/2,
with or without a quartet: this is exactly c17's measured law (0.75: 1; 0.25: 2), parity clause included. Consequences:
- The paragraph "The parity part of the measured law of c17 does not hold in the model" and note 3 of section 9
  ("the parity clause should be restricted to the zeta-base measurement; in the model it fails") are wrong. The growth
  with degree (2, 3 at degree 4; 4, 5 at degree 6) is a property of M_0 (-Theta), a different function.
- Table 3.5, rows "single real zero 3/4; 1/4" and "single real zero with a quartet or pairs on the line" (8 of the 75
  configurations) are exact computations for -Theta and are mislabelled.
- Control row "single real zero right of 1/2 ... sign (1 - 2a)(2 - a), Theorem G, n = 2, PROVED in the model": the n = 2
  algebra is correct, but it is not control E1. The conclusion "fails" survives for the correct object (exact (2, 1)
  at a = 3/4, 11/20, 9/10; n = 3, roots {0, 1, -a}), as instances, not as a theorem in a.
- The same sign remark applies to "base -1 / base +1" with odd g (the two labels swap); Corollary H1 covers both, so
  nothing changes there.
Every even-degree statement (Theorem Q, X(d), L1 to L3, the unpaired batch, section 5.1) is unaffected: conjugate pairs
give sign +1.

**E-2 (label).** Section 4, "Corollaries of the same limit argument, unconditional": the second item (upper bound kappa
on the negative index) is conditional on the model law for all degrees, as its own text says.

**E-3 (wording).** Section 9, "closure of the row is equivalent in practice to X(d)": only X(d) for all d => closure is
proved. X(d) quantifies over all symmetric sets and is stronger than what zeta needs; no converse is shown. The step from
T = 0 to the closed chamber rests on Lemma M of c17 and rank-one positivity, which were not re-derived in this lane or
by this referee.

**E-4 (scope of "PROVED in the model" for DH and backward heat, section 5.2).** Corollary H1 is a statement about finite
polynomial b. For DH and the heat family the passage from finite truncations to the entire function is not carried out
(stated in the text for DH; the heat row has the same gap, and the location of the heat-deformed zeros is taken from
c17's non-rigorous run). These rows are ARGUED, as section 4 labels them, not PROVED.

Not verified by the referee: the determinant formula for n = 3 quoted in section 3.6; the 1,500-sample statement on wall
signs; the d = 8, 10, 12 exact instances; the `limit_check` numbers (illustration only, not load-bearing).

## 4. Novelty, RH, verified height

- No step assumes RH. L2 uses only that the nontrivial zeros lie in the open strip and are symmetric.
- No verified-height restatement: the result concerns a kernel positivity that holds or fails independently of the
  location of zeta's zeros on or off the line (a symmetric quartet off the line passes). For the same reason it carries
  no information on zeros.
- Hermite's theorem is cited as classical; L1 is a one-line identity; nothing known is presented as new.

## 5. Controls

No zeta-only mechanism is claimed. Referee runs confirm the opposite: a symmetric off-line quartet passes on the zeta base
(mpmath) and in the model (exact); the pole-free base passes unpaired left zeros (exact). The device does not separate
zeta from symmetric controls.

## 6. Requirement flags (referee)

- R1 false: no prime enters; the kernel depends on the zero set and the pole only.
- R2 false: no conclusion on zeros at any height.
- R3 false: symmetric controls pass; pole-free bases pass everything in the closed strip.
- R4 false: the limit L2 is taken inside one inequality that does not see the critical line.

## 7. Surviving claim

Partial result, no statement about zeros of zeta, row D10 not closed. In the rational model with base (u+1)/(u-1): a
symmetric quartet gives a positive semidefinite apex kernel of rank 6 for all 0 < eta < 1/2, g > 0 (computer-assisted,
exact; independently reproduced at 3 new parameter points and the factorisation at 6 off-grid points). 6N is the
antisymmetrised Bezoutian product, so a base without pole passes for every insertion in Re a >= 0 at every degree.
M = M_0 Xi(u)/Xi(u+1), so X(d) for all even d implies positivity of zeta's apex kernel at T = 0; X(d) is proved for
d = 2, 4, exact at 17 configurations for d = 6 to 12 (16 of the lane, 1 of the referee), open in general. Zeta base:
600 of 600 symmetric insertions positive, unpaired never above the predicted index. Statements about an odd number of
real zeros (table rows, parity remark, control row E1, note 3 of section 9) must be redone with b = u (u-1) g; with that
correction the model reproduces c17's parity clause in the cases tested.
