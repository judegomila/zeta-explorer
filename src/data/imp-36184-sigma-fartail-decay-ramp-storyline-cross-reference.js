/**
 * @module imp-36184-sigma-fartail-decay-ramp-storyline-cross-reference
 * @fileoverview imp-36184 -- read-only cross-reference NARRATIVE assembling the
 *   four-stage sigma(N) far-tail decay-exponent-ramp storyline for a reader who
 *   lands on any ONE of its four modules without the upstream/downstream
 *   context. Each stage refines a claim the previous stage left unquantified:
 *
 *     imp-33582 (RAMP)       -- quantifies the imp-3406 post-peak decay as a
 *       six-decade per-decade local exponent ladder, 0.0105 -> 0.4310, ramping
 *       toward the imp-3463 far-tail 1/2; also locates the sigma=1/2 halving
 *       landmark at N ~ 3.27e9 (matching the imp-3444 crossover).
 *     imp-33701 (S-SHAPE)    -- differences that six-decade ladder and shows
 *       the ramp is SIGMOID, not straight or ever-steepening: velocity D1
 *       rises then falls, acceleration D2 changes sign exactly once, a knee
 *       coarsely located to the WHOLE [1e10,1e11] decade.
 *     imp-33721 (SUB-DECADE) -- refines that whole-decade knee on a
 *       quarter-decade sub-grid: the true inflection is N* ~ 3.38e9, a FULL
 *       DECADE below the imp-33701 coarse bracket (decade-averaging had
 *       smeared it upward), robust to sub-bracket width, ~3.3% above the
 *       imp-33582 halving landmark.
 *     imp-33744 (CLOSED FORM) -- derives WHY the knee sits near the halving
 *       point: in the logistic flow d sigma/dt = -g(t) sigma(1-sigma), the
 *       inflection is sigma_infl = 1/2 - g_prime/(2 g^2), which is EXACTLY 1/2
 *       for a frozen power law and displaced by the running log-factor
 *       (not E_flow) for the real model -- reproducing the imp-33721 ~3.3% gap.
 *
 *   THE THING A READER LANDING ON ANY SINGLE STAGE MOST OFTEN MISSES
 *   ------------------------------------------------------------------
 *   Each stage's prose motivates itself entirely as "the previous stage said
 *   X but never measured/derived Y" -- so reading imp-33701 without imp-33582,
 *   or imp-33744 without imp-33721, drops the antecedent claim being refined.
 *   In particular: (a) imp-33701's "monotone but sigmoid" claim only makes
 *   sense against imp-33582's raw monotone ladder; (b) imp-33721's headline
 *   finding is that imp-33701's coarse knee location is a DECADE OFF, which
 *   reads as a correction, not a restatement, only with imp-33701 in view;
 *   (c) imp-33744's closed form explains a coincidence (~3.3% gap) that only
 *   imp-33721 measured. Assembly / cross-reference ONLY: imports all four
 *   verbatim, derives nothing new, closes nothing, no QED.
 *
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (Stage 1: six-decade local-exponent ladder + sigma=1/2 halving landmark ~3.27e9)
 * @see imp-33701-sigma-postpeak-ramp-curvature-inflection (Stage 2: ladder curvature is SIGMOID, knee coarsely in [1e10,1e11])
 * @see imp-33721-sigma-ramp-inflection-subdecade (Stage 3: knee relocated to sub-decade N* ~ 3.38e9, a decade below Stage 2)
 * @see imp-33744-sigma-inflection-vs-half-closed-form (Stage 4: closed-form sigma_infl = 1/2 - g_prime/(2 g^2), explains the ~3.3% gap)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below, the asymptote all four stages ramp toward)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover ~3.28e9, the halving landmark's independent twin)
 *
 *   Ticket: imp-36184 (content, low). Note only; imports all four source
 *   records verbatim; changes no bound; NO QED; no refereed bound is changed.
 */

import { IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY } from './imp-33582-sigma-postpeak-nearpeak-threshold-decay.js';
import { IMP33701_SIGMA_POSTPEAK_RAMP_CURVATURE_INFLECTION } from './imp-33701-sigma-postpeak-ramp-curvature-inflection.js';
import { IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE } from './imp-33721-sigma-ramp-inflection-subdecade.js';
import { IMP33744_SIGMA_INFLECTION_VS_HALF_CLOSED_FORM } from './imp-33744-sigma-inflection-vs-half-closed-form.js';

