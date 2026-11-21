/**
 * @module imp-124780-knee-floor-fragility-glossary-headword
 * @fileoverview imp-124780 -- import-light glossary/Concepts headword recording the imp-97822
 *   sigma-ramp knee floor-fragility split: the imp-97708 bracketing-free pointwise knee is a
 *   TOPOLOGICALLY ROBUST single inflection under the E_trunc floor MODEL FORM, but its
 *   N-COORDINATE is FRAGILE, scaling as N* ~ E_trunc^(-2.10).
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-97822 reswept the imp-97708 bracketing-free pointwise ramp-curvature
 *   knee locator across the imp-33708 0.5x..5x E_trunc floor-factor ladder. Every factor in
 *   {0.5..5} still yields EXACTLY ONE pointwise curvature zero-crossing -- the knee never splits,
 *   doubles, or vanishes -- but its N-coordinate moves monotonically down with the floor:
 *   log10 N* runs from 10.159 (0.5x) through 9.5291 (1x baseline, N* = 3.381e9) to 8.053 (5x),
 *   fitting a floor-elasticity p_knee ~ -2.099 from the two-floor (0.5x/2x) exponent, i.e.
 *   N* ~ E_trunc^(-2.10).
 *   (b) WHY IT IS NEW. imp-97708 established bracket-robustness (invariance to stencil and
 *   sub-decade window width) with the E_trunc floor held FIXED. imp-97822 varies the one axis
 *   imp-97708 left fixed and shows the knee's topology (one inflection) and its coordinate
 *   (N* value) respond completely differently: robust in kind, fragile in position.
 *   (c) WHY IT MATTERS. The measured p_knee ~ -2.099 is IDENTICAL to the imp-33708 sigma=0.5
 *   far-tail halving-landmark exponent (also ~ -2.099), not the softer imp-33684 interior-peak
 *   exponent (~ -1.375) -- because the knee sits in the same E_flow-negligible tail as the
 *   halving landmark it is ~3.3% above, so it inherits that landmark's clean dimensional
 *   N ~ E_trunc^(-2) floor-scaling. The knee's +/-10% floor band (~0.183 decades) also dwarfs
 *   the imp-33767 E_flow displacement (~0.400% ~ 0.00173 decades) by ~105x: the E_trunc floor
 *   MODEL FORM, not E_flow, sets where the knee lands.
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. This is a sensitivity/fit fact about the imp-97520
 *   conditional-share diagnostic's knee locator. The component model is the inherited
 *   imp-3220/imp-3406 extrapolation, not a rigorous asymptotic; the C_mb GUE-conditional per
 *   imp-486 is untouched; establishes no operator positivity; imp-3066 K_a >= 0 untouched.
 *   (e) STATUS: documentation only. No bound moved; no new coefficient pinned beyond re-citing
 *   the imp-97822 fit; the rigorous anchor stays the trace ceiling; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   measurement. Not a new derivation. NO QED.
 *
 * @see imp-97822-sigma-knee-etrunc-floor-elasticity.js (source: the floor-elasticity fit this
 *   headword names)
 * @see imp-97708-sigma-knee-bracket-width-sensitivity (the bracketing-free pointwise knee at
 *   baseline floor, log10 N* = 9.5291, this measurement resweeps)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (the 0.5x..5x E_trunc floor
 *   sweep and far-tail sigma=0.5 exponent ~ -2.099 the knee exponent matches)
 * @see imp-33684-sigma-interior-peak-etrunc-model-sensitivity (interior-peak floor exponent
 *   ~ -1.375, the softer contrast)
 * @see imp-33767-sigma-inflection-offset-reconciliation (the E_flow displacement ~0.400% the
 *   knee's floor band dwarfs by ~105x)
 *
 * Ticket: imp-124780 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The knee floor-fragility headword, baked verbatim (no re-import of the heavy zeros bundle).
const KNEE_FLOOR_FRAGILITY_HEADWORD = Object.freeze({
  key: 'knee-floor-fragility-imp97822',
  term:
    'Sigma-knee floor-fragility split: the imp-97708 pointwise knee is a topologically robust ' +
    'single inflection under the E_trunc floor form, but its N-coordinate is fragile, scaling as ' +
    'N* ~ E_trunc^(-2.10)',
  definition:
    'Across the imp-33708 E_trunc floor-factor ladder {0.5x..5x}, the imp-97708 bracketing-free ' +
    'pointwise ramp-curvature knee (single zero-crossing of c(N) = d2p/d(log10 N)^2) survives as ' +
    'EXACTLY ONE inflection every time -- it never splits, doubles, or vanishes -- but its ' +
    'log10 N* coordinate moves monotonically down with the floor: 10.159 (0.5x) -> 9.5291 ' +
    '(1x baseline, N* = 3.381e9) -> 8.053 (5x), a floor-elasticity of p_knee ~ -2.099 fit from ' +
    'the 0.5x/2x floors, i.e. N* ~ E_trunc^(-2.10).',
  mechanism:
    'The measured p_knee ~ -2.099 is IDENTICAL to the imp-33708 sigma=0.5 far-tail halving-landmark ' +
    'exponent (~ -2.099), not the softened imp-33684 interior-peak exponent (~ -1.375): the knee ' +
    'sits in the same E_flow-negligible tail as the halving landmark it is ~3.3% above, so it ' +
    'inherits that landmark’s clean dimensional N ~ E_trunc^(-2) floor-scaling rather than the ' +
    'peak’s softer scaling. The knee’s +/-10% floor band (~0.183 decades, ~2.1 decades over the ' +
    'full 10x sweep) exceeds the imp-33767 E_flow displacement (~0.400% ~ 0.00173 decades) by ~105x, ' +
    'confirming the E_trunc floor MODEL FORM -- not the tiny E_flow term -- governs where the knee ' +
    'lands.',
  verificationStatus:
    'Re-cited from the imp-97822 measurement module ' +
    '(src/data/imp-97822-sigma-knee-etrunc-floor-elasticity.js): factor 1.0 reproduces the exact ' +
    'imp-97708 baseline knee (log10 N* = 9.5291); every floor factor in {0.5..5} yields exactly one ' +
    'crossing; p_knee ~ -2.099 matches the imp-33708 far-tail exponent to <0.05 and is steeper than ' +
    'the imp-33684 peak exponent ~ -1.375; +/-10% floor band ~0.183 decades is ~105x the imp-33767 ' +
    'E_flow displacement. Naming / glossary headword only; supplies no new bound; the C_C 1/8 ansatz ' +
    'and E_trunc/E_flow component model are untouched; RH open; no refereed bound is changed' +
    '; NO QED.',
});

export const IMP124780_KNEE_FLOOR_FRAGILITY_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-124780',
  proofSection: 'S-frontier',
  glosses: 'imp-97822',
  question:
    'imp-97822 measured how the imp-97708 bracketing-free pointwise sigma-ramp knee responds to ' +
    'the imp-33708 E_trunc floor-factor sweep {0.5x..5x} -- what is the headword for the result ' +
    'that the knee is topologically robust (always one inflection) but its N-coordinate is fragile ' +
    '(N* ~ E_trunc^(-2.10))?',
  headword: KNEE_FLOOR_FRAGILITY_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97822 result: the ' +
    'imp-97708 pointwise knee survives the entire imp-33708 E_trunc floor sweep as a single ' +
    'inflection (topologically robust) while its N-coordinate scales as N* ~ E_trunc^(-2.099) ' +
    '(coordinate-fragile), matching the imp-33708 far-tail halving-landmark exponent rather than ' +
    'the softer imp-33684 interior-peak exponent, with a +/-10% floor band ~105x the imp-33767 ' +
    'E_flow displacement. No bound moved; the component model and all pinned surrogate constants ' +
    'are untouched; NO QED. No refereed bound is changed.',
  citation:
    'imp-97822 (the floor-elasticity fit this glosses); imp-97708 (the bracketing-free pointwise ' +
    'knee at baseline floor, log10 N* = 9.5291); imp-33708 (the E_trunc floor sweep and far-tail ' +
    'exponent ~ -2.099); imp-33684 (interior-peak exponent ~ -1.375 contrast); imp-33767 (E_flow ' +
    'displacement ~0.400% the floor band dwarfs).',
});

export default IMP124780_KNEE_FLOOR_FRAGILITY_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124780_KNEE_FLOOR_FRAGILITY_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp124780-headword-names-exponent-and-baseline',
    why: 'The headword must name the floor-elasticity exponent and the baseline knee coordinate ' +
      'it resweeps -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP124780_KNEE_FLOOR_FRAGILITY_GLOSSARY_HEADWORD.headword;
      return (
        /E_trunc\^\(-2\.10\)/.test(h.definition) &&
        /9\.5291/.test(h.definition) &&
        /3\.381e9/.test(h.definition) &&
        /-2\.099/.test(h.mechanism) &&
        /-1\.375/.test(h.mechanism) &&
        /~105x/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp124780-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-97822.',
    holds: () =>
      IMP124780_KNEE_FLOOR_FRAGILITY_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP124780_KNEE_FLOOR_FRAGILITY_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP124780_KNEE_FLOOR_FRAGILITY_GLOSSARY_HEADWORD.verdict) &&
      IMP124780_KNEE_FLOOR_FRAGILITY_GLOSSARY_HEADWORD.glosses === 'imp-97822',
  },
];

for (const assertion of IMP124780_KNEE_FLOOR_FRAGILITY_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124780-knee-floor-fragility-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
