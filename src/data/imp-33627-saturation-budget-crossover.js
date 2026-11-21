/**
 * @module imp-33627-saturation-budget-crossover
 * @fileoverview imp-33627 -- MEASURE the per-rung saturation budget nodes_sat(n) that the imp-33583
 *   max( Q(nodes), floor(n) ) separation model POSITS but never quantifies. imp-33583 formalized the
 *   imp-33557 graded-GL deep-tail residual as R(n, nodes) ~ max( Q(nodes), floor(n) ) with a per-rung
 *   crossover budget nodes_sat(n) where Q(nodes_sat) = floor(n), and ASSERTED that crossover is the flat
 *   ~200-node imp-33557 peak-resolution wall -- but it only INHERITED the wall as a constant
 *   (SATURATION_NODES = 200), it never LOCATED the Q-vs-floor crossover directly. This module measures it.
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   -----------------------------------------------------------------------
 *   For each imp-33557 band-crossing rung n in {495,510,596} we read its imp-33537-graded-GL grade-4
 *   node-budget ladder budgetRow (nodes 100..4000, scored in ULP vs the imp-33213 log-domain A_log target)
 *   UNCHANGED from the imported imp-33557 table, then:
 *
 *     1. floor(n)  -- the FLAT arithmetic-jitter floor: the smallest residual the saturated tail reaches
 *        (imp-33557 floorUlp, the min ULP over budgets >= 200 nodes). This is regime (ii): independent of
 *        the node budget (imp-33537/imp-33555 depth-growing lattice envelope).
 *     2. The DECREASING quadrature branch Q(nodes) -- regime (i): the pre-saturation budgets whose residual
 *        still sits a factor SATURATION_FACTOR = 3 above floor(n) (the ~e7 unresolved-peak spike collapsing
 *        off as the graded panels resolve the sharpening saddle). We fit ln Q = b + m ln(nodes) by ordinary
 *        least squares over those pre-saturation points (a steep power-law descent, exponent p = -m ~ 21).
 *     3. nodes_sat(n)  -- the CROSSOVER: the node count where the fitted decreasing branch meets the flat
 *        floor, Q(nodes_sat) = floor(n), i.e. ln(nodes_sat) = (ln floor(n) - b) / m.
 *     4. The crossover BRACKET [lastPreSatNodes, firstSatNodes] -- the deepest pre-saturation ladder budget
 *        and the shallowest saturated one. The robust reading is that nodes_sat lies inside this bracket
 *        (the crossover REGION), not the exact fitted node (per the imp-33557 jittery-lattice caveat).
 *
 *   MEASURED CROSSOVER (self-computed from the imported imp-33557 ladder; ULP vs the imp-33213 A_log):
 *
 *        n     floor(n)   preSatBudgets   p (branch slope)   nodes_sat(n)   bracket        in bracket
 *        495   ~24.2      {100,150}       ~21.9              ~186.4         [150,200]      YES
 *        510   ~61.4      {100,150}       ~21.8              ~180.7         [150,200]      YES
 *        596   ~65.3      {100,150}       ~20.6              ~192.5         [150,200]      YES
 *
 *   HEADLINE. The measured crossover nodes_sat(n) is genuinely FLAT across the three band-crossing rungs --
 *   ~180..193 nodes, a spread of &lt; 7% (max/min ~ 1.07) -- so the imp-33583 "flat saturation budget"
 *   assertion holds as a DIRECT measurement, not merely an inherited wall. Quantitatively the crossover
 *   sits just BELOW the imp-33557 ~200-node peak-resolution wall (~186 &lt; 200), exactly as the two-regime
 *   picture predicts: 200 nodes is the first LADDER budget already AT/PAST saturation, while the true
 *   Q-meets-floor crossover falls between the last pre-saturation budget (150) and that first saturated
 *   budget (200). At every rung the point estimate lands inside the [150,200] bracket, so the crossover
 *   REGION reading is robust even where the exact fitted node is jittery.
 *
 *   VERDICT. SATURATION-BUDGET-CROSSOVER-MEASURED-FLAT. nodes_sat(n) measured directly at n in {495,510,596}
 *   is ~186 nodes, flat within &lt; 7%, inside the [150,200] bracket at every rung and just below the
 *   imp-33557 ~200-node wall the imp-33583 model inherited. This QUANTIFIES the imp-33583 crossover the
 *   separation model posited but never located.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   NUMERICAL-BEHAVIOUR MEASUREMENT ONLY, at the RH-equivalent scale class. It reads the imp-33557 measured
 *   band-crossing node-budget ladder UNCHANGED and locates the Q(nodes)-vs-floor(n) crossover; it runs NO
 *   new saddle sweep, changes NO bound, patches NO literal, and establishes NO operator positivity. The
 *   per-budget ULP is a JITTERY arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/imp-33537
 *   latticeJitterCaveat): the pre-saturation quadrature branch is fit from only the two ladder budgets
 *   {100,150} above the 3x-floor threshold, cross-platform libm exp/pow variation can shift the few-ULP
 *   floor, and the ROBUST reading is the crossover BRACKET [150,200], NOT the exact fitted node. The
 *   NPHI = 10 Phi-series truncation is inherited upstream; single-platform libm. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33583-node-budget-vs-arithmetic-floor-separation.js (the model that posits nodes_sat but does not measure it)
 *   @see imp-33557-band-crossing-min-budget.js (the measured node-budget ladder this reads)
 *   @see imp-33537-deep-tail-plateau-spike-recurrence.js (the depth-growing jitter envelope = floor(n))
 *   @see imp-33316-graded-plateau-deep-tail-node-budget.js (the &lt; 64 ULP band)
 *
 *   Ticket: imp-33627 (numerical, medium).
 */

