/**
 * @module imp-124862-per-nine-spacing-law-glossary-headword
 * @fileoverview imp-124862 -- import-light glossary/Concepts headword naming the imp-124793
 *   per-nine far-tail spacing law: on the pure per-nine target ladder t = 0.9/0.99/0.999/0.9999
 *   for the far-tail sigma diagnostic 1 - 1/log(T0/2pi), each added nine costs a TEN-FOLD jump in
 *   the required log10 N, the closed-form geometric signature of the diagnostic's logarithmic
 *   (not exponential) approach to 1.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-124793 pinned log10 N = 5.2972 / 45.4251 / 437.2940 / 4346.9448 for the
 *   per-nine targets t = 0.9 / 0.99 / 0.999 / 0.9999 (L = 1/(1-t) = 10/100/1000/10000), and
 *   reported the consecutive log10 N spacing 40.1279 / 391.8690 / 3909.6507, with the
 *   spacing-ratio climbing 9.7655 -> 9.9769 -> EXACTLY 10.
 *   (b) WHY IT IS NEW. imp-97814 ROLE 1 reported only the 0.99/0.995 crossings; imp-124793 is the
 *   first leaf to isolate the PURE per-nine ladder (one added nine per rung, not a mixed target
 *   set) two nines deeper and extract the closed-form spacing-ratio limit.
 *   (c) WHY IT MATTERS. Because L = 1/(1-t) grows exactly ten-fold per added nine and
 *   log10 N ~ L log10(e), buying one more "nine" of the diagnostic costs a ten-fold jump in
 *   log10 N: a clean, closed-form illustration of how slowly 1 - 1/log(T0/2pi) -> 1.
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. Reuses the inherited imp-97723/imp-97744 bare-slope
 *   inversion and Riemann-von Mangoldt relation; conditional-share diagnostic, not a rigorous
 *   asymptotic; the C_mb GUE-conditional per imp-486 is untouched; imp-3066 K_a >= 0 untouched.
 *   (e) STATUS: documentation only. No bound moved; no new coefficient pinned beyond re-citing the
 *   imp-124793 per-nine ladder; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   measurement. Not a new derivation. NO QED.
 *
 * @see imp-124793-fartail-diagnostic-per-nine-spacing-ladder.js (source: the per-nine ladder and spacing law this headword names)
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one (diagnostic = 1 - 1/log(T0/2pi), asymptote 1)
 * @see imp-97744-fartail-diagnostic-crossing-heights (0.999/0.9999 heights reproduced by imp-124793)
 * @see imp-97814-fartail-diagnostic-landmark-cohort-index (ROLE 1: reported only 0.99/0.995)
 *
 * Ticket: imp-124862 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The per-nine spacing-law headword, baked verbatim (no re-import of the heavy zeros bundle).
const PER_NINE_SPACING_LAW_HEADWORD = Object.freeze({
  key: 'per-nine-spacing-law-imp124793',
  term:
    'Per-nine far-tail spacing law: each added nine of the sigma far-tail diagnostic costs a ' +
    'ten-fold jump in log10 N (consecutive spacing ratio -> 10)',
  definition:
    'On the pure per-nine target ladder t = 0.9, 0.99, 0.999, 0.9999 for the far-tail diagnostic ' +
    '1 - 1/log(T0/2pi), the crossing heights are log10 N = 5.2972, 45.4251, 437.2940, 4346.9448 ' +
    '(L = 1/(1-t) = 10, 100, 1000, 10000). The consecutive log10 N spacing is 40.1279, 391.8690, ' +
    '3909.6507, and the ratio of successive spacings climbs 9.7655 then 9.9769 toward EXACTLY 10.',
  mechanism:
    'Setting the bare diagnostic D(T0) = t pins L = log(T0/2pi) = 1/(1-t), so the per-nine target ' +
    't_k = 1 - 10^-k gives L_k = 10^k exactly: each added nine multiplies L by ten. Since ' +
    'log10 N ~ L*log10(e) + log10(L-1) (Riemann-von Mangoldt), the leading term in the spacing ' +
    'Delta_k = log10 N_{k+1} - log10 N_k is 9*10^k*log10(e), so Delta_{k+1}/Delta_k -> 10: the ' +
    'closed-form geometric signature of the purely LOGARITHMIC approach of the diagnostic to 1.',
  verificationStatus:
    'Re-cited from the imp-124793 measurement module ' +
    '(src/data/imp-124793-fartail-diagnostic-per-nine-spacing-ladder.js): the per-nine ladder ' +
    'pins L = 10/100/1000/10000 and log10 N = 5.2972/45.4251/437.2940/4346.9448; the 0.999 and ' +
    '0.9999 heights reproduce the independent imp-97744 pins to round-off; the consecutive ' +
    'spacing ratio climbs 9.7655 -> 9.9769, each below the exact limit of 10. Naming / glossary ' +
    'headword only; supplies no new bound; conditional-share diagnostic, not a rigorous ' +
    'asymptotic; RH open; no refereed bound is changed; NO QED.',
});

export const IMP124862_PER_NINE_SPACING_LAW_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-124862',
  proofSection: 'S-frontier',
  glosses: 'imp-124793',
  question:
    'imp-124793 pinned the pure per-nine far-tail crossing ladder (t = 0.9/0.99/0.999/0.9999) and ' +
    'its log10 N spacing ratio climbing toward 10 -- what is the headword for this closed-form ' +
    'per-nine spacing law?',
  headword: PER_NINE_SPACING_LAW_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-124793 result: on the ' +
    'pure per-nine ladder for the far-tail sigma diagnostic 1 - 1/log(T0/2pi), each added nine ' +
    'costs a ten-fold jump in the required log10 N (spacing ratio 9.7655 -> 9.9769 -> exactly 10), ' +
    'the closed-form geometric signature of the logarithmic approach of the diagnostic to 1. No bound ' +
    'moved; reuses the inherited imp-97723/imp-97744 bare-slope inversion and Riemann-von Mangoldt ' +
    'relation; conditional-share diagnostic, not an RH bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-124793 (the per-nine ladder and spacing law this glosses); imp-97723 (diagnostic = ' +
    '1 - 1/log(T0/2pi)); imp-97744 (0.999/0.9999 heights independently cross-checked); imp-97814 ' +
    'ROLE 1 (0.99/0.995 crossings, predecessor mixed-target report).',
});

export default IMP124862_PER_NINE_SPACING_LAW_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124862_PER_NINE_SPACING_LAW_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp124862-headword-names-ladder-and-ratio',
    why: 'The headword must name the per-nine log10 N ladder, the spacing values, and the ' +
      'ratio climbing toward 10 -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP124862_PER_NINE_SPACING_LAW_GLOSSARY_HEADWORD.headword;
      return (
        /5\.2972/.test(h.definition) &&
        /4346\.9448/.test(h.definition) &&
        /40\.1279/.test(h.definition) &&
        /9\.7655/.test(h.definition) &&
        /9\.9769/.test(h.definition) &&
        /10\^k/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp124862-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-124793.',
    holds: () =>
      IMP124862_PER_NINE_SPACING_LAW_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP124862_PER_NINE_SPACING_LAW_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP124862_PER_NINE_SPACING_LAW_GLOSSARY_HEADWORD.verdict) &&
      IMP124862_PER_NINE_SPACING_LAW_GLOSSARY_HEADWORD.glosses === 'imp-124793',
  },
];

for (const assertion of IMP124862_PER_NINE_SPACING_LAW_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124862-per-nine-spacing-law-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
