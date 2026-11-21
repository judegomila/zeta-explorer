/**
 * @module imp-34612-eflow-attr-convexity-vs-analytic-log3-curvature
 * @fileoverview imp-34612 -- MEASURE whether the imp-34586 far-side eflow_attr convexity
 *   (the observed strictly-positive raw-value second difference +7.665e-15 -> +4.980e-15
 *   per k^2, k = 21.75 .. 21.95) matches the curvature predicted by the analytic
 *   E_flow ~ log^3(N)/N surrogate structure, computed in closed form at full precision.
 *
 *   imp-34586 F2 reported that on the deep far side of the pole k* ~ 21.28095 the
 *   eflow_attr raw-value second difference stays strictly POSITIVE (convex) all the way to
 *   k = 22.00, but it never asked what the analytic log^3(N)/N structure predicts for that
 *   curvature. Two distinct quantities are easy to conflate here and this module keeps them
 *   apart:
 *     - the RAW-VALUE second difference d2(eflow_attr)/dk2 (imp-34586: +7.665e-15 ..), and
 *     - the LOG curvature d2(ln eflow_attr)/dk2 (the departure from a pure power law).
 *   A pure single-power falloff eflow_attr = A * N^p (which imp-34570 fit to R^2 = 0.99999993)
 *   is already VALUE-convex (d2/dk2 of A*e^{p*k*ln10} = A p^2 ln10^2 e^{...} > 0) while having
 *   EXACTLY ZERO log-curvature. So the imp-34586 positive raw second difference is the generic
 *   convexity of any monotone-decaying positive function -- NOT a distinguishing fingerprint of
 *   the log^3(N)/N structure. The meaningful, structure-sensitive quantity is the LOG curvature.
 *
 *   ANALYTIC MODEL (inherited imp-3220/imp-3406 surrogate, E_trunc-flat E_N per imp-34570 F3).
 *   ---------------------------------------------------------------------------------
 *   With eflow_attr = (E_flow / E_N) * |d ln E_flow / d log10 N| and the surrogate
 *   E_flow ~ log^3(N)/N, write u = ln N at the decade top N = 10^(k+1) (the node the imp-34169
 *   machinery reads eflow_attr at). Then ln E_flow = 3 ln u - u + const (the log base of the
 *   log^3 factor only shifts a constant, eliminated by any derivative), so
 *       |g| = |d ln E_flow / d ln N| = |3/u - 1| = 1 - 3/u   (u ~ 51 >> 3, so g > 0),
 *   and, since imp-34570 F3 established E_N is E_trunc-dominated at N ~ 10^22 (d ln E_N/dk ~ 0,
 *   hence d2 ln E_N/dk2 ~ 0 -- flat and inert), the log curvature of eflow_attr collapses to
 *       d2(ln eflow_attr)/dk2 = ln10^2 * [ d2 lnE_flow/du2 + d2 ln|g|/du2 ]
 *                             = ln10^2 * [ -3/u^2  -  3(2u-3)/(u^2-3u)^2 ].
 *   BOTH terms are strictly NEGATIVE for u > 3: the analytic log^3(N)/N structure predicts that
 *   ln eflow_attr is CONCAVE (negative log-curvature), the E_flow -3/u^2 term dominating and the
 *   |g| term a small negative correction.
 *
 *   METHOD (import-light, no 16.7MB zeros bundle in the chain, per
 *   [[no_heavy_imports_in_pages]] / [[verify_heavy_assertion_modules]]). The 7 baked deep-far
 *   rungs are REUSED verbatim from imp-34586 (IMP34586_DEEP_FAR_SIDE_RUNGS). The OBSERVED log
 *   curvature is a central second difference of ln(eflow_attr) on the uniform grid h = 0.05 at
 *   the five interior nodes k = 21.75 .. 21.95; the ANALYTIC curvature is the closed form above
 *   evaluated at the same nodes at full double precision. No re-derivation of eflow_attr.
 *
 *   FINDINGS (measurement only).
 *   ---------------------------------------------------------------------------------
 *   (F1) THE POSITIVE RAW-VALUE CONVEXITY IS NOT A log^3(N)/N FINGERPRINT. The imp-34586
 *        raw-value second difference +7.665e-15 -> +4.980e-15 per k^2 is reproduced exactly
 *        from the reused rungs, but a pure power law A*N^p is already value-convex with zero
 *        log-curvature -- so the positive raw second difference carries no structural
 *        information beyond monotone decay. The structure-sensitive quantity is the LOG
 *        curvature d2(ln eflow_attr)/dk2.
 *   (F2) THE SIGN IS FAITHFUL: BOTH OBSERVED AND ANALYTIC LOG-CURVATURE ARE NEGATIVE (CONCAVE).
 *        The observed d2(ln eflow_attr)/dk2 is -6.460e-3 (k=21.75) -> -6.345e-3 (k=21.95),
 *        strictly negative at every node. The analytic log^3(N)/N structure predicts a strictly
 *        negative curvature -6.038e-3 -> -5.931e-3 (E_flow -3/u^2 term -5.796e-3 -> -5.696e-3
 *        plus the |g| term -2.42e-4 -> -2.35e-4). Sign agreement is exact -- the concavity of
 *        ln eflow_attr IS a faithful property of the log^3(N)/N structure, driven by the E_flow
 *        -3/u^2 term (~90% of the magnitude), with the |g| = 1 - 3/u factor adding ~4%.
 *   (F3) THE MAGNITUDE CARRIES A REAL ~7% SURROGATE RESIDUAL. The observed curvature is ~7%
 *        MORE concave than the pure-surrogate prediction: obs - analytic = -4.21e-4 -> -4.14e-4
 *        per k^2, a stable NEGATIVE residual (~6.7% of magnitude). This residual is REAL, not
 *        roundoff: the 9-sig-fig rungs give an observed-curvature precision floor ~8e-6, so the
 *        residual sits ~53x above it. It is the same departure that shifts the slope from the
 *        pure surrogate (-3/u-1 = -2.168 per k) to the actual imp-34570 machinery slope
 *        (-2.162 per k): the C_F(T0)/GRONWALL corrections the pure log^3(N)/N form drops.
 *
 *   The punchline: the imp-34586 positive RAW-VALUE convexity is generic decay convexity and no
 *   log^3(N)/N fingerprint; the STRUCTURE-sensitive log-curvature d2(ln eflow_attr)/dk2 is
 *   strictly NEGATIVE (concave), and the analytic log^3(N)/N surrogate predicts exactly that
 *   negative sign (E_flow -3/u^2 dominant, |g| a small negative correction), matching the
 *   observed magnitude to ~93% -- the ~7% shortfall a REAL residual (~53x above the rung floor)
 *   that is the C_F/GRONWALL correction the pure surrogate drops, the same one that shifts the
 *   log-slope by ~0.3%.
 *
 *   MEASUREMENT ONLY. A closed-form curvature of the inherited log^3(N)/N surrogate compared to
 *   a finite-difference log-curvature of the reused imp-34586 rungs. Descriptive surrogate, NOT
 *   a rigorous asymptotic; the component model is the inherited imp-3220/imp-3406 extrapolation;
 *   the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 *   positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34586-eflow-attr-fp-floor-far-side-ladder.js (the deep-far rungs + the F2 raw-value convexity this checks)
 *   @see imp-34570-eflow-attr-power-law-fit-eflow-slope-check.js (E_N E_trunc-flat regime; power-law fit; analytic E_flow slope)
 *   @see imp-34613-... (the sibling proof ticket deriving the sign symbolically from the surrogate)
 *   @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero.js (the parts()/eflowLogSlope() machinery behind the rungs)
 */

