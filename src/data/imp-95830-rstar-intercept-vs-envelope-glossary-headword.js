/**
 * @module imp-95830-rstar-intercept-vs-envelope-glossary-headword
 * @fileoverview imp-95830 -- import-light glossary/honest-status headword distinguishing
 *   two similarly-named "250" and "325" constants in the Szego reach-crossing family so
 *   they are not conflated downstream:
 *
 *     (1) the imp-95761 REACH-ENVELOPE constant: N_max ~ 250/delta, a round UPPER BOUND
 *         on the grid size needed for sub-1% agreement, delta-independent in its
 *         truncation part.
 *     (2) the imp-95799 R*(delta) FITTED INTERCEPT: the least-squares line
 *         R*(delta) = 325.393 - 218.342*delta through the three float64-clean
 *         sub-1% crossing reaches, whose intercept is 325.4 -- NOT 250.
 *
 *   WHY A HEADWORD (not a re-derivation)
 *   -------------------------------------
 *   imp-95799 fitted the actual crossing reach R*(delta) and found the guessed literal
 *   form R* = 250 - c*delta is REFUTED in its intercept (325.4, not 250). A reader who
 *   only recalls "the reach constant is 250" from imp-95761 could misquote it as the
 *   intercept of the R*(delta) drift law, when it is a different object entirely: the
 *   250 is a round envelope on N_max*delta, while 325.4 is the y-intercept of a
 *   least-squares fit to R* itself. This headword bakes the distinction verbatim
 *   (no re-import of imp-95761 or imp-95799, to stay import-light) as a standalone
 *   lookup entry so the two constants are not conflated in later citations.
 *
 *   THE HEADWORD
 *   -------------------------------------
 *   ENVELOPE CONSTANT (imp-95761): N_max ~ 250/delta. Derived from the observation that
 *   the finite-grid Szego edge-coefficient bias falls below 1% once the reach
 *   R = delta(N_max+1) crosses ~250, delta-independently -- a single round number
 *   bounding the truncation part of the bias across all measured delta.
 *
 *   FITTED INTERCEPT (imp-95799): R*(delta) = 325.393 - 218.342*delta, fit by ordinary
 *   least squares through the three float64-clean sub-1% crossings
 *   (delta, R*) = (ln1.6, 223.0), (ln1.5, 236.2), (ln1.45, 244.7), giving R^2 = 0.99715
 *   and residuals all < 0.28% of R*. Evaluated at delta -> 0 this line's intercept is
 *   325.4, not 250.
 *
 *   WHY THEY DIFFER: the envelope constant 250 is a coarse round bound read off a
 *   handful of reach values that all clear the sub-1% threshold; the fitted intercept
 *   325.4 is the extrapolation of a precise linear model of R* itself to delta = 0, a
 *   regime outside the fitted window (delta in [0.372, 0.470]) that the model was never
 *   built to represent exactly. Neither is "wrong" -- they answer different questions
 *   (a safe upper bound on required grid size, versus the best-fit trend of the
 *   observed crossing reach), and conflating them mis-attributes a specific numeric
 *   value to the wrong object.
 *
 *   STATUS: both constants stand as measured/fitted. Distinguishing them changes
 *   neither; this is a bookkeeping note to prevent future mis-citation.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup recording the imp-95799 refutation of the guessed
 *   R* = 250 - c*delta form. It establishes nothing, instantiates no interval, closes
 *   no sub-gap, moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-95799-rstar-delta-drift-linear-fit (source: the fitted intercept 325.393 this glosses)
 * @see imp-95761-szego-coefficient-larger-grid-subpct (source: the reach-envelope constant 250 this glosses)
 * @see imp-95794-reach-universality-law-glossary-headword (the earlier headword for the reach-universality law itself)
 *
 * Ticket: imp-95830 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The intercept-vs-envelope distinction, baked verbatim (no re-import).
const RSTAR_INTERCEPT_VS_ENVELOPE_HEADWORD = Object.freeze({
  key: 'rstar-intercept-vs-reach-envelope',
  term:
    'reach-envelope constant (250) vs R*(delta) fitted intercept (325.4) -- two ' +
    'distinct objects in the Szego reach-crossing family',
  definition:
    'The imp-95761 reach-envelope constant 250 in N_max ~ 250/delta is a round UPPER ' +
    'BOUND on the grid size needed for the finite-grid Szego edge-coefficient bias to ' +
    'clear sub-1%, delta-independent in its truncation part. The imp-95799 fitted ' +
    'intercept 325.393 is the y-intercept of the least-squares line ' +
    'R*(delta) = 325.393 - 218.342*delta through the three float64-clean sub-1% ' +
    'crossing reaches (R^2 = 0.99715). These are DIFFERENT OBJECTS: the guessed literal ' +
    'form R* = 250 - c*delta is REFUTED in its intercept (325.4, not 250).',
  mechanism:
    'The 250 envelope is a coarse round bound read off measured reach values that all ' +
    'clear the sub-1% threshold; the 325.4 intercept is the extrapolation of a precise ' +
    'linear model of the crossing reach R*(delta) itself to delta = 0, outside the ' +
    'fitted window delta in [0.372, 0.470]. Conflating the two mis-attributes a ' +
    'specific numeric value to the wrong object.',
  verificationStatus:
    'Both constants stand as measured: the envelope 250 from imp-95761, the fitted ' +
    'intercept 325.393 (R^2 = 0.99715, max residual < 0.28% of R*) from imp-95799. ' +
    'This headword changes neither value; it records the distinction for citation.',
});

export const IMP95830_RSTAR_INTERCEPT_VS_ENVELOPE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95830',
  proofSection: 'S-frontier',
  glosses: 'imp-95799',
  question:
    'imp-95799 fitted the Szego sub-1% crossing reach R*(delta) and found the guessed ' +
    'literal form R* = 250 - c*delta refuted (intercept 325.4, not 250). What is the ' +
    'imp-95761 reach-envelope constant 250, why does it differ from the imp-95799 ' +
    'fitted intercept 325.4, and how should the two be cited without conflation?',
  headword: RSTAR_INTERCEPT_VS_ENVELOPE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY / HONEST-STATUS HEADWORD ONLY (documentation, not a proof). Records that ' +
    'the imp-95761 reach-envelope constant 250 (a round upper bound on N_max*delta) and ' +
    'the imp-95799 fitted R*(delta) intercept 325.393 (a least-squares extrapolation to ' +
    'delta = 0) are DIFFERENT OBJECTS, and that the guessed R* = 250 - c*delta form is ' +
    'REFUTED in its intercept. Establishes nothing; instantiates no interval; moves no ' +
    'bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-95799 (the fitted intercept 325.393 this glosses); imp-95761 (the ' +
    'reach-envelope constant 250 this glosses); imp-95794 (the earlier reach-' +
    'universality-law headword this complements).',
});

export default IMP95830_RSTAR_INTERCEPT_VS_ENVELOPE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95830_RSTAR_INTERCEPT_VS_ENVELOPE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95830-headword-names-both-constants',
    why: 'The headword must name both the envelope constant 250 and the fitted ' +
      'intercept 325.393, and state that the guessed 250-intercept form is refuted -- ' +
      'the entire point of the disambiguation.',
    holds: () => {
      const h = IMP95830_RSTAR_INTERCEPT_VS_ENVELOPE_GLOSSARY_HEADWORD.headword;
      return (
        /250/.test(h.definition) &&
        /325\.393/.test(h.definition) &&
        /REFUTED/.test(h.definition) &&
        /R\^2 = 0\.99715/.test(h.verificationStatus)
      );
    },
  },
  {
    id: 'imp95830-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95830_RSTAR_INTERCEPT_VS_ENVELOPE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95830_RSTAR_INTERCEPT_VS_ENVELOPE_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95830_RSTAR_INTERCEPT_VS_ENVELOPE_GLOSSARY_HEADWORD.verdict) &&
      IMP95830_RSTAR_INTERCEPT_VS_ENVELOPE_GLOSSARY_HEADWORD.glosses === 'imp-95799',
  },
];

for (const assertion of IMP95830_RSTAR_INTERCEPT_VS_ENVELOPE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95830-rstar-intercept-vs-envelope-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
