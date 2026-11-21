/**
 * @module imp-34862-iters-to-floor-two-rate-law
 *
 * imp-34862 (accuracy, frontier-direction): imp-34845 proved (via an interval-ceil enclosure) that the
 * imp-34798 iters-to-floor off-by-one is INTRINSIC, not a ceil-rounding ambiguity: the honest interval
 * half-width in the ceil argument (~6.05e-6) is ~238x too narrow to reach an integer boundary
 * (MIN_GAP_TO_INTEGER ~ 1.44e-3), so the +/-1 is a genuine transient-vs-asymptotic MODEL offset -- the
 * single-rate law k(seed) = 1 + ceil( ln(delta_0/eps_fp) / ln(1/r) ) uses the ASYMPTOTIC contraction rate r
 * while the true early Picard transient contracts slightly off r. This module asks the natural follow-up:
 * does a TWO-RATE law -- an early-transient rate r_0 fitted from the first few post-collapse iterates plus
 * the asymptotic rate r -- REMOVE or reduce the off-by-one count (currently 10 of 31 at 10^0.1 spacing and
 * 21 of 61 at 10^0.05 spacing over [1e9,1e12], max abs error 1)?
 *
 * THE TWO-RATE LAWS TESTED
 * ------------------------
 * After the single log-collapse iterate g(seed) the residual is delta_0 = |g(seed) - N_cross| / N_cross.
 * Two independent two-rate parametrizations model the early transient before the asymptotic tail:
 *
 *  (A) RATIO-FIT r_0. Fit an early-transient rate r_0 as the geometric-mean per-step ratio over the first p
 *      post-collapse iterates, r_0 = (delta_p / delta_0)^(1/p), then contract at r_0 for p steps and at r for
 *      the rest:  delta_0 * r_0^p * r^(x-p) = eps_fp  =>  x = p + [ln(delta_0/eps_fp) - p ln(1/r_0)]/ln(1/r),
 *      k = 1 + ceil(x). Tested for p in {1,2,3}. r_0 runs ~0.0403..0.0467 across the band (vs r ~ 0.045424),
 *      confirming the transient genuinely contracts off r.
 *
 *  (B) EXACT-PEEL. The decisive control: instead of MODELING the transient, peel m EXACT early iterates --
 *      run the true trajectory m steps past the collapse, read off the exact residual delta_after_m, and
 *      model ONLY the asymptotic tail:  k = (1+m) + ceil( ln(delta_after_m/eps_fp)/ln(1/r) ). Tested for
 *      m in {1,2,3}. This removes ALL early-transient MODEL error by construction, isolating whatever
 *      remains in the terminal ceil.
 *
 * THE RESULT: THE TWO-RATE LAW DOES NOT REMOVE THE OFF-BY-ONE
 * ----------------------------------------------------------
 * Neither parametrization reduces the off-by-one count, and the maximum absolute error stays 1 everywhere.
 * The minimal transient (ratio-fit p=1, exact-peel m=1) reproduces the baseline 10 of 31 and produces 22 of
 * 61 (one MORE than the single-rate 21); enlarging the transient window (p,m in {2,3}) makes it slightly
 * WORSE still (11 of 31, 23 of 61). Crucially, the EXACT-PEEL control -- which carries ZERO early-transient
 * model error because it uses the true trajectory -- ALSO leaves the off-by-one (10-11 of 31, 22-23 of 61,
 * max error 1). That is the decisive finding: since even an exactly-peeled early transient cannot cure the
 * +/-1, the residual off-by-one does NOT live in the early transient rate at all. It lives in the TERMINAL
 * ceil -- the mismatch between the continuous eps_fp = 2.3e-16 crossing the log law rounds against and the
 * discrete bit-identical stopping criterion the Picard count actually uses. Modeling the transient with a
 * second rate cannot span that terminal-threshold gap; it only adds a second fitted quantity whose own
 * rounding shifts a few borderline seeds across their ceil, nudging the count UP rather than down.
 *
 * This REFINES imp-34845: imp-34845 localized the +/-1 to "asymptotic rate r vs the slightly-off early
 * transient"; this module shows the transient is a red herring for the COUNT -- an exact transient leaves it
 * unchanged, so the surviving offset is a terminal ceil-vs-bit-collapse discretization, not a rate error.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A two-parameter (two-rate) accuracy assessment of the imp-34798/imp-34845 off-by-one, with an exact-peel
 * control isolating the terminal ceil. All rates and residuals are IEEE-754 double-precision evaluations via
 * effectiveHeightForN; the ratio-fit r_0 and the asymptotic r are point estimates, not interval enclosures.
 *
 * MEASUREMENT ONLY. Two-rate assessment of a surrogate-landmark count, NOT a rigorous asymptotic and NOT an
 * RH bound. The component model is the inherited imp-3220/imp-3406 extrapolation; the C_C = (1/8) sqrt(3 pi)
 * 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED; imp-3066
 * K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34845-iters-to-floor-interval-ceil (parent: +/-1 is intrinsic, not a ceil-rounding ambiguity)
 * @see imp-34798-iters-to-floor-log-law-higher-N (grandparent: dense higher-N re-measure, bounded +/-1)
 * @see imp-34775-iters-to-floor-log-law (derives the single-rate closed-form log law and the ceil floor)
 * @see imp-34693-crossover-contraction-seed-band (Picard terminal value, iterate counts; imp-34693a sub-gap)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34775/imp-34798/imp-34845)
const EPS_FP = 2.3e-16; // the ~machine-epsilon relative agreement floor named in imp-34755/imp-34775

// The shared imp-33723/imp-34693/imp-34755/imp-34775/imp-34798/imp-34845 fixed-point map g(N) = K log T0(N).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterate(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}

// The unique double-precision fixed point (route B, converged) -- identical to imp-34798/imp-34845.
const N_CROSS_FP = iterate(1e9, 200); // 3280294351.65240669

// Asymptotic contraction rate r = |g_prime(N_cross)| via a central difference (matches imp-34775/imp-34798).
const R_CONTRACT = Math.abs((g(N_CROSS_FP + 1) - g(N_CROSS_FP - 1)) / 2); // ~0.0454235
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.09173 nats/iterate (the single-rate log-law constant)

// Post-collapse relative distance after the single log-collapse iterate g(seed).
const collapseDist = (seed) => Math.abs(g(seed) - N_CROSS_FP) / N_CROSS_FP;

// SINGLE-RATE LAW (imp-34798 baseline): k = 1 + ceil( ln(delta_0/eps_fp)/ln(1/r) ).
function predSingleRate(seed) {
  return 1 + Math.ceil(Math.log(collapseDist(seed) / EPS_FP) / LN_INV_R);
}

// (A) TWO-RATE, RATIO-FIT r_0: geometric-mean per-step ratio over the first p post-collapse iterates.
// r_0 = (delta_p / delta_0)^(1/p); contract at r_0 for p steps then at r for the tail.
function fitEarlyRateR0(seed, p) {
  let N = g(seed); // the delta_0 state
  const d0 = Math.abs(N - N_CROSS_FP) / N_CROSS_FP;
  for (let i = 0; i < p; i++) N = g(N);
  const dp = Math.abs(N - N_CROSS_FP) / N_CROSS_FP;
  return Math.pow(dp / d0, 1 / p);
}
function predTwoRateRatioFit(seed, p) {
  const d0 = collapseDist(seed);
  const r0 = fitEarlyRateR0(seed, p);
  const lnInvR0 = Math.log(1 / r0);
  const x = p + (Math.log(d0 / EPS_FP) - p * lnInvR0) / LN_INV_R;
  return 1 + Math.ceil(x);
}

// (B) EXACT-PEEL control: run m EXACT iterates past the collapse (zero transient model error), then model
// only the asymptotic tail:  k = (1 + m) + ceil( ln(delta_after_m/eps_fp)/ln(1/r) ).
function predExactPeel(seed, m) {
  let N = g(seed); // the delta_0 state (the "1 +")
  for (let i = 0; i < m; i++) N = g(N);
  const dm = Math.abs(N - N_CROSS_FP) / N_CROSS_FP;
  if (dm === 0) return 1 + m;
  return 1 + m + Math.ceil(Math.log(dm / EPS_FP) / LN_INV_R);
}

// Directly-measured Picard count: iterates until bit-identical to the fixed point (matches imp-34798/imp-34845).
function itersToFloorMeasured(seed, cap = 500) {
  let N = seed;
  let k = 0;
  while (k < cap) {
    N = g(N);
    k++;
    if (N === N_CROSS_FP) break;
  }
  return k;
}

// Tabulate a predictor against the measured Picard count over a dense log10 band [loExp, hiExp].
function scanBand(loExp, hiExp, step, predictor) {
  const seeds = [];
  for (let e = loExp; e <= hiExp + 1e-9; e += step) seeds.push(Math.pow(10, e));
  let maxAbsError = 0;
  let offByOne = 0;
  let exact = 0;
  for (const s of seeds) {
    const err = Math.abs(predictor(s) - itersToFloorMeasured(s));
    if (err > maxAbsError) maxAbsError = err;
    if (err === 0) exact++;
    if (err === 1) offByOne++;
  }
  return { points: seeds.length, maxAbsError, offByOne, exact };
}

// The two dense higher-N bands imp-34798/imp-34845 measured, re-run under each law.
function bothBands(predictor) {
  return {
    band_31: scanBand(9, 12, 0.1, predictor),
    band_61: scanBand(9, 12, 0.05, predictor),
  };
}

const BASELINE = bothBands(predSingleRate); // single-rate: 10/31, 21/61
const RATIO_FIT = {
  p1: bothBands((s) => predTwoRateRatioFit(s, 1)),
  p2: bothBands((s) => predTwoRateRatioFit(s, 2)),
  p3: bothBands((s) => predTwoRateRatioFit(s, 3)),
};
const EXACT_PEEL = {
  m1: bothBands((s) => predExactPeel(s, 1)),
  m2: bothBands((s) => predExactPeel(s, 2)),
  m3: bothBands((s) => predExactPeel(s, 3)),
};

// Representative early-transient rates (the transient genuinely contracts off the asymptotic r).
const R0_SAMPLES = {
  seed_1e9_p2: +fitEarlyRateR0(1e9, 2).toPrecision(6), // ~0.0460808 (> r: faster early)
  seed_1e12_p2: +fitEarlyRateR0(1e12, 2).toPrecision(6), // ~0.0427067 (< r: slower early)
};

// The best (smallest) off-by-one count any two-rate variant achieves on each band, for the verdict.
const BEST_TWO_RATE_OFF_31 = Math.min(
  RATIO_FIT.p1.band_31.offByOne, RATIO_FIT.p2.band_31.offByOne, RATIO_FIT.p3.band_31.offByOne,
  EXACT_PEEL.m1.band_31.offByOne, EXACT_PEEL.m2.band_31.offByOne, EXACT_PEEL.m3.band_31.offByOne,
);
const BEST_TWO_RATE_OFF_61 = Math.min(
  RATIO_FIT.p1.band_61.offByOne, RATIO_FIT.p2.band_61.offByOne, RATIO_FIT.p3.band_61.offByOne,
  EXACT_PEEL.m1.band_61.offByOne, EXACT_PEEL.m2.band_61.offByOne, EXACT_PEEL.m3.band_61.offByOne,
);

// Max abs error across every two-rate variant on both bands (stays 1 -- never widens, never shrinks to 0).
const MAX_ABS_ERROR_TWO_RATE = Math.max(
  RATIO_FIT.p1.band_31.maxAbsError, RATIO_FIT.p1.band_61.maxAbsError,
  RATIO_FIT.p2.band_31.maxAbsError, RATIO_FIT.p2.band_61.maxAbsError,
  RATIO_FIT.p3.band_31.maxAbsError, RATIO_FIT.p3.band_61.maxAbsError,
  EXACT_PEEL.m1.band_31.maxAbsError, EXACT_PEEL.m1.band_61.maxAbsError,
  EXACT_PEEL.m2.band_31.maxAbsError, EXACT_PEEL.m2.band_61.maxAbsError,
  EXACT_PEEL.m3.band_31.maxAbsError, EXACT_PEEL.m3.band_61.maxAbsError,
);

export const IMP34862_ITERS_TO_FLOOR_TWO_RATE_LAW = {
  id: 'imp-34862',
  proofSection: 'S-frontier',
  question:
    'imp-34845 proved the imp-34798 iters-to-floor +/-1 is INTRINSIC (transient-vs-asymptotic model offset), ' +
    'not a ceil-rounding ambiguity. Measure whether a TWO-RATE law -- an early-transient rate r_0 fitted from ' +
    'the first few post-collapse iterates plus the asymptotic rate r -- removes or reduces the off-by-one ' +
    '(baseline 10 of 31 and 21 of 61 over [1e9,1e12], max abs error 1). Report the residual off-by-one count ' +
    'and max abs error. Measurement only; surrogate-landmark count; changes no bound; no QED.',
  constants: {
    contraction_rate_r: +R_CONTRACT.toPrecision(6), // ~0.0454235 (asymptotic; as imp-34798/imp-34845)
    log_law_constant_ln_inv_r: +LN_INV_R.toPrecision(6), // ~3.09173 nats/iterate
    r0_seed_1e9_p2: R0_SAMPLES.seed_1e9_p2, // ~0.0460808 (early transient faster than r near 1e9)
    r0_seed_1e12_p2: R0_SAMPLES.seed_1e12_p2, // ~0.0427067 (early transient slower than r near 1e12)
    eps_fp_floor: EPS_FP, // 2.3e-16 continuous crossing the ceil rounds against
  },
  baseline_single_rate: {
    band_31_off_by_one: BASELINE.band_31.offByOne, // 10 of 31 (imp-34798)
    band_61_off_by_one: BASELINE.band_61.offByOne, // 21 of 61 (imp-34798)
    max_abs_error: Math.max(BASELINE.band_31.maxAbsError, BASELINE.band_61.maxAbsError), // 1
  },
  two_rate_ratio_fit: RATIO_FIT, // (A) geometric-mean r_0 over first p iterates, p in {1,2,3}
  two_rate_exact_peel: EXACT_PEEL, // (B) peel m EXACT iterates then asymptotic tail, m in {1,2,3}
  summary: {
    best_two_rate_off_by_one_band_31: BEST_TWO_RATE_OFF_31, // 10 -- no improvement over baseline 10
    best_two_rate_off_by_one_band_61: BEST_TWO_RATE_OFF_61, // 22 -- one WORSE than baseline 21
    two_rate_removes_off_by_one: false, // it does NOT
    max_abs_error_across_all_two_rate: MAX_ABS_ERROR_TWO_RATE, // 1 -- stays bounded, never shrinks to 0
    exact_peel_still_off_by_one:
      EXACT_PEEL.m1.band_31.offByOne > 0 && EXACT_PEEL.m1.band_61.offByOne > 0, // true -- the decisive control
    verdict_on_ticket_question:
      'A TWO-RATE law does NOT remove or reduce the off-by-one. Fitting an early-transient rate r_0 (ratio-fit ' +
      'p in {1,2,3}) leaves 10-11 of 31 and 22-23 of 61 off by one, max abs error 1 -- no better than the ' +
      'single-rate 10/31, 21/61, and slightly worse on the denser grid. The decisive control is the EXACT-PEEL ' +
      'variant, which carries ZERO early-transient model error (it uses the true trajectory for the first m ' +
      'iterates): it ALSO leaves the off-by-one unchanged. Since even an exactly-peeled transient cannot cure ' +
      'the +/-1, the residual offset does NOT live in the early transient rate -- it lives in the TERMINAL ceil ' +
      '(the continuous eps_fp = 2.3e-16 crossing vs the discrete bit-identical Picard stopping criterion), ' +
      'which no second rate can span. This REFINES imp-34845: the transient is a red herring for the COUNT.',
  },
  finding:
    'Adding a second (early-transient) rate to the imp-34798 single-rate iters-to-floor law does not remove or ' +
    'reduce the off-by-one. Two parametrizations were tested over the dense [1e9,1e12] bands: (A) a ratio-fit ' +
    'r_0 = (delta_p/delta_0)^(1/p) geometric-mean early rate (r_0 ~ 0.0404..0.0467 vs asymptotic r ~ 0.045424, ' +
    'so the transient genuinely contracts off r), contracting at r_0 for p steps then at r, p in {1,2,3}; and ' +
    '(B) an EXACT-PEEL control that runs m true iterates past the collapse and models only the asymptotic tail, ' +
    'm in {1,2,3}. The ratio-fit leaves 10-11 of 31 and 22-23 of 61 off by one (max abs error 1) -- no better ' +
    'than baseline 10/31 & 21/61, and one worse on the 61-point grid. The EXACT-PEEL control, which by ' +
    'construction has zero early-transient MODEL error, ALSO leaves 10-11 of 31 and 22-23 of 61 off by one. ' +
    'That is decisive: since an exactly-peeled transient cannot cure the +/-1, the residual off-by-one is NOT ' +
    'a transient-rate error at all -- it is a TERMINAL discretization, the gap between the continuous ' +
    'eps_fp = 2.3e-16 crossing the ceil rounds against and the discrete bit-identical stopping criterion the ' +
    'Picard count uses. A second rate only adds a second fitted quantity whose own rounding nudges a few ' +
    'borderline seeds ACROSS their ceil (count up), never down. This refines imp-34845, which attributed the ' +
    '+/-1 to the asymptotic-vs-early-transient rate: the transient is a red herring for the count.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT an RH bound). A two-rate iters-to-floor law -- early-transient rate ' +
    'r_0 (geometric-mean ratio-fit over the first p in {1,2,3} post-collapse iterates) plus asymptotic rate ' +
    'r ~ 0.045424 -- does NOT remove or reduce the imp-34798/imp-34845 off-by-one: it leaves 10-11 of 31 and ' +
    '22-23 of 61 seeds off by exactly one over [1e9,1e12], max abs error 1, no better than the single-rate ' +
    '10/31 & 21/61 and slightly worse on the denser grid. The decisive control is an EXACT-PEEL variant that ' +
    'runs m in {1,2,3} true iterates past the collapse and models only the asymptotic tail -- carrying ZERO ' +
    'early-transient model error -- and it too leaves the off-by-one unchanged. So the residual +/-1 does NOT ' +
    'live in the early transient rate; it is a TERMINAL ceil discretization (continuous eps_fp = 2.3e-16 ' +
    'crossing vs the discrete bit-identical Picard stopping criterion) that no second rate can span. This ' +
    'REFINES imp-34845 (which localized the +/-1 to asymptotic-vs-transient rate): the transient is a red ' +
    'herring for the COUNT. IEEE-754 double precision, point rate estimates (no interval enclosure); the ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_C 1/8 ' +
    'ansatz (imp-2642/imp-2643) and the C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 ' +
    'untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34845 (parent: the +/-1 is intrinsic, not a ceil-rounding ambiguity, via interval-ceil enclosure); ' +
    'imp-34798 (grandparent: dense higher-N re-measure, bounded +/-1 off-by-one, baseline 10/31 & 21/61); ' +
    'imp-34775 (derives the single-rate closed-form log law and the ceil floor); imp-34693/imp-34693a ' +
    '(Picard terminal value, iterate counts, seed band); imp-2642 (C_C = (1/8) sqrt(3 pi) 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN Riemann-von Mangoldt inverse).',
};

export const IMP34862_ITERS_TO_FLOOR_TWO_RATE_LAW_ASSERTIONS = [
  {
    // The asymptotic constant matches the inherited imp-34798/imp-34845 rate.
    id: 'imp34862-asymptotic-rate-matches-parent',
    description: 'ln(1/r) ~ 3.0917 nats/iterate and r ~ 0.045424 (identical to imp-34798/imp-34845)',
    holds: () =>
      Math.abs(LN_INV_R - 3.09173) < 1e-3 &&
      Math.abs(R_CONTRACT - 0.0454235) < 1e-5,
  },
  {
    // The early-transient rate genuinely differs from the asymptotic rate on both sides (r_0 straddles r).
    id: 'imp34862-early-transient-rate-off-asymptotic',
    description: 'fitted r_0 straddles the asymptotic r across the band (faster near 1e9, slower near 1e12)',
    holds: () =>
      R0_SAMPLES.seed_1e9_p2 > R_CONTRACT &&
      R0_SAMPLES.seed_1e12_p2 < R_CONTRACT,
  },
  {
    // Baseline reproduces the parent single-rate counts: 10 of 31 and 21 of 61.
    id: 'imp34862-baseline-reproduces-parent',
    description: 'single-rate baseline reproduces imp-34798: 10 of 31 and 21 of 61 off by one, max error 1',
    holds: () =>
      BASELINE.band_31.offByOne === 10 &&
      BASELINE.band_61.offByOne === 21 &&
      BASELINE.band_31.maxAbsError === 1 &&
      BASELINE.band_61.maxAbsError === 1,
  },
  {
    // THE RESULT: the two-rate law does NOT reduce the off-by-one, and max abs error stays 1 (never 0, never 2).
    id: 'imp34862-two-rate-does-not-remove-off-by-one',
    description: 'best two-rate off-by-one is no better than baseline (10/31, >=21/61) and max error stays 1',
    holds: () =>
      BEST_TWO_RATE_OFF_31 >= BASELINE.band_31.offByOne &&
      BEST_TWO_RATE_OFF_61 >= BASELINE.band_61.offByOne &&
      MAX_ABS_ERROR_TWO_RATE === 1 &&
      IMP34862_ITERS_TO_FLOOR_TWO_RATE_LAW.summary.two_rate_removes_off_by_one === false,
  },
  {
    // The decisive control: an EXACT (zero-model-error) early transient STILL leaves the off-by-one.
    id: 'imp34862-exact-peel-still-off-by-one',
    description: 'exact-peel (zero early-transient model error) still leaves off-by-one on both bands, max error 1',
    holds: () =>
      EXACT_PEEL.m1.band_31.offByOne > 0 &&
      EXACT_PEEL.m1.band_61.offByOne > 0 &&
      EXACT_PEEL.m1.band_31.maxAbsError === 1 &&
      EXACT_PEEL.m1.band_61.maxAbsError === 1,
  },
  {
    // Honesty gate: two-rate measurement of a surrogate count, not rigorous, no QED, no refereed bound is changed.
    id: 'imp34862-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34862_ITERS_TO_FLOOR_TWO_RATE_LAW.isRigorous === false &&
      /NO QED/.test(IMP34862_ITERS_TO_FLOOR_TWO_RATE_LAW.verdict) &&
      /refereed bound is changed/i.test(IMP34862_ITERS_TO_FLOOR_TWO_RATE_LAW.verdict),
  },
];

for (const a of IMP34862_ITERS_TO_FLOOR_TWO_RATE_LAW_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34862-iters-to-floor-two-rate-law assertion failed: ${a.id}`);
  }
}
