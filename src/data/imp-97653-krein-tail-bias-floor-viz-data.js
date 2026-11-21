/**
 * @module imp-97653-krein-tail-bias-floor-viz-data
 *
 * imp-97653: import-light viz-data reshaping the imp-97625 tail-bias signal-vs-floor assessment
 * into chart-ready rows -- a log-scale ladder comparing |relBias(3.36)| = 2.72746e-5 against the
 * two independent edge-amplitude measurement floors (zero-crossing 9.42e-10, R*-local 2.91e-9)
 * and the imp-97497 < 1e-3 far-field tail bar, making the ~1e4x resolvability visible at a glance.
 *
 * PRESENTATION ONLY. Reuses the frozen IMP97625_FLOOR_ASSESSMENT / IMP97625_VERDICT literals
 * verbatim -- no re-derivation, no new computation. No bound moves; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-97625-krein-tail-bias-signal-vs-floor-assessment.js (IMP97625_FLOOR_ASSESSMENT, IMP97625_VERDICT)
 */

import { IMP97625_FLOOR_ASSESSMENT, IMP97625_VERDICT } from './imp-97625-krein-tail-bias-signal-vs-floor-assessment.js';

// Log-scale ladder rows: value (relBias units), ordered smallest -> largest.
export const IMP97653_LADDER_ROWS = Object.freeze([
  Object.freeze({
    label: 'Zero-crossing floor',
    value: IMP97625_FLOOR_ASSESSMENT.floorRelBiasZeroCross,
    kind: 'floor',
  }),
  Object.freeze({
    label: 'R*-local floor',
    value: IMP97625_FLOOR_ASSESSMENT.floorRelBiasR336Local,
    kind: 'floor',
  }),
  Object.freeze({
    label: '|relBias(3.36)| signal',
    value: Math.abs(IMP97625_FLOOR_ASSESSMENT.relBiasAtR336),
    kind: 'signal',
  }),
  Object.freeze({
    label: 'imp-97497 tail bar',
    value: 1e-3,
    kind: 'bar',
  }),
]);

// Signal-to-noise rows: how far the signal sits above each floor, and below the tail bar.
export const IMP97653_SNR_ROWS = Object.freeze([
  Object.freeze({ label: 'vs zero-crossing floor', factor: IMP97625_FLOOR_ASSESSMENT.snrZeroCross, direction: 'above' }),
  Object.freeze({ label: 'vs R*-local floor', factor: IMP97625_FLOOR_ASSESSMENT.snrR336Local, direction: 'above' }),
  Object.freeze({ label: 'vs imp-97497 tail bar', factor: IMP97625_FLOOR_ASSESSMENT.factorBelowTailBar, direction: 'below' }),
]);

export const IMP97653_SUMMARY = Object.freeze({
  reading:
    `|relBias(3.36)| = ${Math.abs(IMP97625_FLOOR_ASSESSMENT.relBiasAtR336).toExponential(3)} sits `
    + `${IMP97625_FLOOR_ASSESSMENT.snrZeroCross.toExponential(2)}x above the zero-crossing floor `
    + `(${IMP97625_FLOOR_ASSESSMENT.floorRelBiasZeroCross.toExponential(2)}) and `
    + `${IMP97625_FLOOR_ASSESSMENT.snrR336Local.toExponential(2)}x above the R*-local floor `
    + `(${IMP97625_FLOOR_ASSESSMENT.floorRelBiasR336Local.toExponential(2)}), making the negative sign a `
    + 'genuine, resolvable signal rather than measurement noise. It also sits '
    + `${IMP97625_FLOOR_ASSESSMENT.factorBelowTailBar.toFixed(1)}x below the imp-97497 < 1e-3 far-field `
    + 'tail bar, so the resolved bias does not threaten that bar. Only the sign-change RADIUS at Rc = 1/a '
    + 'stays below the floor.',
  verdict: IMP97625_VERDICT.answer,
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97653_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97653-ladder-rows-monotone-increasing',
    description: 'the four ladder rows must be strictly increasing in value (floors < signal < bar)',
    holds: () => {
      const vals = IMP97653_LADDER_ROWS.map((r) => r.value);
      return vals.every((v, i) => i === 0 || v > vals[i - 1]);
    },
  },
  {
    id: 'imp97653-ladder-kinds-match-order',
    description: 'row kinds must read floor, floor, signal, bar in that order',
    holds: () => IMP97653_LADDER_ROWS.map((r) => r.kind).join(',') === 'floor,floor,signal,bar',
  },
  {
    id: 'imp97653-snr-factors-above-one',
    description: 'every SNR/margin factor must exceed 1 (signal above both floors, below the tail bar)',
    holds: () => IMP97653_SNR_ROWS.every((r) => r.factor > 1),
  },
  {
    id: 'imp97653-honesty-gate-no-qed',
    description: 'assessment only: no bound moved, honest markers present',
    holds: () =>
      IMP97625_VERDICT.assessmentOnly === true &&
      IMP97625_VERDICT.boundMoves === false &&
      IMP97625_VERDICT.operatorPositivityProved === false &&
      IMP97625_VERDICT.qed === false &&
      typeof IMP97653_SUMMARY.reading === 'string',
  },
];

for (const a of IMP97653_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97653-krein-tail-bias-floor-viz-data assertion failed: ${a.id}`);
  }
}
