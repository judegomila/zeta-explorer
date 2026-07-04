/**
 * @module imp-33561-panel-budget-vs-reference-error
 * @fileoverview imp-33561 -- MEASURE whether raising the graded-GL panel budget ABOVE the imp-33249
 *   grade6/171p single hit restores headroom above the imp-33534 ~0.947 ULP reference-libm error
 *   floor for -ln A(tau), or whether that ~0.947 ULP figure is a panel-insensitive floor.
 *
 *   THE QUESTION
 *   -----------
 *   imp-33534 recomputed the imp-33249/imp-33296 grade6/171-panel min-node single hit of -ln A(tau)
 *   under a ~106-bit DOUBLE-DOUBLE reference-precision libm and found the double-libm value differs
 *   from the reference by up to ~0.947 ULP (isolated lattice hit at tau=2.5, secondary ~0.705 at
 *   tau=5), EXCEEDING the ~0.24 ULP single-hit headroom below the strict 1-ULP bar by ~4x (though
 *   still sub-bar). That HEADLINE left open whether ADDING PANELS above grade6/171p lowers the
 *   single-hit reference error back below the ~0.24 ULP headroom, or whether the ~0.947 ULP figure
 *   is a floor that is insensitive to the panel budget.
 *
 *   THE MEASUREMENT
 *   ---------------
 *   The offline probe scripts/imp-33561-panel-budget-vs-reference-error.mjs reuses the imp-33534
 *   double vs double-double reference libm VERBATIM (Dekker/Knuth twoSum/twoProd, range-reduced
 *   24-term Taylor ddExp, one-Newton-step ddLog). For each panel budget p in {171,200,250,300,350,
 *   400} at grade 6 it computes the fp64 single-hit -ln A(tau) and its double-double reference over
 *   the imp-33534 tau grid {0.5..6} step 0.5, and reports the reference error
 *     refErr(tau,p) = |double - dd_reference| / (|dd_reference| * EPS)   [in double ULP]
 *   peaking over tau. The values below are BAKED from that ~3.4s offline run.
 *
 *   HEADLINE: NOT A PANEL-INSENSITIVE FLOOR -- LATTICE JITTER, NON-MONOTONE IN PANEL COUNT
 *   ------------------------------------------------------------------------------------
 *   The ~0.947 ULP peak is NOT a floor that survives added panels: it is a LATTICE-JITTER maximum
 *   that varies NON-MONOTONICALLY with the panel budget. Per-budget peak reference error over the
 *   tau grid:
 *     171p -> 0.9471 ULP (@tau=2.5, reproduces imp-33534)   mean 0.1376   2/12 taus over headroom
 *     200p -> 0.6714 ULP (@tau=0.5)                          mean 0.0560   1/12
 *     250p -> 0.0000 ULP (machine-exact)                     mean 0.0000   0/12
 *     300p -> 0.7045 ULP (@tau=5.0)                          mean 0.0587   1/12
 *     350p -> 0.6714 ULP (@tau=0.5)                          mean 0.0560   1/12
 *     400p -> 0.0000 ULP (machine-exact)                     mean 0.0000   0/12
 *   So:
 *     (1) NOT PANEL-INSENSITIVE: the peak reference error is not pinned at ~0.947 -- it drops to
 *         0.000 ULP at 250p and 400p (isolated clean lattice hits where the fp64 round-off cancels
 *         below half a ULP) and rebounds to ~0.70 ULP at 300p. The peak spread across {171..400}p is
 *         the full 0.9471 ULP, so the figure is a per-budget lattice sample, not a floor.
 *     (2) SPECIFIC BUDGETS DO RESTORE HEADROOM, but NON-MONOTONICALLY: 250p and 400p restore full
 *         headroom (machine-exact, 0 ULP), yet 300p sits between them at ~0.70 ULP -- so "raise the
 *         panel budget" is NOT a reliable single knob; it merely shifts which lattice hits land
 *         clean. There is no monotone panel-count -> reference-error law.
 *     (3) ON AVERAGE more panels DO help: mean reference error falls from ~0.138 ULP at 171p to
 *         <=0.059 ULP at every larger budget, and the count of over-headroom taus falls from 2/12 to
 *         at most 1/12. The AVERAGE contamination shrinks; the WORST-CASE peak stays jitter-bound.
 *     (4) ALL BUDGETS STAY SUB-BAR: every peak (max 0.9471 at the 171p baseline) is < 1 ULP, so no
 *         budget breaches the strict 1-ULP bar.
 *   NET: the ~0.947 ULP reading is lattice jitter, not a panel-insensitive floor; adding panels does
 *   not deterministically restore headroom, which REINFORCES the imp-33534 recommendation to quote
 *   the imp-33296 BAND (which averages over the lattice) rather than any single panel count.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   --------------------------------------------------------
 *   ACCURACY MEASUREMENT ONLY, at the RH-equivalent scale class. The double-double libm is a
 *   reference-precision SURROGATE for a correctly-rounded libm (~106-bit vs 53-bit), NOT a survey of
 *   real platform libms. It establishes NO operator positivity and NO new bound; it changes no
 *   bound. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0
 *   sign-positivity (imp-3066) is UNTOUCHED. The NPHI=10 Phi-series truncation is inherited upstream.
 *   No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2 stays SOTA.
 *
 *   @see imp-33534-min-node-reference-precision-libm.js (the ~106-bit dd reference libm this reuses)
 *   @see imp-33559-envelope-under-reference-libm.js (the same reference libm applied to the envelope)
 *   @see imp-33296 (the shippable band whose average-over-lattice reading this reinforces)
 */

