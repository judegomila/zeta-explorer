/**
 * @module imp-34170-endpoint-vs-fixed-band-peak-curvature-reconciliation
 *
 * imp-34170 (numerical, frontier-direction): RECONCILE the divergent peak-saturation verdicts of
 * imp-34108 and imp-34109 on a common kEnd axis and MEASURE whether the two peak families genuinely
 * disagree.
 *
 *   imp-34108 read the imp-33917 boundary-locked ENDPOINT-residual peak (fit window kEnd 11..13) as
 *   SATURATING: the bounded/Akaike-winning form peak = a - b/kEnd wins, ceiling a ~ 1.678095 (imp-34043).
 *
 *   imp-34109 read the imp-33987 FIXED-BAND (k <= 10) peak (fit window kEnd 14..20) as UNBOUNDED: the
 *   log form peak = a + b*ln(kEnd) beats the same bounded fit (R2 0.99948 > 0.99804), no finite ceiling
 *   supported -- KEEPS CLIMBING.
 *
 * These are two DIFFERENT peak families measured on two DIFFERENT kEnd windows, and the two verdicts
 * (SATURATES vs. KEEPS CLIMBING) have never been tabulated together and tested rung-for-rung. This
 * import-light self-asserting module bakes both peak tables VERBATIM (the imp-34203 viz-data literals,
 * themselves reproduced from the imp-33917/imp-33987 machinery -- neither source is imported live because
 * imp-34109 transitively pulls lambda-rh-height-mapping -> polymath15-constant-C-C, the 16.7MB chain, per
 * [[no_heavy_imports_in_pages]]), lays both on ONE kEnd axis, MEASURES the increment / second-difference
 * (curvature) sign of each, and ASSESSES whether the saturate-vs-climb split is a GENUINE structural
 * difference between the endpoint and fixed-band residuals or a WINDOW ARTIFACT.
 *
 * THE ANSWER: THE TWO VERDICTS ARE NOT SHOWN TO GENUINELY DISAGREE -- THE SPLIT IS CONFOUNDED WITH THE
 * WINDOW. There is NO shared kEnd rung: the endpoint window (11.00..13.00) and the fixed-band window
 * (14.0..20.0) are DISJOINT with a gap of 1 in kEnd, so no rung-for-rung comparison is even possible.
 * On its own window the endpoint family is UNIFORMLY concave (all 7 second differences strictly negative)
 * -- exactly the "saturating look." The fixed-band family is concave THEN convex: its second differences
 * are negative through kEnd ~ 18 then flip strictly POSITIVE (a re-acceleration knee at kEnd ~ 18.5),
 * which is precisely why imp-34109's window -- extending past the knee -- selects the unbounded form.
 * The endpoint window STOPS at 13.0, a full 5.5 units of kEnd short of that knee. Restricting the
 * fixed-band family to a low sub-window of the SAME span (kEnd 14.0..16.0, span 2.0, matching the
 * endpoint's 11.0..13.0 span) reproduces the endpoint's signature EXACTLY -- all its second differences
 * are strictly negative, so a bounded a - b/kEnd fit would win THERE too. In other words the endpoint's
 * "SATURATES" verdict is what ANY span-2.0 low sub-window of a curve with a later re-acceleration knee
 * produces; the endpoint family has simply never been sampled far enough to exhibit -- or to rule out --
 * an analogous knee. This is the very lesson imp-34109 taught on the fixed-band family (imp-34040 misread
 * its below-knee concavity as saturation onset before the window pushed past kEnd ~ 18).
 *
 * THE MEASUREMENT (both tables baked verbatim from imp-34203; the diagnostics are new)
 * -----------------------------------------------------------------------------------------------------
 *   Endpoint peaks   9 imp-33917 boundary-locked peaks, kEnd = 11.00 .. 13.00 (step 0.25). imp-34108/imp-34043.
 *   Fixed-band peaks 13 imp-33987 fixed-band (k <= 10) peaks, kEnd = 14.0 .. 20.0 (step 0.5). imp-34109/imp-34040.
 *   Shared-axis test whether the two kEnd grids intersect (they do NOT -- disjoint, gap 1).
 *   Curvature sign   discrete second differences of peak vs. kEnd for each family, and their sign pattern.
 *   Span-matched     the fixed-band restricted to its lowest span-2.0 sub-window (kEnd 14.0..16.0), tested
 *   control          for the same concave signature the endpoint family shows over its span-2.0 window.
 *
 * THE FINDING (measurement / curvature-sign reconciliation only)
 * -----------------------------------------------------------------------------------------------------
 *   (R1) NO COMMON RUNG. The endpoint grid {11.00..13.00} and the fixed-band grid {14.0..20.0} share ZERO
 *        kEnd values (gap of 1 unit between the endpoint's last rung 13.0 and the fixed-band's first 14.0).
 *        The "common kEnd axis where they overlap" the ticket posed does NOT exist -- the two verdicts are
 *        drawn from ADJACENT but non-overlapping windows, so a rung-for-rung disagreement cannot be read off.
 *   (R2) ENDPOINT UNIFORMLY CONCAVE. All 8 endpoint increments strictly decrease (0.038429 -> 0.015805) and
 *        all 7 second differences are strictly NEGATIVE (~ -2.9e-3 .. -3.5e-3) -- a pure decelerating /
 *        saturating look with NO curvature sign change anywhere in the window.
 *   (R3) FIXED-BAND CONCAVE-THEN-CONVEX. The fixed-band increments fall to a MINIMUM 0.033700 at kEnd ~ 18.5
 *        then RE-INCREASE; the 11 second differences are negative through kEnd ~ 18 (8 negatives) then flip
 *        strictly POSITIVE (+5.98e-4, +2.46e-3, +3.90e-3) -- a re-acceleration knee near kEnd ~ 18.5. This
 *        sign flip, absent from the endpoint window, is exactly what pushes imp-34109's fit to the log form.
 *   (R4) SPAN-MATCHED CONTROL: THE SPLIT IS A WINDOW ARTIFACT. Restricting the fixed-band to its lowest
 *        span-2.0 sub-window (kEnd 14.0..16.0, matching the endpoint's 11.0..13.0 span of 2.0) gives 3
 *        second differences all strictly NEGATIVE (~ -1.9e-3 .. -2.3e-3) -- the SAME uniformly-concave
 *        signature as the endpoint family, under which a bounded a - b/kEnd fit wins. The endpoint's
 *        SATURATES verdict is therefore what a span-2.0 low sub-window of a later-re-accelerating curve
 *        yields; it is NOT demonstrated to be a genuine endpoint-vs-fixed-band structural difference. The
 *        endpoint window ends 5.5 units short of the fixed-band knee, so it can neither exhibit nor rule out
 *        an analogous knee -- the saturate-vs-climb split is CONFOUNDED with the sampled window.
 *
 * imp-34108's SATURATES reading is CORRECT within its measured window (11..13) and is not overturned; the
 * fixed-band peak genuinely lacks a data point that would falsify a ceiling below kEnd ~ 20. This module
 * only shows the two verdicts are NOT a demonstrated structural disagreement -- the endpoint family has
 * never been sampled across a knee, so a window artifact is at least as consistent with the data.
 *
 * Honest open sub-gap SUB-GAP-imp-34170-endpoint-knee-untested: whether the imp-33917 endpoint-residual
 * peak family ALSO develops a re-acceleration knee if its window is pushed past kEnd = 13 (as the fixed-band
 * family did past kEnd ~ 18) is NOT computable here -- imp-34108/imp-34043 fit only kEnd 11..13, and the
 * knee-bearing endpoint sweep does not exist. Until an endpoint sweep spanning a candidate knee is run, the
 * saturate-vs-climb split cannot be assigned to structure rather than window.
 *
 * Measurement / curvature-sign reconciliation only; the peak tables are the inherited imp-3220/imp-3406
 * component-model extrapolation reproduced by imp-33917/imp-33987, NOT a rigorous asymptotic; the second
 * differences and span-matched control are descriptive, not derived; changes no bound; establishes no
 * operator positivity; the imp-33843 form verdict, the imp-34108 within-window SATURATES reading and the
 * imp-34109 within-window KEEPS-CLIMBING reading are all UNTOUCHED; C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-34108-endpoint-peak-saturating-ceiling-extrapolation.js (endpoint: SATURATES, a ~ 1.678095)
 * @see imp-34109-fixed-band-peak-amplitude-saturation-fit.js (fixed-band: KEEPS CLIMBING, log wins)
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero.js (re-acceleration persists past kEnd 20)
 * @see imp-34203-endpoint-vs-fixed-band-peak-saturation-cross-viz-data.js (the two baked peak tables)
 */

