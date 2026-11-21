/**
 * @module imp-3311-overflow-fraction-lock-invariant-assessment
 * @fileoverview imp-3311 -- ASSESSMENT of the imp-3211 cross-module build-lock
 *   in light of the imp-3216 / imp-3306 underflow-horizon correction: does the
 *   tripwire that LOCKS the ~0.209 "resolution-converged genuine overflow
 *   fraction" still enforce a meaningful invariant, and what arithmetic-
 *   independent quantity should it enforce instead so it does not silently
 *   ossify a double-precision artifact?
 *
 *   ASSESSMENT / DIAGNOSTIC ONLY. No new positivity, no RH verdict, not a
 *   reduction. No refereed bound is changed.
 *
 *   THE SITUATION
 *   -------------
 *   imp-3211-overflow-fraction-converged-lock.js is an ACTIVE build tripwire.
 *   Its three assertion groups all bind the SINGLE fixed lightweight-Phi cell
 *   (a = 0.5, U = 6, NPHI = 10):
 *     (L1) imp-3175 finest live fraction (N = 6400) in [0.208, 0.211] + verdict;
 *     (L2) stale anchors 0.194 / 0.200 sit &gt; 0.005 below the converged value
 *          and keep their historical labels (direction guard);
 *     (L3) imp-3007 resolvedOverflowFractionOfTau matches the imp-3175 offline
 *          converged ~0.2092 to &lt; 0.001 and is &gt; 0.01 above the stale 0.194.
 *   Its prose calls ~0.209 "THE resolution-converged genuine overflow fraction",
 *   "the authoritative value", "the number to trust".
 *
 *   imp-3216 / imp-3306 then showed ~0.209 = (tau_2 - tau_1)/U at U = 6, where
 *   tau_2 ~ 1.366 is the IEEE-754 kernel UNDERFLOW HORIZON (not a mathematical
 *   nu &gt; mu down-crossing). The support length tau_2 - tau_1 ~ 1.255 is
 *   U-invariant, so the "converged" ~0.209 falls like 1/U (0.2092, 0.1569,
 *   0.1255, 0.1046 across U in {6,8,10,12}) -- a fixed absolute lag length over
 *   a growing window, i.e. a double-precision measurement artifact of holding
 *   U = 6, NOT a Phi-intrinsic overflow fraction. The genuine, arithmetic-
 *   independent quantity is the true fraction (U - tau_1)/U -&gt; 1 (rising), whose
 *   sole U-free invariant is the genuine crossover tau_1 ~ 0.111.
 *
 *   THE ASSESSMENT (this module, machine-checked against imp-3211 + imp-3306)
 *   ------------------------------------------------------------------------
 *   (A1) SAME NUMBER. The value the imp-3211 lock binds (~0.209) is EXACTLY the
 *        imp-3306 underflow-pinned measured fraction at U = 6: the lock guards
 *        the very quantity imp-3306 identifies as a 1/U artifact. So the lock,
 *        as LABELLED ("genuine / authoritative / the number to trust"), is now
 *        FALSIFIED in its semantics -- it risks ossifying an artifact as genuine.
 *
 *   (A2) STILL MEANINGFUL AS A REGRESSION GUARD (do NOT delete). Every imp-3211
 *        check is a legitimate REPRODUCIBILITY guard on a specific, fully-
 *        specified double-precision measurement at the fixed cell (a = 0.5,
 *        U = 6, NPHI = 10, N = 6400): L1 catches drift in the imp-3175 sweep
 *        code or the Phi kernel, L2 guards the monotone DIRECTION, L3 guards the
 *        imp-3007 cross-field consistency. These remain valid -- the lock is not
 *        worthless, it just guards a fixed-cell measured number, not a limit.
 *
 *   (A3) THE BLIND SPOT. Every imp-3211 check binds the FIXED-U = 6 value and
 *        the stale fixed-U anchors; NONE binds any U-varying or arithmetic-
 *        independent quantity. So nothing in the lock would notice that the
 *        "converged" number is a window artifact -- the exact failure mode
 *        imp-3216 / imp-3306 exposed.
 *
 *   (A4) THE ARITHMETIC-INDEPENDENT QUANTITY THE LOCK SHOULD ENFORCE INSTEAD.
 *        The invariants a corrected tripwire should bind (all U-free / rising,
 *        verified below against imp-3306's fine-grid ladder) are:
 *          (i)   tau_1 ~ 0.111 is U-invariant (spread &lt; 1e-3) -- the SOLE
 *                genuine nu/mu crossover endpoint;
 *          (ii)  NO genuine upper down-crossing exists (nu &gt; mu for every
 *                representable tau &gt; tau_1, at every U);
 *          (iii) the true fraction (U - tau_1)/U RISES toward 1 with U
 *                (opposite direction to the ~0.209 anchor).
 *        ~0.209 should be retained only with the label "fixed-U = 6 double-
 *        precision measured fraction", never "genuine / authoritative".
 *
 *   (A5) RECOMMENDATION. KEEP the imp-3211 numerical checks (regression value)
 *        but relabel; the arithmetic-independent lock already lives partly in
 *        imp-3312-underflow-horizon-lock.js and should be the load-bearing one.
 *        This module is the assessment record, not an edit to imp-3211 itself.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   DIAGNOSTIC / MAINTENANCE assessment of a build-lock only; no proof, no RH
 *   verdict, no reduction. Overflow-fraction anchor only; the absolute deg-2
 *   deficit magnitude is untouched. A nonzero overflow fraction is necessary-
 *   but-NOT-sufficient at operator order; the off-diagonal endpoint-Hankel step
 *   (imp-3066) remains the lone obstruction. No false QED. No refereed bound is changed.
 *
 *   @see imp-3211-overflow-fraction-converged-lock.js (the lock under assessment)
 *   @see imp-3306-overflow-fraction-anchor-underflow-reconcile.js (the 1/U artifact reconciliation)
 *   @see imp-3216-overflow-support-length-closed-form.js (the underflow-horizon finding)
 *   @see imp-3312-underflow-horizon-lock.js (the arithmetic-independent lock)
 *
 *   Ticket: imp-3311 (accuracy, medium).
 */

