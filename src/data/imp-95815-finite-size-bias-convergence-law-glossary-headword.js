/**
 * @module imp-95815-finite-size-bias-convergence-law-glossary-headword
 * @fileoverview imp-95815 -- import-light glossary/Concepts headword for the
 *   imp-95788 twin-pair finite-size bias convergence law: the finite-80
 *   block-Toeplitz biasPct over-estimates the infinite-lattice F_inf and
 *   decays super-linearly, monotonically to zero, so a large finite-80 bias
 *   does not destabilize the dual F_inf.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95788 ran the imp-95762 double-double eigensolver at N=80,120,160,200
 *   at the deepest twin-pair cell (delta=ln1.2, rho=1) and found the finite-80
 *   biasPct = 51.63% collapses monotonically toward zero as N grows, confirming
 *   the imp-95744 theta=0 Poisson dual F_inf as the true N -> infinity limit
 *   rather than a defect exposed by the large finite-80 bias. A reader landing
 *   on imp-95788/95762/95744 cold has no quick-lookup definition of this
 *   convergence law or its consequence. This headword bakes those facts
 *   VERBATIM (no re-import of the source modules, to stay import-light) as a
 *   standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   At the deepest twin-pair block-Toeplitz cell, the finite-N primal
 *   lambda_min(N) descends monotonically from above toward the fixed dual
 *   F_inf as N grows (N=80,120,160,200: biasPct = 51.63 -> 17.15 -> 8.19 ->
 *   4.82, a ~10.7x reduction), and the log-log slope of biasPct vs N is
 *   steeper than -1 at every rung -- i.e. the bias decays FASTER than 1/N
 *   (super-linear). So a large finite-N bias at one truncation size is only
 *   evidence of where that truncation sits on the convergence curve, not
 *   evidence against the infinite-lattice dual value it is converging to.
 *
 *   MECHANISM: because the primal is confirmed descending monotonically from
 *   above toward the dual across an entire N-ladder, the dual is pinned as the
 *   limit regardless of how large the bias is at any single finite N -- the
 *   direction and monotonicity of the trend are what carry the evidential
 *   weight, not the raw bias magnitude at the smallest N.
 *
 *   SUPERSESSION NOTE: imp-95788's own log-log exponent read (p ~ 2.4-2.7) was
 *   later shown by imp-95803 to be a fixed-iteration under-convergence
 *   artifact -- a fully converged, extended-to-N=500 ladder shows the exponent
 *   drifting toward p ~ 2 (a 1/N^2 law), not locked at 2.4-2.7. imp-95845 then
 *   closed that residual drift: it is the expected O(N^-3) subleading tail on
 *   a FIXED p = 2, with the extrapolated leading constant matching the imp-95839
 *   Widom prefactor C_Widom = 50 pi^4/delta^2 = 146518.83. This headword states
 *   the qualitative law (monotone, super-linear decay to zero) that all three
 *   readings agree on, and points a reader who lands on the imp-95803 "drifting
 *   prefactor" language at the imp-95845 fixed-p=2, exact-constant resolution
 *   rather than the disputed 2.4-2.7 figure.
 *
 *   STATUS: a glossary/Concepts lookup only. Establishes nothing new; changes
 *   no bound; NO QED. No refereed bound is changed.
 *
 * @see imp-95788-twin-pair-deep-corner-finite-n-bias-convergence (source: the convergence law this glosses)
 * @see imp-95762-twin-pair-block-floor-finite80-dd-eigensolver (the finite-80 51.63pct headline the law explains)
 * @see imp-95744-twin-pair-block-floor-belowprec-dd-resolve (the theta=0 Poisson dual F_inf the law confirms)
 * @see imp-95803-twin-pair-deep-corner-bias-exponent-limit (converged ladder superseding the 2.4-2.7 exponent read)
 * @see imp-95845-deep-corner-biasN2-widom-fit (closes the imp-95803 drift as O(N^-3) on a fixed p=2, exact constant C_Widom)
 *
 * Ticket: imp-95815 (content, low). Documentation only; establishes nothing;
 * changes no bound; NO QED; no refereed bound is changed.
 */

