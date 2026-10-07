/**
 * @module imp-124921-ecf-crossover-reldiff-roundoff-causal-chain-note
 * @fileoverview imp-124921 -- STANDALONE REFERENCE NOTE chaining three prior findings into one causal narrative,
 *   for discoverability: (1) imp-124769 pins the |E_CF| round-off crossover |E_CF|_crit ~ 1.4e-6 (sigma_crit ~
 *   0.013, between landmarks L5 and L6); (2) imp-124770 measures the pair-ratio cross-check |reldiff| growing
 *   monotonically down the L2..L7 landmark ladder; (3) imp-124821 attributes that growth to crossing the
 *   imp-124769 crossover, NOT to a deviation from the imp-97665 EXACT identity E_CF/E_ET = E_flow/E_trunc. Each
 *   of the three already cross-references its neighbors inline; this note exists so the full three-step chain is
 *   readable from one place without following the citation graph. Documentation only: no new numerics, no bound
 *   moves, NO QED.
 *
 * @see imp-124769-ecf-stencil-noise-floor-crossover.js (step 1: the crossover pin)
 * @see imp-124770-pair-ratio-identity-landmark-ladder.js (step 2: the reldiff growth ladder)
 * @see imp-124821-pairratio-deeptail-reldiff-roundoff-honest-status.js (step 3: the attribution)
 *
 * Ticket: imp-124921 (content, sonnet-4-6, sonnet). Reference note only; no bound on Lambda moves; PT Lambda <=
 * 0.2 remains SOTA; RH open; NO QED.
 */

import { IMP124769_ECF_STENCIL_NOISE_FLOOR_CROSSOVER } from './imp-124769-ecf-stencil-noise-floor-crossover.js';
import { IMP124770_PAIR_RATIO_IDENTITY_LANDMARK_LADDER } from './imp-124770-pair-ratio-identity-landmark-ladder.js';
import {
  IMP124821_PAIRRATIO_DEEPTAIL_RELDIFF_ROUNDOFF_HONEST_STATUS,
  IMP124821_HONEST_BANNER,
} from './imp-124821-pairratio-deeptail-reldiff-roundoff-honest-status.js';

const L2 = IMP124770_PAIR_RATIO_IDENTITY_LANDMARK_LADDER.ladder.find((r) => r.key === 'L2');
const L7 = IMP124770_PAIR_RATIO_IDENTITY_LANDMARK_LADDER.ladder.find((r) => r.key === 'L7');

export const IMP124921_ECF_CROSSOVER_RELDIFF_ROUNDOFF_CAUSAL_CHAIN_NOTE = Object.freeze({
  ticket: 'imp-124921',
  restatedClaim: 'one causal chain: imp-124769 crossover -> imp-124770 reldiff growth -> imp-124821 attribution',
  chain: [
    {
      step: 1,
      ticket: 'imp-124769',
      claim: 'pins the |E_CF| round-off crossover',
      value: 'E_CF_crit ~ ' + IMP124769_ECF_STENCIL_NOISE_FLOOR_CROSSOVER.crossover.E_CF_crit.toExponential(2) +
        ', sigma_crit ~ ' + IMP124769_ECF_STENCIL_NOISE_FLOOR_CROSSOVER.crossover.sigma_crit.toExponential(2) +
        ', between L5 and L6',
    },
    {
      step: 2,
      ticket: 'imp-124770',
      claim: 'measures the pair-ratio |reldiff| growing monotonically down the landmark ladder',
      value: Math.abs(L2.reldiff).toExponential(2) + ' at L2 to ' + Math.abs(L7.reldiff).toExponential(2) + ' at L7',
    },
    {
      step: 3,
      ticket: 'imp-124821',
      claim: 'attributes that growth to crossing the imp-124769 round-off crossover, not an identity deviation',
      value: IMP124821_PAIRRATIO_DEEPTAIL_RELDIFF_ROUNDOFF_HONEST_STATUS.restatedClaim,
    },
  ],
  chainIsConsistent:
    IMP124821_PAIRRATIO_DEEPTAIL_RELDIFF_ROUNDOFF_HONEST_STATUS.rootCauseIsEcfRoundoffCrossover === true &&
    IMP124821_PAIRRATIO_DEEPTAIL_RELDIFF_ROUNDOFF_HONEST_STATUS.reldiffGrowsL2toL7 === true,
  identityStaysExact: IMP124770_PAIR_RATIO_IDENTITY_LANDMARK_LADDER.isRigorous === false,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  measurementOnly: true,
  isRigorous: false,
  qed: false,
});

export const IMP124921_HONEST_BANNER = IMP124821_HONEST_BANNER;

export default IMP124921_ECF_CROSSOVER_RELDIFF_ROUNDOFF_CAUSAL_CHAIN_NOTE;

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    IMP124921_ECF_CROSSOVER_RELDIFF_ROUNDOFF_CAUSAL_CHAIN_NOTE.chain.length === 3 &&
    IMP124921_ECF_CROSSOVER_RELDIFF_ROUNDOFF_CAUSAL_CHAIN_NOTE.chainIsConsistent === true &&
    IMP124921_ECF_CROSSOVER_RELDIFF_ROUNDOFF_CAUSAL_CHAIN_NOTE.identityStaysExact === true &&
    IMP124921_ECF_CROSSOVER_RELDIFF_ROUNDOFF_CAUSAL_CHAIN_NOTE.anyBoundMoved === false &&
    IMP124921_ECF_CROSSOVER_RELDIFF_ROUNDOFF_CAUSAL_CHAIN_NOTE.operatorPositivityEstablished === false &&
    IMP124921_ECF_CROSSOVER_RELDIFF_ROUNDOFF_CAUSAL_CHAIN_NOTE.measurementOnly === true &&
    IMP124921_ECF_CROSSOVER_RELDIFF_ROUNDOFF_CAUSAL_CHAIN_NOTE.isRigorous === false &&
    IMP124921_ECF_CROSSOVER_RELDIFF_ROUNDOFF_CAUSAL_CHAIN_NOTE.qed === false &&
    /NO QED/.test(IMP124921_HONEST_BANNER) &&
    /PT Lambda <= 0.2/.test(IMP124921_HONEST_BANNER) &&
    /RH open/.test(IMP124921_HONEST_BANNER)
  )
) {
  throw new Error(
    'imp-124921-ecf-crossover-reldiff-roundoff-causal-chain-note assertion FAILED: the three-step causal chain ' +
      '(crossover -> reldiff growth -> attribution) must stay consistent.'
  );
}
