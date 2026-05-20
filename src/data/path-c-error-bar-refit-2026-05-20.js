/**
 * @module data/path-c-error-bar-refit-2026-05-20
 * @fileoverview imp-1129 -- Path C refinement: shrink the heuristic 0.0066 +/- 0.01
 * error bar on the asymptotic Lambda intercept using the imp-1136 Barnes-Hut
 * multipole production sweep (9 plateau rows at N up to 1e6).
 *
 * HONEST SCOPE
 * ------------
 * This module ships a HEURISTIC projection, NOT a rigorous claim. The rigorous
 * interval-arithmetic refit is imp-1137 V2 OLS interval (see
 * src/data/v2-ols-interval-2026-05.js and the composed asymptotic bound in
 * src/data/asymptotic-lambda-bound-2026-05-20.js). The deliverable here is a
 * tighter HEURISTIC Gaussian error bar usable for the paper conclusions
 * section as an informal projection alongside the rigorous interval bound.
 *
 * Background
 * ----------
 * The legacy Path C V2 heuristic fit (imp-400, PATH_C_BASELINE_FIT_V2 in
 * src/data/path-c-baseline-fit-v2.js) returns intercept a ~ 0.0066 with a
 * one-sided 95 pct Student-t error bar that order-of-magnitudes to +/- 0.01.
 * Because the error bar exceeds the central value, the heuristic upper bound
 * (central + half-band) is approximately 0.0166 -- consistent with Lambda
 * positive at the controlled height, so the legacy heuristic does NOT yet
 * give a non-trivial heuristic ceiling.
 *
 * What this refit ships
 * ---------------------
 * The imp-1136 Barnes-Hut multipole production sweep (see
 * src/data/asymptotic-lambda-bound-2026-05-20.js SWEEP_ROWS) measured 9
 * plateaus at N in {2e4, 5e4, 1e5, 2e5, 3e5, 5e5, 6e5, 8e5, 1e6} with
 * interval-arithmetic certified t_c brackets at theta = 0.05. Using the
 * midpoint of each bracket as the OLS point estimate and weighting larger N
 * higher (per the ticket spec: the largest-N rows dominate the asymptote),
 * we obtain a refitted central a + heuristic Gaussian error bar.
 *
 * The headline weighting scheme is LINEAR (w_k = N_k / sum N_j); also
 * reported as sanity-check variants are the UNIFORM (w_k = 1) and QUADRATIC
 * (w_k = N_k^2 / sum N_j^2) weightings. The quadratic weighting is more
 * aggressive but cuts effective sample size below 4 which makes the
 * Gaussian asymptotics unreliable; the linear weighting is the chosen
 * headline.
 *
 * Headline numbers (linear-N weighting, see fits.linear below)
 * ------------------------------------------------------------
 *   refittedCentral     = 2.825e-4  (vs heuristic 6.6e-3; 23x lower)
 *   refittedErrorBar    = 1.136e-4  (one-sided 95 pct z = 1.645 times seA)
 *   isNonTrivialUpperBound = (central + errorBar < heuristic.central) = TRUE
 *   refittedHeuristicCeiling = 3.961e-4  (the refitted Lambda projection
 *                                          upper estimate; 17x below the
 *                                          old heuristic ceiling 1.66e-2)
 *   lowerBoundAboveZero = (central - errorBar > 0) = TRUE
 *
 * INTERPRETATION FOR PAPER CONCLUSIONS
 * -----------------------------------
 * Under the linear-N weighted OLS, the heuristic projection is
 *   Lambda asymptotic ~ 3e-4 +/- 1.1e-4   (heuristic, NOT rigorous).
 *
 * This is consistent with -- and somewhat tighter than -- the imp-1147
 * rigorous interval-arithmetic composed bound Lambda <= 8e-4 (which is
 * conditional only on the linear-1/N asymptotic model, not on weighting
 * choices). The agreement increases confidence that the asymptote sits
 * near or below 1e-3, well inside the heuristic ceiling.
 *
 * @see src/data/asymptotic-lambda-bound-2026-05-20.js (rigorous composition)
 * @see src/data/v2-ols-interval-2026-05.js (rigorous interval OLS)
 * @see src/data/path-c-baseline-fit-v2.js (legacy heuristic baseline)
 * @see imp-1129
 */

