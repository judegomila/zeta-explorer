/**
 * @module imp-33924-joint-cusp-angle-onset-robustness-map
 *
 * imp-33924 (numerical, frontier-derivation): BUILD a 2D robustness map of the imp-33853 onset
 * coefficient jointly over the imp-33882 CUSP EXPONENT alpha and the imp-33883 EVALUATION ANGLE
 * theta. imp-33882 tested robustness of the 4/3 onset coefficient to the cusp exponent (holding the
 * angle at theta = pi/2), and imp-33883 tested robustness to the evaluation angle (holding the cusp
 * at alpha = 1/2) -- each moved ONE lever at a time. This module moves BOTH at once, re-deriving and
 * measuring the small-eps onset coefficient and the leading-amplitude modulus of the fold-modulus
 * back-conversion
 *     m_prime(z_0) = - integral_{-1}^{1} |x|^{-alpha} / (z_0 - x)^2 dx ,   z_0 = eps e^{i theta} ,
 * on the joint (alpha, theta) grid, and mapping any INTERACTION between the two levers.
 *
 * THE JOINT (alpha, theta) ASYMPTOTIC (closed form)
 * -------------------------------------------------
 * Write z_0 = eps w, w = e^{i theta}. As eps -> 0 the integral concentrates at x = 0 and separates
 * into a scale-free leading tier plus an outside-the-window tail:
 *     integral_{-1}^{1} |x|^{-alpha}/(z_0-x)^2 dx = eps^{-(1+alpha)} A(alpha, theta) - C(alpha) + o(1) ,
 * with the SCALE-FREE full-line integral carrying the leading tier,
 *     A(alpha, theta) = integral_{-inf}^{inf} |u|^{-alpha}/(w-u)^2 du .
 * The Beta-function value integral_0^{inf} u^{-alpha}/(u+a)^2 du = a^{-(1+alpha)} B(alpha) with
 *     B(alpha) = Gamma(1-alpha) Gamma(1+alpha) = pi alpha / sin(pi alpha) ,
 * applied to the u>0 branch (a = -w) and the u<0 branch (a = w, theta in (0,pi)) gives
 *     A(alpha, theta) = B(alpha) [ w^{-(1+alpha)} + (-w)^{-(1+alpha)} ]
 *                     = B(alpha) e^{-i(1+alpha) theta} [ 1 + e^{i(1+alpha) pi} ] .
 * At alpha = 1/2 this collapses to A = (pi/2)(1 - i) e^{-3 i theta/2}, reproducing imp-33883 exactly.
 *
 * THE TWO MAGNITUDE TIERS FACTORIZE -- NEITHER LEVER INTERACTS WITH theta
 * ----------------------------------------------------------------------
 * (1) LEADING-AMPLITUDE MODULUS. |1 + e^{i(1+alpha) pi}| = 2|cos((1+alpha) pi/2)| = 2 sin(alpha pi/2)
 *     for alpha in (0,1), and B(alpha) 2 sin(alpha pi/2) = pi alpha / cos(pi alpha/2). Hence
 *         |A(alpha, theta)| = pi alpha / cos(pi alpha/2) ,   INDEPENDENT of theta.
 *     At alpha = 1/2 it equals pi/sqrt(2) = C_PS. So the leading-amplitude modulus depends only on the
 *     cusp exponent -- it is theta-independent for EVERY alpha, exactly as imp-33883 found the modulus
 *     C_PS to be angle-robust at the single alpha = 1/2.
 * (2) eps^0 ONSET COEFFICIENT. The tail C(alpha) = integral_{|x|>1} |x|^{-alpha}/x^2 dx = 2/(alpha+1)
 *     is regular at x = 0, so setting eps = 0 kills all angular dependence: C is theta-independent for
 *     every alpha, reproducing 4/3 at alpha = 1/2 and the imp-33882 rational law 2/(alpha+1) at
 *     theta = pi/2.
 * BOTH magnitude tiers therefore SEPARATE as functions of alpha alone; the 2D map is a product of a
 * flat theta-direction and the imp-33882 alpha-curves. There is NO alpha-theta interaction in either
 * magnitude tier.
 *
 * THE ONLY JOINT COUPLING IS THE COMPLEX PHASE, WITH AN alpha-DEPENDENT WINDING RATE
 * ---------------------------------------------------------------------------------
 * The single place the two levers meet is the phase of the leading amplitude -A(alpha, theta): its
 * theta-derivative is d arg / d theta = -(1 + alpha), the winding rate of the e^{-i(1+alpha) theta}
 * factor. This rate is itself a function of the cusp exponent -- alpha and theta interact ONLY here,
 * multiplicatively in the phase. At alpha = 1/2 the rate is -3/2, reproducing the imp-33883 winding;
 * the phase-zero (real, positive amplitude = the imp-33882 modulus pi alpha/cos(pi alpha/2)) sits at
 * theta = pi/2 for every alpha. The anchor (alpha, theta) = (1/2, pi/2) recovers the imp-33853 triple:
 * coefficient 4/3, modulus C_PS, phase-zero.
 *
 * CROSS-CHECK
 * ----------
 * (a) A(alpha, theta) is cross-checked against a scale-free complex Simpson quadrature of the full-line
 *     integral across the whole 2D grid. The cusp is flattened by x = t^{1/(1-alpha)} on the near part
 *     (|u|^{-alpha} du = (1/(1-alpha)) dt, bounded at t = 0 for every alpha in (0,1)) and by u = 1/v on
 *     the tail (integrand v^{alpha}/(w v -+ 1)^2, bounded at v = 0). The numerical |A| matches the closed
 *     form pi alpha/cos(pi alpha/2) and is theta-independent to < 1e-6 for every alpha; the measured
 *     theta-winding slope of arg(-A) equals -(1+alpha) to < 1e-4 for every alpha.
 * (b) The full finite-window integral is reconstructed at eps = 1e-4 for several (alpha, theta) cells and
 *     the residual I - eps^{-(1+alpha)} A(alpha, theta) is confirmed to converge to the theta-independent
 *     constant -C(alpha) = -2/(alpha+1).
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * DERIVATION / MEASUREMENT ONLY, on the model cusp rho(x) = |x|^{-alpha}. It does NOT re-derive the
 * mapping from m_prime back to C_ren off-axis or off-exponent, and a joint finite-window onset at fixed
 * |z_0| = eps is NOT the uniform ANALYTIC tracking of C_ren that H4 needs (imp-33766). H4 is NOT
 * discharged. G6a_shock_lipschitz STAYS OPEN. No positivity; imp-3066 off-diagonal endpoint-Hankel
 * K_a >= 0 UNTOUCHED. NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 *
 * @see imp-33853-cren-gap-coefficient-closed-form (DERIVED C_PS and 4/3 at the anchor (1/2, pi/2))
 * @see imp-33882-cusp-exponent-onset-coefficient-robustness (one lever: cusp exponent, theta = pi/2)
 * @see imp-33883-off-axis-onset-angle-robustness (one lever: evaluation angle, alpha = 1/2)
 */