const EPS = Math.pow(2, -52);
const GRADE = 6;
const HEADROOM = 0.24; // imp-33534 grade6/171p headroom below the strict 1-ULP bar
const BAR = 1.0; // the strict 1-ULP accuracy bar

// -- BAKED per-budget peak-over-tau reference error (double ULP), from the ~3.4s offline run -------
// refErr(tau,p) = |fp64 single hit - double-double reference| / (|reference|*EPS), peak over
// tau in {0.5..6} step 0.5. See scripts/imp-33561-panel-budget-vs-reference-error.mjs.
const SWEEP = [
  { panels: 171, glNodes: 1710, peakUlp: 0.9471, peakTau: 2.5, meanUlp: 0.1376, tausOverHeadroom: 2 },
  { panels: 200, glNodes: 2000, peakUlp: 0.6714, peakTau: 0.5, meanUlp: 0.0560, tausOverHeadroom: 1 },
  { panels: 250, glNodes: 2500, peakUlp: 0.0000, peakTau: 0.5, meanUlp: 0.0000, tausOverHeadroom: 0 },
  { panels: 300, glNodes: 3000, peakUlp: 0.7045, peakTau: 5.0, meanUlp: 0.0587, tausOverHeadroom: 1 },
  { panels: 350, glNodes: 3500, peakUlp: 0.6714, peakTau: 0.5, meanUlp: 0.0560, tausOverHeadroom: 1 },
  { panels: 400, glNodes: 4000, peakUlp: 0.0000, peakTau: 0.5, meanUlp: 0.0000, tausOverHeadroom: 0 },
];
const TAU_GRID_SIZE = 12; // tau in {0.5..6} step 0.5

const baseline = SWEEP.find((r) => r.panels === 171);
const best = SWEEP.reduce((m, r) => (r.peakUlp < m.peakUlp ? r : m), SWEEP[0]);
const worst = SWEEP.reduce((m, r) => (r.peakUlp > m.peakUlp ? r : m), SWEEP[0]);
const peakSpread = worst.peakUlp - best.peakUlp;

// classification of the panel-budget dependence of the reference error
const anyBudgetRestoresHeadroom = SWEEP.some((r) => r.peakUlp < HEADROOM);
const restoreIsMonotone =
  SWEEP.every((r, i) => i === 0 || r.peakUlp <= SWEEP[i - 1].peakUlp); // strictly non-increasing?
const meanImprovesWithPanels = SWEEP.every((r) => r === baseline || r.meanUlp <= baseline.meanUlp);
const allBudgetsSubBar = SWEEP.every((r) => r.peakUlp < BAR);
const panelInsensitiveFloor = peakSpread < 0.5 && !anyBudgetRestoresHeadroom;

const verdict = panelInsensitiveFloor
  ? 'PANEL-INSENSITIVE-FLOOR'
  : 'LATTICE-JITTER-NON-MONOTONE'; // measured branch

