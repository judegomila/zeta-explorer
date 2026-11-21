/**
 * @module imp-96623-vasyunin-lammax-slope-crossvalidation
 *
 * imp-96623 (content, DOCUMENTATION ONLY): four modules now bear on the Vasyunin
 * lam_max log-slope 0.3526 but no single surface tabulates them together --
 * imp-96443 (the measured fit), imp-96562/imp-96592 (the off-diagonal slope
 * identity), imp-96586 (the mean-field rank-one brackets), and imp-96594 (the
 * pre-asymptotic reach). This module is that comparison table: it re-exports the
 * published constants from each source verbatim (no new computation) and lines them
 * up against the target so the cross-validation -- and the fact that NONE of the
 * non-trivial estimates independently predicts 0.3526 -- is visible at a glance.
 *
 * Documentation only. Changes no bound, establishes no operator positivity, makes
 * no RH claim. No refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (the target: measured fit)
 * @see imp-96562-route-m-lammax-offdiagonal-szego-assessment.js (off-diagonal slope identity)
 * @see imp-96592-route-m-offdiag-slope-identity-verification.js (independent re-run confirming it)
 * @see imp-96586-route-m-lammax-meanfield-cesaro-proxy.js (rank-one mean-field brackets)
 * @see imp-96594-vasyunin-lammax-pre-asymptotic-reach.js (fitted-only reach)
 */

import { IMP96443_FIT as IMP96443_LAMMAX_FIT } from './imp-96443-route-m-vasyunin-lammax-measured.js';
import { IMP96592_VERIFICATION } from './imp-96592-route-m-offdiag-slope-identity-verification.js';
import { IMP96586_PROXIES } from './imp-96586-route-m-lammax-meanfield-cesaro-proxy.js';
import { IMP96594_REACH, IMP96594_COMPUTE_CEILING_N } from './imp-96594-vasyunin-lammax-pre-asymptotic-reach.js';

// The target every row below is compared against (imp-96443 measured fit).
export const IMP96623_TARGET_SLOPE = IMP96443_LAMMAX_FIT.b; // 0.3526253785070698

// One row per source. `independent` marks whether the value is a genuine
// alternative prediction of the coefficient (true) or a structurally-forced
// re-derivation / diagnostic that cannot differ from the target (false).
export const IMP96623_ESTIMATES = Object.freeze([
  Object.freeze({
    source: 'imp-96443',
    method: 'measured power-iteration OLS fit, lam_max(N) = a + b log N',
    value: IMP96443_LAMMAX_FIT.b,
    ratioToTarget: 1,
    independent: false,
    status: 'TARGET -- the measured value every other row is checked against, not a prediction of it',
  }),
  Object.freeze({
    source: 'imp-96562 / imp-96592',
    method: 'off-diagonal slope identity: offDiag(N) = lam_max(N) - I(1,1), refit',
    value: IMP96592_VERIFICATION.offDiagSlope,
    ratioToTarget: IMP96592_VERIFICATION.offDiagSlope / IMP96443_LAMMAX_FIT.b,
    independent: false,
    status: 'TRIVIAL CONSISTENCY CHECK -- bit-identical to the target by OLS shift-invariance (subtracting a constant cannot change the fitted slope); confirms the intercept, not the coefficient, so it is not an independent estimate',
  }),
  Object.freeze({
    source: 'imp-96586 (P1)',
    method: 'peak-row Gershgorin / Cesaro L1 mass, Sum_{k<=N} G_{1,k}',
    value: IMP96586_PROXIES.p1_rowSum.slope,
    ratioToTarget: IMP96586_PROXIES.p1_rowSum.ratioToMeasured,
    independent: true,
    status: 'OVERSHOOTS by ~13.35x -- a rank-one mean-field proxy, not a prediction',
  }),
  Object.freeze({
    source: 'imp-96586 (P2)',
    method: 'Perron one-step Rayleigh from e_1, (G^2)_11 / G_11',
    value: IMP96586_PROXIES.p2_perronOneStep.slope,
    ratioToTarget: IMP96586_PROXIES.p2_perronOneStep.ratioToMeasured,
    independent: true,
    status: 'UNDERSHOOTS / converges (~0.047x) -- the peak row is Hilbert-Schmidt so this rank-one proxy saturates to a bounded edge instead of log-growth',
  }),
]);

