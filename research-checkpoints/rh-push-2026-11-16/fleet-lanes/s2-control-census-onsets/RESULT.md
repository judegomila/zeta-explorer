# s2-control-census-onsets: screening of four combinations (2026-11-19/20)

Scope: `tmp/research-2026-11-16/push/s2-control-census-onsets/` only. Nothing committed or pushed. No statement about zeros of zeta
is claimed. Labels: PROVED (elementary argument given), MEASURED (float64 or ball-arithmetic midpoints, not interval-certified),
CLASSICAL (cited). Verdict: **four combinations tested, no survivor.**

## 0. What was run

| item | size reached | where |
|---|---|---|
| Epstein census (combination 1) | all 7597 primitive reduced forms (b >= 0) of the 1000 discriminants -2000 <= D <= -3; 13 with class number one, 1000 principal; Weil form on [-a,a] up to a = 6.4 (support 2a = 12.8, coefficients up to ratio e^12.8 = 3.6e5), 170 basis functions per parity sector | server, 3 x 2 cores, 58 min + 8 min re-run |
| Epstein off-line zeros | all 7584 forms with h > 1: real zeros in (1/2,1); complex zeros with Re s > 0.52 in order of height up to max(1.25 gamma_1, gamma_1 + 4), at most t = 45 (python-flint, Chowla-Selberg, 90 + 2.4 t bits) | server, same units |
| twin census cross-check | 440 Dirichlet twins + 220 Euler arms, conductors 5..49, a <= 3.0 | server |
| control battery (combination 2) | 174 objects, a <= 3.4 (support 6.8, n <= 900) | server |
| twist families (combination 3) | all 60786 fundamental d with abs(d) <= 1e5 for L(s,chi_d); all 50651 coprime to 5 for L(s,chi_5 chi_d) and for DH x chi_d; every zero in the box abs(Im s) <= 2.5, abs(Re s - 1/2) <= 1.25 | server, 2-8 cores |
| GL2 amplitude vectors (combination 4) | 30 newforms (levels 1..89, weights 2..26), 10 bridges (k,N), 1914 amplitude vectors, support 2a <= 4 (ln 12 = 2.485 included) | server |

Server use: `rhrun` units only, at most 8 cores and 12 GB requested in total at any time, CPU only (the float64 GPU path was written,
found slower than a CPU non-uniform FFT under GPU contention, and removed). The slice was oversubscribed (load average 150-180), so
the work was split into 2-core units. All units are stopped (`rh-s2test-*`, `rh-s2battery-*`, `rh-s2census-*`, `rh-s2cen[0-2]-*`,
`rh-s2twist[ABC]-*`, `rh-s2twD[1-3]-*`, `rh-s2twArm-*`, `rh-s2fix*`: inactive). Local runs went through `scripts/memcap.sh 8`.

## 1. Shared code and its validation

`wf.py`: Weil form W(g) = [C + tau(a)] ||g||^2 + int_0^{2a} k(x)(||g||^2 - G(x)) dx - 2 sum_q c(q) q^{-1/2} G(log q) + pole terms, for
real g on [-a,a] with autocorrelation G, in the route-44 basis a^{-1/2} p_n(x/a)(1 - x^2/a^2)^3 (Gegenbauer 6.5), even and odd sector.
The autocorrelation matrices are polynomials in x/a of degree <= 4N+11 and are stored once at 4N+20 Chebyshev nodes; each
(object, a) then needs only node weights (computed by a type-1 non-uniform FFT when there are many atoms). "Negative" means
lambda_min < -1e-11 max(1, max|Q|) (route-44 convention). `objs.py`: zeta, Dirichlet, periodic twins, Epstein forms, E_a, T-NR, sign
twists, unimodular twists, GL2 amplitude vectors. `epzeros.py`: Epstein zeros. `twist.py`: twist families by the theta integral.

Checks against known answers (all MEASURED):

