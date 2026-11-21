/**
 * @module imp-34045-phase-zero-endpoint-degeneracy
 *
 * imp-34045 (numerical, frontier-measurement): CHARACTERISE the alpha -> 1 (p -> 2) boundary degeneracy of
 * the imp-33970 joint phase-zero. imp-33970 proved theta = pi/2 is the UNIQUE phase-zero of the imp-33924
 * joint leading amplitude -A(alpha, theta) on the OPEN interval (0, pi) for every cusp exponent alpha in
 * (0, 1), with the second crossing sitting outside the interval and touching the endpoints only in the
 * EXCLUDED limit alpha = 1 (p = 2). This module MEASURES how the outer branches approach the endpoints as
 * p rises to 2 -- tabulating the branch angles vs alpha, their distance from 0 and pi, and the approach
 * rate -- and reports how close to alpha = 1 the second crossing actually enters (0, pi) at finite
 * resolution (answer: never for alpha < 1; it touches the endpoints exactly at alpha = 1).
 *
 * THE TWO OUTER BRANCHES (and an honest correction to the ticket wording)
 * ----------------------------------------------------------------------
 * With p = 1 + alpha in (1, 2), -A(alpha, theta) = 2 B(alpha) |cos(p pi/2)| e^{i p (pi/2 - theta)}, a
 * never-vanishing modulus times the pure phase arg(-A) = p(pi/2 - theta) (imp-33970). Two families of
 * real-axis crossings flank the central real-POSITIVE zero at theta = pi/2:
 *
 *   (i) the outer REAL-NEGATIVE crossings  arg(-A) = pi (mod 2 pi):
 *          theta = pi/2 -+ pi/p                          [ -A on the NEGATIVE real axis ]
 *       these are the branches that COLLAPSE ONTO the endpoints 0+ and pi- as p -> 2 (pi/p -> pi/2), and
 *
 *   (ii) the second real-POSITIVE branch   arg(-A) = 2 pi (mod 2 pi):
 *          theta = pi/2 -+ 2 pi/p                        [ -A on the POSITIVE real axis, the true 2nd zero ]
 *       which sits a further pi/p out and reaches the endpoints only at p = 4 (alpha = 3), FAR outside
 *       the exponent range (0, 1).
 *
 * The ticket title names theta = pi/2 -+ 2 pi/p as the "outer branch"; the honest measurement below shows
 * that the branch which actually approaches 0+ and pi- as alpha -> 1 is family (i), theta = pi/2 -+ pi/p,
 * NOT family (ii). The family-(ii) real-positive branch stays a distance pi/2 outside the interval even at
 * p = 2 -- consistent with imp-33970 uniqueness holding strictly on all of (0, 1). We tabulate BOTH so the
 * distinction is explicit.
 *
 * THE APPROACH LAW (closed form)
 * ------------------------------
 * Distance of the outer real-negative crossing from the nearest endpoint:
 *     d(p) = (pi/p) - (pi/2) = pi (2 - p) / (2 p) = pi (1 - alpha) / ( 2 (1 + alpha) ) .
 * It is monotone decreasing to 0 as p -> 2, with leading behaviour d ~ (pi/4)(2 - p) = (pi/4)(1 - alpha)
 * and endpoint slope d d(alpha)/d alpha |_{alpha = 1} = -pi/4. So the outer crossing approaches the interval
 * boundary LINEARLY in (1 - alpha) with slope pi/4: at alpha = 0.99 it is ~7.85e-3 outside, at alpha = 0.999
 * ~7.85e-4 outside, entering (0, pi) only in the exact limit alpha = 1.
 *
 * NUMERICAL CROSS-CHECK
 * ---------------------
 * For each alpha on a grid rising toward 1, the closed-form -A(alpha, theta) is evaluated AT the predicted
 * branch angles: at pi/2 - pi/p the realness residual |Im|/|amp| is ~0 with Re < 0 (negative real axis),
 * and at pi/2 - 2 pi/p it is ~0 with Re > 0 (positive real axis) -- confirming the two branch families sit
 * exactly where the closed form places them.
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * MEASUREMENT ONLY, pure phase-condition geometry on the inherited imp-33924 closed form for the model cusp
 * rho(x) = |x|^{-alpha}. It establishes NO operator positivity, does NOT re-derive the m_prime -> C_ren map
 * off-axis/off-exponent, and does NOT discharge H4 (imp-33766); G6a_shock_lipschitz STAYS OPEN. C_mb
 * GUE-conditional untouched; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; NO QED. No refereed bound is changed.
 *
 * @see imp-33970-joint-phase-zero-uniqueness (theta = pi/2 unique on (0,pi) for every alpha in (0,1))
 * @see imp-33924-joint-cusp-angle-onset-robustness-map (joint closed form A(alpha,theta), winding -(1+alpha))
 * @see imp-33968-winding-rate-vs-alpha-curve (affine winding-rate law slope(alpha) = -(1+alpha))
 */

