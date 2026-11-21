/**
 * @module imp-96767-krein-composite-wall-glossary-headword
 * @fileoverview imp-96767 -- import-light glossary/Concepts headword for the
 *   imp-96732 reading: the Route I Krein sigma_2 interval-rigorous reach
 *   2a <= 0.96 is a COMPOSITE wall -- solver-limited below 2a = 1.0 (extended
 *   precision may plausibly recover a rung there, unverified) but INTRINSIC
 *   (certified design margin vanished) at and above 2a = 1.0, with ln 3 out of
 *   reach for the finite-certificate route at any working precision.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96646 / the rh-route-i-toeplitz-krein-certificate-2026-09-24 source
 *   record that the interval-verified sigma_2 certificate stalls at 2a = 0.96,
 *   with two projected walls near 2a = 1.0: the certified LP design margin
 *   eps(2a) = 200(1 - 2a) decaying to zero, and the tail l1-norm blow-up
 *   log10(l1) ~ 73.254*(2a) - 64.238 entering the double-precision HiGHS
 *   conditioning band. imp-96732 asks which wall is reached first and answers
 *   it by evaluating both baked fits rung-by-rung across 2a in
 *   {0.96, 0.98, 0.99, 1.00, 1.0134, ln3}. This headword bakes that verdict
 *   verbatim (no re-import of the imp-96732 module, to stay import-light) as a
 *   standalone quick-lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The certified design margin eps(2a) = 200(1 - 2a) hits zero at 2a = 1.0,
 *   while the projected tail l1-norm there is still only ~1.0e9 (~30 mantissa
 *   bits, well inside double range) -- the margin wall is reached FIRST. The
 *   catastrophic l1 -> 1.73e16 (~54 bits) blow-up only arrives by ln 3, where
 *   the margin has already gone deeply negative (eps ~ -19.7). So: for
 *   0.96 < 2a < 1.0 the stall is PLAUSIBLY a solver-conditioning artifact
 *   (margin still positive, l1 modest -- UNVERIFIED whether extended precision
 *   actually recovers a rung such as 2a = 0.98); at and above 2a = 1.0 the wall
 *   is INTRINSIC (the certified margin has genuinely vanished, so there is
 *   nothing left for higher precision to certify); and ln 3 is
 *   precision-independently blocked for this route because eps(ln3) < 0.
 *
 *   STATUS: an assessment / projection synthesis from two already-baked fits,
 *   not a new extended-precision LP solve (none was run).
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96732 verdict for quick
 *   reference. It establishes nothing, instantiates no interval, closes no
 *   sub-gap, moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-96732-krein-extended-precision-reach-assessment (source: the finding this glosses)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24 (source literals: normGrowthLaw, epsMarginDecay, analyticObstruction, lpWallIsSymptom)
 * @see imp-96665-ecoll-count-model-gap-featureless-powerlaw-glossary-headword (the headword pattern this follows)
 *
 * Ticket: imp-96767 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The composite-wall headword, baked verbatim (no re-import).
const KREIN_COMPOSITE_WALL_HEADWORD = Object.freeze({
  key: 'krein-sigma2-composite-wall-solver-vs-intrinsic',
  term:
    'imp-96732 verdict: the Route I Krein sigma_2 interval-rigorous reach ' +
    '2a <= 0.96 is a COMPOSITE wall -- solver-limited below 2a = 1.0, ' +
    'intrinsic (margin-vanishing) at and above 2a = 1.0',
  definition:
    'imp-96646 stalls the interval-verified sigma_2 certificate at 2a = 0.96, ' +
    'with two projected walls near 2a = 1.0: the certified LP design margin ' +
    'eps(2a) = 200(1 - 2a) decaying to zero, and the tail l1-norm blow-up ' +
    'entering the double-precision HiGHS conditioning band. imp-96732 finds ' +
    'the eps-margin wall is reached FIRST (at 2a = 1.0 the margin is already ' +
    'zero while l1 is still modest), so the honest split is: for ' +
    '0.96 < 2a < 1.0 the stall is plausibly a removable solver-conditioning ' +
    'artifact (unverified); at and above 2a = 1.0 the wall is intrinsic ' +
    'because the certified margin has genuinely vanished, leaving nothing for ' +
    'higher precision to certify.',
  mechanism:
    'eps(2a) = 200*(1 - 2a) [from EPS_INTERCEPT=200, EPS_SLOPE_PER_UNIT=-200] ' +
    'vanishes at 2a = 1.0 (eps = 4.0 at 2a = 0.98, eps = 2.0 at 2a = 0.99, ' +
    'eps = 0.0 at 2a = 1.00), while the projected tail l1-norm ' +
    '10^(73.254*(2a) - 64.238) is only ~1.0e9 (~30 mantissa bits) at 2a = 1.0 -- ' +
    'well inside the 53-bit double range. The l1-norm only explodes to ' +
    '~1.73e16 (~54 bits) by 2a = ln3 = 1.0986122886681098, where eps has ' +
    'already gone deeply negative (eps ~ -19.7). So the double-precision ' +
    'HiGHS stall observed at 2a >= 1.0 is driven by the vanishing feasibility ' +
    'slack, not primarily by l1 magnitude. Across the sub-window ' +
    '0.96 < 2a < 1.0 the margin stays strictly positive and l1 stays modest ' +
    '(3.6e7 at 2a = 0.98, 1.9e8 at 2a = 0.99; ~25-28 bits) -- plausibly within ' +
    'reach of an extended-precision (double-double, 106-bit) or ' +
    'rescaled/preconditioned LP solve, but no such solve was run here ' +
    '(sub-gap IMP96732_EXTPREC_098_RUNG_UNVERIFIED). ln 3 is blocked at any ' +
    'precision because eps(ln3) < 0: the finite trig-polynomial certificate ' +
    'has negative design margin there, so there is no positive margin for a ' +
    'higher-precision solver to certify.',
  verificationStatus:
    'Assessment / projection synthesis from two already-baked fits ' +
    '(normGrowthLaw, epsMarginDecay), not a new extended-precision LP solve ' +
    '(none run). Changes no bound; the interval-rigorous reach stays exactly ' +
    '2a <= 0.96; the true operator lambda_min(T_a[sigma_2]) may still persist ' +
    'positive past 2a = 1.0, but that is the separate uniform-in-N ' +
    'spectral-gap / de Branges existence question, not an arithmetic-precision ' +
    'one; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96767_KREIN_COMPOSITE_WALL_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96767',
  proofSection: 'S-frontier',
  glosses: 'imp-96732',
  question:
    'imp-96646 stalled the Route I Krein sigma_2 interval-rigorous reach at ' +
    '2a = 0.96, with two projected walls near 2a = 1.0 (the LP design margin ' +
    'and the tail l1-norm blow-up). Which wall is reached first, and is the ' +
    '2a = 0.96 stall a removable solver artifact or an intrinsic vanishing of ' +
    'the certified margin?',
  headword: KREIN_COMPOSITE_WALL_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the ' +
    'imp-96732 verdict: the wall is COMPOSITE -- SOLVER-limited for ' +
    '0.96 < 2a < 1.0 (design margin still positive, extended/exact precision ' +
    'could plausibly recover a rung such as 2a = 0.98, UNVERIFIED), but ' +
    'INTRINSIC (certified design margin eps(2a) = 200(1 - 2a) <= 0) at and ' +
    'above 2a = 1.0, with ln 3 precision-independently blocked for the ' +
    'finite-certificate route because eps(ln3) < 0. Establishing true operator ' +
    'positivity past 2a = 1.0 is the separate uniform-in-N spectral-gap ' +
    'question. Establishes nothing; instantiates no interval; moves no bound; ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-96732 (the extended-precision reach assessment this glosses); ' +
    'imp-96646 / rh-route-i-toeplitz-krein-certificate-2026-09-24 (source ' +
    'literals: normGrowthLaw, epsMarginDecay, analyticObstruction, lpWallIsSymptom).',
});

export default IMP96767_KREIN_COMPOSITE_WALL_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96767_KREIN_COMPOSITE_WALL_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96767-headword-has-required-fields',
    why: 'The headword must name the two walls, the order they are reached, ' +
      'and the solver-limited-vs-intrinsic split -- the entire point of the ' +
      'glossary entry.',
    holds: () => {
      const h = IMP96767_KREIN_COMPOSITE_WALL_GLOSSARY_HEADWORD.headword;
      return (
        /200\*\(1 - 2a\)/.test(h.mechanism) &&
        /1\.73e16/.test(h.mechanism) &&
        /IMP96732_EXTPREC_098_RUNG_UNVERIFIED/.test(h.mechanism) &&
        /vanishing feasibility slack/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96767-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96767_KREIN_COMPOSITE_WALL_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96767_KREIN_COMPOSITE_WALL_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96767_KREIN_COMPOSITE_WALL_GLOSSARY_HEADWORD.verdict) &&
      IMP96767_KREIN_COMPOSITE_WALL_GLOSSARY_HEADWORD.glosses === 'imp-96732',
  },
];

for (const assertion of IMP96767_KREIN_COMPOSITE_WALL_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96767-krein-composite-wall-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