| check | result |
|---|---|
| explicit formula: coefficient-side matrices against the zero side (zeta zeros to 2000; E_a zeros = zeta zeros +- i alpha; DH table of 1861 + 84 pairs), `validate_zero_side.py` | max difference 1.5e-12 .. 4.0e-12 on entries of size 2-4, both sectors, for zeta, E_a(1/8), E_a(1/4), DH |
| route 30: c_DH(2), c_DH(4), c_DH(6) | 0.19690858829, -1.44223196461, 1.93635607662 (agree to all printed digits) |
| route 44: DH lambda_min at a = ln3/2; 380 twin onsets | 0.2097 (route 44: 0.2103, tlb 0.2098); my onset minus route-44 double onset: median -0.009, 5%..95% -0.018..0.000 |
| route 15: (2,2,3), (1,1,6), (1,0,5) | onset 0.412-0.416 (certified <= 0.417); (1,1,6) even 1.688-1.692, odd 1.660-1.664 (route 15: (1.679,1.689], odd 1.662); (1,0,5) 1.494-1.498 |
| route 15 zeros | (2,2,3) 2.07941 + 7.62887i; (1,0,5) 0.93297 + 15.66825i; (3,3,4) 2.25126 + 11.11652i (identical); Bateman-Grosswald threshold: real zero for y = sqrt(abs D)/2a = 7.90, none for y = 7.053 |
| Chowla-Selberg against direct lattice sum at s = 3 + 2i | agree to 1e-11 (limit of the direct sum) |
| non-uniform FFT against direct cosine sums | 2e-13 .. 1.7e-12 absolute on moments of size 7..109 |
| twist: completed values against Arb Dirichlet L-functions (7 discriminants, 2 families, 3 points) | relative error <= 4.5e-14 |
| twist: coefficient side against the sum over all zeros in the box (Gaussian pair, width 0.6) | <= 6.2e-4 over 126k discriminant-family pairs (truncation level) |
| 30 newforms: F(1/y) = +- y^k F(y) | ratio +-1 to 1e-15 for all 30 |
| reported failures recomputed from the zeros only (`recheck_zero_side.py`) | negative Rayleigh quotients reproduced: E_a(1/4) a=0.55: -7.9e-4 / -8.0e-4; T-NR(3, 2.2) a=0.70: -0.1947 / -0.1948; DH a=1.85: -0.02546 / -0.02546; DH a=2.2: -1.2542 / -1.2542; zeta and T-NR(3, c=1) non-negative on both sides |
| basis size 110 instead of 170, direct cosine path (`recheck_basis.py`) | 14 onsets unchanged within the 0.005 bracket |
| Arb 200-bit re-check of 12 off-line zeros of FE-type twists DH x chi_d (`recheck_twist_arb.py`) | all 12 are real zeros, beta = 0.0515 .. 0.438 (and 1 - beta), abs F ~ 1e-59, Newton step ~ 1e-60 |

Error found and corrected during the run: the first pass computed the Epstein log-derivative atoms of non-principal forms by an FFT
power-series step without scaling; for forms with zeros far to the right of 1 the round-off (relative to the largest coefficient)
contaminated the small-x atoms. Example (24,24,25): reported lambda_min(0.15) = -1902, true value +0.61, onset 0.154-0.158. Fixed by
an exponential tilt to an abscissa of absolute convergence (`objs.epstein_atoms`, `tilt=True`); all 6597 non-principal forms were
re-run (`census_zfix_*`, `census_zfiy_*` override the first pass). 155 records changed: 140 forms with a first-pass "onset" between
5.0 and 6.4 have no negative value after the fix, and 15 onsets moved by more than 0.02 (14 of them above a = 5). All numbers below are
from the corrected run.

## 2. Table

"2a*" is the smallest support at which the double-precision Weil form is negative; "pass" = no negative value found up to the stated
size (a finite basis gives an upper bound on lambda_min, so "pass" is not a positivity proof); N = not formulable.

