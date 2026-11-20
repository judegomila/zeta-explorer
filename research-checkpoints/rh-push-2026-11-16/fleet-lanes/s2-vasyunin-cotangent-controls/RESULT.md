# s2-vasyunin-cotangent-controls: Route M (Vasyunin Gram, cotangent sums, Burnol ratio) against the controls

Date 2026-11-19. Screening lane, four combinations. Grades: PROVED / CLASSICAL / MEASURED / NOT RUN.

## Verdict

Four combinations tested, no survivor.

- Combinations 1, 2 and 4 use the Gram matrix only. The Gram matrix of F depends on |F(1/2+it)| alone
  (Lemma 1). A function with an inserted off-line zero and the same modulus on the line has the same Gram
  matrix (Lemma 2), so no statistic of these three combinations can fail for it. Among the listed controls
  the outcome is a change of constants: every limit exists, kappa_F > 0 for every F by an identity, the
  residual sign law holds for every F with the sign of one mean-value constant, lam_max is bounded for all.
- Combination 3 (Burnol ratio) uses the target vector, so it does see the half-plane. The ratio departs
  for T-NR already at N = 100 and does not depart for Davenport-Heilbronn at N = 5500. In both cases the
  size of the departure is the Blaschke floor, an explicit function of the off-line zeros. This is zero
  resolution, at the scale the zero heights predict.

RH content: none. No bound moves.

## Sizes reached and where the runs were made

| function | first moment, all b up to | Gram N | machine |
|---|---|---|---|
| zeta | 30000 | 30000 | server (unit rh-s2vas-all-1119222425, 8 cores, 12 GB) |
| T-NR q=2, c=2.1 | 7500 | 7500 | server |
| T-NR q=3, c=2.2 | 3333 | 3333 | server |
| T-NR q=101, c=2.2 | 100 | 100 | server |
| L(chi_-3) | 7000 | 7000 | local, 1 core |
| L(chi_5) | 5500 | 5500 | local, 1 core |
| Davenport-Heilbronn | 5500 | 5500 | local, 1 core |
| E_a (a=1/4), U = zeta(s+i) | limit constant only | NOT RUN | local quadrature |
| backward heat, Liouville sign twist | not formulable (see section 6) | | |

The server had load average 150 to 200 on 40 cores during the run; the 8-core unit received 0.7 to 1.6
cores. The zeta and T-NR stages finished there (40 minutes). The planned server runs of L(chi_-3) to
14000, L(chi_5) to 10000 and DH to 12000 would have taken several hours at that share; they were replaced
by the local runs above and the unit was stopped. T-NR sizes are limited by the zeta table (arguments
up to q^2 N); q = 101 needs direct sums with moduli up to 10^6.

## 1. Definitions and two lemmas

For F with int |F(1/2+it)|^2/(1/4+t^2) dt finite let W_F(t) = |F(1/2+it)|^2/(1/4+t^2),
g_F(u) = (1/2pi) int W_F(t) e^{itu} dt, A_F(lambda) = lambda^{1/2} g_F(log lambda). The Nyman-Beurling
vectors are v_n = n^{-s} F(s)/s on Re s = 1/2 and

    G_F(m,n) = <v_m, v_n> = g_F(log(m/n))/sqrt(mn) = A_F(m/n)/m,    I_F(a,b) = ab G_F(a,b) = b A_F(a/b).

For zeta, A is the function of `b-route-m-first-moment` and I(a,b) is Vasyunin's formula.

Exact formulas used (all checked against piecewise-exact integration of the defining integral, 31 pairs,
agreement within the 1e-7 error of the brute-force side; `validate.py`):

