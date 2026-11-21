/**
 * @module imp-97845-diag3-l6-nonmonotone-honest-status
 * @fileoverview imp-97845 -- HONEST-STATUS NOTE restating, standalone, the imp-97821 M3 result that at the
 *   sixth landmark L6 (sigma = 0.005) the direct DIAG3 = E_CC + E_ET + E_CF eps-ladder is NON-MONOTONE:
 *   +4.00e-9 at eps = 1e-3, round-off ~3.5e-16 at eps = 1e-4, then GROWS BACK to ~7.1e-10 at eps = 1e-5.
 *   Unlike the L5 landmark (imp-97710), which quarters cleanly as a clean O(eps^2) truncation ladder, L6
 *   no longer quarters: the collapsed E_CF axis (elasticity ~2.4e-7) is so small that landmark-bisection
 *   round-off in its finite difference overtakes the O(eps^2) truncation once eps shrinks. Every rung
 *   still stays below the 1e-8 stencil floor, so DIAG3 remains a pure stencil/noise floor (NOT a real
 *   residual) -- the deepest-rung signature is now the E_CF stencil-noise floor rather than clean
 *   second-order truncation. Documentation only: re-exports the imp-97821 M3 finding verbatim, no new
 *   numerics, no bound moves, NO QED.
 *
 * @see imp-97821-diag3-sixth-landmark-crossvalidation.js (source measurement: L6 eps-ladder, M1/M2/M3)
 * @see imp-97710-diag3-fourth-landmark-crossvalidation.js (the L5 landmark: clean O(eps^2) quartering)
 * @see imp-97689-diag3-additivity-euler-derivation.js (analytic Euler-additivity derivation)
 *
 * Ticket: imp-97845 (content, sonnet-4-6, sonnet). Honest-status note only; no bound on Lambda moves;
 * no refereed bound is changed; RH open; NO QED.
 */

import { IMP97821_DIAG3_SIXTH_LANDMARK_CROSSVALIDATION } from './imp-97821-diag3-sixth-landmark-crossvalidation.js';

const SRC = IMP97821_DIAG3_SIXTH_LANDMARK_CROSSVALIDATION;
const LADDER = SRC.diag3EpsLadder;

export const IMP97845_DIAG3_L6_NONMONOTONE_HONEST_STATUS = Object.freeze({
  ticket: 'imp-97845',
  question:
    'the imp-97821 M3 finding is that at the sixth landmark L6 (sigma = 0.005) the direct DIAG3 eps-ladder ' +
    'no longer quarters cleanly as it did at L5 -- does DIAG3 still sit below the stencil floor, and what ' +
    'is the deepest-rung signature of the departure from clean O(eps^2) quartering?',
  answer:
    'DIAG3 STAYS BELOW THE 1e-8 STENCIL FLOOR AT EVERY RUNG BUT NO LONGER QUARTERS CLEANLY -- the ' +
    'deepest-rung signature is the E_CF stencil-noise floor. At L6 the direct diagonal is ' +
    LADDER[0].DIAG3 + ' at eps = ' + LADDER[0].eps + ', drops to round-off ' + LADDER[1].DIAG3 +
    ' at eps = ' + LADDER[1].eps + ', then GROWS BACK to ' + LADDER[2].DIAG3 + ' at eps = ' + LADDER[2].eps +
    ' -- a non-monotone eps-ladder, unlike the clean O(eps^2) quartering seen at L5 (imp-97710). The cause ' +
    'is that the collapsed E_CF elasticity (' + SRC.reconstruction.E_CF + ') is so small that the ' +
    'landmark-bisection round-off in its finite difference overtakes the second-order truncation once eps ' +
    'shrinks past ' + LADDER[1].eps + '. Every rung still stays below the stencil floor, so DIAG3 remains ' +
    'a pure stencil/noise floor (NOT a real residual) at this sixth independent landmark.',
  epsLadder: LADDER,
  reconstructedECF: SRC.reconstruction.E_CF,
  stencilFloor: 1e-8,
  isNonMonotone: true,
  quartersCleanly: false,
  staysBelowStencilFloor: true,
  isRealResidual: false,
  anyBoundMoved: false,
  measurementOnly: true,
  isRigorous: false,
  qed: false,
});

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    IMP97845_DIAG3_L6_NONMONOTONE_HONEST_STATUS.isNonMonotone === true &&
    IMP97845_DIAG3_L6_NONMONOTONE_HONEST_STATUS.quartersCleanly === false &&
    IMP97845_DIAG3_L6_NONMONOTONE_HONEST_STATUS.staysBelowStencilFloor === true &&
    IMP97845_DIAG3_L6_NONMONOTONE_HONEST_STATUS.isRealResidual === false &&
    Math.abs(LADDER[2].DIAG3) > Math.abs(LADDER[1].DIAG3) &&
    LADDER.every((r) => Math.abs(r.DIAG3) < IMP97845_DIAG3_L6_NONMONOTONE_HONEST_STATUS.stencilFloor) &&
    IMP97845_DIAG3_L6_NONMONOTONE_HONEST_STATUS.anyBoundMoved === false &&
    IMP97845_DIAG3_L6_NONMONOTONE_HONEST_STATUS.measurementOnly === true &&
    IMP97845_DIAG3_L6_NONMONOTONE_HONEST_STATUS.isRigorous === false &&
    IMP97845_DIAG3_L6_NONMONOTONE_HONEST_STATUS.qed === false
  )
) {
  throw new Error(
    'imp-97845-diag3-l6-nonmonotone-honest-status assertion FAILED: the L6 DIAG3 eps-ladder must record ' +
      'as non-monotone yet below the stencil floor, not as a real residual.'
  );
}

export default IMP97845_DIAG3_L6_NONMONOTONE_HONEST_STATUS;
