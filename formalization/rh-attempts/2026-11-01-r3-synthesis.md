# Direct RH attempts, round 3 (2026-11-01): synthesis

Internal working note. Not externally refereed, not committed upstream. Data module:
`src/data/rh-direct-attempts-r3-2026-11-01.js` (`RH_DIRECT_ATTEMPTS_R3_ASSERTIONS`). Earlier rounds:
`2026-11-01-synthesis.md`, `2026-11-01-r2-synthesis.md`.

**Verdict.** Round 3 ran the five attempts proposed at the end of round 2. Each was written out as a complete argument
aimed at RH, then attacked by a fresh-context referee. All five fail. No argument survived, so none went to a second
referee and none is reported as a candidate. RH is open. Platt–Trudgian Λ ≤ 0.2 stands. No Λ bound and no zero-free
region changes. NO QED.

In two of the five, the referee found an error before the author's declared failing line: the sign of the archimedean
height term (Heegner, Step H4) and a low-height gap in the anchor (theta, Step 4). In a third (Type-II), the referee showed
the declared failing claim is false for a different reason than the author gave.

All referees are instances of the same model family. None of this is external review, and no number is interval-certified
unless stated otherwise.

## 0. The PR #27 audit

All five round-3 files were written after the audit snapshots `/tmp/atlas-snap-*.md` existed (snapshots 13:40; final files
20:46–21:42). Each file cites the atlas sections it overlaps:

| attempt | file | lines | atlas references | main sections cited |
|---|---|---|---|---|
| Legendre dual LP | `2026-11-01-r3-legendre-dual-lp.md` | 941 | 9 | §7, §9, §10, §11 |
| pole-coupled pretentious | `2026-11-01-r3-pole-pretentious.md` | 890 | 22 | §9, §10 (V7 floor), §11 |
| Heegner heights | `2026-11-01-r3-heegner-heights.md` | 942 | 10 | §2, §3, §9, §10, §11 |
| Type-II parity | `2026-11-01-r3-type2-parity.md` | 729 | 10 | §2, §10 (Xu–Sang), §11 |
| theta collision | `2026-11-01-r3-theta-collision.md` | 618 | 8 | §5, §6, §9, §10, §11 |

Referee gap: the theta file cites PR #16 §§3, 7 but not §4, which already records its Claim 5 as the open condition.

## 1. The five attempts

### 1.1 Dual rigidity of the Legendre LP (N1 of round 2)

* **Claim.** By Lemma 1.1 the Legendre LP value ν₁(x) is a maximum over dual-feasible b ≥ 0. If every dual point obeys the
  tail bound of Step 7, |Σ_{k>√x} μ(k)e_k − u·m(x) − v(β(x)+1)| ≪ √x(log x)^A, then ν₁ ≪ √x·polylog and RH follows. The
  plant-a-zero test proposed in round 2 is passed in a restricted form: a planted off-line zero enters the sawtooth data
  with the factor ζ(ρ₀) (Lemma 2.1) and moves the objective by only O(κ/|ζ(ρ₀)| + κ) (Theorem PZ).
* **Failing step (referee, agrees with author).** Step 7, first invalid sub-step 7.1, which applies Theorems PZ and RIG to
  arbitrary finite-x dual points.
  * A finite dual point is a measure on [1, x], so B(s) is an entire Dirichlet polynomial with no singularities to use.
  * RIG needs one measure on [1, ∞) with O(Y^ε) sawtooth discrepancy at every real Y. Dual points at different x are
    unrelated, and the measured optima drift (v·log x/x from 4.08 to 2.86).
  * PZ covers only single-cutoff plants with √x ≤ T₀ ≤ x^{1−η}, and only from x ≳ 10²⁸.
  * 7.2 needs simple zeros and a truncated explicit formula for Möbius sums. 7.3 replaces x^ρ by √x (RH, circular), and
    Σ1/|ρζ′(ρ)| diverges under Gonek–Hejhal.
* **Reduces to.** RH itself. At b = Λ, Step 7 is ψ(x) − x ≪ √x·polylog (NS-RIGID candidate (c)). A sign-blind proof needs
  Σ_{M≤√x}|M(x/M) − M(x/(M+1))| ≪ √x·polylog (Theorem E), which implies M(x) ≪ √x·polylog. That is not known to follow
  from RH; it needs J₋₁(T) ≪ T. This is the pointwise / MV-CAP wall on the hyperbolic tiling. Positivity cuts ν₁ about
  fourfold numerically but has no analytic handle.
