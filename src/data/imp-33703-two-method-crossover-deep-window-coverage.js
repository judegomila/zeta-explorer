/**
 * @module imp-33703-two-method-crossover-deep-window-coverage
 * @fileoverview imp-33703 -- EXTEND the imp-33667 two-method saturation-onset NODE-location
 *   cross-validation from its single shared rung n = 596 (agreement in the [150,200] node region)
 *   into the [400,1200] band-clearing window, and ASSESS whether the cross-method node-location
 *   agreement persists at depth. This module reads the node-location data BOTH methods publish
 *   across the window UNCHANGED, tabulates the per-rung coverage, and reports the honest finding:
 *   the two methods OVERLAP at exactly ONE rung in [400,1200] (n = 596), so the cross-method
 *   agreement CANNOT be tabulated at a second, deeper rung -- it is DATA-LIMITED.
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   THE TWO METHODS AND THEIR NODE-LOCATION COVERAGE ACROSS [400,1200]
 *   -----------------------------------------------------------------
 *   imp-33667 cross-validated two INDEPENDENT graded-GL saturation-onset NODE locations at the single
 *   shared rung n = 596: the dense grade-6 floor ARGMIN (imp-33641, ~180 nodes) vs the grade-4
 *   Q-vs-floor CROSSOVER (imp-33627, ~192.5 nodes), which agree to ~7% and both land in [150,200].
 *   Extending that per-rung cross-check into [400,1200] needs BOTH methods to publish a node-location
 *   at the SAME band-clearing rung. Reading what each method actually covers UNCHANGED:
 *
 *     - METHOD A -- DENSE GRADE-6 FLOOR ARGMIN (imp-33641). A dense integer-panel ladder P in [15,60]
 *       (150..600 nodes) scored at grade 6. It is measured at ONE rung only: n = 596 (globalFloorNodes
 *       ~180). There is NO dense grade-6 argmin scan at any other rung in [400,1200].
 *     - METHOD B -- GRADE-4 Q-VS-FLOOR CROSSOVER. The nodes_sat crossover is measured across SIX
 *       band-clearing rungs: imp-33627 at the mid-tail {495, 510, 596} (nodes_sat ~186, FLAT < 7%) and
 *       imp-33666 at the re-intensifying deep tail {962, 998, 1126} (nodes_sat ~227 at n=998, degraded
 *       elsewhere -- the flat ~186 wall does NOT survive into the deep tail).
 *
 *   THE COVERAGE CROSS-CHECK (self-computing at import; import-light, no zeros bundle)
 *   --------------------------------------------------------------------------------
 *   Tabulating the per-rung node-location availability across [400,1200]:
 *
 *        rung n   METHOD A (dense grade-6 argmin)   METHOD B (grade-4 crossover)   both?   node ratio
 *        495      --                                ~186.4  (imp-33627)            NO      --
 *        510      --                                ~180.7  (imp-33627)            NO      --
 *        596      ~180  (imp-33641)                 ~192.5  (imp-33627)            YES     ~1.069
 *        962      --                                ~2892   (imp-33666, dirty)     NO      --
 *        998      --                                ~227    (imp-33666, clean)     NO      --
 *        1126     --                                ~3243   (imp-33666, dirty)     NO      --
 *        --------------------------------------------------------------------------------------------
 *        shared rungs where BOTH methods publish a node-location:  {596}  =>  ONE rung only.
 *
 *   HEADLINE -- THE DEEP-WINDOW TWO-METHOD AGREEMENT IS DATA-LIMITED TO THE SINGLE SHARED RUNG n=596.
 *   Across the entire [400,1200] band-clearing window the two methods share node-location data at
 *   EXACTLY ONE rung, n = 596 -- precisely the rung imp-33667 already cross-validated. Method A (the
 *   dense grade-6 floor argmin) has NO coverage beyond n = 596, so there is NO second band-clearing
 *   rung at which the cross-method NODE-location agreement can be tabulated. The per-rung agreement
 *   therefore does NOT extend to depth: it cannot be measured there at all with the published data.
 *
 *   WHAT THE ONE FOLLOWABLE LEG DOES AT DEPTH. Only Method B (the crossover) reaches into the deep
 *   tail, and there it does NOT stay flat: imp-33666 shows nodes_sat shifts UP to ~227 at n = 998
 *   (~18% above the mid-tail max ~192.5) and degrades to unlocatable at n = 962 / n = 1126. So even
 *   the single leg that CAN be followed to depth MOVES -- had Method A been available there to compare,
 *   the ~7% agreement seen at n = 596 is NOT demonstrated to persist; it is unresolved, not confirmed.
 *
 *   VERDICT. DEEP-WINDOW-TWO-METHOD-NODE-AGREEMENT-DATA-LIMITED-TO-SINGLE-SHARED-RUNG-n=596. The
 *   dense grade-6 floor-argmin method (imp-33641) publishes a node-location at n = 596 ONLY, so across
 *   [400,1200] it shares a rung with the grade-4 crossover method at exactly ONE point (n = 596, the
 *   imp-33667 rung, agreement ~1.069). The cross-method agreement CANNOT be tabulated at depth -- there
 *   is no second shared rung. The one leg that does reach the deep tail (the crossover, imp-33666) does
 *   NOT stay flat, so the [150,200] agreement is neither extended nor confirmed at depth: it is
 *   DATA-LIMITED. SUB-GAP imp-33703-subgap-dense-grade6-argmin-deep-window-scan-missing: to genuinely
 *   extend the two-method node-location cross-check into [400,1200], a dense grade-6 floor-argmin scan
 *   must first be produced at additional band-clearing peaks (e.g. the imp-33666 tail rungs
 *   {962,998,1126}) and cross-tabulated against the crossover nodes_sat there.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN COVERAGE CROSS-CHECK ONLY, at the RH-equivalent scale class. It reads the
 *   node-location data the two methods publish across [400,1200] UNCHANGED and tabulates their per-rung
 *   overlap; it runs NO new saddle sweep, changes NO bound, patches NO literal, and establishes NO
 *   operator positivity. The per-panel/per-budget ULP is a JITTERY arithmetic-floor lattice property
 *   (imp-33249/imp-33277/imp-33296/imp-33537/imp-33605 latticeJitterCaveat); the robust reading is the
 *   node REGION, not the exact node. The NPHI = 10 Phi-series truncation is inherited upstream;
 *   single-platform libm. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level
 *   K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH
 *   verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-33667-crossover-cross-validation.js (the two-method n=596 cross-validation this extends)
 *   @see imp-33641-grade6-node-budget-non-monotonicity.js (Method A: dense grade-6 floor argmin, n=596 only)
 *   @see imp-33627-saturation-budget-crossover.js (Method B: grade-4 crossover, mid-tail {495,510,596})
 *   @see imp-33666-saturation-budget-crossover-tail.js (Method B extended to deep tail {962,998,1126})
 *
 *   Ticket: imp-33703 (numerical, medium).
 */

