/**
 * @module imp-97103-route-m-fm-discriminant-reach-band
 *
 * imp-97103 (accuracy, MEASUREMENT/TABULATION ONLY): puts explicit error bars on the
 * imp-97060 / imp-97033 reach-threshold confidence table.
 *
 * imp-97060 cross-validated the imp-97033 inverted log-decay law
 *   ln(spread percent) = alpha + beta * log10(N_top)   [alpha ~ 4.5529, beta ~ -0.6235]
 * against the exact imp-96912 anchor rungs (RMS residual ~0.026 pp, max ~0.042 pp) and CONCLUDED
 * that the extrapolation risk in the S*=1 percent N_top ~ 2.01e7 reach threshold is dominated by the
 * ~3.3-decade far reach to N*, NOT by anchor misfit -- but it never quantified that risk as a band.
 * This leaf does exactly that, and only that: it recomputes the imp-97033 fit over its window
 * (N_top >= 12000), extracts the residual standard error s and the full parameter covariance of
 * (alpha, beta), and PROPAGATES them through the log-decay inversion X0 = (ln S* - alpha)/beta by the
 * delta method to attach a 95 percent prediction-interval band to each reach threshold (S* = 10/5/1
 * percent). No new law is fit, no Gram is rebuilt, no O(N^3) rung is computed: alpha, beta and the
 * exact spread ladder are imported verbatim from imp-97033 and only differenced to recover residuals.
 * Only the trace ceiling T ~ 2.594e7 stays rigorous; F, M inherit non-rigorous extrapolations; no
 * bound moves; no refereed bound is changed; RH open; NO QED.
 *
 * -------------------------------------------------------------------------------
 * THE PROPAGATION. Inverse-regression (calibration) prediction interval.
 * -------------------------------------------------------------------------------
 * The fit is ordinary least squares of Y = ln(spread percent) on X = log10(N_top) over the 7-rung
 * window N_top in {12000..24000}. Its residual standard error is s (in log-spread units) with
 * n - 2 = 5 degrees of freedom; the parameter covariance is the textbook OLS form
 *   Var(beta)      = s^2 / Sxx
 *   Var(alpha)     = s^2 * (1/n + Xbar^2 / Sxx)
 *   Cov(alpha,beta) = -s^2 * Xbar / Sxx
 * with Sxx = sum (X_i - Xbar)^2 the centred design spread. Inverting the law for a target spread S*
 * gives X0 = (ln S* - alpha)/beta; the delta method (dX0/dalpha = -1/beta, dX0/dbeta = -X0/beta)
 * collapses the propagated variance to the classical calibration form
 *   Var_mean(X0) = (s^2 / beta^2) * ( 1/n + (X0 - Xbar)^2 / Sxx )
 * and a prediction interval that also carries a fresh observation noise adds a leading 1:
 *   Var_pred(X0) = (s^2 / beta^2) * ( 1 + 1/n + (X0 - Xbar)^2 / Sxx ).
 * The band on N_top is multiplicative (symmetric in log10, asymmetric in N_top): N_top times / by
 * 10^(t * sd(X0)) with t = t_{0.975, 5} = 2.5706.
 *
 * -------------------------------------------------------------------------------
 * THE BAND TABLE (95 percent, propagated residual + parameter covariance).
 * -------------------------------------------------------------------------------
 *   S* = 10 percent  N_top ~ 4.07e3   band [3.65e3, 4.53e3]   (x/ 1.11)   leverage (X0-Xbar)^2/Sxx ~ 5.8
 *   S* =  5 percent  N_top ~ 5.26e4   band [4.85e4, 5.71e4]   (x/ 1.09)   leverage ~ 3.2
 *   S* =  1 percent  N_top ~ 2.01e7   band [1.20e7, 3.35e7]   (x/ 1.67)   leverage ~ 133.7
 * The 1-percent reach threshold therefore carries a 95 percent band of roughly [1.2e7, 3.3e7] -- a
 * multiplicative factor ~1.67 either way -- while the near-window 10/5-percent thresholds are pinned
 * to ~10 percent. The band WIDTH decomposes cleanly: at S* = 1 percent the leverage term
 * (X0 - Xbar)^2 / Sxx ~ 133.7 dwarfs both the mean-fit term 1/n = 0.143 and the fresh-observation
 * term 1, so the mean and prediction bands are near-identical (half-widths 0.2223 vs 0.2231 in log10).
 * That is the quantitative confirmation of the imp-97060 verdict: >99 percent of the reach-threshold
 * uncertainty comes from the far-reach EXTRAPOLATION LEVERAGE, not from the anchor residual s.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest tabulation).
 * -------------------------------------------------------------------------------
 * The imp-97060 "risk dominated by the far reach, not anchor misfit" verdict is now a number: the
 * S*=1 percent N_top ~ 2.01e7 reach threshold carries a 95 percent prediction-interval band of about
 * [1.20e7, 3.35e7] (factor ~1.67), and the leverage decomposition shows the residual s contributes a
 * negligible share of that width (the fresh-observation term 1 sits against a leverage term ~133.7).
 * This does not move any bound: it only attaches honest error bars to the reach-threshold table, and
 * the band stays entirely within the far-reach regime (N_top still ~30..80 percent of N* ~ 4e7 at
 * 1 percent). Measurement/tabulation only; only the trace ceiling T ~ 2.594e7 is rigorous; no bound
 * moves; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97060-route-m-fm-discriminant-crossvalidation.js (the anchor back-check + confidence table this bands)
 * @see imp-97033-route-m-fm-discriminant-reach-threshold.js (the inverted decay law + threshold ladder)
 * @see imp-96912-route-m-frobenius-ladder-extension-above-16000.js (the 24-rung exact ||G||_F ladder + anchors)
 *
 * Ticket: imp-97103 (accuracy, opus-4-8, api-pool). Measurement/tabulation only; honest; NO QED.
 */

