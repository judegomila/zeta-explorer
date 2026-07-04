/**
 * @module imp-33667-crossover-cross-validation
 * @fileoverview imp-33667 -- CROSS-VALIDATE the two INDEPENDENT graded-GL saturation-onset node
 *   locations that imp-33641 and imp-33627 each measure at the shared rung n = 596 but NEITHER
 *   cross-references. imp-33641 (dense integer-panel scan, grade 6) locates the true dense floor at
 *   ~180 nodes; imp-33627 (Q-vs-floor branch-crossover fit, grade 4) locates nodes_sat ~192.5 inside
 *   the [150,200] bracket. This module reads both published measurements UNCHANGED and tabulates the
 *   agreement / discrepancy with honest error bars -- the cross-check that neither module ran.
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   THE TWO INDEPENDENT ONSET MEASUREMENTS (shared rung n = 596)
 *   -----------------------------------------------------------
 *   imp-33641 and imp-33627 both pin a graded-GL node budget at n = 596 by DIFFERENT methods:
 *
 *     - imp-33641 -- the DENSE-PANEL FLOOR ARGMIN. Scoring the direct graded-GL A_direct(tau*) plateau
 *       (grade 6, GL-10 per panel) on EVERY integer panel P in [15,60] = 150..600 nodes vs the imp-33213
 *       log-domain A_log target, the true dense floor is ~6.1 ULP at 180 nodes -- the node where the
 *       residual bottoms out (regime-(ii) floor is REACHED).
 *     - imp-33627 -- the Q-vs-floor BRANCH CROSSOVER. Reading the imp-33557 grade-4 node-budget ladder
 *       (nodes 100..4000), it fits the decreasing quadrature branch Q(nodes) by log-log OLS over the
 *       pre-saturation budgets and locates nodes_sat where Q(nodes_sat) = floor(n): ~192.5 nodes,
 *       inside the [150,200] crossover bracket, floor ~65.3 ULP.
 *
 *   Both use the SAME saddle tau* = root of n = 4 pi tau* e^{4 tau*} at n = 596; this module confirms the
 *   two modules share the rung and the saddle EXACTLY (tau* agree to < 1e-12), so the two onset node
 *   locations are independent in METHOD (dense grade-6 argmin vs coarse grade-4 branch crossover), not in
 *   the rung or the saddle.
 *
 *   THE CROSS-CHECK (self-computing at import; import-light, no zeros bundle)
 *   -----------------------------------------------------------------------
 *   Reading imp-33641.measured.globalFloorNodes/globalFloorUlp and the imp-33627 n=596 crossover row
 *   UNCHANGED:
 *
 *        method                       onset nodes   floor ULP   grade   in [150,200]
 *        imp-33641 dense-floor argmin  ~180          ~6.1        6       YES
 *        imp-33627 Q-vs-floor crossover ~192.5       ~65.3       4       YES
 *        ------------------------------------------------------------------------------
 *        node-location ratio  192.5/180 ~ 1.069  (~7% apart)   |   both inside [150,200]
 *        floor-height  ratio  65.3/6.1  ~ 10.7   (>10x apart)  |   grade 6 vs grade 4
 *
 *   HEADLINE. The two INDEPENDENT onset NODE locations AGREE: ~180 (dense grade-6 floor argmin) vs
 *   ~192.5 (grade-4 Q-vs-floor crossover) differ by only ~12.5 nodes (ratio ~1.069, under 7%), and BOTH
 *   land inside the shared [150,200] region. So the graded-GL saturation onset at n = 596 is ~180..193
 *   nodes ROBUSTLY across two methods that never cross-referenced each other -- a genuine cross-method
 *   corroboration of the [150,200] onset region.
 *
 *   HONEST NUANCE (mandatory). The agreement is a NODE-LOCATION agreement, NOT a floor-height agreement,
 *   and the two quantities are conceptually DISTINCT:
 *     (a) imp-33641 measures the ARGMIN of the dense residual (the node where the floor is deepest);
 *         imp-33627 measures the CROSSOVER (where the descending branch meets the flat floor). These are
 *         related "onset" notions but not identical, so exact numerical coincidence is NOT expected --
 *         the ~7% spread is consistent with that conceptual gap, not a defect.
 *     (b) They run at DIFFERENT grades (6 vs 4), so their floor HEIGHTS differ by ~10.7x (~6.1 vs ~65.3
 *         ULP). The floor VALUES do NOT agree and should not: grade 6 resolves the sharpening saddle
 *         deeper than grade 4. Only the onset NODE agrees; the cross-check corroborates WHERE saturation
 *         sets in, not HOW LOW the floor sits.
 *     (c) Both are jittery few-ULP arithmetic-floor lattice properties, so the robust reading is the
 *         shared [150,200] REGION, NOT the exact ~180 / ~192.5 nodes.
 *
 *   VERDICT. TWO-METHOD-ONSET-NODE-AGREES-IN-[150,200]-FLOOR-HEIGHT-DOES-NOT. The imp-33641 dense-panel
 *   grade-6 floor argmin (~180 nodes) and the imp-33627 grade-4 Q-vs-floor crossover (~192.5 nodes) agree
 *   to within ~7% and both sit inside the [150,200] region, robustly corroborating a ~180..193-node
 *   graded-GL saturation onset at n = 596 across two independent methods; the floor HEIGHTS (~6 vs ~65
 *   ULP) differ ~10.7x by construction (grade 6 vs grade 4) and are NOT expected to match.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN CROSS-CHECK ONLY, at the RH-equivalent scale class. It reads two published
 *   node-budget measurements UNCHANGED and tabulates their agreement at the shared rung n = 596; it runs
 *   NO new saddle sweep, changes NO bound, patches NO literal, and establishes NO operator positivity.
 *   The per-panel/per-budget ULP is a JITTERY arithmetic-floor lattice property (imp-33249/imp-33277/
 *   imp-33296/imp-33537/imp-33605 latticeJitterCaveat): the exact onset node can shift under cross-platform
 *   libm exp/pow variation, so the robust reading is the shared [150,200] REGION, NOT the exact nodes. The
 *   NPHI = 10 Phi-series truncation is inherited upstream; single-platform libm. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2
 *   remains the rigorous SOTA.
 *
 *   @see imp-33641-grade6-node-budget-non-monotonicity.js (the dense grade-6 floor argmin at n=596)
 *   @see imp-33627-saturation-budget-crossover.js (the grade-4 Q-vs-floor crossover nodes_sat at n=596)
 *   @see imp-33557-band-crossing-min-budget.js (the measured grade-4 ladder imp-33627 reads)
 *   @see imp-33316-graded-plateau-deep-tail-node-budget.js (the &lt; 64 ULP band)
 *
 *   Ticket: imp-33667 (accuracy, medium).
 */