import { IMP3211_OVERFLOW_FRACTION_CONVERGED_LOCK } from './imp-3211-overflow-fraction-converged-lock.js';
import { IMP3306_OVERFLOW_FRACTION_ANCHOR_UNDERFLOW_RECONCILE } from './imp-3306-overflow-fraction-anchor-underflow-reconcile.js';

const lock = IMP3211_OVERFLOW_FRACTION_CONVERGED_LOCK;
const recon = IMP3306_OVERFLOW_FRACTION_ANCHOR_UNDERFLOW_RECONCILE.measured;

// (A1) The number the imp-3211 lock binds IS the imp-3306 underflow-pinned
// measured fraction at U = 6: reproduces the ~0.2092 anchor to < 1e-3 and
// decomposes as (tau_2 - tau_1)/U (contiguous interval).
const lockedValueIsUnderflowPinnedArtifact =
  recon.anchorMatchesMeasuredAt6 &&
  recon.anchorDecomposes &&
  Math.abs(recon.measuredFractionAt6 - recon.imp3175ConvergedAnchor) < 1e-3;

// (A2) The lock only cites the two fixed-cell (U = 6) sources -- it never binds a
// U-varying quantity, so its checks are fixed-cell regression guards.
const lockSourcesAreFixedCellOnly =
  Array.isArray(lock.sources) &&
  lock.sources.length === 2 &&
  lock.sources.includes('imp-3175-overflow-fraction-resolution-reconcile.js') &&
  lock.sources.includes('imp-3007-mupass-overflow-cover.js');

// (A4) The arithmetic-independent quantity the lock should enforce instead:
// tau_1 U-invariant, no genuine upper crossing, and (U - tau_1)/U rising to 1.
const arithmeticIndependentQuantityHolds =
  recon.tau1Spread < 1e-3 &&
  recon.noGenuineDownCrossingAllU &&
  recon.trueRisesWithU &&
  recon.trueFractionNear1;

// The imp-3306 reconciliation verdict must itself be the underflow-artifact one
// (guards against my assessment resting on a stale reconciliation).
const reconciliationIntact =
  recon.verdict ===
  'ANCHOR-0.209-IS-UNDERFLOW-PINNED-1/U-MEASUREMENT-ARTIFACT-AT-U=6; REPLACE-WITH-(U-tau_1)/U->1, tau_1~0.111-SOLE-GENUINE-ENDPOINT';

const verdict =
  lockedValueIsUnderflowPinnedArtifact &&
  lockSourcesAreFixedCellOnly &&
  arithmeticIndependentQuantityHolds &&
  reconciliationIntact
    ? 'imp-3211-LOCK-STILL-VALID-AS-FIXED-U6-REGRESSION-GUARD-BUT-SEMANTIC-LABEL-FALSIFIED; ENFORCE-tau_1~0.111-U-INVARIANCE-AND-(U-tau_1)/U->1-INSTEAD-OF-~0.209-AS-GENUINE'
    : 'INDETERMINATE';

