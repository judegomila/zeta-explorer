/**
 * @module imp-124957-knee-locator-gap-glossary-headword
 * @fileoverview imp-124957 -- import-light glossary/Concepts headword recording the
 *   imp-124814/imp-124826/imp-124847 finding: the knee floor-elasticity exponent p_knee on the
 *   imp-97822/imp-33708 sigma-ramp model has TWO distinct, equally well-fit locator definitions
 *   that disagree by a small but persistent ~0.0335 gap -- exponent-curvature locates
 *   p_knee ~ -2.1064, ramp-inflection locates p_knee ~ -2.073 -- and the gap survives both grid
 *   refinement (imp-124826) and a structurally different stencil family (imp-124847).
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. On the imp-33708 ten-floor ladder {0.5,0.75,0.9,1.0,1.1,1.25,1.5,2.0,3.0,5.0},
 *   two locators for the knee exponent p(d) = -d ln sigma/d ln N both achieve OLS R^2 ~ 0.99999
 *   but land on different values: (A) exponent-curvature -- the zero-crossing of
 *   d^2 p/d(log10 N)^2 -- gives p_knee ~ -2.1064; (B) ramp-inflection -- the zero-crossing of
 *   d^2 sigma/d(log10 N)^2, the inflection of sigma itself rather than of its exponent -- gives
 *   p_knee ~ -2.073. The two differ by ~0.0335.
 *   (b) WHY THE GAP SURVIVES SCRUTINY. imp-124826 re-ran both locators across a 4-step
 *   resolution-refinement ladder (scan step 0.0025 -> 0.001, stencils tripled): each locator's own
 *   slope drifted by less than 3e-5, and the gap held flat at ~0.0335 -- it is refinement-stable,
 *   not a coarse-grid artifact. imp-124847 re-derived both locators on a structurally different
 *   5-point O(h^4) stencil on a non-commensurate, offset grid and still measured ~0.0335 --
 *   stencil-form-stable. The gap is therefore a genuine property of the two definitions
 *   (curvature-of-the-exponent vs curvature-of-sigma-itself are not the same zero-crossing), not
 *   a numerical artifact of either.
 *   (c) WHY IT IS NEW. Prior single-locator measurements (e.g. the imp-97822 two-floor chord
 *   -2.099 and the imp-33684 interior-peak contrast -1.375, certified at -1.412 by imp-124848)
 *   each picked one locator without flagging that a second, equally valid definition exists and
 *   disagrees. imp-124814 is the first to compute both side by side and expose the gap; imp-124826
 *   and imp-124847 are the first to show it is not an artifact of grid or stencil choice.
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. This is a measurement/definitional diagnostic on the
 *   imp-97644/imp-97689 crossing-elasticity model's knee-exponent machinery. Both -2.1064 and
 *   -2.073 sit in the same "clean dimensional ~ -2" band as the imp-97822 chord; no operator
 *   positivity is established and no coefficient feeding the trace ceiling is touched.
 *   (e) STATUS: documentation only. No bound moved; whether the ~0.0335 offset is a fixed
 *   additive constant across all ten floors or drifts per-floor is the OPEN question left to
 *   imp-124971 (not yet answered, cited here only as a forward pointer); NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   measurement. Not a new derivation. NO QED.
 *
 * @see imp-124814-knee-floor-elasticity-fresh-locator-repro.js (source: first side-by-side measurement of both locators)
 * @see imp-124826-knee-locator-gap-grid-refinement.js (refinement-stability check)
 * @see imp-124847-knee-locator-gap-thirdgrid-stencil-form.js (stencil-form-stability check)
 * @see imp-97822-sigma-knee-etrunc-floor-elasticity.js (the single-locator chord -2.099 this gap sits alongside)
 *
 * Ticket: imp-124957 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; Platt-Trudgian Lambda <= 0.2 SOTA.
 */

