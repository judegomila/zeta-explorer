# REFEREE (independent pass, lens: general): c20-u6ab-rank2-metaplectic-eigenobject-verdict

Date 2026-11-20. Written by an independent adversarial referee who did not write RESULT.md. This file replaces
the author's self-check as the head of REFEREE.md; the self-check is kept unchanged below the line
"Author's self-check (kept)". This pass counts as one referee. The compute server was not used; the rerun
took seconds locally through `scripts/memcap.sh 8` (script kept outside the repo, described in section 3).

## 1. Verdict

**holds = true, as a precise obstruction, with five corrections of wording or label (section 4).**
No statement about zeros of zeta is made. RH is not assumed anywhere. Verified height is not used.
Nothing classical is presented as a new theorem (section 1 of RESULT says "all of it is classical in
content"). Flags set by this referee: R1 = false, R2 = false, R3 = false, R4 = false.

What survives: on O1, O2, O3 the listed conditions (square-integrability, Hermitian parameter, rank-one
truncated-norm positivity for cuspidal data, Rankin-Selberg count) give no condition on the real part of a
zero beyond an identity in the parameter; EIS-w and BLS pass. The double cover (O4) is ARGUED only and the
truncated norm of O2 is not derived; both are stated as such in RESULT and are not part of what holds.

## 2. Steps re-derived by hand

- **O2 constant term (PROVED: confirmed).** Terms v2 = v3 = 0 give 2 zeta(2u) t1^(-u). Zero frequency in v1:
  integral of (t1 x^2 + c)^(-u) dx = t1^(-1/2) c^(1/2 - u) sqrt(pi) Gamma(u - 1/2)/Gamma(u), and
  pi^(-u) Gamma(u) times it is pi^(-(u - 1/2)) Gamma(u - 1/2): term 2 xi*(2u - 1) t1^(-1/2) t2^(1/2 - u).
  Zero frequency in (v1, v2): integral = pi (t1 t2)^(-1/2) c^(1 - u)/(u - 1): term
  2 xi*(2u - 2) (t1 t2)^(-1/2) t3^(1 - u). With t3 = 1/(t1 t2) the third term is (t1 t2)^(u - 3/2), the first
  term at 3/2 - u on Q^(-1): consistent with the functional equation.
- **L2 table (Lemma 2 for O2: confirmed, by a route that does not use the mu coordinates).** With
  a1 = t2/t1, a2 = t3/t2 and measure (a1 a2)^(-1) da1/a1 da2/a2 on the Siegel set, a1^p a2^q is
  square-integrable iff Re p < 1/2 and Re q < 1/2. A = a1^(2u/3) a2^(u/3): iff Re u < 3/4.
  B = a1^(1/2 - u/3) a2^(u/3): iff 0 < Re u < 3/2. C = a1^((3/2 - u)/3) a2^(2(3/2 - u)/3): iff Re u > 3/4.
  These are x < 0, -1/2 < x < 1/2, x > 0 with x = (2/3)(Re u - 3/4), as in RESULT. Three zero cases:
  2u = rho removes A, C fails (Re u < 1/2); 2u = 1 + rho removes B, A and C never both; 2u = 2 + rho removes C,
  A fails. Surviving coefficients xi*(3 - rho), xi*(1 + rho), xi*(2 - rho), xi*(2 + rho) have argument of real
  part > 1 and are not at a pole: non-zero. Confirmed.
- **Lemma 3 (confirmed).** O2: multiset {(x - 1/2, y), (x + 1/2, y), (-2x, -2y)} equal to its image under
  mu -> -conj(mu) forces x = 0 if y != 0, and x in {0, 1/2, -1/2} if y = 0. So 2u = 1 + rho is Hermitian iff
  beta = 1/2 and the other two cases never. O3 with f tempered: p^(conj z/2) must equal p^(z/2) or p^(-z/2)
  for all p: z real or Re z = 0. O1: Re z = 0. The statement "identity in the parameter" is correct: the
  Hecke eigenvalues depend on u only, and the same series at a parameter that is not a zero has the same
  property table.
- **Lemma 4 algebra (confirmed).** xi*(z)/xi*(1 + z) = [(z + 1)/(z - 1)] xi(z)/xi(1 + z) with xi entire; the
  second factor has zeros at rho (Re > 0), poles at rho - 1 = -conj(rho') (Re < 0), modulus 1 on Re z = 0, and
  decays like x^(-1/2) on the real axis, so no exponential factor: Blaschke product. Theta_f: three gamma
  ratios, decay x^(-3/2): confirmed. Base: u = e^(zr) + M e^(-zr), u'(0) = -u(0) gives M = (z + 1)/(z - 1);
  u'(r)/u(r) = z(1 - S)/(1 + S) with S = T^(-z) M at r = (log T)/2: confirmed. Sign: d/d(lambda)(u'/u)(r) =
  -(integral of u^2)/u(r)^2 for -u'' = lambda u, lambda = -z^2, so u'/u is increasing in z^2: Nevanlinna in
  z^2, the convention of Theorem B. The diagonal form of `checks.py` part C equals
  abs(1 + S)^2 Im N / Im(z^2) exactly, so "diagonal only" is the full Nevanlinna condition, not a weaker test
  (weak step 3 of RESULT understates this).
- **Theorem C at T = 1 (independent exact check).** With n = (1 - S)/(1 + S), multiplication of S by the pair
  factor gives N' = [(w + c) N + 2 alpha w]/[2 alpha N + w + c], w = z^2, alpha = Re a, c = abs(a)^2. At T = 1,
  N = -1 and N' = ((2 alpha - 1) w - c)/(w + c - 2 alpha), whose derivative has numerator
  2 alpha abs(a - 1)^2 >= 0: Nevanlinna for every a in the right half-plane. Consistent with Theorem C.
  Theorem C in general was not re-proved here (it carries two independent passes in row D9).
- **Lemma K and K' (confirmed).** Classes of joint eigenvectors with distinct eigencharacters are linearly
  independent in V/W; at most k. K' is the statement that an eigenvalue is in the spectrum; holomorphy is
  not needed.
- **Lemma 5 (conclusion confirmed, display wrong; correction 1).**

## 3. Numerical rerun with different cases (mpmath 30 digits and float64; not ball arithmetic)

- Epstein, new form Q = diag(1/18, 6/5, 15), three checks the lane did not make:
  (i) direct lattice sum over 1.49e6 points at u = 4.5 + 0.7i (independent of the theta splitting) against
  A + B + C: relative difference 1.4e-13; the lane's theta-splitting routine agrees with both.
  (ii) other zeros: 2u = rho_2: abs(A) = 1.3e-37, residual 4.6e-10 on size 1.2e-5; 2u = 1 + rho_5:
  abs(B) = 8.7e-41, residual 5.0e-12 on terms 1.5e-10 and 1.3e-10; 2u = 2 + rho_4: abs(C) = 2.2e-40, residual
  6.4e-12 on 1.2e-8. Generic 0.8 + 3i: residual 2.0e-9 on 0.30. Residuals are of the size
  exp(-2 pi sqrt(12.5)) = 2e-10 expected for the ratio t3/t2 = 12.5 (the non-constant terms do not carry the
  gamma decay of the constant terms, which is why the relative residual is 4% at rho_5; not a discrepancy).
- Maass-Selberg diagonal, 3e5 float samples with log-uniform heights 1e-3 to 1e2, T - 1 from 1e-4 to 1e2,
  one to four pairs with real and imaginary parts down to 1e-3: base min 2.4e-9, pairs min 4.3e-8, both >= 0.
  Single real factor with a in (0, 1): min 2.0e-4 >= 0. Single real factor with a > 1: min -7.4e5 (fails, as
  the exact T = 1 formula w(a - 1)/(w - a) predicts). Zeros of Lambda(., Ad f) lie in (0, 1), so the caveat
  of RESULT is the right one and its sample is in the relevant range.
- Controls run by this referee on the true coefficient (400 points, mpmath): S = T^(-z) xi*(z)/xi*(1 + z):
  min 0.034 > 0. ZQ (the pairs at rho_1, rho_2 divided out and the quartet 0.9 + i g, 0.1 + i g,
  g = (gamma_1 + gamma_2)/2, inserted): min 0.033 > 0. The inequality does not see the move off the line.
  EIS-w: the L2 and Hermitian tables above were derived for general u, so the control passes by the same
  computation. BLS: passes by the pair samples. T-NR and E_a were not run numerically here (taken from D9).

## 4. Errors and corrections

1. **Lemma 5, displayed factorisation is inconsistent.** RESULT writes L(s, Pi x conj-dual Pi) = product of
   L(s + w_i - conj(w_j), pi_i x dual pi_j) and then poles at real part 1 - Re(w_i - w_j). The L-function with
   non-negative coefficients (the one the Luo-Rudnick-Sarnak count needs) is L(s, Pi x conj(Pi)) = product of
   L(s + w_i + conj(w_j), pi_i x dual pi_j), poles at real part 1 - Re(w_i + w_j), local poles at real part at
   most theta_i + theta_j - Re(w_i + w_j). The product Pi x dual Pi (shifts w_i - w_j) has non-negative
   coefficients only when Pi is Hermitian. With the corrected product: P = 1 + 2 max(-Re w_i),
   beta_0 <= 2 max(theta_i - Re w_i), so P - beta_0 >= 1 - 2 max theta_i for any data, and for trivial pi the
   constraint is void. The conclusion (shift-independent) stands and is slightly more general than stated.
   Label: PROVED-rel Jacquet-Shalika after this correction; as displayed it is not a correct derivation.
2. **"O3 is the lowest-rank linear non-Borel object in which zeta in the strip occurs" (sections 1, 2) is
   false as worded.** O2 is induced from P_(2,1) on GL(3), is non-Borel, and carries xi*(2u - 1) at a strip
   argument. Correct wording: lowest rank with cuspidal datum on the Levi.
3. **Table row E_a is over-labelled.** With the non-cuspidal datum E(., 1/2 + a) the object is the Borel
   series of GL(3); the cuspidal inner product formula of S4 does not apply (its truncated norm is the rank-2
   Gram form of row D10, not closed), and the coefficient has poles at z = 1 + a and 1 - a, not at 1, so S3 as
   worded is not met. What is true: the truncated norm of a group object is a norm, so positivity holds
   trivially where the series is holomorphic. Label ARGUED, not "PROVED-rel induction in stages".
4. **Table rows T-NR and ZQ labelled PROVED / PROVED-rel are relative to D9 Theorem C** (recalled from the
   map, not re-derived in the lane). Label PROVED-rel D9 for both. (ZQ was confirmed numerically here at one
   quartet.)
5. **Lemma 2 for O1, O3 and the O3 inner product formula** (four terms, w phi = phi, sign +) rest on recalled
   Langlands-Shahidi formulas that neither the lane nor this referee opened. The sign matters (phi = -M
   fails (I)); it is fixed by Gindikin-Karpelevich for the everywhere-unramified vector and by the fact
   that a truncated norm of a group object is non-negative, so the risk is low. Label stays PROVED-rel.

Not errors, recorded: section 3.4 (truncated norm of O2 at 2u = 1 + rho) is not derived and the lane says
so; this is the one place where a zero gives a parameter on the unitary axis iff beta = 1/2, and it is open,
inheriting row D10. Section 5's reduction of cell (b) is a statement about classes examined, not a
classification (the lane says so). O4 is ARGUED only.

## 5. Requirement flags (strict)

- R1 false: no step uses multiplicativity beyond classical non-vanishing at real part >= 1.
- R2 false: no height-uniform conclusion is derived.
- R3 false: EIS-w, BLS, ZQ pass every step (confirmed here); no zeta-only mechanism is claimed.
- R4 false: no passage to the critical line.

## 6. Surviving claim

Cells U6 (a) linear and U6 (b): precise obstruction, no candidate. On O2 (PROVED) and O1, O3 (PROVED-rel
recalled Langlands-Shahidi formulas and D9 Theorems B, C): zeta in the strip is read as a numerator zero
only; no zero-indexed object is square-integrable; the Hermitian condition is the identity
x = (beta - 1/2)/3; the O3 truncated-norm inequality is the rank-one D9 form and holds for every placement of
non-real zeros; the Rankin-Selberg count is shift-independent (with the product corrected as in item 1);
Lemma K holds. Not established: the double cover (ARGUED), the truncated norm of O2 (not derived, row D10),
row E_a (ARGUED).

---

## Author's self-check (kept)

### Self-check: c20-u6ab-rank2-metaplectic-eigenobject-verdict

This is not an independent referee pass. It was written by the lane's author after RESULT.md; it counts as
zero referees. It lists what was re-derived, what was only recalled, and what an independent referee should
attack first.

### Verdict of the self-check

The result holds as stated within its labels. No statement about zeros of zeta; RH not assumed; verified
height not used; nothing classical presented as new. Flags R1 = R2 = R3 = R4 = false.

### Re-derived

- O2 constant term: Poisson summation in the first variable gives sqrt(pi) Gamma(u - 1/2)/Gamma(u) and
  pi^(-u) Gamma(u) times it is pi^(-(u - 1/2)) Gamma(u - 1/2) pi^0, so the second term is 2 xi*(2u - 1); the third
  likewise. Confirmed numerically (checks.py part A) with the incomplete-gamma splitting, which does not use
  the constant-term formula. Residuals match the expected size exp(-2 pi sqrt(ratio)) (4e-17 at ratio 36,
  2e-14 at ratio 25).
- Exponent map: the residue at u = 3/2 is the constant function, exponent -rho_B = (-1, 0, 1) = mu_C at x = 1/2;
  functional equation swaps A and C. L2 criterion applied to real parts. 57 cases recomputed by script.
- Lemma 3 for O2: {nu + 1/2, nu - 1/2, -2 nu} = {-conj(nu) - 1/2, -conj(nu) + 1/2, 2 conj(nu)} modulo
  2 pi i/log p for all p forces Re nu = 0 or nu = +-1/2.
- Lemma 4: four-term formula with w phi = phi; unimodularity of Theta_f on the axis from Lambda(s) = Lambda(1 - s)
  and real coefficients; Blaschke form. Base case: with u = e^(zr) + M e^(-zr), u'(0) = -u(0) gives
  M = (z + 1)/(z - 1); z(1 - S)/(1 + S) = u'(t/2)/u(t/2) with t = log T.
- Lemma K: linear algebra, three lines.

### Not re-derived (recalled)

- Shahidi's constant-term and Whittaker-coefficient formulas for O1, O3 (normalisation of z; the exact form of
  A(p, 1) is quoted up to normalisation and is not used).
