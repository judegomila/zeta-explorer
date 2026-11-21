/**
 * @module imp-36032-two-cliff-decade-honest-status
 * @fileoverview imp-36032 -- standalone HONEST-STATUS note recording the imp-35972
 *   finding plainly, for a reader who lands on this ticket without having read
 *   imp-35972 in full: the effectiveHeightForN double-precision overflow edge is
 *   NOT one cliff but TWO distinct, sub-decade-adjacent cliffs. CLIFF B (the
 *   R_direct NaN cliff, a -> 0 -- the aOf = 2 pi K / (T . u) product overflows one
 *   double before T does) sits at log10 N ~ 307.4559 and BINDS FIRST. CLIFF A (the
 *   effectiveHeightForN -> +Infinity cliff, driven by the Newton seed numerator
 *   2 pi . N exceeding MAX_VALUE) sits ~6.2e-4 decade ABOVE it, at log10 N ~
 *   307.4565. Read-only note: imports the imp-35972 module verbatim (no
 *   re-derivation, no new numerics), restating the ordering and the ~6.2e-4-decade
 *   gap between the two cliffs.
 *
 *   Ticket: imp-36032 (content, low). Note only; ports nothing; changes no
 *   bound; no refereed bound is changed; NO QED.
 *
 * @see imp-35972-effective-height-overflow-cliff-bisection (source: LOCATED the two cliffs)
 * @see imp-36092-two-cliff-constant-invariance-honest-status (follow-up: the cliff position is constant-invariant)
 * @see lambda-rh-height-mapping (effectiveHeightForN RvM inverse; the 2 pi . N seed numerator overflow edge)
 */

import { IMP35972_EFFECTIVE_HEIGHT_OVERFLOW_CLIFF } from './imp-35972-effective-height-overflow-cliff-bisection.js';

const SOURCE = IMP35972_EFFECTIVE_HEIGHT_OVERFLOW_CLIFF;

export const IMP36032_TWO_CLIFF_DECADE_HONEST_STATUS = Object.freeze({
  id: 'imp-36032',
  title:
    'Honest-status note: the effectiveHeightForN overflow edge is TWO distinct cliffs a fraction of a decade ' +
    'apart -- the R_direct a -> 0 NaN cliff (log10 N ~ 307.4559) BINDS FIRST, and the effectiveHeightForN ' +
    '-> +Infinity cliff sits ~6.2e-4 decade above it',
  sourceModule: 'imp-35972-effective-height-overflow-cliff-bisection.js',

  cliffResult: Object.freeze({
    cliffB_a_zero_log10_N: SOURCE.metric.a_zero_last_positive_log10_N,
    cliffB_T: SOURCE.metric.T_at_a_zero_cliff,
    cliffB_a: SOURCE.metric.a_at_a_zero_cliff,
    cliffB_a_is_normal_double: SOURCE.metric.a_at_a_zero_cliff_is_normal_double,
    cliffA_height_overflow_log10_N: SOURCE.metric.height_overflow_last_finite_log10_N,
    cliffA_T: SOURCE.metric.T_at_height_overflow_cliff,
    decade_gap_A_minus_B: SOURCE.metric.decade_gap_heightOverflow_above_aZero,
    cliffB_binds_first: SOURCE.metric.a_zero_cliff_binds_first,
  }),

  conclusion:
    'The double-precision effectiveHeightForN overflow edge that earlier coarse-grid sweeps reported as a ' +
    'single event at N ~ 10^307.46 is in fact TWO distinct, sub-decade-adjacent cliffs. CLIFF B -- the ' +
    'R_direct NaN cliff -- occurs where the aOf = 2 pi K / (T . u) PRODUCT overflows one double before T ' +
    'itself does, forcing a -> 0. The last N with a > 0 is at log10 N ~ ' +
    SOURCE.metric.a_zero_last_positive_log10_N.toFixed(6) +
    ', where a ~ ' +
    SOURCE.metric.a_at_a_zero_cliff.toExponential(2) +
    ' is still a NORMAL double (~24 orders above the min normal). CLIFF A -- the effectiveHeightForN -> ' +
    '+Infinity cliff -- sits ~' +
    SOURCE.metric.decade_gap_heightOverflow_above_aZero.toExponential(2) +
    ' decade ABOVE cliff B, at log10 N ~ ' +
    SOURCE.metric.height_overflow_last_finite_log10_N.toFixed(6) +
    ', driven by the Newton seed NUMERATOR 2 pi . N exceeding MAX_VALUE, NOT by T itself approaching ' +
    'MAX_VALUE. Because cliff B sits below cliff A, R_direct is already NaN across the thin band between ' +
    'them even though the height inverse T(N) is still finite there -- so the a -> 0 cliff is the one that ' +
    'BINDS FIRST as N grows.',

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    changesAnyBound: false,
    portsAnyRoute: false,
    subGap: 'imp-34714a REMAINS OPEN',
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'TWO DISTINCT CLIFFS, NOT ONE (restated from imp-35972): the R_direct a -> 0 NaN cliff at log10 N ~ ' +
    SOURCE.metric.a_zero_last_positive_log10_N.toFixed(4) +
    ' binds first, ~' +
    SOURCE.metric.decade_gap_heightOverflow_above_aZero.toExponential(2) +
    ' decade below the effectiveHeightForN -> +Infinity cliff at log10 N ~ ' +
    SOURCE.metric.height_overflow_last_finite_log10_N.toFixed(4) +
    '. Measurement/diagnostic restatement only; changes no bound; NO QED; no refereed bound is changed' +
    '.',
});

