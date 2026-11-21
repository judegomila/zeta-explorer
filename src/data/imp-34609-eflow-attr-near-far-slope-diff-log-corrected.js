/**
 * @module imp-34609-eflow-attr-near-far-slope-diff-log-corrected
 * @fileoverview imp-34609 -- RE-MEASURE the imp-34589 far-vs-near eflow_attr per-k slope
 *   difference (-0.001356 per k, ~5.1 combined-sigma) at the imp-34585 LOG-CORRECTED fit level,
 *   to check whether the "window-centre drift" imp-34589 attributed the difference to PERSISTS
 *   once the rising log^q(N) factor is split off the fitted N-exponent.
 *
 *   imp-34589 fit BOTH sides of the pole to a PURE power law eflow_attr = A*N^p and found the
 *   window-averaged per-k slope p*ln10 differed by -0.001356 (far -2.159985 vs near -2.158629,
 *   ~5.1 sigma), explaining it as the two overlapping windows having different centres. But
 *   imp-34585 (near) and imp-34604 (far) then showed the PURE power law is MISSPECIFIED: it
 *   aliases the analytic E_flow ~ log^3(N)/N curvature into a FRACTIONAL exponent (-0.9375/
 *   -0.9381), and the log-corrected form eflow_attr = A*N^p*(ln N)^q recovers the integer p ~ -1
 *   on both sides. So part of the imp-34589 near-vs-far slope difference may be an ARTIFACT of the
 *   single-power aliasing, with each window absorbing the log^q factor differently by centre. This
 *   module refits both sides to the log-corrected form and measures whether the leading-exponent
 *   per-k slope difference (and its sigma) shrinks once log^q is separated.
 *
 *   METHOD (import-light, verbatim imp-34585/imp-34604 machinery). The 8 NEAR rungs
 *   (IMP34406_EFLOW_ATTR_RUNGS, k = 21.0 .. 21.5) and the 7 FAR rungs (IMP34572_FAR_SIDE_RUNGS,
 *   k = 21.30 .. 21.60) are REUSED VERBATIM -- no re-derivation, no 16.7MB zeros bundle in the
 *   chain, per [[no_heavy_imports_in_pages]] / [[verify_heavy_assertion_modules]]. Each side gets a
 *   3-parameter OLS on the design [1, ln N, ln ln N] (N = 10^(k+1)) solved by the verbatim imp-34585
 *   solve3 Gauss elimination; the leading-N per-k slope is p*ln10. The OLS slope standard error is
 *   se(p) = sqrt(s^2 * (X'X)^-1_pp) with s^2 = SSRES/(n-3), (X'X)^-1 via a stable Gauss-Jordan
 *   inverse (partial pivoting) -- the cofactor form is too ill-conditioned on the near-collinear
 *   [1, ln N, ln ln N] design. The recovered (p, q) are cross-checked against the imported imp-34585
 *   near and imp-34604 far exports (reuse gate), and the pure-fit -0.001356/5.1-sigma baseline is
 *   imported verbatim from imp-34589 (IMP34589_FAR_MINUS_NEAR_SLOPE / _SIGMA).
 *
 *   FINDINGS (measurement only).
 *   ---------------------------------------------------------------------------------
 *   (F1) THE LEADING-EXPONENT SLOPE DIFFERENCE COLLAPSES ~14x AND FLIPS SIGN. At the log-corrected
 *        level the near-side leading per-k slope is p_near*ln10 = -2.309134 and the far-side is
 *        p_far*ln10 = -2.309037, a far-minus-near difference of +9.658e-5 per k -- versus the pure
 *        power-law -0.001356. The MAGNITUDE shrinks by a factor ~14.0 (0.001356 -> 9.66e-5) and the
 *        SIGN REVERSES (far becomes marginally SHALLOWER in the leading N-exponent, not steeper). So
 *        ~93% of the imp-34589 near-vs-far slope difference was an ARTIFACT of aliasing the rising
 *        log^q(N) curvature into the fractional single-power exponent: each window absorbed the log
 *        factor differently by centre, and splitting log^q off removes most of that window-centre
 *        drift in the fitted N-exponent.
 *   (F2) THE SIGMA-SIGNIFICANCE DOES NOT SHRINK -- IT RISES, BECAUSE THE FIT IS ~1000x TIGHTER. The
 *        log-corrected slope SEs are se_near = 8.368e-6 and se_far = 5.873e-6 per k (combined
 *        1.022e-5), versus the pure-fit near/far SEs 2.32e-4/1.29e-4 (combined 2.65e-4). The
 *        log-corrected fit RMS log-residual is ~1.05e-8 (near) / ~2.27e-9 (far) -- ~1000x below the
 *        pure ~8.4e-5/2.9e-5 -- so the SEs shrink FASTER than the difference does, and the residual
 *        +9.658e-5 leading-slope difference registers at ~9.45 combined-sigma (UP from 5.11). The
 *        window-centre drift's ABSOLUTE size collapses, but its statistical resolution grows.
 *   (F3) THE RESIDUAL DRIFT IS THE mild |g| CURVATURE, AND THE SIGMA IS ROUNDOFF-LIMITED. The
 *        surviving +9.66e-5 far-minus-near leading-slope difference is consistent with the imp-34585
 *        F3 / imp-34604 F3 |g| = |d ln E_flow/d ln N| = 1 - 3/ln N attractor curvature that log^3
 *        alone does not fully capture (q_near = 3.348339, q_far = 3.346178 differ by -2.16e-3), a
 *        weak genuine centre-dependence, not a kink. But at the ~1e-8/2e-9 double-precision residual
 *        floor the OLS s^2 is roundoff-limited, so the formal ~9.45 sigma is NOT a genuine
 *        surrogate-model uncertainty -- it merely reflects two point estimates 9.66e-5 apart each
 *        pinned to ~1e-5 by the machine floor. The physically meaningful statement is F1: the drift
 *        MAGNITUDE is ~93% a pure-power-law artifact and reverses sign under the log-correction.
 *
 *   The punchline: refitting both sides of the pole to eflow_attr = A*N^p*(ln N)^q collapses the
 *   imp-34589 near-vs-far leading per-k slope difference from -0.001356 to +9.66e-5 (~14x smaller,
 *   sign-reversed) -- so most of the "window-centre drift" was the single-power form aliasing the
 *   log^q curvature into the exponent. The formal sigma does NOT shrink (rises 5.11 -> ~9.45)
 *   because the log-corrected fit is ~1000x tighter, but at the double-precision residual floor that
 *   sigma is roundoff-limited; the ~9.66e-5 remnant is the mild |g| = 1 - 3/ln N attractor curvature.
 *
 *   MEASUREMENT ONLY. A pair of log-corrected OLS fits of the inherited surrogate numerator
 *   eflow_attr, reusing the imp-34406 near and imp-34572 far rungs verbatim, NOT an RH bound.
 *   Descriptive surrogate fit, NOT a rigorous asymptotic; the component model is the inherited
 *   imp-3220/imp-3406 extrapolation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no
 *   bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 *   No refereed bound is changed.
 *
 *   @see imp-34589-eflow-attr-far-side-power-law-slope-continuity.js (the PURE-fit -0.001356/5.1-sigma baseline)
 *   @see imp-34585-eflow-attr-log-corrected-fit.js (near-side log-corrected fit, (p,q)=(-1.0028,3.348))
 *   @see imp-34604-eflow-attr-far-side-log-corrected-cross-fit.js (far-side log-corrected fit, (p,q)=(-1.0028,3.346))
 *   @see imp-34406-eflow-attr-smooth-nonzero-across-pole.js (the 8 near rungs)
 *   @see imp-34572-eflow-attr-far-side-pole-smoothness.js (the 7 far rungs)
 */

