/**
 * @module imp-34166-second-positive-branch-curvature
 *
 * imp-34166 (numerical, frontier-measurement): MEASURE the endpoint CURVATURE of the imp-34104
 * family-(ii) real-POSITIVE second phase-zero branch endpoint-distance law at alpha = 3 -- the
 * imp-34103 pi/8-curvature analog, here for the real-positive branch.
 *
 * imp-34104 characterised the second real-POSITIVE branch theta = pi/2 -+ 2pi/p (arg(-A) = 2pi,
 * p = 1 + alpha) and derived its endpoint distance law
 *
 *     d2(alpha) = pi (3 - alpha) / ( 2 (1 + alpha) ) = 2pi/p - pi/2
 *
 * OUTSIDE the interval endpoints 0 and pi, collapsing onto 0+ and pi- only at alpha = 3 (p = 4).
 * imp-34104 reported ONLY the LINEAR endpoint SLOPE dd2/dalpha|_{alpha=3} = -pi/8 but never the
 * SECOND derivative (curvature) at that endpoint. This module derives it and measures the induced
 * quadratic-approximation error.
 *
 * THE DERIVATION (exact, closed form)
 * -----------------------------------
 * Write d2(alpha) = (pi/2) f(alpha) with f = (3 - alpha)/(1 + alpha). Then
 *
 *     f'(alpha)  = -4 / (1 + alpha)^2   ==>  d2'(alpha)  = -2pi / (1 + alpha)^2
 *     f''(alpha) =  8 / (1 + alpha)^3   ==>  d2''(alpha) =  4pi / (1 + alpha)^3
 *
 * so the endpoint SLOPE is d2'(3) = -2pi/16 = -pi/8 (the imp-34104 value) and the endpoint
 * CURVATURE is d2''(3) = 4pi/64 = pi/16 ~ 0.19634954 -- this ticket. (For completeness the third
 * derivative is d2'''(alpha) = -12pi/(1 + alpha)^4, d2'''(3) = -3pi/64.)
 *
 * THE TAYLOR EXPANSION / MEASUREMENT
 * ----------------------------------
 * Put alpha = 3 - e (so e = 3 - alpha -> 0+ as alpha -> 3 from below). Then 3 - alpha = e and
 * 1 + alpha = 4 - e, so
 *
 *     d2 = pi e / ( 2 (4 - e) ) = (pi e / 8) * 1/(1 - e/4)
 *        = (pi e / 8) ( 1 + e/4 + e^2/16 + ... )
 *        = (pi/8) e + (pi/32) e^2 + (pi/128) e^3 + ...
 *
 * The linear coefficient pi/8 is the imp-34104 slope magnitude; the quadratic coefficient of e^2 is
 * (1/2) d2''(3) = pi/32 ~ 0.09817477; the cubic coefficient is (1/6) d2'''(3) = pi/128 ~ 0.02454369.
 * On the grid alpha in {2.9, 2.99, 2.999, 2.9999} we evaluate the exact d2(alpha), subtract the
 * linear surrogate (pi/8) e, and divide by e^2 to read off the EMPIRICAL quadratic coefficient
 * c2(e) = [ d2 - (pi/8) e ] / e^2 = pi / ( 8 (4 - e) ), which decreases monotonically to pi/32 as
 * e -> 0 with the deviation c2(e) - pi/32 = pi e / ( 32 (4 - e) ) shrinking LINEARLY in e (~10x per
 * decade). Subtracting the pi/32 e^2 term as well reads the cubic coefficient
 * c3(e) = [ d2 - (pi/8) e - (pi/32) e^2 ] / e^3 = pi / ( 32 (4 - e) ) -> pi/128.
 *
 * THE QUADRATIC-APPROXIMATION ERROR
 * ---------------------------------
 * The local quadratic model Q(e) = (pi/8) e + (pi/32) e^2 (value 0, slope, half-curvature at
 * alpha = 3) has exact residual d2 - Q(e) = pi e^3 / ( 32 (4 - e) ) ~ (pi/128) e^3 -- a strictly
 * positive CUBIC error that shrinks by ~1000x per decade of e (2.52e-5 at e = 0.1, 2.46e-8 at
 * e = 0.01, 2.46e-11 at e = 0.001), confirming the pi/16 curvature governs the leading correction.
 *
 * FAMILY CONTEXT: this is the k = 2 member of the coherent outer-branch-geometry curvature family
 * whose k = 1 anchor is imp-34103 (Taylor coefficient pi/8 at onset alpha = 1) and whose k = 3 member
 * is imp-34167 (onset alpha = 5, distance law/slope derived, curvature not yet measured there). The
 * general d_k''(alpha_k) = pi/(4 k^2) closed form unifying all three onsets is recorded in
 * imp-34173/imp-34240 (k=2 gives pi/16 = 2 * pi/32, matching this module's Taylor coefficient).
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * MEASUREMENT / DERIVATION ONLY, pure phase-condition geometry on the inherited imp-33924 / imp-34104
 * closed form for the model cusp rho(x) = |x|^{-alpha}. It establishes NO operator positivity; does
 * NOT discharge H4 (imp-33766); G6a_shock_lipschitz STAYS OPEN. C_mb GUE-conditional per imp-486
 * UNTOUCHED; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; NO QED. No refereed bound is changed.
 *
 * @see imp-34104-second-positive-branch-geometry (distance law d2(alpha), reports linear -pi/8 slope only)
 * @see imp-34103-endpoint-distance-curvature (the family-(i) real-negative branch pi/8-curvature analog)
 * @see imp-33924-joint-cusp-angle-onset-robustness-map (joint closed form A(alpha,theta), winding -(1+alpha))
 * @see imp-34167-third-outer-branch-geometry (family (iii) k=3 member of the same onset-alpha=2k-1 ladder)
 */