import {
  IMP97033_SPREAD_LADDER,
  IMP97033_DECAY_FIT,
} from './imp-97033-route-m-fm-discriminant-reach-threshold.js';

// The imp-97033 fit window (N_top >= 12000), imported verbatim -- no rung recomputed.
const FIT_ROWS = IMP97033_SPREAD_LADDER.filter((r) => r.nTop >= 12000);
const N_OBS = FIT_ROWS.length; // 7
const X = FIT_ROWS.map((r) => Math.log10(r.nTop));
const Y = FIT_ROWS.map((r) => Math.log(r.spreadPct));
const mean = (v) => v.reduce((a, b) => a + b, 0) / v.length;
const XBAR = mean(X);
const YBAR = mean(Y);
let SXX = 0; // centred design spread sum (X_i - Xbar)^2
let SXY = 0;
for (let i = 0; i < N_OBS; i += 1) {
  SXX += (X[i] - XBAR) ** 2;
  SXY += (X[i] - XBAR) * (Y[i] - YBAR);
}
// Recovered OLS coefficients (must match the imported imp-97033 law to floating precision).
const BETA = SXY / SXX;
const ALPHA = YBAR - BETA * XBAR;
// Residual standard error s with n - 2 degrees of freedom (log-spread units).
let SSE = 0;
for (let i = 0; i < N_OBS; i += 1) {
  const yHat = ALPHA + BETA * X[i];
  SSE += (Y[i] - yHat) ** 2;
}
const DOF = N_OBS - 2; // 5
const S2 = SSE / DOF;
const S = Math.sqrt(S2);

// Textbook OLS parameter covariance of (alpha, beta).
const VAR_BETA = S2 / SXX;
const VAR_ALPHA = S2 * (1 / N_OBS + (XBAR * XBAR) / SXX);
const COV_ALPHA_BETA = -S2 * XBAR / SXX;

// Student-t 0.975 quantile at 5 dof (frozen literal; standard table value).
const T_CRIT_5DOF = 2.5706;

export const IMP97103_FIT_STATS = Object.freeze({
  form: 'ln(spread percent) = alpha + beta * log10(N_top)',
  fitWindow: 'N_top >= 12000 (7 rungs)',
  nObs: N_OBS,
  dof: DOF,
  alpha: ALPHA,
  beta: BETA,
  xbar: XBAR,
  sxx: SXX,
  residualStdErr: S, // s, in log-spread units
  residualVar: S2,
  covariance: Object.freeze({ varAlpha: VAR_ALPHA, varBeta: VAR_BETA, covAlphaBeta: COV_ALPHA_BETA }),
  tCrit: T_CRIT_5DOF,
  matchesImp97033Law:
    Math.abs(ALPHA - IMP97033_DECAY_FIT.alpha) < 1e-9 &&
    Math.abs(BETA - IMP97033_DECAY_FIT.betaPerDecade) < 1e-9,
});

