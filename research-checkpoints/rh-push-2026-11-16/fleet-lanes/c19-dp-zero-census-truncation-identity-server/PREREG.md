# PREREG: c19-dp-zero-census-truncation-identity-server

Written 2026-11-19 before any code of this lane was run. Nothing below is a result.
Object: zeros of D_P(s) = sum_{n <= P} a_n n^(-s). Notation of c18-tz-one-sided-bound-fe-reserve-bridge: u = log P, w = beta - 1/2.

## Run A (Theorem A in ball arithmetic)

Test vectors h(s) = sin^4(pi s/u) e^(i tau s) on [0, u], tau in {0, 7.3}. All forms in closed form (h is a trigonometric polynomial), python-flint acb, 256 bits.
Series: zeta coefficients at P in {12, 20, 30}; non-multiplicative with a_1 = 1: N5 = (1, 1, -1, 2, 0.5) (the c18 series), N12 = (1, -0.5, 2, 1, -1, 0.5, 1, 3, -2, 1, 0.25, 1.5), DH12 = Davenport-Heilbronn coefficients truncated at P = 12 (a_12 = kappa = 0.284...).
Zero list: all zeros with abs(Im) < T, T in {100, 200, 400, 800}. Completeness: the strip sigma_L < Re < sigma_R is certified to contain all zeros (dominance of the extreme terms, in balls); in each horizontal slab the winding number of D_P around the slab boundary is certified (segments whose ball image is a convex set excluding 0) and compared with the number of zeros certified in the slab by complex interval Newton (unique zero in each ball; balls disjoint, none meeting a cut).
Identity variants tested, R(T) = left side minus the truncated right side, divided by norm(h)^2:
- V0: -2 Re <h, A_P h> = -u norm^2 + sum over abs(Im beta) < T of <h, kappa_beta h>.
- V1 (as printed in c18 Theorem A): the same with -u + log abs(a_P).
- Vreg: -2 Re <h, A_P h> = sum over abs(Im beta) < T of [ <h, kappa_beta h> + 2 norm^2 / w_beta ] + 2 norm^2 (D_P'/D_P)(1/2). (Derived here from V0 and sum_sym 1/(s - beta) = D_P'/D_P(s) + u/2; the subtracted term removes the 1/T tail.)
Predictions (derived on paper before the run, from D = 1 + a 2^(-s), where the symmetric sum is (L/2) tanh):
- P-A1. Hadamard constant c_0 = 0 for every a_P != 0: V0 holds for all six series. V1 agrees with V0 when a_P = 1 and is off by log abs(a_P) (N5: -0.693; N12: +0.405; DH12: -1.258) otherwise. If so, the term log abs(a_P) of (A) is a named discrepancy (it belongs to the tail, not to the identity).
- P-A2. Tail law: R_V0(T) T -> (u - 2 log abs(a_P))/pi. Threshold: ratio within 5 percent at T = 400 and closer at T = 800.
- P-A3. Regularised tail: R_Vreg(T) T^3 -> (norm(h')^2/norm(h)^2)(u - 2 log abs(a_P))/pi. Threshold: ratio within 10 percent at T = 800.
Label rule: "certified" for a row = complete zero list certified at every T, all balls finite, P-A2 and P-A3 thresholds met. The limit T -> infinity itself is not enclosed by a rigorous tail bound; this is stated in the result whatever the outcome.

## Run B (zeros of D_P right of the line; Proposition Z / completion C1 support)

Cells: t in {1e4, 1e6, 1e8} (discovery) and {3e5, 3e7} (held out), theta' in {0.5, 0.75, 1}, P = floor((t/2 pi)^theta'). Window: abs(Im beta - t_w) <= 50, t_w = t + 200 w. zeta: w = 0..7. All other classes: w = 0.
Classes: zeta; 24 completely multiplicative sign chains (eps(p) for the k-th prime = bit k of numpy default_rng(121000 + j), j = 0..23); T-NR (q, c) = (3, 2.2): zeta(s)(1 + c q^(1/2-s) + q^(1-2s)); ZQ: zeta(s) m(s), m = (s - b_+)(s - b_-)/((s - r1)(s - r2)), r_j = 1/2 + i g_j the two consecutive zeta zeros nearest t (Arb), b_+- = 1/2 +- eta + i (g1+g2)/2, eta = 0.1, truncated in the Laplace sense: D^ZQ_P(s) = m(s) D_P(s) - sum_j res_j P^(r_j - s) D_P(r_j)/(s - r_j) (the mirror factor at height -t is dropped; it is 1 + O(t^-2)); E_a, a = 0.1: a_n = n^(-a) sigma_2a(n); DH; HQ2 (q = 2, eps = 0.01): a(n) = 1 + sum_{2 <= j <= v_2(n)} eps C(j+1, 3) 2^(j/2).
Haar ensemble (control check): the same coefficients multiplied by a completely multiplicative X with X(p) = e^(i theta_p), theta_p iid uniform (default_rng(770000 + 1000 c + m), prime order): 24 draws for zeta coefficients (this is also the ensemble of the chains), 12 draws for each of T-NR, ZQ, E_a, DH, HQ2.
Method: float64 (phases t log n in 80-bit long double), moment engine (cells of width 1/32 in log n, 24 Taylor terms about the window centre); zeros in the rectangle -0.15 < Re - 1/2 < sigma_R - 1/2, abs(Im - t_w) < 50.3 by Newton from grid minima (step 0.03), completeness by the float winding number of the rectangle (fallback: Newton from every grid point). MEASURED, not ball arithmetic.
Reported per job: N_R (zeros with Re > 1/2 in the window), fraction N_R/(100 u/2 pi), S = sum (Re beta - 1/2)/100, L = (1/2 pi)(mean of log abs(D_P(1/2 + ix)) over the window), and the exact Littlewood edge term E so that S = L + E.
Predictions:
- P-B1. S = L + E to 1e-4 in every job with a complete list (identity; a failure is a code error).
- P-B2. abs(S - L) <= 0.05 per unit height in at least 90 percent of jobs (edge term of size O(1)/100).
- P-B3. Chains and Haar draws: L > 0 in at least 90 percent of jobs at every cell; fraction right between 0.2 and 0.5.
- P-B4. zeta at theta' in {0.5, 0.75}: S inside the [min, max] of the 24 Haar draws in at least 6 of 8 windows at every height. zeta at theta' = 1: S below the Haar median in at least 6 of 8 windows (heuristic: D_P = zeta - chi + small, mean log abs = mean log^+ abs(Z)), and still positive. So C1 (no zero of D_P right of the line) is false at every cell for every class.
- P-B5. E_a and T-NR: S above the zeta-coefficient Haar maximum at every cell with P >= 1000.

## Run C (joint prime-phase statistics on the right-zero lists of Run B)

Phases at a zero beta = b + i gamma of the class with twist X (X = 1 for zeta, T-NR, ZQ, E_a, DH, HQ2; X = eps for chains; X = the draw for Haar): phi_p = arg(X(p) p^(-i gamma)), primes p <= min(50, P). e_p = e^(i phi_p); means over the N_R right zeros of the window.
- Q1 (pair covariance): mean over pairs p < q of abs(cov-_pq)^2 + abs(cov+_pq)^2, cov-_pq = mean(e_p conj e_q) - mean(e_p) conj mean(e_q), cov+_pq = mean(e_p e_q) - mean(e_p) mean(e_q). Why it is none of the excluded kinds: it is a second-order joint statistic of the torus coordinates of the zeros of D_P; it is not a count (normalised by N_R, and compared after regression on N_R), not a mean value of D_P or of its coefficients, does not depend on abs(a_n) alone (it changes under a torus translation of the zero set at fixed coefficient sizes), and uses zeros of D_P off the line, not ordinates of zeta.
- Q2 (depth-phase covariance): mean over p of abs(mean((d - mean d) e_p))^2 / var(d), d = Re beta - 1/2. Why: it couples the distance of each right zero from the line to the prime phases there; a count, a mean value, the coefficient sizes or a set of on-line ordinates do not determine it.
- Q0 (diagnostic only, not a candidate): mean over p of abs(mean e_p)^2.
Reference ("Haar prediction"): the class's own Haar ensemble at the same cell. z = (log Q - fit(log N_R))/sd, fit = least-squares line of log Q on log N_R within the ensemble, sd = residual standard deviation (ensemble sizes 24 and 12; with 12 draws z is coarse and the threshold below is not relaxed).
Thresholds: "deviates" = abs(z) >= 4; "conforms" = abs(z) < 2.5. For zeta the eight windows are combined: Z8 = sum z_w / sqrt 8, same thresholds.
Predictions:
- P-C1. Chains conform (at most 2 of 24 with abs(z) >= 2.5 per cell and statistic): a chain at height t is a torus translate.
- P-C2. zeta conforms at theta' = 0.5 and 0.75 (abs(Z8) < 2.5). At theta' = 1 no prediction is made (P = t/2 pi is where the functional equation ties the torus point to the height).
- P-C3. T-NR, E_a, DH, HQ2, ZQ conform to their own ensembles.
Survivor rule (fixed now): a statistic Q in {Q1, Q2} at a value of theta' is a survivor iff on BOTH held-out heights (3e5, 3e7) zeta deviates (abs(Z8) >= 4, same sign at both), and every other class conforms there (each of the five single classes abs(z) < 2.5; at most 2 of 24 chains with abs(z) >= 2.5), and the same pattern holds on at least two of the three discovery heights. Anything else is not a survivor. A survivor gets no score: it only names a lane.
If zeta conforms everywhere: Run C is dead for these two statistics (zeta's heights are torus-generic for them), and that is the result.