export const IMP36032_TWO_CLIFF_DECADE_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36032-cliffB-binds-before-cliffA',
    why: 'The restated ordering must match the imp-35972 source: cliff B (a -> 0) sits below and binds before cliff A.',
    holds: () =>
      IMP36032_TWO_CLIFF_DECADE_HONEST_STATUS.cliffResult.cliffB_binds_first === true &&
      IMP36032_TWO_CLIFF_DECADE_HONEST_STATUS.cliffResult.cliffB_a_zero_log10_N <
        IMP36032_TWO_CLIFF_DECADE_HONEST_STATUS.cliffResult.cliffA_height_overflow_log10_N,
  },
  {
    id: 'imp36032-gap-matches-source',
    why: 'The restated decade gap must equal the imp-35972 source measurement exactly (read-only restatement).',
    holds: () =>
      IMP36032_TWO_CLIFF_DECADE_HONEST_STATUS.cliffResult.decade_gap_A_minus_B === SOURCE.metric.decade_gap_heightOverflow_above_aZero,
  },
  {
    id: 'imp36032-cliffB-a-still-normal-double',
    why: 'At cliff B, a must still be a normal double per the imp-35972 source (the cliff is a hard step, not denormal decay).',
    holds: () => IMP36032_TWO_CLIFF_DECADE_HONEST_STATUS.cliffResult.cliffB_a_is_normal_double === true,
  },
  {
    id: 'imp36032-honesty-gate',
    why: 'This is a read-only restatement note: it must not claim proof, RH reduction, or any changed bound.',
    holds: () =>
      IMP36032_TWO_CLIFF_DECADE_HONEST_STATUS.honestCaveat.isProof === false &&
      IMP36032_TWO_CLIFF_DECADE_HONEST_STATUS.honestCaveat.isReductionBelowRH === false &&
      IMP36032_TWO_CLIFF_DECADE_HONEST_STATUS.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36032_TWO_CLIFF_DECADE_HONEST_STATUS.honestCaveat.sota),
  },
  {
    id: 'imp36032-verdict-two-cliffs-no-qed',
    why: 'The verdict must record TWO DISTINCT CLIFFS and NO QED, matching the imp-35972 source finding.',
    holds: () =>
      /TWO DISTINCT CLIFFS/.test(IMP36032_TWO_CLIFF_DECADE_HONEST_STATUS.verdict) &&
      /NO QED/.test(IMP36032_TWO_CLIFF_DECADE_HONEST_STATUS.verdict),
  },
];

for (const assertion of IMP36032_TWO_CLIFF_DECADE_HONEST_STATUS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36032-two-cliff-decade-honest-status assertion failed: ${assertion.id}`);
  }
}

export default IMP36032_TWO_CLIFF_DECADE_HONEST_STATUS;
