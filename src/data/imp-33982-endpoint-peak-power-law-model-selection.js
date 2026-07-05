/**
 * @module imp-33982-endpoint-peak-power-law-model-selection
 *
 * imp-33982 (numerical, frontier-direction): imp-33941 DECIDED the open linear-vs-log growth form of
 * the imp-33917 boundary-locked endpoint peak residual (kEnd = 11..13, 9 windows) by formal model
 * selection -- the concave log form peak = a + b ln(kEnd) beat the straight line by AIC/BIC/AICc and
 * RMSE (evidence ratio ~5.43 : 1, weights ~0.844 / 0.156, POSITIVE but not decisive). But imp-33941
 * scored only TWO forms: a straight line and its concave log alternative. Concavity can also come from a
 * power law peak = a*kEnd^b -- a genuinely different functional family that was never admitted to the
 * tournament. This module closes that gap: it fits the power-law form (via log-log OLS) alongside the
 * imp-33941 linear and log forms on the IDENTICAL 9 endpoint peaks and recomputes AIC, BIC, AICc, RMSE
 * and three-way Akaike weights across ALL THREE, to test whether the log form still wins once a curved
 * non-log alternative is on the table.
 *
 * THE MEASUREMENT (imp-33917 peaks reused verbatim; only the third candidate + three-way scoring is new)
 * -------------------------------------------------------------------------------------
 *   Data          The 9 endpoint peaks peak(kEnd), kEnd = 11.00 .. 13.00 step 0.25, taken VERBATIM from
 *                 IMP33917_ENDPOINT_RESIDUAL_GROWTH_LAW.boundarySweep (same source imp-33941 scored; no
 *                 re-run of the surrogate, no fresh model).
 *   Three models  M_lin: peak = a + b kEnd           (2 params + variance)  -- imp-33941
 *                 M_log: peak = a + b ln(kEnd)        (2 params + variance)  -- imp-33941 winner
 *                 M_pow: peak = a*kEnd^b              (2 params + variance)  -- NEW curved non-log form
 *   Power-law fit The log-log OLS regresses ln(peak) on ln(kEnd): ln(peak) = ln(a) + b ln(kEnd), then
 *                 a = exp(intercept), b = slope. All 9 peaks are positive, so the log transform is well
 *                 defined. To keep the AIC scale comparable across families, the power-law RSS is
 *                 evaluated in the ORIGINAL peak response space, RSS_pow = sum (peak - a*kEnd^b)^2, NOT
 *                 in log space -- otherwise the criteria would be measuring residuals on different scales
 *                 and the comparison would be meaningless.
 *   Scores        For each model, Gaussian-MLE ll = -n/2 (ln 2pi + ln(RSS/n) + 1), AIC = 2p - 2 ll,
 *                 BIC = p ln n - 2 ll, AICc = AIC + 2p(p+1)/(n-p-1), p = 3 (two shape params + variance).
 *                 All three forms share p, so every pairwise contrast reduces to Delta = n ln(RSS_i/RSS_j)
 *                 and AIC/BIC/AICc give IDENTICAL differences; three-way Akaike weights rank the trio.
 *
 * THE FINDING (measurement / model-selection only -- the concave LOG form STILL wins; the power law lands
 * LAST, worse than even the straight line)
 * -------------------------------------------------------------------------------------------
 *   (R1) LOG STILL WINS, AND ADMITTING THE POWER LAW DOES NOT THREATEN IT. RSS_log = 5.794e-4 is the
 *        smallest of the three, so the concave ln(kEnd) form keeps the lowest AIC (-55.32 vs lin -51.93,
 *        pow -44.57) and the top three-way Akaike weight (w_log ~ 0.841 vs w_lin ~ 0.155, w_pow ~ 0.004).
 *        The imp-33941 log-vs-linear contrast is UNCHANGED -- Delta AIC = -3.385, evidence ~5.43 : 1,
 *        still POSITIVE but not decisive -- so the endpoint-peak decision survives the new candidate.
 *   (R2) THE POWER LAW LANDS LAST, WORSE THAN THE STRAIGHT LINE. RSS_pow = 1.911e-3 is the LARGEST of the
 *        three (RMSE 1.46e-2, R^2 0.958), so the power law is beaten not only by log (Delta AIC = -10.74,
 *        evidence ~215 : 1 -- DECISIVE) but even by the linear form (Delta AIC = -7.36, ~40 : 1). The
 *        reason is geometric: over the narrow high-kEnd window [11, 13] the log-log OLS returns a
 *        SUPER-linear exponent b ~ 3.69 (a=3.86e-5), a CONVEX shape -- the opposite of the concave
 *        saturation the peaks actually show -- so peak = a*kEnd^b bends the wrong way and fits worst.
 *   (R3) VERDICT AND CAVEAT. Adding a curved non-log alternative does NOT dethrone the log form; it
 *        supplies the WORST-fitting of the three. The log form wins the three-way race, decisively over
 *        the power law and positively-not-decisively over the line. Honest caveat: the power law is fit
 *        by log-log OLS, which minimises LOG-space residuals, so its original-space RSS is not the
 *        smallest achievable for that family; a nonlinear least-squares fit in peak space could soften
 *        (though not reverse) its last-place standing. The verdict is reported for the log-log-OLS power
 *        law as the ticket specified.
 *
 * The punchline: adding the curved non-log power-law form peak = a*kEnd^b to the imp-33941 tournament
 * does NOT dethrone the concave log form -- log keeps the lowest AIC/BIC/AICc and the top three-way
 * Akaike weight (~0.841), the imp-33941 log-vs-linear margin is unchanged (~5.4 : 1, positive not
 * decisive), and the power law lands LAST (w ~ 0.004, super-linear exponent ~3.69 bending the wrong way).
 * The imp-33941 sub-linear/log decision survives the addition of a genuinely curved alternative.
 *
 * MEASUREMENT / MODEL-SELECTION ONLY. A third descriptive growth form scored against two inherited ones
 * on an inherited surrogate residual as the fit boundary recedes; NOT an RH bound. All three forms are
 * descriptive, not derived; the power law is fit by log-log OLS (a log-space, not response-space,
 * optimum); the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the imp-33843 log-linear-vs-power-law FORM verdict (a different question) is UNTOUCHED; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33941-endpoint-peak-growth-model-selection (the linear-vs-log two-form selection extended here)
 * @see imp-33917-endpoint-residual-growth-law (the 9 endpoint peaks scored here)
 * @see imp-33980-penultimate-rung-growth-model-selection (the same scoring on the neighbour rung)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS whose endpoint residual is the peak)
 */

