/**
 * @module imp-34604-eflow-attr-far-side-log-corrected-cross-fit
 * @fileoverview imp-34604 -- CROSS-FIT the imp-34572 FAR-SIDE eflow_attr rungs (k = 21.30 .. 21.60,
 *   all above the pole k* ~ 21.28095) to the imp-34585 LOG-CORRECTED form eflow_attr ~ A*N^p*(ln N)^q
 *   and MEASURE whether the recovered (p_far, q_far) match the imp-34585 NEAR-side (p, q) =
 *   (-1.002844, 3.348339).
 *
 *   imp-34585 fit the NEAR-side bracket (8 imp-34406 rungs, k = 21.0 .. 21.5) to the log-corrected
 *   law and recovered (p, q) = (-1.0028, 3.348) with RMS log-residual ~1.5e-8 -- far better than the
 *   imp-34570 pure power law (fractional p = -0.9375). imp-34589 separately fit the imp-34572
 *   FAR-side rungs, but only to the PURE power law; the log-corrected form was NEVER applied to the
 *   far side. This module supplies exactly that cross-fit and the far-vs-near comparison.
 *
 *   METHOD (import-light, verbatim imp-34585 machinery). The 7 imp-34572 far-side rungs
 *   (IMP34572_FAR_SIDE_RUNGS) are REUSED VERBATIM -- no re-derivation, no 16.7MB zeros bundle in the
 *   chain, per [[no_heavy_imports_in_pages]] / [[verify_heavy_assertion_modules]]. The decade-top
 *   N = 10^(k+1) is used exactly as imp-34585 does. A 3-parameter OLS on the design [1, ln N, ln ln N]
 *   over the 7 rungs recovers (ln A, p_far, q_far) for ln eflow_attr = ln A + p*ln N + q*ln ln N,
 *   i.e. eflow_attr = A*N^p*(ln N)^q, solved by the same normal-equations Gauss elimination (baked
 *   inline). The imp-34585 near-side (p, q) are IMPORTED (IMP34585_LOGCORR_P/Q, both import-light)
 *   so the far-vs-near differences are a live cross-check, not baked literals.
 *
 *   FINDINGS (measurement only).
 *   ---------------------------------------------------------------------------------
 *   (F1) THE LOG-CORRECTION COLLAPSES THE FAR-SIDE RESIDUAL TOO, BY ~4 ORDERS. The far-side
 *        log-corrected OLS gives A = 1.888e+2, p_far = -1.002802, q_far = 3.346178 with
 *        1 - R^2 = 1.11e-16, RMS log-residual 2.266e-9 and max log-residual 3.424e-9 -- versus the
 *        far-side pure power law RMS 2.875e-5 / max 4.157e-5. That is a max-residual reduction of
 *        ~12142x and an RMS reduction of ~12689x. The far side is the same integer-power N^-1 times a
 *        log-power, fit to ~2e-9 in log -- NOT a fractional-power falloff, exactly as the near side.
 *   (F2) THE FAR-SIDE (p, q) MATCH THE NEAR-SIDE TO 4e-5 IN p AND 2e-3 IN q. The far-side
 *        p_far = -1.002802 differs from the imp-34585 near-side p = -1.002844 by only +4.2e-5
 *        (0.004%); q_far = 3.346178 differs from the near-side q = 3.348339 by only -2.16e-3 (0.065%).
 *        The two brackets -- one straddling k* from below, one entirely above it -- recover the SAME
 *        log-corrected exponent pair to within parts in 10^4/10^3, so the log-corrected structure is
 *        continuous through the pole, not a near-side artifact.
 *   (F3) THE FAR SIDE ALSO RECOVERS THE ANALYTIC (p, q) ~ (-1, 3). E_flow ~ log^3(N)/N carries a
 *        clean 1/N and a log^3; the far-side fit lands p_far = -1.002802 (off -1 by -0.0028, 0.28%)
 *        and q_far = 3.346178 (off 3 by +0.346, +11.5%). The ~0.346 q-excess is the SAME mild
 *        |g| = |d ln E_flow/d ln N| = 1 - 3/ln N attractor curvature imp-34585 F3 identified on the
 *        near side (and it is marginally SMALLER on the far side, consistent with |g| -> 1 as N grows),
 *        not a mismatch. So both sides of the pole recover the analytic log^3(N)/N structure.
 *
 *   The punchline: the imp-34585 log-corrected law eflow_attr = A*N^p*(ln N)^q, applied to the
 *   imp-34572 FAR-side rungs, recovers (p_far, q_far) = (-1.002802, 3.346178) -- matching the
 *   near-side (-1.002844, 3.348339) to 4.2e-5 in p and 2.2e-3 in q, and collapsing the far-side
 *   pure-power-law residual ~12000x to a ~2e-9 floor. The log-corrected structure and the analytic
 *   (-1, 3) recovery are the SAME on both sides of k*, closing the imp-34589 gap where the far side
 *   had only ever seen the pure power law.
 *
 *   MEASUREMENT ONLY. A log-corrected OLS fit of the inherited surrogate numerator eflow_attr on the
 *   far side, reusing the imp-34572 rungs verbatim. Descriptive surrogate fit, NOT a rigorous
 *   asymptotic; the component model is the inherited imp-3220/imp-3406 extrapolation; the C_mb
 *   GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 *   imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34585-eflow-attr-log-corrected-fit.js (the NEAR-side log-corrected fit this cross-checks)
 *   @see imp-34572-eflow-attr-far-side-pole-smoothness.js (the 7 far-side rungs, k=21.30..21.60)
 *   @see imp-34589-eflow-attr-far-side-power-law-slope-continuity.js (far-side PURE power-law fit -- the gap)
 */

