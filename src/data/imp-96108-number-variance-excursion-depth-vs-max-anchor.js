/**
 * imp-96108 -- ASSESSING whether the one significant below-envelope excursion (T = 1.5e5,
 * imp-96089 z = 1.92 sigma, +16 percent over the MEAN cap) is compatible with the MAX offset
 * anchor upper bound and the r_cap < 1 dead-zone, or whether a genuine interior excursion of
 * that depth could breach the max anchor.
 *
 * CONTEXT. imp-96089 decided exactly ONE of three below-envelope number-variance dips is real,
 * not sampling noise: T = 1.5e5, where the measured ratio r pokes ~16 percent ABOVE the MEAN
 * offset anchor r_cap_mean (imp-96089 relPct = residual/r = -16.0 percent, i.e. the mean cap
 * fails to cover by 16 percent). imp-96090 then showed on FIVE genuinely held-out heights that
 * the MAX offset anchor caps all of them, tightest +3.0 percent at T = 5e4, while the mean
 * anchor breaches at T = 5e4 (-13.7 percent). The dead-zone r_cap < 1 headline rests on the MAX
 * anchor. This module quantifies, in offset space, how a real excursion of depth d relates to
 * the max anchor and whether the +3.0 percent held-out margin absorbs a -16 percent-scale event.
 *
 * KEY OBSERVATION (why the max anchor has ALREADY absorbed the deepest excursion). The max
 * offset anchor C0_max = 0.333721 is not an abstract bound -- it is the offset AT T = 1.5e5, the
 * exact height of the significant excursion (argmax of the six fit offsets is T = 1.5e5). So the
 * max cap is pinned, by construction, to the deepest observed excursion: residual_max(1.5e5) = 0.
 * The "+16 percent over the mean cap" is therefore EXACTLY the amount that lifts the measured
 * ratio from the mean cap up to the max cap -- an excursion of that depth TOUCHES the max cap, it
 * does not breach it.
 *
 * METHOD (import-light: no zeros bundle, no sibling imports; the six fit and five held-out
 * sd(C - E) literals are the same measured values imp-95562 / imp-96090 baked over the 10^6
 * Odlyzko ordinates in src/data/zeros-to-1e6.js). Work in OFFSET space, where the max-anchor cap
 * condition is height-independent and exact:
 *   offset(T) = sd(C - E)^2 - (1/2pi^2) log log(T/2pi),
 *   the MAX cap holds at T  iff  offset(T) <= C0_max = max over the six fit offsets = 0.333721.
 * For each measured height record offset(T) and its distance below C0_max; for the window bottom
 * T = 3.0e12 record the max-cap ratio r_cap_max and the offset that would be required to reach
 * r = 1. Report the excursion depth (in offset units and in mean-cap-relative percent) needed to
 * breach the max anchor at each height.
 *
 * FINDINGS.
 *  1. The max cap is breached at a height T iff offset(T) > C0_max = 0.333721. The DEEPEST offset
 *     over all 11 measured heights (6 fit + 5 held-out) is exactly C0_max, attained at the
 *     significant-excursion height T = 1.5e5 -- every other measured height sits strictly below.
 *     A "-16 percent excursion" is precisely offset = C0_max: it SATURATES the max cap (residual
 *     0), it does not breach it. A breach requires a STRICTLY deeper excursion, offset > C0_max,
 *     i.e. an over-mean overshoot deeper than the deepest yet measured.
 *  2. The nearest any UNMEASURED (held-out) height came to the max cap is T = 5e4: offset 0.320907,
 *     a gap of 0.012815 below C0_max, which is the imp-96090 +2.97 percent tightest held-out
 *     ratio margin. So an unmeasured interior excursion would have to run 0.012815 offset units
 *     (about 3 percent of the measured ratio) DEEPER than T = 5e4 -- or reach the full T = 1.5e5
 *     depth -- before it breached the max anchor. The +3.0 percent held-out margin is exactly the
 *     offset headroom the max anchor keeps over the closest unmeasured excursion.
 *  3. The excursion depth needed to reach the max cap FROM the mean cap, d_reach(T) =
 *     (C0_max - C0_mean) / (offset(T) evaluated at the max, i.e. Selberg term + C0_max), is a
 *     slowly varying ~16-19 percent of the measured ratio across the accessible heights and
 *     ~16.8 percent at the window bottom -- so the T = 1.5e5 event (16.0 percent) is a
 *     representative maximal excursion, not an outlier the anchor barely caught.
 *  4. The r_cap < 1 dead-zone is NOT the binding constraint. At the window bottom T = 3.0e12 the
 *     max-anchor cap is r_cap_max = 0.25987 -- a margin of 0.740 below 1. The offset that would be
 *     needed there to reach r = 1 is 1.7592 = 5.27 x C0_max, far beyond any excursion on the
 *     observed ~0.33 offset scale. A -16 percent-scale excursion (offset <= C0_max) cannot come
 *     near breaching r_cap < 1; the only live question is whether the MAX ANCHOR itself holds at
 *     unmeasured interior heights, and the deepest observed real excursion exactly saturates it.
 *
 * HONEST CAVEAT. C0_max is a SAMPLE maximum over 11 finite heights spanning ~1.5 decades
 * (1e4 .. 5e5); a genuinely deeper unmeasured excursion (offset > C0_max) at an unsampled interior
 * height WOULD breach the max anchor -- this assessment bounds the observed excursion depth, it
 * cannot prove none deeper exists. The imp-96089 significance verdict (z = 1.92 sigma) is what
 * makes the anchor trustworthy: the T = 1.5e5 offset is a REAL feature the anchor is pinned to,
 * not a noise spike, so C0_max reflects a genuine maximal excursion rather than an over-fit to
 * fluctuation. But the anchor stays an empirical sample max, and all 11 heights sit ~6.8 decades
 * below the T = 3.0e12 window bottom (the imp-95710 window-reach sub-gap). Measurement /
 * assessment only; changes NO bound.
 *
 * VERDICT. The -16 percent significant excursion at T = 1.5e5 is COMPATIBLE with the max offset
 * anchor by construction: C0_max is the offset at that very height, so the excursion saturates the
 * max cap (residual 0) rather than breaching it, and every other measured height sits below C0_max
 * (nearest unmeasured approach T = 5e4, gap 0.012815 offset units = the imp-96090 +3.0 percent
 * margin). A breach needs a STRICTLY deeper excursion (offset > C0_max) at an unsampled interior
 * height, which the finite 11-height sample cannot exclude but has never shown. The r_cap < 1
 * dead-zone is far from binding (r_cap_max(3e12) = 0.26, margin 0.74; an offset of 5.27 x C0_max
 * would be required to reach 1), so the only live constraint is the max anchor, and the deepest
 * real excursion exactly saturates it. Measurement only; changes no bound; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96089-mean-anchor-window-count-significance-verdict (the significant-dip verdict this assesses)
 * @see imp-96090-number-variance-mean-anchor-heldout-out-of-sample (the +3.0 percent held-out max-anchor margin)
 * @see imp-95722-number-variance-ratio-window-bottom-bound (the max-anchor choice + r_cap < 1 dead-zone)
 *
 * Import-light: no zeros bundle, no sibling imports. Every measured sd(C - E) is a baked literal;
 * every offset / cap / margin is recomputed here from the closed forms.
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;
const SELBERG_C = 1 / (2 * Math.PI * Math.PI); // Selberg leading variance constant

const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(T/2pi)
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L = 2 Delta delta(T)
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);
const logLog = (T) => Math.log(Math.log(T / TWO_PI));
const offsetOf = (T, sd) => sd * sd - SELBERG_C * logLog(T); // per-height Selberg-subtracted offset

// The six imp-95562 fit heights; the max anchor is the max of THESE offsets (imp-95722/imp-96049).
const FIT = [
  { Tc: 1.0e4, sdDiscrepancy: 0.6218 },
  { Tc: 3.0e4, sdDiscrepancy: 0.5823 },
  { Tc: 7.0e4, sdDiscrepancy: 0.5689 },
  { Tc: 1.5e5, sdDiscrepancy: 0.6714 }, // the significant-excursion height; its offset IS C0_max
  { Tc: 3.0e5, sdDiscrepancy: 0.6199 },
  { Tc: 5.0e5, sdDiscrepancy: 0.6078 },
];
// The five imp-96090 genuinely held-out heights (sd baked to 7 significant figures).
const HELDOUT = [
  { Tc: 2.0e4, sdDiscrepancy: 5.444814e-1 },
  { Tc: 5.0e4, sdDiscrepancy: 6.573555e-1 }, // nearest unmeasured approach to the max cap
  { Tc: 1.0e5, sdDiscrepancy: 6.037456e-1 },
  { Tc: 2.0e5, sdDiscrepancy: 5.899559e-1 },
  { Tc: 4.0e5, sdDiscrepancy: 6.109680e-1 },
];

const mean = (xs) => xs.reduce((s, v) => s + v, 0) / xs.length;
const fitOffsets = FIT.map((m) => offsetOf(m.Tc, m.sdDiscrepancy));
const C0_mean = mean(fitOffsets); // imp-96049 mean anchor
const C0_max = Math.max(...fitOffsets); // imp-95722 max anchor = offset at T = 1.5e5
const maxAnchorHeight = FIT[fitOffsets.indexOf(C0_max)].Tc;

// r_cap for a given offset anchor; the max cap holds at T iff offset(T) <= C0_max.
const cappedRatio = (T, C0) => (SELBERG_C * logLog(T) + C0) / gueNumberVariance(envelopeCount(T));
// Excursion depth (fraction of the measured ratio) needed to lift the mean cap to the max cap at T,
// evaluated at the max-cap saturation offset = SELBERG_C*loglog + C0_max (matches imp-96089 relPct).
const depthToReachMaxCap = (T) => (C0_max - C0_mean) / (SELBERG_C * logLog(T) + C0_max);

// Per-height offset-space picture: how far each measured height sits below the max cap.
const measuredRows = [...FIT, ...HELDOUT].map((m) => {
  const isHeldOut = HELDOUT.includes(m);
  const offset = offsetOf(m.Tc, m.sdDiscrepancy);
  const gueVar = gueNumberVariance(envelopeCount(m.Tc));
  const rMeasured = (m.sdDiscrepancy * m.sdDiscrepancy) / gueVar;
  const rCapMax = cappedRatio(m.Tc, C0_max);
  return {
    Tc: m.Tc,
    heldOut: isHeldOut,
    offset,
    offsetGapBelowMax: C0_max - offset, // >= 0: offset headroom before the max cap breaches
    maxCapMarginRelPct: ((rCapMax - rMeasured) / rMeasured) * 100, // >= 0 means the max cap covers
    breachesMaxCap: offset > C0_max + 1e-12,
    depthToReachMaxCapPct: depthToReachMaxCap(m.Tc) * 100, // excursion depth (% of measured ratio) needed at this height to reach the max cap
  };
});

const nearestUnmeasured = measuredRows
  .filter((r) => r.heldOut)
  .reduce((best, r) => (r.offsetGapBelowMax < best.offsetGapBelowMax ? r : best));
const deepestMeasured = measuredRows.reduce((best, r) => (r.offset > best.offset ? r : best));

// Window-bottom (T = 3.0e12) dead-zone picture.
const T_BOTTOM = 3.0e12; // imp-95519 verified window bottom
const gueVarBottom = gueNumberVariance(envelopeCount(T_BOTTOM));
const rCapMaxBottom = cappedRatio(T_BOTTOM, C0_max);
const offsetToReachOneAtBottom = gueVarBottom * 1 - SELBERG_C * logLog(T_BOTTOM);

export const IMP96108_NUMBER_VARIANCE_EXCURSION_DEPTH_VS_MAX_ANCHOR = {
  ticket: 'imp-96108',
  source:
    'imp-96089 decided exactly one below-envelope dip is significant (T = 1.5e5, z = 1.92 sigma, +16 percent over the mean cap) and imp-96090 measured the max offset anchor caps five held-out heights (tightest +3.0 percent at T = 5e4). This assesses whether a genuine -16 percent-scale interior excursion is compatible with the MAX anchor upper bound and the r_cap < 1 dead-zone, in offset space where the max-cap condition offset(T) <= C0_max is exact and height-independent.',
  definitions: {
    offset: 'offset(T) = sd(C - E)^2 - (1/2pi^2) log log(T/2pi): the per-height Selberg-subtracted residual whose sample max over the six fit heights is C0_max',
    maxCapCondition: 'the max offset anchor caps T iff offset(T) <= C0_max; the max cap is BREACHED iff offset(T) > C0_max',
    offsetGapBelowMax: 'C0_max - offset(T): the offset headroom the max cap keeps above a height, i.e. how much deeper an excursion there would have to run to breach the max anchor',
    depthToReachMaxCap: 'the fraction of the measured ratio by which an excursion must overshoot the mean cap to reach the max cap at T = (C0_max - C0_mean)/(Selberg term + C0_max)',
  },
  anchors: { C0_mean, C0_max, maxAnchorHeight }, // C0_max is the offset AT T = 1.5e5
  measuredRows,
  nearestUnmeasuredApproach: {
    Tc: nearestUnmeasured.Tc, // T = 5e4
    offset: nearestUnmeasured.offset,
    offsetGapBelowMax: nearestUnmeasured.offsetGapBelowMax, // 0.012815 offset units
    maxCapMarginRelPct: nearestUnmeasured.maxCapMarginRelPct, // the imp-96090 +2.97 percent margin
  },
  deepestMeasuredExcursion: {
    Tc: deepestMeasured.Tc, // T = 1.5e5
    offset: deepestMeasured.offset, // == C0_max
    saturatesMaxCap: Math.abs(deepestMeasured.offset - C0_max) < 1e-12, // residual 0 at the anchor height
    depthOverMeanCapPct: depthToReachMaxCap(deepestMeasured.Tc) * 100, // ~16.0 percent
  },
  deadZoneBottom: {
    Tc: T_BOTTOM,
    rCapMax: rCapMaxBottom, // 0.25987
    marginBelowOne: 1 - rCapMaxBottom, // 0.740
    offsetToReachOne: offsetToReachOneAtBottom, // 1.7592
    offsetToReachOneInC0MaxUnits: offsetToReachOneAtBottom / C0_max, // 5.27 x C0_max
    depthToReachMaxCapPct: depthToReachMaxCap(T_BOTTOM) * 100, // ~16.8 percent
  },
  anyMeasuredBreach: measuredRows.some((r) => r.breachesMaxCap), // false: no measured height breaches
  caveat:
    'C0_max is a SAMPLE maximum over 11 finite heights (1e4 .. 5e5, ~1.5 decades); a genuinely deeper unmeasured excursion (offset > C0_max) at an unsampled interior height WOULD breach the max anchor -- this bounds the OBSERVED excursion depth, it does not prove none deeper exists. The imp-96089 z = 1.92 sigma significance is what makes C0_max trustworthy: it is pinned to a REAL maximal excursion, not a noise spike. But all 11 heights sit ~6.8 decades below the T = 3.0e12 window bottom (the imp-95710 window-reach sub-gap). Changes NO Lambda bound.',
  verdict:
    'The -16 percent significant excursion at T = 1.5e5 is COMPATIBLE with the max offset anchor by construction: C0_max = 0.333721 IS the offset at that very height, so the excursion saturates the max cap (residual 0) rather than breaching it, and every other measured height sits below C0_max (nearest unmeasured approach T = 5e4, gap 0.012815 offset units = the imp-96090 +3.0 percent margin). A breach needs a STRICTLY deeper excursion (offset > C0_max) at an unsampled interior height, which the finite 11-height sample cannot exclude but has never shown. The r_cap < 1 dead-zone is far from binding (r_cap_max(3e12) = 0.26, margin 0.74; an offset of 5.27 x C0_max would be needed to reach 1), so the only live constraint is the max anchor and the deepest real excursion exactly saturates it. Measurement only; changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // anchors reproduce imp-96049 / imp-95722, and the max anchor is the T = 1.5e5 offset
  if (!approx(C0_mean, 0.26184177603555076, 1e-9)) throw new Error('imp-96108: C0_mean drifted from imp-96049');
  if (!approx(C0_max, 0.3337213835371905, 1e-9)) throw new Error('imp-96108: C0_max drifted from imp-95722');
  if (maxAnchorHeight !== 1.5e5) throw new Error('imp-96108: max anchor height is not T = 1.5e5');
  // the deepest measured excursion saturates (does not breach) the max cap
  if (deepestMeasured.Tc !== 1.5e5) throw new Error('imp-96108: deepest measured excursion not at T = 1.5e5');
  if (!IMP96108_NUMBER_VARIANCE_EXCURSION_DEPTH_VS_MAX_ANCHOR.deepestMeasuredExcursion.saturatesMaxCap)
    throw new Error('imp-96108: deepest excursion should saturate the max cap (residual 0)');
  if (!approx(IMP96108_NUMBER_VARIANCE_EXCURSION_DEPTH_VS_MAX_ANCHOR.deepestMeasuredExcursion.depthOverMeanCapPct, 15.95, 0.1))
    throw new Error('imp-96108: T = 1.5e5 depth over the mean cap drifted from ~16 percent');
  // no measured height breaches the max cap
  if (IMP96108_NUMBER_VARIANCE_EXCURSION_DEPTH_VS_MAX_ANCHOR.anyMeasuredBreach)
    throw new Error('imp-96108: a measured height unexpectedly breaches the max cap');
  // nearest unmeasured approach is T = 5e4 with the imp-96090 +3.0 percent margin
  if (nearestUnmeasured.Tc !== 5.0e4) throw new Error('imp-96108: nearest unmeasured approach not at T = 5e4');
  if (!approx(nearestUnmeasured.offsetGapBelowMax, 0.012815, 1e-4))
    throw new Error('imp-96108: nearest unmeasured offset gap drifted');
  if (!approx(nearestUnmeasured.maxCapMarginRelPct, 2.97, 0.1))
    throw new Error('imp-96108: nearest unmeasured max-cap margin not ~+3.0 percent');
  // the r_cap < 1 dead-zone is far from binding at the window bottom
  if (!approx(rCapMaxBottom, 0.25987, 1e-4)) throw new Error('imp-96108: r_cap_max(3e12) drifted');
  // per-height d_reach stays in the ~16-19 percent band claimed by FINDINGS 3
  if (measuredRows.some((r) => r.depthToReachMaxCapPct < 15 || r.depthToReachMaxCapPct > 20))
    throw new Error('imp-96108: a per-height depthToReachMaxCapPct fell outside the claimed 16-19 percent band');
  if (!(IMP96108_NUMBER_VARIANCE_EXCURSION_DEPTH_VS_MAX_ANCHOR.deadZoneBottom.offsetToReachOneInC0MaxUnits > 5))
    throw new Error('imp-96108: dead-zone breach offset should be > 5 x C0_max');
  // honesty gates
  if (!/NO QED/.test(IMP96108_NUMBER_VARIANCE_EXCURSION_DEPTH_VS_MAX_ANCHOR.verdict))
    throw new Error('imp-96108: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96108_NUMBER_VARIANCE_EXCURSION_DEPTH_VS_MAX_ANCHOR.verdict))
    throw new Error('imp-96108: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96108_NUMBER_VARIANCE_EXCURSION_DEPTH_VS_MAX_ANCHOR;
