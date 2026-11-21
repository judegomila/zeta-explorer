/**
 * @module imp-36092-two-cliff-constant-invariance-honest-status
 * @fileoverview imp-36092 -- standalone HONEST-STATUS note recording the imp-36021
 *   finding that the imp-35972 effective-height twin overflow cliff position is
 *   CONSTANT-INVARIANT: K, delta, and S_inf never enter the double-precision
 *   effectiveHeightForN seed or its T . u product, so neither cliff (cliff A, the
 *   RvM numerator 2 pi . N > MAX_VALUE overflow; cliff B, the a -> 0 T . u
 *   denominator overflow, which coincides exactly with the R_direct NaN cliff)
 *   moves by a single bit under a +/-4-order K sweep or a delta in [1e-4, 4e-4]
 *   sweep. Read-only note: imports the imp-36021 module verbatim (no
 *   re-derivation, no new numerics), restating plainly for a reader who lands on
 *   this ticket without having read imp-36021 in full that the twin-cliff
 *   position is a fixed IEEE-754 geometric property of the shipped seed, not a
 *   constant-tunable quantity.
 *
 *   Ticket: imp-36092 (content, medium). Note only; ports nothing; changes no
 *   bound; no refereed bound is changed; NO QED.
 *
 * @see imp-36021-two-cliff-gap-constant-sensitivity.js (source: the K/delta/S_inf sweep this note restates)
 * @see imp-35972-effective-height-overflow-cliff-bisection (LOCATED the two cliffs at the pinned constants)
 * @see imp-35892-rdirect-own-floor-departure-height (coarse decade sweep; R_direct = -S_inf a/(2-a))
 * @see lambda-rh-height-mapping (effectiveHeightForN RvM inverse; the 2 pi . N seed numerator overflow edge)
 */

import { IMP36021_TWO_CLIFF_GAP_CONSTANT_SENSITIVITY } from './imp-36021-two-cliff-gap-constant-sensitivity.js';

const SOURCE = IMP36021_TWO_CLIFF_GAP_CONSTANT_SENSITIVITY;

export const IMP36092_TWO_CLIFF_CONSTANT_INVARIANCE_HONEST_STATUS = Object.freeze({
  id: 'imp-36092',
  title:
    'Honest-status note: the imp-35972 effective-height twin overflow cliff position is CONSTANT-INVARIANT ' +
    '(K, delta, S_inf never enter the overflow point), a fixed IEEE-754 geometric property of the seed, not ' +
    'a constant-tunable quantity',
  sourceModule: 'imp-36021-two-cliff-gap-constant-sensitivity.js',

  sensitivityResult: Object.freeze({
    cliffA_log10_N: SOURCE.metric.cliffA_height_overflow_log10_N,
    cliffB_log10_N_at_pinned: SOURCE.metric.cliffB_a_zero_log10_N_at_pinned,
    gap_A_minus_B_decade_at_pinned: SOURCE.metric.gap_A_minus_B_decade_at_pinned,
    sensitivity_dlog10_NB_dlnK: SOURCE.metric.sensitivity_dlog10_NB_dlnK,
    gap_spread_over_K_sweep_decade: SOURCE.metric.gap_spread_over_K_sweep_decade,
    allKPerturbationsBitIdentical: SOURCE.metric.all_K_perturbations_bit_identical_NB,
    allDeltaProbesEqualAZero: SOURCE.metric.all_delta_probes_rdirect_equals_aZero,
    allSInfProbesEqualAZero: SOURCE.metric.all_S_inf_probes_rdirect_equals_aZero,
    K_underflow_edge: SOURCE.constants.K_underflow_edge_below_which_cliffB_moves,
  }),

  conclusion:
    'Perturbing K over a +/-4-order sweep and delta over [1e-4, 4e-4] (with S_inf both coupled and ' +
    'decoupled) moves NEITHER twin cliff by a single bit. CLIFF A (effectiveHeightForN -> +Infinity) is set ' +
    'purely by the RvM seed numerator 2 pi . N exceeding MAX_VALUE -- K, delta, and S_inf never enter ' +
    'effectiveHeightForN at all, so N_A stays fixed at log10 N ~ ' +
    SOURCE.metric.cliffA_height_overflow_log10_N.toFixed(6) +
    '. CLIFF B (a -> 0) is where the T . u DENOMINATOR overflows to +Infinity; K sits in the NUMERATOR only ' +
    '(a = finite/Infinity = 0 for any finite K), and delta/S_inf do not appear in aOf at all, so N_B stays ' +
    'bit-identical at log10 N ~ ' +
    SOURCE.metric.cliffB_a_zero_log10_N_at_pinned.toFixed(6) +
    '. The downstream R_direct NaN cliff, which DOES carry S_inf/delta/M_G, coincides EXACTLY with cliff B ' +
    'under every probe, so the measured sensitivity dlog10(N)/dlnK = ' +
    SOURCE.metric.sensitivity_dlog10_NB_dlnK.toExponential(2) +
    ' and the ~6.2e-4-decade gap has ZERO spread across the K sweep. Only a K driven ~24 orders below the ' +
    'pinned value (K < ~' +
    SOURCE.constants.K_underflow_edge_below_which_cliffB_moves.toExponential(2) +
    ') would move cliff B, far outside every stated provenance. The twin-cliff position is therefore a ' +
    'fixed IEEE-754 geometric property of the shipped effectiveHeightForN seed and its T . u product -- not ' +
    'something the RH-side constants K, delta, or S_inf can tune.',

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    changesAnyBound: false,
    portsAnyRoute: false,
    subGap: 'imp-34714a REMAINS OPEN',
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'CONSTANT-INVARIANT (restated from imp-36021): the imp-35972 twin overflow cliff position never moves ' +
    'under K, delta, or S_inf perturbation -- dlog10(N_A)/dlog(*) = dlog10(N_B)/dlog(*) = 0 to the last bit, ' +
    'and the ~6.2e-4-decade separation between the two cliffs has zero spread. This is a fixed geometric ' +
    'property of the double-precision effectiveHeightForN seed, not a constant-tunable RH quantity. Note ' +
    'only; changes no bound; NO QED; no refereed bound is changed.',
});

