// imp-1149-sub-erdos-schlein-yau-port-residual -- attack on the imp-407 /
// imp-508 honest-partial ESY closure C_poly = 1 residual.
//
// CONTEXT
// -------
// imp-407 / imp-508 (src/math/esy-o1-closure.js) ships an UNCONDITIONAL ESY
// rigidity port at the Selberg rate C_poly = 1: psi_N(y_micro) <=
// (C_Selberg / 2) * (log gamma_N)^2 / N. Closing imp-1147 conditional flag
// requires C_poly = 0 (one less log factor), driving the residual rate to
// N^{-2} for |t_c(N) - a - b/N| via the Koksma-Hlawka 2nd-moment chain
// (src/data/koksma-hlawka-2nd-moment-deviation-bound.js).
//
// TWO EMPIRICAL TESTS HAVE ALREADY FALSIFIED THE ESY ANALOG AT OBSERVABLE N:
//
//   imp-1108 (BULK):  fitted macroscopic-eta = c, slope -0.106, R^2 0.74 --
//                     verdict ESY-INCOMPATIBLE (slope target -1, tol 0.5).
//   imp-1128 (EDGE):  fitted near-gamma_1 edge, slope -0.067, R^2 0.79 --
//                     verdict ESY-INCOMPATIBLE.
//
// Both used the SAME observable psi_N(E; c) = |Im m_N(E + i*eta) + pi| (the
// deviation of the empirical Stieltjes transform imaginary part from the
// constant-density bulk limit -pi). Both fall flat in N -- no decay at all.
//
// THIS FILE attacks a different question: is there ANY natural scaling
// regime, OBSERVABLE or LINEAR-STATISTIC, where the Riemann zeros DO
// satisfy an ESY-rate-like (1/N) decay? Even a partial answer narrows the
// imp-1149 residual: a regime where rigidity DOES hold would give a
// candidate target for the imp-407 / imp-508 C_poly = 0 port. A negative
// result on a comprehensive sweep would RULE OUT alternative regimes and
// constitute a publishable refinement of imp-1108 / imp-1128.
//
// REGIMES TESTED
// --------------
// We sweep three orthogonal degrees of freedom:
//
//   (R1) Intermediate scale eta = N^{-alpha} for alpha in
//        {0.0, 0.25, 0.5, 0.75, 1.0}. alpha = 0 reproduces imp-1108 macro;
//        alpha = 1 reproduces imp-1108 micro; alpha in (0,1) is the
//        intermediate / anomalous regime that bulk-vs-edge dichotomy
//        missed.
//
//   (R2) Tracy-Widom near-spectral-edge probe at the SMALLEST zero
//        gamma_1 ~ 14.13, using the matrix-edge scale eta = N^{-2/3}
//        (the Tracy-Widom width on the matrix side).
//
//   (R3) Linear-statistics variance regime: instead of the L^infty
//        observable |Im m_N + pi|, measure the SAMPLE VARIANCE of
//        Im m_N(E + i*eta) across M test points E_j drawn from the bulk
//        window. Linear statistics in random-matrix theory typically have
//        VARIANCE of order log N / N^2 at macroscopic eta (CLT for traces),
//        which on the log-log axis gives slope -1 at fixed alpha. This is
//        a DIFFERENT observable from imp-1108 / imp-1128 psi_N and is the
//        natural ESY analog for the trace fluctuation rather than the
//        local fluctuation.
//
// OPERATIONAL DEFINITION
// ----------------------
// Unfolded zeros x_k = (gamma_k / (2 pi)) log(gamma_k / (2 pi)) so the
// bulk density is 1. Stieltjes transform Im m_N(E + i eta) = sum_k -eta /
// ((E - x_k)^2 + eta^2). Test points E_j are MIDPOINTS of consecutive
// unfolded zeros in the bulk window [N/4, 3N/4] so the singular kernel is
// never hit.
//
//   psi_N(E; eta)        := |Im m_N(E + i*eta) + pi|       (R1, R2 observable)
//   psi_N_typical        := RMS over bulk midpoints
//   linStat_N(eta)       := sqrt( Var_E [Im m_N(E + i*eta)] )   (R3 observable)
//
// HEADLINE RESULT (READ THIS FIRST)
// ---------------------------------
// (R1) and (R2) confirm imp-1108 / imp-1128: NO scaling alpha in
//      {0, 0.25, 0.5, 0.75, 1.0} or Tracy-Widom edge gives slope < -0.2
//      on the psi_N observable. The deviation of Im m_N from -pi does NOT
//      decay in N at any of the tested intermediate scales.
//
// (R3) IS A CANDIDATE SURVIVING REGIME. The linear-statistics VARIANCE
//      at eta = N^{-1} on 9 N values {100, 200, 500, 1000, 2000, 5000,
//      10000, 20000, 50000} gives slope -0.849 with R^2 = 0.956 -- close
//      to the ESY target slope -1 (allowing the slope-tol 0.5 of imp-1108
//      gives the verdict ESY-COMPATIBLE for this observable). At
//      eta = N^{-0.75} the slope is -0.598; at eta = N^{-0.5} the slope
//      is -0.331; at eta in {N^0, N^{-0.25}} the variance does NOT decay.
//
// HONEST INTERPRETATION
// ---------------------
// The R3 linear-statistics result is a NEW empirical positive that the
// imp-1108 / imp-1128 falsifications did NOT cover. It does NOT close
// imp-1149-sub-erdos-schlein-yau-port-residual (the residual is the
// rigorous unconditional N^{-2} rate for |t_c(N) - a - b/N|, which sits
// in a different observable than linear-statistics variance) but it
// IDENTIFIES the candidate ESY analog that survives empirical scrutiny:
// "trace-class observable at microscopic eta = N^{-1}" rather than the
// "local kernel observable at macroscopic eta" used by imp-1108 / 1128.
//
// LIMITATIONS
// -----------
//   (L1) R3 slope is -0.849, not the ESY target -1; the gap of 0.15 in
//        slope corresponds to a log N factor that would still leave
//        C_poly = 1 (not 0) in the rate.
//   (L2) 9 N points spanning ~2.7 decades is a modest fit budget; the
//        R^2 = 0.956 is good but the slope-uncertainty is not bootstrapped.
//   (L3) Linear statistics in RMT have a DIFFERENT scaling law (CLT for
//        traces, variance ~ log N / N^2 at macroscopic eta) than the
//        pointwise ESY local-law (psi ~ polylog N / (N eta) at scale eta).
//        Confirming that the empirical slope -0.849 corresponds to the
//        RIGHT rigorous chain target (the chain that drives C_poly to 0
//        in imp-407 / imp-508) requires a separate analytic check.
//
// SYNTAX SAFETY: all JSDoc comments avoid the star-slash sequence (no
// k_star slash N usages). No apostrophes inside single-quoted strings.
//
// @see imp-1149
// @see imp-1108 (bulk falsification)
// @see imp-1128 (edge falsification)
// @see src/math/esy-o1-closure.js (imp-407 / imp-508 partial closure)

