/**
 * @module imp-97148-growthlaw-two-layer-verdict-glossary-headword
 * @fileoverview imp-97148 -- import-light glossary/Concepts headword for the imp-97118 two-layer
 *   verdict: the imp-96750 interior second-moment growth law Int(N) = Theta(log N) splits into a
 *   FORM layer that rejects the Route M ||G||_F quadratic-turnover ceiling top end O(1)-INDEPENDENTLY,
 *   and a VALUE layer whose exact placement inherits the imp-96750 O(1)/s0* sub-gap. A reader who
 *   sees only "the growth law places the ceiling below the band floor" can mistake the whole verdict
 *   for a certified numeric result; it is a certified FORM result plus an uncertified VALUE reading.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-97118 answered a two-part question -- does the growth law constrain the far-field ceiling
 *   independently of the near-field holdout curvature, and does it land inside or outside the
 *   imp-96982 +1.37%..+8.36% band -- with an answer that has two layers of different certification
 *   strength. This headword bakes that two-layer split verbatim (no re-import of imp-97118) so the
 *   FORM conclusion (robust, O(1)-independent) is not conflated with the VALUE conclusion (inherits
 *   an open sub-gap).
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   LAYER (i) -- FORM, O(1)-INDEPENDENT. Int(N) = Theta(log N) is monotone and non-saturating; a
 *   log-growing interior mass never turns over, so the concave-quadratic far-field extrapolant
 *   (peak N ~ 2.31e9) is STRUCTURALLY inconsistent with the growth law -- its pre-turnover run-up is
 *   a curvature artifact, not a ceiling signal. This rejection uses NONE of the unproven imp-96750
 *   O(1)/s0* constant and is independent of the near-field holdout, which fixes only near-field
 *   CURVATURE, not far-field FORM.
 *   LAYER (ii) -- VALUE, O(1)-DEPENDENT. Turning the form into a number needs the point value
 *   F = 3.775e7 (from the interior slope s* ~ 5.76 = 2 zeta(2) s0, s0 ~ 1.751 measured). Read against
 *   the ORIGINAL imp-96982 band [+1.369%, +8.356%] (percent-vs-line), F sits at -0.30% -- BELOW the
 *   band floor by ~1.67 percentage points, i.e. outside the band on the low side. That placement
 *   inherits the imp-96750 one-sided weighted-cotangent second-moment O(1)/s0* sub-gap and is NOT
 *   certified.
 *   VERDICT SPLIT. The qualitative inside/outside answer (outside, low; quadratic top rejected) is
 *   robust because it follows from Layer (i) alone; the exact within-sliver numeric placement is a
 *   Layer (ii) reading and carries the open sub-gap. Treating the two layers as one claim would
 *   overstate what is certified.
 *
 *   STATUS: a glossary restatement of an already-committed two-layer verdict, not a new computation.
 *   The only rigorous anchor stays the trace ceiling T = 2.594e7; compute (N ~ 9916, imp-96352)
 *   binds first by >2600x regardless of where the far-field ceiling debate lands. No bound moved;
 *   NO QED. No refereed bound is changed; RH open.
 *
 * @see imp-97118-route-m-interior-growth-law-farfield-band-discriminator.js (source: the two-layer
 *   verdict this glosses)
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction.js (the Int(N) <= s* log N
 *   growth law and its O(1)/s0* sub-gap that Layer (ii) inherits)
 *
 * Ticket: imp-97148 (content, low, sonnet-4-6). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The two-layer verdict headword, baked verbatim (no re-import).
const GROWTHLAW_TWO_LAYER_VERDICT_HEADWORD = Object.freeze({
  key: 'route-m-growthlaw-form-vs-value-two-layer-verdict',
  term:
    'imp-97118 finding: the imp-96750 interior growth law Int(N) = Theta(log N) rejects the Route M ' +
    'far-field quadratic-turnover ceiling in a FORM layer that is O(1)-independent, while the exact ' +
    'numeric ceiling placement is a separate VALUE layer that inherits the imp-96750 open O(1)/s0* ' +
    'sub-gap -- the two must not be read as one certified claim',
  definition:
    'LAYER (i), FORM: Int(N) = Theta(log N) is monotone and never saturates, so the concave-quadratic ' +
    'far-field extrapolant (unphysical peak N ~ 2.31e9) is structurally inconsistent with it; this ' +
    'rejection uses none of the unproven O(1)/s0* constant and is independent of the near-field ' +
    'holdout, which fixes only near-field curvature. LAYER (ii), VALUE: the point value F = 3.775e7 ' +
    '(from interior slope s* ~ 5.76) places the predicted ceiling at -0.30% vs line, below the ' +
    'original +1.369% band floor by ~1.67 percentage points -- but that number inherits the ' +
    'imp-96750 one-sided weighted-cotangent second-moment O(1)/s0* sub-gap and is not certified.',
  mechanism:
    'The two layers answer different questions with different certification strength: Layer (i) asks ' +
    'whether the growth-law SHAPE is compatible with a turnover (no, provably, given only the ' +
    'rigorous Int(N) <= s* log N reduction) while Layer (ii) asks WHERE exactly the numeric ceiling ' +
    'sits (an estimate that requires the still-open s0* constant). Because Layer (i) needs no ' +
    'constant, the qualitative outside-low/quadratic-rejected verdict is robust even though Layer (ii) ' +
    'is not; a reader must keep the two separate rather than treat the numeric placement as equally ' +
    'certified.',
  verificationStatus:
    'Glossary restatement of the already-committed imp-97118 two-layer verdict; no new numerical ' +
    'computation. Only rigorous anchor is the trace ceiling T = 2.594e7; compute (N ~ 9916, ' +
    'imp-96352) binds first by >2600x; establishes no positivity theorem; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97148_GROWTHLAW_TWO_LAYER_VERDICT_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97148',
  proofSection: 'Route-M',
  glosses: 'imp-97118',
  question:
    'imp-97118 found that the imp-96750 interior growth law Int(N) = Theta(log N) both rejects the ' +
    'far-field quadratic-turnover ceiling top end and places a numeric ceiling estimate outside the ' +
    'imp-96982 band. Are those two conclusions equally certified, or does one rest on an open ' +
    'sub-gap that the other does not need?',
  headword: GROWTHLAW_TWO_LAYER_VERDICT_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-97118 finding: the FORM ' +
    'layer (log growth never turns over, so the quadratic top end is structurally rejected) is ' +
    'O(1)-INDEPENDENT and robust, while the VALUE layer (numeric ceiling F = 3.775e7, placed at ' +
    '-0.30% vs line, below the band floor) inherits the imp-96750 O(1)/s0* sub-gap and is NOT ' +
    'certified. Readers should not treat the numeric placement as certified just because the ' +
    'qualitative form rejection is. Only rigorous anchor stays T = 2.594e7; changes no bound; NO ' +
    'QED. No refereed bound is changed.',
  citation:
    'imp-97118 (the two-layer verdict this glosses); imp-96750 (the Int(N) <= s* log N growth law ' +
    'and its O(1)/s0* sub-gap that Layer (ii) inherits).',
});

export default IMP97148_GROWTHLAW_TWO_LAYER_VERDICT_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97148_GROWTHLAW_TWO_LAYER_VERDICT_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97148-headword-names-both-layers',
    why: 'The headword must name both layers (FORM, O(1)-independent; VALUE, O(1)/s0*-dependent) -- ' +
      'the entire point of the glossary entry.',
    holds: () => {
      const h = IMP97148_GROWTHLAW_TWO_LAYER_VERDICT_GLOSSARY_HEADWORD.headword;
      return (
        /LAYER \(i\)/.test(h.definition) &&
        /LAYER \(ii\)/.test(h.definition) &&
        /O\(1\)-independent/i.test(h.term) &&
        /sub-gap/.test(h.definition)
      );
    },
  },
  {
    id: 'imp97148-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97148_GROWTHLAW_TWO_LAYER_VERDICT_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97148_GROWTHLAW_TWO_LAYER_VERDICT_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97148_GROWTHLAW_TWO_LAYER_VERDICT_GLOSSARY_HEADWORD.verdict) &&
      IMP97148_GROWTHLAW_TWO_LAYER_VERDICT_GLOSSARY_HEADWORD.glosses === 'imp-97118',
  },
];

for (const assertion of IMP97148_GROWTHLAW_TWO_LAYER_VERDICT_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97148-growthlaw-two-layer-verdict-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
