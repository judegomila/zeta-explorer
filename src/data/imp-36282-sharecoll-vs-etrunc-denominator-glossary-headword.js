/**
 * @module imp-36282-sharecoll-vs-etrunc-denominator-glossary-headword
 * @fileoverview imp-36282 -- import-light glossary/Concepts headword for the imp-36155
 *   two-denominator distinction: the shareColl < 1% crossing (E_coll / E(N) = 0.01, imp-36097)
 *   versus the E_trunc sole-survivor height (E_coll / E_trunc = 0.01, imp-35971), why they are
 *   DIFFERENT landmarks despite both reading as "collision term hits 1%", and why the share
 *   crossing structurally PRECEDES the sole-survivor.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-36155 already proved the ordering and quantified the gap, but a reader landing on
 *   either the imp-36097 or imp-35971 module cold has no quick-lookup definition explaining
 *   WHY two "E_coll hits 1%" landmarks give two different heights. This headword bakes that
 *   distinction VERBATIM (no re-import of the imp-36155 module, to stay import-light) as a
 *   standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   shareColl < 1% crossing (N_cross ~ 4.624381e13): the first height at which the SHARE
 *   shareColl = E_coll / E(N) = E_coll / (E_trunc + E_flow + E_coll) drops below 0.01 -- E_coll
 *   measured against the FULL three-way total.
 *   E_trunc sole-survivor height (N* ~ 4.7214e13): the first height at which the RATIO-TO-TRUNC
 *   E_coll / E_trunc drops below 0.01 -- E_coll measured against the FIXED E_trunc = 3.06e-5
 *   floor alone (imp-2631), with E_flow already negligible there.
 *   They are DIFFERENT landmarks because they divide the SAME E_coll numerator by DIFFERENT
 *   denominators (E(N) vs E_trunc), and E(N) = E_trunc + E_flow + E_coll > E_trunc strictly
 *   for every finite N. The share crossing structurally PRECEDES the sole-survivor: both curves
 *   decrease monotonically down the sigma -> 0 tail, and the pointwise-smaller share curve
 *   reaches the fixed 0.01 level at a smaller N. The two heights sit ~1.020980x apart
 *   (~2.098% in N, ~0.009017 decades) -- a structural consequence of E(N) > E_trunc, not a
 *   tabulation coincidence.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-36155 denominator distinction and ordering for
 *   quick reference. It establishes nothing, instantiates no interval, derives no remainder,
 *   changes no bound, closes no sub-gap. imp-35337a stays OPEN; imp-2519 no-overclaim guard
 *   preserved; NO QED. No refereed bound is changed.
 *
 * @see imp-36155-sharecoll-crossing-precedes-sole-survivor.js (source: the proved ordering and gap this glosses)
 * @see imp-36097-e-share-threshold-crossings-viz-data.js (source of the shareColl < 1% crossing)
 * @see imp-35971-etrunc-sole-survivor-height.js (source of the sole-survivor height)
 * @see imp-35889-e-share-decomposition-at-knees.js (the three-way split both landmarks live in)
 *
 * Ticket: imp-36282 (content, low). Documentation only; establishes no enclosure;
 * imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 */

// The shareColl-vs-sole-survivor denominator distinction, baked verbatim (no re-import).
const SHARECOLL_VS_ETRUNC_DENOMINATOR_HEADWORD = Object.freeze({
  key: 'sharecoll-crossing-vs-etrunc-sole-survivor',
  term:
    'shareColl < 1% crossing (imp-36097) vs. E_trunc sole-survivor height (imp-35971): the ' +
    'two-denominator distinction (imp-36155)',
  definition:
    'Two landmarks that both read as "the collision term E_coll hits 1%" but at different ' +
    'heights, because each divides the same E_coll numerator by a different denominator. The ' +
    'shareColl < 1% crossing is the first N where E_coll / E(N) = E_coll / (E_trunc + E_flow ' +
    '+ E_coll) < 0.01 (N_cross ~ 4.624381e13). The sole-survivor height is the first N where ' +
    'E_coll / E_trunc < 0.01 (N* ~ 4.7214e13), against the fixed E_trunc = 3.06e-5 floor alone.',
  whyDifferent:
    'E(N) = E_trunc + E_flow + E_coll > E_trunc strictly for every finite N (E_flow, E_coll ' +
    '> 0), so the share E_coll / E(N) is pointwise strictly less than the ratio-to-trunc ' +
    'E_coll / E_trunc at every N. Both are the SAME numerator against a fuller vs. a bare ' +
    'denominator -- not two independent measurements of E_coll.',
  whySharePrecedes:
    'Both curves decrease monotonically down the sigma -> 0 tail. Since the share curve lies ' +
    'pointwise below the ratio-to-trunc curve, the share reaches the fixed 0.01 level at a ' +
    'SMALLER N. Hence N_cross < N* always: the shareColl < 1% crossing structurally PRECEDES ' +
    'the sole-survivor height, by ~1.020980x (~2.098% in N, ~0.009017 decades) -- a consequence ' +
    'of E(N) > E_trunc, not a numerical accident.',
  liveObstruction:
    'none -- this is a measured/proved ordering (imp-36155), not an open sub-gap. imp-35337a ' +
    '(the underlying E_coll bound) stays OPEN independently of this ordering fact.',
});

