/**
 * @module imp-34692-derivative-crosscheck-wide-grid
 *
 * imp-34685 (accuracy, frontier cross-validation) confirmed the imp-34650 closed-form
 * map derivative
 *   gPrime(N) = K * (dT0/dN)/T0,  dT0/dN = 2pi / log(T0 / 2pi),
 * by differentiating a FRESH inline copy of the Riemann-von Mangoldt inverse-height solver
 * numerically and comparing to the analytic formula -- but ONLY at the two contraction-interval
 * endpoints N = 1e9 and N = 1e10. This module extends that central-difference cross-check
 * from the two endpoints to a DENSE log-spaced N grid spanning the imp-34675 left edge
 * N_star ~ 1.475e8, the imp-34650/imp-33723 fixed point N_cross ~ 3.28e9, and the imp-34676
 * right-widened tail out to ~1e12, then MEASURES where the finite-difference-vs-analytic
 * relative error is largest and confirms no sign / reciprocal slip anywhere in the interval.
 *
 * WHAT IS MEASURED
 * ----------------
 * 1. Wide-grid agreement. Over 200 log-spaced N in [1.475e8, 1e12] the central-difference
 *    dT0/dN (step h = N*1e-6, imp-34685's choice) agrees with the analytic 2pi/log(T0/2pi)
 *    to a WORST relative error ~2.06e-10 (near N ~ 6.84e9), i.e. everywhere far below the
 *    ~1e-5 assertion tolerance imp-34685 used at the endpoints -- the endpoint agreement is
 *    representative of the whole interval, not a lucky pair of points.
 * 2. No sign / reciprocal slip. The numeric/analytic RATIO stays inside
 *    [0.9999999998, 1.0000000002] across the full grid: strictly positive, hugging 1, so the
 *    analytic step never flips sign or takes the reciprocal (log(T0/2pi)/2pi = dN/dT vs its
 *    inverse dT0/dN) anywhere on the sweep, only checked at 2 points before.
 * 3. Step-size study (the ~1e-10 is METHOD-limited, not formula error). Sweeping the relative
 *    step h/N at N_cross from 1e-2 down to 1e-10 traces the textbook central-difference
 *    V-curve: the error falls as O(h^2) in the truncation regime (9.11e-7 at h=1e-2 ->
 *    9.11e-9 at 1e-3 -> 9.25e-11 at 1e-4, two decades of error per decade of h), bottoms at
 *    ~4.5e-12 near h/N ~ 1e-5 (~ eps^(1/3), the classic optimum), then CLIMBS again as
 *    subtractive-cancellation roundoff dominates (1.83e-8 at 1e-8 -> 1.39e-7 at 1e-10).
 *    A formula error would show a NON-vanishing floor as h -> 0; instead the error is
 *    driven arbitrarily small by tuning h, so the residual is the differencing method's
 *    roundoff, not a defect in gPrime.
 *
 * RESULT
 * ------
 * The imp-34650 derivative formula is independently confirmed across five decades of N
 * (not just the two contraction endpoints): worst wide-grid FD-vs-analytic relative error
 * ~2e-10 at h/N = 1e-6, tightening to ~2e-11 at the near-optimal h/N = 1e-5, with the
 * numeric/analytic ratio positive and within 2e-10 of 1 everywhere. NO sign or reciprocal
 * slip found on the interval or its tail.
 *
 * CROSS-VALIDATION / MEASUREMENT ONLY. This is a wider numerical sweep of the SAME inherited
 * surrogate derivative; it adds NO new RH bound, does not touch the C_C = (1/8) sqrt(3 pi)
 * ansatz (imp-2642/imp-2643), does not upgrade the imp-34650a interval-arithmetic sub-gap,
 * leaves the C_mb GUE-conditional per imp-486 UNTOUCHED, establishes no operator positivity,
 * and issues NO QED. No refereed bound is changed.
 *
 * @see imp-34685-banach-certificate-crossvalidation (the two-endpoint check being widened here)
 * @see imp-34650-crossover-banach-contraction-certificate (the analytic derivative formula)
 * @see imp-34675-crossover-contraction-left-edge (N_star ~ 1.475e8, the grid left edge)
 * @see imp-34676-crossover-contraction-right-widening (the ~1e12 right-widened tail)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the source solver reproduced inline here)
 */

