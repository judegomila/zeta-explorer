# QRH 7/8: where the constant comes from, a re-tuned boundary 34999/40000, and the limit of the method

**Internal working note, analysis A. Written 2026-10-08. Not refereed, not submitted, nothing committed.**
Subject: OpenAI, *The Quasi-Riemann Hypothesis: A Zero-Free Half-Plane Re s > 7/8* (30 Sep 2026; github.com/openai/math,
family 003; local text `/tmp/qrh-verify/paper.txt`, Lean library `/tmp/qrh-verify/lean`). Section, lemma and equation
numbers refer to that manuscript. Its Lean proof of `riemannZeta_ne_zero_of_seven_eighths_lt_re` re-builds locally with
the standard axioms only (`formalization/external/openai-math-qrh-verification.md`); the manuscript itself is unrefereed.
As requested, the 7/8 result is assumed correct throughout.

Scripts: `verify_qrh_improvement_a.py` (exact rational arithmetic, standard library only, exit 0 = all checks pass) and
`qrh_improvement_a_sensitivity.py` (floating point, numpy; exploration only), both in this directory.

## Status of each claim

| claim | status |
|---|---|
| 7/8 = L − c with L = l_x/2 + b/12 (Prop. 15.3) and C(s) = s + l_x/2 − 1 + h/6 (Eq. 15.9); equivalently 7/8 = 5/6 + (M − 2ℓ)/12 at (M, ℓ) = (5/6, 1/6) | exact identity, read off the manuscript; checked in exact arithmetic (script §A, §F) |
| general exponent model reproduces every number printed in §20 (C0 = −1/48, −7/1200, −79/800, −1/48 − δ/16, −529/2400 + 25δ/96, identity (20.9)) | exact (script §A) |
| binding inequality of the paper is Lemma 20.2 at (δ, x) = (79/204, 1/2); true margin 2.28·10⁻⁴, certified margin 49/440640 = 1.11·10⁻⁴ | exact evaluation (script §A) |
| zero-free half-plane Re s > 34999/40000 = 7/8 − 1/40000 by the same proof with re-tuned geometry | **conditional**: on the manuscript's lemmas (as for 7/8) plus the patch list P1–P9 of §3; the closing arithmetic of §15.3 and §20 at the new geometry is **certified** in exact arithmetic (script §B–§E); not Lean-checked |
| best boundary reachable by re-tuning the free geometry ≈ 0.874957 (gain ≤ 4.3·10⁻⁵) | **measured** (floating-point optimisation, grid-based) |
| gains from stronger moment inputs (α, plain or inverse capacity) ≤ 1.1·10⁻³ even combined | **measured** (same optimiser, hypothetical inputs) |
| without the P_a^{1/6} loss of the additive Gram bound (Prop. 15.2) the same closing system gives ≈ 0.8641 with the paper's own row counts | **measured** (hypothetical input; whether that loss can be removed is open) |
| with density-hypothesis row counts in every adaptive bin and the paper's low estimate, the method stops at 167/192 ≈ 0.86979 (floor 51/100) and 13/15 ≈ 0.86667 (floor → 1/2) | exact **within the closing-exponent model** (script §F); a statement about this method, not about L-functions |
| below 13/15 one needs cancellation across Poisson rows in the floor bin, a marked reflected-energy bound beyond Lemma 15.1, a smaller additive Gram loss, or a different probe | **heuristic** (structural reading of the model) |

## 1. One-paragraph answer

