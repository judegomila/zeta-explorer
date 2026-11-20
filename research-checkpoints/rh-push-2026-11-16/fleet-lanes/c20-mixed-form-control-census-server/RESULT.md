# c20-mixed-form-control-census-server: the second-order mixed form with the archimedean reserve, every control class; Theorem A with an enclosed tail

Internal working note, 2026-11-20, campaign round 20 (attack, kind: compute; support lane for `c20-u4-second-order-archimedean-mixed-form`, which had no directory during this run).
RH is open. No statement about zeros of zeta is made. Every zero below is a zero of a partial sum D_P; every inequality tested is an inequality between finite sums over n < P. NO QED.
Labels: CERTIFIED (python-flint ball arithmetic) / PROVED (argument written here, elementary) / CLASSICAL (recalled, not opened) / MEASURED (float64 screen) / POST-HOC (chosen after data were seen) / OPEN.

**Verdict: precise obstruction (registered outcome (a), and outcome (d) in a post-registration extension). The mixed form T2 >= 0 is closed as a route: MEASURED for the census, CERTIFIED at the deciding points.** Flags R1 = R2 = R3 = R4 = false.

1. (Part 1; PROVED lemma, CERTIFIED numbers.) The limit in Theorem A (form V0 of round 19) is enclosed. For six series (zeta coefficients at P = 12, 20, 30; three non-multiplicative ones), complete certified zero lists to abs(Im beta) < 12800 (up to 13858 zeros), two test vectors: abs(left side - regularised zero sum) is between 1.7e-27 and 9.6e-24 norm(h)^2 at T = 12800 and lies inside the proved tail bound (8e-17 to 1e-12 with the classical zero count; 4e-15 to 6e-11 with an elementary Jensen count that uses no recalled theorem) at all 60 rows.
2. (Part 1b; CERTIFIED at fixed T, limit not enclosed.) The Hermitian second-order identity (Lemma Q2 of c19 in the form the mixed form needs) holds with constant 0, not the constant -u^2/4 registered in GATE: the defect decays as T^-3 for all six series (defect x T^3 constant within 13 percent over T = 800 to 12800 at tau = 7.3; between 3.6 and 16 at tau = 0 with one lower value). The zero-side formula of the mixed form is corrected accordingly (section 3.2).
3. (Part 2; MEASURED on 14 cells x 24 windows x 59 objects, signs CERTIFIED at 172 points of the census and 16 of the extension.) In the registered sample zeta has no negative grid point at any cell (t = 1e4 ... 1e10, theta' = 0.5 ... 0.95). So do DEL (zero at 0.75), both ZQ (float only), Liouville, and between 17 and 24 of the 24 sign chains at every cell. This is registered outcome (a).
4. (Extension, post-registration; CERTIFIED.) On 600 windows at theta' = 0.95 zeta itself has T2 < 0: one window at t = 1e6 (T2/(c0 Lg^2) = -0.009476 at x = 1024177.34) and four at t = 1e8 (lowest -0.022102), each confirmed negative in balls of radius below 3e-26. DEL is positive on all 600 windows at both heights. T2 >= 0 is therefore not an inequality satisfied by the partial sums of zeta at theta' = 0.95, and it is satisfied on the same windows by a control with a zero at 0.75.
5. (PROVED identity, MEASURED size.) T2 = (T1^2 - K^2)/(2 c0) + [dispersion + commutator], K = 2 Im S1. Over 21312 window minima (zeta, DEL, ZQ, Liouville, sign and Haar chains) the bracket has mean 0.015 and standard deviation 0.009 in units of c0 Lg^2, range -0.075 to 0.118, and correlation 0.81 to 0.93 with T1 (section 3.3). All 38 failing minima of these classes have T1/(c0 Lg) between 0.07 and 0.29. The mixed form is, to within the bracket, half the square of the first-order value: it is negative only where the first-order form T1 is small. It reads the size of the prime sum against the reserve and nothing else that was found: objects with a smaller prime sum (DEL) pass with a larger margin; objects with a large local factor (T-NR, HQ4, HQ2, E_a) fail by size.

---

## 1. Plan, sources, order of work, deviations

Read: BRIEF to the end; `c19-u4-joint-prime-phase-quadratic-dp-zeros` (Lemma Q2, Lemma N, weakest step 3: "an inequality mixing A_P with the archimedean operator at second order ... is not covered"); `c18-tz-one-sided-bound-fe-reserve-bridge` (Theorem A with the corrections entered 2026-11-20, Lemma 1, controls table, FOR_NUMERICS_LANE); `c19-dp-zero-census-truncation-identity-server` (RESULT, `runA.py`, `runBC.py`: class conventions, seeding, P = floor((t/2 pi)^theta')); OBSTRUCTION_MAP section 2 rows HQ2, DEL, B and row P58; `c19-hq2-screen-fe-int-mult-pos-devices/MAP_ROW.md` (HQ3, HQ4); `c12-control-battery-harness/README.md` (DEL count 16210 below 1e7, reproduced here).

`GATE.md` was written before any code of this lane ran. Order: Part 1 smoke test; float pipeline checked against brute force; decisive first test (zeta and all classes at t = 1e4); full census; ball stage; referee extension.

Deviations from GATE, all of them:
- (D1) The self-test of the float code (`selftest_float.py`) ran one window of the cell (1e4, 0.95) before the registered first test. It was run to debug two errors in the moment code (both found by the brute-force comparison); the numbers it printed for that window were seen before the census.
- (D2) GATE registers the constant -u^2/4 in Part 1b and (R - u)^2/2 in the zero-side formula of T2. Both are wrong; the run gives 0 and (R - u)^2/2 + u^2/2 (section 3.2). GATE had registered this contingency ("reported as found").
- (D3) The zero-side decomposition by right zeros of D_P was not computed. The per-zero term decays like 1/distance, so a window list of right zeros (the c19 files) does not determine a part; Part 1b tests the zero-side formula on complete lists instead. The c19 right-zero lists were not used; the c19 zero-certification code was (unchanged copy `runA_c19.py`).
- (D4) ZQ has no ball implementation: its 24 cells are float only (margin at least 0.011 against a float error measured at 4e-13 on an independent quadrature check). ZQ was not run at t = 1e10 (zeta zeros at index 3e10 not computed).
- (D5) t = 1e10 was run for theta' = 0.5 and 0.7 only (P <= 7e7 rule and time).
- (D6) After the census a referee extension was run (zeta, Liouville, DEL on 600 windows at theta' = 0.95, t = 1e6 and 1e8; a 10-times finer tau grid on the registered windows). It is not part of the registered design and is labelled as such wherever used.
- (D7) GPU not used (nothing GPU-shaped). Server use: 17 units, at the peak about 16 cores and memory limits summing to about 40 GB requested at one time (limits, not use: planned use per worker 0.4 to 0.9 GB), the longest unit 16 minutes; rh.slice was at 28 to 39 GB at every check. `mixed.py` was edited twice while units were running (a ZQ skip switch; a step override for the fine grid); running units had already loaded the earlier text and the census numbers come from the text without the two switches, which change nothing when unset.
- (D8) `trivbound.py` first wrote `trivbound.json` to the repository root (relative path); the file was moved into this directory. Nothing else was written outside it.

## 2. Part 1: Theorem A with an enclosed tail

Setting (c18 Theorem A, form V0 of c19): a_1 = 1, a_P != 0, D_P(s) = sum_{n <= P} a_n n^(-s), u = log P, zeros beta, w = beta - 1/2, h in L^2[0, u],
Phi(beta) = <h, kappa_beta h> = int_0^u q(xi) e^(w xi) d xi with q(xi) = 2 Re <h, C_xi h>.
V0: -2 Re <h, A_P h> = -u norm(h)^2 + lim_T sum_{abs(Im beta) < T} Phi(beta).

**Lemma T (tail; PROVED from V0's partial-fraction input).** Let h = sin^4(pi s/u) e^(i tau s). Then q is a finite sum of terms (alpha + beta xi) e^(i nu xi), q^(k)(u) = 0 for k <= 8 (the autocorrelation of a function vanishing to order 4 at both ends vanishes to order 9 at u), and six integrations by parts give

    Phi(beta) = sum_{k=0}^{5} (-1)^(k+1) q^(k)(0) w^-(k+1) + rho(beta),    abs(rho(beta)) <= K6 abs(w)^-6,    K6 = max(1, P^(sigma_R - 1/2)) u sup_[0,u] abs(q^(6)),

where sigma_R is any abscissa with sum_{n >= 2} abs(a_n) n^(-sigma_R) < 1 (so Re beta < sigma_R). From D_P'/D_P(s) = -u/2 + lim_T sum 1/(s - beta) (CLASSICAL; re-derived by the c19 referee) and its derivatives, with l_k the Taylor coefficients of D_P'/D_P at 1/2 (D_P(1/2) != 0 assumed and true for the six series): sum over all zeros of w^-1 = -(l_0 + u/2) in the symmetric limit, and sum of w^-(k+1) = -l_k for k >= 1 (absolutely convergent). Hence for every T that is not the ordinate of a zero

    -2 Re <h, A_P h> = sum_{abs(Im beta) < T} [ Phi(beta) - sum_{k<6} (-1)^(k+1) q^(k)(0) w^-(k+1) ] + 2 norm(h)^2 l_0 + sum_{k=1}^{5} (-1)^k q^(k)(0) l_k + Rem(T),
    abs(Rem(T)) <= K6 sum_{abs(Im beta) >= T} abs(Im beta)^-6.

Count input, two versions: (i) CLASSICAL (zeros of an exponential sum with at most P terms in a horizontal strip of height H number u H/2 pi up to P - 1; recalled, not opened): Rem <= K6 (12/5)(u T/2 pi + P - 1) T^-6. (ii) PROVED (Jensen's inequality on a disc centred at sigma_0 + i(y + 1/2), sigma_0 = sigma_R + 1/2, radius 3 r, r the distance to the far corner of the box [sigma_L, sigma_R] x [y, y + 1]): at most N_J zeros in each such box, N_J computed in balls (35 to 200 for the six series), and Rem <= 2 K6 N_J (T^-6 + T^-5/5). Version (ii) uses no recalled theorem beyond the partial-fraction expansion. QED.

The q^(k)(0) with k odd are included as computed balls (they contain 0, radius below 1e-71), so no parity claim is used. q^(k)(u) = 0 for k <= 8 is used exactly and was confirmed in balls (radius below 2e-68; q^(9)(u) = -7519, -242805 at P = 12, 5).

Computation (`tailA.py`; prec 128 for winding numbers, 256 for zeros and sums; zero balls of radius 2^-170, count certified by winding number in 1281 slabs per series; the certification functions are those of c19 `runA.py`). All 60 rows (6 series x tau in {0, 7.3} x T in {800, 1600, 3200, 6400, 12800}) are enclosed under both counts; rows at T = 800, 6400, 12800:

| series | P | sigma_R | zeros with abs(Im) < 12800 | largest deviation of a slab count from 10u/2pi (bound P-1) | N_J | tau | T | abs(lhs - rhs_T)/norm^2 | tail bound, count (i) | tail bound, count (ii) | 2nd-order defect, constant 0 | defect x T^3 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| zeta12 | 12 | 1.75 | 10124 | 1.05 (11) | 61 | 0.0 | 800 | 2.36e-18 | 5.45e-10 | 1.36e-08 | 6.97e-09 | 3.6 |
| zeta12 | 12 | 1.75 | 10124 | 1.05 (11) | 61 | 0.0 | 6400 | 1.06e-24 | 1.61e-14 | 4.13e-13 | 3.72e-11 | 9.8 |
| zeta12 | 12 | 1.75 | 10124 | 1.05 (11) | 61 | 0.0 | 12800 | 8.44e-27 | 5.03e-16 | 1.29e-14 | 4.59e-12 | 9.6 |
| zeta12 | 12 | 1.75 | 10124 | 1.05 (11) | 61 | 7.3 | 800 | 1.34e-15 | 2.59e-07 | 6.49e-06 | 6.14e-07 | 314.2 |
| zeta12 | 12 | 1.75 | 10124 | 1.05 (11) | 61 | 7.3 | 6400 | 6.01e-22 | 7.69e-12 | 1.97e-10 | 1.31e-09 | 342.8 |
| zeta12 | 12 | 1.75 | 10124 | 1.05 (11) | 61 | 7.3 | 12800 | 4.77e-24 | 2.40e-13 | 6.15e-12 | 1.63e-10 | 342.0 |
| zeta20 | 20 | 1.75 | 12206 | 1.77 (19) | 119 | 0.0 | 800 | 7.28e-19 | 4.95e-10 | 1.97e-08 | 1.25e-08 | 6.4 |
| zeta20 | 20 | 1.75 | 12206 | 1.77 (19) | 119 | 0.0 | 6400 | 4.31e-25 | 1.45e-14 | 5.99e-13 | 3.83e-11 | 10.0 |
| zeta20 | 20 | 1.75 | 12206 | 1.77 (19) | 119 | 0.0 | 12800 | 3.27e-27 | 4.51e-16 | 1.87e-14 | 4.21e-12 | 8.8 |
| zeta20 | 20 | 1.75 | 12206 | 1.77 (19) | 119 | 7.3 | 800 | 1.02e-15 | 5.76e-07 | 2.30e-05 | 8.65e-07 | 443.0 |
| zeta20 | 20 | 1.75 | 12206 | 1.77 (19) | 119 | 7.3 | 6400 | 6.04e-22 | 1.69e-11 | 6.97e-10 | 1.82e-09 | 478.2 |
| zeta20 | 20 | 1.75 | 12206 | 1.77 (19) | 119 | 7.3 | 12800 | 4.59e-24 | 5.25e-13 | 2.18e-11 | 2.22e-10 | 465.9 |
| zeta30 | 30 | 1.75 | 13858 | 1.59 (29) | 200 | 0.0 | 800 | 5.52e-19 | 5.03e-10 | 2.92e-08 | 1.63e-08 | 8.4 |
| zeta30 | 30 | 1.75 | 13858 | 1.59 (29) | 200 | 0.0 | 6400 | 2.28e-25 | 1.45e-14 | 8.86e-13 | 3.41e-11 | 8.9 |
| zeta30 | 30 | 1.75 | 13858 | 1.59 (29) | 200 | 0.0 | 12800 | 1.74e-27 | 4.51e-16 | 2.77e-14 | 4.48e-12 | 9.4 |
| zeta30 | 30 | 1.75 | 13858 | 1.59 (29) | 200 | 7.3 | 800 | 1.48e-15 | 1.10e-06 | 6.41e-05 | 1.14e-06 | 581.4 |
| zeta30 | 30 | 1.75 | 13858 | 1.59 (29) | 200 | 7.3 | 6400 | 6.10e-22 | 3.18e-11 | 1.95e-09 | 2.24e-09 | 587.5 |
| zeta30 | 30 | 1.75 | 13858 | 1.59 (29) | 200 | 7.3 | 12800 | 4.65e-24 | 9.91e-13 | 6.08e-11 | 2.83e-10 | 592.8 |
| N5 | 5 | 1.50 | 6558 | 1.56 (4) | 35 | 0.0 | 800 | 4.11e-17 | 6.82e-10 | 1.53e-08 | 3.10e-08 | 15.9 |
| N5 | 5 | 1.50 | 6558 | 1.56 (4) | 35 | 0.0 | 6400 | 1.77e-23 | 2.05e-14 | 4.66e-13 | 4.80e-11 | 12.6 |
| N5 | 5 | 1.50 | 6558 | 1.56 (4) | 35 | 0.0 | 12800 | 1.36e-25 | 6.39e-16 | 1.45e-14 | 5.25e-12 | 11.0 |
| N5 | 5 | 1.50 | 6558 | 1.56 (4) | 35 | 7.3 | 800 | 3.55e-15 | 5.18e-08 | 1.16e-06 | 3.86e-07 | 197.6 |
| N5 | 5 | 1.50 | 6558 | 1.56 (4) | 35 | 7.3 | 6400 | 1.53e-21 | 1.55e-12 | 3.53e-11 | 6.98e-10 | 182.9 |
| N5 | 5 | 1.50 | 6558 | 1.56 (4) | 35 | 7.3 | 12800 | 1.18e-23 | 4.85e-14 | 1.10e-12 | 8.46e-11 | 177.5 |
| N12 | 12 | 1.75 | 10124 | 1.05 (11) | 46 | 0.0 | 800 | 1.54e-18 | 5.45e-10 | 1.03e-08 | 1.12e-08 | 5.7 |
| N12 | 12 | 1.75 | 10124 | 1.05 (11) | 46 | 0.0 | 6400 | 7.20e-25 | 1.61e-14 | 3.12e-13 | 2.58e-11 | 6.8 |
| N12 | 12 | 1.75 | 10124 | 1.05 (11) | 46 | 0.0 | 12800 | 5.66e-27 | 5.03e-16 | 9.73e-15 | 3.15e-12 | 6.6 |
| N12 | 12 | 1.75 | 10124 | 1.05 (11) | 46 | 7.3 | 800 | 8.72e-16 | 2.59e-07 | 4.89e-06 | 6.22e-07 | 318.3 |
| N12 | 12 | 1.75 | 10124 | 1.05 (11) | 46 | 7.3 | 6400 | 4.07e-22 | 7.69e-12 | 1.48e-10 | 1.24e-09 | 324.9 |
| N12 | 12 | 1.75 | 10124 | 1.05 (11) | 46 | 7.3 | 12800 | 3.20e-24 | 2.40e-13 | 4.64e-12 | 1.55e-10 | 324.1 |
| DH12 | 12 | 1.00 | 10124 | 2.05 (11) | 109 | 0.0 | 800 | 4.65e-18 | 8.45e-11 | 3.77e-09 | 2.90e-08 | 14.8 |
| DH12 | 12 | 1.00 | 10124 | 2.05 (11) | 109 | 0.0 | 6400 | 2.12e-24 | 2.50e-15 | 1.15e-13 | 4.59e-11 | 12.0 |
| DH12 | 12 | 1.00 | 10124 | 2.05 (11) | 109 | 0.0 | 12800 | 1.70e-26 | 7.80e-17 | 3.58e-15 | 4.89e-12 | 10.3 |
| DH12 | 12 | 1.00 | 10124 | 2.05 (11) | 109 | 7.3 | 800 | 2.63e-15 | 4.02e-08 | 1.80e-06 | 7.53e-07 | 385.6 |
| DH12 | 12 | 1.00 | 10124 | 2.05 (11) | 109 | 7.3 | 6400 | 1.20e-21 | 1.19e-12 | 5.46e-11 | 1.37e-09 | 359.5 |
| DH12 | 12 | 1.00 | 10124 | 2.05 (11) | 109 | 7.3 | 12800 | 9.61e-24 | 3.72e-14 | 1.70e-12 | 1.65e-10 | 346.5 |

(The zero count in column 4 is twice the certified winding total of the upper half; no zero of the six series lies in abs(Im) < 0.3 except real ones, which the first slab counts once.) Ball radius of the difference: at most 5.3e-47 norm^2. The difference itself falls by a factor 105 to 171 per doubling of T (about T^-7; the bound falls as T^-5), so the bound is not sharp by a factor 1e8 to 1e11 at T = 12800. Enclosure of the limit: for zeta at P = 30, tau = 0, lim_T sum_{abs(Im beta) < T} <h, kappa_beta h>/norm^2 = 2.2120641136321324 +- 4.6e-16 (count (i); +- 2.8e-14 with count (ii)), and the value forced by the prime side lies inside. The raw (unregularised) tail times T pi/(u - 2 log abs(a_P)) is 0.997 to 1.004 at T >= 3200, the law of c19. The pointwise inequality abs(rho) <= K6 abs(w)^-6 was tested at 200 random points per series and tau (largest ratio 0.027).

What is and is not enclosed: the statement certified is "the prime side equals the regularised partial zero sum up to Rem(T), and Rem(T) is below the stated bound"; it rests on the partial-fraction expansion with constant -u/2 (CLASSICAL, proof on file in the c19 referee report) and, for count (i), on one recalled theorem. Registered prediction (holds at every row; width below 1e-9 at T = 6400): met (largest width at T = 6400: 3.2e-11 count (i), 1.9e-9 count (ii); the second is above 1e-9 for zeta30 at tau = 7.3 only).

### Part 1b: the second-order identity on the same zero lists (CERTIFIED at fixed T)

With C(xi) = <h, C_xi h>, G(beta) = int_0^u C(xi) e^(w xi) d xi, r_beta = D_P''(beta)/D_P'(beta), S2 = sum_{n<P} Lambda_2(n) n^(-1/2) C(log n) and Lambda_2 the coefficients of F''/F:

    S2 = sum_{abs(Im beta) < T} r_beta [ G(beta) + C(0)/w - C'(0)/w^2 ] + C(0) (D_P''/D_P)(1/2) - C'(0) (D_P''/D_P)'(1/2) + O(T^-3).

Last two columns of the table: the defect is 3e-12 to 5e-12 norm^2 (tau = 0) and 8e-11 to 3e-10 (tau = 7.3) at T = 12800, and defect x T^3 is constant within 13 percent over the five values of T at tau = 7.3 and lies between 3.6 and 16 at tau = 0 (one lower value, 0.28, N12 at T = 3200). With the registered constant (-u^2/4 added) the defect equals u^2/4 at every T to 9 digits: the registered constant is wrong. Reason: the one-sided transform of the point mass at 0 carries full weight, sum_beta r_beta e^(w_beta xi) = Lambda_2-measure - (u^2/2) delta_0 on xi >= 0, and sum_beta r_beta/(s - beta) = D''/D(s) - u^2/2; the two terms cancel. The registered rate T^-2 is also wrong (T^-3 observed: the w^-2 term was regularised). The identity holds for the three non-multiplicative series as for zeta: no multiplicativity is used.

## 3. Part 2: the mixed form

### 3.1 Object (as registered)

A = sum_{n<P} Lambda_F(n) n^(-1/2) C_(log n), B = R/2 - A, X = multiplication by s on L^2[0, u]:

    T1(h) = 2 Re <h, B h>,     T2(h) = 2 Re <h, (B^2 + [X, A]) h> = (R^2/2) norm^2 - 2 R Re <h, A h> + 2 Re <h, A_2 h>,     A_2 = A^2 + [X, A].

PROVED (two lines): [X, C_a] = a C_a and n^(-s) -> n^(-1/2) C_(log n) is a homomorphism, so A^2 + [X, A] has coefficients Lambda * Lambda + Lambda log = Lambda_2, and B^2 + [X, A] is the image of E''/E for E = e^(i vartheta) F with vartheta' = R/2. For h_x = sin^4(pi s/u) e^(ixs): T2(x)/c0 = R^2/2 - 2 R Re S1/c0 + 2 Re S2/c0, c0 = 35u/128, S_k(x) = sum_{n<P} Lambda_k(n) n^(-1/2 - ix) c(log n). Statistic: m = min over the tau grid of T2/(c0 Lg^2).

### 3.2 Zero side (corrected)

From V0 and Part 1b, in the symmetric limit: T2 = c0 [ (R - u)^2/2 + u^2/2 ] + 2 Re sum_beta (R + r_beta) G(beta), R + r_beta = (R - u) + 2 sum_{beta' != beta} 1/(beta - beta'). Check on D = 1 + 2^(-s) (P = 2, r_beta = -u, no atom below P): the right side is c0 R^2/2, the left side also. GATE had (R - u)^2/2 without u^2/2.

### 3.3 Sector identity (PROVED; the reading of the result)

<h, B h> = (T1 - i K)/2 with K = 2 Im S1. Hence

    T2 = (T1^2 - K^2)/(2 c0) + 2 Re [ <h, B^2 h> - <h, B h>^2/c0 ] + 2 Re <h, [X, A] h>.

The first term (sector term) is 2 Re of the square of the first-order value: non-negative iff that value lies in the sector abs(arg) <= pi/4. MEASURED (POST-HOC; window minima of zeta, DEL, ZQ, Liouville, sign chains, Haar chains, census and extension, 21312 minima; units c0 Lg^2, T1n = T1/(c0 Lg), Kn = K/(c0 Lg)):

| theta' | minima | bracket: mean | sd | lowest | correlation of the bracket with T1n |
|---|---|---|---|---|---|
| 0.5 | 5040 | 0.0072 | 0.0027 | -0.0137 | 0.93 |
| 0.7 | 5040 | 0.0117 | 0.0051 | -0.0415 | 0.87 |
| 0.85 | 3816 | 0.0167 | 0.0071 | -0.0546 | 0.84 |
| 0.95 | 7416 | 0.0219 | 0.0097 | -0.0750 | 0.81 |

At the 38 failing minima of these classes: T1n between 0.073 and 0.285, abs(Kn) at most 0.39, sector term between -0.037 and 0.026 (negative at 11), bracket between -0.075 and 0.019 (median -0.026). So T2/(c0 Lg^2) = T1n^2/2 up to a correction of size at most 0.08 that itself falls with T1n; a negative value needs T1n below about 0.3, and in the sample no point with T1n above 0.285 fails. The inequality T2 >= 0 is therefore a first-order margin statement ("T1 is not small") with second-order noise; nothing in it reads a zero of F that T1 does not already read. Referee rerun of the zeta point of 3.5 at t = 1e6: T1n = 0.2004, sector term 0.0176, bracket -0.0271.

Consequence used below: for any F, T2/(c0 Lg^2) >= 1/2 - a1max/Lg - a2max/Lg^2 with a1max, a2max the sums of absolute values. This triangle floor (`trivbound.py`, column "floor") is positive at (1e4, 0.5), (1e4, 0.7), (1e6, 0.5): there PASS is forced for zeta and for every unimodular completely multiplicative chain, with no arithmetic input.

### 3.4 Census (registered design)

Entries: min over 24 windows (t_w = t + 200 w, tau in [-40, 40], step 0.02) of T2/(c0 Lg^2); "(k)" = number of windows with a negative grid point; "[k/24]" = number of seeds with one; "u" = sign not decided in balls (ZQ only). Every other entry has its sign CERTIFIED at the argmin. Order of columns: classes that pass with zeta first.

| t | theta' | P | floor | zeta | DEL | ZQ0.01 | ZQ0.1 | LIOU | chain | haar | HQ3 | DH | EA | HQ2 | TNR | HQ4 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 10000 | 0.5 | 39 | 0.279 | 0.341 | 0.357 | 0.336 u | 0.335 u | 0.341 | 0.340 [0/24] | 0.341 [0/24] | 0.337 | 0.673 | 1.306 | 0.340 | 0.158 | -0.047 (24) |
| 10000 | 0.7 | 174 | 0.004 | 0.212 | 0.281 | 0.212 u | 0.212 u | 0.213 | 0.203 [0/24] | 0.204 [0/24] | 0.204 | 0.551 | 0.709 | 0.207 | 0.004 | -0.184 (24) |
| 10000 | 0.85 | 526 | -0.288 | 0.135 | 0.235 | 0.135 u | 0.135 u | 0.138 | 0.114 [0/24] | 0.111 [0/24] | 0.123 | 0.429 | 0.332 | 0.124 | -0.044 (14) | -0.217 (24) |
| 10000 | 0.95 | 1100 | -0.538 | 0.096 | 0.209 | 0.096 u | 0.096 u | 0.100 | 0.063 [0/24] | 0.063 [0/24] | 0.082 | 0.348 | 0.133 | 0.081 | -0.089 (22) | -0.254 (24) |
| 1e+06 | 0.5 | 398 | 0.102 | 0.242 | 0.322 | 0.242 u | 0.242 u | 0.255 | 0.239 [0/24] | 0.232 [0/24] | 0.233 | 0.468 | 0.879 | 0.235 | 0.102 | -0.096 (24) |
| 1e+06 | 0.7 | 4377 | -0.401 | 0.107 | 0.241 | 0.107 u | 0.107 u | 0.133 | 0.097 [0/24] | 0.091 [0/24] | 0.087 | 0.280 | 0.236 | 0.073 | 0.002 | -0.208 (24) |
| 1e+06 | 0.85 | 26396 | -1.039 | 0.039 | 0.191 | 0.039 u | 0.039 u | 0.058 | 0.015 [0/24] | 0.025 [0/24] | 0.009 | 0.174 | -0.117 (2) | -0.035 (2) | -0.083 (13) | -0.259 (24) |
| 1e+06 | 0.95 | 87443 | -1.662 | 0.011 | 0.161 | 0.011 u | 0.011 u | 0.010 | -0.022 [5/24] | -0.005 [1/24] | -0.024 (1) | 0.108 | -0.271 (3) | -0.099 (6) | -0.212 (23) | -0.347 (24) |
| 1e+08 | 0.5 | 3989 | -0.095 | 0.226 | 0.306 | 0.226 u | 0.226 u | 0.206 | 0.179 [0/24] | 0.195 [0/24] | 0.213 | 0.357 | 0.818 | 0.205 | 0.135 | -0.087 (24) |
| 1e+08 | 0.7 | 109969 | -1.019 | 0.124 | 0.220 | 0.124 u | 0.124 u | 0.119 | 0.062 [0/24] | 0.069 [0/24] | 0.084 | 0.170 | 0.289 | -0.003 (1) | -0.017 (2) | -0.198 (24) |
| 1e+08 | 0.85 | 1322961 | -2.451 | 0.057 | 0.170 | 0.057 u | 0.057 u | 0.049 | -0.006 [2/24] | -0.035 [2/24] | -0.004 (1) | 0.029 | -0.072 (2) | -0.221 (24) | -0.266 (24) | -0.237 (24) |
| 1e+08 | 0.95 | 6945909 | -4.084 | 0.029 | 0.147 | 0.029 u | 0.029 u | 0.011 | -0.037 [7/24] | -0.086 [7/24] | -0.047 (1) | -0.180 (3) | -0.239 (3) | -0.383 (24) | -0.518 (24) | -0.307 (24) |
| 1e+10 | 0.5 | 39894 | -0.358 | 0.184 | 0.288 | not run | not run | 0.137 | 0.168 [0/24] | 0.143 [0/24] | 0.182 | 0.284 | 0.610 | 0.140 | 0.118 | -0.105 (24) |
| 1e+10 | 0.7 | 2762320 | -2.105 | 0.062 | 0.189 | not run | not run | 0.063 | 0.012 [0/24] | 0.049 [0/24] | 0.075 | 0.089 | -0.000 (1) | -0.185 (24) | -0.252 (22) | -0.224 (24) |

| t | theta' | zeta: min T1n | zeta: median window min of T2n | DEL: primes deleted below P | DEL: min T1n | chains: lowest / median / highest member minimum | Haar: lowest / median / highest | Q1 sd/(R u), zeta / chains | Q2 sd/u^2, zeta / chains | Q2a sd, Q2b sd (zeta) | max abs(S1_ZQ - S1_zeta)/c0, eta = 0.01 / 0.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 10000 | 0.5 | 0.811 | 0.352 | 7 | 0.833 | 0.340 / 0.343 / 0.344 | 0.341 / 0.343 / 0.345 | 0.156 / 0.156 | 0.0396 / 0.0397 | 0.0381, 0.0057 | 0.011 / 0.016 |
| 10000 | 0.7 | 0.630 | 0.253 | 17 | 0.727 | 0.203 / 0.217 / 0.225 | 0.204 / 0.217 / 0.228 | 0.174 / 0.174 | 0.0421 / 0.0423 | 0.0387, 0.0110 | 0.031 / 0.045 |
| 10000 | 0.85 | 0.498 | 0.195 | 31 | 0.650 | 0.114 / 0.132 / 0.154 | 0.111 / 0.138 / 0.153 | 0.179 / 0.179 | 0.0431 / 0.0434 | 0.0388, 0.0136 | 0.056 / 0.081 |
| 10000 | 0.95 | 0.418 | 0.163 | 47 | 0.599 | 0.063 / 0.085 / 0.116 | 0.063 / 0.092 / 0.115 | 0.182 / 0.182 | 0.0435 / 0.0439 | 0.0389, 0.0147 | 0.078 / 0.113 |
| 1e+06 | 0.5 | 0.691 | 0.290 | 27 | 0.791 | 0.239 / 0.257 / 0.267 | 0.232 / 0.252 / 0.261 | 0.178 / 0.178 | 0.0430 / 0.0432 | 0.0387, 0.0130 | 0.030 / 0.052 |
| 1e+06 | 0.7 | 0.476 | 0.215 | 107 | 0.670 | 0.097 / 0.134 / 0.162 | 0.091 / 0.135 / 0.160 | 0.185 / 0.185 | 0.0445 / 0.0446 | 0.0392, 0.0164 | 0.083 / 0.143 |
| 1e+06 | 0.85 | 0.330 | 0.156 | 323 | 0.583 | 0.015 / 0.066 / 0.101 | 0.025 / 0.062 / 0.101 | 0.188 / 0.188 | 0.0454 / 0.0452 | 0.0398, 0.0178 | 0.148 / 0.256 |
| 1e+06 | 0.95 | 0.247 | 0.117 | 693 | 0.520 | -0.022 / 0.029 / 0.074 | -0.005 / 0.030 / 0.069 | 0.190 / 0.190 | 0.0458 / 0.0455 | 0.0402, 0.0185 | 0.206 / 0.357 |
| 1e+08 | 0.5 | 0.670 | 0.282 | 101 | 0.770 | 0.179 / 0.218 / 0.239 | 0.195 / 0.213 / 0.240 | 0.185 / 0.185 | 0.0444 / 0.0445 | 0.0393, 0.0163 | 0.041 / 0.100 |
| 1e+08 | 0.7 | 0.497 | 0.209 | 804 | 0.640 | 0.062 / 0.117 / 0.147 | 0.069 / 0.113 / 0.155 | 0.190 / 0.190 | 0.0453 / 0.0455 | 0.0401, 0.0184 | 0.112 / 0.274 |
| 1e+08 | 0.85 | 0.354 | 0.154 | 4138 | 0.548 | -0.006 / 0.048 / 0.086 | -0.035 / 0.060 / 0.090 | 0.193 / 0.193 | 0.0458 / 0.0460 | 0.0407, 0.0194 | 0.200 / 0.491 |
| 1e+08 | 0.95 | 0.270 | 0.115 | 12653 | 0.496 | -0.037 / 0.015 / 0.063 | -0.086 / 0.023 / 0.047 | 0.195 / 0.194 | 0.0462 / 0.0462 | 0.0411, 0.0199 | 0.279 / 0.687 |
| 1e+10 | 0.5 | 0.615 | 0.261 | 419 | 0.747 | 0.168 / 0.199 / 0.222 | 0.143 / 0.197 / 0.239 | 0.189 / 0.189 | 0.0455 / 0.0452 | 0.0400, 0.0179 | not run |
| 1e+10 | 0.7 | 0.409 | 0.177 | 6783 | 0.594 | 0.012 / 0.099 / 0.147 | 0.049 / 0.097 / 0.136 | 0.194 / 0.193 | 0.0465 / 0.0461 | 0.0406, 0.0198 | not run |

Full tables (negative fractions of the grid for T2 and T1, parts at the argmin, ball values and radii, kappa of the pivot statistic): `tables.md`, `aggregate.json`.

Counts over the 14 x 13 class-cells: 111 PASS (no negative grid point; argmin positive in balls), 43 FAIL (argmin negative in balls), 24 float-only (ZQ), 4 not run (ZQ at 1e10).

Reading of the table.
- zeta: PASS at 14 of 14 cells; the margin at theta' = 0.95 is 0.096, 0.011, 0.029 at t = 1e4, 1e6, 1e8 and at 0.85 it is 0.135, 0.039, 0.057.
- DEL: PASS at 14 of 14, margin above zeta's at every cell (0.147 to 0.357). ZQ (both eta): equal to zeta within 0.0055 at every cell, while its S1 differs from zeta's by 0.011 to 0.69 c0 near the exchanged pair. Liouville: PASS at 14 of 14. Sign chains: 0 of 24 seeds fail at 11 cells; 5, 2, 7 of 24 fail at (1e6, 0.95), (1e8, 0.85), (1e8, 0.95). Haar chains: 1, 2, 7 at the same cells. HQ3 (zeros at 1/2 +- 0.1 on a vertical lattice): PASS at 11 cells, one failing window at each of three. DH: PASS at 13, three failing windows at (1e8, 0.95).
- E_a (R = 2 Lg), HQ2, T-NR, HQ4: fail from a threshold in theta' and t on; HQ4 fails in every window of every cell. In each case T1n at the failing point is positive or the failure tracks the size of the local coefficients (HQ4 and T-NR: Q1 sd 0.46 to 0.66 against 0.19 for zeta).

### 3.5 Extension (not registered; D6)

| t | theta' | class | windows | windows with a negative grid point | lowest m | at window w, tau | ball value there | radius | T1/(c0 Lg) there (ball) |
|---|---|---|---|---|---|---|---|---|---|
| 1e+06 | 0.95 | DEL | 600 | 0 | 0.1136 | 393, -16.02 | 0.113595276 | 2.6e-29 | 0.4271 |
| 1e+06 | 0.95 | LIOU | 600 | 3 | -0.0381 | 487, -2.34 | -0.038108733 | 3.3e-29 | 0.1517 |
| 1e+06 | 0.95 | zeta | 600 | 1 | -0.0095 | 121, -22.66 | -0.009476408 | 3.1e-29 | 0.2004 |
| 1e+08 | 0.95 | DEL | 600 | 0 | 0.0772 | 256, 6.36 | 0.077238934 | 2.2e-26 | 0.3658 |
| 1e+08 | 0.95 | LIOU | 600 | 6 | -0.0607 | 52, 2.40 | -0.060682213 | 2.6e-26 | 0.0733 |
| 1e+08 | 0.95 | zeta | 600 | 4 | -0.0221 | 39, 4.64 | -0.022102385 | 2.6e-26 | 0.2359 |

All 14 failing windows of the extension (5 zeta, 9 Liouville) are confirmed negative in balls (`ballx_ext.jsonl`); T1 is positive at each (0.07 to 0.29 c0 Lg). Failure rate per window at theta' = 0.95: zeta 1/600 and 4/600; Liouville 3/600 and 6/600; sign chains in the registered sample 5/576 and 7/576; DEL 0/600 and 0/600. The zeta counts are below the chain counts by a factor of about 2 to 5 on 1 and 4 events; no separation is claimed from that. Fine grid (step 0.002 on the registered windows of the four cells with theta' >= 0.85, t = 1e6, 1e8): the window minima move down by at most 1.7e-4, so the step 0.02 did not hide a sign change in the registered sample.

### 3.6 Registered predictions against the outcome

| prediction | outcome |
|---|---|
| P-1: Q1 mean 0, sd 0.207 R u (1 +- 0.2); Q2 sd 0.0486 u^2 (1 +- 0.3); variance split 3/4, 1/4 | Means: abs below 0.001 R u. Q1 sd 0.156 to 0.195 (one cell, (1e4, 0.5), below the band). Q2 sd 0.040 to 0.047: holds. Split: Q2b carries 2 percent of the variance at P = 39 and 19 percent at P = 6.9e6: outside the registered factor 1.5 at P below about 1e5 |
| P-2 (decisive): zeta fails at theta' = 0.85 and 0.95 at every height, negative fraction 1e-3 to 3e-2 | **Wrong on the registered sample**: no negative point. The model treated the first- and second-order sums as independent; by 3.3 they are not (T2 is close to T1^2/2, so a negative value needs T1n below about 0.3, not 0.5). In the extension zeta fails at 0.95 with negative fraction 5e-6 and 1.4e-5 |
| P-2, second half: chains show the same fractions within a factor 3 | Chains: 2.4e-5 and 3.8e-5 at (1e6, 0.95), (1e8, 0.95); zeta (extension) 5.4e-6 and 1.4e-5: within a factor 5 and 3 |
| P-3: DEL within 0.05 of zeta; HQ2, HQ3, HQ4 as zeta; ZQ within 0.05 | DEL: wrong, up to 0.152 above zeta (the greedy rule deletes 7 of the 12 primes below 39 and 12653 primes below 6.9e6). HQ: wrong for HQ4 (fails everywhere) and HQ2 (fails at 6 cells); HQ3 close to zeta. ZQ: holds (0.0055) |
| P-4: E_a and T-NR fail from theta' = 0.7 by size; DH as a Haar chain | E_a fails at 5 cells (theta' >= 0.85 at t >= 1e6, and (1e10, 0.7) by -0.0002); T-NR at 8 cells (0.85 and 0.95 everywhere, 0.7 at t >= 1e8). DH: passes 13 |
| P-5: Liouville as a sign chain | holds |
| Pivot prediction (no separation in kappa) | pivot not used: outcome (d) did not occur in the registered sample. In the registered data kappa (largest T1n at a point with T2 < 0) is 0.23 to 0.31 for the failing chains; for zeta in the extension T1n at the failing minima is 0.20 to 0.29: the same range |

### 3.7 Controls on the computation

- Float stage against brute force (dense Lambda_2 by direct convolution, direct sums; `selftest_float.py`, cell (1e4, 0.95), 11 classes): agreement 2e-13 to 2e-12 in T2/(c0 Lg^2).
- ZQ float path against direct quadrature of every density term (`selftest_zq.py`): 4e-13.
- Float against balls at all 188 ball points of precision 128: largest difference 7.5e-12 at t <= 1e8 and 2.5e-10 at t = 1e10 (80-bit phases); no sign disagreement.
- Doubled precision (256) on 23 points: values agree to all printed digits; radii at most 7.3e-24 (128) and 3.0e-63 (256). The ball stage sums exponentials directly and uses prefix sums; there is no long product of unit balls, so the 1.4x-per-step inflation named in the assignment does not arise; the radius grows with the number of atoms and with t (at most 1.1e-31 at t = 1e4, 7.3e-24 at t = 1e8, precision 128).
- Each control is not zeta in disguise: largest abs(S1_F - S1_zeta)/c0 over a window is at least 0.0038 for every class at every cell (smallest values at P = 39: HQ2 0.0038, one sign chain 0.0048, ZQ 0.011, HQ3 0.015; registered threshold 1e-6); DEL deletes 7 to 12653 primes below P. DEL count below 1e7 reproduces the 16210 of the c12 battery.
- Windows: every object on the same 24 windows per cell; 24 seeds for sign chains and for Haar chains.

## 4. Controls (what each class does to the mixed form)

| class | identity T2 = prime side | first-order value T1 | mixed form T2 >= 0 | reason |
|---|---|---|---|---|
| zeta | holds (every series) | positive on all 14 x 24 + 1200 windows (min 0.20 c0 Lg) | registered sample: holds; extension: fails on 5 of 1200 windows at theta' = 0.95 (CERTIFIED) | T1 small (0.20 to 0.29 c0 Lg) and the bracket of 3.3 negative |
| DEL (b = 0.75; zero at 0.75) | holds | larger than zeta's | **holds on every window run, including the 1200 of the extension** | smaller prime sum; the zero at 0.75 is not read |
| ZQ (eta = 0.01, 0.1) | holds, Laplace-truncated | zeta's within 0.005 at the minima | as zeta on the registered sample (float) | the exchange changes the form only near the pair, and upward there |
| Liouville; sign chains | holds | positive in the sample (min 0.07) | Liouville passes the registered sample, fails 9 of 1200; chains: 14 seed-cells of 336 fail | as zeta, by large deviation of the prime sum |
| Haar chains (reference ensemble) | holds | positive | 10 seed-cells of 336 fail | same |
| HQ3 | holds | zeta's plus the local factor | passes 11 cells of 14 | local factor of size 2 cosh(0.2 j log 2) at 2^j: small |
| DH (R = log(5t/2 pi)) | holds (not prime-power supported) | positive | passes 13 of 14 | no Euler product, larger reserve; nothing structural fails |
| E_a (R = 2 Lg) | holds | positive | fails at 5 cells | size n^a of the coefficients |
| HQ2, T-NR, HQ4 | holds | negative on part of the grid for HQ4 (up to 9 percent), HQ2 (up to 1 percent) | fail at 6, 8, 14 cells | size at one prime (k^3 2^(k/2); (1.5)^j at 3; alternating 2 cosh at 2) |
| backward heat, theta^w, phase-rotated transfer operator, Beurling, zeta(s+a)zeta(s-a) at other a | not run | | | no Dirichlet series with a_1 = 1 on file for the first three; the others outside the assignment's list |

No class fails at a step that uses multiplicativity, the functional equation or the location of its zeros. The classes that fail do so by the size of log-coefficients; the classes with zeros off the line that have zeta-sized coefficients (DEL, ZQ, HQ3) pass as zeta does, and zeta fails where the chains fail.

## 5. Registered outcome

- (a) holds: DEL passes at every cell (and E_a at 9). **The U4 residual "second-order form mixing A_P with the archimedean reserve" is closed as MEASURED** for the form T2 with the sin^4 test vectors, theta' = 0.5 to 0.95, t = 1e4 to 1e10.
- (b) does not hold: zeta's margin shrinks between t = 1e4 and 1e6 at theta' >= 0.7 and is not monotone; DEL, ZQ, Liouville and most chains pass.
- (c) undecided cells: ZQ at 12 cells x 2 values of eta (float only; D4). ZQ at 1e10: not run. No other cell is undecided.
- (d) did not occur in the registered sample. In the extension it occurs at theta' = 0.95 at both heights (CERTIFIED): T2 >= 0 is false for the partial sums of zeta there.

Stop, as registered: the idea is killed by (a) and (d); 3.3 gives the reason. The pivot (conditional form with threshold kappa) was not run as a separate experiment; the kappa values recorded in the census show no separation (3.6, last row) and by 3.3 the conditional form is a first-order statement. No second pivot.

## 6. Requirement flags

- **R1 false.** The identities (Theorem A, Part 1b, 3.1, 3.3) hold for every series with a_1 = 1 and were certified on three non-multiplicative ones. Haar chains, DH and DEL pass the inequality where zeta does.
- **R2 false.** Finite sample: 24 windows per cell (600 at two cells). zeta fails on 5 of 1200 windows at theta' = 0.95.
- **R3 false.** DEL passes on every window; ZQ, Liouville, HQ3 pass as zeta; failures are by coefficient size (E_a, T-NR, HQ2, HQ4), not at a structural step. Backward heat, theta^w, the transfer operator and Beurling were not run.
- **R4 false.** All objects are sums over n < P = (t/2 pi)^theta' with theta' <= 0.95; nothing is passed to the critical line.

## 7. Three weakest steps

1. **One test vector, one definition.** The paper lane's form was not on file; T2 is this lane's reading of "Lemma Q2 pair form with the reserve Lg - u". The census uses sin^4 windows only and R constant in the window. A different second-order form (for example one using [X, B] with the true vartheta'', or vectors not concentrated at one height, or the xi convention with its extra term pi Im S1) is not covered; the sector identity 3.3 holds for every h, but the size of its bracket was measured only at window minima of this family, that measurement is POST-HOC, and the first draft of this file misread it (it stated a positive bracket of 0.005 to 0.024; the referee rerun showed the bracket is negative at the failing points, and the section was rewritten from all 21312 minima).
2. **PASS is a grid statement.** A PASS means: no negative value on a grid of step 0.02 (float64, long-double phases) and a positive ball value at the argmin. It is not a certified bound for the minimum over the window (the fine-grid check moves minima by at most 1.7e-4, on four cells). FAIL entries and all extension failures are certified. ZQ has no ball stage. The comparison "zeta fails less often than chains by a factor 2 to 5" rests on 5 events.
3. **Part 1 encloses the limit relative to the partial-fraction expansion.** Lemma T is elementary once D'/D = -u/2 + lim sum 1/(s - beta) is granted (CLASSICAL; proved in the c19 referee report, not re-derived here). Count (i) is a recalled theorem; count (ii) (Jensen) was written and computed here and has not been refereed independently. The bound is 1e8 to 1e11 times the observed difference, so it certifies the limit but says nothing sharp about the T^-7 law observed. Part 1b is certified at fixed T only; its T^-3 tail is observed, not bounded.

## 8. Hand-off

- To `c20-u4-second-order-archimedean-mixed-form`: (a) use T2 = (T1^2 - K^2)/(2 c0) + dispersion + commutator; any inequality of the type T2 >= 0 is, to within a bracket of mean 0.015 and lowest value -0.075 c0 Lg^2, the statement that T1 is not small; it is false for zeta's partial sums at theta' = 0.95 (points in 3.5) and true for DEL; (b) zero side: constant (R - u)^2/2 + u^2/2, weights R + D''/D'(beta), and the regularised second-order identity of Part 1b with constant 0; (c) the triangle floor shows that at small P a pass carries no information.
- Proposed map row (next to P58, not applied): "Second-order mixed form T2 = 2 Re <h, (B^2 + [X, A]) h>, B = R/2 - A_P (image of E''/E, E = e^(i vartheta) F). Identity T2 = (T1^2 - K^2)/(2 c0) + dispersion + commutator (every series). Census t = 1e4 to 1e10, theta' = 0.5 to 0.95, sin^4 windows: zeta passes the registered 14 x 24 windows; DEL (zero at 0.75) passes every window including 1200 more; ZQ, Liouville, 17 to 24 of 24 sign chains pass; zeta fails on 5 of 1200 windows at theta' = 0.95 (ball-certified); E_a, T-NR, HQ2, HQ4 fail by coefficient size. Theorem A (V0): limit enclosed with an explicit tail bound, six series, T = 12800; second-order identity with constant 0 certified at fixed T. Status: MEASURED / CERTIFIED at the deciding points; one author referee pass. Closed: do not look for a zero statement in the sign of the completed second-order pair form at P = t^theta'. `c20-mixed-form-control-census-server`."

## 9. Files and server units

`GATE.md` (pre-registration); `RESULT.md`; `REFEREE.md`; `tables.md`, `aggregate.json` (full census tables); `tailA.py`, `runA_c19.py` (unchanged copy of c19 `runA.py`), `tailA_*.json` (Part 1, 1b); `referee_checks.py`, `referee_checks.json` (Jensen count, pointwise bound, q^(k)(u)); `mixed.py` (float stage), `mixed_t1e4.jsonl`, `mixed_main.jsonl`, `mixed_t1e10.jsonl`, `zq_*.json`; `mixed_ball.py`, `ballpts_*.json`, `ball_*.jsonl`, `ballx_ext.jsonl`; `ext/`, `fine/` (extension); `selftest_float.py`, `selftest_zq.py`, `balltest.py`; `trivbound.py`, `trivbound.json`; `aggregate.py`; `logs/` (all unit logs); `units.txt`; `lanes.jsonl`.
Server: 17 units through rhrun, names in `units.txt` (first line: number of units of this lane still loaded = 0). One unit was stopped by this lane (`rh-c20mf-t1e10-1120085424`, started with a slow zeta-zero lookup it did not need; rerun without it). All others ended by themselves. GPU not used. Local runs (self-tests, aggregation, `trivbound.py`) through `scripts/memcap.sh 8`.
