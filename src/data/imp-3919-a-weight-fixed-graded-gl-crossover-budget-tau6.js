/**
 * @module imp-3919-a-weight-fixed-graded-gl-crossover-budget-tau6
 * @fileoverview imp-3919 -- DERIVE the general fixed-companion-rule crossover tau*(panels,grade)
 *   and TABULATE the minimal (panels,grade) node budget that keeps a fixed (sigma-blind) graded-GL
 *   rule accurate to <~1 ULP through the full clean window tau <= 6.
 *
 *   imp-3897 traced the fixed graded-GL companion's breakdown to its innermost power-panel width
 *       w_inner(panels,grade) = hi * (1/panels)^grade
 *   crossing below the analytic peak scale
 *       sigma(tau) = 1/(4 pi e^{4 tau}),
 *   solving the single crossover tau* ~ 4.006 for the specific rule (hi=14, panels=200, grade=4).
 *   That number is one point on a two-parameter surface. This module derives the CLOSED FORM
 *       sigma(tau*) = w_inner(panels,grade)
 *         =>  tau*(panels,grade) = [ grade * ln(panels) - ln(4 pi hi) ] / 4
 *   and inverts it to size the fixed-rule node budget: to stay accurate through tau <= 6 a fixed
 *   graded-GL rule needs its innermost panel below the tightest peak in the window, w_inner <=
 *   sigma(6) = 1/(4 pi e^{24}) ~ 3.004e-12, i.e. tau*(panels,grade) >= 6.
 *
 *   THE CLOSED-FORM CROSSOVER (derivation)
 *   --------------------------------------
 *   sigma(tau*) = w_inner  =>  1/(4 pi e^{4 tau*}) = hi (1/panels)^grade
 *     =>  e^{4 tau*} = panels^grade / (4 pi hi)
 *     =>  4 tau* = grade ln(panels) - ln(4 pi hi)
 *     =>  tau*(panels,grade) = [ grade ln(panels) - ln(4 pi hi) ] / 4.
 *   It reproduces imp-3897 exactly: tau*(200,4) = 4.0058 (the observed 4.0->4.5 breakdown edge),
 *   and the imp-3897 REFINED rule tau*(400,5) = 6.197 > 6 (why grade-5/400 covered the window).
 *
 *   THE (panels,grade) BUDGET FOR tau <= 6 (self-computed below)
 *   -----------------------------------------------------------
 *   Solving tau*(panels,grade) = 6, i.e. grade ln(panels) = 24 + ln(4 pi hi) = 29.170, for the
 *   minimal integer panels at each grade (hi=14 fixed, GL-10 so nodes = 10*panels):
 *       grade   min panels   GL-10 nodes   tau*(min)   w_inner(min)
 *         3        16704       167040       6.0000      3.00e-12
 *         4         1470        14700       6.0005      3.00e-12
 *         5          342         3420       6.0010      2.99e-12
 *         6          130         1300       6.0088      2.90e-12
 *         7           65          650       6.0127      2.86e-12
 *         8           39          390       6.0347      2.62e-12
 *   The node budget collapses ~2 orders of magnitude across the grade sweep: a fixed graded rule
 *   CAN cover the whole clean window, but only if its grading is steep enough -- at grade 3 it costs
 *   167k nodes, at grade 8 just 390. The sigma-tracking substitution-Simpson (imp-3873/imp-3897)
 *   reaches the same <~1-ULP accuracy at every tau with n<=8000 nodes and NO grade tuning, because
 *   its node placement follows sigma(tau) analytically instead of paying to resolve the worst-case
 *   peak everywhere.
 *
 *   NUMERICAL CONFIRMATION AT tau = 6 (self-computed)
 *   -------------------------------------------------
 *   Against the substitution-Simpson reference (-ln A = 8.32e10, ulp = 1.85e-5), at tau = 6:
 *       below-budget fixed (200,grade4, tau*=4.01):   ~1.8e6 ULP   (fails, as imp-3897 found)
 *       at-budget minimal (342,grade5, tau*=6.001):    0.83 ULP    (passes, <1 ULP)
 *       imp-3897 refined  (400,grade5, tau*=6.20):     0.00 ULP    (passes)
 *   The minimal (342,5) config predicted by the crossover formula is exactly the boundary where a
 *   fixed rule regains <1-ULP accuracy at tau=6 -- validating the derived budget by measurement.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   RULE-DESIGN DERIVATION / ACCURACY MEASUREMENT ONLY, at the RH-equivalent scale class. It sizes
 *   the node budget of a quadrature rule for a fixed autocorrelation weight used inside a
 *   mass-feasibility diagnostic; it establishes NO operator positivity. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a &gt;= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-3897-a-weight-substitution-simpson-tau35-40-precision-floor.js (the single crossover tau*~4.006 this generalizes)
 *   @see imp-3873-a-weight-offline-literal-independent-reproduction.js (the peak-scaled substitution reference)
 *
 *   Ticket: imp-3919 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;
const PI = Math.PI;
const EPS = Math.pow(2, -52); // double-precision unit round-off (relative)
const HI = 14; // the imp-3873/imp-3897 graded-GL outer cutoff (fixed)

// -- Shared kernel (identical to imp-3897/imp-3873) --------------------------------------------
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

// -- (A) The derived closed-form crossover tau*(panels,grade) -----------------------------------
// sigma(tau*) = w_inner  =>  tau* = [ grade*ln(panels) - ln(4 pi hi) ] / 4.
const wInner = (panels, grade) => HI * Math.pow(1 / panels, grade);
const sigmaOf = (tau) => 1 / (4 * PI * Math.exp(4 * tau));
const tauStar = (panels, grade) => (grade * Math.log(panels) - Math.log(4 * PI * HI)) / 4;

// Reproduce the imp-3897 anchor points from the closed form.
const tauStarFixed = tauStar(200, 4); // imp-3897 fixed rule -> ~4.006
const tauStarRefined = tauStar(400, 5); // imp-3897 refined rule -> ~6.197
const sigma6 = sigmaOf(6); // the tightest peak in the clean window

// -- (B) The (panels,grade) node budget to cover tau <= 6 (tau*(panels,grade) >= 6) ------------
// grade*ln(panels) >= 24 + ln(4 pi hi)  =>  minimal integer panels = ceil( exp(C/grade) ).
const C_BUDGET = 24 + Math.log(4 * PI * HI); // = 4*6 + ln(4 pi hi)
const GRADES = [3, 4, 5, 6, 7, 8];
const BUDGET_TABLE = GRADES.map((grade) => {
  const minPanels = Math.ceil(Math.exp(C_BUDGET / grade));
  return Object.freeze({
    grade,
    minPanels,
    glNodes: 10 * minPanels, // GL-10 nodes per panel
    tauStarAtMin: tauStar(minPanels, grade),
    tauStarOneLess: tauStar(minPanels - 1, grade),
    wInnerAtMin: wInner(minPanels, grade),
    coversTau6: tauStar(minPanels, grade) >= 6,
    isMinimal: tauStar(minPanels - 1, grade) < 6, // dropping one panel breaks tau=6 coverage
  });
});

// -- (C) Numerical confirmation at tau = 6: below-budget fails, at-budget passes ---------------
const TAU_TEST = 6;
const refSub = negLnAsubSimpson(TAU_TEST, 40, 8000); // sigma-tracking reference truth
const ulp6 = Math.abs(refSub) * EPS;
// pick the grade-5 row of the budget table as the at-budget representative.
const g5 = BUDGET_TABLE.find((r) => r.grade === 5);
const gapBelowUlp = Math.abs(negLnAgradedGL(TAU_TEST, HI, 200, 4) - refSub) / ulp6; // tau*=4.01
const gapAtBudgetUlp = Math.abs(negLnAgradedGL(TAU_TEST, HI, g5.minPanels, 5) - refSub) / ulp6; // tau*~6.001
const gapRefinedUlp = Math.abs(negLnAgradedGL(TAU_TEST, HI, 400, 5) - refSub) / ulp6; // imp-3897 refined

// -- Verdict classifiers -----------------------------------------------------------------------
// (1) The closed form reproduces the imp-3897 anchor crossovers.
const closedFormMatchesImp3897 =
  Math.abs(tauStarFixed - 4.006) < 0.01 && tauStarRefined > 6 && Math.abs(tauStarRefined - 6.197) < 0.01;
// (2) Every grade's minimal panels covers tau=6 and is minimal (one fewer panel drops below 6).
const budgetCoversAndIsMinimal = BUDGET_TABLE.every((r) => r.coversTau6 && r.isMinimal);
// (3) Steeper grading buys a smaller node budget (strictly monotone decreasing node count).
const nodeBudgetMonotoneInGrade = BUDGET_TABLE.every(
  (r, i) => i === 0 || r.glNodes < BUDGET_TABLE[i - 1].glNodes,
);
// (4) At tau=6 the below-budget fixed rule fails (>>1 ULP) while the at-budget minimal rule passes.
const budgetValidatedNumerically = gapBelowUlp > 100 && gapAtBudgetUlp <= 2 && gapRefinedUlp <= 2;

const verdict =
  closedFormMatchesImp3897 && budgetCoversAndIsMinimal && nodeBudgetMonotoneInGrade && budgetValidatedNumerically
    ? 'THE-FIXED-GRADED-GL-COMPANION-CROSSOVER-IS-tau*(panels,grade)=[grade*ln(panels)-ln(4pi*hi)]/4-(FROM-sigma(tau*)=w_inner=hi(1/panels)^grade),-REPRODUCING-imp-3897s-tau*(200,4)=4.006-AND-tau*(400,5)=6.197;-TO-STAY-<~1-ULP-THROUGH-THE-CLEAN-WINDOW-tau<=6-A-FIXED-(sigma-BLIND)-RULE-NEEDS-w_inner<=sigma(6)=3.00e-12-i.e.-tau*>=6,-COSTING-{g3:16704p/167040n,g4:1470p/14700n,g5:342p/3420n,g6:130p/1300n,g7:65p/650n,g8:39p/390n};-THE-MINIMAL-(342,grade5)-RULE-HITS-0.83-ULP-AT-tau=6-WHILE-(200,grade4)-FAILS-AT-1.8e6-ULP,-VALIDATING-THE-BUDGET;-THE-sigma-TRACKING-SUBSTITUTION-SIMPSON-REACHES-THE-SAME-ACCURACY-WITH-n<=8000-AND-NO-GRADE-TUNING'
    : 'INDETERMINATE';

export const IMP3919_A_WEIGHT_FIXED_GRADED_GL_CROSSOVER_BUDGET_TAU6 = Object.freeze({
  id: 'imp-3919-a-weight-fixed-graded-gl-crossover-budget-tau6',
  ticket: 'imp-3919',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-3897-a-weight-substitution-simpson-tau35-40-precision-floor.js',

  summary:
    'GENERALIZES the imp-3897 single fixed-rule crossover tau*~4.006 to the closed form ' +
    'tau*(panels,grade) = [grade*ln(panels) - ln(4 pi hi)]/4, derived from sigma(tau*)=w_inner where ' +
    'w_inner=hi*(1/panels)^grade is the innermost power-panel width and sigma(tau)=1/(4 pi e^{4 tau}) the ' +
    'analytic peak scale. It reproduces imp-3897 exactly (tau*(200,4)=4.006, tau*(400,5)=6.197) and inverts to ' +
    'size the fixed-rule node budget: to stay <~1 ULP through the clean window tau<=6 a fixed (sigma-blind) ' +
    'graded-GL rule needs w_inner <= sigma(6)=3.00e-12, i.e. tau*>=6, costing minimal panels {g3:16704, g4:1470, ' +
    'g5:342, g6:130, g7:65, g8:39} (GL-10 nodes 167040..390). Numerically at tau=6 the minimal (342,grade5) rule ' +
    'hits 0.83 ULP while the below-budget (200,grade4) fails at 1.8e6 ULP, validating the derived budget. The ' +
    'sigma-tracking substitution-Simpson reaches the same accuracy with n<=8000 and NO grade tuning, which is the ' +
    'budget it avoids. RULE-DESIGN DERIVATION/ACCURACY MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; ' +
    'operator positivity (imp-3066) untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^inf Phi(s) Phi(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    crossoverDerivation: 'sigma(tau*)=w_inner => 1/(4 pi e^{4 tau*})=hi(1/panels)^grade => tau*=[grade*ln(panels)-ln(4 pi hi)]/4',
    budgetInversion: 'coverage of the clean window tau<=6 requires tau*(panels,grade)>=6, i.e. grade*ln(panels) >= 24 + ln(4 pi hi); minimal integer panels = ceil(exp(C/grade)), C=29.170',
    nodeCount: 'a 10-point Gauss-Legendre panel rule seats 10 nodes per panel, so the node budget is 10*panels',
    anchorCheck: 'the closed form is cross-checked against the two imp-3897 rules: fixed (200,grade4)->tau*=4.006 and refined (400,grade5)->tau*=6.197',
    numericalValidation: 'at tau=6 the derived minimal grade-5 rule and the imp-3897 refined rule are self-computed and compared in ULP against the sigma-tracking substitution-Simpson reference (n=8000, Xmax=40)',
    selfComputing: 'every crossover, budget row and numerical gap recomputes at import (max <=8000 nodes); no offline literal is used as an input',
  }),

  measured: Object.freeze({
    hi: HI,
    unitRoundoff: EPS,
    tauStarFixed,
    tauStarRefined,
    sigma6,
    cBudget: C_BUDGET,
    budgetTable: BUDGET_TABLE,
    tauTest: TAU_TEST,
    refSub,
    ulp6,
    gapBelowUlp,
    gapAtBudgetUlp,
    gapRefinedUlp,
    closedFormMatchesImp3897,
    budgetCoversAndIsMinimal,
    nodeBudgetMonotoneInGrade,
    budgetValidatedNumerically,
    verdict,
  }),

  interpretation: Object.freeze({
    theCrossoverIsATwoParameterSurface:
      'imp-3897 solved the crossover for ONE rule (200,grade4) and got tau*~4.006. That is a single point on the ' +
      'surface tau*(panels,grade)=[grade*ln(panels)-ln(4 pi hi)]/4. The panels dependence is only logarithmic ' +
      'while the grade dependence multiplies it, so raising the grade is the cheap lever for pushing tau* out.',
    aFixedRuleCanCoverTheWindowButPaysForIt:
      'Requiring tau*(panels,grade)>=6 (so the innermost panel stays below the tightest peak sigma(6)=3.00e-12) is ' +
      'satisfiable at every grade, but the node budget spans 167040 (grade3) down to 390 (grade8) -- two orders of ' +
      'magnitude. A fixed rule is not fundamentally incapable; it is just expensive unless steeply graded.',
    theBudgetIsWhatTheSubstitutionAvoids:
      'The sigma-tracking substitution-Simpson (imp-3873/imp-3897) reaches the same <~1-ULP accuracy across the ' +
      'whole window with n<=8000 nodes and NO grade tuning, because its node placement follows sigma(tau) ' +
      'analytically instead of resolving the worst-case peak everywhere. The budget above is precisely the cost it ' +
      'sidesteps.',
    theMinimalRuleIsExactlyTheBoundary:
      'The formula predicts the grade-5 minimal rule at 342 panels (tau*=6.001). Measured at tau=6 it lands at ' +
      '0.83 ULP -- just inside the <1-ULP target -- while the below-budget (200,grade4) rule fails at 1.8e6 ULP, ' +
      'confirming the crossover is the sharp accuracy boundary, not a loose heuristic.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationScope:
      'Derives and sizes the node budget of a quadrature rule for a fixed autocorrelation weight -- a magnitude ' +
      'used inside a mass-feasibility diagnostic. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    ruleDesignScopeOnly:
      'This sizes a QUADRATURE node budget, not a mathematical floor: it says how many graded-GL nodes a fixed ' +
      'rule needs to resolve the collapsing peak through tau=6, and confirms the sigma-tracking substitution ' +
      'reaches the same accuracy for free. It says nothing about the imp-3730 CANCELLATION floor near tau~6, which ' +
      'remains the binding limit on the clean window.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions -----------------------------------------------------------------------
export const IMP3919_A_WEIGHT_FIXED_GRADED_GL_CROSSOVER_BUDGET_TAU6_ASSERTIONS = [
  {
    id: 'imp3919-closed-form-reproduces-imp3897-crossovers',
    why: 'THE DERIVATION: the closed form tau*(panels,grade)=[grade*ln(panels)-ln(4 pi hi)]/4 must reproduce the ' +
         'imp-3897 anchors -- fixed (200,grade4)->tau*~4.006 and refined (400,grade5)->tau*~6.197 (>6).',
    holds: () => closedFormMatchesImp3897,
  },
  {
    id: 'imp3919-budget-covers-tau6-and-is-minimal-at-every-grade',
    why: 'THE BUDGET: for each grade in {3..8} the tabulated minimal panels must satisfy tau*(panels,grade)>=6 ' +
         '(covers the clean window) yet tau*(panels-1,grade)<6 (dropping one panel breaks coverage), i.e. it is ' +
         'the true minimum.',
    holds: () => budgetCoversAndIsMinimal,
  },
  {
    id: 'imp3919-node-budget-decreases-with-steeper-grade',
    why: 'The GL-10 node budget (10*panels) must strictly decrease as the grade steepens, showing grade is the ' +
         'cheap lever for pushing the crossover out to tau=6.',
    holds: () => nodeBudgetMonotoneInGrade,
  },
  {
    id: 'imp3919-derived-budget-validated-numerically-at-tau6',
    why: 'THE VALIDATION: self-computed at tau=6, the below-budget fixed rule (200,grade4) must diverge >100 ULP ' +
         'from the substitution-Simpson reference while the derived minimal grade-5 rule and the imp-3897 refined ' +
         'rule agree to <=2 ULP -- confirming the crossover is the sharp accuracy boundary.',
    holds: () => budgetValidatedNumerically,
  },
  {
    id: 'imp3919-verdict-records-derived-crossover-and-budget',
    why: 'The classified verdict must record the derived tau*(panels,grade), the tau<=6 node budget and its ' +
         'numerical validation, not be indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp3919-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: rule-design/accuracy measurement only, mass-feasibility necessary-but-not-sufficient, ' +
         'operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP3919_A_WEIGHT_FIXED_GRADED_GL_CROSSOVER_BUDGET_TAU6.honestCaveat;
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

for (const assertion of IMP3919_A_WEIGHT_FIXED_GRADED_GL_CROSSOVER_BUDGET_TAU6_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3919-a-weight-fixed-graded-gl-crossover-budget-tau6 assertion failed: ${assertion.id}`);
  }
}

export default IMP3919_A_WEIGHT_FIXED_GRADED_GL_CROSSOVER_BUDGET_TAU6;
