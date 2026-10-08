# Beating 7/8 above the verified height: the height-dependent route

**Internal analysis, 2026-10-08. Not submitted, not refereed. No new zero-free region is claimed.**
Scripts: `tmp/beat78-height-regions.py`, `tmp/beat78-height-pushup.py`, `tmp/beat78-height-exchange.py`; outputs in
`tmp/beat78-height-out/`. Grades used below:

* **PROVED**: complete argument written here.
* **CERTIFIED**: decided by ball arithmetic (python-flint arb, 256 bits) or exact algebra (sympy).
* **MEASURED**: exact-rational runs of the project's Raymond-chain consumer `tmp/oai-lambda-raymond.py`. Every Λ
  value is conditional on (Z_θ), (G0) and (PT) as in `lambda-qrh-note-draft.md`. Heights above PT are unverified.
* **READING**: method-level reading of the 7/8 manuscript (openai/math family 003, text `/tmp/qrh-verify/paper.txt`).
  It describes what that argument can and cannot give, and does not exclude other methods.
* **HEURISTIC / CONDITIONAL**: as labelled.

## 0. Question and answer

**Question.** The 7/8 argument is uniform in height. For the de Bruijn–Newman chain, only zeros above the verified height
3·10¹² matter. Can zero-density estimates, explicit zero-free regions near Re s = 1 (Mossinghoff–Trudgian–Yang,
Vinogradov–Korobov), the verified height (PT), Weil positivity, or mollifier/proportion results be combined with the 7/8
theorem to give a better abscissa θ < 7/8 for heights T ≥ 3·10¹² (or T ≥ T0)? Failing that, can the barrier chain
tolerate the zeros with Re s in (θ, 7/8), for example as finitely many exceptional zeros? What is the effect on q0 and Λ?

**Answer: no improvement. The height-dependent route reduces exactly to the verified-height route.**

1. The chain reads the time-zero zeros only through q* = sup{(2β − 1)² : ζ(β + iγ) = 0, γ > X/2}, where X/2 ≈ 3.0·10¹²
   (§1). Given PT, the bound q* ≤ (2θ′ − 1)² is equivalent to the global statement QRH(θ′). A height-restricted
   abscissa above 3·10¹² is therefore not a weaker statement than a global one. **PROVED** (§2)
2. An improvement valid only for γ ≥ T0 with T0 above the PT height leaves the chain value unchanged. The zone just above
   the PT height, which keeps the 7/8 start, determines the value. **PROVED** within the chain (§2)