import { IMP33641_GRADE6_NODE_BUDGET_NON_MONOTONICITY } from './imp-33641-grade6-node-budget-non-monotonicity.js';
import { IMP33627_SATURATION_BUDGET_CROSSOVER } from './imp-33627-saturation-budget-crossover.js';
import { IMP33666_SATURATION_BUDGET_CROSSOVER_TAIL } from './imp-33666-saturation-budget-crossover-tail.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const WINDOW_LO = 400;           // the [400,1200] band-clearing window lower edge
const WINDOW_HI = 1200;          // the [400,1200] band-clearing window upper edge
const IMP33667_RUNG = 596;       // the single rung imp-33667 cross-validated
const NODE_RATIO_TOL = 1.10;     // onset-node agreement threshold: ratio < 1.10 (within ~10%), same as imp-33667

// -- METHOD A: read the dense grade-6 floor argmin node-location UNCHANGED (n=596 only) ------------
const A = IMP33641_GRADE6_NODE_BUDGET_NON_MONOTONICITY.measured;
const DENSE_RUNG = 596;                       // imp-33641 is measured at this rung only
const DENSE_FLOOR_NODES = A.globalFloorNodes; // ~180
// Method A publishes a node-location at exactly one rung in the window: {596}.
const METHOD_A_RUNGS = [DENSE_RUNG].filter((n) => n >= WINDOW_LO && n <= WINDOW_HI);

