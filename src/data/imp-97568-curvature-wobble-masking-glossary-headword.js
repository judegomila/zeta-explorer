/**
 * @module imp-97568-curvature-wobble-masking-glossary-headword
 * @fileoverview imp-97568 -- import-light glossary/Concepts headword recording the imp-97460 exact
 *   curvature reduction r(x) = -(pi/2)[w(x) - w_lin(x)] and the wobble-masking obstruction it exposes:
 *   the wobble-averaged smooth curvature |kappa_smooth| <~ 1e-2 is an order of magnitude below the
 *   imp-97437 effective parameter kappa_eff = 0.0995, which is shown to be a wobble AMPLITUDE rather
 *   than a smooth curvature.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-97460 proved that the entire O(x^2)/O(x^2 log x) curvature of the Route M
 *   bulk profile f(x) = C(1+x) + (1/2)(1-x)log x - (pi/2)w(x) is carried EXACTLY by the cotangent-sum
 *   limit w(x): since the elementary parts C(1+x) and (1/2)(1-x)log x contribute nothing beyond O(x),
 *   the curvature remainder is r(x) = f(x) - f_lin(x) = -(pi/2)[w(x) - w_lin(x)], with w_lin(x) the
 *   small-x truncation forced by matching f -> f_lin at O(1), O(log x) and O(x).
 *   (b) THE WOBBLE-MASKING OBSTRUCTION. Wobble-averaging r(x)/x^2 over dense windows of the integer
 *   a = round(x b) at b = 100000 gives a smooth mean |kappa_smooth| <~ 1e-2 (sign-swinging, consistent
 *   with 0), buried under an arithmetic wobble of RMS ~4.1e-2 -- an order of magnitude larger. This
 *   masks any genuine smooth O(x^2) coefficient: it is not merely un-fitted (imp-97437) but genuinely
 *   small relative to the fluctuation riding on top of it.
 *   (c) WHY kappa_eff IS NOT THE CURVATURE. imp-97437's kappa_eff = 0.0995 was back-solved from the
 *   RELATIVE deviation (I - I_lin)/I at a single crossover realisation, which is set by the wobble
 *   AMPLITUDE reaching a fraction of the boundary-layer bulk -- not by the smooth curvature. So
 *   kappa_eff measures the ~4e-2 arithmetic fluctuation, ~10x the smooth mean it was assumed to
 *   approximate.
 *   (d) WHY IT STAYS OBSTRUCTED. Expanding w(x) by the sawtooth Fourier series localises it to two
 *   b -> oo scaling-limit endpoints: a smooth phi->0 endpoint whose next Laurent term first feeds
 *   O(x^2), and an arithmetic phi->1 endpoint carrying the phase frac(n x b). These enter at the SAME
 *   O(x^2) order, so no finite-b truncation isolates the smooth coefficient; pinning it needs the
 *   Bettin-Conrey reciprocity resummation of the frac(n x b) phases.
 *   (e) STATUS: documentation only. No analytic constant pinned, no bound moved, no operator
 *   positivity; the rigorous anchor stays the trace ceiling T = 2.594e7 (compute binds first, N ~
 *   9916, imp-96352).
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   result. Not a new derivation. NO QED.
 *
 * @see imp-97460-route-m-bulk-profile-curvature-analytic-route.js (source: the exact curvature
 *   reduction and wobble-masking measurement this headword names)
 * @see imp-97437-route-m-bulk-profile-curvature-crossover (source of kappa_eff = 0.0995, shown here
 *   to be a wobble amplitude, not the smooth curvature)
 * @see imp-97419-route-m-uniform-profile-crossover-scale (crossover linear in b; curvature left
 *   underived before imp-97460)
 *
 * Ticket: imp-97568 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; Platt-Trudgian Lambda <= 0.2 SOTA.
 */

