/**
 * @module imp-124817-knee-amp-bracket-width-collapse-viz-data
 *
 * imp-124817: import-light viz-data leaf charting the imp-124771 bracket-width collapse of the
 * dimensionless E_flow amplification A(W) -- the discrete D2 knee estimator falls monotonically
 * from A ~ 9.542 at the baseline quarter-decade bracket (W = 0.25) to A ~ 9.397 at the finest
 * bracket (W = 0.10), with a linear W -> 0 Richardson extrapolation landing at A ~ 9.33 against the
 * imp-97804 continuous closed-form knee A ~ 9.42. Reuses the frozen
 * IMP124771_KNEE_AMP_BRACKET_WIDTH_RECONCILE ladder/extrapolation/closed-form fields verbatim --
 * no re-derivation, no new computation.
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-124771-knee-amp-bracket-width-reconcile.js (source ladder, Richardson extrapolation, closed-form reconciliation)
 * @see imp-97804-knee-eflow-linear-expansion.js (closed-form A ~ 9.42)
 * @see imp-97805-knee-eflow-amplification-ratio.js (discrete A ~ 9.54 PPD-refined baseline)
 */

import { IMP124771_KNEE_AMP_BRACKET_WIDTH_RECONCILE } from './imp-124771-knee-amp-bracket-width-reconcile.js';

const {
  widthLadder,
  wZeroExtrapolation,
  closedFormA,
  baselineA_W025: baselineA,
  fineA_W010: fineA,
  baselineResidualPct,
  fineResidualPct,
  residualCollapseFactor,
} = IMP124771_KNEE_AMP_BRACKET_WIDTH_RECONCILE;

// Bracket-width ladder, ascending in W (narrowest -> widest), for a falling-collapse line chart.
export const IMP124817_WIDTH_LADDER_SERIES = Object.freeze(
  [...widthLadder]
    .filter((r) => r.A !== null)
    .sort((a, b) => a.W - b.W)
    .map((r) => Object.freeze({ W: r.W, A: r.A })),
);

// The W -> 0 endpoint markers: the Richardson extrapolation and the imp-97804 closed form, both
// evaluated at the continuum limit the discrete ladder is falling toward.
export const IMP124817_W_ZERO_MARKERS = Object.freeze([
  Object.freeze({ key: 'richardsonExtrapolation', label: 'linear W -> 0 Richardson extrapolation', W: 0, A: wZeroExtrapolation }),
  Object.freeze({ key: 'closedForm', label: 'imp-97804 closed form (continuous d2p/dt2=0 knee)', W: 0, A: closedFormA }),
]);

export const IMP124817_SUMMARY = Object.freeze({
  baselineA, // ~9.542
  fineA, // ~9.397
  wZeroExtrapolation, // ~9.33
  closedFormA, // ~9.422
  baselineResidualPct, // ~1.3%
  fineResidualPct, // ~0.3%
  residualCollapseFactor, // >4x
  law:
    `The discrete D2 knee amplification A(W) falls monotonically from A ~ ${baselineA} at the baseline `
    + `bracket W = 0.25 to A ~ ${fineA} at the finest bracket W = 0.10, collapsing the gap to the imp-97804 `
    + `closed-form A ~ ${closedFormA} from ~${baselineResidualPct}% down to ~${fineResidualPct}% `
    + `(a ${residualCollapseFactor}x collapse). The linear W -> 0 Richardson extrapolation gives `
    + `A ~ ${wZeroExtrapolation}, bracketing the closed form from just below.`,
  reading:
    `ladder (W, A): ${IMP124817_WIDTH_LADDER_SERIES.map((r) => `(${r.W},${r.A})`).join(', ')}; `
    + `W -> 0 markers: Richardson ~${wZeroExtrapolation}, closed form ~${closedFormA}.`,
  verdict:
    'Presentation only: every ladder point and both W -> 0 markers are reused verbatim from imp-124771 '
    + '(a measurement, not a derivation), reshaped into a falling collapse series plus a pair of continuum '
    + 'endpoint markers for a chart; no new computation. Measurement / sensitivity only on the inherited '
    + 'imp-3220/imp-3406 extrapolation surrogate, not a rigorous asymptotic. Changes no bound; establishes '
    + 'no operator positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; '
    + 'no refereed bound is changed; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP124817_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp124817-five-ladder-points',
    description: 'one ladder point per imp-124771 bracket width (all five widths)',
    holds: () => IMP124817_WIDTH_LADDER_SERIES.length === 5,
  },
  {
    id: 'imp124817-ladder-falls-as-w-narrows',
    description: 'A falls monotonically as W narrows across the ladder (ascending W -> ascending A)',
    holds: () => {
      const s = IMP124817_WIDTH_LADDER_SERIES;
      for (let i = 1; i < s.length; i++) if (!(s[i].A > s[i - 1].A)) return false;
      return true;
    },
  },
  {
    id: 'imp124817-endpoints-match-source',
    description: 'the ladder endpoints match the imp-124771 baseline (W=0.25) and fine (W=0.10) amplifications',
    holds: () => {
      const s = IMP124817_WIDTH_LADDER_SERIES;
      return s[0].W === 0.1 && s[0].A === fineA && s[s.length - 1].W === 0.25 && s[s.length - 1].A === baselineA;
    },
  },
  {
    id: 'imp124817-w-zero-markers-sandwich-finest-bracket',
    description: 'the finest-bracket ladder value sits between the Richardson extrapolation and the closed form',
    holds: () => wZeroExtrapolation < fineA && fineA < closedFormA,
  },
  {
    id: 'imp124817-richardson-brackets-closed-form-from-below',
    description: 'the Richardson extrapolation sits just below the imp-97804 closed form',
    holds: () => wZeroExtrapolation < closedFormA && closedFormA - wZeroExtrapolation < 0.2,
  },
  {
    id: 'imp124817-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP124817_SUMMARY.verdict) && /NO QED/.test(IMP124817_SUMMARY.verdict),
  },
];

for (const assertion of IMP124817_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124817 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP124817_SUMMARY;