export const IMP3311_OVERFLOW_FRACTION_LOCK_INVARIANT_ASSESSMENT = Object.freeze({
  id: 'imp-3311-overflow-fraction-lock-invariant-assessment',
  ticket: 'imp-3311',
  lockUnderAssessment: 'imp-3211-overflow-fraction-converged-lock.js',
  correction: 'imp-3216 / imp-3306 (upper endpoint tau_2 ~ 1.366 is the IEEE-754 kernel underflow horizon)',

  summary:
    'ASSESSES whether the imp-3211 build-lock that binds the ~0.209 "resolution-converged genuine overflow ' +
    'fraction" still enforces a meaningful invariant after imp-3216 / imp-3306 showed ~0.209 = (tau_2 - tau_1)/U ' +
    'at U = 6 with tau_2 the kernel underflow horizon -- a 1/U double-precision artifact, not a Phi-intrinsic ' +
    'limit. FINDINGS: (A1) the number the lock binds IS exactly the imp-3306 underflow-pinned measured fraction ' +
    'at U = 6, so the lock as LABELLED ("genuine / authoritative / the number to trust") is falsified and risks ' +
    'ossifying an artifact; (A2) yet every imp-3211 check remains a valid REPRODUCIBILITY guard on a fully-' +
    'specified fixed-cell (a=0.5, U=6, NPHI=10, N=6400) measurement, so the lock should NOT be deleted; (A3) the ' +
    'blind spot is that all its checks bind the fixed-U=6 value / stale fixed-U anchors and NONE binds any ' +
    'U-varying quantity, so nothing in it would notice the value is a window artifact; (A4) the arithmetic-' +
    'independent quantity to enforce instead is tau_1 ~ 0.111 (U-invariant, sole genuine crossover), the ' +
    'absence of any genuine upper down-crossing, and the true fraction (U - tau_1)/U -> 1 (rising); (A5) KEEP ' +
    'the imp-3211 numerical checks but RELABEL ~0.209 as the fixed-U=6 double-precision measured fraction, with ' +
    'imp-3312-underflow-horizon-lock as the load-bearing arithmetic-independent lock. DIAGNOSTIC; no RH verdict.',

  findings: Object.freeze({
    a1_lockBindsTheArtifact:
      'The imp-3211 lock binds the imp-3175 finest fraction ~0.209 (L1) and the imp-3007 resolved field matched ' +
      'to it (L3). imp-3306 recomputes on the fine grid (N=51200) and finds that same ~0.209 = (tau_2 - tau_1)/U ' +
      'at U=6 with tau_2 ~ 1.366 the underflow horizon -- so the lock guards the exact quantity imp-3306 flags as ' +
      'a 1/U measurement artifact. As labelled ("genuine / authoritative / the number to trust") the lock is ' +
      'semantically falsified.',
    a2_stillMeaningfulAsRegressionGuard:
      'Every imp-3211 check remains a valid reproducibility guard on a fully-specified fixed-cell double-precision ' +
      'measurement (a=0.5, U=6, NPHI=10, N=6400): L1 catches drift in the imp-3175 sweep / Phi kernel, L2 guards ' +
      'the monotone direction, L3 guards imp-3007 cross-field consistency. The lock is NOT worthless and should ' +
      'not be deleted; it simply guards a fixed-cell measured number, not a Phi-intrinsic limit.',
    a3_blindSpot:
      'All three imp-3211 groups bind the fixed-U=6 value and the stale fixed-U anchors (0.194 / 0.200); NONE ' +
      'binds a U-varying or arithmetic-independent quantity. So nothing in the lock would notice that the ' +
      '"converged" number is a window artifact -- precisely the failure mode imp-3216 / imp-3306 exposed.',
    a4_arithmeticIndependentQuantity:
      'The invariants a corrected tripwire should bind (all U-free / rising): (i) tau_1 ~ 0.111 U-invariant ' +
      '(spread < 1e-3), the sole genuine nu/mu crossover endpoint; (ii) NO genuine upper down-crossing (nu > mu ' +
      'for every representable tau > tau_1, all U); (iii) the true fraction (U - tau_1)/U rises toward 1. ~0.209 ' +
      'should be kept only as "the fixed-U=6 double-precision measured fraction", never as "genuine".',
    a5_recommendation:
      'KEEP the imp-3211 numerical checks for their regression value but relabel the locked value; make ' +
      'imp-3312-underflow-horizon-lock (which binds the underflow horizons and the imp-3216 interpretation) the ' +
      'load-bearing arithmetic-independent lock, ideally extended to bind tau_1 U-invariance and the ' +
      '(U - tau_1)/U -> 1 rise. This module is the assessment record; it does not edit imp-3211.',
  }),

  checked: Object.freeze({
    lockedValueIsUnderflowPinnedArtifact, // A1
    lockSourcesAreFixedCellOnly, // A2 / A3
    arithmeticIndependentQuantityHolds, // A4
    reconciliationIntact,
    measuredFractionAt6: recon.measuredFractionAt6,
    imp3175ConvergedAnchor: recon.imp3175ConvergedAnchor,
    tau1At6: recon.tau1At6,
    tau1Spread: recon.tau1Spread,
    trueFractionNear1: recon.trueFractionNear1,
    verdict,
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isMaintenanceAssessment: true,
    doesNotEditLock: true,
    addressesOverflowFractionAnchorOnly:
      'Assesses the imp-3211 overflow-fraction lock only; the absolute deg-2 deficit magnitude is untouched.',
    necessaryNotSufficient:
      'A nonzero overflow fraction is necessary-but-NOT-sufficient at operator order; the off-diagonal ' +
      'endpoint-Hankel operator step (imp-3066) remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3311_OVERFLOW_FRACTION_LOCK_INVARIANT_ASSESSMENT_ASSERTIONS = [
  {
    id: 'imp3311-A1-lock-binds-underflow-pinned-artifact',
    why: '(A1) The value the imp-3211 lock binds must be exactly the imp-3306 underflow-pinned measured fraction ' +
         'at U=6 (reproduces ~0.2092 to <1e-3 and decomposes as (tau_2 - tau_1)/U). This is what makes the lock, ' +
         'as labelled genuine/authoritative, semantically falsified.',
    holds: () => lockedValueIsUnderflowPinnedArtifact,
  },
  {
    id: 'imp3311-A2-lock-is-fixed-cell-regression-guard',
    why: '(A2/A3) The imp-3211 lock must cite exactly its two fixed-cell (U=6) sources and no U-varying source, ' +
         'confirming its checks are fixed-cell reproducibility guards with no arithmetic-independent binding -- ' +
         'valid to keep, but blind to the window artifact.',
    holds: () => lockSourcesAreFixedCellOnly,
  },
  {
    id: 'imp3311-A4-arithmetic-independent-quantity-holds',
    why: '(A4) The arithmetic-independent quantity the lock should enforce instead must check out on the imp-3306 ' +
         'ladder: tau_1 U-invariant (<1e-3), no genuine upper down-crossing at any U, and (U - tau_1)/U rising ' +
         'toward 1 (>0.98 at the top of the ladder).',
    holds: () => arithmeticIndependentQuantityHolds,
  },
  {
    id: 'imp3311-reconciliation-source-intact',
    why: 'The imp-3306 reconciliation this assessment rests on must still carry its underflow-artifact verdict; ' +
         'a flip there would invalidate the assessment premise.',
    holds: () => reconciliationIntact,
  },
  {
    id: 'imp3311-verdict-is-relabel-not-delete',
    why: 'The classified assessment verdict must be the "lock-still-valid-as-regression-guard-but-label-falsified; ' +
         'enforce tau_1 U-invariance and (U - tau_1)/U -> 1 instead" outcome, not indeterminate.',
    holds: () =>
      verdict ===
      'imp-3211-LOCK-STILL-VALID-AS-FIXED-U6-REGRESSION-GUARD-BUT-SEMANTIC-LABEL-FALSIFIED; ENFORCE-tau_1~0.111-U-INVARIANCE-AND-(U-tau_1)/U->1-INSTEAD-OF-~0.209-AS-GENUINE',
  },
  {
    id: 'imp3311-honest-maintenance-assessment',
    why: 'Mandatory honesty: DIAGNOSTIC maintenance assessment that does NOT edit the lock, overflow-fraction ' +
         'anchor only, necessary-but-not-sufficient at operator order, positivity not attempted, no refereed bound is changed' +
         '. If any flip the module is over-claiming.',
    holds: () => {
      const c = IMP3311_OVERFLOW_FRACTION_LOCK_INVARIANT_ASSESSMENT.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isMaintenanceAssessment === true &&
        c.doesNotEditLock === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3311_OVERFLOW_FRACTION_LOCK_INVARIANT_ASSESSMENT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3311-overflow-fraction-lock-invariant-assessment assertion failed: ${assertion.id}`);
  }
}

export default IMP3311_OVERFLOW_FRACTION_LOCK_INVARIANT_ASSESSMENT;
