/**
 * @module imp-97253-krein-routeb-panel-enclosure-viz-data
 *
 * imp-97253 (ux): import-light viz-data leaf for the imp-97184 Route B combined phase-preserving
 * panel-enclosure convergence ladder (imp-97184-krein-routeb-panel-enclosure-execution.js), which
 * had baked the five panel-width rows and the Route A control but no viz surface for the ladder.
 *
 * Reshapes the five baked panel rows (h = period .. period/16) into chart-ready form: a log-scale
 * line/bar series of M(h)/rq falling monotonically 2.278 -> 1.421 as panels narrow, alongside the
 * Route A mode-wise triangle-envelope control (200.4x rq, off the chart scale) and the quadrature-
 * to-actual floor (1.173x) that lower-bounds any reachable rigorous majorant.
 *
 * MEASUREMENT / PRESENTATION ONLY. Every number below is copied verbatim from the imp-97184 baked
 * `IMP97184_ROUTEB` rows, `IMP97184_ROUTEA_OVER_RQ`, and `IMP97184_VERDICT.routeBFloorIsQuadratureRatio`
 * (no re-derivation of the panel majorant or the sigma_2 closed-form bound). Changes no bound,
 * establishes no operator positivity, no RH claim; no refereed bound is changed. RH
 * open. NO QED.
 *
 * @see imp-97184-krein-routeb-panel-enclosure-execution.js (IMP97184_ROUTEB, IMP97184_ROUTEA_OVER_RQ, IMP97184_VERDICT)
 *
 * Ticket: imp-97253 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

import {
  IMP97184_ROUTEB,
  IMP97184_ROUTEA_OVER_RQ,
  IMP97184_VERDICT,
} from './imp-97184-krein-routeb-panel-enclosure-execution.js';

// one row per panel width, narrowest-first order preserved from the source ladder.
export const IMP97253_ROWS = IMP97184_ROUTEB.map((r) => ({
  h: r.h,
  npan: r.npan,
  MOverRq: r.MOverRq,
  MOverActual: r.MOverActual,
}));

export const IMP97253_ROUTEA_OVER_RQ = IMP97184_ROUTEA_OVER_RQ; // 200.4231... -- off-scale divergent control

export const IMP97253_FLOOR_RATIO = IMP97184_VERDICT.routeBFloorIsQuadratureRatio; // 1.17342... quadrature/actual

export const IMP97253_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every panel-width row, the Route A control, and the quadrature floor are copied verbatim from the imp-97184 baked IMP97184_ROUTEB / IMP97184_ROUTEA_OVER_RQ / IMP97184_VERDICT (no re-derivation of the panel majorant or the sigma_2 closed-form bound); no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97253_ASSERTIONS = [
  {
    id: 'imp97253-five-panel-rows-present',
    holds: () => IMP97253_ROWS.length === 5,
    why: 'imp-97184 reports exactly five panel widths (h = period, period/2, period/4, period/8, period/16); the reshaped row set must preserve that count.',
  },
  {
    id: 'imp97253-monotone-non-increasing-ratio',
    holds: () => IMP97253_ROWS.every((r, i) => i === 0 || r.MOverRq <= IMP97253_ROWS[i - 1].MOverRq + 1e-9),
    why: 'the panel majorant M(h)/rq falls monotonically as panels narrow, from 2.278 (h=period) to 1.421 (h=period/16).',
  },
  {
    id: 'imp97253-endpoint-values-match-source',
    holds: () =>
      Math.abs(IMP97253_ROWS[0].MOverRq - 2.2777707441363506) < 1e-9 &&
      Math.abs(IMP97253_ROWS[IMP97253_ROWS.length - 1].MOverRq - 1.4212452251397822) < 1e-9,
    why: 'the widest-panel and narrowest-panel M/rq figures must match the imp-97184 baked ladder exactly (2.278 and 1.421).',
  },
  {
    id: 'imp97253-routea-off-scale-divergent',
    holds: () => IMP97253_ROUTEA_OVER_RQ > 100 && Math.abs(IMP97253_ROUTEA_OVER_RQ - 200.4231009979565) < 1e-6,
    why: 'the Route A mode-wise triangle-envelope control diverges at 200.4x rq, confirming only the phase-preserving Route B enclosure keeps the cancellation.',
  },
  {
    id: 'imp97253-floor-ratio-below-narrowest-panel',
    holds: () =>
      IMP97253_FLOOR_RATIO > 1 &&
      IMP97253_FLOOR_RATIO < IMP97253_ROWS[IMP97253_ROWS.length - 1].MOverRq &&
      Math.abs(IMP97253_FLOOR_RATIO - 1.17341866826518) < 1e-9,
    why: 'the quadrature-to-actual ratio (1.173x) lower-bounds any reachable rigorous majorant and must sit below the finest measured panel ratio (1.421x).',
  },
  {
    id: 'imp97253-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP97253_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97253_HONEST_BANNER) &&
      /NO QED/.test(IMP97253_HONEST_BANNER),
    why: 'every Route A-M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP97253_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97253-krein-routeb-panel-enclosure-viz-data assertion failed: ${a.id}`);
  }
}
