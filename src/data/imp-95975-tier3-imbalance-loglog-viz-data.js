/**
 * @module imp-95975-tier3-imbalance-loglog-viz-data
 *
 * imp-95975 (ux): import-light viz-data module charting the imp-95925
 * TIER-1/TIER-3 imbalance dQ/dm(m) against midM on a log-log axis. The
 * imp-95925 module measures the imbalance on seven consecutive m-intervals
 * and finds it collapses ~198x from +3.79e-6 (midM~21) to +1.91e-8
 * (midM~130), with the positive tail (midM>=70) decaying like
 * ~midM^-2.95 -- but that finding has never been plotted anywhere. This
 * module bakes |dQdm| vs midM (log-log requires the absolute value,
 * since the 41->60 interval is negative) and flags the single sign
 * wobble at that interval so a reader can see it is an isolated dip, not
 * part of the decay trend.
 *
 * All values are copied verbatim from the imp-95925 INTERVALS export
 * (via its public sweep.intervals field) -- no re-derivation, no
 * re-execution of the underlying Q0_RECON quadrature.
 *
 * MEASUREMENT / PRESENTATION ONLY. Changes no bound, establishes no
 * operator positivity, no RH claim; no refereed bound is changed
 * . Catalan G irrationality OPEN; Sun arXiv:2609.04176 unrefereed.
 * NO QED.
 *
 * @see imp-95925-tier3-imbalance-largem-sweep.js (source finding: the
 *   INTERVALS sweep and the tailLogLogSlope ~ -2.95 fit)
 * @see imp-95900-tier3-per-locus-cancellation.js (the exact decomposition
 *   dQ/dm = C_1 + D_3(m) this imbalance sweep sharpens)
 *
 * Ticket: imp-95975 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { TIER3_IMBALANCE_LARGEM_SWEEP } from './imp-95925-tier3-imbalance-largem-sweep.js';

const INTERVALS = TIER3_IMBALANCE_LARGEM_SWEEP.sweep.intervals;

// one row per interval: midM, |dQdm| (for log-log), raw signed dQdm, and
// a sign-wobble flag (the 41->60 interval is the only negative one)
export const IMP95975_IMBALANCE_LOGLOG = INTERVALS.map((r) => ({
  from: r.from,
  to: r.to,
  midM: r.midM,
  dQdm: r.dQdm,
  absImbalance: Math.abs(r.dQdm),
  isSignWobble: r.dQdm < 0,
}));

// the positive large-m tail used for the ~midM^-2.95 log-log fit line
// (imp-95925 finding.tailLogLogSlope), midM >= 70
export const IMP95975_TAIL_POINTS = IMP95975_IMBALANCE_LOGLOG.filter((p) => p.midM >= 70);

export const IMP95975_TAIL_SLOPE = TIER3_IMBALANCE_LARGEM_SWEEP.finding.tailLogLogSlope; // ~-2.95

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP95975_ASSERTIONS = [
  {
    id: 'imp95975-loglog-rows-match-source-intervals-verbatim',
    description:
      'every row is copied verbatim from the imp-95925 sweep.intervals export, one row per interval',
    holds: () =>
      IMP95975_IMBALANCE_LOGLOG.length === INTERVALS.length
      && IMP95975_IMBALANCE_LOGLOG.every(
        (row, i) => row.midM === INTERVALS[i].midM && row.dQdm === INTERVALS[i].dQdm,
      ),
  },
  {
    id: 'imp95975-sign-wobble-is-exactly-the-41-to-60-interval',
    description:
      'the only negative-imbalance row is the 41->60 interval, matching the imp-95925 documented sign wobble',
    holds: () => {
      const wobble = IMP95975_IMBALANCE_LOGLOG.filter((p) => p.isSignWobble);
      return wobble.length === 1 && wobble[0].from === 41 && wobble[0].to === 60;
    },
  },
  {
    id: 'imp95975-tail-points-are-monotone-decreasing-in-absImbalance',
    description:
      'the positive large-m tail (midM>=70) has strictly decreasing |imbalance|, consistent with the ~midM^-2.95 decay',
    holds: () =>
      IMP95975_TAIL_POINTS.length === 3
      && IMP95975_TAIL_POINTS.every(
        (p, i) => i === 0 || p.absImbalance < IMP95975_TAIL_POINTS[i - 1].absImbalance,
      )
      && IMP95975_TAIL_SLOPE < -2 && IMP95975_TAIL_SLOPE > -4,
  },
];

for (const a of IMP95975_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95975-tier3-imbalance-loglog-viz-data assertion failed: ${a.id}`);
  }
}
