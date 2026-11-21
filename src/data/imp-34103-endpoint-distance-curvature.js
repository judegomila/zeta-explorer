/**
 * @module imp-34103-endpoint-distance-curvature
 *
 * imp-34103 (numerical, frontier-measurement): MEASURE the quadratic curvature term of the imp-34045
 * outer real-negative branch endpoint-distance law beyond the linear pi/4 slope, as alpha -> 1.
 *
 * imp-34045 derived (closed form) that the imp-33970 outer real-NEGATIVE phase-zero branch
 * theta = pi/2 -+ pi/p (p = 1 + alpha) sits a distance
 *
 *     d(alpha) = pi (1 - alpha) / ( 2 (1 + alpha) ) = pi (2 - p) / (2 p)
 *
 * OUTSIDE the interval endpoints 0 and pi, collapsing onto 0+ and pi- only in the excluded limit
 * alpha = 1 (p = 2). imp-34045 reported ONLY the LINEARISED endpoint slope dd/dalpha|_{alpha=1} = -pi/4,
 * i.e. the leading behaviour d ~ (pi/4)(1 - alpha). This module measures the NEXT (quadratic) term.
 *
 * THE PREDICTION (exact Taylor expansion about alpha = 1)
 * ------------------------------------------------------
 * Put alpha = 1 - e (so e = 1 - alpha -> 0+). Then 1 - alpha = e and 1 + alpha = 2 - e, so
 *
 *     d = pi e / ( 2 (2 - e) ) = (pi e / 4) * 1/(1 - e/2)
 *       = (pi e / 4) ( 1 + e/2 + e^2/4 + ... )
 *       = (pi/4) e + (pi/8) e^2 + (pi/16) e^3 + ...
 *
 * so the LINEAR coefficient is pi/4 (the imp-34045 slope) and the leading QUADRATIC coefficient
 * predicted for the (1 - alpha)^2 term is pi/8 ~ 0.39269908, with the next cubic term pi/16.
 *
 * THE MEASUREMENT
 * ---------------
 * On the grid alpha in {0.9, 0.99, 0.999, 0.9999} we evaluate the exact closed form d(alpha), subtract
 * the linear surrogate (pi/4)(1 - alpha), and divide the residual by (1 - alpha)^2 to read off the
 * EMPIRICAL quadratic coefficient c2(e) = [ d - (pi/4) e ] / e^2. Because d has the exact closed form
 * above, c2(e) = pi / ( 4 (2 - e) ), which decreases monotonically to pi/8 as e -> 0 with the deviation
 * c2(e) - pi/8 = pi e / ( 8 (2 - e) ) shrinking LINEARLY in e (a factor ~10 per decade of e). As a
 * further confirmation of the whole expansion we also subtract the pi/8 e^2 term and read the cubic
 * coefficient c3(e) = [ d - (pi/4) e - (pi/8) e^2 ] / e^3 = pi / ( 8 (2 - e) ) -> pi/16.
 *
 * RESULT: the measured quadratic coefficient converges to pi/8 (0.3927 at alpha = 0.9999 vs pi/8 =
 * 0.392699, deviation ~2.0e-5) and the measured cubic coefficient to pi/16, confirming the predicted
 * curvature term EXACTLY and its linear-in-(1-alpha) convergence.
 *
 * FAMILY CONTEXT: this is the k = 1 member of the coherent outer-branch-geometry curvature family
 * completed by imp-34166 (family (ii), k = 2, Taylor coefficient pi/32 at onset alpha = 3) and
 * imp-34167 (family (iii), k = 3, onset alpha = 5, distance law/slope only, curvature not yet measured
 * there). The general d_k''(alpha_k) = pi/(4 k^2) closed form unifying all three onsets is recorded in
 * imp-34173/imp-34240 (k=1 gives pi/4 = 2 * pi/8, matching this module's Taylor coefficient).
 *
 * RECONCILIATION (imp-34307): a label discrepancy exists across downstream references -- imp-34230's
 * curvature ladder cites imp-34103 as "pi/4 (k=1)" while several pending queue tickets cite this same
 * family-(i) "curvature" as pi/8. Both literals are numerically correct but name DIFFERENT quantities:
 * pi/8 is the QUADRATIC TAYLOR COEFFICIENT (the e^2 term measured here), whereas the ENDPOINT CURVATURE
 * (the second derivative d''(alpha) at the onset alpha=1) is d''(1) = 2 pi / (1 + alpha)^3 |_{alpha=1}
 * = 2 pi / 8 = pi/4, EXACTLY twice the Taylor coefficient (since for f(e) = c2 e^2 + ..., f'' = 2 c2).
 * The imp-34173 unified law d_k''(alpha_k) = pi/(4 k^2) is the second-derivative convention, so pi/4
 * (k=1) is the correct curvature literal and imp-34230's ladder is internally consistent; the pending
 * tickets labelling imp-34103's "curvature" as pi/8 are loosely equating the Taylor coefficient with the
 * second derivative. This module confirms d''(1) = pi/4 = 2 * (pi/8) numerically below.
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * MEASUREMENT ONLY, pure phase-condition geometry on the inherited imp-33924 / imp-34045 closed form for
 * the model cusp rho(x) = |x|^{-alpha}. It establishes NO operator positivity; does NOT discharge H4
 * (imp-33766); G6a_shock_lipschitz STAYS OPEN. C_mb GUE-conditional untouched; imp-3066 off-diagonal
 * endpoint-Hankel K_a >= 0 UNTOUCHED; NO QED. No refereed bound is changed.
 *
 * @see imp-34045-phase-zero-endpoint-degeneracy (outer branch distance law d(alpha), reports linear pi/4 slope only)
 * @see imp-33970-joint-phase-zero-uniqueness (theta = pi/2 unique on (0,pi) for every alpha in (0,1))
 * @see imp-33924-joint-cusp-angle-onset-robustness-map (joint closed form A(alpha,theta), winding -(1+alpha))
 * @see imp-34166-second-positive-branch-curvature (family (ii) k=2 curvature analog, Taylor coeff pi/32 at onset alpha=3)
 * @see imp-34167-third-outer-branch-geometry (family (iii) k=3 member of the same onset-alpha=2k-1 ladder)
 */

