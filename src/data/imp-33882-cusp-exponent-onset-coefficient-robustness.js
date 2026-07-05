/**
 * @module imp-33882-cusp-exponent-onset-coefficient-robustness
 *
 * imp-33882 (numerical, frontier-derivation): ASSESS the robustness of the imp-33853 derived 4/3
 * finite-window onset coefficient to the cusp exponent. imp-33853 derived the eps^0 tier of the gap
 * C_ren - C_PS ~ (4/3) eps^{3/2} as the OUTSIDE-THE-WINDOW tail integral of the model cusp
 * rho(x) = |x|^{-1/2}, i.e. integral_{|x|>1} |x|^{-1/2}/x^2 dx = 2 integral_1^{inf} x^{-5/2} dx = 4/3.
 * Whether 4/3 is a knife-edge of the alpha = 1/2 Holder exponent or a smooth function of it was
 * never assessed. This module re-runs the tail derivation for the general Holder cusp
 * rho(x) = |x|^{-alpha} and reports the coefficient as a function C(alpha).
 *
 * THE GENERAL-alpha TAIL DERIVATION (closed form)
 * ----------------------------------------------
 * The eps^0 window-tail correction is regular at x = 0, so setting eps = 0 gives a finite constant
 * for any alpha in (-1, ...):
 *     C(alpha) = integral_{|x|>1} |x|^{-alpha}/x^2 dx
 *              = 2 integral_1^{inf} x^{-(alpha+2)} dx
 *              = 2 [ x^{-(alpha+1)} / (-(alpha+1)) ]_1^{inf}
 *              = 2 / (alpha + 1).
 * The integral converges precisely when alpha + 1 > 0 (alpha > -1); the model Holder cusp lives in
 * alpha in (0, 1) so the cusp density |x|^{-alpha} stays integrable at the origin. At alpha = 1/2,
 *     C(1/2) = 2 / (3/2) = 4/3,
 * reproducing the imp-33853 coefficient exactly.
 *
 * IS 4/3 SPECIAL TO alpha = 1/2?
 * -----------------------------
 * NO. C(alpha) = 2/(alpha+1) is a SMOOTH (analytic, strictly decreasing, convex) function of alpha on
 * the whole admissible range; 4/3 is just its value at the single point alpha = 1/2, not a knife-edge.
 * Endpoints of the Holder window: C(alpha) -> 2 as alpha -> 0^+ and C(alpha) -> 1 as alpha -> 1^-,
 * so the coefficient ranges over (1, 2) with 4/3 sitting in the interior. Nothing singular happens at
 * alpha = 1/2 -- the density exponent 1/2 is distinguished for the LEADING eps^{-3/2} amplitude tier
 * (which pins C_PS = pi/sqrt(2) via the Gamma(1/4)Gamma(3/4) collapse), but the eps^0 onset
 * coefficient is a plain rational function of alpha.
 *
 * SENSITIVITY TO CUSP-EXPONENT PERTURBATION
 * ----------------------------------------
 * dC/dalpha = -2/(alpha+1)^2, so at alpha = 1/2 the absolute slope is -2/(3/2)^2 = -8/9 ~ -0.8889:
 * a small perturbation d_alpha shifts C by about -0.889 d_alpha. The dimensionless (logarithmic)
 * sensitivity is d ln C / d ln alpha = -alpha/(alpha+1) = -(1/2)/(3/2) = -1/3 at alpha = 1/2, i.e. a
 * 1% change in the cusp exponent moves the onset coefficient by only ~0.33% -- a mild, well-conditioned
 * dependence, not a knife-edge.
 *
 * CROSS-CHECK
 * ----------
 * C(alpha) is cross-checked by an independent Simpson quadrature at several alpha near 1/2. Mapping
 * x = 1/v (dx = -v^{-2} dv) sends integral_1^{inf} x^{-(alpha+2)} dx to integral_0^1 v^{alpha} dv, so
 *     C(alpha) = 2 integral_0^1 v^{alpha} dv = 2/(alpha+1),
 * and the quadrature reproduces the closed form to < 1e-6 across alpha in {0.3, 0.4, 0.5, 0.6, 0.7}.
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * DERIVATION / MEASUREMENT ONLY, at fixed z_0* = i eps on the model cusp, generalizing only the eps^0
 * tail tier. It does NOT re-derive the leading eps^{-3/2} amplitude for general alpha and it is NOT
 * the uniform ANALYTIC tracking of C_ren that H4 needs (imp-33766). H4 is NOT discharged.
 * G6a_shock_lipschitz STAYS OPEN. No positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0
 * UNTOUCHED. NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 *
 * @see imp-33853-cren-gap-coefficient-closed-form (DERIVED the 4/3 coefficient at alpha = 1/2; this generalizes to C(alpha))
 * @see imp-33845-cren-gap-onset-rate (MEASURED the 3/2 onset and 4/3 amplitude numerically)
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (leading amplitude C_PS = pi/sqrt(2), special to alpha = 1/2)
 */