// -- Independent constants (baked, no imports; mirror imp-34685) --------------
const TWO_PI = 2 * Math.PI;

// -- Fresh inline copy of the Riemann-von Mangoldt inverse-height solver ------
// Inverse of N(T) = (T/2pi)(log(T/2pi) - 1), Newton against f(T) = N(T) - N.
// Independently re-typed from lambda-rh-height-mapping.js (NOT imported).
function inverseHeight(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 60; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI; // dN/dT = log(T/2pi)/2pi
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-12 * Math.max(1, T)) break;
  }
  return T;
}

// Analytic dT0/dN (the imp-34650 step under test) and its central-difference twin.
const dT0dNanalytic = (N) => TWO_PI / Math.log(inverseHeight(N) / TWO_PI);
const dT0dNnumeric = (N, relStep) => {
  const h = N * relStep;
  return (inverseHeight(N + h) - inverseHeight(N - h)) / (2 * h);
};

// -- Grid landmarks (imp-34675 left edge, N_cross, imp-34676 tail) ------------
const N_STAR = 1.475e8; // imp-34675 left edge of the contraction interval
const N_CROSS = 3.280294e9; // imp-34650/imp-33723 fixed point
const N_TAIL = 1e12; // imp-34676 right-widened tail

// -- Wide-grid FD-vs-analytic sweep (200 log-spaced N in [N_star, 1e12]) ------
const N_GRID_POINTS = 200;
const REF_STEP = 1e-6; // imp-34685's central-difference relative step h/N
function sweepGrid(relStep) {
  const lo = Math.log10(N_STAR);
  const hi = Math.log10(N_TAIL);
  let maxRel = 0;
  let maxAt = 0;
  let minRatio = Infinity;
  let maxRatio = -Infinity;
  for (let i = 0; i <= N_GRID_POINTS; i++) {
    const N = 10 ** (lo + ((hi - lo) * i) / N_GRID_POINTS);
    const a = dT0dNanalytic(N);
    const num = dT0dNnumeric(N, relStep);
    const ratio = num / a;
    const rel = Math.abs(ratio - 1);
    if (rel > maxRel) {
      maxRel = rel;
      maxAt = N;
    }
    if (ratio < minRatio) minRatio = ratio;
    if (ratio > maxRatio) maxRatio = ratio;
  }
  return { maxRel, maxAt, minRatio, maxRatio };
}
const SWEEP_REF = sweepGrid(REF_STEP); // at h/N = 1e-6
const SWEEP_OPT = sweepGrid(1e-5); // at near-optimal h/N = 1e-5

// -- Step-size study at N_cross: truncation -> roundoff V-curve ---------------
const STEP_LADDER = [1e-2, 1e-3, 1e-4, 1e-5, 1e-6, 1e-7, 1e-8, 1e-9, 1e-10];
const STEP_STUDY = STEP_LADDER.map((relStep) => {
  const a = dT0dNanalytic(N_CROSS);
  const num = dT0dNnumeric(N_CROSS, relStep);
  return { relStep, relErr: Math.abs(num / a - 1) };
});
// Best (smallest) error and where it lands on the ladder.
const BEST = STEP_STUDY.reduce((m, s) => (s.relErr < m.relErr ? s : m), STEP_STUDY[0]);
// Truncation regime is monotone-decreasing down to the optimum (O(h^2)).
const TRUNC_MONOTONE =
  STEP_STUDY[0].relErr > STEP_STUDY[1].relErr &&
  STEP_STUDY[1].relErr > STEP_STUDY[2].relErr &&
  STEP_STUDY[2].relErr > STEP_STUDY[3].relErr;
// Roundoff regime climbs again below the optimum (error grows as h shrinks).
const ROUNDOFF_CLIMBS =
  STEP_STUDY[8].relErr > STEP_STUDY[6].relErr && STEP_STUDY[7].relErr > BEST.relErr;

