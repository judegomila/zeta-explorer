/**
 * @module imp-34665-eflow-attr-flank-window-widen-se-crossval
 * @fileoverview imp-34665 -- Cross-validate the imp-34645 F1 order-of-magnitude leading-slope SE
 *   collapse (5 -> 7 rungs, ~10x) by re-running the SAME 5 -> 7 rung eflow_attr OLS widening on a
 *   window centred on a NON-pole flank node (k = 21.45), to test the imp-34645 attribution that the
 *   collapse falls as (k-span)^-2 * n^-1 from span-doubling rather than anything specific to the pole
 *   k* ~ 21.28095.
 *
 *   BACKGROUND. imp-34645 F1 found that widening the imp-34636 pole-centred log-corrected eflow_attr
 *   OLS window from 5 to 7 rungs (span 0.15 -> 0.30, count-symmetric about the pole, median = k*)
 *   collapsed the leading per-k slope SE by ~10x -- from 6.989e-5 (imp-34636) to 6.993e-6 -- and
 *   attributed the collapse to the generic span-doubling law "OLS slope variance ~ (k-span)^-2 * n^-1"
 *   as the k-span doubled. But that clean power law, applied to a 5 -> 7 rung doubling, predicts a
 *   modest SE ratio of only ~2.4x -- FAR below the observed ~10x. imp-34645 never tested the
 *   attribution off the pole. If the ~10x were truly a generic span-widening artifact, the SAME 5 -> 7
 *   rung widening centred on a flank node should reproduce a comparable collapse.
 *
 *   METHOD (import-light, verbatim imp-34636/imp-34645 machinery). A flank centre is chosen at the
 *   far-side node k = 21.45 (0.169 ABOVE the pole, well onto the imp-34572 far flank, NOT the pole),
 *   and the SAME count-symmetric 5 -> 7 rung widening is built from the imp-34572 far ladder VERBATIM,
 *   keeping EVERY rung strictly above the pole (no rung near the fine-clustered pole region):
 *     W5f = {21.35, 21.4, 21.45, 21.5, 21.55}                       (2 below + 21.45 + 2 above, span 0.20)
 *     W7f = {21.3, 21.35, 21.4, 21.45, 21.5, 21.55, 21.6}           (3 below + 21.45 + 3 above, span 0.30)
 *   W7f is EXACTLY the imp-34572 far-side 7-rung ladder (its slope -2.309037 is the imp-34645 far
 *   baseline), and W5f is its inner 5 rungs; both are uniform-0.05-spaced. The two windows share the
 *   SAME W7 span (0.30) as the pole W7, so the widening ends at a matched span -- isolating whether the
 *   pole's extra collapse comes from the WIDENING or from its anomalous W5 START point. Each gets the
 *   SAME 3-parameter log-corrected OLS on the design [1, ln N, ln ln N], solved by the same solve3
 *   Gauss elimination with the OLS slope SE from the stable inv3 Gauss-Jordan covariance. No
 *   re-derivation, no 16.7MB zeros bundle in the chain, per [[no_heavy_imports_in_pages]] /
 *   [[verify_heavy_assertion_modules]]. The pole-side SEs and ratio are pulled VERBATIM from the
 *   imp-34645/imp-34636 exports (reuse gate); only the flank windows are computed here.
 *
 *   FINDINGS (measurement only).
 *   ---------------------------------------------------------------------------------
 *   (F1) THE ~10x COLLAPSE DOES NOT REPRODUCE OFF THE POLE: THE SAME 5 -> 7 RUNG WIDENING BUYS ~3.4x.
 *        The flank-centred 5 -> 7 rung widening (span 0.20 -> 0.30, all rungs above the pole) collapses
 *        the leading-slope SE only from 1.989e-5 to 5.873e-6 -- a factor 3.39, NOT the ~10x seen at the
 *        pole. So the imp-34645 F1 attribution of the ~10x collapse to a generic (k-span)^-2 * n^-1
 *        widening law is INCOMPLETE: the same widening off the pole buys only ~3.4x.
 *   (F2) THE POLE EXCESS IS ENTIRELY IN ITS W5 START POINT, NOT THE WIDENING -- AT MATCHED W7 SPAN THE
 *        POLE AND FLANK W7 SE ARE COMPARABLE. At the matched W7 span 0.30 the pole W7 SE (6.993e-6) and
 *        the flank W7 SE (5.873e-6) sit within ~19% of each other, so the widened window's resolution is
 *        NOT pole-special. The pole's ~10x ratio comes ENTIRELY from its anomalously large W5 SE
 *        (6.989e-5 = 3.51x the flank W5 SE 1.989e-5): the pole W5 is the NARROWEST window (span 0.15),
 *        achievable at 5 rungs ONLY because of the extra fine pole rung 21.28095 squeezed between 21.25
 *        and 21.3, so its rungs are fine-clustered and non-uniform and nearly degenerate the
 *        [ln N, ln ln N] design. No off-pole 5-rung window can be that narrow or ill-conditioned (uniform
 *        0.05 rungs force span >= 0.20), so widening away from the pole recovers far less conditioning.
 *
 *   The punchline: NO -- the imp-34645 ~10x leading-slope SE collapse is NOT reproduced by the SAME
 *   5 -> 7 rung widening centred on a non-pole flank node (k = 21.45): that flank widening buys only
 *   ~3.4x. At the matched W7 span 0.30 the pole and flank W7 SE are comparable (~6e-6), so the widened
 *   window is not pole-special; the pole's excess collapse is entirely its anomalously ill-conditioned
 *   W5 START point (span 0.15 with the fine-clustered pole rung, impossible to reproduce off the pole),
 *   NOT the (k-span)^-2 * n^-1 widening law imp-34645 F1 credited. imp-34645 F1 is REFINED, not
 *   overturned: widening accounts for the modest flank collapse and the shared W7 resolution; the
 *   residual pole excess is W5-conditioning-specific. The imp-34645 F2/F3 conclusions (the nominal pole
 *   steepening is a 5-rung small-sample artifact; the symmetric 7-rung window is the sweet spot) are
 *   UNTOUCHED and stand.
 *
 *   MEASUREMENT ONLY. Two log-corrected OLS fits of the inherited surrogate numerator eflow_attr on a
 *   flank-centred 5 -> 7 rung widening built from imp-34572 far-side rungs verbatim, NOT an RH bound.
 *   Descriptive surrogate fit, NOT a rigorous asymptotic; the component model is the inherited
 *   imp-3220/imp-3406 extrapolation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no
 *   bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 *   No refereed bound is changed.
 *
 *   @see imp-34645-eflow-attr-pole-window-widen-se.js (the pole-centred SE-collapse this cross-validates)
 *   @see imp-34636-eflow-attr-pole-centred-window-slope.js (the 5-rung pole-centred baseline SE)
 *   @see imp-34572-eflow-attr-far-side-pole-smoothness.js (the far-side ladder = the flank W7 window)
 *   @see imp-34406-eflow-attr-smooth-nonzero-across-pole.js (the near rungs)
 */