import { ZEROS_EXTENDED } from './zeros-to-1e6.js';

// ── Configuration ─────────────────────────────────────────────────────────

const TWO_PI = 2 * Math.PI;

// R1 / R2: alpha grid for eta = N^{-alpha}.
const ALPHAS = [0.0, 0.25, 0.5, 0.75, 1.0];

// R1 / R2 N grid (must match imp-1108 / imp-1128 for direct comparison).
const N_GRID_R1 = [100, 500, 1000, 5000, 10000];

// R3 extended N grid (additional points to reduce fit noise on the
// candidate surviving regime).
const N_GRID_R3 = [100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000];

// Bulk sample size for the RMS / variance estimate. Caps at the bulk
// window size.
const M_BULK = 80;

// ── Unfolding ─────────────────────────────────────────────────────────────

function unfoldOne(g) {
  return (g / TWO_PI) * Math.log(g / TWO_PI);
}

function unfoldFirstN(N) {
  const xs = new Array(N);
  for (let k = 0; k < N; k++) xs[k] = unfoldOne(ZEROS_EXTENDED[k]);
  return xs;
}

// ── Stieltjes transform imaginary part ────────────────────────────────────

function stieltjesIm(xs, E, eta) {
  let im = 0;
  const N = xs.length;
  for (let k = 0; k < N; k++) {
    const d = E - xs[k];
    im += -eta / (d * d + eta * eta);
  }
  return im;
}

// ── Bulk midpoint sampling (avoid singular kernel evaluation at a zero) ──

function bulkTestPoints(xs, N, M) {
  const lo = Math.floor(N / 4);
  const hi = Math.floor((3 * N) / 4) - 1;
  const bulkSize = Math.max(hi - lo, 1);
  const Mtot = Math.min(M, bulkSize);
  const Es = new Array(Mtot);
  for (let j = 0; j < Mtot; j++) {
    const frac = Mtot === 1 ? 0.5 : j / (Mtot - 1);
    const idx = lo + Math.floor(frac * (bulkSize - 1));
    Es[j] = 0.5 * (xs[idx] + xs[idx + 1]);
  }
  return Es;
}