3. At every height ≥ 3·10¹², the explicit regions near Re s = 1 give abscissa ≥ 0.993738 (MTY, R = 5.558691) and
   ≥ 0.998762 (Ford's VK constant). Both tend to 1 as T → ∞. They are below 7/8 only for |t| < 4.2173 (MTY) and nowhere
   with |t| ≥ 3 (VK). With the hypothetical constants R = 1 or c = 1 they would still be below 7/8 only for |t| < 2981 and
   |t| < 1.13·10⁶. The conclusion therefore does not depend on constants. **CERTIFIED** (§3)
4. Zero-density, proportion and positivity results do not exclude individual zeros, so they cannot lower q*. Every
   published density bound tends to ∞ with T. **PROVED** (structural) plus a literature fact (§4)
5. Exceptional zeros cannot be tolerated unless their locations are known:
   * A conjugate pair at height y_e pushes a lower zero (height y_k) upward exactly when |Δx| < √(y_e² − y_k²). This
     breaks the first-contact step. **CERTIFIED** algebra.
   * The exceptional zero itself descends no faster than a chain started at y_e², so located exceptions help only if
     they lie at large heights. **READING**
   * No available input supplies finiteness or locations. (§5)
6. The 7/8 proof cannot be localized in height (**READING**, §6):
   * The abscissa is set by the low estimate: σ0 = 1 − h/6 + b/12 = 7/8.
   * The analysis height T1 = Z^τ enters only as polynomial factors, which Lemma 11.1 absorbs.
   * The zero detector bounds real parts by the supremum β* over all finite-order Hecke characters of Q(√−3) at all
     heights. The Poisson rows carry sextic twists of unbounded conductor, and no verification covers their low-lying
     zeros.
7. The only useful height-dependent information is a zero-free box {β > θ′, PT < γ < T2} that starts at the PT height. On
   the chain (§7–§8):
   * The required T2 is about 4.9× the PT height for θ′ = 0.86, 16× for θ′ = 0.85 and 63× for θ′ = 0.84
     (**MEASURED/HEURISTIC** interpolation).
   * Producing such a box costs about as much as verifying RH to T2 (**HEURISTIC**).
   * RH verified to T2, with the 7/8 start at T2, gives the same Λ without any new lemma.

Net effect on q0 and Λ: q0 stays 9/16 + offset. Λ stays at value (i) 0.118505710922701 (Raymond chain) or value (ii)
0.116091488672439 (route P), both conditional.

## 1. What the chain reads

Polymath15 normalisation: H_0(z) = ξ((1 + iz)/2)/8. The zeta zero ρ = β + iγ is the zero z = 2γ − i(2β − 1) of H_0, so
(Im z)² = (2β − 1)².

Lemma FB(θ) (`raymond-g0-review-b-2026-10-08.md` §8) has the hypotheses below:

| hypothesis | content | role |
|---|---|---|
| (Z_θ) | half-plane | read in step 2 only, on [0, 10⁻⁸] |
| (W) | head wall, AF §§2–3 | nonreal zeros of H_t have \|Re z\| > X for t ≤ 41/250; uses PT |
| (J) | floors | one-point lower bounds S(x, h_i, t) > ℓ_i for all x ≥ X − 2; "no step uses where the zeros of H_t are" |
| (K) | kernel inequalities | |
| (C) | consumer record | |

Step 2 needs every zero with Re z > X to satisfy y² < β(t) on [0, 10⁻⁸]. Lemma S(θ) supplies this, together with the S1
check q0 − (2 + c0q0)·10⁻⁸ > (2θ − 1)². Step 3 is first contact: the contact zero is the highest zero, so all other zeros
pull it down. The terminal step is Λ ≤ T* + q_e/2.

So the start condition is exactly

  q0 − (2 + c0q0)·10⁻⁸ > q*,  q* := sup{(2β − 1)² : ζ(β + iγ) = 0, γ > X/2}.

The chain uses no other information about the zeros at t = 0. The chain is uniform in x ≥ X because the floors (J) are
certified for all x ≥ X − 2.

## 2. A height restriction gives nothing new (P1, P2). PROVED.

**P1.** Let 1/2 ≤ θ′ < 1. Assume (PT): every zero with 0 < γ ≤ 3000175332800 has β = 1/2. Then

  [β ≤ θ′ for every zero with γ > X/2]  ⟺  QRH(θ′): ζ(s) ≠ 0 for Re s > θ′.

*Proof.* (⇐) is immediate. (⇒): Zeros with 0 < γ ≤ X/2 lie below the PT height, since X/2 = 3000000092914 = 3000175332800 − 175239886
(the clearance recorded in the note draft and in review A, check C1). They therefore have β = 1/2 ≤ θ′. Zeros with γ < 0 are conjugates, and no
zeros of ζ in 0 < Re s < 1 are real. ∎

So "a better abscissa for T ≥ 3·10¹²" is the same theorem as "a better global abscissa". It is not easier, and it is
exactly as useful for the chain. That was the premise of the angle; the converse half shows that this premise offers no
shortcut.

**P2.** Suppose β ≤ θ′ < 7/8 is known only for γ ≥ T0, where T0 is above the PT height, and (Z_{7/8}) holds elsewhere.
Then the chain's start is still forced to q0 > 9/16, because a zero with β up to 7/8 is allowed in (X/2, T0). The value
does not change.

The same holds for any x-dependent (two-zone) refinement of the chain, of the kind in §8. That refinement gives
max(Λ(7/8, X), Λ(θ′, 2T0)) = Λ(7/8, X). This uses monotonicity of the value in height and in θ, which the runs in §7
show (MEASURED).

Only a statement that starts at the verified height can move the chain.

## 3. Explicit zero-free regions at T ≥ 3·10¹² (P3). CERTIFIED.

`tmp/beat78-height-regions.py` (arb, 256 bits; output `tmp/beat78-height-out/regions.json`) evaluates these regions:

* Classical: σ ≥ 1 − 1/(R log t) with R = 5.558691 (Mossinghoff–Trudgian–Yang, |t| ≥ 2).
* VK: σ ≥ 1 − 1/(c (log t)^{2/3} (log log t)^{1/3}) with c = 57.54 (Ford 2002, |t| ≥ 3).
* The same two forms with the hypothetical constants R = 1 and c = 1. These are far stronger than anything known, and
  they show that the conclusion does not depend on the constants. Later VK constants lie between 1 and 57.54, so they are
  covered.

| height t | classical MTY | VK, Ford | VK, c = 1 (hyp.) | classical, R = 1 (hyp.) |
|---|---|---|---|---|
| 3.0001753328·10¹² (PT) | 0.99373823 | 0.99876276 | 0.92880949 | 0.96519280 |
| 6·10¹² | 0.99388574 | 0.99878513 | 0.93009693 | 0.96601272 |
| 3·10¹⁴ | 0.99460328 | 0.99889557 | 0.93645141 | 0.97000132 |
| 4.7·10¹⁶ | 0.99531379 | 0.99900791 | 0.94291522 | 0.97395081 |
| 10¹⁰⁰ | 0.99921871 | 0.99973694 | 0.98486399 | 0.99565705 |

Each region is below 7/8 only in the following height range (CERTIFIED):

* Classical MTY: t < e^{8/R} = 4.21726895.
* VK, Ford: never for t ≥ 3. At t = 3 the left side c(log t)^{2/3}(log log t)^{1/3} is already 27.86 > 8, and it
  increases with t.
* c = 1: t < 1.13·10⁶.
* R = 1: t < 2980.96.

No zeta zero has |γ| < 14.13. Hence min(7/8, region) = 7/8 at every height where a zero can exist. All these regions tend
to 1 as t → ∞, so as uniform statements on [3·10¹², ∞) they imply only the classical strip, q = 1. At the PT height, MTY
gives |Im z| ≤ 0.987476, which matches the integration module.

## 4. Density, proportion and positivity inputs (P4)

* **Zero density.** QRH(θ′) is equivalent to N(θ′, T) = 0 for all T. A bound N(σ, T) ≤ B(σ, T) can yield this only if
  B(θ′, T) < 1 for all large T.
  * Every published bound has B(σ, T) → ∞ as T → ∞ for fixed σ < 1. Examples: Ingham, Huxley, Guth–Maynard
    T^{30(1−σ)/13 + o(1)}, and the explicit Kadiri–Lumley–Ng form C1(…)T^{8(1−σ)/3}(log)^{…} + C2 log² T.
  * The bounds also count zeros in [0, T]. They give no window-by-window information, while the chain is a supremum over
    all windows.
  * So no density theorem lowers q*. **PROVED** (structural), with the growth of published bounds as a literature fact.
  * Concretely, take one conjugate pair at β = 7/8 − η, γ ∈ (X/2, X/2 + 1), with every other zero on the line. This
    configuration agrees with Z_{7/8}, PT, MTY, VK and every density bound that is ≥ 1 at T ≈ 3·10¹².
* **Proportion results** (κ > 2/5 of zeros on the line, mollifier work) are lower bounds on a fraction of zeros. They are
  consistent with any set of off-line zeros of density zero.
* **Weil positivity / Toeplitz certificates (Route I).** These are positivity statements for test functions of bounded
  support (2a ≤ 0.96 in the project's certificates). They constrain smoothed sums over all zeros, not individual zeros
  at height 3·10¹². We know of no implication from them to a zero-free box. (Not a theorem; recorded as such.)

## 5. Exceptional zeros and the first-contact step (P5)

Heat flow ∂_t H_t = −∂_z² H_t: a simple zero moves by dz_k/dt = 2 Σ_{j≠k} 1/(z_k − z_j). Here this formula is used only
for the sign of one pair's term.

Let z_k = x_k + iy_k (y_k > 0) and let z_e = x_e ± iy_e be a conjugate pair with Δ = x_k − x_e. The pair contributes
V = Im[2/(z_k − z_e) + 2/(z_k − z̄_e)] to dy_k/dt. `tmp/beat78-height-pushup.py` (sympy) proves:

  V = 4 y_k (y_e² − y_k² − Δ²) / [(Δ² + (y_e − y_k)²)(Δ² + (y_e + y_k)²)].   **CERTIFIED** (exact identity)

* **Push-up.** V > 0 if and only if Δ² < y_e² − y_k². A pair above a zero pushes that zero upward within horizontal
  distance √(y_e² − y_k²) ≤ 3/4. For y_e = 3/4, the radius is 0.269, 0.559, 0.680 and 0.743 at contact levels y_k² =
  0.49, 0.25, 0.10 and 0.01.
* **Far field.** V = −4y_k/Δ² + 4y_k(3y_e² + y_k²)/Δ⁴ + O(Δ⁻⁶). The leading term does not depend on y_e, so a distant
  off-line pair acts like two real zeros to leading order. The excess over two real zeros is 12y_e²y_k/Δ⁴.
* **Self term.** The pair's own conjugate contributes −1/y_e, which is de Bruijn's rate.

Consequences for the chain (READING):

* An unlocated zero above the barrier invalidates step 3. The contact zero is no longer the highest, and nearby it is
  pushed up rather than pulled down. Even one zero with (2β − 1)² ≥ q0 above X violates step 2 directly.
* A located exceptional zero needs two things. First, a local exclusion of radius at most 3/4 around it in the first-contact
  argument. Second, its own barrier. The floors (J) are one-point bounds that do not depend on zero locations. At best, the
  exceptional zero obeys the same barrier ODE q′ = −2 − cq started at y_e². This assumes the kernel step applies to a
  zero that is highest only locally, which is not shown. Its descent then ends no earlier than a chain started at y_e²
  at the same height.
* Exceptional zeros up to 7/8 near the PT height thus reproduce the 7/8 value. They are harmless only if they lie at
  heights where the 7/8 start already meets the target, for example ≥ 16× the PT height for the θ′ = 0.85 level. That
  case is the two-zone box of §8.
* There is no source of finiteness (§4) and no source of locations. Locating zeros above 3·10¹² is verification-scale
  computation.

## 6. The 7/8 argument cannot be localized in height (P6). READING.

References are to lines of `/tmp/qrh-verify/paper.txt` (7/8 manuscript, 30 Sep 2026) and `/tmp/qrh-verify/paper2.txt`
(11/12 writeup, 5 Oct 2026).

* **Continuation principle** (Prop. 2.1, l. 381). A low bound |J_η(Z)| ≪ Z^{C(σ0)+ω} and a high bound
  |J_η − f_η| ≪ Z^{C(β*)−σ} together continue 1/L^S across the rightmost zeros. Both bounds are statements about powers
  of Z. Every zero at any height enters f_η through Z^{C(ρ)}, weighted by the constant e^{(ρ−5/6)²}. For fixed ρ, its
  height changes only the constant, not the power. The method therefore sees the supremum of real parts over all heights.
* **Where 7/8 comes from** (eqs. (12.3)–(12.4) l. 5169–5186; Prop. 15.3 l. 6460; (15.9) l. 6511).
  * The low estimate is |I_η| ≪ Z^{lx/2 + b/12 + ε}, and the normalisation is C_II(s) = lx/2 + s − 1 + h/6.
  * Equating C_II(σ0) with the low exponent gives σ0 = 1 − h/6 + b/12. With b = 1/8 and h = 13/16 this is 7/8.
  * No height parameter appears. The high side has positive slack: −E* ≥ 49/440640 in Lemma 20.2 (l. 11680).
* **Height enters only polynomially.** The analysis height is T1 = Z^τ. Lemma 11.1 (l. 4968) chooses τ after the target,
  so (1 + T1)^{A_η} ≪ Z^{m/4} is absorbed. The detector's height conditions (Lemma 8.2, l. 3485; Prop. 8.3, l. 3557) are
  of the same type.
* **The argument runs over the whole family.**
  * Detector bins satisfy a ≤ β* and δ ≤ 2β* − 1 (12.2, l. 5162). Here β* is the supremum over all primitive
    finite-order Hecke characters over Q(√−3), at all heights.
  * The Poisson rows introduce sextic twists with conductors up to Z^{d_max}, and "the entire family is needed even for
    the consequence about ζ".
  * Restricting β* to heights ≥ T0 would leave row zeros below T0 bounded only by 7/8. No verification covers the
    low-lying zeros of infinitely many conductors. The high estimate would then have to beat Z^{C(7/8)} without a margin.
* **The 11/12 writeup has the same structure** (paper2 §3, l. 651–700). It proves A_1(D) ≪ D^{11/12+ε} for all D and
  then shows that M_W(s) = ∫ A_1(D) D^{−s} dD/D is holomorphic on Re s > 11/12, with W(y) = y^{−ϱ}φ(y). The height of ϱ
  enters only through the seminorms of W in (3.1), as a polynomial constant.

So neither manuscript yields a height-dependent abscissa. Localizing would need finite-Z zero detection with D ≤ T^C, and
that is the zero-density and Vinogradov–Korobov regime, whose regions shrink to Re s = 1.

## 7. Quantification on the project chain. MEASURED, with HEURISTIC interpolation.

The values below are Raymond-chain runs (`tmp/qrh-theta-curve-out/raymond_*.json`, produced by
`tmp/qrh-theta-curve-raymond.sh`) with start q0 = (2θ − 1)² + 2·10⁻⁶. The X1 7/8 entry is the certified value (i). The
other entries are single runs of the same exact-rational consumer. Heights above X1 assume RH to that height, which is not
verified.

| θ | q0 bound | XL25 (2.5·10¹²) | X1 (PT) | 10X | 100X | 1000X |
|---|---|---|---|---|---|---|
| 7/8 | 0.5625 | 0.121313 | **0.118506** | 0.112236 | 0.107056 | 0.102616 |
| 0.86 | 0.5184 | – | 0.114167 | – | – | – |
| 0.85 | 0.4900 | 0.113638 | 0.111178 | 0.105617 | 0.100967 | – |
| 0.84 | 0.4624 | – | 0.108110 | – | – | – |
| 0.82 | 0.4096 | – | 0.101733 | – | – | – |
| 0.80 | 0.3600 | 0.096789 | 0.095022 | 0.090903 | 0.087345 | – |
| 0.78 | 0.3136 | – | 0.087984 | – | – | – |
| 0.75 | 0.2500 | 0.077964 | 0.076825 | 0.074079 | 0.071620 | – |
| 0.70 | 0.1600 | 0.057577 | 0.056949 | 0.055394 | 0.053957 | – |

**Exchange rates at the PT height** (`tmp/beat78-height-exchange.py`, output `tmp/beat78-height-out/exchange.json`):

* Near 7/8, dΛ/dθ ≈ 0.289 and dΛ/dq0 ≈ 0.098. Each 0.01 off the abscissa is worth about 0.0029 in Λ.
* A θ′ start saves about 0.75 of the time the 7/8 barrier takes to fall to (2θ′ − 1)². For θ′ = 0.85, the 7/8 path
  reaches 0.49 at t = 0.00969 and the saving is 0.00733. The ratio is below 1 because the floors grow with t, so a lower
  start runs on weaker early cells.

**θ-equivalent of verified height** (HEURISTIC): the abscissa at the PT height that gives the same Λ as the 7/8 start run
at height h.

| h | Λ(7/8, h) | θ_eq at PT | q0_eq |
|---|---|---|---|
| 10× PT | 0.112236 | 0.8535 | 0.500 |
| 100× PT | 0.107056 | 0.8367 | 0.454 |
| 1000× PT | 0.102616 | 0.8228 | 0.417 |

Read the other way, verifying RH to 10× the PT height is worth as much as proving QRH(0.8535). For the classical strip
start, the integration module's extrapolation puts the height that matches the 7/8 value at about 4.7·10¹⁶ (heuristic).

## 8. Two-zone construction: what a zero-free box from the PT height would buy. CONDITIONAL.

Suppose the following hold:

* (B) β ≤ θ′ for every zero with X/2 < γ < T2.
* (Z_{7/8}) holds above T2.
* (LW) A lateral-wall lemma at x = 2T2, analogous to AF §§2–3, holds for t ≤ 41/250. It must keep zeros of zone 2 that lie
  above the zone-1 barrier out of {x < 2T2 − 1}. A buffer of width at least 3/4 is needed because of the push-up radius
  in §5. **(LW) is not written.**
* The floors at 2T2 are certified, as the probes for 10X/100X/1000X already are.

Then the x-dependent barrier gives Λ ≤ max(Λ(θ′, X), Λ(7/8, 2T2)). Required T2 such that Λ(7/8, T2) ≤ Λ(θ′, PT)
(HEURISTIC, linear in log10 height between measured points):

| θ′ | Λ(θ′, PT) | required T2 | γ at T2 | zeros in (PT, T2), main term |
|---|---|---|---|---|
| 0.86 | 0.114167 | ≈ 4.9× PT | 1.5·10¹³ | 5.2·10¹³ (4.2 N(PT)) |
| 0.85 | 0.111178 | ≈ 16× PT | 4.8·10¹³ | 2.1·10¹⁴ (16.7 N(PT)) |
| 0.84 | 0.108110 | ≈ 63× PT | 1.9·10¹⁴ | 8.9·10¹⁴ (72 N(PT)) |
| ≤ 0.82 | ≤ 0.101733 | beyond the measured 1000× PT | – | – |

**Cost comparison** (HEURISTIC). Certifying (B) means pointwise exclusion. One route is |ζM − 1| < 1 on σ = θ′ with a
mollifier M, followed by the maximum principle. Another is the argument principle on [θ′, 2] × (X/2, T2). Either way, ζ
must be sampled on σ = θ′ at about the Gram spacing over the whole range. That is the same order of work as verifying RH
on (X/2, T2), and the box for θ′ = 0.85 contains about 17 times as many zeros as Platt–Trudgian's whole range. RH verified
to T2 gives Λ(7/8, 2T2) through the existing head wall (W), with no (LW). Since Λ(7/8, 2T2) ≤ max(Λ(θ′, X), Λ(7/8, 2T2)),
**the two-zone route is dominated by the verified-height route.**

## 9. Obstruction (precise)

The chain consumes a single supremum, q* over all zeros above the verified height (§1). To lower q0 below 9/16 + offset,
zeros with β > θ′ must be excluded pointwise:

* either at every height above 3·10¹², which is QRH(θ′) itself by P1;
* or in a box (PT, T2) with T2 ≈ 5–63× the PT height for θ′ = 0.86–0.84, plus a lateral-wall lemma.

None of the listed inputs excludes zeros pointwise in that region:

* Analytic regions near Re s = 1 stop at σ ≥ 0.99374 (§3).
* Density, proportion and positivity results bound counts or averages (§4).
* The 7/8 theorem cannot be localized in height, and its argument runs over the whole family (§6).
* PT ends at 3.0001753328·10¹².

Verification-type computation of the box costs about as much as RH verification to T2, which gives the same Λ (§8).
Finitely many exceptional zeros cannot be tolerated without their locations, and located ones help only above that same
T2 (§5).

## 10. Reproduction

```bash
cd /Users/USER/Documents/GitHub/mathexplorer
.venv-arb/bin/python -B tmp/beat78-height-regions.py    # §3, arb 256-bit, < 1 s
.venv-arb/bin/python -B tmp/beat78-height-pushup.py     # §5, sympy, a few s
.venv-arb/bin/python -B tmp/beat78-height-exchange.py   # §7–§8, reads tmp/qrh-theta-curve-out/raymond_*.json
# chain runs themselves (not re-run here): tmp/qrh-theta-curve-raymond.sh, tmp/qrh-theta-curve-heights.sh
```

## 11. Pointers outside this angle (READING, unverified)

* In Part II the boundary is σ0 = 1 − h/6 + b/12 (b = 1/8, h = 13/16), fixed by the low estimate.
  * The low-estimate length conditions of Prop. 15.3 are all equalities at d = ℓ = 1/6: lx − d = 3/16, ly − d = 5/16 and
    ly − d − 11b/6 = 1/12.
  * The high-side endpoint certificate has slack 49/440640.
  * Any route below 7/8 inside that architecture has to change the geometry (b, h, ℓ) or the low estimate. Height cannot
    do it.
* Verified height above 3·10¹² is the only height lever. With the 7/8 start it gives 0.112236 at 10× and 0.102616 at
  1000× the PT height (MEASURED, conditional on RH to those heights). The cost is HPC scale and out of scope here.