// B(alpha) = Gamma(1-alpha) Gamma(1+alpha) = pi alpha / sin(pi alpha).
function bOfAlpha(alpha) {
  return (Math.PI * alpha) / Math.sin(Math.PI * alpha);
}

// Joint leading amplitude -A(alpha, theta), returned as [Re, Im], with
//   A(alpha, theta) = B(alpha) e^{-i(1+alpha)theta} [1 + e^{i(1+alpha)pi}]   (imp-33924 closed form).
function negLeadingAmplitude(alpha, theta) {
  const p = 1 + alpha;
  const bracket = [1 + Math.cos(p * Math.PI), Math.sin(p * Math.PI)]; // 1 + e^{i(1+alpha)pi}
  const rot = [Math.cos(-p * theta), Math.sin(-p * theta)]; // e^{-i(1+alpha)theta}
  const b = bOfAlpha(alpha);
  const aRe = b * (bracket[0] * rot[0] - bracket[1] * rot[1]);
  const aIm = b * (bracket[0] * rot[1] + bracket[1] * rot[0]);
  return [-aRe, -aIm]; // -A(alpha, theta)
}

// realness residual |Im|/|amp| of -A at a given angle.
function realnessResidual(alpha, theta) {
  const amp = negLeadingAmplitude(alpha, theta);
  return Math.abs(amp[1]) / Math.hypot(amp[0], amp[1]);
}

// ---- sweep alpha up toward 1 (p up toward 2) -----------------------------------------------------
const ALPHA_GRID = [0.5, 0.75, 0.9, 0.95, 0.99, 0.999, 0.9999];

const ROWS = ALPHA_GRID.map((alpha) => {
  const p = 1 + alpha;

  // (i) outer REAL-NEGATIVE crossing that collapses onto the endpoints: theta = pi/2 -+ pi/p.
  const negRealLower = Math.PI / 2 - Math.PI / p; // -> 0+ as p -> 2
  const negRealUpper = Math.PI / 2 + Math.PI / p; // -> pi- as p -> 2
  const distEndpointNegReal = Math.PI / p - Math.PI / 2; // |negRealLower - 0| = |negRealUpper - pi|

  // (ii) second real-POSITIVE branch (the true second phase-zero): theta = pi/2 -+ 2 pi/p.
  const posLower = Math.PI / 2 - (2 * Math.PI) / p;
  const posUpper = Math.PI / 2 + (2 * Math.PI) / p;
  const distEndpointPos = (2 * Math.PI) / p - Math.PI / 2; // stays pi/2 at p = 2; -> 0 only at p = 4

  // closed-form approach law and its leading (pi/4)(1-alpha) surrogate.
  const dLaw = (Math.PI * (2 - p)) / (2 * p); // = distEndpointNegReal
  const dLeading = (Math.PI / 4) * (1 - alpha);

  // numeric confirmation that the branches sit where the closed form places them.
  const negRealResid = realnessResidual(alpha, negRealLower);
  const negRealReSign = negLeadingAmplitude(alpha, negRealLower)[0]; // < 0 (negative real axis)
  const posResid = realnessResidual(alpha, posLower);
  const posReSign = negLeadingAmplitude(alpha, posLower)[0]; // > 0 (positive real axis)

  return {
    alpha,
    p: +p.toFixed(6),
    // family (i): the branch that collapses onto the endpoints.
    outerNegRealLowerDeg: +((negRealLower * 180) / Math.PI).toFixed(5),
    outerNegRealUpperDeg: +((negRealUpper * 180) / Math.PI).toFixed(5),
    distFromEndpointNegReal: +distEndpointNegReal.toExponential(6),
    negRealInsideInterval: negRealLower > 0 && negRealUpper < Math.PI, // false for all alpha < 1
    // family (ii): the true second real-positive branch (stays far outside).
    secondPosLowerDeg: +((posLower * 180) / Math.PI).toFixed(5),
    secondPosUpperDeg: +((posUpper * 180) / Math.PI).toFixed(5),
    distFromEndpointSecondPos: +distEndpointPos.toFixed(6),
    secondPosInsideInterval: posLower > 0 && posUpper < Math.PI, // false for all alpha < 3
    // approach law + numeric cross-checks.
    approachLawDistance: +dLaw.toExponential(6),
    leadingSurrogate: +dLeading.toExponential(6),
    negRealResidual: +negRealResid.toExponential(3), // ~0 => crossing is exactly at pi/2 - pi/p
    negRealIsNegativeAxis: negRealReSign < 0,
    posResidual: +posResid.toExponential(3), // ~0 => branch is exactly at pi/2 - 2 pi/p
    posIsPositiveAxis: posReSign > 0,
  };
});

