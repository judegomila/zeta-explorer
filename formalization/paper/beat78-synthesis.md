# Improving the zeta zero-free half-plane Re s > 7/8: synthesis of four angles (2026-10-08)

Data module: `src/data/beat-seven-eighths-2026-10-08.js` (11 assertions, plain node, all pass).
Angle writeups: `beat78-amplifier.md`, `beat78-meansquare.md`, `beat78-height.md`, `beat78-project.md` (this directory).
Sources: openai/math family 003. The 7/8 manuscript is `/tmp/qrh-verify/paper.txt` and the 11/12 manuscript is `/tmp/qrh-verify/paper2.txt`. The Lean tree is `/tmp/qrh-verify/lean`. Both manuscripts are Lean-formalised by their authors and have not been refereed.

Each angle had two adversarial internal referee passes. This document lists as rigorous only what survived those passes, with the referees' corrections applied.

## 0. Outcome

**7/8 was not beaten, either globally or above the verified height 3e12.** No rigorous gain was obtained.

- **The height restriction gives nothing.** Given Platt–Trudgian, a half-plane valid above 3e12 is logically the same statement as a global one (Proposition H).
- **Re-tuning the 7/8 paper's own inequalities gives at most σ0 ≈ 0.874957,** a gain of 4.3e-5. This value is heuristic. An exact certificate exists at σ0 = 7/8 − 1/25000, but it covers only the endgame inequalities, so no theorem follows from it.
- **Status of the Λ values.** The conditional values from the 7/8 start are unchanged: 0.118505710922701 (Raymond chain) and 0.116091488672439 (route P). They remain conditional and are not bounds.

PT Λ ≤ 0.2 stands. RH is open. NO QED.

## 1. Rigorous results (referee-surviving)

| id | grade | statement |
|---|---|---|
| R1 | exact algebra | In the 7/8 paper, σ0 = 1 − h/6 + b/12 = 5/6 + M/12 − ℓ/6, with h = 1 − l_x + ℓ (from (10.3), (12.4), (15.6), (15.9)). When M + ℓ = 1 this becomes 11/12 − ℓ/4. The formula is exact at ℓ = 0 (11/12) and at ℓ = 1/6 (7/8). At other values of ℓ it is an extrapolation of the displayed formulas. |
| R2 | proved | **Proposition H.** Assume PT (RH for γ ≤ 3000175332800). Then for 1/2 ≤ θ < 1, "β ≤ θ for all γ ≥ T0 with T0 ≤ PT height" is equivalent to the global statement QRH(θ). |
| R3 | proved (Lemma FB) | The Raymond chain reads only q* = sup (2β−1)² over γ > (X+1)/2 = 3000000092914. That ordinate is the chain head, which sits 175239886 below the PT height. A gain that is valid only above some height T0 greater than the PT height leaves the chain value unchanged. |
| R4 | proved | Prop 3.1 of the 11/12 paper holds for every θ > 0; the restriction θ ≤ 1/10 is never used. The amplified exponent 11/12 + 5θ/12 increases with θ. So 11/12 is the limit for natural-range mean squares (H ≥ D). |
| R5 | proved | Any family-blind bound has constant ≥ JN, because of the rows u = 1 and u = p^6. No cubic, sextic or Baier–Young large sieve improves the 11/12 architecture. |
| R6 | proved, scoped | **Lemma A.** p^6 amplification is optimal among arguments whose only inputs are the mean square and the invariance A_{um^6} = A_u. |
| R7 | proved, corrected | **Lemma C1** (Galois parity). Under the stated ansatz, k ∈ {2,3,6}. If some cubic exponent e_t is nonzero, then k ∈ {3,6}. The original statement "k ∈ {3,6}" was false. |
| R8 | exact, endgame only | At (l_x, b, ℓ) = (106451/300000, 247/2000, 1564/9375) the Section-20 endgame inequalities hold, giving σ0 = 7/8 − 1/25000. Two certifications agree: Bernstein enclosures (31 boxes) and an independent rational-interval check (383 boxes). Lemmas 10.3–10.6, Sec. 16, Lemmas 17.1/18.1 and Prop 20.3 have not been re-verified at this geometry. |
| R9 | exact, corrected | The binding row bin has min(−E*) = 35√16354/12696 − 1491/4232 ≈ 2.281473e-4. It is attained at x = 1/2, δ* = 185/138 − 35√16354/4692 ≈ 0.3866376, corresponding to row zeros at Re s ≈ 0.6933. The previously reported value 7/30672 is the value at δ = 79/204, which is not the minimiser. |
| R10 | proved, structural | **Proposition D.** Within the 7/8 architecture θ_ζ ≥ θ_family: a ζ-only version is no easier. The target enters only through its signal exponent. |
| R11 | Lean source | ζ nonvanishing is derived only through the all-Hecke-character statement. The geometry is hard-coded (17/48, 23/48, 1/8). |
| R12 | Arb 256-bit | At the PT height the explicit regions give abscissa 0.99373823 (MTY) and 0.99876276 (Ford). MTY is below 7/8 only for t < 4.217. |
| R13 | sympy identity | Push-up identity for the drift contributed by an off-line pair. That an unlocated zero breaks the chain is a reading of Lemma FB, not part of the certified identity. |
| R14 | numerical | γ2³ = μα, γ1γ2 = μαG and the quartic J(χ,χ) = −χ(−1)π hold numerically for 7 < p < 700. |

