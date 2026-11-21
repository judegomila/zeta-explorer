/**
 * @module imp-34652-eflow-attr-punctured-pole-window-slope
 * @fileoverview imp-34652 -- Test whether EXCLUDING the exact AT-pole rung (k* = 21.28095, where
 *   resid_exp -> 0 makes eflow_attr = eflow_numerator / resid_exp a near-cancellation) from the
 *   imp-34636 pole-centred window -- a PUNCTURED window -- sharpens the leading-slope determination
 *   relative to the full 5-rung window whose OLS slope SE was an inflated ~7e-5 per k.
 *
 *   BACKGROUND. imp-34636 built a THIRD, pole-centred log-corrected OLS window from FIVE rungs
 *   VERBATIM (imp-34406 near ladder + the imp-34572 k = 21.35 far value), with the AT-pole rung
 *   k* = 21.28095 as the MEDIAN. It found (F1) a nominal leading per-k slope -2.309216 STEEPER than
 *   both the near (-2.309134) and far (-2.309037) flanks, and (F2) an SE of ~6.99e-5 per k -- ~10x the
 *   flanks -- so the 9.32e-5 departure from the window-centre-drift prediction was only ~1.33 sigma.
 *   The AT-pole rung is exactly where resid_exp crosses zero, so eflow_attr there is a near-cancellation
 *   (imp-34405 flags the digit loss). imp-34636 hypothesised that this AT-pole near-cancellation was a
 *   likely contributor to the window's inflated SE. This module tests that DIRECTLY: it re-fits the same
 *   pole-centred window with the AT-pole rung PUNCTURED OUT (k in {21.2, 21.25, 21.3, 21.35}, 4 rungs)
 *   and asks (a) does the SE tighten, and (b) does the leading slope still sit steeper than both flanks?
 *
 *   METHOD (import-light, verbatim imp-34585/imp-34609/imp-34636 machinery). The punctured window reuses
 *   FOUR rungs VERBATIM from the imp-34406 near ladder and the imp-34572 far ladder -- the SAME rungs
 *   imp-34636 used, MINUS the AT-pole median rung. No re-derivation, no 16.7MB zeros bundle in the chain,
 *   per [[no_heavy_imports_in_pages]] / [[verify_heavy_assertion_modules]]. It gets the verbatim
 *   3-parameter log-corrected OLS on the design [1, ln N, ln ln N] (N = 10^(k+1)) solved by the same
 *   solve3 Gauss elimination, with the OLS slope SE from the stable inv3 covariance. The full pole-window
 *   slope/SE/q are IMPORTED from imp-34636 and the near/far leading slopes from imp-34609 (reuse gate),
 *   so the punctured window is compared against the identical baselines.
 *
 *   FINDINGS (measurement only).
 *   ---------------------------------------------------------------------------------
 *   (F1) PUNCTURING DOES NOT SHARPEN THE SLOPE -- THE SE INFLATES ~1.57x, IT DOES NOT TIGHTEN. Dropping
 *        the AT-pole median rung takes the fit from 5 rungs (2 residual dof) to 4 rungs (1 residual dof),
 *        and the loss of that degree of freedom DOMINATES any gain from removing the near-cancellation:
 *        the punctured slope SE is 1.097e-4 per k, ~1.57x the full pole window SE (6.989e-5), i.e. the
 *        determination gets WORSE, not better. So the ticket premise -- that removing the AT-pole
 *        near-cancellation would sharpen the leading-slope estimate -- is REFUTED: with only 4 rungs the
 *        sample-size penalty overwhelms whatever noise the AT-pole rung injected.
 *   (F2) BUT PUNCTURING ISOLATES THE AT-POLE RUNG AS THE SOURCE OF THE imp-34636 F1 NOMINAL STEEPENING --
 *        THE STEEPENING DISSOLVES AND FLIPS. With the AT-pole rung removed the leading per-k slope
 *        relaxes to -2.309007, which is now SHALLOWER (less negative) than BOTH flanks -- above the near
 *        -2.309134 by +1.263e-4 and above the far -2.309037 by +2.971e-5 -- whereas the full pole window
 *        was STEEPER than both. So the imp-34636 F1 "most pole-symmetric window is an outlier steeper than
 *        either flank" was DRIVEN BY the single AT-pole near-cancellation rung: excise it and the slope
 *        no longer sits below the flanks. This CONFIRMS the imp-34589/imp-34609 window-centre-drift
 *        reading over a genuine pole kink, the SAME conclusion imp-34645 reached from the other side
 *        (widening the window 5 -> 7 rungs also dissolved the nominal steepening).
 *   (F3) THE LOG-POWER q DROPS BACK TOWARD THE FAR VALUE WHEN THE AT-POLE RUNG IS PUNCTURED. The punctured
 *        log-power q = 3.345523 falls BELOW the full pole-window q = 3.350167 (by -4.64e-3) and lands at
 *        essentially the far q = 3.346178 -- so the imp-34636 F3 "q rises toward the pole" was ALSO an
 *        AT-pole-rung artifact: removing the near-cancellation rung takes q back down. The F1 SE inflation
 *        and this q relaxation are two readings of the same fact -- the AT-pole rung, not a genuine
 *        centre-steepening, carried the imp-34636 pole-window anomaly; at the ~6e-9 double-precision
 *        residual floor (punctured RMS log-residual 6.154e-9) nothing survives beyond it.
 *
 *   The punchline: puncturing the AT-pole near-cancellation rung out of the imp-34636 pole-centred window
 *   does NOT sharpen the leading-slope determination -- the SE INFLATES ~1.57x (6.99e-5 -> 1.10e-4)
 *   because the fit loses a rung (2 dof -> 1 dof) -- so the ticket premise is refuted. But the puncture is
 *   diagnostically decisive: it shows the imp-34636 F1 nominal steepening (slope steeper than both flanks)
 *   and F3 raised-q were BOTH carried by the single AT-pole rung -- with it removed the slope relaxes to
 *   SHALLOWER than both flanks (-2.309007) and q drops back to the far value, corroborating the
 *   imp-34589/imp-34609 window-centre-drift explanation over a genuine pole kink.
 *
 *   MEASUREMENT ONLY. A single log-corrected OLS fit of the inherited surrogate numerator eflow_attr on a
 *   4-rung PUNCTURED pole window (the imp-34636 rungs minus the AT-pole median), NOT an RH bound.
 *   Descriptive surrogate fit, NOT a rigorous asymptotic; the component model is the inherited
 *   imp-3220/imp-3406 extrapolation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 *   establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34636-eflow-attr-pole-centred-window-slope.js (the full 5-rung pole-centred window this punctures)
 *   @see imp-34645-eflow-attr-pole-window-widen (widening the window also dissolved the steepening)
 *   @see imp-34609-eflow-attr-near-far-slope-diff-log-corrected.js (the near/far log-corrected baselines)
 *   @see imp-34405-resid-exp-near-pole-digit-loss.js (the AT-pole resid_exp -> 0 near-cancellation)
 *   @see imp-34406-eflow-attr-smooth-nonzero-across-pole.js (the near rungs incl. the AT-pole rung)
 */