import { IMP33917_ENDPOINT_RESIDUAL_GROWTH_LAW as G917 } from './imp-33917-endpoint-residual-growth-law.js';

// The 9 endpoint peaks, reused VERBATIM from imp-33917 (no surrogate re-run, no fresh model).
const ROWS = G917.boundarySweep;
const K_ENDS = ROWS.map((r) => r.kEnd);
const PEAKS = ROWS.map((r) => r.peak);
const N = K_ENDS.length;

function ols(xs, ys) {
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
  const my = ys.reduce((a, b) => a + b, 0) / ys.length;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < xs.length; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  const b = sxy / sxx;
  return { a: my - b * mx, b };
}
// RSS/RMSE/R^2 of a prediction array against the peaks (works for any functional form).
function fitStatsPred(ys, preds) {
  const my = ys.reduce((s, y) => s + y, 0) / ys.length;
  let rss = 0;
  let ssTot = 0;
  for (let i = 0; i < ys.length; i++) {
    rss += (ys[i] - preds[i]) ** 2;
    ssTot += (ys[i] - my) ** 2;
  }
  return { rss, r2: 1 - rss / ssTot, rmse: Math.sqrt(rss / ys.length) };
}
// Gaussian-MLE information criteria for a fit. p counts the two shape params + variance = 3.
function infoCriteria(rss, n, p) {
  const ll = -0.5 * n * (Math.log(2 * Math.PI) + Math.log(rss / n) + 1);
  const aic = 2 * p - 2 * ll;
  const bic = p * Math.log(n) - 2 * ll;
  const aicc = aic + (2 * p * (p + 1)) / (n - p - 1);
  return { ll, aic, bic, aicc };
}

