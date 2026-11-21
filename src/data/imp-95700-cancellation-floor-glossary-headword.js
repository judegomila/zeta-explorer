/**
 * @module imp-95700-cancellation-floor-glossary-headword
 * @fileoverview imp-95700 -- import-light glossary/Concepts headword for the imp-95677 float64
 *   cancellation-floor obstruction on the rho=1 twin-pair block floor: lambda_min (~4-5e-15) sits at
 *   the double-precision noise floor lmax*eps, the condition number lmax/lmin (~5e15) exceeds 1/eps
 *   (~4.5e15), and the last significant digit of every measured lambda_min is therefore unreliable --
 *   including the sub-1 F/A_opt undershoot recorded at nPairs=320.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95677 measured F = lambda_min of the rho=1 uniform-lattice sech seam Gram across a growing
 *   point-count grid and found the ratio F/A_opt decays monotonically 1.143 -> 1.101 -> 1.010 -> 0.909,
 *   crossing 1 near 160 pairs -- but flagged that the absolute magnitude of F (~4-5e-15) sits right at
 *   the float64 cancellation floor, so the apparent undershoot below 1 at 320 pairs cannot be trusted
 *   as a real value below the symbol infimum. A reader landing on imp-95677 cold has no quick-lookup
 *   definition of what "sits at the cancellation floor" means quantitatively, or why the sub-1 reading
 *   is noise rather than a genuine violation of the finite-section lower bound. This headword bakes
 *   those facts VERBATIM (no re-import of the imp-95677 module, to stay import-light) as a standalone
 *   lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   For a symmetric positive-definite matrix computed in double precision, the achievable absolute
 *   accuracy on any eigenvalue is bounded below by roughly lmax * machineEps, where lmax is the
 *   largest eigenvalue and machineEps ~ 2.22e-16 is the double-precision unit roundoff. At rho=1 the
 *   sech seam Gram has lmax ~ 22-24 across the imp-95677 grid, giving a noise floor lmax*eps ~
 *   4.9e-15 to 5.3e-15 -- the SAME ORDER OF MAGNITUDE as lmin itself (lmin/noiseFloor = 1.02, 0.93,
 *   0.84, 0.75 across the four sections). Equivalently the condition number kappa = lmax/lmin ~ 5e15
 *   exceeds 1/eps ~ 4.5e15, the standard threshold above which no significant digits of the smallest
 *   eigenvalue survive floating-point arithmetic.
 *
 *   WHY THE SUB-1 UNDERSHOOT IS NOISE, NOT A VIOLATION
 *   -----------------------------------------------
 *   A finite section of a positive Toeplitz operator has lambda_min bounded below by the symbol
 *   infimum A_opt (finite-section theory: truncation can only raise, never lower, the minimum
 *   eigenvalue relative to the infinite-lattice limit). So a measured ratio F/A_opt < 1 (0.909 at
 *   nPairs=320) is mathematically impossible as an exact value -- it is a computed artifact of
 *   subtracting nearly-equal floating-point quantities inside a value that is itself only one
 *   significant digit above the roundoff floor. The correct reading is: the true ratio is decaying
 *   toward 1 from above, and float64 arithmetic simply cannot resolve whether the true value at
 *   nPairs=320 is 0.999 or 1.001 -- only the qualitative monotone-decay-toward-1 direction survives.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95677 float64-floor obstruction for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound. At the time this
 *   headword was written, resolving the exact convergence rate and confirming the limit is exactly 1
 *   needed extended precision. That extended-precision confirmation has since landed: imp-95825 supplies
 *   the finite-section positivity certificate (lambda_min(G_n) >= A_opt for every section size), and
 *   imp-95823 reproduces this same rho=1 sequence via a direct double-double eigensolve with no sub-1
 *   undershoot at any section, so the 0.909 reading recorded here is settled as roundoff, not a new
 *   phenomenon. Catalan constant G irrationality remains OPEN; NO QED. No refereed bound is changed.
 *
 * @see imp-95677-rho1-szego-finite-size-convergence (source: the measurement and float64-floor obstruction this glosses)
 * @see imp-95659-twin-pair-block-floor-rho-tabulation (the rho=1 endpoint this refines)
 * @see imp-95419-separated-class-optimal-riesz-floor (A_opt scalar class floor / symbol infimum)
 * @see imp-95825-finite-section-positivity-certificate (lambda_min(G_n) >= ess-inf f = A_opt for every section size -- confirms the sub-1 reading here is impossible as an exact value)
 * @see imp-95823-rho1-szego-direct-dd-eigensolve (direct double-double eigensolve confirming the roundoff diagnosis: no sub-1 undershoot away from the float64 floor)
 *
 * Ticket: imp-95700 (content, low). Documentation only; establishes nothing; NO QED; no refereed bound is changed.
 */