The boundary is fixed by the **low estimate**, not by a positivity identity: σ₀ = (low exponent) − (Mellin shift) =
5/6 + (M − 2ℓ)/12, where M = l_x + l_y is the exponent of the Poisson row ball Q = XY and ℓ is the total length of the
prime-compensation slots. The reflected energy of the fully marked completed row (Lemma 15.1) needs M + ℓ ≤ 1, and on that
line σ₀ = 11/12 − ℓ/4; the paper takes ℓ = 1/6, giving 7/8 (Part I is ℓ = 0, M = 1, giving 11/12). Larger ℓ lowers σ₀ but
adds Poisson rows (row length h = 1 + ℓ − l_x grows), and the high side stops closing at the critical row bin
δ = 2a − 1 = 79/204 with maximal prime amplitude (x = 1/2), where the row count of Prop. 19.2 exceeds the
density-hypothesis count 1 − δ by about 0.055. The paper's choice sits 2.28·10⁻⁴ inside that high-side inequality.
Re-tuning ℓ to 1/6 + 1/10000 (b = 1/8, M = 1 − ℓ) closes every inequality and gives 34999/40000; the re-tuning optimum is
≈ 0.874957. Stronger versions of the three moment inputs move the optimum by at most ~10⁻³. Even density-hypothesis
counts in every bin only reach 167/192 (13/15 with the floor bin moved to 1/2), because rows with no zero witness are
counted trivially (absolute values over all ≍ Z^h Poisson rows) and that trivial sum grows with ℓ. The input with the
largest effect is the low side's additive Gram bound (Prop. 15.2): its loss P_a^{1/6} = (Y/X)^{1/6}, produced by the
sixth-power frequencies, makes the asymmetry b useless for the boundary; without that loss the same closing system gives
≈ 0.8641 with the paper's own row counts. The loss looks like a genuine main term, so removing it is a new-estimate
question, not a tuning question.

## 2. Where 7/8 comes from

### 2.1 The criterion

Proposition 2.1 needs, for a normalised probe J_η and the signal f_η(Z) = (2πi)⁻¹∫ Z^{C(s)} e^{(s−5/6)²} H_η(s)/L^S_F(s, η) ds,
C(s) = s + c,

* low: |J_η(Z)| ≪ Z^{C(σ₀)+ω}, ω < Δ := β* − σ₀;
* high: |J_η − f_η| ≪ Z^{C(β*)−σ}.

If β* > σ₀ these contradict the definition of β*. So σ₀ is determined by the low exponent L := C(σ₀) and the shift c:
σ₀ = L − c. The high side is a separate requirement: every non-principal row contribution must lie below Z^{C(β*)}.

### 2.2 The two exponents (Part II, geometry (12.4))

Free parameters: l_x, l_y (X = Z^{l_x}, Y = Z^{l_y}), ℓ (slot length); write b = l_y − l_x, M = l_x + l_y, h = 1 + ℓ − l_x.

* **Low exponent** (Prop. 15.3, Eq. 15.6): L = l_x/2 + b/12. The factor X^{1/2} comes from Cauchy–Schwarz between the
  additive Gram norm and the completed-row norm; the factor P_a^{1/12} = (Y/X)^{1/12} comes from Prop. 15.2, whose loss
  P_a^{1/6} is produced by the exceptional frequencies k = a⁶e (sixth powers, no cancellation in the row variable).
* **Mellin shift** (Lemma 10.5; Eq. 15.9; checked in Eq. 16.7): the double residue at w = 1 (pole of ζ^S_F(w)) and z = 1/6
  (pole of ζ^S_F(6z), from the Poisson frequencies H = u a⁶) leaves X^{1/2−1/6} Z^{s−5/6} Z^{ℓ/6}, so
  c = l_x/3 − 5/6 + ℓ/6 = l_x/2 − 1 + h/6.

Hence

  **σ₀ = L − c = 1 − h/6 + b/12 = 5/6 + (M − 2ℓ)/12.**                                                         (2.1)

Paper: (l_x, l_y, ℓ) = (17/48, 23/48, 1/6), M = 5/6, b = 1/8, h = 13/16, C(s) = s − 11/16, L = 3/16, σ₀ = 7/8.
Part I: l_x = l_y = 1/2, ℓ = 0: σ₀ = 5/6 + 1/12 = 11/12. The common 1/12 = ½·⅙ is the sixth-power structure (the same
1/12 as in the 5 Oct writeup: |A₁(D)|² ≪ D·H/H^{1/6} at H = D).

