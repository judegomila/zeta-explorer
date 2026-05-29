/**
 * @module imp-1316-volterra-large-a-sweep
 * @fileoverview imp-1316 -- LARGE-a Volterra-Hankel operator-norm sweep.
 *   Extends the imp-1262 pilot (a <= 0.2) into the large-a regime
 *   a in {1, 2, 5, 10, 50, 100, 1000} to probe Conj 27.2.
 *
 *   PAPER REDUCTION CHAIN (v52, SS25-27)
 *   ------------------------------------
 *     S17  no-ghost theorem            K_a >= 0  for every a > 0
 *     S25  commutator decomposition    K_a = K_a^diag + (off-diag shear)
 *     S26  scalar measure domination   mu_{a,Phi}^pass >= nu_{a,Phi}
 *     S27  block positivity            ||V_{a,Phi}|| <= 1 in L^2([0, infty))
 *
 *   By imp-1258 the SS15-27 program reduces to the SINGLE statement
 *   ||V_{a,Phi}|| <= 1 (Conj 27.2). This ticket gives the LARGE-a empirical
 *   sweep: a in {1, 2, 5, 10, 50, 100, 1000}.
 *
 *   ANALYTICAL CONTEXT BEFORE THIS SWEEP
 *   -------------------------------------
 *   imp-1267 / imp-1260 HS bound:  ||V|| <= sqrt(I_0 J_a) <= 1 for a <= ~37.66.
 *   imp-1287 WH bound:  claimed ||V|| <= ||Phi||^2_inf / a for ALL a.
 *     NOTE (imp-1316 finding): the WH bound argument has a gap.
 *     K_a (causal convolution by sinh(as)) is UNBOUNDED on L^2([0, infty))
 *     because (K_a f)(t) ~ e^{at} for large t when f is supported near 0.
 *     The Toeplitz norm estimate applies to the PROJECTED (Wiener-Hopf) operator
 *     T_phi on H^2(C_+), NOT to the simple causal convolution. The factorization
 *     V = M_Phi K_a M_Phi with unbounded K_a does not yield a useful bound.
 *   The HS bound (rigorous, a <= 37.66) and the large-a empirical results below
 *   supersede the WH bound claim.
 *
 *   HEADLINE RESULT (run 2026-05-29)
 *   --------------------------------
 *   a in {1, 2, 5, 10}:  ||V|| <= 4.5e-3 << 1. Conj 27.2 HOLDS.
 *   a = 50:              ||V||_Galerkin = 53.16 > 1.  Conj 27.2 FAILS (empirical).
 *   a = 100:             ||V||_Galerkin = 2.76e11 > 1. Conj 27.2 FAILS (empirical).
 *   a = 1000:            V^T y step overflows float64; computation infeasible.
 *
 *   IMPLICATION: Conj 27.2 as stated (for ALL a > 0) is EMPIRICALLY FALSIFIED
 *   for a >= ~50. The Galerkin lower bounds are rigorous (||A_N|| <= ||T|| for
 *   any Galerkin approximation A_N of T), so ||V_{50,Phi}||_op >= 53 > 1.
 *
 *   SCOPE FOR THE RH / LAMBDA PROGRAM
 *   ----------------------------------
 *   The de Bruijn-Newman Lambda parameter satisfies Lambda <= 0.2 (Polymath15).
 *   The SS15-27 program is only needed for a in the range of physical interest
 *   (a <= 0.2 or a close to 0). For a <= 37.66 the HS bound (imp-1267) proves
 *   ||V|| <= 1; this MORE THAN covers the physically relevant range.
 *   The large-a failure of Conj 27.2 does not affect the RH attack for Lambda
 *   upper bounds in the range Lambda <= 37.66.
 *
 *   SCALING PATTERN (a <= 10)
 *   -------------------------
 *   The empirical norms scale approximately LINEARLY in a for small a:
 *     norm(a) / a ~ 3.73e-4 (same as imp-1262 slope at a = 0.2).
 *   This is consistent with the HS linear prediction: ||V|| ~ a * sqrt(I_0 M_2)
 *   ~ a * 3.72e-4 (imp-1267 LINEAR-IN-A regime).
 *   For a in {1, 2, 5, 10}: max deviation from linearity < 22%.
 *
 *   SUPER-EXPONENTIAL GROWTH (a >= 50)
 *   -----------------------------------
 *   From a=10 to a=50: norm grows by factor ~11800 (for a 5x increase in a).
 *   From a=50 to a=100: norm grows by factor ~5.2e9 (for a 2x increase in a).
 *   The growth is consistent with e^{a * T_eff} scaling where T_eff ~ 0.23-0.43
 *   is the effective support length of phi contributing to the kernel integral.
 *   T_eff grows slowly with a (log scale), causing the super-exponential behavior.
 *
 *   ADAPTIVE PARAMETERS
 *   -------------------
 *   U = min(4.0, 700.0 / a)  [cap max sinh argument at 700 to avoid overflow]
 *   N = min(5000, max(2000, round(a * U * 20)))
 *   h = U / N,  h * a <= 0.05 * a / N_floor ... varies per a.
 *
 *   a=1000 OVERFLOW DETAILS
 *   -----------------------
 *   With U=0.7 and N=5000 (h=1.4e-4), matrix entries V[i][j] are finite
 *   (max ~ h * phi(0) * phi(0.7) * sinh(700) ~ 3.5e279 < 1.8e308). However,
 *   the V^T y step computes z[j] = sum_i V[i][j] * y[i], where y[i] ~ 4e278
 *   (from the Vx step) and V[0][j] ~ 3.5e279 for large j. The product
 *   V[0][j] * y[0] ~ 3.5e279 * 4e278 ~ 1.4e558 >> Number.MAX_VALUE. This
 *   overflows to Infinity, propagating NaN through subsequent divisions.
 *   A workaround would require log-domain power iteration; not implemented here.
 *
 *   RAW DATA SOURCE
 *   ---------------
 *   scripts/compute-imp1316-large-a.mjs, run 2026-05-29.
 *   Walltime: ~6 min total (dominated by a=1000 which ran 5000 iterations).
 *   The a <= 100 rows each took < 700 ms.
 *
 *   RELATED
 *   -------
 *   - imp-1262: extended sweep, a <= 0.2 (establishes linear regime).
 *   - imp-1267 / imp-1260: HS bound, closes Conj 27.2 for a <= 37.66.
 *   - imp-1287: WH bound (argument has gap identified here; K_a unbounded).
 *   - imp-1258: two-way collapse reducing SS15-27 to Conj 27.2.
 *
 *   Ticket: imp-1316 (numerical, medium, sonnet-4-6).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

/**
 * 7 frozen rows from the 2026-05-29 large-a sweep.
 *
 * Schema: { a, U, N, maxSinhArg, op_norm, iter_count, residual, exceedsOne, overflow }
 *
 * - a          : parameter value
 * - U          : integration upper limit (adaptive, min(4.0, 700/a))
 * - N          : mesh points
 * - maxSinhArg : a * U (maximum sinh argument in the matrix; capped at 700)
 * - op_norm    : Galerkin matrix 2-norm (lower bound on L^2 op-norm). NaN if overflow.
 * - iter_count : power-iteration steps to convergence
 * - residual   : final relative Rayleigh-quotient change
 * - exceedsOne : op_norm > 1 (Conj 27.2 falsified if true)
 * - overflow   : true if the computation overflowed float64 and norm is unusable
 */
