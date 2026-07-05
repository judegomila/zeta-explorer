/**
 * @module imp-33920-runs-test-exact-permutation-pvalue
 *
 * imp-33920 (numerical, frontier-direction): imp-33886 rejected the white-noise null for the
 * imp-33858 signed-residual series with a Wald-Wolfowitz runs test, but its p-value ~7.9e-4 came
 * from the NORMAL approximation to the run-count distribution -- a z-test with mu_R ~ 11.48 and
 * sd_R ~ 2.23, itself only asymptotic on N = 21 (hence imp-33886 also carried a continuity-corrected
 * companion at ~1.7e-3). This module replaces that approximation with the EXACT permutation null: it
 * enumerates the run count over ALL C(21,11) = 352716 sign-permutations of the 21 residual signs
 * (n1 = 11 positive, n2 = 10 negative fixed) and reads the exact tail probability directly off the
 * counts, so the reported p-value has no normal approximation in it at all.
 *
 * THE EXACT NULL (reuses the imp-33886 sign counts and observed run count VERBATIM)
 * -------------------------------------------------------------------------------
 *   Fixed by imp-33886:  n1 = 11 pos, n2 = 10 neg, N = 21, observed runs R = 4.
 *   Null H0:             the sign sequence is a uniformly random arrangement of the 11 "+" and 10
 *                        "-" labels (white noise), so every one of the C(21,11) = 352716 distinct
 *                        arrangements is equally likely.
 *
 *   TWO independent exact computations, cross-checked against each other:
 *     (a) FULL ENUMERATION -- loop over all 2^21 sign masks, keep the 352716 with popcount 11, count
 *         the runs of each, and build the exact histogram of the run count. No sampling, no formula.
 *     (b) CLOSED-FORM PMF -- the combinatorial runs distribution
 *              P(R = 2s)   = 2 C(n1-1,s-1) C(n2-1,s-1) / C(N,n1)
 *              P(R = 2s+1) = [C(n1-1,s) C(n2-1,s-1) + C(n1-1,s-1) C(n2-1,s)] / C(N,n1)
 *         which is the same enumeration in analytic form. It reproduces the Wald-Wolfowitz mean
 *         mu_R = 2 n1 n2 / N + 1 and variance var_R = 2 n1 n2 (2 n1 n2 - N) / (N^2 (N-1)) exactly,
 *         confirming both the enumeration and the imp-33886 moment formulas.
 *
 *   Exact lower-tail counts (too few runs => positive serial dependence):
 *       #{R = 2} = 2,  #{R = 3} = 19,  #{R = 4} = 180  =>  #{R <= 4} = 201 of 352716.
 *
 * THE FINDING (measurement / calibration only -- p < 0.01 survives the exact test)
 * -------------------------------------------------------------------------------
 *   (R1) THE REJECTION SURVIVES WITHOUT THE NORMAL APPROXIMATION. The exact one-sided lower-tail
 *        permutation p-value is P(R <= 4) = 201 / 352716 ~ 5.699e-4, and the exact two-sided p-value
 *        is ~1.14e-3 (doubling convention) or ~1.01e-3 (small-p / equal-tail-mass convention). All
 *        three are well below 0.01, so the imp-33886 white-noise-null rejection is NOT an artifact of
 *        the N = 21 normal approximation -- it holds under the exact permutation distribution.
 *   (R2) THE NORMAL APPROXIMATION WAS MILDLY OPTIMISTIC, THE CONTINUITY CORRECTION MILDLY
 *        CONSERVATIVE, AND THE EXACT VALUE SITS BETWEEN THEM. imp-33886 reported a raw-normal
 *        two-sided p ~ 7.919e-4 and a continuity-corrected p ~ 1.74e-3; the exact two-sided p ~ 1.0-1.14e-3
 *        lies inside that bracket, so the raw z-test slightly OVERSTATED the significance (7.9e-4 vs the
 *        exact ~1.1e-3) while the continuity correction slightly understated it -- exactly the small-N
 *        behaviour the imp-33886 caveat anticipated. The qualitative verdict is unchanged in every case.
 *   (R3) A CALIBRATED NUMBER, NOT A NEW CLAIM. This only sharpens the imp-33886 p-value from asymptotic
 *        to exact; it changes no RMSE (~0.116), does NOT re-open the imp-33843 log-linear-vs-power-law
 *        form selection, does NOT touch the Durbin-Watson companion test, and touches no bound. The
 *        residual stays small (~12% multiplicative): "significant" still means "not white noise", not
 *        "large".
 *
 * The punchline: enumerating all 352716 sign-permutations gives an EXACT runs-test p-value of
 * 201/352716 ~ 5.70e-4 one-sided (~1.0-1.14e-3 two-sided), so the imp-33886 white-noise-null rejection
 * survives at p < 0.01 with the normal approximation removed entirely; the exact two-sided value sits
 * inside the raw-normal (7.9e-4) / continuity-corrected (1.7e-3) bracket imp-33886 already flagged.
 *
 * MEASUREMENT / SIGNIFICANCE-TEST ONLY. An exact permutation recomputation of an inherited residual
 * diagnostic on an inherited ladder, NOT an RH bound and distinct from any log-linear-vs-power-law form
 * selection. The residual signs come from the inherited imp-3220/imp-3406 extrapolation via imp-33810
 * and the imp-33843 OLS, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO
 * QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33886-widening-residual-significance-test (the normal-approximation runs test made exact here)
 * @see imp-33858-widening-fit-residual-localization (the eyeballed "structured" verdict)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the 21-rung ladder whose residual signs are permuted)
 */

