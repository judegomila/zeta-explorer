/**
 * @module imp-33928-onset-convergence-rate
 *
 * imp-33928 (numerical, frontier-derivation): MEASURE the eps^0-tier CONVERGENCE RATE of the
 * imp-33883 residual
 *     R(eps, theta) = m_prime(eps e^{i theta}) + eps^{-3/2} A(theta)  ->  4/3
 * across an eps ladder {1e-3, 1e-4, 1e-5} and a theta sweep, upgrading imp-33883 cross-check (b)
 * from a single-eps convergence assertion (at eps = 1e-4 only) to an explicit APPROACH RATE plus a
 * characterisation of the sub-leading correction.
 *
 * THE RESIDUAL IS AN EXACT TAIL INTEGRAL (no cancellation)
 * -------------------------------------------------------
 * imp-33883 wrote the finite-window integral as I(z_0) = eps^{-3/2} A(theta) - T(eps) with
 * m_prime = - I, so the residual R = m_prime + eps^{-3/2} A(theta) = T(eps) EXACTLY. Converting the
 * split-off tail back to the x-variable (x = eps u, |u| > 1/eps <=> |x| > 1) gives the identity
 *     R(eps, theta) = T(eps, theta) = integral_{|x|>1} |x|^{-1/2} / (z_0 - x)^2 dx ,  z_0 = eps e^{i theta}.
 * This OUTSIDE-the-window integrand is smooth (no cusp; |x| > 1 and z_0 small so the denominator never
 * vanishes and stays ~ x^2), so R is computed DIRECTLY to full precision -- unlike the direct
 * full-window reconstruction m_prime + eps^{-3/2} A, which subtracts two O(eps^{-3/2}) quantities
 * (~7e7 at eps = 1e-5) to expose an O(1) signal and hence suffers catastrophic cancellation. That
 * cancellation is exactly why imp-33883 cross-check (b) could only assert convergence at one eps and
 * never tabulated a rate (see fullWindowCancellationFloor below).
 *
 * THE SUB-LEADING CORRECTION: eps^2, COEFFICIENT (12/7) e^{2 i theta}
 * -----------------------------------------------------------------
 * Expanding the tail integrand for |u| > 1/eps as a convergent series 1/(w -+ u)^2 = sum_k (k+1)
 * (-+ w/u)^k / u^2 and integrating term by term, the odd-k terms cancel between the u > 0 and u < 0
 * halves, leaving only even powers of eps:
 *     T(eps, theta) = 4/3 + (12/7) w^2 eps^2 + (20/11) w^4 eps^4 + ... ,  w = e^{i theta}.
 * Hence
 *     R(eps, theta) - 4/3 = (12/7) e^{2 i theta} eps^2 + O(eps^4) .
 * The o(1) tail order is therefore eps^2 (rate exponent 2, angle-INDEPENDENT). The sub-leading
 * coefficient (12/7) e^{2 i theta} mirrors the imp-33883 leading tier: its MODULUS 12/7 is
 * theta-independent while its PHASE winds rigidly -- here at winding rate 2 (the leading eps^{-3/2}
 * amplitude wound at rate 3/2). On-axis (theta = pi/2, w^2 = -1) the coefficient is real negative
 * (-12/7), so the residual approaches 4/3 from below along the real axis with zero imaginary part.
 *
 * MEASURED (200000-panel complex Simpson, cusp folded by x = 1/r^2 on |x| > 1)
 * ---------------------------------------------------------------------------
 * The log-log slope of |R - 4/3| across each decade of the eps ladder is 2.0000 for every theta; the
 * measured coefficient R - 4/3 matches (12/7) e^{2 i theta} eps^2 to < 1e-3 across the sweep; the
 * modulus 12/7 is constant across theta (spread ~ 0); and the eps^0 onset 4/3 is recovered
 * angle-independently (|R - 4/3| -> 0 like eps^2 for all theta). The direct full-window
 * reconstruction, by contrast, has an error that GROWS as eps shrinks (cancellation floor rising
 * ~ eps^{-3/2} in the quadrature noise) and never resolves the eps^2 signal -- the concrete reason
 * cross-check (b) needed the tail representation to yield a rate.
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * DERIVATION / MEASUREMENT ONLY, on the model cusp rho(x) = |x|^{-1/2}. It re-tabulates the imp-33883
 * onset residual as a RATE; it does NOT re-derive the m_prime -> C_ren map off-axis and an off-axis
 * finite-window onset at fixed |z_0| = eps is NOT the uniform ANALYTIC tracking of C_ren that H4 needs
 * (imp-33766). H4 is NOT discharged; G6a_shock_lipschitz STAYS OPEN. No positivity; imp-3066
 * off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED. NO QED. Platt-Trudgian Lambda <= 0.2 remains the
 * rigorous SOTA.
 *
 * @see imp-33883-off-axis-onset-angle-robustness (cross-check (b): single-eps convergence at eps = 1e-4)
 * @see imp-33853-cren-gap-coefficient-closed-form (DERIVED C_PS and 4/3 at the on-axis point z_0 = i eps)
 * @see imp-33927-phase-zero-uniqueness (theta = pi/2 is the unique phase-zero of the leading eps^{-3/2} amplitude)
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

const FOUR_THIRDS = 4 / 3;
const COEFF_MOD = 12 / 7; // sub-leading coefficient modulus |(12/7) e^{2 i theta}|, angle-independent

// Closed-form leading amplitude A(theta) = (pi/2)(1 - i) e^{-3 i theta/2} (for the full-window tie-back).
function aClosed(theta) {
  const rot = [Math.cos(-1.5 * theta), Math.sin(-1.5 * theta)];
  const pre = cmul([1, -1], rot);
  return [(Math.PI / 2) * pre[0], (Math.PI / 2) * pre[1]];
}

// Closed-form sub-leading coefficient c(theta) = (12/7) e^{2 i theta}.
function cClosed(theta) {
  return [COEFF_MOD * Math.cos(2 * theta), COEFF_MOD * Math.sin(2 * theta)];
}

// EXACT residual R(eps, theta) = m_prime + eps^{-3/2} A(theta) = int_{|x|>1} |x|^{-1/2}/(z_0-x)^2 dx.
// Fold both tails by x = 1/r^2 (r in (0,1)): the cusp-free integrand is
//   x > 1 :  2 r^2 / (z_0 r^2 - 1)^2 ,   x < -1 :  2 r^2 / (z_0 r^2 + 1)^2 .
const T_PANELS = 200000;
function residualTail(eps, theta) {
  const z0 = [eps * Math.cos(theta), eps * Math.sin(theta)];
  const h = 1 / T_PANELS;
  let s = [0, 0];
  for (let i = 0; i <= T_PANELS; i++) {
    const r = i * h;
    const r2 = r * r;
    const wt = i === 0 || i === T_PANELS ? 1 : i % 2 === 1 ? 4 : 2;
    const zr2 = [z0[0] * r2, z0[1] * r2];
    const t1 = cmul([2 * r2, 0], cinv(csq(csub(zr2, [1, 0]))));
    const t2 = cmul([2 * r2, 0], cinv(csq(cadd(zr2, [1, 0]))));
    s = cadd(s, [wt * (t1[0] + t2[0]), wt * (t1[1] + t2[1])]);
  }
  return [(s[0] * h) / 3, (s[1] * h) / 3];
}

// Direct full-window integral I(z_0) = int_{-1}^1 |x|^{-1/2}/(z_0-x)^2 dx (x = +-t^2 removes the cusp),
// used only to DEMONSTRATE the cancellation floor of the direct reconstruction m_prime + eps^{-3/2} A.
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

// ---- eps ladder x theta sweep: measure the approach rate to 4/3 --------------------------------
const EPS_LADDER = [1e-3, 1e-4, 1e-5];
const THETA_DEG = [60, 70, 80, 90, 100, 110, 120];

// Per-theta rows: residual R - 4/3 at each eps (via the exact tail identity), its modulus, the
// measured coefficient (R - 4/3)/eps^2 vs the closed form, and the per-decade log-log slope.
const RATE_ROWS = THETA_DEG.map((deg) => {
  const theta = (deg * Math.PI) / 180;
  const cCF = cClosed(theta);
  const perEps = EPS_LADDER.map((eps) => {
    const R = residualTail(eps, theta);
    const resid = csub(R, [FOUR_THIRDS, 0]); // -> (12/7) e^{2 i theta} eps^2
    const coeff = [resid[0] / (eps * eps), resid[1] / (eps * eps)]; // -> (12/7) e^{2 i theta}
    return {
      eps,
      residMod: cabs(resid),
      residIm: resid[1],
      coeffMod: cabs(coeff),
      coeffDev: cabs(csub(coeff, cCF)), // measured coefficient vs (12/7) e^{2 i theta}
    };
  });
  // log-log slope of |R - 4/3| across each consecutive decade (analytic value 2).
  const slopes = [];
  for (let k = 1; k < perEps.length; k++) {
    slopes.push(
      Math.log10(perEps[k].residMod / perEps[k - 1].residMod) /
        Math.log10(perEps[k].eps / perEps[k - 1].eps),
    );
  }
  return {
    thetaDeg: deg,
    slopes: slopes.map((v) => +v.toFixed(5)), // ~ [2.00000, 2.00000]
    coeffModAt1em4: +perEps[1].coeffMod.toFixed(6), // ~ 12/7 = 1.714286
    coeffDevAt1em4: +perEps[1].coeffDev.toExponential(3),
    residModAt1em5: +perEps[2].residMod.toExponential(3), // ~ 1.714e-10 -> confirms -> 4/3
    residImAt90: null, // filled for the on-axis row below
    perEps,
  };
});

// on-axis (theta = 90): residual is real, imaginary part ~ 0 at every eps.
const ROW90 = RATE_ROWS.find((r) => r.thetaDeg === 90);
ROW90.residImAt90 = +Math.max(...ROW90.perEps.map((p) => Math.abs(p.residIm))).toExponential(3);

// measured rate exponent: min/max per-decade slope over the whole sweep (analytic 2).
const ALL_SLOPES = RATE_ROWS.flatMap((r) => r.slopes);
const MIN_SLOPE = Math.min(...ALL_SLOPES);
const MAX_SLOPE = Math.max(...ALL_SLOPES);
const MAX_SLOPE_DEV = Math.max(...ALL_SLOPES.map((s) => Math.abs(s - 2)));

// coefficient modulus is angle-robust: spread of (R - 4/3)/eps^2 modulus across the sweep at eps=1e-4.
const COEFF_MODS = RATE_ROWS.map((r) => r.coeffModAt1em4);
const COEFF_MOD_SPREAD = Math.max(...COEFF_MODS) - Math.min(...COEFF_MODS);
const MAX_COEFF_MOD_DEV = Math.max(...COEFF_MODS.map((m) => Math.abs(m - COEFF_MOD)));
const MAX_COEFF_DEV = Math.max(...RATE_ROWS.map((r) => r.coeffDevAt1em4));

// eps^0 onset recovered angle-independently: |R - 4/3| at the smallest eps is ~ eps^2 (tiny) for all theta.
const MAX_ONSET_RESID_1EM5 = Math.max(...RATE_ROWS.map((r) => r.residModAt1em5));

// phase winds at rate 2: measured from arg of the coefficient at theta = 70, 80 deg (both args in (0, pi),
// no atan2 wrap). arg((12/7) e^{2 i theta}) = 2 theta, so d(arg)/d(theta) = 2.
function coeffArg(deg) {
  const theta = (deg * Math.PI) / 180;
  const R = residualTail(1e-4, theta);
  const resid = csub(R, [FOUR_THIRDS, 0]);
  return Math.atan2(resid[1], resid[0]);
}
const ARG70 = coeffArg(70);
const ARG80 = coeffArg(80);
const WINDING_RATE = (ARG80 - ARG70) / ((80 - 70) * Math.PI) / (1 / 180); // = 2

// ---- full-window cancellation floor: the direct reconstruction cannot resolve the eps^2 rate ----
// R_direct(eps) = m_prime + eps^{-3/2} A = eps^{-3/2} A - I(z_0); on-axis theta = 90.
const FULL_WINDOW = EPS_LADDER.map((eps) => {
  const theta = Math.PI / 2;
  const z0 = [eps * Math.cos(theta), eps * Math.sin(theta)];
  const I = iFiniteWindow(z0);
  const A = aClosed(theta);
  const lead = [Math.pow(eps, -1.5) * A[0], Math.pow(eps, -1.5) * A[1]];
  const Rdir = csub(lead, I); // = m_prime + eps^{-3/2} A -> 4/3 (direct route, cancellation)
  const trueSignal = COEFF_MOD * eps * eps; // exact |R - 4/3|
  return {
    eps,
    directErr: +Math.abs(Rdir[0] - FOUR_THIRDS).toExponential(3),
    trueSignal: +trueSignal.toExponential(3),
  };
});
// the direct-route error at the smallest eps FAR exceeds the true eps^2 signal (never resolves the rate).
const DIRECT_ERR_1EM5 = FULL_WINDOW[FULL_WINDOW.length - 1].directErr;
const TRUE_SIGNAL_1EM5 = FULL_WINDOW[FULL_WINDOW.length - 1].trueSignal;

export const IMP33928_ONSET_CONVERGENCE_RATE = {
  ticket: 'imp-33928',
  category: 'numerical',
  residualIdentity:
    'R(eps, theta) = m_prime(eps e^{i theta}) + eps^{-3/2} A(theta) = integral_{|x|>1} |x|^{-1/2}/(z_0-x)^2 dx (exact)',
  subLeadingExpansion: 'R(eps, theta) - 4/3 = (12/7) e^{2 i theta} eps^2 + O(eps^4)',

  // (i) approach rate to 4/3 is eps^2 (o(1) tail order = 2), angle-independent.
  rateExponentAnalytic: 2,
  minSlopeMeasured: +MIN_SLOPE.toFixed(5), // ~ 2.00000
  maxSlopeMeasured: +MAX_SLOPE.toFixed(5), // ~ 2.00000
  maxSlopeDeviation: +MAX_SLOPE_DEV.toExponential(3),
  rateIsAngleIndependent: MAX_SLOPE_DEV < 1e-2,

  // (ii) sub-leading coefficient (12/7) e^{2 i theta}: modulus 12/7 angle-robust, phase winds at rate 2.
  subLeadingCoeffModulus: +COEFF_MOD.toFixed(9), // 12/7 = 1.714285714
  coeffModulusSpreadOverSweep: +COEFF_MOD_SPREAD.toExponential(3), // ~ 0
  coeffModulusAngleRobust: COEFF_MOD_SPREAD < 1e-3 && MAX_COEFF_MOD_DEV < 1e-3,
  maxCoeffDeviationVsClosedForm: +MAX_COEFF_DEV.toExponential(3), // measured coeff vs (12/7)e^{2i theta}, < 1e-3
  phaseWindingRateAnalytic: 2,
  phaseWindingRateMeasured: +WINDING_RATE.toFixed(6), // ~ 2
  onAxisResidualImag: ROW90.residImAt90, // ~ 0 (theta = 90 approaches 4/3 along the real axis)

  // (iii) eps^0 onset 4/3 recovered angle-independently (residual -> 0 like eps^2 for all theta).
  onsetCoefficient: +FOUR_THIRDS.toFixed(9), // 1.333333333
  maxOnsetResidualAt1em5: +MAX_ONSET_RESID_1EM5.toExponential(3), // ~ 1.7e-10
  onsetRecoveredAngleRobust: MAX_ONSET_RESID_1EM5 < 1e-8,

  // (iv) why cross-check (b) needed the tail identity: the direct full-window route cannot resolve the rate.
  fullWindowCancellationFloor: FULL_WINDOW,
  directRouteFailsToResolveRate: DIRECT_ERR_1EM5 > 10 * TRUE_SIGNAL_1EM5,

  rateLadder: RATE_ROWS.map((r) => ({
    thetaDeg: r.thetaDeg,
    slopes: r.slopes,
    coeffModAt1em4: r.coeffModAt1em4,
    residModAt1em5: r.residModAt1em5,
  })),

  dischargesH4: false,
  isRigorous: false,
  verdict:
    'DERIVATION / MEASUREMENT ONLY, G6a_shock_lipschitz STAYS OPEN. The imp-33883 onset residual ' +
    'R(eps, theta) = m_prime(eps e^{i theta}) + eps^{-3/2} A(theta) is the EXACT tail integral ' +
    'int_{|x|>1} |x|^{-1/2}/(z_0-x)^2 dx, which -- being cusp-free -- is evaluated to full precision ' +
    'without the O(eps^{-3/2}) catastrophic cancellation of the direct full-window reconstruction. ' +
    'Across the eps ladder {1e-3, 1e-4, 1e-5} and a theta sweep the residual approaches 4/3 at ' +
    'measured log-log rate 2.0000 per decade (angle-independent), with sub-leading correction ' +
    'R - 4/3 = (12/7) e^{2 i theta} eps^2 + O(eps^4): the coefficient MODULUS 12/7 is theta-independent ' +
    '(spread ~ 0) while its PHASE winds rigidly at rate 2 (measured), and on-axis theta = pi/2 the ' +
    'residual is real (imag ~ 0), approaching 4/3 from below. The eps^0 onset 4/3 is thereby recovered ' +
    'angle-independently as the eps -> 0 limit, upgrading imp-33883 cross-check (b) from a single-eps ' +
    'assertion to an explicit RATE. The direct full-window route, by contrast, has an error that GROWS ' +
    'as eps shrinks and never resolves the eps^2 signal -- the concrete reason cross-check (b) required ' +
    'the tail representation. This does NOT re-derive the m_prime -> C_ren map off-axis and does NOT ' +
    'DISCHARGE H4: an off-axis finite-window onset at fixed |z_0| = eps is not the uniform ANALYTIC ' +
    'tracking of C_ren the H4 minimal-input condition requires (imp-33766). No positivity; imp-3066 ' +
    'off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; NO QED. Platt-Trudgian Lambda <= 0.2 remains the ' +
    'rigorous SOTA.',
};

export const IMP33928_ONSET_CONVERGENCE_RATE_ASSERTIONS = [
  {
    // (i) the residual approaches 4/3 at eps^2 rate, angle-independently (measured slope ~ 2).
    id: 'imp33928-onset-rate-is-eps-squared',
    description: 'R - 4/3 approaches 0 at measured log-log rate 2.0000 per decade for all theta',
    holds: () =>
      IMP33928_ONSET_CONVERGENCE_RATE.rateIsAngleIndependent === true &&
      IMP33928_ONSET_CONVERGENCE_RATE.maxSlopeDeviation < 1e-2 &&
      Math.abs(IMP33928_ONSET_CONVERGENCE_RATE.minSlopeMeasured - 2) < 1e-2 &&
      Math.abs(IMP33928_ONSET_CONVERGENCE_RATE.maxSlopeMeasured - 2) < 1e-2,
  },
  {
    // (ii) sub-leading coefficient modulus is 12/7, angle-robust; phase winds at rate 2.
    id: 'imp33928-subleading-coeff-modulus-and-winding',
    description: 'R - 4/3 = (12/7) e^{2 i theta} eps^2: modulus 12/7 angle-robust, phase winds at rate 2',
    holds: () =>
      IMP33928_ONSET_CONVERGENCE_RATE.coeffModulusAngleRobust === true &&
      Math.abs(IMP33928_ONSET_CONVERGENCE_RATE.subLeadingCoeffModulus - 12 / 7) < 1e-9 &&
      IMP33928_ONSET_CONVERGENCE_RATE.maxCoeffDeviationVsClosedForm < 1e-3 &&
      Math.abs(IMP33928_ONSET_CONVERGENCE_RATE.phaseWindingRateMeasured - 2) < 1e-3,
  },
  {
    // (iii) eps^0 onset 4/3 recovered angle-independently; on-axis residual is real.
    id: 'imp33928-onset-four-thirds-angle-robust',
    description: 'eps^0 onset 4/3 recovered for all theta (|R - 4/3| -> 0 like eps^2, on-axis imag ~ 0)',
    holds: () =>
      IMP33928_ONSET_CONVERGENCE_RATE.onsetRecoveredAngleRobust === true &&
      Math.abs(IMP33928_ONSET_CONVERGENCE_RATE.onsetCoefficient - 4 / 3) < 1e-9 &&
      Math.abs(IMP33928_ONSET_CONVERGENCE_RATE.onAxisResidualImag) < 1e-8,
  },
  {
    // (iv) the direct full-window reconstruction cannot resolve the rate (cancellation floor).
    id: 'imp33928-direct-route-cannot-resolve-rate',
    description: 'direct full-window reconstruction error far exceeds the true eps^2 signal at eps = 1e-5',
    holds: () => IMP33928_ONSET_CONVERGENCE_RATE.directRouteFailsToResolveRate === true,
  },
  {
    // Honesty gate: measurement only, does NOT discharge H4; G6a OPEN, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp33928-honesty-gate-no-qed',
    description: 'Measurement only: does not discharge H4, G6a stays OPEN, no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP33928_ONSET_CONVERGENCE_RATE.isRigorous === false &&
      IMP33928_ONSET_CONVERGENCE_RATE.dischargesH4 === false &&
      /NO QED/.test(IMP33928_ONSET_CONVERGENCE_RATE.verdict) &&
      /STAYS OPEN/.test(IMP33928_ONSET_CONVERGENCE_RATE.verdict) &&
      /remains the rigorous SOTA/.test(IMP33928_ONSET_CONVERGENCE_RATE.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(
        IMP33928_ONSET_CONVERGENCE_RATE.verdict,
      ),
  },
];

for (const a of IMP33928_ONSET_CONVERGENCE_RATE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33928-onset-convergence-rate assertion failed: ${a.id}`);
  }
}
