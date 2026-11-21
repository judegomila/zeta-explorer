/**
 * @module imp-35641-threshold-collapse-landmark-crosscheck
 * @fileoverview imp-35641 -- ASSESSMENT-ONLY cross-check that the imp-35597
 *   threshold-collapse LOG-height landmarks are internally consistent with the
 *   INDEPENDENTLY established landmark N values under the RvM inverse height map.
 *
 *   imp-35597 re-exports three framing log-T0 landmark heights used to plot the
 *   route-(i) threshold-collapse curves:
 *     logT0Peak  ~ 13.2309  (interior flat-cap sigma peak)
 *     logT0Cross ~ 20.8576  (E_coll = E_trunc crossover)
 *     logT_PT    ~ 28.7296  (Platt-Trudgian verified height, log 3e12)
 *   but those are baked (via imp-35571) from the COARSE 5-sig-fig N literals
 *   N_PEAK = 9.2186e5 and N_CROSS = 3.280294352e9. imp-35596 already pins the
 *   log-heights against THOSE SAME literals. This module runs the complementary
 *   check the ticket asks for: does imp-35597 stay consistent with the MORE
 *   PRECISE, independently established landmark N values --
 *     imp-35337 interior-peak  N = 9.218633e5   (double-double certified)
 *     imp-33723 crossover      N = 3.280294e9
 *   -- when their log-heights are computed from scratch under the RvM inverse?
 *
 *   FINDING (measurement only): feeding the precise imp-35337/imp-33723 N values
 *   through effectiveHeightForN (inlined verbatim, no heavy import) and taking
 *   the log reproduces the imp-35597 landmarks to storage precision --
 *     effectiveHeightForN(9.218633e5) log-height = 13.2308950594 -> toFixed(4) 13.2309
 *     effectiveHeightForN(3.280294e9) log-height = 20.8576086020 -> toFixed(4) 20.8576
 *     log(3e12)                                  = 28.7296334046 -> toFixed(4) 28.7296
 *   The 5-vs-7-sig-fig N-literal precision gap shifts each log-height by only
 *   ~3e-6 (peak) / ~1e-7 (crossover) -- far below the toFixed(4) display grid --
 *   so the imp-35597 curve-framing landmarks ARE internally consistent with the
 *   independently established peak/crossover N and the PT anchor. Any future
 *   drift in either the coarse baked N literal or effectiveHeightForN that pushed
 *   the log-height off the precise-N value by more than storage tolerance trips.
 *
 *   @see imp-35597-threshold-collapse-viz-data.js (landmark log-heights cross-checked here)
 *   @see imp-35596-threshold-collapse-literals-assertion.js (pins vs the SAME coarse N literals)
 *   @see imp-35337-sigma-landmarks-double-double-certification.js (precise peak N = 9.218633e5)
 *   @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 RvM inverse, inlined here)
 *
 *   Ticket: imp-35641 (numerical, medium). ASSESSMENT ONLY; changes no bound;
 *   discharges nothing; recomputes an already-established landmark map; C_C =
 *   (1/8) sqrt(3 pi) (imp-2642/imp-2643) and C_mb GUE-conditional (imp-486)
 *   UNTOUCHED; imp-35337a stays OPEN. NO QED. No refereed bound is changed.
 */

import { IMP35597_LANDMARKS } from './imp-35597-threshold-collapse-viz-data.js';

// The RvM inverse N -> T0 height map, inlined verbatim from lambda-rh-height-mapping.js.
function effectiveHeightForN(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  const twoPi = 2 * Math.PI;
  let T = Math.max(twoPi * Math.E, (twoPi * N) / Math.max(1, Math.log(N + twoPi)));
  for (let i = 0; i < 40; i++) {
    const u = Math.log(T / twoPi);
    const f = (T / twoPi) * (u - 1) - N;
    const fp = u / twoPi;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > twoPi)) T = twoPi * 1.0001;
    if (Math.abs(dT) < 1e-9 * Math.max(1, T)) break;
  }
  return T;
}

// -- INDEPENDENTLY established landmark N values (NOT the coarse imp-35571 baked literals) --
const N_PEAK_PRECISE = 9.218633e5; // imp-35337 double-double-certified interior peak
const N_CROSS_PRECISE = 3.280294e9; // imp-33723 E_coll = E_trunc crossover
const T_PT = 3e12; // Platt-Trudgian verified height

const LOG_T0_PEAK_PRECISE = Math.log(effectiveHeightForN(N_PEAK_PRECISE)); // ~13.2308950594
const LOG_T0_CROSS_PRECISE = Math.log(effectiveHeightForN(N_CROSS_PRECISE)); // ~20.8576086020
const LOG_T_PT_RECOMPUTE = Math.log(T_PT); // ~28.7296334046

// 7-sig-fig references for the precise-N log-heights (storage tolerance ~1e-6 relative).
const REF = Object.freeze({
  logT0PeakPrecise: 13.23089506, // effectiveHeightForN(9.218633e5) log-height
  logT0CrossPrecise: 20.85760860, // effectiveHeightForN(3.280294e9) log-height
  logT_PT: 28.72963340, // log 3e12
});

