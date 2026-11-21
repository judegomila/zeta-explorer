/**
 * @module imp-95666-e-trunc-one-sided-down-glossary-headword
 * @fileoverview imp-95666 -- import-light glossary/Concepts headword for the imp-95635 P1/P2 finding:
 *   the imp-95617 transition-before-knee inversion wedge is physically UNREACHABLE because the honest
 *   provenance-grounded uncertainty on E_trunc is ONE-SIDED DOWN (Guth-Maynard 2024 -> 0.458x multiplier),
 *   pointing AWAY from the wedge corner rather than toward it.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95635 mapped the arbitrary [0.5x, 1.5x]^2 multiplier box in which imp-95617 found a negative-gap
 *   "wedge" onto real provenance-grounded physical uncertainty bands on C_C and E_trunc, but a reader
 *   landing on that module cold has no quick-lookup definition of "the wedge", "one-sided down", or why
 *   GM2024 forecloses reachability. This headword bakes those facts VERBATIM (no re-import of the
 *   imp-95635 module, to stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The wedge: the imp-95617 joint 2-D sweep found the E_coll = E_trunc transition-before-knee ordering
 *   inverts (box-min gap ~ -0.00468) only in the low-C_C / high-E_trunc corner of an arbitrary +/-50%
 *   multiplier box, i.e. it needs E_trunc pushed UP toward its 1.5x edge and C_C shrunk toward its 0.5x
 *   edge. imp-95635 derived the honest physical E_trunc band from its provenance (E_trunc = (2 e_I/kappa)
 *   T_PT^{-kappa}, Ingham e_I=0.6, kappa=0.4, at T_PT=3e12, imp-2631): the ONLY defensible physical lever
 *   is Guth-Maynard 2024's sharpened near-sigma=3/4 density exponent (e_GM=0.577), which LOWERS E_trunc to
 *   ~1.4e-5 = 0.458x. No defensible route inflates E_trunc past a generous prefactor-slack ceiling of
 *   ~1.1x. So the honest E_trunc band is ~[0.458, 1.1] -- ONE-SIDED DOWN, never reaching the wedge's
 *   1.5x edge. Since lowering E_trunc raises A = C_C/E_trunc and pushes the knee UP (widening, not
 *   closing, the gap), the wedge sits in the physically WRONG-SIGNED corner. Even at the most-adverse
 *   defensible corner (E_trunc 1.1x, C_C best-case 0.577x via a conjectured Koksma-Hlawka C_Selberg 3->1)
 *   the gap stays ~+0.00353 > 0: the ordering never inverts. Verdict: the imp-95617 wedge is physically
 *   UNREACHABLE, an artifact of the arbitrary +/-50% modelling box rather than a genuine uncertainty.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95635 P1/P2 finding and the GM2024 one-sided-down figure
 *   for quick reference. It establishes nothing, instantiates no interval, closes no sub-gap, moves no
 *   bound. imp-2519 no-overclaim guard preserved; NO QED. No refereed bound is changed.
 *
 * @see imp-95635-physical-bands-vs-inversion-wedge (source: the honest E_trunc/C_C bands + P1/P2 finding this glosses)
 * @see imp-95617-transition-knee-ordering-joint-2d (the arbitrary +/-50% box sweep that surfaced the wedge)
 * @see imp-2631-honest-truncation-route-assessment (E_trunc = 3.06e-5; GM2024 route c -> 1.4e-5 = 0.458x)
 * @see imp-95695-cf-wedge-foreclosure-glossary-headword (sibling headword: the same wedge via the C_F/cf* route)
 *
 * Ticket: imp-95666 (content, low). Documentation only; establishes nothing; wedge stays UNREACHABLE per
 * imp-95635; NO QED; no refereed bound is changed.
 */