// Closed-form general-alpha tail coefficient: C(alpha) = integral_{|x|>1} |x|^{-alpha}/x^2 dx = 2/(alpha+1).
function cOfAlpha(alpha) {
  return 2 / (alpha + 1);
}

// Independent Simpson cross-check: C(alpha) = 2 * integral_0^1 v^{alpha} dv (via x = 1/v).
const N_PANELS = 20000;
function cByQuadrature(alpha) {
  const h = 1 / N_PANELS;
  let s = 0;
  for (let i = 0; i <= N_PANELS; i++) {
    const v = i * h;
    const w = i === 0 || i === N_PANELS ? 1 : i % 2 === 1 ? 4 : 2;
    s += w * Math.pow(v, alpha); // integrand v^{alpha}
  }
  return 2 * ((s * h) / 3); // 2 * integral_0^1 v^{alpha} dv = 2/(alpha+1)
}

// Sweep alpha near 1/2: closed form vs independent quadrature.
const ALPHA_GRID = [0.3, 0.4, 0.5, 0.6, 0.7];
const SWEEP = ALPHA_GRID.map((alpha) => {
  const closed = cOfAlpha(alpha);
  const quad = cByQuadrature(alpha);
  return {
    alpha,
    C_closed: +closed.toFixed(9),
    C_quadrature: +quad.toFixed(9),
    residual: +Math.abs(closed - quad).toExponential(3),
    dCdAlpha: +(-2 / Math.pow(alpha + 1, 2)).toFixed(6), // absolute slope
    logSensitivity: +(-alpha / (alpha + 1)).toFixed(6), // d ln C / d ln alpha
  };
});

const AT_HALF = SWEEP.find((r) => r.alpha === 0.5);
const C_AT_HALF = cOfAlpha(0.5); // = 4/3 exactly
const MAX_QUAD_RESIDUAL = Math.max(...SWEEP.map((r) => r.residual));
// Smooth + strictly decreasing across the sweep (no knife-edge at alpha = 1/2).
const STRICTLY_DECREASING = SWEEP.every(
  (r, i) => i === 0 || r.C_closed < SWEEP[i - 1].C_closed,
);
// Coefficient ranges over the open interval (1, 2) across the Holder window alpha in (0, 1).
const C_ENDPOINT_ALPHA0 = cOfAlpha(0); // -> 2
const C_ENDPOINT_ALPHA1 = cOfAlpha(1); // -> 1

