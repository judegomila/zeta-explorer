/**
 * imp-95136 — MEASUREMENT of the tier-2 residual ball-op attribution
 * (cells vs reconstruction vs panel) for the W1-CERT frequency-bin second
 * level, sizing the remaining 10-100x lever precisely and naming which
 * sub-cost dominates. Measurement only: no full-window run, no bound
 * promoted.
 *
 * WHY THIS TICKET EXISTS. imp-95213 measured the level-1 tier certifier at
 * ~1.0086e15 ball-ops for the full window, 91.7x above the 1.1e13 two-level
 * design budget, and named the frequency-bin second level as the residual
 * 10-100x lever. imp-95214 then BUILT that second level and measured its
 * component CPU-second rates (super-pass 0.017 + reconstruction 0.0161 +
 * cells 0.0194 = 0.0525 CPU-s/x-unit) plus a TOTAL analytic ball-op rate
 * (4.4501e6 ball-ops/x-unit), but did NOT attribute the ball-op count across
 * the three components. imp-95228 read off the CPU-second shares to answer
 * the whether-question (does the second level reach the design budget: NO,
 * 14.05x above) and named cell/reconstruction as the residual. This ticket
 * completes the missing ball-op-currency attribution so the residual lever
 * can be sized in the SAME units as the 1.1e13 design budget.
 *
 * WHAT WAS MEASURED (arithmetic over the imp-95214 measured ledger; no new
 * native run). The tier-2 full-window analytic ball-op count 1.5456e14 is
 * apportioned across the three components in proportion to their MEASURED
 * CPU-second shares (the only per-component instrumentation the build
 * recorded), yielding:
 *   panel super-pass : 32.38% -> 5.005e13 ball-ops (4.55x the design budget)
 *   reconstruction   : 30.67% -> 4.740e13 ball-ops (4.31x)
 *   cells            : 36.95% -> 5.711e13 ball-ops (5.19x)  <- DOMINANT
 * so CELLS are the single largest ball-op sink, with reconstruction and the
 * amortized panel super-pass close behind and comparable. Sizing the lever:
 *   - removing the panel super-pass ENTIRELY (the only lever imp-95214
 *     amortized, now spent) leaves a cell+reconstruction floor of 1.045e14
 *     ball-ops = 9.50x the design budget: panel batching alone cannot reach
 *     it;
 *   - the cell component alone is 5.711e13 = 5.19x the design budget, and the
 *     cell-attributed ball-ops-per-cell is 4906 vs the design estimate of
 *     ~1e3 ball-ops/cell — the design under-priced the cell criterion itself
 *     by ~4.9x, independent of reconstruction (which the design omitted
 *     entirely) and the residual panel share.
 * Design-budget cross-check: 1.1e13 = (335.2 cells/x-unit x 3.4733e7 x-units)
 * x ~1e3 ball-ops/cell = 1.164e13, confirming the design normalization was
 * cells-only at ~1e3/cell. The total measured 13276 ball-ops/cell is 13.28x
 * that, matching the 14.05x design-budget gap up to the panel/recon overhang.
 *
 * SUB-GAP (named, OPEN): the ball-op split is APPORTIONED by CPU-second
 * shares, i.e. it assumes ~uniform seconds-per-ball-op across the three
 * component kinds (arb_dot Horner cells, poly-shift/convolution
 * reconstruction, O(N) super-pass). The build did not separately instrument
 * per-component ball-op counters, so the true per-component ball-op split
 * could differ from the CPU-second split by each component operation-mix
 * factor. A direct per-component ball-op counter pass (a small tier_cert2.c
 * instrumentation) would tighten this; that native re-instrumentation is the
 * open successor, out of scope for this arithmetic measurement.
 *
 * VERDICT: the residual 10-100x lever between the tier-2 measured 1.5456e14
 * ball-ops and the 1.1e13 design budget is CELL-DOMINATED (37% / 5.19x),
 * with reconstruction (31% / 4.31x) and the spent panel super-pass (32% /
 * 4.55x) comparable; no single-component removal reaches the design budget
 * (panel-removed floor 9.50x), and the design under-priced cells alone by
 * ~4.9x while omitting reconstruction. Measurement only; apportioned by
 * CPU-second shares (named sub-gap); changes no bound; NO QED;
 * no refereed bound is changed.
 */

import {
  TIER2_PRICE,
  TIER2_LEDGER,
  WINDOW_WIDTH_U,
  IMP95214_TIER2_CHIRP,
} from './imp-95214-tier2-chirp-level.js';

