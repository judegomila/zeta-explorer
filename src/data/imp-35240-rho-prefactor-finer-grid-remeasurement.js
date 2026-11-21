/**
 * @module imp-35240-rho-prefactor-finer-grid-remeasurement
 *
 * imp-35240 (accuracy, frontier-measurement): INDEPENDENTLY re-measure the model-cusp convergence
 * prefactor K in |rho(eps) - 2/3| ~ K eps^{3/2} on a FINER, SMALLER-eps grid, to test whether the
 * imp-35216 DERIVED closed form K = 4/(3 A_2) = 8 sqrt(2)/(9 pi) = 0.4001405849... fits the tail
 * better than 2/5 = 0.4000, as imp-35216 asserts from its analytic expansion. imp-35193 read K two
 * ways (OLS tail-5 ~0.3999, dev/eps^{3/2} tail ~0.4001) on a ladder that FLOORED at N = 1e7
 * (eps = y_N^sharp ~ 7.9e-4) and could NOT separate 0.40014 from 0.40000 (the ~3.5e-4 gap was below
 * its resolution). This module pushes eps a further ~3 decades down (to eps = 1e-6, N ~ 6.3e12) and
 * re-reads dev/eps^{3/2} on a numerically-clean route. MEASUREMENT ONLY. It does NOT discharge O3
 * (no certified constant, no error bar, model-cusp surrogate); G6a stays OPEN; NO QED.
 *
 * WHY imp-35193 COULD NOT RESOLVE, AND WHAT THIS DOES DIFFERENTLY
 * -------------------------------------------------------------
 * imp-35193 formed rho(eps) by direct Simpson quadrature of the branch integrals on the fixed unit
 * interval u in [0, 1]. As eps -> 0 the integrand there develops a peak of width ~sqrt(eps) that a
 * fixed panel count cannot resolve, so the ladder stalled at eps ~ 7.9e-4 -- where the O(eps) finite-
 * size bias in dev/eps^{3/2} is itself ~1e-3, LARGER than the 3.5e-4 gap being tested. This module
 * uses the imp-35216 rescaling u = sqrt(eps) t, which sends each conjugate branch pair to the REAL
 * finite-cutoff integral
 *     F_p(L) = integral_0^L [ (t^2 - i)^{-p} + (t^2 + i)^{-p} ] dt,   L = eps^{-1/2},
 * with C_ren = 2 |F_2(L)|, C_curv = 4 |F_3(L)| and rho(eps) = |F_2(L)| / (2 |F_3(L)|). Here the
 * eps-dependence lives ONLY in the cutoff L, and the integrand g_p(t) is smooth and decays like
 * t^{-2p}, so the quadrature stays accurate at arbitrarily small eps (large L). The infinite-cutoff
 * values F_p(infinity) are computed by a KAHAN-COMPENSATED mapped Simpson rule (t = s/(1-s)) that
 * reaches machine precision (|F_2(inf) + A_1/2| = 0, |F_3(inf) + A_2/4| ~ 2e-16), so the tiny
 * deviation dev = rho - 2/3 is NOT swamped by summation roundoff. The missing tails
 * R_p(L) = integral_L^infinity g_p dt are read by a separate compensated quadrature (t = L/w), so
 * |F_p(L)| = |F_p(infinity)| + R_p(L) is formed with no analytic tail assumption -- a genuine numerical
 * measurement of rho, not a re-statement of the imp-35216 expansion.
 *
 * RESULT (measured, this build)
 * -----------------------------
 * On the finer ladder eps = {1e-4, 3e-5, 1e-5, 3e-6, 1e-6} (N = 2 pi / eps^2 from ~6.3e8 to ~6.3e12)
 * the prefactor K = (rho - 2/3) / eps^{3/2} climbs MONOTONICALLY toward 8 sqrt(2)/(9 pi):
 *     eps = 1e-4 : K = 0.40010857   eps = 3e-5 : K = 0.40013098   eps = 1e-5 : K = 0.40013739
 *     eps = 3e-6 : K = 0.40013963   eps = 1e-6 : K = 0.40014025
 * At the smallest rung (eps = 1e-6) K = 0.40014025 sits |K - 8 sqrt(2)/(9 pi)| ~ 3.3e-7 from the
 * derived closed form but |K - 2/5| ~ 1.40e-4 from 2/5 -- a ~424x discrimination in favour of
 * 8 sqrt(2)/(9 pi). The residual to the closed form shrinks like O(eps) (the physical next-order term),
 * confirming the eps^{3/2} law with prefactor K = 8 sqrt(2)/(9 pi), NOT 2/5. So the finer grid
 * INDEPENDENTLY confirms the imp-35216 verdict: the model-cusp modulus is
 *     |rho(eps) - 2/3| ~ [8 sqrt(2)/(9 pi)] eps^{3/2},   NOT (2/5) eps^{3/2}.
 * The 2/5 that imp-35193 drifted near is the F_3 (denominator / H3) tail coefficient, a coincidence.
 *
 * WHY THIS DOES NOT DISCHARGE O3
 * ------------------------------
 * O3 asks for a CERTIFIED two-sided rate |rho(eps) - 2/3| <= K eps^theta uniform on (0, eps_0], with a
 * rigorous remainder bound and on the TRUE RvM cusp jet. A pointwise numerical read of dev/eps^{3/2} on
 * a finite eps ladder -- however fine -- supplies neither the uniform inequality nor an error bar, and
 * is measured on the inherited model-cusp surrogate. It PINS the prefactor an analytic proof would
 * target (agreeing with imp-35216 to ~3e-7) but discharges nothing. G-b / G6a stay OPEN.
 *
 * VERDICT: MEASUREMENT ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate. Pushing
 * eps ~3 decades below the imp-35193 floor with a compensated finite-cutoff quadrature reads the
 * prefactor K -> 8 sqrt(2)/(9 pi) = 0.40014 (matched to ~3.3e-7 at eps = 1e-6, ~424x closer than 2/5),
 * INDEPENDENTLY confirming the imp-35216 closed form and refuting 2/5. It does NOT certify a uniform
 * modulus, does NOT discharge O3 or G6a, establishes no operator positivity, changes no bound.
 * G6a_shock_lipschitz stays OPEN; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb
 * remains GUE-conditional (imp-486); NO QED. No refereed bound is changed.
 *
 * @see imp-35216-rho-prefactor-closed-form-assessment (derived K = 8 sqrt(2)/(9 pi), asserted vs 2/5)
 * @see imp-35193-rho-convergence-rate-modulus-measurement (measured theta ~ 3/2, K ~ 0.400, floored at N = 1e7)
 * @see imp-35076-h3-a-fortiori-discharges-h4-numerical-verification (the finite-ladder 2/3 margin)
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (A_1 = pi/sqrt(2), eps^{3/2} renorm)
 * @see imp-33645-h3-curvature-divergence-scoping (A_2 = 3 pi/(2 sqrt(2)), eps^{5/2} renorm)
 */

