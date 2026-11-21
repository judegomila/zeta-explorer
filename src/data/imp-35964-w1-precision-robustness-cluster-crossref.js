/**
 * @module imp-35964-w1-precision-robustness-cluster-crossref
 * @fileoverview imp-35964 -- standalone CROSS-REFERENCE note tying together the W1
 *   summation PRECISION-robustness cluster so a reader landing on any one of its three
 *   modules sees the full picture: imp-35852 (robust to worst-case term ORDER),
 *   imp-35893 (robust to skeptical pairing-tree SHAPE), and imp-35890 (even the
 *   tightest deterministic a-priori BOUND overshoots the achieved error). This cluster
 *   is distinct from the pending summation-COST cross-ref (imp-35812-and-siblings,
 *   a different axis): that cluster asks how EXPENSIVE the certified sum is, this one
 *   asks whether PRECISION itself can be pushed toward its ceiling by any skeptical
 *   lever or tightened a-priori bound -- and finds, three ways, that it cannot.
 *
 *   Read-only note: imports all three modules' recorded verdicts verbatim (no
 *   re-derivation, no new numerics), states the shared conclusion that precision is
 *   NON-binding from every angle probed so far, and restates the shared residual: the
 *   obstruction remains the ENGINEERING of the certified length-N interval sum
 *   (imp-35725, MECHANICAL) with the interval-bounded A+B-C certificate at T_PT staying
 *   GREENFIELD (imp-35681 Part A).
 *
 *   Ticket: imp-35964 (content, low). Note only; ports nothing; changes no bound;
 *   no refereed bound is changed; NO QED.
 *
 *   @see imp-35852-w1-summation-adversarial-ordering (robust to worst-case term ORDER)
 *   @see imp-35893-w1-summation-pairwise-tree-shape (robust to skeptical pairing-tree SHAPE)
 *   @see imp-35890-w1-running-accumulator-apriori-bound (tightest a-priori BOUND still overshoots achieved)
 *   @see imp-35774-w1-obligation-cluster-crossref (companion cross-ref note pattern this follows)
 */

import { IMP35852_W1_SUMMATION_ADVERSARIAL_ORDERING } from './imp-35852-w1-summation-adversarial-ordering.js';
import { IMP35893_W1_SUMMATION_PAIRWISE_TREE_SHAPE } from './imp-35893-w1-summation-pairwise-tree-shape.js';
import { IMP35890_W1_RUNNING_ACCUMULATOR_APRIORI_BOUND } from './imp-35890-w1-running-accumulator-apriori-bound.js';

