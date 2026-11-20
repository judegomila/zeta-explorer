# REFEREE.md: c20-statement-o-line4-heat-zero-enclosures-server

This file has two parts. Part I (2026-11-20) is the adversarial referee report by a separate agent (lens: general).
Part II is the lane's own second pass, kept unchanged below; it is not an independent referee.

# Part I. Adversarial referee (separate agent, lens: general)

## I.0 Rule

**Holds** as claimed: verdict partial-result; certified conversions, one derivation; no statement about zeros of
zeta; requirement flags R1 = R2 = R3 = R4 = false. No error was found that changes a reported integer or enclosure.
Three corrections to the text and four limits of this report are listed in I.4 and I.5.

What this report did and did not do. Every lemma was re-derived on paper (I.1). The code was read line by line
against the lemmas (I.2). The numbers were re-computed with code written for this report (mpmath 1.4.1 and numpy
float64, python 3.14 on the Mac under `scripts/memcap.sh 8`; no Arb, no code shared with the lane), at cases the
lane's own second pass did not cover (I.3). The Arb runs themselves were NOT re-executed (python-flint is not on the
Mac; the server was not used for this report). The "certified" label therefore still rests on one execution of one
code base; this report confirms the mathematics, the code logic and the values, not the ball arithmetic.

## I.1 Re-derivation of the PROVED / CLASSICAL steps

| step | result of re-derivation |
|---|---|
| (A0) F = H_0 * G_tau equals H_{-tau} | Confirmed. int G_tau(v) e^{iuv} dv = e^{-tau u^2}, so int H_0(z-v) G_tau(v) dv = int Phi(u) cos(zu) e^{-tau u^2} du (the sine part vanishes by parity). Normalisation H_0(z) = xi(1/2 + iz/2)/8 is the Polymath one. The lane cited (A0) from b-escape-law without checking; it is correct. |
| P1 | Confirmed (abs cos((x+iy)u) <= cosh(yu), Phi > 0, functional equation). |
| P2 | Confirmed. Each factor comparison needs a + k <= k + 1, i.e. a <= 1; equality at a = 1. Numerically: max ratio 1.0 on a in {0.01..1}, b in [1e-3, 60]. |
| Lemma T | Confirmed. s = sigma + it/2; J_0 constant 1/16 correct; Gamma argument sigma/2 + it/4 with sigma/2 in (1/2, 1]. Derivative of log M_sigma: 1/(sigma + t/2) + 1/(2t) - (pi/8) coth(pi t/4) < 2.5/t - pi/8 < 0 for t > 20/pi. Uniform version: zeta, pi^(-sigma/2), Gamma(sigma/2) decreasing in sigma on the range, (sigma + t/2)^2 increasing; correct. Numerically at lines and heights the lane did not use (y = -1.01, -1.2, -2, -2.9, -3; t from 0.003 to 54321): max abs H_0 / M_sigma = 0.867; d/dt log M <= -0.099 on [7, 1e4]. |
| Lemma S | Confirmed (entire integrand; P1 bounds H_0 on the closed strip; Gaussian decay of G in Re w; Cauchy on rectangles). |
| Lemma Q | The lane quotes Trefethen-Weideman Thm 5.1 from memory. Not opened here either. For the functions f_z of this lane the sketch is a complete proof: f_z is entire with Gaussian decay on every horizontal line, so Poisson summation holds; shifting the line gives abs fhat(omega) <= M e^{-a' abs omega}; the sum over m != 0 is 2M/(e^{2 pi a'/h} - 1). So the bound used does not depend on the citation. |
| Application (A1) | Confirmed. Layers cover R; sup of the envelope on each layer is at its left end (needs XC - K - JL > 8 > 7: asserted in `env_far`); Gaussian masses are one-sided error functions; factor e^{(bmax+a)^2/(4 tau)} from abs G_tau on a line shifted by at most bmax + a. Dropped nodes: h * (sum of g over nodes in an interval) <= integral of g over the interval extended by h towards Re z, where g is monotone; this is the replacement dmax -> dmax + h. Nodes on a layer boundary are counted twice (safe side). Step count: NN = ceil(U (TB ln 2 + 12)/(2 pi a)) reproduces the node numbers 1715, 3523, 2935, 859, 1763, 1469 of the table. |
| Lemma W | Confirmed. A closed box not containing 0 is strictly separated from 0, so it lies in an open half-plane through 0; the continuous change of arg lies in (-pi, pi) and equals the principal Arg of the ratio (the value pi is excluded). Telescoping needs the same true point at the end of one segment and the start of the next: true in both codes (in `stage_poles.py` the endpoints are balls around the rational point t = num/den; both balls contain it). |
| Mean-value enclosure | Confirmed (componentwise average of S' over a segment lies in the box enclosure of S'). Derivative formulas of `Fsum`, and N', G', r' of `stage_poles.py`, re-derived by hand: correct. |
| Items B, C closed forms | Confirmed. q^(s-1/2) + c + q^(1/2-s) = 0 iff q^(s-1/2) in {-w, -1/w}; c = 2.1: w = 1.370156, Re s = 0.857311; c = 2.05: w = 1.25 exactly, Re s = 0.753177; Im s = pi/log q = 3.564428. The other root family (Re s = 1 - 0.857, 1 - 0.753) and the denominator zeros 1/2 +- i g1 of SG are outside the squares. |
| Item D count | Confirmed, with one step the lane did not write: at a zero of D where N != 0 (possible only in 0 < Re z <= 1/64 given n3 = 0), L~ has a pole and S~ = -1 there, so it is not a pole of S~. With that step: poles of S~ in the box = zeros of 1 + L~ = zeros of N at points with D != 0 (and s != s0 for U_s0, where N(s0) = D(s0) != 0). A, A', r, r' agree with the source lane's `arch` and `ren_log_der`; the phases a(p) agree with `chi_primes('U_s0')` (eps = (-1)^k, phi = arccos(-p^(-1/4))). |

