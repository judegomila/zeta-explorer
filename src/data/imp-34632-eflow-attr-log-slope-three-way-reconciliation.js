/**
 * @module imp-34632-eflow-attr-log-slope-three-way-reconciliation
 * @fileoverview imp-34632 -- CROSS-TABULATE the eflow_attr leading log-slope across its THREE
 *   independent determinations, never before placed side by side on one footing, with pairwise
 *   residuals measured in units of the double-precision curvature floor.
 *
 *   The eflow_attr leading log-slope m(k) = d(ln eflow_attr)/dk (per k = per log10 N) has been
 *   pinned three separate ways, each with a different modelling choice:
 *     D1 -- imp-34570 PURE power-law fit   eflow_attr = A * N^p  (R^2 = 0.99999993), giving a
 *           CONSTANT per-k slope p*ln10 = -2.158629 and, by construction, ZERO log-curvature.
 *     D2 -- imp-34585 (near) / imp-34604 (far) LOG-CORRECTED fit  eflow_attr = A*N^p*(ln N)^q,
 *           giving a k-VARYING local slope ln10*(p + q/u) and a nonzero curvature -q*ln10^2/u^2
 *           (u = ln N at the decade top N = 10^(k+1)); the fitted q ~ 3.348 (near) / 3.346 (far).
 *     D3 -- imp-34612 CURVATURE determination: the directly-observed finite-difference
 *           d2(ln eflow_attr)/dk2 on the imp-34586 deep-far rungs, plus the analytic pure-q=3
 *           log^3(N)/N surrogate curvature. imp-34570 also exports the analytic surrogate slope
 *           -2.161846 per k that this curvature is consistent with.
 *   D1 and D2 are slope fits over the smooth bracket; D3 is a second-derivative measurement. They
 *   share a common node grid (the imp-34612/imp-34586 deep-far nodes k = 21.75 .. 21.95, at which
 *   D3 is defined), so all three can be evaluated at matched k and differenced.
 *
 *   THE CROSS-TABULATION (import-light, all four determinations REUSED verbatim).
 *   ---------------------------------------------------------------------------------
 *   Two comparable footings are tabulated at each matched node:
 *     - the leading per-k log-SLOPE m(k), where D1 gives a constant, D2 a local k-varying value;
 *     - the log-CURVATURE m'(k) = d2(ln eflow_attr)/dk2, the DISCRIMINATING footing where the
 *       three genuinely diverge: D1 forces m' = 0, D2 predicts -q*ln10^2/u^2 from the fitted q,
 *       and D3 measures m' directly (observed) and from the pure surrogate (analytic).
 *   Pairwise curvature residuals are reported in units of the imp-34612 double-precision curvature
 *   floor F ~ 8e-6 (the 9-sig-fig rungs amplified by 4/h^2), so "consistent to the floor" is a
 *   quantitative verdict, not an eyeball.
 *
 *   FINDINGS (measurement/cross-tabulation only).
 *   ---------------------------------------------------------------------------------
 *   (F1) THE LEADING SLOPE AGREES ACROSS ALL THREE TO ~0.15%. At the matched nodes the D2
 *        log-corrected LOCAL slope is -2.1620 -> -2.1632 per k, sitting on the imp-34570 analytic
 *        surrogate slope -2.161846 (D3's slope reference) to ~0.01-0.06%; the D1 pure power-law
 *        fit slope -2.158629 is the least negative, ~0.15% above, because it is a single
 *        window-AVERAGED slope where the local slope actually has curvature. No determination is a
 *        slope outlier: all three land within ~0.005 per k of one another.
 *   (F2) ON THE DISCRIMINATING CURVATURE FOOTING, D2 (FITTED q) AND D3 (OBSERVED) ARE MUTUALLY
 *        CONSISTENT TO THE DOUBLE-PRECISION FLOOR. The D2 log-corrected curvature -q*ln10^2/u^2
 *        (near, q = 3.348) is -6.469e-3 -> -6.357e-3; the D3 imp-34612 directly-observed curvature
 *        is -6.460e-3 -> -6.345e-3; their node-by-node difference is 1.1x .. 2.1x the floor F ~ 8e-6
 *        (mean ~1.5x) -- i.e. the free-q fit and the direct second-difference agree essentially AT
 *        the double-precision floor. The far-side imp-34604 fit (q = 3.346) reproduces this.
 *   (F3) D1 IS A DELIBERATE CURVATURE OUTLIER (~800x FLOOR) AND D3's PURE-q=3 SURROGATE CARRIES
 *        THE ~53x-FLOOR C_F/GRONWALL RESIDUAL. The D1 pure power law forces curvature 0, so its
 *        residual against the observed -6.4e-3 is ~793x .. 807x the floor -- a structural outlier,
 *        driven purely by the modelling choice of NO log term. The D3 analytic pure-q=3 log^3(N)/N
 *        surrogate sits -4.2e-4 (~51x .. 53x floor) from the observed, the same ~7% residual
 *        imp-34612 flagged; that residual is EXACTLY the q-excess (fitted q ~ 3.348 vs analytic 3,
 *        i.e. +0.348) the D2 log-corrected fit absorbs -- the C_F(T0)/Gronwall correction the pure
 *        surrogate drops. So each discrepancy has an identified modelling driver: D1 = no log term
 *        (zero curvature), D3-analytic = fixed q=3 (drops C_F/Gronwall), D2 = free q (absorbs it).
 *
 *   The punchline: the three eflow_attr log-slope determinations are mutually consistent at the
 *   leading slope to ~0.15%; on the curvature footing that actually distinguishes them, the two
 *   FREE-shape determinations -- the imp-34585/34604 log-corrected fit (fitted q ~ 3.348) and the
 *   imp-34612 directly-observed second difference -- agree to ~1.5x the double-precision floor,
 *   while the imp-34570 pure power law (curvature forced to 0) and the imp-34612 pure-q=3 surrogate
 *   (curvature ~7% short) are the two constrained-shape outliers, their offsets pinned to their
 *   respective dropped terms (the log correction, and the C_F/Gronwall correction).
 *
 *   MEASUREMENT / CROSS-TABULATION ONLY. A side-by-side evaluation of three previously separate
 *   determinations of the inherited surrogate quantity eflow_attr, reusing the imp-34570 /
 *   imp-34585 / imp-34604 / imp-34612 exports verbatim. Descriptive surrogate, NOT a rigorous
 *   asymptotic; the component model is the inherited imp-3220/imp-3406 extrapolation; the C_mb
 *   GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 *   imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34570-eflow-attr-power-law-fit-eflow-slope-check.js (D1: pure power-law fit slope; analytic surrogate slope)
 *   @see imp-34585-eflow-attr-log-corrected-fit.js (D2 near: log-corrected p,q)
 *   @see imp-34604-eflow-attr-far-side-log-corrected-cross-fit.js (D2 far: log-corrected p,q)
 *   @see imp-34612-eflow-attr-convexity-vs-analytic-log3-curvature.js (D3: observed + analytic log-curvature; the double-precision floor)
 *   @see imp-34625-eflow-attr-slope-vs-curvature-single-correction-reconcile.js (the sibling single-correction reconciliation)
 */

