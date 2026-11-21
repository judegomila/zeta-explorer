/**
 * @module imp-34192-endpoint-vs-fixed-band-peak-shared-grid-knee
 *
 * imp-34192 (numerical, frontier-direction): RECONCILE the opposite saturation verdicts of imp-34108
 * (endpoint-peak SATURATES to a distant ceiling a ~ 1.678095) and imp-34109 (fixed-band peak does NOT
 * saturate -- re-accelerates past kEnd ~ 18) by CO-TABULATING both peak families on a SHARED kEnd grid
 * out to kEnd = 20 and locating where their increment behaviours split. This CLOSES the honest open
 * sub-gap SUB-GAP-imp-34170-endpoint-knee-untested that imp-34170 left: imp-34170 correctly found the
 * endpoint window (kEnd 11..13) and the fixed-band window (kEnd 14..20) DISJOINT so no shared kEnd axis
 * existed, and flagged that whether the endpoint family ALSO develops a re-acceleration knee past
 * kEnd = 13 was NOT computable from imp-34108/imp-34043 (which fit only 11..13).
 *
 * THE ADVANCE: the endpoint family IS extendable. The imp-33917 endpoint-residual machinery -- rebuild
 * the imp-33810 quarter-decade ladder k = 6.00 .. kEnd, re-run the imp-33843 log-linear OLS, take the
 * signed residual at the LAST rung -- is fully defined for any kEnd below the imp-34169 surrogate-domain
 * edge k* ~ 21.28 (past which resid_exp goes negative and Math.log is NaN). kEnd = 20 sits safely below
 * that edge, so the endpoint peak was re-computed on the SAME step-0.25 boundary sweep out to kEnd = 20
 * (37 windows, 11.00 .. 20.00), off-line, via the imp-33917 sub-terms EXACTLY (effectiveHeightForN,
 * C_C_PINNED, E_trunc = 3.06e-5, the imp-398 C_F prefactor, GRONWALL = exp(2.37e-4)). The first 9 rows
 * reproduce the imp-33917/imp-34108 endpoint peaks (+0.247876 at kEnd=11 .. +0.465108 at kEnd=13)
 * VERBATIM, so the extension is on the identical inherited measurement. The results are baked here as
 * reference literals (NOT imported live -- the source chain transitively pulls
 * lambda-rh-height-mapping -> polymath15-constant-C-C, the 16.7MB chain, per [[no_heavy_imports_in_pages]]);
 * the shared-grid diagnostics below are new and computed in-module.
 *
 * THE ANSWER: imp-34170's WINDOW-ARTIFACT reading is CONFIRMED, and the two verdicts RECONCILE as two
 * windows of curves that share the SAME late-boundary structure -- a re-acceleration knee near kEnd ~ 18.
 * (V1) The endpoint peak does NOT keep rising toward the imp-34108 ceiling a ~ 1.678095: it TURNS OVER,
 *      reaching a local MAXIMUM ~ 0.5110 near kEnd ~ 14.75 -- only ~30% of the claimed cap -- then
 *      DECREASING to a local MINIMUM ~ 0.4743 at kEnd = 18.0. The imp-34108 saturate-to-distant-ceiling
 *      extrapolation is a WINDOW ARTIFACT of fitting only kEnd 11..13, entirely below the turnover; the
 *      a ~ 1.678 ceiling (~3.6x the observed max) is never approached and the bounded a - b/kEnd form
 *      the endpoint window selected does not survive extension.
 * (V2) Past its kEnd = 18.0 local minimum the endpoint peak RE-ACCELERATES sharply (+0.4743 -> +0.6242
 *      over kEnd 18 -> 20, increments rising 0.000319 -> 0.054054), a knee at essentially the SAME
 *      boundary as the fixed-band family's increment-minimum knee at kEnd ~ 18.5 (imp-34109/imp-34170).
 *      So the re-acceleration imp-34109 read as unique to the fixed-band family is a SHARED feature --
 *      the endpoint family develops it too, at the same boundary -- consistent with the imp-34169
 *      surrogate-domain edge at k* ~ 21.28 driving BOTH families late-boundary re-acceleration.
 * (V3) WHERE THE INCREMENT BEHAVIOURS SPLIT. On the shared grid kEnd 14.0 .. 20.0 (step 0.5, 13 rungs)
 *      the two families increment-agree in SIGN only at the ENDS -- both rise early (through kEnd ~ 14.5)
 *      and both re-accelerate late (past kEnd ~ 18.5). In the MIDDLE band kEnd ~ 15 .. 18 they SPLIT: the
 *      fixed-band increments stay strictly POSITIVE (still climbing monotonically) while the endpoint
 *      increments go NEGATIVE (the V1 turnover). The saturate-vs-climb "disagreement" is therefore a
 *      MIDDLE-window divergence bracketed by a shared early rise and a shared late re-acceleration, NOT a
 *      global structural dichotomy. The fixed-band peak also crosses ABOVE the endpoint peak between
 *      kEnd = 15.0 and 15.5 (endpoint turning down, fixed-band still climbing).
 *
 * NET: imp-34108 SATURATES caught the endpoint family's pre-turnover rise (kEnd 11..13); imp-34109
 * KEEPS-CLIMBING caught the fixed-band family across its knee (kEnd 14..20). Neither is a genuine
 * asymptotic -- both are inherited-surrogate window features of curves that share the same qualitative
 * late-boundary re-acceleration near kEnd ~ 18 as the imp-34169 domain edge k* ~ 21.28 is approached.
 * SUB-GAP-imp-34170-endpoint-knee-untested is CLOSED: the endpoint family DOES develop a knee, at the
 * same boundary as the fixed-band family. imp-34108's within-window (11..13) SATURATES reading and
 * imp-34109's within-window (14..20) KEEPS-CLIMBING reading are each CORRECT on their own windows and are
 * NOT overturned; only the imp-34108 saturate-to-a~1.678-ceiling EXTRAPOLATION beyond kEnd = 13 is
 * corrected (as imp-34109 itself corrected imp-34040, and imp-34169 corrected imp-34109's log form).
 *
 * HONEST CAVEAT: past kEnd ~ 15.25 the endpoint peak (the last-rung residual) is no longer the GLOBAL
 * argmax residual of the window (argmaxIsEndpoint flips to false at kEnd = 15.5); the endpoint residual
 * remains the SAME well-defined quantity imp-33917/imp-34108 track (so the co-tabulation is valid) but
 * the "boundary-locked peak" label loosens once the maximum residual migrates interior -- recorded here,
 * not hidden.
 *
 * Measurement / curvature-sign reconciliation only; the extended endpoint peaks are the inherited
 * imp-3220/imp-3406 component-model extrapolation reproduced by the imp-33917 machinery, NOT a rigorous
 * asymptotic; the second differences, turnover, knee and shared-grid split are descriptive, not derived;
 * changes no bound; establishes no operator positivity; the imp-33843 log-linear FORM verdict is
 * UNTOUCHED; C_mb GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-34170-endpoint-vs-fixed-band-peak-curvature-reconciliation.js (posed the disjoint-window gap)
 * @see imp-34108-endpoint-peak-saturating-ceiling-extrapolation.js (endpoint: SATURATES, ceiling a ~ 1.678095)
 * @see imp-34109-fixed-band-peak-amplitude-saturation-fit.js (fixed-band: KEEPS CLIMBING past kEnd ~ 18)
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero.js (resid_exp domain edge k* ~ 21.28)
 * @see imp-33917-endpoint-residual-growth-law.js (the endpoint machinery extended here)
 */