// aggregate verdicts.
// the outer negative-real crossing is monotone decreasing in distance toward 0 as alpha -> 1.
let MONOTONE_APPROACH = true;
for (let i = 1; i < ROWS.length; i++) {
  if (!(ROWS[i].distFromEndpointNegReal < ROWS[i - 1].distFromEndpointNegReal)) MONOTONE_APPROACH = false;
}
// the leading (pi/4)(1-alpha) surrogate tracks the exact law ever more tightly as alpha -> 1.
const LEADING_TIGHTENS =
  Math.abs(ROWS[ROWS.length - 1].approachLawDistance - ROWS[ROWS.length - 1].leadingSurrogate) <
  Math.abs(ROWS[0].approachLawDistance - ROWS[0].leadingSurrogate);
// neither outer branch is ever inside (0, pi) for alpha < 1 -- uniqueness (imp-33970) holds strictly.
const NO_OUTER_BRANCH_INSIDE = ROWS.every((r) => r.negRealInsideInterval === false && r.secondPosInsideInterval === false);
// the closed-form branch angles are confirmed numerically (residuals ~0, correct axis sign).
const BRANCHES_CONFIRMED = ROWS.every(
  (r) => r.negRealResidual < 1e-9 && r.negRealIsNegativeAxis === true && r.posResidual < 1e-9 && r.posIsPositiveAxis === true,
);

// endpoint slope of the approach law d(alpha) = pi(1-alpha)/(2(1+alpha)): d d/d alpha |_{alpha=1} = -pi/4.
const H = 1e-6;
const dOfAlpha = (a) => (Math.PI * (1 - a)) / (2 * (1 + a));
const ENDPOINT_SLOPE = (dOfAlpha(1) - dOfAlpha(1 - H)) / H; // ~ -pi/4
const ENDPOINT_SLOPE_MATCHES = Math.abs(ENDPOINT_SLOPE - -Math.PI / 4) < 1e-4;

