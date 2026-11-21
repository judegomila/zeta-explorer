/**
 * @module imp-97255-absdownside-plateau-viz-data
 *
 * imp-97255 (ux): import-light viz-data leaf for the imp-97188 cotangent abs-value downside
 * plateau ladder (imp-97188-route-m-cotangent-absdownside-plateau-ladder.js), which had baked the
 * prime and primorial coefficient rows but no chart-ready surface for the plateau.
 *
 * Reshapes the baked rows into a single chart-ready series (b, coeff, kappaArith/coeff margin,
 * divisor class) spanning primes b=601..16001 and primorials b=2310,30030, alongside the plateau
 * band [0.14, 0.15] and the kappa_arith reference line the coefficient stays ~4x below.
 *
 * MEASUREMENT / PRESENTATION ONLY. Every number below is copied verbatim from the imp-97188 baked
 * `IMP97188_LADDER`, `IMP97188_KAPPA_ARITH`, and `IMP97188_VERDICT` (no re-derivation of the
 * abs-value downside coefficient or the arithmetic floor). Changes no bound, establishes no
 * operator positivity, no RH claim; no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-97188-route-m-cotangent-absdownside-plateau-ladder.js (IMP97188_LADDER, IMP97188_KAPPA_ARITH, IMP97188_VERDICT)
 *
 * Ticket: imp-97255 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

import {
  IMP97188_LADDER,
  IMP97188_KAPPA_ARITH,
  IMP97188_VERDICT,
} from './imp-97188-route-m-cotangent-absdownside-plateau-ladder.js';

// one row per measured b, ascending order, tagged by divisor class; margin = kappa_arith / coeff.
export const IMP97255_ROWS = [
  ...IMP97188_LADDER.primes.map((r) => ({ ...r, cls: 'prime', margin: IMP97188_KAPPA_ARITH / r.coeff })),
  ...IMP97188_LADDER.primorials.map((r) => ({ ...r, cls: 'primorial', margin: IMP97188_KAPPA_ARITH / r.coeff })),
].sort((a, b) => a.b - b.b);

export const IMP97255_KAPPA_ARITH = IMP97188_KAPPA_ARITH; // 0.5704960511308594

export const IMP97255_PLATEAU_BAND = Object.freeze({ low: 0.14, high: 0.15 });

export const IMP97255_MARGIN_BAND = Object.freeze({
  low: IMP97188_VERDICT.marginBandLow, // 3.85
  high: IMP97188_VERDICT.marginBandHigh, // 3.97
});

export const IMP97255_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every (b, coeff) row and the ' +
  'kappa_arith reference line are copied verbatim from the imp-97188 baked IMP97188_LADDER / ' +
  'IMP97188_KAPPA_ARITH / IMP97188_VERDICT (no re-derivation of the abs-value downside coefficient); ' +
  'no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97255_ASSERTIONS = [
  {
    id: 'imp97255-eight-rows-present',
    holds: () => IMP97255_ROWS.length === 8,
    why: 'imp-97188 reports six prime rows (b=601..16001) and two primorial rows (b=2310,30030); the reshaped row set must preserve that count.',
  },
  {
    id: 'imp97255-ascending-b-order',
    holds: () => IMP97255_ROWS.every((r, i) => i === 0 || r.b > IMP97255_ROWS[i - 1].b),
    why: 'the merged prime+primorial series is sorted ascending by b for chart rendering.',
  },
  {
    id: 'imp97255-all-rows-in-plateau-band',
    holds: () => IMP97255_ROWS.every((r) => r.coeff > IMP97255_PLATEAU_BAND.low && r.coeff < IMP97255_PLATEAU_BAND.high),
    why: 'every measured coefficient sits in the plateau band [0.14, 0.15], confirming no drift toward kappa_arith.',
  },
  {
    id: 'imp97255-all-margins-in-band',
    holds: () => IMP97255_ROWS.every((r) => r.margin > IMP97255_MARGIN_BAND.low && r.margin < IMP97255_MARGIN_BAND.high),
    why: 'the kappa_arith/coeff margin stays pinned in [3.85, 3.97] across every tested b, matching the imp-97188 verdict.',
  },
  {
    id: 'imp97255-endpoint-values-match-source',
    holds: () =>
      Math.abs(IMP97255_ROWS[0].coeff - 0.143728) < 1e-9 &&
      Math.abs(IMP97255_ROWS[IMP97255_ROWS.length - 1].coeff - 0.147810) < 1e-9,
    why: 'the smallest-b and largest-b coefficients must match the imp-97188 baked ladder exactly (b=601 -> 0.143728, b=30030 -> 0.147810).',
  },
  {
    id: 'imp97255-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP97255_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97255_HONEST_BANNER) &&
      /NO QED/.test(IMP97255_HONEST_BANNER),
    why: 'every Route M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP97255_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97255-absdownside-plateau-viz-data assertion failed: ${a.id}`);
  }
}