import { IMP34572_FAR_SIDE_RUNGS } from './imp-34572-eflow-attr-far-side-pole-smoothness.js';
import { IMP34636_POLE_LEADING_SLOPE_SE } from './imp-34636-eflow-attr-pole-centred-window-slope.js';
import {
  IMP34645_W7_LEADING_SLOPE_SE,
  IMP34645_W5_SE_OVER_W7_SE,
} from './imp-34645-eflow-attr-pole-window-widen-se.js';

const KSTAR = 21.28095; // imp-34023/imp-34237/imp-34310, verbatim
const FLANK_CENTER = 21.45; // a far-side flank node, 0.169 ABOVE the pole -- NOT the pole

// --- shared machinery (verbatim imp-34636/imp-34645 solve3/inv3/logCorrectedFit) --------
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

// --- pull the flank-window rungs from the imp-34572 far ladder verbatim -----------------
const rungAt = (rungs, k) => rungs.find((r) => r.k === k);
const getRung = (k) => ({ k, eflowAttr: rungAt(IMP34572_FAR_SIDE_RUNGS, k).eflowAttr });

// W5f: 2 below + flank centre + 2 above (count-symmetric about 21.45, uniform 0.05, span 0.20).
const W5F_KS = [21.35, 21.4, 21.45, 21.5, 21.55];
// W7f: 3 below + flank centre + 3 above -- EXACTLY the imp-34572 far ladder (span 0.30, all > k*).
const W7F_KS = [21.3, 21.35, 21.4, 21.45, 21.5, 21.55, 21.6];
const W5F_RUNGS = W5F_KS.map(getRung);
const W7F_RUNGS = W7F_KS.map(getRung);