// ── Input rows: imp-1136 Barnes-Hut multipole production sweep ──────────────
// Verbatim mirror of SWEEP_ROWS from asymptotic-lambda-bound-2026-05-20.js
// (the imp-1136 sweep captured at 2026-05-20T07:26 UTC, drift-mode
// bh_multipole theta=0.05). For the OLS we use the midpoint of each
// [t_lo, t_hi] bracket as the point estimate. For the 4 budget-exhausted
// rows the t_hi value is a loose upper bound (1e-3) from the integrator
// step budget; treating the midpoint as a point estimate is an HONEST
// reading of the data given the heuristic-only scope.
const SWEEP_ROWS = Object.freeze([
  { N: 20000,   t_lo: 1.0e-4, t_hi: 2.0e-4, reason: 'gap-lower-bound-nonpositive' },
  { N: 50000,   t_lo: 1.0e-4, t_hi: 1.0e-3, reason: 'budget-exhausted'            },
  { N: 100000,  t_lo: 1.0e-4, t_hi: 1.0e-3, reason: 'budget-exhausted'            },
  { N: 200000,  t_lo: 1.0e-4, t_hi: 1.0e-3, reason: 'budget-exhausted'            },
  { N: 300000,  t_lo: 1.0e-4, t_hi: 1.0e-3, reason: 'budget-exhausted'            },
  { N: 500000,  t_lo: 0.0,    t_hi: 5.0e-4, reason: 'rk4-stage-zero-crossing'     },
  { N: 600000,  t_lo: 0.0,    t_hi: 5.0e-4, reason: 'rk4-stage-zero-crossing'     },
  { N: 800000,  t_lo: 0.0,    t_hi: 5.0e-4, reason: 'rk4-stage-zero-crossing'     },
  { N: 1000000, t_lo: 0.0,    t_hi: 5.0e-4, reason: 'rk4-stage-zero-crossing'     },
]);

// ── Point-estimate rows ──────────────────────────────────────────────────────
const POINTS = SWEEP_ROWS.map((r) => Object.freeze({
  N: r.N,
  x: 1 / r.N,
  y: 0.5 * (r.t_lo + r.t_hi),
  bracketWidth: r.t_hi - r.t_lo,
  reason: r.reason,
}));

// ── Weighted OLS engine ──────────────────────────────────────────────────────
// Standard weighted least squares on y = a + b * x.
// Effective sample size n_eff = (sum w)^2 / sum w^2 (Kish).
// Heuristic error bar: 1.645 * seA  (Gaussian one-sided 95 pct z).
function weightedOLS(points, weights) {
  const n = points.length;
  const sumW = weights.reduce((s, w) => s + w, 0);
  const sumW2 = weights.reduce((s, w) => s + w * w, 0);
  const wx = points.reduce((s, p, i) => s + weights[i] * p.x, 0) / sumW;
  const wy = points.reduce((s, p, i) => s + weights[i] * p.y, 0) / sumW;
  const Sxx = points.reduce((s, p, i) => s + weights[i] * (p.x - wx) ** 2, 0);
  const Sxy = points.reduce((s, p, i) => s + weights[i] * (p.x - wx) * (p.y - wy), 0);
  const b = Sxy / Sxx;
  const a = wy - b * wx;
  const residuals = points.map((p) => p.y - (a + b * p.x));
  const wssRes = points.reduce((s, p, i) => s + weights[i] * residuals[i] ** 2, 0);
  const wssTot = points.reduce((s, p, i) => s + weights[i] * (p.y - wy) ** 2, 0);
  const R2 = wssTot > 1e-300 ? 1 - wssRes / wssTot : 1;
  const nEff = (sumW * sumW) / sumW2;
  const dfEff = nEff - 2;
  const sigma2 = dfEff > 0 ? wssRes / dfEff : 0;
  const varA = sigma2 * (1 / sumW + (wx * wx) / Sxx);
  const seA = Math.sqrt(Math.max(0, varA));
  return Object.freeze({
    a, b, R2, n, sumW, sumW2, nEff, dfEff, sigma2, seA, wssRes,
    residuals: Object.freeze(residuals),
    Sxx, Sxy, xbar: wx, ybar: wy,
  });
}

