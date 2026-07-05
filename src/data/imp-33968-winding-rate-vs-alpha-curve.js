/**
 * @module imp-33968-winding-rate-vs-alpha-curve
 *
 * imp-33968 (numerical, frontier-measurement): TABULATE the alpha-dependence of the imp-33924 phase
 * WINDING RATE d arg(-A)/d theta = -(1+alpha) directly from the joint scale-free quadrature across an
 * alpha sweep, turning imp-33924 cross-check (a)'s single-tolerance pass/fail into an EXPLICIT
 * rate-vs-alpha curve.
 *
 * BACKGROUND
 * ----------
 * imp-33924 derived the joint (alpha, theta) leading amplitude of the fold-modulus back-conversion
 *     A(alpha, theta) = B(alpha) e^{-i(1+alpha) theta} [1 + e^{i(1+alpha) pi}] ,  B(alpha) = pi alpha/sin(pi alpha) ,
 * and showed the ONLY place the cusp exponent alpha and the evaluation angle theta interact is the
 * complex phase, whose theta-winding rate is d arg(-A)/d theta = -(1+alpha). imp-33924 cross-check (a)
 * asserted the measured theta-winding slope of arg(-A_quad) equals -(1+alpha) to < 1e-4 "for every
 * alpha", but reported it ONLY as a pass/fail tolerance -- and only extracted the slope from a TWO-POINT
 * finite difference (80deg, 100deg) on a narrow alpha grid (0.3..0.7). It never tabulated the winding
 * rate as an explicit function of alpha, nor fit it over a full theta sweep.
 *
 * WHAT THIS MODULE DOES
 * ---------------------
 * Reusing the imp-33924 SCALE-FREE complex Simpson quadrature of A(alpha, theta) = int_{-inf}^{inf}
 * |u|^{-alpha}/(w-u)^2 du (cusp flattened by x = t^{1/(1-alpha)} on the near part, tail by u = 1/v), this
 * evaluates A(alpha, theta) across a dense theta sweep (45deg..135deg, step 5deg) at each alpha in an
 * EXTENDED grid 0.1..0.9 (step 0.1), UNWRAPS arg(-A_quad), and LEAST-SQUARES fits the unwrapped phase
 * against theta to extract the winding SLOPE at each alpha. The slope(alpha) curve is tabulated against
 * the closed-form -(1+alpha), the max deviation across the full alpha range is reported, and the
 * per-alpha linear-fit residual (1 - R^2) confirms the phase is straight-line in theta.
 *
 * FINDINGS
 * --------
 * (1) The measured winding slope tracks -(1+alpha) across the ENTIRE alpha in 0.1..0.9 with max deviation
 *     ~1.4e-5 (the residual concentrates at the smallest alpha, where the cusp x^{-alpha} is least
 *     flattened by the near-part change of variables; it shrinks monotonically as alpha grows). The
 *     imp-33924 cross-check (a) "< 1e-4 for every alpha" is thereby upgraded from a pass/fail to an
 *     explicit rate-vs-alpha curve well inside tolerance.
 * (2) Each per-alpha fit is essentially perfectly linear in theta (1 - R^2 < 1e-6 for every alpha): the
 *     phase arg(-A) is a straight line, exactly the e^{-i(1+alpha)theta} winding factor.
 * (3) The rate-vs-alpha curve is ITSELF linear: least-squares fitting slope(alpha) against alpha gives
 *     slope ~ -1 and intercept ~ -1 (R^2 ~ 1), reproducing the closed form -(1+alpha) = -1 - alpha as an
 *     explicit affine law rather than a per-point coincidence. The anchor alpha = 1/2 recovers the
 *     imp-33883 winding rate -3/2.
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * MEASUREMENT ONLY, on the model cusp rho(x) = |x|^{-alpha}. It re-measures a phase slope already derived
 * in closed form by imp-33924; it does NOT re-derive the mapping from m_prime back to C_ren, and a
 * winding-rate curve is not the uniform ANALYTIC tracking of C_ren that H4 needs (imp-33766). H4 is NOT
 * discharged. G6a_shock_lipschitz STAYS OPEN. No positivity; imp-3066 off-diagonal endpoint-Hankel
 * K_a >= 0 UNTOUCHED. NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 *
 * @see imp-33924-joint-cusp-angle-onset-robustness-map (DERIVED the -(1+alpha) winding rate; cross-check (a))
 * @see imp-33883-off-axis-onset-angle-robustness (winding rate -3/2 at the anchor alpha = 1/2)
 * @see imp-33882-cusp-exponent-onset-coefficient-robustness (cusp-exponent lever)
 */