export const IMP34045_PHASE_ZERO_ENDPOINT_DEGENERACY = {
  id: 'imp-34045',
  proofSection: 'S-frontier',
  category: 'numerical',
  question:
    'How does the imp-33970 SECOND phase-zero on (0, pi) emerge as the cusp exponent alpha rises to 1 ' +
    '(p = 1 + alpha rises to 2)? Tabulate the outer-branch angles vs alpha, their distance from the ' +
    'interval endpoints 0 and pi, the approach rate as p -> 2, and how close to alpha = 1 the second ' +
    'crossing actually enters (0, pi) at finite numerical resolution.',
  leadingAmplitude:
    '-A(alpha,theta) = 2 B(alpha) |cos(p pi/2)| e^{i p (pi/2 - theta)}, p = 1 + alpha, B = pi alpha/sin(pi alpha)',
  outerBranches:
    'real-NEGATIVE (endpoint-collapsing) crossings theta = pi/2 -+ pi/p; second real-POSITIVE branch ' +
    'theta = pi/2 -+ 2 pi/p (a further pi/p out, reaches endpoints only at p = 4 / alpha = 3)',
  approachLaw:
    'distance of the endpoint-collapsing crossing from 0 (or pi): d(alpha) = pi(1 - alpha)/(2(1 + alpha)) ' +
    '= pi(2 - p)/(2 p); leading d ~ (pi/4)(1 - alpha); endpoint slope d d/d alpha |_{alpha=1} = -pi/4',

  // per-alpha table.
  rows: ROWS,

  // aggregate findings.
  outerCrossingApproachesEndpointMonotonically: MONOTONE_APPROACH,
  leadingSurrogateTightensNearEndpoint: LEADING_TIGHTENS,
  noOuterBranchEntersIntervalBelowAlpha1: NO_OUTER_BRANCH_INSIDE,
  closedFormBranchesConfirmedNumerically: BRANCHES_CONFIRMED,
  endpointApproachSlope: +ENDPOINT_SLOPE.toFixed(6), // ~ -pi/4 = -0.785398
  endpointApproachSlopeMatchesMinusPiOver4: ENDPOINT_SLOPE_MATCHES,

  // the honest answer to "how close to alpha = 1 does the second crossing enter (0, pi)?"
  secondCrossingEntersInterval:
    'NEVER for alpha < 1: the endpoint-collapsing crossing theta = pi/2 - pi/p sits a distance ' +
    'pi(1 - alpha)/(2(1 + alpha)) OUTSIDE (0, pi) and only TOUCHES the boundary in the exact limit alpha = 1 ' +
    '(p = 2). At finite resolution alpha = 0.99 leaves it ~7.85e-3 outside, alpha = 0.999 ~7.85e-4 outside; ' +
    'the true second real-positive branch pi/2 - 2 pi/p is even farther (pi/2 out at p = 2, entering only at ' +
    'p = 4 / alpha = 3). Consistent with imp-33970 uniqueness holding strictly on the whole open range (0, 1).',

  dischargesH4: false,
  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY, G6a_shock_lipschitz STAYS OPEN. The imp-33970 alpha -> 1 (p -> 2) boundary degeneracy ' +
    'of the joint phase-zero is characterised in closed form. With p = 1 + alpha in (1, 2) the amplitude ' +
    '-A = 2 B |cos(p pi/2)| e^{i p (pi/2 - theta)} has its central real-POSITIVE zero fixed at theta = pi/2 and ' +
    'two flanking outer branches: the real-NEGATIVE crossings theta = pi/2 -+ pi/p, and the second ' +
    'real-POSITIVE branch theta = pi/2 -+ 2 pi/p one step (pi/p) farther out. The branch that COLLAPSES onto ' +
    'the endpoints 0+ and pi- as alpha -> 1 is the real-negative pair theta = pi/2 -+ pi/p -- NOT the ' +
    'pi/2 -+ 2 pi/p pair named in the ticket title, which stays a distance pi/2 outside the interval even at ' +
    'p = 2 and reaches the endpoints only at p = 4 (alpha = 3). The outer real-negative crossing approaches the ' +
    'boundary along d(alpha) = pi(1 - alpha)/(2(1 + alpha)) = pi(2 - p)/(2 p), monotone to 0, with leading ' +
    'behaviour (pi/4)(1 - alpha) and endpoint slope -pi/4 (numerically -0.785398). It therefore NEVER enters ' +
    '(0, pi) for alpha < 1 -- it is ~7.85e-3 outside at alpha = 0.99, ~7.85e-4 at alpha = 0.999 -- and only ' +
    'touches the endpoints in the exact excluded limit alpha = 1, exactly as imp-33970 requires. Evaluating the ' +
    'closed form at the predicted angles confirms residual |Im|/|amp| ~ 1e-16 with Re < 0 at pi/2 - pi/p ' +
    '(negative real axis) and Re > 0 at pi/2 - 2 pi/p (positive real axis). Pure phase-condition geometry on the ' +
    'inherited imp-33924 closed form; establishes NO operator positivity; does NOT re-derive the ' +
    'm_prime -> C_ren map off-axis/off-exponent and does NOT discharge H4 (imp-33766). C_mb GUE-conditional ' +
    'untouched; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; NO QED. No refereed bound is changed' +
    '.',
};

