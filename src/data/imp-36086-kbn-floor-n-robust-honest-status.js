/**
 * @module imp-36086-kbn-floor-n-robust-honest-status
 * @fileoverview imp-36086 -- standalone HONEST-STATUS note recording the imp-36023
 *   finding that the imp-35973 combined worst-case (order-x-shape) pairwise-summation
 *   compensated floor is N-ROBUST: Kahan-Babuska-Neumaier (KBN) on the same combined
 *   clustered-order stress sits ~3-4 orders of magnitude below the unit roundoff
 *   u = 2^{-53} ~ 1.11e-16 at EVERY rung of the imp-35812 N ladder [1000, 10000,
 *   100000, 488602], with NO upward drift as N grows. Read-only note: imports the
 *   imp-36023 module verbatim (no re-derivation, no new numerics), restating plainly
 *   for a reader who lands on this ticket without having read imp-36023 in full: the
 *   imp-35973 single-endpoint floor (~2.31e-19 classic Kahan at N ~ 488602) is NOT an
 *   N-endpoint coincidence -- it is one rung of an N-uniform compensated floor.
 *
 *   Ticket: imp-36086 (content, medium). Note only; ports nothing; changes no bound;
 *   no refereed bound is changed; NO QED.
 *
 *   @see imp-36023-kbn-combined-worst-ladder.js (source: the four-rung KBN ladder sweep this note restates)
 *   @see imp-35973-w1-summation-order-shape-cross-term (single-endpoint combined stress this note re-contextualizes)
 *   @see imp-35812-w1-summation-scheme-measured-cost (the fixed term family + N ladder [1e3..4.886e5])
 *   @see imp-35962-w1-pairwise-tree-shape-robust-honest-status.js (companion honest-status note, shape-robustness axis)
 *   @see imp-35725 (the certified length-N interval sum this note names as the remaining obstruction)
 */

import { IMP36023_KBN_COMBINED_WORST_LADDER } from './imp-36023-kbn-combined-worst-ladder.js';

const SOURCE = IMP36023_KBN_COMBINED_WORST_LADDER;

export const IMP36086_KBN_FLOOR_N_ROBUST_HONEST_STATUS = Object.freeze({
  id: 'imp-36086',
  title:
    'Honest-status note: the imp-35973 combined worst-case compensated-summation floor is N-ROBUST ' +
    '(KBN stays N-flat across the imp-35812 ladder), not an N-endpoint coincidence of the single N ~ 488602 rung',
  sourceModule: 'imp-36023-kbn-combined-worst-ladder.js',

  ladderResult: Object.freeze({
    ladderSizes: SOURCE.ladderSizes,
    unitRoundoff: SOURCE.unitRoundoff,
    kbnErrsAcrossLadder: SOURCE.floorStability.kbnErrsAcrossLadder,
    kbnMaxOverU: SOURCE.floorStability.kbnMaxOverU,
    kbnNoUpwardDrift: SOURCE.floorStability.kbnNoUpwardDrift,
    naiveGrowsWithN: SOURCE.floorStability.naiveGrowsWithN,
    kahanAtTPT: SOURCE.floorStability.kahanAtTPT,
    kbnAtTPT: SOURCE.floorStability.kbnAtTPT,
  }),

  conclusion:
    'Across the four imp-35812 ladder rungs N = [1000, 10000, 100000, 488602], Kahan-Babuska-Neumaier (KBN) ' +
    'compensated summation on the imp-35973 combined worst-case clustered order stays ~3-4 orders of magnitude ' +
    'BELOW the unit roundoff u = 2^{-53} ~ 1.11e-16 at EVERY rung (KBN / u from ~3.4e-3 down to ~1.7e-4), with ' +
    'NO upward drift as N grows -- if anything the ratio DECREASES at larger N. This is the opposite of the ' +
    'naive clustered baseline, which grows with the conditioning kappa (~62 to ~1391). The classic-Kahan value ' +
    'at N ~ 488602 (~2.31e-19) reproduces the imp-35973 single-endpoint figure exactly, confirming that figure ' +
    'was one rung of an N-UNIFORM compensated floor, not a coincidence tied to that particular N. Precision ' +
    'therefore stays NON-binding across the whole ladder even under the combined order-x-shape stress, and the ' +
    'W1 obstruction remains the MECHANICAL engineering of the certified length-N interval sum (imp-35725).',

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    changesAnyBound: false,
    portsAnyRoute: false,
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'N-ROBUST (restated from imp-36023): the imp-35973 combined worst-case compensated floor is not an ' +
    'N-endpoint coincidence -- KBN stays ~3-4 orders below unit roundoff at every imp-35812 ladder rung with ' +
    'no upward drift, so precision stays NON-binding N-uniformly and the W1 obstruction stays MECHANICAL / ' +
    'GREENFIELD. Note only; changes no bound; NO QED.',
});