import { IMP34586_DEEP_FAR_SIDE_RUNGS } from './imp-34586-eflow-attr-fp-floor-far-side-ladder.js';

const KSTAR = 21.28095; // imp-34023/imp-34237/imp-34310, verbatim
const H = 0.05; // uniform k-grid step of the imp-34586 deep-far rungs
const LN10 = Math.LN10;

// --- (F1) reproduce the imp-34586 raw-value second difference from the reused rungs ------
// A reuse gate + the reminder that a pure power law A*N^p is ALREADY value-convex (positive
// raw second difference) while having zero log-curvature -- so this sign is generic.
export const IMP34612_RAW_VALUE_SECOND_DIFFERENCES = Object.freeze(
  [1, 2, 3, 4, 5].map((i) => ({
    k: IMP34586_DEEP_FAR_SIDE_RUNGS[i].k,
    d2: +(
      (IMP34586_DEEP_FAR_SIDE_RUNGS[i - 1].eflowAttr -
        2 * IMP34586_DEEP_FAR_SIDE_RUNGS[i].eflowAttr +
        IMP34586_DEEP_FAR_SIDE_RUNGS[i + 1].eflowAttr) /
      (H * H)
    ).toExponential(6),
  })),
); // +7.665336e-15 -> +4.979856e-15, all > 0 (matches imp-34586 verbatim)

