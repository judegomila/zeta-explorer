/**
 * @module imp-34230-third-branch-curvature
 *
 * imp-34230 (numerical, frontier-measurement): DERIVE the endpoint CURVATURE d3''(alpha) of the
 * imp-34167 family-(iii) k = +-3 outer phase-zero branch endpoint-distance law at its onset
 * alpha = 5, completing the branch-curvature ladder alongside imp-34103 (family (i), k = 1, pi/8)
 * and imp-34166 (family (ii), k = 2, pi/16).
 *
 * imp-34167 characterised the third real-NEGATIVE outer branch theta = pi/2 -+ 3pi/p
 * (arg(-A) = 3pi, p = 1 + alpha) and derived its endpoint distance law
 *
 *     d3(alpha) = pi (5 - alpha) / ( 2 (1 + alpha) ) = 3pi/p - pi/2
 *
 * OUTSIDE the interval endpoints 0 and pi, collapsing onto 0+ and pi- only at alpha = 5 (p = 6).
 * imp-34167 reported ONLY the LINEAR endpoint SLOPE dd3/dalpha|_{alpha=5} = -pi/12 but never the
 * SECOND derivative (curvature) at that endpoint. This module derives it in closed form and measures
 * the induced quadratic-approximation error, the k = 3 analog of imp-34103 (k = 1) / imp-34166 (k = 2).
 *
 * THE DERIVATION (exact, closed form)
 * -----------------------------------
 * Write d3(alpha) = (pi/2) f(alpha) with f = (5 - alpha)/(1 + alpha). Then
 *
 *     f'(alpha)  =  -6 / (1 + alpha)^2   ==>  d3'(alpha)  =  -3pi / (1 + alpha)^2
 *     f''(alpha) =  12 / (1 + alpha)^3   ==>  d3''(alpha) =   6pi / (1 + alpha)^3
 *
 * so the endpoint SLOPE is d3'(5) = -3pi/36 = -pi/12 (the imp-34167 value) and the endpoint
 * CURVATURE is d3''(5) = 6pi/216 = pi/36 ~ 0.08726646 -- this ticket. (For completeness the third
 * derivative is d3'''(alpha) = -18pi/(1 + alpha)^4, d3'''(5) = -18pi/1296 = -pi/72.) This instantiates
 * the imp-34173 unified d_k''(alpha) = 2k pi/(1 + alpha)^3 at k = 3, alpha = 5.
 *
 * THE TAYLOR EXPANSION / MEASUREMENT
 * ----------------------------------
 * Put alpha = 5 - e (so e = 5 - alpha -> 0+ as alpha -> 5 from below). Then 5 - alpha = e and
 * 1 + alpha = 6 - e, so
 *
 *     d3 = pi e / ( 2 (6 - e) ) = (pi e / 12) * 1/(1 - e/6)
 *        = (pi e / 12) ( 1 + e/6 + e^2/36 + ... )
 *        = (pi/12) e + (pi/72) e^2 + (pi/432) e^3 + ...
 *
 * The linear coefficient pi/12 is the imp-34167 slope magnitude; the quadratic coefficient of e^2 is
 * (1/2) d3''(5) = pi/72 ~ 0.04363323; the cubic coefficient is (1/6) d3'''(5) = pi/432 ~ 0.00727221.
 * On the grid alpha in {4.9, 4.99, 4.999, 4.9999} we evaluate the exact d3(alpha), subtract the
 * linear surrogate (pi/12) e, and divide by e^2 to read off the EMPIRICAL quadratic coefficient
 * c2(e) = [ d3 - (pi/12) e ] / e^2 = pi / ( 12 (6 - e) ), which decreases monotonically to pi/72 as
 * e -> 0 with the deviation c2(e) - pi/72 = pi e / ( 72 (6 - e) ) shrinking LINEARLY in e (~10x per
 * decade). Subtracting the pi/72 e^2 term as well reads the cubic coefficient
 * c3(e) = [ d3 - (pi/12) e - (pi/72) e^2 ] / e^3 = pi / ( 72 (6 - e) ) -> pi/432.
 *
 * THE QUADRATIC-APPROXIMATION ERROR
 * ---------------------------------
 * The local quadratic model Q(e) = (pi/12) e + (pi/72) e^2 (value 0, slope, half-curvature at
 * alpha = 5) has exact residual d3 - Q(e) = pi e^3 / ( 72 (6 - e) ) ~ (pi/432) e^3 -- a strictly
 * positive CUBIC error that shrinks by ~1000x per decade of e (7.40e-6 at e = 0.1, 7.28e-9 at
 * e = 0.01, 7.27e-12 at e = 0.001), confirming the pi/36 curvature governs the leading correction.
 *
 * FAMILY CONTEXT: this is the k = 3 member of the coherent outer-branch-geometry curvature family
 * whose k = 1 anchor is imp-34103 (Taylor coefficient pi/8 at onset alpha = 1, curvature pi/4) and
 * whose k = 2 member is imp-34166 (Taylor coefficient pi/32 at onset alpha = 3, curvature pi/16). The
 * general d_k''(alpha_k) = pi/(4 k^2) closed form unifying all three onsets is recorded in
 * imp-34173/imp-34240 (k = 3 gives pi/36 = 2 * pi/72, matching this module's Taylor coefficient, and
 * d_k''(alpha_k) = pi/(4*9) = pi/36 at the onset alpha = 5). With this the endpoint-curvature ladder
 * pi/4, pi/16, pi/36 (= pi/(4 k^2), k = 1,2,3) is complete across all three located branch families.
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * MEASUREMENT / DERIVATION ONLY, pure phase-condition geometry on the inherited imp-33924 / imp-34167
 * closed form for the model cusp rho(x) = |x|^{-alpha}. It establishes NO operator positivity; does
 * NOT discharge H4 (imp-33766); G6a_shock_lipschitz STAYS OPEN. C_mb GUE-conditional per imp-486
 * UNTOUCHED; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; NO QED. No refereed bound is changed.
 *
 * @see imp-34167-third-outer-branch-geometry (distance law d3(alpha), reports linear -pi/12 slope only)
 * @see imp-34166-second-positive-branch-curvature (the family-(ii) k=2 pi/16-curvature analog)
 * @see imp-34103-endpoint-distance-curvature (the family-(i) k=1 pi/8-Taylor / pi/4-curvature analog)
 * @see imp-34173-unified-branch-endpoint-law (unified d_k''(alpha) = 2k pi/(1+alpha)^3, onset pi/(4k^2))
 * @see imp-33924-joint-cusp-angle-onset-robustness-map (joint closed form A(alpha,theta), winding -(1+alpha))
 */

