/**
 * imp-96090 -- TRUE out-of-sample test of the imp-96049 mean-anchor number-variance
 * envelope r_cap(T) at FIVE genuinely held-out heights, resolving the imp-96070 caveat.
 *
 * imp-96070 leave-one-out (LOO) cross-validated the mean/max offset anchors over the six
 * imp-95562 fit heights but flagged the HONEST CAVEAT that LOO is NOT a true out-of-sample
 * test: each LOO refit is still built from five of the same six offsets, so the held-out
 * residuals carry the same six-point sampling noise as the fit, and it noted the repo had
 * no measured sd(C - E) at heights outside {1e4, 3e4, 7e4, 1.5e5, 3e5, 5e5}. This ticket
 * removes that caveat by MEASURING sd(C - E) at brand-new heights the anchor never saw.
 *
 * METHOD. The imp-95562 band() estimator (tmp/imp-95562-msq-vs-pointwise.mjs) -- tile
 * non-overlapping windows of half-width Delta = sqrt(T/2pi) across +/-30% of a centre T,
 * count zeros per window C, subtract the mean-square envelope E = 2 Delta delta(T), and
 * take the T-fluctuation sd(C - E) -- was re-run VERBATIM over the same 10^6 Odlyzko
 * ordinates (src/data/zeros-to-1e6.js, max height 600269.677) at five held-out centres
 * {2e4, 5e4, 1e5, 2e5, 4e5}, each DISTINCT from the six fit heights and each with a fully
 * symmetric window inside the ordinate range (heights >= 6e5 were excluded because their
 * +30% window is truncated by the top of the 10^6-ordinate table). The measured sd(C - E)
 * at these five heights (offline run tmp/imp-96090-heldout-heights.mjs) is baked below to
 * 7 significant figures; the anchors C0_mean / C0_max are the imp-96049 in-sample fits
 * from the ORIGINAL six offsets ONLY, so the held-out heights are true out-of-sample.
 *
 * FINDINGS.
 *  1. The MAX anchor caps ALL five genuinely held-out heights (0 breaches), with the
 *     tightest margin +0.0141 (+3.0%) at T = 5e4 and comfortable margins (+0.079 .. +0.168)
 *     elsewhere. This is a TRUE out-of-sample vindication of the imp-95722/imp-96070
 *     max-anchor choice on real new measurements, stronger than the imp-96070 LOO proxy
 *     (which had the max anchor breach at its own argmax under refit).
 *  2. The MEAN anchor does NOT generalize as a cap: it breaches at 1 of 5 held-out heights,
 *     deepest -0.0651 (-13.7%) at T = 5e4, confirming out-of-sample the imp-96049/imp-96070
 *     verdict that a mean anchor under-covers any unmeasured height whose true offset
 *     exceeds the fitted mean. T = 5e4 sits between fit heights 3e4 and 7e4 yet carries a
 *     higher sd (0.6574) than either -- a genuine local bump the fit could not see.
 *  3. Net: on real held-out data the max anchor is the strictly safer envelope (caps 5/5
 *     vs the mean's 4/5), and the dead-zone r_cap < 1 headline continues to rest on it.
 *
 * HONEST CAVEAT. Five held-out heights over ~1.3 decades (2e4 .. 4e5) is a genuine but
 * still low-resolution out-of-sample test, and all five remain ~6.8 decades below the
 * imp-95519 window bottom T = 3.0e12: the +3.0% tightest max-anchor margin is measured
 * only inside the accessible window, not extrapolated to the window bottom (that remains
 * the imp-95710 named window-reach sub-gap). This measurement changes NO Lambda bound.
 *
 * VERDICT. Measured at five brand-new held-out heights {2e4, 5e4, 1e5, 2e5, 4e5} the
 * imp-96049 max offset anchor caps ALL of them (tightest +3.0% at T = 5e4) while the mean
 * anchor breaches at T = 5e4 (-13.7%), a true out-of-sample vindication of the max anchor
 * that resolves the imp-96070 in-sample caveat with real new data rather than a LOO proxy.
 * Measurement only; changes no bound; NO QED; no refereed bound is changed;
 * the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96070-number-variance-mean-anchor-loo-out-of-sample-residual (the LOO proxy this replaces with real held-out data)
 * @see imp-96049-number-variance-mean-anchor-six-height-residual-band (the in-sample mean-anchor band)
 * @see imp-95722-number-variance-ratio-window-bottom-bound (the max-anchor choice)
 *
 * Import-light: no zeros bundle, no sibling imports. The five held-out sd(C - E) values are
 * baked measured literals (offline over the verified ordinates); every derived quantity is
 * recomputed here from the closed forms.
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;
const SELBERG_C = 1 / (2 * Math.PI * Math.PI); // Selberg leading variance constant

const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(T/2pi)
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L = 2 Delta delta(T)
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);
const logLog = (T) => Math.log(Math.log(T / TWO_PI));

// The SAME six imp-95562 fit heights; the anchors below are fitted from THESE offsets only.
const FIT = [
  { Tc: 1.0e4, sdDiscrepancy: 0.6218 },
  { Tc: 3.0e4, sdDiscrepancy: 0.5823 },
  { Tc: 7.0e4, sdDiscrepancy: 0.5689 },
  { Tc: 1.5e5, sdDiscrepancy: 0.6714 },
  { Tc: 3.0e5, sdDiscrepancy: 0.6199 },
  { Tc: 5.0e5, sdDiscrepancy: 0.6078 },
];
const fitOffsets = FIT.map((m) => m.sdDiscrepancy * m.sdDiscrepancy - SELBERG_C * logLog(m.Tc));
const mean = (xs) => xs.reduce((s, v) => s + v, 0) / xs.length;
const C0_mean = mean(fitOffsets); // imp-96049 in-sample mean anchor
const C0_max = Math.max(...fitOffsets); // imp-95722/imp-95946 in-sample max anchor

// GENUINELY held-out heights, measured offline over the 10^6 Odlyzko ordinates via the
// identical imp-95562 band() estimator (tmp/imp-96090-heldout-heights.mjs). Each centre is
// distinct from the six fit heights and has a fully symmetric +/-30% window inside the table.
// sdDiscrepancy baked to 7 significant figures (toExponential(6)).
const HELDOUT = [
  { Tc: 2.0e4, sdDiscrepancy: 5.444814e-1, nWindows: 106 },
  { Tc: 5.0e4, sdDiscrepancy: 6.573555e-1, nWindows: 168 },
  { Tc: 1.0e5, sdDiscrepancy: 6.037456e-1, nWindows: 237 },
  { Tc: 2.0e5, sdDiscrepancy: 5.899559e-1, nWindows: 336 },
  { Tc: 4.0e5, sdDiscrepancy: 6.109680e-1, nWindows: 475 },
];

const cappedRatio = (T, C0) => (SELBERG_C * logLog(T) + C0) / gueNumberVariance(envelopeCount(T)); // r_cap(T)

const rows = HELDOUT.map((m) => {
  const gueVar = gueNumberVariance(envelopeCount(m.Tc));
  const rMeasured = (m.sdDiscrepancy * m.sdDiscrepancy) / gueVar; // r(T) = measured / GUE
  const rCapMean = cappedRatio(m.Tc, C0_mean);
  const rCapMax = cappedRatio(m.Tc, C0_max);
  const resMean = rCapMean - rMeasured; // >= 0 means the mean-anchor envelope caps this held-out T
  const resMax = rCapMax - rMeasured; // >= 0 means the max-anchor envelope caps this held-out T
  return {
    Tc: m.Tc,
    nWindows: m.nWindows,
    measuredRatio: rMeasured,
    envelopeRatioMean: rCapMean,
    envelopeRatioMax: rCapMax,
    residualMean: resMean,
    residualMax: resMax,
    residualMeanRelPct: (resMean / rMeasured) * 100,
    residualMaxRelPct: (resMax / rMeasured) * 100,
    meanCaps: resMean >= 0,
    maxCaps: resMax >= 0,
  };
});

function bandSummary(key) {
  const rs = rows.map((r) => r[key]);
  const deepestIdx = rows.reduce((mi, r, i, arr) => (r[key] < arr[mi][key] ? i : mi), 0);
  const relKey = key === 'residualMean' ? 'residualMeanRelPct' : 'residualMaxRelPct';
  return {
    minResidual: Math.min(...rs),
    maxResidual: Math.max(...rs),
    breaches: rs.filter((v) => v < -1e-12).length,
    uniformlyConservative: Math.min(...rs) >= -1e-12,
    deepest: { Tc: rows[deepestIdx].Tc, residual: rows[deepestIdx][key], relPct: rows[deepestIdx][relKey] },
  };
}

const meanAnchorHeldOut = bandSummary('residualMean');
const maxAnchorHeldOut = bandSummary('residualMax');

export const IMP96090_NUMBER_VARIANCE_MEAN_ANCHOR_HELDOUT_OUT_OF_SAMPLE = {
  ticket: 'imp-96090',
  source:
    'imp-96070 caveat: leave-one-out over the six imp-95562 heights is not a true out-of-sample test. This measures sd(C - E) at five brand-new held-out heights {2e4, 5e4, 1e5, 2e5, 4e5} via the identical imp-95562 band() estimator over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js, then tests the in-sample anchors against them.',
  method:
    'Re-run the imp-95562 band() number-variance estimator at five held-out centres distinct from the six fit heights, each with a symmetric +/-30% window inside the ordinate table. Fit the mean and max offset anchors from the ORIGINAL six offsets only, then measure the held-out residual r_cap(T) - r(T) at each new height. Offline run tmp/imp-96090-heldout-heights.mjs; sd(C - E) baked to 7 significant figures.',
  definitions: {
    offset: 'offset(T) = measuredVar - (1/2pi^2) log log(T/2pi): the per-height Selberg-subtracted residual whose anchor gives C0',
    heldOutHeight: 'a centre T NOT in {1e4, 3e4, 7e4, 1.5e5, 3e5, 5e5}: its sd(C - E) never entered the anchor fit, so the residual is genuinely out-of-sample',
    residual: 'residual(T) = r_cap(T) - r(T): envelope minus measured; >= 0 means the (in-sample-fitted) envelope caps the held-out T',
    breaches: 'count of the five held-out heights where the measured ratio pokes above the envelope (residual < 0)',
  },
  inSampleAnchors: { C0_mean, C0_max },
  heldOutHeights: { count: HELDOUT.length, bottomT: HELDOUT[0].Tc, topT: HELDOUT[HELDOUT.length - 1].Tc, maxOrdinateHeight: 600269.677 },
  rows,
  meanAnchorHeldOut,
  maxAnchorHeldOut,
  comparison: {
    meanFailsCap: !meanAnchorHeldOut.uniformlyConservative,
    maxFailsCap: !maxAnchorHeldOut.uniformlyConservative,
    meanBreaches: meanAnchorHeldOut.breaches,
    maxBreaches: maxAnchorHeldOut.breaches,
    maxIsBetterOutOfSample:
      maxAnchorHeldOut.breaches < meanAnchorHeldOut.breaches && maxAnchorHeldOut.minResidual > meanAnchorHeldOut.minResidual,
    tightestMaxMargin: maxAnchorHeldOut.deepest, // the binding held-out margin for the max anchor
  },
  caveat:
    'Five held-out heights over ~1.3 decades (2e4 .. 4e5) is a genuine but low-resolution out-of-sample test, and all five stay ~6.8 decades below the imp-95519 window bottom T = 3.0e12: the +3.0% tightest max-anchor margin is measured inside the accessible window, not extrapolated to the bottom (the imp-95710 window-reach sub-gap). Heights >= 6e5 were excluded because their +30% window is truncated by the top of the 10^6-ordinate table. Changes NO Lambda bound.',
  verdict:
    'Measured at five brand-new held-out heights {2e4, 5e4, 1e5, 2e5, 4e5} the imp-96049 max offset anchor caps ALL of them (tightest +3.0% at T = 5e4) while the mean anchor breaches at T = 5e4 (-13.7%), a true out-of-sample vindication of the max anchor that resolves the imp-96070 in-sample caveat with real new data rather than a LOO proxy. Measurement only; changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // in-sample anchors reproduce imp-96049/imp-95722
  if (!approx(C0_mean, 0.26184177603555076, 1e-9)) throw new Error('imp-96090: C0_mean drifted from imp-96049');
  if (!approx(C0_max, 0.3337213835371905, 1e-9)) throw new Error('imp-96090: C0_max drifted from imp-95722');
  // five genuinely held-out heights, none in the fit set
  const fitSet = new Set(FIT.map((m) => m.Tc));
  if (HELDOUT.some((m) => fitSet.has(m.Tc))) throw new Error('imp-96090: a held-out height leaked into the fit set');
  if (HELDOUT.length !== 5) throw new Error('imp-96090: expected five held-out heights');
  // MAX anchor caps ALL five held-out heights out-of-sample (0 breaches), tightest at T = 5e4
  if (maxAnchorHeldOut.breaches !== 0) throw new Error('imp-96090: max-anchor held-out breaches not 0');
  if (!maxAnchorHeldOut.uniformlyConservative) throw new Error('imp-96090: max anchor unexpectedly failed a held-out height');
  if (maxAnchorHeldOut.deepest.Tc !== 5.0e4) throw new Error('imp-96090: tightest max-anchor margin not at T = 5e4');
  if (!approx(maxAnchorHeldOut.minResidual, 0.014122368611298342, 1e-6)) throw new Error('imp-96090: max-anchor tightest held-out margin drifted');
  // MEAN anchor breaches at exactly one held-out height, deepest -13.7% at T = 5e4
  if (meanAnchorHeldOut.breaches !== 1) throw new Error('imp-96090: mean-anchor held-out breaches not 1');
  if (meanAnchorHeldOut.uniformlyConservative) throw new Error('imp-96090: mean anchor unexpectedly stayed a uniform cap out-of-sample');
  if (meanAnchorHeldOut.deepest.Tc !== 5.0e4) throw new Error('imp-96090: deepest mean-anchor held-out dip not at T = 5e4');
  if (!approx(meanAnchorHeldOut.minResidual, -0.06508505704408235, 1e-6)) throw new Error('imp-96090: mean-anchor deepest held-out dip drifted');
  if (!(meanAnchorHeldOut.deepest.relPct < -13 && meanAnchorHeldOut.deepest.relPct > -14))
    throw new Error('imp-96090: mean-anchor deepest held-out relPct not ~ -13.7%');
  // out-of-sample ranking: max anchor strictly safer
  if (!IMP96090_NUMBER_VARIANCE_MEAN_ANCHOR_HELDOUT_OUT_OF_SAMPLE.comparison.maxIsBetterOutOfSample)
    throw new Error('imp-96090: max anchor not the strictly better out-of-sample cap');
  // honesty gates
  if (!/NO QED/.test(IMP96090_NUMBER_VARIANCE_MEAN_ANCHOR_HELDOUT_OUT_OF_SAMPLE.verdict))
    throw new Error('imp-96090: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96090_NUMBER_VARIANCE_MEAN_ANCHOR_HELDOUT_OUT_OF_SAMPLE.verdict))
    throw new Error('imp-96090: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96090_NUMBER_VARIANCE_MEAN_ANCHOR_HELDOUT_OUT_OF_SAMPLE;
