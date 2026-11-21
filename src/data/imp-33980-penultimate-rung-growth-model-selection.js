/**
 * @module imp-33980-penultimate-rung-growth-model-selection
 *
 * imp-33980 (numerical, frontier-direction): imp-33941 ran formal model selection (AIC/BIC/AICc/RMSE)
 * on the imp-33917 boundary-locked ENDPOINT peak residual over the kEnd = 11..13 sweep and DECIDED that
 * the concave log form peak = a + b ln(kEnd) beats the linear form peak = a + b kEnd (evidence ratio
 * ~5.43 : 1, weights ~0.844/0.156, POSITIVE but not decisive). Separately, imp-33940 R1 measured the
 * largest INTERIOR (non-last-rung) residual across the identical 9-window sweep, found it always sits at
 * the PENULTIMATE rung k = kEnd - 0.25, and rises sub-linearly +0.1575 -> +0.3829 (~143%, concave second
 * differences) -- but imp-33940 only CLASSIFIED that growth as concave/sub-linear from its second
 * differences; it never ran the same formal model selection imp-33941 applied to the endpoint. This
 * module closes that gap: does the concave-log form imp-33941 selected for the endpoint ALSO win for its
 * neighbour rung, or does the penultimate-rung residual follow a different growth form?
 *
 * THE MEASUREMENT (imp-33940 penultimate peaks reused VERBATIM; only the growth-model scoring is new)
 * --------------------------------------------------------------------------------------------------
 *   Data          The 9 penultimate-rung peaks peak(kEnd), kEnd = 11.00 .. 13.00 step 0.25, taken
 *                 VERBATIM from IMP33940_INTERIOR_RESIDUAL_BOUNDARY_STABILITY.interiorRows (each is the
 *                 largest non-last-rung residual, always at k = kEnd - 0.25). No surrogate re-run, no
 *                 fresh model -- the reuse gate re-checks the imp-33940 published anchors +0.1575/+0.3829.
 *   Two models    M_lin: peak = a + b kEnd          (2 params + variance)
 *                 M_log: peak = a + b ln(kEnd)       (2 params + variance) -- concave alternative
 *   Scores        For each model, Gaussian-MLE log-likelihood ll = -n/2 (ln 2pi + ln(RSS/n) + 1),
 *                 AIC = 2p - 2 ll, BIC = p ln n - 2 ll, AICc = AIC + 2p(p+1)/(n-p-1), with p = 3
 *                 (intercept, slope, variance), plus RMSE = sqrt(RSS/n) -- IDENTICAL scoring to imp-33941.
 *   Selection     Lower AIC/BIC/AICc favored. Since the two models share p, every criterion reduces to
 *                 the SAME contrast Delta = n ln(RSS_lin/RSS_log): AIC, BIC and AICc give IDENTICAL
 *                 differences, so the selection is unambiguous and equals the RMSE ordering; the AIC
 *                 scale converts that ordering into an interpretable strength (Akaike weights).
 *
 * THE FINDING (measurement / model-selection only -- the concave LOG form wins for the penultimate rung
 * TOO, and by a LARGER margin than the endpoint, but still POSITIVE not decisive)
 * -------------------------------------------------------------------------------------------------
 *   (R1) LOG FORM FAVORED BY EVERY CRITERION, JUST AS FOR THE ENDPOINT. RSS_log = 2.851e-4 < RSS_lin =
 *        4.861e-4, so the concave ln(kEnd) form beats the straight line on residual RMSE (5.63e-3 vs
 *        7.35e-3) and, with equal parameter counts, on AIC (-61.70 vs -56.90), BIC (-61.11 vs -56.30)
 *        and AICc (-56.90 vs -52.10) alike. The imp-33940 concave/sub-linear CLASSIFICATION of the
 *        penultimate rung is now a formal DECISION: the neighbour rung follows the SAME concave log
 *        growth form imp-33941 selected for the endpoint -- NOT a different form.
 *   (R2) MARGIN IS LARGER THAN THE ENDPOINT-S, YET STILL POSITIVE NOT DECISIVE. Delta AIC = Delta BIC =
 *        Delta AICc = -4.803 (log minus linear), i.e. exactly n ln(RSS_lin/RSS_log). The Akaike evidence
 *        ratio is exp(4.803/2) ~ 11.04 : 1 in favor of log (weights w_log ~ 0.917 vs w_lin ~ 0.083) --
 *        roughly DOUBLE the endpoint-s ~5.43 : 1. So the neighbour rung prefers the log form even more
 *        strongly than the endpoint, but the gap ~4.8 is still POSITIVE evidence (Delta > 2) and short
 *        of the strong/decisive band (Delta > ~6-10): the line is ~11x less supported but not excluded.
 *   (R3) CONSISTENT WITH imp-33940 R1 AND imp-33941. The penultimate rung tracking the endpoint (imp-33940
 *        R1: it grows in lockstep, concave) is confirmed at the level of formal model selection: the same
 *        concave-log form wins for both, so the edge artifact bleeding into the neighbour carries the same
 *        functional shape, not merely the same monotone/concave sign. The imp-33843 log-linear-vs-power-law
 *        FORM verdict (a different question entirely) and the edge-artifact reading are untouched.
 *
 * The punchline: applying the imp-33941 AIC/BIC/AICc/RMSE model selection to the imp-33940 penultimate-rung
 * peaks (kEnd = 11..13) shows the concave log form peak = a + b ln(kEnd) is favored by every criterion for
 * the neighbour rung TOO (RSS_log 2.851e-4 < RSS_lin 4.861e-4; Delta AIC = -4.803 = n ln(RSS_lin/RSS_log);
 * evidence ratio ~11.04 : 1, weights ~0.917/0.083) -- the SAME form as the endpoint, and by a LARGER margin
 * (~11:1 vs ~5.4:1), but still POSITIVE not decisive. The penultimate rung does NOT follow a different form.
 *
 * MEASUREMENT / MODEL-SELECTION ONLY. A scoring of two descriptive growth forms on an inherited surrogate
 * residual as the fit boundary recedes; NOT an RH bound. Both forms are descriptive, not derived; the
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the OLS
 * surrogate is descriptive, not derived; the imp-33843 log-linear-vs-power-law verdict is UNTOUCHED; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33940-interior-residual-boundary-stability (the 9 penultimate-rung peaks scored here)
 * @see imp-33941-endpoint-peak-growth-model-selection (the identical scoring applied to the endpoint peak)
 * @see imp-33917-endpoint-residual-growth-law (the endpoint boundary sweep the penultimate rung neighbours)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS whose residuals these peaks are)
 */