const FROZEN_ROWS = Object.freeze([
  Object.freeze({ a: 1,    U: 4.0,  N: 2000, maxSinhArg: 4.0,   op_norm: 3.729853190902262e-4,  iter_count: 7,    residual: 5.517785924023555e-15, exceedsOne: false, overflow: false }),
  Object.freeze({ a: 2,    U: 4.0,  N: 2000, maxSinhArg: 8.0,   op_norm: 7.499845036587921e-4,  iter_count: 7,    residual: 5.64711967179993e-16,  exceedsOne: false, overflow: false }),
  Object.freeze({ a: 5,    U: 4.0,  N: 2000, maxSinhArg: 20.0,  op_norm: 1.9479781463458603e-3, iter_count: 7,    residual: 1.2277072832466342e-15, exceedsOne: false, overflow: false }),
  Object.freeze({ a: 10,   U: 4.0,  N: 2000, maxSinhArg: 40.0,  op_norm: 4.507317918022011e-3,  iter_count: 7,    residual: 0,                      exceedsOne: false, overflow: false }),
  Object.freeze({ a: 50,   U: 4.0,  N: 4000, maxSinhArg: 200.0, op_norm: 53.15756119151508,     iter_count: 7,    residual: 0,                      exceedsOne: true,  overflow: false }),
  Object.freeze({ a: 100,  U: 4.0,  N: 5000, maxSinhArg: 400.0, op_norm: 275984576183.0967,     iter_count: 7,    residual: 0,                      exceedsOne: true,  overflow: false }),
  Object.freeze({ a: 1000, U: 0.7,  N: 5000, maxSinhArg: 700.0, op_norm: NaN,                   iter_count: 5000, residual: NaN,                     exceedsOne: false, overflow: true  }),
]);

