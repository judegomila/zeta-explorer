# s2-derivative-zeros-two-line: screening of four combinations (2026-11-19)

Screening arm. Four combinations of idea-graph nodes were turned into finite tests, run on zeta, on L(s, chi_-3) and on the controls. Labels: PROVED (in this file or in the cited source), CLASSICAL, MEASURED. Nothing here is a statement about the zeros of zeta beyond the heights sampled.

**Verdict: 4 combinations tested, 0 survivors.** Combinations 1, 2, 3 are exact zero detectors whose finite forms fire only when the test region or the line data reaches the ordinate of an off-line zero (within one zero-offset delta, or one Poisson width); they use the functional equation or the Poisson-Jensen identity and no Euler product. Combination 4 fails at its premise for zeta itself.

## 0. Objects, code, where it ran

| code | object | first zeros off the symmetry line |
|---|---|---|
| ZETA | zeta(s) | none in the ranges used |
| L3 | L(s, chi_-3) (positive comparison) | none in the ranges used |
| DH | Davenport-Heilbronn, conductor 5 | 0.8085 + 85.699i, 0.6508 + 114.163i, 0.5744 + 166.479i, ... (84 pairs below 2000) |
| HEAT-0.5, HEAT-0.1 | backward heat F_tau, tau = -0.5, -0.1; Dirichlet-normalised as F_tau/g, g = zeta's gamma factor | tau = -0.5: 0.7430 + 111.694i, ...; tau = -0.1: 0.5216 + 415.256i |
| EA | zeta(s+a) zeta(s-a), a = 1/4 | every zero: 1/2 +- 1/4 + i gamma_n, first at 14.135 |
| TNR | zeta(s)(1 + c q^(1/2-s) + q^(1-2s)), q = 3, c = 2.2 | 1/2 +- 0.40375 + i 2.8596(2k+1), first at 2.860 |
| LIOU | zeta(2s)/zeta(s) (sign twist eps(p) = -1; no functional equation) | zeros on Re s = 1/4 and at s = 1; poles on Re s = 1/2 |
| unimodular twist | random chi(p) = e(u_p): no continuation on file, not formulable in the strip. The closed-form stand-in zeta(s + i alpha) is a vertical translate of zeta: every test below gives the zeta result on a shifted window. Not run. |

Zero tables of the controls: `push/c12-control-battery-harness/tables` (read as json).

