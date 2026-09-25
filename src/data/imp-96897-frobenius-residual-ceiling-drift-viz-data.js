/**
 * @module imp-96897-frobenius-residual-ceiling-drift-viz-data
 * @fileoverview imp-96897 -- import-light viz-data leaf for the imp-96792 Route M fit-vs-direct
 *   Frobenius-norm residual ladder: the fitted log-linear norm OVER-predicts the exact ||G||_F at
 *   N=13000..16000 by a residual that WIDENS (0.221% -> 0.375%), while the fitted-F ceiling scale
 *   edges UP with each ladder extension (3.764e7 -> 3.775e7 -> 3.787e7). Bakes the imp-96792 rows
 *   as plain literals so any consuming page avoids the heavy zeros-bundle import chain.
 *
 * SOURCE. imp-96792 (numerical, MEASUREMENT ONLY): re-analysis of the imp-96751 exact Vasyunin-Gram
 * rungs N=13000,14000,15000,16000 against the imp-96751 log-linear norm fit ||G||_F ~ a + b log N.
 * No new heavy compute; no rigorous ceiling posted; no bound moved; NO QED.
 *
 * @see imp-96792-route-m-frobenius-ladder-direct-vs-fit-gap.js (source finding, full derivation)
 * @see imp-96693-route-m-conditioning-ceiling-residual-decomposition.js (fitted F=3.764e7 origin)
 */

// per-N row: exact ||G||_F (imp-96751), fitted ||G||_F (log-linear fit), relative over-prediction.
export const IMP96897_ROWS = Object.freeze([
  Object.freeze({ N: 13000, exact: 7.038283442, fit: 7.05384738, relResidualPct: 0.2212 }),
  Object.freeze({ N: 14000, exact: 7.068935551, fit: 7.088366, relResidualPct: 0.2749 }),
  Object.freeze({ N: 15000, exact: 7.097354059, fit: 7.120495, relResidualPct: 0.326 }),
  Object.freeze({ N: 16000, exact: 7.123836045, fit: 7.150555, relResidualPct: 0.375 }),
]);

// fitted-F ceiling scale drift as the direct ladder is extended (imp-96792 FINDING 2).
export const IMP96897_CEILING_DRIFT = Object.freeze([
  Object.freeze({ rungs: 11, ceiling: 3.764e7, label: 'imp-96684 N<=9000 snapshot' }),
  Object.freeze({ rungs: 14, ceiling: 3.775e7, label: 'imp-96694 N=12000 re-solve' }),
  Object.freeze({ rungs: 18, ceiling: 3.787e7, label: 'imp-96751 N=16000 re-solve' }),
]);

export const IMP96897_VERDICT = Object.freeze({
  ticket: 'imp-96897',
  sourceTicket: 'imp-96792',
  residualWidensWithN: true,
  ceilingDriftsUp: true,
  narrowsFitVsDirectGap: false,
  operatorPositivityProved: false,
  qed: false,
});

export default {
  rows: IMP96897_ROWS,
  ceilingDrift: IMP96897_CEILING_DRIFT,
  verdict: IMP96897_VERDICT,
};

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96897_ASSERTIONS = [
  {
    id: 'imp96897-residual-monotone-and-in-range',
    holds: () =>
      IMP96897_ROWS.every((r, i) => i === 0 || r.relResidualPct > IMP96897_ROWS[i - 1].relResidualPct) &&
      IMP96897_ROWS[0].relResidualPct > 0.2 && IMP96897_ROWS[0].relResidualPct < 0.25 &&
      IMP96897_ROWS[3].relResidualPct > 0.35 && IMP96897_ROWS[3].relResidualPct < 0.4,
    why: 'the imp-96792 fit-vs-direct residual widens monotonically from 0.221% (N=13000) to 0.375% (N=16000): the fit and the exact Frobenius norm diverge, they do not converge.',
  },
  {
    id: 'imp96897-fit-over-predicts-every-rung',
    holds: () => IMP96897_ROWS.every((r) => r.fit > r.exact),
    why: 'the log-linear norm fit over-predicts the exact ||G||_F at every one of the four re-analysed rungs.',
  },
  {
    id: 'imp96897-ceiling-drifts-up',
    holds: () =>
      IMP96897_CEILING_DRIFT.every((c, i) => i === 0 || c.ceiling > IMP96897_CEILING_DRIFT[i - 1].ceiling),
    why: 'the fitted-F ceiling scale edges up with each ladder extension (3.764e7 -> 3.775e7 -> 3.787e7), tracking the concavity of the exact norm rather than converging.',
  },
  {
    id: 'imp96897-measurement-only-no-qed',
    holds: () =>
      IMP96897_VERDICT.narrowsFitVsDirectGap === false &&
      IMP96897_VERDICT.operatorPositivityProved === false &&
      IMP96897_VERDICT.qed === false,
    why: 'measurement only: no rigorous ceiling is posted here, no bound is claimed moved, and no QED is claimed.',
  },
];

for (const a of IMP96897_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96897-frobenius-residual-ceiling-drift-viz-data assertion failed: ${a.id}`);
  }
}
