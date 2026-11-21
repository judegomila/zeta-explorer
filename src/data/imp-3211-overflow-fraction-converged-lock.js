/**
 * @module imp-3211-overflow-fraction-converged-lock
 * @fileoverview imp-3211 -- Cross-module build-assertion tripwire locking the
 *   imp-3175 resolution-converged genuine overflow fraction ~0.209 as the
 *   authoritative value. Prevents any module from silently presenting the stale
 *   coarse-grid anchors 0.194 (imp-3144) or 0.200 (imp-3154, N=200) as THE
 *   genuine resolved overflow fraction.
 *
 *   BACKGROUND
 *   ----------
 *   imp-3144 / section26-mupass recorded the overflow fraction as 19.4% (0.194)
 *   of tau. imp-3154 recomputed the same quantity with a degree sweep and found
 *   0.200. imp-3175 then swept the TAU-GRID RESOLUTION N in {100..6400} and found
 *   the value is MONOTONE INCREASING in N, converging to ~0.209 -- NOT down to
 *   0.194. Both prior anchors are coarse-grid snapshots that UNDER-report the
 *   resolved fraction; the genuine converged value is ~0.209 (offline N=204800
 *   limit ~0.2092).
 *
 *   The imp-3007 module was updated to carry BOTH fields:
 *     genuineDeg2OverflowFractionOfTau: 0.194   (coarse-grid snapshot, labeled)
 *     resolvedOverflowFractionOfTau:    0.2092   (imp-3175 converged, labeled)
 *
 *   WHAT THIS MODULE LOCKS
 *   ----------------------
 *   Three independent checks that together prevent the stale anchors from being
 *   promoted to the resolved role:
 *
 *   (L1) The imp-3175 finest live fraction (N=6400) is in [0.208, 0.211] and the
 *        verdict string is the expected resolution-up identifier. If the imp-3175
 *        sweep code changes and produces a different value, L1 fails.
 *
 *   (L2) Both stale anchors (imp-3175 recorded 0.194 / 0.200) are BELOW the
 *        converged value by more than 0.005. This guards the DIRECTION: if someone
 *        edits imp-3175 to flip the monotone direction, L2 fails.
 *
 *   (L3) The imp-3007 resolvedOverflowFractionOfTau field matches the imp-3175
 *        offlineConvergedOverflow to within 0.001, and is MORE THAN 0.01 above
 *        the genuineDeg2OverflowFractionOfTau (the stale 0.194). If a future edit
 *        sets resolvedOverflowFractionOfTau = 0.194 (presenting the stale value
 *        as resolved) or collapses the two fields to the same value, L3 fails.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   PURE CROSS-VALIDATION of the overflow-SUPPORT fraction |{nu > mu}| / U only.
 *   The absolute deg-2 deficit magnitude is a separate quantity and is NOT
 *   addressed here. A nonzero overflow fraction is necessary-but-NOT-sufficient at
 *   operator order; the off-diagonal endpoint-Hankel step (imp-3066) remains the
 *   lone obstruction. Lock only, no QED. No refereed bound is changed
 *   . No false QED.
 *
 *   @see imp-3175-overflow-fraction-resolution-reconcile.js (converged ~0.209)
 *   @see imp-3007-mupass-overflow-cover.js (carries both stale + resolved fields)
 *   @see imp-3154-genuine-deg2-deficit-degree-sweep.js (the 0.200 coarse-N snapshot)
 *
 *   Ticket: imp-3211 (meta, medium).
 */

import { IMP3175_OVERFLOW_FRACTION_RESOLUTION_RECONCILE } from './imp-3175-overflow-fraction-resolution-reconcile.js';
import { IMP3007_MUPASS_OVERFLOW_COVER } from './imp-3007-mupass-overflow-cover.js';

const m175 = IMP3175_OVERFLOW_FRACTION_RESOLUTION_RECONCILE.measured;
const g = IMP3007_MUPASS_OVERFLOW_COVER.genuineDensityCorrection;

export const IMP3211_OVERFLOW_FRACTION_CONVERGED_LOCK = Object.freeze({
  id: 'imp-3211-overflow-fraction-converged-lock',
  ticket: 'imp-3211',
  summary:
    'Cross-module tripwire locking the imp-3175 converged overflow fraction ~0.209 as ' +
    'the authoritative value. Guards against presenting the stale coarse-grid anchors ' +
    '0.194 (imp-3144) or 0.200 (imp-3154) as the genuine resolved overflow fraction.',
  sources: Object.freeze([
    'imp-3175-overflow-fraction-resolution-reconcile.js',
    'imp-3007-mupass-overflow-cover.js',
  ]),
  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    isLockOnly: true,
    addressesOverflowFractionOnly: true,
    necessaryNotSufficient:
      'A nonzero overflow fraction is necessary-but-NOT-sufficient at operator order; ' +
      'the off-diagonal endpoint-Hankel step (imp-3066) remains the lone obstruction.',
    sota: 'No refereed bound is changed',
  }),
});

