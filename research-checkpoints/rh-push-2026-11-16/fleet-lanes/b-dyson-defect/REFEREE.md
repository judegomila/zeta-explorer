# REFEREE: b-dyson-defect (adversarial pass, 2026-11-16)

Verdict: **the partial-result verdict holds, with five statements that must be narrowed.** No PROVED step failed. No RH
assumption, no restated verified height, no Λ claim. The measured core (c(L) not constant; explicit-formula split;
conductor-5 prediction; no Λ consequence) was reproduced with independent code on different cases. The heuristic
formula (★) is weaker than the text says: its agreement with the total is 10%, but its two parts are each wrong by
about half of the defect and cancel.

All referee code is outside the repo in `/tmp/ref-dyson/` (refq.py, refq2.py, refprop1.py, refc3.py, refcue.py,
refflow.py, refdh.py, refdh_an.py, refdh_diag2.py). Python: `.venv-arb`. Single process, local.

## 1. Steps re-derived by hand (all confirmed)

| step | label in RESULT | referee |
|---|---|---|
| Q = ⟨g D⟩ = ⟨φ F⟩ (summation by parts) | PROVED | confirmed |
| g D = 2 − g² S, S ≥ 0 for real zeros, so Q ≤ 2 | PROVED | confirmed |
| CUE loop identity Q = −1 (E[∂_k φ_k] = 2 = −2E[φ_k F_k]) | CLASSICAL | confirmed; MC below |
| dV/dτ = 4Q, with dx/dτ = 2F and τ = tL²/(16π²), z = 2γ | convention | confirmed |
| λ(k) = 2Σ_{m≠0}(1 − cos mk)/m² = k(2π − k) | CLASSICAL | confirmed (Σ cos mk/m² = π²/6 − πk/2 + k²/4) |
| damping factor exp(−(t/4) log n (L − log n)) = exp(−τλ(k_n)) | CLASSICAL | confirmed |
| c_n = (2π/L²) Λ(n)²/n from ρ_n = −Λ(n)/(√n L), K_P = Im(a_n/ρ_n) | definition | confirmed |
| ∫_0^{2π} K k/2π dk = (2π/L²)∫_0^L y K(2πy/L) dy | algebra | confirmed |
| c₃ = 2a₂ − Σ_p 2p log³p/(p−1)³ | CLASSICAL | confirmed: a₂ = −0.05168863, c₃ = −6.024041, A = 280.62 |
| 1/L² coefficient of (★) is 0 | HEURISTIC | confirmed **for the formula (★)**, see 3.4 |

Extra fact found while checking 1/L²: Σ_{n≤X} Λ(n)²/n = ½log²X − Λ_B + o(1) (partial sums −1.5429 at 10⁵, −1.5724 at
10⁷; Λ_B = 1.573151). So E(y) → −Λ_B ≠ 0, and the 1/L² term of (★) is 2πΛ_B·K(0), which vanishes only because
K(0) = 0. The cancellation does not depend on where the n-sum is cut. This is the clean way to state §3.5(a).

## 2. Numerical reruns on different cases

1. **Estimator and Route 23 bins** (refq.py, refq2.py; Odlyzko zeros6, 2.0·10⁶ zeros, own code, both the φF form
   and the gD form). gD form J = 50/100/200/400 minus J = 800: −1.9·10⁻⁵, −1.1·10⁻⁶, −7.9·10⁻⁷, −2.8·10⁻⁹. The
   estimator is converged at J = 200. Bins: Q+1 = 0.149(12), 0.117(9), 0.101(5), 0.083(3), 0.068(3), 0.065(3),
   0.060(3), 0.059(3) at L = 7.1 … 12.0, against the reused Route 23 values 0.1515 … 0.0586. Reproduced.
   Block-mean errors shrink with block size (0.0023, 0.0019, 0.0018 at 200, 2000, 20000), so the quoted errors are
   not understated for ζ.
2. **Fit statistics** (recomputed from out/qstat.jsonl). Constant c on the 6 new points: χ² = 17.64, c = 0.4280.
   Confirmed. Linear fit: slope −0.00561 ± 0.00136 per unit L (4.1σ), χ² = 0.52. "Not constant" stands at about 4σ.
