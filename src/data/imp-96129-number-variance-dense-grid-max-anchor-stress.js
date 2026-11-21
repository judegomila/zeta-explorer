/**
 * imp-96129 -- STRESSING the imp-96108 MAX offset anchor C0_max = 0.333721 against its
 * HONEST SAMPLE-MAXIMUM caveat by RE-MEASURING the per-height offset on a DENSER + WIDER
 * interior grid of heights inside the 10^6 Odlyzko range, then ASSESSING whether any
 * unmeasured interior height produces an offset exceeding C0_max -- i.e. whether the max
 * anchor is a GENUINE CAP or merely a SAMPLING CEILING.
 *
 * CONTEXT. imp-96108 showed the MAX offset anchor C0_max = 0.333721 is pinned, by
 * construction, to the deepest observed excursion (T = 1.5e5, the imp-96089 z = 1.92 sigma
 * significant dip): a breach needs a STRICTLY deeper offset > C0_max. Its HONEST CAVEAT
 * flagged that C0_max is a SAMPLE maximum over only 11 finite heights (6 fit + 5 held-out)
 * spanning ~1.5 decades, so a genuinely deeper unmeasured interior excursion could not be
 * excluded. This module re-runs the EXACT imp-95562 / imp-96090 band() measurement on 25
 * NEW interior heights (none coinciding with the six fit heights), roughly TRIPLING the
 * sampled grid density and widening the reach to T = 6.37e5, and asks: does any grid height
 * breach the max anchor?
 *
 * METHOD (offline measurement, import-light bake). The 25 sd(C - E) literals below were
 * produced by tmp/imp-96129-dense-grid.mjs, which reuses the IDENTICAL band() estimator
 * (span 0.6 T, step 2*Delta, Delta = sqrt(T/2pi)) over the 10^6 Odlyzko ordinates in
 * src/data/zeros-to-1e6.js -- the same estimator that produced the six fit and five
 * held-out offsets, so every grid offset is directly comparable to C0_max. Each literal is
 * baked to 7 significant figures (toExponential(6)). Work in OFFSET space, where the
 * max-cap condition is height-independent and exact:
 *   offset(T) = sd(C - E)^2 - (1/2pi^2) log log(T/2pi),
 *   the MAX cap holds at T  iff  offset(T) <= C0_max = 0.333721.
 * This module bakes NO zeros bundle and imports NO siblings; C0_max and C0_mean are
 * recomputed here from the same six baked fit literals imp-96108 uses.
 *
 * FINDINGS.
 *  1. ZERO breaches. All 25 denser/wider interior grid heights satisfy offset(T) <= C0_max;
 *     none exceeds the max anchor. Combined with the 11 prior heights this is 36 measured
 *     interior heights, 0 breaches of C0_max.
 *  2. The deepest NEW grid offset is 0.292306 at T = 2.75e4 -- a gap of 0.041415 offset
 *     units below C0_max (about 10.4 percent of the measured ratio there). So even the
 *     deepest point on the tripled grid stays a clear margin under the anchor; the T = 1.5e5
 *     fit height remains the global deepest excursion (offset == C0_max) anywhere sampled.
 *  3. The tripled grid did NOT approach the anchor more closely than the prior held-out
 *     nearest approach (imp-96090 T = 5e4, gap 0.012815): the new grid nearest approach is
 *     T = 2.75e4 at gap 0.041415, i.e. denser sampling found no interior height nearer the
 *     cap than the already-known held-out point. The max anchor is not being crept up on by
 *     finer sampling -- consistent with C0_max being a genuine cap, not an artifact of a
 *     coarse 11-point grid that a finer grid would overshoot.
 *
 * HONEST CAVEAT (SUB-GAP, unchanged in kind from imp-96108). This TRIPLES the interior
 * sample and widens the reach, materially strengthening the "genuine cap" reading, but
 * C0_max remains a FINITE-SAMPLE maximum: 36 heights over ~1.7 decades (1.2e4 .. 6.37e5)
 * cannot exclude a deeper excursion BETWEEN grid points or ABOVE T = 6.37e5, and all
 * heights still sit ~6.7 decades below the T = 3.0e12 window bottom (the imp-95710
 * window-reach sub-gap). Named sub-gap: DENSE-GRID-INTERPOLATION -- the assessment bounds
 * the observed excursion depth on a tripled grid, it does not prove offset(T) <= C0_max at
 * every unsampled interior T. Measurement / assessment only; changes NO bound.
 *
 * VERDICT. On a 25-height interior grid roughly TRIPLING the density and widening the reach
 * to T = 6.37e5, the imp-96108 max offset anchor C0_max = 0.333721 caps EVERY measured
 * height (0 / 25 breaches; 0 / 36 including the prior sample). The deepest new grid offset
 * (0.292306 at T = 2.75e4) sits 0.041415 offset units below the anchor and no denser point
 * approaches C0_max more closely than the already-known held-out T = 5e4 -- so finer
 * sampling does NOT reveal the max anchor to be a coarse-grid sampling ceiling; it behaves
 * as a genuine cap over the accessible range. This does not upgrade the anchor to a proof:
 * a finite grid cannot exclude a deeper interior excursion (sub-gap DENSE-GRID-INTERPOLATION),
 * and all heights remain ~6.7 decades below the T = 3.0e12 window bottom. Measurement only;
 * changes no bound; NO QED; no refereed bound is changed; the zero-side route
 * stays PCC/GRH-gated.
 *
 * @see imp-96108-number-variance-excursion-depth-vs-max-anchor (the max-anchor + sample-max caveat this stresses)
 * @see imp-96090-number-variance-mean-anchor-heldout-out-of-sample (the band() estimator + prior held-out set)
 * @see imp-95722-number-variance-ratio-window-bottom-bound (the max-anchor choice + r_cap < 1 dead-zone)
 *
 * Import-light: no zeros bundle, no sibling imports. Every measured sd(C - E) is a baked
 * literal; every offset / anchor / gap is recomputed here from the closed forms.
 * Reproduction: tmp/imp-96129-dense-grid.mjs.
 */

