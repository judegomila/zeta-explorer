# s1-scattering-one-line: screening of four combinations on the scattering coefficient

Lane: screener, 2026-11-19. Code base: phi(s) = Lambda(2s-1)/Lambda(2s) on Re s = 1/2 (bridge sampled at w = 2it, the function on the 1-line), and the same quotient F(2s-1)/F(2s) for the controls.

Verdict: 4 combinations tested, 0 survivors. Every separation found is one of: (a) a property of the coefficients alone (Bohr torus law), passed by every control with an Euler product including T-NR and E_a; (b) the argument principle or Littlewood's lemma on the window examined (a zero count at the height of the test); (c) a mean-value statement (Levinson-Conrey proportion), which T-NR passes with its own local factor and which cannot certify every window (MV-CAP).

Labels: PROVED (elementary, written here), CLASSICAL, MEASURED (float64; GPU values are a screen), OPEN.

## Controls used

| code | function | Euler product | functional equation | off-line zeros |
|---|---|---|---|---|
| ZETA | zeta(s) | yes | yes | none known |
| LCHI | L(s, chi), chi the odd character mod 5 with chi(2) = i (positive comparison) | yes | yes | none known |
| DH | (1 - i kappa)/2 L(s, chi) + (1 + i kappa)/2 L(s, chibar), coefficients (1, kappa, -kappa, -1, 0) mod 5 | no | yes | first pair at height 85.699; 84 pairs below 2000 (battery table) |
| EA | zeta(s + 1/4) zeta(s - 1/4) | yes (degree 2) | yes | all |
| TNR | zeta(s) m(s), m(s) = q^(s-1/2) + c + q^(1/2-s), q = 3, c = 2.2 | yes, one modified factor | yes | Re s = 1/2 +- 0.404, heights (2k+1) pi/log 3 |
| LIOU | zeta(2s)/zeta(s) (sign twist eps_p = -1) | yes | no (of zeta type) | zeros of zeta are poles |
| SGN | random signs eps_p at primes, completely multiplicative | yes | none | not defined left of 1 |
| U | random unimodular u_p at primes, completely multiplicative | yes | none | not defined left of 1 |
| WT | zeta(s + i alpha) | yes | shifted | none known; every statistic below is that of ZETA at heights shifted by alpha (identity, not recomputed) |
| HEAT | backward heat deformation of xi | no Dirichlet series | yes | pairs from height < 2000 (battery) |

## Table