## I.2 Code reading

- `heat_encl.py`: sample = exp(log J_0(s) - REF) zeta(s) at s = sigma0 + i t_j/2 (branch of the logs irrelevant after
  exp); `Fsum` is the trapezoid sum of Lemma S; eps box added to every vertex and segment enclosure; `error_bounds`
  implements (A1) with the assertions smin > 1, smax <= 2; refinement loop returns a failure, not a number, when a
  segment enclosure still contains 0. No path was found on which an uncertified integer is written.
- `ctrl_bc.py`: direct ball evaluation; g1 from `acb.zeta_zero(1)`.
- `stage_poles.py`: as described; corners 0, 1/64, 4, 10, 30 are exact.
- Tables of sections 3, 4, 5 compared with the JSON outputs entry by entry for integers, node counts, eps, lower
  bounds, segments: agree. Statements "winding radius below 1e-13", "sample modulus 3e2 to 2e5", "at most 4 bisection
  rounds (for F)", "5 to 12 above the Newton counts", "within 2 of the stage zeros", "U_s0 has 1 or 2 more" agree with
  the files and with the table of the source lane (27/29, 46/47, 62/67, 83/88, 118; stage zeros 32/33, 50/51, 71/72,
  94/94, 130).

## I.3 Numerical re-runs for this report (not rigorous; different cases from the lane's second pass)

The lane's second pass covered tau = 1 and tau = 0.25 only and stated that Arb's zeta at heights 2.5e8 to 8.5e10 had
no cross-check outside Arb. This report covers exactly those three cases, with mpmath's zeta (34 digits), on a third
line Im w = -1.3 (the lane used -1.6 and -1.8), step 0.1, nodes within 12 of XC.