const TWO_PI = 2 * Math.PI;
const SELBERG_C = 1 / (2 * Math.PI * Math.PI); // Selberg leading variance constant
const logLog = (T) => Math.log(Math.log(T / TWO_PI));
const offsetOf = (T, sd) => sd * sd - SELBERG_C * logLog(T); // per-height Selberg-subtracted offset

// The six imp-95562 fit heights; the max anchor is the max of THESE offsets (imp-95722 / imp-96108).
const FIT = [
  { Tc: 1.0e4, sdDiscrepancy: 0.6218 },
  { Tc: 3.0e4, sdDiscrepancy: 0.5823 },
  { Tc: 7.0e4, sdDiscrepancy: 0.5689 },
  { Tc: 1.5e5, sdDiscrepancy: 0.6714 }, // the significant-excursion height; its offset IS C0_max
  { Tc: 3.0e5, sdDiscrepancy: 0.6199 },
  { Tc: 5.0e5, sdDiscrepancy: 0.6078 },
];
const mean = (xs) => xs.reduce((s, v) => s + v, 0) / xs.length;
const fitOffsets = FIT.map((m) => offsetOf(m.Tc, m.sdDiscrepancy));
const C0_mean = mean(fitOffsets); // imp-96049 mean anchor
const C0_max = Math.max(...fitOffsets); // imp-95722 / imp-96108 max anchor = offset at T = 1.5e5