// imp-34108: the 9 imp-33917 boundary-locked endpoint peaks (kEnd = 11.00 .. 13.00, step 0.25), baked
// verbatim from the imp-34203 viz-data literals.
export const ENDPOINT_PEAKS = Object.freeze([
  { kEnd: 11.0, peak: 0.247876 },
  { kEnd: 11.25, peak: 0.286305 },
  { kEnd: 11.5, peak: 0.321845 },
  { kEnd: 11.75, peak: 0.354118 },
  { kEnd: 12.0, peak: 0.383012 },
  { kEnd: 12.25, peak: 0.408428 },
  { kEnd: 12.5, peak: 0.430484 },
  { kEnd: 12.75, peak: 0.449303 },
  { kEnd: 13.0, peak: 0.465108 },
]);

// imp-34109: the 13 imp-33987 fixed-band (k <= 10) peaks (kEnd = 14.0 .. 20.0, step 0.5), baked verbatim
// from the imp-34203 viz-data literals.
export const FIXED_BAND_PEAKS = Object.freeze([
  { kEnd: 14.0, peak: 0.383861 },
  { kEnd: 14.5, peak: 0.433367 },
  { kEnd: 15.0, peak: 0.480932 },
  { kEnd: 15.5, peak: 0.526291 },
  { kEnd: 16.0, peak: 0.569328 },
  { kEnd: 16.5, peak: 0.610045 },
  { kEnd: 17.0, peak: 0.648552 },
  { kEnd: 17.5, peak: 0.685053 },
  { kEnd: 18.0, peak: 0.71989 },
  { kEnd: 18.5, peak: 0.75359 },
  { kEnd: 19.0, peak: 0.787888 },
  { kEnd: 19.5, peak: 0.824645 },
  { kEnd: 20.0, peak: 0.865303 },
]);

