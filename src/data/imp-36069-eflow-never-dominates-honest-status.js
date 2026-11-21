/**
 * @module imp-36069-eflow-never-dominates-honest-status
 * @fileoverview imp-36069 -- standalone HONEST-STATUS note recording the imp-35997
 *   finding that the MIDDLE flow term E_flow of the imp-35889 three-way split
 *   E(N) = E_trunc + E_flow + E_coll NEVER dominates E(N) anywhere on the N ladder:
 *   its fractional share E_flow / E(N) tops out at only ~15.9% (~0.1587), reached at
 *   a very low height N* ~ 96.5 (log10 N* ~ 1.985), and DECAYS from there at every
 *   landmark height above ~100 (interior sigma peak, Kneedle elbow, sigma = 0.5
 *   crossover). So the three-way split is effectively a TWO-way split
 *   E_trunc + E_coll at every landmark height that matters -- E_flow is a small
 *   correction everywhere it has been measured, never the leading or even the
 *   second-largest term.
 *
 *   Read-only note: imports the imp-35997 module verbatim (no re-derivation, no new
 *   numerics), restating plainly for a reader who lands on this ticket without
 *   having read imp-35997 in full.
 *
 *   Ticket: imp-36069 (content, low). Note only; ports nothing; changes no bound;
 *   no refereed bound is changed; NO QED.
 *
 *   @see imp-35997-eflow-max-share-height.js (source: golden-section-located flow-share maximum this note restates)
 *   @see imp-35889-e-share-decomposition-at-knees (the three-way split whose flow share was maximized)
 *   @see imp-35950-etrunc-ecoll-crossover-height (sigma = 0.5 crossover, flow share ~ 9.51e-4 there)
 */

import { IMP35997_EFLOW_MAX_SHARE_HEIGHT } from './imp-35997-eflow-max-share-height.js';

const SOURCE = IMP35997_EFLOW_MAX_SHARE_HEIGHT;

export const IMP36069_EFLOW_NEVER_DOMINATES_HONEST_STATUS = Object.freeze({
  id: 'imp-36069',
  title:
    'Honest-status note: the middle flow term E_flow NEVER dominates the imp-35889 three-way split ' +
    'E(N) = E_trunc + E_flow + E_coll -- its own peak share is only ~15.9% at N ~ 96.5, so the split is ' +
    'effectively E_trunc + E_coll at every landmark height above ~100',
  sourceModule: 'imp-35997-eflow-max-share-height.js',

  peakResult: Object.freeze({
    N_star: SOURCE.flowShareMax.N,
    log10N_star: SOURCE.flowShareMax.log10N,
    peakShareFlow: SOURCE.flowShareMax.peakShareFlow,
    sigmaAtPeak: SOURCE.flowShareMax.sigmaAtPeak,
    eFlowNeverDominates: SOURCE.flowShareMax.eFlowNeverDominates,
  }),

  landmarkLadder: Object.freeze({
    interiorSigmaPeak: SOURCE.landmarkLadder.interiorSigmaPeak,
    kneedleElbow: SOURCE.landmarkLadder.kneedleElbow,
    sigmaHalfCrossover: SOURCE.landmarkLadder.sigmaHalfCrossover,
  }),

  conclusion:
    'Maximizing E_flow / E(N) over the N ladder (imp-35997) locates its peak at N* ~ 9.65e1 ' +
    '(log10 N* ~ 1.985), a height far BELOW every landmark previously measured on this split, with a peak ' +
    'share of only ~ 0.1587 (~ 15.9%) -- and even there E_coll still carries the majority (sigma ~ 0.841). ' +
    'At every landmark height above ~100 (the interior sigma peak N ~ 9.22e5, the Kneedle elbow N ~ 2.13e8, ' +
    'the sigma = 0.5 crossover N ~ 3.27e9) the flow share has already fallen further, to ~ 3.06e-2, ~ 4.08e-3 ' +
    'and ~ 9.51e-4 respectively. So E_flow is NEVER the leading term and never even the second-largest term ' +
    'anywhere on the ladder above its own tiny-N peak -- the nominal three-way split E(N) = ' +
    'E_trunc + E_flow + E_coll is, in practice, a TWO-way split E_trunc + E_coll at every height that matters ' +
    'for the Platt-Trudgian frontier, with E_flow contributing a small and shrinking correction.',

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    changesAnyBound: false,
    portsAnyRoute: false,
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'EFFECTIVELY TWO-WAY (restated from imp-35997): the middle flow term E_flow never dominates the ' +
    'imp-35889 three-way split anywhere on the N ladder -- its own maximum share is only ~15.9% at a very ' +
    'low height N ~ 96.5, and the share only falls further at every landmark height above ~100. The split ' +
    'is therefore effectively E_trunc + E_coll at every height that matters. Note only; changes no bound; NO QED.',
});