import {
  IMP34570_FIT_PER_K_SLOPE,
  IMP34570_EFLOW_ANALYTIC_SLOPE_PER_K,
} from './imp-34570-eflow-attr-power-law-fit-eflow-slope-check.js';
import { IMP34585_LOGCORR_P, IMP34585_LOGCORR_Q } from './imp-34585-eflow-attr-log-corrected-fit.js';
import {
  IMP34604_FAR_LOGCORR_P,
  IMP34604_FAR_LOGCORR_Q,
} from './imp-34604-eflow-attr-far-side-log-corrected-cross-fit.js';
import {
  IMP34612_LOG_CURVATURE_NODES,
  IMP34612_OBS_CURVATURE_PRECISION_FLOOR,
} from './imp-34612-eflow-attr-convexity-vs-analytic-log3-curvature.js';

const KSTAR = 21.28095; // imp-34023/imp-34237/imp-34310, verbatim
const LN10 = Math.LN10;
const FLOOR = IMP34612_OBS_CURVATURE_PRECISION_FLOOR; // ~8e-6, imp-34612 double-precision curvature floor

// D2 log-corrected determination: local per-k slope and curvature from eflow_attr = A*N^p*(ln N)^q.
//   ln eflow_attr = const + p*u + q*ln u, u = ln N = (k+1)*ln10 at the decade top N = 10^(k+1).
//   slope  m(k)  = d/dk = ln10*(p + q/u)          (k-varying local slope)
//   curv   m'(k) = d2/dk2 = -q*ln10^2/u^2          (nonzero, set by the fitted q)
function logCorrectedSlope(p, q, u) {
  return LN10 * (p + q / u);
}
function logCorrectedCurvature(q, u) {
  return (-q * LN10 * LN10) / (u * u);
}

