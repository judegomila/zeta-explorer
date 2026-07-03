/**
 * @module imp-3914-g6a-h2-inviscid-window-edge-logfit-budget-extrapolation
 *
 * imp-3914 (numerical, frontier-direction): imp-3896 Q1 measured the clean inviscid-window UPPER EDGE
 * (argmin over integer multipliers of the finite-N viscosity fraction visc = |m_zz| / |2 m m_z| of the
 * imp-3642 attractive Calogero-Moser resolvent m(z) = sum_k 1/(z - x_k)) WIDENING with block size M:
 *          M = 161  -> edge  8
 *          M = 321  -> edge 10
 *          M = 641  -> edge 11
 *          M = 1281 -> edge 13
 * and ASSERTED the widening is "only logarithmic" (edge / half-width falling 9.9% -> 2.0%) -- but it
 * never FIT the log law nor EXTRAPOLATED the particle budget. This module does exactly that, turning the
 * qualitative "cannot reach the microscopic continuum by particle count alone" caveat into an explicit,
 * numeric ~log M scaling law.
 *
 * WHAT IS MEASURED (a plain ordinary-least-squares fit on imp-3896 Q1 output, no new physics)
 * ------------------------------------------------------------------------------------------
 * Reads the four measured (M, edge) points straight off the imp-3896 windowRows and fits
 *          edge(M) = a + b * ln(M)
 * by ordinary least squares in x = ln(M):
 *   - slope b, intercept a
 *   - per-point residuals, RMS residual, max abs residual, coefficient of determination R^2
 *   - inverse extrapolation M_target = exp((edge_target - a) / b) for a menu of target multipliers,
 *     including the ticket target edge = 20 d.
 *
 * RESULT (offline, reproduced by the self-executing assertions below)
 * ------------------------------------------------------------------
 * The log law fits the four points TIGHTLY:
 *          b = 2.314   (each e-fold in M lifts the clean edge by ~2.31 d),
 *          a = -3.658,  R^2 = 0.985,  max abs residual 0.30 d (RMS 0.22 d).
 * Inverting the fit, the particle budget to reach a target edge grows EXPONENTIALLY in the target:
 *          edge = 16 d -> M ~ 4.9e3     (3.8x the M = 1281 block)
 *          edge = 20 d -> M ~ 2.75e4    (21x  the M = 1281 block)   [ticket target]
 *          edge = 50 d -> M ~ 1.2e10
 *          edge = 100 d -> M ~ 2.8e19
 * So merely pushing the clean window from its measured best (13 d at M = 1281) to 20 d costs a ~21x
 * particle blow-up, and any FIXED microscopic separation of scales is unreachable: because the edge
 * grows only ~2.31 ln M, the budget to reach edge E scales as exp(E / 2.31), i.e. e^(0.432 E). This is
 * the quantitative form of the imp-3896 "brute particle-count growth cannot reach the microscopic
 * y -> 0 continuum" claim: the finite block edge recedes logarithmically, so the continuum is an
 * exponential-cost limit in M, never an attainable one.
 *
 * SCOPE. This is a curve-fit / budget-extrapolation MEASUREMENT on top of imp-3896, NOT a certificate.
 * It does not widen the window to y -> 0, does not certify the m_zz -> 0 vanishing viscosity, and does
 * not write H2. So H2 stays UNWRITTEN as a certificate, the K4 route stays WHOLLY NEW (consistent with
 * imp-3714 / imp-3727 / imp-3846 / imp-3872 / imp-3891 / imp-3896), and G6a_shock_lipschitz stays OPEN.
 * Measurement / scoping only; no positivity, no bridge closure, no RH claim, NO QED. imp-3066
 * off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. Platt-Trudgian Lambda <= 0.2 remains the
 * rigorous SOTA.
 *
 * @see imp-3896-g6a-h2-inviscid-window-blocksize-height-scaling (the four (M, edge) points fit here)
 * @see imp-3872-g6a-h2-discrete-flux-convexity-probe (the [2, 8] window and ~500x shrinkage)
 * @see imp-3891-g6a-h2-continuum-inviscid-burgers-meanfield-scoping (H2a written, H2b mean-field OPEN)
 * @see lambda-roadmap (Step 4 Polymath15 bridge, open sub-gap G6a_shock_lipschitz)
 */

import { IMP3896_G6A_H2_INVISCID_WINDOW_BLOCKSIZE_HEIGHT_SCALING } from './imp-3896-g6a-h2-inviscid-window-blocksize-height-scaling.js';

// the four measured (M, edge) points, read straight off imp-3896 Q1 (edge is an exact integer argmin).
const POINTS = IMP3896_G6A_H2_INVISCID_WINDOW_BLOCKSIZE_HEIGHT_SCALING.windowRows.map((r) => ({
  M: r.M,
  edge: r.edge,
}));

