/**
 * @module imp-95669-kappa-provenance-glossary-headword
 * @fileoverview imp-95669 -- import-light glossary/Concepts headword for the imp-95637 verdict on
 *   the Sun-Catalan c_odd curvature constant kappa = 2.51069789: it is ANCHOR-VERIFIED as a value
 *   at rho = 1/20, but SHAPE-UNCERTIFIED as a curvature (a single-point fit of an assumed rho^2
 *   form), and the imp-95618 placement-robust "> 0.037" conclusion is kappa-INSENSITIVE.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95637 traced kappa=2.51069789 to an exact one-point back-solve of the imp-95516-verified
 *   c_odd(1/20)=0.006276744725 divided by (1/20)^2, and measured the sensitivity of the imp-95618
 *   robust conclusion to it. A reader landing on imp-95516/95600/95615/95618/95637 cold has no
 *   quick-lookup definition of "anchor-verified but shape-uncertified" or why the robust claim does
 *   not actually depend on kappa. This headword bakes those facts VERBATIM (no re-import of the
 *   imp-95637 module, to stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   kappa = c_odd(1/20) / (1/20)^2 = 0.006276744725 / 0.0025 = 2.51069789 (exact). It is not an
 *   independently derived Sun Section 6 output -- it is the back-solve of the ASSUMED functional
 *   form c_odd(rho) = kappa rho^2 at the single verified anchor rho = 1/20. As a NUMBER at that
 *   anchor it is DISCHARGED (rides on the verified c_odd(1/20)). As a CURVATURE governing c_odd off
 *   the anchor it is an OPEN sub-gap: a single-point fit of an uncertified rho^2 shape, not a
 *   point-by-point certification.
 *
 *   Despite that open shape question, the imp-95618 placement-robust claim "delta_0_corr(rho*) >
 *   0.037 in EVERY placement" turns out NOT to depend on kappa: kappa enters only placement C
 *   (shift coefficient +2 kappa), while placements A (shift -4, marginAtOpt 0.03730) and B (shift
 *   -1, marginAtOpt 0.03834) are kappa-free. The robust ">0.037" floor is set by the kappa-free
 *   placement A, and placement C stays in [0.0398, 0.0446] -- always above 0.037 -- across a
 *   [0.5x, 2.0x] band on kappa. So the OPEN shape question does not threaten the robust conclusion.
 *
 *   Later, imp-95690 (a primary-source read of Sun Prop 6.3) SUPERSEDED the "OPEN" characterization
 *   with a REFUTATION: the rho^2 prefactor is structurally forced, but the v-integral factor J(rho)
 *   is NOT rho-independent as written, so kappa*rho^2 is not a structurally forced shape off the
 *   anchor. The kappa-insensitivity result is unaffected, since it never assumed the shape held.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95637 provenance verdict and its kappa-insensitivity
 *   figures for quick reference. It establishes nothing, instantiates no interval, closes no
 *   sub-gap, moves no bound. Catalan constant G irrationality remains OPEN; Sun arXiv:2609.04176
 *   single-author and unrefereed; NO QED. No refereed bound is changed.
 *
 * @see imp-95637-kappa-provenance-assessment (source: the provenance/certification verdict and sensitivity scan this glosses)
 * @see imp-95618 (the placement-robust ">0.037" conclusion whose kappa-insensitivity this headword records)
 * @see imp-95516 (the verified anchor datum c_odd(1/20)=0.006276744725)
 * @see imp-95690-sun-s6-integrand-rho-independence-verdict (later primary-source refutation of the rho^2 shape)
 *
 * Ticket: imp-95669 (content, low). Documentation only; establishes nothing; NO QED; no refereed bound is changed.
 */