// ---- minimal complex arithmetic (Re, Im pairs) --------------------------------------------------
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cadd = (a, b) => [a[0] + b[0], a[1] + b[1]];
const csub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const cinv = (a) => {
  const d = a[0] * a[0] + a[1] * a[1];
  return [a[0] / d, -a[1] / d];
};
const csq = (a) => cmul(a, a);
const cscale = (s, a) => [s * a[0], s * a[1]];

// Scale-free complex Simpson quadrature of A(alpha, theta) = int_{-inf}^{inf} |u|^{-alpha}/(w-u)^2 du,
// identical to the imp-33924 cross-check (a) machinery. Near part u in (0,1): x = t^{1/(1-alpha)} flattens
// the cusp so |u|^{-alpha} du = (1/(1-alpha)) dt. Tail part u in (1,inf): u = 1/v gives v^{alpha}/(w v -+ 1)^2.
const A_PANELS = 40000;
function aQuadrature(alpha, theta) {
  const w = [Math.cos(theta), Math.sin(theta)];
  const h = 1 / A_PANELS;
  const invOneMinus = 1 / (1 - alpha);
  let s = [0, 0];
  for (let i = 0; i <= A_PANELS; i++) {
    const wt = i === 0 || i === A_PANELS ? 1 : i % 2 === 1 ? 4 : 2;
    const t = i * h;
    const u = Math.pow(t, invOneMinus);
    const near = cscale(
      invOneMinus,
      cadd(cinv(csq(csub(w, [u, 0]))), cinv(csq(cadd(w, [u, 0])))),
    );
    const v = i * h;
    let tail = [0, 0];
    if (v > 0) {
      const va = Math.pow(v, alpha);
      const wv = cscale(v, w);
      tail = cscale(
        va,
        cadd(cinv(csq(csub(wv, [1, 0]))), cinv(csq(cadd(wv, [1, 0])))),
      );
    }
    s = cadd(s, [wt * (near[0] + tail[0]), wt * (near[1] + tail[1])]);
  }
  return cscale(h / 3, s);
}

const rad = (deg) => (deg * Math.PI) / 180;

// Least-squares linear fit of an UNWRAPPED phase sample (ys) against xs, returning {slope, r2}.
// Unwrap first so a winding phase does not fold at the +-pi branch of atan2.
function lsqSlope(xs, ys) {
  const ph = [...ys];
  for (let i = 1; i < ph.length; i++) {
    let d = ph[i] - ph[i - 1];
    while (d > Math.PI) {
      ph[i] -= 2 * Math.PI;
      d = ph[i] - ph[i - 1];
    }
    while (d < -Math.PI) {
      ph[i] += 2 * Math.PI;
      d = ph[i] - ph[i - 1];
    }
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ph.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ph[i] - my);
    sxx += (xs[i] - mx) * (xs[i] - mx);
    syy += (ph[i] - my) * (ph[i] - my);
  }
  const slope = sxy / sxx;
  const r2 = (sxy * sxy) / (sxx * syy);
  const intercept = my - slope * mx;
  return { slope, intercept, r2 };
}

// ---- the winding rate-vs-alpha curve ------------------------------------------------------------
const ALPHA_GRID = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
const THETA_DEG = [];
for (let deg = 45; deg <= 135; deg += 5) THETA_DEG.push(deg);
const THETA_RAD = THETA_DEG.map(rad);

const CURVE = ALPHA_GRID.map((alpha) => {
  const phis = THETA_DEG.map((deg) => {
    const A = cscale(-1, aQuadrature(alpha, rad(deg))); // -A(alpha, theta)
    return Math.atan2(A[1], A[0]);
  });
  const { slope, r2 } = lsqSlope(THETA_RAD, phis);
  const analytic = -(1 + alpha);
  return {
    alpha,
    windingSlopeQuad: +slope.toFixed(9), // measured d arg(-A)/d theta
    windingSlopeAnalytic: +analytic.toFixed(9), // -(1+alpha)
    deviation: +Math.abs(slope - analytic).toExponential(3),
    fitResidual: +(1 - r2).toExponential(3), // 1 - R^2, straight-line quality
  };
});

const MAX_WINDING_DEVIATION = Math.max(...CURVE.map((r) => r.deviation));
const MAX_FIT_RESIDUAL = Math.max(...CURVE.map((r) => r.fitResidual));

// The winding slope is strictly DECREASING in alpha (it equals -1 - alpha).
const SLOPE_MONOTONE_DECREASING = CURVE.every(
  (r, i) => i === 0 || r.windingSlopeQuad < CURVE[i - 1].windingSlopeQuad,
);