// -- METHOD B: read the grade-4 Q-vs-floor crossover node-locations UNCHANGED ----------------------
// mid-tail {495,510,596} (imp-33627) + re-intensifying deep tail {962,998,1126} (imp-33666).
const MIDTAIL_ROWS = IMP33627_SATURATION_BUDGET_CROSSOVER.measured.crossoverTable.map((r) => ({
  n: r.n,
  crossoverNodes: r.nodesSat,
  cleanlyLocatable: r.inBracket,
  source: 'imp-33627',
}));
const TAIL_ROWS = IMP33666_SATURATION_BUDGET_CROSSOVER_TAIL.measured.crossoverTable.map((r) => ({
  n: r.n,
  crossoverNodes: r.nodesSat,
  cleanlyLocatable: r.cleanlyLocatable,
  source: 'imp-33666',
}));
const METHOD_B_ROWS = MIDTAIL_ROWS.concat(TAIL_ROWS).filter((r) => r.n >= WINDOW_LO && r.n <= WINDOW_HI);
const METHOD_B_RUNGS = METHOD_B_ROWS.map((r) => r.n);

// -- The per-rung coverage table across [400,1200] ------------------------------------------------
const COVERAGE_TABLE = METHOD_B_ROWS.map((r) => {
  const denseHere = METHOD_A_RUNGS.includes(r.n) ? DENSE_FLOOR_NODES : null;
  const bothMethods = denseHere !== null && Number.isFinite(r.crossoverNodes);
  const nodeRatio = bothMethods
    ? Math.max(denseHere, r.crossoverNodes) / Math.min(denseHere, r.crossoverNodes)
    : null;
  return Object.freeze({
    n: r.n,
    denseNodes: denseHere,
    crossoverNodes: r.crossoverNodes,
    crossoverCleanlyLocatable: r.cleanlyLocatable,
    crossoverSource: r.source,
    bothMethods,
    nodeRatio,
    nodeLocationsAgree: bothMethods ? nodeRatio < NODE_RATIO_TOL : null,
  });
});

// -- The coverage cross-check ---------------------------------------------------------------------
const SHARED_RUNGS = COVERAGE_TABLE.filter((r) => r.bothMethods).map((r) => r.n);
const SHARED_RUNG_COUNT = SHARED_RUNGS.length;
const SHARED_ROW = COVERAGE_TABLE.find((r) => r.bothMethods) || null;
const SHARED_NODE_RATIO = SHARED_ROW ? SHARED_ROW.nodeRatio : null;
// The number of band-clearing rungs where the cross-method agreement can be tabulated at depth,
// i.e. shared rungs strictly deeper than the imp-33667 rung n=596.
const DEEPER_SHARED_RUNGS = SHARED_RUNGS.filter((n) => n > IMP33667_RUNG);
// The one leg we CAN follow to depth (the crossover) does NOT stay flat there (imp-33666 headline).
const CROSSOVER_STAYS_FLAT_AT_DEPTH =
  IMP33666_SATURATION_BUDGET_CROSSOVER_TAIL.measured.crossoverDoesNotStayFlat === false;

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) The window is the [400,1200] band-clearing window; both methods report rungs inside it.
const windowCovered =
  WINDOW_LO === 400 && WINDOW_HI === 1200 &&
  METHOD_A_RUNGS.every((n) => n >= WINDOW_LO && n <= WINDOW_HI) &&
  METHOD_B_RUNGS.every((n) => n >= WINDOW_LO && n <= WINDOW_HI);
