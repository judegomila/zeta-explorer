/**
 * @module imp-124795-threshold-residual-collapse-viz-data
 *
 * imp-124795: import-light viz-data leaf charting the imp-97838 threshold-crossover residual
 * rel(thr) = (N_cross_closed_form - N_cross_empirical)/N_cross_empirical collapsing across the
 * threshold family thr = 0.9 -> 0.5 -> 0.1 -> 0.01, together with the leading predictor
 * 2*E_flow/E_trunc overlay it tracks across ~5.5 decades. Reuses the frozen
 * IMP97838_THRESHOLD_LANDMARK_RESIDUAL_TREND.thresholdFamily rows verbatim (no re-derivation, no
 * new computation) for a "|rel| vs threshold" log-scale chart with the predictor series alongside.
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97838-threshold-landmark-residual-trend.js (source module)
 * @see imp-33743-sigma-fartail-crossover-closed-form (thr = 0.1 far-tail landmark)
 */

import { IMP97838_THRESHOLD_LANDMARK_RESIDUAL_TREND } from './imp-97838-threshold-landmark-residual-trend.js';

const ROWS = IMP97838_THRESHOLD_LANDMARK_RESIDUAL_TREND.thresholdFamily;

// One chart row per threshold: |rel offset| collapsing against the 2*E_flow/E_trunc overlay.
export const IMP124795_THRESHOLD_RESIDUAL_COLLAPSE = Object.freeze(
  ROWS.map((r) => Object.freeze({
    threshold: r.threshold,
    abs_rel_offset_closed_form: Math.abs(r.rel_offset_closed_form),
    linear_predictor_2x_E_flow_over_E_trunc: r.linear_predictor_2x_E_flow_over_E_trunc,
    rel_over_linear_predictor: r.rel_over_linear_predictor,
  })),
);

export const IMP124795_SUMMARY = Object.freeze({
  law:
    'The imp-97838 closed-form-vs-empirical threshold residual |rel(thr)| collapses monotonically as '
    + `thr drops ${ROWS[0].threshold} -> ${ROWS[1].threshold} -> ${ROWS[2].threshold} -> ${ROWS[3].threshold}, `
    + `running |rel| ${Math.abs(ROWS[0].rel_offset_closed_form)} -> ${Math.abs(ROWS[1].rel_offset_closed_form)} `
    + `-> ${Math.abs(ROWS[2].rel_offset_closed_form)} -> ${Math.abs(ROWS[3].rel_offset_closed_form)}, tracking the `
    + `leading predictor 2*E_flow/E_trunc = ${ROWS[0].linear_predictor_2x_E_flow_over_E_trunc} -> `
    + `${ROWS[1].linear_predictor_2x_E_flow_over_E_trunc} -> ${ROWS[2].linear_predictor_2x_E_flow_over_E_trunc} -> `
    + `${ROWS[3].linear_predictor_2x_E_flow_over_E_trunc} across ~5.5 decades.`,
  reading:
    `thresholds: ${IMP124795_THRESHOLD_RESIDUAL_COLLAPSE.map((r) => r.threshold).join(', ')}; `
    + `|rel|: ${IMP124795_THRESHOLD_RESIDUAL_COLLAPSE.map((r) => r.abs_rel_offset_closed_form).join(' -> ')}; `
    + `predictor: ${IMP124795_THRESHOLD_RESIDUAL_COLLAPSE.map((r) => r.linear_predictor_2x_E_flow_over_E_trunc).join(' -> ')}.`,
  verdict:
    'Presentation only: every row is reused verbatim from imp-97838 (a measurement, not a derivation), '
    + 'relabeled for a "|rel| vs threshold" log-scale chart with the 2*E_flow/E_trunc predictor overlay; no '
    + 'new computation. Measurement / sensitivity only on the inherited imp-3220/imp-3406 extrapolation '
    + 'surrogate, not a rigorous asymptotic. Changes no bound; establishes no operator positivity; '
    + 'no refereed bound is changed; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP124795_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp124795-four-rows',
    description: 'one chart row per threshold family member (thr = 0.9, 0.5, 0.1, 0.01)',
    holds: () => IMP124795_THRESHOLD_RESIDUAL_COLLAPSE.length === 4,
  },
  {
    id: 'imp124795-abs-rel-collapses-monotonically',
    description: '|rel offset| falls monotonically as threshold drops down the family',
    holds: () =>
      IMP124795_THRESHOLD_RESIDUAL_COLLAPSE.every(
        (row, i) => i === 0 || row.abs_rel_offset_closed_form < IMP124795_THRESHOLD_RESIDUAL_COLLAPSE[i - 1].abs_rel_offset_closed_form,
      ),
  },
  {
    id: 'imp124795-tracks-linear-predictor',
    description: 'every |rel| is within 15% of the 2*E_flow/E_trunc predictor it overlays',
    holds: () =>
      IMP124795_THRESHOLD_RESIDUAL_COLLAPSE.every(
        (row) => Math.abs(row.abs_rel_offset_closed_form / row.linear_predictor_2x_E_flow_over_E_trunc - 1) < 0.15,
      ),
  },
  {
    id: 'imp124795-spans-five-decades',
    description: '|rel| spans from >0.1 at thr=0.9 down to <1e-6 at thr=0.01',
    holds: () =>
      IMP124795_THRESHOLD_RESIDUAL_COLLAPSE[0].abs_rel_offset_closed_form > 0.1
      && IMP124795_THRESHOLD_RESIDUAL_COLLAPSE[3].abs_rel_offset_closed_form < 1e-6,
  },
  {
    id: 'imp124795-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP124795_SUMMARY.verdict) && /NO QED/.test(IMP124795_SUMMARY.verdict),
  },
];

for (const assertion of IMP124795_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124795 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP124795_SUMMARY;
