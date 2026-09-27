/**
 * @module imp-97716-wrapper-elasticity-5point-viz-data
 *
 * imp-97716: import-light viz-data leaf charting the imp-97686 wrapper-elasticity 5-point-stencil
 * residuals across the imp-97520 sigma landmarks L2(0.9)/L3(0.5)/L4(0.1). The sqrt wrapper E_CKH
 * residual is pure central-difference truncation -- cured ~5 orders to ~1e-12..1e-13 by the 5-point
 * O(eps^4) rule at every landmark -- while the exp wrapper (Gronwall exponent) E_GEXP residual is
 * truncation-limited only at the flow-heavy L2 (5-point improves it ~4.3x) and NOISE-limited at L3/L4
 * (the 5-point rule does not help; the residual sits at the bisection-quantization floor). Reuses
 * IMP97686_WRAPPER_ELASTICITY_5POINT_REFINE.perLandmark verbatim (no re-derivation, no new computation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97686-wrapper-elasticity-5point-refine.js (perLandmark, finding R1/R2/R3)
 */

import { IMP97686_WRAPPER_ELASTICITY_5POINT_REFINE } from './imp-97686-wrapper-elasticity-5point-refine.js';

const { perLandmark } = IMP97686_WRAPPER_ELASTICITY_5POINT_REFINE;

// Digits of agreement with the analytic target = -log10(|reldiff|); higher = more precise.
const digits = (reldiff) => -Math.log10(Math.abs(reldiff));

// One row per landmark: precision digits at the 3-point and 5-point stencils for both wrappers.
export const IMP97716_RESIDUAL_ROWS = Object.freeze(
  perLandmark.map((r) =>
    Object.freeze({
      key: r.key,
      label: r.label,
      sigma: r.sigma,
      ckh_reldiff_3pt: r.ckh_reldiff_vs_half_CC_3pt,
      ckh_reldiff_5pt: r.ckh_reldiff_vs_half_CC_5pt,
      ckh_digits_3pt: +digits(r.ckh_reldiff_vs_half_CC_3pt).toFixed(2),
      ckh_digits_5pt: +digits(r.ckh_reldiff_vs_half_CC_5pt).toFixed(2),
      ckh_improvement_x: r.ckh_stencil_improvement_x,
      gexp_reldiff_3pt: r.gexp_reldiff_vs_TC_CF_3pt,
      gexp_reldiff_5pt: r.gexp_reldiff_vs_TC_CF_5pt,
      gexp_digits_3pt: +digits(r.gexp_reldiff_vs_TC_CF_3pt).toFixed(2),
      gexp_digits_5pt: +digits(r.gexp_reldiff_vs_TC_CF_5pt).toFixed(2),
      gexp_improvement_x: r.gexp_stencil_improvement_x,
    })
  )
);

// The bisection-quantization noise floor the imp-97686 finding (R2) identifies at L3/L4: the
// residual sits at ~1e-6..1e-4 relative (4-6 precision digits) and the 5-point rule cannot cross it
// because it removes truncation error, not arithmetic noise.
export const IMP97716_NOISE_FLOOR_BAND = Object.freeze({ digitsLo: 3.5, digitsHi: 6 });

const L2 = IMP97716_RESIDUAL_ROWS[0];

export const IMP97716_SUMMARY = Object.freeze({
  reading:
    'The sqrt wrapper E_CKH gains precision at every landmark under the 5-point rule (up to ' +
    `${Math.max(...IMP97716_RESIDUAL_ROWS.map((r) => r.ckh_digits_5pt)).toFixed(1)} digits, a ~5-order ` +
    `cut at L2), confirming it is pure central-difference truncation of the exact identity ` +
    'E_CKH = 0.5 E_CC. The exp wrapper E_GEXP gains precision only at the flow-heavy L2 ' +
    `(${L2.gexp_improvement_x}x, ${L2.gexp_digits_3pt} -> ${L2.gexp_digits_5pt} digits); at L3/L4 the ` +
    '5-point rule does not help -- precision digits fall inside or below the bisection-quantization ' +
    'noise-floor band because the residual there is arithmetic noise, not a truncation tail.',
  verdict:
    'Presentation only: every residual, digit count, and improvement factor is reused verbatim from ' +
    'imp-97686 (a measurement, not a new computation). Conditional-share diagnostic on the inherited ' +
    'imp-3220/imp-3406 extrapolation, not a rigorous asymptotic. Changes no bound; Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97716_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97716-three-landmark-rows',
    description: 'exactly three landmark rows (L2/L3/L4)',
    holds: () => IMP97716_RESIDUAL_ROWS.length === 3,
  },
  {
    id: 'imp97716-ckh-cured-everywhere',
    description: 'E_CKH gains precision digits under the 5-point rule at every landmark',
    holds: () => IMP97716_RESIDUAL_ROWS.every((r) => r.ckh_digits_5pt > r.ckh_digits_3pt),
  },
  {
    id: 'imp97716-ckh-reaches-machine-precision',
    description: 'E_CKH 5-point residual reaches at least ~11 digits at every landmark',
    holds: () => IMP97716_RESIDUAL_ROWS.every((r) => r.ckh_digits_5pt >= 11),
  },
  {
    id: 'imp97716-gexp-improves-only-at-l2',
    description: 'E_GEXP gains precision at L2 but loses (or stays flat) at L3 and L4',
    holds: () => {
      const [l2, l3, l4] = IMP97716_RESIDUAL_ROWS;
      return l2.gexp_digits_5pt > l2.gexp_digits_3pt
        && l3.gexp_digits_5pt <= l3.gexp_digits_3pt
        && l4.gexp_digits_5pt <= l4.gexp_digits_3pt;
    },
  },
  {
    id: 'imp97716-gexp-l3-l4-near-noise-floor',
    description: 'E_GEXP 5-point digits at L3/L4 fall inside or below the noise-floor band',
    holds: () => {
      const [, l3, l4] = IMP97716_RESIDUAL_ROWS;
      return l3.gexp_digits_5pt <= IMP97716_NOISE_FLOOR_BAND.digitsHi
        && l4.gexp_digits_5pt <= IMP97716_NOISE_FLOOR_BAND.digitsHi;
    },
  },
  {
    id: 'imp97716-values-match-imp97686-source',
    description: 'reldiff values match the imp-97686 perLandmark rows verbatim',
    holds: () =>
      IMP97716_RESIDUAL_ROWS.every((row, i) => {
        const src = perLandmark[i];
        return row.ckh_reldiff_3pt === src.ckh_reldiff_vs_half_CC_3pt
          && row.ckh_reldiff_5pt === src.ckh_reldiff_vs_half_CC_5pt
          && row.gexp_reldiff_3pt === src.gexp_reldiff_vs_TC_CF_3pt
          && row.gexp_reldiff_5pt === src.gexp_reldiff_vs_TC_CF_5pt;
      }),
  },
  {
    id: 'imp97716-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP97716_SUMMARY.verdict) && /NO QED/.test(IMP97716_SUMMARY.verdict),
  },
];

for (const assertion of IMP97716_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97716 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97716_SUMMARY;
