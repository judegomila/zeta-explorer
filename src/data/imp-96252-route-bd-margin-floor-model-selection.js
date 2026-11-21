/**
 * @fileoverview imp-96252 -- formal penalized / cross-validated MODEL-SELECTION on the
 * imp-96224 gamma_4000 worst-support rho(32,T) column: score the reciprocal-log floor law
 * (rho=c+d/lnT) against the no-floor log-linear law (rho=a+b*lnT) by AIC, AICc, BIC and
 * exact leave-one-out PRESS (via the hat matrix), and report whether the penalized criteria
 * agree with the imp-96224 raw-R2 sign reversal or whether the floor law is rescued once
 * parameter parity and LOO are accounted for.
 * Import-light (literals baked, no zeros bundle); holds() assertions; self-executing.
 * Measurement / model-selection only. NOT a bound; no refereed bound is changed; RH open; NO QED.
 *
 * ORIGIN. imp-96224 extended the worst-support rho(32,T) census to gamma_4000 (T~4506) and
 * re-fit both laws, reporting the reciprocal-log vs log-linear R2 gap had reversed sign to
 * -0.01828 (log-linear the better fit by the widest margin yet). But imp-96224 compared only
 * raw R2 -- it never applied a penalized / cross-validated model-selection like the AIC/PRESS
 * treatment imp-96231 gave the Route M band-vs-drift residual. This ticket supplies that.
 *
 * METHOD. On the full baked imp-96224 column (imp-96148 seven-point + imp-96167 gamma_500 +
 * imp-96186 gamma_1000 + imp-96209 gamma_2000 + the eight new gamma_4000 cutoffs = 34 distinct
 * (T,rho) points) fit both laws by ordinary least squares -- each is LINEAR in its two
 * parameters (regressor lnT for the no-floor law, 1/lnT for the floor law) -- and score them by
 *   AIC  = -2 lnL + 2 kEff,
 *   AICc = AIC + 2 kEff (kEff+1)/(n - kEff - 1),
 *   BIC  = -2 lnL + kEff ln n,       kEff = 3 (slope, intercept, sigma^2),
 *   PRESS = sum_i ( r_i / (1 - h_ii) )^2   with h_ii = 1/n + (x_i - xbar)^2 / Sxx   (exact LOO).
 * Refit validation: the OLS fit reproduces the imp-96224 baked coefficients -- log-linear
 * a=1.0632 (baked 1.06083), b=-0.08233 (baked -0.08193), R2=0.99044 (baked 0.99041);
 * reciprocal-log c=0.03705 (baked 0.03411), d=3.0483 (baked 3.06496), R2=0.97207 (baked
 * 0.97212). (The imp-96224 prose says 35 points; the four baked columns enumerate 34 distinct
 * cutoffs, and the R2 match to four places confirms the reconstruction is faithful -- the
 * one-point label discrepancy is immaterial to the model-selection verdict.)
 *   Reproduction: tmp/imp-96252-modelselect.mjs (pure OLS, no zeros).
 *
 * RESULT (all criteria, recip-log minus log-linear; a POSITIVE delta favours the no-floor law).
 *   log-linear  : RSS=0.0029396, R2=0.99044, AIC=-215.61, AICc=-214.81, BIC=-211.03, PRESS=0.0039072, R2pred=0.98729
 *   recip-log   : RSS=0.0085833, R2=0.97207, AIC=-179.18, AICc=-178.38, BIC=-174.60, PRESS=0.0100551, R2pred=0.96728
 *   deltas      : dAIC=+36.43, dAICc=+36.43, dBIC=+36.43, dPRESS=+0.0061479 (all favour log-linear)
 *   Akaike wts  : w(log-linear)~1.00000, w(recip-log)~0.00000 (AICc evidence ratio ~8.2e7 for log-linear).
 *
 * READING (honest -- ANSWERS the ticket: penalized/CV agree with the raw-R2 sign reversal).
 * Every criterion prefers the no-floor log-linear law, and by an overwhelming margin (dAIC ~36,
 * far past the conventional "essentially no support for the worse model" threshold of 10). Two
 * points make this a genuine model-selection rather than a re-badged R2:
 *   (1) PARAMETER PARITY. Both laws have exactly two free parameters, so the AIC/AICc/BIC
 *       complexity penalties are IDENTICAL across the two models; the criteria therefore differ
 *       from a raw RSS comparison only through the monotone -2 lnL = n ln(RSS/n)+const map, i.e.
 *       dAIC=dAICc=dBIC = n*ln(RSS_recip / RSS_loglin) exactly. With equal k the penalized
 *       criteria CANNOT reverse the RSS (hence R2) ranking -- so AIC/BIC add no independent
 *       information here beyond confirming the effect size is large.
 *   (2) LOO / PRESS is the one criterion that COULD have reversed the verdict (it is not a
 *       monotone function of in-sample RSS -- a lower-RSS model with high-leverage endpoints can
 *       lose under leave-one-out). It does NOT: PRESS and R2pred both prefer log-linear
 *       (R2pred 0.98729 vs 0.96728), so the floor law is not rescued by cross-validation.
 * So the imp-96224 raw-R2 sign reversal survives a formal penalized and cross-validated
 * model-selection: the fitted floor is NOT preferred once parameter parity and LOO are
 * accounted for. This is consistent with the imp-96224 reading that the numeric floor is
 * trending to zero (the no-floor form), NOT with a settled positive asymptote.
 * UNCHANGED: the SIGN of the on-line margin stays strictly positive (0.3791 at gamma_4000, no
 * crossing) and the true uniform-in-T obstruction stays OFF the line (Weil-positivity strength).
 * Changes no bound; no refereed bound is changed; RH open; NO QED.
 */