export const IMP35964_W1_PRECISION_ROBUSTNESS_CLUSTER_CROSSREF = Object.freeze({
  id: 'imp-35964',
  title:
    'Cross-reference note: the W1 precision-robustness cluster imp-35852 (term ORDER) + imp-35893 ' +
    '(pairing-tree SHAPE) + imp-35890 (a-priori BOUND gap), distinct from the summation-COST cross-ref',

  cluster: Object.freeze({
    imp35852_order: Object.freeze({
      lever: 'WORST-CASE TERM ORDER: four hostile permutations of the fixed imp-35812 multiset',
      verdict: IMP35852_W1_SUMMATION_ADVERSARIAL_ORDERING.conclusion.precisionNotBinding,
      finding:
        'the worst ordering (clustered same-sign runs) raises the naive error ~160x yet still stays ' +
        '>1e4x below the coherent N*eps ceiling; pairwise / Kahan are essentially ordering-invariant',
    }),
    imp35893_shape: Object.freeze({
      lever: 'SKEPTICAL PAIRING-TREE SHAPE: seven association trees from balanced (depth 12) to caterpillar (depth 3817)',
      verdict: IMP35893_W1_SUMMATION_PAIRWISE_TREE_SHAPE.conclusion.precisionNotBinding,
      finding:
        'a ~300x depth increase does not push pairwise toward its log2(N)*eps ceiling; the worst shape ' +
        'stays >2000x below it and error is non-monotone in depth',
    }),
    imp35890_bound: Object.freeze({
      lever: 'TIGHTEST DETERMINISTIC A-PRIORI BOUND: running-accumulator scale replacing the pessimistic Sum|t_k| scale',
      verdict: IMP35890_W1_RUNNING_ACCUMULATOR_APRIORI_BOUND.conclusion.precisionNotBinding,
      finding:
        'the tightest certifiable bound (~6.4e-14) closes ~3.2 of the ~6.5-order ceiling-to-achieved gap ' +
        'yet still overshoots the achieved naive error (~3.0e-17) by ~3.3 orders -- the remaining gap is ' +
        'coherent-vs-random-walk pessimism no deterministic bound can recover',
    }),
  }),

  distinctFromCostCluster:
    'The pending summation-COST cross-reference (imp-35812 and siblings) asks how EXPENSIVE the ' +
    'certified length-N interval sum is to compute. This PRECISION-robustness cluster asks a different ' +
    'question: whether any worst-case lever (order, shape) or tightened a-priori bound can push the ' +
    'achieved/certifiable error toward its ceiling. The two clusters probe orthogonal axes of the same ' +
    'W1 obligation and neither closes the other.',

  chain:
    'imp-35852 (term ORDER: robust) and imp-35893 (pairing-tree SHAPE: robust) show two independent ' +
    'worst-case LEVERS both fail to push achieved error toward its ceiling; imp-35890 (a-priori BOUND) ' +
    'shows that even the tightest deterministic CERTIFIED bound -- no skeptical measurement involved -- ' +
    'still overshoots the achieved error by ~3.3 orders. Together the three approaches (stress the data, ' +
    'stress the algorithm, tighten the bound) converge on one conclusion from three angles: precision is ' +
    'NON-binding.',

  sharedResidual:
    'Across all three modules the interval-bounded positive-t A+B-C certificate at T_PT = 3e12 stays ' +
    'GREENFIELD and the obstruction stays MECHANICAL (imp-35725): none of the three evaluates a sum of ' +
    'H_t, instantiates a directed-rounding interval, or verifies the strict inequality. The skeptical ' +
    'levers and the a-priori bound narrow HOW MUCH headroom precision leaves, not whether the certificate ' +
    'is discharged.',

  honestCaveat: Object.freeze({
    isProof: false,
    changesAnyBound: false,
    dischargesAnyObligation: false,
    portsAnyRoute: false,
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'CROSS-REFERENCE NOTE (documentation only). Links imp-35852 (worst-case term ORDER), imp-35893 ' +
    '(skeptical pairing-tree SHAPE), and imp-35890 (tightest a-priori BOUND) as a single W1 ' +
    'precision-robustness cluster, distinct from the pending summation-COST cross-ref: both skeptical ' +
    'levers and the a-priori bound leave precision NON-binding, with the interval-bounded A+B-C ' +
    'certificate at T_PT staying GREENFIELD throughout. Ports nothing; changes no bound; NO QED. ' +
    'No refereed bound is changed.',
});

export const IMP35964_W1_PRECISION_ROBUSTNESS_CLUSTER_CROSSREF_ASSERTIONS = [
  {
    id: 'imp35964-links-three-source-verdicts',
    why: 'The note must restate each source module verdict verbatim, not paraphrase it into a new claim.',
    holds: () =>
      IMP35964_W1_PRECISION_ROBUSTNESS_CLUSTER_CROSSREF.cluster.imp35852_order.verdict ===
        IMP35852_W1_SUMMATION_ADVERSARIAL_ORDERING.conclusion.precisionNotBinding &&
      IMP35964_W1_PRECISION_ROBUSTNESS_CLUSTER_CROSSREF.cluster.imp35893_shape.verdict ===
        IMP35893_W1_SUMMATION_PAIRWISE_TREE_SHAPE.conclusion.precisionNotBinding &&
      IMP35964_W1_PRECISION_ROBUSTNESS_CLUSTER_CROSSREF.cluster.imp35890_bound.verdict ===
        IMP35890_W1_RUNNING_ACCUMULATOR_APRIORI_BOUND.conclusion.precisionNotBinding,
  },
  {
    id: 'imp35964-distinct-from-cost-cluster',
    why: 'The note must explicitly distinguish this precision-robustness cluster from the pending summation-COST cross-ref.',
    holds: () =>
      /COST/.test(IMP35964_W1_PRECISION_ROBUSTNESS_CLUSTER_CROSSREF.distinctFromCostCluster) &&
      /imp-35812/.test(IMP35964_W1_PRECISION_ROBUSTNESS_CLUSTER_CROSSREF.distinctFromCostCluster),
  },
  {
    id: 'imp35964-chain-names-three-modules',
    why: 'The chain must name all three source modules and their distinct levers.',
    holds: () =>
      /imp-35852/.test(IMP35964_W1_PRECISION_ROBUSTNESS_CLUSTER_CROSSREF.chain) &&
      /imp-35893/.test(IMP35964_W1_PRECISION_ROBUSTNESS_CLUSTER_CROSSREF.chain) &&
      /imp-35890/.test(IMP35964_W1_PRECISION_ROBUSTNESS_CLUSTER_CROSSREF.chain),
  },
  {
    id: 'imp35964-shared-residual-greenfield',
    why: 'The shared residual must record GREENFIELD and MECHANICAL, matching every source verdict.',
    holds: () =>
      /GREENFIELD/.test(IMP35964_W1_PRECISION_ROBUSTNESS_CLUSTER_CROSSREF.sharedResidual) &&
      /MECHANICAL/.test(IMP35964_W1_PRECISION_ROBUSTNESS_CLUSTER_CROSSREF.sharedResidual),
  },
  {
    id: 'imp35964-honesty-gate',
    why: 'This is a read-only cross-reference note: it must not claim to discharge any obligation, port any route, or change any bound.',
    holds: () =>
      IMP35964_W1_PRECISION_ROBUSTNESS_CLUSTER_CROSSREF.honestCaveat.dischargesAnyObligation === false &&
      IMP35964_W1_PRECISION_ROBUSTNESS_CLUSTER_CROSSREF.honestCaveat.portsAnyRoute === false &&
      IMP35964_W1_PRECISION_ROBUSTNESS_CLUSTER_CROSSREF.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP35964_W1_PRECISION_ROBUSTNESS_CLUSTER_CROSSREF.honestCaveat.sota),
  },
  {
    id: 'imp35964-verdict-no-qed',
    why: 'The verdict must record NO QED and the no-refereed-bound-change floor, matching every source module.',
    holds: () =>
      /NO QED/.test(IMP35964_W1_PRECISION_ROBUSTNESS_CLUSTER_CROSSREF.verdict) &&
      /refereed bound is changed/i.test(IMP35964_W1_PRECISION_ROBUSTNESS_CLUSTER_CROSSREF.verdict),
  },
];

for (const assertion of IMP35964_W1_PRECISION_ROBUSTNESS_CLUSTER_CROSSREF_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35964-w1-precision-robustness-cluster-crossref assertion failed: ${assertion.id}`);
  }
}

export default IMP35964_W1_PRECISION_ROBUSTNESS_CLUSTER_CROSSREF;