// exact family-(ii) real-positive second-branch endpoint distance (imp-34104 closed form).
function endpointDistance2(alpha) {
  return (Math.PI * (3 - alpha)) / (2 * (1 + alpha));
}

const PI = Math.PI;
const PREDICTED_SLOPE_MAG = PI / 8; // |d2'(3)|, imp-34104 endpoint slope magnitude.
const PREDICTED_CURVATURE = PI / 16; // d2''(3) = 4pi/(1+alpha)^3 at alpha=3, THIS ticket.
const PREDICTED_QUADRATIC = PI / 32; // coefficient of e^2 = (1/2) d2''(3).
const PREDICTED_CUBIC = PI / 128; // coefficient of e^3 = (1/6) d2'''(3).

const ALPHA_GRID = [2.9, 2.99, 2.999, 2.9999];

const ROWS = ALPHA_GRID.map((alpha) => {
  const e = 3 - alpha; // small parameter, e -> 0+ as alpha -> 3.
  const d = endpointDistance2(alpha);
  const linearTerm = PREDICTED_SLOPE_MAG * e; // (pi/8)(3 - alpha).
  const residualAfterLinear = d - linearTerm; // ~ (pi/32) e^2.
  const measuredQuadratic = residualAfterLinear / (e * e); // c2(e) -> pi/32.
  const residualAfterQuadratic = residualAfterLinear - PREDICTED_QUADRATIC * e * e; // ~ (pi/128) e^3.
  const measuredCubic = residualAfterQuadratic / (e * e * e); // c3(e) -> pi/128.
  const quadraticApproxError = residualAfterQuadratic; // d2 - Q(e), the local quadratic-model error.

  return {
    alpha,
    threeMinusAlpha: +e.toExponential(6),
    distance: +d.toExponential(8),
    linearSurrogate: +linearTerm.toExponential(8),
    residualAfterLinear: +residualAfterLinear.toExponential(8),
    measuredQuadraticCoeff: +measuredQuadratic.toFixed(8),
    quadraticDeviationFromPiOver32: +(measuredQuadratic - PREDICTED_QUADRATIC).toExponential(6),
    measuredCubicCoeff: +measuredCubic.toFixed(8),
    quadraticApproxError: +quadraticApproxError.toExponential(6),
  };
});

// aggregate verdicts.
// the measured quadratic coefficient approaches pi/32 monotonically from above as alpha -> 3.
let QUADRATIC_MONOTONE_TO_PI32 = true;
for (let i = 1; i < ROWS.length; i++) {
  const prev = ROWS[i - 1].measuredQuadraticCoeff;
  const cur = ROWS[i].measuredQuadraticCoeff;
  if (!(cur < prev && cur > PREDICTED_QUADRATIC)) QUADRATIC_MONOTONE_TO_PI32 = false;
}

