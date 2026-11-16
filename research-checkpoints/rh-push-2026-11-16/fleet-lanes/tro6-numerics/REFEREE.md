# REFEREE: tro6-numerics/RESULT.md

Adversarial referee pass, 2026-11-16. Scripts used: `/tmp/ref_tro6/{chk,law,al,st}.py` (not kept in the repo), run
on the author's `rows_full.npz`, `E.npy`, `data/conductors.npz` and `tmp/sextic/data/sf_1e7.npz`. Rows were not
regenerated (the generation run is 17 min); the inputs to the analysis were checked independently where stated.

**Verdict: the claim does not hold as worded.** The "partial result, measurements only, TRO6-natural open" verdict
is correct, and the one PROVED step is confirmed. Two of the four MEASURED statements need correction:
item 2 (the class label of the law is wrong on the rows prime to 6) and item 3 ("no decay" / "Cauchy-Schwarz
attained" / "eta = 0 is sharp" is not resolved by the data at the scale the note's own dictionary requires).

## 1. What was confirmed

| check | result |
|---|---|
| Row count, brute force over the lattice | 11,628 rows with 0 < N(m) <= 3199. Agrees. |
| Residue symbols in `E.npy`, own modular-power code, 300 prime conductors x 40 rows | 0 mismatches of 12,000. |
| Multiplicativity of `E` in c on composite conductors | 0 mismatches of 4,600. |
| Table gamma_1, gamma_2 against direct summation (40 smallest prime conductors; 12 two-prime conductors up to norm 2*10^4; cases differ from the author's self-test) | max diff 9.1e-10, 1.2e-9. |
| gamma_1 gamma_2 = mu alpha G on 28,224 conductors; G of finite order | diff 3.7e-9; (gamma_1 gamma_2 / mu alpha)^12 = 1 to 3.5e-8, order does not divide 6. |
| **[PROVED step, section 3.3]** chi_c(-1) depends only on the class of c mod 4 | Confirmed: chi_c(-1) = (-1)^((N(c)-1)/6) on all conductors; constant on each of the 12 classes. |
| **[PROVED step]** rho_sigma(-y) = chi_sigma(-1) rho_sigma(y) | Holds in the data to 1.1e-14 on all rows and classes. Term-by-term for the stripped estimator, and for the complete coefficient because (ab-1)/6 = (a-1)/6 + (b-1)/6 mod 2 for a, b = 1 mod 6. Null value z^2 = 2 follows. |
| Author's self-test of the complete Gauss sums | Reruns: 35 comparisons, 3.16e-8. |
| Phase law, N(c) <= 1000 (no estimator self-term), on disjoint row subsets | N(m) <= 1600: 0.9994 / 0.9987 / 0.9952 / 0.9857. N(m) in (1600, 3199]: 0.9989 / 0.9934 / 0.9942 / 0.9666. Random halves: 0.983-0.999. |
| Controls for the phase law | conj(gamma_1): 0.24 / 0.42 / 0.05 / 0.03. gamma_1 without chi_c(-e0): 0.36 / 0.36 / 0.11 / 0.03. gamma_2: 0.16 / 0.20 / 0.01 / 0.06. Shuffled within band: 0.32 / 0.27 / 0.07 / 0.15. Re(S conj pred) > 0 for all 281 conductors. |
| Stripped coefficient alone | Same alignment (1.0000 / 0.9986 / 0.9985 / 0.9924): the law is not produced by the correction term. |

The phase gamma_1(c) conj chi_c(-e0) with K > 0 is a real and reproducible feature of the data.

Not re-derived: proof note (3.9) itself (cited as PROVED elsewhere; only its Gauss-sum ingredients were checked here)
and the WLS estimator weights `wt` used for the leave-one-out correction (the referee scripts reuse the author's
formula). Bands with N(c) > 1000 therefore rest on the author's correction.

## 2. Errors and gaps

### E1. Item 2: "sigma = class(c)" is false on rows prime to 6

Split of the generic rows, z^2 at sigma = class(c), bands [2,30], [31,100], [101,300], [301,1000]:

| rows | count | z^2 by band |
|---|---|---|
| all generic (as in RESULT) | 11,454 | 142.6 / 85.2 / 66.7 / 29.5 |
| prime to 6 | 5,808 | 4.10 / 0.82 / 4.63 / 3.87 (null 2) |
| not prime to 6 | 5,646 | 272.1 / 120.7 / 74.8 / 30.4 |

On rows prime to 6 the cell sigma = class(c) is close to the null (alignment 0.985 / 0.693 / 0.971 / 0.921). The
response sits in one other class sigma'(c), with z^2 = 24-34 and alignment 0.98-0.99 against the same phase. In the
mod-4 class indices of `zomega`, the pairing is the involution 0<->1, 2<->8, 3<->11, 4<->10, 5<->9, 6<->7. On rows not
prime to 6 the cell sigma = class(c) carries z^2 = 34-64 and the others 1-5.

Consequences:
* The law as stated in section 0 item 2, section 3.3 and section 6 holds for the 49% of rows not prime to 6. The table
  of section 3.3 is an average dominated by those rows. On the rows with xi(m) != 0 (the manuscript rows, by the
  note's own label "prime to 6 (xi(m) != 0)") the resonant class is sigma'(c), not class(c).
* The "diagonal" of sections 3.4 and 4.1, Sum over c in sigma, is not the main term on rows prime to 6. The numbers
  "diagonal 0.112, other classes 0.084, also coherent" mix two strata with different resonant classes. The split
  "diagonal against off-diagonal" proposed in section 4.4 has to be made per stratum of (v_2(m), v_lambda(m)).
* The Moebius-sum reading survives with the class relabelled, since the phase is unchanged. The statement
  "other classes also respond, within the block chi_sigma(-1) = chi_c(-1)" in section 3.3 is the visible trace of this.
* RESULT section 3.5 lists sub-family tests and reports no stratum dependence of the law. This is a structured
  exception the note was asked to look for and did not report.

### E2. Item 3: "no decay", "Cauchy-Schwarz attained", "eta = 0 is sharp" are not resolved

Section 2 of RESULT states that full removal (eta = 1) is delta = 0.0125 and that the numerics cannot resolve eta
inside (0, 1). Section 4 item 2 then concludes "eta = 0 is sharp" from three values 0.1819, 0.1825, 0.1813. Row
bootstrap (100 resamples) of the aligned row, leave-one-out, generic rows:

| path | r | delta | bootstrap sd | 95% |
|---|---|---|---|---|
| quoted: (Q, R) = (200, 1e3), (800, 3e3), (3199, 1e4) | 0.1819, 0.1825, 0.1813 | 0.001 | 0.019 | [-0.026, 0.044] |
| (100, 1e3), (400, 3e3), (1600, 1e4) | 0.2245, 0.2093, 0.1986 | 0.044 | 0.022 | [0.017, 0.094] |
| R = 10 Q: (100, 1e3) ... (3000, 3e4) | 0.2245, 0.2139, 0.2192, 0.2288 | -0.007 | 0.017 | [-0.033, 0.033] |
| R = 3.2 Q | 0.1686, 0.178, 0.1813 | -0.031 | 0.017 | [-0.056, 0.010] |
| fixed R = 1e4, Q >= 200 | 0.2436 ... 0.1813 | 0.115 | 0.010 | [0.097, 0.140] |
| fixed R = 3e4, Q >= 200 (new) | 0.2665 ... 0.2270 | 0.055 | 0.010 | [0.035, 0.074] |

* Every interval on a path R proportional to Q contains both delta = 0 and delta = 0.0125. The data cannot separate
  eta = 0 from eta = 1 for the aligned row. "No decay" is one of three or four possible diagonals; the parallel one
  starting at Q = 100 decays.
* At fixed R the decay is significant (delta = 0.115 at R = 1e4, 0.055 at R = 3e4), and 80 delta > 1 in both cases.
  By the note's own dictionary these are nominally eta = 1, the same reading the note gives to the target-free rows.
* The manuscript scale is R about Q^1.4, not R proportional to Q; no measured path follows it (R <= 3e4 here at
  Q = 3199 against 8e4).
* The row is not saturated at R = 1e4: R = 3e4 gives r = 0.227 at Q = 3199, and on rows prime to 6 r = 0.29.
  "A factor of about 0.18" is a property of the window, not a constant of the problem.
* The aligned row is beta gamma_2 = conj(gamma_1) chi_c(-e0), which is the truncated character expansion of rho
  that item 2 describes (span table: 28% of the norm captured by 236 characters per class). A large r for this row
  restates the law; it is not independent evidence, and it is not a statement about bounded multiplicative-type
  coefficients in general.

What survives: a Moebius-phased row has r = 0.15-0.30, which is 16-32 times 1/sqrt(rows), and |delta| <= 0.14 on
every path measured. That excludes square-root cancellation for this row. It does not establish delta = 0.

### E3. Exponent labels

The task-level claim "K^2 ~ Q^0.82 N(c)^-0.60" is the exponent of the normalised (z^2 - 2), not of K^2 = |S|^2.
With Sum |rho|^2 ~ Q^0.866 the fit gives |S|^2 ~ Q^1.69 N(c)^-0.60. RESULT section 0 states it correctly; the
headline does not. The fit is not a power law (a from 0.56 to 1.05 by band, acknowledged), and after E1 it is a
mixture of two strata with different amplitudes, so a and b have no clean meaning for either stratum.

### E4. Statistics, minor

* delta = 0.506 with 95% [0.490, 0.551]: the point estimate sits one sd above the lower edge of its own bootstrap
  interval. Resampling rows with replacement raises the noise floor of r unevenly across Q. The conclusion
  delta near 1/2, delta = 0 excluded, is unaffected.
* "Nominal eta = min(1, 80 delta) = 1" has no content for TRO6-natural (the note says so). It should not appear as a
  fitted eta.
* The 216 pairs are tied by the sign symmetry and by shared conductors; T-values near 1 are not 216 independent
  tests (acknowledged in section 7).
* Square-root cancellation of the manuscript-type diagonal is measured for N_eff = 38-368 only, on toy rows without
  target, and with the stratum-mixed diagonal of E1.

## 3. Required controls

* **DH control.** Nothing measured is a statement about zeros, so no step has to fail for Davenport-Heilbronn.
  Section 5's account (the form is linear in the row; 1/L appears only for a completely multiplicative target) is
  correct as a statement of where the Euler product would enter in section 4 item 1. That item is HEURISTIC and
  extrapolated, and is labelled so.
* **RH.** No step assumes RH or a zero-free region.
* **Verified height.** Not used; nothing restates it.
* **Obstruction.** Section 4 item 2 presents an obstruction ("no argument that treats beta as an arbitrary bounded
  sequence can give eta > 0"). By E2 it is not established at the resolution eta requires. A way around it, if it is
  real: it concerns rows carrying mu(c) times the conjugate Gauss phase, and the note's own twists by a character
  mod 9 or by alpha^6 remove the correlation (r = 0.005-0.022), so any hypothesis that fixes the Hecke type of beta
  away from the aligned one is not blocked by this measurement.

## 4. Surviving claim

MEASURED, N(m) <= 3199, 11,628 rows, inputs independently checked:
1. Target-free toy cubic rows correlate with rho-natural at the random level, delta about 0.5, delta = 0 excluded.
2. Sum_m rho_sigma(-e0 m) chi_c(m) has phase gamma_1(c) conj chi_c(-e0) with positive amplitude (alignment
   0.97-1.00 for N(c) <= 1000 on disjoint row halves; controls 0.01-0.42). The resonant class is class(c) on rows
   not prime to 6 and a different class sigma'(c) on rows prime to 6. Amplitude exponents are not determined.
3. A row with coefficients mu conj(alpha G) chi(-e0) has r = 0.15-0.30, far above the random level, with
   |delta| <= 0.14. Whether delta = 0 is not resolved; eta = 0 and eta = 1 are both compatible.
4. rho-natural is about rho-stripped times prod(1 + kappa/N(p)), kappa = 0.88-1.02 (not re-derived; cos 0.997
   reproduced from the log).

OPEN: TRO6-natural for every eta > 0. No change to theta or Lambda.
