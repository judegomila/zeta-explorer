/**
 * @module imp-34589-eflow-attr-far-side-power-law-slope-continuity
 * @fileoverview imp-34589 -- FIT the imp-34572 far-side eflow_attr ladder (7 rungs,
 *   4.33758e-15 -> 2.26896e-15 across k = 21.30 .. 21.60, all > k* ~ 21.28095) to the SAME
 *   power law eflow_attr = A * N^p, N = 10^(k+1) that imp-34570 fit on the NEAR side, and
 *   MEASURE whether the far-side per-k log-slope p*ln10 matches the near-side -2.159 within
 *   the fit resolution -- i.e. whether eflow_attr's SLOPE (not merely its value) is
 *   continuous through the simple pole k*.
 *
 *   imp-34570 fit the near-side bracket (k = 21.00 .. 21.50) to eflow_attr = A * N^p and
 *   found p*ln10 = -2.158629 per k (reproducing the imp-34406 local slope -2.159 to 0.02%).
 *   imp-34572 then confirmed eflow_attr's VALUE is smooth, positive and monotone on the far
 *   side (k = 21.30 .. 21.60) and that its LOCAL log-slope drifts smoothly from -2.15932
 *   (k=21.35) to -2.16098 (k=21.60), but never fit the far-side ladder to the same power law
 *   to compare its window-averaged slope against the near-side fit. This module supplies that
 *   fit and the near-vs-far slope difference.
 *
 *   METHOD (import-light, verbatim imp-34169/imp-34570 OLS machinery). The 7 far-side rungs
 *   are REUSED from imp-34572 (IMP34572_FAR_SIDE_RUNGS -- no re-derivation, no 16.7MB zeros
 *   bundle in the chain, per [[no_heavy_imports_in_pages]] / [[verify_heavy_assertion_modules]]).
 *   An OLS on (ln N, ln eflow_attr) over the 7 rungs gives the far-side power-law exponent
 *   p_far and amplitude A_far; the far-side per-k slope is p_far*ln10. The near-side per-k
 *   slope is imported verbatim from imp-34570 (IMP34570_FIT_PER_K_SLOPE = -2.158629). Both
 *   fits carry an OLS slope standard error se = sqrt(SSRES/(n-2)) / sqrt(SXX).
 *
 *   FINDINGS (measurement only -- slope continuity through k*).
 *   ---------------------------------------------------------------------------------
 *   (F1) THE FAR SIDE IS THE SAME CLEAN POWER LAW. OLS eflow_attr = A * N^p over the 7 far
 *        rungs gives p_far = -0.938070 per ln N, A_far = 3.5993e+6, R^2 = 0.99999998
 *        (1 - R^2 = 1.77e-8), RMS log-residual 2.88e-5, max 4.16e-5 -- an even tighter single
 *        power law than the near side (imp-34570 RMS 8.42e-5), no curvature term needed.
 *   (F2) THE FAR-SIDE PER-K SLOPE MATCHES THE NEAR SIDE TO 0.06%. The far-side per-k slope
 *        p_far*ln10 = -2.159985 sits -0.001356 (0.063%) from the near-side power-law slope
 *        -2.158629 and -0.000985 from the imp-34406 local slope -2.159. The far-side fit is
 *        slightly STEEPER than the near-side fit -- exactly the direction of the imp-34572
 *        local-slope drift toward the analytic E_flow slope -2.161846 as k grows.
 *   (F3) THE 0.06% DIFFERENCE IS A SMOOTH WINDOW-CENTRE DRIFT, NOT A KINK. The near-side fit
 *        slope carries se = 2.32e-4 per k, the far-side se = 1.29e-4 per k; the -0.001356
 *        difference is ~5.1 combined-sigma -- a RESOLVED but tiny drift. It is fully explained
 *        by the two overlapping windows having different centres (near k~21.25, far k~21.45):
 *        each fit reports a window-averaged local slope, and imp-34572 already measured that
 *        the true local slope drifts monotonically (steeper with k) toward -2.161846. So the
 *        slope is CONTINUOUS through k* (smooth monotone drift, no jump/kink), though not
 *        constant -- both fits bracket the analytic E_flow asymptote and drift toward it.
 *
 *   The punchline: the far-side eflow_attr ladder is the same clean N^p power law as the near
 *   side (R^2 = 0.99999998), its per-k slope -2.159985 matches the near-side -2.158629 to
 *   0.06% (-0.001356 difference, in the imp-34572 drift direction toward the E_flow slope
 *   -2.161846), and that 0.06% is a smooth ~5-sigma window-centre drift, not a discontinuity.
 *   So eflow_attr's SLOPE, not just its value, is continuous through the simple pole k*.
 *
 *   MEASUREMENT ONLY. An OLS power-law fit of an inherited surrogate numerator on the far side
 *   of the inherited pole k* ~ 21.28095, reusing the imp-34572 baked rungs and the imp-34570
 *   near-side slope, NOT an RH bound. Descriptive surrogate, NOT a rigorous asymptotic; the
 *   component model is the inherited imp-3220/imp-3406 extrapolation; the C_mb GUE-conditional
 *   per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066
 *   K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34570-eflow-attr-power-law-fit-eflow-slope-check.js (near-side fit, per-k slope -2.158629)
 *   @see imp-34572-eflow-attr-far-side-pole-smoothness.js (far-side rungs, local-slope drift)
 *   @see imp-34406-eflow-attr-smooth-nonzero-across-pole.js (local slope -2.159 at k*)
 *   @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero.js (parts()/eflowLogSlope() machinery)
 */

