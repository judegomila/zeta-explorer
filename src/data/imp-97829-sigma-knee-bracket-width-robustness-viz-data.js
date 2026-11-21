/**
 * @module imp-97829-sigma-knee-bracket-width-robustness-viz-data
 *
 * imp-97829 (ux): import-light viz-data leaf charting the imp-97708 sigma-ramp knee
 * bracket-width robustness result -- the bracketing-free pointwise-curvature inflection at
 * log10 N* = 9.5291 versus the imp-33721 OLS sub-bracket estimator swept across width W, and
 * the W >= 0.4-decade point where the single crossing is smeared away (reconciling the
 * imp-33701 whole-decade [1e10,1e11] reading as a resolution-loss shadow of the same knee).
 * Reuses the frozen IMP97708_SIGMA_KNEE_BRACKET_WIDTH_SENSITIVITY fields verbatim (no
 * re-derivation, no new computation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97708-sigma-knee-bracket-width-sensitivity.js (source module)
 */

import { IMP97708_SIGMA_KNEE_BRACKET_WIDTH_SENSITIVITY } from './imp-97708-sigma-knee-bracket-width-sensitivity.js';

const S = IMP97708_SIGMA_KNEE_BRACKET_WIDTH_SENSITIVITY;

// One row per swept bracket width W: whether it resolves the single D2 crossing, where it
// lands (log10 N*), and its deviation from the bracketing-free pointwise ground truth.
export const IMP97829_WIDTH_ROWS = Object.freeze(
  S.bracketWidthSweep.map((r) =>
    Object.freeze({
      widthDecades: r.widthDecades,
      signChanges: r.signChanges,
      resolved: r.signChanges === 1,
      log10Nstar: r.log10Nstar,
      devFromPointwise: r.devFromPointwise,
    })
  )
);

export const IMP97829_POINTWISE_LOG10_NSTAR = S.pointwiseLog10Nstar;
export const IMP97829_POINTWISE_NSTAR = S.pointwiseNstar;
export const IMP97829_COARSEST_RESOLVED_W = S.coarsestResolvedWidthDecades;
export const IMP97829_FINEST_LOST_W = S.finestLostWidthDecades;
export const IMP97829_MAX_DEV_RESOLVED = S.maxDeviationResolvedFromPointwise;

export const IMP97829_SUMMARY = Object.freeze({
  law:
    'The bracketing-free pointwise ramp-curvature crossing sits at log10 N* = '
    + `${IMP97829_POINTWISE_LOG10_NSTAR} (N* ~ ${IMP97829_POINTWISE_NSTAR}). Every OLS sub-bracket `
    + `width W <= ${IMP97829_COARSEST_RESOLVED_W} converges onto that fixed point (max deviation `
    + `${IMP97829_MAX_DEV_RESOLVED} in log10); at W >= ${IMP97829_FINEST_LOST_W}-decade the single `
    + 'D2 sign change is smeared away entirely -- the resolution threshold that reconciles the '
    + 'imp-33701 whole-decade [1e10,1e11] reading as a coarse-averaging shadow of the same knee.',
  reading:
    IMP97829_WIDTH_ROWS.map((r) =>
      `W=${r.widthDecades}: ${r.resolved ? `N*=${r.log10Nstar} (dev ${r.devFromPointwise})` : 'crossing lost'}`
    ).join(', '),
  verdict:
    'Presentation only: every width-sweep row and the pointwise ground-truth crossing are reused '
    + 'verbatim from imp-97708 (a measurement, not a derivation); no new computation. '
    + 'Conditional-share curvature diagnostic on the inherited imp-3220/imp-3406 extrapolation, not '
    + 'a rigorous asymptotic; changes no bound; establishes no operator positivity; no refereed bound is changed'
    + '; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97829_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97829-eight-width-rows',
    description: 'exactly eight bracket-width rows (W in {0.1..0.5})',
    holds: () => IMP97829_WIDTH_ROWS.length === 8,
  },
  {
    id: 'imp97829-resolved-rows-converge',
    description: 'every resolved row (W <= coarsest resolved) deviates from the pointwise knee by < 0.005',
    holds: () =>
      IMP97829_WIDTH_ROWS.filter((r) => r.resolved).every((r) => r.devFromPointwise !== null && r.devFromPointwise < 0.005),
  },
  {
    id: 'imp97829-wide-brackets-lose-crossing',
    description: 'every row at W >= finest-lost width has zero sign changes (crossing smeared away)',
    holds: () =>
      IMP97829_WIDTH_ROWS.filter((r) => r.widthDecades >= IMP97829_FINEST_LOST_W).every((r) => r.signChanges === 0),
  },
  {
    id: 'imp97829-pointwise-knee-matches-source',
    description: 'the pointwise log10 N* reused here matches the imp-97708 source value',
    holds: () => Math.abs(IMP97829_POINTWISE_LOG10_NSTAR - 9.5291) < 1e-6,
  },
  {
    id: 'imp97829-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP97829_SUMMARY.verdict) && /NO QED/.test(IMP97829_SUMMARY.verdict),
  },
];

for (const assertion of IMP97829_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97829 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97829_SUMMARY;
