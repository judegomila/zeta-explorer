/**
 * @module imp-96680-crossover-near-pole-fragility-glossary-headword
 * @fileoverview imp-96680 -- import-light glossary/Concepts headword for the imp-96654
 *   finding: the imp-96637 GUE crossover N* = 2.09e6 is essentially UNLOCALIZED because
 *   the fitted small-gaps exponent b = -0.3953 (imp-96616) sits only ~3 SE from the
 *   -1/3 GUE pole, so propagating that fit uncertainty through N* = (A/C)^{1/(c-b)}
 *   spans ~5 decades at +/-1 SE and ~19 decades at 95%.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96637 quoted only the point estimate N* = 2.09e6 for where the measured
 *   small-gaps power fit crosses the GUE median envelope. imp-96654 reproduced the
 *   underlying OLS fit to recover the standard error on the exponent b and propagated
 *   it through the pole in N*(b). This headword bakes that sensitivity verdict verbatim
 *   (no re-import of the imp-96654 module, to stay import-light) as a standalone
 *   quick-lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   N* = (A/C)^{1/(c-b)} has c - b in the exponent's denominator, so N* has a POLE at
 *   b = c = -1/3: as the fitted b approaches -1/3 the crossover runs off to infinity,
 *   and beyond it the two power laws never cross at finite N. Reproducing the imp-96616
 *   OLS log-log fit over the 14-rung ladder gives b = -0.395338 with SE(b) = 0.020615
 *   (df = 12) -- so the baked exponent sits only (b - c)/SE(b) = -3.006 SE below the
 *   pole. Propagating +/-1 SE sends N* from 5.53e4 (b steeper) to 2.96e9 (b shallower),
 *   a ~4.7-decade span; propagating the 95% band (t = 2.1788) sends it from 4.62e3 to
 *   9.34e22, a ~19.3-decade span (finite only because the 95% upper limit on b, -0.3504,
 *   still stays just below -1/3). The point estimate N* = 2.09e6 is therefore a soft,
 *   near-singular readout of a 3-SE gap, not a measured scale.
 *
 *   STATUS: a sensitivity/error-propagation reading of an existing point estimate, not a
 *   new measurement and not a rigorous derivation; conditional on the unproved GUE
 *   cube-root small-gaps law throughout.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96654 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96654-gmin-crossover-sensitivity-oscillation.js (source: the sensitivity analysis this glosses)
 * @see imp-96637-gmin-fit-gue-crossover.js (the point-estimate crossover N* = 2.09e6)
 * @see imp-96616 (measured small-gaps power fit A N^b, A=2.1147, b=-0.3953, that feeds the crossover)
 *
 * Ticket: imp-96680 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The near-pole fragility headword, baked verbatim (no re-import).
const CROSSOVER_NEAR_POLE_FRAGILITY_HEADWORD = Object.freeze({
  key: 'gmin-gue-crossover-near-pole-fragility',
  term:
    'imp-96654 verdict: the imp-96637 GUE crossover N* = 2.09e6 is essentially ' +
    'unlocalized -- the fitted small-gaps exponent b = -0.3953 sits only ~3 SE from ' +
    'the -1/3 pole, so the +/-1 SE band on N* spans ~5 decades and the 95% band spans ' +
    '~19 decades',
  definition:
    'The imp-96637 crossover solves where the measured small-gaps power fit ' +
    'f(N) = A N^b (imp-96616: A = 2.1147, b = -0.3953) meets the GUE median envelope ' +
    'g(N) = C N^c (C = 0.8582, c = -1/3), giving N* = (A/C)^{1/(c-b)} = 2.0917e6. Because ' +
    'the exponent difference c - b sits in the DENOMINATOR of that formula, N* has a ' +
    'POLE at b = c: as the fitted b approaches -1/3 from below, N* -> +infinity, and once ' +
    'b >= -1/3 the two power laws no longer cross at any finite N. A point estimate for ' +
    'N* is therefore only as trustworthy as the fitted b is far from that pole.',
  mechanism:
    'Reproducing the imp-96616 OLS log-log fit over the 14-rung ladder (N = 50..1e6) ' +
    'recovers b = -0.395338 with residual standard error 0.238443 (df = 12), giving ' +
    'SE(b) = 0.020615 -- so the baked b lies only (b - c)/SE(b) = -3.006 SE below the ' +
    'pole c = -1/3. Propagating +/-1 SE through N*(b) sends the crossover from 5.5297e4 ' +
    '(b = -0.415915, steeper) to 2.9610e9 (b = -0.374685, shallower), a spread of ~4.73 ' +
    'decades. Propagating the two-sided 95% band (t_{0.975,12} = 2.1788) sends it from ' +
    '4.6174e3 (b = -0.440216) to 9.3377e22 (b = -0.350384), a spread of ~19.31 decades -- ' +
    'still finite only because the 95% upper limit on b, -0.350384, stays (barely) below ' +
    'the pole at -1/3.',
  verificationStatus:
    'Sensitivity / error-propagation reading of an existing point estimate, not a new ' +
    'measurement and not a rigorous derivation; conditional on the unproved GUE ' +
    'cube-root small-gaps law throughout. Does not change the imp-96616 consequence ' +
    '(beating the 1/log^2 surrogate still needs that unproved law); it shows the N* ' +
    'crossover figure specifically is a soft, near-singular readout rather than a ' +
    'localized scale. Changes no bound; establishes no operator positivity; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP96680_CROSSOVER_NEAR_POLE_FRAGILITY_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96680',
  proofSection: 'S-frontier',
  glosses: 'imp-96654',
  question:
    'imp-96637 quoted the point estimate N* = 2.09e6 for the crossover of the measured ' +
    'small-gaps power fit against the GUE median envelope. Is that crossover robustly ' +
    'localized, given that N*(b) has a pole exactly at the GUE exponent b = c = -1/3?',
  headword: CROSSOVER_NEAR_POLE_FRAGILITY_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96654 ' +
    'verdict: the fitted exponent b = -0.395338 sits only ~3.006 SE from the pole ' +
    'b = -1/3, so N* is essentially unlocalized by the data -- the +/-1 SE band spans ' +
    '~4.73 decades ([5.53e4, 2.96e9]) and the 95% band spans ~19.31 decades ' +
    '([4.62e3, 9.34e22]). Establishes nothing; instantiates no interval; moves no ' +
    'bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96654 (the sensitivity analysis this glosses); imp-96637 (the point-estimate ' +
    'crossover N* = 2.09e6); imp-96616 (the measured small-gaps power fit A N^b feeding it).',
});

export default IMP96680_CROSSOVER_NEAR_POLE_FRAGILITY_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96680_CROSSOVER_NEAR_POLE_FRAGILITY_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96680-headword-has-required-fields',
    why: 'The headword must name the near-pole SE distance and both the +/-1 SE and ' +
      '95% decade spans -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96680_CROSSOVER_NEAR_POLE_FRAGILITY_GLOSSARY_HEADWORD.headword;
      return (
        /-3\.006/.test(h.mechanism) &&
        /4\.73/.test(h.mechanism) &&
        /19\.31/.test(h.mechanism) &&
        /2\.0917e6|2\.09e6/.test(h.definition)
      );
    },
  },
  {
    id: 'imp96680-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96680_CROSSOVER_NEAR_POLE_FRAGILITY_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96680_CROSSOVER_NEAR_POLE_FRAGILITY_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96680_CROSSOVER_NEAR_POLE_FRAGILITY_GLOSSARY_HEADWORD.verdict) &&
      IMP96680_CROSSOVER_NEAR_POLE_FRAGILITY_GLOSSARY_HEADWORD.glosses === 'imp-96654',
  },
];

for (const assertion of IMP96680_CROSSOVER_NEAR_POLE_FRAGILITY_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96680-crossover-near-pole-fragility-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
