/**
 * @module imp-96258-ushape-slope-drift-saturation-glossary-headword
 * @fileoverview imp-96258 -- import-light glossary/Concepts headword for the imp-96228
 *   finding: the b-dominated U-shape location log-slope drift found by imp-96210 inside
 *   the [N_peak, N_flow] peak decade CONTINUES past N_flow, stays MONOTONE with NO
 *   REVERSAL, and SATURATES toward the (1/2, 1/2, 1) asymptote for (a, b, a+b) rather than
 *   growing without bound.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96210 measured a(N) = d ln g_t/d ln N and b(N) = -d ln g_f/d ln N ONLY across the
 *   peak decade [N_peak, N_flow], finding a monotone, b-dominated upward drift. imp-96228
 *   extended the SAME inherited imp-3406/imp-33582/imp-33723 component model a few decades
 *   past N_flow (out to a log10 N = 250 deep probe) and asked whether that drift stays
 *   monotone, saturates, or reverses. A reader landing on imp-96228 cold has no quick-lookup
 *   definition of the far-N behaviour or its asymptote. This headword bakes that finding
 *   VERBATIM (no re-import of the imp-96228 module, to stay import-light) as a standalone
 *   entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   Past N_flow both a(N) and b(N) keep rising monotonically (checked to at least
 *   N = 1e40, no reversal), with b climbing far faster than a (0.3116 -> ~0.50 vs
 *   0.4667 -> ~0.50), so b still carries the bulk of the drift -- the SAME b-dominance
 *   imp-96210 found inside the peak decade. But the per-half-decade INCREMENT of (a+b)
 *   shrinks strictly and monotonically (1.61e-2 near N_flow down to <5e-3 by log10 N ~ 12):
 *   the drift SATURATES rather than growing without bound. The asymptote is a -> 1/2
 *   (E_coll ~ N^{-1/2} pins the exponent) and b -> 1/2 (E_flow ~ log-factors/T0 with
 *   T0 ~ N/log N), so (a+b) -> 1 from below; a deep probe at log10 N = 250 reads
 *   a = 0.4991, b = 0.4956, a+b = 0.9947, consistent with the (1/2, 1/2, 1) limit.
 *
 *   STATUS: MEASUREMENT/DERIVATION ONLY, not a QED. The component model is the inherited
 *   imp-3220/imp-3406/imp-33723 extrapolation, not a rigorous asymptotic; the C_mb
 *   GUE-conditional per imp-486 stays untouched; changes no bound; establishes no operator
 *   positivity. RH open; no refereed bound is changed; NO QED.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96228 far-N slope-saturation finding for
 *   quick reference. It establishes nothing, instantiates no interval, closes no sub-gap
 *   on its own, moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-96228-ushape-slope-drift-beyond-nflow (source: the saturation finding this glosses)
 * @see imp-96210-ushape-peak-slope-drift-location-law (the peak-decade drift measurement extended)
 * @see imp-96187-ushape-peak-ratio-logcorrection-identity-vs-accident (the location law drawing on a+b)
 *
 * Ticket: imp-96258 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The far-N slope-saturation headword, baked verbatim (no re-import).
const USHAPE_SLOPE_DRIFT_SATURATION_HEADWORD = Object.freeze({
  key: 'ushape-slope-drift-saturation-beyond-nflow',
  term:
    'imp-96228 far-N slope-drift saturation: the b-dominated U-shape location log-slope ' +
    'drift stays monotone with no reversal past N_flow, and saturates toward (a, b, a+b) ' +
    '-> (1/2, 1/2, 1) rather than growing without bound',
  definition:
    'Past N_flow both a(N) = d ln g_t/d ln N and b(N) = -d ln g_f/d ln N keep rising ' +
    'monotonically (checked to at least N = 1e40, no reversal), with b climbing far faster ' +
    'than a (0.3116 -> ~0.50 vs 0.4667 -> ~0.50 across the extended grid), so b still ' +
    'carries the bulk of the drift -- continuing the SAME b-dominance imp-96210 found ' +
    'inside the peak decade [N_peak, N_flow]. The per-half-decade INCREMENT of (a+b) ' +
    'shrinks strictly and monotonically (1.61e-2 near N_flow down to under 5e-3 by ' +
    'log10 N ~ 12), so the drift SATURATES rather than growing without bound. The ' +
    'asymptote is a -> 1/2 (E_coll ~ N^{-1/2} pins the exponent) and b -> 1/2 ' +
    '(E_flow ~ log-factors/T0 with T0 ~ N/log N), so (a+b) -> 1 from below; a deep probe ' +
    'at log10 N = 250 reads a = 0.4991, b = 0.4956, a+b = 0.9947, consistent with the ' +
    '(1/2, 1/2, 1) limit. Far-N implication: with (a+b) -> 1 and b/a -> 1, the imp-96187 ' +
    'location law N_peak/N_flow = (b/a)^(1/(a+b)) drives the peak and N_flow to coincide, ' +
    'flattening the U-shape share at large N.',
  mechanism:
    'The two component slopes have different fixed points because they come from ' +
    'different terms of the same E(N) decomposition: E_coll ~ N^{-1/2} is a pure power ' +
    'law, so its log-slope a(N) is pinned at exactly 1/2 in the limit; E_flow carries an ' +
    'extra log-factor on top of T0 ~ N/log N, so its log-slope b(N) approaches 1/2 only ' +
    'asymptotically, more slowly, from below. Because both slopes are monotone increasing ' +
    'and bounded above by 1/2, their sum (a+b) is forced to rise toward the ceiling 1 with ' +
    'a strictly decreasing increment -- saturation, not reversal, is the only behaviour ' +
    'consistent with two monotone-increasing, upper-bounded component slopes.',
  verificationStatus:
    'MEASUREMENT/DERIVATION, not a QED: confirmed by extending the imp-96210 grid with ' +
    'the identical inherited imp-3406/imp-33582/imp-33723 component model to six decades ' +
    'past N_flow plus a log10 N = 250 deep probe, checking strict monotonicity of a, b, ' +
    'a+b on a fine half-decade grid to 1e40 (no reversal) and strict deceleration of the ' +
    '(a+b) increment (saturation). The component model is the inherited ' +
    'imp-3220/imp-3406/imp-33723 extrapolation, not a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 stays untouched; the C_C 1/8 ansatz (imp-2642/imp-2643) ' +
    'is untouched. Changes no bound; establishes no operator positivity; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP96258_USHAPE_SLOPE_DRIFT_SATURATION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96258',
  proofSection: 'S-frontier',
  glosses: 'imp-96228',
  question:
    'imp-96210 found a monotone, b-dominated upward drift of the U-shape location ' +
    'log-slopes a(N), b(N) only inside the [N_peak, N_flow] peak decade. imp-96228 ' +
    'extended the same model past N_flow: does that drift stay monotone, saturate, or ' +
    'reverse, for a reader landing on imp-96228 cold?',
  headword: USHAPE_SLOPE_DRIFT_SATURATION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96228 finding: ' +
    'past N_flow the b-dominated upward drift in a(N), b(N) stays monotone with NO ' +
    'REVERSAL to at least N = 1e40, but the (a+b) increment shrinks strictly, so the ' +
    'drift SATURATES toward the (1/2, 1/2, 1) asymptote for (a, b, a+b) rather than ' +
    'growing without bound. Establishes nothing; instantiates no interval; moves no ' +
    'bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96228 (the far-N saturation finding this glosses); imp-96210 (the peak-decade ' +
    'drift measurement extended); imp-96187 (the location law drawing on a+b); imp-486 ' +
    '(C_mb GUE-conditional, untouched).',
});

export default IMP96258_USHAPE_SLOPE_DRIFT_SATURATION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96258_USHAPE_SLOPE_DRIFT_SATURATION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96258-headword-has-required-fields',
    why: 'The headword must name the monotone-no-reversal fact, the saturation increment ' +
      'evidence, and the (1/2, 1/2, 1) asymptote -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96258_USHAPE_SLOPE_DRIFT_SATURATION_GLOSSARY_HEADWORD.headword;
      return (
        /no reversal/.test(h.definition) &&
        /SATURATES/.test(h.definition) &&
        /0\.9947/.test(h.definition) &&
        /1\/2, 1\/2, 1/.test(h.definition)
      );
    },
  },
  {
    id: 'imp96258-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96258_USHAPE_SLOPE_DRIFT_SATURATION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96258_USHAPE_SLOPE_DRIFT_SATURATION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96258_USHAPE_SLOPE_DRIFT_SATURATION_GLOSSARY_HEADWORD.verdict) &&
      IMP96258_USHAPE_SLOPE_DRIFT_SATURATION_GLOSSARY_HEADWORD.glosses === 'imp-96228',
  },
];

for (const assertion of IMP96258_USHAPE_SLOPE_DRIFT_SATURATION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96258-ushape-slope-drift-saturation-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