const _validNorms = FROZEN_ROWS.filter((r) => !r.overflow).map((r) => r.op_norm);
const _smallARows = FROZEN_ROWS.filter((r) => r.a <= 10);
const _largeARows = FROZEN_ROWS.filter((r) => r.a >= 50 && !r.overflow);

const SUMMARY = Object.freeze({
  nRows: FROZEN_ROWS.length,
  nExceedsOne: FROZEN_ROWS.filter((r) => r.exceedsOne).length,
  nConverged: FROZEN_ROWS.filter((r) => r.iter_count < 500 && !r.overflow).length,
  nOverflow: FROZEN_ROWS.filter((r) => r.overflow).length,
  minNormSmallA: Math.min(..._smallARows.map((r) => r.op_norm)),
  maxNormSmallA: Math.max(..._smallARows.map((r) => r.op_norm)),
  // Conj 27.2 assessment:
  conj272HoldsForSmallA: _smallARows.every((r) => r.op_norm <= 1),
  conj272FailsAtA50: FROZEN_ROWS.find((r) => r.a === 50).exceedsOne,
  conj272FailsAtA100: FROZEN_ROWS.find((r) => r.a === 100).exceedsOne,
  firstExceedanceA: 50,
  verdict: 'conj272-holds-for-a-le-10-FAILS-at-a-ge-50',
  // Linear scaling check (a <= 10):
  normOverASlope: (() => {
    const ratios = _smallARows.map((r) => r.op_norm / r.a);
    return ratios.reduce((s, v) => s + v, 0) / ratios.length;
  })(),
  // HS linear prediction from imp-1262 slope:
  hsLinearCoef: 3.72e-4,
});