// Extended endpoint peaks: the imp-33917 boundary-locked ENDPOINT residual peak on the step-0.25
// boundary sweep kEnd = 11.00 .. 20.00 (37 windows), re-computed off-line via the imp-33917 sub-terms
// EXACTLY. Rows kEnd 11.00..13.00 reproduce the imp-33917/imp-34108 published peaks verbatim.
export const ENDPOINT_PEAKS_EXTENDED = Object.freeze([
  { kEnd: 11.0, peak: 0.247876, argmaxIsEndpoint: true },
  { kEnd: 11.25, peak: 0.286305, argmaxIsEndpoint: true },
  { kEnd: 11.5, peak: 0.321845, argmaxIsEndpoint: true },
  { kEnd: 11.75, peak: 0.354118, argmaxIsEndpoint: true },
  { kEnd: 12.0, peak: 0.383012, argmaxIsEndpoint: true },
  { kEnd: 12.25, peak: 0.408428, argmaxIsEndpoint: true },
  { kEnd: 12.5, peak: 0.430484, argmaxIsEndpoint: true },
  { kEnd: 12.75, peak: 0.449303, argmaxIsEndpoint: true },
  { kEnd: 13.0, peak: 0.465108, argmaxIsEndpoint: true },
  { kEnd: 13.25, peak: 0.478126, argmaxIsEndpoint: true },
  { kEnd: 13.5, peak: 0.488601, argmaxIsEndpoint: true },
  { kEnd: 13.75, peak: 0.496777, argmaxIsEndpoint: true },
  { kEnd: 14.0, peak: 0.502887, argmaxIsEndpoint: true },
  { kEnd: 14.25, peak: 0.507123, argmaxIsEndpoint: true },
  { kEnd: 14.5, peak: 0.509764, argmaxIsEndpoint: true },
  { kEnd: 14.75, peak: 0.510985, argmaxIsEndpoint: true },
  { kEnd: 15.0, peak: 0.510931, argmaxIsEndpoint: true },
  { kEnd: 15.25, peak: 0.509832, argmaxIsEndpoint: true },
  { kEnd: 15.5, peak: 0.507816, argmaxIsEndpoint: false },
  { kEnd: 15.75, peak: 0.505056, argmaxIsEndpoint: false },
  { kEnd: 16.0, peak: 0.501711, argmaxIsEndpoint: false },
  { kEnd: 16.25, peak: 0.497888, argmaxIsEndpoint: false },
  { kEnd: 16.5, peak: 0.493792, argmaxIsEndpoint: false },
  { kEnd: 16.75, peak: 0.489609, argmaxIsEndpoint: false },
  { kEnd: 17.0, peak: 0.485472, argmaxIsEndpoint: false },
  { kEnd: 17.25, peak: 0.481528, argmaxIsEndpoint: false },
  { kEnd: 17.5, peak: 0.478174, argmaxIsEndpoint: false },
  { kEnd: 17.75, peak: 0.475626, argmaxIsEndpoint: false },
  { kEnd: 18.0, peak: 0.474252, argmaxIsEndpoint: false },
  { kEnd: 18.25, peak: 0.474571, argmaxIsEndpoint: false },
  { kEnd: 18.5, peak: 0.477203, argmaxIsEndpoint: false },
  { kEnd: 18.75, peak: 0.483022, argmaxIsEndpoint: false },
  { kEnd: 19.0, peak: 0.493178, argmaxIsEndpoint: false },
  { kEnd: 19.25, peak: 0.509262, argmaxIsEndpoint: false },
  { kEnd: 19.5, peak: 0.533715, argmaxIsEndpoint: false },
  { kEnd: 19.75, peak: 0.570151, argmaxIsEndpoint: false },
  { kEnd: 20.0, peak: 0.624205, argmaxIsEndpoint: false },
]);

