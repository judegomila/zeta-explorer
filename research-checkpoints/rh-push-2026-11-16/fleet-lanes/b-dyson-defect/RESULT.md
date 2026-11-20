# b-dyson-defect: the Route 23 "0.434" constant, derived from the explicit formula

Slug `b-dyson-defect`, campaign 2026-11-16. Labels: PROVED / CLASSICAL / MEASURED / HEURISTIC / OPEN.
No Λ claim. PT Λ ≤ 0.2 stands. RH open. NO QED.

## 0. Verdict

**Partial result plus a precise obstruction.**

1. The Route 23 number 0.434 is not a constant. With 1.04·10^8 new zeros at six heights (T = 10^7 … 10^12),
   c(L) = (Q+1)·L²/(12Λ_B) falls from 0.454 ± 0.011 (L = 14.4) to 0.393 ± 0.015 (L = 23.5) and 0.393 ± 0.019 (L = 25.8);
   a constant c has χ² = 17.6 on the 6 new points. (MEASURED)
2. The defect has an exact explicit-formula decomposition (Proposition 1, CLASSICAL tool, checked zero by zero):
   Q = (prime sum over n ≤ e^X) + (resonant remainder). The prime sum is a sum of prime waves n^{iγ} weighted by a
   response coefficient that is measured to equal the sine-process (GUE) response to within 0.5% for primes
   p ≥ 11. (CLASSICAL identity, regularisation not written out, numerically exact per zero; MEASURED coefficients)
3. First-order formula, no fitted parameter (Proposition 2, HEURISTIC):
   Q(L) + 1 = (2π/L²) [ Σ_n Λ(n)²/n · K(2π log n / L) − ∫_0^L y K(2πy/L) dy ],
   K = universal sine-process kernel, K(k) = −(1+V)k + O(k³), V = 0.17999. It reproduces the measured defect to
   7–12% for ζ at L = 14–26, reproduces the fall of c(L), and predicts the conductor-5 Dirichlet character
   (0.137 predicted, 0.130 ± 0.008 and 0.137 ± 0.007 measured; 0.090 if the Euler factor at 5 is not removed).
4. Consequence of the formula: the 1/L² coefficient is 0. Asymptotically Q + 1 = A/L³ (1 + O(1/L)),
   A = 4π²(1+V)|c₃| = 280.6, c₃ = lim [Σ_{n≤X} Λ(n)² log n / n − log³X/3] = −6.02404. The value "0.434·12Λ_B/L²"
   is the broad maximum of the prime sum near L ≈ 10–20 (c_eff → 0 like 14.9/L). (HEURISTIC, consistent with all data)
5. Sign and monotonicity exist (defect > 0; it decays monotonically along the forward flow, mode by mode at the
   exactly known rate k(2π−k)), and they do **not** constrain Λ from above. Reason: the defect is a second-moment
   (diagonal, mean over a window) functional of the Dirichlet coefficients Λ(n)²/n; Λ is decided by the worst zero
   pair (a sup-norm statement). This is the MV-CAP wall. The DH control makes it concrete: with 9.7% (resp. 27.8%)
   of zeros off the line, the same statistic on the real zeros is 0.03 ± 0.015 (resp. −0.165 ± 0.019), the same
   range as for genuine L-functions (0.13).

## 1. Plan: what is new against the atlas and the walls

