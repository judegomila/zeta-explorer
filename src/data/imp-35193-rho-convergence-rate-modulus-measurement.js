/**
 * @module imp-35193-rho-convergence-rate-modulus-measurement
 *
 * imp-35193 (numerical, frontier-measurement): MEASURE the empirical convergence-rate exponent theta and
 * constant K in the modulus |rho(eps) - 2/3| ~ K eps^theta on the imp-35076 ladder, characterizing the
 * imp-35152 O3 modulus-of-convergence that a finite 9-rung ladder cannot supply. imp-35152 named O3 (a
 * certified rate |rho(eps) - 2/3| <= K eps^theta) as the LOAD-BEARING missing ingredient closing gap G-b:
 * a bare limit rho -> 2/3 says nothing about the head eps ~ eps_0 where the a-fortiori margin is worst
 * (rho ~ 0.6754 at the smallest checked N is already the ladder max). This module fits the local log-log
 * slope of |rho(eps) - 2/3| against eps across the imp-35076 rungs to estimate theta and K, giving an
 * empirical (NON-certified) modulus of convergence. MEASUREMENT ONLY. It does NOT discharge O3 (no
 * certified constant, no error bars, model-cusp surrogate); G6a stays OPEN; NO QED.
 *
 * WHAT rho(eps) IS (inherited from imp-35076)
 * -------------------------------------------
 * On the shared quadratic fold z_0* = i eps (eps = y_N^sharp = sqrt(2 pi / N)) read on the model
 * Holder-1/2 cusp rho_cusp(x) = |x|^{-1/2} on [-1, 1], imp-35076 forms the a-fortiori margin ratio
 *     rho(eps) = C_ren(eps) / C_curv(eps),  C_ren = eps^{3/2}|m_prime|,  C_curv = eps^{5/2}|m_double_prime|,
 * and observes rho -> A_1 / A_2 = 2/3 monotonically from above as eps -> 0+ (A_1 = pi/sqrt(2), imp-33646;
 * A_2 = 3 pi/(2 sqrt(2)), imp-33645). This module re-forms rho on the SAME 9-rung ladder (identical
 * Simpson quadrature, x = +- u^2 cusp-removal route) and reads the DEVIATION dev(eps) = |rho(eps) - 2/3|.
 *
 * WHAT IS MEASURED
 * ----------------
 * (1) the deviation dev(eps) = |rho(eps) - 2/3| at each rung (monotone decreasing toward 0);
 * (2) the LOCAL log-log slope theta_i = d ln(dev) / d ln(eps) between consecutive rungs (the local
 *     convergence-rate exponent), which rises monotonically toward a limit;
 * (3) the OLS regression of ln(dev) on ln(eps) (full ladder and tail-5) for a global (theta, K);
 * (4) the constant K read as dev / eps^{theta_tail} at the tail (the empirical prefactor).
 *
 * RESULT (measured, this build)
 * -----------------------------
 * The local log-log slope theta_i climbs monotonically from ~1.4769 at the head (N = 1e3 -> 3e3) to
 * ~1.49999 at the tail (N = 3e6 -> 1e7): the empirical convergence-rate exponent is theta = 3/2. This is
 * the fingerprint of the Holder-1/2 cusp -- the leading correction to the amplitude ratio carries a
 * HALF-INTEGER power eps^{3/2}, not an integer power. The OLS tail-5 fit gives theta ~ 1.4999, K ~ 0.3999;
 * the prefactor read as dev / eps^{3/2} converges to K ~ 0.4001 (near 2/5 but NOT certified as a closed
 * form here). So the empirical modulus of convergence on the model cusp is
 *     |rho(eps) - 2/3|  ~  K eps^{3/2},   theta = 3/2,  K ~ 0.400.
 * Even at the worst (head) rung the deviation is ~8.8e-3 and rho ~ 0.6754 < 1, consistent with the imp-35076
 * a-fortiori margin holding across the ladder; the eps^{3/2} rate says the head deviation shrinks like the
 * 3/2-power of the strip height as eps -> eps_0 is lowered.
 *
 * WHY THIS DOES NOT DISCHARGE O3
 * ------------------------------
 * O3 asks for a CERTIFIED rate |rho(eps) - 2/3| <= K eps^theta uniform on (0, eps_0]. A least-squares slope
 * over 9 discrete rungs is an EMPIRICAL estimate: it has no rigorous error bar, it is read on the inherited
 * model-cusp surrogate (not the true RvM jet), and a finite sample cannot exclude a between-rung excursion
 * (gap G-a). The measurement PINS the plausible exponent (theta = 3/2) and prefactor (K ~ 0.4) an analytic
 * proof would target, but supplies neither the constant nor the uniform inequality. G-b stays OPEN.
 *
 * VERDICT: MEASUREMENT ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate. Fitting a
 * log-log slope on a finite eps ladder gives an empirical theta ~ 3/2 and K ~ 0.4 but does NOT certify a
 * modulus of convergence, does NOT discharge O3 or G6a, establishes no operator positivity, changes no
 * bound. G6a_shock_lipschitz stays OPEN; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb
 * remains GUE-conditional (imp-486); NO QED. No refereed bound is changed.
 *
 * @see imp-35076-h3-a-fortiori-discharges-h4-numerical-verification (the finite-ladder 2/3 margin measured here)
 * @see imp-35152-n-uniform-fold-modulus-back-conversion-scoping (names O3 / gap G-b as the load-bearing input)
 * @see imp-33790-fold-jet-mprime-mdoubleprime-ratio-crossvalidation (single-derivative coupling ratio 3/2)
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (A_1 = pi / sqrt(2), eps^{3/2} renorm)
 * @see imp-33645-h3-curvature-divergence-scoping (A_2 = 3 pi / (2 sqrt(2)), eps^{5/2} renorm)
 */

