/**
 * @module imp-95714-block-floor-rho-monotonicity-glossary-headword
 * @fileoverview imp-95714 -- import-light glossary/Concepts headword for the twin-pair
 *   block-floor rho-monotonicity picture (imp-95659) and its delta-robustness verdict
 *   (imp-95693, cross-checked in the rho = 1 endpoint by imp-95689): the per-pair block
 *   floor F(delta, rho) is STRICTLY MONOTONE INCREASING in the cross/in-pair separation
 *   ratio rho, and the point where it retains HALF the isolated-pair block floor is
 *   DELTA-SPECIFIC when measured in rho but DELTA-STABLE when measured in the absolute
 *   cross-pair gap D_cross.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95659 tabulated the interior of the imp-95642 two-endpoint bracket at a single
 *   in-pair gap (delta = ln 1.3), and imp-95693 recomputed the same sweep at a second and
 *   third gap (ln 1.5, ln 1.2) to test which features survive. A reader landing on either
 *   module cold has no quick-lookup definition of "rho-monotonicity", "half-retention
 *   crossover", or why that crossover drifts in rho but not in D. This headword bakes
 *   those facts VERBATIM (no re-import of the imp-95659 / imp-95693 modules, to stay
 *   import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   F(delta, rho) = lambda_min of the normalized twin-pair seam Gram Gtilde_ij =
 *   sech((x_i - x_j)/2) on a twin-pair lattice with in-pair gap delta and cross-pair gap
 *   D = rho * delta. As rho sweeps from 1 (uniform single-scale lattice) to infinity
 *   (isolated pairs), F is STRICTLY INCREASING, sweeping ~12 orders of magnitude between
 *   the two imp-95642 endpoints: the scalar floor A_opt(delta) at rho = 1 (up to a
 *   ~1.09x finite-size Szego factor) and the isolated block floor 1 - sech(delta/2) as
 *   rho -> inf. imp-95693 confirmed this monotonicity, and the endpoint bracketing, are
 *   ROBUST across delta = ln 1.2, ln 1.3, ln 1.5, ln 2.0 -- a delta-independent structural
 *   feature of the twin-pair symbol, not an artifact of the one gap sampled by imp-95659.
 *
 *   HALF-RETENTION CROSSOVER: DELTA-SPECIFIC IN rho, DELTA-STABLE IN ABSOLUTE D_cross
 *   -----------------------------------------------
 *   imp-95659 found F / blockIso crosses 1/2 near rho ~ 15 at delta = ln 1.3. imp-95693
 *   showed this rho value is NOT a delta-stable constant: rho_cross drifts from ~21.9
 *   (ln 1.2) down to ~9.4 (ln 1.5) and ~5.2 (ln 2.0) across a 3.8x delta range. But the
 *   corresponding ABSOLUTE cross-pair gap D_cross = rho_cross * delta stays nearly fixed
 *   at ~3.6-4.0 across that same range (4.00, 3.93, 3.81, 3.59) -- so rho_cross ~
 *   (const) / delta accounts for the entire rho drift. The half-retention scale is a
 *   property of the absolute seam separation D (where sech(D/2) drops the off-block
 *   coupling by half), not of the ratio rho.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95659 rho-monotonicity tabulation and the
 *   imp-95693 delta-robustness verdict for quick reference. It establishes nothing,
 *   instantiates no interval, closes no sub-gap, moves no bound. imp-2519 no-overclaim
 *   guard preserved; NO QED. No refereed bound is changed.
 *
 * @see imp-95659-twin-pair-block-floor-rho-tabulation (source: the single-delta interior rho sweep this glosses)
 * @see imp-95693-twin-pair-block-floor-second-delta (source: the delta-robustness verdict and D_cross stability this glosses)
 * @see imp-95689-rho1-szego-dual-convergence-rate (rho = 1 endpoint exact-limit cross-check, F / A_opt -> 1)
 * @see imp-95642-twin-pair-symbol-offlattice-obstruction (the two-endpoint bracket that rho interpolates between)
 *
 * Ticket: imp-95714 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The rho-monotonicity + delta-stable D_cross headword, baked verbatim (no re-import).
const RHO_MONOTONICITY_HEADWORD = Object.freeze({
  key: 'twin-pair-block-floor-rho-monotonicity-delta-stable-d-cross',
  term: 'imp-95659/imp-95693 verdict: twin-pair block floor F(delta, rho) is strictly rho-monotone; its half-retention crossover is delta-stable in absolute D_cross, not in rho',
  definition:
    'The per-pair block floor F(delta, rho) = lambda_min(seam Gram) on a twin-pair ' +
    'lattice with cross-pair gap D = rho * delta is STRICTLY INCREASING in rho, sweeping ' +
    '~12 orders of magnitude between the imp-95642 endpoints: the scalar floor A_opt(delta) ' +
    'at rho = 1 and the isolated block floor 1 - sech(delta/2) as rho -> inf. imp-95693 ' +
    'confirmed both the monotonicity and the endpoint bracketing are delta-robust across ' +
    'ln 1.2, ln 1.3, ln 1.5, ln 2.0.',
  halfRetentionCrossover:
    'The rho where F / blockIso crosses 1/2 DRIFTS with delta (~21.9 at ln 1.2, ~15.0 at ' +
    'ln 1.3, ~9.4 at ln 1.5, ~5.2 at ln 2.0), so imp-95659’s "rho ~ 15" is specific to ' +
    'ln 1.3, not a delta-stable constant. The corresponding ABSOLUTE cross-pair gap ' +
    'D_cross = rho_cross * delta instead stays nearly fixed at ~3.6-4.0 across that same ' +
    '3.8x delta range (4.00, 3.93, 3.81, 3.59): the half-retention scale is a property of ' +
    'the absolute seam separation D, not of the ratio rho.',
  precisionCaveat:
    'At delta = ln 1.2 the scalar floor A_opt = 4.26e-22 sits below the ~1e-16 ' +
    'double-precision Jacobi noise floor, so F goes spuriously negative near rho = 1-1.5 ' +
    'there -- a precision limit on confirming the left endpoint at small delta, not a ' +
    'failure of the rho-monotonicity mechanism.',
});

export const IMP95714_RHO_MONOTONICITY_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95714',
  proofSection: 'S-frontier',
  glosses: 'imp-95659,imp-95693',
  scopes: 'imp-95642',
  question:
    'imp-95659 tabulated the interior of the imp-95642 twin-pair block-floor bracket ' +
    'across rho at one delta, and imp-95693 tested whether the rho-monotonicity and the ' +
    '~1/2-retention crossover survive at other deltas. What is the headline verdict, for a ' +
    'reader landing on either module cold?',
  headword: RHO_MONOTONICITY_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates: (1) F(delta, rho) is ' +
    'strictly increasing in rho, delta-robustly, sweeping ~12 orders of magnitude between ' +
    'the imp-95642 endpoints; (2) the half-retention crossover drifts in rho across delta ' +
    'but is nearly delta-stable when measured in the absolute cross-pair gap D_cross ' +
    '(~3.6-4.0). Establishes nothing; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-95659 (single-delta rho interior tabulation); imp-95693 (delta-robustness check, ' +
    'D_cross stability); imp-95689 (rho = 1 exact-limit cross-check); imp-95642 (two-endpoint ' +
    'bracket); imp-95419 (THEOREM SEP-OPT, scalar class floor A_opt).',
});

export default IMP95714_RHO_MONOTONICITY_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95714_RHO_MONOTONICITY_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95714-headword-has-required-fields',
    why: 'The headword must name the rho-monotonicity, the delta-drift-in-rho, and the delta-stability-in-D_cross -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP95714_RHO_MONOTONICITY_GLOSSARY_HEADWORD.headword;
      return (
        /STRICTLY INCREASING/.test(h.definition) &&
        /DRIFTS with delta/.test(h.halfRetentionCrossover) &&
        /nearly fixed/.test(h.halfRetentionCrossover)
      );
    },
  },
  {
    id: 'imp95714-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95714_RHO_MONOTONICITY_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95714_RHO_MONOTONICITY_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95714_RHO_MONOTONICITY_GLOSSARY_HEADWORD.verdict) &&
      IMP95714_RHO_MONOTONICITY_GLOSSARY_HEADWORD.glosses === 'imp-95659,imp-95693' &&
      IMP95714_RHO_MONOTONICITY_GLOSSARY_HEADWORD.scopes === 'imp-95642',
  },
];

for (const assertion of IMP95714_RHO_MONOTONICITY_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-95714-block-floor-rho-monotonicity-glossary-headword assertion failed: ${assertion.id}`);
  }
}