// Inversion X0 = (ln S* - alpha)/beta and its propagated variance (delta method / calibration form).
function bandForSpread(sPct) {
  const yStar = Math.log(sPct);
  const x0 = (yStar - ALPHA) / BETA; // = log10(N_top)
  const nTop = Math.pow(10, x0);
  const leverage = (x0 - XBAR) ** 2 / SXX; // far-reach extrapolation leverage term
  const invNoise = 1 / N_OBS; // mean-fit term
  // Delta method from the parameter covariance (dX0/dalpha = -1/beta, dX0/dbeta = -x0/beta).
  const gAlpha = -1 / BETA;
  const gBeta = -x0 / BETA;
  const varDelta =
    gAlpha * gAlpha * VAR_ALPHA +
    gBeta * gBeta * VAR_BETA +
    2 * gAlpha * gBeta * COV_ALPHA_BETA;
  // Closed calibration forms (mean response; and prediction adding a fresh observation noise term).
  const varMean = (S2 / (BETA * BETA)) * (invNoise + leverage);
  const varPred = (S2 / (BETA * BETA)) * (1 + invNoise + leverage);
  const sdMean = Math.sqrt(varMean);
  const sdPred = Math.sqrt(varPred);
  const hwMean = T_CRIT_5DOF * sdMean; // 95 percent half-width in log10 units
  const hwPred = T_CRIT_5DOF * sdPred;
  const factorMean = Math.pow(10, hwMean);
  const factorPred = Math.pow(10, hwPred);
  return Object.freeze({
    targetSpreadPct: sPct,
    x0,
    nTop,
    leverageTerm: leverage,
    meanFitTerm: invNoise,
    // multiplicative 95 percent bands on N_top (symmetric in log10, asymmetric in N_top)
    nTopMeanBand: Object.freeze({ lo: nTop / factorMean, hi: nTop * factorMean, factor: factorMean }),
    nTopPredBand: Object.freeze({ lo: nTop / factorPred, hi: nTop * factorPred, factor: factorPred }),
    halfWidthLog10Mean: hwMean,
    halfWidthLog10Pred: hwPred,
    // delta-method variance must equal the closed mean-response calibration variance
    deltaMatchesClosedForm: Math.abs(varDelta - varMean) < 1e-12 * Math.max(1, varMean),
    // share of the prediction band width carried by the far-reach leverage vs the residual/obs terms
    leverageShareOfPredVar: leverage / (1 + invNoise + leverage),
  });
}

// -------------------------------------------------------------------------------
// THE BAND TABLE: reach threshold + 95 percent prediction interval at each target spread.
// -------------------------------------------------------------------------------
export const IMP97103_BAND_TABLE = Object.freeze([10, 5, 1].map(bandForSpread));

const ONE_PCT = IMP97103_BAND_TABLE.find((r) => r.targetSpreadPct === 1);

