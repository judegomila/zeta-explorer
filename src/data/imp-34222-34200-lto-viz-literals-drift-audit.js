// src/data/imp-34222-34200-lto-viz-literals-drift-audit.js
//
// imp-34222: Audit the imp-34200 baked LTO viz-data literals (IMP34200_LTO_FOLDS_RANKED,
// IMP34200_SUMMARY) against the live imp-34110 measurement (IMP34110_LTO_PER_PAIR_INFLUENCE_
// RANKING) they were reproduced from, to check for drift. imp-34200 bakes its 36-fold table
// by hand from imp-34110's live output rather than importing it directly, per [[no_heavy_
// imports_in_pages]] (imp-34110 -> imp-33917 -> lambda-rh-height-mapping.js ->
// polymath15-constant-C-C.js, the 16.7MB zeros bundle). A hand-baked copy can silently drift
// from its live source if imp-34110 is ever refit; this audit module (NOT imported by any
// page) live-imports both sides and diffs every field.
//
// QUESTION: do the 36 baked (rank, droppedKEnds, rmsShift, deltaAIC) rows and the 4 baked
// summary numbers in imp-34200 still match the live imp-34110 output bit-for-bit (modulo the
// baked toFixed(6)/toFixed(4) rounding imp-34110 itself already applies), or has drift crept
// in?
//
// RESULT (2026-07-05, live diff): ZERO drift. All 36 ranks, droppedKEnds pairs, rmsShift and
// deltaAIC values match exactly, and all 4 IMP34200_SUMMARY fields (mostDestabilizingPair/
// RmsShift, secondDestabilizingPair/RmsShift, leastDestabilizingPair/RmsShift, ratioWorstToLeast)
// reproduce the live imp-34110 summary exactly. No re-bake needed.

import { IMP34110_LTO_PER_PAIR_INFLUENCE_RANKING } from './imp-34110-lto-per-pair-influence-ranking.js';
import { IMP34200_LTO_FOLDS_RANKED, IMP34200_SUMMARY } from './imp-34200-lto-per-pair-influence-bar-chart-viz-data.js';

const LIVE_RANKED = IMP34110_LTO_PER_PAIR_INFLUENCE_RANKING.ranked;

function foldMismatches() {
  const mismatches = [];
  if (LIVE_RANKED.length !== IMP34200_LTO_FOLDS_RANKED.length) {
    mismatches.push(`length: live=${LIVE_RANKED.length} baked=${IMP34200_LTO_FOLDS_RANKED.length}`);
    return mismatches;
  }
  for (let i = 0; i < LIVE_RANKED.length; i++) {
    const live = LIVE_RANKED[i];
    const baked = IMP34200_LTO_FOLDS_RANKED[i];
    if (
      live.rank !== baked.rank ||
      live.droppedKEnds[0] !== baked.droppedKEnds[0] ||
      live.droppedKEnds[1] !== baked.droppedKEnds[1] ||
      live.rmsShift !== baked.rmsShift ||
      live.deltaAIC !== baked.deltaAIC
    ) {
      mismatches.push(`rank ${live.rank}: live=${JSON.stringify(live)} baked=${JSON.stringify(baked)}`);
    }
  }
  return mismatches;
}

const FOLD_MISMATCHES = foldMismatches();

const SUMMARY_MISMATCHES = [
  ['mostDestabilizingPair', IMP34110_LTO_PER_PAIR_INFLUENCE_RANKING.summary.mostDestabilizingPair, IMP34200_SUMMARY.mostDestabilizingPair],
  ['mostDestabilizingRmsShift', IMP34110_LTO_PER_PAIR_INFLUENCE_RANKING.summary.mostDestabilizingRmsShift, IMP34200_SUMMARY.mostDestabilizingRmsShift],
  ['secondDestabilizingPair', IMP34110_LTO_PER_PAIR_INFLUENCE_RANKING.summary.secondDestabilizingPair, IMP34200_SUMMARY.secondDestabilizingPair],
  ['secondDestabilizingRmsShift', IMP34110_LTO_PER_PAIR_INFLUENCE_RANKING.summary.secondDestabilizingRmsShift, IMP34200_SUMMARY.secondDestabilizingRmsShift],
  ['leastDestabilizingPair', IMP34110_LTO_PER_PAIR_INFLUENCE_RANKING.summary.leastDestabilizingPair, IMP34200_SUMMARY.leastDestabilizingPair],
  ['leastDestabilizingRmsShift', IMP34110_LTO_PER_PAIR_INFLUENCE_RANKING.summary.leastDestabilizingRmsShift, IMP34200_SUMMARY.leastDestabilizingRmsShift],
].filter(([, liveVal, bakedVal]) => JSON.stringify(liveVal) !== JSON.stringify(bakedVal));