import { IMP33940_INTERIOR_RESIDUAL_BOUNDARY_STABILITY as G940 } from './imp-33940-interior-residual-boundary-stability.js';

// The 9 penultimate-rung peaks, reused VERBATIM from imp-33940 (no surrogate re-run, no fresh model).
const ROWS = G940.interiorRows;
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
const EVIDENCE_RATIO_LOG_OVER_LIN = +Math.exp((LIN_IC.aic - LOG_IC.aic) / 2).toFixed(4); // ~11.04 : 1
const W_LOG = +(EVIDENCE_RATIO_LOG_OVER_LIN / (1 + EVIDENCE_RATIO_LOG_OVER_LIN)).toFixed(4); // ~0.917
const W_LIN = +(1 - W_LOG).toFixed(4); // ~0.083

// The endpoint-peak evidence ratio imp-33941 reported, for the side-by-side comparison in R2.
const ENDPOINT_EVIDENCE_RATIO = 5.43; // imp-33941 selection.evidenceRatioLogOverLin
const MARGIN_LARGER_THAN_ENDPOINT = EVIDENCE_RATIO_LOG_OVER_LIN > ENDPOINT_EVIDENCE_RATIO;

const LOG_FAVORED =
  LOG_STATS.rss < LIN_STATS.rss && D_AIC < 0 && D_BIC < 0 && D_AICC < 0 && LOG_STATS.rmse < LIN_STATS.rmse;
const DECISIVE = Math.abs(D_AIC) > 10; // strong/decisive band; here ~4.8 => POSITIVE, not decisive

