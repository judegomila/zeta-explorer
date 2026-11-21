/**
 * @module imp-96274-route-m-resolvability-graded-transition-glossary-headword
 * @fileoverview imp-96274 -- import-light Concepts glossary headword for the imp-96248 result:
 *   the Route M q4/q5 conductor-separation transition is GRADED (not binary), and it carries
 *   TWO practical thresholds that are well separated from each other.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96231 established only the BINARY Rayleigh threshold (log N span L >= 10.0,
 *   N ~ 5.5e6) for splitting the Vasyunin conductors w4 = 4.5324 and w5 = 3.9040.
 *   imp-96248 measured the intermediate behaviour on a synthetic q4+q5 two-tone signal
 *   and found the AICc two-tone preference climbs smoothly with span rather than
 *   switching on at Rayleigh, and that amplitude-recovery usability and confident
 *   model-selection separation sit at two DIFFERENT spans. A reader landing on that
 *   module cold has no quick-lookup summary of the graded shape or the two thresholds.
 *   This headword bakes those facts VERBATIM (no re-import of the imp-96248 module, to
 *   stay import-light) as a standalone lookup entry.
 *
 * @see imp-96248-route-m-conductor-resolvability-curve (source: the graded resolvability curve this glosses)
 * @see imp-96231 (the binary Rayleigh-span threshold this sharpens)
 * @see imp-96264-route-m-amplitude-ratio-sensitivity (equal-amplitude assumption stress test)
 *
 * Ticket: imp-96274 (content, low). Documentation only; establishes nothing; changes no bound;
 * NO QED; no refereed bound is changed.
 */

// The graded-transition + two-threshold headword, baked verbatim (no re-import).
const ROUTE_M_RESOLVABILITY_GRADED_TRANSITION_HEADWORD = Object.freeze({
  key: 'route-m-conductor-resolvability-graded-not-binary',
  term: 'imp-96248 verdict: the Route M q4/q5 conductor-separation transition is GRADED, not a binary Rayleigh switch',
  definition:
    'On a synthetic clean q4+q5 two-tone signal (equal unit amplitudes, matched Gaussian ' +
    'noise sigma = 0.8846), the AICc two-tone-over-single-tone preference climbs smoothly ' +
    'with log N span L rather than switching on at the Rayleigh span: 0.019 (L=2) -> 0.027 ' +
    '(current span 3.18) -> 0.081 (L=5) -> 0.278 (L=6) -> 0.433 (L=7) -> 0.705 (L=8) -> ' +
    '0.883 (L=9) -> 0.940 (L=10, == Rayleigh) -> 1.000 (L=14), as the two-tone design ' +
    'condition number eases monotonically 6.3 -> 1.4.',
  twoThresholds:
    'Two practical thresholds are well separated. Amplitude recovery becomes usable ' +
    '(relative amplitude error < 0.20) early, at span ~6 (N ~ 1e5), but still carries ~18 ' +
    'percent error there. CONFIDENT model-selection separation (AICc preference > 90 ' +
    'percent, reliable separation > 80 percent) is not met until span ~9-10 (N ~ 2e6 to ' +
    '5.5e6), coincident with the Rayleigh limit rather than below it -- matched noise does ' +
    'not buy back span for the confident criterion.',
  sharpens:
    'Sharpens IMP96231_SUBGAP: the Rayleigh span L = 10 is confirmed as the CONFIDENT-' +
    'separation requirement under realistic noise, not merely a Rayleigh-ideal wish, so ' +
    'pinning the conductor content genuinely needs denser d_N data out to N ~ 5.5e6; the ' +
    'earlier N ~ 1e5 regime yields only rough (~18 percent error) amplitudes.',
});

export const IMP96274_ROUTE_M_RESOLVABILITY_GRADED_TRANSITION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96274',
  proofSection: 'S-frontier',
  glosses: 'imp-96248',
  scopes: 'imp-96231',
  question:
    'imp-96248 measured the intermediate q4/q5 conductor-separation behaviour that imp-96231 ' +
    'never checked. Is the transition a single binary switch at the Rayleigh span, or does it ' +
    'grade in smoothly with two distinct practical thresholds, for a reader landing on that ' +
    'module cold?',
  headword: ROUTE_M_RESOLVABILITY_GRADED_TRANSITION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96248 graded-' +
    'transition result: the AICc two-tone preference climbs smoothly 0.019 -> 1.000 across ' +
    'spans 2-14 (no binary switch), and two thresholds are well separated -- amplitude ' +
    'recovery usable at span ~6 (N ~ 1e5, ~18 percent error) versus confident separation only ' +
    'at span ~9-10 (N ~ 5.5e6, coincident with Rayleigh). Establishes nothing; changes no ' +
    'bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96248 (graded resolvability curve and two-threshold verdict); imp-96231 (the binary ' +
    'Rayleigh-span threshold this sharpens); imp-96264 (equal-amplitude assumption stress test).',
});

export default IMP96274_ROUTE_M_RESOLVABILITY_GRADED_TRANSITION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96274_ROUTE_M_RESOLVABILITY_GRADED_TRANSITION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96274-headword-has-required-fields',
    why: 'The headword must name the graded AICc climb across spans and the two well-separated practical thresholds -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96274_ROUTE_M_RESOLVABILITY_GRADED_TRANSITION_GLOSSARY_HEADWORD.headword;
      return (
        /0\.019/.test(h.definition) &&
        /0\.940/.test(h.definition) &&
        /span ~6/.test(h.twoThresholds) &&
        /span ~9-10/.test(h.twoThresholds)
      );
    },
  },
  {
    id: 'imp96274-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96274_ROUTE_M_RESOLVABILITY_GRADED_TRANSITION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96274_ROUTE_M_RESOLVABILITY_GRADED_TRANSITION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96274_ROUTE_M_RESOLVABILITY_GRADED_TRANSITION_GLOSSARY_HEADWORD.verdict) &&
      IMP96274_ROUTE_M_RESOLVABILITY_GRADED_TRANSITION_GLOSSARY_HEADWORD.glosses === 'imp-96248' &&
      IMP96274_ROUTE_M_RESOLVABILITY_GRADED_TRANSITION_GLOSSARY_HEADWORD.scopes === 'imp-96231',
  },
];

for (const assertion of IMP96274_ROUTE_M_RESOLVABILITY_GRADED_TRANSITION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-96274-route-m-resolvability-graded-transition-glossary-headword assertion failed: ${assertion.id}`);
  }
}
