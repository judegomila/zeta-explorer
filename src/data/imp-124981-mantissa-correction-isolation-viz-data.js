/**
 * @module imp-124981-mantissa-correction-isolation-viz-data
 *
 * imp-124981: import-light viz-data leaf charting the imp-124846 mantissa-correction isolation:
 * the ratio m_k/g_k (mantissa correction against the leading term) and the share m_k/Delta_k
 * (mantissa fraction of the per-nine spacing), both decaying exactly ten-fold per added nine
 * across the per-nine ladder k = 1..5. Reuses the frozen
 * IMP124846_FARTAIL_MANTISSA_LEADING_RATIO_ISOLATION.ratioTable rows verbatim (no re-derivation,
 * no new computation) for a "ratio vs nine-index" log chart.
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-124846-fartail-mantissa-leading-ratio-isolation.js (source module; the ratio table)
 */

import { IMP124846_FARTAIL_MANTISSA_LEADING_RATIO_ISOLATION } from './imp-124846-fartail-mantissa-leading-ratio-isolation.js';

const ROWS = IMP124846_FARTAIL_MANTISSA_LEADING_RATIO_ISOLATION.ratioTable;

// One chart row per nine-index k: both decaying series side by side for a dual-series log chart.
export const IMP124981_MANTISSA_RATIO_DECAY = Object.freeze(
  ROWS.map((r) => Object.freeze({
    nines: r.nines,
    ratio_mk_over_gk: r.ratio_mk_over_gk,
    share_mk_over_delta: r.share_mk_over_delta,
    ratioDecayFromPrev: r.ratioDecayFromPrev,
    shareDecayFromPrev: r.shareDecayFromPrev,
  })),
);

export const IMP124981_SUMMARY = Object.freeze({
  law:
    `m_k/g_k falls ${ROWS.map((r) => r.ratio_mk_over_gk.toExponential(2)).join(' -> ')} and `
    + `m_k/Delta_k falls ${ROWS.map((r) => r.share_mk_over_delta.toExponential(2)).join(' -> ')} over `
    + 'k = 1..5, each decaying exactly ten-fold per added nine (decay ratio climbing to 10 from above), '
    + 'the quantitative isolation of the imp-124793 F3 sub-leading mantissa term against the leading '
    + '9*10^k*log10(e) term.',
  decayLimit: IMP124846_FARTAIL_MANTISSA_LEADING_RATIO_ISOLATION.ratioDecayLimit,
  verdict:
    'Presentation only: every row is reused verbatim from imp-124846 (a closed-form measurement, not a '
    + 'new derivation), paired into a dual-series "ratio vs nine-index" log chart. No new computation. '
    + 'Conditional-share diagnostic on the inherited imp-97723/imp-97744 bare-slope inversion, not a '
    + 'rigorous asymptotic. Changes no bound; establishes no operator positivity; Platt-Trudgian '
    + 'Lambda <= 0.2 remains SOTA; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP124981_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp124981-five-rows',
    description: 'one chart row per nine-index k = 1..5',
    holds: () => IMP124981_MANTISSA_RATIO_DECAY.length === 5,
  },
  {
    id: 'imp124981-ratio-series-decreasing',
    description: 'm_k/g_k strictly decreases across k = 1..5',
    holds: () =>
      IMP124981_MANTISSA_RATIO_DECAY.every(
        (row, i) => i === 0 || row.ratio_mk_over_gk < IMP124981_MANTISSA_RATIO_DECAY[i - 1].ratio_mk_over_gk,
      ),
  },
  {
    id: 'imp124981-share-series-decreasing',
    description: 'm_k/Delta_k strictly decreases across k = 1..5',
    holds: () =>
      IMP124981_MANTISSA_RATIO_DECAY.every(
        (row, i) => i === 0 || row.share_mk_over_delta < IMP124981_MANTISSA_RATIO_DECAY[i - 1].share_mk_over_delta,
      ),
  },
  {
    id: 'imp124981-decay-ratios-approach-ten',
    description: 'both decay-from-prev series climb toward the shared decayLimit = 10',
    holds: () => {
      const rd = IMP124981_MANTISSA_RATIO_DECAY.map((r) => r.ratioDecayFromPrev).filter((x) => x !== null);
      const sd = IMP124981_MANTISSA_RATIO_DECAY.map((r) => r.shareDecayFromPrev).filter((x) => x !== null);
      return (
        rd.length === 4 && sd.length === 4 &&
        rd.every((x) => x > 10) && sd.every((x) => x > 10) &&
        Math.abs(rd[3] - 10) < 1e-2 && Math.abs(sd[3] - 10) < 1e-2
      );
    },
  },
  {
    id: 'imp124981-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP124981_SUMMARY.verdict) && /NO QED/.test(IMP124981_SUMMARY.verdict),
  },
];

for (const assertion of IMP124981_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124981 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP124981_SUMMARY;
