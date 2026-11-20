# REFEREE: b-toeplitz-beyond

Date 2026-11-16. Adversarial referee pass on `RESULT.md`. Claimed verdict: precise-obstruction.
Referee scripts (not kept in the repo): `/tmp/ref-toeplitz/c1.py … c5.py`, run with `.venv-arb/bin/python`.

## Outcome

**The PROVED steps hold. The verdict (obstruction, no news-bearing rung constructible by this ladder)
stands as a cost estimate, not as a theorem.** No step assumes RH; nothing restates verified height
as new; no number is claimed certified, and none is (all numerics are float and labelled MEASURED).
Five corrections below; none reverses the verdict.

## PROVED steps, re-derived

| step | status | check |
|---|---|---|
| Lemma A, θ = 0: kernel 2cosh(δ(x−y)) = u⊗v + v⊗u, eigenvalues ⟨u,v⟩ ± ‖u‖‖v‖ = 2a ± sinh(2aδ)/δ | confirmed | re-derived; Nyström (n = 1500) at (a,δ) = (2.2, 0.3), (0.7, 0.45), (4.4, 0.375): agreement 1e-12, rank exactly 2 |
| Lemma A, θ < δ: e^{κ\|x−y\|} = −2κ·Green(−D²+κ²), BC f′(±a) = ±κ f(±a); lowest eigenvalue −2κ/(κ²−ν²), tanh(νa) = ν/κ | confirmed | odd mode sinh(νx); Nyström at (a,κ) = (3, 0.5), (5, 0.3): −15.21634 / −25.36056 vs formula −15.21634 / −25.36056 |
| Thresholds 7.051, 8.767 | arithmetic confirmed | 2sinh(3.5255) − 7.051 = 26.9 = log(3e12/2π); sinh(3.2876)/0.375 − 8.767 = 26.89 |
| Thm 1: W_θ(g) = (1/π)∫ Re ξ′/ξ(1/2+θ+it)\|ĝ(t)\|² dt | confirmed | partial fractions and functional-equation step re-derived. Independent numeric check, g = 1 − x²/a², prime side (pole + primes + digamma) vs Poisson side by mpmath: (a,θ) = (1, 0.4), (1, 0.15), (1.7, 0.4), (1.7, 0.05) agree to 1.3e-7, 1.3e-7, 4.5e-8, 4.5e-8, inside the truncation tail (t > 300) |
| Lemma B (monotone in a and θ) | confirmed | Poisson-average of modulated tests; consistent with every table |
| Thm 2 (lower bound −C‖g‖² on all supports ⇒ Θ ≤ θ) | sound as a sketch | see correction 3 |
| Lattice of pairs invisible for 2a < L/2 | confirmed | Poisson with spacing 4π/L |
| Galerkin normalisation | confirmed | author's `build()` on new cases e^{2a} = 7, 20, θ = 0.2, 0.3, 0.4, N = 70 and 130: λ_min = 0.018766 / 0.018593 (θ = 0.2) ≥ 2ξ′/ξ(0.7) = 0.018483, decreasing in a, N-stable to 6 digits |
| Scan statistics | confirmed | 561 distinct locations, ratio 0.8946 ± 0.0438, range 0.7510–0.9998, correlation −0.737, H ∈ [4.90e5, 5.99e5] |

## Corrections

1. **Lemma A is incomplete for κa ≤ 1.** e^{κ|x−y|} alone is never positive semidefinite on an
   interval (|x−y| is conditionally negative definite; Nyström at a = 2, κ = 0.2 gives −0.910).
   The trigonometric branch tan(ωa) = ω/κ, eigenvalue −2κ/(κ²+ω²), is omitted. The full pair kernel
   e^{κ|u|} + e^{−(δ+θ)|u|} can still be negative there. The asymptote −e^{2κa}/(2κ) is 30% off at
   κa = 1.5 (−20.09 vs −15.22). No downstream number uses the missing branch.

