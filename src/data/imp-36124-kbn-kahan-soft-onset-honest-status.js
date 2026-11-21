/**
 * @module imp-36124-kbn-kahan-soft-onset-honest-status
 * @fileoverview imp-36124 -- standalone HONEST-STATUS note recording the imp-36062
 *   finding that the Kahan-Babuska-Neumaier (KBN) vs classic-Kahan separation onset on
 *   the imp-35852 clustered worst order is characterized by N (bit-identical at every
 *   rung below N ~ 34000), NOT by a hard conditioning-kappa cutoff -- kappa is itself
 *   non-monotone rung-to-rung near the onset (kappa 361.5 at N = 34000 is LESS than
 *   kappa 362.8 at N = 33000). The onset is a SOFT, intermittent threshold: a finer
 *   sub-sweep shows separation flickering between N ~ 34000 and ~40000 (identical
 *   again at 35000-37000) before becoming persistent, because the two schemes differ
 *   only in how the compensation term is re-incorporated (KBN adds it once at the end
 *   via s + c). Read-only note: imports the imp-36062 module verbatim (no
 *   re-derivation, no new numerics), restating plainly for a reader who lands on this
 *   ticket without having read imp-36062 in full.
 *
 *   Ticket: imp-36124 (content, medium). Note only; ports nothing; changes no bound;
 *   no refereed bound is changed; NO QED.
 *
 *   @see imp-36062-kbn-kahan-separation-onset.js (source: locates the N~34000 onset this note restates)
 *   @see imp-36023-kbn-combined-worst-ladder.js (coarse four-rung ladder imp-36062 refines)
 *   @see imp-36086-kbn-floor-n-robust-honest-status.js (companion honest-status note, N-robustness of the KBN floor)
 *   @see imp-35852-w1-summation-adversarial-ordering (clustered same-sign worst ORDER)
 *   @see imp-35725 (the certified length-N interval sum this note names as the remaining obstruction)
 */

import { IMP36062_KBN_KAHAN_SEPARATION_ONSET } from './imp-36062-kbn-kahan-separation-onset.js';

const SOURCE = IMP36062_KBN_KAHAN_SEPARATION_ONSET;

export const IMP36124_KBN_KAHAN_SOFT_ONSET_HONEST_STATUS = Object.freeze({
  id: 'imp-36124',
  title:
    'Honest-status note: the imp-36062 KBN-vs-classic-Kahan separation onset tracks N, not a hard ' +
    'conditioning-kappa cutoff, and is a SOFT/intermittent threshold rather than a sharp one',
  sourceModule: 'imp-36062-kbn-kahan-separation-onset.js',

  onsetResult: Object.freeze({
    firstSeparationN: SOURCE.separationOnset.firstSeparationN, // ~34000
    firstSeparationKappa: SOURCE.separationOnset.firstSeparationKappa, // ~361.5
    belowOnsetAllIdentical: SOURCE.separationOnset.belowOnsetAllIdentical,
    onsetRatioKbnOverKahan: SOURCE.separationOnset.onsetRatioKbnOverKahan, // ~0.96
    endpointRatioKbnOverKahan: SOURCE.separationOnset.endpointRatioKbnOverKahan, // ~0.08
  }),

  conclusion:
    'Below N ~ 34000 the imp-36062 finer ladder shows KBN and classic Kahan BIT-IDENTICAL at every rung ' +
    'tested (N = 1000, 10000, 30000, 33000). The first strict separation lands at N = 34000 (kappa ~ 361.5), ' +
    'yet the immediately PRIOR rung N = 33000 has a HIGHER kappa (~362.8) and is still bit-identical -- kappa ' +
    'is non-monotone rung-to-rung right at the onset, so kappa cannot be the operative threshold variable. ' +
    'The onset is instead characterized cleanly by N. It is also SOFT rather than sharp: a finer sub-sweep ' +
    '(not separately stored) shows the separation flickering -- intermittent through roughly N ~ 34000-40000, ' +
    'identical again at 35000-37000 -- before becoming persistent above ~40000. Mechanistically this is because ' +
    'classic Kahan and KBN differ only in how the compensation term c is re-incorporated (KBN folds it back in ' +
    'once at the end via s + c, correct even when |s| < |c|), so their divergence is a fine ROUNDING-level event ' +
    'rather than a threshold tied to a smooth conditioning measure. Precision stays NON-binding throughout -- ' +
    'both schemes sit at the ~1e-19 compensated floor at every rung -- so the W1 obstruction remains the ' +
    'MECHANICAL engineering of the certified length-N interval sum (imp-35725).',

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    changesAnyBound: false,
    portsAnyRoute: false,
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'SOFT, N-CHARACTERIZED (restated from imp-36062): the KBN-vs-classic-Kahan separation onset near ' +
    'N ~ 34000 is cleanly bounded by N (bit-identical everywhere below) rather than by a hard kappa cutoff, ' +
    'since kappa is itself non-monotone rung-to-rung near the onset, and the boundary is intermittent rather ' +
    'than sharp. Precision stays non-binding; the obstruction stays MECHANICAL. Note only; changes no bound; ' +
    'NO QED.',
});

