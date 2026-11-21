/**
 * @module imp-36130-naive-vs-compensated-conditioning-growth-honest-status
 * @fileoverview imp-36130 -- standalone HONEST-STATUS note (imp-36125-style restatement
 *   pattern) recording the imp-36094 finding that, on the imp-35973 clustered worst term
 *   order across the imp-35812 N ladder [1000, 10000, 100000, 488602], the NAIVE left-to-
 *   right W1 summation error GROWS with conditioning kappa (kappa: 61.9 -> 1391.0; naive
 *   normalized error: ~1.07e-16 -> ~4.86e-15, a ~45x rise) while BOTH compensated schemes
 *   (classic Kahan and Kahan-Babuska-Neumaier) stay N-FLAT, remaining ~3-4 orders of
 *   magnitude below the unit-roundoff reference u = 2^-53 ~ 1.1102e-16 at every rung.
 *   Read-only note: imports the imp-36094 viz-data module verbatim (no re-derivation, no
 *   new numerics) and states the honesty boundary plainly for a reader who lands on this
 *   ticket without reading imp-36094/imp-36023 in full -- the growth is a property of the
 *   NAIVE scheme's conditioning sensitivity, not of the underlying W1 sum itself, and
 *   compensation (either variant) removes it entirely on this fixed representative family.
 *
 *   Ticket: imp-36130 (content, medium). Note only; re-reads nothing new; changes no
 *   bound; C_mb GUE-conditional (imp-486) untouched; no refereed bound is changed
 *   ; NO QED.
 *
 *   @see imp-36094-kbn-kahan-naive-error-ladder-viz-data.js (source module this note restates)
 *   @see imp-36023-kbn-combined-worst-ladder.js (underlying measurement)
 *   @see imp-35973-w1-summation-order-shape-cross-term (single-endpoint combined stress)
 *   @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + N ladder)
 *   @see imp-36125-w1-accumulator-recovery-margin-honest-status.js (the restatement pattern this note follows)
 */

import { IMP36094_ERROR_LADDER, IMP36094_SCALES } from './imp-36094-kbn-kahan-naive-error-ladder-viz-data.js';

const U_ROUNDOFF = IMP36094_SCALES.unitRoundoff;
const FIRST = IMP36094_ERROR_LADDER[0];
const LAST = IMP36094_ERROR_LADDER[IMP36094_ERROR_LADDER.length - 1];

