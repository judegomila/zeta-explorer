/**
 * @module imp-35963-w1-apriori-bound-vs-random-walk-honest-status
 * @fileoverview imp-35963 -- standalone HONEST-STATUS note recording the imp-35890
 *   finding that even the tightest CERTIFIED deterministic a-priori bound for the W1
 *   naive summation (the running-accumulator Higham form, ~3.9e-14 normalized) stays
 *   ~3 orders ABOVE the achieved error (~3.0e-17), because no deterministic a-priori
 *   bound recovers the sqrt(N) random-walk cancellation of the N-1 roundoffs -- only
 *   the worst-case COHERENT accumulation. Read-only note: imports the imp-35890 module
 *   verbatim (no re-derivation, no new numerics), restates the residual-gap result
 *   plainly for a reader who has not read imp-35890 in full.
 *
 *   Ticket: imp-35963 (content, low). Note only; ports nothing; changes no bound;
 *   no refereed bound is changed; NO QED.
 *
 *   @see imp-35890-w1-running-accumulator-apriori-bound.js (source: the tightest certified bound this note restates)
 *   @see imp-35948-w1-probabilistic-sqrtN-apriori-scale (companion: an UNCERTIFIED probabilistic scale that DOES close most of the residual)
 *   @see imp-35812-w1-summation-scheme-measured-cost (exact-BigInt ACHIEVED naive error this note cites)
 *   @see imp-35725 (the certified length-N interval sum this note names as the remaining obstruction)
 *   @see imp-35681-w1-w2-w4-existing-infra-inventory (Part A: W1 A+B-C certificate, stays GREENFIELD)
 */

import { IMP35890_W1_RUNNING_ACCUMULATOR_APRIORI_BOUND } from './imp-35890-w1-running-accumulator-apriori-bound.js';

const SOURCE = IMP35890_W1_RUNNING_ACCUMULATOR_APRIORI_BOUND;

export const IMP35963_W1_APRIORI_BOUND_VS_RANDOM_WALK_HONEST_STATUS = Object.freeze({
  id: 'imp-35963',
  title:
    'Honest-status note: even the tightest CERTIFIED deterministic a-priori bound stays ~3 orders above ' +
    'the achieved error, because no deterministic bound recovers the sqrt(N) random-walk cancellation',
  sourceModule: 'imp-35890-w1-running-accumulator-apriori-bound.js',

  tightestCertifiedBound: Object.freeze({
    value: SOURCE.bounds.runningAccumulatorSumPartials.value,
    form: SOURCE.bounds.runningAccumulatorSumPartials.form,
    achievedNaive: SOURCE.bounds.achievedNaive.value,
    ordersResidual: SOURCE.gapDecomposition.ordersResidualCoherentVsRandomWalk,
  }),

  conclusion:
    'The tightest USABLE certified a-priori bound (the running-accumulator Higham form, ' +
    '~3.9e-14 normalized, sum-of-partials variant) is ~3.2 orders below the pessimistic N * eps ' +
    'ceiling, yet still stays ~3.3 orders ABOVE the achieved naive error ~3.0e-17, because it retains ' +
    'the worst-case COHERENT accumulation of the N-1 roundoffs. The achieved error instead accumulates ' +
    'as a random walk (~sqrt(N) u), a statistical cancellation that NO deterministic a-priori bound can ' +
    'certify -- it is closed only by direct measurement, not by a sharper worst-case scale.',

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    changesAnyBound: false,
    portsAnyRoute: false,
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'RESIDUAL INTRINSIC (restated from imp-35890): the tightest certified deterministic bound stays ' +
    '~3.3 orders above the achieved error; the gap is the coherent-vs-random-walk pessimism intrinsic ' +
    'to any deterministic worst-case bound, not a recoverable slack. Precision stays NON-binding either ' +
    'way (the certified bound sits ~4 orders under the imp-35760 barrier margin). Note only; changes no ' +
    'bound; NO QED.',
});

export const IMP35963_W1_APRIORI_BOUND_VS_RANDOM_WALK_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp35963-tightest-bound-matches-source',
    why: 'The restated tightest certified bound value must equal the imp-35890 sum-of-partials value.',
    holds: () =>
      IMP35963_W1_APRIORI_BOUND_VS_RANDOM_WALK_HONEST_STATUS.tightestCertifiedBound.value ===
      SOURCE.bounds.runningAccumulatorSumPartials.value,
  },
  {
    id: 'imp35963-bound-above-achieved',
    why: 'The tightest certified bound must still sit strictly above the achieved naive error.',
    holds: () => {
      const t = IMP35963_W1_APRIORI_BOUND_VS_RANDOM_WALK_HONEST_STATUS.tightestCertifiedBound;
      return t.value > t.achievedNaive && t.value / t.achievedNaive > 1e2;
    },
  },
  {
    id: 'imp35963-residual-orders-in-range',
    why: 'The restated residual-orders figure must match the imp-35890 source decomposition (~3.3 orders, >2.5).',
    holds: () => {
      const r = IMP35963_W1_APRIORI_BOUND_VS_RANDOM_WALK_HONEST_STATUS.tightestCertifiedBound.ordersResidual;
      return Math.abs(r - SOURCE.gapDecomposition.ordersResidualCoherentVsRandomWalk) < 1e-12 && r > 2.5;
    },
  },
  {
    id: 'imp35963-conclusion-names-random-walk',
    why: 'The conclusion must name the sqrt(N) random-walk cancellation as the un-recoverable residual.',
    holds: () =>
      /random walk/.test(IMP35963_W1_APRIORI_BOUND_VS_RANDOM_WALK_HONEST_STATUS.conclusion) &&
      /COHERENT/.test(IMP35963_W1_APRIORI_BOUND_VS_RANDOM_WALK_HONEST_STATUS.conclusion),
  },
  {
    id: 'imp35963-honesty-gate',
    why: 'This is a read-only restatement note: it must not claim proof, RH reduction, or any changed bound.',
    holds: () =>
      IMP35963_W1_APRIORI_BOUND_VS_RANDOM_WALK_HONEST_STATUS.honestCaveat.isProof === false &&
      IMP35963_W1_APRIORI_BOUND_VS_RANDOM_WALK_HONEST_STATUS.honestCaveat.isReductionBelowRH === false &&
      IMP35963_W1_APRIORI_BOUND_VS_RANDOM_WALK_HONEST_STATUS.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP35963_W1_APRIORI_BOUND_VS_RANDOM_WALK_HONEST_STATUS.honestCaveat.sota),
  },
  {
    id: 'imp35963-verdict-residual-no-qed',
    why: 'The verdict must record the RESIDUAL INTRINSIC finding and NO QED.',
    holds: () =>
      /RESIDUAL INTRINSIC/.test(IMP35963_W1_APRIORI_BOUND_VS_RANDOM_WALK_HONEST_STATUS.verdict) &&
      /NO QED/.test(IMP35963_W1_APRIORI_BOUND_VS_RANDOM_WALK_HONEST_STATUS.verdict) &&
      SOURCE.isRigorous === false,
  },
];

for (const assertion of IMP35963_W1_APRIORI_BOUND_VS_RANDOM_WALK_HONEST_STATUS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35963-w1-apriori-bound-vs-random-walk-honest-status assertion failed: ${assertion.id}`);
  }
}

export default IMP35963_W1_APRIORI_BOUND_VS_RANDOM_WALK_HONEST_STATUS;
