/**
 * @module imp-97788-effectiveheightforn-overflow-floor-glossary-headword
 * @fileoverview imp-97788 -- import-light glossary/Concepts headword recording the imp-97762
 *   double-precision overflow floor of effectiveHeightForN and the imp-97744 log10-space
 *   workaround that crosses it.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE FLOOR. effectiveHeightForN (imp-327, lambda-rh-height-mapping) is a 40-step Newton
 *   inverse of the exact Riemann-von Mangoldt asymptote f(T) = (T/2pi)(log(T/2pi) - 1) - N,
 *   evaluated in IEEE-754 double precision. Its argument N, and the closed-form RvM inverse
 *   N = (L - 1) e^L with L = 1/(1 - t), both overflow double once L > ~709.7827 (e^L exceeds
 *   Number.MAX_VALUE), i.e. once log10 N exceeds ~308.2547 -- equivalently t > ~0.99859 in
 *   1-t-space (imp-97762 F3).
 *   (b) THE GUARD. Past that floor N is already +Infinity as a double before it reaches
 *   effectiveHeightForN; the shipped !Number.isFinite(N) guard then returns the sentinel 0 --
 *   a clean, detectable sentinel, not a silent wrong answer.
 *   (c) THE WORKAROUND. imp-97744 pins far-tail crossing heights past this floor (t = 0.999,
 *   0.9999, log10 N = 437.29 / 4346.94) by never materializing N or T0 as a double at all:
 *   it carries log10 N = L*log10(e) + log10(L - 1) and log10 T0 = log10(2pi) + L*log10(e)
 *   directly, recovering a mantissa x 10^exponent pair only at the end. This is exactly the
 *   representation change needed to cross the F3 overflow floor.
 *   (d) WHERE THE TWO AGREE. Below the floor (t <= 0.995, log10 N <= 89.16) effectiveHeightForN
 *   reproduces the imp-97744 closed-form T0 to one ULP (rel 1.17e-16 / 0), so the floor is the
 *   ONLY degradation -- there is no separate table-interpolation error, since N_TO_T_STAR_TABLE
 *   (imp-327) tops out at N = 1e8 and never covers these heights either way (imp-97762 F1/F4).
 *   (e) STATUS: documentation only. No bound moves, no operator positivity, imp-3066 K_a >= 0
 *   untouched, NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   measurement. Not a proof, not a new bound. NO QED.
 *
 * @see imp-97762-fartail-crossing-height-mapping-domain-audit.js (source: the consumer audit
 *   establishing the L > ~709.7827 / log10 N > ~308.2547 overflow floor and the sentinel guard)
 * @see imp-97744-fartail-diagnostic-crossing-heights.js (the log10-space crossing pins that
 *   cross the floor by carrying mantissa x 10^exponent instead of a raw double)
 * @see lambda-rh-height-mapping.js (imp-327: effectiveHeightForN Newton inverse, N_TO_T_STAR_TABLE)
 *
 * Ticket: imp-97788 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; Platt-Trudgian Lambda <= 0.2 SOTA.
 */

