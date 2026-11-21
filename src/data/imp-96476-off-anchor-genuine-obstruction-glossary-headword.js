/**
 * @module imp-96476-off-anchor-genuine-obstruction-glossary-headword
 * @fileoverview imp-96476 -- import-light glossary/Concepts headword restating the
 *   imp-96450 verdict: the systematic below-line off-anchor residual left by the
 *   imp-96345 seven-anchor reciprocal-log line is a GENUINE off-anchor obstruction,
 *   not a missing-curvature artifact -- adding a second reciprocal-log term makes
 *   the residual WORSE, not better.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96345 fit the seven imp-96148 on-line anchors with a one-parameter
 *   reciprocal-log line rho = C + D/lnT and found the 27 imp-96224 off-anchor
 *   heights sit systematically BELOW it (23/27 negative, mean -0.03052, worst
 *   -0.06081). That leaves an open question: is the below-line structure just
 *   missing curvature in the linear-in-1/lnT model (curable by a second term), or
 *   a genuine off-anchor obstruction the seven anchors cannot see? imp-96450
 *   answered this by refitting the SAME seven anchors with a two-term law
 *   rho = C + D/lnT + E/lnT^2 and re-scoring the same 27 off-anchor points. This
 *   headword bakes the imp-96450 verdict verbatim (no re-import of the imp-96450
 *   module, to stay import-light) as a standalone quick-lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   Refitting the seven imp-96148 anchors with a second reciprocal-log term wants
 *   POSITIVE curvature (E=+5.1662, concave up in x=1/lnT), which raises the
 *   intercept 0.14256 -> 0.35802 and flattens the slope 2.50166 -> 0.37633. That
 *   curvature improves the seven-anchor training RMS only marginally
 *   (0.005810 -> 0.004946, the expected effect of one extra degree of freedom) but
 *   bends the extrapolation UPWARD at high T -- exactly opposite to where the
 *   off-anchor margins actually fall. The off-anchor residual RMS GROWS
 *   0.037482 -> 0.061374 (+64%), the mean deepens -0.030525 -> -0.053877, the
 *   worst deepens -0.060812 -> -0.096634 (still at T=4506.31), and the sign bias
 *   worsens from 23/27 below the line to a unanimous 27/27 below. So a second
 *   reciprocal-log term does not merely fail to help -- it actively amplifies the
 *   below-line residual it was meant to absorb.
 *
 *   STATUS: a naming/classification headword restating the imp-96450 measurement,
 *   not a fresh derivation.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96450 verdict for quick reference.
 *   It establishes nothing, instantiates no interval, closes no sub-gap, moves no
 *   bound. NO QED. No refereed bound is changed.
 *
 * @see imp-96450-two-param-reciprocal-log-off-anchor-residual (source: the measurement this glosses)
 * @see imp-96345-route-bd-offline-margin-envelope (the one-parameter line + original below-line residual)
 * @see imp-96224-route-bd-online-margin-floor-gamma4000 (source measured off-anchor column)
 * @see imp-96377-off-anchor-residual-scatter-viz-data (per-point sign tags)
 *
 * Ticket: imp-96476 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The off-anchor genuine-obstruction headword, baked verbatim
// (no re-import of the imp-96450 module).
const OFF_ANCHOR_GENUINE_OBSTRUCTION_HEADWORD = Object.freeze({
  key: 'off-anchor-genuine-obstruction-not-missing-curvature',
  term:
    'The imp-96450 verdict: the systematic below-line off-anchor residual in the ' +
    'imp-96345 seven-anchor reciprocal-log line is a GENUINE off-anchor ' +
    'obstruction, not a missing-curvature artifact -- a second reciprocal-log ' +
    'term refit on the same seven anchors AMPLIFIES the residual instead of ' +
    'removing it',
  definition:
    'imp-96345 fit the seven imp-96148 on-line anchors with a one-parameter line ' +
    'rho = C + D/lnT and found the 27 imp-96224 off-anchor heights sit ' +
    'systematically below it (23/27 negative, mean -0.03052, worst -0.06081). ' +
    'imp-96450 tested whether that below-line structure is curable by adding a ' +
    'second reciprocal-log term, rho = C + D/lnT + E/lnT^2, refit on the SAME ' +
    'seven anchors. The two-term fit wants POSITIVE curvature (E=+5.1662), ' +
    'raising the intercept 0.14256 -> 0.35802 and flattening the slope ' +
    '2.50166 -> 0.37633, and it improves the seven-anchor training RMS only ' +
    'marginally (0.005810 -> 0.004946). But that curvature bends the ' +
    'extrapolation upward at high T, the opposite direction from where the ' +
    'off-anchor margins fall: the off-anchor residual RMS GROWS ' +
    '0.037482 -> 0.061374 (+64%), the mean deepens -0.030525 -> -0.053877, the ' +
    'worst deepens -0.060812 -> -0.096634 (T=4506.31), and the sign bias worsens ' +
    'from 23/27 to 27/27 below the line.',
  mechanism:
    'The seven-anchor curvature is fixed entirely by the low-T grid (T=60..396), ' +
    'so any extra degree of freedom the anchors "want" reflects only the shape of ' +
    'the training data there. Because that curvature happens to point the ' +
    'extrapolation upward at high T while the true off-anchor column runs below ' +
    'the one-parameter line, adding the term cannot help and instead compounds ' +
    'the miss. This rules out "missing curvature in the linear-in-1/lnT model" as ' +
    'the explanation for the below-line structure: it is a genuine off-anchor ' +
    'obstruction invisible to any low-T-anchored reciprocal-log extrapolation, ' +
    'one term or two.',
  verificationStatus:
    'Measurement classification (accuracy audit of an extrapolation-model choice), ' +
    'not a rigorous derivation of the uniform-in-T behaviour. Changes no bound; ' +
    'the true uniform-in-T obstruction (a uniform off-line LP, Weil-positivity ' +
    'strength) stays inaccessible to this on-line construction; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP96476_OFF_ANCHOR_GENUINE_OBSTRUCTION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96476',
  proofSection: 'S-frontier',
  glosses: 'imp-96450',
  question:
    'imp-96450 tested whether a second reciprocal-log term removes the systematic ' +
    'below-line off-anchor residual left by the imp-96345 one-parameter line. Is ' +
    'that residual a curable missing-curvature artifact, or a genuine off-anchor ' +
    'obstruction?',
  headword: OFF_ANCHOR_GENUINE_OBSTRUCTION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-96450 ' +
    'result: a second reciprocal-log term, refit on the same seven imp-96148 ' +
    'anchors, does NOT reduce the below-line off-anchor residual -- it AMPLIFIES ' +
    'it (off-anchor RMS 0.037482 -> 0.061374, +64%; sign bias 23/27 -> 27/27 ' +
    'below). So the below-line structure is a genuine off-anchor obstruction, not ' +
    'a missing-curvature artifact of the linear-in-1/lnT model. Establishes ' +
    'nothing; instantiates no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96450 (the two-parameter refit and off-anchor residual growth this ' +
    'glosses, +64% RMS growth, sign bias 23/27 -> 27/27 below); imp-96345 (the ' +
    'one-parameter line and original below-line residual); imp-96148 (the seven ' +
    'on-line training anchors); imp-96224 (the 27 measured off-anchor heights); ' +
    'imp-96377 (per-point sign tags).',
});

export default IMP96476_OFF_ANCHOR_GENUINE_OBSTRUCTION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96476_OFF_ANCHOR_GENUINE_OBSTRUCTION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96476-headword-names-amplification-not-cure',
    why: 'The headword must name the direction of the effect: the second term ' +
      'amplifies the residual rather than curing it, with the measured figures.',
    holds: () => {
      const h = IMP96476_OFF_ANCHOR_GENUINE_OBSTRUCTION_GLOSSARY_HEADWORD.headword;
      return (
        /AMPLIFIES/.test(h.term) &&
        /0\.037482/.test(h.definition) &&
        /0\.061374/.test(h.definition) &&
        /23\/27/.test(h.definition) &&
        /27\/27/.test(h.definition)
      );
    },
  },
  {
    id: 'imp96476-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96476_OFF_ANCHOR_GENUINE_OBSTRUCTION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96476_OFF_ANCHOR_GENUINE_OBSTRUCTION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96476_OFF_ANCHOR_GENUINE_OBSTRUCTION_GLOSSARY_HEADWORD.verdict) &&
      IMP96476_OFF_ANCHOR_GENUINE_OBSTRUCTION_GLOSSARY_HEADWORD.glosses === 'imp-96450',
  },
];

for (const assertion of IMP96476_OFF_ANCHOR_GENUINE_OBSTRUCTION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96476-off-anchor-genuine-obstruction-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