## 2. Obstructions

1. **Height restriction (O1).** This is vacuous given PT (R2, R3).
   - The 7/8 proof has no height parameter. It uses β* over all Hecke characters of Q(√−3) at all heights.
   - A zero-free box (PT, T2) would need T2 of about 4.9×, 16× or 63× the PT height for θ′ = 0.86, 0.85 or 0.84. It would also need an unwritten lateral-wall lemma.
   - On cost, verifying RH up to T2 does at least as well (heuristic).
2. **Low side (O2).** We have σ_low = 1 − h/6 + c_G·b, where c_G = 1/12 comes from the P_a^{1/6} sixth-power exceptional frequencies of the additive Gram bound (Prop 15.2).
   - Because c_G = 1/12, b cancels.
   - The zero-loss range 2M ≥ 1 + 4ℓ of Lemma 15.1 then forces σ_low ≥ 7/8.
   - So 7/8 is the joint limit of Lemma 15.1's range, Prop 15.2's exceptional term and the high-side row counts.
   - A sharper or optimal cubic large sieve does not change Lemma 14.3's worst case, whose extremal configuration has v = 0.
3. **High side (O3).** The binding inequality is the row bin at δ ≈ 0.3866, x = 1/2, which concerns low-lying zeros of sextic Hecke L-functions near Re s ≈ 0.693. Its margin is 2.2815e-4, and dE/dℓ ≈ 1.333. Using the unused Z^{−d} slack in (15.8), ℓ can increase by only about 1.7e-4 beyond 1/6, which gives σ0 ≈ 0.874957.
4. **Amplifier density 1/6 (O4).** This is a structural obstruction, not a theorem.
   - k = 6 is the only usable residue degree within the chain Poisson → Gauss sums → cubic theta → quadratic large sieve.
   - This rests on a recalled fact from Kazhdan–Patterson that was not re-checked: among GL(2) theta functions, only the cubic one has explicit squarefree Gauss-sum coefficients.
   - Metaplectic Eisenstein series, higher-rank covers and multi-variable families are not excluded.
5. **ζ-specific project inputs (O5).** No ζ property can enter the 7/8 argument.
   - **Fixed-support Weil positivity / Toeplitz–Krein.** These have finite height horizons. With the corrected RES-T scaling (T = a), a β = 7/8 zero is visible only below H ≈ 6.8, 7.0 or 8.1 for 2a = ln 5, ln 6 or ln 11. The full support needed at 3e12 is 2a ≈ 9.65.
   - **Density, proportion and mollifier results.** These cannot exclude an individual zero.
   - **Regions near Re s = 1.** These have width that tends to 0.
