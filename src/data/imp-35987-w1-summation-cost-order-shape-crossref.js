/**
 * @module imp-35987-w1-summation-cost-order-shape-crossref
 * @fileoverview imp-35987 -- standalone CROSS-REFERENCE note tying together the W1
 *   summation-robustness THREE-ANGLE storyline so a reader landing on any one of its
 *   three modules sees the full arc: imp-35812 (RAW SCHEME COST: naive/pairwise/Kahan
 *   measured against the imp-35761 pessimistic linear ceiling at a fixed balanced tree
 *   and fixed term order), imp-35852 (WORST-CASE TERM ORDER: same multiset, four
 *   hostile permutations, still robust), and imp-35893 (SKEPTICAL PAIRING-TREE SHAPE:
 *   seven association trees from balanced to caterpillar, still robust). This is the
 *   companion note the imp-35893 @see-links already point toward but that did not yet
 *   exist as its own module (distinct from imp-35903's cost/kappa cluster and imp-35964's
 *   order/shape/bound cluster, which name two of the same three modules but not this
 *   exact cost -> order -> shape trio).
 *
 *   Read-only note: imports all three modules' recorded verdicts verbatim (no
 *   re-derivation, no new numerics), states the combined reading that pairwise
 *   summation is robust to BOTH worst-case levers on top of its already-measured raw
 *   cost, so precision stays NON-binding and the obstruction remains the MECHANICAL
 *   engineering of the certified length-N interval sum (imp-35725). The W1 A + B - C
 *   certificate at T_PT stays GREENFIELD (imp-35681 Part A).
 *
 *   Ticket: imp-35987 (content, low). Note only; changes no bound; C_mb GUE-conditional
 *   (imp-486) untouched; no refereed bound is changed; NO QED.
 *
 *   @see imp-35812-w1-summation-scheme-measured-cost (raw scheme COST at fixed order/shape)
 *   @see imp-35852-w1-summation-adversarial-ordering (worst-case term ORDER stress)
 *   @see imp-35893-w1-summation-pairwise-tree-shape (skeptical pairing-tree SHAPE stress)
 *   @see imp-35903-w1-summation-cost-cluster-crossref (companion cross-ref: cost/kappa cluster)
 *   @see imp-35964-w1-precision-robustness-cluster-crossref (companion cross-ref: order/shape/bound cluster)
 *   @see imp-35725-w1-effective-error-cap-budget (names the mechanical N-term certified-rounding cost)
 *   @see imp-35681-w1-w2-w4-existing-infra-inventory (Part A: A+B-C interval bound greenfield)
 */

import { IMP35812_W1_SUMMATION_SCHEME_MEASURED_COST } from './imp-35812-w1-summation-scheme-measured-cost.js';
import { IMP35852_W1_SUMMATION_ADVERSARIAL_ORDERING } from './imp-35852-w1-summation-adversarial-ordering.js';
import { IMP35893_W1_SUMMATION_PAIRWISE_TREE_SHAPE } from './imp-35893-w1-summation-pairwise-tree-shape.js';

