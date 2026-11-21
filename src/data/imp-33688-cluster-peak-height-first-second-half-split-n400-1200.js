/**
 * @module imp-33688-cluster-peak-height-first-second-half-split-n400-1200
 * @fileoverview imp-33688 -- SPLIT the imp-33660 sixteen band-clearing cluster-peak HEIGHTS into a
 *   first-half [400,800] vs second-half [800,1200] mean (partitioned at n = 800), MIRRORING the
 *   imp-33662 trough half-split (which found first ~40.0 marginally ABOVE second ~37.5, i.e. NOT
 *   rising), and MEASURE whether the peak-height mean RISES across the halves. The point is to isolate
 *   whether the imp-33660 weak-positive height trend is a genuine second-half tail RE-INTENSIFICATION
 *   of the baseline, or purely the TWO-OUTLIER artifact imp-33680 diagnosed via its leave-two-out refit.
 *
 *   WHAT imp-33660 / imp-33662 LEFT UNMEASURED
 *   ------------------------------------------
 *   imp-33662 ran a first-half/second-half split on the fifteen inter-cluster TROUGHS and found the
 *   first-half trough mean ~40.0 marginally ABOVE the second-half ~37.5 -- the between-cluster baseline
 *   does NOT rise. imp-33660 did NO analogous half-split on the sixteen PEAKS, despite basing its
 *   weak-positive verdict on the tail. imp-33680 then showed (leave-two-out) that the peak-height slope
 *   collapses ~9x when the two tallest imp-33638 tail clusters are dropped -- a TWO-POINT artifact. This
 *   module supplies the missing peak half-split: it imports the EXACT sixteen imp-33660 peak
 *   heights/rungs (no re-derivation drift), partitions them at n = 800, computes the two half-means and
 *   a Welch two-sample comparison, then RE-RUNS the split with the two tallest clusters removed and
 *   cross-reads the collapse against the imp-33680 slope-survival ratio.
 *
 *   THE MEASUREMENT (import-light; no zeros bundle, no re-scan)
 *   ----------------------------------------------------------
 *   From the frozen imp-33660 measured.peakNs / measured.peakHeights (sixteen band-clearing cluster
 *   peaks over [400,1200], heights ~[76.1,65.3,64.1,78.4,67.3,67.1 | 64.5,73.2,68.4,78.6,85.6,71.8,
 *   64.7,72.3,143.6,135.0] ULP), partition at n = 800:
 *     (FIRST)  the six peaks with n &lt; 800  (n ~ 526..754),
 *     (SECOND) the ten peaks with n &gt;= 800 (n ~ 807..1198, which contains the two tall tail clusters).
 *   Report each half-mean, its sample sd, a Welch t (unequal-variance) and Welch-Satterthwaite df, then
 *   drop the two tallest peaks from the SECOND half and recompute the half-mean and the split delta.
 *
 *   THE HEADLINE RESULT -- THE PEAK MEAN RISES, BUT THE RISE IS THE TWO-OUTLIER ARTIFACT
 *   -----------------------------------------------------------------------------------
 *   The first-half [400,800] peak mean is ~69.72 ULP; the second-half [800,1200] mean is ~85.77 ULP --
 *   a rise of ~+16.05 ULP. So, UNLIKE the imp-33662 troughs (which FELL, first ~40.0 &gt; second ~37.5),
 *   the peak-height mean RISES across the halves, matching the sign of the imp-33660 weak-positive trend.
 *   BUT the rise is NOT statistically resolved: the second half is dominated by the two tall imp-33638
 *   tail clusters (~143.6, ~135.0 ULP), so its sd blows up to ~29.0 vs ~6.0 in the first half, and the
 *   Welch t is only ~1.69 (df ~10.2) -- well below any two-sided significance. Decisively, when the two
 *   tallest clusters are removed the second-half mean drops to ~72.39 ULP and the split delta collapses
 *   from ~+16.05 to ~+2.67 ULP (an ~83% collapse, ~1/6 survival), with the Welch t falling to ~0.76.
 *   So once the two tallest tail clusters are accounted for the second half is NOT genuinely elevated:
 *   the apparent rise is the SAME two-outlier artifact imp-33680 found by leave-two-out slope collapse,
 *   not a genuine second-half baseline re-intensification.
 *
 *   VERDICT. SECOND-HALF-RISE-IS-THE-TWO-OUTLIER-ARTIFACT-NOT-A-BASELINE-REINTENSIFICATION. The sixteen
 *   band-clearing cluster-peak heights DO show a raw second-half rise (first-half [400,800] mean ~69.72
 *   ULP -&gt; second-half [800,1200] mean ~85.77 ULP, delta ~+16.05), the OPPOSITE sign to the imp-33662
 *   troughs which fell -- but the rise is Welch-insignificant (t ~1.69, df ~10.2) and COLLAPSES to
 *   ~+2.67 ULP (Welch t ~0.76) when the two tallest imp-33638 tail clusters (~135..144 ULP) are removed,
 *   cross-consistent with the imp-33680 leave-two-out slope collapse (~1/9 survival). The tail
 *   re-intensification is carried by two clusters, not a distributed second-half baseline lift.
 *   Consistent with the imp-33599 / imp-33621 / imp-33638 / imp-33660 latticeJitterCaveat.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It half-splits the sixteen
 *   imp-33660 cluster-peak heights and classifies the second-half rise as a two-outlier artifact; it
 *   changes NO bound, patches NO literal (imp-33660 / imp-33680 intact), and establishes NO operator
 *   positivity. floorUlp(n) is a JITTERY arithmetic-floor lattice property (imp-33249 / imp-33660 /
 *   imp-33680 latticeJitterCaveat): the exact per-rung ULP bounces and cross-platform libm exp/pow
 *   variation can shift the exact peak heights, and hence the ~69.72 / ~85.77 half-means, the ~+16.05
 *   split delta, and the ~1.69 / ~0.76 Welch t. The robust reading is the QUALITATIVE conclusion -- the
 *   raw second-half rise is real in sign but collapses when the two tallest clusters are removed, so it
 *   is a two-outlier artifact -- not the exact statistics. The NPHI = 10 Phi-series truncation is
 *   inherited upstream. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0
 *   sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED.
 *   No refereed bound is changed.
 *
 *   @see imp-33660-cluster-peak-envelope-height-growth-fit.js (the sixteen peaks this half-splits)
 *   @see imp-33662-inter-cluster-trough-floor-drift-n400-1200.js (the trough half-split this mirrors)
 *   @see imp-33680-cluster-peak-height-leave-two-out-refit.js (the leave-two-out collapse this cross-reads)
 *
 *   Ticket: imp-33688 (numerical, medium).
 */