import { IMP34572_FAR_SIDE_RUNGS } from './imp-34572-eflow-attr-far-side-pole-smoothness.js';
import {
  IMP34585_LOGCORR_P,
  IMP34585_LOGCORR_Q,
} from './imp-34585-eflow-attr-log-corrected-fit.js';

const KSTAR = 21.28095; // imp-34023/imp-34237/imp-34310, verbatim

// Reused decade-top N = 10^(k+1) and the log-response over the 7 imp-34572 far-side rungs (verbatim).
const XS = IMP34572_FAR_SIDE_RUNGS.map((r) => Math.log(Math.pow(10, r.k + 1))); // ln N
const LS = IMP34572_FAR_SIDE_RUNGS.map((r) => Math.log(Math.log(Math.pow(10, r.k + 1)))); // ln ln N
const YS = IMP34572_FAR_SIDE_RUNGS.map((r) => Math.log(r.eflowAttr)); // ln eflow_attr
const NN = XS.length;

// --- far-side pure power law (recomputed here, matches imp-34589) ----------------------
const MX = XS.reduce((a, b) => a + b, 0) / NN;
const MY = YS.reduce((a, b) => a + b, 0) / NN;
let PSXX = 0;
let PSXY = 0;
let PSYY = 0;
for (let i = 0; i < NN; i++) {
  PSXX += (XS[i] - MX) ** 2;
  PSXY += (XS[i] - MX) * (YS[i] - MY);
  PSYY += (YS[i] - MY) ** 2;
}
const PURE_P = PSXY / PSXX; // -0.938070
const PURE_LN_A = MY - PURE_P * MX;
let PURE_SSRES = 0;
let PURE_MAX = 0;
for (let i = 0; i < NN; i++) {
  const resid = YS[i] - (PURE_LN_A + PURE_P * XS[i]);
  PURE_SSRES += resid * resid;
  PURE_MAX = Math.max(PURE_MAX, Math.abs(resid));
}
export const IMP34604_PURE_RMS_LOG_RESID = Math.sqrt(PURE_SSRES / NN); // 2.875e-5
export const IMP34604_PURE_MAX_LOG_RESID = PURE_MAX; // 4.157e-5