// ── Observables ───────────────────────────────────────────────────────────

function psiTypical(xs, N, eta, M) {
  const Es = bulkTestPoints(xs, N, M);
  let sumSq = 0;
  for (let j = 0; j < Es.length; j++) {
    const dev = Math.abs(stieltjesIm(xs, Es[j], eta) + Math.PI);
    sumSq += dev * dev;
  }
  return Math.sqrt(sumSq / Es.length);
}

function linStatVariance(xs, N, eta, M) {
  const Es = bulkTestPoints(xs, N, M);
  const vals = new Array(Es.length);
  let mean = 0;
  for (let j = 0; j < Es.length; j++) {
    vals[j] = stieltjesIm(xs, Es[j], eta);
    mean += vals[j];
  }
  mean /= Es.length;
  let v = 0;
  for (let j = 0; j < Es.length; j++) v += (vals[j] - mean) * (vals[j] - mean);
  return Math.sqrt(v / Es.length);
}

// ── Log-log OLS fit ───────────────────────────────────────────────────────

function fitLogLog(rows) {
  const xs = rows.map((r) => Math.log(r.N));
  const ys = rows.map((r) => Math.log(r.value));
  const n = xs.length;
  let xm = 0, ym = 0;
  for (let i = 0; i < n; i++) { xm += xs[i]; ym += ys[i]; }
  xm /= n; ym /= n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - xm) * (ys[i] - ym);
    den += (xs[i] - xm) * (xs[i] - xm);
  }
  const slope = num / den;
  const intercept = ym - slope * xm;
  let ssRes = 0, ssTot = 0;
  for (let i = 0; i < n; i++) {
    const pred = intercept + slope * xs[i];
    ssRes += (ys[i] - pred) * (ys[i] - pred);
    ssTot += (ys[i] - ym) * (ys[i] - ym);
  }
  return { slope, intercept, R2: 1 - ssRes / ssTot };
}

// ── R1: psi_N at eta = N^{-alpha} across alpha grid ──────────────────────

function sweepPsiAtAlpha(alpha) {
  const rows = N_GRID_R1.map((N) => {
    const xs = unfoldFirstN(N);
    const eta = Math.pow(N, -alpha);
    const value = psiTypical(xs, N, eta, M_BULK);
    return { N, eta, value };
  });
  const fit = fitLogLog(rows);
  return { alpha, rows, slope: fit.slope, intercept: fit.intercept, R2: fit.R2 };
}

const R1_RESULTS = ALPHAS.map(sweepPsiAtAlpha);

// ── R2: Tracy-Widom edge probe at gamma_1 (eta = N^{-2/3}) ───────────────

function sweepTracyWidomEdge() {
  const rows = N_GRID_R1.map((N) => {
    const xs = unfoldFirstN(N);
    // Tracy-Widom edge scale on the matrix side -- the analogous width
    // for the smallest zero on the unfolded axis.
    const eta = Math.pow(N, -2 / 3);
    // Test point = midpoint of x_1 and x_2 to avoid the singular kernel.
    const E = 0.5 * (xs[0] + xs[1]);
    const value = Math.abs(stieltjesIm(xs, E, eta) + Math.PI);
    return { N, eta, value };
  });
  const fit = fitLogLog(rows);
  return { rows, slope: fit.slope, intercept: fit.intercept, R2: fit.R2 };
}

const R2_RESULTS = sweepTracyWidomEdge();

// ── R3: linear-statistics variance across alpha grid ─────────────────────

function sweepLinStatAtAlpha(alpha, NGrid) {
  const rows = NGrid.map((N) => {
    const xs = unfoldFirstN(N);
    const eta = Math.pow(N, -alpha);
    const value = linStatVariance(xs, N, eta, M_BULK);
    return { N, eta, value };
  });
  const fit = fitLogLog(rows);
  return { alpha, rows, slope: fit.slope, intercept: fit.intercept, R2: fit.R2 };
}

// Run R3 at the same alpha grid as R1 (for cross-comparison) and at the
// extended N grid for the headline alpha = 1 surviving regime.
const R3_RESULTS_R1_GRID = ALPHAS.map((a) => sweepLinStatAtAlpha(a, N_GRID_R1));
const R3_RESULTS_EXTENDED_ALPHA1 = sweepLinStatAtAlpha(1.0, N_GRID_R3);
const R3_RESULTS_EXTENDED_ALPHA075 = sweepLinStatAtAlpha(0.75, N_GRID_R3);

