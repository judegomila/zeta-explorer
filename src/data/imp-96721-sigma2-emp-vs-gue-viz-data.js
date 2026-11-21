/**
 * @module imp-96721-sigma2-emp-vs-gue-viz-data
 *
 * imp-96721 (ux): import-light viz-data leaf for the imp-96695 empirical-vs-GUE
 * number-variance cross-validation. imp-96695 measured the number variance
 * Sigma2_emp(L) from real Odlyzko zeros (heights up to T ~ 1.13e6) and compared
 * it to the exact Dyson-Mehta sine-kernel Sigma2_GUE(L), finding the two track
 * closely below L ~ 3 then depart as Sigma2_emp saturates near ~0.4 while
 * Sigma2_GUE keeps growing logarithmically. That finding had numbers (a JSDoc
 * table) but no chart or page.
 *
 * MEASUREMENT / PRESENTATION ONLY. Every row (L, sigma2Emp, sigma2Gue, ratio,
 * rhoEmp, rhoGue) is reused verbatim from imp-96695; the signal columns
 * (signalEmp = |rhoEmp + 1/2|, signalGue = |rhoGue + 1/2|) are a direct
 * arithmetic reshape of the same baked rhoEmp/rhoGue values, not new
 * measurements. Changes no bound, establishes no operator positivity, no RH
 * claim; no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96695-basis-c-empirical-rho-vs-gue-crossvalidation.js (source finding + all baked numbers)
 * @see imp-96640-rankr-power-iteration-bracket-viz-data.js (sibling viz-data leaf, same convention)
 *
 * Ticket: imp-96721 (ux, sonnet-4-6, medium). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { IMP96695_BASIS_C_EMPIRICAL_RHO_VS_GUE } from './imp-96695-basis-c-empirical-rho-vs-gue-crossvalidation.js';

const IMP96695_RHO_TABLE = IMP96695_BASIS_C_EMPIRICAL_RHO_VS_GUE.rhoTable;
const IMP96695_SATURATION_SWEEP = IMP96695_BASIS_C_EMPIRICAL_RHO_VS_GUE.saturationSweep;
const IMP96695_MAX_ABS_DRHO = IMP96695_BASIS_C_EMPIRICAL_RHO_VS_GUE.maxAbsDRho;

// calibration-window rows with the two-interval signal |rho + 1/2| appended.
// Reused verbatim rhoEmp/rhoGue; signalEmp/signalGue are plain |x + 0.5| of
// the same baked values (no new measurement).
export const IMP96721_SIGMA2_TABLE = Object.freeze(
  IMP96695_RHO_TABLE.map((row) =>
    Object.freeze({
      L: row.L,
      sigma2Emp: row.sigma2Emp,
      sigma2Gue: row.sigma2Gue,
      rhoEmp: row.rhoEmp,
      rhoGue: row.rhoGue,
      signalEmp: Math.abs(row.rhoEmp + 0.5),
      signalGue: Math.abs(row.rhoGue + 0.5),
    }),
  ),
);

// finite-height saturation ratio Sigma2_emp/Sigma2_GUE, small-L sweep. Reused
// verbatim from imp-96695; marks the L ~ 3-8 departure onset.
export const IMP96721_SATURATION_SWEEP = IMP96695_SATURATION_SWEEP;

// the departure window this viz marks: ratio still >= 0.90 at L=3, falls
// below 0.80 by L=8 (per imp-96695 FINDING 2).
export const IMP96721_DEPARTURE_WINDOW = Object.freeze({ lLow: 3, lHigh: 8 });

const LAST_ROW = IMP96721_SIGMA2_TABLE[IMP96721_SIGMA2_TABLE.length - 1];

// safe-direction summary at the largest calibration L: how much smaller the
// real-zero corroboration signal is than the GUE signal it is checked against.
export const IMP96721_SAFE_DIRECTION = Object.freeze({
  atL: LAST_ROW.L,
  signalEmp: LAST_ROW.signalEmp,
  signalGue: LAST_ROW.signalGue,
  shrinkageFactor: LAST_ROW.signalGue / LAST_ROW.signalEmp,
});

export const IMP96721_MAX_ABS_DRHO = IMP96695_MAX_ABS_DRHO;

export const IMP96721_HONEST_BANNER =
  'Presentation only: every Sigma2/rho value is reused verbatim from imp-96695; only the ' +
  'chart reshape and the derived |rho + 1/2| signal columns are new. Measures a finite-height ' +
  '(Berry semiclassical) saturation effect, not a GUE-universality failure; moves no bound. ' +
  'No refereed bound is changed. RH open. NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96721_ASSERTIONS = [
  {
    id: 'imp96721-table-has-six-calibration-rungs',
    holds: () => IMP96721_SIGMA2_TABLE.length === 6 && IMP96721_SIGMA2_TABLE[0].L === 30,
    why: 'the calibration-window table must reproduce all 6 imp-96695 rungs (L=30..960) unmodified.',
  },
  {
    id: 'imp96721-sigma2-gap-widens-with-L',
    holds: () => {
      const first = IMP96721_SIGMA2_TABLE[0];
      const last = IMP96721_SIGMA2_TABLE[IMP96721_SIGMA2_TABLE.length - 1];
      const gapFirst = last.sigma2Gue - last.sigma2Emp;
      const gapLast = first.sigma2Gue - first.sigma2Emp;
      return gapFirst > gapLast && last.sigma2Gue > last.sigma2Emp;
    },
    why: 'Sigma2_GUE keeps growing logarithmically while Sigma2_emp saturates, so the gap must widen from L=30 to L=960.',
  },
  {
    id: 'imp96721-departure-window-matches-saturation-sweep',
    holds: () => {
      const s = IMP96721_SATURATION_SWEEP;
      const atLow = s.find((r) => r.L === IMP96721_DEPARTURE_WINDOW.lLow);
      const atHigh = s.find((r) => r.L === IMP96721_DEPARTURE_WINDOW.lHigh);
      return atLow.ratio >= 0.85 && atLow.ratio <= 0.95 && atHigh.ratio < atLow.ratio && atHigh.ratio < 0.8;
    },
    why: 'the marked L ~ 3-8 window must bracket the observed saturation onset (ratio ~0.90 at L=3 falling to ~0.76 at L=8).',
  },
  {
    id: 'imp96721-safe-direction-signal-shrinks',
    holds: () =>
      IMP96721_SAFE_DIRECTION.signalEmp < IMP96721_SAFE_DIRECTION.signalGue &&
      IMP96721_SAFE_DIRECTION.shrinkageFactor > 10,
    why: 'the real-zero corroboration signal |rho_emp + 1/2| must be markedly smaller than the GUE signal at large L (the safe-direction finding), not larger.',
  },
  {
    id: 'imp96721-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96721_HONEST_BANNER) &&
      /PT Lambda <= 0.2|Platt-Trudgian Lambda <= 0.2|refereed bound is changed/.test(IMP96721_HONEST_BANNER) &&
      /NO QED/.test(IMP96721_HONEST_BANNER),
    why: 'every Route M / basis-C viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96721_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96721-sigma2-emp-vs-gue-viz-data assertion failed: ${a.id}`);
  }
}