// --- the reconciled table: all three determinations at each matched imp-34612 node --------------
export const IMP34632_RECONCILE_NODES = Object.freeze(
  IMP34612_LOG_CURVATURE_NODES.map((node) => {
    const k = node.k;
    const u = (k + 1) * LN10; // decade top N = 10^(k+1)
    // D1 -- pure power law: constant slope, zero curvature by construction.
    const slopeD1 = IMP34570_FIT_PER_K_SLOPE; // -2.158629 (constant)
    const slopeD1analytic = IMP34570_EFLOW_ANALYTIC_SLOPE_PER_K; // -2.161846 (D3 slope reference)
    const curvD1 = 0; // a single power law has EXACTLY zero log-curvature
    // D2 -- log-corrected fit (near = imp-34585, far = imp-34604).
    const slopeD2near = logCorrectedSlope(IMP34585_LOGCORR_P, IMP34585_LOGCORR_Q, u);
    const slopeD2far = logCorrectedSlope(IMP34604_FAR_LOGCORR_P, IMP34604_FAR_LOGCORR_Q, u);
    const curvD2near = logCorrectedCurvature(IMP34585_LOGCORR_Q, u);
    const curvD2far = logCorrectedCurvature(IMP34604_FAR_LOGCORR_Q, u);
    // D3 -- imp-34612 curvature: observed (direct) and analytic (pure q=3 surrogate), verbatim.
    const curvD3observed = node.observed;
    const curvD3analytic = node.analyticTotal;
    // Pairwise curvature residuals in units of the double-precision floor F ~ 8e-6.
    const resD2nearVsObs = Math.abs(curvD2near - curvD3observed) / FLOOR; // ~1.5x floor -> consistent
    const resD1VsObs = Math.abs(curvD1 - curvD3observed) / FLOOR; // ~800x floor -> D1 outlier
    const resAnalyticVsObs = Math.abs(curvD3analytic - curvD3observed) / FLOOR; // ~52x floor -> C_F residual
    return {
      k,
      // leading per-k log-slope, three ways (F1)
      slopeD1_powerLaw: +slopeD1.toFixed(6), // -2.158629 (constant, window-averaged)
      slopeD1_analytic: +slopeD1analytic.toFixed(6), // -2.161846 (surrogate slope reference)
      slopeD2_near: +slopeD2near.toFixed(6), // -2.1620 -> -2.1632 (local log-corrected)
      slopeD2_far: +slopeD2far.toFixed(6), // near-identical far-side cross-fit
      // log-curvature d2(ln eflow_attr)/dk2, the discriminating footing (F2/F3)
      curvD1_powerLaw: curvD1, // 0 exactly (no log term)
      curvD2_near: +curvD2near.toExponential(6), // -q*ln10^2/u^2, q=3.348
      curvD2_far: +curvD2far.toExponential(6), // q=3.346
      curvD3_observed: curvD3observed, // imp-34612 direct second difference (verbatim)
      curvD3_analytic: curvD3analytic, // imp-34612 pure-q=3 surrogate (verbatim)
      // pairwise residuals in floor units
      resD2nearVsObs_floors: +resD2nearVsObs.toFixed(2), // ~1.1 .. 2.1
      resD1VsObs_floors: +resD1VsObs.toFixed(0), // ~793 .. 807
      resAnalyticVsObs_floors: +resAnalyticVsObs.toFixed(1), // ~51 .. 53
    };
  }),
);

