# Attempt B: can the 7/8 zero-free half-plane be improved where the barrier start uses it?

**Internal working note, 2026-10-08. Not submitted, not refereed.** Companion to `lambda-qrh-note-draft.md` (conditional
Λ ≤ 0.116091488672439 / 0.118505710922701 on the 7/8 start). PT Λ ≤ 0.2 is the accepted bound; RH is open; every Λ value
below is conditional. Grades used: PROVED (elementary argument written here), MEASURED (computation in this note),
HEURISTIC (model or interpolation, not a proof), CONDITIONAL (depends on the openai/math manuscripts being correct).

Sources read: `preprints/The-Quasi-Riemann-Hypothesis-September-30-2026/paper.pdf` ("7/8 paper", text copy
`/tmp/qrh-verify/paper.txt`) and `preprints/The-Quasi-Riemann-Hypothesis-October-5-2026/paper2.pdf` ("11/12 paper",
`/tmp/qrh-verify/paper2.txt`), github.com/openai/math.

## 0. Result

No rigorous improvement of θ = 7/8 was obtained, uniform or height-dependent, and q0 stays at 9/16 + ε.

1. **Combining the two proofs.** The 7/8 proof already contains the 11/12 paper's method. The 11/12 paper's mean
   square (its Prop. 3.1) is eq. (17.87) of the 7/8 paper, and its sixth-power amplification is Lemma 17.6 there. That
   amplification is the slope α = 5/6 in the row count L(t) of Prop. 19.2. Two further combinations give nothing.
   Feeding β* ≤ 7/8 back into Part II (a "Part III") does not move the binding constraint, which sits at an interior bin.
   Adding prime marks to the 11/12 amplifier (Lemma 17.1) leaves the target bound at 11/12 (§3.2).
2. **Re-tuning the 7/8 paper's own parameters.** I modelled the paper's exponent bookkeeping (§3.3). The model reproduces
   the paper's stated margins exactly in four places. Its optimum over the geometry (l_x, b, ℓ) is
   θ ≈ 0.8749635, a gain of 3.65·10⁻⁵ (HEURISTIC). This gain would require re-proving an argument of about 200 pages at
   non-rational parameters. On the conditional Λ it is worth about 1·10⁻⁵.
3. **The probe architecture has a floor.** The 7/8 argument satisfies σ0 = 5/6 + (l_x − ℓ)/6 + b/12 (PROVED, algebra from
   Def. 10.1 and Prop. 15.3). The paper's geometry puts σ0 at 5/6 + 1/24. I modelled stronger hypothetical inputs, each of
   which is an open problem: density-hypothesis row counts for the sextic family, a Gram bound without the sixth-power
   exceptional frequencies, and first-moment cancellation at the floor bin. Even all three together give only
   θ ≈ 0.860 (HEURISTIC). Values such as 5/6 or 3/4 need a different method.
4. **Classical inputs the project has.** These are the MTY / Korobov–Vinogradov zero-free regions, zero-density
   estimates, the verified height 3·10¹², Weil positivity / Toeplitz certificates, and mollifier and proportion results.
   None of them can lower the sup of (2β−1)² over zeros above 3·10¹². The barrier start needs that sup over all heights
   up to ∞:
   - classical regions tend to Re s = 1 as the height grows;
   - density and proportion results count zeros but do not exclude them;
   - bounded-support positivity does not see individual zeros at height ≳ 3·10¹² (heuristic);
   - PT covers only γ ≤ 3·10¹².

   Inside the 7/8 argument, the rows are Hecke L-functions L(s, ηχ_u) of conductor ≍ U → ∞. ζ-specific inputs do not
   apply to them.

## 1. What the barrier start reads

Lemma 2 of `lambda-qrh-note-draft.md` requires q0 > sup (Im z)² over zeros of H_0 with Re z > X. Here z = 2γ − i(2β − 1)
and X/2 sits just below the PT height 3.0001753·10¹². So the start needs

  Q(X) := sup{(2β − 1)² : ζ(β + iγ) = 0, γ > X/2}.

**PROVED (elementary).** A height-dependent region "β ≤ θ(γ) for γ > X/2" lowers q0 only if sup_{γ>X/2} θ(γ) < 7/8. Given
PT (all zeros with γ ≤ 3·10¹² have β = 1/2), that is the same as a global zero-free half-plane Re s > θ' for ζ with
θ' < 7/8. So "θ(T) < 7/8 for all T > 3·10¹²" is not a weaker target than the global statement for ζ.

