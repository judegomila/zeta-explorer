/**
 * imp-96112 -- robustness of the imp-96090 tightest max-anchor out-of-sample margin
 * (+3.0% at T = 5e4) to the sd(C - E) window-estimator parameters.
 *
 * imp-96090 found the imp-96049 MAX offset anchor caps all five genuinely held-out
 * heights, with the TIGHTEST margin +0.0141 (+3.0%) at T = 5e4, measured with ONE
 * fixed instance of the imp-95562 band() estimator (non-overlapping boxes of half-width
 * Delta = sqrt(T/2pi) tiled across +/-30% of T). imp-96090 left open whether that +3.0%
 * is a stable property of the number variance at 5e4 or an artifact of that single
 * window choice. This ticket RE-MEASURES sd(C - E) at T = 5e4 across a grid of estimator
 * parameters and ASSESSES whether the max-anchor cap and the tight margin survive.
 *
 * METHOD. The band() estimator was re-run VERBATIM at T = 5e4 over the same 10^6 Odlyzko
 * ordinates (src/data/zeros-to-1e6.js), sweeping three axes independently about the
 * imp-96090 canonical point (k = 1, span = 0.30, non-overlapping):
 *   (a) half-width factor  k in {0.5, 0.75, 1, 1.5, 2, 3}   -- Delta = k*sqrt(T/2pi)
 *   (b) half-span          span in {0.15, 0.20, 0.40, 0.50} -- boxes over +/-span*T
 *   (c) box-overlap        overlap in {0.25, 0.50}          -- step = overlap*2*Delta
 * For each config the measured ratio is r(T) = sd(C - E)^2 / V_GUE(L_actual), where
 * L_actual is the config's own mean local count (each window width needs its own GUE
 * prediction), and it is compared against the FIXED canonical max-anchor envelope
 * r_cap^max(5e4) = 0.4902910 (imp-95722 anchor, closed form, independent of the window).
 * The offline sweep (tmp/imp-96112-window-robustness.mjs / tmp/imp-96112-bake.mjs) bakes
 * sd(C - E) and L_actual per config to 7 significant figures; everything downstream is
 * recomputed here from the closed forms, so this module is import-light (no zeros bundle).
 *
 * FINDINGS.
 *  1. The MAX anchor caps T = 5e4 in ALL 12 swept configs (0 breaches). Every measured
 *     margin r_cap^max - r(T) is strictly positive; the margin never changes sign, so the
 *     cap is NOT a windowing artifact -- no reasonable estimator choice lets 5e4 poke above
 *     the envelope.
 *  2. The margin varies widely with the estimator, +3.64% (finest boxes, k = 0.5) up to
 *     +51.4% (narrowest span = 0.20), i.e. the imp-96090 +3.0% headline is the TIGHT END of
 *     a broad, uniformly-positive family, not a representative central value. The +3.0%
 *     figure is specific to the imp-96090 fixed-step tiling (which, uniquely, steps by
 *     2*Delta(T_c) while sizing each box by Delta(t) > Delta(T_c) for t > T_c, giving a
 *     slight overlap that lifts sd from 0.6397 to 0.6574); the cleanest matched-parameter
 *     tiling (k = 1, span = 0.30, non-overlap) already relaxes the margin to +8.6%.
 *  3. The narrowest margins track resolution, not the anchor: the finest windows (k = 0.5:
 *     +3.6%; overlap = 0.50: +5.7%) sit near the imp-96090 +3.0%, while coarser windows
 *     (k >= 1.5) give +37% .. +46%. The tight margin is thus a real feature of high-
 *     resolution number-variance sampling at 5e4, consistent with the imp-96090 verdict
 *     that 5e4 carries a genuine local sd bump the six-height fit could not see.
 *
 * VERDICT. The imp-96090 max-anchor cap at T = 5e4 is ROBUST to the sd(C - E) window
 * estimator: across a 12-config sweep of half-width, span and overlap the max anchor caps
 * 5e4 every time, with a strictly positive margin ranging +3.6% .. +51.4%. The specific
 * +3.0% headline is the tight end of that family and is estimator-implementation specific
 * (the imp-96090 fixed-step slight-overlap tiling), but the SIGN of the margin -- the fact
 * that the max anchor is a genuine cap at 5e4 -- does NOT depend on the window choice.
 * Measurement only; changes no bound; RH open; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated. Heights stay ~6.8 decades below the
 * imp-95519 window bottom T = 3.0e12 (imp-95710 window-reach sub-gap unchanged).
 *
 * @see imp-96090-number-variance-mean-anchor-heldout-out-of-sample (the +3.0% headline this stress-tests)
 * @see imp-96049-number-variance-mean-anchor-six-height-residual-band (the in-sample band)
 * @see imp-95722-number-variance-ratio-window-bottom-bound (the max-anchor choice r_cap^max)
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;
const SELBERG_C = 1 / (2 * Math.PI * Math.PI);

const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(T/2pi)
const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // canonical L = 2 Delta delta(T)
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);
const logLog = (T) => Math.log(Math.log(T / TWO_PI));

// The six imp-95562 fit heights; the max anchor below is fitted from THESE offsets only.
const FIT = [
  { Tc: 1.0e4, sd: 0.6218 },
  { Tc: 3.0e4, sd: 0.5823 },
  { Tc: 7.0e4, sd: 0.5689 },
  { Tc: 1.5e5, sd: 0.6714 },
  { Tc: 3.0e5, sd: 0.6199 },
  { Tc: 5.0e5, sd: 0.6078 },
];
const fitOffsets = FIT.map((m) => m.sd * m.sd - SELBERG_C * logLog(m.Tc));
const C0_max = Math.max(...fitOffsets); // imp-95722 in-sample max offset anchor

const T_STAR = 5.0e4;
const cappedRatio = (T, C0) => (SELBERG_C * logLog(T) + C0) / gueNumberVariance(envelopeCount(T));
const rCapMax = cappedRatio(T_STAR, C0_max); // FIXED canonical max-anchor envelope at 5e4

// imp-96090 canonical measurement (fixed-step tiling): reproduces its +3.0% headline.
// sd baked to 7 significant figures; normalized by the canonical envelope count.
const CANONICAL_ORIGINAL = { sd: 6.573555e-1, nWindows: 168 };
const rOriginal = (CANONICAL_ORIGINAL.sd * CANONICAL_ORIGINAL.sd) / gueNumberVariance(envelopeCount(T_STAR));
const originalMargin = rCapMax - rOriginal; // imp-96090 minResidual 0.0141223686 (+3.0%)

// Swept configs measured offline via the identical band() estimator over the 10^6 Odlyzko
// ordinates. sd(C - E) and the actual mean local count L are baked to 7 significant figures;
// each config is normalized by V_GUE(L) for its own window width.
const SWEEP = [
  { tag: 'k=0.5', axis: 'half-width', k: 0.5, span: 0.3, overlap: 1.0, sd: 6.288454e-1, meanL: 1.258135e2, nWin: 340 },
  { tag: 'k=0.75', axis: 'half-width', k: 0.75, span: 0.3, overlap: 1.0, sd: 6.250977e-1, meanL: 1.886169e2, nWin: 226 },
  { tag: 'k=1', axis: 'half-width', k: 1.0, span: 0.3, overlap: 1.0, sd: 6.397218e-1, meanL: 2.516313e2, nWin: 170 },
  { tag: 'k=1.5', axis: 'half-width', k: 1.5, span: 0.3, overlap: 1.0, sd: 5.747658e-1, meanL: 3.772440e2, nWin: 113 },
  { tag: 'k=2', axis: 'half-width', k: 2.0, span: 0.3, overlap: 1.0, sd: 5.908671e-1, meanL: 5.032807e2, nWin: 85 },
  { tag: 'k=3', axis: 'half-width', k: 3.0, span: 0.3, overlap: 1.0, sd: 5.843608e-1, meanL: 7.532736e2, nWin: 56 },
  { tag: 'span=0.15', axis: 'span', k: 1.0, span: 0.15, overlap: 1.0, sd: 6.059236e-1, meanL: 2.541282e2, nWin: 84 },
  { tag: 'span=0.20', axis: 'span', k: 1.0, span: 0.2, overlap: 1.0, sd: 5.419220e-1, meanL: 2.533773e2, nWin: 112 },
  { tag: 'span=0.40', axis: 'span', k: 1.0, span: 0.4, overlap: 1.0, sd: 6.281853e-1, meanL: 2.488920e2, nWin: 229 },
  { tag: 'span=0.50', axis: 'span', k: 1.0, span: 0.5, overlap: 1.0, sd: 5.949767e-1, meanL: 2.451046e2, nWin: 290 },
  { tag: 'overlap=0.25', axis: 'overlap', k: 1.0, span: 0.3, overlap: 0.25, sd: 6.027170e-1, meanL: 2.516632e2, nWin: 677 },
  { tag: 'overlap=0.50', axis: 'overlap', k: 1.0, span: 0.3, overlap: 0.5, sd: 6.484393e-1, meanL: 2.516526e2, nWin: 339 },
];

const rows = SWEEP.map((c) => {
  const rMeasured = (c.sd * c.sd) / gueNumberVariance(c.meanL); // r(T) with this window's own GUE prediction
  const residualMax = rCapMax - rMeasured; // >= 0 means the max anchor caps 5e4 under this estimator
  return {
    tag: c.tag,
    axis: c.axis,
    k: c.k,
    span: c.span,
    overlap: c.overlap,
    nWin: c.nWin,
    measuredRatio: rMeasured,
    residualMax,
    marginRelPct: (residualMax / rMeasured) * 100,
    caps: residualMax >= 0,
  };
});

const margins = rows.map((r) => r.marginRelPct);
const minRow = rows.reduce((a, r) => (r.marginRelPct < a.marginRelPct ? r : a));
const maxRow = rows.reduce((a, r) => (r.marginRelPct > a.marginRelPct ? r : a));

const robustness = {
  configsTested: rows.length,
  capsCount: rows.filter((r) => r.caps).length,
  allCap: rows.every((r) => r.caps),
  signStablePositive: Math.min(...margins) > 0,
  marginRangePct: { min: Math.min(...margins), max: Math.max(...margins) },
  tightestConfig: { tag: minRow.tag, marginRelPct: minRow.marginRelPct },
  widestConfig: { tag: maxRow.tag, marginRelPct: maxRow.marginRelPct },
};

export const IMP96112_MAX_ANCHOR_MARGIN_WINDOW_ROBUSTNESS = {
  ticket: 'imp-96112',
  source:
    'imp-96090 measured the tightest max-anchor out-of-sample margin +3.0% at T=5e4 with ONE fixed band() window (k=1, span=0.30, non-overlapping). This re-measures sd(C-E) at 5e4 across a 12-config sweep of half-width, span and overlap (band() over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js) and asks whether the max-anchor cap and the tight margin persist or are a windowing artifact.',
  method:
    'Re-run the imp-95562 band() estimator at T=5e4 sweeping the half-width factor k in {0.5,0.75,1,1.5,2,3}, the half-span in {0.15,0.20,0.40,0.50} and the box-overlap in {0.25,0.50} about the imp-96090 canonical point. Each config gives r(T)=sd(C-E)^2 / V_GUE(L_actual); compare against the FIXED canonical max-anchor envelope r_cap^max(5e4)=0.4902910 (closed form, window-independent). sd and L baked to 7 significant figures offline; ratios recomputed here.',
  definitions: {
    rCapMax: 'r_cap^max(T) = (Selberg log log term + C0_max) / V_GUE(L_canonical): the imp-95722 max-anchor envelope ratio at T, a closed form independent of the measurement window',
    measuredRatio: 'r(T) = sd(C-E)^2 / V_GUE(L_actual): the number-variance ratio for this config, each window width normalized by its own GUE prediction',
    residualMax: 'residualMax = r_cap^max(T) - r(T): envelope minus measured; >= 0 means the (in-sample-fitted) max anchor caps 5e4 under this estimator',
    caps: 'true iff residualMax >= 0 for this window config',
  },
  inSampleAnchor: { C0_max },
  target: { T: T_STAR, rCapMax },
  canonicalOriginal: {
    ...CANONICAL_ORIGINAL,
    measuredRatio: rOriginal,
    residualMax: originalMargin,
    marginRelPct: (originalMargin / rOriginal) * 100,
    note: 'imp-96090 fixed-step tiling; reproduces its minResidual 0.0141223686 (+3.0%) headline',
  },
  rows,
  robustness,
  caveat:
    'The 12-config sweep spans a single held-out height (T=5e4) inside the 10^6-ordinate table, ~6.8 decades below the imp-95519 window bottom T=3.0e12: robustness of the +3.0% is assessed inside the accessible window, not extrapolated to the bottom (the imp-95710 window-reach sub-gap). The +3.0% headline is estimator-implementation specific (the imp-96090 fixed-step slight-overlap tiling); it is the tight end of a uniformly-positive family, not a representative central margin. Changes NO Lambda bound.',
  verdict:
    'The imp-96090 max-anchor cap at T=5e4 is ROBUST to the sd(C-E) window estimator: across a 12-config sweep of half-width, span and overlap the max anchor caps 5e4 every time with a strictly positive margin +3.6% .. +51.4%. The specific +3.0% headline is the tight end of that family and is estimator-implementation specific, but the SIGN of the margin does not depend on the window choice. Measurement only; changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // max anchor reproduces imp-95722/imp-96090
  if (!approx(C0_max, 0.3337213835371905, 1e-9)) throw new Error('imp-96112: C0_max drifted from imp-95722');
  if (!approx(rCapMax, 0.4902910234, 1e-6)) throw new Error('imp-96112: r_cap^max(5e4) drifted');
  // canonical fixed-step tiling reproduces the imp-96090 +3.0% headline exactly
  if (!approx(originalMargin, 0.014122368611298342, 1e-9)) throw new Error('imp-96112: original margin drifted from imp-96090 minResidual');
  if (!(originalMargin / rOriginal * 100 > 2.9 && originalMargin / rOriginal * 100 < 3.0))
    throw new Error('imp-96112: original relPct not ~ +3.0%');
  // twelve swept configs, all three axes present
  if (rows.length !== 12) throw new Error('imp-96112: expected twelve swept configs');
  if (new Set(rows.map((r) => r.axis)).size !== 3) throw new Error('imp-96112: expected three sweep axes');
  // ROBUSTNESS: max anchor caps 5e4 in every config, margin strictly positive
  if (!robustness.allCap) throw new Error('imp-96112: a swept config breached the max-anchor cap at 5e4');
  if (robustness.capsCount !== 12) throw new Error('imp-96112: not all twelve configs capped');
  if (!robustness.signStablePositive) throw new Error('imp-96112: margin changed sign across the sweep');
  // margin band and its endpoints
  if (!(robustness.marginRangePct.min > 3.5 && robustness.marginRangePct.min < 3.8))
    throw new Error('imp-96112: tightest swept margin not ~ +3.6%');
  if (!(robustness.marginRangePct.max > 51 && robustness.marginRangePct.max < 52))
    throw new Error('imp-96112: widest swept margin not ~ +51.4%');
  if (robustness.tightestConfig.tag !== 'k=0.5') throw new Error('imp-96112: tightest config not the finest half-width k=0.5');
  if (robustness.widestConfig.tag !== 'span=0.20') throw new Error('imp-96112: widest config not span=0.20');
  // honesty gates
  if (!/NO QED/.test(IMP96112_MAX_ANCHOR_MARGIN_WINDOW_ROBUSTNESS.verdict))
    throw new Error('imp-96112: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96112_MAX_ANCHOR_MARGIN_WINDOW_ROBUSTNESS.verdict))
    throw new Error('imp-96112: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96112_MAX_ANCHOR_MARGIN_WINDOW_ROBUSTNESS;