// --- (F1) leading slope agrees across all three to ~0.15% (no slope outlier) --------------------
export const IMP34632_MAX_SLOPE_SPREAD_PER_K = +Math.max(
  ...IMP34632_RECONCILE_NODES.map((n) =>
    Math.max(
      Math.abs(n.slopeD1_powerLaw - n.slopeD2_near),
      Math.abs(n.slopeD1_powerLaw - n.slopeD1_analytic),
      Math.abs(n.slopeD2_near - n.slopeD1_analytic),
    ),
  ),
).toExponential(4); // ~4.6e-3 per k (worst = D1 pure fit vs D2 local)
export const IMP34632_MAX_SLOPE_SPREAD_PCT = +(
  (Math.abs(IMP34632_MAX_SLOPE_SPREAD_PER_K) / Math.abs(IMP34570_FIT_PER_K_SLOPE)) *
  100
).toFixed(3); // ~0.21%
export const IMP34632_ALL_SLOPES_WITHIN_HALF_PCT = IMP34632_RECONCILE_NODES.every(
  (n) =>
    Math.abs(n.slopeD1_powerLaw / n.slopeD2_near - 1) < 5e-3 &&
    Math.abs(n.slopeD2_near / n.slopeD1_analytic - 1) < 5e-3,
); // true -- all three leading slopes agree to well under 0.5%

// --- (F2) D2 (free q) vs D3 (observed) consistent to the double-precision floor -----------------
export const IMP34632_MEAN_D2_VS_OBS_FLOORS = +(
  IMP34632_RECONCILE_NODES.reduce((s, n) => s + n.resD2nearVsObs_floors, 0) /
  IMP34632_RECONCILE_NODES.length
).toFixed(2); // ~1.47x floor
export const IMP34632_D2_CONSISTENT_TO_FLOOR = IMP34632_RECONCILE_NODES.every(
  (n) => n.resD2nearVsObs_floors < 3,
); // true -- fitted-q curvature and directly-observed curvature agree within ~1-2x the floor

// --- (F3) D1 pure power law is the ~800x-floor outlier; pure-q=3 surrogate the ~52x residual -----
export const IMP34632_MEAN_D1_VS_OBS_FLOORS = +(
  IMP34632_RECONCILE_NODES.reduce((s, n) => s + n.resD1VsObs_floors, 0) /
  IMP34632_RECONCILE_NODES.length
).toFixed(0); // ~800x floor -> D1 is a structural curvature outlier
export const IMP34632_MEAN_ANALYTIC_VS_OBS_FLOORS = +(
  IMP34632_RECONCILE_NODES.reduce((s, n) => s + n.resAnalyticVsObs_floors, 0) /
  IMP34632_RECONCILE_NODES.length
).toFixed(1); // ~52x floor -> the C_F/Gronwall residual imp-34612 flagged
// The imp-34612 q-excess the D2 log-corrected fit absorbs (fitted q vs analytic 3).
export const IMP34632_D2_Q_EXCESS = +(IMP34585_LOGCORR_Q - 3).toFixed(6); // +0.348339
export const IMP34632_OUTLIER_ORDERING =
  IMP34632_MEAN_D1_VS_OBS_FLOORS > IMP34632_MEAN_ANALYTIC_VS_OBS_FLOORS &&
  IMP34632_MEAN_ANALYTIC_VS_OBS_FLOORS > IMP34632_MEAN_D2_VS_OBS_FLOORS; // true: D1 >> analytic >> D2

