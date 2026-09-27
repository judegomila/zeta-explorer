/**
 * @module imp-97614-tailbias-Rsweep-viz-data
 *
 * imp-97614: import-light viz-data reshaping the imp-97580 far-field tail-bias R-sweep into
 * chart-ready rows -- relBias(R) = 3(1/a - a R^2) * (I2/I1) across the R ladder, marking the
 * sign-change radius Rc = 1/a = 1.8205 (bias exactly zero) and the imp-97497 far-field-cost
 * optimum R* = 3.36 (bias -2.7e-5, an order of magnitude inside the imp-97497 < 1e-3 tail bar).
 *
 * PRESENTATION ONLY. Reuses the frozen IMP97580_R_SWEEP / IMP97580_VERDICT literals verbatim --
 * no re-derivation, no new computation. No bound moves; RH open; NO QED.
 *
 * @see imp-97580-krein-tail-bias-R-sweep-signchange.js (IMP97580_R_SWEEP, biasRelCoeff, relBias, VERDICT)
 */

import {
  IMP97580_R_SWEEP,
  IMP97580_SIGN_CHANGE_R,
  IMP97580_VERDICT,
  relBias,
} from './imp-97580-krein-tail-bias-R-sweep-signchange.js';

const FAR_FIELD_OPTIMUM_R = IMP97580_VERDICT.farFieldOptimumR; // 3.36 (imp-97497)

// Chart rows: R, relBias(R), and which marker (if any) this rung corresponds to.
export const IMP97614_RSWEEP_ROWS = Object.freeze(
  IMP97580_R_SWEEP.map((row) =>
    Object.freeze({
      R: row.R,
      relBias: row.relBias,
      biasSign: row.biasSign,
      isSignChange: Math.abs(row.R - IMP97580_SIGN_CHANGE_R) < 1e-9,
      isFarFieldOptimum: Math.abs(row.R - FAR_FIELD_OPTIMUM_R) < 1e-9,
    })),
);

export const IMP97614_SIGN_CHANGE_R = IMP97580_SIGN_CHANGE_R; // Rc = 1/a = 1.820478453253675
export const IMP97614_FAR_FIELD_OPTIMUM_R = FAR_FIELD_OPTIMUM_R; // R* = 3.36
export const IMP97614_RELBIAS_AT_OPTIMUM = relBias(FAR_FIELD_OPTIMUM_R); // -2.727e-5

export const IMP97614_SUMMARY = Object.freeze({
  law:
    'Across the imp-97580 R ladder, relBias(R) = 3(1/a - a R^2) * (I2/I1) is positive below Rc = 1/a '
    + '= 1.820478, exactly zero at Rc, and negative above it -- a single closed-form sign change with '
    + 'no other roots on the ladder.',
  reading:
    `The bias falls from ${IMP97614_RSWEEP_ROWS[0].relBias.toExponential(3)} at R = ${IMP97614_RSWEEP_ROWS[0].R} `
    + `through exactly zero at the sign-change radius Rc = ${IMP97614_SIGN_CHANGE_R.toFixed(6)}, continuing to `
    + `${IMP97614_RELBIAS_AT_OPTIMUM.toExponential(3)} at the imp-97497 far-field-cost optimum R* = `
    + `${IMP97614_FAR_FIELD_OPTIMUM_R} -- already an order of magnitude inside the imp-97497 < 1e-3 tail error bar.`,
  verdict: `${IMP97580_VERDICT.answer} Measurement only; no bound moves; NO QED.`,
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97614_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97614-row-count-matches-source-ladder',
    description: 'ten rows, one per imp-97580 R ladder rung',
    holds: () => IMP97614_RSWEEP_ROWS.length === 10,
  },
  {
    id: 'imp97614-exactly-one-sign-change-marker',
    description: 'exactly one ladder rung is flagged as the sign-change radius Rc = 1/a',
    holds: () => IMP97614_RSWEEP_ROWS.filter((r) => r.isSignChange).length === 1,
  },
  {
    id: 'imp97614-exactly-one-far-field-optimum-marker',
    description: 'exactly one ladder rung is flagged as the far-field-cost optimum R* = 3.36',
    holds: () => IMP97614_RSWEEP_ROWS.filter((r) => r.isFarFieldOptimum).length === 1,
  },
  {
    id: 'imp97614-sign-change-bias-is-zero',
    description: 'relBias at the flagged sign-change rung is numerically zero',
    holds: () => {
      const row = IMP97614_RSWEEP_ROWS.find((r) => r.isSignChange);
      return row !== undefined && Math.abs(row.relBias) < 1e-12;
    },
  },
  {
    id: 'imp97614-bias-negative-past-sign-change',
    description: 'relBias is negative at the far-field optimum, well below the sign-change radius crossing',
    holds: () =>
      IMP97614_RELBIAS_AT_OPTIMUM < 0 &&
      Math.abs(IMP97614_RELBIAS_AT_OPTIMUM) < 1e-3 &&
      IMP97614_FAR_FIELD_OPTIMUM_R > IMP97614_SIGN_CHANGE_R,
  },
  {
    id: 'imp97614-monotone-sign-flip',
    description: 'rows below Rc all have positive bias, rows above Rc all have negative bias',
    holds: () =>
      IMP97614_RSWEEP_ROWS.every((r) => {
        if (r.R < IMP97614_SIGN_CHANGE_R - 1e-9) return r.relBias > 0;
        if (r.R > IMP97614_SIGN_CHANGE_R + 1e-9) return r.relBias < 0;
        return true;
      }),
  },
  {
    id: 'imp97614-honest-status-carried',
    description: 'verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () =>
      /no bound/.test(IMP97614_SUMMARY.verdict) &&
      /NO QED/.test(IMP97614_SUMMARY.verdict),
  },
];

for (const assertion of IMP97614_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97614 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97614_SUMMARY;
