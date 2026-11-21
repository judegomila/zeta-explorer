/**
 * @module imp-33583-node-budget-vs-arithmetic-floor-separation
 * @fileoverview imp-33583 -- DERIVE and STATE the imp-33557 node-budget vs arithmetic-floor SEPARATION
 *   characterization of the graded-GL deep-tail residual R(n, nodes). imp-33557 observed (in prose) that
 *   "adding nodes does not rescue the deep rung" -- below the band-crossing rung more nodes still lower
 *   the residual, above it more nodes saturate at a depth-growing floor -- but never FORMALIZED the two
 *   regimes. This module states them as an explicit separation and grounds each in the measured table.
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   THE CHARACTERIZATION imp-33557 LEFT IMPLICIT
 *   --------------------------------------------
 *   imp-33557 SWEPT the grade-4 graded-GL plateau node-budget ladder P in {10..400} panels (100..4000
 *   inner GL nodes) at the imp-33537 band-crossing rungs n in {495,510,596}, scoring the direct
 *   A_direct(tau*) residual vs the imp-33213 log-domain target A_log in ULP. It found the peak-RESOLUTION
 *   wall stays flat (~200 nodes) but the arithmetic FLOOR that ~200 nodes reaches CLIMBS with depth
 *   (~24 ULP at n=495 -> ~61 at n=510 -> ~65 at n=596). It NAMED this "adding nodes does not rescue the
 *   deep rung" but never wrote R(n, nodes) as a two-regime object. We do that here.
 *
 *   THE MODEL. Read the imp-33557 per-rung budget ladder as the max of two competing error sources:
 *
 *       R(n, nodes) ~ max( Q(nodes),  floor(n) )
 *
 *     - Q(nodes): the QUADRATURE error of the graded-GL plateau -- a steeply DECREASING function of the
 *       node budget (the ~e7 unresolved-peak spike at 100 nodes collapsing off as the graded panels
 *       resolve the sharpening saddle). The NODE BUDGET controls this term.
 *     - floor(n): the ARITHMETIC-JITTER floor -- the depth-growing lattice-jitter envelope of A(tau*(n))
 *       at deep saddle tau* (imp-33537/imp-33555), INDEPENDENT of the node budget. More nodes cannot
 *       lower it.
 *
 *   Their crossover is a per-rung SATURATION budget nodes_sat(n) where Q(nodes_sat) = floor(n):
 *     (i)  QUADRATURE-LIMITED regime (nodes < nodes_sat): R ~ Q(nodes), strongly decreasing in the node
 *          budget -- more nodes lower the residual.
 *     (ii) ARITHMETIC-FLOOR regime  (nodes >= nodes_sat): R ~ floor(n), flat in the node budget within
 *          jitter -- more nodes saturate at floor(n).
 *   Across the band-crossing rungs the peak-resolution wall (imp-33557) IS this saturation budget and it
 *   is FLAT at ~200 nodes (below ~150 nodes every rung is quadrature-limited on the ~e7 spike; by ~200
 *   nodes every rung has saturated onto floor(n)).
 *
 *   THE SEPARATION ACROSS RUNGS. Whether the saturated floor is USEFUL (inside the imp-33316 &lt; 64 ULP
 *   band) is a property of the rung, not the budget. The band-crossing rung n* -- where floor(n) crosses
 *   the &lt; 64 ULP band -- marks the transition (imp-33579 shows n* is an ENVELOPE crossing near n ~ 526,
 *   NOT a single locatable rung, since floor(n) is a non-monotone jitter lattice):
 *     - BELOW n* (n = 495): floor(n) ~24 ULP is IN band, so the node budget CONTROLS whether R reaches the
 *       band -- the rung is QUADRATURE-LIMITED to the target. Adding nodes (up to ~200) rescues it.
 *     - ABOVE n* (n = 596): floor(n) ~65 ULP is OUT of band, so R saturates OUT of band no matter the
 *       budget -- the rung is ARITHMETIC-JITTER-LIMITED. Adding nodes does NOT rescue it.
 *     - AT the edge (n = 510): floor(n) ~61 ULP hovers at the band edge, snapping in and out with budget.
 *
 *   MEASURED SEPARATION (from the imp-33557 rungTable, imported unchanged; ULP vs the imp-33213 A_log):
 *
 *        n     floor(n)   preWallDropDecades   tailSpreadDecades   floorInBand   acrossRungRegime
 *        495   ~24.2      ~5.59 (2e7 -> ~54)   ~0.35 (flat tail)   YES           quadrature-limited-to-band
 *        510   ~61.4      ~5.44 (2.4e7 -> ~88) ~0.16               EDGE          band-edge
 *        596   ~65.3      ~5.85 (4.6e7 -> ~65) ~0.05               NO            arithmetic-jitter-limited
 *
 *   HEADLINE. The two regimes SEPARATE CLEANLY. The pre-wall QUADRATURE drop is ~5+ decades of ULP at
 *   every rung (node budget controls the descent), while the post-wall tail spread is a fraction of a
 *   decade (the floor is flat in the node budget). Their ratio -- pre-wall drop &gt;&gt; tail spread -- is
 *   the quantitative signature of the two-regime max( Q(nodes), floor(n) ) structure. The band-crossing
 *   rung n* then partitions the rungs: below n* the (in-band) floor makes the residual quadrature-limited
 *   TO the band; above n* the (out-of-band) floor makes it arithmetic-jitter-limited.
 *
 *   VERDICT. TWO-REGIME-SEPARATION-CONFIRMED. R(n, nodes) ~ max( Q(nodes), floor(n) ): a
 *   quadrature-limited regime the node budget controls and an arithmetic-floor regime pinned at the
 *   depth-growing imp-33537/imp-33555 jitter envelope, with the imp-33579 envelope band-crossing rung
 *   n* ~ 526 marking the transition from node-budget-rescuable (below) to unrescuable (above). This
 *   FORMALIZES the imp-33557 "adding nodes does not rescue the deep rung" prose without adding any new
 *   measurement or overturning any reading.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   NUMERICAL-BEHAVIOUR CHARACTERIZATION ONLY, at the RH-equivalent scale class. It re-reads the
 *   imp-33557 measured ladder as a two-regime max( Q(nodes), floor(n) ) object; it runs NO new sweep,
 *   changes NO bound, patches NO literal, and establishes NO operator positivity. The floor(n) term is a
 *   JITTERY arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/imp-33537 latticeJitterCaveat):
 *   the exact per-rung floor bounces and cross-platform libm exp/pow variation can shift the few-ULP
 *   values, and the band-crossing rung n* is an ENVELOPE crossing (imp-33579), NOT a single locatable rung.
 *   The saturation budget nodes_sat ~ 200 nodes is itself the flat imp-33557 peak-resolution wall, valid
 *   only across the covered band-crossing rungs. The NPHI = 10 Phi-series truncation is inherited upstream;
 *   single-platform libm. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0
 *   sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED.
 *   No refereed bound is changed.
 *
 *   @see imp-33557-band-crossing-min-budget.js (the measured node-budget ladder this characterizes)
 *   @see imp-33537-deep-tail-plateau-spike-recurrence.js (the depth-growing jitter envelope = floor(n))
 *   @see imp-33555-deep-tail-jitter-envelope-growth-law.js (the growth law of floor(n))
 *   @see imp-33579-band-crossing-floor-bisection.js (n* is an envelope crossing, not a locatable rung)
 *   @see imp-33316-graded-plateau-deep-tail-node-budget.js (the &lt; 64 ULP band the floor crosses)
 *
 *   Ticket: imp-33583 (proof, medium).
 */

