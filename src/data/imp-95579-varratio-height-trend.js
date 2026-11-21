/**
 * imp-95579 -- RECOMPUTING the GUE number-variance ratio at a DENSER set of heights
 * and assessing the finite-height arithmetic-suppression trend toward the
 * Dyson-Mehta asymptote.
 *
 * imp-95562 finding 4 measured, at six sample heights, that the pointwise number
 * variance is only ~40% of the GUE asymptote (mean var-ratio 0.40) -- finite-height
 * arithmetic suppression -- making the mean-square/GUE envelope conservative. It did
 * not resolve whether that ratio DRIFTS toward 1 with height (the Dyson-Mehta limit).
 * This module refines the height grid to 16 log-spaced sample heights across
 * [1e4, 5e5] and fits the trend.
 *
 * METHOD (offline: tmp/imp-95579-varratio-trend.mjs, over the 10^6 Odlyzko ordinates
 * in src/data/zeros-to-1e6.js -- ACTUAL zeta zeros). Identical hard-box tiling to
 * imp-95562: at each height T_c tile non-overlapping windows of half-width
 * Delta(t) = sqrt(t/2pi), step 2 Delta (touching, near-independent), across a +/-30%
 * span; measure the discrepancy D = C - E of the pointwise local count against the
 * mean-square envelope E = 2 Delta delta(t); form var(D) and the ratio to the GUE
 * prediction Sigma^2(L) = (1/pi^2)(log(2pi L) + gamma_E + 1). Only the height grid is
 * refined -- this is a measurement-only trend refinement of imp-95562 finding 4.
 *
 * FINDINGS.
 *  1. avg var-ratio 0.40 across the denser grid -- reproduces imp-95562 finding 4 with
 *     no shift, so the ~40% suppression is robust to the height sampling, not an
 *     artifact of the six original centres.
 *  2. The ratio does NOT drift toward 1 over [1e4, 5e5]. A least-squares fit of
 *     var-ratio against log10 T gives a SLIGHTLY NEGATIVE slope (-0.060 per decade,
 *     R^2 ~ 0.30 -- weak), i.e. no measurable approach to the Dyson-Mehta asymptote;
 *     if anything the ratio inches AWAY from 1 with height over this range.
 *  3. The mechanism is transparent: the measured pointwise sd of D is essentially
 *     HEIGHT-INDEPENDENT (~0.61 zeros, flat across the whole range) while the GUE sd
 *     grows LOGARITHMICALLY (0.90 -> 1.02). The ratio of variances therefore drifts
 *     downward simply because the denominator grows while the numerator holds -- the
 *     GUE envelope becomes MORE, not less, conservative as height increases here.
 *
 * VERDICT. Refines imp-95562 finding 4: the ~40% finite-height suppression is robust
 * and does NOT relax toward the GUE asymptote across the accessible [1e4, 5e5] range
 * -- the measured pointwise fluctuation is flat (~0.61 zeros) while the GUE prediction
 * grows logarithmically, so the GUE/mean-square envelope stays a ~2.5x conservative
 * over-estimate of the true pointwise variance throughout, with no visible trend toward
 * ratio = 1 at these heights. This MEASURES the trend; it changes no bound and asserts
 * no QED. No refereed bound is changed; the zero-side route stays
 * PCC/GRH-gated regardless.
 *
 * Import-light: no zeros bundle, no sibling imports. Envelope/GUE formulas are
 * re-derived here; only the zero-dependent sd (var) of D per height is a baked literal
 * from the offline run over the verified ordinates.
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;

const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(v), v = T/2pi
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // E = 2 Delta delta
// GUE number variance for a hard box of mean count L (Dyson-Mehta large-L asymptotic)
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);

// Baked from tmp/imp-95579-varratio-trend.mjs over the 10^6 Odlyzko ordinates.
// sdDiscrepancy (sd of D = C - E over the tiled windows) is the ZERO-DEPENDENT measured
// quantity per height; everything else (L, sdGUE, varRatio) is re-derived below.
const MEASURED = [
  { Tc: 10000, nWindows: 75, sdDiscrepancy: 0.6218 },
  { Tc: 12980, nWindows: 85, sdDiscrepancy: 0.6370 },
  { Tc: 16847, nWindows: 97, sdDiscrepancy: 0.5732 },
  { Tc: 21867, nWindows: 111, sdDiscrepancy: 0.6799 },
  { Tc: 28383, nWindows: 126, sdDiscrepancy: 0.5644 },
  { Tc: 36840, nWindows: 144, sdDiscrepancy: 0.5248 },
  { Tc: 47818, nWindows: 164, sdDiscrepancy: 0.6096 },
  { Tc: 62066, nWindows: 187, sdDiscrepancy: 0.6077 },
  { Tc: 80560, nWindows: 213, sdDiscrepancy: 0.5726 },
  { Tc: 104564, nWindows: 243, sdDiscrepancy: 0.6180 },
  { Tc: 135721, nWindows: 277, sdDiscrepancy: 0.6335 },
  { Tc: 176162, nWindows: 315, sdDiscrepancy: 0.6082 },
  { Tc: 228653, nWindows: 359, sdDiscrepancy: 0.6067 },
  { Tc: 296784, nWindows: 409, sdDiscrepancy: 0.6087 },
  { Tc: 385217, nWindows: 466, sdDiscrepancy: 0.6318 },
  { Tc: 500000, nWindows: 443, sdDiscrepancy: 0.6078 },
];

const ROWS = MEASURED.map((m) => {
  const L = envelopeCount(m.Tc);
  const sdGUE = Math.sqrt(gueNumberVariance(L));
  return {
    Tc: m.Tc,
    meanLocalCountL: L,
    nWindows: m.nWindows,
    sdDiscrepancy: m.sdDiscrepancy, // measured pointwise sd of C - E
    sdGUE, // GUE number-variance prediction for the same L
    varRatioMeasuredOverGUE: (m.sdDiscrepancy * m.sdDiscrepancy) / gueNumberVariance(L),
  };
});

// Least-squares fit of var-ratio against log10 T: slope > 0 would signal drift toward 1.
const xs = ROWS.map((r) => Math.log10(r.Tc));
const ys = ROWS.map((r) => r.varRatioMeasuredOverGUE);
const n = xs.length;
const mx = xs.reduce((s, v) => s + v, 0) / n;
const my = ys.reduce((s, v) => s + v, 0) / n;
let sxy = 0, sxx = 0, syy = 0;
for (let i = 0; i < n; i++) {
  sxy += (xs[i] - mx) * (ys[i] - my);
  sxx += (xs[i] - mx) * (xs[i] - mx);
  syy += (ys[i] - my) * (ys[i] - my);
}
const slopePerDecade = sxy / sxx; // d(varRatio)/d(log10 T)
const intercept = my - slopePerDecade * mx;
const rSquared = (sxy * sxy) / (sxx * syy);
const avgVarRatio = my;

// sd of D is essentially height-independent: report its spread across the grid.
const sds = ROWS.map((r) => r.sdDiscrepancy);
const meanSd = sds.reduce((s, v) => s + v, 0) / n;
const sdOfSd = Math.sqrt(sds.map((v) => (v - meanSd) * (v - meanSd)).reduce((s, v) => s + v, 0) / n);

export const IMP95579_VARRATIO_HEIGHT_TREND = {
  ticket: 'imp-95579',
  source:
    'imp-95562 finding 4 (var-ratio 0.40 finite-height suppression); recomputed on a denser 16-height grid over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js via tmp/imp-95579-varratio-trend.mjs',
  definitions: {
    envelope: 'E(T) = 2 Delta delta(T), delta(T) = (1/2pi) log(T/2pi) -- the mean-square-controlled local count',
    pointwise: 'C = #{gamma : |gamma - T| <= Delta}, Delta = sqrt(v), v = T/2pi',
    varRatio: 'var(C - E) / Sigma^2(L), Sigma^2(L) = (1/pi^2)(log(2pi L) + gamma_E + 1) -- measured pointwise variance over the Dyson-Mehta GUE asymptote',
    grid: '16 log-spaced heights across [1e4, 5e5]; identical hard-box tiling to imp-95562 (step 2 Delta, +/-30% span)',
  },
  rows: ROWS,
  trend: {
    avgVarRatio, // ~0.40: reproduces imp-95562 finding 4
    slopeVarRatioPerDecade: slopePerDecade, // ~ -0.060: NO drift toward 1
    intercept,
    rSquared, // ~0.30: weak fit -- ratio is essentially flat plus sampling noise
    driftsTowardOne: slopePerDecade > 0,
    meanSdDiscrepancy: meanSd, // ~0.61 zeros: measured pointwise sd is height-independent
    sdOfSdDiscrepancy: sdOfSd, // small: sd of D barely varies across the grid
    sdGUELo: ROWS[0].sdGUE, // ~0.90 at T = 1e4
    sdGUEHi: ROWS[n - 1].sdGUE, // ~1.02 at T = 5e5 (grows logarithmically)
  },
  verdict:
    'RECOMPUTED on a denser 16-height grid over actual zeta zeros: the ~40% finite-height suppression of the pointwise number variance below the GUE asymptote (avg var-ratio 0.40) reproduces imp-95562 finding 4 with no shift, and does NOT drift toward the Dyson-Mehta asymptote across [1e4, 5e5]. A least-squares fit of var-ratio against log10 T gives a slightly NEGATIVE slope (~ -0.060 per decade, R^2 ~ 0.30, weak): no measurable approach to ratio = 1. The mechanism is transparent -- the measured pointwise sd of C - E is essentially height-independent (~0.61 zeros, flat across the range) while the GUE sd grows logarithmically (0.90 -> 1.02), so the ratio inches AWAY from 1 with height and the GUE/mean-square envelope becomes a ~2.5x conservative over-estimate throughout. Changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // envelope + GUE formulas match closed forms at a spot value
  const rHi = ROWS[n - 1];
  if (!approx(rHi.meanLocalCountL, 2 * Math.sqrt(5.0e5 / TWO_PI) * Math.log(5.0e5 / TWO_PI) / TWO_PI, 1e-9))
    throw new Error('imp-95579: envelope L formula mismatch');
  // envelope monotone increasing across the denser grid
  for (let i = 1; i < ROWS.length; i++)
    if (!(ROWS[i].meanLocalCountL > ROWS[i - 1].meanLocalCountL)) throw new Error('imp-95579: envelope not monotone');
  // GUE sd grows with height (logarithmic) across the grid
  if (!(rHi.sdGUE > ROWS[0].sdGUE)) throw new Error('imp-95579: GUE sd did not grow with height');
  // measured suppression: every var-ratio sits in (0,1)
  for (const r of ROWS) if (!(r.varRatioMeasuredOverGUE > 0 && r.varRatioMeasuredOverGUE < 1)) throw new Error('imp-95579: var ratio outside (0,1)');
  // avg var-ratio reproduces imp-95562 finding 4 (~0.40)
  if (!approx(avgVarRatio, 0.40, 0.03)) throw new Error('imp-95579: avg var-ratio does not reproduce imp-95562');
  // key result: NO upward drift toward the Dyson-Mehta asymptote
  if (!(slopePerDecade <= 0)) throw new Error('imp-95579: unexpected positive drift toward ratio=1');
  // sd of D is height-independent to within a small spread
  if (!(sdOfSd < 0.05)) throw new Error('imp-95579: sd of discrepancy not height-independent');
})();

export default IMP95579_VARRATIO_HEIGHT_TREND;
