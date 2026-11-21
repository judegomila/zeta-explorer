/**
 * @module imp-96196-rayleigh-kato-temple-obstruction-glossary-headword
 * @fileoverview imp-96196 -- import-light glossary/Concepts headword for the imp-96169
 *   Rayleigh/Kato-Temple obstruction: the naive Rayleigh-quotient variational route is
 *   DIRECTIONALLY WRONG for upper-bounding the top confined eigenvalue of the mixed
 *   {oo,2,3} prolate operator A_S23, and the one gap-based rescue (Kato-Temple) stalls
 *   by re-encountering the same fractal Zygmund eigenfunction it was meant to avoid.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96143 reduced the mixed-group {oo,2,3} strict-gap statement (I) to the top
 *   confined states, blocked by fractal Zygmund eigenfunctions. imp-96169 asked whether
 *   a Rayleigh-quotient variational bound could certify the top eigenvalue strictly below
 *   1 WITHOUT diagonalizing. A reader landing on imp-96169 cold has no quick-lookup
 *   definition of why the variational route fails in principle (not just in practice).
 *   This headword bakes that obstruction VERBATIM (no re-import of the imp-96169 module,
 *   to stay import-light) as a standalone entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   A_S23 is self-adjoint with ||A_S23|| <= 1, so for ANY test function psi the Rayleigh
 *   quotient R(psi) = <psi, A_S23 psi> / <psi, psi> satisfies R(psi) <= lam_max
 *   (Courant-Fischer), with equality iff psi is a top eigenvector. A finite test-function
 *   family therefore only ever produces a LOWER envelope approaching lam_max from below --
 *   the variational route is pointed the wrong way to certify lam_max < 1. The one
 *   variational upper bound on an ISOLATED top eigenvalue is the Kato-Temple inequality
 *   U(psi) = R(psi) + sigma^2(psi)/(R(psi) - alpha); the ladder reduction (imp-96143)
 *   supplies the required gap anchor alpha in (s_2 = 0.353553, lam_top) for free, but
 *   certifying U < 1 needs sigma^2 small -- in the p=2-calibrated 5-level model
 *   (lam_top = 0.9999731) U < 1 only for second-state overlap eps below ~1.17e-2
 *   (exact: 0.011744840); already at eps = 0.03, U = 1.0001485 > 1, FAILING. So the gap
 *   route reduces "certify lam_max < 1" to "resolve the fractal top eigenfunction to ~1%
 *   accuracy" -- the same blocked diagonalization step, re-encountered one level up.
 *
 *   STATUS: an ASSESSMENT, not a QED. Both variational sub-routes (naive Rayleigh, and
 *   the Kato-Temple gap rescue) fail to certify lam_max < 1 without effectively
 *   diagonalizing. The strict gap stays with the analytic no-modulus-1 route (imp-96164,
 *   residual SG-96164-boundary), a genuinely different and currently tighter handle.
 *   Nothing here diagonalizes A_S23, moves a Lambda bound, or a verified height. RH open;
 *   no refereed bound is changed; NO QED.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96169 Rayleigh/Kato-Temple obstruction for
 *   quick reference. It establishes nothing, instantiates no interval, closes no sub-gap
 *   on its own, moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-96169-route-i-rayleigh-variational-topstate-assessment (source: the obstruction this glosses)
 * @see imp-96143-route-i-mixed-ladder-23-prolate-spectrum-summability (the residual (I) this attacks)
 * @see imp-96164-route-i-mixed-group-no-modulus1-overdetermination (the analytic route the gap defers to)
 *
 * Ticket: imp-96196 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The Rayleigh/Kato-Temple obstruction headword, baked verbatim (no re-import).
const RAYLEIGH_KATO_TEMPLE_OBSTRUCTION_HEADWORD = Object.freeze({
  key: 'rayleigh-kato-temple-obstruction-topstate',
  term:
    'imp-96169 Rayleigh/Kato-Temple obstruction: the variational route is directionally ' +
    'wrong for the top confined eigenvalue of A_S23, and the Kato-Temple gap rescue ' +
    're-encounters the fractal Zygmund eigenfunction',
  definition:
    'A_S23 is self-adjoint with ||A_S23|| <= 1, so for any test function psi the Rayleigh ' +
    'quotient R(psi) = <psi, A_S23 psi> / <psi, psi> satisfies R(psi) <= lam_max ' +
    '(Courant-Fischer), with equality iff psi is a top eigenvector. A single or finite ' +
    'family of test functions therefore only ever produces a monotone LOWER envelope ' +
    'approaching lam_max from below; upper-bounding the TOP eigenvalue instead needs ' +
    'coercivity of I - A_S23 (an infimum over ALL psi), whose infimizing sequence is ' +
    'exactly the fractal Zygmund near-top eigenfunction that blocks diagonalization. The ' +
    'one variational upper bound on an isolated top eigenvalue, Kato-Temple ' +
    'U(psi) = R(psi) + sigma^2(psi)/(R(psi) - alpha), gets a free gap anchor alpha in ' +
    '(s_2 = 0.353553, lam_top) from the ladder reduction, but certifying U < 1 needs ' +
    'sigma^2 small: in the p=2-calibrated 5-level model U < 1 only for second-state ' +
    'overlap eps < 0.011744840, already failing (U = 1.0001485 > 1) at eps = 0.03. So the ' +
    'gap rescue reduces to resolving the fractal top eigenfunction to ~1% accuracy -- the ' +
    'blocked diagonalization step in a new disguise. Residual: strict gap stays with the ' +
    'analytic no-modulus-1 route (SG-96164-boundary).',
  mechanism:
    'The variational max-principle only ever upper-bounds the LOWEST eigenvalue via a ' +
    'min over test functions; upper-bounding the HIGHEST eigenvalue is instead a min ' +
    'over test functions of the complementary form I - A_S23 (a coercivity infimum), so a ' +
    'naive Rayleigh quotient is structurally the wrong tool for the top state -- it can ' +
    'only confirm lam_max is near 1 from below, never certify lam_max < 1. The Kato-Temple ' +
    'gap inequality is the correct tool for an isolated top eigenvalue, but its ' +
    'certification threshold is controlled by the residual variance sigma^2(psi), which ' +
    'stays large unless psi approximates the true (fractal, no bounded modulus of ' +
    'continuity) top eigenfunction to a fixed accuracy -- so the gap route inherits the ' +
    'same obstruction that blocks direct diagonalization.',
  verificationStatus:
    'ASSESSMENT, not a QED: confirmed on a p=2-calibrated 5-level self-adjoint model ' +
    '(lam_top = 0.9999731) via a deterministic 400-point Rayleigh sweep (max R stays ' +
    'strictly below lam_top, confirming the lower-envelope direction) and a Kato-Temple ' +
    'threshold bisection (certifying eps < 0.011744840, failing at eps = 0.03 with ' +
    'U = 1.0001485). The DIRECTION fact is exact and basis-free for any self-adjoint ' +
    'A_S23; the Kato-Temple threshold value is model-calibrated and widens with the gap ' +
    'but never removes the rate-controlled-approximation requirement. Changes no bound; ' +
    'nothing diagonalizes A_S23; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96196_RAYLEIGH_KATO_TEMPLE_OBSTRUCTION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96196',
  proofSection: 'Route I',
  glosses: 'imp-96169',
  question:
    'imp-96143 reduced the mixed {oo,2,3} strict-gap statement (I) to the top confined ' +
    'states, blocked by the fractal Zygmund eigenfunctions. Can a Rayleigh-quotient ' +
    'variational bound put the top confined eigenvalue strictly below 1 WITHOUT ' +
    'diagonalizing, for a reader landing on imp-96169 cold?',
  headword: RAYLEIGH_KATO_TEMPLE_OBSTRUCTION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96169 finding: ' +
    'the naive Rayleigh quotient can only lower-bound the top eigenvalue of the ' +
    'self-adjoint A_S23 (Courant-Fischer), so it is directionally wrong to certify ' +
    'lam_max < 1; the Kato-Temple gap rescue gets a free anchor from the ladder reduction ' +
    'but needs sigma^2 small, which requires resolving the fractal top eigenfunction to ' +
    '~1% accuracy -- the blocked diagonalization step re-encountered. Establishes ' +
    'nothing; instantiates no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96169 (the Rayleigh/Kato-Temple obstruction this glosses); imp-96143 (the ' +
    'residual (I) this attacks); imp-96164 (the analytic route the strict gap defers to).',
});

export default IMP96196_RAYLEIGH_KATO_TEMPLE_OBSTRUCTION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96196_RAYLEIGH_KATO_TEMPLE_OBSTRUCTION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96196-headword-has-required-fields',
    why: 'The headword must name the direction fact, the Kato-Temple threshold, and the ' +
      'sub-gap it defers to -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96196_RAYLEIGH_KATO_TEMPLE_OBSTRUCTION_GLOSSARY_HEADWORD.headword;
      return (
        /R\(psi\) <= lam_max/.test(h.definition) &&
        /0\.011744840/.test(h.definition) &&
        /SG-96164-boundary/.test(h.definition) &&
        /1\.0001485/.test(h.definition)
      );
    },
  },
  {
    id: 'imp96196-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96196_RAYLEIGH_KATO_TEMPLE_OBSTRUCTION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96196_RAYLEIGH_KATO_TEMPLE_OBSTRUCTION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96196_RAYLEIGH_KATO_TEMPLE_OBSTRUCTION_GLOSSARY_HEADWORD.verdict) &&
      IMP96196_RAYLEIGH_KATO_TEMPLE_OBSTRUCTION_GLOSSARY_HEADWORD.glosses === 'imp-96169',
  },
];

for (const assertion of IMP96196_RAYLEIGH_KATO_TEMPLE_OBSTRUCTION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96196-rayleigh-kato-temple-obstruction-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