// (2) Method A (dense grade-6 argmin) covers exactly ONE rung in the window (n=596), read UNCHANGED.
const methodASingleRung =
  METHOD_A_RUNGS.length === 1 && METHOD_A_RUNGS[0] === DENSE_RUNG && DENSE_FLOOR_NODES === 180;
// (3) Method B (grade-4 crossover) covers the six band-clearing rungs {495,510,596,962,998,1126}.
const methodBSixRungs =
  METHOD_B_RUNGS.length === 6 &&
  [495, 510, 596, 962, 998, 1126].every((n) => METHOD_B_RUNGS.includes(n));
// (4) THE HEADLINE: the two methods share node-location data at EXACTLY ONE rung, n=596.
const singleSharedRung = SHARED_RUNG_COUNT === 1 && SHARED_RUNGS[0] === IMP33667_RUNG;
// (5) At that single shared rung the two methods agree (~1.069) -- reproduces imp-33667.
const sharedRungAgrees = SHARED_ROW !== null && SHARED_ROW.nodeLocationsAgree === true;
// (6) There is NO deeper shared rung, so the agreement CANNOT be tabulated at depth: DATA-LIMITED.
const deepWindowAgreementDataLimited = DEEPER_SHARED_RUNGS.length === 0;
// (7) HONEST NUANCE: the one leg that DOES reach the deep tail (crossover) does NOT stay flat there.
const crossoverLegMovesAtDepth = CROSSOVER_STAYS_FLAT_AT_DEPTH === false;

const verdict =
  windowCovered && methodASingleRung && methodBSixRungs && singleSharedRung && sharedRungAgrees &&
  deepWindowAgreementDataLimited && crossoverLegMovesAtDepth
    ? 'DEEP-WINDOW-TWO-METHOD-NODE-AGREEMENT-DATA-LIMITED-TO-SINGLE-SHARED-RUNG-n=596:-EXTENDING-THE-imp-33667-' +
      'TWO-METHOD-SATURATION-ONSET-NODE-LOCATION-CROSS-CHECK-INTO-THE-[400,1200]-BAND-CLEARING-WINDOW-FINDS-THE-' +
      'DENSE-GRADE-6-FLOOR-ARGMIN-(imp-33641,-METHOD-A)-PUBLISHES-A-NODE-LOCATION-AT-n=596-ONLY-(~180-NODES),-' +
      'WHILE-THE-GRADE-4-Q-VS-FLOOR-CROSSOVER-(METHOD-B)-COVERS-SIX-RUNGS-{495,510,596,962,998,1126}-(imp-33627+' +
      'imp-33666).-THE-TWO-METHODS-SHARE-NODE-LOCATION-DATA-AT-EXACTLY-ONE-RUNG-n=596-(THE-imp-33667-RUNG,-' +
      'RATIO-~1.069)-AND-AT-NO-OTHER-BAND-CLEARING-RUNG,-SO-THE-CROSS-METHOD-AGREEMENT-CANNOT-BE-TABULATED-AT-' +
      'DEPTH-IT-IS-DATA-LIMITED.-THE-ONE-LEG-THAT-DOES-REACH-THE-DEEP-TAIL-(THE-CROSSOVER,-imp-33666)-DOES-NOT-' +
      'STAY-FLAT-(nodes_sat-SHIFTS-UP-~227-AT-n=998,-DEGRADES-AT-n=962/1126),-SO-THE-[150,200]-AGREEMENT-IS-' +
      'NEITHER-EXTENDED-NOR-CONFIRMED-AT-DEPTH.-SUB-GAP:-imp-33703-subgap-dense-grade6-argmin-deep-window-scan-' +
      'MISSING-(A-DENSE-GRADE-6-FLOOR-ARGMIN-SCAN-AT-ADDITIONAL-BAND-CLEARING-PEAKS-IS-NEEDED-TO-ACTUALLY-EXTEND-' +
      'THE-TWO-METHOD-NODE-CROSS-CHECK).-ACCURACY/RULE-DESIGN-COVERAGE-CROSS-CHECK-ONLY;-JITTERY-LATTICE-FLOOR;-' +
      'ROBUST-READING-IS-THE-REGION-NOT-THE-EXACT-NODE;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-' +
      'UNTOUCHED;-NO-QED;-PT-Lambda<=0.2-STAYS-SOTA'
    : 'INDETERMINATE';