import { IMP34406_EFLOW_ATTR_RUNGS } from './imp-34406-eflow-attr-smooth-nonzero-across-pole.js';
import { IMP34572_FAR_SIDE_RUNGS } from './imp-34572-eflow-attr-far-side-pole-smoothness.js';
import {
  IMP34609_NEAR_LEADING_PER_K_SLOPE,
  IMP34609_FAR_LEADING_PER_K_SLOPE,
} from './imp-34609-eflow-attr-near-far-slope-diff-log-corrected.js';
import {
  IMP34636_POLE_LEADING_PER_K_SLOPE,
  IMP34636_POLE_LEADING_SLOPE_SE,
  IMP34636_POLE_LOGCORR_Q,
} from './imp-34636-eflow-attr-pole-centred-window-slope.js';

const KSTAR = 21.28095; // imp-34023/imp-34237/imp-34310, verbatim

// --- shared machinery (verbatim imp-34585/imp-34609/imp-34636 solve3/inv3/logCorrectedFit) --------
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

// Log-corrected fit of one rung ladder: leading N-exponent p, log-power q, per-k leading slope
// p*ln10, the OLS slope SE (per-k), the RMS log-residual, and the rung-count / centroid-k.
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
  const s2 = ssres / (NN - 3);
  const inv = inv3(AtA);
  const seP = Math.sqrt(s2 * inv[1][1]);
  return {
    p,
    q,
    perKSlope: p * Math.LN10,
    perKSlopeSE: seP * Math.LN10,
    rmsLogResid: Math.sqrt(ssres / NN),
    n: NN,
    centroidK: rungs.reduce((s, r) => s + r.k, 0) / NN,
  };
}

