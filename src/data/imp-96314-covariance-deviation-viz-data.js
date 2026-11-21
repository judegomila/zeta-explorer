/**
 * @module imp-96314-covariance-deviation-viz-data
 *
 * imp-96314 (ux): import-light viz-data leaf for the imp-96267 GUE two-interval
 * covariance deviation |rho_exact + 1/2| vs log10 T decade ladder. imp-96267
 * computed rho_exact(T) on a decade ladder to 1e12 (plus the Platt-Trudgian
 * verified-height anchor 3e12) and found the deviation from the GUE-rigidity
 * limit -1/2 only falls 0.0436 -> 0.0188 across eight decades -- a 1/log T
 * crawl -- but shipped no chart.
 *
 * Reshapes the imp-96267 baked ladder (ten rows: nine decades plus the PT
 * anchor) into a chart-ready series (log10 T, deviation) and copies the two
 * epsilon-reach crossings (1e-2, 1e-3) verbatim. No re-derivation: every
 * plotted value is copied from IMP96267_COVARIANCE_DRIFT_RIGIDITY_LIMIT_REACH.
 *
 * MEASUREMENT / PRESENTATION ONLY. rho_exact is the theoretical GUE
 * (sine-kernel, universality) two-interval correlation, not a measurement of
 * the actual Riemann zeros; changes no bound; establishes no operator
 * positivity; RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-96267-covariance-drift-rigidity-limit-reach.js (ladder, crossings, findings)
 *
 * Ticket: imp-96314 (ux, sonnet-4-6, medium). Presentation only, RH-free; changes no bound; NO QED.
 */

import { IMP96267_COVARIANCE_DRIFT_RIGIDITY_LIMIT_REACH } from './imp-96267-covariance-drift-rigidity-limit-reach.js';

const LADDER = IMP96267_COVARIANCE_DRIFT_RIGIDITY_LIMIT_REACH.ladder;

// The ten baked ladder rows (nine decades 1e4..1e12 plus the PT anchor 3e12),
// reshaped for direct plotting against log10 T.
export const IMP96314_DEVIATION_SERIES = LADDER.map((row) => ({
  log10T: Math.log10(row.T),
  deviation: row.deviation,
  rhoExact: row.rhoExact,
  isPlattTrudgianAnchor: row.isPlattTrudgianAnchor,
}));

export const IMP96314_CROSSINGS = IMP96267_COVARIANCE_DRIFT_RIGIDITY_LIMIT_REACH.crossings.map((c) => ({
  epsilon: c.epsilon,
  log10Height: c.log10Height,
  decadesPastPlattTrudgian: c.decadesPastPlattTrudgian,
}));

export const IMP96314_ANCHORS = Object.freeze({
  rigidityLimit: IMP96267_COVARIANCE_DRIFT_RIGIDITY_LIMIT_REACH.rigidityLimit,
  plattTrudgianDeviation: IMP96267_COVARIANCE_DRIFT_RIGIDITY_LIMIT_REACH.plattTrudgianAnchor.deviation,
  plattTrudgianLog10T: Math.log10(IMP96267_COVARIANCE_DRIFT_RIGIDITY_LIMIT_REACH.plattTrudgianAnchor.T),
  firstLog10T: IMP96314_DEVIATION_SERIES[0].log10T,
  lastDecadeLog10T: IMP96314_DEVIATION_SERIES[IMP96314_DEVIATION_SERIES.length - 2].log10T,
});

export const IMP96314_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every deviation, rho_exact, and '
  + 'crossing value is copied verbatim from the imp-96267 baked ladder; only the chart-axis reshaping '
  + '(log10 T) is computed here (no re-derivation, no new height measurement). rho_exact is the '
  + 'theoretical GUE (sine-kernel, universality) two-interval correlation, not a measurement of the '
  + 'actual Riemann zeros; no bound changes, no operator positivity established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const approx = (x, y, tol) => Math.abs(x - y) <= tol;

const IMP96314_ASSERTIONS = [
  {
    id: 'imp96314-series-matches-source-ladder',
    holds: () => IMP96314_DEVIATION_SERIES.every((p, i) => approx(p.deviation, LADDER[i].deviation, 1e-12)
      && approx(p.rhoExact, LADDER[i].rhoExact, 1e-12)),
    why: 'the reshaped deviation series must reproduce the imp-96267 baked ladder row-for-row.',
  },
  {
    id: 'imp96314-series-length-ten',
    holds: () => IMP96314_DEVIATION_SERIES.length === 10,
    why: 'imp-96267: nine decade rungs (1e4..1e12) plus the Platt-Trudgian anchor (3e12).',
  },
  {
    id: 'imp96314-deviation-monotone-decreasing-across-decades',
    holds: () => {
      const decadeRows = IMP96314_DEVIATION_SERIES.filter((p) => !p.isPlattTrudgianAnchor);
      return decadeRows.every((p, i) => i === 0 || p.deviation < decadeRows[i - 1].deviation);
    },
    why: 'imp-96267: |rho_exact + 1/2| strictly decreases across the decade ladder toward the -1/2 asymptote.',
  },
  {
    id: 'imp96314-crossings-far-past-plotted-range',
    holds: () => IMP96314_CROSSINGS.every((c) => c.log10Height > IMP96314_ANCHORS.plattTrudgianLog10T + 10),
    why: 'imp-96267: both epsilon-reach crossings (1e-2, 1e-3) sit >10 decades past the PT verified height, off the plotted ladder.',
  },
  {
    id: 'imp96314-anchors-match-source',
    holds: () => approx(IMP96314_ANCHORS.rigidityLimit, -0.5, 1e-12)
      && approx(IMP96314_ANCHORS.plattTrudgianDeviation, IMP96267_COVARIANCE_DRIFT_RIGIDITY_LIMIT_REACH.plattTrudgianAnchor.deviation, 1e-12),
    why: 'the rigidity-limit and PT-anchor readouts must match the imp-96267 source verbatim.',
  },
  {
    id: 'imp96314-honest-banner-carries-status',
    holds: () => /RH open/.test(IMP96314_HONEST_BANNER) && /NO QED/.test(IMP96314_HONEST_BANNER) && /refereed bound is changed/i.test(IMP96314_HONEST_BANNER),
    why: 'honesty gate: measurement/presentation only, no RH claim, no refereed bound is changed.',
  },
];

for (const a of IMP96314_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96314-covariance-deviation-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}