* **Twin test.** Steps 1–6, Lemma 2.1, PZ and RIG are unconditional and blind to zero location. With an off-line zero they
  all still hold, and Step 7 fails at b = Λ because ν₁ ≥ (ψ(x) − x)/K(x). All RH content sits in Step 7.
* **Salvage.** Lemmas 1.1, 1.3–1.5, 2.1; Theorems PZ (restricted), RIG (continuum), S, E; Props 1.2, 4.1, 4.3. Independent
  HiGHS LP confirms Theorem E equality at 10⁴ (347) and 3·10⁴ (548).
* **Numerical lead revised.** Round 2 recorded ν₁ ≈ 1.01√x with no log growth to 10⁶. The referee's lower bounds are
  1.036√x (10⁶), 1.046√x (3·10⁶), 1.088√x (10⁷), so ν₁/√x drifts up. The data cannot separate √x·polylog from x^{0.512}.
  The sign-free floor at 10⁷ is 18039 = 5.70√x.
* **Referee corrections.** Theorem S(iii): the 7/8 half-plane gives 1/2 ≤ ν* ≤ 8/9, not 7/8 ≤ ν*. Line 421 overstates
  PZ/RIG. Theorem E proves only the W_M part of (HM) necessary. Lemma 1.5 determinant is −0.0785.

### 1.2 Pole-coupled pretentious rigidity at lengths ≫ γ₀ (N2 of round 2)

* **Claim.** Theorem PC (Landau positivity): for completely multiplicative g with |g| ≤ 1 and G pole-coupled at 1,
  r_G(w) + conj r_G(w̄) = 2·ord_w ζ for Re w > σ*(g). A zero-free pole-coupled reference model (Lemma Z) would plant a pole
  at the conjugate of an off-line zero and give a contradiction.
* **Failing step (referee, agrees with author).** Step 4, Lemma Z. Theorem PCR: g ≡ 1 (G = ζ) is in the class, so
  Lemma Z(ρ₀) ⟺ ζ(ρ₀) ≠ 0. Under the Step-1 hypothesis Lemma Z is **false**, and the contradiction is assumed. Every
  other reading of "planted" was checked (classes containing ζ, relative bases, σ* ≥ β₀, |g| > 1, positive combinations);
  none escapes.
* **Twin test (referee).** A genuine Euler product B with a pole at 1, 0 ≤ b ≤ 1, and real off-line zeros at 0.85 + 8i and
  0.75 + 10i (N = 10⁸). Phase rotation moves the zero (r_H(w₀) = 0.055, r_H(w̄₀) = 2.06); modulus debiasing removes it but
  creates a real double zero at β = Re w₀ (coefficient −4.01), so σ* = Re w₀ and PC is silent. Lemma Z fails structurally
  for any argument built from Euler product, pole, domination and Landau positivity alone.
* **Reduces to.** Uniformly on Re s > θ: the zero-free half-plane ⟺ the one-sided Landau bound ψ(x) ≥ x − C·x^{θ+ε}
  ⟺ the hinge-discrepancy floor (arithmetic-foundation §2, lower sign). The V7 floor with p = 2θ − 1 implies it
  (atlas §10); RH is p = 0. Atlas closing line item 1.
* **Salvage.** Theorems PC, PCR; Corollaries PC1, PC3 (DH: 461 negative Landau coefficients for n ≤ 3000); Prop 3.1;
  Lemma KL (sign fixed), Lemma AC (Artin only); Props RT, PT (PC is sharp), H′, 2.5; LG(i).
* **Referee corrections.** Lemma KL shift sign; Z2 infimum residue is 1 with harmonics, not 2; numerical PC
  "confirmations" cannot fail and measure fit quality only; exp(−1.51√γ₀) is HEURISTIC.

### 1.3 Non-equivariant Heegner-height dictionary (N3 of round 2)

* **Claim.** Néron–Tate positivity of Heegner combinations gives lower bounds (H4) on ζ-weighted Green energies
  ∫ρ_ζ|B_x|²dμ with ρ_ζ = |ζ(½+it)|²/|ζ(1+2it)|². Step H5 transfers this to Weil positivity for ζ_K (H5a) or to the
  Nyman–Beurling criterion (H5b). The author declared H5 failing, with Theorem E (a sign obstruction) as the main reason.
