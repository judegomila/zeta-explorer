/**
 * @module imp-97794-fartail-floor-sensitivity-crossover-glossary-headword
 * @fileoverview imp-97794 -- import-light glossary/Concepts headword recording the imp-97759
 *   E_trunc-floor-sensitivity crossover of the FULL far-tail sigma diagnostic: below
 *   N ~ 1e20.7 the imp-33708 0.5x..5x E_trunc-floor swap moves the diagnostic's rising-branch
 *   crossing by more than 1% in log10 N; above it the shift decays fast, tracking the crossing
 *   sigma ~ N^(-1/2).
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE CROSSOVER. Running the imp-33708 0.5x..5x E_trunc-floor swap on the FULL imp-97723
 *   diagnostic (sigma term included, not the bare RvM slope), the rising-branch crossing
 *   diag(N) = t shifts by > 1% of log10 N only below N ~ 1e20.7 (t ~ 0.9774) -- just ~2 decades
 *   above the diagnostic's local minimum (log10 N ~ 18.77, diag ~ 0.976). Above the crossover the
 *   floor-swap shift is < 1%.
 *   (b) THE DECAY LAW. Once past the crossover the shift falls off fast: ~2.67% at
 *   log10 N ~ 20.3, ~0.045% at log10 N ~ 23.4, ~1.8e-5% at log10 N ~ 30.8, ~3.2e-12% at
 *   log10 N ~ 45.4 -- because the crossing sigma ~ N^(-1/2), each extra nine of the target t buys
 *   many further orders of magnitude of floor-insensitivity.
 *   (c) CONFIRMS imp-97744 F4 WITH MARGIN. At the imp-97744 headline crossings (0.99, 0.995,
 *   0.999) the floor swap moves the pinned log10 N by < 1e-11 relative -- far inside the
 *   crossover, so the floor-free bare-slope pin L = 1/(1 - t) is correct with enormous margin.
 *   (d) STATUS: measurement / sensitivity only. Conditional-share diagnostic, not an RH bound;
 *   uses the inherited imp-3406/imp-97702/imp-97723 component model and the imp-33708 floor
 *   swap, not a rigorous asymptotic; changes no bound; establishes no operator positivity.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording a measured
 *   floor-sensitivity crossover. Not a proof, not a new bound. NO QED.
 *
 * @see imp-97759-fartail-crossing-etrunc-floor-sensitivity-crossover.js (source measurement:
 *   the crossover height N ~ 1e20.7, the local minimum, and the per-target floor-sensitivity
 *   ladder)
 * @see imp-97744-fartail-diagnostic-crossing-heights (F4: sigma negligible at the crossings,
 *   confirmed and sharpened here)
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one (the full diagnostic closed form)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (the 0.5x..5x E_trunc floor
 *   swap this crossover reuses)
 *
 * Ticket: imp-97794 (content, low, sonnet-4-6). Documentation only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

// The floor-sensitivity-crossover headword, baked verbatim (no re-import).
const FARTAIL_FLOOR_SENSITIVITY_CROSSOVER_HEADWORD = Object.freeze({
  key: 'fartail-floor-sensitivity-crossover-imp97759-1e20p7',
  term:
    'imp-97759 E_trunc-floor-sensitivity crossover: below N ~ 1e20.7 (t ~ 0.9774) the ' +
    'imp-33708 0.5x..5x E_trunc-floor swap moves the FULL imp-97723 far-tail diagnostic\'s ' +
    'rising-branch crossing by more than 1% in log10 N; above it the shift decays fast, ' +
    'tracking the crossing sigma ~ N^(-1/2)',
  definition:
    'For each target t, log10-bisecting the rising-branch crossing diag(N) = t of the FULL ' +
    'diagnostic (sigma term included) under the 0.5x..5x E_trunc-floor swap, the crossover at ' +
    'which the across-floor-swap spread in log10 N first drops below 1% of log10 N sits at ' +
    'N ~ 1e20.7 (t ~ 0.9774), just ~2 decades above the diagnostic\'s local minimum ' +
    '(log10 N ~ 18.77, diag ~ 0.976). Below the crossover the floor is a >1%-level effect; ' +
    'above it, the shift is ~2.67% at log10 N ~ 20.3, ~0.045% at 23.4, ~1.8e-5% at 30.8, and ' +
    '~3.2e-12% at 45.4.',
  mechanism:
    'The full diagnostic humps (small N, sigma*log T0 dominant), bottoms out at a local ' +
    'minimum, then rises slowly toward 1 along the bare RvM slope 1 - 1/log(T0/2pi). The ' +
    'imp-97744 far-tail crossings (0.99/0.995/0.999) all sit on that rising branch, where sigma ' +
    'has already become negligible; the E_trunc floor only bites near the bottom of the rising ' +
    'branch, close to the local minimum, where sigma is not yet negligible. Because the crossing ' +
    'sigma ~ N^(-1/2), moving the target t deeper into the tail shrinks the floor-swap shift ' +
    'super-exponentially, so the >1% crossover sits only ~2 decades above the local minimum and ' +
    '~25 orders of magnitude below the 0.99 crossing.',
  verificationStatus:
    'Re-cited from the imp-97759 measurement module ' +
    '(src/data/imp-97759-fartail-crossing-etrunc-floor-sensitivity-crossover.js); golden-section ' +
    'local-minimum locate plus log10-bisection of the rising-branch crossing under the ' +
    'imp-33708 0.5x/1x/2x/5x E_trunc-floor swap. Naming / glossary headword only; supplies no ' +
    'new bound; conditional-share diagnostic, not an RH bound; no bound moved; RH open; ' +
    'no refereed bound is changed; NO QED.',
});

export const IMP97794_FARTAIL_FLOOR_SENSITIVITY_CROSSOVER_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97794',
  proofSection: 'S-frontier',
  glosses: 'imp-97759',
  question:
    'imp-97759 measured how far into the tail the imp-97744 "sigma negligible" claim becomes ' +
    'true, pinning a > 1% E_trunc-floor-sensitivity crossover at N ~ 1e20.7. What is the ' +
    'headword for this crossover, and does it move any bound?',
  headword: FARTAIL_FLOOR_SENSITIVITY_CROSSOVER_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Records the imp-97759 measurement: ' +
    'running the imp-33708 0.5x..5x E_trunc-floor swap on the FULL imp-97723 far-tail ' +
    'diagnostic, the rising-branch crossing shifts by > 1% of log10 N only below N ~ 1e20.7 ' +
    '(t ~ 0.9774); above it the shift decays like the crossing sigma ~ N^(-1/2) ' +
    '(~2.67% at log10 N ~ 20.3 down to ~3.2e-12% at log10 N ~ 45.4). This confirms imp-97744 F4 ' +
    'with enormous margin at every headline crossing. No bound moved; conditional-share ' +
    'diagnostic, not an RH bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-97759 (the crossover measurement and per-target floor-sensitivity ladder this ' +
    'glosses); imp-97744 (the far-tail crossing heights confirmed here); imp-97723 (the full ' +
    'diagnostic closed form); imp-33708 (the 0.5x..5x E_trunc floor swap).',
});

export default IMP97794_FARTAIL_FLOOR_SENSITIVITY_CROSSOVER_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97794_FARTAIL_FLOOR_SENSITIVITY_CROSSOVER_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97794-headword-cites-crossover-and-decay',
    why: 'The headword must name the crossover height N ~ 1e20.7 and the N^(-1/2) decay -- the ' +
      'entire point of the glossary entry.',
    holds: () => {
      const h = IMP97794_FARTAIL_FLOOR_SENSITIVITY_CROSSOVER_GLOSSARY_HEADWORD.headword;
      return (
        /1e20\.7/.test(h.term) &&
        /N\^\(-1\/2\)/.test(h.term) &&
        /18\.77/.test(h.definition) &&
        /3\.2e-12%/.test(h.definition)
      );
    },
  },
  {
    id: 'imp97794-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97794_FARTAIL_FLOOR_SENSITIVITY_CROSSOVER_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97794_FARTAIL_FLOOR_SENSITIVITY_CROSSOVER_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97794_FARTAIL_FLOOR_SENSITIVITY_CROSSOVER_GLOSSARY_HEADWORD.verdict) &&
      IMP97794_FARTAIL_FLOOR_SENSITIVITY_CROSSOVER_GLOSSARY_HEADWORD.glosses === 'imp-97759',
  },
];

for (const assertion of IMP97794_FARTAIL_FLOOR_SENSITIVITY_CROSSOVER_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97794-fartail-floor-sensitivity-crossover-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