- Langlands' inner product formula for cuspidal data on a maximal parabolic.
- Theorems B and C of row D9 (taken from the map text).
- Gelbart-Jacquet, Jacquet-Shalika, Moeglin-Waldspurger.
- Everything on the double cover (Kazhdan-Patterson, Gao, Brubaker-Bump-Friedberg).

### Corrections made during the self-check

1. First draft of the O2 truncated norm used a product-of-denominators formula for two exponents; its AA term
   has a negative coefficient and grows, so the formula is not the truncated norm of a residual series. The
   paragraph was removed; section 3.4 now says the form was not derived and points to D10.
2. checks.py part D is a trivial loop and is not evidence for Lemma K; RESULT section 8 says so.
3. "Theorem C covers the base" required the base (z + 1)/(z - 1) to be in the class; the Sturm-Liouville
   identification was added, and the caveat on real zeros of L(., Ad f).
4. DH row: D9 reports no failure below height 2000; the failure at zeros with real part > 1 is by the
   classical existence statement, not by a located zero.

### For an independent referee, in order

1. Section 3.4: derive the truncated norm of the degenerate P_(2,1) series (Jacquet-Lapid-Rogawski regularised
   formula) and test the two-exponent form at 2u = 1 + rho against a symmetric off-line quartet (ZQ).
2. Lemma 4: open a source for the inner product formula and confirm the cross terms for datum f x f; confirm
   Theorem C of D9 covers infinite products with the pole factor.
3. O4: open Gao's formula for the theta datum and decide whether the coefficients are those of O2 at a doubled
   parameter exactly.
4. Table row E_a: confirm that induction in stages gives M with the stated zeros and that row D9's "E_a passes
   as a group object" applies.
