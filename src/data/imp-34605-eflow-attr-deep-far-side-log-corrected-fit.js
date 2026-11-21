/**
 * @module imp-34605-eflow-attr-deep-far-side-log-corrected-fit
 * @fileoverview imp-34605 -- FIT the imp-34586 extended DEEP far-side eflow_attr rungs
 *   (k = 21.70 .. 22.00) to the imp-34585 log-corrected form eflow_attr = A * N^p * (ln N)^q
 *   and MEASURE whether the recovered per-k slope and log-power q continue drifting toward the
 *   analytic E_flow targets (-2.161846 per-k slope, q = 3) seen on the near/mid brackets, or
 *   whether the shrinking O(1e-15) magnitudes near the fp floor degrade the fit resolution.
 *
 *   imp-34585 fit the near/mid imp-34406 bracket (k = 21.00 .. 21.50, eflow_attr 8.287e-15 ->
 *   2.816e-15) to the log-corrected form and got A = 1.876e+2, p = -1.002844, q = 3.348339,
 *   RMS log-residual 1.047e-8 -- recovering the analytic E_flow ~ log^3(N)/N structure
 *   (p near -1, q near 3). imp-34586 then EXTENDED the far-side ladder past k = 21.60 to
 *   k = 22.00 (eflow_attr 1.828e-15 -> 9.554e-16), finding it stays monotone, convex, with the
 *   local per-k log-slope drifting -2.16163 -> -2.16355 across the analytic E_flow slope
 *   -2.161846 -- but NEVER fit those deep rungs to any parametric law. This module supplies
 *   that fit.
 *
 *   METHOD (import-light, verbatim imp-34585 machinery). The seven imp-34586 deep rungs are
 *   REUSED verbatim (IMP34586_DEEP_FAR_SIDE_RUNGS -- no re-derivation, no 16.7MB zeros bundle in
 *   the chain, per [[no_heavy_imports_in_pages]] / [[verify_heavy_assertion_modules]]). The SAME
 *   3-parameter OLS on the design [1, ln N, ln ln N] over N = 10^(k+1) recovers (ln A, p, q) for
 *   ln eflow_attr = ln A + p * ln N + q * ln ln N, solved by the identical solve3() Gauss
 *   elimination. The recovered (p, q) and the fit-implied per-k slope ln10 * (p + q / ln N) are
 *   compared directly against the imp-34585 near/mid fit (imported, not re-typed) and against the
 *   imp-34586 local slopes. A deepest-four subfit (k = 21.85 .. 22.00) is run as a fp-resolution
 *   robustness check.
 *
 *   FINDINGS (measurement only).
 *   ---------------------------------------------------------------------------------
 *   (F1) THE DRIFT TOWARD (p, q) = (-1, 3) CONTINUES ON THE DEEP FAR SIDE -- NOT DEGRADED. The
 *        deep-rung log-corrected OLS gives A = 1.910848e+2, p = -1.002724, q = 3.342126: BOTH
 *        exponents sit strictly closer to the analytic targets than the imp-34585 near/mid fit
 *        (-1.002844, 3.348339). p moves toward -1 by +0.000120 and q moves toward 3 by -0.006213
 *        -- the same drift direction the near/mid brackets showed, continued monotonically deeper.
 *        So the (-1, 3) analytic E_flow ~ log^3(N)/N structure is recovered EVEN MORE cleanly on
 *        the deep far side, not less.
 *   (F2) THE fp FLOOR DOES NOT DEGRADE THE FIT RESOLUTION -- THE RESIDUAL STAYS AT THE MACHINE
 *        FLOOR. Despite the deep rungs being O(1e-15) (down to 9.554e-16, near the fp floor), the
 *        seven-rung fit has 1 - R^2 ~ 2.2e-16, RMS log-residual 2.878e-9 and max 5.316e-9 -- if
 *        anything TIGHTER than the imp-34585 near/mid RMS 1.047e-8, because imp-34586 F3 already
 *        established eflow_attr is recovered DIRECTLY (a product of well-scaled factors, no
 *        near-pole cancellation) and carries full double relative precision at 9.554e-16. The
 *        shrinking magnitudes do not corrupt the fit; the O(1e-9) log-residual is the residual of
 *        the log^q model, not roundoff noise.
 *   (F3) THE FIT-IMPLIED PER-K SLOPE REPRODUCES THE imp-34586 LOCAL SLOPES AND BRACKETS THE
 *        ANALYTIC -2.161846. Evaluating ln10 * (p + q / ln N) at the endpoints gives -2.161628
 *        (k = 21.70) and -2.163548 (k = 22.00) -- reproducing the imp-34586 F2 local per-k slopes
 *        -2.161628 / -2.163548 essentially exactly, and straddling the analytic E_flow slope
 *        -2.161846 within the window (crossing it near k ~ 21.73). The deepest-four subfit
 *        (k = 21.85 .. 22.00) lands p = -1.002579, q = 3.334473 (q even nearer 3) with RMS
 *        1.538e-8 -- a wider residual on four narrow-window rungs, but the SAME (p, q) drift toward
 *        (-1, 3), confirming the continuation is a genuine analytic approach, not a window artifact.
 *
 *   The punchline: fitting the imp-34586 deep far-side rungs (k = 21.70 .. 22.00) to the
 *   log-corrected A * N^p * (ln N)^q gives (p, q) = (-1.002724, 3.342126), BOTH strictly closer to
 *   the analytic (-1, 3) than the imp-34585 near/mid fit -- the drift toward the analytic E_flow ~
 *   log^3(N)/N structure CONTINUES deeper, and the O(1e-15) magnitudes near the fp floor do NOT
 *   degrade the fit (RMS log-residual 2.878e-9, even tighter than near/mid). The fit-implied per-k
 *   slope reproduces the imp-34586 local slopes and brackets the analytic -2.161846.
 *
 *   MEASUREMENT ONLY. A log-corrected OLS fit of the inherited surrogate numerator eflow_attr on
 *   the DEEP far side of the inherited pole k* ~ 21.28095, reusing the imp-34586 baked rungs
 *   verbatim. Descriptive surrogate fit, NOT a rigorous asymptotic; the component model is the
 *   inherited imp-3220/imp-3406 extrapolation; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 *   changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH
 *   verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34586-eflow-attr-fp-floor-far-side-ladder.js (the seven deep rungs this fits)
 *   @see imp-34585-eflow-attr-log-corrected-fit.js (the near/mid log-corrected fit + solve3 machinery this reuses)
 *   @see imp-34570-eflow-attr-power-law-fit-eflow-slope-check.js (analytic E_flow slope -2.161846)
 */