// the finest rung pins the e^2 coefficient (= half the curvature) to pi/32.
const FINEST = ROWS[ROWS.length - 1];
const QUADRATIC_MATCHES_PI32 = Math.abs(FINEST.measuredQuadraticCoeff - PREDICTED_QUADRATIC) < 5e-5;

// the deviation c2(e) - pi/32 shrinks by a factor ~10 per decade of e (linear-in-e convergence).
const devFirst = Math.abs(ROWS[0].measuredQuadraticCoeff - PREDICTED_QUADRATIC);
const devLast = Math.abs(FINEST.measuredQuadraticCoeff - PREDICTED_QUADRATIC);
const decades = ROWS.length - 1; // 2.9 -> 2.9999 is 3 decades of e.
const CONVERGENCE_RATE_LINEAR = devFirst / devLast > Math.pow(10, decades) * 0.5 &&
  devFirst / devLast < Math.pow(10, decades) * 2;

// the cubic coefficient converges to pi/128, confirming the full expansion. Read it at the e = 0.001
// rung (index 2): at the finest rung e = 1e-4 the e^3 residual ~ 2.5e-14 sits at the double-precision
// cancellation floor, so the coarser rung gives the clean cubic reading.
const CUBIC_RUNG = ROWS[ROWS.length - 2];
const CUBIC_MATCHES_PI128 = Math.abs(CUBIC_RUNG.measuredCubicCoeff - PREDICTED_CUBIC) < 5e-5;

// the local quadratic-model error is a strictly positive cubic (~1000x smaller per decade of e).
let QUAD_ERROR_CUBIC_SCALING = true;
for (let i = 1; i < ROWS.length; i++) {
  const ratio = Math.abs(ROWS[i - 1].quadraticApproxError / ROWS[i].quadraticApproxError);
  if (!(ROWS[i].quadraticApproxError > 0 && ratio > 300 && ratio < 3000)) QUAD_ERROR_CUBIC_SCALING = false;
}

