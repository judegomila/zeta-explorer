/**
 * @module imp-97172-debranges-coercivity-concentration-extremal-glossary-headword
 * @fileoverview imp-97172 -- import-light glossary/Concepts headword for the imp-97137 finding:
 *   de Branges coercivity for the pole-free Weil form T_a[sigma_2] >= c*I does NOT reduce to a
 *   pointwise sign check of the symbol -- it reduces to a band-limited CONCENTRATION extremal (the
 *   dip in sigma_2 vs the positive far field, uniform over the Paley-Wiener space PW_a), and the
 *   finite reproducing-kernel budget K_a(w,w) = a/pi is only a POINTWISE ceiling, not the
 *   integrated coercivity constant a reader might mistake it for.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-97137 scoped route (B) (direct analytic coercivity via the de Branges realisation of
 *   PW_a) and found the de Branges frame supplies two things "for free" -- the non-negative
 *   polynomial prefactor (t^2+1/4)^2 = |S(t)|^2 (S(z)=(z-i/2)(z+i/2), zeros off the real axis) and
 *   the sinc reproducing kernel's diagonal value K_a(w,w) = a/pi -- while the residual weight w_1
 *   is NOT sign-definite, so sigma_2 itself dips negative and the naive bound lambda_min >= inf
 *   sigma_2 is vacuously negative. A reader skimming only the kernel formula could mistake the
 *   finite pointwise budget a/pi for the coercivity constant itself; this headword bakes the
 *   distinction verbatim (no re-import of imp-97137) so that mistake does not recur.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The pole-free Weil form is a multiplication form on the model de Branges space PW_a = H(E_a),
 *   E_a(z) = e^{-i a z}, with sinc reproducing kernel K_a(w,z) = sin(a(z-conj w))/(pi(z-conj w))
 *   and diagonal value K_a(w,w) = a/pi. That value bounds only a POINTWISE quantity:
 *   |ghat(w)|^2 <= (a/pi) ||ghat||^2 for every ghat in PW_a. Coercivity T_a[sigma_2] >= c*I is a
 *   different, INTEGRATED statement: splitting sigma_2 = sigma_2^+ - sigma_2^- into its positive
 *   far field and non-negative dip, coercivity is EXACTLY the concentration inequality
 *       int sigma_2^- |ghat|^2  <=  int sigma_2^+ |ghat|^2  -  c int |ghat|^2   for all ghat in PW_a,
 *   i.e. a uniform cap on how much energy any band-limited (type-a) function can load into the dip
 *   before it is overwhelmed by the far field. The sharp such c is lambda_min(P_a M_{sigma_2} P_a)
 *   itself -- the de Branges realisation restates the problem as this concentration extremal but
 *   does not supply its value. The pointwise budget a/pi is finite and true, but a POINTWISE
 *   ceiling is not an INTEGRATED lower bound: no algebraic manipulation turns a/pi into c.
 *   COMPLETENESS. This is a scope/terminology headword, not a new estimate: the missing input
 *   remains an independent prolate-spheroidal / Beurling-Selberg-type concentration bound for the
 *   arithmetic weight w_1, unproved today (imp-97161 shows both standard tools fail to supply it).
 *
 *   STATUS: glossary headword restating an already-committed scoping result, not a new
 *   computation or a positivity theorem. Establishes no coercivity constant; moves no bound;
 *   interval-rigorous reach stays 2a <= 0.96. NO QED. No refereed bound is changed; RH open.
 *
 * @see imp-97137-krein-debranges-coercivity-scope.js (source: the de Branges scoping and the
 *   pointwise-budget-vs-integrated-constant distinction this glosses)
 * @see imp-97161-krein-concentration-lower-bound-assessment.js (follow-on: assesses whether
 *   Beurling-Selberg/prolate tools supply the missing concentration constant -- they do not)
 *
 * Ticket: imp-97172 (content, low, sonnet-4-6). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The concentration-extremal headword, baked verbatim (no re-import).
const DEBRANGES_COERCIVITY_CONCENTRATION_EXTREMAL_HEADWORD = Object.freeze({
  key: 'debranges-coercivity-reduces-to-band-limited-concentration-extremal-not-pointwise-kernel-budget',
  term:
    'imp-97137 finding: de Branges coercivity T_a[sigma_2] >= c*I for the pole-free Weil form is ' +
    'NOT a pointwise sign check -- it reduces to a band-limited CONCENTRATION extremal (dip vs ' +
    'far field, uniform over PW_a), and the finite reproducing-kernel budget K_a(w,w) = a/pi is ' +
    'only a POINTWISE ceiling, not the integrated coercivity constant',
  definition:
    'The pole-free Weil form is a multiplication form (1/2pi) int sigma_2 |ghat|^2 on the model ' +
    'de Branges space PW_a = H(E_a), E_a(z) = e^{-i a z}, with sinc reproducing kernel ' +
    'K_a(w,z) = sin(a(z-conj w))/(pi(z-conj w)) and diagonal value K_a(w,w) = a/pi. That value ' +
    'bounds only the POINTWISE quantity |ghat(w)|^2 <= (a/pi) ||ghat||^2. Coercivity is a ' +
    'different, INTEGRATED statement: splitting sigma_2 = sigma_2^+ - sigma_2^- into its positive ' +
    'far field and non-negative dip, T_a[sigma_2] >= c*I is EXACTLY the concentration inequality ' +
    'int sigma_2^- |ghat|^2 <= int sigma_2^+ |ghat|^2 - c int |ghat|^2 for all ghat in PW_a, whose ' +
    'sharp constant is c_sharp = lambda_min(P_a M_{sigma_2} P_a) itself.',
  mechanism:
    'A pointwise ceiling on |ghat(w)|^2 constrains how large a band-limited function can be AT ONE ' +
    'POINT, but coercivity is a concentration inequality on an INTEGRAL of sigma_2 against ' +
    '|ghat|^2 over the whole real line -- two different functionals of ghat, related only through ' +
    'the same reproducing-kernel structure, not by a direct inequality. The residual weight w_1 is ' +
    'not sign-definite (negative near the origin and in later cos(t ln2) bands), so sigma_2 itself ' +
    'dips negative and the trivial bound lambda_min >= inf_t sigma_2 is vacuously negative; ' +
    'positivity is therefore genuinely a band-limiting (uncertainty-principle) phenomenon that the ' +
    'pointwise budget alone cannot certify.',
  verificationStatus:
    'Restates the already-committed imp-97137 scoping result (de Branges realisation of route B) ' +
    'and the imp-97161 follow-on assessment (Beurling-Selberg/prolate tools do not supply the ' +
    'missing concentration constant); no new numerical computation. Establishes no coercivity ' +
    'constant; interval-rigorous reach unchanged at 2a <= 0.96; no refereed bound is changed; RH ' +
    'open; NO QED.',
});

export const IMP97172_DEBRANGES_COERCIVITY_CONCENTRATION_EXTREMAL_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97172',
  proofSection: 'S-frontier',
  glosses: 'imp-97137',
  question:
    'imp-97137 scoped a direct de Branges-space coercivity route for T_a[sigma_2] and found the ' +
    'sinc reproducing kernel supplies a finite pointwise budget K_a(w,w) = a/pi. Does that ' +
    'pointwise budget give (or reduce to) the coercivity constant c>0 itself, or does coercivity ' +
    'remain a separate, integrated extremal problem?',
  headword: DEBRANGES_COERCIVITY_CONCENTRATION_EXTREMAL_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-97137 finding: the ' +
    'pointwise reproducing-kernel budget a/pi bounds |ghat(w)|^2, not the coercivity constant. ' +
    'Coercivity T_a[sigma_2] >= c*I is the INTEGRATED concentration inequality ' +
    'int sigma_2^- |ghat|^2 <= int sigma_2^+ |ghat|^2 - c int |ghat|^2 over PW_a, whose sharp c is ' +
    'lambda_min(P_a M_{sigma_2} P_a) itself -- a genuinely different (and unsolved) extremal ' +
    'problem from the pointwise ceiling. Readers should not treat the finite pointwise budget as ' +
    'supplying or bounding the coercivity constant. Establishes nothing new; moves no bound; ' +
    'interval-rigorous reach stays 2a <= 0.96; NO QED. No refereed bound is changed.',
  citation:
    'imp-97137 (the de Branges coercivity scoping and pointwise-budget-vs-integrated-constant ' +
    'distinction this glosses); imp-97161 (assessment that standard concentration tools do not ' +
    'supply the missing constant).',
});

export default IMP97172_DEBRANGES_COERCIVITY_CONCENTRATION_EXTREMAL_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97172_DEBRANGES_COERCIVITY_CONCENTRATION_EXTREMAL_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97172-headword-distinguishes-pointwise-budget-from-integrated-constant',
    why: 'The headword must state both the pointwise budget a/pi and the integrated concentration ' +
      'inequality, and mark them as distinct -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP97172_DEBRANGES_COERCIVITY_CONCENTRATION_EXTREMAL_GLOSSARY_HEADWORD.headword;
      return (
        /a\/pi/.test(h.term) &&
        /POINTWISE/.test(h.definition) &&
        /INTEGRATED/.test(h.definition) &&
        /lambda_min/.test(h.definition) &&
        /concentration inequality/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97172-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97172_DEBRANGES_COERCIVITY_CONCENTRATION_EXTREMAL_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97172_DEBRANGES_COERCIVITY_CONCENTRATION_EXTREMAL_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97172_DEBRANGES_COERCIVITY_CONCENTRATION_EXTREMAL_GLOSSARY_HEADWORD.verdict) &&
      IMP97172_DEBRANGES_COERCIVITY_CONCENTRATION_EXTREMAL_GLOSSARY_HEADWORD.glosses === 'imp-97137',
  },
];

for (const assertion of IMP97172_DEBRANGES_COERCIVITY_CONCENTRATION_EXTREMAL_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97172-debranges-coercivity-concentration-extremal-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
