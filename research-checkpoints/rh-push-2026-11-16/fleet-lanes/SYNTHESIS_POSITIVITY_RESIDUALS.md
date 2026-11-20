# Synthesis: positivity residual lanes (2026-11-16 push)

Scope: four lanes, each with a RESULT.md and a REFEREE.md under
`tmp/research-2026-11-16/push/<slug>/`. This file records only what the referee
confirmed or what survives after the referee's corrections. Lane claims that the
referee did not confirm are listed as not established.

Summary of status:

| Lane | Verdict | Referee: holds as written | Strength | Zero information | Bound moved |
|---|---|---|---|---|---|
| res-sparse-ferromagnet | precise obstruction | no (two PROVED labels in item 4 not confirmed) | 0.12 | none | none |
| res-point-spectrum-square | precise obstruction | no (two statements false as written, one control failure not confirmed) | 0.10 | none | none |
| res-identity-solenoid | precise obstruction | yes (nine non-fatal defects) | 0.10 | none | none |
| res-order-two-nonpoisson | precise obstruction | no (coverage claim not established, one theorem false as stated) | 0.08 | none | none |

In all four lanes the verdict "precise obstruction" survives the referee. No lane
gives information about any zeta zero. No bound on Lambda moves. All numerics are
float64 or mpmath; nothing is interval-certified.

---

## 1. res-sparse-ferromagnet

Files: `res-sparse-ferromagnet/RESULT.md`, `res-sparse-ferromagnet/REFEREE.md`.

### Established (after referee)

1. Within the class of Prop. 2 (spins fixed at -k_p log p/2, bilinear pair
   couplings of either sign on any graph, bounded archimedean couplings,
   c(n) <= e^(C n^2)), the free model is the only pair model reproducing Phi. No
   star-graph ferromagnet exists on the Euler sites.
2. The additive symmetrisation of a prime site has zeros at
   Re s = 1/2 +- arccosh(sqrt p)/log p (a T-NR site). The multiplicative
   symmetrisation is a Poisson kernel outside the Lee-Yang hypotheses.
3. For any graph on prime spins with K >= 0 and
   a_p = (kappa_p + (1/2) sum_q K_pq)/log p = 1/2 for all p, the stage polynomial
   is self-dual with all zeros on Re s = 1/2. The same holds under unimodular
   twists. The Curie-Weiss member (kappa_p != 0, heat time 1/(2 log M) -> 0) is
   included.
4. Every symmetrised finite Dirichlet stage has real off-line zeros of its
   meromorphic continuation (s >= 17.4 for N = 1). Euler stages have zeros next
   to the poles on Re s = 1 (outline plus measurement). A hierarchical block-spin
   step maps the Lee-Yang class into Lambda <= -beta/2.

### Referee corrections

- Thm. 6(d), "Lambda = +infinity for every finite Dirichlet stage", is invalid as
  written. The stage kernel has e^(-5|u|) tails, so its transform is a Fourier
  integral only for -2 < Re s < 3. The real zeros of Thm. 6(b) lie at s >= 17.4,
  outside that strip. For N = 1 the referee counted 14 zeros in the strip
  (0 < t < 60.3), none off the line. For N = 2, 3, 5, 10 there are 1, 4, 4, 5
  off-line zeros inside the strip (float counts), so the step is available there.
- Prop. 7(b) is overstated. "Every hierarchical fixed point has
  Lambda <= -beta/2" and "Phi is not a fixed point" follow only for fixed points
  or pre-images in the Lee-Yang class. For Phi the exclusion is conditional on RH.
- The Curie-Weiss member does not satisfy the kappa = 0 sum rule
  sum_q K_pq = log p. It has kappa_p = (log p)^2/(2 log M) and satisfies
  a_p = 1/2. The theorem is unaffected.
- Attribution: L_chi = E/zeta(s - s0 + 1) for every s0 in the strip is
  ap-global-bridge Thm. C. Seip's unconditional range is 1/2 < Re s <= 39/40.
- Thm. 4's no-go is correct but excludes only limit arguments that use
  convergence on Re s >= 1 + delta, which cannot reach the strip for any
  function. The stages diverge on (1/2, 1].