export const IMP34166_SECOND_POSITIVE_BRANCH_CURVATURE = {
  id: 'imp-34166',
  proofSection: 'S-frontier',
  category: 'numerical',
  question:
    'Beyond the imp-34104 linear -pi/8 endpoint slope, what is the endpoint CURVATURE d2\'\'(alpha) of the ' +
    'family-(ii) real-positive second phase-zero branch distance d2(alpha) = pi(3 - alpha)/(2(1 + alpha)) at ' +
    'alpha = 3? Derive d2\'\'(alpha) = 4pi/(1 + alpha)^3 in closed form, evaluate it at alpha = 3, and measure ' +
    'the local quadratic-approximation error against the exact rational distance law near alpha = 3.',
  distanceLaw: 'd2(alpha) = pi(3 - alpha)/(2(1 + alpha)) = 2pi/p - pi/2, p = 1 + alpha (imp-34104 closed form)',
  slopeClosedForm: 'd2\'(alpha) = -2pi/(1 + alpha)^2 ; d2\'(3) = -pi/8 (imp-34104 slope)',
  curvatureClosedForm: 'd2\'\'(alpha) = 4pi/(1 + alpha)^3 ; d2\'\'(3) = 4pi/64 = pi/16 (this ticket)',
  taylorExpansion:
    'with alpha = 3 - e: d2 = (pi/8) e + (pi/32) e^2 + (pi/128) e^3 + ... ; linear pi/8, quadratic pi/32, cubic pi/128',
  predictedSlopeMagnitude: +PREDICTED_SLOPE_MAG.toFixed(8), // 0.39269908
  predictedCurvatureAtAlpha3: +PREDICTED_CURVATURE.toFixed(8), // 0.19634954
  predictedQuadraticCoeff: +PREDICTED_QUADRATIC.toFixed(8), // 0.09817477
  predictedCubicCoeff: +PREDICTED_CUBIC.toFixed(8), // 0.02454369

  // per-alpha measurement table.
  rows: ROWS,

  // aggregate findings.
  measuredQuadraticCoeffAtFinestRung: FINEST.measuredQuadraticCoeff, // -> pi/32
  quadraticCoeffApproachesPiOver32Monotonically: QUADRATIC_MONOTONE_TO_PI32,
  quadraticCoeffMatchesPiOver32: QUADRATIC_MATCHES_PI32,
  measuredCurvatureAtFinestRung: +(2 * FINEST.measuredQuadraticCoeff).toFixed(8), // 2*c2 -> d2''(3) = pi/16
  quadraticConvergenceIsLinearInThreeMinusAlpha: CONVERGENCE_RATE_LINEAR,
  measuredCubicCoeffAtCleanRung: CUBIC_RUNG.measuredCubicCoeff, // -> pi/128
  cubicCoeffMatchesPiOver128: CUBIC_MATCHES_PI128,
  quadraticApproxErrorIsPositiveCubic: QUAD_ERROR_CUBIC_SCALING,

  finding:
    'CONFIRMED. Differentiating the imp-34104 distance law d2(alpha) = pi(3 - alpha)/(2(1 + alpha)) twice gives ' +
    'the closed-form endpoint curvature d2\'\'(alpha) = 4pi/(1 + alpha)^3, so d2\'\'(3) = 4pi/64 = pi/16 = ' +
    '0.19634954 -- the family-(ii) analog of the imp-34103 curvature. Expanding about alpha = 3 with e = 3 - alpha ' +
    'gives d2 = (pi/8) e + (pi/32) e^2 + (pi/128) e^3 + ...; subtracting the linear (pi/8) e term and dividing by ' +
    'e^2 yields a measured e^2 coefficient c2 = pi/(8(4 - e)) decreasing monotonically toward pi/32 = 0.09817477 ' +
    '(0.10069 at alpha = 2.9, 0.098177 at alpha = 2.9999, deviation ~2.5e-6), so 2*c2 -> pi/16 recovers the ' +
    'curvature. The local quadratic model Q(e) = (pi/8) e + (pi/32) e^2 has a strictly positive cubic error ' +
    'pi e^3/(32(4 - e)) ~ (pi/128) e^3 shrinking ~1000x per decade (2.52e-5, 2.46e-8, 2.46e-11), and the measured ' +
    'cubic coefficient converges to pi/128, confirming the full expansion.',

  dischargesH4: false,
  isRigorous: false,
  verdict:
    'MEASUREMENT / DERIVATION ONLY, G6a_shock_lipschitz STAYS OPEN. The endpoint CURVATURE of the imp-34104 ' +
    'family-(ii) real-positive second phase-zero branch distance d2(alpha) = pi(3 - alpha)/(2(1 + alpha)) is ' +
    'derived and measured beyond the reported linear -pi/8 slope. Twice-differentiating gives the closed form ' +
    'd2\'\'(alpha) = 4pi/(1 + alpha)^3, hence d2\'\'(3) = 4pi/64 = pi/16 = 0.19634954. Expanding about alpha = 3 ' +
    'with e = 3 - alpha gives d2 = (pi/8) e + (pi/32) e^2 + (pi/128) e^3 + ..., so the e^2 coefficient is ' +
    '(1/2) d2\'\'(3) = pi/32. Tabulating d2 on alpha in {2.9, 2.99, 2.999, 2.9999}, subtracting (pi/8)(3 - alpha) ' +
    'and dividing by (3 - alpha)^2 yields a measured coefficient c2 = pi/(8(4 - e)) decreasing monotonically from ' +
    '0.100692 (alpha = 2.9) to 0.098177 (alpha = 2.9999), converging to pi/32 = 0.098175 with the deviation ' +
    'c2 - pi/32 = pi e/(32(4 - e)) shrinking LINEARLY in (3 - alpha) (~10x per decade); 2*c2 recovers the pi/16 ' +
    'curvature. The local quadratic model has a strictly positive cubic error pi e^3/(32(4 - e)) shrinking ~1000x ' +
    'per decade, and the measured cubic coefficient converges to pi/128, verifying the full Taylor expansion. ' +
    'Pure phase-condition geometry on the inherited imp-33924 / imp-34104 closed form; establishes NO operator ' +
    'positivity; does NOT discharge H4 (imp-33766); G6a stays OPEN. C_mb GUE-conditional per imp-486 UNTOUCHED; ' +
    'imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; NO QED. No refereed bound is changed' +
    '.',
};

