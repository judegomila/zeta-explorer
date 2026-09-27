/**
 * @module imp-124783-diag3-l6-nonmonotone-honest-status
 * @fileoverview imp-124783 -- HONEST-STATUS NOTE restating, standalone, the imp-97821 (M3) finding that the
 *   DIAG3 direct-diagonal eps-ladder at the sixth landmark L6 (sigma = 0.005) is NON-monotone in eps, unlike
 *   the clean O(eps^2) quartering seen at the fifth landmark L5. At L6 the collapsed E_CF single-axis
 *   elasticity has shrunk to ~2.4e-7 (~13.5x smaller than its L5 value), so its central-difference finite
 *   difference sits at the landmark-bisection round-off floor rather than in the clean O(eps^2) truncation
 *   regime: DIAG3 = +4.00e-9 at eps = 1e-3, drops to round-off ~3.5e-16 at eps = 1e-4, then GROWS BACK to
 *   ~7.1e-10 at eps = 1e-5. Every rung still stays below 1e-8, so DIAG3 remains a pure stencil / noise floor,
 *   NOT a real residual -- the non-monotonicity is the collapsed-E_CF round-off overtaking the O(eps^2)
 *   truncation, not a breakdown of the imp-97689 Euler-additivity identity. Documentation only: re-exports the
 *   imp-97821 (M3) verdict verbatim, no new numerics, no bound moves, NO QED.
 *
 * @see imp-97821-diag3-sixth-landmark-crossvalidation.js (source measurement: sixth-landmark cross-validation)
 * @see imp-97689-diag3-additivity-euler-derivation.js (the Euler-additivity identity this DOES NOT break)
 * @see imp-97710-diag3-fourth-landmark-crossvalidation.js (the L5 clean O(eps^2) quartering this contrasts with)
 *
 * Ticket: imp-124783 (content, sonnet-4-6, sonnet). Honest-status note only; no bound on Lambda moves;
 * PT Lambda <= 0.2 remains SOTA; RH open; NO QED.
 */

import {
  IMP97821_DIAG3_SIXTH_LANDMARK_CROSSVALIDATION as SRC,
} from './imp-97821-diag3-sixth-landmark-crossvalidation.js';

export const IMP124783_DIAG3_L6_NONMONOTONE_HONEST_STATUS = Object.freeze({
  ticket: 'imp-124783',
  question:
    'at the sixth landmark L6 (sigma = 0.005), does the direct-diagonal DIAG3 eps-ladder still quarter cleanly ' +
    'as O(eps^2) like it did at L5, or does something else show up as the collapsed E_CF axis shrinks?',
  answer:
    'It does NOT quarter cleanly: the DIAG3 eps-ladder becomes NON-monotone at L6 because the collapsed E_CF ' +
    'single-axis elasticity (~2.4e-7, ~13.5x smaller than at L5) has shrunk enough that the landmark-bisection ' +
    'round-off in its central-difference finite difference overtakes the O(eps^2) truncation once eps is small. ' +
    'DIAG3 goes +4.00e-9 (eps=1e-3) -> ~3.5e-16 (eps=1e-4) -> ~7.1e-10 (eps=1e-5), growing back instead of ' +
    'continuing to shrink. Every rung stays below 1e-8, so this is a stencil / noise floor, NOT a real residual ' +
    'and NOT a breakdown of the underlying Euler-additivity identity (the closed-form NUM and reconstructed sum ' +
    'both remain machine-zero at L6, per imp-97821 M1/M2).',
  diag3EpsLadder: SRC.diag3EpsLadder,
  collapsedFlowFloor: SRC.collapsedFlowFloor,
  nonmonotoneIsNoiseFloorNotResidual: true,
  eulerIdentityStillHolds: true,
  anyBoundMoved: false,
  measurementOnly: true,
  isRigorous: false,
  qed: false,
});

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    Array.isArray(IMP124783_DIAG3_L6_NONMONOTONE_HONEST_STATUS.diag3EpsLadder) &&
    IMP124783_DIAG3_L6_NONMONOTONE_HONEST_STATUS.diag3EpsLadder.length === 3 &&
    IMP124783_DIAG3_L6_NONMONOTONE_HONEST_STATUS.diag3EpsLadder.every((r) => Math.abs(r.DIAG3) < 1e-8) &&
    Math.abs(IMP124783_DIAG3_L6_NONMONOTONE_HONEST_STATUS.diag3EpsLadder[2].DIAG3) >
      Math.abs(IMP124783_DIAG3_L6_NONMONOTONE_HONEST_STATUS.diag3EpsLadder[1].DIAG3) &&
    IMP124783_DIAG3_L6_NONMONOTONE_HONEST_STATUS.nonmonotoneIsNoiseFloorNotResidual === true &&
    IMP124783_DIAG3_L6_NONMONOTONE_HONEST_STATUS.eulerIdentityStillHolds === true &&
    IMP124783_DIAG3_L6_NONMONOTONE_HONEST_STATUS.anyBoundMoved === false &&
    IMP124783_DIAG3_L6_NONMONOTONE_HONEST_STATUS.measurementOnly === true &&
    IMP124783_DIAG3_L6_NONMONOTONE_HONEST_STATUS.isRigorous === false &&
    IMP124783_DIAG3_L6_NONMONOTONE_HONEST_STATUS.qed === false
  )
) {
  throw new Error(
    'imp-124783-diag3-l6-nonmonotone-honest-status assertion FAILED: the L6 DIAG3 eps-ladder must record as a ' +
      'non-monotone stencil/noise floor below 1e-8 at every rung, not a breakdown of the Euler-additivity identity.'
  );
}

export default IMP124783_DIAG3_L6_NONMONOTONE_HONEST_STATUS;