* **Failing step (referee, earlier than the author's).** Step H4, inherited from H2(i). The ζ-carrying continuous-spectrum
  term enters the archimedean local height with a **negative** sign: the Gross–Zagier kernel is −4π times the positive
  resolvent, with multiplier −4π/(s(s−1) + ¼ + t²), matched to 1.2e-16. So Néron–Tate positivity gives **upper** bounds
  (H4′: 2π∫ρ_ζ|P̂B_x|²κ_N dμ = 𝔘(x_P) − ĥ(x_P) ≤ 𝔘(x_P)), in the Nyman–Beurling direction. Theorem E(a),(c), the Prop E′
  reading and Lemma 4.7(iv),(v) are void.
* **H5 after the sign fix.** Still fails, not by sign: the ζ-content sits in an identity that holds whatever the zeros are,
  and dropping ĥ gives nothing unless 𝔘 is evaluated independently. Lemma 4.7′ (after the inner factor e^{−a(s−½)}) makes
  the Hardy branch non-vacuous: for x = τ₋₇ − τ₋₈ the ratio is ≥ 2.0e3, above the floor 1.1066 forced by the bracket zero
  pair 1.92574583 ± 7.35195194i.
* **Reduces to.** The Nyman–Beurling / Báez-Duarte criterion restricted to Heegner amplitudes: RH would follow if
  inf_x e^{a_x}·E_μ|A_x|²/|A_x(1)|² = 1. Unproved, and not known even under RH, because the DH-type brackets have
  off-line zeros. It also needs an all-scale evaluation of 𝔘(x_n) (atlas closing item 1). H5a is GRH(ζ_K) itself.
* **Salvage.** Theorem B (A = −0.4769042910 = λ₁(ζ) − ½, λ₁(ζ) = 0.0230957090; checked to 3.4e-21); Theorem D (cone
  {L′(½, f_K⊗ψ) ≥ 0}); Lemma 4.6 (J(−7,−8)² = 5⁶·7²·13²); (T5) with E_μ|Z|² = log 2π − γ; Prop F; Props G, H; Prop E′ law
  min m = 1 − δ² at |v| = √(¾ − δ²) with corrected drops 0.29%, 6.3%, 20.3%; H4′ and Lemma 4.7′.
* **Synthesis note.** Lemma 4.6 says every prime of J(−7,−8) is inert in both fields; 7 ramifies in Q(√−7) (non-split in
  both is the correct statement). Assertion `rhd3-heegner-j-difference` records this.

### 1.4 Parity-breaking one-sided bound with Type-II input (N4 of round 2)

* **Claim.** Landau reduction; Vaughan's identity at U = V = X^{1/4} with exact Type-I terms (Prop 2.2, no parity cap, no
  zero counting); exact renewal identity R = Ξ + K_X[R] + O(1); claim (K) that K_X contracts, giving R ≪ polylog and RH.
* **Failing step (referee).** Step 4, Claim (K), first clause (K-i) |Ξ(X)| ≤ C₀(1 + log X)^m, which is **false**.
  * The referee derived a closed form for Ξ needing μ, Λ only up to X^{1/4}, matched to ≤ 4e-6, and evaluated Ξ(U⁴) for
    every U ≤ 10⁸ (X up to 10³²). Max |Ξ| = 3.07e7 at U = 76019521; decade maxima of |Ξ|/X^{1/4} are 0.34–0.41; the
    log-mean of Ξ/X^{1/4} is 0.058–0.062 in every decade (MEASURED).
  * Conditional on RH + simple zeros + J₋₁(T) ≪ T: log-mean = 4Σ_{γ>0}Re(1/ζ′(ρ))/|ρ−1|² ≈ 0.0596.
  * Under RH, (K-ii) at r = R and (K′) are equivalent to (K-i), so they fail too; if RH is false, (K) fails because (K)
    implies RH. So (K) is false and strictly stronger than RH.
  * The mechanism is the size of Ξ, not the author's "eigenvalue exactly 1" (Theorem C holds for K_∞, but the sharp-cutoff
    K_X zero-mode multiplier is 22.6 at 10⁶ and 62.6 at 10⁸, growing to ~4e7 at 10³²).
* **Reduces to.** RH itself. The only true form of Step 4 is a polylog bound on T − MT_II = Ξ + K_X[R], equivalent to RH
  by Theorem OS. The split is lossy: Ξ and K_X[R] are each of order X^{1/4} and cancel down to R. Same as bootstrap
  Lemma III.4 / §6.5 and the NS-RIGID dichotomy; atlas closing line item 1. The route stops before wall 4 is reached.
* **Salvage.** Lemma 2.1, Prop 2.2, the renewal identity; Prop 1.2 (constant −1); sharpened Prop 3.1; the Vaughan forcing
  law (conditional + measured); Theorem C (for K_∞); Theorem J; Theorem OS; CS0(1)–(3) (Cauchy–Schwarz capped at X^{3/8},
  i.e. ψ error X^{7/8}); Prop L.
