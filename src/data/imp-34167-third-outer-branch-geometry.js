/**
 * @module imp-34167-third-outer-branch-geometry
 *
 * imp-34167 (numerical, frontier-measurement): CHARACTERISE the imp-34105-EXCLUDED k = -+3 THIRD outer
 * phase-zero branch (arg(-A) = 3 pi, real-NEGATIVE) theta = pi/2 -+ 3 pi/p (p = 1 + alpha) -- the third
 * real-axis crossing of the imp-33924 joint amplitude -A -- extending the imp-34105 from-scratch
 * Im(-A) sign-change bisection to LOCATE it, and MEASURE where it enters / leaves [0, pi] across the
 * whole cusp-exponent range alpha in (0, 1).
 *
 * imp-34105 ran an INDEPENDENT bracket-and-bisect root-find on Im(-A)(theta) but deliberately EXCLUDED
 * the k = -+3 crossings: its widened window used margin m = 0.3 < pi/p, so only the five crossings
 * k in {-2, -1, 0, 1, 2} were located. This module widens the SAME scan window to span the k = -+3
 * crossings (window half-width 3 pi/p + m, still m = 0.3 < pi/p so k = -+4 stays excluded), locates all
 * SEVEN crossings k in {-3, -2, -1, 0, 1, 2, 3} from scratch, and classifies each independently.
 *
 * THE THIRD-BRANCH ANGLES AND DISTANCE LAW (closed form)
 * -----------------------------------------------------
 * With p = 1 + alpha in (1, 2), arg(-A) = p (pi/2 - theta) (imp-33970). The THIRD crossing sits where
 * arg(-A) = -+3 pi (an ODD multiple of pi -- the real-NEGATIVE axis, like the family (i) k = -+1
 * crossings, NOT the real-positive family (ii) k = -+2), i.e. p (pi/2 - theta) = -+3 pi:
 *
 *     theta = pi/2 -+ 3 pi/p ,   lower = pi/2 - 3 pi/p ,   upper = pi/2 + 3 pi/p .
 *
 * For alpha in (0, 1) we have 3 pi/p in (3 pi/2, 3 pi), so lower < 0 and upper > pi -- the WHOLE pair
 * lies OUTSIDE the closed interval [0, pi], one further step pi/p out than the family (ii) pair. The
 * distance of each end of the pair from the nearest endpoint is
 *
 *     d3(alpha) = 3 pi/p - pi/2 = pi (6 - p) / (2 p) = pi (5 - alpha) / ( 2 (1 + alpha) ) .
 *
 * WHERE THE PAIR REACHES / LEAVES [0, pi]
 * ---------------------------------------
 * d3(alpha) = 0  <=>  6 - p = 0  <=>  alpha = 5 (p = 6): then lower = pi/2 - pi/2 = 0 and
 * upper = pi/2 + pi/2 = pi EXACTLY. For alpha in (0, 1) the distance runs from d3(0) = 5 pi/2 (~7.854)
 * down to d3(1-) = pi (~3.142) -- it is bounded BELOW by pi on the whole cusp range and only shrinks to
 * 0 at alpha = 5, far outside (0, 1). So the k = -+3 pair NEVER enters [0, pi] anywhere on the valid
 * cusp range; it would touch the endpoints (and only then begin to enter) only at alpha = 5. The
 * endpoint slope there is
 *     d d3/d alpha = -3 pi / (1 + alpha)^2 ,   at alpha = 5:  -3 pi/36 = -pi/12 (~ -0.261799) .
 *
 * This continues the endpoint-onset ladder of the outer branches: family (i) k = -+1 reaches the
 * endpoints at alpha = 1 (imp-34045/imp-34103), family (ii) k = -+2 at alpha = 3 (imp-34104/imp-34166),
 * and family (iii) k = -+3 here at alpha = 5 -- the onset alpha marching 1, 3, 5, ... = 2k - 1.
 *
 * INDEPENDENT ROOT-FIND CLASSIFICATION
 * ------------------------------------
 * Each located root theta is classified by k = round(p (pi/2 - theta)/pi) (half-turn index of the
 * continuous phase) and by the sign of Re(-A): the k = -+3 roots carry Re < 0 (arg = -+3 pi, the
 * real-NEGATIVE axis), reproducing the closed-form angles pi/2 -+ 3 pi/p to bisection tolerance (~1e-13),
 * exactly as the family (i) / family (ii) crossings did in imp-34105.
 *
 * FAMILY CONTEXT: this is the k = 3 member of the coherent outer-branch-geometry curvature family
 * whose k = 1 and k = 2 members, imp-34103 (Taylor coefficient pi/8 at onset alpha = 1) and imp-34166
 * (Taylor coefficient pi/32 at onset alpha = 3), each go one derivative further than this module by
 * measuring the endpoint CURVATURE, not just the distance law and its slope. The general
 * d_k''(alpha_k) = pi/(4 k^2) closed form unifying all three onsets (recorded in imp-34173/imp-34240)
 * predicts a k = 3 curvature of pi/36 (Taylor coefficient pi/72), not yet independently measured here.
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * MEASUREMENT ONLY, pure phase-condition geometry on the inherited imp-33924 closed form for the model
 * cusp rho(x) = |x|^{-alpha}. It establishes NO operator positivity, does NOT re-derive the
 * m_prime -> C_ren map off-axis/off-exponent, and does NOT discharge H4 (imp-33766);
 * G6a_shock_lipschitz STAYS OPEN. C_mb GUE-conditional untouched; imp-3066 off-diagonal endpoint-Hankel
 * K_a >= 0 UNTOUCHED; NO QED. No refereed bound is changed.
 *
 * @see imp-34105-phase-zero-rootfind-crossvalidation (independent root-find EXCLUDING k = -+3 via margin m = 0.3)
 * @see imp-34104-second-positive-branch-geometry (the family (ii) real-positive k = -+2 branch, onset alpha = 3)
 * @see imp-34045-phase-zero-endpoint-degeneracy (named the outer branch families; k = -+1 onset alpha = 1)
 * @see imp-33924-joint-cusp-angle-onset-robustness-map (joint closed form A(alpha,theta), winding -(1+alpha))
 * @see imp-34103-endpoint-distance-curvature (family (i) k=1 endpoint-curvature analog, Taylor coeff pi/8)
 * @see imp-34166-second-positive-branch-curvature (family (ii) k=2 endpoint-curvature analog, Taylor coeff pi/32)
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

// imaginary part Im(-A)(theta): a real-axis crossing is exactly a zero of this.
function imNegA(alpha, theta) {
  return negLeadingAmplitude(alpha, theta)[1];
}

// bisect a bracketed sign change of Im(-A) to machine precision (100 iterations) -- the imp-34105 code path.
function bisectImZero(alpha, lo, hi) {
  let a = lo;
  let b = hi;
  let fa = imNegA(alpha, a);
  for (let i = 0; i < 100; i++) {
    const mid = 0.5 * (a + b);
    const fm = imNegA(alpha, mid);
    if (fm === 0) return mid;
    if ((fa < 0) === (fm < 0)) {
      a = mid;
      fa = fm;
    } else {
      b = mid;
    }
  }
  return 0.5 * (a + b);
}

// locate every Im(-A) sign change on [a, b] via a fine scan + bisection (a SECOND code path -- no
// closed-form angle formula is used to find the roots; identical to imp-34105).
function findImZeros(alpha, a, b, n) {
  const roots = [];
  let prevT = a;
  let prevF = imNegA(alpha, a);
  for (let i = 1; i <= n; i++) {
    const t = a + ((b - a) * i) / n;
    const f = imNegA(alpha, t);
    if (f === 0) {
      roots.push(t);
    } else if (prevF !== 0 && prevF * f < 0) {
      roots.push(bisectImZero(alpha, prevT, t));
    }
    prevT = t;
    prevF = f;
  }
  return roots;
}

// exact third real-negative branch endpoint distance: d3(alpha) = 3 pi/p - pi/2.
function d3OfAlpha(alpha) {
  return (Math.PI * (5 - alpha)) / (2 * (1 + alpha)); // = 3 pi/p - pi/2, p = 1 + alpha
}

// ---- sweep alpha across the WHOLE cusp-exponent range (0, 1) ------------------------------------
const ALPHA_GRID = [0.05, 0.1, 0.25, 0.5, 0.75, 0.9, 0.99];

const SCAN_POINTS = 8000; // fine enough that no two crossings (spacing pi/p) share a scan cell out to k = 3
const MARGIN = 0.3; // < pi/p, so the k = -+3 crossings are INCLUDED but k = -+4 stays excluded

const ROWS = ALPHA_GRID.map((alpha) => {
  const p = 1 + alpha;

  // widened window spanning the k = -+3 crossings: [pi/2 - (3 pi/p + m), pi/2 + (3 pi/p + m)].
  const half = (3 * Math.PI) / p + MARGIN;
  const roots = findImZeros(alpha, Math.PI / 2 - half, Math.PI / 2 + half, SCAN_POINTS);

  // classify each located root independently: half-turn index k, closed-form angle, discrepancy, Re sign.
  const classified = roots.map((theta) => {
    const k = Math.round((p * (Math.PI / 2 - theta)) / Math.PI);
    const closedForm = Math.PI / 2 - (k * Math.PI) / p;
    const discrepancy = Math.abs(theta - closedForm);
    const reSign = negLeadingAmplitude(alpha, theta)[0];
    return { theta, k, closedForm, discrepancy, reSign };
  });

  const byK = (kk) => classified.find((c) => c.k === kk);
  const thirdLower = byK(3); // pi/2 - 3 pi/p, arg = 3 pi (Re < 0)
  const thirdUpper = byK(-3); // pi/2 + 3 pi/p, arg = -3 pi (Re < 0)

  const posLower = thirdLower ? thirdLower.theta : NaN; // < 0 for alpha < 5
  const posUpper = thirdUpper ? thirdUpper.theta : NaN; // > pi for alpha < 5
  const distFrom0 = 0 - posLower; // = 3 pi/p - pi/2 (lower is below 0)
  const distFromPi = posUpper - Math.PI; // = 3 pi/p - pi/2 (upper is above pi)

  const dLaw = d3OfAlpha(alpha); // closed-form endpoint distance
  const signedOffset = Math.PI / 2 - (3 * Math.PI) / p; // = pi(alpha - 5)/(2(1+alpha)), NEGATIVE

  const maxThirdDiscrepancy = Math.max(
    thirdLower ? thirdLower.discrepancy : 0,
    thirdUpper ? thirdUpper.discrepancy : 0,
  );

  return {
    alpha,
    p: +p.toFixed(6),
    numRootsInWideWindow: roots.length, // 7 (k in {-3..3})
    thirdNegLowerDeg: thirdLower ? +((thirdLower.theta * 180) / Math.PI).toFixed(5) : null,
    thirdNegUpperDeg: thirdUpper ? +((thirdUpper.theta * 180) / Math.PI).toFixed(5) : null,
    thirdNegLowerClosedFormDeg: thirdLower ? +((thirdLower.closedForm * 180) / Math.PI).toFixed(5) : null,
    thirdDiscrepancy: +maxThirdDiscrepancy.toExponential(3), // ~1e-13
    distFrom0: +distFrom0.toExponential(6),
    distFromPi: +distFromPi.toExponential(6),
    distLawClosedForm: +dLaw.toExponential(6), // pi(5-alpha)/(2(1+alpha))
    signedOffsetPiOver2Minus3PiOverP: +signedOffset.toExponential(6), // NEGATIVE
    insideInterval: posLower > 0 && posUpper < Math.PI, // false for all alpha < 5
    thirdLowerReSign: thirdLower ? Math.sign(thirdLower.reSign) : null, // -1 (real-NEGATIVE axis)
    thirdUpperReSign: thirdUpper ? Math.sign(thirdUpper.reSign) : null, // -1 (real-NEGATIVE axis)
  };
});

// aggregate verdicts.
// the widened root-find locates all SEVEN crossings k in {-3,...,3} for every alpha (imp-34105 got five).
const SEVEN_ROOTS_IN_WIDE_WINDOW = ROWS.every((r) => r.numRootsInWideWindow === 7);
// the located k = -+3 roots reproduce the closed-form angles pi/2 -+ 3 pi/p to bisection tolerance.
const THIRD_BRANCH_REPRODUCES_CLOSED_FORM = ROWS.every((r) => r.thirdDiscrepancy < 1e-9);
// the k = -+3 pair is NEVER inside (0, pi) for any alpha in (0, 1).
const NEVER_INSIDE_ON_RANGE = ROWS.every((r) => r.insideInterval === false && r.distFrom0 > 0 && r.distFromPi > 0);
// its endpoint distance is bounded BELOW by pi across (0, 1) (only touching 0 at alpha = 5).
const DIST_BOUNDED_BELOW_BY_PI = ROWS.every((r) => r.distLawClosedForm >= Math.PI - 1e-12);
// the corrected closed-form distance matches the directly measured distances from 0 and pi.
const DIST_LAW_MATCHES_MEASUREMENT = ROWS.every(
  (r) =>
    Math.abs(r.distLawClosedForm - r.distFrom0) < 1e-9 && Math.abs(r.distLawClosedForm - r.distFromPi) < 1e-9,
);
// the third branch sits on the real-NEGATIVE axis (arg = -+3 pi): Re < 0 at both ends.
const NEGATIVE_AXIS_CONFIRMED = ROWS.every((r) => r.thirdLowerReSign === -1 && r.thirdUpperReSign === -1);

// the branch reaches the endpoints (distance 0) EXACTLY at alpha = 5 (p = 6).
const D3_AT_ALPHA5 = d3OfAlpha(5); // = 0
const LOWER_AT_ALPHA5 = Math.PI / 2 - (3 * Math.PI) / (1 + 5); // = 0
const UPPER_AT_ALPHA5 = Math.PI / 2 + (3 * Math.PI) / (1 + 5); // = pi
const REACHES_ENDPOINTS_ONLY_AT_ALPHA5 =
  Math.abs(D3_AT_ALPHA5) < 1e-12 && Math.abs(LOWER_AT_ALPHA5) < 1e-12 && Math.abs(UPPER_AT_ALPHA5 - Math.PI) < 1e-12;

// endpoint slope of d3(alpha) = pi(5-alpha)/(2(1+alpha)): d d3/d alpha |_{alpha=5} = -pi/12.
const H = 1e-6;
const ENDPOINT_SLOPE_AT_ALPHA5 = (d3OfAlpha(5 + H) - d3OfAlpha(5 - H)) / (2 * H); // ~ -pi/12
const ENDPOINT_SLOPE_MATCHES = Math.abs(ENDPOINT_SLOPE_AT_ALPHA5 - -Math.PI / 12) < 1e-6;

export const IMP34167_THIRD_OUTER_BRANCH_GEOMETRY = {
  id: 'imp-34167',
  proofSection: 'S-frontier',
  category: 'numerical',
  question:
    'Characterise the imp-34105-EXCLUDED k = -+3 THIRD outer phase-zero branch (arg(-A) = 3 pi, ' +
    'real-NEGATIVE) theta = pi/2 -+ 3 pi/p: extend the imp-34105 from-scratch Im(-A) bisection to LOCATE it, ' +
    'measure its closed-form angle and endpoint distance d3(alpha) = 3 pi/p - pi/2, classify it by Re(-A) sign ' +
    'and half-turn index, and measure the alpha at which the pair reaches the [0, pi] endpoints.',
  leadingAmplitude:
    '-A(alpha,theta) = 2 B(alpha) |cos(p pi/2)| e^{i p (pi/2 - theta)}, p = 1 + alpha, B = pi alpha/sin(pi alpha); ' +
    'arg(-A) = p(pi/2 - theta)',
  thirdBranchAngles:
    'theta = pi/2 -+ 3 pi/p (arg(-A) = -+3 pi, an ODD multiple of pi -- the real-NEGATIVE axis, like family (i) ' +
    'k = -+1, not the real-positive family (ii) k = -+2); for alpha in (0,1), 3 pi/p in (3 pi/2, 3 pi) so ' +
    'lower < 0 and upper > pi -- the whole pair is outside [0, pi]',
  distanceLaw:
    'endpoint distance d3(alpha) = 3 pi/p - pi/2 = pi(5 - alpha)/(2(1 + alpha)); bounded below by pi on (0,1); ' +
    'zero only at alpha = 5 (p = 6); endpoint slope d d3/d alpha |_{alpha=5} = -3 pi/(1+alpha)^2 = -pi/12',
  onsetLadder:
    'endpoint-onset alpha of the outer branches marches 1, 3, 5, ... = 2k - 1: family (i) k = -+1 at alpha = 1 ' +
    '(imp-34045/imp-34103), family (ii) k = -+2 at alpha = 3 (imp-34104/imp-34166), family (iii) k = -+3 at alpha = 5',
  rootFindExtension:
    'imp-34105 used margin m = 0.3 < pi/p and located only k in {-2,-1,0,1,2}; widening the SAME scan to ' +
    'half-width 3 pi/p + m (m still 0.3 < pi/p) locates all SEVEN crossings k in {-3,-2,-1,0,1,2,3}',

  // per-alpha table.
  rows: ROWS,

  // aggregate findings.
  sevenRootsInWideWindow: SEVEN_ROOTS_IN_WIDE_WINDOW,
  thirdBranchReproducesClosedForm: THIRD_BRANCH_REPRODUCES_CLOSED_FORM,
  thirdBranchNeverInsideIntervalOnRange: NEVER_INSIDE_ON_RANGE,
  endpointDistanceBoundedBelowByPi: DIST_BOUNDED_BELOW_BY_PI,
  closedFormDistanceMatchesMeasurement: DIST_LAW_MATCHES_MEASUREMENT,
  negativeRealAxisConfirmed: NEGATIVE_AXIS_CONFIRMED,
  reachesEndpointsOnlyAtAlpha5: REACHES_ENDPOINTS_ONLY_AT_ALPHA5,
  endpointSlopeAtAlpha5: +ENDPOINT_SLOPE_AT_ALPHA5.toFixed(6), // ~ -pi/12 = -0.261799
  endpointSlopeMatchesMinusPiOver12: ENDPOINT_SLOPE_MATCHES,

  thirdBranchEntersInterval:
    'NEVER for alpha in (0, 1): the k = -+3 real-NEGATIVE branch theta = pi/2 -+ 3 pi/p lies entirely OUTSIDE ' +
    '[0, pi] (lower < 0, upper > pi) at a distance d3(alpha) = pi(5 - alpha)/(2(1 + alpha)) >= pi from the ' +
    'endpoints across the whole cusp range, closing to 0 -- and thus touching 0 and pi -- only at alpha = 5 ' +
    '(p = 6), with endpoint slope -pi/12 there. Consistent with imp-33970 uniqueness holding strictly on (0, 1).',

  dischargesH4: false,
  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY, G6a_shock_lipschitz STAYS OPEN. The imp-34105-EXCLUDED k = -+3 THIRD outer phase-zero ' +
    'branch (arg(-A) = -+3 pi, real-NEGATIVE) theta = pi/2 -+ 3 pi/p is located and characterised across the ' +
    'whole cusp-exponent range alpha in (0, 1). Widening the imp-34105 from-scratch Im(-A) sign-change bisection ' +
    'from half-width 2 pi/p + 0.3 (which excluded k = -+3) to 3 pi/p + 0.3 locates all SEVEN crossings ' +
    'k in {-3,-2,-1,0,1,2,3}; classified independently by k = round(p(pi/2 - theta)/pi) and by the sign of ' +
    'Re(-A), the k = -+3 roots carry Re < 0 (the real-NEGATIVE axis, like family (i)) and reproduce the ' +
    'closed-form angles pi/2 -+ 3 pi/p to bisection tolerance (~1e-13). With p = 1 + alpha in (1, 2) the offset ' +
    '3 pi/p lies in (3 pi/2, 3 pi), so the branch pair lower = pi/2 - 3 pi/p < 0 and upper = pi/2 + 3 pi/p > pi ' +
    'sits ENTIRELY outside [0, pi]; the endpoint distance is d3(alpha) = 3 pi/p - pi/2 = pi(5 - alpha)/(2(1 + alpha)), ' +
    'bounded below by pi on (0, 1) (from 5 pi/2 at alpha -> 0 down to pi at alpha -> 1) and reaching 0 -- so ' +
    'touching the endpoints 0 and pi exactly (lower = 0, upper = pi) -- only at alpha = 5 (p = 6), with endpoint ' +
    'slope d d3/d alpha = -3 pi/(1 + alpha)^2 = -pi/12 there. The k = -+3 pair therefore NEVER enters [0, pi] on ' +
    'the valid cusp range; its endpoint-onset alpha = 5 continues the outer-branch ladder 1, 3, 5, ... = 2k - 1 ' +
    '(family (i) at alpha = 1, family (ii) at alpha = 3). Pure phase-condition geometry on the inherited ' +
    'imp-33924 closed form; establishes NO operator positivity; does NOT re-derive the m_prime -> C_ren map ' +
    'off-axis/off-exponent and does NOT discharge H4 (imp-33766). C_mb GUE-conditional untouched; imp-3066 ' +
    'off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; NO QED. No refereed bound is changed.',
};

export const IMP34167_THIRD_OUTER_BRANCH_GEOMETRY_ASSERTIONS = [
  {
    // the widened root-find locates all seven crossings k in {-3,...,3}, reproducing the k = -+3 closed form.
    id: 'imp34167-seven-roots-reproduce-closed-form',
    description: 'the widened bisection locates all SEVEN crossings k in {-3..3}, k = -+3 matching pi/2 -+ 3 pi/p to ~1e-13',
    holds: () =>
      IMP34167_THIRD_OUTER_BRANCH_GEOMETRY.sevenRootsInWideWindow === true &&
      IMP34167_THIRD_OUTER_BRANCH_GEOMETRY.thirdBranchReproducesClosedForm === true,
  },
  {
    // the third real-negative branch is never inside (0, pi) for any alpha in (0, 1).
    id: 'imp34167-third-branch-never-inside-on-range',
    description: 'the third real-negative branch theta = pi/2 -+ 3 pi/p is outside [0, pi] for all alpha in (0, 1)',
    holds: () =>
      IMP34167_THIRD_OUTER_BRANCH_GEOMETRY.thirdBranchNeverInsideIntervalOnRange === true &&
      IMP34167_THIRD_OUTER_BRANCH_GEOMETRY.rows.every((r) => r.distFrom0 > 0 && r.distFromPi > 0),
  },
  {
    // the endpoint distance is bounded below by pi on (0, 1) and the closed form matches the measurement.
    id: 'imp34167-distance-law-bounded-and-matches',
    description: 'endpoint distance pi(5-alpha)/(2(1+alpha)) >= pi on (0,1) and matches the measured distFrom0/distFromPi',
    holds: () =>
      IMP34167_THIRD_OUTER_BRANCH_GEOMETRY.endpointDistanceBoundedBelowByPi === true &&
      IMP34167_THIRD_OUTER_BRANCH_GEOMETRY.closedFormDistanceMatchesMeasurement === true,
  },
  {
    // arg(-A) = -+3 pi (the real-NEGATIVE axis) is confirmed numerically: Re < 0 at both ends of the pair.
    id: 'imp34167-negative-real-axis-confirmed',
    description: 'the located k = -+3 roots carry Re(-A) < 0 (arg = -+3 pi, the real-NEGATIVE axis, like family (i))',
    holds: () => IMP34167_THIRD_OUTER_BRANCH_GEOMETRY.negativeRealAxisConfirmed === true,
  },
  {
    // the branch reaches the endpoints only at alpha = 5, with endpoint slope -pi/12.
    id: 'imp34167-reaches-endpoints-only-at-alpha5',
    description: 'd3(alpha) = 0 with lower = 0, upper = pi exactly at alpha = 5, and endpoint slope -pi/12 there',
    holds: () =>
      IMP34167_THIRD_OUTER_BRANCH_GEOMETRY.reachesEndpointsOnlyAtAlpha5 === true &&
      IMP34167_THIRD_OUTER_BRANCH_GEOMETRY.endpointSlopeMatchesMinusPiOver12 === true &&
      Math.abs(IMP34167_THIRD_OUTER_BRANCH_GEOMETRY.endpointSlopeAtAlpha5 - -Math.PI / 12) < 1e-4,
  },
  {
    // Honesty gate: measurement only, does NOT discharge H4; G6a OPEN, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp34167-honesty-gate-no-qed',
    description: 'Measurement only: does not discharge H4, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP34167_THIRD_OUTER_BRANCH_GEOMETRY.isRigorous === false &&
      IMP34167_THIRD_OUTER_BRANCH_GEOMETRY.dischargesH4 === false &&
      /NO QED/.test(IMP34167_THIRD_OUTER_BRANCH_GEOMETRY.verdict) &&
      /STAYS OPEN/.test(IMP34167_THIRD_OUTER_BRANCH_GEOMETRY.verdict) &&
      /refereed bound is changed/i.test(IMP34167_THIRD_OUTER_BRANCH_GEOMETRY.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(IMP34167_THIRD_OUTER_BRANCH_GEOMETRY.verdict) &&
      /C_mb GUE-conditional untouched/i.test(IMP34167_THIRD_OUTER_BRANCH_GEOMETRY.verdict),
  },
];

for (const a of IMP34167_THIRD_OUTER_BRANCH_GEOMETRY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34167-third-outer-branch-geometry assertion failed: ${a.id}`);
  }
}