// --- fits: two flank-centred windows, matched W7 span with the pole W7 --------------------
const W5F = logCorrectedFit(W5F_RUNGS); // 5 rungs, median = 21.45 flank node, span 0.20
const W7F = logCorrectedFit(W7F_RUNGS); // 7 rungs, median = 21.45 flank node, span 0.30

const FLANK_SE_RATIO = W5F.perKSlopeSE / W7F.perKSlopeSE; // 3.386 (NOT ~10x)
const POLE_SE_RATIO = IMP34645_W5_SE_OVER_W7_SE; // 9.99 (imported verbatim, reuse gate)
// at the matched W7 span (0.30) the pole/flank W7 SE agree within this factor:
const W7_SE_MATCH_FACTOR = IMP34645_W7_LEADING_SLOPE_SE / W7F.perKSlopeSE; // ~1.19
// the pole excess is its anomalous W5 START SE relative to the flank W5:
const POLE_W5_SE_OVER_FLANK_W5_SE = IMP34636_POLE_LEADING_SLOPE_SE / W5F.perKSlopeSE; // ~3.51

// --- exports (F1) the ~10x collapse does NOT reproduce off the pole ---------------------
export const IMP34665_FLANK_W5_LEADING_SLOPE_SE = W5F.perKSlopeSE; // 1.9888e-5
export const IMP34665_FLANK_W7_LEADING_SLOPE_SE = W7F.perKSlopeSE; // 5.8734e-6
export const IMP34665_FLANK_W5_SE_OVER_W7_SE = FLANK_SE_RATIO; // 3.386
export const IMP34665_POLE_W5_SE_OVER_W7_SE = POLE_SE_RATIO; // 9.99 (imported)
export const IMP34665_FLANK_COLLAPSE_FAR_BELOW_POLE =
  FLANK_SE_RATIO < POLE_SE_RATIO / 2; // true: 3.39 << 9.99/2 = 5.00

// --- exports (F2) the pole excess is in its W5 start, not the widening -------------------
export const IMP34665_W7_SE_MATCH_FACTOR = W7_SE_MATCH_FACTOR; // ~1.19 (pole/flank W7 SE comparable)
export const IMP34665_W7_SE_POLE_FLANK_COMPARABLE = W7_SE_MATCH_FACTOR < 1.5; // true
export const IMP34665_POLE_W5_SE_OVER_FLANK_W5_SE = POLE_W5_SE_OVER_FLANK_W5_SE; // ~3.51
export const IMP34665_POLE_EXCESS_IS_IN_W5_START =
  POLE_W5_SE_OVER_FLANK_W5_SE > 3 && W7_SE_MATCH_FACTOR < 1.5; // true

