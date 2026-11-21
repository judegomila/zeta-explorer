/**
 * @module imp-96722-bohr-lift-szego-edge-ceiling-glossary-headword
 * @fileoverview imp-96722 -- import-light glossary/Concepts headword for the
 *   imp-96691 verdict: the Bohr-lift / multiplicative-Szego route (Hardy space of
 *   Dirichlet series, Helson-Toeplitz form theory) rigorously reproduces the
 *   log-SHAPE of the Route M lam_max(G_N) growth and a rigorous coefficient
 *   CEILING c <= log(2 pi) - gamma = 1.2606614015078126, but does NOT derive the
 *   exact measured 0.3526253785070698 coefficient: the lifted symbol carries the
 *   zeta(s) pole (unbounded, so Helson's bounded-symbol edge theorem has no
 *   applicable statement) and the Bohr lift is an isometry of Hardy spaces, not a
 *   spectral-edge theorem.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96691 asked the natural follow-up to imp-96603 (which ruled out the
 *   ADDITIVE Szego edge theorem for the Vasyunin Gram): does the MULTIPLICATIVE
 *   analog -- the Bohr lift to the infinite polytorus -- supply a rigorous edge
 *   statement pinning the measured 0.3526 log-growth coefficient? It found a
 *   genuine partial closure (a rigorous ceiling) plus a precise, named
 *   obstruction to the exact value. This headword bakes that verdict verbatim
 *   (no re-import of the imp-96691 module, to stay import-light) as a standalone
 *   quick-lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) RIGOROUS CEILING. The multiplicative diagonal G_kk = I(1,1)/k gives
 *   lam_max(G_N) <= trace(G_N) = I(1,1) H_N, so the log-growth coefficient c
 *   satisfies c <= I(1,1) = log(2 pi) - gamma = 1.2606614015078126, with the
 *   log-SHAPE forced by the zeta(s) pole at s = 1 that the Bohr lift carries.
 *   (b) UNBOUNDED SYMBOL. The Bohr-lifted Vasyunin symbol inherits that same
 *   zeta pole, so it is NOT bounded and Helson's bounded-symbol
 *   multiplicative-Szego edge theorem has no applicable statement -- the
 *   imp-96603 obstruction survives the passage to the multiplicative torus.
 *   (c) ISOMETRY, NOT AN EDGE THEOREM. The Bohr lift is an isometry of Hardy
 *   spaces; it transports the quadratic form faithfully but yields no
 *   top-eigenvalue asymptotic by itself.
 *   (d) STRICT GAP BELOW TRACE. The measured coefficient 0.3526253785070698 is
 *   only ~0.2797 of the trace slope 1.2606614015078126 -- the top eigenvalue
 *   captures ~28% of the trace growth -- so closing the ceiling down to the
 *   exact value needs a spectral-concentration estimate the Bohr lift does not
 *   supply.
 *
 *   STATUS: an honest PARTIAL (one genuine rigorous ceiling plus a precisely
 *   named sub-gap), not a derivation of the exact 0.3526 coefficient.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96691 verdict for quick reference.
 *   It establishes nothing, instantiates no interval, closes no sub-gap, moves
 *   no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-96691-route-m-bohr-lift-multiplicative-szego-assessment.js (source: the assessment this glosses)
 * @see imp-96603-vasyunin-gram-multiplicative-not-toeplitz-glossary-headword.js (the additive obstruction this extends)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (measured lam_max ladder; I(1,1) = 1.2606614015078126)
 *
 * Ticket: imp-96722 (content, medium, sonnet-4-6). Documentation only;
 * establishes nothing; NO QED; no refereed bound is changed.
 */

