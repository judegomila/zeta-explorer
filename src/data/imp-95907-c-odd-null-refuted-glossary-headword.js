/**
 * @module imp-95907-c-odd-null-refuted-glossary-headword
 * @fileoverview imp-95907 -- import-light glossary/Concepts headword for the imp-95878
 *   finding: the ONLY closed-form c_odd(1/m) that generalizes Sun (6.23) without a fresh
 *   Prop-6.3 v-integral -- the pure-rho^2-shape null c_odd_null(1/m) = kappa/m^2 -- is
 *   REFUTED as a reconstruction-independent PIECE-A target at m=22,30,41 by a nonzero,
 *   monotonically GROWING J-variation dI(m), and dI itself is not a clean linear-in-rho
 *   law (dI/drho scatter ~11% across those moduli). This bakes the finding verbatim as a
 *   standalone lookup entry (no re-import of imp-95878, to stay import-light) so a reader
 *   of the imp-95861 per-m kappa certification thread does not re-attempt the pure-rho^2
 *   shortcut and mistake it for a discharge of PIECE A.
 *
 *   THE FINDING
 *   -----------------------------------------------
 *   Sun (6.19)-(6.21) structurally force the rho^2 prefactor (t=rho/u substitution,
 *   verified imp-95690), so c_odd(rho) = rho^2 * J(rho) with rho=1/m. The single
 *   certified anchor is m=20 (Sun 6.23): c_odd(1/20) = 0.006276744728100982, giving
 *   kappa = J(1/20) = 400 * c_odd(1/20) = 2.5106978912403926. With NO fresh v-integral,
 *   the only closed form generalizing this to other m is the pure-rho^2-shape null that
 *   treats J as the constant kappa: c_odd_null(1/m) = kappa/m^2 (the imp-95653/95702
 *   shape hypothesis). imp-95878 tests it against the reconstruction-implied
 *   c_odd_recon(1/m) = kappa_recon(m)/m^2 (kappa_recon(m) = 5/2 - Q0_recon(m), imp-95745)
 *   at m=22,30,41 and measures the fractional departure -- exactly the imp-95653/95690/
 *   95702 J-variation dI(m) = kappa_recon(m)/kappa - 1:
 *     m=20 (anchor): dI = -5.59e-11 (value-match by construction)
 *     m=22: dI = -3.02e-6
 *     m=30: dI = -9.86e-6
 *     m=41: dI = -1.67e-5
 *   dI is nonzero and GROWS monotonically with m; a pure-rho^2-shape closed form forces
 *   dI=0 identically, so the null FAILS as an independent PIECE-A target at m>20. Testing
 *   dI against a linear-in-drho law (drho = 1/20 - rho) gives dI/drho = -6.64e-4, -5.92e-4,
 *   -6.50e-4 at m=22,30,41 -- roughly constant but with ~11% scatter, not a clean
 *   closed-form correction either.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup flagging that the pure-rho^2 null is a genuine closed form
 *   but a REFUTED shortcut for PIECE A of the imp-95861 per-m kappa certification: PIECE A
 *   (a reconstruction-independent c_odd(1/m) at m>20) stays the binding shortfall, and an
 *   actual independent value would have to carry the measured J-variation dI(m), available
 *   only via the reconstruction or a fresh 238-cell + B24 certificate at each m. Establishes
 *   nothing new, fits no curve, moves no bound. Catalan G irrationality OPEN; Sun
 *   arXiv:2609.04176 single-author, unrefereed; NO Lambda movement; no refereed bound is changed
 *   ; NO QED.
 *
 * @see imp-95878-c-odd-null-vs-reconstruction-wide-modulus.js (source: derives + tests the null, measures dI(m))
 * @see imp-95861-per-m-kappa-certification-requirement-assessment.js (names PIECE A as the binding shortfall this headword glosses)
 * @see imp-95653 / imp-95690 / imp-95702 (pure-rho^2 shape hypothesis + the J-variation dI as the decisive unmeasured quantity)
 * @see imp-95745 (kappa(m) = 5/2 - Q_0(m) identity used to form kappa_recon(m))
 *
 * Ticket: imp-95907 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The c_odd null-refuted headword, baked verbatim (no re-import).
const C_ODD_NULL_REFUTED_HEADWORD = Object.freeze({
  key: 'c-odd-pure-rho2-null-refuted-at-m-gt-20',
  term:
    'c_odd(1/m) reconstruction-independent shortfall: the pure-rho^2 null kappa/m^2 is ' +
    'REFUTED at m>20 by the growing J-variation dI(m) (imp-95878)',
  definition:
    'Sun (6.19)-(6.21) force c_odd(rho) = rho^2 * J(rho) with rho=1/m (imp-95690). The only ' +
    'closed form extending the single certified m=20 anchor (kappa = 400*c_odd(1/20) = ' +
    '2.5106978912403926, Sun 6.23) to other m WITHOUT a fresh Prop-6.3 v-integral is the ' +
    'pure-rho^2-shape null c_odd_null(1/m) = kappa/m^2, which treats J as the constant kappa.',
  refutation:
    'Compared against the reconstruction-implied c_odd_recon(1/m) = kappa_recon(m)/m^2 at ' +
    'm=22,30,41, the departure equals the fractional J-variation dI(m) = kappa_recon(m)/kappa - 1: ' +
    '-3.02e-6, -9.86e-6, -1.67e-5 -- nonzero and monotonically GROWING with m (vs -5.59e-11 at the ' +
    'm=20 anchor). A pure-rho^2 shape forces dI=0 identically, so it fails as an independent target. ' +
    'dI is also not a clean linear-in-drho law (dI/drho spread ~11% across m=22,30,41), so no simple ' +
    'correction term rescues the shortcut either.',
  consequence:
    'PIECE A of the imp-95861 per-m kappa certification (a reconstruction-independent c_odd(1/m) at ' +
    'm>20) stays the binding shortfall. A genuine independent value would have to carry the measured ' +
    'J-variation dI(m), obtainable only through the reconstruction or a fresh 238-cell + B24 ' +
    'certificate at each m -- the pure-rho^2 shortcut does not discharge PIECE A.',
});

export const IMP95907_C_ODD_NULL_REFUTED_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95907',
  proofSection: 'S-frontier',
  glosses: 'imp-95878',
  scopes: 'imp-95861',
  question:
    'Does the pure-rho^2-shape null c_odd_null(1/m) = kappa/m^2 -- the only closed form ' +
    'generalizing the Sun (6.23) m=20 anchor without a fresh v-integral -- serve as a ' +
    'reconstruction-independent PIECE-A target for the imp-95861 per-m kappa certification at m>20?',
  headword: C_ODD_NULL_REFUTED_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). REFUTED: the pure-rho^2 null forces ' +
    'dI=0, but imp-95878 measures dI(m) nonzero and growing (-3.02e-6, -9.86e-6, -1.67e-5 at ' +
    'm=22,30,41), and dI is not a clean linear-in-rho law (~11% scatter). PIECE A (imp-95861) stays ' +
    'the binding shortfall; no reconstruction-independent c_odd(1/m) exists at m>20 without the ' +
    'reconstruction or a fresh per-m certificate. Establishes nothing; fits no new curve; moves no ' +
    'bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-95878 (derives the pure-rho^2 null, measures dI(m) at m=22,30,41, refutes it as PIECE A); ' +
    'imp-95861 (names PIECE A as the binding per-m kappa certification shortfall); imp-95653/imp-95690/' +
    'imp-95702 (pure-rho^2 shape hypothesis and the J-variation dI as the decisive unmeasured quantity); ' +
    'imp-95745 (kappa(m) = 5/2 - Q_0(m) identity).',
});

export default IMP95907_C_ODD_NULL_REFUTED_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95907_C_ODD_NULL_REFUTED_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95907-headword-has-required-fields',
    why: 'The headword must name the null closed form, the measured growing dI(m) values, and the non-clean linearity scatter -- the entire point of the refutation.',
    holds: () => {
      const h = IMP95907_C_ODD_NULL_REFUTED_GLOSSARY_HEADWORD.headword;
      return (
        /kappa\/m\^2/.test(h.definition) &&
        /-3\.02e-6/.test(h.refutation) &&
        /-1\.67e-5/.test(h.refutation) &&
        /11%/.test(h.refutation) &&
        /PIECE A/.test(h.consequence)
      );
    },
  },
  {
    id: 'imp95907-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, correct glosses/scopes pointers.',
    holds: () =>
      IMP95907_C_ODD_NULL_REFUTED_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95907_C_ODD_NULL_REFUTED_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95907_C_ODD_NULL_REFUTED_GLOSSARY_HEADWORD.verdict) &&
      IMP95907_C_ODD_NULL_REFUTED_GLOSSARY_HEADWORD.glosses === 'imp-95878' &&
      IMP95907_C_ODD_NULL_REFUTED_GLOSSARY_HEADWORD.scopes === 'imp-95861',
  },
];

for (const assertion of IMP95907_C_ODD_NULL_REFUTED_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95907-c-odd-null-refuted-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
