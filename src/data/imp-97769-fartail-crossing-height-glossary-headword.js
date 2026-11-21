/**
 * @module imp-97769-fartail-crossing-height-glossary-headword
 * @fileoverview imp-97769 -- import-light glossary/Concepts headword recording the imp-97744
 *   far-tail crossing-height pinning: imp-97723 F2 reported only the nearest order of magnitude
 *   for the far-tail sigma diagnostic's approach to 1 ("crossing 0.99 near 1e45, 0.995 near
 *   1e89"). imp-97744 sharpened this by inverting the bare Riemann-von Mangoldt slope
 *   D(T0) = 1 - 1/log(T0/2pi) directly: setting D = t gives L = log(T0/2pi) = 1/(1 - t) in
 *   closed form, and the RvM relation N = (L - 1) e^L then pins the exact crossing height.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) CLOSED-FORM INVERSION. Deep in the tail the sigma contribution to the diagnostic is
 *   negligible, so D(T0) = 1 - 1/log(T0/2pi) = t inverts to L = 1/(1 - t) exactly (no root
 *   solve): t = 0.99/0.995/0.999/0.9999 give L = 100/200/1000/10000 exactly.
 *   (b) RvM PINS THE HEIGHT. N = (L - 1) e^L pins the crossings at N ~ 2.66124e45 (t=0.99),
 *   1.43797e89 (t=0.995), 1.96810e437 (t=0.999), and 8.80594e4346 (t=0.9999); T0 = 2pi e^L
 *   pins the matching heights 1.68899e44, 4.54021e87, 1.23783e435, 5.53349e4343.
 *   (c) SELF-CONSISTENT WITH THE ORIGINAL BISECTION. The pinned log10 N values agree with the
 *   imp-97723 full-model bisection (which includes the vanishing sigma term) to < 0.06 in
 *   log10 N wherever both exist, confirming the sigma contribution really is negligible at
 *   these heights and the bare-slope inversion is the correct pin.
 *   (d) DIMINISHING RETURNS. A ten-fold jump in L (1000 -> 10000) buys only one more nine of
 *   convergence (t: 0.999 -> 0.9999), because the crossing height grows like e^(1/(1-t)): the
 *   0.9999 rung sits 3909.65 orders of magnitude in log10 N above the 0.999 rung.
 *   (e) STATUS: closed-form pinning / measurement only. Conditional-share diagnostic, not an
 *   RH bound; uses the inherited imp-3406/imp-97702/imp-97723 component model and the RvM
 *   inverse, not a rigorous asymptotic; changes no bound; no operator positivity established.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording a closed-form
 *   height-pinning. Not a proof, not a new bound. NO QED.
 *
 * @see imp-97744-fartail-diagnostic-crossing-heights.js (source measurement: the closed-form
 *   inversion L = 1/(1 - t), the RvM pin N = (L - 1) e^L, and the four crossing rungs)
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one (the original diagnostic and the
 *   order-of-magnitude-only crossings "near 1e45 / near 1e89" this sharpens)
 * @see imp-97702-sigma-fartail-exponent-residual-half-loglaw (the residual split feeding the
 *   component model)
 *
 * Ticket: imp-97769 (content, low, sonnet-4-6). Documentation only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

// The far-tail crossing-height headword, baked verbatim (no re-import).
const FARTAIL_CROSSING_HEIGHT_HEADWORD = Object.freeze({
  key: 'fartail-crossing-height-imp97744-rvm-inverse-pin',
  term:
    'imp-97744 far-tail crossing-height pin: inverting the bare Riemann-von Mangoldt slope ' +
    'D(T0) = 1 - 1/log(T0/2pi) = t gives L = log(T0/2pi) = 1/(1 - t) in closed form, and ' +
    'N = (L - 1) e^L then pins the exact height N (and T0) at which the imp-97723 far-tail ' +
    'sigma diagnostic crosses a given target t on its way to 1',
  definition:
    'imp-97723 F2 located the diagnostic crossings only to the nearest order of magnitude ' +
    '("near 1e45", "near 1e89"). imp-97744 pins them exactly: t = 0.99/0.995/0.999/0.9999 give ' +
    'L = 100/200/1000/10000 exactly, hence T0 = 2pi e^L ~ 1.68899e44/4.54021e87/1.23783e435/' +
    '5.53349e4343 and N = (L - 1) e^L ~ 2.66124e45/1.43797e89/1.96810e437/8.80594e4346 ' +
    '(log10 N = 45.4251/89.1577/437.2940/4346.9448).',
  mechanism:
    'The pin works because deep in the tail the sigma contribution to the diagnostic vanishes, ' +
    'leaving the bare RvM slope D(T0) = 1 - 1/log(T0/2pi); this is a linear equation in ' +
    'L = log(T0/2pi), so it inverts to L = 1/(1 - t) with no root solve. The pinned log10 N ' +
    'then agree with the imp-97723 full-model bisection to < 0.06, confirming the sigma term ' +
    'really is negligible there. Growth is steep: L = 1/(1 - t) means the crossing height scales ' +
    'like e^(1/(1-t)), so a ten-fold jump in L (0.999 -> 0.9999) buys only one more nine while ' +
    'log10 N jumps by 3909.65 orders of magnitude.',
  verificationStatus:
    'Re-cited from the imp-97744 measurement module ' +
    '(src/data/imp-97744-fartail-diagnostic-crossing-heights.js); closed-form base-10-log-space ' +
    'computation (double-precision e^709 ceiling avoided by carrying mantissa x 10^exp). Naming / ' +
    'glossary headword only; supplies no new bound; conditional-share diagnostic, not an RH ' +
    'bound; no bound moved; RH open; no refereed bound is changed; NO QED.',
});

export const IMP97769_FARTAIL_CROSSING_HEIGHT_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97769',
  proofSection: 'S-frontier',
  glosses: 'imp-97744',
  question:
    'imp-97744 pinned the exact heights N (and T0) at which the imp-97723 far-tail sigma ' +
    'diagnostic crosses 0.99/0.995/0.999/0.9999 by inverting the bare RvM slope in closed form. ' +
    'What is the headword for this pinning, and does it move any bound?',
  headword: FARTAIL_CROSSING_HEIGHT_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Records the imp-97744 closed-form ' +
    'RvM-inverse pin of the imp-97723 far-tail diagnostic crossing heights: L = 1/(1 - t) inverts ' +
    'the bare slope exactly, and N = (L - 1) e^L pins N ~ 2.66124e45/1.43797e89/1.96810e437/' +
    '8.80594e4346 for t = 0.99/0.995/0.999/0.9999, self-consistent with the original bisection to ' +
    '< 0.06 in log10 N. No bound moved; conditional-share diagnostic, not an RH bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-97744 (the closed-form inversion and the four pinned crossing rungs this glosses); ' +
    'imp-97723 (the original diagnostic and its order-of-magnitude-only crossings); imp-97702 ' +
    '(the residual split feeding the component model).',
});

export default IMP97769_FARTAIL_CROSSING_HEIGHT_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97769_FARTAIL_CROSSING_HEIGHT_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97769-headword-cites-inversion-and-pinned-heights',
    why: 'The headword must name the closed-form inversion L = 1/(1 - t) and the pinned N ' +
      'values -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP97769_FARTAIL_CROSSING_HEIGHT_GLOSSARY_HEADWORD.headword;
      return (
        /1\/\(1 - t\)/.test(h.term) &&
        /2\.66124e45/.test(h.definition) &&
        /8\.80594e4346/.test(h.definition) &&
        /e\^\(1\/\(1-t\)\)/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97769-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97769_FARTAIL_CROSSING_HEIGHT_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97769_FARTAIL_CROSSING_HEIGHT_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97769_FARTAIL_CROSSING_HEIGHT_GLOSSARY_HEADWORD.verdict) &&
      IMP97769_FARTAIL_CROSSING_HEIGHT_GLOSSARY_HEADWORD.glosses === 'imp-97744',
  },
];

for (const assertion of IMP97769_FARTAIL_CROSSING_HEIGHT_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97769-fartail-crossing-height-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