const PI = Math.PI;
const SQRT2 = Math.SQRT2;

// Inherited amplitude constants (used only as reference checks, not in the measured route).
const A1 = PI / SQRT2; // imp-33646, eps^{3/2} renorm of |m_prime|  -> F_2(infinity) = -A_1/2
const A2 = (3 * PI) / (2 * SQRT2); // imp-33645, eps^{5/2} renorm of |m_double_prime| -> F_3(infinity) = -A_2/4

// The two closed-form candidates for the eps^{3/2} prefactor.
const K_CLOSED_FORM = (8 * SQRT2) / (9 * PI); // = 4/(3 A_2) = 0.4001405849... (imp-35216 derived value)
const TWO_FIFTHS = 2 / 5; // the near-miss candidate imp-35193 drifted near

// Real integrand g_p(t) = (t^2 - i)^{-p} + (t^2 + i)^{-p} (imaginary parts cancel; conjugate branches).
function gp(p, t) {
  const t2 = t * t;
  const t4 = t2 * t2;
  if (p === 2) {
    // (t^2 - i)^2 = (t^4 - 1) - 2 t^2 i  =>  sum = 2 (t^4 - 1) / ((t^4 - 1)^2 + 4 t^4)
    const A = t4 - 1;
    return (2 * A) / (A * A + 4 * t4);
  }
  // (t^2 - i)^3 = (t^6 - 3 t^2) + (1 - 3 t^4) i  =>  sum = 2 (t^6 - 3 t^2) / ((t^6 - 3 t^2)^2 + (1 - 3 t^4)^2)
  const t6 = t4 * t2;
  const A = t6 - 3 * t2;
  const B = 1 - 3 * t4;
  return (2 * A) / (A * A + B * B);
}