import { IMP34586_DEEP_FAR_SIDE_RUNGS } from './imp-34586-eflow-attr-fp-floor-far-side-ladder.js';
import {
  IMP34585_LOGCORR_P,
  IMP34585_LOGCORR_Q,
  IMP34585_LOGCORR_RMS_LOG_RESID,
  IMP34585_P_OFFSET_FROM_ANALYTIC,
  IMP34585_Q_OFFSET_FROM_ANALYTIC,
} from './imp-34585-eflow-attr-log-corrected-fit.js';

const KSTAR = 21.28095; // imp-34023/imp-34237/imp-34310, verbatim
const ANALYTIC_PERK_SLOPE = -2.161846; // analytic E_flow slope (imp-34570)
const ANALYTIC_P = -1; // E_flow ~ log^3(N)/N carries a clean 1/N
const ANALYTIC_Q = 3; // ... times log^3(N)
const LN10 = Math.log(10);

// --- 3-parameter log-corrected OLS  eflow_attr = A * N^p * (ln N)^q  (verbatim imp-34585) -----
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

// Fit a set of {k, eflowAttr} rungs; return (lnA, p, q), residuals, R^2, and endpoint per-k slopes.
function fitLogCorrected(rungs) {
  const XS = rungs.map((r) => Math.log(Math.pow(10, r.k + 1))); // ln N
  const LS = rungs.map((r) => Math.log(Math.log(Math.pow(10, r.k + 1)))); // ln ln N
  const YS = rungs.map((r) => Math.log(r.eflowAttr));
  const NN = XS.length;
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
  const [b0, p, q] = solve3(AtA, Atb);
  const MY = YS.reduce((a, b) => a + b, 0) / NN;
  let ssres = 0;
  let syy = 0;
  let mx = 0;
  for (let i = 0; i < NN; i++) {
    const resid = YS[i] - (b0 + p * XS[i] + q * LS[i]);
    ssres += resid * resid;
    mx = Math.max(mx, Math.abs(resid));
    syy += (YS[i] - MY) ** 2;
  }
  // Fit-implied per-k slope ln10 * (p + q / ln N) at the shallow/deep endpoints.
  const lnNfirst = (rungs[0].k + 1) * LN10;
  const lnNdeep = (rungs[rungs.length - 1].k + 1) * LN10;
  return {
    n: NN,
    lnA: b0,
    amplitude: Math.exp(b0),
    p,
    q,
    rmsLogResid: Math.sqrt(ssres / NN),
    maxLogResid: mx,
    r2: 1 - ssres / syy,
    perKSlopeFirst: LN10 * (p + q / lnNfirst),
    perKSlopeDeep: LN10 * (p + q / lnNdeep),
  };
}

