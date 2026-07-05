/**
 * @module imp-34002-eps4-subsubleading-onset-coefficient
 *
 * imp-34002 (numerical, frontier-derivation): MEASURE the eps^4 SUB-SUB-LEADING onset coefficient
 * of the imp-33924 residual, upgrading imp-33961 (which listed but measured only the eps^2 term) by
 * writing out the NEXT even power over the same imp-33924 (alpha, theta) grid and the same
 * 200000-panel complex-Simpson tail quadrature.
 *
 * THE TAIL EXPANSION (imp-33961), NEXT EVEN POWER
 * -----------------------------------------------
 * imp-33961 proved the onset residual equals MINUS the exact scale-free tail integral at z_0 = eps w,
 *     resid(eps, alpha, theta) = - T ,
 *     T = integral_0^1 s^{alpha} [ 1/(z_0 s - 1)^2 + 1/(z_0 s + 1)^2 ] ds ,   z_0 = eps e^{i theta} ,
 * and expanded 1/(z_0 s -+ 1)^2 = sum_k (k+1)(-+ z_0 s)^k. The odd-k terms cancel between the two
 * half-line pieces, leaving only even powers of eps:
 *     T = sum_{m>=0} [ 2(2m+1)/(alpha+1+2m) ] w^{2m} eps^{2m}
 *       = 2/(alpha+1) + [6/(alpha+3)] w^2 eps^2 + [10/(alpha+5)] w^4 eps^4 + ... .
 * imp-33961 MEASURED the m = 0 onset -2/(alpha+1) and the m = 1 coefficient -[6/(alpha+3)] e^{2 i theta}.
 * This module writes out the m = 2 term:
 *     resid + 2/(alpha+1) + [6/(alpha+3)] e^{2 i theta} eps^2
 *         = - [10/(alpha+5)] e^{4 i theta} eps^4 + O(eps^6) .
 * So the isolated sub-sub-leading residual approaches 0 at RATE EXPONENT 4 (angle- AND
 * cusp-exponent-independent), with coefficient MODULUS 10/(alpha+5) -- theta-flat but alpha-dependent --
 * and PHASE winding at rate 4 (itself alpha-independent). At alpha = 1/2 the modulus is 10/(11/2) =
 * 20/11 = 1.818182, and on-axis theta = pi/2 (w^4 = +1) the coefficient is real negative
 * (-10/(alpha+5)), so the eps^4 correction is real with zero imaginary part on the imaginary axis.
 *
 * THE FLOATING-POINT FLOOR OF THE DIRECT ISOLATION
 * ------------------------------------------------
 * Unlike the eps^2 term, the eps^4 term cannot be isolated down to the imp-33961 eps ladder
 * {1e-3, 1e-4, 1e-5}: forming resid + 2/(alpha+1) + [6/(alpha+3)] e^{2 i theta} eps^2 subtracts the
 * order-1 baseline -2/(alpha+1), whose double-precision reconstruction floor (~ 4e-16 absolute) buries
 * the eps^4 signal once eps^4 drops below it. At eps = 1e-4 the eps^4 term is ~ 1e-16, at/under the
 * floor. The signal is therefore measured on the SHIFTED half-decade ladder {1e-2, 3.1623e-3, 1e-3},
 * where eps^4 in {1e-8, 1e-10, 1e-12} stays above the baseline-subtraction floor: at the two top rungs
 * the recovered coefficient matches the closed form to ~ 2e-4, while the deepest rung (1e-3) already
 * shows the floor onset (deviation ~ 1e-2), reported honestly rather than hidden. The residual eps^6
 * tail (coefficient -[14/(alpha+7)] e^{6 i theta}) sets the other end of the window; at eps = 1e-2 it
 * contaminates the eps^4 coefficient at the ~ 1e-4 level, comparable to the floor at 1e-3.
 *
 * MEASURED (200000-panel complex Simpson of the imp-33961 tail quadrature at z_0)
 * ------------------------------------------------------------------------------
 * The log-log slope of the isolated |resid + 2/(alpha+1) + [6/(alpha+3)] e^{2 i theta} eps^2| across
 * the top half-decade is 4.0000 for every (alpha, theta) cell; the measured coefficient
 * (isolated)/eps^4 at eps = 1e-2 matches -[10/(alpha+5)] e^{4 i theta} to < 1e-3 across the joint grid;
 * the coefficient modulus is theta-flat (spread ~ 0 along each theta row) but alpha-dependent
 * (10/(alpha+5) spreads ~ 0.13 across the alpha grid); the phase winds at rate 4 for every alpha; and
 * the anchor alpha = 1/2 reproduces the modulus 20/11.
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * DERIVATION / MEASUREMENT ONLY, on the model cusp rho(x) = |x|^{-alpha}. It writes out one further term
 * of the imp-33961 onset expansion; it does NOT re-derive the m_prime -> C_ren map off-axis/off-exponent
 * and a joint finite-window onset at fixed |z_0| = eps is NOT the uniform ANALYTIC tracking of C_ren that
 * H4 needs (imp-33766). H4 is NOT discharged; G6a_shock_lipschitz STAYS OPEN. No positivity; imp-3066
 * off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED. NO QED. Platt-Trudgian Lambda <= 0.2 remains the
 * rigorous SOTA.
 *
 * @see imp-33961-joint-onset-convergence-rate (measured the eps^2 term; listed the eps^4 coefficient)
 * @see imp-33924-joint-cusp-angle-onset-robustness-map (the joint onset residual map)
 * @see imp-33928-onset-convergence-rate (the anchor alpha = 1/2 eps^2 rate)
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

// eps^2 sub-leading coefficient modulus (imp-33961): 6/(alpha+3), theta-free.
const subLeadingModulus = (alpha) => 6 / (alpha + 3);
// eps^4 sub-sub-leading coefficient modulus (this ticket): 10/(alpha+5), theta-free.
const subSubLeadingModulus = (alpha) => 10 / (alpha + 5);

// eps^2 closed-form coefficient c2 = -[6/(alpha+3)] e^{2 i theta} (subtracted to isolate the eps^4 term).
function c2Closed(alpha, theta) {
  const m = subLeadingModulus(alpha);
  return [-m * Math.cos(2 * theta), -m * Math.sin(2 * theta)];
}
// eps^4 closed-form coefficient c4 = -[10/(alpha+5)] e^{4 i theta} (the target of the measurement).
function c4Closed(alpha, theta) {
  const m = subSubLeadingModulus(alpha);
  return [-m * Math.cos(4 * theta), -m * Math.sin(4 * theta)];
}

// EXACT residual resid(eps,alpha,theta) = -T (imp-33961), folded x = 1/s to the imp-33924 scale-free tail
// integrand int_0^1 s^{alpha}[1/(z0 s -1)^2 + 1/(z0 s +1)^2] ds at z_0 = eps w, with the imp-33924
// flattening s = t^{1/(1+alpha)} removing the s = 0 branch point of s^{alpha}. Identical quadrature to
// imp-33961; at t = 0 the integrand is (1/(1+alpha)) * 2 (denominators -> 1), smooth, no guard needed.
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

// Isolated sub-sub-leading residual: resid + 2/(alpha+1) + [6/(alpha+3)] e^{2 i theta} eps^2, i.e.
// resid + 2/(alpha+1) - c2 * eps^2 (c2 is the NEGATIVE coefficient), which equals -[10/(alpha+5)] e^{4 i
// theta} eps^4 + O(eps^6). Subtracting the eps^0 and eps^2 analytic terms leaves the eps^4 signal.
function isolatedEps4(eps, alpha, theta) {
  const resid = residualTail(eps, alpha, theta);
  const withOnset = cadd(resid, [cOfAlpha(alpha), 0]); // -> c2 eps^2 + c4 eps^4 + ...
  return csub(withOnset, cscale(eps * eps, c2Closed(alpha, theta))); // -> c4 eps^4 + O(eps^6)
}

// ---- joint (alpha, theta) grid x SHIFTED half-decade eps ladder: measure the eps^4 coefficient -------
const ALPHA_GRID = [0.3, 0.5, 0.7];
const THETA_DEG = [70, 90, 110];
// Shifted UP vs imp-33961 {1e-3,1e-4,1e-5}: at those eps the eps^4 signal sits at/under the ~4e-16
// baseline-subtraction floor. Here eps^4 in {1e-8, 1e-10, 1e-12} clears the floor at the two top rungs.
const EPS_LADDER = [1e-2, 3.1622776601683795e-3, 1e-3];
const TOP = 0; // index of the top rung (eps = 1e-2), best floating-point headroom for the coefficient.
const rad = (deg) => (deg * Math.PI) / 180;

// One row per (alpha, theta) cell: isolated eps^4 residual at each eps, the measured coefficient
// (isolated)/eps^4 at the top rung vs the closed form -[10/(alpha+5)] e^{4 i theta}, the per-half-decade
// log-log slope of the isolated modulus (analytic value 4), and the deepest-rung floor deviation.
const CELLS = [];
for (const alpha of ALPHA_GRID) {
  for (const deg of THETA_DEG) {
    const theta = rad(deg);
    const c4CF = c4Closed(alpha, theta);
    const perEps = EPS_LADDER.map((eps) => {
      const iso = isolatedEps4(eps, alpha, theta);
      const coeff = cscale(1 / (eps * eps * eps * eps), iso); // -> -[10/(alpha+5)] e^{4 i theta}
      return {
        eps,
        isoMod: cabs(iso),
        coeff,
        coeffMod: cabs(coeff),
        coeffDev: cabs(csub(coeff, c4CF)),
      };
    });
    // log-log slope of the isolated |eps^4| residual across each consecutive half-decade (analytic 4).
    const slopes = [];
    for (let k = 1; k < perEps.length; k++) {
      slopes.push(
        Math.log10(perEps[k].isoMod / perEps[k - 1].isoMod) /
          Math.log10(perEps[k].eps / perEps[k - 1].eps),
      );
    }
    CELLS.push({
      alpha,
      thetaDeg: deg,
      slopeTopHalfDecade: +slopes[0].toFixed(5), // 1e-2 -> 3.16e-3, cleanest ~ 4.00000
      slopeDeepHalfDecade: +slopes[1].toFixed(5), // 3.16e-3 -> 1e-3, floor onset, still ~ 4
      coeffModAtTop: +perEps[TOP].coeffMod.toFixed(6), // ~ 10/(alpha+5)
      coeffDevAtTop: +perEps[TOP].coeffDev.toExponential(3), // < 1e-3
      coeffDevAtDeepest: +perEps[2].coeffDev.toExponential(3), // ~ 1e-2, the floor onset
      subSubLeadingModulusClosed: +subSubLeadingModulus(alpha).toFixed(6),
    });
  }
}

// (i) rate exponent 4 across the joint grid: min/max per-half-decade slope over both steps.
const ALL_SLOPES = CELLS.flatMap((c) => [c.slopeTopHalfDecade, c.slopeDeepHalfDecade]);
const TOP_SLOPES = CELLS.map((c) => c.slopeTopHalfDecade);
const MIN_SLOPE = Math.min(...ALL_SLOPES);
const MAX_SLOPE = Math.max(...ALL_SLOPES);
const MAX_SLOPE_DEV = Math.max(...ALL_SLOPES.map((s) => Math.abs(s - 4)));
const MAX_TOP_SLOPE_DEV = Math.max(...TOP_SLOPES.map((s) => Math.abs(s - 4)));

// (ii) coefficient vs closed form -[10/(alpha+5)] e^{4 i theta} at the top rung across the joint grid.
const MAX_COEFF_DEV_TOP = Math.max(...CELLS.map((c) => c.coeffDevAtTop));
const MAX_COEFF_DEV_DEEPEST = Math.max(...CELLS.map((c) => c.coeffDevAtDeepest));

// (iii) coefficient modulus is theta-FLAT (per-alpha spread across theta ~ 0) but alpha-DEPENDENT.
const THETA_SPREAD_PER_ALPHA = ALPHA_GRID.map((alpha) => {
  const mods = CELLS.filter((c) => c.alpha === alpha).map((c) => c.coeffModAtTop);
  return Math.max(...mods) - Math.min(...mods);
});
const MAX_COEFF_MOD_THETA_SPREAD = Math.max(...THETA_SPREAD_PER_ALPHA);
// alpha-dependence: spread of 10/(alpha+5) across the alpha grid at a fixed theta (on-axis 90 deg).
const ON_AXIS_MODS = CELLS.filter((c) => c.thetaDeg === 90).map((c) => c.coeffModAtTop);
const COEFF_MOD_ALPHA_SPREAD = Math.max(...ON_AXIS_MODS) - Math.min(...ON_AXIS_MODS);
const MAX_COEFF_MOD_DEV = Math.max(
  ...CELLS.map((c) => Math.abs(c.coeffModAtTop - c.subSubLeadingModulusClosed)),
);

// (iv) phase winds at rate 4, alpha-INDEPENDENT: measured from arg of the eps^4 coefficient at theta =
// 70, 80 deg (both args in (0, pi), no atan2 wrap) at eps = 1e-2, at alpha = 0.3 and 0.7.
function coeffArg(alpha, deg) {
  const iso = isolatedEps4(EPS_LADDER[TOP], alpha, rad(deg));
  return Math.atan2(iso[1], iso[0]);
}
function windingRate(alpha) {
  const a70 = coeffArg(alpha, 70);
  const a80 = coeffArg(alpha, 80);
  return (a80 - a70) / (rad(80) - rad(70));
}
const WINDING_03 = windingRate(0.3);
const WINDING_07 = windingRate(0.7);
const MAX_WINDING_DEV = Math.max(Math.abs(WINDING_03 - 4), Math.abs(WINDING_07 - 4));

// (v) anchor at alpha = 1/2: coefficient modulus 10/(11/2) = 20/11 = 1.818182.
const AT_HALF_MOD = CELLS.find((c) => c.alpha === 0.5 && c.thetaDeg === 90).coeffModAtTop;

export const IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT = {
  ticket: 'imp-34002',
  category: 'numerical',
  residualIdentity:
    'resid(eps,alpha,theta) = - integral_0^1 s^{alpha}[1/(z0 s -1)^2 + 1/(z0 s +1)^2] ds at z0 = eps e^{i theta} (imp-33961 exact)',
  subSubLeadingExpansion:
    'resid + 2/(alpha+1) + [6/(alpha+3)] e^{2 i theta} eps^2 = -[10/(alpha+5)] e^{4 i theta} eps^4 + O(eps^6)',

  // (i) the isolated eps^4 residual approaches 0 at rate exponent 4, joint alpha- and theta-independent.
  rateExponentAnalytic: 4,
  minSlopeMeasured: +MIN_SLOPE.toFixed(5), // ~ 4.00000
  maxSlopeMeasured: +MAX_SLOPE.toFixed(5), // ~ 4.00000
  maxSlopeDeviation: +MAX_SLOPE_DEV.toExponential(3), // < 2e-2 (deepest half-decade shows floor onset)
  maxTopSlopeDeviation: +MAX_TOP_SLOPE_DEV.toExponential(3), // < 1e-3 on the clean top half-decade
  rateExponentJointFlat: MAX_SLOPE_DEV < 2e-2,

  // (ii) measured eps^4 coefficient matches -[10/(alpha+5)] e^{4 i theta} at the top rung (eps = 1e-2).
  epsLadder: EPS_LADDER,
  topRungEps: EPS_LADDER[TOP],
  maxCoeffDeviationVsClosedFormAtTop: +MAX_COEFF_DEV_TOP.toExponential(3), // < 1e-3
  // Honest floating-point floor: at the deepest rung (eps = 1e-3) the eps^4 signal nears the ~4e-16
  // baseline-subtraction floor, so the coefficient there deviates ~ 1e-2 -- reported, not hidden.
  maxCoeffDeviationAtDeepestRung: +MAX_COEFF_DEV_DEEPEST.toExponential(3), // ~ 1e-2 floor onset

  // (iii) coefficient modulus 10/(alpha+5): theta-FLAT per alpha, alpha-DEPENDENT across the grid.
  subSubLeadingModulusClosedForm: '10/(alpha+5), independent of theta',
  coeffModulusThetaFlat: MAX_COEFF_MOD_THETA_SPREAD < 1e-3,
  maxCoeffModulusThetaSpread: +MAX_COEFF_MOD_THETA_SPREAD.toExponential(3), // ~ 0
  coeffModulusAlphaDependent: COEFF_MOD_ALPHA_SPREAD > 5e-2, // 10/(alpha+5) spreads ~0.13 over alpha grid
  coeffModulusAlphaSpread: +COEFF_MOD_ALPHA_SPREAD.toFixed(6),
  maxCoeffModulusDeviation: +MAX_COEFF_MOD_DEV.toExponential(3),

  // (iv) phase winds at rate 4, alpha-INDEPENDENT (one order up from the eps^2 winding rate 2).
  phaseWindingRateAnalytic: 4,
  phaseWindingRateAt03: +WINDING_03.toFixed(6), // ~ 4
  phaseWindingRateAt07: +WINDING_07.toFixed(6), // ~ 4
  phaseWindingRateAlphaIndependent: MAX_WINDING_DEV < 1e-3,

  // (v) anchor at alpha = 1/2: coefficient modulus 20/11 = 1.818182.
  anchorCoeffModulusAtHalf: +AT_HALF_MOD.toFixed(6), // ~ 20/11 = 1.818182
  anchorReproduces20Over11: Math.abs(AT_HALF_MOD - 20 / 11) < 1e-3,

  cells: CELLS,

  dischargesH4: false,
  isRigorous: false,
  verdict:
    'DERIVATION / MEASUREMENT ONLY, G6a_shock_lipschitz STAYS OPEN. Writing out the NEXT even power of ' +
    'the imp-33961 onset tail expansion T = 2/(alpha+1) + [6/(alpha+3)] w^2 eps^2 + [10/(alpha+5)] w^4 ' +
    'eps^4 + ..., the eps^4 sub-sub-leading residual resid + 2/(alpha+1) + [6/(alpha+3)] e^{2 i theta} ' +
    'eps^2 = -[10/(alpha+5)] e^{4 i theta} eps^4 + O(eps^6). Because isolating it subtracts the order-1 ' +
    'baseline -2/(alpha+1), the eps^4 signal cannot reach the imp-33961 eps ladder {1e-3,1e-4,1e-5} (there ' +
    'eps^4 is at/under the ~4e-16 double-precision baseline-subtraction floor); it is measured instead on ' +
    'the shifted half-decade ladder {1e-2, 3.1623e-3, 1e-3}. Across the joint (alpha, theta) grid the ' +
    'isolated residual falls at measured log-log rate 4.0000 per half-decade on the clean top step, the ' +
    'coefficient (isolated)/eps^4 at eps = 1e-2 matches -[10/(alpha+5)] e^{4 i theta} to < 1e-3, the ' +
    'coefficient MODULUS 10/(alpha+5) is theta-flat (per-alpha spread ~ 0) but alpha-DEPENDENT (spread ' +
    '~ 0.13 across the alpha grid), equal to 20/11 at alpha = 1/2; and the PHASE winds at rate 4, itself ' +
    'alpha-INDEPENDENT (one order up from the imp-33961 eps^2 winding rate 2). The deepest rung eps = 1e-3 ' +
    'already shows the floating-point floor onset (coefficient deviation ~ 1e-2), reported honestly. This ' +
    'upgrades imp-33961 from the eps^2 coefficient to the eps^4 term; a fifth-order (eps^6) tail persists. ' +
    'It does NOT re-derive the m_prime -> C_ren map off-axis/off-exponent and does NOT DISCHARGE H4: a ' +
    'joint finite-window onset at fixed |z_0| = eps is not the uniform ANALYTIC tracking of C_ren the H4 ' +
    'minimal-input condition requires (imp-33766). No positivity; imp-3066 off-diagonal endpoint-Hankel ' +
    'K_a >= 0 UNTOUCHED; NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
};

export const IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT_ASSERTIONS = [
  {
    // (i) the isolated eps^4 residual approaches 0 at rate exponent 4 for every (alpha, theta) cell.
    id: 'imp34002-onset-rate-is-eps-fourth-jointly',
    description:
      'isolated resid + 2/(alpha+1) + [6/(alpha+3)] e^{2 i theta} eps^2 approaches 0 at log-log rate 4 per half-decade for every (alpha,theta) cell',
    holds: () =>
      IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT.rateExponentJointFlat === true &&
      IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT.maxSlopeDeviation < 2e-2 &&
      IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT.maxTopSlopeDeviation < 1e-3 &&
      Math.abs(IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT.minSlopeMeasured - 4) < 2e-2 &&
      Math.abs(IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT.maxSlopeMeasured - 4) < 2e-2,
  },
  {
    // (ii) measured eps^4 coefficient matches -[10/(alpha+5)] e^{4 i theta} at the top rung to < 1e-3.
    id: 'imp34002-subsubleading-coeff-matches-closed-form',
    description:
      'measured (isolated)/eps^4 at eps = 1e-2 matches -[10/(alpha+5)] e^{4 i theta} across the joint grid to < 1e-3',
    holds: () =>
      IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT.maxCoeffDeviationVsClosedFormAtTop < 1e-3,
  },
  {
    // (iii) coefficient modulus 10/(alpha+5) is theta-flat per alpha but alpha-dependent across the grid.
    id: 'imp34002-coeff-modulus-theta-flat-alpha-dependent',
    description:
      'sub-sub-leading coefficient modulus 10/(alpha+5) is theta-flat per alpha but alpha-dependent across the grid',
    holds: () =>
      IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT.coeffModulusThetaFlat === true &&
      IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT.coeffModulusAlphaDependent === true &&
      IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT.maxCoeffModulusDeviation < 1e-3,
  },
  {
    // (iv) phase winds at rate 4, alpha-independent; anchor alpha = 1/2 reproduces the modulus 20/11.
    id: 'imp34002-winding-rate-four-and-anchor',
    description:
      'phase winds at rate 4 (alpha-independent); alpha = 1/2 reproduces the coefficient modulus 20/11',
    holds: () =>
      IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT.phaseWindingRateAlphaIndependent === true &&
      Math.abs(IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT.phaseWindingRateAt03 - 4) < 1e-3 &&
      Math.abs(IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT.phaseWindingRateAt07 - 4) < 1e-3 &&
      IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT.anchorReproduces20Over11 === true,
  },
  {
    // Honesty gate: measurement only, does NOT discharge H4; G6a OPEN, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp34002-honesty-gate-no-qed',
    description:
      'Measurement only: does not discharge H4, G6a stays OPEN, no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT.isRigorous === false &&
      IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT.dischargesH4 === false &&
      /NO QED/.test(IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT.verdict) &&
      /STAYS OPEN/.test(IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT.verdict) &&
      /remains the rigorous SOTA/.test(IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(
        IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT.verdict,
      ),
  },
];

for (const a of IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34002-eps4-subsubleading-onset-coefficient assertion failed: ${a.id}`);
  }
}