export const IMP36092_TWO_CLIFF_CONSTANT_INVARIANCE_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36092-sensitivity-matches-source',
    why: 'The restated sensitivity slope and gap spread must equal the imp-36021 source measurement (both 0).',
    holds: () =>
      IMP36092_TWO_CLIFF_CONSTANT_INVARIANCE_HONEST_STATUS.sensitivityResult.sensitivity_dlog10_NB_dlnK === 0 &&
      IMP36092_TWO_CLIFF_CONSTANT_INVARIANCE_HONEST_STATUS.sensitivityResult.gap_spread_over_K_sweep_decade === 0 &&
      IMP36092_TWO_CLIFF_CONSTANT_INVARIANCE_HONEST_STATUS.sensitivityResult.sensitivity_dlog10_NB_dlnK ===
        SOURCE.metric.sensitivity_dlog10_NB_dlnK,
  },
  {
    id: 'imp36092-all-perturbations-bit-identical',
    why: 'The restated all-K/all-delta/all-S_inf bit-identical flags must all be true, matching imp-36021.',
    holds: () =>
      IMP36092_TWO_CLIFF_CONSTANT_INVARIANCE_HONEST_STATUS.sensitivityResult.allKPerturbationsBitIdentical === true &&
      IMP36092_TWO_CLIFF_CONSTANT_INVARIANCE_HONEST_STATUS.sensitivityResult.allDeltaProbesEqualAZero === true &&
      IMP36092_TWO_CLIFF_CONSTANT_INVARIANCE_HONEST_STATUS.sensitivityResult.allSInfProbesEqualAZero === true,
  },
  {
    id: 'imp36092-cliffA-above-cliffB',
    why: 'Cliff A must sit strictly above cliff B, reproducing the imp-35972/imp-36021 ordering.',
    holds: () =>
      IMP36092_TWO_CLIFF_CONSTANT_INVARIANCE_HONEST_STATUS.sensitivityResult.cliffA_log10_N >
      IMP36092_TWO_CLIFF_CONSTANT_INVARIANCE_HONEST_STATUS.sensitivityResult.cliffB_log10_N_at_pinned,
  },
  {
    id: 'imp36092-conclusion-fixed-geometric-property',
    why: 'The conclusion must state the twin-cliff position is a fixed geometric property, not tunable.',
    holds: () => /fixed IEEE-754 geometric property/.test(IMP36092_TWO_CLIFF_CONSTANT_INVARIANCE_HONEST_STATUS.conclusion),
  },
  {
    id: 'imp36092-honesty-gate',
    why: 'This is a read-only restatement note: it must not claim proof, RH reduction, or any changed bound.',
    holds: () =>
      IMP36092_TWO_CLIFF_CONSTANT_INVARIANCE_HONEST_STATUS.honestCaveat.isProof === false &&
      IMP36092_TWO_CLIFF_CONSTANT_INVARIANCE_HONEST_STATUS.honestCaveat.isReductionBelowRH === false &&
      IMP36092_TWO_CLIFF_CONSTANT_INVARIANCE_HONEST_STATUS.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36092_TWO_CLIFF_CONSTANT_INVARIANCE_HONEST_STATUS.honestCaveat.sota),
  },
  {
    id: 'imp36092-verdict-constant-invariant-no-qed',
    why: 'The verdict must record CONSTANT-INVARIANT and NO QED, matching the imp-36021 source zero-sensitivity finding.',
    holds: () =>
      /CONSTANT-INVARIANT/.test(IMP36092_TWO_CLIFF_CONSTANT_INVARIANCE_HONEST_STATUS.verdict) &&
      /NO QED/.test(IMP36092_TWO_CLIFF_CONSTANT_INVARIANCE_HONEST_STATUS.verdict),
  },
];

for (const assertion of IMP36092_TWO_CLIFF_CONSTANT_INVARIANCE_HONEST_STATUS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36092-two-cliff-constant-invariance-honest-status assertion failed: ${assertion.id}`);
  }
}

export default IMP36092_TWO_CLIFF_CONSTANT_INVARIANCE_HONEST_STATUS;