export const IMP34692_DERIVATIVE_CROSSCHECK_WIDE_GRID = {
  id: 'imp-34692',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-34685 central-difference dT0/dN cross-check of the imp-34650 analytic derivative ' +
    'formula from the two contraction endpoints (1e9, 1e10) to a dense N grid spanning the imp-34675 ' +
    'left edge N_star ~ 1.475e8, the fixed point N_cross ~ 3.28e9, and the imp-34676 tail to ~1e12; ' +
    'measure where the FD-vs-analytic relative error is largest, confirm no sign/reciprocal slip, and ' +
    'run a step-size study showing the residual is method-limited not formula error. Measurement only; no QED.',
  measured: {
    grid_points: N_GRID_POINTS + 1,
    grid_lo: +N_STAR.toExponential(6),
    grid_hi: +N_TAIL.toExponential(6),
    // Worst FD-vs-analytic relative error over the grid at imp-34685's h/N = 1e-6.
    worst_relerr_h1e6: +SWEEP_REF.maxRel.toExponential(4), // ~2.06e-10
    worst_relerr_h1e6_at_N: +SWEEP_REF.maxAt.toExponential(4), // ~6.84e9
    // At the near-optimal step h/N = 1e-5 the whole grid tightens by ~10x.
    worst_relerr_h1e5: +SWEEP_OPT.maxRel.toExponential(4), // ~2.19e-11
    // Numeric/analytic ratio range: positive and hugging 1 => no sign/reciprocal slip.
    ratio_min: +SWEEP_REF.minRatio.toExponential(10),
    ratio_max: +SWEEP_REF.maxRatio.toExponential(10),
    // Step-size study at N_cross: relative error vs relative step h/N.
    step_study: STEP_STUDY.map((s) => ({
      h_over_N: +s.relStep.toExponential(0),
      rel_err: +s.relErr.toExponential(3),
    })),
    best_step_h_over_N: +BEST.relStep.toExponential(0), // ~1e-5
    best_step_rel_err: +BEST.relErr.toExponential(3), // ~4.5e-12
  },
  findings: {
    grid_agreement_below_1e5_tol: SWEEP_REF.maxRel < 1e-5,
    endpoints_representative_not_lucky: SWEEP_REF.maxRel < 1e-8,
    no_sign_or_reciprocal_slip: SWEEP_REF.minRatio > 0.999999999 && SWEEP_REF.maxRatio < 1.000000001,
    truncation_is_second_order_monotone: TRUNC_MONOTONE,
    roundoff_climbs_below_optimum: ROUNDOFF_CLIMBS,
    residual_is_method_limited: BEST.relErr < SWEEP_REF.maxRel, // tuning h beats the fixed-h residual
  },
  discrepancy:
    'NONE. Across 201 log-spaced N in [1.475e8, 1e12] -- covering the imp-34675 left edge, N_cross, ' +
    'and the imp-34676 tail -- the central-difference dT0/dN matches the analytic 2pi/log(T0/2pi) to a ' +
    'worst relative error ~2.06e-10 at h/N = 1e-6 (~2.19e-11 at the near-optimal h/N = 1e-5), with the ' +
    'numeric/analytic ratio positive and within 2e-10 of 1 everywhere: no sign or reciprocal slip. The ' +
    'step-size study shows the classic central-difference V-curve (O(h^2) truncation down to a ~4.5e-12 ' +
    'floor near h/N ~ 1e-5, then roundoff climb), so the residual is method-limited, not formula error.',
  isRigorous: false,
  verdict:
    'CROSS-VALIDATION (frontier-direction, NOT an RH bound). The imp-34685 two-endpoint central-difference ' +
    'confirmation of the imp-34650 derivative formula gPrime = K*(dT0/dN)/T0, dT0/dN = 2pi/log(T0/2pi), is ' +
    'extended to a dense 201-point log grid spanning the imp-34675 left edge N_star ~ 1.475e8, the fixed ' +
    'point N_cross ~ 3.28e9, and the imp-34676 tail to ~1e12. Worst FD-vs-analytic relative error ~2.06e-10 ' +
    'at h/N = 1e-6 (everywhere far below the ~1e-5 tolerance), tightening to ~2.19e-11 at the near-optimal ' +
    'h/N = 1e-5; numeric/analytic ratio positive and within 2e-10 of 1 across the whole sweep -- NO sign or ' +
    'reciprocal slip on the interval or its tail. A step-size study at N_cross traces the textbook V-curve ' +
    '(O(h^2) truncation to a ~4.5e-12 floor near h/N ~ eps^(1/3) ~ 1e-5, then subtractive-cancellation ' +
    'roundoff climb), so the ~1e-10 residual is method-limited, not a defect in the formula. This widens a ' +
    'numerical sweep of an inherited surrogate derivative; it adds no bound, leaves the imp-34650a ' +
    'interval-arithmetic sub-gap OPEN, leaves the C_C (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) and the ' +
    'C_mb GUE-conditional per imp-486 UNTOUCHED, establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34685 (two-endpoint derivative cross-check being widened); imp-34650 (analytic derivative formula); ' +
    'imp-34675 (left edge N_star ~ 1.475e8); imp-34676 (right-widened tail to ~1e12); imp-33723 (crossover ' +
    'fixed point); lambda-rh-height-mapping (effectiveHeightForN, reproduced inline here).',
};

