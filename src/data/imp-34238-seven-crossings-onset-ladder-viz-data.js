/**
 * @module imp-34238-seven-crossings-onset-ladder-viz-data
 * @fileoverview imp-34238 -- import-light viz-data module for the imp-34167 SEVEN phase-zero
 *   crossings k in {-3, -2, -1, 0, 1, 2, 3} of the imp-33924 joint amplitude -A(alpha, theta), and
 *   the endpoint-distance ladder d_n(alpha) = n pi/p - pi/2 (p = 1 + alpha) shared by the three
 *   outer families:
 *
 *     family (i)   n=1  (imp-34045/imp-34103): real-NEGATIVE, onset alpha = 1
 *     family (ii)  n=2  (imp-34104/imp-34166): real-POSITIVE, onset alpha = 3
 *     family (iii) n=3  (imp-34167):           real-NEGATIVE, onset alpha = 5
 *
 *   Each family's branch theta_n(alpha) = pi/2 -+ n pi/p touches the interval endpoints 0, pi
 *   exactly at alpha = 2n - 1 (the ladder 1, 3, 5, ...), per the imp-34173 unified law
 *   d_n(alpha) = n pi/p - pi/2 = pi((2n - 1) - alpha) / (2(1 + alpha)).
 *
 *   This module has NO imports and recomputes the closed-form angles directly with Math.PI, so
 *   importing it into a page costs nothing at load time.
 *
 *   @see imp-34167-third-outer-branch-geometry.js (source: locates the k = -+3 pair, onset alpha = 5)
 *   @see imp-34173-unified-branch-endpoint-law.js (source: unified d_n(alpha) closed form)
 *   @see imp-34185-outer-branch-angle-family-viz-data.js (sibling viz covering only k = 0, 1, 2)
 *   @see imp-34104-second-positive-branch-geometry.js (family (ii) source)
 *   @see imp-34045-phase-zero-endpoint-degeneracy.js (family (i) source)
 *
 *   Ticket: imp-34238 (ux, low). Presentation only; C_mb GUE-conditional per imp-486 UNTOUCHED;
 *   imp-3066 K_a >= 0 UNTOUCHED; NO QED; no refereed bound is changed.
 */

const toDeg = (rad) => (rad * 180) / Math.PI;

// theta_n(alpha) = pi/2 -+ n pi/p, p = 1 + alpha; d_n(alpha) = n pi/p - pi/2 is the distance of
// either crossing from its nearest endpoint (0 for the lower crossing, pi for the upper crossing).
function branchAnglesDeg(alpha, n) {
  if (n === 0) {
    return { lowerDeg: 90, upperDeg: 90, distDeg: null };
  }
  const p = 1 + alpha;
  const dn = (n * Math.PI) / p - Math.PI / 2;
  return {
    lowerDeg: toDeg(Math.PI / 2 - (n * Math.PI) / p),
    upperDeg: toDeg(Math.PI / 2 + (n * Math.PI) / p),
    distDeg: toDeg(dn),
  };
}

// Family metadata: onset ladder alpha = 2n - 1 (n=1 -> 1, n=2 -> 3, n=3 -> 5).
export const IMP34238_FAMILY_META = Object.freeze([
  {
    n: 0,
    label: 'k=0 (imp-33970 central zero)',
    argMinusAMod2Pi: 0,
    onsetAlpha: null,
    everInsideOpenInterval: 'always (unique zero for every alpha)',
  },
  {
    n: 1,
    label: 'family (i), k=-+1 (imp-34045/imp-34103, real-negative)',
    argMinusAMod2Pi: Math.PI,
    onsetAlpha: 1,
    everInsideOpenInterval: 'never for alpha < 1; touches endpoints exactly at alpha = 1',
  },
  {
    n: 2,
    label: 'family (ii), k=-+2 (imp-34104/imp-34166, real-positive)',
    argMinusAMod2Pi: 2 * Math.PI,
    onsetAlpha: 3,
    everInsideOpenInterval: 'never for alpha < 3; touches endpoints exactly at alpha = 3',
  },
  {
    n: 3,
    label: 'family (iii), k=-+3 (imp-34167, real-negative)',
    argMinusAMod2Pi: 3 * Math.PI,
    onsetAlpha: 5,
    everInsideOpenInterval: 'never for alpha in (0,1); touches endpoints exactly at alpha = 5',
  },
]);

// Dense grid over the valid cusp range alpha in (0, 1), for a smooth chart curve.
const CURVE_SAMPLES = 121;
export const IMP34238_CURVE = Object.freeze(
  Array.from({ length: CURVE_SAMPLES }, (_, i) => {
    const alpha = (i / (CURVE_SAMPLES - 1)) * 0.999;
    const n1 = branchAnglesDeg(alpha, 1);
    const n2 = branchAnglesDeg(alpha, 2);
    const n3 = branchAnglesDeg(alpha, 3);
    return Object.freeze({
      alpha,
      n0Deg: 90,
      n1LowerDeg: n1.lowerDeg,
      n1UpperDeg: n1.upperDeg,
      n2LowerDeg: n2.lowerDeg,
      n2UpperDeg: n2.upperDeg,
      n3LowerDeg: n3.lowerDeg,
      n3UpperDeg: n3.upperDeg,
    });
  })
);

// Coarser numeric table across alpha in (0, 1), all three outer families side by side.
const TABLE_ALPHAS = [0, 0.25, 0.5, 0.75, 0.9, 0.95, 0.99, 0.999, 0.9999];
export const IMP34238_TABLE_ROWS = Object.freeze(
  TABLE_ALPHAS.map((alpha) => {
    const n1 = branchAnglesDeg(alpha, 1);
    const n2 = branchAnglesDeg(alpha, 2);
    const n3 = branchAnglesDeg(alpha, 3);
    return Object.freeze({
      alpha,
      n1DistDeg: n1.distDeg,
      n2DistDeg: n2.distDeg,
      n3DistDeg: n3.distDeg,
    });
  })
);

// The endpoint-onset ladder itself: alpha_n = 2n - 1, at which d_n(alpha_n) = 0 exactly.
export const IMP34238_ONSET_LADDER = Object.freeze([1, 2, 3].map((n) => ({
  n,
  onsetAlpha: 2 * n - 1,
  endpointSlope: -(n * Math.PI) / (2 * n) ** 2, // d d_n/d alpha |_{alpha = 2n-1} = -n pi/(2n)^2
})));