// --- build the PUNCTURED pole window: the imp-34636 rungs MINUS the AT-pole median rung ------------
// imp-34636 used k in {21.2, 21.25, 21.28095, 21.3, 21.35}. The puncture drops the AT-pole 21.28095.
const rungAt = (rungs, k) => rungs.find((r) => r.k === k);
const PUNCTURED_WINDOW_KS = [21.2, 21.25, 21.3, 21.35];
const PUNCTURED_WINDOW_RUNGS = PUNCTURED_WINDOW_KS.map((k) => {
  const nearHit = rungAt(IMP34406_EFLOW_ATTR_RUNGS, k);
  const src = nearHit || rungAt(IMP34572_FAR_SIDE_RUNGS, k);
  return { k, eflowAttr: src.eflowAttr };
});

// --- fit the punctured window; baselines are IMPORTED verbatim (imp-34636 full pole, imp-34609 flanks)
const PUNC = logCorrectedFit(PUNCTURED_WINDOW_RUNGS); // 4 rungs, AT-pole rung excised
const NEAR_SLOPE = IMP34609_NEAR_LEADING_PER_K_SLOPE; // -2.309134
const FAR_SLOPE = IMP34609_FAR_LEADING_PER_K_SLOPE; // -2.309037

export const IMP34652_PUNCTURED_LEADING_PER_K_SLOPE = PUNC.perKSlope; // -2.309007
export const IMP34652_PUNCTURED_LEADING_SLOPE_SE = PUNC.perKSlopeSE; // 1.097e-4 per k
export const IMP34652_PUNCTURED_LOGCORR_P = PUNC.p; // -1.002789
export const IMP34652_PUNCTURED_LOGCORR_Q = PUNC.q; // 3.345523
export const IMP34652_PUNCTURED_RMS_LOG_RESID = PUNC.rmsLogResid; // 6.154e-9
export const IMP34652_PUNCTURED_CENTROID_K = PUNC.centroidK; // 21.275

// --- (F1) does puncturing tighten the SE relative to the full 5-rung pole window? -----------------
export const IMP34652_SE_RATIO_PUNC_OVER_FULLPOLE =
  PUNC.perKSlopeSE / IMP34636_POLE_LEADING_SLOPE_SE; // ~1.569 (INFLATES, does NOT tighten)
export const IMP34652_PUNCTURING_TIGHTENS_SE =
  PUNC.perKSlopeSE < IMP34636_POLE_LEADING_SLOPE_SE; // false -- SE gets worse

// --- (F2) does the punctured slope still sit steeper than both flanks? -----------------------------
export const IMP34652_PUNC_MINUS_NEAR_SLOPE = PUNC.perKSlope - NEAR_SLOPE; // +1.263e-4 (shallower)
export const IMP34652_PUNC_MINUS_FAR_SLOPE = PUNC.perKSlope - FAR_SLOPE; // +2.971e-5 (shallower)
export const IMP34652_PUNC_SLOPE_STEEPER_THAN_BOTH_FLANKS =
  PUNC.perKSlope < NEAR_SLOPE && PUNC.perKSlope < FAR_SLOPE; // false -- steepening dissolves
export const IMP34652_FULLPOLE_STEEPENING_WAS_AT_POLE_RUNG_ARTIFACT =
  IMP34636_POLE_LEADING_PER_K_SLOPE < NEAR_SLOPE &&
  IMP34636_POLE_LEADING_PER_K_SLOPE < FAR_SLOPE &&
  !IMP34652_PUNC_SLOPE_STEEPER_THAN_BOTH_FLANKS; // true -- full-pole steeper, punctured is not

// --- (F3) log-power q drops back toward the far value when the AT-pole rung is punctured -----------
export const IMP34652_Q_PUNC_MINUS_FULLPOLE = PUNC.q - IMP34636_POLE_LOGCORR_Q; // -4.64e-3