// The kappa-provenance headword, baked verbatim (no re-import).
const KAPPA_PROVENANCE_HEADWORD = Object.freeze({
  key: 'sun-catalan-kappa-anchor-verified-shape-uncertified',
  term: 'imp-95637 verdict: the Sun-Catalan curvature kappa=2.51069789 is ANCHOR-VERIFIED but SHAPE-UNCERTIFIED, and the imp-95618 ">0.037" claim is kappa-insensitive',
  definition:
    'kappa = c_odd(1/20) / (1/20)^2 = 0.006276744725 / 0.0025 = 2.51069789 (exact). It is the ' +
    'one-point back-solve of the ASSUMED functional form c_odd(rho) = kappa rho^2 at the single ' +
    'imp-95516-verified anchor rho = 1/20, not an independently derived Section 6 output. As a ' +
    'NUMBER at the anchor it is DISCHARGED; as a CURVATURE governing c_odd off the anchor it is an ' +
    'OPEN sub-gap -- a single-point fit of an uncertified rho^2 shape.',
  kappaInsensitivity:
    'kappa enters the imp-95618 placement-robust "> 0.037" conclusion ONLY through placement C ' +
    '(shift coefficient +2 kappa). Placements A (shift -4, marginAtOpt 0.03730) and B (shift -1, ' +
    'marginAtOpt 0.03834) are kappa-free. The robust floor is set by the kappa-free placement A, ' +
    'and placement C stays in [0.0398, 0.0446] -- always above 0.037 -- across a [0.5x, 2.0x] band ' +
    'on kappa. So the robust conclusion is kappa-insensitive: the open shape question does not ' +
    'threaten it.',
  laterSupersession:
    'imp-95690 (primary-source read of Sun Prop 6.3) SUPERSEDED the "OPEN" shape characterization ' +
    'with a REFUTATION: the rho^2 prefactor is structurally forced, but the v-integral factor J(rho) ' +
    'is NOT rho-independent as written, so kappa*rho^2 is not a structurally forced shape off the ' +
    'anchor. The kappa-insensitivity result above is unaffected, since it never assumed the shape held.',
});

export const IMP95669_KAPPA_PROVENANCE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95669',
  proofSection: 'S-frontier',
  glosses: 'imp-95637',
  scopes: 'imp-95618',
  question:
    'imp-95637 traced kappa=2.51069789 to a one-point back-solve of the verified c_odd(1/20) and ' +
    'measured its role in the imp-95618 robust ">0.037" conclusion. What is the anchor-verified-vs-' +
    'shape-uncertified distinction, and why is the robust conclusion kappa-insensitive, for a reader ' +
    'landing on that module cold?',
  headword: KAPPA_PROVENANCE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95637 verdict: kappa is ' +
    'DISCHARGED as a value at the anchor rho=1/20 but was an OPEN sub-gap (later REFUTED by ' +
    'imp-95690) as a curvature off it; the imp-95618 placement-robust ">0.037" conclusion is ' +
    'kappa-INSENSITIVE regardless, since it is bound by the kappa-free placement A. Establishes ' +
    'nothing; instantiates no interval; moves no bound; G irrationality OPEN; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-95637 (kappa provenance/certification verdict and sensitivity scan); imp-95516 (verified ' +
    'anchor datum c_odd(1/20)); imp-95618 (placement-robust ">0.037" conclusion this scopes); ' +
    'imp-95690 (later primary-source refutation of the rho^2 shape).',
});

export default IMP95669_KAPPA_PROVENANCE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95669_KAPPA_PROVENANCE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95669-headword-has-required-fields',
    why: 'The headword must name kappa, the anchor-verified-vs-shape-uncertified split, and the kappa-insensitivity verdict -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP95669_KAPPA_PROVENANCE_GLOSSARY_HEADWORD.headword;
      return (
        /2\.51069789/.test(h.definition) &&
        /DISCHARGED/.test(h.definition) &&
        /OPEN sub-gap/.test(h.definition) &&
        /kappa-insensitive/i.test(h.kappaInsensitivity) &&
        /REFUTATION/.test(h.laterSupersession)
      );
    },
  },
  {
    id: 'imp95669-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, G irrationality OPEN, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95669_KAPPA_PROVENANCE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95669_KAPPA_PROVENANCE_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95669_KAPPA_PROVENANCE_GLOSSARY_HEADWORD.verdict) &&
      /G irrationality OPEN/.test(IMP95669_KAPPA_PROVENANCE_GLOSSARY_HEADWORD.verdict) &&
      IMP95669_KAPPA_PROVENANCE_GLOSSARY_HEADWORD.glosses === 'imp-95637' &&
      IMP95669_KAPPA_PROVENANCE_GLOSSARY_HEADWORD.scopes === 'imp-95618',
  },
];

for (const assertion of IMP95669_KAPPA_PROVENANCE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-95669-kappa-provenance-glossary-headword assertion failed: ${assertion.id}`);
  }
}