- zeta: I(a,b) = C(a+b) + (1/2)(a-b) log(b/a) - (pi/2)(V(a,b)+V(b,a)). CLASSICAL.
- F with real q-periodic coefficients c_n, sum over a period zero, S(t) = sum_{n<=t} c_n
  (L(chi_-3), L(chi_5), DH with c = (1, xi, -xi, -1, 0), xi = 0.2840790438):

      I_F(a,b) = -(1/q) [ T(a,b) + T(b,a) - D(a,b) ],
      T(x,y) = sum_{r=1}^{qy} c_r S(xr/y) psi(r/(qy)),   D(a,b) = sum_{r=1}^{q} c_{br} c_{ar} psi(r/q).

  PROVED here (summation by parts over the jumps of the step function S(bx)S(ax), periodic sums by
  digamma; the logarithmic terms cancel because the jumps of a periodic function sum to zero over a
  period). T is the twisted cotangent sum of the task: psi(x) - psi(1-x) = -pi cot(pi x).
- T-NR, F = zeta(s)(q^{s-1/2} + c + q^{1/2-s}): on the line the factor is 2 cos(t log q) + c, so
  I_F(a,b) = b sum_{d=-2..2} w_d q^{-d/2} A(a q^d/b), w = (1, 2c, c^2+2, 2c, 1). PROVED (one line).

**Lemma 1 (PROVED).** W_F is in L^1, so g_F is continuous, bounded by g_F(0) and tends to 0 at
infinity. Every entry of G_F, hence every statistic of combinations 1, 2 and 4, is a function of
|F(1/2+it)| only. In particular w_F(lambda) (the symmetric cotangent sum divided by the modulus) is,
up to elementary terms, A_F(lambda), a continuous function of the real variable lambda for every F.
(The reading of node rm-bc-reciprocity-wobble that w_sym "does not extend continuously" was already
superseded for zeta by L3 of `b-route-m-first-moment`; Lemma 1 gives it for every F.)

**Lemma 2 (PROVED; the reason combinations 1, 2, 4 close).** Let Re rho_0 > 1/2 and
F*(s) = F(s) (s-rho_0)(s-conj rho_0) / ((s-1+conj rho_0)(s-1+rho_0)). Each factor has modulus 1 on
Re s = 1/2, so G_{F*} = G_F for every N, while F* has zeros at rho_0 and conj rho_0 off the line.
Every Gram-only statistic takes the same value on zeta and on zeta*. No such statistic can be a
survivor. The same holds for T-NR in a weaker form: W_F <= (c+2)^2 W_zeta pointwise.

**Lemma 3 (PROVED).** kappa_F := int_0^1 A_F = (3/(4 pi)) int W_F(t)/(9/4+t^2) dt > 0 for every F.
For periodic F also kappa_F = (3/2) int_0^inf S_1(t)^2 t^{-4} dt with S_1 = int_0^t S. Checked: exact
value against quadrature of the Mellin form to T = 150 (difference 2e-7 = the truncated tail) for
zeta, L(chi_-3), L(chi_5), DH, T-NR q = 2, 3 (`consts.py`, `consts.json`).

## 2. Combination 1: first moment kappa_F(b), parts, residual sign law

Statistic: kappa_F(b) = F_F(b)/(phi(b) b), F_F(b) = sum_{a=2,(a,b)=1}^{b-1} I_F(a,b); residual
r(b) = kappa_F(b) - kappa_F. Survival would have required kappa_F <= 0 or a broken sign law for a
control at b below the height scale of its off-line zeros.