Sensitivity at the 7/8 point: dq0/dθ = 4(2θ − 1) = 3. On Raymond's chain, a quadratic through the three measured values
(θ = 1, 11/12, 7/8 → 0.149395, 0.129826, 0.118506) has slope dΛ/dq0 ≈ 0.0924 at q0 = 9/16 (HEURISTIC interpolation). So a
gain Δθ moves the conditional Λ by about 0.28·Δθ.

## 2. The two proofs side by side

| | 11/12 paper (Oct 5) | 7/8 paper (Sep 30), Part I → 11/12, Part II → 7/8 |
|---|---|---|
| object bounded | twisted Möbius sums A_u(D) = Σ µ(n)ν(n)χ_n(u)W(N n/D), sextic symbol χ_n(u) = (u/n)_6 | a completed cubic-theta "probe" I_η(X, Y, Z) with two exact representations |
| core estimate | mean square Σ_{N u ≤ D^{1+ϑ}} \|A_u(D)\|² ≪ D^{2+ϑ+ε} (Prop. 3.1), via Poisson in u, Gauss–Jacobi (µγ₋₁ → cubic γ₂), Patterson's cubic theta reflection (sextic → quadratic twists χ³), Goldmakher–Louvel quadratic large sieve, cube inversion and a two-Poisson transfer recursion (Props. 4.5, 5.1, 5.2, 5.4) | low side: reflected energy (same cubic-theta reflection + quadratic large sieve) × planar additive large sieve / additive Gram bound; high side: Poisson in the averaging variable → rows u·a⁶, scalar Euler identity with 1/L(s, ηχ_u) (Lemma 7.1), zero detector (Prop. 8.3), row counts from the sextic large sieve (Part I) or from the marked inverse moment (Lemma 17.1), sixth-power amplification (Lemma 17.6) and fourth moments (Lemma 18.1) (Part II) |
| how a zero is excluded | A_1(D) ≪ D^{θ+ε} ⇒ 1/L^S(s, ν) holomorphic on Re s > θ (Mellin, §3) | continuation principle (Prop. 2.1) for the family-wide sup β* over all primitive Hecke characters over Q(√−3) |
| where the exponent comes from | sixth powers: rows u = p⁶ with N(p⁶) ≤ H have A_{p⁶} = A_1 + O(D/Y), so \|A_1\|² ≪ D^{1+ε}H/Y + D²/Y², Y = H^{1/6}, H = D^{1+ϑ}: θ = 1 − 1/12 (eq. 3.2) | σ0 = low exponent − (C(s) − s) with C(s) = s − 5/6 + l_x/3 + ℓ/6 (Def. 10.1) and low exponent l_x/2 + b/12 (Prop. 15.3) |
| family needed | fixed target ν; average over sextic twists | whole Hecke family, because the rows carry twists ηχ_u of growing conductor |

**Exponent identity (PROVED, algebra).** Put b = l_y − l_x ≥ 0. Then

  σ0 = 5/6 + (l_x − ℓ)/6 + b/12.

Part I (l_x = l_y = 1/2, ℓ = 0) gives 11/12. Part II, with geometry (12.4) l_x = 17/48, b = 1/8, ℓ = 1/6, gives 7/8. The
two "11/12"s therefore have different origins: 1 − 1/12 from sixth-power amplification, and 5/6 + 1/12 from the balanced
probe. The 5/6 baseline comes from the cubic-theta residue at z = 1/6: the signal carries X^{1/2−1/6}Z^{s−5/6} and the
low bound carries X^{1/2}. Going below 5/6 would need ℓ > l_x + b/2, which forces the Poisson row range
h = 1 − l_x + ℓ above 1.

**Containment (PROVED by reading).** §17.7 of the 7/8 paper contains the 11/12 paper's method. Eq. (17.87) is the 11/12
mean square for H ≥ D^{1+c}. Lemma 17.6 is the same p⁶ / a⁶ amplification: Σ_u \|M_u(D)\|² ≪ H/P with P = (H/U)^{1/6},
i.e. e(r) = max(1, (1 + 5r)/6). Its slope α = 5/6 is the slope of L(t) in Prop. 19.2. The 11/12 paper says it isolates a
step toward the 7/8 result. Its distinctive feature is that it avoids the sextic large sieve entirely.

