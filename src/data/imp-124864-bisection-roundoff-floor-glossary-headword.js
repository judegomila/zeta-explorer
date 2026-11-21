/**
 * @module imp-124864-bisection-roundoff-floor-glossary-headword
 * @fileoverview imp-124864 -- import-light glossary/Concepts headword recording the imp-124810
 *   bisection round-off floor verdict: the landmark-bisection round-off floor R_inf ~ 4.46e-13 and
 *   the induced sigma_crit ~ 1.27e-2 are DOUBLE-PRECISION-LIMITED, and the DIAG3 L6 eps-ladder
 *   non-monotonicity (imp-97821) is NOT curable by tightening the bisection tolerance -- only
 *   extended precision (imp-124808 mpmath) can move it.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-124810 swept the ln N_L landmark-bisection stopping half-width TOL across
 *   decades (1e-9 .. 1e-18, plus TOL = 0 = run-to-machine-limit). While tolerance-limited
 *   (TOL ~ 1e-9 .. 1e-13) the round-off floor R falls ~one decade per decade of TOL -- the floor
 *   IS the bisection resolution. Once TOL <= ~1e-15, R saturates at the double-precision floor
 *   R_inf ~ 4.46e-13, identical to the TOL = 0 (imp-124769) machine-limit solve, and the induced
 *   crossover sigma_crit converges to ~1.27e-2, strictly between L6 (0.005) and L5 (0.02).
 *   (b) WHY IT IS NEW. imp-124769 measured R and sigma_crit at a single (implicit) machine-limit
 *   tolerance, leaving open whether a tighter solve could push sigma_crit below 0.005 and so
 *   explain away the L6 eps-ladder non-monotonicity. imp-124810 settles this by sweeping TOL
 *   explicitly and showing the floor is already saturated at the imp-124769 resolution.
 *   (c) WHY IT MATTERS. It fixes the interpretation of the L6 non-monotonicity for any later
 *   citation: it is a double-precision-limited artifact of the bisection solve, not a feature of
 *   the underlying sigma(N) model, and tightening the bisection tolerance cannot remove it.
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. This is a precision-vs-tolerance diagnostic on the
 *   inherited imp-3220/imp-3406 sigma(N) extrapolation, not a rigorous asymptotic; the C_mb
 *   GUE-conditional per imp-486 is untouched; establishes no operator positivity; imp-3066
 *   K_a >= 0 untouched.
 *   (e) STATUS: documentation only. No bound moved; no new coefficient pinned beyond re-citing
 *   the imp-124810 sweep; the rigorous anchor stays the trace ceiling; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   measurement. Not a new derivation. NO QED.
 *
 * @see imp-124810-bisection-tol-roundoff-floor-sweep.js (source: the TOL sweep and R_inf /
 *   sigma_crit saturation this headword names)
 * @see imp-124769-ecf-stencil-noise-floor-crossover (the original R ~ 4.5e-13 / sigma_crit ~ 0.013
 *   pin at the machine-limit solve)
 * @see imp-97821-diag3-sixth-landmark-crossvalidation (the L6 non-monotone eps-ladder diagnosed
 *   here as double-precision-limited)
 * @see imp-124808-extprec-pairratio-two-axis (mpmath extended precision -- the only lever that
 *   beats the double-precision floor)
 *
 * Ticket: imp-124864 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The bisection round-off floor headword, baked verbatim (no re-import of the heavy zeros bundle).
const BISECTION_ROUNDOFF_FLOOR_HEADWORD = Object.freeze({
  key: 'bisection-roundoff-floor-imp124810',
  term:
    'imp-124810 bisection round-off floor: R_inf ~ 4.46e-13 and sigma_crit ~ 1.27e-2 are ' +
    'double-precision-limited, not curable by tightening the landmark-bisection tolerance',
  definition:
    'Sweeping the ln N_L landmark-bisection stopping half-width TOL across decades (1e-9 .. ' +
    '1e-18, plus TOL = 0 = run-to-machine-limit) shows the round-off floor R tracks TOL linearly ' +
    'while tolerance-limited (TOL ~ 1e-9 .. 1e-13) but SATURATES at the double-precision floor ' +
    'R_inf ~ 4.46e-13 once TOL <= ~1e-15 -- identical to the TOL = 0 machine-limit (imp-124769) ' +
    'solve. The induced crossover sigma_crit saturates in lock-step at ~1.27e-2, strictly between ' +
    'the L6 (0.005) and L5 (0.02) DIAG3 eps-ladder rungs.',
  mechanism:
    'R ~ TOL / ln((1+eps)/(1-eps)) while tolerance-limited, so R is set by the bisection ' +
    'resolution itself, not by the model. Once TOL reaches the double-precision ULP of ln N_L ' +
    '(~1e-15), the bracket can no longer split and R floors at R_inf regardless of how much ' +
    'tighter TOL is requested: R(1e-15) = R(1e-16) = ... = R(0). Because sigma_crit is ' +
    'reconstructed from R via the fixed relTrunc plateau, sigma_crit floors in step with R and ' +
    'cannot be driven below 0.005 -- the L6 non-monotonicity is the bisection hitting its ' +
    'double-precision resolution limit, not a genuine feature of sigma(N).',
  verificationStatus:
    'Re-cited from the imp-124810 measurement module ' +
    '(src/data/imp-124810-bisection-tol-roundoff-floor-sweep.js): 7-point TOL ladder confirms R ' +
    'strictly decreases while tolerance-limited, saturates exactly at TOL <= 1e-15, and the ' +
    'saturated sigma_crit (~1.27e-2) lies strictly between 0.005 and 0.02 at every swept TOL. ' +
    'Naming / glossary headword only; supplies no new bound; the C_C 1/8 ansatz and ' +
    'E_trunc/E_flow component model are untouched; RH open; no refereed bound is changed' +
    '; NO QED.',
});

export const IMP124864_BISECTION_ROUNDOFF_FLOOR_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-124864',
  proofSection: 'S-frontier',
  glosses: 'imp-124810',
  question:
    'imp-124810 swept the landmark-bisection tolerance TOL and found the round-off floor R and ' +
    'the induced sigma_crit saturate at double precision -- what is the headword stating this ' +
    'honestly: sigma_crit is double-precision-limited and only extended precision moves the L6 ' +
    'non-monotonicity?',
  headword: BISECTION_ROUNDOFF_FLOOR_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-124810 result: the ' +
    'landmark-bisection round-off floor R saturates at R_inf ~ 4.46e-13 once the bisection ' +
    'tolerance TOL <= ~1e-15, identical to the TOL = 0 machine-limit (imp-124769) solve, and the ' +
    'induced sigma_crit saturates at ~1.27e-2 -- strictly between the L6 (0.005) and L5 (0.02) ' +
    'DIAG3 eps-ladder rungs. The L6 eps-ladder non-monotonicity is therefore a ' +
    'double-precision-limited artifact of the bisection solve, curable only by extended precision ' +
    '(imp-124808), not by tightening the bisection tolerance. No bound moved; the component model ' +
    'and all pinned surrogate constants are untouched; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-124810 (the TOL sweep and saturation verdict this glosses); imp-124769 (the original ' +
    'machine-limit R ~ 4.5e-13 / sigma_crit ~ 0.013 pin); imp-97821 (the L6 non-monotone ' +
    'eps-ladder); imp-124808 (mpmath extended precision -- the lever that beats the double-' +
    'precision floor).',
});

export default IMP124864_BISECTION_ROUNDOFF_FLOOR_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124864_BISECTION_ROUNDOFF_FLOOR_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp124864-headword-names-floor-and-sigma-crit',
    why: 'The headword must name both the saturated round-off floor R_inf and the saturated ' +
      'sigma_crit value -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP124864_BISECTION_ROUNDOFF_FLOOR_GLOSSARY_HEADWORD.headword;
      return (
        /4\.46e-13/.test(h.definition) &&
        /1\.27e-2/.test(h.definition) &&
        /double-precision/.test(h.mechanism) &&
        /0\.005/.test(h.definition)
      );
    },
  },
  {
    id: 'imp124864-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-124810.',
    holds: () =>
      IMP124864_BISECTION_ROUNDOFF_FLOOR_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP124864_BISECTION_ROUNDOFF_FLOOR_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP124864_BISECTION_ROUNDOFF_FLOOR_GLOSSARY_HEADWORD.verdict) &&
      IMP124864_BISECTION_ROUNDOFF_FLOOR_GLOSSARY_HEADWORD.glosses === 'imp-124810',
  },
];

for (const assertion of IMP124864_BISECTION_ROUNDOFF_FLOOR_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124864-bisection-roundoff-floor-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
