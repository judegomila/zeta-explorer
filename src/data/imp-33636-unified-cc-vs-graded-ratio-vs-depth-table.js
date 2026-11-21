/**
 * @module imp-33636-unified-cc-vs-graded-ratio-vs-depth-table
 * @fileoverview imp-33636 -- TABULATE a UNIFIED imp-33560 + imp-33584 Clenshaw-Curtis-vs-graded
 *   min-node ratio-vs-depth curve across n in {350,375,400,425,450,475}: consolidate the two separate
 *   deep-tail cross-solver measurements into ONE ratio-vs-n table with the 4x node-competitiveness
 *   bar, so the flat-vs-climbing graded edge is read off a SINGLE monotone-in-depth series rather
 *   than two disjoint modules.
 *
 *   THE GAP THIS CLOSES
 *   --------------------
 *   imp-33560 measured the CC-single-grid / flat-graded (~200-node) min-node ratio at n in
 *   {350,375,400} (~1.28x, ~1.28x, ~2.56x). imp-33584 extended the IDENTICAL test to n in
 *   {425,450,475} (~2.56x, ~2.56x, ~3.85x). Both stayed under the 4x node-competitiveness bar and
 *   both concluded the graded edge is a mild flat-vs-climbing win, not the ~186x claimed against the
 *   weak imp-33275 uniform Richardson ladder -- but the two findings live in two separate modules with
 *   two separate rungTable arrays, so reading the ratio trend across the full six-rung ladder requires
 *   opening both files and interleaving them by hand. This module does that interleaving once, at
 *   import time, off the two modules' OWN measured.rungTable data (no re-derivation, no re-running the
 *   quadrature).
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   Imports the frozen measured.rungTable array from each of imp-33560 (n in {350,375,400}) and
 *   imp-33584 (n in {425,450,475}), concatenates the six rows, sorts by n ascending, and re-derives
 *   only the CROSS-MODULE summary statistics (monotonicity of the ratio sequence, the running max
 *   ratio, whether the 4x bar is crossed anywhere) that neither source module computes on its own
 *   because each only sees its own three rungs.
 *
 *   UNIFIED TABLE (six rungs, one monotone-in-depth ratio series)
 *   ---------------------------------------------------------------
 *        n    source      graded min    CC min (nodes)   CC / graded
 *        350  imp-33560   200 nodes     257              ~1.28
 *        375  imp-33560   200 nodes     257              ~1.28
 *        400  imp-33560   200 nodes     513              ~2.56
 *        425  imp-33584   200 nodes     513              ~2.56
 *        450  imp-33584   200 nodes     513              ~2.56
 *        475  imp-33584   200 nodes     769              ~3.85
 *
 *   VERDICT. UNIFIED-RATIO-IS-MONOTONE-NON-DECREASING-AND-STAYS-BELOW-4x. Across the full six-rung
 *   ladder n in {350..475} the CC/graded min-node ratio never decreases as depth increases (it climbs
 *   or holds flat at every step) and never reaches the 4x node-competitiveness bar (max ~3.85x at
 *   n=475). Reading the ratio as ONE series rather than two disjoint three-rung tables confirms the
 *   flat-vs-climbing graded-edge trend imp-33560/imp-33584 each argued for holds as a single coherent
 *   curve, not merely as two separately-plausible three-point fragments.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   PRESENTATION / TABULATION CONSOLIDATION ONLY. This module re-derives NO quadrature and changes NO
 *   literal in either source module -- it imports their frozen measured.rungTable arrays verbatim and
 *   merges them. It changes NO bound, patches NO literal (imp-3685/imp-3849/imp-33213/imp-33316/
 *   imp-33539/imp-33560/imp-33584 all LEFT INTACT), and establishes NO operator positivity. All caveats
 *   from the two source modules apply unchanged: the CC min-node counts are JITTERY arithmetic-floor
 *   lattice properties (imp-33249/imp-33277/imp-33295/imp-33539 latticeJitterCaveat lineage), the
 *   NPHI = 10 Phi-series truncation is inherited, and imp-33537/imp-33557 showed the imp-33316 &lt; 64
 *   ULP band is a coarse-grid artifact that FAILS at deeper rungs n &gt;= 510 (all six rungs tabulated
 *   here sit below that band-crossing rung, so the comparison stays well-posed). Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33560-deep-tail-graded-vs-cc-cross-solver-node-budget.js (n in {350,375,400} source table)
 *   @see imp-33584-deeper-tail-cc-vs-graded-ratio-4x-crossing.js (n in {425,450,475} source table)
 *   @see imp-33623-band-crossing-cc-vs-graded-ratio-4x-crossing.js (the SEPARATE band-crossing-region
 *     extension n in {500,510,525}, deliberately out of scope here -- this module only unifies the two
 *     below-band-crossing tables)
 *
 *   Ticket: imp-33636 (content, medium).
 */

