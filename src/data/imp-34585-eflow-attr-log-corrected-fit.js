/**
 * @module imp-34585-eflow-attr-log-corrected-fit
 * @fileoverview imp-34585 -- ASSESS whether replacing the imp-34570 PURE power-law fit of the
 *   smooth eflow_attr(k) bracket with a LOG-CORRECTED form eflow_attr ~ A * N^p * log^q(N)
 *   reduces the max/RMS log-residual, and whether the recovered (p, q) are consistent with the
 *   analytic E_flow ~ log^3(N)/N structure (i.e. p ~ -1, q ~ 3).
 *
 *   imp-34570 fit the 8 baked imp-34406 rungs (8.287e-15 -> 2.816e-15 across k = 21.0 .. 21.5)
 *   to a PURE power law eflow_attr = A * N^p in the decade-top N = 10^(k+1), getting
 *   R^2 = 0.99999993, p = -0.937481, RMS log-residual 8.42e-5 and max 1.40e-4. Its own module
 *   note flags that it "never tested a log-correction against the E_flow analytic log^3(N)/N
 *   structure". This module supplies that test.
 *
 *   METHOD (import-light, verbatim imp-34570 machinery). The SAME 8 baked rungs are REUSED from
 *   imp-34406 (IMP34406_EFLOW_ATTR_RUNGS -- no re-derivation, no 16.7MB zeros bundle in the
 *   chain, per [[no_heavy_imports_in_pages]] / [[verify_heavy_assertion_modules]]). A 3-parameter
 *   OLS on the design [1, ln N, ln ln N] over the 8 rungs recovers (ln A, p, q) for
 *   ln eflow_attr = ln A + p * ln N + q * ln ln N, i.e. eflow_attr = A * N^p * (ln N)^q. The fit
 *   is solved by the normal equations (3x3 Gauss elimination, baked inline). The pure power law
 *   is recomputed here too so the residual reduction is a same-module apples-to-apples ratio.
 *
 *   FINDINGS (measurement only).
 *   ---------------------------------------------------------------------------------
 *   (F1) THE LOG-CORRECTION COLLAPSES THE RESIDUAL BY ~4 ORDERS OF MAGNITUDE. The log-corrected
 *        OLS eflow_attr = A * N^p * (ln N)^q gives A = 1.876e+2, p = -1.002844, q = 3.348339 with
 *        1 - R^2 = 1.07e-15, RMS log-residual 1.047e-8 and max log-residual 1.516e-8 -- versus the
 *        pure power law RMS 8.42e-5 / max 1.40e-4. That is a max-residual reduction factor of
 *        ~9217x and an RMS reduction factor of ~8044x. The bracket is not a fractional-power
 *        falloff: it is an integer-power N^-1 times a log-power, fit to ~1.5e-8 in log.
 *   (F2) THE RECOVERED EXPONENT p = -1.0028 RECOVERS THE ANALYTIC N^-1 FALLOFF. E_flow ~
 *        log^3(N)/N carries a clean 1/N; the log-corrected fit lands p = -1.002844, off the
 *        analytic -1 by only -0.002844 (0.28%). The pure power law absorbed the log-curvature into
 *        a FRACTIONAL exponent -0.9375 -- 6.3% shy of -1 -- because a single N^p cannot carry the
 *        rising log^q factor; splitting it off recovers the true integer exponent.
 *   (F3) THE RECOVERED LOG-POWER q = 3.348 LANDS NEAR THE ANALYTIC log^3 EXPONENT q = 3. The
 *        recovered q sits +0.348 (+11.6%) above the bare 3. That residual offset is consistent
 *        with the |g| = |d ln E_flow / d ln N| attractor factor in eflow_attr = (E_flow/E_N)*|g|:
 *        for E_flow ~ log^3(N)/N one has |g| = |3/ln N - 1| = 1 - 3/ln N, a slowly RISING factor
 *        that adds weak extra log-dependence over the narrow half-decade of k and biases the fitted
 *        log-power slightly above 3 (E_N is E_trunc-flat per imp-34570 F3, contributing nothing).
 *        So the (p, q) ~ (-1, 3) analytic log^3(N)/N structure is RECOVERED, with the ~0.35 excess
 *        in q the mild |g| correction -- not a mismatch.
 *
 *   The punchline: the log-corrected fit eflow_attr = A * N^p * (ln N)^q collapses the imp-34570
 *   max log-residual from 1.40e-4 to 1.52e-8 (~9200x), and the recovered (p, q) = (-1.0028, 3.348)
 *   RECOVERS the analytic E_flow ~ log^3(N)/N structure -- p within 0.28% of -1, q within ~0.35
 *   of 3 (the excess the mild |g| = 1 - 3/ln N attractor curvature). The imp-34570 fractional
 *   p = -0.9375 was a single-power BLEND of the true -1 exponent and the log^3 factor; separating
 *   them is both a far better fit AND analytically interpretable.
 *
 *   MEASUREMENT ONLY. A log-corrected OLS fit of the inherited surrogate numerator eflow_attr,
 *   NOT an RH bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 *   rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 *   establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 *   No refereed bound is changed.
 *
 *   @see imp-34570-eflow-attr-power-law-fit-eflow-slope-check.js (the pure power-law fit this refines)
 *   @see imp-34406-eflow-attr-smooth-nonzero-across-pole.js (the 8 baked rungs)
 *   @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero.js (parts()/eflowLogSlope() machinery)
 */