Code (this directory): `objs.py` + `flib.py` (Arb objects; `flib.py` copied unchanged from s1-antibridge-cutoff-energy), `zgpu.py` (float64 Riemann-Siegel evaluator of zeta, zeta', zeta'' at s = 1/2 + x + it for -1/2 <= x <= 1, cupy on GPU 1), `t1_low.py`, `t1_zeta_gpu.py`, `t1_validate.py`, `t1_summary.py`, `t2_low.py`, `t2_zeta_gpu.py`, `t3_low.py`, `t3_zeta_gpu.py`, `t3_analyze.py`, `t4_arm.py`, `recheck.py`, `run_*.sh`. Outputs: `out/` (server runs and the analysis files), `out_local/` (local runs through `scripts/memcap.sh 8`).

Server (rhrun units `rh-s2dz-*`: one CPU unit of 8 cores and 3 to 4 GB, and one or two GPU-1 units of 4 cores, 4 to 5 GB of host memory and 3.4 to 3.7 GB of GPU memory each; with two GPU units beside the CPU unit the lane held a quota of 16 cores for about 50 minutes, above the 8-core default; all units stopped). One unit of this lane stopped on a cupy out-of-memory error when GPU 1 filled up (its own allocation of 0.96 GB failed); it was restarted with a smaller block (`RH_BLOCK=2e7`, pool limit 6 GB). Runs there: all zeta runs at large height, all of combination 1 at low height, combination 2 at low height, combination 4. The machine was loaded (load average 150 to 200, GPU 1 at 100% from other jobs, 8 to 14 GB of GPU memory free), which set the sizes below. Local (Mac, memcap 8 GB): the low-height runs of combination 3 (the server copies of the first two objects agree with the local files to 4e-14, then the server unit was stopped to free cores for the Arb re-checks), and the Arb re-check of the combination 2 screen.

Validation of the evaluator `zgpu.py` against Arb (`out/zgpu_validate.txt`): relative error of zeta, zeta', zeta'' at 35 points per height (x from -0.49 to 1, five ordinates): worst over all 175 points 2.4e-9 (at T = 1e4, the Riemann-Siegel truncation); in the printed rows at most 1.0e-12 at 1e6, 2.0e-14 at 1e9, 8.7e-14 at 1e10, 3.2e-13 at 1e12.

## 1. Table

| # | combination | statistic | sizes reached | zeta | L(chi_-3) | DH | HEAT (tau<0) | E_a | T-NR | sign twist (LIOU) | classification |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | speiser-criterion + zv-newton-flow + zv-cr-gradient-fields | number of zeros of f' in [0.01, 1/2] x [T, T+10] (winding of f' on the boundary, Newton location) | zeta: Arb to 2000.5 (200 windows); float64 screen 8,576 windows at T = 1e4 .. 1e12 (249,714 zeros of zeta on the line in those windows); Arb re-check 32 windows at 1e9, 1e10, 1e12. L3: Arb to 2000.5 and 12 windows at 1e4, 1e5. Controls: Arb, DH to 2000.5, others to 100.5 .. 425.5 | 0 everywhere | 0 everywhere | 84 zeros = 84 off-line pairs; each at the ordinate of its pair, max offset 0.029 (0.034 mean spacings); lowest at 85.705 against 85.699 | -0.5: 6 = 6, offsets <= 0.016; -0.1: 1 = 1, offset 9e-5, f' zero at 1/2 - 0.00049 (the pair is at 1/2 +- 0.0216) | 79 = 79, offsets <= 0.049 | 35 = 35, offsets <= 0.073 | 27 zeros of F' in [0.01, 1/4] x [0.5, 100.5] with no zero of F off Re s = 1/4; lowest at 21.063 | CLOSED: FE-only count identity (Levinson-Montgomery); the f' zero sits at the ordinate of the off-line zero. Lead 0. |
| 2 | euler-transport-flow + small-value-shear-energy | E_eta(D) = int_D K_eta^2 over D = (0, X) x (T0, T1), F completed; slope in log(1/eta); support of Q = {Re F'/F < 0} | zeta: Arb grid to 400 (195,000 points); float64 screen 17,120 rectangles (0, 1/2) x 10, 2.28e8 grid points, T = 1e4 .. 1e12 (10,000 rectangles at 1e10); Arb re-check 369 points. Controls: Arb, eta down to 1e-12 | Q = 0 at every grid point: E_eta = 0 for every eta | Q = 0 at 199,500 grid points to 400 | slope (pi/2)(1 - 4e-11) per zero; Q != 0 only for abs(t - gamma) < 0.93 delta .. delta | same; tau = -0.1: lens 0.021 x 0.042 | same (abs(t - gamma) < 0.245) | bias 0.63 on D = (0, 0.3) x (gamma +- 1.2) holding no zero (zero at x = 0.404, same ordinate) | E_eta = infinity for every eta: poles on the edge x = 0, measured (pi/2) log(1/r_min) per pole | CLOSED: detection needs a grid node inside a lens of size delta at the ordinate of the zero; the log-slope needs a node within eta/abs(F'(rho)) of it. Not cheaper than isolating the zero, no lead in height. |
| 3 | minimum-phase-hilbert-identity + two-line-zero-detector + bsy-interior-value-criterion | D_T(w) = log abs G(w) - int_{abs t <= T} P_w log abs G(1/2+it) dt on Re w = 1, 1.2, 1.5; T_det = first T with D_T < -2 x (null level of zeta and L3) at distance >= m from the end of the data | zeta: Arb to 400; float64 screen, windows of length 2000 at T = 1e4 .. 1e12 (4.5e4 zeros of zeta as breakpoints, 6.0e6 line nodes). L3: Arb to 450. Controls: Arb to 400 (heat: 60..260 and 380..450) | abs D <= 6.6e-4 at 20 from the window end, <= 1.1e-6 at 500 from it for the windows of length 2000 (Re w = 1); log abs zeta(w) agrees with Arb to 1.2e-12 for T >= 1e5 | abs D <= 2.5e-4 (window 0..400, 20 from the end) | D = Blaschke sum to 4.9e-4 (min -1.689); T_det - gamma_1 = +0.30, +0.80, +1.55, +3.30 for m = 1, 2, 5, 10 | -0.5: +0.31, +0.81, +1.56, +4.06 (m = 10 after removing the line mean; raw rule fires 29 early on the archimedean drift, see 4.3); -0.1: not detected at m = 1, 2; +3.99, +7.99 | +0.37, +0.87, +2.62, +4.12 | -0.36, -0.86, +2.14, +7.14 (gamma_1 = 2.86; within the Poisson width a = 0.5) | raw: D = log abs((w-1)/w) from the zero at s = 1, seen with the first data; with that zero divided out: abs D <= 1.2e-4, passes like zeta | CLOSED: the truncated integral cancels the Blaschke term of a zero above T to second order; detection needs line data through gamma. Lead <= one Poisson width. |
| 4 | xi-arm-split-incomplete-gamma + twin-ladder-tomography | sign of d rho_A/d sigma at sigma = 1/2, rho_A = log abs A(sigma+it) - log abs A(1-sigma+it) | zeta: mpmath to t = 100 (direct), sign changes counted on [14, 1e6] and on windows at 1e7 .. 1e10 | premise FALSE: first sign change at t = 15.475; 1,747,145 sign changes on [14, 1e6] (N(1e6) = 1,747,146) | 43 sign changes on [14, 100], first at 16.5 | 50 sign changes on [14, 100], first at 15.3 (first off-line zero at 85.7) | not run (premise failed) | not run | not run | not formulable (no functional equation) | CLOSED at the premise: the derivative equals -(I^2/abs A^2) d/dt (R/I), R = Lambda(1/2+it); it changes sign between consecutive zeros for every function with this split. |

Survivor criterion (from the task): zeta passes at every size; every control fails at a size much smaller than its off-line height would explain, or for a reason that does not use the resolution of zeros; the statistic uses all primes together. No row meets the second condition. The only failures that do not come from an off-line zero are (i) LIOU in rows 1 and 2 (it has no functional equation; the failures sit at the ordinates of the poles of F, which are the zeta zeros) and (ii) the heat member in row 3 at margin 10 (its gamma factor is not zeta's; a normalisation effect). Neither involves the prime side.

## 2. Combination 1: zeros of f' left of the line

**Finite consequence.** For f with a functional equation s <-> 1-s and gamma factor gamma(s): on the line Re(Lambda'/Lambda) = 0, so Re f'/f(1/2 + it) = -Re gamma'/gamma(1/2 + it) < 0 for abs t >= t_0 (CLASSICAL; uses the functional equation only). Levinson-Montgomery's argument then gives, for rectangles [sL, 1/2] x [T, T+H], N(f') = N(f) + (boundary term); for zeta this is Speiser's criterion. Test: N(f') = 0 in every window for zeta and L3; for a control, record the ordinate of each f' zero against the off-line zero of f. Survival would need an f' zero lower than the first off-line zero by more than a few mean spacings.

**Why it cannot survive (before computing).** The count identity uses no Euler product, so it holds for DH, HEAT, E_a, T-NR. Two-zero model near a pair 1/2 +- delta + i gamma: f'/f = 1/(s - rho_1) + 1/(s - rho_2) - L/2, L = log(q t/2 pi), gives one zero of f' at s = 1/2 - x* + i gamma, x* = (sqrt(4 + delta^2 L^2) - 2)/L (about delta^2 L/4 for small delta). The derivative zero is at the same ordinate and closer to the line than the zero it comes from.

**Validation.** (a) Zeros of zeta' to the right of the line, same winding code: 429 in 1/2 < Re s < 3, T in [1e5, 1e5 + 300] (Berndt's main term 428.85); 432 at 1e7 over 200 (main term 432.49) (`out/t1_validate.txt`). (b) The float64 loop against Arb values point by point at 1e7: relative difference of zeta' 2.9e-14.

**Results (MEASURED; `out/t1_summary.json`, `out/t1_*.json`).** Arb values at 128 bits or more, adaptive step with argument increment <= 0.6 rad, winding residual <= 2e-14.

| object | range | windows | zeros of f' in [0.01, 1/2] x range | zeros of f there | lowest f' zero | lowest off-line zero (left member) | max abs(t' - gamma) | in mean spacings |
|---|---|---|---|---|---|---|---|---|
| ZETA | 0.5 .. 2000.5 | 200 | 0 | 0 | - | - | - | - |
| L3 | 0.5 .. 2000.5; 1e4 + [0.5, 80.5]; 1e5 + [0.5, 40.5] | 212 | 0 | 0 | - | - | - | - |
| DH | 0.5 .. 2000.5 | 200 | 84 (80 located by Newton) | 84 | 0.40537 + 85.70514i | 0.19148 + 85.69935i | 0.029 | 0.034 |
| HEAT-0.5 | 100.5 .. 240.5 | 14 | 6 | 6 | 0.45825 + 111.69998i | 0.25704 + 111.69423i | 0.016 | 0.009 |
| HEAT-0.1 | 405.5 .. 425.5 | 2 | 1 | 1 | 0.49951 + 415.25619i | 0.47844 + 415.25628i | 9.3e-5 | 6e-5 |
| EA | 0.5 .. 200.5 | 20 | 79 | 79 | 0.47481 + 14.12965i | 0.25 + 14.13473i | 0.049 | 0.026 |
| TNR | 0.5 .. 200.5 | 20 | 35 | 35 | 0.44365 + 2.85391i | 0.09625 + 2.85960i | 0.073 | 0.048 |
| LIOU | 0.5 .. 100.5, rectangle [0.01, 1/4] | 10 | 27 | 0 (zeros of F on Re s = 1/4 only) | 0.06672 + 21.06268i | - | - | - |

The model x* agrees with the measured distance 1/2 - Re s' to 1 to 7% for DH and HEAT (0.0916 against 0.0946; 0.00049 against 0.00049 for HEAT-0.1). For HEAT-0.1 the f' zero is 44 times closer to the line than the pair: it is harder to resolve than the zero.

LIOU: there is no functional equation and no symmetry line; with the abscissa 1/4 of its on-line zeros, F' has 27 zeros to the left of it below 100.5, at ordinates near the zeta zeros (21.06, 25.35, 30.17, 32.96, ... against gamma = 21.02, 25.01, 30.42, 32.94): they are produced by the poles of F on Re s = 1/2. This is a failure without an off-line zero, and it is a statement about the missing functional equation.

**zeta at large height (float64 screen on GPU 1; `out/t1_zeta_b.json`).** Contiguous windows [0.01, 1/2] x 10; vertical edges sampled at (mean spacing)/48, horizontal cuts at 385 points, every step above 0.8 rad refined locally (64, then 4096 sub-points); all windows closed, winding residual <= 2.4e-10.

| T0 | windows | zeros of zeta on the line in the strip (Riemann-von Mangoldt) | zeros of zeta' in the left rectangles | max of Re zeta'/zeta on the left grid |
|---|---|---|---|---|
| 9.6e3 | 9 | 105 (105.1) | 0 | -3.71 |
| 1e5 | 100 | 1,540 (1,540.6) | 0 | -4.90 |
| 1.0003e6 | 500 | 9,533 (9,533.7) | 0 | -6.08 |
| 1.00002e7 | 667 | 15,161 (15,159.7) | 0 | -7.25 |
| 1e8 | 1000 | 26,391 (26,392.4) | 0 | -8.45 |
| 1e9, 1.1e9, 1.2e9, 1.3e9, 1.4e9 | 5 x 1000 | 151,680 | 0 | -9.62 .. -9.83 |
| 1e10 | 1000 | 33,721 (33,721.7) | 0 | -10.82 |
| 1e11 | 200 | 7,477 (7,477.3) | 0 | -12.06 |
| 1e12 | 100 | 4,106 (4,105.1) | 0 | -13.34 |

Arb re-check (`recheck.py t1`, zeta' by central differences of `acb.zeta` at 300 bits, adaptive sampled winding): 16 windows at 1e9 + [100, 260], 8 windows at 1e10 + [100, 180] and 8 windows at 1e12 + [100, 180]: winding 0 (abs <= 9e-14), max step 0.60 rad, 48,558 evaluations (`out/recheck_t1_*.jsonl`; the first four windows at 1e12 were also run locally, `out/recheck_t1_1e12_local.jsonl`, with the same step sequence and windings equal to 1e-14). These are sampled windings, not interval certificates; for zeta the count 0 at these heights also follows from the verified height of RH through the same identity.

**Classification: CLOSED.** The statistic is the argument principle for f'/f; its pass for zeta is verified height in another form (it is implied by, and implies, the absence of off-line zeros in the same window up to the O(log T) boundary term), and every control with a functional equation fails exactly at the ordinates of its off-line zeros.

## 3. Combination 2: small-value shear energy

**Definitions (source: PR 39, SMALL_VALUE_ENERGY.md).** F(z) = completed function at s = 1/2 + z, z = x + it. W = Re(F' conj F), Q = (-W)_+, K_eta = Q/(abs F^2 + eta^2), E_eta(D) = int_D K_eta^2 dx dt, D = (0, X) x (T0, T1). PROVED in the source: E_eta(D) = (pi/2) M_D log(1/eta) + O_D(1), M_D = zeros strictly inside D.

**Finite consequence.** Since W = abs F^2 Re(F'/F), Q is supported on {Re F'/F < 0}. For zeta, Re xi'/xi = sum over zeros of (x - (beta - 1/2))/abs(s - rho)^2 > 0 for x > 0 when the zeros near the window are on the line, so Q = 0 on D and E_eta(D) = 0 for every eta (not only slope 0). In terms of Z: Re xi'/xi(1/2 + x + it) = Im (Z'/Z)(t - ix) + O(x/t^2); at x -> 0 it is x times the Laguerre expression (Z'^2 - Z Z'')/Z^2. Test for zeta: no grid point with Im(Z'/Z)(t - ix)/x < 0. Survival would need a control to show slope or bias at a cost below that of isolating its zero, or without a zero.

**Validation (known answer).** Slope at an interior zero by polar-log quadrature of the Taylor polynomial of F/F'(rho) (48 terms, Arb) over a disc about the zero, eta = 1e-1 .. 1e-12 (`out/t2_low.jsonl`, mode slope): slope/(pi/2) per decade of eta, last decade: DH 85.699: 1 - 3.6e-11; DH 114.163: 1 - 8.2e-11; HEAT-0.5 111.694: 1 - 2.5e-12; T-NR 2.860: 1 - 5.4e-11; E_a 14.135: 1 - 3.2e-11. F is normalised by abs F'(rho) (the source notes that the completed function is of size e^(-pi t/4), so eta has to be measured in that unit).

**zeta (float64 screen on GPU 1; `out/t2_zeta.json`).** Rectangles (0, 1/2) x (T, T+10); x = 0.5 x 2^-j, j = 0..11, plus the Laguerre expression on the line; t step (mean spacing)/32.

| T0 | rectangles | grid points | zeros of zeta in the strip | points with Q != 0 | min of Im(Z'/Z)/x | same / theta'^2 | min normalised Laguerre |
|---|---|---|---|---|---|---|---|
| 1e4 | 5 | 2.4e4 | 60 | 0 | 3.61 | 0.266 | 0.302 |
| 1e5 | 100 | 6.4e5 | 1,540 | 0 | 5.40 | 0.231 | 0.277 |
| 1e6 | 28 | 2.2e5 | 534 | 0 | 7.66 | 0.214 | 0.271 |
| 1e7 | 687 | 6.5e6 | 15,615 | 0 | 8.88 | 0.174 | 0.222 |
| 1e8 | 2,000 | 2.2e7 | 52,783 | 0 | 10.99 | 0.160 | 0.220 |
| 1e9 | 3,000 | 3.8e7 | 90,168 | 0 | 12.94 | 0.145 | 0.198 |
| 1e10 | 10,000 | 1.40e8 | 337,215 | 0 | 15.33 | 0.137 | 0.202 |
| 1e11 | 1,000 | 1.6e7 | 37,387 | 0 | 18.07 | 0.131 | 0.227 |
| 1e12 | 300 | 5.1e6 | 12,316 | 0 | 20.59 | 0.124 | 0.227 |

Total 17,120 rectangles, 2.28e8 grid points, 547,618 zeros of zeta in the strips, no point with Q != 0. (At 1e6 and 1e7 the strip was cut by the end of the block of constant Riemann-Siegel length; the rectangle count there is below the planned one.) Arb re-check (`out/recheck_t2_local.jsonl`): Re xi'/xi/x at the minimum of each strip and at 40 random grid points per strip, 369 points: relative difference from the float64 value <= 3.1e-8 at 1e4, <= 2e-9 at 1e5 .. 1e12; the nine minima reproduce to 10 digits. Low heights with Arb: zeta 10 <= t <= 400 (195,000 points, min of Re xi'/xi / x = 0.105 at t = 10), L3 1 <= t <= 400 (199,500 points, min 0.115): no negative point.

**Controls: the support of Q (MEASURED, Arb grid of step 0.005, or 0.001 where stated; `out/t2_low.jsonl`, mode lens).**

| object | zero (delta, gamma) | D | zero in D | set {Re F'/F < 0}: x range | t - gamma range | area | int of (Re F'/F)_-^2 outside a small disc | evaluations for the winding count of F on the boundary of D | grid nodes per unit area needed to hit the set |
|---|---|---|---|---|---|---|---|---|---|
| DH | 0.3085, 85.699 | (0, 0.49) x gamma +- 1.2 | yes | 0.005 .. 0.305 | -0.285 .. 0.280 | 0.137 | 2.45 | 50 | 5.8 |
| DH | 0.1508, 114.163 | same | yes | .. 0.150 | +- 0.145 | 0.034 | 1.56 | 49 | 22.6 |
| DH | 0.0744, 166.479 | same | yes | .. 0.070 | +- 0.070 | 0.0082 | 0.68 | 46 | 98.5 |
| DH | 0.2243, 176.702 | same | yes | .. 0.220 | -0.210 .. 0.205 | 0.073 | 1.98 | 48 | 10.8 |
| DH | 0.3695, 240.405 | same | yes | .. 0.365 | -0.300 .. 0.310 | 0.178 | 2.61 | 53 | 4.5 |
| DH | 0.3195, 320.876 | same | yes | .. 0.315 | -0.280 .. 0.275 | 0.138 | 2.46 | 53 | 5.7 |
| HEAT-0.5 | 0.2430, 111.694 | same | yes | .. 0.240 | +- 0.235 | 0.089 | 2.17 | 45 | 8.8 |
| HEAT-0.5 | 0.1981, 150.692 | same | yes | .. 0.195 | +- 0.190 | 0.059 | 1.88 | 45 | 13.3 |
| HEAT-0.5 | 0.2610, 169.612 | same | yes | .. 0.260 | +- 0.250 | 0.102 | 2.28 | 48 | 7.6 |
| HEAT-0.1 | 0.0216, 415.256 | (0, 0.1) x gamma +- 0.24, step 0.001 | yes | .. 0.021 | +- 0.021 | 0.00071 | 1.13 | 32 | 1107 |
| EA | 0.25, 14.135 | (0, 0.49) x gamma +- 1.2 | yes | .. 0.245 | +- 0.245 | 0.096 | 2.26 | 46 | 8.2 |
| EA | 0.25, 21.022 | same | yes | .. 0.245 | +- 0.245 | 0.095 | 2.25 | 46 | 8.2 |
| TNR | 0.4038, 2.860 | (0, 0.30) x gamma +- 1.2 | no | 0.005 .. 0.30 | +- 0.385 | 0.209 | 0.633 | 41 (winding 0) | 4.3 |
| TNR | 0.4038, 8.579 | same | no | 0.005 .. 0.30 | +- 0.385 | 0.208 | 0.631 | 41 (winding 0) | 4.3 |
| TNR | 0.4038, 14.298 | same | no | 0.155 .. 0.30 | -0.105 .. 0.170 | 0.030 | 0.095 | 66 (winding 0) | 23.8 |
| TNR | 0.4038, 2.860 | (0, 0.49) x gamma +- 1.2 | yes | .. 0.40 | +- 0.385 | 0.244 | 2.87 | 48 | 3.2 |

Readings.
1. The set where Q != 0 is the half-disc of radius about delta at the foot of the pair (the lens of dh-separator Theorem A, PROVED there for an isolated pair), cut down when on-line zeros are close (T-NR at 14.298, where gamma_1 of zeta is 0.16 away). Its extent in the ordinate is at most delta: the O_D(1) term fires only for windows within delta of gamma. This is the same range as the pointwise tests of the earlier lanes (0.02 to 0.4).
2. T-NR, D = (0, 0.3) x window: D holds no zero and E_eta(D) -> 0.63 as eta -> 0 (slope 0, bias != 0). The bias comes from the zero at x = 0.404 at the same ordinates; it is a zero just outside D, not a zero-free effect.
3. Cost. Isolating the zero by the argument principle on the boundary of a rectangle of height 2.4: 30 to 66 evaluations, plus at most 10 Newton steps, independent of delta. Hitting the support of Q with a uniform grid: 1/(width x height) nodes per unit area: 5 to 23 for delta >= 0.15, 98 for delta = 0.074, 1107 for delta = 0.0216. So the eta-independent term is cheaper than the winding count only for wide pairs, and in every case needs the window at the ordinate of the zero.
4. The logarithmic slope on a grid (`mode slope`, Cartesian grids of spacing h with a random offset, exact Taylor polynomial). With the exact slope (pi/2)(1 - 4e-11) and E_exact(1e-12) = 38.56 for DH at 85.699: grid values E_grid(1e-12) = 4.97, 4.78, 5.82, 7.36, 9.98, 9.58, 11.15 for h = 0.02, 0.01, 0.005, 0.002, 0.001, 5e-4, 2e-4 (225 to 2.1e6 nodes on a disc of radius 0.145); the grid slope falls below half the exact slope at eta = 1e-3 for h >= 0.002 and at eta = 1e-4 for h <= 0.001, that is at eta of the order of the distance from the zero to the nearest node. Reading the slope down to eta needs a node within eta/abs F'(rho) of the zero: about (r0/eta)^2 evaluations, against about 60 for the argument principle followed by Newton. The same numbers hold for the other four zeros (table in `out/t2_low.jsonl`).
5. LIOU: F has poles on the edge x = 0 (the zeta zeros). Near a pole Re F'/F = -x/(x^2 + u^2), K_eta -> x/(x^2 + u^2) wherever abs F is large, and int K^2 over a half-disc with inner cut r_min grows like (pi/2) log(1/r_min): measured slope 1.5710 per unit of log(1/r_min) at the pole 1/2 + 14.1347i (pi/2 = 1.5708). E_eta(D) is infinite for every eta. The statistic is not formulable for a function with poles on the line; the divergence is produced by the zeta zeros themselves.

**Classification: CLOSED.** For zeta the statistic vanishes identically on every rectangle sampled (the pass is the statement that the zeros in the window are on the line: Re xi'/xi > 0 is implied by it). For the controls it is the lens test of an off-line pair, at the ordinate of the pair, with a cost that grows like delta^-2 for the bias and eta^-2 for the slope.

## 4. Combination 3: two-line detector

**Definitions.** G analytic in Re s > 1/2 with poles removed by rational factors of modulus 1 on the line: zeta(s)(s-1)/s; L3; DH f; zeta(s+a)zeta(s-a)(s-1-a)(s-1+a)/s^2; T-NR x (s-1)/s; LIOU = zeta(2s)(2s-1)/(2s zeta(s)); LIOUN = LIOU x s/(s-1); HEAT: F_tau/g x (s-1)/s. Poisson-Jensen (PROVED, source route 48): D(w) = log abs G(w) - P_w[log abs G(1/2 + i.)] = sum over zeros with beta > 1/2 of log abs B_rho(w) <= 0.

**Finite consequence.** D_T(w): the same with the integral cut at abs t <= T (or to a window). For zeta, abs D_T(w) is the tail of the Poisson integral. Null level N_m: max over T and over tau in [0, T - m] of abs D_T(sigma1 + i tau), measured on zeta and L3. Detection height T_det(m): first T at which min over tau <= T - m of D_T is below -2 max(N_m(zeta), N_m(L3)). Survival would need T_det well below gamma_1 for every control.

**Why it cannot survive (PROVED, elementary).** Compare G with the function G~ obtained by moving one pair 1/2 +- delta + i gamma onto the line. With u = tau - gamma and a = Re w - 1/2: log abs G(w) - log abs G~(w) = (1/2) log[((a - delta)^2 + u^2)((a + delta)^2 + u^2)/(a^2 + u^2)^2], and log abs G - log abs G~ on the line is log(1 + delta^2/(t - gamma)^2), whose full integral is 2 pi delta. For data cut at T < gamma the line term contributes delta^2/(gamma - t)^2 on the support of the kernel and the first term is delta^2/u^2 + O(delta^2 a^2/u^4): the two cancel at order delta^2/u^2. A zero above the end of the data changes D_T(w) by O(delta^2 (a^2 + (T - tau)^2)/(gamma - T)^4), while the tail of a zero-free function is of order (a/pi)/(T - tau) x (size of log abs G). Detection therefore needs gamma - T of the order of a. This is Littlewood's lemma: the line imprint of an off-line pair and its Blaschke term are the same quantity.

**Validation.** Quadrature: zeros on the line as breakpoints, Gauss-Legendre with 24 nodes per cell after t = a + (b-a)(6u^5 - 15u^4 + 10u^3); 24 and 48 nodes agree to 1e-6 (int over [0, 120] of log abs zeta: -0.811704, -0.811705). Known answer: D against the Blaschke sum of the tabulated off-line zeros on tau in [0, 380], full window [0, 400]: DH (84 pairs) max difference 4.9e-4 (Re w = 1), minimum -1.68909 at tau = 240.5 against -1.68914; T-NR 6.7e-5; LIOU (zero at s = 1): 1.7e-4 at Re w = 1.2; E_a (zeros to 2000) 8.2e-3; HEAT-0.5 3.6e-3; HEAT-0.1 1.2e-3 (the heat residuals are the drift of 4.3).

**4.1 zeta at large height (float64 screen on GPU 1; `out/t3_zeta_b.json`).** One window per height; zeros of Z by sign changes at (mean spacing)/24 and 46 bisections; log abs zeta(w) from the same evaluator, checked against Arb at 6 points per window (relative error of zeta(w) <= 1.2e-12 for T >= 1e5, 5.4e-11 at 1e4).

| T0 | window | zeros of zeta (Riemann-von Mangoldt) | line nodes | max abs D, Re w = 1, at distance >= 5 / 20 / 50 / (window/4) from the ends |
|---|---|---|---|---|
| 9.56e3 | 478 | 560 (559.2) | 1.4e5 | 2.0e-3 / 2.7e-4 / 4.9e-5 / 8.3e-6 |
| 9.98e4 | 1586 | 2,442 (2,443.0) | 5.0e5 | 6.3e-3 / 4.9e-4 / 7.9e-5 / 1.3e-6 |
| 9.95e5 | 2000 | 3,811 (3,811.4) | 6.6e5 | 4.0e-3 / 3.6e-4 / 6.2e-5 / 7.0e-7 |
| 1e7 | 2000 | 4,546 (4,545.5) | 7.0e5 | 2.4e-3 / 5.2e-5 / 1.5e-5 / 1.6e-7 |
| 1e8 | 2000 | 5,277 (5,278.5) | 7.3e5 | 3.2e-3 / 2.9e-4 / 5.2e-5 / 5.9e-7 |
| 1e9 | 2000 | 6,012 (6,011.4) | 7.7e5 | 1.0e-2 / 6.6e-4 / 1.0e-4 / 1.1e-6 |
| 1e10 | 2000 | 6,744 (6,744.3) | 8.0e5 | 7.8e-3 / 6.0e-4 / 9.8e-5 / 1.0e-6 |
| 1e11 | 2000 | 7,477 (7,477.2) | 8.4e5 | 2.5e-3 / 2.6e-4 / 4.5e-5 / 4.8e-7 |
| 1e12 | 2000 | 8,211 (8,210.2) | 8.7e5 | 6.8e-3 / 4.6e-4 / 7.1e-5 / 7.3e-7 |

The values at Re w = 1.2 and 1.5 are larger by factors 1.4 and 2.0 (the kernel is wider). abs D falls like the tail (a/pi)/m^2 x O(1) with the distance m to the end of the window and shows no floor: zeta passes at every size reached. A single off-line pair with delta = 0.01 inside one of these windows would give D = -2 delta/a = -0.04 at Re w = 1 above it.

**4.2 Controls at low height (Arb; local run; `out/analysis_*.json`).** Null levels N_m (zeta, L3; window 0..400; Re w = 1): 0.160, 0.058, 0.012, 0.0033 for m = 1, 2, 5, 10 (Re w = 1.5: 0.235, 0.103, 0.023, 0.0067).

| object | gamma_1 | signal at Re w = 1 above the pair | T_det - gamma_1 at m = 1 / 2 / 5 / 10 (Re w = 1) | at Re w = 1.5 |
|---|---|---|---|---|
| DH | 85.699 | -1.44 | +0.30 / +0.80 / +1.55 / +3.30 | +0.80 / +0.80 / +1.80 / +3.30 |
| HEAT-0.5 (window 60..260) | 111.694 | -1.06 | +0.31 / +0.81 / +1.56 / -29.2 raw, +4.06 with the line mean removed | +0.81 / +0.81 / +1.56 / raw as at Re w = 1 |
| HEAT-0.1 (window 380..450) | 415.256 | -0.087 | not detected / not detected / +3.99 / +7.99 | not detected / not detected / +4.24 / +8.24 |
| EA | 14.135 | -1.10 | +0.37 / +0.87 / +2.62 / +4.12 | +3.62 / +1.37 / +2.62 / +4.12 |
| TNR | 2.860 | -2.2 | -0.36 / -0.86 / +2.14 / +7.14 | -0.36 / -0.86 / +2.14 / +7.14 |
| LIOU | 0 (zero at s = 1) | -infinity at w = 1 | +1 / +2 / +5 / +10 (first admissible T) | same |
| LIOUN | none | - | never (abs D <= 1.2e-4 on the full window) | never |

Profile for DH at fixed tau = gamma_1 - 5 (Re w = 1), D_T against T - gamma_1: -0.0018 (-1.45), -0.0091 (-0.95), -0.0112 (-0.70), -0.0121 (-0.45), -0.0100 (+0.05), -0.0123 (+20); zeta at the same points: -0.0081, -0.0023, +0.0010, +0.0014, -0.00002, +0.0002. The full Blaschke value -2 a delta/(a^2 + 25) = -0.0122 appears when T passes gamma_1 - 0.7, not before.

Readings. (i) For DH, E_a, HEAT the first detection is 0.3 to 4.1 after gamma_1, growing with the margin, as the cancellation above predicts. (ii) T-NR is detected 0.36 to 0.86 before its first zero: gamma_1 = 2.86 is within reach of the kernel of width a = 0.5 placed at tau = 0 to 1.5, and delta = 0.40 is large; this is a lead of less than two Poisson widths at the bottom of the strip, not a height saving. (iii) LIOU fails at once because zeta(2s)/zeta(s) vanishes at s = 1 (the pole of zeta), a zero to the right of the line at ordinate 0; with it divided out the twist passes exactly as zeta does (D_LIOUN = D_{zeta(2s)} - D_zeta, and D_{zeta(2s)} = 0 unconditionally).

**4.3 The heat member at margin 10.** F_tau has no Dirichlet series; divided by zeta's gamma factor its line values have a non-zero mean (log abs G(1/2 + it) averages -0.188 on [60, 260] for tau = -0.5 and -0.095 on [380, 450] for tau = -0.1), so the truncated integral has a bias (line mean) x (1 - Poisson mass of the window) that zeta and L3 do not have. With the zeta-calibrated threshold 2 N_10 = 0.0064 the raw rule fires at T = 82.5, 29 below gamma_1, with D = -0.0066. Dividing G by the constant exp(line mean) moves it to gamma_1 + 4.06. This early failure does not involve a zero; it records that the control's archimedean factor is not zeta's. It does not help: the same correction applied to zeta changes nothing, and DH, E_a, T-NR (exact gamma factors) show no such effect.

**Classification: CLOSED.** The detector is exact and Euler-blind (Poisson-Jensen for any function of bounded type in the half-plane); its finite form needs the line data through the ordinate of the zero, with a lead of at most one to two Poisson widths.

## 5. Combination 4: arm ratio

**Definitions (source: route 29).** Lambda(s) = pi^(-s/2) Gamma(s/2) zeta(s) = A(s) + A(1-s), A(s) = -1/s + sum_n (pi n^2)^(-s/2) Gamma(s/2, pi n^2). rho_A(sigma, t) = log abs A(sigma + it) - log abs A(1 - sigma + it). A zero needs rho_A = 0.

**Premise to check.** d rho_A/d sigma at sigma = 1/2 has one sign for t in [14, 1e6].

**Result: the premise is false (PROVED identity, MEASURED counts).**
1. rho_A(sigma, t) = log abs(1 - Lambda(s)/A(1-s)) (from Lambda = A(s) + A(1-s) and abs A(1 - sigma + it) = abs A(1 - s)). Check at s = 0.7 + 30.3i: 3.65092754e-10 on both sides. So rho_A is of size abs Lambda / abs A, exponentially small, and rho_A = 0 is the curve abs(1 - Lambda/A(1-s)) = 1 through each zero.
2. On the line A(1/2 + it) = R(t)/2 + i I(t) with R = Lambda(1/2 + it) real and I = Im A (I = 0.03578 at t = 30.3; theta_3(e^-pi)/t = 0.03586). Since A'(s) = -i dA/dt there, d rho_A/d sigma at sigma = 1/2 equals 2 Re(A'/A) = (I'R - R'I)/abs A^2 = -(I^2/abs A^2) d/dt (R/I). Check at t = 30.3: both sides 1.8471893512669263e-09.
3. So the sign of the derivative is minus the sign of d/dt (R/I): it changes at every critical point of Lambda(1/2 + it)/I(t), at least once between consecutive zeros of zeta.

Direct computation (mpmath incomplete gamma, 40 + 0.36 t digits, step 0.05; `out/t4_direct.jsonl`): zeta on [14, 100]: 29 sign changes, the first at t = 15.475, then 22.075, 26.225, 31.225, 34.175 (N(100) = 29). Count on [14, 1e6] through the equivalent function Z' + Z(m'/m - I'/I) (m = abs gamma factor; float64 Riemann-Siegel; `out/t4_count_b.jsonl`): 1,747,145 sign changes; N(1e6) = 1,747,146. Windows of length 1000 at 1e7, 1e8, 1e9, 1e10: 2273, 2639, 3006, 3371 sign changes against 2271, 2638, 3006, 3372 sign changes of Z on the same grid.

Because the premise failed, the control battery of this combination was not run in full. The same split with the odd theta arms (A(s) = sum a_n n (pi n^2/q)^(-(s+1)/2) Gamma((s+1)/2, pi n^2/q), Lambda = A(s) + A(1-s) verified to 5e-68) gives 43 sign changes on [14, 100] for L(chi_-3) (first at 16.5) and 50 for DH (first at 15.3; DH's first off-line zero is at 85.7). The alternation is a property of the split and of the functional equation.

**Classification: CLOSED at the premise.** rho_A carries no information beyond Lambda itself.

## 6. Survivors

None.

## 7. Weakest steps

1. All large-height zeta results are float64 screens with Arb spot checks (32 windows for combination 1, 369 points for combination 2, 54 values for combination 3); they are not interval certificates. They are consistent with, and weaker than, the verified height of RH.
2. Combination 3 uses an empirical tail level (twice the null level of zeta and L3 on the same window) in place of a proved tail bound; an unconditional tail bound does not exist, since the tail contains the line imprint of unknown zeros above T. The detection heights depend on this rule and on the margin; the conclusion (no lead beyond one to two Poisson widths) held for every margin and every Re w used.
3. Controls were run at one parameter each (E_a at a = 1/4, T-NR at (3, 2.2), heat at tau = -0.5 and -0.1), and the heat off-line tables are measured, not certified complete. DH: 4 of the 84 derivative zeros were counted by the winding number but not located by Newton from the seed grid.

Regenerating the arrays: the `.npz` outputs of `t3_low.py` (0.6 GB) were deleted after `t3_analyze.py` wrote `out/analysis_*.json`; `bash -c 'python t3_low.py NAME T_lo T_hi out.npz'` rebuilds each in 2 to 50 s. Server copy of the code and outputs: `~/rh-push/s2-derivative-zeros-two-line/`. All units of this lane are stopped.