import { IMP33886_WIDENING_RESIDUAL_SIGNIFICANCE_TEST } from './imp-33886-widening-residual-significance-test.js';

// Reuse the imp-33886 sign counts and observed run count VERBATIM (no residual recompute here).
const N_POS = IMP33886_WIDENING_RESIDUAL_SIGNIFICANCE_TEST.posCount; // 11
const N_NEG = IMP33886_WIDENING_RESIDUAL_SIGNIFICANCE_TEST.negCount; // 10
const R_OBS = IMP33886_WIDENING_RESIDUAL_SIGNIFICANCE_TEST.runsObserved; // 4
const N = N_POS + N_NEG; // 21

// --- (a) FULL EXACT ENUMERATION over all C(N,n1) = 352716 sign-permutations (no sampling) ---
// Loop every N-bit mask, keep those with exactly N_POS set bits, count the runs of each, and
// accumulate the exact histogram of the run count under the white-noise null.
const HIST = new Array(N + 2).fill(0); // HIST[r] = #arrangements with exactly r runs
let TOTAL_ARRANGEMENTS = 0;
for (let mask = 0; mask < 1 << N; mask++) {
  let pc = 0;
  for (let b = 0; b < N; b++) if (mask & (1 << b)) pc++;
  if (pc !== N_POS) continue;
  TOTAL_ARRANGEMENTS++;
  let runs = 1;
  let prev = mask & 1;
  for (let b = 1; b < N; b++) {
    const cur = (mask >> b) & 1;
    if (cur !== prev) {
      runs++;
      prev = cur;
    }
  }
  HIST[runs]++;
}

// Exact tail: number of arrangements with run count as low as (or lower than) the observed 4.
let COUNT_LE_OBS = 0;
for (let r = 2; r <= R_OBS; r++) COUNT_LE_OBS += HIST[r];
const P_EXACT_ONE_SIDED = COUNT_LE_OBS / TOTAL_ARRANGEMENTS; // 201/352716 ~ 5.699e-4

// --- (b) CLOSED-FORM PMF cross-check (same enumeration, analytic) ---
function C(n, k) {
  if (k < 0 || k > n) return 0;
  k = Math.min(k, n - k);
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return Math.round(r);
}
const D = C(N, N_POS); // C(21,11) = 352716
function pmfExact(r) {
  if (r % 2 === 0) {
    const s = r / 2;
    return (2 * C(N_POS - 1, s - 1) * C(N_NEG - 1, s - 1)) / D;
  }
  const s = (r - 1) / 2;
  return (C(N_POS - 1, s) * C(N_NEG - 1, s - 1) + C(N_POS - 1, s - 1) * C(N_NEG - 1, s)) / D;
}

