/**
 * @module imp-96385-exponent-gap-significance
 *
 * imp-96385 (numerical): assess the STATISTICAL SIGNIFICANCE of the imp-96346 fitted exponent gap
 * b_det - b_C = +0.02295 using ONLY the existing 5 detector rows (gamma in [14.13, 77.14], < 0.74
 * decade) -- WITHOUT new higher-gamma rows. The imp-96346 divergence verdict
 * (d(gamma) = 0.918024 gamma^0.02295 - 1, unbounded as gamma -> infinity) is contingent on this gap
 * being genuine; a gap of exactly 0 flips the verdict to a constant -8.198% offset. This ticket
 * quantifies whether the 5 rows can distinguish the two.
 *
 * INPUTS (baked literals, no heavy run):
 *   - shared gamma      = [14.1347, 25.0109, 37.5862, 49.7738, 77.1448]                 (imp-96149/96269)
 *   - measured N_det    = [12, 20, 33, 48, 107]  -> log-log OLS slope b_det = 1.271686   (imp-96149)
 *   - Christoffel N_C   = [12, 21, 33, 48, 104]  -> log-log OLS slope b_C   = 1.248736   (imp-96182/96269)
 *   - gap b_det - b_C   = +0.022950
 *
 * METHOD. Both b_det and b_C are OLS slopes of a log-log power fit over the SAME 5 gamma points, and
 * an OLS slope is a LINEAR functional of y with weights w_k = (x_k - xbar)/Sum_j (x_j - xbar)^2,
 * x_k = ln(gamma_k). Therefore
 *   b_det - b_C = Sum_k w_k [ln N_det_k - ln N_C_k] = Sum_k w_k r_k ,    r_k = ln(N_det_k / N_C_k),
 * i.e. the exponent gap is EXACTLY the OLS slope of the log-ratio r on x. Regressing the DIFFERENCE
 * directly gives an honest standard error that accounts for the strong correlation between the two
 * count columns (they agree to a few percent), instead of naively summing two per-fit slope variances.
 * We report (i) the classical OLS SE / t-statistic / 95% t-CI (dof = n-2 = 3) on the gap, and
 * (ii) a nonparametric bootstrap (20000 resamples of the 5 rows, degenerate resamples dropped).
 *
 * RESULT -- the exponent gap is NOT statistically distinguishable from zero on the 5 rows.
 *   - The log-ratio regression reproduces the gap EXACTLY: slope = +0.022950 (published gap).
 *   - Classical OLS: SE(gap) = 0.020920, t = gap/SE = 1.097 on dof = 3, two-sided p = 0.353,
 *     95% t-CI = [-0.043627, +0.089526]. ZERO LIES WELL INSIDE the interval.
 *   - Bootstrap (19967 valid resamples): SD(gap) = 0.029332, 95% CI = [-0.015865, +0.080280],
 *     fraction of resampled gaps <= 0 = 15.3%. ZERO LIES INSIDE the interval.
 *   - The entire signal lives in just 2 of the 5 rows: r = [0, -0.04879, 0, 0, +0.02844]. Three of
 *     the five log-ratios are EXACTLY 0 (N_det = N_C at k = 1, 6, 10), so the +0.02295 gap is driven
 *     solely by two integer count differences -- N_det 20 vs N_C 21 (k = 3) and 107 vs 104 (k = 20) --
 *     each a single off-line-detector vs Christoffel-threshold count off by +/-1 to +3. That is far
 *     inside the +/-1-order (~5%) column agreement imp-96182/96269 already reported, i.e. within the
 *     integer-counting noise of the reach columns themselves.
 *
 * VERDICT. Using ONLY the existing 5 detector rows, the imp-96346 exponent gap b_det - b_C = +0.02295
 * is NOT distinguishable from 0: t = 1.10 (p = 0.35), and 0 lies inside both the 95% t-CI
 * [-0.044, +0.090] and the bootstrap 95% CI [-0.016, +0.080]. Hence the diverging-vs-constant k = 5
 * verdict CANNOT be decided without new higher-gamma rows -- the "slowly diverging" reading of
 * imp-96346 and the "constant -8.198% offset" null (gap = 0) are statistically indistinguishable on
 * this data. This CONFIRMS and QUANTIFIES the imp-96346 sub-gap IMP96346_EXPONENT_GAP_PERSISTENCE:
 * the sign/magnitude of the gap needs real higher-gamma detector rows (fresh Levinson/Christoffel
 * runs past gamma_5), which remain OPEN. Statistical assessment on baked literals only; changes NO
 * bound; RH open; no refereed bound is changed; NO QED.
 *
 * Reproduce: tmp/imp-96385-scratch.mjs (pure-JS log-ratio OLS + t-CI + nonparametric bootstrap).
 *
 * @see imp-96346-route-l-largegamma-residual-tail.js (parent: divergence verdict + sub-gap)
 * @see imp-96375-route-l-k5-residual-diverging-not-constant-glossary-headword.js (headword CAVEAT)
 * @see imp-96149-route-l-detector-reach-law-fit.js (detector column + b_det)
 * @see imp-96182-christoffel-reach-law.js (Christoffel column + b_C)
 * @see imp-96269-route-l-reach-law-crosscheck.js (both fits, shared gamma)
 *
 * Ticket: imp-96385 (numerical, high). Import-light: pure exported literals, no zeros-bundle import,
 * no self-executing throw.
 */