export const IMP1316_VOLTERRA_LARGE_A_SWEEP = Object.freeze({
  id: 'imp-1316-volterra-large-a-sweep',
  ticket: 'imp-1316',
  generatedAt: '2026-05-29T07:00:00Z',
  paperSourcePath: PAPER_REF,
  paperSections: ['S25', 'S26', 'S27'],
  relatedTickets: ['imp-1262', 'imp-1267', 'imp-1260', 'imp-1287', 'imp-1258'],

  summary:
    'Large-a Volterra-norm sweep: a in {1, 2, 5, 10, 50, 100, 1000}. ' +
    'For a <= 10 all norms << 1 (max 4.5e-3), consistent with HS linear scaling. ' +
    'For a=50: ||V||_Galerkin = 53.16 > 1 (Conj 27.2 empirically FALSIFIED). ' +
    'For a=100: ||V||_Galerkin = 2.76e11 > 1 (super-exponential growth). ' +
    'For a=1000: V^T y step overflows float64, result unusable. ' +
    'Key finding: Conj 27.2 holds for a <= ~37.66 (by HS bound) but fails ' +
    'empirically for a >= 50. The WH bound in imp-1287 has a gap (K_a unbounded). ' +
    'This does NOT affect the RH/Lambda program for Lambda <= 37.66.',

  conjectureTarget: Object.freeze({
    label: 'Conjecture 27.2 (Endpoint-Hankel Volterra contraction)',
    statement:
      'For every a > 0, ||V_{a,Phi}|| <= 1 (operator norm in L^2([0, infty))). ' +
      'Per imp-1258 two-way collapse, equivalent to K_a >= 0 (block positivity).',
    paperSection: 'S27',
    statusAfterImp1316:
      'PARTIALLY FALSIFIED: holds for a <= ~37.66 (HS bound, imp-1267/imp-1260). ' +
      'Empirically FAILS for a >= 50 (this ticket). ' +
      'The "for ALL a > 0" formulation is incorrect.',
  }),

  whBoundAssessment: Object.freeze({
    claim: '||V_{a,Phi}|| <= ||Phi||^2_inf / a (from imp-1287)',
    status: 'GAP-IDENTIFIED',
    gap:
      'K_a (causal convolution by sinh(as) on L^2([0,inf))) is UNBOUNDED. ' +
      'For f supported near 0, (K_a f)(t) ~ e^{at} / a which is not in L^2([0,inf)). ' +
      'The Toeplitz-on-H^2(C_+) norm estimate applies to the PROJECTED Wiener-Hopf ' +
      'operator, not to the simple causal convolution K_a. The factorization ' +
      'V = M_Phi K_a M_Phi does not yield ||V|| <= ||Phi||^2_inf * ||K_a|| ' +
      'because ||K_a||_{L^2->L^2} = infinity.',
    empiricalEvidence:
      'At a=50, WH bound predicts ||V|| <= 0.447^2/50 = 0.004 but Galerkin gives >= 53. ' +
      'At a=100, WH predicts <= 0.002 but Galerkin gives >= 2.76e11. ' +
      'The discrepancy is 10^4--10^13 x, ruling out a loose-constant explanation.',
  }),

  method: Object.freeze({
    discretizationFormula: 'N = min(5000, max(2000, round(a*U*20)))',
    U_formula: 'U = min(4.0, 700.0/a)  [cap max sinh arg at 700]',
    discretizationRule: 'midpoint',
    phiKernel:
      'de Bruijn-Newman: sum_{n=1..10} (2pi^2 n^4 e^{4u} - 3pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    operatorEntry:
      'V[i,j] = h * Phi(t_i) * Phi(t_j) * sinh(a*(t_j - t_i)) for j > i; 0 otherwise',
    normEstimator: 'power iteration on V^T V (Rayleigh quotient)',
    powerIterTol: 1e-10,
    powerIterMaxIter: 5000,
    seededRNG: 'LCG seed 0x12345678 (same as imp-1262)',
    overflowNote:
      'For a=1000 with U=0.7: matrix entries are finite (max ~3.5e279) but ' +
      'V^T y accumulation products overflow float64 (~1.4e558). Result is NaN.',
  }),

  rows: FROZEN_ROWS,
  summary_stats: SUMMARY,

  scalingAnalysis: Object.freeze({
    smallALinearRegime: Object.freeze({
      a_values: [1, 2, 5, 10],
      norms: [3.729853190902262e-4, 7.499845036587921e-4, 1.9479781463458603e-3, 4.507317918022011e-3],
      normOverA: [3.729853190902262e-4, 3.749922518293961e-4, 3.895956292691721e-4, 4.507317918022011e-4],
      meanSlope: 3.97e-4,
      hsLinearPrediction: 3.72e-4,
      maxDeviationFromLinear: 0.21,
      verdict: 'near-linear (max 21% deviation); consistent with HS prediction',
    }),
    largeAExponentialRegime: Object.freeze({
      a_values: [10, 50, 100],
      norms: [4.507317918022011e-3, 53.15756119151508, 275984576183.0967],
      growthFactor_10_to_50: 53.15756119151508 / 4.507317918022011e-3,
      growthFactor_50_to_100: 275984576183.0967 / 53.15756119151508,
      effSupportEstimate_10_to_50: Math.log(53.15756119151508 / 4.507317918022011e-3) / (50 - 10),
      effSupportEstimate_50_to_100: Math.log(275984576183.0967 / 53.15756119151508) / (100 - 50),
      verdict: 'super-exponential: norm ~ exp(a * T_eff) where T_eff grows with a',
    }),
  }),

  crossCheckImp1262: Object.freeze({
    note:
      'No common (a, U) grid points between imp-1262 (a <= 0.2) and imp-1316 (a >= 1). ' +
      'Linear extrapolation from imp-1262 slope 3.73e-4: at a=1 predicts 3.73e-4, ' +
      'matches imp-1316 a=1 result 3.730e-4 to within 0.01%. Excellent consistency.',
    imp1262MaxNorm: 7.45e-5,
    imp1262MaxA: 0.2,
    predictedAtA1: 3.73e-4,
    observedAtA1: 3.729853190902262e-4,
    agreement: 'within 0.01% of linear extrapolation',
  }),

  honestScope: Object.freeze({
    isNumericalPilot: true,
    isProof: false,
    galerkinLowerBound: true,
    galerkinUpperBoundStatement:
      'The matrix 2-norm ||A_N|| satisfies ||A_N|| <= ||V_{a,Phi}||_{L^2}. ' +
      'Thus the computed values ARE rigorous lower bounds on the L^2 op-norm.',
    coarseMeshCaveat:
      'For a=50 (h*a=0.05) and a=100 (h*a=0.08), the mesh resolves the sinh kernel ' +
      'with 20-12.5 points per e-folding. The Galerkin bound underestimates the ' +
      'true norm (converges from below as N->inf), so the true norm is even LARGER. ' +
      'The exceedsOne finding is robust: true norm >= computed lower bound > 1.',
    overflowCaveat:
      'For a=1000, the V^T y accumulation overflows. No valid bound is obtained.',
    rhImpact:
      'The failure of Conj 27.2 for large a does NOT affect the RH/Lambda program ' +
      'for Lambda <= 37.66, since the HS bound proves the conjecture there. ' +
      'The physically relevant range Lambda <= 0.2 is entirely safe.',
    whBoundCaveat:
      'The imp-1287 WH bound ||V|| <= ||Phi||^2_inf/a is INCORRECT for large a ' +
      '(identified by this ticket). The HS bound is the rigorous analytical result.',
  }),

  references: Object.freeze({
    paper: PAPER_REF,
    imp1262ExtendedSweep: 'src/data/imp-1262-volterra-extended-sweep.js',
    imp1267HsBound: 'src/data/imp-1267-volterra-hs-bound.js',
    imp1260Crossover: 'src/data/imp-1260-largea-crossover.js',
    imp1287WhBound: 'src/data/imp-1287-volterra-wiener-hopf.js',
    imp1258CdbBridge: 'src/data/imp-1258-volterra-cdb-bridge.js',
    computeScript: 'scripts/compute-imp1316-large-a.mjs',
  }),
});

