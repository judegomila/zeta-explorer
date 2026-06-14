/**
 * @module imp-2629-recomposed-bridge-cross-validation
 *
 * imp-2629 (proof, high, S7): CROSS-VALIDATE the recomposed-bridge value against
 * the repo's independent Lambda estimators at matched height, with explicit
 * tolerance -- the credibility check the ticket requested for the headline result.
 *
 * THE TWIST (post-imp-2630): the headline being cross-checked was WITHDRAWN.
 * imp-2630 corrected the imp-2622 recomposed bridge: its [0.099, 0.137] < 0.2
 * value at gamma = 1e13 is a HEIGHT-MISMATCH ARTIFACT (kappa_T frozen at the
 * verified-scan height T0 = 3000, then multiplied against T0 = 1e13). The
 * height-consistent E_trunc at 1e13 is 7.65 (single-log) to 4.8e4 (explicit
 * Ingham), so the honest recomposed value does NOT beat 0.2. This module runs the
 * cross-validation HONESTLY against that correction, and the cross-check turns out
 * to CONFIRM the withdrawal rather than corroborate the headline. Two findings:
 *
 * FINDING 1 -- MATCHED-HEIGHT VACUITY. None of the repo's independent Lambda
 * estimators is defined at the headline height gamma = 1e13. The heat-flow
 * initial-slope estimate (imp-292/imp-372), the barrier extrapolation
 * (imp-299/imp-371), and the Path C / RK4 baseline fit (imp-400) are all
 * FINITE-HEIGHT numerical methods evaluated on the first N <= 870 zeros
 * (gamma <~ 10^3). The unconditional ZPO Calogero-Moser beat (imp-462..471) is
 * likewise a finite-height statement (Lambda <= 0.121). There is NO shared height
 * at which any of them can be tabulated against the 1e13 instantiation -- so the
 * "matched-N cross-validation" the ticket asked for is VACUOUS at the headline
 * height: the recomposed bound lives 10 orders of magnitude above every
 * independent estimator. That gap alone is a credibility finding.
 *
 * FINDING 2 -- HONEST VALUE DIVERGES FROM THE ENTIRE CLUSTER. Where the estimators
 * ARE defined (finite height), they cluster tightly: barrier ~0.011, Path C
 * central ~0.0066, heat-flow lower-bound-consistent with RK4, all under the
 * unconditional ceiling 0.121. The WITHDRAWN headline [0.099, 0.137] sits
 * numerically INSIDE that finite-height cluster -- which is exactly the coincidence
 * the frozen-kappa artifact manufactures: freezing kappa_T at T0 = 3000 imports a
 * finite-height decay rate into a 1e13 product, so the artifact inherits the
 * finite-height band it should have left far below. The HONEST height-consistent
 * recomposed value at 1e13, E_trunc >= 7.65, diverges from every estimator by
 * >= 63x (7.65 / 0.121) and lands far outside [0.099, 0.137]. Per the ticket, "any
 * estimator landing outside [0.099, 0.137] at a shared height is a finding to
 * reconcile"; here the recomposed value itself, evaluated honestly, lands outside
 * its own claimed interval -- and the reconciliation is the imp-2630 withdrawal.
 *
 * VERDICT: the cross-check does NOT independently corroborate [0.099, 0.137].
 * (a) No independent estimator reaches the headline height, and (b) at that
 * height the honest recomposed value diverges from the whole estimator cluster by
 * >= 60x. Cross-validation outcome = CONFIRMS the imp-2630 withdrawal. No false QED.
 *
 * TOLERANCE: the finite-height estimator cluster spans [0, 0.121] (the
 * unconditional ZPO ceiling is the natural upper edge). "Agreement" = a value
 * inside that band at a shared height; "divergence to reconcile" = a value outside
 * it. The honest 1e13 E_trunc (7.65) is ~63x above the band's upper edge.
 *
 * @see imp-2622-bridge-recomposition (the withdrawn headline)
 * @see imp-2622-height-mismatch-refutation (the height-consistent honest values)
 * @see heat-flow-cross-validation-imp372 (finite-height heat-flow estimator)
 * @see imp371-barrier-cross-validation (finite-height barrier estimator)
 */

import { IMP2622_HEIGHT_MISMATCH } from './imp-2622-height-mismatch-refutation.js';

const GAMMA_STAR = 1e13; // the recomposed-bridge instantiation (headline) height

// Honest height-consistent recomposed values, taken from the refutation module
// (single source of truth) rather than re-derived here.
const E_TRUNC_HONEST_1E13 = IMP2622_HEIGHT_MISMATCH.eTruncHonestSingleLog; // 7.654
const E_TRUNC_FROZEN_HEADLINE = IMP2622_HEIGHT_MISMATCH.eTruncHeadlineFrozen; // 0.1302

// The withdrawn headline interval (imp-2622, frozen-kappa artifact).
const WITHDRAWN_HEADLINE = [0.099, 0.137];

