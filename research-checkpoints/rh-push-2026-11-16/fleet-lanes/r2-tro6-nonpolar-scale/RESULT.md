# r2-tro6-nonpolar-scale: theta–row correlation in the manuscript geometry R = Q^1.4, N(m) ≤ 30000

Internal working note, 2026-11-16. Nothing committed, nothing pushed. Not refereed. Files:
`tmp/research-2026-11-16/push/r2-tro6-nonpolar-scale/` (scripts, logs, JSON) and, on the motherbox,
`~/rh-push/r2-tro6-nonpolar-scale/out/` (4.5 GB of per-row and per-conductor data).

**Verdict: partial result. One exact identity (PROVED-rel manuscript (4.7)) and measurements. TRO6^♮(η) is not
proved for any η > 0. θ = 7/8 unchanged. RH open. NO QED. No η claim.**

Labels: PROVED / CLASSICAL / EXACT (identity checked numerically) / MEASURED / HEURISTIC / OPEN.

## 0. Summary

1. **[EXACT algebra; asymptotic CLASSICAL-not-traced; MEASURED to 0.9% on one stratum]** The Möbius-phased row
   β = μ·conj(αG)·χ_•(−e₀) of round 1 is the conjugate of a smoothed partial sum of the theta series itself:
   β(c)γ₂(c) = conj(γ₁(c))χ_c(−e₀), so conj(B_m) = Σ_c w_R(N(c))·g̃₁(−e₀m, c) ≈ C·R^{1/6}·Σ_s ρ^{str}_s(−e₀m),
   C = (2/3)√(π/2)e^{1/288} = 0.8384. The measured form Σ_m ρ^♮_σ B_m equals C·R^{1/6}·Σ_m ρ^♮_σ conj(ρ^{str})
   (noise-corrected) with ratio 1.000–1.009 on rows not prime to 6 and 1.024–1.085 on rows prime to 6 for
   Q ≥ 7500, phase 0 (`ident.log`). The correlation of this row with ρ^♮ is the correlation of ρ with ρ. Its
   non-decay is not a numerical question.