import {
  IMP33660_CLUSTER_PEAK_ENVELOPE_HEIGHT_GROWTH_FIT,
} from './imp-33660-cluster-peak-envelope-height-growth-fit.js';
import {
  IMP33680_CLUSTER_PEAK_HEIGHT_LEAVE_TWO_OUT_REFIT,
} from './imp-33680-cluster-peak-height-leave-two-out-refit.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const SPLIT_N = 800; // the [400,800] vs [800,1200] partition rung

// -- The EXACT sixteen imp-33660 band-clearing cluster peaks (re-derivation-free; frozen import) ----
const FULL = IMP33660_CLUSTER_PEAK_ENVELOPE_HEIGHT_GROWTH_FIT.measured;
const peakNs = FULL.peakNs.slice();
const peakHeights = FULL.peakHeights.slice();

// -- Sample mean / (n-1) variance / sd helper -----------------------------------------------------
function stats(arr) {
  const n = arr.length;
  const mean = arr.reduce((a, b) => a + b, 0) / n;
  const sVar = n > 1 ? arr.reduce((a, b) => a + (b - mean) * (b - mean), 0) / (n - 1) : 0;
  return { n, mean, sVar, sd: Math.sqrt(sVar) };
}

// -- Welch two-sample t and Welch-Satterthwaite df (unequal-variance) -----------------------------
function welch(a, b) {
  const A = stats(a);
  const B = stats(b);
  const se = Math.sqrt(A.sVar / A.n + B.sVar / B.n);
  const t = se > 0 ? (B.mean - A.mean) / se : 0;
  const num = (A.sVar / A.n + B.sVar / B.n) * (A.sVar / A.n + B.sVar / B.n);
  const den =
    (A.sVar / A.n) * (A.sVar / A.n) / (A.n - 1) + (B.sVar / B.n) * (B.sVar / B.n) / (B.n - 1);
  const df = den > 0 ? num / den : 0;
  return { se, t, df };
}

