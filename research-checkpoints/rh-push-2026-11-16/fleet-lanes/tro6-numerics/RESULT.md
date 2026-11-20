# tro6-numerics: correlation of complete sextic theta coefficients with cubic rows, N(m) ≤ 3199

Internal working note, 2026-11-16. Nothing committed, nothing pushed. Not refereed. All files are in
`tmp/research-2026-11-16/push/tro6-numerics/`.

**Verdict: partial result (measurements only). TRO6^♮(η) is not proved for any η > 0. θ = 7/8 unchanged. RH open.
NO QED.**

Labels: PROVED / CLASSICAL / CITED / EXACT (exact identity checked numerically) / MEASURED / HEURISTIC / OPEN.

## 0. Summary

1. **[MEASURED] Target-free cubic rows.** For 11,628 rows (all m ∈ Z[ω], 0 < N(m) ≤ 3199; 4× the earlier Q = 796) the
   normalised correlation of the complete coefficient ρ^♮_σ(−e₀m) with toy completed cubic rows (A = c and A = cn³,
   R = 10⁴, 10⁵, 10⁶, twists α, αG, 1) is at the random level on generic rows: r_rms = 0.0095 against
   1/√rows = 0.0093. Fitted exponent in r ∼ Q^{−δ}: **δ = 0.506, row-bootstrap sd 0.015, 95% [0.490, 0.551]**
   (symmetry-preserving null 0.526 ± 0.015). δ = 0 is excluded. In the manuscript geometry Z^{−ηb/12} = Q^{−η/80}, so
   this is nominally η = min(1, 80δ) = 1; that number is a property of rows without a target and does not transfer
   (item 3).
2. **[MEASURED] Diagonal Gauss-sum law** (independent confirmation and extension of the polar law of
   `../tro6-spectral/RESULT.md` §3, with the unit identified). For every squarefree c prime to 6 with N(c) ≤ 10⁵
   (28,224 conductors) and σ = class of c mod 4:

     S_σ(c; Q) := Σ_{N(m)≤Q} ρ^♮_σ(−e₀m) χ_c(m) ≈ K(N(c), Q) · γ₁(c) · conj(χ_c(−e₀)),  K > 0.

   Phase alignment with γ₁(c)conj(χ_c(−e₀)): 1.0000, 0.9989, 0.9986, 0.9927 for N(c) in [2,30], [31,100], [101,300],
   [301,1000] (random baseline 0.38 … 0.07), and 0.982, 0.952, 0.885, 0.742 up to 10⁵ (baseline 0.04 … 0.007).
   Size: (z² − 2) ≈ 1.4·Q^{a}N(c)^{−b}, a = 0.82 ± 0.05, b = 0.60 ± 0.02; |S| grows like Q^{0.804 ± 0.021} for the 15
   smallest c ≠ 1. The heuristic values are a = 5/6, b = 2/3 (|S| ∝ Q^{5/6}N(c)^{−1/3}).
3. **[MEASURED + EXACT algebra] Where the correlation is large.** Because γ₁(c)γ₂(c) = μ(c)α(c)G(c) (manuscript (4.7);
   checked on all 28,224 conductors to 3.7·10⁻⁹), the diagonal part of Σ_m ρ^♮_σ(−e₀m)B_m for a cubic row
   B_m = Σ_c β(c)γ₂(c)χ_c(m) is Σ_{c∈σ} K(c)·β(c)·μ(c)α(c)G(c)conj(χ_c(−e₀)), a Möbius sum.
   * A row with β = μ·conj(αG)·χ_•(−e₀) (all phases aligned) has r = 0.18 (max over classes 0.24), 16–26× the random
     level, and r is constant along R ∝ Q: 0.1819, 0.1825, 0.1813 at (Q, R) = (200, 10³), (800, 3·10³), (3200, 10⁴).
     **Cauchy–Schwarz is attained up to a constant factor by a Möbius-phased cubic row.**
   * Manuscript-type rows (β = α, αG) have the normalised diagonal Möbius sum ρ_M·√N_eff = 0.67–1.07 for N_eff = 38–368
     (random signs: 0.89). This is square-root cancellation of a Möbius sum against α²·(finite order).
   * Twisting the aligned row by a character mod 9 or by α⁶ removes the correlation (r = 0.005–0.022).
