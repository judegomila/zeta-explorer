/**
 * @module imp-34887-iters-to-floor-residual-sign
 *
 * imp-34887 (accuracy, frontier-direction): imp-34845 proved the imp-34798 iters-to-floor off-by-one is
 *   INTRINSIC (a transient-vs-asymptotic MODEL offset, not a ceil-rounding ambiguity: the honest interval on
 *   x = ln(delta_0/eps_fp)/ln(1/r) is ~238x too narrow to straddle an integer), and imp-34862 tested TWO-RATE
 *   laws and found they do NOT remove it (the residual +/-1 lives in the terminal ceil, not the transient
 *   rate). This module tests the SIMPLER hypothesis the two-rate work never checked: does the off-by-one carry
 *   a DETERMINISTIC SIGN across the whole seed band, so a fixed CONSTANT offset -- not a re-fitted rate --
 *   would remove it?
 *
 * WHAT IS MEASURED
 * ----------------
 * For every off-by-one seed over [1e9,1e12] at BOTH the 31-point (10^0.1) and 61-point (10^0.05) spacings,
 * the SIGNED residual
 *     resid(seed) = k_single(seed) - k_measured(seed),   k_single = 1 + ceil( x(seed) )
 * is recorded (not its absolute value as in imp-34798/imp-34845). The map, the amplitude K, the fixed point
 * N_CROSS_FP, the contraction rate r, the log-law constant ln(1/r), and the ceil argument x are all reused
 * VERBATIM from imp-34798/imp-34845 (the shared imp-33723/imp-34693/imp-34755/imp-34775 map g(N)=K log T0(N)).
 *
 * THE RESULT: THE SIGN IS UNIFORMLY -1 ...
 * ----------------------------------------
 * Every off-by-one seed -- all 10 of 31 at 10^0.1 and all 21 of 61 at 10^0.05 -- has resid = -1. NOT ONE
 * seed over-counts. The single-rate log law, where it errs, SYSTEMATICALLY UNDER-counts by exactly one
 * iterate. This confirms the DIRECTION of the imp-34862 transient hypothesis (the early Picard transient
 * contracts off the asymptotic rate r -- ratio-fit r_0 ~ 0.0404..0.0467 straddling r ~ 0.045424 -- and the
 * asymptotic-rate law lands one iterate short at the seeds where it errs): the residual has a deterministic
 * sign, never a mixed +1/-1 spread.
 *
 * ... BUT A FIXED CONSTANT OFFSET DOES NOT REMOVE THE OFF-BY-ONE (the hypothesis corollary is REFUTED)
 * ---------------------------------------------------------------------------------------------------
 * A uniform sign is NECESSARY but NOT SUFFICIENT for a constant-offset fix. Applying the natural +1 offset
 * (k_single + 1) to ALL seeds does NOT drive the off-by-one count to zero -- it INVERTS the population: the
 * currently-off-by-one seeds become exact while the currently-EXACT seeds become off-by-one. On the 31-point
 * band the exact count goes 21 -> 10 (off-by-one 10 -> 21); on the 61-point band 40 -> 21 (off-by-one
 * 21 -> 40). A fixed offset merely TRANSLATES the error onto the complementary seed subset; it can never
 * remove it, because the off-by-one is a SEED-SELECTIVE terminal-ceil boundary crossing (the continuous
 * eps_fp threshold rounding against the discrete bit-identical Picard stop at DIFFERENT seeds), NOT a global
 * additive bias. This is exactly the imp-34862 conclusion viewed through the sign: no fixed adjustment --
 * offset OR second rate -- can span a per-seed ceil discretization. The +1 residual sign is a property of
 * WHICH seeds err, not of a shift that would cure them.
 *
 * VERDICT ON THE TICKET: the residual sign is DETERMINISTIC and uniformly -1 (single-rate law never
 * over-counts), so the mixed-sign branch that would MANDATE a two-rate model is ruled out -- but the uniform
 * sign does NOT make a fixed +/-1 constant offset a valid fix, because the off-by-one is a seed-selective
 * ceil crossing, not a global bias. Both the fixed-offset route (this ticket) and the two-rate route
 * (imp-34862) fail for the SAME terminal-ceil reason.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A sign/uniformity assessment of the imp-34798/imp-34845 off-by-one, plus a direct test of the fixed-offset
 * corollary. MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate map, IEEE-754 double precision, no
 * interval enclosure (compare the imp-34693a sub-gap; imp-34845 showed the interval is too narrow to matter
 * here). The C_C = (1/8) sqrt(3 pi) 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; no
 * RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34862-iters-to-floor-two-rate-law (sibling: two-rate law fails; residual lives in terminal ceil)
 * @see imp-34845-iters-to-floor-interval-ceil (parent: off-by-one is INTRINSIC, not a ceil-rounding ambiguity)
 * @see imp-34798-iters-to-floor-log-law-higher-N (grandparent: dense higher-N re-measure, bounded +/-1)
 * @see imp-34775-iters-to-floor-log-law (derives the closed-form log law and the ceil rounding floor)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
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

// Central-difference contraction rate (h=1 stencil, the rate the log law uses; identical to imp-34845).
const gPrimeAtStep = (h) => (g(N_CROSS_FP + h) - g(N_CROSS_FP - h)) / (2 * h);
const R_CONTRACT = Math.abs(gPrimeAtStep(1)); // ~0.0454235
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.09173 nats/iterate (the log-law constant)

// Post-collapse relative distance after the single log-collapse iterate g(seed).
const collapseDist = (seed) => Math.abs(g(seed) - N_CROSS_FP) / N_CROSS_FP;

// THE POINT-VALUED CEIL ARGUMENT and the single-rate predicted count (imp-34775/imp-34798/imp-34845).
const xArg = (seed) => Math.log(collapseDist(seed) / EPS_FP) / LN_INV_R;
const itersToFloorPredicted = (seed) => 1 + Math.ceil(xArg(seed));

// Directly-measured Picard count: iterates until bit-identical to the fixed point (matches imp-34798/34845).
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

// For a dense band, record the SIGNED residual k_single - k_measured at every off-by-one seed, and separately
// test whether a fixed +1 offset applied to ALL seeds drives the off-by-one count to zero (it does not).
function signBand(loExp, hiExp, step) {
  const seeds = [];
  for (let e = loExp; e <= hiExp + 1e-9; e += step) seeds.push(Math.pow(10, e));
  let offByOne = 0;
  let plusOne = 0; // residual = +1 (single-rate law over-counts)
  let minusOne = 0; // residual = -1 (single-rate law under-counts)
  // Baseline (no offset) and +1-offset populations, over ALL seeds, to test the fixed-offset corollary.
  let exact0 = 0;
  let exactPlus1 = 0;
  let offByOnePlus1 = 0;
  // Per-seed residual trace (exponent + resid), so a viz page can plot the grid without recomputing.
  const trace = [];
  for (const s of seeds) {
    const resid = itersToFloorPredicted(s) - itersToFloorMeasured(s);
    if (Math.abs(resid) === 1) {
      offByOne++;
      if (resid > 0) plusOne++;
      else minusOne++;
    }
    if (resid === 0) exact0++;
    const residPlus1 = resid + 1;
    if (residPlus1 === 0) exactPlus1++;
    else if (Math.abs(residPlus1) === 1) offByOnePlus1++;
    trace.push({ log10Seed: +Math.log10(s).toPrecision(6), resid });
  }
  return {
    points: seeds.length,
    offByOne,
    plusOne, // count of +1 residuals (over-count)
    minusOne, // count of -1 residuals (under-count)
    signIsUniform: plusOne === 0 || minusOne === 0,
    uniformSign: offByOne === 0 ? 0 : plusOne === 0 ? -1 : minusOne === 0 ? 1 : null, // null = mixed
    exact_no_offset: exact0,
    exact_plus1_offset: exactPlus1, // exact count AFTER applying k_single + 1 to every seed
    off_by_one_plus1_offset: offByOnePlus1, // off-by-one count AFTER the +1 offset (should NOT be zero)
    trace, // [{log10Seed, resid}] across the whole grid, for plotting
  };
}

// The higher-N bands imp-34798/imp-34845 measured, now examined for residual SIGN and offset invariance.
const BAND_31 = signBand(9, 12, 0.1);
const BAND_61 = signBand(9, 12, 0.05);

const TOTAL_OFF_BY_ONE = BAND_31.offByOne + BAND_61.offByOne;
const TOTAL_PLUS_ONE = BAND_31.plusOne + BAND_61.plusOne;
const TOTAL_MINUS_ONE = BAND_31.minusOne + BAND_61.minusOne;
const SIGN_IS_UNIFORM = BAND_31.signIsUniform && BAND_61.signIsUniform && BAND_31.uniformSign === BAND_61.uniformSign;
const UNIFORM_SIGN = SIGN_IS_UNIFORM ? BAND_31.uniformSign : null;
// The fixed +1 offset does NOT remove the off-by-one on either band (both stay strictly positive).
const OFFSET_FIXES_IT =
  BAND_31.off_by_one_plus1_offset === 0 && BAND_61.off_by_one_plus1_offset === 0;

export const IMP34887_ITERS_TO_FLOOR_RESIDUAL_SIGN = {
  id: 'imp-34887',
  proofSection: 'S-frontier',
  question:
    'imp-34845 proved the imp-34798 iters-to-floor off-by-one is INTRINSIC (transient-vs-asymptotic, not ' +
    'ceil-rounding) and imp-34862 showed a two-rate law does NOT remove it. Test the SIMPLER hypothesis: does ' +
    'the off-by-one carry a DETERMINISTIC SIGN across the seed band (single-rate law always over- or ' +
    'under-counts), so a fixed +/-1 CONSTANT offset -- not a re-fitted rate -- removes it, distinct from the ' +
    'imp-34862 two-rate re-parametrization? Measure sign(k_single - k_measured) at every off-by-one seed over ' +
    '[1e9,1e12] at 10^0.1 and 10^0.05, and test whether a fixed offset drives the off-by-one count to zero.',
  constants: {
    contraction_rate_r: +R_CONTRACT.toPrecision(6), // ~0.0454235 (h=1 stencil, as imp-34775/34798/34845)
    log_law_constant_ln_inv_r: +LN_INV_R.toPrecision(6), // ~3.09173 nats/iterate
    eps_fp: EPS_FP, // 2.3e-16 machine-epsilon agreement floor
    r0_ratio_fit_low: 0.0404, // imp-34862 early-transient ratio-fit rate lower bound (VERBATIM)
    r0_ratio_fit_high: 0.0467, // imp-34862 early-transient ratio-fit rate upper bound (VERBATIM)
  },
  sign_bands: {
    'band_31_step_0p1_1e9_to_1e12': BAND_31,
    'band_61_step_0p05_1e9_to_1e12': BAND_61,
  },
  summary: {
    total_off_by_one_seeds: TOTAL_OFF_BY_ONE, // 31 across both bands (10 + 21), matches imp-34798/34845
    total_plus_one_residuals: TOTAL_PLUS_ONE, // 0 -- NOT ONE seed over-counts
    total_minus_one_residuals: TOTAL_MINUS_ONE, // 31 -- every off-by-one is an UNDER-count
    residual_sign_is_uniform: SIGN_IS_UNIFORM, // true
    uniform_sign_value: UNIFORM_SIGN, // -1 (single-rate law systematically under-counts where it errs)
    fixed_offset_removes_off_by_one: OFFSET_FIXES_IT, // false -- the corollary is REFUTED
    why_offset_does_not_fix:
      'a uniform residual sign is NECESSARY but NOT SUFFICIENT for a constant-offset fix. Applying the +1 ' +
      'offset (k_single + 1) to ALL seeds INVERTS the population rather than curing it: on the 31-point band ' +
      'the exact count goes 21 -> 10 (off-by-one 10 -> 21), on the 61-point band 40 -> 21 (off-by-one ' +
      '21 -> 40). A fixed offset merely TRANSLATES the error onto the complementary seed subset, because the ' +
      'off-by-one is a SEED-SELECTIVE terminal-ceil boundary crossing (continuous eps_fp threshold vs discrete ' +
      'bit-identical Picard stop at different seeds), NOT a global additive bias -- the same terminal-ceil ' +
      'obstruction imp-34862 found blocks the two-rate route.',
    verdict_on_ticket_question:
      'The residual sign is DETERMINISTIC and uniformly -1 (the single-rate law NEVER over-counts; where it ' +
      'errs it under-counts by exactly one iterate), so the mixed-sign branch that would MANDATE a two-rate ' +
      'model is ruled out. BUT the uniform sign does NOT make a fixed +/-1 constant offset a valid fix: a ' +
      'global offset cannot remove a seed-selective ceil crossing, it only relocates it to the complementary ' +
      'seeds. Both the fixed-offset route (this ticket) and the two-rate route (imp-34862) fail for the SAME ' +
      'terminal-ceil reason.',
  },
  finding:
    'Recording the SIGNED residual k_single - k_measured (rather than its absolute value) at every off-by-one ' +
    'seed over [1e9,1e12] shows a perfectly DETERMINISTIC sign: all 10 of 31 off-by-ones at 10^0.1 spacing and ' +
    'all 21 of 61 at 10^0.05 spacing are -1; NOT ONE seed over-counts. The single-rate log law, where it errs, ' +
    'systematically UNDER-counts by exactly one iterate -- confirming the direction of the imp-34862 ' +
    'transient-vs-asymptotic picture (ratio-fit r_0 ~ 0.0404..0.0467 straddling r ~ 0.045424; the ' +
    'asymptotic-rate law lands one iterate short). HOWEVER the fixed-offset corollary the ticket hypothesized ' +
    'is REFUTED: applying the natural +1 offset to ALL seeds does NOT drive the off-by-one count to zero -- it ' +
    'INVERTS the population (31-band exact 21 -> 10, off-by-one 10 -> 21; 61-band exact 40 -> 21, off-by-one ' +
    '21 -> 40). A fixed offset merely translates the error onto the complementary seed subset because the ' +
    'off-by-one is a SEED-SELECTIVE terminal-ceil boundary crossing, not a global additive bias. So the sign ' +
    'is uniform (ruling out the mixed-sign / mandatory-two-rate branch), yet neither a fixed constant offset ' +
    'nor a re-fitted second rate removes the +/-1: both fail for the SAME terminal-ceil discretization reason ' +
    'imp-34862 identified.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT an RH bound). The SIGNED iters-to-floor residual k_single - ' +
    'k_measured is uniformly -1 at every one of the 31 off-by-one seeds across the dense 31-point (10^0.1) and ' +
    '61-point (10^0.05) sweeps of [1e9,1e12]: the single-rate log law never over-counts and under-counts by ' +
    'exactly one iterate where it errs, a deterministic sign (never mixed +1/-1). This rules out the ' +
    'mixed-sign branch that would MANDATE a two-rate model. But the fixed-offset corollary is REFUTED: a +1 ' +
    'offset applied to all seeds does NOT zero the off-by-one count -- it inverts the population (exact 21 -> ' +
    '10 on the 31-band, 40 -> 21 on the 61-band), because the off-by-one is a seed-selective TERMINAL-ceil ' +
    'crossing, not a global additive bias. Neither a fixed constant offset nor the imp-34862 two-rate law can ' +
    'span a per-seed ceil discretization -- both fail for the same reason. IEEE-754 double precision; the ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_C 1/8 ' +
    'ansatz (imp-2642/imp-2643) and the C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 ' +
    'untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34862 (sibling: two-rate law fails; residual lives in the terminal ceil); imp-34845 (parent: ' +
    'off-by-one is INTRINSIC, not a ceil-rounding ambiguity); imp-34798 (grandparent: dense higher-N ' +
    're-measure, bounded +/-1 off-by-one); imp-34775 (derives the closed-form log law and the ceil rounding ' +
    'floor); imp-2642 (C_C = (1/8) sqrt(3 pi) 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN ' +
    'Riemann-von Mangoldt inverse).',
};

export const IMP34887_ITERS_TO_FLOOR_RESIDUAL_SIGN_ASSERTIONS = [
  {
    // The same off-by-one populations imp-34798/imp-34845 reported reappear here.
    id: 'imp34887-off-by-one-counts-match-parents',
    description: 'off-by-one counts reproduce imp-34798/imp-34845: 10 of 31 and 21 of 61',
    holds: () =>
      BAND_31.offByOne === 10 && BAND_61.offByOne === 21 && TOTAL_OFF_BY_ONE === 31,
  },
  {
    // The residual sign is uniformly -1: no seed over-counts, every off-by-one under-counts.
    id: 'imp34887-residual-sign-uniformly-minus-one',
    description: 'every off-by-one residual k_single - k_measured is -1 (no over-counts) across both bands',
    holds: () =>
      TOTAL_PLUS_ONE === 0 &&
      TOTAL_MINUS_ONE === 31 &&
      SIGN_IS_UNIFORM === true &&
      UNIFORM_SIGN === -1,
  },
  {
    // A fixed +1 offset does NOT remove the off-by-one -- it inverts the population.
    id: 'imp34887-fixed-offset-does-not-fix',
    description: 'the +1 constant offset inverts the population rather than zeroing the off-by-one count',
    holds: () =>
      OFFSET_FIXES_IT === false &&
      BAND_31.exact_no_offset === 21 &&
      BAND_31.exact_plus1_offset === 10 &&
      BAND_31.off_by_one_plus1_offset === 21 &&
      BAND_61.exact_no_offset === 40 &&
      BAND_61.exact_plus1_offset === 21 &&
      BAND_61.off_by_one_plus1_offset === 40,
  },
  {
    // Honesty gate: sign/uniformity measurement of a surrogate count, not rigorous, no QED, no refereed bound is changed.
    id: 'imp34887-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34887_ITERS_TO_FLOOR_RESIDUAL_SIGN.isRigorous === false &&
      /NO QED/.test(IMP34887_ITERS_TO_FLOOR_RESIDUAL_SIGN.verdict) &&
      /refereed bound is changed/i.test(IMP34887_ITERS_TO_FLOOR_RESIDUAL_SIGN.verdict),
  },
];

for (const a of IMP34887_ITERS_TO_FLOOR_RESIDUAL_SIGN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34887-iters-to-floor-residual-sign assertion failed: ${a.id}`);
  }
}
