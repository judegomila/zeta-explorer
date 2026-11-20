# s1-kernel-shear-norms: RESULT

Date 2026-11-19. Kind: screening (compute). Four combinations screened. **Survivors: 0.**
Labels: PROVED / CLASSICAL / MEASURED (float64 or ball arithmetic without enclosed truncation tails) / OPEN.
No statement about zeros of zeta is made.

## 0. Verdict

| # | combination (tags) | statistic | sizes reached | zeta | comparison L-functions | controls | classification |
|---|---|---|---|---|---|---|---|
| 1 | Volterra shear norm (shear x weil) | a_V(F) = the a at which the norm of V_{a,Phi_F} reaches 1; bracket G/2 <= norm <= G from three moments of Phi_F^2 | 440 twins, 220 Euler arms, 7 real characters, DH, 5 heat values; quadrature 6000 nodes; Nystrom 1500 | 31.6214 (replay of b-volterra-norm) | real chi q = 3, 4, 5, 7, 8, 11, 13: 13.42, 8.67, 8.83, 2.33, 4.40, 1.81, 2.83; 220 complex arms: 0.017 to 5.79 | DH 5.70 (its n = 1 theta term alone: 5.88); twins 0.019 to 16.5; sign-flipped zeta kernel 31.6214 (identical); heat tau = -4..1: 32.89 to 31.30, monotone, no feature at 0 | CLOSED. Depends on Phi^2 only. PROVED: each Euler arm reaches norm bound 1 before both of its twins (220 of 220 measured). No relation to the Weil onset a* after the leading coefficient is removed (Spearman 0.018) |
| 2 | Thin truncated Hankel norm (twin-ladder x certificate) | first window L* with norm of H_{a,L} > 1 (a = 1/4 and 1/20) | zeta and chi_{-3}: L = 2981 (l = 8, 8 886 110 coefficients, basis 3997, frequency cut-off 785); 440 twins to L = 36.6; heat to L = 90 | norm - 1 <= 9e-11 at every window (float64 noise) | chi_{-3}: <= 7e-11 to L = 2981; chi mod 4, 5, 7, 8, 11, 13 and complex chi mod 5: <= 3e-9 to L = 36.6 to 54.6 | DH: L* = 6.7 (44 coefficients), then 1, 2, 6, 10, 15, 18 eigenvalues above 1 as the window passes the 1st..18th off-line zero with beta > 3/4; 421 of 440 twins fail at a = 1/20, the 19 that pass have no known off-line zero; heat tau = -0.05 passes to L = 90; product b = 0.2, T-NR c = 2.05 and 23 twins with zeros at beta <= 3/4 pass at a = 1/4; unimodular twist and two sign twists fail at L <= 1.65, the third sign twist at L <= 2.72 | CLOSED. Verified height in another form: window L detects exactly the poles with beta > 1/2 + a and height below about 2 pi L^2/q; L*^2 is about 0.2 to 1.4 times q gamma/(2 pi), i.e. the square of the approximate-functional-equation length |
| 3 | Saddle ratio of autocorrelation moments (shear x heat-flow) | sign pattern of r_n = R_n - 1 and of eps_n, n = 3..2200 | 20 kernels, moments to 2204, 384-bit balls | canonical Phi: r_n > 0 and eps_n > 0 for all n <= 2200: none of the three landmarks exists. The landmarks (149, 215.2, -5.8e-4 at 500) are replayed only for the kernel coded in imp-3849, which is not Phi | real chi q = 3, 4, 7, 5, 8: one crossing at n* = 17.1, 13.2, 8.7, 4.9, 3.5 | DH: n* = 10.89; its n = 1 theta term alone: 10.45, r_n equal to 4e-5 for n >= 200; heat moves n* continuously in both directions (coded kernel: 45 to 271 for tau = -2..0.1, gone at tau = 0.5; canonical: appears at 1134 for tau = -2) | CLOSED. Kernel-blind (leading theta term and gamma-factor exponent only; uses no prime) and moved through every value by heat flow |
| 4 | Reverse regularity of s(x+y), s(t) = Phi(sqrt t), and capture slope (bridge x total-positivity) | largest k with sign W_j(t) = (-1)^{j(j-1)/2} for all j <= k, W_j = det[s^{(i+m)}(t)], on 200 points of t; 800-bit balls | 75 real primitive characters (conductor <= 120), 220 T+ twins, DH, 4 heat values | order 4; fifth condition fails on (0, 0.02] including t = 0.01 (matches Sra Thm 1.1) | order 4: chi_{-3} only; order 3: 1; order 2: 23; order 1: 38; order 0: 12 (74 of 75 below four) | DH: 3; T+ twins: 0 of 220 reach four (orders 0, 1, 2, 3: 39, 108, 66, 7); heat tau = -50..50: order 4, identical sign table (PROVED invariance) | CLOSED. Order >= 4 fails for 74 of 75 Euler-product comparisons, so it is not a property of the L-function class; exactly invariant under heat flow in both directions. Capture-slope maximiser is a low-frequency kernel number (DH 5.6165, its n = 1 term 5.6265) |

