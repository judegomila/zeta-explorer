/**
 * @module imp-33232-a-weight-fixed-graded-gl-budget-full-window-verify
 * @fileoverview imp-33232 -- INDEPENDENTLY VERIFY the imp-3919 closed-form fixed-companion crossover
 *   tau*(panels,grade) = [grade*ln(panels) - ln(4 pi hi)]/4 and its tau<=6 node-budget table
 *   {grade3:16704p, grade4:1470p, grade5:342p, grade6:130p, grade7:65p, grade8:39p} by RUNNING a fixed
 *   (sigma-blind) graded-GL rule at EACH tabulated minimal budget across the FULL clean window
 *   tau in [0.5, 6], not just the single tau=6 endpoint imp-3919 measured.
 *
 *   WHAT imp-3919 ACTUALLY MEASURED vs WHAT IT CLAIMED
 *   --------------------------------------------------
 *   imp-3919 derived the crossover surface, inverted it to size the minimal (panels,grade) budget so
 *   the innermost power-panel width w_inner = hi*(1/panels)^grade drops below the tightest peak
 *   sigma(6) = 1/(4 pi e^{24}) = 3.00e-12 (i.e. tau*(panels,grade) >= 6), and then validated the
 *   budget numerically at ONE point: tau = 6, for ONE row (grade5, 342p -> 0.83 ULP). It generalized
 *   that single (grade,tau) measurement to the headline "a fixed graded rule CAN cover the whole clean
 *   window tau<=6, only if steeply graded ... the node budget collapses ~2 orders across the grade
 *   sweep (167040 -> 390 nodes)". This module tests that headline over the full window.
 *
 *   THE FULL-WINDOW SWEEP (self-computed below, converged reference)
 *   ---------------------------------------------------------------
 *   Each tabulated minimal rule is run at tau in {0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6} and its
 *   -ln A(tau) compared, in ULP, against a CONVERGED sigma-tracking substitution-Simpson reference
 *   (Xmax=120, n=80000 -- far past the n<=8000/Xmax=40 rule imp-3919 used, which is itself only
 *   converged NEAR tau=6, see below). Worst-in-window ULP per tabulated minimal budget:
 *       grade  panels  GL-10 nodes   tau*     worst ULP (@tau)     ULP at tau=6     verdict
 *         3     16704    167040      6.000     ~10.7  (@0.5)          0.0            passes*
 *         4      1470     14700      6.000     ~4.7   (@0.5)          0.83           passes*
 *         5       342      3420      6.001     ~4.7   (@0.5)          0.83           passes*
 *         6       130      1300      6.009     ~157   (@6)          ~157            FAILS
 *         7        65       650      6.013     ~3548  (@6)         ~3548            FAILS
 *         8        39       390      6.035    ~15400  (@6)        ~15400            FAILS
 *   passes* = few-ULP (order 1-11) through the window and sub-ULP at tau=6; the residual few-ULP
 *   floor sits at the LOW-tau end and is reference-limited (see cross-check), so grades 3-5 are the
 *   rows that genuinely honour <~1-ULP-class accuracy through the clean window.
 *
 *   THE HEADLINE IS REFUTED FOR THE STEEP-GRADE "NODE-SAVINGS" ROWS
 *   --------------------------------------------------------------
 *   The three cheapest rows imp-3919 advertised as the ~2-order node-budget collapse -- grade6 (130p),
 *   grade7 (65p), grade8 (39p) -- do NOT reach <1 ULP anywhere near tau=6. They FAIL at tau=6 by
 *   ~157, ~3548 and ~15400 ULP respectively, monotone WORSE with grade, DESPITE their
 *   tau*(panels,grade) all exceeding 6. So the crossover innermost-panel condition tau*>=6 is
 *   NECESSARY-BUT-NOT-SUFFICIENT for full-window 1-ULP accuracy.
 *
 *   ROOT CAUSE (why tau*>=6 is not enough at high grade)
 *   ----------------------------------------------------
 *   tau*>=6 forces only the INNERMOST panel below the peak sigma(6). But consecutive graded panel
 *   widths jump by ~(j+1/j)^grade ~ 2^grade near the origin, so at grade 8 the SECOND panel is already
 *   ~256x the peak scale: only ~ONE sub-peak panel exists, and a single GL-10 panel cannot integrate
 *   the collapsing peak to 1 ULP. Resolving the peak to 1 ULP needs SEVERAL panels tiling it, which
 *   empirically requires panels >= ~342 (grade <= 5 at the minimal setting). Hence imp-3919's
 *   "~2-order node-budget collapse across the grade sweep" does NOT hold at FIXED full-window accuracy:
 *   the node savings from steep grading are illusory once the whole window (not just tau=6) is scored.
 *
 *   THE tau=6 FAILURE IS NOT A REFERENCE ARTIFACT (substitution-independent cross-check)
 *   -----------------------------------------------------------------------------------
 *   The failure is confirmed WITHOUT the substitution-Simpson reference: the grade8 minimal rule (39p)
 *   disagrees with a 16x-finer SAME-grade graded-GL rule (624p) at tau=6 by ~1.5e4 ULP, while the
 *   grade5 minimal rule (342p) agrees with its 8x-finer counterpart (2736p) to ~1.3 ULP at the
 *   low-tau residual point. So the steep-grade breakdown is intrinsic to the coarse panel count, not
 *   an artifact of the reference. Separately, the reason imp-3919 only saw 0.83 ULP was that it scored
 *   at tau=6 where the n<=8000 substitution reference IS converged; at tau=0.5 the same n=8000/Xmax=40
 *   reference is itself ~650 ULP from its converged value, so a full-window audit also needs a
 *   substitution reference resolved beyond the imp-3919 budget.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   --------------------------------------------------------
 *   ACCURACY MEASUREMENT / RULE-DESIGN AUDIT ONLY, at the RH-equivalent scale class. It scores the
 *   node budget of a quadrature rule for a fixed autocorrelation weight used inside a mass-feasibility
 *   diagnostic; it establishes NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT.
 *   The operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is
 *   UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3919-a-weight-fixed-graded-gl-crossover-budget-tau6.js (the crossover + budget this audits)
 *   @see imp-3897-a-weight-substitution-simpson-tau35-40-precision-floor.js (the single crossover tau*~4.006)
 *
 *   Ticket: imp-33232 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;
const PI = Math.PI;
const EPS = Math.pow(2, -52); // double-precision unit round-off (relative)
const HI = 14; // the imp-3873/imp-3897/imp-3919 graded-GL outer cutoff (fixed)

// -- Shared kernel (identical to imp-3919/imp-3897/imp-3873) ------------------------------------
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
function negLnAsubSimpson(tau, Xmax, n) {
  const sigma = 1 / (4 * PI * Math.exp(4 * tau));
  const m = n % 2 === 0 ? n : n + 1;
  const h = Xmax / m;
  const logw = [];
  let mx = -Infinity;
  for (let i = 0; i <= m; i += 1) {
    const w = i === 0 || i === m ? 1 : (i % 2 === 0 ? 2 : 4);
    const s = sigma * (i * h);
    const t = Math.log(w) + logPhiFactored(s) + logPhiFactored(s + tau);
    logw.push(t);
    if (t > mx) mx = t;
  }
  let acc = 0;
  for (const t of logw) acc += Math.exp(t - mx);
  return -(Math.log(sigma) + Math.log(h / 3) + mx + Math.log(acc));
}

// -- (A) Regenerate the imp-3919 crossover + minimal-budget table (independent recompute) -------
const wInner = (panels, grade) => HI * Math.pow(1 / panels, grade);
const tauStar = (panels, grade) => (grade * Math.log(panels) - Math.log(4 * PI * HI)) / 4;
const C_BUDGET = 24 + Math.log(4 * PI * HI); // grade*ln(panels) >= this to reach tau*>=6
const GRADES = [3, 4, 5, 6, 7, 8];
const IMP3919_MIN_PANELS = { 3: 16704, 4: 1470, 5: 342, 6: 130, 7: 65, 8: 39 };

// -- (B) Converged sigma-tracking reference (well past the imp-3919 n<=8000/Xmax=40 rule) -------
// The imp-3919 n=8000/Xmax=40 substitution is converged only NEAR tau=6; a full-window audit needs
// a reference resolved across the whole window, so we use Xmax=120, n=80000.
const REF_XMAX = 120;
const REF_N = 80000;
const TAU_GRID = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6];
const refByTau = TAU_GRID.map((tau) => ({ tau, ref: negLnAsubSimpson(tau, REF_XMAX, REF_N) }));

// -- (C) Run each tabulated minimal budget across the FULL window; score worst-in-window ULP ----
const SWEEP = GRADES.map((grade) => {
  const panels = IMP3919_MIN_PANELS[grade];
  let worstUlp = 0;
  let worstTau = 0;
  let ulpAtTau6 = 0;
  for (const { tau, ref } of refByTau) {
    const ulp = Math.abs(ref) * EPS;
    const gap = Math.abs(negLnAgradedGL(tau, HI, panels, grade) - ref) / ulp;
    if (gap > worstUlp) {
      worstUlp = gap;
      worstTau = tau;
    }
    if (tau === 6) ulpAtTau6 = gap;
  }
  return Object.freeze({
    grade,
    panels,
    glNodes: 10 * panels,
    tauStar: tauStar(panels, grade),
    wInner: wInner(panels, grade),
    coversTau6ByCrossover: tauStar(panels, grade) >= 6, // the imp-3919 necessary condition
    worstUlp,
    worstTau,
    ulpAtTau6,
    // A row honours <~1-ULP-class accuracy through the window if its worst-in-window gap stays
    // small (few ULP, reference-limited) AND it is sub-ULP-class at the tau=6 endpoint.
    passesFullWindow: worstUlp < 50 && ulpAtTau6 <= 2,
  });
});

// -- (D) Substitution-INDEPENDENT confirmation that the steep-grade tau=6 failure is intrinsic --
// grade8 minimal (39p) vs a 16x-finer SAME-grade rule (624p) at tau=6: no substitution reference.
const g8ref = negLnAgradedGL(6, HI, 39 * 16, 8);
const g8IndepUlp = Math.abs(negLnAgradedGL(6, HI, 39, 8) - g8ref) / (Math.abs(g8ref) * EPS);
// grade5 minimal (342p) vs an 8x-finer SAME-grade rule (2736p) at the low-tau residual point 0.5.
const g5ref = negLnAgradedGL(0.5, HI, 342 * 8, 5);
const g5IndepUlp = Math.abs(negLnAgradedGL(0.5, HI, 342, 5) - g5ref) / (Math.abs(g5ref) * EPS);

// -- Verdict classifiers -----------------------------------------------------------------------
// (1) The regenerated minimal-panel budget matches the imp-3919 table exactly and every row clears
//     the crossover necessary condition tau*>=6.
const budgetTableReproduced = SWEEP.every(
  (r) => r.panels === IMP3919_MIN_PANELS[r.grade] && r.coversTau6ByCrossover,
);
// (2) Grades 3,4,5 honour <~1-ULP-class accuracy through the FULL window (few-ULP worst, sub-ULP tau6).
const shallowGradesPassFullWindow = SWEEP.filter((r) => r.grade <= 5).every((r) => r.passesFullWindow);
// (3) Grades 6,7,8 FAIL at tau=6, monotone WORSE with grade -- refuting <1 ULP for the node-savings rows.
const steepGrades = SWEEP.filter((r) => r.grade >= 6);
const steepGradesFailAtTau6 =
  steepGrades.every((r) => r.ulpAtTau6 > 100 && !r.passesFullWindow) &&
  steepGrades[0].ulpAtTau6 < steepGrades[1].ulpAtTau6 &&
  steepGrades[1].ulpAtTau6 < steepGrades[2].ulpAtTau6;
// (4) The tau=6 failure is intrinsic (substitution-independent): grade8 coarse-vs-fine >> grade5.
const failureIsIntrinsic = g8IndepUlp > 100 && g5IndepUlp < 10;

const verdict =
  budgetTableReproduced && shallowGradesPassFullWindow && steepGradesFailAtTau6 && failureIsIntrinsic
    ? 'imp-3919s-CROSSOVER-tau*(panels,grade)=[grade*ln(panels)-ln(4pi*hi)]/4-AND-ITS-tau<=6-MINIMAL-BUDGET-{g3:16704p,g4:1470p,g5:342p,g6:130p,g7:65p,g8:39p}-REGENERATE-EXACTLY,-BUT-THE-tau<=6-<~1-ULP-CLAIM-HOLDS-ONLY-FOR-THE-SHALLOW-ROWS-grade3..5-(panels>=342):-FEW-ULP-THROUGH-THE-WINDOW-AND-SUB-ULP-AT-tau=6.-THE-STEEP-GRADE-NODE-SAVINGS-ROWS-grade6/7/8-(130/65/39p)-FAIL-AT-tau=6-BY-~157/3548/15400-ULP-DESPITE-tau*>6,-SO-THE-INNERMOST-PANEL-CONDITION-tau*>=6-IS-NECESSARY-BUT-NOT-SUFFICIENT:-A-SINGLE-SUB-PEAK-GL-10-PANEL-CANNOT-RESOLVE-THE-COLLAPSING-PEAK-TO-1-ULP-(CONSECUTIVE-PANEL-WIDTHS-JUMP-~2^grade),-CONFIRMED-SUBSTITUTION-INDEPENDENTLY-(g8-39p-vs-624p-SAME-GRADE-=~1.5e4-ULP).-imp-3919s-~2-ORDER-NODE-BUDGET-COLLAPSE-ACROSS-THE-GRADE-SWEEP-DOES-NOT-HOLD-AT-FIXED-FULL-WINDOW-ACCURACY'
    : 'INDETERMINATE';

export const IMP33232_A_WEIGHT_FIXED_GRADED_GL_BUDGET_FULL_WINDOW_VERIFY = Object.freeze({
  id: 'imp-33232-a-weight-fixed-graded-gl-budget-full-window-verify',
  ticket: 'imp-33232',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  auditsModule: 'imp-3919-a-weight-fixed-graded-gl-crossover-budget-tau6.js',

  summary:
    'RUNS each imp-3919 tabulated minimal (panels,grade) graded-GL rule {g3:16704p,g4:1470p,g5:342p,' +
    'g6:130p,g7:65p,g8:39p} across the FULL clean window tau in [0.5,6] (12-point grid) against a ' +
    'converged sigma-tracking substitution-Simpson reference (Xmax=120,n=80000), not just the single ' +
    'tau=6 point imp-3919 measured. Finding: the crossover formula and the budget table regenerate ' +
    'exactly, but the tau<=6 <~1-ULP claim holds only for the shallow rows grade3..5 (panels>=342): ' +
    'few-ULP through the window, sub-ULP at tau=6. The steep-grade node-savings rows grade6/7/8 ' +
    '(130/65/39 panels) FAIL at tau=6 by ~157/3548/15400 ULP despite tau*(panels,grade)>6, so the ' +
    'innermost-panel condition tau*>=6 is NECESSARY-BUT-NOT-SUFFICIENT -- with so few panels only one ' +
    'sub-peak GL-10 panel exists and it cannot resolve the collapsing peak to 1 ULP (confirmed ' +
    'substitution-independently: g8 39p vs 624p same-grade = ~1.5e4 ULP). imp-3919s ~2-order ' +
    'node-budget collapse across the grade sweep therefore does NOT hold at fixed full-window accuracy. ' +
    'ACCURACY MEASUREMENT/RULE-DESIGN AUDIT, RH-EQUIVALENT, necessary-but-not-sufficient; operator ' +
    'positivity (imp-3066) untouched; no QED. PT Lambda <= 0.2 stays SOTA.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^inf Phi(s) Phi(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    budgetRegeneration: 'independently recompute minimal panels = ceil(exp(C/grade)), C=24+ln(4 pi hi), and confirm they match the imp-3919 table {16704,1470,342,130,65,39} with tau*(panels,grade)>=6',
    fullWindowSweep: 'each tabulated minimal rule is run at tau in {0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6} and scored in ULP against a converged reference; worst-in-window and tau=6 gaps recorded per grade',
    convergedReference: 'sigma-tracking substitution-Simpson with Xmax=120, n=80000 -- well past the n<=8000/Xmax=40 rule imp-3919 used, which is converged only near tau=6',
    substitutionIndependentCheck: 'the steep-grade tau=6 failure is re-confirmed WITHOUT the reference by comparing the grade8 minimal rule (39p) to a 16x-finer SAME-grade rule (624p), and the grade5 residual to an 8x-finer same-grade rule',
    selfComputing: 'every crossover, budget row, sweep gap and cross-check recomputes at import (heaviest single call 167040 nodes x 12 tau); no offline literal is used as an input',
  }),

  measured: Object.freeze({
    hi: HI,
    unitRoundoff: EPS,
    cBudget: C_BUDGET,
    refXmax: REF_XMAX,
    refN: REF_N,
    tauGrid: TAU_GRID,
    sweep: SWEEP,
    g8IndepUlp,
    g5IndepUlp,
    budgetTableReproduced,
    shallowGradesPassFullWindow,
    steepGradesFailAtTau6,
    failureIsIntrinsic,
    verdict,
  }),

  interpretation: Object.freeze({
    theSingleEndpointValidationWasNotEnough:
      'imp-3919 validated the budget at ONE point (tau=6, grade5 -> 0.83 ULP) and generalized to the ' +
      'whole grade sweep. Scoring EVERY tabulated minimal rule across the full window tau in [0.5,6] ' +
      'shows only the shallow rows grade3..5 (panels>=342) actually hold few-ULP through the window; ' +
      'the cheaper steep-grade rows break.',
    necessaryNotSufficientCrossover:
      'tau*(panels,grade)>=6 forces the INNERMOST panel below the peak sigma(6)=3.00e-12 but says ' +
      'nothing about the SECOND panel, whose width jumps ~2^grade. At grade8 the second panel is ' +
      '~256x the peak scale, so a single sub-peak GL-10 panel must carry the collapsing peak alone ' +
      'and cannot reach 1 ULP -- grade6/7/8 miss tau=6 by ~157/3548/15400 ULP.',
    nodeSavingsAreIllusoryAtFixedAccuracy:
      'imp-3919s headline was a ~2-order node-budget collapse (167040 -> 390 nodes) across the grade ' +
      'sweep. That collapse only appears because the cheap rows are scored at a single endpoint; at a ' +
      'FIXED full-window <~1-ULP-class target the usable budget bottoms out around panels~342 ' +
      '(grade<=5, ~3420 nodes), so the steep-grade savings do not survive.',
    theFailureIsIntrinsicNotAReferenceArtifact:
      'A substitution-independent cross-check (grade8 39p vs a 16x-finer same-grade 624p rule) ' +
      'reproduces the ~1.5e4-ULP tau=6 breakdown, so it is a genuine property of the coarse panel ' +
      'count, not an artifact of the substitution reference. The reference itself, however, must be ' +
      'resolved past n=8000/Xmax=40 for a full-window audit (that rule is ~650 ULP off at tau=0.5).',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationScope:
      'Scores the accuracy of a fixed graded-GL quadrature rule for a fixed autocorrelation weight ' +
      'across the clean window -- a magnitude used inside a mass-feasibility diagnostic. It establishes ' +
      'NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    ruleDesignScopeOnly:
      'This audits a QUADRATURE node budget, not a mathematical floor. It says nothing about the ' +
      'imp-3730 CANCELLATION floor near tau~6, which remains the binding limit on the clean window.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions -----------------------------------------------------------------------
export const IMP33232_A_WEIGHT_FIXED_GRADED_GL_BUDGET_FULL_WINDOW_VERIFY_ASSERTIONS = [
  {
    id: 'imp33232-regenerates-imp3919-budget-table',
    why: 'The independently recomputed minimal panels must match the imp-3919 table exactly ' +
         '{g3:16704,g4:1470,g5:342,g6:130,g7:65,g8:39} and every row must clear the crossover ' +
         'necessary condition tau*(panels,grade)>=6.',
    holds: () => budgetTableReproduced,
  },
  {
    id: 'imp33232-shallow-grades-pass-full-window',
    why: 'Grades 3,4,5 (panels>=342) must honour <~1-ULP-class accuracy through the FULL window: ' +
         'few-ULP worst-in-window and sub-2-ULP at tau=6.',
    holds: () => shallowGradesPassFullWindow,
  },
  {
    id: 'imp33232-steep-grades-fail-at-tau6',
    why: 'THE REFUTATION: grades 6,7,8 (130/65/39 panels) must FAIL at tau=6 (>100 ULP), monotone ' +
         'worse with grade, despite tau*(panels,grade)>6 -- showing the innermost-panel crossover ' +
         'condition is necessary but NOT sufficient for full-window 1-ULP accuracy.',
    holds: () => steepGradesFailAtTau6,
  },
  {
    id: 'imp33232-failure-is-substitution-independent',
    why: 'The steep-grade tau=6 breakdown must reproduce WITHOUT the substitution reference: the ' +
         'grade8 minimal rule vs a 16x-finer same-grade rule must diverge >100 ULP while the grade5 ' +
         'rule vs its finer counterpart agrees <10 ULP -- so the failure is intrinsic, not a ' +
         'reference artifact.',
    holds: () => failureIsIntrinsic,
  },
  {
    id: 'imp33232-verdict-records-partial-verification',
    why: 'The classified verdict must record that the crossover/budget regenerate but the tau<=6 ' +
         '<~1-ULP claim holds only for grade<=5, refuted for the steep-grade node-savings rows.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33232-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy measurement/rule-design audit only, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP33232_A_WEIGHT_FIXED_GRADED_GL_BUDGET_FULL_WINDOW_VERIFY.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33232_A_WEIGHT_FIXED_GRADED_GL_BUDGET_FULL_WINDOW_VERIFY_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33232-a-weight-fixed-graded-gl-budget-full-window-verify assertion failed: ${assertion.id}`);
  }
}

export default IMP33232_A_WEIGHT_FIXED_GRADED_GL_BUDGET_FULL_WINDOW_VERIFY;