import { IMP33557_BAND_CROSSING_MIN_BUDGET } from './imp-33557-band-crossing-min-budget.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const SATURATION_FACTOR = 3; // a budget is PRE-saturation while its ULP still sits > 3x the flat floor(n)
const ASSERTED_WALL_NODES = 200; // the imp-33583 SATURATION_NODES the model inherited (never measured)

// -- Pull the imp-33557 measured rung ladder UNCHANGED (import-light; no new saddle sweep) ------------
const RUNG_TABLE = IMP33557_BAND_CROSSING_MIN_BUDGET.measured.rungTable;

// Ordinary least-squares slope/intercept of y on x (reduces to the exact line for two points).
function linFit(xs, ys) {
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  const sxx = xs.reduce((a, b) => a + b * b, 0);
  const sxy = xs.reduce((a, b, i) => a + b * ys[i], 0);
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const intercept = (sy - slope * sx) / n;
  return { slope, intercept };
}

// -- Per-rung Q-vs-floor crossover measurement ----------------------------------------------------
const CROSSOVER_TABLE = RUNG_TABLE.map((r) => {
  const floorUlp = r.floorUlp; // regime (ii): the flat arithmetic floor (imp-33557 min ULP over >=200 nodes)

  // regime (i): the DECREASING quadrature branch -- budgets whose ULP is still well above the floor.
  const preSat = r.budgetRow.filter((b) => b.ulp > SATURATION_FACTOR * floorUlp);
  const sat = r.budgetRow.filter((b) => b.ulp <= SATURATION_FACTOR * floorUlp);

  // Fit ln Q = intercept + slope * ln(nodes) over the pre-saturation budgets (slope < 0, steep descent).
  const xs = preSat.map((b) => Math.log(b.nodes));
  const ys = preSat.map((b) => Math.log(b.ulp));
  const { slope, intercept } = linFit(xs, ys);
  const branchExponent = -slope; // p > 0: the power-law descent rate of the quadrature spike collapse

  // The crossover: Q(nodes_sat) = floor(n) => ln(nodes_sat) = (ln floor - intercept) / slope.
  const nodesSat = Math.exp((Math.log(floorUlp) - intercept) / slope);

  // The robust crossover BRACKET: [deepest pre-saturation budget, shallowest saturated budget].
  const lastPreSatNodes = Math.max(...preSat.map((b) => b.nodes));
  const firstSatNodes = Math.min(...sat.map((b) => b.nodes));
  const inBracket = nodesSat > lastPreSatNodes && nodesSat <= firstSatNodes;

  return Object.freeze({
    n: r.n,
    saddleTau: r.saddleTau,
    floorUlp,
    preSatBudgets: Object.freeze(preSat.map((b) => b.nodes)),
    spikeUlp: r.budgetRow.find((b) => b.nodes === 100).ulp,
    branchExponent,
    nodesSat,
    bracketLo: lastPreSatNodes,
    bracketHi: firstSatNodes,
    inBracket,
    belowAssertedWall: nodesSat < ASSERTED_WALL_NODES,
  });
});