- Atlas (PR #27) §5 has the adjacent-gap equation y' = 8 − 4Sy and states that endpoint data do not give the
  trajectory bound; §12 fixes what a route may claim about Λ. Route 23 (fifty-routes row 23, partial) left a measured
  law "(0.434 ± 0.008)·12Λ_B/L²" on L ∈ [7, 12] and unfinished finite-τ runs. Nothing in the atlas or the routes
  derives the number or tests it above T ≈ 10^6.
- New here: (i) zeros at T = 10^7 … 10^12 (own Riemann–Siegel code, validated to 3·10^-9 against Odlyzko);
  (ii) an exact per-zero explicit formula for the Dyson drift; (iii) the measured prime-wave response and its
  identification with a universal GUE kernel; (iv) a parameter-free prime-sum formula for the defect and its
  asymptotic law; (v) the finite-τ runs, done through an exact mode dictionary (heat flow = damping of the n-th
  Dirichlet mode at the linearised Dyson rate), checked against the exact Dyson ODE to 3·10^-6;
  (vi) a DH control with the same pipeline.
- Walls. DH: §5 below; the only step that uses the Euler product is the support and size of the coefficients of
  −ζ'/ζ (Λ(n) on prime powers). Flow-blindness: the statistic is continuous in τ (§3.7) and nothing here is a
  hypothesis that breaks under small backward flow; no RH-type conclusion is drawn. MV-CAP: this is the stated
  reason for "no consequence" (§4). Verified height: not used; all zeros used lie below 1.01·10^12 < 3·10^12.

## 2. Definitions

Unfolded zeros x_k = θ(γ_k)/π (unit mean density), g_k = x_{k+1} − x_k, F_k = Σ'_{j≠k} 1/(x_k − x_j),
D_k = F_{k+1} − F_k, φ_k = 2x_k − x_{k−1} − x_{k+1}, L = log(T/2π), Λ_B = γ₀² + 2γ₁ + Σ_p log²p/(p−1)² = 1.5731511.
Flow convention ∂_t H = −H_zz, z = 2γ, τ = t L²/(16π²). Under the flow dx_k/dτ = 2F_k and dV/dτ = 4 cov(g, D).

- Q := ⟨g_k D_k⟩ = ⟨φ_k F_k⟩ (summation by parts; PROVED). For every CUE_N, Q = −1 (CLASSICAL loop identity).
- "Defect" := Q + 1. Route 23 wrote it as c·12Λ_B/L².
- g D = 2 − g² S, S ≥ 0 when all zeros are real (atlas §5), so Q ≤ 2 always (PROVED, trivial).

## 3. Results

### 3.1 New data: c is not constant (MEASURED)

Zeros computed with `rs_zeros.py` (Riemann–Siegel main sum with C0–C2, phases reduced in 60-digit arithmetic,
Z sampled at 4× the Nyquist rate, Gaussian-windowed sinc interpolation, bisection plus Newton polish). Validation:
40,049 zeros near T = 3·10^5 and 10^6 agree with Odlyzko's table to 3.0·10^-9 (the table's precision); Z agrees
with mpmath `siegelz` to 4·10^-12 at T = 10^8, 10^10, 10^12; the zero count agrees with θ-counting to ±3 at every
height (no missed pair). Q uses 200 neighbours each side plus the continuum tail (Route 23's estimator).

| T | L | zeros | V | Q + 1 | c = (Q+1)L²/(12Λ_B) | first-order formula (§3.4) | meas/formula |
|---|---|---|---|---|---|---|---|
| ≈ 7·10³–1.1·10⁶ (Route 23, 8 bins) | 7.0–12.0 | 2.0·10⁶ | 0.1673 (top bin) | 0.1515 … 0.0586 | 0.39 … 0.45 | 0.1326 … 0.0624 | 1.14 … 0.94 |
| 1.09·10⁷ | 14.365 | 4.02·10⁶ | 0.16999(6) | 0.04148 ± 0.00097 | 0.4535 ± 0.0106 | 0.04459 | 0.930 |
| 1.04·10⁸ | 16.620 | 2.004·10⁷ | 0.17186(3) | 0.02977 ± 0.00047 | 0.4356 ± 0.0069 | 0.03316 | 0.898 |
| 1.00·10⁹ | 18.889 | 2.000·10⁷ | 0.17326(4) | 0.02253 ± 0.00049 | 0.4259 ± 0.0092 | 0.02512 | 0.897 |
| 1.00·10¹⁰ | 21.188 | 2.000·10⁷ | 0.17434(4) | 0.01737 ± 0.00051 | 0.4131 ± 0.0121 | 0.01932 | 0.899 |
| 1.00·10¹¹ | 23.491 | 2.000·10⁷ | 0.17518(5) | 0.01344 ± 0.00051 | 0.3929 ± 0.0149 | 0.01511 | 0.889 |
| 1.00·10¹² | 25.793 | 2.000·10⁷ | 0.17587(5) | 0.01116 ± 0.00053 | 0.3933 ± 0.0185 | 0.01201 | 0.929 |

The 1/L² law with c = 0.434 fits L ∈ [9, 21] to a few percent because the prime sum of §3.4 has a broad maximum
there. c falls with L above L ≈ 14.

### 3.2 Proposition 1: explicit formula for the drift (CLASSICAL tool; identity checked per zero)

For a zero γ_k and X > 0 with e^X not a prime power, summing over all zeros in symmetric order,

  W_k(X) := Σ_{j≠k} [1 − cos(X(γ_k − γ_j))]/(γ_k − γ_j) = − Σ_{n<e^X} Λ(n) n^{-1/2} sin(γ_k log n) + E_k(X),

E_k = archimedean term (smooth in γ_k) + pole term O(e^{X/2}/γ_k).

Proof sketch. (1 − cos Xu)/u = ∫_0^X sin(yu) dy and Σ_j sin(y(γ_k − γ_j)) = Im[e^{iyγ_k} Σ_j e^{−iyγ_j}]. The
Guinand–Weil explicit formula (Landau's formula in distribution form) gives, for y > 0,
Σ_γ e^{−iyγ} = −Σ_n Λ(n) n^{-1/2} δ(y − log n) + (smooth in y). Integrate over y ∈ (0, X). The test function
u ↦ (1 − cos X(γ_k−u))/(γ_k−u) has Fourier transform supported in [−X, X]; it decays only like 1/u, so the formula
is used with symmetric summation (standard regularisation; this step is not written out in full here).

Numerical check (`decomp.py`, 2·10^7 zeros at T = 10^8, 1000 neighbours each side): regression slope of W_k on the
prime sum = −1.00006 (X = L/4), −0.99939 (X = L/2), −0.99963 (X = 3L/4); rms residual 0.010, 0.046, 0.072 against
rms W = 1.95, 4.06, 5.95 (the residual is the neighbour truncation and the sharp edge at n ≈ e^X).

Consequence (PROVED given Prop. 1, exact): with κ = 2πX/L,

  Q = P_X + R_X,  P_X = −(2π/L) Σ_{n<e^X} Λ(n) n^{-1/2} ⟨φ_k sin(γ_k log n)⟩,  R_X = ⟨φ_k Σ_{j≠k} cos(κ(x_k − x_j))/(x_k − x_j)⟩.

For the sine process the same split is P⁰(κ) = ∫_0^κ Ψ₀(k) dk, R⁰(κ) = −1 − P⁰(κ), with
Ψ₀(k) := E[φ_0 Σ_{j≠0} sin(k(x_0 − x_j))] (computed by CUE_48 Monte Carlo, 3.6·10^6 matrices, `psi_mc.py`):
P⁰ = −0.19375, −0.85176, −1.29500, −1.29382 at κ = π/2, π, 3π/2, 2π.

Measured split of the defect (MEASURED; P from zeros and from primes agree to 4·10^-4):

| L | κ | P_X (zeros) | P_X (prime sum) | P_X − P⁰ | R_X − R⁰ | sum |
|---|---|---|---|---|---|---|
| 16.62 | π/2 (n ≤ 63) | −0.17629(3) | −0.17630 | +0.01746 | +0.01266(48) | 0.0301 |
| 16.62 | π (n ≤ 4064) | −0.82625(20) | −0.82668 | +0.02551 | +0.00461(47) | 0.0301 |
| 16.62 | 3π/2 (n ≤ 2.6·10⁵) | −1.27920(30) | −1.27954 | +0.01580 | +0.01433(46) | 0.0301 |
| 21.19 | π/2 (n ≤ 199) | −0.18433(4) | −0.18476 | +0.00942 | +0.00831(51) | 0.0177 |
| 21.19 | π (n ≤ 39900) | −0.83643(26) | −0.83687 | +0.01533 | +0.00239(48) | 0.0177 |

At κ = π (n ≤ √(T/2π), the Riemann–Siegel length) 85–87% of the defect is the prime sum.

### 3.3 Landau peaks and the prime-wave response (MEASURED)

With ρ_n = ⟨e^{iγ log n}⟩ and a_n = ⟨φ e^{iγ log n}⟩: ρ_n = −Λ(n)/(√n L) to relative 3·10^-5 (Landau's formula; n ≤ 100,
2·10^7 zeros). Define K_P(n) := Im(a_n/ρ_n), so that P_X = Σ_{n<e^X} c_n K_P(n) with c_n = (2π/L²) Λ(n)²/n exactly.
The sine-process analogue is K(k) := 2πΨ₀(k)/k (regression of the local second difference on a density mode of
wavenumber k). With k_n = 2π log n / L:

- primes 11 ≤ p, k_p < 2: K_P(p)/K(k_p) − 1 ∈ [−0.005, +0.006] at L = 14.4, 16.6, 21.2 (20, 41, 142 primes);
- small primes: +0.061, +0.039, +0.020, +0.012 for p = 2, 3, 5, 7 at L = 16.6 (+0.051, +0.035, +0.019, +0.012 at 21.2);
- prime powers: +0.10 for p² (4, 9, 25, 49), +0.14 for p³, +0.17–0.19 for 2⁴, 2⁵, 2⁶ at L = 16.6; all these excesses
  scale roughly like 1/L (ε_n·L = 1.0, 1.0, 1.1 for n = 2; 1.6, 1.7, 1.8 for n = 4, 9 at L = 14.4, 16.6, 21.2);
- near k → π the ratio rises to 1.01–1.02.

Small-k law: K(k) = −(1+V) k (1 − 0.07 k² …): MC gives −K(k)/k = 1.176 at k = 0.13. Reason (local equilibrium,
HEURISTIC, confirmed by MC to 0.3%): a slow density wave dilates gaps, and the response of
φ_0 = g_{−1} − g_0 to a dilation gradient is −⟨(g_{−1}² + g_0²)/2⟩ = −(1+V). The harmonic-lattice value is −1.

### 3.4 Proposition 2: first-order prime-sum formula (HEURISTIC, no fitted parameter)

Model G: at the level of this statistic the zeros are the sine process with its long-wavelength density modes
re-weighted from the ramp S₀(k) = k/2π to the diagonal form factor of ζ, i.e. to peaks of weight
c_n = (2π/L²)Λ(n)²/n at k_n = 2π log n/L (Bogomolny–Keating diagonal term; the weights are exactly Λ(n)², from
(ζ'/ζ)' − B). For a Gibbs perturbation exp(−2U), U = ½Σ_k û_k(|ρ_k|² − N), the Ward identity is exact:
Q + 1 = E[φ_0 ∂_0U] = −Σ_k û_k k Ψ(k). For Gaussian modes û_k N = 1/S − 1/S₀ and Ψ = Ψ₀ S/S₀, which gives, to all
orders in the re-weighting,

  Q + 1 = ∫ K(k) [S(k) − S₀(k)] dk = Σ_{n<e^L} c_n K(k_n) − ∫_0^{2π} K(k) k/(2π) dk.   (★)

(★) is Proposition 1 with K_P(n) replaced by K(k_n) and R_X − R⁰ replaced by the modes above κ. Checks:
- ζ, L = 14.4–25.8: (★) is 7–12% above the measurement (table in §3.1); the ratio is 0.89–0.93 (0.904 ± 0.009 fitted),
  so (★) reproduces the L-dependence. The excess (0.0034 at L = 16.6) has the sign and order of magnitude of the measured
  second-order excesses of §3.3 (K_P > K at p = 2, 3 and at prime powers: Σ c_n K ε_n = −0.0066 for k < π at L = 16.6).
- ζ, L = 7–12 (Route 23 bins): χ² = 15.4 for 8 points with no free parameter.
- L(s, χ) mod 5, χ(2) = i, T ∈ [8·10³, 3·10⁴] (33,469 real zeros = all zeros, count checked): (★) with the prime 5
  removed and L = log(5T/2π) gives 0.137; measured 0.130 ± 0.008 (χ) and 0.137 ± 0.007 (χ̄). Keeping p = 5 gives
  0.090, excluded at 8σ. The defect reads the local Euler factors.
- harmonic-lattice kernel W(k) = (2π−k)(1−cos k)/(πk) instead of K: 15% below the data (same shape).

### 3.5 Asymptotics: the 1/L² coefficient is zero (HEURISTIC; three independent arguments)

(a) From (★): K(0) = 0 and K'(0) = −(1+V), so
 Q + 1 = (1+V)(2π)²/L³ · [−Σ_{n≤X} Λ(n)² log n/n + log³X/3] + O(L⁻⁴) = A/L³ + O(L⁻⁴), A = 4π²(1+V)|c₃| = 280.6,
 c₃ = 2a₂ − Σ_p 2p log³p/(p−1)³ = −6.02404 (a₂ = −0.0516886 is the s² coefficient of −ζ'/ζ(1+s); prime sum
 5.92066; direct partial sums give −6.009 at X = 10⁸). (`c3.py`.) The measured second-order excesses are O(1/L)
 relative, so they enter at L⁻⁴. Evaluating (★): L³(Q+1) = 152, 184, 222, 251, 272, 278 at L = 16.6, 21.2, 30.4,
 46.8, 100, 300; c_eff = 0.485, 0.459, 0.387, 0.284, 0.144, 0.049. So c_eff ≈ 14.9/L eventually.
(b) Ratios-conjecture structure (CLASSICAL heuristic, re-derived): in the Conrey–Snaith ratio the arithmetic
 exponent is, to second order in the shifts, −Λ_B (Σα − Σγ)(Σβ − Σδ) (the linear terms cancel; the Euler factor
 gives log²p/(p−1) − p log²p/(p−1)² = −log²p/(p−1)²; the pole part gives −(γ₀² + 2γ₁)). CUE_N has the same form with
 1/12. Hence all n-level correlations of ζ at fixed arguments equal those of CUE_{N_eff}, N_eff = L/√(12Λ_B), at
 order 1/L². CUE_N satisfies Q = −1 exactly, so no 1/L² term survives if tails are uniform; the tail terms are
 estimated (not proved) to be O(L⁻³): weights 1/m³ against O(1/L) differences over O(L) neighbours.
(c) Data: c falls from 0.4535 ± 0.011 (L = 14.4) to 0.393 ± 0.015 (L = 23.5) and 0.393 ± 0.019 (L = 25.8).
 On the 6 new points a constant c fits with χ² = 17.6 (5 dof, best c = 0.428); the shape of (★) times one free
 normalisation fits with χ² = 2.3 (5 dof, normalisation 0.904 ± 0.009). The data do not by themselves separate
 "c → 0" from "c → a smaller positive constant"; that part rests on (a) and (b).

Not established: a proof of (★), the size of the O(L⁻⁴) term, and the remainder R_X − R⁰ at the resonant point
κ = 2π. Route 23's "Q is not evaluable in the BBLM effective-N model" is refined: BBLM gives 0 at order 1/L²;
the defect is the next order, with a coefficient 280.6 that is 14.9 times 12Λ_B.

### 3.6 Why N_eff is useless at accessible heights (MEASURED)

N_eff = 2.8, 3.8, 4.9, 5.9 at L = 12.0, 16.6, 21.2, 25.8. The Bogomolny–Keating two-point function (computed,
`bk2.py`) matches CUE_{N_eff} only for s ≪ N_eff: at L = 21.19 the ratio (zeros − sine)/(CUE_{N_eff} − sine) is
1.09, 0.96, 0.47, 0.33, 0.08 at s = 0.1, 0.4, 0.7, 1.5, 2.5. Gap variance: V(L = 21.19) = 0.17434 equals the
CUE_6 value 0.17451(2), not the CUE_{4.88} value ≈ 0.1715. Everything measured so far lives in the regime
r = 2πs/L = O(1), where the individual primes are resolved.

### 3.7 Finite-τ runs (finished) and the exact mode dictionary

Lemma (CLASSICAL effective approximation, re-derived; numerically verified). The n-th Riemann–Siegel term has
local frequency ω_n = ½(L/2 − log n) in z = 2γ; e^{−t∂_z²} multiplies it by e^{tω_n²}. Relative to n = 1 the factor
is exp(−(t/4) log n (L − log n)) = exp(−τ λ(k_n)), λ(k) = k(2π − k), k_n = 2π log n/L. λ is exactly the linearised
Dyson rate on the unit lattice, 2Σ_{m≠0}(1 − cos mk)/m² = 2πk − k². So the forward heat flow is: damp the n-th
Dirichlet mode by e^{−τλ(k_n)}.
Check (`flow_check.py`, T = 10⁶): zeros of the damped Riemann–Siegel sum against the exact Dyson ODE started from
the true zeros (6000 zeros, central 1000): rms position difference 3.3·10⁻⁶ at τ = 0.005 and 1.0·10⁻⁵ at τ = 0.02
(unfolded units); V = 0.1490 / 0.1490 and 0.1144 / 0.1143.

Production (T = 10⁸, L = 16.59, 4.0·10⁶ zeros per τ; reference: CUE_64 under the exact drift ODE, 6·10⁴ matrices):

| τ | V zeros | V CUE | Q+1 zeros | Q+1 CUE | defect (zeros − CUE) | (★) with weights c_n e^{−2λτ}, kernel frozen |
|---|---|---|---|---|---|---|
| 0 | 0.17183(7) | 0.17982(13) | 0.0297(11) | −0.0002(13) | 0.0299(17) | 0.0333 |
| 0.0025 | 0.16288 | 0.17061 | 0.16217(62) | 0.13721(81) | 0.0250 | 0.0322 |
| 0.005 | 0.15491 | 0.16242 | 0.24130(51) | 0.21889(69) | 0.0224 | 0.0311 |
| 0.01 | 0.14092 | 0.14803 | 0.35410(38) | 0.33488(55) | 0.0192 | 0.0291 |
| 0.02 | 0.11825 | 0.12469 | 0.50168(26) | 0.48612(40) | 0.0156 | 0.0255 |
| 0.05 | 0.07393 | 0.07890 | 0.72775(11) | 0.71740(21) | 0.0104 | 0.0173 |
| 0.1 | 0.03707 | 0.04045 | 0.87927(4) | 0.87298(10) | 0.0063 | 0.0094 |
| 0.2 | 0.01129 | 0.01304 | 0.96950(1) | 0.96691(3) | 0.0026 | 0.0032 |
| 0.4 | 0.00192 | 0.00264 | 0.99659 | 0.99601 | 0.0006 | 0.0007 |

The defect is positive and decreases monotonically in τ; the V deficit (zeros below CUE) also decreases
monotonically (0.0080 → 0.0007). The frozen-kernel formula has the right sign and monotonicity and is 11–66% high
(largest at τ = 0.02–0.05) (the response kernel itself relaxes under the flow; not modelled). dV/dτ = 4Q is satisfied by the
table (e.g. (V(0.0025) − V(0))/0.0025 = −3.58 against the trapezoid of 4Q, −3.62).

## 4. Does the sign or the monotonicity constrain Λ from above? No.

What is established: defect > 0 at every height measured, with the mechanism "Λ(n)² is supported on prime powers,
which are sparser than their mean density at the start of the spectrum (nothing below log 2; c₃ < 0)"; under the
forward flow each prime mode is damped at rate λ(k_n) > 0, and the measured defect decays monotonically.

Why there is no consequence for Λ:

1. Second moment versus supremum. By Proposition 1 the defect is linear in ⟨φ_k sin(γ_k log n)⟩, and in (★) it
   depends only on |coefficient|² = Λ(n)²/n. It is a window average. Λ ≤ t₀ needs every zero of H_t real for
   t ≥ t₀, a statement about the worst pair (in the dictionary of §3.7: sup-norm control of
   Σ_{n≥2} n^{-1/2} e^{−τλ(k_n)} n^{−iγ} against the n = 1 term). A mean square does not bound a supremum at every
   height: MV-CAP. Moving o(N) zeros off the line changes Q by o(1).
2. The statistic cannot see off-line zeros even at positive density: DH control, §5.
3. The sign is the unhelpful one for an "already relaxed" reading. Zeros look like GUE advanced by a small
   positive time (V deficit 0.0080 at L = 16.6 corresponds to τ_eff ≈ 0.0022, t_eff = 16π²τ_eff/L² ≈ 1.3·10⁻³), and
   τ_eff ∝ 1/L² → 0. This is a statement about typical gaps. The smallest gaps are GUE-like
   (P(s < 0.2) = 0.0076–0.0082 at L = 14–26 against 0.0085) and collide at −s²/8 backward, as Route 23 saw.
4. Flow-blindness: Q(τ) is continuous through τ = 0 and (★) with weights c_n e^{−2λτ} is smooth for small τ < 0.
   Nothing in the defect changes character at Λ.
5. The upper bound mechanism that the dictionary does give is the known one: at height T all zeros of H_t are real
   once the damped tail is below the leading term, t ≳ c/log T; small T is covered by verified height. That is the
   Polymath/Platt–Trudgian architecture and binds on verified height (routes 2, 6, 50).

## 5. DH control (MEASURED)

Z_DH = Z_χ + Z_χ̄ (χ mod 5, χ(2) = i; checked: the off-line zero 0.808517 + 85.699348i is a zero of the
combination, |f| = 6.5·10⁻⁷). Same pipeline (python-flint Hardy Z at 64 bits, 141,184 samples, T ∈ [8·10³, 3·10⁴]).

| function | Euler product | real zeros | all zeros (count formula) | off line | V | Q + 1 (real zeros) |
|---|---|---|---|---|---|---|
| L(s, χ) | yes | 33,469 | 33,468.2 | 0 | 0.1506 | 0.130 ± 0.008 |
| L(s, χ̄) | yes | 33,468 | 33,468.2 | 0 | 0.1505 | 0.137 ± 0.007 |
| DH = Z_χ + Z_χ̄ | no | 30,223 | 33,468.2 | 3,245 (9.7%) | 0.2296 | 0.034 ± 0.015 |
| Z_χ − Z_χ̄ | no | 24,166 | 33,468.2 | 9,302 (27.8%) | 0.3007 | −0.165 ± 0.019 |

- Proposition 1 holds for DH with the coefficients of −f'/f and with the off-line zeros in the sum; no step fails.
- The step that uses the Euler product is the identification of the coefficients: Λ(n) ≥ 0 on prime powers, hence
  Landau peaks −Λ(n)/(√n L), weights Λ(n)²/n and the formula (★). For DH, −f'/f has coefficients on all n with no
  Ramanujan-type bound, and (★) has no analogue.
- The statistic on the real zeros stays within 0.2 of the GUE value with 10–28% of the zeros off the line. A value
  of Q near −1, of either sign of the defect, is therefore not evidence about the reality of zeros. Any argument
  from the defect to "zeros stay real" would have to fail for DH, and nothing in the defect distinguishes DH in the
  required direction (DH's value is closer to −1 than ζ's).

## 6. Corrections to the Route 23 record

- "c = 0.434 ± 0.008": an effective value on L ∈ [7, 12]; c(L) is not constant (§3.1) and the 1/L² coefficient is 0
  in the first-order theory (§3.5).
- "more than 12σ deviation at T ≈ 10⁶": confirmed and extended (63σ at T = 10⁸).
- "β_eff ≈ 2.13": height-dependent; β_eff = 2/|Q| = 2.061 at L = 16.6, 2.035 at 21.2, 2.027 at 23.5.
- "look up the Bogomolny–Keating 3-point prediction": not needed; the relevant object is the two-point diagonal
  weight Λ(n)²/n and a universal response kernel.
- finite-τ runs: done by the damped-mode method (§3.7); the old window ODE scripts are superseded. Backward
  (τ < 0) production was not run: the damped-mode zero finder assumes real zeros, and backward collisions were
  already located by Route 23 at −s²/8.

## 7. Three weakest steps

1. Proposition 2 (★) is a model (Gaussian re-weighting of density modes of the sine process), not a theorem. It is
   supported by the measured response coefficients (±0.5% for p ≥ 11) and by the conductor-5 prediction, and it
   overshoots the defect by 7–12%; the excess is attributed to second-order mode coupling (measured at p = 2, 3
   and prime powers) and to the resonant remainder R_X − R⁰ near κ = 2π, which is not derived. The asymptotic law
   A/L³ and the value A = 280.6 inherit this status; no data above L = 25.8 test them.
2. Proposition 1 uses the explicit formula with a test function decaying like 1/u (symmetric summation). The
   regularisation is standard but is not written out; the evidence here is the per-zero numerical identity
   (slope −1.0000 ± 0.0006).
3. Numerics: the kernel K comes from CUE_48 Monte Carlo (N = 32 agrees; N = 96 run was stopped to free cores);
   Q is heavy-tailed (errors from block means of 2000); the Route 23 low-height bins are reused, not recomputed;
   the damped-mode zeros at τ > 0 drop the Riemann–Siegel remainder's τ-dependence beyond a factor e^{−π²τ};
   the DH run is short (3·10⁴ zeros) and covers one height range.

## 8. Files (all under tmp/research-2026-11-16/push/b-dyson-defect/)

- `rs_zeros.py` (zero finder, τ option), `validate.py`, `validate2.py`, `flow_check.py`
- `qstat.py` (Q, V, profile), `decomp.py` (Proposition 1 split), `kprime2.py`, `kp_analyze.py` (K_P)
- `psi_mc.py`, `sineref.py` (sine-process kernel), `predict.py`, `model_aux.py`, `linresp.py` (formula (★))
- `c3.py` (c₃, Λ_B, A), `bk2.py` (BK two-point), `cue_sim.py`, `cue_flow.py`, `dh_sample.py`, `dh_analyze.py`
- `out/` (logs and JSON from the motherbox: `qstat.jsonl`, `qstat_tau.jsonl`, `zeros_*_decomp.json`, `zeros_*_kp.json`,
  `psi_48.json`, `cueflow_64.json`, `cue_{4,5,6,8}.json`, `dh_result.json`)
- Motherbox: `~/rh-push/b-dyson-defect/` holds the zero files (`zeros_1e7 … 1e12.npz`, `ztau_*.npz`, ≈ 3 GB). GPU 1 only.