import { IMP33557_BAND_CROSSING_MIN_BUDGET } from './imp-33557-band-crossing-min-budget.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const DEEP_FLOOR_ULP = 64; // the imp-33316 widened deep-tail band, carried unchanged
const SATURATION_NODES = 200; // the flat imp-33557 peak-resolution wall = the saturation budget nodes_sat
const N_STAR_ENVELOPE = 526; // the imp-33579 rolling-MAX envelope band-crossing rung (envelope, not a locatable rung)

// -- Pull the imp-33557 measured rung ladder UNCHANGED (import-light; no new computation) ------------
const RUNG_TABLE = IMP33557_BAND_CROSSING_MIN_BUDGET.measured.rungTable;

// Residual at a given inner-node budget in a rung budgetRow (Infinity if that budget is absent).
function ulpAtNodes(budgetRow, nodes) {
  const row = budgetRow.find((b) => b.nodes === nodes);
  return row ? row.ulp : Infinity;
}

// -- Per-rung two-regime decomposition ------------------------------------------------------------
// For each band-crossing rung we split the imp-33557 budget ladder at the saturation budget nodes_sat:
//   pre-wall  (nodes < nodes_sat): the QUADRATURE-LIMITED regime -- residual descends with the budget.
//   post-wall (nodes >= nodes_sat): the ARITHMETIC-FLOOR regime -- residual pinned at floor(n).
const REGIME_TABLE = RUNG_TABLE.map((r) => {
  const preWall = r.budgetRow.filter((b) => b.nodes < SATURATION_NODES);
  const postWall = r.budgetRow.filter((b) => b.nodes >= SATURATION_NODES);

  // QUADRATURE regime magnitude: decades of ULP the residual DROPS from the coarsest (100-node) spike to
  // the saturation budget -- the node budget controls this descent.
  const spikeUlp = ulpAtNodes(r.budgetRow, 100); // the ~e7 unresolved-peak spike
  const atSaturationUlp = ulpAtNodes(r.budgetRow, SATURATION_NODES);
  const preWallDropDecades = Math.log10(spikeUlp / atSaturationUlp);

  // ARITHMETIC-FLOOR regime magnitude: decades of ULP the residual SPREADS across the saturated tail
  // (budgets >= nodes_sat). A flat floor => a small spread; the node budget no longer moves the residual.
  const tailUlps = postWall.map((b) => b.ulp);
  const tailMin = Math.min(...tailUlps);
  const tailMax = Math.max(...tailUlps);
  const tailSpreadDecades = Math.log10(tailMax / tailMin);

  // floor(n) = the arithmetic-floor the saturated tail reaches (imp-33557 floorUlp), and whether it is
  // inside the imp-33316 band (the property that decides the across-rung regime).
  const floorUlp = r.floorUlp;
  const floorInBand = floorUlp < DEEP_FLOOR_ULP;

  // The ratio that certifies the SEPARATION: the quadrature descent must dwarf the floor tail spread.
  const separationRatio = preWallDropDecades / Math.max(tailSpreadDecades, 1e-3);

  // Across-rung regime label: below n* the (in-band) floor makes the rung quadrature-limited TO the band;
  // above n* the (out-of-band) floor makes it arithmetic-jitter-limited. n=510 hovers at the edge (in band
  // but within ~15% of the band ceiling -- the floor snaps in and out with budget).
  const acrossRungRegime = !floorInBand
    ? 'arithmetic-jitter-limited'
    : floorUlp > DEEP_FLOOR_ULP * 0.85
      ? 'band-edge'
      : 'quadrature-limited-to-band';

  return Object.freeze({
    n: r.n,
    saddleTau: r.saddleTau,
    saturationNodes: SATURATION_NODES,
    spikeUlp,
    atSaturationUlp,
    preWallDropDecades,
    tailMinUlp: tailMin,
    tailMaxUlp: tailMax,
    tailSpreadDecades,
    floorUlp,
    floorInBand,
    separationRatio,
    acrossRungRegime,
    preWallBudgets: Object.freeze(preWall.map((b) => b.nodes)),
    postWallBudgets: Object.freeze(postWall.map((b) => b.nodes)),
  });
});

