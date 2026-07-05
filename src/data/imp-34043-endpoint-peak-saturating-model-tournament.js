/**
 * @module imp-34043-endpoint-peak-saturating-model-tournament
 *
 * imp-34043 (numerical, frontier-direction): imp-33982 scored THREE growth forms -- linear
 * (peak = a + b kEnd), concave log (peak = a + b ln(kEnd)) and power law (peak = a*kEnd^b) -- on the
 * 9 imp-33917 boundary-locked endpoint peaks (kEnd = 11..13) and the concave LOG form won
 * (w_log ~ 0.841, power law last w_pow ~ 0.004). But imp-33917 explicitly read the peak as NOT
 * saturating, so the natural DISCRIMINATING candidate -- a bounded / saturating family that
 * approaches a cap -- was never admitted to the tournament to test that reading. This module closes
 * that gap: it fits the saturating form peak = a - b/kEnd (a bounded, concave, monotone-increasing
 * curve with a finite cap a as kEnd -> inf) alongside the inherited three on the IDENTICAL 9 peaks,
 * and recomputes AIC, BIC, AICc, RMSE and FOUR-way Akaike weights, to test whether the boundary-locked
 * peak is better modeled as approaching a cap than by the winning concave-log form.
 *
 * THE MEASUREMENT (imp-33917 peaks reused verbatim; only the fourth candidate + four-way scoring is new)
 * -------------------------------------------------------------------------------------
 *   Data          The 9 endpoint peaks peak(kEnd), kEnd = 11.00 .. 13.00 step 0.25, taken VERBATIM from
 *                 IMP33917_ENDPOINT_RESIDUAL_GROWTH_LAW.boundarySweep (same source imp-33982 scored; no
 *                 re-run of the surrogate, no fresh model).
 *   Four models   M_lin: peak = a + b kEnd           (2 params + variance)  -- imp-33941
 *                 M_log: peak = a + b ln(kEnd)        (2 params + variance)  -- imp-33982 winner
 *                 M_pow: peak = a*kEnd^b              (2 params + variance)  -- imp-33982 (last)
 *                 M_sat: peak = a - b/kEnd            (2 params + variance)  -- NEW bounded/saturating cap
 *   Saturating fit peak = a - b/kEnd is LINEAR in its parameters: regress peak on the regressor
 *                 x = 1/kEnd, giving peak = a + c x with a = intercept (the finite cap) and c = slope,
 *                 then b = -c. Because the fit is linear-in-parameters, plain OLS returns the EXACT
 *                 response-space least-squares optimum -- unlike the log-log-OLS power law of imp-33982,
 *                 there is NO log-space vs response-space caveat here. As kEnd -> inf the peak -> a, so a
 *                 is the modeled ceiling; b > 0 gives a concave, decelerating rise toward it.
 *   Scores        For each model, Gaussian-MLE ll = -n/2 (ln 2pi + ln(RSS/n) + 1), AIC = 2p - 2 ll,
 *                 BIC = p ln n - 2 ll, AICc = AIC + 2p(p+1)/(n-p-1), p = 3 (two shape params + variance).
 *                 All four forms share p, so every pairwise contrast reduces to Delta = n ln(RSS_i/RSS_j)
 *                 and AIC/BIC/AICc give IDENTICAL differences; four-way Akaike weights rank the quartet.
 *
 * THE FINDING (measurement / model-selection only -- the saturating form WINS the fit and DETHRONES the
 * concave-log winner, but its fitted cap sits far above the data, so it does NOT confirm plateau)
 * -------------------------------------------------------------------------------------------
 *   (R1) THE SATURATING FORM WINS THE FOUR-WAY RACE. RSS_sat = 3.643e-4 is the SMALLEST of the four
 *        (RMSE 6.36e-3, R^2 0.9919), below the previous log winner RSS_log = 5.794e-4, so peak = a - b/kEnd
 *        takes the lowest AIC (-59.49 vs log -55.32, lin -51.93, pow -44.57) and the top four-way Akaike
 *        weight (w_sat ~ 0.872 vs w_log ~ 0.108, w_lin ~ 0.020, w_pow ~ 0.0005). Admitting the bounded
 *        family therefore DOES threaten the concave-log winner: the log form is dethroned into second.
 *   (R2) BUT THE WIN IS NOT DECISIVE, AND THE imp-33941 log-vs-linear MARGIN IS UNTOUCHED. The saturating
 *        edge over log is Delta AIC = +4.18 (evidence ~8.07 : 1 for sat over log) -- POSITIVE but not
 *        decisive (< 10). The inherited imp-33941 log-vs-linear contrast is UNCHANGED at Delta AIC =
 *        -3.385 (log still beats the line), and log still crushes the power law -- only the crown moves
 *        from log to sat, by a positive-not-decisive margin.
 *   (R3) THE WIN DOES NOT CONFIRM SATURATION -- IT RECONCILES WITH imp-33917. The fitted cap a = 1.678
 *        sits ~3.6x ABOVE the largest observed peak (0.465), so at kEnd = 13 the peaks reach only ~27.7%
 *        of the modeled ceiling and the curve is still rising steeply (slope 0.129 -> 0.093 across the
 *        window, decelerating). The saturating form thus wins by MATCHING THE CONCAVITY, not by
 *        plateauing inside the data: it agrees with imp-33917 that the peak does not saturate WITHIN the
 *        window (it climbs toward a DISTANT asymptote it never approaches over kEnd = 11..13). Better
 *        in-window fit is NOT evidence of physical saturation.
 *
 * The punchline: adding the bounded/saturating form peak = a - b/kEnd to the imp-33982 tournament
 * DETHRONES the concave-log winner on pure fit -- sat takes the lowest AIC/BIC/AICc and the top four-way
 * Akaike weight (~0.872 vs log ~0.108) -- but only by a positive-not-decisive margin (~8 : 1), the
 * imp-33941 log-vs-linear margin is unchanged, and the fitted cap (1.678) sits ~3.6x above the data, so
 * the win reflects better concavity-matching, NOT confirmation of a plateau. The saturating reading and
 * imp-33917 non-saturating reading are reconciled: the peak climbs sub-linearly toward a distant ceiling
 * it never reaches within the fit window.
 *
 * MEASUREMENT / MODEL-SELECTION ONLY. A fourth descriptive growth form scored against three inherited
 * ones on an inherited surrogate residual as the fit boundary recedes; NOT an RH bound. All four forms
 * are descriptive, not derived; the fitted saturation cap is a narrow-window extrapolation ~3.6x above
 * the data and asserts NO physical plateau; the component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the imp-33843 log-linear-vs-power-law FORM verdict (a
 * different question) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian
 * Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33982-endpoint-peak-power-law-model-selection (the three-form tournament extended here)
 * @see imp-33941-endpoint-peak-growth-model-selection (the linear-vs-log selection whose margin is checked)
 * @see imp-33917-endpoint-residual-growth-law (the 9 endpoint peaks scored here; the non-saturating reading)
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

const P_PARAMS = 3; // two shape params + variance (identical for all four forms)

// M_lin: peak = a + b kEnd   (imp-33941)
const LIN = ols(K_ENDS, PEAKS);
const LIN_PRED = K_ENDS.map((k) => LIN.a + LIN.b * k);
const LIN_STATS = fitStatsPred(PEAKS, LIN_PRED);
const LIN_IC = infoCriteria(LIN_STATS.rss, N, P_PARAMS);

// M_log: peak = a + b ln(kEnd)   (imp-33982 winner)
const LNK = K_ENDS.map((k) => Math.log(k));
const LOG = ols(LNK, PEAKS);
const LOG_PRED = LNK.map((lk) => LOG.a + LOG.b * lk);
const LOG_STATS = fitStatsPred(PEAKS, LOG_PRED);
const LOG_IC = infoCriteria(LOG_STATS.rss, N, P_PARAMS);

// M_pow: peak = a*kEnd^b   (imp-33982, last) -- log-log OLS; RSS in ORIGINAL space (as imp-33982).
const LN_PEAK = PEAKS.map((p) => Math.log(p));
const POW_LOGFIT = ols(LNK, LN_PEAK); // intercept = ln(a), slope = b
const POW_A = Math.exp(POW_LOGFIT.a);
const POW_B = POW_LOGFIT.b;
const POW_PRED = K_ENDS.map((k) => POW_A * Math.pow(k, POW_B));
const POW_STATS = fitStatsPred(PEAKS, POW_PRED);
const POW_IC = infoCriteria(POW_STATS.rss, N, P_PARAMS);

// M_sat: peak = a - b/kEnd  (NEW bounded/saturating cap). Linear-in-parameters: regress peak on the
// regressor x = 1/kEnd, so peak = a + c x with a = cap and c = slope; then b = -c. Plain OLS is the
// EXACT response-space least-squares optimum here -- no log-space caveat (unlike the power law).
const INV_K = K_ENDS.map((k) => 1 / k);
const SAT_LINFIT = ols(INV_K, PEAKS); // intercept = cap a, slope = c
const SAT_A = SAT_LINFIT.a; // the finite cap as kEnd -> inf
const SAT_B = -SAT_LINFIT.b; // peak = a - b/kEnd, so b = -slope
const SAT_PRED = K_ENDS.map((k) => SAT_A - SAT_B / k);
const SAT_STATS = fitStatsPred(PEAKS, SAT_PRED);
const SAT_IC = infoCriteria(SAT_STATS.rss, N, P_PARAMS);

// Four-way Akaike weights (lower AIC favored). Equal p => AIC/BIC/AICc give identical rankings.
const AICS = { lin: LIN_IC.aic, log: LOG_IC.aic, pow: POW_IC.aic, sat: SAT_IC.aic };
const AIC_MIN = Math.min(AICS.lin, AICS.log, AICS.pow, AICS.sat);
const REL = {
  lin: Math.exp(-0.5 * (AICS.lin - AIC_MIN)),
  log: Math.exp(-0.5 * (AICS.log - AIC_MIN)),
  pow: Math.exp(-0.5 * (AICS.pow - AIC_MIN)),
  sat: Math.exp(-0.5 * (AICS.sat - AIC_MIN)),
};
const REL_SUM = REL.lin + REL.log + REL.pow + REL.sat;
const W = {
  lin: +(REL.lin / REL_SUM).toFixed(4),
  log: +(REL.log / REL_SUM).toFixed(4),
  pow: +(REL.pow / REL_SUM).toFixed(4),
  sat: +(REL.sat / REL_SUM).toFixed(4),
};

// Winner = smallest RSS (== smallest AIC/BIC/AICc, equal p). Ordering of RSS across the four.
const RSS = { lin: LIN_STATS.rss, log: LOG_STATS.rss, pow: POW_STATS.rss, sat: SAT_STATS.rss };
const WINNER = Object.entries(AICS).sort((x, y) => x[1] - y[1])[0][0];
const SAT_WINS = WINNER === 'sat';
const SAT_BEATS_LOG = RSS.sat < RSS.log; // the saturating form dethrones the imp-33982 log winner

// Pairwise selection contrasts (all reduce to n ln(RSS ratio); AIC/BIC/AICc coincide, equal p).
const D_AIC_LOG_SAT = +(LOG_IC.aic - SAT_IC.aic).toFixed(4); // ~ +4.18: log is worse than sat by 4.18
const D_AIC_LOG_LIN = +(LOG_IC.aic - LIN_IC.aic).toFixed(4); // ~ -3.385, imp-33941 value (UNCHANGED)
const EVIDENCE_SAT_OVER_LOG = +Math.exp((LOG_IC.aic - SAT_IC.aic) / 2).toFixed(4); // ~8.07 : 1
// Saturating-vs-log stays positive-not-decisive; the inherited log-vs-linear margin is untouched.
const SAT_VS_LOG_DECISIVE = Math.abs(D_AIC_LOG_SAT) > 10; // false -- positive but not decisive
const LOG_VS_LIN_DECISIVE = Math.abs(D_AIC_LOG_LIN) > 10; // false -- unchanged from imp-33941

// Reconciliation with imp-33917 non-saturating reading: the fitted cap sits FAR above the data, so the
// peaks are nowhere near the plateau within the window and the "win" is concavity-matching, not saturation.
const MAX_PEAK = Math.max(...PEAKS);
const CAP_OVER_MAX_PEAK = +(SAT_A / MAX_PEAK).toFixed(3); // ~3.61x: cap is 3.6x the largest observed peak
const FRAC_OF_CAP_AT_MAX = +(MAX_PEAK / SAT_A).toFixed(4); // ~0.277: peaks reach only ~28% of the cap
const CAP_FAR_ABOVE_DATA = SAT_A > 2 * MAX_PEAK; // cap more than double the largest peak => no in-window plateau

export const IMP34043_ENDPOINT_PEAK_SATURATING_MODEL_TOURNAMENT = {
  id: 'imp-34043',
  proofSection: 'S-frontier',
  question:
    'imp-33982 scored linear/concave-log/power on the 9 imp-33917 endpoint peaks and the concave log ' +
    'form won (w ~ 0.841), but imp-33917 read the peak as NOT saturating -- so a bounded/saturating ' +
    'family that approaches a cap was never admitted. Does the saturating form peak = a - b/kEnd win a ' +
    'FOUR-way AIC/BIC/AICc tournament, threatening the concave-log winner, or does its fit confirm the ' +
    'non-saturating reading? Measurement / model-selection only; NOT an RH bound; no QED.',
  measuredQuantity:
    'AIC, BIC, AICc, residual RMSE and four-way Akaike weights of the linear (peak = a + b kEnd), ' +
    'concave log (peak = a + b ln(kEnd)), power-law (peak = a*kEnd^b) and saturating (peak = a - b/kEnd, ' +
    'via OLS on the 1/kEnd regressor -- an exact response-space optimum) fits to the 9 imp-33917 ' +
    'endpoint peaks, with the winner, its margin, the fitted cap, and how far the cap sits above the data',
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
  saturatingFit: {
    form: 'peak = a - b/kEnd (OLS on 1/kEnd; exact response-space optimum)',
    a: +SAT_A.toFixed(6), // the finite cap as kEnd -> inf
    b: +SAT_B.toFixed(6),
    cap: +SAT_A.toFixed(6),
    r2: +SAT_STATS.r2.toFixed(6),
    rmse: +SAT_STATS.rmse.toExponential(3),
    rss: +SAT_STATS.rss.toExponential(4),
    aic: +SAT_IC.aic.toFixed(4),
    bic: +SAT_IC.bic.toFixed(4),
    aicc: +SAT_IC.aicc.toFixed(4),
    akaikeWeight: W.sat,
  },
  selection: {
    winner: WINNER, // 'sat'
    saturatingWins: SAT_WINS,
    saturatingBeatsLog: SAT_BEATS_LOG,
    rssOrdering: 'RSS_sat < RSS_log < RSS_lin < RSS_pow',
    deltaAIC_log_minus_sat: D_AIC_LOG_SAT, // ~ +4.18 (log is worse than sat: sat dethrones log)
    deltaAIC_log_minus_lin: D_AIC_LOG_LIN, // ~ -3.385 (imp-33941 value, UNCHANGED)
    evidenceRatioSatOverLog: EVIDENCE_SAT_OVER_LOG, // ~8.07 : 1 (positive, not decisive)
    akaikeWeights: W, // {lin, log, pow, sat} sum to 1; ~ {0.020, 0.108, 0.0005, 0.872}
    strength: 'saturating-wins-positive-not-decisive-over-log', // sat-vs-log ~4.2 (positive, not decisive)
  },
  reconciliation: {
    // The saturating win does NOT confirm a plateau: the fitted cap sits far above the observed peaks.
    fittedCap: +SAT_A.toFixed(6), // ~1.678
    maxObservedPeak: +MAX_PEAK.toFixed(6), // ~0.465
    capOverMaxPeak: CAP_OVER_MAX_PEAK, // ~3.61x
    fracOfCapReachedAtMaxKEnd: FRAC_OF_CAP_AT_MAX, // ~0.277: peaks reach only ~28% of the cap
    capFarAboveData: CAP_FAR_ABOVE_DATA, // true -- so no in-window saturation
    note:
      'The saturating form wins by matching the peak concavity, not by plateauing inside the data: the ' +
      'fitted cap 1.678 is ~3.6x the largest observed peak 0.465, so over kEnd = 11..13 the curve is ' +
      'still rising steeply toward a DISTANT asymptote it never reaches -- consistent with the imp-33917 ' +
      'non-saturating reading. Better in-window fit is NOT evidence of physical saturation.',
  },
  saturatingWins: SAT_WINS,
  satVsLogDecisive: SAT_VS_LOG_DECISIVE, // false -- positive but not decisive
  logVsLinDecisive: LOG_VS_LIN_DECISIVE, // false -- unchanged from imp-33941
  finding: {
    R1_saturating_form_wins_the_four_way_race:
      'Admitting the bounded/saturating form peak = a - b/kEnd (OLS on the 1/kEnd regressor, an exact ' +
      'response-space optimum) OVERTURNS the imp-33982 decision: RSS_sat = 3.643e-4 is the smallest of ' +
      'the four (RMSE 6.36e-3, R^2 0.9919), below the log winner RSS_log = 5.794e-4, so the saturating ' +
      'form takes the lowest AIC (-59.49 vs log -55.32, lin -51.93, pow -44.57) and the top four-way ' +
      'Akaike weight (w_sat ~ 0.872 vs w_log ~ 0.108, w_lin ~ 0.020, w_pow ~ 0.0005). The concave-log ' +
      'winner is dethroned into second.',
    R2_win_is_positive_not_decisive_and_imp33941_margin_unchanged:
      'The saturating edge over log is Delta AIC = +4.18 (evidence ~8.07 : 1 for sat over log) -- ' +
      'POSITIVE but not decisive (< 10). The inherited imp-33941 log-vs-linear contrast is UNCHANGED at ' +
      'Delta AIC = -3.385 (log still beats the line and still crushes the power law); only the crown ' +
      'moves from log to sat, by a positive-not-decisive margin.',
    R3_win_does_not_confirm_saturation_reconciles_with_imp33917:
      'The fitted cap a = 1.678 sits ~3.6x ABOVE the largest observed peak (0.465), so at kEnd = 13 the ' +
      'peaks reach only ~27.7% of the modeled ceiling and the curve is still rising steeply (slope ' +
      '0.129 -> 0.093 across the window, decelerating). The saturating form wins by MATCHING THE ' +
      'CONCAVITY, not by plateauing inside the data: it agrees with imp-33917 that the peak does not ' +
      'saturate WITHIN the window (it climbs toward a DISTANT asymptote it never approaches over ' +
      'kEnd = 11..13). Better in-window fit is NOT evidence of physical saturation.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / MODEL-SELECTION (frontier-direction, NOT rigorous). Extending the imp-33982 ' +
    'linear/log/power tournament with a FOURTH candidate, the bounded/saturating form peak = a - b/kEnd ' +
    '(OLS on the 1/kEnd regressor -- an EXACT response-space optimum, no log-space caveat), and ' +
    're-scoring all four on the identical 9 imp-33917 endpoint peaks (kEnd = 11..13): the SATURATING ' +
    'form WINS -- RSS_sat 3.643e-4 < RSS_log 5.794e-4 < RSS_lin 8.439e-4 < RSS_pow 1.911e-3, so sat ' +
    'takes the lowest AIC/BIC/AICc (-59.49) and the top four-way Akaike weight (~0.872 vs log ~0.108, ' +
    'lin ~0.020, pow ~0.0005). Admitting the bounded family therefore DOES threaten the concave-log ' +
    'winner: log is dethroned into second. But the win is POSITIVE, NOT DECISIVE -- Delta AIC(log-sat) ' +
    '= +4.18 (evidence ~8.07 : 1) -- and the inherited imp-33941 log-vs-linear margin is UNCHANGED ' +
    '(Delta AIC -3.385). Crucially the win does NOT confirm saturation: the fitted cap a = 1.678 sits ' +
    '~3.6x above the largest observed peak (0.465), so the peaks reach only ~27.7% of the ceiling and ' +
    'the curve is still climbing steeply across the window -- the saturating form wins by matching the ' +
    'peak concavity, not by plateauing, and is fully consistent with the imp-33917 non-saturating ' +
    'reading (a sub-linear climb toward a distant asymptote never reached within kEnd = 11..13). All ' +
    'four forms are descriptive, not derived; the fitted cap is a narrow-window extrapolation ~3.6x ' +
    'above the data and asserts NO physical plateau; the component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the imp-33843 log-linear-vs-power-law ' +
    'FORM verdict is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33982 (the three-form tournament extended here); imp-33941 (the linear-vs-log selection whose ' +
    'margin is checked); imp-33917 (the 9 endpoint peaks scored here; the non-saturating reading); ' +
    'imp-33843 (the log-linear OLS whose endpoint residual is the peak); imp-486 (C_mb GUE-conditional).',
};

export const IMP34043_ENDPOINT_PEAK_SATURATING_MODEL_TOURNAMENT_ASSERTIONS = [
  {
    // Reuse gate: the scored peaks ARE the imp-33917 boundary sweep -- 9 windows, imp-33877 endpoint
    // peaks reproduced at kEnd 11/11.5/12, so the model selection scores the inherited measurement.
    id: 'imp34043-reuse-gate-scores-imp33917-peaks',
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
    // (R1) The saturating form wins the four-way race and dethrones the imp-33982 log winner.
    id: 'imp34043-saturating-wins-and-dethrones-log',
    description: 'winner is sat with the largest weight; RSS_sat smallest; sat beats log; RSS order sat<log<lin<pow',
    holds: () =>
      SAT_WINS === true &&
      WINNER === 'sat' &&
      SAT_BEATS_LOG === true &&
      RSS.sat < RSS.log &&
      RSS.log < RSS.lin &&
      RSS.lin < RSS.pow &&
      W.sat > W.log &&
      W.sat > W.lin &&
      W.sat > W.pow,
  },
  {
    // (R2) The win is positive but NOT decisive, and the imp-33941 log-vs-linear margin is unchanged.
    id: 'imp34043-positive-not-decisive-and-imp33941-margin-unchanged',
    description: 'sat-vs-log Delta AIC ~ +4.18 (positive, < 10); evidence ~8.07 : 1; log-vs-lin ~ -3.385 unchanged',
    holds: () =>
      D_AIC_LOG_SAT > 0 &&
      SAT_VS_LOG_DECISIVE === false &&
      Math.abs(EVIDENCE_SAT_OVER_LOG - 8.07) < 0.1 &&
      Math.abs(D_AIC_LOG_LIN - -3.385) < 5e-3 &&
      LOG_VS_LIN_DECISIVE === false,
  },
  {
    // (R3) The win does NOT confirm saturation: the fitted cap sits far above the data; honesty gate.
    id: 'imp34043-cap-far-above-data-and-honesty-gate',
    description: 'weights sum to ~1; cap ~3.6x max peak (no in-window plateau); log-sat Delta = n ln(RSS ratio); isRigorous false; NO QED; PT SOTA',
    holds: () => {
      const target = N * Math.log(RSS.log / RSS.sat);
      return (
        Math.abs(W.lin + W.log + W.pow + W.sat - 1) < 5e-3 &&
        CAP_FAR_ABOVE_DATA === true &&
        CAP_OVER_MAX_PEAK > 3 &&
        FRAC_OF_CAP_AT_MAX < 0.35 &&
        Math.abs(D_AIC_LOG_SAT - target) < 5e-3 &&
        IMP34043_ENDPOINT_PEAK_SATURATING_MODEL_TOURNAMENT.isRigorous === false &&
        /NO QED/.test(IMP34043_ENDPOINT_PEAK_SATURATING_MODEL_TOURNAMENT.verdict) &&
        /remains SOTA/.test(IMP34043_ENDPOINT_PEAK_SATURATING_MODEL_TOURNAMENT.verdict)
      );
    },
  },
];

for (const a of IMP34043_ENDPOINT_PEAK_SATURATING_MODEL_TOURNAMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34043-endpoint-peak-saturating-model-tournament assertion failed: ${a.id}`);
  }
}