// The overflow-floor headword, baked verbatim (no re-import).
const EFFECTIVEHEIGHTFORN_OVERFLOW_FLOOR_HEADWORD = Object.freeze({
  key: 'effectiveheightforn-double-overflow-floor-imp97762',
  term:
    'effectiveHeightForN double-precision overflow floor: the L > ~709.7827 (log10 N > ~308.2547) ' +
    'point past which the RvM inverse N = (L - 1) e^L overflows IEEE-754 double, and the ' +
    'log10-space workaround (imp-97744) that crosses it',
  definition:
    'effectiveHeightForN (imp-327) is a 40-step Newton inverse of the exact Riemann-von Mangoldt ' +
    'asymptote f(T) = (T/2pi)(log(T/2pi) - 1) - N in IEEE-754 double precision. Its argument N ' +
    '(and the closed-form N = (L - 1) e^L with L = 1/(1 - t)) overflows double once ' +
    'L > ~709.7827 (e^L > Number.MAX_VALUE), i.e. log10 N > ~308.2547, equivalently t > ~0.99859.',
  mechanism:
    'Below the floor (t <= 0.995, log10 N <= 89.16) effectiveHeightForN reproduces the imp-97744 ' +
    'closed-form T0 to one ULP (rel 1.17e-16, or exactly 0), since N_TO_T_STAR_TABLE never covers ' +
    'these heights anyway (tops out at N = 1e8) and no interpolation is involved -- both are the ' +
    'same analytic inverse. Past the floor N is already +Infinity as a double before reaching ' +
    'effectiveHeightForN; the !Number.isFinite(N) guard then returns the sentinel 0. imp-97744 ' +
    'crosses the floor by never materializing N or T0 as a raw double: it carries ' +
    'log10 N = L*log10(e) + log10(L - 1) and log10 T0 = log10(2pi) + L*log10(e) directly, ' +
    'recovering a mantissa x 10^exponent pair only at the end.',
  verificationStatus:
    'Re-cited from the imp-97762 consumer audit ' +
    '(src/data/imp-97762-fartail-crossing-height-mapping-domain-audit.js) and the imp-97744 ' +
    'crossing pins (src/data/imp-97744-fartail-diagnostic-crossing-heights.js). Naming / glossary ' +
    'headword only; supplies no new bound; RH open; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
});

export const IMP97788_EFFECTIVEHEIGHTFORN_OVERFLOW_FLOOR_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97788',
  proofSection: 'S-frontier',
  glosses: 'imp-97762',
  question:
    'imp-97762 measured that effectiveHeightForN (imp-327) overflows IEEE-754 double at ' +
    'L > ~709.7827 (log10 N > ~308.2547) and returns a sentinel 0, while imp-97744 works around ' +
    'that floor by carrying log10-space quantities. What is the headword for this overflow floor ' +
    'and its workaround?',
  headword: EFFECTIVEHEIGHTFORN_OVERFLOW_FLOOR_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97762 double-precision ' +
    'overflow floor of effectiveHeightForN (L > ~709.7827, log10 N > ~308.2547, t > ~0.99859) and ' +
    'the imp-97744 log10-space workaround (mantissa x 10^exponent) that crosses it without ever ' +
    'materializing an overflowing double. No bound moved; NO QED. Platt-Trudgian Lambda <= 0.2 ' +
    'remains SOTA.',
  citation:
    'imp-97762 (the consumer audit measuring the overflow floor and sentinel guard); imp-97744 ' +
    '(the log10-space crossing pins that cross it).',
});

export default IMP97788_EFFECTIVEHEIGHTFORN_OVERFLOW_FLOOR_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97788_EFFECTIVEHEIGHTFORN_OVERFLOW_FLOOR_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97788-headword-names-floor-and-workaround',
    why: 'The headword must name the overflow threshold (L / log10 N) and the log10-space ' +
      'workaround -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP97788_EFFECTIVEHEIGHTFORN_OVERFLOW_FLOOR_GLOSSARY_HEADWORD.headword;
      return (
        /709\.7827/.test(h.definition) &&
        /308\.2547/.test(h.definition) &&
        /log10 N = L\*log10\(e\)/.test(h.mechanism) &&
        /mantissa x 10\^exponent/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97788-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, PT SOTA line present, glosses imp-97762.',
    holds: () =>
      IMP97788_EFFECTIVEHEIGHTFORN_OVERFLOW_FLOOR_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97788_EFFECTIVEHEIGHTFORN_OVERFLOW_FLOOR_GLOSSARY_HEADWORD.verdict) &&
      /remains SOTA/.test(IMP97788_EFFECTIVEHEIGHTFORN_OVERFLOW_FLOOR_GLOSSARY_HEADWORD.verdict) &&
      IMP97788_EFFECTIVEHEIGHTFORN_OVERFLOW_FLOOR_GLOSSARY_HEADWORD.glosses === 'imp-97762',
  },
];

for (const assertion of IMP97788_EFFECTIVEHEIGHTFORN_OVERFLOW_FLOOR_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97788-effectiveheightforn-overflow-floor-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