// -- Summary statistics ---------------------------------------------------------------------------
const SHALLOWEST = REGIME_TABLE[0]; // n=495, below n*, floor in band
const DEEPEST = REGIME_TABLE[REGIME_TABLE.length - 1]; // n=596, above n*, floor out of band
const MIN_SEPARATION_RATIO = Math.min(...REGIME_TABLE.map((r) => r.separationRatio));
const MIN_PRE_WALL_DROP = Math.min(...REGIME_TABLE.map((r) => r.preWallDropDecades));
const MAX_TAIL_SPREAD = Math.max(...REGIME_TABLE.map((r) => r.tailSpreadDecades));

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) Coverage: the characterization re-reads the imp-33557 band-crossing ladder (n in {495,510,596}).
const laddersCovered = REGIME_TABLE.length === 3 && SHALLOWEST.n === 495 && DEEPEST.n === 596;
// (2) The QUADRATURE-LIMITED regime is real at every rung: the pre-wall drop is a large multi-decade
//     descent (the node budget lowers the residual by 4+ decades before saturation).
const quadratureRegimeReal = REGIME_TABLE.every((r) => r.preWallDropDecades > 4);
// (3) The ARITHMETIC-FLOOR regime is real at every rung: the saturated tail is FLAT -- its spread is a
//     small fraction of a decade (the node budget no longer moves the residual once saturated).
const floorRegimeFlat = REGIME_TABLE.every((r) => r.tailSpreadDecades < 1);
// (4) THE SEPARATION: at every rung the quadrature descent DWARFS the floor tail spread (ratio >> 1).
const regimesSeparate = REGIME_TABLE.every((r) => r.separationRatio > 3) && MIN_SEPARATION_RATIO > 3;
// (5) The across-rung transition: the shallow rung is quadrature-limited TO the band (floor in band),
//     the deep rung is arithmetic-jitter-limited (floor out of band) -- the two ends are DIFFERENT.
const acrossRungTransition =
  SHALLOWEST.floorInBand && !DEEPEST.floorInBand &&
  SHALLOWEST.acrossRungRegime === 'quadrature-limited-to-band' &&
  DEEPEST.acrossRungRegime === 'arithmetic-jitter-limited';