export const IMP34045_PHASE_ZERO_ENDPOINT_DEGENERACY_ASSERTIONS = [
  {
    // the endpoint-collapsing crossing approaches the boundary monotonically as alpha -> 1.
    id: 'imp34045-outer-crossing-monotone-approach',
    description: 'the outer real-negative crossing distance pi/p - pi/2 decreases monotonically to 0 as alpha -> 1',
    holds: () =>
      IMP34045_PHASE_ZERO_ENDPOINT_DEGENERACY.outerCrossingApproachesEndpointMonotonically === true &&
      IMP34045_PHASE_ZERO_ENDPOINT_DEGENERACY.rows.every((r) => r.distFromEndpointNegReal > 0),
  },
  {
    // no outer branch is inside (0, pi) for any alpha < 1: imp-33970 uniqueness holds strictly.
    id: 'imp34045-no-outer-branch-inside-below-alpha1',
    description: 'neither outer branch enters (0, pi) for alpha < 1; the true 2nd real-positive branch stays pi/2 out at p=2',
    holds: () =>
      IMP34045_PHASE_ZERO_ENDPOINT_DEGENERACY.noOuterBranchEntersIntervalBelowAlpha1 === true &&
      Math.abs(IMP34045_PHASE_ZERO_ENDPOINT_DEGENERACY.rows.find((r) => r.alpha === 0.9999).distFromEndpointSecondPos - Math.PI / 2) < 1e-3,
  },
  {
    // the closed-form branch angles are confirmed numerically (residuals ~0, correct axis sign).
    id: 'imp34045-branches-confirmed-numerically',
    description: 'evaluating -A at pi/2 - pi/p gives Re<0 residual ~0, at pi/2 - 2pi/p gives Re>0 residual ~0',
    holds: () => IMP34045_PHASE_ZERO_ENDPOINT_DEGENERACY.closedFormBranchesConfirmedNumerically === true,
  },
  {
    // the approach law has endpoint slope -pi/4.
    id: 'imp34045-endpoint-slope-minus-pi-over-4',
    description: 'the approach law d(alpha) = pi(1-alpha)/(2(1+alpha)) has slope -pi/4 at alpha = 1',
    holds: () =>
      IMP34045_PHASE_ZERO_ENDPOINT_DEGENERACY.endpointApproachSlopeMatchesMinusPiOver4 === true &&
      Math.abs(IMP34045_PHASE_ZERO_ENDPOINT_DEGENERACY.endpointApproachSlope - -Math.PI / 4) < 1e-4,
  },
  {
    // Honesty gate: measurement only, does NOT discharge H4; G6a OPEN, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp34045-honesty-gate-no-qed',
    description: 'Measurement only: does not discharge H4, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP34045_PHASE_ZERO_ENDPOINT_DEGENERACY.isRigorous === false &&
      IMP34045_PHASE_ZERO_ENDPOINT_DEGENERACY.dischargesH4 === false &&
      /NO QED/.test(IMP34045_PHASE_ZERO_ENDPOINT_DEGENERACY.verdict) &&
      /STAYS OPEN/.test(IMP34045_PHASE_ZERO_ENDPOINT_DEGENERACY.verdict) &&
      /refereed bound is changed/i.test(IMP34045_PHASE_ZERO_ENDPOINT_DEGENERACY.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(IMP34045_PHASE_ZERO_ENDPOINT_DEGENERACY.verdict),
  },
];

for (const a of IMP34045_PHASE_ZERO_ENDPOINT_DEGENERACY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34045-phase-zero-endpoint-degeneracy assertion failed: ${a.id}`);
  }
}
