/**
 * @module imp-95264-coalescence-law-concept-note
 * @fileoverview imp-95264 -- import-light concept note for the pair
 *   coalescence law coalLaw(y) = e^(-2y)(1 + 2y^2 + 2y sqrt(1+y^2)), the
 *   numerator ingredient reused (each with a local re-definition, not a
 *   live import) by imp-95249 COROLLARY IN-OCT and imp-95250 COROLLARY
 *   EV-OCT: what it bounds, where it comes from, and its pair-only scope.
 *
 *   WHY A CONCEPT NOTE (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95227 proves coalLaw as THEOREM COAL-DOM (a strict dominance
 *   endpoint) and imp-95231 proves it is the r -> 1+ monotone endpoint of
 *   the exact two-rate constant Lambda_2(x, r) (THEOREM RATE-MONO). Both
 *   later legs of the seam chain -- imp-95249 (in-octave pairs) and
 *   imp-95250 (every-octave twins) -- reuse the same closed form as the
 *   twin-pair seam numerator, each re-baking it locally rather than
 *   importing imp-95227/imp-95231 directly (import-light convention). This
 *   note restates what the law is and why it recurs; it re-derives
 *   nothing and establishes no new bound.
 *
 *   THE NOTE
 *   -----------------------------------------------
 *   For a signed two-rate exponential pair with slower rate normalized to
 *   1, depth x = nu_1 d, and rate ratio r = nu_2/nu_1 > 1, the exact
 *   shift constant is Lambda_2(x, r) = rho(x, r)^2 (imp-95226 THEOREM
 *   SGN-2X closed form). imp-95231 THEOREM RATE-MONO proves Lambda_2 is
 *   nonincreasing in r at fixed x, so its supremum over r > 1 is attained
 *   at the coalescent limit r -> 1+, where imp-95227 shows the closed
 *   form collapses to
 *     coalLaw(x) = e^(-2x) (1 + 2x^2 + 2x sqrt(1+x^2)).
 *   coalLaw(x) is therefore not a separate estimate -- it is the EXACT
 *   endpoint value that the whole pair family Lambda_2(x, r) is squeezed
 *   against as the two rates merge, and by RATE-MONO it strictly
 *   dominates every finite-ratio pair (r-uniform: the bound needs no
 *   knowledge of r beyond r > 1).
 *
 *   WHY IT MATTERS (reused, not re-derived, downstream)
 *   -----------------------------------------------
 *   Because coalLaw(x) is an r-uniform ceiling on the twin-pair seam
 *   constant, every later certificate that must bound a pair of nearby
 *   rates inside one octave (imp-95249 COROLLARY IN-OCT) or a repeated
 *   twin pattern across octaves (imp-95250 COROLLARY EV-OCT /
 *   EV-OCT-UNIF) can plug in coalLaw(x) as the numerator piece for that
 *   pair WITHOUT tracking the actual intra-pair ratio r of the family
 *   being certified. This is what makes the law reusable machinery
 *   rather than a one-off computation: it is depth-only (a function of x
 *   alone), which is exactly the property the seam-chain certificates
 *   need to stay coalescence-uniform.
 *
 *   WHAT IT DOES NOT DO (pair-only scope)
 *   -----------------------------------------------
 *   coalLaw is proved and reused strictly for TWO-rate (pair) families.
 *   It is not, by itself, an N-fold bound: extending the same
 *   endpoint-dominance idea to three or more coalescing rates is a named
 *   residual left open by imp-95227/imp-95231, later supplied (as a
 *   majorant, not coalLaw itself) by imp-95251 THEOREM COAL-N. This note
 *   documents only the pair law and its two direct downstream reuses; it
 *   does not restate or verify the N-fold generalization.
 *
 * @see imp-95227-two-rate-coalescence-dominance-theorem.js (source:
 *   THEOREM COAL-DOM, capC(x) closed form)
 * @see imp-95231-coalescence-ratio-monotonicity.js (source: THEOREM
 *   RATE-MONO, coalLaw(x) named and proved the r -> 1+ endpoint)
 * @see imp-95249-inoctave-pair-split-certificate.js (reuse: COROLLARY
 *   IN-OCT numerator)
 * @see imp-95250-leaveoneout-multiblock-split-certificate.js (reuse:
 *   COROLLARY EV-OCT / EV-OCT-UNIF numerator)
 * @see imp-95251-nfold-coalescence-law.js (named residual: N-fold
 *   majorant, not this pair law)
 *
 * Ticket: imp-95264 (content, low). Documentation only; establishes no new
 * bound; NO QED; no refereed bound is changed.
 */