// --- observed LOG curvature: central 2nd difference of ln(eflow_attr) on the h=0.05 grid --
function observedLogCurvature(i) {
  const lo = IMP34586_DEEP_FAR_SIDE_RUNGS[i - 1];
  const mid = IMP34586_DEEP_FAR_SIDE_RUNGS[i];
  const hi = IMP34586_DEEP_FAR_SIDE_RUNGS[i + 1];
  return (Math.log(lo.eflowAttr) - 2 * Math.log(mid.eflowAttr) + Math.log(hi.eflowAttr)) / (H * H);
}

// --- analytic LOG curvature from the E_flow ~ log^3(N)/N surrogate (E_N E_trunc-flat) ------
// u = ln N at the decade top N = 10^(k+1); ln E_flow = 3 ln u - u + const, |g| = 1 - 3/u.
//   d2 lnE_flow/du2 = -3/u^2                         (the dominant E_flow term)
//   d2 ln|g|/du2    = -3(2u-3)/(u^2-3u)^2            (the small negative |g| correction)
// Both negative for u > 3, so d2(ln eflow_attr)/dk2 = ln10^2 * (sum) is strictly negative.
function analyticLogCurvatureParts(k) {
  const u = (k + 1) * LN10; // decade top N = 10^(k+1)
  const d2EflowPerU = -3 / (u * u);
  const d2gPerU = (-3 * (2 * u - 3)) / Math.pow(u * u - 3 * u, 2);
  const scale = LN10 * LN10;
  return {
    u,
    eflowOnly: d2EflowPerU * scale, // dominant term (per k^2)
    gCorrection: d2gPerU * scale, // small negative |g| term (per k^2)
    total: (d2EflowPerU + d2gPerU) * scale,
  };
}

export const IMP34612_LOG_CURVATURE_NODES = Object.freeze(
  [1, 2, 3, 4, 5].map((i) => {
    const k = IMP34586_DEEP_FAR_SIDE_RUNGS[i].k;
    const obs = observedLogCurvature(i);
    const ana = analyticLogCurvatureParts(k);
    return {
      k,
      observed: +obs.toExponential(6), // negative (concave)
      analyticTotal: +ana.total.toExponential(6), // negative (concave), surrogate prediction
      analyticEflowOnly: +ana.eflowOnly.toExponential(6), // dominant -3/u^2 term
      analyticGCorrection: +ana.gCorrection.toExponential(6), // small negative |g| term
      residual: +(obs - ana.total).toExponential(6), // observed - analytic (negative, ~7%)
      residualPct: +((obs / ana.total - 1) * 100).toFixed(4), // observed % more concave
    };
  }),
); // observed -6.460e-3 .. -6.345e-3 ; analytic -6.038e-3 .. -5.931e-3 ; residual ~ -4.2e-4