import { IMP33641_GRADE6_NODE_BUDGET_NON_MONOTONICITY } from './imp-33641-grade6-node-budget-non-monotonicity.js';
import { IMP33627_SATURATION_BUDGET_CROSSOVER } from './imp-33627-saturation-budget-crossover.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const SHARED_RUNG = 596;         // the rung both modules measure
const SHARED_REGION_LO = 150;    // the imp-33627 crossover bracket / the region both onset nodes land in
const SHARED_REGION_HI = 200;
const NODE_RATIO_TOL = 1.10;     // onset-node agreement threshold: ratio < 1.10 (within ~10%)
const SADDLE_TOL = 1e-12;        // the two modules must share the saddle tau* at n=596 (identical root)
const FLOOR_HEIGHT_DISAGREE_FACTOR = 5; // honesty: the floor HEIGHTS differ by more than this (grade 6 vs 4)

// -- Read the imp-33641 dense grade-6 floor argmin at n=596 UNCHANGED ------------------------------
const A = IMP33641_GRADE6_NODE_BUDGET_NON_MONOTONICITY.measured;
const DENSE_FLOOR_NODES = A.globalFloorNodes;   // ~180: the node where the dense grade-6 residual bottoms out
const DENSE_FLOOR_ULP = A.globalFloorUlp;       // ~6.1 ULP
const DENSE_SADDLE_TAU = A.saddleTau;           // tau*(596)
const DENSE_GRADE = A.grade;                    // 6