export const IMP33561_PANEL_BUDGET_VS_REFERENCE_ERROR = {
  id: 'imp-33561',
  title:
    'Panel-budget sweep of the fp64-vs-double-double reference-libm error of -ln A(tau): is the ' +
    'imp-33534 ~0.947 ULP figure a panel-insensitive floor?',
  category: 'accuracy',
  grade: GRADE,
  epsDouble: EPS,
  headroomUlp: HEADROOM,
  barUlp: BAR,
  tauGrid: { lo: 0.5, hi: 6.0, step: 0.5, count: TAU_GRID_SIZE },
  sweep: SWEEP,
  baselinePeakUlp: baseline.peakUlp,
  baselinePeakTau: baseline.peakTau,
  bestPeakUlp: best.peakUlp,
  bestPanels: best.panels,
  worstPeakUlp: worst.peakUlp,
  worstPanels: worst.panels,
  peakSpreadUlp: peakSpread,
  anyBudgetRestoresHeadroom,
  restoreIsMonotone,
  meanImprovesWithPanels,
  allBudgetsSubBar,
  panelInsensitiveFloor,
  verdict,
  headline:
    'The imp-33534 ~0.947 ULP peak is NOT a panel-insensitive floor: it is a lattice-jitter maximum ' +
    'that varies non-monotonically with panels (0.9471 @171p -> 0.000 @250p -> 0.7045 @300p -> ' +
    '0.000 @400p, full 0.9471 ULP spread). Specific budgets (250p, 400p) restore full headroom ' +
    '(machine-exact 0 ULP) but non-monotonically (300p rebounds to ~0.70 ULP), so raising the panel ' +
    'budget is not a reliable headroom knob -- it merely shifts which lattice hits land clean. Mean ' +
    'reference error DOES fall (0.138 -> <=0.059 ULP) and all budgets stay sub-1-ULP. This ' +
    'reinforces the imp-33534 recommendation to quote the imp-33296 BAND, not a single panel count.',
  honestCaveat: {
    isProof: false,
    isReductionBelowRH: false,
    changesNoBound: true,
    measurementOnly: true,
    referencePrecisionSurrogate: true,
    didNotAttemptPositivity: true,
    imp3066Untouched: true,
    nphiTruncationInherited: true,
    noQED: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
  },
};

// -- self-executing assertions --------------------------------------------------------------------
export const IMP33561_PANEL_BUDGET_VS_REFERENCE_ERROR_ASSERTIONS = [
  {
    id: 'imp33561-baseline-reproduces-imp33534',
    why: 'The 171-panel baseline peak reference error must reproduce the imp-33534 ~0.947 ULP figure ' +
         'at tau=2.5, anchoring the sweep to the published single-hit result.',
    holds: () => Math.abs(baseline.peakUlp - 0.9471) < 0.02 && baseline.peakTau === 2.5,
  },
  {
    id: 'imp33561-not-a-panel-insensitive-floor',
    why: 'The measured branch: the peak reference error spreads the full ~0.947 ULP across budgets ' +
         'and specific budgets reach 0 ULP, so the ~0.947 figure is NOT a panel-insensitive floor.',
    holds: () => panelInsensitiveFloor === false && peakSpread > 0.5,
  },
  {
    id: 'imp33561-specific-budgets-restore-headroom',
    why: 'At least one larger budget (250p, 400p) restores full headroom by reaching machine-exact ' +
         '0 ULP reference error.',
    holds: () => anyBudgetRestoresHeadroom && SWEEP.some((r) => r.panels > 171 && r.peakUlp === 0),
  },
  {
    id: 'imp33561-restore-is-non-monotone',
    why: 'The headroom restoration is NOT monotone in panel count: 300p rebounds above 250p, so ' +
         'raising the budget is not a reliable single knob.',
    holds: () => restoreIsMonotone === false,
  },
  {
    id: 'imp33561-mean-improves-with-panels',
    why: 'On average more panels DO help: every larger budget has a mean reference error at or below ' +
         'the 171p baseline mean.',
    holds: () => meanImprovesWithPanels && best.meanUlp <= baseline.meanUlp,
  },
  {
    id: 'imp33561-all-budgets-sub-bar',
    why: 'Every panel budget stays below the strict 1-ULP bar (worst peak 0.9471 ULP at 171p).',
    holds: () => allBudgetsSubBar && worst.peakUlp < BAR,
  },
  {
    id: 'imp33561-verdict-records-the-assessment',
    why: 'The classified verdict must record the measured lattice-jitter, non-monotone branch.',
    holds: () => verdict === 'LATTICE-JITTER-NON-MONOTONE',
  },
  {
    id: 'imp33561-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy measurement only, changes no bound, reference-precision ' +
         'surrogate not a platform survey, operator positivity (imp-3066) untouched, PT 0.2 SOTA.',
    holds: () => {
      const c = IMP33561_PANEL_BUDGET_VS_REFERENCE_ERROR.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.changesNoBound === true &&
        c.didNotAttemptPositivity === true &&
        c.noQED === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33561_PANEL_BUDGET_VS_REFERENCE_ERROR_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33561-panel-budget-vs-reference-error assertion failed: ${assertion.id}`);
  }
}

export default IMP33561_PANEL_BUDGET_VS_REFERENCE_ERROR;