export const IMP36124_KBN_KAHAN_SOFT_ONSET_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36124-onset-matches-source',
    why: 'The restated onset rung and kappa must match the imp-36062 source (N=34000, kappa in (340,380)).',
    holds: () =>
      IMP36124_KBN_KAHAN_SOFT_ONSET_HONEST_STATUS.onsetResult.firstSeparationN === 34000 &&
      IMP36124_KBN_KAHAN_SOFT_ONSET_HONEST_STATUS.onsetResult.firstSeparationN === SOURCE.separationOnset.firstSeparationN &&
      IMP36124_KBN_KAHAN_SOFT_ONSET_HONEST_STATUS.onsetResult.firstSeparationKappa > 340 &&
      IMP36124_KBN_KAHAN_SOFT_ONSET_HONEST_STATUS.onsetResult.firstSeparationKappa < 380,
  },
  {
    id: 'imp36124-below-onset-identical-matches-source',
    why: 'The restated below-onset-identical flag must equal the imp-36062 source finding (true).',
    holds: () =>
      IMP36124_KBN_KAHAN_SOFT_ONSET_HONEST_STATUS.onsetResult.belowOnsetAllIdentical === true &&
      IMP36124_KBN_KAHAN_SOFT_ONSET_HONEST_STATUS.onsetResult.belowOnsetAllIdentical ===
        SOURCE.separationOnset.belowOnsetAllIdentical,
  },
  {
    id: 'imp36124-onset-ratio-marginal-endpoint-deep',
    why: 'The onset-rung ratio must be marginal (~0.96) while the endpoint ratio is deep (~0.08), matching the source.',
    holds: () => {
      const r = IMP36124_KBN_KAHAN_SOFT_ONSET_HONEST_STATUS.onsetResult;
      return (
        r.onsetRatioKbnOverKahan > 0.8 && r.onsetRatioKbnOverKahan < 1 &&
        r.endpointRatioKbnOverKahan < 0.2 &&
        r.onsetRatioKbnOverKahan === SOURCE.separationOnset.onsetRatioKbnOverKahan &&
        r.endpointRatioKbnOverKahan === SOURCE.separationOnset.endpointRatioKbnOverKahan
      );
    },
  },
  {
    id: 'imp36124-conclusion-kappa-non-monotone',
    why: 'The conclusion must state kappa is non-monotone rung-to-rung near the onset, the reason it is not the operative threshold.',
    holds: () => /non-monotone/.test(IMP36124_KBN_KAHAN_SOFT_ONSET_HONEST_STATUS.conclusion),
  },
  {
    id: 'imp36124-conclusion-soft-not-sharp',
    why: 'The conclusion must record the onset as SOFT/intermittent, not a sharp boundary.',
    holds: () =>
      /SOFT/.test(IMP36124_KBN_KAHAN_SOFT_ONSET_HONEST_STATUS.conclusion) &&
      /intermittent/.test(IMP36124_KBN_KAHAN_SOFT_ONSET_HONEST_STATUS.conclusion),
  },
  {
    id: 'imp36124-conclusion-obstruction-mechanical',
    why: 'The conclusion must name the remaining obstruction as MECHANICAL engineering, not summation precision.',
    holds: () => /MECHANICAL engineering/.test(IMP36124_KBN_KAHAN_SOFT_ONSET_HONEST_STATUS.conclusion),
  },
  {
    id: 'imp36124-honesty-gate',
    why: 'This is a read-only restatement note: it must not claim proof, RH reduction, or any changed bound.',
    holds: () =>
      IMP36124_KBN_KAHAN_SOFT_ONSET_HONEST_STATUS.honestCaveat.isProof === false &&
      IMP36124_KBN_KAHAN_SOFT_ONSET_HONEST_STATUS.honestCaveat.isReductionBelowRH === false &&
      IMP36124_KBN_KAHAN_SOFT_ONSET_HONEST_STATUS.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36124_KBN_KAHAN_SOFT_ONSET_HONEST_STATUS.honestCaveat.sota),
  },
  {
    id: 'imp36124-verdict-soft-n-characterized-no-qed',
    why: 'The verdict must record the SOFT/N-characterized finding and NO QED.',
    holds: () =>
      /SOFT, N-CHARACTERIZED/.test(IMP36124_KBN_KAHAN_SOFT_ONSET_HONEST_STATUS.verdict) &&
      /NO QED/.test(IMP36124_KBN_KAHAN_SOFT_ONSET_HONEST_STATUS.verdict),
  },
];

for (const assertion of IMP36124_KBN_KAHAN_SOFT_ONSET_HONEST_STATUS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36124-kbn-kahan-soft-onset-honest-status assertion failed: ${assertion.id}`);
  }
}

export default IMP36124_KBN_KAHAN_SOFT_ONSET_HONEST_STATUS;
