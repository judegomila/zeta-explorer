/**
 * @module imp-97807-full-sigma-diagnostic-shape-glossary-headword
 * @fileoverview imp-97807 -- import-light glossary/Concepts headword recording the imp-97806
 *   full-curve shape of the imp-97723 sigma diagnostic diag(N) = (1 - sigma)(1 - 1/log(T0/2pi)) +
 *   sigma * log T0: a small-N HUMP peaking at diag ~14.89 near log10 N ~7.77 (imp-97782), a crash
 *   through a local MINIMUM at diag ~0.976 near log10 N ~18.77 (imp-97777), then a slow RISE along
 *   the bare Riemann-von Mangoldt slope toward exactly 1, crossing 0.99 only near log10 N ~45
 *   (imp-97723). The three landmarks were pinned separately across three tickets; this headword
 *   names the single three-regime shape they trace out.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. The full diagnostic is non-monotonic across log10 N in [2, 50]: it rides a
 *   hump (diag ~14.89 at log10 N ~7.77), dips through a local minimum (diag ~0.976 at log10 N
 *   ~18.77), and only then climbs monotonically toward its exactly-1 asymptote, not crossing 0.99
 *   until log10 N ~45.
 *   (b) WHY IT IS NEW. imp-97759/imp-97782/imp-97777/imp-97723 each pinned one landmark in
 *   isolation (floor-sensitivity crossover, hump peak, local minimum, asymptote-to-1 crossings);
 *   imp-97806 was the first to sample the continuous curve joining them and confirm the three
 *   landmarks sit in ascending log10 N order on a single coherent shape. This headword is the
 *   glossary name for that joined shape, not a new derivation.
 *   (c) WHY IT MATTERS. Readers who encounter only one landmark module in isolation (e.g. just
 *   the local-minimum pin) could mistake the ~0.976 dip for the diagnostic's eventual limit; this
 *   headword records that the true limit is exactly 1, reached only past log10 N ~45, well beyond
 *   both the hump and the minimum.
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. Purely a shape-naming / cross-reference headword over
 *   already-pinned landmarks; it recomputes nothing new and changes no inequality or constant.
 *   (e) STATUS: documentation only. No bound moved; no new inequality; RH open; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   result. Not a new derivation. NO QED.
 *
 * @see imp-97806-full-sigma-diagnostic-curve-viz-data.js (source: the joined three-regime curve
 *   this headword names)
 * @see imp-97782-fartail-diagnostic-hump-peak-pin.js (hump-peak pin: diag ~14.89 at log10 N ~7.77)
 * @see imp-97777-fartail-diagnostic-local-minimum-pin.js (local-minimum pin: diag ~0.976 at
 *   log10 N ~18.77)
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one.js (asymptote-to-1: crosses 0.99 near
 *   log10 N ~45)
 *
 * Ticket: imp-97807 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The full-shape headword, baked verbatim (no re-import).
const FULL_SIGMA_DIAGNOSTIC_SHAPE_HEADWORD = Object.freeze({
  key: 'full-sigma-diagnostic-shape-imp97806',
  term:
    'Full sigma-diagnostic shape: a small-N hump (diag ~14.89 at log10 N ~7.77), a crash through ' +
    'a local minimum (diag ~0.976 at log10 N ~18.77), then a slow rise to exactly 1 (0.99 only ' +
    'near log10 N ~45)',
  definition:
    'The imp-97723 sigma diagnostic diag(N) = (1 - sigma)(1 - 1/log(T0/2pi)) + sigma * log T0 is ' +
    'non-monotonic across the full range of N. Starting small it rides a hump, peaking at diag ~ ' +
    '14.89166 near log10 N ~7.76832 (imp-97782). It then crashes down through a local minimum at ' +
    'diag ~0.9760709 near log10 N ~18.77232 (imp-97777), briefly dipping below its eventual limit ' +
    'of exactly 1. Past the minimum it rises monotonically along the bare Riemann-von Mangoldt ' +
    'slope, but slowly: it does not cross 0.99 until log10 N ~45 (imp-97723), reaching 1 only ' +
    'logarithmically.',
  mechanism:
    'imp-97806 sampled the byte-for-byte imp-97723 closed form as a single continuous curve across ' +
    'log10 N in [2, 50] and confirmed the three landmarks -- pinned independently in three earlier ' +
    'tickets -- sit in ascending log10 N order (hump at ~7.77 < minimum at ~18.77 < 0.99-crossing ' +
    'at ~45) on one coherent three-regime shape, rather than being unrelated artifacts of separate ' +
    'measurement windows.',
  verificationStatus:
    'Re-cited from the imp-97806 curve-sampling module (src/data/imp-97806-full-sigma-diagnostic-' +
    'curve-viz-data.js) and its three source pins (imp-97782 hump, imp-97777 minimum, imp-97723 ' +
    'asymptote), with all landmark figures checked verbatim. Naming / glossary headword only; ' +
    'supplies no new bound; RH open; no refereed bound is changed; NO QED.',
});

export const IMP97807_FULL_SIGMA_DIAGNOSTIC_SHAPE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97807',
  proofSection: 'Route-M',
  glosses: 'imp-97806',
  question:
    'imp-97806 sampled the joined imp-97723 diagnostic curve across its hump, local minimum, and ' +
    'rise-to-1 regimes -- what is the headword for this three-regime shape?',
  headword: FULL_SIGMA_DIAGNOSTIC_SHAPE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97806 joined shape of the ' +
    'imp-97723 sigma diagnostic: hump (diag ~14.89 at log10 N ~7.77) then local minimum (diag ' +
    '~0.976 at log10 N ~18.77) then slow rise to exactly 1 (0.99 only near log10 N ~45). No bound ' +
    'moved; RH open; NO QED. No refereed bound is changed.',
  citation:
    'imp-97806 (the joined curve this glosses); imp-97782 (hump pin); imp-97777 (minimum pin); ' +
    'imp-97723 (asymptote-to-1 pin).',
});

export default IMP97807_FULL_SIGMA_DIAGNOSTIC_SHAPE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97807_FULL_SIGMA_DIAGNOSTIC_SHAPE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97807-headword-names-all-three-landmarks',
    why: 'The headword must name all three landmark figures (hump, minimum, rise-to-1) -- the ' +
      'entire content of the glossary entry.',
    holds: () => {
      const h = IMP97807_FULL_SIGMA_DIAGNOSTIC_SHAPE_GLOSSARY_HEADWORD.headword;
      return (
        /14\.89/.test(h.definition) &&
        /7\.76832/.test(h.definition) &&
        /0\.976/.test(h.definition) &&
        /18\.77232/.test(h.definition) &&
        /45/.test(h.definition)
      );
    },
  },
  {
    id: 'imp97807-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-97806.',
    holds: () =>
      IMP97807_FULL_SIGMA_DIAGNOSTIC_SHAPE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97807_FULL_SIGMA_DIAGNOSTIC_SHAPE_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97807_FULL_SIGMA_DIAGNOSTIC_SHAPE_GLOSSARY_HEADWORD.verdict) &&
      IMP97807_FULL_SIGMA_DIAGNOSTIC_SHAPE_GLOSSARY_HEADWORD.glosses === 'imp-97806',
  },
];

for (const assertion of IMP97807_FULL_SIGMA_DIAGNOSTIC_SHAPE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97807-full-sigma-diagnostic-shape-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
