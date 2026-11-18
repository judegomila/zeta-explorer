# c4-fe-stage-rouche-crossing: RESULT

Verdict: **precise obstruction**. The decisive test is answered in the negative and the lane stops there; no pivot was taken. No statement about zeros of zeta is claimed (the one certified box lies far below verified height). Labels: PROVED (argument in this note), CLASSICAL (source opened or standard), CLASSICAL-recalled (not opened), MEASURED (float64 on a grid unless stated), ARGUED, OPEN. Unrefereed.

## 0. Summary

1. Gonek 2012 was opened (arXiv 0704.3448, text in `src_gonek/`). His stage is G_X(s) = P_X(s) + chi(s) P_X(conj s), which is **not analytic**. Its zeros with 0 <= sigma <= 1, t >= C_0 lie on the line for **every** X and every t; the proof is two lines (P_X never vanishes; abs(chi) = 1 only on the line) and uses nothing about P_X except non-vanishing. The planner's pre-check "unconditional range X of order log^2 t" is not the range of this theorem. It is the range in which the stage phase F_X is provably monotone (equivalently: in which the analytic stage P_X(s) + chi(s) P_X(1-s) of the assignment has abs(Theta_X) < 1 next to the line), and it depends on the weight: X < L^2/16 for the sharp cut, about (L log L)^2/16 for the Fejer weight, about (L log L)/8 for Gonek's weight (L = log(t/2 pi)).
2. The k = 0 term of the phase comb is F_X'(t)/(2 pi). With the Fejer weight it equals, exactly, (log Y/pi) sum over zeros of Re kappa((rho - s) log Y), kappa(w) = (e^w - 1 - w)/w^2, plus a pole term of size sqrt(Y)/(t^2 log Y) and O(1/t). On-line zeros contribute (1 - cos u)/u^2 >= 0. So positivity of the k = 0 term on every window is the Weil functional on the translated Fejer tests of bandwidth log Y: under RH it holds for all Y up to a power of t (measured: positive for all Y <= 1e6 at T = 1e6, where the sharp cut fails from X = 1000 and Gonek's weight from X = 100); without RH it is the target in one-sided form (rows P10, eq48). Pre-check verified, with this identification added.
3. Crossing device. The Rouche step works with the non-analytic stage through a degree argument (Lemma 2). The quantity that must be bounded on the boundary of the box is arg Z_X(s) - arg(1 + Theta_X^G(s)), where Z_X = zeta/P_X = exp(sum over **all** zeros of F_2((s - rho) log X) - F_2((s-1) log X)) (Gonek Thm 3.1, unconditional). It is a sum over zeros. The approximate functional equation does not bound it: the identity zeta - zeta_X = -(T_N(s) + chi(s) T_M(1-s)) + R has an unconditionally small R and a remainder T that is literally P_X - (Dirichlet polynomial), i.e. the same quantity.
4. Decisive test: **no**. The boundary inequality implies that the box is zero-free, and it is implied (Gonek Thm 5.1) by the zero-free statement at abscissa sigma_0 - C log log t/log X. As X grows it is not weaker but stronger than zero-freeness of the box: a zero beta + i gamma with beta > sigma_0 at vertical distance v from the box changes log(zeta/P_X) on the left edge by about X^(2(beta - sigma_0))/(2 v^2 log^2 X), so for large X the inequality on one box fails if there is a zero to the right of sigma_0 at any height (ARGUED). At fixed X it fails at arbitrarily large heights for every sigma_0 < 1 (CLASSICAL-recalled, Montgomery's omega theorem). No prime-side statement weaker than the Landau target at abscissa sigma_0 (rows P10/T2, c1 Thm. D) implies it.
5. The functional-equation term does not carry the comparison. At distance d from the line it has modulus (t/2 pi)^(-d), so for fixed d the device is the Hurwitz statement of `c1-leeyang-krein-limit` Thm. D unchanged. In the layer d <= 1/L, where it is of size one, its measured effect depends on X: for X <= 11 it helps (it supplies one stage zero per zeta zero; at d = 0.25/L over 2000 units of height, X = 2 has 0 crossings of the negative axis with the term and 76 without), for X >= 100 it lowers the margin (max abs arg 2.77, 2.64, 2.40 with the term against 2.33, 2.13, 1.63 without, X = 1e2, 1e3, 1e4). The regime in which the inequality can be uniform in height is X large, where the term is a cost.
6. Lead 13 is not answered by this device. The twist U passes the stage theorem for the same reason zeta does; the comparison step fails for a U with a zero in the strip because the comparison step is the conclusion; for a random U nothing fails and the conclusion is true. "U has no approximate functional equation" is correct (Hamburger) but the approximate functional equation is not a working step of the device.

Requirement flags: R1 false, R2 false, R3 false, R4 false (section 6).

## 1. Plan and what is new

Assigned: stage zeta_X = P_X + chi conj(P_X(1 - conj s)); Lemma 1 (range in which stage zeros are on the line; planner's two pre-checks); Lemma 2 (Rouche on a box in Re s > 1/2, bound of zeta - zeta_X through the approximate functional equation and the smooth tail); decisive test (is the boundary inequality implied by a prime-side statement strictly weaker than the Landau target); one window at T = 1e6 in ball arithmetic; controls.

Read: BRIEF.md; `c3-twinladder-prime-built-chain`, `c2-projection-domination-gonek` in full, the verdict sections of `c1-leeyang-krein-limit` and the round-3/round-4 planner notes; map rows G10, Q10, Q21, P40-P42, P10, T2 and the controls section; Gonek 2012 sections 3, 5, 6, 7 (Thm 3.1, 3.3-3.5, 5.1, Lemma 6.1, Thm 6.2, 7.1-7.6). `c3-multiwindow-converse-defect` was not read beyond its header (a command error cut the read; its content is not used below).

New relative to those sources: (i) the correction of the stage definition and of the range statement; (ii) the Fejer-stage identity for F' and its identification with the Weil functional on Fejer tests; (iii) the degree form of the Rouche step for the non-analytic stage and the exact boundary quantity; (iv) the non-locality remark (item 4 above); (v) the measurement of the effect of the functional-equation term on the margin; (vi) a ball-arithmetic certificate of the inequality on one box.

## 2. Work

Notation: L = log(t/2 pi). Log-sum stages: log P(s) = sum over prime powers n of w(n) Lambda(n) n^(-s)/log n, with three weights: sharp (w = 1 for n <= X), Fejer (w = (1 - log n/log Y)_+), Gonek's trapezoid Lambda_X (= 2 Fejer(X^2) - Fejer(X)). G(s) = P(s) + chi(s) conj(P(s)) (Gonek's stage; P has real coefficients so P(conj s) = conj P(s)). A(s) = P(s) + chi(s) P(1 - s) (analytic stage; this is what the assignment's formula chi(s) conj(P_X(1 - conj s)) equals). G = A on the line only. F(t) = -arg chi(1/2 + it) + 2 arg P(1/2 + it); stage zeros on the line are the solutions of F = pi mod 2 pi.

### Lemma 1 (stage zeros)

**(a) CLASSICAL (Gonek Thm 6.2 and Lemma 6.1, opened).** G has no zero with 0 <= sigma <= 1, t >= C_0 off the line, for every X >= 1. Proof: abs(conj P) = abs(P) != 0, so G = 0 forces abs(chi(s)) = 1, and log abs(chi(sigma + it)) = (1/2 - sigma)(L + O(1/t)). The proof uses only that P does not vanish. It therefore holds verbatim for every unimodular twist, for the Liouville twist, for E_a-type products and for a Beurling product (any Dirichlet-type exponential), and it fails for a stage that can vanish (DH, T-NR).

**(b) PROVED.** d/dsigma log abs(Theta(sigma + it)) at sigma = 1/2 equals -F'(t), where Theta = chi(s) P(1-s)/P(s) (Cauchy-Riemann; arg Theta(1/2 + it) = -F(t) + const). Hence for the analytic stage A: where F'(t) > 0, abs(Theta) < 1 immediately to the right of the line and the on-line zeros near t are simple and isolated from off-line zeros; where F'(t) < 0, abs(Theta) > 1 immediately to the right. F'(t) = L - 2 Re sum w(n) Lambda(n) n^(-1/2 - it) + O(1/t) (Gonek (49)). The trivial bound gives F' > 0 when sum w(n) Lambda(n)/sqrt(n) < L/2:

| weight | trivial sum (asymptotic) | provable range | at T = 1e6 (L/2 = 5.989): largest tabulated X with trivial sum < L/2 |
|---|---|---|---|
| sharp | 2 sqrt(X) | X < L^2/16 | X = 11 (4.26); X = 30 gives 8.32 |
| Fejer | 4 sqrt(Y)/log Y | Y < (L log Y)^2/64, about (L log L)^2/16 | Y = 100 (5.18); Y = 1000 gives 15.1 |
| Gonek trapezoid (support X^2) | 4X/log X | X about (L log L)/8 | none tabulated (X = 100 gives 75.5) |

This is round-3 lesson 2 and row Q11. Planner pre-check 1 is correct for the phase-monotonicity range and for the analytic stage, up to the weight-dependent power of log L; it is not the range of the on-line theorem for Gonek's stage, which is all (X, t). The off-line zeros of the analytic stage measured by `c3-twinladder-prime-built-chain` (first at X = 5, t = 42.8, where L = 1.92 and 4 sqrt(5) = 8.9) lie outside the range, as they must.

**(c) PROVED from the classical explicit formula (contour shift with kernel Y^z/(z^2 log Y)); MEASURED check.** For the Fejer weight,

    sum_n Lambda(n) (1 - log n/log Y)_+ n^(-s) = -zeta'/zeta(s) - (zeta'/zeta)'(s)/log Y - sum_rho Y^(rho-s)/((rho-s)^2 log Y) + Y^(1-s)/((1-s)^2 log Y) + (trivial zeros),

and collecting the three terms of each zero, with w = (rho - s) log Y and kappa(w) = (e^w - 1 - w)/w^2,

    F_Y'(t) = 2 log Y sum_rho Re kappa((rho - s) log Y) - 2 Re [Y^(1-s)/((1-s)^2 log Y)] + O(1/t),   s = 1/2 + it.

For rho on the line, w = iu, u = (gamma - t) log Y, and Re kappa(iu) = (1 - cos u)/u^2 >= 0. So: under RH, F_Y'(t) >= -2 sqrt(Y)/(t^2 log Y) - O(1/t) for every Y, in particular for Y up to t^(4 - eps): the Fejer stage has monotone phase far beyond the provable range. An off-line pair 1/2 +- delta + i gamma_0 contributes about 2 Y^delta cos((gamma_0 - t) log Y - 2 arg(delta + i(gamma_0 - t)))/((delta^2 + (gamma_0 - t)^2) log Y), negative on half of every period in t and larger than the on-line total (about L) once Y^delta exceeds about L log Y (delta^2 + v^2) (ARGUED; this is the shape of Gonek's converse). The statement "F_Y' >= 0 on every window" is sum over zeros of h_t(gamma) >= 0 for h_t = Fejer kernel of bandwidth log Y centred at t: the Weil functional on a one-parameter family of tests with non-negative transform. This is planner pre-check 2 (the k = 0 comb term is the truncated explicit formula), verified, and it places the k = 0 term in rows P10 / eq48 (one-sided bound is the target). Gonek's trapezoid weight has the kernel (cos u - cos 2u)/u^2 (his (44)), which is not sign-definite; that, not a failure of RH, is why his phase stops being monotone.