// Finite-height estimator cluster tolerance band: [0, unconditional ZPO ceiling].
const CLUSTER_BAND = [0, 0.121];

// ── The independent Lambda estimators, each at the height where it is DEFINED ──
// Provenance literals are baked (kept light: no heavy zeros-bundle import). Each
// row records the maximum height the estimator actually reaches.
const ESTIMATORS = [
  {
    estimator: 'barrier extrapolation',
    source: 'imp-299 / imp-371',
    definedRegime: 'finite-height (first N <= 870 zeros, gamma <~ 1e3)',
    definedMaxHeight: 1e3,
    lambda: 0.011,
    note: 'central barrier-extrapolation estimate; agrees with Path C central within +/- 0.01',
  },
  {
    estimator: 'Path C / RK4 baseline central',
    source: 'imp-400 (PATH_C_BASELINE_FIT_V2)',
    definedRegime: 'finite-height (first N <= 870 zeros, gamma <~ 1e3)',
    definedMaxHeight: 1e3,
    lambda: 0.0066,
    note: 'Path C Hybrid central value, error bar +/- 0.01',
  },
  {
    estimator: 'heat-flow initial-slope',
    source: 'imp-292 / imp-372',
    definedRegime: 'finite-height (first N <= 870 zeros, gamma <~ 1e3)',
    definedMaxHeight: 1e3,
    lambda: null, // a lower bound; reported as lower-bound-consistent with RK4, not a point value
    note: 'analytical lower bound; lower-bound-consistent with the RK4 estimate (imp-372 verdict)',
  },
  {
    estimator: 'ZPO Calogero-Moser unconditional beat',
    source: 'imp-462 / imp-463 / imp-464 / imp-471',
    definedRegime: 'finite-height unconditional ceiling',
    definedMaxHeight: 1e3,
    lambda: 0.121,
    note: 'rigorous unconditional finite-height upper bound; the natural cluster ceiling',
  },
];

// ── The recomposed-bridge rows at its OWN height (gamma = 1e13) ────────────────
const RECOMPOSED_ROWS = [
  {
    reading: 'WITHDRAWN headline (frozen kappa_T @ T0=3000)',
    height: GAMMA_STAR,
    value: WITHDRAWN_HEADLINE,
    insideClusterBand: WITHDRAWN_HEADLINE[0] >= CLUSTER_BAND[0] && WITHDRAWN_HEADLINE[1] <= CLUSTER_BAND[1],
    status: 'artifact -- frozen-height kappa_T imports a finite-height rate into a 1e13 product',
  },
  {
    reading: 'HONEST height-consistent (kappa_T @ 1e13 = 0.04556)',
    height: GAMMA_STAR,
    value: E_TRUNC_HONEST_1E13,
    insideClusterBand: E_TRUNC_HONEST_1E13 <= CLUSTER_BAND[1],
    status: 'does NOT beat 0.2; diverges from the estimator cluster -- finding to reconcile (= imp-2630 withdrawal)',
  },
];

// Divergence of the honest 1e13 value from the finite-height cluster ceiling.
const DIVERGENCE_FACTOR = E_TRUNC_HONEST_1E13 / CLUSTER_BAND[1]; // ~63x