2. **[MEASURED] Aligned row along R = Q^1.4**, 11 values Q = 938 … 30000 (108,522 generic rows at the top),
   leave-one-out: r = 0.231 → 0.257 (all rows), 0.306 → 0.345 (prime to 6), 0.223 → 0.249 (not prime to 6).
   δ in r ∼ Q^{−δ}: −0.024 [−0.037, −0.012] over all Q; −0.003 [−0.014, +0.007] over Q ≥ 3750. In all six
   (stratum, range) cells the 95% upper bound is ≤ 0.0111 < 0.0125: decay at the rate of full removal (η = 1 in the
   note's dictionary) is excluded for this row; δ = 0 is not excluded. At fixed R = 1.85·10⁶ the same row decays,
   δ = 0.040 [0.030, 0.050] (0.059 over Q ≥ 3750), which is the saturation curve of item 1, not a saving.
3. **[MEASURED] Rows with a target** (ν = quartic character mod π₁₃, ν = α⁶, the Davenport–Heilbronn-type combination of
   the two quartic characters, random signs; Möbius-phased and manuscript-type β = αν, with and without the n³ part):
   after the leave-one-out correction, with or without subtraction of the polar term, r is at the level of a
   random-phase null at every Q: mean (r/null)² = 0.97 (before) and 0.88 (after subtraction) over 14 row types × 11 Q.
   Fitted δ = 0.32–0.71 (null: 0.50 ± 0.06). δ = 0 is excluded at 95% for every such row, but the statistic is at
   its noise floor 1/√rows = 0.003; it bounds a coherent non-polar component by about 0.003–0.005 at Q = 30000 and
   does not resolve η.
4. **[MEASURED] Polar part of manuscript-type rows.** The polar (Gauss-sum law) component of rows β = αν is
   detected at 9–19 times its own null at Q = 30000 (r_pol = 0.0004–0.0010 against 0.00005) and decays with
   δ = 0.54–0.81; the random-sign control has 0.56 and the square-root law for a Möbius sum of length Q^{1.4} is 0.70.
5. **[MEASURED] Non-multiplicative control.** The Davenport–Heilbronn-type target behaves like the Hecke targets
   and like the random-sign control in every statistic (r, δ, polar part). It differs only from the row with trivial
   target (item 2). The measurements do not separate Euler from non-Euler targets.
6. **[MEASURED] The law at scale, and a correction of its class structure.** The phase γ₁(c)·conj χ_c(−e₀)
   persists to N(c) = 10⁷ at Q = 30000 (coherence 0.27–0.40 over 1,975,846 conductors in the last band; random
   0.002). Coherent amplitude ∝ Q^{0.86–0.90}·N(c)^{−0.35–0.36} on the main class shifts (heuristic 5/6, 1/3).
   On rows prime to 6 the response is in all six classes σ = class(c)·τ, τ ∈ {±1, ±ω, ±ω²}, each with its own unit;
   it is not confined to one class σ′(c).

## 1. Plan; what is new against the atlas, the walls and round 1

* **Atlas (PR #27 §10)** records the 7/8 boundary and the sixth-phase obstruction; no closed route is re-run. The object
  is TRO6^♮ of `formalization/paper/sextic-theta-synthesis.md`.
* **Round 1** (`../tro6-numerics/RESULT.md`, `REFEREE.md`): N(m) ≤ 3199, R ≤ 3·10⁴, paths R ∝ Q only, strata mixed,
  aligned row δ ∈ [−0.026, 0.044] on one path and 0.115, 0.055 at fixed R; unresolved whether η = 0 is sharp.
  New here: N(m) ≤ 30000 (9.4×), conductors to 10⁷ (the whole exact table), the path R = Q^{1.4} at 11 points,
  rows with targets and a non-multiplicative control, exact leave-one-out, polar subtraction that is linear in the
  rows (so it can be bootstrapped), the two strata kept apart, and the identification in item 1 of §0.
* **`../tro6-shifted-conv/REFEREE.md`, last paragraph** reduces (PS-U) to twisted first moments of ρ^♮·ζ_m; the
  per-conductor sums S_σ(c; Q) stored here are those first moments for sextic twists, for 2,822,619 conductors.
* **Walls.** Nothing here is a statement about zeros. MV-CAP, flow-blindness and verified height are not engaged.
  DH: §6.

## 2. Setup

Notation of round 1. F = Q(ω), −e₀ = 2λ⁵, σ = class mod 4 (12 classes), exact table `tmp/sextic/data/sf_1e7.npz`
(γ₁, γ₂, γ₃ at 2,822,619 squarefree primary moduli prime to 6, N ≤ 10⁷).

* **Coefficient.** ρ^♮_σ(−e₀m) = ρ^{str} + ρ_cor by proof note (3.9), same code path as round 1 (`rows_nat.py`,
  correction terms for primes N(p) ≤ 100, WLS constant of X^{2/3} on 89 shells in (10³, 10⁷]).
* **Rows.** All m with 0 < N(m) ≤ 30000, one of each pair ±m: 54,393 half rows (54,261 generic; the 132 with good
  part a sixth power are dropped). The other half follows from ρ_σ(−y) = χ_σ(−1)ρ_σ(y) and χ_c(−m) = χ_c(−1)χ_c(m)
  [PROVED in round 1; rechecked 1.1·10⁻¹⁴]: full sums are twice the half sums on cells par(σ) = par(c) and vanish
  on the others, par(x) = ((N(x) − 1)/6) mod 2. Strata: prime to 6 (27,183 half rows), not prime to 6 (27,078).
* **Geometry.** Q_j = 30000·2^{−(10−j)/2}, j = 0..10 (937.5 … 30000); R_j = Q_j^{1.4} (14,480 … 1,853,403).
  B_m = Σ_c β(c)γ₂(c)χ_c(m)N(c)^{−1/2}V(N(c)/R), V(x) = exp(−2log²x), |log(N(c)/R)| ≤ 1.6, all inside the table.
  n³ part: A = cn³, n squarefree ≠ 1, weight N(n)^{−1}, β(cn³) = β(c)·(α or conj α)(n)³·ν(n)³; it carries 2.5–6%
  of ‖B‖². Each row has B for all R_k with Q_k ≥ N(m).
* **Row types** (13 computed, 2 derived by linearity). al = μ·conj(αG)·χ_•(−e₀).
  Möbius-phased: `res` = al; `res*x13` = al·χ₁₃, χ₁₃ the quartic character modulo the prime above 13 with ω ≡ 3
  (residue a + 3b mod 13, discrete logarithm to base 2); `res*x13c` (conjugate); `res*a6` = al·α⁶; `res*rnd` = al·(fixed random signs);
  `mob` = al without μ. Manuscript type (β = α·ν, the Möbius factor comes from γ₁γ₂ = μαG): `a`, `aG`, `a*x13`,
  `a*x13c`, `a*a6`, `a*rnd`; `one` (β = 1).
  Davenport–Heilbronn-type control: ν_DH = ((1 − iκ)χ₁₃ + (1 + iκ)conj χ₁₃)/2, κ = (√(10 − 2√5) − 2)/(√5 − 1)
  (`res*dh`, `a*dh`); not multiplicative, |ν_DH| not constant.
* **Leave-one-out, exact.** ρ̂_σ(m) = Σ_n wt_{σ,m}(n)g̃(−e₀m, n) is linear with wt = a_s/(n_{s,σ}(m)·W_σ(m)) on shell s.
  The n = c term of Σ_mρ̂_σ(m)χ_c(m) is pred(c)·Σ_m wt_{σ,m}(c), pred(c) = γ₁(c)conj χ_c(−e₀), σ = class(c). It is
  accumulated per conductor with the row-dependent weights and subtracted (round 1 used row-independent weights).
  Every conductor of every row window lies in the estimator's range, so all results depend on this correction:
  raw r for the aligned row is 0.307 against 0.257 after it. The self-terms of the correction terms ρ_cor (phase
  pred·χ_c(c₁)², relative weight ≤ N(p)^{−11/6}) are not subtracted.
* **Polar subtraction.** Band law: S_σ(c) ≈ K[class(c), σ, shell(c)]·pred(c), K = mean of S_loo·conj(pred) over the
  (class, shell) cell, complex, one value per (class of c, σ, shell): no assumption on which class resonates or with
  which unit. Smooth law: K = N^{−1/3}·(cubic in log N) per (class of c, σ). Both are linear in the data;
  subtracting them equals pairing ρ with B − B_pol, where B_pol replaces the coefficient by conj(pred)·(cell mean
  of coefficient·pred). Variants: `loo` (no subtraction), `band`, `smooth`, `polar` (the subtracted part).
* **Statistic.** r = [mean_σ |X_σ|²/(Σ_m|ρ_σ|²·Σ_m|B_m|²)]^{1/2}, same rows in numerator and norms.
  δ = −slope of log r on log Q over the 11 path points; also over the 7 points Q ≥ 3750.
* **Intervals.** Block bootstrap: row orbits under units and conjugation are assigned to 400 random blocks, 400
  resamples of blocks, percentile 95%. Null: one random phase per orbit, common to the 12 classes, 30 draws.
* **Dictionary** (round 1, EXACT bookkeeping): Z^{−ηb/12} = Q^{−η/80}; η = 1 is δ = 0.0125.
* Noise share of Σ|ρ̂|² (generic rows): 0.242.

## 3. Validation (`selftest.log`, `validate.log`, first lines of `analysis.log`)

| check | result |
|---|---|
| complete Gauss sums against direct summation over residue systems (round-1 self-test, rerun on the motherbox) | 35 comparisons, max 4.7·10⁻⁸ |
| ρ^{str}, ρ_cor, se, flags against round 1 on the 5,814 common half rows | 1.1·10⁻¹⁴, 1.1·10⁻¹⁵, 3.5·10⁻¹⁸, equal |
| B (types a, aG, res, one) and n³ part against a direct evaluation with independent residue symbols, 6 rows, all R | 5.4·10⁻¹⁴, 4.9·10⁻¹⁶ |
| per-conductor sums against direct sums from round-1 symbols (28,224 conductors × 12 classes × 2 strata, Q_0..Q_3) | ≤ 1.8·10⁻⁶ (single-precision snapshots) |
| Σ_mρB from per-row data against Σ_c coef·S from per-conductor data, all path points and types | 8.1·10⁻¹² |
| γ₁γ₂ = μαG on 2,822,619 moduli | 4.9·10⁻⁹ |

## 4. Results

### 4.1 The law at this scale [MEASURED] (`law.log`)

z² = |S_σ(c)|²/Σ_m|ρ_σ|², leave-one-out, Q = 30000; "coh" = Σ_classes|Σ_c S·conj(pred)|/Σ_c|S| (a per-class unit
is allowed). Bands of N(c): 10³–3·10³ / 10⁴–3·10⁴ / 10⁵–3·10⁵ / 10⁶–3·10⁶ / 3·10⁶–10⁷ (566 / 5,628 / 56,453 /
564,504 / 1,975,846 conductors).

| rows | τ (σ = class(c)·τ) | z² | coh | unit against pred |
|---|---|---|---|---|
| not prime to 6 | 1 | 92.8 / 20.1 / 5.22 / 2.98 / 2.79 | 1.00 / 0.99 / 0.89 / 0.56 / 0.40 | 1 |
| not prime to 6 | ω, ω² | 4.88 / 2.21 / 1.75 / 1.73 / 1.74 | 0.96 / 0.75 / 0.33 / 0.15 / 0.10 | e^{±0.08i} |
| prime to 6 | −1 | 40.8 / 9.74 / 3.08 / 2.11 / 1.97 | 1.00 / 0.97 / 0.74 / 0.42 / 0.29 | −χ_c(−1) |
| prime to 6 | ω, ω² | 16.0 / 3.80 / 2.15 / 1.91 / 1.89 | 0.99 / 0.87 / 0.51 / 0.24 / 0.16 | e^{±0.60i} |
| prime to 6 | −ω, −ω² | 6.43 / 2.84 / 2.07 / 1.92 / 1.90 | 0.97 / 0.79 / 0.48 / 0.23 / 0.15 | phase −2.31 rad (c of even parity), +0.83 rad (odd parity) for −ω; conjugate for −ω² |
| prime to 6 | 1 | 5.64 / 4.35 / 2.61 / 2.01 / 1.94 | 0.98 / 0.91 / 0.68 / 0.38 / 0.27 | 1 |

* Non-resonant cells have z² = 1.7–1.9.
* The referee's E1 for round 1 (one class σ′(c) = −class(c) on rows prime to 6) is the largest entry of a
  six-class pattern. The unit −χ_c(−1) on that class means the phase there is −γ₁(c)conj χ_c(+e₀).
* Coherent amplitude per conductor, 8 bands 10³ < N(c) ≤ 10⁷ × 11 Q: ∝ Q^a N(c)^{−b} with a = 0.902 ± 0.003,
  b = 0.350 ± 0.001 (not prime to 6, τ = 1); a = 0.863, b = 0.355 (prime to 6, τ = −1); a = 0.872, b = 0.363
  (prime to 6, τ = ω). Rms log residual 0.03. Heuristic values 5/6 and 1/3. The law does not steepen out to
  N(c)/Q = 330.
* For τ = 1 on rows not prime to 6, z² stays 0.7–1.0 above the null in the last three bands while coh falls: an
  incoherent excess in the self-term class, not explained.

### 4.2 The aligned row is the theta partial sum [EXACT + MEASURED] (`ident.log`)

* **Identity [PROVED-rel manuscript (4.7); EXACT, checked to 10⁻⁶ on all moduli].** γ₁γ₂ = μαG, |γ₁| = |αG| = 1 and
  μ² = 1 on squarefree c give μ·conj(αG)·γ₂ = conj(γ₁). Hence for β = μ·conj(αG)·χ_•(−e₀):
  conj(B_m) = Σ_c w(N(c))·conj(χ_c(−e₀m))γ₁(c) = Σ_c w(N(c))·g̃₁(−e₀m, c), w(x) = x^{−1/2}V(x/R).
* **Asymptotic [definition of ρ^{str} as the X^{2/3} constant; uniformity in m not traced].** Partial summation
  against Σ_{N(c) ≤ X, c ∈ s}g̃₁ ∼ ρ^{str}_s X^{2/3} gives conj(B_m^{p}) ≈ C·R^{1/6}·Σ_{s of parity p}ρ^{str}_s(−e₀m),
  C = (2/3)∫e^{u/6−2u²}du = 0.8384.
* **Test [MEASURED].** Prediction X0_σ = C·R^{1/6}·G_σ, G_σ = Σ_mρ^♮_σ·conj(ρ^{str}_{blk(σ)}) − Σ_m se_σ² (the last term
  removes the estimator noise shared by the two factors). "ratio" = Σ_σ X0·conj(pred)/Σ|pred|².

  | Q | R | prime to 6: ratio, r, r predicted, theta share of ‖B‖² | not prime to 6: same |
  |---|---|---|---|
  | 938 | 14,480 | 1.204, 0.3059, 0.2532, 0.25 | 1.074, 0.2227, 0.2078, 0.42 |
  | 3750 | 100,843 | 1.117, 0.3417, 0.3055, 0.38 | 1.046, 0.2399, 0.2298, 0.52 |
  | 7500 | 266,125 | 1.085, 0.3460, 0.3185, 0.42 | 1.009, 0.2456, 0.2436, 0.60 |
  | 15000 | 702,308 | 1.049, 0.3410, 0.3249, 0.46 | 1.000, 0.2458, 0.2459, 0.63 |
  | 30000 | 1,853,403 | 1.024, 0.3448, 0.3365, 0.51 | 1.003, 0.2485, 0.2477, 0.66 |
  | 938 | 1,853,403 | 0.940, 0.4033, 0.4291, 0.71 | 0.989, 0.2810, 0.2843, 0.78 |

  The imaginary part of every ratio is below 5·10⁻⁴. The ratio tends to 1 as R grows. "Theta share" is
  C²R^{1/3}·(Σ|ρ^{str}_blk|² − noise)/‖B‖²: at R = Q^{1.4} between a quarter and two thirds of the row's norm is the
  theta function, and the share rises with Q because |ρ|²R^{1/3} ∼ Q^{−1/6+0.47}.
* **Consequence.** r for this row is |⟨ρ^♮_σ, ρ^{str}_blk⟩|/(‖ρ_σ‖‖ρ_blk‖) times a saturation factor
  (s/(1 + s))^{1/2}, s ∝ Q^{−1/6}R^{1/3}. Along R = Q^{1.4}, s grows and r rises to its ceiling. At fixed R, s falls
  like Q^{−1/6} and r falls by at most Q^{−1/12}. Both are seen in §4.3. The "polar law" of §4.1 is the same fact per
  conductor.

### 4.3 Aligned row along R = Q^1.4 [MEASURED] (`analysis.log`, variant `loo`)

| rows | r at Q = 938, 1326, 1875, 2652, 3750, 5303, 7500, 10607, 15000, 21213, 30000 | δ all Q (sd) [95%] | δ, Q ≥ 3750 (sd) [95%] |
|---|---|---|---|
| prime to 6 | 0.3059 0.3258 0.3328 0.3318 0.3417 0.3461 0.3460 0.3425 0.3410 0.3420 0.3448 | −0.0247 (0.0069) [−0.0382, −0.0125] | +0.0012 (0.0054) [−0.0091, +0.0111] |
| not prime to 6 | 0.2227 0.2312 0.2323 0.2350 0.2399 0.2446 0.2456 0.2473 0.2458 0.2462 0.2485 | −0.0286 (0.0103) [−0.0475, −0.0092] | −0.0123 (0.0080) [−0.0273, +0.0024] |
| all generic | 0.2310 0.2418 0.2460 0.2469 0.2529 0.2561 0.2557 0.2554 0.2541 0.2549 0.2569 | −0.0241 (0.0064) [−0.0368, −0.0120] | −0.0033 (0.0053) [−0.0137, +0.0066] |
| all, with n³ part | 0.2271 … 0.2490 … 0.2537 | −0.0256 [−0.0388, −0.0133] | −0.0048 [−0.0157, +0.0048] |
| all, fixed R = 1,853,403 | 0.2952 0.2935 0.2928 0.2907 0.2900 0.2867 0.2811 0.2761 0.2694 0.2634 0.2569 | +0.0397 (0.0052) [+0.0303, +0.0501] | +0.0593 (0.0046) [+0.0507, +0.0677] |

* 1/√rows = 0.0030 at the top; r is 80–115 times that. The orbit-phase null for this row gives r = 0.005.
* After band subtraction the remainder of this row is r = 0.0001–0.0008. That is by construction: for the trivial
  target the coefficient·pred is positive and smooth, so the band law reproduces the whole form. The remainder
  carries no information for this row. With the smooth law the remainder is 0.010 → 0.0015.
* Fixed R: prime to 6 δ = 0.0435 [0.0361, 0.0512]; not prime to 6 0.0377 [0.0237, 0.0525].

### 4.4 Rows with a target, before and after polar subtraction [MEASURED]

All generic rows, path R = Q^{1.4}. r at Q = 938 / 3750 / 30000; null r at 30000 is 0.0029–0.0032.

| row | r, `loo` | δ `loo` [95%] | r, `band` | δ `band` [95%] |
|---|---|---|---|---|
| res*x13 (Hecke, order 4) | 0.0132 / 0.0060 / 0.0024 | 0.411 [0.349, 0.567] | 0.0140 / 0.0060 / 0.0024 | 0.420 [0.360, 0.575] |
| res*a6 (Hecke, infinite order) | 0.0177 / 0.0058 / 0.0017 | 0.576 [0.371, 0.674] | 0.0179 / 0.0059 / 0.0017 | 0.576 [0.377, 0.677] |
| res*dh (non-multiplicative) | 0.0148 / 0.0048 / 0.0023 | 0.507 [0.397, 0.619] | 0.0142 / 0.0048 / 0.0023 | 0.503 [0.399, 0.617] |
| res*rnd (random signs) | 0.0154 / 0.0089 / 0.0029 | 0.477 [0.393, 0.582] | 0.0159 / 0.0083 / 0.0028 | 0.495 [0.407, 0.606] |
| mob (no μ) | 0.0221 / 0.0090 / 0.0023 | 0.638 [0.437, 0.723] | 0.0220 / 0.0086 / 0.0020 | 0.625 [0.426, 0.717] |
| a (manuscript, trivial target) | 0.0162 / 0.0105 / 0.0018 | 0.518 [0.376, 0.648] | 0.0177 / 0.0082 / 0.0015 | 0.628 [0.416, 0.677] |
| aG | 0.0188 / 0.0072 / 0.0037 | 0.507 [0.362, 0.649] | 0.0152 / 0.0077 / 0.0037 | 0.469 [0.339, 0.612] |
| a*x13 | 0.0207 / 0.0116 / 0.0032 | 0.673 [0.491, 0.686] | 0.0183 / 0.0108 / 0.0033 | 0.619 [0.460, 0.657] |
| a*a6 | 0.0131 / 0.0102 / 0.0033 | 0.373 [0.312, 0.570] | 0.0101 / 0.0084 / 0.0034 | 0.324 [0.308, 0.574] |
| a*dh (non-multiplicative) | 0.0219 / 0.0080 / 0.0033 | 0.607 [0.458, 0.662] | 0.0174 / 0.0076 / 0.0035 | 0.534 [0.405, 0.625] |
| a*rnd | 0.0167 / 0.0088 / 0.0023 | 0.545 [0.417, 0.618] | 0.0137 / 0.0074 / 0.0022 | 0.525 [0.407, 0.607] |
| null (all types) | 0.017 / 0.0087 / 0.0030 | 0.50 ± 0.06 | same | 0.50 ± 0.06 |

* Mean (r/null)² over the 14 non-aligned types, by stratum: `loo` 0.98 (prime to 6), 0.90 (not prime to 6), 0.97
  (all); `band` 0.90, 0.85, 0.88. Largest single ratio r/null: 1.94 (a*a6, prime to 6, Q = 15000).
* By stratum the lower 95% bounds of δ are 0.22–0.47 (prime to 6) and 0.28–0.47 (not prime to 6); all tables in
  `analysis.log`.
* The n³ part alone (`n3only`) is at the same level: r = 0.011–0.019 → 0.0022–0.0031, δ = 0.40–0.51.
* The percentile intervals of these noise-level rows are biased (several point estimates lie at or outside the
  upper end). They are quoted as computed; the null column is the calibration.

### 4.5 Polar part of the manuscript-type rows [MEASURED] (variant `polar`)

| row | r_pol at Q = 938 / 3750 / 30000 | r_pol/null at 938 … 30000 | δ all Q [95%] | δ, Q ≥ 3750 [95%] |
|---|---|---|---|---|
| a | 0.0051 / 0.0041 / 0.0010 | 1.8 … 19.1 | 0.536 [0.495, 0.613] | 0.634 [0.594, 0.683] |
| aG | 0.0104 / 0.0027 / 0.0007 | 3.2 … 14.5 | 0.610 [0.558, 0.682] | 0.591 [0.541, 0.659] |
| a*x13 | 0.0078 / 0.0032 / 0.0009 | 2.5 … 18.5 | 0.654 [0.636, 0.707] | 0.661 [0.625, 0.711] |
| a*a6 | 0.0053 / 0.0032 / 0.0004 | 1.8 … 9.1 | 0.808 [0.760, 0.887] | 1.061 [1.005, 1.111] |
| a*dh (non-multiplicative) | 0.0093 / 0.0025 / 0.0009 | 3.0 … 18.7 | 0.718 [0.695, 0.762] | 0.493 [0.458, 0.549] |
| a*rnd (random signs) | 0.0076 / 0.0031 / 0.0011 | 2.4 … 20.0 | 0.559 [0.536, 0.615] | 0.492 [0.453, 0.536] |
| one | 0.0151 / 0.0059 / 0.0026 | 3.8 … 34.2 | 0.539 [0.496, 0.591] | 0.429 [0.390, 0.469] |
| mob | 0.0049 / 0.0020 / 0.0005 | 1.6 … 8.2 | 0.741 [0.686, 0.830] | 0.605 [0.504, 0.727] |
| res*x13, res*a6, res*dh | ≤ 0.003 → ≤ 0.0001 | — | 1.05–1.13 | 0.87–0.95 |

* The polar part of a row with coefficient β is Σ_cells K·Σ_{c ∈ cell}β(c)γ₂(c)pred(c)w(c). For β = αν the inner sum
  is Σμ(c)·(α²G·conj χ_c(−e₀)·ν)(c)·w(c): a Möbius sum of length ≈ R = Q^{1.4}. Square-root cancellation
  predicts r_pol ≈ r_res/√N_eff, i.e. δ ≈ 0.70. The random-sign control, where square-root cancellation holds by
  construction, measures 0.56 (0.49 over Q ≥ 3750); that difference is the systematic error of this statistic.
* For the Möbius-phased rows with a non-trivial target the cell sums are character sums over classes and vanish.
* The projected polar part is below the total noise (r_pol ≤ 0.0026 against a null of 0.0030 for the full form at
  Q = 30000): the polar term of a manuscript-type row cannot be seen in the unprojected form at this size.

## 5. Answers to the task items

1. **Table.** N(m) ≤ 30000 as asked (54,393 half rows = 108,786 rows), residue symbols of every row at all 2,822,619
   conductors N(c) ≤ 10⁷ (above Q^{1.4}·e^{1.6} = 9.2·10⁶). Per-conductor sums are stored at 11 values of Q for 2 strata
   and the 6 non-vanishing classes; the full symbol matrix (3·10¹¹ entries) is not stored.
2. **Rows.** §2. Three targets and more; with and without the n³ part.
3. **Polar subtraction and r(Q).** §4.3–4.5; 11 values of Q; two strata; block bootstrap.
4. **δ and η = 0.** For the Möbius-phased row with trivial target, δ ≤ 0.0111 at 95% in every stratum and range, so the
   rate δ = 0.0125 (η = 1) is excluded and η = 0 is not excluded; by §4.2 the true value is δ ≤ 0 on this path. For
   every row with a non-trivial target, and for every manuscript-type row, δ = 0 is excluded at 95% (lower bounds
   0.22–0.49) before and after polar subtraction, with nominal 80δ > 1; this is the noise floor of the statistic
   (r = null), not a measurement of η. No η claim.
5. **Non-multiplicative control.** It does not behave differently from the Möbius rows with Hecke targets, or from
   the random-sign control. It behaves differently from the trivial-target row only.

## 6. DH control and where the Euler product would enter

* No statement here concerns zeros, so no step has to fail for Davenport–Heilbronn.
* §4.2 sharpens the requirement on any proof of TRO6^♮. The row β = μ·conj(αG)·χ_•(−e₀) is bounded, is a product of
  μ, a Hecke character and finite-order factors, and attains Cauchy–Schwarz up to the constant 0.25–0.35 with no
  decay, because it is the theta function. A manuscript row has β = α·ν_σθ with ν completely multiplicative; the
  two coincide only if ν_σθ = μ·conj(α²G)·χ_•(−e₀), which no completely multiplicative ν satisfies. A proof must
  therefore use complete multiplicativity of the target (or equivalently bound Σμ(c)ϑ(c)N(c)^{−5/6−t} for the Hecke
  character ϑ = α²G·conj χ_•(−e₀)·ν_σθ, a statement about 1/L(·, ϑ)). An argument that treats β as a bounded sequence,
  or as μ times a multiplicative function, is refuted by this row.
* For f_DH the row is c₁B(χ) + c₂B(χ̄) and the form is linear in the row. The measured DH rows are the same linear
  combination of two Hecke rows (computed that way, exactly) and are at the null level like their components.
  Cancellation in the DH row follows from the two Euler components separately and carries no information on the
  zeros of f_DH; the measurement is consistent with that and cannot test more.

## 7. Verdict

* **PROVED-rel (4.7) / EXACT:** the aligned Möbius-phased row equals the conjugate smoothed theta partial sum.
* **MEASURED:** Σ_mρ^♮_σB_m = C·R^{1/6}·⟨ρ^♮_σ, ρ^{str}⟩ within 0.9% (not prime to 6) and 2.4–8.5% (prime to 6) for
  Q ≥ 7500 on R = Q^{1.4}; r = 0.257 (0.345, 0.249) at Q = 30000 with δ ≤ 0.0111 at 95%.
* **MEASURED:** rows with Hecke, DH-type or random-sign targets are at the null level before and after polar
  subtraction (mean (r/null)² 0.85–0.98), δ ≈ 0.5.
* **MEASURED:** polar part of manuscript-type rows detected at 9–19× null (Q = 30000), decaying with δ = 0.54–0.81; no
  difference between Hecke, DH-type and random-sign targets.
* **MEASURED:** law phase to N(c) = 10⁷; amplitude Q^{0.86–0.90}N(c)^{−0.35–0.36}; six resonant class shifts on rows
  prime to 6.
* **OPEN:** TRO6^♮(η) for any η > 0; the uniform asymptotic for the smoothed Kubota sum that would make §4.2 a
  theorem with error term; a lower bound for ⟨ρ^♮_σ, ρ^{str}⟩; the units e^{±0.60i} on the shifts ω, ω².
* No change to θ or to any Λ value.

## 8. Three weakest steps

1. **Everything rests on the leave-one-out correction.** All row conductors lie inside the estimator's range
   (10³, 10⁷], and the uncorrected value for the aligned row is 20% higher. The correction is exact for the n = c
   term of the stripped estimator. It ignores the self-terms of ρ_cor, and it does not address finite-table bias of
   ρ̂ for conductors near 10⁷, where the top two path points have their windows (to 9.2·10⁶) and where z² shows an
   unexplained incoherent excess (§4.1). The agreement of §4.2 is between two quantities built from the same ρ̂ and
   the same table, so it tests the bookkeeping and the partial-sum asymptotic, not the estimator.
2. **Noise floor.** For every row with a target the statistic equals its null; the stated δ ≈ 0.5 and the "95%
   exclusion of δ = 0" describe 1/√rows. A coherent non-polar component below about 0.003–0.005 at Q = 30000, or one
   decaying like Q^{−0.0125}, is invisible. The bootstrap percentile intervals for these rows are biased. 24% of
   Σ|ρ̂|² is estimator noise, which is an arithmetic linear form and not white.
3. **Toy rows.** S′ = ∅, Gaussian window in place of the manuscript Mellin weight, n squarefree, the k⁶ diagonal
   absent, targets on generators (χ₁₃ on primary generators, α⁶) rather than the manuscript's ν_σθ. The band law has
   6,480 complex amplitudes per (Q, stratum); the smooth law (288) gives the same tables for rows with a target but
   was not otherwise varied. The polar decay rates of §4.5 carry a systematic of about 0.15 (random-sign control).

## 9. Reproduction

Motherbox, `~/rh-push/r2-tro6-nonpolar-scale/`, venv `~/rh-push/venv` (numpy 2.5.5, scipy 1.18.1), 8 processes.

| step | command | time |
|---|---|---|
| brute-force self-test | `SEXTIC_DIR=$PWD/sextic python rows_nat.py 3200 0 0 x --selftest` | 10 s |
| rows, per-conductor sums | `python scale.py 30000 11 8 out` (resumable per bin; rebuilds the 9.1 GB symbol cache, 3 min) | 53 min |
| checks against round 1 | `python validate.py out r1` | 3 min |
| r(Q), bootstrap, null | `python analysis.py out analysis.json` | 25 s |
| law per conductor | `python law.py out law.json` | 2 min |
| theta partial-sum test | `python ident.py out` | 15 s |

Local files: `scale.py`, `rows_nat.py` (round-1 code, path made configurable), `analysis.py`, `law.py`, `ident.py`,
`validate.py`, `strata_class.py` (class structure on the round-1 data), `run.log`, `selftest.log`, `validate.log`,
`analysis.log`, `analysis.json`, `law.log`, `law.json`, `ident.log`, `static.npz`. Peak resident memory was 20.7 GB
summed over processes with shared pages counted once per process; the symbol cache was deleted after the run.