export const IMP36282_SHARECOLL_VS_ETRUNC_DENOMINATOR_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-36282',
  proofSection: 'S-frontier',
  glosses: 'imp-36155',
  scopes: 'imp-35337a',
  question:
    'imp-36155 proved the shareColl < 1% crossing (imp-36097) always precedes the E_trunc ' +
    'sole-survivor height (imp-35971). Why are these two DIFFERENT landmarks rather than the ' +
    'same measurement, and why does the crossing structurally come first?',
  headword: SHARECOLL_VS_ETRUNC_DENOMINATOR_HEADWORD,
  anyEnclosureEstablished: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-36155 two-' +
    'denominator distinction: shareColl < 1% (E_coll / E(N) = 0.01, N_cross ~ 4.624381e13) ' +
    'versus the E_trunc sole-survivor height (E_coll / E_trunc = 0.01, N* ~ 4.7214e13), and ' +
    'why the share crossing structurally precedes the sole-survivor (E(N) > E_trunc always). ' +
    'Establishes nothing; instantiates no interval; closes no sub-gap; imp-35337a stays OPEN; ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-36155 (source ordering + gap); imp-36097 (shareColl < 1% crossing); imp-35971 ' +
    '(E_trunc sole-survivor height); imp-35889 (three-way split).',
});

export default IMP36282_SHARECOLL_VS_ETRUNC_DENOMINATOR_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP36282_SHARECOLL_VS_ETRUNC_DENOMINATOR_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp36282-headword-has-required-fields',
    why: 'The headword must define both landmarks, explain why they differ, and explain why the share crossing precedes the sole-survivor -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP36282_SHARECOLL_VS_ETRUNC_DENOMINATOR_GLOSSARY_HEADWORD.headword;
      return (
        /E_coll \/ E\(N\)/.test(h.definition) &&
        /E_coll \/ E_trunc/.test(h.definition) &&
        /E\(N\) = E_trunc \+ E_flow \+ E_coll/.test(h.whyDifferent) &&
        /N_cross < N\*/.test(h.whySharePrecedes)
      );
    },
  },
  {
    id: 'imp36282-honesty-gate-no-qed',
    why: 'Documentation only: no enclosure claimed established, imp-35337a stays OPEN, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP36282_SHARECOLL_VS_ETRUNC_DENOMINATOR_GLOSSARY_HEADWORD.anyEnclosureEstablished === false &&
      /NO QED/.test(IMP36282_SHARECOLL_VS_ETRUNC_DENOMINATOR_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP36282_SHARECOLL_VS_ETRUNC_DENOMINATOR_GLOSSARY_HEADWORD.verdict) &&
      /imp-35337a stays OPEN/.test(IMP36282_SHARECOLL_VS_ETRUNC_DENOMINATOR_GLOSSARY_HEADWORD.verdict) &&
      IMP36282_SHARECOLL_VS_ETRUNC_DENOMINATOR_GLOSSARY_HEADWORD.glosses === 'imp-36155' &&
      IMP36282_SHARECOLL_VS_ETRUNC_DENOMINATOR_GLOSSARY_HEADWORD.scopes === 'imp-35337a',
  },
];

for (const assertion of IMP36282_SHARECOLL_VS_ETRUNC_DENOMINATOR_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36282-sharecoll-vs-etrunc-denominator-glossary-headword assertion failed: ${assertion.id}`);
  }
}
