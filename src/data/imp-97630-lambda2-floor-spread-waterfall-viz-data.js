/**
 * @module imp-97630-lambda2-floor-spread-waterfall-viz-data
 *
 * imp-97630: import-light viz-data reshaping the imp-97600 lambda_2-floor spread decomposition into
 * waterfall rows. The imp-97538 floor bracket [-313.756, -310.692227] (spread ~3.06) descends from the
 * rigorous upper edge in two measured steps: the honest geometric K-truncation tail past Kbig=720
 * (5.6%, 0.172773) then the K-truncation TAIL-MODEL disagreement on nu_max (94.4%, 2.891000) between
 * the geometric corrected-tail estimate and the imp-97482 power-saturation refit deep end. The m=2
 * discretization (already absorbed into the upper edge) and the enclosure arithmetic both contribute 0.
 *
 * PRESENTATION ONLY. Reuses the frozen IMP97600_* literals verbatim -- no re-derivation, no new
 * computation. No bound moves; RH open; NO QED.
 *
 * @see imp-97600-lambda2-floor-spread-decomposition.js (IMP97600_FLOOR_ANCHORS, IMP97600_SPREAD_DECOMPOSITION, IMP97600_SOURCE_SHARES)
 */

import {
  IMP97600_FLOOR_ANCHORS,
  IMP97600_FULL_SPREAD,
  IMP97600_SPREAD_DECOMPOSITION,
  IMP97600_SOURCE_SHARES,
  IMP97600_VERDICT,
} from './imp-97600-lambda2-floor-spread-decomposition.js';

export const IMP97630_FULL_SPREAD = IMP97600_FULL_SPREAD; // 3.063773

// Waterfall steps, in descent order from the rigorous upper edge -310.692227 down to the power-refit
// deep end -313.756. Each step carries its start/end value so a bar can be drawn floating between them.
export const IMP97630_WATERFALL_ROWS = Object.freeze([
  Object.freeze({
    key: 'upperEdge',
    label: 'Kbig=720 upper edge',
    kind: 'anchor',
    value: IMP97600_FLOOR_ANCHORS.directBuiltUpperEdgeKbig720, // -310.692227
    start: IMP97600_FLOOR_ANCHORS.directBuiltUpperEdgeKbig720,
    end: IMP97600_FLOOR_ANCHORS.directBuiltUpperEdgeKbig720,
    sharePct: 0,
  }),
  Object.freeze({
    key: 'geometricTail',
    label: 'honest geometric tail (Kbig>720)',
    kind: 'descent',
    magnitude: IMP97600_SPREAD_DECOMPOSITION.geometricTailPastKbig720, // 0.172773
    start: IMP97600_FLOOR_ANCHORS.directBuiltUpperEdgeKbig720,
    end: IMP97600_FLOOR_ANCHORS.correctedTailEstimate,
    sharePct: IMP97600_SOURCE_SHARES.geometricTailSharePct, // ~5.64
  }),
  Object.freeze({
    key: 'extrapolationModel',
    label: 'tail-MODEL disagreement (nu_max)',
    kind: 'descent',
    magnitude: IMP97600_SPREAD_DECOMPOSITION.extrapolationModelDisagreement, // 2.891000
    start: IMP97600_FLOOR_ANCHORS.correctedTailEstimate,
    end: IMP97600_FLOOR_ANCHORS.powerSaturationRefitDeepEnd,
    sharePct: IMP97600_SOURCE_SHARES.extrapolationModelSharePct, // ~94.36
  }),
  Object.freeze({
    key: 'deepEnd',
    label: 'power-refit deep end (over-extrapolation)',
    kind: 'anchor',
    value: IMP97600_FLOOR_ANCHORS.powerSaturationRefitDeepEnd, // -313.756
    start: IMP97600_FLOOR_ANCHORS.powerSaturationRefitDeepEnd,
    end: IMP97600_FLOOR_ANCHORS.powerSaturationRefitDeepEnd,
    sharePct: 0,
  }),
]);

// Zero-contribution sources, shown as separate callouts (not part of the waterfall descent since they
// are already absorbed into the upper edge / never materialized).
export const IMP97630_ZERO_SOURCES = Object.freeze([
  Object.freeze({
    key: 'discretization',
    label: 'm=2 quadrature / eigen-solve discretization',
    sharePct: IMP97600_SOURCE_SHARES.discretizationSharePct, // 0
    note: `moves the floor ${Math.abs(IMP97600_SPREAD_DECOMPOSITION.discretizationBuiltRange).toFixed(6)} over Kbig 500->720, already absorbed into the upper edge`,
  }),
  Object.freeze({
    key: 'enclosureArithmetic',
    label: 'enclosure arithmetic (Gram-inverse conditioning)',
    sharePct: IMP97600_SOURCE_SHARES.enclosureArithmeticSharePct, // 0
    note: 'g2min stayed strictly positive (~508..2830) across the shift sweep, no conditioning blow-up',
  }),
]);