| combination | statistic | sizes reached | zeta | comparison L-function | DH | heat (tau < 0) | sign-twisted primes | unimodular twist | E_a | T-NR | classification |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1. Epstein radii x zero-side onset law | r = a*_measured - a*_predicted, a*_pred = -0.748 + 0.387 log gamma - 0.278 log(beta - 1/2) + 0.278 log q (rms 0.139) | 7597 Epstein forms, support <= 12.8; 440 twins, support <= 6 | pass to support 6.8 | 13 class-number-one Epstein forms pass to support 12.8; 220 Euler arms L(s,chi) pass to support 6 | 2a* = 3.562 (r = +0.03) | N (no Dirichlet series; zero-side onset would need basis degree > a gamma ~ 1100; not run) | 2a* = 0.726 (Liouville) | 2a* = 0.726 .. 0.976 | 2a* = 0.804 .. 1.007, r = -0.22 (alpha = 1/4) .. -0.61 (alpha = 0.05) | 2a* = log q + 0.05..0.2 (own bridge), r undefined (onset rises with q while the zero height pi/log q falls) | CLOSED: r < -5 rms for 77.0% of the 5468 Epstein forms with a located zero, not for every non-Euler form (78 principal forms: r = +0.49 +- 0.24; 196 forms with h > 1 never negative; 60 twins never negative); where the onset is early the form has zeros to the right of 1 or a real zero |
| 2. DH partial Euler product x finite-support Euler detector | J(S) = E1 + E2 + R at support S: E1 = max abs c(n)/log n over non-prime-powers n < e^S; E2 = max(0, -lambda_min) of the rung Toeplitz matrices with K log p < S; R = max(0, -lambda_min) of the Weil form with the stated bridge | battery to S = 6.8; 440 twins; 7584 Epstein forms (integrality / E1) | J = 0 to S = 6.8 | J = 0 (3 real Dirichlet L, 220 arms) | onset 1.386 (E2 at p=2, K=2); E1 at 1.792 | N | onset 0.726 (R); single flip at P: onset log P + 0.000..0.033 | onset 0.726 .. 0.976 (R) | onset 0.693 (E2 at p = 2, K = 1) | onset log q (E2), also for c = +-1 where all zeros are on the line | CLOSED: J is positive for every formulable control from some support on, but the onset is the first prime at which the coefficients differ from zeta's (T-NR(q) and a single sign flip at P pass every test of support < log q, log P: PROVED, the coefficients agree); E2 also flags T-NR(c = +-1), which has no off-line zero |
| 3. Katz-Sarnak family checks x chi_4 / Catalan signed ladder | per twist: zeros of F x chi_d in abs(t) <= 2.5 by winding number; T(d) = coefficient side - sum over on-line zeros of exp(-gamma^2/0.72) | all fundamental abs(d) <= 1e5 | 60786 twists, 419678 zeros, 0 off-line, max abs T = 5.6e-4 | L(s, chi_5 chi_d): 50651 twists, 407182 zeros, 0 off-line, max abs T = 3.8e-4 | d = +-2 mod 5 (25267): no functional equation, all zeros off the line; d = +-1 mod 5 (25144): 12.40% have an off-line zero in the box (9.55% within 4 pi/log q), 6.95% a real one; abs T > 0.01 for 11.76% | N | N (no continuation) | L(s + i alpha, chi_d): zeros on the line (passes) | 99.90% of d: off-line zeros at the height of the lowest zero of L(s,chi_d) (median 0.531) | 37.49% of d: real zeros at 1/2 +- 0.4038; 37.51%: off-line at height 2.860 | CLOSED: separates DH without resolving DH's own zeros, but is not formulable for heat and sign twists, and for zeta it is a low-height GRH check of each L(s,chi_d) (verified height in the conductor aspect); it constrains no zero of zeta |
| 4. GL2 Weil symbol x Ramanujan box vertex x virtual rungs | onset support of sigma(t) = log N - 2 log 2pi + 2 Re psi(k/2 + it) - sum 2 c(n) n^{-1/2} cos(t log n) for amplitude vectors c(p^j)/log p | 30 newforms; 10 bridges; 1914 vectors; support <= 4 | (zeta rung = half the +2 vertex) | 30 holomorphic newforms, levels 1..89: pass to support 4 (min lambda at ln 12: 3.2e-13) | - | N | sign-twisted vertices: negative at support <= ln 12 in 83 of 100 cells, pass to 4 in 7 | - | amplitudes p^{jb} + p^{-jb}: negative at <= ln 12 in 74 of 80 cells, later in 6 | one prime outside the box: negative at <= ln 12 in 1238 of 1474 cells, later in 177, pass to support 4 in 59 | CLOSED: "outside the box implies negative at support <= ln 12 for every excess" is false (63 outside-box vectors pass to support 4, 199 fail only later), and vectors inside the box fail (160 of 220, including the +2 vertex on 9 of 10 bridges); the onset is continuous in the excess and tends to the vertex onset |

