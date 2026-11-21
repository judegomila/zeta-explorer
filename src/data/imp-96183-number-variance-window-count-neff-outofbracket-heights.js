/**
 * imp-96183 -- Per-height WINDOW COUNT n_w and effective independent count n_eff = n_w * f at the two
 * FRESH heights imp-96170 left incomplete: T = 8e4 (interior gap) and T = 6e5 (out of the imp-96150
 * bracket). imp-96170 recomputed the exact GUE two-interval AR-1 factor f and the safe-side flip-gap at
 * these heights but could NOT assemble n_eff = n_w * f, because the per-height window count n_w is a
 * tiling measurement imp-96090 never ran at 8e4 or 6e5. This module supplies n_w at both heights, builds
 * n_eff, and tests whether the imp-96090 max-anchor out-of-sample capping margin persists there.
 *
 * WHAT n_w IS, AND WHY IT IS EXACT. In the imp-95562 band() estimator the +/-30% span around a centre T
 * is tiled by non-overlapping hard windows of full width 2*Delta, Delta = sqrt(T/2pi). The window count is
 * therefore a pure GEOMETRIC count of how many width-2Delta boxes fit in the width-0.6*T span:
 *     n_w(T) = floor(0.6*T / (2*Delta)) = floor(0.3 * sqrt(2pi*T)).
 * This closed form reproduces ALL FIVE imp-96090 MEASURED window counts EXACTLY -- 106 (2e4), 168 (5e4),
 * 237 (1e5), 336 (2e5), 475 (4e5) -- so n_w needs no fresh zeros run to be trusted; the geometry alone
 * fixes it. At the two fresh heights it gives n_w = 212 (8e4) and n_w = 582 (6e5).
 *
 * ONE-SIDED TRUNCATION AT 6e5 (the honest wall). The zeros bundle src/data/zeros-to-1e6.js tops out at
 * gamma_max = 600269.677. At T = 8e4 the symmetric +/-30% span [56000, 104000] sits fully inside the
 * table, so ALL 212 geometric windows are populated by real ordinates and the capping test is a genuine
 * out-of-sample measurement. At T = 6e5 the span [420000, 780000] is TRUNCATED: its upper half exceeds
 * gamma_max, so only the lower ~291 of the 582 geometric windows can be populated. This is exactly why
 * imp-96090 EXCLUDED heights >= 6e5 from its held-out set. n_w = 582 is the geometric window count; the
 * measured sd(C - E) at 6e5 comes from a one-sided (lower-half) window and is reported with that flag.
 *
 * FINDINGS.
 *  1. n_w = 212 at 8e4 and n_w = 582 at 6e5 (geometric), the first EXACTLY equal to the count returned by
 *     the offline band() re-run (populatedNw = 212, span inside the table); at 6e5 the band() re-run
 *     populates only 291 windows because the +/-30% span is truncated at gamma_max = 600269.677.
 *  2. n_eff = n_w * f completes the imp-96170 pair: n_eff = 576.84 at 8e4 (212 * 2.720946) and
 *     n_eff = 1601.10 at 6e5 (582 * 2.751033, geometric). The ~2.7x AR-1 inflation carries directly into
 *     the effective independent count, which is what the sd(C - E) sampling spread scales by.
 *  3. THE MAX-ANCHOR CAPPING MARGIN PERSISTS OUT OF BRACKET. At 8e4 the measured sd(C - E) = 0.597381
 *     over the fully-populated symmetric window gives r_measured = 0.38108 against the imp-96090 max-anchor
 *     envelope r_cap_max = 0.47788, a residual of +0.09680 (+25.4%) -- comfortably capped, in the same
 *     band as the imp-96090 in-sample comfortable margins (+0.079 .. +0.168), NOT near the imp-96090
 *     tightest +3.0% at 5e4. At 6e5 the truncated lower-half window gives sd(C - E) = 0.602167,
 *     r_measured = 0.34269 vs r_cap_max = 0.43219, residual +0.08950 (+26.1%) -- also capped, but over the
 *     one-sided span, not the intended symmetric +/-30% tiling.
 *
 * HONEST CAVEAT / SUB-GAP. n_w is exact geometry and n_eff = n_w * f is exact once f is taken from the
 * imp-96170 exact GUE census. The 8e4 capping test is a genuine symmetric-span out-of-sample measurement.
 * The 6e5 capping test is NOT: its +/-30% span is truncated at gamma_max = 600269.677, so the reported
 * residual rests on a one-sided (lower-half, 291-window) sample, and the full symmetric-span n_w = 582
 * capping test at 6e5 needs ordinates above 600269.677 -- beyond the 10^6 Odlyzko bundle. That symmetric
 * out-of-bracket capping test is the named residual (the imp-95710 window-reach sub-gap in miniature).
 * This measurement changes NO Lambda bound and does not raise the imp-96128 ~1.9-sigma confidence (set by
 * the excursion depth, not by n_eff).
 *
 * VERDICT. n_w = 212 (8e4) / 582 (6e5) from the exact tiling geometry (validated against all five
 * imp-96090 measured counts) completes n_eff = n_w * f = 576.84 (8e4) / 1601.10 (6e5), closing the
 * imp-96170 "n_w not measured" caveat. The imp-96090 max-anchor out-of-sample capping margin persists at
 * both fresh heights: +25.4% at 8e4 over a fully-populated symmetric window (genuine out-of-sample) and
 * +26.1% at 6e5 over a truncated lower-half window (span-truncation flagged). Measurement only; changes no
 * bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96170-number-variance-two-interval-covariance-outofbracket-heights (f and the flip-gap this completes)
 * @see imp-96090-number-variance-mean-anchor-heldout-out-of-sample (the five measured n_w and the max anchor)
 * @see imp-96150-number-variance-two-interval-covariance-heldout-heights (the in-band bracket this steps outside)
 *
 * Import-light: no zeros bundle, no sibling imports. n_w is the closed-form tiling count; the fresh
 * measured sd(C - E) and populated-window counts are baked offline literals (tmp/imp-96183-scratch.mjs
 * over the verified 10^6 Odlyzko ordinates); every derived quantity is recomputed here from closed forms.
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;
const SELBERG_C = 1 / (2 * Math.PI * Math.PI); // Selberg leading variance constant

const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(T/2pi)
const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L = 2 Delta delta(T)
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI); // Sigma^2(L)
const logLog = (T) => Math.log(Math.log(T / TWO_PI));

// n_w(T): geometric count of non-overlapping width-2Delta windows in the +/-30% span (width 0.6*T).
const windowCount = (T) => Math.floor((0.6 * T) / (2 * halfWidth(T)));

// imp-96090 in-sample max offset anchor (fitted from the six imp-95562 heights only).
const C0_max = 0.3337213835371905;
const rCapMax = (T) => (SELBERG_C * logLog(T) + C0_max) / gueNumberVariance(envelopeCount(T)); // r_cap_max(T)

const GAMMA_MAX = 600269.677; // top ordinate of the 10^6 Odlyzko bundle (src/data/zeros-to-1e6.js)

// The five imp-96090 MEASURED window counts -- the validation set for the geometric n_w formula.
const IMP96090_MEASURED_NW = [
  { Tc: 2.0e4, nWindows: 106 },
  { Tc: 5.0e4, nWindows: 168 },
  { Tc: 1.0e5, nWindows: 237 },
  { Tc: 2.0e5, nWindows: 336 },
  { Tc: 4.0e5, nWindows: 475 },
];

// Fresh heights + imp-96170 exact GUE AR-1 factor f + baked offline band() outputs (sd of C - E and the
// count of windows the +/-30% span can actually POPULATE from the bundle). sd baked to 7 sig figs.
const FRESH = [
  {
    Tc: 8.0e4,
    kind: 'interior-gap (between 5e4 and 1e5)',
    f: 2.720946, // imp-96170 exact GUE two-interval AR-1 factor
    sdDiscrepancy: 5.973812e-1, // offline band() over the fully-populated symmetric window
    populatedNw: 212, // all geometric windows populated: span [56000, 104000] inside gamma_max
    spanTruncated: false,
  },
  {
    Tc: 6.0e5,
    kind: 'out-of-bracket (above the sampled top 4e5)',
    f: 2.751033, // imp-96170 exact GUE two-interval AR-1 factor
    sdDiscrepancy: 6.021674e-1, // offline band() over the TRUNCATED lower-half window
    populatedNw: 291, // only the lower half fits: span [420000, 780000] exceeds gamma_max = 600269.677
    spanTruncated: true,
  },
];

const rows = FRESH.map((m) => {
  const nw = windowCount(m.Tc); // geometric window count
  const nEff = nw * m.f; // effective independent count
  const spanLo = m.Tc - 0.3 * m.Tc;
  const spanHi = m.Tc + 0.3 * m.Tc;
  const gueVar = gueNumberVariance(envelopeCount(m.Tc));
  const rMeasured = (m.sdDiscrepancy * m.sdDiscrepancy) / gueVar; // r(T) = measured / GUE
  const rCap = rCapMax(m.Tc);
  const residualMax = rCap - rMeasured; // >= 0 means the imp-96090 max-anchor envelope caps this height
  return {
    Tc: m.Tc,
    kind: m.kind,
    windowCount: nw,
    f: m.f,
    nEff,
    spanLo,
    spanHi,
    spanTruncated: m.spanTruncated,
    populatedNw: m.populatedNw,
    fullyPopulated: nw === m.populatedNw,
    sdDiscrepancy: m.sdDiscrepancy,
    measuredRatio: rMeasured,
    envelopeRatioMax: rCap,
    residualMax,
    residualMaxRelPct: (residualMax / rMeasured) * 100,
    maxCaps: residualMax >= 0,
    // the 8e4 capping test is a genuine symmetric-span out-of-sample measurement; 6e5 is not
    genuineOutOfSample: !m.spanTruncated,
  };
});

const at = (Tc) => rows.find((r) => r.Tc === Tc);

const persistence = {
  // geometric n_w reproduces all five imp-96090 measured counts exactly
  geometryValidatesAllFive: IMP96090_MEASURED_NW.every((m) => windowCount(m.Tc) === m.nWindows),
  // 8e4 is the genuine test: fully populated symmetric window, max anchor caps comfortably
  interiorFullyPopulated: at(8.0e4).fullyPopulated,
  interiorMaxCaps: at(8.0e4).maxCaps,
  interiorComfortable: at(8.0e4).residualMaxRelPct > 5, // not near the imp-96090 tightest +3.0% at 5e4
  // 6e5 span truncated: geometric n_w exceeds the populatable count
  outOfBracketTruncated: at(6.0e5).spanTruncated && at(6.0e5).windowCount > at(6.0e5).populatedNw,
  // both truncated and non-truncated caps hold on the max anchor
  bothCapOnMaxAnchor: rows.every((r) => r.maxCaps),
};

export const IMP96183_NUMBER_VARIANCE_WINDOW_COUNT_NEFF_OUTOFBRACKET_HEIGHTS = {
  ticket: 'imp-96183',
  source:
    'imp-96170 recomputed the exact GUE two-interval AR-1 factor f (2.720946 at 8e4, 2.751033 at 6e5) and the safe-side flip-gap at two fresh heights outside the imp-96150 bracket, but could NOT assemble n_eff = n_w * f because the per-height window count n_w is a tiling measurement imp-96090 never ran at 8e4 or 6e5. This module supplies n_w (the exact geometric window count, validated against all five imp-96090 measured counts), builds n_eff = n_w * f, and tests whether the imp-96090 max-anchor out-of-sample capping margin persists at these heights.',
  definitions: {
    windowCount: 'n_w(T) = floor(0.6*T / (2*Delta)) = floor(0.3 * sqrt(2pi*T)): geometric count of non-overlapping width-2Delta windows in the +/-30% span (Delta = sqrt(T/2pi)); a pure tiling count, no zeros needed',
    f: 'imp-96170 exact GUE two-interval AR-1 effective-independent factor (1 - rho_exact)/(1 + rho_exact)',
    nEff: 'n_eff = n_w * f: the effective number of independent windows the sd(C - E) sampling spread scales by',
    populatedNw: 'the number of the geometric windows the +/-30% span can actually populate from the 10^6 Odlyzko bundle (gamma_max = 600269.677); < n_w when the span is truncated at the top of the table',
    residualMax: 'r_cap_max(T) - r(T) with the imp-96090 max offset anchor C0_max; >= 0 means the max-anchor envelope caps this height',
  },
  geometryValidation: {
    heights: IMP96090_MEASURED_NW.map((m) => m.Tc),
    measured: IMP96090_MEASURED_NW.map((m) => m.nWindows),
    geometric: IMP96090_MEASURED_NW.map((m) => windowCount(m.Tc)),
    allMatch: persistence.geometryValidatesAllFive,
  },
  maxAnchor: { C0_max },
  bundle: { gammaMax: GAMMA_MAX, source: 'src/data/zeros-to-1e6.js' },
  rows: rows.map((r) => ({
    Tc: r.Tc,
    kind: r.kind,
    windowCount: r.windowCount,
    f: r.f,
    nEff: r.nEff,
    spanLo: r.spanLo,
    spanHi: r.spanHi,
    spanTruncated: r.spanTruncated,
    populatedNw: r.populatedNw,
    fullyPopulated: r.fullyPopulated,
    sdDiscrepancy: r.sdDiscrepancy,
    measuredRatio: r.measuredRatio,
    envelopeRatioMax: r.envelopeRatioMax,
    residualMax: r.residualMax,
    residualMaxRelPct: r.residualMaxRelPct,
    maxCaps: r.maxCaps,
    genuineOutOfSample: r.genuineOutOfSample,
  })),
  persistence,
  caveat:
    'n_w is exact tiling geometry and n_eff = n_w * f is exact once f is the imp-96170 exact GUE census value. The 8e4 capping test is a genuine symmetric-span out-of-sample measurement (all 212 windows populated, span [56000, 104000] inside gamma_max). The 6e5 capping test is NOT: its +/-30% span [420000, 780000] is truncated at gamma_max = 600269.677, so the reported residual rests on a one-sided lower-half 291-window sample; the full symmetric-span n_w = 582 capping test at 6e5 needs ordinates above 600269.677, beyond the 10^6 Odlyzko bundle (the imp-95710 window-reach sub-gap in miniature). Changes no bound; does not raise the imp-96128 ~1.9-sigma confidence (set by the excursion depth, not by n_eff).',
  verdict:
    'n_w = 212 (8e4) / 582 (6e5) from the exact tiling geometry (validated against all five imp-96090 measured counts 106/168/237/336/475) completes n_eff = n_w * f = 576.84 (8e4) / 1601.10 (6e5), closing the imp-96170 "n_w not measured" caveat. The imp-96090 max-anchor out-of-sample capping margin persists at both fresh heights: +25.4% at 8e4 over a fully-populated symmetric window (genuine out-of-sample) and +26.1% at 6e5 over a truncated lower-half window (span-truncation flagged as the named residual). Measurement only; changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  if (rows.length !== 2) throw new Error('imp-96183: expected two fresh heights');
  // geometric n_w reproduces all five imp-96090 measured counts exactly
  if (!persistence.geometryValidatesAllFive)
    throw new Error('imp-96183: geometric n_w failed to reproduce an imp-96090 measured window count');
  // fresh window counts
  if (windowCount(8.0e4) !== 212) throw new Error('imp-96183: n_w(8e4) not 212');
  if (windowCount(6.0e5) !== 582) throw new Error('imp-96183: n_w(6e5) not 582');
  // n_eff = n_w * f
  if (!approx(at(8.0e4).nEff, 576.840552, 1e-4)) throw new Error('imp-96183: n_eff(8e4) drifted');
  if (!approx(at(6.0e5).nEff, 1601.101206, 1e-3)) throw new Error('imp-96183: n_eff(6e5) drifted');
  // 8e4 fully populated (genuine symmetric-span out-of-sample); 6e5 truncated
  if (!at(8.0e4).fullyPopulated) throw new Error('imp-96183: 8e4 should be fully populated');
  if (!at(8.0e4).genuineOutOfSample) throw new Error('imp-96183: 8e4 should be a genuine out-of-sample test');
  if (!at(6.0e5).spanTruncated) throw new Error('imp-96183: 6e5 span should be truncated at gamma_max');
  if (at(6.0e5).genuineOutOfSample) throw new Error('imp-96183: 6e5 must NOT be flagged genuine out-of-sample');
  if (!(at(6.0e5).windowCount > at(6.0e5).populatedNw))
    throw new Error('imp-96183: 6e5 geometric n_w should exceed the populatable count');
  // max anchor caps at both heights; 8e4 comfortably (not near the imp-96090 tightest +3.0%)
  if (!persistence.bothCapOnMaxAnchor) throw new Error('imp-96183: max anchor should cap both fresh heights');
  if (!approx(at(8.0e4).residualMax, 0.096802, 1e-5)) throw new Error('imp-96183: 8e4 max-anchor residual drifted');
  if (!(at(8.0e4).residualMaxRelPct > 25 && at(8.0e4).residualMaxRelPct < 26))
    throw new Error('imp-96183: 8e4 max-anchor margin not ~ +25.4%');
  if (!approx(at(6.0e5).residualMax, 0.089498, 1e-5)) throw new Error('imp-96183: 6e5 max-anchor residual drifted');
  // honesty gates
  if (!/NO QED/.test(IMP96183_NUMBER_VARIANCE_WINDOW_COUNT_NEFF_OUTOFBRACKET_HEIGHTS.verdict))
    throw new Error('imp-96183: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96183_NUMBER_VARIANCE_WINDOW_COUNT_NEFF_OUTOFBRACKET_HEIGHTS.verdict))
    throw new Error('imp-96183: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96183_NUMBER_VARIANCE_WINDOW_COUNT_NEFF_OUTOFBRACKET_HEIGHTS;
