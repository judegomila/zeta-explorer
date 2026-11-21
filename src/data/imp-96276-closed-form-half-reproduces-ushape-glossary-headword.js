/**
 * @module imp-96276-closed-form-half-reproduces-ushape-glossary-headword
 * @fileoverview imp-96276 -- import-light glossary/Concepts headword for the imp-96151
 *   verdict: the closed-form crossover share model sigma_CF(N) reproduces the imp-33582
 *   far-tail decay-exponent ramp EXACTLY past N=1e12, but does NOT reproduce the imp-3220
 *   U-shape interior peak (~0.9494 at N~9.22e5) -- it is strictly monotone decreasing over
 *   [1e2,1e12], carrying only the post-peak (right) arm of the U-shape.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96151 built sigma_CF(N) = 1 / (1 + sqrt(N/N_cross) * sqrt(L_cross/L(N))) from the
 *   imp-33723 crossover fixed point by dropping the negligible E_flow term. That closed
 *   form matches the full three-term share sigma(N) = E_coll(N)/E(N) to 4 decimals on the
 *   per-decade decay exponent for every decade tested past 1e12 (gap < 4.60e-4 out to
 *   1e100). But a reader skimming imp-96151 for "does the closed form model sigma(N)"
 *   could easily miss that this reproduction is HALF: the closed form is strictly
 *   monotone decreasing on [1e2,1e12] and never rises, so it cannot carry the imp-3220
 *   interior maximum at N~9.22e5 -- the rising left arm and the peak are attributed
 *   entirely to the E_flow (Gronwall) term the closed form omits by construction. This
 *   headword bakes that half-reproduction distinction VERBATIM (no re-import of the
 *   imp-96151/imp-3220/imp-33582 modules, to stay import-light) as a standalone lookup
 *   entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The imp-96151 closed-form crossover share sigma_CF(N) reproduces the imp-33582
 *   far-tail decay-exponent ramp of the full conditional share sigma(N)=E_coll(N)/E(N)
 *   EXACTLY past N=1e12 (per-decade exponent match to 4 decimals, gap < 4.60e-4 out to
 *   1e100), but does NOT reproduce the imp-3220 U-shape interior peak (~0.9494 at
 *   N~9.22e5): sigma_CF is strictly monotone decreasing over [1e2,1e12], carrying only
 *   the post-peak (right) arm of the U-shape.
 *
 *   MECHANISM: sigma_CF is built by dropping the Gronwall flow term E_flow, which is
 *   negligible relative to E_coll only past the crossover (E_flow/E_coll falls from
 *   ~3.0e-3 at N_cross to ~2.0e-4 at 1e12) -- so the two-term crossover model becomes the
 *   full model in the far tail, explaining the exact ramp match. But E_flow is exactly
 *   what produces the rising left arm before the peak (d sigma/dN > 0 at N=1e5), so
 *   omitting it by construction forecloses the interior maximum: the U-shape is only
 *   half-reproduced, decay yes, peak no.
 *
 *   STATUS: a measurement-only attribution, not a bound move. It cleanly assigns the
 *   imp-3220 peak to the E_flow term rather than to the collapse/truncation competition
 *   that sigma_CF isolates.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96151 F1/F2 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96151-sigma-closed-form-crossover-fartail-reproduction (source: the F1/F2 finding this glosses)
 * @see imp-3220-en-bridge-fidelity-frontier (the U-shape interior peak, ~0.9494 at N~9.22e5)
 * @see imp-33582 (the far-tail post-peak decay-exponent ramp measured out to 1e12)
 *
 * Ticket: imp-96276 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The half-reproduction headword, baked verbatim (no re-import).
const CLOSED_FORM_HALF_REPRODUCES_USHAPE_HEADWORD = Object.freeze({
  key: 'sigma-closed-form-reproduces-decay-ramp-not-ushape-peak',
  term:
    'imp-96151 verdict: the closed-form crossover share sigma_CF(N) reproduces the far-tail ' +
    'decay-exponent ramp exactly but not the imp-3220 U-shape peak',
  definition:
    'The imp-96151 closed-form share sigma_CF(N) = 1 / (1 + sqrt(N/N_cross) * ' +
    'sqrt(L_cross/L(N))), built from the imp-33723 crossover fixed point by dropping the ' +
    'negligible E_flow term, matches the full conditional share sigma(N)=E_coll(N)/E(N) on ' +
    'the imp-33582 far-tail decay-exponent ramp to 4 decimals at every decade tested past ' +
    'N=1e12 (share gap < 4.60e-4 out to 1e100). It does NOT reproduce the imp-3220 U-shape ' +
    'interior peak (~0.9494 at N~9.22e5): sigma_CF is strictly monotone decreasing over ' +
    '[1e2,1e12], carrying only the post-peak (right) arm.',
  mechanism:
    'sigma_CF drops the Gronwall flow term E_flow, which is negligible against E_coll only ' +
    'past the crossover (E_flow/E_coll falls from ~3.0e-3 at N_cross to ~2.0e-4 at 1e12), so ' +
    'the two-term model becomes the full model in the far tail -- explaining the exact ramp ' +
    'match. E_flow is exactly what produces the rising left arm before the peak, so omitting ' +
    'it by construction forecloses the interior maximum.',
  verificationStatus:
    'Measurement-only attribution, not a bound move. Cleanly assigns the imp-3220 peak to ' +
    'the E_flow term rather than to the collapse/truncation competition sigma_CF isolates. ' +
    'Changes no bound; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96276_CLOSED_FORM_HALF_REPRODUCES_USHAPE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96276',
  proofSection: 'S-frontier',
  glosses: 'imp-96151',
  question:
    'imp-96151 tested whether the closed-form crossover share sigma_CF(N) reproduces both ' +
    'the imp-3220 U-shape peak and the imp-33582 far-tail decay-exponent ramp. Which of the ' +
    'two survives, and what should a reader landing on imp-96151 cold take away?',
  headword: CLOSED_FORM_HALF_REPRODUCES_USHAPE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96151 F1/F2 ' +
    'verdict: sigma_CF(N) reproduces the far-tail decay-exponent ramp EXACTLY past N=1e12 ' +
    '(4-decimal match, gap < 4.60e-4 out to 1e100) but does NOT reproduce the imp-3220 ' +
    'U-shape interior peak (~0.9494 at N~9.22e5) -- sigma_CF is strictly monotone decreasing ' +
    'over [1e2,1e12], carrying only the post-peak arm. Establishes nothing; instantiates no ' +
    'interval; moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96151 (the F1/F2 finding this glosses); imp-3220 (the U-shape interior peak); ' +
    'imp-33582 (the far-tail decay-exponent ramp); imp-33723 (the crossover fixed point ' +
    'sigma_CF is built from).',
});

export default IMP96276_CLOSED_FORM_HALF_REPRODUCES_USHAPE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96276_CLOSED_FORM_HALF_REPRODUCES_USHAPE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96276-headword-has-required-fields',
    why: 'The headword must name the far-tail match gap, the U-shape peak location, and the ' +
      'E_flow omission mechanism -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96276_CLOSED_FORM_HALF_REPRODUCES_USHAPE_GLOSSARY_HEADWORD.headword;
      return (
        /4\.60e-4/.test(h.definition) &&
        /9\.22e5/.test(h.definition) &&
        /0\.9494/.test(h.definition) &&
        /E_flow/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96276-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96276_CLOSED_FORM_HALF_REPRODUCES_USHAPE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96276_CLOSED_FORM_HALF_REPRODUCES_USHAPE_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96276_CLOSED_FORM_HALF_REPRODUCES_USHAPE_GLOSSARY_HEADWORD.verdict) &&
      IMP96276_CLOSED_FORM_HALF_REPRODUCES_USHAPE_GLOSSARY_HEADWORD.glosses === 'imp-96151',
  },
];

for (const assertion of IMP96276_CLOSED_FORM_HALF_REPRODUCES_USHAPE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96276-closed-form-half-reproduces-ushape-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