export const IMP33980_PENULTIMATE_RUNG_GROWTH_MODEL_SELECTION = {
  id: 'imp-33980',
  proofSection: 'S-frontier',
  question:
    'imp-33941 formally selected the concave log form peak = a + b ln(kEnd) over the linear form for the ' +
    'imp-33917 ENDPOINT peak residual (evidence ratio ~5.43 : 1). imp-33940 R1 found the largest INTERIOR ' +
    'residual is always the PENULTIMATE rung k = kEnd - 0.25 and classified its +0.1575 -> +0.3829 growth ' +
    'as concave/sub-linear, but never ran the same model selection. Does the concave-log form that won ' +
    'for the endpoint ALSO win for the neighbour rung, or does it follow a different form? Measurement / ' +
    'model-selection only; NOT an RH bound; no QED.',
  measuredQuantity:
    'AIC, BIC, AICc and residual RMSE of the linear (peak = a + b kEnd) and concave log ' +
    '(peak = a + b ln(kEnd)) OLS fits to the 9 imp-33940 penultimate-rung peaks, with the selection ' +
    'contrast Delta = score_log - score_lin, the Akaike evidence ratio and weights, and the side-by-side ' +
    'comparison against the imp-33941 endpoint evidence ratio',
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
    deltaAIC_log_minus_lin: D_AIC, // ~ -4.803 (negative favors log)
    deltaBIC_log_minus_lin: D_BIC, // identical (equal parameter count)
    deltaAICc_log_minus_lin: D_AICC, // identical (small-sample correction cancels)
    equalsN_ln_rss_ratio: +(N * Math.log(LIN_STATS.rss / LOG_STATS.rss)).toFixed(4), // matches |Delta|
    evidenceRatioLogOverLin: EVIDENCE_RATIO_LOG_OVER_LIN, // ~11.04 : 1
    akaikeWeightLog: W_LOG, // ~0.917
    akaikeWeightLin: W_LIN, // ~0.083
    strength: 'positive-not-decisive', // |Delta AIC| ~4.8: > 2 (positive) but < ~6-10 (not decisive)
    endpointEvidenceRatio: ENDPOINT_EVIDENCE_RATIO, // imp-33941: ~5.43 : 1
    marginLargerThanEndpoint: MARGIN_LARGER_THAN_ENDPOINT, // true: ~11 vs ~5.4
  },
  logFavored: LOG_FAVORED,
  decisive: DECISIVE, // false
  sameFormAsEndpoint: true, // concave log wins for BOTH the endpoint and its neighbour
  finding: {
    R1_log_favored_by_every_criterion:
      'RSS_log = 2.851e-4 < RSS_lin = 4.861e-4, so the concave ln(kEnd) form beats the straight line on ' +
      'RMSE (5.63e-3 vs 7.35e-3) and, with equal parameter counts, on AIC (-61.70 vs -56.90), BIC ' +
      '(-61.11 vs -56.30) and AICc (-56.90 vs -52.10) alike. The imp-33940 concave/sub-linear ' +
      'CLASSIFICATION of the penultimate rung is now a formal DECISION: the neighbour rung follows the ' +
      'SAME concave log growth form imp-33941 selected for the endpoint, NOT a different form.',
    R2_margin_larger_than_endpoint_still_not_decisive:
      'Delta AIC = Delta BIC = Delta AICc = -4.803 (log minus linear) = n ln(RSS_lin/RSS_log) exactly. ' +
      'The Akaike evidence ratio is exp(4.803/2) ~ 11.04 : 1 for log, weights w_log ~ 0.917 vs ' +
      'w_lin ~ 0.083 -- roughly DOUBLE the imp-33941 endpoint ~5.43 : 1. The neighbour rung prefers log ' +
      'even more strongly than the endpoint, but ~4.8 is still POSITIVE evidence (Delta > 2) and short of ' +
      'the decisive band (Delta > ~6-10): the line is ~11x less supported but not excluded.',
    R3_consistent_with_imp33940_and_imp33941:
      'The penultimate rung tracking the endpoint in lockstep (imp-33940 R1) is confirmed at the level of ' +
      'formal model selection: the same concave-log form wins for both, so the edge artifact bleeding into ' +
      'the neighbour carries the same FUNCTIONAL SHAPE, not merely the same monotone/concave sign. The ' +
      'imp-33843 log-linear-vs-power-law FORM verdict (a different question) and the edge-artifact reading ' +
      'are untouched.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / MODEL-SELECTION (frontier-direction, NOT rigorous). Applying the identical imp-33941 ' +
    'AIC/BIC/AICc/RMSE scoring to the imp-33940 penultimate-rung peaks (kEnd = 11..13, always at ' +
    'k = kEnd - 0.25) DECIDES the open form question: the concave log form peak = a + b ln(kEnd) is ' +
    'favored by AIC, BIC, AICc and RMSE alike (RSS_log 2.851e-4 < RSS_lin 4.861e-4; Delta AIC = Delta ' +
    'BIC = Delta AICc = -4.803 = n ln(RSS_lin/RSS_log); evidence ratio ~11.04 : 1; weights ~0.917/0.083) ' +
    '-- the SAME form imp-33941 selected for the endpoint, NOT a different form. The margin is LARGER ' +
    'than the endpoint-s ~5.43 : 1 (roughly double) yet still POSITIVE (Delta > 2) and NOT decisive ' +
    '(Delta < ~6-10): the neighbour rung prefers log even more strongly, and the linear form is ~11x less ' +
    'supported but not excluded. Consistent with imp-33940 R1 (penultimate rung tracks the endpoint) and ' +
    'imp-33941; the edge-artifact reading and the imp-33843 log-linear-vs-power-law verdict are ' +
    'UNTOUCHED. Both forms are descriptive, not derived; the OLS surrogate is descriptive, not derived; ' +
    'the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33940 (the 9 penultimate-rung peaks scored here); imp-33941 (the identical scoring applied to ' +
    'the endpoint peak); imp-33917 (the endpoint boundary sweep); imp-33843 (the log-linear OLS whose ' +
    'residuals these peaks are); imp-486 (C_mb GUE-conditional).',
};

