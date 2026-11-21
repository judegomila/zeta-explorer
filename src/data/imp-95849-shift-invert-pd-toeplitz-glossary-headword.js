/**
 * @module imp-95849-shift-invert-pd-toeplitz-glossary-headword
 * @fileoverview imp-95849 -- import-light glossary/Concepts headword for the imp-95820
 *   PD-preserving shift-invert double-double Toeplitz eigensolve that cures the
 *   imp-95799 large-N inverse-iteration under-convergence.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95820 corrected imp-95779's claim that a nonzero shift breaks Toeplitz
 *   structure, and used the correction to design a two-stage shift-invert solver
 *   that converges ~50x faster than the plain sigma=0 inverse iteration. A reader
 *   landing on that module cold has no quick-lookup definition of why the shift
 *   preserves structure, why definiteness (not structure) is the real constraint,
 *   or how the two-stage bootstrap-then-shift scheme works. This headword bakes
 *   those facts VERBATIM (no re-import of the imp-95820 module, to stay
 *   import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   For a symmetric Toeplitz matrix T with unit main diagonal, subtracting a
 *   scalar shift sigma from every diagonal entry leaves T - sigma I symmetric
 *   TOEPLITZ (first column (1 - sigma, r_1, r_2, ...) unchanged off the
 *   diagonal), so Levinson-Durbin still factors it in O(N^2) after normalizing
 *   by d = 1 - sigma. The constraint Levinson-Durbin actually needs is
 *   POSITIVE-DEFINITENESS of the shifted matrix (every reflection coefficient
 *   beta_k > 0), not Toeplitz structure: a shift sigma < lambda_min keeps
 *   T - sigma I PD and the recursion stable, while a shift sigma >= lambda_min
 *   (e.g. a naive Rayleigh-quotient-iteration shift) makes T - sigma I
 *   indefinite and the recursion BREAKS DOWN (some beta_k <= 0).
 *
 *   THE TWO-STAGE PD-PRESERVING SOLVER: bootstrap with sigma = 0 for a fixed
 *   number of iterations (the Rayleigh quotient descends from ABOVE lambda_min,
 *   so the bootstrap estimate R0 > lambda_min is a safe upper bound), then
 *   switch to a locked shift sigma = R0 (1 - margin) held strictly below the
 *   running estimate; any indefinite breakdown during the shifted phase grows
 *   the margin and retries the step. This reproduces a ~4000-5000-solve
 *   sigma=0 converged value in ~80-115 solves.
 *
 *   DISCRIMINATING ALTERNATIVE: naive Rayleigh-quotient iteration, which shifts
 *   by the CURRENT Rayleigh quotient (sigma = RQ >= lambda_min once converging
 *   from above), makes T - sigma I indefinite and Levinson-Durbin breaks down
 *   on every shifted step -- it is the margin-below-the-estimate discipline,
 *   not the shift itself, that keeps the recursion stable.
 *
 *   STATUS: confirmed empirically -- at ln1.45 N=699 the shift-invert solver
 *   returns lambda_min = 1.9707983301e-10 in 100 solves, exactly the imp-95799
 *   5000-solve sigma=0 converged value; the previously-failing ln1.45 control
 *   C-fit now matches float64 truth to < 0.06% absolute (was off by up to
 *   6.90%), and the fully-DD ln1.35 / ln1.25 sides cross sub-1% relative error.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95820 solver-design result for
 *   quick reference. It establishes nothing, instantiates no interval, closes
 *   no sub-gap, moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-95820-shift-invert-dd-toeplitz-crossing (source: the solver this glosses)
 * @see imp-95799-rstar-delta-drift-linear-fit (the crossing test the solver unblocks)
 * @see imp-95779-on2-dd-toeplitz-lambda-min-ln12 (the O(N^2) DD solver + the corrected shift claim)
 *
 * Ticket: imp-95849 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The PD-preserving shift-invert DD Toeplitz eigensolve headword, baked verbatim (no re-import).
const SHIFT_INVERT_PD_TOEPLITZ_HEADWORD = Object.freeze({
  key: 'pd-preserving-shift-invert-dd-toeplitz-eigensolve',
  term:
    'PD-preserving shift-invert double-double Toeplitz eigensolve ' +
    '(cures large-N inverse-iteration under-convergence)',
  definition:
    'A two-stage inverse-iteration variant for the smallest eigenvalue of a ' +
    'symmetric positive-definite Toeplitz matrix T: bootstrap with shift ' +
    'sigma = 0 to obtain an upper-bound estimate R0 > lambda_min (the Rayleigh ' +
    'quotient descends from above), then switch to a locked shift ' +
    'sigma = R0 (1 - margin) held strictly below the running estimate, ' +
    'growing the margin and retrying on any indefinite breakdown. Because ' +
    'subtracting a scalar from the constant main diagonal of a Toeplitz matrix ' +
    'leaves every diagonal constant, T - sigma I stays symmetric TOEPLITZ, so ' +
    'Levinson-Durbin still factors it in O(N^2) after normalizing by ' +
    'd = 1 - sigma.',
  mechanism:
    'Levinson-Durbin requires positive-definiteness (every reflection ' +
    'coefficient beta_k > 0), not Toeplitz structure, to stay stable -- a ' +
    'shift sigma < lambda_min keeps T - sigma I PD, while sigma >= lambda_min ' +
    'makes it indefinite and the recursion breaks down (some beta_k <= 0). ' +
    'The bootstrap-then-shift discipline guarantees the working shift stays ' +
    'below lambda_min while still large enough to collapse the eigen-gap that ' +
    'made the plain sigma = 0 iteration under-converge at large N.',
  discriminatingAlternative:
    'Naive Rayleigh-quotient iteration shifts by the CURRENT Rayleigh quotient ' +
    '(sigma = RQ), which once the iterate is converging from above satisfies ' +
    'sigma >= lambda_min and makes T - sigma I indefinite -- Levinson-Durbin ' +
    'breaks down on every such shifted step. It is the margin-below-the-' +
    'running-estimate discipline, not merely shifting, that keeps the ' +
    'recursion stable.',
  verificationStatus:
    'Confirmed empirically: at ln1.45 N=699 the shift-invert solver returns ' +
    'lambda_min = 1.9707983301e-10 in 100 solves, exactly the sigma=0 ' +
    '5000-solve converged value; the previously-failing ln1.45 control C-fit ' +
    'now matches float64 truth to < 0.06% absolute (was off by up to 6.90%); ' +
    'the fully-DD ln1.35 (reach 320, -0.673%) and ln1.25 (reach 340, -0.736%) ' +
    'sides both cross sub-1% relative error.',
});

export const IMP95849_SHIFT_INVERT_PD_TOEPLITZ_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95849',
  proofSection: 'S-frontier',
  glosses: 'imp-95820',
  question:
    'imp-95820 designed a shift-invert double-double Toeplitz eigensolve that ' +
    'cures the imp-95799 large-N under-convergence. What exactly makes the ' +
    'shifted solve still Toeplitz-compatible, why is definiteness (not ' +
    'structure) the real constraint, and how does the two-stage scheme avoid ' +
    'the naive-RQI breakdown, for a reader landing on that module cold?',
  headword: SHIFT_INVERT_PD_TOEPLITZ_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the ' +
    'imp-95820 solver-design result: T - sigma I stays symmetric Toeplitz ' +
    'under a diagonal shift, Levinson-Durbin needs positive-definiteness (not ' +
    'Toeplitz structure) to stay stable, and a two-stage bootstrap-then-shift ' +
    'scheme (sigma = 0 bootstrap for an upper-bound estimate, then a locked ' +
    'shift held below it with margin back-off on indefinite breakdown) ' +
    'reproduces a ~5000-solve sigma=0 converged value in ~80-115 solves, ' +
    'unlike a naive Rayleigh-quotient shift which breaks Levinson-Durbin down. ' +
    'Establishes nothing; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-95820 (the shift-invert solver design and empirical confirmation ' +
    'this glosses); imp-95799 (the sigma=0 under-convergence sub-gap the ' +
    'solver resolves); imp-95779 (the O(N^2) DD Toeplitz solver whose ' +
    'shift-breaks-structure claim imp-95820 corrects).',
});

export default IMP95849_SHIFT_INVERT_PD_TOEPLITZ_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95849_SHIFT_INVERT_PD_TOEPLITZ_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95849-headword-has-required-fields',
    why: 'The headword must name the diagonal-shift Toeplitz-preservation fact, the positive-definiteness constraint, the two-stage bootstrap/shift scheme, and the naive-RQI breakdown discriminant -- the entire point of the glossary entry.',
    holds: () => {
      const h = SHIFT_INVERT_PD_TOEPLITZ_HEADWORD;
      return (
        /stays symmetric TOEPLITZ/.test(h.definition) &&
        /positive-definiteness/i.test(h.mechanism) &&
        /Rayleigh-quotient iteration/.test(h.discriminatingAlternative) &&
        /1\.9707983301e-10/.test(h.verificationStatus)
      );
    },
  },
  {
    id: 'imp95849-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95849_SHIFT_INVERT_PD_TOEPLITZ_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95849_SHIFT_INVERT_PD_TOEPLITZ_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95849_SHIFT_INVERT_PD_TOEPLITZ_GLOSSARY_HEADWORD.verdict) &&
      IMP95849_SHIFT_INVERT_PD_TOEPLITZ_GLOSSARY_HEADWORD.glosses === 'imp-95820',
  },
];

for (const assertion of IMP95849_SHIFT_INVERT_PD_TOEPLITZ_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95849-shift-invert-pd-toeplitz-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