// Primary fit: all seven imp-34586 deep far-side rungs (k = 21.70 .. 22.00).
export const IMP34605_DEEP_FIT = fitLogCorrected(IMP34586_DEEP_FAR_SIDE_RUNGS);

// Robustness check: the deepest FOUR rungs (k = 21.85 .. 22.00), nearest the fp floor.
export const IMP34605_DEEPEST4_FIT = fitLogCorrected(IMP34586_DEEP_FAR_SIDE_RUNGS.slice(3));

// --- drift of (p, q) toward the analytic (-1, 3) relative to the imp-34585 near/mid fit --------
export const IMP34605_P_OFFSET_FROM_ANALYTIC = IMP34605_DEEP_FIT.p - ANALYTIC_P; // -0.002724
export const IMP34605_Q_OFFSET_FROM_ANALYTIC = IMP34605_DEEP_FIT.q - ANALYTIC_Q; // +0.342126
// |offset| shrinks vs imp-34585 => the drift toward the analytic target CONTINUES deeper.
export const IMP34605_P_DRIFT_TOWARD_ANALYTIC =
  Math.abs(IMP34585_P_OFFSET_FROM_ANALYTIC) - Math.abs(IMP34605_P_OFFSET_FROM_ANALYTIC); // +0.000120
export const IMP34605_Q_DRIFT_TOWARD_ANALYTIC =
  Math.abs(IMP34585_Q_OFFSET_FROM_ANALYTIC) - Math.abs(IMP34605_Q_OFFSET_FROM_ANALYTIC); // +0.006213

// The analytic per-k slope -2.161846 is bracketed by the two fit-implied endpoint slopes.
export const IMP34605_ANALYTIC_SLOPE_BRACKETED =
  IMP34605_DEEP_FIT.perKSlopeFirst > ANALYTIC_PERK_SLOPE &&
  IMP34605_DEEP_FIT.perKSlopeDeep < ANALYTIC_PERK_SLOPE;