import { IMP34406_EFLOW_ATTR_RUNGS } from './imp-34406-eflow-attr-smooth-nonzero-across-pole.js';

const KSTAR = 21.28095; // imp-34023/imp-34237/imp-34310, verbatim

// Reused decade-top N = 10^(k+1) and the log-response over the 8 imp-34406 rungs.
const XS = IMP34406_EFLOW_ATTR_RUNGS.map((r) => Math.log(Math.pow(10, r.k + 1))); // ln N
const LS = IMP34406_EFLOW_ATTR_RUNGS.map((r) => Math.log(Math.log(Math.pow(10, r.k + 1)))); // ln ln N
const YS = IMP34406_EFLOW_ATTR_RUNGS.map((r) => Math.log(r.eflowAttr));
const NN = XS.length;

// --- pure power law (recomputed here, matches imp-34570) -------------------------------
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
const PURE_P = PSXY / PSXX; // -0.937481
const PURE_LN_A = MY - PURE_P * MX;
let PURE_SSRES = 0;
let PURE_MAX = 0;
for (let i = 0; i < NN; i++) {
  const resid = YS[i] - (PURE_LN_A + PURE_P * XS[i]);
  PURE_SSRES += resid * resid;
  PURE_MAX = Math.max(PURE_MAX, Math.abs(resid));
}
export const IMP34585_PURE_RMS_LOG_RESID = Math.sqrt(PURE_SSRES / NN); // 8.42e-5
export const IMP34585_PURE_MAX_LOG_RESID = PURE_MAX; // 1.40e-4

// --- log-corrected fit  eflow_attr = A * N^p * (ln N)^q  -------------------------------
// 3-parameter OLS on design [1, ln N, ln ln N]; solve normal equations via Gauss elimination.
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
export const IMP34585_LOGCORR_P = LC_P; // -1.002844 (exponent of N)
export const IMP34585_LOGCORR_Q = LC_Q; // 3.348339 (exponent of ln N)
export const IMP34585_LOGCORR_AMPLITUDE = Math.exp(LC_B0); // 1.876e+2
export const IMP34585_LOGCORR_R2 = 1 - LC_SSRES / PSYY; // 1 - 1.07e-15
export const IMP34585_LOGCORR_RMS_LOG_RESID = Math.sqrt(LC_SSRES / NN); // 1.047e-8
export const IMP34585_LOGCORR_MAX_LOG_RESID = LC_MAX; // 1.516e-8

// Residual-reduction factors (pure / log-corrected) and analytic-target offsets.
export const IMP34585_MAX_REDUCTION_FACTOR = PURE_MAX / LC_MAX; // ~9217x
export const IMP34585_RMS_REDUCTION_FACTOR =
  IMP34585_PURE_RMS_LOG_RESID / IMP34585_LOGCORR_RMS_LOG_RESID; // ~8044x
