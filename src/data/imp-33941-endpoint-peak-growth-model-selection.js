/**
 * @module imp-33941-endpoint-peak-growth-model-selection
 *
 * imp-33941 (accuracy, frontier-direction): imp-33917 fit the boundary-locked endpoint peak residual
 * of the imp-33843 log-linear widening fit over 9 windows kEnd = 11.00 .. 13.00 with BOTH a linear
 * form (peak = a + b kEnd, R^2 ~ 0.9813) AND a concave log form (peak = a + b ln(kEnd), R^2 ~ 0.9872),
 * calling the log form "marginally better" -- but it never DECIDED which growth form the peak actually
 * follows: it reported two descriptive R^2 values and stopped. Higher R^2 alone does not select a model
 * (here the two forms even carry the same parameter count, so R^2 ordering is the whole story only if
 * the gap is significant). This module closes that gap: it recomputes BOTH fits on the identical 9-window
 * imp-33917 boundary sweep and reports formal model-selection scores -- AIC, BIC, AICc, and residual
 * RMSE -- for each, states which form is favored, and quantifies by HOW MUCH (Akaike weights, evidence
 * ratio).
 *
 * THE MEASUREMENT (imp-33917 peaks reused verbatim; only the growth-model scoring is new)
 * -------------------------------------------------------------------------------------
 *   Data          The 9 endpoint peaks peak(kEnd), kEnd = 11.00 .. 13.00 step 0.25, taken VERBATIM from
 *                 IMP33917_ENDPOINT_RESIDUAL_GROWTH_LAW.boundarySweep (no re-run of the surrogate, no
 *                 fresh model -- the reuse gate re-checks the imp-33877 published peaks at 11/11.5/12).
 *   Two models    M_lin: peak = a + b kEnd          (2 params + variance)
 *                 M_log: peak = a + b ln(kEnd)       (2 params + variance) -- concave alternative
 *   Scores        For each model, Gaussian-MLE log-likelihood ll = -n/2 (ln 2pi + ln(RSS/n) + 1),
 *                 AIC = 2p - 2 ll, BIC = p ln n - 2 ll, AICc = AIC + 2p(p+1)/(n-p-1), with p = 3
 *                 (intercept, slope, variance), plus RMSE = sqrt(RSS/n).
 *   Selection     Lower AIC/BIC/AICc favored. Since the two models share p, every criterion reduces to
 *                 the SAME contrast Delta = n ln(RSS_lin/RSS_log): AIC, BIC and AICc give IDENTICAL
 *                 differences here (the +2p, +p ln n, and small-sample corrections cancel), so the
 *                 selection is unambiguous across all three criteria and equals the RMSE ordering, but
 *                 the AIC scale converts that ordering into an interpretable strength (Akaike weights).
 *
 * THE FINDING (measurement / model-selection only -- the concave LOG form is favored, positively but
 * NOT decisively, across AIC/BIC/AICc and RMSE)
 * -------------------------------------------------------------------------------------------
 *   (R1) LOG FORM FAVORED BY EVERY CRITERION. RSS_log = 5.794e-4 < RSS_lin = 8.439e-4, so the concave
 *        ln(kEnd) form beats the straight line on residual RMSE (8.02e-3 vs 9.68e-3) and, with equal
 *        parameter counts, on AIC (-55.32 vs -51.93), BIC (-54.72 vs -51.34) and AICc (-50.52 vs -47.13)
 *        alike. The "marginally better" imp-33917 log fit is now a DECISION: the boundary-locked peak
 *        growth follows the concave (sub-linear) form over the linear form.
 *   (R2) STRENGTH: POSITIVE, NOT DECISIVE. Delta AIC = Delta BIC = Delta AICc = -3.385 (log minus linear),
 *        i.e. exactly n ln(RSS_lin/RSS_log). The Akaike evidence ratio is exp(3.385/2) ~ 5.43 : 1 in
 *        favor of log, giving weights w_log ~ 0.844 vs w_lin ~ 0.156. By the usual reading a gap of
 *        ~3.4 is POSITIVE evidence (Delta > 2) but short of the strong/decisive band (Delta > ~6-10):
 *        the line is not excluded, it is merely ~5x less supported by the 9 points.
 *   (R3) CONSISTENT WITH, AND SHARPENS, imp-33917. The concavity imp-33917 read off the negative second
 *        differences and the marginal R^2 edge is confirmed as the SELECTED model, not just a slightly
 *        tighter descriptive fit. The edge-artifact reading (peak scales with the boundary) is untouched;
 *        this only fixes the FORM of that scaling as sub-linear/log rather than linear. The imp-33843
 *        log-linear-over-power-law FORM verdict (a different question entirely) is untouched.
 *
 * The punchline: formal model selection on the 9 imp-33917 endpoint peaks (kEnd = 11..13) DECIDES the
 * open linear-vs-log question -- the concave log form peak = a + b ln(kEnd) is favored by AIC, BIC, AICc
 * and RMSE alike (Delta AIC = -3.385, evidence ratio ~5.4:1, weights ~0.84/0.16), a POSITIVE but not
 * decisive margin, so the boundary-locked peak grows SUB-LINEARLY, not linearly.
 *
 * MEASUREMENT / MODEL-SELECTION ONLY. A scoring of two descriptive growth forms on an inherited
 * surrogate residual as the fit boundary recedes; NOT an RH bound. Both forms are descriptive, not
 * derived; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the OLS surrogate is descriptive, not derived; the imp-33843 log-linear-vs-power-law
 * verdict is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes
 * no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33917-endpoint-residual-growth-law (the 9 endpoint peaks + the two descriptive fits scored here)
 * @see imp-33877-widening-fit-tail-endpoint-artifact-test (the boundary-locked endpoint peak)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS whose endpoint residual is the peak)
 * @see imp-33940-interior-residual-boundary-stability (interior residual growth, sibling measurement)
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
function fitStats(xs, ys, a, b) {
  const my = ys.reduce((s, y) => s + y, 0) / ys.length;
  let rss = 0;
  let ssTot = 0;
  for (let i = 0; i < xs.length; i++) {
    rss += (ys[i] - (a + b * xs[i])) ** 2;
    ssTot += (ys[i] - my) ** 2;
  }
  return { rss, r2: 1 - rss / ssTot, rmse: Math.sqrt(rss / xs.length) };
}
// Gaussian-MLE information criteria for an OLS fit. p counts intercept + slope + variance = 3.
function infoCriteria(rss, n, p) {
  const ll = -0.5 * n * (Math.log(2 * Math.PI) + Math.log(rss / n) + 1);
  const aic = 2 * p - 2 * ll;
  const bic = p * Math.log(n) - 2 * ll;
  const aicc = aic + (2 * p * (p + 1)) / (n - p - 1);
  return { ll, aic, bic, aicc };
}

const P_PARAMS = 3; // intercept + slope + variance (identical for both forms)

// M_lin: peak = a + b kEnd
const LIN = ols(K_ENDS, PEAKS);
const LIN_STATS = fitStats(K_ENDS, PEAKS, LIN.a, LIN.b);
const LIN_IC = infoCriteria(LIN_STATS.rss, N, P_PARAMS);

// M_log: peak = a + b ln(kEnd)  (concave alternative)
const LNK = K_ENDS.map((k) => Math.log(k));
const LOG = ols(LNK, PEAKS);
const LOG_STATS = fitStats(LNK, PEAKS, LOG.a, LOG.b);
const LOG_IC = infoCriteria(LOG_STATS.rss, N, P_PARAMS);

// Model-selection contrasts (log minus linear -- negative favors log). Equal p => all three coincide.
const D_AIC = +(LOG_IC.aic - LIN_IC.aic).toFixed(4);
const D_BIC = +(LOG_IC.bic - LIN_IC.bic).toFixed(4);
const D_AICC = +(LOG_IC.aicc - LIN_IC.aicc).toFixed(4);
const EVIDENCE_RATIO_LOG_OVER_LIN = +Math.exp((LIN_IC.aic - LOG_IC.aic) / 2).toFixed(4); // ~5.43 : 1
const W_LOG = +(EVIDENCE_RATIO_LOG_OVER_LIN / (1 + EVIDENCE_RATIO_LOG_OVER_LIN)).toFixed(4); // ~0.844
const W_LIN = +(1 - W_LOG).toFixed(4); // ~0.156

const LOG_FAVORED =
  LOG_STATS.rss < LIN_STATS.rss && D_AIC < 0 && D_BIC < 0 && D_AICC < 0 && LOG_STATS.rmse < LIN_STATS.rmse;
const DECISIVE = Math.abs(D_AIC) > 10; // strong/decisive band; here ~3.4 => POSITIVE, not decisive

export const IMP33941_ENDPOINT_PEAK_GROWTH_MODEL_SELECTION = {
  id: 'imp-33941',
  proofSection: 'S-frontier',
  question:
    'imp-33917 fit the boundary-locked endpoint peak residual over 9 windows kEnd = 11..13 with BOTH a ' +
    'linear form (R^2 ~ 0.9813) and a concave log form (R^2 ~ 0.9872) descriptively, calling log ' +
    '"marginally better", but never DECIDED which growth form the peak follows. Which form does formal ' +
    'model selection (AIC/BIC/AICc, RMSE) favor, and by how much? Measurement / model-selection only; ' +
    'NOT an RH bound; no QED.',
  measuredQuantity:
    'AIC, BIC, AICc and residual RMSE of the linear (peak = a + b kEnd) and concave log ' +
    '(peak = a + b ln(kEnd)) OLS fits to the 9 imp-33917 endpoint peaks, with the selection contrast ' +
    'Delta = score_log - score_lin, the Akaike evidence ratio and the Akaike model weights',
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
  },
  selection: {
    favored: 'log',
    deltaAIC_log_minus_lin: D_AIC, // ~ -3.385 (negative favors log)
    deltaBIC_log_minus_lin: D_BIC, // identical (equal parameter count)
    deltaAICc_log_minus_lin: D_AICC, // identical (small-sample correction cancels)
    equalsN_ln_rss_ratio: +(N * Math.log(LIN_STATS.rss / LOG_STATS.rss)).toFixed(4), // matches |Delta|
    evidenceRatioLogOverLin: EVIDENCE_RATIO_LOG_OVER_LIN, // ~5.43 : 1
    akaikeWeightLog: W_LOG, // ~0.844
    akaikeWeightLin: W_LIN, // ~0.156
    strength: 'positive-not-decisive', // |Delta AIC| ~3.4: > 2 (positive) but < ~6-10 (not decisive)
  },
  logFavored: LOG_FAVORED,
  decisive: DECISIVE, // false
  finding: {
    R1_log_favored_by_every_criterion:
      'RSS_log = 5.794e-4 < RSS_lin = 8.439e-4, so the concave ln(kEnd) form beats the straight line on ' +
      'RMSE (8.02e-3 vs 9.68e-3) and, with equal parameter counts, on AIC (-55.32 vs -51.93), BIC ' +
      '(-54.72 vs -51.34) and AICc (-50.52 vs -47.13) alike. The imp-33917 "marginally better" log fit ' +
      'is now a DECISION: the boundary-locked peak growth follows the concave (sub-linear) form.',
    R2_strength_positive_not_decisive:
      'Delta AIC = Delta BIC = Delta AICc = -3.385 (log minus linear) = n ln(RSS_lin/RSS_log) exactly. ' +
      'The Akaike evidence ratio is exp(3.385/2) ~ 5.43 : 1 for log, weights w_log ~ 0.844 vs ' +
      'w_lin ~ 0.156. A gap of ~3.4 is POSITIVE evidence (Delta > 2) but short of the decisive band ' +
      '(Delta > ~6-10): the line is not excluded, only ~5x less supported by the 9 points.',
    R3_consistent_with_imp33917:
      'The concavity imp-33917 read off the negative second differences and the marginal R^2 edge is ' +
      'confirmed as the SELECTED model, not just a tighter descriptive fit. The edge-artifact reading ' +
      '(peak scales with the boundary) is untouched; this only fixes the FORM of that scaling as ' +
      'sub-linear/log. The imp-33843 log-linear-over-power-law FORM verdict is a different question and ' +
      'is untouched.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / MODEL-SELECTION (frontier-direction, NOT rigorous). Scoring the two imp-33917 growth ' +
    'forms on the identical 9 endpoint peaks (kEnd = 11..13) DECIDES the open linear-vs-log question: ' +
    'the concave log form peak = a + b ln(kEnd) is favored by AIC, BIC, AICc and RMSE alike ' +
    '(RSS_log 5.794e-4 < RSS_lin 8.439e-4; Delta AIC = Delta BIC = Delta AICc = -3.385 = ' +
    'n ln(RSS_lin/RSS_log); evidence ratio ~5.43 : 1; weights ~0.844 / 0.156). The margin is POSITIVE ' +
    '(Delta > 2) but NOT decisive (Delta < ~6-10): the boundary-locked peak grows SUB-LINEARLY rather ' +
    'than linearly, and the linear form is ~5x less supported but not excluded. Consistent with and ' +
    'sharpening imp-33917 R2; the edge-artifact reading and the imp-33843 log-linear-vs-power-law ' +
    'verdict are UNTOUCHED. Both forms are descriptive, not derived; the OLS surrogate is descriptive, ' +
    'not derived; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-33917 (the 9 endpoint peaks and the two descriptive fits scored here); imp-33877 (the ' +
    'boundary-locked endpoint peak); imp-33843 (the log-linear OLS whose endpoint residual is the peak); ' +
    'imp-33940 (interior residual growth, sibling measurement); imp-486 (C_mb GUE-conditional).',
};

export const IMP33941_ENDPOINT_PEAK_GROWTH_MODEL_SELECTION_ASSERTIONS = [
  {
    // Reuse gate: the scored peaks ARE the imp-33917 boundary sweep -- 9 windows, imp-33877 endpoint
    // peaks reproduced at kEnd 11/11.5/12, so the model selection scores the inherited measurement.
    id: 'imp33941-reuse-gate-scores-imp33917-peaks',
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
    // (R1) The log form is favored by RMSE, AIC, BIC and AICc simultaneously (all deltas negative).
    id: 'imp33941-log-favored-by-every-criterion',
    description: 'RSS_log < RSS_lin and Delta AIC/BIC/AICc all < 0 and RMSE_log < RMSE_lin',
    holds: () =>
      LOG_FAVORED === true &&
      LOG_STATS.rss < LIN_STATS.rss &&
      D_AIC < 0 &&
      D_BIC < 0 &&
      D_AICC < 0 &&
      IMP33941_ENDPOINT_PEAK_GROWTH_MODEL_SELECTION.selection.favored === 'log',
  },
  {
    // (R2) The selection contrast equals n ln(RSS_lin/RSS_log), is ~ -3.385, identical across AIC/BIC/AICc
    // (equal p), and the evidence ratio ~5.4 : 1 => weights ~0.84 / 0.16; POSITIVE but not decisive.
    id: 'imp33941-strength-positive-not-decisive',
    description: 'Delta AIC = Delta BIC = Delta AICc ~ -3.385 = n ln(rss_lin/rss_log); ratio ~5.4, weights ~0.84/0.16; not decisive',
    holds: () => {
      const target = N * Math.log(LIN_STATS.rss / LOG_STATS.rss);
      return (
        Math.abs(D_AIC - -3.385) < 5e-3 &&
        Math.abs(D_BIC - D_AIC) < 1e-9 &&
        Math.abs(D_AICC - D_AIC) < 1e-9 &&
        Math.abs(Math.abs(D_AIC) - target) < 5e-3 &&
        Math.abs(EVIDENCE_RATIO_LOG_OVER_LIN - 5.43) < 0.1 &&
        Math.abs(W_LOG - 0.844) < 5e-3 &&
        Math.abs(W_LIN - 0.156) < 5e-3 &&
        DECISIVE === false
      );
    },
  },
  {
    // Honesty gate: model-selection verdict, isRigorous false, edge-artifact and imp-33843 verdict
    // untouched, no QED, no refereed bound is changed.
    id: 'imp33941-honesty-gate-no-qed',
    description: 'Measurement only: log-favored not decisive, isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33941_ENDPOINT_PEAK_GROWTH_MODEL_SELECTION.isRigorous === false &&
      IMP33941_ENDPOINT_PEAK_GROWTH_MODEL_SELECTION.selection.strength === 'positive-not-decisive' &&
      /NO QED/.test(IMP33941_ENDPOINT_PEAK_GROWTH_MODEL_SELECTION.verdict) &&
      /refereed bound is changed/i.test(IMP33941_ENDPOINT_PEAK_GROWTH_MODEL_SELECTION.verdict),
  },
];

for (const a of IMP33941_ENDPOINT_PEAK_GROWTH_MODEL_SELECTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33941-endpoint-peak-growth-model-selection assertion failed: ${a.id}`);
  }
}