// exact family-(iii) real-negative third-branch endpoint distance (imp-34167 closed form).
function endpointDistance3(alpha) {
  return (Math.PI * (5 - alpha)) / (2 * (1 + alpha));
}

const PI = Math.PI;
const PREDICTED_SLOPE_MAG = PI / 12; // |d3'(5)|, imp-34167 endpoint slope magnitude.
const PREDICTED_CURVATURE = PI / 36; // d3''(5) = 6pi/(1+alpha)^3 at alpha=5, THIS ticket.
const PREDICTED_QUADRATIC = PI / 72; // coefficient of e^2 = (1/2) d3''(5).
const PREDICTED_CUBIC = PI / 432; // coefficient of e^3 = (1/6) d3'''(5).

const ALPHA_GRID = [4.9, 4.99, 4.999, 4.9999];

const ROWS = ALPHA_GRID.map((alpha) => {
  const e = 5 - alpha; // small parameter, e -> 0+ as alpha -> 5.
  const d = endpointDistance3(alpha);
  const linearTerm = PREDICTED_SLOPE_MAG * e; // (pi/12)(5 - alpha).
  const residualAfterLinear = d - linearTerm; // ~ (pi/72) e^2.
  const measuredQuadratic = residualAfterLinear / (e * e); // c2(e) -> pi/72.
  const residualAfterQuadratic = residualAfterLinear - PREDICTED_QUADRATIC * e * e; // ~ (pi/432) e^3.
  const measuredCubic = residualAfterQuadratic / (e * e * e); // c3(e) -> pi/432.
  const quadraticApproxError = residualAfterQuadratic; // d3 - Q(e), the local quadratic-model error.

  return {
    alpha,
    fiveMinusAlpha: +e.toExponential(6),
    distance: +d.toExponential(8),
    linearSurrogate: +linearTerm.toExponential(8),
    residualAfterLinear: +residualAfterLinear.toExponential(8),
    measuredQuadraticCoeff: +measuredQuadratic.toFixed(8),
    quadraticDeviationFromPiOver72: +(measuredQuadratic - PREDICTED_QUADRATIC).toExponential(6),
    measuredCubicCoeff: +measuredCubic.toFixed(8),
    quadraticApproxError: +quadraticApproxError.toExponential(6),
  };
});