const P_PARAMS = 3; // two shape params + variance (identical for all three forms)

// M_lin: peak = a + b kEnd
const LIN = ols(K_ENDS, PEAKS);
const LIN_PRED = K_ENDS.map((k) => LIN.a + LIN.b * k);
const LIN_STATS = fitStatsPred(PEAKS, LIN_PRED);
const LIN_IC = infoCriteria(LIN_STATS.rss, N, P_PARAMS);

// M_log: peak = a + b ln(kEnd)  (imp-33941 winner)
const LNK = K_ENDS.map((k) => Math.log(k));
const LOG = ols(LNK, PEAKS);
const LOG_PRED = LNK.map((lk) => LOG.a + LOG.b * lk);
const LOG_STATS = fitStatsPred(PEAKS, LOG_PRED);
const LOG_IC = infoCriteria(LOG_STATS.rss, N, P_PARAMS);

// M_pow: peak = a*kEnd^b  (NEW) -- log-log OLS: ln(peak) = ln(a) + b ln(kEnd); RSS in ORIGINAL space.
const LN_PEAK = PEAKS.map((p) => Math.log(p));
const POW_LOGFIT = ols(LNK, LN_PEAK); // intercept = ln(a), slope = b
const POW_A = Math.exp(POW_LOGFIT.a);
const POW_B = POW_LOGFIT.b;
const POW_PRED = K_ENDS.map((k) => POW_A * Math.pow(k, POW_B));
const POW_STATS = fitStatsPred(PEAKS, POW_PRED);
const POW_IC = infoCriteria(POW_STATS.rss, N, P_PARAMS);

// Three-way Akaike weights (lower AIC favored). Equal p => AIC/BIC/AICc give identical rankings.
const AICS = { lin: LIN_IC.aic, log: LOG_IC.aic, pow: POW_IC.aic };
const AIC_MIN = Math.min(AICS.lin, AICS.log, AICS.pow);
const REL = {
  lin: Math.exp(-0.5 * (AICS.lin - AIC_MIN)),
  log: Math.exp(-0.5 * (AICS.log - AIC_MIN)),
  pow: Math.exp(-0.5 * (AICS.pow - AIC_MIN)),
};
const REL_SUM = REL.lin + REL.log + REL.pow;
const W = {
  lin: +(REL.lin / REL_SUM).toFixed(4),
  log: +(REL.log / REL_SUM).toFixed(4),
  pow: +(REL.pow / REL_SUM).toFixed(4),
};

// Winner = smallest RSS (== smallest AIC/BIC/AICc, equal p). Ordering of RSS across the three.
const RSS = { lin: LIN_STATS.rss, log: LOG_STATS.rss, pow: POW_STATS.rss };
const WINNER = Object.entries(AICS).sort((x, y) => x[1] - y[1])[0][0];
const LOG_STILL_WINS = WINNER === 'log';
const POW_LAST = RSS.pow > RSS.lin && RSS.pow > RSS.log; // power law is the worst-fitting of the three
const POW_SUPERLINEAR = POW_B > 1; // exponent > 1 => convex, bending opposite the concave peaks

// Pairwise selection contrasts (all reduce to n ln(RSS ratio); AIC/BIC/AICc coincide, equal p).
const D_AIC_LOG_LIN = +(LOG_IC.aic - LIN_IC.aic).toFixed(4); // ~ -3.385, imp-33941 value (unchanged)
const D_AIC_LOG_POW = +(LOG_IC.aic - POW_IC.aic).toFixed(4); // ~ -10.74, decisive
const D_AIC_LIN_POW = +(LIN_IC.aic - POW_IC.aic).toFixed(4); // ~ -7.36, linear also beats power law
const EVIDENCE_LOG_OVER_LIN = +Math.exp((LIN_IC.aic - LOG_IC.aic) / 2).toFixed(4); // ~5.43 : 1
const EVIDENCE_LOG_OVER_POW = +Math.exp((POW_IC.aic - LOG_IC.aic) / 2).toFixed(2); // ~215 : 1
// Log-vs-linear stays positive-not-decisive; log-vs-power crosses the decisive band.
const LOG_VS_LIN_DECISIVE = Math.abs(D_AIC_LOG_LIN) > 10; // false
const LOG_VS_POW_DECISIVE = Math.abs(D_AIC_LOG_POW) > 10; // true