export const IMP34665_EFLOW_ATTR_FLANK_WINDOW_WIDEN_SE_CROSSVAL = {
  ticket: 'imp-34665',
  proofSection: 'S-frontier',
  kStar: KSTAR,
  flankCenter: FLANK_CENTER,
  question:
    'imp-34645 F1 attributed the ~10x leading-slope SE collapse (5 -> 7 rungs, pole-centred, span ' +
    '0.15 -> 0.30) to a generic (k-span)^-2 * n^-1 widening law, but never tested it off the pole. ' +
    'Does the SAME 5 -> 7 rung widening centred on a NON-pole flank node (k = 21.45, all rungs above ' +
    'the pole) reproduce the ~10x collapse, confirming it is a widening artifact and not pole-specific? ' +
    'Measurement only; NO QED.',
  poleSide: {
    source: 'imp-34645 / imp-34636 (imported verbatim)',
    w5LeadingSlopeSE: +IMP34636_POLE_LEADING_SLOPE_SE.toExponential(4), // 6.9891e-5
    w7LeadingSlopeSE: +IMP34645_W7_LEADING_SLOPE_SE.toExponential(4), // 6.9926e-6
    seRatioW5overW7: +POLE_SE_RATIO.toFixed(3), // 9.995
    kSpanW5: 0.15,
    kSpanW7: 0.3,
  },
  flankW5Window: {
    ks: W5F_KS,
    rungs: W5F.n,
    kSpan: +(W5F_KS[W5F_KS.length - 1] - W5F_KS[0]).toFixed(2), // 0.20
    medianRungIsFlankCenter: W5F_KS[2] === FLANK_CENTER, // true
    allRungsAbovePole: W5F_KS.every((k) => k > KSTAR), // true
    centroidK: +W5F.centroidK.toFixed(6), // 21.450000
    leadingPerKSlope: +W5F.perKSlope.toFixed(6), // -2.309059
    leadingSlopeSE: +W5F.perKSlopeSE.toExponential(4), // 1.9888e-5
    rmsLogResid: +W5F.rmsLogResid.toExponential(4),
  },
  flankW7Window: {
    ks: W7F_KS,
    rungs: W7F.n,
    kSpan: +(W7F_KS[W7F_KS.length - 1] - W7F_KS[0]).toFixed(2), // 0.30 (matches pole W7 span)
    medianRungIsFlankCenter: W7F_KS[3] === FLANK_CENTER, // true
    isImp34572FarLadder: true, // W7f = the imp-34572 far-side 7-rung ladder verbatim
    centroidK: +W7F.centroidK.toFixed(6), // 21.450000
    leadingPerKSlope: +W7F.perKSlope.toFixed(6), // -2.309037 (= imp-34645 far baseline)
    leadingSlopeSE: +W7F.perKSlopeSE.toExponential(4), // 5.8734e-6
    rmsLogResid: +W7F.rmsLogResid.toExponential(4),
  },
  flankSEratioW5overW7: +FLANK_SE_RATIO.toFixed(3), // 3.386
  w7SEmatchFactorPoleOverFlank: +W7_SE_MATCH_FACTOR.toFixed(3), // 1.190
  poleW5SEoverFlankW5SE: +POLE_W5_SE_OVER_FLANK_W5_SE.toFixed(3), // 3.514
  finding: {
    F1_the_10x_collapse_does_not_reproduce_off_the_pole:
      'The flank-centred 5 -> 7 rung widening (span 0.20 -> 0.30, all rungs above the pole, W7f = the ' +
      'imp-34572 far ladder) collapses the leading-slope SE only from 1.989e-5 to 5.873e-6 -- a factor ' +
      '3.39, NOT the ~10x seen at the pole. So the imp-34645 F1 (k-span)^-2 * n^-1 widening attribution ' +
      'of the ~10x is INCOMPLETE: the same widening off the pole buys only ~3.4x.',
    F2_the_pole_excess_is_in_its_W5_start_not_the_widening:
      'At the matched W7 span 0.30 the pole W7 SE (6.993e-6) and the flank W7 SE (5.873e-6) agree within ' +
      '~19%, so the widened window resolution is NOT pole-special. The pole ~10x comes ENTIRELY from its ' +
      'anomalously large W5 SE (6.989e-5 = 3.51x the flank W5 SE 1.989e-5): the pole W5 is the NARROWEST ' +
      'window (span 0.15), possible at 5 rungs only because of the extra fine pole rung 21.28095 between ' +
      '21.25 and 21.3, so its rungs are fine-clustered and non-uniform and nearly degenerate the ' +
      '[ln N, ln ln N] design. No off-pole 5-rung window can be that narrow (uniform 0.05 forces span >= ' +
      '0.20), so widening away from the pole recovers far less conditioning. imp-34645 F2/F3 (steepening ' +
      '= 5-rung artifact; W7 sweet spot) are UNTOUCHED and stand.',
  },
  isRigorous: false,
  honest:
    'MEASUREMENT ONLY -- two log-corrected OLS fits (eflow_attr = A*N^p*(ln N)^q) of the inherited ' +
    'surrogate numerator eflow_attr on a flank-centred 5 -> 7 rung widening (5-rung span 0.20 and 7-rung ' +
    'span 0.30, count-symmetric about the non-pole node k = 21.45, all rungs above the pole, built from ' +
    'imp-34572 far-side rungs verbatim -- W7f IS the imp-34572 far ladder), cross-validating the ' +
    'imp-34645 F1 ~10x SE collapse. The same widening off the pole buys only ~3.4x, and at the matched ' +
    'W7 span 0.30 the pole/flank W7 SE are comparable (~6e-6), so the pole ~10x is NOT a generic ' +
    'widening artifact -- it is entirely the pole W5 anomalous ill-conditioning (span 0.15 with the ' +
    'fine-clustered pole rung, impossible to reproduce off the pole). imp-34645 F1 is REFINED, and ' +
    'imp-34645 F2/F3 stand. Descriptive surrogate fit, NOT a rigorous asymptotic; the component model ' +
    'is the inherited imp-3220/imp-3406 extrapolation; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no ' +
    'RH verdict, NO QED; no refereed bound is changed.',
};

