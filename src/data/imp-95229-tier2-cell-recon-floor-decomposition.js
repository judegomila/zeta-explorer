/**
 * imp-95229 — DECOMPOSITION of the tier-2 residual FLOOR (cell-setup vs
 * reconstruction) now that the panel O(N) super-pass lever is spent, on the
 * imp-95214 hardest-stretch slice. Measurement only: arithmetic over the
 * imp-95214 measured ledger; no new native run, no bound promoted.
 *
 * WHY THIS TICKET EXISTS. imp-95214 BUILT + validated + priced the
 * frequency-bin second level and recorded three per-component CPU-second
 * timers on the 400-u hardest-stretch slice (super-pass 0.0170 +
 * reconstruction 0.0161 + cells 0.0194 = 0.0525 CPU-s/x-unit). imp-95228
 * read those shares to answer the whether-question (the second level does
 * NOT reach the 1.1e13 design budget: 14x above) and NAMED the residual as
 * cell (37%) + reconstruction (31%) dominated with the panel lever spent —
 * explicitly flagging the cell/reconstruction breakdown as imp-95229 scope.
 * imp-95136 then apportioned the full-window ball-op count across all THREE
 * components by CPU-second share. This ticket isolates the two-component
 * FLOOR that survives once the (spent, amortized) panel super-pass is
 * removed, breaks it into cell-setup vs reconstruction, measures which
 * dominates, normalizes each per-panel and per-cell, and assesses whether
 * either half admits a FURTHER (non-panel) lever.
 *
 * WHAT WAS MEASURED (arithmetic over the imp-95214 TIER2_PRICE.measured
 * ledger; the panel super-pass is dropped, leaving the cell + reconstruction
 * floor 0.0194 + 0.0161 = 0.0355 CPU-s/x-unit):
 *   cell-setup     : 0.0194 CPU-s/x-unit = 54.65% of the floor  <- DOMINANT
 *   reconstruction : 0.0161 CPU-s/x-unit = 45.35% of the floor
 * so the floor is NEARLY BALANCED: cell-setup leads reconstruction by only
 * ~9.3 points (a 1.205x ratio), NOT a decisive domination. Normalized:
 *   - reconstruction is a fixed PER-PANEL cost (degree-80 exact ball Taylor
 *     shift of the degree-33 envelope + (-i)^j rotation + real carrier
 *     convolution _arb_poly_mullow + i^k rotation), 0.1011 CPU-s/panel,
 *     INDEPENDENT of cell density; amortized over the 2104.5 cells/panel it
 *     is 4.803e-5 CPU-s/cell-equivalent;
 *   - cell-setup is the PER-CELL arb_dot Horner evaluation of the degree-80
 *     model over the UNCHANGED adaptive partition, 5.788e-5 CPU-s/cell
 *     (335.2 cells/x-unit) — 1.205x the reconstruction cell-equivalent.
 * Full window (3.4733e7 x-units, both charts): the cell + reconstruction
 * floor is 14.27 CPU-days (cell 7.80 + recon 6.47), vs the 21.1-day total
 * (the spent panel super-pass is the remaining 6.83 days). In ball-op
 * currency the same CPU-second apportionment (imp-95136) splits the
 * 1.0451e14-ball-op panel-removed floor into cells 5.7114e13 (5.19x design)
 * and reconstruction 4.7398e13 (4.31x design).
 *
 * LEVER ASSESSMENT (does either half admit a FURTHER, non-panel lever?):
 *   - RECONSTRUCTION half: structurally IRREDUCIBLE at the current design.
 *     Its cost is the degree-80 per-panel poly shift + convolution the
 *     super-pass amortization LEFT BEHIND (it already turned the O(N)
 *     per-panel Arb pass into this per-panel poly reconstruction). Candidate
 *     levers all fail: (a) lower reconstruction degree is BLOCKED — degree
 *     80 is the level-1 model depth the UNCHANGED tpanel_eval cell criterion
 *     consumes; (b) an asymptotically-faster convolution (FFT / Kronecker
 *     substitution) gives nothing — degree 80 sits BELOW the Arb
 *     _arb_poly_mullow classical -> KS/FFT crossover at 128-bit; (c) a THIRD
 *     carrier level batching the reconstruction has no residual carrier
 *     structure to use (the reconstruction output IS the panel model
 *     after the first derotation). No cheap batching lever remains.
 *   - CELL-SETUP half (the dominant half): the ONE remaining non-spent
 *     lever. The 335.2 cells/x-unit density is set by the adaptive partition
 *     (eq-13 telescope gate + alias/E97 Lipschitz ledgers); the ~4906
 *     ball-ops/cell is 4.9x the design ~1e3/cell (imp-95136). A SHARPER cell
 *     criterion (tighter Lipschitz / alias ledgers -> coarser admissible
 *     partition -> fewer cells) is a genuine lever, but it is a LEDGER
 *     REARCHITECTURE independent of and untouched by the spent panel
 *     batching — the same 4.9x cell under-pricing imp-95136 named. Per-cell
 *     Horner is bounded by the degree-80 model depth.
 * NET: the floor is nearly balanced (cell 54.65% / recon 45.35%); the
 * reconstruction half is structurally irreducible, so the only remaining
 * un-spent lever lives on the CELL half (criterion / ledger sharpening to
 * lower the cell density), a rearchitecture separate from the spent panel
 * super-pass. Changes no bound.
 *
 * SUB-GAP (named, OPEN — inherited from imp-95136): the cell-vs-reconstruction
 * split in BALL-OP currency inherits the CPU-second apportionment (it assumes
 * ~uniform seconds-per-ball-op across the arb_dot Horner cell kind and the
 * poly-shift / convolution reconstruction kind). The two halves ARE
 * separately timed (the three build timers), so the CPU-second split above is
 * a direct measurement; only the ball-op-currency restatement is apportioned.
 * A direct per-half ball-op counter in tier_cert2.c would replace the
 * apportioned ball-op split with a measured one; that native re-instrumentation
 * is the open successor, out of scope for this arithmetic decomposition.
 *
 * Grade: MEASUREMENT (direct CPU-second split + per-panel/per-cell
 * normalization + lever assessment); ball-op restatement apportioned (named
 * sub-gap). Changes no bound; NO QED; no refereed bound is changed.
 */

