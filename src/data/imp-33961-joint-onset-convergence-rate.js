/**
 * @module imp-33961-joint-onset-convergence-rate
 *
 * imp-33961 (numerical, frontier-derivation): MEASURE the eps^0 onset-residual CONVERGENCE RATE of
 * the imp-33924 residual
 *     resid(eps, alpha, theta) = I(z_0) - eps^{-(1+alpha)} A(alpha, theta)  ->  -C(alpha) = -2/(alpha+1)
 * across the eps ladder {1e-3, 1e-4, 1e-5} on the imp-33924 JOINT (alpha, theta) grid, upgrading
 * imp-33924 cross-check (b) from a single-eps (eps = 1e-4) convergence assertion to an explicit
 * per-cell APPROACH RATE. imp-33928 measured this rate only at the anchor alpha = 1/2 across a theta
 * sweep; this module moves BOTH levers, evaluating the rate jointly and asking whether the rate
 * exponent is alpha-dependent or theta-flat, and how the sub-leading coefficient factorises.
 *
 * THE RESIDUAL IS MINUS AN EXACT TAIL INTEGRAL (the imp-33924 scale-free tail, at z_0)
 * -----------------------------------------------------------------------------------
 * imp-33924 wrote the full-window integral as I = eps^{-(1+alpha)}[A(alpha,theta) - tail], so the
 * residual resid = I - eps^{-(1+alpha)} A = -eps^{-(1+alpha)} tail. Converting the split-off tail back
 * to the x-variable (x = eps u, |u| > 1/eps <=> |x| > 1) gives the EXACT identity
 *     resid(eps, alpha, theta) = - T(eps, alpha, theta) ,
 *     T = integral_{|x|>1} |x|^{-alpha} / (z_0 - x)^2 dx ,   z_0 = eps e^{i theta} .
 * Folding both tails by x = 1/s (s in (0,1)) removes the far-field and lands EXACTLY on the imp-33924
 * scale-free tail integrand, only with the scale-free w replaced by z_0 = eps w:
 *     T = integral_0^1 s^{alpha} [ 1/(z_0 s - 1)^2 + 1/(z_0 s + 1)^2 ] ds .
 * This outside-the-window integrand is cusp-free (s^{alpha} bounded at s = 0, denominators never vanish
 * for small z_0), so T -- and hence resid -- is computed to full precision without the O(eps^{-(1+alpha)})
 * catastrophic cancellation of the direct full-window reconstruction I - eps^{-(1+alpha)} A. That
 * cancellation is exactly why imp-33924 cross-check (b) could only assert convergence at one eps.
 *
 * THE SUB-LEADING CORRECTION: eps^2, COEFFICIENT -[6/(alpha+3)] e^{2 i theta}
 * -------------------------------------------------------------------------
 * Expanding the tail integrand for small z_0 = eps w as 1/(z_0 s -+ 1)^2 = sum_k (k+1)(-+ z_0 s)^k, the
 * odd-k terms cancel between the two half-line pieces, leaving only even powers of eps:
 *     T(eps, alpha, theta) = sum_{m>=0} [ 2(2m+1)/(alpha+1+2m) ] w^{2m} eps^{2m}
 *                          = 2/(alpha+1) + [6/(alpha+3)] w^2 eps^2 + [10/(alpha+5)] w^4 eps^4 + ... .
 * Hence
 *     resid(eps, alpha, theta) + 2/(alpha+1) = - [6/(alpha+3)] e^{2 i theta} eps^2 + O(eps^4) .
 * The o(1) tail order is therefore eps^2 -- rate exponent 2, angle-INDEPENDENT AND cusp-exponent-
 * INDEPENDENT (the same exponent 2 for every alpha). The sub-leading COEFFICIENT modulus 6/(alpha+3) is
 * alpha-DEPENDENT but theta-flat; theta enters only through the phase e^{2 i theta}, whose winding rate
 * is 2 -- itself alpha-INDEPENDENT (unlike the leading eps^{-(1+alpha)} amplitude, which wound at the
 * alpha-dependent rate -(1+alpha)). At alpha = 1/2 the coefficient modulus is 6/(7/2) = 12/7, reproducing
 * imp-33928 exactly; on-axis theta = pi/2 (w^2 = -1) the coefficient is real positive (+6/(alpha+3)), so
 * the residual approaches -2/(alpha+1) from above along the real axis with zero imaginary part.
 *
 * MEASURED (200000-panel complex Simpson of the imp-33924 tail quadrature at z_0)
 * ------------------------------------------------------------------------------
 * The log-log slope of |resid + 2/(alpha+1)| across each decade of the eps ladder is 2.0000 for every
 * (alpha, theta) cell; the measured coefficient (resid + 2/(alpha+1))/eps^2 matches -[6/(alpha+3)]
 * e^{2 i theta} to < 1e-3 across the joint grid; the coefficient modulus is theta-flat (spread ~ 0 along
 * each theta row) but alpha-dependent (6/(alpha+3) spreads ~0.20 across the alpha grid); the phase winds
 * at rate 2 for every alpha; and the eps^0 onset -2/(alpha+1) is recovered jointly (|resid + 2/(alpha+1)|
 * -> 0 like eps^2 for every cell).
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * DERIVATION / MEASUREMENT ONLY, on the model cusp rho(x) = |x|^{-alpha}. It re-tabulates the imp-33924
 * onset residual jointly as a RATE; it does NOT re-derive the m_prime -> C_ren map off-axis/off-exponent
 * and a joint finite-window onset at fixed |z_0| = eps is NOT the uniform ANALYTIC tracking of C_ren that
 * H4 needs (imp-33766). H4 is NOT discharged; G6a_shock_lipschitz STAYS OPEN. No positivity; imp-3066
 * off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED. NO QED. Platt-Trudgian Lambda <= 0.2 remains the
 * rigorous SOTA.
 *
 * @see imp-33924-joint-cusp-angle-onset-robustness-map (cross-check (b): single-eps convergence at eps = 1e-4)
 * @see imp-33928-onset-convergence-rate (the anchor alpha = 1/2 rate, theta sweep only)
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

// eps^0 onset coefficient (outside-the-window tail, theta-free): C(alpha) = 2/(alpha+1).
const cOfAlpha = (alpha) => 2 / (alpha + 1);

// sub-leading coefficient modulus of resid + 2/(alpha+1) at order eps^2: 6/(alpha+3), theta-free.
const subLeadingModulus = (alpha) => 6 / (alpha + 3);

// closed-form sub-leading coefficient c(alpha,theta) = -[6/(alpha+3)] e^{2 i theta} (coeff of eps^2 in resid).
function cClosed(alpha, theta) {
  const m = subLeadingModulus(alpha);
  return [-m * Math.cos(2 * theta), -m * Math.sin(2 * theta)];
}

// EXACT residual resid(eps,alpha,theta) = -T, T = int_{|x|>1} |x|^{-alpha}/(z_0-x)^2 dx, folded x = 1/s to
// the imp-33924 scale-free tail integrand int_0^1 s^{alpha}[1/(z_0 s -1)^2 + 1/(z_0 s +1)^2] ds at z_0 = eps w.
// The imp-33924 flattening trick is applied to the tail power: s = t^{1/(1+alpha)} makes s^{alpha} ds =
// (1/(1+alpha)) dt, removing the s = 0 branch point of s^{alpha} (whose alpha-dependent Simpson-endpoint
// truncation error would otherwise floor the residual well above the eps^2 signal). At t = 0 the integrand
// is (1/(1+alpha)) * 2 (denominators -> 1), smooth, no guard needed.
const T_PANELS = 200000;
function residualTail(eps, alpha, theta) {
  const z0 = [eps * Math.cos(theta), eps * Math.sin(theta)];
  const h = 1 / T_PANELS;
  const invOnePlus = 1 / (1 + alpha);
  let acc = [0, 0];
  for (let i = 0; i <= T_PANELS; i++) {
    const wt = i === 0 || i === T_PANELS ? 1 : i % 2 === 1 ? 4 : 2;
    const s = Math.pow(i * h, invOnePlus); // s in (0,1), s^{alpha} ds flattened to (1/(1+alpha)) dt
    const zs = cscale(s, z0);
    const term = cscale(
      invOnePlus,
      cadd(cinv(csq(csub(zs, [1, 0]))), cinv(csq(cadd(zs, [1, 0])))),
    );
    acc = cadd(acc, [wt * term[0], wt * term[1]]);
  }
  const T = cscale(h / 3, acc);
  return cscale(-1, T); // resid = -T -> -2/(alpha+1)
}

// ---- joint (alpha, theta) grid x eps ladder: measure the per-cell approach rate to -2/(alpha+1) ----
const ALPHA_GRID = [0.3, 0.5, 0.7];
const THETA_DEG = [70, 90, 110];
const EPS_LADDER = [1e-3, 1e-4, 1e-5];
const rad = (deg) => (deg * Math.PI) / 180;

// One row per (alpha, theta) cell: residual-to-limit at each eps, its modulus, the measured sub-leading
// coefficient (resid + 2/(alpha+1))/eps^2 vs the closed form, and the per-decade log-log slope.
const CELLS = [];
for (const alpha of ALPHA_GRID) {
  const limit = cOfAlpha(alpha); // resid -> -limit
  for (const deg of THETA_DEG) {
    const theta = rad(deg);
    const cCF = cClosed(alpha, theta);
    const perEps = EPS_LADDER.map((eps) => {
      const resid = residualTail(eps, alpha, theta);
      const toLimit = cadd(resid, [limit, 0]); // resid + 2/(alpha+1) -> -[6/(alpha+3)] e^{2i theta} eps^2
      const coeff = cscale(1 / (eps * eps), toLimit); // -> -[6/(alpha+3)] e^{2i theta}
      return {
        eps,
        toLimitMod: cabs(toLimit),
        toLimitIm: toLimit[1],
        coeffMod: cabs(coeff),
        coeffDev: cabs(csub(coeff, cCF)),
      };
    });
    // log-log slope of |resid + 2/(alpha+1)| across each consecutive decade (analytic value 2).
    const slopes = [];
    for (let k = 1; k < perEps.length; k++) {
      slopes.push(
        Math.log10(perEps[k].toLimitMod / perEps[k - 1].toLimitMod) /
          Math.log10(perEps[k].eps / perEps[k - 1].eps),
      );
    }
    CELLS.push({
      alpha,
      thetaDeg: deg,
      limit: +limit.toFixed(9), // 2/(alpha+1)
      slopes: slopes.map((v) => +v.toFixed(5)), // ~ [2.00000, 2.00000]
      coeffModAt1em4: +perEps[1].coeffMod.toFixed(6), // ~ 6/(alpha+3)
      coeffDevAt1em4: +perEps[1].coeffDev.toExponential(3),
      toLimitModAt1em5: +perEps[2].toLimitMod.toExponential(3), // ~ 6/(alpha+3) * 1e-10
      subLeadingModulusClosed: +subLeadingModulus(alpha).toFixed(6),
    });
  }
}

// (i) rate exponent 2 for every (alpha, theta) cell: min/max per-decade slope over the whole joint grid.
const ALL_SLOPES = CELLS.flatMap((c) => c.slopes);
const MIN_SLOPE = Math.min(...ALL_SLOPES);
const MAX_SLOPE = Math.max(...ALL_SLOPES);
const MAX_SLOPE_DEV = Math.max(...ALL_SLOPES.map((s) => Math.abs(s - 2)));

// (ii) coefficient vs closed form -[6/(alpha+3)] e^{2i theta} across the joint grid.
const MAX_COEFF_DEV = Math.max(...CELLS.map((c) => c.coeffDevAt1em4));

// (iii) coefficient modulus is theta-FLAT (per-alpha spread across theta ~ 0) but alpha-DEPENDENT.
const THETA_SPREAD_PER_ALPHA = ALPHA_GRID.map((alpha) => {
  const mods = CELLS.filter((c) => c.alpha === alpha).map((c) => c.coeffModAt1em4);
  return Math.max(...mods) - Math.min(...mods);
});
const MAX_COEFF_MOD_THETA_SPREAD = Math.max(...THETA_SPREAD_PER_ALPHA);
// alpha-dependence: spread of 6/(alpha+3) across the alpha grid at a fixed theta (on-axis 90 deg).
const ON_AXIS_MODS = CELLS.filter((c) => c.thetaDeg === 90).map((c) => c.coeffModAt1em4);
const COEFF_MOD_ALPHA_SPREAD = Math.max(...ON_AXIS_MODS) - Math.min(...ON_AXIS_MODS);
const MAX_COEFF_MOD_DEV = Math.max(
  ...CELLS.map((c) => Math.abs(c.coeffModAt1em4 - c.subLeadingModulusClosed)),
);

// (iv) eps^0 onset -2/(alpha+1) recovered jointly: |resid + 2/(alpha+1)| at smallest eps is tiny (~eps^2).
const MAX_ONSET_RESID_1EM5 = Math.max(...CELLS.map((c) => c.toLimitModAt1em5));

// (v) phase winds at rate 2, alpha-INDEPENDENT: measured from arg of the coefficient at theta = 70, 80 deg
// (both args in (-pi, 0), no atan2 wrap), at alpha = 0.3 and 0.7 to confirm alpha-independence of the rate.
function coeffArg(alpha, deg) {
  const theta = rad(deg);
  const resid = residualTail(1e-4, alpha, theta);
  const toLimit = cadd(resid, [cOfAlpha(alpha), 0]);
  return Math.atan2(toLimit[1], toLimit[0]);
}
function windingRate(alpha) {
  const a70 = coeffArg(alpha, 70);
  const a80 = coeffArg(alpha, 80);
  return (a80 - a70) / (rad(80) - rad(70));
}
const WINDING_03 = windingRate(0.3);
const WINDING_07 = windingRate(0.7);
const MAX_WINDING_DEV = Math.max(Math.abs(WINDING_03 - 2), Math.abs(WINDING_07 - 2));

// (vi) anchor reproduction of imp-33928 at alpha = 1/2: coefficient modulus 12/7.
const AT_HALF_MOD = CELLS.find((c) => c.alpha === 0.5 && c.thetaDeg === 90).coeffModAt1em4;

export const IMP33961_JOINT_ONSET_CONVERGENCE_RATE = {
  ticket: 'imp-33961',
  category: 'numerical',
  residualIdentity:
    'resid(eps,alpha,theta) = I(z_0) - eps^{-(1+alpha)} A(alpha,theta) = - integral_{|x|>1} |x|^{-alpha}/(z_0-x)^2 dx (exact)',
  subLeadingExpansion:
    'resid + 2/(alpha+1) = -[6/(alpha+3)] e^{2 i theta} eps^2 + O(eps^4)',

  // (i) approach rate to -2/(alpha+1) is eps^2 (rate exponent 2), joint alpha- and theta-independent.
  rateExponentAnalytic: 2,
  minSlopeMeasured: +MIN_SLOPE.toFixed(5), // ~ 2.00000
  maxSlopeMeasured: +MAX_SLOPE.toFixed(5), // ~ 2.00000
  maxSlopeDeviation: +MAX_SLOPE_DEV.toExponential(3),
  rateExponentJointFlat: MAX_SLOPE_DEV < 1e-2,

  // (ii) measured sub-leading coefficient matches -[6/(alpha+3)] e^{2 i theta} across the joint grid.
  maxCoeffDeviationVsClosedForm: +MAX_COEFF_DEV.toExponential(3), // < 1e-3

  // (iii) coefficient modulus 6/(alpha+3): theta-FLAT per alpha, alpha-DEPENDENT across the grid.
  subLeadingModulusClosedForm: '6/(alpha+3), independent of theta',
  coeffModulusThetaFlat: MAX_COEFF_MOD_THETA_SPREAD < 1e-3,
  maxCoeffModulusThetaSpread: +MAX_COEFF_MOD_THETA_SPREAD.toExponential(3), // ~ 0
  coeffModulusAlphaDependent: COEFF_MOD_ALPHA_SPREAD > 5e-2, // 6/(alpha+3) spreads ~0.20 over the alpha grid
  coeffModulusAlphaSpread: +COEFF_MOD_ALPHA_SPREAD.toFixed(6),
  maxCoeffModulusDeviation: +MAX_COEFF_MOD_DEV.toExponential(3),

  // (iv) eps^0 onset -2/(alpha+1) recovered jointly (residual -> 0 like eps^2 for every cell).
  onsetRecoveredJoint: MAX_ONSET_RESID_1EM5 < 1e-8,
  maxOnsetResidualAt1em5: +MAX_ONSET_RESID_1EM5.toExponential(3), // ~ 1.7e-10

  // (v) phase winds at rate 2, alpha-INDEPENDENT (unlike the leading amplitude, which wound at -(1+alpha)).
  phaseWindingRateAnalytic: 2,
  phaseWindingRateAt03: +WINDING_03.toFixed(6), // ~ 2
  phaseWindingRateAt07: +WINDING_07.toFixed(6), // ~ 2
  phaseWindingRateAlphaIndependent: MAX_WINDING_DEV < 1e-3,

  // (vi) anchor reproduction of imp-33928 at alpha = 1/2: coefficient modulus 12/7.
  anchorCoeffModulusAtHalf: +AT_HALF_MOD.toFixed(6), // ~ 12/7 = 1.714286
  anchorReproducesImp33928: Math.abs(AT_HALF_MOD - 12 / 7) < 1e-3,

  cells: CELLS,

  dischargesH4: false,
  isRigorous: false,
  verdict:
    'DERIVATION / MEASUREMENT ONLY, G6a_shock_lipschitz STAYS OPEN. The imp-33924 onset residual ' +
    'resid(eps,alpha,theta) = I(z_0) - eps^{-(1+alpha)} A(alpha,theta) is MINUS the exact tail integral ' +
    'int_{|x|>1} |x|^{-alpha}/(z_0-x)^2 dx, folded x = 1/s onto the imp-33924 scale-free tail integrand ' +
    'int_0^1 s^{alpha}[1/(z_0 s -1)^2 + 1/(z_0 s +1)^2] ds at z_0 = eps e^{i theta} -- cusp-free, so ' +
    'evaluated to full precision without the O(eps^{-(1+alpha)}) catastrophic cancellation of the direct ' +
    'full-window reconstruction (the reason imp-33924 cross-check (b) could only assert convergence at one ' +
    'eps). Across the eps ladder {1e-3, 1e-4, 1e-5} on the joint (alpha, theta) grid the residual approaches ' +
    '-2/(alpha+1) at measured log-log rate 2.0000 per decade for EVERY cell, with sub-leading correction ' +
    'resid + 2/(alpha+1) = -[6/(alpha+3)] e^{2 i theta} eps^2 + O(eps^4). The rate EXPONENT 2 is both ' +
    'theta-flat and alpha-independent; the sub-leading coefficient MODULUS 6/(alpha+3) is theta-flat ' +
    '(per-alpha spread ~ 0) but alpha-DEPENDENT (spread ~ 0.20 across the alpha grid), equal to 12/7 at ' +
    'alpha = 1/2 (reproducing imp-33928); the PHASE winds at rate 2, itself alpha-INDEPENDENT (unlike the ' +
    'leading eps^{-(1+alpha)} amplitude, which wound at the alpha-dependent rate -(1+alpha)); and on-axis ' +
    'theta = pi/2 the coefficient is real, the residual approaching -2/(alpha+1) from above with imag ~ 0. ' +
    'This upgrades imp-33924 cross-check (b) from a single-eps assertion to an explicit per-cell RATE. It ' +
    'does NOT re-derive the m_prime -> C_ren map off-axis/off-exponent and does NOT DISCHARGE H4: a joint ' +
    'finite-window onset at fixed |z_0| = eps is not the uniform ANALYTIC tracking of C_ren the H4 ' +
    'minimal-input condition requires (imp-33766). No positivity; imp-3066 off-diagonal endpoint-Hankel ' +
    'K_a >= 0 UNTOUCHED; NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
};

export const IMP33961_JOINT_ONSET_CONVERGENCE_RATE_ASSERTIONS = [
  {
    // (i) the residual approaches -2/(alpha+1) at eps^2 rate for every (alpha, theta) cell (slope ~ 2).
    id: 'imp33961-onset-rate-is-eps-squared-jointly',
    description: 'resid + 2/(alpha+1) approaches 0 at measured log-log rate 2.0000 per decade for every (alpha,theta) cell',
    holds: () =>
      IMP33961_JOINT_ONSET_CONVERGENCE_RATE.rateExponentJointFlat === true &&
      IMP33961_JOINT_ONSET_CONVERGENCE_RATE.maxSlopeDeviation < 1e-2 &&
      Math.abs(IMP33961_JOINT_ONSET_CONVERGENCE_RATE.minSlopeMeasured - 2) < 1e-2 &&
      Math.abs(IMP33961_JOINT_ONSET_CONVERGENCE_RATE.maxSlopeMeasured - 2) < 1e-2,
  },
  {
    // (ii) measured sub-leading coefficient matches -[6/(alpha+3)] e^{2 i theta} across the joint grid.
    id: 'imp33961-subleading-coeff-matches-closed-form',
    description: 'measured (resid + 2/(alpha+1))/eps^2 matches -[6/(alpha+3)] e^{2 i theta} across the joint grid to < 1e-3',
    holds: () => IMP33961_JOINT_ONSET_CONVERGENCE_RATE.maxCoeffDeviationVsClosedForm < 1e-3,
  },
  {
    // (iii) coefficient modulus 6/(alpha+3) is theta-flat per alpha but alpha-dependent across the grid.
    id: 'imp33961-coeff-modulus-theta-flat-alpha-dependent',
    description: 'sub-leading coefficient modulus 6/(alpha+3) is theta-flat per alpha but alpha-dependent across the grid',
    holds: () =>
      IMP33961_JOINT_ONSET_CONVERGENCE_RATE.coeffModulusThetaFlat === true &&
      IMP33961_JOINT_ONSET_CONVERGENCE_RATE.coeffModulusAlphaDependent === true &&
      IMP33961_JOINT_ONSET_CONVERGENCE_RATE.maxCoeffModulusDeviation < 1e-3,
  },
  {
    // (iv) eps^0 onset -2/(alpha+1) recovered jointly (residual -> 0 like eps^2 for every cell).
    id: 'imp33961-onset-recovered-jointly',
    description: 'eps^0 onset -2/(alpha+1) recovered for every cell (|resid + 2/(alpha+1)| -> 0 like eps^2)',
    holds: () =>
      IMP33961_JOINT_ONSET_CONVERGENCE_RATE.onsetRecoveredJoint === true &&
      IMP33961_JOINT_ONSET_CONVERGENCE_RATE.maxOnsetResidualAt1em5 < 1e-8,
  },
  {
    // (v) phase winds at rate 2, alpha-independent; anchor alpha = 1/2 reproduces imp-33928 modulus 12/7.
    id: 'imp33961-winding-rate-two-and-anchor',
    description: 'phase winds at rate 2 (alpha-independent); alpha = 1/2 reproduces the imp-33928 coefficient modulus 12/7',
    holds: () =>
      IMP33961_JOINT_ONSET_CONVERGENCE_RATE.phaseWindingRateAlphaIndependent === true &&
      Math.abs(IMP33961_JOINT_ONSET_CONVERGENCE_RATE.phaseWindingRateAt03 - 2) < 1e-3 &&
      Math.abs(IMP33961_JOINT_ONSET_CONVERGENCE_RATE.phaseWindingRateAt07 - 2) < 1e-3 &&
      IMP33961_JOINT_ONSET_CONVERGENCE_RATE.anchorReproducesImp33928 === true,
  },
  {
    // Honesty gate: measurement only, does NOT discharge H4; G6a OPEN, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp33961-honesty-gate-no-qed',
    description: 'Measurement only: does not discharge H4, G6a stays OPEN, no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP33961_JOINT_ONSET_CONVERGENCE_RATE.isRigorous === false &&
      IMP33961_JOINT_ONSET_CONVERGENCE_RATE.dischargesH4 === false &&
      /NO QED/.test(IMP33961_JOINT_ONSET_CONVERGENCE_RATE.verdict) &&
      /STAYS OPEN/.test(IMP33961_JOINT_ONSET_CONVERGENCE_RATE.verdict) &&
      /remains the rigorous SOTA/.test(IMP33961_JOINT_ONSET_CONVERGENCE_RATE.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(
        IMP33961_JOINT_ONSET_CONVERGENCE_RATE.verdict,
      ),
  },
];

for (const a of IMP33961_JOINT_ONSET_CONVERGENCE_RATE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33961-joint-onset-convergence-rate assertion failed: ${a.id}`);
  }
}