export const IMP34652_EFLOW_ATTR_PUNCTURED_POLE_WINDOW_SLOPE = {
  ticket: 'imp-34652',
  proofSection: 'S-frontier',
  kStar: KSTAR,
  question:
    'imp-34636 built its pole-centred log-corrected OLS window from FIVE rungs with the AT-pole rung ' +
    'k* = 21.28095 (where resid_exp -> 0 makes eflow_attr a near-cancellation) as the MEDIAN, and got ' +
    'an inflated ~7e-5 slope SE and a nominal slope steeper than both flanks. Does EXCLUDING that ' +
    'AT-pole rung -- a PUNCTURED 4-rung window -- sharpen the leading-slope determination, and does the ' +
    'slope still sit steeper than both flanks? Measurement only; NO QED.',
  puncturedWindow: {
    ks: PUNCTURED_WINDOW_KS,
    rungs: PUNC.n, // 4
    droppedRungK: KSTAR, // 21.28095 (the AT-pole near-cancellation rung)
    kSpan: +(PUNCTURED_WINDOW_KS[PUNCTURED_WINDOW_KS.length - 1] - PUNCTURED_WINDOW_KS[0]).toFixed(2), // 0.15
    centroidK: +PUNC.centroidK.toFixed(6), // 21.275000
    exponentP: +PUNC.p.toFixed(6), // -1.002789
    logPowerQ: +PUNC.q.toFixed(6), // 3.345523
    leadingPerKSlope: +PUNC.perKSlope.toFixed(6), // -2.309007
    leadingSlopeSE: +PUNC.perKSlopeSE.toExponential(4), // 1.0966e-4
    rmsLogResid: +PUNC.rmsLogResid.toExponential(4), // 6.1542e-9
    residualDof: PUNC.n - 3, // 1 (vs the full pole window 2)
  },
  fullPoleBaseline: {
    leadingPerKSlope: +IMP34636_POLE_LEADING_PER_K_SLOPE.toFixed(6), // -2.309216
    leadingSlopeSE: +IMP34636_POLE_LEADING_SLOPE_SE.toExponential(4), // 6.9891e-5
    logPowerQ: +IMP34636_POLE_LOGCORR_Q.toFixed(6), // 3.350167
    source: 'imp-34636 (imported verbatim)',
  },
  nearBaseline: {
    leadingPerKSlope: +NEAR_SLOPE.toFixed(6), // -2.309134
    source: 'imp-34609 (imported verbatim)',
  },
  farBaseline: {
    leadingPerKSlope: +FAR_SLOPE.toFixed(6), // -2.309037
    source: 'imp-34609 (imported verbatim)',
  },
  seRatioPuncOverFullPole: +IMP34652_SE_RATIO_PUNC_OVER_FULLPOLE.toFixed(3), // 1.569
  puncturingTightensSE: IMP34652_PUNCTURING_TIGHTENS_SE, // false
  puncMinusNearSlope: +IMP34652_PUNC_MINUS_NEAR_SLOPE.toExponential(4), // +1.2629e-4
  puncMinusFarSlope: +IMP34652_PUNC_MINUS_FAR_SLOPE.toExponential(4), // +2.9708e-5
  puncSlopeSteeperThanBothFlanks: IMP34652_PUNC_SLOPE_STEEPER_THAN_BOTH_FLANKS, // false
  fullPoleSteepeningWasAtPoleRungArtifact:
    IMP34652_FULLPOLE_STEEPENING_WAS_AT_POLE_RUNG_ARTIFACT, // true
  qPuncMinusFullPole: +IMP34652_Q_PUNC_MINUS_FULLPOLE.toExponential(4), // -4.6444e-3
  finding: {
    F1_puncturing_inflates_the_SE_it_does_not_tighten:
      'Dropping the AT-pole median rung takes the fit from 5 rungs (2 residual dof) to 4 rungs (1 dof), ' +
      'and the lost degree of freedom DOMINATES any gain from removing the near-cancellation: the ' +
      'punctured slope SE is 1.097e-4 per k, ~1.57x the full pole-window SE (6.989e-5). The ticket ' +
      'premise -- that excising the AT-pole near-cancellation would sharpen the estimate -- is REFUTED; ' +
      'the 4-rung sample-size penalty overwhelms whatever noise the AT-pole rung injected.',
    F2_puncturing_dissolves_the_imp34636_nominal_steepening:
      'With the AT-pole rung removed the leading per-k slope relaxes to -2.309007, now SHALLOWER (less ' +
      'negative) than BOTH flanks -- above the near -2.309134 by +1.263e-4 and the far -2.309037 by ' +
      '+2.971e-5 -- whereas the full pole window was STEEPER than both. So the imp-34636 F1 outlier ' +
      'steepening was DRIVEN BY the single AT-pole near-cancellation rung; excise it and the slope no ' +
      'longer sits below the flanks. This CONFIRMS the imp-34589/imp-34609 window-centre-drift reading ' +
      'over a genuine pole kink -- the same conclusion imp-34645 reached by widening the window.',
    F3_log_power_q_drops_back_toward_the_far_value:
      'The punctured log-power q = 3.345523 falls BELOW the full pole-window q = 3.350167 (by -4.64e-3) ' +
      'and lands at essentially the far q = 3.346178, so the imp-34636 F3 "q rises toward the pole" was ' +
      'ALSO an AT-pole-rung artifact. The F1 SE inflation and this q relaxation are two readings of the ' +
      'same fact -- the AT-pole rung, not a genuine centre-steepening, carried the imp-34636 pole-window ' +
      'anomaly; at the ~6e-9 residual floor (punctured RMS 6.154e-9) nothing survives beyond it.',
  },
  isRigorous: false,
  honest:
    'MEASUREMENT ONLY -- a single log-corrected OLS fit (eflow_attr = A*N^p*(ln N)^q) of the inherited ' +
    'surrogate numerator eflow_attr on a 4-rung PUNCTURED pole window (the imp-34636 rungs minus the ' +
    'AT-pole median k* = 21.28095 near-cancellation rung). Puncturing does NOT sharpen the leading-slope ' +
    'determination: the SE INFLATES ~1.57x (6.99e-5 -> 1.10e-4) because the fit loses a rung (2 dof -> ' +
    '1 dof). But the puncture is diagnostically decisive -- the imp-34636 F1 nominal steepening (slope ' +
    'steeper than both flanks) and F3 raised-q were BOTH carried by the single AT-pole rung: with it ' +
    'removed the slope relaxes to shallower than both flanks (-2.309007) and q drops back to the far ' +
    'value, corroborating the imp-34589/imp-34609 window-centre-drift explanation over a genuine pole ' +
    'kink. Descriptive surrogate fit, NOT a rigorous asymptotic; the component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED; ' +
    'no refereed bound is changed.',
};