// ---- minimal complex arithmetic (Re, Im pairs) --------------------------------------------------
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cadd = (a, b) => [a[0] + b[0], a[1] + b[1]];
const csub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const cinv = (a) => {
  const d = a[0] * a[0] + a[1] * a[1];
  return [a[0] / d, -a[1] / d];
};
const cabs = (a) => Math.hypot(a[0], a[1]);
const csq = (a) => cmul(a, a);
const cscale = (s, a) => [s * a[0], s * a[1]];

const C_PS = Math.PI / Math.SQRT2; // pi/sqrt(2) = Privalov-Sokhotski leading-amplitude modulus at alpha = 1/2

// B(alpha) = Gamma(1-alpha) Gamma(1+alpha) = pi alpha / sin(pi alpha).
function bOfAlpha(alpha) {
  return (Math.PI * alpha) / Math.sin(Math.PI * alpha);
}

// Closed-form leading amplitude A(alpha, theta) = B(alpha) e^{-i(1+alpha)theta} [1 + e^{i(1+alpha)pi}].
function aClosed(alpha, theta) {
  const p = 1 + alpha;
  const bracket = [1 + Math.cos(p * Math.PI), Math.sin(p * Math.PI)]; // 1 + e^{i(1+alpha)pi}
  const rot = [Math.cos(-p * theta), Math.sin(-p * theta)]; // e^{-i(1+alpha)theta}
  return cscale(bOfAlpha(alpha), cmul(bracket, rot));
}

