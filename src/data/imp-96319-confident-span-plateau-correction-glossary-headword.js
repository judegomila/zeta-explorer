/**
 * @module imp-96319-confident-span-plateau-correction-glossary-headword
 * @fileoverview imp-96319 -- import-light glossary/Concepts headword correcting the
 *   imp-96264 strict equal-amplitude lower-bound claim to the imp-96288 fine-resolution
 *   plateau characterization.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96264 swept the Route M synthetic q4+q5 confident-separation span over a COARSE
 *   amplitude-ratio grid (rho = A4/A5 in {0.25, 0.5, 0.71, 1, 1.41, 2, 4}) at INTEGER span
 *   resolution and concluded the span is minimized exactly at rho = 1 (== the Rayleigh
 *   span 10) and strictly LOWER-BOUNDED by that equal-amplitude value: every unequal ratio
 *   moves the span up. imp-96288 re-ran the identical pipeline at FINE rho/span resolution
 *   (15-point log-spaced rho grid, 0.25-step span grid with linear-interpolated crossings)
 *   and found the strict claim does not survive: the rho = 1 crossing is actually ~9.14
 *   (below Rayleigh, not == 10 -- imp-96264's "==10" was integer-grid rounding), and the
 *   true minimum sits at rho = 0.94 (span 9.05), 0.085 below the rho = 1 value. A reader who
 *   only recalls the imp-96264 headline ("equal amplitude is a strict lower bound") would
 *   overstate the result; this headword bakes the corrected plateau picture verbatim (no
 *   re-import of either module, to stay import-light).
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The imp-96264 claim that the Route M q4/q5 confident-separation span is strictly
 *   minimized at, and lower-bounded by, the equal-amplitude ratio rho = 1 (span == Rayleigh
 *   10.0) is a COARSE-GRID ARTIFACT, corrected by imp-96288: at fine resolution the rho = 1
 *   crossing is ~9.14 (below Rayleigh) and the global minimum is ~9.05 at rho = 0.94, a
 *   noise-sized 0.085 below the rho = 1 value. The durable, weaker statement is a FLAT
 *   PLATEAU: the confident-separation span sits at ~9.0-9.25 (just under Rayleigh) across
 *   |log rho| <= ln 1.26 and rises with imbalance outside that band. No amplitude ratio buys
 *   a materially smaller span, so the imp-96248 reach requirement (~Rayleigh scale,
 *   N ~ 5.5e6) is unchanged; only the STRICT ordering/lower-bound framing is corrected.
 *
 *   MECHANISM: imp-96264's integer span grid (steps of 1 near span 10) could not resolve a
 *   sub-Rayleigh crossing or a fractional cross-ratio ordering; it read "span 10" off a grid
 *   point rather than an interpolated crossing. imp-96288's finer grid resolves both the
 *   true rho = 1 crossing (9.14, not 10) and a shallow, noise-sized minimum near but not at
 *   rho = 1 (0.94, not 1.00). The qualitative, conservative picture (near-equal amplitudes
 *   needed, span ~Rayleigh-scale, imbalance only makes it worse) survives; only the STRICT
 *   exact-minimum-at-rho=1 / strict-lower-bound wording does not.
 *
 *   STATUS: a measurement/correction-only refinement of a coarse-grid ordering claim to a
 *   fine-grid plateau characterization. It does not change the imp-96248 reach requirement
 *   or any bound.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96288 verdict for quick reference. It
 *   establishes nothing new, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96288-route-m-confident-span-lower-bound-test.js (source: fine-resolution correction)
 * @see imp-96264-route-m-amplitude-ratio-sensitivity.js (coarse-grid claim being corrected)
 * @see imp-96248-route-m-conductor-resolvability-curve.js (equal-amplitude curve + IMP96248_SUBGAP)
 *
 * Ticket: imp-96319 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The plateau-correction headword, baked verbatim (no re-import).
const CONFIDENT_SPAN_PLATEAU_CORRECTION_HEADWORD = Object.freeze({
  key: 'route-m-confident-span-equal-amplitude-strict-bound-corrected-to-plateau',
  term:
    'imp-96288: the imp-96264 "confident-separation span strictly minimized at, and ' +
    'lower-bounded by, equal amplitudes" claim is corrected to a fine-grid PLATEAU ' +
    'characterization',
  definition:
    'imp-96264 (coarse rho grid, integer span resolution) reported the Route M q4/q5 ' +
    'confident-separation span minimized exactly at rho = A4/A5 = 1 at span == Rayleigh ' +
    '10.0, strictly lower-bounded by that value. imp-96288 (fine 15-point rho grid, ' +
    '0.25-step interpolated span crossings) found this does not survive: the rho = 1 ' +
    'crossing is actually ~9.14 (below Rayleigh, not == 10), and the true minimum is ~9.05 ' +
    'at rho = 0.94 -- 0.085 below the rho = 1 value, a noise-sized margin.',
  mechanism:
    'imp-96264 integer span steps (near span 10) could not resolve a sub-Rayleigh crossing ' +
    'or distinguish rho = 0.94 from rho = 1.00; the "==10" and "exactly at rho=1" readings ' +
    'were grid-rounding artifacts. The durable statement is weaker: the confident-separation ' +
    'span forms a FLAT PLATEAU (~9.0-9.25, just under Rayleigh) across |log rho| <= ln 1.26, ' +
    'rising with imbalance outside it -- no amplitude ratio buys a materially smaller span, ' +
    'so the imp-96248 ~Rayleigh-scale reach requirement (N ~ 5.5e6) is unchanged.',
  verificationStatus:
    'Measurement/correction-only refinement of a coarse-grid strict-ordering claim (imp-96264) ' +
    'to a fine-grid plateau characterization (imp-96288). Changes no bound; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP96319_CONFIDENT_SPAN_PLATEAU_CORRECTION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96319',
  proofSection: 'S-frontier',
  glosses: 'imp-96288',
  question:
    'imp-96264 claimed the Route M confident-separation span is strictly minimized at, and ' +
    'lower-bounded by, equal amplitudes (rho = 1, span == Rayleigh). What should a reader ' +
    'landing on imp-96264 or imp-96288 cold take away about whether that strict claim holds?',
  headword: CONFIDENT_SPAN_PLATEAU_CORRECTION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96288 verdict: ' +
    'the imp-96264 strict equal-amplitude lower-bound claim is a coarse-grid artifact, ' +
    'corrected to a flat plateau (~9.0-9.25, just under Rayleigh) across near-equal ratios. ' +
    'Establishes nothing new; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96288 (fine-resolution correction, the source this glosses); imp-96264 (coarse-grid ' +
    'strict claim being corrected); imp-96248 (equal-amplitude curve + reach sub-gap).',
});

export default IMP96319_CONFIDENT_SPAN_PLATEAU_CORRECTION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96319_CONFIDENT_SPAN_PLATEAU_CORRECTION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96319-headword-has-required-fields',
    why: 'The headword must name the corrected crossing values and the plateau band -- the ' +
      'entire point of the glossary entry.',
    holds: () => {
      const h = IMP96319_CONFIDENT_SPAN_PLATEAU_CORRECTION_GLOSSARY_HEADWORD.headword;
      return (
        /9\.14/.test(h.definition) &&
        /9\.05/.test(h.definition) &&
        /0\.94/.test(h.definition) &&
        /plateau/i.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96319-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96319_CONFIDENT_SPAN_PLATEAU_CORRECTION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96319_CONFIDENT_SPAN_PLATEAU_CORRECTION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96319_CONFIDENT_SPAN_PLATEAU_CORRECTION_GLOSSARY_HEADWORD.verdict) &&
      IMP96319_CONFIDENT_SPAN_PLATEAU_CORRECTION_GLOSSARY_HEADWORD.glosses === 'imp-96288',
  },
];

for (const assertion of IMP96319_CONFIDENT_SPAN_PLATEAU_CORRECTION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96319-confident-span-plateau-correction-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
