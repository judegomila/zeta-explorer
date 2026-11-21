/**
 * imp-96510 -- ASSESSMENT: what higher-height range and zero-SOURCE would be needed to realize
 * the imp-96452 lever (b) -- a genuinely deeper interior below-envelope number-variance dip that
 * runs ~1.93x deeper than the imp-96493 deepest measured excursion (z = 1.0358 at T = 3.879e5) --
 * and does the GUE number-variance envelope predict such depths become attainable above the 10^6
 * Odlyzko ordinate ceiling?
 *
 * BACKGROUND. imp-96452 named the ONLY genuine lever to lift the celebrated T = 1.5e5 excursion
 * from ~1.9-sigma to a clean 2-sigma as its option (b): "observe a comparably deep dip at a higher
 * unclipped height". imp-96493 then scanned every unclipped interior height T > 1.5e5 the existing
 * 10^6-ordinate band() measurements reach (to T = 4.577e5) and found NONE reaches z >= 2: the
 * deepest clean below-envelope dip is z = 1.0358 at T = 3.879e5 (n_w = 468, relErr = 0.06772), and
 * to clear 2-sigma there the depth would have to run ~1.93x deeper than it does. So lever (b) has
 * no realization in the fixed 10^6 set. This module asks the follow-up imp-96493 defers: WHICH
 * height range and zero-source (beyond 10^6) could supply such a dip, and does the envelope predict
 * it is attainable at all?
 *
 * THE UNCLIPPED-HEIGHT / ZERO-SOURCE COUPLING. A fully interior (unclipped) +/-30 percent tiling at
 * height T needs ordinates up to (1 + 0.3) T = 1.3 T. So a zero-source whose top ordinate is T_src
 * supplies unclipped interior heights only up to T_src / 1.3. To probe any new unclipped interior
 * height above the existing ceiling T_clip ~ 4.6175e5 (= 600269.68 / 1.3) requires zeros beyond the
 * 10^6-th (top ordinate ~6.0e5). Independent number-variance measurements moreover require
 * NON-OVERLAPPING +/-30 percent spans: the span of height T is [0.7 T, 1.3 T], so the next
 * independent height T2 needs 0.7 T2 >= 1.3 T, i.e. T2 >= (1.3/0.7) T = (13/7) T ~ 1.857 T. Fresh
 * independent heights are therefore spaced by the constant multiplicative factor g = 13/7 in T.
 *
 * TWO COMPETING READINGS OF THE DIP DEPTH (the crux). Whether a deeper dip is "attainable at
 * height" depends entirely on whether the fractional depth relErr = |r_cap - r|/r is a GENUINE
 * SYSTEMATIC below-envelope deviation or a SAMPLING FLUCTUATION of the chi-square variance
 * estimator r (whose relative error is sqrt(2/n_w), with n_w = 0.3 sqrt(2pi) sqrt(T) ~ sqrt(T)):
 *
 *  (A) SYSTEMATIC reading -- relErr is a fixed fractional feature independent of height. Then
 *      z = relErr / sqrt(2/n_w) = relErr sqrt(n_w/2) GROWS as n_w^(1/2) ~ T^(1/4), and holding the
 *      imp-96493 deepest measured depth relErr = 0.06772 fixed, z reaches 2 once n_w >= 1744, i.e.
 *      at height T_sys ~ 5.38e6 (ordinate ceiling ~7.0e6, only N ~ 1.44e7 zeros -- WELL within the
 *      existing 10^12 contiguous datasets). Under this reading a deeper 2-sigma dip is easily
 *      reachable, needing only a modest height bump.
 *
 *  (B) SAMPLING-NOISE reading -- relErr shrinks in lockstep with sqrt(2/n_w) as height grows, so z
 *      stays O(1) at EVERY height and a clean 2-sigma is a rare one-sided tail event. A below-
 *      envelope z >= 2 fluctuation has probability p2 = Phi(-2) = 0.022750 at each INDEPENDENT
 *      height. Sampling K independent heights, the chance at least one clears 2-sigma is
 *      1 - (1 - p2)^K, so a 50 percent search needs K = ln(0.5)/ln(1 - p2) = 30.1 independent
 *      heights and a 90 percent search needs K = 100.1. K independent heights span a factor g^K in
 *      T above the T = 1.5e5 base, so a 50 percent search reaches top height T_top ~ 1.88e13
 *      (ordinate ceiling T_src ~ 2.44e13, N ~ 1.09e14 zeros) and a 90 percent search reaches
 *      T_top ~ 1.19e32 (T_src ~ 1.55e32, N ~ 1.76e33 zeros -- astronomically out of reach).
 *
 * WHICH READING DOES THE DATA FAVOUR? The imp-96493 scan is decisive: the deepest measured depth
 * SHRINKS from relErr = 0.159457 at T = 1.5e5 (n_w = 291) to relErr = 0.06772 at T = 3.879e5
 * (n_w = 468). The sampling-noise floor over that span shrinks by only sqrt(291/468) = 0.789, but
 * the measured depth shrank by 0.06772/0.159457 = 0.425 -- FASTER than the noise floor, so z itself
 * FELL (1.9234 -> 1.0358). A systematic fixed-fractional excursion would have kept relErr constant
 * (and z would have RISEN as T^(1/4)); it did the opposite. The existing data therefore favours the
 * SAMPLING-NOISE reading (B): the below-envelope dips are consistent with chi-square fluctuations,
 * and the GUE number-variance envelope -- which fixes the EXPECTED ratio r ~ 1 below saturation
 * with SYMMETRIC fluctuations -- predicts NO systematic deepening with height. A clean 2-sigma is a
 * fixed ~2.28 percent one-sided tail at each independent height, neither favoured nor suppressed by
 * going higher.
 *
 * THE ZERO-SOURCE CANNOT BE A HIGH-N LOCAL BLOCK. The reachable higher heights (T_src ~ 2.44e13 for
 * even a 50 percent search) do NOT correspond to any existing verified data: the Platt-Trudgian
 * contiguous RH verification reaches height ~3.0001e12 (N ~ 1.24e13 zeros), so a 50 percent search
 * needs a CONTIGUOUS source ~8.1x higher in height (~8.8x more zeros) than the current verified
 * ceiling. And the Odlyzko high-zero datasets near the 10^21 / 10^22-nd zeros (heights ~1e21) are
 * LOCAL blocks of ~10^9 consecutive zeros -- each spans a relative window far narrower than the
 * +/-30 percent needed for even ONE full interior number-variance tiling, so they supply neither a
 * contiguous decade ladder nor a single unclipped interior height. The required source is a
 * contiguous zero-source reaching top ordinate ~2.44e13 (50 percent) that simply does not exist.
 *
 * VERDICT. Realizing imp-96452 lever (b) -- a genuinely deeper interior dip ~1.93x below the
 * imp-96493 deepest measured excursion -- requires, under the SAMPLING-NOISE reading the existing
 * data favours, a statistical hunt across ~30 independent unclipped heights (50 percent chance) or
 * ~100 (90 percent), i.e. a CONTIGUOUS zero-source reaching top ordinate ~2.44e13 (~1.1e14 zeros,
 * ~8.1x the Platt-Trudgian verified height) or ~1.55e32 respectively -- neither of which exists, and
 * the Odlyzko 10^21/10^22 local blocks are too narrow to supply even one unclipped interior tiling.
 * Crucially the GUE number-variance envelope does NOT predict deeper dips become attainable at
 * height: the depth is a fixed ~2.28 percent one-sided tail per independent height, and the
 * imp-96493 measured depths already SHRINK faster than the sampling floor, arguing against a
 * systematic excursion. Only under the (data-disfavoured) SYSTEMATIC reading would a deeper 2-sigma
 * dip be cheap (height ~5.4e6, ~1.4e7 zeros); the ~7-order-of-magnitude gap between the two zero-
 * source estimates IS the unresolved systematic-vs-noise question. Assessment/measurement only;
 * changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route
 * stays PCC/GRH-gated.
 *
 * @see imp-96493-excursion-2sigma-interior-scan (deepest measured interior dip z = 1.0358 at T = 3.879e5; needs ~1.93x deeper)
 * @see imp-96452-excursion-confidence-2sigma-reach (names lever b: a deeper dip at a higher unclipped height)
 * @see imp-96089-mean-anchor-window-count-significance-verdict (the z = relErr/sqrt(2/n_w) dip score)
 *
 * Import-light: no zeros bundle, no sibling imports. The imp-96493 deepest-dip inputs
 * (relErr = 0.06772, n_w = 468, T = 3.879e5) and the T = 1.5e5 reference (relErr = 0.159457,
 * n_w = 291) are baked literals; every height/source/probability figure is recomputed here.
 */

