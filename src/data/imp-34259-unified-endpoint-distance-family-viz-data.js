/**
 * @module imp-34259-unified-endpoint-distance-family-viz-data
 * @fileoverview imp-34259 -- import-light viz-data module for the imp-34173 UNIFIED k-indexed
 *   outer phase-zero branch endpoint-distance family
 *     d_k(alpha) = |k| pi/(1 + alpha) - pi/2 = pi((2|k| - 1) - alpha) / (2(1 + alpha)),
 *   for k = 1, 2, 3, 4, with its zero-crossing onset ladder alpha_k = 2|k| - 1 (1, 3, 5, 7), its
 *   onset slope d_k'(alpha_k) = -pi/(4|k|) and onset curvature d_k''(alpha_k) = pi/(4|k|^2).
 *
 *   k = 1..3 recover the imp-34103/imp-34104/imp-34167 per-family measurements; k = 4 is a new
 *   instance of the closed form, not separately measured elsewhere. Distinct from the sibling
 *   imp-34238 viz, which plots the raw branch ANGLES theta_n for n = 0..3; this module plots the
 *   endpoint DISTANCE d_k directly (degrees) and adds the k=4 rung plus the onset curvature.
 *
 *   This module has NO imports and recomputes the closed form directly with Math.PI, so importing
 *   it into a page costs nothing at load time.
 *
 *   @see imp-34173-unified-branch-endpoint-law.js (source: unified d_k(alpha), slope, curvature)
 *   @see imp-34238-seven-crossings-onset-ladder-viz-data.js (sibling viz: raw angles, k=0..3)
 *
 *   Ticket: imp-34259 (ux, medium). Presentation only; C_mb GUE-conditional per imp-486
 *   UNTOUCHED; imp-3066 K_a >= 0 UNTOUCHED; NO QED; no refereed bound is changed.
 */

const PI = Math.PI;
const toDeg = (rad) => (rad * 180) / PI;

// d_k(alpha) = |k| pi/(1 + alpha) - pi/2 (radians).
function dK(k, alpha) {
  return (Math.abs(k) * PI) / (1 + alpha) - PI / 2;
}

const K_VALUES = [1, 2, 3, 4];

// Dense grid over the valid cusp range alpha in (0, 1), for a smooth chart curve.
const CURVE_SAMPLES = 121;
export const IMP34259_CURVE = Object.freeze(
  Array.from({ length: CURVE_SAMPLES }, (_, i) => {
    const alpha = (i / (CURVE_SAMPLES - 1)) * 0.999;
    const row = { alpha };
    for (const k of K_VALUES) {
      row[`d${k}Deg`] = toDeg(dK(k, alpha));
    }
    return Object.freeze(row);
  })
);

// Coarser numeric table across alpha in (0, 1), all four families side by side (degrees).
const TABLE_ALPHAS = [0, 0.25, 0.5, 0.75, 0.9, 0.95, 0.99, 0.999];
export const IMP34259_TABLE_ROWS = Object.freeze(
  TABLE_ALPHAS.map((alpha) => {
    const row = { alpha };
    for (const k of K_VALUES) {
      row[`d${k}Deg`] = +toDeg(dK(k, alpha)).toFixed(4);
    }
    return Object.freeze(row);
  })
);

// The endpoint-onset ladder alpha_k = 2|k| - 1 (1, 3, 5, 7), with closed-form onset slope
// d_k'(alpha_k) = -pi/(4|k|) and onset curvature d_k''(alpha_k) = pi/(4|k|^2).
export const IMP34259_ONSET_LADDER = Object.freeze(
  K_VALUES.map((k) => ({
    k,
    onsetAlpha: 2 * k - 1,
    onsetSlope: -PI / (4 * k),
    onsetCurvature: PI / (4 * k * k),
  }))
);