export const IMP96385_EXPONENT_GAP_SIGNIFICANCE = Object.freeze({
  sharedGamma: Object.freeze([14.1347, 25.0109, 37.5862, 49.7738, 77.1448]),
  measuredNdet: Object.freeze([12, 20, 33, 48, 107]),
  christoffelNC: Object.freeze([12, 21, 33, 48, 104]),
  bDet: 1.271686,
  bC: 1.248736,
  gap: 0.022950,             // b_det - b_C, reproduced EXACTLY by the log-ratio OLS slope
  nRows: 5,
  gammaWindowDecades: 0.7357, // log10(77.1448 / 14.1347)
  // the gap is exactly the OLS slope of the log-ratio r_k = ln(N_det_k / N_C_k) on x_k = ln(gamma_k)
  method: 'gap = OLS slope of ln(N_det/N_C) on ln(gamma); linear-functional identity over shared x',
  logRatioResiduals: Object.freeze([0.0, -0.048790, 0.0, 0.0, 0.028446]),
  // classical OLS inference on the gap (dof = n - 2 = 3)
  ols: Object.freeze({
    slope: 0.022950,
    seSlope: 0.020920,
    tStat: 1.0970,
    dof: 3,
    pValueTwoSided: 0.3528,
    t95Critical: 3.182446,       // t_{0.975, 3}
    ci95: Object.freeze([-0.043627, 0.089526]),
    zeroInside95CI: true,
  }),
  // nonparametric bootstrap over the 5 rows (resample with replacement, refit slope)
  bootstrap: Object.freeze({
    nResamplesRequested: 20000,
    nResamplesValid: 19967,       // degenerate all-equal-x resamples dropped
    seed: 12345,
    meanGap: 0.028090,
    sdGap: 0.029332,
    ci95: Object.freeze([-0.015865, 0.080280]),
    fracGapLeZero: 0.1531,
    zeroInside95CI: true,
  }),
  // headline
  gapDistinguishableFromZero: false,
  divergingVsConstantDecidableFrom5Rows: false,
  signalConcentration: 'entire gap from 2 of 5 rows (k=3: 20 vs 21; k=20: 107 vs 104); 3 rows exactly 0',
  withinColumnIntegerNoise: true,  // both +/-1..+3 count diffs are inside the 5% column agreement
  confirmsSubGap: 'IMP96346_EXPONENT_GAP_PERSISTENCE',
  needsHigherGammaRows: true,
  changesBound: false,
  rhOpen: true,
});

export const IMP96385_VERDICT =
  'Statistical significance of the imp-96346 exponent gap b_det - b_C = +0.02295 on the existing 5 '
  + 'detector rows (gamma in [14.13, 77.14], 0.74 decade): the gap is EXACTLY the OLS slope of the '
  + 'log-ratio ln(N_det/N_C) on ln(gamma) (both fits share the same 5 x-values, so the slope difference '
  + 'is a single linear functional of the log-ratio). That regression reproduces +0.02295 and gives '
  + 'SE = 0.02092, t = 1.10 on dof = 3, two-sided p = 0.35, 95% t-CI = [-0.044, +0.090]; a nonparametric '
  + 'bootstrap (20000 resamples) gives SD = 0.0293, 95% CI = [-0.016, +0.080] with 15.3% of resampled '
  + 'gaps <= 0. ZERO lies well inside both intervals, so the gap is NOT distinguishable from 0 on this '
  + 'data. The whole +0.02295 comes from just 2 of the 5 rows (three log-ratios are exactly 0), namely '
  + 'the integer count diffs 20-vs-21 and 107-vs-104, both inside the 5% reach-column agreement -- i.e. '
  + 'within integer-counting noise. VERDICT: the diverging-vs-constant k = 5 verdict CANNOT be decided '
  + 'without new higher-gamma rows; the imp-96346 "slowly diverging" reading and the gap = 0 "constant '
  + '-8.198% offset" null are statistically indistinguishable on the 5 rows, confirming/quantifying the '
  + 'imp-96346 sub-gap IMP96346_EXPONENT_GAP_PERSISTENCE. Statistical assessment on baked literals only; '
  + 'changes no bound; RH open; no refereed bound is changed; NO QED.';

export const IMP96385_SCRIPTS = Object.freeze(['tmp/imp-96385-scratch.mjs']);
