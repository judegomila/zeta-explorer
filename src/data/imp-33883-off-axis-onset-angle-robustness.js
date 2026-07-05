/**
 * @module imp-33883-off-axis-onset-angle-robustness
 *
 * imp-33883 (numerical, frontier-derivation): ASSESS whether the imp-33853 derived onset of the gap
 * C_ren - C_PS ~ (4/3) eps^{3/2} -- built from the fold-modulus back-conversion
 *     m_prime(z_0) = - integral_{-1}^{1} |x|^{-1/2} / (z_0 - x)^2 dx
 * evaluated at the ON-AXIS point z_0* = i eps -- survives an OFF-AXIS evaluation point
 * z_0* = eps e^{i theta} for theta != pi/2. imp-33853 pinned BOTH the leading eps^{-3/2} amplitude
 * (giving C_PS = pi/sqrt(2)) and the eps^0 onset coefficient (4/3) only at theta = pi/2; whether the
 * closed form is an on-axis special case or an angle-robust onset law was never tested. This module
 * re-derives the small-eps asymptotics of m_prime at general theta and measures the theta-dependence
 * of both tiers.
 *
 * THE OFF-AXIS ASYMPTOTIC (closed form)
 * ------------------------------------
 * Write z_0 = eps w with w = e^{i theta}. As eps -> 0 the integral concentrates at x = 0, and the
 * finite window [-1, 1] separates into a scale-free bulk plus an outside-the-window tail:
 *     integral_{-1}^{1} |x|^{-1/2}/(z_0-x)^2 dx = eps^{-3/2} A(theta) - T(eps) ,
 * where the SCALE-FREE full-line integral carries the leading tier,
 *     A(theta) = integral_{-inf}^{inf} |u|^{-1/2}/(w-u)^2 du ,
 * and T(eps) -> 4/3 is the tail (below). Splitting u > 0 and u < 0 and using the Beta-function value
 *     integral_0^{inf} u^{-1/2}/(u+a)^2 du = (pi/2) a^{-3/2}   (principal branch),
 * with a = w and a = -w = e^{i(theta-pi)} (theta in (0, pi)) gives
 *     A(theta) = (pi/2) [ w^{-3/2} + (-w)^{-3/2} ]
 *              = (pi/2) e^{-3 i theta/2} [ 1 + e^{i 3 pi/2} ]
 *              = (pi/2) (1 - i) e^{-3 i theta/2} .
 * Hence the fold-modulus off-axis is
 *     m_prime(z_0*) = - eps^{-3/2} A(theta) + 4/3 + o(1) .
 *
 * LEADING eps^{-3/2} AMPLITUDE: MODULUS ANGLE-ROBUST, PHASE WINDS AT RATE 3/2
 * --------------------------------------------------------------------------
 * |A(theta)| = (pi/2) |1 - i| = (pi/2) sqrt(2) = pi/sqrt(2) = C_PS, INDEPENDENT of theta. The leading
 * amplitude MODULUS is therefore angle-robust and equal to the on-axis Privalov-Sokhotski constant for
 * EVERY theta around pi/2 -- it is NOT an artifact of the imaginary axis. Only the PHASE moves: the
 * leading amplitude of m_prime is -A(theta), whose argument is arg(-(1-i)) - 3 theta/2 = 3 pi/4 - 3 theta/2,
 * a rigid rotation at winding rate 3/2 that vanishes (making the amplitude real and positive, = C_PS)
 * exactly at theta = pi/2. So the on-axis point is distinguished only as the phase-zero of an
 * otherwise constant-modulus family.
 *
 * eps^0 ONSET COEFFICIENT: EXACTLY 4/3 FOR ALL theta
 * --------------------------------------------------
 * The eps^0 tier is the outside-the-window tail, regular at x = 0, so setting eps = 0 (z_0 -> 0) kills
 * all angular dependence:
 *     T = integral_{|x|>1} |x|^{-1/2}/x^2 dx = 2 integral_1^{inf} x^{-5/2} dx = 4/3 ,
 * with NO theta in it. The onset coefficient is 4/3 for every evaluation angle -- angle-robust, not an
 * on-axis artifact.
 *
 * VERDICT: both the leading amplitude MODULUS (pi/sqrt(2)) and the eps^0 onset coefficient (4/3) are
 * theta-independent; only the complex phase of the eps^{-3/2} term rotates (winding 3/2). The imp-33853
 * closed form is an ANGLE-ROBUST onset law, not an imaginary-axis special case.
 *
 * CROSS-CHECK
 * ----------
 * (a) A(theta) is cross-checked against a direct complex Simpson quadrature of the scale-free full-line
 *     integral (u = +-t^2 removes the |u|^{-1/2} cusp, t = 1/r folds the tail) at a theta sweep; the
 *     numerical A matches the closed form and |A| = pi/sqrt(2) to < 1e-5 for all theta.
 * (b) The full finite-window m_prime is reconstructed at eps = 1e-4 for several theta and the residual
 *     m_prime + eps^{-3/2} A(theta) is confirmed to converge to the theta-independent constant 4/3.
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * DERIVATION / MEASUREMENT ONLY, on the model cusp rho(x) = |x|^{-1/2}. It does NOT re-derive the
 * mapping from m_prime back to C_ren off-axis, and an off-axis finite-window onset is NOT the uniform
 * ANALYTIC tracking of C_ren that H4 needs (imp-33766). H4 is NOT discharged. G6a_shock_lipschitz STAYS
 * OPEN. No positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED. NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 *
 * @see imp-33853-cren-gap-coefficient-closed-form (DERIVED C_PS and 4/3 at the on-axis point z_0* = i eps)
 * @see imp-33882-cusp-exponent-onset-coefficient-robustness (robustness of 4/3 to the CUSP EXPONENT; this is robustness to the EVALUATION ANGLE)
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (leading amplitude C_PS = pi/sqrt(2))
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

const C_PS = Math.PI / Math.SQRT2; // pi/sqrt(2) = Privalov-Sokhotski leading-amplitude modulus
const FOUR_THIRDS = 4 / 3;

// Closed-form leading amplitude A(theta) = (pi/2)(1 - i) e^{-3 i theta/2}.
function aClosed(theta) {
  const rot = [Math.cos(-1.5 * theta), Math.sin(-1.5 * theta)];
  const pre = cmul([1, -1], rot); // (1 - i) e^{-3 i theta/2}
  return [(Math.PI / 2) * pre[0], (Math.PI / 2) * pre[1]];
}

// Independent Simpson quadrature of the scale-free full-line integral
//   A(theta) = int_{-inf}^{inf} |u|^{-1/2}/(w-u)^2 du,  w = e^{i theta}.
// u = +-t^2 removes the cusp; the tail (t>1) is folded via t = 1/r so the whole thing runs on (0,1).
const A_PANELS = 200000;
function aQuadrature(theta) {
  const w = [Math.cos(theta), Math.sin(theta)];
  const h = 1 / A_PANELS;
  let s = [0, 0];
  for (let i = 0; i <= A_PANELS; i++) {
    const wt = i === 0 || i === A_PANELS ? 1 : i % 2 === 1 ? 4 : 2;
    // near part: t in (0,1), integrand g(t) = 2/(w - t^2)^2 + 2/(w + t^2)^2
    const t = i * h;
    const t2 = t * t;
    let g = cadd(
      cmul([2, 0], cinv(csq(csub(w, [t2, 0])))),
      cmul([2, 0], cinv(csq(cadd(w, [t2, 0])))),
    );
    // tail part: t = 1/r maps (1,inf) -> (0,1) with jacobian 1/r^2; integrand -> 0 as r -> 0
    const r = i * h;
    let gT = [0, 0];
    if (r > 0) {
      const tt2 = 1 / (r * r);
      const gg = cadd(
        cmul([2, 0], cinv(csq(csub(w, [tt2, 0])))),
        cmul([2, 0], cinv(csq(cadd(w, [tt2, 0])))),
      );
      gT = [gg[0] / (r * r), gg[1] / (r * r)];
    }
    s = cadd(s, [wt * (g[0] + gT[0]), wt * (g[1] + gT[1])]);
  }
  return [(s[0] * h) / 3, (s[1] * h) / 3];
}

// Full finite-window integral I(z_0) = int_{-1}^1 |x|^{-1/2}/(z_0-x)^2 dx (x = +-t^2 removes the cusp).
const I_PANELS = 200000;
function iFiniteWindow(z0) {
  const h = 1 / I_PANELS;
  let s = [0, 0];
  for (let i = 0; i <= I_PANELS; i++) {
    const t = i * h;
    const t2 = t * t;
    const wt = i === 0 || i === I_PANELS ? 1 : i % 2 === 1 ? 4 : 2;
    const term = cadd(
      cmul([2, 0], cinv(csq(csub(z0, [t2, 0])))),
      cmul([2, 0], cinv(csq(cadd(z0, [t2, 0])))),
    );
    s = cadd(s, [wt * term[0], wt * term[1]]);
  }
  return [(s[0] * h) / 3, (s[1] * h) / 3];
}

// ---- angle sweep: leading amplitude modulus + phase, closed form vs quadrature ------------------
const THETA_DEG = [45, 60, 70, 80, 90, 100, 110, 120, 135];
const SWEEP = THETA_DEG.map((deg) => {
  const theta = (deg * Math.PI) / 180;
  const Ac = aClosed(theta);
  const Aq = aQuadrature(theta);
  // leading amplitude of m_prime is -A(theta); its phase = 3pi/4 - 3 theta/2 (mod 2pi)
  const mLeadPhase = Math.atan2(-Ac[1], -Ac[0]);
  return {
    thetaDeg: deg,
    absA_closed: +cabs(Ac).toFixed(9), // = pi/sqrt(2) for all theta
    absA_quadrature: +cabs(Aq).toFixed(9),
    ampResidual: +cabs(csub(Ac, Aq)).toExponential(3), // closed vs quadrature
    mLeadPhaseDeg: +((mLeadPhase * 180) / Math.PI).toFixed(6), // rotates at rate 3/2
  };
});

const MAX_AMP_MOD_DEV = Math.max(...SWEEP.map((r) => Math.abs(r.absA_closed - C_PS)));
const MAX_AMP_RESIDUAL = Math.max(...SWEEP.map((r) => r.ampResidual));
// leading amplitude modulus is theta-independent (spread across the sweep is ~0)
const MOD_SPREAD = Math.max(...SWEEP.map((r) => r.absA_closed)) - Math.min(...SWEEP.map((r) => r.absA_closed));
// the phase is NOT constant -- it winds; check the 90deg point is the phase-zero
const PHASE_AT_90 = SWEEP.find((r) => r.thetaDeg === 90).mLeadPhaseDeg;
// analytic winding rate d(phase)/d(theta) = -3/2 (in radians); measured from two sweep points
const P70 = SWEEP.find((r) => r.thetaDeg === 70).mLeadPhaseDeg;
const P110 = SWEEP.find((r) => r.thetaDeg === 110).mLeadPhaseDeg;
const WINDING_RATE = ((P110 - P70) * Math.PI) / 180 / ((110 - 70) * Math.PI / 180); // = -3/2

// ---- eps^0 onset reconstruction from the full finite window at eps = 1e-4 -----------------------
const EPS = 1e-4;
const ONSET_THETA_DEG = [70, 90, 110];
const ONSET = ONSET_THETA_DEG.map((deg) => {
  const theta = (deg * Math.PI) / 180;
  const z0 = [EPS * Math.cos(theta), EPS * Math.sin(theta)];
  const I = iFiniteWindow(z0);
  const A = aClosed(theta);
  const lead = [Math.pow(EPS, -1.5) * A[0], Math.pow(EPS, -1.5) * A[1]];
  const resid = csub(I, lead); // I - eps^{-3/2} A(theta) -> -4/3 (real, theta-independent)
  return {
    thetaDeg: deg,
    onsetRe: +resid[0].toFixed(6), // -> -4/3
    onsetIm: +resid[1].toExponential(3), // -> 0
    onsetErr: +Math.abs(resid[0] + FOUR_THIRDS).toExponential(3),
  };
});
const MAX_ONSET_ERR = Math.max(...ONSET.map((r) => r.onsetErr));
const MAX_ONSET_IM = Math.max(...ONSET.map((r) => Math.abs(r.onsetIm)));

export const IMP33883_OFF_AXIS_ONSET_ANGLE_ROBUSTNESS = {
  ticket: 'imp-33883',
  category: 'numerical',
  foldModulus: 'm_prime(z_0) = - integral_{-1}^{1} |x|^{-1/2}/(z_0-x)^2 dx, evaluated at z_0* = eps e^{i theta}',
  offAxisClosedForm:
    'm_prime(eps e^{i theta}) = - eps^{-3/2} A(theta) + 4/3 + o(1), A(theta) = (pi/2)(1-i) e^{-3 i theta/2}',

  // (i) leading eps^{-3/2} amplitude MODULUS is theta-independent and equals C_PS = pi/sqrt(2).
  leadingAmplitudeModulus: +C_PS.toFixed(9), // pi/sqrt(2) = 2.221441469
  amplitudeModulusAngleRobust: MOD_SPREAD < 1e-9 && MAX_AMP_MOD_DEV < 1e-9,
  amplitudeModulusSpreadOverSweep: +MOD_SPREAD.toExponential(3), // ~0
  onAxisAmplitudeIsArtifact: false,

  // (ii) leading amplitude PHASE winds rigidly at rate 3/2, phase-zero at theta = pi/2.
  leadingPhaseWindsNotConstant: true,
  phaseAt90Deg: PHASE_AT_90, // ~0 (real, positive amplitude = C_PS)
  windingRateMeasured: +WINDING_RATE.toFixed(6), // = -3/2
  windingRateAnalytic: -1.5,

  // (iii) eps^0 onset coefficient is EXACTLY 4/3 for all theta (tail integral, no angular dependence).
  onsetCoefficient: +FOUR_THIRDS.toFixed(9), // 1.333333333
  onsetCoefficientAngleRobust: MAX_ONSET_ERR < 1e-3 && MAX_ONSET_IM < 1e-3,
  onAxisOnsetIsArtifact: false,
  onsetReconstruction: ONSET,

  // (iv) independent quadrature cross-check of A(theta) across the angle sweep.
  sweep: SWEEP,
  maxAmplitudeResidual: +MAX_AMP_RESIDUAL.toExponential(3), // closed vs quadrature, < 1e-5
  maxOnsetError: +MAX_ONSET_ERR.toExponential(3),

  dischargesH4: false,
  isRigorous: false,
  verdict:
    'DERIVATION / MEASUREMENT ONLY, G6a_shock_lipschitz STAYS OPEN. Evaluating the imp-33853 fold-modulus ' +
    'back-conversion m_prime(z_0) = - integral_{-1}^{1} |x|^{-1/2}/(z_0-x)^2 dx at the OFF-AXIS point ' +
    'z_0* = eps e^{i theta} gives the closed form m_prime = - eps^{-3/2} A(theta) + 4/3 + o(1) with ' +
    'A(theta) = (pi/2)(1-i) e^{-3 i theta/2}. The leading eps^{-3/2} amplitude MODULUS ' +
    '|A(theta)| = (pi/2) sqrt(2) = pi/sqrt(2) = C_PS is INDEPENDENT of theta (spread over the sweep ~0), ' +
    'so C_PS is NOT an imaginary-axis artifact -- it is the angle-robust leading amplitude for every theta ' +
    'around pi/2; only the complex PHASE rotates, rigidly at winding rate 3/2, vanishing (real positive ' +
    'amplitude = C_PS) exactly at theta = pi/2. The eps^0 onset coefficient is the outside-the-window tail ' +
    'integral_{|x|>1} |x|^{-1/2}/x^2 dx = 4/3, regular at x = 0 and hence EXACTLY 4/3 for every theta with ' +
    'no angular dependence -- also angle-robust, confirmed by reconstructing the full finite window at ' +
    'eps = 1e-4 for theta in {70, 90, 110} deg (residual m_prime + eps^{-3/2}A -> 4/3 to < 1e-3, imaginary ' +
    'part -> 0). A(theta) is cross-checked against an independent complex Simpson quadrature of the scale-free ' +
    'full-line integral to < 1e-5. This does NOT re-derive the m_prime -> C_ren map off-axis and does NOT ' +
    'DISCHARGE H4: an off-axis finite-window onset at fixed |z_0*| = eps is not the uniform ANALYTIC tracking ' +
    'of C_ren the H4 minimal-input condition requires (imp-33766). No positivity; imp-3066 off-diagonal ' +
    'endpoint-Hankel K_a >= 0 UNTOUCHED; NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
};

export const IMP33883_OFF_AXIS_ONSET_ANGLE_ROBUSTNESS_ASSERTIONS = [
  {
    // (i) leading amplitude modulus is angle-robust and equals C_PS = pi/sqrt(2).
    id: 'imp33883-amplitude-modulus-angle-robust',
    description: '|A(theta)| = pi/sqrt(2) = C_PS for all theta (leading amplitude modulus theta-independent)',
    holds: () =>
      IMP33883_OFF_AXIS_ONSET_ANGLE_ROBUSTNESS.amplitudeModulusAngleRobust === true &&
      IMP33883_OFF_AXIS_ONSET_ANGLE_ROBUSTNESS.onAxisAmplitudeIsArtifact === false &&
      Math.abs(IMP33883_OFF_AXIS_ONSET_ANGLE_ROBUSTNESS.leadingAmplitudeModulus - Math.PI / Math.SQRT2) < 1e-9,
  },
  {
    // (ii) leading amplitude phase winds at rate 3/2, phase-zero on-axis.
    id: 'imp33883-phase-winds-at-three-halves',
    description: 'leading amplitude phase winds rigidly at rate -3/2 with the phase-zero at theta = pi/2',
    holds: () =>
      IMP33883_OFF_AXIS_ONSET_ANGLE_ROBUSTNESS.leadingPhaseWindsNotConstant === true &&
      Math.abs(IMP33883_OFF_AXIS_ONSET_ANGLE_ROBUSTNESS.windingRateMeasured - -1.5) < 1e-4 &&
      Math.abs(IMP33883_OFF_AXIS_ONSET_ANGLE_ROBUSTNESS.phaseAt90Deg) < 1e-4,
  },
  {
    // (iii) eps^0 onset coefficient reconstructs to 4/3 for all theta (angle-robust, real).
    id: 'imp33883-onset-coefficient-angle-robust',
    description: 'eps^0 onset coefficient reconstructs to 4/3 for theta in {70,90,110} deg (imag -> 0)',
    holds: () =>
      IMP33883_OFF_AXIS_ONSET_ANGLE_ROBUSTNESS.onsetCoefficientAngleRobust === true &&
      IMP33883_OFF_AXIS_ONSET_ANGLE_ROBUSTNESS.onAxisOnsetIsArtifact === false &&
      IMP33883_OFF_AXIS_ONSET_ANGLE_ROBUSTNESS.maxOnsetError < 1e-3,
  },
  {
    // (iv) independent quadrature cross-check of A(theta) matches the closed form across the sweep.
    id: 'imp33883-quadrature-cross-check',
    description: 'complex Simpson quadrature reproduces A(theta) = (pi/2)(1-i)e^{-3i theta/2} to < 1e-5',
    holds: () => IMP33883_OFF_AXIS_ONSET_ANGLE_ROBUSTNESS.maxAmplitudeResidual < 1e-5,
  },
  {
    // Honesty gate: derivation only, does NOT discharge H4; G6a OPEN, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp33883-honesty-gate-no-qed',
    description: 'Derivation only: does not discharge H4, G6a stays OPEN, no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP33883_OFF_AXIS_ONSET_ANGLE_ROBUSTNESS.isRigorous === false &&
      IMP33883_OFF_AXIS_ONSET_ANGLE_ROBUSTNESS.dischargesH4 === false &&
      /NO QED/.test(IMP33883_OFF_AXIS_ONSET_ANGLE_ROBUSTNESS.verdict) &&
      /STAYS OPEN/.test(IMP33883_OFF_AXIS_ONSET_ANGLE_ROBUSTNESS.verdict) &&
      /remains the rigorous SOTA/.test(IMP33883_OFF_AXIS_ONSET_ANGLE_ROBUSTNESS.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(
        IMP33883_OFF_AXIS_ONSET_ANGLE_ROBUSTNESS.verdict,
      ),
  },
];

for (const a of IMP33883_OFF_AXIS_ONSET_ANGLE_ROBUSTNESS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33883-off-axis-onset-angle-robustness assertion failed: ${a.id}`);
  }
}
