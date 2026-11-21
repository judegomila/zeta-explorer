/**
 * @module imp-95891-per-m-kappa-piece-a-piece-b-glossary-headword
 * @fileoverview imp-95891 -- import-light glossary/Concepts headword for the imp-95861
 *   per-m kappa certification requirement assessment: the PIECE A (independent target) /
 *   PIECE B (rigorous quadrature enclosure) decomposition, and the TRANSPORT-vs-INDEPENDENT
 *   distinction for supplying PIECE A at m>20.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95861 decomposed "what would a genuine per-m kappa(m) certification require" into
 *   two named pieces and two named routes. A reader landing on that module cold has no
 *   quick-lookup definition of what PIECE A and PIECE B each certify, why B24
 *   (imp-95842) supplies only one of them, or what distinguishes the INDEPENDENT route
 *   from the TRANSPORT route for closing the gap. This headword bakes those facts
 *   VERBATIM (no re-import of the imp-95861 module, to stay import-light) as a
 *   standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   kappa(m) = 5/2 - Q(m) where Q(m) = INT_0^1 Q_0(m,v) zeta(3,1+v) dv is the (6.21)
 *   integrand's m-dependent sector. Certifying kappa(m) rigorously at a given m means
 *   proving kappa_true(m) lies in an interval that also contains the reconstruction's
 *   kappa_recon(m) = 5/2 - Q_recon(m). Because kappa_recon(m) is built ENTIRELY from the
 *   238-cell reconstruction, this needs TWO independent pieces:
 *     PIECE A (independent TARGET): a value or enclosure for Q_true(m) obtained WITHOUT
 *       the reconstruction -- a closed form (like Sun eq 6.23 at m=20) or an independent
 *       rigorous enclosure of Prop 6.3 as written. Answers "does the reconstructed
 *       integrand equal the intended integrand".
 *     PIECE B (rigorous ENCLOSURE of the reconstruction): a certified quadrature interval
 *       for Q_recon(m) itself. Answers "is the computed number exactly the integral of
 *       the reconstructed integrand".
 *   Certification holds exactly when the PIECE A and PIECE B intervals OVERLAP. imp-95842
 *   showed a (6.26) B24 Euler-Maclaurin certificate supplies PIECE B at ANY m but NOTHING
 *   for PIECE A -- so PIECE A, not quadrature accuracy, is the binding shortfall at
 *   m=22,30,41 (only m=20 has a Sun-certified closed form).
 *
 *   TRANSPORT vs INDEPENDENT: two ways to supply PIECE A beyond m=20. The INDEPENDENT
 *   route derives a fresh per-modulus target at EACH new m (cost grows linearly with the
 *   sweep: one anchor per modulus). The TRANSPORT route instead proves ONE symbolic
 *   identity -- that the m-parametric 238-cell reconstruction algorithm reproduces Sun
 *   Prop 6.3 IDENTICALLY as a function of m, not merely numerically at m=20 -- which
 *   converts the single m=20 anchor into an unconditional anchor at every m in one proof,
 *   independent of sweep size. Both routes still need PIECE B; they differ only in how
 *   PIECE A is supplied. Transport is the leaner route and the only one that scales to an
 *   open-ended modulus sweep.
 *
 *   RESIDUAL CONDITIONALITY: what remains open at m>20 is a SINGLE hypothesis --
 *   integrand-faithfulness (the reconstructed integrand equals Sun Q_0(m,v) at that m) --
 *   attached identically to every modulus beyond 20, not three independent
 *   conditionalities and not a quadrature-accuracy caveat (quadrature is PIECE B,
 *   already ~1e-11 per imp-95822).
 *
 *   STATUS: assessed (not constructed). Neither route has been carried out; no bound
 *   moves; m=20 remains the only certified modulus (Sun 6.23 forced target Q_forced(20)
 *   matches the reconstruction Q_recon(20) to ~1.40e-10).
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95861 assessment for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-95861-per-m-kappa-certification-requirement-assessment (source: the assessment this glosses)
 * @see imp-95842-q0-wide-modulus-reconstruction (the B24 lever that supplies PIECE B only)
 * @see imp-95822-... (grid-converged Q_0 quadrature to ~1e-11, the PIECE B empirical baseline)
 *
 * Ticket: imp-95891 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The PIECE A / PIECE B / transport-vs-independent headword, baked verbatim (no re-import).
const PER_M_KAPPA_PIECES_HEADWORD = Object.freeze({
  key: 'per-m-kappa-certification-piece-a-piece-b-transport-vs-independent',
  term:
    'PIECE A / PIECE B per-m kappa certification decomposition '
    + '(independent target vs rigorous quadrature enclosure; transport vs independent routes)',
  definition:
    'A two-piece requirement for rigorously certifying kappa(m) = 5/2 - Q(m) at a given '
    + 'modulus m: PIECE A is an independent TARGET for Q_true(m) obtained WITHOUT the '
    + '238-cell reconstruction (a closed form, e.g. Sun eq 6.23 at m=20, or an independent '
    + 'rigorous enclosure of Prop 6.3); PIECE B is a rigorous ENCLOSURE (certified '
    + 'quadrature interval) of the reconstruction value Q_recon(m) itself. Certification '
    + 'holds exactly when the PIECE A and PIECE B intervals overlap.',
  mechanism:
    'PIECE A answers whether the reconstructed integrand equals the intended Sun Q_0(m,v) '
    + 'integrand (integrand-faithfulness); PIECE B answers whether the computed number is '
    + 'exactly the integral of that reconstructed integrand (quadrature fidelity). The two '
    + 'axes are independent: a perfectly accurate quadrature of the WRONG integrand still '
    + 'fails to certify kappa_true(m), and a perfectly faithful integrand computed with an '
    + 'uncertified quadrature still leaves kappa_true(m) unbounded.',
  b24SuppliesOnlyPieceB:
    'The imp-95842 (6.26) B24 Euler-Maclaurin certificate delivers PIECE B at ANY m '
    + '(per-cell analytic integrand plus a rigorous B24 remainder bound), but delivers '
    + 'NOTHING for PIECE A -- so PIECE A, already ~1e-11 accurate on the PIECE B axis per '
    + 'imp-95822, is the binding shortfall of a genuine per-m certification at m=22,30,41 '
    + '(only m=20 carries a Sun-certified closed-form PIECE A).',
  transportVsIndependent:
    'Two ways to supply PIECE A beyond m=20. INDEPENDENT route: derive a fresh '
    + 'per-modulus target at each new m -- cost grows linearly with the sweep (one anchor '
    + 'per modulus, forever). TRANSPORT route: prove ONE symbolic identity that the '
    + 'm-parametric reconstruction algorithm reproduces Sun Prop 6.3 IDENTICALLY as a '
    + 'function of m (not merely numerically at m=20) -- cost is ONE proof, independent of '
    + 'sweep size, converting the single m=20 anchor into an unconditional anchor at every '
    + 'm. Both routes still need PIECE B to close the loop; transport is the leaner route '
    + 'and the only one that scales to an open-ended modulus sweep.',
  residualConditionality:
    'What remains open at m>20 is a SINGLE hypothesis -- integrand-faithfulness, '
    + 'verified only at m=20 -- attached identically to every other modulus. It is NOT '
    + 'three independent per-modulus conditionalities and NOT a quadrature-accuracy '
    + 'caveat (quadrature is PIECE B, already resolved to ~1e-11).',
  status:
    'Assessed only, not constructed: neither the independent nor the transport route has '
    + 'been carried out. m=20 remains the sole certified modulus (Sun 6.23 forced target '
    + 'matches the reconstruction to ~1.40e-10); m=22,30,41 remain conditional on the '
    + 'single integrand-faithfulness hypothesis.',
});

export const IMP95891_PER_M_KAPPA_PIECES_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95891',
  proofSection: 'S-frontier',
  glosses: 'imp-95861',
  question:
    'imp-95861 assessed what a genuine per-m kappa(m) certification would require for '
    + 'the imp-95842 q0-wide-modulus reconstruction. What exactly do PIECE A and PIECE B '
    + 'each certify, why does the B24 lever supply only one of them, and what '
    + 'distinguishes the TRANSPORT route from the INDEPENDENT route for closing the gap, '
    + 'for a reader landing on that module cold?',
  headword: PER_M_KAPPA_PIECES_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95861 '
    + 'assessment: certifying kappa(m) needs PIECE A (an independent target, absent at '
    + 'm>20) and PIECE B (a rigorous quadrature enclosure, supplied at any m by the '
    + 'imp-95842 B24 lever); PIECE A is the binding shortfall. It can be supplied per '
    + 'modulus (INDEPENDENT route, cost grows with the sweep) or once for all m '
    + '(TRANSPORT route, one symbolic Prop-6.3 identity, the leaner and only scalable '
    + 'route). Establishes nothing; instantiates no interval; moves no bound; NO QED. '
    + 'No refereed bound is changed.',
  citation:
    'imp-95861 (the assessment this glosses); imp-95842 (the B24 lever supplying PIECE B '
    + 'only, and the named conditional anchoring at m=22,30,41); imp-95822 (grid-converged '
    + 'Q_0 quadrature to ~1e-11, the PIECE B empirical baseline); imp-95745/95746/95780 '
    + '(m-free offset and const-sector structure underlying kappa(m) = 5/2 - Q(m)).',
});

export default IMP95891_PER_M_KAPPA_PIECES_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95891_PER_M_KAPPA_PIECES_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95891-headword-has-required-fields',
    why: 'The headword must name PIECE A, PIECE B, the B24 asymmetry, and the transport-vs-independent distinction -- the entire point of the glossary entry.',
    holds: () => {
      const h = PER_M_KAPPA_PIECES_HEADWORD;
      return (
        /PIECE A/.test(h.definition) &&
        /PIECE B/.test(h.definition) &&
        /NOTHING for PIECE A/.test(h.b24SuppliesOnlyPieceB) &&
        /TRANSPORT route/.test(h.transportVsIndependent) &&
        /INDEPENDENT route/.test(h.transportVsIndependent)
      );
    },
  },
  {
    id: 'imp95891-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95891_PER_M_KAPPA_PIECES_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95891_PER_M_KAPPA_PIECES_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95891_PER_M_KAPPA_PIECES_GLOSSARY_HEADWORD.verdict) &&
      IMP95891_PER_M_KAPPA_PIECES_GLOSSARY_HEADWORD.glosses === 'imp-95861',
  },
];

for (const assertion of IMP95891_PER_M_KAPPA_PIECES_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95891-per-m-kappa-piece-a-piece-b-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