export const IMP34665_ASSERTIONS = [
  {
    // Reuse gate: the flank windows are count-symmetric about the non-pole node 21.45, sit ENTIRELY
    // above the pole, share the pole W7 span 0.30, and reuse the baked imp-34572 far eflow_attr values.
    id: 'imp-34665-flank-windows-off-pole',
    description: 'W5f/W7f centre on 21.45 (not k*), all rungs above the pole, W7f = imp-34572 far ladder',
    holds: () =>
      W5F_RUNGS.length === 5 &&
      W7F_RUNGS.length === 7 &&
      W5F_RUNGS[2].k === FLANK_CENTER &&
      W7F_RUNGS[3].k === FLANK_CENTER &&
      FLANK_CENTER !== KSTAR &&
      W5F_RUNGS.every((r) => r.k > KSTAR) &&
      W7F_RUNGS.every((r) => r.k > KSTAR) &&
      W7F_RUNGS.length === IMP34572_FAR_SIDE_RUNGS.length &&
      W5F_RUNGS[2].eflowAttr === 3.13739933e-15 &&
      W7F_RUNGS[0].eflowAttr === 4.33758269e-15 &&
      W7F_RUNGS[6].eflowAttr === 2.26896059e-15,
  },
  {
    // (F1) the flank 5 -> 7 rung widening collapses the SE only ~3.4x -- far below the pole ~10x.
    id: 'imp-34665-flank-collapse-far-below-pole',
    description: 'the flank 5 -> 7 rung widening collapses the SE only ~3.4x, well below the pole ~10x',
    holds: () =>
      Math.abs(FLANK_SE_RATIO - 3.386) < 1e-2 &&
      FLANK_SE_RATIO > 2 &&
      FLANK_SE_RATIO < 5 &&
      IMP34665_FLANK_COLLAPSE_FAR_BELOW_POLE === true &&
      POLE_SE_RATIO > 8, // imported pole ratio ~10x, reuse gate
  },
  {
    // (F2) at the matched W7 span the pole/flank W7 SE are comparable; the pole excess is its W5 start.
    id: 'imp-34665-pole-excess-is-in-w5-start',
    description: 'pole/flank W7 SE comparable (<1.5x) at matched span; the pole W5 SE is ~3.5x the flank W5 SE',
    holds: () =>
      IMP34665_W7_SE_POLE_FLANK_COMPARABLE === true &&
      W7_SE_MATCH_FACTOR > 1 &&
      Math.abs(POLE_W5_SE_OVER_FLANK_W5_SE - 3.514) < 5e-2 &&
      IMP34665_POLE_EXCESS_IS_IN_W5_START === true,
  },
  {
    // Sanity gate: both flank slopes recover the far-flank ~-2.309 with tiny residuals; W7f matches the
    // imp-34645 far baseline slope -2.309037 (W7f = the imp-34572 far ladder, reuse cross-check).
    id: 'imp-34665-flank-slopes-consistent',
    description: 'both flank leading slopes sit at ~-2.309 with negligible residuals; W7f = -2.309037',
    holds: () =>
      Math.abs(W5F.perKSlope + 2.309059) < 1e-5 &&
      Math.abs(W7F.perKSlope + 2.309037) < 1e-5 &&
      W5F.rmsLogResid < 1e-6 &&
      W7F.rmsLogResid < 1e-6,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp-34665-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34665_EFLOW_ATTR_FLANK_WINDOW_WIDEN_SE_CROSSVAL.isRigorous === false &&
      /NO QED/.test(IMP34665_EFLOW_ATTR_FLANK_WINDOW_WIDEN_SE_CROSSVAL.honest) &&
      /refereed bound is changed/i.test(IMP34665_EFLOW_ATTR_FLANK_WINDOW_WIDEN_SE_CROSSVAL.honest),
  },
];

for (const a of IMP34665_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34665-eflow-attr-flank-window-widen-se-crossval assertion failed: ${a.id}`);
  }
}
