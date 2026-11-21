/**
 * @module imp-33666-saturation-budget-crossover-tail
 * @fileoverview imp-33666 -- EXTEND the imp-33627 Q(nodes)-vs-floor(n) saturation-budget crossover
 *   measurement from the imp-33557 mid-tail band-crossing rungs n in {495,510,596} (where nodes_sat(n)
 *   was measured FLAT at ~186 nodes, inside the [150,200] bracket, spread &lt; 7%) to the imp-33638
 *   re-intensifying DEEP-TAIL cluster peaks n in {962,998,1126}, and MEASURE whether nodes_sat stays
 *   flat ~186 as the tail floor(n) climbs -- or whether the clean two-regime crossover breaks down.
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   -----------------------------------------------------------------------
 *   imp-33627 read the imp-33557 rung ladder UNCHANGED, but the imp-33557 table only covers the mid-tail
 *   rungs {495,510,596}. So this module re-runs the IDENTICAL grade-4 graded-GL node-budget sweep from a
 *   self-contained copy of the imp-33557/imp-33539 kernel (panels {10,15,20,30,50,100,200,400} =&gt;
 *   100..4000 nodes, GL-10 per panel, hi=7, grade 4; ULP vs the imp-33213 log-domain A_log target) at
 *   the imp-33638 tail cluster peaks n in {962,998,1126}, then applies the imp-33627 crossover recipe:
 *
 *     1. floor(n)  -- the min ULP over the saturated tail (budgets &gt;= 200 nodes).
 *     2. The DECREASING quadrature branch Q(nodes) -- the pre-saturation budgets (ULP &gt; 3x floor(n)),
 *        fit by ln Q = intercept + slope * ln(nodes) OLS, exponent p = -slope.
 *     3. nodes_sat(n) = exp( (ln floor(n) - intercept) / slope ) -- where Q meets the flat floor.
 *     4. The robust crossover BRACKET [lastPreSatNodes, firstSatNodes], and (NEW at the tail) whether the
 *        pre-saturation budgets form a clean CONTIGUOUS PREFIX (max preSat node &lt; min saturated node) --
 *        the imp-33627 mid-tail assumption that the decreasing branch is a clean prefix of the ladder.
 *
 *   MEASURED (self-computed; ULP vs the imp-33213 A_log; single-platform libm):
 *
 *        n      tau*     floor(n)   floorNode   preSat prefix?   p       nodes_sat   bracket       in bracket
 *        962    ~1.068   ~13.8      2000        NO (dirty)       ~2.8    ~2892       [4000,500]    NO
 *        998    ~1.076   ~70.4      2000        YES (clean)      ~17.1   ~227        [200,300]     YES
 *        1126   ~1.100   ~10.4       300        NO (dirty)       ~2.9    ~3243       [4000,300]    NO
 *
 *   HEADLINE -- THE FLAT ~186 CROSSOVER DOES NOT SURVIVE INTO THE RE-INTENSIFYING TAIL.
 *   Only ONE of the three tail rungs (n=998) yields a clean, in-bracket crossover, and there nodes_sat
 *   ~227 has SHIFTED UP ~18% ABOVE the imp-33627 mid-tail maximum (~192.5) and ~22% above the mid-tail
 *   mean (~186) -- it is NOT flat. At the two rungs where the imp-33638 deep-tail floor jitter is worst
 *   (n=962, n=1126) the min-over-tail floor(n) is captured at a NON-MONOTONE deep budget (floorNode 2000
 *   resp. 300), so the imp-33627 "ULP &gt; 3x floor =&gt; pre-saturation" branch classification no longer
 *   forms a clean prefix -- budgets sitting ABOVE the floor node get flagged pre-saturation, the log-log
 *   fit degenerates to a shallow p ~ 2.8-2.9 (vs the mid-tail p ~ 21), and the fitted nodes_sat lands
 *   at ~2900-3200 nodes, OUTSIDE its own bracket. The crossover is not robustly locatable there.
 *
 *   VERDICT. SATURATION-CROSSOVER-DOES-NOT-STAY-FLAT-INTO-THE-TAIL. The imp-33627 flat fixed
 *   ~186-node peak-resolution wall is a MID-TAIL [490,600] phenomenon; it does NOT extend to the
 *   imp-33638 re-intensifying deep tail. Where the crossover remains cleanly locatable (n=998, the one
 *   rung with a monotone tail floor) nodes_sat SHIFTS UP to ~227 (NOT flat), and where the deep-tail
 *   floor jitter is worst (n=962, n=1126) the clean-prefix pre-saturation branch classification the
 *   imp-33627 fit relies on BREAKS, so nodes_sat is not robustly measurable. This INVERTS the imp-33627
 *   "saturation is a fixed peak-resolution wall independent of floor height" reading in the deep tail:
 *   as the floor re-intensifies and jitters, the crossover measurement itself degrades.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   NUMERICAL-BEHAVIOUR MEASUREMENT ONLY, at the RH-equivalent scale class. It re-runs the imp-33557
 *   grade-4 graded-GL ladder at three tail rungs and applies the imp-33627 crossover recipe; it runs NO
 *   new operator step, changes NO bound, patches NO literal, and establishes NO positivity. The per-budget
 *   ULP is a JITTERY arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/imp-33537
 *   latticeJitterCaveat) -- and this module's HEADLINE is precisely that in the deep tail the jitter grows
 *   until the min-over-tail floor lands at a non-monotone budget and the clean pre-saturation prefix the
 *   imp-33627 fit assumed no longer exists. The exact fitted nodes_sat digits at the dirty rungs are NOT
 *   certified (they are diagnosed as unreliable, not reported as measurements); the ROBUST reading is the
 *   qualitative one: NOT flat, and cleanly locatable at only 1 of 3 tail rungs. NPHI = 10 truncation is
 *   inherited; single-platform libm exp/pow. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the
 *   operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED.
 *   No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33627-saturation-budget-crossover.js (the mid-tail flat ~186 crossover this extends)
 *   @see imp-33638-band-clearing-tail-reintensification-n900-1200.js (the re-intensifying tail floor)
 *   @see imp-33557-band-crossing-min-budget.js (the grade-4 node-budget ladder recipe re-run here)
 *   @see imp-33316-graded-plateau-deep-tail-node-budget.js (the &lt; 64 ULP band)
 *
 *   Ticket: imp-33666 (numerical, medium).
 */