// -- Read the imp-33627 grade-4 Q-vs-floor crossover at n=596 UNCHANGED ----------------------------
const CROSS_ROW = IMP33627_SATURATION_BUDGET_CROSSOVER.measured.crossoverTable.find(
  (r) => r.n === SHARED_RUNG,
);
const CROSSOVER_NODES = CROSS_ROW.nodesSat;     // ~192.5: where Q(nodes) meets the flat floor
const CROSSOVER_FLOOR_ULP = CROSS_ROW.floorUlp; // ~65.3 ULP (grade 4)
const CROSSOVER_SADDLE_TAU = CROSS_ROW.saddleTau;
const CROSSOVER_BRACKET_LO = CROSS_ROW.bracketLo; // 150
const CROSSOVER_BRACKET_HI = CROSS_ROW.bracketHi; // 200
const CROSSOVER_GRADE = 4; // the imp-33557 ladder imp-33627 reads is grade 4

// -- The cross-check ------------------------------------------------------------------------------
const NODE_LOCATION_RATIO = Math.max(DENSE_FLOOR_NODES, CROSSOVER_NODES) /
  Math.min(DENSE_FLOOR_NODES, CROSSOVER_NODES);
const NODE_LOCATION_DIFF = Math.abs(CROSSOVER_NODES - DENSE_FLOOR_NODES);
const FLOOR_HEIGHT_RATIO = Math.max(DENSE_FLOOR_ULP, CROSSOVER_FLOOR_ULP) /
  Math.min(DENSE_FLOOR_ULP, CROSSOVER_FLOOR_ULP);
const SADDLE_TAU_ABS_DIFF = Math.abs(DENSE_SADDLE_TAU - CROSSOVER_SADDLE_TAU);
const DENSE_IN_REGION = DENSE_FLOOR_NODES >= SHARED_REGION_LO && DENSE_FLOOR_NODES <= SHARED_REGION_HI;
const CROSSOVER_IN_REGION = CROSSOVER_NODES >= SHARED_REGION_LO && CROSSOVER_NODES <= SHARED_REGION_HI;

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) The two modules share the rung n=596 AND the saddle tau* (identical Laplace root, agree < 1e-12).
const sharedRungAndSaddle =
  DENSE_FLOOR_NODES !== undefined && CROSS_ROW !== undefined && SADDLE_TAU_ABS_DIFF < SADDLE_TOL;
// (2) Both onset NODE locations land inside the shared [150,200] region.
const bothInSharedRegion = DENSE_IN_REGION && CROSSOVER_IN_REGION;
// (3) THE HEADLINE: the two INDEPENDENT onset node locations AGREE within ~10% (ratio < 1.10).
const nodeLocationsAgree = NODE_LOCATION_RATIO < NODE_RATIO_TOL;
// (4) HONEST NUANCE: the floor HEIGHTS do NOT agree -- they differ by > 5x (grade 6 ~6 vs grade 4 ~65).
const floorHeightsDisagree = FLOOR_HEIGHT_RATIO > FLOOR_HEIGHT_DISAGREE_FACTOR && DENSE_GRADE !== CROSSOVER_GRADE;
// (5) The crossover point estimate lies inside its own [150,200] bracket (imp-33627 robust-region reading).
const crossoverInOwnBracket =
  CROSSOVER_NODES > CROSSOVER_BRACKET_LO && CROSSOVER_NODES <= CROSSOVER_BRACKET_HI;