// exact outer real-negative branch endpoint distance (imp-34045 closed form).
function endpointDistance(alpha) {
  return (Math.PI * (1 - alpha)) / (2 * (1 + alpha));
}

const PI = Math.PI;
const PREDICTED_LINEAR = PI / 4; // imp-34045 endpoint slope magnitude.
const PREDICTED_QUADRATIC = PI / 8; // leading (1 - alpha)^2 coefficient, this ticket.
const PREDICTED_CUBIC = PI / 16; // next term, bonus confirmation.

// imp-34307 reconciliation: closed-form SECOND DERIVATIVE (curvature) of the endpoint distance.
// d(alpha) = (pi/2)(1-alpha)/(1+alpha) has d''(alpha) = 2 pi / (1 + alpha)^3, so the ENDPOINT
// curvature at the onset alpha=1 is d''(1) = pi/4 -- exactly TWICE the pi/8 quadratic Taylor coeff.
function endpointSecondDerivative(alpha) {
  return (2 * PI) / Math.pow(1 + alpha, 3);
}
const ONSET_ALPHA = 1;
const CURVATURE_AT_ONSET = endpointSecondDerivative(ONSET_ALPHA); // pi/4 = 0.78539816.
// independent central second-difference cross-check of d''(1) directly from the distance law.
const H_FD = 1e-4;
const CURVATURE_FD =
  (endpointDistance(ONSET_ALPHA + H_FD) - 2 * endpointDistance(ONSET_ALPHA) + endpointDistance(ONSET_ALPHA - H_FD)) /
  (H_FD * H_FD);

const ALPHA_GRID = [0.9, 0.99, 0.999, 0.9999];

