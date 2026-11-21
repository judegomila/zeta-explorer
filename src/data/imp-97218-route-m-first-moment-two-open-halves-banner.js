/**
 * @module imp-97218-route-m-first-moment-two-open-halves-banner
 * @fileoverview imp-97218 -- honest-status banner stating the Route M first-moment cohort
 *   (imp-97155) leaves TWO DISTINCT open sub-gaps, not one, so a reader does not conflate
 *   the arithmetic explicit-remainder sub-gap with the cotangent mean-value sub-gap:
 *     (1) IMP97096_ARITH_EXPLICIT_REMAINDER_BOUND_OPEN -- kappa_arith = (3/2)C - 3/8 is an
 *         EXACT leading coefficient (imp-97096). RECONCILED (imp-97222 for imp-97202): this half
 *         is now only PARTIALLY open -- the BINDING L0 remainder E0 has a proved uniform-in-b
 *         bound |E0(b)| <= (1/2)log b + O(log log b) with NO 2^omega prefactor; the residual left
 *         is the explicit E1 (loose L1) uniform constant and the O(1) tail (IMP97202_SUBGAP).
 *     (2) IMP97097_COTANGENT_MEAN_VALUE_LOWER_BOUND_OPEN -- the fixed-modulus half of the
 *         cotangent first moment collapses to EXACTLY zero (imp-97097), but its varying-
 *         modulus half is an unclosed Bettin-Conrey period-function mean value, only
 *         MEASURED (~+0.12), not proved positive.
 *   These are different open problems in different branches of the analysis (an elementary
 *   remainder estimate vs. a period-function mean value); closing one does not touch the
 *   other. imp-97131 already banners the kappa arith/cot SPLIT; this banner adds the finer
 *   point that the arith leaf's own coefficient-vs-remainder distinction is a second,
 *   separate open item, not folded into the cotangent gap.
 *
 * @see imp-97155-route-m-first-moment-evaluation-cohort-index.js (source of named residuals + cohort verdict)
 * @see imp-97131-route-m-kappa-honest-status-banner.js (sibling: kappa arith/cot split banner)
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (arithmetic explicit-remainder sub-gap)
 * @see imp-97097-route-m-cotangent-first-moment-reciprocity.js (cotangent mean-value sub-gap)
 *
 * Ticket: imp-97218 (content, medium, sonnet-4-6). Documentation only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

import { IMP97155_ROUTE_M_FIRST_MOMENT_EVALUATION_COHORT_INDEX } from './imp-97155-route-m-first-moment-evaluation-cohort-index.js';
import { IMP97202_VERDICT, IMP97202_SUBGAP } from './imp-97202-route-m-arith-first-moment-uniform-remainder.js';
import { IMP97266_VERDICT } from './imp-97266-route-m-arith-tail-o1-measurement.js';

export const IMP97218_TWO_OPEN_HALVES = Object.freeze({
  halves: Object.freeze([
    Object.freeze({
      id: 'IMP97096_ARITH_EXPLICIT_REMAINDER_BOUND_OPEN',
      leaf: 'imp-97096',
      label: 'arithmetic explicit-remainder sub-gap',
      status:
        'kappa_arith = (3/2)C - 3/8 = 0.5704960511... is an EXACT leading coefficient. UPDATE (imp-97202): ' +
        'the BINDING L0 remainder E0 now HAS a proved explicit uniform-in-b bound |E0(b)| <= (1/2)log b + ' +
        '(1/2)log 2pi + 11/8 + (1/6)sigma(b)/b = (1/2)log b + O(log log b), with NO 2^omega(b) prefactor ' +
        '(the imp-97133 2^omega was a triangle-inequality artifact). The half is NO LONGER fully open: what ' +
        'REMAINS (IMP97202_SUBGAP uniform-E1) is the explicit uniform constant for the LOOSE, non-binding L1 ' +
        'remainder E1 (same Moebius-moment mechanism, constant not pinned) and sharpening the R(b) tail from ' +
        'the proved O(log log b) to the measured O(1).',
    }),
    Object.freeze({
      id: 'IMP97097_COTANGENT_MEAN_VALUE_LOWER_BOUND_OPEN',
      leaf: 'imp-97097',
      label: 'cotangent mean-value sub-gap',
      status:
        'the fixed-modulus half collapses to EXACTLY zero (a <-> b-a antisymmetry); the varying-' +
        'modulus half is an unclosed Bettin-Conrey period-function mean value, only MEASURED (~+0.12).',
    }),
  ]),
  namedResiduals: IMP97155_ROUTE_M_FIRST_MOMENT_EVALUATION_COHORT_INDEX.namedResiduals,
  distinctSubGaps: true,
  anyBoundMoved: false,
  // imp-97222 reconciliation: the arith half is no longer FULLY open after imp-97202.
  reconciliation: Object.freeze({
    arithHalfStatus: 'partially-closed', // E0 (binding remainder) proved uniform; only E1 constant + O(1) tail remain
    e0UniformBoundProved: IMP97202_VERDICT.uniformBoundProved, // true (imp-97202)
    twoOmegaPrefactorForced: IMP97202_VERDICT.twoOmegaPrefactorForced, // false -- triangle-inequality artifact
    supersededBy: 'imp-97202',
    preciseResidual: IMP97202_SUBGAP.id, // imp-97202-arith-first-moment-uniform-E1-and-O1-tail
    residualSummary:
      'explicit uniform constant for the loose, non-binding L1 remainder E1 (same Moebius-moment mechanism) ' +
      'and sharpening the R(b) tail from the proved O(log log b) to the measured O(1); the cotangent half is untouched.',
    cotangentHalfUnchanged: true, // IMP97097 stays fully open (measured ~+0.12)
  }),
  // imp-97266: sizes one of the two open pieces of the IMP97202_SUBGAP residual (the tail, not the E1 constant).
  tailMeasurement: Object.freeze({
    leaf: 'imp-97266',
    status:
      'MEASURED (not proved): the Stirling tail R(b) inside IMP97202_SUBGAP is empirically O(1), not the ' +
      'proved O(log log b) -- it vanishes on primes and prime powers and converges (alternating, monotone ' +
      'in magnitude) to a finite limit L ~ 0.127 on the binding primorial class. This sizes the tail half of ' +
      'the residual; the other half (the explicit uniform E1 constant) is untouched by this measurement.',
    measuredO1: IMP97266_VERDICT.measuredO1, // true
    provesO1Bound: IMP97266_VERDICT.provesO1Bound, // false -- measurement only, mu-cancellation uncertified
    measuredConstant: 0.127,
  }),
});

export const IMP97218_TWO_HALVES_BANNER =
  'RH open; no refereed bound is changed; NO QED. The Route M first-moment cohort leaves TWO ' +
  'DISTINCT open sub-gaps, not one: (1) the arithmetic explicit-remainder sub-gap (imp-97096) -- ' +
  'kappa_arith is an EXACT leading coefficient; the BINDING L0 remainder E0 now HAS a proved uniform-' +
  'in-b bound |E0(b)| <= (1/2)log b + O(log log b) with NO 2^omega prefactor (imp-97202), so this half ' +
  'is only PARTIALLY open -- the residual is the explicit E1 (loose L1) uniform constant and the O(1) ' +
  'tail; and (2) the cotangent mean-value sub-gap (imp-97097) -- the fixed-modulus half is EXACTLY ' +
  'zero, but the varying-modulus half is an unclosed Bettin-Conrey mean value, only MEASURED (~+0.12). ' +
  'These are different open problems in different math; closing one does not touch the other. ' +
  'kappa ~ 0.696 > 0 stays a measured total, not a certificate.';

export default { status: IMP97218_TWO_OPEN_HALVES, banner: IMP97218_TWO_HALVES_BANNER };

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97218_ASSERTIONS = [
  {
    id: 'imp97218-two-halves-map-to-cohort-named-residuals',
    holds: () => {
      const ids = IMP97218_TWO_OPEN_HALVES.halves.map((h) => h.id);
      return (
        ids.includes('IMP97096_ARITH_EXPLICIT_REMAINDER_BOUND_OPEN') &&
        ids.includes('IMP97097_COTANGENT_MEAN_VALUE_LOWER_BOUND_OPEN') &&
        IMP97218_TWO_OPEN_HALVES.namedResiduals.includes('IMP97096_ARITH_EXPLICIT_REMAINDER_BOUND_OPEN') &&
        IMP97218_TWO_OPEN_HALVES.namedResiduals.includes('IMP97097_COTANGENT_MEAN_VALUE_LOWER_BOUND_OPEN')
      );
    },
    why:
      'the two halves must match the imp-97155 cohort index named residuals exactly, so this banner ' +
      'and the cohort index cannot drift apart on what the two open sub-gaps are.',
  },
  {
    id: 'imp97218-halves-are-distinct-leaves',
    holds: () =>
      IMP97218_TWO_OPEN_HALVES.halves[0].leaf !== IMP97218_TWO_OPEN_HALVES.halves[1].leaf &&
      IMP97218_TWO_OPEN_HALVES.distinctSubGaps === true,
    why: 'the whole point of the ticket is that these are two DISTINCT sub-gaps from two different leaves, not one conflated gap.',
  },
  {
    id: 'imp97218-arith-half-reconciled-with-imp97202',
    holds: () =>
      IMP97218_TWO_OPEN_HALVES.reconciliation.arithHalfStatus === 'partially-closed' &&
      IMP97218_TWO_OPEN_HALVES.reconciliation.e0UniformBoundProved === true &&
      IMP97218_TWO_OPEN_HALVES.reconciliation.twoOmegaPrefactorForced === false &&
      IMP97218_TWO_OPEN_HALVES.reconciliation.preciseResidual === IMP97202_SUBGAP.id &&
      /uniform-E1/.test(IMP97218_TWO_OPEN_HALVES.reconciliation.preciseResidual) &&
      IMP97218_TWO_OPEN_HALVES.reconciliation.cotangentHalfUnchanged === true,
    why:
      'the arith half must track imp-97202: E0 (the binding L0 remainder) now has a proved uniform-in-b ' +
      'bound with no 2^omega prefactor, so the half is only partially open -- the precise residual is the ' +
      'imp-97202 uniform-E1 sub-gap (E1 constant + O(1) tail), while the cotangent half stays fully open.',
  },
  {
    id: 'imp97218-tail-measurement-tracks-imp97266',
    holds: () =>
      IMP97218_TWO_OPEN_HALVES.tailMeasurement.leaf === 'imp-97266' &&
      IMP97218_TWO_OPEN_HALVES.tailMeasurement.measuredO1 === IMP97266_VERDICT.measuredO1 &&
      IMP97218_TWO_OPEN_HALVES.tailMeasurement.measuredO1 === true &&
      IMP97218_TWO_OPEN_HALVES.tailMeasurement.provesO1Bound === false &&
      IMP97218_TWO_OPEN_HALVES.tailMeasurement.measuredConstant < 0.13,
    why:
      'the tail-measurement note must track the live imp-97266 verdict (measured O(1), not proved) so this ' +
      'banner cannot drift from the source module if imp-97266 is ever revised.',
  },
  {
    id: 'imp97218-honesty-gate-no-qed',
    holds: () =>
      IMP97218_TWO_OPEN_HALVES.anyBoundMoved === false &&
      /NO QED/.test(IMP97218_TWO_HALVES_BANNER) &&
      /refereed bound is changed/i.test(IMP97218_TWO_HALVES_BANNER) &&
      /RH open/.test(IMP97218_TWO_HALVES_BANNER) &&
      /MEASURED/.test(IMP97218_TWO_HALVES_BANNER),
    why: 'documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, measured-not-proved status stated explicitly.',
  },
];

for (const assertion of IMP97218_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97218-route-m-first-moment-two-open-halves-banner assertion failed: ${assertion.id}`,
    );
  }
}