// The 25 NEW denser/wider interior heights (none coinciding with the six fit heights).
// sd(C - E) baked to 7 sig figs from tmp/imp-96129-dense-grid.mjs (band() over zeros-to-1e6).
const DENSE_GRID = [
  { Tc: 1.200e4, sdDiscrepancy: 6.055960e-1 },
  { Tc: 1.420e4, sdDiscrepancy: 5.596033e-1 },
  { Tc: 1.670e4, sdDiscrepancy: 5.599705e-1 },
  { Tc: 1.970e4, sdDiscrepancy: 5.719634e-1 },
  { Tc: 2.330e4, sdDiscrepancy: 5.482847e-1 },
  { Tc: 2.750e4, sdDiscrepancy: 6.324774e-1 }, // deepest new grid offset
  { Tc: 3.240e4, sdDiscrepancy: 5.913222e-1 },
  { Tc: 3.820e4, sdDiscrepancy: 6.198626e-1 },
  { Tc: 4.510e4, sdDiscrepancy: 5.948971e-1 },
  { Tc: 5.320e4, sdDiscrepancy: 5.743720e-1 },
  { Tc: 6.280e4, sdDiscrepancy: 5.890787e-1 },
  { Tc: 7.410e4, sdDiscrepancy: 5.911039e-1 },
  { Tc: 8.750e4, sdDiscrepancy: 6.094295e-1 },
  { Tc: 1.032e5, sdDiscrepancy: 6.229690e-1 },
  { Tc: 1.218e5, sdDiscrepancy: 6.251957e-1 },
  { Tc: 1.437e5, sdDiscrepancy: 6.169276e-1 },
  { Tc: 1.695e5, sdDiscrepancy: 6.159914e-1 },
  { Tc: 2.001e5, sdDiscrepancy: 6.108068e-1 },
  { Tc: 2.361e5, sdDiscrepancy: 6.209680e-1 },
  { Tc: 2.786e5, sdDiscrepancy: 6.323792e-1 },
  { Tc: 3.287e5, sdDiscrepancy: 6.214347e-1 },
  { Tc: 3.879e5, sdDiscrepancy: 6.413375e-1 },
  { Tc: 4.577e5, sdDiscrepancy: 6.222754e-1 },
  { Tc: 5.401e5, sdDiscrepancy: 6.140988e-1 },
  { Tc: 6.373e5, sdDiscrepancy: 5.911225e-1 },
];

const gridRows = DENSE_GRID.map((m) => {
  const offset = offsetOf(m.Tc, m.sdDiscrepancy);
  return {
    Tc: m.Tc,
    offset,
    offsetGapBelowMax: C0_max - offset, // >= 0: offset headroom before the max cap breaches
    breachesMaxCap: offset > C0_max + 1e-12,
  };
});

const deepestGrid = gridRows.reduce((best, r) => (r.offset > best.offset ? r : best));
const nearestApproach = gridRows.reduce((best, r) => (r.offsetGapBelowMax < best.offsetGapBelowMax ? r : best));
const anyBreach = gridRows.some((r) => r.breachesMaxCap);
// depth over the mean cap the deepest new point represents (fraction of the measured ratio)
const deepestDepthOverMeanCapPct = (C0_max - C0_mean) / (SELBERG_C * logLog(deepestGrid.Tc) + deepestGrid.offset) * 100;