| # | combination | statistic | sizes reached | ZETA | LCHI | DH | other controls | classification |
|---|---|---|---|---|---|---|---|---|
| 1 | scattering-winding-split + bridge-scattering-factorisation | variance, fourth central moment, maximum of arg F(1 + 2iT) against the torus model built from F's own coefficients; unwrapped winding along the 1-line | T in [1e6, 2e6], [1e8, 2e8], [1e10, 2e10]; 4e5 points per block; winding in 20 windows of length 200 per block | var 0.23692 / 0.23695 / 0.23667 vs exact 0.236847; m4 0.13606 / 0.13640 / 0.13626 vs 0.136164; all abs(z) < 1 | var 0.21703 / 0.21660 / 0.21798 vs 0.216644; z = +1.1 / +0.4 / +2.8 (second seed at 1e10: +0.8) | var 0.09091 / 0.09052 / 0.09076 vs own model 0.09071 (abs(z) < 0.8); no winding: abs(net phase)/2pi < 0.08 in all 60 windows, min abs(DH) = 0.096 | EA, LIOU, SGN, U, TNR all match their own model, abs(z) <= 1.3 | CLOSED: the statistic is a function of the coefficients (Bohr torus law); every control passes against its own model; DH differs from the Euler-type model only through a(mn) != a(m)a(n), which is read off the coefficients |
| 2 | scattering-causality-at-one-line + cascade-s21-zeta2s-over-zeta | decay exponent in P of the error of prod_{p <= P}(1 + eps_p p^(-s)) at s = 1/2 + x + it, x in {0.05, 0.1, 0.25}, t in {5, 14.1347, 17.5, 1000.25, 10000.75} | all primes to P = 1e10 (455,052,511 primes), 20 checkpoints per decade | raw product: error grows (slope +0.2 to +12 at t = 5; pole of zeta at 1). Pole-corrected: mean slope -0.113 / -0.164 / -0.321 | -0.120 / -0.171 / -0.325 | not applicable (no Euler product) | LIOU -0.102 / -0.157 / -0.319; SGN -0.092 / -0.137 / -0.283; U -0.129 / -0.174 / -0.307; TNR: tail identical to ZETA for P > 3 (PROVED) | CLOSED: the exponent is -x (with a log factor) for zeta, for random signs and for random unimodular twists; the rate at fixed x does not separate them |
| 3 | modular-scattering-factorisation + xp-models-residual-s | r_n = (n - 1/2) - theta_F(gamma_n)/pi on on-line zeros: fitted constant, variance, drift | zeta: first 1e5 and 2,001,052 zeros (height 1.13e6); LCHI, DH, HEAT, EA: height 2000 | constant 0.875007 +- 5.3e-5 (1e5 zeros; reproduces the node), 0.875000 +- 1.6e-5 (2e6 zeros); variance 0.0966 / 0.1103 | constant -0.08810 = -(arg eps)/(2 pi) predicted -0.08810; variance 0.0737; no drift (2028 zeros, all on the line) | on-line zeros: constant -70.2, variance 2265, drift -0.084 per unit height; first departure at height 87.6, first off-line pair at 85.70; with both members of each pair restored: constant -2.5e-5, variance 0.0613 | TNR: on-line zeros are exactly zeta's, constant 7/8, residual unchanged (PROVED): passes; EA: no on-line zeros, fails at the first zero; HEAT: deficit 2 x pairs (41 and 294 below 2000) | CLOSED: argument principle. The residual moves by exactly 2 per off-line pair at the height of that pair; T-NR passes |
| 4 | twin-ladder-network + levinson-in-ladder-language + jensen-loss-in-levinson | kappa_J = 1 - log(mean abs(V psi)^2)/R and kappa_nJ = 1 - (2/R) mean log abs(V psi) on Re s = 1/2 - R/L, t in [T, 2T], theta = 4/7, R = 1.3 | T = 1e5, 1e6, 1e7; 4e4 points each | kappa_nJ 0.727 / 0.725 / 0.746 (no mollifier; 0.731 to 0.741 with polynomial mollifiers); kappa_J 0.445 / 0.445 / 0.435 (Moebius, length T^(4/7)); primorial P = 11: 0.324 / 0.251 / 0.171; P = 101: 0.367 / 0.394 / 0.373 | kappa_nJ 0.746 / 0.747 / 0.747; kappa_J 0.457 / 0.441 / 0.434; primorial 11: 0.299 / 0.202 / 0.125 | kappa_nJ 0.668 / 0.655 / 0.632; best kappa_J 0.288 / 0.227 / 0.131 (least-squares polynomial of length 300) | TNR: kappa_nJ 0.18 / 0.16 / 0.19, kappa_J <= -0.48 with Dirichlet polynomials, 0.47 / 0.43 / 0.37 with its own local factor (rational); EA: kappa_nJ -2.8 / -3.7 / -4.6; WT = ZETA | CLOSED: kappa_nJ is Littlewood's lemma (weighted zero count of V in the window); kappa_J is a mean value; T-NR passes kappa_J with its own Euler factor |

All numbers MEASURED unless marked. Standard errors and full rows are in the JSON files listed at the end.

## 1. Winding split: arg F(1 + 2iT) against the torus model