| tau | height Im s | abs F at the lane's Newton root (scaled) | own Newton root from the square centre | log(F_ref / F_lane) at the two square centres, real and imaginary parts | winding F, half-width 0.05 (160 samples) and 1e-6 | winding H_0 (zeta), half-width 0.05 |
|---|---|---|---|---|---|---|
| 0.2 | 2.5e8 | 7.9e-28 | (0.09366859845971932200678, -1.613315187478983137989): equal to the lane's to 22 digits | -4.2915e-9 four times, spread 9e-13 | 1, 1 | 0 |
| 0.1 | 5.0e9 | 8.1e-27 | (0.0401002196726840464307, -0.9439076729629004543178): equal to 22 digits | -0.00099987 four times, spread 6e-11 | 1, 1 | 0 |
| 0.15 | 8.5e10 | 3.0e-25 | (-0.3313390162150551449318, -0.9882662021292928050145): equal to 21 digits | -0.03400116 four times, spread 4e-9 | 1, 1 | 0 |

The constant in the fifth column is the rounding of the lane's scaling constant REF (a double rounded to 3
decimals; this report used the printed 12-digit value), so the two code paths agree up to one real positive
constant per run, to 9e-13, 6e-11, 4e-9 relative (the noise level of the 34-digit run: terms cancel by up to 1e-16
relative to their size on this line). This is the first check of the Arb zeta samples at these heights outside Arb.

| other checks | result |
|---|---|
| item D, float64 winding of N (own formula, own digamma), box [0,4] x [10,30], P = 37, 144000 samples | zeta phases 94, U_s0 96 (n2 the same, n3 = 0); max phase step 0.047. Equal to the certified integers, including the row U_s0, P = 37 that has no 256-bit rerun. |
| same, P = 47, 120000 samples | zeta phases 130 (equal to the certified integer, which has no 256-bit rerun). U_s0: **131** (MEASURED, float64, max phase step 0.021; the lane did not run this row; not certified). |
| same, P = 13 | 32 and 34. |
| item D, box [0,8] x [10,30] (the lane stops at Re z = 4), P = 13, 37, 47, both phase choices | same integers as on [0,4]: no zero of N with 4 <= Re z < 8 in the window (MEASURED, float64). |
| item C at parameters the lane did not use (c = 2.5) and at c = 2.05; item B at b = 0.35; mpmath, 240 samples | winding 1 at the closed-form zero in each case; zeta 0. abs value at the closed-form zero below 1e-31. |

## I.4 Errors and corrections (none changes a certified integer)

1. Section 2.2, last paragraph: "REF = -1968.99 at x = 5002". The runs used REF = -1950.160 (line -1.6) and -1949.861
   (line -1.8); hand evaluation of log abs J_0(5002 - 1.6 i) gives -1950.16. The printed number is wrong (probably
   from the abandoned first design). Cosmetic: REF is an arbitrary scaling constant.
2. Section 5, certificate: the case "D = 0 and N != 0 in 0 < Re z <= 1/64" is not addressed in the text. It is
   harmless (S~ = -1 there; see I.1). The sentence should be added.
3. Section 2.2, Lemma Q: label "CLASSICAL, proof sketch" is accurate; neither the lane nor this report opened the
   reference. For the entire, Gaussian-decaying integrands used here the sketch is a full proof, so the label could
   be PROVED for this application.

## I.5 Limits and context

1. Known results. That H_t has non-real zeros for every t < 0 is a theorem (Rodgers-Tao 2018, Lambda >= 0); the
   lane does not claim otherwise, but does not cite it. What the lane adds is the location of six specific zeros
   (three with Re s > 1.17), certified in ball arithmetic. Items B and C certify zeros that are known in closed
   form; the certificate adds only "exactly one, simple, in the square". Nothing here is presented as a new theorem.
2. RH is not assumed anywhere. The Arb routine `zeta_zero(1)` isolates the first zero unconditionally.
3. Verified height: the count 0 for H_0 on the three squares that meet the strip restates the verified height (the
   lane says so in section 7). On the three squares with Re s > 1.17 it restates the non-vanishing of zeta for
   Re s > 1. The zeta column is a control on the code, not a result.