export const IMP34632_EFLOW_ATTR_LOG_SLOPE_THREE_WAY_RECONCILIATION = {
  ticket: 'imp-34632',
  proofSection: 'S-frontier',
  kStar: KSTAR,
  question:
    'The eflow_attr leading log-slope has been determined three independent ways -- imp-34570 ' +
    'pure power-law fit (constant -2.1586 per k), imp-34585/imp-34604 log-corrected fit (local ' +
    'ln10*(p + q/u)), and the imp-34612 curvature determination (observed + pure-q=3 surrogate) -- ' +
    'never cross-tabulated on one footing. Place all three at matched nodes with pairwise ' +
    'residuals in units of the double-precision curvature floor and assess mutual consistency: ' +
    'which determinations agree to the floor, which is an outlier, and what modelling choice ' +
    'drives each discrepancy? Cross-tabulation only; NO QED.',
  model: {
    slope: 'leading per-k log-slope m(k) = d(ln eflow_attr)/dk (per k = per log10 N)',
    curvature: 'log-curvature m2(k) = d2(ln eflow_attr)/dk2, the discriminating footing',
    D1: 'imp-34570 pure power law A*N^p: constant slope p*ln10 = -2.158629, curvature EXACTLY 0',
    D2: 'imp-34585/imp-34604 log-corrected A*N^p*(ln N)^q: slope ln10*(p+q/u), curvature -q*ln10^2/u^2',
    D3: 'imp-34612 curvature: directly-observed d2(ln eflow_attr)/dk2 + analytic pure-q=3 surrogate',
    floor: 'F = imp-34612 double-precision curvature floor ~8e-6 (9-sig-fig rungs x 4/h^2)',
    node: 'u = (k+1)*ln10 at the decade top N = 10^(k+1); matched nodes k = 21.75 .. 21.95',
  },
  reconcileNodes: IMP34632_RECONCILE_NODES,
  maxSlopeSpreadPerK: IMP34632_MAX_SLOPE_SPREAD_PER_K,
  maxSlopeSpreadPct: IMP34632_MAX_SLOPE_SPREAD_PCT,
  allSlopesWithinHalfPct: IMP34632_ALL_SLOPES_WITHIN_HALF_PCT,
  meanD2VsObsFloors: IMP34632_MEAN_D2_VS_OBS_FLOORS,
  d2ConsistentToFloor: IMP34632_D2_CONSISTENT_TO_FLOOR,
  meanD1VsObsFloors: IMP34632_MEAN_D1_VS_OBS_FLOORS,
  meanAnalyticVsObsFloors: IMP34632_MEAN_ANALYTIC_VS_OBS_FLOORS,
  d2QExcess: IMP34632_D2_Q_EXCESS,
  outlierOrdering: IMP34632_OUTLIER_ORDERING,
  finding: {
    F1_leading_slope_agrees_to_015pct:
      'At the matched nodes the D2 log-corrected LOCAL slope is -2.1620 -> -2.1632 per k, on the ' +
      'imp-34570 analytic surrogate slope -2.161846 (D3 reference) to ~0.01-0.06%; the D1 pure ' +
      'power-law fit -2.158629 is ~0.15% less negative (a window-averaged single slope). Max ' +
      'spread ~4.6e-3 per k (~0.21%): NO determination is a slope outlier.',
    F2_free_q_and_observed_consistent_to_floor:
      'On the discriminating curvature footing, the D2 log-corrected curvature -q*ln10^2/u^2 ' +
      '(near q=3.348) -6.469e-3 -> -6.357e-3 and the D3 imp-34612 directly-observed curvature ' +
      '-6.460e-3 -> -6.345e-3 differ by 1.1x .. 2.1x the floor F ~ 8e-6 (mean ~1.5x) -- the ' +
      'free-q fit and the direct second-difference agree essentially AT the double-precision ' +
      'floor. The far-side imp-34604 fit (q=3.346) reproduces it.',
    F3_two_constrained_shapes_are_the_outliers:
      'The D1 pure power law forces curvature 0, so its residual vs the observed -6.4e-3 is ~800x ' +
      'the floor -- a structural outlier driven purely by the NO-log-term choice. The D3 analytic ' +
      'pure-q=3 surrogate sits ~52x floor (-4.2e-4, the imp-34612 ~7% residual) from observed -- ' +
      'exactly the q-excess (fitted q~3.348 vs analytic 3, +0.348) the D2 log-corrected fit ' +
      'absorbs, the C_F(T0)/Gronwall correction the pure surrogate drops. Ordering D1 >> ' +
      'analytic >> D2 in floor units identifies each modelling driver.',
  },
  isRigorous: false,
  honest:
    'MEASUREMENT / CROSS-TABULATION ONLY -- a side-by-side evaluation of three previously separate ' +
    'determinations of the leading log-slope of the inherited surrogate quantity eflow_attr ' +
    '(imp-34570 pure power law, imp-34585/imp-34604 log-corrected, imp-34612 curvature), reusing ' +
    'all four exports verbatim at the matched k = 21.75 .. 21.95 nodes. The three agree at the ' +
    'leading slope to ~0.15%; on the curvature footing the two free-shape determinations ' +
    '(log-corrected fitted q~3.348 and the directly-observed second difference) agree to ~1.5x ' +
    'the double-precision floor, while the pure power law (curvature forced to 0, ~800x floor) and ' +
    'the pure-q=3 surrogate (~52x floor, the C_F/Gronwall residual) are the two constrained-shape ' +
    'outliers, each offset pinned to its dropped term. Descriptive surrogate, NOT a rigorous ' +
    'asymptotic; the component model is the inherited imp-3220/imp-3406 extrapolation; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED; no refereed bound is changed' +
    '.',
};

