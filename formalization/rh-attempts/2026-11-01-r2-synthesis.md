# Direct RH attempts, round 2 (2026-11-01): synthesis

Internal working note. Not externally refereed, not committed upstream. Data module:
`src/data/rh-direct-attempts-r2-2026-11-01.js` (`RH_DIRECT_ATTEMPTS_R2_ASSERTIONS`). Round 1:
`2026-11-01-synthesis.md`, `src/data/rh-direct-attempts-2026-11-01.js`.

**Verdict.** Round 2 ran the five attempts proposed at the end of round 1. Each was written out as a complete argument
aimed at RH, then attacked by a fresh-context referee. All five fail. No argument survived, so none went to a second
referee and none is reported as a candidate. RH is open. Platt–Trudgian Λ ≤ 0.2 stands. No Λ bound and no zero-free
region changes. NO QED.

All referees are instances of the same model family. None of this is external review, and no number is interval-certified
unless stated otherwise.

## 0. The PR #27 audit

All five round-2 files were written after the audit snapshots `/tmp/atlas-snap-*.md` existed (snapshots 13:40; final files
18:42–19:15). Each file cites the atlas sections it overlaps:

| attempt | file | lines | atlas sections cited |
|---|---|---|---|
| harmonic floor | `2026-11-01-r2-harmonic-floor.md` | 985 | §2, §3, §9, §10, §11; arithmetic-foundation §2; Suzuki §4 |
| Stepanov auxiliary | `2026-11-01-r2-stepanov.md` | 1222 | §7 (shown not to apply), §9, §10, §11 |
| density profile | `2026-11-01-r2-density-profile.md` | 846 | §9, §10 (PR #14 / Xu–Sang), §11 |
| modular tower | `2026-11-01-r2-modular-tower.md` | 1610 | §9, §11, route 27 (O2, O3) |
| phase alignment | `2026-11-01-r2-phase-alignment.md` | 1557 | §9 (RES-T B3), §10 (V7 floor), §11 |

## 1. The five attempts

### 1.1 Harmonic floor for the compressed Weil operator (N1 of round 1)

* **Claim.** The compressed form q_λ equals a positive-kernel average of an odd harmonic potential of ξ_X on
  σ = ½ + κ/log X (Theorem H2). A Harmonic Floor Lemma (HFL, Step 4) would then give the V7 floor at p = 0, and so RH.
* **Failing step (referee).** Step 4, part (4d), the anchor line. The minimum principle and Harnack's inequality only move
  a lower bound from one line to another, so some line must already carry a floor. The fixed-distance branch (σ = ½ + c)
  is **false**. The referee proved this unconditionally at t = 0 by a Landau–Ingham argument:
  H_g(½+c)|_{t=0} ≤ −(1/|c+iγ₁| − o(1))·X^c/log X for infinitely many X, for every completion g. The sieve to 10⁷ measures
  about −0.7·X^c/log X in every decade. The η′ = κ′/log X branch is HFL itself, so using it is circular.
* **Reduces to.** RH in Landau's one-sided form, Σ_{n<X} Λ(n) n^{−1/2} ≤ 2√X + C(log X)^m. This is round-1 Theorem E, the
  arithmetic-foundation §2 target, the Suzuki §4 signed credit prefix, and the first item of the atlas closing line. The
  full step also needs the pointwise symbol floor uniformly for |t| ≤ e^{O(√X)}, which is beyond what RH gives by known
  methods (wall 4).
* **Twin tests.** Davenport–Heilbronn: every Dirichlet series has a zero-free completion exp(Σ_{n<X} …), the identities
  hold to 3.7e-13, and the Rayleigh quotients fall from −3.09 to −52.95 (2a = 6 to 12). The fall matches the off-line
  pair term −2(sinh(2δa)/(2δ) − a)². Genus-2 fake over F₅ (P = 1 + 11T² + 25T⁴): a_d ≥ 0, a functional equation and no
  real zeros, with an off-line zero at Re s = 0.6378. So Steps 1–3 and (4a)–(4c) are soft and carry no RH content.
* **Salvage.** H1–H4; H5 (RH ⟺ the corrected Euler products are bounded above on compacts in σ > ½ ⟺ one-sided real prime
  sums); H6 (q ≥ q♮, with equality iff RH); the exact t = 0 identity; Theorem F2 as a constraint on proof templates; the
  referee's unconditional t = 0 result above.
* **Referee corrections.** §4.4(ii) σ_X(0) = −log X − 2G⁻(X) + O(1), not −log X + O(1). Remark H5.1 should cite square-root
  precision (a zero-free-region statement), not sieve parity. Round-1 Theorem E(ii) constant is −1.

### 1.2 Stepanov-type auxiliary Dirichlet polynomial (N2 of round 1)

* **Claim.** Target (★): Σ_{n≤X} Λ(n) n^{−1/2} ≤ 2√X + C(log X)^m, which gives RH by Landau. Method: a Bombieri–Stepanov
  transplant using dimension counts only. Legendre's formula Λ∗1 = log replaces the Frobenius substitution losslessly.
* **Failing step (referee).** Step 5, on both branches.
  * Branch S (Type-I/Selberg majorant): Claim 5S is **false** in the class covered. Theorem P: since 1 − λ ∈ {0, 2}, every
    Type-I majorant of level ≤ X·exp(−C(log log X)²) with polylog coefficient sums has B(W) ≥ (4 − o(1))√X. Under the
    7/8 half-plane, Theorem P′ extends this to coefficient sums up to X^{η/8−ε}. Downstream, Step 6(S) is wrong as
    written: it bounds only the window (√X, X], so Landau gives only Re s > 3/4.
  * Branch C (Legendre auxiliary at full level): Claim 5C (ℓ¹ mass ν₁(x) ≤ C√x(log x)^A) is **unproved** and implies RH
    (Prop. 6.2). Whether RH implies Claim 5C is open.
* **New measurement (referee).** With full support N = x, ν₁(x) = (1.01 ± 0.03)√x for 8·10³ ≤ x ≤ 10⁶, with no log growth
  and ν₁/√x ≈ 1.012 + 0.118(ψ(x) − x)/√x. The attempt's "ν₁ ≈ 0.14√x log x" was an artefact of its support cap N ≤ 4√x.
  The actual minimizers have max|c_k| ≈ 0.1√x near k ≈ x/4, so the "polylog entries" route of §4.5 fails for them.
  Double precision, not interval-certified.
* **Reduces to.** Branch S: the Selberg sieve parity barrier; breaking it at frequency 0 is the Mertens problem. Branch C:
  RH itself, in x-space form; in content it is wall 4 (control of the Möbius-weighted sawtooth at each x).
* **Salvage.** Theorems P and P′; Prop 5.3 (Λ_k overshoot tends to k); Lemma 3.2 and Theorem 3.4
  (lcm(1..x) = ∏⌊x/k⌋!^{μ(k)}, lossless substitution); Lemma 4.4; Prop 6.2 (prime-free ψ(x) ≤ x + ‖c‖₁K(x) for every
  valid c); Props 6.3–6.8 (Θ ≤ ν* ≤ 1, certificate exponents give zero-free half-planes); Prop 2.1.

### 1.3 Density-profile bootstrap (N3 of round 1)

* **Claim.** Iterate the full zero-density profile A(σ) through the 7/8 machinery and the Xu–Sang gates; Step 7 claims a
  contraction B(Φ(R)) ≤ B(R) − m(B(R)).
* **Failing step (referee).** Step 7 is **false**. From the paper's low side alone,
  σ_low = max(5/6 + M/12 − ℓ/6, 23/24 − M/6 + 5ℓ/24) ≥ 13/15 on M + ℓ ≤ 1, with equality at the vertex (2/5, 0, 1/5). So
  B(R) ≥ 13/15 for every profile, GRH rows included. The first unproved step in the written chain comes earlier: Step 3
  below 7/8 is graded READ, but Lemmas 10.3–10.5 and Prop 2.1's hypothesis (2.2) (the local Euler correction H_η) are
  stated only on Re s ≥ 7/8.
* **Reduces to.** Going below 13/15 needs three things at once: a signed non-count floor sum (the atlas's all-scale signed
  estimate), a new cubic-theta estimate removing the zero-loss excess, and family zero density strictly below DH at
  Re s ≤ 2/3 (Corollary D3: A(2/3) < 2 at B = 13/15), which is open even for ζ. Theorem Q: even with both zero-blind
  obstructions removed by oracles, a uniform saving s gives B = 13/15 − 4s/(5(5 − 6s)), down to the low-side floor 5/6.
  So this architecture cannot reach RH at all. The density-to-single-zero passage is wall 4.
* **Referee corrections.** (E1) The alternative contour Re w = a + 6e is admissible; it lowers Remark Q4's MODEL values to
  5/6 and gives 0.8480078 < 28/33 at δ_f = 1/50, s = 0.1, so Prop Q3's "attained" holds only as δ_f → 0. (E2) Corollary
  Q2 should be graded ARGUED. (E3) "Every nonempty bin with δ ≤ 1/3" holds at amplitude x = 1/2 only. (E4) The large-sieve
  route in Lemma M gains nothing at any length. (E5) Theorem P's strict inequality has infimum 13/15.
* **Salvage.** Theorem P; Corollary D3, now necessary on the whole region M + ℓ ≤ 1; Theorem Q at amplitude ½; Corollary
  Q2 (ARGUED); paper-system value 0.8749570698 (MODEL below 7/8) and 167/192; Prop Q3 in the limit; Remark Q4 for
  δ_f ≤ 0.7. Xu–Sang values not checked (PR #14's encoding is unverified).

### 1.4 Modular tower X₀(N) × X₀(N) with Hodge index at every level (N4 of round 1)

* **Claim.** Theorem 3.1: if the Weil classes D_F are asymptotically isometrically representable in NS(X₀(N)²)
  (hypothesis (Rep)), Hodge index at each level plus a limit gives RH.
* **Failing step (referee).** (Rep). Proposition 3.2: (Rep) ⟺ RH. Theorem 3.1 uses Hodge index only to say the target
  form is definite, so any sequence of Euclidean spaces gives the same implication; the tower adds nothing to it. The
  tower cannot refute (Rep) either, since under RH its own Hecke idempotents give a dictionary (Prop 4.15(i)). What is
  proved is non-existence inside specific construction classes.
* **What the tower can carry.** Eisenstein confinement (Theorem 4.5): ζ is the H⁰ ⊕ H² part of every X₀(N), and its prime
  sum is a degree, which Hodge index never constrains. Theorem 4.13 (Schwartz spectral synthesis plus the six exponentials
  theorem): a continuous dictionary exactly equivariant for three primes through operators with algebraic eigenvalues
  factors through finitely many Tate moments ∫F x^k e^{λx}; in the tower only the pole functionals d(F), d′(F) survive
  (Corollary 4.14). This is route-27 obstruction O2 stated exactly. Archimedean Green terms converge at rate O(log p/p)
  to a limit with no ζ-zero content (Theorem 6.1, C₀ = 0.8671324277206646).
* **Twin tests.** Every step before (Rep) holds verbatim for the DH Weil form. Along the heat flow, (Rep_t) ⟺ RH_t, which
  fails for t < 0. So (Rep) is exactly the flow-unstable content and the attempt supplies none of it.
* **Reduces to.** RH itself as Weil positivity (NS-RIGID's "RH itself" branch). In the Hecke picture: every Eisenstein
  Satake point Kron(γ_ρ) = (cos(γ_ρ log p))_p lies in the Ramanujan cube (via the argued Lemma 4.11(iii)).
* **Referee corrections.** Theorem 6.1(iii)'s s = 1 remainder needs a Kloosterman argument (supplied, p²R ≈ −0.0035);
  Lemma 4.11(iii) only argued, so Prop 4.15(ii) is unproved; Decision 2 overstates "only the scattering coefficient";
  Prop 4.7's "iff" needs every length K.

### 1.5 Phase alignment forced by an off-line zero (N5 of round 1)

* **Claim.** An off-line zero ρ₀ = ½ + δ₀ + iγ₀, through the Euler product, forces prime-phase alignment at the visibility
  length N_vis ≈ (2δ₀ log γ₀)^{1/δ₀}; transport it (Lemma T) to a short support where the bound holds for every phase
  vector, and contradict.
* **Failing step (referee).** Step 3, Lemma T. It is RH-strength, not a reduction: by round-1 Lemma L, not-(2b) at the
  single height γ₀ is already a half-plane Re s > ½ + θ with θ < δ₀. Theorem MT (proved by the author, re-checked): for
  δ₀ ≤ 3/8 a completely multiplicative unimodular f has F₁ = Σ f(n)n^{−s} with exactly one zero at ½ + δ₀ in Re s > ½,
  zero-free harmonics, and the round-1 alignment; Corollary SF: arbitrary phase changes on any finite set of primes keep
  this. So the Euler product alone puts no constraint on short-length phases. Measured at γ₀ = 3·10¹², δ₀ = 3/8: margin
  ≥ 90.5, still ≥ 80.7 with every prime ≤ 6,420 set adversarially.
* **Earlier non-fatal error (referee E1).** Step 2(a) drops the pole term P/(2m) ≈ δ₀e^a cos(·)/γ₀² of ζ(s + iγ₀). It is
  negligible for 2a ≲ 4 log γ₀ but reaches 260 at 2a = 128 and 10⁵ at 2a = 140, so (A) is not forced at large supports.
  The same omission breaks Theorem MT(e) and Corollary SF "eventually in a" (E2), and Corollary SF's list of shared
  properties holds only in the strip |Im s| < γ₀ (E3). Referee sketch, unverified: for unimodular f a pole at 1 − iγ₀
  forces f to pretend to be n^{−iγ₀} (Halász), and a real phase perturbation that plants a zero at β₀ + iγ₀ then also
  plants a pole at β₀ − iγ₀ (conjugate Fourier modes), the point where ζ itself has the conjugate zero. This matters only at lengths ≫ γ₀.
* **Reduces to.** (★_min) at some support a ≥ a_rig at every height H > 3·10¹² and every δ₀ ≤ 3/8: the pointwise / MV-CAP
  wall (RES-T B3). Over all supports, via Lemma L, the V7 floor with p < 2δ₀ (atlas §10); over all δ₀, RH. Proposition PD
  caps 3–4–1 positivity at log₁₀ γ₀ < 6.667; T4 (mollifier zero detection) misses by a factor 45–829.
* **Salvage.** Lemma E, NFT(1)–(2), PD, PD′ (at 2a′ < log 2), Lemmas J and F, Corollary PI, Props OA and DH-P; Theorem MT
  (a)–(d), (f); Corollary SF on 2a ≲ 4 log γ₀ and |Im s| < γ₀.

## 2. What the five failures have in common

1. **Same terminal objects as round 1.** Every failure lands on the first two items of the atlas closing line:
   * the one-sided Landau / Chebyshev bound at square-root precision (harmonic floor at t = 0; Stepanov Branch C; phase
     alignment over all supports via Lemma L);
   * the pointwise / MV-CAP wall (harmonic floor uniformly in t; density-to-single-zero passage; Lemma T at one height);
   * RH itself as Weil positivity (modular tower (Rep)).
2. **Soft parts are now shown soft by explicit counter-models.** DH plus the exp-completion (harmonic floor), the genus-2
   F₅ fake, the DH Weil form on the tower, and Theorem MT's multiplicative twin all satisfy every step before the failing
   one. In each attempt the failing step is the first place where ζ's own arithmetic is needed.
3. **Size-only estimates hit fixed floors.** Sieve parity (Theorem P, (4 − o(1))√X > 2√X) and the zero-blind 13/15 low
   side (density Theorem P) are both size-only; Theorem Q shows that even oracle removal stops at 5/6.
4. **Equivariance sees only poles.** Theorem 4.13 / Corollary 4.14 and Theorem MT say the same thing from two sides:
   structure that is exactly symmetric (Hecke-equivariant dictionaries; torus-valid phase arguments) cannot see the zeros.
   What is needed must couple the Euler product to the functional equation at the height of the zero.
5. **One new numerical lead.** Stepanov Branch C, at full support: ν₁(x) ≈ 1.01√x with no log growth for x ≤ 10⁶, and its
   fluctuations track ψ(x) − x. Claim 5C is numerically consistent with A = 0. It is RH-hard (Claim 5C ⟹ RH), but it is a
   finite-dimensional LP quantity with an explicit dual, which none of the other reductions is.

## 3. Survivors

None. No argument survived its referee, so no second referee was run and no candidate is reported.

## 4. Next five attempts

Each is chosen to avoid the specific failure found in round 2. None has been run; all are proposals.

1. **Dual rigidity of the Legendre LP (from Stepanov Branch C).** Bound the dual of the Legendre certificate LP: by
   Prop 6.2–6.3, ν₁(x) is the maximum of a linear functional over dual-feasible sequences b ≥ 0 that satisfy the
   ⌊x/k⌋ (integer sawtooth) constraints, and the true primes are dual-feasible. Prove every dual-feasible b has
   ψ_b(x) − x ≪ √x (log x)^A. *Avoids:* Branch S parity (no sieve majorant) and the polylog-entries step that the referee
   refuted for the actual minimizers; uses the O(1) sawtooth that Beurling systems lack. *First test (decisive):* the
   plant-a-zero test. Build a dual-feasible b from ψ with one planted off-line zero, as Theorem MT does on the torus; if it
   is feasible at x ≤ 10⁶, the route is dead. *Expected stop:* the dual extreme points are the Mertens / pointwise wall in
   x-space.
2. **Pole-coupled pretentious rigidity at lengths ≫ γ₀ (from phase alignment E2/E3).** Theorem MT's twin has no pole at
   1 − iγ₀ and fails Corollary SF outside |Im s| < γ₀ and 2a ≲ 4 log γ₀. Use Halász / Granville–Soundararajan pretentious
   distance together with the pole of ζ(s + iγ₀) at 1 − iγ₀ to show that a planted zero at β₀ + iγ₀ forces a pole at the
   conjugate point β₀ − iγ₀, where ζ has a zero. *Avoids:* Lemma T (no transport to short support) and the torus-valid class
   (NFT(2), Theorem MT). DH is excluded because it has no Euler product. *First test:* turn the referee's E3 sketch into a
   lemma and check it numerically on the MT twin. *Expected stop:* pretentious bounds are mean-value statements (wall 4);
   near-line zeros (δ₀ → 0) need lengths exp((log log γ₀)/δ₀), i.e. the V7 p = 0 floor.
3. **Non-equivariant Heegner-height dictionary (from modular tower Prop 4.15, Cor 4.14).** Exactly equivariant
   dictionaries see only d(F), d′(F). Use the Gross–Zagier archimedean local heights of Heegner divisors, which carry
   ζ_K′/ζ_K with ζ_K = ζ·L(·, χ_D), and Néron–Tate positivity (arithmetic Hodge index on the cuspidal part) to bound the
   Weil form of ζ_K. *Avoids:* Theorem 4.13 (the map is not equivariant) and Eisenstein confinement (the input sits in the
   cuspidal height pairing, not in the degree). *First test:* does the archimedean Gross–Zagier term see the zeros of ζ
   with a sign, or only through its value at s = ½? *Expected stop:* Heegner positivity constrains one central derivative
   per form, a finite-support statement (wall 3); and the DH twin, which has no Heegner theory, must be excluded explicitly.
4. **Parity-breaking one-sided bound with Type-II input (from Stepanov Theorem P and density Theorem P).** Both failures
   are size-only. Add a bilinear (Type-II) estimate to the one-sided majorant for (★), the way Friedlander–Iwaniec and
   Heath-Brown break parity. *Avoids:* Theorem P (Type-I majorants) and the count-type 13/15 floor. *Expected stop:* the
   harmonic-floor referee's correction to Remark H5.1. (★) needs an O(polylog) error at square-root precision, which is a
   zero-free-region statement; known Type-II savings are powers of log or small powers of X, far from that.
5. **Exhaustive theta boundary/collision certificate (atlas §5–§6, third item of the closing line).** All ten attempts in
   rounds 1–2 ended on the first two items of the atlas closing line. The third, an exhaustive family of zero-winding
   boundary certificates for H_τ with an all-real anchor and complex-zero confinement on each positive-time slab, has not
   been attempted in this campaign. *Avoids:* every round-2 failure, because it uses no one-sided prime sum, no density
   passage and no dictionary; it uses the actual Φ, so flow-blindness (SL2) does not apply to it formally. *Expected stop:*
   global vortex trapping = RH (vortex-blocker reduction); a finite box family is a verified-height statement (wall 3), so
   an analytic, height-uniform box argument is needed.

## 5. Status

RH open. NO QED. Platt–Trudgian Λ ≤ 0.2 stands. No new zero-free region and no Λ bound. All new results are same-model
checks (author plus one fresh-context referee per attempt) and need external review before any use. Referee scripts:
`/tmp/referee-hf/`, `/tmp/referee-r2-stepanov/`, `tmp/rha-dp-referee3/`, `/tmp/referee-tower/`,
`/tmp/referee-phase-alignment/`.