Finite consequence tested. W(T) - W_inf(T) = arg zeta(1 + 2iT)/pi + 1/2 (PROVED in route 25). If the combination had content beyond the coefficients, the centred moments of arg zeta(1 + 2iT) would match the random Euler product (X_p independent, uniform on the circle) and the controls would depart from the model built from their own coefficients, at a height unrelated to their zeros. Survival would need: zeta matches, each control departs.

Method. zeta(sigma + it), sigma in {3/4, 1, 5/4}, and L(1 + it, chi), L(1 + it, chibar) by the sharp-cut approximate functional equation on GPU (float64), t = 2T up to 4e10, 1.8e5 terms per point at the top block. SGN and U by the Euler product over p <= 2e5. Model: 4e5 torus samples over p <= 2e5; for ZETA, LCHI, TNR also exact cumulants by per-prime quadrature.

Validation. (i) Evaluator A (Euler-Maclaurin on Hurwitz sums, no functional equation) against mpmath: errors <= 2e-11 at t <= 3e4, 1e-10 at t = 2e6. (ii) Approximate functional equation against evaluator A: error 1.0e-3 at t = 2e6 for sigma = 1, scaling as (t/2 pi)^(-sigma/2). (iii) Top block: the float64 GPU sums recomputed with 80-bit phases on CPU, and zeta(1 + it) against mpmath at three points near t = 2e10: deviation 1.5e-5 (zeta), 2.5e-6 (L(chi)); the statistical error of the moments is 5e-4, so the screen is adequate for the comparison made.

Result. Every function matches its own torus model at every block (24 comparisons of variance and 24 of the fourth moment in the first run; largest abs(z) = 2.83 for LCHI variance at 1e10; a second seed at 1e10 gives +0.77). Maxima over 4e5 points: zeta 1.54 / 1.53 / 1.47 against model sample maximum 1.53; DH 1.55 / 1.36 / 1.39 against 1.46.

DH on the 1-line. Net unwrapped phase of DH(1 + it) over each of 60 windows of length 200 (heights 2e6, 2e8, 2e10): abs(net)/2pi <= 0.076, so no zero of DH with Re s > 1 lies in those 12,000 units of height; Re DH(1 + it) > 0 at all 1.2e6 sampled points; the torus model gives a density of zeros right of 1 of (5 +- 15)e-5 per unit height (Jessen derivative), and the battery table has none below height 2000. The winding W(T) of the DH scattering quotient therefore has the same form as zeta's at every height reached. What differs is the law: var(arg) = 0.0907 for DH; the Euler-type prediction from DH's own local factors sum_k a(p^k) p^(-ks) is 0.0652. That difference is a(mn) != a(m)a(n) and is visible in the first six coefficients.

Why closed. For a Dirichlet series absolutely convergent on Re s > 1 with the regularity used here, the law of F(1 + it) is the push-forward of Haar measure on the torus (CLASSICAL: Bohr-Jessen; Kronecker-Weyl). The statistic is a function of the coefficients and of nothing else. EA (all zeros off the line), TNR (zeros at Re s = 0.904), LIOU, SGN and U (no functional equation) all pass. HEAT has no Dirichlet series; route 25 already records that its causality break needs a zero with abs(y) >= 1, that is Re w >= 1.

## 2. Cascade S21: rate of the truncated product on Re s = 1/2 + x

Finite consequence tested. C_P(s) = prod_{p <= P}(1 + eps_p p^(-s)) against its limit; exponent of the error in P at fixed x. Survival would need: exponent -x for zeta and a different exponent for the sign twist and T-NR.

Method. Segmented sieve to 1e10 on 6 CPU cores (float64 sums; 339 s), cumulative log-products at 161 checkpoints. Limits by mpmath: zeta(s)/zeta(2s), L(s, chi)/L(2s, chi^2), 1/zeta(s). For ZETA and LIOU the pole term E1((s-1) log P) and the second-order term E1((2s-1) log P)/2 are added (PROVED form of the tail of the prime sum against li). For SGN and U (no closed limit) the Cauchy difference to P = 1e10 is used, fitted on P <= 1e9. Exponent = slope of the per-decade RMS of log10(error).