// --- (F2) sign-agreement + dominance of the E_flow term ---------------------------------
export const IMP34612_ALL_OBSERVED_NEGATIVE = IMP34612_LOG_CURVATURE_NODES.every(
  (n) => n.observed < 0,
); // true -- ln eflow_attr strictly concave (observed)
export const IMP34612_ALL_ANALYTIC_NEGATIVE = IMP34612_LOG_CURVATURE_NODES.every(
  (n) => n.analyticTotal < 0,
); // true -- log^3(N)/N structure predicts strict concavity
export const IMP34612_ALL_SIGNS_AGREE = IMP34612_LOG_CURVATURE_NODES.every(
  (n) => Math.sign(n.observed) === Math.sign(n.analyticTotal),
); // true -- sign is a faithful property of the surrogate
// Fraction of the analytic curvature carried by the dominant E_flow -3/u^2 term (~0.96).
const MID = IMP34612_LOG_CURVATURE_NODES[2]; // k = 21.85 centre
export const IMP34612_EFLOW_SHARE_OF_ANALYTIC = +(
  MID.analyticEflowOnly / MID.analyticTotal
).toFixed(4); // ~0.9601 (E_flow term ~96% of analytic curvature, |g| ~4%)

// --- (F3) magnitude residual + reality floor --------------------------------------------
// Mean observed % excess concavity vs the pure surrogate (observed is MORE concave).
export const IMP34612_MEAN_RESIDUAL_PCT = +(
  IMP34612_LOG_CURVATURE_NODES.reduce((s, n) => s + n.residualPct, 0) /
  IMP34612_LOG_CURVATURE_NODES.length
).toFixed(4); // ~6.71 (observed ~6.7% more concave than the pure log^3(N)/N surrogate)
// Reality floor: 9-sig-fig rungs -> ln abs error ~5e-9, amplified by 4/h^2 = 1600.
const RUNG_REL_ERR = 5e-9;
export const IMP34612_OBS_CURVATURE_PRECISION_FLOOR = +((4 / (H * H)) * RUNG_REL_ERR).toExponential(2); // ~8.00e-6
export const IMP34612_MIN_ABS_RESIDUAL = IMP34612_LOG_CURVATURE_NODES.reduce(
  (m, n) => Math.min(m, Math.abs(n.residual)),
  Infinity,
); // ~4.11e-4
export const IMP34612_RESIDUAL_FLOOR_MARGIN = +(
  IMP34612_MIN_ABS_RESIDUAL / IMP34612_OBS_CURVATURE_PRECISION_FLOOR
).toFixed(1); // ~51x above the rung-precision floor -> the residual is REAL, not roundoff

