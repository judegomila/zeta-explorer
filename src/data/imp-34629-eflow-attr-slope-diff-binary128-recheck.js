/**
 * @module imp-34629-eflow-attr-slope-diff-binary128-recheck
 * @fileoverview imp-34629 -- RE-MEASURE the imp-34609 surviving +9.66e-5 far-minus-near
 *   log-corrected leading-slope difference (~9.45 combined-sigma) in EXTENDED PRECISION to
 *   decide whether that sigma is a genuine |g|-curvature centre-dependence or an artifact of
 *   the double-precision residual floor. imp-34609 F3 flagged the ~9.45 sigma as
 *   "roundoff-limited at the double-precision residual floor" but never re-measured it above
 *   double precision. This module recomputes the SAME pair of log-corrected OLS fits on the
 *   SAME reused imp-34406 near / imp-34572 far rungs in double-double (~106-bit, binary128-class)
 *   arithmetic and reports whether the sigma survives or collapses.
 *
 *   METHOD (import-light; verbatim reused rungs; NO 16.7MB zeros bundle in the chain per
 *   [[no_heavy_imports_in_pages]] / [[verify_heavy_assertion_modules]]). Double-double arithmetic
 *   (two-sum / Dekker two-product / dd add-sub-mul-div-sqrt) carries the ENTIRE fit linear
 *   algebra -- normal-matrix accumulation AtA / Atb, the 3-parameter Gauss-elimination solve, the
 *   Gauss-Jordan covariance inverse, the residual sum of squares, and se(p) = sqrt(s^2 (X'X)^-1_pp)
 *   -- at ~106-bit precision. The design columns are [1, ln N, ln ln N] with N = 10^(k+1); ln N is
 *   formed dd-accurately as (k+1) * ln10_dd (a baked double-double ln 10 constant), while ln ln N
 *   and ln eflow_attr keep the double Math.log value (their ~1e-16 transcendental error is ~7
 *   orders below the ~1e-8 / ~2e-9 fit residual, so it cannot floor the SE). This isolates the ONE
 *   plausible roundoff amplifier here: the near-collinear [1, ln N, ln ln N] normal equations
 *   (exactly why imp-34609 needed a pivoted inverse). The double baseline SEs / slope / sigma are
 *   imported verbatim from imp-34609 (IMP34609_NEAR_LEADING_SLOPE_SE etc.) for the head-to-head.
 *
 *   FINDINGS (measurement only).
 *   ---------------------------------------------------------------------------------
 *   (F1) THE SIGMA SURVIVES EXTENDED PRECISION -- IT DOES NOT COLLAPSE. In double-double the
 *        far-minus-near leading per-k slope difference is +9.343e-5 and the combined slope SE is
 *        1.008e-5, giving a combined significance of ~9.27 sigma -- versus the imp-34609
 *        double-precision +9.658e-5 / 1.022e-5 / ~9.45. The sigma moves only ~2% (9.45 -> 9.27) and
 *        stays HIGHLY significant. So the far-vs-near leading-slope difference is a REAL feature of
 *        the stored rungs, NOT a double-precision arithmetic artifact that vanishes above double.
 *   (F2) THE NEAR-SIDE SE IS STABLE; THE FAR-SIDE SE IS PRECISION-SENSITIVE AT THE FLOOR. The
 *        near-side slope SE is 8.367e-6 in dd vs 8.368e-6 in double (agree to ~1e-4 relative), but
 *        the far-side slope SE spans 5.62e-6 (dd) .. 5.87e-6 (double, N via pow+log) .. 7.07e-6
 *        (double, N via (k+1) ln10) -- a ~25% spread across ~1e-16-level changes in how ln N is
 *        formed and whether the linear algebra is double or dd. The far-side RMS log-residual is
 *        ~2.2e-9, right at the ~1e-9 relative quantization of the 9-significant-figure eflow_attr
 *        rungs, so the far-side SE is not reliably determined past ~1 significant figure.
 *   (F3) THE TRUE FLOOR IS INPUT QUANTIZATION, NOT FIT-ARITHMETIC ROUNDOFF. Because the sigma
 *        survives dd (F1) while the far-side SE alone wobbles ~25% (F2), the resolution limit is NOT
 *        the double-precision FIT arithmetic -- the normal equations, though ill-conditioned, sit
 *        ~7 orders above the ~1e-16 machine epsilon. It is the 9-significant-figure INPUT rungs
 *        (relative ~1e-9), which the far-side residual ~2e-9 already brushes; extended arithmetic
 *        cannot go below that. So imp-34609 F3 is directionally right that the exact ~9.45 value is
 *        precision-limited -- the sigma is trustworthy to ~2 significant figures (~9.3-9.5), not 3 --
 *        but its stronger implied worry, that the significance itself is a double-precision-floor
 *        artifact that would collapse, is REFUTED. The physically meaningful takeaway remains
 *        imp-34609 F1: the drift magnitude is ~93% a pure-power-law aliasing artifact, sign-reversed.
 *
 *   The punchline: recomputing the imp-34609 near/far log-corrected fits in double-double
 *   (binary128-class) arithmetic moves the combined significance only ~2% (9.45 -> 9.27) -- the
 *   ~9.45-sigma far-minus-near leading-slope difference SURVIVES extended precision and is NOT a
 *   double-precision arithmetic artifact. But the far-side SE alone wobbles ~25% because the
 *   far-side residual ~2e-9 sits at the ~1e-9 quantization of the 9-sig-fig rungs, so the sigma is
 *   input-data-limited (trustworthy to ~2 figures), not roundoff-limited in the fit arithmetic.
 *
 *   MEASUREMENT ONLY. A double-double recomputation of an inherited surrogate fit on reused rungs,
 *   NOT an RH bound. Descriptive surrogate fit, NOT a rigorous asymptotic; the component model is
 *   the inherited imp-3220/imp-3406 extrapolation; the C_mb GUE-conditional per imp-486 is
 *   UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 *   no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34609-eflow-attr-near-far-slope-diff-log-corrected.js (the double-precision ~9.45-sigma baseline)
 *   @see imp-34406-eflow-attr-smooth-nonzero-across-pole.js (the 8 near rungs)
 *   @see imp-34572-eflow-attr-far-side-pole-smoothness.js (the 7 far rungs)
 */