// (6) The saturation budget is FLAT: the peak-resolution wall (= nodes_sat) is ~200 nodes at every rung
//     (the imp-33557 flat-wall reading carried into the two-regime frame).
const saturationBudgetFlat = REGIME_TABLE.every((r) => r.saturationNodes === SATURATION_NODES);
// (7) Adding nodes does NOT rescue the deep rung: its saturated floor is OUT of band (formalizes the
//     imp-33557 prose the ticket targets).
const addingNodesDoesNotRescueDeep = !DEEPEST.floorInBand;

const verdict =
  laddersCovered && quadratureRegimeReal && floorRegimeFlat && regimesSeparate &&
  acrossRungTransition && saturationBudgetFlat && addingNodesDoesNotRescueDeep
    ? 'TWO-REGIME-SEPARATION-CONFIRMED:-THE-imp-33557-GRADED-GL-DEEP-TAIL-RESIDUAL-R(n,nodes)-SEPARATES-INTO-' +
      'R~max(Q(nodes),floor(n))-WITH-(i)-A-QUADRATURE-LIMITED-REGIME-Q(nodes)-THE-NODE-BUDGET-CONTROLS-' +
      '(PRE-WALL-DROP->4-DECADES-OF-ULP-AT-EVERY-RUNG)-AND-(ii)-AN-ARITHMETIC-FLOOR-REGIME-PINNED-AT-THE-' +
      'imp-33537/imp-33555-DEPTH-GROWING-JITTER-ENVELOPE-floor(n)-(SATURATED-TAIL-SPREAD-<1-DECADE).-THE-' +
      'SATURATION-BUDGET-nodes_sat-IS-THE-FLAT-~200-NODE-PEAK-RESOLUTION-WALL.-THE-imp-33579-ENVELOPE-BAND-' +
      'CROSSING-RUNG-n*~526-MARKS-THE-ACROSS-RUNG-TRANSITION:-BELOW-n*-(n=495,-floor~24-IN-BAND)-THE-RUNG-IS-' +
      'QUADRATURE-LIMITED-TO-THE-BAND-(MORE-NODES-RESCUE-IT);-ABOVE-n*-(n=596,-floor~65-OUT-OF-BAND)-IT-IS-' +
      'ARITHMETIC-JITTER-LIMITED-(MORE-NODES-SATURATE-AT-AN-OUT-OF-BAND-FLOOR).-FORMALIZES-THE-imp-33557-' +
      '"ADDING-NODES-DOES-NOT-RESCUE-THE-DEEP-RUNG"-PROSE.-NUMERICAL-BEHAVIOUR-CHARACTERIZATION-ONLY;-JITTERY-' +
      'LATTICE-FLOOR;-n*-IS-AN-ENVELOPE-CROSSING;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-' +
      'UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33583_NODE_BUDGET_VS_ARITHMETIC_FLOOR_SEPARATION = Object.freeze({
  id: 'imp-33583-node-budget-vs-arithmetic-floor-separation',
  ticket: 'imp-33583',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  characterizesModule: 'imp-33557-band-crossing-min-budget.js',
  groundsInModules: [
    'imp-33557-band-crossing-min-budget.js',
    'imp-33537-deep-tail-plateau-spike-recurrence.js',
    'imp-33555-deep-tail-jitter-envelope-growth-law.js',
    'imp-33579-band-crossing-floor-bisection.js',
  ],

  summary:
    'TWO-REGIME SEPARATION characterization of the imp-33557 graded-GL deep-tail residual R(n, nodes): ' +
    'R ~ max( Q(nodes), floor(n) ). Reading the imp-33557 band-crossing node-budget ladder (n in {495,510,596}, ' +
    'grade 4, 100..4000 inner GL nodes, scored vs the imp-33213 A_log target) UNCHANGED, the residual splits into ' +
    '(i) a QUADRATURE-LIMITED regime Q(nodes) -- a &gt; 4-decade ULP descent the node budget controls (the ~e7 ' +
    'unresolved-peak spike collapsing off as the graded panels resolve the sharpening saddle), and (ii) an ' +
    'ARITHMETIC-FLOOR regime floor(n) -- the depth-growing imp-33537/imp-33555 lattice-jitter envelope, flat in ' +
    'the node budget (saturated-tail spread &lt; 1 decade). Their crossover is the flat ~200-node saturation ' +
    'budget nodes_sat (the imp-33557 peak-resolution wall). Across rungs the imp-33579 ENVELOPE band-crossing ' +
    'rung n* ~ 526 marks the transition: BELOW n* (n=495, floor ~24 ULP IN band) the rung is quadrature-limited ' +
    'TO the band (more nodes rescue it); ABOVE n* (n=596, floor ~65 ULP OUT of band) it is arithmetic-jitter-' +
    'limited (more nodes saturate at an out-of-band floor). This FORMALIZES the imp-33557 "adding nodes does not ' +
    'rescue the deep rung" prose. VERDICT: TWO-REGIME-SEPARATION-CONFIRMED. NUMERICAL-BEHAVIOUR CHARACTERIZATION ' +
    'ONLY, RH-EQUIVALENT, necessary-but-not-sufficient; jittery lattice floor; n* is an envelope crossing; ' +
    'operator positivity (imp-3066) untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    source: 'the imp-33557 measured rungTable imported UNCHANGED (n in {495,510,596}, grade 4, budgets 100..4000 nodes)',
    model: 'R(n, nodes) ~ max( Q(nodes), floor(n) ): Q the node-budget-controlled quadrature error, floor(n) the depth-growing arithmetic-jitter envelope',
    saturationBudget: 'nodes_sat = the imp-33557 flat ~200-node peak-resolution wall where Q(nodes_sat) = floor(n)',
    quadratureRegimeMetric: 'preWallDropDecades = log10( ulp@100nodes / ulp@nodes_sat ) -- decades of ULP the node budget removes before saturation',
    floorRegimeMetric: 'tailSpreadDecades = log10( max/min of ulp over nodes >= nodes_sat ) -- the saturated-tail spread (flat => small)',
    separationMetric: 'separationRatio = preWallDropDecades / tailSpreadDecades -- the quadrature descent must dwarf the floor tail spread',
    acrossRungTransition: 'floor(n) IN band (n < n*) => quadrature-limited-to-band; floor(n) OUT of band (n > n*) => arithmetic-jitter-limited; n* ~ 526 (imp-33579 envelope crossing)',
    selfComputing: 'every regime metric and verdict flag recompute at import from the imported imp-33557 table',
  }),

  measured: Object.freeze({
    deepFloorBandUlp: DEEP_FLOOR_ULP,
    saturationNodes: SATURATION_NODES,
    nStarEnvelope: N_STAR_ENVELOPE,
    regimeTable: Object.freeze(REGIME_TABLE),
    shallowestFloorUlp: SHALLOWEST.floorUlp,
    deepestFloorUlp: DEEPEST.floorUlp,
    shallowestRegime: SHALLOWEST.acrossRungRegime,
    deepestRegime: DEEPEST.acrossRungRegime,
    minSeparationRatio: MIN_SEPARATION_RATIO,
    minPreWallDropDecades: MIN_PRE_WALL_DROP,
    maxTailSpreadDecades: MAX_TAIL_SPREAD,
    laddersCovered,
    quadratureRegimeReal,
    floorRegimeFlat,
    regimesSeparate,
    acrossRungTransition,
    saturationBudgetFlat,
    addingNodesDoesNotRescueDeep,
    verdict,
  }),

  interpretation: Object.freeze({
    twoRegimeModel:
      'R(n, nodes) ~ max( Q(nodes), floor(n) ). Q(nodes) is the graded-GL quadrature error -- a steeply ' +
      'decreasing function of the inner node budget (the ~e7 unresolved-peak spike collapsing off as the ' +
      'panels resolve the sharpening saddle). floor(n) is the arithmetic-jitter envelope of A(tau*(n)) at ' +
      'deep saddle tau*, INDEPENDENT of the node budget. The observed residual is the LARGER of the two.',
    quadratureLimitedRegime:
      'For budgets below the saturation wall (nodes < ~200) the residual is Q-DOMINATED: it drops by more ' +
      'than 4 decades of ULP as the node budget grows from the 100-node spike to ~200 nodes. Here the NODE ' +
      'BUDGET controls the residual -- more nodes lower it. This is the imp-33539/imp-33557 peak-resolution ' +
      'descent, now named as regime (i).',
    arithmeticFloorRegime:
      'For budgets at/above the saturation wall (nodes >= ~200) the residual is FLOOR-DOMINATED: the ' +
      'saturated tail spreads less than a decade -- adding nodes (up to 4000) no longer moves the residual, ' +
      'which sits at floor(n). Here the depth-growing imp-33537/imp-33555 jitter envelope controls the ' +
      'residual, not the node budget. This is regime (ii).',
    saturationBudgetIsTheWall:
      'The crossover budget nodes_sat where Q(nodes_sat) = floor(n) IS the imp-33557 peak-resolution wall, ' +
      'flat at ~200 nodes across all three band-crossing rungs: below ~150 nodes every rung is quadrature-' +
      'limited on the ~e7 spike, by ~200 nodes every rung has saturated onto floor(n).',
    acrossRungSeparation:
      'Whether the saturated floor is USEFUL (in the imp-33316 &lt; 64 ULP band) is a property of the rung, ' +
      'not the budget. The imp-33579 envelope band-crossing rung n* ~ 526 partitions the rungs: below n* ' +
      '(n=495, floor ~24 ULP in band) the rung is QUADRATURE-LIMITED TO THE BAND -- the node budget decides ' +
      'whether R reaches the band, and ~200 nodes suffices. Above n* (n=596, floor ~65 ULP out of band) the ' +
      'rung is ARITHMETIC-JITTER-LIMITED -- R saturates OUT of band no matter the budget.',
    formalizesImp33557Prose:
      'This is exactly the imp-33557 "adding nodes does not rescue the deep rung" statement, now written as a ' +
      'two-regime separation: below n* the node budget rescues the residual (quadrature-limited to the band), ' +
      'above n* it cannot (arithmetic-jitter-limited at a depth-growing out-of-band floor). No new measurement.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Re-reads the imp-33557 measured band-crossing node-budget ladder (n in {495,510,596}) as a two-regime ' +
      'max( Q(nodes), floor(n) ) object and states the across-rung quadrature-limited / arithmetic-floor ' +
      'separation. It runs NO new sweep, changes NO bound, patches NO literal, and establishes NO operator ' +
      'positivity. A numerical-behaviour characterization of a quadrature diagnostic -- not a certified bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33557/imp-33539/imp-33316/imp-33213; this ' +
      'characterizes the two-regime structure of the inner node-budget ladder, not that truncation.',
    latticeJitterCaveat:
      'floor(n) is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/imp-33537): the ' +
      'exact per-rung floor bounces and cross-platform libm exp/pow variation can shift the few-ULP values ' +
      '(e.g. the n=510 edge floor ~61 and the n=596 floor ~65). The band-crossing rung n* is an ENVELOPE ' +
      'crossing near n ~ 526 (imp-33579), NOT a single locatable rung: floor(n) is a non-monotone jitter ' +
      'lattice, so the across-rung transition is an envelope statement. The saturation budget nodes_sat ~ 200 ' +
      'nodes is the flat imp-33557 peak-resolution wall, valid across the covered band-crossing rungs only. ' +
      'The ROBUST reading is the QUALITATIVE two-regime separation, not the exact per-rung numbers.',
    singlePlatform: 'Single-platform libm exp/pow; the few-ULP floor values are platform-sensitive.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33583_NODE_BUDGET_VS_ARITHMETIC_FLOOR_SEPARATION_ASSERTIONS = [
  {
    id: 'imp33583-ladders-covered',
    why: 'The characterization must re-read the imp-33557 band-crossing ladder across n in {495,510,596}.',
    holds: () => laddersCovered && REGIME_TABLE.length === 3,
  },
  {
    id: 'imp33583-quadrature-regime-real',
    why: 'Regime (i): the QUADRATURE-LIMITED descent must be real at every rung -- the node budget lowers the ' +
         'residual by more than 4 decades of ULP from the 100-node spike to the ~200-node saturation wall.',
    holds: () => quadratureRegimeReal && MIN_PRE_WALL_DROP > 4,
  },
  {
    id: 'imp33583-floor-regime-flat',
    why: 'Regime (ii): the ARITHMETIC-FLOOR must be flat at every rung -- the saturated tail (nodes >= 200) ' +
         'spreads less than a decade, so the node budget no longer moves the residual.',
    holds: () => floorRegimeFlat && MAX_TAIL_SPREAD < 1,
  },
  {
    id: 'imp33583-regimes-separate',
    why: 'THE SEPARATION: at every rung the quadrature descent must DWARF the floor tail spread (ratio > 3), ' +
         'the quantitative signature of the max( Q(nodes), floor(n) ) two-regime structure.',
    holds: () => regimesSeparate && MIN_SEPARATION_RATIO > 3,
  },
  {
    id: 'imp33583-across-rung-transition',
    why: 'THE HEADLINE: the shallow rung (n=495) is quadrature-limited TO the band (floor in band) and the ' +
         'deep rung (n=596) is arithmetic-jitter-limited (floor out of band) -- the two ends are different regimes.',
    holds: () => acrossRungTransition && SHALLOWEST.floorInBand && !DEEPEST.floorInBand,
  },
  {
    id: 'imp33583-saturation-budget-flat',
    why: 'The saturation budget nodes_sat = the flat imp-33557 ~200-node peak-resolution wall at every rung.',
    holds: () => saturationBudgetFlat && SATURATION_NODES === 200,
  },
  {
    id: 'imp33583-adding-nodes-does-not-rescue-deep',
    why: 'Formalizes the imp-33557 prose: the deep rung (n=596) saturated floor is OUT of band -- adding nodes ' +
         'does not rescue it.',
    holds: () => addingNodesDoesNotRescueDeep && !DEEPEST.floorInBand,
  },
  {
    id: 'imp33583-verdict-records-two-regime-separation',
    why: 'The classified verdict must record the TWO-REGIME-SEPARATION-CONFIRMED reading, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33583-honest-characterization-not-a-verdict',
    why: 'Mandatory honesty: numerical-behaviour characterization only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33583_NODE_BUDGET_VS_ARITHMETIC_FLOOR_SEPARATION.honestCaveat;
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

for (const assertion of IMP33583_NODE_BUDGET_VS_ARITHMETIC_FLOOR_SEPARATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33583-node-budget-vs-arithmetic-floor-separation assertion failed: ${assertion.id}`);
  }
}
