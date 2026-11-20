# c19-rs-real-zero-completion-band-server: the band device N(theta) completed by the sign-change measure of the Riemann-Siegel main sum

Date: 2026-11-19 (local; server clock 2026-11-20). Kind: compute (heavy server lane, round 19, combinable 1 of round 18).
Sources: `push/c18-tz-band-completion-controls-server` (RESULT, REFEREE E1 to E6), `push/c18-tz-one-sided-bound-fe-reserve-bridge` (RESULT, FOR_NUMERICS_LANE.md), `push/c18-referee-r17-independent-sources/GATE.md` (reading rule N_all), map rows P45, Q30, S12b and the controls section, BRIEF to the end.
Labels: PROVED (argument in this note; author only, not refereed), CLASSICAL, MEASURED (ball enclosures as described in section 3), ARGUED, NOT RUN.

Nothing here proves or refutes RH. No statement about a zero of zeta is established. No bound moves. The headline score is unchanged.

## 0. Verdict

**Precise obstruction. Registered outcome (b): the device is closed by ZQ. This was forced on paper before the runs (Lemma Z in `PREREG.md`) and is confirmed by the runs.**

1. Object. The additive reflected atoms of the c18 Form C are replaced by a measure that is positive by construction: sigma = (unit masses at the sign changes of the Riemann-Siegel main sum in [t_w - 720, t_w + 720]) + (Arch density minus its chord there). Lemma P (PROVED): T_sigma >= 0 on every band; the data form satisfies Q_D(u) = T_sigma(u) + E(u), so N(theta) holds on the test space with tolerance 2M = max(0, -lambda_min(E(u))); the completed form on the full band is Q_C = T_sigma(Lg) + E_u. Only the smallest eigenvalue of the defect E enters.
2. zeta (MEASURED; 8 windows per height; theta = 0.75, 0.80, 0.85; m = 96, 192, 384; 216 cells; all enclosed). The defect of the main-sum completion against the prime data has -lambda_min(E)/Lg = 0.036 to 0.137 at 1e6 (median 0.067 to 0.080 over the three m), 0.0084 to 0.020 at 1e9 (median 0.011 to 0.014), 0.0016 to 0.0052 at 1e12 (median 0.0022 to 0.0033): 1.3 to 2.1 times (t/2 pi)^(-1/4), the size of the Riemann-Siegel remainder. With the first correction term C0 added to the main sum the defect is at most 5e-4 Lg in absolute value in all 216 cells (the floor of the tail approximation). The data form N(theta) is positive for zeta in 216 of 216 cells at every m (it must be: verified height). The completed form on the full band is positive in 205 of 216 cells, with smallest eigenvalue in [-0.045, 0.027] Lg at 1e6, [-0.0019, 0.014] at 1e9, [-0.0003, 0.0089] at 1e12.
3. Registered threshold for zeta (-lambda_min(E)/Lg <= 0.05 in every cell): met at 1e9 and 1e12 in 144 of 144 cells, not met at 1e6 (met in 10 of 72 cells) with the main sum alone; met in 216 of 216 cells with the C0 term.
4. Controls (MEASURED; the other 12888 records hold the C0 variant, the full-band forms and the controls; 0 undecided against the thresholds).
   - ZQ with eta = 0.01 has the same one-sided defect as zeta: lambda_min(E_ZQ) = lambda_min(E_zeta) within 2e-4 Lg at 1e6 and 1.1e-3 Lg at 1e9, and -0.0058 to -0.0086 Lg at 1e12 (its pair form alone: -0.0057 to -0.0084). It meets the 0.05 threshold in 144 of 144 cells at 1e9 and 1e12 at every m, and at 1e6 exactly in the cells where zeta does. **ZQ passes: outcome (b).** In all 648 ZQ cells lambda_min(E_ZQ) >= lambda_min(E_zeta) + lambda_min(pair form): the whole effect of the quartet is its pair form, which tends to 0 with eta.
   - Every other class is negative at a size far above the threshold: 24 sign chains and Liouville (lambda_min(E)/Lg between -0.72 and -1.88 in 5400 of 5400 cells), ZQ at eta = 0.25 (-1.3 to -26.6), E_a for a = 0.1 and 0.3 (data form negative in 432 of 432 cells), DH (-0.69 to -76), T-NR (-7.5 to -803), HQ2 truncation (-6.6 to -192).
   - Named step of each failure (section 5): chains fail through the missing functional equation; DH, ZQ at 0.25, T-NR, HQ2 and E_a through zero or pole location and size. None fails at a step that reads multiplicativity.