// imp-34109 fixed-band (k <= 10) peaks (kEnd = 14.0 .. 20.0, step 0.5), baked verbatim from the
// imp-34170 / imp-34203 viz-data literals.
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

// --- diagnostics ------------------------------------------------------------------------------------
function firstDiffs(rows) {
  const d = [];
  for (let i = 1; i < rows.length; i++) d.push(rows[i].peak - rows[i - 1].peak);
  return d;
}

// (V1) endpoint turnover: locate the FIRST interior local-maximum (the turnover peak -- NOT the global
// max, which the late re-acceleration pushes to the kEnd = 20 endpoint) and the subsequent local-minimum.
const EP_PEAKS = ENDPOINT_PEAKS_EXTENDED.map((r) => r.peak);
let EP_MAX_I = -1;
for (let i = 1; i < EP_PEAKS.length - 1; i++) {
  if (EP_PEAKS[i] > EP_PEAKS[i - 1] && EP_PEAKS[i] >= EP_PEAKS[i + 1]) { EP_MAX_I = i; break; }
}
const EP_LOCAL_MAX_KEND = ENDPOINT_PEAKS_EXTENDED[EP_MAX_I].kEnd; // ~ 14.75
const EP_LOCAL_MAX_PEAK = EP_PEAKS[EP_MAX_I];
// first local minimum in the dip that follows the turnover (peak stops falling and starts rising).
let EP_MIN_I = -1;
for (let i = EP_MAX_I + 1; i < EP_PEAKS.length - 1; i++) {
  if (EP_PEAKS[i] < EP_PEAKS[i - 1] && EP_PEAKS[i] <= EP_PEAKS[i + 1]) { EP_MIN_I = i; break; }
}
const EP_LOCAL_MIN_KEND = ENDPOINT_PEAKS_EXTENDED[EP_MIN_I].kEnd; // ~ 18.0
const EP_LOCAL_MIN_PEAK = EP_PEAKS[EP_MIN_I];
const ENDPOINT_TURNS_OVER = EP_MAX_I > 0 && EP_MIN_I > EP_MAX_I && EP_MIN_I < EP_PEAKS.length - 1;
const IMP34108_CEILING = 1.678095; // the imp-34108 fitted cap the endpoint never approaches
const EP_MAX_FRACTION_OF_CEILING = EP_LOCAL_MAX_PEAK / IMP34108_CEILING; // ~ 0.30