* **Referee corrections.** CS0(5) does not certify ZF(7/8) (3/8 + α/4 closes only at α = ½). The DH twin passes Steps 2,
  3, 5 formally and must be excluded inside Step 4, not by Landau positivity.

### 1.5 Theta collision certificate (N5 of round 2; atlas closing item 3)

* **Claim.** Exclude a first de Bruijn–Newman collision using the PR #16 adjacent-gap reserve, transporting the exterior
  field S down from the Polymath15 real-zero region. Author: fails at Step 5 (transport) and Step 6 (Prop L). Theorem E:
  the Epstein theta kernel of 2m² + 2mn + 3n² has a real positive-time collision at (t, x) = (0.00592457504282,
  191.95462253944).
* **Failing step (referee).** The first false statement is in Step 4, eq. (4.1): with T* = min(½, C/log x*), every
  vortex with x* < e^{2C} lies below Region I (Polymath15 Thm 1.5 holds only for t ≤ ½, and C has never been computed),
  so the anchor localizes nothing there. For x* ≥ e^{2C} the first unproved step is Claim 5. Its exact form, Claim M, is
  **false unconditionally**: with the actual H_t on [0.21, 0.30] (all zeros real there), pair 6703–6704 has S from 0.5521
  to 0.5624, and 15 of 70 inner pairs rise. Prop N: a fixed relative loss η certifies only depth (1/4S)·log(q/η).
* **Reduces to.** Wall 3 (verified height). The certificate needs zero positions at t = 0 (or the anchor) to relative
  precision exp(−4∫S), pair by pair, at every height. This is the atlas §5 / PR #16 §4 open condition; its a₀ → 0 form is
  RH plus simple zeros (Prop GR). The binding twin is the route-42 window replacement ζ_W (one small off-line quadruple,
  Λ_W ≈ 2δ²), which satisfies Steps 0–4, so no input blind to zero positions at the vortex height can supply Claim 5.
  It is not wall 1 as the author claimed: the Φ_ε twin fails Step 0 under RH + simple zeros.
* **Twin defect.** The Epstein kernel fails Step 0: its zeros with β = 2.0794 (γ 7.629), 1.0152 (γ 99.359) and 1.6246
  (γ 101.435) give Λ_E > ½. Theorem E stands on its own (theta structure without an Euler product admits positive-time
  collisions) but does not test Claims 5–6.
* **Salvage.** Lemmas 1.1–1.5 (1.2: the Laguerre hierarchy, verified symbolically n ≤ 3); Props N, GR, L (lattice
  model); Lemma V, Corollary V(i); Theorem E (E1–E7, floating point); Claim M false unconditionally. The Euler product does
  enter the anchor (|ζ(s)| ≥ ζ(2σ)/ζ(σ) allows κ toward 2; the Epstein zeros force κ ≳ 6.3).

## 2. What the five failures have in common

1. **Same terminal objects as rounds 1–2.** Three of five (Legendre, pole-pretentious, Type-II) land on the one-sided
   Landau bound at square-root precision (atlas closing line item 1; V7 at p = 0). Two of those also show that the
   sign-blind version is strictly stronger than RH: (HM) needs J₋₁(T) ≪ T, and (K) is false under RH.
2. **Zeta-relative inputs only.** Theorem PCR (the class collapses to ζ through g ≡ 1), RIG (the dual carries only ζ's
   zeros), and Theorem C (symbol 1 − ζM_U equals 1 at every zero) say the same thing: an input defined relative to ζ
   reproduces ζ's zeros wherever they are. The DH and B-world twins confirm that every step before the failing one holds
   with an off-line zero.
3. **Positivity is present but has no analytic handle.** Legendre's b ≥ 0 cuts ν₁ about fourfold, Landau positivity
   conserves zero mass (PC), Néron–Tate positivity gives an upper bound (H4′). None of them turns into a one-sided bound
   at the scale required.
4. **Splits and transports are lossy.** Ξ and K_X[R] are each X^{1/4} and cancel; S relaxes toward the lattice value
   2/s² so pairs below it rise; anchor precision improves at rate log x while errors grow at (log x)² (Prop L).
5. **Two new structural objects.** The Vaughan forcing law (log-mean of Ξ/X^{1/4} equal to 4Σ Re(1/ζ′(ρ))/|ρ−1|²,
   conditional + measured) and H4′ (Heegner positivity bounds ζ-weighted Green energies from above, slack = central
   derivatives). Neither is a route to RH by itself.