// Reading strip height y_N^sharp = sqrt(2 pi / N) (imp-341 / imp-354 convention); it descends to 0.
function ySharp(N) {
  return Math.sqrt((2 * Math.PI) / N);
}

// Complex arithmetic in [re, im] pairs (same quadrature route as imp-35076 / imp-33790).
const N_PANELS = 8000;
function cinv(a) {
  const d = a[0] * a[0] + a[1] * a[1];
  return [a[0] / d, -a[1] / d];
}
function cmul(a, b) {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
}
// B_p(sgn) = integral_0^1 1 / (i eps - sgn u^2)^p du by Simpson quadrature on [0, 1] (x = +- u^2 removes the cusp).
function branch(eps, sgn, p) {
  const h = 1 / N_PANELS;
  let re = 0;
  let im = 0;
  for (let i = 0; i <= N_PANELS; i++) {
    const u = i * h;
    const w = i === 0 || i === N_PANELS ? 1 : i % 2 === 1 ? 4 : 2;
    const z = [-sgn * u * u, eps]; // i eps - x, with x = sgn u^2
    let d = [1, 0];
    for (let k = 0; k < p; k++) d = cmul(d, z);
    const v = cinv(d);
    re += w * v[0];
    im += w * v[1];
  }
  return [(re * h) / 3, (im * h) / 3];
}
// m_prime = -2 [ B2(+) + B2(-) ]; m_double_prime = 4 [ B3(+) + B3(-) ] (magnitudes).
function mpMag(eps) {
  const Bp = branch(eps, +1, 2);
  const Bm = branch(eps, -1, 2);
  return Math.hypot(-2 * (Bp[0] + Bm[0]), -2 * (Bp[1] + Bm[1]));
}
function mppMag(eps) {
  const Bp = branch(eps, +1, 3);
  const Bm = branch(eps, -1, 3);
  return Math.hypot(4 * (Bp[0] + Bm[0]), 4 * (Bp[1] + Bm[1]));
}

const TWO_THIRDS = 2 / 3; // A_1 / A_2 = 2/3, the imp-35076 a-fortiori limit rho(eps) approaches from above.