const verdict =
  sharedRungAndSaddle && bothInSharedRegion && nodeLocationsAgree && floorHeightsDisagree &&
  crossoverInOwnBracket
    ? 'TWO-METHOD-ONSET-NODE-AGREES-IN-[150,200]-FLOOR-HEIGHT-DOES-NOT:-THE-imp-33641-DENSE-GRADE-6-FLOOR-' +
      'ARGMIN-(~180-NODES,-FLOOR-~6.1-ULP)-AND-THE-imp-33627-GRADE-4-Q-VS-FLOOR-CROSSOVER-(~192.5-NODES,-' +
      'FLOOR-~65.3-ULP)-AT-THE-SHARED-RUNG-n=596-(IDENTICAL-SADDLE-tau*,-AGREE-<1e-12)-GIVE-ONSET-NODE-' +
      'LOCATIONS-THAT-AGREE-TO-WITHIN-~7%-(RATIO-~1.069,-DIFF-~12.5-NODES)-AND-BOTH-LAND-INSIDE-THE-SHARED-' +
      '[150,200]-REGION,-ROBUSTLY-CORROBORATING-A-~180..193-NODE-GRADED-GL-SATURATION-ONSET-ACROSS-TWO-' +
      'INDEPENDENT-METHODS-THAT-NEVER-CROSS-REFERENCED-EACH-OTHER.-HONEST-NUANCE:-THIS-IS-A-NODE-LOCATION-' +
      'AGREEMENT,-NOT-A-FLOOR-HEIGHT-AGREEMENT-(THE-FLOOR-HEIGHTS-DIFFER-~10.7x-BY-CONSTRUCTION,-GRADE-6-VS-' +
      'GRADE-4),-AND-THE-TWO-ONSET-NOTIONS-(FLOOR-ARGMIN-VS-BRANCH-CROSSOVER)-ARE-CONCEPTUALLY-DISTINCT-SO-' +
      'EXACT-COINCIDENCE-IS-NOT-EXPECTED.-ACCURACY/RULE-DESIGN-CROSS-CHECK-ONLY;-JITTERY-LATTICE-FLOOR;-' +
      'ROBUST-READING-IS-THE-[150,200]-REGION-NOT-THE-EXACT-NODE;-mass-feasibility-NECESSARY-BUT-NOT-' +
      'SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-PT-Lambda<=0.2-STAYS-SOTA'
    : 'INDETERMINATE';

