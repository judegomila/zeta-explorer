/**
 * @module imp-95683-kappa-prefactor-correction-glossary-headword
 * @fileoverview imp-95683 -- import-light glossary/Concepts headword for the imp-95661 correction to
 *   the alternating-Riesz-floor summation condition number law: the verified prefactor is
 *   kappa(delta) = (1/4) exp(pi^2/delta), not the imp-95621-stated (1/2) exp(pi^2/delta).
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95661 independently recomputed kappa(delta) = (sum|term|)/|A_opt| from a standalone kernel
 *   and found the measured value equals (1/4)exp(pi^2/delta) at every sampled delta, a flat factor
 *   of 2 below the imp-95621-stated (1/2)exp(pi^2/delta). A reader landing on imp-95621/95647/95661
 *   cold has no quick-lookup definition of which prefactor is correct, why the imp-95621 derivation
 *   was off by 2x, or whether the delta*~0.307 TRAP/CLEAN threshold survives the correction. This
 *   headword bakes those facts VERBATIM (no re-import of the imp-95661 module, to stay import-light)
 *   as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The alternating off-lattice Riesz-floor form A_opt(delta) = 1 + 2 sum_(n>=1) (-1)^n sech(n
 *   delta/2) suffers catastrophic cancellation against the stable theta-dual positive-term form
 *   A_opt(delta) = (4 pi/delta) sum_(n>=0) sech(pi^2(2n+1)/delta). imp-95621 modeled the resulting
 *   condition number as kappa(delta) ~ (1/2)exp(pi^2/delta) by writing the theta-dual leading
 *   magnitude as |A_opt| ~ (4 pi/delta)exp(-pi^2/delta) -- dropping that the leading term is really
 *   sech(pi^2/delta) ~ 2 exp(-pi^2/delta). The true leading magnitude is (8 pi/delta)exp(-pi^2/delta),
 *   so with sum|term| ~ 2 pi/delta the corrected condition number is
 *     kappa(delta) = (2 pi/delta) / [(8 pi/delta) exp(-pi^2/delta)] = (1/4) exp(pi^2/delta).
 *   imp-95661 confirmed this is exact: measured kappa / [(1/2)exp(pi^2/delta)] = 0.5000 flat across
 *   delta in [0.15, 0.75].
 *
 *   ROBUSTNESS: the correction shifts delta* only LOGARITHMICALLY -- by ln(2) in the denominator of
 *   delta* = pi^2/ln(0.02/EPS) -- which is precisely the ~2 percent analytic-vs-numeric gap imp-95621
 *   already recorded (analytic 0.30716 with the (1/2) prefactor vs independent bisection 0.30068 on
 *   the measured kappa). The delta=ln(1.3)=TRAP (relErr 7.30e-2) and delta=ln(2)=CLEAN (relErr
 *   3.16e-12) verdicts, and the delta*~0.307 mandate boundary, are UNCHANGED by the correction.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95661 prefactor correction and its ln(2) robustness for
 *   quick reference. It establishes nothing, instantiates no interval, closes no sub-gap, moves no
 *   bound. Catalan constant G irrationality remains OPEN; NO QED. No refereed bound is changed.
 *
 * @see imp-95661-condition-number-law-verification (source: the independent verification and prefactor correction this glosses)
 * @see imp-95621-alt-form-precision-threshold (the original (1/2)exp(pi^2/delta) derivation being corrected)
 * @see imp-95647-condition-number-viz-data (the condition-number viz this correction applies to)
 *
 * Ticket: imp-95683 (content, low). Documentation only; establishes nothing; NO QED; no refereed bound is changed.
 */

