/**
 * @module imp-36074-two-cliff-gap-constant-robustness-honest-status
 * @fileoverview imp-36074 -- standalone HONEST-STATUS note recording the imp-36021
 *   finding that the ~6.2e-4-decade separation between the two imp-35972
 *   effective-height representability cliffs (cliff A, the RvM seed numerator
 *   2 pi . N > MAX_VALUE overflow; cliff B, the a -> 0 T . u denominator
 *   overflow, which coincides exactly with the R_direct NaN cliff) is
 *   CONSTANT-ROBUST: dlog10(gap)/dlog(K) = dlog10(gap)/dlog(delta) =
 *   dlog10(gap)/dlog(S_inf) = 0 to the last bit across a +/-4-order K sweep and
 *   a delta in [1e-4, 4e-4] sweep. It is a fixed IEEE-754 seed geometry, not a
 *   constant-tunable quantity.
 *
 *   This note ALSO independently re-derives the imp-36021 "only-if" edge (the K
 *   below which cliff B WOULD move) by direct bisection on the same aOf seed
 *   used by imp-36021/imp-35972, rather than importing imp-36021's exported
 *   K_underflow_edge_below_which_cliffB_moves field: that field is computed in
 *   imp-36021 from Number.MAX_VALUE * MIN_NORMAL_DOUBLE / (2 pi) (~6.37e-1),
 *   which does not match imp-36021's OWN prose derivation (division underflows
 *   only below the smallest DENORMAL, ~5e-324, giving ~1.4e-16) -- a same-file
 *   comment/code mismatch. Bisecting numerically here confirms the prose
 *   figure: cliff B first moves for K below ~7.1e-17, i.e. ~24.3 orders below
 *   the pinned K ~1.5727e8, matching this ticket's "~1.4e-16, 24 orders below"
 *   framing to within the same order of magnitude. Read-only + one independent
 *   numeric check; ports nothing; changes no bound; NO QED.
 *
 * @see imp-36021-two-cliff-gap-constant-sensitivity.js (source: the K/delta/S_inf sweep this note restates; gap/sensitivity fields reused verbatim, underflow-edge field NOT reused)
 * @see imp-36092-two-cliff-constant-invariance-honest-status.js (companion honest-status note restating the same imp-36021 finding; imports the same not-yet-fixed underflow-edge field)
 * @see imp-35972-effective-height-overflow-cliff-bisection (LOCATED the two cliffs at the pinned constants)
 * @see imp-35892-rdirect-own-floor-departure-height (coarse decade sweep; R_direct = -S_inf a/(2-a))
 * @see lambda-rh-height-mapping (effectiveHeightForN RvM inverse; the 2 pi . N seed numerator overflow edge)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { IMP36021_TWO_CLIFF_GAP_CONSTANT_SENSITIVITY } from './imp-36021-two-cliff-gap-constant-sensitivity.js';

const SOURCE = IMP36021_TWO_CLIFF_GAP_CONSTANT_SENSITIVITY;
const TWO_PI = 2 * Math.PI;
const K_PINNED = SOURCE.constants.K_pinned;

// Reproduce the imp-36021 aOf seed verbatim for the independent underflow-edge bisection.
const aOfK = (N, K) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K) / (T * u);
};

function bisectDoubleBoundary(loStart, hiStart, predicate) {
  let lo = loStart;
  let hi = hiStart;
  for (let i = 0; i < 200; i++) {
    const mid = lo + (hi - lo) / 2;
    if (mid === lo || mid === hi) break;
    if (predicate(mid)) lo = mid;
    else hi = mid;
  }
  return { lastHolds: lo, firstFails: hi };
}

const CLIFF_A_N = bisectDoubleBoundary(1e307, Number.MAX_VALUE, (N) => Number.isFinite(effectiveHeightForN(N))).lastHolds;
const cliffBForK = (K) => bisectDoubleBoundary(1e307, CLIFF_A_N, (N) => aOfK(N, K) > 0).lastHolds;
const N_B_PINNED = cliffBForK(K_PINNED);

// Bisect (in log-K space) for the largest K at which cliff B has already moved off N_B_PINNED,
// vs. the smallest K (from below) at which it is still bit-identical to N_B_PINNED.
function bisectUnderflowEdge(loK, hiK) {
  let lo = Math.log(loK); // known: cliff B moved (N_B != N_B_PINNED)
  let hi = Math.log(hiK); // known: cliff B bit-identical to N_B_PINNED
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    const K = Math.exp(mid);
    if (cliffBForK(K) !== N_B_PINNED) lo = mid;
    else hi = mid;
  }
  return { lastMovedK: Math.exp(lo), firstUnmovedK: Math.exp(hi) };
}

const UNDERFLOW_EDGE = bisectUnderflowEdge(1e-17, 1e-15);
const K_UNDERFLOW_EDGE_INDEPENDENT = UNDERFLOW_EDGE.firstUnmovedK;
const ORDERS_BELOW_PINNED = Math.log10(K_PINNED / K_UNDERFLOW_EDGE_INDEPENDENT);

export const IMP36074_TWO_CLIFF_GAP_CONSTANT_ROBUSTNESS_HONEST_STATUS = Object.freeze({
  id: 'imp-36074',
  title:
    'Honest-status note: the imp-36021 two-cliff ~6.2e-4-decade gap is CONSTANT-ROBUST ' +
    '(dlog10(gap)/dlog(K,delta,S_inf) = 0 to the last bit), a fixed IEEE-754 seed property, with an ' +
    'independently re-derived only-if underflow edge (~1e-16 range, ~24 orders below the pinned K)',
  sourceModule: 'imp-36021-two-cliff-gap-constant-sensitivity.js',

  gapRobustness: Object.freeze({
    gap_A_minus_B_decade_at_pinned: SOURCE.metric.gap_A_minus_B_decade_at_pinned,
    sensitivity_dlog10_NB_dlnK: SOURCE.metric.sensitivity_dlog10_NB_dlnK,
    gap_spread_over_K_sweep_decade: SOURCE.metric.gap_spread_over_K_sweep_decade,
    allKPerturbationsBitIdentical: SOURCE.metric.all_K_perturbations_bit_identical_NB,
    allDeltaProbesEqualAZero: SOURCE.metric.all_delta_probes_rdirect_equals_aZero,
    allSInfProbesEqualAZero: SOURCE.metric.all_S_inf_probes_rdirect_equals_aZero,
  }),

  independentUnderflowEdge: Object.freeze({
    K_pinned: K_PINNED,
    K_underflow_edge_last_moved: +K_UNDERFLOW_EDGE_INDEPENDENT.toExponential(6),
    orders_of_magnitude_below_pinned_K: +ORDERS_BELOW_PINNED.toFixed(2),
    method: 'direct bisection on the aOf seed in log-K space, independent of the imp-36021 exported constant',
  }),

  conclusion:
    'The imp-36021 sensitivity sweep (K over +/-4 orders, delta over [1e-4,4e-4], S_inf coupled and ' +
    'decoupled) is reused verbatim: dlog10(N_B)/dlnK = ' +
    SOURCE.metric.sensitivity_dlog10_NB_dlnK.toExponential(2) +
    ' and the ~6.2e-4-decade gap has ZERO spread (' +
    SOURCE.metric.gap_spread_over_K_sweep_decade.toExponential(2) +
    ') over that sweep -- the twin-cliff separation is a fixed IEEE-754 seed geometry, not tunable by K, ' +
    'delta, or S_inf. Separately, this note independently bisects the only-if edge (the K below which ' +
    'cliff B WOULD move) directly on the aOf seed rather than importing imp-36021’s exported ' +
    'K_underflow_edge_below_which_cliffB_moves field, because that field (~' +
    (+SOURCE.constants.K_underflow_edge_below_which_cliffB_moves.toExponential(2)) +
    ') is computed from MAX_VALUE * MIN_NORMAL_DOUBLE / (2 pi), which does not match imp-36021’s own ' +
    'prose derivation (division underflows only below the smallest DENORMAL, giving ~1.4e-16). The ' +
    'independent bisection here confirms the prose figure’s order of magnitude: cliff B first moves for ' +
    'K below ~' +
    K_UNDERFLOW_EDGE_INDEPENDENT.toExponential(2) +
    ', i.e. ~' +
    ORDERS_BELOW_PINNED.toFixed(1) +
    ' orders below the pinned K ~' +
    K_PINNED.toExponential(4) +
    ', consistent with this ticket’s ~1.4e-16 / ~24-orders framing. No realistic K/delta/S_inf ' +
    'provenance approaches this edge, so the zero-sensitivity gap-robustness result stands.',

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    changesAnyBound: false,
    portsAnyRoute: false,
    fixesImp36021ExportedConstant: false,
    subGap: 'imp-34714a REMAINS OPEN',
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'CONSTANT-ROBUST (restated from imp-36021, gap/sensitivity fields reused verbatim): the ~6.2e-4-decade ' +
    'two-cliff gap has zero spread under every tested K/delta/S_inf perturbation. The only-if underflow ' +
    'edge, independently re-bisected here rather than trusting imp-36021’s exported constant, sits ~' +
    ORDERS_BELOW_PINNED.toFixed(1) +
    ' orders below the pinned K -- far outside any stated provenance. Note only; changes no bound; NO QED; ' +
    'no refereed bound is changed.',
});

export const IMP36074_TWO_CLIFF_GAP_CONSTANT_ROBUSTNESS_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36074-gap-fields-match-source',
    why: 'The restated gap/sensitivity fields must equal the imp-36021 source measurement verbatim.',
    holds: () =>
      IMP36074_TWO_CLIFF_GAP_CONSTANT_ROBUSTNESS_HONEST_STATUS.gapRobustness.sensitivity_dlog10_NB_dlnK ===
        SOURCE.metric.sensitivity_dlog10_NB_dlnK &&
      IMP36074_TWO_CLIFF_GAP_CONSTANT_ROBUSTNESS_HONEST_STATUS.gapRobustness.gap_spread_over_K_sweep_decade ===
        SOURCE.metric.gap_spread_over_K_sweep_decade &&
      IMP36074_TWO_CLIFF_GAP_CONSTANT_ROBUSTNESS_HONEST_STATUS.gapRobustness.sensitivity_dlog10_NB_dlnK === 0 &&
      IMP36074_TWO_CLIFF_GAP_CONSTANT_ROBUSTNESS_HONEST_STATUS.gapRobustness.gap_spread_over_K_sweep_decade === 0,
  },
  {
    id: 'imp36074-all-perturbations-bit-identical',
    why: 'The restated all-K/all-delta/all-S_inf bit-identical flags must all be true, matching imp-36021.',
    holds: () =>
      IMP36074_TWO_CLIFF_GAP_CONSTANT_ROBUSTNESS_HONEST_STATUS.gapRobustness.allKPerturbationsBitIdentical === true &&
      IMP36074_TWO_CLIFF_GAP_CONSTANT_ROBUSTNESS_HONEST_STATUS.gapRobustness.allDeltaProbesEqualAZero === true &&
      IMP36074_TWO_CLIFF_GAP_CONSTANT_ROBUSTNESS_HONEST_STATUS.gapRobustness.allSInfProbesEqualAZero === true,
  },
  {
    id: 'imp36074-independent-edge-in-expected-order-of-magnitude',
    why: 'The independently bisected underflow edge must land near 1e-16 (order of magnitude), ~20-30 orders below the pinned K, matching the ticket framing and diverging from the imp-36021 exported (buggy) constant.',
    holds: () => {
      const edge = IMP36074_TWO_CLIFF_GAP_CONSTANT_ROBUSTNESS_HONEST_STATUS.independentUnderflowEdge.K_underflow_edge_last_moved;
      const orders = IMP36074_TWO_CLIFF_GAP_CONSTANT_ROBUSTNESS_HONEST_STATUS.independentUnderflowEdge.orders_of_magnitude_below_pinned_K;
      return edge > 1e-17 && edge < 1e-15 && orders > 20 && orders < 30;
    },
  },
  {
    id: 'imp36074-edge-actually-moves-cliffB',
    why: 'Sanity check: a K at the independently-derived last-moved edge must produce a strictly smaller N_B than the pinned cliff B, confirming the bisection located a real movement, not a false floor.',
    holds: () => cliffBForK(UNDERFLOW_EDGE.lastMovedK) < N_B_PINNED,
  },
  {
    id: 'imp36074-honesty-gate',
    why: 'This is a read-only restatement plus one independent numeric check: it must not claim proof, RH reduction, or a fix to imp-36021.',
    holds: () =>
      IMP36074_TWO_CLIFF_GAP_CONSTANT_ROBUSTNESS_HONEST_STATUS.honestCaveat.isProof === false &&
      IMP36074_TWO_CLIFF_GAP_CONSTANT_ROBUSTNESS_HONEST_STATUS.honestCaveat.isReductionBelowRH === false &&
      IMP36074_TWO_CLIFF_GAP_CONSTANT_ROBUSTNESS_HONEST_STATUS.honestCaveat.changesAnyBound === false &&
      IMP36074_TWO_CLIFF_GAP_CONSTANT_ROBUSTNESS_HONEST_STATUS.honestCaveat.fixesImp36021ExportedConstant === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36074_TWO_CLIFF_GAP_CONSTANT_ROBUSTNESS_HONEST_STATUS.honestCaveat.sota),
  },
  {
    id: 'imp36074-verdict-constant-robust-no-qed',
    why: 'The verdict must record CONSTANT-ROBUST and NO QED, matching the imp-36021 source zero-sensitivity finding.',
    holds: () =>
      /CONSTANT-ROBUST/.test(IMP36074_TWO_CLIFF_GAP_CONSTANT_ROBUSTNESS_HONEST_STATUS.verdict) &&
      /NO QED/.test(IMP36074_TWO_CLIFF_GAP_CONSTANT_ROBUSTNESS_HONEST_STATUS.verdict),
  },
];

for (const assertion of IMP36074_TWO_CLIFF_GAP_CONSTANT_ROBUSTNESS_HONEST_STATUS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36074-two-cliff-gap-constant-robustness-honest-status assertion failed: ${assertion.id}`);
  }
}

export default IMP36074_TWO_CLIFF_GAP_CONSTANT_ROBUSTNESS_HONEST_STATUS;
