/**
 * @module imp-34903-iters-to-floor-residual-sign-wide-band
 *
 * imp-34903 (numerical, frontier-direction): imp-34887 measured the SIGNED iters-to-floor residual
 *   resid(seed) = k_single(seed) - k_measured(seed) at every off-by-one seed and found it uniformly -1
 *   (the single-rate log law never over-counts; where it errs it under-counts by exactly one iterate) --
 *   but ONLY on the [1e9,1e12] window at the 31-point (10^0.1) and 61-point (10^0.05) spacings. That window
 *   straddles the imp-33721 sigmoid-knee decade (N* ~ 3.38e9) and the sigma-halving landmark. This module
 *   EXTENDS the signed-residual sweep to a far wider [1e6,1e15] band on the same 10^0.05 grid -- three
 *   decades below and three decades above the tested window -- to test whether the uniform -1 sign is truly
 *   BAND-WIDE or whether mixed +1/-1 signs appear far from the knee, which would MANDATE the imp-34862
 *   two-rate model that the terminal-ceil obstruction otherwise rules out.
 *
 * WHAT IS MEASURED
 * ----------------
 * The SAME map g(N) = K log T0(N), amplitude K, fixed point N_CROSS_FP, contraction rate r, log-law
 * constant ln(1/r), ceil argument x, and single-rate predicted count k_single = 1 + ceil(x) as
 * imp-34887/imp-34845/imp-34798 -- reused VERBATIM. Only the seed band widens: [1e6,1e15] on the 10^0.05
 * grid (181 seeds), versus imp-34887's [1e9,1e12] (61 seeds). The signed residual is recorded at every
 * off-by-one seed, and the band is split into three sub-bands (below 1e9, the original [1e9,1e12] window,
 * above 1e12) to LOCALIZE where the off-by-ones live.
 *
 * THE RESULT: THE -1 SIGN IS BAND-WIDE, AND OFF-BY-ONES VANISH ABOVE 1e12
 * ----------------------------------------------------------------------
 * Across the full [1e6,1e15] band there are 34 off-by-one seeds and EVERY ONE is -1: NOT ONE seed
 * over-counts, three decades below the knee OR three decades above. The mixed +1/-1 branch that would
 * mandate a re-fitted two-rate model does NOT appear anywhere in the widened band. Localizing the
 * off-by-ones by sub-band is itself informative:
 *   - below [1e6,1e9):     13 off-by-one, all -1
 *   - window [1e9,1e12]:   21 off-by-one, all -1  (reproduces imp-34887 verbatim)
 *   - above (1e12,1e15]:    0 off-by-one           (the single-rate law is EXACT far above the knee)
 * So the off-by-one population is concentrated at and BELOW the sigmoid-knee decade and dies out entirely
 * three decades above it: far above the crossover the collapse distance is large enough that the terminal
 * ceil argument never straddles an integer boundary. The deterministic under-count is a low-N / near-knee
 * phenomenon, not a band-wide constant -- but where it occurs its sign is invariant.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A band-width extension of the imp-34887 signed-residual measurement. MEASUREMENT ONLY on the inherited
 * imp-3220/imp-3406 surrogate map, IEEE-754 double precision, no interval enclosure (compare imp-34693a;
 * imp-34845 showed the honest interval is too narrow to matter here). The C_C = (1/8) sqrt(3 pi) ansatz
 * (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0
 * untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34887-iters-to-floor-residual-sign (parent: -1 sign on [1e9,1e12]; fixed-offset corollary refuted)
 * @see imp-34862-iters-to-floor-two-rate-law (two-rate law fails; residual lives in terminal ceil)
 * @see imp-34845-iters-to-floor-interval-ceil (off-by-one is INTRINSIC, not a ceil-rounding ambiguity)
 * @see imp-34798-iters-to-floor-log-law-higher-N (dense higher-N re-measure, bounded +/-1)
 * @see imp-34775-iters-to-floor-log-law (derives the closed-form log law and the ceil rounding floor)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34775/imp-34887)
const EPS_FP = 2.3e-16; // the ~machine-epsilon relative agreement floor named in imp-34755/imp-34775

// The shared imp-33723/imp-34693/imp-34755/imp-34775/imp-34887 fixed-point map g(N) = K log T0(N).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterate(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}

// The unique double-precision fixed point (route B, converged) -- identical to imp-34887/imp-34845.
const N_CROSS_FP = iterate(1e9, 200); // 3280294351.65240669

// Central-difference contraction rate (h=1 stencil, the rate the log law uses; identical to imp-34887).
const gPrimeAtStep = (h) => (g(N_CROSS_FP + h) - g(N_CROSS_FP - h)) / (2 * h);
const R_CONTRACT = Math.abs(gPrimeAtStep(1)); // ~0.0454235
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.09173 nats/iterate (the log-law constant)

// Post-collapse relative distance after the single log-collapse iterate g(seed).
const collapseDist = (seed) => Math.abs(g(seed) - N_CROSS_FP) / N_CROSS_FP;

// THE POINT-VALUED CEIL ARGUMENT and the single-rate predicted count (imp-34775/imp-34887).
const xArg = (seed) => Math.log(collapseDist(seed) / EPS_FP) / LN_INV_R;
const itersToFloorPredicted = (seed) => 1 + Math.ceil(xArg(seed));

// Directly-measured Picard count: iterates until bit-identical to the fixed point (matches imp-34887).
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

// Record the SIGNED residual k_single - k_measured over a seed band on the 10^step grid, tallying the +1
// (over-count) and -1 (under-count) populations so a mixed sign anywhere is detectable.
function signBand(loExp, hiExp, step) {
  const seeds = [];
  for (let e = loExp; e <= hiExp + 1e-9; e += step) seeds.push(Math.pow(10, e));
  let offByOne = 0;
  let plusOne = 0; // residual = +1 (single-rate law over-counts)
  let minusOne = 0; // residual = -1 (single-rate law under-counts)
  let exact = 0;
  const pointwise = []; // {logSeed, resid} at every grid point, for per-seed viz
  for (const s of seeds) {
    const resid = itersToFloorPredicted(s) - itersToFloorMeasured(s);
    pointwise.push({ logSeed: +Math.log10(s).toPrecision(6), resid });
    if (Math.abs(resid) === 1) {
      offByOne++;
      if (resid > 0) plusOne++;
      else minusOne++;
    } else if (resid === 0) {
      exact++;
    }
  }
  return {
    points: seeds.length,
    offByOne,
    plusOne,
    minusOne,
    exact,
    signIsUniform: plusOne === 0 || minusOne === 0,
    uniformSign: offByOne === 0 ? 0 : plusOne === 0 ? -1 : minusOne === 0 ? 1 : null, // null = mixed
    pointwise,
  };
}

// The widened band and its three localizing sub-bands, all on the 10^0.05 grid.
const BAND_WIDE = signBand(6, 15, 0.05); // [1e6,1e15], 181 seeds
const SUB_BELOW = signBand(6, 8.95, 0.05); // below the tested window: [1e6,1e9)
const SUB_WINDOW = signBand(9, 12, 0.05); // the imp-34887 window: [1e9,1e12]
const SUB_ABOVE = signBand(12.05, 15, 0.05); // above the tested window: (1e12,1e15]

const SIGN_IS_BAND_WIDE = BAND_WIDE.signIsUniform && BAND_WIDE.plusOne === 0;

export const IMP34903_ITERS_TO_FLOOR_RESIDUAL_SIGN_WIDE_BAND = {
  id: 'imp-34903',
  proofSection: 'S-frontier',
  question:
    'imp-34887 found the signed iters-to-floor residual k_single - k_measured uniformly -1 (single-rate law ' +
    'never over-counts) but only on [1e9,1e12] straddling the imp-33721 sigmoid-knee decade. Extend the ' +
    'signed-residual sweep to a far wider [1e6,1e15] band on the 10^0.05 grid -- three decades below and above ' +
    'the tested window -- to measure whether the uniform -1 sign is truly BAND-WIDE or whether mixed +1/-1 ' +
    'signs appear far from the knee, which would MANDATE the imp-34862 two-rate model.',
  constants: {
    contraction_rate_r: +R_CONTRACT.toPrecision(6), // ~0.0454235 (h=1 stencil, as imp-34775/34887)
    log_law_constant_ln_inv_r: +LN_INV_R.toPrecision(6), // ~3.09173 nats/iterate
    eps_fp: EPS_FP, // 2.3e-16 machine-epsilon agreement floor
    band_lo_exp: 6, // 1e6
    band_hi_exp: 15, // 1e15
    grid_step_exp: 0.05, // 10^0.05 spacing (same grid as the imp-34887 61-point band)
  },
  wide_band: {
    'band_wide_step_0p05_1e6_to_1e15': BAND_WIDE,
    sub_below_1e6_to_1e9: SUB_BELOW,
    sub_window_1e9_to_1e12: SUB_WINDOW, // reproduces imp-34887 band_61 verbatim (21 off-by-one, all -1)
    sub_above_1e12_to_1e15: SUB_ABOVE, // 0 off-by-one: single-rate law is EXACT far above the knee
  },
  // per-seed {logSeed, resid} across the full [1e6,1e15] grid, for the imp-34937 pointwise viz.
  wide_band_pointwise: BAND_WIDE.pointwise,
  summary: {
    wide_band_points: BAND_WIDE.points, // 181
    wide_band_off_by_one: BAND_WIDE.offByOne, // 34
    wide_band_plus_one_residuals: BAND_WIDE.plusOne, // 0 -- NOT ONE seed over-counts band-wide
    wide_band_minus_one_residuals: BAND_WIDE.minusOne, // 34 -- every off-by-one is an UNDER-count
    residual_sign_is_band_wide: SIGN_IS_BAND_WIDE, // true
    off_by_one_localization: {
      below_1e9: SUB_BELOW.offByOne, // 13
      window_1e9_1e12: SUB_WINDOW.offByOne, // 21 (matches imp-34887)
      above_1e12: SUB_ABOVE.offByOne, // 0
    },
    verdict_on_ticket_question:
      'The uniform -1 residual sign is BAND-WIDE: across the widened [1e6,1e15] sweep all 34 off-by-one seeds ' +
      'are -1 (0 over-counts), three decades below the knee and three decades above. NO mixed +1/-1 signs ' +
      'appear anywhere, so the branch that would MANDATE the imp-34862 two-rate model is ruled out over the ' +
      'full band, not just the imp-34887 window. The off-by-one population is concentrated at and below the ' +
      'sigmoid-knee decade (13 below 1e9, 21 in [1e9,1e12]) and vanishes entirely above 1e12 (0 off-by-one), ' +
      'where the collapse distance is large enough that the terminal ceil never straddles an integer -- so ' +
      'the deterministic under-count is a near-knee / low-N phenomenon whose sign is invariant where it occurs.',
  },
  finding:
    'Widening the imp-34887 signed-residual sweep from [1e9,1e12] to [1e6,1e15] on the same 10^0.05 grid (181 ' +
    'seeds) keeps the sign perfectly deterministic: all 34 off-by-one seeds across the band are -1, NOT ONE ' +
    'over-counts, three decades below the sigmoid knee OR three decades above it. Localizing by sub-band, the ' +
    'off-by-ones sit at and below the knee decade (13 in [1e6,1e9), 21 in [1e9,1e12] reproducing imp-34887 ' +
    'verbatim) and vanish entirely above 1e12 (0 off-by-one: the single-rate log law is EXACT that far above ' +
    'the crossover, where the post-collapse distance is large enough that the terminal ceil argument never ' +
    'straddles an integer). So the uniform -1 sign is BAND-WIDE -- ruling out the mixed-sign branch that would ' +
    'mandate the imp-34862 two-rate model over the whole band, not just the tested window -- while the ' +
    'deterministic under-count itself is a near-knee / low-N effect, not a band-wide constant.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT an RH bound). Extending the imp-34887 SIGNED iters-to-floor residual ' +
    'k_single - k_measured from [1e9,1e12] to a wider [1e6,1e15] band on the 10^0.05 grid (181 seeds) shows ' +
    'the uniform -1 sign is BAND-WIDE: all 34 off-by-one seeds are -1 (0 over-counts), three decades below the ' +
    'imp-33721 sigmoid knee and three decades above. No mixed +1/-1 signs appear anywhere, so the branch that ' +
    'would MANDATE the imp-34862 two-rate model is ruled out over the full band. The off-by-one population is ' +
    'concentrated at and below the knee decade (13 below 1e9, 21 in [1e9,1e12] reproducing imp-34887) and ' +
    'vanishes above 1e12 (0 off-by-one -- the single-rate law is exact far above the crossover). IEEE-754 ' +
    'double precision; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643) and the C_mb GUE-conditional per imp-486 are ' +
    'UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34887 (parent: -1 residual sign on [1e9,1e12]; fixed-offset corollary refuted); imp-34862 (two-rate ' +
    'law fails; residual lives in the terminal ceil); imp-34845 (off-by-one is INTRINSIC, not a ceil-rounding ' +
    'ambiguity); imp-34798 (dense higher-N re-measure, bounded +/-1); imp-34775 (derives the closed-form log ' +
    'law and the ceil rounding floor); imp-33721 (sigmoid-knee decade N* ~ 3.38e9); imp-2642 (C_C = (1/8) ' +
    'sqrt(3 pi) ansatz); lambda-rh-height-mapping (effectiveHeightForN Riemann-von Mangoldt inverse).',
};

export const IMP34903_ITERS_TO_FLOOR_RESIDUAL_SIGN_WIDE_BAND_ASSERTIONS = [
  {
    // The original imp-34887 window reproduces verbatim inside the widened sweep.
    id: 'imp34903-window-reproduces-imp34887',
    description: 'the [1e9,1e12] sub-band reproduces imp-34887: 61 points, 21 off-by-one, all -1',
    holds: () =>
      SUB_WINDOW.points === 61 &&
      SUB_WINDOW.offByOne === 21 &&
      SUB_WINDOW.minusOne === 21 &&
      SUB_WINDOW.plusOne === 0,
  },
  {
    // The uniform -1 sign is band-wide: no over-count anywhere in [1e6,1e15].
    id: 'imp34903-sign-is-band-wide-minus-one',
    description: 'across [1e6,1e15] all 34 off-by-one residuals are -1 (0 over-counts)',
    holds: () =>
      BAND_WIDE.points === 181 &&
      BAND_WIDE.offByOne === 34 &&
      BAND_WIDE.plusOne === 0 &&
      BAND_WIDE.minusOne === 34 &&
      SIGN_IS_BAND_WIDE === true,
  },
  {
    // Off-by-ones concentrate at/below the knee and vanish above 1e12.
    id: 'imp34903-off-by-one-localization',
    description: 'off-by-one localization: 13 below 1e9, 21 in [1e9,1e12], 0 above 1e12',
    holds: () =>
      SUB_BELOW.offByOne === 13 &&
      SUB_WINDOW.offByOne === 21 &&
      SUB_ABOVE.offByOne === 0 &&
      SUB_BELOW.minusOne === 13 &&
      SUB_ABOVE.plusOne === 0,
  },
  {
    // Honesty gate: band-width measurement of a surrogate count, not rigorous, no QED, no refereed bound is changed.
    id: 'imp34903-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34903_ITERS_TO_FLOOR_RESIDUAL_SIGN_WIDE_BAND.isRigorous === false &&
      /NO QED/.test(IMP34903_ITERS_TO_FLOOR_RESIDUAL_SIGN_WIDE_BAND.verdict) &&
      /refereed bound is changed/i.test(IMP34903_ITERS_TO_FLOOR_RESIDUAL_SIGN_WIDE_BAND.verdict),
  },
];

for (const a of IMP34903_ITERS_TO_FLOOR_RESIDUAL_SIGN_WIDE_BAND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34903-iters-to-floor-residual-sign-wide-band assertion failed: ${a.id}`);
  }
}