// The E_trunc one-sided-down glossary headword, baked verbatim (no re-import).
const E_TRUNC_ONE_SIDED_DOWN_HEADWORD = Object.freeze({
  key: 'e-trunc-one-sided-down-wedge-unreachable',
  term: 'imp-95635 P1/P2 finding: the imp-95617 inversion wedge is physically UNREACHABLE',
  definition:
    'The imp-95617 transition-before-knee joint sweep found the E_coll = E_trunc ordering inverts ' +
    '(box-min gap ~ -0.00468) only in the low-C_C / high-E_trunc corner of an arbitrary +/-50% ' +
    'multiplier box, i.e. it needs E_trunc pushed UP and C_C shrunk. imp-95635 shows the honest ' +
    'physical E_trunc uncertainty band is ~[0.458x, 1.1x], ONE-SIDED DOWN, never reaching the 1.5x edge ' +
    'the wedge needs.',
  oneSidedDownLever:
    'The only defensible physical move on E_trunc = (2 e_I/kappa) T_PT^{-kappa} (imp-2631) is ' +
    'Guth-Maynard 2024\'s sharpened near-sigma=3/4 density exponent e_GM = 0.577, which LOWERS E_trunc ' +
    'to ~1.4e-5 = 0.458x. No defensible route inflates E_trunc past a generous prefactor-slack ceiling ' +
    'of ~1.1x, so the band ~[0.458, 1.1] points strictly away from the wedge\'s 1.5x corner.',
  wrongSignedCorner:
    'Lowering E_trunc raises A = C_C/E_trunc and pushes the knee UP, widening the gap rather than ' +
    'closing it. The wedge therefore sits in the physically WRONG-SIGNED corner: the honest direction ' +
    'of E_trunc uncertainty runs opposite to what the wedge requires.',
  physicalCornerDoesNotInvert:
    'Even at the most-adverse defensible corner (E_trunc generous 1.1x together with the best-case C_C ' +
    '0.577x, a conjectured Koksma-Hlawka C_Selberg 3->1), the gap stays ~+0.00353 > 0: the transition ' +
    'still precedes the knee. The arbitrary-box inversion at (C_C 0.5x, E_trunc 1.5x) is not reachable ' +
    'by any defensible combination.',
});

export const IMP95666_E_TRUNC_ONE_SIDED_DOWN_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95666',
  proofSection: 'S-frontier',
  glosses: 'imp-95635',
  scopes: 'imp-95617',
  question:
    'imp-95635 decided that the honest physical E_trunc uncertainty band is one-sided down (Guth-Maynard ' +
    '2024 -> 0.458x), pointing away from the imp-95617 inversion wedge. What is the wedge, what does ' +
    '"one-sided down" mean, and why is the verdict physical unreachability, for a reader landing cold?',
  headword: E_TRUNC_ONE_SIDED_DOWN_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95635 P1/P2 finding: the ' +
    'imp-95617 inversion wedge needs E_trunc pushed UP toward its 1.5x box edge, but the honest physical ' +
    'E_trunc uncertainty (Guth-Maynard 2024) is ONE-SIDED DOWN (~0.458x, ceiling ~1.1x), pointing away ' +
    'from the wedge corner. Even the most-adverse defensible corner keeps the ordering gap ~+0.00353 > 0. ' +
    'The wedge is physically UNREACHABLE, an artifact of the arbitrary +/-50% modelling box. Establishes ' +
    'nothing; instantiates no interval; moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-95635 (honest C_C/E_trunc physical bands + P1/P2 finding); imp-95617 (arbitrary 2-D box ' +
    'sweep surfacing the wedge); imp-2631 (E_trunc = 3.06e-5; Guth-Maynard 2024 route c -> 1.4e-5).',
});

export default IMP95666_E_TRUNC_ONE_SIDED_DOWN_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95666_E_TRUNC_ONE_SIDED_DOWN_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95666-headword-has-required-fields',
    why: 'The headword must name the 0.458x GM2024 multiplier, the one-sided-down direction, and the wrong-signed-corner reasoning -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP95666_E_TRUNC_ONE_SIDED_DOWN_GLOSSARY_HEADWORD.headword;
      return (
        /0\.458x/.test(h.definition) &&
        /ONE-SIDED DOWN/.test(h.definition) &&
        /0\.458x/.test(h.oneSidedDownLever) &&
        /WRONG-SIGNED/.test(h.wrongSignedCorner) &&
        /\+0\.00353/.test(h.physicalCornerDoesNotInvert)
      );
    },
  },
  {
    id: 'imp95666-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, wedge stays UNREACHABLE, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95666_E_TRUNC_ONE_SIDED_DOWN_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95666_E_TRUNC_ONE_SIDED_DOWN_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95666_E_TRUNC_ONE_SIDED_DOWN_GLOSSARY_HEADWORD.verdict) &&
      /UNREACHABLE/.test(IMP95666_E_TRUNC_ONE_SIDED_DOWN_GLOSSARY_HEADWORD.verdict) &&
      IMP95666_E_TRUNC_ONE_SIDED_DOWN_GLOSSARY_HEADWORD.glosses === 'imp-95635' &&
      IMP95666_E_TRUNC_ONE_SIDED_DOWN_GLOSSARY_HEADWORD.scopes === 'imp-95617',
  },
];

for (const assertion of IMP95666_E_TRUNC_ONE_SIDED_DOWN_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-95666-e-trunc-one-sided-down-glossary-headword assertion failed: ${assertion.id}`);
  }
}