export const IMP34166_SECOND_POSITIVE_BRANCH_CURVATURE_ASSERTIONS = [
  {
    // the closed-form curvature d2''(3) = 4pi/64 = pi/16 matches the value recovered from 2*c2 at the finest rung.
    id: 'imp34166-curvature-matches-pi-over-16',
    description: 'the endpoint curvature d2\'\'(3) = 4pi/(1+alpha)^3 |_{alpha=3} = pi/16 = 0.19634954, recovered as 2*c2',
    holds: () =>
      Math.abs(IMP34166_SECOND_POSITIVE_BRANCH_CURVATURE.predictedCurvatureAtAlpha3 - Math.PI / 16) < 1e-7 &&
      Math.abs(IMP34166_SECOND_POSITIVE_BRANCH_CURVATURE.measuredCurvatureAtFinestRung - Math.PI / 16) < 1e-4,
  },
  {
    // the measured e^2 coefficient matches the predicted pi/32 (half the curvature) at the finest rung.
    id: 'imp34166-quadratic-coeff-matches-pi-over-32',
    description: 'the measured (3 - alpha)^2 coefficient converges to pi/32 = 0.09817477 as alpha -> 3',
    holds: () =>
      IMP34166_SECOND_POSITIVE_BRANCH_CURVATURE.quadraticCoeffMatchesPiOver32 === true &&
      Math.abs(IMP34166_SECOND_POSITIVE_BRANCH_CURVATURE.measuredQuadraticCoeffAtFinestRung - Math.PI / 32) < 5e-5,
  },
  {
    // the measured quadratic coefficient approaches pi/32 monotonically from above.
    id: 'imp34166-quadratic-coeff-monotone-to-pi-over-32',
    description: 'the measured quadratic coefficient decreases monotonically toward pi/32 and stays above it',
    holds: () => IMP34166_SECOND_POSITIVE_BRANCH_CURVATURE.quadraticCoeffApproachesPiOver32Monotonically === true,
  },
  {
    // the deviation from pi/32 shrinks linearly in (3 - alpha) (~10x per decade).
    id: 'imp34166-quadratic-convergence-linear-in-three-minus-alpha',
    description: 'the deviation c2 - pi/32 = pi e/(32(4-e)) shrinks by a factor ~10 per decade of (3 - alpha)',
    holds: () => IMP34166_SECOND_POSITIVE_BRANCH_CURVATURE.quadraticConvergenceIsLinearInThreeMinusAlpha === true,
  },
  {
    // the local quadratic-model error is a strictly positive cubic (~1000x smaller per decade of e).
    id: 'imp34166-quadratic-approx-error-positive-cubic',
    description: 'the quadratic-model error d2 - Q(e) = pi e^3/(32(4-e)) is positive and shrinks ~1000x per decade',
    holds: () => IMP34166_SECOND_POSITIVE_BRANCH_CURVATURE.quadraticApproxErrorIsPositiveCubic === true,
  },
  {
    // the cubic coefficient converges to pi/128, confirming the full expansion.
    id: 'imp34166-cubic-coeff-matches-pi-over-128',
    description: 'the measured (3 - alpha)^3 coefficient converges to pi/128 = 0.02454369, confirming the expansion',
    holds: () =>
      IMP34166_SECOND_POSITIVE_BRANCH_CURVATURE.cubicCoeffMatchesPiOver128 === true &&
      Math.abs(IMP34166_SECOND_POSITIVE_BRANCH_CURVATURE.measuredCubicCoeffAtCleanRung - Math.PI / 128) < 5e-5,
  },
  {
    // Honesty gate: measurement/derivation only, does NOT discharge H4; G6a OPEN, no QED, no refereed bound is changed, parents untouched.
    id: 'imp34166-honesty-gate-no-qed',
    description: 'Measurement only: does not discharge H4, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066/imp-486 untouched',
    holds: () =>
      IMP34166_SECOND_POSITIVE_BRANCH_CURVATURE.isRigorous === false &&
      IMP34166_SECOND_POSITIVE_BRANCH_CURVATURE.dischargesH4 === false &&
      /NO QED/.test(IMP34166_SECOND_POSITIVE_BRANCH_CURVATURE.verdict) &&
      /STAYS OPEN/.test(IMP34166_SECOND_POSITIVE_BRANCH_CURVATURE.verdict) &&
      /refereed bound is changed/i.test(IMP34166_SECOND_POSITIVE_BRANCH_CURVATURE.verdict) &&
      /C_mb GUE-conditional per imp-486 UNTOUCHED/.test(IMP34166_SECOND_POSITIVE_BRANCH_CURVATURE.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(IMP34166_SECOND_POSITIVE_BRANCH_CURVATURE.verdict),
  },
];

for (const a of IMP34166_SECOND_POSITIVE_BRANCH_CURVATURE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34166-second-positive-branch-curvature assertion failed: ${a.id}`);
  }
}
