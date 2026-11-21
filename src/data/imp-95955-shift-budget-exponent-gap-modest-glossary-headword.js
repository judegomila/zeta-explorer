/**
 * @module imp-95955-shift-budget-exponent-gap-modest-glossary-headword
 * @fileoverview imp-95955 -- import-light glossary/Concepts headword for the imp-95838
 *   VERDICT: the ln 1.25 PD-preserving shift-invert iteration budget grows as
 *   shiftIts ~ 5.670e-3 N^1.577 against the sigma=0 plainIts ~ 1.029e-2 N^1.841
 *   (~O(N^2)) -- so the imp-95820 "genuinely far slower blow-up" characterization
 *   OVERSTATES the exponent gap (1.58 vs 1.84, a modest 0.26 difference); the real
 *   cure is a ~10-12x smaller absolute constant plus PD-validity.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95838 measured the shift-invert budget law directly and found the shift
 *   exponent (1.58) genuinely below the sigma=0 exponent (1.84), confirming the
 *   imp-95820 direction -- but only by 0.26 in the exponent, not the dramatic gap
 *   "far slower" suggests. A reader who only sees the imp-95820 shorthand could
 *   mistake this for an order-of-magnitude exponent win rather than a modest
 *   exponent edge plus a real constant-factor and validity win. This headword
 *   bakes that distinction VERBATIM (no re-import of the imp-95838 module, to
 *   stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   shiftIts(N) ~ 5.670e-3 N^1.577 (eight N=150..1523 points, retries=0
 *   everywhere) vs plainIts(N) ~ 1.029e-2 N^1.841 (five converged N=150..660
 *   points, confirming sigma=0 is ~O(N^2)). Exponent gap = 0.2645874 -- MODEST,
 *   not dramatic. The dominant practical cure is (a) a ~10-12x smaller absolute
 *   constant (plain/shift ratio climbs 5.84 -> 11.69 across N=150..660) and (b)
 *   the shift staying PD-valid (retries=0) and converging where sigma=0 stalls
 *   (the imp-95799 under-convergence). Refines imp-95820's "far slower" to the
 *   honest characterization: modest exponent edge + constant-factor + validity.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95838 VERDICT for quick reference,
 *   so the "far slower" shorthand is not repeated uncorrected. Also notes the
 *   imp-95885 finding that the fitted (C, p) pair is delta-LOCAL (calibrated at
 *   ln 1.25), not a cross-delta predictor -- see imp-95904 for that headword. It
 *   establishes nothing, fits no new curve. Changes no bound of the Lambda
 *   program; NO QED. No refereed bound is changed.
 *
 * @see imp-95838-ln125-shift-budget-scaling (source: the measured VERDICT this glosses)
 * @see imp-95820-shift-invert-dd-toeplitz-crossing (the "far slower" characterization refined here)
 * @see imp-95904-shift-budget-delta-local-glossary-headword (sibling headword: the law is delta-local)
 * @see imp-95859-ln125-window-shift-budget (worst window cell, supersedes the endpoint budget)
 *
 * Ticket: imp-95955 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The shift-budget exponent-gap-modest headword, baked verbatim (no re-import).
const SHIFT_BUDGET_EXPONENT_GAP_MODEST_HEADWORD = Object.freeze({
  key: 'shift-budget-exponent-gap-modest',
  term:
    'imp-95838 VERDICT: the ln1.25 shift-invert budget exponent (1.58) is only MODESTLY ' +
    'below the sigma=0 exponent (1.84) -- imp-95820 "far slower" overstates the gap',
  definition:
    'shiftIts(N) ~ 5.669924e-3 N^1.5769020 (eight N=150..1523 points, retries=0 ' +
    'everywhere) against the sigma=0 plainIts(N) ~ 1.0285843e-2 N^1.8414894 (five ' +
    'converged N=150..660 points, ~O(N^2), confirming the imp-95820 sigma=0 ' +
    'characterization). The exponent gap is 0.2645874 -- a modest difference, not ' +
    'an order of magnitude.',
  overstatementMechanism:
    'imp-95820 characterized the shift-invert budget as growing "genuinely far ' +
    'slower" than the sigma=0 O(N^2) blow-up. imp-95838 measured both laws directly ' +
    'and confirmed the DIRECTION (shift exponent below plain exponent) but found the ' +
    'gap is only 0.26 in the exponent, not dramatic. The dominant practical cure is ' +
    'NOT the exponent: it is (a) a ~10-12x smaller absolute constant (the plain/shift ' +
    'iteration ratio climbs 5.84 at N=150 to 11.69 at N=660) and (b) the shift ' +
    'staying PD-valid (retries=0 at every measured N) and converging cleanly where ' +
    'the sigma=0 solver stalls (the imp-95799 under-convergence).',
  consequence:
    'Citing "far slower" without qualification for the ln1.25 shift-invert vs sigma=0 ' +
    'budget comparison overstates the exponent difference; the honest statement is a ' +
    'modestly-lower exponent (1.58 vs 1.84) plus a real ~10-12x constant-factor and ' +
    'PD-validity win. The fitted (C, p) pair is also delta-LOCAL (imp-95885 FINDING B, ' +
    'see imp-95904), calibrated at ln1.25 conditioning ~1e17 and not a cross-delta ' +
    'predictor.',
});

export const IMP95955_SHIFT_BUDGET_EXPONENT_GAP_MODEST_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95955',
  proofSection: 'S-frontier',
  glosses: 'imp-95838',
  scopes: 'imp-95820',
  question:
    'imp-95838 measured the ln1.25 PD-preserving shift-invert iteration budget law and ' +
    'found it grows only MODESTLY slower (exponent 1.58) than the sigma=0 O(N^2) blow-up ' +
    '(exponent 1.84). What does this refine about the imp-95820 "genuinely far slower" ' +
    'characterization, for a reader landing on the shift-budget law cold?',
  headword: SHIFT_BUDGET_EXPONENT_GAP_MODEST_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95838 ' +
    'VERDICT: the shift-invert exponent (1.58) is genuinely below the sigma=0 exponent ' +
    '(1.84), confirming the imp-95820 direction, but by a MODEST 0.26 in the exponent -- ' +
    'so "far slower" overstates the exponent gap. The dominant practical cure is a ' +
    '~10-12x smaller absolute constant plus PD-validity (retries=0), not a dramatically ' +
    'lower exponent. Establishes nothing; fits no new curve; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-95838 (ln1.25 shift-invert budget scaling measurement, source VERDICT); ' +
    'imp-95820 (shift-invert DD-Toeplitz crossing solver, origin of the "far slower" ' +
    'characterization); imp-95885 (per-delta comparison, FINDING B delta-locality); ' +
    'imp-95904 (sibling delta-locality headword); imp-95859 (worst window cell budget).',
});

export default IMP95955_SHIFT_BUDGET_EXPONENT_GAP_MODEST_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95955_SHIFT_BUDGET_EXPONENT_GAP_MODEST_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95955-headword-has-required-fields',
    why: 'The headword must name the fitted exponents, the overstatement mechanism, and the misapplication consequence -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP95955_SHIFT_BUDGET_EXPONENT_GAP_MODEST_GLOSSARY_HEADWORD.headword;
      return (
        /1\.5769020/.test(h.definition) &&
        /1\.8414894/.test(h.definition) &&
        /0\.2645874/.test(h.definition) &&
        /constant/.test(h.overstatementMechanism) &&
        /PD-valid/.test(h.overstatementMechanism) &&
        /delta-LOCAL/.test(h.consequence)
      );
    },
  },
  {
    id: 'imp95955-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, correct glosses/scopes pointers.',
    holds: () =>
      IMP95955_SHIFT_BUDGET_EXPONENT_GAP_MODEST_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95955_SHIFT_BUDGET_EXPONENT_GAP_MODEST_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95955_SHIFT_BUDGET_EXPONENT_GAP_MODEST_GLOSSARY_HEADWORD.verdict) &&
      IMP95955_SHIFT_BUDGET_EXPONENT_GAP_MODEST_GLOSSARY_HEADWORD.glosses === 'imp-95838' &&
      IMP95955_SHIFT_BUDGET_EXPONENT_GAP_MODEST_GLOSSARY_HEADWORD.scopes === 'imp-95820',
  },
];

for (const assertion of IMP95955_SHIFT_BUDGET_EXPONENT_GAP_MODEST_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-95955-shift-budget-exponent-gap-modest-glossary-headword assertion failed: ${assertion.id}`);
  }
}