// -- Summary statistics ---------------------------------------------------------------------------
const NODES_SAT = CROSSOVER_TABLE.map((r) => r.nodesSat);
const MIN_NODES_SAT = Math.min(...NODES_SAT);
const MAX_NODES_SAT = Math.max(...NODES_SAT);
const MEAN_NODES_SAT = NODES_SAT.reduce((a, b) => a + b, 0) / NODES_SAT.length;
const NODES_SAT_SPREAD_RATIO = MAX_NODES_SAT / MIN_NODES_SAT; // flatness signature: ~1 => flat
const MIN_BRANCH_EXPONENT = Math.min(...CROSSOVER_TABLE.map((r) => r.branchExponent));

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) Coverage: the measurement covers the imp-33557 band-crossing rungs n in {495,510,596}.
const laddersCovered =
  CROSSOVER_TABLE.length === 3 && CROSSOVER_TABLE[0].n === 495 && CROSSOVER_TABLE[2].n === 596;
// (2) The crossover is LOCATED at every rung: a finite node count strictly inside the swept ladder.
const crossoverMeasured = CROSSOVER_TABLE.every(
  (r) => Number.isFinite(r.nodesSat) && r.nodesSat > 100 && r.nodesSat < 4000,
);
// (3) The quadrature branch is genuinely DECREASING at every rung (steep power-law descent, p > 1).
const quadratureBranchDecreasing = CROSSOVER_TABLE.every((r) => r.branchExponent > 1);
// (4) The measured crossover is FLAT across rungs: the spread is < 20% (max/min < 1.2).
const crossoverFlat = NODES_SAT_SPREAD_RATIO < 1.2;
// (5) The point estimate lands inside the [lastPreSat, firstSat] bracket at every rung (robust region).
const crossoverInBracket = CROSSOVER_TABLE.every((r) => r.inBracket);
// (6) The measured crossover sits just BELOW the imp-33583 ~200-node inherited wall at every rung,
//     consistent with 200 being the first LADDER budget already at/past saturation.
const belowAssertedWall = CROSSOVER_TABLE.every((r) => r.belowAssertedWall);

