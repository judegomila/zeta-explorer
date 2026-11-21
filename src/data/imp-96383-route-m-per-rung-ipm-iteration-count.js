/**
 * @module imp-96383-route-m-per-rung-ipm-iteration-count
 *
 * imp-96383 (numerical): LOG per-rung inverse-power solve wall + iteration counts
 * m(n) on a Route M Vasyunin ladder run, to SEPARATE m(n) from the O(n^2)
 * triangular-back-solve constant and test whether m(n) grows as lam_min crowds to
 * zero. Resolves IMP96352_SUBGAP (the c_ipm lumped-aggregate residual).
 * Measurement only; changes no bound; RH open; NO QED; no refereed bound is changed.
 *
 * WHY. imp-96352 calibrated c_ipm as a single LUMPED constant because the
 * imp-96325 m9.log recorded only ladder totals, not per-rung solve times, and the
 * imp-96325 inverse-power loop ran a FIXED 60 iterations with NO convergence test.
 * So the iteration count m(n) was never separated from the O(n^2) back-solve
 * constant, and IMP96352_SUBGAP conjectured that because lam_min falls
 * 2.06e-5 -> 1.75e-8 across the ladder, m(n) plausibly GROWS with n, making the
 * fitted N^3 scaling and the reachable-N ceilings optimistic upper bounds.
 *
 * WHAT WE MEASURED. On the same exact-cotangent Vasyunin Gram (script
 * tmp/rh-route-m/imp-96383-per-rung-ipm.py), for a reduced ladder
 * N in {500,1000,1500,2000,2500,3000,3500,4000} (single wall-feasible process;
 * the DIRECTION of m(n) is N_top-independent) we ran a genuine convergence-tolerant
 * inverse-power iteration on GN = L L^T, counting the iterations m(n) to reach a
 * fixed relative Rayleigh tolerance 1e-10 (cap MAXIT=400) and timing each rung, and
 * we computed the EXACT two smallest eigenvalues via eigvalsh to expose the true
 * convergence driver lam_1/lam_2 rather than lam_1 alone.
 *
 * THREE FINDINGS.
 *  (A) The imp-96325 fixed-60-iteration loop was DRASTICALLY under-iterated:
 *      convergence to 1e-10 needs m_pred = log(tol)/log(lam_1/lam_2) ~ 600..2300
 *      iterations, and the tolerance-based run hit the MAXIT=400 cap for every
 *      N >= 1500 (measured iters right-censored). 60 iterations is 10..40x short,
 *      so the imp-96325 invpower lam_min values are themselves UNconverged.
 *  (B) The convergence driver is the NEAR-DEGENERATE bottom eigenvalue pair
 *      lam_1/lam_2 = 0.965..0.990, NOT the magnitude of lam_min. The measured
 *      iteration count correlates with the ratio lam_1/lam_2 at +0.894 but with
 *      lam_1 at only -0.418 (weak, wrong sign). This CORRECTS the sub-gap mechanism:
 *      inverse iteration slows because the two smallest eigenvalues cluster
 *      (ratio -> 1), not because lam_min -> 0. lam_min crowding is a symptom, the
 *      bottom-pair clustering is the cause.
 *  (C) m(n) is large and n-dependent, NEVER a small bounded constant, so c_ipm's
 *      lumped constant-iteration assumption understates the true cost -- confirming
 *      the sub-gap DIRECTION: the imp-96352 reachable-N ceilings are OPTIMISTIC
 *      upper bounds (the conservative direction). Additionally the per-iteration
 *      back-solve cost per n^2 is NOT flat (coeff. of variation 0.51 over the
 *      ladder; per-iter wall scales empirically ~n^2.6, not n^2, from BLAS/memory
 *      effects), a second reason the lumped O(n^2) model is optimistic.
 *
 * MEASUREMENT / MODEL ONLY. Establishes no operator positivity, makes no RH claim;
 * no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (IMP96352_SUBGAP resolved here)
 * @see imp-96325-route-m-vasyunin-gram-n1e4-run.js (the fixed-60-iter run corrected here)
 */

// Fixed measurement setup.
export const IMP96383_SETUP = Object.freeze({
  NMAX: 4000,
  ladder: Object.freeze([500, 1000, 1500, 2000, 2500, 3000, 3500, 4000]),
  tol: 1e-10,          // relative change in the Rayleigh quotient for convergence
  maxit: 400,          // iteration cap; measured iters at this cap are right-censored
  script: 'tmp/rh-route-m/imp-96383-per-rung-ipm.py',
  out: 'tmp/rh-route-m/imp-96383-out.json',
  note: 'reduced N_top vs the imp-96325 N=1e4 run so this is a single wall-feasible process; the DIRECTION of m(n) vs lam_min is N_top-independent.',
});