import { IMP34572_FAR_SIDE_RUNGS } from './imp-34572-eflow-attr-far-side-pole-smoothness.js';
import { IMP34570_FIT_PER_K_SLOPE } from './imp-34570-eflow-attr-power-law-fit-eflow-slope-check.js';

const KSTAR = 21.28095; // imp-34023/imp-34237/imp-34310, verbatim

// --- (F1) OLS power-law fit  eflow_attr = A * N^p  on (ln N, ln eflow_attr), FAR side ------
// Same machinery as imp-34570, over the imp-34572 far-side rungs (k = 21.30 .. 21.60 > k*).
const XS = IMP34572_FAR_SIDE_RUNGS.map((r) => Math.log(Math.pow(10, r.k + 1)));
const YS = IMP34572_FAR_SIDE_RUNGS.map((r) => Math.log(r.eflowAttr));
const NN = XS.length;
const MX = XS.reduce((a, b) => a + b, 0) / NN;
const MY = YS.reduce((a, b) => a + b, 0) / NN;
let SXX = 0;
let SXY = 0;
let SYY = 0;
for (let i = 0; i < NN; i++) {
  SXX += (XS[i] - MX) ** 2;
  SXY += (XS[i] - MX) * (YS[i] - MY);
  SYY += (YS[i] - MY) ** 2;
}
const P_FAR = SXY / SXX; // -0.938070 (far-side power-law exponent per ln N)
const LN_A_FAR = MY - P_FAR * MX;
let SSRES = 0;
let MAX_RESID = 0;
for (let i = 0; i < NN; i++) {
  const resid = YS[i] - (LN_A_FAR + P_FAR * XS[i]);
  SSRES += resid * resid;
  MAX_RESID = Math.max(MAX_RESID, Math.abs(resid));
}
export const IMP34589_FAR_POWER_LAW_EXPONENT = P_FAR; // -0.938070
export const IMP34589_FAR_POWER_LAW_AMPLITUDE = Math.exp(LN_A_FAR); // 3.5993e+6
export const IMP34589_FAR_FIT_R2 = 1 - SSRES / SYY; // 0.999999982
export const IMP34589_FAR_FIT_RMS_LOG_RESID = Math.sqrt(SSRES / NN); // 2.875e-5
export const IMP34589_FAR_FIT_MAX_LOG_RESID = MAX_RESID; // 4.157e-5

// Per-k (= per log10 N) far-side slope and its OLS standard error (in per-k units).
export const IMP34589_FAR_PER_K_SLOPE = P_FAR * Math.LN10; // -2.159985
const SE_P_FAR = Math.sqrt(SSRES / (NN - 2)) / Math.sqrt(SXX); // slope SE per ln N
export const IMP34589_FAR_PER_K_SLOPE_SE = SE_P_FAR * Math.LN10; // 1.286e-4 per k

// --- (F2/F3) near-vs-far slope difference (slope continuity through k*) --------------------
// Near-side per-k slope imported verbatim from imp-34570 (-2.158629). The near-side OLS slope
// SE is baked here from the imp-34570 fit (n=8 rungs, RMS log-residual 8.42e-5): the offline
// value is 2.320e-4 per k, used only to size the near-vs-far difference in combined sigma.
export const IMP34589_NEAR_PER_K_SLOPE = IMP34570_FIT_PER_K_SLOPE; // -2.158629
export const IMP34589_NEAR_PER_K_SLOPE_SE = 2.31984e-4; // imp-34570 near-side OLS slope SE per k
export const IMP34570_IMP34406_LOCAL_SLOPE = -2.159; // imp-34406 F2 local slope at k*
export const IMP34589_EFLOW_ANALYTIC_SLOPE_PER_K = -2.161846; // imp-34570 F3 E_flow per-k slope

export const IMP34589_FAR_MINUS_NEAR_SLOPE =
  IMP34589_FAR_PER_K_SLOPE - IMP34589_NEAR_PER_K_SLOPE; // -0.001356