4. The Arb executions were not repeated by this report; trust in Arb's `acb.zeta` at Im s up to 8.5e10 is now
   supported by agreement with mpmath to between 9e-13 and 4e-9 relative, which confirms values and conventions but
   not the last bits. On the contours abs F is of size 1e-5 or more in the scaled units at these three tau (centre
   values 1e-13 at distance 5e-10 from the zero give abs F' near 3e-4), so the level not excluded by this check is
   below 1e-13 absolute there, against certified lower bounds of 5e-10 or more: a discrepancy of that size could
   not move a winding number.
5. Scope (as the lane states): item A does not touch the escape law of b-escape-law; six zeros are six zeros.
   Item D covers 0 < Re z < 4 only (float64 here: nothing in 4 <= Re z < 8), on one window, P <= 47.

## I.6 Requirement flags (set by this referee)

| flag | value | reason |
|---|---|---|
| R1 | false | no argument about zeta; multiplicativity is not used |
| R2 | false | finitely many squares at six heights, one window for the stages |
| R3 | false | the objects certified are controls and finite stages; no mechanism is tested against them |
| R4 | false | no passage to the critical line; no statement about zeta |

No statement about zeros of zeta is made or supported by this lane beyond restatements of known facts (I.5.3).

---

# Part II. In-lane second pass (by the lane's own agent; unchanged)


Date 2026-11-20. Status of this file: a second pass by the same agent that wrote the lane, using a different
numerical code path (mpmath, numpy, scipy; no Arb; no code shared with `heat_encl.py`, `ctrl_bc.py`,
`stage_poles.py`). The lane had no means to start a separate referee agent. It therefore counts as an in-lane check,
not as an independent referee: the label that the certified rows can carry is "certified, one derivation".

## Rule

Holds, with the corrections below (all made before the final runs; none changes a reported integer).
No statement about zeros of zeta; no requirement score.

## 1. Numerical checks run for this file (not rigorous)

| check | script, output | result |
|---|---|---|
| item A, tau = 1: defining integral (A0) on the unshifted line Im(z-u) = Im z, mpmath 30 digits, step 0.05; centre value against the ball value; winding on the half-width 0.05 square from 16 samples; abs F at the Newton root | `referee_check.py`, `referee_t1_first.json` | relative difference 8.2e-14; winding 1.0 (max phase step 0.49); abs F = 5.8e-27 at the root against 6.3e-11 at the square centre |
| item A, tau = 0.25, zero outside the strip | `referee_t0p25_deep.json` | relative difference 2.2e-11; winding 1.0; abs F = 2.7e-27 at the root |
| item A, tau = 0.25, zero inside the strip | `referee_t0p25_strip.json` | relative difference 9.3e-13; winding 1.0; abs F = 2.6e-27 at the root |
| Lemma T: abs H_0(t+iy)/M_sigma(t) on 5 lines y in [-3, -1.1] and 8 values of t in [0.01, 5000] | `referee_misc.py`, `referee_misc.json` | maximum 0.66 (<= 1 as required) |
| P2: abs Gamma(a+ib)^2 / (Gamma(a)^2 pi b / sinh(pi b)), a in (0, 1], b in [0.01, 40] | same | maximum 1.0 (equality at a = 1, as the proof predicts) |
| M_sigma decreasing for t >= 7 (sigma = 1.05, 2; t in [7, 60]) | same | true |
| Lemma S and Lemma Q together: trapezoid sums on a third line y0 = -1.3 (not used by the lane) at steps 0.1 and 0.05 | same | relative difference 3.7e-19 |
| items B, C: value at the closed-form zero; 400-sample winding on the half-width 0.05 squares; zeta on the same squares | same | abs value below 1e-31; winding 1.0 in the four cases; zeta 0 |
| item D: float64 winding of N on the box [0,4] x [10,30], 96000 samples, P = 13, 19, 29, both phase choices (own formula for N, scipy digamma) | same | 32, 51, 71 (zeta phases); 34, 52, 73 (U_s0): equal to the certified integers; max phase step 0.036 |

The relative differences of the first three rows are at the level expected from 30 digits (the exponent REF is of
size 4e5 at tau = 0.25 and the terms cancel to 1e-2 of their size on the unshifted line), not at the level of the
ball radii (1e-33); they confirm the value, the scaling constant and the sign conventions, not the last digits.

## 2. Reading of the proofs

- P1: uses Phi > 0 and the cosine representation of H_0; standard. Holds.
- P2: Weierstrass product for abs Gamma(a+ib)/Gamma(a) and the product for sinh; the inequality a + k <= k + 1 needs
  a <= 1, which is why the code asserts sigma <= 2. Holds; equality at a = 1 seen numerically.
- Lemma T: s = sigma + it/2 on the line Im w = y, so abs zeta(s) <= zeta(sigma) needs sigma > 1 (asserted in the
  code: `smin > 1`). The monotonicity computation is elementary. The uniform version needs Gamma decreasing on
  (1/2, 1], true (the minimum of Gamma is at 1.4616). Holds.
- Lemma S: Cauchy on rectangles with Gaussian decay; holds.
- Lemma Q: quoted from memory. The form used (bound 2M/(e^{2 pi a/h} - 1), M a bound for the L1 norms on all lines
  of the open strip) is the standard one. The offset t_0 is harmless (translation). Not opened: flagged as weakest
  step 1 of RESULT.md. Independent evidence: step halving on a third line agrees to 3.7e-19, far below what a wrong
  constant in the exponent would allow at step 0.1 (e^{-2 pi 0.5/0.1} = 2e-14 would already be visible if a were 0.5
  on that line; the true strip is wider).
- Application: the layers cover R once (central layers [XC-K, XC+K], right tail, left unit layers, 8 <= t, t <= 8);
  the Gaussian masses are one-sided error functions of the distance to Re z, which requires K - dmax > 0 and
  U - dmax - h > 0: asserted in `env_far`. For the dropped nodes the comparison of a sum with an integral needs the
  Gaussian to be decreasing on the range, same assertion. Holds.
- Lemma W: holds. In the code the principal Arg of a ball that meets the negative real axis would come back as a
  wide ball and the integer test would fail (safe side); in the runs all ratios have phase below 0.5.
- Item D: n1 = n2 and n3 = 0 give the count as stated; for U_s0 the point s0 lies in the box and N(s0) = D(s0),
  non-zero because n3 = 0 covers it (Re z0 = 1/4 >= 1/64). The statement is about the box 0 < Re z < 4 only.

## 3. Corrections made during the lane (before the final runs)

1. First design (adaptive `acb.integral`, tail bound by the constant xi((1+abs y0)/2)/8) abandoned: no evaluation
   finished, and the constant bound ignores the decay e^{-pi t/8} of H_0, which at x = 1e6 would have forced an
   integration range of +-630. Replaced by Lemma T and the trapezoid rule.
2. First configuration centred the nodes at the box centre of the source lane (23 units from the zero): the tail
   bound is then not small. Centre moved to the integer nearest to the zero. The run was stopped before any result.
3. Reporting only: the lower bound for abs F on the contour was first taken from Arb's `abs(acb).lower()`, which
   returned 0 for boxes whose real part contains 0; replaced by the coordinate-wise bound `lowabs`. The winding
   certificates never used that number (they use the box test `contains0`).
4. Item B: b = 0.45 replaced by b = 0.4 (the half-width 0.05 square around 0.95 touches s = 1).
5. Item A at tau = 0.15 and 0.1: direct wide-ball evaluation of the sum needed about 1e4 times finer segments
   (cancellation in the sum on a line far from the saddle); replaced by the mean-value form. All 36 squares were
   rerun with the final code.
6. Item D: first version (direct enclosures, delta = 2^-10) kept as `out_stage_v1_delta1024_p128.json` for P = 13, 19;
   same integers as the final version (delta = 2^-6, mean-value enclosures).

## 4. Not checked here

- Arb's zeta at heights 2.5e8 to 8.5e10 (tau = 0.2, 0.15, 0.1) has no cross-check outside Arb in this lane.
- The escape law F1 of `push/b-escape-law` (Theorem A, Lemma R) was not re-derived; this file is not a second
  referee of F1.
- The identification of (A0) with the parametrisation "e^{tau u^2/16} kappa" of the map row HEAT.