MEASURED (`controls.py`, `controls.json`; 700 zeros around T = 1e6 from Arb, 200 values of t): prime side minus zero side of F_Y' is at most 1.0e-4, 9.3e-5, 8.1e-5 in modulus for Y = 1e2, 1e4, 1e6 (values of size 12; tail of the zero sum beyond the list replaced by its mean density, at most 0.0095).

MEASURED (`window.py`, `window_T1e+06.json`; T = 1e6, window [T, T + 40], step 0.002; 75 sign changes of Hardy's Z):

| weight | X | trivial sum | max Re sum | min F' | share of t with F' < 0 | stage zeros in window |
|---|---|---|---|---|---|---|
| sharp | 11 | 4.26 | 2.61 | 6.75 | 0 | 75 |
| sharp | 100 | 16.9 | 5.21 | 1.55 | 0 | 75 |
| sharp | 1e3 | 60.5 | 8.21 | -4.45 | 0.042 | 75 |
| sharp | 1e6 | 1997 | 16.2 | -20.5 | 0.245 | 76 |
| Fejer | 1e3 | 15.1 | 3.08 | 5.82 | 0 | 76 |
| Fejer | 1e5 | 107 | 5.33 | 1.31 | 0 | 76 |
| Fejer | 1e6 | 287 | 5.71 | 0.554 | 0 | 76 |
| trapezoid | 100 | 75.5 | 6.85 | -1.73 | 0.020 | 76 |
| trapezoid | 1000 | 558 | 10.2 | -8.37 | 0.132 | 75 |

The true maximum of the prime sum stays far below the trivial sum (16 against 1997), so the provable range is far from the true one; closing that gap for the Fejer weight is the Weil inequality above.

### Lemma 2 (crossing device)

**(a) Degree form. PROVED.** Let B = [sigma_0, 2] x [t_1, t_2], sigma_0 > 1/2, t_1 >= C_0, and let G be continuous and non-vanishing on B (for instance Gonek's stage, by Lemma 1(a)). If zeta(s)/G(s) is not in (-infinity, 0] for every s on the boundary of B, then zeta has no zero in B. Proof: (1 - lambda) zeta + lambda G does not vanish on the boundary for 0 <= lambda <= 1, so zeta and G have the same boundary winding number; that of G is 0 because G extends to a non-vanishing continuous map of B; that of zeta is its number of zeros in B. The strict Rouche form abs(zeta - G) < abs(G) is the special case abs(zeta/G - 1) < 1. Analyticity of G is not needed; the analytic stage A is not usable beyond the range of Lemma 1(b) because it has zeros in B.

**(b) The quantity. CLASSICAL (Gonek Thm 3.1, unconditional, sigma >= 0, X >= 2) + PROVED rewriting.** zeta(s) = P_X(s) Z_X(s) (1 + O(X^(-sigma-2)/(tau^2 log^2 X))), Z_X(s) = exp(sum_rho F_2((s - rho) log X) - F_2((s - 1) log X)), F_2(z) = 2 E_2(2z) - E_2(z). With Theta^G = chi(s) conj(P_X(s))/P_X(s), abs(Theta^G) = abs(chi(s)) < 1:

    zeta/G_X = Z_X(s) (1 + small) / (1 + Theta^G(s)),   abs(arg(1 + Theta^G)) < arcsin abs(chi(s)) <= pi/2.

So the inequality of (a) is: the continuous branch of Im [sum_rho F_2((s - rho) log X) - F_2((s-1) log X)] - arg(1 + Theta^G(s)), started at 0 near sigma = 2, stays inside (-pi, pi) on the boundary. Sufficient: abs(Im log Z_X) < pi/2 there. Necessary: abs(Im log Z_X) < 3 pi/2. **The quantity to be bounded is a sum over all zeros of zeta.** On the prime side it is the tail arg zeta(s) - arg P_X(s) = -Im sum (Lambda(n) - Lambda_X(n)) n^(-s)/log n, defined by continuation (a conditionally convergent prime sum at abscissa sigma_0 < 1).

**(c) The approximate functional equation. CLASSICAL identity; PROVED remark.** With N M = t/(2 pi) and D_N(s) = sum_{n <= N} n^(-s): zeta(s) = D_N(s) + chi(s) D_M(1 - s) + R, R = O(N^(-sigma)) + O(t^(1/2 - sigma) M^(sigma - 1)). Writing P_X(s) = sum a_X(n) n^(-s) (a_X(n) = 1 for n <= X in the sharp product form) and T_N(s) = P_X(s) - D_N(s) = sum (a_X(n) - 1_{n <= N}) n^(-s):

    zeta(s) - A_X(s) = -(T_N(s) + chi(s) T_M(1 - s)) + R.

R is small unconditionally. T_N is the tail of the X-smooth series beyond N minus the non-smooth part below N; its trivial bound is of the size of P_X(sigma) itself (exp(X^(1-sigma)/((1-sigma) log X))), and any better bound is a bound for P_X - D_N, i.e. (taking N >= t, where D_N = zeta + O(t^(-sigma)) and the dual sum is empty) for P_X - zeta. The approximate functional equation moves the problem from zeta to a Dirichlet polynomial and leaves the comparison "Euler product against Dirichlet polynomial at abscissa sigma_0 < 1" untouched. For Gonek's stage the dual term chi conj(P_X(s)) has coefficients n^(-sigma) instead of n^(sigma - 1) and matches the dual sum only on the line.

**(d) Size of the functional-equation term. PROVED (Stirling) + MEASURED.** abs(Theta^G(s)) = abs(chi(s)) = (t/2 pi)^(-d)(1 + O(1/t)) at sigma = 1/2 + d. For fixed d > 0 the stage is P_X(1 + O(t^(-d))) and the device is the Hurwitz comparison zeta/P_X of `c1-leeyang-krein-limit` Thm. D; the functional equation enters only in the layer d <= c/L. There the measured effect is mixed. In the 40-unit window (138 rows of `window_T1e+06.json`: 3 weights, X from 2 to 1e6, six values of d from 0.25/L to 0.25), max abs arg(zeta/G_X) > max abs arg(zeta/P_X) in 136 rows and max abs(zeta/G_X - 1) > max abs(zeta/P_X - 1) in 122 rows. In the 2000-unit scan at d = 0.25/L (table below) the extremes order the other way for X <= 11 and the same way for X >= 100. Reading (ARGUED): the factor 1/(1 + Theta^G) carries one stage zero on the line per unit of phase, which cancels the near-pi swing of arg zeta at each zero when P_X is too short to follow it; once X is large enough for arg P_X to follow arg zeta, the stage zeros sit near but not at the zeros of zeta and their mismatch adds phase.

### Decisive test

Question: is the boundary inequality of Lemma 2 implied by a prime-side statement strictly weaker than the Landau target (rows P10 / T2: a one-sided bound with slack is the target; c1 Thm. D: local boundedness of renormalised stages is RH)?

Answer: **no**. Steps:

1. (PROVED, Lemma 2(a)) The inequality on the boundary of B implies that B is zero-free. Any statement that implies it for all boxes [1/2 + d, 2] x [t, t + 1] with d = d(t) -> 0 implies RH up to the sliver d(t).
2. (CLASSICAL, Gonek Thm 5.1, RH assumed; opened) For 2 <= X <= t^2 and sigma >= 1/2 + C log log 2 tau/log X, C > 1: zeta = G_X (1 + O(log^((1-C)/2) tau)); conversely this approximation leaves at most finitely many zeros to the right. So the inequality at depth d is true under RH exactly when X >= (log t)^(C/d) (lower threshold up to the constant), and its truth for such X is equivalent to the zero-free statement up to the shift C log log t/log X.
3. (CLASSICAL-recalled, Montgomery 1977: for fixed 1/2 < sigma_0 < 1 and any real theta, Re e^(-i theta) log zeta(sigma_0 + it) >= c (log t)^(1 - sigma_0)/(log log t)^(sigma_0) for arbitrarily large t) For fixed X, log P_X is bounded on Re s = sigma_0, so arg(zeta/G_X) leaves (-pi, pi) at arbitrarily large heights: the inequality with X fixed is false at some heights for every sigma_0 < 1, with or without RH. Uniformity in height forces X = X(t) -> infinity.
4. (ARGUED) Non-locality in X. For Re z -> -infinity, F_2(z) is about e^(-2z)/(4 z^2). A zero rho_1 = beta_1 + i gamma_1 with beta_1 > sigma_0 contributes to log Z_X on the left edge a term of modulus about X^(2(beta_1 - sigma_0))/(4 abs(s - rho_1)^2 log^2 X) with phase rotating like X^(-2i(t - gamma_1)). For X large against the vertical distance this exceeds 3 pi/2, whatever the distance. With X = t^A the inequality on one box therefore requires zero-freeness of Re s > sigma_0 at all heights within about t^(A(beta_1 - sigma_0)) of the box: the inequality is a statement about the half-plane, not about the box.
5. Prime-side form (Lemma 2(b)): a two-sided bound, with fixed slack, on the imaginary part of the prime tail sum over n > X of Lambda(n) n^(-sigma_0 - it)/log n, X a power of log t. Such a bound is the twisted, t-local form of the Landau target at abscissa sigma_0 (row T2 "twisted fixed-s form"). By 1, 2 and 4 it is sandwiched between the zero-free statement at sigma_0 - C log log t/log X and the zero-free statement on (a neighbourhood growing with X of) the box. Nothing weaker implies it.

The pre-stated score conditions: "an inequality survives X -> infinity with constants uniform in height" is not met (step 3: X must grow with t; step 4: for X growing the inequality is the half-plane statement); "each control fails at a named step" is met only in the sense of section 4 (the failing step is the comparison step, which is the conclusion).

### One window at T = 1e6

MEASURED (`window.py`, float64 with zeta and chi from Arb midpoints; vertical lines sigma = 1/2 + d, t in [1e6, 1e6 + 40], step 0.002). W = zeta/G_X, W0 = zeta/P_X. Columns: max abs(W - 1); share of t where the strict Rouche inequality abs(W - 1) < 1 fails; max abs arg W; same for W0.

| weight | X | d | max abs(W-1) | strict fails | max abs arg W | max abs(W0-1) | strict fails (W0) | max abs arg W0 |
|---|---|---|---|---|---|---|---|---|
| sharp | 2 | 0.25/L = 0.0209 | 25.1 | 0.438 | 2.91 | 7.91 | 0.534 | 2.82 |
| sharp | 11 | 0.0209 | 13.3 | 0.335 | 2.81 | 3.74 | 0.437 | 2.48 |
| sharp | 1e3 | 0.0209 | 6.34 | 0.080 | 2.42 | 1.94 | 0.143 | 1.60 |
| sharp | 1e6 | 0.0209 | 4.15 | 0.032 | 1.90 | 1.49 | 0.011 | 1.11 |
| sharp | 1e3 | 0.5/L = 0.0417 | 2.86 | 0.032 | 1.85 | 1.37 | 0.043 | 1.20 |
| sharp | 1e6 | 0.0417 | 2.00 | 0.011 | 1.27 | 0.90 | 0 | 0.72 |
| sharp | 1e3 | 1/L = 0.0835 | 1.26 | 0.004 | 1.11 | 0.80 | 0 | 0.74 |
| sharp | 1e6 | 0.0835 | 0.83 | 0 | 0.67 | 0.37 | 0 | 0.33 |
| sharp | 11 | 0.25 | 0.90 | 0 | 0.78 | 0.89 | 0 | 0.73 |
| sharp | 1e6 | 0.25 | 0.075 | 0 | 0.073 | 0.023 | 0 | 0.023 |
| Fejer | 1e6 | 0.0209 | 4.20 | 0.042 | 2.33 | 1.14 | 0.010 | 1.46 |
| trapezoid | 1e3 | 0.0209 | 3.95 | 0.012 | 1.94 | 1.01 | 0.001 | 1.06 |

Full table (138 rows) in `window_T1e+06.json`. Readings:
- In this 40-unit window the degree condition (W avoids the negative real axis) holds on every one of the 138 lines: no crossing of the negative axis was found, max abs arg W < pi throughout (largest 2.93, Fejer Y = 3, d = 0.0209). It holds already for X = 2. It also holds with the stage of a random twist U or with zeta's stage translated by 2 pi/L in place of G_X (section 4). The degree condition in one window at moderate height is therefore not evidence about the stage: it is true because the box is zero-free and arg zeta is small at this height.
- The strict inequality fails near the line for every X <= 1e6 (d <= 0.5/L) and holds from d = 1/L for X >= 1e4 (sharp), in line with the threshold d of order log log t/log X.
- Margins improve with X at a rate consistent with 1/log X, not faster.

MEASURED long scan (`scan.py`, `scan_T1000000_H2000_d0.25.json`; one vertical line sigma = 1/2 + 0.25/L, t in [1e6, 1e6 + 2000], step 0.002, sharp log-sum; X = 1 means P = 1, i.e. G = 1 + chi):

| X | crossings of the negative axis by zeta/G_X | max abs arg | crossings by zeta/P_X | max abs arg (no FE term) |
|---|---|---|---|---|
| 1 | 12 (first near t = 1000129.5, 1000203.5, 1000327.3) | 3.142 | 148 | 3.142 |
| 2 | 0 | 3.009 | 76 | 3.142 |
| 11 | 0 | 2.917 | 0 | 3.115 |
| 100 | 0 | 2.769 | 0 | 2.331 |
| 1000 | 0 | 2.643 | 0 | 2.131 |
| 10000 | 0 | 2.401 | 0 | 1.628 |

So the degree condition does fail at this height when the stage carries no primes (12 places in 2000 units), and one prime (X = 2) removes the failures in this range; at X = 2 the margin left is pi - 3.009 = 0.13.

CERTIFIED in ball arithmetic (`cert.py`, python-flint 0.9.0, 100 bits; zeta on each boundary segment from its Taylor polynomial of degree 11 at the segment centre plus the Lagrange remainder with the degree-12 coefficient enclosed over the segment; P_X, chi, and the quotient evaluated on sub-balls with adaptive bisection): for X = 1000 (sharp log-sum, 193 prime powers), sigma_0 = 1/2 + 0.5/L = 0.541744..., B = [sigma_0, 2] x [1000000, 1000010], zeta/G_X avoids (-infinity, 0] on the whole boundary: 1146 boundary segments of half-length 0.01, 4132 sub-balls, bisection depth at most 3, no undecided sub-ball, 619 s (`cert_fixed_10.log`, `cert_X1000_d0.5_1000000_1000010.json`; largest abs arg at a sub-ball midpoint 1.366). With Lemma 2(a) and abs(chi) < 1 in the box (Lemma 1(a)) this certifies that zeta has no zero in B.

The certificate shows the device is checkable; it restates a fact below verified height (wall: verified height).

## 3. What stops the route (recorded obstruction)

The FE-symmetrised stage has all its zeros on the line for free, and for exactly that reason the on-line property carries no information: it holds for any non-vanishing P. All information is in the comparison zeta against stage. That comparison is (i) for fixed distance d from the line, the Hurwitz comparison zeta/P_X of c1 Thm. D, already identified as equivalent to RH; (ii) in the layer d <= 1/L, the same comparison with an additional phase from the stage's zeros, which helps for short products and lowers the margin for long ones (measured); (iii) through the approximate functional equation, the same comparison with zeta replaced by a Dirichlet polynomial. The phase-monotonicity inequality F' >= 0, which is the k = 0 comb term, is the Weil functional on Fejer tests. Rows: P10 / T2 (one-sided or two-sided prime-sum bound with slack is the target), Q19 / c1 Thm. D (Hurwitz), Q11 (coverage X about log^2 t), eq48 (Weil functional on a test family), wall "verified height" for the certificate. The k != 0 comb terms were not examined here (they are the subject of `c4-stage-collision-law`).

## 4. Controls

Measured rows: `controls.py`, `controls.json` (T = 1e6, window of 20, X = 1000 sharp, lines d = 0.5/L, 0.1, 0.25); `dh.py`, `dh.json`.

| Control | Stage zero-free off the line (Lemma 1(a)) | Comparison step (Lemma 2 inequality) | Named step that fails |
|---|---|---|---|
| U (random unimodular completely multiplicative twist, seed fixed) | **passes**: min abs(G^U/P^U) = 0.393, 0.698, 0.950 = 1 - max abs(chi) on the three lines; 41 on-line stage zeros in the window (zeta's stage: 37; zeta: 37) | no function with zeta's functional equation and coefficients u(n) exists (Hamburger; CLASSICAL-recalled), so the left side is undefined. With zeta on the left and U's stage on the right the degree condition still holds in this window (no negative-axis crossing), while the strict form fails widely: max abs(W - 1) = 202, 63, 16.6 (zeta's own stage: 2.28, 0.75, 0.13) | none that is proved for zeta. A U whose limit has a zero at s_0 fails the comparison near s_0 (Hurwitz); a random U has a zero-free convergent product in Re s > 1/2 (CLASSICAL-recalled) and passes everything, and the conclusion is true for it. Lead 13 is not answered. |
| DH | **fails**: the stage f_X = (1/2)[(1 - i k) P_X(s, chi) + (1 + i k) P_X(s, chibar)] is a sum of two exponentials and vanishes in Re s > 1/2: zeros at 0.836297 + 85.763087i (X = 100), 0.800884 + 85.713671i (X = 1000), 0.808501 + 85.707440i (X = 1e4), residual below 1e-29 (mpmath, 30 digits, not certified), next to the DH zero 0.8085171825 + 85.6993484854i. At such a point both terms of f_X + chi_DH conj(f_X) vanish | not reached | non-vanishing of the stage; this is the step that uses the Euler product (stage = exponential of a Dirichlet series). |
| E_a, a = 0.2 (zeros on Re s = 0.3, 0.7) | **passes**: abs(chi(s+a) chi(s-a)) <= 0.091 on sigma_0 = 0.6; min abs(G/P) = 0.909 | **fails** on sigma_0 = 0.6: 37 crossings of the negative axis, total change of arg W = -74.4 pi, -73.9 pi, -73.5 pi (X = 1e2, 1e3, 1e4); the window holds 37 zeros of zeta(s - a), all to the right of this line; **passes** on sigma_0 = 0.75 (no crossing, max abs(W - 1) = 2.0, 1.2, 0.88) | the comparison step, at boxes reaching left of 1/2 + a. Same step that is unproved for zeta. |
| Window translate (stage read at t + 2 pi/L) | passes | degree condition holds in this window (no crossing; share of Re W <= 0: 0.26, 0.15, 0); strict form fails (max abs(W - 1) = 31, 9.2, 2.2) | none at the degree level in one window; only the quantitative margin sees the translate. Confirms the reading under the window table. |
| Liouville twist (zeta(2s)/zeta(s)) | passes (stage with zeta's chi: any chi with modulus < 1 right of the line will do) | F/P^lambda: no crossing; max abs(F/P - 1) = 2.39, 0.77, 0.14. F has no functional equation s <-> 1 - s; its zeros are at rho/2, left of the line, so the conclusion "no zero in the box" is true | nothing fails; no contradiction (conclusion true for this control in Re s > 1/2). |
| Beurling | passes for any Beurling product with any chi | no integers, no approximate functional equation, no reflected function | not formulable (not a quantitative handle). |
| T-NR | fails if the local factor at q is taken as given (it vanishes on Re s = 1/2 +- arccosh(abs(c)/2)/log q) | not reached | non-vanishing of the stage (structural, not computed). |
| Backward heat, theta^w, phase-rotated transfer operator | no Dirichlet series or Euler-type stage | not formulable | not formulable. |

Summary of controls: two (DH, T-NR) fail at the one step that uses the product structure, and that step is non-vanishing of the stage, which unimodular and signed twists keep. Every control with a non-vanishing stage either passes with a true conclusion (Liouville, random U) or fails at the comparison step (E_a, U with a zero), which is the unproved step for zeta.

## 5. Verdict

Precise obstruction. The decisive test is negative: the Rouche (degree) inequality between zeta and the FE-symmetrised Euler stage is, on the prime side, a two-sided bound with slack on the prime tail beyond X at abscissa sigma_0 < 1 and height t, which is the Landau target in twisted local form; it is implied by nothing weaker, the approximate functional equation only re-expresses it, the functional-equation term of the stage is negligible at fixed distance from the line and lowers the measured margin for large X in the layer where it is not, the inequality cannot be uniform in height at fixed X, and for X growing it is a half-plane statement. The lane keeps two exact statements: the Fejer-stage identity F_Y' = 2 log Y sum Re kappa (phase monotone under RH for all Y up to a power of t; the k = 0 comb term is the Weil functional on Fejer tests), and the degree form of Rouche for non-analytic stages with a ball-arithmetic implementation.

## 6. Requirement flags

- **R1 (multiplicativity essential): false.** The product structure is used in one step (the stage is an exponential, hence non-vanishing; DH fails there, measured). No conclusion about zeros follows, and the step holds for every unimodular or signed twist.
- **R2 (height-uniform, every window): false.** The inequality at fixed X fails at some heights (step 3 of the test); with X(t) it is true under RH only. The identities (Lemma 1(c), Lemma 2(b)) are exact at every height, which is not what R2 asks.
- **R3 (every control fails at a named structural step): false.** DH and T-NR fail at non-vanishing; E_a fails at the comparison step, which is the conclusion; U is not separated.
- **R4 (reaches the critical line): false.** The device reaches depth d only with X >= (log t)^(C/d) and only conditionally; in the layer d <= 1/L, where the functional equation acts, the measured margin for X >= 100 is smaller with the FE term than without it.

## 7. Three weakest steps

1. Step 4 of the decisive test (non-locality; "for large X the inequality on one box needs the whole half-plane zero-free") is argued from the leading asymptotics of F_2 for a single off-line zero. Cancellation among several off-line zeros on the whole left edge is not excluded with constants, and with the constraint X <= t^2 of Gonek's theorems the reach is t^(2(beta_1 - sigma_0)), not all heights. The off-line threshold in Lemma 1(c) is argued in the same way.
2. The window tables are float64 on a grid of step 0.002 on vertical lines only; a crossing of the negative axis between grid points could be missed, and failures of the degree condition were exhibited only for the stage with no primes (X = 1); for X >= 2 none was found in 2000 units at T = 1e6, so the statement that every fixed X fails somewhere is not illustrated numerically. The claim that fixed X fails at large height rests on Montgomery's omega theorem, recalled and not opened. The certificate covers one (X, d) and a window of length 10; it takes abs(chi) < 1 inside the box from Gonek's Lemma 6.1 (C_0 < 6.3) rather than from balls, and its remainder enclosure relies on the Arb power-series zeta at ball input.
3. The equivalence in step 2 rests on Gonek's Thm 3.5 / 5.1, read but not re-derived, stated there with RH as a global hypothesis and with unspecified constants; the statement that the functional-equation term lowers the margin for large X and raises it for small X is a measurement at one height with a heuristic reason, not a theorem. `c3-multiwindow-converse-defect` was not read in full.

## 8. Files

`window.py`, `window_T1e+06.json`, `window_T1e+06.npz` (Lemma 1 and Rouche tables); `controls.py`, `controls.json` (U, window translate, Liouville, E_a, Fejer identity); `dh.py`, `dh.json`; `cert.py`, `cert_fixed_10.log`, `cert_X1000_d0.5_1000000_1000010.json` (ball certificate; a first run with a relative overlap of 1e-9 between sub-balls was discarded because the float spacing of t near 1e6 is 1.2e-10, and rerun with an absolute overlap of 1e-8); `scan.py`, `scan.log`, `scan_T1000000_H2000_d0.25.json` (long scan); `src_gonek/gonek2012.pdf`, `.txt` (source opened). All runs local through `scripts/memcap.sh 8` with `.venv-arb/bin/python`, single process, each under 20 minutes (window 52 s, controls 32 s, certificate 619 s, scan about 4.5 min). The compute server was not used.