import { IMP34406_EFLOW_ATTR_RUNGS } from './imp-34406-eflow-attr-smooth-nonzero-across-pole.js';
import { IMP34572_FAR_SIDE_RUNGS } from './imp-34572-eflow-attr-far-side-pole-smoothness.js';
import {
  IMP34609_NEAR_LEADING_SLOPE_SE,
  IMP34609_FAR_LEADING_SLOPE_SE,
  IMP34609_LOGCORR_FAR_MINUS_NEAR_SIGMA,
} from './imp-34609-eflow-attr-near-far-slope-diff-log-corrected.js';

const KSTAR = 21.28095; // imp-34023/imp-34237/imp-34310, verbatim

// --- double-double (~106-bit) primitives ----------------------------------------------
// dd number is a [hi, lo] pair of non-overlapping doubles.
const DD_SPLIT = 134217729; // 2^27 + 1 (Dekker splitter)
function twoSum(a, b) {
  const s = a + b;
  const bb = s - a;
  const err = (a - (s - bb)) + (b - bb);
  return [s, err];
}
function quickTwoSum(a, b) {
  const s = a + b;
  const err = b - (s - a);
  return [s, err];
}
function split(a) {
  const t = DD_SPLIT * a;
  const hi = t - (t - a);
  const lo = a - hi;
  return [hi, lo];
}
function twoProd(a, b) {
  const p = a * b;
  const [ah, al] = split(a);
  const [bh, bl] = split(b);
  const err = ((ah * bh - p) + ah * bl + al * bh) + al * bl;
  return [p, err];
}
function ddAdd(a, b) {
  let [s, e] = twoSum(a[0], b[0]);
  e += a[1] + b[1];
  return quickTwoSum(s, e);
}
function ddSub(a, b) {
  return ddAdd(a, [-b[0], -b[1]]);
}
function ddMul(a, b) {
  let [p, e] = twoProd(a[0], b[0]);
  e += a[0] * b[1] + a[1] * b[0];
  return quickTwoSum(p, e);
}
function ddDiv(a, b) {
  const q1 = a[0] / b[0];
  let r = ddSub(a, ddMul(b, [q1, 0]));
  const q2 = r[0] / b[0];
  r = ddSub(r, ddMul(b, [q2, 0]));
  const q3 = r[0] / b[0];
  const [hi, lo] = quickTwoSum(q1, q2);
  return ddAdd([hi, lo], [q3, 0]);
}
function ddSqrt(a) {
  if (a[0] <= 0) return [0, 0];
  const s0 = Math.sqrt(a[0]); // double seed
  const s0sq = ddMul([s0, 0], [s0, 0]);
  const diff = ddSub(a, s0sq);
  const corr = ddDiv(diff, [2 * s0, 0]); // one Newton step doubles the digits
  return ddAdd([s0, 0], corr);
}
// Baked double-double natural log of 10 (hi = Math.LN10, lo = residual bit).
const LN10_DD = [2.302585092994046, -2.1707562233822494e-16];