// ── the measured inputs (imp-95214 ledger; carried, not recomputed) ──────────
export const BALLOP_ATTRIB_INPUTS = Object.freeze({
  source: 'imp-95214-tier2-chirp-level TIER2_PRICE.measured / TIER2_PRICE.fullWindow',
  superSecondsPerXUnit: TIER2_PRICE.measured.superSecondsPerXUnit, // 0.0170
  reconSecondsPerXUnit: TIER2_PRICE.measured.reconSecondsPerXUnit, // 0.0161
  cellSecondsPerXUnit: TIER2_PRICE.measured.cellSecondsPerXUnit,   // 0.0194
  cpuSecondsPerXUnit: TIER2_PRICE.measured.cpuSecondsPerXUnit,     // 0.0525
  ballOpsPerXUnit: TIER2_PRICE.measured.ballOpsPerXUnit,           // 4.4501e6
  cellsPerXUnit: TIER2_PRICE.measured.cellsPerXUnit,               // 335.2
  fullWindowBallOps: TIER2_PRICE.fullWindow.ballOpsAtSliceRate,    // 1.5456e14
  fullWindowXUnits: TIER2_PRICE.fullWindow.xUnitsBothSides,        // 3.4733e7
  designTierBudgetBallOps: TIER2_PRICE.baselines.designTierBudgetBallOps, // 1.1e13
  designBallOpsPerCell: 1e3, // the two-level design normalization (cells-only)
});

// ── the measured attribution ─────────────────────────────────────────────────
export const TIER2_BALLOP_ATTRIBUTION = Object.freeze({
  ticket: 'imp-95136-tier2-ballop-attribution',
  method:
    'full-window analytic ball-op count apportioned across the three components in proportion ' +
    'to the measured per-component CPU-second shares (the per-component instrumentation the ' +
    'imp-95214 build recorded); assumes ~uniform seconds-per-ball-op across component kinds',
  // CPU-second shares (exact ratios of the measured rates)
  panelShare: TIER2_PRICE.measured.superSecondsPerXUnit / TIER2_PRICE.measured.cpuSecondsPerXUnit, // 0.32381
  reconShare: TIER2_PRICE.measured.reconSecondsPerXUnit / TIER2_PRICE.measured.cpuSecondsPerXUnit, // 0.30667
  cellShare: TIER2_PRICE.measured.cellSecondsPerXUnit / TIER2_PRICE.measured.cpuSecondsPerXUnit,   // 0.36952
  // apportioned full-window ball-ops per component
  panelBallOps: 5.0048e13,
  reconBallOps: 4.7398e13,
  cellBallOps: 5.7114e13,
  // ratios versus the 1.1e13 design budget
  panelRatioVsDesign: 4.55,
  reconRatioVsDesign: 4.31,
  cellRatioVsDesign: 5.19,
  dominantComponent: 'cells',
  // sizing the remaining lever
  panelRemovedFloorBallOps: 1.0451e14,   // recon + cells if the super-pass is fully removed
  panelRemovedFloorRatioVsDesign: 9.50,  // panel batching alone cannot reach the design budget
  cellOnlyFloorRatioVsDesign: 5.19,
  totalBallOpsPerCell: 13276,            // ballOpsPerXUnit / cellsPerXUnit (all components)
  cellComponentBallOpsPerCell: 4906,     // cell-attributed ball-ops per cell
  cellUnderpricingVsDesign: 4.91,        // 4906 / 1000: the design under-priced cells alone
  designBudgetCrossCheckBallOps: 1.1642e13, // cells x ~1e3/cell reproduces the 1.1e13 budget
  // named sub-gap
  subGap:
    'apportioned by CPU-second shares (assumes ~uniform seconds-per-ball-op across cell / ' +
    'reconstruction / super-pass kinds); a direct per-component ball-op counter pass in ' +
    'tier_cert2.c would replace the apportionment with measured splits',
  subGapOpen: true,
  verdict:
    'MEASURED: the residual gap between the tier-2 1.5456e14 ball-ops and the 1.1e13 design ' +
    'budget is CELL-DOMINATED (37% / 5.19x), with reconstruction (31% / 4.31x) and the spent ' +
    'panel super-pass (32% / 4.55x) comparable; no single-component removal reaches the budget ' +
    '(panel-removed floor 9.50x), and the design under-priced cells alone by ~4.9x while ' +
    'omitting reconstruction. Ball-op split apportioned by CPU-second shares (named sub-gap: ' +
    'direct per-component counters would tighten it). Measurement only; changes no bound; ' +
    'NO QED; no refereed bound is changed.',
});