- Novelty is low: Thm. 3 is the multivariate Lee-Yang theorem evaluated at
  z_p = p^-s, the same mechanism as the Kurasov-Sarnak stable-polynomial
  construction (recalled, not opened). One web search found no source for the
  Dirichlet-polynomial form.
- Prop. 2's "any graph, any sign" holds only inside its stated class.

### Controls

A control fails structurally at stage level. The stage theorem depends only on
K >= 0 and the moduli of the activities. Referee re-measurement (float64):

| Control | Result |
|---|---|
| Davenport-Heilbronn, primes {2,3} | 109 + 110 of 250 zeros beyond 0.05 from the line, none on it. {2,3,7}: 68 + 140. Matches the lane exactly. |
| Backward heat | c*/2: all zeros on Re s = 1/4. -c*: 128 of 167 off Re s = -1/2. |
| E_a | a = 0.4, primes to 11: 201 of 249 off the line. a = 0.3, primes to 17: 55 of 249. a = 0.3, primes to 11 and a = 0.2, primes to 17: 0. |
| One antiferromagnetic edge, a_p = 1/2 kept | 26-33 of about 183 off the line. K >= 0 is used; duality alone does not give the line. |
| Single character, sparse sum-rule (three random graphs, primes 2..23), unimodular twist | All zeros on the line to 2e-13. |
| T-NR at stage level | Not run by the lane or the referee. |

The separation does not reach the limit. The stage theorem holds verbatim for
the unimodular twist U, whose limit has a zero in the strip (ap-global-bridge
Thm. C). No limit step from these stages is valid without using the phases or
the functional equation.

### Not covered