// aggregate verdicts.
// the measured quadratic coefficient approaches pi/72 monotonically from above as alpha -> 5.
let QUADRATIC_MONOTONE_TO_PI72 = true;
for (let i = 1; i < ROWS.length; i++) {
  const prev = ROWS[i - 1].measuredQuadraticCoeff;
  const cur = ROWS[i].measuredQuadraticCoeff;
  if (!(cur < prev && cur > PREDICTED_QUADRATIC)) QUADRATIC_MONOTONE_TO_PI72 = false;
}

// the finest rung pins the e^2 coefficient (= half the curvature) to pi/72.
const FINEST = ROWS[ROWS.length - 1];
const QUADRATIC_MATCHES_PI72 = Math.abs(FINEST.measuredQuadraticCoeff - PREDICTED_QUADRATIC) < 5e-5;

// the deviation c2(e) - pi/72 shrinks by a factor ~10 per decade of e (linear-in-e convergence).
const devFirst = Math.abs(ROWS[0].measuredQuadraticCoeff - PREDICTED_QUADRATIC);
const devLast = Math.abs(FINEST.measuredQuadraticCoeff - PREDICTED_QUADRATIC);
const decades = ROWS.length - 1; // 4.9 -> 4.9999 is 3 decades of e.
const CONVERGENCE_RATE_LINEAR = devFirst / devLast > Math.pow(10, decades) * 0.5 &&
  devFirst / devLast < Math.pow(10, decades) * 2;

// the cubic coefficient converges to pi/432, confirming the full expansion. Read it at the e = 0.001
// rung (index 2): at the finest rung e = 1e-4 the e^3 residual ~ 7.3e-15 sits at the double-precision
// cancellation floor, so the coarser rung gives the clean cubic reading.
const CUBIC_RUNG = ROWS[ROWS.length - 2];
const CUBIC_MATCHES_PI432 = Math.abs(CUBIC_RUNG.measuredCubicCoeff - PREDICTED_CUBIC) < 5e-5;

// the local quadratic-model error is a strictly positive cubic (~1000x smaller per decade of e).
let QUAD_ERROR_CUBIC_SCALING = true;
for (let i = 1; i < ROWS.length; i++) {
  const ratio = Math.abs(ROWS[i - 1].quadraticApproxError / ROWS[i].quadraticApproxError);
  if (!(ROWS[i].quadraticApproxError > 0 && ratio > 300 && ratio < 3000)) QUAD_ERROR_CUBIC_SCALING = false;
}