### 2.3 What fixes M and ℓ

**(a) Dual length, M + ℓ ≤ 1.** In Lemma 15.1 (via Lemma 14.3, Eq. 14.11) the reflected dual length of a completed row
with d = Σ_{i∈J} ℓ_i rescaled and ℓ' = ℓ − d marked satisfies T_d ≤ H − 3d + (M + ℓ − 1) (the paper writes this with
M + ℓ = 1, "M' + ℓ' − 1 = −3d"). The marked primes enter the reflection modulus (the 2z_a in T_d). If M + ℓ > 1, the fully
marked term d = 0 has dual length up to M + ℓ − 1 beyond the row range; maximising Eq. (14.14) in that regime gives energy
exponent M' + (M + ℓ − 1) (Lemma 14.3 as stated cannot exclude this), which costs Z^{(M+ℓ−1)/2} in Prop. 15.3. So
M = 1 − ℓ is the largest admissible M. Since at fixed ℓ the high side improves with M (rate ≈ 0.7 per unit) while σ₀
worsens only at rate 1/12, the optimum sits on M + ℓ = 1, where (2.1) becomes

  **σ₀ = 11/12 − ℓ/4.**                                                                                         (2.2)

**(b) Second branch of Lemma 15.1.** Its proof gives the energy exponent M' + ((1 + 3ℓ' − 2M')/4)₊, i.e.
((5ℓ − 1 + d)/4)₊ on M + ℓ = 1. The stated form (d − 1/6)/4 is the case ℓ = 1/6, where the excess vanishes for every
d ≤ ℓ. For ℓ > 1/6 a small excess appears near d = ℓ; the rescaled subsets carry a factor Z^{−d} in Prop. 15.3 (Eq. 15.8),
which absorbs it as long as 1 + 3ℓ − 2M ≤ 0, i.e. ℓ ≤ 1/5 on M + ℓ = 1. So the low side alone would allow ℓ up to 1/5
(σ₀ = 13/15).

**(c) The high side.** For a retained row bin at real part a = (1 + δ)/2, row norm U = Z^d, row count U^R and mean prime
amplitude q = xδ (Eq. 19.1), Lemma 20.1 gives the exponent relative to C(σ₀)

  E(d) = a − σ₀ + h(z₀ − 1/6) − a l_y − ℓ/2 + qℓ + d(R + δ/2 − z₀),   z₀ = 17/50,                               (2.3)

increasing in d, so d = h binds; z₀ cancels there. In the adaptive range the count is the balanced value of Prop. 19.2,
Eq. (20.8):

  R* = 1 − δ + (α − δ) δ P_x / (2J),  J = (α − δ) D_x + δ P_x,  D_x = 3 − 17x/9,  P_x = (1 − x)(2 − 8x/9),  α = 5/6.

At the paper's geometry E(h) = −1/48 + 2δ/3 + q/6 − (13/16)(1 − R*), and Lemma 20.2 proves −E* ≥ 49/440640. The exact
minimum is at x = 1/2, δ = 79/204 (the square (4vδ − 79)² in Eq. 20.9 vanishes), where −E* = 147/(10368·51·J) ≈ 2.282·10⁻⁴;
the certified 49/440640 uses the crude J ≤ 5/2. At that point R* ≈ 0.668 versus 1 − δ ≈ 0.613. Along M + ℓ = 1 the
quantity max E(h) increases at ≈ 1.3 per unit ℓ, so the high side closes only up to ℓ ≈ 0.16684. b is nearly irrelevant
there: ∂E/∂b = R/2 − 1/3 ≈ 0 at R* ≈ 0.668, which is why b = 1/8 is close to optimal.

**Summary of the mechanism.** 7/8 is the low-side value (2.2) at ℓ = 1/6; ℓ = 1/6 is the value at which the stated form
of Lemma 15.1 has no excess, and it is within 1.7·10⁻⁴ of the largest ℓ for which the high-side certificate still closes.
Positivity enters only through Lemma 20.2, an explicit sum-of-squares identity with a small margin; it is not the source
of the number 7/8.