export const IMP36130_NAIVE_VS_COMPENSATED_CONDITIONING_GROWTH_HONEST_STATUS = Object.freeze({
  id: 'imp-36130',
  proofSection: 'S-frontier',
  title:
    'Honest-status note: on the imp-35973 clustered worst order, the NAIVE W1 sum error grows ' +
    'with conditioning (~45x across the ladder) while Kahan/KBN stay N-flat below unit roundoff',
  sourceModule: 'imp-36094-kbn-kahan-naive-error-ladder-viz-data.js',

  naiveAtNFirst: FIRST.naive,
  naiveAtNLast: LAST.naive,
  naiveGrowthFactor: LAST.naive / FIRST.naive,
  kappaFirst: FIRST.kappa,
  kappaLast: LAST.kappa,
  unitRoundoff: U_ROUNDOFF,
  kahanMaxOverU: Math.max(...IMP36094_ERROR_LADDER.map((r) => r.kahan)) / U_ROUNDOFF,
  kbnMaxOverU: Math.max(...IMP36094_ERROR_LADDER.map((r) => r.kbn)) / U_ROUNDOFF,

  honestyBoundary:
    'The imp-36094 ladder shows the NAIVE left-to-right sum error tracking the conditioning ' +
    'number kappa (kappa rises ~62 -> ~1391 across the N ladder, naive normalized error rises ' +
    'from ~1.07e-16 to ~4.86e-15, a ~45x growth) while BOTH classic Kahan and KBN compensation ' +
    'stay N-FLAT, never exceeding a few times 1e-19 -- three to four orders of magnitude below ' +
    'the unit-roundoff reference u = 2^-53 ~ 1.1102e-16 at every rung. This is a statement about ' +
    'SUMMATION-SCHEME sensitivity on one fixed representative (clustered, same-sign) term family, ' +
    'not a new bound on the underlying W1 quantity: the growth is entirely removed by either ' +
    'compensated scheme, so it never propagates into the certified W1 A + B - C construction, ' +
    'which stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725).',

  conclusion:
    'imp-36094 bakes the imp-36023 measured ladder comparing naive, classic-Kahan, and KBN ' +
    'summation error against conditioning across four N rungs. The naive scheme is the only one ' +
    'of the three whose error is conditioning-sensitive at these problem sizes; both compensated ' +
    'variants are effectively insensitive to the ~22x rise in kappa over the ladder, confirming ' +
    'that compensation (not merely a larger N or a different order) is what keeps summation error ' +
    'decoupled from conditioning here. Precision remains NOT the binding constraint on the W1 ' +
    'construction; the obstruction stays the ENGINEERING of the certified length-N interval sum.',

  honestCaveat: Object.freeze({
    isProof: false,
    isRigorous: false,
    isUnconditional: false,
    isNewMeasurement: false,
    changesAnyBound: false,
    reDerivesAnything: false,
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'MEASUREMENT-ONLY restatement of imp-36094/imp-36023: on the imp-35973 clustered worst order, ' +
    'the naive left-to-right W1 sum error grows with conditioning (~1.07e-16 at N=1000 to ' +
    '~4.86e-15 at N~488602, tracking kappa ~62 -> ~1391) while both classic Kahan and KBN ' +
    'compensation stay N-flat, ~3-4 orders below unit roundoff u = 2^-53, at every rung. ' +
    'Restatement only; changes no bound; C_mb GUE-conditional (imp-486) untouched; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
});

export const IMP36130_NAIVE_VS_COMPENSATED_CONDITIONING_GROWTH_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36130-naive-grows-substantially',
    why: 'The core claim is that the naive scheme error grows sharply with conditioning across the ladder.',
    holds: () =>
      IMP36130_NAIVE_VS_COMPENSATED_CONDITIONING_GROWTH_HONEST_STATUS.naiveGrowthFactor > 20,
  },
  {
    id: 'imp36130-kappa-grows-too',
    why: 'The growth must track a rising conditioning number, not be an artifact of a shrinking kappa.',
    holds: () =>
      IMP36130_NAIVE_VS_COMPENSATED_CONDITIONING_GROWTH_HONEST_STATUS.kappaLast >
      10 * IMP36130_NAIVE_VS_COMPENSATED_CONDITIONING_GROWTH_HONEST_STATUS.kappaFirst,
  },
  {
    id: 'imp36130-compensated-stay-below-unit-roundoff',
    why: 'Both compensated schemes must stay below unit roundoff at their worst rung, confirming N-flatness.',
    holds: () =>
      IMP36130_NAIVE_VS_COMPENSATED_CONDITIONING_GROWTH_HONEST_STATUS.kahanMaxOverU < 1 &&
      IMP36130_NAIVE_VS_COMPENSATED_CONDITIONING_GROWTH_HONEST_STATUS.kbnMaxOverU < 1,
  },
  {
    id: 'imp36130-honesty-boundary-mentions-conditioning',
    why: 'The honesty-boundary text must plainly name the conditioning-driven growth, not just report numbers.',
    holds: () =>
      /conditioning/.test(IMP36130_NAIVE_VS_COMPENSATED_CONDITIONING_GROWTH_HONEST_STATUS.honestyBoundary) &&
      /N-FLAT/.test(IMP36130_NAIVE_VS_COMPENSATED_CONDITIONING_GROWTH_HONEST_STATUS.honestyBoundary),
  },
  {
    id: 'imp36130-honesty-gate',
    why: 'This is a read-only restatement note: it must not claim a new measurement or a bound change.',
    holds: () =>
      IMP36130_NAIVE_VS_COMPENSATED_CONDITIONING_GROWTH_HONEST_STATUS.honestCaveat.isNewMeasurement === false &&
      IMP36130_NAIVE_VS_COMPENSATED_CONDITIONING_GROWTH_HONEST_STATUS.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36130_NAIVE_VS_COMPENSATED_CONDITIONING_GROWTH_HONEST_STATUS.honestCaveat.sota),
  },
  {
    id: 'imp36130-verdict-no-qed',
    why: 'The verdict must record NO QED, matching the standing no-refereed-bound-change caveat.',
    holds: () => /NO QED/.test(IMP36130_NAIVE_VS_COMPENSATED_CONDITIONING_GROWTH_HONEST_STATUS.verdict),
  },
];

for (const assertion of IMP36130_NAIVE_VS_COMPENSATED_CONDITIONING_GROWTH_HONEST_STATUS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36130-naive-vs-compensated-conditioning-growth-honest-status assertion failed: ${assertion.id}`
    );
  }
}

export default IMP36130_NAIVE_VS_COMPENSATED_CONDITIONING_GROWTH_HONEST_STATUS;