const TWO_PI = 2 * Math.PI;
const SPAN_FRACTION = 0.3;

// Independent, non-overlapping +/-30% spans are spaced by g = (1+span)/(1-span) = 13/7 in T.
const INDEP_SPACING = (1 + SPAN_FRACTION) / (1 - SPAN_FRACTION); // 13/7 ~ 1.857143

// window count n_w(T) = 0.3 * 2T / (2 sqrt(T/2pi)) = 0.3 sqrt(2pi) sqrt(T) while unclipped.
const NW_COEFF = SPAN_FRACTION * Math.sqrt(TWO_PI); // ~0.751988
const windowCount = (T) => NW_COEFF * Math.sqrt(T);
const heightForWindowCount = (nw) => (nw / NW_COEFF) ** 2;

// Riemann-von Mangoldt main term: number of zeros with ordinate up to T.
const zeroCount = (T) => (T / TWO_PI) * (Math.log(T / TWO_PI) - 1);

// Standard normal tail via Abramowitz-Stegun 7.1.26 erf (accurate ~1.5e-7).
const erf = (x) => {
  const s = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-ax * ax);
  return s * y;
};
const normalCdf = (z) => 0.5 * (1 + erf(z / Math.SQRT2));

// --- baked imp-96493 / imp-96452 inputs (import-light) ---
const REF_T = 1.5e5, REF_RELERR = 0.159457, REF_NW = 291; // T=1.5e5 reference (z=1.9234)
const DEEP_T = 3.879e5, DEEP_RELERR = 0.06772, DEEP_NW = 468; // imp-96493 deepest interior dip (z=1.0358)
const Z_TARGET = 2.0;
const T_MAX_ORDINATE = 600269.68; // 10^6-th Odlyzko ordinate
const T_CLIP_EXISTING = T_MAX_ORDINATE / (1 + SPAN_FRACTION); // ~4.6175e5

