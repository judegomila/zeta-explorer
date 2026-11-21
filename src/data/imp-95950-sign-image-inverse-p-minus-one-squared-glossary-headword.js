/**
 * @module imp-95950-sign-image-inverse-p-minus-one-squared-glossary-headword
 * @fileoverview imp-95950 -- import-light glossary/Concepts headword recording the imp-95918
 *   finding: the exact residue-averaged sign image <theta_C> decays as 1/(p-1)^2 across a wide
 *   (p,k) grid, a two-line power law sharpening the imp-95898 STEP 3 qualitative statement
 *   "<theta_C> falls roughly like the diagonal fraction of S".
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   A reader landing on imp-95918 cold sees a (p,k) grid sweep with baked witness tables and can
 *   miss the single load-bearing conclusion: the decay law is a clean TWO-LINE power law, not a
 *   vague qualitative trend. That distinction matters for every downstream consumer treating
 *   theta as "roughly the diagonal fraction" (imp-95898, imp-95943) -- the fraction itself obeys
 *   1/(p-1), and theta is its algebraic SQUARE, 1/(p-1)^2. This headword bakes that one fact
 *   verbatim (no re-import of imp-95918) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   diagFrac := tr(G)/S ~ 1/(p-1) (measured diagFrac*(p-1) within 0.06% of 1 across p=3..23), and
 *   because <theta_C> = (p*diagFrac - 1)/(p-1) is an EXACT algebraic identity, diagFrac ~ 1/(p-1)
 *   forces <theta_C> ~ 1/(p-1)^2 (measured theta*(p-1)^2 within 1.4% of 1 across an 8x range in
 *   p). The deeper the seam (larger p), the sharper obligation-(2) theta sits below the trivial
 *   value 1 -- quadratically in 1/(p-1).
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95918 conclusion for quick reference. It
 *   establishes nothing new, instantiates no interval, closes no sub-gap, moves no bound. The
 *   residue mean is STILL NOT the physical per-window theta -- the imp-95212 Fresnel-Airy
 *   envelope port remains STILL OPEN. imp-2519 no-overclaim guard preserved; NO QED.
 *   No refereed bound is changed.
 *
 * @see imp-95918-residue-avg-sign-image-pk-grid (source: the (p,k) grid measurement and the two power laws)
 * @see imp-95898-single-window-sign-image-residue-average (STEP 2 exact closed form; STEP 3 qualitative statement sharpened)
 * @see imp-95212-fresnel-airy-envelope-port (the physical-theta port, STILL OPEN)
 *
 * Ticket: imp-95950 (content, medium). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The sign-image-decay headword, baked verbatim (no re-import of imp-95918).
const SIGN_IMAGE_INVERSE_P_MINUS_ONE_SQUARED_HEADWORD = Object.freeze({
  key: 'sign-image-inverse-p-minus-one-squared',
  term:
    'Residue-mean sign image <theta_C> decays as 1/(p-1)^2 (imp-95918 two-line power law)',
  definition:
    'Across the (p,k) grid p in {3,5,7,11,13,17,19,23}, the exact residue-averaged sign image ' +
    '<theta_C> = (p tr(G) - S) / ((p - 1) S) obeys a clean two-line power law: (A) the diagonal ' +
    'fraction diagFrac := tr(G)/S ~ 1/(p-1) (measured diagFrac*(p-1) within 0.06% of 1, ' +
    'p=3..23), and (B) because <theta_C> = (p*diagFrac - 1)/(p-1) is an EXACT algebraic ' +
    'identity, law (A) forces <theta_C> ~ 1/(p-1)^2 (measured theta*(p-1)^2 within 1.4% of 1 ' +
    'across an 8x range in p). This sharpens the imp-95898 STEP 3 qualitative statement ' +
    '"<theta_C> falls roughly like the diagonal fraction of S" to an explicit square-law.',
  algebraicLink:
    'Law (B) is not an independent empirical fit -- it is the algebraic CONSEQUENCE of law (A) ' +
    'via the exact identity <theta_C> = (p*diagFrac - 1)/(p-1), verified to 1e-12 on every grid ' +
    'cell. So there is really one measured regularity (the diagonal fraction ~1/(p-1)) plus one ' +
    'exact algebraic squaring step.',
  consequence:
    'The deeper the seam (larger p, more spread additive characters), the more sharply the ' +
    'residue-mean sign functional drives obligation-(2) theta below the trivial value 1 -- ' +
    'quadratically in 1/(p-1). This changes no numeric bound: the residue mean is STILL NOT the ' +
    'physical per-window theta (it drops the von Mangoldt x Fresnel-Airy weight), so the ' +
    'imp-95212 envelope port remains STILL OPEN.',
});

export const IMP95950_SIGN_IMAGE_INVERSE_P_MINUS_ONE_SQUARED_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95950',
  proofSection: 'S-frontier',
  glosses: 'imp-95918',
  question:
    'imp-95918 measures <theta_C> across a wide (p,k) grid and finds it "falls roughly like the ' +
    'diagonal fraction of S" (imp-95898 STEP 3). Is there a sharper, explicit power law for a ' +
    'reader landing on the thread cold?',
  headword: SIGN_IMAGE_INVERSE_P_MINUS_ONE_SQUARED_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). The diagonal fraction tr(G)/S decays ' +
    'as 1/(p-1) (measured within 0.06% of 1), and by the exact algebraic identity ' +
    '<theta_C> = (p*diagFrac - 1)/(p-1), the sign image <theta_C> decays as the SQUARE, ' +
    '1/(p-1)^2 (measured within 1.4% of 1 over p=3..23). Establishes nothing; instantiates no ' +
    'interval; moves no bound; the imp-95212 physical-theta port remains STILL OPEN; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-95918 ((p,k) grid measurement; the two-line power law); imp-95898 (STEP 2 exact closed ' +
    'form; STEP 3 qualitative statement sharpened here); imp-95375 (theta range geometry; exact ' +
    'Gram closed form).',
});

export default IMP95950_SIGN_IMAGE_INVERSE_P_MINUS_ONE_SQUARED_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95950_SIGN_IMAGE_INVERSE_P_MINUS_ONE_SQUARED_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95950-headword-states-the-two-line-power-law',
    why: 'The headword must state both the diagonal-fraction law 1/(p-1) and the sign-image ' +
      'law 1/(p-1)^2, plus the exact algebraic link between them -- the entire content of the ' +
      'imp-95918 finding.',
    holds: () => {
      const h = IMP95950_SIGN_IMAGE_INVERSE_P_MINUS_ONE_SQUARED_GLOSSARY_HEADWORD.headword;
      return (
        /1\/\(p-1\)\^2/.test(h.definition) &&
        /1\/\(p-1\)/.test(h.definition) &&
        /0\.06%/.test(h.definition) &&
        /1\.4%/.test(h.definition) &&
        /algebraic/.test(h.algebraicLink) &&
        /STILL OPEN/.test(h.consequence)
      );
    },
  },
  {
    id: 'imp95950-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, source ' +
      'ticket id recorded.',
    holds: () =>
      IMP95950_SIGN_IMAGE_INVERSE_P_MINUS_ONE_SQUARED_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95950_SIGN_IMAGE_INVERSE_P_MINUS_ONE_SQUARED_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95950_SIGN_IMAGE_INVERSE_P_MINUS_ONE_SQUARED_GLOSSARY_HEADWORD.verdict) &&
      /imp-95918/.test(IMP95950_SIGN_IMAGE_INVERSE_P_MINUS_ONE_SQUARED_GLOSSARY_HEADWORD.glosses),
  },
];

for (const assertion of IMP95950_SIGN_IMAGE_INVERSE_P_MINUS_ONE_SQUARED_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95950-sign-image-inverse-p-minus-one-squared-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