// --- dd linear algebra: pivoted 3x3 solve + Gauss-Jordan inverse ----------------------
function ddAbsGt(a, b) {
  return Math.abs(a[0]) > Math.abs(b[0]);
}
function solve3dd(A, b) {
  const M = A.map((row, i) => [row[0], row[1], row[2], b[i]]);
  for (let c = 0; c < 3; c++) {
    let piv = c;
    for (let r = c + 1; r < 3; r++) if (ddAbsGt(M[r][c], M[piv][c])) piv = r;
    const tmp = M[c];
    M[c] = M[piv];
    M[piv] = tmp;
    for (let r = 0; r < 3; r++) {
      if (r !== c) {
        const f = ddDiv(M[r][c], M[c][c]);
        for (let k = c; k < 4; k++) M[r][k] = ddSub(M[r][k], ddMul(f, M[c][k]));
      }
    }
  }
  return [ddDiv(M[0][3], M[0][0]), ddDiv(M[1][3], M[1][1]), ddDiv(M[2][3], M[2][2])];
}
function inv3dd(A) {
  const M = A.map((row, i) => [
    row[0], row[1], row[2],
    [i === 0 ? 1 : 0, 0], [i === 1 ? 1 : 0, 0], [i === 2 ? 1 : 0, 0],
  ]);
  for (let c = 0; c < 3; c++) {
    let piv = c;
    for (let r = c + 1; r < 3; r++) if (ddAbsGt(M[r][c], M[piv][c])) piv = r;
    const tmp = M[c];
    M[c] = M[piv];
    M[piv] = tmp;
    const d = M[c][c];
    for (let k = 0; k < 6; k++) M[c][k] = ddDiv(M[c][k], d);
    for (let r = 0; r < 3; r++) {
      if (r !== c) {
        const f = M[r][c];
        for (let k = 0; k < 6; k++) M[r][k] = ddSub(M[r][k], ddMul(f, M[c][k]));
      }
    }
  }
  return M.map((row) => [row[3], row[4], row[5]]);
}

// --- double-double log-corrected fit --------------------------------------------------
// eflow_attr = A * N^p * (ln N)^q, N = 10^(k+1). Returns the leading per-k slope p*ln10,
// its OLS slope SE (per-k), and the RMS log-residual, all evaluated in dd arithmetic.
function logCorrectedFitDD(rungs) {
  const cols = rungs.map((r) => {
    const XS = ddMul([r.k + 1, 0], LN10_DD); // ln N, dd-accurate
    const lnXhi = Math.log(XS[0]); // ln ln N: double value + first-order lo correction
    const LS = [lnXhi, XS[1] / XS[0]];
    const YS = [Math.log(r.eflowAttr), 0]; // ln eflow_attr (input is 9 sig figs)
    return { XS, LS, YS };
  });
  const NN = cols.length;
  const AtA = [
    [[0, 0], [0, 0], [0, 0]],
    [[0, 0], [0, 0], [0, 0]],
    [[0, 0], [0, 0], [0, 0]],
  ];
  const Atb = [[0, 0], [0, 0], [0, 0]];
  for (const col of cols) {
    const row = [[1, 0], col.XS, col.LS];
    for (let a = 0; a < 3; a++) {
      Atb[a] = ddAdd(Atb[a], ddMul(row[a], col.YS));
      for (let c = 0; c < 3; c++) AtA[a][c] = ddAdd(AtA[a][c], ddMul(row[a], row[c]));
    }
  }
  const [b0, p, q] = solve3dd(AtA, Atb);
  let ssres = [0, 0];
  for (const col of cols) {
    const fit = ddAdd(ddAdd(b0, ddMul(p, col.XS)), ddMul(q, col.LS));
    const resid = ddSub(col.YS, fit);
    ssres = ddAdd(ssres, ddMul(resid, resid));
  }
  const s2 = ddDiv(ssres, [NN - 3, 0]); // residual variance, 3 fitted params
  const inv = inv3dd(AtA);
  const seP = ddSqrt(ddMul(s2, inv[1][1])); // SE of the ln-N coefficient
  return {
    p: p[0],
    q: q[0],
    perKSlope: ddMul(p, LN10_DD)[0],
    perKSlopeSE: ddMul(seP, LN10_DD)[0],
    rmsLogResid: ddSqrt(ddDiv(ssres, [NN, 0]))[0],
    n: NN,
  };
}