// imp-96594 does not offer an alternative slope value -- it quantifies how far the
// accessible ladder is from confirming 0.3526 asymptotically. Kept as a separate
// diagnostic rather than a fifth estimate row.
export const IMP96623_REACH_DIAGNOSTIC = Object.freeze({
  source: 'imp-96594',
  claim: '0.3526 survives only as a fitted extrapolation until N is astronomically large',
  within10pctLog10N: IMP96594_REACH.within10pct.log10N, // ~37.255
  within1pctLog10N: IMP96594_REACH.within1pct.log10N, // ~372.550
  computeCeilingN: IMP96594_COMPUTE_CEILING_N, // 9916
});

// The two genuinely independent (non-trivial) estimates and where they land the
// target between them.
export const IMP96623_BRACKET = Object.freeze({
  low: IMP96623_ESTIMATES[3].value, // P2, ~0.0166
  high: IMP96623_ESTIMATES[2].value, // P1, ~4.7062
  targetStrictlyBetween:
    IMP96623_ESTIMATES[3].value < IMP96623_TARGET_SLOPE &&
    IMP96623_TARGET_SLOPE < IMP96623_ESTIMATES[2].value,
});

export const IMP96623_VERDICT = Object.freeze({
  question:
    'lined up together, do any of the independent (non-trivial) slope estimates predict the measured Vasyunin lam_max log-slope 0.3526?',
  anyIndependentEstimateMatches: false,
  onlyRelationIsBracketing: true,
  anyBoundMoved: false,
  conclusion:
    'NO. Of the four modules, one IS the target (imp-96443), one is a structurally-forced ' +
    'consistency check that cannot differ from it (imp-96562/imp-96592), and the two genuinely ' +
    'independent rank-one mean-field proxies (imp-96586 P1, P2) only bracket it by ~280x without ' +
    'landing near it. imp-96594 separately shows the fitted slope will not be confirmed ' +
    'asymptotically at any reachable N (10% reach N >= 10^37.26, far past the imp-96352 compute ' +
    'ceiling 9916). No independent method currently predicts 0.3526; it remains a measured fit. ' +
    'Documentation only; no bound moved; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96623_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Documentation only: every value here is ' +
  're-exported verbatim from imp-96443 / imp-96562 / imp-96592 / imp-96586 / imp-96594, no new ' +
  'computation is performed, and no bound is moved. The table shows that no independent estimate ' +
  'currently predicts the measured Vasyunin lam_max log-slope 0.3526.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96623_ASSERTIONS = [
  {
    id: 'imp96623-target-matches-imp96443',
    holds: () => Math.abs(IMP96623_TARGET_SLOPE - 0.3526253785070698) < 1e-12,
    why: 'the target slope is re-exported verbatim from the imp-96443 measured fit.',
  },
  {
    id: 'imp96623-consistency-check-near-identical',
    holds: () => Math.abs(IMP96623_ESTIMATES[1].value - IMP96623_TARGET_SLOPE) < 1e-9,
    why: 'the imp-96562/imp-96592 off-diagonal slope identity is bit-identical (to floating rounding) to the target, confirming it is a trivial consistency check, not an independent estimate.',
  },
  {
    id: 'imp96623-bracket-strict',
    holds: () => IMP96623_BRACKET.targetStrictlyBetween === true,
    why: 'the two independent rank-one mean-field proxies from imp-96586 strictly bracket the target slope 0.3526.',
  },
  {
    id: 'imp96623-independence-flags-correct',
    holds: () =>
      IMP96623_ESTIMATES[0].independent === false &&
      IMP96623_ESTIMATES[1].independent === false &&
      IMP96623_ESTIMATES[2].independent === true &&
      IMP96623_ESTIMATES[3].independent === true,
    why: 'exactly the two rank-one mean-field proxies are flagged as independent estimates; the target and the trivial consistency check are not.',
  },
  {
    id: 'imp96623-honesty-gate-no-qed',
    holds: () =>
      IMP96623_VERDICT.anyIndependentEstimateMatches === false &&
      IMP96623_VERDICT.anyBoundMoved === false &&
      /NO QED/.test(IMP96623_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96623_HONEST_BANNER) &&
      /RH open/.test(IMP96623_HONEST_BANNER),
    why: 'documentation only: no independent estimate matches the target, no bound moved, honesty markers intact.',
  },
];

for (const a of IMP96623_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96623-vasyunin-lammax-slope-crossvalidation assertion failed: ${a.id}`,
    );
  }
}

export default {
  targetSlope: IMP96623_TARGET_SLOPE,
  estimates: IMP96623_ESTIMATES,
  reachDiagnostic: IMP96623_REACH_DIAGNOSTIC,
  bracket: IMP96623_BRACKET,
  verdict: IMP96623_VERDICT,
  banner: IMP96623_HONEST_BANNER,
};