const ROWS = ALPHA_GRID.map((alpha) => {
  const e = 1 - alpha; // small parameter.
  const d = endpointDistance(alpha);
  const linearTerm = PREDICTED_LINEAR * e; // (pi/4)(1 - alpha).
  const residualAfterLinear = d - linearTerm; // ~ (pi/8) e^2.
  const measuredQuadratic = residualAfterLinear / (e * e); // c2(e) -> pi/8.
  const residualAfterQuadratic = residualAfterLinear - PREDICTED_QUADRATIC * e * e; // ~ (pi/16) e^3.
  const measuredCubic = residualAfterQuadratic / (e * e * e); // c3(e) -> pi/16.

  return {
    alpha,
    oneMinusAlpha: +e.toExponential(6),
    distance: +d.toExponential(8),
    linearSurrogate: +linearTerm.toExponential(8),
    residualAfterLinear: +residualAfterLinear.toExponential(8),
    measuredQuadraticCoeff: +measuredQuadratic.toFixed(8),
    quadraticDeviationFromPiOver8: +(measuredQuadratic - PREDICTED_QUADRATIC).toExponential(6),
    measuredCubicCoeff: +measuredCubic.toFixed(8),
    cubicDeviationFromPiOver16: +(measuredCubic - PREDICTED_CUBIC).toExponential(6),
  };
});

// aggregate verdicts.
// the measured quadratic coefficient approaches pi/8 monotonically from above as alpha -> 1.
let QUADRATIC_MONOTONE_TO_PI8 = true;
for (let i = 1; i < ROWS.length; i++) {
  const prev = ROWS[i - 1].measuredQuadraticCoeff;
  const cur = ROWS[i].measuredQuadraticCoeff;
  if (!(cur < prev && cur > PREDICTED_QUADRATIC)) QUADRATIC_MONOTONE_TO_PI8 = false;
}

// the finest rung pins the quadratic coefficient to pi/8 to ~2e-5.
const FINEST = ROWS[ROWS.length - 1];
const QUADRATIC_MATCHES_PI8 = Math.abs(FINEST.measuredQuadraticCoeff - PREDICTED_QUADRATIC) < 5e-5;

// the deviation c2(e) - pi/8 shrinks by a factor ~10 per decade of e (linear-in-e convergence).
const devFirst = Math.abs(ROWS[0].measuredQuadraticCoeff - PREDICTED_QUADRATIC);
const devLast = Math.abs(FINEST.measuredQuadraticCoeff - PREDICTED_QUADRATIC);
const decades = ROWS.length - 1; // 0.9 -> 0.9999 is 3 decades of e.
const CONVERGENCE_RATE_LINEAR = devFirst / devLast > Math.pow(10, decades) * 0.5 &&
  devFirst / devLast < Math.pow(10, decades) * 2;

// the next (cubic) coefficient likewise converges to pi/16, confirming the full expansion.
const CUBIC_MATCHES_PI16 = Math.abs(FINEST.measuredCubicCoeff - PREDICTED_CUBIC) < 5e-5;