// deepen factor imp-96493 reports the deepest interior dip would need to reach 2-sigma.
const relErrNeededAtDeep = Z_TARGET * Math.sqrt(2 / DEEP_NW);
const deepenFactorNeeded = relErrNeededAtDeep / DEEP_RELERR; // ~1.93x

// --- reading (A): SYSTEMATIC fixed-fractional depth. z ~ sqrt(n_w) ~ T^(1/4). ---
// hold relErr = DEEP_RELERR fixed; solve for the height where n_w gives z = 2.
const nwSystematicNeeded = 2 * (Z_TARGET / DEEP_RELERR) ** 2; // 2 (z/relErr)^2
const heightSystematic = heightForWindowCount(nwSystematicNeeded);
const sourceCeilingSystematic = (1 + SPAN_FRACTION) * heightSystematic;
const zeroSourceSystematic = zeroCount(sourceCeilingSystematic);

// --- reading (B): SAMPLING-NOISE. z stays O(1); a clean 2-sigma is a tail hunt. ---
const oneSidedTail2Sigma = normalCdf(-Z_TARGET); // Phi(-2) ~ 0.022750
const indepHeightsForProb = (P) => Math.log(1 - P) / Math.log(1 - oneSidedTail2Sigma);
// K independent heights span a factor g^K above the T=1.5e5 base.
const statisticalReach = (P) => {
  const K = indepHeightsForProb(P);
  const topHeight = REF_T * INDEP_SPACING ** K;
  const sourceCeiling = (1 + SPAN_FRACTION) * topHeight;
  return { P, indepHeights: K, topHeight, sourceCeiling, zeroSource: zeroCount(sourceCeiling) };
};
const reach50 = statisticalReach(0.5);
const reach90 = statisticalReach(0.9);

// --- which reading does the imp-96493 data favour? measured depth vs the sampling floor. ---
const measuredDepthRatio = DEEP_RELERR / REF_RELERR; // 0.4247: how much the depth shrank
const samplingFloorRatio = Math.sqrt(REF_NW / DEEP_NW); // 0.7885: how much the noise floor shrank
// depth shrank FASTER than the floor => z fell => favours sampling-noise (B), not systematic (A).
const dataFavoursSamplingNoise = measuredDepthRatio < samplingFloorRatio;

// --- context: current verified contiguous ceiling (Platt-Trudgian) ---
const T_PT_VERIFIED = 3.0001e12; // Platt-Trudgian RH verification height
const N_PT_VERIFIED = zeroCount(T_PT_VERIFIED); // ~1.24e13 zeros
const sourceOverPTfactor = reach50.sourceCeiling / T_PT_VERIFIED; // ~8.1x

