/**
 * @fileoverview imp-96686 -- accuracy/consistency audit of every consumer that cites a Route M
 * lam_max "overstatement" / trace-domination gap MULTIPLIER, checking that each states WHICH of the
 * two distinct imp-96548 quantities it reports:
 *
 *   (A) the ~1.92x VALUE ratio   = rigorous(N)/measured(N) of the two lam_max CURVES at N=6000
 *                                  (11.6948 / 6.0924 = 1.9195), and
 *   (B) the ~1.58x CEILING ratio = measuredFitCeilingN / rigorousTraceCeilingN of the two
 *                                  double-precision conditioning-ceiling N estimates
 *                                  (4.11e7 / 2.59e7 = 1.578, IMP96548_CEILING.ratioMeasuredOverRigorous).
 *
 * Both are correct quantities from the same imp-96548 record but answer different questions; the
 * imp-96581 HONESTY NOTE flagged that imp-96548 prose pairs the 1.58x number with the N=6000 rung,
 * where the true value ratio is 1.92x. This module enumerates every src/ consumer of such a figure
 * and flags each as CORRECT (states which quantity), MISLABEL (conflates A with B), or SAFE
 * (qualitative, quotes no bare multiplier / reports an unrelated ratio).
 *
 * METHOD. Static grep of src/ for the figures (1.58 / 1.92 / 11.69 / 6.09 / "overstat") in a Route M
 * lam_max context, reading each hit in situ. No re-derivation; the value ratio and ceiling ratio are
 * recomputed here only from the imp-96548 inputs carried as literals, to prove the two are distinct.
 *
 * FINDINGS.
 *   1. imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (SOURCE finding). FINDING 2 prose
 *      (JSDoc ~line 38-40): "At the top accessible rung N=6000 the rigorous bound gives
 *      lam_max <= 11.6948 ... against the measured lam_max ~ 6.09, so trace domination OVERSTATES
 *      lam_max by ~1.58x there". MISLABEL: at N=6000 the value ratio is 11.6948/6.0924 = ~1.92x; the
 *      1.58x belongs to the CEILING-N ratio (FINDING 3), not the N=6000 curve values. Recommend:
 *      change "~1.58x there" to "~1.92x there" (keep 1.58x for the ceiling shift in FINDING 3).
 *   2. imp-96574-spd-trace-domination-log-shape-glossary-headword.js (USER-FACING glossary). Both the
 *      JSDoc (~line 28) and the rendered definition string (~line 78-79) read "At N = 6000, trace
 *      domination gives lam_max <= 11.69 versus the measured ~6.09 (a ~1.58x overstatement)".
 *      MISLABEL: same conflation -- 11.69/6.09 = ~1.92x, not 1.58x. The SAME headword later
 *      (~line 39 / ~line 86) correctly uses 1.58 for the ceiling shift 4.11e7 -> 2.59e7, so the
 *      headword contains both the right and the wrong use of 1.58. Recommend: change the N=6000
 *      value-ratio "~1.58x overstatement" to "~1.92x overstatement" in both the JSDoc and the
 *      definition string; leave the ceiling-shift factor 1.58 untouched. Highest priority: this is
 *      the only user-visible surface with the wrong number.
 *   3. imp-96581-route-m-lammax-rigorous-vs-measured-viz-data.js + its page
 *      Imp96581RouteILammaxRigorousVsMeasuredViz.jsx. CORRECT: exports valueOverstatementRatio
 *      (~1.92x, curve values at N=6000) and ceilingOverstatementRatio (~1.58x, IMP96548_CEILING) as
 *      SEPARATE fields, and the page renders both with explicit "value" vs "ceiling" wording. This is
 *      the reference labelling the other two should match. No fix.
 *   4. imp-96480-route-m-lammax-glossary-headword.js (~line 75). SAFE: says the trace-family
 *      "coefficient overstated lam_max" qualitatively and quotes NO bare multiplier, so there is no
 *      number to conflate. No fix.
 *   5. imp-96399-route-m-reach-reprice-viz-data.js (~line 24): overstatementFactor = 10000/5355
 *      ~1.868x. SAFE but adjacent: this is a DIFFERENT quantity (a Route M reach-reprice N ratio, not
 *      the lam_max value/ceiling ratio); it is labelled correctly within its own module and is not a
 *      conflation of A and B. Flagged only so the nearby ~1.87x is not later mistaken for the
 *      lam_max value ratio ~1.92x. No fix.
 *
 * VERDICT. Two genuine mislabels (imp-96548 FINDING 2 prose and the imp-96574 glossary headword, the
 * latter user-facing) both quote the ~1.58x CEILING ratio while describing the N=6000 CURVE-VALUE
 * gap, whose true ratio is ~1.92x. One consumer (imp-96581 + page) already labels the two quantities
 * distinctly and is the correct template. Two further references (imp-96480 qualitative; imp-96399 a
 * distinct reach ratio) do not conflate. This audit changes no bound, establishes no operator
 * positivity, and asserts no QED; no refereed bound is changed. RH open.
 */

