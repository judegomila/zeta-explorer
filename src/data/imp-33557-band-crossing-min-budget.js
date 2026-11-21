/**
 * @module imp-33557-band-crossing-min-budget
 * @fileoverview imp-33557 -- SWEEP the imp-33539 graded-plateau MINIMUM node budget at the
 *   imp-33537 BAND-CROSSING rungs n in {495,510,596} to test whether the flat ~200-node minimum
 *   HOLDS where the imp-33316 widened &lt; 64 ULP deep band FAILS.
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   THE GAP imp-33539 LEFT OPEN
 *   ---------------------------
 *   imp-33539 SWEPT the graded-GL plateau node budget at the DEEPER deep-tail rungs n in {350,375,400}
 *   and found the smallest budget reaching the imp-33275 A_log floor band is FLAT at ~200 nodes -- it
 *   does NOT grow as the saddle peak sharpens (FIXED-BUDGET-WIN-HOLDS). But all three of those rungs
 *   sit FIRMLY inside the imp-33316 &lt; 64 ULP band. imp-33537 then showed that same &lt; 64 band is a
 *   COARSE-GRID ARTIFACT: on a dense scan the plateau jitter envelope GROWS with depth and CROSSES the
 *   64-ULP band at n ~ 510 and n ~ 596. So imp-33539 never measured the minimum budget where the band
 *   actually FAILS -- exactly the rungs that decide whether the flat ~200-node minimum is universal or
 *   band-conditional. This module SWEEPS the IDENTICAL grade-4 node-budget ladder at the band-crossing
 *   rungs n in {495,510,596} and asks: does the flat ~200-node minimum survive where the band fails?
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   For each band-crossing rung n in {495,510,596} we take tau* = saddleTau(n) and score the direct
 *   graded-GL plateau A_direct(tau*) at the imp-33539 node-budget ladder (grade 4, panels
 *   P in {10,15,20,30,50,100,200,400} = 100..4000 inner GL nodes), reporting the residual vs the
 *   imp-33213 INDEPENDENT log-domain target A_log in ULP = A_log * 2^-52. Per rung we locate:
 *     - peakResolutionWallNodes: the budget at which the residual COLLAPSES off the ~e7 unresolved-peak
 *       spike (the graded panels first resolve the sharpening saddle), and
 *     - floorUlp: the SMALLEST residual achievable at or above that wall (budgets &gt;= 200 nodes) --
 *       the arithmetic floor the plateau can reach once the peak is resolved, and
 *     - minInBandNodes: the smallest budget whose residual falls inside the imp-33316 &lt; 64 ULP band
 *       (Infinity when NO budget in the ladder reaches the band).
 *
 *   MEASURED (grade 4; ULP vs the imp-33213 A_log target):
 *
 *        n    tau*      100n      150n     200n     ...   4000n     floorUlp   minInBandNodes   band
 *        495  0.93515   ~2.1e7    ~2834    53.6     ...   36.7       ~24.2      200n             HOLDS
 *        510  0.94104   ~2.4e7    ~3540    87.7     ...   79.1       ~61.4      500n(jittery)    EDGE
 *        596  0.97192   ~4.6e7   ~11030    65.3     ...   74.0       ~65.3      Infinity         FAILS
 *
 *   HEADLINE. The flat ~200-node minimum does NOT hold where the &lt; 64 ULP band fails. The
 *   peak-RESOLUTION wall stays flat (the residual still collapses off the ~e7 spike at ~200 nodes at
 *   all three rungs -- the graded panels still resolve the sharpening peak), but the arithmetic FLOOR
 *   that ~200 nodes reaches CLIMBS with depth (~24.2 ULP at n=495 -> ~61.4 at n=510 -> ~65.3 at n=596),
 *   tracking the imp-33537/imp-33555 depth-growing jitter envelope. Consequently the minimum budget that
 *   reaches the band is BAND-CONDITIONAL, not universal: it is a clean 200 nodes at n=495 (still inside
 *   the band), destabilises to ~500 nodes at n=510 (the floor hovers at the band edge, snapping in and
 *   out of the band with budget), and is UNDEFINED at n=596 -- NO budget in the ladder (up to 4000 nodes)
 *   reaches the band, because the floor ~65 ULP is set by the arithmetic jitter envelope, not the
 *   quadrature node budget. ADDING NODES DOES NOT RESCUE the deep rung: once the depth-growing envelope
 *   rises above the &lt; 64 band, more nodes only track a floor already above the band.
 *
 *   VERDICT. FLAT-MINIMUM-IS-BAND-CONDITIONAL. The imp-33539 flat ~200-node graded-plateau minimum holds
 *   only WHERE the imp-33316 &lt; 64 ULP band holds (n=495); it destabilises at the band edge (n=510) and
 *   becomes UNDEFINED where the band fails (n=596), because the residual floor is then set by the
 *   depth-growing arithmetic jitter envelope (imp-33537/imp-33555) rather than the node budget. This
 *   CONFIRMS (does not overturn) the imp-33537 correction of the &lt; 64 band as a coarse-grid artifact,
 *   and BOUNDS the imp-33539 flat-minimum reading to the in-band rungs.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It extends the imp-33539
 *   node-budget sweep into the band-crossing rungs; it changes NO bound, patches NO literal, and
 *   establishes NO operator positivity. The worst/floor ULP is a JITTERY arithmetic-floor lattice
 *   property (imp-33249/imp-33277/imp-33296/imp-33537 latticeJitterCaveat): the exact per-budget ULP
 *   bounces and cross-platform libm exp/pow variation can shift the few-ULP measurements, so the robust
 *   reading is the QUALITATIVE band-conditional structure -- floor climbs with depth, minimum budget is
 *   200 in band and UNBOUNDED where the band fails -- not the exact per-budget ULP. The NPHI = 10
 *   Phi-series truncation is inherited upstream. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the
 *   operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED.
 *   No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33539-graded-plateau-deeper-tail-min-budget.js (the flat ~200-node minimum this bounds)
 *   @see imp-33537-deep-tail-plateau-spike-recurrence.js (the dense scan that bounds the &lt; 64 band validity)
 *   @see imp-33555-deep-tail-jitter-envelope-growth-law.js (the depth-growth law of the jitter envelope)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33557 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;
const PI = Math.PI;
const U = Math.pow(2, -52); // double-precision unit roundoff

// -- imp-3893s DIRECT completed-Riemann kernel (double-domain; representable for u &lt; ~1.37) --------
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

// -- imp-3850s FACTORED log kernel: ln Phi(u) = -pi e^{4u} + ln(sum_n amp_n e^{-pi(n^2-1)e^{4u}}) ----
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

// -- 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33277/imp-33295/imp-33316/imp-33539) -------
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

// -- GRADED-GL on the DIRECT linear integrand: panels a_j = 7 (j/panels)^grade, GL-10 per panel ----
//    The integrand phiKernel(s)phiKernel(s+tau) &gt;= 0 on [0,7], so no subtractive cancellation.
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

// -- imp-33213s INDEPENDENT log-domain graded-GL -ln A (grade 5, 300 panels, hi=10) ----------------
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

// -- imp-3646 Laplace saddle tau*(n): root of n = 4 pi tau* e^{4 tau*} (imp-3893 saddleTau) --------
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

// -- Sweep configuration --------------------------------------------------------------------------
// BAND-CROSSING rungs the ticket targets: imp-33537 shows the plateau jitter envelope crosses the
// imp-33316 widened 64-ULP band at n ~ 510, 596 (n=495 still sits just inside the band).
const N_RUNGS = [495, 510, 596];
// The imp-33539 node-budget ladder verbatim: panels P (grade 4), 10 GL nodes per panel => 100..4000.
const PANEL_SWEEP = [10, 15, 20, 30, 50, 100, 200, 400];
const GRADE = 4; // the imp-33295/imp-33316/imp-33539 robust fixed graded rule
const DEEP_FLOOR_ULP = 64; // the imp-33316 widened ~2x deep-tail band
const RESOLVED_NODES = 200; // budgets at/above this have collapsed off the ~e7 unresolved-peak spike
const SPIKE_ULP = 1e5; // an UNRESOLVED-peak residual sits far above this (~e7); a resolved one far below
const FIXED_PLATEAU_PANELS = 400; // the imp-33316 FIXED plateau = 4000 nodes

// -- Per-rung budget sweep ------------------------------------------------------------------------
const RUNG_TABLE = N_RUNGS.map((n) => {
  const tauStar = saddleTau(n);
  const aLogVal = aLog(tauStar);
  const ulpOfALog = aLogVal * U;

  const budgetRow = PANEL_SWEEP.map((panels) => {
    const nodes = 10 * panels;
    const ulp = Math.abs(aDirectGradedGL(tauStar, 7, panels, GRADE) - aLogVal) / ulpOfALog;
    return Object.freeze({ panels, nodes, ulp, inBand: ulp < DEEP_FLOOR_ULP });
  });

  // Smallest budget inside the floor band (Infinity when NO budget in the ladder reaches it).
  const inBand = budgetRow.filter((b) => b.inBand);
  const minInBandNodes = inBand.length ? Math.min(...inBand.map((b) => b.nodes)) : Infinity;
  // The peak-resolution wall: the smallest budget whose residual has collapsed off the ~e7 spike.
  const resolved = budgetRow.filter((b) => b.ulp < SPIKE_ULP);
  const peakResolutionWallNodes = resolved.length ? Math.min(...resolved.map((b) => b.nodes)) : Infinity;
  // The arithmetic FLOOR reachable once the peak is resolved (budgets at/above RESOLVED_NODES).
  const resolvedFloor = budgetRow.filter((b) => b.nodes >= RESOLVED_NODES);
  const floorUlp = Math.min(...resolvedFloor.map((b) => b.ulp));
  const floorInBand = floorUlp < DEEP_FLOOR_ULP;
  // The imp-33316 FIXED plateau residual at this band-crossing rung.
  const fixedPlateauUlp = budgetRow.find((b) => b.panels === FIXED_PLATEAU_PANELS).ulp;

  return Object.freeze({
    n,
    saddleTau: tauStar,
    aLog: aLogVal,
    budgetRow: Object.freeze(budgetRow),
    minInBandNodes,
    peakResolutionWallNodes,
    floorUlp,
    floorInBand,
    fixedPlateauUlp,
    fixedPlateauInBand: fixedPlateauUlp < DEEP_FLOOR_ULP,
  });
});

// -- Summary statistics ---------------------------------------------------------------------------
const MIN_IN_BAND_NODES = RUNG_TABLE.map((r) => r.minInBandNodes);
const FLOOR_ULP = RUNG_TABLE.map((r) => r.floorUlp);
const PEAK_WALL_NODES = RUNG_TABLE.map((r) => r.peakResolutionWallNodes);
const SHALLOWEST = RUNG_TABLE[0]; // n=495, still inside the band
const DEEPEST = RUNG_TABLE[RUNG_TABLE.length - 1]; // n=596, where the band fails
const FLOOR_CLIMB_RATIO = DEEPEST.floorUlp / SHALLOWEST.floorUlp;

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) Coverage: the imp-33537 band-crossing rungs n in {495,510,596} across the imp-33539 ladder.
const bandCrossingCovered =
  N_RUNGS.length === 3 && N_RUNGS[0] === 495 && N_RUNGS[2] === 596 && PANEL_SWEEP.length >= 6;
// (2) The peak-RESOLUTION wall stays flat: at 100 nodes every rung is on the ~e7 spike (unresolved),
//     and by 200 nodes every rung has collapsed off it (the graded panels still resolve the peak).
const peakResolutionWallFlat =
  RUNG_TABLE.every((r) => r.budgetRow.find((b) => b.nodes === 100).ulp > SPIKE_ULP) &&
  RUNG_TABLE.every((r) => r.peakResolutionWallNodes <= RESOLVED_NODES);
// (3) THE HEADLINE: the achievable floor CLIMBS with depth -- the deepest rung floor clearly exceeds
//     the shallowest (robust to jitter: ~24 -> ~65 ULP, a ~2.7x climb).
const floorClimbsWithDepth = FLOOR_CLIMB_RATIO > 1.6 && DEEPEST.floorUlp > SHALLOWEST.floorUlp;
// (4) The flat ~200-node minimum HOLDS at the shallow in-band rung n=495 (a small finite budget).
const flatMinimumHoldsInBand = Number.isFinite(SHALLOWEST.minInBandNodes) && SHALLOWEST.minInBandNodes <= 300;
// (5) THE HEADLINE: the flat minimum does NOT hold where the band fails -- at the deepest rung n=596
//     NO budget in the ladder (up to 4000 nodes) reaches the band (minInBandNodes is Infinity).
const flatMinimumBreaksAtBandFailure = DEEPEST.minInBandNodes === Infinity && !DEEPEST.floorInBand;
// (6) The minimum is BAND-CONDITIONAL: it is NOT flat across the three rungs (200 in band, unbounded
//     where the band fails), the opposite of the imp-33539 in-band flat ~200-node reading.
const minInBandNotFlat =
  Math.max(...MIN_IN_BAND_NODES) !== Math.min(...MIN_IN_BAND_NODES) &&
  DEEPEST.minInBandNodes > SHALLOWEST.minInBandNodes;
// (7) Adding nodes does NOT rescue the deep rung: even the max 4000-node budget is out of band there.
const moreNodesDoNotRescueDeepRung =
  DEEPEST.budgetRow.find((b) => b.panels === FIXED_PLATEAU_PANELS).inBand === false;

const verdict =
  bandCrossingCovered && peakResolutionWallFlat && floorClimbsWithDepth && flatMinimumHoldsInBand &&
  flatMinimumBreaksAtBandFailure && minInBandNotFlat && moreNodesDoNotRescueDeepRung
    ? 'FLAT-MINIMUM-IS-BAND-CONDITIONAL:-THE-imp-33539-FLAT-~200-NODE-GRADED-PLATEAU-MINIMUM-DOES-NOT-HOLD-WHERE-' +
      'THE-imp-33316-<64-ULP-BAND-FAILS.-THE-PEAK-RESOLUTION-WALL-STAYS-FLAT-(RESIDUAL-COLLAPSES-OFF-THE-~e7-SPIKE-' +
      'AT-~200-NODES-AT-ALL-THREE-RUNGS-495/510/596),-BUT-THE-ARITHMETIC-FLOOR-~200-NODES-REACHES-CLIMBS-WITH-DEPTH-' +
      '(~24-ULP-AT-n=495-IN-BAND-->-~61-AT-n=510-BAND-EDGE-->-~65-AT-n=596-BAND-FAILS),-TRACKING-THE-imp-33537/' +
      'imp-33555-DEPTH-GROWING-JITTER-ENVELOPE.-SO-THE-MINIMUM-BUDGET-REACHING-THE-BAND-IS-BAND-CONDITIONAL:-A-CLEAN-' +
      '200-NODES-AT-n=495,-DESTABILISED-TO-~500-NODES-AT-n=510-(FLOOR-HOVERS-AT-THE-BAND-EDGE),-AND-UNDEFINED-AT-n=596-' +
      'WHERE-NO-BUDGET-UP-TO-4000-NODES-REACHES-THE-BAND.-ADDING-NODES-DOES-NOT-RESCUE-THE-DEEP-RUNG-ONCE-THE-ENVELOPE-' +
      'RISES-ABOVE-THE-BAND.-CONFIRMS-imp-33537-<64-BAND-IS-A-COARSE-GRID-ARTIFACT-AND-BOUNDS-THE-imp-33539-FLAT-MINIMUM-' +
      'TO-THE-IN-BAND-RUNGS.-ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-JITTERY-LATTICE-FLOOR;-mass-feasibility-NECESSARY-' +
      'BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33557_BAND_CROSSING_MIN_BUDGET = Object.freeze({
  id: 'imp-33557-band-crossing-min-budget',
  ticket: 'imp-33557',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33539-graded-plateau-deeper-tail-min-budget.js',
  crossValidatesModules: [
    'imp-33539-graded-plateau-deeper-tail-min-budget.js',
    'imp-33537-deep-tail-plateau-spike-recurrence.js',
    'imp-33555-deep-tail-jitter-envelope-growth-law.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'BAND-CROSSING MINIMUM node-budget sweep: does the imp-33539 flat ~200-node graded-plateau minimum HOLD at ' +
    'the imp-33537 band-crossing rungs n in {495,510,596}, where the imp-33316 &lt; 64 ULP deep band FAILS? At each ' +
    'rung the direct A_direct(tau*) = int_0^7 phiKernel(s)phiKernel(s+tau*) ds graded-GL plateau (grade 4) is scored ' +
    'across the imp-33539 node-budget ladder P in {10..400} panels (100..4000 nodes) vs the imp-33213 A_log target, ' +
    'and the smallest budget reaching the &lt; 64 ULP band is located. RESULT: the flat ~200-node minimum does NOT ' +
    'hold where the band fails. The peak-RESOLUTION wall stays flat (residual collapses off the ~e7 spike at ~200 ' +
    'nodes at all three rungs), but the arithmetic FLOOR ~200 nodes reaches CLIMBS with depth (~24 ULP at n=495 in ' +
    'band -> ~61 at n=510 band edge -> ~65 at n=596 band fails), tracking the imp-33537/imp-33555 depth-growing ' +
    'jitter envelope. So the minimum budget reaching the band is BAND-CONDITIONAL: a clean 200 nodes at n=495, ' +
    'destabilised to ~500 nodes at n=510, UNDEFINED at n=596 where NO budget up to 4000 nodes reaches the band -- ' +
    'adding nodes cannot rescue a floor already set by the jitter envelope. VERDICT: FLAT-MINIMUM-IS-BAND-CONDITIONAL. ' +
    'CONFIRMS the imp-33537 &lt; 64 band coarse-grid-artifact reading and BOUNDS the imp-33539 flat minimum to the ' +
    'in-band rungs. ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; jittery lattice ' +
    'floor; operator positivity (imp-3066) untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    rungs: 'BAND-CROSSING deep-tail rungs n in {495,510,596} (imp-33537), tau* = root of n = 4 pi tau* e^{4 tau*}',
    budgetLadder: 'the imp-33539 graded-GL plateau ladder verbatim (grade 4), panels P in {10,15,20,30,50,100,200,400} = 100..4000 nodes',
    scoring: 'residual of A_direct(tau*) vs the imp-33213 log-domain target A_log, in ULP = A_log * 2^-52',
    peakResolutionWall: 'per rung, the smallest budget whose residual has collapsed off the ~e7 unresolved-peak spike',
    floorUlp: 'per rung, the smallest residual reachable at/above the resolution wall (budgets >= 200 nodes) -- the arithmetic floor',
    minInBand: 'per rung, the smallest budget reaching the imp-33316 &lt; 64 ULP band (Infinity when NO budget in the ladder does)',
    selfComputing: 'every rung, every budget, and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    nRungs: Object.freeze(N_RUNGS.slice()),
    panelSweep: Object.freeze(PANEL_SWEEP.slice()),
    grade: GRADE,
    deepFloorBandUlp: DEEP_FLOOR_ULP,
    resolvedNodes: RESOLVED_NODES,
    rungTable: RUNG_TABLE,
    minInBandNodes: Object.freeze(MIN_IN_BAND_NODES.slice()),
    floorUlp: Object.freeze(FLOOR_ULP.slice()),
    peakResolutionWallNodes: Object.freeze(PEAK_WALL_NODES.slice()),
    floorClimbRatio: FLOOR_CLIMB_RATIO,
    shallowestFloorUlp: SHALLOWEST.floorUlp,
    deepestFloorUlp: DEEPEST.floorUlp,
    shallowestMinInBandNodes: SHALLOWEST.minInBandNodes,
    deepestMinInBandNodes: DEEPEST.minInBandNodes,
    bandCrossingCovered,
    peakResolutionWallFlat,
    floorClimbsWithDepth,
    flatMinimumHoldsInBand,
    flatMinimumBreaksAtBandFailure,
    minInBandNotFlat,
    moreNodesDoNotRescueDeepRung,
    verdict,
  }),

  interpretation: Object.freeze({
    peakStillResolvesAt200Nodes:
      'The peak-RESOLUTION wall is flat across all three band-crossing rungs: at 100 nodes every rung sits on the ' +
      '~e7 unresolved-peak spike and by 200 nodes every rung has collapsed off it. So the graded panels ' +
      'a_j = 7 (j/panels)^4 still RESOLVE the sharpening saddle at ~200 nodes even at n=596 -- the imp-33539 ' +
      'resolution behaviour itself is unchanged. What changes is the FLOOR that resolution reaches.',
    floorClimbsAndCrossesTheBand:
      'The smallest residual reachable at/above the ~200-node resolution wall CLIMBS monotonically with depth ' +
      '(~24 ULP at n=495 -> ~61 at n=510 -> ~65 at n=596), tracking the imp-33537/imp-33555 depth-growing jitter ' +
      'envelope, and CROSSES the imp-33316 &lt; 64 ULP band between n=510 and n=596. The floor is set by the ' +
      'arithmetic jitter envelope of A(tau*(n)) at deep saddle tau*, NOT by the quadrature node budget.',
    minimumBudgetIsBandConditional:
      'Because the floor crosses the band, the minimum budget reaching the band is BAND-CONDITIONAL, not the ' +
      'universal flat ~200-node minimum imp-33539 measured in band: a clean 200 nodes at n=495 (in band), ' +
      'destabilised to ~500 nodes at n=510 (the floor hovers at the band edge, snapping in and out with budget), ' +
      'and UNDEFINED at n=596, where NO budget in the ladder up to 4000 nodes reaches the band.',
    addingNodesDoesNotRescue:
      'Once the depth-growing envelope rises above the &lt; 64 band (n &gt;= ~510) adding nodes does NOT rescue the ' +
      'residual: even the imp-33316 FIXED 4000-node plateau is out of band at n=596 (~74 ULP). More nodes only ' +
      'track a floor already above the band -- the opposite of the shallow rungs where 200 nodes suffices.',
    boundsImp33539:
      'This CONFIRMS the imp-33537 reading that the imp-33316 constant &lt; 64 ULP band is a coarse-grid artifact, ' +
      'and BOUNDS the imp-33539 FIXED-BUDGET-WIN-HOLDS flat ~200-node minimum to the in-band rungs: the flat ' +
      'minimum is a real threshold only where the band holds.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Extends the imp-33539 node-budget sweep into the imp-33537 band-crossing rungs n in {495,510,596}, locating ' +
      'the minimum graded budget the A_log floor band requires where the band fails. It changes NO bound, patches ' +
      'NO literal, and establishes NO operator positivity. Grid-design measurement only -- not a certified bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33539/imp-33316/imp-33295/imp-33213; this audits ' +
      'the inner quadrature node budget at the band-crossing rungs, not that truncation.',
    latticeJitterCaveat:
      'The worst/floor ULP is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/imp-33537): ' +
      'the exact per-budget ULP bounces and cross-platform libm exp/pow variation can shift the few-ULP measurements ' +
      '(e.g. the n=510 minimum-in-band budget and the exact ~61/~65 ULP floors). The robust reading is the ' +
      'QUALITATIVE band-conditional structure -- the peak resolves at ~200 nodes flat, the floor climbs with depth, ' +
      'and the minimum budget reaching the band is 200 in band but UNBOUNDED where the band fails -- not the exact ' +
      'per-budget ULP. imp-33537/imp-33556 establish the &lt; 64 band crossing at n &gt;= 510 as solver-invariant.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33557_BAND_CROSSING_MIN_BUDGET_ASSERTIONS = [
  {
    id: 'imp33557-band-crossing-covered',
    why: 'The sweep must run across the imp-33537 band-crossing rungs n in {495,510,596} over the imp-33539 ' +
         'node-budget ladder.',
    holds: () => bandCrossingCovered && RUNG_TABLE.length === N_RUNGS.length && PANEL_SWEEP.length >= 6,
  },
  {
    id: 'imp33557-peak-resolution-wall-flat',
    why: 'The peak-RESOLUTION wall must stay flat: at 100 nodes every rung is on the ~e7 unresolved-peak spike and ' +
         'by 200 nodes every rung has collapsed off it -- the graded panels still resolve the sharpening peak.',
    holds: () => peakResolutionWallFlat,
  },
  {
    id: 'imp33557-floor-climbs-with-depth',
    why: 'THE HEADLINE: the arithmetic floor ~200 nodes reaches must CLIMB with depth (~24 -> ~65 ULP), tracking the ' +
         'imp-33537/imp-33555 depth-growing jitter envelope, so the deepest floor clearly exceeds the shallowest.',
    holds: () => floorClimbsWithDepth && FLOOR_CLIMB_RATIO > 1.6,
  },
  {
    id: 'imp33557-flat-minimum-holds-in-band',
    why: 'Cross-check of imp-33539: at the shallow in-band rung n=495 the flat minimum still HOLDS -- a small finite ' +
         'budget (~200 nodes) reaches the band.',
    holds: () => flatMinimumHoldsInBand && Number.isFinite(SHALLOWEST.minInBandNodes),
  },
  {
    id: 'imp33557-flat-minimum-breaks-where-band-fails',
    why: 'THE HEADLINE: the flat ~200-node minimum does NOT hold where the band fails -- at the deepest rung n=596 ' +
         'NO budget in the ladder (up to 4000 nodes) reaches the band (minInBandNodes is Infinity, floor out of band).',
    holds: () => flatMinimumBreaksAtBandFailure && DEEPEST.minInBandNodes === Infinity,
  },
  {
    id: 'imp33557-minimum-is-band-conditional',
    why: 'The minimum budget reaching the band must be BAND-CONDITIONAL, not flat -- the deepest rung requires a ' +
         'strictly larger (indeed unbounded) budget than the shallow in-band rung.',
    holds: () => minInBandNotFlat && DEEPEST.minInBandNodes > SHALLOWEST.minInBandNodes,
  },
  {
    id: 'imp33557-more-nodes-do-not-rescue-deep-rung',
    why: 'Adding nodes must NOT rescue the deep rung: even the imp-33316 FIXED 4000-node plateau is out of band at ' +
         'n=596 -- more nodes only track a floor already above the band.',
    holds: () => moreNodesDoNotRescueDeepRung && DEEPEST.fixedPlateauInBand === false,
  },
  {
    id: 'imp33557-verdict-records-band-conditional',
    why: 'The classified verdict must record the FLAT-MINIMUM-IS-BAND-CONDITIONAL reading, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33557-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33557_BAND_CROSSING_MIN_BUDGET.honestCaveat;
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

for (const assertion of IMP33557_BAND_CROSSING_MIN_BUDGET_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33557-band-crossing-min-budget assertion failed: ${assertion.id}`);
  }
}
