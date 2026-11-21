/**
 * @module imp-96824-route-m-mt-ratio-fit-invariant-glossary-headword
 * @fileoverview imp-96824 -- import-light glossary/Concepts headword for the imp-96773
 *   verdict: the Route M total conditioning-ceiling ratio M/T = 1.5841640857
 *   (imp-96713 Finding 3) is genuinely FIT-INVARIANT, not an artifact of the shared
 *   Frobenius machinery it was previously checked against -- a property of the two
 *   anchors M and T alone, reproduced through a structurally independent pivot family.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96713 reported M/T = (F/T)*(M/F) = 1.5842 as invariant because the pivot
 *   ceiling F cancels algebraically, but checked it only against two Frobenius fits
 *   (imp-96684 eleven-rung and, via imp-96694, fourteen-rung) drawn from the SAME
 *   ||G||_F log law -- so the two "checks" could not, by construction, disagree.
 *   imp-96773 closed that gap with a STRUCTURALLY INDEPENDENT third pivot family (the
 *   Wolkowicz-Styan two-moment bound, a different matrix inequality, plus a fit-free
 *   geometric-mean pivot). This headword bakes that verdict verbatim (no re-import of
 *   the imp-96773 module, to stay import-light) as a standalone quick-lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The two anchors T = 2.593728e7 (imp-96548 trace-domination, rigorous lower) and
 *   M = 4.108890e7 (imp-96443 measured composed) carry NO Frobenius content, so
 *   M/T = 1.5841640857 was never at risk of being a Frobenius artifact. Re-deriving
 *   it through the Wolkowicz-Styan pivots ws11 = 3.762877e7 and ws8 = 3.746925e7
 *   (each giving a DIFFERENT (P/T, M/P) split: 1.450760x1.091955 vs 1.444610x1.096603)
 *   and through the fit-free geometric-mean pivot P = sqrt(T*M) = 3.264559e7
 *   (symmetric split 1.258636x1.258636) all reproduce the product 1.5841640857 to
 *   machine precision (rel residual < 1e-12). Every pivot family gives a different
 *   split of the same invariant product -- the pivot cancels identically, so the ratio
 *   is a property of the two Frobenius-free anchors alone, not the fitting machinery
 *   used to reach them.
 *
 *   STATUS: an accuracy audit (confirms an algebraic invariance already implied by
 *   M/T = (P/T)*(M/P) for any P != 0, against genuinely independent pivots), not a new
 *   measurement and not a rigorous derivation. Both anchors still rest on ~four-decade
 *   extrapolations: T on the imp-96548 trace asymptotic and M on the imp-96443
 *   measured lam_max log-fit (non-rigorous), so the ratio inherits that sub-gap.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96773 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96773-route-m-mt-invariance-independent-pivot.js (source: the audit this glosses)
 * @see imp-96713-route-m-conditioning-ceiling-decomposition-reaudit.js (the original M/T=1.5842 invariance claim)
 * @see imp-96684-route-m-frobenius-majorant-high-n-rungs.js (source of T, M, and the Wolkowicz-Styan pivots)
 * @see imp-96686-route-m-lammax-overstatement-figure-label-audit.js (the ~1.58x ceiling ratio label)
 *
 * Ticket: imp-96824 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The fit-invariance headword, baked verbatim (no re-import).
const MT_RATIO_FIT_INVARIANT_HEADWORD = Object.freeze({
  key: 'route-m-mt-conditioning-ceiling-ratio-fit-invariant-independent-pivot',
  term:
    'imp-96773 verdict: the Route M total conditioning-ceiling ratio ' +
    'M/T = 1.5841640857 (imp-96713) is genuinely FIT-INVARIANT -- a structurally ' +
    'independent Wolkowicz-Styan pivot and a fit-free geometric-mean pivot both ' +
    'reproduce it to machine precision, each through a different (P/T, M/P) split',
  definition:
    'imp-96713 found M/T = (F/T)*(M/F) = 1.5842 invariant to the pivot ceiling F, ' +
    'but checked it only against two Frobenius fits (imp-96684 eleven-rung, ' +
    'imp-96694 fourteen-rung) drawn from the SAME ||G||_F log law, so the two ' +
    '"checks" could not, by construction, disagree. imp-96773 re-derives the ratio ' +
    'through a STRUCTURALLY INDEPENDENT pivot family -- the Wolkowicz-Styan ' +
    'two-moment bound lam_max <= trace/n + sqrt(trace(G^2)/n - (trace/n)^2)*sqrt(n-1), ' +
    'a different matrix inequality than ||G||_F -- plus an extreme fit-free ' +
    'geometric-mean pivot P = sqrt(T*M).',
  mechanism:
    'The two anchors T = 2.593728e7 (imp-96548 trace-domination, rigorous lower) and ' +
    'M = 4.108890e7 (imp-96443 measured composed) carry NO Frobenius content, so ' +
    'M/T = 1.5841640857 is a ratio of two Frobenius-free quantities. Using ' +
    'ws11 = 3.762877e7: P/T = 1.450760, M/P = 1.091955, product = 1.5841640857. ' +
    'Using ws8 = 3.746925e7 (a DIFFERENT split): P/T = 1.444610, M/P = 1.096603, ' +
    'SAME product 1.5841640857. Using the fit-free geometric-mean pivot ' +
    'P = sqrt(T*M) = 3.264559e7: symmetric split P/T = M/P = 1.258636, again ' +
    'product 1.5841640857. All three independent pivots land strictly in the band ' +
    'T < P < M (a non-trivial two-leg decomposition) and reproduce the invariant to ' +
    'relative residual < 1e-12, making the algebra unmistakable: M/T is a property ' +
    'of the two anchors alone, never the Frobenius fit.',
  verificationStatus:
    'Accuracy audit (confirms an algebraic invariance against genuinely independent ' +
    'pivots, closing the "same-machinery" gap left by imp-96713), not a new ' +
    'measurement and not a rigorous derivation. Both anchors still rest on ' +
    '~four-decade extrapolations -- T on the imp-96548 trace asymptotic and M on the ' +
    'imp-96443 measured lam_max log-fit (non-rigorous) -- so the ratio inherits that ' +
    'sub-gap. Changes no bound; establishes no operator positivity; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP96824_MT_RATIO_FIT_INVARIANT_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96824',
  proofSection: 'S-frontier',
  glosses: 'imp-96773',
  question:
    'imp-96713 found the Route M total conditioning-ceiling ratio M/T = 1.5842 ' +
    'invariant to the pivot ceiling F, but checked it only against two Frobenius ' +
    'fits from the same ||G||_F log law. Does a structurally independent pivot -- a ' +
    'different matrix inequality, or a fit-free construction -- still reproduce it?',
  headword: MT_RATIO_FIT_INVARIANT_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96773 ' +
    'verdict: the two anchors T (2.594e7, rigorous) and M (4.109e7, measured) carry ' +
    'no Frobenius content, and the structurally independent Wolkowicz-Styan pivots ' +
    '(ws11, ws8) plus a fit-free geometric-mean pivot all reproduce ' +
    'M/T = 1.5841640857 to machine precision via different (P/T, M/P) splits -- the ' +
    'ratio is genuinely pivot-free. Establishes nothing; instantiates no interval; ' +
    'moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96773 (the independent-pivot audit this glosses); imp-96713 (the original ' +
    'M/T=1.5842 invariance claim); imp-96684 (source of T, M, and the ' +
    'Wolkowicz-Styan pivots ws11/ws8); imp-96548 (rigorous trace ceiling T=2.594e7); ' +
    'imp-96443 (measured composed ceiling M=4.109e7).',
});

export default IMP96824_MT_RATIO_FIT_INVARIANT_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96824_MT_RATIO_FIT_INVARIANT_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96824-headword-has-required-fields',
    why: 'The headword must name the invariant ratio, both independent Wolkowicz-Styan ' +
      'pivots, and the fit-free geometric-mean pivot -- the entire point of the ' +
      'glossary entry.',
    holds: () => {
      const h = IMP96824_MT_RATIO_FIT_INVARIANT_GLOSSARY_HEADWORD.headword;
      return (
        /1\.5841640857/.test(h.mechanism) &&
        /3\.762877e7/.test(h.mechanism) &&
        /3\.746925e7/.test(h.mechanism) &&
        /sqrt\(T\*M\)/.test(h.mechanism) &&
        /2\.593728e7/.test(h.mechanism) &&
        /4\.108890e7/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96824-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96824_MT_RATIO_FIT_INVARIANT_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96824_MT_RATIO_FIT_INVARIANT_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96824_MT_RATIO_FIT_INVARIANT_GLOSSARY_HEADWORD.verdict) &&
      IMP96824_MT_RATIO_FIT_INVARIANT_GLOSSARY_HEADWORD.glosses === 'imp-96773',
  },
];

for (const assertion of IMP96824_MT_RATIO_FIT_INVARIANT_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96824-route-m-mt-ratio-fit-invariant-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