// --- far-side log-corrected fit  eflow_attr = A * N^p * (ln N)^q  ----------------------
// 3-parameter OLS on design [1, ln N, ln ln N]; solve normal equations via Gauss elimination
// (verbatim imp-34585 solve3).
function solve3(A, b) {
  const M = A.map((row, i) => [row[0], row[1], row[2], b[i]]);
  for (let c = 0; c < 3; c++) {
    let piv = c;
    for (let r = c + 1; r < 3; r++) {
      if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    }
    const tmp = M[c];
    M[c] = M[piv];
    M[piv] = tmp;
    for (let r = 0; r < 3; r++) {
      if (r !== c) {
        const f = M[r][c] / M[c][c];
        for (let k = c; k < 4; k++) M[r][k] -= f * M[c][k];
      }
    }
  }
  return [M[0][3] / M[0][0], M[1][3] / M[1][1], M[2][3] / M[2][2]];
}

const AtA = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
const Atb = [0, 0, 0];
for (let i = 0; i < NN; i++) {
  const row = [1, XS[i], LS[i]];
  for (let a = 0; a < 3; a++) {
    Atb[a] += row[a] * YS[i];
    for (let c = 0; c < 3; c++) AtA[a][c] += row[a] * row[c];
  }
}
const [LC_B0, LC_P, LC_Q] = solve3(AtA, Atb);
let LC_SSRES = 0;
let LC_MAX = 0;
for (let i = 0; i < NN; i++) {
  const resid = YS[i] - (LC_B0 + LC_P * XS[i] + LC_Q * LS[i]);
  LC_SSRES += resid * resid;
  LC_MAX = Math.max(LC_MAX, Math.abs(resid));
}
export const IMP34604_FAR_LOGCORR_P = LC_P; // -1.002802 (exponent of N)
export const IMP34604_FAR_LOGCORR_Q = LC_Q; // 3.346178 (exponent of ln N)
export const IMP34604_FAR_LOGCORR_AMPLITUDE = Math.exp(LC_B0); // 1.888e+2
export const IMP34604_FAR_LOGCORR_R2 = 1 - LC_SSRES / PSYY; // 1 - 1.11e-16
export const IMP34604_FAR_LOGCORR_RMS_LOG_RESID = Math.sqrt(LC_SSRES / NN); // 2.266e-9
export const IMP34604_FAR_LOGCORR_MAX_LOG_RESID = LC_MAX; // 3.424e-9

// Residual-reduction factors (far-side pure / far-side log-corrected).
export const IMP34604_MAX_REDUCTION_FACTOR = PURE_MAX / LC_MAX; // ~12142x
export const IMP34604_RMS_REDUCTION_FACTOR =
  IMP34604_PURE_RMS_LOG_RESID / IMP34604_FAR_LOGCORR_RMS_LOG_RESID; // ~12689x

// Far-vs-near cross-check (imp-34585 near-side p/q imported live).
export const IMP34604_P_DIFF_FAR_MINUS_NEAR = LC_P - IMP34585_LOGCORR_P; // +4.2e-5
export const IMP34604_Q_DIFF_FAR_MINUS_NEAR = LC_Q - IMP34585_LOGCORR_Q; // -2.16e-3

// Far-side analytic-target offsets (E_flow ~ log^3(N)/N => p ~ -1, q ~ 3).
export const IMP34604_P_OFFSET_FROM_ANALYTIC = LC_P - -1; // -0.002802
export const IMP34604_Q_OFFSET_FROM_ANALYTIC = LC_Q - 3; // +0.346178