Known pattern to beat: not beaten. Combination 2 is a clean instance of it (the test separates a control exactly when its window resolves the off-line zero, and for non-functional-equation controls at once for the functional-equation reason). Combinations 1, 3, 4 never see zeros or primes.

## 1. Objects and code

Convention x = e^{4u}. Kernel of a Dirichlet-type F = sum b(n) n^{-s} (b periodic mod q, parity delta, completed with (q/pi)^{(s+delta)/2} Gamma((s+delta)/2)):
Phi_F(u) = 4 e^{(1+2 delta)u} sum_n b(n) n^delta exp(-pi n^2 e^{4u}/q), int_R Phi_F(u) e^{iwu} du = Lambda_F(1/2 + iw/2).
Zeta: canonical Phi(u) = sum (2 pi^2 n^4 e^{9u} - 3 pi n^2 e^{5u}) exp(-pi n^2 e^{4u}) (full-line transform xi(1/2 + iw/2)/4).
DH: b = (1, kappa, -kappa, -1, 0) mod 5. Twins: route 44, F_theta = sum Re(e^{i theta} chi(n)) n^{-s}, q = 5..49, 440 twins (`chars44.py` is a copy of `tmp/routes-b10-r44-euler-depth/chars.py`; onsets and zero table copied to `twin_onsets.json`, `twin_zeros.json`). Heat: e^{tau u^2} Phi.

Checks of the kernel code (`klib.py` self-test): Phi(0) = 0.446696900467; evenness of Phi_zeta, Phi_DH, Phi_chi to 1e-29; Fourier identity for DH and zeta to 15 digits; twin parity Phi(u)/Phi(-u) = omega.

Files: `klib.py` (kernels, characters), `c1_volterra.py`, `hlib.py` + `c2_hankel.py` + `c2_twins.py` + `analysis_c2.py` + `summary_c2.py` + `recheck_dh.py` + `heat_zeros.py` + `val_c2.py`, `c3_saddle.py`, `c4_rr.py` + `c4_capture.py`, `run_*.sh` (server launch scripts), `out/` (local outputs and merged tables), `out_server/` (raw server outputs), `server_logs/`.

## 2. Combination 1: Volterra shear norm

Definition (b-volterra-norm): (V_{a,Phi} f)(t) = int_0^t Phi(t)Phi(s) sinh(a(t-s)) f(s) ds on L^2(0,inf); G(a)^2 = (E_+ E_- - I^2)/4 with E_pm = int_0^inf Phi^2 e^{+-2at}, I = int_0^inf Phi^2; G/2 <= norm <= G (PROVED there for any real Phi).

Finite consequence tested: the a at which the norm reaches 1 for DH and the twins is related to the certified Weil onset a* and differs from the Euler arm. Survival would need both.

Validation: zeta G(0.5) = 4.6736600977e-4 (record 4.673660098e-4), norm(0.5) = 4.575664e-4 (4.57567e-4), G = 1 at 31.621348 (certified bracket 31.6213..31.6214), norm = 1 at 31.621366 (record 31.621366), G = 2 at 34.05578 (34.05578).

Results (MEASURED; `out/c1_volterra.json`). Columns: a with G = 1, a with norm = 1 (Nystrom), a with G = 2.