// Re-form rho(eps) and the deviation dev(eps) = |rho - 2/3| on the SAME imp-35076 9-rung ladder.
const N_LADDER = [1e3, 3e3, 1e4, 3e4, 1e5, 3e5, 1e6, 3e6, 1e7];
const LADDER = N_LADDER.map((N) => {
  const eps = ySharp(N);
  const cRen = mpMag(eps) * Math.pow(eps, 1.5); // eps^{3/2}|m_prime|        -> A_1 (H4)
  const cCurv = mppMag(eps) * Math.pow(eps, 2.5); // eps^{5/2}|m_double_prime| -> A_2 (H3)
  const rho = cRen / cCurv; // -> 2/3 from above
  const dev = Math.abs(rho - TWO_THIRDS); // modulus of convergence sample
  return { N, eps, rho, dev };
});

// (2) LOCAL log-log slope theta_i = d ln(dev) / d ln(eps) between consecutive rungs.
const LOCAL_SLOPES = [];
for (let i = 1; i < LADDER.length; i++) {
  const theta =
    (Math.log(LADDER[i].dev) - Math.log(LADDER[i - 1].dev)) /
    (Math.log(LADDER[i].eps) - Math.log(LADDER[i - 1].eps));
  LOCAL_SLOPES.push({ fromN: LADDER[i - 1].N, toN: LADDER[i].N, theta: +theta.toFixed(6) });
}

// (3) OLS fit ln(dev) = ln(K) + theta ln(eps) over a set of rungs; returns { theta, K }.
function olsFit(rows) {
  const xs = rows.map((r) => Math.log(r.eps));
  const ys = rows.map((r) => Math.log(r.dev));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) * (xs[i] - mx);
  }
  const theta = sxy / sxx;
  const K = Math.exp(my - theta * mx);
  return { theta, K };
}
const OLS_FULL = olsFit(LADDER);
const OLS_TAIL5 = olsFit(LADDER.slice(-5));

const HEAD_SLOPE = LOCAL_SLOPES[0].theta; // ~1.4769 (worst rung, farthest from 3/2)
const TAIL_SLOPE = LOCAL_SLOPES[LOCAL_SLOPES.length - 1].theta; // ~1.49999 -> 3/2
const SLOPES_MONOTONE_UP = LOCAL_SLOPES.every((s, i) => i === 0 || s.theta >= LOCAL_SLOPES[i - 1].theta);
const DEV_MONOTONE_DOWN = LADDER.every((r, i) => i === 0 || r.dev <= LADDER[i - 1].dev);
// (4) prefactor K read as dev / eps^{3/2} at the tail rung (the empirical constant of the eps^{3/2} law).
const TAIL = LADDER[LADDER.length - 1];
const HEAD = LADDER[0];
const K_TAIL_AT_THREE_HALVES = TAIL.dev / Math.pow(TAIL.eps, 1.5);