Validation. With the pole correction the product reproduces zeta(s)/zeta(2s) to 6.2e-5 (x = 0.25, t = 5) and 4.5e-3 (x = 0.05, t = 5) in the last decade; the uncorrected and corrected slopes agree for LCHI, which has no pole.

Result (mean slope over the five t; prediction -x - c/log P):

| x | ZETA raw | ZETA corrected | LCHI | LIOU | SGN | U |
|---|---|---|---|---|---|---|
| 0.05 | grows | -0.113 | -0.120 | -0.102 | -0.092 | -0.129 |
| 0.10 | grows | -0.164 | -0.171 | -0.157 | -0.137 | -0.174 |
| 0.25 | grows at low t | -0.321 | -0.325 | -0.319 | -0.283 | -0.307 |

Two facts. (i) The raw cascade does not converge for zeta inside the strip: the error grows like P^(1/2-x)/(abs(t) log P) from the pole at 1, while the twisted cascades (LCHI, SGN, U) converge without correction. The uncorrected rate separates zeta from the sign twist in the wrong direction and for the reason "pole at 1". (ii) After the correction the exponent is the same for all five. Random signs give P^(-x)/sqrt(log P) almost surely (variance sum_{p > P} p^(-1-2x)); zeta gives P^(-x) (sum over zeros)/log P. The amplitudes differ (at x = 0.25, t = 5, last decade: zeta 6.2e-5, SGN 1.7e-3), the exponent does not. T-NR changes one Euler factor, so its tail for P > 3 is zeta's (PROVED; class S3 of the pre-filter lemma P).

Why closed. The exponent at fixed x is the abscissa of convergence of sum eps_p p^(-s) minus 1/2 - x. A twist with exponent different from -x needs a singularity at Re s > 1/2, and by the explicit formula a zero beta + i gamma contributes P^(beta - 1/2 - x)/abs(rho - s): it shows only when P is large enough to resolve it against the on-line zeros. Square-root cancellation of signs is typical (SGN, U), so the exponent carries no arithmetic information that separates zeta.

## 3. Berry-Keating constant and the Gamma-phase spectrum

Finite consequence tested. With theta_F from the gamma factor, r_n = (n - 1/2) - theta_F(gamma_n)/pi over the on-line ordinates has mean equal to the constant of N_F(T) and variance Var S. Survival would need: a control departs from the constant predicted by its gamma factor at a height below its first off-line zero, or without reference to it.

Validation. Zeta, first 1e5 zeros (text file scripts/.zeros-cache/zeros6): constant 0.875007 +- 5.3e-5, the node's value to all digits. With 2,001,052 zeros: 0.875000 +- 1.6e-5. Removing one pair of zeros at height 50,000 from the list moves the second-half mean from 1.0000 to -0.4592 and the variance from 0.097 to 1.02: the statistic responds to a single missing pair.

Result. L(chi): zeros found on the line to height 2000 by sign changes of the Hardy function (2028 zeros); constant -0.08810 against the predicted -(arg eps_chi)/(2 pi) = -0.08810; no drift. DH: on-line zeros only (1861) give constant -70.2 and variance 2265; the residual leaves the band of width 1.5 at height 87.6, two units above the first off-line pair (85.699); adding both members of each of the 84 pairs gives constant -2.5e-5, variance 0.0613, no drift. HEAT: on-line counts 1435 and 929 against 1517 zeta zeros below 2000: deficit 2 x 41 and 2 x 294. EA: no zero on the line. T-NR: zeros of m are off the line, the on-line zeros are zeta's and the gamma factor is zeta's, so constant and residual are zeta's (PROVED): T-NR passes although it has off-line zeros at height 2.86 and above; counting against its true total (which has the extra term T log q/pi) is again the argument principle.