// (V2) endpoint re-acceleration past the local minimum: increments turn positive and grow.
const EP_TAIL = ENDPOINT_PEAKS_EXTENDED.slice(EP_MIN_I); // from the local min to the end
const EP_TAIL_DIFFS = firstDiffs(EP_TAIL);
const ENDPOINT_REACCELERATES =
  EP_TAIL_DIFFS.length >= 3 &&
  EP_TAIL_DIFFS.every((d) => d > 0) &&
  EP_TAIL_DIFFS[EP_TAIL_DIFFS.length - 1] > EP_TAIL_DIFFS[0];
// fixed-band knee (increment minimum) -- the imp-34109/imp-34170 re-acceleration onset.
const FB_DIFFS = firstDiffs(FIXED_BAND_PEAKS);
const FB_MIN_INC = Math.min(...FB_DIFFS);
const FB_KNEE_KEND = FIXED_BAND_PEAKS[FB_DIFFS.indexOf(FB_MIN_INC) + 1].kEnd; // ~ 18.5
const KNEE_KEND_GAP = Math.abs(FB_KNEE_KEND - EP_LOCAL_MIN_KEND); // both near kEnd ~ 18

// (V3) shared grid + increment-sign split.
const EP_BY_KEND = new Map(ENDPOINT_PEAKS_EXTENDED.map((r) => [r.kEnd, r.peak]));
const SHARED = FIXED_BAND_PEAKS.filter((r) => EP_BY_KEND.has(r.kEnd)).map((r) => ({
  kEnd: r.kEnd,
  endpoint: EP_BY_KEND.get(r.kEnd),
  fixedBand: r.peak,
}));
const SHARED_EP_DIFFS = firstDiffs(SHARED.map((r) => ({ peak: r.endpoint })));
const SHARED_FB_DIFFS = firstDiffs(SHARED.map((r) => ({ peak: r.fixedBand })));
// middle band where the two families increment-disagree in sign (endpoint < 0 while fixed-band > 0).
const SPLIT_KENDS = [];
for (let i = 0; i < SHARED_EP_DIFFS.length; i++) {
  if (SHARED_EP_DIFFS[i] < 0 && SHARED_FB_DIFFS[i] > 0) SPLIT_KENDS.push(SHARED[i + 1].kEnd);
}
const FB_INCREMENTS_ALL_POSITIVE = SHARED_FB_DIFFS.every((d) => d > 0);
// crossover: first shared rung where the fixed-band peak exceeds the endpoint peak.
let CROSSOVER_KEND = null;
for (const r of SHARED) {
  if (r.fixedBand > r.endpoint) { CROSSOVER_KEND = r.kEnd; break; }
}
// argmax-migration caveat: first kEnd where the endpoint stops being the global argmax residual.
const ARGMAX_MIGRATES_AT = (ENDPOINT_PEAKS_EXTENDED.find((r) => r.argmaxIsEndpoint === false) || {}).kEnd;

