/**
 * @module imp-96819-boxsine-ck-decay-viz-data
 * @fileoverview imp-96819 -- VIZ DATA ONLY. Bakes the imp-96628 certified box sine-kernel lag-decay
 *   envelope constant C(k) across lags k=2..6 for a line/bar viz page, alongside the imp-96617
 *   MEASURED envelope constant 2.07e-3 (established only at k=2, plotted as a flat reference line for
 *   comparison across the ladder). Values are copied literals from imp-96628's frozen exports -- this
 *   module does NOT re-derive the two-integration-by-parts bound. Pure frozen-object data, no imports,
 *   no self-executing assertions of its own, per the [[storage_precision_assertion_tolerance]] and
 *   [[no_heavy_imports_in_pages]] conventions -- needs no separate DATA_MODULES registration.
 *
 *   @see imp-96628-boxsine-lagcorr-ibp-envelope.js (the certified C(k) this bakes)
 *   @see imp-96617-finite-L-correction-sign.js (the measured 2.07e-3 envelope this compares against)
 *
 *   Ticket: imp-96819 (ux, low). Presentation of an already-established measurement; adds no new
 *   Lambda bound. Conditional on the GUE sine kernel / Montgomery pair correlation (UNPROVEN). RH
 *   open. NO QED. No refereed bound is changed.
 */

// -- baked from imp-96628 IMP96628_BOXSINE_LAGCORR_IBP_ENVELOPE.certifiedConst --
export const IMP96819_LAGS = Object.freeze([2, 3, 4, 5, 6]);
export const IMP96819_CERTIFIED_CK = Object.freeze([
  3.850e-3, 1.117e-3, 5.258e-4, 3.041e-4, 1.977e-4,
]);

// -- baked from imp-96617 IMP96617_FINITE_L_CORRECTION_SIGN.envelopeConst (measured only at k=2,
// plotted flat for comparison across the ladder) --
export const IMP96819_MEASURED_ENVELOPE = 2.07e-3;

// -- ratio of the certified bound to the measured constant, per lag (imp-96628: 1.86 at k=2) --
export const IMP96819_CERTIFIED_OVER_MEASURED = Object.freeze(
  IMP96819_CERTIFIED_CK.map((c) => c / IMP96819_MEASURED_ENVELOPE),
);

// chart series: certified C(k) vs the flat measured reference, one row per lag
export const IMP96819_SERIES = Object.freeze(
  IMP96819_LAGS.map((k, i) => Object.freeze({
    k,
    certifiedCk: IMP96819_CERTIFIED_CK[i],
    measuredReference: IMP96819_MEASURED_ENVELOPE,
    ratio: IMP96819_CERTIFIED_OVER_MEASURED[i],
  })),
);

export default Object.freeze({
  id: 'imp-96819-boxsine-ck-decay-viz-data',
  ticket: 'imp-96819',
  source: 'imp-96628-boxsine-lagcorr-ibp-envelope.js',
  lags: IMP96819_LAGS,
  certifiedCk: IMP96819_CERTIFIED_CK,
  measuredEnvelope: IMP96819_MEASURED_ENVELOPE,
  series: IMP96819_SERIES,
  certifiedDominatesAtK2: IMP96819_CERTIFIED_CK[0] > IMP96819_MEASURED_ENVELOPE, // 3.850e-3 > 2.07e-3
});
