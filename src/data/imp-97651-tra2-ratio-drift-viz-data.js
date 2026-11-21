/**
 * @module imp-97651-tra2-ratio-drift-viz-data
 *
 * imp-97651: import-light viz-data reshaping the imp-97599 tr(A2) uniform-80-block ladder into
 * chart-ready rows -- the successive 80-step ratio CLIMBS from r1=0.687945 to r2=0.717237 (toward 1,
 * the algebraic-tail signature) while the geometric/Aitken/algebraic extrapolators still cluster at
 * ~4818.77M, ~0.333M below the imp-97482 named ~4819.1M line.
 *
 * PRESENTATION ONLY. Reuses the frozen IMP97599 literals verbatim -- no re-derivation, no new
 * computation. No bound moves; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97599-tra2-third-block-tail-decision.js (IMP97599_UNIFORM_BLOCKS, IMP97599_EXTRAPOLATION,
 *      IMP97599_CROSSCHECK, RESULT 1/2/3, VERDICT)
 */

import {
  IMP97599_UNIFORM_BLOCKS,
  IMP97599_EXTRAPOLATION,
  IMP97599_CROSSCHECK,
  IMP97599_VERDICT,
} from './imp-97599-tra2-third-block-tail-decision.js';

// Ratio-drift row pair: the two successive 80-step ratios, climbing toward 1 (algebraic tail).
export const IMP97651_RATIO_ROWS = Object.freeze([
  Object.freeze({ label: 'r1 = d2/d1 (K=560..720)', ratio: IMP97599_UNIFORM_BLOCKS.r1 }),
  Object.freeze({ label: 'r2 = d3/d2 (K=640..800)', ratio: IMP97599_UNIFORM_BLOCKS.r2 }),
]);

// Extrapolator cluster (in millions) vs the imp-97482 named line.
export const IMP97651_EXTRAPOLATOR_ROWS = Object.freeze([
  Object.freeze({
    label: 'Geometric (new ratio, K=800)',
    valueM: IMP97599_EXTRAPOLATION.L_geom_newRatioFromK800 / 1e6,
  }),
  Object.freeze({
    label: 'Aitken delta^2 (640,720,800)',
    valueM: IMP97599_EXTRAPOLATION.L_aitken_640_720_800 / 1e6,
  }),
  Object.freeze({
    label: 'Algebraic fit (new trio)',
    valueM: IMP97599_EXTRAPOLATION.L_algebraic_newTrio / 1e6,
  }),
  Object.freeze({
    label: 'imp-97482 named line',
    valueM: IMP97599_CROSSCHECK.imp97482NamedLimitM,
  }),
]);

export const IMP97651_SUMMARY = Object.freeze({
  reading:
    `The successive 80-step ratio climbs from ${IMP97599_UNIFORM_BLOCKS.r1.toFixed(6)} to `
    + `${IMP97599_UNIFORM_BLOCKS.r2.toFixed(6)} (drift +${IMP97599_UNIFORM_BLOCKS.ratioDrift.toFixed(6)}, `
    + 'toward 1), the algebraic-tail signature. Yet the three extrapolators (geometric, Aitken, '
    + `algebraic) still cluster within relative ${IMP97599_EXTRAPOLATION.interMethodRelSpread.toExponential(1)} `
    + `of ~4818.77M, sitting ${IMP97599_CROSSCHECK.gapRelative.toExponential(1)} below the `
    + `imp-97482 named ${IMP97599_CROSSCHECK.imp97482NamedLimitM}M line -- a persistent bookkeeping `
    + 'gap, not an unconverged tail.',
  verdict:
    'PRESENTATION ONLY, no new computation; reshapes imp-97599 literals verbatim. The tail model is '
    + 'decided algebraic (not geometric); the extrapolated trace limit is confirmed near 4818.77M; the '
    + 'named gap to imp-97482 persists as a bookkeeping discrepancy. Changes no bound, establishes no '
    + 'operator positivity, no RH claim; no refereed bound is changed; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97651_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97651-ratio-rows-climb-toward-one',
    description: 'r2 must exceed r1 and both must be below 1 (drift toward, not past, 1)',
    holds: () => {
      const [r1row, r2row] = IMP97651_RATIO_ROWS;
      return r2row.ratio > r1row.ratio && r1row.ratio > 0 && r2row.ratio < 1;
    },
  },
  {
    id: 'imp97651-extrapolators-below-named-line',
    description: 'the three extrapolators must all sit strictly below the imp-97482 named line',
    holds: () => {
      const named = IMP97651_EXTRAPOLATOR_ROWS[IMP97651_EXTRAPOLATOR_ROWS.length - 1].valueM;
      return IMP97651_EXTRAPOLATOR_ROWS.slice(0, -1).every((r) => r.valueM < named);
    },
  },
  {
    id: 'imp97651-extrapolators-tightly-clustered',
    description: 'the three extrapolators must be tightly clustered (spread << the gap to named)',
    holds: () => {
      const vals = IMP97651_EXTRAPOLATOR_ROWS.slice(0, -1).map((r) => r.valueM);
      const spread = Math.max(...vals) - Math.min(...vals);
      const named = IMP97651_EXTRAPOLATOR_ROWS[IMP97651_EXTRAPOLATOR_ROWS.length - 1].valueM;
      const gap = named - Math.max(...vals);
      return spread < gap;
    },
  },
  {
    id: 'imp97651-honesty-gate-no-qed',
    description: 'measurement only: no bound moved, no constant pinned, honest markers present',
    holds: () =>
      IMP97599_VERDICT.anyBoundMoved === false &&
      IMP97599_VERDICT.measurementOnly === true &&
      /NO QED/.test(IMP97651_SUMMARY.verdict) &&
      /Lambda <= 0.2|refereed bound is changed/.test(IMP97651_SUMMARY.verdict),
  },
];

for (const a of IMP97651_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97651-tra2-ratio-drift-viz-data assertion failed: ${a.id}`);
  }
}
