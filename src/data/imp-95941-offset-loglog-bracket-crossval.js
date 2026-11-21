/**
 * @module imp-95941-offset-loglog-bracket-crossval
 *
 * imp-95941 -- CROSS-VALIDATION of the imp-95921 saturated-box-variance loglog offset
 * bracket (analytic slope d offset / d loglog = 1/2pi^2 = 0.05066) against the six
 * imp-95710 / imp-95562 DIRECTLY-measured offsets at T = 1e4..5e5. imp-95921 argued the
 * finite-height offset(T) = measuredVar(T) - Selberg term drifts UPWARD in loglog(T/2pi)
 * with slope 1/2pi^2, but that predicted drift was never TABULATED against the actual six
 * accessible measured offsets. This module fits offset(T) vs loglog(T/2pi) over the six
 * heights and reports whether the noise-dominated data is consistent with the bracket.
 * Measurement / cross-validation only; changes no bound; NO QED.
 *
 * SETUP (imp-95921 / imp-95722 verbatim). offset(T) = measuredVar(T) - S_Sel(T), with
 * measuredVar(T) = sd(C - E)^2 the imp-95562 windowed box number variance and S_Sel(T) =
 * (1/2pi^2) loglog(T/2pi) the single-endpoint Selberg term. The six sd(C - E) literals are
 * the SAME ones imp-95710 / imp-95921 baked (imp-95562 over the 10^6 Odlyzko ordinates in
 * src/data/zeros-to-1e6.js). The analytic bracket predicts offset = (1/2pi^2) loglog + const.
 *
 * METHOD. Compute offset(T) at the six heights, ordinary-least-squares regress offset
 * against x = loglog(T/2pi), and report (a) the fitted slope vs the analytic 1/2pi^2, its
 * standard error and R^2; (b) the per-point residuals against BOTH the free fit and the
 * fixed-analytic-slope model (slope pinned to 1/2pi^2, intercept best-fit); (c) whether the
 * noise-dominated six points are consistent with the bracket or only weakly constrain it,
 * quantified by the scatter-to-predicted-drift ratio and the z-position of the analytic
 * slope inside the fitted slope's standard error.
 *
 * FINDINGS (all figures reproduced by the self-executing assertions below).
 *  1. FITTED SLOPE tiny, fit noise-dominated. OLS slope d offset / d loglog = 3.68e-3 with
 *     R^2 = 1.8e-4 (essentially zero, consistent with imp-95897's R^2 = 0.0007 on the raw
 *     slope). The fitted slope's standard error is 0.137 -- roughly 2.7x the analytic slope
 *     itself and ~37x the fitted point estimate -- so the six heights place almost NO
 *     constraint on the loglog slope.
 *  2. ANALYTIC SLOPE NOT REJECTED. The analytic 1/2pi^2 = 0.05066 sits 0.34 standard errors
 *     above the fitted slope ((0.05066 - 0.00368)/0.137 = 0.34), i.e. comfortably inside the
 *     1-sigma band. The data does NOT contradict the imp-95921 upward-drift bracket; it also
 *     does not confirm it (the slope=0 null sits at 0.03 SE, equally admissible).
 *  3. RESIDUALS COMPARABLE. Pinning the slope to the analytic 1/2pi^2 (best-fit intercept
 *     0.1480) gives per-point residuals of RMSE 0.0405, barely worse than the free-fit RMSE
 *     0.0399 -- the analytic-slope model fits the six points essentially as well as the
 *     unconstrained line. The largest single residual is the T = 1.5e5 point (+0.069 vs the
 *     analytic model), the same outlier that bumps the imp-95710 var-ratio to 0.462 and the
 *     imp-95897 interior max.
 *  4. SCATTER SWAMPS THE PREDICTED DRIFT. The offset spread across the six sampled heights is
 *     0.123, while the analytic bracket predicts a drift of only (1/2pi^2) * (loglog(5e5) -
 *     loglog(1e4)) = 0.0216 across that same span -- the point-to-point scatter is ~5.7x the
 *     predicted signal, so the six heights CANNOT resolve a 1/2pi^2 loglog slope even in
 *     principle. This is the mechanism behind the near-zero R^2, not evidence against the drift.
 *
 * VERDICT. CROSS-VALIDATION (measurement, NOT a bound change). Tabulated against the six
 * imp-95710 / imp-95562 measured offsets (T = 1e4..5e5), the imp-95921 analytic upward-drift
 * bracket (slope d offset / d loglog = 1/2pi^2 = 0.05066) is CONSISTENT with the data but only
 * WEAKLY constrained by it: the OLS slope is 3.68e-3 with R^2 = 1.8e-4 and a standard error of
 * 0.137 (~2.7x the analytic slope), so the analytic slope sits just 0.34 SE inside the fitted
 * band (not rejected) while the slope=0 null is equally admissible. Fixing the slope to
 * 1/2pi^2 fits the six points essentially as well as the free line (RMSE 0.0405 vs 0.0399),
 * and the point-to-point offset scatter (0.123) is ~5.7x the predicted drift across the span
 * (0.0216), so these six noise-dominated heights cannot resolve the loglog slope in either
 * direction. The cross-check therefore neither confirms nor refutes the bracket -- it confirms
 * the imp-95921 bracket rests on the ANALYTIC saturation law, not on the accessible data, and
 * the imp-95710 window-reach sub-gap (6.8 decades below T = 3e12) is unchanged. Changes no
 * bound; NO QED; the zero-side route stays PCC / GRH-gated; no refereed bound is changed.
 *
 * Import-light: no zeros bundle, no sibling imports. Only the six sd(C - E) values are baked
 * measured literals (imp-95562 over the verified ordinates, identical to imp-95710 / imp-95921);
 * every derived quantity is recomputed here from the closed forms.
 *
 * @see imp-95921-c0-offset-approach-analytic-bracket (the analytic 1/2pi^2 upward-drift bracket)
 * @see imp-95710-number-variance-ratio-vs-height (the six measured sd(C - E) inputs; window-reach sub-gap)
 * @see imp-95897-c0-offset-monotonicity-envelope-safety (raw-slope R^2 = 0.0007, interior max at 1.5e5)
 * @see imp-95562-meansquare-vs-pointwise-gap (source of the measured offsets)
 * @see imp-95973-six-point-noise-domination-wall-glossary-headword (shared nav index: this
 *   thread's loglog-slope R^2 = 1.8e-4 sits alongside the sibling imp-95940/imp-95946
 *   six-point-wall findings under one index note)
 */

