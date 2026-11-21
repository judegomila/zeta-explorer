/**
 * @module imp-97628-mcm-surrogate-vs-fullh-onset-viz-data
 *
 * imp-97628: import-light viz-data reshaping the imp-97583 RESULT 2 comparison of the smooth
 * surrogate iterDiff(H, p_omega#, 1) against the full-h value T(p_omega#) = surrogate + Rcorr(b)
 * across omega = 7..11 into chart-ready rows. The surrogate first goes negative one order earlier
 * (omega = 10, -5.403315e-4) than the full-h value (omega = 11, -9.623658e-4); the near-flat
 * saturated R-correction (+1.0186e-3, decaying like 1/(720 d^3)) is exactly enough to lift the
 * surrogate positive at omega = 10 but can no longer compensate at omega = 11.
 *
 * PRESENTATION ONLY. Reuses the frozen IMP97583_ONSET_LADDER / IMP97583_RESULTS literals verbatim
 * -- no re-derivation, no new computation. No bound moves; RH open; NO QED.
 *
 * @see imp-97583-route-m-mcm-onset-omega11-primorial.js (IMP97583_ONSET_LADDER, IMP97583_RESULTS)
 */

import {
  IMP97583_ONSET_LADDER,
  IMP97583_RESULTS,
} from './imp-97583-route-m-mcm-onset-omega11-primorial.js';

export const IMP97628_SURROGATE_ONSET_OMEGA = IMP97583_RESULTS.surrogateOnsetOmega; // 10
export const IMP97628_FULL_ONSET_OMEGA = IMP97583_RESULTS.onsetOmega; // 11
export const IMP97628_RCORR_SATURATION = IMP97583_RESULTS.rCorrectionSaturation; // ~1.0186e-3

// Only rows with a recorded surrogate value up to the full-h onset (omega = 7..11) -- earlier
// rows (omega=6) don't carry one, and the imp-97583 ladder also carries post-onset rows
// (omega = 12, 13, 15; failure deepening) that are outside this onset-window chart.
export const IMP97628_ROWS = Object.freeze(
  IMP97583_ONSET_LADDER
    .filter((row) => row.surrogate !== null && row.omega <= IMP97628_FULL_ONSET_OMEGA)
    .map((row) =>
      Object.freeze({
        omega: row.omega,
        T: row.T,
        surrogate: row.surrogate,
        rcorr: row.T - row.surrogate,
        fullHolds: row.T > 0,
        surrogateHolds: row.surrogate > 0,
        isSurrogateOnset: row.omega === IMP97628_SURROGATE_ONSET_OMEGA,
        isFullOnset: row.omega === IMP97628_FULL_ONSET_OMEGA,
      })),
);

export const IMP97628_SUMMARY = Object.freeze({
  law:
    'T(p_omega#) = iterDiff(H,p_omega#,1) + Rcorr(p_omega#); Rcorr is near-flat (~1.0186e-3, decaying '
    + 'like 1/(720 d^3)) across omega=7..11, so the two onsets differ by exactly one order.',
  reading:
    `The surrogate iterDiff(H,p_omega#,1) first goes negative at omega = ${IMP97628_SURROGATE_ONSET_OMEGA} `
    + `(${IMP97628_ROWS.find((r) => r.isSurrogateOnset).surrogate.toExponential(3)}), one order before the `
    + `full-h value T(p_omega#), which the flat R-correction (~${IMP97628_RCORR_SATURATION.toExponential(4)}) `
    + `keeps positive through omega = ${IMP97628_SURROGATE_ONSET_OMEGA} `
    + `(${IMP97628_ROWS.find((r) => r.isSurrogateOnset).T.toExponential(3)}) but can no longer compensate at `
    + `omega = ${IMP97628_FULL_ONSET_OMEGA} `
    + `(${IMP97628_ROWS.find((r) => r.isFullOnset).T.toExponential(3)}).`,
  verdict:
    'MEASUREMENT ONLY. The bounded R-correction buys exactly one order of reprieve, not an all-orders '
    + 'rescue; b/4 ceiling untouched; no bound moved; no refereed bound is changed; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97628_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97628-five-rows-omega-7-to-11',
    description: 'exactly five rows, omega = 7..11 (the rows carrying a recorded surrogate value)',
    holds: () =>
      IMP97628_ROWS.length === 5 &&
      IMP97628_ROWS.every((r, i) => r.omega === i + 7),
  },
  {
    id: 'imp97628-surrogate-onset-one-order-before-full-onset',
    description: 'surrogate onset (omega=10) is exactly one order before the full-h onset (omega=11)',
    holds: () => IMP97628_FULL_ONSET_OMEGA - IMP97628_SURROGATE_ONSET_OMEGA === 1,
  },
  {
    id: 'imp97628-surrogate-onset-row-negative-surrogate-positive-full',
    description: 'at the surrogate onset, the surrogate is negative but the full-h value is still positive',
    holds: () => {
      const r = IMP97628_ROWS.find((row) => row.isSurrogateOnset);
      return r !== undefined && r.surrogate < 0 && r.T > 0;
    },
  },
  {
    id: 'imp97628-full-onset-row-both-negative',
    description: 'at the full-h onset, both the surrogate and the full-h value are negative',
    holds: () => {
      const r = IMP97628_ROWS.find((row) => row.isFullOnset);
      return r !== undefined && r.surrogate < 0 && r.T < 0;
    },
  },
  {
    id: 'imp97628-earlier-rows-both-positive',
    description: 'rows before the surrogate onset (omega < 10) have both surrogate and full-h positive',
    holds: () =>
      IMP97628_ROWS.filter((r) => r.omega < IMP97628_SURROGATE_ONSET_OMEGA)
        .every((r) => r.surrogate > 0 && r.T > 0),
  },
  {
    id: 'imp97628-rcorr-near-flat',
    description: 'the R-correction (T - surrogate) stays within 5e-6 of the saturated 1.0186e-3 value at every row',
    holds: () => IMP97628_ROWS.every((r) => Math.abs(r.rcorr - IMP97628_RCORR_SATURATION) < 5e-6),
  },
  {
    id: 'imp97628-honest-status-carried',
    description: 'verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () =>
      /no bound/.test(IMP97628_SUMMARY.verdict) &&
      /NO QED/.test(IMP97628_SUMMARY.verdict),
  },
];

for (const assertion of IMP97628_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97628 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97628_SUMMARY;
