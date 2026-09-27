/**
 * @module imp-97786-fold-amplitude-corewindow-not-global-honest-status
 * @fileoverview imp-97786 -- HONEST-STATUS BANNER restating, as a standalone directly-citable
 *   note, the imp-97764 wide-window finding on the imp-97743 fold-amplitude floor-scaling
 *   exponent K ~ E_trunc^(+0.221). Extending the sweep from the original 0.5x..5x window to
 *   0.1x..10x shows the exponent is a GENUINE power law only over the 0.1x..3x CORE (local
 *   log-log slope flat to 3 decimals, q = 0.2205..0.2235, with the original 0.5x/2x two-point
 *   slope 0.2208 sitting inside that band). Past 3x the slope steepens: q = 0.2276 (3x->5x)
 *   -> 0.2367 (5x->7.5x) -> 0.2490 (7.5x->10x), reaching ~0.249 by 10x, ~13% above the ~0.221
 *   core reading. So ~0.221 is a CORE-WINDOW power law, not a globally exact law across the
 *   extreme high-floor tail. Documentation only: no new numerics, no bound moves. NO QED.
 *
 * @see imp-97764-fold-amplitude-wide-window-power-law.js (source: the 0.1x..10x sweep and the core/drift split)
 * @see imp-97743-fold-amplitude-etrunc-floor-sensitivity.js (the original 0.5x..5x sweep and the ~0.221 two-point slope)
 * @see imp-97773-fold-amplitude-not-universal-honest-status.js (sibling honest-status note: K is not universal across floor/height axes)
 *
 * Ticket: imp-97786 (content, sonnet-4-6, sonnet). Honest-status note only; no bound on Lambda
 * moves; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.
 */

import { IMP97764_FOLD_AMPLITUDE_WIDE_WINDOW_POWER_LAW } from './imp-97764-fold-amplitude-wide-window-power-law.js';

