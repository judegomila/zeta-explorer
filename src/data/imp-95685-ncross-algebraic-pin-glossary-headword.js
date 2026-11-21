/**
 * @module imp-95685-ncross-algebraic-pin-glossary-headword
 * @fileoverview imp-95685 -- import-light glossary/Concepts headword for the imp-95662 measurement:
 *   the imp-3444 E_coll = E_trunc crossover N_cross ~ 3.280294352e9 has a closed algebraic form
 *   N_cross = ln(T0) * (C_C / E_trunc)^2, and reproduces the imp-3444 Newton-height landmark from
 *   a second, independent height solver -- a solver-independence cross-check, not a re-derivation.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95662 cross-checked the imp-3444 Newton-height bisection of the E_coll = E_trunc crossover
 *   against a second, independent solver (the imp-95638 closed-form height inversion) and pinned the
 *   crossover a third way by explicit algebra. A reader landing on imp-95662 cold has no quick-lookup
 *   definition of what the algebraic pin says or why matching the Newton-height landmark matters.
 *   This headword bakes those facts VERBATIM (no re-import of the imp-95662 module, to stay
 *   import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   E_coll = C_C sqrt(L/N) and E_trunc = 3.06e-5 is an N-independent fixed-strip constant (imp-2631).
 *   Setting E_coll = E_trunc and solving for N gives the closed algebraic form
 *   N_cross = ln(T0) * (C_C / E_trunc)^2, a fixed point in N because T0 = effectiveHeightForN(N)
 *   depends weakly (logarithmically) on N itself -- a few contraction passes on the slowly-varying
 *   ln(T0) term suffice to solve it, with no root-finder needed. This algebraic pin agrees with the
 *   bisected crossover to better than 1e-7 relative (~4e-11 measured), and BOTH independent solvers
 *   (imp-3444 Newton-height bisection and the imp-95638 closed-form-height bisection) reproduce the
 *   imp-3444 pinned literals N_cross = 3.280294352e9 and N_half = 3.267235198e9 to ~1e-10 relative.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95662 algebraic-pin formula and the solver-independence
 *   headline for quick reference. It establishes nothing, instantiates no interval, closes no
 *   sub-gap, moves no bound. Sensitivity/measurement cross-check only, NOT an RH bound; no QED.
 *   No refereed bound is changed.
 *
 * @see imp-95662-crossover-locator-crosscheck (source: the three locators and the residuals)
 * @see imp-3444-sigma-nshape-landmark-ladder (Newton-height crossover / half-point landmarks)
 * @see imp-95638-deficit-invariant-fartail-limit (closed-form far-tail height inversion)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg))
 *
 * Ticket: imp-95685 (content, low). Documentation only; establishes nothing; NO QED; no refereed bound is changed.
 */

// The N_cross algebraic-pin headword, baked verbatim (no re-import).
const NCROSS_ALGEBRAIC_PIN_HEADWORD = Object.freeze({
  key: 'imp-95662-ncross-algebraic-pin',
  term: 'imp-95662 measurement: the E_coll = E_trunc crossover has a closed algebraic pin N_cross = ln(T0) (C_C/E_trunc)^2',
  definition:
    'From E_coll = C_C sqrt(L/N) = E_trunc (L = ln T0, E_trunc = 3.06e-5 an N-independent fixed-strip ' +
    'constant), solving for N gives the closed algebraic form N_cross = ln(T0) * (C_C / E_trunc)^2. ' +
    'Because T0 = effectiveHeightForN(N) depends only logarithmically on N, this is solved as a fixed ' +
    'point in a few contraction passes on ln(T0), with no root-finder needed.',
  headlineFigure:
    'The algebraic pin agrees with the imp-3444/imp-95638 bisected crossover to better than 1e-7 ' +
    'relative (~4e-11 measured), and both independent bisection solvers (imp-3444 Newton-height and ' +
    'the imp-95638 closed-form-height inversion) reproduce the imp-3444 pinned literals ' +
    'N_cross = 3.280294352e9 and N_half = 3.267235198e9 to ~1e-10 relative.',
  whyItMatters:
    'Two independent solvers of the same Riemann-von Mangoldt law landing on the identical crossover ' +
    'to machine precision -- plus a closed algebraic form pinning it a third way -- confirms the ' +
    '~3.28e9 crossover and the adjacent sigma = 1/2 half-point are solver-independent facts of the ' +
    'shared imp-3406 component model, not an artifact of the imp-3444 Newton inversion routine.',
});

export const IMP95685_NCROSS_ALGEBRAIC_PIN_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95685',
  proofSection: 'S-frontier',
  glosses: 'imp-95662',
  scopes: 'imp-3444',
  question:
    'imp-95662 pinned the imp-3444 E_coll = E_trunc crossover a third way via the closed algebraic ' +
    'form N_cross = ln(T0) (C_C/E_trunc)^2. What does that formula say, and how does its agreement ' +
    'with the bisected value relate to the solver-independent reproduction of the imp-3444 ' +
    'Newton-height landmark, for a reader landing cold?',
  headword: NCROSS_ALGEBRAIC_PIN_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95662 measurement: the ' +
    'E_coll = E_trunc crossover has a closed algebraic pin N_cross = ln(T0) (C_C/E_trunc)^2 agreeing ' +
    'with the bisected value to < 1e-7 relative, and both independent height solvers reproduce the ' +
    'imp-3444 Newton-height landmark N_cross = 3.280294352e9 to ~1e-10 relative. Establishes nothing; ' +
    'instantiates no interval; moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-95662 (three locators and residuals); imp-3444 (Newton-height crossover / half-point ' +
    'landmarks); imp-95638 (closed-form far-tail height inversion); imp-3406 (N-shape component ' +
    'model); imp-2631 (E_trunc fixed strip); polymath15-constant-C-C (C_C).',
});

export default IMP95685_NCROSS_ALGEBRAIC_PIN_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95685_NCROSS_ALGEBRAIC_PIN_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95685-headword-has-required-fields',
    why: 'The headword must name the algebraic formula, the sub-1e-7 agreement, and the reproduced imp-3444 literal -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP95685_NCROSS_ALGEBRAIC_PIN_GLOSSARY_HEADWORD.headword;
      return (
        /N_cross = ln\(T0\) \* \(C_C \/ E_trunc\)\^2/.test(h.definition) &&
        /1e-7/.test(h.headlineFigure) &&
        /3\.280294352e9/.test(h.headlineFigure) &&
        /solver-independent/.test(h.whyItMatters)
      );
    },
  },
  {
    id: 'imp95685-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95685_NCROSS_ALGEBRAIC_PIN_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95685_NCROSS_ALGEBRAIC_PIN_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95685_NCROSS_ALGEBRAIC_PIN_GLOSSARY_HEADWORD.verdict) &&
      IMP95685_NCROSS_ALGEBRAIC_PIN_GLOSSARY_HEADWORD.glosses === 'imp-95662' &&
      IMP95685_NCROSS_ALGEBRAIC_PIN_GLOSSARY_HEADWORD.scopes === 'imp-3444',
  },
];

for (const assertion of IMP95685_NCROSS_ALGEBRAIC_PIN_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-95685-ncross-algebraic-pin-glossary-headword assertion failed: ${assertion.id}`);
  }
}