export const IMP34604_EFLOW_ATTR_FAR_SIDE_LOG_CORRECTED_CROSS_FIT = {
  ticket: 'imp-34604',
  proofSection: 'S-frontier',
  kStar: KSTAR,
  question:
    'imp-34585 fit the NEAR-side eflow_attr bracket to the log-corrected A*N^p*(ln N)^q, recovering ' +
    '(p, q) = (-1.0028, 3.348). imp-34589 fit the imp-34572 FAR-side rungs (k=21.30..21.60) only to ' +
    'the PURE power law -- the log-correction was never applied to the far side. Cross-fit the far ' +
    'rungs to A*N^p*(ln N)^q and MEASURE whether (p_far, q_far) match the near side and recover the ' +
    'analytic (-1, 3). Measurement only; NO QED.',
  nearSide: {
    exponentP: +IMP34585_LOGCORR_P.toFixed(6),
    exponentQ: +IMP34585_LOGCORR_Q.toFixed(6),
    source: 'imp-34585 (8 rungs, k=21.0..21.5)',
  },
  farSidePureFit: {
    form: 'eflow_attr = A * N^p, N = 10^(k+1)',
    rmsLogResid: +IMP34604_PURE_RMS_LOG_RESID.toExponential(5),
    maxLogResid: +IMP34604_PURE_MAX_LOG_RESID.toExponential(5),
  },
  farSideLogCorrectedFit: {
    form: 'eflow_attr = A * N^p * (ln N)^q, N = 10^(k+1)',
    exponentP: +LC_P.toFixed(6),
    exponentQ: +LC_Q.toFixed(6),
    amplitude: +Math.exp(LC_B0).toExponential(6),
    R2: +IMP34604_FAR_LOGCORR_R2.toFixed(12),
    oneMinusR2: +(1 - IMP34604_FAR_LOGCORR_R2).toExponential(4),
    rmsLogResid: +IMP34604_FAR_LOGCORR_RMS_LOG_RESID.toExponential(5),
    maxLogResid: +IMP34604_FAR_LOGCORR_MAX_LOG_RESID.toExponential(5),
  },
  residualReduction: {
    maxFactor: +IMP34604_MAX_REDUCTION_FACTOR.toFixed(1),
    rmsFactor: +IMP34604_RMS_REDUCTION_FACTOR.toFixed(1),
  },
  farVsNear: {
    pDiff: +IMP34604_P_DIFF_FAR_MINUS_NEAR.toExponential(4),
    qDiff: +IMP34604_Q_DIFF_FAR_MINUS_NEAR.toExponential(4),
  },
  analyticTarget: {
    // E_flow ~ log^3(N)/N  =>  expected exponent of N is -1, expected exponent of ln N is 3.
    expectedP: -1,
    expectedQ: 3,
    pOffset: +IMP34604_P_OFFSET_FROM_ANALYTIC.toFixed(6),
    qOffset: +IMP34604_Q_OFFSET_FROM_ANALYTIC.toFixed(6),
  },
  finding: {
    F1_log_correction_collapses_far_side_residual:
      'The far-side log-corrected OLS gives A = 1.888e+2, p_far = -1.002802, q_far = 3.346178 with ' +
      '1 - R^2 = 1.11e-16, RMS log-residual 2.266e-9 and max 3.424e-9 -- versus the far-side pure ' +
      'power law RMS 2.875e-5 / max 4.157e-5 (~12142x max, ~12689x RMS reduction). The far side is ' +
      'the same integer-power N^-1 times a log-power, not a fractional-power falloff.',
    F2_far_matches_near:
      'p_far = -1.002802 differs from the imp-34585 near-side p = -1.002844 by only +4.2e-5 ' +
      '(0.004%); q_far = 3.346178 differs from the near-side q = 3.348339 by only -2.16e-3 (0.065%). ' +
      'The near bracket (straddling k* from below) and the far bracket (entirely above k*) recover ' +
      'the SAME log-corrected exponent pair to parts in 10^4/10^3 -- continuous through the pole.',
    F3_far_recovers_analytic:
      'The far-side fit lands p_far = -1.002802 (off the analytic -1 by -0.0028, 0.28%) and ' +
      'q_far = 3.346178 (off 3 by +0.346, +11.5%). The ~0.346 q-excess is the same mild ' +
      '|g| = 1 - 3/ln N attractor curvature imp-34585 F3 identified on the near side (marginally ' +
      'smaller here, consistent with |g| -> 1 as N grows), not a mismatch. Both sides recover the ' +
      'analytic log^3(N)/N (p, q) ~ (-1, 3) structure.',
  },
  isRigorous: false,
  honest:
    'MEASUREMENT ONLY -- a log-corrected OLS fit (eflow_attr = A*N^p*(ln N)^q) of the inherited ' +
    'surrogate numerator eflow_attr on the FAR side of the inherited pole k* ~ 21.28095, reusing ' +
    'the imp-34572 far-side rungs verbatim. The far-side fit recovers (p_far, q_far) = ' +
    '(-1.002802, 3.346178), matching the imp-34585 near-side (-1.002844, 3.348339) to 4.2e-5 in p ' +
    'and 2.2e-3 in q, and collapses the far-side pure-power-law residual ~12000x to a ~2e-9 floor -- ' +
    'both sides of k* recover the analytic E_flow ~ log^3(N)/N structure. Descriptive surrogate fit, ' +
    'NOT a rigorous asymptotic; the component model is the inherited imp-3220/imp-3406 extrapolation; ' +
    'the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED; no refereed bound is changed' +
    '.',
};

