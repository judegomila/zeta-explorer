/**
 * @module imp-34517-numerator-approach-a-stability-viz-data
 * @fileoverview imp-34517 -- VIZ DATA ONLY for the imp-34489 leading-coefficient a-stability finding
 *   across the two-, three-, and four-term numerator-approach fits of the approach gap
 *   g(kEnd) = 1 - numerator ~ a/kEnd + b/kEnd^2 + c/kEnd^3 + c4/kEnd^4 (u = 1/kEnd). Adding each
 *   higher-order term shifts the leading coefficient a by a SHRINKING amount order-to-order
 *   (~0.0022 at two-to-three, ~0.00067 at three-to-four) -- the signature of a converging
 *   expansion, not a relocating leading coefficient. No viz previously existed for this a-stability
 *   ladder across all three fit orders in one place (imp-34460 only covers the two-term stage).
 *
 *   Values below are baked reference literals, reproduced exactly from the imp-34489 module's
 *   TABLE rows (direct re-statement of twoTermA / threeTermA / fourTermA / curvatureC4 /
 *   leadShift34 / leadShift24 per window, not re-derived here). This module does NOT import
 *   lambda-rh-height-mapping.js or polymath15-constant-C-C.js -- no fresh computation, per
 *   [[no_heavy_imports_in_pages]].
 *
 *   @see imp-34489-numerator-approach-four-term-curvature-crossval.js (source measurement: the
 *        four-term fit g*kEnd = a + b*u + c*u^2 + c4*u^3, u = 1/kEnd, across four windows)
 *   @see imp-34450-numerator-approach-three-term-curvature-crossval.js (the three-term fit)
 *   @see imp-34375-numerator-approach-two-term-curvature-crossval.js (the two-term fit)
 *   @see imp-34460-two-term-curvature-crossval-viz-data.js (the earlier two-term-only viz)
 *   @see imp-34286-numerator-approach-coefficient-fd-crossval (the bias-corrected a ~ 0.437-0.438)
 *
 *   Ticket: imp-34517 (ux, medium). Presentation only of an already-established measurement; adds
 *   no new Lambda bound. Component model is the inherited surrogate diagnostic, NOT rigorous;
 *   C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a>=0 untouched; NO QED; no refereed bound is changed.
 */

// -- the baked imp-34489 TABLE rows -- reproduced verbatim (direct re-statement).
export const IMP34517_WINDOW_ROWS = Object.freeze([
  Object.freeze({
    window: 'full 22..150 (imp-34286 OLS window)',
    kEndLo: 22,
    kEndHi: 150,
    twoTermA: 0.438333,
    threeTermA: 0.436104,
    fourTermA: 0.435437,
    curvatureC4: 66.383929,
    leadShift34: -0.000667,
    leadShift24: -0.002896,
  }),
  Object.freeze({
    window: 'far-field 40..150 (imp-34286 FD window)',
    kEndLo: 40,
    kEndHi: 150,
    twoTermA: 0.436974,
    threeTermA: 0.435561,
    fourTermA: 0.4351,
    curvatureC4: 154.876589,
    leadShift34: -0.000462,
    leadShift24: -0.001875,
  }),
  Object.freeze({
    window: 'deep 50..150',
    kEndLo: 50,
    kEndHi: 150,
    twoTermA: 0.436656,
    threeTermA: 0.435413,
    fourTermA: 0.435017,
    curvatureC4: 205.02546,
    leadShift34: -0.000396,
    leadShift24: -0.001639,
  }),
  Object.freeze({
    window: 'deep 60..150',
    kEndLo: 60,
    kEndHi: 150,
    twoTermA: 0.436426,
    threeTermA: 0.435288,
    fourTermA: 0.434934,
    curvatureC4: 271.553372,
    leadShift34: -0.000353,
    leadShift24: -0.001492,
  }),
]);

// -- the band this cross-validation cohort confirms the leading coefficient stays near --
export const IMP34517_BAND = Object.freeze({ lo: 0.437, hi: 0.438, tol: 0.003 });

// -- headline summary numbers, reproduced from the imp-34489 module exports --
export const IMP34517_SUMMARY = Object.freeze({
  maxAbsLeadShift34: 0.000667,
  imp34450ThreeTermMaxShift: 0.002229,
  shiftShrinksOrderToOrder: true,
});

export default Object.freeze({
  id: 'imp-34517-numerator-approach-a-stability-viz-data',
  ticket: 'imp-34517',
  source: ['imp-34489-numerator-approach-four-term-curvature-crossval.js'],
  windowRows: IMP34517_WINDOW_ROWS,
  band: IMP34517_BAND,
  summary: IMP34517_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34517_ASSERTIONS = [
  {
    id: 'imp34517-four-window-rows',
    holds: () => IMP34517_WINDOW_ROWS.length === 4,
    why: 'The imp-34489 cross-validation reports exactly four windows: full, far-field, and two deep windows.',
  },
  {
    id: 'imp34517-a-decreases-monotonically-with-order',
    holds: () =>
      IMP34517_WINDOW_ROWS.every((r) => r.twoTermA > r.threeTermA && r.threeTermA > r.fourTermA),
    why: 'In every window the leading coefficient a strictly decreases from two-term to three-term to four-term.',
  },
  {
    id: 'imp34517-all-four-term-a-near-band',
    holds: () =>
      IMP34517_WINDOW_ROWS.every(
        (r) => r.fourTermA > IMP34517_BAND.lo - IMP34517_BAND.tol && r.fourTermA < IMP34517_BAND.hi
      ),
    why: 'Every four-term leading coefficient a lands at 0.4349-0.4355, within tolerance of the 0.437-0.438 band.',
  },
  {
    id: 'imp34517-shift-shrinks-order-to-order',
    holds: () => {
      const maxShift34 = Math.max(...IMP34517_WINDOW_ROWS.map((r) => Math.abs(r.leadShift34)));
      return (
        Math.abs(maxShift34 - IMP34517_SUMMARY.maxAbsLeadShift34) < 1e-9 &&
        maxShift34 < IMP34517_SUMMARY.imp34450ThreeTermMaxShift
      );
    },
    why: 'The largest three-to-four shift (~0.000667) must match the imp-34489 headline value and be smaller than the imp-34450 two-to-three max shift (0.002229).',
  },
];

for (const assertion of IMP34517_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-34517-numerator-approach-a-stability-viz-data assertion failed: ${assertion.id}`);
  }
}
