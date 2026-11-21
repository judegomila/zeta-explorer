/**
 * @module imp-96300-f1-stationarity-identity-glossary-headword
 * @fileoverview imp-96300 -- import-light glossary/Concepts headword for the imp-96187 F1
 *   result: the imp-3220 sigma U-shape peak condition E_flow/E_trunc |_peak = a/b (the ratio
 *   of the local log-slopes of g_t = E_trunc/E_coll and g_f = E_flow/E_coll) is a DERIVED
 *   stationarity identity, not a measured coincidence.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96162 F2 measured E_flow/E_trunc = 1.530 at the exact imp-3220 U-shape peak and
 *   flagged the number without deriving it. imp-96187 closed that gap: setting
 *   d(g_t + g_f)/d ln N = 0 at the peak (sigma = 1/(1+g) peaks where g is minimal) gives
 *   g_t*a = g_f*b, i.e. the EXACT peak condition E_flow/E_trunc |_peak = g_f/g_t |_peak = a/b,
 *   where a = d ln g_t/d ln N and b = -d ln g_f/d ln N are the local log-slopes. A reader
 *   who only recalls "E_flow/E_trunc = 1.530 at the peak" could mistake that for an empirical
 *   accident; this headword bakes the derivation VERBATIM (no re-import of the imp-96187
 *   module, to stay import-light) so the identity status is a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The imp-3220 sigma U-shape peak stationarity condition d sigma/d ln N = 0 forces
 *   E_flow/E_trunc |_peak = a/b exactly, where a = d ln(E_trunc/E_coll)/d ln N ~ 0.4655 and
 *   b = -d ln(E_flow/E_coll)/d ln N ~ 0.3041 are the local log-slopes at the peak. Derived
 *   a/b = 1.5306 matches the imp-96162 measured E_flow/E_trunc = 1.5308 to ~1.1e-4, upgrading
 *   that landmark from a measured number to a derived identity. imp-96292 (F4) confirmed the
 *   identity is GENUINE (holds at every peak across a 0.25x..16x E_trunc sweep that moves the
 *   physical peak height, to the same <2e-4 tolerance), not a single-height fluke; the VALUE
 *   a/b drifts with height (from ~1.434 to ~2.040 across the sweep) while the IDENTITY itself
 *   holds at each height, exactly as expected for a stationarity condition.
 *
 *   MECHANISM: sigma = E_coll/(E_trunc+E_flow+E_coll) = 1/(1+g) with g = g_t+g_f. sigma is
 *   stationary in ln N exactly where g is, i.e. where g_t*a - g_f*b = 0, which rearranges to
 *   g_f/g_t = a/b -- and g_f/g_t = E_flow/E_trunc by definition. No numerical coincidence is
 *   involved: any local extremum of a sum of two power-law-like terms forces this slope-ratio
 *   relation between their ratio and their log-slopes at that extremum.
 *
 *   STATUS: a measurement/derivation-only upgrade of a previously-flagged empirical number to
 *   a stationarity identity. It does not by itself pin the peak LOCATION (that is the separate
 *   imp-96187 F2 result, N_peak/N_flow = (b/a)^(1/(a+b)), and its 0.577~1/sqrt(3) proximity was
 *   separately shown to be an accident, not an identity).
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96187 F1/imp-96292 F4 verdict for quick
 *   reference. It establishes nothing new, instantiates no interval, closes no sub-gap, moves
 *   no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-96187-ushape-peak-ratio-logcorrection-identity-vs-accident (source: derives F1/F2/F3)
 * @see imp-96162-sigma-ushape-peak-eflow-recovery (measured E_flow/E_trunc=1.530 at the peak, F2 flag)
 * @see imp-3220-en-bridge-fidelity-frontier (the U-shape interior peak, ~0.9494 at N~9.22e5)
 *
 * Ticket: imp-96300 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The stationarity-identity headword, baked verbatim (no re-import).
const F1_STATIONARITY_IDENTITY_HEADWORD = Object.freeze({
  key: 'ushape-peak-eflow-etrunc-ratio-is-slope-ratio-identity',
  term:
    'imp-96187 F1: the imp-3220 U-shape peak condition E_flow/E_trunc |_peak = a/b is a ' +
    'derived stationarity identity, not a measured coincidence',
  definition:
    'At the imp-3220 sigma U-shape interior peak, the stationarity condition d sigma/d ln N ' +
    '= 0 (equivalently d(g_t+g_f)/d ln N = 0 for g_t = E_trunc/E_coll, g_f = E_flow/E_coll) ' +
    'forces E_flow/E_trunc |_peak = g_f/g_t |_peak = a/b exactly, where a = d ln g_t/d ln N ' +
    '~0.4655 and b = -d ln g_f/d ln N ~0.3041 are the local log-slopes at the peak. Derived ' +
    'a/b = 1.5306 matches the imp-96162 measured E_flow/E_trunc = 1.5308 at the exact peak to ' +
    '~1.1e-4.',
  mechanism:
    'sigma = E_coll/(E_trunc+E_flow+E_coll) = 1/(1+g_t+g_f) is stationary in ln N exactly ' +
    'where g_t*a - g_f*b = 0, i.e. g_f/g_t = a/b; since g_f/g_t = E_flow/E_trunc by ' +
    'definition, the peak-value ratio and the log-slope ratio must coincide. imp-96292 (F4) ' +
    'confirmed this holds at every peak across a 0.25x..16x E_trunc sweep (which moves the ' +
    'physical peak height) to the same <2e-4 tolerance -- the identity VALUE a/b drifts with ' +
    'height (~1.434 to ~2.040) but the IDENTITY itself holds at each height, as expected for ' +
    'a genuine stationarity condition rather than a single-height fluke.',
  verificationStatus:
    'Measurement/derivation-only upgrade of a previously-flagged empirical number (imp-96162) ' +
    'to a derived identity, confirmed off-height (imp-96292). Does not by itself pin the peak ' +
    'LOCATION -- see the separate imp-96187 F2 location formula and F3 accident verdict. ' +
    'Changes no bound; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96300_F1_STATIONARITY_IDENTITY_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96300',
  proofSection: 'S-frontier',
  glosses: 'imp-96187',
  question:
    'imp-96162 measured E_flow/E_trunc = 1.530 at the imp-3220 U-shape peak without deriving ' +
    'it. imp-96187 derived the exact peak condition. What should a reader landing on imp-96162 ' +
    'or imp-96187 cold take away about whether that ratio is a coincidence or a forced identity?',
  headword: F1_STATIONARITY_IDENTITY_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96187 F1 / ' +
    'imp-96292 F4 verdict: E_flow/E_trunc |_peak = a/b is a DERIVED stationarity identity ' +
    '(peak-value ratio equals the log-slope ratio of g_t and g_f), confirmed genuine (not a ' +
    'single-height coincidence) across a 0.25x..16x E_trunc sweep. Establishes nothing new; ' +
    'instantiates no interval; moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96187 (derives F1/F2/F3, the source this glosses); imp-96162 (measured ' +
    'E_flow/E_trunc=1.530 at the peak, F2 flag); imp-96292 (F4 off-height robustness check); ' +
    'imp-3220 (the U-shape interior peak, ~0.9494 at N~9.22e5).',
});

export default IMP96300_F1_STATIONARITY_IDENTITY_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96300_F1_STATIONARITY_IDENTITY_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96300-headword-has-required-fields',
    why: 'The headword must name the slope values, the measured landmark, and the ' +
      'off-height confirmation -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96300_F1_STATIONARITY_IDENTITY_GLOSSARY_HEADWORD.headword;
      return (
        /1\.5306/.test(h.definition) &&
        /1\.5308/.test(h.definition) &&
        /0\.4655/.test(h.definition) &&
        /0\.3041/.test(h.definition) &&
        /imp-96292/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96300-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96300_F1_STATIONARITY_IDENTITY_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96300_F1_STATIONARITY_IDENTITY_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96300_F1_STATIONARITY_IDENTITY_GLOSSARY_HEADWORD.verdict) &&
      IMP96300_F1_STATIONARITY_IDENTITY_GLOSSARY_HEADWORD.glosses === 'imp-96187',
  },
];

for (const assertion of IMP96300_F1_STATIONARITY_IDENTITY_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96300-f1-stationarity-identity-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
