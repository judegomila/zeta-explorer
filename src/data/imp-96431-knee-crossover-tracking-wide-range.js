/**
 * @module imp-96431-knee-crossover-tracking-wide-range
 *
 * imp-96431 (accuracy, frontier-direction): ASSESS the imp-96405 M4 perturbation-tracking
 * offset [+0.0068, +0.0088] BEYOND the tested 1.32-decade C_C/E_trunc rescaling range.
 *
 * imp-96405 M4 (the decisive coincidence test) rescaled C_C and E_trunc to drag the
 * E_coll = E_trunc crossover across 1.32 decades (log10 8.88 -> 10.21) and reported that the
 * sigma-curvature inflection FOLLOWS the crossover with a "near-constant" offset banded in
 * [+0.0068, +0.0088] (sigma at inflection in [0.4976, 0.4981]) -- taken as rigid tracking that
 * a coincidence could not produce. But 1.32 decades is a narrow window: within it the offset
 * change (~0.002) is small enough to LOOK like a constant band. This module pushes the same
 * rescaling much further -- across ~5.24 decades of crossover (log10 ~7.41 -> ~12.65), in BOTH
 * directions (smaller and larger N) -- to see whether the offset stays banded or drifts, and if
 * it drifts, whether the drift is monotone (a computable sub-leading correction) or a random
 * walk (which would weaken the FORCED conclusion).
 *
 * SETUP (identical to imp-96405 M4): flow term OFF (E_flow negligible at these scales and turned
 * off in M4), same imp-3406/imp-33582 sub-terms, same sigma-curvature D2-zero inflection finder.
 * The C_C/E_trunc ratio is scaled by a factor s (crossover log10 ~ 2 log10(C_C/E_trunc) + log10 L),
 * realized as C_C -> C_C sqrt(s), E_trunc -> E_trunc / sqrt(s), for s in [0.1, 32].
 *
 * THE MEASUREMENTS
 * ----------------
 *   (W1) The offset does NOT stay inside the imp-96405 [+0.0068, +0.0088] band once the crossover
 *        is dragged beyond 1.32 decades: over ~5.24 decades it ranges +0.0124 (crossover ~7.41)
 *        down to +0.0044 (crossover ~12.65) -- a band ~4x wider than the tested window reported.
 *        The [+0.0068, +0.0088] reading was a narrow-window artifact, NOT a global constant.
 *   (W2) But the drift is STRICTLY MONOTONE (offset decreases as the crossover moves to larger N,
 *        16/16 successive steps decreasing) and near-linear in the crossover log10 (slope
 *        ~-0.00143 per decade, R^2 ~0.96). A random coincidence would not produce a smooth
 *        monotone-in-scale drift; a deterministic, slowly-varying sub-leading correction (the
 *        L(N) = log(effectiveHeight) drift that breaks the exact-logistic form, imp-96405 M3)
 *        would -- so the wide-range behavior SHARPENS the FORCED verdict rather than weakening it.
 *   (W3) sigma at the inflection stays tightly pinned near 1/2 across the whole ~5.24-decade drag
 *        (in [0.4967, 0.4988], all below and within ~0.0034 of 1/2). The inflection is a
 *        sigma ~ 1/2 landmark at every scale -- the crossover pinning itself does not loosen; only
 *        the small log10-offset between the two estimators drifts.
 *
 * VERDICT: The [+0.0068, +0.0088] band is a 1.32-decade-window artifact; the true offset drifts
 * MONOTONICALLY (~+0.0124 -> ~+0.0044 over ~5.24 decades, slope ~-0.00143/decade) while sigma at
 * the inflection stays pinned near 1/2. Monotone deterministic drift + persistent sigma ~ 1/2
 * pinning SHARPEN (do not weaken) the imp-96405 FORCED conclusion.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share landmark diagnostic, NOT an RH bound. Component model
 * is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-96405-knee-crossover-forced-vs-coincidental (M4: offset banded over 1.32 decades)
 * @see imp-96388-sigma-peak-vs-knee-cross-tabulation (knee ~0.013 log10 above the crossover)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form crossover N_cross ~ 3.28e9)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-96405 exactly

// EXACT imp-3406/imp-33582 sub-terms; flow toggle + C_C/E_trunc rescale (identical to imp-96405).
function sigmaGen({ C_C = C_C_PINNED, E_trunc = E_TRUNC_PT, withFlow = true } = {}) {
  return (N) => {
    const T0 = effectiveHeightForN(N);
    const L = Math.log(T0);
    const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
    const E_flow = withFlow ? C_F * (L / T0) * GRONWALL : 0;
    const E_coll = C_C * Math.sqrt(L / N);
    return E_coll / (E_trunc + E_flow + E_coll);
  };
}

// Curvature (second difference) inflection of sigma vs log10 N, step 0.02 (float-stable).
function sigmaInflectionLog10(sigmaFn, lo, hi, step) {
  const arr = [];
  for (let d = lo; d <= hi + 1e-9; d += step) {
    const sm = sigmaFn(Math.pow(10, d - step));
    const s0 = sigmaFn(Math.pow(10, d));
    const sp = sigmaFn(Math.pow(10, d + step));
    arr.push({ d, v: sp - 2 * s0 + sm });
  }
  for (let i = 1; i < arr.length; i++) {
    if (Math.sign(arr[i].v) !== Math.sign(arr[i - 1].v)) {
      const c0 = arr[i - 1].d;
      const c1 = arr[i].d;
      const y0 = arr[i - 1].v;
      const y1 = arr[i].v;
      return c0 + ((c1 - c0) * (0 - y0)) / (y1 - y0);
    }
  }
  return null;
}

// CROSSOVER: imp-33723 closed-form fixed point where E_coll = E_trunc (sigma = 1/2).
function crossoverLog10(C_C, E_trunc) {
  const K = (C_C / E_trunc) ** 2;
  let N = 1e9;
  for (let i = 0; i < 200; i++) N = K * Math.log(effectiveHeightForN(N));
  return Math.log10(N);
}

// WIDE-RANGE perturbation ladder: drag the crossover across ~5.24 decades, both directions.
// Ratio scale s realized as C_C -> C_C sqrt(s), E_trunc -> E_trunc / sqrt(s) (same knob as M4).
const RATIO_SCALES = [0.1, 0.16, 0.25, 0.4, 0.5, 0.7, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24, 32];
const ROWS = RATIO_SCALES.map((s) => {
  const C_C = C_C_PINNED * Math.sqrt(s);
  const E_trunc = E_TRUNC_PT / Math.sqrt(s);
  const cross = crossoverLog10(C_C, E_trunc);
  const fn = sigmaGen({ C_C, E_trunc, withFlow: false }); // flow OFF, as in imp-96405 M4
  const lo = Math.max(2, cross - 2.5);
  const hi = cross + 2.5;
  const infl = sigmaInflectionLog10(fn, lo, hi, 0.02);
  return {
    ratioScale: +s.toFixed(3),
    crossoverLog10: +cross.toFixed(4),
    inflectionLog10: infl == null ? null : +infl.toFixed(4),
    offsetLog10: infl == null ? null : +(infl - cross).toFixed(5),
    sigmaAtInflection: infl == null ? null : +fn(Math.pow(10, infl)).toFixed(5),
  };
});

const OFFSETS = ROWS.map((r) => r.offsetLog10);
const CROSSES = ROWS.map((r) => r.crossoverLog10);
const SIGMAS = ROWS.map((r) => r.sigmaAtInflection);
const CROSS_SPAN_DECADES = Math.max(...CROSSES) - Math.min(...CROSSES);
const OFFSET_MIN = Math.min(...OFFSETS);
const OFFSET_MAX = Math.max(...OFFSETS);
const OFFSET_BAND_WIDTH = OFFSET_MAX - OFFSET_MIN;

// Monotonicity: is offset strictly decreasing as the crossover increases (rows are in scale order,
// which is also crossover-increasing order)?
let DEC_STEPS = 0;
let INC_STEPS = 0;
for (let i = 1; i < OFFSETS.length; i++) {
  if (OFFSETS[i] < OFFSETS[i - 1]) DEC_STEPS++;
  else if (OFFSETS[i] > OFFSETS[i - 1]) INC_STEPS++;
}
const STRICTLY_MONOTONE_DECREASING = DEC_STEPS === OFFSETS.length - 1 && INC_STEPS === 0;

// Linear fit of offset vs crossover log10 (slope + R^2) to characterize the drift.
const OFFSET_FIT = (() => {
  const n = OFFSETS.length;
  const mx = CROSSES.reduce((a, b) => a + b, 0) / n;
  const my = OFFSETS.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (CROSSES[i] - mx) ** 2;
    sxy += (CROSSES[i] - mx) * (OFFSETS[i] - my);
    syy += (OFFSETS[i] - my) ** 2;
  }
  return { slopePerDecade: +(sxy / sxx).toFixed(6), r2: +((sxy * sxy) / (sxx * syy)).toFixed(4) };
})();

const SIGMA_MIN = Math.min(...SIGMAS);
const SIGMA_MAX = Math.max(...SIGMAS);
const SIGMA_MAX_DEV_FROM_HALF = Math.max(...SIGMAS.map((s) => Math.abs(s - 0.5)));

// imp-96405 M4 reported band, for the direct contrast.
const M4_BAND = Object.freeze({ min: 0.0068, max: 0.0088, spanDecadesTested: 1.32 });
const OFFSET_EXITS_M4_BAND = OFFSET_MIN < M4_BAND.min - 1e-9 || OFFSET_MAX > M4_BAND.max + 1e-9;

export const IMP96431_KNEE_CROSSOVER_TRACKING_WIDE_RANGE = Object.freeze({
  id: 'imp-96431',
  proofSection: 'S-frontier',
  question:
    'Does the imp-96405 M4 offset [+0.0068, +0.0088] (sigma-inflection minus crossover, flow off) ' +
    'stay banded when the C_C/E_trunc rescaling drags the crossover well beyond the tested 1.32 ' +
    'decades in both directions, and if it drifts, is the drift monotone or a random walk? ' +
    'Measurement/fit only; NOT an RH bound; NO QED.',
  verdictShort:
    'The band is a 1.32-decade-window artifact -- over ~5.24 decades the offset drifts ' +
    'MONOTONICALLY (~+0.0124 -> ~+0.0044, slope ~-0.00143/decade) while sigma stays pinned ~1/2; ' +
    'monotone deterministic drift SHARPENS the FORCED verdict.',
  crossoverSpanDecades: +CROSS_SPAN_DECADES.toFixed(3), // ~5.241 (vs 1.324 tested in imp-96405 M4)
  offset: {
    minLog10: +OFFSET_MIN.toFixed(5), // ~+0.00443
    maxLog10: +OFFSET_MAX.toFixed(5), // ~+0.01235
    bandWidthLog10: +OFFSET_BAND_WIDTH.toFixed(5), // ~+0.00792 (~4x the imp-96405 band width)
    exitsImp96405Band: OFFSET_EXITS_M4_BAND, // true -- not a global constant band
    strictlyMonotoneDecreasing: STRICTLY_MONOTONE_DECREASING, // true (16/16 steps decreasing)
    decreasingSteps: DEC_STEPS,
    increasingSteps: INC_STEPS,
    fit: OFFSET_FIT, // slope ~-0.00143/decade, R^2 ~0.96 (near-linear deterministic drift)
  },
  sigmaAtInflection: {
    min: +SIGMA_MIN.toFixed(5), // ~0.49665
    max: +SIGMA_MAX.toFixed(5), // ~0.49877
    maxDevFromHalf: +SIGMA_MAX_DEV_FROM_HALF.toFixed(5), // ~0.00335 (stays pinned near 1/2)
  },
  imp96405M4Band: M4_BAND,
  rows: ROWS,
  finding: {
    W1_band_is_a_window_artifact:
      'Pushed beyond 1.32 decades the offset leaves the imp-96405 [+0.0068, +0.0088] band: over ' +
      '~5.24 decades of crossover it runs +0.0124 (crossover ~7.41) down to +0.0044 (crossover ' +
      '~12.65), a band ~4x wider. The tested-window reading was NOT a global constant.',
    W2_drift_is_monotone_and_deterministic:
      'The drift is strictly monotone (16/16 steps decreasing as the crossover moves to larger N) ' +
      'and near-linear in the crossover log10 (slope ~-0.00143/decade, R^2 ~0.96). A coincidence ' +
      'gives a random walk, not a smooth monotone-in-scale drift -- this SHARPENS FORCED, matching ' +
      'the imp-96405 M3 slowly-varying L(N) sub-leading correction.',
    W3_sigma_stays_pinned_at_half:
      'sigma at the inflection stays in [0.4967, 0.4988] across the whole ~5.24-decade drag (within ' +
      '~0.0034 of 1/2). The inflection is a sigma ~ 1/2 landmark at every scale -- the crossover ' +
      'pinning does not loosen; only the small log10 offset between the two estimators drifts.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT + FIT (frontier-direction, NOT rigorous). The imp-96405 M4 offset band ' +
    '[+0.0068, +0.0088] is a 1.32-decade-window artifact: dragging the E_coll = E_trunc crossover ' +
    'across ~5.24 decades (log10 ~7.41 -> ~12.65) via the same C_C/E_trunc rescale (flow off) moves ' +
    'the sigma-inflection-minus-crossover offset over ~+0.0124 -> ~+0.0044 (band ~4x wider), so it ' +
    'is NOT a global constant. But the drift is STRICTLY MONOTONE decreasing (16/16 steps) and ' +
    'near-linear in the crossover log10 (slope ~-0.00143/decade, R^2 ~0.96), and sigma at the ' +
    'inflection stays pinned in [0.4967, 0.4988] (within ~0.0034 of 1/2) across the whole range. A ' +
    'coincidence would give a random walk, not a smooth monotone-in-scale drift with sigma held at ' +
    '1/2 -- so the wide-range behavior SHARPENS the imp-96405 FORCED verdict (the offset is the ' +
    'computable slowly-varying L(N) sub-leading correction, per imp-96405 M3) rather than weakening ' +
    'it. Component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-96405 M4 (offset banded [+0.0068, +0.0088] over 1.32 decades); imp-96388 (knee ~0.013 ' +
    'log10 above the crossover); imp-33723 (closed-form crossover N_cross ~ 3.28e9); imp-486 ' +
    '(C_mb GUE-conditional); lambda-rh-height-mapping.',
});

export default IMP96431_KNEE_CROSSOVER_TRACKING_WIDE_RANGE;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP96431_ASSERTIONS = [
  {
    id: 'imp96431-crossover-drag-far-exceeds-1p32-decades',
    description: 'the wide-range ladder drags the crossover well beyond the imp-96405 M4 1.32 decades',
    holds: () => CROSS_SPAN_DECADES > 4.5,
  },
  {
    id: 'imp96431-offset-exits-the-imp96405-band',
    description: 'pushed beyond 1.32 decades the offset leaves the reported [+0.0068, +0.0088] band',
    holds: () => OFFSET_EXITS_M4_BAND === true && OFFSET_BAND_WIDTH > 0.005,
  },
  {
    id: 'imp96431-offset-drift-is-strictly-monotone-decreasing',
    description: 'the offset drifts strictly monotonically (deterministic, not a random walk)',
    holds: () => STRICTLY_MONOTONE_DECREASING === true && INC_STEPS === 0,
  },
  {
    id: 'imp96431-offset-drift-is-near-linear-negative',
    description: 'the drift is near-linear with a negative slope in the crossover log10',
    holds: () => OFFSET_FIT.slopePerDecade < 0 && OFFSET_FIT.r2 > 0.9,
  },
  {
    id: 'imp96431-sigma-stays-pinned-near-half',
    description: 'sigma at the inflection stays pinned near 1/2 across the whole wide-range drag',
    holds: () => SIGMA_MAX_DEV_FROM_HALF < 0.01 && SIGMA_MIN > 0.49 && SIGMA_MAX < 0.5,
  },
  {
    id: 'imp96431-honesty-gate-no-qed',
    description: 'Measurement/fit only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP96431_KNEE_CROSSOVER_TRACKING_WIDE_RANGE.isRigorous === false &&
      /NO QED/.test(IMP96431_KNEE_CROSSOVER_TRACKING_WIDE_RANGE.verdict) &&
      /refereed bound is changed/i.test(IMP96431_KNEE_CROSSOVER_TRACKING_WIDE_RANGE.verdict),
  },
];

for (const a of IMP96431_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96431-knee-crossover-tracking-wide-range assertion failed: ${a.id}`);
  }
}