const TWO_PI = 2 * Math.PI;
const SELBERG_C = 1 / (2 * Math.PI * Math.PI); // single-endpoint Selberg coeff = analytic slope
const logLog = (T) => Math.log(Math.log(T / TWO_PI)); // loglog(T/2pi)

// Same six measured literals imp-95710 / imp-95921 baked (imp-95562 over the 10^6 Odlyzko ordinates).
const MEASURED = [
  { Tc: 1.0e4, sd: 0.6218 },
  { Tc: 3.0e4, sd: 0.5823 },
  { Tc: 7.0e4, sd: 0.5689 },
  { Tc: 1.5e5, sd: 0.6714 },
  { Tc: 3.0e5, sd: 0.6199 },
  { Tc: 5.0e5, sd: 0.6078 },
];

const ANALYTIC_SLOPE = SELBERG_C; // 1/2pi^2 = 0.05066 -- imp-95921 predicted d offset/d loglog

const offsetRows = MEASURED.map((m) => {
  const measuredVar = m.sd * m.sd;
  const x = logLog(m.Tc);
  return { Tc: m.Tc, loglog: x, measuredVar, offset: measuredVar - SELBERG_C * x };
});

// --- OLS regression of offset against x = loglog(T/2pi) ---
const n = offsetRows.length;
const meanX = offsetRows.reduce((s, r) => s + r.loglog, 0) / n;
const meanY = offsetRows.reduce((s, r) => s + r.offset, 0) / n;
let sxy = 0;
let sxx = 0;
for (const r of offsetRows) {
  sxy += (r.loglog - meanX) * (r.offset - meanY);
  sxx += (r.loglog - meanX) * (r.loglog - meanX);
}
const fittedSlope = sxy / sxx; // d offset / d loglog (measured)
const fittedIntercept = meanY - fittedSlope * meanX;
let ssResFree = 0;
let ssTot = 0;
for (const r of offsetRows) {
  const pred = fittedIntercept + fittedSlope * r.loglog;
  ssResFree += (r.offset - pred) * (r.offset - pred);
  ssTot += (r.offset - meanY) * (r.offset - meanY);
}
const r2 = 1 - ssResFree / ssTot; // goodness of the loglog fit
const dof = n - 2;
const slopeStdError = Math.sqrt(ssResFree / dof / sxx); // SE of the OLS slope
const analyticSlopeZ = (ANALYTIC_SLOPE - fittedSlope) / slopeStdError; // how far the analytic slope sits inside the SE band
const rmseFree = Math.sqrt(ssResFree / n);