// The Bohr-lift ceiling-plus-obstruction headword, baked verbatim (no re-import).
const BOHR_LIFT_SZEGO_EDGE_CEILING_HEADWORD = Object.freeze({
  key: 'bohr-lift-multiplicative-szego-edge-ceiling-not-exact-coefficient',
  term:
    'imp-96691 verdict: the Bohr-lift / multiplicative-Szego route rigorously ' +
    'yields a coefficient CEILING c <= log(2 pi) - gamma = 1.2606614015078126 for ' +
    'the Route M lam_max(G_N) log-growth, but the zeta-pole unbounded lifted ' +
    'symbol blocks deriving the exact measured 0.3526253785070698 edge constant',
  definition:
    'Bohr`s substitution z_j = p_j^{-s} is an isometry between the Hardy space ' +
    'H^2 of Dirichlet series and the Hardy space H^2(T^infty) of the infinite ' +
    'polytorus, lifting the multiplicative Vasyunin Gram to a Toeplitz/Helson ' +
    'form. The multiplicative diagonal structure G_kk = I(1,1)/k alone rigorously ' +
    'gives lam_max(G_N) <= trace(G_N) = I(1,1) H_N, so the log-growth coefficient ' +
    'c of lam_max(G_N) satisfies c <= I(1,1) = log(2 pi) - gamma = ' +
    '1.2606614015078126, with the log-SHAPE forced by the zeta(s) pole at s = 1 ' +
    'the Bohr lift carries. That rigorous ceiling and shape is genuinely a ' +
    'multiplicative-structure result -- but it is not the exact measured ' +
    'coefficient 0.3526253785070698.',
  mechanism:
    'Two independent reasons block closing the ceiling down to the exact value. ' +
    '(1) UNBOUNDED SYMBOL: the Bohr-lifted Vasyunin symbol inherits the zeta(s) ' +
    'pole at s = 1 (the divergence of Sum 1/k), so it is not bounded and ' +
    'Helson`s bounded-symbol multiplicative-Szego edge theorem -- which would ' +
    'force lam_max toward a constant ess-sup edge -- has no applicable ' +
    'statement here; this is the imp-96603 additive obstruction surviving the ' +
    'passage to the multiplicative torus. (2) ISOMETRY, NOT AN EDGE THEOREM: the ' +
    'Bohr lift transports the quadratic form faithfully but supplies no ' +
    'top-eigenvalue asymptotic by itself. Concretely, the measured coefficient ' +
    '0.3526253785070698 is only about 0.2797 of the trace slope ' +
    '1.2606614015078126 (the top eigenvalue captures roughly 28% of the trace ' +
    'growth), so pinning it needs a spectral-concentration estimate strictly ' +
    'beyond the soft trace bound -- named sub-gap ' +
    'imp-96691-multiplicative-szego-edge-constant-unavailable.',
  verificationStatus:
    'Honest PARTIAL: one genuine rigorous ceiling (c <= log(2 pi) - gamma) plus ' +
    'a precisely named sub-gap for the exact value. Moves no bound beyond the ' +
    'soft trace ceiling; establishes no operator positivity; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP96722_BOHR_LIFT_SZEGO_EDGE_CEILING_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96722',
  proofSection: 'S-frontier',
  glosses: 'imp-96691',
  question:
    'imp-96603 ruled out the additive Szego edge theorem for the multiplicative ' +
    'Vasyunin Gram. imp-96691 asked whether the Bohr-lift / multiplicative-Szego ' +
    'analog -- the Hardy space of Dirichlet series and its Helson-Toeplitz form ' +
    'theory -- rigorously derives the measured 0.3526 log-growth coefficient of ' +
    'lam_max(G_N). What did it find?',
  headword: BOHR_LIFT_SZEGO_EDGE_CEILING_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the ' +
    'imp-96691 verdict: the Bohr lift rigorously reproduces the log-SHAPE and a ' +
    'rigorous coefficient CEILING c <= log(2 pi) - gamma = 1.2606614015078126, ' +
    'but does NOT derive the exact 0.3526253785070698 -- the lifted symbol ' +
    'carries the zeta pole (unbounded, no Helson edge constant) and the ' +
    'isometry is not a spectral-edge theorem. Establishes nothing; instantiates ' +
    'no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96691 (the assessment and finding this glosses); imp-96603 (additive ' +
    'obstruction extended to the multiplicative torus); imp-96443 (measured ' +
    'lam_max ladder, I(1,1) = 1.2606614015078126).',
});

export default IMP96722_BOHR_LIFT_SZEGO_EDGE_CEILING_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96722_BOHR_LIFT_SZEGO_EDGE_CEILING_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96722-headword-has-required-fields',
    why: 'The headword must name the rigorous ceiling, the unbounded-symbol ' +
      'obstruction, and the exact measured coefficient -- the entire point of ' +
      'the glossary entry.',
    holds: () => {
      const h = IMP96722_BOHR_LIFT_SZEGO_EDGE_CEILING_GLOSSARY_HEADWORD.headword;
      return (
        /1\.2606614015078126/.test(h.definition) &&
        /UNBOUNDED SYMBOL/.test(h.mechanism) &&
        /0\.3526253785070698/.test(h.mechanism) &&
        /multiplicative-szego-edge-constant-unavailable/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96722-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96722_BOHR_LIFT_SZEGO_EDGE_CEILING_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96722_BOHR_LIFT_SZEGO_EDGE_CEILING_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96722_BOHR_LIFT_SZEGO_EDGE_CEILING_GLOSSARY_HEADWORD.verdict) &&
      IMP96722_BOHR_LIFT_SZEGO_EDGE_CEILING_GLOSSARY_HEADWORD.glosses === 'imp-96691',
  },
];

for (const assertion of IMP96722_BOHR_LIFT_SZEGO_EDGE_CEILING_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96722-bohr-lift-szego-edge-ceiling-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