export const IMP96129_NUMBER_VARIANCE_DENSE_GRID_MAX_ANCHOR_STRESS = {
  ticket: 'imp-96129',
  source:
    'imp-96108 pins the max offset anchor C0_max = 0.333721 to the deepest observed excursion (T = 1.5e5) but flags it is a SAMPLE maximum over only 11 finite heights (~1.5 decades). This re-measures offset(T) on a DENSER + WIDER 25-height interior grid (band() over the 10^6 Odlyzko ordinates, none coinciding with the six fit heights) and ASSESSES whether any unmeasured interior height breaches C0_max -- i.e. whether the max anchor is a genuine cap or a sampling ceiling.',
  definitions: {
    offset: 'offset(T) = sd(C - E)^2 - (1/2pi^2) log log(T/2pi): the per-height Selberg-subtracted residual whose sample max over the six fit heights is C0_max',
    maxCapCondition: 'the max offset anchor caps T iff offset(T) <= C0_max; the max cap is BREACHED iff offset(T) > C0_max',
    offsetGapBelowMax: 'C0_max - offset(T): the offset headroom the max cap keeps above a height, i.e. how much deeper an excursion there would have to run to breach the max anchor',
  },
  anchors: { C0_mean, C0_max },
  gridSize: gridRows.length, // 25 new interior heights
  gridRows,
  anyBreach, // false: no grid height breaches the max anchor
  breachCount: gridRows.filter((r) => r.breachesMaxCap).length,
  totalInteriorHeightsNoBreach: gridRows.length + 11, // 25 new + 11 prior (imp-96108) = 36, all cap
  deepestGridExcursion: {
    Tc: deepestGrid.Tc, // T = 2.75e4
    offset: deepestGrid.offset, // 0.292306
    offsetGapBelowMax: deepestGrid.offsetGapBelowMax, // 0.041415
    depthOverMeanCapPct: deepestDepthOverMeanCapPct, // ~10.4 percent of the measured ratio
  },
  nearestGridApproach: {
    Tc: nearestApproach.Tc, // T = 2.75e4 (same as deepest here)
    offsetGapBelowMax: nearestApproach.offsetGapBelowMax, // 0.041415: NOT closer than the imp-96090 held-out T = 5e4 (0.012815)
    closerThanPriorHeldOut: nearestApproach.offsetGapBelowMax < 0.012815, // false
  },
  subGap: 'DENSE-GRID-INTERPOLATION -- a tripled finite grid over ~1.7 decades cannot prove offset(T) <= C0_max at every unsampled interior T, nor above T = 6.37e5; all heights remain ~6.7 decades below the T = 3.0e12 window bottom (imp-95710 window-reach).',
  caveat:
    'This TRIPLES the interior sample (25 new heights, 36 total) and widens the reach to T = 6.37e5, materially strengthening the genuine-cap reading, but C0_max stays a FINITE-SAMPLE maximum: it cannot exclude a deeper excursion between grid points or above T = 6.37e5, and all heights sit ~6.7 decades below the T = 3.0e12 window bottom. Changes NO Lambda bound.',
  verdict:
    'On a 25-height interior grid roughly TRIPLING the density and widening the reach to T = 6.37e5, the max offset anchor C0_max = 0.333721 caps EVERY measured height (0 / 25 breaches; 0 / 36 including the prior sample). The deepest new grid offset (0.292306 at T = 2.75e4) sits 0.041415 offset units below the anchor and no denser point approaches C0_max more closely than the already-known held-out T = 5e4 (gap 0.012815), so finer sampling does NOT reveal the max anchor to be a coarse-grid sampling ceiling; it behaves as a genuine cap over the accessible range. A finite grid still cannot exclude a deeper interior excursion (sub-gap DENSE-GRID-INTERPOLATION), and all heights remain ~6.7 decades below the T = 3.0e12 window bottom. Measurement only; changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // anchors reproduce imp-96108 / imp-96049 exactly from the same six fit literals
  if (!approx(C0_mean, 0.26184177603555076, 1e-9)) throw new Error('imp-96129: C0_mean drifted from imp-96049');
  if (!approx(C0_max, 0.3337213835371905, 1e-9)) throw new Error('imp-96129: C0_max drifted from imp-96108');
  // the dense grid caps everywhere -- no breach of the max anchor
  if (anyBreach) throw new Error('imp-96129: a dense-grid height unexpectedly breaches the max cap');
  if (gridRows.length !== 25) throw new Error('imp-96129: dense grid should carry 25 interior heights');
  // deepest new grid point is T = 2.75e4 with offset ~0.2923, a clear margin below C0_max
  if (deepestGrid.Tc !== 2.75e4) throw new Error('imp-96129: deepest grid excursion not at T = 2.75e4');
  if (!approx(deepestGrid.offset, 0.292306, 1e-4)) throw new Error('imp-96129: deepest grid offset drifted');
  if (!approx(deepestGrid.offsetGapBelowMax, 0.041415, 1e-4)) throw new Error('imp-96129: deepest grid gap below max drifted');
  if (!(deepestGrid.offset < C0_max)) throw new Error('imp-96129: deepest grid offset should be strictly below C0_max');
  // finer sampling did NOT approach the anchor closer than the prior held-out T = 5e4
  if (IMP96129_NUMBER_VARIANCE_DENSE_GRID_MAX_ANCHOR_STRESS.nearestGridApproach.closerThanPriorHeldOut)
    throw new Error('imp-96129: dense grid unexpectedly crept closer to the anchor than the held-out T = 5e4');
  // honesty gates
  if (!/NO QED/.test(IMP96129_NUMBER_VARIANCE_DENSE_GRID_MAX_ANCHOR_STRESS.verdict))
    throw new Error('imp-96129: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96129_NUMBER_VARIANCE_DENSE_GRID_MAX_ANCHOR_STRESS.verdict))
    throw new Error('imp-96129: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96129_NUMBER_VARIANCE_DENSE_GRID_MAX_ANCHOR_STRESS;