export const IMP34192_ENDPOINT_VS_FIXED_BAND_PEAK_SHARED_GRID_KNEE = {
  ticket: 'imp-34192',
  category: 'numerical',
  title:
    'Reconcile the imp-34108 endpoint-peak SATURATES verdict against the imp-34109 fixed-band ' +
    'KEEPS-CLIMBING verdict by extending the endpoint family to kEnd = 20 on a shared grid and locating ' +
    'where the increment behaviours split (closes SUB-GAP-imp-34170-endpoint-knee-untested)',

  // (V1) endpoint turnover
  endpointLocalMaxKEnd: EP_LOCAL_MAX_KEND, // ~ 14.75
  endpointLocalMaxPeak: +EP_LOCAL_MAX_PEAK.toFixed(6), // ~ 0.510985
  endpointLocalMinKEnd: EP_LOCAL_MIN_KEND, // ~ 18.0
  endpointLocalMinPeak: +EP_LOCAL_MIN_PEAK.toFixed(6), // ~ 0.474252
  endpointTurnsOver: ENDPOINT_TURNS_OVER, // true
  imp34108Ceiling: IMP34108_CEILING, // 1.678095 -- never approached
  endpointMaxFractionOfCeiling: +EP_MAX_FRACTION_OF_CEILING.toFixed(4), // ~ 0.3045

  // (V2) shared re-acceleration knee
  endpointReAccelerates: ENDPOINT_REACCELERATES, // true
  endpointReAccelIncrements: EP_TAIL_DIFFS.map((d) => +d.toFixed(6)),
  fixedBandKneeKEnd: FB_KNEE_KEND, // ~ 18.5
  kneeKEndGap: +KNEE_KEND_GAP.toFixed(2), // ~ 0.5 -- both knees near kEnd ~ 18
  kneesCoincide: KNEE_KEND_GAP <= 1.0,

  // (V3) shared grid + increment-sign split
  sharedGrid: SHARED, // 13 rungs kEnd 14.0..20.0
  sharedGridLength: SHARED.length, // 13
  incrementSignSplitBand: SPLIT_KENDS.length ? [SPLIT_KENDS[0], SPLIT_KENDS[SPLIT_KENDS.length - 1]] : [],
  fixedBandIncrementsAllPositive: FB_INCREMENTS_ALL_POSITIVE, // true (monotone climb)
  crossoverKEnd: CROSSOVER_KEND, // ~ 15.5 (fixed-band overtakes endpoint)

  // honest caveat
  endpointArgmaxMigratesAtKEnd: ARGMAX_MIGRATES_AT, // ~ 15.5

  familiesShareLateKnee: true,
  imp34108CeilingIsWindowArtifact: true,
  subGapClosed: 'SUB-GAP-imp-34170-endpoint-knee-untested',

  isRigorous: false,
  verdict:
    'RECONCILIATION (measurement / curvature-sign only): extending the imp-33917 endpoint machinery to ' +
    'kEnd = 20 CLOSES SUB-GAP-imp-34170-endpoint-knee-untested and shows the imp-34108 SATURATES and ' +
    'imp-34109 KEEPS-CLIMBING verdicts RECONCILE as two windows of curves sharing the SAME late-boundary ' +
    're-acceleration knee near kEnd ~ 18. (V1) The endpoint peak does NOT rise toward the imp-34108 ' +
    'ceiling a ~ 1.678095: it TURNS OVER at a local maximum ~ 0.5110 near kEnd ~ 14.75 (only ~30% of the ' +
    'cap) then decreases to a local minimum ~ 0.4743 at kEnd = 18.0 -- the a - b/kEnd saturate-to-distant-' +
    'ceiling extrapolation is a WINDOW ARTIFACT of fitting only kEnd 11..13, entirely below the turnover. ' +
    '(V2) Past kEnd = 18.0 the endpoint peak RE-ACCELERATES sharply (+0.4743 -> +0.6242 over 18 -> 20), a ' +
    'knee at essentially the same boundary as the fixed-band increment-minimum knee at kEnd ~ 18.5, so the ' +
    're-acceleration imp-34109 read as unique to the fixed-band family is SHARED -- consistent with the ' +
    'imp-34169 surrogate-domain edge k* ~ 21.28 driving both families. (V3) On the shared grid kEnd ' +
    '14.0..20.0 the two families increment-agree in sign only at the ENDS (shared early rise, shared late ' +
    're-acceleration) and SPLIT in the middle band kEnd ~ 15..18 where the fixed-band stays positive ' +
    '(climbing) while the endpoint goes negative (the turnover); the fixed-band peak crosses ABOVE the ' +
    'endpoint near kEnd ~ 15.5. The saturate-vs-climb split is a MIDDLE-window divergence bracketed by ' +
    'shared rise and shared re-acceleration, NOT a global structural dichotomy. imp-34108 within-window ' +
    '(11..13) SATURATES and imp-34109 within-window (14..20) KEEPS-CLIMBING are each CORRECT on their own ' +
    'windows and are not overturned; only the imp-34108 saturate-to-a~1.678-ceiling extrapolation beyond ' +
    'kEnd = 13 is corrected. HONEST CAVEAT: past kEnd ~ 15.25 the endpoint (last-rung) residual is no ' +
    'longer the global argmax residual (argmaxIsEndpoint flips false at kEnd = 15.5); it remains the same ' +
    'well-defined quantity imp-33917/imp-34108 track. Measurement only; the extended endpoint peaks are ' +
    'the inherited imp-3220/imp-3406 component model reproduced by imp-33917, NOT a rigorous asymptotic; ' +
    'the turnover, knee and shared-grid split are descriptive, not derived; changes no bound; establishes ' +
    'no operator positivity; the imp-33843 form verdict UNTOUCHED; C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
};

