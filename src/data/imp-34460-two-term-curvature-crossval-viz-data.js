/**
 * @module imp-34460-two-term-curvature-crossval-viz-data
 * @fileoverview imp-34460 -- VIZ DATA ONLY for the imp-34375 two-term curvature cross-validation
 *   finding: fitting g(kEnd) ~ a/kEnd + b/kEnd^2 (an explicit second-order term added to the
 *   imp-34286 bias-corrected leading prefactor a ~ 0.437-0.438) does NOT relocate the leading
 *   coefficient a -- across all four windows the two-term a stays inside or immediately adjacent
 *   to the 0.437-0.438 band, and the shift versus the one-term constant fit is tiny (<=0.5%, and
 *   only ~0.03% in the far field). No viz exists for imp-34375.
 *
 *   Values below are baked reference literals, reproduced exactly from the imp-34375 module's
 *   TABLE rows (direct re-statement of constA / twoTermA / curvatureB / leadShift per window, not
 *   re-derived here). This module does NOT import lambda-rh-height-mapping.js or
 *   polymath15-constant-C-C.js -- no fresh computation, per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-34375-numerator-approach-two-term-curvature-crossval.js (source measurement: the
 *        two-term fit g*kEnd = a + b*u, u = 1/kEnd, across four windows)
 *   @see imp-34286-numerator-approach-coefficient-fd-crossval (the bias-corrected a ~ 0.437-0.438)
 *   @see imp-34450-numerator-approach-three-term-curvature-crossval (the next-order extension)
 *
 *   Ticket: imp-34460 (ux, medium). Presentation only of an already-established measurement; adds
 *   no new Lambda bound. Component model is the inherited surrogate diagnostic, NOT rigorous;
 *   C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a>=0 untouched; NO QED; no refereed bound is changed.
 */

// -- the baked imp-34375 TABLE rows -- reproduced verbatim (direct re-statement).
export const IMP34460_WINDOW_ROWS = Object.freeze([
  Object.freeze({
    window: 'full 22..150 (imp-34286 OLS window)',
    kEndLo: 22,
    kEndHi: 150,
    constA: 0.43613,
    twoTermA: 0.438333,
    curvatureB: -0.101173,
    leadShift: 0.002203,
  }),
  Object.freeze({
    window: 'far-field 40..150 (imp-34286 FD window)',
    kEndLo: 40,
    kEndHi: 150,
    constA: 0.43686,
    twoTermA: 0.436974,
    curvatureB: -0.008079,
    leadShift: 0.000114,
  }),
  Object.freeze({
    window: 'deep 50..150',
    kEndLo: 50,
    kEndHi: 150,
    constA: 0.436656,
    twoTermA: 0.436656,
    curvatureB: 0.0,
    leadShift: 0.0,
  }),
  Object.freeze({
    window: 'deep 60..150',
    kEndLo: 60,
    kEndHi: 150,
    constA: 0.436426,
    twoTermA: 0.436426,
    curvatureB: 0.0,
    leadShift: 0.0,
  }),
]);

// -- the band this cross-validation confirms the leading coefficient stays inside --
export const IMP34460_BAND = Object.freeze({ lo: 0.437, hi: 0.438, tol: 0.001 });

// -- headline summary numbers, reproduced from the imp-34375 module exports --
export const IMP34460_SUMMARY = Object.freeze({
  maxAbsLeadShift: 0.002203,
  farFieldLeadShift: 0.000114,
  farFieldCurvatureAt100: 8.079e-7,
  gapAt100: 0.00436982,
});

export default Object.freeze({
  id: 'imp-34460-two-term-curvature-crossval-viz-data',
  ticket: 'imp-34460',
  source: ['imp-34375-numerator-approach-two-term-curvature-crossval.js'],
  windowRows: IMP34460_WINDOW_ROWS,
  band: IMP34460_BAND,
  summary: IMP34460_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34460_ASSERTIONS = [
  {
    id: 'imp34460-four-window-rows',
    holds: () => IMP34460_WINDOW_ROWS.length === 4,
    why: 'The imp-34375 cross-validation reports exactly four windows: full, far-field, and two deep windows.',
  },
  {
    id: 'imp34460-all-two-term-a-near-band',
    holds: () =>
      IMP34460_WINDOW_ROWS.every(
        (r) => r.twoTermA > IMP34460_BAND.lo - IMP34460_BAND.tol && r.twoTermA < IMP34460_BAND.hi + IMP34460_BAND.tol
      ),
    why: 'Every two-term leading coefficient a lands inside or immediately adjacent to the 0.437-0.438 band.',
  },
  {
    id: 'imp34460-max-shift-matches-full-window',
    holds: () => {
      const maxShift = Math.max(...IMP34460_WINDOW_ROWS.map((r) => Math.abs(r.leadShift)));
      return Math.abs(maxShift - IMP34460_SUMMARY.maxAbsLeadShift) < 1e-9;
    },
    why: 'The largest lead-shift across all windows must match the imp-34375 headline maxAbsLeadShift (~0.002203, the full window).',
  },
  {
    id: 'imp34460-farfield-shift-tiny',
    holds: () =>
      Math.abs(IMP34460_WINDOW_ROWS[1].leadShift - IMP34460_SUMMARY.farFieldLeadShift) < 1e-9 &&
      IMP34460_SUMMARY.farFieldLeadShift < 5e-4,
    why: 'The far-field lead-shift (~0.000114) is tiny, an order of magnitude below the full-window shift.',
  },
];

for (const assertion of IMP34460_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-34460-two-term-curvature-crossval-viz-data assertion failed: ${assertion.id}`);
  }
}