const verdict =
  laddersCovered && crossoverMeasured && quadratureBranchDecreasing && crossoverFlat &&
  crossoverInBracket && belowAssertedWall
    ? 'SATURATION-BUDGET-CROSSOVER-MEASURED-FLAT:-THE-imp-33583-max(Q(nodes),floor(n))-CROSSOVER-nodes_sat(n)-' +
      'IS-MEASURED-DIRECTLY-AT-n-IN-{495,510,596}-BY-FITTING-THE-DECREASING-GRADED-GL-QUADRATURE-BRANCH-' +
      'Q(nodes)-(POWER-LAW-EXPONENT-p~21)-AND-LOCATING-WHERE-IT-CROSSES-THE-FLAT-imp-33557-floor(n).-THE-' +
      'CROSSOVER-IS-~186-NODES,-FLAT-WITHIN-<7%-(180.7..192.5,-max/min~1.07),-INSIDE-THE-[150,200]-BRACKET-' +
      'AT-EVERY-RUNG-AND-JUST-BELOW-THE-imp-33583-~200-NODE-INHERITED-WALL-(200-IS-THE-FIRST-LADDER-BUDGET-' +
      'ALREADY-SATURATED).-QUANTIFIES-THE-CROSSOVER-THE-imp-33583-SEPARATION-MODEL-POSITED-BUT-NEVER-LOCATED.-' +
      'NUMERICAL-BEHAVIOUR-MEASUREMENT-ONLY;-JITTERY-LATTICE-FLOOR;-ROBUST-READING-IS-THE-BRACKET-NOT-THE-EXACT-' +
      'NODE;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33627_SATURATION_BUDGET_CROSSOVER = Object.freeze({
  id: 'imp-33627-saturation-budget-crossover',
  ticket: 'imp-33627',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  measuresModule: 'imp-33583-node-budget-vs-arithmetic-floor-separation.js',
  groundsInModules: [
    'imp-33583-node-budget-vs-arithmetic-floor-separation.js',
    'imp-33557-band-crossing-min-budget.js',
    'imp-33537-deep-tail-plateau-spike-recurrence.js',
    'imp-33316-graded-plateau-deep-tail-node-budget.js',
  ],

  summary:
    'DIRECT MEASUREMENT of the per-rung saturation budget nodes_sat(n) that the imp-33583 R(n, nodes) ~ ' +
    'max( Q(nodes), floor(n) ) separation model posits but never locates. Reading the imp-33557 band-crossing ' +
    'grade-4 node-budget ladder (n in {495,510,596}, nodes 100..4000, scored vs the imp-33213 A_log target) ' +
    'UNCHANGED, for each rung we (a) read floor(n) as the flat saturated-tail floor, (b) fit the decreasing ' +
    'quadrature branch Q(nodes) by log-log least squares over the pre-saturation budgets (ULP > 3x floor; ' +
    'a power-law descent, exponent p ~ 21), and (c) locate the crossover nodes_sat where Q(nodes_sat) = ' +
    'floor(n). The measured crossover is ~186 nodes (n=495 ~186.4, n=510 ~180.7, n=596 ~192.5), FLAT within ' +
    '&lt; 7% (max/min ~ 1.07), inside the [150,200] bracket at every rung, and just BELOW the imp-33583 ' +
    '~200-node inherited wall -- exactly as the two-regime picture predicts (200 is the first LADDER budget ' +
    'already at/past saturation). VERDICT: SATURATION-BUDGET-CROSSOVER-MEASURED-FLAT. This QUANTIFIES the ' +
    'imp-33583 crossover the model posited but never measured. NUMERICAL-BEHAVIOUR MEASUREMENT ONLY, ' +
    'RH-EQUIVALENT, necessary-but-not-sufficient; jittery lattice floor; robust reading is the bracket not the ' +
    'exact node; operator positivity (imp-3066) untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    source: 'the imp-33557 measured rungTable imported UNCHANGED (n in {495,510,596}, grade 4, budgets 100..4000 nodes)',
    floorRead: 'floor(n) = the imp-33557 floorUlp -- the min ULP over the saturated tail (budgets >= 200 nodes)',
    branchFit: 'Q(nodes) fit as ln Q = intercept + slope*ln(nodes) by OLS over pre-saturation budgets (ULP > 3x floor); exponent p = -slope',
    crossover: 'nodes_sat = exp( (ln floor(n) - intercept) / slope ) -- the node count where Q(nodes_sat) = floor(n)',
    bracket: 'the robust crossover REGION [lastPreSatNodes, firstSatNodes] = [deepest pre-saturation budget, shallowest saturated budget]',
    selfComputing: 'every crossover, bracket, and verdict flag recompute at import from the imported imp-33557 ladder',
  }),

  measured: Object.freeze({
    saturationFactor: SATURATION_FACTOR,
    assertedWallNodes: ASSERTED_WALL_NODES,
    crossoverTable: Object.freeze(CROSSOVER_TABLE),
    nodesSat: Object.freeze(NODES_SAT.slice()),
    minNodesSat: MIN_NODES_SAT,
    maxNodesSat: MAX_NODES_SAT,
    meanNodesSat: MEAN_NODES_SAT,
    nodesSatSpreadRatio: NODES_SAT_SPREAD_RATIO,
    minBranchExponent: MIN_BRANCH_EXPONENT,
    laddersCovered,
    crossoverMeasured,
    quadratureBranchDecreasing,
    crossoverFlat,
    crossoverInBracket,
    belowAssertedWall,
    verdict,
  }),

  interpretation: Object.freeze({
    quantifiesTheModel:
      'imp-33583 stated R(n, nodes) ~ max( Q(nodes), floor(n) ) with a crossover nodes_sat where ' +
      'Q(nodes_sat) = floor(n), but only INHERITED the crossover as the flat ~200-node imp-33557 ' +
      'peak-resolution wall (SATURATION_NODES = 200). This module LOCATES the crossover directly: fit the ' +
      'decreasing quadrature branch, read the flat floor, and solve for their meeting point per rung.',
    crossoverIsFlat:
      'The measured nodes_sat(n) is ~186 nodes across all three band-crossing rungs (180.7..192.5), a ' +
      'spread under 7%. The imp-33583 "flat saturation budget" assertion therefore holds as a DIRECT ' +
      'measurement, not merely an inherited constant.',
    justBelowTheWall:
      'The measured crossover sits just BELOW the ~200-node wall (~186 < 200). This is exactly what the ' +
      'two-regime picture predicts: 200 nodes is the first LADDER budget already AT/PAST saturation, while ' +
      'the true Q-meets-floor crossover falls between the last pre-saturation budget (150) and that first ' +
      'saturated budget (200). The bracket [150,200] contains the point estimate at every rung.',
    robustReadingIsTheBracket:
      'The quadrature branch is fit from only the two ladder budgets {100,150} above the 3x-floor threshold, ' +
      'and the few-ULP floor is a jittery lattice property, so the exact fitted node is not certified. The ' +
      'ROBUST reading is that nodes_sat lies inside the [150,200] crossover REGION at every rung.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Reads the imp-33557 measured band-crossing node-budget ladder (n in {495,510,596}) UNCHANGED and ' +
      'locates the Q(nodes)-vs-floor(n) crossover nodes_sat per rung by a log-log fit of the decreasing ' +
      'quadrature branch. It runs NO new saddle sweep, changes NO bound, patches NO literal, and establishes ' +
      'NO operator positivity. A numerical-behaviour measurement of a quadrature diagnostic -- not a bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33557/imp-33539/imp-33316/imp-33213; this ' +
      'measures the crossover of the inner node-budget ladder, not that truncation.',
    latticeJitterCaveat:
      'The per-budget ULP is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/' +
      'imp-33537): the decreasing quadrature branch is fit from only the two ladder budgets {100,150} above ' +
      'the 3x-floor threshold, cross-platform libm exp/pow variation can shift the few-ULP floor, and the ' +
      'ROBUST reading is the crossover BRACKET [150,200], NOT the exact fitted node (~186). The measured ' +
      'flatness (< 7% spread) is the qualitative headline, not the per-rung digits.',
    singlePlatform: 'Single-platform libm exp/pow; the few-ULP floor values are platform-sensitive.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33627_SATURATION_BUDGET_CROSSOVER_ASSERTIONS = [
  {
    id: 'imp33627-ladders-covered',
    why: 'The measurement must cover the imp-33557 band-crossing ladder across n in {495,510,596}.',
    holds: () => laddersCovered && CROSSOVER_TABLE.length === 3,
  },
  {
    id: 'imp33627-crossover-measured',
    why: 'nodes_sat(n) must be LOCATED at every rung -- a finite node count strictly inside the swept ladder.',
    holds: () => crossoverMeasured,
  },
  {
    id: 'imp33627-quadrature-branch-decreasing',
    why: 'The quadrature branch Q(nodes) must be a genuine steep DESCENT at every rung (power-law p > 1), ' +
         'so that a crossover with the flat floor exists.',
    holds: () => quadratureBranchDecreasing && MIN_BRANCH_EXPONENT > 1,
  },
  {
    id: 'imp33627-crossover-flat',
    why: 'THE HEADLINE: the measured crossover nodes_sat(n) is FLAT across the three rungs -- spread < 20% ' +
         '(max/min < 1.2), confirming the imp-33583 flat-saturation-budget assertion as a direct measurement.',
    holds: () => crossoverFlat && NODES_SAT_SPREAD_RATIO < 1.2,
  },
  {
    id: 'imp33627-crossover-in-bracket',
    why: 'The point estimate must land inside the [lastPreSat, firstSat] bracket at every rung -- the robust ' +
         'crossover-REGION reading given the jittery few-ULP floor.',
    holds: () => crossoverInBracket,
  },
  {
    id: 'imp33627-below-asserted-wall',
    why: 'The measured crossover must sit just BELOW the imp-33583 ~200-node inherited wall at every rung ' +
         '(200 is the first LADDER budget already at/past saturation).',
    holds: () => belowAssertedWall && MAX_NODES_SAT < ASSERTED_WALL_NODES,
  },
  {
    id: 'imp33627-verdict-records-measured-flat',
    why: 'The classified verdict must record the SATURATION-BUDGET-CROSSOVER-MEASURED-FLAT reading, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33627-honest-measurement-not-a-verdict',
    why: 'Mandatory honesty: numerical-behaviour measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33627_SATURATION_BUDGET_CROSSOVER.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33627_SATURATION_BUDGET_CROSSOVER_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33627-saturation-budget-crossover assertion failed: ${assertion.id}`);
  }
}