- Non-Euler sites and other spin assignments.
- General graphs at depth > 1; many-body interactions.
- Any limit statement in the strip for zeta.
- The N = 1 Dirichlet stage constant (whether real-rooted for some t < 0 is
  undecided; the referee's float64 attempt was under-resolved and discarded).
- Fixed points outside the Lee-Yang class.
- Whether pair-ferromagnet laws are dense in the Lee-Yang class.

---

## 2. res-point-spectrum-square

Files: `res-point-spectrum-square/RESULT.md`, `res-point-spectrum-square/REFEREE.md`.

### Established (after referee)

This is a consolidation of the cases A3 left open, not a new theorem.

- (V) With an unrestricted Borel function of commuting self-adjoint operators, a
  covariant square exists iff RH. That class has no content. Confirmed.
- (H) For GL_2 over Q (weight 0 at any level, compact quaternionic quotients,
  weight 1/2 on Gamma_0(4) via Waldspurger), no covariant realisation satisfies
  U(log p) + U(log p)* = T_p at almost all primes, because the eigencharacter is
  Eisenstein. Confirmed on GL_2.
- (C) Circle spectra are excluded. Confirmed.
- (P) For 1 <= a <= 4 pi e^(-gamma) the pseudo-Laplacian gives a covariant
  point-spectrum square for the twin sum Z_a = a^s xi*(2s) + a^(1-s) xi*(2s-1),
  not for xi. The mechanism is self-adjointness (existence of the Eisenstein
  series) plus the size of the pole term at s = 1. The Maass-Selberg formula,
  counting law and first zeros (6.97468, 10.40229, 12.42264 for a = 1) are
  confirmed.
- (R) On GL(1) with an integrable, exponentially decaying density, each on-line
  zero is an eigenvalue of exactly one coupling, alpha(gamma) ~ gamma/m_0, and
  each member carries finitely many. R(a)-(c) confirmed (m_0 = 2.0090599,
  F(gamma_1) = -0.15085122, couplings 6.629, 10.210, 21.447). Weights for which
  one member carries all zeros form the family b/(pi|M_c+B|^2); the member with
  M = -Xi'/Xi is Herglotz iff RH.
- (Z) Poles of intertwiners give a real Casimir eigenvalue iff beta = 1; zeros
  of periods give it iff beta = 1/2. This is a reparametrisation of RH,
  conditional on recalled coefficient formulas.

### Referee corrections

False as written:

- Prop. P(b) and verdict item 4. The lane states that -phi'/phi on the line is a
  positive sum of Poisson kernels of the poles rho/2, equivalent to zeta != 0 on
  Re s >= 1. phi has a pole at s = 1. Measured: -phi'/phi(1/2+it) = -3.868,
  -1.907, -0.706, -0.135 at t = 0.05, 0.5, 1, 2, positive only near t = 3. Z_a
  has a real off-line zero for every a > 4 pi e^(-gamma) = 7.0555 (0.5864 at
  a = 7.2, 0.7055 at a = 8, 0.9331 at a = 20; none at a = 1 or 7).
- Thm. R(d) is stated in a Setting requiring an integrable weight. The displayed
  weight has mean about 0.099 on [300,400], so its mass is infinite, the vector 1
  is not in L^2, and the compression to {1}^perp is undefined. The Herglotz
  identity is correct; an integrable variant with B = i/alpha + z/m repairs it.

Overstated:

- "One member carries all iff weight 1/|xi + alpha xi'|^2 (iff RH)". For a
  general even weight, "every ordinate is an eigenvalue" does not need RH. RH
  enters only through the Tate form with non-vanishing W, or the choice
  M = -Xi'/Xi (which also needs simple zeros).

Gap (repairable):

- Thm. H for GL_n, n >= 3. The rule fixes only lambda_p, which does not determine
  the Satake parameters, and residual (Speh) spectrum is not treated. Both are
  repairable by Rankin-Selberg positivity with Luo-Rudnick-Sarnak. The weight-1/2
  case rests on Waldspurger, not on the sources the lane cited. The Ramakrishnan
  7/8 remark is misapplied.

Minor:

- Prop. C is correct; the remark that density alone cannot give it is wrong.
- K_(it/2)(2 pi) is not Polya's function. (2,3,7) is arithmetic over a cubic
  field, not over Q.
- Thm. Z(b) needs zeta(2 rho) != 0, established only for beta >= 1/2. The
  attribution to Zagier was not checked.

Novelty: none. Every part is classical or a direct application. No online search
was run.

### Controls

No control fails structurally.

- The lane's claim that Prop. P fails for DH at a named step is not confirmed.
  The referee found every zero of the DH twin sum with |Im s| < 50 on the line
  and simple (54 sign changes against winding 108.0000 for a = 1; 65 against
  130.0000 for a = 2). That range contains the DH off-line zero at height 85.699.
  The named step (innerness of the quotient) also fails for zeta. A real
  violation needs a DH zero with Re > 1, which has not been located.
- "E_a and T-NR pass" assumes RH for zeta and ignores the poles at 1 +- a. Not run.
- The rank-one family is Euler-blind. Confirmed on DH: zeros 5.0942 to 19.3088
  are eigenvalues at couplings 0.92004 to 3.8557, density ratio 0.07496 at the
  off-line height, off-line zero re-located to 4e-21.
- HEAT, sign-twist, U and Beurling cells were not run by the lane or the referee.
- Theorems V, H, C are no-go statements identical for every control.

### Not covered

- Realisations with no rule at the primes (that class is RH itself by Theorem V).
- Non-Laurent or non-cofinite prime rules.
- GL_n >= 3 and residual spectrum, until repaired.
- Singular rank-one (period) operators in the automorphic setting.
- Compact tori of rank >= 2.
- Non-covariant or truncated realisations.

---

## 3. res-identity-solenoid

Files: `res-identity-solenoid/RESULT.md`, `res-identity-solenoid/REFEREE.md`.

This is the only lane of the four that the referee marked as holding. All PROVED
steps were re-derived.

### Established (after referee)

Classification relative to Kaczorowski-Perelli 1999 (checked against secondary
sources only).

1. Inversion-fixed cosets of the Kronecker line are eps*K, eps in {+-1}^P, with
   symmetry s -> conj s only. Under a degree-1 functional equation (at most one
   pole, on Re s = 1; finite order) K is the only coset of T^P. Real primitive
   characters give countably many lines on punctured tori.
2. U_R (completely multiplicative +-1) and B_1 (Beurling one-parameter subgroup
   through the identity) have prescribed zeros and pass the identity-tied
   properties that do not use the functional equation.
3. On the line: Maslov index theta(T)/pi + O(1), archimedean. Invariants locally
   constant on the full set F(a)F(b) != 0 of a vector space depend only on
   endpoint signs.
4. For finite clusters the trace form is h_{F'}, degenerate exactly at multiple
   zeros, with determinant equal to the discriminant. Definiteness of h_u is
   equivalent to simple real zeros interlaced by u (with a sign convention). The
   shifted pair is Hermite-Biehler iff zeta is zero-free in Re s >= 1/2 + a
   (a >= 1/2 classical; a > 3/8 relative to the 7/8 theorem). A partner with
   count theta(T)/pi + O(1) cannot interlace the zeros of Xi.

### Referee corrections

- Thm. 2 (U_R) is in the literature: Andersson, arXiv 2408.15713, states the +-1
  case for Helson zeta functions with conjugation-symmetric sets. The elementary
  proof in the lane is correct but the construction is not new.
- Control table, TW row: TW+- (real eps_n with |eps_n| <= 1) are not points of
  T^P in general, so Thm. 1(b) does not apply as stated. Only a degree-1
  functional equation is excluded; degree >= 2 is open.
- Control table, HEAT row: backward-heat zeros leave every strip, so the Thm. 6
  range is empty. "Holds with its own zero-free half-plane" is vacuous for HEAT.
  EA and NR ranges are conditional on RH for zeta.
- Thm. 1(b) hypothesis must read "at most one pole, on Re s = 1" plus
  Re mu_j >= 0 for the gamma factor.
- Thm. 5 is proved for finite clusters and polynomial tests only. The
  identification of the bridge form with the Hermitian trace form for the full
  zero set is by formula matching (argued, not proved). 5(v): the common zero
  occurs at or before the merger. 5(vi) needs a sign convention on u.
- Thm. 6: "a > 3/8 unconditionally" is relative to the 7/8 theorem. The de
  Branges norm identity needs the standard side condition, not checked. The
  table row DH a = 0.3085 is a finite difference evaluated at a zero and carries
  no information.
- "None for a = 0.35" is window-limited. By Thm. 6 itself (range a > 0.6204)
  sign changes exist at other heights.
- Lemma R equality is up to O(1). Thm. 3's "which is the functional equation
  (Poisson)" is a heuristic.
- The 3 of 308 unexamined trace-form failures are float64 conditioning (smallest
  relative eigenvalue 2.9e-16 to 9.2e-14 against a 1e-13 threshold), not
  counterexamples.

Not verified by the referee: B_1 numerically; the DH supremum 1.1203625; the
eq48 bridge-form formula.

### Controls

No control fails structurally.

- Without the functional equation, U_R and B_1 pass every identity-tied property
  and have zeros at prescribed points. Reproduced for U_R at s0 = 0.8+5i: winding
  1.0000, E_K(s0) converges to a non-zero value.
- With the functional equation, DH, EA, NR pass every line statement with their
  own zero-free range (EA, NR conditional on RH for zeta). HEAT passes the
  identities with an empty Thm. 6 range.
- DH reproduced with independent code: 17 positive points at t = 85.54..85.86
  for a = 0.25, maximum +15.0849; none for a = 0.35 on [80,92] and [110,118].
- TW and U lack only a degree-1 functional equation.

### Not covered

- Points of T^P with gamma-degree >= 2.
- Thm. 5 for the infinite-dimensional space of exponential tests.
- An interlacing partner u for Xi from an independent source. It must have zero
  count N(T) + O(1), so it must carry S(T).
- Whether S(T) - (1/pi) arg zeta(1/2+a+iT) is unbounded for fixed 0 < a <= 1/2
  (the lane expects yes; not checked by the referee).

---

## 4. res-order-two-nonpoisson

Files: `res-order-two-nonpoisson/RESULT.md`, `res-order-two-nonpoisson/REFEREE.md`.
Referee scripts: `/tmp/ref-o2np/`.

### Established (after referee)

A statement about the estimate system only. It covers three designs:

1. The square-direction probe sum_t rho(n_0 t^2) W(t/Z) of a holomorphic
   half-integral-weight form of weight >= 3/2, level 4N, t prime to 4N
   (Shimura's Hecke relation, re-derived and integer-checked).
2. The O(3) cone count r_3(n_0 t^2).
3. Second-degree rows with a single Kloosterman/Salie index n fixed
   independently of c and mu inserted on the modulus.

In each, the Dirichlet series in the square variable equals
(reciprocal-free factor)/L(s+1/2, chi) by an exact identity. A probe bound at
exponent e is equivalent, up to the amplitude condition, to a zero-free
half-plane Re s > e + 1/2. The unconditional exponent corresponds to abscissa 1.
The Eisenstein normalisation gives 1/zeta(1+4it) on the edge only (recalled,
model).

Confirmed exactly:

- Thm. 1(a): all b, odd c < 70, 45690 coprime cases, 0 failures. The coprimality
  hypothesis is needed (3550 of 10240 non-coprime cases fail).
- Thm. 1(b),(c) and Thm. 2(i),(ii): hand derivations correct.
- Thm. 3(a): re-derived from Shimura's T(p^2) action formula; independent integer
  test on eta(2z)^12/theta^3 against eta(z)^8 eta(2z)^8, 44 cases, 0 failures.
- Thm. 3(b): prime-by-prime proof correct; also held on 374 non-squarefree cases.
- Thm. 3(c): 207 cases, 0 failures.
- The Salie evaluation (Weil index times root count) and
  W(k^2,2;c) = sum_{g|(k,c)} mu(g) U(k/g;c/g).

### Referee corrections

- "Poisson duals are Ramanujan sums or quadratic characters, covering every
  d-dependence (closes a gap in Lemma R)" is not established. Thm. 2(i)-(ii) is a
  change of basis. 2(iii) is a sketch resting on Lemma R, itself a sketch in a
  lane refereed as not holding. Explicit row inside the class:
  b_c(d) = e(ad/c), T = x^2, direct side c_c(x^2+a). Its dual is
  eps_c sqrt(c) S(a, -k^2/4; c) (verified to 1e-10), a root sum of size about c
  (164.2 at c = 101) or 0. This row also carries mu without insertion, through
  the Ramanujan expansion: a fourth entry of the reciprocal, not analysed.
- Thm. 5(ii) is false as stated: weight-3/2 unary theta series are other Hecke
  eigenforms with no surviving reciprocal. The dichotomy survives after repair,
  since they are still characters on squares. Serre-Stark covers only holomorphic
  weight exactly 1/2. The weight-1/2 Maass and Eisenstein spectrum rests on a
  recalled Katok-Sarnak statement. Gelbart-Piatetski-Shapiro was not re-read. The
  necessity of (P1)-(P3) is an analogy, not a proof.
- Control cell TW/M2 ("only the root-count interpretation fails, and no estimate
  uses it") is false. The pointwise bound for the evaluated Salie sum is the root
  count; under eps(p) = -1 the ratio goes from 1.000 to 27.000 at c = 105 (a
  factor 3^omega((t,c)), exponent-neutral).
- Scope gap: the half-integral-weight Petersson/Kuznetsov formula sums over c
  divisible by 4N with theta-multiplier sums. The note treats odd squarefree
  moduli only. The identification of mu(d) in 3(a) with mu(g) in 3(b) is argued,
  not proved.
- Minor: the theta pole needs m and n squares, not mn a square. "EA returns
  1/2+a" presupposes RH; unconditionally it is Theta+a. Section 5 is a sketch.

Novelty: no new mathematics. Thm. 1 is Salie/Iwaniec, 3(a) is Shimura 1973
Cor. 1.8, 3(c) is classical, Thm. 5 is Serre-Stark plus Shimura, M1 is
Selberg/Goldfeld-Hoffstein. The new part is the bookkeeping of the Hecke relation
at squares as an h/r = 1/2 common-scalar design. No literature search was run
beyond recall.

### Controls

No zero statement is made, so no control fails structurally; the system returns
its input.

- DH (computed by referee): off-line zero refined to
  0.80851718245664 + 85.699348485378i, |DH| = 6e-26. There
  |L(s0,chi)| = |L(s0,chibar)| = 0.7022, so the M2 scalar is finite (0.778). Its
  poles are the constituent zeros (0.5+6.1836i, 0.5+8.4572i, 0.5+12.6749i). The
  DH cell for M2 is confirmed: the system sees only the constituents.
- Sign twist (computed by referee): with eps = Liouville the convolution identity
  holds to 1e-9 and the denominator is the twisted product. "Returns its input"
  is confirmed at the level of the identity.
- EA, NR, HEAT, Beurling cells were not computed.

### Not covered

- General b_c(d), including c_c(x^2+a) rows and non-split root sums.
- Weight-1/2 Maass/Eisenstein in Theorems 3(a) and 5(ii).
- Even and non-squarefree moduli and primes dividing 4N.
- Higher rank and lifts to O(2,1), O(2,2).
- Covers of degree >= 4 with quadratic rows.
- Low estimates that are neither norms nor identities.
- M1 with an optimised test function; section 5 error terms.
- "Exactly three mechanisms" beyond the designs written out.

---

## 5. Cross-lane reading

- Structural control failure occurs in one lane only (sparse-ferromagnet), and
  only at finite stage. It is lost in the limit because the unimodular twist U
  passes the same stage theorem and its limit has a zero in the strip.
- In the other three lanes no confirmed structure separates zeta from the
  controls. The one claimed separation in point-spectrum-square (Prop. P against
  DH) was not confirmed: the DH twin sum has all zeros on the line for
  |Im s| < 50.
- In point-spectrum-square (V, Z), identity-solenoid (Thm. 6) and
  order-two-nonpoisson (M2, M3) the surviving statement is an equivalence with a
  zero-free half-plane or with RH. The input is returned as the output.
- Recalled, not re-derived inputs remain in three lanes: Kaczorowski-Perelli
  (secondary sources), Katok-Sarnak, Gelbart-Piatetski-Shapiro, Serre-Stark
  range, weight-1/2 Eisenstein coefficient formulas, Lagarias-Suzuki range,
  Bombieri-Garrett. The route atlas (PR 27) was not re-fetched by the
  point-spectrum lane.

---

## 6. Single most promising next step

Decide whether the closure of pair-ferromagnet laws (any graph, Ising sites)
equals the whole Lee-Yang class, in its chain form:

> A Lee-Yang polynomial is a ferromagnetic chain iff P = wQ + Q* with all
> Schur-Cohn parameters of Q in [0,1).

Reasons for selecting it:

- It is a decidable, finite-dimensional question, and the only open item across
  the four lanes that the lane states in that form.
- It belongs to the only lane with a referee-confirmed structural control
  failure (DH, backward heat, E_a, antiferromagnetic edge at stage level).
- Both outcomes are informative. If the closure is the whole class, a
  sparse-ferromagnet representation of Phi is RH restated with no added
  structure, and the lane closes. If it is a proper subclass, membership is a
  condition strictly stronger than the Lee-Yang property and can be tested
  against the controls.
- Existing evidence is partial and measured only: one proved support example at
  fixed size, and least-squares failures at N = 5, 6.

This is a recommendation, not a referee finding. The lane's own expectation for
the remaining open items in the other three lanes is a further no-go.

Prerequisite repairs before any write-up of this lane: restrict Thm. 6(d) to
stages with an off-line zero inside -2 < Re s < 3 (N >= 2 by float counts),
restrict Prop. 7(b) to the Lee-Yang class, and correct the Curie-Weiss sum-rule
wording.

Secondary closure, low cost: for identity-solenoid, decide whether
S(T) - (1/pi) arg zeta(1/2+a+iT) is unbounded for fixed 0 < a <= 1/2. A yes
closes shifted interlacing partners entirely.

---

## 7. Rows for the obstruction map

| Row id | Route | Class covered (after referee) | Obstruction | Control result | Status | Residual open |
|---|---|---|---|---|---|---|
| OBS-SPARSE-FERRO | Sparse / star-graph ferromagnet on Euler sites | Prop. 2 class: spins -k_p log p/2, bilinear pair couplings of either sign, any graph, bounded archimedean couplings, c(n) <= e^(C n^2) | Free model is the only pair model reproducing Phi. Stage theorem (K >= 0, a_p = 1/2) puts all stage zeros on the line but also holds for unimodular twist U, whose limit has a zero in the strip; no limit step is valid without the phases or the functional equation. | Structural at stage level: DH 109+110 of 250 off the line; backward heat, E_a (a = 0.3, 0.4 at larger M), one antiferromagnetic edge all fail. T-NR not run. Lost in the limit. | Precise obstruction. Referee: holds=false on Thm. 6(d) (N = 1) and Prop. 7(b). Float64, uncertified. | Density of pair-ferromagnet laws in the Lee-Yang class (chain form: Schur-Cohn parameters in [0,1)); N = 1 Dirichlet stage constant; fixed points outside the Lee-Yang class; non-Euler sites; many-body couplings. |
| OBS-POINT-SPEC-SQ | Covariant point-spectrum square (A3 residual cases) | (V) unrestricted Borel functions of commuting self-adjoint operators; (H) GL_2 over Q, weight 0 any level, compact quaternionic, weight 1/2 on Gamma_0(4), Hecke rule at almost all primes; (C) circle spectra; (P) pseudo-Laplacian for 1 <= a <= 4 pi e^(-gamma); (R) GL(1) rank-one with integrable exponentially decaying density | V: existence iff RH, no content. H: eigencharacter is Eisenstein, no realisation. P: realises the twin sum Z_a, not xi. R: Euler-blind; each on-line zero belongs to exactly one coupling; the all-zeros member is Herglotz iff RH. Z: reparametrisation of RH. | None structural. DH twin sum has all zeros on the line for |Im s| < 50; rank-one blindness confirmed on DH. E_a, T-NR, HEAT, sign-twist, U, Beurling not run. | Precise obstruction, consolidation only. Referee: holds=false; P(b) and R(d) false as written; DH failure of P not confirmed; no novelty. | GL_n >= 3 and residual spectrum (two repairs); non-Laurent or non-cofinite prime rules; Hecke-natural period with rank-one function vanishing at the zeros; compact tori of rank >= 2; recalled inputs unchecked. |
| OBS-IDENTITY-SOLENOID | Identity coset of the solenoid / self-dual translates / interlacing partner | Cosets of T^P under inversion and under a degree-1 functional equation (relative to Kaczorowski-Perelli 1999); finite-cluster trace forms; shifted partners | Under inversion alone there are uncountably many fixed cosets eps*K. Under a degree-1 functional equation K is the only coset. Line invariants are archimedean (Maslov index theta(T)/pi + O(1)) or endpoint signs. Shifted pair is Hermite-Biehler iff zeta is zero-free in Re s >= 1/2 + a. A partner with count theta(T)/pi + O(1) cannot interlace the zeros of Xi. | None structural. U_R and B_1 pass all identity-tied properties without the functional equation. DH, EA, NR pass every line statement with their own zero-free range; DH sign change at t = 85.54..85.86 for a = 0.25 reproduced. | Precise obstruction. Referee: holds=true, nine non-fatal defects. U_R is known (Andersson 2408.15713). Global bridge-form identification argued, not proved. | Gamma-degree >= 2 points of T^P; Thm. 5 in infinite dimension; unboundedness of S(T) - (1/pi) arg zeta(1/2+a+iT); an interlacing partner from an independent source. |
| OBS-ORDER-TWO-NONPOISSON | Order-two non-Poisson absorption (Siegel-Weil/Howe, Shimura, Kuznetsov-Petersson with Salie sums) | Three designs: square-direction probe of a holomorphic half-integral-weight form (weight >= 3/2, level 4N, t prime to 4N); O(3) cone count r_3(n_0 t^2); second-degree rows with a single index n fixed independently of c and mu on the modulus | The square-variable Dirichlet series is (reciprocal-free factor)/L(s+1/2, chi) exactly. A probe bound at exponent e is equivalent to a zero-free half-plane Re s > e + 1/2; the unconditional exponent corresponds to abscissa 1. The system returns its input. | None structural (no zero statement). DH: system sees only L(s,chi), L(s,chibar), confirmed numerically. Sign twist: returned unchanged at the level of the identity. EA, NR, HEAT, Beurling not computed. | Precise obstruction on the three designs only. Referee: holds=false; full d-dependence coverage not established; Thm. 5(ii) false as stated (repairable); TW/M2 cell false; no new mathematics. | Row c_c(x^2+a) with non-split root-sum dual and Ramanujan-expansion entry of mu; weight-1/2 Maass/Eisenstein; even and non-squarefree moduli; higher rank; covers of degree >= 4; low estimates that are neither norms nor identities. |

Map-level notes to carry with the rows:

- Add U_R and B_1 to the control table (U_R with the Andersson attribution).
- Correct the TW and HEAT rows of the identity-solenoid control table as in
  section 3.
- Mark the DH cell of Prop. P as "no separation found for |Im s| < 50", not as a
  failure.
- Mark the TW/M2 cell of order-two-nonpoisson as "pointwise root-count bound
  changes by 3^omega((t,c)), exponent-neutral".
- No row changes any Lambda bound or any zero-free region.