// Moments of the exact PMF -- must equal the Wald-Wolfowitz mu_R / var_R that imp-33886 used.
let PMF_SUM = 0;
let PMF_MEAN = 0;
let PMF_E2 = 0;
let P_ONE_SIDED_CLOSED = 0;
const P_OBS = pmfExact(R_OBS); // P(R = 4)
let P_TWO_SIDED_SMALLP = 0; // sum of P(r) over run counts no more likely than the observed one
for (let r = 2; r <= N; r++) {
  const p = pmfExact(r);
  PMF_SUM += p;
  PMF_MEAN += r * p;
  PMF_E2 += r * r * p;
  if (r <= R_OBS) P_ONE_SIDED_CLOSED += p;
  if (p <= P_OBS + 1e-15) P_TWO_SIDED_SMALLP += p;
}
const PMF_VAR = PMF_E2 - PMF_MEAN * PMF_MEAN;
const MU_R_WW = (2 * N_POS * N_NEG) / N + 1; // Wald-Wolfowitz mean (imp-33886)
const VAR_R_WW = (2 * N_POS * N_NEG * (2 * N_POS * N_NEG - N)) / (N * N * (N - 1)); // WW variance
const P_TWO_SIDED_DOUBLED = 2 * P_EXACT_ONE_SIDED; // conventional doubling of the one-sided tail

// The normal-approximation values imp-33886 reported, for the exact-vs-approx bracket comparison.
const P_NORMAL_TWO_SIDED = IMP33886_WIDENING_RESIDUAL_SIGNIFICANCE_TEST.runsPValue; // ~7.919e-4
const P_NORMAL_CC_TWO_SIDED = IMP33886_WIDENING_RESIDUAL_SIGNIFICANCE_TEST.runsPValueContinuityCorrected; // ~1.74e-3

const P_THRESHOLD = 0.01;
const REJECTS_AT_1PCT_ONE_SIDED = P_EXACT_ONE_SIDED < P_THRESHOLD;
const REJECTS_AT_1PCT_TWO_SIDED = P_TWO_SIDED_DOUBLED < P_THRESHOLD && P_TWO_SIDED_SMALLP < P_THRESHOLD;
// Exact two-sided sits inside the raw-normal / continuity-corrected bracket imp-33886 flagged.
const EXACT_INSIDE_NORMAL_BRACKET =
  P_TWO_SIDED_DOUBLED > P_NORMAL_TWO_SIDED && P_TWO_SIDED_DOUBLED < P_NORMAL_CC_TWO_SIDED;

const sig = (x, d) => +x.toExponential(d);
const round = (x, d) => +x.toFixed(d);