export const IMP34230_THIRD_BRANCH_CURVATURE = {
  id: 'imp-34230',
  proofSection: 'S-frontier',
  category: 'numerical',
  question:
    'Beyond the imp-34167 linear -pi/12 endpoint slope, what is the endpoint CURVATURE d3\'\'(alpha) of the ' +
    'family-(iii) real-negative third phase-zero branch distance d3(alpha) = pi(5 - alpha)/(2(1 + alpha)) at ' +
    'alpha = 5? Derive d3\'\'(alpha) = 6pi/(1 + alpha)^3 in closed form, evaluate it at alpha = 5, and measure ' +
    'the local quadratic-approximation error against the exact rational distance law near alpha = 5.',
  distanceLaw: 'd3(alpha) = pi(5 - alpha)/(2(1 + alpha)) = 3pi/p - pi/2, p = 1 + alpha (imp-34167 closed form)',
  slopeClosedForm: 'd3\'(alpha) = -3pi/(1 + alpha)^2 ; d3\'(5) = -pi/12 (imp-34167 slope)',
  curvatureClosedForm: 'd3\'\'(alpha) = 6pi/(1 + alpha)^3 ; d3\'\'(5) = 6pi/216 = pi/36 (this ticket)',
  taylorExpansion:
    'with alpha = 5 - e: d3 = (pi/12) e + (pi/72) e^2 + (pi/432) e^3 + ... ; linear pi/12, quadratic pi/72, cubic pi/432',
  predictedSlopeMagnitude: +PREDICTED_SLOPE_MAG.toFixed(8), // 0.26179939
  predictedCurvatureAtAlpha5: +PREDICTED_CURVATURE.toFixed(8), // 0.08726646
  predictedQuadraticCoeff: +PREDICTED_QUADRATIC.toFixed(8), // 0.04363323
  predictedCubicCoeff: +PREDICTED_CUBIC.toFixed(8), // 0.00727221

  // per-alpha measurement table.
  rows: ROWS,

  // aggregate findings.
  measuredQuadraticCoeffAtFinestRung: FINEST.measuredQuadraticCoeff, // -> pi/72
  quadraticCoeffApproachesPiOver72Monotonically: QUADRATIC_MONOTONE_TO_PI72,
  quadraticCoeffMatchesPiOver72: QUADRATIC_MATCHES_PI72,
  measuredCurvatureAtFinestRung: +(2 * FINEST.measuredQuadraticCoeff).toFixed(8), // 2*c2 -> d3''(5) = pi/36
  quadraticConvergenceIsLinearInFiveMinusAlpha: CONVERGENCE_RATE_LINEAR,
  measuredCubicCoeffAtCleanRung: CUBIC_RUNG.measuredCubicCoeff, // -> pi/432
  cubicCoeffMatchesPiOver432: CUBIC_MATCHES_PI432,
  quadraticApproxErrorIsPositiveCubic: QUAD_ERROR_CUBIC_SCALING,

  finding:
    'CONFIRMED. Differentiating the imp-34167 distance law d3(alpha) = pi(5 - alpha)/(2(1 + alpha)) twice gives ' +
    'the closed-form endpoint curvature d3\'\'(alpha) = 6pi/(1 + alpha)^3, so d3\'\'(5) = 6pi/216 = pi/36 = ' +
    '0.08726646 -- the family-(iii) k = 3 analog completing the imp-34103/imp-34166 ladder. Expanding about ' +
    'alpha = 5 with e = 5 - alpha gives d3 = (pi/12) e + (pi/72) e^2 + (pi/432) e^3 + ...; subtracting the linear ' +
    '(pi/12) e term and dividing by e^2 yields a measured e^2 coefficient c2 = pi/(12(6 - e)) decreasing ' +
    'monotonically toward pi/72 = 0.04363323 (0.044373 at alpha = 4.9, 0.043634 at alpha = 4.9999, deviation ' +
    '~7.3e-7), so 2*c2 -> pi/36 recovers the curvature. The local quadratic model Q(e) = (pi/12) e + (pi/72) e^2 ' +
    'has a strictly positive cubic error pi e^3/(72(6 - e)) ~ (pi/432) e^3 shrinking ~1000x per decade (7.40e-6, ' +
    '7.28e-9, 7.27e-12), and the measured cubic coefficient converges to pi/432, confirming the full expansion.',

  dischargesH4: false,
  isRigorous: false,
  verdict:
    'MEASUREMENT / DERIVATION ONLY, G6a_shock_lipschitz STAYS OPEN. The endpoint CURVATURE of the imp-34167 ' +
    'family-(iii) real-negative third phase-zero branch distance d3(alpha) = pi(5 - alpha)/(2(1 + alpha)) is ' +
    'derived and measured beyond the reported linear -pi/12 slope. Twice-differentiating gives the closed form ' +
    'd3\'\'(alpha) = 6pi/(1 + alpha)^3, hence d3\'\'(5) = 6pi/216 = pi/36 = 0.08726646. Expanding about alpha = 5 ' +
    'with e = 5 - alpha gives d3 = (pi/12) e + (pi/72) e^2 + (pi/432) e^3 + ..., so the e^2 coefficient is ' +
    '(1/2) d3\'\'(5) = pi/72. Tabulating d3 on alpha in {4.9, 4.99, 4.999, 4.9999}, subtracting (pi/12)(5 - alpha) ' +
    'and dividing by (5 - alpha)^2 yields a measured coefficient c2 = pi/(12(6 - e)) decreasing monotonically from ' +
    '0.044373 (alpha = 4.9) to 0.043634 (alpha = 4.9999), converging to pi/72 = 0.043633 with the deviation ' +
    'c2 - pi/72 = pi e/(72(6 - e)) shrinking LINEARLY in (5 - alpha) (~10x per decade); 2*c2 recovers the pi/36 ' +
    'curvature. The local quadratic model has a strictly positive cubic error pi e^3/(72(6 - e)) shrinking ~1000x ' +
    'per decade, and the measured cubic coefficient converges to pi/432, verifying the full Taylor expansion. This ' +
    'completes the endpoint-curvature ladder pi/4 (imp-34103, k=1), pi/16 (imp-34166, k=2), pi/36 (k=3) = pi/(4k^2). ' +
    'Pure phase-condition geometry on the inherited imp-33924 / imp-34167 closed form; establishes NO operator ' +
    'positivity; does NOT discharge H4 (imp-33766); G6a stays OPEN. C_mb GUE-conditional per imp-486 UNTOUCHED; ' +
    'imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; NO QED. No refereed bound is changed' +
    '.',
};