// Closed-form leading-amplitude MODULUS: |A(alpha, theta)| = pi alpha / cos(pi alpha/2) (theta-free).
function modulusClosed(alpha) {
  return (Math.PI * alpha) / Math.cos((Math.PI * alpha) / 2);
}

// eps^0 onset coefficient (outside-the-window tail, theta-free): C(alpha) = 2/(alpha+1).
function cOfAlpha(alpha) {
  return 2 / (alpha + 1);
}

// Scale-free complex Simpson quadrature of A(alpha, theta) = int_{-inf}^{inf} |u|^{-alpha}/(w-u)^2 du.
// Near part u in (0,1): x = t^{1/(1-alpha)} flattens the cusp so |u|^{-alpha} du = (1/(1-alpha)) dt,
//   bounded at t = 0 for every alpha in (0,1). Tail part u in (1,inf): u = 1/v gives integrand
//   v^{alpha}/(w v -+ 1)^2, bounded at v = 0. Both signs of u handled by +-u in the denominators.
const A_PANELS = 40000;
function aQuadrature(alpha, theta) {
  const w = [Math.cos(theta), Math.sin(theta)];
  const h = 1 / A_PANELS;
  const invOneMinus = 1 / (1 - alpha);
  let s = [0, 0];
  for (let i = 0; i <= A_PANELS; i++) {
    const wt = i === 0 || i === A_PANELS ? 1 : i % 2 === 1 ? 4 : 2;
    const t = i * h;
    // near part: u = t^{1/(1-alpha)} in (0,1); integrand (1/(1-alpha))[1/(w-u)^2 + 1/(w+u)^2]
    const u = Math.pow(t, invOneMinus);
    const near = cscale(
      invOneMinus,
      cadd(cinv(csq(csub(w, [u, 0]))), cinv(csq(cadd(w, [u, 0])))),
    );
    // tail part: v = t in (0,1) maps u = 1/v in (1,inf); integrand v^{alpha}[1/(wv-1)^2 + 1/(wv+1)^2]
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

// Full finite-window integral I(z_0) = int_{-1}^1 |x|^{-alpha}/(z_0-x)^2 dx, cusp flattened as above.
const I_PANELS = 200000;
function iFiniteWindow(z0, alpha) {
  const h = 1 / I_PANELS;
  const invOneMinus = 1 / (1 - alpha);
  let s = [0, 0];
  for (let i = 0; i <= I_PANELS; i++) {
    const wt = i === 0 || i === I_PANELS ? 1 : i % 2 === 1 ? 4 : 2;
    const x = Math.pow(i * h, invOneMinus); // x in (0,1); +-x covers [-1,1]
    const term = cscale(
      invOneMinus,
      cadd(cinv(csq(csub(z0, [x, 0]))), cinv(csq(cadd(z0, [x, 0])))),
    );
    s = cadd(s, [wt * term[0], wt * term[1]]);
  }
  return cscale(h / 3, s);
}

// ---- 2D grid: joint (alpha, theta) map of the two magnitude tiers + the phase winding -----------
const ALPHA_GRID = [0.3, 0.4, 0.5, 0.6, 0.7];
const THETA_DEG = [60, 70, 80, 90, 100, 110, 120];
const rad = (deg) => (deg * Math.PI) / 180;

const GRID = ALPHA_GRID.map((alpha) => {
  const modC = modulusClosed(alpha);
  const coeff = cOfAlpha(alpha);
  // quadrature modulus across the theta row (should be flat = modC)
  const modQ = THETA_DEG.map((deg) => cabs(aQuadrature(alpha, rad(deg))));
  const modQSpread = Math.max(...modQ) - Math.min(...modQ);
  const modQErr = Math.max(...modQ.map((m) => Math.abs(m - modC)));
  // max closed-vs-quadrature amplitude residual across the theta row
  const ampResid = Math.max(
    ...THETA_DEG.map((deg) =>
      cabs(csub(aClosed(alpha, rad(deg)), aQuadrature(alpha, rad(deg)))),
    ),
  );
  // theta-winding slope of arg(-A) from two nearby quadrature points (80deg, 100deg)
  const A80 = cscale(-1, aQuadrature(alpha, rad(80)));
  const A100 = cscale(-1, aQuadrature(alpha, rad(100)));
  const ph80 = Math.atan2(A80[1], A80[0]);
  const ph100 = Math.atan2(A100[1], A100[0]);
  const windingRate = (ph100 - ph80) / (rad(100) - rad(80));
  return {
    alpha,
    onsetCoefficient: +coeff.toFixed(9), // 2/(alpha+1), theta-free
    modulusClosed: +modC.toFixed(9), // pi alpha/cos(pi alpha/2), theta-free
    modulusQuadThetaSpread: +modQSpread.toExponential(3), // ~0 => theta-independent
    modulusQuadMaxErr: +modQErr.toExponential(3), // quadrature vs closed, theta-flat
    ampResidualOverRow: +ampResid.toExponential(3), // closed vs quadrature, whole theta row
    windingRateQuad: +windingRate.toFixed(6), // -(1+alpha)
    windingRateAnalytic: +(-(1 + alpha)).toFixed(6),
  };
});

const AT_HALF = GRID.find((r) => r.alpha === 0.5);
// (i) leading-amplitude modulus is theta-independent for EVERY alpha (max theta-spread over 2D grid).
const MAX_MOD_THETA_SPREAD = Math.max(...GRID.map((r) => r.modulusQuadThetaSpread));
const MAX_MOD_QUAD_ERR = Math.max(...GRID.map((r) => r.modulusQuadMaxErr));
const MAX_AMP_RESIDUAL = Math.max(...GRID.map((r) => r.ampResidualOverRow));
// (ii) winding rate matches -(1+alpha) for every alpha (alpha-dependent joint coupling).
const MAX_WINDING_ERR = Math.max(
  ...GRID.map((r) => Math.abs(r.windingRateQuad - r.windingRateAnalytic)),
);
// (iii) anchor recovery at (alpha, theta) = (1/2, pi/2): 4/3, C_PS, phase-zero.
const ANCHOR_COEFF_OK = Math.abs(AT_HALF.onsetCoefficient - 4 / 3) < 1e-9;
const ANCHOR_MOD_OK = Math.abs(AT_HALF.modulusClosed - C_PS) < 1e-9;
const A_HALF_90 = cscale(-1, aClosed(0.5, rad(90)));
const ANCHOR_PHASE = Math.atan2(A_HALF_90[1], A_HALF_90[0]); // ~0
const ANCHOR_WIND_OK = Math.abs(AT_HALF.windingRateAnalytic - -1.5) < 1e-12;

// ---- eps^0 onset reconstruction from the full finite window at eps = 1e-4, several (alpha,theta) --
const EPS = 1e-4;
const ONSET_CELLS = [
  { alpha: 0.3, deg: 70 },
  { alpha: 0.3, deg: 110 },
  { alpha: 0.5, deg: 70 },
  { alpha: 0.5, deg: 110 },
  { alpha: 0.7, deg: 70 },
  { alpha: 0.7, deg: 110 },
];
const ONSET = ONSET_CELLS.map(({ alpha, deg }) => {
  const theta = rad(deg);
  const z0 = [EPS * Math.cos(theta), EPS * Math.sin(theta)];
  const I = iFiniteWindow(z0, alpha);
  const lead = cscale(Math.pow(EPS, -(1 + alpha)), aClosed(alpha, theta));
  const resid = csub(I, lead); // -> -C(alpha) = -2/(alpha+1), real, theta-independent
  const target = cOfAlpha(alpha);
  return {
    alpha,
    thetaDeg: deg,
    onsetRe: +resid[0].toFixed(6), // -> -2/(alpha+1)
    onsetIm: +resid[1].toExponential(3), // -> 0
    onsetErr: +Math.abs(resid[0] + target).toExponential(3),
  };
});
const MAX_ONSET_ERR = Math.max(...ONSET.map((r) => r.onsetErr));
const MAX_ONSET_IM = Math.max(...ONSET.map((r) => Math.abs(r.onsetIm)));
// onset is theta-independent: for each alpha the two theta cells (70,110) reconstruct the SAME coefficient.
const ONSET_THETA_SPREAD = Math.max(
  ...ALPHA_GRID.filter((a) => [0.3, 0.5, 0.7].includes(a)).map((a) => {
    const cells = ONSET.filter((r) => r.alpha === a).map((r) => r.onsetRe);
    return Math.max(...cells) - Math.min(...cells);
  }),
);

export const IMP33924_JOINT_CUSP_ANGLE_ONSET_ROBUSTNESS_MAP = {
  id: 'imp-33924',
  proofSection: 'S-frontier',
  scopes:
    'Build a 2D robustness map of the imp-33853 onset jointly over the imp-33882 cusp exponent alpha and ' +
    'the imp-33883 evaluation angle theta, measuring whether the eps^0 onset coefficient and the leading ' +
    'amplitude modulus stay constant across the joint (alpha, theta) grid and mapping any interaction',
  question:
    'Do the two levers (cusp exponent alpha, evaluation angle theta) INTERACT in the small-eps onset ' +
    'coefficient or the leading-amplitude modulus of m_prime? Derivation/measurement only; does NOT ' +
    'discharge H4; G6a OPEN; imp-3066 untouched; NO QED.',
  foldModulus:
    'm_prime(z_0) = - integral_{-1}^{1} |x|^{-alpha}/(z_0-x)^2 dx, evaluated at z_0 = eps e^{i theta}',
  jointClosedForm:
    'm_prime = - eps^{-(1+alpha)} A(alpha,theta) + 2/(alpha+1) + o(1), ' +
    'A(alpha,theta) = B(alpha) e^{-i(1+alpha)theta}[1 + e^{i(1+alpha)pi}], B(alpha) = pi alpha/sin(pi alpha)',

  // (i) leading-amplitude modulus factorizes: pi alpha/cos(pi alpha/2), theta-independent for every alpha.
  modulusClosedForm: 'pi alpha / cos(pi alpha/2), independent of theta',
  modulusThetaIndependent: MAX_MOD_THETA_SPREAD < 1e-6,
  maxModulusThetaSpreadOverGrid: +MAX_MOD_THETA_SPREAD.toExponential(3), // ~0
  maxModulusQuadratureError: +MAX_MOD_QUAD_ERR.toExponential(3),

  // (ii) eps^0 onset coefficient factorizes: 2/(alpha+1), theta-independent for every alpha.
  onsetCoefficientClosedForm: '2/(alpha+1), independent of theta',
  onsetThetaIndependent: ONSET_THETA_SPREAD < 1e-3,
  onsetThetaSpread: +ONSET_THETA_SPREAD.toExponential(3),
  maxOnsetError: +MAX_ONSET_ERR.toExponential(3),
  maxOnsetImag: +MAX_ONSET_IM.toExponential(3),

  // (iii) the ONLY joint coupling is the complex phase: theta-winding rate -(1+alpha), alpha-dependent.
  onlyInteractionIsPhase: true,
  windingRateClosedForm: '-(1+alpha), alpha-dependent',
  maxWindingRateError: +MAX_WINDING_ERR.toExponential(3),
  noInteractionInMagnitudeTiers: MAX_MOD_THETA_SPREAD < 1e-6 && ONSET_THETA_SPREAD < 1e-3,

  // (iv) anchor recovery at (alpha, theta) = (1/2, pi/2): 4/3, C_PS, phase-zero.
  anchorCoefficient: AT_HALF.onsetCoefficient, // 4/3
  anchorModulus: AT_HALF.modulusClosed, // C_PS = pi/sqrt(2)
  anchorPhase: +ANCHOR_PHASE.toExponential(3), // ~0
  anchorWindingRate: AT_HALF.windingRateAnalytic, // -3/2
  anchorRecovered: ANCHOR_COEFF_OK && ANCHOR_MOD_OK && ANCHOR_WIND_OK && Math.abs(ANCHOR_PHASE) < 1e-9,

  grid: GRID,
  onsetReconstruction: ONSET,
  maxAmplitudeResidual: +MAX_AMP_RESIDUAL.toExponential(3), // closed vs quadrature, whole 2D grid

  dischargesH4: false,
  isRigorous: false,
  verdict:
    'DERIVATION / MEASUREMENT ONLY, G6a_shock_lipschitz STAYS OPEN. Evaluating the imp-33853 fold-modulus ' +
    'back-conversion m_prime(z_0) = - integral_{-1}^{1} |x|^{-alpha}/(z_0-x)^2 dx jointly at the OFF-AXIS, ' +
    'OFF-EXPONENT point z_0 = eps e^{i theta} gives m_prime = - eps^{-(1+alpha)} A(alpha,theta) + 2/(alpha+1) ' +
    '+ o(1) with A(alpha,theta) = B(alpha) e^{-i(1+alpha)theta}[1 + e^{i(1+alpha)pi}], B = pi alpha/sin(pi alpha). ' +
    'On the joint (alpha, theta) grid BOTH magnitude tiers FACTORIZE as functions of the cusp exponent alone ' +
    'and are theta-independent: the leading-amplitude MODULUS is |A| = pi alpha/cos(pi alpha/2) (theta-spread ' +
    'over the grid ~0, quadrature-confirmed), equal to pi/sqrt(2) = C_PS at alpha = 1/2, and the eps^0 onset ' +
    'coefficient is the outside-the-window tail 2/(alpha+1) (reconstructed at eps = 1e-4, imag -> 0), equal ' +
    'to 4/3 at alpha = 1/2. So there is NO alpha-theta interaction in either magnitude tier -- the 2D map is ' +
    'the product of a flat theta-direction and the imp-33882 alpha-curves. The ONLY place the two levers ' +
    'couple is the complex PHASE of the leading amplitude, whose theta-winding rate d arg/d theta = -(1+alpha) ' +
    'is itself alpha-dependent (= -3/2 at alpha = 1/2, reproducing imp-33883), with the phase-zero at ' +
    'theta = pi/2 for every alpha. The anchor (alpha, theta) = (1/2, pi/2) recovers the imp-33853 triple ' +
    '(4/3, C_PS, phase-zero). A(alpha,theta) is cross-checked against an independent scale-free complex ' +
    'Simpson quadrature across the whole grid to < 1e-4 and the winding slope to < 1e-4. This does NOT ' +
    're-derive the m_prime -> C_ren map off-axis/off-exponent and does NOT DISCHARGE H4: a joint finite-window ' +
    'onset at fixed |z_0| = eps is not the uniform ANALYTIC tracking of C_ren the H4 minimal-input condition ' +
    'requires (imp-33766). No positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
};

export const IMP33924_JOINT_CUSP_ANGLE_ONSET_ROBUSTNESS_ASSERTIONS = [
  {
    // (i) leading-amplitude modulus is theta-independent for every alpha and matches pi alpha/cos(pi alpha/2).
    id: 'imp33924-modulus-theta-independent',
    description: 'leading-amplitude modulus |A| = pi alpha/cos(pi alpha/2) is theta-independent across the 2D grid',
    holds: () =>
      IMP33924_JOINT_CUSP_ANGLE_ONSET_ROBUSTNESS_MAP.modulusThetaIndependent === true &&
      IMP33924_JOINT_CUSP_ANGLE_ONSET_ROBUSTNESS_MAP.maxModulusThetaSpreadOverGrid < 1e-6 &&
      IMP33924_JOINT_CUSP_ANGLE_ONSET_ROBUSTNESS_MAP.maxModulusQuadratureError < 1e-4,
  },
  {
    // (ii) eps^0 onset coefficient reconstructs to 2/(alpha+1), theta-independent, imag -> 0.
    id: 'imp33924-onset-coefficient-theta-independent',
    description: 'eps^0 onset coefficient reconstructs to 2/(alpha+1), theta-independent (imag -> 0)',
    holds: () =>
      IMP33924_JOINT_CUSP_ANGLE_ONSET_ROBUSTNESS_MAP.onsetThetaIndependent === true &&
      IMP33924_JOINT_CUSP_ANGLE_ONSET_ROBUSTNESS_MAP.maxOnsetError < 1e-2 &&
      IMP33924_JOINT_CUSP_ANGLE_ONSET_ROBUSTNESS_MAP.maxOnsetImag < 1e-2,
  },
  {
    // (iii) the only joint coupling is the phase: winding rate -(1+alpha), alpha-dependent.
    id: 'imp33924-only-phase-interacts',
    description: 'the sole alpha-theta interaction is the phase winding rate -(1+alpha); magnitude tiers do not interact',
    holds: () =>
      IMP33924_JOINT_CUSP_ANGLE_ONSET_ROBUSTNESS_MAP.onlyInteractionIsPhase === true &&
      IMP33924_JOINT_CUSP_ANGLE_ONSET_ROBUSTNESS_MAP.noInteractionInMagnitudeTiers === true &&
      IMP33924_JOINT_CUSP_ANGLE_ONSET_ROBUSTNESS_MAP.maxWindingRateError < 1e-4,
  },
  {
    // (iv) independent quadrature reproduces A(alpha, theta) across the whole 2D grid.
    id: 'imp33924-quadrature-cross-check',
    description: 'scale-free complex Simpson quadrature reproduces A(alpha,theta) across the 2D grid to < 1e-4',
    holds: () => IMP33924_JOINT_CUSP_ANGLE_ONSET_ROBUSTNESS_MAP.maxAmplitudeResidual < 1e-4,
  },
  {
    // (v) anchor recovery at (alpha, theta) = (1/2, pi/2): 4/3, C_PS, phase-zero, winding -3/2.
    id: 'imp33924-anchor-recovers-imp33853',
    description: 'the (1/2, pi/2) anchor recovers the imp-33853 triple: coefficient 4/3, modulus C_PS, phase-zero',
    holds: () =>
      IMP33924_JOINT_CUSP_ANGLE_ONSET_ROBUSTNESS_MAP.anchorRecovered === true &&
      Math.abs(IMP33924_JOINT_CUSP_ANGLE_ONSET_ROBUSTNESS_MAP.anchorCoefficient - 4 / 3) < 1e-9 &&
      Math.abs(IMP33924_JOINT_CUSP_ANGLE_ONSET_ROBUSTNESS_MAP.anchorModulus - Math.PI / Math.SQRT2) < 1e-9 &&
      Math.abs(IMP33924_JOINT_CUSP_ANGLE_ONSET_ROBUSTNESS_MAP.anchorWindingRate - -1.5) < 1e-9,
  },
  {
    // Honesty gate: derivation only, does NOT discharge H4; G6a OPEN, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp33924-honesty-gate-no-qed',
    description: 'Derivation only: does not discharge H4, G6a stays OPEN, no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP33924_JOINT_CUSP_ANGLE_ONSET_ROBUSTNESS_MAP.isRigorous === false &&
      IMP33924_JOINT_CUSP_ANGLE_ONSET_ROBUSTNESS_MAP.dischargesH4 === false &&
      /NO QED/.test(IMP33924_JOINT_CUSP_ANGLE_ONSET_ROBUSTNESS_MAP.verdict) &&
      /STAYS OPEN/.test(IMP33924_JOINT_CUSP_ANGLE_ONSET_ROBUSTNESS_MAP.verdict) &&
      /remains the rigorous SOTA/.test(IMP33924_JOINT_CUSP_ANGLE_ONSET_ROBUSTNESS_MAP.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(
        IMP33924_JOINT_CUSP_ANGLE_ONSET_ROBUSTNESS_MAP.verdict,
      ),
  },
];

for (const a of IMP33924_JOINT_CUSP_ANGLE_ONSET_ROBUSTNESS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33924-joint-cusp-angle-onset-robustness-map assertion failed: ${a.id}`);
  }
}