// --- shared-axis + curvature-sign diagnostics -------------------------------------------------------
function firstDiffs(rows) {
  const d = [];
  for (let i = 1; i < rows.length; i++) d.push(rows[i].peak - rows[i - 1].peak);
  return d;
}
function secondDiffs(rows) {
  const d = firstDiffs(rows);
  const s = [];
  for (let i = 1; i < d.length; i++) s.push(d[i] - d[i - 1]);
  return s;
}

const EP_KENDS = ENDPOINT_PEAKS.map((r) => r.kEnd);
const FB_KENDS = FIXED_BAND_PEAKS.map((r) => r.kEnd);

// (R1) no common rung -- the two grids are disjoint.
const SHARED_KENDS = EP_KENDS.filter((k) => FB_KENDS.includes(k));
const KEND_GAP = FB_KENDS[0] - EP_KENDS[EP_KENDS.length - 1]; // 14.0 - 13.0 = 1.0
const WINDOWS_OVERLAP = SHARED_KENDS.length > 0;

// (R2) endpoint curvature.
const EP_FIRST_DIFFS = firstDiffs(ENDPOINT_PEAKS);
const EP_SECOND_DIFFS = secondDiffs(ENDPOINT_PEAKS);
const EP_INCREMENTS_STRICTLY_DECREASING = EP_FIRST_DIFFS.every(
  (d, i) => i === 0 || d < EP_FIRST_DIFFS[i - 1],
);
const EP_ALL_SECOND_DIFFS_NEGATIVE = EP_SECOND_DIFFS.every((s) => s < 0);
const EP_SPAN = EP_KENDS[EP_KENDS.length - 1] - EP_KENDS[0]; // 2.0