export const IMP97786_FOLD_AMPLITUDE_COREWINDOW_NOT_GLOBAL_HONEST_STATUS = Object.freeze({
  ticket: 'imp-97786',
  question:
    'Is the imp-97743 fold-amplitude floor-scaling exponent K ~ E_trunc^(+0.221) a globally exact ' +
    'power law, or only a fit valid over the core window it was originally measured on?',
  answer:
    'It is a CORE-WINDOW power law, not a globally exact one. The imp-97764 wide sweep (0.1x..10x, ' +
    'vs the original 0.5x..5x) shows the local log-log slope is flat to 3 decimals ' +
    '(q = 0.2205..0.2235) across 0.1x..3x, with the original 0.5x/2x two-point slope (0.2208) ' +
    'sitting inside that band -- so ~0.221 is genuine over that range, not a narrow-window ' +
    'artifact. Past 3x the slope drifts mildly but steadily upward: q = 0.2276 (3x->5x), 0.2367 ' +
    '(5x->7.5x), 0.2490 (7.5x->10x), reaching ~0.249 by the 10x edge -- about 13% above the ' +
    '~0.221 core reading. K itself stays a well-defined, finite, monotone-increasing interior-peak ' +
    'amplitude across the whole window (0.253935 at 0.1x to 0.717408 at 10x), so the object being ' +
    'measured never breaks down; only the single fixed exponent stops describing it exactly once ' +
    'the floor is pushed far above the base pin.',
  coreWindow: {
    range: '0.1x..3x',
    q_min: IMP97764_FOLD_AMPLITUDE_WIDE_WINDOW_POWER_LAW.coreFlatness.core_q_min, // ~0.2205
    q_max: IMP97764_FOLD_AMPLITUDE_WIDE_WINDOW_POWER_LAW.coreFlatness.core_q_max, // ~0.2235
    flatTo3Decimals: IMP97764_FOLD_AMPLITUDE_WIDE_WINDOW_POWER_LAW.coreFlatness.flat_to_3_decimals, // true
    originalTwoPointSlope: IMP97764_FOLD_AMPLITUDE_WIDE_WINDOW_POWER_LAW.windowExponents.orig_0_5x_2x, // ~0.2208
  },
  highFloorDrift: {
    range: '3x..10x',
    q_3x_5x: IMP97764_FOLD_AMPLITUDE_WIDE_WINDOW_POWER_LAW.localExponents.find(
      (e) => e.from === 3.0 && e.to === 5.0,
    )?.q, // ~0.2276
    q_5x_7_5x: IMP97764_FOLD_AMPLITUDE_WIDE_WINDOW_POWER_LAW.localExponents.find(
      (e) => e.from === 5.0 && e.to === 7.5,
    )?.q, // ~0.2367
    q_7_5x_10x: IMP97764_FOLD_AMPLITUDE_WIDE_WINDOW_POWER_LAW.localExponents.find(
      (e) => e.from === 7.5 && e.to === 10.0,
    )?.q, // ~0.2490
    driftsMonotonicallyUp: IMP97764_FOLD_AMPLITUDE_WIDE_WINDOW_POWER_LAW.drift.high_floor_exponent_drifts_up, // true
  },
  KStillWellDefinedAtExtremes: IMP97764_FOLD_AMPLITUDE_WIDE_WINDOW_POWER_LAW.drift
    .K_stays_well_defined_interior_peak_at_extremes, // true
  isGloballyExactPowerLaw: false,
  isCoreWindowPowerLaw: true,
  measurementOnly: true,
  isRigorous: false,
  qed: false,
});

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    IMP97786_FOLD_AMPLITUDE_COREWINDOW_NOT_GLOBAL_HONEST_STATUS.isGloballyExactPowerLaw === false &&
    IMP97786_FOLD_AMPLITUDE_COREWINDOW_NOT_GLOBAL_HONEST_STATUS.isCoreWindowPowerLaw === true &&
    IMP97786_FOLD_AMPLITUDE_COREWINDOW_NOT_GLOBAL_HONEST_STATUS.coreWindow.flatTo3Decimals === true &&
    IMP97786_FOLD_AMPLITUDE_COREWINDOW_NOT_GLOBAL_HONEST_STATUS.highFloorDrift.driftsMonotonicallyUp === true &&
    IMP97786_FOLD_AMPLITUDE_COREWINDOW_NOT_GLOBAL_HONEST_STATUS.highFloorDrift.q_7_5x_10x >
      IMP97786_FOLD_AMPLITUDE_COREWINDOW_NOT_GLOBAL_HONEST_STATUS.coreWindow.q_max &&
    IMP97786_FOLD_AMPLITUDE_COREWINDOW_NOT_GLOBAL_HONEST_STATUS.KStillWellDefinedAtExtremes === true &&
    IMP97786_FOLD_AMPLITUDE_COREWINDOW_NOT_GLOBAL_HONEST_STATUS.measurementOnly === true &&
    IMP97786_FOLD_AMPLITUDE_COREWINDOW_NOT_GLOBAL_HONEST_STATUS.isRigorous === false &&
    IMP97786_FOLD_AMPLITUDE_COREWINDOW_NOT_GLOBAL_HONEST_STATUS.qed === false &&
    /GENUINE POWER LAW OVER THE CORE, MILD DRIFT AT THE EXTREME/.test(
      IMP97764_FOLD_AMPLITUDE_WIDE_WINDOW_POWER_LAW.verdict,
    ) &&
    /NO QED/.test(IMP97764_FOLD_AMPLITUDE_WIDE_WINDOW_POWER_LAW.verdict)
  )
) {
  throw new Error(
    'imp-97786-fold-amplitude-corewindow-not-global-honest-status assertion FAILED: the ' +
      'imp-97764 core-window / high-floor-drift split must hold as recorded.',
  );
}

export default IMP97786_FOLD_AMPLITUDE_COREWINDOW_NOT_GLOBAL_HONEST_STATUS;
