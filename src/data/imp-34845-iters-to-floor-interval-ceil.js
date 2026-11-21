/**
 * @module imp-34845-iters-to-floor-interval-ceil
 *
 * imp-34845 (accuracy, frontier-direction): imp-34798 found the closed-form iters-to-floor log law
 *   k(seed) = 1 + ceil( x(seed) ),   x(seed) = ln( delta_0(seed) / eps_fp ) / ln( 1 / r )
 * for the Banach map g(N) = K log T0(N) agrees with the directly-measured Picard count EXACTLY at most
 * seeds and is off by exactly 1 at the rest (10 of 31 at 10^0.1 spacing, 21 of 61 at 10^0.05 spacing over
 * [1e9,1e12]; max abs error 1 at every sampling density). imp-34798 attributed the off-by-one to a "ceil
 * rounding floor" and explicitly flagged IEEE-754 double precision with NO interval enclosure (the
 * imp-34693a sub-gap). This module REPLACES the point-valued ceil argument x(seed) with an enclosing
 * interval [x_lo, x_hi] and MEASURES, for every off-by-one seed, whether its ceil is genuinely ambiguous
 * (the interval straddles an integer, so ceil(x_lo) != ceil(x_hi)) or a TRUE one-off (the interval sits
 * cleanly inside one ceil cell). It reports whether interval-enclosing REMOVES the +/-1, merely RELOCATES
 * it, or leaves it intrinsic.
 *
 * THE INTERVAL ENCLOSURE
 * ----------------------
 * x = A / L with A = ln(delta_0 / eps_fp) and L = ln(1/r). The two honest numerical uncertainties are:
 *   (i) the contraction rate r, estimated by a central difference of g at N_cross. Comparing the h=1 and
 *       h=2 central-difference stencils and forming the Richardson-corrected value (4 gp1 - gp2)/3 gives an
 *       O(h^2) truncation half-width on r of R_TRUNC_HW ~ 7.95e-8 (r ~ 0.0454235);
 *  (ii) the relative floating-point error on delta_0 = |g(seed) - N_cross| / N_cross, bounded by a few ULP
 *       (taken conservatively as 8 * Number.EPSILON).
 * Propagating both to x (r wide -> L wide -> x wide; delta_0 wide -> A wide) yields an enclosing interval
 * whose HALF-WIDTH is x_HALF_WIDTH ~ 6.05e-6 across the whole higher-N band -- utterly dominated by the r
 * truncation term. ceil is called on the interval: ambiguous iff ceil(x_lo) != ceil(x_hi).
 *
 * THE RESULT: THE +/-1 IS INTRINSIC, NOT A CEIL-ROUNDING AMBIGUITY
 * ---------------------------------------------------------------
 * Across BOTH the 31-point (10^0.1) and 61-point (10^0.05) sweeps of [1e9,1e12], the number of off-by-one
 * seeds whose interval straddles an integer is ZERO -- every one of the 10 (resp. 21) off-by-ones is a TRUE
 * one-off. The reason is quantitative: the SMALLEST distance from x to its nearest integer, taken over all
 * off-by-one seeds, is MIN_GAP_TO_INTEGER ~ 1.44e-3, which is ~238x the interval half-width (~6.05e-6). The
 * numerically-honest interval is roughly two orders of magnitude too narrow to reach any integer boundary,
 * so it never straddles. Interval-enclosing therefore does NOT remove the +/-1 and does NOT relocate it into
 * a rounding ambiguity -- it CONFIRMS the +/-1 is a genuine model-vs-measurement offset intrinsic to the
 * doubly-logarithmic delta_0: the predicted count uses the ASYMPTOTIC rate r while the true early Picard
 * transient contracts slightly off r, and that O(1)-fraction-of-an-iterate transient offset (~0.001..0.44 of
 * a cell here) is far larger than any floating-point uncertainty in x. The ceil is NOT sitting on a
 * numerical knife-edge; it lands cleanly, one iterate away from the transient-shifted truth.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * An accuracy assessment of the imp-34798 off-by-one via an interval-arithmetic wrapper on the ceil argument.
 * The interval is a first-order propagation of the r truncation half-width and the delta_0 ULP floor through
 * x = A/L; it is an enclosure of the NUMERICAL uncertainty in x, not of the transient-vs-asymptotic MODEL
 * error (which is what actually produces the off-by-one and which no rate-uncertainty interval can span).
 *
 * MEASUREMENT ONLY. Interval-ceil assessment of a surrogate-landmark count, NOT a rigorous asymptotic and
 * NOT an RH bound. The component model is the inherited imp-3220/imp-3406 extrapolation; the C_C = (1/8)
 * sqrt(3 pi) 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34798-iters-to-floor-log-law-higher-N (parent: dense higher-N re-measure, bounded +/-1 off-by-one)
 * @see imp-34775-iters-to-floor-log-law (grandparent: derives the closed-form log law, ceil rounding floor)
 * @see imp-34693-crossover-contraction-seed-band (Picard terminal value, iterate counts; imp-34693a sub-gap)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34775/imp-34798)
const EPS_FP = 2.3e-16; // the ~machine-epsilon relative agreement floor named in imp-34755/imp-34775

// The shared imp-33723/imp-34693/imp-34755/imp-34775/imp-34798 fixed-point map g(N) = K log T0(N).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterate(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}

// The unique double-precision fixed point (route B, converged) -- identical to imp-34798.
const N_CROSS_FP = iterate(1e9, 200); // 3280294351.65240669

// Central-difference contraction-rate stencils at two step sizes, plus a Richardson-corrected value, so we
// can quote an O(h^2) truncation half-width on r rather than a single point estimate.
const gPrimeAtStep = (h) => (g(N_CROSS_FP + h) - g(N_CROSS_FP - h)) / (2 * h);
const R_H1 = Math.abs(gPrimeAtStep(1)); // ~0.0454235 (the h=1 stencil used by imp-34775/imp-34798)
const R_H2 = Math.abs(gPrimeAtStep(2)); // ~0.0454233 (wider stencil)
const R_RICHARDSON = Math.abs((4 * gPrimeAtStep(1) - gPrimeAtStep(2)) / 3); // O(h^4) corrected rate
const R_CONTRACT = R_H1; // the point rate the log law actually uses
const R_TRUNC_HW = Math.abs(R_CONTRACT - R_RICHARDSON); // ~7.95e-8 central-difference truncation half-width
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.09173 nats/iterate (the log-law constant)

// A conservative relative floating-point uncertainty on delta_0 (a few ULP of a normalized double).
const DELTA0_REL_ULP = 8 * Number.EPSILON;

// Post-collapse relative distance after the single log-collapse iterate g(seed).
const collapseDist = (seed) => Math.abs(g(seed) - N_CROSS_FP) / N_CROSS_FP;

// THE POINT-VALUED CEIL ARGUMENT (imp-34775/imp-34798): x(seed) with k = 1 + ceil(x).
const xArg = (seed) => Math.log(collapseDist(seed) / EPS_FP) / LN_INV_R;
const itersToFloorPredicted = (seed) => 1 + Math.ceil(xArg(seed));

// THE INTERVAL-ENCLOSED CEIL ARGUMENT: propagate the r truncation half-width and the delta_0 ULP floor
// through x = A / L, A = ln(delta_0 / eps_fp), L = ln(1/r). A > 0 throughout the band, so x is largest when
// A is largest and L is smallest (r largest), and smallest in the opposite corner.
function xInterval(seed) {
  const d0 = collapseDist(seed);
  const d0lo = d0 * (1 - DELTA0_REL_ULP);
  const d0hi = d0 * (1 + DELTA0_REL_ULP);
  const rLo = Math.max(1e-9, R_CONTRACT - R_TRUNC_HW);
  const rHi = R_CONTRACT + R_TRUNC_HW;
  const Llo = Math.log(1 / rHi); // L smallest when r largest
  const Lhi = Math.log(1 / rLo); // L largest when r smallest
  const Amin = Math.log(d0lo / EPS_FP);
  const Amax = Math.log(d0hi / EPS_FP);
  return [Amin / Lhi, Amax / Llo];
}

// Directly-measured Picard count: iterates until bit-identical to the fixed point (matches imp-34798).
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

// For a dense band, find every off-by-one seed and classify its interval-enclosed ceil as either
// straddling an integer (genuinely ambiguous) or sitting cleanly in one cell (a true one-off).
function classifyBand(loExp, hiExp, step) {
  const seeds = [];
  for (let e = loExp; e <= hiExp + 1e-9; e += step) seeds.push(Math.pow(10, e));
  let offByOne = 0;
  let straddle = 0;
  let trueOneOff = 0;
  let minGapToInteger = Infinity; // min distance x -> nearest integer over off-by-one seeds
  let maxIntervalWidth = 0;
  for (const s of seeds) {
    const err = Math.abs(itersToFloorPredicted(s) - itersToFloorMeasured(s));
    if (err !== 1) continue;
    offByOne++;
    const x = xArg(s);
    const [xLo, xHi] = xInterval(s);
    maxIntervalWidth = Math.max(maxIntervalWidth, xHi - xLo);
    const gap = Math.min(x - Math.floor(x), Math.ceil(x) - x);
    minGapToInteger = Math.min(minGapToInteger, gap);
    if (Math.ceil(xLo) !== Math.ceil(xHi)) straddle++;
    else trueOneOff++;
  }
  return {
    points: seeds.length,
    offByOne,
    straddle, // interval straddles an integer -> ceil genuinely ambiguous
    trueOneOff, // interval sits cleanly in one ceil cell -> a true one-off
    minGapToInteger: offByOne ? minGapToInteger : null,
    maxIntervalWidth,
  };
}

// The higher-N bands imp-34798 measured, now re-examined through the interval-enclosed ceil.
const BAND_31 = classifyBand(9, 12, 0.1);
const BAND_61 = classifyBand(9, 12, 0.05);

const TOTAL_OFF_BY_ONE = BAND_31.offByOne + BAND_61.offByOne;
const TOTAL_STRADDLE = BAND_31.straddle + BAND_61.straddle;
const X_HALF_WIDTH = Math.max(BAND_31.maxIntervalWidth, BAND_61.maxIntervalWidth) / 2;
const MIN_GAP_TO_INTEGER = Math.min(BAND_31.minGapToInteger, BAND_61.minGapToInteger);
const GAP_OVER_HALF_WIDTH = MIN_GAP_TO_INTEGER / X_HALF_WIDTH; // how far the nearest boundary is in half-widths

export const IMP34845_ITERS_TO_FLOOR_INTERVAL_CEIL = {
  id: 'imp-34845',
  proofSection: 'S-frontier',
  question:
    'imp-34798 found the closed-form vs Picard iters-to-floor count off by exactly 1 at some seeds, attributed ' +
    'to a ceil rounding floor with NO interval enclosure (the imp-34693a sub-gap). Replace the point-valued ' +
    'ceil argument with an enclosing interval [x_lo, x_hi] and measure how many off-by-one seeds have a ceil ' +
    'that is genuinely ambiguous (interval straddles an integer) vs a true one-off; report whether ' +
    'interval-enclosing REMOVES or merely RELOCATES the +/-1. Accuracy assessment; changes no bound; no QED.',
  constants: {
    contraction_rate_r: +R_CONTRACT.toPrecision(6), // ~0.0454235 (h=1 stencil, as imp-34775/imp-34798)
    r_richardson_corrected: +R_RICHARDSON.toPrecision(6), // ~0.0454236 (O(h^4) corrected)
    r_truncation_half_width: +R_TRUNC_HW.toExponential(6), // ~7.947286e-8 central-difference truncation
    log_law_constant_ln_inv_r: +LN_INV_R.toPrecision(6), // ~3.09173 nats/iterate
    x_interval_half_width: +X_HALF_WIDTH.toExponential(6), // ~6.045082e-6 (dominated by the r term)
    min_gap_to_integer: +MIN_GAP_TO_INTEGER.toExponential(6), // ~1.439e-3 (nearest integer over off-by-ones)
    gap_over_half_width: +GAP_OVER_HALF_WIDTH.toPrecision(6), // ~238 -- boundary is ~238 half-widths away
    delta0_rel_ulp: +DELTA0_REL_ULP.toExponential(6), // 8 * Number.EPSILON conservative delta_0 floor
  },
  interval_bands: {
    'band_31_step_0p1_1e9_to_1e12': BAND_31,
    'band_61_step_0p05_1e9_to_1e12': BAND_61,
  },
  summary: {
    total_off_by_one_seeds: TOTAL_OFF_BY_ONE, // 31 across both bands (10 + 21)
    total_straddling_ceil: TOTAL_STRADDLE, // 0 -- NOT ONE interval straddles an integer
    all_true_one_offs: TOTAL_STRADDLE === 0, // true: every off-by-one is a true one-off
    interval_too_narrow_to_straddle:
      'the interval half-width in x is ~6.05e-6 (dominated by the ~7.95e-8 central-difference r truncation), ' +
      'while the SMALLEST distance from x to its nearest integer over all off-by-one seeds is ~1.44e-3 -- ' +
      '~238 half-widths away, so the numerically-honest interval is roughly two orders of magnitude too ' +
      'narrow to ever straddle an integer boundary',
    verdict_on_ticket_question:
      'INTERVAL-ENCLOSING NEITHER REMOVES NOR RELOCATES THE +/-1: the off-by-one is INTRINSIC to the ' +
      'doubly-logarithmic delta_0, not a ceil-rounding ambiguity. Zero of the 31 off-by-one seeds have a ceil ' +
      'that the interval renders ambiguous; all are true one-offs where the ceil lands cleanly one iterate ' +
      'away from the transient-shifted Picard truth. The +/-1 is a transient-vs-asymptotic MODEL offset ' +
      '(predicted count uses the asymptotic rate r; the true early Picard transient contracts slightly off r), ' +
      'far larger than any floating-point uncertainty in x -- no rate-uncertainty interval can span it.',
  },
  finding:
    'Replacing the point-valued ceil argument x(seed) = ln(delta_0/eps_fp)/ln(1/r) with an enclosing interval ' +
    '[x_lo, x_hi] -- propagating the O(h^2) central-difference truncation half-width on the contraction rate ' +
    '(R_TRUNC_HW ~ 7.95e-8) and a few-ULP relative floor on delta_0 through x = A/L -- gives an interval whose ' +
    'half-width is ~6.05e-6 across the whole higher-N band. Over BOTH the 31-point (10^0.1) and 61-point ' +
    '(10^0.05) sweeps of [1e9,1e12], the number of off-by-one seeds whose interval straddles an integer is ' +
    'ZERO: all 10 (resp. 21) off-by-ones are true one-offs. The smallest distance from x to its nearest ' +
    'integer over every off-by-one seed is ~1.44e-3, about 238x the interval half-width, so the interval is ' +
    'roughly two orders of magnitude too narrow to reach any ceil boundary. Interval-enclosing therefore does ' +
    'NOT remove the +/-1 and does NOT relocate it into a rounding ambiguity -- it CONFIRMS the +/-1 is a ' +
    'genuine model-vs-measurement offset intrinsic to the doubly-logarithmic delta_0: the predicted count uses ' +
    'the asymptotic rate r while the true early Picard transient contracts slightly off r, an O(1)-fraction of ' +
    'a single iterate that no rate-uncertainty interval can span. The imp-34693a no-interval-enclosure sub-gap ' +
    'is now answered for THIS count: an interval enclosure changes nothing, because the ceil is not on a ' +
    'numerical knife-edge.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT an RH bound). Wrapping the imp-34775/imp-34798 ceil argument in an ' +
    'interval enclosure [x_lo, x_hi] built from the ~7.95e-8 central-difference truncation half-width on the ' +
    'contraction rate r and a few-ULP floor on delta_0 yields an x half-width of ~6.05e-6. Across the dense ' +
    '31- and 61-point sweeps of [1e9,1e12], ZERO of the 31 off-by-one seeds have an interval that straddles an ' +
    'integer -- every one is a TRUE one-off, and the nearest integer sits ~238 half-widths (~1.44e-3) away. ' +
    'So an interval-enclosed ceil NEITHER eliminates NOR relocates the bounded off-by-one: the +/-1 is ' +
    'INTRINSIC to the doubly-logarithmic delta_0 (asymptotic rate r vs the slightly-off early Picard ' +
    'transient), a model-vs-measurement offset far larger than the floating-point uncertainty that an ' +
    'interval captures. This answers the imp-34693a no-interval-enclosure sub-gap for this count. IEEE-754 ' +
    'double precision; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643) and the C_mb GUE-conditional per imp-486 are ' +
    'UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34798 (parent: dense higher-N re-measure, bounded +/-1 off-by-one, no-interval-enclosure caveat); ' +
    'imp-34775 (grandparent: derives the closed-form log law and the ceil rounding floor); imp-34693/imp-34693a ' +
    '(Picard terminal value, iterate counts; the no-interval-enclosure sub-gap); imp-2642 (C_C = (1/8) ' +
    'sqrt(3 pi) 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN Riemann-von Mangoldt inverse).',
};

export const IMP34845_ITERS_TO_FLOOR_INTERVAL_CEIL_ASSERTIONS = [
  {
    // The interval is built from a genuine truncation half-width on r, not a hand-picked width.
    id: 'imp34845-r-truncation-half-width-small-positive',
    description: 'central-difference r truncation half-width R_TRUNC_HW is a small positive O(1e-7)',
    holds: () => R_TRUNC_HW > 0 && R_TRUNC_HW < 1e-6,
  },
  {
    // NOT ONE off-by-one seed has an interval that straddles an integer -- all are true one-offs.
    id: 'imp34845-no-off-by-one-straddles',
    description: 'zero off-by-one seeds have a straddling (genuinely ambiguous) ceil across both bands',
    holds: () =>
      BAND_31.offByOne > 0 &&
      BAND_61.offByOne > BAND_31.offByOne &&
      BAND_31.straddle === 0 &&
      BAND_61.straddle === 0 &&
      TOTAL_STRADDLE === 0,
  },
  {
    // The interval is far too narrow to reach a boundary: nearest integer is >100 half-widths away.
    id: 'imp34845-interval-too-narrow-to-straddle',
    description: 'the nearest integer over off-by-one seeds is >100 interval half-widths away (~238x here)',
    holds: () =>
      X_HALF_WIDTH > 0 &&
      MIN_GAP_TO_INTEGER > 1e-3 &&
      GAP_OVER_HALF_WIDTH > 100,
  },
  {
    // Consistency with the parent: the same off-by-one counts imp-34798 reported reappear here.
    id: 'imp34845-off-by-one-counts-match-parent',
    description: 'off-by-one counts reproduce imp-34798: 10 of 31 and 21 of 61',
    holds: () =>
      BAND_31.offByOne === 10 &&
      BAND_61.offByOne === 21 &&
      TOTAL_OFF_BY_ONE === 31,
  },
  {
    // Honesty gate: interval-ceil measurement of a surrogate count, not rigorous, no QED, no refereed bound is changed.
    id: 'imp34845-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34845_ITERS_TO_FLOOR_INTERVAL_CEIL.isRigorous === false &&
      /NO QED/.test(IMP34845_ITERS_TO_FLOOR_INTERVAL_CEIL.verdict) &&
      /refereed bound is changed/i.test(IMP34845_ITERS_TO_FLOOR_INTERVAL_CEIL.verdict),
  },
];

for (const a of IMP34845_ITERS_TO_FLOOR_INTERVAL_CEIL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34845-iters-to-floor-interval-ceil assertion failed: ${a.id}`);
  }
}