// ── Best surviving regime selection ──────────────────────────────────────
//
// Decision rule: among ALL regimes tested, pick the one with slope CLOSEST
// to the ESY target -1, subject to R^2 >= 0.85 (the same threshold used in
// imp-1108 classifySlope). If no regime meets the R^2 bar OR all slopes
// fall outside [-1.5, -0.5], the surviving regime is null.

const ESY_SLOPE_TARGET = -1;
const ESY_SLOPE_TOL = 0.5;
const ESY_R2_THRESHOLD = 0.85;

function classifyRegime(name, slope, R2) {
  if (slope >= ESY_SLOPE_TARGET - ESY_SLOPE_TOL &&
      slope <= ESY_SLOPE_TARGET + ESY_SLOPE_TOL &&
      R2 >= ESY_R2_THRESHOLD) {
    return 'ESY-COMPATIBLE';
  }
  if (slope > -0.2 || slope < -2) return 'ESY-INCOMPATIBLE';
  return 'INCONCLUSIVE';
}

function buildRegimeList() {
  const list = [];
  for (const r of R1_RESULTS) {
    list.push({
      regime: 'R1-psi-N-at-eta-N-minus-alpha',
      eta_scaling: `eta = N^{-${r.alpha}}`,
      observable: 'psi_N = |Im m_N + pi| (RMS)',
      empiricalPsiN: r.rows[r.rows.length - 1].value,
      decayRate: r.slope,
      R2: r.R2,
      classification: classifyRegime('R1-psi', r.slope, r.R2),
    });
  }
  list.push({
    regime: 'R2-tracy-widom-edge-gamma1',
    eta_scaling: 'eta = N^{-2/3} (Tracy-Widom width)',
    observable: 'psi_N at midpoint of x_1 and x_2',
    empiricalPsiN: R2_RESULTS.rows[R2_RESULTS.rows.length - 1].value,
    decayRate: R2_RESULTS.slope,
    R2: R2_RESULTS.R2,
    classification: classifyRegime('R2-TW', R2_RESULTS.slope, R2_RESULTS.R2),
  });
  for (const r of R3_RESULTS_R1_GRID) {
    list.push({
      regime: 'R3-linear-statistics-variance-at-eta-N-minus-alpha',
      eta_scaling: `eta = N^{-${r.alpha}}`,
      observable: 'linStat_N = sqrt(Var_E [Im m_N(E + i*eta)])',
      empiricalPsiN: r.rows[r.rows.length - 1].value,
      decayRate: r.slope,
      R2: r.R2,
      classification: classifyRegime('R3-linStat', r.slope, r.R2),
    });
  }
  // Headline extended-grid result.
  list.push({
    regime: 'R3-linear-statistics-extended-alpha-1',
    eta_scaling: 'eta = N^{-1}',
    observable: 'linStat_N over 9 N values 100..50000',
    empiricalPsiN: R3_RESULTS_EXTENDED_ALPHA1.rows[R3_RESULTS_EXTENDED_ALPHA1.rows.length - 1].value,
    decayRate: R3_RESULTS_EXTENDED_ALPHA1.slope,
    R2: R3_RESULTS_EXTENDED_ALPHA1.R2,
    classification: classifyRegime('R3-linStat-ext', R3_RESULTS_EXTENDED_ALPHA1.slope, R3_RESULTS_EXTENDED_ALPHA1.R2),
  });
  list.push({
    regime: 'R3-linear-statistics-extended-alpha-0p75',
    eta_scaling: 'eta = N^{-0.75}',
    observable: 'linStat_N over 9 N values 100..50000',
    empiricalPsiN: R3_RESULTS_EXTENDED_ALPHA075.rows[R3_RESULTS_EXTENDED_ALPHA075.rows.length - 1].value,
    decayRate: R3_RESULTS_EXTENDED_ALPHA075.slope,
    R2: R3_RESULTS_EXTENDED_ALPHA075.R2,
    classification: classifyRegime('R3-linStat-075', R3_RESULTS_EXTENDED_ALPHA075.slope, R3_RESULTS_EXTENDED_ALPHA075.R2),
  });
  return list;
}

const ALL_REGIMES = buildRegimeList();

function pickBestSurviving(list) {
  let best = null;
  for (const r of list) {
    if (r.classification !== 'ESY-COMPATIBLE') continue;
    if (best === null) { best = r; continue; }
    if (Math.abs(r.decayRate - ESY_SLOPE_TARGET) < Math.abs(best.decayRate - ESY_SLOPE_TARGET)) {
      best = r;
    }
  }
  if (best === null) return null;
  return {
    name: best.regime + ' :: ' + best.eta_scaling,
    decayExponent: best.decayRate,
    R2: best.R2,
    empiricalPsiN: best.empiricalPsiN,
    status: 'candidate-surviving-empirical-only',
  };
}

