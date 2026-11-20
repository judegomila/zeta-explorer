# REFEREE: b-lehmer-lower

Adversarial referee pass, 2026-11-16. Scope: `RESULT.md`, `code/`, `data/` in this directory. Referee scripts were run
in a scratch directory outside the repo (`/tmp/ref-blehmer/`); nothing else in the repo was written.

## Verdict

**holds = true, as a partial result with no theorem about zeta.** The one PROVED item (Lemma W and the collision-time
dictionary) is correct. The Arb certificates are interval-rigorous and reproduce. The measured statistics reproduce
from the stored data. The scanner reproduces locally at small scale and at a height the author did not use.

Four statements are stronger than what the code and data support (section 3). None of them changes the verdict
"partial-result, no lever toward RH". Suggested strength relative to the claim as worded: 0.8.

## 1. PROVED step, re-derived

**Lemma W.** Re-derived by hand.
- V has poles at -x_j with Re x_j > 1/2, so V is holomorphic on Re z > -1/2 and V#(z) = conj V(-conj z) on Re z < 1/2.
  Phi(u) = V(i g0 + u) V#(i g0 + u) is holomorphic on |Re u| < 1/2 (wider than the disc stated).
- (i) on the line -conj(rho) = rho, so the term is |V(rho)|^2 = Phi(+-i eps/2). Correct.
- (ii) rho = i g0 + beta, partner -conj rho = i g0 - beta; Phi(-beta) = conj Phi(beta), sum = 2 Re Phi(beta). Correct.
- (iii) parity. Correct. sigma = eps^2 and sigma = -4 beta^2 both give u^2 = -sigma/4.
- (iv) q = 2 Phi(0) + y^2 d^2/dy^2 Phi(iy) + O(y^4) at y = eps/2. With V(i g0) = 0: d^2/dy^2 |V|^2 = 2 |V'|^2, so
  q = (sigma/2)|V'(i g0)|^2 + O(sigma^2). Direct check off the line: V(rho) ~ beta V', V(-conj rho) ~ -beta V',
  2 Re(beta V' conj(-beta V')) = -2 beta^2 |V'|^2 = (sigma/2)|V'|^2. Correct.