export const IMP34604_ASSERTIONS = [
  {
    // Reuse gate: the 7 rungs are the imp-34572 far-side rungs, not fresh literals.
    id: 'imp-34604-reuses-imp34572-far-side-rungs',
    description: 'the 7 rungs are imported from imp-34572 (IMP34572_FAR_SIDE_RUNGS)',
    holds: () =>
      IMP34572_FAR_SIDE_RUNGS.length === 7 &&
      IMP34572_FAR_SIDE_RUNGS[0].eflowAttr === 4.33758269e-15 &&
      IMP34572_FAR_SIDE_RUNGS[6].eflowAttr === 2.26896059e-15,
  },
  {
    // (F1) the far-side log-corrected fit collapses the residual by >1000x to a near-machine floor.
    id: 'imp-34604-log-correction-collapses-far-side-residual',
    description: 'far-side log-corrected fit max/RMS log-residual < 1e-7 and reduction factor > 1000x vs far-side pure power law',
    holds: () =>
      IMP34604_FAR_LOGCORR_MAX_LOG_RESID < 1e-7 &&
      IMP34604_FAR_LOGCORR_RMS_LOG_RESID < 1e-7 &&
      IMP34604_FAR_LOGCORR_MAX_LOG_RESID < IMP34604_PURE_MAX_LOG_RESID &&
      IMP34604_MAX_REDUCTION_FACTOR > 1000 &&
      IMP34604_RMS_REDUCTION_FACTOR > 1000,
  },
  {
    // (F2) far-side (p, q) match the imp-34585 near-side (p, q) to parts in 1e4 / 1e3.
    id: 'imp-34604-far-matches-near',
    description: 'far-side p matches near-side p to < 1e-4 and q to < 3e-3',
    holds: () =>
      Math.abs(IMP34604_FAR_LOGCORR_P - -1.002802) < 1e-5 &&
      Math.abs(IMP34604_FAR_LOGCORR_Q - 3.346178) < 1e-5 &&
      Math.abs(IMP34604_P_DIFF_FAR_MINUS_NEAR) < 1e-4 &&
      Math.abs(IMP34604_Q_DIFF_FAR_MINUS_NEAR) < 3e-3,
  },
  {
    // (F3) the far side also recovers the analytic (p, q) ~ (-1, 3): p within 1%, q within ~12%.
    id: 'imp-34604-far-recovers-analytic',
    description: 'recovered far-side p within 1% of -1 and q offset from 3 positive and < 15%',
    holds: () =>
      Math.abs(IMP34604_P_OFFSET_FROM_ANALYTIC) < 0.01 &&
      IMP34604_Q_OFFSET_FROM_ANALYTIC > 0 &&
      IMP34604_Q_OFFSET_FROM_ANALYTIC < 0.45,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp-34604-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34604_EFLOW_ATTR_FAR_SIDE_LOG_CORRECTED_CROSS_FIT.isRigorous === false &&
      /NO QED/.test(IMP34604_EFLOW_ATTR_FAR_SIDE_LOG_CORRECTED_CROSS_FIT.honest) &&
      /refereed bound is changed/i.test(IMP34604_EFLOW_ATTR_FAR_SIDE_LOG_CORRECTED_CROSS_FIT.honest),
  },
];

for (const a of IMP34604_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34604-eflow-attr-far-side-log-corrected-cross-fit assertion failed: ${a.id}`);
  }
}