export const IMP35193_RHO_CONVERGENCE_RATE_MODULUS_MEASUREMENT = {
  id: 'imp-35193',
  proofSection: 'S-frontier',
  scopes:
    'Measure the empirical convergence-rate exponent theta and constant K in |rho(eps) - 2/3| ~ K eps^theta ' +
    'on the imp-35076 ladder, characterizing the imp-35152 O3 modulus-of-convergence the finite ladder ' +
    'cannot supply',
  question:
    'Fitting the local log-log slope of |rho(eps) - 2/3| against eps across the imp-35076 rungs, what is the ' +
    'empirical convergence-rate exponent theta and prefactor K? Measurement only on the inherited surrogate; ' +
    'does NOT discharge O3 (no certified constant); G6a stays OPEN; no QED.',

  twoThirdsLimit: TWO_THIRDS, // rho(eps) -> 2/3 from above (imp-35076)
  ladder: LADDER.map((r) => ({
    N: r.N,
    y_N_sharp: +r.eps.toExponential(4),
    rho: +r.rho.toFixed(8),
    deviation: +r.dev.toExponential(5), // |rho - 2/3|
  })),
  localLogLogSlopes: LOCAL_SLOPES, // theta_i between consecutive rungs, rising toward 3/2

  // (2) the LOCAL convergence-rate exponent climbs monotonically to 3/2.
  headLocalSlope: HEAD_SLOPE, // ~1.4769 (farthest from 3/2, the head)
  tailLocalSlope: TAIL_SLOPE, // ~1.49999 -> 3/2
  localSlopesMonotoneIncreasing: SLOPES_MONOTONE_UP, // true: theta_i rises toward the limit
  empiricalThetaLimit: 1.5, // the fingerprint half-integer exponent of the Holder-1/2 cusp

  // (3) OLS regression of ln(dev) on ln(eps).
  olsFullLadderTheta: +OLS_FULL.theta.toFixed(6), // ~1.4971
  olsFullLadderK: +OLS_FULL.K.toFixed(6), // ~0.3934
  olsTail5Theta: +OLS_TAIL5.theta.toFixed(6), // ~1.4999
  olsTail5K: +OLS_TAIL5.K.toFixed(6), // ~0.3999

  // (4) the empirical prefactor of the eps^{3/2} law, read at the tail.
  kAtThreeHalvesTail: +K_TAIL_AT_THREE_HALVES.toFixed(6), // ~0.4001 (near 2/5, NOT certified)
  deviationMonotoneDecreasing: DEV_MONOTONE_DOWN, // true: dev shrinks with eps
  headDeviation: +HEAD.dev.toExponential(5), // ~8.76e-3 (worst rung, still rho < 1)
  headRho: +HEAD.rho.toFixed(6), // ~0.6754 (< 1: a-fortiori margin holds at the head)

  // The empirical modulus (NON-certified).
  empiricalModulus: 'rho(eps) - 2/3 ~ K eps^{3/2} with theta = 3/2 and K ~ 0.400 on the model cusp',
  couplingIsHalfInteger: true, // eps^{3/2}: half-integer power, the Holder-1/2 cusp fingerprint
  dischargesO3orG6a: false, // an OLS slope is empirical: no certified constant, no uniform inequality
  residualObstruction:
    'O3 asks for a CERTIFIED rate |rho(eps) - 2/3| <= K eps^theta uniform on (0, eps_0]; a least-squares ' +
    'slope over 9 discrete rungs pins theta ~ 3/2 and K ~ 0.4 but supplies no rigorous error bar, is read ' +
    'on the model-cusp surrogate, and cannot exclude a between-rung excursion (gap G-a); G-b stays OPEN',

  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate, G6a_shock_lipschitz ' +
    'STAYS OPEN. Re-forming the imp-35076 margin ratio rho(eps) = C_ren / C_curv on the same 9-rung eps = ' +
    'y_N^sharp ladder and fitting the local log-log slope of the deviation dev(eps) = |rho(eps) - 2/3| ' +
    'against eps, the local convergence-rate exponent theta_i climbs monotonically from ~1.4769 at the head ' +
    'to ~1.49999 at the tail: the empirical exponent is theta = 3/2, the HALF-INTEGER fingerprint of the ' +
    'Holder-1/2 cusp. The OLS tail-5 fit gives theta ~ 1.4999, and the prefactor read as dev / eps^{3/2} ' +
    'converges to K ~ 0.400 (near 2/5 but NOT certified). So the empirical modulus of convergence is ' +
    '|rho(eps) - 2/3| ~ K eps^{3/2} with K ~ 0.4. This PINS the exponent and prefactor an analytic proof of ' +
    'O3 would target but does NOT discharge O3 (no certified constant, no error bar, model-cusp surrogate, ' +
    'finite ladder), establishes no operator positivity, changes no bound. imp-3066 off-diagonal endpoint- ' +
    'Hankel K_a >= 0 UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED. No refereed bound is changed' +
    '.',
};