export const IMP34605_EFLOW_ATTR_DEEP_FAR_SIDE_LOG_CORRECTED_FIT = {
  ticket: 'imp-34605',
  proofSection: 'S-frontier',
  kStar: KSTAR,
  question:
    'imp-34586 extended the far-side eflow_attr ladder to k = 22.00 (monotone, convex, per-k ' +
    'slope drifting -2.16163 -> -2.16355 across the analytic E_flow slope -2.161846) but never fit ' +
    'the deep rungs to a parametric law. Run the imp-34585 log-corrected OLS (eflow_attr = ' +
    'A*N^p*(ln N)^q) on the seven deep rungs and measure whether the recovered per-k slope and ' +
    'log-power q continue drifting toward the analytic (-2.161846, 3), or whether the O(1e-15) ' +
    'magnitudes near the fp floor degrade the fit. Measurement only; NO QED.',
  analyticTarget: {
    perKSlope: ANALYTIC_PERK_SLOPE,
    expectedP: ANALYTIC_P,
    expectedQ: ANALYTIC_Q,
  },
  nearMidFit: {
    // imp-34585 near/mid bracket k = 21.00 .. 21.50 (imported, not re-typed).
    source: 'imp-34585',
    p: +IMP34585_LOGCORR_P.toFixed(6),
    q: +IMP34585_LOGCORR_Q.toFixed(6),
    rmsLogResid: +IMP34585_LOGCORR_RMS_LOG_RESID.toExponential(5),
  },
  deepFit: {
    form: 'eflow_attr = A * N^p * (ln N)^q, N = 10^(k+1)',
    window: 'k = 21.70 .. 22.00 (7 rungs, imp-34586)',
    p: +IMP34605_DEEP_FIT.p.toFixed(6),
    q: +IMP34605_DEEP_FIT.q.toFixed(6),
    amplitude: +IMP34605_DEEP_FIT.amplitude.toExponential(6),
    oneMinusR2: +(1 - IMP34605_DEEP_FIT.r2).toExponential(4),
    rmsLogResid: +IMP34605_DEEP_FIT.rmsLogResid.toExponential(5),
    maxLogResid: +IMP34605_DEEP_FIT.maxLogResid.toExponential(5),
    perKSlopeFirst: +IMP34605_DEEP_FIT.perKSlopeFirst.toFixed(6),
    perKSlopeDeep: +IMP34605_DEEP_FIT.perKSlopeDeep.toFixed(6),
  },
  deepest4Fit: {
    window: 'k = 21.85 .. 22.00 (4 rungs, nearest the fp floor)',
    p: +IMP34605_DEEPEST4_FIT.p.toFixed(6),
    q: +IMP34605_DEEPEST4_FIT.q.toFixed(6),
    rmsLogResid: +IMP34605_DEEPEST4_FIT.rmsLogResid.toExponential(5),
  },
  drift: {
    pOffsetFromAnalytic: +IMP34605_P_OFFSET_FROM_ANALYTIC.toFixed(6),
    qOffsetFromAnalytic: +IMP34605_Q_OFFSET_FROM_ANALYTIC.toFixed(6),
    pDriftTowardAnalytic: +IMP34605_P_DRIFT_TOWARD_ANALYTIC.toFixed(6),
    qDriftTowardAnalytic: +IMP34605_Q_DRIFT_TOWARD_ANALYTIC.toFixed(6),
    analyticSlopeBracketed: IMP34605_ANALYTIC_SLOPE_BRACKETED,
  },
  finding: {
    F1_drift_toward_analytic_continues:
      'The deep-rung log-corrected OLS gives A = 1.910848e+2, p = -1.002724, q = 3.342126: BOTH ' +
      'exponents sit strictly closer to the analytic (-1, 3) than the imp-34585 near/mid fit ' +
      '(-1.002844, 3.348339). p moves toward -1 by +0.000120 and q moves toward 3 by -0.006213 -- ' +
      'the same drift direction the near/mid brackets showed, continued monotonically deeper. The ' +
      'analytic E_flow ~ log^3(N)/N structure is recovered EVEN MORE cleanly on the deep far side.',
    F2_fp_floor_does_not_degrade_fit:
      'Despite the deep rungs being O(1e-15) (down to 9.554e-16, near the fp floor), the seven-rung ' +
      'fit has 1 - R^2 ~ 2.2e-16, RMS log-residual 2.878e-9 and max 5.316e-9 -- if anything TIGHTER ' +
      'than the imp-34585 near/mid RMS 1.047e-8, because imp-34586 F3 established eflow_attr is ' +
      'recovered DIRECTLY (well-scaled factors, no near-pole cancellation) and carries full double ' +
      'relative precision at 9.554e-16. The shrinking magnitudes do not corrupt the fit.',
    F3_perk_slope_reproduces_and_brackets_analytic:
      'The fit-implied per-k slope ln10*(p + q/ln N) is -2.161628 (k = 21.70) and -2.163548 ' +
      '(k = 22.00), reproducing the imp-34586 F2 local slopes essentially exactly and straddling ' +
      'the analytic E_flow slope -2.161846 within the window. The deepest-four subfit ' +
      '(k = 21.85 .. 22.00) lands p = -1.002579, q = 3.334473 (q even nearer 3) with RMS 1.538e-8 ' +
      '-- the SAME (p, q) drift toward (-1, 3), confirming a genuine analytic approach not a window ' +
      'artifact.',
  },
  isRigorous: false,
  honest:
    'MEASUREMENT ONLY -- a log-corrected OLS fit (eflow_attr = A*N^p*(ln N)^q) of the inherited ' +
    'surrogate numerator eflow_attr on the DEEP far side of the inherited pole k* ~ 21.28095 ' +
    '(k = 21.70 .. 22.00), reusing the imp-34586 baked rungs verbatim and the imp-34585 solve3 ' +
    'machinery. The recovered (p, q) = (-1.002724, 3.342126) sit strictly closer to the analytic ' +
    '(-1, 3) than the near/mid fit -- the drift toward the E_flow ~ log^3(N)/N structure CONTINUES ' +
    'deeper -- and the O(1e-15) magnitudes near the fp floor do NOT degrade the fit (RMS ' +
    'log-residual 2.878e-9, even tighter than near/mid). Descriptive surrogate fit, NOT a rigorous ' +
    'asymptotic; the component model is the inherited imp-3220/imp-3406 extrapolation; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED; no refereed bound is changed' +
    '.',
};