import {
  TIER2_PRICE,
  TIER2_LEDGER,
  WINDOW_WIDTH_U,
  IMP95214_TIER2_CHIRP,
} from './imp-95214-tier2-chirp-level.js';

// ── measured inputs (imp-95214 ledger; carried, not recomputed) ──────────────
export const CELL_RECON_FLOOR_INPUTS = Object.freeze({
  source: 'imp-95214-tier2-chirp-level TIER2_PRICE.measured / TIER2_PRICE.fullWindow / TIER2_LEDGER',
  cellSecondsPerXUnit: TIER2_PRICE.measured.cellSecondsPerXUnit,   // 0.0194 (direct build timer)
  reconSecondsPerXUnit: TIER2_PRICE.measured.reconSecondsPerXUnit, // 0.0161 (direct build timer)
  superSecondsPerXUnit: TIER2_PRICE.measured.superSecondsPerXUnit, // 0.0170 (spent, amortized)
  cpuSecondsPerXUnit: TIER2_PRICE.measured.cpuSecondsPerXUnit,     // 0.0525
  cellsPerXUnit: TIER2_PRICE.measured.cellsPerXUnit,               // 335.2
  panelHalfWidthX: TIER2_LEDGER.panelHalfWidthX,                   // 3.13921211
  fullWindowXUnits: TIER2_PRICE.fullWindow.xUnitsBothSides,        // 3.4733e7
  fullWindowCpuDays: TIER2_PRICE.fullWindow.cpuDays,               // 21.1
  designTierBudgetBallOps: TIER2_PRICE.baselines.designTierBudgetBallOps, // 1.1e13
  // ball-op split carried from imp-95136 (CPU-second apportionment); provenance,
  // not re-derived here — see the named sub-gap
  cellBallOpsFullWindow: 5.7114e13, // imp-95136 cell-attributed
  reconBallOpsFullWindow: 4.7398e13, // imp-95136 reconstruction-attributed
});