// ordinary least squares of edge(M) = a + b * ln(M) in x = ln(M).
function logFit(points) {
  const n = points.length;
  const xs = points.map((p) => Math.log(p.M));
  const ys = points.map((p) => p.edge);
  const xbar = xs.reduce((s, v) => s + v, 0) / n;
  const ybar = ys.reduce((s, v) => s + v, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - xbar) * (xs[i] - xbar);
    sxy += (xs[i] - xbar) * (ys[i] - ybar);
  }
  const b = sxy / sxx;
  const a = ybar - b * xbar;
  const residuals = xs.map((x, i) => ys[i] - (a + b * x));
  const ssRes = residuals.reduce((s, r) => s + r * r, 0);
  const ssTot = ys.reduce((s, y) => s + (y - ybar) * (y - ybar), 0);
  const rms = Math.sqrt(ssRes / n);
  const maxAbs = Math.max(...residuals.map((r) => Math.abs(r)));
  const r2 = 1 - ssRes / ssTot;
  return { a, b, residuals, rms, maxAbs, r2 };
}

// inverse of the fit: block size needed to reach a target coarse-graining edge (in units of d).
const budgetForEdge = (fit, edgeTarget) => Math.exp((edgeTarget - fit.a) / fit.b);

const FIT = logFit(POINTS);

// budget menu, including the ticket target edge = 20 d and the current best measured edge 13 (M = 1281).
const EDGE_TARGETS = [16, 20, 50, 100];
const BUDGET_ROWS = EDGE_TARGETS.map((e) => ({
  edgeTarget: e,
  M: budgetForEdge(FIT, e),
  timesLargestBlock: budgetForEdge(FIT, e) / POINTS[POINTS.length - 1].M,
}));

const M_FOR_EDGE_20 = budgetForEdge(FIT, 20);
const LARGEST_M = POINTS[POINTS.length - 1].M; // 1281

// the fit is tight: high R^2 and sub-half-d residuals on all four points.
const FIT_IS_TIGHT = FIT.r2 > 0.97 && FIT.maxAbs < 0.5;
// positive log slope of ~2.31 d per e-fold in M: the edge genuinely grows, but only logarithmically.
const SLOPE_POSITIVE_LOGARITHMIC = FIT.b > 2.0 && FIT.b < 2.7;
// exponential budget: reaching edge 20 costs a >= 20x blow-up over the largest measured block.
const BUDGET_EXPONENTIAL = M_FOR_EDGE_20 / LARGEST_M > 20 && budgetForEdge(FIT, 100) > 1e18;