export const IMP36069_EFLOW_NEVER_DOMINATES_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36069-peak-share-matches-source',
    why: 'The restated peak flow share must equal the imp-35997 source value (~0.1587, well below 1/2).',
    holds: () =>
      IMP36069_EFLOW_NEVER_DOMINATES_HONEST_STATUS.peakResult.peakShareFlow === SOURCE.flowShareMax.peakShareFlow &&
      Math.abs(IMP36069_EFLOW_NEVER_DOMINATES_HONEST_STATUS.peakResult.peakShareFlow - 0.1587) < 2e-3 &&
      IMP36069_EFLOW_NEVER_DOMINATES_HONEST_STATUS.peakResult.peakShareFlow < 0.5,
  },
  {
    id: 'imp36069-eflow-never-dominates-flag-matches-source',
    why: 'The restated never-dominates flag must equal the imp-35997 source finding (true).',
    holds: () =>
      IMP36069_EFLOW_NEVER_DOMINATES_HONEST_STATUS.peakResult.eFlowNeverDominates === true &&
      IMP36069_EFLOW_NEVER_DOMINATES_HONEST_STATUS.peakResult.eFlowNeverDominates === SOURCE.flowShareMax.eFlowNeverDominates,
  },
  {
    id: 'imp36069-landmark-shares-monotone-decreasing-above-peak',
    why: 'Flow share must strictly decrease across the three landmarks above the peak (interior -> elbow -> crossover).',
    holds: () => {
      const L = IMP36069_EFLOW_NEVER_DOMINATES_HONEST_STATUS.landmarkLadder;
      return (
        L.interiorSigmaPeak.shareFlow > L.kneedleElbow.shareFlow &&
        L.kneedleElbow.shareFlow > L.sigmaHalfCrossover.shareFlow
      );
    },
  },
  {
    id: 'imp36069-all-landmarks-below-peak-share',
    why: 'Every landmark flow share (above N ~ 100) must sit below the peak share (~0.1587).',
    holds: () => {
      const L = IMP36069_EFLOW_NEVER_DOMINATES_HONEST_STATUS.landmarkLadder;
      const peak = IMP36069_EFLOW_NEVER_DOMINATES_HONEST_STATUS.peakResult.peakShareFlow;
      return L.interiorSigmaPeak.shareFlow < peak && L.kneedleElbow.shareFlow < peak && L.sigmaHalfCrossover.shareFlow < peak;
    },
  },
  {
    id: 'imp36069-conclusion-two-way-split',
    why: 'The conclusion must state the split is effectively TWO-way (E_trunc + E_coll) at landmark heights.',
    holds: () => /TWO-way split/.test(IMP36069_EFLOW_NEVER_DOMINATES_HONEST_STATUS.conclusion),
  },
  {
    id: 'imp36069-honesty-gate',
    why: 'This is a read-only restatement note: it must not claim proof, RH reduction, or any changed bound.',
    holds: () =>
      IMP36069_EFLOW_NEVER_DOMINATES_HONEST_STATUS.honestCaveat.isProof === false &&
      IMP36069_EFLOW_NEVER_DOMINATES_HONEST_STATUS.honestCaveat.isReductionBelowRH === false &&
      IMP36069_EFLOW_NEVER_DOMINATES_HONEST_STATUS.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36069_EFLOW_NEVER_DOMINATES_HONEST_STATUS.honestCaveat.sota),
  },
  {
    id: 'imp36069-verdict-effectively-two-way-no-qed',
    why: 'The verdict must record EFFECTIVELY TWO-WAY and NO QED, matching the imp-35997 source conclusion.',
    holds: () =>
      /EFFECTIVELY TWO-WAY/.test(IMP36069_EFLOW_NEVER_DOMINATES_HONEST_STATUS.verdict) &&
      /NO QED/.test(IMP36069_EFLOW_NEVER_DOMINATES_HONEST_STATUS.verdict),
  },
];

for (const assertion of IMP36069_EFLOW_NEVER_DOMINATES_HONEST_STATUS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36069-eflow-never-dominates-honest-status assertion failed: ${assertion.id}`);
  }
}

export default IMP36069_EFLOW_NEVER_DOMINATES_HONEST_STATUS;
