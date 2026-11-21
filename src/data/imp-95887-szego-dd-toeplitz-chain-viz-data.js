/**
 * @module imp-95887-szego-dd-toeplitz-chain-viz-data
 * @fileoverview imp-95887 -- lightweight viz-data module surfacing the imp-95743
 *   Szego / DD-Toeplitz research chain's two key held results, flagged
 *   page-reachable-but-unrendered by the imp-95778 orphan/consumer audit:
 *
 *   (1) the imp-95743 double-double primal Gram + Jacobi eigensolver cross-check
 *       of the Szego edge-coefficient scaling law C(delta) = pi^2/(2 delta^2),
 *       showing the DD fit tracks the law where the float64 fit BREAKS
 *       (delta = ln 1.3, the imp-95677 float64 cancellation floor);
 *
 *   (2) the imp-95885 per-delta u_fit / reach / conditioning comparison across
 *       ln 1.2 / ln 1.25 / ln 1.3, showing reach does NOT order the certified
 *       interval widths across deltas -- conditioning does (Finding A).
 *
 *   Reshapes already-baked upstream constants -- no re-derivation, no fresh
 *   eigensolve, no heavy imports. Viz data only; changes no bound; NO QED.
 *
 *   @see imp-95743-szego-coefficient-double-double-crosscheck.js (the C(delta) crosscheck)
 *   @see imp-95885-per-delta-ufit-comparison-table.js (the per-delta reach/conditioning table)
 *   @see imp-95778-catalan-szego-orphan-consumer-audit.js (flagged this page-reachability residual)
 */

import { IMP95743_SZEGO_COEFFICIENT_DOUBLE_DOUBLE_CROSSCHECK } from './imp-95743-szego-coefficient-double-double-crosscheck.js';
import { IMP95885_PER_DELTA_UFIT_COMPARISON_TABLE } from './imp-95885-per-delta-ufit-comparison-table.js';

// --- (1) Szego C(delta) crosscheck rows: predicted vs DD-fit vs float64-fit ---
export const IMP95887_SZEGO_FIT_ROWS = Object.freeze(
  IMP95743_SZEGO_COEFFICIENT_DOUBLE_DOUBLE_CROSSCHECK.crosscheck.map((row) =>
    Object.freeze({
      label: row.label,
      delta: row.delta,
      cPred: row.cPred,
      ddCFit: row.dd.cFit,
      ddRelErrPct: +(row.dd.relErr * 100).toFixed(3),
      float64CFit: row.float64.cFit,
      float64RelErrPct: +(row.float64.relErr * 100).toFixed(2),
      float64Broken: Math.abs(row.float64.relErr) > 1.0,
      note: row.note,
    }),
  ),
);

// --- (2) per-delta reach / conditioning / u_fit_rel comparison ---
export const IMP95887_DELTA_COMPARISON_ROWS = Object.freeze(
  IMP95885_PER_DELTA_UFIT_COMPARISON_TABLE.perDelta.map((row) =>
    Object.freeze({
      label: row.label,
      delta: row.delta,
      condApprox: row.condApprox,
      reachLatest: row.reachLatest,
      uFitRelPct: row.uFitRelLatest === null ? null : +(row.uFitRelLatest * 100).toFixed(4),
      hasUFitInterval: row.uFitRelLatest !== null,
    }),
  ),
);

export const IMP95887_FINDING_A_NOTE = IMP95885_PER_DELTA_UFIT_COMPARISON_TABLE.reachVsPrecisionNote;

export const IMP95887_CAVEAT_BANNER =
  'HONEST STATUS: this page reshapes two already-baked cross-validation modules verbatim -- ' +
  'no fresh eigensolve, no re-derivation, no new cited input. The Szego C(delta) fit is an ' +
  'independent numerical cross-check of an established scaling law (imp-95704); the per-delta ' +
  'comparison assembles previously-piecemeal u_fit intervals into one table. Both certified ' +
  'DD-vs-dual intervals CONTAIN ZERO (consistent with exact agreement, not a separation). ' +
  'Introduces no new cited input and changes no bound; no refereed bound is changed' +
  '. NO QED.';

export const IMP95887_SZEGO_DD_TOEPLITZ_CHAIN_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp95887-szego-fit-rows-two-deltas',
    description: 'the reshaped Szego fit table carries both crosscheck rows (ln1.5, ln1.3)',
    holds: () =>
      IMP95887_SZEGO_FIT_ROWS.length === 2 &&
      IMP95887_SZEGO_FIT_ROWS.some((r) => r.label === 'ln1.5') &&
      IMP95887_SZEGO_FIT_ROWS.some((r) => r.label === 'ln1.3'),
  },
  {
    id: 'imp95887-float64-flagged-broken-at-ln13-only',
    description: 'float64Broken is true only for the ln1.3 row (the cancellation-floor break), false at ln1.5',
    holds: () => {
      const ln13 = IMP95887_SZEGO_FIT_ROWS.find((r) => r.label === 'ln1.3');
      const ln15 = IMP95887_SZEGO_FIT_ROWS.find((r) => r.label === 'ln1.5');
      return ln13.float64Broken === true && ln15.float64Broken === false;
    },
  },
  {
    id: 'imp95887-dd-tracks-law-both-rows',
    description: 'the DD fit relative error stays under 10% at both deltas (tracks the predicted law)',
    holds: () => IMP95887_SZEGO_FIT_ROWS.every((r) => Math.abs(r.ddRelErrPct) < 10),
  },
  {
    id: 'imp95887-delta-comparison-three-rows-ascending-delta',
    description: 'the per-delta comparison carries all three deltas (ln1.2 < ln1.25 < ln1.3), strictly ascending',
    holds: () =>
      IMP95887_DELTA_COMPARISON_ROWS.length === 3 &&
      IMP95887_DELTA_COMPARISON_ROWS.every(
        (r, i) => i === 0 || r.delta > IMP95887_DELTA_COMPARISON_ROWS[i - 1].delta,
      ),
  },
  {
    id: 'imp95887-ln125-has-no-ufit-interval',
    description: 'the ln1.25 row is flagged as having no u_fit interval (crossing/shift-budget thread only)',
    holds: () => {
      const ln125 = IMP95887_DELTA_COMPARISON_ROWS.find((r) => r.label === 'ln1.25');
      return ln125.hasUFitInterval === false && ln125.uFitRelPct === null;
    },
  },
  {
    id: 'imp95887-reach-does-not-order-ufit-across-deltas',
    description:
      'Finding A reproduced: ln1.2 reach exceeds ln1.3 reach yet ln1.2 u_fit_rel is LOOSER (larger) than ln1.3',
    holds: () => {
      const l12 = IMP95887_DELTA_COMPARISON_ROWS.find((r) => r.label === 'ln1.2');
      const l13 = IMP95887_DELTA_COMPARISON_ROWS.find((r) => r.label === 'ln1.3');
      return (
        l12.reachLatest > l13.reachLatest &&
        l12.uFitRelPct > l13.uFitRelPct &&
        l12.condApprox > l13.condApprox
      );
    },
  },
  {
    id: 'imp95887-caveat-banner-states-honest-status',
    description: 'the caveat banner opens with HONEST STATUS and flags NO QED',
    holds: () => /HONEST STATUS/.test(IMP95887_CAVEAT_BANNER) && /NO QED/.test(IMP95887_CAVEAT_BANNER),
  },
];

for (const a of IMP95887_SZEGO_DD_TOEPLITZ_CHAIN_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95887-szego-dd-toeplitz-chain-viz-data assertion failed: ${a.id}`);
  }
}