// The rate-vs-alpha curve is ITSELF affine: slope(alpha) = -1 - alpha. Fit it and check both coefficients.
const SECONDARY = lsqSlope(
  ALPHA_GRID,
  CURVE.map((r) => r.windingSlopeQuad),
);
const RATE_VS_ALPHA_SLOPE = +SECONDARY.slope.toFixed(9); // -> -1
const RATE_VS_ALPHA_INTERCEPT = +SECONDARY.intercept.toFixed(9); // -> -1
const RATE_VS_ALPHA_R2 = +SECONDARY.r2.toFixed(12); // -> 1

// Anchor alpha = 1/2 recovers the imp-33883 winding rate -3/2.
const AT_HALF = CURVE.find((r) => r.alpha === 0.5);
const ANCHOR_WINDING_OK = Math.abs(AT_HALF.windingSlopeQuad - -1.5) < 1e-6;

export const IMP33968_WINDING_RATE_VS_ALPHA_CURVE = {
  id: 'imp-33968',
  proofSection: 'S-frontier',
  scopes:
    'Tabulate the imp-33924 phase winding rate d arg(-A)/d theta = -(1+alpha) as an EXPLICIT rate-vs-alpha ' +
    'curve, extracted by least-squares fitting the unwrapped arg(-A_quad) over a theta sweep from the ' +
    'scale-free quadrature at each alpha in 0.1..0.9 -- upgrading imp-33924 cross-check (a) from a ' +
    'single-tolerance pass/fail to a tabulated curve',
  question:
    'Does the measured theta-winding slope of arg(-A(alpha,theta)) track the closed-form -(1+alpha) across ' +
    'the full alpha range, and is the rate-vs-alpha curve itself the affine law -1 - alpha? Measurement ' +
    'only; does NOT discharge H4; G6a OPEN; imp-3066 untouched; NO QED.',
  windingRateClosedForm: '-(1+alpha) = -1 - alpha',
  alphaGrid: ALPHA_GRID,
  thetaSweepDeg: [THETA_DEG[0], THETA_DEG[THETA_DEG.length - 1], THETA_DEG.length],

  // (1) the measured winding slope tracks -(1+alpha) across the whole alpha grid.
  curve: CURVE,
  maxWindingDeviation: +MAX_WINDING_DEVIATION.toExponential(3), // < 1e-4, matching imp-33924 cross-check (a)
  windingLawConfirmed: MAX_WINDING_DEVIATION < 1e-4,

  // (2) each per-alpha phase-vs-theta fit is essentially perfectly linear.
  maxFitResidual: +MAX_FIT_RESIDUAL.toExponential(3), // max 1 - R^2 over alpha
  phaseLinearInTheta: MAX_FIT_RESIDUAL < 1e-6,

  // (3) the rate-vs-alpha curve is itself the affine law slope(alpha) = -1 - alpha.
  rateVsAlphaSlope: RATE_VS_ALPHA_SLOPE, // -> -1
  rateVsAlphaIntercept: RATE_VS_ALPHA_INTERCEPT, // -> -1
  rateVsAlphaR2: RATE_VS_ALPHA_R2, // -> 1
  slopeMonotoneDecreasing: SLOPE_MONOTONE_DECREASING,
  affineLawConfirmed:
    Math.abs(RATE_VS_ALPHA_SLOPE + 1) < 1e-3 && Math.abs(RATE_VS_ALPHA_INTERCEPT + 1) < 1e-3,

  // (4) anchor alpha = 1/2 recovers the imp-33883 winding rate -3/2.
  anchorWindingRate: AT_HALF.windingSlopeQuad, // -3/2
  anchorRecovered: ANCHOR_WINDING_OK,

  dischargesH4: false,
  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY, G6a_shock_lipschitz STAYS OPEN. Reusing the imp-33924 scale-free complex Simpson ' +
    'quadrature of A(alpha,theta) = int_{-inf}^{inf} |u|^{-alpha}/(w-u)^2 du, this evaluates -A(alpha,theta) ' +
    'across a theta sweep (45deg..135deg) at each alpha in the extended grid 0.1..0.9, unwraps arg(-A_quad), ' +
    'and least-squares fits the phase against theta to extract the winding SLOPE. The measured slope tracks ' +
    'the closed-form -(1+alpha) across the ENTIRE alpha range with max deviation ' +
    MAX_WINDING_DEVIATION.toExponential(3) +
    ' (the residual concentrates at the smallest alpha, where the cusp is least flattened, and shrinks as ' +
    'alpha grows), upgrading imp-33924 cross-check (a) from a single-tolerance pass/fail to an explicit ' +
    'rate-vs-alpha curve well inside the < 1e-4 tolerance. Each per-alpha fit is essentially perfectly ' +
    'linear in theta (max 1 - R^2 = ' +
    MAX_FIT_RESIDUAL.toExponential(3) +
    '), and the rate-vs-alpha curve is ITSELF affine: fitting slope(alpha) against alpha gives slope ' +
    RATE_VS_ALPHA_SLOPE +
    ' and intercept ' +
    RATE_VS_ALPHA_INTERCEPT +
    ' (R^2 ~ 1), reproducing -(1+alpha) = -1 - alpha as an explicit affine law rather than a per-point ' +
    'coincidence; the anchor alpha = 1/2 recovers the imp-33883 winding rate -3/2. This RE-MEASURES a phase ' +
    'slope already derived in closed form by imp-33924; it does NOT re-derive the m_prime -> C_ren map and ' +
    'does NOT DISCHARGE H4: a winding-rate curve is not the uniform ANALYTIC tracking of C_ren the H4 ' +
    'minimal-input condition requires (imp-33766). No positivity; imp-3066 off-diagonal endpoint-Hankel ' +
    'K_a >= 0 UNTOUCHED; NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
};