| object | G = 1 | norm = 1 | G = 2 |
|---|---|---|---|
| zeta | 31.6213 | 31.6214 | 34.0558 |
| zeta, kernel sign flipped for u > 0.3 | 31.6213 | 31.6214 | 34.0558 |
| chi_{-3} | 13.4179 | 13.4206 | 15.6147 |
| chi_{-4} | 8.6539 | 8.6671 | 10.9306 |
| chi_5 | 8.8180 | 8.8292 | 10.9882 |
| chi_{-7} | 2.2931 | 2.3263 | 3.9621 |
| chi_8 | 4.3669 | 4.3988 | 6.4007 |
| chi_{-11} | 1.7733 | 1.8123 | 3.1462 |
| chi_13 | 2.7944 | 2.8269 | 4.4303 |
| DH | 5.6705 | 5.6991 | 7.9212 |
| DH, n = 1 theta term only | 5.8524 | 5.8801 | 8.0983 |
| zeta heat tau = -4, -1, -0.25, 0.25, 1 | 32.887, 31.940, 31.701, 31.541, 31.301 | same to 2e-5 | 35.369 .. 33.723 |

Twins: G = 1 at a from 0.0191 to 16.53 (350 of 440 below 3.6); 24 sampled twins have the Nystrom crossing inside the bracket, at most 3.7% above the G = 1 value.

Why it is closed.
- PROVED (b-volterra-norm T2): V_{a, eps Phi} = M_eps V_{a,Phi} M_eps for any sign function eps; the norm is a function of Phi^2. Measured here: the sign-flipped zeta kernel, whose transform has a zero off the line, gives the same three numbers to all printed digits.
- PROVED here (elementary). For a complex character, with the two twins T+ and T- of the pair, Phi_{T+} = Re(e^{i theta} Phi_chi), Phi_{T-} = -Im(e^{i theta} Phi_chi), so |Phi_chi|^2 = Phi_{T+}^2 + Phi_{T-}^2 and the moment vector (E_+, E_-, I) of the arm is the sum of the twins' vectors. E_+ E_- - I^2 is a Lorentzian form, each vector lies in its forward cone (Cauchy-Schwarz), and the square root of the form is superadditive there (reverse triangle inequality). Hence G_arm(a) >= G_{T+}(a) + G_{T-}(a) for every a: the Euler arm reaches the bound 1 before both non-Euler twins. Measured: 220 of 220 pairs; arm values 0.0167 to 5.79.
- Relation to the Weil onset a* (387 certified onsets 0.36..3.40): Spearman(a_V, a*) = -0.485 with the route-44 normalisation a(1) = cos theta; after a linear fit on (log q, log|a(1)|, delta) the residual has Spearman 0.018 with a*. With the normalisation a(1) = 1 the correlation is 0.097 and -0.012 after (log q, delta). The raw correlation is the scale of the leading coefficient (the norm is homogeneous of degree 2 in Phi), which is also the main predictor of a* (R^2 = 0.575 from the three predictors).
- Heat: the crossing moves smoothly through tau = 0.

The Delta and Maass cases of the node were not recomputed (the answer for them has the same form: three moments of Phi^2).

## 3. Combination 2: thin truncated Hankel norm

