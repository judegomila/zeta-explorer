/**
 * @module imp-96535-ledger-reconciliation-viz-data
 *
 * imp-96535 (ux): import-light viz-data leaf for the imp-96512 height-by-height
 * ledger reconciliation. imp-96512 compared the imp-96493 interior z-score scan
 * against the imp-96089 below-envelope dip significance table at every height
 * either ledger names, and shipped only a baked comparison object, no chart or
 * card. This module reshapes that per-height comparison into a row series a
 * card/table can render directly, marking each height's source ledger
 * (dip-table-only / scan-only / both), the T_CLIP~4.6175e5 exclusion, and the
 * agreement outcome where both ledgers report the same height.
 *
 * No re-derivation: every Tc, nW, z, verdict and agreement flag is copied
 * verbatim from IMP96512_EXCURSION_SIGNIFICANCE_LEDGER_RECONCILIATION (imp-96512).
 * The only new step here is picking a display nW/z per row (the shared value
 * when a height is in both ledgers) and assigning a membership category.
 * Changes no bound; establishes no operator positivity; RH open; NO QED;
 * no refereed bound is changed.
 *
 * @see imp-96512-excursion-significance-ledger-reconciliation.js (the source object this reshapes)
 * @see imp-96493-excursion-2sigma-interior-scan.js
 * @see imp-96089-mean-anchor-window-count-significance-verdict.js
 *
 * Ticket: imp-96535 (ux, sonnet-4-6, medium). Presentation only, RH-free;
 * changes no bound; NO QED. No self-executing assertion throw (per the
 * imp-96294 convention) -- values are validated below via a plain exported
 * check object instead of an import-time throw.
 */

import { IMP96512_EXCURSION_SIGNIFICANCE_LEDGER_RECONCILIATION as SRC } from './imp-96512-excursion-significance-ledger-reconciliation.js';

const membershipFor = (r) => {
  if (r.inBoth) return 'both';
  if (r.inDipTable) return 'dip-only';
  return 'scan-only';
};

export const IMP96535_LEDGER_ROWS = SRC.perHeight.map((r) => {
  const display = r.inBoth ? r.dip : (r.dip || r.scan);
  return {
    Tc: r.Tc,
    membership: membershipFor(r),
    belowClip: r.belowClip,
    nW: display.nW,
    z: display.z,
    dipVerdict: r.dip ? r.dip.verdict : null,
    agree: r.inBoth ? (r.nWAgree && r.zAgree) : null,
    deltaZ: r.inBoth ? r.deltaZ : null,
  };
});

export const IMP96535_OVERLAP_SUMMARY = Object.freeze({
  overlapHeights: SRC.overlapHeights, // [1.5e5, 3.0e5]
  allOverlapAgree: SRC.allOverlapAgree, // true
  maxDeltaZ: SRC.maxDeltaZ, // 0
  dipOnlyHeights: SRC.dipOnlyHeights, // [1e4]
  scanOnlyHeights: SRC.scanOnlyHeights, // the nine imp-96129 dense heights
  tClip: SRC.clipReconciliation.T_clip, // ~4.6175e5
});

export const IMP96535_HONEST_BANNER = SRC.verdict;

// -- plain validation object (no self-executing throw; the imp-96294 convention) --
export const IMP96535_VALIDATION = Object.freeze({
  rowCountMatchesSource: IMP96535_LEDGER_ROWS.length === SRC.perHeight.length,
  bothRowsAgree: IMP96535_LEDGER_ROWS.filter((r) => r.membership === 'both').every((r) => r.agree === true),
  exactlyTwoBothRows: IMP96535_LEDGER_ROWS.filter((r) => r.membership === 'both').length === 2,
  exactlyOneDipOnlyRow: IMP96535_LEDGER_ROWS.filter((r) => r.membership === 'dip-only').length === 1,
  nineScanOnlyRows: IMP96535_LEDGER_ROWS.filter((r) => r.membership === 'scan-only').length === 9,
  allBelowClipRowsFlagged: IMP96535_LEDGER_ROWS.every((r) => r.belowClip === (r.Tc <= IMP96535_OVERLAP_SUMMARY.tClip)),
});

export default IMP96535_LEDGER_ROWS;