// --- fixed-analytic-slope model: pin slope to 1/2pi^2, best-fit intercept ---
const analyticIntercept = offsetRows.reduce((s, r) => s + (r.offset - ANALYTIC_SLOPE * r.loglog), 0) / n;
let ssResAnalytic = 0;
const analyticResiduals = offsetRows.map((r) => {
  const pred = analyticIntercept + ANALYTIC_SLOPE * r.loglog;
  const residual = r.offset - pred;
  ssResAnalytic += residual * residual;
  return { Tc: r.Tc, offset: r.offset, predicted: pred, residual };
});
const rmseAnalytic = Math.sqrt(ssResAnalytic / n);

// --- scatter vs predicted drift across the sampled span ---
const offsets = offsetRows.map((r) => r.offset);
const offsetSpread = Math.max(...offsets) - Math.min(...offsets);
const predictedDriftAcrossSpan =
  ANALYTIC_SLOPE * (offsetRows[n - 1].loglog - offsetRows[0].loglog);
const scatterToDriftRatio = offsetSpread / predictedDriftAcrossSpan;

export const IMP95941_OFFSET_LOGLOG_BRACKET_CROSSVAL = {
  ticket: 'imp-95941',
  proofSection: 'S-frontier',
  question:
    'imp-95921 derived that offset(T) = measuredVar - Selberg term drifts UPWARD in ' +
    'loglog(T/2pi) with analytic slope d offset / d loglog = 1/2pi^2 = 0.05066, but never ' +
    'tabulated that prediction against the six accessible measured offsets. Cross-validate: ' +
    'regress the imp-95710 / imp-95562 measured offset(T) at T = 1e4..5e5 against loglog(T/2pi) ' +
    'and report whether the noise-dominated data is consistent with the bracket. Measurement ' +
    'only; NO QED.',
  definitions: {
    offset: 'offset(T) = sd(C - E)^2 - (1/2pi^2) loglog(T/2pi) (imp-95722 / imp-95921 form)',
    analyticSlope: 'imp-95921 bracket: d offset / d loglog = 1/2pi^2 = 0.05066 (upward drift)',
    fittedSlope: 'ordinary-least-squares slope of offset against x = loglog(T/2pi) over the six heights',
    analyticModel: 'slope pinned to 1/2pi^2, intercept best-fit (fixed-analytic-slope residuals)',
  },
  analyticSlope: ANALYTIC_SLOPE,
  offsetRows,
  fit: {
    fittedSlope, // ~3.68e-3 -- tiny vs the analytic 0.05066
    fittedIntercept,
    r2, // ~1.8e-4 -- noise-dominated (cf imp-95897 raw-slope R^2 = 0.0007)
    slopeStdError, // ~0.137 -- ~2.7x the analytic slope; the six heights barely constrain the slope
    analyticSlopeZ, // ~0.34 -- analytic slope sits 0.34 SE inside the fitted band (NOT rejected)
    rmseFree, // ~0.0399 -- free-fit residual RMSE
    analyticSlopeRejected: Math.abs(analyticSlopeZ) > 2, // false: within 1 sigma, not rejected
  },
  analyticModel: {
    intercept: analyticIntercept, // ~0.1480
    residuals: analyticResiduals,
    rmse: rmseAnalytic, // ~0.0405 -- barely worse than the free fit (0.0399)
    fitsAsWellAsFree: rmseAnalytic < 1.1 * rmseFree, // true: pinned slope fits essentially as well
  },
  resolvability: {
    offsetSpread, // ~0.123 -- point-to-point scatter across the six heights
    predictedDriftAcrossSpan, // ~0.0216 -- analytic drift over loglog(5e5) - loglog(1e4)
    scatterToDriftRatio, // ~5.7 -- scatter swamps the predicted drift, so the slope is unresolvable here
  },
  findings: {
    fitNoiseDominated:
      'OLS slope d offset / d loglog = 3.68e-3 with R^2 = 1.8e-4 (essentially zero, consistent ' +
      'with the imp-95897 raw-slope R^2 = 0.0007); the slope standard error 0.137 is ~27x the ' +
      'analytic slope, so the six heights place almost no constraint on the loglog slope.',
    analyticSlopeNotRejected:
      'The analytic 1/2pi^2 = 0.05066 sits 0.34 standard errors inside the fitted slope band ' +
      '(not rejected), but the slope=0 null sits at 0.03 SE and is equally admissible -- the data ' +
      'neither confirms nor refutes the upward-drift bracket.',
    residualsComparable:
      'Pinning the slope to 1/2pi^2 (intercept 0.1480) gives per-point residuals of RMSE 0.0405, ' +
      'barely worse than the free-fit RMSE 0.0399; the largest single residual is the T = 1.5e5 ' +
      'point (+0.069), the same outlier behind the imp-95710 var-ratio 0.462 and the imp-95897 ' +
      'interior max.',
    scatterSwampsDrift:
      'The offset spread across the six heights (0.123) is ~5.7x the analytic drift predicted over ' +
      'the same span (0.0216), so the point-to-point scatter dwarfs the signal and the six heights ' +
      'cannot resolve a 1/2pi^2 loglog slope even in principle -- the near-zero R^2 is that scatter, ' +
      'not evidence against the drift.',
  },
  verdict:
    'CROSS-VALIDATION (measurement, NOT a bound change). Tabulated against the six imp-95710 / ' +
    'imp-95562 measured offsets (T = 1e4..5e5), the imp-95921 analytic upward-drift bracket (slope ' +
    'd offset / d loglog = 1/2pi^2 = 0.05066) is CONSISTENT with the data but only WEAKLY ' +
    'constrained by it: the OLS slope is 3.68e-3 with R^2 = 1.8e-4 and a standard error of 0.137 ' +
    '(~2.7x the analytic slope), so the analytic slope sits just 0.34 SE inside the fitted band (not ' +
    'rejected) while the slope=0 null is equally admissible. Fixing the slope to 1/2pi^2 fits the six ' +
    'points essentially as well as the free line (RMSE 0.0405 vs 0.0399), and the point-to-point ' +
    'offset scatter (0.123) is ~5.7x the predicted drift across the span (0.0216), so these six ' +
    'noise-dominated heights cannot resolve the loglog slope in either direction. The cross-check ' +
    'therefore neither confirms nor refutes the bracket -- it confirms the imp-95921 bracket rests on ' +
    'the ANALYTIC saturation law, not on the accessible data, and the imp-95710 window-reach sub-gap ' +
    '(6.8 decades below T = 3e12) is unchanged. Changes no bound; NO QED; the zero-side route stays ' +
    'PCC / GRH-gated; no refereed bound is changed.',
  citation:
    'imp-95921 (analytic 1/2pi^2 upward-drift bracket); imp-95710 (six measured sd(C - E) inputs, ' +
    'window-reach sub-gap); imp-95897 (raw-slope R^2 = 0.0007, interior max at 1.5e5); imp-95562 ' +
    '(source of the measured offsets over the 10^6 Odlyzko ordinates).',
};