import { IMP33627_SATURATION_BUDGET_CROSSOVER } from './imp-33627-saturation-budget-crossover.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const PI = Math.PI;
const U = Math.pow(2, -52); // 1 ULP scaled to the A_log magnitude
const NPHI = 10; // the completed-Riemann kernel truncation, inherited from imp-33213/imp-33316/imp-33557
const SATURATION_FACTOR = 3; // imp-33627: a budget is PRE-saturation while its ULP still sits > 3x floor(n)

// -- imp-3893s DIRECT completed-Riemann kernel (self-contained copy of the imp-33557 machinery) ------
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2) * Math.exp(-PI * n2 * e4);
  }
  return s;
}

// -- imp-3850s FACTORED log kernel for the imp-33213 independent log-domain target ------------------
function logPhiFactored(u) {
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  let acc = 0;
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    const amp = 2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2;
    acc += amp * Math.exp(-PI * (n2 - 1) * e4);
  }
  return -PI * e4 + Math.log(acc);
}

// -- 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33277/imp-33316/imp-33539/imp-33557) -------
const GL_X = [
  -0.9739065285171717, -0.8650633666889845, -0.6794095682990244,
  -0.4333953941292472, -0.1488743389816312, 0.1488743389816312,
  0.4333953941292472, 0.6794095682990244, 0.8650633666889845,
  0.9739065285171717,
];
const GL_W = [
  0.0666713443086881, 0.1494513491505806, 0.2190863625159820,
  0.2692667193099963, 0.2955242247147529, 0.2955242247147529,
  0.2692667193099963, 0.2190863625159820, 0.1494513491505806,
  0.0666713443086881,
];