6. **Lead revised.** ν₁(x)/√x is not flat: 1.036 → 1.046 → 1.088 from 10⁶ to 10⁷.

## 3. Survivors

None. No argument survived its referee, so no second referee was run and no candidate is reported.

## 4. Next five attempts

Each is chosen to avoid the specific failure found in round 3. None has been run; all are proposals.

1. **Cofinal Legendre dual (avoids Legendre Step 7.1).** Step 7.1 failed because finite-x dual points are unrelated
   Dirichlet polynomials. Build one b* ≥ 0 on [1, ∞), feasible at every x, as a limit of rescaled optimal duals, so RIG
   applies directly (B* = s[…]/ζ). Then use Landau positivity of b* on B* with the pole at 1 subtracted. This is atlas
   closing item 2 (a cofinal actual-form floor). *First test (decisive):* do the rescaled optima converge? They drifted
   (v·log x/x from 4.08 to 2.86) over 10⁴–10⁷. *Expected stop:* the limit's tail is a 1/ζ Mellin integral (Mertens, wall
   4); positivity must beat the Theorem E floor or the route is sign-blind again.
2. **Pole-coupled companion from the modular Laplacian (avoids Lemma Z / PCR).** PCR collapses every class containing ζ,
   and Lemmas KL, AC exclude known L-functions. Use a companion whose zeros are fixed by an independent mechanism: the
   Selberg zeta of PSL₂(Z), with prime-geodesic coefficients ≥ 0, a pole at 1, spectral zeros on Re s = ½ by
   self-adjointness, and scattering zeros at ρ/2. Apply Theorem PC to the coupled log-derivative. *First test (decisive):*
   σ* of the coupled companion versus β₀/2 < ½; if σ* ≥ ½, PC is silent (Prop PT). *Expected stop:* scattering terms
   enter with the continuous-spectrum sign (as in H4′) and may give only upper bounds.
3. **Discriminant-averaged Heegner Nyman–Beurling span (avoids the H4 sign and the DH-bracket floor).** Start from the
   corrected H4′ and Lemma 4.7′. Average Heegner amplitudes over discriminants or genera (Zagier traces of singular moduli,
   Duke equidistribution) so the DH-type brackets become Eisenstein factors without off-line zeros, and show the span NB
   ratio tends to 1. *First test:* is the averaged bracket zero-free in Re s > ½, and does the ratio fall with span size?
   *Expected stop:* NB completeness of the span is RH (Báez-Duarte) unless 𝔘(x_n) is evaluated at all scales (atlas
   closing item 1); averaging may lose density in H²(μ); finite spans are verified height.
4. **Forcing-free bilinear split (avoids the lossy Vaughan renewal).** Ξ fails because of an explicit forcing of size
   X^{1/4}. Choose a smoothed Heath-Brown identity whose Type-I main term reproduces the forcing exactly, and bound the
   residual bilinear operator only on the combined quantity, using Λ ≥ 0 and the Legendre positivity cut. *First test:*
   is the residual Ξ′ polylog numerically to 10³² (the closed-form method of the referee applies)? *Expected stop:*
   Theorem OS (any one-sided polylog bound on the combined quantity is RH); Theorem C's symbol 1 at zeros is forced for
   every split of this shape, so the residual must use positivity, which has no analytic handle yet.
5. **Euler-anchored heat-time certificate (avoids Claim 5 transport and the Step 4 low-height gap).** The binding twin
   ζ_W has no Euler product, and the referee found the Euler product enters the anchor. Build an anchor whose precision
   exponent is independent of T (x^{−c}, not x^{−cT}); Prop L then certifies depth 2π²c/L, the same order as the required
   T* ≈ C/L, with no S transport. *First test (decisive):* is 2π²c > C achievable for any explicit anchor? *Expected
   stop:* Euler-product lower bounds hold on Re s > 1 (or the Lean 7/8 half-plane); carrying them to the vortex height at
   fixed precision is MV-CAP / flow-blindness (the backward heat flow destroys the Euler product).

## 5. Status

RH open. NO QED. Platt–Trudgian Λ ≤ 0.2 stands. No new zero-free region and no Λ bound. All new results are same-model
checks (author plus one fresh-context referee per attempt) and need external review before any use. Referee scripts:
`/tmp/referee-r3-legendre/`, `/tmp/ref-r3pp/`, `/tmp/referee-heegner-r3/`, `/tmp/referee-r3/`, `/tmp/referee-r3-theta/`.
Author scripts: `tmp/rha-pole-pretentious-*.py`, `tmp/rha-heegner-heights-*.py`.