export const IMP96510_DEEPER_INTERIOR_DIP_HEIGHT_SOURCE_REACH = {
  ticket: 'imp-96510',
  question:
    'What higher-height range and zero-source (beyond the 10^6 Odlyzko ceiling) would be needed to realize imp-96452 lever (b) -- a genuinely deeper interior below-envelope dip ~1.93x deeper than the imp-96493 deepest measured excursion (z = 1.0358 at T = 3.879e5) -- and does the GUE number-variance envelope predict such depths are attainable?',
  method:
    'Couple the unclipped-height requirement (a +/-30% interior tiling at height T needs ordinates to 1.3 T; independent non-overlapping spans are spaced by g = 13/7 in T) to two competing readings of the fractional dip depth relErr: (A) SYSTEMATIC -- relErr fixed, z ~ T^(1/4), solve for the height where the imp-96493 deepest depth clears 2-sigma; (B) SAMPLING-NOISE -- z stays O(1), a clean 2-sigma is a Phi(-2) tail hunt across K independent heights. Decide between them from whether the imp-96493 measured depth shrinks faster than the chi-square sampling floor. Import-light, baked imp-96493/imp-96452 literals.',
  baseline: {
    referenceDip: { T: REF_T, relErr: REF_RELERR, nW: REF_NW, note: 'imp-96089 T=1.5e5 excursion, z=1.9234.' },
    deepestInteriorDip: { T: DEEP_T, relErr: DEEP_RELERR, nW: DEEP_NW, note: 'imp-96493 deepest clean interior dip, z=1.0358.' },
    deepenFactorNeeded, // ~1.93x deeper than measured to clear 2-sigma at T=3.879e5
    existingUnclippedCeiling: T_CLIP_EXISTING, // ~4.6175e5: the 10^6-set unclipped interior ceiling
  },
  heightSourceCoupling: {
    unclippedNeedsOrdinatesTo: '1.3 T (a +/-30% interior tiling at height T needs the top ordinate >= 1.3 T)',
    independentHeightSpacing: INDEP_SPACING, // 13/7: multiplicative factor between non-overlapping heights
    note: 'To probe any new unclipped interior height above the existing ~4.6175e5 ceiling requires zeros beyond the 10^6-th; fresh independent number-variance heights are spaced by a factor 13/7 ~ 1.857 in T.',
  },
  readingA_systematic: {
    assumption: 'relErr is a fixed fractional feature; z = relErr sqrt(n_w/2) grows as n_w^(1/2) ~ T^(1/4).',
    windowCountNeeded: nwSystematicNeeded, // ~1744
    heightForTwoSigma: heightSystematic, // ~5.38e6
    sourceCeiling: sourceCeilingSystematic, // ~7.0e6
    zeroSource: zeroSourceSystematic, // ~1.44e7 zeros -- within existing 10^12 datasets
    note: 'IF the imp-96493 deepest depth (relErr=0.06772) persisted, z would reach 2 at height ~5.38e6 -- a cheap ~1.4e7-zero source. This reading is DISFAVOURED by the data below.',
  },
  readingB_samplingNoise: {
    assumption: 'relErr shrinks with the sampling floor sqrt(2/n_w); z stays O(1); a clean 2-sigma is a one-sided tail event.',
    oneSidedTail2Sigma, // Phi(-2) ~ 0.022750
    reach50pct: {
      indepHeights: reach50.indepHeights, // ~30.1
      topHeight: reach50.topHeight, // ~1.88e13
      sourceCeiling: reach50.sourceCeiling, // ~2.44e13
      zeroSource: reach50.zeroSource, // ~1.09e14 zeros
    },
    reach90pct: {
      indepHeights: reach90.indepHeights, // ~100.1
      topHeight: reach90.topHeight, // ~1.19e32
      sourceCeiling: reach90.sourceCeiling, // ~1.55e32
      zeroSource: reach90.zeroSource, // ~1.76e33 zeros -- astronomically out of reach
    },
    note: 'A statistical hunt: ~30 independent unclipped heights for a 50% chance, ~100 for 90%. Each independent height spans a factor 13/7 in T, so the required contiguous source reaches top ordinate ~2.44e13 (50%) or ~1.55e32 (90%).',
  },
  whichReading: {
    measuredDepthRatio, // 0.4247 (0.06772/0.159457)
    samplingFloorRatio, // 0.7885 (sqrt(291/468))
    dataFavoursSamplingNoise, // true: depth shrank FASTER than the floor, so z fell -> noise, not systematic
    note: 'From T=1.5e5 to T=3.879e5 the measured depth shrank by 0.425 while the sampling floor shrank by only 0.789 -- the depth fell FASTER than the floor, so z decreased (1.9234 -> 1.0358). A systematic fixed-fractional excursion would have held relErr constant and z would have RISEN as T^(1/4); the data shows the opposite, favouring the sampling-noise reading (B).',
  },
  envelopePrediction: {
    predictsDeeperDipsAttainable: false,
    statement:
      'The GUE number-variance envelope fixes the EXPECTED ratio r ~ 1 (below saturation) with SYMMETRIC chi-square fluctuations; a below-envelope z >= 2 dip is a fixed ~2.28% one-sided tail at EACH independent height, neither favoured nor suppressed by going higher. The imp-96493 depths already shrink faster than the sampling floor, so the envelope predicts NO systematic deepening -- a clean 2-sigma is a rare tail hunt, not a feature of height.',
  },
  zeroSourceObstruction: {
    ptVerifiedHeight: T_PT_VERIFIED, // ~3.0001e12
    ptVerifiedZeroCount: N_PT_VERIFIED, // ~1.24e13
    source50pctOverPTfactor: sourceOverPTfactor, // ~8.1x higher than the verified ceiling
    highNLocalBlocksTooNarrow: true,
    statement:
      'A 50% search needs a CONTIGUOUS source reaching top ordinate ~2.44e13 (~1.09e14 zeros) -- ~8.1x higher than the Platt-Trudgian verified height ~3.0001e12 (~1.24e13 zeros). The Odlyzko high-zero datasets near the 10^21/10^22-nd zeros (heights ~1e21) are LOCAL blocks of ~10^9 consecutive zeros, each spanning a relative window far narrower than the +/-30% needed for even ONE unclipped interior tiling; they supply neither a decade ladder nor a single interior height. The required source does not exist.',
  },
  openSubGap: {
    id: 'imp-96510-systematic-vs-noise-dip-depth-scaling',
    statement:
      'Deciding reading (A) vs (B) rigorously -- whether the below-envelope dip depth relErr is a genuine systematic deviation (z ~ T^(1/4), 2-sigma cheap at ~5.4e6) or pure chi-square sampling noise (z O(1), 2-sigma needs ~2.44e13 contiguous ordinates) -- requires the relErr(T) scaling exponent measured across MORE than the two imp-96493 interior anchors (T=1.5e5, 3.879e5), fit against both the fixed-depth and sqrt(2/n_w) laws. The existing 10^6 set supplies too few independent unclipped heights (spacing 13/7) to fit the exponent, so the ~7-order-of-magnitude zero-source gap between the two readings stays open.',
    status: 'open', // named sub-gap: relErr(T) exponent unfit across >2 interior anchors
    dischargeRequirement:
      'Measure relErr(T) at 3+ independent unclipped interior heights (beyond the imp-96493 pair at T=1.5e5, 3.879e5) and fit against both the fixed-depth (A) and sqrt(2/n_w) (B) laws to pin the scaling exponent.',
  },
  verdict:
    'Realizing imp-96452 lever (b) -- a genuinely deeper interior dip ~1.93x below the imp-96493 deepest measured excursion (z=1.0358 at T=3.879e5) -- requires, under the SAMPLING-NOISE reading the existing data favours, a statistical hunt across ~30 independent unclipped heights (50% chance) or ~100 (90%): a CONTIGUOUS zero-source reaching top ordinate ~2.44e13 (~1.09e14 zeros, ~8.1x the Platt-Trudgian verified height ~3.0001e12) or ~1.55e32 respectively -- neither of which exists, and the Odlyzko 10^21/10^22 local blocks are far too narrow to supply even one unclipped interior tiling. The GUE number-variance envelope does NOT predict deeper dips become attainable at height: the depth is a fixed ~2.28% one-sided tail per independent height, and the imp-96493 measured depths already shrink FASTER than the sampling floor (0.425 vs 0.789 over T=1.5e5->3.879e5), arguing against a systematic excursion. Only under the data-disfavoured SYSTEMATIC reading would a deeper 2-sigma dip be cheap (height ~5.4e6, ~1.4e7 zeros); the ~7-order-of-magnitude gap between the two zero-source estimates IS the unresolved systematic-vs-noise question (SUB-GAP). Assessment/measurement only; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention).
export const IMP96510_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment/measurement only: whether the below-envelope '
  + 'dip depth is a genuine systematic (cheap, height ~5.4e6) or pure sampling noise (needs a ~2.44e13-ordinate '
  + 'contiguous source that does not exist, ~8.1x past the Platt-Trudgian verified height) is an OPEN sub-gap '
  + '(imp-96510-systematic-vs-noise-dip-depth-scaling) -- the ~7-order-of-magnitude spread between the two '
  + 'readings is unresolved, not decided in either direction; changes no bound.';

// --- self-executing internal-consistency assertions (formula re-derivation, generous tolerances) ---
(() => {
  const rel = (a, b) => Math.abs(a - b) / Math.abs(b); // relative error
  // independent-height spacing is 13/7
  if (rel(INDEP_SPACING, 13 / 7) > 1e-12) throw new Error('imp-96510: independent-height spacing not 13/7');
  // window-count law reproduces n_w = 291 at T = 1.5e5
  if (rel(windowCount(REF_T), 291.24, 1e-3) > 1e-3) throw new Error('imp-96510: n_w(1.5e5) drifted from 291');
  // imp-96493 deepen factor is ~1.93x
  if (!(deepenFactorNeeded > 1.9 && deepenFactorNeeded < 2.0)) throw new Error('imp-96510: deepen factor should be ~1.93x');
  // Phi(-2) one-sided tail ~ 0.02275
  if (rel(oneSidedTail2Sigma, 0.0227501) > 1e-3) throw new Error('imp-96510: Phi(-2) tail drifted from 0.02275');
  // reading (A) systematic: ~1744 windows, height ~5.4e6, source ~1.4e7 zeros
  if (rel(nwSystematicNeeded, 1744.4, 1e-2) > 1e-2) throw new Error('imp-96510: systematic n_w needed drifted');
  if (rel(heightSystematic, 5.38e6, 5e-2) > 5e-2) throw new Error('imp-96510: systematic height drifted from ~5.4e6');
  if (rel(zeroSourceSystematic, 1.44e7, 1e-1) > 1e-1) throw new Error('imp-96510: systematic zero-source drifted from ~1.4e7');
  // reading (B) sampling-noise: ~30 heights @50%, source ~2.44e13, ~1.09e14 zeros
  if (rel(reach50.indepHeights, 30.1, 1e-2) > 1e-2) throw new Error('imp-96510: 50% independent-height count drifted from ~30');
  if (rel(reach90.indepHeights, 100.1, 1e-2) > 1e-2) throw new Error('imp-96510: 90% independent-height count drifted from ~100');
  if (rel(reach50.sourceCeiling, 2.44e13, 5e-2) > 5e-2) throw new Error('imp-96510: 50% source ceiling drifted from ~2.44e13');
  if (rel(reach50.zeroSource, 1.09e14, 1e-1) > 1e-1) throw new Error('imp-96510: 50% zero-source drifted from ~1.09e14');
  // the two readings differ by ~7 orders of magnitude in the zero-source
  if (!(reach50.zeroSource / zeroSourceSystematic > 1e6)) throw new Error('imp-96510: the two readings should differ by >1e6 in zero-source');
  // the data favours the sampling-noise reading (depth shrank faster than the floor)
  if (!dataFavoursSamplingNoise) throw new Error('imp-96510: measured depth should shrink faster than the sampling floor');
  if (!(measuredDepthRatio < samplingFloorRatio)) throw new Error('imp-96510: depth ratio should be below the floor ratio');
  // the 50% source is ~8x the current verified ceiling
  if (!(sourceOverPTfactor > 5 && sourceOverPTfactor < 12)) throw new Error('imp-96510: 50% source over PT factor should be ~8x');
  // envelope predicts no deepening
  if (IMP96510_DEEPER_INTERIOR_DIP_HEIGHT_SOURCE_REACH.envelopePrediction.predictsDeeperDipsAttainable)
    throw new Error('imp-96510: envelope must NOT predict deeper dips attainable');
  // honesty gates
  if (!/NO QED/.test(IMP96510_DEEPER_INTERIOR_DIP_HEIGHT_SOURCE_REACH.verdict))
    throw new Error('imp-96510: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96510_DEEPER_INTERIOR_DIP_HEIGHT_SOURCE_REACH.verdict))
    throw new Error('imp-96510: verdict dropped the no-refereed-bound-change banner');
  if (!(/RH open/.test(IMP96510_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96510_HONEST_BANNER) && /NO QED/.test(IMP96510_HONEST_BANNER)))
    throw new Error('imp-96510: IMP96510_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96510_DEEPER_INTERIOR_DIP_HEIGHT_SOURCE_REACH;