export const IMP34230_THIRD_BRANCH_CURVATURE_ASSERTIONS = [
  {
    // the closed-form curvature d3''(5) = 6pi/216 = pi/36 matches the value recovered from 2*c2 at the finest rung.
    id: 'imp34230-curvature-matches-pi-over-36',
    description: 'the endpoint curvature d3\'\'(5) = 6pi/(1+alpha)^3 |_{alpha=5} = pi/36 = 0.08726646, recovered as 2*c2',
    holds: () =>
      Math.abs(IMP34230_THIRD_BRANCH_CURVATURE.predictedCurvatureAtAlpha5 - Math.PI / 36) < 1e-7 &&
      Math.abs(IMP34230_THIRD_BRANCH_CURVATURE.measuredCurvatureAtFinestRung - Math.PI / 36) < 1e-4,
  },
  {
    // the measured e^2 coefficient matches the predicted pi/72 (half the curvature) at the finest rung.
    id: 'imp34230-quadratic-coeff-matches-pi-over-72',
    description: 'the measured (5 - alpha)^2 coefficient converges to pi/72 = 0.04363323 as alpha -> 5',
    holds: () =>
      IMP34230_THIRD_BRANCH_CURVATURE.quadraticCoeffMatchesPiOver72 === true &&
      Math.abs(IMP34230_THIRD_BRANCH_CURVATURE.measuredQuadraticCoeffAtFinestRung - Math.PI / 72) < 5e-5,
  },
  {
    // the measured quadratic coefficient approaches pi/72 monotonically from above.
    id: 'imp34230-quadratic-coeff-monotone-to-pi-over-72',
    description: 'the measured quadratic coefficient decreases monotonically toward pi/72 and stays above it',
    holds: () => IMP34230_THIRD_BRANCH_CURVATURE.quadraticCoeffApproachesPiOver72Monotonically === true,
  },
  {
    // the deviation from pi/72 shrinks linearly in (5 - alpha) (~10x per decade).
    id: 'imp34230-quadratic-convergence-linear-in-five-minus-alpha',
    description: 'the deviation c2 - pi/72 = pi e/(72(6-e)) shrinks by a factor ~10 per decade of (5 - alpha)',
    holds: () => IMP34230_THIRD_BRANCH_CURVATURE.quadraticConvergenceIsLinearInFiveMinusAlpha === true,
  },
  {
    // the local quadratic-model error is a strictly positive cubic (~1000x smaller per decade of e).
    id: 'imp34230-quadratic-approx-error-positive-cubic',
    description: 'the quadratic-model error d3 - Q(e) = pi e^3/(72(6-e)) is positive and shrinks ~1000x per decade',
    holds: () => IMP34230_THIRD_BRANCH_CURVATURE.quadraticApproxErrorIsPositiveCubic === true,
  },
  {
    // the cubic coefficient converges to pi/432, confirming the full expansion.
    id: 'imp34230-cubic-coeff-matches-pi-over-432',
    description: 'the measured (5 - alpha)^3 coefficient converges to pi/432 = 0.00727221, confirming the expansion',
    holds: () =>
      IMP34230_THIRD_BRANCH_CURVATURE.cubicCoeffMatchesPiOver432 === true &&
      Math.abs(IMP34230_THIRD_BRANCH_CURVATURE.measuredCubicCoeffAtCleanRung - Math.PI / 432) < 5e-5,
  },
  {
    // Honesty gate: measurement/derivation only, does NOT discharge H4; G6a OPEN, no QED, no refereed bound is changed, parents untouched.
    id: 'imp34230-honesty-gate-no-qed',
    description: 'Measurement only: does not discharge H4, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066/imp-486 untouched',
    holds: () =>
      IMP34230_THIRD_BRANCH_CURVATURE.isRigorous === false &&
      IMP34230_THIRD_BRANCH_CURVATURE.dischargesH4 === false &&
      /NO QED/.test(IMP34230_THIRD_BRANCH_CURVATURE.verdict) &&
      /STAYS OPEN/.test(IMP34230_THIRD_BRANCH_CURVATURE.verdict) &&
      /refereed bound is changed/i.test(IMP34230_THIRD_BRANCH_CURVATURE.verdict) &&
      /C_mb GUE-conditional per imp-486 UNTOUCHED/.test(IMP34230_THIRD_BRANCH_CURVATURE.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(IMP34230_THIRD_BRANCH_CURVATURE.verdict),
  },
];

for (const a of IMP34230_THIRD_BRANCH_CURVATURE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34230-third-branch-curvature assertion failed: ${a.id}`);
  }
}