## 3. Combination attempts

### 3.1 Bootstrapping 7/8 into a "Part III"

Part II uses β* ≤ 11/12 only to bound the bin range by δ ≤ κ ≤ 5/6 (κ = 2β* − 1). With β* ≤ 7/8 the range would be
δ ≤ 3/4. Lemma 18.1 is stated for κ ∈ [3/4, 1], and κ = 3/4 is admissible under β* ≤ 7/8. Two facts make the bootstrap
useless:

- The binding inequality is not at the top of the range. The endpoint certificate (Lemma 20.2, eq. 20.9) is minimized at
  y = 0 (prime amplitude x = q/δ = 1/2) and δ ≈ 0.3866. The exact minimum is −E* = 2.2815·10⁻⁴; the paper states the
  weaker uniform bound 49/440640. The δ = α endpoint has slack 1/48 + δ/16.
- The dynamic plain capacity z_P = (1 − 2m)/(6κ) barely moves the count. At the binding bin dR*/dβ* ≈ 0.0077, so the
  central exponent moves by h·dR*/dβ* ≈ 0.006 per unit of β*. Lowering the target by Δ needs about 1·Δ.

MEASURED (model, §3.3): the optimum with β* ≤ 7/8 as input equals the optimum with β* ≤ 11/12 (0.8749635 in both).

### 3.2 Prime marks inside the 11/12 amplifier

Take Lemma 17.1 with rows N u ≪ Z^m, inverse length r, and slot length z. At sixth-power rows u = a⁶, choosing slot
coefficients conj(ν(p)) gives \|Q_{a⁶}\|² ≈ Z^{z}. Then

  \|A_1\|² ≪ D·Z^{5m/6 − z}, subject to r + 2z ≤ m − c₁ and 2r + 8z ≤ 3m − c₂.