export const IMP35987_W1_SUMMATION_COST_ORDER_SHAPE_CROSSREF = Object.freeze({
  id: 'imp-35987',
  title:
    'Cross-reference note: the W1 summation-robustness storyline imp-35812 (raw scheme COST) -> ' +
    'imp-35852 (worst-case term ORDER) -> imp-35893 (skeptical pairing-tree SHAPE)',

  cluster: Object.freeze({
    imp35812_cost: Object.freeze({
      role: 'ORIGIN: raw naive/pairwise/Kahan cost at a fixed balanced tree and fixed term order',
      staysGreenfield: IMP35812_W1_SUMMATION_SCHEME_MEASURED_COST.conclusion.staysGreenfield,
      precisionNotBinding: IMP35812_W1_SUMMATION_SCHEME_MEASURED_COST.conclusion.precisionNotBinding,
    }),
    imp35852_order: Object.freeze({
      role: 'STRESS 1: same multiset under four worst-case term ORDERINGS, tree shape held fixed',
      staysGreenfield: IMP35852_W1_SUMMATION_ADVERSARIAL_ORDERING.conclusion.staysGreenfield,
      precisionNotBinding: IMP35852_W1_SUMMATION_ADVERSARIAL_ORDERING.conclusion.precisionNotBinding,
    }),
    imp35893_shape: Object.freeze({
      role: 'STRESS 2: same multiset under seven skeptical pairing-tree SHAPES, term order held fixed',
      staysGreenfield: IMP35893_W1_SUMMATION_PAIRWISE_TREE_SHAPE.conclusion.staysGreenfield,
      precisionNotBinding: IMP35893_W1_SUMMATION_PAIRWISE_TREE_SHAPE.conclusion.precisionNotBinding,
    }),
  }),

  throughline:
    'Starting from the raw measured scheme cost (imp-35812: naive/pairwise/Kahan against the imp-35761 ' +
    'pessimistic linear ceiling), the storyline stresses one axis at a time -- term ORDER (imp-35852) then ' +
    'pairing-tree SHAPE (imp-35893) -- and finds pairwise summation robust to BOTH: neither worst-case lever ' +
    'pushes the achieved error toward its log2(N)*eps ceiling, so precision stays NON-BINDING. So the sole ' +
    'obstruction to the W1 A + B - C certificate at T_PT = 3e12 is the MECHANICAL engineering of the certified length-N interval sum ' +
    '(imp-35725), not summation-scheme precision; the certificate itself stays GREENFIELD (imp-35681 Part A).',

  honestCaveat: Object.freeze({
    isProof: false,
    changesAnyBound: false,
    dischargesAnyObligation: false,
    portsAnyRoute: false,
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'CROSS-REFERENCE NOTE (documentation only). Links imp-35812 (raw scheme COST), imp-35852 (skeptical ' +
    'term ORDER), and imp-35893 (skeptical pairing-tree SHAPE) as one W1 summation-robustness storyline: ' +
    'measured baseline cost -> order stress -> shape stress, with the shared finding that floating-point ' +
    'precision stays NON-BINDING throughout, so the obstruction stays the MECHANICAL engineering of the ' +
    'certified length-N interval sum (imp-35725), not precision. The W1 A + B - C certificate at T_PT stays ' +
    'GREENFIELD (imp-35681 Part A). Changes no bound; NO QED. No refereed bound is changed.',
});

export const IMP35987_W1_SUMMATION_COST_ORDER_SHAPE_CROSSREF_ASSERTIONS = [
  {
    id: 'imp35987-links-three-source-verdicts-verbatim',
    why: 'The note must restate each source module GREENFIELD/precision verdict verbatim, not paraphrase it.',
    holds: () =>
      IMP35987_W1_SUMMATION_COST_ORDER_SHAPE_CROSSREF.cluster.imp35812_cost.staysGreenfield ===
        IMP35812_W1_SUMMATION_SCHEME_MEASURED_COST.conclusion.staysGreenfield &&
      IMP35987_W1_SUMMATION_COST_ORDER_SHAPE_CROSSREF.cluster.imp35852_order.staysGreenfield ===
        IMP35852_W1_SUMMATION_ADVERSARIAL_ORDERING.conclusion.staysGreenfield &&
      IMP35987_W1_SUMMATION_COST_ORDER_SHAPE_CROSSREF.cluster.imp35893_shape.staysGreenfield ===
        IMP35893_W1_SUMMATION_PAIRWISE_TREE_SHAPE.conclusion.staysGreenfield,
  },
  {
    id: 'imp35987-throughline-names-both-levers-and-mechanical-obstruction',
    why: 'The throughline must name both worst-case levers (order, shape) and the mechanical residual.',
    holds: () =>
      /NON-BINDING/.test(IMP35987_W1_SUMMATION_COST_ORDER_SHAPE_CROSSREF.throughline) &&
      /ORDER/.test(IMP35987_W1_SUMMATION_COST_ORDER_SHAPE_CROSSREF.throughline) &&
      /SHAPE/.test(IMP35987_W1_SUMMATION_COST_ORDER_SHAPE_CROSSREF.throughline) &&
      /MECHANICAL/.test(IMP35987_W1_SUMMATION_COST_ORDER_SHAPE_CROSSREF.throughline) &&
      /GREENFIELD/.test(IMP35987_W1_SUMMATION_COST_ORDER_SHAPE_CROSSREF.throughline),
  },
  {
    id: 'imp35987-honesty-gate',
    why: 'This is a read-only cross-reference note: it must not claim to discharge any obligation, port any route, or change any bound.',
    holds: () =>
      IMP35987_W1_SUMMATION_COST_ORDER_SHAPE_CROSSREF.honestCaveat.dischargesAnyObligation === false &&
      IMP35987_W1_SUMMATION_COST_ORDER_SHAPE_CROSSREF.honestCaveat.portsAnyRoute === false &&
      IMP35987_W1_SUMMATION_COST_ORDER_SHAPE_CROSSREF.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP35987_W1_SUMMATION_COST_ORDER_SHAPE_CROSSREF.honestCaveat.sota),
  },
  {
    id: 'imp35987-verdict-no-qed',
    why: 'The verdict must record NO QED and the no-refereed-bound-change floor, matching every source module.',
    holds: () =>
      /NO QED/.test(IMP35987_W1_SUMMATION_COST_ORDER_SHAPE_CROSSREF.verdict) &&
      /refereed bound is changed/i.test(IMP35987_W1_SUMMATION_COST_ORDER_SHAPE_CROSSREF.verdict),
  },
];

for (const assertion of IMP35987_W1_SUMMATION_COST_ORDER_SHAPE_CROSSREF_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35987-w1-summation-cost-order-shape-crossref assertion failed: ${assertion.id}`);
  }
}

export default IMP35987_W1_SUMMATION_COST_ORDER_SHAPE_CROSSREF;