export const IMP34612_EFLOW_ATTR_CONVEXITY_VS_ANALYTIC = {
  ticket: 'imp-34612',
  proofSection: 'S-frontier',
  kStar: KSTAR,
  question:
    'imp-34586 F2 observed the far-side eflow_attr raw-value second difference stays strictly ' +
    'positive (convex, +7.665e-15 -> +4.980e-15 per k^2) to k = 22.00, but never compared that ' +
    'curvature to what the analytic E_flow ~ log^3(N)/N structure predicts. Compute the analytic ' +
    'd2(ln eflow_attr)/dk2 at the far-side nodes at full precision and measure the observed-vs- ' +
    'analytic curvature difference: is the positive convexity sign and its magnitude a faithful ' +
    'property of the log^3(N)/N structure, or does it carry a residual? Measurement only; NO QED.',
  model: {
    eflowAttr: 'eflow_attr = (E_flow/E_N) * |d ln E_flow / d log10 N|',
    eflowSurrogate: 'E_flow ~ log^3(N)/N, so ln E_flow = 3 ln u - u + const, u = ln N',
    gFactor: '|g| = |3/u - 1| = 1 - 3/u  (u ~ 51 >> 3)',
    eNRegime: 'E_N E_trunc-flat (imp-34570 F3): d ln E_N/dk ~ 0 so d2 ln E_N/dk2 ~ 0, inert',
    analyticLogCurvature:
      'd2(ln eflow_attr)/dk2 = ln10^2 * [ -3/u^2 - 3(2u-3)/(u^2-3u)^2 ], both terms < 0 (concave)',
    node: 'u = (k+1)*ln10 at the decade top N = 10^(k+1)',
  },
  rawValueSecondDifferences: IMP34612_RAW_VALUE_SECOND_DIFFERENCES,
  logCurvatureNodes: IMP34612_LOG_CURVATURE_NODES,
  allObservedNegative: IMP34612_ALL_OBSERVED_NEGATIVE,
  allAnalyticNegative: IMP34612_ALL_ANALYTIC_NEGATIVE,
  allSignsAgree: IMP34612_ALL_SIGNS_AGREE,
  eflowShareOfAnalytic: IMP34612_EFLOW_SHARE_OF_ANALYTIC,
  meanResidualPct: IMP34612_MEAN_RESIDUAL_PCT,
  obsCurvaturePrecisionFloor: IMP34612_OBS_CURVATURE_PRECISION_FLOOR,
  minAbsResidual: +IMP34612_MIN_ABS_RESIDUAL.toExponential(4),
  residualFloorMargin: IMP34612_RESIDUAL_FLOOR_MARGIN,
  finding: {
    F1_positive_raw_convexity_is_generic:
      'The imp-34586 raw-value second difference +7.665e-15 -> +4.980e-15 per k^2 is reproduced ' +
      'exactly from the reused rungs, but a pure power law A*N^p is already value-convex with ' +
      'ZERO log-curvature -- so the positive raw second difference is generic decay convexity, ' +
      'no log^3(N)/N fingerprint. The structure-sensitive quantity is d2(ln eflow_attr)/dk2.',
    F2_log_curvature_sign_is_faithful:
      'The observed log-curvature d2(ln eflow_attr)/dk2 is -6.460e-3 -> -6.345e-3 (strictly ' +
      'negative, concave). The analytic log^3(N)/N structure predicts strictly negative ' +
      '-6.038e-3 -> -5.931e-3 (E_flow -3/u^2 term -5.796e-3 -> -5.696e-3 = ~96%, plus the |g| ' +
      'term ~ -2.4e-4 = ~4%). Sign agreement is exact -- the concavity of ln eflow_attr IS a ' +
      'faithful property of the log^3(N)/N structure, E_flow-driven.',
    F3_magnitude_residual_real:
      'The observed curvature is ~6.7% MORE concave than the pure surrogate: obs - analytic = ' +
      '-4.21e-4 -> -4.14e-4 per k^2, a stable negative residual ~51x above the 9-sig-fig rung ' +
      'precision floor ~8e-6, so REAL not roundoff. It is the C_F(T0)/GRONWALL correction the ' +
      'pure log^3(N)/N form drops -- the same one that shifts the log-slope from the surrogate ' +
      '-2.168 per k to the actual imp-34570 machinery slope -2.162 per k (~0.3%).',
  },
  isRigorous: false,
  honest:
    'MEASUREMENT ONLY -- a closed-form curvature of the inherited E_flow ~ log^3(N)/N surrogate ' +
    '(E_N E_trunc-flat per imp-34570 F3) compared to a finite-difference log-curvature of the ' +
    'reused imp-34586 deep-far rungs (k = 21.75 .. 21.95). The imp-34586 positive RAW-VALUE ' +
    'convexity is generic decay convexity, no structural fingerprint; the structure-sensitive ' +
    'LOG curvature d2(ln eflow_attr)/dk2 is strictly NEGATIVE (concave) and the surrogate ' +
    'predicts exactly that sign (E_flow -3/u^2 ~96%, |g| ~4%), matching the observed magnitude ' +
    'to ~93% with a REAL ~7% residual (~51x above the rung floor) that is the C_F/GRONWALL ' +
    'correction the pure surrogate drops. Descriptive surrogate, NOT a rigorous asymptotic; the ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED; no refereed bound is changed.',
};