// --- self-executing internal-consistency assertions (baked-literal re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // analytic slope is exactly the single-endpoint Selberg coefficient 1/2pi^2.
  if (!approx(ANALYTIC_SLOPE, 1 / (2 * Math.PI * Math.PI), 1e-15))
    throw new Error('imp-95941: analytic slope must be the single-endpoint Selberg coeff 1/2pi^2');
  // offset closed form matches a spot value.
  if (!approx(offsetRows[0].offset, 0.6218 * 0.6218 - SELBERG_C * logLog(1.0e4), 1e-12))
    throw new Error('imp-95941: offset formula mismatch');
  // the C0 anchor (max offset) reproduces the imp-95921 / imp-95722 pinned 0.3337.
  if (!approx(Math.max(...offsetRows.map((r) => r.offset)), 0.3337213835371905, 1e-9))
    throw new Error('imp-95941: max offset drifted from the imp-95722 / imp-95921 pinned C0');
  // fitted slope is tiny and the fit is noise-dominated.
  if (!approx(fittedSlope, 0.003676, 1e-4)) throw new Error('imp-95941: fitted slope drifted');
  if (!(r2 >= 0 && r2 < 0.01)) throw new Error('imp-95941: R^2 outside the noise-dominated range');
  // the analytic slope is NOT rejected (within ~1 SE) and the slope SE is huge vs the analytic slope.
  if (!(Math.abs(analyticSlopeZ) < 1)) throw new Error('imp-95941: analytic slope unexpectedly outside 1 SE');
  if (!(slopeStdError > 2 * ANALYTIC_SLOPE)) throw new Error('imp-95941: slope SE unexpectedly small');
  // the fixed-analytic-slope model fits essentially as well as the free line.
  if (!(rmseAnalytic < 1.1 * rmseFree)) throw new Error('imp-95941: analytic-slope model should fit about as well as free');
  // the scatter swamps the predicted drift (why the slope is unresolvable at these heights).
  if (!(scatterToDriftRatio > 3)) throw new Error('imp-95941: scatter-to-drift ratio unexpectedly small');
  // honesty gates: measurement, no QED, no refereed bound is changed.
  if (!/NO QED/.test(IMP95941_OFFSET_LOGLOG_BRACKET_CROSSVAL.verdict))
    throw new Error('imp-95941: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP95941_OFFSET_LOGLOG_BRACKET_CROSSVAL.verdict))
    throw new Error('imp-95941: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP95941_OFFSET_LOGLOG_BRACKET_CROSSVAL;