The exponent of \|A_1\|² is 3r/2 + m/3 on the branch m ≤ 2r and 5r/4 + 11m/24 beyond it. Both are minimized at m → r with
z → 0, giving θ = 11/12 (PROVED, elementary, given Lemma 17.1's stated hypotheses). The marks cannot be used where they
would help, because the capacity z ≤ (m − r)/2 vanishes as the rows shrink to the column length.

There is also a heuristic duality sketch. In the L² amplification framework, the only input is
Σ_{N u ≤ H} \|A_u\|² ≤ D^{1+ε} max(H, D). Any amplifier c with Σ_u c_u χ_n(u) ≡ 1 satisfies
‖c‖² ≥ D²/Σ_u\|S(u)\|², where S(u) = Σ_n χ_n(u). The sixth-power rows alone give Σ\|S\|² ≳ H^{1/6}D². So
‖c‖²·D·max(H, D) ≳ D^{11/6}, with the minimum at H = D. Sixth powers are extremal, and 11/12 is the limit of Method A
(HEURISTIC: approximate amplifiers are not treated rigorously).

### 3.3 Re-tuning the Part II geometry (model of the paper's inequalities)

The model is in `tmp/qrh-attemptB/geom_model.py`. It is built from:

- the low side σ0_low = 5/6 + (l_x − ℓ)/6 + b/12, with the side conditions of Prop. 15.3 / Lemma 15.1:
  l_y − ℓ − 11b/6 ≥ 0, M ≥ (1 + 3ℓ)/2, M + ℓ ≤ 1, l_x > ℓ;
- the high side (Lemma 10.4, eq. 10.15): each bin (a, δ = 2a − 1, x) must satisfy a + G < β* with
  G = h(z0 − 1/6) − a·l_y − ℓ/2 + xδℓ + d(R + δ/2 − z0), z0 = 17/50;
- the row exponents:
  - R*: balanced t in Prop. 19.2, with c = 1/(3κ), α = 5/6, D_x = 3 − x − 2cx, P_x = (1 − x)(2 − 2cx), at d = h;
  - R = 76/75 − 2δ/3 for d ≤ 1/2;
  - R = 1 at the floor bin a = 51/100;
- the small-row condition h(z0 − 1/6) − l_y/2 < 0 and the prime supply ℓ/h > (2 − c)/(2(5 − 2c)).

Check against the paper at (17/48, 1/8, 1/6), where the model reproduces the stated values:

| quantity | paper | model |
|---|---|---|
| floor bin | −7/1200 | −0.0058333 |
| d ≤ 1/2 range at δ = 5/6 | −49/14400 | −0.0034028 |
| small rows | −79/800 | −0.09875 |
| endpoint certificate | ≥ 49/440640 (uniform bound) | minimum 2.2815·10⁻⁴ at δ = 0.3866, x = 1/2 (equals the exact minimum of eq. 20.9) |

At the paper's geometry, σ0_low = 0.875 and σ0_high = 0.874770: the two sides are balanced to within 2.3·10⁻⁴.

**Optimum (HEURISTIC, MEASURED on the model).** Nelder–Mead over (l_x, b, ℓ) gives

  σ0 = 0.87496352 at (l_x, b, ℓ) ≈ (0.349292, 0.134603, 0.166813), with M + ℓ = 1 tight.

A fine β-scan over (σ0, 11/12] confirms max H(β) = −6.4·10⁻⁸ < 0, and all side conditions hold. The gain is
3.65·10⁻⁵. Making it a theorem would need the following:

- Lemmas 10.3–10.5, which are stated for σ0 ∈ [7/8, 1).
- The principal region (7.15), which is stated for Re s ≥ 7/8. The principal correction H_η(s) at (w, z) = (1, 1/6)
  converges for Re s > 2/3, since H_p − 1 = O(Q^{3−6x} + Q^{−1−x}). So this region is not a wall.
- Lemma 20.2 and the Section 20 numerics, which are for the exact rational geometry.
- Every inequality the model does not encode. The model is a reading of the bookkeeping, not a re-proof.

### 3.4 Lever map (which input would move θ, if it were available)

Each row replaces one input of the model by a stronger hypothetical input and re-optimizes the geometry, with β* ≤ 7/8
known. All rows are HEURISTIC, and every replaced input is an open problem.

| lever | θ | q0 bound (2θ−1)² | ΔΛ (interp.) |
|---|---|---|---|
| paper | 0.875 | 0.5625 | 0 |
| re-tune only (§3.3) | 0.8749635 | 0.5623906 | −1.0·10⁻⁵ |
| floor bin removed (first-moment cancellation over rows) | 0.8749635 | same | 0 extra |
| amplification slope α = 1/2 instead of 5/6 | 0.87277 | 0.55583 | −6.2·10⁻⁴ |
| α = 0 (perfect amplification), d ≤ 1/2 range unchanged | 0.87222 | 0.55420 | −7.7·10⁻⁴ |
| density-hypothesis row counts R = 1 − δ at every d | 0.86982 | 0.54706 | −1.4·10⁻³ |
| same + floor removed | 0.86668 | 0.53782 | −2.3·10⁻³ |
| additive Gram bound without the P_a^{1/6} sixth-power frequencies | 0.86403 | 0.53008 | −3.1·10⁻³ |
| DH counts + Gram + floor removed | 0.85991 | 0.51815 | −4.2·10⁻³ |

ΔΛ is the quadratic interpolation of Raymond's chain at PT height (§1). It is reliable only near q0 = 9/16. The model
never goes below ≈ 0.86. The reason is that the three high-side constraints (central bin, d ≤ 1/2 range, floor bin) and
the low side are mutually balanced: relaxing one moves the optimum until the next one binds.

For scale, a hypothetical θ = 5/6 gives q0 = 4/9, and de Bruijn alone then gives 2/9 ≈ 0.2222. A hypothetical
θ = 3/4 gives q0 = 1/4, and de Bruijn alone gives 1/8. Both are outside what this architecture can reach.

## 4. The project's classical inputs, one by one

| input | what it gives above γ = 3·10¹² | why it cannot lower Q(X) |
|---|---|---|
| Mossinghoff–Trudgian–Yang zero-free region β < 1 − 1/(5.558691 log γ) | at γ = 3.0001753·10¹²: β < 0.993738, so (2β − 1)² ≥ 0.975110 (the project's own value q_MTY_upper ≥ 0.975109743635927) | width → 0 as γ → ∞, so sup over γ > X/2 is 1. 1 − 1/(5.5587 log γ) < 7/8 only for γ < e^{8/5.5587} ≈ 4.2, below the first zero. Korobov–Vinogradov / Ford is weaker at this height. QRH dominates every classical region at every height where zeros exist. |
| zero-density estimates (Ingham, Huxley, Guth–Maynard; explicit Kadiri–Lumley–Ng) | upper bounds for N(σ, T) | they bound counts and cannot exclude one zero. Explicit bounds of the shape C(σ)T^{c(1−σ)}(log T)^{O(1)} are ≫ 1 at σ ≈ 0.87, T ~ 10¹³, so they do not even give an empty window (rough order-of-magnitude check, not a cited computation). The 7/8 argument's high side would need density bounds for the sextic family L(s, ηχ_u) in conductor aspect, a different family. |
| verified height (PT, 3.0001753·10¹²) | nothing above X/2 | it is what defines X. Extending verification (RH, or only a zero-free rectangle Re s > θ' on [3·10¹², T1]) is the existing verified-height lever. A window helps only through a multi-band chain whose far band still starts at 9/16; see the multi-band lemma in `src/data/qrh-path-push-2026-10-08.js`. |
| Weil positivity / Toeplitz certificates (Route I, support 2a ≤ 0.96) | positivity of the Weil functional on test functions of bounded support | positivity on a fixed bounded support is a statement about the prime side of the explicit formula. It is a theorem for log-support ≤ log 2 (Connes–Consani) and project-certified up to 2a ≤ 0.96, and no zero-free region is known to follow from it. Heuristically, tests of exponential type ≈ 1/2 cannot isolate one off-line quadruple among zeros of density (log γ)/2π ≈ 4.6 per unit height at γ ≥ 3·10¹² (HEURISTIC). |
| mollifier / proportion results (critical-line proportion, mollified moments) | lower bounds for the share of zeros on the line | the barrier start reads the supremum of β, which proportion results do not bound. |
| inside the 7/8 argument | rows are L(s, ηχ_u), N u ≍ U = Z^d → ∞; bins come from zeros at heights ≤ 3iT₁ = O(Z^τ) | ζ-specific data (PT, Route I, MTY) do not apply to these L-functions. β* is a family-wide, all-height supremum, so the argument does not localize to "zeros of ζ above 3·10¹²". |

## 5. Effect on q0 and on the conditional Λ values

- **Rigorous:** none. q0 = 9/16 + 10⁻⁷ (route P) and 9/16 + 2·10⁻⁶ (Raymond chain) are unchanged, and so are the
  conditional values 0.116091488672439 and 0.118505710922701.
- **Heuristic re-tune** (§3.3): q0 bound 0.5625 → 0.5623906 (−1.09·10⁻⁴), Λ about −1·10⁻⁵ by the interpolated chain
  slope. Not worth the cost: it would require re-proving the full 7/8 argument at irrational parameters, for a change
  below the route-P re-tuning noise floor.
- **Hypothetical levers** (§3.4): at most about −4·10⁻³ on Λ, and only if several open problems on sextic large sieves and
  family zero-density were solved.

## 6. Reproduction

```bash
cd /Users/USER/Documents/GitHub/mathexplorer
.venv-arb/bin/python tmp/qrh-attemptB/geom_model.py     # reproduces the paper's margins at (17/48, 1/8, 1/6)
.venv-arb/bin/python tmp/qrh-attemptB/geom_opt2.py      # re-tune (Part II and Part III settings) + levers W1-W4 (~2 min)
.venv-arb/bin/python tmp/qrh-attemptB/geom_opt3.py      # amplification-slope levers (~1 min)
.venv-arb/bin/python tmp/qrh-attemptB/verify_w0.py      # fine beta-scan of the re-tuned point
.venv-arb/bin/python tmp/qrh-attemptB/lever_table.py    # q0 and interpolated Lambda for each lever
```

Outputs: `tmp/qrh-attemptB/geom_opt2.log`, `geom_opt2.json`, `geom_opt3.log`, `geom_opt3.json`.

## 7. What would change the picture

- An external referee report on the 7/8 manuscript. Everything here is CONDITIONAL on it.
- A sextic large-sieve or Gram-type estimate without the sixth-power exceptional terms: the P_a^{1/6} term in Prop. 15.2,
  the A ≤ 5M/6 threshold in Lemma 18.1, and the (KD)^{2/3} term in Lemma 9.1. In the model this is the most effective
  single lever (≈ 0.864). It is an open problem of the same kind as the paper's own core estimates.
- A different architecture whose structural floor is below 5/6. The probe used here cannot go below 5/6 without row
  ranges beyond Z¹.
- On the Λ side, verified height (the known HPC lever), not θ.