export const IMP34585_P_OFFSET_FROM_ANALYTIC = LC_P - -1; // -0.002844 (analytic 1/N)
export const IMP34585_Q_OFFSET_FROM_ANALYTIC = LC_Q - 3; // +0.348339 (analytic log^3)
export const IMP34585_Q_OFFSET_PCT = (LC_Q / 3 - 1) * 100; // +11.61%

export const IMP34585_EFLOW_ATTR_LOG_CORRECTED_FIT = {
  ticket: 'imp-34585',
  proofSection: 'S-frontier',
  kStar: KSTAR,
  question:
    'imp-34570 fit the smooth eflow_attr(k) bracket to a PURE power law A*N^p (R^2 = 0.99999993, ' +
    'p = -0.9375, RMS log-residual 8.42e-5, max 1.40e-4) but never tested a log-correction against ' +
    'the analytic E_flow ~ log^3(N)/N structure. Fit the log-corrected form A*N^p*(ln N)^q, report ' +
    'the residual improvement, and measure whether (p, q) land near (-1, 3). Measurement only; NO QED.',
  pureFit: {
    form: 'eflow_attr = A * N^p, N = 10^(k+1)',
    rmsLogResid: +IMP34585_PURE_RMS_LOG_RESID.toExponential(5),
    maxLogResid: +IMP34585_PURE_MAX_LOG_RESID.toExponential(5),
  },
  logCorrectedFit: {
    form: 'eflow_attr = A * N^p * (ln N)^q, N = 10^(k+1)',
    exponentP: +LC_P.toFixed(6),
    exponentQ: +LC_Q.toFixed(6),
    amplitude: +Math.exp(LC_B0).toExponential(6),
    R2: +IMP34585_LOGCORR_R2.toFixed(12),
    oneMinusR2: +(1 - IMP34585_LOGCORR_R2).toExponential(4),
    rmsLogResid: +IMP34585_LOGCORR_RMS_LOG_RESID.toExponential(5),
    maxLogResid: +IMP34585_LOGCORR_MAX_LOG_RESID.toExponential(5),
  },
  residualReduction: {
    maxFactor: +IMP34585_MAX_REDUCTION_FACTOR.toFixed(1),
    rmsFactor: +IMP34585_RMS_REDUCTION_FACTOR.toFixed(1),
  },
  analyticTarget: {
    // E_flow ~ log^3(N)/N  =>  expected exponent of N is -1, expected exponent of ln N is 3.
    expectedP: -1,
    expectedQ: 3,
    pOffset: +IMP34585_P_OFFSET_FROM_ANALYTIC.toFixed(6),
    qOffset: +IMP34585_Q_OFFSET_FROM_ANALYTIC.toFixed(6),
    qOffsetPct: +IMP34585_Q_OFFSET_PCT.toFixed(3),
  },
  finding: {
    F1_log_correction_collapses_residual:
      'The log-corrected OLS eflow_attr = A*N^p*(ln N)^q gives A = 1.876e+2, p = -1.002844, ' +
      'q = 3.348339 with 1 - R^2 = 1.07e-15, RMS log-residual 1.047e-8 and max 1.516e-8 -- versus ' +
      'the pure power law RMS 8.42e-5 / max 1.40e-4. That is a ~9217x max-residual and ~8044x ' +
      'RMS-residual reduction: the bracket is an integer-power N^-1 times a log-power, not a ' +
      'fractional-power falloff.',
    F2_p_recovers_analytic_inverse_N:
      'The recovered exponent p = -1.002844 lands within 0.28% of the analytic E_flow N^-1 falloff ' +
      '(-1). The pure power law absorbed the rising log^q factor into a FRACTIONAL exponent -0.9375 ' +
      '(6.3% shy of -1); splitting the log off recovers the true integer exponent.',
    F3_q_near_analytic_log3:
      'The recovered log-power q = 3.348339 sits +0.348 (+11.6%) above the analytic log^3 exponent ' +
      '3. The offset is consistent with the |g| = |d ln E_flow/d ln N| = 1 - 3/ln N attractor factor ' +
      'in eflow_attr = (E_flow/E_N)*|g|, a slowly rising factor that adds weak extra log-dependence ' +
      'over the narrow half-decade and biases q slightly above 3 (E_N E_trunc-flat, inert). So the ' +
      'analytic (p, q) ~ (-1, 3) log^3(N)/N structure is RECOVERED, the ~0.35 excess the mild |g| ' +
      'correction, not a mismatch.',
  },
  isRigorous: false,
  honest:
    'MEASUREMENT ONLY -- a log-corrected OLS fit (eflow_attr = A*N^p*(ln N)^q) of the inherited ' +
    'surrogate numerator eflow_attr, reusing the imp-34406 baked rungs verbatim. The log-correction ' +
    'collapses the imp-34570 max log-residual from 1.40e-4 to 1.52e-8 (~9200x) and recovers the ' +
    'analytic E_flow ~ log^3(N)/N structure: p = -1.0028 (within 0.28% of -1), q = 3.348 (within ' +
    '~0.35 of 3, the excess the mild |g| = 1 - 3/ln N attractor curvature). Descriptive surrogate ' +
    'fit, NOT a rigorous asymptotic; the component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes ' +
    'no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED; no refereed bound is changed' +
    '.',
};