Why closed. N_F(T) = theta_F(T)/pi + c_F + S_F(T) is the argument principle (CLASSICAL). The residual on on-line zeros is S_F minus twice the number of off-line pairs below T. The test fails for a control exactly at the height of its first off-line pair: verified height in another form.

## 4. Levinson numbers with and without the Jensen step

Definitions used. L_F = d log(q T/2 pi) (degree d, conductor q; q = 9 for T-NR), sigma_0 = 1/2 - R/L_F, R = 1.3, V = F + F'/L_F, psi a mollifier evaluated at s + 1/2 - sigma_0, means over t uniform in [T, 2T] (Monte Carlo). The node's 0.4903 / 0.8578 use polynomials P (degree 6), Q (degree 7) and R = 1.2916 that are not in the source file; they are not reproduced here. The configuration here is Q(x) = 1 - x, P(x) = x, and all functions are run with the same configuration. F and F' by evaluator A (no functional equation used), accuracy 1e-10.

Mollifiers. none; MOB_y: sum_{n <= y} b(n) P(log(y/n)/log y) n^(-s) with b the Dirichlet inverse (mu, mu chi; for DH the Dirichlet inverse of its coefficients, max abs(b(n)) = 11.6 / 21.8 / 52.2 for y = 719 / 2682 / 9999); EUL_P: primorial Euler-product mollifier prod_{p <= P} (local factor)^(-1), P = 11 and 101; LSQ_y: the Dirichlet polynomial of length y, b(1) = 1, minimising mean abs(V psi)^2 on half the sample, evaluated on the other half (train value in brackets in the logs: the optimum over all polynomials of that length lies between the two).

| function | mollifier | kappa_J at 1e5 | 1e6 | 1e7 | kappa_nJ at 1e5 | 1e6 | 1e7 |
|---|---|---|---|---|---|---|---|
| ZETA | none | -0.557 | -0.715 | -0.849 | 0.727 | 0.725 | 0.746 |
| ZETA | Moebius, length T^(4/7) | 0.445 | 0.445 | 0.435 | 0.730 | 0.736 | 0.736 |
| ZETA | primorial product, P = 11 | 0.324 | 0.251 | 0.171 | 0.731 | 0.736 | 0.739 |
| ZETA | primorial product, P = 101 | 0.367 | 0.394 | 0.373 | 0.733 | 0.738 | 0.741 |
| ZETA | least squares, length 300 | 0.436 | 0.389 | 0.326 | 0.731 | 0.737 | 0.737 |
| LCHI | none | -0.556 | -0.685 | -0.799 | 0.746 | 0.747 | 0.747 |
| LCHI | Moebius chi, length T^(4/7) | 0.457 | 0.441 | 0.434 | 0.749 | 0.747 | 0.748 |
| LCHI | primorial product, P = 11 | 0.299 | 0.202 | 0.125 | 0.750 | 0.743 | 0.753 |
| LCHI | primorial product, P = 101 | 0.416 | 0.393 | 0.363 | 0.750 | 0.745 | 0.747 |
| LCHI | least squares, length 300 | 0.430 | 0.373 | 0.314 | 0.744 | 0.746 | 0.746 |
| DH | none | -0.103 | -0.227 | -0.345 | 0.668 | 0.655 | 0.632 |
| DH | Dirichlet inverse, length T^(4/7) | 0.131 | -0.060 | -0.299 | 0.653 | 0.624 | 0.593 |
| DH | product of inverse local factors, P = 11 | 0.121 | 0.020 | -0.068 | 0.661 | 0.647 | 0.634 |
| DH | product of inverse local factors, P = 101 | 0.142 | 0.073 | 0.015 | 0.662 | 0.646 | 0.633 |
| DH | mollifier of L(chi) | -0.882 | -1.076 | -1.293 | 0.671 | 0.655 | 0.633 |
| DH | least squares, length 300 | 0.288 | 0.227 | 0.131 | 0.666 | 0.659 | 0.631 |
| TNR | none | -2.605 | -2.750 | -2.880 | 0.182 | 0.164 | 0.190 |
| TNR | Moebius (zeta), length T^(4/7) | -1.081 | -1.067 | -1.061 | 0.186 | 0.175 | 0.180 |
| TNR | least squares, length 300 (Dirichlet polynomial) | -0.506 | -0.585 | -0.658 | 0.189 | 0.179 | 0.170 |
| TNR | own Euler factors, P = 101 (rational, poles at its zeros) | 0.469 | 0.425 | 0.367 | 0.879 | 0.871 | 0.861 |
| EA | none | -5.441 | -6.407 | -7.340 | -2.848 | -3.728 | -4.576 |
| EA | least squares, length 300 | -3.103 | -3.978 | -4.866 | -2.845 | -3.715 | -4.592 |