3. **Proposition 1** (refprop1.py; T ≈ 10⁶, 8·10⁵ zeros, J = 1500, X = L/3 and 0.6L, own code): slope 0.99979 and
   0.99899, correlation 0.99985, residual 1.7% of rms W; P_X from zeros and from primes −0.34446 / −0.34596 and
   −1.04154 / −1.04222. Confirmed as a numerical identity to about 10⁻³, not "exact" (see 3.1).
4. **Landau peaks and response** (same run, L = 11.9): Lρ_n√n/Λ(n) = 1 to 2·10⁻⁴. Primes 11 ≤ p ≤ 43 (k < 2):
   K_P/K − 1 ∈ [0.0000, +0.0032], weighted mean +0.0017 ± 0.0005. Small primes +0.077, +0.045, +0.021, +0.011
   (p = 2, 3, 5, 7); prime powers +0.11 … +0.19. Consistent with §3.3 on its stated range.
5. **Kernel** (refcue.py; CUE_60, 6·10⁴ matrices, direct double sum, not the authors' ρ-trick): Q = −0.9982(13),
   V = 0.17976(14); Ψ₀ agrees with psi_48.json to within 1.3% at nine k (my errors 0.4–0.6%); −K/k = 1.188(8) at
   k = 0.105 against 1 + V = 1.180.
6. **Mode dictionary** (refflow.py; T = 2·10⁵, 3001 zeros, own damped-RS and RK4 Dyson ODE, central 600): rms
   position difference 1.1·10⁻⁵ at τ = 0.005 and 3.3·10⁻⁵ at τ = 0.02, against displacements 0.013 and 0.045;
   V 0.1466/0.1466 and 0.1124/0.1123. Confirmed as an effective approximation with relative error about 10⁻³ of
   the displacement at this height. (The authors' 3·10⁻⁶ is at T = 10⁶ with a larger block.)
7. **Conductor-5 prediction at a second height** (refdh.py: Euler–Maclaurin Dirichlet sums in numpy, not flint;
   T ∈ [3·10⁴, 4.4·10⁴], L = 10.29; Z real to 1.6·10⁻⁹). Real zeros 22,900 for χ and for χ̄ against 22,900.3 from
   the count formula. Q+1 = 0.121 ± 0.012 and 0.112 ± 0.011. (★) with p = 5 removed gives 0.120; with p = 5 kept
   0.080 (excluded at 4.5σ). Confirmed independently.
8. **DH** (same run). DH = Z_χ + Z_χ̄ verified against the standard definition: |f(0.808517 + 85.699348i)| =
   6.5·10⁻⁷ and |f|/|Z_χ + Z_χ̄| = 0.5197838 = 1/(2cos θ₀), tan θ₀ = ξ, at two points on the line. Off-line
   fraction 10.0% (DH) and 27.5% (difference), against 9.7% and 27.8%. V = 0.2317 and 0.3056. Q+1 for the
   difference: −0.170 ± 0.018 (authors −0.165 ± 0.019). Q+1 for DH: see 3.3.

## 3. Errors and overstatements

### 3.1 "exact" / "numerically exact per zero" (Proposition 1 and the split Q = P_X + R_X)
The split is labelled "PROVED given Prop. 1, exact". It is not exact as written: P_X drops the term ⟨φ_k E_k⟩, and
F_k in unfolded units equals (2π/L)Σ1/(γ_k − γ_j) only after linearising θ. The measured agreement between P_X
from zeros and from primes is 4·10⁻⁴ (authors) and 7·10⁻⁴ to 1.5·10⁻³ (referee, T ≈ 10⁶). Residuals per zero are
0.5–1.7% of rms W. Correct label: CLASSICAL identity up to a smooth term whose φ-average is measured below 2·10⁻³;
regularisation not written out. For DH the sentence "Proposition 1 holds, no step fails" is asserted and never
computed; −f'/f for DH has a Dirichlet series that converges only to the right of its zeros with Re s > 1.

### 3.2 "prime-wave response equals the GUE kernel within 0.5% for p ≥ 11" (headline and verdict item 2)
True only for k_p < 2, as §3.3 says and the headline does not. From the authors' own files (out/zeros_*_kp.json),
primes p ≥ 11:

| k range | L = 14.4 | L = 16.6 | L = 21.2 |
|---|---|---|---|
| [0, 2) | −0.4% … +0.3% | −0.5% … +0.4% | −0.5% … +0.6% |
| [2, 2.5) mean | +0.65% | +0.57% | +0.42% |
| [2.5, 3) mean | +1.5% | +1.3% | +0.9% |
| [3, 3.2) mean | +2.1% | +1.8% | +1.2% |
| [3.2, 3.6) mean | +2.8% | +2.3% | no data |
| [3.6, 4) mean | +3.1% | +2.6% | no data |
| (4, 2π) | no data | no data | no data |

The excess grows with k and K_P is not measured above k ≈ 3.9, more than a third of the range of (★). The
accuracy that matters is defect/|P| ≈ 0.03/1.3 ≈ 2%, so these deviations are the same size as the signal:
Σ c_n (K_P − K) = −0.0141, −0.0125, −0.0041 over the measured rows at L = 14.4, 16.6, 21.2 (the last only to k = π),
i.e. about 40% of the defect at L = 16.6.

### 3.3 Formula (★): total agrees to 10%, the parts do not
`model_aux.py` (authors' script; its output is not in RESULT.md) at L = 16.62:

| κ | model Σ_{k_n<κ} c_n K − ∫_0^κ | measured P_X − P⁰ | measured R_X − R⁰ | model "modes above κ" |
|---|---|---|---|---|
| π/2 | 0.0191 | 0.0175 | 0.0127 | 0.0141 |
| π | 0.0317 | 0.0255 | 0.0046 | 0.0015 |
| 3π/2 | 0.0332 | 0.0158 | 0.0143 | 0.0000 |

At κ = 3π/2 the model's prime part is 2.1 times the measured prime part, and the model's remainder is 0 against a
measured 0.0143 ± 0.0005. The sentence "(★) is Proposition 1 with K_P replaced by K(k_n) and R_X − R⁰ replaced by
the modes above κ" is false at the level of the parts: each replacement is wrong by about 0.015 (half of the
defect), with opposite signs. The 7–12% agreement of the total is a cancellation that (★) does not explain.

Fit statistics that were computed by `final_table.py` and not reported:
- (★) as stated (no normalisation): χ² = 118.5 on the 6 new points, 134.0 on all 14. As a no-parameter formula it
  is rejected; the normalisation 0.904 ± 0.009 is 10σ from 1.
- All 14 points: constant c gives χ² = 24.9; (★) × one normalisation gives χ² = 23.3. Over the full range the
  formula shape is not better than a constant c. The quoted χ² = 2.3 holds on L ≥ 14.4 only.
- meas/formula drifts from 1.14, 1.00, 1.05, 1.03 (L = 7–10) to 0.90–0.94 (L ≥ 10.7). "Correct L-shape" holds for
  L ≥ 14; below that the ratio moves by about 15–20%.
- Conductor 5: my rerun of the authors' `predict.py` with p = 5 removed at L = 9.642 gives 0.1352, not 0.137.
  With the ζ-calibrated normalisation 0.904 the prediction is 0.122, 2.2σ below the authors' measured mean
  0.134 ± 0.005. This is the same low-L drift of the ratio.

### 3.4 "1/L² coefficient is 0; Q + 1 ~ 280.6/L³"
Established: the formula (★) has zero 1/L² coefficient and tends to A/L³ with A = 280.6 (my evaluation of
`predict.py` gives L³(Q+1) = 278.9 at L = 3000; the 0.6% gap is the spline). Not established for Q itself:
- the deviation K_P/K − 1 at k ∈ [2, 4] is 1–3% and falls with L more slowly than the claimed order (at
  k ∈ [3, 3.2): 0.021, 0.018, 0.012 at L = 14.4, 16.6, 21.2, between 1/L and 1/L²); multiplied by Σ c_n K = O(1)
  it is a term of order L⁻¹ to L⁻² in P_X, larger than L⁻³. Whether R_X cancels it is exactly the underived part;
- the measured ratio to (★) is flat at 0.90 on L = 14–26 and does not move toward 1 as 1 − a/L would require;
- (★) reaches 280 only for L > 100. At L = 25.8 it gives L³(Q+1) = 206 and the data give 191 ± 9.
The value A = 280.6 therefore has no support better than ±10%, and "c → 0" is a property of (★) plus the
ratios-conjecture argument (b), as §3.5(c) admits. The headline should read: "(★) has no 1/L² term; for Q this is
OPEN".

### 3.5 DH control: error bar and wording
- Q on the real zeros of DH is heavy-tailed. In my sample (20,600 real zeros) one real pair with gap 0.00247
  contributes q = −580 and −482 and moves the mean by −0.053. Result: Q+1 = −0.017 with block errors 0.054–0.055
  at every block size from 250 to 2000 (bootstrap 68% interval [−0.074, +0.037]). A parabola test on the fine
  grid reported a second pair that the exact interpolant shows is not real (minimum +1.4·10⁻⁵ rms): hidden-pair
  detection by parabola is not reliable for DH, where 1,019 local minima of |Z| without sign change occur.
- The authors' ±0.015 comes from 14 block means of 2000 and their parabola-based pair detection. The value 0.034
  is compatible with mine, the error is not: a realistic uncertainty is about 0.05. "0.03 ± 0.015" should be
  "0.0 ± 0.05".
- "the same range as for genuine L-functions (0.13)" is wrong as a statistical statement for the second
  combination: −0.165 ± 0.019 (authors) and −0.170 ± 0.018 (referee) are 15σ from 0.13 and of opposite sign. The
  statistic does separate these functions from L(s, χ); it does so in no direction usable for reality of zeros.
  The conclusion of §4 rests on MV-CAP (a window mean cannot control the worst pair), which is correct on its own.

### 3.6 Missing mandatory controls (BRIEF addendum)
Only DH was run. The sign twist Λ(n) → ε_nΛ(n) and the backward heat family were not. For the sign twist the
answer is immediate and should be stated: (★) depends on Λ(n)² only, so it is invariant under every twist with
|ε_n| = 1; this supports "no Λ consequence". Backward runs (τ < 0) were not done; §4 item 4 ("smooth for small
τ < 0") is therefore a statement about the formula, not a measurement.

### 3.7 Minor
- "V(L = 21.19) = 0.17434 equals the CUE_6 value 0.17451(2)": the two differ by 4σ.
- "no missed pair": counts are within ±3 of θ-counting (−2.8 at 10¹¹, −1.9 at 10¹²); this bounds missed pairs at
  about one per 2·10⁷ zeros, it does not certify zero. The effect on Q is below 10⁻⁶.
- Finite-τ table: the reference is CUE_64, while the τ = 0 zeros correspond to N_eff ≈ 3.8; "defect" there is
  defined relative to the sine process. The frozen-kernel formula is 11–66% high, as stated.
- All numbers are float statistics; none is a certificate and none is presented as one. Interval rigor is not
  applicable.

## 4. Walls
- RH: not assumed. Zeros are located as sign changes of Z with counts checked against θ; heights below 1.01·10¹².
  (★) and §3.5(b) use heuristics of ratios-conjecture type and are labelled HEURISTIC.
- Verified height: not restated as new.
- DH: run; identification verified; see 3.5 for the corrected error.
- MV-CAP: correctly invoked as the reason for no Λ consequence.
- Flow-blindness: no hypothesis of that type is used.

## 5. Surviving claim
MEASURED: c(L) = (Q+1)L²/(12Λ_B) is not constant; on 1.04·10⁸ zeros at T = 10⁷ … 10¹² it falls with slope
−0.0056 ± 0.0014 per unit L (4σ; constant-c χ² = 17.6 on 6 points). CLASSICAL, numerically confirmed to about 10⁻³:
Q = prime sum over n < e^X + remainder. MEASURED: the prime-wave response equals the sine-process kernel within
0.5% for primes p ≥ 11 **with k_p < 2 only**; the excess is 1–3% for k ∈ [2, 4] and unmeasured above. HEURISTIC:
(★) reproduces the total defect to 7–12% for L ≥ 14 (ratio 0.904 ± 0.009; rejected as an exact no-parameter law,
χ² = 118 on 6 points; ratio 1.0–1.14 at L ≤ 10) through a cancellation of two errors each about half the defect;
it predicts the conductor-5 character at two heights (0.135 vs 0.134 ± 0.005; 0.120 vs 0.116 ± 0.008) and excludes
the p = 5 Euler factor at 8σ and 4.5σ. HEURISTIC: (★) has zero 1/L² coefficient and tends to 280.6/L³; for Q this
is OPEN. Mode dictionary for the forward heat flow: confirmed to 10⁻³ relative. No Λ upper constraint (MV-CAP);
DH: about 10% of zeros off the line with Q+1 = 0.0 ± 0.05 on the real zeros.
