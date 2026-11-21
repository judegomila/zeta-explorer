/**
 * @module imp-36048-i4-argument-error-accrual-viz-data
 * @fileoverview imp-36048 -- VIZ DATA ONLY (baked literals, no heavy imports) for the
 *   imp-35989 I4 argument-error accrual U-curve E(n) = E_round(n) + E_trunc(n) against the
 *   I2 panel count n: the ROUNDOFF channel (grows linearly in n), the TRUNCATION channel
 *   (falls ~1/n), the shallow U-minimum (~2.18e-7 rad at n ~ 1.56e8), and the roundoff-only
 *   pi-budget crossover (n* ~ 4.50e15, ~14 orders beyond any physical panel count).
 *
 *   Reference literals are re-run from the imp-35989 two-channel accrual surrogate
 *   (E_round(n) = ((n-1)+RHO_EVAL)*u*|S|, E_trunc(n) = K_TRUNC/n) to machine precision; this
 *   module bakes the resulting rows/landmarks as plain literals so a page can chart the
 *   U-curve without importing any computation module, per [[no_heavy_imports_in_pages]].
 *
 *   Presentation only of an already-established surrogate measurement; adds no new Lambda
 *   bound. NO QED. No refereed bound is changed.
 *
 * @see imp-35989-i4-accumulated-error-vs-panel-count-scale.js (the surrogate this bakes)
 * @see imp-35804-i4-integer-closure-error-budget-scope (I4 <pi GLOBAL accumulated-error budget)
 */

// n, E_round(n), E_trunc(n), E_total(n), whether E_total(n) < pi (the I4 closure budget).
export const IMP36048_SCALING_TABLE = [
  { n: 17, eRound: 1.395147e-14, eTrunc: 1, eTotal: 1, underPiBudget: true },
  { n: 34, eRound: 2.581023e-14, eTrunc: 0.5, eTotal: 0.5, underPiBudget: true },
  { n: 68, eRound: 4.952773e-14, eTrunc: 0.25, eTotal: 0.25, underPiBudget: true },
  { n: 136, eRound: 9.696274e-14, eTrunc: 0.125, eTotal: 0.125, underPiBudget: true },
  { n: 272, eRound: 1.918328e-13, eTrunc: 0.0625, eTotal: 0.0625, underPiBudget: true },
  { n: 1e3, eRound: 6.996664e-13, eTrunc: 0.017, eTotal: 0.017, underPiBudget: true },
  { n: 1e4, eRound: 6.97783e-12, eTrunc: 0.0017, eTotal: 0.0017, underPiBudget: true },
  { n: 1e5, eRound: 6.975946e-11, eTrunc: 0.00017, eTotal: 0.0001700001, underPiBudget: true },
  { n: 1e6, eRound: 6.975758e-10, eTrunc: 0.000017, eTotal: 0.0000170007, underPiBudget: true },
  { n: 1e8, eRound: 6.975737e-8, eTrunc: 1.7e-7, eTotal: 2.397574e-7, underPiBudget: true },
  { n: 1e10, eRound: 0.000006975737, eTrunc: 1.7e-9, eTotal: 0.000006977437, underPiBudget: true },
  { n: 1e12, eRound: 0.0006975737, eTrunc: 1.7e-11, eTotal: 0.0006975737, underPiBudget: true },
];

// Roundoff-only crossover to the pi budget: E_round(n*) = pi.
export const IMP36048_ROUNDOFF_CROSSOVER = Object.freeze({
  nStar: 4.5036e15,
  note: 'E_round alone reaches the pi budget only at n* ~ 4.50e15 panels, ~14 orders beyond any physical dR panel count.',
});

// U-minimum of E_total(n): dE/dn = 0 at n_min = sqrt(K_TRUNC / (u * |S|)).
export const IMP36048_U_MINIMUM = Object.freeze({
  nMin: 1.561095e8,
  eMin: 2.177958e-7,
  note: 'E(n) bottoms out at ~2.18e-7 rad near n ~ 1.56e8 (roundoff-truncation balance), ~7 orders below pi.',
});

export default Object.freeze({
  id: 'imp-36048-i4-argument-error-accrual-viz-data',
  ticket: 'imp-36048',
  sourceTicket: 'imp-35989',
  rows: IMP36048_SCALING_TABLE,
  roundoffCrossover: IMP36048_ROUNDOFF_CROSSOVER,
  uMinimum: IMP36048_U_MINIMUM,
  honest:
    'VIZ DATA ONLY: presentation of an already-established double-precision surrogate; sums no ' +
    'real per-panel increments; certifies no count; changes no bound. NO QED. No refereed bound is changed' +
    '.',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP36048_ASSERTIONS = [
  {
    id: 'imp36048-twelve-rungs-present',
    holds: () => IMP36048_SCALING_TABLE.length === 12,
    why: 'The table must cover all 12 imp-35989 rungs from n=17 to n=1e12.',
  },
  {
    id: 'imp36048-roundoff-grows-truncation-falls',
    holds: () => {
      const first = IMP36048_SCALING_TABLE[0];
      const last = IMP36048_SCALING_TABLE[IMP36048_SCALING_TABLE.length - 1];
      return last.eRound > first.eRound && last.eTrunc < first.eTrunc;
    },
    why: 'E_round must grow and E_trunc must fall from n=17 to n=1e12, matching the imp-35989 two opposite channels.',
  },
  {
    id: 'imp36048-every-rung-under-pi-budget',
    holds: () => IMP36048_SCALING_TABLE.every((row) => row.underPiBudget === true && row.eTotal < Math.PI),
    why: 'Every tabulated n must keep E_total under the pi I4 closure budget, matching the imp-35989 finding.',
  },
  {
    id: 'imp36048-u-minimum-far-below-pi-and-between-neighbors',
    holds: () =>
      IMP36048_U_MINIMUM.eMin < 1e-6 &&
      IMP36048_U_MINIMUM.eMin > 1e-8 &&
      IMP36048_U_MINIMUM.nMin > 1e8 &&
      IMP36048_U_MINIMUM.nMin < 1e9,
    why: 'The U-minimum must sit ~7 orders below pi near n ~ 1.56e8, matching the imp-35989 landmark.',
  },
  {
    id: 'imp36048-roundoff-crossover-far-beyond-physical',
    holds: () => IMP36048_ROUNDOFF_CROSSOVER.nStar > 1e15 && IMP36048_ROUNDOFF_CROSSOVER.nStar < 1e16,
    why: 'The roundoff-only pi crossover must sit ~14 orders beyond any physical panel count, matching imp-35989.',
  },
];

for (const assertion of IMP36048_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36048-i4-argument-error-accrual-viz-data assertion failed: ${assertion.id}`);
  }
}