export const IMP34103_ENDPOINT_DISTANCE_CURVATURE = {
  id: 'imp-34103',
  proofSection: 'S-frontier',
  category: 'numerical',
  question:
    'Beyond the imp-34045 linear pi/4 endpoint slope, what is the QUADRATIC curvature term of the outer ' +
    'real-negative branch endpoint distance d(alpha) = pi(1 - alpha)/(2(1 + alpha)) as alpha -> 1? Tabulate ' +
    'd on a grid alpha in {0.9, 0.99, 0.999, 0.9999}, subtract the linear (pi/4)(1 - alpha) term, and MEASURE ' +
    'the residual second-order coefficient, testing the predicted pi/8 (1 - alpha)^2 term.',
  distanceLaw: 'd(alpha) = pi(1 - alpha)/(2(1 + alpha)) = pi(2 - p)/(2 p), p = 1 + alpha (imp-34045 closed form)',
  taylorExpansion:
    'with alpha = 1 - e: d = (pi/4) e + (pi/8) e^2 + (pi/16) e^3 + ... ; linear pi/4, quadratic pi/8, cubic pi/16',
  predictedLinearCoeff: +PREDICTED_LINEAR.toFixed(8), // 0.78539816
  predictedQuadraticCoeff: +PREDICTED_QUADRATIC.toFixed(8), // 0.39269908
  predictedCubicCoeff: +PREDICTED_CUBIC.toFixed(8), // 0.19634954

  // imp-34307 reconciliation of the pi/4-vs-pi/8 endpoint-curvature label discrepancy.
  quadraticTaylorCoeff: +PREDICTED_QUADRATIC.toFixed(8), // pi/8: coefficient of the e^2 Taylor term.
  endpointCurvatureSecondDerivativeAtOnset: +CURVATURE_AT_ONSET.toFixed(8), // pi/4: d''(1), the CURVATURE.
  endpointCurvatureFiniteDifferenceCheck: +CURVATURE_FD.toFixed(6), // -> pi/4 from central 2nd difference.
  curvatureEqualsTwiceQuadraticCoeff: Math.abs(CURVATURE_AT_ONSET - 2 * PREDICTED_QUADRATIC) < 1e-12,
  curvatureLabelReconciliation:
    'pi/4 (imp-34230 ladder, k=1) is the ENDPOINT CURVATURE d2 = 2 pi/(1+alpha)^3 at alpha=1 (d2 = second ' +
    'derivative); pi/8 is the QUADRATIC TAYLOR COEFFICIENT (e^2 term) = half the curvature. Both are correct ' +
    'for their own quantity; the imp-34173 pi/(4 k^2) unified law uses the second-derivative convention, so ' +
    'pi/4 is the correct curvature literal for k=1 and downstream tickets calling this curvature pi/8 conflate ' +
    'the Taylor coefficient with the second derivative.',

  // per-alpha measurement table.
  rows: ROWS,

  // aggregate findings.
  measuredQuadraticCoeffAtFinestRung: FINEST.measuredQuadraticCoeff, // -> pi/8
  quadraticCoeffApproachesPiOver8Monotonically: QUADRATIC_MONOTONE_TO_PI8,
  quadraticCoeffMatchesPiOver8: QUADRATIC_MATCHES_PI8,
  quadraticConvergenceIsLinearInOneMinusAlpha: CONVERGENCE_RATE_LINEAR,
  measuredCubicCoeffAtFinestRung: FINEST.measuredCubicCoeff, // -> pi/16
  cubicCoeffMatchesPiOver16: CUBIC_MATCHES_PI16,

  finding:
    'CONFIRMED. Subtracting the imp-34045 linear (pi/4)(1 - alpha) term from the exact distance and dividing ' +
    'by (1 - alpha)^2 gives a measured quadratic coefficient that decreases monotonically toward pi/8 = ' +
    '0.39269908 (0.41337 at alpha = 0.9, 0.39289 at alpha = 0.999, 0.39272 at alpha = 0.9999, deviation ~2.0e-5), ' +
    'with the deviation shrinking by a factor ~10 per decade of (1 - alpha) -- exactly the closed-form value ' +
    'c2(e) = pi/(4(2 - e)) -> pi/8. The next cubic coefficient likewise converges to pi/16, confirming the full ' +
    'expansion d = (pi/4) e + (pi/8) e^2 + (pi/16) e^3 + ... about alpha = 1.',

  dischargesH4: false,
  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY, G6a_shock_lipschitz STAYS OPEN. The quadratic curvature term of the imp-34045 outer ' +
    'real-negative branch endpoint distance d(alpha) = pi(1 - alpha)/(2(1 + alpha)) is measured beyond the ' +
    'reported linear pi/4 slope. Expanding about alpha = 1 with e = 1 - alpha gives d = (pi/4) e + (pi/8) e^2 + ' +
    '(pi/16) e^3 + ..., so the predicted leading quadratic coefficient of the (1 - alpha)^2 term is pi/8. ' +
    'Tabulating d on alpha in {0.9, 0.99, 0.999, 0.9999}, subtracting (pi/4)(1 - alpha) and dividing by ' +
    '(1 - alpha)^2 yields a measured quadratic coefficient c2 = pi/(4(2 - e)) that decreases monotonically from ' +
    '0.413367 (alpha = 0.9) to 0.392719 (alpha = 0.9999), converging to pi/8 = 0.392699 with the deviation ' +
    'c2 - pi/8 = pi e/(8(2 - e)) shrinking LINEARLY in (1 - alpha) (~10x per decade). The pi/8 prediction is ' +
    'thus confirmed, and the next cubic coefficient likewise converges to pi/16, verifying the full Taylor ' +
    'expansion. Pure phase-condition geometry on the inherited imp-33924 / imp-34045 closed form; establishes NO ' +
    'operator positivity; does NOT discharge H4 (imp-33766); G6a stays OPEN. C_mb GUE-conditional untouched; ' +
    'imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; NO QED. No refereed bound is changed' +
    '.',
};

