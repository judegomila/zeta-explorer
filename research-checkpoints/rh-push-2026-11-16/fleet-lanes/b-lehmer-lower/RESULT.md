# b-lehmer-lower: near-violations of RH at heights 1e12, 1e15, 1e18 (1.38e10 zeros scanned)

Working note, 2026-11-16/17. Scope: `tmp/research-2026-11-16/push/b-lehmer-lower/` only. Nothing committed or pushed.
No RH claim, no new bound on Lambda, no zero-free region. Labels: PROVED (short argument given here), CLASSICAL,
MEASURED (double precision, not interval-certified), CERTIFIED (Arb ball arithmetic), HEURISTIC, OPEN.

## Verdict

**partial-result.** No theorem about zeta is proved. Delivered:

1. A scanner (Riemann-Siegel main sum by non-uniform FFT, exact integer phases, band-limited interpolation) that
   locates every zero of Z(t) in a window at about 2e5 to 3e5 zeros per core-second on the shared machine,
   validated four ways (section 2).
2. Scans of 1,006,602,771 zeros at t ~ 1e12, 10,065,980,192 zeros at t ~ 1e15 and 2,709,425,640 zeros at t ~ 1e18
   (Route 22 had 1.55e6 zeros). In every window the number of zeros found on the line matches the
   Riemann-von Mangoldt count to within the S(t) fluctuation; no same-sign local extremum of Z was found (MEASURED).
3. Tables of extremes: closest pairs (top entries CERTIFIED by Arb sign changes), closest triples, largest gaps,
   largest |Z| (section 3).
4. Scaling laws with measured constants (section 4).
5. An elementary identity (PROVED, section 5): on tests vanishing at the pair midpoint, the coefficient of a zero pair in
   the one-sided Weil form of eq48 equals eps^2/2, the two-body de Bruijn-Newman collision time of the pair. So the
   table of closest pairs is the table of smallest one-sided Weil-form margins.