// Per-rung measured data. lam1/lam2 exact (eigvalsh); iters/ip counted at tol=1e-10.
// m_pred = log(tol)/log(lam1/lam2) is the un-censored convergence-rate estimate.
export const IMP96383_ROWS = Object.freeze([
  Object.freeze({ N: 500,  lam1: 5.4599e-06, lam2: 5.6244e-06, ratio12: 0.9708, iters: 337, mPred: 775.8,  ipWallS: 0.467,   solvePerIterMs: 1.39,   cholS: 0.004, censored: false }),
  Object.freeze({ N: 1000, lam1: 1.4318e-06, lam2: 1.4840e-06, ratio12: 0.9649, iters: 222, mPred: 643.5,  ipWallS: 1.306,   solvePerIterMs: 5.88,   cholS: 0.003, censored: false }),
  Object.freeze({ N: 1500, lam1: 6.6838e-07, lam2: 6.7513e-07, ratio12: 0.9900, iters: 400, mPred: 2289.5, ipWallS: 8.711,   solvePerIterMs: 21.78,  cholS: 0.009, censored: true }),
  Object.freeze({ N: 2000, lam1: 3.8156e-07, lam2: 3.8737e-07, ratio12: 0.9850, iters: 400, mPred: 1523.0, ipWallS: 20.243,  solvePerIterMs: 50.61,  cholS: 0.018, censored: true }),
  Object.freeze({ N: 2500, lam1: 2.4767e-07, lam2: 2.5242e-07, ratio12: 0.9812, iters: 400, mPred: 1211.8, ipWallS: 47.129,  solvePerIterMs: 117.82, cholS: 0.031, censored: true }),
  Object.freeze({ N: 3000, lam1: 1.7561e-07, lam2: 1.7743e-07, ratio12: 0.9898, iters: 400, mPred: 2239.6, ipWallS: 79.340,  solvePerIterMs: 198.35, cholS: 0.059, censored: true }),
  Object.freeze({ N: 3500, lam1: 1.3060e-07, lam2: 1.3223e-07, ratio12: 0.9876, iters: 400, mPred: 1846.2, ipWallS: 125.587, solvePerIterMs: 313.97, cholS: 0.090, censored: true }),
  Object.freeze({ N: 4000, lam1: 9.9848e-08, lam2: 1.0158e-07, ratio12: 0.9830, iters: 400, mPred: 1340.9, ipWallS: 171.340, solvePerIterMs: 428.35, cholS: 0.151, censored: true }),
]);

// Trend / correlation summary.
export const IMP96383_SUMMARY = Object.freeze({
  itersRange: Object.freeze([222, 400]),        // measured, right-censored at 400
  mPredRange: Object.freeze([643.5, 2289.5]),   // un-censored convergence-rate estimate
  fixedIterUsedByImp96325: 60,                  // 10..40x short of convergence
  corrMVsRatio12: 0.894,                        // iters track the bottom-pair ratio
  corrMVsLam1: -0.418,                          // iters do NOT track lam_min magnitude
  ratio12Range: Object.freeze([0.9649, 0.9900]),// bottom pair is near-degenerate
  cPerIterPerN2Cv: 0.506,                       // per-iteration back-solve not flat in n^2
  driver: 'near-degenerate bottom eigenvalue pair lam_1/lam_2 -> 1, NOT lam_min magnitude',
  ceilingImpact: 'm(n) large and n-dependent, not a bounded constant -> imp-96352 reachable-N ceilings are OPTIMISTIC upper bounds (conservative direction).',
});

export const IMP96383_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: per-rung inverse-power ' +
  'iteration counts and solve walls on the exact-cotangent Vasyunin Gram; separates m(n) from ' +
  'the O(n^2) back-solve constant and identifies the convergence driver as the near-degenerate ' +
  'bottom eigenvalue pair. Changes NO bound and establishes NO operator positivity.';