// Kahan-compensated composite-Simpson rule over [0, 1] with `panels` intervals (panels even).
// Compensation is essential: the deviation dev = rho - 2/3 is ~4e-10 at eps = 1e-6, far below the
// ~1e-14 roundoff floor a plain sum of ~1e6 terms would leave.
function compensatedSimpson(f, panels) {
  const h = 1 / panels;
  let sum = 0;
  let comp = 0;
  for (let i = 0; i <= panels; i++) {
    const w = i === 0 || i === panels ? 1 : i % 2 === 1 ? 4 : 2;
    const y = w * f(i * h) - comp;
    const t = sum + y;
    comp = t - sum - y;
    sum = t;
  }
  return (sum * h) / 3;
}

// F_p(infinity) = integral_0^infinity g_p(t) dt via t = s/(1-s), dt = ds/(1-s)^2 (integrand -> 0 at s = 1).
function fInfinity(p, panels) {
  return compensatedSimpson((x) => {
    if (x >= 1) return 0;
    const oneMinus = 1 - x;
    const t = x / oneMinus;
    return gp(p, t) / (oneMinus * oneMinus);
  }, panels);
}

// R_p(L) = integral_L^infinity g_p(t) dt via t = L/w, dt = (L/w^2) dw, w in (0, 1] (integrand -> 0 at w = 0).
function tailIntegral(p, L, panels) {
  return compensatedSimpson((w) => {
    if (w === 0) return 0;
    const t = L / w;
    return gp(p, t) * (L / (w * w));
  }, panels);
}

// Compute the machine-precision infinite-cutoff values ONCE.
const F2_INF = fInfinity(2, 1000000);
const F3_INF = fInfinity(3, 1000000);
const ABS_F2_INF = Math.abs(F2_INF);
const ABS_F3_INF = Math.abs(F3_INF);

const TWO_THIRDS = 2 / 3; // A_1 / A_2 = 2/3, the imp-35076 a-fortiori limit rho(eps) approaches from above.

// The finer, smaller-eps ladder: eps = y_N^sharp descends ~3 decades below the imp-35193 floor (~7.9e-4).
const EPS_LADDER = [1e-4, 3e-5, 1e-5, 3e-6, 1e-6];
const LADDER = EPS_LADDER.map((eps) => {
  const L = 1 / Math.sqrt(eps);
  const absF2 = ABS_F2_INF + tailIntegral(2, L, 300000); // |F_2(L)| = |F_2(inf)| + R_2(L)
  const absF3 = ABS_F3_INF + tailIntegral(3, L, 300000); // |F_3(L)| = |F_3(inf)| + R_3(L)
  const rho = absF2 / (2 * absF3); // -> 2/3 from above
  const dev = rho - TWO_THIRDS; // modulus of convergence sample (positive)
  const K = dev / Math.pow(eps, 1.5); // the empirical eps^{3/2} prefactor
  const N = (2 * PI) / (eps * eps); // reading depth N = 2 pi / eps^2
  return { eps, N, L, rho, dev, K };
});

const BEST = LADDER[LADDER.length - 1]; // smallest eps = 1e-6, N ~ 6.3e12
const DIST_TO_CLOSED_FORM = Math.abs(BEST.K - K_CLOSED_FORM); // ~3.3e-7
const DIST_TO_TWO_FIFTHS = Math.abs(BEST.K - TWO_FIFTHS); // ~1.40e-4
const DISCRIMINATION_RATIO = DIST_TO_TWO_FIFTHS / DIST_TO_CLOSED_FORM; // ~424x

// K climbs monotonically toward the closed form (residual to it shrinks like O(eps)).
const K_MONOTONE_TOWARD_CLOSED_FORM = LADDER.every(
  (r, i) => i === 0 || Math.abs(r.K - K_CLOSED_FORM) <= Math.abs(LADDER[i - 1].K - K_CLOSED_FORM),
);
const DEV_MONOTONE_DOWN = LADDER.every((r, i) => i === 0 || r.dev <= LADDER[i - 1].dev);