## 3. Combination 1 in detail (MEASURED)

Finite consequence tested: if the Weil-form onset of non-Euler functions were set by something other than the resolution of their
off-line zeros, the census residual r would have a lower tail below -5 rms for every non-Euler form, with zeta and class-number-one
forms never negative.

- Class number one (D = -3, -4, -7, -8, -11, -12, -16, -19, -27, -28, -43, -67, -163): no negative value up to a = 6.4; smallest
  eigenvalue -2.6e-11 (at the floor).
- Class number > 1: 7388 of 7584 forms negative; onset a*: min 0.154, 5% 0.521, median 1.812, 95% 3.257, max 6.386; first failure in
  the even sector 4641, odd 2747.
- 196 forms with h > 1 show no negative value up to a = 6.4 (amin = 2, 3, 4, 5; sqrt(abs D)/(2 amin) between 3.96 and 7.045, i.e.
  just below the Bateman-Grosswald threshold 7.0556); none has a real zero or an off-line zero with Re > 0.52 below t = 45. At
  a = 6.4 the basis resolves frequencies up to about 50, so this is "not negative within the basis", not a positivity statement.
- 1260 forms have a real zero beta in (1/2,1) (all with sqrt(abs D)/(2a) > 7.0556, CLASSICAL: Bateman-Grosswald). Their onset is
  2.062 .. 2.366, always in the odd sector; fit a* = 1.943 + 0.107 log(beta - 1/2) + 0.056 log abs(D), rms 0.064. This class holds
  901 principal forms (every principal form with abs D >= 200), 301 forms with amin = 2 and 58 with amin = 3; route 15's heuristic
  a* = log(abs D/4) - 0.13 does not continue past abs(D) = 199.
- 5468 forms without real zero have a located complex off-line zero. Residual to the twin law (q = abs D): mean -1.046, sd 0.552,
  min -3.107, 1% -2.448, median -1.108, 95% -0.034, max +1.059; 4211 (77.0%) below -5 rms, 17 above +5 rms. Principal forms (78):
  +0.491 +- 0.244, none below -5 rms. Non-principal (5390): -1.069 +- 0.523.
- The twin law does not transfer, but the onset remains a function of the first off-line zero inside each class: binding zero with
  Re > 1 (1982 forms): own fit a* = -0.067 + 0.382 log gamma - 0.501 log(beta - 1/2) - 0.015 log abs(D), rms 0.196; principal without
  real zero (78): rms 0.171; non-principal with binding zero in the strip (3408): rms 0.480, R^2 0.50 (the zero list is cut at
  Re > 0.52, t <= 45 and at 1.25 gamma_1, so later zeros to the right of 1 are missing from the predictor).
- 660 forms have an onset (median 3.08) and no off-line zero with Re > 0.52 below t = 45.
- Twins (cross-check): 380 of 440 negative below a = 3.0; residual with route-44 zeros (377 twins): mean -0.018, rms 0.171,
  min -0.617 (the lowest eight all have a real zero to the right of 1/2), none below -5 rms.
- Detector "I or E1" (first non-integer frequency of amin^s Z_Q(s)/r(amin), or first non-prime-power with c != 0): flags all 7584
  forms with h > 1 (support min 0.039, median 1.466, max 6.217) and none of the 13 class-number-one forms up to support log 2500.
  In a-units it is below the law prediction by more than 5 rms for 5432 of 5468 forms (99.3%), not for all; it precedes the measured
  Weil onset for 6256 of 7388 forms and follows it for 1132 (principal forms, where the real-zero onset 2.1-2.4 comes before the first
  non-square value abs(D)/4). It is a multiplicativity/integrality test (route 30 verdict) and is passed by every control with an
  Euler product (combination 2).

