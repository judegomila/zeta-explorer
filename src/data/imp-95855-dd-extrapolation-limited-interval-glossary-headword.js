/**
 * @module imp-95855-dd-extrapolation-limited-interval-glossary-headword
 * @fileoverview imp-95855 -- import-light glossary/Concepts headword for the
 *   imp-95826 audit finding that the imp-95767 dual-vs-primal certified
 *   interval is DD-EXTRAPOLATION-LIMITED: its half-width is dominated
 *   entirely by the double-double finite-grid extrapolation uncertainty
 *   u_fit, with the dual quadrature uncertainty u_opt negligible by many
 *   orders of magnitude.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95826 tabulated u_fit / u_opt at all three worked deltas and found
 *   the ratio exceeds 1e10 everywhere a DD extrapolation grid exists
 *   (~1.29e12 at ln 1.3, ~4.3e10 at ln 1.5). A reader landing on that module
 *   cold has no quick-lookup definition of what "DD-extrapolation-limited"
 *   means, why u_opt is delta-independent, or why that distinction matters
 *   (it says the certified interval's width is a finite-grid-reach artifact,
 *   not evidence of a real disagreement between the dual and primal
 *   computations). This headword bakes those facts VERBATIM (no re-import
 *   of the imp-95826 module, to stay import-light) as a standalone lookup
 *   entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The imp-95767 certified interval r = (A_fit - A_opt) / A_opt has a
 *   half-width built from two independent uncertainty sources added in
 *   quadrature (or as an envelope): u_fit, the spread of the double-double
 *   Jacobi finite-grid extrapolation fit A_fit(N) -> A_fit(infinity), and
 *   u_opt, the rounding uncertainty of the dual quadrature A_opt. "DD-
 *   extrapolation-limited" means u_fit >> u_opt, so essentially the ENTIRE
 *   interval half-width comes from not having pushed the DD Jacobi grid far
 *   enough -- not from any genuine tension between the two independent
 *   computations of the same quantity.
 *
 *   WHY u_opt IS DELTA-INDEPENDENT: the dual A_opt = (4 pi / delta) *
 *   sum_n sech(pi^2 (2n+1) / delta) is a sum of tiny POSITIVE terms with NO
 *   cancellation, so it carries none of the catastrophic-cancellation risk
 *   that limits the primal side. Its n >= 1 tail relative to the n = 0 term
 *   decays like e^{-2 pi^2 / delta}, which sits far below the 8-ULP
 *   float64 rounding floor (~1.78e-15) at every worked delta (ln 1.5, ln
 *   1.3, ln 1.2). A_opt therefore equals its single n = 0 term to float64
 *   rounding at all three deltas, pinning u_opt_rel = 8 * eps universally --
 *   a constant set by float64 rounding, not by the seam spacing delta.
 *
 *   WHY u_fit DOMINATES: u_fit comes from extrapolating a finite double-
 *   double Jacobi grid (a handful of N values) to the N -> infinity limit
 *   via a fit-model + leave-one-out envelope (or, where too few grid points
 *   exist, a coarser reach-convergence spread). That extrapolation
 *   uncertainty is orders of magnitude larger than the few-ULP u_opt because
 *   it is limited by how far the O(N^3) double-double solve can practically
 *   reach, not by any fundamental precision floor.
 *
 * @see imp-95826-dual-primal-dd-extrapolation-limited-per-delta-audit (source: the audit this glosses)
 * @see imp-95767-dual-primal-agreement-interval (the certified interval whose structure is decomposed)
 * @see imp-95761-szego-coefficient-larger-grid-subpct (the DD extrapolation grids feeding u_fit)
 *
 * Ticket: imp-95855 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The DD-extrapolation-limited interval headword, baked verbatim (no re-import).
const DD_EXTRAPOLATION_LIMITED_INTERVAL_HEADWORD = Object.freeze({
  key: 'dd-extrapolation-limited-certified-interval',
  term:
    'DD-extrapolation-limited certified interval ' +
    '(u_fit dominates u_opt in the dual-vs-primal agreement audit)',
  definition:
    'A diagnostic label for a certified interval whose half-width is ' +
    'built from two independent uncertainty sources -- u_fit, the double-' +
    'double finite-grid extrapolation spread, and u_opt, the dual ' +
    'quadrature rounding uncertainty -- in which u_fit dominates u_opt by ' +
    'many orders of magnitude, so essentially the entire interval width ' +
    'reflects how far the finite-grid extrapolation has been pushed, not ' +
    'a genuine disagreement between the two independent computations.',
  mechanism:
    'The dual A_opt is a cancellation-free sum of tiny positive terms ' +
    'whose n >= 1 tail decays like e^{-2 pi^2 / delta}, sitting far below ' +
    'the 8-ULP float64 rounding floor (~1.78e-15) at every worked delta; ' +
    'A_opt therefore equals its single n = 0 term to float64 rounding and ' +
    'u_opt_rel = 8 * eps is fixed by float64 rounding alone, independent ' +
    'of delta. The primal A_fit, by contrast, is extrapolated from a ' +
    'finite double-double Jacobi grid via a fit-model + leave-one-out ' +
    'envelope (or a coarser reach-convergence spread where too few grid ' +
    'points exist), and that extrapolation uncertainty is limited only by ' +
    'how far the O(N^3) double-double solve can practically reach -- ' +
    'orders of magnitude larger than the few-ULP u_opt.',
  measuredRatios:
    'u_fit / u_opt exceeds 1e10 at every delta with a baked DD ' +
    'extrapolation grid: ~1.29e12 at ln 1.3 (proper 5-point fit-model + ' +
    'leave-one-out envelope) and ~4.3e10 at ln 1.5 (reach-convergence ' +
    'surrogate over 4 extended-grid rows); at ln 1.2 only a 2-point DD ' +
    'probe is baked, too few for either envelope, so u_fit is not ' +
    'recomputable there and the same structure is only EXPECTED via ' +
    'reach-universality, not directly confirmed.',
  interpretation:
    'DD-extrapolation-limited means the certified interval width is a ' +
    'pure artifact of finite double-double grid reach, not evidence that ' +
    'the dual and primal computations of the same quantity actually ' +
    'disagree -- tightening the interval requires pushing the DD ' +
    'extrapolation grid further, not resolving any real tension between ' +
    'the two sides.',
});

export const IMP95855_DD_EXTRAPOLATION_LIMITED_INTERVAL_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95855',
  proofSection: 'S-frontier',
  glosses: 'imp-95826',
  question:
    'imp-95826 showed the imp-95767 dual-vs-primal certified interval half-' +
    'width is dominated entirely by u_fit (the DD finite-grid extrapolation ' +
    'uncertainty), with u_opt (the dual quadrature uncertainty) negligible ' +
    'and delta-independent. What does "DD-extrapolation-limited" mean, why ' +
    'is u_opt delta-independent, and why does that distinction matter, for ' +
    'a reader landing on that module cold?',
  headword: DD_EXTRAPOLATION_LIMITED_INTERVAL_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the ' +
    'imp-95826 decomposition: u_opt is fixed at 8 * eps (float64 rounding ' +
    'of a cancellation-free positive sum) independent of delta because the ' +
    'dual tail sits far below the 8-ULP floor at every worked delta, while ' +
    'u_fit -- the finite double-double Jacobi grid extrapolation spread -- ' +
    'exceeds it by more than 1e10 wherever a grid is baked, making the ' +
    'certified interval width a pure DD-grid-reach artifact rather than a ' +
    'real dual-vs-primal disagreement. Establishes nothing; instantiates ' +
    'no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-95826 (the per-delta audit and measured u_fit/u_opt ratios this ' +
    'glosses); imp-95767 (the certified interval whose structure is ' +
    'decomposed); imp-95761 (the DD extrapolation grids feeding u_fit).',
});

export default IMP95855_DD_EXTRAPOLATION_LIMITED_INTERVAL_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95855_DD_EXTRAPOLATION_LIMITED_INTERVAL_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95855-headword-has-required-fields',
    why: 'The headword must name the u_fit-vs-u_opt decomposition, the 8*eps delta-independent floor, and the measured >1e10 ratios -- the entire point of the glossary entry.',
    holds: () => {
      const h = DD_EXTRAPOLATION_LIMITED_INTERVAL_HEADWORD;
      return (
        /u_fit/.test(h.definition) &&
        /8 \* eps/.test(h.mechanism) &&
        /1\.29e12/.test(h.measuredRatios) &&
        /artifact/i.test(h.interpretation)
      );
    },
  },
  {
    id: 'imp95855-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95855_DD_EXTRAPOLATION_LIMITED_INTERVAL_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95855_DD_EXTRAPOLATION_LIMITED_INTERVAL_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95855_DD_EXTRAPOLATION_LIMITED_INTERVAL_GLOSSARY_HEADWORD.verdict) &&
      IMP95855_DD_EXTRAPOLATION_LIMITED_INTERVAL_GLOSSARY_HEADWORD.glosses === 'imp-95826',
  },
];

for (const assertion of IMP95855_DD_EXTRAPOLATION_LIMITED_INTERVAL_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95855-dd-extrapolation-limited-interval-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
