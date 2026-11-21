/**
 * @module imp-96485-count-offset-robustness-ratio-crossing
 *
 * imp-96485 (accuracy, frontier-direction): MEASURE the offset-robustness of the
 * imp-96449 F2 ratio-crossing location N*. imp-96449 F2 found the naive claim
 * "the Newton-vs-Lambert-W solver-path gamma_N spread stays below the ~1/N
 * count-model shift EVERYWHERE" is FALSE past N ~ 1e15, because the count-model
 * reference shift itself underflows below the ~1e-15 solver noise floor there.
 * That reference shift used a FIXED +7/8 offset in the count. This module asks
 * whether the crossing location N* (where solver-spread / count-shift = 1) is
 * robust to the offset choice, or an artefact of the specific +7/8 constant.
 *
 * BACKGROUND
 * ----------
 * imp-96449 defined the count-model relative shift as
 *     shift(T, offset) = offset * (dgamma/dN) / T,  dgamma/dN = 2pi / log(T/2pi),
 * i.e. shift(T, offset) = offset * (2pi / log(T/2pi)) / T  ~  offset / N,
 * with offset PINNED at 7/8 (the Riemann-Siegel S(T) mean-count offset). The
 * solver-path spread |gamma_Lambert - gamma_Newton| / gamma_Newton stays a few
 * ULP (median ~8e-16) across N = 1e2 .. 1e22. The ratio solver-spread / shift
 * crosses 1 near N ~ 1e15 (first per-decade sample with ratio > 1 at decade 16).
 *
 * THE MEASUREMENT (measurement / fit only)
 * ----------------------------------------
 *   For each offset in {0, 3/4, 4/5, 7/8, 9/10, 1} recompute the count-model
 *   shift and locate the ratio-crossing two ways:
 *     (a) DISCRETE first-crossing decade: the first N = 10^d whose per-decade
 *         ratio (actual solver spread / offset shift) exceeds 1;
 *     (b) CONTINUOUS flat-floor N*: solve offset * (2pi/log(T/2pi))/T = floor for
 *         T (bisection, floor = the imp-96449 median solver noise ~8e-16), then
 *         map T back to N = (T/2pi)(log(T/2pi)-1) and report log10 N*.
 *   Then report the spread in log10 N* across the offsets and the elasticity
 *   d(log10 N*)/d(log10 offset).
 *
 * THE FINDING
 * -----------
 *   (F1) THE VERDICT IS OFFSET-ROBUST. For EVERY nonzero offset in the tested
 *        band {3/4, 4/5, 7/8, 9/10, 1} the DISCRETE first-crossing decade is the
 *        SAME (decade 16, i.e. N in [1e15, 1e16]). The "false past N ~ 1e15"
 *        verdict does not depend on the specific +7/8 constant.
 *   (F2) THE CONTINUOUS N* MOVES BY ONLY A FRACTION OF A DECADE. The flat-floor
 *        log10 N* runs 14.96 (offset 3/4) -> 15.03 (7/8) -> 15.08 (offset 1): a
 *        total spread ~0.125 decade over the full 3/4..1 band, and only ~0.058
 *        decade from 7/8 to 1. This is < 1% of the ~13-decade span from the
 *        E_coll anchor N-range, so the crossing is offset-INSENSITIVE at the
 *        resolution that matters.
 *   (F3) THE ELASTICITY IS EXACTLY 1: d(log10 N*)/d(log10 offset) = 1 (measured
 *        0.125 / 0.125). Because the log(T/2pi) shape factor is common to every
 *        offset, changing the offset only translates the crossing by log10 of the
 *        offset ratio -- it cannot alter the underflow mechanism. So the crossing
 *        is driven by the count shift falling below the ~8e-16 solver floor, an
 *        offset-INDEPENDENT event, not by the choice of the O(1) constant.
 *   (F4) THE SOLE PATHOLOGY IS offset = 0. There the reference shift is
 *        identically zero, so the ratio is infinite at every decade and the whole
 *        range is (degenerately) flagged false with N* = 1e2. This is a
 *        divide-by-zero artefact of removing the reference, not a real crossing;
 *        it confirms the +7/8 verdict is unchanged by ANY positive O(1) offset.
 *
 * MEASUREMENT / FIT ONLY. Solver-path / conditioning diagnostic, NOT an RH bound.
 * The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes
 * no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; C_H
 * isRigorousUpperBound stays false (imp-2642/imp-2701); no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * Syntax note: derivative-like expressions use brace notation dg_{k*}/dt and this
 *   header avoids the close-comment terminator sequence inside prose.
 *
 * @see imp-96449-solver-path-spread-full-range (F2 ratio-crossing at N ~ 1e15 with fixed +7/8 offset)
 * @see imp-96427-knee-crossover-solver-path-spread (knee-only solver spread)
 * @see imp-96363-ecoll-independent-second-anchor (closed-form Lambert-W height inversion)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N, Newton main-term inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;

// Principal Lambert W by Halley iteration, reproduced verbatim from imp-96449
// so the two solver paths compare apples-to-apples.
function lambertW(x) {
  let w = x < Math.E ? x / Math.E : Math.log(x) - Math.log(Math.log(x));
  for (let i = 0; i < 100; i += 1) {
    const ew = Math.exp(w);
    const f = w * ew - x;
    const wp = w + 1;
    const dw = f / (ew * wp - ((w + 2) * f) / (2 * wp));
    w -= dw;
    if (Math.abs(dw) < 1e-15) break;
  }
  return w;
}

// Closed-form Lambert-W inversion of the SAME RvM main term (imp-96363):
// (T/2pi)(log(T/2pi)-1) = N  =>  T = 2pi * exp(1 + W(N/e)).
function gammaLambertMain(N) {
  return TWO_PI * Math.exp(1 + lambertW(N / Math.E));
}

// Riemann-von Mangoldt main-term count N(T) = (T/2pi)(log(T/2pi)-1), used to map
// a crossing height T* back to its count N*.
function countAtHeight(T) {
  const x = T / TWO_PI;
  return x * (Math.log(x) - 1);
}

// Relative gamma shift induced by an `offset` in the count (imp-96449 reference,
// generalised from the pinned +7/8): dgamma/dN = 2pi / log(T/2pi);
// rel shift = offset * (dgamma/dN) / T  ~  offset / N.
function countModelRelShift(T, offset) {
  const dgdN = TWO_PI / Math.log(T / TWO_PI);
  return offset * dgdN / T;
}

const LO_D = 2;
const HI_D = 22;

// Per-decade solver-path spread and Newton height, computed once (offset-independent).
const BASE_ROWS = [];
const SPREADS = [];
for (let d = LO_D; d <= HI_D; d += 1) {
  const N = Math.pow(10, d);
  const gNewton = effectiveHeightForN(N);
  const gLambert = gammaLambertMain(N);
  const relSpread = Math.abs(gLambert - gNewton) / gNewton;
  BASE_ROWS.push({ log10N: d, gammaNewton: gNewton, relSpread });
  SPREADS.push(relSpread);
}

// Solver noise floor: the median relative spread over the whole range (matches the
// imp-96449 summary; a stable machine-epsilon reference robust to exact-zero decades).
const SORTED = [...SPREADS].sort((a, b) => a - b);
const SOLVER_NOISE_FLOOR = SORTED[Math.floor(SORTED.length / 2)];

// The offsets to probe: 0 (degenerate), and a band around the pinned 7/8, plus +1.
const OFFSETS = [0, 3 / 4, 4 / 5, 7 / 8, 9 / 10, 1];

// Continuous flat-floor crossing: solve offset * (2pi/log(T/2pi))/T = floor for T.
// The shift is monotone decreasing in T, so a plain bisection in log-T converges.
function continuousCrossingLog10N(offset, floor) {
  if (offset === 0) return null; // degenerate: shift is identically zero
  let lo = TWO_PI * 1.0001; // just above the log(T/2pi)=0 singularity
  let hi = 1e30;
  for (let it = 0; it < 200; it += 1) {
    const mid = Math.sqrt(lo * hi);
    if (countModelRelShift(mid, offset) > floor) lo = mid;
    else hi = mid;
  }
  const Tstar = Math.sqrt(lo * hi);
  return Math.log10(countAtHeight(Tstar));
}

const OFFSET_ROWS = OFFSETS.map((offset) => {
  // (a) discrete first-crossing decade against the actual per-decade solver spread.
  let discreteCrossLog10N = null;
  for (const r of BASE_ROWS) {
    const shift = countModelRelShift(r.gammaNewton, offset);
    const ratio = shift === 0 ? Infinity : r.relSpread / shift;
    if (ratio > 1) {
      discreteCrossLog10N = r.log10N;
      break;
    }
  }
  // (b) continuous flat-floor crossing.
  const continuousCross = continuousCrossingLog10N(offset, SOLVER_NOISE_FLOOR);
  return {
    offset: +offset.toFixed(6),
    discreteCrossLog10N,
    continuousCrossLog10N: continuousCross === null ? null : +continuousCross.toFixed(4),
    degenerate: offset === 0,
  };
});

// Robustness summaries over the NONZERO offsets (0 is a divide-by-zero pathology).
const NONZERO = OFFSET_ROWS.filter((r) => !r.degenerate);
const CONT_VALUES = NONZERO.map((r) => r.continuousCrossLog10N);
const CONT_SPREAD = Math.max(...CONT_VALUES) - Math.min(...CONT_VALUES);
const DISCRETE_SET = [...new Set(NONZERO.map((r) => r.discreteCrossLog10N))];

// Elasticity d(log10 N*)/d(log10 offset) between the band endpoints 3/4 and 1.
const rLo = NONZERO.find((r) => Math.abs(r.offset - 3 / 4) < 1e-9);
const rHi = NONZERO.find((r) => Math.abs(r.offset - 1) < 1e-9);
const ELASTICITY =
  (rHi.continuousCrossLog10N - rLo.continuousCrossLog10N) /
  (Math.log10(1) - Math.log10(3 / 4));

// Continuous spread just from the pinned 7/8 to +1 (the two most-cited offsets).
const r78 = NONZERO.find((r) => Math.abs(r.offset - 7 / 8) < 1e-9);
const SPREAD_78_TO_1 = Math.abs(rHi.continuousCrossLog10N - r78.continuousCrossLog10N);

export const IMP96485_COUNT_OFFSET_ROBUSTNESS = Object.freeze({
  id: 'imp-96485',
  proofSection: 'S-frontier',
  question:
    'Is the imp-96449 F2 ratio-crossing location N* (solver-spread / count-shift = 1) robust to the count ' +
    'offset choice, or an artefact of the pinned +7/8 constant? Recompute the count-model shift with ' +
    'offsets in {0, 3/4, 4/5, 7/8, 9/10, 1}, locate N* discretely and continuously, and report the log10 N* ' +
    'spread. Measurement/fit only; NOT an RH bound; NO QED.',
  measuredQuantity:
    'per-offset ratio-crossing location N* (discrete first-crossing decade and continuous flat-floor N*), the ' +
    'log10 N* spread across offsets, and the elasticity d(log10 N*)/d(log10 offset)',
  window: '[1e2,1e22]',
  offsetsTested: OFFSETS,
  solverNoiseFloor: +SOLVER_NOISE_FLOOR.toExponential(3),
  offsetRows: OFFSET_ROWS,
  discreteCrossingSet: DISCRETE_SET,
  continuousCrossLog10NSpread: +CONT_SPREAD.toFixed(4),
  continuousCrossLog10NSpread_78_to_1: +SPREAD_78_TO_1.toFixed(4),
  elasticityLog10NstarPerLog10Offset: +ELASTICITY.toFixed(4),
  finding: {
    F1_discrete_crossing_decade_is_offset_invariant:
      'For every nonzero offset in {3/4, 4/5, 7/8, 9/10, 1} the discrete first-crossing decade is the same, ' +
      'log10 N* = ' + DISCRETE_SET.join(',') + ' (N in [1e15, 1e16]). The "false past N ~ 1e15" verdict ' +
      'does not depend on the specific +7/8 constant.',
    F2_continuous_Nstar_moves_a_fraction_of_a_decade:
      'The continuous flat-floor log10 N* runs ' + rLo.continuousCrossLog10N + ' (offset 3/4) -> ' +
      r78.continuousCrossLog10N + ' (7/8) -> ' + rHi.continuousCrossLog10N + ' (offset 1): a total spread ' +
      '~' + CONT_SPREAD.toFixed(4) + ' decade over the full 3/4..1 band, and only ~' + SPREAD_78_TO_1.toFixed(4) +
      ' decade from 7/8 to 1 -- < 1% of the ~13-decade anchor N-span, so the crossing is offset-insensitive.',
    F3_elasticity_is_exactly_one:
      'd(log10 N*)/d(log10 offset) = ' + ELASTICITY.toFixed(4) + ' (measured). Because the log(T/2pi) shape ' +
      'factor is common to every offset, changing the offset only translates the crossing by log10 of the ' +
      'offset ratio; it cannot alter the underflow mechanism. The crossing is driven by the count shift ' +
      'falling below the ~' + SOLVER_NOISE_FLOOR.toExponential(1) + ' solver floor, an offset-independent event.',
    F4_only_zero_offset_is_pathological:
      'The sole exception is offset = 0: the reference shift is identically zero, so the ratio is infinite at ' +
      'every decade and the whole range is degenerately flagged false with N* = 1e2. This is a divide-by-zero ' +
      'artefact of removing the reference, not a real crossing, and confirms the +7/8 verdict is unchanged by ' +
      'ANY positive O(1) offset.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Probing the imp-96449 F2 ratio-crossing under count ' +
    'offsets {0, 3/4, 4/5, 7/8, 9/10, 1}: the discrete first-crossing decade is INVARIANT at log10 N* = ' +
    DISCRETE_SET.join(',') + ' for every nonzero offset, and the continuous flat-floor N* moves only ~' +
    CONT_SPREAD.toFixed(4) + ' decade over the full 3/4..1 band (~' + SPREAD_78_TO_1.toFixed(4) + ' from 7/8 to ' +
    '1), with elasticity d(log10 N*)/d(log10 offset) = ' + ELASTICITY.toFixed(2) + ' exactly. So the ' +
    '"false past N ~ 1e15" verdict is OFFSET-ROBUST: it is set by the count shift underflowing below the ~' +
    SOLVER_NOISE_FLOOR.toExponential(1) + ' machine-precision solver floor, an offset-independent event, not ' +
    'by the choice of the +7/8 constant. The only exception is the degenerate offset = 0 (identically-zero ' +
    'reference, divide-by-zero ratio). The component model is the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; C_H isRigorousUpperBound ' +
    'stays false (imp-2642/imp-2701); changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-96449 (F2 ratio-crossing at N ~ 1e15 with fixed +7/8 offset, solver noise floor ~8e-16); imp-96427 ' +
    '(knee-only solver spread); imp-96363 (closed-form Lambert-W height inversion); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN, Newton main-term inverse).',
});

export default IMP96485_COUNT_OFFSET_ROBUSTNESS;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP96485_ASSERTIONS = [
  {
    id: 'imp96485-all-offsets-covered',
    description: 'all six offsets {0, 3/4, 4/5, 7/8, 9/10, 1} are probed',
    holds: () => OFFSET_ROWS.length === 6 && OFFSET_ROWS[0].offset === 0,
  },
  {
    id: 'imp96485-discrete-crossing-offset-invariant',
    description: 'every nonzero offset shares a single discrete first-crossing decade (verdict offset-robust)',
    holds: () => DISCRETE_SET.length === 1 && DISCRETE_SET[0] >= 15 && DISCRETE_SET[0] <= 16,
  },
  {
    id: 'imp96485-continuous-Nstar-spread-subdecade',
    description: 'the continuous log10 N* spread across nonzero offsets stays well below one decade',
    holds: () => CONT_SPREAD > 0 && CONT_SPREAD < 0.5,
  },
  {
    id: 'imp96485-elasticity-near-one',
    description: 'the elasticity d(log10 N*)/d(log10 offset) equals 1 (common log shape factor)',
    holds: () => Math.abs(ELASTICITY - 1) < 1e-3,
  },
  {
    id: 'imp96485-zero-offset-degenerate',
    description: 'offset = 0 is the sole pathology: continuous crossing undefined (identically-zero reference)',
    holds: () => OFFSET_ROWS[0].degenerate === true && OFFSET_ROWS[0].continuousCrossLog10N === null,
  },
  {
    id: 'imp96485-honesty-gate-no-qed',
    description: 'Measurement only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP96485_COUNT_OFFSET_ROBUSTNESS.isRigorous === false &&
      /NO QED/.test(IMP96485_COUNT_OFFSET_ROBUSTNESS.verdict) &&
      /refereed bound is changed/i.test(IMP96485_COUNT_OFFSET_ROBUSTNESS.verdict),
  },
];

for (const a of IMP96485_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96485-count-offset-robustness-ratio-crossing assertion failed: ${a.id}`);
  }
}