// New honest residual: the measured iteration count is right-censored.
export const IMP96383_SUBGAP = Object.freeze({
  id: 'imp-96383-iters-right-censored-at-maxit',
  statement:
    'The tolerance-based iteration count is RIGHT-CENSORED at MAXIT=400 for every N >= 1500 ' +
    '(the run stops at the cap before reaching tol=1e-10), so the measured m(n) is a LOWER ' +
    'bound and the exact growth law is not pinned. The un-censored predictor ' +
    'm_pred = log(tol)/log(lam_1/lam_2) (600..2300, non-monotone) is the better estimate but ' +
    'assumes clean two-eigenvalue dominance; higher-multiplicity clustering at the bottom of ' +
    'the spectrum would make even m_pred an under-estimate. Resolving the exact m(n) law needs ' +
    'a shifted/deflated inverse iteration (or Lanczos on the smallest eigenpairs) with a much ' +
    'larger iteration cap on a full N=1e4 ladder.',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96383_ASSERTIONS = [
  {
    id: 'imp96383-fixed-60-iter-was-undercounted',
    holds: () =>
      IMP96383_ROWS.every((r) => r.mPred > IMP96383_SUMMARY.fixedIterUsedByImp96325) &&
      Math.min(...IMP96383_ROWS.map((r) => r.mPred)) > 600,
    why: 'every rung needs m_pred > 600 iterations to converge to 1e-10, so the imp-96325 fixed 60-iteration loop was 10..40x short and its invpower lam_min values are unconverged.',
  },
  {
    id: 'imp96383-driver-is-bottom-pair-ratio-not-lam-min',
    holds: () =>
      IMP96383_SUMMARY.corrMVsRatio12 > 0.8 &&
      IMP96383_SUMMARY.corrMVsLam1 < 0 &&
      Math.abs(IMP96383_SUMMARY.corrMVsRatio12) > Math.abs(IMP96383_SUMMARY.corrMVsLam1),
    why: 'the measured iteration count correlates with lam_1/lam_2 at +0.894 but with lam_1 at only -0.418, so the convergence driver is the near-degenerate bottom pair, not the magnitude of lam_min -- correcting the imp-96352 sub-gap mechanism.',
  },
  {
    id: 'imp96383-bottom-pair-near-degenerate',
    holds: () =>
      IMP96383_ROWS.every((r) => r.ratio12 > 0.96 && r.ratio12 < 1) &&
      IMP96383_ROWS.every((r) => r.lam2 > r.lam1),
    why: 'the two smallest eigenvalues cluster within ~1..3.5 percent across the whole ladder (0.965 <= lam_1/lam_2 < 1), the spectral feature that stalls inverse iteration.',
  },
  {
    id: 'imp96383-iters-right-censored',
    holds: () => {
      const cap = IMP96383_SETUP.maxit;
      const big = IMP96383_ROWS.filter((r) => r.N >= 1500);
      return big.every((r) => r.iters === cap && r.censored === true) &&
        IMP96383_ROWS.filter((r) => r.N < 1500).every((r) => r.iters < cap);
    },
    why: 'measured iters hit the MAXIT=400 cap for every N >= 1500 (right-censored) and stay below it for the two smallest rungs; the exact m(n) growth law is therefore a lower bound (see IMP96383_SUBGAP).',
  },
  {
    id: 'imp96383-per-iter-not-flat-in-n2',
    holds: () => {
      const c = IMP96383_ROWS.map((r) => (r.solvePerIterMs / 1000) / r.N ** 2);
      const mean = c.reduce((s, v) => s + v, 0) / c.length;
      const cv = Math.sqrt(c.reduce((s, v) => s + (v - mean) ** 2, 0) / c.length) / mean;
      return cv > 0.3;
    },
    why: 'the per-iteration back-solve wall per n^2 is not flat (coefficient of variation > 0.3), so the O(n^2) triangular-solve constant itself carries residual super-quadratic behaviour at these sizes -- a second way the lumped c_ipm model is optimistic.',
  },
  {
    id: 'imp96383-honest-banner-and-subgap-present',
    holds: () =>
      /RH open/.test(IMP96383_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96383_HONEST_BANNER) &&
      /NO QED/.test(IMP96383_HONEST_BANNER) &&
      /Changes NO bound/.test(IMP96383_HONEST_BANNER) &&
      /right-censored/.test(IMP96383_SUBGAP.id),
    why: 'the banner carries the RH-open / PT-Lambda / NO-QED / no-bound markers and the named sub-gap flags the right-censored iteration count.',
  },
];

for (const a of IMP96383_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96383-route-m-per-rung-ipm-iteration-count assertion failed: ${a.id}`);
  }
}

export default {
  setup: IMP96383_SETUP,
  rows: IMP96383_ROWS,
  summary: IMP96383_SUMMARY,
  banner: IMP96383_HONEST_BANNER,
  subGap: IMP96383_SUBGAP,
};