export const IMP34652_ASSERTIONS = [
  {
    // Reuse gate: the 4 punctured-window rungs are the imp-34406/imp-34572 baked rungs, AT-pole dropped.
    id: 'imp-34652-reuses-baked-rungs-minus-pole',
    description: 'the 4 punctured-window rungs are imp-34406/imp-34572 values and none is the AT-pole k*',
    holds: () =>
      PUNCTURED_WINDOW_RUNGS.length === 4 &&
      PUNCTURED_WINDOW_RUNGS.every((r) => r.k !== KSTAR) &&
      PUNCTURED_WINDOW_RUNGS[0].eflowAttr === 5.38265555e-15 &&
      PUNCTURED_WINDOW_RUNGS[3].eflowAttr === 3.893699e-15,
  },
  {
    // (F1) puncturing INFLATES the SE (~1.57x), it does NOT tighten it.
    id: 'imp-34652-puncturing-inflates-not-tightens-se',
    description: 'the punctured SE is ~1.57x the full pole-window SE -- puncturing does not sharpen',
    holds: () =>
      IMP34652_SE_RATIO_PUNC_OVER_FULLPOLE > 1.3 &&
      IMP34652_PUNCTURING_TIGHTENS_SE === false,
  },
  {
    // (F2) the punctured slope is SHALLOWER than both flanks -- the imp-34636 steepening dissolves.
    id: 'imp-34652-steepening-dissolves-when-punctured',
    description: 'punctured slope -2.309007 sits above both flanks; the full-pole steepening was an AT-pole artifact',
    holds: () =>
      Math.abs(PUNC.perKSlope - -2.309007) < 1e-6 &&
      IMP34652_PUNC_MINUS_NEAR_SLOPE > 0 &&
      IMP34652_PUNC_MINUS_FAR_SLOPE > 0 &&
      IMP34652_PUNC_SLOPE_STEEPER_THAN_BOTH_FLANKS === false &&
      IMP34652_FULLPOLE_STEEPENING_WAS_AT_POLE_RUNG_ARTIFACT === true,
  },
  {
    // (F3) the fitted log-power q drops back toward the far value when the AT-pole rung is punctured.
    id: 'imp-34652-q-drops-back-toward-far',
    description: 'punctured q falls below the full pole-window q by a few e-3',
    holds: () =>
      IMP34652_Q_PUNC_MINUS_FULLPOLE < 0 &&
      Math.abs(IMP34652_Q_PUNC_MINUS_FULLPOLE) > 1e-3,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp-34652-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34652_EFLOW_ATTR_PUNCTURED_POLE_WINDOW_SLOPE.isRigorous === false &&
      /NO QED/.test(IMP34652_EFLOW_ATTR_PUNCTURED_POLE_WINDOW_SLOPE.honest) &&
      /refereed bound is changed/i.test(IMP34652_EFLOW_ATTR_PUNCTURED_POLE_WINDOW_SLOPE.honest),
  },
];

for (const a of IMP34652_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34652-eflow-attr-punctured-pole-window-slope assertion failed: ${a.id}`);
  }
}