export const IMP33882_CUSP_EXPONENT_ONSET_COEFFICIENT_ROBUSTNESS = {
  id: 'imp-33882',
  proofSection: 'S-frontier',
  scopes:
    'Assess robustness of the imp-33853 derived 4/3 finite-window onset coefficient to the cusp exponent ' +
    'by re-running the outside-the-window tail integral for the general Holder cusp rho(x) = |x|^{-alpha}, ' +
    'reporting C(alpha) = 2/(alpha+1) and whether 4/3 is special to alpha = 1/2',
  question:
    'Is the imp-33853 onset coefficient 4/3 a knife-edge of the alpha = 1/2 Holder exponent, or a smooth ' +
    'function C(alpha) of it? Derivation/measurement only; does NOT discharge H4; G6a OPEN; imp-3066 untouched; NO QED.',

  cuspModel: 'rho(x) = |x|^{-alpha} on [-1, 1], general Holder exponent alpha (alpha = 1/2 is the imp-33853 model)',
  tailIntegralClosedForm:
    'C(alpha) = integral_{|x|>1} |x|^{-alpha}/x^2 dx = 2 integral_1^{inf} x^{-(alpha+2)} dx = 2/(alpha+1)',
  convergenceCondition: 'alpha + 1 > 0 (alpha > -1); Holder cusp density integrable at x = 0 for alpha < 1',

  // (i) reproduces the imp-33853 coefficient at alpha = 1/2.
  coefficientAtHalf: +C_AT_HALF.toFixed(9), // 4/3 = 1.333333333
  matchesImp33853: Math.abs(C_AT_HALF - 4 / 3) < 1e-12,

  // (ii) 4/3 is NOT special: C(alpha) is smooth, strictly decreasing, ranges over (1, 2).
  fourThirdsIsKnifeEdge: false,
  cFunctionSmoothStrictlyDecreasing: STRICTLY_DECREASING,
  coefficientRange: '(1, 2) over the Holder window alpha in (0, 1)',
  cAtAlpha0: +C_ENDPOINT_ALPHA0.toFixed(6), // -> 2
  cAtAlpha1: +C_ENDPOINT_ALPHA1.toFixed(6), // -> 1

  // (iii) sensitivity at alpha = 1/2.
  slopeAtHalf: AT_HALF.dCdAlpha, // dC/dalpha = -8/9 ~ -0.888889
  logSensitivityAtHalf: AT_HALF.logSensitivity, // d ln C / d ln alpha = -1/3 ~ -0.333333
  sensitivityVerdict:
    'mild, well-conditioned: a 1% change in the cusp exponent shifts the onset coefficient by only ~0.33%',

  // (iv) independent quadrature cross-check across the sweep.
  sweep: SWEEP,
  maxQuadratureResidual: +MAX_QUAD_RESIDUAL.toExponential(3), // < 1e-6

  dischargesH4: false,
  isRigorous: false,
  verdict:
    'DERIVATION / MEASUREMENT ONLY, G6a_shock_lipschitz STAYS OPEN. Re-running the imp-33853 outside-the-' +
    'window tail integral for the general Holder cusp rho(x) = |x|^{-alpha} gives the closed form ' +
    'C(alpha) = integral_{|x|>1} |x|^{-alpha}/x^2 dx = 2 integral_1^{inf} x^{-(alpha+2)} dx = 2/(alpha+1), ' +
    'which converges for alpha > -1 and equals 4/3 at alpha = 1/2 -- reproducing imp-33853 exactly. The 4/3 ' +
    'is NOT a knife-edge of alpha = 1/2: C(alpha) is a smooth, strictly decreasing, convex rational function ' +
    'ranging over (1, 2) across the Holder window alpha in (0, 1) (C -> 2 as alpha -> 0, C -> 1 as alpha -> 1), ' +
    'with 4/3 in the interior. The alpha = 1/2 exponent is distinguished only for the LEADING eps^{-3/2} ' +
    'amplitude tier (which pins C_PS = pi/sqrt(2) via the Gamma(1/4)Gamma(3/4) collapse), not for the eps^0 ' +
    'onset coefficient. Sensitivity at alpha = 1/2 is mild: dC/dalpha = -8/9 ~ -0.889 and the logarithmic ' +
    'sensitivity d ln C / d ln alpha = -1/3, so a 1% cusp-exponent perturbation moves the coefficient by only ' +
    '~0.33%. The closed form is cross-checked by an independent Simpson quadrature (x = 1/v map) at ' +
    'alpha in {0.3, 0.4, 0.5, 0.6, 0.7} to < 1e-6. This does NOT re-derive the leading amplitude for general ' +
    'alpha and does NOT DISCHARGE H4: a general-alpha finite-window onset coefficient at fixed z_0* = i eps is ' +
    'not the uniform ANALYTIC tracking of C_ren the H4 minimal-input condition requires (imp-33766). No ' +
    'positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; NO QED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains the rigorous SOTA.',
};

