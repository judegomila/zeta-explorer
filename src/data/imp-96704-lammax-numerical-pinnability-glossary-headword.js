/**
 * @module imp-96704-lammax-numerical-pinnability-glossary-headword
 * @fileoverview imp-96704 -- import-light glossary/Concepts headword for the imp-96562
 *   Finding 3 (numerical-pinnability) result: even if a Szego-type limiting constant for
 *   the Route M Vasyunin-Gram lam_max log-slope existed, the two natural normalized
 *   candidates -- lam_max/log N and lam_max/trace -- both remain roughly 2x their
 *   asymptotic targets at the largest accessible rung N=6000, so no limiting constant is
 *   numerically readable from the current ladder.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96562 assessed whether a Szego/Grenander limiting-spectrum asymptotic could pin
 *   the measured lam_max log-slope 0.3526253785070698 (Finding 2: no, the Vasyunin Gram
 *   is multiplicative not additive-Toeplitz, and the edge is unbounded). Finding 3 asks a
 *   narrower, purely numerical question: even setting Finding 2 aside, could one at least
 *   READ OFF a converging constant from the accessible N<=6000 ladder? This headword bakes
 *   that Finding 3 verdict verbatim (no re-import of the imp-96562 module, to stay
 *   import-light) as a standalone quick-lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   Two normalized candidates, each targeting a different asymptotic constant (both
 *   OLS-fit slopes of a + b log N over the N=250..6000 ladder, imp-96562):
 *     lam_max(N) / log N  -> target = lam_max OLS slope = 0.3526253785070698;
 *       measured 0.8929 (N=250) -> 0.6968 (N=6000).
 *     lam_max(N) / trace(N) -> target = lam_max slope / trace slope = 0.2798659490409786;
 *       measured 0.6410 (N=250) -> 0.5183 (N=6000).
 *   At the top rung N=6000 both ratios sit close to double their target: 0.6968 / 0.3526
 *   ~ 1.98x, and 0.5183 / 0.2799 ~ 1.85x. The pre-asymptotic intercept (a=3.0247 for
 *   lam_max, from the OLS fit lam_max ~ a + b log N) dominates the log term until N is
 *   astronomically larger than any range reachable by direct eigen-computation, so 0.3526
 *   survives only as a fitted 8-rung regression SLOPE (N=250..6000), never as a limit
 *   directly visible in the data.
 *
 *   STATUS: sharpens (does not close) the imp-96562 Szego-assessment sub-gap by recording
 *   that a numerical read-off is unavailable at accessible N even independent of whether a
 *   limiting constant exists in principle. Establishes no operator positivity, closes no
 *   analytic gap. NO QED. No refereed bound is changed.
 *
 * @see imp-96562-route-m-lammax-offdiagonal-szego-assessment.js (source: IMP96562_NUMERICAL_PINNABILITY this glosses)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (the measured lam_max / trace ladder, N=250..6000)
 * @see imp-96659-lammax-slope-saturation-glossary-headword.js (sibling headword on the rank-r onset shape)
 *
 * Ticket: imp-96704 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The numerical-pinnability headword, baked verbatim (no re-import).
const LAMMAX_NUMERICAL_PINNABILITY_HEADWORD = Object.freeze({
  key: 'lammax-slope-not-numerically-pinnable-at-n6000',
  term:
    'imp-96562 Finding 3 verdict: both normalized candidates for the Route M lam_max ' +
    'log-slope -- lam_max/log N and lam_max/trace -- remain ~2x their asymptotic ' +
    'targets at the largest accessible rung N=6000, so no limiting constant is ' +
    'numerically readable from the current ladder, independent of whether one exists ' +
    'in principle',
  definition:
    'lam_max(N)/log N targets the measured slope 0.3526253785070698 but measures ' +
    '0.8929 at N=250 falling only to 0.6968 at N=6000 (~1.98x the target). ' +
    'lam_max(N)/trace(N) targets the ratio of OLS slopes 0.2798659490409786 ' +
    '(lam_max slope over trace slope) but measures 0.6410 at N=250 falling only to ' +
    '0.5183 at N=6000 (~1.85x the target). Neither candidate is within a factor of ' +
    '2 of its limit anywhere on the accessible ladder.',
  mechanism:
    'The OLS fit lam_max(N) ~ a + b log N has a pre-asymptotic intercept a=3.0247 ' +
    'that dominates the log term b log N until N is far beyond any range reachable ' +
    'by direct eigen-computation on the Vasyunin Gram -- so 0.3526 survives only as ' +
    'a fitted 8-rung regression slope (N=250..6000, R^2=0.99540), never as a limit ' +
    'directly visible in the normalized ratios themselves.',
  verificationStatus:
    'Sharpens (does not close) the imp-96562 Szego-assessment sub-gap: even setting ' +
    'aside whether a Szego/Grenander limiting constant exists in principle (Finding 2: ' +
    'no), the accessible N<=6000 ladder cannot numerically read one off either. ' +
    'Changes no bound; establishes no operator positivity; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP96704_LAMMAX_NUMERICAL_PINNABILITY_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96704',
  proofSection: 'S-frontier',
  glosses: 'imp-96562',
  question:
    'imp-96562 Finding 3 asked whether the two natural normalized candidates for the ' +
    'Route M lam_max log-slope converge closely enough on the accessible N<=6000 ' +
    'ladder to numerically read off a limiting constant.',
  headword: LAMMAX_NUMERICAL_PINNABILITY_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96562 ' +
    'Finding 3 verdict: lam_max/log N (0.8929 -> 0.6968, target 0.3526) and ' +
    'lam_max/trace (0.6410 -> 0.5183, target 0.2799) both remain ~2x their asymptotic ' +
    'targets at N=6000, so no limiting constant is numerically pinnable from the ' +
    'current ladder. Establishes nothing; instantiates no interval; moves no bound; ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-96562 (the Szego assessment and Finding 3 this glosses); imp-96443 (the ' +
    'measured lam_max / trace ladder, N=250..6000); imp-96659 (sibling headword on ' +
    'the rank-r onset shape of the same coefficient).',
});

export default IMP96704_LAMMAX_NUMERICAL_PINNABILITY_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96704_LAMMAX_NUMERICAL_PINNABILITY_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96704-headword-has-required-fields',
    why: 'The headword must name both normalized ratios and their N=250/N=6000 ' +
      'values -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96704_LAMMAX_NUMERICAL_PINNABILITY_GLOSSARY_HEADWORD.headword;
      return (
        /0\.8929/.test(h.definition) &&
        /0\.6968/.test(h.definition) &&
        /0\.6410/.test(h.definition) &&
        /0\.5183/.test(h.definition) &&
        /0\.3526253785070698/.test(h.definition) &&
        /0\.2798659490409786/.test(h.definition)
      );
    },
  },
  {
    id: 'imp96704-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96704_LAMMAX_NUMERICAL_PINNABILITY_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96704_LAMMAX_NUMERICAL_PINNABILITY_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96704_LAMMAX_NUMERICAL_PINNABILITY_GLOSSARY_HEADWORD.verdict) &&
      IMP96704_LAMMAX_NUMERICAL_PINNABILITY_GLOSSARY_HEADWORD.glosses === 'imp-96562',
  },
];

for (const assertion of IMP96704_LAMMAX_NUMERICAL_PINNABILITY_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96704-lammax-numerical-pinnability-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