| F | kappa_F (exact) | kappa_F(b) at largest b | eps_F = A_F(1)/2 - kappa_F | sign r(b) = sign(eps_F) mu(b) on squarefree b >= 200 | geometric mean abs(r) b on primes |
|---|---|---|---|---|---|
| zeta | 0.6954960511 | 0.6954960457 (b=30000) | -0.065165 | 17973 of 18120 | 0.0639 |
| L(chi_-3) | 0.1593725896 | 0.1593709 (7000) | +0.142927 | 4124 of 4133 | 0.1428 |
| L(chi_5) | 0.1120952747 | 0.1121029 (5500) | +0.218231 | 3220 of 3220 | 0.2178 |
| DH | 0.4069850721 | 0.4069813 (5500) | +0.091651 | 3200 of 3220 | 0.0919 |
| T-NR q=2 | 11.2154610393 | 11.2154621 (7500) | -1.659547 | 4427 of 4439 | 1.604 |
| T-NR q=3 | 11.2552610724 | 11.2558570 (3333) | -1.813630 | 1905 of 1907 | 1.715 |
| T-NR q=101 | 6.9326720153 | 6.91209 (100, b < q) | -1.058565 | 29 of 48 (b <= 100 only) | - |
| E_a, a=1/4 | 1.57907 (quadrature) | NOT RUN | | | |
| U = zeta(s+i) | 0.350685 (quadrature) | NOT RUN | | | |

kappa_F(b) > 0 for every b and every F (minimum over b: zeta 0.441, chi_-3 0.094, chi_5 0.073, DH 0.268,
T-NR 4.30 to 7.18; all at b = 3 or 5). MEASURED, and PROVED in the limit by Lemma 3.

Mechanism of the sign law (PROVED as an identity, leading term MEASURED). With
Phi(b) = sum_{a<=b,(a,b)=1} A_F(a/b), R_n = sum_{j<=n} A_F(j/n) = n kappa_F + A_F(1)/2 + eps(n):
Phi(b) - kappa_F phi(b) = sum_{d|b} mu(d) eps(b/d) for b > 1, and eps(1) = A_F(1)/2 - kappa_F = eps_F.
The term d = b gives mu(b) eps_F; the others are smaller (zeta: eps(2) = 0.0115 against
eps(1) = -0.0652). For prime b the residual is -eps_F b/phi(b) to leading order: the last column
equals abs(eps_F) to three digits in five rows. The smallest-prime dependence (node
rm-residual-smallest-prime) is the same for every F: geometric mean of abs(r) b rises from P^-(b) = 2 to
prime b by the factor 2.1 (zeta), 2.5 (chi_-3), 2.6 (chi_5), 2.9 (DH), 2.3 (T-NR q=2).

eps_F = (1/2pi) int W_F(t) [1/2 - (3/2)/(9/4+t^2)] dt is a mean value of |F|^2 on the line. The sign
law is Moebius inversion of a Riemann-sum error times the sign of that constant. Zeta and T-NR have
sign -mu(b); both L-functions and DH have +mu(b). The node's law sign = (-1)^omega(b) concerns
F_arith, the Riemann sum of the elementary function C(1+u) + (1/2)(1-u) log u, which does not depend
on F at all.

Parts. Zeta: arithmetic part 0.57081, fixed-modulus cotangent part -0.00031, leaf part 0.12499 (limits
(3/2)C - 3/8, 0, 1/8); for b >= 200 the cotangent part is positive for all 29801 b. Periodic F have no
arithmetic part (the diagonal term averages to 0); fixed-modulus part negative, leaf part positive, sum
positive for all b >= 200 in all three (chi_-3: -0.2858 + 0.4452; chi_5: -0.4364 + 0.5485;
DH: -0.1833 + 0.5903). T-NR q = 2, 3: all three parts positive.

Classification: CLOSED. Mean-value object; the separation between functions is a constant shift
(kappa_F, eps_F). DH passes with the same structure as L(chi_5). No control fails at any b.

## 3. Combination 2: reciprocity function, leaf mean, cancellation ratio

