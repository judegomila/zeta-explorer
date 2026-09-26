/**
 * @module imp-97152-krein-sigma2-majorant-tightness-viz-data
 * @fileoverview imp-97152 -- VIZ DATA ONLY. Bakes the imp-97115 per-T ratio statistics of the
 *   imp-97100 closed-form monotone sigma_2 majorant against the exact sigma_2 on the Krein
 *   Rayleigh tail: min/max/mean of majorant/exact for T in {4800, 6400, 9600}, showing the ratio
 *   oscillates with cos(t ln2) (MIN ~1.0000, MAX ~1.35 -> 1.31 shrinking with T, MEAN ~1.14 ->
 *   1.13), entirely dominated by the trivial cos >= -1 bound (digamma Stirling remainder ~1e-9,
 *   negligible). Values are copied literals from imp-97115's frozen export IMP97115_ROWS -- this
 *   module does NOT recompute rePsi, exactW1, or majW1. Pure frozen-object data, no imports, no
 *   self-executing assertions of its own, per the [[storage_precision_assertion_tolerance]] and
 *   [[no_heavy_imports_in_pages]] conventions -- needs no separate DATA_MODULES registration.
 *
 *   @see imp-97115-krein-sigma2-majorant-tightness.js (the certified per-T ratio stats this bakes)
 *   @see imp-97100-krein-rayleigh-tail-interval-majorant-assessment.js (the sigma_2 majorant form)
 *
 *   Ticket: imp-97152 (ux, low). Presentation of an already-established measurement; adds no new
 *   Lambda bound. Rayleigh floor stays an UPPER bound. Reach stays 2a<=0.96. RH open. NO QED.
 */

// -- baked from imp-97115 IMP97115_ROWS --
export const IMP97152_RATIO_ROWS = Object.freeze([
  Object.freeze({ T: 4800, ratioMin: 1.0000, ratioMax: 1.3465, ratioMean: 1.1417 }),
  Object.freeze({ T: 6400, ratioMin: 1.0000, ratioMax: 1.3286, ratioMean: 1.1352 }),
  Object.freeze({ T: 9600, ratioMin: 1.0000, ratioMax: 1.3086, ratioMean: 1.1282 }),
]);

export const IMP97152_SLACK_SUMMARY = Object.freeze({
  worstSlackFactor: 1.3465,
  worstSlackLog10: 0.1292,
  phaseCancellationGapOrders: 15,
  slackShrinksWithT: true,
});

export default Object.freeze({
  id: 'imp-97152-krein-sigma2-majorant-tightness-viz-data',
  ticket: 'imp-97152',
  source: 'imp-97115-krein-sigma2-majorant-tightness.js',
  ratioRows: IMP97152_RATIO_ROWS,
  slackSummary: IMP97152_SLACK_SUMMARY,
  sigma2IsNotObstruction: true,
  intervalRigorousReach: 0.96,
});
