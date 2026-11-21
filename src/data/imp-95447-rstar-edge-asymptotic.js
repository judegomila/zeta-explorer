/**
 * imp-95447: x -> 1 EDGE closed-form leading asymptotic for the imp-95271
 * bump-wedge boundary r_star(x), the analytic COMPLEMENT of the imp-95377
 * small-x Lambert-W form on the interval (2/e^2, 1). DERIVATION / MEASUREMENT
 * ONLY -- this changes no bound of the Lambda program and asserts no QED; it
 * extends imp-95377-rstar-boundary-closed-form.js past the Lambert-W ceiling.
 *
 * BACKGROUND. imp-95377 (THEOREM RSTAR-EQ) reduced the wedge boundary r_star(x)
 * (root of h_r(x, r) = 0) to the one-parameter transcendental equation, with
 * y = (r - 1)x,
 *   R(y) := (e^y - 1 - y)/(y^2/2) = 1 + y/3 + y^2/12 + y^3/60 + ... = 1/x,   (R)
 * (all series coefficients 2/(k+2)! > 0, R strictly increasing from R(0) = 1).
 * The small-x LEADING form r_star(x) ~ 1 - (2/x)W_{-1}(-sqrt(x/2)) came from
 * dropping 1 + y against y^2/(2x) in (R); it is valid only for x <= 2/e^2 ~
 * 0.27067 (beyond which the W_{-1} argument -sqrt(x/2) leaves the branch domain
 * (-1/e, 0)). imp-95427 supplied a matched mid-range surrogate (the quartic form
 * plus Newton steps) and imp-95428 sharpened the upper bracket; NEITHER gave the
 * explicit x -> 1 leading ASYMPTOTIC EXPANSION, which is what this module derives.
 *
 * DERIVATION (x -> 1 edge, series inversion). As x -> 1- the root y -> 0, so (R)
 * is inverted about y = 0. Put the small edge parameter
 *   delta = 1/x - 1 = (1 - x)/x   (delta -> 0+ as x -> 1-).
 * Then (R) reads R(y) - 1 = delta, i.e.
 *   y/3 + y^2/12 + y^3/60 + y^4/360 + ... = delta.
 * Lagrange inversion of this all-positive-coefficient series gives the unique
 * small positive root as the alternating expansion
 *   y(delta) = 3 delta - (9/4) delta^2 + (81/40) delta^3 - (621/320) delta^4 + ...
 * (coefficients c1 = 3, c2 = -9/4, c3 = 81/40, c4 = -621/320 verified by direct
 * back-substitution into (R) to machine precision). Since r_star = 1 + y/x, the
 *
 *   THEOREM (RSTAR-EDGE).  As x -> 1-, with delta = (1 - x)/x,
 *     r_star(x) = 1 + (1/x)[ 3 delta - (9/4) delta^2 + (81/40) delta^3
 *                            - (621/320) delta^4 + O(delta^5) ].
 *
 * STRUCTURE. The LEADING term alone, r_star(x) ~ 1 + 3 delta/x = 1 + 3(1-x)/x^2,
 * is EXACTLY the imp-95377 cubic UPPER bound: the cubic bound is the first-order
 * x -> 1 asymptote. The next (negative) term turns the monotone one-sided bound
 * into a genuine two-sided asymptotic series (the signs alternate), pulling the
 * estimate down through r_star. The edge series and the small-x Lambert form are
 * the two complementary ends of (0, 1): Lambert is accurate for x <~ 0.05, the
 * edge series for x >~ 0.8, and they bracket a MID-BAND x in ~[0.3, 0.6] where
 * neither leading form is within a few percent (SUB-GAP: single uniformly-valid
 * closed form still open; imp-95427 covers this band only numerically via Newton).
 *
 * MEASURED ACCURACY (rel err of the 3-term edge form vs the exact RSTAR-EQ root):
 *   x = 0.99  1.96e-8,  0.95  1.29e-5,  0.9  2.21e-4,  0.8  4.24e-3,
 *   x = 0.7   2.73e-2,  0.6  1.18e-1  (asymptotic divergence sets in below ~0.6).
 * Cross-checked against the imp-95271 grid table at x = 0.7, 0.9, 0.99:
 *   r_star(0.9) = 1.34230 (edge3 1.34259), r_star(0.99) = 1.03038 (edge3 1.03038).
 *
 * VERDICT. DERIVATION / MEASUREMENT ONLY. THEOREM RSTAR-EDGE gives the closed-form
 * x -> 1 leading asymptotic r_star(x) = 1 + (1/x)[3d - (9/4)d^2 + (81/40)d^3 - ...],
 * d = (1-x)/x, whose leading term recovers the imp-95377 cubic bound and which
 * complements the small-x Lambert form; the residual mid-band uniform closed form
 * is named open. Changes no bound; NO QED; no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Numeric kernel (import-light: no imports)
// ---------------------------------------------------------------------------

// THEOREM RSTAR-EQ (imp-95377): exact root r > 1 of e^((r-1)x) = 1 + (x/2)(r^2 - 1)
function rStarClosed(x) {
  const F = (r) => Math.exp((r - 1) * x) - (1 + (x / 2) * (r * r - 1));
  let lo = 1 + 1e-12;
  let hi = 2;
  while (F(hi) < 0 && hi < 1e9) hi *= 2;
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    if (F(mid) < 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// THEOREM RSTAR-EDGE: x -> 1 leading asymptotic; order in {1,2,3,4}
const EDGE_COEFFS = [3, -9 / 4, 81 / 40, -621 / 320]; // c1..c4
function rStarEdge(x, order) {
  const d = (1 - x) / x;
  let y = 0;
  let dp = 1;
  for (let k = 0; k < order && k < EDGE_COEFFS.length; k++) {
    dp *= d;
    y += EDGE_COEFFS[k] * dp;
  }
  return 1 + y / x;
}

// imp-95377 cubic upper bound = leading (order-1) edge asymptote
function rStarUpperCubic(x) {
  return 1 + (3 * (1 - x)) / (x * x);
}

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95447_RSTAR_EDGE = {
  id: "imp-95447",
  title:
    "x -> 1 edge closed-form leading asymptotic for the imp-95271 bump-wedge " +
    "boundary r_star(x), complement of the imp-95377 small-x Lambert-W form",
  edgeParameter: "delta = (1 - x)/x -> 0+ as x -> 1-",
  reducedEquation:
    "with y = (r-1)x, imp-95377 (R): R(y) = 1 + y/3 + y^2/12 + y^3/60 + ... = " +
    "1/x, so R(y) - 1 = delta is inverted about y = 0 as x -> 1-.",
  edgeExpansion:
    "THEOREM RSTAR-EDGE: y(delta) = 3 delta - (9/4) delta^2 + (81/40) delta^3 " +
    "- (621/320) delta^4 + O(delta^5), hence r_star(x) = 1 + y(delta)/x.",
  leadingTermIsCubicBound:
    "the order-1 term r_star(x) ~ 1 + 3(1-x)/x^2 is EXACTLY the imp-95377 cubic " +
    "upper bound; the alternating higher terms make it a two-sided asymptotic.",
  complementarity:
    "the edge series (accurate x >~ 0.8) and the small-x Lambert form (accurate " +
    "x <~ 0.05) are the two complementary ends of (0,1); a mid-band x in ~[0.3, " +
    "0.6] is reached by NEITHER leading form (SUB-GAP: uniform closed form open).",
  measuredAccuracy:
    "rel err of the 3-term edge form vs exact RSTAR-EQ root: 1.96e-8 (x=0.99), " +
    "1.29e-5 (0.95), 2.21e-4 (0.9), 4.24e-3 (0.8), 2.73e-2 (0.7), 1.18e-1 (0.6).",
  gridCrossCheck:
    "matches the imp-95271 grid table at the x->1 end: r_star(0.9)=1.34230 " +
    "(edge3 1.34259), r_star(0.99)=1.03038 (edge3 1.03038).",
  verdict:
    "DERIVATION / MEASUREMENT ONLY. Closed-form x -> 1 leading asymptotic " +
    "complementing the small-x Lambert form; residual mid-band uniform closed " +
    "form named open. Changes no bound; NO QED; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

export const IMP95447_RSTAR_EDGE_ASSERTIONS = [
  {
    id: "imp95447-edge-coeffs-satisfy-reduced-equation",
    description:
      "the edge coefficients (3, -9/4, 81/40, -621/320) invert R(y) = 1/x: " +
      "back-substituting y(delta) into R(y) - 1 - delta gives O(delta^5)",
    holds: () => {
      const R = (y) => (Math.exp(y) - 1 - y) / (y * y / 2);
      for (const x of [0.85, 0.9, 0.95, 0.99]) {
        const d = (1 - x) / x;
        // reconstruct y directly from the 4-term expansion (not the 1 + y/x wrap)
        let yy = 0;
        let dp = 1;
        for (let k = 0; k < 4; k++) {
          dp *= d;
          yy += EDGE_COEFFS[k] * dp;
        }
        // back-substitution residual is O(d^5); add an absolute FP floor so the
        // very-small-d rows are not dominated by roundoff in R(y)
        const resid = R(yy) - 1 - d;
        if (Math.abs(resid) > 50 * Math.pow(d, 5) + 1e-10) return false;
      }
      return true;
    },
  },
  {
    id: "imp95447-edge-leading-term-is-imp95377-cubic-bound",
    description:
      "the order-1 edge asymptote 1 + 3 delta/x equals the imp-95377 cubic " +
      "upper bound 1 + 3(1-x)/x^2 identically",
    holds: () => {
      for (const x of [0.3, 0.5, 0.7, 0.9, 0.99]) {
        if (Math.abs(rStarEdge(x, 1) - rStarUpperCubic(x)) > 1e-12) return false;
      }
      return true;
    },
  },
  {
    id: "imp95447-edge-accurate-near-one",
    description:
      "the 3-term edge form is within sub-percent of the exact RSTAR-EQ root " +
      "for x >= 0.8 and improves toward x -> 1-",
    holds: () => {
      let prevErr = 1;
      for (const x of [0.8, 0.9, 0.95, 0.99]) {
        const rs = rStarClosed(x);
        const err = Math.abs(rStarEdge(x, 3) - rs) / rs;
        if (!(err < 5e-3)) return false; // sub-percent for x >= 0.8
        if (!(err < prevErr)) return false; // improves toward 1
        prevErr = err;
      }
      return true;
    },
  },
  {
    id: "imp95447-edge-alternating-brackets-root",
    description:
      "successive edge partial sums straddle r_star near x -> 1 (order-1 above, " +
      "order-2 below, order-3 above), i.e. it is a genuine two-sided asymptotic",
    holds: () => {
      for (const x of [0.9, 0.95, 0.99]) {
        const rs = rStarClosed(x);
        if (!(rStarEdge(x, 1) > rs)) return false; // cubic bound: above
        if (!(rStarEdge(x, 2) < rs)) return false; // 2-term: below
        if (!(rStarEdge(x, 3) > rs)) return false; // 3-term: above
      }
      return true;
    },
  },
  {
    id: "imp95447-edge-matches-grid-table",
    description:
      "the 3-term edge form reproduces the imp-95271 grid table at the x -> 1 " +
      "end (x = 0.9, 0.99) to <= 3e-4 relative",
    holds: () => {
      const tab = { 0.9: 1.3423, 0.99: 1.0304 };
      for (const x of Object.keys(tab).map(Number)) {
        const e3 = rStarEdge(x, 3);
        if (Math.abs(e3 - tab[x]) / tab[x] > 3e-4) return false;
      }
      return true;
    },
  },
  {
    id: "imp95447-record-honesty",
    description:
      "the record is derivation/measurement-only, states RSTAR-EDGE, names the " +
      "mid-band sub-gap, carries NO QED and the no-refereed-bound-change line",
    holds: () =>
      /RSTAR-EDGE/.test(IMP95447_RSTAR_EDGE.edgeExpansion) &&
      /SUB-GAP/.test(IMP95447_RSTAR_EDGE.complementarity) &&
      /NO QED/.test(IMP95447_RSTAR_EDGE.verdict) &&
      /refereed bound is changed/i.test(IMP95447_RSTAR_EDGE.verdict) &&
      /MEASUREMENT ONLY/.test(IMP95447_RSTAR_EDGE.verdict),
  },
];

for (const a of IMP95447_RSTAR_EDGE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95447-rstar-edge assertion failed: ${a.id}`);
  }
}

export default IMP95447_RSTAR_EDGE;