5. Mode count (the referee's E1 of the c18 lane). No verdict of the completion statistic changes between m = 96, 192, 384, so outcome (c) does not apply to it. For the data form N(theta) itself the chain pass rates do depend on m: at M = 0 chains are positive in 60 to 100 of 192 cells at (theta = 0.75, m = 96) and in 2 to 12 at m = 384; at theta >= 0.80 and m = 384 in 0 of 192 at all three heights. ZQ pass counts are identical at the three m. E_0.1 passes at M = 1 in 2, 1, 0 of 8 windows at (1e6, 0.75) for m = 96, 192, 384 and nowhere else.
6. Owed items of FOR_NUMERICS_LANE.md (section 6): item 1, the ZQ exchange threshold eta* on zeta's ordinates is positive in every cell and lies above the lattice root of Proposition Z in every cell (median ratio 1.8 to 2.3 at theta' = 0.6, 2.7 to 4.8 at 0.8, 6.9 to 13.7 at 0.95); item 4, the E_a Fejer value is negative from theta' = 1 on for a = 0.1 and from 0.5 to 0.75 on for a = 0.3, positive below; item 5, chains violate the complete device in 0 to 6 percent of cells at theta' = 0.6, 45 to 94 percent at 0.8, 98 to 100 percent at 1.0 (M = 0), rising with theta' and with m.
7. Why the device is closed (section 7). The only output of the completion is N(theta) with a tolerance equal to the defect. That conclusion holds for ZQ at small eta (measured threshold eta* > 0 at every theta' < 1), so no argument for it can fail on ZQ. The two-sided version (norm of E small) does exclude every pair, but it says that the zero counting measure equals the sign-change measure of the main sum at the resolution of the window: that is the target in the window, and the lane has no bound of the defect that does not use the zeros.
8. Requirement flags: R1 no, R2 no, R3 no, R4 no. No pivot was run beyond the registered C0 variant.

Not run: DH at 1e12 (coefficient array above the memory plan); item 5 at (1e12, theta' = 1) (chain sums to 1.6e11); backward heat, unimodular twist, Beurling, phase-rotated transfer operator, theta^w (not in the assignment's list); the hybrid form for classes other than zeta, Liouville and the chains.

## 1. Plan and what is new against the sources

The c18 numerics lane closed one formula for the reflected completion (linearised first harmonic, additive atoms n -> t/(2 pi n)): zeta failed it in 600 of 600 cells, and its weakest step 1 named the alternative that was not run: the counting measure of the real zeros of the Riemann-Siegel main sum, positive by construction, with the defect against the data as the quantity to bound. The c18 paper lane listed completions C0 to C4 and asked for five runs. The c18 referee showed that the chain pass rates of the data form depend on the number of modes and left the m-dependence of ZQ, E_a and DH untested.

Done here:
- the completion by the sign-change measure, as a lemma (section 2) and as a certified computation at 1e6, 1e9, 1e12 with 96, 192, 384 modes (section 4);
- the controls, each on its own zero configuration (section 5), including the two new ones of round 18 (HQ2) and the classes whose m-dependence was open;
- owed items 1, 4, 5 (section 6);
- a direct ball check of the prime-sum engine at 1e9 and 1e12 (K3, section 3), which the c18 referee (E5) recorded as missing.

`PREREG.md` was written before any run of this lane (only a capability check of python-flint preceded it). It contains Lemma P, Lemma Z, the grid, the statistics, a prediction per part, thresholds and the three outcomes.

## 2. The first lemma

Notation of the c18 lanes. I = [0, U]; v_x(s) = e^(isx); g(x) = int_I h(s) e^(-isx) ds; C_a the compression of the shift by a. Data form on the band u = theta log T0: Q_D(u) = Arch + pole - 2 Re A_P, A_P = sum over n <= T0^theta of c(n) n^(-1/2) C_(log n). For zeta, Q_D(u) = T_Z on L^2[0, u] (explicit formula; CLASSICAL; checked by K2 of the c18 lane and by the self-test of section 3).

Completion measure. Z_RS(x) = 2 Re[e^(i vartheta(x)) sum_(n <= N) n^(-1/2 - ix)], N = floor(sqrt(t_w/2 pi)) frozen at the window centre; G = sign changes of Z_RS in J = [t_w - 720, t_w + 720]; rho = vartheta'/pi; rho_J = the chord of rho on J;

    sigma = sum over g in G of delta_g + (rho - rho_J 1_J) dx,      T_sigma(U) = Arch(U) + sum_G |v_g><v_g| - int_J rho_J |v_x><v_x| dx.

rho is concave for large x (vartheta''' < 0), so rho - rho_J >= 0 on J and sigma >= 0 for every point set G.

**Lemma P (PROVED).** Let sigma >= 0 with sigma([x, x+1]) = O(log(2 + abs(x))) and h in H^1_0(I).
(i) <h, T_sigma(U) h> = int abs(g)^2 d sigma >= 0 for every U; k_sigma(a) = int e^(iax) d sigma(x) is positive definite on R. If k_sigma equals the data kernel on (-u, u), then for every U >= u the restriction of T_sigma(U) to L^2[0, u] is Q_D(u): a positive extension of the data.
(ii) In general Q_D(u) = T_sigma(u) + E(u) and <h, Q_D(u) h> >= lambda_min(E(u)) norm(h)^2.
(iii) The completed form Q_C on L^2[0, Lg] (data kernel on abs(a) < u, kernel of sigma on u <= abs(a) < Lg) equals T_sigma(Lg) + E_u, with E_u the form of the band-u part of (data kernel - k_sigma); lambda_min(Q_C) >= lambda_min(E_u); the restriction of Q_C to L^2[0, u] is Q_D(u).
Proof. abs(g(x))^2 = O(x^(-2)) for h in H^1_0, so the integral converges and is an integral of a non-negative function against a positive measure. A form on L^2[0, u] reads its kernel on (-u, u) only. (ii) and (iii) are linearity. QED.

For zeta, E(u) = Arch-free: E(u) = pole - 2 Re A_P - sum_G |v_g><v_g| + int_J rho_J |v_x><v_x| dx, and by the explicit formula E(u) is the form of the signed measure (zero counting measure of zeta) - sigma.

**Lemma Z (zero-side reading; written before the runs).** (a) A real zero of zeta not in G contributes +|v><v| >= 0. (b) A point of G that is not a zero contributes -|v_g><v_g| (PROVED, both by inspection). (c) A zero displaced by d from its point of G contributes a rank-two form of norm of order u^2 abs(d) (ARGUED). (d) A non-real pair gbar +- i eta contributes the pair form, with smallest eigenvalue at least -mu(eta, u), mu = u (sinh(u eta)/(u eta) - 1) (c17 Theorem 2 (c); PROVED there, MEASURED here: the computed smallest eigenvalue of the pair form is 0.976 to 0.99999 of -mu in all 648 ZQ cells).
Consequence: for ZQ, E_ZQ = E_zeta + (swap of the two removed points) + pair form, so lambda_min(E_ZQ) >= lambda_min(E_zeta) - swap - mu(eta, u), and mu -> 0 as eta -> 0. On the one-sided statistic, which is the only one Lemma P uses, ZQ passes for eta small enough at every theta and height.

## 3. Method, sizes, certification

All runs on the server through rhrun, single-thread units, at most 16 at a time, at most 4 GB per unit (requested 2 to 10 GB); GPU 1 only for the grid values of the main sums. Unit names in `units.txt`, logs in `logs/` (55 files). No unit of this lane is running.

- Prime sums: `engine.c` of the c18 lane (moments of order 8 on cells of width 1/512 in log n, quad-precision phases). Existing moment files at 1e12 (prime powers to 1.58e10, 26 objects); new runs: 1e6 (to 159154), 1e9 (to 1.59e8, 26 objects, 27 s), DH coefficients (all n to 125892 and 4.47e7), four boundary cells at 1e12, and the extension at 1e12 from 1.58e10 to 4.38e10 for zeta (8 units of about 180 s) for item 1 at theta' = 0.95.
- Sign changes of the main sums (`rsgrid.py`): grid of step 2 pi/(32 Lg) on J, phases t_w log n reduced in 200-bit balls, local degree-7 interpolation, sub-grid 1/8, bisection. Sizes: N = 398 or 399 at 1e6, 12615 at 1e9, 398942 at 1e12 (189188 grid points per window; 75 s per window on GPU 1, about 2.4 GB). Direct evaluation at 80 located points per window: abs(Z) below 9.1e-11. Counts in J (length 1440): zeta main sum 2727 to 2744 at 1e6 against the smooth count 2745 to 2746; 4327 to 4329 at 1e9 (4328.2); 5911 or 5912 at 1e12 (5911.4); with C0: 2745 to 2747, 4327 to 4329, 5911 or 5912. Chains: 1978 to 2141 at 1e6, 2943 to 3236 at 1e9, 3890 to 4334 at 1e12 (66 to 75 percent of the smooth count). DH: 2766 to 2803 against its smooth count 3114 to 3115 at 1e6; 4116 to 4154 against 4697 at 1e9.
- Forms (`rsc.py`, `comp.py`): every operator is assembled through Lemma L of the c18 lane from node functions. For a point g and band b: Im F_j = (1 - cos(b y))/y and diagonal 2 (U - b) sin(b y)/y + 2 (1 - cos(b y))/y^2, y = g - tau_j; for the density on J the same integrals in closed form (Si, Cin). Points and nodes are offsets from t_w, so no cancellation at height 1e12. 128-bit balls.
- Enclosures (`rsc.spec`): A = A_mid + R with norm(R) <= Frobenius norm of the radii = d. lambda_min(A_mid) >= c is certified by strict diagonal dominance of V^T (A_mid - c) V in balls, V the float eigenvector matrix taken as exact numbers (this also shows V invertible); the other side is a ball Rayleigh quotient. Enclosure width of lambda_min(E)/Lg: at most 4.3e-9 at 1e6, 2.6e-6 at 1e9, 4.7e-5 at 1e12 (the radius of the prime sums dominates); for DH 7.1e-7 and 1.6e-5. All records are decided against the registered thresholds (0 for s_D; -0.05 and -0.25 for lambda_min(E)): 0 undecided of 13104 records. One chain cell of the full-band form has s_C within 1.2e-5 of -0.25, which is not a registered threshold.
- Radius of prime sums: the c18 hand-derived rounding formula times 2.08 sqrt(X) (Chebyshev bound for sum Lambda(n) n^(-1/2); checked: 706.9, 13364, 63243 against 738, 13902, 65775) plus the remainder of the 8-term expansion at the largest node offset.

Checks.
- Self-test (unit rh-c19rs-self): T0 = 20000, theta = 0.8, m = 96, direct ball prime sums, G = 1849 Arb zeros of zeta in J (not Riemann-Siegel points). E(u) has all eigenvalues in [-8.04e-5, -6.93e-5] Lg. The constant part is the chord deficit of rho at this low height (2 pi times 720^2/(4 pi x^2) = 6.5e-4 absolute, positive part of sigma by construction; 2.6e-7 at 1e6); the spread 1.1e-5 Lg is the tail error. This checks signs and normalisation of the point forms, the density forms, Arch, pole and the prime side together. The band-limited branch agrees with the full-band branch to 3e-29, and the point forms with `tz.rank_terms` to 9e-40.
- K3 (units rh-c19rs-k3-*; added after the runs, not registered): direct 128-bit ball sums over all prime powers n <= X at two nodes against the engine, zeta and chain00: X = 125892 (1e6): difference at most 2.9e-13; X = 4.47e7 (1e9): at most 1.5e-13 (radius used 2.9e-7); X = 1e9 (1e12, theta = 0.75; 5.08e7 primes): at most 7.2e-13 (radius used 2.1e-6). The radius is conservative by a factor of about 1e6 at these sizes. At X = 3.98e9 and 1.58e10 (theta = 0.80, 0.85 at 1e12) no direct sum was made.
- Code check built into the grid: lambda_min(T_sigma) is enclosed at or above 0 in every cell (at least 2.4e-6 Lg at band u for zeta; for chains on the full band 0 within 3.1e-11, the chain point sets being sparser than the Nyquist density).
- zeta's data form reproduces the c18 medians at m = 96 (0.050, 0.015 at 1e6 for theta = 0.75, 0.85 against 0.052, 0.012 on 40 windows; 0.074, 0.024 at 1e12 against 0.075, 0.025).

Deviations from `PREREG.md`: (i) the registered relative acceptance test (enclosure width at most max(1e-6 Lg, 1e-3 abs(value))) is met at 1e6 and not at 1e9 and 1e12 for small values (widths 2.6e-6 and 4.7e-5 Lg); decisions were made by the certified bounds against the registered thresholds, with 0 undecided. (ii) K3 was added. (iii) The frozen N puts the term n = 399 in or out on a part of J in windows w = 0, 5 at 1e6 (the true N changes at x = 1000301); this is the registered definition and its effect is inside the measured defect. (iv) Signs at theta = 0.80, 0.85 at 1e12 remain certified relative to the hand-derived radius.

## 4. zeta

s_D = lambda_min(Q_D(u))/Lg; e = eigenvalues of E(u)/Lg (main-sum completion); RS1 = main sum plus C0; s_C = lambda_min(Q_C)/Lg on the full band; f = eigenvalues of E_u/Lg. 8 windows per row; "a / b / c" = theta 0.75 / 0.80 / 0.85.

| T0 | m | s_D median | s_D min | -e_min median (max over 24 cells) | e_max median | RS1: max abs e | s_C range | max abs f median |
|---|---|---|---|---|---|---|---|---|
| 1e6 | 96 | 0.050 / 0.033 / 0.015 | 0.027 / 0.012 / 0.0066 | 0.067 (0.125) | 0.059 to 0.076 | 1.2e-4 | 0.0008 to 0.027 | 0.074 to 0.080 |
| 1e6 | 192 | 0.043 / 0.023 / 0.0084 | 0.026 / 0.011 / 0.0047 | 0.070 (0.137) | 0.062 to 0.084 (max 1.94) | 2.5e-4 | -0.045 to 0.012 | 0.079 to 0.088 |
| 1e6 | 384 | 0.031 / 0.017 / 0.0065 | 0.020 / 0.011 / 0.0045 | 0.080 (0.137) | 0.084 to 0.116 (max 1.95) | 5.0e-4 | -0.045 to 0.0071 | 0.10 to 0.12 |
| 1e9 | 96 | 0.077 / 0.044 / 0.029 | 0.031 / 0.017 / 0.0075 | 0.0113 (0.0140) | 0.0098 to 0.0128 | 8e-5 | 0.0028 to 0.014 | 0.012 to 0.016 |
| 1e9 | 192 | 0.036 / 0.022 / 0.012 | 0.014 / 0.010 / 0.0039 | 0.0127 (0.0199) | 0.011 to 0.014 | 1.7e-4 | 0.0007 to 0.0062 | 0.015 to 0.017 |
| 1e9 | 384 | 0.028 / 0.017 / 0.0079 | 0.011 / 0.0047 / 0.0024 | 0.0144 (0.0201) | 0.012 to 0.016 | 3.3e-4 | -0.0019 to 0.0033 | 0.017 to 0.020 |
| 1e12 | 96 | 0.074 / 0.051 / 0.024 | 0.017 / 0.0074 / 0.0053 | 0.0022 (0.0040) | 0.0019 to 0.0024 | 4e-5 | 0.0020 to 0.0089 | 0.0043 to 0.0048 |
| 1e12 | 192 | 0.059 / 0.041 / 0.021 | 0.017 / 0.0072 / 0.0052 | 0.0031 (0.0047) | 0.0025 to 0.0033 | 7e-5 | -0.0001 to 0.0061 | 0.0050 to 0.0053 |
| 1e12 | 384 | 0.033 / 0.020 / 0.0097 | 0.017 / 0.0072 / 0.0045 | 0.0033 (0.0052) | 0.0029 to 0.0039 | 1.5e-4 | -0.0003 to 0.0032 | 0.0053 to 0.0060 |

Readings.
1. Data form: positive in 216 of 216 cells at every m (verified height; a failure would have been a code error). The margin falls with m: the m = 384 median is 0.27 to 0.62 of the m = 96 median (registered prediction 0.3 to 0.8; one cell at 0.27). It does not shrink with height at fixed m. This extends the referee's E3 from 1e6 to 1e9 and 1e12 in certified form.
2. Defect of the main-sum completion: symmetric to first order (e_max about -e_min: displacement dipoles), with -e_min times (t/2 pi)^(1/4) = 1.3 to 2.1 at all three heights and growing slowly with m and theta. Prediction (1e-1, 1e-2, 1e-3 within a factor 5) held. At 1e6 with m >= 192 e_max reaches 1.7 to 1.95: a close pair of zeros of zeta whose sign changes the main sum does not have (Lemma Z (a): positive, harmless for Lemma P).
3. With C0 the defect is at the floor of the tail approximation (at most 5e-4 Lg, not decreasing with height, growing with m). So the measured defect of the main-sum completion is the Riemann-Siegel remainder and nothing else; in particular the sign-change measure of main sum plus C0 reproduces the band-u prime data of zeta to 5e-4 Lg at 1e6, 1e9 and 1e12. This is a property of the verified zeros and of the accuracy of the Riemann-Siegel formula, not new information.
4. Completed form on the full band: T_sigma(Lg) has smallest eigenvalue 2e-8 to 0.027 Lg for zeta (below 1e-6 only at 1e6 with m >= 192) (registered prediction "below 1e-3" was wrong at m = 96 and 192), and Q_C is positive in 205 of 216 cells and never below -0.045 Lg (1e6), -0.0019 (1e9), -0.0003 (1e12); norm(E_u) is 0.85 to 4.2 times norm(E(u)). Unlike the c18 Form C (negative by 0.16 to 1.73 Lg in 600 of 600 cells), this completion is a positive extension of zeta's data up to the Riemann-Siegel remainder.
5. Registered verdict for zeta: "holds" at 1e9 and 1e12 (144 of 144 cells; -e_min at most 0.020 and 0.0052), not at 1e6 with the main sum alone (62 of 72 cells above 0.05; all 72 below 0.14). The second clause (median at 1e12 at most 1.5 times the median at 1e6) holds: the median falls by a factor 23 to 31.

## 5. Controls, each on its own zero configuration

lambda_min(E)/Lg (band u), minimum and maximum over all cells of the class at the height; "fail" = certified below -0.25; "hold" = certified at or above -0.05. Full tables: `tables.txt`, `tables_m1.txt`.

| Class | completion | 1e6 | 1e9 | 1e12 | fail / hold / cells | step of the failure or pass |
|---|---|---|---|---|---|---|
| 24 sign chains | sign changes of the chain's main sum | -1.86 to -0.79 | -1.88 to -0.77 | -1.80 to -0.72 | 5184 / 0 / 5184 | no functional equation: the sign changes of 2 Re[e^(i vartheta) D_N^eps] are not the chain's data; their density is 70 to 75 percent of the Arch density |
| Liouville | same | -1.61 to -0.86 | -1.55 to -0.81 | -1.66 to -0.96 | 216 / 0 / 216 | same |
| ZQ eta = 0.25 | zeta's G minus two points | -2.16 to -1.33 | -7.72 to -4.29 | -26.6 to -12.7 | 216 / 0 / 216 | its pair form (u eta = 2.6 to 5.9): zero location |
| ZQ eta = 0.05 | same | -0.137 to -0.042 | -0.127 to -0.084 | -0.224 to -0.150 | 0 / 8 / 216 | its pair form (-0.039 to -0.224): between the thresholds |
| ZQ eta = 0.01 | same | -0.137 to -0.036 (zeta: same) | -0.0201 to -0.0084 (zeta: same) | -0.0086 to -0.0058 | 0 / 154 / 216 (144 of 144 at 1e9, 1e12) | **passes**: pair form -0.0015 to -0.0084 |
| E_a, a = 0.1 | empty | s_D -0.86 to -0.08 | -1.84 to -0.61 | -4.16 to -1.31 | s_D < 0 in 216 of 216 | size of n^a against the reserve; at M = 1 it passes in 2, 1, 0 of 8 windows at (1e6, 0.75), m = 96, 192, 384 |
| E_a, a = 0.3 | empty | s_D -17.0 to -6.3 | -87 to -26 | -411 to -106 | s_D < 0 in 216 of 216 | same |
| DH | sign changes of its main sum, N = sqrt(5t/2 pi) | -11.5 to -0.69 | -76 to -1.20 | NOT RUN | 144 / 0 / 144 | zero location (its off-line zeros seen by the window; its main sum has 88 to 90 percent of its smooth count of sign changes); no coefficient step |
| T-NR (3, 2.2) | zeta's G | -12.2 to -7.5 | -107 to -39 | -803 to -212 | 216 / 0 / 216 | row at powers of 3, size rho^k |
| HQ2 truncation (q = 2, eps = 0.01) | zeta's G | -11.2 to -6.6 | -24.8 to -16.2 | -192 to -80 | 216 / 0 / 216 | row at powers of 2: quadruple poles on the line and zeros at distance 0.32 from it; size |

Readings.
1. ZQ. lambda_min(E_ZQ) - lambda_min(E_zeta) - lambda_min(pair form) is at least +0.0012 in all 648 cells: the effect of the quartet on the one-sided statistic is its pair form and nothing more, and the pair form is the c17 formula (0.976 to 0.99999 of -mu(eta, u)/Lg). At eta = 0.01 ZQ meets the registered "passes" clause at every one of the six (height, theta) pairs at 1e9 and 1e12, at every m. Its data form is also positive: 207 of 216 cells at M = 0 and 216 of 216 at M = 1, the same count at the three m (the pair is local; m does not matter). So ZQ is not excluded by the data form, by the defect, or by the completed form.
2. The two-sided statistic. lambda_max(E_ZQ)/Lg is 1.61 to 2.05 at every eta (two unit masses of the completion are missing): a two-sided test "norm(E) <= 0.05 Lg" rejects ZQ at every eta. It is not used by Lemma P, and for zeta it is not a weaker statement than the target in the window (section 7). It is also not met by zeta itself in cells where the main sum misses a close pair (1e6: lambda_max up to 1.95).
3. Chains. The failure is uniform (5184 of 5184) and of size about Lg at all three heights and mode counts. The step is the absence of the functional equation: the reserve vartheta and the length N = sqrt(t/2 pi) are zeta's, not the chain's. Every chain is completely multiplicative, so this failure does not read multiplicativity. In the completed form on the full band the chains are certified at or above -0.05 Lg in 8 to 19 of 192 cells at m = 96, 0 or 1 at m = 192, 0 at m = 384.
4. E_a: no real zeros, so the statistic is its data form, negative in every cell (theta >= 0.75). The pass at M = 1 at (1e6, 0.75) recorded by the c18 lane disappears at m = 384.
5. DH fails in every window at 1e6 and 1e9 at every m, through zero location.

Data form N(theta) at tolerance M (lambda_min(Q/U) + 2M >= 0), certified, cells passing at M = 0 / M = 1 of 192 chain cells:

| T0 | theta | m = 96 | m = 192 | m = 384 |
|---|---|---|---|---|
| 1e6 | 0.75 | 60 / 152 | 14 / 114 | 2 / 69 |
| 1e6 | 0.80 | 21 / 113 | 1 / 62 | 0 / 18 |
| 1e6 | 0.85 | 7 / 74 | 0 / 26 | 0 / 4 |
| 1e9 | 0.75 | 91 / 148 | 43 / 109 | 4 / 64 |
| 1e9 | 0.80 | 49 / 111 | 6 / 61 | 0 / 20 |
| 1e9 | 0.85 | 16 / 77 | 0 / 24 | 0 / 1 |
| 1e12 | 0.75 | 100 / 149 | 48 / 103 | 12 / 53 |
| 1e12 | 0.80 | 58 / 111 | 10 / 49 | 0 / 14 |
| 1e12 | 0.85 | 16 / 65 | 0 / 17 | 0 / 3 |

Every chain fails at M = 1 in at least one of the 8 windows at m = 384 at every (height, theta); 21 to 23 of 24 chains fail in all 8 windows at (theta = 0.85, m = 384); 0 to 4 of 24 at (0.75, 384). Count needed (outcome (c) for the data form only): at M = 0, 384 modes exclude all 24 chains in all 8 windows from theta = 0.80 on; at theta = 0.75, and at M = 1 at any theta in the grid, 384 modes are not enough and the count needed was not reached.

## 6. Owed items of FOR_NUMERICS_LANE.md

**Item 1 (ZQ exchange threshold on zeta's ordinates, M = 0).** Form: Q_D - |v_g1><v_g1| - |v_g2><v_g2| + pair(gbar, eta), prime side, u = theta' log(T0/2 pi); eta* = the first eta at which the smallest eigenvalue is 0 (float bisection; bracket ends 0.99 eta*, 1.01 eta* certified in balls: 144 of 144 cells at 1e6 and at 1e9, 96 of 96 at theta' <= 0.8 at 1e12, 38 of 48 at (1e12, 0.95)). Pairs: the two Arb zeros nearest the centre; the two Arb zeros following the gap longer than 2 pi/u nearest the centre. 8 windows; medians (minimum); m = 384 (the m = 96 medians are within 1 percent of these at theta' = 0.6 and 0.8 and within 7 percent at 0.95).

| T0 | theta' | lattice root | eta* centre pair | ratio | eta* after a long gap | ratio | u eta* (centre) |
|---|---|---|---|---|---|---|---|
| 1e6 | 0.6 | 0.134 | 0.306 (0.254) | 2.28 | 0.250 (0.161) | 1.87 | 2.20 |
| 1e6 | 0.8 | 0.0324 | 0.126 (0.079) | 3.88 | 0.137 (0.080) | 4.24 | 1.21 |
| 1e6 | 0.95 | 0.0032 | 0.0253 (0.0154) | 7.98 | 0.0287 (0.0142) | 9.08 | 0.29 |
| 1e9 | 0.6 | 0.0850 | 0.193 (0.129) | 2.27 | 0.156 (0.140) | 1.84 | 2.19 |
| 1e9 | 0.8 | 0.0205 | 0.068 (0.034) | 3.30 | 0.054 (0.040) | 2.65 | 1.02 |
| 1e9 | 0.95 | 0.0020 | 0.0138 (0.0074) | 6.89 | 0.0163 (0.0064) | 8.12 | 0.25 |
| 1e12 | 0.6 | 0.0623 | 0.137 (0.086) | 2.19 | 0.110 (0.086) | 1.77 | 2.11 |
| 1e12 | 0.8 | 0.0150 | 0.072 (0.028) | 4.76 | 0.054 (0.023) | 3.62 | 1.48 |
| 1e12 | 0.95 | 0.0015 | 0.0202 (0.0032) | 13.7 | 0.0165 (0.0025) | 11.2 | 0.49 |

- eta* > 0 in all 144 (theta', window, pair, m) cells per height: the exchange leaves the form non-negative for small eta at every theta' < 1 tested. Proposition Z holds on zeta's ordinates in these windows (MEASURED), not only in the lattice model.
- eta* is above the lattice root in every cell (smallest ratio per theta' over all heights: 1.2 at 0.6, 1.5 at 0.8, 1.7 at 0.95). The registered prediction (0.3 to 1.2 of the root) was wrong: the lattice law is a lower bound here, not an estimate. Next to a long gap eta* is smaller at theta' = 0.6 (ratio 1.8 against 2.2) and not systematically smaller at 0.8 and 0.95.
- The threshold shrinks with height and with theta' (u eta* about 2.1 to 2.2 at 0.6, 1.0 to 1.5 at 0.8, 0.25 to 0.5 at 0.95), and is independent of the mode count.

**Item 4 (E_a, Fejer vector alone).** value(tau) = 2 Lg - 2 Re sum_(n <= P) Lambda(n)(n^a + n^(-a)) n^(-1/2 - i tau)(1 - log n/u), P = floor((T0/2 pi)^theta'); lowest value over abs(tau - t_w) <= 60, step 0.01, 8 windows; in units of Lg; sign at the minimiser certified by the radius.

| T0 | theta' | a | P | lowest value (min over windows, median) | certified negative | fraction of tau below 0 | paper-lane size P^a/(a^2 u Lg) |
|---|---|---|---|---|---|---|---|
| 1e6 | 0.5 | 0.1 | 398 | +0.73, +0.85 | 0 of 8 | 0 | 2.5 |
| 1e6 | 0.5 | 0.3 | 398 | +0.17, +0.44 | 0 of 8 | 0 | 0.93 |
| 1e6 | 0.75 | 0.1 | 7968 | +0.056, +0.16 | 0 of 8 | 0 | 2.3 |
| 1e6 | 0.75 | 0.3 | 7968 | -1.86, -1.65 | 8 of 8 | 0.068 | 1.5 |
| 1e6 | 1.0 | 0.1 | 159154 | -0.165, -0.128 | 8 of 8 | 0.003 | 2.3 |
| 1e6 | 1.0 | 0.3 | 159154 | -5.94, -5.58 | 8 of 8 | 0.27 | 2.8 |
| 1e9 | 0.5 | 0.1 | 12615 | +0.37, +0.54 | 0 of 8 | 0 | 1.4 |
| 1e9 | 0.5 | 0.3 | 12615 | -1.56, -1.04 | 8 of 8 | 0.016 | 1.1 |
| 1e9 | 0.75 | 0.1 | 1416984 | -0.19, -0.063 | 6 of 8 | 0.001 | 1.5 |
| 1e9 | 0.75 | 0.3 | 1416984 | -9.9, -8.3 | 8 of 8 | 0.28 | 2.9 |
| 1e9 | 1.0 | 0.1 | 159154943 | -0.83, -0.78 | 8 of 8 | 0.055 | 1.9 |
| 1e9 | 1.0 | 0.3 | 159154943 | -38.0, -36.7 | 8 of 8 | 0.44 | 9.0 |

The prediction "negative" holds at large P and fails at small P (five of twelve rows positive in every window). The predicted size is right within a factor 4 for a = 0.3 and too large by a factor 2 to 15 for a = 0.1. The Fejer vector alone does not exclude E_0.1 below theta' = 1 at 1e6; the full form on 96 to 384 modes does (section 5).

**Item 5 (sign chains, complete device Lg - 2 Re A_P^eps on m modes, u = theta' log(T0/2 pi)).** Cells in certified violation at M = 0 / M = 1; 24 chains; 40 windows at m = 96 (960 cells), 8 windows at m = 192, 384 (192 cells).

| T0 | theta' | m = 96 (of 960) | m = 192 (of 192) | m = 384 (of 192) | chains with a violation at M = 1 in at least one window (m = 96, 40 windows) |
|---|---|---|---|---|---|
| 1e6 | 0.6 | 4 / 0 | 0 / 0 | 2 / 0 | 0 of 24 |
| 1e9 | 0.6 | 12 / 2 | 9 / 1 | 11 / 1 | 2 of 24 |
| 1e12 | 0.6 | 27 / 9 | 5 / 2 | 11 / 5 | 9 of 24 |
| 1e6 | 0.8 | 430 / 88 | 129 / 34 | 172 / 61 | 24 of 24 |
| 1e9 | 0.8 | 441 / 180 | 138 / 63 | 178 / 106 | 24 of 24 |
| 1e12 | 0.8 | 461 / 233 | 140 / 87 | 180 / 135 | 24 of 24 |
| 1e6 | 1.0 | 941 / 687 | 192 / 179 | 192 / 191 | 24 of 24 |
| 1e9 | 1.0 | 939 / 825 | 192 / 188 | 192 / 192 | 24 of 24 |
| 1e12 | 1.0 | NOT RUN | NOT RUN | NOT RUN | |

zeta (Lg in place of Arch, no pole) holds in every cell of the same grid. The violation fraction is positive at each theta' and rises with theta', as predicted; at M = 1 it also rises with height. Fejer vector alone (fraction of tau in violation at M = 0): 0 to 4 decimals at theta' = 0.6; 0.0008 to 0.0010 at 0.8; 0.0058 to 0.0063 at 1.0. The measured standard deviation of the Fejer value is 0.38 to 0.40 u (paper lane: 0.41 u), and the Gaussian tail at 2.45/theta' standard deviations is 0.0011 at 0.8 and 0.0071 at 1.0: the prediction holds.

## 7. Why the device is closed, and what the measurement does give

1. What the completion can deliver. By Lemma P (ii) the completion gives N(theta) on the window with tolerance -lambda_min(E). For zeta the measured tolerance is the Riemann-Siegel remainder, 1.3 to 2.1 times (t/2 pi)^(-1/4) Lg, which tends to 0. So the strongest statement the device could ever prove is "N(theta) with tolerance o(Lg) in every window", for theta < 1.
2. That statement holds for ZQ. Item 1: at every theta' in {0.6, 0.8, 0.95} and every height the exchanged configuration keeps the form non-negative up to eta* > 0, with eta* above the lattice root of Proposition Z. Section 5: the one-sided defect of ZQ is zeta's plus a pair form that vanishes with eta. A conclusion that holds for ZQ cannot be reached by an argument that fails on ZQ, so R3 is not attainable for this conclusion. This is the second obstruction of the same kind on this device (the first: the c18 paper lane, in the lattice model; here on zeta's ordinates, certified).
3. The two-sided version is the target. If norm(E(u)) <= c Lg with c < 2u/Lg in a window, then no zero of zeta near the window is off the line at any eta (a pair replaces two unit masses of sigma by a form of norm about 2u) and every zero is matched by a sign change. For theta < 1 this is as strong as the target in the window plus simplicity at the resolution of the Riemann-Siegel remainder; it fails for zeta itself where the main sum misses a close pair (seen at 1e6), and nothing in the lane bounds E from the prime side without the zeros.
4. Where the positivity of the completion comes from. sigma is positive for every point set; the content is entirely in the defect. On the prime side the sign-change measure of 2 Re[e^(i vartheta) D_N] is the phase symbol of the splitting F_1 = e^(i vartheta) D_N (completion C1 of the c18 paper lane at P = sqrt(t/2 pi)) plus all higher harmonics of the phase; a bound of the defect would need a lower bound for abs(D_N) on the line. No step of that kind was attempted.
5. What is kept (MEASURED, not a lead): (i) the sign-change completion is a positive extension of zeta's band data up to the Riemann-Siegel remainder at 1e6, 1e9, 1e12, in contrast with the additive reflected atoms of c18; (ii) the mode-count table of the data form for all control classes up to m = 384; (iii) eta*(theta') on zeta's ordinates; (iv) K3 at 1e9 and 1e12.

## 8. Requirement flags

- R1 (multiplicativity essential): no. Lemma P uses positivity of a measure and linearity. Every chain is completely multiplicative and fails through the reserve. HQ2 has multiplicative coefficients and zeta's functional equation and fails by size at its row. Nothing reads multiplicativity.
- R2 (height-uniform, every window): no. 8 windows at three heights, 96 to 384 modes; sub-devices of N_all (GATE reading rule). The scaling of the defect with (t/2 pi)^(-1/4) is measured at three heights.
- R3 (every control fails at a named structural step): no. ZQ at eta = 0.01 passes at every mode count; the failures of the other classes are by zero or pole location, size, or the missing functional equation.
- R4 (reaches the critical line): no. The conclusion available is N(theta) with tolerance for theta < 1, which leaves pairs with u eta below the threshold of item 1; the positivity of zeta's forms was read off the verified zeros.

## 9. Registered predictions: scorecard

| Part | Prediction | Outcome |
|---|---|---|
| 1 | s_D positive; m = 384 between 0.3 and 0.8 of m = 96 | positive 216 of 216; ratios 0.27 to 0.62 (one below 0.3) |
| 2 | -e_min about 1e-1, 1e-2, 1e-3 within a factor 5; e_max larger at 1e6; RS1 smaller by (t/2 pi)^(-1/2) within 10 | sizes held (0.07, 0.012, 0.003); e_max held; RS1 is at the tail floor 5e-4 at all heights, so the predicted factor is met at 1e6 only |
| 3 | t_min below 1e-3; s_C = 0 within norm(E_u); norm(E_u) at most log m times norm(E) | t_min up to 0.027 (wrong at m = 96, 192); the other two held |
| 4 | chains: e_min below -0.25 in at least 90 percent | 100 percent |
| 5 | ZQ: e_min >= e_min(zeta) - mu - 0.02; passes at 0.01; fails at 0.25; e_max >= 1.5 u/Lg | all held |
| 6 | E_0.3 negative everywhere; E_0.1 negative in at least 90 percent at 1e9, 1e12 and at m = 384 at 1e6 | held (100 percent; also at m = 96 at 1e6 at M = 0) |
| 7 | DH negative in most windows | all windows |
| 8 | T-NR, HQ2 below -0.25 in every window | held |
| item 1 | eta* between 0.3 and 1.2 of the lattice root; smaller next to a long gap | wrong: 1.2 to 14 times the root; smaller next to a long gap only at theta' = 0.6 |
| outcome | (b) through ZQ at 0.01 and 0.05 | (b) through ZQ at 0.01; at 0.05 the pair form (-0.04 to -0.22) is between the thresholds |

## 10. Three weakest steps

1. Conventions of the controls. A sign chain has no functional equation, so "its Riemann-Siegel main sum" (zeta's vartheta and N with the chain's coefficients) is this lane's convention; ZQ's completion is zeta's point set minus the two points nearest the removed zeros; E_a is given the empty completion and its degree-two main sum was not computed; T-NR and HQ2 are given zeta's point set. The verdict (b) depends only on the ZQ convention and on Lemma Z, and would be the same for any completion of ZQ that differs from zeta's by finitely many points near the pair.
2. Scope of the certification. Signs are certified relative to the hand-derived radius of the prime sums; K3 confirms the engine to 7e-13 for X up to 1e9, and there is no direct sum at X = 3.98e9 and 1.58e10. The zeros outside J are replaced by the Arch density (measured floor 5e-4 Lg through the C0 variant and the self-test; not bounded). The located points are float64 (direct residual below 1e-10); Lemma P does not need them to be zeros, but the statement "defect of the main-sum completion" does. 8 windows per height, m at most 384, all forms are sub-devices of N_all.
3. Lemma Z (c) (norm of a displaced zero of order u^2 abs(d)) and the identification of the measured defect with the Riemann-Siegel remainder are ARGUED from the scaling at three heights and the C0 variant; no a-priori bound of lambda_min(E) from the prime side exists in this lane, and section 7 item 4 names what one would need without attempting it. The statement in section 7 item 3 that the two-sided test equals the target in the window is ARGUED (a pair form of norm about 2u against c Lg), not proved for a general window vector space.

## 11. Units, files

Server directory `~/rh-push/c19-rs-real-zero-completion-band-server/` (2.1 GB: new moment files, zero lists; left in place). Units (all finished; none stopped by hand; none running): rh-c19rs-cap, -stage1, -z6, -z912, -ext0..7, -self, -t6, -c1e6-w*, -c1e9-w*, -c1e12-w* (24 units, 15 to 19 minutes each), -i1-*, -i4-*, -i5a-*, -i5m192-*, -i5m384-*, -k3-*. At most 16 single-thread units at a time; GPU 1 for `rsgrid.py` only (about 2.4 GB). One read of the c18 lane's moment files and a copy of its engine binary; nothing else outside the lane directory was touched. No local numerical run (no python-flint locally); `aggregate.py`, `m1table.py`, `mkcfg.py` are text processing.

Files: `PREREG.md`, `rsgrid.py`, `rsc.py`, `comp.py`, `owed.py`, `k3.py`, `tz.py` and `engine.c` (copies from the c18 lane), `stage1.sh`, `bounds.json`, `res_*.jsonl` (13104 records), `owed1_*.jsonl`, `owed4_*.jsonl`, `owed5_*.jsonl`, `zeros_*_meta.json`, `tables.txt`, `tables_m1.txt`, `units.txt`, `logs/`, `lanes.jsonl`.

Proposed map text (addendum to rows Q30 and P45; second same-kind obstruction on the band device): "N(theta) completed by the sign-change measure of the Riemann-Siegel main sum (positive by construction; Q_D = T_sigma + E, tolerance = -lambda_min(E)). zeta, prime side, 1e6, 1e9, 1e12, 8 windows, 96 to 384 modes, ball enclosures: -lambda_min(E) = 1.3 to 2.1 (t/2 pi)^(-1/4) Lg; at most 5e-4 Lg with the C0 term. ZQ at eta = 0.01 has the same one-sided defect (its pair form only) and passes at every mode count; exchange threshold eta* > 0 on zeta's ordinates at theta' = 0.6, 0.8, 0.95, above the lattice root in every cell. Chains, DH, E_a, T-NR, HQ2 fail by the missing functional equation, zero or pole location, or size; no step reads multiplicativity. The two-sided version is the target in the window. MEASURED; closed. `c19-rs-real-zero-completion-band-server`."