4. **[MEASURED] Complete against stripped.** ρ^♮ = ρ^{str}·(1 + κ/N(p)) on rows with one small prime p ∥ m,
   κ = 0.88–1.02 (real), for N(p) = 7 … 97. ‖ρ_cor‖²/‖ρ_str‖² = 0.9%, but the correction is aligned:
   ‖ρ^♮‖²/‖ρ^{str}‖² = 1.109. Mean-square slope of M^♮(Q): 0.866 [0.833, 0.900] (Theorem A: ≤ 5/6 + ε).
5. **Structured exceptions [MEASURED]:** (a) Möbius-aligned rows (item 3); (b) rows whose good part is a sixth power
   (S-unit rows) against untwisted rows ψ = 1 (T = 1.77, r up to 0.32 on 174 rows; Patterson main term, known);
   (c) the exact sign symmetry ρ_σ(−y) = χ_σ(−1)ρ_σ(y); (d) a mild excess for ψ = 1 rows on the strata v₂(m) = 2
   and v_λ(m) = 1 (T up to 3.9; r still ∝ rows^{−1/2}). No other sub-family (prime rows, products, classes of m mod 4,
   mod 9, mod 36, top octave) departs from the null.

## 1. Plan, and what is new against the atlas, the walls and the earlier notes

