/**
 * @module imp-95834-dd-inverse-iteration-budget-scaling-methodology
 * @fileoverview imp-95834 -- reusable methodology caveat: at deep-corner
 *   twin-pair/Szego cells, a FIXED double-double (DD) inverse-iteration budget
 *   under-converges beyond N~200, producing spurious non-monotone biasPct and
 *   nonsense oscillating exponents. Two independent findings hit the same
 *   failure mode; this module bakes the caveat once as a standalone lookup so
 *   future large-N DD eigensolves cite it instead of rediscovering it.
 *
 *   THE TWO INDEPENDENT HITS
 *   -----------------------------------------------
 *   imp-95803: extending the imp-95788 deep-corner (delta=ln1.2, rho=1) ladder
 *   at the imp-95788 fixed 24-iteration DD inverse-iteration budget beyond
 *   N=200 gave a spurious NON-MONOTONE biasPct (4.82 -> 9.60 -> 2.12 -> 2.46)
 *   with a wildly oscillating apparent exponent (+3.78, -6.77, +0.51).
 *   Iterating each rung to a relative change below 1e-12 instead (75 iters at
 *   N=200 rising to 356 iters at N=500) restored a clean monotone descent.
 *
 *   imp-95799: the DD Levinson inverse iteration at the ln1.35 crossing test
 *   under-converges at large N (N_max ~ 865-1240) because the bottom eigen-gap
 *   (lambda_2 - lambda_min) collapses; lambda_min converges from ABOVE (biased
 *   high at the fixed ~800-solve iteration budget) and goes non-monotone at
 *   the top of the ladder (N=778 -> 865: 4.373311625e-13 -> 4.378747129e-13,
 *   RISES instead of falling), blocking the DD-side crossing confirmation.
 *
 *   THE MECHANISM (why this recurs). At a deep-corner cell, lambda_min sits
 *   many orders of magnitude below the O(1) bulk spectrum (e.g. ~4e-22 at
 *   delta=ln1.2, rho=1). Inverse iteration converges at a rate set by the
 *   ratio of the target eigenvalue to the next-nearest one; as N grows, that
 *   gap shrinks, so the SAME fixed iteration count that was adequate at small
 *   N leaves the large-N rungs under-converged and biased high. The resulting
 *   biasPct / crossing readings are then internally inconsistent (non-monotone,
 *   oscillating local exponents) even though the underlying quantity is
 *   monotone.
 *
 *   THE REUSABLE RULE. Any fixed-iteration DD (or higher-precision) inverse
 *   iteration used to resolve a deep-corner lambda_min beyond N~200 must be
 *   treated as untrustworthy unless one of: (a) the iteration budget is scaled
 *   up with N (e.g. iterate to a relative-change tolerance rather than a fixed
 *   count -- imp-95803 needed 75 -> 356 iters over N=200..500), or (b) a
 *   shift-invert variant is used instead (imp-95820 cures the same
 *   under-convergence this way). A non-monotone or wildly-oscillating reading
 *   at large N is a DIAGNOSTIC of this failure mode, not a real feature of the
 *   underlying quantity.
 *
 *   STATUS: a methodology/Concepts lookup only. Establishes nothing new;
 *   changes no bound; NO QED. No refereed bound is changed.
 *
 * @see imp-95803-twin-pair-deep-corner-bias-exponent-limit (fixed-budget artifact + converged re-run)
 * @see imp-95799-rstar-delta-drift-linear-fit (independent hit: DD Levinson crossing test blocked by the same failure mode)
 * @see imp-95820-shift-invert-dd-toeplitz-crossing (the shift-invert cure for the same under-convergence)
 *
 * Ticket: imp-95834 (meta, low). Documentation only; establishes nothing;
 * changes no bound; NO QED; no refereed bound is changed.
 */