All three heights use 4e4 sample points (the 1e7 column is the second run; the first 1e7 run with 1.2e4 points is in `out_t4_1e7.txt`). Standard errors of kappa_nJ: 0.004 to 0.009. For the least-squares rows the value is on the held-out half; the optimum over polynomials of that length lies between it and the training value (for DH at 1e7: 0.131 and 0.190).

Reading.

1. kappa_nJ does not depend on the mollifier when psi is a Dirichlet polynomial without zeros right of sigma_0 (ZETA: 0.727 to 0.733 across the mollifiers at 1e5, 0.736 to 0.746 at 1e7). PROVED reason: Littlewood's lemma gives (1/T) int log abs(V psi)(sigma_0 + it) dt = (2 pi/T) sum over zeros of V psi with beta > sigma_0 of (beta - sigma_0) + O(log T / T). The no-Jensen number is a weighted count of the zeros of V in the window. For zeta and L(chi) it is 0.72 to 0.75, not 1, because V has zeros between sigma_0 and 1/2 also when every zero of F is on the line.
2. On the stated criterion (no-Jensen number below a fixed bound while zeta and L(chi) exceed it): with bound 0.70, ZETA and LCHI exceed it at all three heights (0.725 to 0.747), DH (0.668, 0.655, 0.632), TNR (0.16 to 0.19) and EA (negative) are below it, WT equals ZETA. The gap for DH against ZETA is 0.059 (1e5), 0.069 (1e6), 0.114 (1e7), that is 6, 7 and 11 standard errors, and it grows with T. By item 1 this gap is the count of zeros of V_DH right of sigma_0 in [T, 2T] minus the same count for zeta: it is produced by the off-line zeros of DH in the window that is integrated. The statistic at height T sees zeros at height T; evaluating it costs what a zero count costs. It is verified height in another form, measured here by Monte Carlo and not certified.
3. The Jensen number separates DH from zeta by more than the zero count. At equal length 300 (least squares, held-out): kappa_J is 0.436 / 0.389 / 0.326 for ZETA, 0.430 / 0.373 / 0.314 for LCHI, 0.288 / 0.227 / 0.131 for DH. The difference ZETA - DH is 0.148 / 0.162 / 0.195, of which 0.066 / 0.078 / 0.106 is the difference of the no-Jensen numbers at the same mollifier (zero count) and 0.08 to 0.09 is an excess Jensen gap of DH, the same at the three heights. That excess is the variance of log abs(V psi), which a short Dirichlet polynomial does not remove for a function without an Euler product; the Dirichlet inverse of DH has growing coefficients and performs worse as T grows (0.131, -0.060, -0.299). It does not depend on resolving zeros. It is a mean value: for zeta it returns a Levinson-Conrey proportion (0.43 to 0.45 here), a statement about a positive proportion of zeros and not about every zero (MV-CAP). It does not detect off-line zeros as such: EA, with no zero on the line, has a Jensen gap of 0.26 / 0.26 / 0.27 at the length-300 optimum, below zeta's at the same length; its failure is the zero count. At length T^(4/7) the optimal polynomial is not determined by 4e4 samples (ZETA at 1e6: training 0.66, held-out 0.21).
4. Primorial Euler-product mollifiers against length-truncated ones: for ZETA and LCHI the primorial with P = 11 (length 2310) loses to the length-T^(4/7) Moebius mollifier and gets worse with T (0.324, 0.251, 0.171 against 0.445, 0.445, 0.435); P = 101 holds at 0.37 to 0.39. Same ordering as the node's fixed-Q proxy (0.262 against 0.453).
5. T-NR: with Dirichlet-polynomial mollifiers kappa_J <= -0.48; with its own local factor at q inverted (a rational function of q^(-s) with poles at the zeros of m) kappa_J = 0.47 / 0.43 / 0.37 and the "no-Jensen" number rises to 0.86 to 0.88, because the poles of the mollifier cancel the off-line zeros in Littlewood's lemma. A device that allows the mollifier to be the inverse Euler product is passed by T-NR; a device that allows only Dirichlet polynomials fails T-NR by exactly the Jensen count of its local zeros (Szego: the infimum over polynomials g in q^(-s), g(0) = 1, of the mean of abs(m g)^2 on a vertical line is the exponential of the mean of log abs(m)^2 there, which by Jensen's formula counts the zeros of m right of the line).