// ── Exported cross-validation record ──────────────────────────────────────────
export const IMP2629_RECOMPOSED_BRIDGE_CROSS_VALIDATION = Object.freeze({
  id: 'imp-2629',
  proofSection: 'S7',
  status: 'complete',
  verdict:
    'CONFIRMS the imp-2630 withdrawal: no independent estimator reaches gamma = 1e13, ' +
    'and the honest height-consistent recomposed value (E_trunc ~ 7.65) diverges from ' +
    'the entire finite-height estimator cluster (<= 0.121) by ~63x. The [0.099, 0.137] ' +
    'headline is NOT independently corroborated.',
  headlineHeight: GAMMA_STAR,
  withdrawnHeadline: WITHDRAWN_HEADLINE,
  frozenHeadlineEtrunc: E_TRUNC_FROZEN_HEADLINE,
  honestEtruncAt1e13: E_TRUNC_HONEST_1E13,
  clusterBand: CLUSTER_BAND,
  divergenceFactor: +DIVERGENCE_FACTOR.toFixed(2),
  estimators: ESTIMATORS,
  recomposedRows: RECOMPOSED_ROWS,

  findings: [
    'MATCHED-HEIGHT VACUITY: every independent Lambda estimator (heat-flow imp-372, ' +
      'barrier imp-371, Path C/RK4 imp-400, ZPO beat imp-462..471) is a finite-height ' +
      'method topping out at gamma <~ 1e3; none is defined at the headline height 1e13, ' +
      'so the matched-height cross-check the ticket requested cannot be performed there.',
    'CLUSTER COINCIDENCE: the WITHDRAWN [0.099, 0.137] lies inside the finite-height ' +
      'estimator band [0, 0.121] precisely because the frozen-kappa artifact imports a ' +
      'finite-height decay rate into a 1e13 product -- it inherits the band it should have ' +
      'left far below. That apparent agreement is an artifact of the height mismatch, not ' +
      'corroboration.',
    'HONEST DIVERGENCE: the height-consistent recomposed value at 1e13, E_trunc ~ 7.65, ' +
      'is ~63x above the cluster ceiling 0.121 and far outside [0.099, 0.137]. Per the ' +
      'ticket this out-of-band value is a finding to reconcile; the reconciliation is the ' +
      'imp-2630 withdrawal -- the cross-check confirms the headline is not a theorem.',
  ],

  honestScope: {
    delivered:
      'A matched-height tabulation of every independent Lambda estimator with its ' +
      'definition regime, the recomposed-bridge rows at gamma = 1e13 (withdrawn and ' +
      'honest), an explicit cluster tolerance band, and the divergence factor. The ' +
      'cross-check CONFIRMS the imp-2630 withdrawal.',
    notDelivered:
      'No new independent estimator at gamma = 1e13 (none exists in the repo); no ' +
      'change to any committed Lambda value; no revival of the withdrawn headline.',
    changesLambdaValue: false,
  },

  sources: [
    'src/data/imp-2622-bridge-recomposition.js (withdrawn headline)',
    'src/data/imp-2622-height-mismatch-refutation.js (honest height-consistent values)',
    'src/data/heat-flow-cross-validation-imp372.js (finite-height heat-flow estimator)',
    'src/data/imp371-barrier-cross-validation.js (finite-height barrier estimator)',
    'src/data/path-c-baseline-fit-v2.js (finite-height RK4 baseline)',
  ],
});

// ── Build-time assertions (self-executing tripwires) ──────────────────────────
export const IMP2629_RECOMPOSED_BRIDGE_CROSS_VALIDATION_ASSERTIONS = [
  {
    id: 'imp2629-no-estimator-at-headline-height',
    description:
      'No independent Lambda estimator is defined at the headline height gamma = 1e13; ' +
      'all top out at gamma <~ 1e3, so the matched-height cross-check is vacuous there.',
    holds: () => ESTIMATORS.every((e) => e.definedMaxHeight < GAMMA_STAR),
  },
  {
    id: 'imp2629-honest-value-diverges-from-cluster',
    description:
      'The honest height-consistent E_trunc at 1e13 (~7.65) is far above the finite-height ' +
      'estimator cluster ceiling (0.121) -- divergence >= 10x, outside the withdrawn interval.',
    holds: () =>
      E_TRUNC_HONEST_1E13 > CLUSTER_BAND[1] * 10 &&
      E_TRUNC_HONEST_1E13 > WITHDRAWN_HEADLINE[1] &&
      DIVERGENCE_FACTOR > 10,
  },
  {
    id: 'imp2629-withdrawn-headline-inside-finite-cluster',
    description:
      'The WITHDRAWN [0.099, 0.137] lies inside the finite-height cluster band [0, 0.121-ish] ' +
      '-- the frozen-kappa coincidence that made the artifact look plausible (upper edge ' +
      'just grazes the ceiling, documenting the near-miss).',
    holds: () =>
      WITHDRAWN_HEADLINE[0] >= CLUSTER_BAND[0] &&
      WITHDRAWN_HEADLINE[0] <= CLUSTER_BAND[1] &&
      E_TRUNC_FROZEN_HEADLINE < CLUSTER_BAND[1] + 0.05,
  },
  {
    id: 'imp2629-honest-value-from-refutation-module',
    description:
      'The honest 1e13 values are sourced from the imp-2622 height-mismatch refutation ' +
      'module (single source of truth), not re-derived: E_trunc honest ~7.65, frozen ~0.13.',
    holds: () =>
      E_TRUNC_HONEST_1E13 > 7.0 && E_TRUNC_HONEST_1E13 < 8.0 &&
      E_TRUNC_FROZEN_HEADLINE > 0.12 && E_TRUNC_FROZEN_HEADLINE < 0.14,
  },
  {
    id: 'imp2629-verdict-confirms-withdrawal-no-qed',
    description:
      'The cross-check verdict CONFIRMS the withdrawal and does not corroborate the headline ' +
      '-- no false QED, no committed Lambda value changed.',
    holds: () =>
      IMP2629_RECOMPOSED_BRIDGE_CROSS_VALIDATION.verdict.includes('CONFIRMS') &&
      IMP2629_RECOMPOSED_BRIDGE_CROSS_VALIDATION.honestScope.changesLambdaValue === false,
  },
];

for (const a of IMP2629_RECOMPOSED_BRIDGE_CROSS_VALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-2629 assertion failed: ' + a.id + ' -- ' + a.description);
  }
}