// imp-96548 inputs carried as literals (NOT imported) so this audit is self-contained and its
// distinctness proof does not depend on another module executing.
const I11 = 1.2606614015078126; // Gram diagonal numerator I(1,1); rigorous trace slope
const GAMMA = 0.5772156649015329; // Euler-Mascheroni
const MEAS_A = 3.0246914027257246; // imp-96443 fit intercept
const MEAS_B = 0.3526253785070698; // imp-96443 fit slope
const CEILING_RATIO = 1.5776; // IMP96548_CEILING.ratioMeasuredOverRigorous (~4.11e7 / ~2.59e7)

const rigorousLamMax = (N) => I11 * (Math.log(N) + GAMMA);
const measuredLamMax = (N) => MEAS_A + MEAS_B * Math.log(N);
const N6000_VALUE_RATIO = rigorousLamMax(6000) / measuredLamMax(6000); // ~1.9195

const AUDITED = Object.freeze([
  Object.freeze({
    consumer: 'imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js',
    kind: 'source finding (JSDoc FINDING 2 prose)',
    figureQuoted: '~1.58x',
    quantityDescribed: 'N=6000 curve-value gap (rigorous 11.6948 vs measured ~6.09)',
    correctFigure: '~1.92x (value ratio); 1.58x is the ceiling-N ratio',
    verdict: 'MISLABEL',
    recommendedFix:
      'in FINDING 2, change "OVERSTATES lam_max by ~1.58x there" to "~1.92x there"; keep 1.58x for the FINDING 3 ceiling shift.',
    userFacing: false,
  }),
  Object.freeze({
    consumer: 'imp-96574-spd-trace-domination-log-shape-glossary-headword.js',
    kind: 'glossary headword (JSDoc + rendered definition string)',
    figureQuoted: '~1.58x',
    quantityDescribed: 'N=6000 curve-value gap (lam_max <= 11.69 vs measured ~6.09)',
    correctFigure: '~1.92x (value ratio); 1.58x is the ceiling-N ratio',
    verdict: 'MISLABEL',
    recommendedFix:
      'change the N=6000 value-ratio "~1.58x overstatement" to "~1.92x overstatement" in both the JSDoc and the definition string; leave the ceiling-shift factor 1.58 (4.11e7 -> 2.59e7) untouched.',
    userFacing: true,
  }),
  Object.freeze({
    consumer: 'imp-96581-route-m-lammax-rigorous-vs-measured-viz-data.js + Imp96581RouteILammaxRigorousVsMeasuredViz.jsx',
    kind: 'viz-data leaf + page',
    figureQuoted: '~1.92x (value) AND ~1.58x (ceiling), separate fields',
    quantityDescribed: 'both quantities, explicitly distinguished',
    correctFigure: 'n/a -- already distinct',
    verdict: 'CORRECT',
    recommendedFix: 'none; this is the reference labelling for the other consumers.',
    userFacing: true,
  }),
  Object.freeze({
    consumer: 'imp-96480-route-m-lammax-glossary-headword.js',
    kind: 'glossary headword (qualitative)',
    figureQuoted: 'none (qualitative "coefficient overstated lam_max")',
    quantityDescribed: 'qualitative overstatement, no multiplier',
    correctFigure: 'n/a -- no bare multiplier',
    verdict: 'SAFE',
    recommendedFix: 'none; quotes no number to conflate.',
    userFacing: true,
  }),
  Object.freeze({
    consumer: 'imp-96399-route-m-reach-reprice-viz-data.js',
    kind: 'viz-data leaf (unrelated reach ratio)',
    figureQuoted: '~1.868x (overstatementFactor = 10000/5355)',
    quantityDescribed: 'Route M reach-reprice N ratio (a DIFFERENT quantity)',
    correctFigure: 'n/a -- not a lam_max value/ceiling ratio',
    verdict: 'SAFE',
    recommendedFix:
      'none; correctly labelled in its own module. Flagged only so its ~1.87x is not later confused with the lam_max value ratio ~1.92x.',
    userFacing: true,
  }),
]);