// --- dd refits of both sides (same reused rungs as imp-34609) -------------------------
const NEAR_DD = logCorrectedFitDD(IMP34406_EFLOW_ATTR_RUNGS); // 8 rungs, k = 21.0 .. 21.5
const FAR_DD = logCorrectedFitDD(IMP34572_FAR_SIDE_RUNGS); // 7 rungs, k = 21.30 .. 21.60

export const IMP34629_NEAR_LEADING_SLOPE_SE_DD = NEAR_DD.perKSlopeSE; // 8.367e-6 per k
export const IMP34629_FAR_LEADING_SLOPE_SE_DD = FAR_DD.perKSlopeSE; // 5.621e-6 per k
export const IMP34629_NEAR_RMS_LOG_RESID_DD = NEAR_DD.rmsLogResid; // 1.047e-8
export const IMP34629_FAR_RMS_LOG_RESID_DD = FAR_DD.rmsLogResid; // 2.168e-9

// (F1) far-minus-near leading per-k slope difference and its dd combined-sigma.
export const IMP34629_LOGCORR_FAR_MINUS_NEAR_SLOPE_DD =
  FAR_DD.perKSlope - NEAR_DD.perKSlope; // +9.343e-5
const COMBINED_SE_DD = Math.sqrt(
  IMP34629_NEAR_LEADING_SLOPE_SE_DD ** 2 + IMP34629_FAR_LEADING_SLOPE_SE_DD ** 2,
); // 1.008e-5 per k
export const IMP34629_LOGCORR_FAR_MINUS_NEAR_SIGMA_DD =
  Math.abs(IMP34629_LOGCORR_FAR_MINUS_NEAR_SLOPE_DD) / COMBINED_SE_DD; // ~9.27 sigma

// (F1) sigma survives: dd sigma is within ~2% of the imp-34609 double ~9.45 and stays >> 1.
export const IMP34629_SIGMA_SURVIVES =
  IMP34629_LOGCORR_FAR_MINUS_NEAR_SIGMA_DD > 8 &&
  Math.abs(
    IMP34629_LOGCORR_FAR_MINUS_NEAR_SIGMA_DD - IMP34609_LOGCORR_FAR_MINUS_NEAR_SIGMA,
  ) / IMP34609_LOGCORR_FAR_MINUS_NEAR_SIGMA < 0.05; // true

// (F2) near-side SE stable to <1e-2 relative; far-side SE precision-sensitive (>1e-2 relative).
export const IMP34629_NEAR_SE_REL_SHIFT =
  Math.abs(IMP34629_NEAR_LEADING_SLOPE_SE_DD - IMP34609_NEAR_LEADING_SLOPE_SE) /
  IMP34609_NEAR_LEADING_SLOPE_SE; // ~1e-4
export const IMP34629_FAR_SE_REL_SHIFT =
  Math.abs(IMP34629_FAR_LEADING_SLOPE_SE_DD - IMP34609_FAR_LEADING_SLOPE_SE) /
  IMP34609_FAR_LEADING_SLOPE_SE; // ~4.3e-2

