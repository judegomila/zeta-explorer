# bypass-78: can the 7/8 argument be rebuilt so the P_a^{1/6} term never appears?

Internal working note, 2026-11-16. Slug `bypass-78`. Nothing committed, pushed or posted. Not refereed.
Everything below is relative to unrefereed inputs: the openai/math 7/8 manuscript (`~/lean-deps/qrh-verify/paper.txt`,
Lean-checked by its authors and re-built locally), Liu arXiv:2610.12234, Xu–Sang arXiv:2610.15291v2, Liu arXiv:2610.26835v2.
The three arXiv texts were downloaded for this note (`dl/*.txt`); the previous campaign had worked from PR #14's import only.

**Verdict.** No abscissa below 0.874886647 is proved. The architecture question has a definite answer inside the
comparison system, and it is negative in a specific way:

1. The exceptional term can be designed out trivially (take b ≤ 0; then the additive Gram bound is the planar large
   sieve, manuscript Lemma 6.2, and no ξ⁶ = 1 coset occurs). The resulting abscissa is **0.87524 (averaged numerator)
   or 0.87568 (pointwise numerator), both above 7/8**. The term-free design is worse, not better.
2. The composition of Liu I, Xu–Sang and Liu II is already taken in Liu II: B♭ = 0.874886647039964… is the exact
   infimum of the composed system. The three relaxations Liu II leaves open (Remark 14.14: unequal lengths,
   class-by-class mixing of the two numerator estimates; plus intermediate contours) are closed here: none lowers B♭.
3. The low side of the architecture has the floor 13/15 = 0.8667 whatever is done to the high side, and that floor does
   not come from the P_a^{1/6} term. A price list (§5) shows which single input moves the abscissa and by how much.

PT Λ ≤ 0.2 stands. RH is open. NO QED.

Labels: PROVED (complete argument here) / PROVED-rel X (relative to X as stated) / EXACT (exact algebra in the stated
inequality system) / NUMERICAL (float LP on a grid, accuracy stated) / CITED / MODEL (hypothetical input priced in the
system; not a bound) / OPEN.

---

## 0. Plan: what is new relative to the atlas, the campaigns and the walls