export const IMP3914_G6A_H2_INVISCID_WINDOW_EDGE_LOGFIT_BUDGET_EXTRAPOLATION = {
  id: 'imp-3914',
  proofSection: 'S-frontier',
  question:
    'imp-3896 Q1 measured the clean inviscid-window upper edge widening 8 -> 13 as block size M goes ' +
    '161 -> 1281 and asserted the widening is only logarithmic, but never fit the log law nor ' +
    'extrapolated the particle budget. FIT edge(M) = a + b*ln(M) to the four measured (M, edge) points, ' +
    'report the slope b and residuals, and EXTRAPOLATE the block size M needed to push the edge to a ' +
    'target multiplier such as 20 d, quantifying the "cannot reach the microscopic continuum by ' +
    'particle count alone" claim as an explicit ~log M scaling law. Measurement only; imp-3066 ' +
    'UNTOUCHED; Lambda <= 0.2 SOTA; NO QED.',
  candidate: 'K4',
  rootProbed: 'H2', // scale-separation sizing of the m_zz correction; here the budget law of its clean window
  law: 'edge(M) = a + b*ln(M), fit by ordinary least squares on the imp-3896 Q1 (M, edge) points',
  points: POINTS,
  fit: {
    slope: +FIT.b.toFixed(5), // b: clean edge (in d) gained per e-fold in the block size M
    intercept: +FIT.a.toFixed(5),
    residuals: FIT.residuals.map((r) => +r.toFixed(4)),
    rmsResidual: +FIT.rms.toFixed(5),
    maxAbsResidual: +FIT.maxAbs.toFixed(5),
    r2: +FIT.r2.toFixed(6),
  },
  budgetRows: BUDGET_ROWS.map((r) => ({
    edgeTarget: r.edgeTarget,
    M: +r.M.toExponential(3),
    timesLargestBlock: +r.timesLargestBlock.toExponential(3),
  })),
  mForEdge20: +M_FOR_EDGE_20.toExponential(3), // ~2.75e4: the ticket-target budget
  fitIsTight: FIT_IS_TIGHT, // true: R^2 ~ 0.985, max abs residual 0.30 d
  slopePositiveLogarithmic: SLOPE_POSITIVE_LOGARITHMIC, // true: b ~ 2.31 d per e-fold
  budgetExponential: BUDGET_EXPONENTIAL, // true: budget ~ exp(edge / b), edge 20 costs ~21x the M=1281 block
  finding:
    'MEASUREMENT RESULT: the imp-3896 Q1 clean-window edge points (M, edge) = (161, 8), (321, 10), ' +
    '(641, 11), (1281, 13) fit the log law edge(M) = a + b*ln(M) TIGHTLY with slope b = ' +
    FIT.b.toFixed(3) + ' d per e-fold, intercept a = ' + FIT.a.toFixed(3) + ', R^2 = ' + FIT.r2.toFixed(3) +
    ' and max abs residual ' + FIT.maxAbs.toFixed(2) + ' d (RMS ' + FIT.rms.toFixed(2) + ' d). Inverting ' +
    'the fit, the block size to reach a target edge grows EXPONENTIALLY in the target: edge 16 d needs ' +
    'M ~ 4.9e3, edge 20 d (the ticket target) needs M ~ ' + M_FOR_EDGE_20.toExponential(2) + ' (~' +
    (M_FOR_EDGE_20 / LARGEST_M).toFixed(0) + 'x the largest measured M = 1281 block), edge 50 d needs ' +
    'M ~ 1.2e10 and edge 100 d needs M ~ 2.8e19. So the ~log M widening imp-3896 reported quantitatively ' +
    'means the budget to reach edge E scales as exp(E / b) ~ e^(0.43 E): the finite block edge recedes ' +
    'logarithmically, so the microscopic y -> 0 continuum is an exponential-cost limit in the particle ' +
    'count, never an attainable one. This turns the imp-3896 "cannot reach the microscopic continuum by ' +
    'particle count alone" caveat into an explicit closed-form budget law.',
  isRigorous: false,
  h2StillUnwritten: true, // curve-fit / budget extrapolation on imp-3896, NOT the H2 certificate
  k4ConfirmedWhollyNew: true,
  g6aStillOpen: true,
  verdict:
    'MEASUREMENT / SCOPING (frontier-direction, NOT rigorous): fits and extrapolates the imp-3896 Q1 ' +
    'clean inviscid-window edge law. Reading the four measured (M, edge) points off the imp-3896 ' +
    'windowRows -- (161, 8), (321, 10), (641, 11), (1281, 13) -- and fitting edge(M) = a + b*ln(M) by ' +
    'ordinary least squares in x = ln(M) gives slope b = ' + FIT.b.toFixed(3) + ' d per e-fold, intercept ' +
    'a = ' + FIT.a.toFixed(3) + ', R^2 = ' + FIT.r2.toFixed(3) + ', RMS residual ' + FIT.rms.toFixed(2) +
    ' d and max abs residual ' + FIT.maxAbs.toFixed(2) + ' d, so the log law is a tight description of ' +
    'the widening. Inverting the fit, M_target = exp((edge_target - a) / b): reaching the ticket target ' +
    'edge = 20 d costs M ~ ' + M_FOR_EDGE_20.toExponential(2) + ', about ' +
    (M_FOR_EDGE_20 / LARGEST_M).toFixed(0) + 'x the largest measured M = 1281 block, and reaching edge ' +
    '50 d / 100 d costs M ~ 1.2e10 / 2.8e19 -- the budget grows as exp(edge / b) ~ e^(0.43 edge). This ' +
    'is the explicit ~log M scaling law behind the imp-3896 caveat: because the clean edge grows only ' +
    'logarithmically in the particle count, any fixed microscopic separation of scales carries an ' +
    'exponentially large block-size cost, so brute particle-count growth cannot reach the microscopic ' +
    'y -> 0 continuum. This is a curve-fit / budget-extrapolation MEASUREMENT on top of imp-3896, NOT a ' +
    'certificate: it does not widen the window to y -> 0, does not certify the m_zz -> 0 vanishing ' +
    'viscosity, and does not write H2, so H2 stays UNWRITTEN as a certificate, the K4 route stays WHOLLY ' +
    'NEW (consistent with imp-3714 / imp-3727 / imp-3846 / imp-3872 / imp-3891 / imp-3896) and ' +
    'G6a_shock_lipschitz stays OPEN. Scoping / measurement only; no positivity, no bridge closure, no RH ' +
    'claim, NO QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains the rigorous SOTA.',
  citation:
    'imp-3896 (the four (M, edge) clean-window points fit here, and its ~log M widening claim); imp-3872 ' +
    '(the [2, 8] clean inviscid window and ~500x m_zz shrinkage); imp-3891 (H2a continuum inviscid-Burgers ' +
    'limit written, H2b mean-field convergence OPEN); imp-3642 (attractive-CM seed, spacing d and block); ' +
    'imp-3846 / imp-3727 (H2 as the K4 dependency-chain root); Menon-Pego / Biane complex-Burgers log-gas ' +
    'hydrodynamics; lambda-roadmap Step 4 (Polymath15 bridge, open G6a_shock_lipschitz).',
};

