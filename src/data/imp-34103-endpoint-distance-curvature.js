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
 * WHAT THIS DOES NOT DO
 * ---------------------
 * MEASUREMENT ONLY, pure phase-condition geometry on the inherited imp-33924 / imp-34045 closed form for
 * the model cusp rho(x) = |x|^{-alpha}. It establishes NO operator positivity; does NOT discharge H4
 * (imp-33766); G6a_shock_lipschitz STAYS OPEN. C_mb GUE-conditional untouched; imp-3066 off-diagonal
 * endpoint-Hankel K_a >= 0 UNTOUCHED; NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 *
 * @see imp-34045-phase-zero-endpoint-degeneracy (outer branch distance law d(alpha), reports linear pi/4 slope only)
 * @see imp-33970-joint-phase-zero-uniqueness (theta = pi/2 unique on (0,pi) for every alpha in (0,1))
 * @see imp-33924-joint-cusp-angle-onset-robustness-map (joint closed form A(alpha,theta), winding -(1+alpha))
 */

// exact outer real-negative branch endpoint distance (imp-34045 closed form).
function endpointDistance(alpha) {
  return (Math.PI * (1 - alpha)) / (2 * (1 + alpha));
}

const PI = Math.PI;
const PREDICTED_LINEAR = PI / 4; // imp-34045 endpoint slope magnitude.
const PREDICTED_QUADRATIC = PI / 8; // leading (1 - alpha)^2 coefficient, this ticket.
const PREDICTED_CUBIC = PI / 16; // next term, bonus confirmation.

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
    'imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; NO QED. Platt-Trudgian Lambda <= 0.2 remains the ' +
    'rigorous SOTA.',
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
    // Honesty gate: measurement only, does NOT discharge H4; G6a OPEN, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp34103-honesty-gate-no-qed',
    description: 'Measurement only: does not discharge H4, G6a stays OPEN, no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP34103_ENDPOINT_DISTANCE_CURVATURE.isRigorous === false &&
      IMP34103_ENDPOINT_DISTANCE_CURVATURE.dischargesH4 === false &&
      /NO QED/.test(IMP34103_ENDPOINT_DISTANCE_CURVATURE.verdict) &&
      /STAYS OPEN/.test(IMP34103_ENDPOINT_DISTANCE_CURVATURE.verdict) &&
      /remains the rigorous SOTA/.test(IMP34103_ENDPOINT_DISTANCE_CURVATURE.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(IMP34103_ENDPOINT_DISTANCE_CURVATURE.verdict),
  },
];

for (const a of IMP34103_ENDPOINT_DISTANCE_CURVATURE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34103-endpoint-distance-curvature assertion failed: ${a.id}`);
  }
}