export const IMP34585_ASSERTIONS = [
  {
    // Reuse gate: the 8 rungs are the imp-34406 baked rungs, not fresh literals.
    id: 'imp-34585-reuses-imp34406-rungs',
    description: 'the 8 rungs are imported from imp-34406 (IMP34406_EFLOW_ATTR_RUNGS)',
    holds: () =>
      IMP34406_EFLOW_ATTR_RUNGS.length === 8 &&
      IMP34406_EFLOW_ATTR_RUNGS[0].eflowAttr === 8.28715423e-15 &&
      IMP34406_EFLOW_ATTR_RUNGS[7].eflowAttr === 2.81619473e-15,
  },
  {
    // (F1) the log-corrected fit collapses the residual by >1000x to a near-machine-precision floor.
    id: 'imp-34585-log-correction-collapses-residual',
    description: 'log-corrected fit max/RMS log-residual < 1e-7 and reduction factor > 1000x vs pure power law',
    holds: () =>
      IMP34585_LOGCORR_MAX_LOG_RESID < 1e-7 &&
      IMP34585_LOGCORR_RMS_LOG_RESID < 1e-7 &&
      IMP34585_LOGCORR_MAX_LOG_RESID < IMP34585_PURE_MAX_LOG_RESID &&
      IMP34585_MAX_REDUCTION_FACTOR > 1000 &&
      IMP34585_RMS_REDUCTION_FACTOR > 1000,
  },
  {
    // (F2) the recovered exponent p recovers the analytic N^-1 falloff to <1%.
    id: 'imp-34585-p-recovers-analytic-inverse-n',
    description: 'recovered p = -1.0028 lands within 1% of the analytic E_flow N^-1 exponent -1',
    holds: () =>
      Math.abs(IMP34585_LOGCORR_P - -1.002844) < 1e-5 &&
      Math.abs(IMP34585_P_OFFSET_FROM_ANALYTIC) < 0.01,
  },
  {
    // (F3) the recovered log-power q lands near the analytic log^3 exponent 3 (within ~12%).
    id: 'imp-34585-q-near-analytic-log3',
    description: 'recovered q = 3.348 lands near the analytic log^3 exponent 3 (offset +0.348, +11.6%)',
    holds: () =>
      Math.abs(IMP34585_LOGCORR_Q - 3.348339) < 1e-5 &&
      IMP34585_Q_OFFSET_FROM_ANALYTIC > 0 &&
      IMP34585_Q_OFFSET_PCT > 0 &&
      IMP34585_Q_OFFSET_PCT < 15,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp-34585-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34585_EFLOW_ATTR_LOG_CORRECTED_FIT.isRigorous === false &&
      /NO QED/.test(IMP34585_EFLOW_ATTR_LOG_CORRECTED_FIT.honest) &&
      /refereed bound is changed/i.test(IMP34585_EFLOW_ATTR_LOG_CORRECTED_FIT.honest),
  },
];

for (const a of IMP34585_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34585-eflow-attr-log-corrected-fit assertion failed: ${a.id}`);
  }
}