// -- Partition the sixteen peaks at n = 800 -------------------------------------------------------
const firstHalf = [];
const secondHalf = [];
peakHeights.forEach((h, i) => {
  if (peakNs[i] < SPLIT_N) firstHalf.push(h);
  else secondHalf.push(h);
});
const firstStats = stats(firstHalf);
const secondStats = stats(secondHalf);
const splitDelta = secondStats.mean - firstStats.mean;      // +16.05: second half ABOVE first
const splitWelch = welch(firstHalf, secondHalf);

// -- Identify the two TALLEST peaks (the imp-33638 tail clusters) and drop them from the SECOND half -
const idxByHeightDesc = peakHeights
  .map((h, i) => ({ h, i }))
  .sort((a, b) => b.h - a.h)
  .map((o) => o.i);
const droppedIdx = [idxByHeightDesc[0], idxByHeightDesc[1]].sort((a, b) => a - b);
const droppedNs = droppedIdx.map((i) => peakNs[i]);
const droppedHeights = droppedIdx.map((i) => peakHeights[i]);

// -- Leave-two-out second half (the two tallest removed) and the collapsed split delta -------------
const secondHalfL2O = [];
peakHeights.forEach((h, i) => {
  if (peakNs[i] >= SPLIT_N && !droppedIdx.includes(i)) secondHalfL2O.push(h);
});
const secondL2OStats = stats(secondHalfL2O);
const splitDeltaL2O = secondL2OStats.mean - firstStats.mean;   // +2.67: the collapsed rise
const splitWelchL2O = welch(firstHalf, secondHalfL2O);
const deltaSurvivalRatio = splitDelta !== 0 ? splitDeltaL2O / splitDelta : 0; // ~0.17

// -- The imp-33680 leave-two-out cross-read (independent slope-collapse confirmation) --------------
const l2oSlopeSurvivalRatio = IMP33680_CLUSTER_PEAK_HEIGHT_LEAVE_TWO_OUT_REFIT.measured.slopeSurvivalRatio;
const l2oVerdict = IMP33680_CLUSTER_PEAK_HEIGHT_LEAVE_TWO_OUT_REFIT.measured.verdict;

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) The two halves are populated off the sixteen imp-33660 peaks (six below n=800, ten at/above).
const halvesPopulated = firstHalf.length >= 5 && secondHalf.length >= 8 && peakHeights.length >= 15;
// (2) The RAW peak-height mean RISES across the halves (second-half mean above first) -- the OPPOSITE
//     of the imp-33662 troughs, which fell (first ~40.0 above second ~37.5).
const peakMeanRises = splitDelta > 0 && secondStats.mean > firstStats.mean;
// (3) The raw rise is NOT statistically resolved (Welch |t| below a two-sided ~0.05 threshold ~2.2).
const rawRiseNotSignificant = Math.abs(splitWelch.t) < 2.2;
// (4) The two tallest clusters sit in the SECOND half (n >= 800) and are deep-tail (> 100 ULP).
const tallClustersInSecondHalf =
  droppedNs.every((n) => n >= SPLIT_N) && droppedHeights.every((h) => h > 100);
// (5) THE HEADLINE: removing the two tallest COLLAPSES the split rise -- the surviving delta is under a
//     third of the raw delta and the collapsed Welch t drops below the raw t.
const riseCollapsesOnLeaveTwoOut =
  deltaSurvivalRatio < 0.33 && Math.abs(splitWelchL2O.t) < Math.abs(splitWelch.t);
// (6) CROSS-READ: the imp-33680 leave-two-out slope also collapsed (survival < 1/3) to the same
//     TWO-POINT-ARTIFACT verdict, so both the half-split and the slope refit agree.
const crossReadsLeaveTwoOut =
  l2oSlopeSurvivalRatio < 0.33 && /TWO-POINT-ARTIFACT/.test(l2oVerdict);
// (7) THE HEADLINE: the second-half rise is the two-outlier artifact, not a baseline re-intensification.
const riseIsTwoOutlierArtifact =
  peakMeanRises && rawRiseNotSignificant && riseCollapsesOnLeaveTwoOut && crossReadsLeaveTwoOut;

