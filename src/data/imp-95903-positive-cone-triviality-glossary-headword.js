/**
 * @module imp-95903-positive-cone-triviality-glossary-headword
 * @fileoverview imp-95903 -- import-light glossary/Concepts headword for the imp-95879 verdict:
 *   the obligation-(2) sign functional theta = int f^2 / int g^2 equals 1 EXACTLY when all nonzero
 *   amplitudes share one sign (a positive cone), and its departure below 1 is governed entirely by
 *   the sign-orthant of the amplitude vector, not by modulus (magnitude) data.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95879 proved the POSITIVE-CONE TRIVIALITY THEOREM and used it to settle whether a non-fixed-
 *   amplitude window family or a modulus normalization could unblock the imp-95388 obligation-(2)
 *   transcription. A reader landing on that module cold has no quick-lookup definition of what
 *   "positive cone", "sign-orthant", and "theta = 1 iff one sign" name. This headword bakes those
 *   facts VERBATIM (no re-import of the imp-95879 module, to stay import-light) as a standalone
 *   lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   For strictly-positive packets f_n > 0 with signed field f = sum c_n f_n and modulus envelope
 *   g = sum |c_n| f_n, the triangle inequality gives g >= |f| pointwise, so theta = int f^2 / int g^2
 *   lies in (0, 1]. theta = 1 exactly when g = |f| everywhere, i.e. when no cancellation occurs in
 *   the sum defining f -- which happens exactly when every nonzero c_n shares one sign (the amplitude
 *   vector lies in a single closed sign-orthant, a ray of the positive cone up to a global sign).
 *   Consequently theta < 1 (a nontrivial image) can only arise from a SIGNED amplitude pattern; no
 *   amount of varying the moduli |c_n| within one sign-orthant moves theta off 1, and no modulus
 *   normalization (theta is degree-0 homogeneous) can create or destroy that nontriviality.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95879 positive-cone triviality theorem and its
 *   departure-mechanism for quick reference. It establishes nothing, instantiates no interval, closes
 *   no sub-gap, moves no bound. Obligation (2) stays gated on the per-window sign specification
 *   (imp-95397 / imp-95212 Fresnel-Airy envelope port); NO QED. No refereed bound is changed.
 *
 * @see imp-95879-theta-positive-cone-triviality-intrinsic (source: the exact theorem and numerical witness this glosses)
 * @see imp-95388-seam-chain-obligation-ledger.js (obligation (2), OPEN at transcription)
 * @see imp-95375-theta-range-geometry-image.js (theta range imaged, sign-reachable)
 *
 * Ticket: imp-95903 (content, low). Documentation only; establishes nothing; NO QED; no refereed bound is changed.
 */

// The positive-cone triviality headword, baked verbatim (no re-import).
const POSITIVE_CONE_TRIVIALITY_HEADWORD = Object.freeze({
  key: 'theta-positive-cone-triviality',
  term: 'imp-95879 theorem: theta = 1 iff all nonzero amplitudes share one sign (a positive cone)',
  definition:
    'For strictly-positive packets f_n > 0, signed field f = sum c_n f_n, and modulus envelope ' +
    'g = sum |c_n| f_n, the triangle inequality gives g(s) >= |f(s)| for every s, so ' +
    'theta = int f^2 / int g^2 lies in (0, 1]. theta = 1 exactly when g = |f| almost everywhere, ' +
    'which forces sign(c_n) constant over the nonzero c_n -- i.e. the amplitude vector lies in a ' +
    'single closed sign-orthant (a ray of the positive cone up to a global sign).',
  departureMechanism:
    'The departure theta < 1 is governed ENTIRELY by the sign-orthant of the amplitude vector c, ' +
    'not by modulus (magnitude) data: any variable-modulus family with all amplitudes of one sign is ' +
    'still a positive cone and stays at theta = 1 identically, while theta is degree-0 homogeneous so ' +
    'a global modulus rescale is a no-op and a per-window modulus renorm (signs kept) can move a ' +
    'signed pattern’s theta value but never crosses 1. Only flipping signs (leaving the positive ' +
    'cone) can create a nontrivial image.',
  consequence:
    'A non-fixed-amplitude window family or an alternative modulus normalization cannot unblock the ' +
    'imp-95388 obligation-(2) transcription -- the sole lever is transcribed per-window SIGN data ' +
    '(imp-95397 / the imp-95212 Fresnel-Airy envelope port, still OPEN).',
});

export const IMP95903_POSITIVE_CONE_TRIVIALITY_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95903',
  proofSection: 'S-frontier',
  glosses: 'imp-95879',
  scopes: 'imp-95388',
  question:
    'imp-95879 proved that theta = 1 iff all nonzero amplitudes share one sign, and that this ' +
    'triviality is intrinsic to positivity rather than to the fixed-amplitude choice. What does ' +
    '"positive cone", "sign-orthant", and the theta = 1 criterion mean, for a reader landing on that ' +
    'module cold?',
  headword: POSITIVE_CONE_TRIVIALITY_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95879 positive-cone ' +
    'triviality theorem: theta = 1 exactly on a positive cone (all nonzero amplitudes sharing one ' +
    'sign), and its departure below 1 is governed entirely by the sign-orthant of the amplitude ' +
    'vector, never by modulus data. Establishes nothing; instantiates no interval; moves no bound; ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-95879 (positive-cone triviality theorem and numerical witness); imp-95388 (obligation (2), ' +
    'the ledger this bears on); imp-95375 / imp-95405 (theta range and sign-lattice imaged at fixed ' +
    'geometry).',
});

export default IMP95903_POSITIVE_CONE_TRIVIALITY_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95903_POSITIVE_CONE_TRIVIALITY_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95903-headword-has-required-fields',
    why: 'The headword must name the positive-cone criterion, the sign-orthant departure mechanism, and the obligation-(2) consequence -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP95903_POSITIVE_CONE_TRIVIALITY_GLOSSARY_HEADWORD.headword;
      return (
        /theta = 1/.test(h.definition) &&
        /sign-orthant/i.test(h.definition) &&
        /sign-orthant/i.test(h.departureMechanism) &&
        /degree-0 homogeneous/.test(h.departureMechanism) &&
        /obligation-\(2\)/.test(h.consequence)
      );
    },
  },
  {
    id: 'imp95903-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, correct glosses/scopes pointers.',
    holds: () =>
      IMP95903_POSITIVE_CONE_TRIVIALITY_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95903_POSITIVE_CONE_TRIVIALITY_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95903_POSITIVE_CONE_TRIVIALITY_GLOSSARY_HEADWORD.verdict) &&
      IMP95903_POSITIVE_CONE_TRIVIALITY_GLOSSARY_HEADWORD.glosses === 'imp-95879' &&
      IMP95903_POSITIVE_CONE_TRIVIALITY_GLOSSARY_HEADWORD.scopes === 'imp-95388',
  },
];

for (const assertion of IMP95903_POSITIVE_CONE_TRIVIALITY_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-95903-positive-cone-triviality-glossary-headword assertion failed: ${assertion.id}`);
  }
}