export const IMP97103_VERDICT = Object.freeze({
  question:
    'what 95 percent prediction-interval band does propagating the imp-97033 fit residual and ' +
    'parameter covariance attach to the S*=1/5/10 percent N_top reach thresholds, and how much of ' +
    'that band width is far-reach extrapolation leverage vs anchor residual?',
  onePercentNTop: ONE_PCT.nTop, // ~2.01e7
  onePercentBandLo: ONE_PCT.nTopPredBand.lo, // ~1.20e7
  onePercentBandHi: ONE_PCT.nTopPredBand.hi, // ~3.35e7
  onePercentBandFactor: ONE_PCT.nTopPredBand.factor, // ~1.67
  onePercentLeverageShare: ONE_PCT.leverageShareOfPredVar, // ~0.99
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'ATTACHES honest error bars to the imp-97060 reach-threshold table. Propagating the imp-97033 ' +
    'residual standard error (s ~ 0.0047 in log-spread units, 5 dof) and the full OLS (alpha, beta) ' +
    'covariance through the log-decay inversion by the delta method gives a 95 percent ' +
    'prediction-interval band on each reach threshold: S*=10 percent N_top ~ 4.07e3 [3.65e3, 4.53e3] ' +
    '(x/ 1.11), S*=5 percent N_top ~ 5.26e4 [4.85e4, 5.71e4] (x/ 1.09), and S*=1 percent ' +
    'N_top ~ 2.01e7 [1.20e7, 3.35e7] (x/ 1.67). The 1-percent band width is ~99 percent far-reach ' +
    'extrapolation leverage ((X0-Xbar)^2/Sxx ~ 133.7) and only ~1 percent residual/observation noise, ' +
    'so the mean and prediction bands nearly coincide -- the quantitative confirmation of the ' +
    'imp-97060 verdict that the reach-threshold risk is dominated by the ~3.3-decade far reach, not ' +
    'anchor misfit. No bound moves: even the band low end (1.2e7, ~30 percent of N* ~ 4e7) stays deep ' +
    'in the far-reach regime. Measurement/tabulation only; only the trace ceiling T ~ 2.594e7 is ' +
    'rigorous; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97103_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement/tabulation only: no law was refit, no ' +
  'Gram was rebuilt and no O(N^3) rung was computed -- the imp-97033 (alpha, beta) and exact spread ' +
  'ladder are imported verbatim and only differenced to recover the residual s and OLS parameter ' +
  'covariance, which are then propagated through the log-decay inversion (delta method / calibration ' +
  'prediction interval, t at 5 dof). The 95 percent band on the S*=1 percent reach threshold is ' +
  '~[1.2e7, 3.3e7]; only the trace ceiling T ~ 2.594e7 is rigorous; F and M inherit non-rigorous ' +
  'extrapolations; no bound is claimed moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97103_ASSERTIONS = [
  {
    id: 'imp97103-fit-recovers-imp97033-law',
    holds: () =>
      IMP97103_FIT_STATS.matchesImp97033Law === true &&
      IMP97103_FIT_STATS.nObs === 7 &&
      IMP97103_FIT_STATS.dof === 5 &&
      IMP97103_FIT_STATS.residualStdErr > 0.003 &&
      IMP97103_FIT_STATS.residualStdErr < 0.007,
    why: 'the recomputed OLS coefficients match the imported imp-97033 log-decay law to floating precision and the residual standard error over the 7-rung window is s ~ 0.0047 (5 dof) -- the same fit, only differenced to recover residuals and covariance.',
  },
  {
    id: 'imp97103-delta-method-equals-closed-calibration-form',
    holds: () => IMP97103_BAND_TABLE.every((r) => r.deltaMatchesClosedForm === true),
    why: 'propagating the OLS parameter covariance by the delta method reproduces the closed calibration mean-response variance (s^2/beta^2)*(1/n + (X0-Xbar)^2/Sxx) at every target spread, confirming the propagation is done correctly.',
  },
  {
    id: 'imp97103-one-percent-band-brackets-2e7',
    holds: () =>
      ONE_PCT.nTop > 1.9e7 &&
      ONE_PCT.nTop < 2.1e7 &&
      ONE_PCT.nTopPredBand.lo > 1.0e7 &&
      ONE_PCT.nTopPredBand.lo < 1.4e7 &&
      ONE_PCT.nTopPredBand.hi > 3.0e7 &&
      ONE_PCT.nTopPredBand.hi < 3.6e7 &&
      ONE_PCT.nTopPredBand.factor > 1.5 &&
      ONE_PCT.nTopPredBand.factor < 1.8,
    why: 'the S*=1 percent reach threshold N_top ~ 2.01e7 carries a 95 percent prediction-interval band of ~[1.20e7, 3.35e7], a multiplicative factor ~1.67 either way.',
  },
  {
    id: 'imp97103-band-width-dominated-by-far-reach-leverage',
    holds: () =>
      ONE_PCT.leverageTerm > 100 &&
      ONE_PCT.leverageShareOfPredVar > 0.98 &&
      // near-window thresholds are pinned tighter than the far 1-percent rung
      IMP97103_BAND_TABLE.find((r) => r.targetSpreadPct === 10).nTopPredBand.factor < 1.2 &&
      IMP97103_BAND_TABLE.find((r) => r.targetSpreadPct === 5).nTopPredBand.factor < 1.2 &&
      ONE_PCT.nTopPredBand.factor > IMP97103_BAND_TABLE.find((r) => r.targetSpreadPct === 5).nTopPredBand.factor,
    why: 'at S*=1 percent the extrapolation leverage term (X0-Xbar)^2/Sxx ~ 133.7 carries >98 percent of the band variance while the residual/observation term contributes <2 percent, quantitatively confirming the imp-97060 verdict that reach-threshold risk is far-reach dominated, not anchor-misfit dominated.',
  },
  {
    id: 'imp97103-honesty-gate-no-qed',
    holds: () =>
      IMP97103_VERDICT.anyBoundMoved === false &&
      IMP97103_VERDICT.postsRigorousCeiling === false &&
      IMP97103_VERDICT.qed === false &&
      /NO QED/.test(IMP97103_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97103_HONEST_BANNER) &&
      /RH open/.test(IMP97103_HONEST_BANNER),
    why: 'measurement/tabulation only: no bound moved, no rigorous ceiling posted, and the honesty markers are present.',
  },
];

for (const a of IMP97103_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97103-route-m-fm-discriminant-reach-band assertion failed: ${a.id}`,
    );
  }
}

export default {
  fitStats: IMP97103_FIT_STATS,
  bandTable: IMP97103_BAND_TABLE,
  verdict: IMP97103_VERDICT,
  banner: IMP97103_HONEST_BANNER,
};