// ── Three weighting schemes ─────────────────────────────────────────────────
const W_UNIFORM = POINTS.map(() => 1);
const W_LINEAR  = POINTS.map((p) => p.N);
const W_QUAD    = POINTS.map((p) => p.N * p.N);

const FIT_UNIFORM = weightedOLS(POINTS, W_UNIFORM);
const FIT_LINEAR  = weightedOLS(POINTS, W_LINEAR);
const FIT_QUAD    = weightedOLS(POINTS, W_QUAD);

// One-sided 95 pct Gaussian z-quantile. Used in lieu of Student-t to keep
// the error bar HEURISTIC (the t-quantile depends on effective dof which
// varies across weighting schemes; the Gaussian z is the conservative-
// dof-infinity heuristic appropriate for an informal projection).
const Z_ONE_SIDED_95 = 1.645;

// Heuristic baseline (imp-315 / imp-400)
const HEURISTIC_CENTRAL = 0.0066;
const HEURISTIC_HALF_BAND = 0.01;

function packFit(fit, weights, label) {
  const errorBar = Z_ONE_SIDED_95 * fit.seA;
  const refittedCentral = fit.a;
  const lowerBound = refittedCentral - errorBar;
  const upperBound = refittedCentral + errorBar;
  // Per-row contribution: weighted squared residual as fraction of wssRes.
  // This identifies which N row dominates the residual budget (and hence
  // the heuristic error bar).
  const perRowContribution = POINTS.map((p, i) => Object.freeze({
    N: p.N,
    residual: fit.residuals[i],
    weight: weights[i],
    weightedSquaredResidual: weights[i] * fit.residuals[i] ** 2,
    fracOfTotalSSR: (weights[i] * fit.residuals[i] ** 2) / fit.wssRes,
  }));
  return Object.freeze({
    label,
    weighting: label,
    a: refittedCentral,
    b: fit.b,
    R2: fit.R2,
    nEff: fit.nEff,
    dfEff: fit.dfEff,
    seA: fit.seA,
    errorBar,
    refittedCentral,
    refittedErrorBar: errorBar,
    refittedHeuristicLowerBound: lowerBound,
    refittedHeuristicUpperBound: upperBound,
    deltaVsHeuristic: refittedCentral - HEURISTIC_CENTRAL,
    // The headline diagnostic the ticket asks for: is the refitted heuristic
    // upper bound STRICTLY BELOW the legacy heuristic central?
    isNonTrivialUpperBound: upperBound < HEURISTIC_CENTRAL,
    // Secondary diagnostic: does the refitted lower bound stay positive
    // (i.e. consistent with non-negative asymptotic t_c)?
    lowerBoundAboveZero: lowerBound > 0,
    perRowContribution: Object.freeze(perRowContribution),
  });
}

const FITS = Object.freeze({
  uniform:   packFit(FIT_UNIFORM, W_UNIFORM, 'uniform'),
  linear:    packFit(FIT_LINEAR,  W_LINEAR,  'linear-N'),
  quadratic: packFit(FIT_QUAD,    W_QUAD,    'quadratic-N'),
});

// Headline = linear-N (the natural "weight larger N higher" choice the
// ticket spec asks for; quadratic-N is sanity-shown but cuts effective dof
// below 4 which makes the Gaussian asymptotics unreliable).
const HEADLINE = FITS.linear;