import { IMP34406_EFLOW_ATTR_RUNGS } from './imp-34406-eflow-attr-smooth-nonzero-across-pole.js';
import { IMP34572_FAR_SIDE_RUNGS } from './imp-34572-eflow-attr-far-side-pole-smoothness.js';
import {
  IMP34585_LOGCORR_P,
  IMP34585_LOGCORR_Q,
} from './imp-34585-eflow-attr-log-corrected-fit.js';
import {
  IMP34604_FAR_LOGCORR_P,
  IMP34604_FAR_LOGCORR_Q,
} from './imp-34604-eflow-attr-far-side-log-corrected-cross-fit.js';
import {
  IMP34589_FAR_MINUS_NEAR_SLOPE,
  IMP34589_FAR_MINUS_NEAR_SIGMA,
} from './imp-34589-eflow-attr-far-side-power-law-slope-continuity.js';

const KSTAR = 21.28095; // imp-34023/imp-34237/imp-34310, verbatim

// --- shared machinery -----------------------------------------------------------------
// 3-parameter OLS on design [1, ln N, ln ln N]; solve normal equations via Gauss elimination
// (verbatim imp-34585/imp-34604 solve3).
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

// Stable 3x3 inverse (Gauss-Jordan, partial pivoting) for the OLS covariance (X'X)^-1.
// The near-collinear [1, ln N, ln ln N] design makes the cofactor form lose all precision on
// the far-side normal matrix (returns NaN); Gauss-Jordan with pivoting is stable here.
function inv3(A) {
  const M = A.map((row, i) => [
    row[0],
    row[1],
    row[2],
    i === 0 ? 1 : 0,
    i === 1 ? 1 : 0,
    i === 2 ? 1 : 0,
  ]);
  for (let c = 0; c < 3; c++) {
    let piv = c;
    for (let r = c + 1; r < 3; r++) {
      if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    }
    const tmp = M[c];
    M[c] = M[piv];
    M[piv] = tmp;
    const d = M[c][c];
    for (let k = 0; k < 6; k++) M[c][k] /= d;
    for (let r = 0; r < 3; r++) {
      if (r !== c) {
        const f = M[r][c];
        for (let k = 0; k < 6; k++) M[r][k] -= f * M[c][k];
      }
    }
  }
  return M.map((row) => [row[3], row[4], row[5]]);
}

