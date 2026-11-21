/**
 * @module imp-96338-worst-excess-evt-viz-data
 *
 * imp-96338 (ux): import-light viz-data leaf for the imp-96271 worst-excess
 * extreme-value test. imp-96271 compared the observed worst single-window
 * discrepancy excess (worstSigma) at six imp-95562 heights against the
 * closed-form extreme-value statistics of a batch of n i.i.d. standard
 * Gaussians (E[max] and its Gumbel sd), and found every height within the
 * envelope, but shipped no chart.
 *
 * Reshapes the imp-96271 baked ROWS into a single chart-ready series
 * (worstSigma vs an E[max] +/- 1 Gumbel-sd band per height) plus the
 * leading-order sqrt(2 ln n) reference and the deviation-in-Gumbel-sd column.
 * No re-derivation: every plotted value is copied verbatim from
 * IMP96271_WORST_EXCESS_EVT_GAUSSIANITY.rows / .aggregates.
 *
 * PRESENTATION ONLY. This charts a measurement comparison already reduced by
 * imp-96271 (which itself only tests a claim from imp-95562 finding 2). It
 * establishes no operator positivity, moves no Lambda bound, and touches
 * nothing on the zero side. RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-96271-worst-excess-evt-gaussianity.js (ROWS, aggregates, verdict)
 *
 * Ticket: imp-96338 (ux, sonnet-4-6, medium). Presentation only, RH-free; changes no bound; NO QED.
 */

import { IMP96271_WORST_EXCESS_EVT_GAUSSIANITY } from './imp-96271-worst-excess-evt-gaussianity.js';

const SOURCE_ROWS = IMP96271_WORST_EXCESS_EVT_GAUSSIANITY.rows;

// The six baked heights, reshaped with a +/-1 Gumbel-sd band around E[max]
// alongside the observed worstSigma and the leading-order reference, sorted
// Tc ascending (already the source order).
export const IMP96338_SERIES = SOURCE_ROWS.map((row) => ({
  Tc: row.Tc,
  nWindows: row.nWindows,
  worstSigma: row.worstSigma,
  evtLeadingSqrt2LnN: row.evtLeadingSqrt2LnN,
  expectedMax: row.evtExpectedMax,
  maxSd: row.evtMaxSd,
  bandLow: row.evtExpectedMax - row.evtMaxSd,
  bandHigh: row.evtExpectedMax + row.evtMaxSd,
  deviationInGumbelSd: row.deviationInGumbelSd,
  consistentWithGaussianTail: row.consistentWithGaussianTail,
}));

export const IMP96338_AGGREGATES = Object.freeze({
  deviationRangeGumbelSd: IMP96271_WORST_EXCESS_EVT_GAUSSIANITY.aggregates.deviationRangeGumbelSd,
  allWithinEvtEnvelope: IMP96271_WORST_EXCESS_EVT_GAUSSIANITY.aggregates.allWithinEvtEnvelope,
  nHeightsExceedingLeadingOrder: IMP96271_WORST_EXCESS_EVT_GAUSSIANITY.aggregates.nHeightsExceedingLeadingOrder,
  nHeights: IMP96271_WORST_EXCESS_EVT_GAUSSIANITY.aggregates.nHeights,
});

export const IMP96338_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every worstSigma, E[max], Gumbel-sd, '
  + 'and deviation value is copied verbatim from the imp-96271 baked rows (no re-derivation); only the '
  + 'bandLow/bandHigh = E[max] -/+ sd[max] arithmetic is computed here. This charts a measurement '
  + 'comparison already reduced by imp-96271: it establishes no operator positivity, moves no Lambda '
  + 'bound, and touches nothing on the zero side.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const approx = (x, y, tol) => Math.abs(x - y) <= tol;

const IMP96338_ASSERTIONS = [
  {
    id: 'imp96338-series-matches-source-row-for-row',
    holds: () => IMP96338_SERIES.every((p, i) => {
      const src = SOURCE_ROWS[i];
      return p.Tc === src.Tc
        && p.nWindows === src.nWindows
        && approx(p.worstSigma, src.worstSigma, 1e-15)
        && approx(p.expectedMax, src.evtExpectedMax, 1e-15)
        && approx(p.maxSd, src.evtMaxSd, 1e-15)
        && approx(p.deviationInGumbelSd, src.deviationInGumbelSd, 1e-15);
    }),
    why: 'the reshaped series must reproduce the imp-96271 baked rows verbatim (Tc, nWindows, worstSigma, E[max], sd[max], deviation).',
  },
  {
    id: 'imp96338-series-length-six',
    holds: () => IMP96338_SERIES.length === 6,
    why: 'imp-96271 bakes exactly six imp-95562 heights.',
  },
  {
    id: 'imp96338-band-symmetric-and-centered-on-expected-max',
    holds: () => IMP96338_SERIES.every((p) => approx((p.bandLow + p.bandHigh) / 2, p.expectedMax, 1e-15)
      && approx((p.bandHigh - p.bandLow) / 2, p.maxSd, 1e-15)),
    why: 'bandLow/bandHigh must be E[max] -/+ sd[max], i.e. a +/-1 Gumbel-sd band centered exactly on the expected maximum.',
  },
  {
    id: 'imp96338-worst-sigma-within-band-iff-consistent-flag',
    holds: () => IMP96338_SERIES.every((p) => {
      const withinOneSd = p.worstSigma >= p.bandLow && p.worstSigma <= p.bandHigh;
      // the imp-96271 consistency flag uses a wider +/-2.5 sd envelope, so a
      // point outside the plotted +/-1 sd band can still be flagged consistent.
      return withinOneSd ? p.consistentWithGaussianTail : true;
    }),
    why: 'any height falling inside the plotted +/-1 sd band must also be flagged consistent by the wider imp-96271 envelope (no contradictory display).',
  },
  {
    id: 'imp96338-aggregates-match-source',
    holds: () => IMP96338_AGGREGATES.nHeights === 6
      && IMP96338_AGGREGATES.allWithinEvtEnvelope === true
      && IMP96338_AGGREGATES.nHeightsExceedingLeadingOrder === 1
      && approx(IMP96338_AGGREGATES.deviationRangeGumbelSd.min, IMP96271_WORST_EXCESS_EVT_GAUSSIANITY.aggregates.deviationRangeGumbelSd.min, 1e-15)
      && approx(IMP96338_AGGREGATES.deviationRangeGumbelSd.max, IMP96271_WORST_EXCESS_EVT_GAUSSIANITY.aggregates.deviationRangeGumbelSd.max, 1e-15),
    why: 'the copied aggregates must match the imp-96271 source exactly.',
  },
  {
    id: 'imp96338-honest-banner-carries-status',
    holds: () => /RH open/.test(IMP96338_HONEST_BANNER) && /NO QED/.test(IMP96338_HONEST_BANNER) && /refereed bound is changed/i.test(IMP96338_HONEST_BANNER),
    why: 'honesty gate: presentation only, no RH claim, no refereed bound is changed.',
  },
];

for (const a of IMP96338_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96338-worst-excess-evt-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}