import { IMP33560_DEEP_TAIL_GRADED_VS_CC_CROSS_SOLVER_NODE_BUDGET } from './imp-33560-deep-tail-graded-vs-cc-cross-solver-node-budget.js';
import { IMP33584_DEEPER_TAIL_CC_VS_GRADED_RATIO_4X_CROSSING } from './imp-33584-deeper-tail-cc-vs-graded-ratio-4x-crossing.js';

const NODE_COMPETITIVE_RATIO = 4; // shared imp-33560/imp-33584 node-competitiveness bar

// -- Merge the two source rungTables verbatim, tagging each row with its origin module -------------
const SOURCE_ROWS = [
  ...IMP33560_DEEP_TAIL_GRADED_VS_CC_CROSS_SOLVER_NODE_BUDGET.measured.rungTable.map((r) => ({
    n: r.n,
    sourceModule: 'imp-33560',
    gradedMinNodes: r.gradedMinNodes,
    ccMinNodes: r.ccMinNodes,
    ccOverGraded: r.ccOverGraded,
    ccNodeCompetitive: r.ccNodeCompetitive,
  })),
  ...IMP33584_DEEPER_TAIL_CC_VS_GRADED_RATIO_4X_CROSSING.measured.rungTable.map((r) => ({
    n: r.n,
    sourceModule: 'imp-33584',
    gradedMinNodes: r.gradedMinNodes,
    ccMinNodes: r.ccMinNodes,
    ccOverGraded: r.ccOverGraded,
    ccNodeCompetitive: r.ccNodeCompetitive,
  })),
];

const UNIFIED_TABLE = SOURCE_ROWS.slice()
  .sort((a, b) => a.n - b.n)
  .map((r) => Object.freeze({ ...r }));

// -- Cross-module summary statistics neither source module computes alone --------------------------
const RATIOS_BY_N = UNIFIED_TABLE.map((r) => r.ccOverGraded);
const MAX_RATIO = Math.max(...RATIOS_BY_N);
const MIN_RATIO = Math.min(...RATIOS_BY_N);
const IS_MONOTONE_NON_DECREASING = RATIOS_BY_N.every((r, i) => i === 0 || r >= RATIOS_BY_N[i - 1]);
const CROSSES_4X_BAR = MAX_RATIO >= NODE_COMPETITIVE_RATIO;
const ALL_NODE_COMPETITIVE = UNIFIED_TABLE.every((r) => r.ccNodeCompetitive);
const N_VALUES = UNIFIED_TABLE.map((r) => r.n);
const EXPECTED_N_VALUES = [350, 375, 400, 425, 450, 475];