// The concept-note content, baked verbatim (no re-import of imp-95227/95231).
const COALESCENCE_LAW_HEADWORD = Object.freeze({
  key: 'coalescence-law',
  term:
    'Coalescence law coalLaw(y) = e^(-2y)(1 + 2y^2 + 2y sqrt(1+y^2)), the ' +
    'imp-95227 COAL-DOM endpoint dominance reused as a numerator ' +
    'ingredient by imp-95249 and imp-95250',
  whatItBounds:
    'The exact signed twin-pair shift constant Lambda_2(x, r) at depth ' +
    'x = nu_1 d and rate ratio r = nu_2/nu_1 > 1. imp-95231 THEOREM ' +
    'RATE-MONO proves Lambda_2 is nonincreasing in r at fixed x, so its ' +
    'r-uniform supremum is the r -> 1+ coalescent limit, which imp-95227 ' +
    'THEOREM COAL-DOM shows equals coalLaw(x) exactly.',
  whyItIsRUniform:
    'coalLaw(x) is a function of depth x alone -- it needs no knowledge ' +
    'of the actual intra-pair ratio r of the family being bounded beyond ' +
    'r > 1, because it is the dominance ENDPOINT of the whole family, ' +
    'not an estimate tied to one ratio.',
  whyItIsReused:
    'Both imp-95249 COROLLARY IN-OCT (in-octave pairs) and imp-95250 ' +
    'COROLLARY EV-OCT / EV-OCT-UNIF (every-octave twins) plug coalLaw(x) ' +
    'in as the twin-pair seam numerator, each re-baking the same closed ' +
    'form locally rather than importing imp-95227/imp-95231 (import-light ' +
    'convention) -- the r-uniformity is exactly the property that lets a ' +
    'depth-only numerator serve both downstream certificates.',
  whatItDoesNotDo:
    'coalLaw is a PAIR-only (N = 2) law. Extending the same ' +
    'endpoint-dominance idea to three or more coalescing rates is a named ' +
    'residual left open here, later supplied as a separate majorant ' +
    '(not coalLaw itself) by imp-95251 THEOREM COAL-N.',
});

export const IMP95264_COALESCENCE_LAW_CONCEPT_NOTE = Object.freeze({
  id: 'imp-95264',
  proofSection: 'S-frontier',
  glosses: 'imp-95227',
  scopes: 'coalescence law coalLaw(y) = e^(-2y)(1 + 2y^2 + 2y sqrt(1+y^2))',
  question:
    'What does the imp-95227 coalescence law coalLaw(y) bound, why is it ' +
    'r-uniform, and why do imp-95249/imp-95250 reuse it rather than ' +
    're-deriving it?',
  headword: COALESCENCE_LAW_HEADWORD,
  anyEnclosureEstablished: false,
  verdict:
    'CONCEPT NOTE ONLY (documentation, not a proof). Restates the ' +
    'imp-95227/imp-95231 coalescence law coalLaw(y) as the r -> 1+ ' +
    'endpoint dominance of the exact twin-pair shift constant, why that ' +
    'makes it r-uniform and reusable as a depth-only numerator by ' +
    'imp-95249 and imp-95250, and that it is pair-only (N-fold extension ' +
    'is the imp-95251 named residual). Establishes nothing new; fires no ' +
    'certificate; no refereed bound is changed.',
  citation:
    'imp-95227-two-rate-coalescence-dominance-theorem.js (THEOREM ' +
    'COAL-DOM); imp-95231-coalescence-ratio-monotonicity.js (THEOREM ' +
    'RATE-MONO); imp-95249-inoctave-pair-split-certificate.js (reuse); ' +
    'imp-95250-leaveoneout-multiblock-split-certificate.js (reuse); ' +
    'imp-95251-nfold-coalescence-law.js (named residual).',
});

export default IMP95264_COALESCENCE_LAW_CONCEPT_NOTE;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95264_COALESCENCE_LAW_CONCEPT_NOTE_ASSERTIONS = [
  {
    id: 'imp95264-headword-has-required-fields',
    why:
      'The concept note must state what coalLaw bounds, why it is ' +
      'r-uniform, why it is reused rather than re-derived, and its ' +
      'pair-only scope -- the entire point of the note.',
    holds: () => {
      const h = IMP95264_COALESCENCE_LAW_CONCEPT_NOTE.headword;
      return (
        /Lambda_2/.test(h.whatItBounds) &&
        /RATE-MONO/.test(h.whatItBounds) &&
        /depth x alone|function of depth x alone/i.test(h.whyItIsRUniform) &&
        /imp-95249/.test(h.whyItIsReused) &&
        /imp-95250/.test(h.whyItIsReused) &&
        /imp-95251/.test(h.whatItDoesNotDo)
      );
    },
  },
  {
    id: 'imp95264-coalLaw-matches-baked-closed-form',
    why:
      'The note quotes the coalLaw closed form; verify it matches the ' +
      'imp-95227/imp-95231 definition exactly (self-contained, no import).',
    holds: () => {
      const coalLaw = (x) =>
        Math.exp(-2 * x) * (1 + 2 * x * x + 2 * x * Math.sqrt(1 + x * x));
      // Endpoint sanity: coalLaw(0) = 1, and coalLaw is strictly decreasing.
      const atZero = Math.abs(coalLaw(0) - 1) < 1e-12;
      const decreasing = [0.1, 0.5, 1, 2, 5].every(
        (x, i, arr) => i === 0 || coalLaw(arr[i]) < coalLaw(arr[i - 1])
      );
      return atZero && decreasing;
    },
  },
  {
    id: 'imp95264-honesty-gate-no-qed',
    why:
      'Documentation only: no enclosure claimed established, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95264_COALESCENCE_LAW_CONCEPT_NOTE.anyEnclosureEstablished ===
        false &&
      /refereed bound is changed/i.test(IMP95264_COALESCENCE_LAW_CONCEPT_NOTE.verdict) &&
      IMP95264_COALESCENCE_LAW_CONCEPT_NOTE.glosses === 'imp-95227' &&
      IMP95264_COALESCENCE_LAW_CONCEPT_NOTE.scopes ===
        'coalescence law coalLaw(y) = e^(-2y)(1 + 2y^2 + 2y sqrt(1+y^2))',
  },
];

for (const assertion of IMP95264_COALESCENCE_LAW_CONCEPT_NOTE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95264-coalescence-law-concept-note assertion failed: ${assertion.id}`
    );
  }
}