export const ROUTE_BD_MARGIN_FLOOR_MODEL_SELECTION = Object.freeze({
  id: 'imp-96252-route-bd-margin-floor-model-selection',
  date: '2026-09-24',
  route: 'B/D handoff',
  origin: 'penalized/CV model-selection on the imp-96224 gamma_4000 rho(32,T) column (imp-96224 compared only raw R2)',
  status: 'MEASURED -- a formal model-selection (AIC/AICc/BIC + exact leave-one-out PRESS) on the baked imp-96224 '
    + 'gamma_4000 worst-support rho(32,T) column AGREES with the raw-R2 sign reversal: every criterion prefers the '
    + 'no-floor log-linear law (rho=a+b lnT) over the reciprocal-log floor law (rho=c+d/lnT) by an overwhelming margin '
    + '(dAIC=dAICc=dBIC=+36.43, Akaike weight ~1.0000 vs ~0.0000). Because both laws have equal parameter count the '
    + 'penalized criteria reduce to the RSS ranking (they cannot reverse it); the ONE independent test is LOO/PRESS, and '
    + 'it too favours log-linear (PRESS 0.003907 vs 0.010055, R2pred 0.98729 vs 0.96728). The floor law is NOT rescued '
    + 'once parameter parity and cross-validation are accounted for. Uses the baked column, no new zeros. '
    + 'Changes no bound; no refereed bound is changed; RH open; NO QED',

  method: {
    column: 'full baked imp-96224 column = imp-96148 seven-point + imp-96167 gamma_500 + imp-96186 gamma_1000 '
      + '+ imp-96209 gamma_2000 + eight new gamma_4000 cutoffs = 34 distinct (T,rho) points',
    fit: 'ordinary least squares; each law is LINEAR in its two parameters -- regressor lnT for the no-floor law '
      + '(rho=a+b lnT), 1/lnT for the floor law (rho=c+d/lnT)',
    criteria: 'AIC = -2 lnL + 2 kEff; AICc = AIC + 2 kEff(kEff+1)/(n-kEff-1); BIC = -2 lnL + kEff ln n; kEff=3 '
      + '(slope, intercept, sigma^2). Exact leave-one-out PRESS = sum_i (r_i/(1-h_ii))^2 with leverage '
      + 'h_ii = 1/n + (x_i-xbar)^2/Sxx',
    reproduction: 'tmp/imp-96252-modelselect.mjs (pure OLS on the baked literals, no zeros bundle)',
  },

  // Refit validation: OLS reproduces the imp-96224 baked coefficients (R2 matches to four places).
  refitValidation: {
    logLinear: { a: 1.06319, aBaked: 1.06083, b: -0.08233, bBaked: -0.08193, R2: 0.99044, R2Baked: 0.99041 },
    recipLog: { c: 0.03705, cBaked: 0.03411, d: 3.04829, dBaked: 3.06496, R2: 0.97207, R2Baked: 0.97212 },
    numPoints: 34,
    note: 'imp-96224 prose reports 35 points; the four baked columns enumerate 34 distinct cutoffs; the R2 match '
      + 'to four places confirms the reconstruction is faithful and the one-point label gap is immaterial to the verdict',
  },

  n: 34,

  // Per-law scores. RSS = residual sum of squares; PRESS = leave-one-out predicted RSS.
  scores: {
    logLinear: {
      form: 'rho = a + b*ln T',
      rss: 0.00293957,
      R2: 0.99044,
      aic: -215.6111,
      aicc: -214.8111,
      bic: -211.0321,
      press: 0.00390722,
      R2pred: 0.98729,
    },
    recipLog: {
      form: 'rho = c + d/ln T',
      rss: 0.00858332,
      R2: 0.97207,
      aic: -179.1782,
      aicc: -178.3782,
      bic: -174.5991,
      press: 0.01005512,
      R2pred: 0.96728,
    },
  },

  // Deltas: recip-log minus log-linear. POSITIVE => the no-floor log-linear law is preferred.
  deltas: {
    dAIC: 36.4330,
    dAICc: 36.4330,
    dBIC: 36.4330,
    dPRESS: 0.00614790,
    note: 'with equal parameter count the AIC/AICc/BIC penalties are identical, so all three deltas coincide exactly '
      + 'at n*ln(RSS_recip/RSS_loglin); PRESS is the independent LOO test and it agrees in direction',
  },

  // Akaike weights over the two candidate models (from AICc); the log-linear law carries all the weight.
  akaikeWeights: {
    logLinear: 1.00000,
    recipLog: 0.00000,
    evidenceRatioLogLinearOverRecip: 8.15e7,
    note: 'w(recip-log) rounds to zero at five places; AICc evidence ratio ~8.2e7 for the no-floor law',
  },

  finding: {
    penalizedAgreesWithRawR2: 'AIC, AICc and BIC all prefer the no-floor log-linear law by dIC=+36.43, far past the '
      + 'conventional threshold (dIC>10 = essentially no support for the worse model); Akaike weight ~1.0000 vs '
      + '~0.0000. So the penalized criteria AGREE with the imp-96224 raw-R2 sign reversal',
    parameterParityMakesICRedundant: 'both laws have exactly two free parameters, so the complexity penalties are '
      + 'IDENTICAL and dAIC=dAICc=dBIC=n*ln(RSS_recip/RSS_loglin) exactly -- the penalized criteria cannot reverse '
      + 'the RSS/R2 ranking and add no information here beyond confirming the effect size is large',
    looDoesNotRescueFloor: 'exact leave-one-out PRESS is the ONE criterion that could have reversed the verdict '
      + '(it is not a monotone function of in-sample RSS); it does NOT -- PRESS 0.003907 vs 0.010055 and R2pred '
      + '0.98729 vs 0.96728 both favour log-linear, so cross-validation does not rescue the floor law',
    consistentWithFloorToZero: 'the model-selection is consistent with the imp-96224 reading that the numeric floor '
      + 'is trending to zero (the no-floor log-linear form) rather than settling at a positive asymptote; the SIGN '
      + 'of the on-line margin is unchanged (strictly positive, 0.3791 at gamma_4000, no crossing)',
  },

  obstruction: {
    name: 'model-selection scores a fit, not the physics -- the true uniform-in-T obstruction stays OFF the line',
    detail: 'preferring the no-floor law is evidence about the empirical decay of rho(32,T), not a proof the floor '
      + 'is exactly zero; and even a zero on-line floor would only confirm on-line feasibility, not the OFF-line '
      + 'uniform LP (Weil-positivity strength) that is the actual binding wall (unchanged from imp-96148..96224)',
  },

  honest: 'A formal penalized and cross-validated model-selection (AIC, AICc, BIC, exact leave-one-out PRESS) was run '
    + 'on the baked imp-96224 gamma_4000 worst-support rho(32,T) column (34 points, both 2-parameter laws fit by OLS, '
    + 'reproducing the imp-96224 coefficients). Every criterion prefers the no-floor log-linear law over the '
    + 'reciprocal-log floor law by an overwhelming margin (dAIC=dAICc=dBIC=+36.43, Akaike weight ~1.0000). Because the '
    + 'two laws have equal parameter count the AIC/BIC penalties are identical, so those criteria merely restate the '
    + 'RSS ranking; the genuinely independent test is LOO/PRESS, and it too favours log-linear (R2pred 0.98729 vs '
    + '0.96728), so the floor law is NOT rescued by cross-validation. This confirms the imp-96224 raw-R2 sign reversal '
    + 'holds up under formal model-selection and is consistent with the fitted floor trending to zero. The SIGN of the '
    + 'on-line margin is unchanged (strictly positive, no crossing) and the uniform-in-T obstruction stays off the '
    + 'line. Measurement / model-selection only; uses the baked column, no new zeros. Changes no bound; '
    + 'no refereed bound is changed; RH open; NO QED.',

  subGap: {
    name: 'model-selection is relative, not a proof of the floor value',
    statement: 'The AIC/AICc/BIC/PRESS scores establish only that among the two candidate laws the no-floor '
      + 'log-linear form is decisively preferred on the gamma_4000 column -- this is RELATIVE model comparison, not an '
      + 'absolute proof that the true floor is exactly zero, nor that log-linear is the correct functional form '
      + '(both remain empirical surrogates for rho(32,T) with no analytic decay law). A rigorous floor value would '
      + 'still need an analytic asymptotic for the min-norm-point over the on-line collision census, and even c=0 '
      + 'would certify only on-line feasibility, not the off-line uniform LP that binds. Inherits SG-96164-boundary / '
      + 'SG-96181-edge-octave for the actual strict gap; changes no bound; NO QED.',
  },

  references: [
    'src/data/imp-96224-route-bd-online-margin-floor-gamma4000.js (the gamma_4000 column and raw-R2 refit scored here)',
    'src/data/imp-96231-route-m-band-vs-drift-identifiability.js (the AIC/PRESS model-selection template this reuses)',
    'src/data/imp-96209-route-bd-online-margin-floor-gamma2000.js (gamma_2000 column, R2 gap first reversed to -0.01042)',
    'src/data/imp-96148-route-bd-online-margin-decay-law.js (original seven-point column and floor law)',
    'tmp/imp-96252-modelselect.mjs (OLS + AIC/AICc/BIC/PRESS reproduction on the baked literals).',
  ],
});

