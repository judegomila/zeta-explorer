# r3-nonpolar-numerics: the non-polar remainder of the theta–row form against 93,486 targets at R = Q^1.4

Internal working note, 2026-11-16. Nothing committed, nothing pushed. Not refereed. Files: this directory (scripts,
logs, `agg.json`) and, on the motherbox, `~/rh-push/r3-nonpolar-numerics/out/` (per-target statistics, 11 files).
Input data: the per-conductor twisted sums stored by `../r2-tro6-nonpolar-scale` (read-only).

**Verdict: partial result (measurements only). TRO6^♮(η) is not proved for any η > 0. No abscissa is claimed;
θ = 7/8 and B♭ = 0.874886647 are unchanged and both rest on unrefereed inputs (openai/math manuscript, Liu 2610.12234,
Xu–Sang 2610.15291, Liu 2610.26835). RH open. NO QED.**

Labels: EXACT (identity checked numerically) / MEASURED / HEURISTIC / OPEN. Nothing here is PROVED.

## 0. Summary

1. **[MEASURED] The remainder is at the random level for every target tested, with the law of a sum of independent
   phases.** For 93,486 unimodular targets ν (73,016 non-principal Dirichlet characters modulo the 160 split primes π,
   7 ≤ N(π) ≤ 997; 18,360 Grössencharacter twists α^k N^{iv}, |k| ≤ 30, |v| ≤ 295; 2,110 sextic symbols χ_c(y)^j) the
   statistic t = |Σ_c ν(c)x_σ(c)|²/Σ_c|x_σ(c)|², x_σ(c) = α(c)γ₂(c)w_R(c)·(leave-one-out twisted sum of ρ̂_σ), has
   mean 1.000 with error 0.002–0.006 at each of the 11 path points Q = 938 … 30000, R = Q^{1.4}, before and after
   removal of the polar part. At Q = 30000 on 876,192 (target, class) values: E t² = 1.994 (Exp(1): 2),
   P(t > 3) = 0.0498 (0.0498), P(t > 6) = 0.00246 (0.00248), Kolmogorov distance 0.0011 (5% level 0.0015).
2. **[MEASURED] Exponent.** Root-mean-square correlation against Cauchy–Schwarz over the family: r_rms ∝ Q^{−δ},
   δ = 0.506 ± 0.003 (leave-one-out), 0.493 ± 0.003 (polar part removed). Supremum over all 93,486 targets and 12
   classes: r_max = 0.069 → 0.0117, δ = 0.501 ± 0.008; max t = 12–17 at every Q against 14.5 ± 1.3 for the
   maximum of 1.12·10⁶ exponential variables. δ = 0 is excluded at more than 60 standard errors.
3. **[MEASURED] Separation of η = 0 from η > 0.** A coherent (non-decaying) component common to the family is bounded
   at 95% by r_coh ≤ 2.1·10⁻⁴ (2.5·10⁻⁴ after polar removal) at Q = 30000, against 3·10⁻³–5·10⁻³ in round 2. The TRO6
   threshold Q^{−η/80} is 0.88 at this Q for η = 1. The data exclude η = 0 with a constant above these values for
   these targets; they cannot separate η = 0 with a smaller constant from η > 0. No η is claimed.
4. **[MEASURED] No structure in the remainder of manuscript-type rows.** Mean t does not depend on the class σ
   (0.994–1.004), the stratum (rows prime to 6 or not), the order of the character (orders 2, 3, 4, 6, 12 within 3%),
   the prime, k, v, or on whether the target is a Hecke character, a random completely multiplicative function
   (0.992 ± 0.025) or independent random phases (0.995 ± 0.025).
5. **[MEASURED] Two structures that are present, neither in manuscript-type rows.**
   (a) The polar part: its share of the conductor-side energy Σ_c|x_σ(c)|² is 18.7% at Q = 938 and 10.8% at
   Q = 30000 (slope −0.16 ± 0.01 in log Q; Theorem P of round 2 with M ∼ Q^{0.87} gives −0.13).
   (b) New: Möbius-phased rows (the smoothed Kubota sum) twisted by α^k N^{iv} with small (k, v) are *below* the random
   level, t = 0.24–0.77 for 1 ≤ |k| ≤ 3, |v| ≤ 2, at every Q, returning to 1 for |v| ≳ 20 or |k| ≳ 13. The zone widens
   in k with Q (|k| ≤ 3 at Q = 938, |k| ≤ 12 at Q = 30000). Manuscript-type rows show no such zone.