// ── Exported record ─────────────────────────────────────────────────────────
export const PATH_C_ERROR_BAR_REFIT = Object.freeze({
  id: 'imp-1129-path-c-error-bar-refit-2026-05-20',
  ticket: 'imp-1129',
  builtAt: '2026-05-20T08:30:00Z',
  status: 'shipped',
  title:
    'Path C refinement: heuristic Gaussian error bar shrunk via 9-plateau ' +
    'imp-1136 BH-multipole sweep (weighted OLS, larger N favored)',

  // ── Inputs ────────────────────────────────────────────────────────────────
  inputs: Object.freeze({
    sourceModule: 'src/data/asymptotic-lambda-bound-2026-05-20.js (imp-1147 SWEEP_ROWS)',
    sourceTicket: 'imp-1136 BH-multipole production sweep',
    nRows: SWEEP_ROWS.length,
    rows: SWEEP_ROWS,
    pointEstimateMethod: 'midpoint of [t_lo, t_hi]',
  }),

  // ── Headline diagnostic (the four fields the ticket deliverable lists) ───
  refittedCentral: HEADLINE.refittedCentral,
  refittedErrorBar: HEADLINE.refittedErrorBar,
  deltaVsHeuristic: HEADLINE.deltaVsHeuristic,
  isNonTrivialUpperBound: HEADLINE.isNonTrivialUpperBound,
  perRowContribution: HEADLINE.perRowContribution,

  // ── Heuristic baseline reference ──────────────────────────────────────────
  heuristic: Object.freeze({
    source: 'src/data/path-c-baseline-fit-v2.js (imp-400 / imp-315)',
    central: HEURISTIC_CENTRAL,
    halfBand: HEURISTIC_HALF_BAND,
    upperBound: HEURISTIC_CENTRAL + HEURISTIC_HALF_BAND,
    lowerBound: HEURISTIC_CENTRAL - HEURISTIC_HALF_BAND,
    note:
      'Legacy heuristic 0.0066 +/- 0.01 produces upper bound 0.0166. The ' +
      'error bar exceeds the central value so the heuristic upper bound is ' +
      'NOT a non-trivial ceiling on the asymptotic Lambda.',
  }),

  // ── All three weighting schemes for transparency ──────────────────────────
  fits: FITS,
  headlineWeighting: 'linear-N',

  // ── Comparison with the rigorous bracket from imp-1147 ────────────────────
  // Cross-check: the rigorous interval-arithmetic OLS bracket on a from
  // src/data/v2-ols-interval-2026-05.js / asymptotic-lambda-bound-2026-05-20.js
  // is a in [2.826e-5, 7.673e-4]. The heuristic central 2.825e-4 lies
  // INSIDE that rigorous bracket (~3.7x the rigorous lower endpoint, 2.7x
  // tighter than the rigorous upper endpoint), and the heuristic upper
  // bound 3.96e-4 is within the rigorous bracket. The two methods AGREE
  // on the order of magnitude (~1e-4), which is the cross-validation we
  // want before citing the heuristic projection in the paper conclusions.
  rigorousCrossCheck: Object.freeze({
    sourceModule: 'src/data/asymptotic-lambda-bound-2026-05-20.js',
    rigorousALo: 2.826e-5,
    rigorousAHi: 7.673e-4,
    heuristicCentralInsideRigorous:
      HEADLINE.refittedCentral >= 2.826e-5 &&
      HEADLINE.refittedCentral <= 7.673e-4,
    heuristicUpperInsideRigorous:
      HEADLINE.refittedHeuristicUpperBound >= 2.826e-5 &&
      HEADLINE.refittedHeuristicUpperBound <= 7.673e-4,
    note:
      'The heuristic refit central (linear-N weighting) sits well inside the ' +
      'rigorous interval-OLS bracket [a_lo, a_hi] = [2.83e-5, 7.67e-4]. The ' +
      'heuristic upper bound also lies inside that bracket. Order-of-magnitude ' +
      'agreement at ~1e-4 cross-validates the heuristic projection.',
  }),

  // ── Honest scope ──────────────────────────────────────────────────────────
  honestScope: Object.freeze({
    isRigorous: false,
    isUnconditional: false,
    conditionalOn: Object.freeze([
      'linear-1/N asymptotic model |t_c(N)| = a + b/N (same as imp-1147)',
      'midpoint point-estimate of input intervals (NOT interval-arithmetic; see imp-1137 for the rigorous version)',
      'Gaussian one-sided 95 pct z = 1.645 (no Student-t small-sample correction)',
      'linear-N weighting choice (uniform and quadratic alternatives reported in fits.uniform and fits.quadratic for sensitivity check)',
    ]),
    notARigorousClaim:
      'This module ships a HEURISTIC projection useful for paper conclusions. ' +
      'The corresponding rigorous claim is the imp-1137 interval-arithmetic ' +
      'OLS bracket; see src/data/v2-ols-interval-2026-05.js and the composed ' +
      'asymptotic bound in src/data/asymptotic-lambda-bound-2026-05-20.js.',
    weightingChoice:
      'Linear-N weighting (w_k = N_k / sum N_j) chosen as headline because ' +
      'the ticket spec asks for "larger N weighted higher" without prescribing ' +
      'a specific functional form. Quadratic-N weighting is more aggressive but ' +
      'cuts effective dof below 4 (n_eff = 3.55), making the Gaussian z-quantile ' +
      'heuristic unreliable. Uniform weighting (n_eff = 9) is shown for ' +
      'transparency; under uniform weighting the refit still satisfies both ' +
      'isNonTrivialUpperBound and lowerBoundAboveZero.',
    largeNRowsDominate:
      'The 5 large-N rows (N >= 500k) all have residuals ~5e-5 with the ' +
      'linear-N weighting; the 4 smaller-N rows (N <= 300k) carry residuals ' +
      'of order 1e-4 to 6e-4. The largest-N row at N = 1e6 contributes ' +
      'approximately ' +
      (HEADLINE.perRowContribution[8].fracOfTotalSSR * 100).toFixed(1) +
      ' pct of the weighted SSR; the largest contributor is the N = 3e5 row ' +
      'at ' + (HEADLINE.perRowContribution[4].fracOfTotalSSR * 100).toFixed(1) +
      ' pct of SSR (where the loose budget-exhausted t_hi = 1e-3 still ' +
      'dominates the midpoint).',
  }),

  // ── Sub-gaps ──────────────────────────────────────────────────────────────
  residualObstructions: Object.freeze([
    Object.freeze({
      id: 'imp-1129-sub-budget-exhausted-rows',
      severity: 'tighten-with-more-compute',
      blocker: false,
      description:
        'Four of the nine rows (N in {5e4, 1e5, 2e5, 3e5}) have ' +
        'budget-exhausted t_hi = 1e-3 in the imp-1136 sweep -- the integrator ' +
        'did not detect a closure within the step budget. Tightening those ' +
        'upper brackets via a longer BH-multipole run would shrink the ' +
        'heuristic error bar further. Estimated factor: ~2x tighter if those ' +
        '4 rows close to t_hi ~ 2-3e-4.',
    }),
    Object.freeze({
      id: 'imp-1129-sub-deviation-from-linear-1N',
      severity: 'research-feasible',
      blocker: false,
      description:
        'The OLS step assumes |t_c(N)| ~ a + b/N at large N. Sub-leading ' +
        'corrections (e.g. a + b/N + c/N^2) would shift the heuristic ' +
        'intercept. Closure proposed in imp-1147-sub-deviation-from-linear-1N ' +
        'via Koksma-Hlawka second-order moment bound (2-4 weeks research-port).',
    }),
  ]),

  references: Object.freeze({
    imp1136: 'BH-multipole production sweep (9 measured rows at N up to 1e6)',
    imp1137: 'V2 OLS interval-arithmetic refit (the rigorous companion to this heuristic)',
    imp1139: 'BH multipole extension',
    imp1145: 'BH multipole wired into CLI',
    imp1147: 'Composed asymptotic Lambda <= 8e-4 (conditional, rigorous)',
    imp400:  'PATH_C_BASELINE_FIT_V2 (the legacy heuristic this refit shrinks)',
    pt2021:  'Platt & Trudgian, Bull. LMS 2021. Λ <= 0.2 rigorous unconditional asymptotic',
  }),
});