| F | leaf mean (top 10% of b) | leaf sign changes, b >= 200 | abs(S(b))/A(b), top 10% of b: mean (min, max) | rms of A_F about a line on [0.09, 0.11], relative, at 4 to 6 values of b |
|---|---|---|---|---|
| zeta | -0.079572 in V units; -0.07957748 at b = 30000; -1/(4 pi) = -0.07957747 | 0 | 0.5402 (0.5386, 0.5412) | 0.00163 to 0.00183 |
| L(chi_-3) | +0.4452 | 0 | 0.8352 (0.8319, 0.8392) | 0.086 to 0.088 |
| L(chi_5) | +0.5485 | 0 | 0.7786 (0.7726, 0.7835) | 0.32 to 0.38 |
| DH | +0.5903 | 0 | 0.9855 (0.9846, 0.9867) | 0.0032 to 0.0039 |
| T-NR q=2 | +1.0869 | 0 | 0.3532 (0.3497, 0.3565) | 0.0019 to 0.0021 |
| T-NR q=3 | +1.5366 | 0 | 0.5161 (0.5086, 0.5227) | 0.0013 to 0.0018 |

Leaf mean = sum over a of the varying-modulus half divided by phi(b) b, in the units of I_F (for zeta
converted to V units). The last column is the analogue of the "wobble at fixed denominator size" of
imp-97577: the residual of A_F(a/b) about a straight line over reduced fractions in a fixed window; it
is the variation of a continuous function over the window, so it does not decay with b and does not
grow, for every F.

Zeta: the leaf mean agrees with -1/(4 pi) to 7 digits at b = 30000 (5 digits were known at 12870) and
the cancellation ratio is 0.5402 on b in [27000, 30000] (0.5397 in the node at b <= 24001). MEASURED.

Outcome against the pass/fail rule of the task: a limit exists and the leaf mean has a fixed sign for
zeta, for the comparison L-functions, for DH and for T-NR. By Lemma 1 this is forced: all three
numbers are averages of the continuous function A_F over Farey fractions. The three numbers differ
between functions only as constants.

Classification: CLOSED. Controls pass; no dependence on zeros.

## 4. Combination 3: Burnol ratio

Statistic: ratio_F(N) = d_N^2 log N / C_on(F), d_N = distance from 1/s to span{v_n : n <= N},
right-hand side <1/s, v_n> = F(1)/n for entire F, (log n + 1 - gamma)/n for zeta, and the sum over the
three dilations n, nq, nq^2 for T-NR in the normalisation zeta(s)(1 + c q^{1/2} q^{-s} + q q^{-2s}).
C_on(F) = sum over on-line zeros of 1/abs(rho)^2: zeta 0.0461914; real primitive chi: 2 xi'/xi(1, chi)
(chi_-3 0.113230, chi_5 0.156557; all known zeros on the line); DH: 0.195272 for all zeros minus
0.001601 for the 84 off-line pairs below height 2000 of the control battery table = 0.193672 (direct
on-line sum to 2000 is 0.192339; pairs above 2000 change the fourth digit); T-NR: zeta's value.

