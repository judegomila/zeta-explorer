/**
 * imp-96268 -- Naive linear extrapolation of the imp-95562 finding-4 number-variance
 * ratio to its GUE-saturation height: the extrapolation is DEGENERATE.
 *
 * imp-95562 finding 4 reports that at accessible heights the measured pointwise
 * variance of C - E is only ~40% of the GUE asymptote Sigma^2(L) (mean var-ratio
 * ~0.40), a finite-height arithmetic suppression of the number variance. This
 * module answers the natural follow-up: if one fits the per-height var-ratio
 * r(T) = sd(C-E)^2 / Sigma^2(L) as a log-linear growth and extrapolates to
 * r = 1 (GUE saturation), what height does that predict?
 *
 * MEASUREMENT (import-light; re-derives the ratios from the baked imp-95562
 * sd(C-E) literals and the same envelope/GUE formulas, then fits vs log T):
 *   r(T_c) = sd(C-E)^2 / Sigma^2(L(T_c)),  L = 2 Delta delta(T),
 *   Sigma^2(L) = (1/pi^2)(log(2pi L) + gamma_E + 1)  (Dyson-Mehta large-L).
 * over the six sample heights T_c = 1e4 .. 5e5.
 *
 * FINDINGS.
 *  1. The six-height ladder is NOT monotone increasing: the ratios are
 *     0.4797, 0.3872, 0.3487, 0.4624, 0.3780, 0.3528 -- a scattered band in
 *     [0.349, 0.480] about the mean 0.401, with a conspicuous non-monotone bump
 *     at T = 1.5e5 (the same windowing-artifact height flagged by imp-95806).
 *  2. The OLS log-linear fit r(T) = a + b log T has a NEGATIVE slope
 *     (b = -0.0208 per unit log T, a = 0.6385) with a poor R^2 = 0.296 --
 *     the ratio is noise-dominated and, if anything, drifts DOWN with height,
 *     not up toward the GUE asymptote 1. (Matches the imp-95710/imp-95843
 *     weak-negative-slope tabulation.)
 *  3. Because the fitted slope is negative, solving a + b log T = 1 gives
 *     log T_sat = (1 - a)/b = -17.36, i.e. T_sat ~ 2.9e-8 -- BELOW the sampled
 *     range and physically meaningless. There is NO forward height at which the
 *     linear extrapolation reaches GUE saturation; the naive extrapolation is
 *     degenerate. Its fragility is maximal: even the SIGN of the trend is not
 *     robust across the six noisy points (R^2 ~ 0.30).
 *
 * VERDICT. The imp-95562 finite-height suppression does NOT visibly relax across
 * T = 1e4 .. 5e5, so a naive log-linear extrapolation cannot produce a GUE-
 * saturation height -- the fit slopes the wrong way and the extrapolant is
 * degenerate. The rigorous replacement is the imp-95722 derived envelope, a
 * MONOTONE-DECREASING cap r_cap(T) with r_cap(3e12) ~ 0.26 < 1: the ratio never
 * approaches 1 at any height reachable in this program, and GUE saturation is a
 * strictly-limiting (T -> infinity) statement, not a finite crossing. This
 * MEASURES the extrapolation and reports its fragility; it changes no bound and
 * asserts no QED. No refereed bound is changed; the zero-side route
 * stays PCC/GRH-gated regardless.
 *
 * Import-light: no zeros bundle, no sibling imports. Envelope/GUE formulas are
 * re-derived here; only the sd(C-E) values are baked imp-95562 literals.
 * @see imp-95562-meansquare-vs-pointwise-gap (finding 4, the ratio)
 * @see imp-95710-number-variance-ratio-vs-height (the r(T) tabulation)
 * @see imp-95722-number-variance-ratio-window-bottom-bound (the rigorous envelope)
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;

const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(v), v = T/2pi
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // E = 2 Delta delta
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);

// Baked imp-95562 sd(C - E) literals (the only zero-dependent inputs); the ratio
// r(T) = sd^2 / Sigma^2(L) is re-derived below from the closed-form envelope/GUE.
const MEASURED = [
  { Tc: 1.0e4, sdDiscrepancy: 0.6218 },
  { Tc: 3.0e4, sdDiscrepancy: 0.5823 },
  { Tc: 7.0e4, sdDiscrepancy: 0.5689 },
  { Tc: 1.5e5, sdDiscrepancy: 0.6714 },
  { Tc: 3.0e5, sdDiscrepancy: 0.6199 },
  { Tc: 5.0e5, sdDiscrepancy: 0.6078 },
];

const ROWS = MEASURED.map((m) => {
  const L = envelopeCount(m.Tc);
  const gueVar = gueNumberVariance(L);
  return {
    Tc: m.Tc,
    logT: Math.log(m.Tc),
    meanLocalCountL: L,
    gueVariance: gueVar,
    varRatioMeasuredOverGUE: (m.sdDiscrepancy * m.sdDiscrepancy) / gueVar,
  };
});

const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const avgVarRatio = mean(ROWS.map((r) => r.varRatioMeasuredOverGUE));
const monotoneIncreasing = ROWS.every(
  (r, i) => i === 0 || r.varRatioMeasuredOverGUE > ROWS[i - 1].varRatioMeasuredOverGUE,
);

// OLS log-linear fit r(T) = a + b log T
const xs = ROWS.map((r) => r.logT);
const ys = ROWS.map((r) => r.varRatioMeasuredOverGUE);
const mx = mean(xs);
const my = mean(ys);
let sxy = 0;
let sxx = 0;
for (let i = 0; i < xs.length; i++) {
  sxy += (xs[i] - mx) * (ys[i] - my);
  sxx += (xs[i] - mx) * (xs[i] - mx);
}
const slope = sxy / sxx; // b
const intercept = my - slope * mx; // a
let ssr = 0;
let sst = 0;
for (let i = 0; i < xs.length; i++) {
  const pred = intercept + slope * xs[i];
  ssr += (ys[i] - pred) * (ys[i] - pred);
  sst += (ys[i] - my) * (ys[i] - my);
}
const rSquared = 1 - ssr / sst;

// Extrapolate to GUE saturation r = 1: log T_sat = (1 - a)/b
const saturationLogT = (1 - intercept) / slope;
const saturationT = Math.exp(saturationLogT);
const minSampledLogT = Math.min(...xs);
// Degenerate iff the crossing falls below the sampled window (negative slope pushes it backward)
const extrapolationDegenerate = saturationLogT < minSampledLogT;

export const IMP96268_VARRATIO_GUE_SATURATION_EXTRAPOLATION = {
  ticket: 'imp-96268',
  source:
    'imp-95562 finding 4 (var-ratio ~0.40 finite-height suppression); re-derives r(T) from baked sd(C-E) literals + closed-form envelope/GUE, fits vs log T, extrapolates to r = 1',
  definitions: {
    varRatio: 'r(T) = sd(C-E)^2 / Sigma^2(L), Sigma^2(L) = (1/pi^2)(log(2pi L) + gamma_E + 1)',
    saturation: 'GUE saturation = r(T) -> 1; extrapolated height solves a + b log T = 1 under the OLS log-linear fit',
  },
  rows: ROWS,
  fit: {
    slope, // b, per unit log T
    intercept, // a
    rSquared,
    avgVarRatio, // ~0.401
    monotoneIncreasing, // false: non-monotone ladder
    saturationLogT, // (1 - a)/b
    saturationT, // exp(saturationLogT) -- degenerate (below the sampled range)
    extrapolationDegenerate, // true: negative slope => no forward saturation height
    minSampledLogT,
  },
  verdict:
    'MEASURED: the six-height var-ratio ladder r(T) = sd(C-E)^2 / Sigma^2(L) is NOT monotone increasing (values 0.4797, 0.3872, 0.3487, 0.4624, 0.3780, 0.3528 in [0.349, 0.480] about mean 0.401, with a non-monotone bump at the T=1.5e5 windowing-artifact height). The OLS log-linear fit r = a + b log T has a NEGATIVE slope b = -0.0208 (a = 0.6385, R^2 = 0.296, noise-dominated), so solving a + b log T = 1 gives log T_sat = -17.36, i.e. T_sat ~ 2.9e-8 -- below the sampled range and meaningless. There is NO forward GUE-saturation height from this ladder; the naive extrapolation is DEGENERATE and maximally fragile (even the sign of the trend is not robust). The rigorous replacement is the imp-95722 monotone-decreasing envelope with r_cap(3e12) ~ 0.26 < 1: the ratio never approaches 1 at any program-accessible height, and GUE saturation is a strictly-limiting T -> infinity statement. Changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // ratio re-derivation matches a spot value from imp-95562 (varRatioMeasuredOverGUE at T=5e5)
  const r5 = ROWS[ROWS.length - 1];
  if (!approx(r5.varRatioMeasuredOverGUE, 0.35275, 5e-5)) throw new Error('imp-96268: var-ratio re-derivation mismatch');
  // the ladder is genuinely non-monotone (the follow-up premise of a monotone climb to GUE is refuted)
  if (monotoneIncreasing) throw new Error('imp-96268: ladder unexpectedly monotone -- finding assumed non-monotone');
  // the fitted slope is negative (ratio does not climb toward GUE)
  if (!(slope < 0)) throw new Error('imp-96268: OLS slope not negative -- extrapolation-degenerate claim broken');
  // the fit is noise-dominated
  if (!(rSquared >= 0 && rSquared < 0.5)) throw new Error('imp-96268: R^2 outside the noise-dominated band');
  // mean ratio sits near 0.40 and below the GUE asymptote 1
  if (!approx(avgVarRatio, 0.401, 5e-3)) throw new Error('imp-96268: avg var-ratio off ~0.40');
  if (!(avgVarRatio > 0 && avgVarRatio < 1)) throw new Error('imp-96268: avg var-ratio outside (0,1)');
  // the extrapolation is degenerate: the r=1 crossing falls below the sampled window
  if (!extrapolationDegenerate) throw new Error('imp-96268: extrapolation not degenerate -- negative-slope claim broken');
  if (!(saturationLogT < 0)) throw new Error('imp-96268: saturation log T not negative -- degeneracy claim broken');
  // honesty gates: measurement only, no bound change
  if (!/NO QED/.test(IMP96268_VARRATIO_GUE_SATURATION_EXTRAPOLATION.verdict))
    throw new Error('imp-96268: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96268_VARRATIO_GUE_SATURATION_EXTRAPOLATION.verdict))
    throw new Error('imp-96268: verdict dropped the no-refereed-bound-change banner');
  // the rigorous replacement pointer (imp-95722) must stay attached
  if (!/imp-95722/.test(IMP96268_VARRATIO_GUE_SATURATION_EXTRAPOLATION.verdict))
    throw new Error('imp-96268: verdict dropped the imp-95722 rigorous-envelope pointer');
})();

export default IMP96268_VARRATIO_GUE_SATURATION_EXTRAPOLATION;
