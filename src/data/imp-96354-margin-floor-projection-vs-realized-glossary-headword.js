/**
 * @module imp-96354-margin-floor-projection-vs-realized-glossary-headword
 * @fileoverview imp-96354 -- import-light glossary/Concepts headword for the imp-96328
 *   verdict: the imp-96307 far-high-T anchor projection (floor c/SE rising 6.56 -> 10.58)
 *   is a DESIGN floor conditional on the new anchor landing ON the fitted line, and the
 *   MEASURED rho(32,T=4000)=0.3845 datum (imp-96224) does not land there -- it sits
 *   below the extrapolation and COLLAPSES the intercept and its confidence instead.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96307 projected, via the OLS leverage identity, that a single new anchor at
 *   T=4000 would harden the imp-96289 reciprocal-log margin-floor sign from 6.56 SE to
 *   ~10.58 SE above zero -- but that projection placed the anchor at its plausible
 *   ON-LINE value (zero residual by construction), so the floor c stayed pinned at
 *   0.14256 and the whole gain showed up as a smaller SE. imp-96328 then supplied the
 *   REAL measured value at that height and refit: the real datum sits ~0.060 below the
 *   on-line extrapolation, so the realized eight-anchor floor DROPS to c=0.05302 and its
 *   off-line residual inflates the SE, collapsing the sign confidence to 1.69 SE -- the
 *   opposite of the projected hardening. A reader landing on imp-96307 cold (which reads
 *   as an unconditional confidence-gain result) has no quick-lookup warning that the
 *   projection is conditional and was refuted on contact with real data. This headword
 *   bakes that distinction VERBATIM (no re-import of the imp-96307/imp-96328 modules, to
 *   stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The imp-96307 projection that a new far-high-T anchor would harden the on-line
 *   margin-floor sign from 6.56 SE to ~10.58 SE above zero is a DESIGN floor, not a
 *   realized result: it holds only if the new anchor happens to land on the seven-point
 *   fitted line. The actually measured rho(32,T=4000)=0.3845 (imp-96224) sits ~0.060
 *   below that on-line extrapolation, and refitting with the real value instead
 *   COLLAPSES the intercept c from 0.14256 to 0.05302 and its confidence from 6.56 SE to
 *   1.69 SE -- softening the sign rather than hardening it.
 *
 *   MECHANISM: intercept SE depends only on the x-design and residual scale, not on the
 *   realized ordinate, so a new anchor placed exactly on the fitted line shrinks SE with
 *   c unmoved (the imp-96307 design point). A real anchor generally misses the line; at
 *   x near the intercept a below-line residual pulls c down AND inflates the residual
 *   variance s2 (hence SE), so both effects move the sign confidence the wrong way at
 *   once. The 4000-height off-line residual (-0.05966) is large enough to flip a
 *   projected +4-SE hardening into a realized -4.9-SE softening.
 *
 *   STATUS: a REFUTATION-BY-MEASUREMENT of a conditional projection, not a bound move.
 *   The realized floor sign stays strictly positive (c=0.05302 > 0, 1.69 SE), consistent
 *   with imp-96224's independent full-column finding that the on-line floor trends
 *   toward zero rather than settling at 0.143. The binding uniform-in-T obstruction
 *   remains OFF the critical line either way.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96328 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96328-margin-floor-realized-gamma4000-anchor (source: the realized refit this glosses)
 * @see imp-96307-anchor-confidence-gain-projection (the conditional design-floor projection tested)
 * @see imp-96224-route-bd-online-margin-floor-gamma4000 (the measured rho(32,4000)=0.3845 datum)
 * @see imp-96289-margin-floor-t60-anchor-sensitivity (the 7-point 6.56-SE baseline)
 *
 * Ticket: imp-96354 (content, medium). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The design-floor-vs-realized-collapse headword, baked verbatim (no re-import).
const MARGIN_FLOOR_PROJECTION_VS_REALIZED_HEADWORD = Object.freeze({
  key: 'margin-floor-projection-is-design-floor-realized-datum-collapses-it',
  term:
    'imp-96328 verdict: the imp-96307 6.56 -> 10.58 SE margin-floor hardening projection ' +
    'is a design floor conditional on landing on-line; the measured rho(32,4000)=0.3845 ' +
    'collapses it to 1.69 SE instead',
  definition:
    'imp-96307 projected that a new far-high-T anchor at T=4000 would lift the imp-96289 ' +
    'reciprocal-log margin-floor sign confidence from 6.56 SE to ~10.58 SE above zero, by ' +
    'placing the anchor at its plausible on-line value (zero residual, floor c unchanged ' +
    'at 0.14256, all gain in a smaller SE). imp-96224 then measured the real value at that ' +
    'height, rho(32,4000)=0.3845, which sits ~0.060 below the on-line extrapolation. ' +
    'imp-96328 refit with that real datum: the floor DROPS to c=0.05302 and the sign ' +
    'confidence COLLAPSES to 1.69 SE.',
  mechanism:
    'The intercept SE depends only on the x-design and residual scale, not on the ' +
    'realized ordinate -- so an anchor placed exactly on the fitted line shrinks SE with ' +
    'c unmoved, which is the imp-96307 design point. A real anchor generally misses the ' +
    'line; near the intercept, a below-line residual pulls c down AND inflates the ' +
    'residual variance s2 (hence SE) simultaneously, so both effects move the sign ' +
    'confidence the wrong way at once rather than the projected single-direction gain.',
  verificationStatus:
    'REFUTATION-BY-MEASUREMENT of a conditional projection, not a bound move. The ' +
    'realized floor sign stays strictly positive (c=0.05302 > 0, 1.69 SE), consistent ' +
    'with the imp-96224 independent full-column finding that the on-line floor trends ' +
    'toward zero rather than settling at 0.143. The binding uniform-in-T obstruction ' +
    'stays OFF the critical line either way. Changes no bound; no refereed bound is changed; RH ' +
    'open; NO QED.',
});

export const IMP96354_MARGIN_FLOOR_PROJECTION_VS_REALIZED_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96354',
  proofSection: 'S-frontier',
  glosses: 'imp-96328',
  question:
    'imp-96307 projected that a new far-high-T anchor would harden the on-line margin-' +
    'floor sign confidence from 6.56 SE to ~10.58 SE. Did that hardening materialize once ' +
    'imp-96224 supplied the actually measured value at that height, and what should a ' +
    'reader landing on imp-96307 cold take away?',
  headword: MARGIN_FLOOR_PROJECTION_VS_REALIZED_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96328 verdict: ' +
    'the imp-96307 projected hardening (6.56 -> 10.58 SE) is a DESIGN floor realized only ' +
    'if the new anchor lands on the fitted line, and the measured rho(32,4000)=0.3845 ' +
    '(imp-96224) does not -- refitting with the real value COLLAPSES the intercept ' +
    '(0.14256 -> 0.05302) and its confidence (6.56 -> 1.69 SE) instead. The realized ' +
    'floor sign stays strictly positive but far weaker than projected. Establishes ' +
    'nothing; instantiates no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96328 (the realized refit this glosses); imp-96307 (the conditional design-floor ' +
    'projection tested); imp-96224 (the measured rho(32,4000)=0.3845 datum); imp-96289 ' +
    '(the 7-point 6.56-SE baseline).',
});

export default IMP96354_MARGIN_FLOOR_PROJECTION_VS_REALIZED_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96354_MARGIN_FLOOR_PROJECTION_VS_REALIZED_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96354-headword-has-required-fields',
    why: 'The headword must name the projected SE, the measured margin, the realized ' +
      'collapsed floor and SE, and the off-line residual mechanism -- the entire point ' +
      'of the glossary entry.',
    holds: () => {
      const h = IMP96354_MARGIN_FLOOR_PROJECTION_VS_REALIZED_GLOSSARY_HEADWORD.headword;
      return (
        /10\.58/.test(h.definition) &&
        /0\.3845/.test(h.definition) &&
        /0\.05302/.test(h.definition) &&
        /1\.69/.test(h.definition) &&
        /residual/i.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96354-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96354_MARGIN_FLOOR_PROJECTION_VS_REALIZED_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96354_MARGIN_FLOOR_PROJECTION_VS_REALIZED_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96354_MARGIN_FLOOR_PROJECTION_VS_REALIZED_GLOSSARY_HEADWORD.verdict) &&
      IMP96354_MARGIN_FLOOR_PROJECTION_VS_REALIZED_GLOSSARY_HEADWORD.glosses === 'imp-96328',
  },
];

for (const assertion of IMP96354_MARGIN_FLOOR_PROJECTION_VS_REALIZED_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96354-margin-floor-projection-vs-realized-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