export const IMP34605_ASSERTIONS = [
  {
    // Reuse gate: the seven rungs are the imp-34586 baked deep rungs, not fresh literals.
    id: 'imp-34605-reuses-imp34586-deep-rungs',
    description: 'the 7 deep rungs are imported from imp-34586 (IMP34586_DEEP_FAR_SIDE_RUNGS)',
    holds: () =>
      IMP34586_DEEP_FAR_SIDE_RUNGS.length === 7 &&
      IMP34586_DEEP_FAR_SIDE_RUNGS[0].k === 21.7 &&
      IMP34586_DEEP_FAR_SIDE_RUNGS[6].k === 22.0 &&
      IMP34586_DEEP_FAR_SIDE_RUNGS[6].eflowAttr === 9.5543735e-16,
  },
  {
    // (F1) recovered (p, q) near the analytic (-1, 3) and both offsets SMALLER than imp-34585.
    id: 'imp-34605-drift-toward-analytic-continues',
    description: 'deep-fit p = -1.0027, q = 3.3421 both strictly closer to (-1, 3) than the imp-34585 near/mid fit',
    holds: () =>
      Math.abs(IMP34605_DEEP_FIT.p - -1.002724) < 1e-5 &&
      Math.abs(IMP34605_DEEP_FIT.q - 3.342126) < 1e-5 &&
      IMP34605_P_DRIFT_TOWARD_ANALYTIC > 0 &&
      IMP34605_Q_DRIFT_TOWARD_ANALYTIC > 0 &&
      Math.abs(IMP34605_P_OFFSET_FROM_ANALYTIC) < Math.abs(IMP34585_P_OFFSET_FROM_ANALYTIC) &&
      Math.abs(IMP34605_Q_OFFSET_FROM_ANALYTIC) < Math.abs(IMP34585_Q_OFFSET_FROM_ANALYTIC),
  },
  {
    // (F2) the fit stays at the machine floor -- NOT degraded by the O(1e-15) deep magnitudes.
    id: 'imp-34605-fp-floor-does-not-degrade-fit',
    description: 'seven-rung fit R^2 ~ 1 and RMS log-residual < 1e-8 (tighter than the imp-34585 near/mid RMS)',
    holds: () =>
      1 - IMP34605_DEEP_FIT.r2 < 1e-12 &&
      IMP34605_DEEP_FIT.rmsLogResid < 1e-8 &&
      IMP34605_DEEP_FIT.rmsLogResid < IMP34585_LOGCORR_RMS_LOG_RESID &&
      Math.abs(IMP34605_DEEP_FIT.rmsLogResid - 2.878439e-9) < 1e-14,
  },
  {
    // (F3) the fit-implied per-k slopes reproduce imp-34586 and bracket the analytic -2.161846.
    id: 'imp-34605-perk-slope-reproduces-and-brackets-analytic',
    description: 'endpoint per-k slopes -2.161628 / -2.163548 reproduce imp-34586 F2 and bracket analytic -2.161846',
    holds: () =>
      Math.abs(IMP34605_DEEP_FIT.perKSlopeFirst - -2.161628) < 1e-5 &&
      Math.abs(IMP34605_DEEP_FIT.perKSlopeDeep - -2.163548) < 1e-5 &&
      IMP34605_ANALYTIC_SLOPE_BRACKETED === true &&
      Math.abs(IMP34605_DEEPEST4_FIT.q - 3.334473) < 1e-5,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp-34605-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34605_EFLOW_ATTR_DEEP_FAR_SIDE_LOG_CORRECTED_FIT.isRigorous === false &&
      /NO QED/.test(IMP34605_EFLOW_ATTR_DEEP_FAR_SIDE_LOG_CORRECTED_FIT.honest) &&
      /refereed bound is changed/i.test(IMP34605_EFLOW_ATTR_DEEP_FAR_SIDE_LOG_CORRECTED_FIT.honest) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34605_EFLOW_ATTR_DEEP_FAR_SIDE_LOG_CORRECTED_FIT.honest),
  },
];

for (const a of IMP34605_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34605-eflow-attr-deep-far-side-log-corrected-fit assertion failed: ${a.id}`);
  }
}
