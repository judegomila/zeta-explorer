/**
 * @module imp-97218-route-m-first-moment-two-open-halves-banner
 * @fileoverview imp-97218 -- honest-status banner stating the Route M first-moment cohort
 *   (imp-97155) leaves TWO DISTINCT open sub-gaps, not one, so a reader does not conflate
 *   the arithmetic explicit-remainder sub-gap with the cotangent mean-value sub-gap:
 *     (1) IMP97096_ARITH_EXPLICIT_REMAINDER_BOUND_OPEN -- kappa_arith = (3/2)C - 3/8 is an
 *         EXACT leading coefficient (imp-97096), but no explicit uniform-in-b bound on its
 *         L0(b)/L1(b) Moebius/Stirling remainder has been proved yet.
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
 * NO QED; Platt-Trudgian Lambda <= 0.2 SOTA.
 */

import { IMP97155_ROUTE_M_FIRST_MOMENT_EVALUATION_COHORT_INDEX } from './imp-97155-route-m-first-moment-evaluation-cohort-index.js';

export const IMP97218_TWO_OPEN_HALVES = Object.freeze({
  halves: Object.freeze([
    Object.freeze({
      id: 'IMP97096_ARITH_EXPLICIT_REMAINDER_BOUND_OPEN',
      leaf: 'imp-97096',
      label: 'arithmetic explicit-remainder sub-gap',
      status:
        'kappa_arith = (3/2)C - 3/8 = 0.5704960511... is an EXACT leading coefficient; no explicit ' +
        'uniform-in-b remainder bound on the L0(b)/L1(b) Moebius/Stirling sums is proved yet.',
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
});

export const IMP97218_TWO_HALVES_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. The Route M first-moment cohort leaves TWO ' +
  'DISTINCT open sub-gaps, not one: (1) the arithmetic explicit-remainder sub-gap (imp-97096) -- ' +
  'kappa_arith is an EXACT leading coefficient, but no explicit uniform-in-b bound on its L0(b)/' +
  'L1(b) Moebius/Stirling remainder is proved; and (2) the cotangent mean-value sub-gap (imp-97097) ' +
  '-- the fixed-modulus half is EXACTLY zero, but the varying-modulus half is an unclosed Bettin-' +
  'Conrey mean value, only MEASURED (~+0.12). These are different open problems in different math; ' +
  'closing one does not touch the other. kappa ~ 0.696 > 0 stays a measured total, not a certificate.';

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
    id: 'imp97218-honesty-gate-no-qed',
    holds: () =>
      IMP97218_TWO_OPEN_HALVES.anyBoundMoved === false &&
      /NO QED/.test(IMP97218_TWO_HALVES_BANNER) &&
      /remains SOTA/.test(IMP97218_TWO_HALVES_BANNER) &&
      /RH open/.test(IMP97218_TWO_HALVES_BANNER) &&
      /MEASURED/.test(IMP97218_TWO_HALVES_BANNER),
    why: 'documentation only: no bound claimed moved, no QED, PT SOTA line present, measured-not-proved status stated explicitly.',
  },
];

for (const assertion of IMP97218_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97218-route-m-first-moment-two-open-halves-banner assertion failed: ${assertion.id}`,
    );
  }
}
