/**
 * @module imp-96900-krein-trace-vacuous-glossary-headword
 * @fileoverview imp-96900 -- import-light glossary/Concepts headword for the imp-96876
 *   finding IMP96876_TRACE_VACUOUS: the imp-96848 closed-form Krein tail-trace residual
 *   bound Tr(B^{-1} R_T) is mathematically VALID but ~3e15x numerically VACUOUS at
 *   N=100, 2a=ln3, T=4800 -- because the looseness lives in the lambda_max(R_T) <=
 *   Tr(B^{-1} R_T) step (which sums ALL N tail-mode masses under sigma_2 ~ t^4), not in
 *   the un-computed constant.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96876 cross-tabulated a direct high-T Krein solve against two coexisting upper-
 *   bound routes for the same t-truncation residual: the imp-96827 GEOM/EXP fitted
 *   envelope, and the imp-96848 closed-form trace bound. It found the GEOM fit is the
 *   only numerically usable route (2.84x the actual residual), while the TRACE bound,
 *   though a valid upper bound, overshoots the measured residual by ~3.15e15x. This
 *   headword bakes that distinction verbatim (no re-import of the imp-96876 module, to
 *   stay import-light) so a reader does not mistake "TRACE is unproved" for the actual
 *   diagnosis, which is "TRACE is proved but the bounding step it uses is astronomically
 *   loose".
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE NUMBERS. At N=100, 2a=ln3, T=4800: actual residual-beyond-T = 4.586e-4;
 *   TRACE = Tr(B^{-1} R_T) = 1.446e12 (a converged quadrature, not roundoff -- the
 *   transform diagonal |Psi_N(t)|^2 ~ t^{-7.4} makes sigma_2 |Psi|^2 ~ t^{-3.4}
 *   integrable). TRACE / actual = 3.15e15.
 *   (b) LOCATION OF THE LOOSENESS. The bounding chain is lambda_max(R_T) <= Tr(B^{-1}
 *   R_T), i.e. the true residual (a single eigenvalue) is majorized by a sum over ALL N
 *   eigenvalues of R_T. Because sigma_2 grows like t^4, the high-index tail modes carry
 *   enormous trace mass that has nothing to do with the minimising eigenvector -- so the
 *   inequality is valid but the sum-vs-single-eigenvalue gap is ~15 orders of magnitude.
 *   (c) NOT A CONSTANT PROBLEM. The vacuity is NOT because IMP96848_TAILTRACE_MAJORANT
 *   (the rigorous interval-arithmetic version of this constant) is uncomputed or
 *   pessimistically rounded -- even a perfectly-assembled exact evaluation of that
 *   majorant would still be ~15 orders too loose, because the slack is structural (in
 *   the lambda_max <= Tr step itself), not numerical.
 *   (d) FIX DIRECTION (not attempted here). A usable rigorous residual bound must
 *   control lambda_max(R_T) directly (a per-mode-weighted argument), not bound it via
 *   the trace of the whole tail block.
 *
 *   STATUS: a diagnosis of why one specific upper-bound route is numerically useless,
 *   drawn from a single cross-validated measurement (N=100, 2a=ln3). Not a proof, not a
 *   new bound, not an operator-positivity result. NO QED. No refereed bound is changed.
 *
 * @see imp-96876-krein-tresidual-crossval-measurement.js (source measurement: the
 *   IMP96876_TRACE_VACUOUS sub-gap and the GEOM-vs-TRACE cross-tabulation this glosses)
 * @see imp-96848-krein-tresidual-rigorous-tailtrace-bound.js (the closed-form TRACE
 *   bound / IMP96848_TAILTRACE_MAJORANT whose numerical looseness is diagnosed here)
 * @see imp-96827-krein-tresidual-envelope-extrapolation.js (the GEOM/EXP fitted envelope
 *   that remains the only numerically usable residual route)
 *
 * Ticket: imp-96900 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The trace-vacuous headword, baked verbatim (no re-import).
const KREIN_TRACE_VACUOUS_HEADWORD = Object.freeze({
  key: 'krein-tailtrace-bound-valid-but-numerically-vacuous',
  term:
    'imp-96876 finding IMP96876_TRACE_VACUOUS: the imp-96848 closed-form Krein tail-trace ' +
    'residual bound Tr(B^{-1} R_T) is a mathematically VALID upper bound but ~3e15x ' +
    'numerically VACUOUS (measured at N=100, 2a=ln3, T=4800), because the looseness is ' +
    'in the lambda_max(R_T) <= Tr(B^{-1} R_T) majorization step, not in the un-computed ' +
    'constant',
  definition:
    'At N=100, 2a=ln3, a direct high-T Krein solve measures the actual t-truncation ' +
    'residual beyond T=4800 as 4.585800e-4. The imp-96848 closed-form bound evaluates to ' +
    'Tr(B^{-1} R_T) = 1.446437e12 at the same T -- a genuine converged quadrature value ' +
    '(the transform diagonal |Psi_N(t)|^2 decays like t^{-7.4}, so sigma_2 |Psi|^2 ~ ' +
    't^{-3.4} is integrable, not a roundoff artifact), and it is a valid upper bound ' +
    '(1.446e12 >> 4.586e-4). But it overshoots the actual residual by traceOverActual = ' +
    '3.15e15 -- roughly 15 orders of magnitude looser than the imp-96827 GEOM envelope ' +
    '(1.304e-3, only 2.84x actual), which remains the only numerically usable residual ' +
    'bound.',
  mechanism:
    'The looseness sits in the bounding chain itself: lambda_max(R_T) <= Tr(B^{-1} R_T) ' +
    'replaces a single eigenvalue (the true residual, tied to the minimising eigenvector) ' +
    'with a sum over ALL N eigenvalues of the tail block R_T. Since sigma_2 grows like ' +
    't^4, the high-index tail modes carry enormous trace mass unrelated to the ' +
    'minimising eigenvector, inflating the sum far past the single eigenvalue it is meant ' +
    'to bound. Because this slack is structural, a perfectly-assembled rigorous interval ' +
    'evaluation of IMP96848_TAILTRACE_MAJORANT (the un-computed constant) would still be ' +
    '~15 orders too loose -- sharpening, not resolving, the imp-96848 sub-gap. A usable ' +
    'rigorous bound would instead need to control lambda_max(R_T) directly, e.g. via a ' +
    'per-mode-weighted argument, rather than bounding it through the trace of the whole ' +
    'tail block.',
  verificationStatus:
    'Direct high-T Krein solve (N=100, Gegenbauer C_n^{13/2} basis, condB=1) plus scalar ' +
    'tail quadrature of Tr(B^{-1} R_T), cross-tabulated against the imp-96827 GEOM/EXP ' +
    'envelope (tmp/imp-96876-tresidual-crossval.py, /tmp/rhvenv, scipy 1.18). A single ' +
    'cross-validated measurement diagnosing why one bound route is numerically vacuous; ' +
    'not an asymptotic theorem, not a new interval majorant. IMP96848_TAILTRACE_MAJORANT ' +
    'stays open; establishes no operator positivity; interval-rigorous reach stays ' +
    '2a <= 0.96; RH open; no refereed bound is changed; NO QED.',
});

export const IMP96900_KREIN_TRACE_VACUOUS_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96900',
  proofSection: 'S-frontier',
  glosses: 'imp-96876',
  question:
    'imp-96876 measured that the imp-96848 closed-form Tr(B^{-1} R_T) residual bound is ' +
    '~3e15x looser than the actual residual at N=100, 2a=ln3, T=4800. Is that looseness a ' +
    'defect of the un-computed IMP96848_TAILTRACE_MAJORANT constant (fixable by a ' +
    'tighter evaluation), or is it structural in the bounding argument itself?',
  headword: KREIN_TRACE_VACUOUS_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96876 ' +
    'finding IMP96876_TRACE_VACUOUS: the imp-96848 TRACE bound is mathematically valid ' +
    '(1.446e12 >> 4.586e-4 actual, a converged quadrature) but ~3.15e15x numerically ' +
    'vacuous, and the looseness is structural -- it lives in the lambda_max(R_T) <= ' +
    'Tr(B^{-1} R_T) step (sigma_2 ~ t^4 loads the high-index tail modes), not in the ' +
    'un-computed constant. Even a perfectly-assembled IMP96848_TAILTRACE_MAJORANT would ' +
    'remain ~15 orders too loose; a usable rigorous bound needs to control lambda_max(R_T) ' +
    'directly. The imp-96827 GEOM envelope (2.84x actual) remains the only numerically ' +
    'usable residual bound. Establishes nothing; instantiates no interval; moves no ' +
    'bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96876 (the cross-validated measurement and IMP96876_TRACE_VACUOUS sub-gap this ' +
    'glosses); imp-96848 (the closed-form TRACE bound / IMP96848_TAILTRACE_MAJORANT ' +
    'diagnosed here); imp-96827 (the GEOM/EXP envelope used as the comparison route).',
});

export default IMP96900_KREIN_TRACE_VACUOUS_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96900_KREIN_TRACE_VACUOUS_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96900-headword-has-required-fields',
    why: 'The headword must name both the traceOverActual magnitude and the ' +
      'lambda_max-vs-Tr structural-location claim -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96900_KREIN_TRACE_VACUOUS_GLOSSARY_HEADWORD.headword;
      return (
        /3\.15e15|3e15/i.test(h.term) &&
        /lambda_max/i.test(h.mechanism) &&
        /structural/i.test(h.mechanism) &&
        /1\.446e12|1\.446437e12/.test(h.definition)
      );
    },
  },
  {
    id: 'imp96900-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96900_KREIN_TRACE_VACUOUS_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96900_KREIN_TRACE_VACUOUS_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96900_KREIN_TRACE_VACUOUS_GLOSSARY_HEADWORD.verdict) &&
      IMP96900_KREIN_TRACE_VACUOUS_GLOSSARY_HEADWORD.glosses === 'imp-96876',
  },
];

for (const assertion of IMP96900_KREIN_TRACE_VACUOUS_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96900-krein-trace-vacuous-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