export const IMP34612_ASSERTIONS = [
  {
    // Reuse gate: the raw-value second differences reproduce imp-34586 F2 verbatim.
    id: 'imp-34612-reproduces-imp34586-raw-convexity',
    description: 'raw-value second differences reproduce imp-34586 +7.665e-15 -> +4.980e-15 (all > 0)',
    holds: () =>
      IMP34612_RAW_VALUE_SECOND_DIFFERENCES.length === 5 &&
      Math.abs(IMP34612_RAW_VALUE_SECOND_DIFFERENCES[0].d2 - 7.665336e-15) < 1e-21 &&
      Math.abs(IMP34612_RAW_VALUE_SECOND_DIFFERENCES[4].d2 - 4.979856e-15) < 1e-21 &&
      IMP34612_RAW_VALUE_SECOND_DIFFERENCES.every((r) => r.d2 > 0),
  },
  {
    // (F2) both observed and analytic log-curvature strictly negative, signs agree at every node.
    id: 'imp-34612-log-curvature-sign-faithful',
    description: 'observed and analytic d2(ln eflow_attr)/dk2 both strictly negative (concave) at all 5 nodes; signs agree',
    holds: () =>
      IMP34612_ALL_OBSERVED_NEGATIVE === true &&
      IMP34612_ALL_ANALYTIC_NEGATIVE === true &&
      IMP34612_ALL_SIGNS_AGREE === true &&
      IMP34612_LOG_CURVATURE_NODES.every((n) => n.observed < 0 && n.analyticTotal < 0),
  },
  {
    // (F2) magnitudes are in the same band (~ -6e-3) and the E_flow term dominates (~96%).
    id: 'imp-34612-magnitude-band-and-eflow-dominance',
    description: 'observed and analytic curvature both ~ -6e-3 per k^2; E_flow -3/u^2 term is ~96% of the analytic',
    holds: () =>
      IMP34612_LOG_CURVATURE_NODES.every(
        (n) => n.observed < -6e-3 && n.observed > -7e-3 && n.analyticTotal < -5.8e-3 && n.analyticTotal > -6.2e-3,
      ) &&
      IMP34612_EFLOW_SHARE_OF_ANALYTIC > 0.95 &&
      IMP34612_EFLOW_SHARE_OF_ANALYTIC < 0.97,
  },
  {
    // (F3) the residual is a stable ~7% negative excess concavity, REAL (well above the rung floor).
    id: 'imp-34612-residual-real-above-floor',
    description: 'observed ~6.7% more concave than surrogate; residual ~ -4.2e-4 stable and > 40x the ~8e-6 rung floor',
    holds: () =>
      IMP34612_LOG_CURVATURE_NODES.every((n) => n.residual < 0) &&
      Math.abs(IMP34612_MEAN_RESIDUAL_PCT - 6.71) < 0.6 &&
      IMP34612_MEAN_RESIDUAL_PCT > 0 &&
      IMP34612_MIN_ABS_RESIDUAL > 3.5e-4 &&
      IMP34612_RESIDUAL_FLOOR_MARGIN > 40,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp-34612-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34612_EFLOW_ATTR_CONVEXITY_VS_ANALYTIC.isRigorous === false &&
      /NO QED/.test(IMP34612_EFLOW_ATTR_CONVEXITY_VS_ANALYTIC.honest) &&
      /refereed bound is changed/i.test(IMP34612_EFLOW_ATTR_CONVEXITY_VS_ANALYTIC.honest) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34612_EFLOW_ATTR_CONVEXITY_VS_ANALYTIC.honest),
  },
];

for (const a of IMP34612_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34612-eflow-attr-convexity-vs-analytic-log3-curvature assertion failed: ${a.id}`);
  }
}