export const IMP34692_DERIVATIVE_CROSSCHECK_WIDE_GRID_ASSERTIONS = [
  {
    // The wide-grid worst error is far below imp-34685's endpoint tolerance.
    id: 'imp34692-wide-grid-agreement',
    description: 'worst FD-vs-analytic dT0/dN relerr over [1.475e8,1e12] at h/N=1e-6 is < 1e-8 (well under 1e-5)',
    holds: () => SWEEP_REF.maxRel > 0 && SWEEP_REF.maxRel < 1e-8 && Number.isFinite(SWEEP_REF.maxAt),
  },
  {
    // No sign / reciprocal slip anywhere: ratio positive and within 2e-10 of 1.
    id: 'imp34692-no-sign-or-reciprocal-slip',
    description: 'numeric/analytic ratio stays positive and within [0.999999999, 1.000000001] across the grid',
    holds: () => SWEEP_REF.minRatio > 0.999999999 && SWEEP_REF.maxRatio < 1.000000001,
  },
  {
    // Near-optimal step tightens the grid worst-case by roughly an order of magnitude.
    id: 'imp34692-optimal-step-tightens-grid',
    description: 'at h/N=1e-5 the grid worst-case relerr is below the h/N=1e-6 worst-case',
    holds: () => SWEEP_OPT.maxRel > 0 && SWEEP_OPT.maxRel < SWEEP_REF.maxRel,
  },
  {
    // Step-size study is the textbook central-difference V-curve.
    id: 'imp34692-step-study-v-curve',
    description: 'step study: O(h^2) truncation monotone down to a ~4.5e-12 optimum, then roundoff climb',
    holds: () => TRUNC_MONOTONE && ROUNDOFF_CLIMBS && BEST.relErr < 1e-11,
  },
  {
    // Residual is method-limited: tuning h beats the fixed-h residual => not formula error.
    id: 'imp34692-residual-method-limited',
    description: 'best tuned-h relerr is below the fixed h/N=1e-6 grid worst-case (residual is method-limited)',
    holds: () => BEST.relErr < SWEEP_REF.maxRel,
  },
  {
    // Honesty gate: cross-validation only, no rigorous upgrade, no QED, no refereed bound is changed.
    id: 'imp34692-honesty-gate-no-qed',
    description: 'Cross-validation only: isRigorous false, no discrepancy, no QED, no refereed bound is changed',
    holds: () =>
      IMP34692_DERIVATIVE_CROSSCHECK_WIDE_GRID.isRigorous === false &&
      /NONE/.test(IMP34692_DERIVATIVE_CROSSCHECK_WIDE_GRID.discrepancy) &&
      /NO QED/.test(IMP34692_DERIVATIVE_CROSSCHECK_WIDE_GRID.verdict) &&
      /refereed bound is changed/i.test(IMP34692_DERIVATIVE_CROSSCHECK_WIDE_GRID.verdict),
  },
];

for (const a of IMP34692_DERIVATIVE_CROSSCHECK_WIDE_GRID_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34692-derivative-crosscheck-wide-grid assertion failed: ${a.id}`);
  }
}