Why closed. The no-Jensen number is Littlewood's lemma on the window. The Jensen number is a mean value whose content for zeta is the known proportion theorem; it detects the absence of an Euler product (DH) and the presence of zeros in the window (TNR, EA) but gives no statement for every window, and T-NR passes it with its own Euler factor.

## Survivors

None.

## Three weakest steps

1. Combination 4 uses Q(x) = 1 - x, P(x) = x, R = 1.3 and L_F = d log(qT/2 pi); the node's optimised polynomials were not available, so 0.4903 / 0.8578 are not reproduced (zeta here: 0.445 / 0.725 at 1e6). The least-squares mollifier at length T^(4/7) overfits at 4e4 points (train 1.55, test 2.80 at 1e6); the length-300 rows are the reliable ones. One run was lost to the cupy pool limit (a 6.4 GB design matrix plus copies against a 16 GB pool) and repeated with the length capped at 3000.
2. Combination 1 at t = 4e10 rests on a float64 approximate functional equation with error about 1e-5 per value; it was re-checked at 48 points with 80-bit phases and at 3 points with mpmath, not at all 4e5 points. The DH zero density right of 1 is bounded only by sampling (none in 12,000 units of height; model estimate (5 +- 15)e-5).
3. Combination 2: slopes are fitted to per-decade RMS over 7 decades and carry the 1/log P and 1/sqrt(log P) factors; they are consistent with -x for all five functions but do not measure the exponent to better than about 0.03. The statement that a planted off-line singularity shows only when resolved is argued from the explicit formula, not run.

## Files

- `lib.py` (evaluators), `validate.py`, `t1_oneline.py`, `t1_recheck.py`, `t2_cascade.py`, `t3_bk.py`, `t4_levinson.py`, `run_gpu.sh`, `run_gpu2.sh`
- `out_validate.txt`, `out_t1.txt`, `out_t1_seed7.txt`, `out_t1_recheck.txt`, `out_t2.txt`, `out_t4_1e5.txt`, `out_t4_1e6.txt`, `out_t4_1e7.txt` (1.2e4 points), `out_t4_1e7_M4e4_firstattempt.txt` (stopped by the cupy pool limit at a length-9999 least-squares fit; ZETA rows only), `out_t4_1e7_M4e4.txt`
- `t1_result_M400000.json`, `t1_recheck_k10.json`, `t2_result_P1e+10.json`, `t3_result.json`, `t4_result_T*.json`
- Server units (all stopped): rh-s1-gpu-1119182844, rh-s1-t2-1119182844, rh-s1-gpu2-1119184302, rh-s1-gpu3-1119190801. GPU 1, cupy pool limit 16 GB, resident memory below 1 GB; CPU job 6 cores.