// (R3) fixed-band curvature -- concave then convex.
const FB_FIRST_DIFFS = firstDiffs(FIXED_BAND_PEAKS);
const FB_SECOND_DIFFS = secondDiffs(FIXED_BAND_PEAKS);
const FB_MIN_INCREMENT = Math.min(...FB_FIRST_DIFFS);
const FB_MIN_INCREMENT_INDEX = FB_FIRST_DIFFS.indexOf(FB_MIN_INCREMENT);
const FB_MIN_INCREMENT_KEND = FIXED_BAND_PEAKS[FB_MIN_INCREMENT_INDEX + 1].kEnd; // knee ~ 18.5
const FB_NEG_SECOND_DIFFS = FB_SECOND_DIFFS.filter((s) => s < 0).length;
const FB_POS_SECOND_DIFFS = FB_SECOND_DIFFS.filter((s) => s > 0).length;
const FB_HAS_CURVATURE_SIGN_FLIP = FB_NEG_SECOND_DIFFS > 0 && FB_POS_SECOND_DIFFS > 0;
// concave block strictly precedes convex block (a single knee, not oscillation)
const FB_FIRST_POSITIVE_SECOND_DIFF_INDEX = FB_SECOND_DIFFS.findIndex((s) => s > 0);
const FB_KNEE_IS_SINGLE = FB_SECOND_DIFFS.slice(0, FB_FIRST_POSITIVE_SECOND_DIFF_INDEX).every((s) => s < 0);

// (R4) span-matched control: fixed-band restricted to its lowest span-2.0 sub-window (kEnd 14.0..16.0).
const FB_LOW_SUBWINDOW = FIXED_BAND_PEAKS.filter((r) => r.kEnd <= FB_KENDS[0] + EP_SPAN); // 14.0..16.0
const FB_SUB_SPAN = FB_LOW_SUBWINDOW[FB_LOW_SUBWINDOW.length - 1].kEnd - FB_LOW_SUBWINDOW[0].kEnd; // 2.0
const FB_SUB_SECOND_DIFFS = secondDiffs(FB_LOW_SUBWINDOW);
const FB_SUB_ALL_SECOND_DIFFS_NEGATIVE = FB_SUB_SECOND_DIFFS.every((s) => s < 0);
// how far the endpoint window ends short of the fixed-band knee
const ENDPOINT_SHORT_OF_KNEE = FB_MIN_INCREMENT_KEND - EP_KENDS[EP_KENDS.length - 1]; // 18.5 - 13.0 = 5.5