6. **13/15 ceiling (O6).** This holds relative to Prop 15.2 as stated.
   - With Prop 15.2 unchanged, the floor bin (2/3 + ℓ + b/6, valid for any row counts) and the low side meet at (ℓ, M, b) = (1/5, 4/5, 0). That gives 13/15, even with density-hypothesis counts.
   - Without the exceptional term, the same algebra gives 31/36.
   - A stronger Lemma 15.1 on its own cannot get below 13/15.

## 3. Heuristic exponents (exponent models, nothing proved)

| scenario | σ0 |
|---|---|
| Paper inequalities re-optimised (L1 tight, κ = 3/4) | 0.874957 (q0 ≈ 0.56237) |
| Prop 15.2 term reduced to P_a^{(1−η)/6}, for η = 0.02, 0.05, 0.1, 0.25, 0.5, 1 | 0.87478, 0.87449, 0.87393, 0.87208, 0.86881, 0.86362 |
| Prop 15.2 term replaced by P_a^{th}, for th = 1/6, 1/8, 1/12, 1/24, 0 (Lemma 15.1 as proved, paper row counts) | 0.875, 0.8723, 0.8696, 0.8665, 0.8635 |
| Density-hypothesis counts | 13/15 (31/36 without the exceptional term) |
| Natural-range moments in Lemmas 17.1/18.1 | 0.8731. **Blocked:** the u = z_a column branch of Lemma 17.2 also forces the first invariant. |
| Hypothetical amplifier densities 1/5, 1/4, 1/3 | 0.849, 0.810, 0.743 (these densities are unavailable) |
| Raymond chain at a hypothetical θ = 13/15 | U = 0.11611697513897. This prices an unproved half-plane and is not a bound. |

## 4. What would be needed

**Most promising open lever: the sixth-power exceptional-frequency term of Prop 15.2.** Two referees identified it independently.

- **What the term is.** By Lemma 13.3, the coefficients at k = a^6·e are periodic products of residue symbols with generically nonzero mean. So when P_a > 1 the term is a dual main term of the full row mean square of A_m. It is plausibly sharp as a bound, of Patterson type.
- **Consequence.** The lever is not cancellation in Möbius-twisted cubic Gauss sums. It is a restructuring of the Cauchy–Schwarz/Gram step of Prop 15.3. Options include subtracting the explicit exceptional component of A_m before Cauchy–Schwarz, using Hölder, or restricting the rows to avoid the sixth-power dual frequencies.
- **Value in the model.** Every η > 0 beats the re-tune. η = 0.1 gives 0.87393, about 25 times the re-tune gain. Full removal gives about 0.8635.
- **What a proof would require.** Any such result needs the full Part II bookkeeping redone, with a rational endpoint certificate in the style of Lemma 20.2. That certificate can be machine-checked by following the Lean `Endpoint.lean` pattern.

Other requirements:

- **To get below 13/15.** One of the following is needed: the change above; b < 0 (a new additive Gram range); a change to M + ℓ = 1; a better near-critical row-sum bound; or a different probe.
- **For Λ.** The only other lever is verified height. Starting from 7/8 at 10× the PT height gives a measured Λ ≈ 0.112236. This is HPC-scale and out of scope here.

## 5. Referee corrections applied

- **Amplifier.**
  - C1 scope is k ∈ {2,3,6}.
  - Lemma A is scoped as in R6.
  - Density 1/6 is a structural obstruction, not a theorem.
  - The P_a^{1/6} loss is a dual main term. It is not tied to Möbius-twisted cubic Gauss sums.
- **Mean square.**
  - 7/8 is a joint limit (Lemma 15.1 together with Prop 15.2), not a limit of Lemma 15.1 alone.
  - The 13/15 stop is scoped to Prop 15.2 as stated.
  - The proposed Lemma 17.2 next step is blocked by the column branch.
  - The re-tune optimum is 0.874957, not 0.874966.
- **Height.**
  - The P4 example window must lie above the PT height.
  - 3000000092914 is (X+1)/2, the chain head, not the verified height.
  - The saving ratio of about 0.75 is specific to the plan.
- **Project.**
  - The binding-margin minimum is 2.281473e-4, not 7/30672.
  - RES-T horizons are recomputed with T = a.
  - Prop D shows "no easier", not "slightly harder".