2. **Davenport–Heilbronn contradicts the "0.75–1.00 of the model" range.** With the author's own
   code the DH θ = 0 form changes sign between 2a = 3.6 (−2.6e-7) and 3.8 (−0.270); the prior Arb
   record has it negative at 3.44. The density model for the DH pair (δ = 0.3085, L = log(5·85.70/2π)
   = 4.222) gives 2a = 6.069. Ratio ≤ 0.63, at oversampling L/2a ≈ 1.1. So the model crossover can
   overshoot by more than the scan suggests, and 8.767 is not a lower bound on where positivity
   starts to carry information. This strengthens weakest-step 1; the headline should quote the
   model figure together with the "not below ≈ 5" gap-model floor, not alone. Also §6 "fails by
   2a = 3.44" is taken from the earlier record: this note's `dh.out` shows +1.6e-13 at 3.44 (sign
   unresolved in float).

3. **Thm 2 needs one more step.** A tempered positive measure need not integrate the Poisson kernel.
   The evaluation on e^{−(w−θ)|u|} requires ∫ dμ/(1+t²) < ∞, which follows from Fatou applied to
   positive-definite cutoffs (their transforms are ≥ 0 and the prime side converges for w > 1/2),
   then dominated convergence. The hypothesis must be for complex g. With that the argument closes;
   the label "PROVED, sketch level" is accurate, "PROVED" alone would not be.

4. **The 10^{−30900} and 10^{−5550} margins are extrapolations, not measurements.** They apply the
   Route 11 fit (pole-free form, fitted on e^{2a} ≤ 11) to e^{2a} = 6420. The same fit gives 4e-3
   at e^{2a} = 3, where this note's full form measures 5.5e-8 and the Arb pole-free record is
   8.2e-4. The two forms differ and the fit is not validated for either at this range. Label MODEL.
   Likewise the margin 1.8e-2 at (θ = 0.2, 2a = 15.3) lies outside the tested range 2a ≤ 11 and is
   conditional on no zero with β′ > 0.2.

5. **"T_floor along the crossover curve is minimal at θ = 0" was not supported by the table**
   (the θ = 0.2 row is a lower bound 10^30, below 10^37.9). Referee computation with the author's
   operator fills the gap: λ_R = 95.76, 133.76, 175.33 at (θ, 2a) = (0.05, 9.759), (0.15, 12.786),
   (0.2, 15.317), i.e. T_floor = 10^42.4, 10^58.9, 10^76.9. With the existing 10^37.9 and 10^48.8
   the sequence is increasing on θ ∈ [0, 0.2]. The claim holds on that grid (float, N = 50 Ritz
   lower bounds for λ_R). T_floor itself is a sufficient-triviality height; that a certificate must
   control every t below it is an assumption about the certificate class, as the note says.

## DH control

Valid. DH zero re-located independently: 0.8085171825 + 85.6993484854i (|f| = 4e-21). DH θ = 0
entries track the pair kernel 2a − sinh(2aδ)/δ (referee: −0.27, −0.77, −1.07, −1.26, −1.88 at
2a = 3.8, 4.0, 4.2, 4.4, 5.0 against kernel −0.93, −1.10, −1.28, −1.48, −2.23). Thm 1 fails for DH at
the zero-free half-plane input, which is the only arithmetic step. The DH entries at θ ≥ 0.25 are
positive in the resolved band only; divergence there (zeros with σ > 1) is asserted from Thm 2, not
observed.

## Walls

RH not assumed (Thm 1 is stated for θ > Θ; unconditional use is θ ≥ 3/8 and depends on the
unrefereed 7/8 theorem). Verified height enters only as the model parameter X. Float comparisons
decide no sign that is claimed: θ = 0 ζ entries are reported as unresolved.

## Surviving claim

Lemma A, Lemma B and Theorem 1 are correct; Theorem 2 is correct at sketch level. An all-support
lower bound for the damped Weil form at damping θ is equivalent to the zero-free half-plane
Re s > 1/2 + θ, so the damped ladder contains no statement between "finite computation" and "new
half-plane". The crossover figures 7.051 / 8.767 are exact only inside the uniform-background
one-pair model; measured backgrounds give 0.60–1.00 of it (DH included). The cost figures in §5 are
model extrapolations.