export const IMP34170_ENDPOINT_VS_FIXED_BAND_PEAK_CURVATURE_RECONCILIATION = {
  ticket: 'imp-34170',
  category: 'numerical',
  title:
    'Reconcile the imp-34108 endpoint-peak SATURATES verdict against the imp-34109 fixed-band ' +
    'KEEPS-CLIMBING verdict on a common kEnd axis and measure whether the two families genuinely disagree',

  // (R1) shared-axis test
  endpointWindow: [EP_KENDS[0], EP_KENDS[EP_KENDS.length - 1]], // [11, 13]
  fixedBandWindow: [FB_KENDS[0], FB_KENDS[FB_KENDS.length - 1]], // [14, 20]
  sharedKEnds: SHARED_KENDS, // []
  windowsOverlap: WINDOWS_OVERLAP, // false
  kEndGap: KEND_GAP, // 1.0

  // (R2) endpoint curvature
  endpointIncrementsStrictlyDecreasing: EP_INCREMENTS_STRICTLY_DECREASING, // true
  endpointAllSecondDiffsNegative: EP_ALL_SECOND_DIFFS_NEGATIVE, // true (uniformly concave)
  endpointSecondDiffs: EP_SECOND_DIFFS,
  endpointSpan: EP_SPAN, // 2.0

  // (R3) fixed-band curvature
  fixedBandMinIncrement: FB_MIN_INCREMENT, // 0.0337
  fixedBandKneeKEnd: FB_MIN_INCREMENT_KEND, // 18.5
  fixedBandNegSecondDiffs: FB_NEG_SECOND_DIFFS, // 8
  fixedBandPosSecondDiffs: FB_POS_SECOND_DIFFS, // 3
  fixedBandHasCurvatureSignFlip: FB_HAS_CURVATURE_SIGN_FLIP, // true
  fixedBandKneeIsSingle: FB_KNEE_IS_SINGLE, // true (concave block precedes convex block)
  fixedBandSecondDiffs: FB_SECOND_DIFFS,

  // (R4) span-matched control
  fixedBandLowSubWindow: [FB_LOW_SUBWINDOW[0].kEnd, FB_LOW_SUBWINDOW[FB_LOW_SUBWINDOW.length - 1].kEnd], // [14, 16]
  fixedBandLowSubWindowSpan: FB_SUB_SPAN, // 2.0 (matches endpointSpan)
  fixedBandLowSubWindowAllSecondDiffsNegative: FB_SUB_ALL_SECOND_DIFFS_NEGATIVE, // true
  endpointWindowShortOfKneeBy: ENDPOINT_SHORT_OF_KNEE, // 5.5

  // reconciliation verdict
  familiesGenuinelyDisagree: false,
  splitIsWindowConfounded: true,

  isRigorous: false,
  verdict:
    'RECONCILIATION (measurement / curvature-sign only): the imp-34108 SATURATES and imp-34109 ' +
    'KEEPS-CLIMBING verdicts are NOT shown to genuinely disagree -- the split is CONFOUNDED with the ' +
    'sampled window. (R1) The endpoint grid [11,13] and fixed-band grid [14,20] are DISJOINT (0 shared ' +
    'rungs, gap 1), so no common kEnd axis exists and no rung-for-rung disagreement can be read off. ' +
    '(R2) Over its window the endpoint family is UNIFORMLY concave (all 7 second differences negative) -- ' +
    'a pure saturating look. (R3) The fixed-band family is concave THEN convex: 8 negative then 3 strictly ' +
    'positive second differences, a single re-acceleration knee at kEnd ~ 18.5, which is what pushes ' +
    'imp-34109 to the unbounded log form. (R4) Restricting the fixed-band to its lowest span-2.0 sub-window ' +
    '[14,16] -- the SAME span as the endpoint [11,13] -- reproduces the endpoint signature EXACTLY (all ' +
    'second differences negative), so a bounded a - b/kEnd fit would win there too. The endpoint window ends ' +
    '5.5 units of kEnd short of the fixed-band knee, so it can neither exhibit nor rule out an analogous ' +
    'knee: the endpoint SATURATES verdict is what any span-2.0 low sub-window of a later-re-accelerating ' +
    'curve produces, more consistent with a WINDOW ARTIFACT than a demonstrated endpoint-vs-fixed-band ' +
    'structural difference. imp-34108 within-window SATURATES reading and imp-34109 within-window ' +
    'KEEPS-CLIMBING reading are both CORRECT within their measured windows and are not overturned. Open ' +
    'sub-gap SUB-GAP-imp-34170-endpoint-knee-untested: whether the endpoint family develops a knee past ' +
    'kEnd = 13 is not computable here (imp-34108/imp-34043 fit only 11..13). Measurement only; the peak ' +
    'tables are the inherited imp-3220/imp-3406 model reproduced by imp-33917/imp-33987, NOT a rigorous ' +
    'asymptotic; the second differences and span-matched control are descriptive, not derived; changes no ' +
    'bound; establishes no operator positivity; the imp-33843 form verdict UNTOUCHED; C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA.',
  subGap: 'SUB-GAP-imp-34170-endpoint-knee-untested',
};