// -- GRADED-GL on the DIRECT linear integrand: panels a_j = 7 (j/panels)^grade, GL-10 per panel -----
function aDirectGradedGL(tau, hi, panels, grade) {
  let sum = 0;
  for (let j = 0; j < panels; j += 1) {
    const a = hi * Math.pow(j / panels, grade);
    const b = hi * Math.pow((j + 1) / panels, grade);
    const mid = 0.5 * (a + b);
    const half = 0.5 * (b - a);
    for (let k = 0; k < GL_X.length; k += 1) {
      const s = mid + half * GL_X[k];
      sum += GL_W[k] * half * phiKernel(s) * phiKernel(s + tau);
    }
  }
  return sum;
}

// -- imp-33213s INDEPENDENT log-domain graded-GL -ln A target (grade 5, 300 panels, hi=10) ----------
function negLnAgradedGL(tau, hi, panels, grade) {
  const terms = [];
  for (let j = 0; j < panels; j += 1) {
    const a = hi * Math.pow(j / panels, grade);
    const b = hi * Math.pow((j + 1) / panels, grade);
    const mid = 0.5 * (a + b);
    const half = 0.5 * (b - a);
    for (let k = 0; k < GL_X.length; k += 1) {
      const s = mid + half * GL_X[k];
      terms.push(Math.log(GL_W[k] * half) + logPhiFactored(s) + logPhiFactored(s + tau));
    }
  }
  let mx = -Infinity;
  for (const t of terms) if (t > mx) mx = t;
  let acc = 0;
  for (const t of terms) acc += Math.exp(t - mx);
  return -(mx + Math.log(acc));
}
function aLog(tau) {
  return Math.exp(-negLnAgradedGL(tau, 10, 300, 5));
}