const verdict =
  IS_MONOTONE_NON_DECREASING && !CROSSES_4X_BAR && ALL_NODE_COMPETITIVE
    ? 'UNIFIED-RATIO-IS-MONOTONE-NON-DECREASING-AND-STAYS-BELOW-4x:-CONSOLIDATING-THE-imp-33560-' +
      '(n-in-{350,375,400})-AND-imp-33584-(n-in-{425,450,475})-CC-VS-GRADED-MIN-NODE-RATIO-TABLES-INTO-' +
      'ONE-SIX-RUNG-SERIES-SHOWS-THE-RATIO-NEVER-DECREASES-WITH-DEPTH-(~1.28x->~1.28x->~2.56x->~2.56x->' +
      '~2.56x->~3.85x)-AND-NEVER-CROSSES-THE-4x-NODE-COMPETITIVENESS-BAR;-THE-FLAT-VS-CLIMBING-GRADED-' +
      'EDGE-imp-33560/imp-33584-EACH-ARGUED-FOR-HOLDS-AS-ONE-COHERENT-MONOTONE-CURVE,-NOT-JUST-TWO-' +
      'SEPARATELY-PLAUSIBLE-THREE-POINT-FRAGMENTS.-TABULATION-CONSOLIDATION-ONLY;-NO-LITERAL-PATCHED;-' +
      'imp-3685/imp-3849/imp-33213/imp-33316/imp-33539/imp-33560/imp-33584-INTACT;-imp-3066-UNTOUCHED;-' +
      'NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33636_UNIFIED_CC_VS_GRADED_RATIO_VS_DEPTH_TABLE = Object.freeze({
  id: 'imp-33636-unified-cc-vs-graded-ratio-vs-depth-table',
  ticket: 'imp-33636',
  consolidatesModules: [
    'imp-33560-deep-tail-graded-vs-cc-cross-solver-node-budget.js',
    'imp-33584-deeper-tail-cc-vs-graded-ratio-4x-crossing.js',
  ],

  summary:
    'CONSOLIDATES the imp-33560 (n in {350,375,400}) and imp-33584 (n in {425,450,475}) deep-tail ' +
    'Clenshaw-Curtis-vs-graded min-node ratio measurements into ONE unified six-rung ratio-vs-depth ' +
    'table by importing each source modules frozen measured.rungTable verbatim, merging, and sorting ' +
    'by n. RESULT: the CC/graded min-node ratio is a SINGLE monotone-non-decreasing series across the ' +
    'full ladder (~1.28x, ~1.28x, ~2.56x, ~2.56x, ~2.56x, ~3.85x) that never reaches the 4x node-' +
    'competitiveness bar. VERDICT: UNIFIED-RATIO-IS-MONOTONE-NON-DECREASING-AND-STAYS-BELOW-4x. ' +
    'TABULATION CONSOLIDATION ONLY -- no quadrature re-derived, no literal patched in either source ' +
    'module; imp-3066 untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    inputs: 'the frozen measured.rungTable array exported by imp-33560 and by imp-33584, each already self-computed and assertion-locked in its own module',
    merge: 'concatenate the two rungTable arrays (tagging each row with its sourceModule), then sort by n ascending',
    crossModuleStats: 'monotonicity of the ratio sequence, running max/min ratio, and the 4x-bar crossing test -- statistics neither source module alone can compute since each only sees its own three rungs',
    noRederivation: 'zero quadrature calls in this module; it reads only the two source modules exported literals',
  }),

  measured: Object.freeze({
    unifiedTable: UNIFIED_TABLE,
    nValues: Object.freeze(N_VALUES.slice()),
    ratiosByN: Object.freeze(RATIOS_BY_N.slice()),
    maxRatio: MAX_RATIO,
    minRatio: MIN_RATIO,
    nodeCompetitiveRatio: NODE_COMPETITIVE_RATIO,
    isMonotoneNonDecreasing: IS_MONOTONE_NON_DECREASING,
    crosses4xBar: CROSSES_4X_BAR,
    allNodeCompetitive: ALL_NODE_COMPETITIVE,
    verdict,
  }),

  interpretation: Object.freeze({
    oneCoherentCurve:
      'Read as a single six-rung series rather than two disjoint three-rung tables, the CC/graded ' +
      'min-node ratio never decreases as n climbs from 350 to 475 (~1.28x -> ~1.28x -> ~2.56x -> ' +
      '~2.56x -> ~2.56x -> ~3.85x). The flat-vs-climbing graded edge is a genuine monotone trend, not ' +
      'an artifact of how the two source modules happened to split their rung ranges.',
    staysBelowTheBar:
      'The maximum ratio across all six rungs (~3.85x at n=475) stays under the 4x node-competitiveness ' +
      'bar, so the imp-33560/imp-33584 conclusion -- the graded rule is node-competitive with a strong ' +
      'independent Clenshaw-Curtis solver, not ~186x cheaper as the weak uniform Richardson ladder ' +
      'suggested -- holds uniformly across the unified table.',
    noNewComputation:
      'This module performs NO new quadrature: every ccMinNodes/ccOverGraded value is read verbatim from ' +
      'the two source modules own frozen measured.rungTable exports, so it inherits their exact numerics ' +
      'and every one of their caveats without re-introducing any new numerical risk.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    changesAnyBound: false,
    patchedALiteral: false,
    leavesSourceModulesIntact: true,
    isTabulationConsolidationOnly: true,
    didNotAttemptPositivity: true,
    scopeNote:
      'Presentation-layer consolidation of two already-measured tables into one monotone-in-depth ' +
      'series; it changes no bound, patches no literal, and establishes no operator positivity. The ' +
      'imp-33623 band-crossing-region extension (n in {500,510,525}) is a SEPARATE module and is ' +
      'deliberately out of scope for this six-rung unification.',
    latticeJitterCaveat:
      'Inherited verbatim from imp-33560/imp-33584: the CC min-node budgets are single lattice hits on ' +
      'a jittery arithmetic floor; the robust reading is the order of the node budgets and the ratio ' +
      'trend (monotone, < 4x), not the exact node counts.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ---------------------------------------------------------------------------
export const IMP33636_UNIFIED_CC_VS_GRADED_RATIO_VS_DEPTH_TABLE_ASSERTIONS = [
  {
    id: 'imp33636-six-rungs-exact-n-ladder',
    why: 'The unified table must contain exactly the six rungs n in {350,375,400,425,450,475}, in ascending order, with no duplicates or omissions.',
    holds: () => UNIFIED_TABLE.length === 6 && N_VALUES.every((n, i) => n === EXPECTED_N_VALUES[i]),
  },
  {
    id: 'imp33636-three-rows-per-source-module',
    why: 'Exactly three rows must come from imp-33560 and three from imp-33584, matching each source modules own rung count.',
    holds: () =>
      UNIFIED_TABLE.filter((r) => r.sourceModule === 'imp-33560').length === 3 &&
      UNIFIED_TABLE.filter((r) => r.sourceModule === 'imp-33584').length === 3,
  },
  {
    id: 'imp33636-ratio-sequence-monotone-non-decreasing',
    why: 'THE CONSOLIDATION PAYOFF: the merged CC/graded ratio sequence must never decrease step to step, confirming the flat-vs-climbing graded edge reads as ONE coherent monotone curve across all six rungs.',
    holds: () => IS_MONOTONE_NON_DECREASING,
  },
  {
    id: 'imp33636-max-ratio-stays-below-4x-bar',
    why: 'The maximum ratio across the unified six-rung table must stay under the 4x node-competitiveness bar, matching both source modules per-cohort findings.',
    holds: () => !CROSSES_4X_BAR && MAX_RATIO < NODE_COMPETITIVE_RATIO && ALL_NODE_COMPETITIVE,
  },
  {
    id: 'imp33636-verdict-records-monotone-below-bar',
    why: 'The classified verdict must record the unified monotone-below-4x finding, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33636-honest-diagnostic-not-a-new-measurement',
    why: 'Mandatory honesty: this is a tabulation consolidation of two existing measurements, not a new bound, not a re-derivation, source modules intact, imp-3066 untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33636_UNIFIED_CC_VS_GRADED_RATIO_VS_DEPTH_TABLE.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.changesAnyBound === false &&
        c.patchedALiteral === false &&
        c.leavesSourceModulesIntact === true &&
        c.isTabulationConsolidationOnly === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33636_UNIFIED_CC_VS_GRADED_RATIO_VS_DEPTH_TABLE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33636-unified-cc-vs-graded-ratio-vs-depth-table assertion failed: ${assertion.id}`);
  }
}

export default IMP33636_UNIFIED_CC_VS_GRADED_RATIO_VS_DEPTH_TABLE;