export const IMP33882_CUSP_EXPONENT_ONSET_COEFFICIENT_ASSERTIONS = [
  {
    // (i) the general-alpha closed form reproduces the imp-33853 coefficient exactly at alpha = 1/2.
    id: 'imp33882-c-of-half-is-four-thirds',
    description: 'C(alpha) = 2/(alpha+1) equals 4/3 at alpha = 1/2, reproducing imp-33853',
    holds: () =>
      IMP33882_CUSP_EXPONENT_ONSET_COEFFICIENT_ROBUSTNESS.matchesImp33853 === true &&
      Math.abs(IMP33882_CUSP_EXPONENT_ONSET_COEFFICIENT_ROBUSTNESS.coefficientAtHalf - 4 / 3) < 1e-6,
  },
  {
    // (ii) 4/3 is NOT a knife-edge: C(alpha) is smooth, strictly decreasing across the sweep and ranges (1, 2).
    id: 'imp33882-four-thirds-not-special',
    description: 'C(alpha) is smooth and strictly decreasing (no knife-edge at alpha = 1/2); range (1, 2)',
    holds: () =>
      IMP33882_CUSP_EXPONENT_ONSET_COEFFICIENT_ROBUSTNESS.fourThirdsIsKnifeEdge === false &&
      IMP33882_CUSP_EXPONENT_ONSET_COEFFICIENT_ROBUSTNESS.cFunctionSmoothStrictlyDecreasing === true &&
      Math.abs(IMP33882_CUSP_EXPONENT_ONSET_COEFFICIENT_ROBUSTNESS.cAtAlpha0 - 2) < 1e-9 &&
      Math.abs(IMP33882_CUSP_EXPONENT_ONSET_COEFFICIENT_ROBUSTNESS.cAtAlpha1 - 1) < 1e-9,
  },
  {
    // (iii) independent quadrature cross-check matches the closed form to < 1e-6 across the alpha sweep.
    id: 'imp33882-quadrature-cross-check',
    description: 'Simpson quadrature reproduces C(alpha) = 2/(alpha+1) to < 1e-6 across alpha near 1/2',
    holds: () => IMP33882_CUSP_EXPONENT_ONSET_COEFFICIENT_ROBUSTNESS.maxQuadratureResidual < 1e-6,
  },
  {
    // (iv) sensitivity at alpha = 1/2 matches the analytic slope -8/9 and log-sensitivity -1/3.
    id: 'imp33882-sensitivity-well-conditioned',
    description: 'dC/dalpha = -8/9 and d ln C/d ln alpha = -1/3 at alpha = 1/2 (mild, well-conditioned)',
    holds: () =>
      Math.abs(IMP33882_CUSP_EXPONENT_ONSET_COEFFICIENT_ROBUSTNESS.slopeAtHalf - -8 / 9) < 1e-4 &&
      Math.abs(IMP33882_CUSP_EXPONENT_ONSET_COEFFICIENT_ROBUSTNESS.logSensitivityAtHalf - -1 / 3) < 1e-4,
  },
  {
    // Honesty gate: derivation only, does NOT discharge H4; G6a OPEN, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp33882-honesty-gate-no-qed',
    description: 'Derivation only: does not discharge H4, G6a stays OPEN, no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP33882_CUSP_EXPONENT_ONSET_COEFFICIENT_ROBUSTNESS.isRigorous === false &&
      IMP33882_CUSP_EXPONENT_ONSET_COEFFICIENT_ROBUSTNESS.dischargesH4 === false &&
      /NO QED/.test(IMP33882_CUSP_EXPONENT_ONSET_COEFFICIENT_ROBUSTNESS.verdict) &&
      /STAYS OPEN/.test(IMP33882_CUSP_EXPONENT_ONSET_COEFFICIENT_ROBUSTNESS.verdict) &&
      /remains the rigorous SOTA/.test(IMP33882_CUSP_EXPONENT_ONSET_COEFFICIENT_ROBUSTNESS.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(
        IMP33882_CUSP_EXPONENT_ONSET_COEFFICIENT_ROBUSTNESS.verdict,
      ),
  },
];

for (const a of IMP33882_CUSP_EXPONENT_ONSET_COEFFICIENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33882-cusp-exponent-onset-coefficient-robustness assertion failed: ${a.id}`);
  }
}