export const IMP35193_RHO_CONVERGENCE_RATE_ASSERTIONS = [
  {
    // (1) the tail local log-log slope reproduces the empirical exponent 3/2.
    id: 'imp35193-tail-local-slope-is-three-halves',
    description: 'tail local log-log slope d ln(dev) / d ln(eps) -> 3/2 = 1.5 (the Holder-1/2 fingerprint)',
    holds: () => Math.abs(IMP35193_RHO_CONVERGENCE_RATE_MODULUS_MEASUREMENT.tailLocalSlope - 1.5) < 1e-3,
  },
  {
    // (2) the local slope climbs monotonically toward 3/2 (head slope strictly below the tail slope).
    id: 'imp35193-local-slopes-climb-to-three-halves',
    description: 'local convergence-rate exponent rises monotonically; head slope < tail slope < 1.5',
    holds: () =>
      IMP35193_RHO_CONVERGENCE_RATE_MODULUS_MEASUREMENT.localSlopesMonotoneIncreasing === true &&
      IMP35193_RHO_CONVERGENCE_RATE_MODULUS_MEASUREMENT.headLocalSlope <
        IMP35193_RHO_CONVERGENCE_RATE_MODULUS_MEASUREMENT.tailLocalSlope &&
      IMP35193_RHO_CONVERGENCE_RATE_MODULUS_MEASUREMENT.tailLocalSlope < 1.5,
  },
  {
    // (3) the OLS tail-5 regression confirms theta ~ 3/2 independently of the local-slope reading.
    id: 'imp35193-ols-tail-slope-near-three-halves',
    description: 'OLS tail-5 slope of ln(dev) on ln(eps) is within 3e-3 of 3/2',
    holds: () => Math.abs(IMP35193_RHO_CONVERGENCE_RATE_MODULUS_MEASUREMENT.olsTail5Theta - 1.5) < 3e-3,
  },
  {
    // (4) the empirical prefactor K = dev / eps^{3/2} at the tail sits in a tight band near 0.400.
    id: 'imp35193-prefactor-near-two-fifths',
    description: 'K = dev / eps^{3/2} at the tail is in [0.395, 0.405] (empirical, near 2/5, not certified)',
    holds: () => {
      const k = IMP35193_RHO_CONVERGENCE_RATE_MODULUS_MEASUREMENT.kAtThreeHalvesTail;
      return k > 0.395 && k < 0.405;
    },
  },
  {
    // (5) the deviation is monotone decreasing and the head rung (worst) still has rho < 1.
    id: 'imp35193-deviation-monotone-head-below-one',
    description: 'dev(eps) = |rho - 2/3| monotone decreasing; worst (head) rho ~ 0.6754 < 1',
    holds: () =>
      IMP35193_RHO_CONVERGENCE_RATE_MODULUS_MEASUREMENT.deviationMonotoneDecreasing === true &&
      IMP35193_RHO_CONVERGENCE_RATE_MODULUS_MEASUREMENT.headRho < 1 &&
      IMP35193_RHO_CONVERGENCE_RATE_MODULUS_MEASUREMENT.headRho > TWO_THIRDS,
  },
  {
    // Honesty gate: measurement only; does NOT discharge O3/G6a, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp35193-honesty-gate-no-qed',
    description:
      'Measurement only: empirical theta/K estimated but O3/G6a NOT discharged, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP35193_RHO_CONVERGENCE_RATE_MODULUS_MEASUREMENT.isRigorous === false &&
      IMP35193_RHO_CONVERGENCE_RATE_MODULUS_MEASUREMENT.dischargesO3orG6a === false &&
      /NO QED/.test(IMP35193_RHO_CONVERGENCE_RATE_MODULUS_MEASUREMENT.verdict) &&
      /STAYS OPEN/.test(IMP35193_RHO_CONVERGENCE_RATE_MODULUS_MEASUREMENT.verdict) &&
      /refereed bound is changed/i.test(IMP35193_RHO_CONVERGENCE_RATE_MODULUS_MEASUREMENT.verdict) &&
      /imp-3066 off-diagonal endpoint-\s*Hankel K_a >= 0 UNTOUCHED/.test(
        IMP35193_RHO_CONVERGENCE_RATE_MODULUS_MEASUREMENT.verdict,
      ),
  },
];

for (const a of IMP35193_RHO_CONVERGENCE_RATE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35193-rho-convergence-rate-modulus-measurement assertion failed: ${a.id}`);
  }
}
