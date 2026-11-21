/**
 * @module imp-97303-bessel-hankel-majorant-vs-measured-viz-data
 *
 * imp-97303 (ux): import-light viz-data leaf for imp-97263's analytic z^-4 spherical-Bessel Hankel
 * majorant, plotted against the imp-97134 measured |g(z)| z^4 trial values it bounds. imp-97263
 * derived the closed-form combination constant C(Z0) (uniform in z >= Z0 = a*T) such that
 * |g(z)| z^4 <= C(Z0) for the imp-97134 annihilating trials, and noted the bound sits ~5-70x above
 * the measured curve; neither leaf shipped a chart of the majorant line against the measured data.
 *
 * Reuses two existing light literals verbatim (no re-derivation, no re-evaluation of any
 * spherical-Bessel function):
 *   - IMP97134_DECAY: the measured |g(z)| z^4 ladder (z = 100..3200) for the even-degree
 *     {0,2,4,6} and odd-degree {1,3,5,7} annihilating trials.
 *   - IMP97263_COMBINATION_MAJORANT.CofZ0: the single closed-form constant such that
 *     |sum_k d_k R_k(z)| <= z^-4 * C(Z0) for all z >= Z0, built from ALL eight degrees k=0..7
 *     (even trial union odd trial). Because C(Z0) sums |d_k| Mbar_k(Z0) over the full k=0..7
 *     set with every term non-negative, it is also a valid (if looser) majorant for the
 *     even-only and odd-only sub-trials individually -- so plotting the single flat line
 *     C(Z0) against BOTH measured curves is a sound bound check, not just against their sum.
 *
 * MEASUREMENT / PRESENTATION ONLY. Confirms the majorant is valid (C(Z0) sits above both measured
 * curves at every rung) and quantifies the triangle-inequality looseness as a ratio C(Z0)/measured.
 * Changes no bound, establishes no operator positivity, no RH claim; no refereed bound is changed
 * . RH open. NO QED.
 *
 * @see imp-97263-krein-analytic-bessel-z4-remainder-majorant.js (IMP97263_COMBINATION_MAJORANT, the analytic majorant)
 * @see imp-97134-krein-annihilating-rational-trial-execution.js (IMP97134_DECAY, the measured trial ladder)
 *
 * Ticket: imp-97303 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

import { IMP97134_DECAY } from './imp-97134-krein-annihilating-rational-trial-execution.js';
import { IMP97263_COMBINATION_MAJORANT } from './imp-97263-krein-analytic-bessel-z4-remainder-majorant.js';

const CofZ0 = IMP97263_COMBINATION_MAJORANT.CofZ0;

export const IMP97303_ROWS = IMP97134_DECAY.map((r) => ({
  z: r.z,
  evenGz4: r.evenGz4,
  oddGz4: r.oddGz4,
  majorantGz4: CofZ0,
  evenRatio: CofZ0 / r.evenGz4,
  oddRatio: CofZ0 / r.oddGz4,
}));

export const IMP97303_MEASURED = Object.freeze({
  zRange: [IMP97303_ROWS[0].z, IMP97303_ROWS[IMP97303_ROWS.length - 1].z],
  Z0: IMP97263_COMBINATION_MAJORANT.Z0,
  CofZ0,
  evenRatioBand: [
    Math.min(...IMP97303_ROWS.map((r) => r.evenRatio)),
    Math.max(...IMP97303_ROWS.map((r) => r.evenRatio)),
  ],
  oddRatioBand: [
    Math.min(...IMP97303_ROWS.map((r) => r.oddRatio)),
    Math.max(...IMP97303_ROWS.map((r) => r.oddRatio)),
  ],
});

export const IMP97303_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: the majorant curve C(Z0) is ' +
  'copied verbatim from imp-97263 and the measured |g(z)| z^4 curves are copied verbatim from the ' +
  'imp-97134 annihilating-trial ladder (no re-evaluation of any spherical-Bessel function). The ' +
  'majorant is a valid but loose triangle-inequality bound: no bound is claimed and no operator ' +
  'positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97303_ASSERTIONS = [
  {
    id: 'imp97303-six-rows-present',
    holds: () => IMP97303_ROWS.length === 6,
    why: 'the imp-97134 IMP97134_DECAY ladder has six rungs (z = 100, 200, 400, 800, 1600, 3200).',
  },
  {
    id: 'imp97303-ascending-z-order',
    holds: () => IMP97303_ROWS.every((r, i) => i === 0 || r.z > IMP97303_ROWS[i - 1].z),
    why: 'the rows must be in ascending z order for chart rendering.',
  },
  {
    id: 'imp97303-majorant-bounds-both-measured-curves-at-every-row',
    holds: () => IMP97303_ROWS.every((r) => r.majorantGz4 >= r.evenGz4 && r.majorantGz4 >= r.oddGz4),
    why: 'C(Z0) is a valid two-sided majorant (imp-97263): |g(z)| z^4 <= C(Z0) must hold for both the even-degree and odd-degree annihilating trials at every measured z.',
  },
  {
    id: 'imp97303-looseness-ratios-in-expected-order-of-magnitude-band',
    holds: () =>
      IMP97303_MEASURED.evenRatioBand[0] > 50 &&
      IMP97303_MEASURED.evenRatioBand[1] < 250 &&
      IMP97303_MEASURED.oddRatioBand[0] > 3 &&
      IMP97303_MEASURED.oddRatioBand[1] < 15,
    why: 'imp-97263 reports the triangle bound as several-x to ~two-hundred-x loose across the two trials; this pins the measured ratio bands to that order of magnitude so a future data change is caught.',
  },
  {
    id: 'imp97303-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP97303_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97303_HONEST_BANNER) &&
      /NO QED/.test(IMP97303_HONEST_BANNER),
    why: 'every Krein-route viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP97303_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97303-bessel-hankel-majorant-vs-measured-viz-data assertion failed: ${a.id}`,
    );
  }
}

export default {
  rows: IMP97303_ROWS,
  measured: IMP97303_MEASURED,
  banner: IMP97303_HONEST_BANNER,
};