export const IMP3914_G6A_H2_INVISCID_WINDOW_EDGE_LOGFIT_BUDGET_EXTRAPOLATION_ASSERTIONS = [
  {
    // the four points fit here are exactly the imp-3896 Q1 (M, edge) measurements, in order.
    id: 'imp3914-points-are-imp3896-measurements',
    description: 'fits the exact imp-3896 Q1 (M, edge) points (161,8),(321,10),(641,11),(1281,13)',
    holds: () =>
      POINTS.length === 4 &&
      POINTS[0].M === 161 && POINTS[0].edge === 8 &&
      POINTS[1].M === 321 && POINTS[1].edge === 10 &&
      POINTS[2].M === 641 && POINTS[2].edge === 11 &&
      POINTS[3].M === 1281 && POINTS[3].edge === 13,
  },
  {
    // the log law fits tightly: R^2 > 0.97 and every residual under half a d.
    id: 'imp3914-logfit-is-tight',
    description: 'edge(M)=a+b*ln(M) fits with R^2 ~ 0.985 and max abs residual ~ 0.30 d',
    holds: () =>
      FIT_IS_TIGHT === true &&
      FIT.r2 > 0.97 &&
      FIT.maxAbs < 0.5 &&
      FIT.residuals.length === 4,
  },
  {
    // the fitted slope is a positive ~2.31 d per e-fold: the edge grows, but only logarithmically in M.
    id: 'imp3914-slope-positive-logarithmic',
    description: 'fitted slope b ~ 2.31 d per e-fold in M (positive but logarithmic widening)',
    holds: () =>
      SLOPE_POSITIVE_LOGARITHMIC === true &&
      Math.abs(FIT.b - 2.314) < 0.05 &&
      FIT.a < 0,
  },
  {
    // extrapolation: reaching edge 20 d costs a ~21x block blow-up and edge 100 d an astronomical one,
    // so the budget is exponential in the target edge -- the microscopic continuum is unreachable by M.
    id: 'imp3914-budget-exponential-in-edge',
    description: 'edge 20 d needs M ~ 2.75e4 (>20x the M=1281 block); edge 100 d needs M > 1e18: exponential budget',
    holds: () =>
      BUDGET_EXPONENTIAL === true &&
      M_FOR_EDGE_20 / LARGEST_M > 20 &&
      Math.abs(M_FOR_EDGE_20 - 27500) / 27500 < 0.05 &&
      budgetForEdge(FIT, 100) > 1e18,
  },
  {
    // Honesty gate: measurement not certificate -- H2 unwritten, K4 wholly new, G6a open, no QED, PT
    // stays SOTA, imp-3066 untouched.
    id: 'imp3914-honesty-gate-no-qed',
    description: 'MEASUREMENT not certificate: H2 unwritten, K4 wholly new, G6a open, no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP3914_G6A_H2_INVISCID_WINDOW_EDGE_LOGFIT_BUDGET_EXTRAPOLATION.isRigorous === false &&
      IMP3914_G6A_H2_INVISCID_WINDOW_EDGE_LOGFIT_BUDGET_EXTRAPOLATION.h2StillUnwritten === true &&
      IMP3914_G6A_H2_INVISCID_WINDOW_EDGE_LOGFIT_BUDGET_EXTRAPOLATION.k4ConfirmedWhollyNew === true &&
      IMP3914_G6A_H2_INVISCID_WINDOW_EDGE_LOGFIT_BUDGET_EXTRAPOLATION.g6aStillOpen === true &&
      /NO QED/.test(IMP3914_G6A_H2_INVISCID_WINDOW_EDGE_LOGFIT_BUDGET_EXTRAPOLATION.verdict) &&
      /remains the rigorous SOTA/.test(IMP3914_G6A_H2_INVISCID_WINDOW_EDGE_LOGFIT_BUDGET_EXTRAPOLATION.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3914_G6A_H2_INVISCID_WINDOW_EDGE_LOGFIT_BUDGET_EXTRAPOLATION.verdict),
  },
];

for (const a of IMP3914_G6A_H2_INVISCID_WINDOW_EDGE_LOGFIT_BUDGET_EXTRAPOLATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3914-g6a-h2-inviscid-window-edge-logfit-budget-extrapolation assertion failed: ${a.id}`);
  }
}
