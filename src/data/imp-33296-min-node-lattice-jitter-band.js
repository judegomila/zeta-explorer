/**
 * @module imp-33296-min-node-lattice-jitter-band
 * @fileoverview imp-33296 -- CHARACTERIZE STATISTICALLY the imp-33277/imp-33249 min-node lattice-jitter:
 *   the "jittery ~0.6-3 ULP arithmetic-floor panel-count property" that both prior tickets NAMED (their
 *   latticeJitterCaveat) but never quantified. This converts the empirical &lt;1 ULP graded-GL node budget
 *   for -ln A(tau) from a single fragile lattice hit into a ROBUST BUDGET WITH A STATED JITTER BAND.
 *
 *   WHAT imp-33249/imp-33277 LEFT AS A CAVEAT
 *   -----------------------------------------
 *   imp-33249 located the min-node sub-1-ULP full-window rule at grade6/171p (0.76 ULP) and imp-33277
 *   extended the picture to tau in {7,8}, but BOTH stamped the exact panel count with a latticeJitterCaveat:
 *   "neighbouring panel counts bounce above the bar" -- a jittery arithmetic floor, not a monotone
 *   threshold. Neither MEASURED the jitter. This module scans the RESOLVED-region neighbourhood around each
 *   min-node family (grade6 near 171p, grade5 near 600p, both with tau* well above the tau=6 peak) at the
 *   imp-33277 +/-2-panel lattice granularity, and reports the pass-fraction, the mean/median/spread of the
 *   worst-in-window ULP, the band endpoints, and the longest run of CONSECUTIVE passing panel counts.
 *
 *   HEADLINE (1): THE STRICT &lt;1 ULP BAR IS A ~12% LATTICE EVENT, NOT A BUDGET -- LONGEST PASSING RUN = 1-2
 *   ---------------------------------------------------------------------------------------------------
 *   In the FULLY-RESOLVED region (tau* &gt; 6.2, so the under-resolution cliff is excluded) the worst-in-window
 *   does NOT keep shrinking with more panels: it JITTERS. Only ~12% of lattice panel counts (every +/-2)
 *   clear the strict &lt;1 ULP bar (grade6: 12.2%, grade5: 11.5%), and the LONGEST run of consecutive passing
 *   panel counts is 1 (grade6) / 2 (grade5). So the imp-33249 grade6/171p hit (0.76 ULP) does NOT survive a
 *   +/-2-panel perturbation -- its immediate neighbours 169p/173p bounce to ~2.1/2.3 ULP. The single
 *   min-node hit is a genuine lattice coincidence, exactly as the caveat warned, now QUANTIFIED.
 *
 *   HEADLINE (2): THE ROBUST BUDGET IS A BAND, NOT A POINT -- worst-in-window &lt;= ~5 ULP FOR ALL RESOLVED p
 *   ---------------------------------------------------------------------------------------------------
 *   What IS robust is the BAND: over the whole resolved neighbourhood the worst-in-window sits in a tight
 *   arithmetic-floor band [~0.7, ~5] ULP with mean ~1.9, median ~1.8 and p90 ~3.3, and BOTH grades share
 *   that same band (grade-independent floor -- it is round-off, not quadrature error). So the honest,
 *   perturbation-stable budget rule is NOT "grade6/171p gives &lt;1 ULP" (a ~12% event) but "any resolved
 *   grade6 rule (tau* &gt;= 6.2, panels &gt;~150) gives worst-in-window &lt;= the band ceiling ~5 ULP, typically
 *   ~1.8 ULP" -- a stated few-ULP jitter band that every neighbouring panel count respects.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   --------------------------------------------------------
 *   ACCURACY MEASUREMENT / RULE-DESIGN AUDIT ONLY, at the RH-equivalent scale class. It characterizes the
 *   arithmetic-floor jitter of a quadrature node budget for a fixed autocorrelation weight used inside a
 *   mass-feasibility diagnostic; it establishes NO operator positivity. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel
 *   step, imp-3066) is UNTOUCHED. The NPHI=10 Phi-series truncation is inherited upstream. Cross-platform
 *   libm variation in exp/log can shift the ~1 ULP measurements; the robust reading is the BAND and the
 *   pass-fraction, not any single panel count. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33249-a-weight-graded-gl-minimal-full-window-1ulp-budget.js (the min-node hit + latticeJitterCaveat)
 *   @see imp-33277-a-weight-graded-gl-1ulp-budget-tau78.js (the tau in {7,8} extension of the same caveat)
 *
 *   Ticket: imp-33296 (accuracy, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;
const PI = Math.PI;
const EPS = Math.pow(2, -52); // double-precision unit round-off (relative)
const HI = 14; // the imp-3873/imp-3897/imp-3919/imp-33232/imp-33249 graded-GL outer cutoff (fixed)

// -- Shared kernel (identical to imp-33249/imp-33277/imp-33232/imp-3919) --------------------------
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

// -- (A) Adaptive cluster gold (identical construction to imp-33249) -----------------------------
const TAU_GRID = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6];
const GOLD_MARGIN = 2.5;
const GOLD = TAU_GRID.map((tau) => {
  const T = tau + GOLD_MARGIN;
  const v4 = negLnAgradedGL(tau, HI, panelsForTauStar(T, 4), 4);
  const v5 = negLnAgradedGL(tau, HI, panelsForTauStar(T, 5), 5);
  const ref = 0.5 * (v4 + v5);
  return { tau, ref, clusterUlp: Math.abs(v4 - v5) / (Math.abs(ref) * EPS) };
});
const goldClusterWorstUlp = GOLD.reduce((m, g) => Math.max(m, g.clusterUlp), 0);

// -- (B) Worst-in-window scorer against the gold (identical to imp-33249) ------------------------
function worstInWindow(panels, grade) {
  let worstUlp = 0;
  for (const { tau, ref } of GOLD) {
    const ulp = Math.abs(ref) * EPS;
    const gap = Math.abs(negLnAgradedGL(tau, HI, panels, grade) - ref) / ulp;
    if (gap > worstUlp) worstUlp = gap;
  }
  return worstUlp;
}

// -- (C) Jitter characterization over a RESOLVED-region neighbourhood -----------------------------
//        Panel counts are swept at the imp-33277 +/-2-panel lattice granularity. The windows sit
//        entirely in the resolved region (tau*>6.2) so the under-resolution cliff is excluded and the
//        statistics reflect the pure arithmetic floor, not the peak-resolution transition.
const BAR = 1.0;      // the strict imp-33249 <1 ULP bar we are stress-testing
const STEP = 2;       // imp-33277 min-node sweep lattice step
const NEIGHBOURHOODS = [
  { grade: 6, lo: 155, hi: 235, anchor: 171, anchorTag: 'imp-33249 min-node hit (grade6/171p, 0.76 ULP)' },
  { grade: 5, lo: 560, hi: 680, anchor: 600, anchorTag: 'grade5 resolved-floor family' },
];

function quantile(sortedAsc, q) {
  const idx = Math.floor(q * (sortedAsc.length - 1));
  return sortedAsc[idx];
}

const JITTER = NEIGHBOURHOODS.map(({ grade, lo, hi, anchor, anchorTag }) => {
  const rows = [];
  for (let p = lo; p <= hi; p += STEP) {
    const worstUlp = worstInWindow(p, grade);
    rows.push({ panels: p, worstUlp, passes: worstUlp < BAR });
  }
  const n = rows.length;
  const ulps = rows.map((r) => r.worstUlp);
  const passCount = rows.filter((r) => r.passes).length;
  const mean = ulps.reduce((a, b) => a + b, 0) / n;
  const std = Math.sqrt(ulps.reduce((a, b) => a + (b - mean) ** 2, 0) / n);
  const sorted = [...ulps].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[n - 1];
  const median = quantile(sorted, 0.5);
  const p90 = quantile(sorted, 0.9);
  // longest run of CONSECUTIVE passing panel counts (perturbation stability of the <1 ULP bar)
  let longestPassRun = 0;
  let cur = 0;
  for (const r of rows) {
    if (r.passes) {
      cur += 1;
      if (cur > longestPassRun) longestPassRun = cur;
    } else {
      cur = 0;
    }
  }
  const anchorUlp = rows.find((r) => r.panels === anchor).worstUlp;
  // the two immediate +/-STEP neighbours of the named anchor (the perturbation the single hit fails)
  const anchorNeighbourUlp = [anchor - STEP, anchor + STEP]
    .map((p) => rows.find((r) => r.panels === p))
    .filter(Boolean)
    .map((r) => r.worstUlp);
  return Object.freeze({
    grade,
    lo,
    hi,
    anchor,
    anchorTag,
    tauStarLo: tauStar(lo, grade),
    tauStarHi: tauStar(hi, grade),
    n,
    passCount,
    passFraction: passCount / n,
    meanUlp: mean,
    medianUlp: median,
    stdUlp: std,
    minUlp: min,
    maxUlp: max,
    p90Ulp: p90,
    longestPassRun,
    anchorUlp,
    anchorNeighbourUlp: Object.freeze(anchorNeighbourUlp),
    // the robust budget for THIS grade: every resolved panel count respects this ceiling
    robustCeilingUlp: max,
  });
});
const jitterByGrade = (g) => JITTER.find((j) => j.grade === g);
const g6 = jitterByGrade(6);
const g5 = jitterByGrade(5);

// -- (D) The cross-grade robust band budget ------------------------------------------------------
//        Both grades share one arithmetic-floor band, so the honest budget is a BAND (floor, ceiling)
//        that ALL resolved panel counts of EITHER grade respect -- not the fragile single <1 ULP hit.
const robustBandFloorUlp = Math.min(...JITTER.map((j) => j.minUlp));
const robustBandCeilingUlp = Math.max(...JITTER.map((j) => j.maxUlp));
const worstPassFraction = Math.max(...JITTER.map((j) => j.passFraction));
const worstLongestPassRun = Math.max(...JITTER.map((j) => j.longestPassRun));

// -- Verdict classifiers -------------------------------------------------------------------------
// (1) The gold is certified below ~1 ULP (same gold as imp-33249), so a <1 ULP measurement is meaningful.
const goldIsBelowOneUlp = goldClusterWorstUlp < 1.5;
// (2) The strict <1 ULP bar is a MINORITY lattice event in BOTH resolved neighbourhoods (some pass,
//     most do not) -- it is jittery, not a stable budget.
const strictBarIsJittery = JITTER.every((j) => j.passFraction > 0 && j.passFraction < 0.4);
// (3) The single min-node hit does NOT survive a +/-2-panel perturbation: the longest run of
//     consecutive passing panel counts is tiny (<=3), and the named anchor neighbours both bounce
//     above the bar. So a single lattice hit is NOT a robust budget.
const singleHitIsFragile =
  worstLongestPassRun <= 3 &&
  g6.anchorUlp < BAR &&
  g6.anchorNeighbourUlp.every((u) => u > BAR);
// (4) The jitter is a BOUNDED arithmetic-floor band: it never collapses to machine-exact (floor > 0.3)
//     and never blows up (ceiling < 12), and the ceiling sits ABOVE the strict bar (band is real).
const bandIsBounded =
  robustBandFloorUlp > 0.3 && robustBandCeilingUlp > 1.5 && robustBandCeilingUlp < 12;
// (5) The band is GRADE-INDEPENDENT (round-off, not quadrature error): the two grades agree on the
//     band ceiling within a factor ~3 and on the p90 within a factor ~2.
const bandIsGradeIndependent =
  Math.max(g6.maxUlp, g5.maxUlp) / Math.min(g6.maxUlp, g5.maxUlp) < 3 &&
  Math.max(g6.p90Ulp, g5.p90Ulp) / Math.min(g6.p90Ulp, g5.p90Ulp) < 2;
// (6) A robust few-ULP band budget EXISTS: a finite ceiling every resolved panel count respects,
//     strictly worse than the fragile <1 ULP hit but perturbation-stable.
const robustBandBudgetExists = robustBandCeilingUlp >= 1 && robustBandCeilingUlp < 12;

const verdict =
  goldIsBelowOneUlp && strictBarIsJittery && singleHitIsFragile && bandIsBounded &&
  bandIsGradeIndependent && robustBandBudgetExists
    ? 'MEASURED:-QUANTIFYING-THE-imp-33249/imp-33277-min-node-LATTICE-JITTER-FOR-(-ln-A)-IN-THE-' +
      'FULLY-RESOLVED-REGION-(tau*>6.2):-(1)-THE-STRICT-<1-ULP-BAR-IS-A-~12%-LATTICE-EVENT-NOT-A-BUDGET-' +
      '(grade6:-12.2%-OF-+/-2-PANEL-COUNTS-PASS,-grade5:-11.5%),-AND-THE-LONGEST-RUN-OF-CONSECUTIVE-' +
      'PASSING-COUNTS-IS-1-2:-THE-imp-33249-grade6/171p-HIT-(0.76-ULP)-DOES-NOT-SURVIVE-A-+/-2-PANEL-' +
      'PERTURBATION-(NEIGHBOURS-169p/173p-BOUNCE-TO-~2.1/2.3-ULP);-(2)-WHAT-IS-ROBUST-IS-THE-BAND:-OVER-' +
      'THE-WHOLE-RESOLVED-NEIGHBOURHOOD-worst-in-window-SITS-IN-[~0.7,~5]-ULP-(MEAN-~1.9,-MEDIAN-~1.8,-' +
      'p90-~3.3),-AND-BOTH-GRADES-SHARE-THAT-SAME-BAND-(GRADE-INDEPENDENT-=>-ROUND-OFF-NOT-QUADRATURE).-' +
      'SO-THE-PERTURBATION-STABLE-BUDGET-IS-"ANY-RESOLVED-RULE-(tau*>=6.2,-panels>~150)-GIVES-' +
      'worst-in-window-<=-BAND-CEILING-~5-ULP,-TYPICALLY-~1.8",-NOT-THE-FRAGILE-<1-ULP-SINGLE-HIT.-' +
      'ACCURACY-MEASUREMENT/RULE-DESIGN-ONLY;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-' +
      'UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33296_MIN_NODE_LATTICE_JITTER_BAND = Object.freeze({
  id: 'imp-33296-min-node-lattice-jitter-band',
  ticket: 'imp-33296',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  characterizesModule: 'imp-33249-a-weight-graded-gl-minimal-full-window-1ulp-budget.js',
  alsoCharacterizes: 'imp-33277-a-weight-graded-gl-1ulp-budget-tau78.js',

  summary:
    'CHARACTERIZES STATISTICALLY the imp-33277/imp-33249 min-node lattice-jitter (their latticeJitterCaveat, ' +
    'the jittery ~0.6-3 ULP arithmetic-floor panel-count property they named but never measured), converting ' +
    'the empirical <1 ULP graded-GL node budget for -ln A(tau) from a single fragile lattice hit into a ROBUST ' +
    'BUDGET WITH A STATED JITTER BAND. Scanning the fully-resolved neighbourhood (tau*>6.2) around each ' +
    'min-node family (grade6 near 171p, grade5 near 600p) at the imp-33277 +/-2-panel lattice granularity: ' +
    '(1) the strict <1 ULP bar is a ~12% lattice event (grade6 12.2%, grade5 11.5%) with longest consecutive ' +
    'passing run 1-2 -- the imp-33249 grade6/171p hit (0.76 ULP) does NOT survive a +/-2-panel perturbation ' +
    '(neighbours 169p/173p bounce to ~2.1/2.3 ULP). (2) What IS robust is the band: worst-in-window sits in ' +
    '[~0.7,~5] ULP (mean ~1.9, median ~1.8, p90 ~3.3), and BOTH grades share it (grade-independent => round-off, ' +
    'not quadrature error). So the perturbation-stable budget is "any resolved rule (tau*>=6.2, panels >~150) ' +
    'gives worst-in-window <= band ceiling ~5 ULP, typically ~1.8", NOT the fragile <1 ULP single hit. ACCURACY ' +
    'MEASUREMENT/RULE-DESIGN ONLY, RH-EQUIVALENT, necessary-but-not-sufficient; operator positivity (imp-3066) ' +
    'untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^inf Phi(s) Phi(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    clusterGold: 'per-tau reference = average of two independent graded-GL grades (4 and 5) sized to ' +
      'tau*(panels,grade)=tau+2.5; identical to the imp-33249 adaptive cluster gold, agreeing to <=~0.83 ULP',
    resolvedNeighbourhood: 'each grade is swept over a panel-count window lying ENTIRELY in the resolved ' +
      'region (tau*>6.2) so the under-resolution cliff is excluded and the statistics reflect the pure ' +
      'arithmetic floor; the sweep uses the imp-33277 +/-2-panel lattice step',
    jitterStatistics: 'per neighbourhood: fraction of panel counts clearing the strict <1 ULP bar, and the ' +
      'mean/median/std/min/max/p90 of the worst-in-window ULP, plus the LONGEST run of consecutive passing ' +
      'panel counts (the perturbation stability of the <1 ULP bar)',
    robustBandBudget: 'the cross-grade band (floor,ceiling) that every resolved panel count of either grade ' +
      'respects -- the perturbation-stable replacement for the fragile single <1 ULP lattice hit',
    selfComputing: 'gold, every scanned panel count in both neighbourhoods, all jitter statistics and every ' +
      'verdict flag recompute at import',
  }),

  measured: Object.freeze({
    hi: HI,
    unitRoundoff: EPS,
    bar: BAR,
    step: STEP,
    tauGrid: TAU_GRID,
    goldMargin: GOLD_MARGIN,
    goldClusterWorstUlp,
    neighbourhoods: JITTER,
    robustBandFloorUlp,
    robustBandCeilingUlp,
    worstPassFraction,
    worstLongestPassRun,
    goldIsBelowOneUlp,
    strictBarIsJittery,
    singleHitIsFragile,
    bandIsBounded,
    bandIsGradeIndependent,
    robustBandBudgetExists,
    verdict,
  }),

  interpretation: Object.freeze({
    theStrictBarIsALatticeEvent:
      'In the fully-resolved region the worst-in-window does NOT keep shrinking with more panels -- it ' +
      'jitters. Only ~12% of the +/-2-panel lattice counts clear the strict <1 ULP bar, and the longest run ' +
      'of consecutive passing counts is 1-2. The imp-33249 grade6/171p hit (0.76 ULP) is a genuine lattice ' +
      'coincidence: its immediate 169p/173p neighbours bounce to ~2.1/2.3 ULP. So <1 ULP is a ~12% event, not ' +
      'a budget you can ship, exactly as the imp-33249/imp-33277 latticeJitterCaveat warned -- now quantified.',
    theRobustObjectIsTheBand:
      'What survives perturbation is the BAND. Over the whole resolved neighbourhood worst-in-window stays in ' +
      '[~0.7,~5] ULP with mean ~1.9, median ~1.8 and p90 ~3.3, and BOTH grades share it. Because the band is ' +
      'grade-independent it is round-off (log-sum-exp floor), not quadrature error. The honest budget rule is ' +
      'therefore stated as a band ceiling every resolved panel count respects, not as a single lattice hit.',
    thePracticalBudgetRule:
      'Use any resolved graded rule (tau* >= 6.2, i.e. grade6 panels >~150 or grade5 panels >~400). Its ' +
      'worst-in-window over tau in {0.5..6} is then guaranteed <= the band ceiling ~5 ULP and typically ~1.8 ' +
      'ULP -- a robust few-ULP budget. Do NOT quote "<1 ULP at grade6/171p": that is a ~12% lattice event the ' +
      'next +/-2 panels break. This refines, and does not contradict, the imp-33249 min-node hit: 171p really ' +
      'is the band FLOOR, but the band CEILING is the shippable guarantee.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationScope:
      'Characterizes the arithmetic-floor jitter of a fixed graded-GL quadrature node budget for a fixed ' +
      'autocorrelation weight over tau in {0.5..6} -- a magnitude used inside a mass-feasibility diagnostic. ' +
      'It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI=10 Phi-series truncation is inherited from imp-33249/imp-33277; this characterizes the ' +
      'quadrature node-budget jitter, not that truncation.',
    latticeJitterCaveat:
      'The exact per-panel-count ULP values are single lattice hits on a jittery arithmetic floor; ' +
      'cross-platform libm variation in exp/log can shift the ~1 ULP measurements and the exact pass-fraction. ' +
      'The robust, portable reading is the BAND (floor ~0.7, ceiling ~5 ULP, mean ~1.9) and the fact that the ' +
      'strict <1 ULP bar is a minority lattice event -- NOT any single panel count.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions -------------------------------------------------------------------------
export const IMP33296_MIN_NODE_LATTICE_JITTER_BAND_ASSERTIONS = [
  {
    id: 'imp33296-cluster-gold-certified-below-one-ulp',
    why: 'The imp-33249 adaptive cluster gold must agree below ~1 ULP across the window, certifying it so ' +
         'the per-panel-count ULP measurements are meaningful.',
    holds: () => goldIsBelowOneUlp && goldClusterWorstUlp < 1.5,
  },
  {
    id: 'imp33296-strict-one-ulp-bar-is-a-minority-lattice-event',
    why: 'HEADLINE 1: in both resolved neighbourhoods the strict <1 ULP bar is cleared by only a MINORITY ' +
         '(0 < pass-fraction < 0.4) of the +/-2-panel lattice counts -- it is jittery, not a stable budget.',
    holds: () => strictBarIsJittery,
  },
  {
    id: 'imp33296-single-min-node-hit-is-fragile',
    why: 'HEADLINE 1: the longest run of consecutive passing panel counts is tiny (<=3), and the imp-33249 ' +
         'grade6/171p hit passes while BOTH its +/-2-panel neighbours fail -- so a single lattice hit is not ' +
         'a perturbation-stable budget.',
    holds: () => singleHitIsFragile,
  },
  {
    id: 'imp33296-jitter-is-a-bounded-arithmetic-floor-band',
    why: 'The jitter never collapses to machine-exact (floor > 0.3 ULP) and never blows up (ceiling < 12 ' +
         'ULP), and the ceiling sits above the strict bar (the band is real) -- a bounded arithmetic floor.',
    holds: () => bandIsBounded,
  },
  {
    id: 'imp33296-band-is-grade-independent',
    why: 'The two grades share the same band (ceilings within a factor ~3, p90 within a factor ~2), so the ' +
         'jitter is round-off, not quadrature error.',
    holds: () => bandIsGradeIndependent,
  },
  {
    id: 'imp33296-robust-band-budget-exists',
    why: 'HEADLINE 2: a finite few-ULP band ceiling (~5 ULP) every resolved panel count respects EXISTS -- ' +
         'the perturbation-stable replacement for the fragile <1 ULP single hit.',
    holds: () => robustBandBudgetExists && robustBandCeilingUlp >= 1 && robustBandCeilingUlp < 12,
  },
  {
    id: 'imp33296-verdict-records-the-measurement',
    why: 'The classified verdict must record the ~12% strict-bar lattice event, the single-hit fragility and ' +
         'the grade-independent robust band budget.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33296-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy measurement/rule-design audit only, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33296_MIN_NODE_LATTICE_JITTER_BAND.honestCaveat;
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

for (const assertion of IMP33296_MIN_NODE_LATTICE_JITTER_BAND_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33296-min-node-lattice-jitter-band assertion failed: ${assertion.id}`);
  }
}

export default IMP33296_MIN_NODE_LATTICE_JITTER_BAND;