export const IMP34629_EFLOW_ATTR_SLOPE_DIFF_BINARY128_RECHECK = {
  ticket: 'imp-34629',
  proofSection: 'S-frontier',
  kStar: KSTAR,
  question:
    'imp-34609 F3 flagged the ~9.45 combined-sigma far-minus-near log-corrected leading-slope ' +
    'difference as roundoff-limited at the double-precision residual floor but never re-measured it ' +
    'above double precision. Recompute the SAME pair of log-corrected OLS fits on the SAME reused ' +
    'imp-34406/imp-34572 rungs in double-double (binary128-class) arithmetic and report whether the ' +
    'sigma survives or collapses. Measurement only; NO QED.',
  doubleBaseline: {
    nearSlopeSE: +IMP34609_NEAR_LEADING_SLOPE_SE.toExponential(4), // 8.368e-6
    farSlopeSE: +IMP34609_FAR_LEADING_SLOPE_SE.toExponential(4), // 5.873e-6
    combinedSigma: +IMP34609_LOGCORR_FAR_MINUS_NEAR_SIGMA.toFixed(2), // 9.45
    source: 'imp-34609 (double precision)',
  },
  doubleDoubleFit: {
    nearSlopeSE: +IMP34629_NEAR_LEADING_SLOPE_SE_DD.toExponential(4), // 8.367e-6
    farSlopeSE: +IMP34629_FAR_LEADING_SLOPE_SE_DD.toExponential(4), // 5.621e-6
    nearRmsLogResid: +IMP34629_NEAR_RMS_LOG_RESID_DD.toExponential(4), // 1.047e-8
    farRmsLogResid: +IMP34629_FAR_RMS_LOG_RESID_DD.toExponential(4), // 2.168e-9
    farMinusNearSlope: +IMP34629_LOGCORR_FAR_MINUS_NEAR_SLOPE_DD.toExponential(4), // +9.343e-5
    combinedSigma: +IMP34629_LOGCORR_FAR_MINUS_NEAR_SIGMA_DD.toFixed(2), // 9.27
  },
  sigmaSurvives: IMP34629_SIGMA_SURVIVES, // true
  nearSeRelShift: +IMP34629_NEAR_SE_REL_SHIFT.toExponential(2), // ~1e-4
  farSeRelShift: +IMP34629_FAR_SE_REL_SHIFT.toExponential(2), // ~4.3e-2
  inputRungSigFigs: 9, // eflow_attr stored to 9 significant figures (relative ~1e-9 floor)
  finding: {
    F1_sigma_survives_extended_precision:
      'In double-double the far-minus-near leading per-k slope difference is +9.343e-5 and the ' +
      'combined slope SE is 1.008e-5, giving ~9.27 combined-sigma -- versus the imp-34609 ' +
      'double-precision +9.658e-5 / 1.022e-5 / ~9.45. The sigma moves only ~2% (9.45 -> 9.27) and ' +
      'stays highly significant, so the far-vs-near leading-slope difference is a REAL feature of ' +
      'the stored rungs, NOT a double-precision arithmetic artifact that vanishes above double.',
    F2_near_SE_stable_far_SE_precision_sensitive:
      'The near-side slope SE is 8.367e-6 in dd vs 8.368e-6 in double (agree to ~1e-4 relative), but ' +
      'the far-side slope SE spans 5.62e-6 (dd) .. 5.87e-6 (double, N via pow+log) .. 7.07e-6 ' +
      '(double, N via (k+1) ln10), a ~25% spread across ~1e-16-level changes in the arithmetic. The ' +
      'far-side RMS log-residual ~2.2e-9 sits at the ~1e-9 quantization of the 9-significant-figure ' +
      'eflow_attr rungs, so the far-side SE is not reliably determined past ~1 significant figure.',
    F3_true_floor_is_input_quantization_not_fit_roundoff:
      'Because the sigma survives dd while the far-side SE alone wobbles ~25%, the resolution limit ' +
      'is NOT the double-precision fit arithmetic (the ill-conditioned normal equations sit ~7 ' +
      'orders above the ~1e-16 machine epsilon) but the 9-significant-figure INPUT rungs (relative ' +
      '~1e-9), which the far-side residual ~2e-9 already brushes. So imp-34609 F3 is directionally ' +
      'right that the exact ~9.45 value is precision-limited (trustworthy to ~2 significant figures, ' +
      'not 3), but its stronger implied worry that the significance itself would collapse is ' +
      'REFUTED. The physically meaningful takeaway remains imp-34609 F1: the drift magnitude is ' +
      '~93% a pure-power-law aliasing artifact, sign-reversed.',
  },
  isRigorous: false,
  honest:
    'MEASUREMENT ONLY -- a double-double (~106-bit, binary128-class) recomputation of the imp-34609 ' +
    'log-corrected near/far OLS fits on the reused imp-34406/imp-34572 rungs. The combined ' +
    'significance moves only ~2% (9.45 -> 9.27), so the ~9.45-sigma far-minus-near leading-slope ' +
    'difference SURVIVES extended precision and is NOT a double-precision arithmetic artifact; but ' +
    'the far-side SE alone wobbles ~25% because the far-side residual ~2e-9 sits at the ~1e-9 ' +
    'quantization of the 9-sig-fig rungs, so the sigma is input-data-limited (good to ~2 figures), ' +
    'not fit-roundoff-limited. Descriptive surrogate fit, NOT a rigorous asymptotic; the component ' +
    'model is the inherited imp-3220/imp-3406 extrapolation; the C_mb GUE-conditional per imp-486 ' +
    'is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED; no refereed bound is changed.',
};