// Log-corrected fit of one rung ladder: returns leading N-exponent p, log-power q, its per-k
// leading slope p*ln10, the OLS slope SE in per-k units, and the RMS log-residual.
function logCorrectedFit(rungs) {
  const XS = rungs.map((r) => Math.log(Math.pow(10, r.k + 1))); // ln N
  const LS = rungs.map((r) => Math.log(Math.log(Math.pow(10, r.k + 1)))); // ln ln N
  const YS = rungs.map((r) => Math.log(r.eflowAttr)); // ln eflow_attr
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
  let ssres = 0;
  for (let i = 0; i < NN; i++) {
    const resid = YS[i] - (b0 + p * XS[i] + q * LS[i]);
    ssres += resid * resid;
  }
  const s2 = ssres / (NN - 3); // residual variance, 3 fitted params
  const inv = inv3(AtA);
  const seP = Math.sqrt(s2 * inv[1][1]); // SE of the ln-N coefficient (index 1)
  return {
    p,
    q,
    perKSlope: p * Math.LN10,
    perKSlopeSE: seP * Math.LN10,
    rmsLogResid: Math.sqrt(ssres / NN),
    n: NN,
  };
}

// --- log-corrected refits of both sides -----------------------------------------------
const NEAR = logCorrectedFit(IMP34406_EFLOW_ATTR_RUNGS); // 8 rungs, k = 21.0 .. 21.5
const FAR = logCorrectedFit(IMP34572_FAR_SIDE_RUNGS); // 7 rungs, k = 21.30 .. 21.60