Definition (twistor-bridge report, pinned tree 712c4b0a, sections "Compact arithmetic operators" and "all-window boundedness"): (H_{a,L} f)(x) = int_0^L h_a(xy) f(y) dy on L^2(0,L). In log coordinates it is the operator on L^2(-l, l), l = log L, with kernel K(v+v'), K causal, int_0^inf e^{-wu} K(u) du = R_a(w) = X(w-a)/X(w+a), X(w) = completed function at s = 1/2 + w. K on (0, 2l) uses the Dirichlet coefficients n <= L^2 only. CLASSICAL/PROVED there: the norm is nondecreasing in L; sup over L is 1 if R_a is Schur and infinite otherwise; poles of R_a in Re w > 0 are the zeros with beta > 1/2 + a (unless cancelled).

Finite consequence tested: the first window L* with norm > 1 for each control, against the window that resolves the height of its first off-line zero. Survival would need L*^2 much smaller than the number of coefficients that locates the zero, or a failure not tied to a zero, for all controls.

Method (`hlib.py`). Galerkin in cubic B-splines of step h supported inside [-l, l]; matrix entries m(v_i + v_j), m(u0) = int K(u) B8(u - u0) du computed by FFT of R_a(c + it) Bhat8(c + it) with 8 to 12 aliased frequency images; arithmetic factor = truncated Dirichlet polynomial of F(z-a)/F(z+a) (GPU for the sums: up to 2.3e12 complex exponentials); generalised symmetric eigenproblem. The largest |eigenvalue| is a lower bound of the norm (compression), up to float64 error. float64 screen; frequencies above pi/h are not represented.

Validation.
- m(u0) against direct quadrature with the closed-form kernel g_a at 4 smooth points: agreement 5e-13 to 1e-12 (`val_c2.py`).
- zeta, a = 1/4, L = 3/2: 0.999958210 (h = 0.002), below the certified 49999/50000 = 0.99998; L = 1.0226: 0.629, below the proved 2^{-1/4} = 0.841.
- Two damping shifts (c = 2 and c = 0.75) and two steps (h = 0.005, 0.0025) give the same DH values (1.824e-2 and 1.830e-2 at l = 2).
- A first batch at l = 7 with damping shift c = 2 showed zeta at 1 + 3.8e-3; this was roundoff amplified by e^{2c l} (it disappears with c = 0.75: 1.1e-11). All large-window numbers below use c = 0.75. The c = 2 files remain in `out_server/` and are not used above l = 4.
- Heat symbol: Gaussian average of xi against direct quadrature of int Phi e^{tau u^2} e^{2wu}: 1e-13 to 2e-12.
- Independent recheck of the DH exceedance (`recheck_dh.py`: time domain, closed-form kernel, piecewise-constant cells, cell integrals as exact second differences, mpmath 30 digits): Rayleigh quotient 1.0116275733640728 at l = 2.0 (1000 cells) and 1.0744307298736782 at l = 2.5 (1250 cells), dominant frequency 84.6 and 86.6; 0.9999987 at l = 1.6. The spline values at the same windows are 1.0183 and 1.114 (both are lower bounds). This is a second method at higher working precision, not an interval certificate.

Results at a = 1/4 (MEASURED; `out/summary_c2.json`, `out_server/c2_*.json`).

| object | largest window | onset window l* (L*) | at the largest window |
|---|---|---|---|
| zeta | l = 8, L = 2981, N = 8 886 110 | none | norm - 1 = 8.6e-11 |
| chi_{-3} | l = 8 | none | 6.3e-11 |
| chi_{-4}, chi_5; complex chi mod 5 | l = 4 | none | 1.8e-9, 3.2e-9; 1.7e-9 |
| DH | l = 7, L = 1097 | about 1.9: norm - 1 <= 3e-13 for l <= 1.75, 2.5e-8 at 1.90, 6.9e-7 at 1.92, 1.2e-3 at 1.96, 1.8e-2 at 2.0 (L* = 6.7, L*^2 = 45; survey value 1.95 at tolerance 1e-7) | norm 3.30; eigenvalues above 1 capped at 11 by the cut-off 785 of h = 0.004 |
| zeta(s+b)zeta(s-b), b = 0.35, 0.45 | l = 4 | (0.25, 0.5] | 391 and 402 eigenvalues above 1 |
| zeta(s+b)zeta(s-b), b = 0.2 (zeros at beta = 0.7 < 3/4) | l = 4 | none | 1.9e-9 |
| T-NR q = 3, c = 2.2 (beta = 0.904) | l = 4 | (0.5, 0.75] | top mode frequency 2.85 = pi/log 3 |
| T-NR q = 3, c = 2.05 (beta = 0.703 < 3/4) | l = 4 | none | 1.1e-9 |
| sign twists (Liouville, two random) | l = 4 | (0.25, 0.5], (0.25, 0.5], (0.75, 1.0] | norm 8 to 16 |
| unimodular twist n^{-i} | l = 4 | (0.25, 0.5] | norm 113 |
| heat tau = -4, -0.5, -0.3, -0.2 | l = 4.5 | (0.25, 0.5], (1.25, 1.5], (1.75, 2.0], (2.0, 2.25] | |
| heat tau = -0.1 | l = 4.5, L = 90 | none | 2.6e-12 |

DH: number of eigenvalues above 1 against the off-line zero table of c12-control-battery-harness (27 zeros with beta > 3/4 below 2000), h = 0.002 (cut-off 1571):

| l | 2.0 | 2.5 | 2.75 | 3.0 | 3.25 | 3.5 |
|---|---|---|---|---|---|---|
| eigenvalues above 1 | 1 | 2 | 6 | 10 | 15 | 18 |
| height of the pole with that index | 85.7 | 240.4 | 531.3 | 737.8 | 1092.5 | 1274.2 |
| L^2 / (5 height / 2 pi) | 0.80 | 0.78 | 0.58 | 0.69 | 0.77 | 1.08 |

The top eigenfunction at l = 4 and at l = 7 has frequency 240.4 (second pole 240.40).

Twin survey (`c2_twins.py`, 440 twins, l <= 3.6, h = 0.008, tolerance 1e-7; noise among non-failing objects <= 3e-10):
- a = 1/20: 421 twins fail, 19 pass. All 375 twins with a listed zero of beta > 0.55 fail. The 19 that pass are among the 53 twins for which route 44 found no off-line zero below height 120. Onset windows l* from 0.30 to 3.5.
- a = 1/4: 364 fail, 76 pass; all 272 with a listed zero of beta > 3/4 fail; 23 of the 76 that pass have listed off-line zeros, all with beta <= 3/4.
- Scale law against the lowest listed pole: 2 l* = 1.16 log(q gamma/2 pi) - 2.02 (rms 0.65, correlation 0.88; a = 1/4: 1.17, -2.02, 0.83). With zeros located from the onset frequency by a Newton search on the Dirichlet series (399 of 421 onsets have an off-line zero within the frequency resolution; 141 of these zeros are not in the route-44 table): 2 l* = 1.005 log(q gamma/2 pi) - 1.585 (rms 0.79), and 0.68 log(q gamma/2 pi) - 0.77 log(beta - 1/2 - a) - 0.69 (rms 0.45).
- Coefficients read at onset against the approximate-functional-equation length sqrt(q gamma/2 pi), twins whose listed zeros are all inside the strip and with no listed real zero (208 twins): ratio from 0.99 to 17.5, median 4.4; one twin below 1 (0.99). Over all 375 twins with a listed pole the ratio goes down to 0.27; the smallest values belong to twins with a listed zero to the right of 1 or a listed real zero off 1/2.
- The frequency of the onset eigenfunction is not a reliable zero locator in every case: 22 onsets (a = 1/20) have no zero found within the resolution. Example q13.0.T+: onset frequency 18.7, and the argument principle gives exactly one off-line zero with real part in [0.52, 4] below 50, at 0.5836 + 31.43i.

Heat at a = 1/20 against the first height where the sign-change count of Xi_tau on the line falls 2 behind zeta's (`heat_zeros.py`, height <= 5000):

| tau | -1 | -0.5 | -0.3 | -0.2 | -0.1 | -0.05 |
|---|---|---|---|---|---|---|
| first deficit height | 95.9 | 111.9 | 185.6 | 334.2 | 415.5 | none below 5000 |
| onset window l* | (0.875, 1.0] | (1.25, 1.375] | (1.5, 1.625] | (1.75, 1.875] | (2.125, 2.25] | none to l = 4.5 |
| L*^2 / (height / 2 pi) | 0.38..0.48 | 0.68..0.88 | 0.68..0.87 | 0.62..0.80 | 1.06..1.36 | |

Reading.
- Controls with the functional equation (DH, twins, product, T-NR, heat): the norm stays at 1 within noise until the window reaches L^2 of about 0.2 to 1.4 times q gamma/(2 pi), gamma the height of the first zero with beta > 1/2 + a; the count of eigenvalues above 1 then follows the count of such zeros. The number of coefficients read, of order q gamma/2 pi, is the square of the approximate-functional-equation length that locates the same zero. A zero at height gamma is invisible below that window: heat tau = -0.05 and tau = -0.1 (at a = 1/4) pass every window reached.
- Zeros within distance a of the line are invisible at width a at every window (product b = 0.2, T-NR c = 2.05, 23 twins): the fixed-width test is a statement about the strip beta > 1/2 + a only.
- Controls without the functional equation (sign twists, unimodular twist) fail at L <= 1.65, where only n = 1, 2 are read: the symbol is not unimodular on the axis (unimodular twist: the pole of zeta(s + i alpha) is not cancelled by the factor s(s-1)). That is the functional equation, not the Euler product; DH, which lacks the Euler product, passes the same windows.
- zeta and the characters pass at every size reached; with the cut-off pi/h the test reaches heights 785 (l = 7, 8) and 1571 (l = 4), far below verified heights.

Classification: verified height in another form, as the all-window theorem states; the finite data add the scale law. Not a survivor.

## 4. Combination 3: saddle ratio of autocorrelation moments

Definitions (imp-3849 text): A(tau) = int_0^inf Phi(s)Phi(s+tau) ds, M_m = int tau^m A, C_n = M_{n+2}/((n+1)(n+2) M_n), D_n = C_{n+2} - C_n, tau*(n) root of n = (4 pi/q) tau e^{4 tau} (q = 1 in the source), C^s_n = tau*^2/((n+1)(n+2)), R_n = |D_n|/|D^s_n|, eps_n = M_{n+2}/(M_n tau*^2) - 1.

Finite consequence tested: the sign pattern of R_n - 1 and eps_n for n <= 2200 separates the controls. Survival would need the pattern to be shared by zeta and chi and to differ for DH and for backward heat.

Method: python-flint balls at 384 bits, panelled Gauss-Legendre (96 x 32 outer nodes, 24 x 32 inner); ball radii of r_n below 1e-107 (quadrature remainders not enclosed).

Validation on the kernel coded in imp-3849: eps sign change at 148.69 (eps_148 = +7.58e-6, eps_149 = -3.48e-6; record +7.60e-6, -3.46e-6), n* = 215.232 (215.231), minimum -5.844e-4 at n = 500 (-5.845e-4), R_3 = 3.6442, R_40 = 1.02440, r_2200 = -2.83e-4.

Results (MEASURED; `out/c3_saddle.json`).

| kernel | eps sign change | n* (R_n = 1) | minimum of r_n | r_2200 |
|---|---|---|---|---|
| coded kernel of imp-3849 (prefactors e^{4u}, e^{2u}) | 148.69 | 215.23 | -5.84e-4 at 500 | -2.8e-4 |
| canonical Phi (prefactors e^{9u}, e^{5u}) | none | none | r_n > 0 throughout | +1.18e-3 |
| chi_{-3}, chi_{-4}, chi_{-7} | 11.8, 9.1, 6.0 | 17.1, 13.2, 8.7 | -1.3e-2 at 40, -1.7e-2 at 31, -2.4e-2 at 21 | -6.8e-4, -6.9e-4, -7.2e-4 |
| chi_5, chi_8 (even) | 3.3, below 3 | 4.9, 3.5 | -7.3e-2 at 12, -9.6e-2 at 9 | -1.3e-3 |
| DH | 7.60 | 10.89 | -1.98e-2 at 26 | -7.03e-4 |
| DH, n = 1 theta term only | 7.28 | 10.45 | -2.09e-2 at 24 | -7.03e-4 |
| DH twin T- (odd kernel) | below 3 | 4.04 | -1.15e-1 at 11 | -1.9e-3 |
| coded kernel, heat tau = -2, -0.5, -0.1, 0.1, 0.5 | 29.8, 73.1, 123.0, 188.4, none | 45.1, 107.6, 178.8, 271.3, none | | |
| canonical, heat tau = -2, -0.5, -0.1, 0.1, 0.5 | 775, none, none, none, none | 1134, none, none, none, none | | |

max |r_n(DH) - r_n(n = 1 term)|: 6.1e-3 over n >= 3, 1.4e-4 over n >= 100, 4.3e-5 over n >= 200.

Reading.
- The three landmarks belong to the kernel as coded in imp-3849 (the same code is in imp-3470), which differs from the de Bruijn-Newman kernel by the powers of e^u in the prefactors. For the canonical Phi there is no sign change to n = 2200.
- For every Dirichlet-type kernel the pattern is one early crossing followed by a slow return to 0 from below; n* is set by the conductor and the gamma-factor exponent. DH sits between chi_{-7} and chi_{-4} and agrees with its own first theta term, which contains no coefficient beyond b(1).
- Heat moves n* continuously through every value, creates the crossing for the canonical kernel at tau = -2 and removes it for the coded kernel at tau = +0.5. No feature marks tau = 0.

Classification: closed. Kernel-blind tail statistic; flow-stable; no prime enters.

## 5. Combination 4: reverse regularity and capture slope

Definitions. s(t) = Phi_F(sqrt t) (Phi_F even, so s is analytic at 0). W_k(t) = det[s^{(i+j)}(t)]_{i,j<k}. Strict reverse regularity of order r of the Hankel kernel s(x+y) requires sign W_k(t) = (-1)^{k(k-1)/2} for all t > 0 and k <= r (coincident-node form; a violation at one t gives a violating minor at nearby nodes). The order reported is the largest r with all conditions k <= r holding at all 200 log-spaced points t in [1e-6, (1.25 + log(q)/4)^2]; it is an upper bound of the true order, and every violation is a determined ball sign (0 undetermined signs in 302 objects).

Finite consequence tested: the order drops below four for a control and not for the comparison L-functions.

Method: python-flint arb power series at 800 bits, 8 orders, theta series truncated at 16 sqrt(q) + 8 terms (tails below 1e-240, not enclosed). Twins use coefficients recomputed at 800 bits (`klib.twin_table_mp`): with float64 coefficients Phi is even only to 1e-16 and the odd part eps sqrt(t) dominates the high derivatives near t = 0; the first twin pass with float64 coefficients gave order 2 for the twin that equals DH and is discarded.

Validation: zeta has order 4; W_5 < 0 on t in (0, 0.0204] and at t = 0.01 (W_1..W_6 = 0.3043, -17.04, -2.380e5, 3.851e12, -2.742e22, -8.06e35); direct 5 x 5 minor on nodes of spacing 1e-3 near t = 0.01: -2.71e-38; 4 x 4 minor +3.85e-24. This matches the statement quoted from Sra (order four strict, fifth condition fails at t = 1e-2).

Results (MEASURED; `out/c4_rr.json`).
- Real primitive characters, conductor <= 120 (75): order 0 (s not positive): 12; order 1: 38; order 2: 23; order 3: 1 (D = 8); order 4: 1 (D = -3). Odd characters: 10, 22, 6, 0, 1; even: 2, 16, 17, 1, 0.
- DH: order 3 (W_4 has the wrong sign on (0, 0.1]); its n = 1 theta term alone: order 2.
- T+ twins (220): orders 0, 1, 2, 3: 39, 108, 66, 7; none reaches 4.
- Heat: PROVED invariance. s_tau(t) = e^{tau t} s(t), so det[s_tau(x_i + y_j)] = prod e^{tau x_i} prod e^{tau y_j} det[s(x_i + y_j)] and W_k[s_tau] = e^{k tau t} W_k[s]: every minor keeps its sign for every real tau. Measured for tau = -50, -1, 1, 50: identical sign tables, order 4.

Capture slope (second node; `c4_capture.py`, source convention of imp-3470: one-sided transform on [0, U], scan to 60). Maximiser of |d/dxi |Phihat|^2|: coded kernel 12.0665 (record 12.0667); canonical Phi 10.7445; chi q = 3, 4, 7, 5, 8: 7.01, 6.17, 4.92, 6.00, 5.02; DH 5.6165; DH n = 1 term 5.6265; heat tau = -1, 1: 10.84, 10.65.

Reading. The order drops below four for DH, but also for 74 of the 75 Euler-product comparison functions, including 12 whose kernel is not positive. Order four is a property of zeta's kernel (and of chi_{-3}), not of the class; DH has a higher order than 73 of the 75 characters. The property is exactly heat-invariant, so backward heat passes at every tau. The capture maximiser lies below the first zero and agrees between DH and its first theta term to 0.2%.

Classification: closed (not a class property; flow-blind by an exact identity).

## 6. Control summary

| control | 1 Volterra | 2 Hankel | 3 saddle ratio | 4 reverse regularity |
|---|---|---|---|---|
| Davenport-Heilbronn | same form as chi; arm before twins | fails when the window resolves 0.8085 + 85.70i (L*^2 = 45 against q gamma/2 pi = 68) | same pattern as chi; equals its n = 1 term | order 3; 74 of 75 characters also below 4 |
| backward heat | smooth in tau | passes until the first off-line zero with Re w > a is resolved; tau = -0.05 passes | n* moves continuously | exactly invariant |
| sign-twisted primes | not applicable (no theta kernel) | fails at L <= 1.65 (two twists) or L <= 2.72 (one) (no functional equation) | not applicable | not applicable |
| unimodular twist | not applicable | fails at L <= 1.65 (uncancelled pole) | not applicable | not applicable |
| zeta(s+b)zeta(s-b) | not run | b = 0.2 passes at a = 1/4; b = 0.35, 0.45 fail at L <= 1.65 (gamma = 14.13: gamma/2 pi = 2.25) | not run | not run |
| T-NR q = 3 | not run | c = 2.05 passes at a = 1/4; c = 2.2 fails at L <= 2.1 (gamma = 2.86) | not run | not run |
| Dirichlet L (positive comparison) | values spread like the twins | passes | one early crossing; zeta's canonical kernel has none | 1 of 75 behaves like zeta |

"Not applicable": combinations 1, 3, 4 are defined on the theta kernel of a function with a functional equation and a gamma factor; the sign and unimodular twists have no such kernel. "Not run": the product and T-NR kernels for 1, 3, 4 (their answers are fixed by the same kernel-only mechanisms and were not needed for the classification).

## 7. Compute record

Server units (all through rhrun, all stopped; `server_logs/`): `rh-s1ksn-gpu-1119184040` (2 cores, GPU 1 with a 5 GB pool; stopped by hand after the l = 7 runs with c = 2), `rh-s1ksn-gpu2-1119185327`, `rh-s1ksn-gpu3-1119200048`, `rh-s1ksn-cpuA-1119184655` (twin surveys; stopped by hand in the Volterra stage, see below), `rh-s1ksn-cpuB-1119193816` (saddle ratio, reverse regularity), `rh-s1ksn-cpuC-1119195709` (twin reverse regularity at 800 bits). Two earlier units were stopped and their output discarded: `rh-s1-cpuA-1119184019` (pool workers exceeded the 3 GB unit limit in the Dirichlet-sum chunks; chunk size reduced) and `rh-s1ksn-cpuA-1119184458` (restarted with a coarser step). Peak per unit: 3 GB, 6 cores; lane total 8 cores.
Device 1 showed 84.6 to 93.1 GB in use by other jobs during the run, less free memory than the brief states; the pool limit was set to 5 GB and the sums were chunked at 1 GB. rhrun refused requests above 3 to 4 GB of host memory (machine availability 43 to 44 GB), so every unit ran with a 3 GB limit and the planned l = 9 run for zeta (6.6e7 coefficients) was not started.
The Volterra screen (combination 1) ran locally under `scripts/memcap.sh 8` (4 minutes): the server load average was 93 and the threaded SVDs did not finish in 25 minutes there. Its size (all 440 twins) is the same on either machine. The mpmath recheck, the heat zero locator, the twin zero search and the capture slope also ran locally under the cap.
Largest sizes: 8 886 110 Dirichlet coefficients x 262 144 frequencies (2.3e12 terms) for zeta and chi_{-3} at L = 2981; dense eigenproblems to 3997; no dense solve above 1e4 was needed because the matrix dimension is 2l/h, not L^2.

## 8. Weakest steps

1. Combination 2 is a float64 screen. "Passes" means norm - 1 below 1e-10; the eigenvalue cluster at 1 cannot be resolved further, and frequencies above pi/h (785 or 1571) are not represented, so the heights tested for zeta are below 1571. The DH exceedance was rechecked by a second method at 30 digits, not by interval arithmetic.
2. The scale law of combination 2 has rms 0.65 to 0.79 in 2 l*; the route-44 zero table lists only the first zeros of each twin, the assignment of an onset to a zero by eigenfunction frequency fails in at least 22 cases, and 46 onsets (a = 1/20) have no listed pole (zeros for 141 onsets were found here by a float64 Newton search and are not certified).
3. Reverse-regularity orders are upper bounds on a 200-point grid with truncated theta series; the count "74 of 75 below four" is certified only up to the unenclosed tails. The identification of the coincident-node conditions with Sra's definition rests on the match for zeta (order four, failure at t = 1e-2); the preprint was not opened.