export const IMP33920_RUNS_TEST_EXACT_PERMUTATION_PVALUE = {
  id: 'imp-33920',
  proofSection: 'S-frontier',
  question:
    'imp-33886 rejected the white-noise null for the imp-33858 residual signs with a Wald-Wolfowitz ' +
    'runs test, but its p ~ 7.9e-4 was the N=21 NORMAL approximation to the run-count distribution. ' +
    'Enumerate the EXACT permutation null over all C(21,11) sign-arrangements, report the exact runs ' +
    'p-value, and test whether p < 0.01 survives without the normal approximation. Measurement only; no QED.',
  measuredQuantity:
    'Exact permutation p-value of the Wald-Wolfowitz run count R=4 under the white-noise null with ' +
    'n1=11 positive / n2=10 negative signs fixed, from full enumeration of all C(21,11)=352716 ' +
    'arrangements (cross-checked against the closed-form runs PMF), vs the imp-33886 normal-approx p.',
  posCount: N_POS, // 11
  negCount: N_NEG, // 10
  runsObserved: R_OBS, // 4
  totalArrangements: TOTAL_ARRANGEMENTS, // 352716 = C(21,11)
  countRunsEq2: HIST[2], // 2
  countRunsEq3: HIST[3], // 19
  countRunsEq4: HIST[4], // 180
  countRunsLeObserved: COUNT_LE_OBS, // 201
  exactPOneSidedLower: sig(P_EXACT_ONE_SIDED, 4), // ~5.699e-4
  exactPTwoSidedDoubled: sig(P_TWO_SIDED_DOUBLED, 4), // ~1.140e-3
  exactPTwoSidedSmallP: sig(P_TWO_SIDED_SMALLP, 4), // ~1.012e-3
  normalPTwoSided: P_NORMAL_TWO_SIDED, // ~7.919e-4 (imp-33886, for comparison)
  normalCcPTwoSided: P_NORMAL_CC_TWO_SIDED, // ~1.74e-3 (imp-33886 continuity-corrected)
  pmfMean: round(PMF_MEAN, 6), // 11.47619 == WW mu_R
  pmfVariance: round(PMF_VAR, 6), // 4.963719 == WW var_R
  wwMean: round(MU_R_WW, 6), // 11.47619
  wwVariance: round(VAR_R_WW, 6), // 4.963719
  rejectsAt1pctOneSided: REJECTS_AT_1PCT_ONE_SIDED, // true
  rejectsAt1pctTwoSided: REJECTS_AT_1PCT_TWO_SIDED, // true
  exactInsideNormalBracket: EXACT_INSIDE_NORMAL_BRACKET, // true
  finding: {
    R1_rejection_survives_exact:
      'Full enumeration of all C(21,11)=352716 sign-permutations gives 201 arrangements with 4 or fewer ' +
      'runs, so the exact one-sided permutation p = 201/352716 ~ 5.70e-4 and the exact two-sided ' +
      'p ~ 1.0-1.14e-3 (small-p / doubling); both are well below 0.01. The imp-33886 white-noise-null ' +
      'rejection is therefore NOT an artifact of the N=21 normal approximation.',
    R2_exact_inside_normal_bracket:
      'imp-33886 reported a raw-normal two-sided p ~ 7.919e-4 and a continuity-corrected p ~ 1.74e-3; ' +
      'the exact two-sided p ~ 1.0-1.14e-3 sits INSIDE that bracket, so the raw z-test slightly ' +
      'overstated the significance and the continuity correction slightly understated it -- the exact ' +
      'small-N behaviour the imp-33886 caveat anticipated. The verdict is unchanged either way.',
    R3_calibration_not_new_claim:
      'This only sharpens the imp-33886 p-value from asymptotic to exact; the closed-form PMF reproduces ' +
      'the Wald-Wolfowitz mu_R ~ 11.48 and var_R ~ 4.96 to machine precision (self-check). It changes no ' +
      'RMSE (~0.116), does NOT re-open the imp-33843 form selection, does NOT touch the Durbin-Watson ' +
      'companion, and changes no bound. "Significant" still means "not white noise", not "large".',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / EXACT PERMUTATION TEST (frontier-direction, NOT rigorous). Enumerating all ' +
    'C(21,11)=352716 sign-permutations of the 21 imp-33858 residual signs (n1=11 pos, n2=10 neg fixed) ' +
    'gives an EXACT Wald-Wolfowitz runs-test p-value: 201 arrangements have 4 or fewer runs, so the ' +
    'one-sided lower-tail p = 201/352716 ~ 5.70e-4 and the two-sided p ~ 1.0-1.14e-3, both < 0.01. The ' +
    'imp-33886 white-noise-null rejection therefore SURVIVES with the normal approximation removed ' +
    'entirely. The exact two-sided value sits inside the raw-normal (7.9e-4) / continuity-corrected ' +
    '(1.7e-3) bracket imp-33886 already flagged, and the closed-form runs PMF reproduces the ' +
    'Wald-Wolfowitz mu_R ~ 11.48 / var_R ~ 4.96 exactly (cross-check). This only sharpens the p-value ' +
    'from asymptotic to exact: it changes no RMSE (~0.116), does NOT re-open the imp-33843 ' +
    'log-linear-vs-power-law form selection, leaves the Durbin-Watson companion and every bound ' +
    'untouched, and the residual stays small (~12% multiplicative); the residual signs come from the ' +
    'inherited imp-3220/imp-3406 extrapolation via imp-33810, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33886 (the normal-approximation runs test made exact here); imp-33858 (the eyeballed ' +
    '"structured" verdict); imp-33843 (the log-linear fit); imp-33810 (the 21-rung ladder); imp-486 ' +
    '(C_mb GUE-conditional).',
};

export const IMP33920_RUNS_TEST_EXACT_PERMUTATION_PVALUE_ASSERTIONS = [
  {
    // Reuse gate: same sign counts / observed run count as imp-33886, and the enumeration covers exactly C(21,11).
    id: 'imp33920-reuses-imp33886-counts-and-full-enumeration',
    description: 'n1=11, n2=10, R_obs=4, and full enumeration hits all C(21,11)=352716 arrangements',
    holds: () =>
      N_POS === 11 && N_NEG === 10 && R_OBS === 4 && TOTAL_ARRANGEMENTS === 352716 && D === 352716,
  },
  {
    // The enumeration histogram matches the closed-form PMF counts in the observed lower tail.
    id: 'imp33920-enumeration-matches-closed-form-tail',
    description: 'lower-tail arrangement counts 2/19/180 (sum 201) match the closed-form runs PMF',
    holds: () =>
      HIST[2] === 2 &&
      HIST[3] === 19 &&
      HIST[4] === 180 &&
      COUNT_LE_OBS === 201 &&
      Math.abs(P_ONE_SIDED_CLOSED - P_EXACT_ONE_SIDED) < 1e-12,
  },
  {
    // The exact PMF is a valid distribution and reproduces the Wald-Wolfowitz moments imp-33886 used.
    id: 'imp33920-pmf-reproduces-wald-wolfowitz-moments',
    description: 'PMF sums to 1 and its mean/variance equal the WW mu_R ~ 11.48 / var_R ~ 4.96',
    holds: () =>
      Math.abs(PMF_SUM - 1) < 1e-12 &&
      Math.abs(PMF_MEAN - MU_R_WW) < 1e-9 &&
      Math.abs(PMF_VAR - VAR_R_WW) < 1e-9,
  },
  {
    // (R1) The exact permutation p-value keeps the white-noise-null rejection below 0.01, one- and two-sided.
    id: 'imp33920-exact-p-below-1pct',
    description: 'exact one-sided p ~ 5.70e-4 and two-sided p ~ 1.0-1.14e-3 both below 0.01',
    holds: () =>
      P_EXACT_ONE_SIDED < 0.01 &&
      Math.abs(P_EXACT_ONE_SIDED - 201 / 352716) < 1e-12 &&
      P_TWO_SIDED_DOUBLED < 0.01 &&
      P_TWO_SIDED_SMALLP < 0.01 &&
      REJECTS_AT_1PCT_ONE_SIDED &&
      REJECTS_AT_1PCT_TWO_SIDED,
  },
  {
    // (R2) The exact two-sided p sits inside the imp-33886 raw-normal / continuity-corrected bracket.
    id: 'imp33920-exact-inside-normal-bracket',
    description: 'exact two-sided p between the raw-normal 7.9e-4 and continuity-corrected 1.7e-3',
    holds: () =>
      P_TWO_SIDED_DOUBLED > P_NORMAL_TWO_SIDED &&
      P_TWO_SIDED_DOUBLED < P_NORMAL_CC_TWO_SIDED &&
      EXACT_INSIDE_NORMAL_BRACKET,
  },
  {
    // (R3) Honesty gate: isRigorous false, no QED, PT SOTA, residual still small (bound untouched).
    id: 'imp33920-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, PT SOTA, residual still small',
    holds: () =>
      IMP33920_RUNS_TEST_EXACT_PERMUTATION_PVALUE.isRigorous === false &&
      /NO QED/.test(IMP33920_RUNS_TEST_EXACT_PERMUTATION_PVALUE.verdict) &&
      /remains SOTA/.test(IMP33920_RUNS_TEST_EXACT_PERMUTATION_PVALUE.verdict) &&
      /12% multiplicative/.test(IMP33920_RUNS_TEST_EXACT_PERMUTATION_PVALUE.verdict),
  },
];

for (const a of IMP33920_RUNS_TEST_EXACT_PERMUTATION_PVALUE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33920-runs-test-exact-permutation-pvalue assertion failed: ${a.id}`);
  }
}