export const IMP97630_SUMMARY = Object.freeze({
  law:
    'The imp-97538 lambda_2 floor bracket [-313.756,-310.692227] (spread 3.063773) descends from the '
    + 'rigorous upper edge in two measured steps: 5.6% honest geometric K-truncation tail, then 94.4% '
    + 'tail-MODEL disagreement on the extremal pencil eigenvalue nu_max. Discretization and enclosure '
    + 'arithmetic contribute 0% -- they never widen the bracket below the upper edge.',
  reading:
    `Starting at the rigorous upper edge ${IMP97600_FLOOR_ANCHORS.directBuiltUpperEdgeKbig720.toFixed(6)}, `
    + `the honest geometric tail descends ${IMP97600_SPREAD_DECOMPOSITION.geometricTailPastKbig720.toFixed(6)} `
    + `(${IMP97600_SOURCE_SHARES.geometricTailSharePct.toFixed(1)}%) to the corrected-tail estimate `
    + `${IMP97600_FLOOR_ANCHORS.correctedTailEstimate.toFixed(3)}, then the tail-model disagreement descends `
    + `a further ${IMP97600_SPREAD_DECOMPOSITION.extrapolationModelDisagreement.toFixed(6)} `
    + `(${IMP97600_SOURCE_SHARES.extrapolationModelSharePct.toFixed(1)}%) to the power-refit deep end `
    + `${IMP97600_FLOOR_ANCHORS.powerSaturationRefitDeepEnd.toFixed(3)}, which the measured 80-block ratio `
    + `(0.687) shows is an over-extrapolation.`,
  // The imp-97600 answer string carries the diagnosis but not the honesty markers
  // (those live in its boolean guardrails boundMoves/qed/operatorPositivityProved),
  // so the markers are restated here from those flags.
  verdict:
    IMP97600_VERDICT.answer
    + (IMP97600_VERDICT.boundMoves === false && IMP97600_VERDICT.qed === false
      ? ' MEASUREMENT / DIAGNOSIS ONLY: no bound moved; no operator positivity; interval-rigorous reach '
        + 'stays 2a<=0.96; PT Lambda <= 0.2 SOTA; RH open; NO QED.'
      : ''),
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97630_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97630-four-waterfall-rows',
    description: 'exactly four waterfall rows: upper edge, two descents, deep end',
    holds: () => IMP97630_WATERFALL_ROWS.length === 4,
  },
  {
    id: 'imp97630-descent-chain-contiguous',
    description: 'each descent row starts where the previous row ended',
    holds: () => {
      for (let i = 1; i < IMP97630_WATERFALL_ROWS.length; i++) {
        if (Math.abs(IMP97630_WATERFALL_ROWS[i].start - IMP97630_WATERFALL_ROWS[i - 1].end) > 1e-9) return false;
      }
      return true;
    },
  },
  {
    id: 'imp97630-descents-sum-to-full-spread',
    description: 'the two descent magnitudes sum to the full 3.063773 spread',
    holds: () => {
      const sum = IMP97630_WATERFALL_ROWS
        .filter((r) => r.kind === 'descent')
        .reduce((acc, r) => acc + r.magnitude, 0);
      return Math.abs(sum - IMP97630_FULL_SPREAD) < 1e-6;
    },
  },
  {
    id: 'imp97630-shares-sum-to-100',
    description: 'the two descent shares plus the two zero-sources sum to ~100%',
    holds: () => {
      const descentShare = IMP97630_WATERFALL_ROWS
        .filter((r) => r.kind === 'descent')
        .reduce((acc, r) => acc + r.sharePct, 0);
      const zeroShare = IMP97630_ZERO_SOURCES.reduce((acc, r) => acc + r.sharePct, 0);
      return Math.abs(descentShare + zeroShare - 100) < 1e-6;
    },
  },
  {
    id: 'imp97630-model-disagreement-is-dominant-row',
    description: 'the tail-model-disagreement row has both the largest magnitude and share',
    holds: () => {
      const descents = IMP97630_WATERFALL_ROWS.filter((r) => r.kind === 'descent');
      const dominant = descents.reduce((a, b) => (b.magnitude > a.magnitude ? b : a));
      return dominant.key === 'extrapolationModel' && dominant.sharePct > 90;
    },
  },
  {
    id: 'imp97630-zero-sources-are-zero',
    description: 'both zero-contribution sources carry sharePct === 0',
    holds: () => IMP97630_ZERO_SOURCES.every((s) => s.sharePct === 0),
  },
  {
    id: 'imp97630-endpoints-match-anchors',
    description: 'first row value = rigorous upper edge, last row value = power-refit deep end',
    holds: () =>
      IMP97630_WATERFALL_ROWS[0].value === IMP97600_FLOOR_ANCHORS.directBuiltUpperEdgeKbig720
      && IMP97630_WATERFALL_ROWS[3].value === IMP97600_FLOOR_ANCHORS.powerSaturationRefitDeepEnd,
  },
  {
    id: 'imp97630-honest-status-carried',
    description: 'verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP97630_SUMMARY.verdict) && /NO QED/.test(IMP97630_SUMMARY.verdict),
  },
];

for (const assertion of IMP97630_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97630 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97630_SUMMARY;