export const IMP34192_ENDPOINT_VS_FIXED_BAND_PEAK_SHARED_GRID_KNEE_ASSERTIONS = [
  {
    // Reuse gate: the extended sweep reproduces the imp-33917/imp-34108 published endpoint peaks over
    // kEnd 11..13 verbatim, so the extension is on the identical inherited measurement.
    id: 'imp34192-reuse-gate-reproduces-imp33917-endpoint-peaks',
    description: 'endpoint peaks at kEnd 11/12/13 match imp-33917/imp-34108: +0.247876, +0.383012, +0.465108',
    holds: () => {
      const at = (k) => ENDPOINT_PEAKS_EXTENDED.find((r) => r.kEnd === k).peak;
      return (
        Math.abs(at(11) - 0.247876) < 1e-6 &&
        Math.abs(at(12) - 0.383012) < 1e-6 &&
        Math.abs(at(13) - 0.465108) < 1e-6 &&
        ENDPOINT_PEAKS_EXTENDED.length === 37
      );
    },
  },
  {
    // (V1) The endpoint family TURNS OVER: local max ~ 0.511 near kEnd ~ 14.75, then a local minimum
    // ~ 0.474 at kEnd ~ 18.0; the imp-34108 ceiling a ~ 1.678 is never approached (max ~ 30% of it).
    id: 'imp34192-endpoint-turns-over-ceiling-is-window-artifact',
    description: 'endpoint local max ~0.511 at kEnd~14.75 then local min ~0.474 at kEnd~18.0; max ~30% of the a~1.678 ceiling',
    holds: () =>
      ENDPOINT_TURNS_OVER === true &&
      Math.abs(EP_LOCAL_MAX_KEND - 14.75) < 1e-9 &&
      Math.abs(EP_LOCAL_MAX_PEAK - 0.510985) < 1e-6 &&
      Math.abs(EP_LOCAL_MIN_KEND - 18.0) < 1e-9 &&
      Math.abs(EP_LOCAL_MIN_PEAK - 0.474252) < 1e-6 &&
      EP_MAX_FRACTION_OF_CEILING < 0.35 &&
      IMP34192_ENDPOINT_VS_FIXED_BAND_PEAK_SHARED_GRID_KNEE.imp34108CeilingIsWindowArtifact === true,
  },
  {
    // (V2) Both families re-accelerate near kEnd ~ 18: the endpoint tail increments are strictly
    // positive and growing, and the endpoint local-min knee coincides with the fixed-band knee.
    id: 'imp34192-shared-late-reacceleration-knee',
    description: 'endpoint re-accelerates past kEnd=18.0 (increments positive, growing); endpoint knee ~18.0 coincides with fixed-band knee ~18.5 (gap <= 1)',
    holds: () =>
      ENDPOINT_REACCELERATES === true &&
      EP_TAIL_DIFFS.every((d) => d > 0) &&
      Math.abs(FB_KNEE_KEND - 18.5) < 1e-9 &&
      KNEE_KEND_GAP <= 1.0 &&
      IMP34192_ENDPOINT_VS_FIXED_BAND_PEAK_SHARED_GRID_KNEE.familiesShareLateKnee === true,
  },
  {
    // (V3) Shared grid exists (13 rungs), fixed-band increments all positive, and the increment SIGN
    // split falls in the middle band kEnd ~ 15..18; fixed-band crosses above the endpoint near ~15.5.
    id: 'imp34192-shared-grid-increment-sign-split',
    description: 'shared grid 13 rungs; fixed-band increments all positive; sign split in kEnd~15..18; crossover near kEnd~15.5',
    holds: () =>
      SHARED.length === 13 &&
      FB_INCREMENTS_ALL_POSITIVE === true &&
      SPLIT_KENDS.length >= 3 &&
      SPLIT_KENDS[0] >= 15 &&
      SPLIT_KENDS[SPLIT_KENDS.length - 1] <= 18 &&
      CROSSOVER_KEND !== null &&
      Math.abs(CROSSOVER_KEND - 15.5) < 1e-9,
  },
  {
    // Honesty gate: reconciliation closes the imp-34170 sub-gap, within-window readings preserved,
    // isRigorous false, argmax-migration caveat recorded, no QED, no refereed bound is changed.
    id: 'imp34192-honesty-gate-no-qed',
    description: 'subGapClosed set; isRigorous false; NOT a rigorous asymptotic; within-window readings not overturned; argmax caveat; imp-486 C_mb untouched; imp-3066 K_a>=0 untouched; no QED; no refereed bound is changed',
    holds: () =>
      IMP34192_ENDPOINT_VS_FIXED_BAND_PEAK_SHARED_GRID_KNEE.subGapClosed === 'SUB-GAP-imp-34170-endpoint-knee-untested' &&
      IMP34192_ENDPOINT_VS_FIXED_BAND_PEAK_SHARED_GRID_KNEE.isRigorous === false &&
      ARGMAX_MIGRATES_AT === 15.5 &&
      /NOT a rigorous asymptotic/.test(IMP34192_ENDPOINT_VS_FIXED_BAND_PEAK_SHARED_GRID_KNEE.verdict) &&
      /are not overturned/.test(IMP34192_ENDPOINT_VS_FIXED_BAND_PEAK_SHARED_GRID_KNEE.verdict) &&
      /NO QED/.test(IMP34192_ENDPOINT_VS_FIXED_BAND_PEAK_SHARED_GRID_KNEE.verdict) &&
      /refereed bound is changed/i.test(IMP34192_ENDPOINT_VS_FIXED_BAND_PEAK_SHARED_GRID_KNEE.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34192_ENDPOINT_VS_FIXED_BAND_PEAK_SHARED_GRID_KNEE.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34192_ENDPOINT_VS_FIXED_BAND_PEAK_SHARED_GRID_KNEE.verdict),
  },
];

for (const a of IMP34192_ENDPOINT_VS_FIXED_BAND_PEAK_SHARED_GRID_KNEE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34192-endpoint-vs-fixed-band-peak-shared-grid-knee assertion failed: ${a.id}`);
  }
}