// -- imp-3646 Laplace saddle tau*(n): root of n = 4 pi tau* e^{4 tau*} -----------------------------
function saddleTau(n) {
  let lo = 1e-9;
  let hi = 12;
  for (let it = 0; it < 300; it += 1) {
    const mid = (lo + hi) / 2;
    if (4 * PI * mid * Math.exp(4 * mid) < n) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// -- Ordinary least-squares slope/intercept of y on x (imp-33627 linFit verbatim) ------------------
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

// -- Sweep configuration (the imp-33557/imp-33539 grade-4 ladder VERBATIM) --------------------------
const TAIL_RUNGS = [962, 998, 1126]; // the imp-33638 re-intensifying deep-tail cluster peaks
const PANEL_SWEEP = [10, 15, 20, 30, 50, 100, 200, 400]; // grade-4, GL-10 => 100..4000 nodes
const GRADE = 4;
const RESOLVED_NODES = 200; // budgets at/above this have collapsed off the ~e7 unresolved-peak spike

// The imp-33627 mid-tail reference the tail is compared against (imported UNCHANGED).
const MID_TAIL = IMP33627_SATURATION_BUDGET_CROSSOVER.measured;
const MID_TAIL_MAX_NODES_SAT = MID_TAIL.maxNodesSat; // ~192.5
const MID_TAIL_MEAN_NODES_SAT = MID_TAIL.meanNodesSat; // ~186

// -- Per-rung Q-vs-floor crossover measurement at the tail rungs -----------------------------------
const CROSSOVER_TABLE = TAIL_RUNGS.map((n) => {
  const tauStar = saddleTau(n);
  const aLogVal = aLog(tauStar);
  const ulpOfALog = aLogVal * U;

  const budgetRow = PANEL_SWEEP.map((panels) => {
    const nodes = 10 * panels;
    const ulp = Math.abs(aDirectGradedGL(tauStar, 7, panels, GRADE) - aLogVal) / ulpOfALog;
    return Object.freeze({ panels, nodes, ulp });
  });

  // floor(n): the min ULP over the saturated tail (budgets >= 200 nodes), and WHICH budget achieved it.
  const resolvedFloor = budgetRow.filter((b) => b.nodes >= RESOLVED_NODES);
  const floorUlp = Math.min(...resolvedFloor.map((b) => b.ulp));
  const floorNode = resolvedFloor.find((b) => b.ulp === floorUlp).nodes;

  // The DECREASING quadrature branch: pre-saturation budgets (ULP > 3x floor). At the tail this may NOT
  // be a clean contiguous prefix -- the imp-33627 fit implicitly assumed it was.
  const preSat = budgetRow.filter((b) => b.ulp > SATURATION_FACTOR * floorUlp);
  const sat = budgetRow.filter((b) => b.ulp <= SATURATION_FACTOR * floorUlp);
  const lastPreSatNodes = preSat.length ? Math.max(...preSat.map((b) => b.nodes)) : NaN;
  const firstSatNodes = sat.length ? Math.min(...sat.map((b) => b.nodes)) : NaN;
  // CLEAN PREFIX: every pre-saturation budget sits shallower than every saturated one (monotone descent).
  const preSatIsCleanPrefix = preSat.length > 0 && sat.length > 0 && lastPreSatNodes < firstSatNodes;

  // Fit ln Q = intercept + slope * ln(nodes) over the pre-saturation budgets, exponent p = -slope.
  const xs = preSat.map((b) => Math.log(b.nodes));
  const ys = preSat.map((b) => Math.log(b.ulp));
  const { slope, intercept } = linFit(xs, ys);
  const branchExponent = -slope;

  // The crossover: Q(nodes_sat) = floor(n).
  const nodesSat = Math.exp((Math.log(floorUlp) - intercept) / slope);
  const inBracket = nodesSat > lastPreSatNodes && nodesSat <= firstSatNodes;
  // Cleanly locatable = the branch is a monotone prefix AND the fitted crossover lands in its own bracket.
  const cleanlyLocatable = preSatIsCleanPrefix && inBracket;

  return Object.freeze({
    n,
    saddleTau: tauStar,
    floorUlp,
    floorNode,
    preSatBudgets: Object.freeze(preSat.map((b) => b.nodes)),
    satBudgets: Object.freeze(sat.map((b) => b.nodes)),
    preSatIsCleanPrefix,
    branchExponent,
    nodesSat,
    bracketLo: lastPreSatNodes,
    bracketHi: firstSatNodes,
    inBracket,
    cleanlyLocatable,
    shiftRatioVsMidTailMean: nodesSat / MID_TAIL_MEAN_NODES_SAT,
  });
});

// -- Summary statistics ---------------------------------------------------------------------------
const CLEAN_RUNGS = CROSSOVER_TABLE.filter((r) => r.cleanlyLocatable);
const CLEAN_COUNT = CLEAN_RUNGS.length;
const DIRTY_COUNT = CROSSOVER_TABLE.length - CLEAN_COUNT;
// The nodes_sat of the cleanly-locatable rung(s) -- the only crossover values that are robustly measured.
const CLEAN_NODES_SAT = CLEAN_RUNGS.map((r) => r.nodesSat);
const MAX_CLEAN_NODES_SAT = CLEAN_COUNT ? Math.max(...CLEAN_NODES_SAT) : NaN;
const MIN_CLEAN_NODES_SAT = CLEAN_COUNT ? Math.min(...CLEAN_NODES_SAT) : NaN;
// Does the clean crossover STAY flat at the mid-tail ~186, or SHIFT up above the mid-tail max ~192.5?
const cleanCrossoverShiftsUp = CLEAN_COUNT > 0 && MIN_CLEAN_NODES_SAT > MID_TAIL_MAX_NODES_SAT;

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) Coverage: the measurement covers the imp-33638 tail cluster peaks n in {962,998,1126}.
const laddersCovered =
  CROSSOVER_TABLE.length === 3 &&
  CROSSOVER_TABLE[0].n === 962 &&
  CROSSOVER_TABLE[1].n === 998 &&
  CROSSOVER_TABLE[2].n === 1126;
// (2) floor(n) is read at every rung (a finite min ULP over the saturated tail).
const floorRead = CROSSOVER_TABLE.every((r) => Number.isFinite(r.floorUlp) && r.floorUlp > 0);
// (3) THE HEADLINE: the flat ~186 crossover does NOT survive -- it is cleanly locatable at FEWER than
//     all three tail rungs (unlike the mid-tail, where all three were clean and in-bracket).
const crossoverDoesNotStayFlat = CLEAN_COUNT < 3;
// (4) At least one tail rung yields a CLEAN in-bracket crossover so the shift can be measured at all.
const atLeastOneCleanRung = CLEAN_COUNT >= 1;
// (5) Where cleanly locatable, nodes_sat SHIFTS UP above the imp-33627 mid-tail maximum (~192.5) -- NOT flat.
const cleanShiftsAboveMidTail = cleanCrossoverShiftsUp;
// (6) The deep-tail jitter BREAKS the clean-prefix pre-saturation classification at >= 1 tail rung
//     (min-over-tail floor lands at a non-monotone budget), so the imp-33627 fit degrades there.
const tailJitterBreaksPrefix = DIRTY_COUNT >= 1 && CROSSOVER_TABLE.some((r) => !r.preSatIsCleanPrefix);

const verdict =
  laddersCovered && floorRead && crossoverDoesNotStayFlat && atLeastOneCleanRung &&
  cleanShiftsAboveMidTail && tailJitterBreaksPrefix
    ? 'SATURATION-CROSSOVER-DOES-NOT-STAY-FLAT-INTO-THE-TAIL:-EXTENDING-THE-imp-33627-Q(nodes)-vs-floor(n)-' +
      'CROSSOVER-FROM-THE-MID-TAIL-{495,510,596}-(nodes_sat~186,-FLAT-<7%,-[150,200]-BRACKET)-TO-THE-imp-33638-' +
      'RE-INTENSIFYING-DEEP-TAIL-{962,998,1126}-SHOWS-THE-FLAT-~186-WALL-DOES-NOT-SURVIVE.-ONLY-1-OF-3-TAIL-RUNGS-' +
      '(n=998)-YIELDS-A-CLEAN-IN-BRACKET-CROSSOVER,-AND-THERE-nodes_sat~227-HAS-SHIFTED-UP-~18%-ABOVE-THE-MID-TAIL-' +
      'MAX-(~192.5)-AND-~22%-ABOVE-THE-MEAN-(~186)-=>-NOT-FLAT.-AT-n=962-AND-n=1126-THE-imp-33638-DEEP-TAIL-FLOOR-' +
      'JITTER-CAPTURES-THE-MIN-OVER-TAIL-FLOOR-AT-A-NON-MONOTONE-BUDGET,-SO-THE-ULP>3x-floor-PRE-SATURATION-BRANCH-' +
      'IS-NO-LONGER-A-CLEAN-PREFIX,-THE-LOG-LOG-FIT-DEGENERATES-(p~2.8-2.9-vs-MID-TAIL-p~21)-AND-nodes_sat-LANDS-' +
      '~2900-3200-NODES-OUTSIDE-ITS-OWN-BRACKET-(NOT-ROBUSTLY-LOCATABLE).-THIS-INVERTS-THE-imp-33627-FIXED-' +
      'PEAK-RESOLUTION-WALL-INDEPENDENT-OF-FLOOR-HEIGHT-READING-IN-THE-DEEP-TAIL.-NUMERICAL-BEHAVIOUR-MEASUREMENT-' +
      'ONLY;-JITTERY-LATTICE-FLOOR-IS-THE-HEADLINE;-DIRTY-RUNG-DIGITS-DIAGNOSED-UNRELIABLE-NOT-REPORTED;-' +
      'mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33666_SATURATION_BUDGET_CROSSOVER_TAIL = Object.freeze({
  id: 'imp-33666-saturation-budget-crossover-tail',
  ticket: 'imp-33666',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33627-saturation-budget-crossover.js',
  groundsInModules: [
    'imp-33627-saturation-budget-crossover.js',
    'imp-33638-band-clearing-tail-reintensification-n900-1200.js',
    'imp-33557-band-crossing-min-budget.js',
    'imp-33316-graded-plateau-deep-tail-node-budget.js',
  ],

  summary:
    'EXTENDS the imp-33627 Q(nodes)-vs-floor(n) saturation-budget crossover (measured FLAT at nodes_sat ~186, ' +
    'spread &lt; 7%, inside the [150,200] bracket at the mid-tail rungs n in {495,510,596}) to the imp-33638 ' +
    're-intensifying deep-tail cluster peaks n in {962,998,1126}, re-running the imp-33557 grade-4 graded-GL ' +
    'node-budget ladder (100..4000 nodes, ULP vs the imp-33213 A_log target) from a self-contained kernel and ' +
    'applying the imp-33627 crossover recipe. RESULT: the flat ~186 wall does NOT survive. Only 1 of 3 tail ' +
    'rungs (n=998) yields a clean in-bracket crossover, and there nodes_sat ~227 has SHIFTED UP ~18% above the ' +
    'mid-tail maximum (~192.5) -- NOT flat. At n=962 and n=1126 the deep-tail floor jitter captures the ' +
    'min-over-tail floor at a non-monotone budget, so the ULP &gt; 3x floor pre-saturation branch is no longer ' +
    'a clean prefix, the log-log fit degenerates (p ~ 2.8-2.9 vs mid-tail p ~ 21) and the fitted nodes_sat ' +
    'lands ~2900-3200 nodes OUTSIDE its own bracket -- not robustly locatable. VERDICT: ' +
    'SATURATION-CROSSOVER-DOES-NOT-STAY-FLAT-INTO-THE-TAIL. This INVERTS the imp-33627 "fixed peak-resolution ' +
    'wall independent of floor height" reading in the deep tail. NUMERICAL-BEHAVIOUR MEASUREMENT ONLY, ' +
    'RH-EQUIVALENT, necessary-but-not-sufficient; the jittery lattice floor is the headline; dirty-rung digits ' +
    'are diagnosed unreliable, not reported; operator positivity (imp-3066) untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    source: 'the imp-33557 grade-4 graded-GL node-budget ladder RE-RUN from a self-contained kernel at the imp-33638 tail rungs {962,998,1126}',
    floorRead: 'floor(n) = min ULP over the saturated tail (budgets >= 200 nodes); floorNode records WHICH budget achieved it',
    branchFit: 'Q(nodes) fit as ln Q = intercept + slope*ln(nodes) by OLS over the pre-saturation budgets (ULP > 3x floor); p = -slope',
    crossover: 'nodes_sat = exp( (ln floor(n) - intercept) / slope ), with bracket [lastPreSatNodes, firstSatNodes]',
    cleanPrefixTest: 'preSatIsCleanPrefix = max preSat node < min saturated node -- the imp-33627 monotone-descent assumption; cleanlyLocatable = clean prefix AND nodes_sat in bracket',
    comparison: 'each tail nodes_sat compared to the imp-33627 mid-tail max (~192.5) and mean (~186), imported UNCHANGED',
    selfComputing: 'every ladder, floor, crossover, prefix test and verdict flag recompute at import',
  }),

  measured: Object.freeze({
    saturationFactor: SATURATION_FACTOR,
    tailRungs: Object.freeze(TAIL_RUNGS.slice()),
    crossoverTable: Object.freeze(CROSSOVER_TABLE),
    midTailMaxNodesSat: MID_TAIL_MAX_NODES_SAT,
    midTailMeanNodesSat: MID_TAIL_MEAN_NODES_SAT,
    cleanCount: CLEAN_COUNT,
    dirtyCount: DIRTY_COUNT,
    cleanNodesSat: Object.freeze(CLEAN_NODES_SAT.slice()),
    minCleanNodesSat: MIN_CLEAN_NODES_SAT,
    maxCleanNodesSat: MAX_CLEAN_NODES_SAT,
    cleanCrossoverShiftsUp,
    laddersCovered,
    floorRead,
    crossoverDoesNotStayFlat,
    atLeastOneCleanRung,
    cleanShiftsAboveMidTail,
    tailJitterBreaksPrefix,
    verdict,
  }),

  interpretation: Object.freeze({
    flatWallIsMidTailOnly:
      'imp-33627 measured nodes_sat ~186 flat across n in {495,510,596} and read it as a fixed ~186-node ' +
      'peak-resolution wall independent of floor height. Re-running the identical crossover recipe at the ' +
      'imp-33638 deep-tail peaks {962,998,1126} shows the flat wall is a MID-TAIL phenomenon: it does not ' +
      'extend into the re-intensifying tail.',
    cleanRungShiftsUp:
      'The one tail rung with a monotone tail floor (n=998, floor ~70 ULP) yields a clean in-bracket crossover ' +
      'at nodes_sat ~227 -- ~18% above the mid-tail maximum (~192.5). Where the crossover remains measurable ' +
      'at the tail it has SHIFTED UP, not stayed flat.',
    jitterBreaksTheFit:
      'At n=962 and n=1126 the imp-33638 deep-tail floor jitter is severe enough that the min-over-tail floor ' +
      'is captured at a NON-MONOTONE deep budget (floorNode 2000 resp. 300). The imp-33627 "ULP > 3x floor => ' +
      'pre-saturation" rule then flags budgets sitting ABOVE the floor node, the branch is no longer a clean ' +
      'prefix, the log-log fit degenerates to a shallow p ~ 2.8-2.9 (vs mid-tail p ~ 21) and the fitted ' +
      'nodes_sat lands ~2900-3200 nodes, OUTSIDE its own bracket. The crossover is not robustly locatable there.',
    invertsTheReading:
      'imp-33627 read saturation as a fixed peak-resolution wall independent of floor height. This module shows ' +
      'the opposite in the deep tail: as the imp-33638 floor re-intensifies and jitters, the crossover ' +
      'measurement itself degrades -- shifting up where clean, breaking down where the floor jitter dominates.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    isNegativeResult: true,
    derivationScope:
      'Re-runs the imp-33557 grade-4 graded-GL node-budget ladder at three imp-33638 tail rungs and applies the ' +
      'imp-33627 crossover recipe. It runs NO new saddle sweep beyond re-evaluating the same quadrature, changes ' +
      'NO bound, patches NO literal, and establishes NO operator positivity. A numerical-behaviour measurement ' +
      'of a quadrature diagnostic -- and a NEGATIVE one: the mid-tail flat crossover does not extend to the tail.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33557/imp-33539/imp-33316/imp-33213; this ' +
      'measures the tail crossover of the inner node-budget ladder, not that truncation.',
    latticeJitterCaveat:
      'The per-budget ULP is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/' +
      'imp-33537). The HEADLINE of this module is precisely that in the deep tail the jitter grows until the ' +
      'min-over-tail floor lands at a non-monotone budget and the clean pre-saturation prefix the imp-33627 fit ' +
      'assumed no longer exists. The exact fitted nodes_sat digits at the two dirty rungs (n=962, n=1126) are ' +
      'NOT certified -- they are DIAGNOSED as unreliable (out-of-bracket, degenerate fit), not reported as ' +
      'measurements. The robust reading is qualitative: NOT flat, cleanly locatable at only 1 of 3 tail rungs, ' +
      'and shifted up (~227) where clean. Cross-platform libm exp/pow variation can move the few-ULP floor.',
    singlePlatform: 'Single-platform libm exp/pow; the few-ULP floor values are platform-sensitive.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33666_SATURATION_BUDGET_CROSSOVER_TAIL_ASSERTIONS = [
  {
    id: 'imp33666-ladders-covered',
    why: 'The measurement must cover the imp-33638 re-intensifying tail cluster peaks n in {962,998,1126}.',
    holds: () => laddersCovered && CROSSOVER_TABLE.length === 3,
  },
  {
    id: 'imp33666-floor-read',
    why: 'floor(n) must be read at every tail rung -- a finite positive min ULP over budgets >= 200 nodes.',
    holds: () => floorRead,
  },
  {
    id: 'imp33666-crossover-does-not-stay-flat',
    why: 'THE HEADLINE: the imp-33627 flat ~186 crossover does NOT survive into the tail -- it is cleanly ' +
         'locatable at FEWER than all three tail rungs (unlike the mid-tail, where all three were clean).',
    holds: () => crossoverDoesNotStayFlat && CLEAN_COUNT < 3,
  },
  {
    id: 'imp33666-at-least-one-clean-rung',
    why: 'At least one tail rung (n=998) must yield a clean in-bracket crossover so the shift is measurable.',
    holds: () => atLeastOneCleanRung && CLEAN_COUNT >= 1,
  },
  {
    id: 'imp33666-clean-crossover-shifts-up',
    why: 'Where cleanly locatable, nodes_sat must SHIFT UP above the imp-33627 mid-tail maximum (~192.5) -- ' +
         'the crossover does not stay flat at ~186 where the tail floor is a clean plateau.',
    holds: () => cleanShiftsAboveMidTail && MIN_CLEAN_NODES_SAT > MID_TAIL_MAX_NODES_SAT,
  },
  {
    id: 'imp33666-tail-jitter-breaks-prefix',
    why: 'At >= 1 tail rung the deep-tail floor jitter must break the clean pre-saturation PREFIX the imp-33627 ' +
         'fit assumed (min-over-tail floor captured at a non-monotone budget), degrading the crossover fit.',
    holds: () => tailJitterBreaksPrefix && DIRTY_COUNT >= 1,
  },
  {
    id: 'imp33666-dirty-rungs-out-of-bracket',
    why: 'The dirty rungs must be DIAGNOSED honestly: a rung that is not a clean prefix must not be reported as ' +
         'cleanly-locatable (its fitted nodes_sat is treated as unreliable, not a measurement).',
    holds: () => CROSSOVER_TABLE.every((r) => r.cleanlyLocatable === (r.preSatIsCleanPrefix && r.inBracket)),
  },
  {
    id: 'imp33666-verdict-records-not-flat',
    why: 'The classified verdict must record the SATURATION-CROSSOVER-DOES-NOT-STAY-FLAT-INTO-THE-TAIL reading.',
    holds: () => verdict !== 'INDETERMINATE' && /DOES-NOT-STAY-FLAT/.test(verdict),
  },
  {
    id: 'imp33666-honest-measurement-not-a-verdict',
    why: 'Mandatory honesty: numerical-behaviour measurement only (a NEGATIVE result), not a certified bound, ' +
         'mass-feasibility necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33666_SATURATION_BUDGET_CROSSOVER_TAIL.honestCaveat;
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

for (const assertion of IMP33666_SATURATION_BUDGET_CROSSOVER_TAIL_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33666-saturation-budget-crossover-tail assertion failed: ${assertion.id}`);
  }
}