Why this is not a survivor. (i) "Every non-Euler form" fails: principal forms are late, 196 forms and 60 twins are never negative.
(ii) Where the onset is early, the cause is a zero far from the line: every Epstein zeta function with h > 1 has zeros in Re s > 1
(CLASSICAL: Davenport-Heilbronn 1936), 1982 forms have their binding zero there with onset tied to it (rms 0.196), and 1260 have a
real zero. This is the known pattern (separation to the right of 1, or resolution of the off-line zero). (iii) T-NR shows the
opposite dependence: its onset is log q while its off-line zeros sit at height pi/log q.

## 4. Combination 2 in detail

Finite consequence tested: J(S) = 0 for zeta at every support S, J(S) > 0 for every control at a support that does not grow with
the height of the control's off-line zeros.

Battery (MEASURED, a <= 3.4, 170 functions per sector): zeta, L(chi_-4), L(chi_-3), L(chi_5): no negative value, E1 = E2 = 0.

| control | Weil onset 2a* | E1 onset | E2 onset | remark |
|---|---|---|---|---|
| DH | 3.562 (route 44 double 3.6, certified <= 3.44-3.48) | 1.792 (n = 6) | 1.386 (p = 2, K = 2) | |
| 440 twins, q <= 49 | 380 negative below 6.0 | 1.792 .. 4.007 (median 1.792) | 0.693 .. 3.219 (median 1.099) | detector precedes the Weil onset for 380 of 380; the 60 Weil-blind twins are all flagged |
| 7584 Epstein forms, h > 1 | section 3 | I or E1: 0.039 .. 6.217 | not run (degree 2) | |
| E_a, alpha = 0.05, 1/8, 1/4, 3/8, 0.45 | 1.007, 0.937, 0.874, 0.827, 0.804 | none | 0.693 (det = 4 - (2^alpha + 2^-alpha)^2 < 0) | magnitude at support ln 3: -9.7e-7 (alpha = 0.05) .. -9.0e-3 |
| T-NR(q, c = 2.2), own bridge, q = 2 .. 397 | log q + 0.205 (q = 2), + 0.142 (3), + 0.086 (11), + 0.046 (397) | none | log q | zeros at height pi/log q = 4.53 (q = 2) .. 0.525 (q = 397) |
| T-NR(q, c = 2.2), zeta's bridge | log q + 0.000 .. 0.009 | none | log q | |
| T-NR(q, c = +-1), own bridge | none to 6.8 | none | log q or 2 log q | all zeros on the line (roots of 1 + cu + u^2 unimodular); the temperedness test flags it |
| sign twists: Liouville; 12 random | 0.726; 0.726 (7), 1.109 (3), 1.616, 1.952 | none | none | onset = first flipped prime |
| single flip at P = 2 .. 397; flips for all p >= P | log P + 0.000 .. 0.033 | none | none | |
| unimodular: zeta(s + i alpha), alpha = 0.1, 0.3, 1.2393, 3, 14.13; 12 random | 0.976, 0.898, 0.780, 0.734, 0.726; 0.726 .. 0.843 | none | none | |
| heat | N | N | N | no fixed-gamma Dirichlet series (flow-euler-defect Prop 1-2) |

Joint statistic: J exceeds zeta's value (0) for every formulable control at every support above min(E1, E2, R onset). Not a survivor:

1. PROVED (elementary): T-NR(q) with zeta's bridge and the single sign flip at P have the same coefficients as zeta for n < q, P,
   so every statistic of support below log q, log P takes zeta's value. T-NR(q, 2.2) has off-line zeros at height pi/log q, which
   decreases with q. A fixed support S separates no member with q > e^S.
2. MEASURED: once the prime enters, the Weil form with zeta's bridge is negative within 0.009 (T-NR) or 0.033 (sign flip) of log q.
   This is the zero-tolerance of Weil positivity in each prime weight (stack-combinator rows 19, 20): it identifies the coefficient.