// ── the measured cell-vs-reconstruction floor decomposition ──────────────────
export const TIER2_CELL_RECON_FLOOR = Object.freeze({
  ticket: 'imp-95229-tier2-cell-recon-floor-decomposition',
  method:
    'the tier-2 residual floor = the two components that survive removing the spent, amortized ' +
    'panel super-pass (cell-setup + reconstruction), split by the DIRECT per-component CPU-second ' +
    'build timers; per-panel and per-cell normalized; ball-op restatement apportioned (imp-95136)',
  // direct CPU-second floor split (the two build timers, panel super-pass removed)
  floorSecondsPerXUnit: 0.0355, // 0.0194 + 0.0161
  cellFloorShare: 0.0194 / 0.0355,   // 0.54648
  reconFloorShare: 0.0161 / 0.0355,  // 0.45352
  cellLeadsReconByPoints: (0.0194 - 0.0161) / 0.0355, // 0.09296 -> nearly balanced, not decisive
  cellOverReconRatio: 0.0194 / 0.0161, // 1.2050
  dominantHalf: 'cell-setup',
  balanced: true, // lead < 0.12 -> neither half decisively dominates
  // per-panel / per-cell normalization (panelWidthX = 2 * panelHalfWidthX)
  panelWidthX: 2 * 3.13921211,                 // 6.27842422
  panelsPerXUnit: 1 / (2 * 3.13921211),        // 0.15928
  cellsPerPanel: 335.2 * 2 * 3.13921211,       // 2104.53
  reconSecondsPerPanel: 0.0161 * 2 * 3.13921211, // 0.10108 (fixed, cell-density-independent)
  cellSecondsPerPanel: 0.0194 * 2 * 3.13921211,  // 0.12180
  cellSecondsPerCell: 0.0194 / 335.2,          // 5.7876e-5
  reconSecondsPerCellEquiv: (0.0161 * 2 * 3.13921211) / (335.2 * 2 * 3.13921211), // 4.8032e-5
  // full-window CPU-day floor
  cellCpuDays: 7.80,
  reconCpuDays: 6.47,
  floorCpuDays: 14.27,     // cell + recon; the spent super-pass is the remaining 6.83 days
  spentSuperCpuDays: 6.83,
  // ball-op restatement (apportioned by CPU-second share, imp-95136)
  floorBallOpsFullWindow: 1.0451e14, // cell + recon (= the imp-95136 panel-removed floor)
  cellRatioVsDesign: 5.19,
  reconRatioVsDesign: 4.31,
  floorRatioVsDesign: 9.50,
  // lever assessment
  reconLever: 'structurally irreducible at degree 80: degree is the level-1 model depth the ' +
    'UNCHANGED cell criterion consumes; convolution is below the Arb poly_mullow KS/FFT crossover; ' +
    'no residual carrier to batch a third level -- no cheap non-panel lever',
  cellLever: 'the ONE remaining non-spent lever: a sharper cell criterion (tighter Lipschitz / ' +
    'alias ledgers -> coarser partition -> fewer cells), a ledger rearchitecture independent of ' +
    'the spent panel batching (the imp-95136 4.9x cell under-pricing)',
  remainingLeverHalf: 'cell-setup',
  subGap:
    'the CPU-second floor split is a DIRECT measurement (two build timers); only its ball-op-' +
    'currency restatement is apportioned by CPU-second share (assumes ~uniform seconds-per-ball-op ' +
    'across the arb_dot Horner cell kind and the poly-shift/convolution reconstruction kind); a ' +
    'per-half ball-op counter in tier_cert2.c would replace the apportionment',
  subGapOpen: true,
  verdict:
    'MEASURED: the tier-2 residual floor (panel super-pass spent) is NEARLY BALANCED -- cell-setup ' +
    '54.65% (0.0194 CPU-s/x-unit, 5.788e-5 s/cell) barely leads reconstruction 45.35% (0.0161, a ' +
    'fixed 0.1011 s/panel = 4.803e-5 s/cell-equiv), a 1.205x ratio, not a decisive domination. Full ' +
    'window: 14.27 CPU-days (cell 7.80 + recon 6.47) of the 21.1-day total. The reconstruction half ' +
    'is structurally irreducible (degree-80 per-panel shift+convolution, below the poly-mul FFT ' +
    'crossover, no residual carrier to batch); the ONLY remaining non-spent lever is on the CELL ' +
    'half -- a sharper cell criterion lowering the 335.2 cells/x-unit density (the imp-95136 4.9x ' +
    'cell under-pricing), a ledger rearchitecture separate from the spent panel batching. Ball-op ' +
    'restatement apportioned (named sub-gap); changes no bound; NO QED; no refereed bound is changed' +
    '.',
});