export const IMP34632_ASSERTIONS = [
  {
    // Reuse gate: the curvature footing consumes the imp-34612 observed/analytic nodes verbatim.
    id: 'imp-34632-reuses-imp34612-curvature-nodes',
    description: 'D3 observed/analytic curvature reuse imp-34612 nodes verbatim (5 nodes, both negative)',
    holds: () =>
      IMP34632_RECONCILE_NODES.length === 5 &&
      IMP34632_RECONCILE_NODES.every(
        (n, i) =>
          n.curvD3_observed === IMP34612_LOG_CURVATURE_NODES[i].observed &&
          n.curvD3_analytic === IMP34612_LOG_CURVATURE_NODES[i].analyticTotal &&
          n.curvD3_observed < 0 &&
          n.curvD3_analytic < 0,
      ),
  },
  {
    // (F1) all three leading slopes agree to well under 0.5% (no slope outlier).
    id: 'imp-34632-leading-slope-agrees',
    description: 'D1 pure fit, D2 local, and D1 analytic slopes all within ~0.21% at every node',
    holds: () =>
      IMP34632_ALL_SLOPES_WITHIN_HALF_PCT === true &&
      IMP34632_MAX_SLOPE_SPREAD_PCT < 0.5 &&
      IMP34632_RECONCILE_NODES.every(
        (n) =>
          Math.abs(n.slopeD1_powerLaw + 2.158629) < 1e-4 &&
          n.slopeD2_near < -2.1615 &&
          n.slopeD2_near > -2.1640 &&
          Math.abs(n.slopeD2_far - n.slopeD2_near) < 5e-5,
      ),
  },
  {
    // (F2) D2 free-q curvature and D3 observed curvature agree to ~1-2x the double-precision floor.
    id: 'imp-34632-free-q-consistent-to-floor',
    description: 'D2 log-corrected curvature vs imp-34612 observed curvature within ~1-2x the ~8e-6 floor at all nodes',
    holds: () =>
      IMP34632_D2_CONSISTENT_TO_FLOOR === true &&
      Math.abs(IMP34632_MEAN_D2_VS_OBS_FLOORS - 1.47) < 0.5 &&
      IMP34632_RECONCILE_NODES.every(
        (n) => n.resD2nearVsObs_floors > 0.8 && n.resD2nearVsObs_floors < 2.5 && n.curvD2_near < 0,
      ),
  },
  {
    // (F3) D1 pure power law (~800x) and pure-q=3 surrogate (~52x) are the two curvature outliers.
    id: 'imp-34632-constrained-shapes-are-outliers',
    description: 'ordering D1 (~800x) >> analytic (~52x) >> D2 (~1.5x) in floor units; q-excess ~+0.348',
    holds: () =>
      IMP34632_OUTLIER_ORDERING === true &&
      IMP34632_MEAN_D1_VS_OBS_FLOORS > 700 &&
      IMP34632_MEAN_D1_VS_OBS_FLOORS < 850 &&
      Math.abs(IMP34632_MEAN_ANALYTIC_VS_OBS_FLOORS - 52) < 3 &&
      Math.abs(IMP34632_D2_Q_EXCESS - 0.348339) < 1e-5 &&
      IMP34632_RECONCILE_NODES.every((n) => n.curvD1_powerLaw === 0),
  },
  {
    // Honesty gate: cross-tabulation only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp-34632-honesty-gate-no-qed',
    description: 'Cross-tabulation only: isRigorous false, no QED, no refereed bound is changed, imp-3066 K_a >= 0 untouched',
    holds: () =>
      IMP34632_EFLOW_ATTR_LOG_SLOPE_THREE_WAY_RECONCILIATION.isRigorous === false &&
      /NO QED/.test(IMP34632_EFLOW_ATTR_LOG_SLOPE_THREE_WAY_RECONCILIATION.honest) &&
      /refereed bound is changed/i.test(IMP34632_EFLOW_ATTR_LOG_SLOPE_THREE_WAY_RECONCILIATION.honest) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34632_EFLOW_ATTR_LOG_SLOPE_THREE_WAY_RECONCILIATION.honest),
  },
];

for (const a of IMP34632_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34632-eflow-attr-log-slope-three-way-reconciliation assertion failed: ${a.id}`);
  }
}