// The DD inverse-iteration budget-scaling methodology caveat, baked verbatim (no re-import).
const DD_INVERSE_ITERATION_BUDGET_SCALING_HEADWORD = Object.freeze({
  key: 'dd-inverse-iteration-budget-must-scale-with-n',
  term:
    'deep-corner DD inverse-iteration budget scaling (fixed budgets under-converge beyond N~200)',
  definition:
    'At a deep-corner twin-pair/Szego cell, lambda_min sits far below the ' +
    'O(1) bulk spectrum, so the convergence rate of double-double (DD) inverse ' +
    'iteration degrades as N grows (the bottom eigen-gap lambda_2 - lambda_min ' +
    'shrinks). A FIXED iteration budget that is adequate at small N therefore ' +
    'leaves large-N rungs (N greater than roughly 200) under-converged and ' +
    'biased HIGH, producing spurious non-monotone readings and wildly ' +
    'oscillating local exponents that are not a real feature of the ' +
    'underlying quantity: imp-95803 saw biasPct swing 4.82 -> 9.60 -> 2.12 -> ' +
    '2.46 at a fixed 24-iteration budget (exponents +3.78, -6.77, +0.51), and ' +
    'imp-95799 independently saw lambda_min RISE from N=778 to N=865 ' +
    '(4.373311625e-13 -> 4.378747129e-13) at a fixed ~800-solve budget, ' +
    'blocking a DD-side crossing confirmation.',
  mechanism:
    'Inverse-iteration convergence rate is set by the ratio of the target ' +
    'eigenvalue to the next-nearest one; at a deep corner that bottom ' +
    'eigen-gap collapses as N grows, so a fixed iteration count silently ' +
    'stops being enough. Both imp-95803 (fixed-24-iter twin-pair ladder) and ' +
    'imp-95799 (fixed-~800-solve DD Levinson crossing test) hit this same ' +
    'mechanism independently.',
  reusableRule:
    'Any fixed-iteration DD inverse iteration resolving a deep-corner ' +
    'lambda_min beyond N~200 must either (a) scale the iteration budget with N ' +
    '(iterate to a relative-change tolerance, e.g. below 1e-12, rather than a ' +
    'fixed count -- imp-95803 needed 75 -> 356 iters over N=200..500 to stay ' +
    'converged), or (b) switch to a shift-invert variant (imp-95820 cures the ' +
    'same failure this way). A non-monotone or oscillating-exponent reading at ' +
    'large N is a diagnostic SIGNAL of under-convergence, not a real feature.',
  verificationStatus:
    'Confirmed independently twice: imp-95803 (converged, iteration-scaled ' +
    'ladder to N=500 restores clean monotone descent) and imp-95799 (RESULT 2, ' +
    'non-monotone lambda_min at N=778..865 traced to the same fixed-budget ' +
    'under-convergence, still open pending a scaled-budget or shift-invert ' +
    'DD-side re-run).',
});

export const IMP95834_DD_INVERSE_ITERATION_BUDGET_SCALING_METHODOLOGY = Object.freeze({
  id: 'imp-95834',
  proofSection: 'S-frontier',
  glosses: ['imp-95803', 'imp-95799'],
  question:
    'imp-95803 and imp-95799 independently found that a fixed DD ' +
    'inverse-iteration budget produces spurious non-monotone lambda_min / ' +
    'biasPct readings beyond N~200 at deep-corner cells. What is the general, ' +
    'reusable methodology caveat this establishes for future large-N DD ' +
    'eigensolves?',
  headword: DD_INVERSE_ITERATION_BUDGET_SCALING_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'METHODOLOGY CAVEAT ONLY (documentation, not a proof). Deep-corner DD ' +
    'inverse-iteration budgets must SCALE with N (or switch to shift-invert): ' +
    'a fixed budget under-converges beyond N~200 because the bottom eigen-gap ' +
    'collapses, and the resulting non-monotone / oscillating readings ' +
    '(imp-95803: biasPct 4.82->9.60->2.12->2.46; imp-95799: lambda_min rising ' +
    'at N=778->865) are a diagnostic artifact, not a real feature. Establishes ' +
    'nothing; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-95803 (fixed-budget artifact + iteration-scaled converged re-run to ' +
    'N=500); imp-95799 (independent hit: DD Levinson crossing test blocked by ' +
    'the same failure mode at N=778..865); imp-95820 (shift-invert cure for ' +
    'the same under-convergence).',
});

export default IMP95834_DD_INVERSE_ITERATION_BUDGET_SCALING_METHODOLOGY;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95834_DD_INVERSE_ITERATION_BUDGET_SCALING_METHODOLOGY_ASSERTIONS = [
  {
    id: 'imp95834-headword-has-required-fields',
    why: 'The headword must name the deep-corner eigen-gap collapse mechanism, ' +
      'cite both independent hits (imp-95803, imp-95799), and state the ' +
      'reusable scale-or-shift-invert rule -- the entire point of the caveat.',
    holds: () => {
      const h = IMP95834_DD_INVERSE_ITERATION_BUDGET_SCALING_METHODOLOGY.headword;
      return (
        /eigen-gap/i.test(h.mechanism) &&
        /4\.82/.test(h.definition) &&
        /778/.test(h.definition) &&
        /shift-invert/i.test(h.reusableRule) &&
        /scale/i.test(h.reusableRule)
      );
    },
  },
  {
    id: 'imp95834-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95834_DD_INVERSE_ITERATION_BUDGET_SCALING_METHODOLOGY.anyBoundMoved === false &&
      /NO QED/.test(IMP95834_DD_INVERSE_ITERATION_BUDGET_SCALING_METHODOLOGY.verdict) &&
      /refereed bound is changed/i.test(IMP95834_DD_INVERSE_ITERATION_BUDGET_SCALING_METHODOLOGY.verdict) &&
      IMP95834_DD_INVERSE_ITERATION_BUDGET_SCALING_METHODOLOGY.glosses.includes('imp-95803') &&
      IMP95834_DD_INVERSE_ITERATION_BUDGET_SCALING_METHODOLOGY.glosses.includes('imp-95799'),
  },
];

for (const assertion of IMP95834_DD_INVERSE_ITERATION_BUDGET_SCALING_METHODOLOGY_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95834-dd-inverse-iteration-budget-scaling-methodology assertion failed: ${assertion.id}`,
    );
  }
}