6. A measured law for the arithmetic environment of the extremes (section 6): the small-prime phases at an n-cluster of
   zeros are tilted by n^2 times the Landau baseline: 3.925 +- 0.012 for pairs (n^2 = 4), 8.47 +- 0.07 for triples
   (n^2 = 9), independent of how small the gap is. The local zero configuration around a close pair is the GUE
   degenerate-pair profile. The gap of a close pair is uncorrelated with the small-prime sum (|corr| < 0.007); the
   curvature of Z at the pair, log(|Z'|/delta), is correlated with it at 0.88-0.91.

Consequence for the proof attempts (section 8): the near-violations are generic random-matrix events located by local
density only. No prime-phase configuration is excluded at a close pair, and the margin goes to zero like N^(-2/3).
This is consistent with Lambda >= 0 (Rodgers-Tao) and with the eq48 result that no margin theta < 1 holds. It gives no
lever toward RH.

## 0. Plan (written before the main computation)

**Target.** Locate where RH is closest to failing among zeros at heights 1e15 and above, describe the extremal
configuration, and give the scaling of the extremes.

**What is new relative to the atlas and the fifty routes.**

- Route 22 (fifty-routes synthesis, status "superseded") scanned 1.55e6 zeros and reported the Csordas-Smith-Varga (CSV)
  bound Lambda >= -4.2577e-6. This note scans 1.38e10 zeros at three heights. It does not try to improve a lower bound
  on Lambda: atlas section 12 records Rodgers-Tao Lambda >= 0, which supersedes every Lehmer-pair bound. The CSV values
  below are reported only as the size of the near-violation.
- Earlier notes used only Lehmer's pair at gamma ~ 7005 (r3 theta-collision, r3 Heegner heights). The statistics of the
  environment of close pairs at large height (section 6) are not in the atlas or the route files.
- eq48 (refereed) shows the residual target is the Weil form on one-sided tests and that no margin theta < 1 holds.
  Section 5 gives the size of the margin on a specific pair in closed form, and section 4 gives how fast it tends to 0.

**Walls.**

- Davenport-Heilbronn (DH): the scan uses no arithmetic. It would run on DH unchanged and would report the off-line
  zeros as same-sign local extrema (section 7 shows this at t ~ 85.7). The only place the Euler product enters is the
  prediction in section 6: the tilt is supported, at first order, on prime powers with weight Lambda(n)/sqrt(n).
- Flow-blindness, MV-CAP, verified height: every statement here is a measurement on finite windows. None is used as a
  hypothesis in a proof. No claim is made about all zeros or about all windows.

**Data sources.** The LMFDB/Platt zero files are behind a JavaScript check page for automated clients; they were not
downloaded. Odlyzko's public tables (`zeros3`, `zeros4`, `zeros5`) were downloaded and `zeros3` was used for
validation. All other zeros were computed.

## 1. Method

t = T0 + kappa*h with T0 an integer and h = 2 pi / (8 theta'(T0)), so the mean zero spacing is 4 grid units.

- Main sum: G_k = sum_{n <= K} n^(-1/2) exp(-i T0 log n) exp(-i k x_n), x_n = h (log n - theta'(T0)/2), for 2^25 values
  of k by one type-1 NUFFT (finufft, eps = 1e-11). The phase T0 log n mod 2 pi is exact integer arithmetic: a table of
  frac(log n / 2 pi) in 128-bit fixed point (prime logarithms from Arb at 240 bits, extended multiplicatively by a
  smallest-prime-factor sieve) is multiplied by T0 modulo 2^128. The linear phase is exp(i pi k / 8), a 16-periodic
  table. Z = 2 Re(e^{i theta} G) + terms n in (K_min, K(t)] + the C0 Riemann-Siegel remainder.
- Off-grid values: Kaiser-windowed sinc interpolation (20 taps, 8x oversampled band), with the derivative kernel for Z'.
- Zero finding: Z and Z' at every grid point. A grid interval is accepted as holding 0 or 1 zeros only when the Hermite
  cubic is clear of zero by a tolerance; otherwise it is subdivided (2, then 8 sub-intervals). Same-sign intervals whose
  slopes point toward zero are resolved by locating the extremum of Z. A same-sign extremum that does not cross zero
  would be recorded as "unresolved" (a candidate RH violation or an unresolved pair). None occurred.
- Count check per window: zeros found minus (theta(b) - theta(a))/pi, which should equal S(b) - S(a).
- The closest pairs are refined by direct summation of the Riemann-Siegel sum in double precision with exact integer
  phases at an integer origin within 1/2 of the pair, then checked in Arb (220 bits): rigorous signs of
  Re(e^{i theta} zeta(1/2+it)) at gamma_a -+ w and gamma_b -+ w with w = 1e-3 * gap. This certifies two zeros on the
  critical line whose distance lies in (gap - 2w, gap + 2w).

Machine: motherbox, at most 8 processes, about 13 GB. Wall time: 1e15 run 108 min (8, then 6 processes), 1e12 run
30 min (2 processes), 1e18 run about 105 min (2 to 6 processes). Code in `code/`.

## 2. Validation

| check | result | label |
|---|---|---|
| 10,000 zeros 1e12+1 .. 1e12+1e4 against Odlyzko `zeros3` | max difference 2.5e-9 (the table is stated accurate to 1e-8) | MEASURED |
| count check, 1e15, 1200 contiguous windows | sum of discrepancies -0.72 (telescopes to S(end) - S(start)); per window in [-2.00, 2.39], sd 0.708; 0 unresolved | MEASURED |
| count check, 1e12, 120 contiguous windows | sum -0.45; per window in [-1.42, 1.56]; 0 unresolved | MEASURED |
| count check, 1e18, 323 windows (not contiguous) | mean 0.007, per window in [-1.67, 2.33], sd 0.761; 0 unresolved | MEASURED |
| Z at the extremum of the top pairs, double direct sum against Arb | absolute differences at most 1e-12 (1e15) and 1.2e-12 (1e18) | CERTIFIED (Arb side) |
| first version of the zero finder | missed 14 zeros in 8.4e6 (clusters of 2-3 zeros inside one grid interval); the count check exposed it; fixed by the tolerance and subdivision rule | MEASURED |

A missed pair changes a window's discrepancy by -2. The contiguous sums (-0.72, -0.45) rule out a net loss in the 1e15
and 1e12 runs. sd 0.71 matches sqrt(2 Var S) for Var S ~ 0.25.

## 3. Table of extremes

Notation: delta = gap * log(T/2 pi) / (2 pi) (gap in mean spacings); eps = gap in t; eps^2/2 = Delta^2/8 with
Delta = 2 eps the gap of the zeros x = 2 gamma of H_0. "CSV lambda" is the Csordas-Smith-Varga expression
((1 - (5/4) Delta^2 g)^(4/5) - 1)/(8 g), with g summed over 40 neighbours on each side plus a continuum tail
(MEASURED, not a rigorous bound; superseded by Lambda >= 0 in any case). Locations are integer + offset of the extremum
of Z between the two zeros.

### 3.1 Closest pairs

**t ~ 1e12: N = 1,006,602,771 zeros, t in [1e12 - 1.0e6, 1e12 + 2.442e8], log(T/2 pi) = 25.793**

| # | location t | delta | gap in t | Z at extremum | eps^2/2 | CSV lambda | Arb |
|---|---|---|---|---|---|---|---|
| 1 | 1000191275923+0.253412364 | 0.0002522 | 6.1445e-05 | -6.322e-08 | 1.8877e-09 | -1.8877e-09 | certified, gap in (6.13217e-05, 6.15674e-05) |
| 2 | 1000198007639-0.323713436 | 0.0008623 | 2.1006e-04 | +1.704e-06 | 2.2063e-08 | -2.2063e-08 | certified, gap in (2.09644e-04, 2.10484e-04) |
| 3 | 1000016532367+0.466136124 | 0.0008677 | 2.1136e-04 | -7.231e-07 | 2.2337e-08 | -2.2337e-08 | certified, gap in (2.10939e-04, 2.11784e-04) |
| 4 | 1000129222020-0.420783002 | 0.0010479 | 2.5527e-04 | -7.706e-07 | 3.2583e-08 | -3.2583e-08 | certified, gap in (2.54764e-04, 2.55785e-04) |
| 5 | 1000021167702-0.357250933 | 0.0012806 | 3.1196e-04 | -2.205e-06 | 4.8660e-08 | -4.8660e-08 | certified, gap in (3.11336e-04, 3.12584e-04) |
| 6 | 1000208150671-0.189314337 | 0.0013591 | 3.3106e-04 | -7.673e-07 | 5.4801e-08 | -5.4801e-08 | certified, gap in (3.30399e-04, 3.31724e-04) |
| 7 | 1000152857745-0.250923692 | 0.0016232 | 3.9540e-04 | +2.726e-06 | 7.8169e-08 | -7.8169e-08 | certified, gap in (3.94606e-04, 3.96187e-04) |
| 8 | 1000205644738+0.199725485 | 0.0018567 | 4.5228e-04 | -8.241e-06 | 1.0228e-07 | -1.0228e-07 | certified, gap in (4.51377e-04, 4.53186e-04) |
| 9 | 1000004174825+0.072384417 | 0.0019719 | 4.8036e-04 | -6.939e-06 | 1.1537e-07 | -1.1537e-07 | certified, gap in (4.79396e-04, 4.81317e-04) |
| 10 | 1000028002843-0.323526533 | 0.0019847 | 4.8348e-04 | +3.107e-06 | 1.1688e-07 | -1.1688e-07 | certified, gap in (4.82511e-04, 4.84445e-04) |

**t ~ 1e15: N = 10,065,980,192 zeros, t in [1e15 - 8.1e5, 1e15 + 1.9333e9], log(T/2 pi) = 32.701**

| # | location t | delta | gap in t | Z at extremum | eps^2/2 | CSV lambda | Arb |
|---|---|---|---|---|---|---|---|
| 1 | 1000001140836065+0.442731214 | 0.0004021 | 7.7251e-05 | +1.411e-07 | 2.9839e-09 | -2.9839e-09 | certified, gap in (7.70967e-05, 7.74057e-05) |
| 2 | 1000001664927636-0.472614282 | 0.0004492 | 8.6317e-05 | -3.215e-07 | 3.7254e-09 | -3.7254e-09 | certified, gap in (8.61449e-05, 8.64901e-05) |
| 3 | 1000001191699624-0.079209204 | 0.0005520 | 1.0606e-04 | +9.443e-07 | 5.6239e-09 | -5.6239e-09 | certified, gap in (1.05844e-04, 1.06268e-04) |
| 4 | 1000000736503207-0.251578476 | 0.0005548 | 1.0660e-04 | -2.125e-07 | 5.6820e-09 | -5.6820e-09 | certified, gap in (1.06389e-04, 1.06815e-04) |
| 5 | 1000001596938191-0.275281164 | 0.0005684 | 1.0921e-04 | -3.024e-07 | 5.9631e-09 | -5.9631e-09 | certified, gap in (1.08989e-04, 1.09426e-04) |
| 6 | 1000001804457762+0.249472723 | 0.0006184 | 1.1883e-04 | -6.660e-07 | 7.0600e-09 | -7.0600e-09 | certified, gap in (1.18590e-04, 1.19066e-04) |
| 7 | 1000000884469210+0.164426700 | 0.0006201 | 1.1915e-04 | -6.128e-08 | 7.0984e-09 | -7.0984e-09 | certified, gap in (1.18912e-04, 1.19388e-04) |
| 8 | 1000001760379221+0.316527102 | 0.0007287 | 1.4001e-04 | +1.009e-06 | 9.8012e-09 | -9.8012e-09 | certified, gap in (1.39729e-04, 1.40289e-04) |
| 9 | 1000001146237757-0.074566308 | 0.0007473 | 1.4360e-04 | -9.727e-07 | 1.0310e-08 | -1.0310e-08 | certified, gap in (1.43308e-04, 1.43883e-04) |
| 10 | 1000001474115091+0.198337087 | 0.0008483 | 1.6299e-04 | +1.014e-06 | 1.3283e-08 | -1.3283e-08 | certified, gap in (1.62663e-04, 1.63315e-04) |

**t ~ 1e18: N = 2,709,425,640 zeros, 323 windows of length 1,330,652 inside [1e18, 1e18 + 5.32e8], log(T/2 pi) = 39.609**

| # | location t | delta | gap in t | Z at extremum | eps^2/2 | CSV lambda | Arb |
|---|---|---|---|---|---|---|---|
| 1 | 1000000000003262975-0.191891129 | 0.0006792 | 1.0774e-04 | -1.559e-06 | 5.8035e-09 | -5.8035e-09 | certified, gap in (1.07521e-04, 1.07952e-04) |
| 2 | 1000000000434058326+0.235176048 | 0.0008054 | 1.2777e-04 | +2.594e-07 | 8.1621e-09 | -8.1621e-09 | certified, gap in (1.27511e-04, 1.28022e-04) |
| 3 | 1000000000390801944-0.211587622 | 0.0009120 | 1.4468e-04 | -2.702e-07 | 1.0466e-08 | -1.0466e-08 | certified, gap in (1.44390e-04, 1.44969e-04) |
| 4 | 1000000000510317381+0.478702627 | 0.0009257 | 1.4685e-04 | -4.376e-07 | 1.0783e-08 | -1.0783e-08 | certified, gap in (1.46559e-04, 1.47147e-04) |
| 5 | 1000000000452010088-0.352025065 | 0.0010887 | 1.7270e-04 | -1.390e-06 | 1.4913e-08 | -1.4913e-08 | certified, gap in (1.72359e-04, 1.73050e-04) |
| 6 | 1000000000452959578-0.130599754 | 0.0011289 | 1.7907e-04 | -2.945e-06 | 1.6034e-08 | -1.6034e-08 | not run |
| 7 | 1000000000409303259-0.031288576 | 0.0011389 | 1.8067e-04 | +2.473e-06 | 1.6321e-08 | -1.6321e-08 | not run |
| 8 | 1000000000309922961+0.410279415 | 0.0011688 | 1.8541e-04 | -3.010e-06 | 1.7188e-08 | -1.7188e-08 | not run |
| 9 | 1000000000150485282-0.308338915 | 0.0012505 | 1.9838e-04 | +3.251e-06 | 1.9676e-08 | -1.9676e-08 | not run |
| 10 | 1000000000034257454+0.019906992 | 0.0012627 | 2.0030e-04 | -8.468e-07 | 2.0061e-08 | -2.0061e-08 | not run |

"Certified" means: Arb proves two sign changes of Z, hence two zeros on the critical line at the stated distance. It does
not certify that no other zero lies between them, and it does not certify the CSV sum g.

### 3.2 Other extremes (MEASURED)

| quantity | 1e12 (1.007e9 zeros) | 1e15 (1.007e10 zeros) | 1e18 (2.709e9 zeros) |
|---|---|---|---|
| closest pair delta | 0.0002522 | 0.0004021 | 0.0006792 |
| closest triple, span of 3 consecutive zeros (mean spacings) | 0.10624 at 1000044954492+132612.71 | 0.08861 at 1000001376425960+564459.56 | 0.09945 at 1000000000423147336-51173.56 |
| largest gap delta | 4.16637 at 1000022477246+298621.92 | 4.36987 at 1000001713279620-710723.52 | 4.25961 at 1000000000105121508-322787.49 |
| largest \|Z\| on the grid | 260.8 at 1000022477246+298622.39 | 505.0 at 1000001855112740-113700.14 | 660.4 at 1000000000070524556+652482.50 |
| GUE scale sqrt(8 ln N)/pi for the largest gap | 4.10 | 4.32 | 4.20 |

The largest gap and the largest |Z| coincide at 1e12 (same location to 0.5 in t). At 1e15 the fourth-largest gap
(4.2529 at 1000000372311940+547654.38) holds the second-largest |Z| (504.7 at +547654.74).

## 4. Scaling (MEASURED against stated predictions)

**4.1 Small gaps.** GUE: P(delta < x) = (pi^2/9) x^3 - (2 pi^4/225) x^5 + ... . Finite-height correction
(Bogomolny-Keating; CUE of size N_eff = L/sqrt(12 Lambda_BK), L = log(T/2 pi), Lambda_BK = 1.57314): factor
1 - 1/N_eff^2 = 1 - 12 Lambda_BK / L^2.

| height | pairs with delta < 0.03 | observed / GUE | predicted factor |
|---|---|---|---|
| 1e12 | 28,906 | 0.9705 +- 0.0059 | 0.9716 |
| 1e15 | 292,723 | 0.9829 +- 0.0018 | 0.9823 |
| 1e18 | 78,933 | 0.9846 +- 0.0036 | 0.9880 |

At 1e15 the uncorrected GUE value 1 is excluded at 9.5 sd and the corrected value agrees within 0.3 sd. Route 22 and
Route 33 reported this correction at 1.55e6 zeros; this is the same statement with 4 orders of magnitude more zeros.

**4.2 Closest pair among N zeros.** With c_T the factor above, P(delta_min > x) = exp(-N c_T (pi^2/9) x^3), so
delta_min = (9 E / (pi^2 c_T N))^(1/3) with E exponential of mean 1 (median ln 2).

| run | N c_T (pi^2/9) delta_1^3 (should be an Exp(1) draw) |
|---|---|
| 1e12 | 0.017 (a 1.7% lower-tail event) |
| 1e15 | 0.705 |
| 1e18 | 0.92 |

Running record at 1e15 (NUFFT accuracy): N = 1.7e7: 0.00349; 1.0e8: 0.00186; 1.0e9: 0.00108; 3.0e9: 0.00100;
1.0e10: 0.00039. Ratios to (9/(pi^2 N))^(1/3): 0.92, 0.89, 1.12, 1.49, 0.88. Counts at 1e15: 11 pairs with
delta < 0.001 (prediction 10.8), 88 with delta < 0.002 (86.7), 1410 with delta < 0.005 (1355).

**4.3 Margin.** eps = 2 pi delta / L, and the margin of section 5 is eps^2/2 = 2 pi^2 delta^2 / L^2. For the first N
zeros of a window at height T:

  min eps^2/2 = (2 pi^2 / L^2) (9 E / (pi^2 c_T N))^(2/3).

It tends to 0 as N^(-2/3).

| run | observed min eps^2/2 | formula at the median E = ln 2 | E of the observed pair |
|---|---|---|---|
| 1e12, N = 1.007e9 | 1.89e-9 | 2.22e-8 | 0.017 |
| 1e15, N = 1.007e10 | 2.98e-9 | 2.95e-9 | 0.705 |
| 1e18, N = 2.709e9 | 5.80e-9 | 4.81e-9 | 0.92 |

For all zeros up to height T (N = T L / 2 pi) the formula scales as T^(-2/3) L^(-8/3). The published Lehmer-pair
bounds (-4.379e-6, Csordas-Smith-Varga 1994; -2.7e-9, Odlyzko 2000; -1.15e-11, Saouter-Gourdon-Demichel 2011; values
quoted from memory, CLASSICAL, not re-derived here) are of the size the formula gives for 1e9 to 1e13 zeros: at
N = 1e13, L = 26.7 the median is 4.4e-11.

**4.4 Triples.** For three consecutive zeros in a span x, GUE gives N * integral of the sine-kernel R3 (leading order
x^8). CUE(N_eff) factor: (1 - 1/N_eff^2)^2 (1 - 4/N_eff^2).

| height | span < | observed | GUE | ratio | predicted factor |
|---|---|---|---|---|---|
| 1e12 | 0.30 | 1485 | 1838.6 | 0.808 +- 0.021 | 0.837 |
| 1e15 | 0.20 | 656 | 743.3 | 0.883 +- 0.034 | 0.897 |
| 1e18 | 0.30 | 4475 | 4948.8 | 0.904 +- 0.014 | 0.929 |

(At 1e15 only the 5 smallest triples per window were stored for most windows; the list is complete below 0.20.)

**4.5 Largest gaps.** 4.17, 4.37, 4.26 against the GUE scale sqrt(8 ln N)/pi = 4.10, 4.32, 4.20. No gap >= 6.

## 5. One-sided Weil form: the margin of a pair (PROVED, elementary)

Setting of eq48: F(w) = xi(1/2 + w), zeros rho = i gamma under RH, V(z) = sum_j b_j/(z + x_j) with Re x_j > 1/2, and
Q(V) = sum_rho V(rho) conj V(-conj rho). Put V#(z) = conj V(-conj z) and, for a fixed gamma_0,
Phi(u) = V(i gamma_0 + u) V#(i gamma_0 + u), holomorphic for |u| < 1/2.

**Lemma W.**
(i) A pair of zeros on the line at i(gamma_0 +- eps/2) contributes Phi(i eps/2) + Phi(-i eps/2) to Q(V).
(ii) A pair off the line at i gamma_0 +- beta (beta real; the two points are exchanged by w -> -conj w) contributes
Phi(beta) + Phi(-beta) = 2 Re(V(rho) conj V(-conj rho)).
(iii) Phi(u) + Phi(-u) is even, so it equals e(u^2) with e holomorphic. With sigma = -4u^2, the contribution of the
pair is q(sigma) = e(-sigma/4), real-analytic in sigma on (-1, 1): sigma = eps^2 > 0 is the pair on the line, sigma =
-4 beta^2 < 0 is the pair off the line, and sigma = 0 is the double zero.
(iv) q(sigma) = 2 |V(i gamma_0)|^2 + (sigma/4) d^2/dy^2 |V(i(gamma_0 + y))|^2 at y = 0, + O(sigma^2). If
V(i gamma_0) = 0 then q(sigma) = (sigma/2) |V'(i gamma_0)|^2 + O(sigma^2).

Proof. On the line -conj(i gamma_0 + iy) = i gamma_0 + iy, so V# = conj V there and Phi(iy) = |V(i(gamma_0+y))|^2:
(i). For rho = i gamma_0 + beta, -conj rho = i gamma_0 - beta and V(rho) conj V(-conj rho) = Phi(beta); the partner
gives Phi(-beta): (ii). (iii) is parity. (iv) is Taylor expansion, using d^2/dy^2 Phi(iy) = -Phi''(0). QED.

**Dictionary.** In the Rodgers-Tao normalisation the zeros x = 2 gamma of H_t obey dx_k/dt = 2 sum' 1/(x_k - x_j)
(CLASSICAL); for an isolated pair Delta(t)^2 = Delta(0)^2 + 8t, so the two-body collision time is
t_c = -Delta^2/8 = -eps^2/2 = -sigma/2. By (iv), on tests vanishing at the midpoint,

  Q(V) = R(V) + |t_c| |V'(i gamma_0)|^2 + O(eps^4),  R(V) = contribution of all other zeros (>= 0 under RH).

The form can become negative on such a test only for sigma < 0, and then needs (|sigma|/2)|V'|^2 > R(V). The quantity
called "one-sided Weil form deficit" in the task is taken here to be this coefficient sigma/2 = eps^2/2. It is listed
in the tables of section 3.1. The CSV correction to it is of relative size Delta^2 g ~ 1e-6 (columns agree to 5
digits). Over all one-sided tests there is no positive lower bound for R(V)/|V'(i gamma_0)|^2 that is uniform in the
pair (that would be a margin; eq48 shows none exists), so sigma/2 is the test-class-independent part of the margin.

## 6. What an extremal configuration looks like (MEASURED; the law in 6.2 is HEURISTIC + MEASURED)

**6.1 Local zero configuration.** Density of the other zeros at distance y (mean spacings) from the midpoint of a pair
with delta < 0.01, against the GUE profile for a degenerate pair, rho_c(y) = 1 - S(y)^2 - (3/pi^2) S'(y)^2,
S(y) = sin(pi y)/(pi y), which starts as pi^4 y^4 / 45. At 1e15 (10,926 pairs):

| y | 0-0.2 | 0.2-0.4 | 0.4-0.6 | 0.6-0.8 | 0.8-1.0 | 1.0-1.2 | 1.2-1.4 | 1.4-1.6 | 1.6-1.8 | 1.8-2.0 |
|---|---|---|---|---|---|---|---|---|---|---|
| observed | 0.0007 | 0.0167 | 0.0918 | 0.2819 | 0.5608 | 0.7777 | 0.9107 | 0.9475 | 0.9086 | 0.9040 |
| +- | 0.0004 | 0.0020 | 0.0046 | 0.0080 | 0.0113 | 0.0133 | 0.0144 | 0.0147 | 0.0144 | 0.0144 |
| GUE rho_c | 0.0007 | 0.0189 | 0.1071 | 0.3019 | 0.5655 | 0.8011 | 0.9287 | 0.9470 | 0.9206 | 0.9143 |

The pair sits in a hole: the mean adjacent gap is 1.39 on each side (1.39/1.39 at 1e12, 1.39/1.40 at 1e15, 1.39/1.39 at
1e18). Between the two zeros Z is a parabola: |Z*| / (|Z'(gamma_a)| eps/4) has median 1.00004.

**6.2 Prime phases: the n^2 law.** Let a_n = -Lambda(n)/(sqrt(n) L). Landau's theorem (CLASSICAL) gives the mean of
cos(gamma log n) over all zeros near height T: it is a_n.

HEURISTIC. The explicit formula gives the zero density rho(t) = rho_bar (1 + m(t)),
m(t) = -(2/L) sum_n Lambda(n) n^(-1/2) cos(t log n). If the zeros near t are a sine process of density rho(t), then an
n-cluster (n zeros inside a span x measured in mean spacings) occurs at rate proportional to rho(t)^(n^2), because
E_GUE(n; s) ~ s^(n^2). Hence, to first order in m,

  mean of cos(t log p^k) over n-clusters = n^2 a_{p^k},   mean of cos(t log(pq)) over pairs = 12 a_p a_q (second order).

MEASURED. Least-squares multiplier M in <cos(t log n)> = M a_n over the primes below 100 and n = 4, 8, 9, 25, 27, at the
midpoints of pairs with delta < 0.03 and at triples with span < 0.3 (at 1e15 the triple list holds the 5 smallest
per window for most windows, so it is weighted toward smaller spans):

| height | pairs (prediction 4) | triples (prediction 9) |
|---|---|---|
| 1e12 | 3.935 +- 0.035 (28,906 pairs) | 8.41 +- 0.16 (1,485 triples) |
| 1e15 | 3.914 +- 0.014 (292,723 pairs) | 8.48 +- 0.08 (8,284 triples) |
| 1e18 | 3.979 +- 0.033 (78,933 pairs) | 8.48 +- 0.14 (4,475 triples) |
| combined | 3.925 +- 0.012 | 8.47 +- 0.07 |

Per prime at 1e15 (error 0.06-0.08 each): p = 2: 3.73, 3: 3.89, 5: 3.84, 7: 3.91, 11: 3.91, 13: 3.94, 17: 3.93,
19: 3.80, 23: 4.12, 29: 3.92, 31: 3.95, 37: 3.96, 41: 3.83, 43: 4.08, 47: 3.85. The sine means are zero within error.

- The multiplier does not depend on the gap: at 1e15, 3.78 +- 0.21 (delta < 0.005), 3.95 +- 0.08 (0.005-0.01),
  3.95 +- 0.03 (0.01-0.02), 3.92 +- 0.02 (0.02-0.03).
- Second order: at 1e15, <cos(t log n)> for n = 6, 10, 15 is +0.0022, +0.0054, +0.0063 (each +- 0.0013), predicted
  12 a_p a_q = +0.0035, +0.0040, +0.0051. Sum: 0.0139 +- 0.0023 against 0.0126. For all zeros these means are 0
  (Lambda(6) = 0).
- The values are below n^2 by 1.9 +- 0.3 % (pairs) and 5.9 +- 0.7 % (triples). The rho^(n^2) model at second order
  gives a multiplier n^2 (1 - (n^2 - 1) s^2) with s^2 the variance of m: the two deficits are in the ratio
  3.1 +- 0.6, predicted 8/3. Fitted s^2 = 0.0072 +- 0.0012 at 1e15 from the pairs predicts 8.48 +- 0.09 for the
  triples; observed 8.48 +- 0.08. The fitted s^2 is smaller than the variance of m summed over all primes below 100
  (about 0.017), so the model is not exact at second order. OPEN: derive the law and its second-order term from the
  ratios conjecture.

**6.3 What the primes control and what they do not.** With P(t) = sum_{p < 100} cos(t log p)/sqrt(p):

| at pairs with delta < 0.03 | 1e12 | 1e15 | 1e18 |
|---|---|---|---|
| mean of P (4x-tilt prediction) | -0.509 (-0.523) | -0.402 (-0.412) | -0.337 (-0.340) |
| corr(log delta, P) | 0.007 | 0.002 | 0.006 |
| corr(log(\|Z'\|/delta), P) | 0.906 | 0.891 | 0.877 |
| slope of log(\|Z'\|/delta) against P | 0.76 | 0.80 | 0.83 |

The gap of a close pair is independent of the small primes. The curvature of Z at the pair (|Z'|/delta), hence the
depth |Z*| = |Z'| eps/4 of the near-violation in sup norm, follows exp(0.8 P): it is set by the truncated Euler
product. Close pairs occur at 4 times the Landau bias toward cos(t log p) < 0, where the zero density is high and
|zeta| is small.

**6.4 Largest gaps are the prime-driven extreme.** At gaps with delta > 3.4: <cos(t log 2)> = +0.75 (1e12), +0.61
(1e15), +0.47 (1e18); <cos(t log 3)> = +0.77, +0.65, +0.53. The local-GUE estimate (log-derivative of
rho exp(-pi^2 s^2 rho^2/8), about -30) gives +0.42 at 1e15 for p = 2; the observed tilt is stronger. The composite
means factor: at 1e15 <cos(t log 6)> = 0.386 against the product 0.613 * 0.653 = 0.400. The largest gaps sit at the
largest values of |Z| (section 3.2).

## 7. DH control

- The scan contains no arithmetic input. Its only RH-relevant output is the pair (count check, number of same-sign
  local extrema of Z). For zeta: 0 same-sign extrema in 1.38e10 zeros and count discrepancies within [-2.0, 2.4]
  (MEASURED, double precision; not a rigorous verification of RH in these windows).
- The same diagnostic on the Davenport-Heilbronn function (`code/dh_control.py`, mpmath, 25 digits): the Hardy-type
  function Z_DH has sign changes at t = 80.3, 81.9, 83.1, 87.6, 89.4, 90.7 and a same-sign local extremum
  Z_DH = -0.3566 at t = 85.7072, at the known off-line zero 0.808517 + 85.699348 i. In the language of Lemma W this is
  a pair with sigma = -4 beta^2 = -0.381. The diagnostic fires for DH at its first off-line zero and never for zeta in
  the scanned windows.
- Where the Euler product is used in this note: only in the prediction of section 6.2. The first-order tilt is
  supported on prime powers with weights Lambda(n)/sqrt(n) >= 0, and the composite frequencies n = 6, 10, 15 respond
  only at second order with the product weights 12 a_p a_q. For DH the coefficients of -f'/f are not supported on
  prime powers, so the corresponding first-order response at composite n would be non-zero. This is a fingerprint of
  the Euler product in the statistics of the extremes; it is not a positivity statement and cannot exclude off-line
  zeros.
- Nothing in sections 3-6 distinguishes "RH true" from "RH false at a height not scanned". Every statement passes the
  flow-blindness and verified-height walls trivially because none is used as a hypothesis.

## 8. What this says for the proof attempts

1. **No margin, with a rate.** The pair coefficient of the one-sided Weil form (Lemma W) reaches 1.9e-9 within 1e9
   zeros at 1e12 and follows min ~ (2 pi^2/L^2)(9 E/(pi^2 N))^(2/3). Any inequality in the residual-energy / Pick /
   Weil lane that would give a margin uniform in height contradicts this (consistent with eq48 and Lambda >= 0).
   Every valid argument has to be exactly tight at a double zero.
2. **No arithmetic precursor of a near-collision.** Conditioned on a close pair, the small-prime phases have the base
   law tilted by rho(t)^4, a bounded density. The tilt is the same at delta < 0.005 as at delta ~ 0.03, and the gap
   is uncorrelated with the prime sum. No prime-phase configuration is excluded at a near-collision. An argument that
   excludes collisions by showing that some configuration of small primes cannot occur has no support in the data.
3. **Where the Euler product does act.** It sets the local density (rate of close pairs, exponent n^2), the scale of
   Z at the pair (slope 0.8 in log scale against P), and it dominates the opposite extreme (largest gaps, largest
   |Z|). The near-collisions themselves are local sine-process events with the degenerate-pair profile rho_c.
4. **For the Pick / residual lane.** A test that resolves a pair must vanish at its midpoint and be small on the
   neighbours, whose density follows rho_c(y) ~ pi^4 y^4/45 near the pair and is back to about 0.93 at y ~ 1.3. With nodes at
   distance >= 1/2 from the line (2.1 to 3.2 mean spacings at these heights) this is a super-resolution problem, in
   line with the euler/ note that finite Pick orders are Euler-blind.
5. This avenue gives no lever toward RH. It quantifies the absence of slack.

## 9. Three weakest steps

1. **Double precision, no rigorous error control on the scan.** Zero counts, gap statistics and all of sections 4 and
   6 are MEASURED. Completeness rests on the count check (a missed pair shifts a window by -2; contiguous sums are
   -0.72 and -0.45) and on the tolerance rule that replaced a first version which missed 14 zeros in 8.4e6. A missed
   pair cancelled by a spurious pair in the same window would not be seen. Only the top pairs are CERTIFIED, and
   only as two sign changes; the 1e18 run is not contiguous, and at 1e18 only the first five entries of the table
   were run through Arb.
2. **The n^2 law is a heuristic with one fitted parameter at second order.** The first-order multipliers are
   3.925 +- 0.012 and 8.47 +- 0.07, not 4 and 9. The second-order explanation fits both with one variance
   s^2 = 0.0072, but that value is below the naive variance of the density modulation, so the model is incomplete. No
   derivation from the ratios conjecture was attempted. The big-gap tilt is stronger than the local-GUE estimate and
   is not explained.
3. **Windows, not initial segments; "deficit" is a definition.** The extremes are those of short windows (length
   2.4e8, 1.9e9, 5.3e8) at three heights, not of all zeros to height T; heights above 1.8e19 were not reached (the
   phase table needs 16 bytes per n <= sqrt(T/2 pi); 1e20 needs a wheel-compressed table or on-the-fly logarithms).
   The identification of the task's "one-sided Weil form deficit" with eps^2/2 is the choice made in section 5; the
   CSV values use a non-rigorous neighbour sum and are superseded by Rodgers-Tao. Literature values in 4.3 are quoted
   from memory.

## 10. Files

- `code/prep.py` (phase tables), `code/engine.py` (window engine), `code/scan.py` (production scan),
  `code/aggregate.py`, `code/polish.py` (direct-sum refinement), `code/certify.py` (Arb), `code/analyze.py`,
  `code/extra.py`, `code/tables.py`, `code/validate.py` (Odlyzko check), `code/diag.py`, `code/dh_control.py`.
- `data/agg{12,15,18}_compact.npz` (histograms of gaps with bin 0.002, all pairs with delta < 0.03 without the
  neighbour columns, triples, big gaps, per-window counts), `data/pol*.npy`, `data/cert*.json`,
  `data/run{12,15,18}_report.txt`, `data/run*_analysis.json`, `data/extra*.txt`.
- Full per-window outputs and the neighbour lists (40 zeros on each side of every pair with delta < 0.03) are on the
  motherbox in `~/rh-push/b-lehmer-lower/` (`run12/`, `run15/`, `run18/`, `agg*.npz`).
- Reproduce one window (python-flint, mpmath, numpy, scipy, numba, finufft):
  `mkdir u15; python code/prep.py 13000000 u15; python code/scan.py u15 1e15 25 1 1 0 out` (about 40 s).