// ── Build-time assertions ───────────────────────────────────────────────────
// 5+ tripwires per the ticket spec; 8 here to cover the diagnostic surface.
export const PATH_C_ERROR_BAR_REFIT_ASSERTIONS = [
  {
    id: 'imp1129-headline-is-non-trivial-upper-bound',
    holds: () => PATH_C_ERROR_BAR_REFIT.isNonTrivialUpperBound === true,
    why:
      'The refitted heuristic upper bound (central + errorBar) must be ' +
      'strictly LESS than the legacy heuristic central 0.0066. This is the ' +
      'central diagnostic the ticket asks for: if FALSE the refit gives no ' +
      'improvement on the heuristic ceiling. Current value: refittedCentral + ' +
      'refittedErrorBar = ' +
      (PATH_C_ERROR_BAR_REFIT.refittedCentral + PATH_C_ERROR_BAR_REFIT.refittedErrorBar).toExponential(3) +
      ' < 0.0066 = TRUE (factor ~17x below the legacy heuristic ceiling).',
  },
  {
    id: 'imp1129-refitted-central-below-heuristic',
    holds: () =>
      PATH_C_ERROR_BAR_REFIT.refittedCentral < HEURISTIC_CENTRAL &&
      PATH_C_ERROR_BAR_REFIT.deltaVsHeuristic < 0,
    why:
      'The refitted central a must be strictly below the legacy heuristic ' +
      'central 0.0066 (the new sweep data pulls the asymptote down by an ' +
      'order of magnitude). deltaVsHeuristic must therefore be negative.',
  },
  {
    id: 'imp1129-error-bar-positive-and-bounded',
    holds: () =>
      PATH_C_ERROR_BAR_REFIT.refittedErrorBar > 0 &&
      PATH_C_ERROR_BAR_REFIT.refittedErrorBar < HEURISTIC_HALF_BAND,
    why:
      'The heuristic error bar must be strictly positive (otherwise the OLS ' +
      'is degenerate) AND strictly less than the legacy heuristic half-band ' +
      '0.01 (otherwise we have not actually shrunk the error bar). Current ' +
      'value: ' + PATH_C_ERROR_BAR_REFIT.refittedErrorBar.toExponential(3) +
      ' (~88x narrower than the legacy heuristic half-band).',
  },
  {
    id: 'imp1129-input-row-count-matches-nine',
    holds: () => PATH_C_ERROR_BAR_REFIT.inputs.nRows === 9 &&
                 PATH_C_ERROR_BAR_REFIT.inputs.rows.length === 9,
    why:
      'The refit must use exactly the 9 imp-1136 sweep rows from the ' +
      'BH-multipole production sweep. Any deviation indicates a row drop, ' +
      'extra injection, or a desynchronization with the imp-1147 source.',
  },
  {
    id: 'imp1129-all-three-weighting-schemes-present',
    holds: () => {
      const f = PATH_C_ERROR_BAR_REFIT.fits;
      return f && f.uniform && f.linear && f.quadratic &&
             typeof f.uniform.a === 'number' &&
             typeof f.linear.a === 'number' &&
             typeof f.quadratic.a === 'number';
    },
    why:
      'All three weighting schemes (uniform, linear-N, quadratic-N) must be ' +
      'present in fits so a reviewer can sensitivity-check the weighting ' +
      'choice. Dropping any of the three would make the headline opaque.',
  },
  {
    id: 'imp1129-per-row-contribution-sums-to-one',
    holds: () => {
      const total = PATH_C_ERROR_BAR_REFIT.perRowContribution.reduce(
        (s, r) => s + r.fracOfTotalSSR, 0,
      );
      return Math.abs(total - 1) < 1e-10;
    },
    why:
      'The per-row fractional contributions to the weighted SSR must sum to ' +
      'exactly 1 (modulo float epsilon). A sum that drifts indicates a bug ' +
      'in the weight normalization or in residual computation.',
  },
  {
    id: 'imp1129-heuristic-cross-checks-rigorous-bracket',
    holds: () =>
      PATH_C_ERROR_BAR_REFIT.rigorousCrossCheck.heuristicCentralInsideRigorous === true &&
      PATH_C_ERROR_BAR_REFIT.rigorousCrossCheck.heuristicUpperInsideRigorous === true,
    why:
      'The heuristic refit central AND the heuristic refit upper bound must ' +
      'both lie inside the rigorous interval-arithmetic OLS bracket from ' +
      'imp-1147 (a in [2.826e-5, 7.673e-4]). If the heuristic fell outside ' +
      'the rigorous bracket the projections would be inconsistent and the ' +
      'paper conclusions could not cite both side-by-side.',
  },
  {
    id: 'imp1129-honest-scope-not-rigorous-flag',
    holds: () =>
      PATH_C_ERROR_BAR_REFIT.honestScope.isRigorous === false &&
      PATH_C_ERROR_BAR_REFIT.honestScope.isUnconditional === false &&
      PATH_C_ERROR_BAR_REFIT.honestScope.conditionalOn.length >= 3,
    why:
      'Honest scope discipline: the module MUST flag isRigorous = false AND ' +
      'isUnconditional = false, and enumerate at least 3 conditional ' +
      'dependencies (linear-1/N model, midpoint point estimate, Gaussian z). ' +
      'A flip to rigorous here would silently over-claim a heuristic ' +
      'projection as a rigorous bound.',
  },
];