export const IMP36184_SIGMA_FARTAIL_DECAY_RAMP_STORYLINE_CROSS_REFERENCE = Object.freeze({
  id: 'imp-36184',
  title:
    'Cross-reference narrative: the sigma(N) far-tail decay-exponent-ramp storyline -- imp-33582 (six-decade ' +
    'ladder) -> imp-33701 (sigmoid curvature) -> imp-33721 (sub-decade knee relocation) -> imp-33744 ' +
    '(closed-form inflection-vs-half derivation) -- for a reader landing on any single stage cold',

  chain: Object.freeze([
    Object.freeze({
      stage: 1,
      id: IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY.id,
      label: 'RAMP: six-decade per-decade local-exponent ladder',
      claim:
        'The imp-3406 post-peak decay quantified as a ladder p_dec = 0.0105 -> 0.0447 -> 0.1176 -> ' +
        '0.2360 -> 0.3561 -> 0.4310 across [1e6,1e12], climbing monotonely toward the imp-3463 ' +
        'far-tail 1/2; sigma crosses 1/2 at N ~ 3.27e9, matching the imp-3444 crossover.',
      leavesOpen: 'Never measures the CURVATURE of the ramp -- is it straight, convex, or S-shaped?',
      isRigorous: IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY.isRigorous,
    }),
    Object.freeze({
      stage: 2,
      id: IMP33701_SIGMA_POSTPEAK_RAMP_CURVATURE_INFLECTION.id,
      label: 'S-SHAPE: ladder curvature is sigmoid, knee coarsely bracketed',
      claim:
        'Differencing the Stage-1 ladder: velocity D1 rises then falls, acceleration D2 changes sign ' +
        'exactly ONCE -- the ramp is monotone in value but SIGMOID in shape, with a single knee ' +
        'landing somewhere in the whole [1e10,1e11] decade.',
      leavesOpen: 'The whole-decade window cannot say WHERE inside [1e10,1e11] the knee actually sits.',
      isRigorous: IMP33701_SIGMA_POSTPEAK_RAMP_CURVATURE_INFLECTION.isRigorous,
    }),
    Object.freeze({
      stage: 3,
      id: IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE.id,
      label: 'SUB-DECADE: knee relocated a full decade below the Stage-2 bracket',
      claim:
        'Refining Stage 2 on a quarter-decade sub-grid across [1e9,1e11]: the true inflection is ' +
        'N* ~ 3.38e9 (log10 N* ~ 9.529), inside [1e9,1e10] -- a FULL DECADE below the Stage-2 ' +
        '[1e10,1e11] bracket, robust to sub-bracket width, and ~3.3% above the Stage-1 sigma=1/2 ' +
        'halving landmark (~3.27e9).',
      leavesOpen: 'Calls the ~3.3% gap "essentially coincident" but never derives whether it is exact.',
      isRigorous: IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE.isRigorous,
    }),
    Object.freeze({
      stage: 4,
      id: IMP33744_SIGMA_INFLECTION_VS_HALF_CLOSED_FORM.id,
      label: 'CLOSED FORM: why the knee sits near (not exactly at) sigma=1/2',
      claim:
        'In the E_flow-negligible logistic flow, the sigmoid inflection is sigma_infl = ' +
        '1/2 - g_prime/(2 g^2): EXACTLY 1/2 for a frozen power law (g_prime = 0), but displaced by ' +
        'the running log-factor L = log T0(N) for the real model -- reproducing the Stage-3 ~3.3% ' +
        'gap as a structural E_coll term, with E_flow only a subdominant secondary shift.',
      leavesOpen: 'Nothing within this storyline -- closes the inflection-vs-halving coincidence question.',
      isRigorous: IMP33744_SIGMA_INFLECTION_VS_HALF_CLOSED_FORM.isRigorous,
    }),
  ]),

  whyFourStages:
    'Each module motivates itself as "the previous stage asserted X in prose but never measured/derived ' +
    'it" -- imp-33582 quantifies imp-3406 prose into a ladder; imp-33701 resolves the ladder\'s "climbs ' +
    'monotonely" into curvature; imp-33721 resolves imp-33701\'s whole-decade knee into a sub-decade N*; ' +
    'imp-33744 resolves imp-33721\'s "essentially coincident" into a derived closed form. Reading any one ' +
    'stage alone drops the antecedent claim it refines -- in particular imp-33721\'s headline finding ' +
    '(the Stage-2 knee location is a DECADE off) reads as a plain restatement rather than a correction ' +
    'without Stage 2 in view.',

  sharedAsymptote: {
    farTailExponent: 0.5,
    description: 'All four stages ramp toward the imp-3463 far-tail exponent 1/2, approached from below.',
  },

  halvingLandmark: {
    N: IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY.thresholdCrossings.sigma_below_0_5_at_N,
    matchesImp3444Crossover:
      IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY.thresholdCrossings.half_crossing_vs_imp3444,
  },

  honestCaveat: Object.freeze({
    isProof: false,
    closesAnyGap: false,
    derivesAnythingNew: false,
    isReductionBelowRH: false,
    carriesRHVerdict: false,
    scope:
      'Read-only cross-reference narrative assembling the imp-33582/imp-33701/imp-33721/imp-33744 ' +
      'records verbatim into one four-stage arc. Derives nothing new; every stage stays ' +
      'measurement/derivation-only within the inherited imp-3220/imp-3406 extrapolation model.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP36184_SIGMA_FARTAIL_DECAY_RAMP_STORYLINE_CROSS_REFERENCE_ASSERTIONS = [
  {
    id: 'imp36184-four-stages-in-order',
    why: 'The assembled chain must contain exactly the four named modules, in storyline order.',
    holds: () => {
      const c = IMP36184_SIGMA_FARTAIL_DECAY_RAMP_STORYLINE_CROSS_REFERENCE.chain;
      return (
        c.length === 4 &&
        c.map((s) => s.id).join(',') === 'imp-33582,imp-33701,imp-33721,imp-33744'
      );
    },
  },
  {
    id: 'imp36184-all-stages-measurement-only',
    why: 'Every stage in the storyline is measurement/derivation-only, never rigorous/RH-carrying.',
    holds: () =>
      IMP36184_SIGMA_FARTAIL_DECAY_RAMP_STORYLINE_CROSS_REFERENCE.chain.every((s) => s.isRigorous === false),
  },
  {
    id: 'imp36184-shared-fartail-asymptote-is-half',
    why: 'All four stages ramp toward the same imp-3463 far-tail exponent 1/2.',
    holds: () =>
      IMP36184_SIGMA_FARTAIL_DECAY_RAMP_STORYLINE_CROSS_REFERENCE.sharedAsymptote.farTailExponent === 0.5,
  },
  {
    id: 'imp36184-halving-landmark-matches-imp3444',
    why: 'The Stage-1 halving landmark must match the imp-3444 crossover to within 1%, as Stage 1 itself asserts.',
    holds: () =>
      Math.abs(IMP36184_SIGMA_FARTAIL_DECAY_RAMP_STORYLINE_CROSS_REFERENCE.halvingLandmark.matchesImp3444Crossover - 1) <
      1e-2,
  },
  {
    id: 'imp36184-honesty-gate',
    why: 'Mandatory honesty: an ASSEMBLY note that closes NOTHING, derives nothing new, carries NO RH verdict.',
    holds: () => {
      const h = IMP36184_SIGMA_FARTAIL_DECAY_RAMP_STORYLINE_CROSS_REFERENCE.honestCaveat;
      return (
        h.isProof === false &&
        h.closesAnyGap === false &&
        h.derivesAnythingNew === false &&
        h.isReductionBelowRH === false &&
        h.carriesRHVerdict === false &&
        /Platt-Trudgian|refereed bound is changed/.test(h.sota)
      );
    },
  },
];

for (const assertion of IMP36184_SIGMA_FARTAIL_DECAY_RAMP_STORYLINE_CROSS_REFERENCE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36184-sigma-fartail-decay-ramp-storyline-cross-reference assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP36184_SIGMA_FARTAIL_DECAY_RAMP_STORYLINE_CROSS_REFERENCE;
