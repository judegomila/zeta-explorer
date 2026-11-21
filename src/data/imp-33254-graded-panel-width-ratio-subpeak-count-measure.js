/**
 * @module imp-33254-graded-panel-width-ratio-subpeak-count-measure
 * @fileoverview imp-33254 -- MEASURE the imp-33232 ROOT-CAUSE claim quantitatively. imp-33232
 *   attributed the steep-grade full-window failure (grade6/7/8 minimal graded-GL budgets missing
 *   tau=6 by ~157/3548/15400 ULP despite the innermost-panel crossover tau*(panels,grade)>=6) to a
 *   ROOT CAUSE stated only QUALITATIVELY: "consecutive graded panel widths jump ~(j+1/j)^grade ~
 *   2^grade near s=0, so at grade 8 the second panel is already ~256x the peak scale and only ~ONE
 *   sub-peak panel exists, while resolving the collapsing peak to 1 ULP empirically needs
 *   panels >= ~342 (grade <= 5)". This module MEASURES the two numbers behind that claim -- the
 *   consecutive panel-width ratios W_i/W_(i-1) near the origin, and the count of sub-peak panels
 *   (width below the tightest peak scale sigma(6) = 1/(4 pi e^24) = 3.00e-12) -- for each tabulated
 *   minimal (panels,grade) budget, confirming or correcting the ~2^grade jump and the
 *   one-sub-peak-panel reading.
 *
 *   THE PANEL GEOMETRY (identical to imp-3919/imp-33232)
 *   ---------------------------------------------------
 *   The graded-GL rule tiles [0, hi] with power-graded panels: panel i is [a_i, b_i] with
 *   a_i = hi*(i/P)^grade, b_i = hi*((i+1)/P)^grade, so its width is
 *       W_i = hi/P^grade * [(i+1)^grade - i^grade].
 *   Innermost panel W_0 = hi*(1/P)^grade is the w_inner the crossover tau*>=6 forces below sigma(6).
 *
 *   WHAT THE MEASUREMENT FINDS
 *   -------------------------
 *   (1) The ~2^grade jump is CONFIRMED and SHARPENED to an EXACT closed form. The first
 *       consecutive width ratio is grade-exact:
 *           W_1 / W_0 = 2^grade - 1  =  {g3:7, g4:15, g5:31, g6:63, g7:127, g8:255},
 *       matching imp-33232 rough "~2^grade / (j+1/j)^grade at j=1" to within the -1 correction.
 *       The general ratio is W_j/W_(j-1) = [(j+1)^grade - j^grade]/[j^grade - (j-1)^grade]; the
 *       imp-33232 approximation ((j+1)/j)^grade is only accurate at the FIRST ratio (large grade),
 *       overshooting from j>=2 (e.g. g3,j=2: rough (3/2)^3=3.375 vs exact 19/7=2.714).
 *   (2) The one-sub-peak-panel reading is CONFIRMED at grade 8 (exactly 1 panel has width < sigma(6))
 *       -- but the MEASUREMENT CORRECTS the framing: the sub-peak-panel COUNT is 1 for EVERY minimal
 *       budget grade3..8, not just grade 8. This is forced by the crossover sizing: the budget puts
 *       W_0 just BELOW sigma(6) (W_0/sigma(6) = 0.87..1.00) while W_1 = (2^grade-1)*W_0 is >= ~7*
 *       sigma(6) for every grade, so exactly one panel ever falls under the peak scale. Hence the
 *       sub-peak-panel COUNT does NOT by itself separate the passing grade<=5 rows from the failing
 *       grade>=6 rows.
 *   (3) The genuine monotone driver is the LONE SUPER-PEAK PANEL SPAN. The single panel immediately
 *       above the peak spans W_1/sigma(6) = (2^grade-1)*(W_0/sigma(6)) peak-widths:
 *           g3:6.99  g4:14.97  g5:30.88  g6:60.83  g7:120.73  g8:222.04.
 *       At grade 8 one GL-10 panel must carry the collapsing peak's shoulder across ~222 peak widths,
 *       ~7x coarser than grade 5 (~30.9). THAT exponentially widening lone panel -- not a dwindling
 *       sub-peak count -- is what a single GL-10 panel cannot resolve to 1 ULP. So imp-33232's root
 *       cause is directionally right (the second panel is ~2^grade x the peak scale) but the precise
 *       mechanism is a super-peak panel whose span grows ~2^grade, with the sub-peak count pinned at 1.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   --------------------------------------------------------
 *   MEASUREMENT ONLY, at the RH-equivalent scale class. It quantifies the panel geometry behind a
 *   quadrature-rule accuracy audit; it establishes NO operator positivity and touches no bound.
 *   Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a &gt;= 0 sign-positivity
 *   (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED.
 *   No refereed bound is changed.
 *
 *   @see imp-33232-a-weight-fixed-graded-gl-budget-full-window-verify.js (the qualitative root cause)
 *   @see imp-3919-a-weight-fixed-graded-gl-crossover-budget-tau6.js (the crossover + minimal budget)
 *
 *   Ticket: imp-33254 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const PI = Math.PI;
const HI = 14; // the imp-3873/imp-3897/imp-3919/imp-33232 graded-GL outer cutoff (fixed)

// The tightest clean-window peak scale: sigma(tau) = 1/(4 pi e^{4 tau}) at tau = 6.
const SIGMA6 = 1 / (4 * PI * Math.exp(24));

// The imp-3919/imp-33232 tabulated minimal (panels,grade) budgets (tau*(panels,grade) >= 6).
const GRADES = [3, 4, 5, 6, 7, 8];
const MIN_PANELS = { 3: 16704, 4: 1470, 5: 342, 6: 130, 7: 65, 8: 39 };

// Panel width for panel i of a P-panel grade-g power-graded rule on [0, hi].
const panelWidth = (i, P, grade) => HI * (Math.pow((i + 1) / P, grade) - Math.pow(i / P, grade));
// Exact consecutive-width ratio W_j/W_(j-1) = [(j+1)^g - j^g] / [j^g - (j-1)^g].
const exactWidthRatio = (j, grade) =>
  (Math.pow(j + 1, grade) - Math.pow(j, grade)) / (Math.pow(j, grade) - Math.pow(j - 1, grade));
// imp-33232 rough approximation ((j+1)/j)^grade.
const roughWidthRatio = (j, grade) => Math.pow((j + 1) / j, grade);

// -- (A) Per-grade measurement ------------------------------------------------------------------
const MEASURED = GRADES.map((grade) => {
  const P = MIN_PANELS[grade];
  const w0 = panelWidth(0, P, grade);
  const w1 = panelWidth(1, P, grade);
  const w2 = panelWidth(2, P, grade);

  // Consecutive width ratios (measured) vs the exact closed form and the imp-33232 rough form.
  const ratio10 = w1 / w0; // first jump: EXACT value is 2^grade - 1
  const ratio21 = w2 / w1;

  // Count sub-peak panels: contiguous leading panels whose width is below the peak scale sigma(6).
  let subPeakPanels = 0;
  for (let i = 0; i < P; i += 1) {
    if (panelWidth(i, P, grade) < SIGMA6) subPeakPanels += 1;
    else break;
  }

  return Object.freeze({
    grade,
    panels: P,
    w0,
    w0OverSigma6: w0 / SIGMA6, // just below 1 by crossover construction
    w1,
    firstJumpMeasured: ratio10,
    firstJumpExact: Math.pow(2, grade) - 1, // W_1/W_0 = 2^grade - 1 exactly
    firstJumpRough: Math.pow(2, grade), // imp-33232 ~2^grade / (j+1/j)^grade at j=1
    secondRatioMeasured: ratio21,
    secondRatioExact: exactWidthRatio(2, grade),
    secondRatioRough: roughWidthRatio(2, grade), // ((3)/(2))^grade -- the rough form overshoots here
    subPeakPanels, // sub-peak-panel COUNT (width < sigma(6))
    superPeakSpan: w1 / SIGMA6, // the lone above-peak panel span in peak-widths (the real driver)
  });
});

// -- (B) Verdict classifiers --------------------------------------------------------------------
// (1) The first consecutive width ratio equals the EXACT 2^grade - 1 for every grade (the sharp
//     form of imp-33232 "~2^grade" jump), to double-precision.
const firstJumpIsExactTwoPowGradeMinusOne = MEASURED.every(
  (r) => Math.abs(r.firstJumpMeasured - r.firstJumpExact) < 1e-9 * r.firstJumpExact,
);
// (2) EVERY minimal budget grade3..8 has EXACTLY ONE sub-peak panel -- so the one-sub-peak reading
//     holds at grade 8 but the COUNT is grade-invariant (the correction to the qualitative claim).
const exactlyOneSubPeakPanelEveryGrade = MEASURED.every((r) => r.subPeakPanels === 1);
// (3) The genuine monotone driver -- the lone super-peak panel span W_1/sigma(6) -- rises strictly
//     with grade, from ~7 (grade3) to ~222 (grade8).
const superPeakSpanRisesWithGrade = MEASURED.every(
  (r, i) => i === 0 || r.superPeakSpan > MEASURED[i - 1].superPeakSpan,
);
const grade8SpanOver200 = MEASURED[MEASURED.length - 1].superPeakSpan > 200;
// (4) The imp-33232 rough ((j+1)/j)^grade form matches the FIRST ratio (~2^grade) but overshoots the
//     SECOND (exact) ratio for every grade -- so the rough form is a first-ratio approximation only.
const roughFormOnlyGoodAtFirstRatio = MEASURED.every(
  (r) => r.secondRatioRough > r.secondRatioExact,
);

const verdict =
  firstJumpIsExactTwoPowGradeMinusOne &&
  exactlyOneSubPeakPanelEveryGrade &&
  superPeakSpanRisesWithGrade &&
  grade8SpanOver200 &&
  roughFormOnlyGoodAtFirstRatio
    ? 'imp-33232s-ROOT-CAUSE-MEASURED:-THE-~2^grade-JUMP-IS-CONFIRMED-AND-SHARPENED-TO-THE-EXACT-W1/W0=2^grade-1' +
      '-{g3:7,g4:15,g5:31,g6:63,g7:127,g8:255};-THE-ONE-SUB-PEAK-PANEL-READING-HOLDS-AT-GRADE-8-BUT-THE-COUNT' +
      '-IS-GRADE-INVARIANT-(EXACTLY-1-FOR-EVERY-MINIMAL-BUDGET-grade3..8,-BECAUSE-THE-CROSSOVER-PUTS-W0-JUST' +
      '-BELOW-sigma(6)-WHILE-W1=(2^grade-1)W0>=~7sigma(6)-ALWAYS);-THE-GENUINE-MONOTONE-DRIVER-IS-THE-LONE' +
      '-SUPER-PEAK-PANEL-SPAN-W1/sigma(6)-RISING-6.99->222.04-ACROSS-grade3..8,-SO-A-SINGLE-GL-10-PANEL-MUST' +
      '-CARRY-THE-PEAK-SHOULDER-ACROSS-~222-PEAK-WIDTHS-AT-grade8-(~7x-grade5).-imp-33232-DIRECTIONALLY-RIGHT' +
      '-(SECOND-PANEL-~2^grade-x-PEAK-SCALE)-BUT-THE-MECHANISM-IS-AN-EXPONENTIALLY-WIDENING-LONE-PANEL,-NOT-A' +
      '-DWINDLING-SUB-PEAK-COUNT-(PINNED-AT-1);-THE-((j+1)/j)^grade-ROUGH-FORM-IS-A-FIRST-RATIO-APPROXIMATION-ONLY'
    : 'INDETERMINATE';

export const IMP33254_GRADED_PANEL_WIDTH_RATIO_SUBPEAK_COUNT_MEASURE = Object.freeze({
  id: 'imp-33254-graded-panel-width-ratio-subpeak-count-measure',
  ticket: 'imp-33254',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  measuresModule: 'imp-33232-a-weight-fixed-graded-gl-budget-full-window-verify.js',

  summary:
    'MEASURES the two numbers behind imp-33232s qualitative root cause for the steep-grade full-window ' +
    'failure: the consecutive graded panel-width ratios W_i/W_(i-1) near s=0, and the count of ' +
    'sub-peak panels (width < peak scale sigma(6)=3.00e-12), for each tabulated minimal (panels,grade) ' +
    'budget {g3:16704p,g4:1470p,g5:342p,g6:130p,g7:65p,g8:39p}. Finding: the ~2^grade jump is CONFIRMED ' +
    'and sharpened to the EXACT W_1/W_0 = 2^grade-1 {7,15,31,63,127,255}; the one-sub-peak-panel reading ' +
    'holds at grade 8 (exactly 1) but the COUNT is grade-invariant -- EVERY minimal budget grade3..8 has ' +
    'exactly one sub-peak panel because the crossover sizes W_0 just below sigma(6) while ' +
    'W_1=(2^grade-1)W_0 >= ~7 sigma(6) always. The genuine monotone driver is the LONE super-peak panel ' +
    'span W_1/sigma(6), rising 6.99 -> 222.04 across grade3..8: at grade 8 a single GL-10 panel must carry ' +
    'the peak shoulder across ~222 peak-widths (~7x grade 5). So imp-33232 is directionally right (second ' +
    'panel ~2^grade x peak scale) but the mechanism is an exponentially widening lone panel, not a ' +
    'dwindling sub-peak count. MEASUREMENT ONLY, RH-EQUIVALENT, necessary-but-not-sufficient; operator ' +
    'positivity (imp-3066) untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    panelGeometry: 'panel i of a P-panel grade-g power-graded rule on [0,hi] is [hi*(i/P)^g, hi*((i+1)/P)^g], width W_i = hi/P^g * [(i+1)^g - i^g]',
    widthRatios: 'measure W_1/W_0 and W_2/W_1 at each minimal budget and compare to the exact ratio [(j+1)^g-j^g]/[j^g-(j-1)^g] and to imp-33232s rough ((j+1)/j)^g',
    subPeakCount: 'count contiguous leading panels with width below the tightest peak scale sigma(6)=1/(4 pi e^24)=3.00e-12',
    superPeakSpan: 'record the lone above-peak panel span W_1/sigma(6) = (2^g-1)*(W_0/sigma(6)) in peak-widths -- the quantity that actually rises with grade',
    selfComputing: 'every ratio, count and span recomputes at import from the panel geometry; no offline literal is used as an input',
  }),

  measured: Object.freeze({
    hi: HI,
    sigma6: SIGMA6,
    grades: GRADES,
    minPanels: MIN_PANELS,
    perGrade: MEASURED,
    firstJumpIsExactTwoPowGradeMinusOne,
    exactlyOneSubPeakPanelEveryGrade,
    superPeakSpanRisesWithGrade,
    grade8SpanOver200,
    roughFormOnlyGoodAtFirstRatio,
    verdict,
  }),

  interpretation: Object.freeze({
    theJumpIsExactNotJustApproximate:
      'imp-33232 read the near-origin panel-width jump as "~2^grade". The measurement pins the FIRST ' +
      'consecutive width ratio to the EXACT closed form W_1/W_0 = 2^grade - 1 (7,15,31,63,127,255), so ' +
      'the qualitative ~2^grade is the leading term of an exact grade-integer sequence.',
    subPeakCountIsGradeInvariant:
      'The one-sub-peak-panel reading holds at grade 8, but the measurement shows it holds at EVERY ' +
      'grade: the crossover sizes W_0 just below sigma(6) while W_1 = (2^grade-1)*W_0 is always at ' +
      'least ~7 sigma(6), so exactly one panel is ever sub-peak. The sub-peak COUNT therefore cannot ' +
      'by itself explain why grade<=5 passes and grade>=6 fails -- it is 1 throughout.',
    theRealDriverIsTheLoneSuperPeakSpan:
      'What actually worsens monotonically with grade is the span of the SINGLE panel just above the ' +
      'peak: W_1/sigma(6) climbs 6.99 -> 14.97 -> 30.88 -> 60.83 -> 120.73 -> 222.04 across grade3..8. ' +
      'At grade 8 one GL-10 panel must integrate the collapsing peak shoulder across ~222 peak-widths, ' +
      '~7x coarser than grade 5, which a single 10-node rule cannot resolve to 1 ULP -- the precise, ' +
      'measured form of imp-33232s "single sub-peak panel cannot carry the collapsing peak".',
    roughFormIsFirstRatioOnly:
      'imp-33232s ((j+1)/j)^grade approximation matches the first ratio (~2^grade) but overshoots the ' +
      'exact second ratio for every grade (e.g. g3: rough 3.375 vs exact 2.714), so it is a ' +
      'first-consecutive-ratio approximation, not a uniform panel-width-ratio law.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    measurementOnly: true,
    derivationScope:
      'Quantifies the panel geometry (consecutive width ratios and sub-peak-panel count) behind a ' +
      'graded-GL quadrature-rule accuracy audit. It changes no bound and establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------------------------
export const IMP33254_GRADED_PANEL_WIDTH_RATIO_SUBPEAK_COUNT_MEASURE_ASSERTIONS = [
  {
    id: 'imp33254-first-jump-is-exact-2powgrade-minus-1',
    why: 'The first consecutive graded panel-width ratio must equal the EXACT 2^grade - 1 for every ' +
         'minimal budget (7,15,31,63,127,255) -- the sharp form of imp-33232 "~2^grade" jump.',
    holds: () => firstJumpIsExactTwoPowGradeMinusOne,
  },
  {
    id: 'imp33254-exactly-one-sub-peak-panel-every-grade',
    why: 'THE CORRECTION: every minimal budget grade3..8 must have EXACTLY ONE sub-peak panel ' +
         '(width < sigma(6)) -- so the one-sub-peak reading holds at grade 8 but the COUNT is ' +
         'grade-invariant and does not by itself separate the passing from the failing rows.',
    holds: () => exactlyOneSubPeakPanelEveryGrade,
  },
  {
    id: 'imp33254-super-peak-span-rises-with-grade',
    why: 'The genuine monotone driver -- the lone above-peak panel span W_1/sigma(6) -- must rise ' +
         'strictly with grade and exceed ~200 peak-widths at grade 8.',
    holds: () => superPeakSpanRisesWithGrade && grade8SpanOver200,
  },
  {
    id: 'imp33254-rough-form-is-first-ratio-only',
    why: 'imp-33232s ((j+1)/j)^grade rough form must overshoot the exact SECOND width ratio for every ' +
         'grade, showing it is a first-consecutive-ratio approximation, not a uniform ratio law.',
    holds: () => roughFormOnlyGoodAtFirstRatio,
  },
  {
    id: 'imp33254-verdict-records-measurement',
    why: 'The classified verdict must record that the ~2^grade jump is confirmed/sharpened, the ' +
         'sub-peak count is grade-invariant at 1, and the real driver is the widening lone super-peak panel.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33254-honest-measurement-not-a-verdict',
    why: 'Mandatory honesty: measurement only, mass-feasibility necessary-but-not-sufficient, operator ' +
         'positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33254_GRADED_PANEL_WIDTH_RATIO_SUBPEAK_COUNT_MEASURE.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.measurementOnly === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33254_GRADED_PANEL_WIDTH_RATIO_SUBPEAK_COUNT_MEASURE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33254-graded-panel-width-ratio-subpeak-count-measure assertion failed: ${assertion.id}`);
  }
}

export default IMP33254_GRADED_PANEL_WIDTH_RATIO_SUBPEAK_COUNT_MEASURE;