export const IMP36086_KBN_FLOOR_N_ROBUST_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36086-ladder-matches-source',
    why: 'The restated ladder sizes must match the imp-36023 source ladder [1000, 10000, 100000, 488602].',
    holds: () =>
      IMP36086_KBN_FLOOR_N_ROBUST_HONEST_STATUS.ladderResult.ladderSizes.length === 4 &&
      IMP36086_KBN_FLOOR_N_ROBUST_HONEST_STATUS.ladderResult.ladderSizes[0] === 1000 &&
      IMP36086_KBN_FLOOR_N_ROBUST_HONEST_STATUS.ladderResult.ladderSizes[3] === SOURCE.ladderSizes[3],
  },
  {
    id: 'imp36086-no-upward-drift-matches-source',
    why: 'The restated no-upward-drift flag must equal the imp-36023 source finding (true).',
    holds: () =>
      IMP36086_KBN_FLOOR_N_ROBUST_HONEST_STATUS.ladderResult.kbnNoUpwardDrift === true &&
      IMP36086_KBN_FLOOR_N_ROBUST_HONEST_STATUS.ladderResult.kbnNoUpwardDrift === SOURCE.floorStability.kbnNoUpwardDrift,
  },
  {
    id: 'imp36086-kbn-max-over-u-below-one',
    why: 'The restated worst-case KBN/u ratio across the ladder must stay well below unit roundoff (< 1e-2).',
    holds: () => {
      const r = IMP36086_KBN_FLOOR_N_ROBUST_HONEST_STATUS.ladderResult.kbnMaxOverU;
      return r === SOURCE.floorStability.kbnMaxOverU && r > 0 && r < 1e-2;
    },
  },
  {
    id: 'imp36086-naive-grows-with-n',
    why: 'The restated contrast must record that the naive clustered baseline DOES grow with N, unlike KBN.',
    holds: () =>
      IMP36086_KBN_FLOOR_N_ROBUST_HONEST_STATUS.ladderResult.naiveGrowsWithN === true &&
      IMP36086_KBN_FLOOR_N_ROBUST_HONEST_STATUS.ladderResult.naiveGrowsWithN === SOURCE.floorStability.naiveGrowsWithN,
  },
  {
    id: 'imp36086-conclusion-not-a-coincidence',
    why: 'The conclusion must state the single-endpoint floor was one rung of an N-uniform floor, not a coincidence.',
    holds: () => /not a coincidence/.test(IMP36086_KBN_FLOOR_N_ROBUST_HONEST_STATUS.conclusion),
  },
  {
    id: 'imp36086-conclusion-obstruction-mechanical',
    why: 'The conclusion must name the remaining obstruction as MECHANICAL engineering, not summation precision.',
    holds: () => /MECHANICAL engineering/.test(IMP36086_KBN_FLOOR_N_ROBUST_HONEST_STATUS.conclusion),
  },
  {
    id: 'imp36086-honesty-gate',
    why: 'This is a read-only restatement note: it must not claim proof, RH reduction, or any changed bound.',
    holds: () =>
      IMP36086_KBN_FLOOR_N_ROBUST_HONEST_STATUS.honestCaveat.isProof === false &&
      IMP36086_KBN_FLOOR_N_ROBUST_HONEST_STATUS.honestCaveat.isReductionBelowRH === false &&
      IMP36086_KBN_FLOOR_N_ROBUST_HONEST_STATUS.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36086_KBN_FLOOR_N_ROBUST_HONEST_STATUS.honestCaveat.sota),
  },
  {
    id: 'imp36086-verdict-n-robust-no-qed',
    why: 'The verdict must record N-ROBUST and NO QED, matching the imp-36023 source conclusion of an N-flat floor.',
    holds: () =>
      /N-ROBUST/.test(IMP36086_KBN_FLOOR_N_ROBUST_HONEST_STATUS.verdict) &&
      /NO QED/.test(IMP36086_KBN_FLOOR_N_ROBUST_HONEST_STATUS.verdict) &&
      /N-flat/i.test(SOURCE.conclusion.compensatedFloorNFlat),
  },
];

for (const assertion of IMP36086_KBN_FLOOR_N_ROBUST_HONEST_STATUS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36086-kbn-floor-n-robust-honest-status assertion failed: ${assertion.id}`);
  }
}

export default IMP36086_KBN_FLOOR_N_ROBUST_HONEST_STATUS;