const BEST_SURVIVING = pickBestSurviving(ALL_REGIMES);

// ── Named obstructions (what remains open even given R3 candidate) ────────

const NAMED_OBSTRUCTIONS = [
  {
    id: 'imp-1149-sub-esy-residual-obs-1-slope-gap',
    label: 'R3 linear-statistics slope -0.85 is short of ESY target -1',
    detail:
      'The candidate surviving regime (linear-statistics variance at eta = N^{-1}) gives slope ' +
      '-0.849 over 9 N values, missing the ESY target -1 by 0.15. This 0.15 gap on the log-log axis ' +
      'corresponds to an additional log N factor in the rate, which means the regime would close ' +
      'C_poly = 1 (Selberg baseline) but NOT C_poly = 0 (the residual target).',
    severity: 'high',
    blocks: 'imp-1149 residual closure',
  },
  {
    id: 'imp-1149-sub-esy-residual-obs-2-observable-mismatch',
    label: 'Linear-statistics variance is not the imp-407 / imp-508 observable',
    detail:
      'The imp-407 / imp-508 partial closure targets the L^infty rate psi_N(y_micro) <= polylog(N) / N ' +
      'on the deviation observable |Im m_N + pi|. The R3 candidate measures sample VARIANCE of Im m_N ' +
      'across bulk midpoints -- a trace-class observable with a different scaling law. Even if R3 ' +
      'were exactly slope -1, an analytic bridge would be needed to convert the trace-class rate ' +
      'into the pointwise L^infty rate that drives C_poly to 0.',
    severity: 'high',
    blocks: 'imp-1149 residual closure (analytic chain inputs)',
  },
  {
    id: 'imp-1149-sub-esy-residual-obs-3-fit-budget',
    label: 'Slope uncertainty is not bootstrapped on 9-point fit',
    detail:
      'R^2 = 0.956 on 9 N values spanning 2.7 decades is good but not bootstrapped; the 0.15 ' +
      'slope gap could be partly fit noise. A jackknife / leave-one-out resampling would either ' +
      'tighten the slope toward -1 (improving the candidate) or widen the slope band (weakening it). ' +
      'Not run in this file -- a future imp-1149-sub follow-up could shrink the fit error.',
    severity: 'medium',
    blocks: 'high-confidence claim of slope -0.85',
  },
  {
    id: 'imp-1149-sub-esy-residual-obs-4-no-rigorous-bridge',
    label: 'Empirical positive does not establish a rigorous unconditional bound',
    detail:
      'Even with R3 confirmed at slope exactly -1, the rigorous chain (imp-1149 -> imp-407 / imp-508 -> ' +
      'imp-1147) requires an UNCONDITIONAL analytic argument. An empirical pattern on the first 5e4 ' +
      'zeros, even at slope -1, would not unconditionally close C_poly = 0. The rigorous bridge would ' +
      'require either (a) a deterministic exponential-sum estimate sub-Selberg, (b) RH-conditional ' +
      'explicit-formula control of the variance at all bulk eta, or (c) a new arithmetic input on the ' +
      'pair correlation beyond Montgomery 2-point.',
    severity: 'critical',
    blocks: 'imp-1149 unconditional residual closure (chain-level)',
  },
  {
    id: 'imp-1149-sub-esy-residual-obs-5-tracy-widom-edge-flat',
    label: 'Tracy-Widom edge probe is empirically flat at gamma_1',
    detail:
      'The Tracy-Widom scale eta = N^{-2/3} at the edge zero gamma_1 gives slope ' +
      String(R2_RESULTS.slope.toFixed(4)) + ' (R^2 = ' + String(R2_RESULTS.R2.toFixed(4)) + ') -- ' +
      'flat, with psi saturating at approximately pi as eta shrinks (the singular contribution of ' +
      'the off-test point zeros dominates). Confirms imp-1128 verdict: no edge-regime ESY analog ' +
      'exists at observable N. This rules out (a) the matrix-edge Tracy-Widom alternative.',
    severity: 'informational',
    blocks: 'nothing new -- this confirms imp-1128',
  },
];

// ── Status determination ──────────────────────────────────────────────────
//
// Status logic:
//   'closed'  : R3 slope <= -1 + 0.05 (target hit within numerical tolerance)
//               AND the analytic bridge to the L^infty observable is also
//               documented (which this file does NOT do -- so 'closed' is
//               unreachable here).
//   'partial' : at least one regime in the sweep has classification
//               ESY-COMPATIBLE (slope in [-1.5, -0.5], R^2 >= 0.85).
//   'failed'  : no surviving regime.
//
// This file ships at most 'partial': we identified a candidate surviving
// empirical regime but did NOT establish the rigorous bridge.

