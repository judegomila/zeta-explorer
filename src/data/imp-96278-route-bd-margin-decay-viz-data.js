/**
 * @module imp-96278-route-bd-margin-decay-viz-data
 *
 * imp-96278 (ux): import-light viz-data leaf for the imp-96148/imp-96173
 * Route B/D worst-support (N=32) on-line margin decay -- the observed
 * rho(32,T) column plotted against ln T alongside the two competing fits
 * (log-linear crossing model vs reciprocal-log-with-floor model), so a chart
 * can show at a glance why the decelerating slope selects the positive-floor
 * law over the naive crossing extrapolation. imp-96148 derived the fits and
 * imp-96173 tabulated them; neither shipped a chart-ready series.
 *
 * Reshapes the imp-96173 seven-row table into a chart-ready series (T, lnT,
 * rhoObserved, rhoLogLinear, rhoReciprocalLogFloor, segmentSlopeIn). No
 * re-derivation: every plotted value is copied verbatim from
 * ROUTE_BD_MARGIN_DECAY_FITS_TABLE / ROUTE_BD_MARGIN_DECAY_FITS_SUMMARY.
 *
 * PRESENTATION ONLY. No new zeros, no Gram build, no bound changes, no
 * operator positivity established; RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-96148-route-bd-online-margin-decay-law.js (source column + fits, derivation)
 * @see imp-96173-route-bd-margin-decay-fits-table.js (reader-facing table this leaf reshapes)
 *
 * Ticket: imp-96278 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

import {
  ROUTE_BD_MARGIN_DECAY_FITS_TABLE,
  ROUTE_BD_MARGIN_DECAY_FITS_SUMMARY,
} from './imp-96173-route-bd-margin-decay-fits-table.js';

export const IMP96278_MARGIN_DECAY_SERIES = ROUTE_BD_MARGIN_DECAY_FITS_TABLE.map((row) => ({
  T: row.T,
  lnT: Math.log(row.T),
  rhoObserved: row.rhoObserved,
  rhoLogLinear: row.rhoLogLinear,
  rhoReciprocalLogFloor: row.rhoReciprocalLogFloor,
  segmentSlopeIn: row.segmentSlopeIn,
}));

export const IMP96278_FIT_SUMMARY = Object.freeze({
  logLinear: ROUTE_BD_MARGIN_DECAY_FITS_SUMMARY.logLinear,
  reciprocalLogFloor: ROUTE_BD_MARGIN_DECAY_FITS_SUMMARY.reciprocalLogFloor,
  discriminator: ROUTE_BD_MARGIN_DECAY_FITS_SUMMARY.discriminator,
});

export const IMP96278_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every T, rhoObserved, rhoLogLinear, '
  + 'rhoReciprocalLogFloor and segmentSlopeIn value is copied verbatim from the imp-96173 reader-facing '
  + 'table (itself consolidating the imp-96148 derivation); only lnT is computed here for the chart axis. '
  + 'No new zeros, no Gram build, no bound changes, no operator positivity established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const approx = (x, y, tol) => Math.abs(x - y) <= tol;

const IMP96278_ASSERTIONS = [
  {
    id: 'imp96278-series-length-seven',
    holds: () => IMP96278_MARGIN_DECAY_SERIES.length === 7,
    why: 'imp-96148/imp-96173: seven baked height cutoffs from T=60 to gamma_200~395.98.',
  },
  {
    id: 'imp96278-series-matches-source-table',
    holds: () => IMP96278_MARGIN_DECAY_SERIES.every((p, i) => approx(p.T, ROUTE_BD_MARGIN_DECAY_FITS_TABLE[i].T, 1e-9)
      && approx(p.rhoObserved, ROUTE_BD_MARGIN_DECAY_FITS_TABLE[i].rhoObserved, 1e-12)
      && approx(p.rhoLogLinear, ROUTE_BD_MARGIN_DECAY_FITS_TABLE[i].rhoLogLinear, 1e-12)
      && approx(p.rhoReciprocalLogFloor, ROUTE_BD_MARGIN_DECAY_FITS_TABLE[i].rhoReciprocalLogFloor, 1e-12)),
    why: 'the reshaped series must reproduce the imp-96173 baked table row-for-row.',
  },
  {
    id: 'imp96278-lnt-monotone-increasing',
    holds: () => IMP96278_MARGIN_DECAY_SERIES.every((p, i) => i === 0 || p.lnT > IMP96278_MARGIN_DECAY_SERIES[i - 1].lnT),
    why: 'T is strictly increasing across the seven height cutoffs, so ln T must be too.',
  },
  {
    id: 'imp96278-first-row-has-no-incoming-slope',
    holds: () => IMP96278_MARGIN_DECAY_SERIES[0].segmentSlopeIn === null
      && IMP96278_MARGIN_DECAY_SERIES.slice(1).every((p) => typeof p.segmentSlopeIn === 'number'),
    why: 'a per-segment slope is defined between consecutive T points, so the first row has none.',
  },
  {
    id: 'imp96278-reciprocal-log-floor-wins-on-r2',
    holds: () => IMP96278_FIT_SUMMARY.reciprocalLogFloor.R2 > IMP96278_FIT_SUMMARY.logLinear.R2,
    why: 'the reciprocal-log-with-floor fit must carry the strictly higher R2, per imp-96148.',
  },
  {
    id: 'imp96278-honest-banner-present',
    holds: () => /RH open/.test(IMP96278_HONEST_BANNER) && /NO QED/.test(IMP96278_HONEST_BANNER) && /refereed bound is changed/i.test(IMP96278_HONEST_BANNER),
    why: 'honesty gate: presentation only, no RH claim, no refereed bound is changed.',
  },
];

for (const a of IMP96278_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96278-route-bd-margin-decay-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}