const verdict =
  halvesPopulated && peakMeanRises && rawRiseNotSignificant && tallClustersInSecondHalf &&
  riseCollapsesOnLeaveTwoOut && crossReadsLeaveTwoOut && riseIsTwoOutlierArtifact
    ? 'SECOND-HALF-RISE-IS-THE-TWO-OUTLIER-ARTIFACT-NOT-A-BASELINE-REINTENSIFICATION.-SPLITTING-THE-SIXTEEN-' +
      'imp-33660-BAND-CLEARING-CLUSTER-PEAK-HEIGHTS-AT-n=800-(SIX-PEAKS-n~526..754-VS-TEN-PEAKS-n~807..1198)-' +
      'GIVES-A-RAW-SECOND-HALF-RISE-(FIRST-HALF-[400,800]-MEAN~69.72-ULP-->SECOND-HALF-[800,1200]-MEAN~85.77-' +
      'ULP,-DELTA~+16.05),-THE-OPPOSITE-SIGN-TO-THE-imp-33662-TROUGHS-WHICH-FELL-(FIRST~40.0-ABOVE-SECOND~37.5);-' +
      'BUT-THE-RISE-IS-WELCH-INSIGNIFICANT-(t~1.69,-df~10.2,-SECOND-HALF-sd~29.0-VS~6.0-FIRST)-AND-COLLAPSES-TO-' +
      'DELTA~+2.67-ULP-(WELCH-t~0.76,-~1/6-SURVIVAL)-WHEN-THE-TWO-TALLEST-imp-33638-TAIL-CLUSTERS-(~143.6-n~1126,-' +
      '~135.0-n~1198)-ARE-REMOVED,-CROSS-CONSISTENT-WITH-THE-imp-33680-LEAVE-TWO-OUT-SLOPE-COLLAPSE-(~1/9-SURVIVAL).-' +
      'THE-TAIL-RE-INTENSIFICATION-IS-CARRIED-BY-TWO-CLUSTERS,-NOT-A-DISTRIBUTED-SECOND-HALF-BASELINE-LIFT.-' +
      'ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-JITTERY-LATTICE-FLOOR;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-' +
      'imp-3066-UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33688_CLUSTER_PEAK_HEIGHT_FIRST_SECOND_HALF_SPLIT = Object.freeze({
  id: 'imp-33688-cluster-peak-height-first-second-half-split-n400-1200',
  ticket: 'imp-33688',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33660-cluster-peak-envelope-height-growth-fit.js',
  crossValidatesModules: [
    'imp-33660-cluster-peak-envelope-height-growth-fit.js',
    'imp-33662-inter-cluster-trough-floor-drift-n400-1200.js',
    'imp-33680-cluster-peak-height-leave-two-out-refit.js',
  ],

  summary:
    'SPLITS the imp-33660 sixteen band-clearing cluster-peak HEIGHTS into a first-half [400,800] vs ' +
    'second-half [800,1200] mean (partitioned at n=800), MIRRORING the imp-33662 trough half-split, and ' +
    'measures whether the peak mean RISES. RESULT: the raw peak-height mean DOES rise (first-half mean ' +
    '~69.72 ULP -> second-half mean ~85.77 ULP, delta ~+16.05) -- the OPPOSITE sign to the imp-33662 ' +
    'troughs which fell (first ~40.0 above second ~37.5) -- but the rise is Welch-insignificant (t ~1.69, ' +
    'df ~10.2; second-half sd ~29.0 vs ~6.0 first) and COLLAPSES to delta ~+2.67 ULP (Welch t ~0.76) when ' +
    'the two tallest imp-33638 tail clusters (~143.6 n~1126, ~135.0 n~1198) are removed, cross-consistent ' +
    'with the imp-33680 leave-two-out slope collapse (~1/9 survival). VERDICT: ' +
    'SECOND-HALF-RISE-IS-THE-TWO-OUTLIER-ARTIFACT-NOT-A-BASELINE-REINTENSIFICATION. ' +
    'ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; jittery lattice floor; ' +
    'operator positivity (imp-3066) untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    source: 'the EXACT sixteen imp-33660 measured.peakNs / measured.peakHeights (frozen import, no re-scan, no drift)',
    partition: 'split at n=800: FIRST half = peaks with n<800 (six, n~526..754), SECOND half = peaks with n>=800 (ten, n~807..1198)',
    halfMeans: 'each half mean and its (n-1) sample sd',
    welch: 'Welch unequal-variance t = (secondMean - firstMean)/sqrt(s1^2/n1 + s2^2/n2), with Welch-Satterthwaite df',
    leaveTwoOut: 'drop the two tallest peaks from the SECOND half, recompute the second-half mean and the split delta',
    crossRead: 'compare the split-delta collapse against the imp-33680 leave-two-out slope-survival ratio and TWO-POINT-ARTIFACT verdict',
    mirrors: 'the imp-33662 trough half-split (which found first ~40.0 marginally ABOVE second ~37.5, NOT rising)',
    selfComputing: 'the partition, both half-means, both Welch tests, the leave-two-out collapse, and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    splitN: SPLIT_N,
    peakNs: Object.freeze(peakNs.slice()),
    peakHeights: Object.freeze(peakHeights.slice()),
    // -- first half [400,800] --
    firstHalfCount: firstStats.n,
    firstHalfMean: firstStats.mean,
    firstHalfSd: firstStats.sd,
    // -- second half [800,1200] (full) --
    secondHalfCount: secondStats.n,
    secondHalfMean: secondStats.mean,
    secondHalfSd: secondStats.sd,
    // -- raw split --
    splitDelta,
    splitWelchT: splitWelch.t,
    splitWelchDf: splitWelch.df,
    // -- the two tallest tail clusters dropped from the second half --
    droppedNs: Object.freeze(droppedNs.slice()),
    droppedHeights: Object.freeze(droppedHeights.slice()),
    // -- leave-two-out second half --
    secondHalfL2OCount: secondL2OStats.n,
    secondHalfL2OMean: secondL2OStats.mean,
    splitDeltaL2O,
    splitWelchTL2O: splitWelchL2O.t,
    deltaSurvivalRatio,
    // -- imp-33680 cross-read --
    l2oSlopeSurvivalRatio,
    l2oVerdict,
    // -- verdict flags --
    halvesPopulated,
    peakMeanRises,
    rawRiseNotSignificant,
    tallClustersInSecondHalf,
    riseCollapsesOnLeaveTwoOut,
    crossReadsLeaveTwoOut,
    riseIsTwoOutlierArtifact,
    verdict,
  }),

  interpretation: Object.freeze({
    peakMeanRisesRaw:
      'The raw first-half [400,800] peak mean ~69.72 ULP (six peaks n~526..754) sits below the second-half ' +
      '[800,1200] mean ~85.77 ULP (ten peaks n~807..1198), a rise of ~+16.05 ULP. This is the OPPOSITE sign ' +
      'to the imp-33662 troughs, whose first-half mean ~40.0 was marginally ABOVE the second-half ~37.5, so ' +
      'the peak envelope and the between-cluster floor move in opposite directions across the split.',
    riseNotResolved:
      'The rise is not statistically resolved: the second half is dominated by the two tall imp-33638 tail ' +
      'clusters (~143.6, ~135.0 ULP), so its sample sd blows up to ~29.0 vs ~6.0 in the first half, and the ' +
      'Welch t is only ~1.69 (df ~10.2) -- below any two-sided ~0.05 threshold. The raw rise is a sign, not a ' +
      'significant lift.',
    riseCollapsesOnLeaveTwoOut:
      'Removing the two tallest tail clusters from the second half drops its mean to ~72.39 ULP and collapses ' +
      'the split delta from ~+16.05 to ~+2.67 ULP (~1/6 survival), with the Welch t falling to ~0.76. So once ' +
      'the two tallest clusters are accounted for, the second half is NOT genuinely elevated over the first.',
    crossReadsLeaveTwoOut:
      'The half-split collapse is cross-consistent with imp-33680: its leave-two-out refit collapsed the ' +
      'imp-33660 height slope ~9x (survival ~1/9) to the SLOPE-COLLAPSES-TREND-IS-A-TWO-POINT-ARTIFACT verdict. ' +
      'Both the slope refit and this half-split independently attribute the trend to the same two clusters.',
    verdictTwoOutlierArtifact:
      'VERDICT: SECOND-HALF-RISE-IS-THE-TWO-OUTLIER-ARTIFACT-NOT-A-BASELINE-REINTENSIFICATION. The peak-height ' +
      'mean rises in sign across the halves (unlike the falling troughs), but the rise is Welch-insignificant ' +
      'and collapses when the two tallest imp-33638 tail clusters are removed, so it is a two-outlier artifact ' +
      'of the tail re-intensification, not a distributed second-half baseline lift.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Half-splits the sixteen imp-33660 band-clearing cluster-peak HEIGHTS at n=800, computes both half-means, ' +
      'a Welch comparison, and a leave-two-out collapse, and classifies the second-half rise as a two-outlier ' +
      'artifact. It changes NO bound, patches NO literal (imp-33660 / imp-33680 intact), and establishes NO ' +
      'operator positivity. Grid-design measurement only.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33660 / imp-33638 / imp-33621 / imp-33599; this ' +
      'half-splits the height of the located cluster peaks, not that truncation.',
    latticeJitterCaveat:
      'floorUlp(n) is a jittery arithmetic-floor lattice property (imp-33249 / imp-33660 / imp-33680): the exact ' +
      'per-rung ULP bounces and cross-platform libm exp/pow variation can shift the exact peak heights, and hence ' +
      'the ~69.72 / ~85.77 half-means, the ~+16.05 split delta, and the ~1.69 / ~0.76 Welch t. The robust reading ' +
      'is the QUALITATIVE conclusion -- the raw second-half rise is real in sign but collapses when the two ' +
      'tallest clusters are removed, so it is a two-outlier artifact -- not the exact statistics.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33688_CLUSTER_PEAK_HEIGHT_FIRST_SECOND_HALF_SPLIT_ASSERTIONS = [
  {
    id: 'imp33688-halves-populated',
    why: 'The n=800 partition must populate both halves off the sixteen imp-33660 peaks (>= 5 below n=800, ' +
         '>= 8 at/above), so the half-split runs on the full sample.',
    holds: () => halvesPopulated && firstHalf.length >= 5 && secondHalf.length >= 8,
  },
  {
    id: 'imp33688-peak-mean-rises',
    why: 'The RAW peak-height mean must RISE across the halves (second-half mean above first) -- the opposite ' +
         'sign to the imp-33662 troughs, which fell.',
    holds: () => peakMeanRises && secondStats.mean > firstStats.mean && splitDelta > 0,
  },
  {
    id: 'imp33688-raw-rise-not-significant',
    why: 'The raw rise must NOT be statistically resolved: the Welch |t| must sit below a two-sided ~0.05 ' +
         'threshold (~2.2), i.e. it is a sign not a significant lift.',
    holds: () => rawRiseNotSignificant && Math.abs(splitWelch.t) < 2.2,
  },
  {
    id: 'imp33688-tall-clusters-in-second-half',
    why: 'The two tallest peaks must sit in the SECOND half (n >= 800) and be deep-tail (> 100 ULP) -- the ' +
         'imp-33638 tail clusters that could inflate the second-half mean.',
    holds: () => tallClustersInSecondHalf && droppedNs.every((n) => n >= SPLIT_N),
  },
  {
    id: 'imp33688-rise-collapses-on-leave-two-out',
    why: 'THE HEADLINE: removing the two tallest tail clusters must collapse the split delta to under a third ' +
         'of the raw delta, and the collapsed Welch |t| must drop below the raw |t|.',
    holds: () =>
      riseCollapsesOnLeaveTwoOut &&
      deltaSurvivalRatio < 0.33 &&
      Math.abs(splitWelchL2O.t) < Math.abs(splitWelch.t),
  },
  {
    id: 'imp33688-cross-reads-leave-two-out',
    why: 'The half-split collapse must cross-read the imp-33680 leave-two-out slope collapse (survival < 1/3) ' +
         'and its TWO-POINT-ARTIFACT verdict, so both diagnostics agree.',
    holds: () => crossReadsLeaveTwoOut && l2oSlopeSurvivalRatio < 0.33,
  },
  {
    id: 'imp33688-rise-is-two-outlier-artifact',
    why: 'THE HEADLINE: the second-half rise is a two-outlier artifact -- it rises in sign, is Welch-insignificant, ' +
         'collapses on leave-two-out, and cross-reads the imp-33680 slope collapse.',
    holds: () => riseIsTwoOutlierArtifact,
  },
  {
    id: 'imp33688-verdict-records-two-outlier-artifact',
    why: 'The classified verdict must record the SECOND-HALF-RISE-IS-THE-TWO-OUTLIER-ARTIFACT reading, not ' +
         'indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33688-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33688_CLUSTER_PEAK_HEIGHT_FIRST_SECOND_HALF_SPLIT.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33688_CLUSTER_PEAK_HEIGHT_FIRST_SECOND_HALF_SPLIT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33688-cluster-peak-height-first-second-half-split assertion failed: ${assertion.id}`);
  }
}
