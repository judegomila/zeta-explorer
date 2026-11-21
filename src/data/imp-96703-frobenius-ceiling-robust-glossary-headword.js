/**
 * @module imp-96703-frobenius-ceiling-robust-glossary-headword
 * @fileoverview imp-96703 -- import-light glossary/Concepts headword for the imp-96684
 *   verdict: extending the imp-96648 Frobenius / Wolkowicz-Styan two-moment lam_max
 *   majorant ladder with the high-N rungs N=7000,8000,9000 leaves the rigorous-lower
 *   Route M conditioning ceiling ~3.76e7 ROBUST (shifts only +0.42%), not tightened --
 *   even though the majorant slope itself flattens (~1.7%), mirroring the imp-96649
 *   lam_max flattening.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96684 measured the exact Frobenius bound ||G||_F = sqrt(trace(G^2)) and the
 *   Wolkowicz-Styan two-moment bound at three new rungs on the NMAX=9000 Vasyunin Gram
 *   (imp-96649), appended them to the imp-96648 eight-rung ladder, and re-fit and
 *   re-solved the ceiling. This headword bakes that verdict verbatim (no re-import of
 *   the imp-96684 module, to stay import-light) as a standalone quick-lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The eleven-rung Frobenius log-fit ||G||_F ~ a + b log N flattens its slope
 *   0.48652 -> 0.47808 (~1.7%, mirroring the imp-96649 lam_max flattening beyond
 *   N=6000) while the intercept rises 2.49786 -> 2.55452; the two shifts nearly
 *   cancel at the ceiling scale N ~ 4e7, so the re-solved rigorous-lower conditioning
 *   ceiling moves only 3.748e7 -> 3.764e7 (factor 1.0042, +0.42%). The ceiling stays
 *   firmly in the ~3.75e7 band, above the rigorous trace-domination lower ceiling
 *   2.594e7 (imp-96548) and below the imp-96443 measured composed ceiling 4.109e7
 *   (residual factor 1.092) -- the extra high-N rungs CONFIRM the imp-96648 estimate
 *   rather than revising it, and every new-rung bound stays a valid ~11%-tight
 *   majorant (strictly above the imp-96649 measured lam_max, strictly below trace).
 *   Every ceiling sits ~3800x above the imp-96352 wall-clock compute ceiling
 *   N ~ 9916, so compute binds first, unchanged.
 *
 *   STATUS: a measurement extension of an existing ceiling (adds rungs, re-fits,
 *   re-solves), not a new derivation and not a tightening. The slope-flattens /
 *   ceiling-robust split is the point: a real change in the fitted shape need not
 *   move the extrapolated ceiling if intercept and slope shift offset each other.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96684 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96684-route-m-frobenius-majorant-high-n-rungs.js (source: the measurement this glosses)
 * @see imp-96648-route-m-lammax-frobenius-moment-majorant.js (the eight-rung ladder extended)
 * @see imp-96649-route-m-condfit-rungs-above-6000.js (NMAX=9000 Gram; lam_max flattening beyond 6000)
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (rigorous trace lower ceiling 2.594e7)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (measured composed ceiling 4.109e7)
 *
 * Ticket: imp-96703 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The robustness headword, baked verbatim (no re-import).
const FROBENIUS_CEILING_ROBUST_HEADWORD = Object.freeze({
  key: 'route-m-frobenius-ceiling-robust-to-high-n-rungs',
  term:
    'imp-96684 verdict: adding the high-N rungs N=7000,8000,9000 to the imp-96648 ' +
    'Frobenius / Wolkowicz-Styan majorant ladder flattens the fitted slope (~1.7%, ' +
    'like the imp-96649 lam_max) but leaves the rigorous-lower conditioning ceiling ' +
    '~3.76e7 ROBUST -- it shifts only +0.42%, it is not tightened',
  definition:
    'The Route M rigorous-lower conditioning ceiling is solved from a log-N fit of a ' +
    'rigorous matrix majorant (Frobenius ||G||_F or Wolkowicz-Styan) to the ' +
    'double-precision breakdown scale cond# = 1/eps. imp-96684 asked whether adding ' +
    'three genuinely new measured rungs (N=7000,8000,9000, on the same NMAX=9000 ' +
    'exact Vasyunin Gram as imp-96649) to the existing eight-rung ladder (N<=6000, ' +
    'imp-96648) would tighten that ceiling once the fit is redone over all eleven rungs.',
  mechanism:
    'The measured Frobenius bound runs 0.42-0.63% below the eight-rung ' +
    'extrapolation at the three new rungs, so re-fitting over all eleven rungs drops ' +
    'the log-slope 0.48652 -> 0.47808 (~1.7% flatter, mirroring the imp-96649 lam_max ' +
    'flattening) while raising the intercept 2.49786 -> 2.55452 (R^2 stays clean, ' +
    '0.99893 -> 0.99869). At the ceiling scale N ~ 4e7 the flatter slope and higher ' +
    'intercept nearly cancel, so the re-solved ceiling moves only ' +
    '3.7479e7 -> 3.7637e7 (factor 1.0042). It remains above the rigorous ' +
    'trace-domination lower ceiling 2.594e7 (imp-96548) and below the imp-96443 ' +
    'measured composed ceiling 4.109e7 (residual factor 1.092, ~76% of the ' +
    'trace-to-measured gap already closed). Wolkowicz-Styan behaves identically ' +
    '(slope 0.48718 -> 0.47867, ceiling shift +0.43%). Every new-rung bound stays a ' +
    'valid rigorous majorant, ~11% above the imp-96649 measured lam_max and ~1.77x ' +
    'below the trace, and every ceiling sits ~3800x above the imp-96352 wall-clock ' +
    'compute ceiling N ~ 9916, so compute binds first, unaffected.',
  verificationStatus:
    'Measurement extension of an existing rigorous-lower ceiling (adds three rungs, ' +
    're-fits, re-solves), not a new derivation. The ceiling still extrapolates the ' +
    'Frobenius log-fit four decades to N ~ 3.76e7, resting on a fitted (not proved) ' +
    'asymptotic for ||G||_F, and shares the non-rigorous imp-96428 lam_min N^-p ' +
    'extrapolation with every other Route M ceiling. Changes no bound; establishes ' +
    'no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96703_FROBENIUS_CEILING_ROBUST_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96703',
  proofSection: 'S-frontier',
  glosses: 'imp-96684',
  question:
    'imp-96648 fit the rigorous-lower Frobenius / Wolkowicz-Styan conditioning ' +
    'ceiling over eight rungs N<=6000. Does adding the imp-96649 high-N rungs ' +
    'N=7000,8000,9000 and re-fitting over all eleven rungs tighten that ceiling, or ' +
    'does it leave it essentially unchanged?',
  headword: FROBENIUS_CEILING_ROBUST_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96684 ' +
    'verdict: the eleven-rung Frobenius majorant slope flattens 0.48652 -> 0.47808 ' +
    '(~1.7%, like the imp-96649 lam_max) but the re-solved rigorous-lower ceiling ' +
    'moves only 3.748e7 -> 3.764e7 (+0.42%) -- ROBUST, not tightened. Establishes ' +
    'nothing; instantiates no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96684 (the measurement this glosses); imp-96648 (the eight-rung ladder ' +
    'extended); imp-96649 (NMAX=9000 Gram, lam_max flattening); imp-96548 (rigorous ' +
    'trace lower ceiling 2.594e7); imp-96443 (measured composed ceiling 4.109e7).',
});

export default IMP96703_FROBENIUS_CEILING_ROBUST_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96703_FROBENIUS_CEILING_ROBUST_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96703-headword-has-required-fields',
    why: 'The headword must name the flattened slope, the +0.42% ceiling shift, and ' +
      'the trace / measured bracketing ceilings -- the entire point of the entry.',
    holds: () => {
      const h = IMP96703_FROBENIUS_CEILING_ROBUST_GLOSSARY_HEADWORD.headword;
      return (
        /0\.47808/.test(h.mechanism) &&
        /3\.7479e7/.test(h.mechanism) &&
        /3\.7637e7/.test(h.mechanism) &&
        /2\.594e7/.test(h.mechanism) &&
        /4\.109e7/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96703-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96703_FROBENIUS_CEILING_ROBUST_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96703_FROBENIUS_CEILING_ROBUST_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96703_FROBENIUS_CEILING_ROBUST_GLOSSARY_HEADWORD.verdict) &&
      IMP96703_FROBENIUS_CEILING_ROBUST_GLOSSARY_HEADWORD.glosses === 'imp-96684',
  },
];

for (const assertion of IMP96703_FROBENIUS_CEILING_ROBUST_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96703-frobenius-ceiling-robust-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