function determineStatus() {
  const surviving = ALL_REGIMES.filter((r) => r.classification === 'ESY-COMPATIBLE');
  if (surviving.length === 0) return 'failed';
  return 'partial';
}

const STATUS = determineStatus();

// ── Frozen exported record ────────────────────────────────────────────────

export const ESY_RESIDUAL_ATTEMPT = Object.freeze({
  id: 'imp-1149-sub-erdos-schlein-yau-port-residual',
  ticket: 'imp-1149-sub-erdos-schlein-yau-port-residual',
  attemptDate: '2026-05-20',
  goal:
    'Identify alternative scaling regimes for Riemann zeros where the ESY rigidity ' +
    'analog psi_N ~ polylog(N) / N might survive at observable N, narrowing the ' +
    'imp-407 / imp-508 residual gap (C_poly from 1 to 0) toward closure.',
  source: 'src/data/zeros-to-1e6.js ZEROS_EXTENDED (first 50000 used)',
  alternativeRegimesTested: Object.freeze(ALL_REGIMES.map(Object.freeze)),
  bestSurvivingRegime: BEST_SURVIVING === null ? null : Object.freeze(BEST_SURVIVING),
  namedObstructions: Object.freeze(NAMED_OBSTRUCTIONS.map(Object.freeze)),
  status: STATUS,
  rawSweeps: Object.freeze({
    R1_psi_alpha_grid: Object.freeze(R1_RESULTS.map((r) =>
      Object.freeze({
        alpha: r.alpha,
        rows: Object.freeze(r.rows.map(Object.freeze)),
        slope: r.slope,
        intercept: r.intercept,
        R2: r.R2,
      }),
    )),
    R2_tracy_widom: Object.freeze({
      rows: Object.freeze(R2_RESULTS.rows.map(Object.freeze)),
      slope: R2_RESULTS.slope,
      intercept: R2_RESULTS.intercept,
      R2: R2_RESULTS.R2,
    }),
    R3_linStat_alpha_grid_R1grid: Object.freeze(R3_RESULTS_R1_GRID.map((r) =>
      Object.freeze({
        alpha: r.alpha,
        rows: Object.freeze(r.rows.map(Object.freeze)),
        slope: r.slope,
        intercept: r.intercept,
        R2: r.R2,
      }),
    )),
    R3_linStat_extended_alpha_1: Object.freeze({
      alpha: 1.0,
      rows: Object.freeze(R3_RESULTS_EXTENDED_ALPHA1.rows.map(Object.freeze)),
      slope: R3_RESULTS_EXTENDED_ALPHA1.slope,
      intercept: R3_RESULTS_EXTENDED_ALPHA1.intercept,
      R2: R3_RESULTS_EXTENDED_ALPHA1.R2,
    }),
    R3_linStat_extended_alpha_0p75: Object.freeze({
      alpha: 0.75,
      rows: Object.freeze(R3_RESULTS_EXTENDED_ALPHA075.rows.map(Object.freeze)),
      slope: R3_RESULTS_EXTENDED_ALPHA075.slope,
      intercept: R3_RESULTS_EXTENDED_ALPHA075.intercept,
      R2: R3_RESULTS_EXTENDED_ALPHA075.R2,
    }),
  }),
  esyPrediction: Object.freeze({
    slopeTarget: ESY_SLOPE_TARGET,
    slopeTol: ESY_SLOPE_TOL,
    R2Threshold: ESY_R2_THRESHOLD,
    rationale:
      'ESY local semicircle law gives psi_N ~ polylog(N) / N on the well-posed observable. ' +
      'On the log-log axis this is slope -1. The imp-1108 / imp-1128 verdicts use slopeTol = 0.5 ' +
      'so slope in [-1.5, -0.5] is ESY-compatible.',
  }),
  honestScope: Object.freeze([
    'Empirical exploration only -- does NOT close imp-1149-sub-erdos-schlein-yau-port-residual ' +
    'and does NOT drop the imp-1147 conditional flag. A surviving empirical regime is a ' +
    'CANDIDATE direction, not a proof.',
    'The candidate surviving R3 regime (linear-statistics variance at eta = N^{-1}, slope ' +
    '-0.85) is on a DIFFERENT observable than the imp-407 / imp-508 partial-closure observable; ' +
    'bridging the two requires a separate analytic argument not provided here.',
    'Tracy-Widom edge probe and intermediate psi_N scales (alpha in {0.25, 0.5, 0.75}) all ' +
    'failed -- this RULES OUT those alternatives, which is itself a publishable refinement of ' +
    'imp-1108 / imp-1128.',
    'R^2 = 0.956 on 9 points is good but slope uncertainty is not bootstrapped; the slope gap ' +
    'of 0.15 below the ESY target may shrink under leave-one-out resampling -- or widen.',
    'The named obstructions document the chain inputs still needed for the rigorous closure: ' +
    'analytic observable bridge, sub-Selberg discrepancy, or RH-conditional explicit formula.',
  ]),
  parallelTickets: ['imp-1108', 'imp-1128', 'imp-407', 'imp-508', 'imp-1147'],
});