// The finite-size bias convergence law headword, baked verbatim (no re-import).
const FINITE_SIZE_BIAS_CONVERGENCE_HEADWORD = Object.freeze({
  key: 'finite-size-bias-convergence-law',
  term:
    'twin-pair finite-size bias convergence law (biasPct super-linear decay to zero)',
  definition:
    'At a finite-N block-Toeplitz truncation of the twin-pair problem, the ' +
    'primal lambda_min(N) descends monotonically FROM ABOVE toward the ' +
    'infinite-lattice dual infimum F_inf as N grows, so the finite-size bias ' +
    'biasPct = 100*(lambda_min(N)/F_inf - 1) collapses monotonically to zero ' +
    '(imp-95788: 51.63% -> 17.15% -> 8.19% -> 4.82% for N=80,120,160,200 at ' +
    'the deepest cell delta=ln1.2, rho=1, a ~10.7x reduction), and the decay ' +
    'is super-linear (log-log slope of biasPct vs N steeper than -1 at every ' +
    'rung). Consequence: a large bias at one finite truncation reflects only ' +
    'that the truncation sits high on the convergence curve, NOT that the ' +
    'infinite-lattice dual F_inf it converges to is unreliable.',
  mechanism:
    'Monotone descent from above across a whole N-ladder is what pins the ' +
    'dual as the true limit -- the trend direction carries the evidential ' +
    'weight, not the raw bias magnitude at the smallest N tested. Super-linear ' +
    'decay (faster than 1/N) is consistent with the exponential edge decay of ' +
    'the underlying sech kernel.',
  verificationStatus:
    'Qualitative law (monotone descent from above, super-linear decay to ' +
    'zero) verified by the imp-95788 N=80..200 ladder and confirmed still ' +
    'monotone by the independently re-run, fully converged imp-95803 ladder ' +
    'extended to N=500. The imp-95788 log-log EXPONENT read (p ~ 2.4-2.7) is ' +
    'superseded by imp-95803: it was a fixed-iteration under-convergence ' +
    'artifact, and the converged exponent drifts toward p ~ 2 instead. That ' +
    'residual drift is NOT an open slowly-varying deviation from p=2 -- ' +
    'imp-95845 fit it and confirmed it is exactly the expected O(N^-3) ' +
    'subleading tail on a FIXED p=2, with leading constant matching the ' +
    'imp-95839 Widom prefactor C_Widom = 50 pi^4/delta^2 = 146518.83. Only ' +
    'the specific 2.4-2.7 figure is superseded; the qualitative convergence ' +
    'law and the F_inf-reliably-pinned conclusion are not affected.',
});

export const IMP95815_FINITE_SIZE_BIAS_CONVERGENCE_LAW_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95815',
  proofSection: 'S-frontier',
  glosses: 'imp-95788',
  question:
    'imp-95788 found that the 51.63% finite-80 biasPct at the twin-pair deep ' +
    'corner (delta=ln1.2, rho=1) collapses monotonically toward zero as N ' +
    'grows. What is the general convergence law this establishes, and why ' +
    'does a large finite-N bias not threaten the reliability of the ' +
    'infinite-lattice dual F_inf it converges to?',
  headword: FINITE_SIZE_BIAS_CONVERGENCE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the ' +
    'imp-95788 finite-size bias convergence law: the finite-N primal descends ' +
    'monotonically from above toward the dual F_inf with super-linear decay ' +
    '(biasPct 51.63 -> 17.15 -> 8.19 -> 4.82% over N=80..200), so a large ' +
    'finite-80 bias reflects only where that truncation sits on the ' +
    'convergence curve, not a defect of F_inf. Flags the imp-95788 2.4-2.7 ' +
    'exponent read as superseded by imp-95803 (drifts toward p~2, since ' +
    'closed by imp-95845 as a fixed p=2 with O(N^-3) tail and exact constant ' +
    'C_Widom) while the qualitative law stands. Establishes nothing; ' +
    'instantiates no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-95788 (the finite-size bias convergence law this glosses); ' +
    'imp-95762 (the finite-80 51.63pct headline the law explains); ' +
    'imp-95744 (the theta=0 Poisson dual F_inf the law confirms as the ' +
    'N->infinity limit); imp-95803 (converged ladder superseding the 2.4-2.7 ' +
    'exponent read); imp-95845 (closes the imp-95803 drift as O(N^-3) on a ' +
    'fixed p=2, exact constant C_Widom = 146518.83).',
});

export default IMP95815_FINITE_SIZE_BIAS_CONVERGENCE_LAW_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95815_FINITE_SIZE_BIAS_CONVERGENCE_LAW_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95815-headword-has-required-fields',
    why: 'The headword must name the monotone-from-above descent, the ' +
      'super-linear decay, the imp-95788 biasPct ladder, and the F_inf-not- ' +
      'threatened consequence -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP95815_FINITE_SIZE_BIAS_CONVERGENCE_LAW_GLOSSARY_HEADWORD.headword;
      return (
        /monotonically/i.test(h.definition) &&
        /51\.63/.test(h.definition) &&
        /super-linear/i.test(h.definition) &&
        /NOT that the/.test(h.definition) &&
        /superseded/i.test(h.verificationStatus)
      );
    },
  },
  {
    id: 'imp95815-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95815_FINITE_SIZE_BIAS_CONVERGENCE_LAW_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95815_FINITE_SIZE_BIAS_CONVERGENCE_LAW_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95815_FINITE_SIZE_BIAS_CONVERGENCE_LAW_GLOSSARY_HEADWORD.verdict) &&
      IMP95815_FINITE_SIZE_BIAS_CONVERGENCE_LAW_GLOSSARY_HEADWORD.glosses === 'imp-95788',
  },
];

for (const assertion of IMP95815_FINITE_SIZE_BIAS_CONVERGENCE_LAW_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95815-finite-size-bias-convergence-law-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