export const IMP35240_RHO_PREFACTOR_FINER_GRID_REMEASUREMENT = {
  id: 'imp-35240',
  proofSection: 'S-frontier',
  scopes:
    'Independently re-measure the model-cusp prefactor K in |rho(eps) - 2/3| ~ K eps^{3/2} on a finer, ' +
    'smaller-eps grid to test whether the imp-35216 derived closed form 8 sqrt(2)/(9 pi) fits the tail ' +
    'better than 2/5, resolving the ~3.5e-4 gap the imp-35193 ladder could not',
  question:
    'Pushing eps ~3 decades below the imp-35193 N = 1e7 floor with a compensated finite-cutoff quadrature, ' +
    'does the measured prefactor K = (rho - 2/3)/eps^{3/2} converge to 8 sqrt(2)/(9 pi) = 0.40014 or to ' +
    '2/5 = 0.40000? Measurement only on the inherited surrogate; does NOT discharge O3; G6a stays OPEN; no QED.',

  twoThirdsLimit: TWO_THIRDS, // rho(eps) -> 2/3 from above (imp-35076)

  // Numerical infinite-cutoff values reach machine precision (so dev = rho - 2/3 is not swamped by roundoff).
  fTwoInfinityResidual: +(F2_INF + A1 / 2).toExponential(3), // |F_2(inf) + A_1/2| ~ 0
  fThreeInfinityResidual: +(F3_INF + A2 / 4).toExponential(3), // |F_3(inf) + A_2/4| ~ 2e-16

  ladder: LADDER.map((r) => ({
    eps: +r.eps.toExponential(1),
    N: +r.N.toExponential(3),
    rho: +r.rho.toFixed(10),
    deviation: +r.dev.toExponential(5), // |rho - 2/3|
    K: +r.K.toFixed(8), // dev / eps^{3/2}
  })),

  // The two candidate closed forms.
  kClosedFormExpr: 'K = 4/(3 A_2) = 8 sqrt(2)/(9 pi)',
  kClosedFormValue: +K_CLOSED_FORM.toFixed(10), // 0.4001405850
  candidateTwoFifths: TWO_FIFTHS, // 0.4000

  // The discrimination at the smallest rung (eps = 1e-6, N ~ 6.3e12).
  bestEps: +BEST.eps.toExponential(1),
  bestN: +BEST.N.toExponential(3),
  bestK: +BEST.K.toFixed(8), // 0.40014025
  distToClosedForm: +DIST_TO_CLOSED_FORM.toExponential(3), // ~3.31e-7
  distToTwoFifths: +DIST_TO_TWO_FIFTHS.toExponential(3), // ~1.40e-4
  discriminationRatio: +DISCRIMINATION_RATIO.toFixed(1), // ~424x closer to 8 sqrt(2)/(9 pi)
  closedFormBeatsTwoFifths: DIST_TO_CLOSED_FORM < DIST_TO_TWO_FIFTHS, // true, decisively

  kMonotoneTowardClosedForm: K_MONOTONE_TOWARD_CLOSED_FORM, // true: residual to 8 sqrt(2)/(9 pi) shrinks like O(eps)
  deviationMonotoneDecreasing: DEV_MONOTONE_DOWN, // true: dev shrinks with eps

  couplingIsHalfInteger: true, // eps^{3/2}: the Holder-1/2 cusp fingerprint (matches imp-35193 / imp-35216)
  dischargesO3orG6a: false, // a pointwise numerical read is not a certified uniform inequality
  residualObstruction:
    'O3 asks for a CERTIFIED two-sided rate |rho(eps) - 2/3| <= K eps^{3/2} uniform on (0, eps_0] with a ' +
    'rigorous remainder bound and on the TRUE RvM cusp jet; a pointwise numerical read of dev/eps^{3/2} on a ' +
    'finite eps ladder, however fine, supplies neither the uniform inequality nor an error bar and is on the ' +
    'model-cusp surrogate; G-b stays OPEN',

  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate, G6a_shock_lipschitz ' +
    'STAYS OPEN. Rescaling u = sqrt(eps) t to the finite-cutoff form rho(eps) = |F_2(L)|/(2 |F_3(L)|), ' +
    'L = eps^{-1/2}, and reading |F_p(L)| = |F_p(inf)| + R_p(L) with Kahan-compensated Simpson quadrature ' +
    '(machine-precision F_p(inf), no analytic tail assumption), the prefactor K = (rho - 2/3)/eps^{3/2} climbs ' +
    'MONOTONICALLY across eps = {1e-4 .. 1e-6} to K = 0.40014025 at eps = 1e-6 (N ~ 6.3e12), matching the ' +
    'imp-35216 derived 8 sqrt(2)/(9 pi) = 0.40014 to ~3.3e-7 -- ~424x closer than to 2/5 (~1.40e-4). This ' +
    'INDEPENDENTLY confirms the imp-35216 closed form and refutes 2/5 (the F_3 denominator tail coincidence), ' +
    'resolving the ~3.5e-4 gap the imp-35193 ladder (floored at N = 1e7) could not. It does NOT certify a ' +
    'uniform modulus, does NOT discharge O3 or G6a, establishes no operator positivity, changes no bound. ' +
    'imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED. ' +
    'No refereed bound is changed.',
};