Floor (PROVED; standard Hardy-space computation). With B the Blaschke product of the zeros of F in
Re s > 1/2: d_inf^2 = 1 - abs(B(1))^2 for entire F, and d_inf^2 = 1 - abs(B(1))^2 - abs(B'(1))^2 when
F has the simple pole at 1 (the vectors then lie in (s/(s-1)) H^2). The second form was found because
the first gave a floor above the measured d_N^2 for T-NR; the corrected floor lies below every measured
value. For T-NR, abs(B(1))^2 = (cosh((1/2-delta)L/2)/cosh((1/2+delta)L/2))^2 and
B'(1)/B(1) = (L/2)(tanh((1/2-delta)L/2) - tanh((1/2+delta)L/2)), L = log q, delta = arccosh(c/2)/L.

| F | N | d_N^2 at N | floor d_inf^2 | ratio at N | range of the ratio | floor share of d_N^2 | lowest off-line zero |
|---|---|---|---|---|---|---|---|
| zeta | 30000 | 0.0044236 | 0 | 0.9873 | 0.9633 to 0.9957 on [3000, 30000]; 0.9768 to 0.9957 on [10000, 30000] | 0 | none known |
| L(chi_-3) | 7000 | 0.011302 | 0 | 0.884 | 0.866 to 0.907 on [3000, 7000] | 0 | none known |
| L(chi_5) | 5500 | 0.015754 | 0 | 0.867 | 0.857 to 0.892 on [3000, 5500] | 0 | none known |
| DH | 5500 | 0.020367 | 0.000368 | 0.9057 | 0.886 to 0.906 on [3000, 5500] | 0.018 | 0.8085 + 85.70 i |
| T-NR q=2 | 7500 | 0.098436 | 0.091729 | 19.01 | 14.7 to 19.0 on [625, 7500] | 0.932 | 0.9543 + 4.53 i |
| T-NR q=3 | 3333 | 0.181033 | 0.169309 | 31.79 | 23.6 to 31.8 on [277, 3333] | 0.935 | 0.9038 + 2.86 i |
| T-NR q=101 | 100 | 0.656481 | 0.457581 | 65.4 | - | 0.697 | 0.5961 + 0.68 i |

Zeta values agree with the earlier exact ladder to 10 digits (N = 2600: 1.01022871636 here,
1.0102287163795 in imp-96487; N = 10000: 0.97691020097, 0.97691020098). New range: the ratio stays
below 1 for every N from 2680 to 30000, mean 0.9855 on [10000, 30000], maximum 0.9957 at N = 18245. The
plateau reading of node burnol-ratio-plateau continues one further half decade. MEASURED.

DH. The ratio does not depart by N = 5500: its range is inside the ranges of the two L-functions of
the comparison, and it does not exceed 0.93. The floor contributes floor x log N / C_on = 0.016 at
N = 5500 and 0.020 at N = 30000, against a spread of 0.03 between L(chi_-3), L(chi_5) and DH and an
oscillation of 0.013 rms inside each. The floor term reaches 0.1 at log N = 53. This agrees with the
earlier screen (d_N needs log N in the hundreds): the ratio does not help, because the normalisation
log N / C_on only rescales the same floor. The extension of the DH run to N = 30000 (not done; see
sizes) would add 0.004 to the floor term and cannot change this.

T-NR. The ratio is 12 to 65 already at N = 100 and grows like floor x log N / C_on. The departure is
the floor, which is a function of the zeros only; the zeros sit at heights 0.68 to 4.5, below the
first zero of zeta, with real parts 0.60 to 0.95. This is resolution of low, far-off-line zeros at
the scale their position predicts, not a separation by any other mechanism.

Conductor tone (nodes burnol-ratio-conductor-band, route-m-conductor-tones). Single-tone fit to the
ratio, detrended by a line in log N, scan of w from 1 to 20:

| F (conductor) | window | best w | R^2 | R^2 at w = 4.08 |
|---|---|---|---|---|
| zeta (1) | [600, 5500] | 3.88 | 0.73 | 0.72 |
| zeta (1) | [2500, 30000] | 6.74 | 0.55 | 0.05 |
| L(chi_-3) (3) | [600, 5500] | 3.54 | 0.83 | 0.78 |
| L(chi_5) (5) | [600, 5500] | 7.28 | 0.49 | 0.16 |
| DH (5) | [600, 5500] | 3.80 | 0.77 | 0.75 |
| T-NR q=2 | [600, 5500] | 9.02 | 0.60 | 0.12 |

The tone near w = 3.9 is present for zeta, L(chi_-3) and DH on the same window with the same
frequency within the resolution of a span of 2.2 in log N, is absent for L(chi_5), and is absent for
zeta on the longer window. It does not move with the conductor and does not persist; the attribution
to conductors 4 and 5 is not supported. For T-NR q = 2 the tone is at 2 pi/log 2 = 9.06, the period of
the dilation by q.

Classification: CLOSED. T-NR fails by resolved zeros; DH does not fail at the sizes reached and, by
the floor formula, cannot before log N of order 50; the comparison L-functions behave like DH.

## 5. Combination 4: lam_max, logistic law

| F | N | lam_1 | lam_2 | w_1 | r0 | k | d log lam_1 / d log N, first octave -> last octave |
|---|---|---|---|---|---|---|---|
| zeta | 30000 | 6.4532 | 3.2140 | 0.0503 | 4.21 | 1.43 | 0.085 (250-500) -> 0.037 (12000-24000) |
| L(chi_-3) | 7000 | 0.8013 | 0.6131 | 0.1992 | 5.20 | 3.74 | 0.032 -> 0.019 |
| L(chi_5) | 5500 | 0.7414 | 0.3785 | 0.8081 | -2.14 | 1.49 | 0.000 at every octave (lam_1 constant to 4 digits from N = 100) |
| DH | 5500 | 2.2814 | 1.5343 | 0.0703 | 6.51 | 2.52 | 0.056 -> 0.028 |
| T-NR q=2 | 7500 | 101.876 | 43.799 | 0.0639 | 3.18 | 1.19 | 0.105 -> 0.050 |
| T-NR q=3 | 3333 | 101.248 | 38.003 | 0.0754 | 2.56 | 1.02 | 0.117 -> 0.059 |
| T-NR q=101 | 100 | 49.98 | 4.50 | 0.190 | 0.60 | 0.42 | - |

r0 = log((1-w_1)/w_1)/log(lam_1/lam_2), k = 1/log(lam_1/lam_2), w_1 = <e_1, v_1>^2 (the two-scale
form of imp-96652). Zeta at N = 1000, 2000, 3000 reproduces imp-96652 (lam_1 5.50 to 5.86, w_1 0.098 to
0.078). r0 for zeta passes the fitted 2.94 and is 4.21 at N = 30000: r0 is not a constant, it grows
with N as w_1 decreases.

The local growth exponent decreases at every octave for every function with a growing lam_1; it is
0.037 for zeta at the top (lam_max <= 18 is proved for zeta). T-NR: lam_max(G_F) <= (c+2)^2
lam_max(G_zeta) <= 18 (c+2)^2 (PROVED, from W_F <= (c+2)^2 W_zeta); the measured ratio
lam_1(T-NR)/lam_1(zeta) is 16.5 to 16.7 at every N against (c+2)^2 = 16.81 (q = 2). For the periodic F
boundedness is MEASURED only. Sign twist with weight |zeta(2s)/zeta(s)|^2: not formulable (section 6).

Classification: CLOSED, the expected stop. The exponent tends to 0 in the same way for zeta, the
L-functions, DH and T-NR; by Lemma 2 it could not have been otherwise for a control of type F*.

## 6. Controls not run and why

- Backward heat: the deformed function has no fixed gamma factor and no ordinary Dirichlet series
  (flow-euler-defect), so there is no canonical F(1/2+it) and no Nyman-Beurling vectors. Not formulable.
- Sign-twisted primes in the Liouville form zeta(2s)/zeta(s): the weight has a double pole at every
  zeta zero on the line and at t = 0; it is not locally integrable and the Gram matrix does not exist.
  Not formulable.
- E_a and the unimodular twist zeta(s + i alpha): the weight is integrable and kappa_F is computed
  (1.579 and 0.3507, positive as Lemma 3 requires). No closed form for I_F(a,b) is available (the
  partial-sum function is not periodic), so the finite-b statistics and the Gram were NOT RUN. Lemma 1
  covers the existence of all limits of combinations 1 and 2. For E_a the vectors have two poles to the
  right of the line and the Burnol set-up needs a different subtraction; not attempted.

## 7. Checks

1. Pair values against piecewise-exact integration of the defining integral: 7 zeta pairs, 28
   periodic pairs (chi_-3, chi_5, DH, chi_-4), 3 T-NR pairs; all inside the brute-force error.
   I_F(1,1) = L(1, chi_-3) = pi/(3 sqrt 3) and pi/4 for chi_-4 to 16 digits.
2. kappa: K = 0.6954960511 reproduced by the piecewise-exact routine to 20 digits; exact values against
   Mellin-form quadrature for six functions. This cross-check exposed a missing factor q^-d in the
   first version of the T-NR constant (corrected in `consts_fix.py`).
3. Zeta Burnol ratio against the earlier exact ladder: agreement to 10 digits at N = 2600, 3000, 6000,
   10000. Zeta top eigenpair against imp-96652.
4. 30-digit recomputation of d_n^2 for all n <= 48 (mpmath Gram, mpmath Cholesky), zeta and DH:
   maximum difference from the float64 pipeline 9e-16 (`hp_check.py`).
5. All reported numbers are closed-form float64 sums on CPU; no GPU stage was used. Smallest Cholesky
   pivot 7.6e-5 at N = 30000 (zeta); the ratio is good to at least 6 digits.

## 8. Table

| combination | statistic | sizes | zeta | L-function comparison | DH | T-NR | E_a, heat, twists | classification |
|---|---|---|---|---|---|---|---|---|
| 1 first moment, sign law | kappa_F(b), sign of residual | b <= 30000 (zeta), 7000, 5500, 7500, 3333 | kappa = 0.695496 > 0; sign = -mu(b), 99.2% | kappa = 0.1594, 0.1121 > 0; sign = +mu(b), 99.8%, 100% | kappa = 0.4070 > 0; sign = +mu(b), 99.4% | kappa = 11.22, 11.26, 6.93 > 0; sign = -mu(b), 99.7%, 99.9% | kappa > 0 (E_a, U); heat, Liouville not formulable | CLOSED: constant shift, mean value of abs(F)^2 on the line |
| 2 reciprocity, leaf mean, cancellation | limit of leaf mean, abs(S)/A, window rms | same | -1/(4 pi) to 7 digits; 0.5402 | limits exist; 0.835, 0.779 | limit exists; 0.9855 | limits exist; 0.353, 0.516 | limits exist by Lemma 1; values not run | CLOSED: continuity of A_F for every F |
| 3 Burnol ratio | d_N^2 log N / C_on | N = 30000, 7000, 5500, 5500, 7500, 3333, 100 | 0.963 to 0.996 on [3000, 30000] | 0.87 to 0.91, 0.86 to 0.89 | 0.89 to 0.91; floor share 1.8% | 19, 32, 65; floor share 93%, 94%, 70% | not run | CLOSED: departure = Blaschke floor = resolved zeros; none for DH before log N about 50 |
| 4 lam_max, logistic | lam_1, slope, r0 | same N | 6.45, slope 0.037 falling | 0.80 (slope 0.019), 0.7414 (slope 0) | 2.28, slope 0.028 falling | 101.9, 101.2 = 16.6 x zeta | Liouville not formulable | CLOSED: bounded for all, as expected |

## 9. Three weakest steps

1. The periodic comparisons and DH reached N = 5500 to 7000, not the 10000 to 14000 planned and not
   the 30000 of the task. For combination 3 the floor formula makes the DH conclusion independent of N
   in this range; for the tone table the short span (2.2 in log N) limits the frequency resolution.
2. The leading-term statement of the sign law (the term d = b of the Moebius sum dominates) is
   measured, not proved; the exceptions (0.1% to 0.8% of squarefree b) are not characterised.
3. C_on(DH) uses the battery's zero table to height 2000 (MEASURED zeros); pairs above 2000 are
   neglected, and the floor 0.000368 is therefore a lower value for the true floor.

## Files

`nbcore.c` (pair values, statistics, Gram), `gramla.py` (top eigenpairs, in-place Cholesky, d_n^2),
`consts.py`, `consts_fix.py`, `consts.json` (kappa_F, C_on, floors), `analyze.py`, `show.py`,
`validate.py`, `hp_check.py`, `run_all.sh` (server unit), `out/` (server: zeta, T-NR),
`outl/` (local: chi_-3, chi_5, DH), `out/analysis.json`, `outl/analysis.json`.