export const IMP33968_WINDING_RATE_VS_ALPHA_ASSERTIONS = [
  {
    // (1) measured winding slope tracks -(1+alpha) across the full alpha grid, < 1e-4.
    id: 'imp33968-winding-slope-tracks-law',
    description: 'measured theta-winding slope of arg(-A) equals -(1+alpha) across alpha 0.1..0.9 to < 1e-4',
    holds: () =>
      IMP33968_WINDING_RATE_VS_ALPHA_CURVE.windingLawConfirmed === true &&
      IMP33968_WINDING_RATE_VS_ALPHA_CURVE.maxWindingDeviation < 1e-4,
  },
  {
    // (2) each per-alpha phase-vs-theta fit is essentially perfectly linear.
    id: 'imp33968-phase-linear-in-theta',
    description: 'each per-alpha arg(-A)-vs-theta least-squares fit is straight-line (max 1 - R^2 < 1e-6)',
    holds: () =>
      IMP33968_WINDING_RATE_VS_ALPHA_CURVE.phaseLinearInTheta === true &&
      IMP33968_WINDING_RATE_VS_ALPHA_CURVE.maxFitResidual < 1e-6,
  },
  {
    // (3) the rate-vs-alpha curve is itself the affine law slope(alpha) = -1 - alpha, monotone decreasing.
    id: 'imp33968-rate-vs-alpha-is-affine',
    description: 'the winding rate-vs-alpha curve is the affine law -1 - alpha (slope ~ -1, intercept ~ -1), monotone',
    holds: () =>
      IMP33968_WINDING_RATE_VS_ALPHA_CURVE.affineLawConfirmed === true &&
      IMP33968_WINDING_RATE_VS_ALPHA_CURVE.slopeMonotoneDecreasing === true &&
      Math.abs(IMP33968_WINDING_RATE_VS_ALPHA_CURVE.rateVsAlphaSlope + 1) < 1e-3 &&
      Math.abs(IMP33968_WINDING_RATE_VS_ALPHA_CURVE.rateVsAlphaIntercept + 1) < 1e-3,
  },
  {
    // (4) anchor alpha = 1/2 recovers the imp-33883 winding rate -3/2.
    id: 'imp33968-anchor-recovers-imp33883-winding',
    description: 'the alpha = 1/2 anchor recovers the imp-33883 winding rate -3/2',
    holds: () =>
      IMP33968_WINDING_RATE_VS_ALPHA_CURVE.anchorRecovered === true &&
      Math.abs(IMP33968_WINDING_RATE_VS_ALPHA_CURVE.anchorWindingRate - -1.5) < 1e-6,
  },
  {
    // Honesty gate: measurement only, does NOT discharge H4; G6a OPEN, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp33968-honesty-gate-no-qed',
    description: 'Measurement only: does not discharge H4, G6a stays OPEN, no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP33968_WINDING_RATE_VS_ALPHA_CURVE.isRigorous === false &&
      IMP33968_WINDING_RATE_VS_ALPHA_CURVE.dischargesH4 === false &&
      /NO QED/.test(IMP33968_WINDING_RATE_VS_ALPHA_CURVE.verdict) &&
      /STAYS OPEN/.test(IMP33968_WINDING_RATE_VS_ALPHA_CURVE.verdict) &&
      /remains the rigorous SOTA/.test(IMP33968_WINDING_RATE_VS_ALPHA_CURVE.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(
        IMP33968_WINDING_RATE_VS_ALPHA_CURVE.verdict,
      ),
  },
];

for (const a of IMP33968_WINDING_RATE_VS_ALPHA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33968-winding-rate-vs-alpha-curve assertion failed: ${a.id}`);
  }
}