// ── self-executing assertions (import-light; recomputable arithmetic only) ───
export const IMP95136_ASSERTIONS = [
  {
    id: 'imp95136-shares-partition-and-cell-dominates',
    description:
      'the three CPU-second shares recompute from the measured component rates, partition the ' +
      'total (sum to 1), and the cell share is the largest (dominant sub-cost), with the panel ' +
      'super-pass no longer dominant (< 40%)',
    holds: () => {
      const a = TIER2_BALLOP_ATTRIBUTION;
      const sum = a.panelShare + a.reconShare + a.cellShare;
      return (
        Math.abs(sum - 1) < 1e-9 &&
        a.cellShare > a.panelShare &&
        a.cellShare > a.reconShare &&
        a.panelShare < 0.4 &&
        a.dominantComponent === 'cells'
      );
    },
  },
  {
    id: 'imp95136-ballop-attribution-recomputes',
    description:
      'the per-component full-window ball-op counts equal share x total, sum to the full-window ' +
      'ball-op count, and each ratio-vs-design equals its ball-op count / 1.1e13',
    holds: () => {
      const a = TIER2_BALLOP_ATTRIBUTION;
      const tot = BALLOP_ATTRIB_INPUTS.fullWindowBallOps;
      const design = BALLOP_ATTRIB_INPUTS.designTierBudgetBallOps;
      const p = a.panelShare * tot;
      const r = a.reconShare * tot;
      const c = a.cellShare * tot;
      return (
        Math.abs(p - a.panelBallOps) / a.panelBallOps < 5e-3 &&
        Math.abs(r - a.reconBallOps) / a.reconBallOps < 5e-3 &&
        Math.abs(c - a.cellBallOps) / a.cellBallOps < 5e-3 &&
        Math.abs(p + r + c - tot) / tot < 5e-3 &&
        Math.abs(a.cellBallOps / design - a.cellRatioVsDesign) < 0.05 &&
        Math.abs(a.panelBallOps / design - a.panelRatioVsDesign) < 0.05 &&
        Math.abs(a.reconBallOps / design - a.reconRatioVsDesign) < 0.05
      );
    },
  },
  {
    id: 'imp95136-lever-sized-no-single-removal-reaches-budget',
    description:
      'sizing the lever: the panel-removed floor (recon + cells) equals its recorded value and ' +
      'sits 9.5x above the design budget, the cell-only floor is 5.19x, and neither single ' +
      'removal reaches the budget (both > 1) — panel batching alone (now spent) cannot close it',
    holds: () => {
      const a = TIER2_BALLOP_ATTRIBUTION;
      const design = BALLOP_ATTRIB_INPUTS.designTierBudgetBallOps;
      const floor = a.reconBallOps + a.cellBallOps;
      return (
        Math.abs(floor - a.panelRemovedFloorBallOps) / a.panelRemovedFloorBallOps < 5e-3 &&
        Math.abs(floor / design - a.panelRemovedFloorRatioVsDesign) < 0.05 &&
        a.panelRemovedFloorRatioVsDesign > 1 &&
        a.cellOnlyFloorRatioVsDesign > 1 &&
        Math.abs(a.cellOnlyFloorRatioVsDesign - a.cellRatioVsDesign) < 1e-9
      );
    },
  },
  {
    id: 'imp95136-per-cell-ballops-and-design-underpricing',
    description:
      'the total ball-ops-per-cell equals ballOpsPerXUnit / cellsPerXUnit, the cell-attributed ' +
      'per-cell price is share x that, and it exceeds the design ~1e3 ball-ops/cell by ~4.9x; ' +
      'the design budget reproduces as total-cells x ~1e3/cell',
    holds: () => {
      const a = TIER2_BALLOP_ATTRIBUTION;
      const inp = BALLOP_ATTRIB_INPUTS;
      const totPerCell = inp.ballOpsPerXUnit / inp.cellsPerXUnit;
      const cellPerCell = a.cellShare * totPerCell;
      const totalCells = inp.cellsPerXUnit * inp.fullWindowXUnits;
      const designCheck = totalCells * inp.designBallOpsPerCell;
      return (
        Math.abs(totPerCell - a.totalBallOpsPerCell) / a.totalBallOpsPerCell < 5e-3 &&
        Math.abs(cellPerCell - a.cellComponentBallOpsPerCell) / a.cellComponentBallOpsPerCell < 5e-3 &&
        Math.abs(cellPerCell / inp.designBallOpsPerCell - a.cellUnderpricingVsDesign) < 0.05 &&
        Math.abs(designCheck - a.designBudgetCrossCheckBallOps) / a.designBudgetCrossCheckBallOps < 5e-3 &&
        Math.abs(designCheck - inp.designTierBudgetBallOps) / inp.designTierBudgetBallOps < 0.1
      );
    },
  },
  {
    id: 'imp95136-honesty-gate-subgap-and-no-qed',
    description:
      'fail-closed honesty: the attribution is apportioned by CPU-second shares (named OPEN ' +
      'sub-gap), it carries the imp-95214 build which promotes no bound, and the verdict states ' +
      'measurement-only, NO QED and no-refereed-bound-change',
    holds: () =>
      TIER2_BALLOP_ATTRIBUTION.subGapOpen === true &&
      /uniform seconds-per-ball-op/.test(TIER2_BALLOP_ATTRIBUTION.subGap) &&
      IMP95214_TIER2_CHIRP.promotesBound === false &&
      /Measurement only/.test(TIER2_BALLOP_ATTRIBUTION.verdict) &&
      /NO QED/.test(TIER2_BALLOP_ATTRIBUTION.verdict) &&
      /refereed bound is changed/i.test(TIER2_BALLOP_ATTRIBUTION.verdict) &&
      // the second level is a sub-range build, unchanged here
      (TIER2_LEDGER.panelsPerSuper === 31) &&
      WINDOW_WIDTH_U === 2 * 690988 + 1,
  },
];

for (const a of IMP95136_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95136-tier2-ballop-attribution assertion failed: ${a.id}`);
  }
}

export default TIER2_BALLOP_ATTRIBUTION;