export const IMP34609_NEAR_LOGCORR_P = NEAR.p; // -1.002844 (matches imp-34585)
export const IMP34609_FAR_LOGCORR_P = FAR.p; // -1.002802 (matches imp-34604)
export const IMP34609_NEAR_LEADING_PER_K_SLOPE = NEAR.perKSlope; // -2.309134
export const IMP34609_FAR_LEADING_PER_K_SLOPE = FAR.perKSlope; // -2.309037
export const IMP34609_NEAR_LEADING_SLOPE_SE = NEAR.perKSlopeSE; // 8.368e-6 per k
export const IMP34609_FAR_LEADING_SLOPE_SE = FAR.perKSlopeSE; // 5.873e-6 per k
export const IMP34609_NEAR_RMS_LOG_RESID = NEAR.rmsLogResid; // 1.047e-8
export const IMP34609_FAR_RMS_LOG_RESID = FAR.rmsLogResid; // 2.266e-9

// --- (F1) leading-exponent per-k slope difference (log-corrected) ---------------------
export const IMP34609_LOGCORR_FAR_MINUS_NEAR_SLOPE =
  FAR.perKSlope - NEAR.perKSlope; // +9.658e-5 (vs pure -0.001356)
export const IMP34609_MAGNITUDE_SHRINK_FACTOR =
  Math.abs(IMP34589_FAR_MINUS_NEAR_SLOPE) /
  Math.abs(IMP34609_LOGCORR_FAR_MINUS_NEAR_SLOPE); // ~14.0x
// sign flip: pure far-minus-near is negative (far steeper), log-corrected is positive (far shallower)
export const IMP34609_SIGN_REVERSED =
  Math.sign(IMP34609_LOGCORR_FAR_MINUS_NEAR_SLOPE) !==
  Math.sign(IMP34589_FAR_MINUS_NEAR_SLOPE); // true

// --- (F2) combined-sigma of the log-corrected leading-slope difference ----------------
const COMBINED_SE = Math.sqrt(
  IMP34609_NEAR_LEADING_SLOPE_SE ** 2 + IMP34609_FAR_LEADING_SLOPE_SE ** 2,
); // 1.022e-5 per k
export const IMP34609_LOGCORR_FAR_MINUS_NEAR_SIGMA =
  Math.abs(IMP34609_LOGCORR_FAR_MINUS_NEAR_SLOPE) / COMBINED_SE; // ~9.45 sigma
export const IMP34609_SIGMA_RATIO =
  IMP34609_LOGCORR_FAR_MINUS_NEAR_SIGMA / IMP34589_FAR_MINUS_NEAR_SIGMA; // ~1.85x (RISES)

// --- (F3) residual log-power difference (the mild |g| curvature remnant) --------------
export const IMP34609_Q_DIFF_FAR_MINUS_NEAR =
  IMP34604_FAR_LOGCORR_Q - IMP34585_LOGCORR_Q; // -2.16e-3