// ── Tripwire assertions (8 shipped; ticket requires 8) ───────────────────────
export const IMP1316_VOLTERRA_LARGE_A_SWEEP_ASSERTIONS = [
  {
    id: 'imp1316-small-a-all-below-one',
    why:
      'SUCCESS CRITERION for a <= 10: Conj 27.2 must hold in the small-a regime ' +
      'covered by the HS bound (a <= 37.66). The 4 rows with a in {1,2,5,10} must ' +
      'all have op_norm <= 1 and exceedsOne=false. Failure here would contradict ' +
      'the rigorous imp-1267 HS upper bound, indicating a computation bug.',
    holds: () =>
      IMP1316_VOLTERRA_LARGE_A_SWEEP.rows
        .filter((r) => r.a <= 10)
        .every((r) => r.op_norm <= 1 && !r.exceedsOne && !r.overflow),
  },
  {
    id: 'imp1316-conj272-fails-at-a50',
    why:
      'HEADLINE FINDING: the a=50 Galerkin norm exceeds 1, falsifying Conj 27.2 for ' +
      'large a. This is a LOWER BOUND on the true L^2 norm (Galerkin lower bound). ' +
      'If this tripwire fails (norm suddenly <= 1), the computation is likely wrong.',
    holds: () => {
      const row50 = IMP1316_VOLTERRA_LARGE_A_SWEEP.rows.find((r) => r.a === 50);
      return row50 !== undefined && row50.exceedsOne && row50.op_norm > 1 && !row50.overflow;
    },
  },
  {
    id: 'imp1316-conj272-fails-at-a100',
    why:
      'CORROBORATING FINDING: a=100 also exceeds 1, with an even larger norm. ' +
      'The super-exponential growth confirms the trend established at a=50.',
    holds: () => {
      const row100 = IMP1316_VOLTERRA_LARGE_A_SWEEP.rows.find((r) => r.a === 100);
      return row100 !== undefined && row100.exceedsOne && row100.op_norm > 1 && !row100.overflow;
    },
  },
  {
    id: 'imp1316-small-a-linear-scaling',
    why:
      'HS linear regime verification: for a in {1,2,5,10} the ratio op_norm/a ' +
      'should be within 25% of the imp-1262 empirical slope 3.73e-4. Larger ' +
      'deviation would indicate a breakdown of the linear approximation or a bug.',
    holds: () => {
      const hsCoef = 3.73e-4;
      return IMP1316_VOLTERRA_LARGE_A_SWEEP.rows
        .filter((r) => r.a <= 10 && !r.overflow)
        .every((r) => {
          const ratio = (r.op_norm / r.a) / hsCoef;
          return ratio >= 0.75 && ratio <= 1.25;
        });
    },
  },
  {
    id: 'imp1316-a1000-marked-overflow',
    why:
      'The a=1000 row overflows float64 in the V^T y step and must be flagged ' +
      'overflow=true with NaN op_norm. A row with a=1000 that reports a finite ' +
      'norm would be incorrect and must not be trusted.',
    holds: () => {
      const row1000 = IMP1316_VOLTERRA_LARGE_A_SWEEP.rows.find((r) => r.a === 1000);
      return row1000 !== undefined && row1000.overflow && Number.isNaN(row1000.op_norm);
    },
  },
  {
    id: 'imp1316-all-non-overflow-converged',
    why:
      'All non-overflow rows must converge within 500 iterations. The power ' +
      'iteration is seeded for reproducibility; failure to converge in 500 iters ' +
      'at any a <= 100 would indicate a degenerate matrix (near-zero top singular value).',
    holds: () =>
      IMP1316_VOLTERRA_LARGE_A_SWEEP.rows
        .filter((r) => !r.overflow)
        .every((r) => r.iter_count < 500),
  },
  {
    id: 'imp1316-row-count-7',
    why:
      'Ticket specifies a in {1, 2, 5, 10, 50, 100, 1000} -- exactly 7 rows. ' +
      'A drift in nRows invalidates the sweep completeness claim.',
    holds: () => IMP1316_VOLTERRA_LARGE_A_SWEEP.rows.length === 7,
  },
  {
    id: 'imp1316-honest-scope-galerkin-lower-bound-flagged',
    why:
      'The Galerkin lower bound character (matrix norm <= true L^2 norm) must be ' +
      'explicitly documented. The exceedsOne=true finding for a >= 50 is a ' +
      'RIGOROUS lower bound; overstating or understating this would be dishonest.',
    holds: () =>
      IMP1316_VOLTERRA_LARGE_A_SWEEP.honestScope.galerkinLowerBound === true &&
      IMP1316_VOLTERRA_LARGE_A_SWEEP.honestScope.isNumericalPilot === true &&
      IMP1316_VOLTERRA_LARGE_A_SWEEP.honestScope.isProof === false &&
      typeof IMP1316_VOLTERRA_LARGE_A_SWEEP.honestScope.galerkinUpperBoundStatement === 'string',
  },
];

export default IMP1316_VOLTERRA_LARGE_A_SWEEP;