const STORAGE_REL_TOL = 1e-6; // 7-sig-fig storage tolerance per [[storage_precision_assertion_tolerance]]
const DISPLAY_ABS_TOL = 5e-5; // half a toFixed(4) grid step -- both round to the same displayed landmark
const relClose = (a, b) => Math.abs(a - b) <= STORAGE_REL_TOL * Math.abs(b);

export const IMP35641_LANDMARK_CROSSCHECK = Object.freeze({
  id: 'imp-35641',
  precise: {
    NPeak: N_PEAK_PRECISE,
    NCross: N_CROSS_PRECISE,
    TPT: T_PT,
    logT0Peak: LOG_T0_PEAK_PRECISE,
    logT0Cross: LOG_T0_CROSS_PRECISE,
    logT_PT: LOG_T_PT_RECOMPUTE,
  },
  imp35597: {
    logT0Peak: IMP35597_LANDMARKS.logT0Peak,
    logT0Cross: IMP35597_LANDMARKS.logT0Cross,
    logT_PT: IMP35597_LANDMARKS.logT_PT,
  },
  deltas: {
    peak: LOG_T0_PEAK_PRECISE - IMP35597_LANDMARKS.logT0Peak,
    cross: LOG_T0_CROSS_PRECISE - IMP35597_LANDMARKS.logT0Cross,
    pt: LOG_T_PT_RECOMPUTE - IMP35597_LANDMARKS.logT_PT,
  },
  storageRelTol: STORAGE_REL_TOL,
  displayAbsTol: DISPLAY_ABS_TOL,
});

export const IMP35641_LANDMARK_CROSSCHECK_ASSERTIONS = [
  {
    // (1) the precise-N log-heights match the 7-sig-fig reference literals within 1e-6 relative --
    //     guards effectiveHeightForN drift at storage precision.
    id: 'imp35641-precise-N-logheights-match-reference-at-storage-tol',
    description:
      'log effectiveHeightForN at the precise imp-35337 peak N=9.218633e5 (13.23090), the precise ' +
      'imp-33723 crossover N=3.280294e9 (20.85761) and log(3e12) (28.72963) match the 7-sig-fig ' +
      'reference literals within 1e-6 relative',
    holds: () =>
      relClose(LOG_T0_PEAK_PRECISE, REF.logT0PeakPrecise) &&
      relClose(LOG_T0_CROSS_PRECISE, REF.logT0CrossPrecise) &&
      relClose(LOG_T_PT_RECOMPUTE, REF.logT_PT),
  },
  {
    // (2) the imp-35597 baked landmarks agree with the precise-N recompute to within half a
    //     toFixed(4) grid step -- so the coarse baked N literals frame the SAME displayed landmarks
    //     as the independently established imp-35337/imp-33723 N values. Also equal to toFixed(4).
    id: 'imp35641-imp35597-landmarks-consistent-with-precise-N',
    description:
      'the imp-35597 baked logT0Peak/logT0Cross/logT_PT agree with the precise-N recompute to within ' +
      'half a toFixed(4) grid step (~5e-5) and round to the same displayed value, confirming the ' +
      'threshold-collapse curve framing is internally consistent with the precise landmark N values',
    holds: () =>
      Math.abs(LOG_T0_PEAK_PRECISE - IMP35597_LANDMARKS.logT0Peak) < DISPLAY_ABS_TOL &&
      Math.abs(LOG_T0_CROSS_PRECISE - IMP35597_LANDMARKS.logT0Cross) < DISPLAY_ABS_TOL &&
      Math.abs(LOG_T_PT_RECOMPUTE - IMP35597_LANDMARKS.logT_PT) < DISPLAY_ABS_TOL &&
      +LOG_T0_PEAK_PRECISE.toFixed(4) === IMP35597_LANDMARKS.logT0Peak &&
      +LOG_T0_CROSS_PRECISE.toFixed(4) === IMP35597_LANDMARKS.logT0Cross &&
      +LOG_T_PT_RECOMPUTE.toFixed(4) === IMP35597_LANDMARKS.logT_PT,
  },
  {
    // (3) landmark ordering: peak < crossover < PT anchor, under the precise-N recompute -- the
    //     monotone height ladder the threshold-collapse plot relies on.
    id: 'imp35641-precise-N-landmark-ordering-monotone',
    description:
      'the precise-N log-heights preserve the monotone ladder peak (13.23) < crossover (20.86) < ' +
      'PT anchor (28.73)',
    holds: () =>
      LOG_T0_PEAK_PRECISE < LOG_T0_CROSS_PRECISE &&
      LOG_T0_CROSS_PRECISE < LOG_T_PT_RECOMPUTE,
  },
];

for (const a of IMP35641_LANDMARK_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35641-threshold-collapse-landmark-crosscheck assertion failed: ${a.id}`);
  }
}

export default Object.freeze({
  id: 'imp-35641-threshold-collapse-landmark-crosscheck',
  ticket: 'imp-35641',
  crosscheck: IMP35641_LANDMARK_CROSSCHECK,
  reference: REF,
});