* **Atlas (PR #27 §10):** the 7/8 boundary and the sixth-phase filter retaining eigenvalue one are recorded there; no
  route is re-run. This note is numerics on the object the synthesis `sextic-theta-synthesis.md` names as the
  obstruction, TRO6^♮.
* **Earlier numerics** (`sextic-theta-computation.md`, `sextic-theta-conjecture.md` §4): stripped coefficient ρ_σ,
  N(m) ≤ 796, rows with A = c only, look-elsewhere test r = 0.043 against 0.060. New here:
  * the **complete** coefficient through proof note (3.9), implemented and brute-force checked;
  * Q = 3199 (11,628 rows);
  * rows with A = cn³ (n squarefree);
  * an exponent fit with error bars and a symmetry-preserving null;
  * the sextic-character spectrum over all 28,224 squarefree conductors N(c) ≤ 10⁵, the phase law, the aligned and
    Möbius rows, and a leave-one-out correction for an estimator self-term (§3.3).
* **Sibling notes:** `../tro6-spectral` (polar law at 21 primes, Q = 796, unit u_c not identified, exponent −0.28) and
  `../tro6-period` (μ(c) weight from γ₁γ₂ = μαG). Items 2–3 agree with both and add: the unit is γ₁(c)conj(χ_c(−e₀));
  all squarefree conductors; Q-scaling; the no-cancellation row; the measured Möbius cancellation.
* **Walls.** Verified height, MV-CAP, flow-blindness: not engaged, nothing here is a zero statement. DH: §5.

## 2. Setup

Notation of `sextic-theta-proof.md` §1. F = Q(√−3), e₀ = (−2)λ⁵ (so −e₀ = 2λ⁵), σ = class mod 4 (12 classes),
ρ^♮_σ(y) = (3/2)Res_{u=2/3}D_σ(y; u) over all moduli prime to S₀ = {2, λ} (S′ = ∅ in this toy).

* **Table** `tmp/sextic/data/sf_1e7.npz`: exact γ₁, γ₂, γ₃ at the 2,822,619 squarefree primary moduli prime to 6 of
  norm ≤ 10⁷ (unchanged, from the 2026-11-03 study).
* **Stripped coefficient** ρ^{str}_σ(y): X^{2/3} constant of Σ_{n∈σ, n sf, (n,6y)=1, N(n)≤X} g̃₁(y, n), WLS on 89
  geometric shells in (10³, 10⁷] (`alib.fit_binned`). Model se 0.0092 per class.
* **Complete coefficient** [formula PROVED in proof note (3.9); implementation EXACT-checked]:
  ρ^♮_σ(y) = Σ_{c₁} g̃(y, c₁)N(c₁)^{−2/3}R(σc₁^{−1}, c₁)ρ^{str}_{σc₁^{−1}}(yc₁⁴), c₁ = Π p^{v_p(y)+1} over subsets of the
  primes of m. Lemma A.1(b), (e) give g̃(y, c₁) with γ₄ = conj γ₂, γ₅ = χ_p(−1)conj γ₁.
  * Check (`rows_nat.py --selftest`): 35 comparisons with direct summation over complete residue systems (v_p = 1, 2,
    3, 4; two primes; moduli up to norm 6·10⁵), max |diff| 3.2·10⁻⁸.
  * Truncation: primes with N(p) ≤ 100 only. Omitted terms have weight ≤ 101^{−5/6}·N(p)^{−1/6} relative to ρ^{str}
    (first order ≈ 1/N(p) < 1%).
* **Rows** B_m = Σ_{c sf}γ₂(c)ψ(c)χ_c(m)N(c)^{−1/2}V(N(c)/R) + (n ≠ 1 part with A = cn³, n squarefree, N(n)^{−1} weight),
  V(x) = exp(−2log²x), ψ ∈ {αG, α, 1}, R ∈ {10⁴, 10⁵, 10⁶}. The n³ part carries 2.5–6.9% of ‖B‖². Manuscript scale:
  N(A) ≈ Z^{7/6} = Q^{1.4}, i.e. R ≈ 8·10⁴ at Q = 3199.
* **Reproduction of the earlier run:** on the first 2904 rows ρ^{str}, se and B agree with
  `tmp/sextic/conj_rows_800.npz` to 9·10⁻¹⁵, 2·10⁻¹⁸, 1·10⁻¹³.
* **Noise:** 19% of Σ|ρ̂|² is estimator noise (signal fraction 0.810; a perfectly aligned row would give r ≈ 0.90).
* **Nulls:** (i) independent phases; (ii) "orbit null": one random phase per orbit of m under units and conjugation,
  common to all classes. (ii) keeps the exact symmetries and is the one quoted.
* **Exponent dictionary [EXACT bookkeeping]:** b = 1/8, M′ = 5/6, so Z^{−ηb/12} = Q^{−η/80}. Full removal (η = 1) is
  δ = 0.0125 in r ∼ Q^{−δ}; the fixed-geometry cap η* = 0.0219 is δ = 0.00027. Numerics at this size cannot resolve
  η inside (0, 1); they can separate δ ≈ 0 from δ ≈ 1/2.

## 3. Results

### 3.1 Correlation with target-free rows [MEASURED] (`analyse_full.log` B, C)

r = |Σ_m ρ^♮_σ(−e₀m)B_m|/(‖ρ‖‖B‖); 216 pairs = 12 classes × 9 rows × 2 pairings; T = rows × mean r².

| Q | rows (generic) | rms r | 1/√rows | T generic (orbit null) | max r (null 99%) | T all rows |
|---|---|---|---|---|---|---|
| 50 | 132 | 0.0791 | 0.0870 | 0.83 (0.94 ± 0.09) | 0.239 (0.279) | 1.14 |
| 100 | 300 | 0.0573 | 0.0577 | 0.99 (0.94 ± 0.09) | 0.126 (0.184) | 1.37 |
| 200 | 648 | 0.0383 | 0.0393 | 0.95 (0.95 ± 0.08) | 0.098 (0.122) | 1.43 |
| 400 | 1356 | 0.0281 | 0.0272 | 1.07 (0.98 ± 0.08) | 0.069 (0.086) | 1.65 |
| 800 | 2778 | 0.0201 | 0.0190 | 1.13 (1.00 ± 0.08) | 0.047 (0.061) | 2.13 |
| 1600 | 5670 | 0.0139 | 0.0133 | 1.10 (1.00 ± 0.07) | 0.035 (0.043) | 1.98 |
| 3200 | 11454 | 0.0095 | 0.0093 | 1.04 (0.99 ± 0.08) | 0.024 (0.028) | 1.81 |

"Generic" = good part of m not a sixth power (drops the 174 S-unit rows). "All rows" exceeds the null (p < 0.005 from
Q = 400) only through the S-unit rows against ψ = 1 (§3.5(b)).

Exponent fit, log r_rms = c − δ log Q over Q = 50·2^k:

| rows | δ | bootstrap sd | 95% | orbit null |
|---|---|---|---|---|
| generic | 0.506 | 0.015 | [0.490, 0.551] | 0.526 ± 0.015 |
| prime to 6 (ξ(m) ≠ 0) | 0.517 | 0.020 | [0.464, 0.541] | 0.508 ± 0.015 |
| prime to 6, generic | 0.512 | 0.021 | [0.467, 0.548] | 0.486 ± 0.019 |
| all | 0.432 | 0.021 | [0.411, 0.490] | 0.493 ± 0.025 |

* Per row type (generic rows): δ = 0.43–0.58 for the nine rows.
* Calibration: planting an aligned component of 5%, 10%, 20% of ‖B‖ in one class lowers δ to 0.41, 0.31, 0.21.
* No pair has a coherent correlation above 0.0238/0.898 = 0.027.
* With the manuscript's weights Ω(N(m)/Q)(N(m)/Q)^{−iv}, v = 0, 2, 10, rows prime to 6: mean r² / null = 0.80–1.17.
* Without the n³ part (`analyse_c.log`): δ = 0.511 (generic). Unchanged.
* Rows prime to 6 at Q = 3199: T = 0.66 against 0.99 ± 0.10, i.e. below the random level. Not explained here.

**Fitted η for target-free rows:** nominal η = min(1, 80δ) = 1 (δ ≥ 0.49 at 95%). This is square-root cancellation
in the row variable. It says nothing about the manuscript rows (§3.4, §4).

### 3.2 Complete against stripped [MEASURED] (`analyse_full.log` A, `complete_vs_stripped.log`)

| Q | Σ\|ρ^♮\|² | noise bias | M^♮ | M^{str} | ‖ρ_cor‖²/‖ρ_str‖² |
|---|---|---|---|---|---|
| 100 | 2.725 | 0.351 | 2.374 | 2.101 | 0.0077 |
| 400 | 9.599 | 1.401 | 8.198 | 7.217 | 0.0088 |
| 1600 | 31.784 | 5.583 | 26.201 | 23.045 | 0.0091 |
| 3200 | 58.831 | 11.169 | 47.662 | 41.869 | 0.0092 |

* Slope of M^♮ over Q ≥ 100: 0.866, row bootstrap 95% [0.833, 0.900]; stripped 0.864. Theorem A (MS) gives ≤ 5/6 + ε;
  5/6 is at the lower edge of the interval.
* Local factor: on the 3030 rows with exactly one correction term, ρ_cor = κ·ρ^{str}/N(p) with κ = 0.88, 0.89, 0.92,
  1.02, 1.00, 0.99, 1.01, 1.01, 0.96, 0.97, 0.99, 0.97 at N(p) = 7, 13, 19, 25, 31, 37, 43, 61, 67, 73, 79, 97.
  So ρ^♮ ≈ ρ^{str}·Π_{p∥m}(1 + 1/N(p)): the transfer between the two coefficients is a positive local factor, not a
  phase change. This is the sextic counterpart of the N/(N+1) factor of the cubic calibration, and it follows from
  the measured exponent (1, 3) relation of the computation note §6.1.
* The correlation tables do not change between ρ^{str} and ρ^♮ beyond noise (cos(ρ^{str}, ρ^♮) = 0.9970).

### 3.3 The diagonal Gauss-sum law [MEASURED; derivation HEURISTIC] (`reso.log` §1, §2)

S_σ(c; Q) = Σ_{N(m)≤Q, generic} ρ^♮_σ(−e₀m)χ_c(m), z² = |S|²/Σ_m|ρ_σ|², at σ = class of c.

* Null value of z² in this cell is 2, not 1: for c ∈ σ, χ_c(−1) = χ_σ(−1), so the terms m and −m coincide [PROVED,
  from ρ_σ(−y) = χ_σ(−1)ρ_σ(y)]. The conjugate pairing shows z² ≈ 2.0 at large c.
* **Estimator self-term.** ρ̂_σ(m) is a linear form Σ_n wt_σ(n)g̃(−e₀m, n) with wt(n) = 0 for N(n) ≤ 10³ and
  wt ≈ N(n)^{−1/3}/411 above. A conductor c > 10³ therefore appears in ρ̂ with its own term, which has the phase of
  the law. All values below are leave-one-out (self-term subtracted). The raw values at Q = 3199 were 25.6, 13.1, 6.6,
  4.2 in the last four bands. Bands with N(c) ≤ 10³ have no self-term.

| N(c) | #c | z² at Q = 100 | 200 | 400 | 800 | 1600 | 3200 | phase alignment (random) | other classes | conj pairing |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | 32.0 | 50.2 | 103.0 | 114.8 | 134.0 | 140.1 | — | 95.3 | 140.1 |
| 2–30 | 7 | 15.2 | 28.9 | 52.9 | 69.3 | 94.9 | 142.6 | 1.0000 (0.378) | 23.0 | 0.49 |
| 31–100 | 21 | 8.3 | 11.6 | 24.0 | 43.3 | 68.0 | 85.2 | 0.9989 (0.218) | 8.3 | 0.61 |
| 101–300 | 55 | 4.7 | 8.5 | 15.6 | 21.8 | 37.0 | 66.7 | 0.9986 (0.135) | 3.7 | 1.21 |
| 301–1000 | 198 | 3.2 | 4.7 | 7.8 | 12.0 | 19.3 | 29.5 | 0.9927 (0.071) | 1.9 | 1.26 |
| 1001–3000 | 566 | 2.2 | 3.0 | 4.3 | 6.6 | 10.8 | 16.8 | 0.9818 (0.042) | 1.3 | 1.87 |
| 3001–10⁴ | 1983 | 2.0 | 2.5 | 3.0 | 3.9 | 5.5 | 9.1 | 0.9516 (0.022) | 0.96 | 1.97 |
| 10⁴–3·10⁴ | 5628 | 1.8 | 2.0 | 2.3 | 2.8 | 3.5 | 4.8 | 0.8845 (0.013) | 0.84 | 2.09 |
| 3·10⁴–10⁵ | 19765 | 1.8 | 2.0 | 2.2 | 2.3 | 2.7 | 3.4 | 0.7423 (0.007) | 0.81 | 2.07 |

Phase alignment = |Σ_c S conj(pred)|/Σ_c|S| with pred = γ₁(c)conj(χ_c(−e₀)), at Q = 3199.

* Fit (z² − 2) = K·Q^a·N(c)^{−b} on 37 band means: a = 0.820 ± 0.052, b = 0.603 ± 0.019, K = 1.42 (rms log residual
  0.29; a rises from 0.56 to 1.05 across bands, b falls from 0.66 to 0.55 with Q, so this is not a pure power law).
* Growth of |S(c; Q)| over Q ≥ 200: slope 0.804 ± 0.021 (15 smallest c ≠ 1); 0.63 for c = 1. A random walk would be
  0.42. The row first moment F_σ(Q) = Σρ_σ has slope 0.757 ± 0.062 over the six classes with χ_σ(−1) = +1.
* Other classes σ ≠ class(c) also respond for small c (23.0, 8.3, 3.7), within the block χ_σ(−1) = χ_c(−1).
* **Span.** The characters m ↦ conj χ_c(m), c ∈ σ, N(c) ≤ C_max capture this fraction of ‖ρ_σ‖² (least squares,
  leave-one-out, generic rows; noise share of ρ̂ is 0.19):

  | C_max | characters per class (of 11,454 rows) | captured | random baseline |
  |---|---|---|---|
  | 100 | 2 | 0.017 | 0.0002 |
  | 1000 | 23 | 0.091 | 0.002 |
  | 3000 | 70 | 0.164 | 0.007 |
  | 10⁴ | 236 | 0.282 | 0.020 |
  | 3·10⁴ | 704 | 0.413 | 0.061 |

* **Heuristic derivation.** ρ^♮ is the residue of the Kubota series at u = 2/3. The approximate functional equation
  of proof note Lemma A.4 [PROVED-rel BH16 there, for s₀ = ε + it] writes the series as a direct sum with weights
  N(c)^{−1/2−s₀} and a dual sum with weights N(c)^{−1/2+s₀}; at the pole s₀ = 1/6 the dual weights are N(c)^{−1/3}.
  Each term depends on the row through conj χ_c(−e₀m)γ₁(c), so Σ_m ρ(m)χ_c(m) has the diagonal term
  (rows)·w(c)·γ₁(c)conj χ_c(−e₀). The residue version of Lemma A.4 is not written out here [HEURISTIC]. The same law
  is derived from the cusp constant term of θ₆ in `../tro6-spectral` §3 (also heuristic). Predicted a = 5/6, b = 2/3.

### 3.4 Aligned rows and Möbius rows [MEASURED; algebra EXACT] (`reso.log` §3–§5)

For B_m = Σ_cβ(c)γ₂(c)χ_c(m)N(c)^{−1/2}V(N(c)/R):

  Σ_mρ^♮_σ(−e₀m)B_m = Σ_cβ(c)γ₂(c)N(c)^{−1/2}V·S_σ(c)
   = Σ_{c∈σ}K(c)·β(c)·μ(c)α(c)G(c)conj χ_c(−e₀)·N(c)^{−1/2}V + (c ∉ σ) + (non-aligned part of S),

using γ₁γ₂ = μαG. G(c)conj χ_c(−e₀) is of finite order in c. All values leave-one-out, generic rows, r = rms over the
12 classes, bilinear pairing; 1/√rows = 0.0093 at Q = 3200.

| row coefficient β | R | r at Q = 200 | 800 | 3200 | δ (bootstrap sd) |
|---|---|---|---|---|---|
| μ·conj(αG)·χ_•(−e₀) (aligned) | 10³ | 0.182 | 0.172 | 0.146 | 0.077 (0.017) |
| aligned | 3·10³ | 0.221 | 0.183 | 0.177 | 0.090 (0.014) |
| aligned | 10⁴ | 0.244 | 0.225 | 0.181 | 0.115 (0.009) |
| α (manuscript type) | 10³ / 3·10³ / 10⁴ | 0.044 / 0.037 / 0.040 | 0.024 / 0.018 / 0.024 | 0.014 / 0.012 / 0.009 | 0.43 / 0.40 / 0.58 (0.06–0.08) |
| αG | 10³ / 3·10³ / 10⁴ | 0.029 / 0.038 / 0.040 | 0.029 / 0.016 / 0.023 | 0.020 / 0.011 / 0.011 | 0.10 / 0.45 / 0.45 (0.07–0.08) |
| conj(αG)·χ_•(−e₀) (diagonal = Σμ) | 10⁴ | 0.028 | 0.020 | 0.015 | 0.26 (0.07) |
| aligned × character mod 9 | 10³ / 3·10³ / 10⁴ | 0.047 / 0.061 / 0.052 | 0.010 / 0.021 / 0.041 | 0.005 / 0.010 / 0.014 | 0.76 / 0.64 / 0.48 |
| aligned × α⁶ | 10³ / 3·10³ / 10⁴ | 0.034 / 0.040 / 0.044 | 0.018 / 0.015 / 0.017 | 0.010 / 0.008 / 0.007 | 0.42 / 0.59 / 0.66 |

* Aligned row along R ∝ Q: r = 0.1819, 0.1825, 0.1813 at (200, 10³), (800, 3·10³), (3200, 10⁴). No decay.
* Diagonal against full form at Q = 3199, R = 10⁴: aligned row 0.112 (diagonal), 0.181 (full), 0.084 (other classes,
  also coherent). Row α: diagonal 0.0055, off-diagonal 0.0082, full 0.0091 ≈ 1/√rows.
* Normalised diagonal Möbius sum ρ_M = |Σ_{c∈σ}S(c)coef(c)|/Σ|S(c)coef(c)|:

  | R | N_eff | aligned ρ_M | α, αG: ρ_M | ρ_M√N_eff | Σμ row: ρ_M√N_eff |
  |---|---|---|---|---|---|
  | 10³ | 41 | 0.987 | 0.125 | 0.80 | 0.98 |
  | 3·10³ | 116 | 0.973 | 0.082 | 0.89 | 0.70 |
  | 10⁴ | 368 | 0.924 | 0.040 | 0.76 | 1.08 |

  Random signs give ρ_M√N_eff ≈ 0.89. The diagonal of the manuscript-type row is a Möbius sum against α²·(finite
  order) with square-root cancellation at these lengths. It does not decay with Q at fixed R (aG, R = 10³: r stays
  0.02–0.03 while 1/√rows falls to 0.009); it decays with the length of the Möbius sum.

### 3.5 Sub-families [MEASURED] (`analyse_full.log` D, E; `strata.log`)

(a) Möbius-aligned rows: §3.4.

(b) S-unit rows (good part of m = 1, 174 rows): T = 1.77 against 1.05 ± 0.20 (p < 0.005), max r = 0.32. In the
all-rows form the largest pair (class 8, row 1|10⁶) has r = 0.035, of which 0.028 comes from the 174 S-unit rows, which
hold 4% of ‖ρ‖² and 58% of ‖B‖². This is the cubic Patterson main term of the untwisted row on the Kummer coset
(conjecture note §4.3), absent for α-twisted rows.

(c) Exact symmetry ρ_σ(−y) = χ_σ(−1)ρ_σ(y): odd angular moments of ρ vanish (Σz² = 0.3–0.9 against a null of 12).

(d) Strata by S-valuation, generic rows, T per row type (null 1, sd ≈ 0.3):

| stratum | rows | 1\|10⁴ | 1\|10⁵ | 1\|10⁶ | α rows (six values) |
|---|---|---|---|---|---|
| v₂(m) = 2, v_λ(m) = 0 | 360 | 3.94 | 1.80 | 2.01 | 0.87–2.29 |
| v₂(m) = 0, v_λ(m) = 1 | 1932 | 1.24 | 2.90 | 1.11 | 0.58–2.03 |
| prime to 6 | 5808 | 0.38 | 0.72 | 0.97 | 0.44–0.93 |

These are the strata where −e₀m has 2-exponent 3 or λ-exponent 6. The excess is in T, not in a non-decaying r
(max r = 0.124, 0.107, 0.074, 0.060 at Q = 400, 800, 1600, 3200 for row 1|10⁵).

(e) No departure from the null: good part prime (6252 rows, T = 1.01), product of two primes (4224, 0.92), squarefree
(10734, 1.01), squares that are not sixth powers (312, 1.00), 54 classes of m mod 9 (mean T 1.03, largest z² 8.8
against an expected maximum 9.4 ± 1.3), 12 classes mod 4 (1.01), top octave (1.10 against 0.99 ± 0.08).

(f) Class-function models ρ_σ(m) = h_σ(class of m)N(m)^{−κ} on generic rows prime to 6, held out: m mod 9 explains
12.6% (label-shuffle null 3.3%), m mod 4 13.3% (null 5.4%), m mod 36 −1.7%. The 75% mod-9 law of the computation note
(base −λ⁴, prime indices) does not carry over to the manuscript coset −e₀O. Neither the class part nor the remainder
correlates with the rows (T = 0.82–1.25).

## 4. What the structure suggests for a proof

1. **The theta–row form is a Möbius sum plus an off-diagonal part.** By §3.3–3.4 the pairing of ρ^♮ with a cubic row
   with coefficients β(c) is, on its diagonal, Σ_cK(c)β(c)μ(c)α(c)G(c)conj χ_c(−e₀)N(c)^{−1/2}. For the manuscript's
   β = αν_σθ (ν_σ contains the target) this is a partial sum of 1/L for the target twisted by α² and a finite-order
   character, at exponent 5/6 + t when K ∝ N(c)^{−1/3}. This is the same statement as `../tro6-spectral` (S) and
   `../tro6-period` Lemma L, reached here from measured data. It is consistent with Theorem D: the correlation is the
   probe's signal.
2. **η = 0 is sharp over the class of rows with bounded multiplicative-type coefficients.** The aligned row has
   r ≈ 0.18 with no decay. So no argument that treats β as an arbitrary bounded sequence, or as an arbitrary sequence
   of the form (Hecke character) × μ, can give η > 0. Any proof of TRO6^♮ must use that β·μ·α·G·conj χ(−e₀) is a
   non-principal Hecke character times μ and must bound that Möbius sum. That is a zero-free statement for the
   corresponding L-function [HEURISTIC identification of the family].
3. **What is not the difficulty.** Rows without resonance cancel to the random level in the row variable (δ = 0.51);
   the complete/stripped distinction is a positive local factor; the Kummer-coset main term is confined to 174 rows
   and to untwisted rows; class laws in m carry ≤ 13%.
4. **A split that could be tested next.** Diagonal (Möbius sum, where the known half-plane Re s > 7/8 already gives a
   power saving if the twisted L-function is in the manuscript's family) against off-diagonal (sextic characters of
   distinct conductors on the rows, where the tool is the sextic large sieve with its (KD)^{2/3} term). Theorem D
   forces the loss to reappear in one of the two; the measurements here do not say which, because at R ≤ 10⁴ the
   off-diagonal part of manuscript-type rows is at the random level (0.0082 against 0.0093). OPEN.

## 5. DH control

* Nothing in §3 is a statement about zeros, so there is nothing that must fail for Davenport–Heilbronn at the level
  of the measurements: the rows of §3.1 contain no target, and the laws of §3.2–3.3 concern θ₆ only.
* The step where the Euler product enters is §4 item 1: γ₁γ₂ = μαG turns the diagonal into Σμ(c)·(target)(c)·…, and
  this is a partial sum of 1/L(s, target·α²·…) only because the target is completely multiplicative, so that
  Σμ(c)ϑ(c)N(c)^{−s} = 1/L(s, ϑ). For f_DH = c₁L(s, χ) + c₂L(s, χ̄) the row is c₁B(χ) + c₂B(χ̄); the form is linear in
  the row, so its diagonal is c₁/L(·, χ) + c₂/L(·, χ̄) (twisted), not 1/f_DH. Cancellation in the DH row would follow
  from the two Euler components separately and would carry no information on the zeros of f_DH. The implication
  "low bound ⟹ zero-free region" (manuscript Prop 2.1) is therefore unavailable for DH, as required.

## 6. Verdict

* **MEASURED:** δ = 0.506 (sd 0.015) for target-free cubic rows, N(m) ≤ 3199, complete coefficient; nominal η = 1 for
  such rows, not transferable.
* **MEASURED:** the diagonal Gauss-sum law S_σ(c) ≈ K·γ₁(c)conj χ_c(−e₀), phase alignment 0.993–1.000 for N(c) ≤ 10³
  and ≥ 0.74 up to 10⁵; exponents a = 0.82 ± 0.05, b = 0.60 ± 0.02.
* **MEASURED:** a Möbius-phased cubic row attains Cauchy–Schwarz up to a factor ≈ 0.18 with no decay; manuscript-type
  rows have a diagonal Möbius sum with square-root cancellation.
* **MEASURED:** ρ^♮ ≈ ρ^{str}·Π_{p∥m}(1 + 1/N(p)).
* **OPEN:** TRO6^♮(η) for every η > 0; the residue form of Lemma A.4 that would turn the law into a theorem; the
  off-diagonal bound.
* No change to θ or to any Λ value.

## 7. Three weakest steps

1. **The law is measured, not proved, and its constants are not derived.** K(N(c), Q) is fitted; the fit is not a pure
   power law (a drifts 0.56 → 1.05 by band, b 0.66 → 0.55 by Q), and b = 0.60 ± 0.02 differs from the heuristic 2/3 by
   more than the statistical error. For N(c) > 10³ the result depends on the leave-one-out correction, which uses
   row-independent estimator weights (rows divisible by a prime of norm 7 have weights about 14% larger).
2. **Toy rows.** S′ = ∅, no target, Gaussian window in place of the manuscript's Mellin weight, n squarefree, R ≤ 10⁶
   (aligned and Möbius rows only R ≤ 10⁴, where N(c) ≤ 10⁵ exponents are stored). The manuscript scale R = Q^{1.4} with
   the k⁶ diagonal (A = ck⁶, N(k) ≈ P_a) is not reached, so §4 item 1 for the manuscript rows is an extrapolation.
3. **Estimator noise and nulls.** 19% of Σ|ρ̂|² is noise that is itself an arithmetic linear form, not white noise
   (§3.3 found one such term). The orbit null ties rows under units and conjugation but not the relations between
   classes; p-values near 0.01 should not be read as detections (this applies to §3.5(d) and to T = 0.66).

## 8. Reproduction

Python: `.venv-arb/bin/python`. Single process. Memory was not profiled (the table and each work array are a few hundred MB).

| step | command | time |
|---|---|---|
| self-test of the complete Gauss sums | `rows_nat.py 3200 0 0 x --selftest` | 10 s |
| rows (resumable, 1000 s budget per run, 250-row blocks) | `fast.py 3200 data 1000`, repeated until `ALLDONE` | 2 runs here (cache 180 s; 0.08–0.3 s per row depending on machine load) |
| concatenate | `combine.py` → `rows_c.npz`, `rows_full.npz`, `Bn.npy`, `E.npy` | 10 s |
| correlations, exponent, sub-families | `analyse.py analyse_full.json rows_full.npz` → `analyse_full.log` | 40 s |
| same without the n³ part | `analyse.py analyse_c.json rows_c.npz` → `analyse_c.log` | 40 s |
| law, span, aligned and Möbius rows | `reso2.py reso.json` → `reso.log` | 15 s |

`strata.log` and `complete_vs_stripped.log` come from inline snippets on `rows_full.npz` (statistics defined in §3.2
and §3.5(d)). The 250-row block files and the 1.2 GB prime-exponent cache were deleted after `combine.py`; `fast.py`
regenerates them. `pass2.py` is the slow reference implementation of the n³ part (agrees with `fast.py` to 9·10⁻¹⁶
on 12 rows); `rows_nat.py` is the slow reference for ρ_cor (agrees to 1.3·10⁻¹⁶ on 6 rows).