3. E2 gives a false alarm on T-NR(c = +-1), a function with Euler product, functional equation and no off-line zero beyond zeta's.
4. E1 is passed by E_a, T-NR, sign and unimodular twists.

## 5. Combination 3 in detail

Finite consequence tested: for F with the arithmetic of an L-function every quadratic twist has its low zeros on the line and the
explicit-formula balance T(d) vanishes; a control fails "without high zeros" if a positive fraction of its twists has an off-line
zero at bounded height.

- zeta: 60786 twists, winding count = zeros found for 60783; 419678 zeros in the box, all on the line; max abs T = 5.6e-4.
- Dirichlet comparison L(s, chi_5 chi_d): 50651 twists, 407182 zeros, all on the line; max abs T = 3.8e-4.
- DH x chi_d = (1/2)[c0 L(s, chi_5 chi_d) + conj(c0) L(s, conj(chi_5) chi_d)], c0 = 1 - i kappa. PROVED (root numbers of products
  with coprime conductors): the twist keeps a functional equation s <-> 1-s exactly when chi_5(d) = +-1, i.e. d = +-1 mod 5.
  MEASURED: for d = +-2 mod 5 (25267 twists) the completed function is not real on the line and all zeros in the box are off it
  (7.74 per twist; 15194 twists have a real zero); for d = +-1 mod 5 (25144 twists, 7.59 on-line zeros per twist) 3119 (12.40%) have
  an off-line zero in the box, 2402 (9.55%) within 4 pi/log q, 1748 (6.95%) a real zero; the share grows with the conductor (3.6% for
  abs d < 1000, 13.4% for abs d >= 30000). abs T(d) > 0.01 for 2958 twists (max 4.03) while coefficient side minus all zeros stays
  below 6.2e-4. Twelve real zeros re-checked with Arb at 200 bits. The winding count is not closed for 240 of 50651 twists (0.47%).
- E_a x chi_d = L(s + alpha, chi_d) L(s - alpha, chi_d): off-line zeros at the height of every zero of L(s, chi_d); the lowest is
  below 4 pi/log abs(d) for 99.90% of d (derived from the zeta family).
- T-NR x chi_d: second factor 1 + c chi_d(3) 3^{1/2-s} + 3^{1-2s}; real zeros at 1/2 +- 0.4038 when chi_d(3) = -1 (37.49% of d),
  off-line zeros at height pi/log 3 = 2.860 when chi_d(3) = +1 (37.51%).
- zeta(s + i alpha) x chi_d = L(s + i alpha, chi_d): zeros on the line; passes (it has no off-line zero).
- Sign-twisted primes and heat: no continuation / no Dirichlet series; not formulable.

What it says about the untwisted function. For DH the failure does not come from its off-line zeros (first at height 85.7): half of
the twists lose the functional equation and 7% of the rest have a real zero, at height 0. The test detects that DH is a combination
of two eigenobjects, which is the missing Euler product seen in the conductor aspect. For E_a and T-NR the twists fail because the
untwisted functions already have off-line zeros at bounded height. Not a survivor: (a) not formulable for two controls; (b) passing
it requires locating the low zeros of every L(s, chi_d), which is GRH verification at low height for conductors up to 1e5 (verified
height in the conductor aspect); (c) the zeros of zeta do not enter: a zero of zeta off the line at any height is compatible with
every number in the zeta row.

## 6. Combination 4 in detail (MEASURED)

Finite consequence tested: amplitude vectors outside the Ramanujan box give a negative Weil symbol at support <= ln 12 for every
excess, while holomorphic newforms pass.

- 30 newforms (eta quotients 11a, 14a, 15a, 20a, 24a, 27a, 32a, 36a; weight 4 levels 5, 6, 8, 9; weight 6 levels 3, 4; weight 8
  level 2; Delta and the level-1 forms of weight 16, 18, 20, 22, 26; curves 17a, 19a, 37a, 43a, 53a, 61a, 79a, 83a, 89a): no negative
  value up to support 4; lambda_min at support ln 12 between 3.2e-13 (k16N1) and 0.65 (89a).