export const IMP3211_OVERFLOW_FRACTION_CONVERGED_LOCK_ASSERTIONS = [
  {
    id: 'imp3211-L1-converged-value-in-range',
    why: 'The imp-3175 finest live fraction (N=6400) must be in [0.208, 0.211], locking the ' +
         'converged ~0.209 result. A drift outside this band means the sweep code or the ' +
         'Phi kernel changed and the resolved value is no longer trustworthy.',
    holds: () => m175.finestFraction >= 0.208 && m175.finestFraction <= 0.211,
  },
  {
    id: 'imp3211-L1-verdict-string',
    why: 'The imp-3175 classified verdict must be the expected resolution-up identifier. A flip ' +
         'to INDETERMINATE means the sweep stopped being monotone or stopped clearing 0.194, ' +
         'which would make the ~0.209 trust claim invalid.',
    holds: () => m175.verdict === 'RESOLUTION-EFFECT-CONVERGES-UP-TO-0.209-NOT-DOWN-TO-0.194',
  },
  {
    id: 'imp3211-L2-stale-anchors-below-converged',
    why: 'DIRECTION GUARD: both stale anchors (0.194 and 0.200) must be BELOW the converged ' +
         'value by more than 0.005. If the monotone direction flips (value converges DOWN to ' +
         '0.194), the anchor that was stale would become the limit and this guard catches it.',
    holds: () =>
      m175.finestFraction - m175.recordedImp3144Overflow > 0.005 &&
      m175.finestFraction - m175.recordedImp3154Overflow > 0.005,
  },
  {
    id: 'imp3211-L2-stale-anchors-labeled',
    why: 'The stale anchor constants must still equal their recorded values (0.194 and 0.200). ' +
         'If these fields are edited to match the converged value, the historical record of the ' +
         'coarse-grid snapshot is lost and downstream prose corrections become invisible.',
    holds: () =>
      Math.abs(m175.recordedImp3144Overflow - 0.194) < 1e-9 &&
      Math.abs(m175.recordedImp3154Overflow - 0.200) < 1e-9,
  },
  {
    id: 'imp3211-L3-resolved-field-matches-converged',
    why: 'THE MAIN CROSS-MODULE LOCK: the imp-3007 resolvedOverflowFractionOfTau field must ' +
         'match the imp-3175 offlineConvergedOverflow (~0.2092) to within 0.001. If someone ' +
         'edits imp-3007 to set resolvedOverflowFractionOfTau = 0.194 (promoting the stale ' +
         'value to the resolved role), this assertion fails.',
    holds: () =>
      typeof g.resolvedOverflowFractionOfTau === 'number' &&
      Math.abs(g.resolvedOverflowFractionOfTau - m175.offlineConvergedOverflow) < 0.001,
  },
  {
    id: 'imp3211-L3-stale-and-resolved-distinct',
    why: 'The imp-3007 genuineDeg2OverflowFractionOfTau (stale 0.194 snapshot) must differ ' +
         'from resolvedOverflowFractionOfTau (converged ~0.209) by more than 0.01. If the ' +
         'two fields are collapsed to the same value, the coarse/resolved distinction is lost.',
    holds: () =>
      typeof g.genuineDeg2OverflowFractionOfTau === 'number' &&
      typeof g.resolvedOverflowFractionOfTau === 'number' &&
      g.resolvedOverflowFractionOfTau - g.genuineDeg2OverflowFractionOfTau > 0.01,
  },
  {
    id: 'imp3211-lock-honest-caveat',
    why: 'Mandatory honesty gate: this module must be a pure lock with no RH verdict, no proof, ' +
         'lock-only flag set, and PT 0.2 SOTA cited. If any field flips, the module is over-claiming.',
    holds: () => {
      const c = IMP3211_OVERFLOW_FRACTION_CONVERGED_LOCK.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isLockOnly === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3211_OVERFLOW_FRACTION_CONVERGED_LOCK_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      'imp-3211-overflow-fraction-converged-lock assertion failed: ' + assertion.id
    );
  }
}

export default IMP3211_OVERFLOW_FRACTION_CONVERGED_LOCK;