const D = ROUTE_BD_MARGIN_FLOOR_MODEL_SELECTION;

export const ROUTE_BD_MARGIN_FLOOR_MODEL_SELECTION_ASSERTIONS = Object.freeze([
  {
    name: 'OLS refit reproduces the imp-96224 baked R2 for both laws to <=0.0005',
    holds: () => Math.abs(D.refitValidation.logLinear.R2 - D.refitValidation.logLinear.R2Baked) <= 0.0005
      && Math.abs(D.refitValidation.recipLog.R2 - D.refitValidation.recipLog.R2Baked) <= 0.0005,
  },
  {
    name: 'log-linear has strictly lower RSS (higher R2) than the reciprocal-log floor law',
    holds: () => D.scores.logLinear.rss < D.scores.recipLog.rss
      && D.scores.logLinear.R2 > D.scores.recipLog.R2,
  },
  {
    name: 'all penalized criteria prefer the no-floor log-linear law (lower AIC/AICc/BIC)',
    holds: () => D.scores.logLinear.aic < D.scores.recipLog.aic
      && D.scores.logLinear.aicc < D.scores.recipLog.aicc
      && D.scores.logLinear.bic < D.scores.recipLog.bic,
  },
  {
    name: 'with equal parameter count the three IC deltas coincide (penalties are identical)',
    holds: () => Math.abs(D.deltas.dAIC - D.deltas.dAICc) < 1e-6
      && Math.abs(D.deltas.dAIC - D.deltas.dBIC) < 1e-6
      && D.deltas.dAIC > 0,
  },
  {
    name: 'the IC delta equals n*ln(RSS_recip/RSS_loglin) exactly (equal-k reduction to RSS)',
    holds: () => Math.abs(D.deltas.dAIC - D.n * Math.log(D.scores.recipLog.rss / D.scores.logLinear.rss)) < 0.02,
  },
  {
    name: 'the decisive margin exceeds the conventional dIC>10 threshold by a wide margin',
    holds: () => D.deltas.dAIC > 10 && D.deltas.dAICc > 10 && D.deltas.dBIC > 10,
  },
  {
    name: 'exact LOO/PRESS also prefers log-linear -- cross-validation does not rescue the floor law',
    holds: () => D.scores.logLinear.press < D.scores.recipLog.press
      && D.scores.logLinear.R2pred > D.scores.recipLog.R2pred
      && D.deltas.dPRESS > 0,
  },
  {
    name: 'Akaike weight sits essentially entirely on the no-floor law',
    holds: () => D.akaikeWeights.logLinear > 0.999
      && D.akaikeWeights.recipLog < 0.001
      && Math.abs(D.akaikeWeights.logLinear + D.akaikeWeights.recipLog - 1) < 1e-6,
  },
  {
    name: 'reading records that penalized/CV AGREE with the imp-96224 raw-R2 reversal',
    holds: () => /AGREE/.test(D.finding.penalizedAgreesWithRawR2)
      && /does NOT/.test(D.finding.looDoesNotRescueFloor)
      && /IDENTICAL/.test(D.finding.parameterParityMakesICRedundant),
  },
  {
    name: 'honest status: measurement/model-selection only, no bound change, no QED',
    holds: () => /MEASURED/.test(D.status)
      && /Changes no bound/.test(D.status)
      && /refereed bound is changed/i.test(D.status)
      && /RH open/.test(D.status)
      && /NO QED/.test(D.status),
  },
]);

for (const a of ROUTE_BD_MARGIN_FLOOR_MODEL_SELECTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96252-route-bd-margin-floor-model-selection assertion failed: ${a.name}`,
    );
  }
}

export default ROUTE_BD_MARGIN_FLOOR_MODEL_SELECTION;