// The curvature-reduction / wobble-masking headword, baked verbatim (no re-import).
const CURVATURE_WOBBLE_MASKING_HEADWORD = Object.freeze({
  key: 'route-m-curvature-wobble-masking-imp97460',
  term:
    'curvature-wobble masking: the exact reduction r(x) = -(pi/2)[w(x) - w_lin(x)] of the Route M ' +
    'bulk-profile curvature, and the finding that kappa_eff = 0.0995 is a wobble AMPLITUDE, not the ' +
    'smooth curvature it was assumed to approximate',
  definition:
    'For the Route M bulk profile f(x) = C(1+x) + (1/2)(1-x)log x - (pi/2)w(x), the O(x^2)/O(x^2 log x) ' +
    'curvature remainder r(x) = f(x) - f_lin(x) reduces EXACTLY to -(pi/2)[w(x) - w_lin(x)], where ' +
    'w_lin(x) = (2C/pi) + (1/pi)log x - (1/pi)x is the small-x truncation of the cotangent-sum limit ' +
    'w(x) forced by matching f to its linearisation f_lin. Wobble-averaging r(x)/x^2 over thousands of ' +
    'integer a = round(x b) at b = 100000 gives a smooth mean |kappa_smooth| <~ 1e-2 (sign-swinging), ' +
    'an order of magnitude below the wobble RMS ~4.1e-2 and below the imp-97437 effective parameter ' +
    'kappa_eff = 0.0995.',
  mechanism:
    'The elementary parts of f carry no O(x^2) term, so ALL curvature lives in w(x). Expanding w(x) by ' +
    'the sawtooth Fourier series localises it to two endpoints of the b -> oo scaling limit: a smooth ' +
    'phi->0 endpoint (cot ~ 1/(pi phi)) whose next Laurent term -(pi phi)/3 first feeds O(x^2), and an ' +
    'arithmetic phi->1 endpoint carrying the phase frac(n x b) -- the wobble. Because these enter at ' +
    'the SAME O(x^2) order, no finite-b truncation isolates the smooth coefficient; kappa_eff, ' +
    'back-solved from a single crossover realisation, in fact measures the wobble amplitude reaching a ' +
    'fraction of the boundary-layer bulk, not the underlying smooth curvature.',
  verificationStatus:
    'Re-cited from the imp-97460 derivation module ' +
    '(src/data/imp-97460-route-m-bulk-profile-curvature-analytic-route.js): the algebraic reduction is ' +
    'verified to 1e-12, and the wobble-vs-mean measurement (b = 100000, thousands of samples per window) ' +
    'shows |mean(r/x^2)| < rms in every tested window x in {0.05,0.1,0.15,0.2}, with mean sign-swinging ' +
    'across windows. Pins no analytic constant; isolating the smooth coefficient needs the ' +
    'Bettin-Conrey reciprocity resummation, unavailable termwise at finite b. Naming / glossary ' +
    'headword only; supplies no new bound; RH open; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
});

export const IMP97568_CURVATURE_WOBBLE_MASKING_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97568',
  proofSection: 'Route-M',
  glosses: 'imp-97460',
  question:
    'imp-97460 reduced the Route M bulk-profile curvature EXACTLY to r(x) = -(pi/2)[w(x) - w_lin(x)] ' +
    'and showed the wobble-averaged smooth curvature |kappa_smooth| <~ 1e-2 sits an order of magnitude ' +
    'below the imp-97437 effective parameter kappa_eff = 0.0995. What is the headword for this ' +
    'curvature-reduction / wobble-masking result?',
  headword: CURVATURE_WOBBLE_MASKING_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97460 exact curvature ' +
    'reduction r(x) = -(pi/2)[w(x) - w_lin(x)] and the wobble-masking obstruction it exposes: ' +
    '|kappa_smooth| <~ 1e-2, an order of magnitude below both the wobble RMS ~4.1e-2 and the imp-97437 ' +
    'effective parameter kappa_eff = 0.0995, which is shown to measure the wobble amplitude rather than ' +
    'the smooth curvature. No analytic constant pinned; no bound moved; NO QED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97460 (the exact reduction and wobble-masking measurement this glosses); imp-97437 (source of ' +
    'kappa_eff = 0.0995, reinterpreted here as a wobble amplitude); imp-97419 (crossover scale left ' +
    'the curvature underived before imp-97460).',
});

export default IMP97568_CURVATURE_WOBBLE_MASKING_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97568_CURVATURE_WOBBLE_MASKING_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97568-headword-names-reduction-and-masking',
    why: 'The headword must name the exact curvature reduction formula, the wobble-averaged bound, ' +
      'and the kappa_eff = 0.0995 reinterpretation -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP97568_CURVATURE_WOBBLE_MASKING_GLOSSARY_HEADWORD.headword;
      return (
        /w_lin\(x\)/.test(h.definition) &&
        /kappa_eff = 0\.0995/.test(h.definition) &&
        /1e-2/.test(h.definition) &&
        /frac\(n x b\)/.test(h.mechanism) &&
        /wobble amplitude/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97568-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, PT SOTA line present, glosses imp-97460.',
    holds: () =>
      IMP97568_CURVATURE_WOBBLE_MASKING_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97568_CURVATURE_WOBBLE_MASKING_GLOSSARY_HEADWORD.verdict) &&
      /remains SOTA/.test(IMP97568_CURVATURE_WOBBLE_MASKING_GLOSSARY_HEADWORD.verdict) &&
      IMP97568_CURVATURE_WOBBLE_MASKING_GLOSSARY_HEADWORD.glosses === 'imp-97460',
  },
];

for (const assertion of IMP97568_CURVATURE_WOBBLE_MASKING_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97568-curvature-wobble-masking-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