export const IMP34103_ENDPOINT_DISTANCE_CURVATURE_ASSERTIONS = [
  {
    // the measured quadratic coefficient matches the predicted pi/8 at the finest rung.
    id: 'imp34103-quadratic-coeff-matches-pi-over-8',
    description: 'the measured (1 - alpha)^2 coefficient converges to pi/8 = 0.39269908 as alpha -> 1',
    holds: () =>
      IMP34103_ENDPOINT_DISTANCE_CURVATURE.quadraticCoeffMatchesPiOver8 === true &&
      Math.abs(IMP34103_ENDPOINT_DISTANCE_CURVATURE.measuredQuadraticCoeffAtFinestRung - Math.PI / 8) < 5e-5,
  },
  {
    // the measured quadratic coefficient approaches pi/8 monotonically from above.
    id: 'imp34103-quadratic-coeff-monotone-to-pi-over-8',
    description: 'the measured quadratic coefficient decreases monotonically toward pi/8 and stays above it',
    holds: () => IMP34103_ENDPOINT_DISTANCE_CURVATURE.quadraticCoeffApproachesPiOver8Monotonically === true,
  },
  {
    // the deviation from pi/8 shrinks linearly in (1 - alpha) (~10x per decade).
    id: 'imp34103-quadratic-convergence-linear-in-one-minus-alpha',
    description: 'the deviation c2 - pi/8 = pi e/(8(2-e)) shrinks by a factor ~10 per decade of (1 - alpha)',
    holds: () => IMP34103_ENDPOINT_DISTANCE_CURVATURE.quadraticConvergenceIsLinearInOneMinusAlpha === true,
  },
  {
    // the next cubic coefficient converges to pi/16, confirming the full expansion.
    id: 'imp34103-cubic-coeff-matches-pi-over-16',
    description: 'the measured (1 - alpha)^3 coefficient converges to pi/16 = 0.19634954, confirming the expansion',
    holds: () =>
      IMP34103_ENDPOINT_DISTANCE_CURVATURE.cubicCoeffMatchesPiOver16 === true &&
      Math.abs(IMP34103_ENDPOINT_DISTANCE_CURVATURE.measuredCubicCoeffAtFinestRung - Math.PI / 16) < 5e-5,
  },
  {
    // imp-34307 reconciliation: the endpoint CURVATURE (second derivative d''(1)) is pi/4 = 2 * (pi/8 Taylor coeff),
    // confirmed both in closed form and by a central second difference; resolves the pi/4-vs-pi/8 label discrepancy.
    id: 'imp34103-curvature-is-pi-over-4-twice-quadratic-coeff',
    description: 'the endpoint curvature d(2)(1) = pi/4 equals twice the pi/8 quadratic Taylor coefficient',
    holds: () =>
      IMP34103_ENDPOINT_DISTANCE_CURVATURE.curvatureEqualsTwiceQuadraticCoeff === true &&
      Math.abs(IMP34103_ENDPOINT_DISTANCE_CURVATURE.endpointCurvatureSecondDerivativeAtOnset - Math.PI / 4) < 1e-7 &&
      Math.abs(IMP34103_ENDPOINT_DISTANCE_CURVATURE.endpointCurvatureFiniteDifferenceCheck - Math.PI / 4) < 1e-4,
  },
  {
    // Honesty gate: measurement only, does NOT discharge H4; G6a OPEN, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp34103-honesty-gate-no-qed',
    description: 'Measurement only: does not discharge H4, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP34103_ENDPOINT_DISTANCE_CURVATURE.isRigorous === false &&
      IMP34103_ENDPOINT_DISTANCE_CURVATURE.dischargesH4 === false &&
      /NO QED/.test(IMP34103_ENDPOINT_DISTANCE_CURVATURE.verdict) &&
      /STAYS OPEN/.test(IMP34103_ENDPOINT_DISTANCE_CURVATURE.verdict) &&
      /refereed bound is changed/i.test(IMP34103_ENDPOINT_DISTANCE_CURVATURE.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(IMP34103_ENDPOINT_DISTANCE_CURVATURE.verdict),
  },
];

for (const a of IMP34103_ENDPOINT_DISTANCE_CURVATURE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34103-endpoint-distance-curvature assertion failed: ${a.id}`);
  }
}
