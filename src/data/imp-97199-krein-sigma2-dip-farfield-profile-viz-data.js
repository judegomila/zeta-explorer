/**
 * @module imp-97199-krein-sigma2-dip-farfield-profile-viz-data
 * @fileoverview imp-97199 -- VIZ DATA ONLY. Bakes the imp-97161 pointwise sigma_2(t) profile
 *   (t^2+1/4)^2 w_1(t) used in Assessment 2 to show why the flat Slepian/prolate concentration
 *   route fails: sigma_2 dips negative near the origin and again in later cos(t ln2) bands
 *   (sigma_2(0)=-0.397, sigma_2(2)=-24.23, sigma_2(10)=-3186.8), while the positive far field
 *   shares the SAME t^4 envelope (sigma_2(50)=+1.906e7) -- so there is no single bounded dip and
 *   no uniform positive far floor. Values are copied literals from imp-97161's inline assertion
 *   comments -- this module does NOT recompute w1 or sigma2. Pure frozen-object data, no imports,
 *   no self-executing assertions of its own, per the [[storage_precision_assertion_tolerance]] and
 *   [[no_heavy_imports_in_pages]] conventions -- needs no separate DATA_MODULES registration.
 *
 *   @see imp-97161-krein-concentration-lower-bound-assessment.js (the assessment this bakes; Assessment 2)
 *   @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (sigma2(t) = (t^2+1/4)^2 w_1(t) definition)
 *
 *   Ticket: imp-97199 (ux, low). Presentation of an already-established measurement; adds no new
 *   Lambda bound. Reach stays 2a<=0.96. RH open. NO QED.
 */

// -- baked from imp-97161 pointwise sigma_2 evaluations (Assessment 2) --
export const IMP97199_SIGMA2_PROFILE_ROWS = Object.freeze([
  Object.freeze({ t: 0, sigma2: -0.397, band: 'origin dip' }),
  Object.freeze({ t: 2, sigma2: -24.23, band: 'recurring negativity band' }),
  Object.freeze({ t: 10, sigma2: -3186.8, band: 'recurring negativity band, deeper (t^4 growth)' }),
  Object.freeze({ t: 50, sigma2: 1.906e7, band: 'positive far field, same t^4 envelope' }),
]);

export const IMP97199_ENVELOPE_SUMMARY = Object.freeze({
  dipIsRecurringNotSingleInterval: true,   // negativity in every cos(t ln2) band, not one bounded dip
  dipDepthUnbounded: true,                 // grows like the t^4 envelope
  farFieldSharesT4Envelope: true,          // no uniform positive floor m_far
  flatProlateHypothesesFail: true,         // all three Slepian preconditions violated
});

export default Object.freeze({
  id: 'imp-97199-krein-sigma2-dip-farfield-profile-viz-data',
  ticket: 'imp-97199',
  source: 'imp-97161-krein-concentration-lower-bound-assessment.js',
  profileRows: IMP97199_SIGMA2_PROFILE_ROWS,
  envelopeSummary: IMP97199_ENVELOPE_SUMMARY,
  intervalRigorousReach: 0.96,
});
