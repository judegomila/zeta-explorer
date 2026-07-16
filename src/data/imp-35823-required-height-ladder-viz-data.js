/**
 * @module imp-35823-required-height-ladder-viz-data
 *
 * imp-35823 (ux): lightweight, import-light viz-data module for a chart of the
 * imp-35763 merged six-rung REQ-4 required-height ladder: the required-height
 * multiple 200 / log T0 and the residual log-height gap 200 - log T0, across
 * peak / sigma<0.9 / crossover~sigma=0.5 / sigma<0.1 / PT rungs, ascending in
 * log T0.
 *
 * Reference literals are baked directly from the imp-35763 filledLadder rows
 * (source: imp-35763-req4-required-height-sigma-landmark-fill.js) -- no
 * re-derivation, no heavy import.
 *
 * @see imp-35763-req4-required-height-sigma-landmark-fill.js (source: the six-rung filled ladder this plots)
 * @see imp-35722-req4-required-height-landmark-ladder.js (the three base rungs: peak, crossover, PT)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay.js (source of the sigma < 0.9/0.5/0.1 interior rungs)
 *
 * Ticket: imp-35823 (ux, medium). Presentation only, RH-free; C_mb GUE-conditional
 * (imp-486) untouched; changes no bound; NO QED.
 */

export const IMP35823_REQUIRED_HEIGHT_LADDER = [
  { key: 'peak', label: 'sigma-peak (N~9.22e5)', logT0: 13.23, requiredMultiple: 15.12 },
  { key: 'sigma0_9', label: 'sigma<0.9 (N~2.57e7)', logT0: 16.3, requiredMultiple: 12.27 },
  { key: 'sigma0_5', label: 'sigma<0.5 ~ crossover (N~3.27e9)', logT0: 20.85, requiredMultiple: 9.59 },
  { key: 'cross', label: 'E_coll=E_trunc crossover (N~3.28e9)', logT0: 20.86, requiredMultiple: 9.59 },
  { key: 'sigma0_1', label: 'sigma<0.1 (N~3.21e11)', logT0: 25.22, requiredMultiple: 7.93 },
  { key: 'pt', label: 'Platt-Trudgian anchor (T0=3e12)', logT0: 28.73, requiredMultiple: 6.96 },
].sort((a, b) => a.logT0 - b.logT0);

export const IMP35823_LOG_T0_NEEDED = 200; // imp-35538 REQ-4 binding log-height (T0 >= e^200 ~ 7.23e86)

export const IMP35823_LADDER_GRID = IMP35823_REQUIRED_HEIGHT_LADDER.map((row) => ({
  ...row,
  logHeightGap: +(IMP35823_LOG_T0_NEEDED - row.logT0).toFixed(2),
}));

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35823_ASSERTIONS = [
  {
    id: 'imp35823-six-rungs-ascending-logt0',
    description: 'the merged ladder has exactly 6 rungs, strictly ascending in logT0',
    holds: () =>
      IMP35823_LADDER_GRID.length === 6 &&
      IMP35823_LADDER_GRID.every((r, i) => i === 0 || r.logT0 > IMP35823_LADDER_GRID[i - 1].logT0),
  },
  {
    id: 'imp35823-required-multiple-non-increasing',
    description:
      'the required-height multiple 200/logT0 is non-increasing as logT0 ascends (the sigma<0.5 and crossover rungs coincide, imp-33582 F3)',
    holds: () =>
      IMP35823_LADDER_GRID.every(
        (r, i) => i === 0 || r.requiredMultiple <= IMP35823_LADDER_GRID[i - 1].requiredMultiple,
      ),
  },
  {
    id: 'imp35823-multiple-consistent-with-gap',
    description: 'requiredMultiple * logT0 ~ 200 and logHeightGap = 200 - logT0 at every rung',
    holds: () =>
      IMP35823_LADDER_GRID.every(
        (r) =>
          Math.abs(r.requiredMultiple * r.logT0 - IMP35823_LOG_T0_NEEDED) < 0.5 &&
          Math.abs(r.logHeightGap - (IMP35823_LOG_T0_NEEDED - r.logT0)) < 1e-6,
      ),
  },
  {
    id: 'imp35823-deepest-rung-still-falls-short',
    description: 'even the deepest (PT) rung still needs requiredMultiple > 1 (no reachable landmark binds the natural rate)',
    holds: () => IMP35823_LADDER_GRID.every((r) => r.requiredMultiple > 1),
  },
];

for (const a of IMP35823_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35823-required-height-ladder-viz-data assertion failed: ${a.id}`);
  }
}