- Vertex lambda(p) = +2 with bridge (k,N): negative at support 0.761 (12,1), 0.777 (4,5), 0.823 (2,11), 0.933 (16,1), 1.175 (2,37),
  1.245 (24,1), 1.448 (2,100), 1.527 (36,1), 2.019 (2,1000), 2.917 (2,1e5). Sato-Tate-distributed vectors inside the box: negative
  at <= ln 12 in 61 of 100 cells, pass to support 4 in 19.
- Uniform excess lambda(p) = 2 + e, e = 0.001 .. 3: the onset is continuous in e and equals the vertex onset for e <= 0.03 on every
  bridge (e.g. (2,37): 1.175, 1.175, 1.175, 1.167, 1.144, 1.081, 0.917). E_a amplitudes: the same.
- One prime q outside the box (virtual-rung statement: the amplitude at q cannot act below support log q): with the other
  amplitudes zero and bridge (36,1), q = 7, e <= 0.1 and q = 11, e <= 0.3 pass to support 4; with bridge (2,1e5) every e <= 0.3 passes
  for every q. On genuine forms: 89a with lambda(3) <= 2.01 or lambda(5) = 2.001, 79a with lambda(5) <= 2.3 and 83a with lambda(5) <= 2.1 pass to
  support 4.
  On forms with small c0 the form turns negative within 0.03-0.1 of log q (Delta: 0.761, 1.144, 1.636, 1.964, 2.417 for
  q = 2, 3, 5, 7, 11): the same coefficient identification as in combination 2.
- Totals: outside-box vectors 1694: negative at <= ln 12 in 1432, later in 199, never (to support 4) in 63. Inside-box vectors 220:
  negative at <= ln 12 in 160.

Not a survivor: membership in the box and positivity at bounded support are independent; the sign of lambda_min is governed by
c0(k,N) and by how far the vector is from the amplitudes of an actual form (route 26: conductor-driven).

## 7. Survivors

None. Reasons per combination: section 2, last column.

## 8. Weakest points

1. All onsets are double-precision values on a finite basis. A reported negative value is a Rayleigh quotient below the floor (the
   failures of E_a, T-NR and DH were reproduced from the zero side); a reported "pass" is the absence of a negative value within the
   basis (frequencies up to about 340/a) and is not a positivity proof. The 196 never-negative Epstein forms are in this category.
2. Epstein zero lists are not certificates: ball-arithmetic evaluation, floating winding numbers, region Re s > 0.52, t <= 45, one
   zero located per window (57 forms had a window with more than one new zero). The law residuals use q = abs(D) for a degree-2
   function, outside the fitted range of the twin law.
3. Twist families: float64 theta integrals; winding count not closed for 0.47% of the DH twists; on-line classification by
   abs(Re s - 1/2) < 1e-6. Only twelve off-line zeros were re-checked with Arb.

## 9. Files

Code: `wf.py`, `objs.py`, `epzeros.py`, `census_epstein.py`, `census_fix.py`, `battery_onsets.py`, `gl2forms.py`, `twist.py`,
`chars44.py` (copy of the route-44 character code), `detector_epstein.py`, `analyze_census.py`, `analyze_twist.py`.
Validation: `validate.py`, `validate_zero_side.py`, `validate_nufft.py`, `validate_twist.py`, `recheck_zero_side.py` (+ `.json`),
`recheck_basis.py` (+ `.json`), `recheck_twist_arb.py` (+ `.json`).
Data: `census.jsonl`, `census_[0-2].jsonl` (first pass), `census_zfix_*.jsonl`, `census_zfiy_*.jsonl` (corrected onsets, override),
`census-zeros_[0-2].jsonl`, `detector_epstein.json`, `census_analysis.txt`, `census_summary.json`; `battery.json`, `twins.json`,
`arms.json`, `gl2.json`; `tw_{zeta,arm,dh}_{s4,o1,o2,o3}.jsonl`, `twist_analysis.txt`, `twist_summary.json`; `logs/` (server logs).
Server copy: `~/rh-push/s2-control-census-onsets/` (55 MB).