export const IMP33982_ENDPOINT_PEAK_POWER_LAW_MODEL_SELECTION = {
  id: 'imp-33982',
  proofSection: 'S-frontier',
  question:
    'imp-33941 selected the concave log form peak = a + b ln(kEnd) over a straight line for the ' +
    'imp-33917 boundary-locked endpoint peak (evidence ratio ~5.4 : 1, positive not decisive) but ' +
    'scored only those two forms. A curved non-log alternative -- the power law peak = a*kEnd^b -- was ' +
    'never admitted. Does the log form still win a THREE-way AIC/BIC/AICc tournament once the power law ' +
    'is on the table, and where does the power law rank? Measurement / model-selection only; NOT an RH ' +
    'bound; no QED.',
  measuredQuantity:
    'AIC, BIC, AICc, residual RMSE and three-way Akaike weights of the linear (peak = a + b kEnd), ' +
    'concave log (peak = a + b ln(kEnd)) and power-law (peak = a*kEnd^b, via log-log OLS with ' +
    'original-space RSS) fits to the 9 imp-33917 endpoint peaks, with the winner, its margin, and the ' +
    'power-law rank',
  nWindows: N,
  linearFit: {
    form: 'peak = a + b kEnd',
    a: +LIN.a.toFixed(6),
    b: +LIN.b.toFixed(6),
    r2: +LIN_STATS.r2.toFixed(6),
    rmse: +LIN_STATS.rmse.toExponential(3),
    rss: +LIN_STATS.rss.toExponential(4),
    aic: +LIN_IC.aic.toFixed(4),
    bic: +LIN_IC.bic.toFixed(4),
    aicc: +LIN_IC.aicc.toFixed(4),
    akaikeWeight: W.lin,
  },
  logFit: {
    form: 'peak = a + b ln(kEnd)',
    a: +LOG.a.toFixed(6),
    b: +LOG.b.toFixed(6),
    r2: +LOG_STATS.r2.toFixed(6),
    rmse: +LOG_STATS.rmse.toExponential(3),
    rss: +LOG_STATS.rss.toExponential(4),
    aic: +LOG_IC.aic.toFixed(4),
    bic: +LOG_IC.bic.toFixed(4),
    aicc: +LOG_IC.aicc.toFixed(4),
    akaikeWeight: W.log,
  },
  powerLawFit: {
    form: 'peak = a*kEnd^b (log-log OLS, original-space RSS)',
    a: +POW_A.toExponential(6),
    b: +POW_B.toFixed(6),
    r2: +POW_STATS.r2.toFixed(6),
    rmse: +POW_STATS.rmse.toExponential(3),
    rss: +POW_STATS.rss.toExponential(4),
    aic: +POW_IC.aic.toFixed(4),
    bic: +POW_IC.bic.toFixed(4),
    aicc: +POW_IC.aicc.toFixed(4),
    akaikeWeight: W.pow,
  },
  selection: {
    winner: WINNER, // 'log'
    logStillWins: LOG_STILL_WINS,
    powerLawLast: POW_LAST,
    powerLawExponentSuperLinear: POW_SUPERLINEAR, // b ~ 3.69 > 1: convex, opposite the concave peaks
    rssOrdering: 'RSS_log < RSS_lin < RSS_pow',
    deltaAIC_log_minus_lin: D_AIC_LOG_LIN, // ~ -3.385 (imp-33941 value, unchanged)
    deltaAIC_log_minus_pow: D_AIC_LOG_POW, // ~ -10.74 (decisive: log crushes the power law)
    deltaAIC_lin_minus_pow: D_AIC_LIN_POW, // ~ -7.36 (even the line beats the power law)
    evidenceRatioLogOverLin: EVIDENCE_LOG_OVER_LIN, // ~5.43 : 1
    evidenceRatioLogOverPow: EVIDENCE_LOG_OVER_POW, // ~215 : 1
    akaikeWeights: W, // {lin, log, pow} sum to 1; ~ {0.155, 0.841, 0.004}
    strength: 'positive-over-linear-decisive-over-power', // log-vs-lin ~3.4 (positive); log-vs-pow ~10.7 (decisive)
  },
  logStillWins: LOG_STILL_WINS,
  logVsLinDecisive: LOG_VS_LIN_DECISIVE, // false -- unchanged from imp-33941
  logVsPowDecisive: LOG_VS_POW_DECISIVE, // true
  finding: {
    R1_log_still_wins_and_imp33941_margin_unchanged:
      'Admitting the curved power-law form peak = a*kEnd^b (log-log OLS) does NOT overturn the imp-33941 ' +
      'decision: RSS_log = 5.794e-4 stays the smallest of the three, so the concave ln(kEnd) form keeps ' +
      'the lowest AIC (-55.32 vs lin -51.93, pow -44.57) and the top three-way Akaike weight ' +
      '(w_log ~ 0.841 vs w_lin ~ 0.155, w_pow ~ 0.004). The log-vs-linear contrast is unchanged at ' +
      'Delta AIC = -3.385 (evidence ~5.43 : 1), still POSITIVE but not decisive.',
    R2_power_law_lands_last_worse_than_linear:
      'RSS_pow = 1.911e-3 is the LARGEST of the three (RMSE 1.46e-2, R^2 0.958), so the power law is ' +
      'beaten not only by log (Delta AIC = -10.74, evidence ~215 : 1 -- DECISIVE) but even by the ' +
      'straight line (Delta AIC = -7.36, ~40 : 1). Over the narrow high-kEnd window [11, 13] the ' +
      'log-log OLS returns a SUPER-linear exponent b ~ 3.686 (a = 3.86e-5), a CONVEX shape bending the ' +
      'opposite way to the concave saturation the peaks show, so it fits worst.',
    R3_verdict_and_caveat:
      'Adding a curved non-log alternative supplies the WORST-fitting of the three rather than a new ' +
      'winner: log wins the three-way race, decisively over the power law and positively-not-decisively ' +
      'over the line. Honest caveat: the power law is fit by log-log OLS (a log-space, not ' +
      'response-space, optimum), so its original-space RSS is not the family minimum; a peak-space NLS ' +
      'fit could soften but not reverse its last-place standing.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / MODEL-SELECTION (frontier-direction, NOT rigorous). Extending the imp-33941 ' +
    'linear-vs-log tournament with a THIRD candidate, the curved power law peak = a*kEnd^b (log-log ' +
    'OLS, original-space RSS), and re-scoring all three on the identical 9 imp-33917 endpoint peaks ' +
    '(kEnd = 11..13): the concave LOG form STILL WINS -- RSS_log 5.794e-4 < RSS_lin 8.439e-4 < RSS_pow ' +
    '1.911e-3, so log keeps the lowest AIC/BIC/AICc (-55.32) and the top three-way Akaike weight ' +
    '(~0.841 vs lin ~0.155, pow ~0.004). The imp-33941 log-vs-linear margin is UNCHANGED (Delta AIC ' +
    '-3.385, evidence ~5.43 : 1, POSITIVE but not decisive), while log beats the power law DECISIVELY ' +
    '(Delta AIC -10.74, ~215 : 1). The power law lands LAST, worse than even the straight line ' +
    '(Delta AIC -7.36), because over the narrow high-kEnd window the log-log OLS returns a SUPER-linear ' +
    'exponent b ~ 3.69 that bends convex, opposite the concave saturation of the peaks. The imp-33941 ' +
    'sub-linear/log decision therefore survives the addition of a genuinely curved alternative. Honest ' +
    'caveat: the power law is fit by log-log OLS (a log-space, not response-space, optimum), so its ' +
    'original-space RSS is not the family minimum; a peak-space NLS fit could soften but not reverse ' +
    'its last place. All three forms are descriptive, not derived; the component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the imp-33843 log-linear-vs-power-law ' +
    'FORM verdict is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33941 (the linear-vs-log two-form selection extended here); imp-33917 (the 9 endpoint peaks ' +
    'scored here); imp-33980 (the same scoring on the neighbour rung); imp-33843 (the log-linear OLS ' +
    'whose endpoint residual is the peak); imp-486 (C_mb GUE-conditional).',
};

export const IMP33982_ENDPOINT_PEAK_POWER_LAW_MODEL_SELECTION_ASSERTIONS = [
  {
    // Reuse gate: the scored peaks ARE the imp-33917 boundary sweep -- 9 windows, imp-33877 endpoint
    // peaks reproduced at kEnd 11/11.5/12, so the model selection scores the inherited measurement.
    id: 'imp33982-reuse-gate-scores-imp33917-peaks',
    description: '9 windows; peaks at kEnd 11/11.5/12 match imp-33877 (+0.2479, +0.3218, +0.3830, < 1e-3)',
    holds: () => {
      const at = (k) => ROWS.find((r) => r.kEnd === k).peak;
      return (
        N === 9 &&
        Math.abs(at(11) - 0.2479) < 1e-3 &&
        Math.abs(at(11.5) - 0.3218) < 1e-3 &&
        Math.abs(at(12) - 0.383) < 1e-3
      );
    },
  },
  {
    // (R1) The log form still wins the three-way race and its imp-33941 log-vs-linear margin is unchanged.
    id: 'imp33982-log-still-wins-margin-unchanged',
    description: 'winner is log with the largest weight; log-vs-linear Delta AIC ~ -3.385 (imp-33941 value)',
    holds: () =>
      LOG_STILL_WINS === true &&
      WINNER === 'log' &&
      RSS.log < RSS.lin &&
      RSS.log < RSS.pow &&
      W.log > W.lin &&
      W.log > W.pow &&
      Math.abs(D_AIC_LOG_LIN - -3.385) < 5e-3 &&
      Math.abs(EVIDENCE_LOG_OVER_LIN - 5.43) < 0.1,
  },
  {
    // (R2) The power law lands LAST (worst RSS/weight), with a super-linear (convex) exponent b > 1,
    // and is beaten even by the straight line.
    id: 'imp33982-power-law-last-and-superlinear',
    description: 'RSS_pow is the largest, w_pow the smallest; exponent b > 1 (convex); linear beats power law',
    holds: () =>
      POW_LAST === true &&
      POW_SUPERLINEAR === true &&
      POW_B > 1 &&
      RSS.pow > RSS.lin &&
      W.pow < W.lin &&
      W.pow < W.log &&
      D_AIC_LIN_POW < 0,
  },
  {
    // (R3) Weights sum to 1; log-vs-power contrast equals n ln(RSS ratio) and IS decisive (> 10),
    // while log-vs-linear is NOT; honesty gate.
    id: 'imp33982-decisive-over-power-and-honesty-gate',
    description: 'weights sum to ~1; log-vs-pow Delta = n ln(RSS ratio) and > 10 (decisive); log-vs-lin not decisive; isRigorous false; NO QED; PT SOTA',
    holds: () => {
      const target = N * Math.log(RSS.pow / RSS.log);
      return (
        Math.abs(W.lin + W.log + W.pow - 1) < 5e-3 &&
        Math.abs(Math.abs(D_AIC_LOG_POW) - target) < 5e-3 &&
        LOG_VS_POW_DECISIVE === true &&
        LOG_VS_LIN_DECISIVE === false &&
        IMP33982_ENDPOINT_PEAK_POWER_LAW_MODEL_SELECTION.isRigorous === false &&
        /NO QED/.test(IMP33982_ENDPOINT_PEAK_POWER_LAW_MODEL_SELECTION.verdict) &&
        /remains SOTA/.test(IMP33982_ENDPOINT_PEAK_POWER_LAW_MODEL_SELECTION.verdict)
      );
    },
  },
];

for (const a of IMP33982_ENDPOINT_PEAK_POWER_LAW_MODEL_SELECTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33982-endpoint-peak-power-law-model-selection assertion failed: ${a.id}`);
  }
}