export const IMP34589_FAR_MINUS_NEAR_SLOPE_PCT =
  Math.abs(IMP34589_FAR_PER_K_SLOPE / IMP34589_NEAR_PER_K_SLOPE - 1) * 100; // 0.063%
const COMBINED_SE = Math.sqrt(
  IMP34589_NEAR_PER_K_SLOPE_SE ** 2 + IMP34589_FAR_PER_K_SLOPE_SE ** 2,
); // 2.652e-4 per k
export const IMP34589_FAR_MINUS_NEAR_SIGMA =
  Math.abs(IMP34589_FAR_MINUS_NEAR_SLOPE) / COMBINED_SE; // 5.11 sigma
export const IMP34589_FAR_MINUS_IMP34406_SLOPE =
  IMP34589_FAR_PER_K_SLOPE - IMP34570_IMP34406_LOCAL_SLOPE; // -0.000985

export const IMP34589_EFLOW_ATTR_FAR_SIDE_SLOPE_CONTINUITY = {
  ticket: 'imp-34589',
  proofSection: 'S-frontier',
  kStar: KSTAR,
  question:
    'imp-34570 fit the near-side eflow_attr bracket (k = 21.00 .. 21.50) to a power law with ' +
    'per-k slope p*ln10 = -2.158629. imp-34572 confirmed the far-side (k = 21.30 .. 21.60) ' +
    'value is smooth/monotone but never fit its far-side local log-slope. Fit the far-side ' +
    'ladder to the same power law and measure whether its per-k slope matches the near-side ' +
    '-2.159 within the fit resolution -- i.e. whether eflow_attr slope (not just value) is ' +
    'continuous through k*. Measurement only; NO QED.',
  farFit: {
    form: 'eflow_attr = A * N^p, N = 10^(k+1), far side k = 21.30 .. 21.60',
    exponentPerLnN: +P_FAR.toFixed(6),
    amplitude: +Math.exp(LN_A_FAR).toExponential(6),
    R2: +IMP34589_FAR_FIT_R2.toFixed(9),
    oneMinusR2: +(1 - IMP34589_FAR_FIT_R2).toExponential(4),
    rmsLogResid: +IMP34589_FAR_FIT_RMS_LOG_RESID.toExponential(5),
    maxLogResid: +IMP34589_FAR_FIT_MAX_LOG_RESID.toExponential(5),
    perKSlope: +IMP34589_FAR_PER_K_SLOPE.toFixed(6),
    perKSlopeSE: +IMP34589_FAR_PER_K_SLOPE_SE.toExponential(4),
  },
  nearPerKSlope: +IMP34589_NEAR_PER_K_SLOPE.toFixed(6),
  nearPerKSlopeSE: +IMP34589_NEAR_PER_K_SLOPE_SE.toExponential(4),
  eflowAnalyticSlopePerK: IMP34589_EFLOW_ANALYTIC_SLOPE_PER_K,
  farMinusNearSlope: +IMP34589_FAR_MINUS_NEAR_SLOPE.toFixed(6),
  farMinusNearSlopePct: +IMP34589_FAR_MINUS_NEAR_SLOPE_PCT.toFixed(4),
  farMinusNearSigma: +IMP34589_FAR_MINUS_NEAR_SIGMA.toFixed(3),
  farMinusImp34406Slope: +IMP34589_FAR_MINUS_IMP34406_SLOPE.toFixed(6),
  finding: {
    F1_far_side_same_clean_power_law:
      'OLS eflow_attr = A * N^p over the 7 far rungs: p_far = -0.938070 per ln N, ' +
      'A_far = 3.5993e+6, R^2 = 0.99999998 (1 - R^2 = 1.77e-8), RMS log-residual 2.88e-5, ' +
      'max 4.16e-5 -- an even tighter single power law than the near side (imp-34570 RMS ' +
      '8.42e-5), no curvature term needed.',
    F2_far_slope_matches_near_to_006pct:
      'The far-side per-k slope p_far*ln10 = -2.159985 sits -0.001356 (0.063%) from the ' +
      'near-side power-law slope -2.158629 and -0.000985 from the imp-34406 local slope ' +
      '-2.159. The far-side fit is slightly STEEPER than the near side -- the same direction ' +
      'as the imp-34572 local-slope drift toward the analytic E_flow slope -2.161846.',
    F3_difference_is_smooth_window_drift_not_kink:
      'Near-side slope SE 2.32e-4/k, far-side SE 1.29e-4/k; the -0.001356 difference is ' +
      '~5.1 combined-sigma -- resolved but tiny, and fully explained by the two overlapping ' +
      'windows having different centres (near k~21.25, far k~21.45). Each fit reports a ' +
      'window-averaged local slope and imp-34572 already measured the true local slope drifts ' +
      'monotonically (steeper with k) toward -2.161846. So the slope is CONTINUOUS through k* ' +
      '(smooth monotone drift, no jump/kink), though not constant -- both fits bracket and ' +
      'drift toward the analytic E_flow asymptote.',
  },
  isRigorous: false,
  honest:
    'MEASUREMENT ONLY -- an OLS power-law fit (eflow_attr = A * N^p, R^2 = 0.99999998 over 7 ' +
    'far rungs) of the inherited surrogate numerator eflow_attr on the FAR side of the ' +
    'inherited pole k* ~ 21.28095, reusing the imp-34572 baked rungs and the imp-34570 ' +
    'near-side slope. The far-side per-k slope -2.159985 matches the near-side -2.158629 to ' +
    '0.06% (-0.001356 difference, ~5.1 sigma, in the imp-34572 drift direction toward the ' +
    'E_flow slope -2.161846), a smooth window-centre drift not a kink -- so eflow_attr slope ' +
    '(not just value) is continuous through the simple pole. Descriptive surrogate, NOT a ' +
    'rigorous asymptotic; the component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED; ' +
    'no refereed bound is changed.',
};