// The cancellation-floor headword, baked verbatim (no re-import).
const CANCELLATION_FLOOR_HEADWORD = Object.freeze({
  key: 'rho1-twin-pair-float64-cancellation-floor',
  term:
    'imp-95677 float64 cancellation floor: at rho=1 lambda_min (~4-5e-15) sits at the ' +
    'double-precision noise floor lmax*eps, condition number lmax/lmin (~5e15) exceeds 1/eps, so ' +
    'the sub-1 F/A_opt undershoot is numerical noise, not a genuine value below the symbol infimum',
  definition:
    'For the rho=1 uniform-lattice sech seam Gram, F = lambda_min sits within a factor of ~1.3 of ' +
    'the double-precision roundoff floor lmax*machineEps (lmin/noiseFloor = 1.02, 0.93, 0.84, 0.75 ' +
    'across nPairs = 40/80/160/320), and the condition number kappa = lmax/lmin (~5e15) exceeds ' +
    '1/eps (~4.5e15) -- the threshold above which no significant digit of the smallest eigenvalue ' +
    'survives float64 arithmetic.',
  robustness:
    'Finite-section theory guarantees lambda_min of a positive Toeplitz section is bounded below by ' +
    'the symbol infimum A_opt, so a measured ratio F/A_opt < 1 (0.909 at nPairs=320) is impossible ' +
    'as an exact value; it is a cancellation artifact inside a quantity already one significant ' +
    'digit above the roundoff floor. Only the qualitative monotone-decay-toward-1 direction survives ' +
    'float64; the exact limit and convergence exponent require extended precision -- OPEN.',
});

export const IMP95700_CANCELLATION_FLOOR_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95700',
  proofSection: 'S-frontier',
  glosses: 'imp-95677',
  scopes: 'imp-95659',
  question:
    'imp-95677 measured the rho=1 F/A_opt ratio decaying toward 1 but flagged that F sits at the ' +
    'float64 cancellation floor. What does "sits at the cancellation floor" mean quantitatively, and ' +
    'why is the sub-1 undershoot at nPairs=320 numerical noise rather than a real violation of the ' +
    'finite-section lower bound, for a reader landing on that module cold?',
  headword: CANCELLATION_FLOOR_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95677 finding: lambda_min ' +
    '(~4-5e-15) sits at the double-precision noise floor lmax*eps, the condition number lmax/lmin ' +
    '(~5e15) exceeds 1/eps (~4.5e15), and finite-section theory forbids F/A_opt from dropping below ' +
    '1 exactly -- so the measured 0.909 undershoot at nPairs=320 is cancellation noise, not a genuine ' +
    'sub-floor value. Only the qualitative monotone decay toward 1 is established; the exact limit ' +
    'and rate need extended precision -- OPEN. Establishes nothing; instantiates no interval; moves ' +
    'no bound; G irrationality OPEN; NO QED. No refereed bound is changed.',
  citation:
    'imp-95677 (the measurement and float64-floor obstruction this headword glosses); imp-95659 ' +
    '(the rho=1 endpoint this refines); imp-95419 (A_opt scalar class floor / symbol infimum); ' +
    'imp-95825 (finite-section positivity certificate) and imp-95823 (direct double-double ' +
    'eigensolve) -- the roundoff correction confirming the 0.909 reading as noise, not a real value.',
});

export default IMP95700_CANCELLATION_FLOOR_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95700_CANCELLATION_FLOOR_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95700-headword-has-required-fields',
    why: 'The headword must name the noise-floor magnitude, the condition-number threshold, and the noise-not-violation verdict -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP95700_CANCELLATION_FLOOR_GLOSSARY_HEADWORD.headword;
      return (
        /lmax\*eps/.test(h.term) &&
        /1\/eps/.test(h.definition) &&
        /1\.02, 0\.93, 0\.84, 0\.75/.test(h.definition) &&
        /impossible/.test(h.robustness) &&
        /OPEN/.test(h.robustness)
      );
    },
  },
  {
    id: 'imp95700-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, G irrationality OPEN, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95700_CANCELLATION_FLOOR_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95700_CANCELLATION_FLOOR_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95700_CANCELLATION_FLOOR_GLOSSARY_HEADWORD.verdict) &&
      /G irrationality OPEN/.test(IMP95700_CANCELLATION_FLOOR_GLOSSARY_HEADWORD.verdict) &&
      IMP95700_CANCELLATION_FLOOR_GLOSSARY_HEADWORD.glosses === 'imp-95677' &&
      IMP95700_CANCELLATION_FLOOR_GLOSSARY_HEADWORD.scopes === 'imp-95659',
  },
];

for (const assertion of IMP95700_CANCELLATION_FLOOR_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95700-cancellation-floor-glossary-headword assertion failed: ${assertion.id}`
    );
  }
}