### 2.4 All closing margins at the paper's geometry

| inequality | margin | binding? |
|---|---|---|
| Lemma 20.2 (adaptive bins, d = h) | 2.28·10⁻⁴ (certified 1.11·10⁻⁴) | yes |
| dual length M + ℓ ≤ 1 (Lemma 15.1) | 0 | yes (equality by design) |
| Eq. (20.11), d ≤ 1/2 without primes, at δ = 5/6 | 49/14400 ≈ 3.4·10⁻³ | no |
| floor bin, Eq. (20.5) | 7/1200 ≈ 5.8·10⁻³ | no |
| supply ℓ/h − 7/37 (Prop. 19.2) | 23/1443 ≈ 1.6·10⁻² | no |
| δ = α endpoint, Eq. (20.7) | 7/96 | no |
| small rows, Eq. (20.6) | 63/800 | no |

## 3. A re-tuned boundary: 34999/40000

**Claim (conditional).** Assume the lemmas of Sections 2–19 of the manuscript, with the modifications P1–P9 below. Then
every finite-order Hecke L-function over Q(√−3), and every Dirichlet L-function, has no zero in
Re s > 34999/40000 = 7/8 − 1/40000 = 0.874975 (pole at s = 1 for principal characters allowed).

This is the manuscript's proof with a different value of the free parameter ℓ. The improvement is 2.5·10⁻⁵ and has no
practical consequence; its purpose is to show that 7/8 is not a limit of the method but a rounded choice.

**P1. Geometry.** ℓ = 1/6 + 1/10000 = 5003/30000, M = 1 − ℓ = 24997/30000, b = 1/8. Then
l_x = 21247/60000, l_y = 28747/60000, h = 16253/20000, C(s) = s + l_x/2 − 1 + h/6, σ₀ = 34999/40000 = 11/12 − ℓ/4, and
C(σ₀) = 7499/40000 = l_x/2 + b/12. (Script §B.)

**P2. Lemma 15.1'.** Same proof; M + ℓ = 1 is kept exactly, so the step T_d − (H − 3d) ≤ 2ε_Z + |θ_N| is unchanged. Only
the final specialisation changes: the second-branch bound reads M' + (1 + 3ℓ' − 2M' − 2Δ_H + θ_N)/4, which equals
M' + (5ℓ − 1 + d − 2Δ_H + θ_N)/4. Conclusion: Σ|B^J_{m,σ}(Z)|² ≪ Z^{M' + ((5ℓ−1+d)/4)₊ + ε}. The excess is positive only for
d > 1 − 5ℓ = 997/6000 and is at most (6ℓ − 1)/4 = 3/20000. At d = ℓ one has ℓ' = z_a = 0 and the first branch applies, as
in the paper. (Script §E.)

**P3. Prop. 15.3'.** Per rescaled subset the exponent becomes f(d) = −d + ((5ℓ − 1 + d)/4)₊/2, which is ≤ 0 on [0, ℓ]
(piecewise linear; values 0, −997/6000, −20003/120000 at the breakpoints d = 0, 1 − 5ℓ, ℓ). Length conditions: l_x − ℓ = 0.18735 > 0,
l_y − ℓ − 11b/6 = 0.083183 > 0 (paper 1/12), M − 2ℓ = 0.4997 > 0 (replaces "M' ≥ 1/2", only Q ≥ 1 is used), P_a = Z^b ≥ 1.
Hence |I_{η,modified}(Z)| ≪ Z^{l_x/2 + b/12 + ε} = Z^{C(σ₀)+ε}.

**P4. Euler region and shared lemmas.** Lemma 7.1's second region (7.15) and D₂ are used with Re s ≥ 34999/40000
instead of 7/8: at x_r = 34999/40000 the good-prime exponent is −72599/40000 (< −9/5, so c_H = 4/5 stands), the ramified exponent
−32999/40000 and the R-exponent −44797/20000. Equation (10.2) is imposed on Re s > 34999/40000 by the choice of P₀. Lemmas
10.3–10.6 are applied with σ₀ = 34999/40000; their uses of σ₀ ≥ 7/8 are exactly D₂ and D₁(3/8), and D₁(3/8) is replaced by
D₁(37/100) (Re(s + w) = β* + e + 1/2 > 1 + 37/100).

