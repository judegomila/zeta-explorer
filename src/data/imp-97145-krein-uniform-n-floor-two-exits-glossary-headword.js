/**
 * @module imp-97145-krein-uniform-n-floor-two-exits-glossary-headword
 * @fileoverview imp-97145 -- import-light glossary/Concepts headword restating the imp-97121
 *   Finding 2 / imp-96846 verdict: a uniform-in-N certificate for the Route I Krein floor
 *   lambda_min(T_a[sigma_2]) >= c > 0 has exactly TWO structurally admissible exits, and neither
 *   is instantiated. This headword bakes that two-exit enumeration verbatim (no re-import) so a
 *   reader does not mistake the still-descending finite-N Rayleigh-Ritz floors (imp-96749,
 *   imp-96911, imp-97120, imp-97121) for progress toward either exit.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   Every committed floor number at 2a=ln3 is a Rayleigh-Ritz value -- an UPPER bound on the true
 *   infinite-dimensional lambda_min -- and the family only ever descends as the trial space grows
 *   (Legendre 0.577015 @ N=52 -> 0.533852 @ N=100; shift-invert 0.607102 @ Nbig=24 -> 0.475606 @
 *   Nbig=240). A decreasing family of positive upper bounds is necessary but never sufficient for a
 *   positive infimum. imp-97121 named the missing object precisely: an N-independent LOWER bound,
 *   obtainable only through one of two routes. imp-96846 independently assessed the operator-
 *   theoretic candidates and reached the same fork, additionally ruling out a third candidate
 *   (Garding coercivity / trace-class tail control) as structurally incapable.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   EXIT (A) -- COMPLEMENTARY LOWER-BOUND EIGENVALUE METHOD (Temple / Kato-Temple / Lehmann-
 *   Goerisch). Delivers lambda_1 >= mu - ||T g - mu g||^2 / (beta - mu) from an already-measured
 *   trial vector g with Rayleigh quotient mu, PROVIDED a certified a-priori lower bound
 *   beta <= lambda_2(a) on the second eigenvalue is in hand. That single ingredient -- a
 *   spectral-gap enclosure -- is not yet available for this sign-indefinite operator: no solvable
 *   base problem T_0 <= T with known spectrum has been identified to supply it (imp-96846 Route
 *   C / Obstruction C).
 *   EXIT (B) -- DIRECT ANALYTIC COERCIVITY / DE BRANGES REALISATION. Prove the operator inequality
 *   T_a[sigma_2] >= c*I on L^2(-a,a) directly, which is N-free by construction and needs no
 *   spectral-gap input. This is the "de Branges realisation" flagged as an analytic obstruction in
 *   the source certificate; imp-96769 already ruled out the de Branges / reproducing-kernel route
 *   in its literal form (sigma_2 is sign-indefinite, hence not itself a de Branges weight), leaving
 *   the operator-inequality form of Exit B open but with no constructed constant c.
 *   NEITHER EXIT INSTANTIATED. Both require arithmetic/analytic input the finite-dimensional
 *   numerics cannot supply on their own; either way, closing the gap also needs a single N- and
 *   T-independent bound on the compression defect ||T_a[sigma_2] - P_N T_a[sigma_2] P_N|| and the
 *   sigma_2 t-integral tail (imp-97121 Finding 3).
 *   RULED OUT (not a third exit). Garding coercivity for the order-4 positive principal symbol
 *   reaches only lambda_1 >= -C (C = the fixed mid-band dip depth), never a positive floor; a
 *   trace-class tail-control argument fails at the outset because T_a[sigma_2] is unbounded, so its
 *   Galerkin tail is not trace-class (imp-96846 Routes A, B).
 *
 *   STATUS: a glossary restatement of already-committed scoping/assessment findings, not a new
 *   computation or an operator-positivity theorem. Certified interval-rigorous reach stays
 *   2a <= 0.96. NO QED. No refereed bound is changed; RH open.
 *
 * @see imp-97121-krein-uniform-n-floor-certificate-scope.js (source: Finding 2 names the two exits
 *   and Finding 1/3 the descending-upper-bound / dual-tail context this glosses)
 * @see imp-96846-krein-uniform-N-lower-bound-routes-assessment.js (independent three-route
 *   assessment; corroborates the same fork and rules out Garding / trace-class tail)
 * @see imp-96769-krein-de-branges-uniform-gap-assessment.js (rules out the literal de Branges /
 *   reproducing-kernel route; sigma_2 sign-indefinite)
 *
 * Ticket: imp-97145 (content, low, sonnet-4-6). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The two-exit headword, baked verbatim (no re-import).
const KREIN_UNIFORM_N_FLOOR_TWO_EXITS_HEADWORD = Object.freeze({
  key: 'krein-uniform-n-floor-two-exits-temple-or-de-branges-coercivity',
  term:
    'imp-97121/imp-96846 finding: a uniform-in-N certificate lambda_min(T_a[sigma_2]) >= c > 0 for ' +
    'the Route I Krein floor has exactly TWO structurally admissible exits -- a complementary ' +
    'Temple/Kato-Temple lower-bound method, or a direct de Branges coercivity T_a[sigma_2] >= c*I ' +
    '-- and neither is instantiated',
  definition:
    'EXIT A (Temple/Kato-Temple/Lehmann-Goerisch): lambda_1 >= mu - ||Tg - mu g||^2/(beta - mu) ' +
    'from an already-measured trial vector, PROVIDED a certified a-priori lower bound ' +
    'beta <= lambda_2(a) is supplied; no solvable base problem has yet been identified to supply ' +
    'that spectral-gap enclosure. EXIT B (de Branges coercivity): prove the operator inequality ' +
    'T_a[sigma_2] >= c*I directly on L^2(-a,a), N-free by construction; the literal de Branges / ' +
    'reproducing-kernel route is already ruled out (sigma_2 sign-indefinite), leaving only the ' +
    'operator-inequality form open, with no constructed c. A third candidate -- Garding coercivity ' +
    'or trace-class tail control -- is RULED OUT: Garding reaches only lambda_1 >= -C (dip depth), ' +
    'and the tail of the unbounded T_a[sigma_2] is not trace-class.',
  mechanism:
    'Every committed floor is a Rayleigh-Ritz value, hence an upper bound on the true lambda_min, ' +
    'and the family only ever descends as the trial space grows (Legendre 0.577015 @ N=52 -> ' +
    '0.533852 @ N=100; shift-invert 0.607102 @ Nbig=24 -> 0.475606 @ Nbig=240 at 2a=ln3). A ' +
    'decreasing family of positive upper bounds is necessary but never sufficient for a positive ' +
    'infimum, so no amount of further Ritz computation can by itself certify a uniform floor: only ' +
    'a genuine lower-bound object (Exit A or Exit B) can.',
  verificationStatus:
    'Glossary restatement assembled from two already-committed, independently-derived scoping/' +
    'assessment modules (imp-97121 Finding 2; imp-96846 Routes A-C) that agree on the same fork; ' +
    'no new numerical computation. Certified reach unchanged at 2a <= 0.96; establishes no ' +
    'operator-positivity theorem; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97145_KREIN_UNIFORM_N_FLOOR_TWO_EXITS_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97145',
  proofSection: 'S-frontier',
  glosses: 'imp-97121',
  question:
    'imp-97121 Finding 2 and imp-96846 both name candidate routes to a uniform-in-N Krein floor ' +
    'certificate. Are there exactly two structurally admissible exits, and is either instantiated?',
  headword: KREIN_UNIFORM_N_FLOOR_TWO_EXITS_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-97121/imp-96846 fork: ' +
    'the only two structurally admissible exits to a uniform-in-N Krein floor are (A) a Temple/' +
    'Kato-Temple lower-bound method, which needs a certified a-priori spectral-gap enclosure ' +
    'beta <= lambda_2(a) not yet in hand, or (B) a direct de Branges coercivity ' +
    'T_a[sigma_2] >= c*I, whose literal reproducing-kernel form is already ruled out and whose ' +
    'operator-inequality form has no constructed constant. A third candidate (Garding / trace-' +
    'class tail) is structurally ruled out. Neither exit is instantiated; certified reach stays ' +
    '2a <= 0.96; establishes nothing new; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97121 (Finding 2 names the two exits and the descending-upper-bound context); imp-96846 ' +
    '(independent three-route assessment corroborating the same fork and ruling out Garding / ' +
    'trace-class tail); imp-96769 (rules out the literal de Branges / reproducing-kernel route).',
});

export default IMP97145_KREIN_UNIFORM_N_FLOOR_TWO_EXITS_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97145_KREIN_UNIFORM_N_FLOOR_TWO_EXITS_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97145-headword-names-both-exits',
    why: 'The headword must name both exits (Temple/Kato-Temple; de Branges coercivity) and the ' +
      'ruled-out third candidate -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP97145_KREIN_UNIFORM_N_FLOOR_TWO_EXITS_GLOSSARY_HEADWORD.headword;
      return (
        /EXIT A/.test(h.definition) &&
        /EXIT B/.test(h.definition) &&
        /Temple/.test(h.definition) &&
        /de Branges coercivity/.test(h.definition) &&
        /RULED OUT/.test(h.definition) &&
        /TWO/i.test(h.term)
      );
    },
  },
  {
    id: 'imp97145-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97145_KREIN_UNIFORM_N_FLOOR_TWO_EXITS_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97145_KREIN_UNIFORM_N_FLOOR_TWO_EXITS_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97145_KREIN_UNIFORM_N_FLOOR_TWO_EXITS_GLOSSARY_HEADWORD.verdict) &&
      IMP97145_KREIN_UNIFORM_N_FLOOR_TWO_EXITS_GLOSSARY_HEADWORD.glosses === 'imp-97121',
  },
];

for (const assertion of IMP97145_KREIN_UNIFORM_N_FLOOR_TWO_EXITS_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97145-krein-uniform-n-floor-two-exits-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
