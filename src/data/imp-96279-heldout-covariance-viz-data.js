/**
 * @module imp-96279-heldout-covariance-viz-data
 *
 * imp-96279 (ux): import-light viz-data leaf for the imp-96150 held-out-height
 * GUE two-interval covariance census -- reshapes the five-row rho_exact / n_eff
 * table (heights {2e4, 5e4, 1e5, 2e5, 4e5}) into a chart-ready series so a chart
 * can show at a glance that the anti-correlation and its n_eff inflation are
 * uniform across heights rather than height-specific. imp-96150 computed the
 * census and reported it only as an object literal with a prose verdict; it did
 * not ship a plotting series.
 *
 * Reshapes IMP96150_NUMBER_VARIANCE_TWO_INTERVAL_COVARIANCE_HELDOUT_HEIGHTS.rows
 * into (T, lnT, rhoExact, factor, nEff, gapToFlip). No re-derivation: every
 * plotted value is copied verbatim from the imp-96150 source rows; only lnT is
 * computed here for the chart axis.
 *
 * PRESENTATION ONLY. No new zeros, no Gram build, no bound changes, no operator
 * positivity established; RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-96150-number-variance-two-interval-covariance-heldout-heights.js (source census, derivation)
 * @see imp-96128-number-variance-two-interval-covariance-exact (single-height T = 1.5e5 census this extends)
 *
 * Ticket: imp-96279 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

import { IMP96150_NUMBER_VARIANCE_TWO_INTERVAL_COVARIANCE_HELDOUT_HEIGHTS } from './imp-96150-number-variance-two-interval-covariance-heldout-heights.js';

const { rows, uniformity, significantHeightReference } = IMP96150_NUMBER_VARIANCE_TWO_INTERVAL_COVARIANCE_HELDOUT_HEIGHTS;

export const IMP96279_HELDOUT_COVARIANCE_SERIES = rows.map((row) => ({
  Tc: row.Tc,
  lnTc: Math.log(row.Tc),
  rhoExact: row.rhoExact,
  factor: row.factor,
  nEff: row.nEff,
  gapToFlip: row.gapToFlip,
}));

export const IMP96279_UNIFORMITY_SUMMARY = Object.freeze({
  rhoSpread: uniformity.rhoSpread,
  factorMin: uniformity.factorMin,
  factorMax: uniformity.factorMax,
  gapMin: uniformity.gapMin,
  gapMax: uniformity.gapMax,
  significantHeightReference,
});

export const IMP96279_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every Tc, rhoExact, factor, nEff and '
  + 'gapToFlip value is copied verbatim from the imp-96150 held-out-height census (itself extending the '
  + 'imp-96128 single-height T = 1.5e5 census); only lnTc is computed here for the chart axis. No new zeros, '
  + 'no Gram build, no bound changes, no operator positivity established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const approx = (x, y, tol) => Math.abs(x - y) <= tol;

const IMP96279_ASSERTIONS = [
  {
    id: 'imp96279-series-length-five',
    holds: () => IMP96279_HELDOUT_COVARIANCE_SERIES.length === 5,
    why: 'imp-96150/imp-96090: five held-out heights {2e4, 5e4, 1e5, 2e5, 4e5}.',
  },
  {
    id: 'imp96279-series-matches-source-rows',
    holds: () => IMP96279_HELDOUT_COVARIANCE_SERIES.every((p, i) => approx(p.Tc, rows[i].Tc, 1e-9)
      && approx(p.rhoExact, rows[i].rhoExact, 1e-12)
      && approx(p.factor, rows[i].factor, 1e-12)
      && approx(p.nEff, rows[i].nEff, 1e-9)
      && approx(p.gapToFlip, rows[i].gapToFlip, 1e-12)),
    why: 'the reshaped series must reproduce the imp-96150 baked rows row-for-row.',
  },
  {
    id: 'imp96279-lntc-monotone-increasing',
    holds: () => IMP96279_HELDOUT_COVARIANCE_SERIES.every((p, i) => i === 0 || p.lnTc > IMP96279_HELDOUT_COVARIANCE_SERIES[i - 1].lnTc),
    why: 'Tc is strictly increasing across the five held-out heights, so ln Tc must be too.',
  },
  {
    id: 'imp96279-rho-uniform-anti-correlated-near-half',
    holds: () => IMP96279_HELDOUT_COVARIANCE_SERIES.every((p) => p.rhoExact < -0.45 && p.rhoExact > -0.5),
    why: 'imp-96150: rho_exact must be strongly anti-correlated near -1/2 at every held-out height.',
  },
  {
    id: 'imp96279-gap-uniformly-safe-side',
    holds: () => IMP96279_HELDOUT_COVARIANCE_SERIES.every((p) => p.gapToFlip > 1.0),
    why: 'imp-96150: every held-out height must sit on the safe side of the rho_crit flip threshold by more than 1.0.',
  },
  {
    id: 'imp96279-honest-banner-present',
    holds: () => /RH open/.test(IMP96279_HONEST_BANNER) && /NO QED/.test(IMP96279_HONEST_BANNER) && /refereed bound is changed/i.test(IMP96279_HONEST_BANNER),
    why: 'honesty gate: presentation only, no RH claim, no refereed bound is changed.',
  },
];

for (const a of IMP96279_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96279-heldout-covariance-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}