export const IMP34609_EFLOW_ATTR_NEAR_FAR_SLOPE_DIFF_LOG_CORRECTED = {
  ticket: 'imp-34609',
  proofSection: 'S-frontier',
  kStar: KSTAR,
  question:
    'imp-34589 measured a -0.001356 per-k (~5.1 combined-sigma) difference between the near-side ' +
    '(-2.158629) and far-side (-2.159985) eflow_attr per-k slopes from PURE power-law fits, ' +
    'attributing it to the two windows having different centres. But imp-34585/imp-34604 showed the ' +
    'pure power law aliases the log^3(N) curvature into a fractional exponent. Refit BOTH sides to ' +
    'the log-corrected A*N^p*(ln N)^q and measure whether the near-vs-far leading per-k slope ' +
    'difference and its sigma shrink once log^q is split off. Measurement only; NO QED.',
  pureBaseline: {
    farMinusNearSlope: +IMP34589_FAR_MINUS_NEAR_SLOPE.toFixed(6), // -0.001356
    farMinusNearSigma: +IMP34589_FAR_MINUS_NEAR_SIGMA.toFixed(2), // 5.11
    source: 'imp-34589 (pure power-law fits)',
  },
  logCorrectedFits: {
    near: {
      exponentP: +NEAR.p.toFixed(6),
      leadingPerKSlope: +NEAR.perKSlope.toFixed(6),
      leadingSlopeSE: +NEAR.perKSlopeSE.toExponential(4),
      rmsLogResid: +NEAR.rmsLogResid.toExponential(4),
      rungs: NEAR.n,
    },
    far: {
      exponentP: +FAR.p.toFixed(6),
      leadingPerKSlope: +FAR.perKSlope.toFixed(6),
      leadingSlopeSE: +FAR.perKSlopeSE.toExponential(4),
      rmsLogResid: +FAR.rmsLogResid.toExponential(4),
      rungs: FAR.n,
    },
  },
  logCorrectedFarMinusNearSlope: +IMP34609_LOGCORR_FAR_MINUS_NEAR_SLOPE.toExponential(4), // +9.658e-5
  magnitudeShrinkFactor: +IMP34609_MAGNITUDE_SHRINK_FACTOR.toFixed(2), // 14.04
  signReversed: IMP34609_SIGN_REVERSED, // true
  logCorrectedFarMinusNearSigma: +IMP34609_LOGCORR_FAR_MINUS_NEAR_SIGMA.toFixed(2), // 9.45
  sigmaRatio: +IMP34609_SIGMA_RATIO.toFixed(2), // 1.85
  qDiffFarMinusNear: +IMP34609_Q_DIFF_FAR_MINUS_NEAR.toExponential(4), // -2.16e-3
  finding: {
    F1_leading_slope_difference_collapses_14x_and_flips_sign:
      'The log-corrected near-side leading per-k slope is p_near*ln10 = -2.309134 and the far-side ' +
      'is p_far*ln10 = -2.309037, a far-minus-near difference of +9.658e-5 per k -- versus the pure ' +
      'power-law -0.001356. The magnitude shrinks ~14.0x and the SIGN REVERSES (far becomes ' +
      'marginally shallower, not steeper). So ~93% of the imp-34589 near-vs-far slope difference was ' +
      'an artifact of aliasing the rising log^q(N) curvature into the fractional single-power ' +
      'exponent; splitting log^q off removes most of the window-centre drift in the fitted exponent.',
    F2_sigma_rises_because_fit_is_1000x_tighter:
      'The log-corrected slope SEs are 8.368e-6 (near) / 5.873e-6 (far) per k (combined 1.022e-5), ' +
      'versus the pure-fit 2.32e-4/1.29e-4 (combined 2.65e-4). The log-corrected RMS log-residual is ' +
      '~1.05e-8 (near) / ~2.27e-9 (far), ~1000x below the pure ~8.4e-5/2.9e-5, so the SEs shrink ' +
      'faster than the difference and the +9.658e-5 remnant registers at ~9.45 combined-sigma (UP ' +
      'from 5.11). The drift ABSOLUTE size collapses, but its statistical resolution grows.',
    F3_remnant_is_mild_g_curvature_and_sigma_is_roundoff_limited:
      'The surviving +9.66e-5 far-minus-near leading-slope difference is consistent with the ' +
      'imp-34585/imp-34604 |g| = 1 - 3/ln N attractor curvature that log^3 alone does not fully ' +
      'capture (q_near = 3.348339, q_far = 3.346178, differing by -2.16e-3), a weak genuine ' +
      'centre-dependence not a kink. But at the ~1e-8/2e-9 double-precision residual floor the OLS ' +
      's^2 is roundoff-limited, so the formal ~9.45 sigma is not a genuine surrogate-model ' +
      'uncertainty -- the physically meaningful result is F1: the drift magnitude is ~93% a ' +
      'pure-power-law artifact and reverses sign under the log-correction.',
  },
  isRigorous: false,
  honest:
    'MEASUREMENT ONLY -- a pair of log-corrected OLS fits (eflow_attr = A*N^p*(ln N)^q) of the ' +
    'inherited surrogate numerator eflow_attr, reusing the imp-34406 near and imp-34572 far rungs ' +
    'verbatim, re-measuring the imp-34589 near-vs-far per-k slope difference at the log-corrected ' +
    'level. The leading-exponent difference collapses from -0.001356 to +9.66e-5 (~14x smaller, ' +
    'sign-reversed) -- so ~93% of the window-centre drift was a pure-power-law aliasing artifact; ' +
    'the formal sigma RISES 5.11 -> ~9.45 (the fit is ~1000x tighter) but is roundoff-limited at the ' +
    'double-precision residual floor, and the ~9.66e-5 remnant is the mild |g| = 1 - 3/ln N ' +
    'attractor curvature. Descriptive surrogate fit, NOT a rigorous asymptotic; the component model ' +
    'is the inherited imp-3220/imp-3406 extrapolation; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED; no refereed bound is changed.',
};