**P5. Lemma 18.1.** Its range is 3/4 ≤ κ ≤ 1 with hypothesis β* ≤ (1 + κ)/2. Use κ_eff = max(2β* − 1, 3/4). For
β* ≤ 7/8 the capacity is the baseline 2/9; for β* > 7/8 it is the paper's dynamic value, and Eq. (19.6) bounds the extra
count exponent by (β* − 7/8)₊/4 ≤ Δ/4.

**P6. Section 16.** In Eq. (16.13) and Lemma 16.2 the exponent −7/8 becomes −34999/40000 (the four principal error
exponents are ≤ −x_r with x_r ≥ σ₀); the principal approximation margin is κ_P = 7ℓ/(16K) < σ₀ ℓ/K since 7/16 < σ₀.

**P7. Section 20 inequalities at the new geometry** (exact values, script §C):

| inequality | value |
|---|---|
| floor bin (20.5') | E = −5.705·10⁻³ |
| δ = α endpoint (20.7') | E = −7.279·10⁻² |
| d ≤ 1/2 without primes (20.11'), worst endpoint | E = −3.314·10⁻³ |
| small rows (20.6'): h(17/50 − 1/6) − l_y/2 + (63/50)d_min | −0.0987 + 0.0126 < 0 |
| supply ℓ/h | 0.205213 > 1/5 > 7/37 |
| frequency extension: 5ℓ − h | 1271/60000 > 0 |
| capacity allowance 1 − h/4 | 63747/80000 > 0 |
| Δ ≤ 11/12 − σ₀ = 5003/120000; κ ≤ 5/6 | from the 11/12 theorem, unchanged |

**P8. Lemma 20.2' (certificate).** With C₀ = −497/24000, B = 20003/30000, h = 16253/20000 and m₀ = 1/20000, put
P(δ, x) = 2J(−E* − m₀) = A₂(x)δ² + A₁(x)δ + A₀(x) (polynomials in x of degree 3, 2, 1). Exact checks: J ≥ 35/54 on the box
(P_x − 7/9 = (2x − 1)(4x − 11)/9 ≥ 0, D_x ≥ 37/18); A₀ > 0 and A₂ > 0 on [0, 1/2]; the discriminant 4A₂A₀ − A₁² (degree 4) has
no root in [0, 1/2] (Sturm) and is positive there. Hence P > 0 for every real δ, and

  −E*(δ, x) ≥ 1/20000 on [0, 5/6] × [0, 1/2]   (true minimum ≈ 9.49·10⁻⁵ at δ ≈ 0.387, x = 1/2).

Then, as in Eq. (20.10), E_actual(h) − Δ ≤ −1/20000 − (1 − h/4)Δ + ε_total.

**P9. Order of choices (Prop. 20.3).** ζ < min{1271/60000, m_high/16}; K even with 2ℓ/K < min{η_mesh, b_round, 1/185}
(the supply gap 1/5 − 7/37 = 2/185 is unchanged); everything else as written.

**What this does not establish.** The manuscript's lemmas are used at a geometry for which they were not written; I
re-checked every explicit numerical appearance of the geometry found by searching Sections 10–20 for 7/8, 13/16, 17/48,
23/48, 11/16, 3/16, 1/6, 3/8 and the §20 margins, but a hidden use inside a 40-page induction (Sections 17–18) is not
excluded. Lemmas 17.1, 17.6, 18.1 and Prop. 19.2 are stated with generic bounded length parameters, which supports the
claim. The Lean library hard-codes the geometry and the §20 budgets (e.g. `ParametersHighData.lean`: `slots_sum = 1/6`,
`central_budget ≤ 49/440640`, `floor_budget ≤ 7/1200`, `window_budget` with 7/8; `Endpoint.lean`: the identity (20.9);
`Parameters.lean`: the length conditions with 17/48, 23/48). A machine-checked θ' would require editing those budget files
(17 files contain 440640, 7 contain 7/8) and rebuilding the 2926-file `DirichletL` tree; not attempted. Effect on the
conditional Λ note: the strip threshold (2θ − 1)² drops from 0.5625 to 0.562425; not recomputed.

**Re-tuning optimum.** A floating-point search over (ℓ, b) on M + ℓ = 1 (and off it) with all §15.3/§20 constraints gives
≈ 0.874957 at ℓ ≈ 0.16684, b ≈ 0.124. This is the limit of the manuscript's argument with its own lemmas.

## 4. What would have to improve

Optimum of the same closing system when one input is replaced by a stronger hypothetical estimate (floating point,
`qrh_improvement_a_sensitivity.py`; geometry re-optimised each time):

| hypothetical input | where it enters | best boundary |
|---|---|---|
| none (re-tuned geometry) | — | 0.874957 |
| amplified inverse moment slope α = 4/5 (paper 5/6) | Lemma 17.6, Eq. (19.3) | 0.874795 |
| α = 2/3 | same | 0.874168 |
| plain capacity 1/(6κ) = 1/4 (paper 2/9 at κ = 3/4) | Lemma 18.1, Eq. (19.2) | 0.874900 |
| plain capacity 1/3 | same | 0.874708 |
| inverse capacity (1 − r)·¾ or (1 − r) (paper (1 − r)/2, from r + 2z < 1) | Lemma 17.1 | 0.874213 (capped by supply ℓ/h) |
| α = 2/3, plain 1/3, inverse (1 − r), together | — | 0.873934 |
| dual-length condition relaxed to M + ℓ ≤ 1.01 | Lemma 15.1 / 14.3 | 0.874332 |
| M + ℓ ≤ 1.05 | same | 0.871831 |
| density-hypothesis counts R = 1 − δ in every adaptive bin, floor 51/100 | Prop. 19.2 replaced | 0.869792 (= 167/192) |
| same, floor 0.501 | also Lemma 8.1 floor | 0.866986 (→ 13/15) |
| additive Gram loss P_a^{1/12} (paper P_a^{1/6}); low exponent l_x/2 + c'b/2 with c' = 1/12 | Prop. 15.2 | 0.869626 |
| no additive Gram loss (c' = 0) | Prop. 15.2 | 0.864078 |
| c' = 0 and density-hypothesis counts | — | 0.863577 |

Readings:

* Every single moment upgrade is worth at most ~10⁻³. The reason is structural: the selected primes in the row-count
  moments are the compensation primes, so the usable prime length is at most ℓ/h ≈ 0.21 in base U; with x = 1/2 the
  prime gain in a count is at most ≈ 0.21δ, while the deficit of the inverse witness at the critical bin is ≈ (1 − r)δ with
  r ≈ 0.72. Raising ℓ raises the supply but also h and the trivial floor sum.
* The additive Gram exponent c' is the largest lever: with c' < 1/6 the low boundary becomes
  σ₀ = 5/6 + (M − 2ℓ)/12 − (1/12 − c'/2)b, so the asymmetry b lowers it, while b is nearly neutral at the critical bin.
  At c' = 0 the binding constraints become the floor bin and the prime supply ℓ/h > 7/37; the row counts are then no
  longer the bottleneck (density-hypothesis counts add only 5·10⁻⁴). The loss comes from the frequencies k = a⁶e, where
  the row character is principal and the proof bounds the term trivially; within a fixed ray class σ the fixed ray
  characters are constant, so this looks like a main term. Whether a modified probe (other additive coefficients, or a
  centred difference as in Lemma 18.1) can cancel it while keeping the principal residue c_S ≠ 0 was not examined.
* The key coupling is ℓ: it lowers the low boundary (2.2) and supplies the primes, but it also lengthens the Poisson dual
  (h = 1 + ℓ − l_x) and so increases every row sum. Auxiliary test functions (W₀, W₁, the Gaussian), cusp-coefficient
  sizes (they enter Lemma 14.3 only through tails), z₀ = 17/50 (cancels at d = h) and, while c' = 1/6, b (stationary at the
  critical bin) are not levers.
* A different Hecke field or character order is not a parameter change: the sextic family over Q(√−3) is forced by the
  identity μ(n)γ₋₁(n) = χ_n(−1)G(n)⁻¹α(n)γ₂(n), which turns Möbius-weighted sextic Gauss sums into cubic theta
  coefficients (Kubota–Patterson); the 1/6 in (2.1) is that sixth power.

## 5. The limit of the method

Assume density-hypothesis counts R = 1 − δ in every adaptive bin (stronger than any known large-values estimate for these
families) and keep the paper's low estimate (c' = 1/6). The rows of the floor bin (no zero detected to the right of
1/2 + δ₀/2) have no witness and are counted trivially, R = 1. With b = 0 and M = 1 − ℓ, the floor contribution (2.3) at d = h is

  G_floor = σ₀ + E_floor = 2/3 + ℓ + δ₀(1 + 3ℓ)/2,

while the low side gives σ₀ = 11/12 − ℓ/4 and the adaptive bins are flat in δ (∂E/∂δ = −b/2 = 0) at a lower value. The two
meet at ℓ* = (1 − 2δ₀)/(5 + 6δ₀):

* δ₀ = 1/50 (the paper's floor 51/100): ℓ* = 3/16, boundary **167/192 ≈ 0.869792**;
* δ₀ → 0: ℓ* = 1/5, boundary **13/15 ≈ 0.866667**; here M + ℓ = 1 and 1 + 3ℓ = 2M (the second-branch condition of
  Lemma 15.1) are tight simultaneously.

(Exact within the model, script §F; the optimiser reproduces both numbers.) The constraint set is: the floor-bin trivial
sum, the low estimate (2.1), and the two conditions of Lemma 15.1. With c' = 0 instead, the same idealised computation
gives ≈ 0.8636 (floor 51/100). To go below 13/15 one has to change at least one of:

1. **the floor bin**: a bound for the sum over Poisson rows u of L(w, χ•(u)) H_{η,u,Z} / L(s, ηχ•(u)) that uses
   cancellation in u (a mean-value or large-sieve statement over the dual rows), instead of absolute values row by row;
2. **the marked reflected energy**: an estimate for the fully marked completed row whose dual is longer than its row
   range (M + ℓ > 1) and without the second-branch excess (1 + 3ℓ' − 2M')/4 (the paper's second-branch bound is itself
   not sharp: maximising Eq. (14.14) over the dual parameters, with the frozen-prime parameters A₀, N₀, B₀, S₀, O, e_λ set
   to zero, gives (1 + 2ℓ' − 2M')/3 in that sub-case, smaller whenever 2M' + ℓ' > 1; not pursued);
3. **the low estimate**: Prop. 15.2's loss P_a^{1/6} comes from the sixth-power frequencies k = a⁶e, where the row
   character is principal; the proof bounds that contribution trivially and it looks like a genuine main term of the Gram
   matrix. With a loss P_a^{c'}, c' < 1/6, the asymmetry b becomes a lever (σ₀ = 5/6 + (M − 2ℓ)/12 − (1/12 − c'/2)b);
4. **the probe**: a different completed sum or compensation scheme.

None of these is a parameter optimisation or an elementary sharpening; each is a new estimate.

## 6. Reproduction

```
.venv-arb/bin/python formalization/paper/verify_qrh_improvement_a.py        # exact; 60 checks; exit 0
.venv-arb/bin/python formalization/paper/qrh_improvement_a_sensitivity.py   # floating point; ~10 min; table of §4
```

The exact script reproduces the paper's §20 numbers first (§A), so a transcription error in the model would show up there.