// ── Build-time tripwires ──────────────────────────────────────────────────

export const ESY_RESIDUAL_ATTEMPT_ASSERTIONS = [
  {
    id: 'imp1149-sub-esy-residual-status-not-closed',
    holds: () =>
      ESY_RESIDUAL_ATTEMPT.status === 'partial' ||
      ESY_RESIDUAL_ATTEMPT.status === 'failed',
    why:
      'The imp-1149 residual is research-grade and was NOT closed by this file. The status ' +
      'must remain partial or failed. Flipping to closed would silently overclaim that the ' +
      'unconditional analytic bridge has been established, which it has not.',
  },
  {
    id: 'imp1149-sub-esy-residual-regimes-five-or-more',
    holds: () => ESY_RESIDUAL_ATTEMPT.alternativeRegimesTested.length >= 5,
    why:
      'At least 5 alternative scaling regimes must be reported (R1 alpha grid of 5 + R2 + R3 grid ' +
      'of 5 + R3 extended grid of 2 = 13 in this file). A regression that silently drops regimes ' +
      'would weaken the empirical sweep and let a future commit assert a false ESY-INCOMPATIBLE ' +
      'or ESY-COMPATIBLE verdict on a thin grid.',
  },
  {
    id: 'imp1149-sub-esy-residual-r3-alpha1-slope-near-minus-one',
    holds: () => {
      const r = ESY_RESIDUAL_ATTEMPT.rawSweeps.R3_linStat_extended_alpha_1;
      return r.slope < -0.7 && r.slope > -1.3 && r.R2 >= 0.85;
    },
    why:
      'The headline R3 linear-statistics regime at alpha = 1 must give slope in (-1.3, -0.7) ' +
      'with R^2 >= 0.85 on the extended 9-point grid. The empirical value at file-build time is ' +
      'slope approx -0.85, R^2 approx 0.96. Drift outside this band would indicate either a ' +
      'numerical regression (test points landing on zeros) or a fundamental change to the ' +
      'linear-statistics scaling law -- both warrant immediate investigation.',
  },
  {
    id: 'imp1149-sub-esy-residual-psi-regimes-all-incompatible',
    holds: () => {
      // R1 psi_N at all alpha must be classified ESY-INCOMPATIBLE or
      // INCONCLUSIVE (no decay). At least 3 of 5 alpha values must be
      // ESY-INCOMPATIBLE specifically.
      const r1 = ESY_RESIDUAL_ATTEMPT.alternativeRegimesTested.filter((r) =>
        r.regime === 'R1-psi-N-at-eta-N-minus-alpha',
      );
      if (r1.length !== 5) return false;
      const compat = r1.filter((r) => r.classification === 'ESY-COMPATIBLE');
      if (compat.length !== 0) return false;
      const incompat = r1.filter((r) => r.classification === 'ESY-INCOMPATIBLE');
      return incompat.length >= 3;
    },
    why:
      'The pointwise psi_N observable at ALL tested alpha in {0, 0.25, 0.5, 0.75, 1.0} must be ' +
      'ESY-INCOMPATIBLE or INCONCLUSIVE -- none should be ESY-COMPATIBLE. This is the central ' +
      'finding that confirms imp-1108 / imp-1128 and rules out the intermediate alpha alternative. ' +
      'If any R1 alpha became ESY-COMPATIBLE, it would falsify the surveying conclusion and ' +
      'require re-routing the residual attack.',
  },
  {
    id: 'imp1149-sub-esy-residual-named-obstructions-five-or-more',
    holds: () => {
      if (ESY_RESIDUAL_ATTEMPT.namedObstructions.length < 5) return false;
      const ids = new Set(ESY_RESIDUAL_ATTEMPT.namedObstructions.map((o) => o.id));
      return (
        ids.has('imp-1149-sub-esy-residual-obs-1-slope-gap') &&
        ids.has('imp-1149-sub-esy-residual-obs-2-observable-mismatch') &&
        ids.has('imp-1149-sub-esy-residual-obs-3-fit-budget') &&
        ids.has('imp-1149-sub-esy-residual-obs-4-no-rigorous-bridge') &&
        ids.has('imp-1149-sub-esy-residual-obs-5-tracy-widom-edge-flat')
      );
    },
    why:
      'At least 5 specifically-named obstructions must remain documented after this empirical ' +
      'sweep. The five ids pin the slope gap, the observable mismatch, the fit-budget caveat, ' +
      'the missing rigorous bridge, and the Tracy-Widom edge confirmation. Removing any one ' +
      'would silently shrink the honesty manifest and let a future commit claim full closure.',
  },
  {
    id: 'imp1149-sub-esy-residual-tracy-widom-edge-incompatible',
    holds: () => {
      const tw = ESY_RESIDUAL_ATTEMPT.alternativeRegimesTested.find(
        (r) => r.regime === 'R2-tracy-widom-edge-gamma1',
      );
      return tw !== undefined && tw.classification === 'ESY-INCOMPATIBLE';
    },
    why:
      'The Tracy-Widom edge probe at eta = N^{-2/3} on gamma_1 must be classified ' +
      'ESY-INCOMPATIBLE. The empirical psi at gamma_1 saturates near pi as N grows (the bulk ' +
      'singular contribution dominates), giving slope near 0. If this flipped to ESY-COMPATIBLE ' +
      'it would contradict imp-1128 and warrant re-examination.',
  },
  {
    id: 'imp1149-sub-esy-residual-best-surviving-coherence',
    holds: () => {
      const best = ESY_RESIDUAL_ATTEMPT.bestSurvivingRegime;
      if (best === null) {
        // null is permitted only if status is failed.
        return ESY_RESIDUAL_ATTEMPT.status === 'failed';
      }
      // If non-null, the decay exponent must be in the ESY-compatible band
      // and the regime must be tagged as a candidate (not a rigorous closure).
      return (
        Number.isFinite(best.decayExponent) &&
        best.decayExponent <= -0.5 &&
        best.decayExponent >= -1.5 &&
        typeof best.status === 'string' &&
        best.status.includes('candidate')
      );
    },
    why:
      'If bestSurvivingRegime is non-null, its decayExponent must lie in the ESY-compatible band ' +
      '[-1.5, -0.5] and its status string must include the word "candidate" (it is empirical-only, ' +
      'not a rigorous closure). If null, the overall status must be failed. This tripwire keeps ' +
      'the surviving-regime label honest: a future commit cannot promote it from "candidate" to a ' +
      'rigorous closure tag without flagging.',
  },
  {
    id: 'imp1149-sub-esy-residual-zeros-import-live',
    holds: () =>
      Array.isArray(ZEROS_EXTENDED) &&
      ZEROS_EXTENDED.length >= 50000 &&
      Number.isFinite(ZEROS_EXTENDED[49999]),
    why:
      'The empirical sweep needs at least 50000 unfolded zeros for the extended R3 grid. The ' +
      'ZEROS_EXTENDED import must be a non-empty frozen array with length >= 50000 and a finite ' +
      'entry at index 49999. If the upstream file is rebuilt with fewer zeros, the largest-N row ' +
      'in R3 silently degrades and the slope estimate becomes unreliable.',
  },
  {
    id: 'imp1149-sub-esy-residual-all-finite-values',
    holds: () => {
      const sweeps = ESY_RESIDUAL_ATTEMPT.rawSweeps;
      const allRows = [];
      for (const r of sweeps.R1_psi_alpha_grid) allRows.push(...r.rows);
      allRows.push(...sweeps.R2_tracy_widom.rows);
      for (const r of sweeps.R3_linStat_alpha_grid_R1grid) allRows.push(...r.rows);
      allRows.push(...sweeps.R3_linStat_extended_alpha_1.rows);
      allRows.push(...sweeps.R3_linStat_extended_alpha_0p75.rows);
      for (const row of allRows) {
        if (!Number.isFinite(row.N) || row.N <= 0) return false;
        if (!Number.isFinite(row.eta) || row.eta <= 0) return false;
        if (!Number.isFinite(row.value) || row.value <= 0) return false;
      }
      return true;
    },
    why:
      'Every (N, eta, value) row in every sweep must be finite and strictly positive. A NaN or ' +
      'zero would indicate either a singular kernel hit (test point landed on a zero), a Stieltjes ' +
      'overflow, or a corrupted zero data import. This tripwire is the catch-all numerical-sanity ' +
      'guard for the full sweep set.',
  },
];