export const IMP33667_CROSSOVER_CROSS_VALIDATION = Object.freeze({
  id: 'imp-33667-crossover-cross-validation',
  ticket: 'imp-33667',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  crossValidatesModules: [
    'imp-33641-grade6-node-budget-non-monotonicity.js',
    'imp-33627-saturation-budget-crossover.js',
    'imp-33557-band-crossing-min-budget.js',
    'imp-33316-graded-plateau-deep-tail-node-budget.js',
  ],

  summary:
    'CROSS-CHECK of the two INDEPENDENT graded-GL saturation-onset node locations imp-33641 and imp-33627 ' +
    'each measure at the shared rung n=596 but neither cross-references. imp-33641 (dense integer-panel scan, ' +
    'grade 6) locates the true dense floor at ~180 nodes (~6.1 ULP); imp-33627 (Q-vs-floor branch-crossover ' +
    'fit, grade 4) locates nodes_sat ~192.5 inside the [150,200] bracket (floor ~65.3 ULP). Reading both ' +
    'published measurements UNCHANGED, the two onset NODE locations AGREE to within ~7% (ratio ~1.069, diff ' +
    '~12.5 nodes) and BOTH land inside the shared [150,200] region -- a cross-method corroboration of a ' +
    '~180..193-node onset at n=596. The two modules share the rung AND the saddle tau* EXACTLY (agree ' +
    '&lt; 1e-12), so the agreement is between two genuinely independent METHODS. HONEST NUANCE: this is a ' +
    'NODE-LOCATION agreement, NOT a floor-height agreement -- the floor HEIGHTS differ ~10.7x by construction ' +
    '(grade 6 ~6 vs grade 4 ~65 ULP), and the two onset notions (floor argmin vs branch crossover) are ' +
    'conceptually distinct, so exact coincidence is not expected. VERDICT: ' +
    'TWO-METHOD-ONSET-NODE-AGREES-IN-[150,200]-FLOOR-HEIGHT-DOES-NOT. ACCURACY/RULE-DESIGN CROSS-CHECK ONLY, ' +
    'RH-EQUIVALENT, necessary-but-not-sufficient; jittery lattice floor; robust reading is the region not the ' +
    'exact node; operator positivity (imp-3066) untouched; no QED. PT Lambda &lt;= 0.2 stays SOTA.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    sharedRung: 'both modules measure the imp-33577 graded-GL-failing rung n=596, tau* = root of n = 4 pi tau* e^{4 tau*}',
    denseSource: 'imp-33641.measured.globalFloorNodes/globalFloorUlp -- the dense grade-6 A_direct(tau*) floor argmin over P in [15,60]',
    crossoverSource: 'imp-33627 n=596 crossoverTable row -- the grade-4 Q(nodes)-meets-floor(n) crossover nodes_sat from the imp-33557 ladder',
    nodeCheck: 'ratio and difference of the two onset node locations; region-membership test against the shared [150,200]',
    floorCheck: 'ratio of the two floor HEIGHTS -- expected to DISAGREE (grade 6 resolves deeper than grade 4)',
    saddleCheck: 'the two saddle tau* values must agree to < 1e-12 (identical Laplace root at n=596)',
    selfComputing: 'every ratio, region flag, and verdict flag recompute at import from the two imported measurements',
  }),

  measured: Object.freeze({
    sharedRung: SHARED_RUNG,
    sharedRegionLo: SHARED_REGION_LO,
    sharedRegionHi: SHARED_REGION_HI,
    denseFloorNodes: DENSE_FLOOR_NODES,
    denseFloorUlp: DENSE_FLOOR_ULP,
    denseGrade: DENSE_GRADE,
    denseSaddleTau: DENSE_SADDLE_TAU,
    crossoverNodes: CROSSOVER_NODES,
    crossoverFloorUlp: CROSSOVER_FLOOR_ULP,
    crossoverGrade: CROSSOVER_GRADE,
    crossoverSaddleTau: CROSSOVER_SADDLE_TAU,
    crossoverBracketLo: CROSSOVER_BRACKET_LO,
    crossoverBracketHi: CROSSOVER_BRACKET_HI,
    nodeLocationRatio: NODE_LOCATION_RATIO,
    nodeLocationDiff: NODE_LOCATION_DIFF,
    floorHeightRatio: FLOOR_HEIGHT_RATIO,
    saddleTauAbsDiff: SADDLE_TAU_ABS_DIFF,
    denseInRegion: DENSE_IN_REGION,
    crossoverInRegion: CROSSOVER_IN_REGION,
    sharedRungAndSaddle,
    bothInSharedRegion,
    nodeLocationsAgree,
    floorHeightsDisagree,
    crossoverInOwnBracket,
    verdict,
  }),

  interpretation: Object.freeze({
    onsetNodesAgree:
      'The imp-33641 dense grade-6 floor argmin (~180 nodes) and the imp-33627 grade-4 Q-vs-floor crossover ' +
      '(~192.5 nodes) differ by only ~12.5 nodes (ratio ~1.069, under 7%), and BOTH land inside the shared ' +
      '[150,200] region. Two methods that never cross-referenced each other agree on WHERE the graded-GL ' +
      'saturation onset sits at n=596: ~180..193 nodes.',
    sharedSaddleNotCoincidence:
      'The two modules use the IDENTICAL saddle tau* = root of n = 4 pi tau* e^{4 tau*} at n=596 (they agree to ' +
      '< 1e-12). So the onset-node agreement is between two independent METHODS (dense grade-6 floor argmin vs ' +
      'coarse grade-4 branch crossover), not an artefact of a shared rung or saddle.',
    floorHeightsDoNotAgree:
      'This is a NODE-LOCATION agreement, NOT a floor-height agreement. The two floors differ ~10.7x (~6.1 ULP ' +
      'grade 6 vs ~65.3 ULP grade 4) -- by construction, since grade 6 resolves the sharpening saddle deeper ' +
      'than grade 4. The cross-check corroborates WHERE saturation sets in, not HOW LOW the floor sits.',
    conceptuallyDistinctNotions:
      'The two quantities are related but not identical: imp-33641 measures the ARGMIN of the dense residual ' +
      '(the node where the floor is deepest); imp-33627 measures the CROSSOVER (where the descending branch ' +
      'meets the flat floor). Exact numerical coincidence is NOT expected -- the ~7% spread is consistent with ' +
      'that conceptual gap, not a defect.',
    latticeJitterCaveat:
      'The per-panel/per-budget ULP is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/' +
      'imp-33296/imp-33537/imp-33605): the exact onset node can shift under cross-platform libm exp/pow ' +
      'variation. The robust reading is the shared [150,200] REGION, NOT the exact ~180 / ~192.5 nodes.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Reads the imp-33641 dense grade-6 floor argmin and the imp-33627 grade-4 Q-vs-floor crossover at n=596 ' +
      'UNCHANGED and tabulates their agreement (node location, floor height, shared saddle). It runs NO new ' +
      'saddle sweep, changes NO bound, patches NO literal, and establishes NO operator positivity. A ' +
      'cross-check of two published quadrature diagnostics -- not a bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nodeLocationNotFloorHeight:
      'The agreement is a NODE-LOCATION agreement (~180 vs ~192.5, within ~7%, both in [150,200]); the floor ' +
      'HEIGHTS differ ~10.7x (grade 6 vs grade 4) and are NOT expected to match.',
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33641/imp-33627/imp-33557/imp-33316/imp-33213; ' +
      'this cross-checks two node-budget measurements, not that truncation.',
    latticeJitterCaveat:
      'The per-panel/per-budget ULP is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/' +
      'imp-33296/imp-33537/imp-33605): cross-platform libm exp/pow variation can shift the exact onset node, ' +
      'so the robust reading is the shared [150,200] REGION, NOT the exact ~180 / ~192.5 nodes.',
    singlePlatform: 'Single-platform libm exp/pow; the few-ULP floor values are platform-sensitive.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33667_CROSSOVER_CROSS_VALIDATION_ASSERTIONS = [
  {
    id: 'imp33667-shared-rung-and-saddle',
    why: 'Both modules must measure the shared rung n=596 with the IDENTICAL saddle tau* (agree < 1e-12), so the ' +
         'cross-check compares two independent METHODS at the same rung, not two different rungs.',
    holds: () => sharedRungAndSaddle && SADDLE_TAU_ABS_DIFF < SADDLE_TOL && CROSS_ROW.n === SHARED_RUNG,
  },
  {
    id: 'imp33667-dense-floor-node-read',
    why: 'The imp-33641 dense grade-6 floor argmin (~180 nodes) must be read UNCHANGED and land in [150,200].',
    holds: () => DENSE_FLOOR_NODES === 180 && DENSE_IN_REGION && DENSE_GRADE === 6,
  },
  {
    id: 'imp33667-crossover-node-read',
    why: 'The imp-33627 grade-4 Q-vs-floor crossover (~192.5 nodes) must be read UNCHANGED, land in [150,200], ' +
         'and lie inside its own [150,200] bracket.',
    holds: () => CROSSOVER_NODES > 180 && CROSSOVER_NODES < 200 && CROSSOVER_IN_REGION && crossoverInOwnBracket,
  },
  {
    id: 'imp33667-node-locations-agree',
    why: 'THE HEADLINE: the two INDEPENDENT onset node locations AGREE within ~10% (ratio < 1.10) -- ~180 vs ' +
         '~192.5, a ~7% spread.',
    holds: () => nodeLocationsAgree && NODE_LOCATION_RATIO < NODE_RATIO_TOL && NODE_LOCATION_RATIO < 1.08,
  },
  {
    id: 'imp33667-both-in-shared-region',
    why: 'Both onset node locations must land inside the shared [150,200] region -- the robust cross-method ' +
         'onset-REGION reading given the jittery few-ULP floor.',
    holds: () => bothInSharedRegion && DENSE_IN_REGION && CROSSOVER_IN_REGION,
  },
  {
    id: 'imp33667-floor-heights-disagree',
    why: 'Mandatory honesty: this is a NODE-LOCATION agreement, NOT a floor-height agreement -- the floor HEIGHTS ' +
         'differ > 5x (grade 6 ~6 vs grade 4 ~65 ULP) by construction and are NOT expected to match.',
    holds: () => floorHeightsDisagree && FLOOR_HEIGHT_RATIO > FLOOR_HEIGHT_DISAGREE_FACTOR,
  },
  {
    id: 'imp33667-verdict-records-two-method-agreement',
    why: 'The classified verdict must record the TWO-METHOD-ONSET-NODE-AGREES-IN-[150,200]-FLOOR-HEIGHT-DOES-NOT ' +
         'reading, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33667-honest-cross-check-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design cross-check only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP33667_CROSSOVER_CROSS_VALIDATION.honestCaveat;
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

for (const assertion of IMP33667_CROSSOVER_CROSS_VALIDATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33667-crossover-cross-validation assertion failed: ${assertion.id}`);
  }
}