export const IMP96686_OVERSTATEMENT_LABEL_AUDIT = Object.freeze({
  id: 'imp-96686-route-m-lammax-overstatement-figure-label-audit',
  title:
    'Audit every consumer that cites a Route M lam_max overstatement multiplier and verify each '
    + 'labels which quantity it is (the ~1.58x ceiling-N ratio vs the ~1.92x N=6000 value ratio '
    + 'flagged in imp-96581), preventing conflation of the two distinct numbers',
  source: 'imp-96548 (source), imp-96574, imp-96581, imp-96480, imp-96399',
  twoQuantities: Object.freeze({
    valueRatioN6000: N6000_VALUE_RATIO, // ~1.9195 -- ratio of the two lam_max CURVE values at N=6000
    ceilingRatio: CEILING_RATIO, // ~1.58 -- ratio of the two conditioning-ceiling N estimates
    note:
      'valueRatioN6000 = rigorous(6000)/measured(6000) = 11.6948/6.0924 ~ 1.92x is the gap between '
      + 'the two lam_max CURVES; ceilingRatio = measuredFitCeilingN/rigorousTraceCeilingN ~ 1.58x is '
      + 'the gap between the two conditioning-ceiling N estimates. Distinct questions, distinct '
      + 'answers; they must not be quoted interchangeably.',
  }),
  audited: AUDITED,
  status:
    'AUDIT: two MISLABELS found -- imp-96548 FINDING 2 prose and the imp-96574 glossary headword (the '
    + 'latter USER-FACING) both quote the ~1.58x ceiling-N ratio while describing the N=6000 '
    + 'curve-value gap, whose true ratio is ~1.92x. One consumer (imp-96581 + page) already labels '
    + 'the two quantities distinctly and is the correct template. Two further references (imp-96480 '
    + 'qualitative, imp-96399 a distinct reach ratio) do not conflate. Recommended fixes recorded '
    + 'per consumer; no fix applied here (audit only). Changes no bound; establishes no operator '
    + 'positivity; no refereed bound is changed; NO QED.',
  verdict: Object.freeze({
    mislabelCount: 2,
    correctCount: 1,
    safeCount: 2,
    userFacingMislabelCount: 1,
    conclusion:
      'The two ~1.58x / ~1.92x quantities are genuinely different (proved here by recompute: value '
      + 'ratio at N=6000 differs from the ceiling ratio by well over 0.2). imp-96548 and imp-96574 '
      + 'each pair the 1.58x CEILING figure with the N=6000 CURVE-VALUE gap, which is actually 1.92x; '
      + 'the imp-96574 instance is user-facing (glossary) and is the highest-priority fix. imp-96581 '
      + 'and its page are already correct and should be used as the labelling template.',
  }),
  caveats:
    'Static grep-based consistency audit; performs no re-derivation of any bound. The value ratio '
    + 'and ceiling ratio are recomputed only from the imp-96548 inputs carried as literals here, '
    + 'solely to demonstrate the two figures are distinct. No consumer text is edited by this module; '
    + 'the recommended fixes are recorded for a follow-up. Changes no bound; no refereed bound is changed'
    + '; NO QED.',
});

export const IMP96686_OVERSTATEMENT_LABEL_AUDIT_ASSERTIONS = Object.freeze([
  {
    name: 'the N=6000 value ratio (~1.92x) and the ceiling ratio (~1.58x) are distinct quantities',
    holds: () =>
      N6000_VALUE_RATIO > 1.8
      && N6000_VALUE_RATIO < 2.0
      && CEILING_RATIO > 1.4
      && CEILING_RATIO < 1.8
      && Math.abs(N6000_VALUE_RATIO - CEILING_RATIO) > 0.2,
  },
  {
    name: 'exactly two mislabels are recorded',
    holds: () => AUDITED.filter((c) => c.verdict === 'MISLABEL').length === 2,
  },
  {
    name: 'exactly one user-facing mislabel (the imp-96574 glossary headword)',
    holds: () =>
      AUDITED.filter((c) => c.verdict === 'MISLABEL' && c.userFacing).length === 1
      && AUDITED.find((c) => c.verdict === 'MISLABEL' && c.userFacing).consumer.startsWith('imp-96574'),
  },
  {
    name: 'imp-96581 + page is the sole CORRECT (already-distinct) consumer',
    holds: () =>
      AUDITED.filter((c) => c.verdict === 'CORRECT').length === 1
      && AUDITED.find((c) => c.verdict === 'CORRECT').consumer.startsWith('imp-96581'),
  },
  {
    name: 'verdict tallies match the audited list',
    holds: () =>
      IMP96686_OVERSTATEMENT_LABEL_AUDIT.verdict.mislabelCount
        === AUDITED.filter((c) => c.verdict === 'MISLABEL').length
      && IMP96686_OVERSTATEMENT_LABEL_AUDIT.verdict.correctCount
        === AUDITED.filter((c) => c.verdict === 'CORRECT').length
      && IMP96686_OVERSTATEMENT_LABEL_AUDIT.verdict.safeCount
        === AUDITED.filter((c) => c.verdict === 'SAFE').length,
  },
  {
    name: 'honest: audit only, no bound moved, no refereed bound is changed, NO QED',
    holds: () =>
      /changes no bound/i.test(IMP96686_OVERSTATEMENT_LABEL_AUDIT.status)
      && /refereed bound is changed/i.test(IMP96686_OVERSTATEMENT_LABEL_AUDIT.status)
      && /NO QED/.test(IMP96686_OVERSTATEMENT_LABEL_AUDIT.status),
  },
]);

export default IMP96686_OVERSTATEMENT_LABEL_AUDIT;