6. **Reading.** TRO6^♮ is not contradicted anywhere in the tested family; the cancellation seen is generic
   (central-limit) cancellation in the conductor sum on top of square-root cancellation in the row sum, with no
   visible arithmetic mechanism and no dependence on the Euler product of the target. The conjecture this suggests
   is stated in §5. The measurement cannot reach the part of TRO6^♮ that Theorem D ties to zeros of the target.

## 1. Plan; what is new against the atlas, the walls and rounds 1–2

* Atlas (PR #27 §10): 7/8 boundary and the sixth-phase obstruction. No closed route is re-run. CRITIC_R1 Tier C
  lanes are not touched.
* `../r2-tro6-nonpolar-scale` already sampled R = Q^{1.4} to Q = 30000 with 14 row types. Its statistic for target
  rows sat at its noise floor 1/√rows and its referee wrote "the statistic has no power". Differences here:
  * the statistic is formed on the conductor side, where the null is exact: for a unimodular ν the expected value of
    |Σν(c)x(c)|² under random phases is Σ|x(c)|², computed from the same data, with no row-side noise model;
  * 93,486 targets instead of 14, all evaluated exactly by finite Fourier transforms over residue classes, so
    family means have errors 0.001–0.004 and the supremum over the family is available;
  * controls with the same combinatorics: shuffled residue labels, random completely multiplicative targets,
    independent random phases; positive control: the aligned row;
  * the polar energy share and the low-frequency zone of item 5 are new measurements.
* `../r2-tro6-polar-theorem`: Theorem P is used only as the prediction for the slope of the polar share. Its
  cutoff-∞ amplitudes do not apply to the stored estimator (its referee E3), so the polar part is removed here by
  the estimator-consistent projection of round 2 (cell means of S·conj(pred) over (norm shell, class of c)), not by
  K₀A(σ, [c]). "Exact subtraction" in the sense of the task is therefore exact for the projection, not for Theorem P.
* Walls. Nothing here is a statement about zeros. MV-CAP, flow-blindness, verified height: not engaged. DH: §6.

## 2. Setup

Notation of rounds 1–2. F = Q(ω), −e₀ = 2λ⁵, σ = class mod 4, pred(c) = γ₁(c)conj χ_c(−e₀), exact table of γ_j at
the 2,822,619 squarefree primary c prime to 6 with N(c) ≤ 10⁷.

* **Data (round 2, unchanged).** S_σ(c; Q_k) = Σ_{N(m) ≤ Q_k, generic half rows} ρ̂_σ(−e₀m)χ_c(m) for every c, six
  classes σ of the parity of c, two strata, Q_k = 30000·2^{−(10−k)/2}; the estimator self-term weights self(c).
  ρ̂ is the complete-coefficient estimator of round 1 (moduli 10³ < N ≤ 10⁷; noise share of Σ|ρ̂|² 0.17–0.24 on all
  rows, 0.26–0.37 on rows prime to 6).
* **Conductor-side vector.** y_σ(c) = S_σ(c) − 1[σ = class(c)]·pred(c)·self(c) (variant `loo`), or y minus the cell
  mean of y·conj(pred) times pred (variant `band`). x_σ(c) = α(c)γ₂(c)w_k(c)y_σ(c),
  w_k(c) = N(c)^{−1/2}exp(−2log²(N(c)/R_k)), |log(N(c)/R_k)| ≤ 1.6, R_k = Q_k^{1.4}. This is the n = 1 part of the
  manuscript-type row β = α·ν. Window sizes: 53,280 conductors at k = 2, about 2.7 million at k = 10.
* **Form.** X_σ(ν) = Σ_c ν(c)x_σ(c) = Σ_m ρ̂_σ(−e₀m)B_m(ν) minus self-term (minus polar part), B_m(ν) = Σ_c ν(c)α(c)γ₂(c)w(c)χ_c(m).
* **Statistic.** t_σ(ν) = |X_σ(ν)|²/Σ_c|x_σ(c)|². Correlation against Cauchy–Schwarz: r_σ(ν)² = t_σ(ν)·r_null,σ²,
  r_null,σ² = Σ_c|x_σ(c)|²/(Σ_m|ρ̂_σ|²·Σ_m|B_m(1)|²). ‖B(ν)‖ is replaced by ‖B(1)‖ for every ν [approximation, not checked
  per target]. Measured r_null·√rows = 1.03–1.06 (`loo`), 0.93–0.98 (`band`) at all 11 Q and three strata.
* **Families.**
  * F1: all characters ψ of (O/π)^× for the two primes π above each rational p ≡ 1 mod 3, 7 ≤ p ≤ 997, ν(c) = ψ(c mod π)
    on the primary generator c. These are finite-order Hecke characters of conductor dividing 3π. 73,176 characters,
    160 of them principal. All characters modulo one π come from one FFT over the discrete logarithm.
  * F1s: the same with the residue labels permuted at random among the window conductors (null with identical counts).
  * F2: ν = α^{−k}N^{−iv}, |k| ≤ 30, v = 1.963·j, |j| ≤ 150, by a 1024 × 4096 two-dimensional FFT (bin phase error
    ≤ 0.09 rad in angle, ≤ 0.12 rad in log N). The pairs (k, j), (−k, j) are tied by complex conjugation of c.
  * F2r: the same twists applied to the Möbius-phased row x·conj(pred)/(αγ₂) (the smoothed Kubota sum of round 2 §4.2).
  * F3: ν(c) = χ_c(y)^j, j = 1..5, y = the 422 primes of norm ≤ 3000 (inert included) and y = 2, λ, −1, ω.
  * ST: 150 random completely multiplicative unimodular functions (uniform phases on the primes of the table). IID: 150 draws of independent phases.
* **Dictionary** (round 1): Z^{−ηb/12} = Q^{−η/80}; η = 1 is δ = 0.0125.

## 3. Validation

| check | result |
|---|---|
| Σ_c x_σ(c) (trivial target, `loo`) against round 2's stored FS − SELF for row type `a`, all k, both parities, both strata | max difference 1.1·10⁻⁸ … 4.4·10⁻⁸ on values of size 0.4–1.1 (single-precision snapshots) |
| aligned row r rebuilt from the conductor side (t at (k, v) = (0, 0) of F2r, ‖B_res‖ from the stored rows) | 0.2310 … 0.2569 (all rows), 0.3059 … 0.3448 (prime to 6), 0.2227 … 0.2485 (not prime to 6): equal to round 2 §4.3 to four digits at all 11 Q |
| F2r at k = 0 against v | 17860, 6807, 365, 3.3, 0.5 at j = 0..4: the Gaussian window transform; 0.0 after `band` |
| shuffled-label control F1s, Q = 30000 | mean 1.0005 ± 0.0012, E t² 2.005, KS 0.0010 |
| independent phases | 0.995 ± 0.025 (150 draws × 12 classes) |

## 4. Results (`agg.log`, `post.log`, `series.log`, `zone.log`, `special.log`)

### 4.1 Family means along the path [MEASURED]

F1 non-principal, mean t − 1 (standard error = larger of scatter over characters and scatter over primes):

| rows, variant | Q = 938 | 1875 | 3750 | 7500 | 15000 | 30000 | se |
|---|---|---|---|---|---|---|---|
| all, `loo` | +0.0002 | −0.0003 | −0.0004 | −0.0006 | −0.0007 | −0.0014 | 0.003–0.004 |
| all, `band` | −0.0003 | −0.0001 | −0.0016 | −0.0007 | +0.0000 | +0.0006 | 0.002–0.005 |
| prime to 6, `loo` | +0.0018 | +0.0002 | +0.0027 | +0.0003 | −0.0002 | +0.0005 | 0.004–0.006 |
| not prime to 6, `loo` | −0.0012 | +0.0000 | −0.0017 | −0.0010 | +0.0009 | −0.0023 | 0.002–0.005 |

Largest |mean t − 1| over the 66 cells (11 Q × 3 strata × 2 variants): 0.0036.

Other families, all rows, `loo`, mean over the 11 path points (path points share rows and overlapping windows, so they
are not independent; single-point errors in brackets):

| family | targets | mean t | at Q = 30000 |
|---|---|---|---|
| F1 orders other than 2, 3, 4, 6, 12 | 71,784 | 0.9994 | 0.9985 (0.0012) |
| F1 order 2 | 160 | 0.976 | 0.934 (0.021); shuffled control 1.030 |
| F1 order 3 | 320 | 1.002 | 1.031 (0.017) |
| F1 order 6 | 320 | 0.986 | 0.971 (0.016) |
| F1 orders 4, 12 | 432 | 1.011 | 1.038 (0.014) |
| F2 α^k N^{iv}, (k, v) ≠ (0, 0) | 18,360 | 1.0025 | 0.9953 (0.0024) |
| F3 primes, j = 1, 5 | 844 | 0.988 | 0.984 (0.011) |
| F3 primes, j = 2, 4 | 844 | 1.003 | 1.028 (0.011) |
| F3 primes, j = 3 | 422 | 0.986 | 0.989 (0.016) |
| random multiplicative (ST) | 150 | 0.991 | 0.992 (0.025) |
| independent phases (IID) | 150 | 1.006 | 0.995 (0.025) |

* No group departs from 1 by more than 3% on the path average. The quadratic characters are the lowest (0.976);
  the same statistic for the quadratic symbols χ_c(π)³ over 422 primes is 0.986. Neither is significant once the
  dependence between path points is allowed for.
* The S-unit twists χ_c(2)^j, χ_c(λ)^j, χ_c(ω)^j (class functions modulo 8 and 9): single values 0.1–3.1, path means
  0.59–1.36, no persistent sign (`special.log`).
* The trivial target (row `a` itself): t = 0.81, 0.41, 0.82, 0.83, 1.37, 0.83, 1.29, 1.66, 1.19, 0.57, 0.32 along the path.
* Mean t by class σ at Q = 30000 (F1, `loo`, all rows): 0.994–1.002 over the 12 classes.

### 4.2 Distribution and supremum [MEASURED]

Q = 30000, all rows. Exp(1) reference: E t² = 2, P(t > 3) = 0.0498, P(t > 6) = 0.00248.

| family, variant | values | E t² | P(t > 3) | P(t > 6) | max t (expected) | KS (5% level) |
|---|---|---|---|---|---|---|
| F1 non-principal, `loo` | 876,192 | 1.994 | 0.0498 | 0.00246 | 13.5 (14.3) | 0.0011 (0.0015) |
| F1 non-principal, `band` | 876,192 | 1.999 | 0.0499 | 0.00246 | 15.5 (14.3) | 0.0015 (0.0015) |
| F1 shuffled, `loo` | 876,192 | 2.005 | 0.0500 | 0.00255 | 14.9 (14.3) | 0.0010 (0.0015) |
| F2, `loo` | 220,320 | 1.983 | 0.0492 | 0.00231 | 13.8 (12.9) | 0.0037 (0.0029) |
| F2, `band` | 220,320 | 2.009 | 0.0504 | 0.00261 | 13.5 (12.9) | 0.0035 (0.0029) |

The KS level for F2 assumes independent values; the conjugation tie halves the count, which puts the level at 0.0041.

Supremum over the 93,486 targets and 12 classes (1,121,832 values per cell; expected maximum of that many Exp(1)
variables 14.5, standard deviation 1.28):

| rows, variant | max t at the 11 Q | r_max at Q = 938 → 30000 | δ of r_max |
|---|---|---|---|
| all, `loo` | 14.6 13.0 14.2 13.3 12.2 13.3 13.8 13.5 14.0 14.2 13.8 | 0.0686 → 0.0117 | 0.501 ± 0.008 |
| all, `band` | 14.2 14.7 14.0 12.1 14.0 12.9 13.5 13.7 13.0 13.3 15.5 | 0.0594 → 0.0117 | 0.489 ± 0.014 |
| prime to 6, `loo` | 14.5 12.8 11.6 16.9 14.5 14.9 15.7 15.0 13.3 16.8 12.9 | 0.0936 → 0.0159 | 0.494 ± 0.019 |
| prime to 6, `band` | 14.7 13.1 14.6 18.3 13.6 14.6 16.9 13.7 14.3 13.8 13.9 | 0.0857 → 0.0157 | 0.490 ± 0.014 |
| not prime to 6, `loo` | 14.5 12.3 12.0 12.4 13.5 15.1 13.1 13.1 13.3 14.3 11.7 | 0.0956 → 0.0151 | 0.505 ± 0.015 |

The largest entry, 18.3, has probability 0.013 for one cell; there are 66 cells. No target is exceptional.

### 4.3 Exponent and coherent bound [MEASURED]

r_rms(Q) = [mean_σ(mean_ν t_σ(ν))·r_null,σ²]^{1/2}; δ from the 11 path points, error by leave-one-point-out jackknife.

| rows | variant | δ, F1 (all Q) | δ, F1 (Q ≥ 3750) | δ, F2 | δ, F3 | r_rms at Q = 30000 | 1/√rows |
|---|---|---|---|---|---|---|---|
| all | `loo` | 0.5063 ± 0.0029 | 0.5045 ± 0.0024 | 0.5061 ± 0.0032 | 0.5073 ± 0.0038 | 0.00315 | 0.00304 |
| all | `band` | 0.4925 ± 0.0034 | 0.4933 ± 0.0028 | 0.4919 ± 0.0037 | 0.4935 ± 0.0046 | 0.00298 | 0.00304 |
| prime to 6 | `loo` | 0.5014 ± 0.0034 | 0.5055 ± 0.0025 | 0.5002 ± 0.0038 | 0.5047 ± 0.0044 | 0.00442 | 0.00429 |
| not prime to 6 | `loo` | 0.5041 ± 0.0016 | 0.4976 ± 0.0054 | 0.5030 ± 0.0015 | 0.5036 ± 0.0019 | 0.00441 | 0.00430 |

* `band` values lie below 0.5 because the cell means remove a larger fraction of the variance at small Q
  (r_null·√rows rises from 0.93 to 0.98 along the path). This is a bias of the projection, about 0.01 in δ.
* The nominal reading 80δ ≈ 40 has no meaning inside (0, 1]; the content is that the form is at 1/√rows.
* Coherent component: if every target carried a common non-decaying part a, then mean t − 1 = (a/r_null)². With
  mean t − 1 + 2se as the 95% bound: a ≤ 0.00136, 0.00067, 0.00043, 0.00037, 0.00021 at Q = 938, 3750, 7500, 15000,
  30000 (all rows, `loo`); 0.00025 at Q = 30000 for `band`; 0.00042 on rows prime to 6. The bound falls like
  Q^{−1/2} because it is the noise of the family mean; it is not a measured decay of a.
* What is and is not separated: "η = 0 with relative constant ≥ 2.5·10⁻⁴ for the family mean, or ≥ 0.012 for any
  single target" is excluded at Q = 30000. "η = 0 with a smaller constant" and "η = 1" (r ∝ Q^{−0.0125}) are both
  compatible with the data, as is any larger saving. The estimator's signal fraction (0.63–0.83) weakens these
  bounds by a factor of at most 1.26.

### 4.4 Polar share of the conductor-side energy [MEASURED]

share = 1 − Σ_c|x^{band}|²/Σ_c|x^{loo}|² (the part of Σ_c w²|S_loo(c)|² that is cell-constant times pred):

| rows | Q = 938 | 1875 | 3750 | 7500 | 15000 | 30000 | slope in log Q |
|---|---|---|---|---|---|---|---|
| all | 0.187 | 0.169 | 0.145 | 0.129 | 0.117 | 0.108 | −0.161 ± 0.006 |
| prime to 6 | 0.155 | 0.141 | 0.115 | 0.100 | 0.086 | 0.076 | −0.213 ± 0.005 |
| not prime to 6 | 0.131 | 0.112 | 0.095 | 0.086 | 0.078 | 0.073 | −0.168 ± 0.013 |

* Theorem P (round 2): |P(c)|² ∝ Q^{5/3}N(c)^{−2/3}; against Σ|ρ|² ∝ Q^{0.87} on N(c) = Q^{1.4} this is Q^{−0.13}
  (Q^{−0.10} with exponent 5/6). The measured slopes are steeper by 0.03–0.08; part of that is the cell-mean bias at
  small Q (a cell holds about 30 conductors at k = 0).
* So at the manuscript geometry the polar law carries about a tenth of the energy of each twisted sum and the share
  decreases slowly. For a manuscript-type row it enters as a Möbius sum and contributes nothing visible: the
  tables of §4.1 are the same for `loo` and `band`.

### 4.5 Low-frequency zone of the Möbius-phased row [MEASURED; reading HEURISTIC] (`zone.log`)

Mean t of the Möbius-phased row twisted by α^{−k}N^{−iv} (F2r), all rows, variant `band`; columns |j| (v = 1.963 j):

| Q | \|k\| | j = 0 | 1 | 2 | 3–4 | 5–8 | 9–16 | 17–32 | 33–64 | 65–150 |
|---|---|---|---|---|---|---|---|---|---|---|
| 938 | 1 | 0.49 | 0.72 | 0.77 | 0.85 | 0.86 | 1.11 | 1.04 | 0.94 | 0.93 |
| 938 | 4–6 | 1.12 | 0.99 | 0.96 | 1.06 | 0.96 | 1.07 | 0.94 | 1.01 | 1.02 |
| 7500 | 1 | 0.40 | 0.49 | 0.81 | 0.85 | 0.90 | 0.97 | 0.91 | 1.07 | 1.07 |
| 7500 | 4–6 | 0.45 | 0.52 | 0.77 | 0.88 | 0.87 | 0.95 | 1.04 | 1.02 | 0.99 |
| 15000 | 1 | 0.24 | 0.40 | 0.65 | 0.74 | 0.79 | 0.83 | 0.96 | 0.92 | 1.00 |
| 30000 | 1 | 0.36 | 0.51 | 0.74 | 0.67 | 0.82 | 1.02 | 1.06 | 1.02 | 1.00 |
| 30000 | 2–3 | 0.42 | 0.53 | 0.71 | 0.73 | 1.05 | 0.93 | 0.93 | 0.98 | 1.00 |
| 30000 | 4–6 | 0.45 | 0.54 | 0.70 | 0.84 | 0.92 | 1.01 | 0.90 | 1.00 | 0.96 |
| 30000 | 7–12 | 0.81 | 0.77 | 0.73 | 0.74 | 0.89 | 0.91 | 1.02 | 1.01 | 1.02 |
| 30000 | 13–20 | 0.96 | 0.96 | 0.91 | 0.93 | 0.89 | 0.97 | 1.06 | 1.01 | 0.98 |

* The same table for manuscript-type rows (F2) has no zone: entries 0.6–1.8 with no pattern in (k, j) or Q, apart
  from the single cell (0, 0), which is row `a` itself (§4.1).
* Size of the effect: at Q = 30000 the cell 1 ≤ |k| ≤ 6, |j| ≤ 1 holds 36 targets (18 after the conjugation tie) × 12
  classes with mean 0.46. The zone is present at every Q; its k-range grows from |k| ≤ 3 at Q = 938 to |k| ≤ 12 at
  Q = 30000.
* Reading [HEURISTIC]: the Möbius-phased row is conj Σ_c w(c)g̃₁(−e₀m, c) (round 2 §4.2). Twisted by a
  Grössencharacter of small frequency this is a smooth partial sum of a twisted Kubota series, which is entire
  and has a functional equation in the modulus variable; a smooth sum longer than the square root of the analytic
  conductor is shorter than a random sum. The zone is where R exceeds that length; its growth in k with Q is
  consistent with a conductor that is polynomial in (N(m), |k|, |v|). The floor 0.25–0.5 instead of 0 is not
  explained (candidates: the cut of the window at |log| ≤ 1.6, estimator noise, sharp cutoff in m). No functional
  equation is derived or used here.
* Relevance: these are the Type-I objects of `../r2-tro6-type12-split` §5 at level 1 (Rankin–Selberg sums of θ₆
  against a twisted conjugate Kubota sum). They are at or below the random level at every (k, v) ≠ (0, 0). The
  Möbius factor of a manuscript-type row removes this structure.

## 5. Mechanism and conjecture

**Mechanism read from the data.** For manuscript-type rows there is no sign pattern and no class dependence to
report. The conductor-side vector x_σ(c) = α(c)γ₂(c)w(c)R_σ(c), R_σ(c) the remainder of the twisted first moment after
the polar part, pairs with every tested multiplicative target as a vector of independent phases does: the statistic
has the exponential law to the resolution of 10⁶ values, for Hecke characters and for random multiplicative
functions alike. The cancellation is in two independent layers: each twisted sum R_σ(c) is of size (Σ_m|ρ|²)^{1/2}
(square root in m; r_null·√rows = 0.93–1.06), and the sum over c of length Q^{1.4} adds these with random phases
(square root in c; t ∼ Exp(1)). The only coherent directions found are the polar phase pred(c) (rank one per class
cell, §4.4) and, for Möbius-phased rows, smooth twists (§4.5).

**Conjecture C√ [OPEN; supported by §4 for the toy rows only].** Let a_c be a smooth weight supported on N(c) ≍ D,
Q^{1/2} ≤ D ≤ Q^{3/2}, and R_σ(c; Q) = T_σ(c; 1, 1) − P_σ(c) in the notation of `../r2-tro6-polar-theorem` §4.
* (C√-1, mean square) Σ_c|a_c|²|R_σ(c; Q)|² = (κ + o(1))·Σ_c|a_c|²·Σ_m|W(N(m)/Q)ρ^♮_σ(−e₀m)|², with κ bounded above and below.
  Measured: κ ∈ [0.86, 1.12] (square of r_null·√rows, `band` and `loo`).
* (C√-2, linear forms) for every Hecke character ν of F of conductor q and frequency (k, v):
  |Σ_c ν(c)α(c)γ₂(c)a_cR_σ(c; Q)|² ≪_ε (qQ(1 + |k| + |v|))^ε·Σ_c|a_c|²|R_σ(c; Q)|².
  Measured: the left side divided by the right-hand sum has mean 1.000 ± 0.006 and maximum ≤ 18.3 over 93,486
  targets, q ≤ 997, |k| ≤ 30, |v| ≤ 295, D = Q^{1.4}, Q ≤ 30000.
* C√-1 and C√-2 give |Σ_cν(c)α(c)γ₂(c)a_cR_σ(c)| ≪ Q^{−1/2+ε}·M_σ^{1/2}‖B‖ when ‖B‖² ≍ Q·Σ|a_c|² [HEURISTIC, as in
  round 2], which is (RB_η) of the polar-theorem note for every η ≤ 1 with a margin of Q^{1/2−1/80}.
* C√-2 cannot hold for arbitrary bounded ν: ν(c) = conj(x_σ(c))/|x_σ(c)| gives the full sum. It is a statement about
  targets of low complexity. The data do not show which property of ν is needed: random multiplicative and
  independent random phases behave as Hecke characters do.
* What C√ does not cover: Theorem D of the sextic-theta notes ties the full form to the zero probe of the target.
  The targets here are characters of small conductor at small height, for which no zero off the critical line is
  known or expected in the relevant range, so the regime in which TRO6^♮ could fail is not sampled.
* No abscissa follows from this note. The price list of `../bypass-78` (TRO6^♮ with η = 0.1 gives 0.8741) is
  conditional on TRO6^♮ and on the unrefereed inputs named at the top.

## 6. DH control

* No statement here concerns zeros, so no step has to fail for Davenport–Heilbronn.
* For f_DH = c₁L(s, ψ) + c₂L(s, ψ̄) the row is c₁B(ψ) + c₂B(ψ̄) and the form is linear in the row. Every pair (ψ, ψ̄)
  of F1 is at the null, so every such combination is at the null; this follows from linearity and adds no information.
* The measurement does not separate Euler from non-Euler targets: random multiplicative functions, independent
  phases and Hecke characters have the same law. The Euler product of the target enters TRO6^♮ only through the
  polar part (Σμ(c)ϑ(c)K(c) = partial sum of 1/L) and through Theorem D. C√ is target-blind and, if true, would be
  a statement about θ₆ and Gauss sums alone, in the same way as (PS-U).
* Backward heat family and sign twist: not applicable (no kernel, no Λ(n) in the measured objects).

## 7. Verdict

* **MEASURED:** 93,486 targets at R = Q^{1.4}, Q ≤ 30000: mean t = 1.000 ± 0.006 at every Q; exponential law; no
  exceptional target; δ = 0.506 ± 0.003 (0.493 ± 0.003 after polar removal); sup over targets δ = 0.501 ± 0.008.
* **MEASURED:** coherent component of the family ≤ 2.1·10⁻⁴–2.5·10⁻⁴ of Cauchy–Schwarz at Q = 30000 (95%).
* **MEASURED:** polar share of the conductor-side energy 0.19 → 0.11, slope −0.16.
* **MEASURED:** Möbius-phased rows with smooth twists are below the random level in a zone of small (k, v).
* **Not established:** any η > 0; C√; whether the limit coefficient ρ^♮ (estimator cutoff → ∞) behaves as ρ̂ does.
* TRO6^♮ is not shown false in any direction tested, and the data give no reason to expect failure for generic
  targets. They give no information on targets with zeros near the 7/8 line. No change to θ, B♭ or any Λ value.

## 8. Three weakest steps

1. **The object measured is the estimator ρ̂, with the row conductors inside its own range.** ρ̂ is a linear form in
   g̃(−e₀m, n), 10³ < N(n) ≤ 10⁷, with noise share 0.17–0.37; every conductor of every window lies in that range, the
   top windows reach 9.2·10⁶, and all values depend on the leave-one-out correction (self-terms of the correction
   terms ρ_cor are not removed). The statements are therefore about a trilinear sum of Gauss sums and characters at
   finite cutoff. Round 2's referee showed first moments of ρ̂ differ from the limit by factors up to 3.6. Whether
   randomness of the remainder survives the limit is not tested.
2. **Toy rows and a bounded family.** S′ = ∅, no ξ, sharp cutoff in m, Gaussian window in c, the n = 1 part only
   (no A = cn³, no k⁶ diagonal), targets on primary generators. Conductors q ≤ 997 = Q^{0.67} and |v| ≤ 295, while
   TRO6^♮ needs uniformity polynomial in (1 + |v|) and in the manuscript's ν_σθ. ‖B(ν)‖ = ‖B(1)‖ is assumed for the
   conversion to r. The null is a statement about phases in c; a target whose row norm ‖B(ν)‖ is itself abnormally
   small would be missed by r and seen only in t.
3. **Statistics.** Errors assume near-independence across characters; the 12 classes are tied in pairs, F2 by
   conjugation, and the 11 path points share rows and overlapping windows (path averages in §4.1 carry no error
   bar for that reason). The coherent bound assumes a component common to the family; a component confined to a
   sparse set of targets is limited only by the supremum (0.012). No numerics at this size can separate η = 0 with
   a constant below 2·10⁻⁴ from η > 0. The reading of §4.5 as a functional equation is not derived.

## 9. Reproduction

Motherbox, `~/rh-push/r3-nonpolar-numerics/`, venv `~/rh-push/venv`, 11 single-thread processes, peak 4.4 GB each.
Requires `~/rh-push/r2-tro6-nonpolar-scale/out/` and its `sextic/` table (read-only).

| step | command | time |
|---|---|---|
| family scan, one path point | `python fam.py k out` (k = 0..10; `sx/` holds copies of `alib.py`, `zomega.py`) | 3 min (k = 0) to 27 min (k = 10) |
| row-side norms | `python norms.py` | 1 min |
| summary tables | `python agg.py out > out/agg.log` (writes `out/agg.json`) | 2 min |
| control, polar share, slopes, supremum | `python post.py out` | 1 min |
| zone table | `python zone.py out` | 1 min |
| path series, S-unit twists (local) | `python series.py agg.json`; inline snippet → `special.log` | seconds |

Local files: `fam.py`, `norms.py`, `agg.py`, `post.py`, `zone.py`, `series.py`, `agg.log`, `agg.json`, `post.log`,
`zone.log`, `series.log`, `special.log`, `fam_10.log`, `norms.npz`.