// The two-definition p_knee locator-gap headword, baked verbatim (no re-import of the heavy zeros bundle).
const KNEE_LOCATOR_GAP_HEADWORD = Object.freeze({
  key: 'knee-locator-gap-imp124814',
  term:
    'p_knee two-definition locator gap: exponent-curvature (zero-crossing of d^2p/d(log10 N)^2) ' +
    'gives p_knee ~ -2.1064, while ramp-inflection (zero-crossing of d^2 sigma/d(log10 N)^2) ' +
    'gives p_knee ~ -2.073 -- a ~0.0335 gap that is grid- and stencil-form-stable',
  definition:
    'On the imp-33708 ten-floor ladder, two locators for the knee floor-elasticity exponent ' +
    'p(d) = -d ln sigma/d ln N both fit the log10 N* vs log10 E_trunc OLS line at R^2 ~ 0.99999 ' +
    'but disagree: exponent-curvature locates the zero-crossing of the SECOND derivative of the ' +
    'exponent itself (p_knee ~ -2.1064); ramp-inflection instead locates the inflection point of ' +
    'sigma directly (p_knee ~ -2.073). The two definitions are not the same zero-crossing, and the ' +
    'gap between them is ~0.0335.',
  mechanism:
    'imp-124826 reran both locators across a 4-step resolution-refinement ladder (scan step ' +
    '0.0025 -> 0.001, stencils tripled): each locators own slope moved by less than 3e-5 and the ' +
    'gap held flat at ~0.0335, so it is not a coarse-grid artifact. imp-124847 rebuilt both ' +
    'locators on a structurally different 5-point O(h^4) stencil on a non-commensurate offset ' +
    'grid and again measured ~0.0335, so the gap is stencil-form-stable, not an artifact of any ' +
    'one finite-difference family. The gap is a genuine consequence of curvature-of-the-exponent ' +
    'and curvature-of-sigma-itself being distinct definitions, not a numerical-noise effect.',
  verificationStatus:
    'Re-cited from the imp-124814/imp-124826/imp-124847 measurement modules: p_knee ~ -2.1064 ' +
    '(exponent-curvature), p_knee ~ -2.073 (ramp-inflection), gap ~0.0335, refinement-stable and ' +
    'stencil-form-stable. Naming / glossary headword only; supplies no new bound; whether the gap ' +
    'is a fixed additive constant across all ten imp-33708 floors remains open (imp-124971, not ' +
    'yet answered); RH open; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
});

export const IMP124957_KNEE_LOCATOR_GAP_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-124957',
  proofSection: 'S-frontier',
  glosses: 'imp-124814',
  question:
    'imp-124814 found that two equally well-fit locators for the knee exponent p_knee -- ' +
    'exponent-curvature and ramp-inflection -- disagree by ~0.0335, and imp-124826/imp-124847 ' +
    'showed the gap survives grid refinement and a different stencil family -- what is the ' +
    'headword for this two-definition locator gap?',
  headword: KNEE_LOCATOR_GAP_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-124814 result: the knee ' +
    'floor-elasticity exponent p_knee has two distinct locator definitions -- exponent-curvature ' +
    '(p_knee ~ -2.1064) and ramp-inflection (p_knee ~ -2.073) -- separated by a ~0.0335 gap that ' +
    'imp-124826 confirmed is grid-refinement-stable and imp-124847 confirmed is stencil-form-' +
    'stable. No bound moved; whether the gap is a fixed per-floor constant is left open to ' +
    'imp-124971; NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-124814 (first side-by-side measurement of both locators); imp-124826 (grid-refinement ' +
    'stability check); imp-124847 (stencil-form stability check); imp-97822 (the single-locator ' +
    'chord -2.099 this gap sits alongside); imp-124971 (open question: is the gap a fixed ' +
    'per-floor constant).',
});

export default IMP124957_KNEE_LOCATOR_GAP_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124957_KNEE_LOCATOR_GAP_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp124957-headword-names-both-locators',
    why: 'The headword must name both locator values and the gap between them -- ' +
      'the entire content of the glossary entry.',
    holds: () => {
      const h = IMP124957_KNEE_LOCATOR_GAP_GLOSSARY_HEADWORD.headword;
      return (
        /-2\.1064/.test(h.term) &&
        /-2\.073/.test(h.term) &&
        /0\.0335/.test(h.term) &&
        /exponent-curvature/.test(h.definition) &&
        /ramp-inflection/.test(h.definition) &&
        /stencil-form/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp124957-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, PT SOTA line present, glosses imp-124814.',
    holds: () =>
      IMP124957_KNEE_LOCATOR_GAP_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP124957_KNEE_LOCATOR_GAP_GLOSSARY_HEADWORD.verdict) &&
      /remains SOTA/.test(IMP124957_KNEE_LOCATOR_GAP_GLOSSARY_HEADWORD.verdict) &&
      IMP124957_KNEE_LOCATOR_GAP_GLOSSARY_HEADWORD.glosses === 'imp-124814',
  },
];

for (const assertion of IMP124957_KNEE_LOCATOR_GAP_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124957-knee-locator-gap-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