export const IMP34609_ASSERTIONS = [
  {
    // Reuse gate: near/far rungs are the imp-34406/imp-34572 baked rungs, not fresh literals.
    id: 'imp-34609-reuses-near-and-far-rungs',
    description: 'the 8 near rungs are imp-34406 and the 7 far rungs are imp-34572 (imported verbatim)',
    holds: () =>
      IMP34406_EFLOW_ATTR_RUNGS.length === 8 &&
      IMP34572_FAR_SIDE_RUNGS.length === 7 &&
      IMP34406_EFLOW_ATTR_RUNGS[0].eflowAttr === 8.28715423e-15 &&
      IMP34572_FAR_SIDE_RUNGS[6].eflowAttr === 2.26896059e-15,
  },
  {
    // Cross-check gate: the recomputed log-corrected p on both sides matches imp-34585/imp-34604.
    id: 'imp-34609-recovers-imp34585-imp34604-exponents',
    description: 'recomputed near/far log-corrected p match imported imp-34585/imp-34604 to < 1e-9',
    holds: () =>
      Math.abs(IMP34609_NEAR_LOGCORR_P - IMP34585_LOGCORR_P) < 1e-9 &&
      Math.abs(IMP34609_FAR_LOGCORR_P - IMP34604_FAR_LOGCORR_P) < 1e-9,
  },
  {
    // (F1) leading-slope difference collapses > 10x and reverses sign vs the imp-34589 pure fit.
    id: 'imp-34609-leading-slope-diff-collapses-and-flips',
    description: 'log-corrected far-minus-near leading per-k slope +9.66e-5 shrinks the pure -0.001356 by >10x and flips sign',
    holds: () =>
      Math.abs(IMP34609_LOGCORR_FAR_MINUS_NEAR_SLOPE - 9.658e-5) < 1e-7 &&
      IMP34609_MAGNITUDE_SHRINK_FACTOR > 10 &&
      IMP34609_SIGN_REVERSED === true,
  },
  {
    // (F2) the sigma does NOT shrink -- it rises, because the log-corrected fit is ~1000x tighter.
    id: 'imp-34609-sigma-rises-not-shrinks',
    description: 'log-corrected combined-sigma ~9.45 exceeds the imp-34589 pure ~5.11 (SEs shrink faster than the difference)',
    holds: () =>
      Math.abs(IMP34609_LOGCORR_FAR_MINUS_NEAR_SIGMA - 9.45) < 0.5 &&
      IMP34609_LOGCORR_FAR_MINUS_NEAR_SIGMA > IMP34589_FAR_MINUS_NEAR_SIGMA &&
      IMP34609_SIGMA_RATIO > 1 &&
      IMP34609_NEAR_RMS_LOG_RESID < 1e-6 &&
      IMP34609_FAR_RMS_LOG_RESID < 1e-6,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp-34609-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34609_EFLOW_ATTR_NEAR_FAR_SLOPE_DIFF_LOG_CORRECTED.isRigorous === false &&
      /NO QED/.test(IMP34609_EFLOW_ATTR_NEAR_FAR_SLOPE_DIFF_LOG_CORRECTED.honest) &&
      /refereed bound is changed/i.test(IMP34609_EFLOW_ATTR_NEAR_FAR_SLOPE_DIFF_LOG_CORRECTED.honest),
  },
];

for (const a of IMP34609_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34609-eflow-attr-near-far-slope-diff-log-corrected assertion failed: ${a.id}`);
  }
}
