/**
 * imp-95958 -- MEASURING how much a MEAN (and MEDIAN) anchor for the envelope offset C0
 * tightens the imp-95722/imp-95946 number-variance envelope r_cap(T) at the imp-95519
 * window bottom T = 3e12, while keeping r_cap < 1.
 *
 * imp-95946 cross-validated the imp-95722 derived envelope r_cap(T) = [ (1/2pi^2)
 * log log(T/2pi) + C0 ] / Sigma^2(L(T)) against the six imp-95710 measured ratios over
 * their T = 1e4..5e5 overlap, but ONLY as a self-consistency check: C0 was pinned as the
 * MAX per-height offset from those same six points, so residual >= 0 is guaranteed and the
 * check quantifies max-anchor slack (0 at the T = 1.5e5 anchor, up to +0.133 / ~38% at
 * T = 7e4). imp-95946 and imp-95787/imp-95800 all note a MEAN-based C0 would tighten the
 * envelope while keeping r_cap < 1, but the mean-anchor r_cap(3e12) was never computed.
 *
 * METHOD (import-light, no zeros bundle, no sibling imports). The SAME six imp-95562
 * measured sd(C - E) literals imp-95710/imp-95722/imp-95946 baked (over the 10^6 Odlyzko
 * ordinates) are re-used verbatim. The per-height offset offset(T) = measuredVar - Selberg
 * term is recomputed exactly as imp-95946, then three anchors are formed from those six
 * offsets: C0_max (the imp-95722/imp-95946 anchor), C0_mean, and C0_median. Each anchor is
 * propagated through the identical closed-form r_cap(T) and evaluated at the imp-95519
 * window bottom T = 3e12.
 *
 * FINDINGS.
 *  1. C0_max = 0.33372 (reproduces imp-95722), C0_mean = 0.26184, C0_median = 0.25525.
 *     The mean/median anchors sit ~0.072/~0.078 below the max anchor -- the mean anchor
 *     is close to the interior offsets (the max at T = 1.5e5 is the high outlier).
 *  2. r_cap(3e12): max anchor 0.25987 (the imp-95722 ~0.26), mean anchor 0.22255,
 *     median anchor 0.21912. The mean anchor tightens r_cap(3e12) by 0.03732 in absolute
 *     terms (~14.4% relative to the max-anchor r_cap); the median anchor by 0.04075
 *     (~15.7%).
 *  3. r_cap < 1 STILL HOLDS with room to spare under every anchor: all three window-bottom
 *     values are well under 0.26, so tightening the offset to the mean/median does NOT
 *     threaten the r_cap < 1 conclusion at 3e12 -- it strengthens the margin.
 *
 * HONEST CAVEAT (unchanged from imp-95946). The mean/median anchors are still fitted FROM
 * the same six in-repo measurements; this is a tightening of the SAME self-consistency
 * envelope, NOT an out-of-sample validation. The dead-zone conservatism above the
 * gamma_1e6 = 6.003e5 ceiling stays reliant on the derived envelope (imp-95750 F3), and a
 * mean/median anchor -- being lower than the max -- carries LESS safety margin over any
 * unmeasured interior height than the conservative max anchor imp-95722 deliberately chose.
 * The measured r_cap < 1 headline continues to rest on the max anchor; the mean/median
 * figures quantify how much slack that conservative choice leaves at the window bottom.
 *
 * VERDICT. A mean anchor tightens the imp-95722 envelope r_cap(3e12) from ~0.260 (max
 * anchor) to ~0.223 (a ~14.4% relative reduction), a median anchor to ~0.219 (~15.7%);
 * r_cap < 1 holds comfortably under all three anchors, confirming the imp-95787/imp-95800
 * expectation that a mean-based C0 tightens the envelope while keeping r_cap < 1. This is a
 * tightening of the same in-repo self-consistency envelope, not an out-of-sample test, and
 * the conservative max anchor remains the one carrying the dead-zone margin (imp-95750 F3).
 * Measurement only; changes no bound; NO QED; no refereed bound is changed;
 * the zero-side route stays PCC/GRH-gated.
 *
 * Import-light: no zeros bundle, no sibling imports. The six sd(C - E) values are the same
 * measured literals imp-95710/imp-95722/imp-95946 baked; every derived quantity is
 * recomputed here.
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;

const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(v), v = T/2pi
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L = 2 Delta delta(T)
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);
const SELBERG_C = 1 / (2 * Math.PI * Math.PI); // Selberg leading variance constant
const logLog = (T) => Math.log(Math.log(T / TWO_PI));

// Same six measured literals imp-95710/imp-95722/imp-95946 baked (imp-95562 over the 10^6 Odlyzko ordinates).
const MEASURED = [
  { Tc: 1.0e4, sdDiscrepancy: 0.6218 },
  { Tc: 3.0e4, sdDiscrepancy: 0.5823 },
  { Tc: 7.0e4, sdDiscrepancy: 0.5689 },
  { Tc: 1.5e5, sdDiscrepancy: 0.6714 },
  { Tc: 3.0e5, sdDiscrepancy: 0.6199 },
  { Tc: 5.0e5, sdDiscrepancy: 0.6078 },
];

// Per-height offset offset(T) = measuredVar - Selberg term (identical to imp-95946).
const offsets = MEASURED.map((m) => m.sdDiscrepancy * m.sdDiscrepancy - SELBERG_C * logLog(m.Tc));

const mean = (xs) => xs.reduce((s, v) => s + v, 0) / xs.length;
const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
};

const C0_max = Math.max(...offsets); // imp-95722/imp-95946 anchor
const C0_mean = mean(offsets); // proposed tighter anchor (imp-95787/imp-95800)
const C0_median = median(offsets); // robust central anchor

const cappedVariance = (T, C0) => SELBERG_C * logLog(T) + C0; // envelope numerator cap
const cappedRatio = (T, C0) => cappedVariance(T, C0) / gueNumberVariance(envelopeCount(T)); // r_cap(T)

const WINDOW_BOTTOM_T = 3.0e12; // imp-95519 window bottom

const rCapMax = cappedRatio(WINDOW_BOTTOM_T, C0_max);
const rCapMean = cappedRatio(WINDOW_BOTTOM_T, C0_mean);
const rCapMedian = cappedRatio(WINDOW_BOTTOM_T, C0_median);

const tighteningMeanAbs = rCapMax - rCapMean; // how much the mean anchor lowers r_cap(3e12)
const tighteningMeanRelPct = (tighteningMeanAbs / rCapMax) * 100;
const tighteningMedianAbs = rCapMax - rCapMedian;
const tighteningMedianRelPct = (tighteningMedianAbs / rCapMax) * 100;

// r_cap(T) under each anchor across the six overlap heights, for reference.
const ANCHOR_ROWS = [
  { anchor: 'max', C0: C0_max, rCap3e12: rCapMax },
  { anchor: 'mean', C0: C0_mean, rCap3e12: rCapMean, tighteningAbs: tighteningMeanAbs, tighteningRelPct: tighteningMeanRelPct },
  { anchor: 'median', C0: C0_median, rCap3e12: rCapMedian, tighteningAbs: tighteningMedianAbs, tighteningRelPct: tighteningMedianRelPct },
];

const allBelowOne = ANCHOR_ROWS.every((r) => r.rCap3e12 > 0 && r.rCap3e12 < 1);

export const IMP95958_NUMBER_VARIANCE_MEAN_ANCHOR_C0_TIGHTENING = {
  ticket: 'imp-95958',
  source:
    'imp-95946 VERDICT + imp-95787/imp-95800: a mean-based envelope offset C0 would tighten the imp-95722 r_cap(T) while keeping r_cap < 1, but the mean-anchor r_cap(3e12) was never computed. Envelope: imp-95722 r_cap(T). Measurements: the six imp-95562 sd(C - E) literals over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js.',
  definitions: {
    offset: 'offset(T) = measuredVar - (1/2pi^2) log log(T/2pi): the per-height Selberg-subtracted residual whose anchor gives C0',
    C0_max: 'max over the six offsets: the imp-95722/imp-95946 conservative anchor (argmax at T = 1.5e5)',
    C0_mean: 'arithmetic mean of the six offsets: the tighter anchor imp-95787/imp-95800 propose',
    C0_median: 'median of the six offsets: a robust central anchor',
    rCap: 'r_cap(T) = [ (1/2pi^2) log log(T/2pi) + C0 ] / Sigma^2(L(T)): imp-95722 derived upper envelope evaluated at the imp-95519 window bottom T = 3e12',
  },
  windowBottomT: WINDOW_BOTTOM_T,
  offsets,
  anchors: { C0_max, C0_mean, C0_median },
  rCapAtWindowBottom: { max: rCapMax, mean: rCapMean, median: rCapMedian },
  tightening: {
    meanAbs: tighteningMeanAbs, // ~ 0.0373
    meanRelPct: tighteningMeanRelPct, // ~ 14.4%
    medianAbs: tighteningMedianAbs, // ~ 0.0407
    medianRelPct: tighteningMedianRelPct, // ~ 15.7%
  },
  rows: ANCHOR_ROWS,
  allBelowOne, // true: r_cap(3e12) < 1 under every anchor
  caveat:
    'NOT an out-of-sample validation. The mean/median anchors are still fitted FROM the same six in-repo measurements, so this tightens the SAME self-consistency envelope rather than testing it out of sample. Being lower than the max, a mean/median anchor carries LESS safety margin over any unmeasured interior height than the conservative max anchor imp-95722 chose; the dead-zone conservatism above the gamma_1e6 = 6.003e5 ceiling stays reliant on the derived envelope (imp-95750 F3). The measured r_cap < 1 headline continues to rest on the max anchor; these figures only quantify the slack that conservative choice leaves at the window bottom.',
  verdict:
    'MEASURED: a mean anchor tightens the imp-95722 envelope r_cap(3e12) from ~0.260 (max anchor) to ~0.223 (a ~14.4% relative reduction), a median anchor to ~0.219 (~15.7%); r_cap < 1 holds comfortably under all three anchors, confirming the imp-95787/imp-95800 expectation that a mean-based C0 tightens the envelope while keeping r_cap < 1. This is a tightening of the same in-repo self-consistency envelope, not an out-of-sample test, and the conservative max anchor remains the one carrying the dead-zone margin (imp-95750 F3). Measurement only; changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // C0_max reconstruction matches the imp-95722/imp-95946 value
  if (!approx(C0_max, 0.3337213835371905, 1e-9)) throw new Error('imp-95958: C0_max reconstruction drifted from imp-95722');
  // the tighter anchors are genuinely below the max anchor
  if (!(C0_mean < C0_max && C0_median < C0_max)) throw new Error('imp-95958: mean/median anchor not below the max anchor');
  // mean/median anchor values in the expected band
  if (!approx(C0_mean, 0.26184177603555076, 1e-9)) throw new Error('imp-95958: C0_mean drifted');
  if (!approx(C0_median, 0.25524949801639996, 1e-9)) throw new Error('imp-95958: C0_median drifted');
  // window-bottom r_cap under the max anchor reproduces the imp-95722 ~0.26
  if (!approx(rCapMax, 0.2598691144772859, 1e-9)) throw new Error('imp-95958: max-anchor r_cap(3e12) drifted from imp-95722 ~0.26');
  // the mean/median anchors tighten r_cap(3e12)
  if (!(rCapMean < rCapMax && rCapMedian < rCapMax)) throw new Error('imp-95958: mean/median anchor did not tighten r_cap(3e12)');
  if (!approx(rCapMean, 0.2225468806064992, 1e-9)) throw new Error('imp-95958: mean-anchor r_cap(3e12) drifted');
  if (!approx(rCapMedian, 0.2191239550992003, 1e-9)) throw new Error('imp-95958: median-anchor r_cap(3e12) drifted');
  // tightening magnitudes in the reported band
  if (!(tighteningMeanRelPct > 10 && tighteningMeanRelPct < 20)) throw new Error('imp-95958: mean tightening outside the expected band');
  // r_cap < 1 must still hold under every anchor -- the whole point
  if (!allBelowOne) throw new Error('imp-95958: an anchor pushed r_cap(3e12) outside (0,1)');
  for (const r of ANCHOR_ROWS)
    if (!(r.rCap3e12 > 0 && r.rCap3e12 < 1)) throw new Error('imp-95958: an anchor r_cap(3e12) fell outside (0,1)');
  // honesty gates
  if (!/NO QED/.test(IMP95958_NUMBER_VARIANCE_MEAN_ANCHOR_C0_TIGHTENING.verdict))
    throw new Error('imp-95958: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP95958_NUMBER_VARIANCE_MEAN_ANCHOR_C0_TIGHTENING.verdict))
    throw new Error('imp-95958: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP95958_NUMBER_VARIANCE_MEAN_ANCHOR_C0_TIGHTENING;
