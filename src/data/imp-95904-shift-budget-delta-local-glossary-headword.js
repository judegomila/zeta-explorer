/**
 * @module imp-95904-shift-budget-delta-local-glossary-headword
 * @fileoverview imp-95904 -- import-light glossary/Concepts headword for the imp-95885
 *   FINDING B verdict: the imp-95820 / imp-95838 shift-budget scaling law
 *   shiftIts ~ 5.670e-3 N^1.577 is a delta-LOCAL fit, not a cross-delta predictor.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95885 assembled the three per-delta u_fit threads (ln 1.2 / ln 1.25 / ln 1.3)
 *   side by side for the first time and, in FINDING B, flagged that the shift-invert
 *   iteration-budget power law calibrated at ln 1.25 does not transfer to the other
 *   two deltas. A reader landing on the shift-budget law cold could mistake the
 *   fitted constant C = 5.669924e-3 and exponent p = 1.5769020 for a universal
 *   scaling law; they are not. This headword bakes that distinction VERBATIM (no
 *   re-import of the imp-95885 module, to stay import-light) as a standalone lookup
 *   entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   shiftIts(N) ~ C N^p with C = 5.669924e-3, p = 1.5769020 was fit at delta =
 *   ln 1.25 (bottom-eigenvalue conditioning ~1e17) from the imp-95838 baked grid
 *   (nGrid 150..1523, shiftIts 19..712). The three deltas the imp-95885 table
 *   covers span conditioning by orders of magnitude -- ln 1.3 ~5e15, ln 1.25 ~1e17,
 *   ln 1.2 ~5.6e22 -- so the single fitted (C, p) pair cannot be ported across
 *   deltas. What IS delta-general is the FORM: shiftIts grows sub-quadratically
 *   (p ~ 1.58 < 2) against a pinned near-zero bottom eigenvalue. Each delta
 *   instantiates that form with its own conditioning, which is why the worst
 *   reported budgets are not comparable numbers across the table: ln 1.25 worst
 *   window cell needs 870 shift solves at N=1400 (imp-95859); ln 1.3 nPts=3200
 *   heavy budget runs up to 700 shift solves (imp-95857); ln 1.2 N=2800 DD
 *   shift-invert converges in 240 solves (imp-95881).
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95885 FINDING B distinction between a
 *   FORM (delta-general) and a fitted instance (delta-local) for quick reference.
 *   It establishes nothing, fits no new curve, and does not flag an inconsistency --
 *   imp-95885 is explicit that this is "no inconsistency; the law is honestly
 *   delta-local." Changes no bound of the Lambda program; NO QED. No refereed bound is changed.
 *
 * @see imp-95885-per-delta-ufit-comparison-table.js (source: FINDING B this glosses)
 * @see imp-95838-ln125-shift-budget-scaling (the ln 1.25 shift-budget law fit)
 * @see imp-95820-shift-invert-dd-toeplitz-crossing (the shift-invert solver + budget law origin)
 * @see imp-95859-ln125-window-shift-budget (ln 1.25 worst window cell, 870 solves)
 *
 * Ticket: imp-95904 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The shift-budget delta-locality headword, baked verbatim (no re-import).
const SHIFT_BUDGET_DELTA_LOCAL_HEADWORD = Object.freeze({
  key: 'shift-budget-law-delta-local',
  term: 'imp-95885 FINDING B: the shift-invert budget law shiftIts ~ C N^p is a FORM, delta-instantiated, not a cross-delta predictor',
  definition:
    'shiftIts(N) ~ C N^p with C = 5.669924e-3, p = 1.5769020 was fit at delta = ln 1.25 ' +
    '(bottom-eigenvalue conditioning ~1e17) from the imp-95838 baked grid (nGrid ' +
    '150..1523, shiftIts 19..712). It is the number of shift-invert solves the ' +
    'DD-Toeplitz crossing search needs as a function of grid size N.',
  deltaLocalityMechanism:
    'The three per-delta u_fit threads the imp-95885 table covers span conditioning by ' +
    'orders of magnitude -- ln 1.3 ~5e15, ln 1.25 ~1e17, ln 1.2 ~5.6e22 -- so the single ' +
    'fitted (C, p) pair calibrated at ln 1.25 cannot be ported to the other deltas. What ' +
    'IS delta-general is the FORM: shiftIts grows sub-quadratically (p ~ 1.58 < 2) against ' +
    'a pinned near-zero bottom eigenvalue; each delta instantiates that form with its own ' +
    'conditioning, giving non-comparable worst-budget numbers (ln 1.25: 870 solves at ' +
    'N=1400, imp-95859; ln 1.3: up to 700 solves at nPts=3200, imp-95857; ln 1.2: 240 ' +
    'solves at N=2800, imp-95881).',
  consequence:
    'Citing shiftIts ~ 5.670e-3 N^1.577 as a universal shift-invert budget predictor for ' +
    'any delta other than ln 1.25 is a misapplication; only the sub-quadratic FORM ' +
    'transfers, and a fresh fit is needed per delta. No inconsistency is flagged -- ' +
    'imp-95885 records this as the law being honestly delta-local.',
});

export const IMP95904_SHIFT_BUDGET_DELTA_LOCAL_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95904',
  proofSection: 'S-frontier',
  glosses: 'imp-95885',
  scopes: 'imp-95820',
  question:
    'imp-95885 FINDING B found that the imp-95820 / imp-95838 shift-budget scaling law ' +
    'shiftIts ~ 5.670e-3 N^1.577 does not transfer across the three deltas the ' +
    'imp-95885 comparison table covers. What does "delta-local" vs "a FORM" mean here, ' +
    'for a reader landing on the shift-budget law cold?',
  headword: SHIFT_BUDGET_DELTA_LOCAL_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95885 ' +
    'FINDING B distinction: shiftIts ~ C N^p is a sub-quadratic FORM that is ' +
    'delta-general, but its fitted constant and exponent (C = 5.669924e-3, ' +
    'p = 1.5769020) were calibrated at ln 1.25 and are delta-LOCAL, not a ' +
    'cross-delta predictor, because the three deltas span conditioning by orders of ' +
    'magnitude (5e15 / 1e17 / 5.6e22). Establishes nothing; fits no new curve; moves ' +
    'no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-95885 (per-delta u_fit comparison table, FINDING B); imp-95838 (ln 1.25 ' +
    'shift-budget scaling fit); imp-95820 (shift-invert DD-Toeplitz crossing solver, ' +
    'budget law origin); imp-95859 / imp-95857 / imp-95881 (per-delta worst shift ' +
    'budgets cited above).',
});

export default IMP95904_SHIFT_BUDGET_DELTA_LOCAL_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95904_SHIFT_BUDGET_DELTA_LOCAL_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95904-headword-has-required-fields',
    why: 'The headword must name the fitted constants, the delta-locality mechanism, and the misapplication consequence -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP95904_SHIFT_BUDGET_DELTA_LOCAL_GLOSSARY_HEADWORD.headword;
      return (
        /5\.669924e-3/.test(h.definition) &&
        /1\.5769020/.test(h.definition) &&
        /delta-general/.test(h.deltaLocalityMechanism) &&
        /sub-quadratically|sub-quadratic/.test(h.deltaLocalityMechanism) &&
        /misapplication/.test(h.consequence)
      );
    },
  },
  {
    id: 'imp95904-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, correct glosses/scopes pointers.',
    holds: () =>
      IMP95904_SHIFT_BUDGET_DELTA_LOCAL_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95904_SHIFT_BUDGET_DELTA_LOCAL_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95904_SHIFT_BUDGET_DELTA_LOCAL_GLOSSARY_HEADWORD.verdict) &&
      IMP95904_SHIFT_BUDGET_DELTA_LOCAL_GLOSSARY_HEADWORD.glosses === 'imp-95885' &&
      IMP95904_SHIFT_BUDGET_DELTA_LOCAL_GLOSSARY_HEADWORD.scopes === 'imp-95820',
  },
];

for (const assertion of IMP95904_SHIFT_BUDGET_DELTA_LOCAL_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-95904-shift-budget-delta-local-glossary-headword assertion failed: ${assertion.id}`);
  }
}
