/**
 * @module imp-95850-direct-dd-jacobi-glossary-headword
 * @fileoverview imp-95850 -- import-light glossary/Concepts headword for the imp-95823
 *   direct double-double Jacobi Gram eigensolve, the extended-precision cross-check
 *   that beats the float64 cancellation floor on the rho = 1 sech seam Gram.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95823 diagonalised the rho = 1 sech seam Gram directly (not via the
 *   imp-95689 Poisson symbol dual) using a cyclic Jacobi sweep carried in
 *   double-double (Dekker/Knuth two-double) arithmetic, confirming the
 *   imp-95677 float64 sub-1 undershoot (0.909 at nPts = 640) was pure
 *   cancellation roundoff. A reader landing on that module cold has no
 *   quick-lookup definition of why float64 loses every digit here, what
 *   "fully converged" means for a DD Jacobi sweep, or why the exponent stays
 *   out of direct reach at the actual seam spacing. This headword bakes those
 *   facts VERBATIM (no re-import of the imp-95823 module, to stay import-light)
 *   as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The rho = 1 sech seam Gram has condition number cond ~ 5e15, which exceeds
 *   1 / eps for IEEE double (eps ~ 2.2e-16): computing lambda_min in float64
 *   subtracts near-equal O(lmax) quantities down to an O(lambda_min) residual
 *   and loses EVERY significant digit (lambda_min ~ 4-5e-15 sits exactly at the
 *   lmax * eps noise floor). Double-double (DD) arithmetic represents each
 *   entry as an unevaluated sum of two float64s (~32 significant decimal
 *   digits total), so the same ~15-16 digits of cancellation leave ~16-17
 *   TRUSTWORTHY digits behind -- enough to resolve lambda_min cleanly.
 *
 *   FULLY-CONVERGED CRITERION: a cyclic Jacobi rotation sweep is judged
 *   converged not by a fixed sweep count but by driving the off-diagonal
 *   Frobenius norm down to the DD roundoff floor itself (~1e-30) at every
 *   matrix size -- i.e. the sweep is run until further rotations no longer
 *   change the off-diagonal norm beyond DD roundoff, not merely until it
 *   looks small in float64 terms.
 *
 *   O(N^3) REACH LIMIT: cyclic Jacobi in DD arithmetic costs O(N^3) per sweep
 *   (each of O(N^2) off-diagonal pairs needs a rotation, DD ops are several
 *   times a float64 op, and full convergence needs multiple sweeps), which
 *   caps the practical grid at nPts up to a few hundred. At the ACTUAL seam
 *   spacing (delta = ln 1.3) the ratio F / A_opt approaches 1 from above but
 *   its local log-log slope drifts (-2.130 -> -1.520 -> -0.775 across
 *   nPts = 80/160/320/640) instead of locking to the asymptotic exponent -2:
 *   the symbol near theta = pi is an exponentially steep well with curvature
 *   scale delta / pi ~ 0.083, so the quadratic-exponent regime sits beyond
 *   what O(N^3) DD Jacobi can reach at ln 1.3, leaving that exponent a
 *   pre-asymptotic sub-gap resolved only via the imp-95689 dual (checked here
 *   on a well-conditioned delta = 3 control, where the SAME DD Jacobi does
 *   lock cleanly to exponent 2).
 *
 *   STATUS: confirmed -- F / A_opt = 1.179 / 1.041 / 1.014 / 1.008 at
 *   nPts = 80/160/320/640, strictly above 1 and monotonically decaying,
 *   pinning the limit (= 1) and the approach-from-above sign directly and
 *   independently of the symbol dual.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95823 methodology result for
 *   quick reference. It establishes nothing, instantiates no interval, closes
 *   no sub-gap, moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-95823-rho1-szego-direct-dd-eigensolve (source: the eigensolve this glosses)
 * @see imp-95677-rho1-szego-finite-size-convergence (the float64-floor sub-gap)
 * @see imp-95689-rho1-szego-dual-convergence-rate (the Poisson-dual resolution cross-checked here)
 *
 * Ticket: imp-95850 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The direct-DD Jacobi eigensolve headword, baked verbatim (no re-import).
const DIRECT_DD_JACOBI_HEADWORD = Object.freeze({
  key: 'direct-double-double-jacobi-gram-eigensolve',
  term:
    'Direct double-double Jacobi Gram eigensolve ' +
    '(extended-precision cross-check beating the float64 cancellation floor)',
  definition:
    'A cyclic Jacobi rotation sweep for the smallest eigenvalue of a ' +
    'symmetric Gram matrix, carried entirely in double-double (Dekker/Knuth ' +
    'two-double) arithmetic instead of native float64, applied directly to ' +
    'the Gram itself rather than to a symbol-dual representation. Each ' +
    'matrix entry and every arithmetic operation is represented as an ' +
    'unevaluated sum of two float64 values, giving roughly 32 significant ' +
    'decimal digits of working precision.',
  mechanism:
    'When a Gram matrix has condition number cond exceeding 1 / eps ' +
    '(eps ~ 2.2e-16 for float64), computing lambda_min subtracts near-equal ' +
    'O(lmax) quantities down to an O(lambda_min) residual and loses every ' +
    'significant digit in float64 -- the computed value sits at the ' +
    'lmax * eps noise floor rather than reflecting the true eigenvalue. ' +
    'Carrying the same cancellation in double-double leaves roughly ' +
    '32 - 15 = 16-17 trustworthy digits behind, enough to resolve ' +
    'lambda_min cleanly. Convergence is judged by driving the off-diagonal ' +
    'Frobenius norm down to the DD roundoff floor itself (~1e-30), not by a ' +
    'fixed sweep count or a float64-scale tolerance.',
  reachLimit:
    'Cyclic Jacobi in double-double arithmetic costs O(N^3) per fully ' +
    'converged solve (O(N^2) off-diagonal pairs rotated over several ' +
    'sweeps, each DD operation several times the cost of a float64 op), ' +
    'capping the practical grid at a few hundred points. At the actual ' +
    'rho = 1 seam spacing this leaves the asymptotic convergence EXPONENT ' +
    'pre-asymptotic: the local log-log slope drifts rather than locking to ' +
    'the limiting value, because the exponentially steep symbol well near ' +
    'theta = pi pushes the quadratic-exponent regime beyond the reachable ' +
    'grid size. A well-conditioned control at a wider lattice spacing, run ' +
    'with the identical DD Jacobi code, DOES lock cleanly to the limiting ' +
    'exponent, certifying the methodology rather than the reach.',
  verificationStatus:
    'Confirmed: F / A_opt = 1.178639791 / 1.040815662 / 1.014235927 / ' +
    '1.008318571 at nPts = 80/160/320/640 -- strictly above 1 at every size ' +
    'and monotonically decaying toward 1 -- directly and independently ' +
    'confirming the imp-95689 limit (= 1) and no-undershoot conclusion ' +
    'without going through the Poisson symbol dual.',
});

export const IMP95850_DIRECT_DD_JACOBI_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95850',
  proofSection: 'S-frontier',
  glosses: 'imp-95823',
  question:
    'imp-95823 ran a direct double-double Jacobi eigensolve of the rho = 1 ' +
    'sech seam Gram to cross-check the imp-95689 symbol-dual result. What ' +
    'exactly does double-double arithmetic buy over float64 here, what ' +
    'counts as a fully-converged DD Jacobi sweep, and why does the ' +
    'convergence exponent stay out of direct reach at the actual seam ' +
    'spacing, for a reader landing on that module cold?',
  headword: DIRECT_DD_JACOBI_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the ' +
    'imp-95823 methodology result: float64 loses every digit of lambda_min ' +
    'when cond exceeds 1 / eps, double-double leaves ~16-17 trustworthy ' +
    'digits behind, full convergence means driving the off-diagonal norm to ' +
    'the DD roundoff floor (~1e-30), and the O(N^3) reach caps the grid ' +
    'size so the convergence exponent at the actual ln 1.3 seam spacing ' +
    'stays pre-asymptotic while a well-conditioned control confirms the ' +
    'methodology. Establishes nothing; instantiates no interval; moves no ' +
    'bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-95823 (the direct DD Jacobi eigensolve and empirical result this ' +
    'glosses); imp-95677 (the float64 cancellation-floor sub-gap resolved ' +
    'here); imp-95689 (the Poisson-dual result independently confirmed).',
});

export default IMP95850_DIRECT_DD_JACOBI_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95850_DIRECT_DD_JACOBI_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95850-headword-has-required-fields',
    why: 'The headword must name the cancellation-floor mechanism, the fully-converged criterion, the O(N^3) reach limit, and the confirmed direct-DD ratio table -- the entire point of the glossary entry.',
    holds: () => {
      const h = DIRECT_DD_JACOBI_HEADWORD;
      return (
        /double-double/i.test(h.definition) &&
        /1 \/ eps/.test(h.mechanism) &&
        /O\(N\^3\)/.test(h.reachLimit) &&
        /1\.008318571/.test(h.verificationStatus)
      );
    },
  },
  {
    id: 'imp95850-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95850_DIRECT_DD_JACOBI_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95850_DIRECT_DD_JACOBI_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95850_DIRECT_DD_JACOBI_GLOSSARY_HEADWORD.verdict) &&
      IMP95850_DIRECT_DD_JACOBI_GLOSSARY_HEADWORD.glosses === 'imp-95823',
  },
];

for (const assertion of IMP95850_DIRECT_DD_JACOBI_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95850-direct-dd-jacobi-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