Read first: atlas (PR #27 `historical-routes.md`, §9–§12 and closing line), the three `2026-11-01-*synthesis.md`,
`zf-campaign-synthesis.md` and its five lever notes, `sextic-theta-synthesis.md`, `cubic-r2-conductor-verdict.md`,
eq48 RESULT/REFEREE, pick NEXT_STAGE, euler RESULT.

Not repeated: TRO6 (sextic-theta campaign), cubic k = 3 rows (closed, a = 4), quartic/GL(2) rows (tie at 7/8 with an
open sieve), residue-symbol filters on the coset (one constant A(e₀)), high-side row counts in the imported XS system,
V7 floor (restatement).

New here:
* the source texts of Liu I/II and Xu–Sang were read; the earlier campaign had only PR #14's import;
* §1: the exceptional term is absent for b ≤ 0, and the low exponent as a function of (M, ℓ) is the same with or
  without it; the term-free design is priced (0.87524 / 0.87568);
* §2: exact dual certificate that unequal lengths cannot lower the averaged-numerator boundary (Liu II Remark 14.14
  leaves this open);
* §3: class-by-class mixing of pointwise and averaged numerators, with free geometry, reduced to a one-parameter
  family of LPs and solved: no gain;
* §4: the local closed form B\*(κ) (high-side note, Prop E′) has fixed point equal to Liu's B♭ to 40 digits;
* §5: price list of single-input changes in one common system.

Walls respected: nothing here is an argument for a zero-free region, so the DH/flow/MV-CAP walls apply only to the
base method; §7 records which step of the base method uses the Euler product. Every "cannot go lower" statement is a
statement about a sufficient-estimate system (atlas §9), not about zeros.

---

## 1. The exceptional term can be designed out; doing so costs 2.4·10⁻⁴ to 6.8·10⁻⁴

Notation: X = Z^{l_x}, Y = Z^{l_y}, M = l_x + l_y, b = l_y − l_x, ℓ = total prime length, h = 1 − l_x + ℓ,
C(s) = s − 5/6 + l_x/3 + ℓ/6. P_a = Y′²/Q = Z^b/q_{b\*}.

**1.1 [PROVED-rel manuscript Lemma 6.2].** For P_a ≤ 1 (b ≤ 0) the additive polynomial satisfies
Σ_{q_m ≤ CQ}|A_m|² ≪ (Q + Y²)/Y ≪ Q/Y, by the planar additive large sieve applied to the reduced fractions d/s. No
correlation of Gauss sums is expanded, so no exceptional frequency and no ξ⁶ = 1 coset occurs. Part I of the manuscript
(X = Y = Z^{1/2}) is this case. So "an argument in which P_a^{1/6} never appears" exists already: it is b ≤ 0.

**1.2 [EXACT, from Liu II §15.1, direct majorant].** B_low = 5/6 + l_x/6 − ℓ/6 + G + k/2 with
G = max(0, b/12, b − l_y/2), k = max(0, (1+3ℓ−2M)/4, M+ℓ−1, (3ℓ−1)/2). For b ≥ 0 and G = b/12:

  B_low = 5/6 + (M − 2ℓ)/12 + k/2.

This depends on (M, ℓ) only. The b/12 from P_a^{1/6} is exactly cancelled by the −b/12 in l_x/6 = (M − b)/12. So in
(M, ℓ) coordinates the low side with the exceptional term (b > 0) equals the low side without it (b = 0). What the term
does is cap the benefit of asymmetry: without it (G = 0) the low exponent would be 5/6 + (M − b − 2ℓ)/12, decreasing
in b. With it, b is free on the low side and is spent on the high side.

**1.3 [EXACT].** From k: B ≥ L₀ = 5/6 + M/12 − ℓ/6, B ≥ L_K = L₀ + (M+ℓ−1)/2, B ≥ L_J = L₀ + (1+3ℓ−2M)/8, and
(17/30)L₀ + (1/30)L_K + (2/5)L_J = 13/15 identically (Liu II §15.3; re-checked). The low-side floor of the architecture
is 13/15, attained at ℓ = 1/5, M = 4/5, for every b ≥ 0. It comes from the two range losses of the reflected-energy
lemma (manuscript Lemma 15.1 / 14.4), not from Prop 15.2.

**1.4 [NUMERICAL, float LP, grid 97×25 in (δ, x), error ≲ 10⁻⁶; `extra_runs.py`, `b0_kappa.log`].** Abscissa of the
full system (low majorant + critical-scale endpoint for every class with δ ≥ 1/8) under the constraint b = 0:

| numerator estimate | κ = 3/4 | κ = κ♭ | κ = 13/18 (unlicensed) |
|---|---|---|---|
| averaged (Xu–Sang / Liu II (14.7)) | 0.8752363 | 0.8752360 | 0.8751998 |
| pointwise (manuscript / Liu I) | 0.8756827 | 0.8756826 | 0.8756687 |

Allowing b < 0 gives the same optimum (b = 0 binds). All entries exceed 7/8. Reason: at b = 0 the ratio l_y/h is
0.557, and the high-side endpoint needs l_y/h ≈ 0.5785 (§3 table).

**Conclusion of §1.** The loss at Prop 15.2 is not a loss relative to an available term-free design. It is the price
of the asymmetry b ≈ 0.085–0.125 that the high side needs, and it is paid at the same low exponent that the symmetric
design has. Removing the term is useful only as TRO6 (a saving at b > 0), which is the previous campaign's open
hypothesis.

---

## 2. Unequal lengths cannot lower the averaged-numerator boundary  [EXACT]

Liu II Theorem 14.13 proves B♭ optimal for balanced lengths (M + ℓ = 1). Remark 14.14 excludes unequal lengths from the
statement. Liu II Theorem 15.4 covers unequal lengths for the pointwise system only.

Class endpoint at the critical scale d = h, any real (l_x, l_y, ℓ), class (δ, x), a = (1+δ)/2, g = δx,
K = (3R_κ+1)/4 (this is (14.7) of Liu II at d = h written before the balanced substitution; at θ-free pointwise it
agrees with Liu II (15.2), which the source states for unequal lengths):

  E_θ = H_θ − B,  H_θ = a − l_y(1/2 + θ) − h/6 − ℓ/2 + ℓg + h(K + θ/2),  0 ≤ θ ≤ g/(6κ).

E_θ is affine in θ with slope h/2 − l_y. Region A: l_y ≥ h/2, best θ = g/(6κ). Region B: l_y ≤ h/2, best θ = 0.

**Proposition U (region A).** Let 13/18 ≤ κ ≤ 1 and let δ_c(κ) be the root in [1/8, 5/6] of Liu's
cr(δ, κ) = (3 − 324κ²)δ² + (756κ² − 54κ − 5)δ + 40κ − 300κ². For all real l_x, l_y, ℓ, if B ≥ L₀, B ≥ L_K and
B ≥ H_{g/(6κ)} at the class (δ_c, 1/2), then B ≥ F♭(κ).

Proof. At x = 1/2: ∂_b H = (K − 2/3)/2 − θ/4, which vanishes exactly when K − 2/3 = θ/2, i.e. cr = 0 (sympy: the
residual of the l_x-equation is cr(δ, κ) up to a nonvanishing denominator). There ∂_M H = −(1/2 + θ),
∂_ℓ H = g + θ. With w_K = w_H(2 + 2θ − 2g)/3, w₀ = 2w_K + 6w_H(g + θ), w₀ + w_K + w_H = 1, all weights are positive
(g ≤ 5/12 < 1) and w₀L₀ + w_K L_K + w_H H is constant in (l_x, l_y, ℓ). The constant is F♭(κ) because the balanced
tangent point of Liu II Lemma 14.10 satisfies all three with equality. ∎
Numbers (`dual_free_geometry.py`): κ = 3/4: weights (0.64531, 0.12511, 0.22957), constant 0.874886989358 = B\*(3/4);
κ = κ♭: constant 0.874886647039964 = B♭.

**Proposition U′ (region B).** For l_y ≤ h/2, using B ≥ 5/6 + l_x/6 − ℓ/6 (G ≥ 0), its L_K analogue, and
B ≥ H₀ at the class (0.666, 1/2): weights (0.2108, 0.1129, 0.6762) and multiplier λ = 0.2817 ≥ 0 on (h/2 − l_y) give
B ≥ 0.88707 for κ ∈ {κ♭, 3/4}. [EXACT algebra, weights evaluated numerically at two κ; the class δ = 0.666 ≤ κ is
controlled.]

So with any lengths, any sign of b and any M, the averaged-numerator system gives B ≥ min(F♭(κ), 0.887) = F♭(κ), and
with the licence κ ≥ 2B_prev − 1 the infimum is B♭ as in Liu II. The float LP with free geometry returns M + ℓ = 1
unprompted (`scalar_system.log`, S3 = S1).

## 3. Class-by-class mixing of pointwise and averaged numerators: no gain  [NUMERICAL]

Liu II Remark 14.14: mixing "does not appear to lower B♭". Local high-side note §16: the hybrid gives no gain at fixed
geometry. Here the geometry is free.

Reduction [PROVED]. For fixed ρ = l_y/h, the sign of E_avg − E_pt at a class depends on (δ, x, ρ) only (the two differ
only in their l_y and h coefficients). So for each ρ the per-class choice is fixed and the system is one LP. Pointwise
contours w ∈ [1−a, a], shifts θ ∈ [0, g/(6κ)] and Hölder exponents between the fourth moment and the pointwise bound
are affine interpolations, so endpoints suffice.

Result (`mixed_ratio.log`, `extra_runs.log`; grid 61×13, same-grid reference B_ref = 0.8748863453):

| ρ | B_mixed − B_ref | classes using pointwise (of 793) |
|---|---|---|
| 0.50 | +1.2·10⁻² | 0 |
| 0.56 | +2.6·10⁻⁴ | 182 |
| 0.5775 | +1.2·10⁻⁶ | 291 |
| 0.5780 | +3.3·10⁻⁸ | 293 |
| 0.5785 | +1.5·10⁻⁷ | 294 |
| 0.5810 | +2.5·10⁻⁶ | 312 |
| 0.60 | +1.6·10⁻⁴ | 463 |
| 0.70 | +9.7·10⁻³ | 793 |

The minimum over ρ ∈ [0.35, 0.90] is B_ref (to 3·10⁻⁸, the ρ-step resolution). Many classes switch to the pointwise
bound and the optimum does not move. Not a certificate.

## 4. Composition (item (d)): what each paper changed, and that the composition is B♭

| source | low side | numerator on a row class | counts | licence | boundary |
|---|---|---|---|---|---|
| manuscript | ℓ = 1/6, b = 1/8, M + ℓ = 1; Lemma 15.1 loss ((d − 1/6)/4)₊ | pointwise, reflected at Re w = 1 − a, cost U^{δ/2} | Prop 19.2 | κ = 3/4 from 11/12 → 7/8 | 7/8 |
| Liu I (2610.12234) | same lemmas, (b, ℓ) varied | pointwise | same, κ varied | κ = 2B − 1 iterated | B∞ = 0.8749570194; optimal in its system incl. unequal lengths (Thm 34.4 / Liu II Thm 15.4) |
| Xu–Sang (2610.15291v2) | ℓ up to 1/5 by keeping the decay of the rescaled tuple (zero-loss range 2M ≥ 1 + 3ℓ; same as local Prop 15.3′) | **new**: Σ_{u∈class}\|L(1/2+θ, ψ̄_u)\| ≪ U^{(3R+1)/4 − θ/2}, θ = g/(6κ), from the plain fourth moment with the class's own prime factors | same R_κ | two stages, κ = 3/4 then 29991/40000; Lemma 18.1 extended to κ ≥ 13/18 | 0.8748867 |
| Liu II (2610.26835v2) | same majorant | Xu–Sang's average, over any F ⊃ μ₁₂ | same R_κ | single limiting step κ = 2β\* − 1 | B♭ = 0.874886647039964, exact infimum (Thm 14.13) |

* The three changes compose and Liu II is the composition. Its endpoint inequalities are field-independent (Liu II §14
  intro), so changing the base field or using its Hecke rows over F ⊃ μ₁₂ changes no exponent. [CITED]
* Independent check [EXACT-numerical, `check_fixed_point.py`]: the fixed point of the local closed form B\*(κ)
  (zf-campaign-high-side.md Prop E′) under κ = 2B − 1 is 0.87488664703996413094461400053018…, equal to the root of
  Liu's quartic 133488B⁴ − 376596B³ + 384534B² − 167541B + 26231 to 4·10⁻⁴² . The local value "κ bootstrap →
  0.874886647040" was B♭.
* With §2 and §3, the composed system with free lengths and per-class choice of numerator estimate has infimum B♭.
* Not accessed: Liu II cites "[Liu26c] An improved zero-free half-plane for Hecke L-functions over number fields
  …, hexagon:2610.00655v1, 28 Oct 2026, using a different method". A web search did not find it. If it exists, the
  reference value 0.874886647 may already be superseded by a claim not examined here. [OPEN]

## 5. Price list: one input changed at a time  [MODEL unless marked]

Same LP (region A, free lengths, l_x, l_y ≥ ℓ, κ = 2B − 1, classes δ ≥ 1/8; small-δ and capacity gates of Liu II
Remark 14.1(2),(4) not imposed, so every value is optimistic). `price_list.log`.

| change of input | abscissa | gain vs B♭ |
|---|---|---|
| none (validation; expect 0.8748866) | 0.8748865 | 0 |
| pointwise numerator only (validation; expect 0.8749570) | 0.8749566 | — |
| κ = 13/18 without licence | 0.8748430 | 4.4·10⁻⁵ |
| κ = 1/2 (prime sums of GRH size; formula extrapolated) | 0.8743121 | 5.7·10⁻⁴ |
| amplification exponent α = 4/5 (5/6 in manuscript Lemma 17.6) | 0.8746271 | 2.6·10⁻⁴ |
| α = 3/4 | 0.8741812 | 7.1·10⁻⁴ |
| TRO6 with η = 0.0219 (Gram b/12 → (1−η)b/12) | 0.8747534 | 1.3·10⁻⁴ |
| TRO6 with η = 0.1 | 0.8741034 | 7.8·10⁻⁴ |
| numerator shift capacity doubled (θ ≤ 2g/(6κ)) | 0.8741892 | 7.0·10⁻⁴ |
| numerator shift to the zero line (θ = δ/2) | 0.8728532 | 2.0·10⁻³ |
| uniform count saving 1/120 (PR #14's (H)) | 0.8737351 | 1.2·10⁻³ |
| uniform count saving 1/20 | 0.8677095 | 7.2·10⁻³ |
| P_a^{1/6} term absent (η = 1), P_a²/Y′ kept | 0.8586290 | 1.6·10⁻² |
| reflected energy without the M + ℓ ≤ 1 loss | 0.8611111 | 1.4·10⁻² (model leaves the source's ℓ ≤ 1/5 range: ℓ = 1/3) |
| numerator: Lindelöf on the class (K = R) | 0.8666667 = 13/15 | 8.2·10⁻³ (low floor reached) |
| counts at the density-hypothesis value R = 1 − δ | 0.8666667 = 13/15 | 8.2·10⁻³ (low floor reached) |
| low side alone | 13/15 | — |

Readings:
* κ is a weak lever: even prime sums of GRH size give 5.7·10⁻⁴. The licence chain κ = 2B − 1 is not where the
  argument is stuck.
* Any high-side input, however strong, stops at 13/15. Below 13/15 the binding inputs are the Gram bound at b > 0
  (TRO6) and the reflected-energy range M + ℓ ≤ 1.
* The largest single lever that keeps the present low side is the numerator average: K = (3R+1)/4 → R is worth the
  whole distance to the floor. The θ cap g/(6κ) is the prime capacity of the plain moment (m₁ + m₂ + 6κz ≤ 1): at
  block length m ∈ (1/3, 1/2) only two copies of S_m fit, so higher moments of short blocks do not raise the cap.

## 6. Items (a), (b), (c) of the angle

**(a) Other row families.**
* Cubic rows (k = 3): closed, R2 conductor exponent a = 4 (cubic-r2-conductor-verdict.md). Quartic/GL(2): tie at 7/8
  with an open sieve (zf-campaign-quartic-gl2.md). Not re-run.
* CM / Hecke rows as in Liu II: Liu II runs the same cubic-theta probe over F ⊃ μ₁₂ with Kazhdan–Patterson exceptional
  theta; its endpoint system is identical (B∞ and B♭ unchanged). The row family is still sextic twists of the target;
  no exponent changes. [CITED]
* Mixed cubic–quadratic: the probe already is the mixed object. The Möbius factor arises from
  μγ₂ = αG·conj(γ₁) (manuscript (4.7)): a cubic Gauss sum against a sextic one, with the quadratic part evaluated
  explicitly. A probe built from quadratic theta alone has coefficients supported on squares, and no Möbius identity
  of this type. No construction was found; nothing is proved excluded. [OPEN]

**(b) A different detector.** The detector (manuscript §8, Liu II Lemma 13.7) acts on the high side only: it supplies
the inverse and plain witnesses that give R_κ. The ξ⁶ = 1 coset is a low-side object (Prop 15.2). Changing the detector
changes R; §5 prices that (the density-hypothesis value R = 1 − δ reaches 13/15 and stops there).
A detector cannot avoid the coset because it never meets it. [PROVED-rel, structural reading of the source]

**(c) Amplifier or mollifier before the Cauchy–Schwarz.**
* [PROVED] For any weights w_m ≠ 0, ‖Aw‖·‖B/w‖ ≥ Σ_m|A_m B_m|, with equality at |w_m|² = |B_m|/|A_m|. A diagonal
  amplifier or mollifier in the row variable m can at best replace ‖A‖‖B‖ by the ℓ¹ pairing Σ|A_mB_m|. It gains a
  power only if |A_m| and |B_m| are anti-correlated on a power scale.
* [PROVED-rel, sextic-theta Theorem A(MS) with its main-term lower bound; CITED-unverified, Xu "A sharp lower bound
  for the sextic large sieve", announced in Xu–Sang §1.1] the mean square of A is of the exact order
  (Q/Y′)P_a^{1/6}. The local numerics (slope 0.868, dense) show no concentration of |A_m|. Anti-correlation is not
  excluded by a theorem. [OPEN]
* A non-diagonal change of basis in m is either the Fourier basis (then Cauchy–Schwarz gives the additive large sieve,
  1 + P_a, worse than 1 + P_a^{1/6}) or the Poisson side itself.
* [PROVED-rel, sextic-theta Theorem D(i),(ii)] the probe equals the aggregated theta–row form up to O(Z^{17/96+ε}), and
  any power saving over Cauchy–Schwarz for that form is the improved low bound. So a successful step of type (c) is
  TRO6, not a way round it.

**Exact reason the architecture cannot go lower (summary).** With the inputs proved in the four sources:
(i) low side: B ≥ 5/6 + (M − 2ℓ)/12 + k/2 for every b ≥ 0, whether or not the exceptional term is present;
(ii) high side at the class (δ_c(κ), 1/2), d = h: the endpoint is independent of b exactly there, and the positive
combination of §2 eliminates all lengths; (iii) κ ≥ 2B − 1. These three give B ≥ B♭ for every choice of lengths,
contours, θ, detector cutoff (Liu II Lemma 15.1) and per-class estimate (§3, numerical). The formal critical class is
not shown nonempty; the obstruction is to the estimate system only (atlas §9).

## 7. DH control

Nothing in this note is an argument for a zero-free region, so there is nothing new that must fail for
Davenport–Heilbronn. For the base method, the steps that use the Euler product are:
* manuscript §7.2 (scalar Euler identity): a Poisson row u contributes a quotient of Hecke L-functions; for u = 1 the
  quotient contains 1/L_F(s, η). This uses complete multiplicativity of η on the completed index cn³ and the
  coefficientwise cancellation of reciprocity phases. A DH-type linear combination has no such identity.
* the inverse witness M_ψ (Möbius coefficients) of the detector and Lemma 17.1: they exist because 1/L(s, ψ) is a
  Dirichlet series with coefficients μψ.
* the prime polynomials Q_i and the bound |Q|² ≪ Z^{κz}: explicit formula for a family closed under the sextic
  twists, with a family-wide zero bound.
The low side (Cauchy–Schwarz, large sieves, theta reflection) uses no Euler product. That is consistent with §6(c): a
low-side improvement would have to come from arithmetic of the theta–row correlation, not from a soft inequality.

## 8. Three weakest steps

1. **Transcription and extension of the scalar system.** All formulas are from unrefereed preprints (Liu II (14.3),
   (14.7), §15.1, (15.2)). Liu II states (14.7) for balanced lengths; §2–§3 use it for unequal lengths. The
   justification is that (14.7) is written in l_x, l_y, h, ℓ before the balanced substitution and that its pointwise
   analogue (15.2) is stated by the source for unequal lengths. The analytic lemmas behind the averaged numerator are
   not re-proved at unequal lengths. For "no gain" conclusions this does not matter (a missing lemma only removes
   options).
2. **§3, §1.4 and §5 are float LPs on finite (δ, x) grids**, not certificates. Validation: the same code returns
   0.8749568 for B∞ = 0.8749570 and 0.8748865 for B♭ = 0.8748866. §2 is exact algebra with numerically evaluated
   weights at two values of κ, not an interval proof over κ ∈ [κ♭, 3/4]. The small-δ and capacity gates are omitted
   (optimistic), which is the safe direction for "no gain" and the unsafe direction for the price list.
3. **§6(c) does not exclude anti-correlation of |A_m| and |B_m|**, and it relies on the local Theorem D (D(iii)(b) is
   a sketch) and on an unpublished lower bound of Xu. §6(a) "mixed cubic–quadratic" is an absence of construction, not
   an impossibility result. Liu26c was not accessible.

## 9. Pivot (once): strongest adjacent idea

The angle (design out the term) is dead by §1: the term-free design exists and gives 0.8752. The strongest adjacent
target found is the numerator average, not the Gram bound:

* §5 shows K = (3R+1)/4 → R alone reaches 13/15, while full removal of the P_a^{1/6} term at the present high side
  gives 0.8586 and any partial TRO6 saving η ≤ 0.1 gives less than 8·10⁻⁴.
* The binding blocks of the approximate functional equation are those of length m ∈ (1/3, 1/2], where the plain moment
  m₁ + m₂ + 6κz ≤ 1 leaves prime capacity (1 − 2m)/(6κ). A plain-moment estimate with smaller prime cost than 6κ per
  unit length, or a restricted fourth moment on the detected class (PR #14's (H), U^{39/40}), raises the θ cap.
  Doubling the cap is worth 7.0·10⁻⁴; (H) is worth 1.2·10⁻³.
* This is a statement about sextic-twist moments with prime factors (manuscript Lemma 18.1), which does use the Euler
  product through |Q|² ≪ Z^{κz}. It was not attempted here. [OPEN]

## 10. Files

* `scalar_system.py` (+ `.log`): the system, validation runs S0–S3′.
* `dual_free_geometry.py` (+ `.log`): §2 certificates (sympy).
* `mixed_ratio.py`, `extra_runs.py` (+ `.log`): §3 and §1.4. `b0_kappa.log`: §1.4 table.
* `price_list.py` (+ `.log`): §5.
* `check_fixed_point.py`: §4.
* `dl/`: arXiv abs pages, PDFs and `pdftotext` output for 2610.12234, 2610.15291, 2610.26835 (untrusted downloads,
  read as text only).
* Environment: `python3.12 -m venv venv && venv/bin/pip install numpy scipy sympy mpmath` (venv removed after the runs).
