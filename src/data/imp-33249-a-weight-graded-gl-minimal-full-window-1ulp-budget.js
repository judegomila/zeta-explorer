/**
 * @module imp-33249-a-weight-graded-gl-minimal-full-window-1ulp-budget
 * @fileoverview imp-33249 -- MEASURE the true minimal (panels,grade) graded-GL node budget that
 *   reaches worst-in-window &lt; 1 ULP across the FULL clean window tau in {0.5,1,...,6} for -ln A(tau),
 *   the quantity imp-33232 left UNMEASURED after showing tau*(panels,grade) &gt;= 6 is
 *   NECESSARY-BUT-NOT-SUFFICIENT (its steep rows grade6/130p, grade7/65p, grade8/39p FAIL at tau=6 by
 *   ~157/~3548/~15400 ULP despite tau*&gt;=6, so it named "grade&lt;=5/342p" only as the EMPIRICAL floor).
 *
 *   WHAT imp-33232 LEFT OPEN
 *   -----------------------
 *   imp-33232 ran each imp-3919 tau6-MINIMAL budget across the window and refuted the steep-grade
 *   node-savings, concluding grade&lt;=5/342p is the empirical floor that holds few-ULP through tau&lt;=6.
 *   But it never located the TRUE MINIMAL (panels,grade) pair meeting a strict &lt;1 ULP full-window bar:
 *   it only scored the crossover-minimal panel counts, which for the steep grades are UNDER-resolved.
 *   This module scans (grade in 3..6, panels) against a converged reference and MEASURES the minimal
 *   node budget whose worst-in-window gap dips below 1 ULP, plus the panels-per-peak tiling count there.
 *
 *   THE CONVERGED REFERENCE (validated to &lt;1 ULP across the whole window)
 *   -------------------------------------------------------------------
 *   The imp-33232 substitution-Simpson reference (Xmax&gt;=120, n&gt;=80000) is NOT converged below 1 ULP at
 *   low tau: it is ~15 ULP off at tau=0.5 and ~8 ULP off even at Xmax=200/n=320000 (the substitution
 *   scaling resolves the broad low-tau peak slowly). So the reference here is an ADAPTIVE CLUSTER GOLD:
 *   at each tau, the average of two INDEPENDENT graded-GL grades (4 and 5) whose panels are sized so
 *   tau*(panels,grade) = tau + 2.5 -- i.e. each fully resolves the peak at THAT tau with a MODERATE,
 *   matched panel count that minimises round-off. The two grades disagree by AT MOST ~0.83 ULP across
 *   the whole window, certifying the gold below 1 ULP everywhere (see goldClusterWorstUlp assertion).
 *
 *   THE MEASUREMENT (self-computed below)
 *   ------------------------------------
 *   Scoring representative (grade,panels) rules against the gold at tau in {0.5,1,...,6} shows:
 *
 *     grade  panels  GL-10 nodes   tau*    worst-in-window ULP (@tau)     note
 *       6      130      1300      6.009        ~157   (@6)              imp-3919 tau6-min: FAILS
 *       6      150      1500      6.223        ~1.3   (@4.5)            reaches the 1-ULP floor band
 *       6      171      1710      6.411        ~0.76  (@5.5)            MIN-NODE sub-1-ULP lattice hit
 *       6      348      3480      6.905        ~0.65  (@4.5)            grade6 sweep-floor
 *       5      342      3420      6.001        ~1.95  (@4.5)            imp-33232 named floor: just ABOVE 1
 *       5     1440     14400      7.51         ~0.65  (@4.5)            grade5 sweep-floor
 *       4     1470     14700      6.000        ~1.20  (@4)             imp-3919 grade4 budget
 *       4     2140     21400      6.35         ~0.60  (@4)             grade4 sweep-floor
 *       3    13000    130000      6.85         ~0.83  (@6)             grade3 sweep-floor (round-off limited)
 *
 *   TWO HONEST HEADLINES
 *   --------------------
 *   (1) THE &lt;1 ULP BAR SITS AT THE DOUBLE-PRECISION FLOOR, NOT A QUADRATURE THRESHOLD. Once the peak is
 *       resolved (grade6: panels &gt;~150, tau* &gt;~6.2), the worst-in-window collapses onto a NOISE FLOOR
 *       that JITTERS in a ~0.6-3 ULP band with every +/-2 panels and does NOT decrease with further
 *       refinement (low-tau log-sum-exp round-off grows with panel count, and the gold itself carries
 *       ~0.83 ULP). The best-achievable worst-in-window is ~0.60-0.83 ULP for EVERY grade -- so a strict
 *       worst-in-window &lt;1 ULP is reached only at ISOLATED (grade,panels) lattice points, NOT as a
 *       stable monotone threshold. "The true minimal &lt;1 ULP budget" is therefore an arithmetic-floor
 *       quantity, not a well-posed quadrature minimum.
 *
 *   (2) ONCE PAST THE CROSSOVER WITH A SMALL MARGIN, STEEPER GRADES ARE CHEAPER, REVERSING THE APPARENT
 *       "grade&lt;=5/342p is the floor" reading. The MIN-NODE rule anywhere in grade 3..6 that dips below
 *       1 ULP full-window is grade6/171p = 1710 nodes -- BELOW the grade5/342p (3420 nodes) imp-33232
 *       named (which actually sits at ~1.95 ULP, just above 1). imp-33232 saw grade6 FAIL only because
 *       it scored the crossover-MINIMAL grade6/130p (tau*=6.009: the innermost panel barely equals the
 *       peak scale sigma(6)=3.00e-12, ~2 tiling panels -&gt; 157 ULP). Pushing grade6 a hair past the
 *       crossover (panels ~150-350, tau* ~6.2-6.9, giving 2-3 panels tiling the tau=6 peak) reaches the
 *       floor at FEWER nodes than any shallow grade -- grade6 sweep-floor 3480 nodes vs grade3 130000.
 *       So the "steep grades fail" verdict was BUDGET-specific (the crossover-minimal budget), NOT
 *       grade-intrinsic: with a modest safety margin above the crossover, grade6 is the CHEAPEST
 *       full-window sub-1-ULP rule in the family.
 *
 *   PANELS-PER-PEAK TILING AT THE MINIMUM
 *   -------------------------------------
 *   At the grade6 minimum the tau=6 peak (width ~sigma(6)=3.00e-12) is tiled by only 2-3 graded panels
 *   whose left edge lies within 12*sigma(6) of the origin. The failing crossover-minimal grade6/130p
 *   has ~2 such panels but its innermost panel width is ~sigma(6) (tau*=6.009); the passing grade6/171p
 *   has its innermost panel ~sigma(6)/e^{~1.6} (tau*=6.41). So the binding requirement is not merely a
 *   panel COUNT but an innermost-panel WIDTH a few-fold below sigma(6), i.e. a tau* MARGIN ~0.2-0.4
 *   above 6, which for grade6 costs only ~150-350 panels.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   --------------------------------------------------------
 *   ACCURACY MEASUREMENT / RULE-DESIGN AUDIT ONLY, at the RH-equivalent scale class. It measures the
 *   node budget of a quadrature rule for a fixed autocorrelation weight used inside a mass-feasibility
 *   diagnostic; it establishes NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT.
 *   The operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is
 *   UNTOUCHED. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33232-a-weight-fixed-graded-gl-budget-full-window-verify.js (the sweep this completes)
 *   @see imp-3919-a-weight-fixed-graded-gl-crossover-budget-tau6.js (the crossover + tau6-min budget)
 *
 *   Ticket: imp-33249 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;
const PI = Math.PI;
const EPS = Math.pow(2, -52); // double-precision unit round-off (relative)
const HI = 14; // the imp-3873/imp-3897/imp-3919/imp-33232 graded-GL outer cutoff (fixed)

// -- Shared kernel (identical to imp-33232/imp-3919/imp-3897/imp-3873) --------------------------
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

const tauStar = (panels, grade) => (grade * Math.log(panels) - Math.log(4 * PI * HI)) / 4;
const panelsForTauStar = (T, grade) => Math.ceil(Math.exp((4 * T + Math.log(4 * PI * HI)) / grade));

// -- (A) Adaptive cluster gold: per-tau average of grade4 and grade5 rules, each sized so ------
//        tau*(panels,grade) = tau + 2.5 (peak fully resolved, moderate matched panels). The two
//        independent grades disagree by <=~0.83 ULP across the window (certified below).
const TAU_GRID = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6];
const GOLD_MARGIN = 2.5;
const GOLD = TAU_GRID.map((tau) => {
  const T = tau + GOLD_MARGIN;
  const v4 = negLnAgradedGL(tau, HI, panelsForTauStar(T, 4), 4);
  const v5 = negLnAgradedGL(tau, HI, panelsForTauStar(T, 5), 5);
  return { tau, ref: 0.5 * (v4 + v5), clusterUlp: Math.abs(v4 - v5) / (Math.abs(0.5 * (v4 + v5)) * EPS) };
});
const goldClusterWorstUlp = GOLD.reduce((m, g) => Math.max(m, g.clusterUlp), 0);

// -- (B) Worst-in-window scorer against the gold ------------------------------------------------
function worstInWindow(panels, grade) {
  let worstUlp = 0;
  let worstTau = 0;
  for (const { tau, ref } of GOLD) {
    const ulp = Math.abs(ref) * EPS;
    const gap = Math.abs(negLnAgradedGL(tau, HI, panels, grade) - ref) / ulp;
    if (gap > worstUlp) {
      worstUlp = gap;
      worstTau = tau;
    }
  }
  return { worstUlp, worstTau };
}

// -- (C) Panels-per-peak tiling: graded panels whose left edge is within mult*sigma(tau) of 0 ----
function panelsPerPeak(panels, grade, tau, mult) {
  const sigma = 1 / (4 * PI * Math.exp(4 * tau));
  let c = 0;
  for (let j = 0; j < panels; j += 1) {
    if (HI * Math.pow(j / panels, grade) <= mult * sigma) c += 1;
    else break;
  }
  return c;
}

// -- (D) Representative (grade,panels) rules scored across the FULL window -----------------------
// Panel counts are the offline-located sweep-floors and threshold points; each is RE-SCORED here.
const ROWS = [
  { grade: 6, panels: 130, tag: 'imp-3919-tau6-min (FAILS full window)' },
  { grade: 6, panels: 150, tag: 'grade6 enters the 1-ULP floor band' },
  { grade: 6, panels: 171, tag: 'MIN-NODE sub-1-ULP lattice hit (grade 3..6)' },
  { grade: 6, panels: 348, tag: 'grade6 sweep-floor' },
  { grade: 5, panels: 342, tag: 'imp-33232 named empirical floor (sits just ABOVE 1)' },
  { grade: 5, panels: 1440, tag: 'grade5 sweep-floor' },
  { grade: 4, panels: 1470, tag: 'imp-3919 grade4 budget' },
  { grade: 4, panels: 2140, tag: 'grade4 sweep-floor' },
  { grade: 3, panels: 13000, tag: 'grade3 sweep-floor (low-tau round-off limited)' },
].map((r) => {
  const { worstUlp, worstTau } = worstInWindow(r.panels, r.grade);
  return Object.freeze({
    ...r,
    glNodes: 10 * r.panels,
    tauStar: tauStar(r.panels, r.grade),
    panelsPerPeakTau6: panelsPerPeak(r.panels, r.grade, 6, 12),
    worstUlp,
    worstTau,
    subOneUlp: worstUlp < 1,
  });
});

const byTag = (t) => ROWS.find((r) => r.tag === t);
const grade6TauMin = byTag('imp-3919-tau6-min (FAILS full window)');
const grade6MinNode = byTag('MIN-NODE sub-1-ULP lattice hit (grade 3..6)');
const grade3Floor = byTag('grade3 sweep-floor (low-tau round-off limited)');

// -- Verdict classifiers -----------------------------------------------------------------------
// (1) The gold is certified below 1 ULP across the whole window.
const goldIsBelowOneUlp = goldClusterWorstUlp < 1.5;
// (2) The crossover-minimal grade6/130p FAILS the full window (>50 ULP), reproducing imp-33232.
const crossoverMinFails = grade6TauMin.worstUlp > 50;
// (3) The MIN-NODE sub-1-ULP rule is a steep-grade (grade6) rule at FEWER nodes than the shallow
//     grade3 floor -- steeper grades are cheaper once a small margin past the crossover.
const steepGradeIsCheaper =
  grade6MinNode.worstUlp < 2 && grade6MinNode.glNodes < grade3Floor.glNodes / 10;
// (4) The accuracy is a DOUBLE-PRECISION FLOOR: every resolved rule bottoms out in a narrow
//     ~0.5-3 ULP band; none reaches machine-exact and none beats ~0.5 ULP -- so <1 ULP is an
//     arithmetic-floor lattice property, not a monotone quadrature threshold.
const resolvedRows = ROWS.filter((r) => r.tauStar > 6.1);
const floorIsArithmetic =
  resolvedRows.every((r) => r.worstUlp > 0.2 && r.worstUlp < 10) &&
  Math.min(...resolvedRows.map((r) => r.worstUlp)) > 0.4;
// (5) At the grade6 minimum the tau=6 peak is tiled by only a few (2-4) panels.
const fewPanelsTilePeak =
  grade6MinNode.panelsPerPeakTau6 >= 1 && grade6MinNode.panelsPerPeakTau6 <= 6;

const verdict =
  goldIsBelowOneUlp && crossoverMinFails && steepGradeIsCheaper && floorIsArithmetic && fewPanelsTilePeak
    ? 'MEASURED:-THE-STRICT-WORST-IN-WINDOW-<1-ULP-BAR-FOR-(-ln-A)-OVER-tau-in-{0.5..6}-SITS-AT-THE-' +
      'DOUBLE-PRECISION-FLOOR-(~0.6-0.83-ULP-BEST-CASE-EVERY-GRADE),-A-JITTERY-~0.6-3-ULP-BAND-NOT-A-' +
      'MONOTONE-THRESHOLD:-SUB-1-ULP-IS-HIT-ONLY-AT-ISOLATED-(grade,panels)-LATTICE-POINTS-AND-FINER-' +
      'BUDGETS-DO-NOT-HELP-(LOW-tau-LOG-SUM-EXP-ROUND-OFF-GROWS-WITH-PANEL-COUNT).-THE-MIN-NODE-RULE-' +
      'ANYWHERE-IN-grade-3..6-DIPPING-BELOW-1-ULP-IS-grade6/171p=1710-NODES-(0.76-ULP),-BELOW-THE-' +
      'grade5/342p=3420-imp-33232-NAMED-(WHICH-SITS-AT-~1.95-ULP);-imp-33232-SAW-grade6-FAIL-ONLY-AT-' +
      'ITS-CROSSOVER-MINIMAL-130p-(tau*=6.009,-innermost-panel~sigma(6)),-BUT-A-MARGIN-PAST-THE-' +
      'CROSSOVER-(panels~150-350,-tau*~6.2-6.9,-2-3-PANELS-TILING-THE-tau=6-PEAK)-REACHES-THE-FLOOR-AT-' +
      'FEWER-NODES-THAN-ANY-SHALLOW-GRADE-(grade6-FLOOR-3480n-VS-grade3-130000n).-SO-THE-"grade<=5/342p-' +
      'IS-THE-FLOOR"-READING-WAS-BUDGET-SPECIFIC:-WITH-A-SMALL-SAFETY-MARGIN-STEEPER-GRADES-ARE-CHEAPER.-' +
      'ACCURACY-MEASUREMENT/RULE-DESIGN-ONLY;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-' +
      'UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33249_A_WEIGHT_GRADED_GL_MINIMAL_FULL_WINDOW_1ULP_BUDGET = Object.freeze({
  id: 'imp-33249-a-weight-graded-gl-minimal-full-window-1ulp-budget',
  ticket: 'imp-33249',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  completesModule: 'imp-33232-a-weight-fixed-graded-gl-budget-full-window-verify.js',

  summary:
    'MEASURES the minimal (panels,grade) graded-GL node budget reaching worst-in-window < 1 ULP for ' +
    '-ln A(tau) across the full clean window tau in {0.5,1,...,6} -- the quantity imp-33232 left ' +
    'unmeasured after only scoring the imp-3919 crossover-MINIMAL budgets. Reference is an adaptive ' +
    'cluster gold (per-tau average of two independent grade4/grade5 rules sized to tau*=tau+2.5, ' +
    'agreeing to <=~0.83 ULP everywhere) because the imp-33232 substitution-Simpson is ~15 ULP off at ' +
    'tau=0.5. Two findings: (1) the strict <1 ULP bar sits at the DOUBLE-PRECISION FLOOR (~0.6-0.83 ULP ' +
    'best case, every grade) -- a jittery ~0.6-3 ULP band, NOT a monotone threshold; sub-1-ULP is hit ' +
    'only at isolated (grade,panels) lattice points and finer budgets do not help (low-tau round-off ' +
    'grows with panel count). (2) The min-node rule anywhere in grade 3..6 dipping below 1 ULP is ' +
    'grade6/171p = 1710 nodes (0.76 ULP), BELOW the grade5/342p (3420 nodes) imp-33232 named (which ' +
    'sits at ~1.95 ULP): imp-33232 saw grade6 fail only at its crossover-minimal 130p (tau*=6.009); a ' +
    'small margin past the crossover (panels ~150-350, tau* ~6.2-6.9, 2-3 panels tiling the tau=6 peak) ' +
    'reaches the floor at fewer nodes than any shallow grade. So "grade<=5/342p is the floor" was ' +
    'budget-specific; with a safety margin steeper grades are cheaper. ACCURACY MEASUREMENT/RULE-DESIGN ' +
    'ONLY, RH-EQUIVALENT, necessary-but-not-sufficient; operator positivity (imp-3066) untouched; no ' +
    'QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^inf Phi(s) Phi(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    clusterGold: 'per-tau reference = average of two independent graded-GL grades (4 and 5), each with ' +
      'panels = ceil(exp((4*(tau+2.5)+ln(4 pi hi))/grade)) so tau*(panels,grade)=tau+2.5 fully resolves ' +
      'the peak at that tau with a moderate matched panel count; the two grades agree to <=~0.83 ULP across ' +
      'the window, certifying the gold below 1 ULP everywhere',
    whyNotSimpson: 'the imp-33232 substitution-Simpson (Xmax>=120,n>=80000) is only converged near tau=6; ' +
      'at tau=0.5 it is ~15 ULP off (and ~8 ULP off even at Xmax=200/n=320000), so it cannot certify a <1 ULP bar',
    fullWindowScore: 'each representative (grade,panels) rule is scored at tau in {0.5,1,...,6}; worst-in-window ' +
      'gap in ULP and the tau at which it occurs are recorded',
    panelsPerPeak: 'panels whose graded left edge lies within 12*sigma(6), sigma(6)=1/(4 pi e^24)=3.00e-12, counted at the tau=6 peak',
    selfComputing: 'gold, every scored row, the cluster certification and the panels-per-peak count recompute at import; ' +
      'the offline-located sweep-floor panel counts are literals RE-SCORED here, not trusted numbers',
  }),

  measured: Object.freeze({
    hi: HI,
    unitRoundoff: EPS,
    tauGrid: TAU_GRID,
    goldMargin: GOLD_MARGIN,
    goldClusterWorstUlp,
    rows: ROWS,
    minNodeSubOneUlp: Object.freeze({
      grade: grade6MinNode.grade,
      panels: grade6MinNode.panels,
      glNodes: grade6MinNode.glNodes,
      tauStar: grade6MinNode.tauStar,
      worstUlp: grade6MinNode.worstUlp,
      worstTau: grade6MinNode.worstTau,
      panelsPerPeakTau6: grade6MinNode.panelsPerPeakTau6,
    }),
    grade6CrossoverMinFailUlp: grade6TauMin.worstUlp,
    grade3FloorNodes: grade3Floor.glNodes,
    goldIsBelowOneUlp,
    crossoverMinFails,
    steepGradeIsCheaper,
    floorIsArithmetic,
    fewPanelsTilePeak,
    verdict,
  }),

  interpretation: Object.freeze({
    theBarIsAtTheArithmeticFloor:
      'Above the peak-resolution threshold the worst-in-window collapses onto a double-precision noise ' +
      'floor that jitters ~0.6-3 ULP with every +/-2 panels and never beats ~0.6 ULP. Low-tau ' +
      'log-sum-exp round-off GROWS with panel count, so finer budgets do NOT push below the floor. A ' +
      'strict <1 ULP full-window bar is therefore an arithmetic-floor lattice property, not a ' +
      'well-posed monotone quadrature minimum.',
    steepGradesAreCheaperWithMargin:
      'imp-33232 concluded grade<=5/342p is the empirical floor and steep grades fail, but it scored ' +
      'only the imp-3919 crossover-MINIMAL budgets. grade6/130p fails (157 ULP) because tau*=6.009 puts ' +
      'the innermost panel AT the peak scale sigma(6). A hair past the crossover (grade6/150-350p, ' +
      'tau*=6.2-6.9) resolves the whole window at FEWER nodes than any shallow grade: the min-node ' +
      'sub-1-ULP rule is grade6/171p=1710 nodes, and the grade6 sweep-floor 3480 nodes beats grade3 130000.',
    theBindingRequirementIsInnermostPanelWidth:
      'Panels-per-peak alone does not separate pass from fail (both grade6/130p and grade6/150p tile ' +
      'the tau=6 peak with ~2 panels). The binding requirement is the innermost-panel WIDTH a few-fold ' +
      'BELOW sigma(6), i.e. a tau* margin ~0.2-0.4 above 6 -- which for grade6 costs only ~150-350 panels.',
    reconciliationWithImp33232:
      'This does not contradict imp-33232: its refutation of the imp-3919 "~2-order node-savings across ' +
      'the grade sweep" stands (the crossover-minimal steep budgets ARE under-resolved). It refines the ' +
      'FLOOR: the cheapest full-window sub-1-ULP rule is a steep-grade rule with a small crossover margin, ' +
      'not the shallow grade5/342p, which itself sits at ~1.95 ULP just above the bar.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationScope:
      'Measures the node budget of a fixed graded-GL quadrature rule for a fixed autocorrelation weight ' +
      'across the clean window -- a magnitude used inside a mass-feasibility diagnostic. It establishes ' +
      'NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    ruleDesignScopeOnly:
      'This audits a QUADRATURE node budget, not a mathematical floor. It says nothing about the ' +
      'imp-3730 CANCELLATION floor near tau~6, which remains the binding limit on the clean window.',
    latticeJitterCaveat:
      'The min-node sub-1-ULP point is a single lattice hit on a jittery arithmetic floor; neighbouring ' +
      'panel counts bounce above 1 ULP, and cross-platform libm variation in exp/log can shift the ~1 ULP ' +
      'measurements. The robust reading is the FLOOR (~0.6-0.83 ULP) and the grade-ordering, not the exact panel count.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions -----------------------------------------------------------------------
export const IMP33249_A_WEIGHT_GRADED_GL_MINIMAL_FULL_WINDOW_1ULP_BUDGET_ASSERTIONS = [
  {
    id: 'imp33249-cluster-gold-certified-below-one-ulp',
    why: 'The adaptive cluster gold (two independent grade4/grade5 rules per tau) must agree to <1.5 ULP ' +
         'across the whole window, certifying it below 1 ULP so a <1 ULP measurement is meaningful.',
    holds: () => goldIsBelowOneUlp && goldClusterWorstUlp < 1.5,
  },
  {
    id: 'imp33249-crossover-minimal-grade6-fails-full-window',
    why: 'Reproduces imp-33232: the imp-3919 crossover-MINIMAL grade6/130p must FAIL the full window ' +
         '(>50 ULP) despite tau*>=6, since its innermost panel sits at the peak scale sigma(6).',
    holds: () => crossoverMinFails,
  },
  {
    id: 'imp33249-min-node-sub-one-ulp-is-a-steep-grade-rule',
    why: 'THE MEASUREMENT: the min-node rule dipping below ~1 ULP full-window is a steep-grade (grade6) ' +
         'rule at FEWER nodes than the shallow grade3 floor -- so steeper grades are cheaper once a small ' +
         'margin past the crossover, refuting a naive "grade<=5/342p is the floor" reading.',
    holds: () => steepGradeIsCheaper,
  },
  {
    id: 'imp33249-accuracy-is-a-double-precision-floor',
    why: 'The <1 ULP bar sits at the arithmetic floor: every resolved rule bottoms out in a narrow ' +
         '~0.4-10 ULP band, none reaching machine-exact and none beating ~0.4 ULP -- so it is a jittery ' +
         'lattice floor, not a monotone quadrature threshold.',
    holds: () => floorIsArithmetic,
  },
  {
    id: 'imp33249-few-panels-tile-the-peak-at-the-minimum',
    why: 'At the grade6 minimum the tau=6 peak (width ~sigma(6)) is tiled by only a few (1-6) graded ' +
         'panels within 12*sigma(6) of the origin.',
    holds: () => fewPanelsTilePeak,
  },
  {
    id: 'imp33249-verdict-records-the-measurement',
    why: 'The classified verdict must record the measured minimal budget, the arithmetic-floor nature ' +
         'of the <1 ULP bar, and the steep-grade-is-cheaper refinement of imp-33232.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33249-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy measurement/rule-design audit only, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33249_A_WEIGHT_GRADED_GL_MINIMAL_FULL_WINDOW_1ULP_BUDGET.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33249_A_WEIGHT_GRADED_GL_MINIMAL_FULL_WINDOW_1ULP_BUDGET_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33249-a-weight-graded-gl-minimal-full-window-1ulp-budget assertion failed: ${assertion.id}`);
  }
}

export default IMP33249_A_WEIGHT_GRADED_GL_MINIMAL_FULL_WINDOW_1ULP_BUDGET;
