/**
 * @module imp-97251-intercept-three-constituent-split-viz-data
 * @fileoverview imp-97251 -- VIZ DATA ONLY. Bakes the imp-97207 three-constituent split of the
 *   unweighted-series intercept c1_T = termA_s0 + termB_cQ + (2R, unevaluated), alongside the
 *   measured H2-weighted interior intercept a_int = -14.929 it is checked against. Constituent
 *   (A) 2 s0 (gamma-3/2) ~ -3.25 is EXACT-coefficient x measured-slope; constituent (B)
 *   2 cQ (zeta(2)-5/4) ~ -10.6 DOMINATES and carries the UNPINNED sub-leading cotangent constant;
 *   constituent (C) = 2R is the unevaluated remainder tail-sum. Values are baked from imp-97207's
 *   IMP97207_DECOMPOSITION and IMP97207_A_INTERIOR literals, not re-derived. Pure frozen-object
 *   data, no imports, no self-executing assertions of its own, per the
 *   [[storage_precision_assertion_tolerance]] and [[no_heavy_imports_in_pages]] conventions --
 *   needs no separate DATA_MODULES registration.
 *
 *   @see imp-97207-route-m-farfield-intercept-derivation.js (the derivation this bakes)
 *   @see imp-97160-route-m-farfield-additive-term-spread (the ceiling F this intercept feeds)
 *
 *   Ticket: imp-97251 (ux, low). Presentation of an already-established reduction; adds no new
 *   Lambda bound. c1 stays OLS-measured, not proved. RH open. NO QED.
 */

// -- baked from imp-97207's IMP97207_DECOMPOSITION and IMP97207_A_INTERIOR literals --
export const IMP97251_CONSTITUENTS = Object.freeze([
  Object.freeze({
    label: 'A: structural (s0)',
    value: -3.25,
    exact: false,
    status: 'EXACT coefficient (gamma-3/2) x MEASURED slope s0 ~ 1.763',
  }),
  Object.freeze({
    label: 'B: sub-leading cotangent (cQ)',
    value: -10.6,
    exact: false,
    status: 'EXACT coefficient (zeta(2)-5/4) x UNPINNED constant cQ ~ -13.4 -- DOMINATES',
  }),
  Object.freeze({
    label: 'C: remainder tail-sum (2R)',
    value: null,
    exact: false,
    status: 'UNEVALUATED convergent tail-sum; symbolic only',
  }),
]);

export const IMP97251_SUMMARY = Object.freeze({
  c1TExcludingRemainder: -13.9, // termA_s0 + termB_cQ, i.e. c1_T minus the unevaluated 2R
  aInterior: -14.9289, // imp-96667 measured H2-weighted interior OLS intercept
  gapToAInterior: -14.9289 - -13.9, // ~-1.03, the residual attributable to 2R + the H2-weight correction
  dominantConstituent: 'B: sub-leading cotangent (cQ)',
  structureDerivable: true, // exact harmonic/zeta coefficients on both A and B
  valuePinned: false, // cQ and R stay OLS-fit / unevaluated
});

export default Object.freeze({
  id: 'imp-97251-intercept-three-constituent-split-viz-data',
  ticket: 'imp-97251',
  source: 'imp-97207-route-m-farfield-intercept-derivation.js',
  constituents: IMP97251_CONSTITUENTS,
  summary: IMP97251_SUMMARY,
});
