/**
 * @module imp-96742-safe-direction-sign-per-rung-viz-data
 *
 * imp-96742 (ux): import-light viz-data leaf for the imp-96714 per-rung
 * safe-direction sign verification. imp-96714 recomputed the sign of
 * d_sig(L) = |rho_emp(L) + 1/2| - |rho_GUE(L) + 1/2| at every rung in the
 * imp-96430 calibration window (L = 30, 60, 120, 240, 480, 960), reusing the
 * imp-96695 baked rhoEmp/rhoGue table verbatim. That finding had a JSDoc
 * table but no chart or page.
 *
 * PRESENTATION ONLY. Every row (L, dSig, safe) is reused verbatim from
 * imp-96714; no new measurement, no recomputation from the zeros. Changes no
 * bound, establishes no operator positivity, no RH claim; no refereed bound is changed
 * . RH open. NO QED.
 *
 * @see imp-96714-safe-direction-per-rung-verification.js (source finding + all baked numbers)
 * @see imp-96721-sigma2-emp-vs-gue-viz-data.js (sibling viz-data leaf, same convention)
 *
 * Ticket: imp-96742 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { IMP96714_SAFE_DIRECTION_PER_RUNG } from './imp-96714-safe-direction-per-rung-verification.js';

const SOURCE_TABLE = IMP96714_SAFE_DIRECTION_PER_RUNG.table;

// per-rung d_sig(L) reused verbatim from imp-96714.
export const IMP96742_DSIG_TABLE = Object.freeze(
  SOURCE_TABLE.map((row) =>
    Object.freeze({ L: row.L, dSig: row.dSig, safe: row.safe }),
  ),
);

export const IMP96742_SAFE_FROM_L = IMP96714_SAFE_DIRECTION_PER_RUNG.safeFromL;
export const IMP96742_FAIL_RUNGS = IMP96714_SAFE_DIRECTION_PER_RUNG.failRungs;

export const IMP96742_HONEST_BANNER =
  'Presentation only: every d_sig(L) value is reused verbatim from imp-96714 (itself a pure ' +
  'arithmetic reshape of the imp-96695 baked rhoEmp/rhoGue table); no new measurement, no ' +
  'recomputation from the zeros, moves no bound. No refereed bound is changed. ' +
  'RH open. NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96742_ASSERTIONS = [
  {
    id: 'imp96742-table-has-six-calibration-rungs',
    holds: () => IMP96742_DSIG_TABLE.length === 6 && IMP96742_DSIG_TABLE[0].L === 30 && IMP96742_DSIG_TABLE[5].L === 960,
    why: 'the calibration-window table must reproduce all 6 imp-96714 rungs (L=30..960) unmodified.',
  },
  {
    id: 'imp96742-dsig-values-match-source',
    holds: () => IMP96742_DSIG_TABLE.every((row, i) => row.dSig === SOURCE_TABLE[i].dSig && row.safe === SOURCE_TABLE[i].safe),
    why: 'd_sig(L) and the safe flag must be reused verbatim from imp-96714, not recomputed.',
  },
  {
    id: 'imp96742-fail-rungs-match-fail-window',
    holds: () => {
      const fails = IMP96742_DSIG_TABLE.filter((r) => !r.safe).map((r) => r.L);
      return fails.length === IMP96742_FAIL_RUNGS.length && fails.every((L, i) => L === IMP96742_FAIL_RUNGS[i]);
    },
    why: 'the rungs marked unsafe (dSig > 0) must exactly match the imp-96714 fail-rung list {30, 60}.',
  },
  {
    id: 'imp96742-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96742_HONEST_BANNER) &&
      /PT Lambda <= 0.2|Platt-Trudgian Lambda <= 0.2|refereed bound is changed/.test(IMP96742_HONEST_BANNER) &&
      /NO QED/.test(IMP96742_HONEST_BANNER),
    why: 'every Route M / basis-C viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96742_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96742-safe-direction-sign-per-rung-viz-data assertion failed: ${a.id}`);
  }
}