- Numerical check (mpmath, 40 digits, random 4-pole V with Re x_j in (0.55, 2.5), at g0 = 7005.08 and g0 = 1e12 + 0.25,
  eps = 1e-1, 1e-2, 1e-3, both on-line and off-line with beta = eps/2): the pair sum equals Phi(u) + Phi(-u) to working
  precision; (q - prediction)/eps^4 converges to a constant (0.0297018, 0.0181116, 0.00236334, -0.000266664) and has the
  same value for the on-line and off-line branch, as analyticity in sigma requires; with V(i g0) = 0 the ratio
  q / ((sigma/2)|V'|^2) is 1 + 7.4e-8 at eps = 1e-3.
- Convention matches eq48/RESULT.md line 72 and 120 (`Q_L(v) = sum_rho V(rho) conj V(-conj rho)`).

**Dictionary.** dx_k/dt = 2 sum' 1/(x_k - x_j) gives d(Delta)/dt = 4/Delta, Delta^2 = Delta_0^2 + 8t, t_c = -Delta^2/8
= -eps^2/2 with Delta = 2 eps. Correct. The table columns were recomputed: eps^2/2 and delta = gap * L/(2 pi) agree
with the gaps to the digits shown at all three heights.

No step assumes RH: (i) is a statement about a hypothetical on-line pair, and "R(V) >= 0 under RH" is labelled.

## 2. Reruns (different cases)

**Arb certificates.** `certify.py` decides signs with python-flint `arb > 0` / `arb < 0`, which return True only when
the whole ball is on one side; inputs `arb(int) + arb(float)` are exact dyadics at 220 bits. No float comparison
decides a sign. 10 + 12 + 5 = 27 records, all `certified: true`.
Independent rerun at 160 bits with brackets 5 to 10 times tighter than the author's (w = 1e-4 * gap, 2e-4 at 1e18):

| height | pairs re-certified | result |
|---|---|---|
| 1e12 | #1, #5, #7, #10 (w = 1e-3 and 1e-4) | all four sign patterns certified; a 41-point certified sign scan over [ra - 3 gap, rb + 3 gap] shows exactly 2 sign changes each |
| 1e15 | #1, #3 (w = 1e-4) | certified |
| 1e18 | #4, T1 = 1000000000510317381 (w = 2e-4, 459 s) | certified |

So the quoted 4-digit delta values of these pairs are inside certified intervals of relative half-width 2e-4 to 4e-4.

**Scanner, small scale, local.** `prep.py` + `engine.py` rerun on the Mac (numba, finufft), 2^17-point windows:
- 1e12, window centred on pair #7: 32,519 zeros, 0 unresolved, min gap delta 0.0016232 at tau = -0.25112 (table: 0.0016232);
  Arb certifies strictly alternating signs at the 399 midpoints between 400 consecutive scanner zeros.
- 1e12, window centred on pair #1: min gap 0.0002522 at tau = 0.253382 (table: 0.0002522).
- 3e10 (a height the author did not use): 32,518 zeros, count discrepancy 0.000; Arb alternation at 399 midpoints; a
  dense Arb sign scan (20 points per mean spacing) across 300 scanner zeros finds exactly 300 certified sign changes;
  `mpmath.nzeros` gives a difference of exactly 1000 between the midpoints after scanner zeros #1000 and #2000.

**Count check, re-analysed from `data/agg*_compact.npz`.** Reported sums, ranges and sd reproduce (-0.719 / [-2.002, 2.388]
/ 0.708 at 1e15; -0.448 / [-1.420, 1.561] at 1e12; mean 0.0074, [-1.668, 2.332], sd 0.761 at 1e18). Histogram totals
equal N in all three runs. Stronger than the author's argument: for the contiguous runs the cumulative discrepancy is
S(b_j) - S(a_0) and must be stationary; a net missing pair is a permanent step of -2. Cumulative paths: 1e15 in
[-2.05, 0.90], sd 0.499, best change-point step -0.17; 1e12 in [-1.18, 1.27], step 0.22; 1e18 has two contiguous runs
(146 and 173 windows), steps 0.17 and -0.49. Lag-1 autocorrelation of the discrepancies is -0.53, -0.37, -0.60/-0.58
(-0.5 expected for differences of independent S values). No step of size 2 is present.

**Statistics, recomputed with independent code** (phases T0 log n mod 2 pi at 50 digits):

| quantity | RESULT.md | referee |
|---|---|---|
| pair multiplier 1e12 / 1e15 / 1e18 | 3.935 / 3.914 / 3.979 | 3.935 +- 0.033 / 3.914 +- 0.013 / 3.979 +- 0.032 |
| triple multiplier (span < 0.3) | 8.41 / 8.48 / 8.48 | 8.413 / 8.478 / 8.482 |
| control: uniform random t in the same windows | not run | 0.03 +- 0.04 / 0.01 +- 0.01 / -0.03 +- 0.03 |
| 1e15 by gap class | 3.78, 3.95, 3.95, 3.92 | 3.79 +- 0.19, 3.93 +- 0.07, 3.93 +- 0.03, 3.91 +- 0.02 |
| composites 6, 10, 15 at 1e15 | 0.0022, 0.0054, 0.0063 | same; 12 a_p a_q = 0.0035, 0.0040, 0.0051 |
| small-gap ratio at delta < 0.03 | 0.9705 / 0.9829 / 0.9846 | same |
| N c_T (pi^2/9) delta_1^3 | 0.017 / 0.705 / 0.92 | 0.0172 / 0.705 / 0.920 |
| GUE triple counts | 1838.6 / 743.3 / 4948.8 | 1838.6 / 743.2 / 4948.8 (direct R3 integral) |
| median-E margin formula | 2.22e-8 / 2.95e-9 / 4.81e-9 | 2.218e-8 / 2.951e-9 / 4.807e-9 |

The heuristic algebra was re-derived: first order n^2 a_n; second order 12 a_p a_q for pairs (6 = C(4,2) times
2 a_p a_q); Wick correction n^2 (1 - (n^2 - 1) s^2); CUE triple factor (1 - 1/N^2)^2 (1 - 4/N^2); rho_c(y) expands to
pi^4 y^4 / 45. All correct as stated.

**DH control, different cases.** The functional equation of the DH completed function holds to 5e-26. At the next three
off-line zeros (0.6508301 + 114.1633427i, 0.5743561 + 166.4793059i, 0.7242577 + 176.7024612i) the Hardy-type function
has a same-sign local extremum (-0.0959, +0.0287, +0.2283), sigma = -0.091, -0.022, -0.201. Same diagnostic on zeta at
Lehmer's pair near 7005: two sign changes, no same-sign extremum. The log-coefficient of DH at n = 6 is
a_6 - a_2 a_3 = 1.0807, non-zero, as the note asserts (the corresponding statistic was not measured by the author).

## 3. Errors and overstatements

1. **"No same-sign local extremum of Z was found" is not what the scanner tests.** In `engine.find_zeros` a grid
   interval with same-sign endpoints is skipped when the Hermite cubic stays clear of zero by
   eps = 0.02(|za|+|zb|+|da|+|db|) + 0.03. A same-sign extremum with |Z| above about 0.03 to 0.07 is passed silently
   and is not written to `unres`. Called on synthetic data, `cubic_minabs_monotone` passes extrema of size 0.3566,
   0.0959 and 0.05 silently and sends 0.02 to subdivision. "0 unresolved" therefore covers only extrema with |Z| below
   the tolerance. Larger ones are covered only by the count check (the Riemann-von Mangoldt count includes off-line
   zeros, so such an extremum gives -2). The section 7 sentence "the diagnostic fires for DH and never for zeta" compares
   two different diagnostics: `dh_control.py` is a grid search in mpmath, and three of the four DH extrema checked
   here are of a size the production scanner would not record. The conclusion survives through the count check
   (section 2: no step of -2 in any contiguous run), not through the `unres` list.
2. **"The contiguous sums rule out a net loss" is too strong as argued.** A sum of -0.72 is compatible with one missing
   pair if S(end) - S(start) = +1.28 (1.8 sd); the likelihood ratio against zero missing pairs is about 0.33, not
   negligible. The cumulative-path analysis in section 2 closes this for all but the last few windows of each run.
   The 1e18 run has four isolated windows where only the single-window value is available.
3. **Noise floor of the scan is not stated.** The scan's own delta for the closest pair differs from the polished
   value by 2 % at 1e15 (0.0003939 against 0.0004021) and by 5 % at 1e12 (0.0002658 against 0.0002522), i.e. an
   absolute error of about 6e-9 to 7e-9 in Z. An extremum with |Z| below about 1e-8 cannot be classified as pair or
   non-crossing by the scan alone. The certified pairs are classified by Arb; the remaining entries are not.
4. **The claim summary places "observed minima 1.9e-9, 3.0e-9, 5.8e-9, scaling N^(-2/3)" in the PROVED sentence.**
   Only Lemma W is proved. The exponent is the GUE prediction; the supporting data are the running record at 1e15
   (0.00349 at 1.7e7 to 0.00039 at 1.0e10 zeros, slope -0.34 in delta). The three quoted minima do not show the
   scaling: they come from different heights and N, and the 1e12 value is a 1.7 % lower-tail event.
5. **"The table of closest pairs is the table of smallest one-sided Weil-form margins" is not established.** eps^2/2
   is the coefficient of |V'(i g0)|^2 on the codimension-one class V(i g0) = 0. R(V) is not bounded relative to it,
   and by eq48 the infimum of the normalised form is 0 regardless. "The form can become negative on such a test only
   for sigma < 0" additionally requires all other zeros on the line. Correct wording: pair coefficient, not margin.
   RESULT.md section 9 item 3 concedes this; the verdict paragraph and section 8 item 1 do not.
6. **Scope of CERTIFIED.** Arb certifies two sign changes at the stated distance. It does not certify that the pair
   is the closest in the window, that the two zeros are consecutive, or the neighbour sum g. What is certified is an
   upper bound on the minimal gap in each window. The 1e12 window lies below the Platt-Trudgian verified height
   (3e12), so its on-line statement carries no information beyond the verified height.
7. **Validation table.** The 1e18 maximum of |Z_arb - Z_double| over the five certificates is 2.24e-12, not 1.2e-12
   (the stated value is the first certificate only); at 1e12 it is 4.1e-11 and is not listed. The Odlyzko check is on
   zeros number 1e12+1 to 1e12+1e4 at height 2.68e11, not at t = 1e12.
8. **Fit quality stated more favourably than the data.** The pair multiplier is 6 sd below 4 (stated). The triple
   ratios are below the CUE factor at all three heights (0.808/0.837, 0.883/0.897, 0.904/0.929; combined about
   2.6 sd). The neighbour profile is below rho_c by 3.3 sd at y in (0.4, 0.6) and 2.5 sd at (0.6, 0.8); "is the GUE
   degenerate-pair profile" should read "follows it within about 15 %". The 1e15 triple multiplier 8.48 is from an
   incomplete list; on the complete list (span < 0.2, 656 triples) it is 8.72 +- 0.26.

## 4. Walls

- DH: the scan and Lemma W use no arithmetic; Lemma W holds verbatim for DH with sigma < 0 pairs present. The only
  Euler-product statement is the heuristic of section 6.2. Consistent with the note.
- RH is not assumed in any step. No bound on Lambda and no zero-free statement is claimed.
- Verified height: the 1e15 and 1e18 windows are above it, but the scan is double precision and the note does not
  claim verification. See item 6 for 1e12.
- Literature values in 4.3 (-4.379e-6, -2.7e-9, -1.15e-11) agree with the referee's recollection and are consistent
  in convention with -Delta^2/8; not re-derived.

## 5. Surviving claim

No theorem about zeta. MEASURED: 1,006,602,771 / 10,065,980,192 / 2,709,425,640 zeros of Z located in windows at 1e12 /
1e15 / 1e18; Riemann-von Mangoldt count discrepancies within [-2.0, 2.4] with no step of -2 in any contiguous run; no
unresolved extremum below the scanner tolerance (about 0.03 in |Z|). CERTIFIED: 27 pairs of sign changes, smallest
normalised distances 0.0002522, 0.0004021, 0.0006792 (upper bounds on the minimal gap in each window). PROVED: Lemma W
(pair coefficient (sigma/2)|V'|^2 on tests vanishing at the midpoint, analytic through sigma = 0) and its equality with
the two-body collision time. MEASURED + HEURISTIC: N^(-1/3) scaling of the minimal delta in the 1e15 running record;
prime-phase multipliers 3.925 +- 0.012 (pairs) and 8.47 +- 0.07 (triples), no dependence on gap size within errors,
zero for uniform random points; small-gap count ratio 0.9829 +- 0.0018 against 0.9823 at 1e15. No lever toward RH.