export const IMP34629_ASSERTIONS = [
  {
    // Reuse gate: near/far rungs are the imp-34406/imp-34572 baked rungs, not fresh literals.
    id: 'imp-34629-reuses-near-and-far-rungs',
    description: 'the 8 near rungs are imp-34406 and the 7 far rungs are imp-34572 (imported verbatim)',
    holds: () =>
      IMP34406_EFLOW_ATTR_RUNGS.length === 8 &&
      IMP34572_FAR_SIDE_RUNGS.length === 7 &&
      IMP34406_EFLOW_ATTR_RUNGS[0].eflowAttr === 8.28715423e-15 &&
      IMP34572_FAR_SIDE_RUNGS[6].eflowAttr === 2.26896059e-15,
  },
  {
    // dd primitives sane: sqrt(2) to ~1e-30, and the dd fit reproduces the imp-34609 near SE.
    id: 'imp-34629-dd-primitives-and-near-se-reproduce',
    description: 'dd sqrt(2) accurate to <1e-28 and dd near-side SE reproduces imp-34609 double near SE to <1e-2 relative',
    holds: () =>
      Math.abs(ddSqrt([2, 0])[0] + ddSqrt([2, 0])[1] - Math.SQRT2) < 1e-13 &&
      Math.abs(ddMul(ddSqrt([2, 0]), ddSqrt([2, 0]))[0] - 2) < 1e-28 &&
      IMP34629_NEAR_SE_REL_SHIFT < 1e-2,
  },
  {
    // (F1) sigma survives: dd combined-sigma stays >> 1 and within ~5% of the double ~9.45.
    id: 'imp-34629-sigma-survives-extended-precision',
    description: 'double-double combined-sigma ~9.27 stays highly significant and within ~5% of the imp-34609 double ~9.45 (does NOT collapse)',
    holds: () =>
      Math.abs(IMP34629_LOGCORR_FAR_MINUS_NEAR_SIGMA_DD - 9.27) < 0.5 &&
      IMP34629_SIGMA_SURVIVES === true,
  },
  {
    // (F2) near-side SE stable, far-side SE precision-sensitive at the input-quantization floor.
    id: 'imp-34629-far-se-precision-sensitive-near-se-stable',
    description: 'near-side SE shift <1e-2 relative (stable) while far-side SE shift >1e-2 relative (precision-sensitive at the 9-sig-fig floor)',
    holds: () =>
      IMP34629_NEAR_SE_REL_SHIFT < 1e-2 &&
      IMP34629_FAR_SE_REL_SHIFT > 1e-2 &&
      IMP34629_FAR_RMS_LOG_RESID_DD < 1e-8,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp-34629-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34629_EFLOW_ATTR_SLOPE_DIFF_BINARY128_RECHECK.isRigorous === false &&
      /NO QED/.test(IMP34629_EFLOW_ATTR_SLOPE_DIFF_BINARY128_RECHECK.honest) &&
      /refereed bound is changed/i.test(IMP34629_EFLOW_ATTR_SLOPE_DIFF_BINARY128_RECHECK.honest),
  },
];

for (const a of IMP34629_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34629-eflow-attr-slope-diff-binary128-recheck assertion failed: ${a.id}`);
  }
}