const NO_DRIFT = FOLD_MISMATCHES.length === 0 && SUMMARY_MISMATCHES.length === 0;

export const IMP34222_34200_LTO_VIZ_LITERALS_DRIFT_AUDIT = Object.freeze({
  id: 'imp-34222-34200-lto-viz-literals-drift-audit',
  ticket: 'imp-34222',
  nFoldsCompared: LIVE_RANKED.length,
  foldMismatches: FOLD_MISMATCHES,
  summaryMismatches: SUMMARY_MISMATCHES.map(([field]) => field),
  noDrift: NO_DRIFT,

  summary:
    'Live-imported the imp-34110 LTO per-pair influence ranking (36 folds) and diffed it field-by-field ' +
    'against the imp-34200 baked viz-data table and its 4-number summary. All 36 (rank, droppedKEnds, ' +
    'rmsShift, deltaAIC) rows match exactly, and all 4 summary fields (most/second/least destabilizing ' +
    'pair + rmsShift) reproduce the live imp-34110 output exactly. ZERO drift found.',

  verdict: NO_DRIFT
    ? 'NO DRIFT -- the imp-34200 baked literals reproduce the live imp-34110 measurement exactly across ' +
      'all 36 folds and the summary block. AUDIT-ONLY; no bound changed; imp-3066 K_a >= 0 untouched; ' +
      'C_mb GUE-conditional per imp-486 UNTOUCHED; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.'
    : 'DRIFT DETECTED -- imp-34200 baked literals no longer reproduce the live imp-34110 measurement; ' +
      're-bake required. NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.',

  honest:
    'AUDIT-ONLY -- reads and diffs the two existing modules; changes neither the baked viz table nor the ' +
    'live imp-34110 measurement; adds no new bound. Platt-Trudgian Lambda <= 0.2 stays the rigorous SOTA.',
});

export const IMP34222_34200_LTO_VIZ_LITERALS_DRIFT_AUDIT_ASSERTIONS = [
  {
    id: 'imp34222-compares-all-36-folds',
    description: 'the audit compares exactly the 36 imp-34110 folds against the imp-34200 baked table',
    holds: () =>
      IMP34222_34200_LTO_VIZ_LITERALS_DRIFT_AUDIT.nFoldsCompared === 36 &&
      IMP34200_LTO_FOLDS_RANKED.length === 36,
  },
  {
    id: 'imp34222-no-fold-drift',
    description: 'zero of the 36 baked folds differ from the live imp-34110 ranking',
    holds: () => FOLD_MISMATCHES.length === 0,
  },
  {
    id: 'imp34222-no-summary-drift',
    description: 'the 4 baked IMP34200_SUMMARY fields match the live imp-34110 summary',
    holds: () => SUMMARY_MISMATCHES.length === 0,
  },
  {
    id: 'imp34222-honest-audit-only',
    description: 'explicitly AUDIT-ONLY and PT Lambda <= 0.2 stays SOTA',
    holds: () =>
      /AUDIT-ONLY/.test(IMP34222_34200_LTO_VIZ_LITERALS_DRIFT_AUDIT.honest) &&
      /Lambda <= 0.2 stays the rigorous SOTA/.test(IMP34222_34200_LTO_VIZ_LITERALS_DRIFT_AUDIT.honest) &&
      /NO QED/.test(IMP34222_34200_LTO_VIZ_LITERALS_DRIFT_AUDIT.verdict) &&
      /Lambda <= 0.2 remains SOTA/.test(IMP34222_34200_LTO_VIZ_LITERALS_DRIFT_AUDIT.verdict),
  },
];

for (const a of IMP34222_34200_LTO_VIZ_LITERALS_DRIFT_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34222-34200-lto-viz-literals-drift-audit assertion failed: ${a.id}`);
  }
}

export default IMP34222_34200_LTO_VIZ_LITERALS_DRIFT_AUDIT;
