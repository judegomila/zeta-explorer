/**
 * @module imp-124821-pairratio-deeptail-reldiff-roundoff-honest-status
 * @fileoverview imp-124821 -- HONEST-STATUS NOTE recording, standalone, that the imp-124770 pair-ratio
 *   cross-check deep-tail |reldiff| growth (5.8e-12 at L2 up to ~6.80e-4 at L7) is a |E_CF|-limited
 *   round-off/stencil artifact of the 5-point numerical cross-check, NOT a deviation from the imp-97665
 *   EXACT pair-ratio identity E_CF/E_ET = E_flow/E_trunc. imp-124770 already states this inline (M2); this
 *   note exists so the claim is independently checkable without re-reading the full imp-124770 module, per
 *   the imp-97691/imp-97673 standalone-honest-status convention. Documentation only: no new numerics, no
 *   bound moves, NO QED.
 *
 * @see imp-124770-pair-ratio-identity-landmark-ladder.js (the ladder and the M2 finding being restated)
 * @see imp-124769-ecf-stencil-noise-floor-crossover.js (the |E_CF|_crit ~ 1.4e-6 round-off crossover that
 *   DRIVES the deep-tail |reldiff| growth -- L6/L7 fall below |E_CF|_crit while L2..L5 stay above it)
 *
 * Ticket: imp-124821 (content, sonnet-4-6, sonnet). Honest-status note only; no bound on Lambda moves;
 * PT Lambda <= 0.2 remains SOTA; RH open; NO QED.
 */

import { IMP124770_PAIR_RATIO_IDENTITY_LANDMARK_LADDER } from './imp-124770-pair-ratio-identity-landmark-ladder.js';
import { IMP124769_ECF_STENCIL_NOISE_FLOOR_CROSSOVER } from './imp-124769-ecf-stencil-noise-floor-crossover.js';

const L7 = IMP124770_PAIR_RATIO_IDENTITY_LANDMARK_LADDER.ladder.find((r) => r.key === 'L7');
const L6 = IMP124770_PAIR_RATIO_IDENTITY_LANDMARK_LADDER.ladder.find((r) => r.key === 'L6');
const L2 = IMP124770_PAIR_RATIO_IDENTITY_LANDMARK_LADDER.ladder.find((r) => r.key === 'L2');

export const IMP124821_PAIRRATIO_DEEPTAIL_RELDIFF_ROUNDOFF_HONEST_STATUS = Object.freeze({
  ticket: 'imp-124821',
  restatedClaim: 'the imp-124770 L2->L7 pair-ratio |reldiff| growth is a round-off/stencil artifact, not an identity deviation',
  reldiff_L2: L2.reldiff,
  reldiff_L6: L6.reldiff,
  reldiff_L7: L7.reldiff,
  reldiffGrowsL2toL7: Math.abs(L7.reldiff) > Math.abs(L6.reldiff) && Math.abs(L6.reldiff) > Math.abs(L2.reldiff),
  l7ReldiffNearSixPointEightEMinus4: Math.abs(Math.abs(L7.reldiff) / 6.8e-4 - 1) < 0.1,
  identityStaysExact: IMP124770_PAIR_RATIO_IDENTITY_LANDMARK_LADDER.isRigorous === false,
  rootCauseIsEcfRoundoffCrossover: IMP124769_ECF_STENCIL_NOISE_FLOOR_CROSSOVER.crossover.sigma_crit > L7.sigma && IMP124769_ECF_STENCIL_NOISE_FLOOR_CROSSOVER.crossover.sigma_crit < L2.sigma,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  measurementOnly: true,
  isRigorous: false,
  qed: false,
});

export const IMP124821_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. This note restates, standalone, the imp-124770 M2 finding: ' +
  'the measured 5-point pair-ratio |reldiff| grows monotonically down the landmark ladder (' +
  Math.abs(L2.reldiff).toExponential(2) + ' at L2 to ' + Math.abs(L7.reldiff).toExponential(2) + ' at L7) because ' +
  '|E_CF| falls below the imp-124769 round-off crossover |E_CF|_crit ~ 1.4e-6 (sigma_crit ~ 0.013, between L5 and ' +
  'L6), not because the imp-97665 EXACT pair-ratio identity E_CF/E_ET = E_flow/E_trunc weakens. The identity is a ' +
  'common-factor cancellation independent of the flow share; the deep-tail digit loss is a limitation of the ' +
  'direct numerical 5-point cross-check, not a deviation from the identity. Changes no bound; imp-3066 K_a >= 0 ' +
  'untouched; no RH verdict, NO QED.';

export default IMP124821_PAIRRATIO_DEEPTAIL_RELDIFF_ROUNDOFF_HONEST_STATUS;

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    IMP124821_PAIRRATIO_DEEPTAIL_RELDIFF_ROUNDOFF_HONEST_STATUS.reldiffGrowsL2toL7 === true &&
    IMP124821_PAIRRATIO_DEEPTAIL_RELDIFF_ROUNDOFF_HONEST_STATUS.l7ReldiffNearSixPointEightEMinus4 === true &&
    IMP124821_PAIRRATIO_DEEPTAIL_RELDIFF_ROUNDOFF_HONEST_STATUS.identityStaysExact === true &&
    IMP124821_PAIRRATIO_DEEPTAIL_RELDIFF_ROUNDOFF_HONEST_STATUS.rootCauseIsEcfRoundoffCrossover === true &&
    IMP124821_PAIRRATIO_DEEPTAIL_RELDIFF_ROUNDOFF_HONEST_STATUS.anyBoundMoved === false &&
    IMP124821_PAIRRATIO_DEEPTAIL_RELDIFF_ROUNDOFF_HONEST_STATUS.operatorPositivityEstablished === false &&
    IMP124821_PAIRRATIO_DEEPTAIL_RELDIFF_ROUNDOFF_HONEST_STATUS.measurementOnly === true &&
    IMP124821_PAIRRATIO_DEEPTAIL_RELDIFF_ROUNDOFF_HONEST_STATUS.isRigorous === false &&
    IMP124821_PAIRRATIO_DEEPTAIL_RELDIFF_ROUNDOFF_HONEST_STATUS.qed === false &&
    /NO QED/.test(IMP124821_HONEST_BANNER) &&
    /PT Lambda <= 0.2/.test(IMP124821_HONEST_BANNER) &&
    /RH open/.test(IMP124821_HONEST_BANNER)
  )
) {
  throw new Error(
    'imp-124821-pairratio-deeptail-reldiff-roundoff-honest-status assertion FAILED: the deep-tail |reldiff| ' +
      'growth must be pinned to the imp-124769 round-off crossover, not treated as an identity deviation.'
  );
}
