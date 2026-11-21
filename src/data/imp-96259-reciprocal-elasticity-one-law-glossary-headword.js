/**
 * @module imp-96259-reciprocal-elasticity-one-law-glossary-headword
 * @fileoverview imp-96259 -- import-light glossary/Concepts headword for the imp-96229
 *   VERDICT: the imp-2322 FORWARD elasticity of the fixed-strip truncation bound
 *   d log E_trunc / d log T_PT = -kappa = -0.4 and the imp-96207 INVERSE exponent
 *   d log H / d log E = -1/kappa_star = -2.5 are exact reciprocals of ONE power law
 *   E_trunc(H) = (2 e_I / kappa) H^{-kappa}, not two independent sensitivities.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-2322 and imp-96207 each measured a sensitivity of the fixed-strip
 *   truncation law from a different direction (bound-with-respect-to-height vs
 *   height-with-respect-to-floor). A reader who meets the two numbers -0.4 and
 *   -2.5 separately could mistake them for two unrelated constants, when they
 *   are the derivative of a function and the derivative of its inverse for the
 *   SAME law. imp-96229 already cross-checked this and found no drift in the
 *   exponent, anchor, or prefactor. This headword bakes that VERDICT verbatim
 *   (no re-import of the imp-96229 module, to stay import-light) as a
 *   standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   E_trunc(H) = (2 e_I / kappa) H^{-kappa}, e_I = 1 - kappa. At the honest
 *   abscissa sigma = 3/4: e_I = 0.6, kappa = 0.4, prefactor = 3.0. Forward:
 *   d log E_trunc / d log T_PT = -kappa = -0.4 (imp-2322; a height decade
 *   tightens the bound 10^0.4 ~ 2.512x). Inverse: d log H / d log E =
 *   -1/kappa_star = -2.5 (imp-96207; a floor decade costs 10^2.5 ~ 316.23x in
 *   certified height). Product of the EXPONENTS is exactly 1: (-0.4)*(-2.5)=1,
 *   -2.5 = 1/(-0.4). The per-decade FACTORS 10^0.4 and 10^2.5 are deliberately
 *   NOT reciprocals of each other (their product is 10^2.9). Both modules also
 *   agree on kappa=0.4, prefactor=3.0, and E_trunc(3e12)=3.063887e-5 (rounds to
 *   the pinned 3.06e-5) -- no drift, one law.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96229 VERDICT for quick reference,
 *   so the -0.4 and -2.5 readings are never cited as if they were two
 *   independent constants. It establishes nothing new and fits no new curve.
 *   Changes no bound of the Lambda program; NO QED. No refereed bound is changed
 *   ; RH remains OPEN.
 *
 * @see imp-96229-reciprocal-elasticity-consistency-audit (source: the measured VERDICT this glosses)
 * @see imp-2322-etrunc-pt-T_PT-sensitivity (forward elasticity -0.4, load-bearing 3e12)
 * @see imp-96207-verified-height-floor-law-kappa-star (inverse exponent -1/kappa_star=-2.5)
 * @see imp-96190-fixed-strip-n-decaying-tail-obstruction (the two-ways-are-one-way collapse)
 *
 * Ticket: imp-96259 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The reciprocal-elasticity-is-one-law headword, baked verbatim (no re-import).
const RECIPROCAL_ELASTICITY_ONE_LAW_HEADWORD = Object.freeze({
  key: 'reciprocal-elasticity-one-law',
  term:
    'imp-96229 VERDICT: the imp-2322 forward elasticity -0.4 and the imp-96207 inverse ' +
    'exponent -2.5 of the fixed-strip truncation law are exact reciprocals of ONE power law',
  definition:
    'E_trunc(H) = (2 e_I / kappa) H^{-kappa}, e_I = 1 - kappa. At sigma = 3/4: e_I = 0.6, ' +
    'kappa = 0.4, prefactor = 3.0, E_trunc(3e12) = 3.063887e-5 (rounds to the pinned ' +
    '3.06e-5). Forward reading (imp-2322): d log E_trunc / d log T_PT = -kappa = -0.4. ' +
    'Inverse reading (imp-96207): d log H / d log E = -1/kappa_star = -2.5. For a function ' +
    'and its inverse these EXPONENTS must be exact reciprocals: (-0.4)*(-2.5) = 1, ' +
    '-2.5 = 1/(-0.4).',
  oneLawMechanism:
    'The two numbers are not independent constants: -0.4 is d log E / d log H and -2.5 is ' +
    'the derivative of the INVERSE function H(E) with respect to log E, so their product is ' +
    'forced to be 1 by the inverse-function rule, for any H^{-kappa} power law. imp-96229 ' +
    'verified the two source modules agree on kappa=0.4, prefactor=3.0, and ' +
    'E_trunc(3e12)=3.063887e-5 to the shared 1e-6 assertion tolerance -- no drift in exponent, ' +
    'anchor, or prefactor between the forward and inverse readings.',
  consequence:
    'Citing -0.4 and -2.5 as two separate sensitivities (rather than one law read two ways) ' +
    'risks double-counting or treating them as independently adjustable. The honest ' +
    'statement is: one H^{-kappa} truncation law, kappa=0.4, read forward (bound tightens ' +
    '10^0.4~2.512x per height decade) or inverted (required height grows 10^2.5~316.23x per ' +
    'floor decade); the per-decade FACTORS 2.512 and 316.23 are NOT reciprocals of each ' +
    'other (reciprocity lives on the exponents kappa and 1/kappa, not the base-10 factors).',
});

export const IMP96259_RECIPROCAL_ELASTICITY_ONE_LAW_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96259',
  proofSection: 'S-frontier',
  glosses: 'imp-96229',
  scopes: 'imp-2322,imp-96207',
  question:
    'imp-96229 cross-checked the imp-2322 forward elasticity -0.4 and the imp-96207 inverse ' +
    'exponent -2.5 of the fixed-strip truncation law and found them to be exact reciprocals ' +
    'of ONE power law with no drift. What does this mean for a reader landing on either ' +
    'number cold?',
  headword: RECIPROCAL_ELASTICITY_ONE_LAW_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96229 VERDICT: ' +
    'the imp-2322 forward elasticity -0.4 and the imp-96207 inverse exponent -2.5 are exact ' +
    'reciprocals of one E_trunc(H) = (2 e_I/kappa) H^{-kappa} truncation law -- their product ' +
    'is exactly 1 and -2.5 = 1/(-0.4). Same kappa=0.4, same prefactor=3.0, same ' +
    'E_trunc(3e12)=3.063887e-5 (pinned 3.06e-5) on both source modules; no drift. The ' +
    'per-decade FACTORS 2.512 and 316.23 are not reciprocals of each other (reciprocity is ' +
    'on the exponents). Establishes nothing; fits no new curve; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96229 (reciprocal-elasticity consistency audit, source VERDICT); imp-2322 (forward ' +
    'E_trunc(T_PT) power law, elasticity -0.4); imp-96207 (inverse height-to-floor law, ' +
    'exponent -1/kappa_star=-2.5); imp-96190 (two-ways-are-one-way collapse); imp-96166 ' +
    '(frozen E_trunc floor); imp-486 (C_mb GUE-conditional).',
});

export default IMP96259_RECIPROCAL_ELASTICITY_ONE_LAW_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96259_RECIPROCAL_ELASTICITY_ONE_LAW_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96259-headword-has-required-fields',
    why: 'The headword must name both exponents, the reciprocal product, and the factor-vs-exponent distinction -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96259_RECIPROCAL_ELASTICITY_ONE_LAW_GLOSSARY_HEADWORD.headword;
      return (
        /-0\.4/.test(h.definition) &&
        /-2\.5/.test(h.definition) &&
        /3\.063887e-5/.test(h.definition) &&
        /product/.test(h.oneLawMechanism) &&
        /NOT reciprocals/.test(h.consequence)
      );
    },
  },
  {
    id: 'imp96259-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, correct glosses/scopes pointers.',
    holds: () =>
      IMP96259_RECIPROCAL_ELASTICITY_ONE_LAW_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96259_RECIPROCAL_ELASTICITY_ONE_LAW_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96259_RECIPROCAL_ELASTICITY_ONE_LAW_GLOSSARY_HEADWORD.verdict) &&
      IMP96259_RECIPROCAL_ELASTICITY_ONE_LAW_GLOSSARY_HEADWORD.glosses === 'imp-96229' &&
      IMP96259_RECIPROCAL_ELASTICITY_ONE_LAW_GLOSSARY_HEADWORD.scopes === 'imp-2322,imp-96207',
  },
];

for (const assertion of IMP96259_RECIPROCAL_ELASTICITY_ONE_LAW_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-96259-reciprocal-elasticity-one-law-glossary-headword assertion failed: ${assertion.id}`);
  }
}