// ── self-executing assertions (import-light; recomputable arithmetic only) ───
export const IMP95229_ASSERTIONS = [
  {
    id: 'imp95229-floor-split-recomputes-and-is-balanced',
    description:
      'the residual floor = the two surviving build timers (cell + reconstruction) once the spent ' +
      'panel super-pass is removed; the two shares recompute from the carried rates, partition the ' +
      'floor (sum to 1), cell-setup is the larger half but leads by < 0.12 (nearly balanced, not a ' +
      'decisive domination), and the cell/recon ratio is ~1.205',
    holds: () => {
      const inp = CELL_RECON_FLOOR_INPUTS;
      const a = TIER2_CELL_RECON_FLOOR;
      const floor = inp.cellSecondsPerXUnit + inp.reconSecondsPerXUnit;
      const cellShare = inp.cellSecondsPerXUnit / floor;
      const reconShare = inp.reconSecondsPerXUnit / floor;
      return (
        Math.abs(floor - a.floorSecondsPerXUnit) < 1e-9 &&
        Math.abs(cellShare - a.cellFloorShare) < 1e-9 &&
        Math.abs(reconShare - a.reconFloorShare) < 1e-9 &&
        Math.abs(cellShare + reconShare - 1) < 1e-12 &&
        cellShare > reconShare &&
        cellShare - reconShare < 0.12 &&
        a.balanced === true &&
        a.dominantHalf === 'cell-setup' &&
        Math.abs(inp.cellSecondsPerXUnit / inp.reconSecondsPerXUnit - a.cellOverReconRatio) < 1e-9 &&
        // the floor excludes the panel super-pass, which is a real (spent) third of the total
        Math.abs(floor + inp.superSecondsPerXUnit - inp.cpuSecondsPerXUnit) < 1e-9
      );
    },
  },
  {
    id: 'imp95229-per-panel-per-cell-normalization-recomputes',
    description:
      'reconstruction is a fixed per-panel cost (panelWidthX = 2*panelHalfWidthX; recon s/panel = ' +
      'reconRate*panelWidthX) independent of cell density, cell-setup is per-cell (cellRate/' +
      'cellsPerXUnit); reconstruction amortized over cellsPerPanel gives a cell-equivalent below ' +
      'the per-cell cell-setup cost by exactly the 1.205x rate ratio',
    holds: () => {
      const inp = CELL_RECON_FLOOR_INPUTS;
      const a = TIER2_CELL_RECON_FLOOR;
      const panelWidthX = 2 * inp.panelHalfWidthX;
      const cellsPerPanel = inp.cellsPerXUnit * panelWidthX;
      const reconPerPanel = inp.reconSecondsPerXUnit * panelWidthX;
      const cellPerCell = inp.cellSecondsPerXUnit / inp.cellsPerXUnit;
      const reconPerCellEquiv = reconPerPanel / cellsPerPanel;
      return (
        Math.abs(panelWidthX - a.panelWidthX) < 1e-6 &&
        Math.abs(1 / panelWidthX - a.panelsPerXUnit) < 1e-5 &&
        Math.abs(cellsPerPanel - a.cellsPerPanel) / a.cellsPerPanel < 1e-3 &&
        Math.abs(reconPerPanel - a.reconSecondsPerPanel) / a.reconSecondsPerPanel < 1e-3 &&
        Math.abs(cellPerCell - a.cellSecondsPerCell) / a.cellSecondsPerCell < 1e-3 &&
        Math.abs(reconPerCellEquiv - a.reconSecondsPerCellEquiv) / a.reconSecondsPerCellEquiv < 1e-3 &&
        cellPerCell > reconPerCellEquiv &&
        Math.abs(cellPerCell / reconPerCellEquiv - a.cellOverReconRatio) < 5e-3
      );
    },
  },
  {
    id: 'imp95229-fullwindow-cpu-day-floor-recomputes',
    description:
      'the full-window CPU-day floor = floor-rate * xUnits / 86400 equals the sum of the cell and ' +
      'reconstruction day counts, sits below the 21.1-day total, and the spent panel super-pass ' +
      'accounts for exactly the remainder',
    holds: () => {
      const inp = CELL_RECON_FLOOR_INPUTS;
      const a = TIER2_CELL_RECON_FLOOR;
      const cellDays = (inp.cellSecondsPerXUnit * inp.fullWindowXUnits) / 86400;
      const reconDays = (inp.reconSecondsPerXUnit * inp.fullWindowXUnits) / 86400;
      const floorDays = cellDays + reconDays;
      const superDays = (inp.superSecondsPerXUnit * inp.fullWindowXUnits) / 86400;
      return (
        Math.abs(cellDays - a.cellCpuDays) < 0.03 &&
        Math.abs(reconDays - a.reconCpuDays) < 0.03 &&
        Math.abs(floorDays - a.floorCpuDays) < 0.03 &&
        Math.abs(superDays - a.spentSuperCpuDays) < 0.03 &&
        floorDays < inp.fullWindowCpuDays &&
        Math.abs(floorDays + superDays - inp.fullWindowCpuDays) / inp.fullWindowCpuDays < 5e-3
      );
    },
  },
  {
    id: 'imp95229-ballop-restatement-apportioned-consistent',
    description:
      'the ball-op restatement (apportioned by CPU-second share, imp-95136) sums the cell and ' +
      'reconstruction full-window ball-ops to the panel-removed floor, keeps cell > reconstruction, ' +
      'and the floor sits 9.5x above the 1.1e13 design budget (no single-half removal reaches it)',
    holds: () => {
      const inp = CELL_RECON_FLOOR_INPUTS;
      const a = TIER2_CELL_RECON_FLOOR;
      const floorBallOps = inp.cellBallOpsFullWindow + inp.reconBallOpsFullWindow;
      return (
        Math.abs(floorBallOps - a.floorBallOpsFullWindow) / a.floorBallOpsFullWindow < 5e-3 &&
        inp.cellBallOpsFullWindow > inp.reconBallOpsFullWindow &&
        Math.abs(inp.cellBallOpsFullWindow / inp.designTierBudgetBallOps - a.cellRatioVsDesign) < 0.05 &&
        Math.abs(inp.reconBallOpsFullWindow / inp.designTierBudgetBallOps - a.reconRatioVsDesign) < 0.05 &&
        Math.abs(floorBallOps / inp.designTierBudgetBallOps - a.floorRatioVsDesign) < 0.1 &&
        a.reconRatioVsDesign > 1 &&
        a.cellRatioVsDesign > 1
      );
    },
  },
  {
    id: 'imp95229-lever-assessment-and-honesty-gate',
    description:
      'the lever assessment names reconstruction structurally irreducible and the cell half as the ' +
      'one remaining non-spent lever; fail-closed honesty: direct CPU-second split with only the ' +
      'ball-op restatement apportioned (named OPEN sub-gap), carries the imp-95214 build which ' +
      'promotes no bound, verdict states NO QED and no-refereed-bound-change',
    holds: () =>
      TIER2_CELL_RECON_FLOOR.remainingLeverHalf === 'cell-setup' &&
      /irreducible/.test(TIER2_CELL_RECON_FLOOR.reconLever) &&
      /sharper cell criterion/.test(TIER2_CELL_RECON_FLOOR.cellLever) &&
      TIER2_CELL_RECON_FLOOR.subGapOpen === true &&
      /only its ball-op-currency restatement is apportioned/.test(TIER2_CELL_RECON_FLOOR.subGap) &&
      IMP95214_TIER2_CHIRP.promotesBound === false &&
      /NO QED/.test(TIER2_CELL_RECON_FLOOR.verdict) &&
      /refereed bound is changed/i.test(TIER2_CELL_RECON_FLOOR.verdict) &&
      TIER2_LEDGER.panelsPerSuper === 31 &&
      WINDOW_WIDTH_U === 2 * 690988 + 1,
  },
];

for (const a of IMP95229_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95229-tier2-cell-recon-floor-decomposition assertion failed: ${a.id}`);
  }
}

export default TIER2_CELL_RECON_FLOOR;