export const IMP33980_PENULTIMATE_RUNG_GROWTH_MODEL_SELECTION_ASSERTIONS = [
  {
    // Reuse gate: the scored peaks ARE the imp-33940 penultimate-rung interior sweep -- 9 windows, with
    // the published anchors +0.1575 (kEnd=11) and +0.3829 (kEnd=13) reproduced verbatim.
    id: 'imp33980-reuse-gate-scores-imp33940-penultimate-peaks',
    description: '9 windows; first/last penultimate peaks match imp-33940 +0.157537/+0.382859 (< 1e-4)',
    holds: () =>
      N === 9 &&
      Math.abs(PEAKS[0] - 0.157537) < 1e-4 &&
      Math.abs(PEAKS[N - 1] - 0.382859) < 1e-4,
  },
  {
    // (R1) The log form is favored by RMSE, AIC, BIC and AICc simultaneously (all deltas negative) --
    // the same concave-log form imp-33941 selected for the endpoint.
    id: 'imp33980-log-favored-by-every-criterion',
    description: 'RSS_log < RSS_lin and Delta AIC/BIC/AICc all < 0 and RMSE_log < RMSE_lin; favored === log',
    holds: () =>
      LOG_FAVORED === true &&
      LOG_STATS.rss < LIN_STATS.rss &&
      D_AIC < 0 &&
      D_BIC < 0 &&
      D_AICC < 0 &&
      IMP33980_PENULTIMATE_RUNG_GROWTH_MODEL_SELECTION.selection.favored === 'log' &&
      IMP33980_PENULTIMATE_RUNG_GROWTH_MODEL_SELECTION.sameFormAsEndpoint === true,
  },
  {
    // (R2) The selection contrast equals n ln(RSS_lin/RSS_log), is ~ -4.803, identical across AIC/BIC/AICc
    // (equal p), evidence ratio ~11.04 : 1 => weights ~0.917/0.083, LARGER than the endpoint but still
    // POSITIVE not decisive.
    id: 'imp33980-margin-larger-than-endpoint-not-decisive',
    description: 'Delta AIC = Delta BIC = Delta AICc ~ -4.803 = n ln(rss_lin/rss_log); ratio ~11.04 > endpoint 5.43; weights ~0.917/0.083; not decisive',
    holds: () => {
      const target = N * Math.log(LIN_STATS.rss / LOG_STATS.rss);
      return (
        Math.abs(D_AIC - -4.803) < 5e-3 &&
        Math.abs(D_BIC - D_AIC) < 1e-9 &&
        Math.abs(D_AICC - D_AIC) < 1e-9 &&
        Math.abs(Math.abs(D_AIC) - target) < 5e-3 &&
        Math.abs(EVIDENCE_RATIO_LOG_OVER_LIN - 11.04) < 0.1 &&
        Math.abs(W_LOG - 0.917) < 5e-3 &&
        Math.abs(W_LIN - 0.083) < 5e-3 &&
        MARGIN_LARGER_THAN_ENDPOINT === true &&
        DECISIVE === false
      );
    },
  },
  {
    // Honesty gate: model-selection verdict, isRigorous false, same form as endpoint, imp-33843 verdict
    // untouched, no QED, no refereed bound is changed.
    id: 'imp33980-honesty-gate-no-qed',
    description: 'Measurement only: log-favored not decisive, isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33980_PENULTIMATE_RUNG_GROWTH_MODEL_SELECTION.isRigorous === false &&
      IMP33980_PENULTIMATE_RUNG_GROWTH_MODEL_SELECTION.selection.strength === 'positive-not-decisive' &&
      /NO QED/.test(IMP33980_PENULTIMATE_RUNG_GROWTH_MODEL_SELECTION.verdict) &&
      /refereed bound is changed/i.test(IMP33980_PENULTIMATE_RUNG_GROWTH_MODEL_SELECTION.verdict),
  },
];

for (const a of IMP33980_PENULTIMATE_RUNG_GROWTH_MODEL_SELECTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33980-penultimate-rung-growth-model-selection assertion failed: ${a.id}`);
  }
}
