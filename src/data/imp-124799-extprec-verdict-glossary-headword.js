/**
 * @module imp-124799-extprec-verdict-glossary-headword
 * @fileoverview imp-124799 -- import-light glossary/Concepts headword recording the imp-124767
 *   extended-precision verdict: the imp-97823 double-precision deep-window ~4e-4 log-linear
 *   residual is a GENUINE O(sqrt(g)) running correction to the kernel-fold exponent p -> -1/2,
 *   NOT a double-precision measurement floor.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-97823 measured the deep-window slope of log10|K| vs log10(g) over
 *   g = 1e-5 .. 1e-8 at double precision, finding p = -0.4994 (upslope) / -0.5006 (downslope)
 *   with a ~4e-4 log-linear residual -- and flagged that g < 1e-8 rungs approach the
 *   landmark-bisection round-off floor, leaving the residual's origin (running term vs
 *   precision artifact) undecided. imp-124767 re-ran the SAME closed-form surrogate in mpmath
 *   at dps = 60: re-running the identical g = 1e-5 .. 1e-8 window reproduces the ~4e-4 residual
 *   essentially unchanged (3.97e-4 / 4.00e-4), which would have collapsed under extended
 *   precision if it were a double-precision floor. Extending four decades deeper to
 *   g = 1e-8 .. 1e-12 (unreachable in double precision) sharpens |p + 1/2| to 1.42e-5 on both
 *   arms and shrinks the residual to ~1.6e-5, with the per-decade deviation from sqrt(10)
 *   decaying by exactly 1/sqrt(10) per decade, opposite-signed on the two arms.
 *   (b) WHY IT IS NEW. imp-97823 left the residual's origin an open question because its
 *   window bottoms out exactly where double precision starts losing digits. imp-124767 settles
 *   it by isolating window from precision: re-running the same window at higher precision
 *   reproduces (not collapses) the residual, and only the deeper, precision-gated window
 *   sharpens p to -1/2.
 *   (c) WHY IT MATTERS. It fixes the interpretation of the imp-97823 measurement for any later
 *   citation: the ~4e-4 gap is a real, vanishing, O(sqrt(g)) cubic-fold correction term
 *   evaluated at the shallow end of that window, not a rounding artifact, so the kernel-fold
 *   exponent is confirmed to be exactly -1/2 with the residual explained rather than merely
 *   suppressed by more precision.
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. This is a precision-vs-window diagnostic on the
 *   imp-97520 conditional-share kernel-fold measurement. The component model is the inherited
 *   imp-3220/imp-3406 extrapolation, not a rigorous asymptotic; the C_mb GUE-conditional per
 *   imp-486 is untouched; establishes no operator positivity; imp-3066 K_a >= 0 untouched.
 *   (e) STATUS: documentation only. No bound moved; no new coefficient pinned beyond re-citing
 *   the imp-124767 fit; the rigorous anchor stays the trace ceiling; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   measurement. Not a new derivation. NO QED.
 *
 * @see imp-124767-extprec-deep-window-exponent.js (source: the extended-precision re-run and
 *   deep-window fit this headword names)
 * @see imp-97823-kernel-decade-growth-sqrt10 (the original double-precision deep window
 *   g=1e-5..1e-8, residual ~4e-4, whose origin imp-124767 settles)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (L1 peak sigma_max ~ 0.949429,
 *   N_peak ~ 9.22e5, the peak the kernel-fold windows are measured around)
 *
 * Ticket: imp-124799 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The extended-precision verdict headword, baked verbatim (no re-import of the heavy zeros bundle).
const EXTPREC_VERDICT_HEADWORD = Object.freeze({
  key: 'extprec-verdict-imp124767',
  term:
    'imp-124767 extended-precision verdict: the imp-97823 ~4e-4 kernel-fold residual is a ' +
    'genuine O(sqrt(g)) running correction, not a double-precision floor',
  definition:
    'Re-running the imp-97823 closed-form surrogate in mpmath at dps = 60 over the IDENTICAL ' +
    'window g = 1e-5 .. 1e-8 reproduces its ~4e-4 log-linear residual essentially unchanged ' +
    '(3.97e-4 upslope / 4.00e-4 downslope, p = -0.499385 / -0.500618) -- a residual that would ' +
    'have collapsed under extended precision if it were a double-precision measurement floor. ' +
    'Extending four decades deeper to g = 1e-8 .. 1e-12 (unreachable in double precision, where ' +
    'sigma_max - g loses ~12 of 16 digits) sharpens |p + 1/2| to 1.42e-5 on both arms and shrinks ' +
    'the residual to ~1.60e-5, ~25x smaller than the shallow-window figure.',
  mechanism:
    'The deep-window per-decade growth ratios deviate from sqrt(10) by -3.11e-4 -> -9.84e-5 -> ' +
    '-3.11e-5 -> -9.84e-6 on the upslope arm (from below) and the sign-flipped sequence on the ' +
    'downslope arm (from above); each step is 1/sqrt(10) = 0.31623 of the previous, the exact ' +
    'O(sqrt(g)) cubic-fold signature of a vanishing amplitude correction to a genuine exponent of ' +
    '-1/2, not a distinct exponent. Because the same window reproduces the residual at higher ' +
    'precision rather than shrinking it, the residual is attributable to the finite-gap running ' +
    'term evaluated at the shallow end of the imp-97823 window, and not to round-off in the ' +
    'landmark bisection.',
  verificationStatus:
    'Re-cited from the imp-124767 measurement module ' +
    '(src/data/imp-124767-extprec-deep-window-exponent.js): the dps = 60 replica of the original ' +
    'imp-97823 window matches its reported residual (~4e-4) and slopes (~-0.4994/-0.5006) to their ' +
    'reported digits; the deep window g=1e-8..1e-12 gives |p + 1/2| < 3e-5 and residual < 5e-5 on ' +
    'both arms, with per-decade growth matching sqrt(10) = 3.162278 to < 0.1%. Naming / glossary ' +
    'headword only; supplies no new bound; the C_C 1/8 ansatz and E_trunc/E_flow component model ' +
    'are untouched; RH open; no refereed bound is changed; NO QED.',
});

export const IMP124799_EXTPREC_VERDICT_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-124799',
  proofSection: 'S-frontier',
  glosses: 'imp-124767',
  question:
    'imp-124767 re-ran the imp-97823 kernel-fold deep-window measurement in extended precision -- ' +
    'what is the headword for the verdict that the ~4e-4 residual is a genuine O(sqrt(g)) running ' +
    'correction and not a double-precision measurement floor?',
  headword: EXTPREC_VERDICT_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-124767 result: the ' +
    'imp-97823 ~4e-4 log-linear residual over g = 1e-5 .. 1e-8 reproduces unchanged when re-run at ' +
    'mpmath dps = 60, ruling out a double-precision floor, and is the genuine finite-gap ' +
    'O(sqrt(g)) cubic-fold running correction; extending to g = 1e-8 .. 1e-12 sharpens the ' +
    'kernel-fold exponent to p -> -1/2 with |p + 1/2| = 1.42e-5. No bound moved; the component ' +
    'model and all pinned surrogate constants are untouched; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-124767 (the extended-precision re-run and verdict this glosses); imp-97823 (the original ' +
    'double-precision deep window g=1e-5..1e-8, residual ~4e-4); imp-97520 (L1 peak sigma_max ~ ' +
    '0.949429, N_peak ~ 9.22e5).',
});

export default IMP124799_EXTPREC_VERDICT_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124799_EXTPREC_VERDICT_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp124799-headword-names-reproduction-and-deep-slope',
    why: 'The headword must name both the shallow-window reproduction (rules out a precision ' +
      'floor) and the deep-window sharpened exponent -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP124799_EXTPREC_VERDICT_GLOSSARY_HEADWORD.headword;
      return (
        /3\.97e-4/.test(h.definition) &&
        /4\.00e-4/.test(h.definition) &&
        /1\.42e-5/.test(h.definition) &&
        /1\.60e-5/.test(h.definition) &&
        /1\/sqrt\(10\)/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp124799-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-124767.',
    holds: () =>
      IMP124799_EXTPREC_VERDICT_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP124799_EXTPREC_VERDICT_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP124799_EXTPREC_VERDICT_GLOSSARY_HEADWORD.verdict) &&
      IMP124799_EXTPREC_VERDICT_GLOSSARY_HEADWORD.glosses === 'imp-124767',
  },
];

for (const assertion of IMP124799_EXTPREC_VERDICT_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124799-extprec-verdict-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
