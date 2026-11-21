/**
 * @module imp-96603-vasyunin-gram-multiplicative-not-toeplitz-glossary-headword
 * @fileoverview imp-96603 -- import-light glossary/Concepts headword for the imp-96562
 *   structural obstruction: the Vasyunin Gram G_{hk} = gcd(h,k) I(h/g,k/g)/(hk) is a
 *   MULTIPLICATIVE kernel (Dirichlet-Bohr type), not an additive-Toeplitz one, and its
 *   top-eigenvalue edge diverges logarithmically without bound. So no classical
 *   Szego/Grenander edge constant exists for it, and the measured slope 0.3526 is a
 *   spectral-edge GROWTH RATE, not a Szego-type edge VALUE.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96562 assessed whether a classical Szego/Grenander limiting-spectrum theorem
 *   could rigorously pin the measured lam_max(G_N) log-slope 0.3526 (the imp-96548
 *   sub-gap). It found two independent structural obstructions and concluded NO. This
 *   headword bakes that structural verdict verbatim (no re-import of the imp-96562
 *   module, to stay import-light) as a standalone quick-lookup entry: a reader must not
 *   reach for the classical additive-Toeplitz Szego edge theorem here, because neither
 *   of its two hypotheses (translation invariance on Z; a bounded symbol) holds for
 *   this Gram.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) NOT TOEPLITZ. Classical Szego/Grenander theory governs Toeplitz matrices
 *   T_n(f) whose entries depend only on the index difference h-k, i.e. translation
 *   invariance on the additive group Z. The Vasyunin Gram G_{hk} = gcd(h,k)
 *   I(h/g,k/g)/(hk) depends on the pair (h,k) through gcd and the coprime part -- it is
 *   translation invariant on the MULTIPLICATIVE semigroup (a Dirichlet-series /
 *   Bohr-lift kernel), not on Z. The additive Szego edge theorem does not apply.
 *   (b) UNBOUNDED EDGE. Even a multiplicative analog of Szego theory requires a
 *   bounded symbol to force lam_max(T_n(f)) -> ess sup f, a CONSTANT. The measured
 *   lam_max(G_N) instead grows without bound as ~0.3526 log N (4.93 at N=250 rising to
 *   6.06 at N=6000) -- the fingerprint of an unbounded symbol / non-compact
 *   multiplicative operator (the Vasyunin kernel's Dirichlet-series singularity). No
 *   bounded-symbol edge constant exists for it, so 0.3526 cannot be an ess-sup edge
 *   value; it is a GROWTH RATE.
 *
 *   STATUS: a structural assessment (ruling out a proof route), not a numerical
 *   measurement and not a rigorous derivation of the 0.3526 coefficient itself.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96562 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96562-route-m-lammax-offdiagonal-szego-assessment.js (source: the assessment this glosses)
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (names the sub-gap imp-96562 assesses)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (the measured lam_max ladder, slope 0.3526)
 *
 * Ticket: imp-96603 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The structural Szego-obstruction headword, baked verbatim (no re-import).
const VASYUNIN_GRAM_MULTIPLICATIVE_HEADWORD = Object.freeze({
  key: 'vasyunin-gram-multiplicative-not-toeplitz-no-szego-edge',
  term:
    'imp-96562 verdict: the Vasyunin Gram is a MULTIPLICATIVE (Dirichlet-Bohr) kernel, ' +
    'not an additive-Toeplitz one, and has an UNBOUNDED log-divergent spectral edge -- ' +
    'so no classical Szego/Grenander edge constant exists, and the measured slope ' +
    '0.3526 is a growth RATE, not an edge VALUE',
  definition:
    'Classical Szego/Grenander limiting-spectrum theory governs Toeplitz matrices ' +
    'T_n(f) whose entries depend only on the index difference h-k (translation ' +
    'invariance on the additive group Z) and requires a bounded symbol f, in which ' +
    'case lam_max(T_n(f)) -> ess sup f, a fixed constant. The Vasyunin Gram ' +
    'G_{hk} = gcd(h,k) I(h/g,k/g)/(hk) fails both hypotheses: it depends on (h,k) ' +
    'through gcd and the coprime part (translation invariance on the multiplicative ' +
    'semigroup, not on Z), and its top eigenvalue grows without bound as ' +
    '~0.3526 log N rather than converging to a constant. Neither failure is cosmetic: ' +
    'together they mean the classical Szego edge theorem simply does not have an ' +
    'applicable statement here, in either its additive or a naive multiplicative form.',
  mechanism:
    'Obstruction (a) NOT TOEPLITZ: G_{hk} is a Dirichlet-series / Bohr-lift kernel ' +
    'invariant under multiplicative rescaling, not additive shift, so the additive ' +
    'Szego edge theorem does not apply. Obstruction (b) UNBOUNDED EDGE: a bounded ' +
    'Toeplitz symbol forces a CONSTANT limiting edge (Grenander-Szego), but the ' +
    'measured lam_max(G_N) rises from 4.930210017770543 at N=250 to ' +
    '6.062043896086687 at N=6000 with fitted log-slope 0.3526253785070698 ' +
    '(R^2=0.99540) -- unbounded growth, the fingerprint of a non-compact ' +
    'multiplicative operator with no bounded-symbol edge constant. Consequently ' +
    '0.3526 cannot be read as ess sup of any bounded symbol: it is the coefficient of ' +
    'a logarithmic GROWTH RATE of the spectral edge, not a Szego-type edge VALUE.',
  verificationStatus:
    'Structural assessment (rules out a proof route), not a numerical measurement and ' +
    'not a derivation of the 0.3526 coefficient. Changes no bound; establishes no ' +
    'operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96603_VASYUNIN_GRAM_MULTIPLICATIVE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96603',
  proofSection: 'S-frontier',
  glosses: 'imp-96562',
  question:
    'imp-96548 named the imp-96443 lam_max(G_N) log-slope 0.3526 sub-gap as needing a ' +
    'sharp Toeplitz/Szego-type limiting-spectrum asymptotic for the off-diagonal mass ' +
    'of the multiplicative Vasyunin kernel. Does such a classical Szego/Grenander ' +
    'theorem exist for this Gram?',
  headword: VASYUNIN_GRAM_MULTIPLICATIVE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96562 ' +
    'verdict: NO -- the Vasyunin Gram is MULTIPLICATIVE, not additive-Toeplitz, so the ' +
    'classical Szego edge theorem does not apply, and its spectral edge diverges ' +
    'logarithmically without bound, so no bounded-symbol Szego edge constant could ' +
    'match 0.3526 even in principle. 0.3526 is a growth RATE, not an edge value. ' +
    'Establishes nothing; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96562 (the structural assessment and finding this glosses); imp-96548 ' +
    '(names the sub-gap this assessment answers); imp-96443 (the measured lam_max ' +
    'ladder, slope 0.3526253785070698).',
});

export default IMP96603_VASYUNIN_GRAM_MULTIPLICATIVE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96603_VASYUNIN_GRAM_MULTIPLICATIVE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96603-headword-has-required-fields',
    why: 'The headword must name both structural obstructions (not Toeplitz; ' +
      'unbounded edge) and the growth-rate-vs-edge-value distinction -- the entire ' +
      'point of the glossary entry.',
    holds: () => {
      const h = IMP96603_VASYUNIN_GRAM_MULTIPLICATIVE_GLOSSARY_HEADWORD.headword;
      return (
        /multiplicative/i.test(h.definition) &&
        /UNBOUNDED/.test(h.mechanism) &&
        /0\.3526253785070698/.test(h.mechanism) &&
        /GROWTH RATE/.test(h.mechanism) &&
        /translation invariance on the multiplicative semigroup/.test(h.definition)
      );
    },
  },
  {
    id: 'imp96603-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96603_VASYUNIN_GRAM_MULTIPLICATIVE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96603_VASYUNIN_GRAM_MULTIPLICATIVE_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96603_VASYUNIN_GRAM_MULTIPLICATIVE_GLOSSARY_HEADWORD.verdict) &&
      IMP96603_VASYUNIN_GRAM_MULTIPLICATIVE_GLOSSARY_HEADWORD.glosses === 'imp-96562',
  },
];

for (const assertion of IMP96603_VASYUNIN_GRAM_MULTIPLICATIVE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96603-vasyunin-gram-multiplicative-not-toeplitz-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