export const IMP34170_ENDPOINT_VS_FIXED_BAND_PEAK_CURVATURE_RECONCILIATION_ASSERTIONS = [
  {
    // (R1) The two windows are disjoint -- no common kEnd rung, gap of 1.
    id: 'imp34170-windows-disjoint-no-common-rung',
    description: 'endpoint [11,13] and fixed-band [14,20] share ZERO kEnd rungs; gap = 1.0; windowsOverlap false',
    holds: () =>
      SHARED_KENDS.length === 0 &&
      WINDOWS_OVERLAP === false &&
      Math.abs(KEND_GAP - 1.0) < 1e-9 &&
      ENDPOINT_PEAKS.length === 9 &&
      FIXED_BAND_PEAKS.length === 13,
  },
  {
    // (R2) Endpoint uniformly concave: increments strictly decreasing, all second differences negative.
    id: 'imp34170-endpoint-uniformly-concave',
    description: 'endpoint increments strictly decreasing and all 7 second differences strictly negative (no sign change)',
    holds: () =>
      EP_INCREMENTS_STRICTLY_DECREASING === true &&
      EP_ALL_SECOND_DIFFS_NEGATIVE === true &&
      EP_SECOND_DIFFS.length === 7,
  },
  {
    // (R3) Fixed-band concave-then-convex: 8 negative then 3 positive second diffs, single knee at ~18.5.
    id: 'imp34170-fixed-band-concave-then-convex-knee',
    description: 'fixed-band second diffs 8 negative then 3 positive (single knee); min increment at kEnd ~ 18.5',
    holds: () =>
      FB_NEG_SECOND_DIFFS === 8 &&
      FB_POS_SECOND_DIFFS === 3 &&
      FB_HAS_CURVATURE_SIGN_FLIP === true &&
      FB_KNEE_IS_SINGLE === true &&
      Math.abs(FB_MIN_INCREMENT_KEND - 18.5) < 1e-9,
  },
  {
    // (R4) Span-matched control: fixed-band low span-2.0 sub-window reproduces the endpoint concave signature.
    id: 'imp34170-span-matched-control-window-artifact',
    description: 'fixed-band [14,16] (span 2.0 = endpoint span) has all second diffs negative, reproducing the endpoint concave signature; endpoint ends 5.5 short of the knee',
    holds: () =>
      Math.abs(FB_SUB_SPAN - EP_SPAN) < 1e-9 &&
      FB_SUB_ALL_SECOND_DIFFS_NEGATIVE === true &&
      Math.abs(ENDPOINT_SHORT_OF_KNEE - 5.5) < 1e-9,
  },
  {
    // Honesty gate: reconciliation says the split is window-confounded, not a demonstrated disagreement;
    // isRigorous false; both within-window readings preserved; sub-gap flagged; no QED; PT SOTA.
    id: 'imp34170-honesty-gate-no-qed',
    description: 'familiesGenuinelyDisagree false & splitIsWindowConfounded true; isRigorous false; within-window readings not overturned; sub-gap flagged; imp-486 C_mb untouched; imp-3066 K_a>=0 untouched; no QED; PT SOTA',
    holds: () =>
      IMP34170_ENDPOINT_VS_FIXED_BAND_PEAK_CURVATURE_RECONCILIATION.familiesGenuinelyDisagree === false &&
      IMP34170_ENDPOINT_VS_FIXED_BAND_PEAK_CURVATURE_RECONCILIATION.splitIsWindowConfounded === true &&
      IMP34170_ENDPOINT_VS_FIXED_BAND_PEAK_CURVATURE_RECONCILIATION.isRigorous === false &&
      /NOT a rigorous asymptotic/.test(IMP34170_ENDPOINT_VS_FIXED_BAND_PEAK_CURVATURE_RECONCILIATION.verdict) &&
      /SUB-GAP-imp-34170-endpoint-knee-untested/.test(IMP34170_ENDPOINT_VS_FIXED_BAND_PEAK_CURVATURE_RECONCILIATION.verdict) &&
      /are not overturned/.test(IMP34170_ENDPOINT_VS_FIXED_BAND_PEAK_CURVATURE_RECONCILIATION.verdict) &&
      /NO QED/.test(IMP34170_ENDPOINT_VS_FIXED_BAND_PEAK_CURVATURE_RECONCILIATION.verdict) &&
      /remains SOTA/.test(IMP34170_ENDPOINT_VS_FIXED_BAND_PEAK_CURVATURE_RECONCILIATION.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34170_ENDPOINT_VS_FIXED_BAND_PEAK_CURVATURE_RECONCILIATION.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34170_ENDPOINT_VS_FIXED_BAND_PEAK_CURVATURE_RECONCILIATION.verdict),
  },
];

for (const a of IMP34170_ENDPOINT_VS_FIXED_BAND_PEAK_CURVATURE_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34170-endpoint-vs-fixed-band-peak-curvature-reconciliation assertion failed: ${a.id}`);
  }
}
