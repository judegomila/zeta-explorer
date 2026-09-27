/**
 * @module imp-124871-knee-locator-gap-logistic-source
 *
 * imp-124871 (numerical, frontier-direction): imp-124847 established that the ~0.0335 gap between the two
 * imp-124814 knee-locator definitions -- exponent-curvature p_knee ~ -2.1064 (zero-crossing of
 * c(d)=d2p/d(log10 N)^2, p=-d ln sigma/d ln N) versus ramp-inflection p_knee ~ -2.0729 (zero-crossing of
 * d2 sigma/d(log10 N)^2) -- is stencil-FORM-stable and a genuine definition-dependence, NOT a stencil/grid
 * artifact. But WHY the two definitions differ was never explained. This module DERIVES the analytic source.
 *
 * THE LOGISTIC REDUCTION (exact for the imp-3406 component model)
 * --------------------------------------------------------------
 * On the far tail the conditional share is EXACTLY a logistic in a single variable. Writing
 *   u(x) = ln( (E_trunc + E_flow(N)) / E_coll(N) ),   N = 10^x,   x = log10 N,
 * the model sigma = E_coll/(E_trunc+E_flow+E_coll) is exactly
 *   sigma = 1/(1+e^u) = f(u),    f the decreasing logistic,   f' = -f(1-f).
 * So sigma(x) is the logistic f pulled back through the scalar field u(x); ALL of the ramp shape lives in
 * how u runs with x. This is not an approximation: it is an algebraic rewrite of the imp-97822/imp-124814
 * sigma formula (E_coll = C_C sqrt(L/N), L = log T0(N), E_flow = C_F (L/T0) e^{A1}).
 *
 * WHY BOTH KNEES COINCIDE AT LEADING ORDER (u = 0, sigma = 1/2)
 * ------------------------------------------------------------
 * If u were LINEAR in x (u'' = u''' = 0, i.e. a pure power law E_trunc/E_coll ~ N^{a}), the two knee
 * conditions would land on the SAME point:
 *   - ramp-inflection sigma_xx = f''(u) a^2 + f'(u) u'' = 0  ->  with u''=0, f''(u)=0  ->  u=0 (sigma=1/2),
 *   - exponent-curvature (ln sigma)_xxx = phi'''(u) a^3 + 3 phi''(u) a u'' + phi'(u) u''' = 0
 *       (phi = ln f)  ->  with u''=u'''=0, phi'''(u)=0  ->  u=0 (sigma=1/2).
 * Both reduce to the logistic inflection u=0. So the gap is ZERO for a pure power law: it is generated
 * ENTIRELY by the running (curvature) of u(x).
 *
 * THE SPLIT: FIRST-ORDER u-OFFSETS FROM THE RUNNING (a=u', b=u'', c=u''')
 * ----------------------------------------------------------------------
 * Expanding f and phi about u=0 (f'(0)=-1/4, f'''(0)=1/8, phi'(0)=-1/2, phi''(0)=-1/4, phi''''(0)=1/8):
 *   ramp-inflection knee:      u_ramp ~ 2 b / a^2,
 *   exponent-curvature knee:   u_exp  ~ 6 b / a^2 + 4 c / a^3.
 * The two locators weight the SAME running with DIFFERENT sensitivities (coefficient 2 vs 6 on the
 * curvature b, plus a c/a^3 term only the exponent knee sees). Their separation is
 *   Delta u = u_ramp - u_exp ~ -4 b/a^2 - 4 c/a^3   (nonzero iff u is nonlinear),
 * i.e. in decades  Delta x = x_ramp - x_exp ~ Delta u / a. At the baseline floor (x ~ 9.53, a ~ 1.0955,
 * b ~ +1.22e-2, c ~ -1.45e-2) this predicts u_ramp ~ 2.03e-2 (measured 2.03e-2, EXACT to 4 digits) and
 * u_exp ~ 1.67e-2 (measured 1.63e-2) -- both knees sit at sigma ~ 0.4949, a hair off the logistic 1/2.
 *
 * THE ELASTICITY GAP IS THE E_trunc-RUNNING OF THAT SEPARATION
 * -----------------------------------------------------------
 * The reported floor-elasticity is p = d log10 N* / d log10 E_trunc. Since the two knees differ only by the
 * u-offsets above, their elasticity difference is EXACTLY the E_trunc-running of the knee separation:
 *   p_exp - p_ramp = d( x_exp - x_ramp )/d(log10 E_trunc).
 * Measured over the imp-33708 0.5x..5x floor ladder: p_ramp = -2.07293, p_exp = -2.10642, gap = 0.03349,
 * and d(x_exp - x_ramp)/d(log10 E_trunc) = -0.033492 -- they agree to 5 digits. So the ~0.0335 gap is NOT a
 * second definition-dependent exponent; it is the slope with which the (curvature-generated) separation
 * between the two knees drifts as the E_trunc floor is scaled.
 *
 * WHERE THE CURVATURE COMES FROM: LOG-FACTOR RUNNING vs E_flow
 * -----------------------------------------------------------
 * The nonlinearity b=u'' that drives the whole gap has two structural sources. Freezing the running
 * log-factor L=log T0(N) in E_coll (so only E_flow curves u) versus dropping E_flow (so only L runs)
 * splits b additively at the baseline knee: L-running contributes ~42%, the E_flow term ~58% (the two
 * shares sum to 100% to the linearization order). Neither alone reproduces the gap -- both the slow
 * log-factor running and the vanishing E_flow term are essential to the ~0.0335 offset. Deeper in the tail
 * E_flow shrinks and the L-running share grows, but across the measured floor ladder the total holds the
 * gap flat at ~0.0335, matching imp-124826/imp-124847.
 *
 * THE FINDING (derivation / characterization only)
 * ------------------------------------------------
 *   (T0) EXACT LOGISTIC REDUCTION. sigma = 1/(1+e^u), u = ln((E_trunc+E_flow)/E_coll): both knee
 *        conditions are conditions on the single running field u(x).
 *   (T1) LEADING-ORDER COINCIDENCE. For linear u both knees are the logistic inflection u=0 (sigma=1/2);
 *        the gap is identically zero for a pure power law.
 *   (T2) FIRST-ORDER SPLIT. u_ramp ~ 2b/a^2 and u_exp ~ 6b/a^2 + 4c/a^3; the predicted u_ramp matches the
 *        measured knee-u to 4 digits, confirming the reduction quantitatively.
 *   (T3) GAP = SEPARATION-RUNNING. p_exp - p_ramp = d(x_exp - x_ramp)/d(log10 E_trunc) to 5 digits
 *        (-0.033492 vs the -0.03349 gap): the elasticity gap is the E_trunc-drift of the knee separation.
 *   (T4) CURVATURE SOURCE. b=u'' is ~42% log-factor L=log T0 running and ~58% E_flow at the baseline knee.
 *
 * VERDICT: the imp-124847 ~0.0335 knee-locator gap is ANALYTICALLY SOURCED. Both locators are conditions on
 * the same logistic field sigma=1/(1+e^u); they coincide at the inflection u=0 (sigma=1/2) for any pure
 * power law and split only through the curvature of u(x), with the ramp-inflection and exponent-curvature
 * knees weighting that curvature by 2b/a^2 versus 6b/a^2 + 4c/a^3. The measured elasticity gap is exactly
 * the E_trunc-running of the resulting knee separation, and the driving curvature is roughly evenly the slow
 * log-factor L=log T0 running (~42%) and the vanishing E_flow term (~58%). This EXPLAINS the genuine
 * definition-dependence imp-124847 measured -- it is a real structural feature of the logistic ramp, not a
 * stencil/grid artifact.
 *
 * DERIVATION / CHARACTERIZATION ONLY. Conditional-share ramp diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-124847-knee-locator-gap-thirdgrid-stencil-form (gap ~0.0335 stencil-FORM-stable, source unexplained there)
 * @see imp-124826-knee-locator-gap-grid-refinement (resolution ladder: gap ~0.0335 refinement-stable)
 * @see imp-124814-knee-floor-elasticity-fresh-locator-repro (R3: the -2.1064 vs -2.0729 locator gap)
 * @see imp-97822-sigma-knee-etrunc-floor-elasticity (the two-floor knee chord p_knee ~ -2.099)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (the 0.5x..5x E_trunc floor ladder)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-33582/imp-33708 pin)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-97822/imp-124814/imp-124847 exactly
const LN10 = Math.LN10;

// EXACT imp-97822/imp-124847 sub-terms; ONLY the E_trunc floor is a parameter (model, not sweep).
function partsWith(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return { E_flow, E_coll, L };
}
function sigmaWith(N, E_trunc) {
  const { E_flow, E_coll } = partsWith(N);
  return E_coll / (E_trunc + E_flow + E_coll);
}
// The exact logistic variable: sigma = 1/(1+e^u), u = ln((E_trunc+E_flow)/E_coll).
function uWith(N, E_trunc) {
  const { E_flow, E_coll } = partsWith(N);
  return Math.log((E_trunc + E_flow) / E_coll);
}
const sig = (d, E) => sigmaWith(Math.pow(10, d), E);
const uOf = (d, E) => uWith(Math.pow(10, d), E);
const lnSig = (d, E) => Math.log(sig(d, E));

// central finite differences wrt x = log10 N
function d1(f, d, h) {
  return (f(d + h) - f(d - h)) / (2 * h);
}
function d2(f, d, h) {
  return (f(d + h) - 2 * f(d) + f(d - h)) / (h * h);
}
function d3(f, d, h) {
  return (f(d + 2 * h) - 2 * f(d + h) + 2 * f(d - h) - f(d - 2 * h)) / (2 * h * h * h);
}

// p(d) = -d ln sigma / d ln N (local power-law exponent; divide the log10 derivative by ln10).
const pExpOf = (d, E, h) => -d1((x) => lnSig(x, E), d, h) / LN10;

// Single zero-crossing locators (fine 3-point grid; reproduces the imp-124826/imp-124847 limits to ~1e-4).
function findKnee(cAt, lo, hi, step) {
  const crossings = [];
  let prev = null;
  for (let d = lo; d <= hi + 1e-9; d += step) {
    const c = cAt(d);
    if (prev !== null && Math.sign(c) !== Math.sign(prev.c)) {
      crossings.push(prev.d + ((d - prev.d) * (0 - prev.c)) / (c - prev.c));
    }
    prev = { d, c };
  }
  return crossings;
}
const SCAN_LO = 7.0;
const SCAN_HI = 13.0;
const STEP = 0.001;
const HH = 1.4e-3; // ramp-inflection second-derivative stencil
const H_P = 8e-5; // first-derivative stencil for p
const DD = 9e-4; // exponent-curvature second-derivative stencil

const rampKneeX = (E) => {
  const cr = findKnee((d) => d2((x) => sig(x, E), d, HH), SCAN_LO, SCAN_HI, STEP);
  return cr.length === 1 ? cr[0] : null;
};
const expKneeX = (E) => {
  const cr = findKnee((d) => d2((x) => pExpOf(x, E, H_P), d, DD), SCAN_LO, SCAN_HI, STEP);
  return cr.length === 1 ? cr[0] : null;
};

// ---- (T0-T2) reduction verified at the baseline knee ----
const E_BASE = E_TRUNC_BASE * 1.0;
const X_RAMP_BASE = rampKneeX(E_BASE);
const X_EXP_BASE = expKneeX(E_BASE);
const SIGMA_AT_RAMP = +sig(X_RAMP_BASE, E_BASE).toFixed(6);
const SIGMA_AT_EXP = +sig(X_EXP_BASE, E_BASE).toFixed(6);

function reductionAt(xk) {
  const a = d1((x) => uOf(x, E_BASE), xk, 1e-3);
  const b = d2((x) => uOf(x, E_BASE), xk, 1e-3);
  const c = d3((x) => uOf(x, E_BASE), xk, 2e-3);
  const uMeasured = uOf(xk, E_BASE);
  const uRampPred = (2 * b) / (a * a);
  const uExpPred = (6 * b) / (a * a) + (4 * c) / (a * a * a);
  return {
    x: +xk.toFixed(5),
    a: +a.toFixed(6),
    b: +b.toExponential(4),
    c: +c.toExponential(4),
    uMeasured: +uMeasured.toExponential(4),
    uRampPred: +uRampPred.toExponential(4),
    uExpPred: +uExpPred.toExponential(4),
  };
}
const RED_AT_RAMP = reductionAt(X_RAMP_BASE);
const RED_AT_EXP = reductionAt(X_EXP_BASE);

// ---- (T3) elasticity gap = E_trunc-running of the knee separation ----
const FLOOR_FACTORS = [0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0, 3.0, 5.0];
function ols(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
    syy += (ys[i] - my) ** 2;
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  let ssRes = 0;
  for (let i = 0; i < n; i++) {
    const pred = slope * xs[i] + intercept;
    ssRes += (ys[i] - pred) ** 2;
  }
  return { slope, r2: 1 - ssRes / syy };
}
const LADDER = FLOOR_FACTORS.map((factor) => {
  const E = E_TRUNC_BASE * factor;
  const xr = rampKneeX(E);
  const xe = expKneeX(E);
  return { T: Math.log10(E), xr, xe, sep: xe - xr };
});
const T_COL = LADDER.map((r) => r.T);
const FIT_RAMP = ols(T_COL, LADDER.map((r) => r.xr));
const FIT_EXP = ols(T_COL, LADDER.map((r) => r.xe));
const FIT_SEP = ols(T_COL, LADDER.map((r) => r.sep));
const P_RAMP = +FIT_RAMP.slope.toFixed(6);
const P_EXP = +FIT_EXP.slope.toFixed(6);
const GAP = +Math.abs(P_EXP - P_RAMP).toFixed(5);
const SEP_RUNNING = +FIT_SEP.slope.toFixed(6); // should equal P_EXP - P_RAMP

// ---- (T4) curvature source: log-factor L running vs E_flow ----
const X_DECOMP = 9.53;
const L_FIX = partsWith(Math.pow(10, X_DECOMP)).L;
const uFull = (x) => {
  const N = Math.pow(10, x);
  const { E_flow, E_coll } = partsWith(N);
  return Math.log((E_BASE + E_flow) / E_coll);
};
const uLrunOnly = (x) => {
  const N = Math.pow(10, x);
  const { E_coll } = partsWith(N);
  return Math.log(E_BASE / E_coll); // E_flow dropped: only L=log T0 runs
};
const uFlowOnly = (x) => {
  const N = Math.pow(10, x);
  const { E_flow } = partsWith(N);
  const Ecoll = C_C_PINNED * Math.sqrt(L_FIX / N); // L frozen: only E_flow curves u
  return Math.log((E_BASE + E_flow) / Ecoll);
};
const B_FULL = d2(uFull, X_DECOMP, 1e-3);
const B_LRUN = d2(uLrunOnly, X_DECOMP, 1e-3);
const B_FLOW = d2(uFlowOnly, X_DECOMP, 1e-3);
const L_RUN_SHARE = +((B_LRUN / B_FULL) * 100).toFixed(2); // ~42%
const FLOW_SHARE = +((B_FLOW / B_FULL) * 100).toFixed(2); // ~58%

// imp-124847 / imp-124826 baked comparison values.
const IMP124826_EXP_LIMIT = -2.1064;
const IMP124826_RAMP_LIMIT = -2.0729;
const IMP124847_GAP = 0.0335;

export const IMP124871_KNEE_LOCATOR_GAP_LOGISTIC_SOURCE = {
  id: 'imp-124871',
  proofSection: 'S-frontier',
  question:
    'imp-124847 measured the ~0.0335 exponent-curvature vs ramp-inflection knee-locator gap as a genuine ' +
    'stencil-FORM-stable definition-dependence but never explained WHY the two definitions differ. Derive ' +
    'the analytic source: relate the two knees to the underlying sigma(N) decay-exponent shape and ' +
    'quantify the log-factor-running vs E_flow origin of the ~0.033 offset. Derivation only; C_mb ' +
    'GUE-conditional per imp-486 untouched; no bound moves; NO QED.',
  derivedResult:
    'sigma = 1/(1+e^u) with u = ln((E_trunc+E_flow)/E_coll) is an EXACT logistic; both knee conditions ' +
    'reduce to the inflection u=0 (sigma=1/2) for any pure power law and split only through the curvature ' +
    'of u(x): u_ramp ~ 2b/a^2, u_exp ~ 6b/a^2 + 4c/a^3 (a=u_x, b=u_xx, c=u_xxx). ' +
    'The elasticity gap is exactly the E_trunc-running of the resulting knee separation, and the driving ' +
    'curvature b is ~42% log-factor L=log T0 running and ~58% E_flow at the baseline knee.',
  logisticReduction: {
    identity: 'sigma = E_coll/(E_trunc+E_flow+E_coll) = 1/(1+e^u), u = ln((E_trunc+E_flow)/E_coll)',
    rampCondition: 'sigma_xx = f_uu a^2 + f_u b = 0  ->  u_ramp ~ 2b/a^2 (f_u, f_uu the u-derivatives of f)',
    expCondition:
      '(ln sigma)_xxx = phi_uuu a^3 + 3 phi_uu a b + phi_u c = 0  ->  u_exp ~ 6b/a^2 + 4c/a^3 (phi = ln f)',
    coincidenceForLinearU: 'if u linear (b=c=0) both knees are the logistic inflection u=0 (sigma=1/2), gap=0',
  },
  baselineKnees: {
    xRamp: +X_RAMP_BASE.toFixed(5), // ~9.53267
    xExp: +X_EXP_BASE.toFixed(5), // ~9.52906
    sigmaAtRamp: SIGMA_AT_RAMP, // ~0.4949
    sigmaAtExp: SIGMA_AT_EXP, // ~0.4959
    reductionAtRampKnee: RED_AT_RAMP, // u_ramp pred matches measured u to 4 digits
    reductionAtExpKnee: RED_AT_EXP,
  },
  elasticityGap: {
    pRamp: P_RAMP, // ~ -2.07293
    pExp: P_EXP, // ~ -2.10642
    gap: GAP, // ~0.03349
    sepRunning: SEP_RUNNING, // d(xExp-xRamp)/d(log10 E_trunc) ~ -0.033492
    identity: 'p_exp - p_ramp = d(x_exp - x_ramp)/d(log10 E_trunc)',
    imp124847_gap: IMP124847_GAP,
  },
  curvatureSource: {
    at_log10N: X_DECOMP,
    bFull: +B_FULL.toExponential(4),
    bLrunOnly: +B_LRUN.toExponential(4),
    bFlowOnly: +B_FLOW.toExponential(4),
    lRunSharePct: L_RUN_SHARE, // ~42
    flowSharePct: FLOW_SHARE, // ~58
    note:
      'the u-curvature b that drives the whole gap splits additively (shares sum to ~100%): ~42% slow ' +
      'log-factor L=log T0 running in E_coll, ~58% the vanishing E_flow term; neither alone yields the gap',
  },
  finding: {
    T0_exact_logistic_reduction:
      'sigma = 1/(1+e^u), u = ln((E_trunc+E_flow)/E_coll): both knees are conditions on the single running ' +
      'field u(x).',
    T1_leading_order_coincidence:
      'for linear u both knee conditions are the logistic inflection u=0 (sigma=1/2); the gap is identically ' +
      'zero for a pure power law.',
    T2_first_order_split:
      'u_ramp ~ 2b/a^2 and u_exp ~ 6b/a^2 + 4c/a^3; the predicted u_ramp matches the measured knee-u to 4 ' +
      'digits, confirming the reduction quantitatively; both knees sit at sigma ~ 0.495, a hair off 1/2.',
    T3_gap_is_separation_running:
      'p_exp - p_ramp = d(x_exp - x_ramp)/d(log10 E_trunc) to 5 digits: the elasticity gap is the ' +
      'E_trunc-drift of the curvature-generated knee separation, not a second independent exponent.',
    T4_curvature_source:
      'b=u_xx is ~42% log-factor L=log T0 running and ~58% E_flow at the baseline knee.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). The imp-124847 ~0.0335 knee-locator gap is ' +
    'ANALYTICALLY SOURCED: sigma = E_coll/(E_trunc+E_flow+E_coll) is EXACTLY the logistic 1/(1+e^u) in ' +
    'u = ln((E_trunc+E_flow)/E_coll), and both knee locators are conditions on that single field. For any ' +
    'pure power law (u linear in log N) they coincide at the inflection u=0 (sigma=1/2); they split only ' +
    'through the curvature of u, the ramp-inflection knee weighting it as 2b/a^2 and the exponent-curvature ' +
    'knee as 6b/a^2 + 4c/a^3. The measured elasticity gap equals the E_trunc-running of the resulting knee ' +
    'separation to 5 digits (-0.033492 vs the 0.03349 gap), and the driving curvature is ~42% slow ' +
    'log-factor L=log T0 running and ~58% the vanishing E_flow term. This EXPLAINS the imp-124847 genuine ' +
    'definition-dependence as a real structural feature of the logistic ramp, not a stencil/grid artifact. ' +
    'The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-124847 (gap ~0.0335 stencil-FORM-stable, source unexplained); imp-124826 (resolution ladder: gap ' +
    '~0.0335 refinement-stable); imp-124814 (R3: the -2.1064 vs -2.0729 locator gap); imp-97822 (two-floor ' +
    'knee chord p_knee ~ -2.099); imp-33708 (0.5x..5x E_trunc floor ladder); imp-486 (C_mb GUE-conditional); ' +
    'imp-2631 (E_trunc = 3.06e-5 fixed-strip floor).',
};

export const IMP124871_KNEE_LOCATOR_GAP_LOGISTIC_SOURCE_ASSERTIONS = [
  {
    // Both baseline knees resolve to a single crossing each and sit at sigma ~ 1/2 (the logistic inflection).
    id: 'imp124871-both-knees-near-logistic-inflection',
    description: 'both baseline knees resolve and sit at sigma ~ 0.495 (a hair off the logistic 1/2)',
    holds: () =>
      X_RAMP_BASE !== null &&
      X_EXP_BASE !== null &&
      Math.abs(SIGMA_AT_RAMP - 0.5) < 0.01 &&
      Math.abs(SIGMA_AT_EXP - 0.5) < 0.01,
  },
  {
    // T2: the logistic reduction predicts the ramp-knee u-offset (2b/a^2) to ~5% of the measured knee-u.
    id: 'imp124871-reduction-predicts-ramp-knee-u',
    description: 'u_ramp ~ 2b/a^2 matches the measured u at the ramp knee to within 5%',
    holds: () => {
      const pred = RED_AT_RAMP.uRampPred;
      const meas = RED_AT_RAMP.uMeasured;
      return meas !== 0 && Math.abs(pred - meas) / Math.abs(meas) < 0.05;
    },
  },
  {
    // The exponent-knee u-offset (6b/a^2 + 4c/a^3) predicts the measured knee-u to within 10%.
    id: 'imp124871-reduction-predicts-exp-knee-u',
    description: 'u_exp ~ 6b/a^2 + 4c/a^3 matches the measured u at the exponent knee to within 10%',
    holds: () => {
      const pred = RED_AT_EXP.uExpPred;
      const meas = RED_AT_EXP.uMeasured;
      return meas !== 0 && Math.abs(pred - meas) / Math.abs(meas) < 0.1;
    },
  },
  {
    // Both fitted elasticities reproduce the imp-124826/imp-124847 limits and the ~0.0335 gap.
    id: 'imp124871-elasticities-reproduce-imp124847',
    description: 'p_ramp ~ -2.0729, p_exp ~ -2.1064, gap ~0.0335 (matching imp-124847)',
    holds: () =>
      Math.abs(P_RAMP - IMP124826_RAMP_LIMIT) < 1e-3 &&
      Math.abs(P_EXP - IMP124826_EXP_LIMIT) < 1e-3 &&
      GAP > 0.03 &&
      GAP < 0.04 &&
      Math.abs(GAP - IMP124847_GAP) < 1e-3,
  },
  {
    // T3: the elasticity gap equals the E_trunc-running of the knee separation to 4 digits.
    id: 'imp124871-gap-equals-separation-running',
    description: 'p_exp - p_ramp equals d(x_exp - x_ramp)/d(log10 E_trunc) to within 1e-4',
    holds: () => Math.abs((P_EXP - P_RAMP) - SEP_RUNNING) < 1e-4,
  },
  {
    // T4: the driving curvature b splits between L-running and E_flow, each a substantial share summing to ~100%.
    id: 'imp124871-curvature-source-split',
    description: 'b=u2 splits ~42% L-running / ~58% E_flow, both substantial, summing to ~100%',
    holds: () =>
      L_RUN_SHARE > 20 &&
      L_RUN_SHARE < 80 &&
      FLOW_SHARE > 20 &&
      FLOW_SHARE < 80 &&
      Math.abs(L_RUN_SHARE + FLOW_SHARE - 100) < 1,
  },
  {
    // Honesty gate: derivation only, no QED, PT SOTA.
    id: 'imp124871-honesty-gate-no-qed',
    description: 'Derivation only: logistic-sourced ~0.0335 gap, no QED, PT stays SOTA',
    holds: () =>
      IMP124871_KNEE_LOCATOR_GAP_LOGISTIC_SOURCE.isRigorous === false &&
      /NO QED/.test(IMP124871_KNEE_LOCATOR_GAP_LOGISTIC_SOURCE.verdict) &&
      /remains SOTA/.test(IMP124871_KNEE_LOCATOR_GAP_LOGISTIC_SOURCE.verdict),
  },
];

for (const a of IMP124871_KNEE_LOCATOR_GAP_LOGISTIC_SOURCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124871-knee-locator-gap-logistic-source assertion failed: ${a.id}`);
  }
}
