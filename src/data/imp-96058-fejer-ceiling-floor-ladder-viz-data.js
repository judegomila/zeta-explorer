/**
 * @module imp-96058-fejer-ceiling-floor-ladder-viz-data
 *
 * imp-96058 (ux): lightweight, import-light viz-data module for a chart of the Route J
 * (rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23.js) Fejer zero-free-region floor
 * ladder: R_floor(degree n) = 1/c_ceil(n) descending monotonically toward the pure-scheme limit
 * R = 5.8284 as the trig-polynomial degree n grows, plus the classical de la Vallee Poussin 3-4-1
 * point (R ~ 34.82, degree 2) and the Mossinghoff-Trudgian (2015) Stechkin-weighted point
 * (R = 5.573412), which sits BELOW the pure-scheme floor because it uses a different (non-Fejer)
 * weighting scheme.
 *
 * Reference literals are copied verbatim from ROUTE_J.fejerCeiling / fejerLimit / classical341 /
 * mossinghoffTrudgian2015 -- no re-derivation here. Presentation only; changes no bound; NO QED.
 *
 * @see rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23.js (source module: ROUTE_J)
 *
 * Ticket: imp-96058 (ux, low). RH-equivalent; no refereed bound is changed; NO QED.
 */

// [degree n, max a_1/a_0, c_ceil, R_floor = 1/c_ceil]
export const IMP96058_FEJER_CEILING_LADDER = [
  { n: 2, a1a0: 1.414214, cCeil: 0.050628, rFloor: 19.752 },
  { n: 4, a1a0: 1.732051, cCeil: 0.115358, rFloor: 8.6687 },
  { n: 8, a1a0: 1.902113, cCeil: 0.15117, rFloor: 6.6151 },
  { n: 16, a1a0: 1.969616, cCeil: 0.165266, rFloor: 6.0508 },
  { n: 40, a1a0: 1.994408, cCeil: 0.170414, rFloor: 5.8681 },
  { n: 100, a1a0: 1.999051, cCeil: 0.171376, rFloor: 5.8351 },
];

export const IMP96058_FEJER_LIMIT = { c: 0.171573, R: 5.8284 };
export const IMP96058_CLASSICAL_341 = { a: [3, 4, 1], c: 0.028719, R: 34.821, note: 'de la Vallee Poussin classical constant' };
export const IMP96058_MOSSINGHOFF_TRUDGIAN_2015 = 5.573412;
export const IMP96058_MT_GAP_BELOW_FEJER_FLOOR = 0.255015;
export const IMP96058_MT_GAP_PCT = 4.375;
