/**
 * @module imp-34185-outer-branch-angle-family-viz-data
 * @fileoverview imp-34185 -- import-light viz-data module unifying the phase-zero
 *   branch families found on the imp-33924 closed form -A(alpha, theta) into a
 *   single law theta_k(alpha) = pi/2 -+ k pi/p (p = 1 + alpha) for k = 0, 1, 2:
 *
 *     k = 0: the imp-33970 UNIQUE central zero, theta = pi/2 for every alpha
 *            (arg(-A) = 0, no k-dependence).
 *     k = 1: the imp-34045 real-NEGATIVE family (i), arg(-A) = pi, which
 *            COLLAPSES onto the interval endpoints 0 and pi as alpha -> 1.
 *     k = 2: the imp-34104 real-POSITIVE family (ii), arg(-A) = 2pi, which
 *            stays pi/2 outside [0, pi] even at alpha = 1 and reaches the
 *            endpoints only at alpha = 3.
 *
 *   The common endpoint-distance law is dk(alpha) = k pi/p - pi/2 =
 *   pi(2k - 1 - alpha) / (2(1 + alpha)), touching 0 (endpoint onset) exactly
 *   at alpha = 2k - 1 -- reproducing the imp-34045 k=1 onset at alpha=1 and
 *   the imp-34104 k=2 onset at alpha=3 as the k=1,2 cases of one ladder.
 *   imp-34105 independently cross-validated the k=1,2 closed-form angles via
 *   bracket-and-bisect root-finding on Im(-A)(theta) (worst discrepancy
 *   ~9e-16 across the whole sweep), so the angles tabulated below carry that
 *   same cross-validation.
 *
 *   The angle law is a plain closed-form trig identity (no heavy solve, no
 *   Gronwall/W_1/PCC dependency); this module has NO imports and computes
 *   everything directly with Math.PI, so importing it into a page costs
 *   nothing at load time.
 *
 *   @see imp-34045-phase-zero-endpoint-degeneracy.js (source of family k=1)
 *   @see imp-34104-second-positive-branch-geometry.js (source of family k=2)
 *   @see imp-34105-phase-zero-rootfind-crossvalidation.js (independent cross-validation)
 *   @see imp-33970-joint-phase-zero-uniqueness.js (uniqueness of the central k=0 zero)
 *
 *   Ticket: imp-34185 (ux, low). Presentation only, RH-equivalent; C_mb
 *   GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 UNTOUCHED; NO QED;
 *   Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 */

const toDeg = (rad) => (rad * 180) / Math.PI;

// theta_k(alpha) = pi/2 -+ k pi/p, p = 1 + alpha; dk(alpha) = k pi/p - pi/2 is the
// distance of either crossing from its nearest endpoint (0 for the lower crossing,
// pi for the upper crossing), by symmetry pi/2 - lower = upper - pi = dk.
function branchAnglesDeg(alpha, k) {
  if (k === 0) {
    return { lowerDeg: 90, upperDeg: 90, distDeg: null };
  }
  const p = 1 + alpha;
  const dk = (k * Math.PI) / p - Math.PI / 2;
  return {
    lowerDeg: toDeg(Math.PI / 2 - (k * Math.PI) / p),
    upperDeg: toDeg(Math.PI / 2 + (k * Math.PI) / p),
    distDeg: toDeg(dk),
  };
}

// Family metadata: each family's endpoint-onset alpha = 2k - 1 (k=1 -> alpha=1,
// k=2 -> alpha=3), reproducing the imp-34045/imp-34104 onsets as one ladder.
export const IMP34185_FAMILY_META = Object.freeze([
  {
    k: 0,
    label: 'k=0 (imp-33970 central zero)',
    argMinusAMod2Pi: 0,
    collapseAlpha: null,
    everInsideOpenInterval: 'always (unique zero for every alpha)',
  },
  {
    k: 1,
    label: 'k=1 (imp-34045 family i, real-negative)',
    argMinusAMod2Pi: Math.PI,
    collapseAlpha: 1,
    everInsideOpenInterval: 'never for alpha < 1; touches endpoints exactly at alpha = 1',
  },
  {
    k: 2,
    label: 'k=2 (imp-34104 family ii, real-positive)',
    argMinusAMod2Pi: 2 * Math.PI,
    collapseAlpha: 3,
    everInsideOpenInterval: 'never for alpha < 3; touches endpoints exactly at alpha = 3',
  },
]);

// Dense grid over the valid cusp range alpha in (0, 1), for a smooth chart curve.
const CURVE_SAMPLES = 121;
export const IMP34185_CURVE = Object.freeze(
  Array.from({ length: CURVE_SAMPLES }, (_, i) => {
    const alpha = (i / (CURVE_SAMPLES - 1)) * 0.999;
    const k1 = branchAnglesDeg(alpha, 1);
    const k2 = branchAnglesDeg(alpha, 2);
    return Object.freeze({
      alpha,
      k0Deg: 90,
      k1LowerDeg: k1.lowerDeg,
      k1UpperDeg: k1.upperDeg,
      k2LowerDeg: k2.lowerDeg,
      k2UpperDeg: k2.upperDeg,
    });
  })
);

// Coarser numeric table (same grid style as imp-34045) rising toward alpha = 1,
// reporting both families' angles and endpoint distances side by side.
const TABLE_ALPHAS = [0, 0.25, 0.5, 0.75, 0.9, 0.95, 0.99, 0.999, 0.9999];
export const IMP34185_TABLE_ROWS = Object.freeze(
  TABLE_ALPHAS.map((alpha) => {
    const k1 = branchAnglesDeg(alpha, 1);
    const k2 = branchAnglesDeg(alpha, 2);
    return Object.freeze({
      alpha,
      k0Deg: 90,
      k1LowerDeg: k1.lowerDeg,
      k1UpperDeg: k1.upperDeg,
      k1DistDeg: k1.distDeg,
      k2LowerDeg: k2.lowerDeg,
      k2UpperDeg: k2.upperDeg,
      k2DistDeg: k2.distDeg,
    });
  })
);