export const IMP35240_RHO_PREFACTOR_FINER_GRID_ASSERTIONS = [
  {
    // (1) the machine-precision infinite-cutoff values reproduce A_1/2 and A_2/4 (route sanity).
    id: 'imp35240-finf-machine-precision',
    description: 'compensated F_p(inf) reproduce -A_1/2 and -A_2/4 to < 1e-12 (dev = rho - 2/3 not swamped by roundoff)',
    holds: () => Math.abs(F2_INF + A1 / 2) < 1e-12 && Math.abs(F3_INF + A2 / 4) < 1e-12,
  },
  {
    // (2) the smallest-rung prefactor lands on 8 sqrt(2)/(9 pi) to < 1e-5.
    id: 'imp35240-best-k-matches-closed-form',
    description: 'K at eps = 1e-6 matches 8 sqrt(2)/(9 pi) = 0.40014 to within 1e-5',
    holds: () => Math.abs(BEST.K - K_CLOSED_FORM) < 1e-5,
  },
  {
    // (3) the finer grid DISCRIMINATES 8 sqrt(2)/(9 pi) from 2/5 decisively (>= 50x closer).
    id: 'imp35240-discriminates-closed-form-from-two-fifths',
    description: 'K at eps = 1e-6 is at least 50x closer to 8 sqrt(2)/(9 pi) than to 2/5 (resolves the ~3.5e-4 gap)',
    holds: () =>
      DIST_TO_CLOSED_FORM < DIST_TO_TWO_FIFTHS &&
      DIST_TO_TWO_FIFTHS / DIST_TO_CLOSED_FORM >= 50 &&
      DIST_TO_TWO_FIFTHS > 1e-4,
  },
  {
    // (4) the prefactor climbs monotonically toward the closed form as eps shrinks (residual is O(eps)).
    id: 'imp35240-k-monotone-toward-closed-form',
    description: 'residual |K - 8 sqrt(2)/(9 pi)| shrinks monotonically across the ladder; dev monotone down',
    holds: () =>
      IMP35240_RHO_PREFACTOR_FINER_GRID_REMEASUREMENT.kMonotoneTowardClosedForm === true &&
      IMP35240_RHO_PREFACTOR_FINER_GRID_REMEASUREMENT.deviationMonotoneDecreasing === true,
  },
  {
    // (5) the ladder genuinely pushes below the imp-35193 floor (smallest eps at least a decade smaller).
    id: 'imp35240-grid-below-imp35193-floor',
    description: 'smallest eps (1e-6) is well below the imp-35193 floor eps ~ 7.9e-4 (N pushed past 1e12)',
    holds: () => BEST.eps < 1e-4 && BEST.N > 1e12,
  },
  {
    // Honesty gate: measurement only; does NOT discharge O3/G6a, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp35240-honesty-gate-no-qed',
    description:
      'Measurement only: prefactor confirmed but O3/G6a NOT discharged, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP35240_RHO_PREFACTOR_FINER_GRID_REMEASUREMENT.isRigorous === false &&
      IMP35240_RHO_PREFACTOR_FINER_GRID_REMEASUREMENT.dischargesO3orG6a === false &&
      /NO QED/.test(IMP35240_RHO_PREFACTOR_FINER_GRID_REMEASUREMENT.verdict) &&
      /STAYS OPEN/.test(IMP35240_RHO_PREFACTOR_FINER_GRID_REMEASUREMENT.verdict) &&
      /refereed bound is changed/i.test(IMP35240_RHO_PREFACTOR_FINER_GRID_REMEASUREMENT.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(
        IMP35240_RHO_PREFACTOR_FINER_GRID_REMEASUREMENT.verdict,
      ),
  },
];

for (const a of IMP35240_RHO_PREFACTOR_FINER_GRID_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35240-rho-prefactor-finer-grid-remeasurement assertion failed: ${a.id}`);
  }
}