// The kappa-prefactor-correction headword, baked verbatim (no re-import).
const KAPPA_PREFACTOR_CORRECTION_HEADWORD = Object.freeze({
  key: 'alt-riesz-floor-condition-number-prefactor-correction',
  term:
    'imp-95661 correction: the alternating-Riesz-floor summation condition number is ' +
    'kappa(delta)=(1/4)exp(pi^2/delta), not the imp-95621-stated (1/2)exp(pi^2/delta) -- a ' +
    'ln(2) shift in delta*',
  definition:
    'kappa(delta) = (sum|term|)/|A_opt| measures how badly the alternating form A_opt(delta) = ' +
    '1 + 2 sum_(n>=1) (-1)^n sech(n delta/2) suffers cancellation against the stable theta-dual ' +
    'form A_opt(delta) = (4 pi/delta) sum_(n>=0) sech(pi^2(2n+1)/delta). imp-95621 stated kappa ~ ' +
    '(1/2)exp(pi^2/delta) by using the leading theta-dual magnitude (4 pi/delta)exp(-pi^2/delta), ' +
    'but the true leading term is sech(pi^2/delta) ~ 2 exp(-pi^2/delta), giving true leading ' +
    'magnitude (8 pi/delta)exp(-pi^2/delta) and corrected kappa = (1/4)exp(pi^2/delta).',
  robustness:
    'imp-95661 measured kappa / [(1/2)exp(pi^2/delta)] = 0.5000 flat across delta in [0.15, 0.75], ' +
    'confirming the factor-of-2 correction exactly. The correction shifts delta* only ' +
    'LOGARITHMICALLY (by ln 2 in the denominator of delta* = pi^2/ln(0.02/EPS)), matching the ~2 ' +
    'percent analytic (0.30716) vs numeric-bisection (0.30068) gap imp-95621 already recorded. The ' +
    'delta=ln(1.3)=TRAP (relErr 7.30e-2) / delta=ln(2)=CLEAN (relErr 3.16e-12) verdicts and the ' +
    'delta*~0.307 mandate boundary are ROBUST to the correction.',
});

export const IMP95683_KAPPA_PREFACTOR_CORRECTION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95683',
  proofSection: 'S-frontier',
  glosses: 'imp-95661',
  scopes: 'imp-95621',
  question:
    'imp-95661 independently verified the alternating-Riesz-floor summation condition number scales ' +
    'as exp(pi^2/delta) but found the imp-95621-stated (1/2) prefactor is 2x too large. What is the ' +
    'corrected law, why did the (1/2) prefactor arise, and does the delta*~0.307 threshold survive ' +
    'the correction, for a reader landing on that module cold?',
  headword: KAPPA_PREFACTOR_CORRECTION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95661 verdict: the ' +
    'measured condition number is kappa(delta)=(1/4)exp(pi^2/delta), a flat factor of 2 below the ' +
    'imp-95621-stated (1/2)exp(pi^2/delta), because the imp-95621 derivation dropped the ' +
    'sech(pi^2/delta) ~ 2 exp(-pi^2/delta) factor of 2 in the theta-dual leading magnitude. The ' +
    'correction shifts delta* only by ln 2 (the previously-recorded ~2 percent analytic-vs-numeric ' +
    'gap); the TRAP/CLEAN verdicts and delta*~0.307 threshold are ROBUST. Establishes nothing; ' +
    'instantiates no interval; moves no bound; G irrationality OPEN; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-95661 (independent verification and prefactor correction); imp-95621 (original ' +
    '(1/2)exp(pi^2/delta) derivation being corrected); imp-95647 (condition-number viz this ' +
    'correction applies to).',
});

export default IMP95683_KAPPA_PREFACTOR_CORRECTION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95683_KAPPA_PREFACTOR_CORRECTION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95683-headword-has-required-fields',
    why: 'The headword must name the corrected (1/4) prefactor, the original (1/2) statement, and the ln(2) robustness verdict -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP95683_KAPPA_PREFACTOR_CORRECTION_GLOSSARY_HEADWORD.headword;
      return (
        /\(1\/4\)exp\(pi\^2\/delta\)/.test(h.definition) &&
        /\(1\/2\)exp\(pi\^2\/delta\)/.test(h.definition) &&
        /0\.5000/.test(h.robustness) &&
        /ln 2/.test(h.robustness) &&
        /ROBUST/.test(h.robustness)
      );
    },
  },
  {
    id: 'imp95683-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, G irrationality OPEN, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95683_KAPPA_PREFACTOR_CORRECTION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95683_KAPPA_PREFACTOR_CORRECTION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95683_KAPPA_PREFACTOR_CORRECTION_GLOSSARY_HEADWORD.verdict) &&
      /G irrationality OPEN/.test(IMP95683_KAPPA_PREFACTOR_CORRECTION_GLOSSARY_HEADWORD.verdict) &&
      IMP95683_KAPPA_PREFACTOR_CORRECTION_GLOSSARY_HEADWORD.glosses === 'imp-95661' &&
      IMP95683_KAPPA_PREFACTOR_CORRECTION_GLOSSARY_HEADWORD.scopes === 'imp-95621',
  },
];

for (const assertion of IMP95683_KAPPA_PREFACTOR_CORRECTION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95683-kappa-prefactor-correction-glossary-headword assertion failed: ${assertion.id}`
    );
  }
}