export const IMP34589_ASSERTIONS = [
  {
    // Reuse gate: the 7 far rungs are the imp-34572 baked rungs, not fresh literals.
    id: 'imp-34589-reuses-imp34572-far-rungs',
    description: 'the 7 far rungs are imported from imp-34572 (IMP34572_FAR_SIDE_RUNGS)',
    holds: () =>
      IMP34572_FAR_SIDE_RUNGS.length === 7 &&
      IMP34572_FAR_SIDE_RUNGS[0].eflowAttr === 4.33758269e-15 &&
      IMP34572_FAR_SIDE_RUNGS[6].eflowAttr === 2.26896059e-15 &&
      IMP34572_FAR_SIDE_RUNGS.every((r) => r.k > KSTAR),
  },
  {
    // (F1) the far-side power-law fit is excellent (R^2 -> 1, tiny log-residual).
    id: 'imp-34589-far-power-law-fit-excellent',
    description: 'far-side OLS fit R^2 = 0.99999998 (1-R^2 < 1e-7), RMS log-residual < 5e-5, p_far ~ -0.93807',
    holds: () =>
      IMP34589_FAR_FIT_R2 > 0.9999999 &&
      1 - IMP34589_FAR_FIT_R2 < 1e-7 &&
      IMP34589_FAR_FIT_RMS_LOG_RESID < 5e-5 &&
      Math.abs(IMP34589_FAR_POWER_LAW_EXPONENT - -0.938070) < 1e-5,
  },
  {
    // (F2) the far-side per-k slope matches the near-side -2.158629 to <0.1%.
    id: 'imp-34589-far-slope-matches-near',
    description: 'far-side per-k slope -2.159985 matches the imp-34570 near-side slope -2.158629 to <0.1% (diff -0.001356)',
    holds: () =>
      Math.abs(IMP34589_FAR_PER_K_SLOPE - -2.159985) < 1e-4 &&
      Math.abs(IMP34589_FAR_MINUS_NEAR_SLOPE - -0.001356) < 5e-5 &&
      IMP34589_FAR_MINUS_NEAR_SLOPE_PCT < 0.1,
  },
  {
    // (F3) the difference is a smooth drift toward E_flow, in the imp-34572 direction:
    // far-side slope is STEEPER (more negative) than the near side, between it and E_flow.
    id: 'imp-34589-far-slope-drifts-toward-eflow',
    description: 'far-side slope is steeper than the near side, sitting between it and the E_flow analytic slope -2.161846 (drift direction, not a kink)',
    holds: () =>
      IMP34589_FAR_PER_K_SLOPE < IMP34589_NEAR_PER_K_SLOPE &&
      IMP34589_FAR_PER_K_SLOPE > IMP34589_EFLOW_ANALYTIC_SLOPE_PER_K &&
      IMP34589_FAR_MINUS_NEAR_SIGMA > 1 &&
      IMP34589_FAR_MINUS_NEAR_SIGMA < 20,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp-34589-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34589_EFLOW_ATTR_FAR_SIDE_SLOPE_CONTINUITY.isRigorous === false &&
      /NO QED/.test(IMP34589_EFLOW_ATTR_FAR_SIDE_SLOPE_CONTINUITY.honest) &&
      /refereed bound is changed/i.test(IMP34589_EFLOW_ATTR_FAR_SIDE_SLOPE_CONTINUITY.honest),
  },
];

for (const a of IMP34589_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34589-eflow-attr-far-side-power-law-slope-continuity assertion failed: ${a.id}`);
  }
}