export const IMP33703_TWO_METHOD_CROSSOVER_DEEP_WINDOW_COVERAGE = Object.freeze({
  id: 'imp-33703-two-method-crossover-deep-window-coverage',
  ticket: 'imp-33703',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33667-crossover-cross-validation.js',
  readsModules: [
    'imp-33641-grade6-node-budget-non-monotonicity.js',
    'imp-33627-saturation-budget-crossover.js',
    'imp-33666-saturation-budget-crossover-tail.js',
  ],

  summary:
    'EXTENDS the imp-33667 two-method saturation-onset NODE-location cross-validation from its single shared ' +
    'rung n=596 into the [400,1200] band-clearing window. Reading the node-location data both methods publish ' +
    'UNCHANGED: the dense grade-6 floor ARGMIN (imp-33641, Method A) is measured at n=596 ONLY (~180 nodes), ' +
    'while the grade-4 Q-vs-floor CROSSOVER (Method B) covers SIX band-clearing rungs {495,510,596,962,998,' +
    '1126} (imp-33627 mid-tail + imp-33666 deep tail). The two methods share node-location data at EXACTLY ONE ' +
    'rung, n=596 (the imp-33667 rung, ratio ~1.069), and at NO other band-clearing rung -- so the cross-method ' +
    'agreement CANNOT be tabulated at depth: it is DATA-LIMITED. The one leg that DOES reach the deep tail (the ' +
    'crossover, imp-33666) does NOT stay flat (nodes_sat ~227 at n=998, degraded at n=962/1126), so the ' +
    '[150,200] agreement is neither extended nor confirmed at depth. VERDICT: ' +
    'DEEP-WINDOW-TWO-METHOD-NODE-AGREEMENT-DATA-LIMITED-TO-SINGLE-SHARED-RUNG-n=596. SUB-GAP ' +
    'imp-33703-subgap-dense-grade6-argmin-deep-window-scan-missing: a dense grade-6 floor-argmin scan at more ' +
    'band-clearing peaks is needed to genuinely extend the two-method cross-check. ACCURACY/RULE-DESIGN ' +
    'COVERAGE CROSS-CHECK ONLY, RH-EQUIVALENT, necessary-but-not-sufficient; jittery lattice floor; robust ' +
    'reading is the region not the exact node; operator positivity (imp-3066) untouched; no QED. PT Lambda ' +
    '&lt;= 0.2 stays SOTA.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    window: 'the [400,1200] band-clearing window; each method reports which band-clearing rungs it covers',
    methodA: 'dense grade-6 floor ARGMIN -- imp-33641.measured.globalFloorNodes, measured at n=596 only (~180 nodes)',
    methodB: 'grade-4 Q-vs-floor CROSSOVER nodes_sat -- imp-33627 crossoverTable {495,510,596} + imp-33666 crossoverTable {962,998,1126}',
    overlapCheck: 'the per-rung coverage table records where BOTH methods publish a node-location; shared-rung count and node ratio computed there',
    depthCheck: 'whether any shared rung sits deeper than the imp-33667 rung n=596 (=> tabulable at depth) or not (=> data-limited)',
    legCheck: 'whether the single leg reaching the deep tail (the crossover) stays flat there, read from imp-33666.crossoverDoesNotStayFlat UNCHANGED',
    selfComputing: 'every coverage flag, shared-rung set, node ratio and verdict flag recompute at import from the three imported measurements',
  }),

  measured: Object.freeze({
    windowLo: WINDOW_LO,
    windowHi: WINDOW_HI,
    imp33667Rung: IMP33667_RUNG,
    methodARungs: Object.freeze(METHOD_A_RUNGS.slice()),
    methodBRungs: Object.freeze(METHOD_B_RUNGS.slice()),
    denseFloorNodes: DENSE_FLOOR_NODES,
    coverageTable: Object.freeze(COVERAGE_TABLE),
    sharedRungs: Object.freeze(SHARED_RUNGS.slice()),
    sharedRungCount: SHARED_RUNG_COUNT,
    sharedNodeRatio: SHARED_NODE_RATIO,
    deeperSharedRungs: Object.freeze(DEEPER_SHARED_RUNGS.slice()),
    crossoverStaysFlatAtDepth: CROSSOVER_STAYS_FLAT_AT_DEPTH,
    windowCovered,
    methodASingleRung,
    methodBSixRungs,
    singleSharedRung,
    sharedRungAgrees,
    deepWindowAgreementDataLimited,
    crossoverLegMovesAtDepth,
    subGap: 'imp-33703-subgap-dense-grade6-argmin-deep-window-scan-missing',
    verdict,
  }),

  interpretation: Object.freeze({
    dataLimitedToOneRung:
      'Across the entire [400,1200] band-clearing window the dense grade-6 floor-argmin method (imp-33641) ' +
      'and the grade-4 crossover method share node-location data at EXACTLY ONE rung, n=596 -- precisely the ' +
      'rung imp-33667 already cross-validated. There is no second band-clearing rung at which the cross-method ' +
      'node-location agreement can be tabulated, so it CANNOT be extended to depth with the published data.',
    denseMethodHasNoDepth:
      'Method A (the dense grade-6 floor argmin) publishes a node-location at n=596 ONLY. No dense grade-6 ' +
      'argmin scan exists at any other rung in [400,1200], so the argmin leg of the pair is simply unavailable ' +
      'at depth -- the binding constraint on extending the imp-33667 cross-check.',
    crossoverLegMovesAtDepth:
      'The one leg that DOES reach the deep tail (the crossover) does NOT stay flat: imp-33666 measures ' +
      'nodes_sat ~227 at n=998 (~18% above the mid-tail max ~192.5) and unlocatable at n=962 / n=1126. So even ' +
      'the followable leg MOVES with depth; had Method A been available to compare there, the ~7% agreement at ' +
      'n=596 is NOT demonstrated to persist -- it is unresolved, not confirmed.',
    subGap:
      'imp-33703-subgap-dense-grade6-argmin-deep-window-scan-missing: to genuinely extend the two-method ' +
      'node-location cross-check into [400,1200], a dense grade-6 floor-argmin scan must first be produced at ' +
      'additional band-clearing peaks (e.g. the imp-33666 tail rungs {962,998,1126}) and cross-tabulated ' +
      'against the crossover nodes_sat there.',
    latticeJitterCaveat:
      'The per-panel/per-budget ULP is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/' +
      'imp-33296/imp-33537/imp-33605): the exact onset node can shift under cross-platform libm exp/pow ' +
      'variation. The robust reading is the node REGION, NOT the exact node.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Reads the node-location data the dense grade-6 floor-argmin (imp-33641) and the grade-4 Q-vs-floor ' +
      'crossover (imp-33627/imp-33666) methods publish across [400,1200] UNCHANGED and tabulates their per-rung ' +
      'overlap. It runs NO new saddle sweep, changes NO bound, patches NO literal, and establishes NO operator ' +
      'positivity. A coverage cross-check of published quadrature diagnostics -- not a bound.',
    dataLimitedNotAgreementFail:
      'The finding is a DATA-LIMITATION, not a measured disagreement: the two methods simply do not share a ' +
      'second band-clearing rung with node-location data, so the deep-window agreement is untabulable, not ' +
      'refuted. The named sub-gap records exactly what data is missing to close it.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33641/imp-33627/imp-33666/imp-33557/imp-33213; ' +
      'this cross-checks node-location coverage, not that truncation.',
    latticeJitterCaveat:
      'The per-panel/per-budget ULP is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/' +
      'imp-33296/imp-33537/imp-33605): cross-platform libm exp/pow variation can shift the exact onset node, ' +
      'so the robust reading is the node REGION, NOT the exact node.',
    singlePlatform: 'Single-platform libm exp/pow; the few-ULP floor values are platform-sensitive.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33703_TWO_METHOD_CROSSOVER_DEEP_WINDOW_COVERAGE_ASSERTIONS = [
  {
    id: 'imp33703-window-is-400-1200',
    why: 'The extension window must be the [400,1200] band-clearing window, and every rung each method reports ' +
         'must lie inside it.',
    holds: () => windowCovered && WINDOW_LO === 400 && WINDOW_HI === 1200,
  },
  {
    id: 'imp33703-method-a-single-rung',
    why: 'Method A (dense grade-6 floor argmin, imp-33641) publishes a node-location at exactly ONE rung in the ' +
         'window (n=596, ~180 nodes), read UNCHANGED -- the binding data limitation.',
    holds: () => methodASingleRung && METHOD_A_RUNGS.length === 1 && METHOD_A_RUNGS[0] === 596 &&
      DENSE_FLOOR_NODES === 180,
  },
  {
    id: 'imp33703-method-b-six-rungs',
    why: 'Method B (grade-4 Q-vs-floor crossover) covers the six band-clearing rungs {495,510,596,962,998,1126} ' +
         'across imp-33627 (mid-tail) and imp-33666 (deep tail).',
    holds: () => methodBSixRungs && METHOD_B_RUNGS.length === 6 &&
      [495, 510, 596, 962, 998, 1126].every((n) => METHOD_B_RUNGS.includes(n)),
  },
  {
    id: 'imp33703-single-shared-rung-n596',
    why: 'THE HEADLINE: the two methods share node-location data at EXACTLY ONE rung, n=596 (the imp-33667 rung), ' +
         'and at no other band-clearing rung.',
    holds: () => singleSharedRung && SHARED_RUNG_COUNT === 1 && SHARED_RUNGS[0] === IMP33667_RUNG,
  },
  {
    id: 'imp33703-shared-rung-agrees',
    why: 'At the single shared rung n=596 the two methods AGREE (ratio < 1.10, ~1.069) -- reproducing imp-33667.',
    holds: () => sharedRungAgrees && SHARED_NODE_RATIO !== null && SHARED_NODE_RATIO < NODE_RATIO_TOL &&
      SHARED_NODE_RATIO < 1.08,
  },
  {
    id: 'imp33703-agreement-data-limited-at-depth',
    why: 'There is NO shared rung deeper than n=596, so the cross-method node-location agreement CANNOT be ' +
         'tabulated at depth: it is DATA-LIMITED, not refuted.',
    holds: () => deepWindowAgreementDataLimited && DEEPER_SHARED_RUNGS.length === 0,
  },
  {
    id: 'imp33703-crossover-leg-moves-at-depth',
    why: 'Mandatory honesty: the one leg that DOES reach the deep tail (the crossover, imp-33666) does NOT stay ' +
         'flat there, so the [150,200] agreement is not demonstrated to persist.',
    holds: () => crossoverLegMovesAtDepth && CROSSOVER_STAYS_FLAT_AT_DEPTH === false,
  },
  {
    id: 'imp33703-verdict-records-data-limited',
    why: 'The classified verdict must record the DEEP-WINDOW-TWO-METHOD-NODE-AGREEMENT-DATA-LIMITED reading, not ' +
         'indeterminate.',
    holds: () => verdict !== 'INDETERMINATE' && /DATA-LIMITED/.test(verdict),
  },
  {
    id: 'imp33703-honest-coverage-check-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design coverage cross-check only, a data-limitation not a bound, ' +
         'mass-feasibility necessary-but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP33703_TWO_METHOD_CROSSOVER_DEEP_WINDOW_COVERAGE.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33703_TWO_METHOD_CROSSOVER_DEEP_WINDOW_COVERAGE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33703-two-method-crossover-deep-window-coverage assertion failed: ${assertion.id}`);
  }
}
