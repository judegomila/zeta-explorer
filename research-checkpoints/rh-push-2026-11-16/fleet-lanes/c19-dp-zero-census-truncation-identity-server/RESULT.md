# c19-dp-zero-census-truncation-identity-server: zeros of the partial sums D_P; Theorem A in ball arithmetic; right-zero census; joint prime-phase statistics

Internal working note, 2026-11-19, campaign round 19 (attack, kind: compute; support lane for c19-u4-joint-prime-phase-quadratic-dp-zeros).
RH is open. No statement about zeros of zeta is made; every zero below is a zero of a partial sum D_P(s) = sum_{n <= P} a_n n^(-s). NO QED.
Labels: CERTIFIED (ball arithmetic, complete zero list by winding number) / PROVED (argument written here) / CLASSICAL (recalled, not opened) / MEASURED (float64) / POST-HOC (analysis chosen after data were seen) / OPEN.

**Verdict: partial result. Theorem A of c18-tz-one-sided-bound-fe-reserve-bridge is certified in a corrected form (one named discrepancy: the term log abs(a_P)). Completion C1 is false at every cell (MEASURED, exact Littlewood identity to 6e-8). Run C has no survivor: the one statistic that separates zeta from the sign chains (depth-phase covariance at theta' = 1) is shared by ZQ and is explained by the functional equation at the Nyquist length, zeta(beta) = chi(beta)/2 at the right zeros of D_P (MEASURED). Flags R1 to R4 all false.**

1. (CERTIFIED at fixed T; limit T -> infinity extrapolated.) For six series (zeta coefficients at P = 12, 20, 30; three non-multiplicative series with a_1 = 1), all zeros with abs(Im) < T, T up to 6400 (up to 6928 zeros), were enclosed in balls of radius 2^-170 with a certified count. The identity that holds is
       -2 Re <h, A_P h> = -u norm(h)^2 + lim_T sum_{abs(Im beta) < T} <h, kappa_beta h>      (V0)
   for every a_P != 0. The printed form of c18 Theorem A, with -u + log abs(a_P), is off by exactly log abs(a_P) norm(h)^2 when a_P != 1 (named discrepancy D-A1; it does not touch c18 Lemma 1, which has a_P = 1). The truncation tail is (u - 2 log abs(a_P))/(pi T), not u/(pi T).
2. (PROVED from V0, CERTIFIED numerically.) A regularised form with tail of order T^-3:
       -2 Re <h, A_P h> = sum_{abs(Im beta) < T} [ <h, kappa_beta h> + 2 norm(h)^2/(beta - 1/2) ] + 2 norm(h)^2 (D_P'/D_P)(1/2) + O(T^-3).
   Residual at T = 6400: 7e-12 to 3e-10 (ball radius 1e-49), equal to the predicted (norm(h')^2/norm(h)^2)(u - 2 log abs(a_P))/(pi T^3) within 1 percent.
3. (MEASURED, 2340 windows, 200300 right zeros.) Every class at every cell has zeros of D_P right of the line: at least 10 per window of height 100, mass S = sum (Re beta - 1/2)/100 between 0.015 and 0.65 per unit height, and S = L + E (Littlewood, exact edge term) with residual at most 6.2e-8. Completion C1 is false in the whole range t = 1e4 to 1e8, theta' = 0.5 to 1.
4. (MEASURED; expected CLASSICAL, not opened.) At theta' = 1 (P = floor(t/2 pi)) every right zero beta of D_P for zeta satisfies zeta(beta)/chi(beta) = 1/2 within 0.0015 at t = 1e8 (0.003 at 3e7, 0.015 at 1e6): the n = 1 term of the reflected sum enters with the Fresnel weight 1/2. The weight moves to 1 as (gamma/2 pi - P)/sqrt(t/2 pi) grows (0.54 - 0.04i at 0.055; 0.98 - 0.24i at 0.56; 1.00 at 5.5). At theta' = 0.75 and 0.5 the ratio is scattered (abs from 0.006 to 8.5): no relation.
5. (MEASURED.) Run C. Pair covariance Q1: no class separation. Depth-phase covariance Q2 at theta' = 1: zeta deviates from the Haar ensemble on both held-out heights (Z8 = 4.0 at 3e5, 4.2 at 3e7) and at 1e8 (6.0); sign chains conform (0 or 1 of 24 beyond 2.5). The pre-registered survivor rule is not met (two clauses fail), and at equal power ZQ deviates the same way (Z8 = 6.5, 5.6, 3.1). Q2 reads item 4, a consequence of the functional equation, not multiplicativity.

---

## 1. Plan, sources, order of work

Read: BRIEF to the end; c18-tz-one-sided-bound-fe-reserve-bridge RESULT.md (Theorem A, Lemma 1, completions C0 to C4, Proposition Z, controls table, weakest step 2) and FOR_NUMERICS_LANE.md items 2 and 3; c18-tz-band-completion-controls-server PREREG.md (class conventions: T-NR (3, 2.2), chain seeding offset 121000); c18-exact-relation-rigidity-klein-spinor (HQ2 coefficients); OBSTRUCTION_MAP section 2 (controls DH, EA, NR, ZQ, WT) and row P58.

`PREREG.md` was written before any code ran: thresholds, one prediction per part, held-out heights 3e5 and 3e7, survivor rule. Decisive first test: Run A on N5 (a_P = 0.5), because the paper derivation here (D = 1 + a 2^(-s), where the symmetric zero sum is (L/2) tanh) predicted that the term log abs(a_P) of Theorem A is not there. It was run first (local smoke test, then the server) and decided the point.

Deviations from PREREG, all stated where they matter: (i) Run A was extended to T = 1600, 3200, 6400; (ii) the cells at t = 1e4, 3e5, 1e6 of Runs B/C were computed on the Mac (through memcap, 8 GB; float64 phases, phase error below 2e-9), the cells at 3e7 and 1e8 on the server (80-bit phases), because the server was oversubscribed (load 120 on 48 cores; 8 allotted cores gave about 5); (iii) an extra run put the five single classes on 8 windows (not pre-registered); (iv) a post-hoc permutation-corrected analysis and the check of item 4 were added after the first two cells were read.

Server units (all through rhrun, all finished or stopped by this lane; none left running): rh-c19dpA-smoke-1120063643 (stopped), rh-c19dpA-N5/-zeta12/-zeta20/-zeta30-1120063851 (1 core, 3 GB each; 30 to 352 s), rh-c19dpBC-1120064229 (8 cores, 12 GB; stopped by this lane after 396 jobs and resumed as) rh-c19dpBC2-1120070356 (519 s), rh-c19dpBCx-1120071302 (330 s). Peak memory 5.3 GB. No GPU use.

## 2. Run A: Theorem A in ball arithmetic

### 2.1 Method (`runA.py`, python-flint 0.9, 256 bits for zeros and forms, 128 bits for winding)

- h(s) = sin^4(pi s/u) e^(i tau s), tau in {0, 7.3}: a trigonometric polynomial, so <h, C_a h>, <h, kappa_w h>, norm(h)^2, norm(h')^2 are closed forms in exp; no quadrature.
- Strip: sigma_R with sum_{n >= 2} abs(a_n) n^(-sigma_R) < 1 and sigma_L with sum_{n < P} abs(a_n/a_P)(P/n)^(sigma_L) < 1, both certified in balls; both conditions are monotone, so all zeros lie in sigma_L < Re < sigma_R.
- Count: horizontal cuts at Im = -0.3, 0.3, 10, 20, ..., T. The change of arg D_P along each boundary segment is certified by the mean-value enclosure D(mid) + D'(box)(box - mid): if this rectangle excludes 0, the image of the segment lies in a half-plane and the change of argument is the principal Arg of D(z1)/D(z0). The sum over a slab boundary divided by 2 pi is a ball containing exactly one integer.
- Zeros: float Newton from a grid, refined at 256 bits, then complex interval Newton: N = z - D(z)/D'(B) inside the interior of B (radius 2^-170) gives exactly one zero in B. In each slab the number of pairwise disjoint certified balls, none meeting a cut, equals the certified winding number. Real coefficients: zeros with Im >= 0.3 are counted twice. All slabs matched on the first attempt for all six series.
- The sum over abs(Im beta) < T is then a ball. What is not enclosed: the limit T -> infinity (no rigorous tail bound was written); it is supported by two tail laws over T = 100 to 6400.

### 2.2 Results (`runA_*.json`; full rows in `logs/rh-c19dpA-*.log`)

R_V0(T) = (left side - right side of V0 truncated at T)/norm(h)^2; R_reg the same for the regularised form. Ball radii of every entry are below 2e-49. tau = 0 shown; tau = 7.3 agrees to the digits shown in the ratio columns.

| series | P | a_P | strip | zeros, abs(Im) < 6400 | R_V0 T pi/(u - 2 log abs a_P) at T = 400, 800, 1600, 3200, 6400 | R_reg at T = 6400 | R_reg T^3/prediction at 800, 6400 | log abs(a_P) (error of the printed form V1) |
|---|---|---|---|---|---|---|---|---|
| zeta12 | 12 | 1 | (-7.5, 1.75) | 5062 | 0.954, 1.008, 1.007, 1.004, 0.999 | 1.1e-11 | 1.023, 0.996 | 0 |
| zeta20 | 20 | 1 | (-13.0, 1.75) | 6102 | 1.041, 0.971, 1.001, 0.999, 1.003 | 9.2e-12 | 0.917, 1.009 | 0 |
| zeta30 | 30 | 1 | (-20.0, 1.75) | 6928 | 1.028, 1.026, 0.982, 1.004, 1.003 | 8.1e-12 | 1.077, 1.009 | 0 |
| N5 = (1, 1, -1, 2, 0.5) | 5 | 0.5 | (-6.75, 1.5) | 3278 | 1.014, 1.016, 0.996, 0.997, 1.001 | 3.2e-11 | 1.049, 1.004 | -0.6931 |
| N12 | 12 | 1.5 | (-5.25, 1.75) | 5062 | 0.981, 1.003, 1.004, 1.000, 0.999 | 7.4e-12 | 1.008, 0.998 | +0.4055 |
| DH12 (Davenport-Heilbronn, P = 12) | 12 | 0.2841 | (-15.25, 1.0) | 5064 | 0.960, 1.005, 1.004, 1.003, 0.997 | 2.2e-11 | 1.014, 0.992 | -1.2585 |

Zero counts agree with T u/pi within 2 at every T. Mean real part of the zeros below T = 6400: -0.0007, 0.0014, 0.0013 (a_P = 1), -0.4296 (N5; log abs(a_P)/u = -0.4307), 0.1629 (N12; 0.1632), -0.5088 (DH12; -0.5065).

Pre-registered predictions.
- P-A1 holds. V0 has residual tending to 0 for all six series; the printed form V1 has residual R_V0 - log abs(a_P), which tends to 0.6931, -0.4055, 1.2585 for N5, N12, DH12.
- P-A2 (ratio within 5 percent at T = 400 and closer at T = 800): the 5 percent bound holds for all six. The clause "closer at 800" fails for N5 (1.014 then 1.016). The ratio is not monotone: its deviation from 1 follows the fluctuation of the mean real part of the zeros below T, and the regularised ratio deviates by three times as much at every T (as it must if one fluctuating count drives both). From T = 1600 on the V0 ratios are within 2 percent, at 6400 within 0.3 percent.
- P-A3 (within 10 percent at T = 800) holds for all six.

### 2.3 The correction, with proof

**Lemma (c_0 = 0; PROVED, one classical input).** Let D(s) = sum_{n <= P} a_n n^(-s), a_1 = 1, a_P != 0, u = log P. Then D'/D(s) = -u/2 + lim_T sum_{abs(Im beta) < T} 1/(s - beta).
Proof. f(s) = D(s) P^(s/2) is an exponential polynomial with frequencies in [-u/2, u/2] and non-zero extreme coefficients; f'/f -> u/2 as Re s -> +infinity and -> -u/2 as Re s -> -infinity, uniformly in Im s. Integrate f'/f(w)/(w - s) over the rectangle abs(Re w) < X, abs(Im w) < T_k, with T_k chosen so that f'/f is bounded on Im w = +-T_k (CLASSICAL: Levin, sine-type functions; the zeros lie in a strip with bounded density). Residues: f'/f(s) - sum 1/(s - beta). Let X -> infinity: the vertical sides vanish; the two horizontal sides combine to int g(x)[1/(x - iT - s) - 1/(x + iT - s)] dx with g = f'/f equal to (u/2) sgn(x) outside a bounded set. The odd part integrates to 0 in the limit and the bounded set contributes O(1/T). QED.
Example: D = 1 + a 2^(-s): f'/f = (L/2) tanh(L(s - b)/2) with L = log 2, b = log a/L, which is the symmetric sum over its zeros for every a > 0.
Consequences. (a) In step (b) of c18 Theorem A the constant c_0 is 0, not a term to be absorbed into log abs(a_P); the identity is V0. (b) log abs(a_P) enters only through the mean real part log abs(a_P)/u of the zeros, hence the tail (u - 2 log abs(a_P))/(pi T). (c) With sum_sym 1/(beta - 1/2) = -(D'/D)(1/2) - u/2, the term -u norm^2 and the 1/T tail are both removed: the regularised form of item 2. Its tail is -2 R''(0) sum Re (beta - 1/2)^-3 with R''(0) = -norm(h')^2.

Row changes proposed for the record of c18-tz-one-sided-bound-fe-reserve-bridge.
- Theorem A: "PROVED; checked numerically at P = 3, 5, 8, float64" -> "CERTIFIED at P = 12, 20, 30 and for three non-multiplicative series, complete zero lists to T = 6400, in the corrected form V0 (constant -u for every a_P; tail (u - 2 log abs(a_P))/(pi T))". Named discrepancy D-A1: the term log abs(a_P) in display (A).
- Lemma 1 (a_P = 1): unchanged. Rows of the c18 controls table that use (A) for series with a_P != 1 (DH, E_a, T-NR): the constant of the form shifts by log abs(a_P); no verdict in that table depends on it (they are decided through zero location or size).
- Weakest step 2 of c18 ("the rows with incomplete zero lists and the non-multiplicative series do not check it"): closed.

## 3. Run B: zeros of D_P right of the line

### 3.1 Method (`runBC.py`, `selftest.py`; float64, MEASURED)

Moment engine: cells of width 1/32 in log n, 24 Taylor terms about the window centre; phases t log n mod 2 pi in 80-bit long double on the server. Self-test against direct summation: 6e-17 to 2e-11. Zeros in the rectangle -0.15 < Re - 1/2 < sigma_R - 1/2, abs(Im - t_w) < 50.3: Newton from the local minima of a grid of step 0.03; the float winding number of the rectangle gave the same count in all 2340 jobs (2319 at the first stage, 21 after Newton from the lowest 15 percent of the grid; 47 jobs had a zero close enough to the boundary that the largest argument step stayed above 1 rad). Independent check on the part used below: Littlewood's lemma on the window rectangle with the edge terms computed, S = L + E, residual at most 6.2e-8 over all jobs (P-B1 holds).
Classes as in PREREG. ZQ is truncated in the Laplace sense, D^ZQ_P(s) = m(s) D_P(s) - sum_j res_j P^(r_j - s) D_P(r_j)/(s - r_j), eta = 0.1, with the pair of zeta zeros nearest t_w from Arb. Windows: t_w = t + 200 w with P fixed by t; zeta on w = 0..7, the five single classes on w = 0 (pre-registered) and w = 1..7 (extra run), chains and Haar draws on w = 0.

### 3.2 Table (median over windows or members; min-max in brackets; (H) = held-out height). S = sum over right zeros of (Re beta - 1/2) per unit height; "frac right" = N_R/(100 u/2 pi)

| t | theta' | P | zeta S, 8 windows | zeta frac right | chains S | Haar S | ZQ S | T-NR S | E_a S | DH S | HQ2 S | E_a frac | HQ2 frac | max Re beta (zeta; all) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 10000 | 0.50 | 39 | 0.027 (0.018-0.031) | 0.317 | 0.027 (0.022-0.034) | 0.029 (0.022-0.038) | 0.027 | 0.182 | 0.196 | 0.018 | 0.032 | 0.789 | 0.394 | 0.865; 1.334 |
| 10000 | 0.75 | 251 | 0.038 (0.033-0.042) | 0.443 | 0.035 (0.028-0.044) | 0.032 (0.024-0.049) | 0.039 | 0.187 | 0.253 | 0.028 | 0.072 | 0.841 | 0.597 | 0.760; 1.212 |
| 10000 | 1.00 | 1591 | 0.049 (0.019-0.054) | 0.460 | 0.041 (0.033-0.058) | 0.037 (0.028-0.057) | 0.051 | 0.195 | 0.308 | 0.037 | 0.197 | 0.822 | 0.874 | 0.729; 1.080 |
| 300000 (H) | 0.50 | 218 | 0.034 (0.031-0.044) | 0.403 | 0.033 (0.024-0.045) | 0.035 (0.022-0.043) | 0.035 | 0.193 | 0.252 | 0.028 | 0.076 | 0.817 | 0.607 | 0.813; 1.196 |
| 300000 (H) | 0.75 | 3230 | 0.047 (0.033-0.050) | 0.459 | 0.043 (0.028-0.058) | 0.042 (0.031-0.058) | 0.048 | 0.196 | 0.319 | 0.035 | 0.249 | 0.875 | 0.910 | 0.755; 1.109 |
| 300000 (H) | 1.00 | 47746 | 0.054 (0.023-0.066) | 0.472 | 0.048 (0.032-0.069) | 0.046 (0.037-0.063) | 0.055 | 0.205 | 0.383 | 0.044 | 0.411 | 0.872 | 0.959 | 0.689; 0.997 |
| 1e+06 | 0.50 | 398 | 0.037 (0.025-0.043) | 0.388 | 0.038 (0.029-0.049) | 0.038 (0.029-0.051) | 0.038 | 0.186 | 0.259 | 0.029 | 0.104 | 0.855 | 0.729 | 0.791; 1.209 |
| 1e+06 | 0.75 | 7968 | 0.051 (0.042-0.055) | 0.479 | 0.041 (0.030-0.057) | 0.043 (0.033-0.059) | 0.051 | 0.196 | 0.326 | 0.040 | 0.286 | 0.888 | 0.899 | 0.701; 1.062 |
| 1e+06 | 1.00 | 159154 | 0.041 (0.023-0.060) | 0.391 | 0.048 (0.031-0.071) | 0.049 (0.038-0.071) | 0.042 | 0.194 | 0.363 | 0.049 | 0.475 | 0.879 | 0.978 | 0.671; 0.951 |
| 3e+07 (H) | 0.50 | 2185 | 0.042 (0.024-0.050) | 0.421 | 0.044 (0.031-0.055) | 0.040 (0.032-0.057) | 0.043 | 0.199 | 0.316 | 0.034 | 0.247 | 0.878 | 0.960 | 0.755; 1.122 |
| 3e+07 (H) | 0.75 | 102142 | 0.054 (0.047-0.066) | 0.496 | 0.052 (0.044-0.071) | 0.048 (0.038-0.059) | 0.056 | 0.213 | 0.386 | 0.046 | 0.452 | 0.915 | 0.961 | 0.683; 1.009 |
| 3e+07 (H) | 1.00 | 4774648 | 0.032 (0.028-0.037) | 0.380 | 0.051 (0.039-0.073) | 0.054 (0.042-0.071) | 0.032 | 0.204 | 0.410 | 0.054 | 0.619 | 0.960 | 0.991 | 0.620; 0.916 |
| 1e+08 | 0.50 | 3989 | 0.036 (0.031-0.044) | 0.413 | 0.041 (0.033-0.055) | 0.044 (0.035-0.054) | 0.038 | 0.187 | 0.306 | 0.038 | 0.248 | 0.883 | 0.887 | 0.719; 1.034 |
| 1e+08 | 0.75 | 251979 | 0.053 (0.044-0.060) | 0.495 | 0.050 (0.038-0.062) | 0.052 (0.039-0.075) | 0.054 | 0.194 | 0.380 | 0.049 | 0.474 | 0.897 | 0.945 | 0.667; 0.942 |
| 1e+08 | 1.00 | 15915494 | 0.031 (0.028-0.036) | 0.364 | 0.054 (0.036-0.067) | 0.058 (0.041-0.079) | 0.032 | 0.194 | 0.411 | 0.057 | 0.632 | 0.964 | 0.962 | 0.631; 0.911 |

abs(S - L) is at most 0.0094 in every job (P-B2 holds): S is (1/2 pi) mean log abs(D_P(1/2 + ix)) up to the edge term.

### 3.3 Predictions

- P-B3. L > 0 in all 720 chain and Haar jobs (and in all 2340 jobs): holds. "Fraction right between 0.2 and 0.5": false as stated; the range is 0.29 to 0.63 and 82 percent of the jobs lie in [0.2, 0.5].
- P-B4, theta' = 0.5 and 0.75 (zeta inside the Haar range in at least 6 of 8 windows): holds at 9 of 10 cells; 5 of 8 at (1e8, 0.5). With 24 draws the range covers about 92 percent of an exchangeable value, so 5 of 8 at one cell of ten is within chance; by the letter the prediction fails at that cell.
- P-B4, theta' = 1 (zeta below the Haar median in at least 6 of 8 windows, still positive): holds at 3e7 and 1e8 (8 of 8; zeta S = 0.028 to 0.037 against the Haar range 0.041 to 0.079: zeta is below the Haar minimum in every window). Fails at 1e4 (1 of 8), 3e5 (3 of 8), 1e6 (5 of 8). Reason found afterwards (item 4): the windows w >= 1 keep P = floor(t/2 pi) while t_w grows, so (t_w/2 pi - P)/sqrt(t/2 pi) reaches 5.6, 1.0, 0.56 at these heights and the Fresnel weight of the reflected term moves from 1/2 to 1; S rises with it (at 3e5: 0.023, 0.029, 0.042, 0.047, 0.062, 0.065, 0.066, 0.064 for w = 0..7). At w = 0 (weight 1/2) zeta's S is below all 48 chain and Haar values of the cell at all five heights (0.019, 0.023, 0.023, 0.028, 0.030 against minima 0.028, 0.032, 0.031, 0.039, 0.036). The prediction as registered did not anticipate this dependence.
- P-B5 (E_a and T-NR above the Haar maximum for P >= 1000): holds at every cell (and also below P = 1000).
- C1 (no zero of D_P right of the line that the window sees): false for every class at every cell; minimum N_R = 10 (P = 39). For zeta the fraction right is 0.32 to 0.50. E_a and HQ2 have 0.79 to 0.99 of their zeros right of the line; HQ2 reaches S = 0.63.

### 3.4 The structure at theta' = 1 (`fe_check.py`, mpmath 30 digits; POST-HOC, MEASURED)

| t | w | (gamma/2 pi - P)/sqrt(t/2 pi) | zeros checked | zeta(beta)/chi(beta), range | max abs(b + (log abs zeta(beta) + log 2)/Lg) |
|---|---|---|---|---|---|
| 1e8 | 0 | -0.002 to 0.002 | 45 | 0.4986 to 0.5014, imaginary part within 0.0014 | 0.00017 |
| 3e7 | 0 | -0.003 to 0.004 | 40 | 0.4974 to 0.5024, imaginary part within 0.0026 | 0.00034 |
| 1e6 | 0 | -0.017 to 0.022 | 59 | 0.487 to 0.515, imaginary part within 0.015 | 0.0025 |
| 3e5 | 0 | -0.032 to 0.038 | 50 | 0.476 to 0.525 | 0.0047 |
| 1e4 | 0 | -0.18 to 0.21 | 32 | 0.36 to 0.65 | 0.038 |
| 1e8 | 7 | 0.054 to 0.058 | 32 | 0.538 to 0.541, imaginary part -0.041 to -0.038 | |
| 1e6 | 7 | 0.54 to 0.58 | 33 | 0.961 to 0.999, imaginary part -0.241 to -0.234 | |
| 1e4 | 7 | 5.4 to 5.8 | 55 | 0.970 to 1.030 | |
| 1e8, theta' = 0.75 | 0 | | 45 | abs from 0.15 to 3.9 | 0.12 |
| 1e8, theta' = 0.5 | 0 | | 48 | abs from 0.006 to 8.5 | 0.27 |

Reading (ARGUED; the Poisson step is classical and was not opened): zeta - D_P = sum_{n > P} n^(-s); the k = 1 term of its Poisson sum has its stationary point at x = gamma/2 pi, which is the end point P of the range, so it contributes chi(s) times a Fresnel-type weight F((gamma/2 pi - P)/sqrt(t/2 pi)) with F(0) = 1/2 and F(+infinity) = 1. Hence at theta' = 1 the right zeros of D_P are the solutions of zeta(s) = F chi(s) right of the line, their depth is b = -(log abs(zeta(beta)) + log(1/abs F))/Lg, and S = (1/2 pi) mean log abs(Z(x) - F e^(-i vartheta(x))) plus the edge term. For theta' < 1 no such relation exists (ratio scattered), in agreement with the last sentence of c18 section 6.
Consequence for the support of lane c19-u4: at theta' = 1 the zero set of D_P near height t is a function of zeta near the line and of the functional equation; it carries no information that zeta's values there do not carry. At theta' < 1 the census of zeta is inside the Haar range (9 of 10 cells), that is, torus-generic for S.

## 4. Run C: joint prime-phase statistics on the right-zero lists

Definitions, reasons why each is none of the four excluded kinds, the z-score and the survivor rule are in `PREREG.md`. Reference: the class's own Haar ensemble (X(p) = e^(i theta_p) in place of p^(-it); 24 draws for zeta coefficients, 12 for each single class). This is the control check of the assignment. Full table for all 15 cells: `md_tables.txt`, `tables.txt`; the theta' = 1 rows:

| t | theta' | stat | zeta Z8 (prereg) | chains with abs z >= 2.5 (of 24) | single classes at w = 0, prereg z: T-NR, ZQ, E_a, DH, HQ2 | ZQ Z8 (extra) | E_a Z8 (extra) | post-hoc Welch Z: zeta, ZQ, chains |
|---|---|---|---|---|---|---|---|---|
| 10000 | 1.00 | Q1 | 2.4 | 0 | -0.2, -1.3, 1.7, -0.2, -1.3 | 2.0 | 10.8 | 1.4, 1.1, -0.4 |
| 10000 | 1.00 | Q2 | 2.0 | 0 | 1.0, 0.2, -1.5, -0.9, 0.8 | 1.9 | 4.9 | 1.9, 1.8, -0.2 |
| 300000 (H) | 1.00 | Q1 | -3.1 | 0 | -0.2, 1.2, 3.5, 0.3, -0.3 | -1.1 | -5.4 | -2.3, -2.2, 0.5 |
| 300000 (H) | 1.00 | Q2 | 4.0 | 0 | 0.1, 1.5, -2.3, -0.2, 0.7 | 6.5 | 3.5 | 5.8, 5.3, 0.3 |
| 1e+06 | 1.00 | Q1 | -4.9 | 2 | -0.1, -0.6, 5.1, 0.8, -0.5 | -3.3 | -1.2 | -3.4, -2.5, -0.9 |
| 1e+06 | 1.00 | Q2 | 1.9 | 0 | 0.6, 2.2, -1.1, -0.8, 0.1 | 2.9 | 2.8 | 2.2, 2.3, -0.9 |
| 3e+07 (H) | 1.00 | Q1 | -1.2 | 0 | -0.6, 2.6, 3.2, -0.9, 1.0 | 3.9 | 1.0 | -0.2, 0.8, -0.0 |
| 3e+07 (H) | 1.00 | Q2 | 4.2 | 0 | 0.1, 2.2, -4.1, -0.0, -1.1 | 5.6 | -3.9 | 3.8, 4.4, -1.0 |
| 1e+08 | 1.00 | Q1 | -0.6 | 0 | -0.1, 1.2, 7.1, -0.3, -0.1 | 4.4 | 6.9 | 0.7, 1.1, 1.1 |
| 1e+08 | 1.00 | Q2 | 6.0 | 1 | -1.2, 0.3, -0.9, -1.2, 0.1 | 3.1 | -2.7 | 7.0, 4.1, 1.9 |

Pre-registered predictions and rule.
- P-C1 (chains conform): holds. At most 2 of 24 chains beyond 2.5 in any cell for Q1 or Q2; none beyond 4.
- P-C2 (zeta conforms at theta' = 0.5 and 0.75): holds. abs(Z8) at most 2.4 over the 20 entries.
- P-C3 (single classes conform to their own ensembles at w = 0): fails. E_a deviates in Q1 at theta' = 1 (z = 3.5, 5.1, 3.2, 7.1 at 3e5, 1e6, 3e7, 1e8) and in Q2 at (3e7, 1) (z = -4.1); scattered entries between 2.5 and 3.4 for ZQ, DH, HQ2, E_a elsewhere (12-draw ensembles; the z scale has heavy tails, leave-one-out maxima of the 24-draw ensemble itself reach 2 to 3.9).
- Survivor rule, Q1: not met at any theta' (zeta Z8 at theta' = 1: 2.4, -3.1, -4.9, -1.2, -0.6; no stable sign).
- Survivor rule, Q2 at theta' = 1: zeta deviates on both held-out heights with the same sign (4.0 and 4.2) and chains conform. The rule is not met, by two clauses: at the held-out height 3e7 E_a does not conform (-4.1), and the pattern holds at only one of the three discovery heights (1e8: 6.0; 1e6: 1.9; 1e4: 2.0). Q2 at theta' = 0.5, 0.75: zeta conforms. **No survivor.**

Beyond the letter of the rule (extra run and POST-HOC analysis; `posthoc.py`, `posthoc.txt`).
- Power asymmetry of the rule: zeta had 8 windows, each single class one. With 8 windows ZQ deviates in Q2 at theta' = 1 as zeta does: Z8 = 6.5 (3e5), 5.6 (3e7), 3.1 (1e8), 2.9 (1e6). ZQ has zeta's functional equation and zeros off the line. A statistic that ZQ passes cannot meet R3.
- Count confound of the registered z: at theta' = 1 zeta has fewer right zeros than every Haar draw, so the regression on log N_R extrapolates. Bias-corrected by permutation inside each job (depths permuted among the zeros), Q2c is 0.0077 to 0.0095 for zeta at 3e5, 3e7, 1e8 against 0.0016 to 0.0027 (sd 0.0015 to 0.0032) for Haar; Welch Z = 5.8, 3.8, 7.0 for zeta and 5.3, 4.4, 4.1 for ZQ; chains 0.3, -1.0, 1.9. At 1e4 and 1e6 (where the eight windows mix Fresnel weights): 1.9 and 2.2. The effect survives the correction.
- What Q2 reads: the real part of corr(Re beta - 1/2, e^(i phi_p)) is -0.17 to -0.24 at p = 2 for zeta at theta' = 1 at all five heights (p = 3: -0.12 to -0.22; p = 5: -0.12 to -0.17) against -0.00 to -0.06 for Haar (p = 3, 5: -0.06 to -0.10). By item 4 the depth of a right zero is -(log abs(zeta(beta)) + log 2)/Lg, and log abs(zeta) near the line is negatively correlated with -cos(gamma log p) weighted by p^(-1/2): deeper zeros sit where the small primes have negative phase. This is a property of every function with zeta's approximate functional equation at length t/2 pi and zeta's values near the line; ZQ has both.
- E_a in Q1 at theta' = 1 (own-ensemble z = 3.2 to 7.1 at w = 0; Z8 from the extra run: 10.8, -5.4, -1.2, 1.0, 6.9, no stable sign): not explained here. P = t/2 pi is the balanced length of the degree-2 functional equation of E_a. Not pursued.

## 5. Controls (run against the three outputs of the lane)

| Control | Theorem A (V0) | C1 (no right zero of D_P) | Q2 at theta' = 1 |
|---|---|---|---|
| Davenport-Heilbronn | holds verbatim (DH12 CERTIFIED: non-multiplicative, a_P = 0.284) | false; S about equal to the Haar median of its own ensemble | conforms to its own ensemble (z -0.2, -0.0, -1.2; Z8 -2.3, 0.1, -1.3) |
| Non-multiplicative N5, N12 | holds (CERTIFIED) | not run | not run |
| Sign chains (24) | holds (a_1 = 1) | false; S inside the Haar range | conform (0 or 1 of 24 beyond 2.5): a chain is a torus translate |
| Haar phases in place of p^(-it) | holds | false; reference ensemble | reference |
| T-NR (3, 2.2) | holds | false; S about 0.19 at every cell (4 to 6 times zeta) | conforms at w = 0 (Z8 on 8 windows: 3.0 at 1e4, at most 2.2 in absolute value elsewhere) |
| E_a, a = 0.1 | holds | false; 0.79 to 0.96 of its zeros right of the line | mixed (-4.1 at 3e7, see section 4) |
| ZQ, eta = 0.1 | holds in the Laplace-truncated sense | false; S equal to zeta's within 0.004 in each of the 120 windows | **deviates as zeta does** (Z8 6.5, 5.6, 3.1; post-hoc 5.3, 4.4, 4.1) |
| HQ2 (2, 0.01) | holds | false; S up to 0.63 | conforms at w = 0 (Z8: 2.8 at 1e6, below 1.9 in absolute value elsewhere) |
| Backward heat, phase-rotated transfer operator, theta^w, Beurling, zeta(s+a)zeta(s-a) beyond a = 0.1, T-NR at other (q, c) | not run: no Dirichlet series with a_1 = 1 on file for the first three; the others were outside the assignment's class list | | |

No output of this lane fails for a control at a structural step. Theorem A is an identity for every series with a_1 = 1 (as c18 states). C1 is false for zeta itself. Q2 is passed by ZQ.

## 6. Requirement flags

- R1 false. Theorem A (V0) is certified for three non-multiplicative series. Q2 at theta' = 1 is produced by the functional equation at length t/2 pi (item 4), and the multiplicative sign chains do not show it. Nothing here uses multiplicativity.
- R2 false. Run A is uniform in nothing but the identity. Runs B and C are finite samples: 5 heights, 8 windows each for zeta.
- R3 false. ZQ shares the only separating statistic; the other controls were not made to fail at a named step.
- R4 false. All objects are finite partial sums; item 4 ties D_P at theta' = 1 to zeta's values near the line and gives no bound on them.

## 7. Three weakest steps

1. Run A certifies the zero list and the truncated sums, not the limit. The passage T -> infinity rests on the lemma of 2.3 (one classical input, bounded f'/f on suitable horizontal lines, recalled and not opened) and on tail laws observed over T = 100 to 6400; no rigorous tail bound was written. The certification logic (half-plane criterion for argument change, interval Newton with a rectangular enclosure of D') was written for this lane and has not been refereed.
2. Runs B and C are float64 with a float winding number; completeness of the right-zero lists is supported by the Littlewood identity to 6e-8, not certified. Two platforms were mixed (long double on the server, double on the Mac for t <= 1e6). The eight zeta windows keep P fixed, so at t <= 1e6 the cells labelled theta' = 1 mix Fresnel weights from 1/2 to 1; the registered prediction P-B4 did not allow for this and failed there.
3. The reading of Q2 is post-hoc. Item 4 is measured on 32 to 59 zeros per cell and its derivation (end-point stationary phase) is argued, expected classical, not opened. The step from item 4 to the size of the depth-phase correlation is a sign-and-order argument, not a computed prediction. Haar ensembles have 24 or 12 draws; z-scores of single classes against 12 draws are coarse; the E_a deviations in Q1 are unexplained.

## 8. Hand-off

- To c19-u4-joint-prime-phase-quadratic-dp-zeros: (a) use Theorem A in the form V0 (constant -u for every a_P) or the regularised form of item 2, which needs zeros only to T of a few hundred for 1e-8; (b) at theta' = 1 the zeros of D_P are the solutions of zeta = F chi: any quadratic statistic of prime phases over them is a statistic of zeta's values near the line under the functional equation, and ZQ will share it; (c) at theta' < 1 zeta's census and both statistics are inside the Haar ensemble: for these statistics zeta's heights are torus-generic; (d) right-zero lists for all 2340 windows are in `resBC_*.jsonl` (field `zeros_right`: Re beta - 1/2 and Im beta - t_w).
- Proposed map row (next to P58): "Zeros of the partial sums D_P near height t, P = (t/2 pi)^theta'. Theorem A of P58 certified in the corrected form (constant -u for every a_P != 0; the printed term log abs(a_P) is wrong; tail (u - 2 log abs a_P)/(pi T); regularised form with T^-3 tail). C1 false at t = 1e4 to 1e8 for zeta, 24 sign chains, T-NR, ZQ, E_a, DH, HQ2 (S = L + E exact). At theta' = 1 the right zeros of D_P solve zeta = chi/2 (Fresnel weight; MEASURED): the zero set of D_P is a function of zeta near the line. Pair covariance of prime phases over the zeros: no separation. Depth-phase covariance: separates zeta and ZQ from chains at theta' = 1 only; reads the functional equation. No survivor. CERTIFIED (Run A), MEASURED (rest). `c19-dp-zero-census-truncation-identity-server`."
- Proposition Z (ZQ exchange form on zeta's ordinates; item 1 of FOR_NUMERICS_LANE) was not in this assignment and is not tested here; its label stays PROVED-model. What this lane adds for ZQ: its Laplace-truncated partial sum has the same right-zero census as zeta's (S within 0.004 and N_R within 4 in each of 120 windows).

Files: `PREREG.md`, `RESULT.md`, `runA.py`, `runA_*.json`, `runBC.py`, `runBC_extra.py`, `selftest.py`, `resBC_main.jsonl`, `resBC_local.jsonl`, `resBC_extra.jsonl`, `resBC_extralocal.jsonl`, `aggregate.py`, `aggregate.json`, `tables.txt`, `posthoc.py`, `posthoc.json`, `posthoc.txt`, `md_tables.txt`, `fe_check.py`, `fe_check_*.json`, `units.txt`, `logs/`, `lanes.jsonl`.
