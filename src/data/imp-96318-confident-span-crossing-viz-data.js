/**
 * @module imp-96318-confident-span-crossing-viz-data
 *
 * imp-96318 (ux): import-light viz-data leaf for the imp-96288 confident
 * two-tone (AICc > 0.90) separation-span crossing L(rho) vs amplitude ratio
 * rho = A4/A5. imp-96288 re-ran the imp-96264 pipeline at fine rho/span
 * resolution and found the crossing sits in a FLAT PLATEAU (~9.05-9.25, just
 * below the Rayleigh span 9.999) across the near-equal-amplitude regime
 * |log rho| <= ln 1.26, then rises monotonically with imbalance outside it --
 * but shipped no chart.
 *
 * Reshapes the imp-96288 baked fine-grid crossing curve into a chart-ready
 * series (log rho, crossSpan) and copies the plateau/verdict literals
 * verbatim. No re-derivation: every plotted value is copied from
 * IMP96288_CROSS_CURVE / IMP96288_VERDICT.
 *
 * PRESENTATION ONLY. Simulation-derived values (synthetic q4+q5 two-tone plus
 * matched noise); no new zeros, no Gram build, no bound changes, no operator
 * positivity established; RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-96288-route-m-confident-span-lower-bound-test.js (fine-grid crossing curve, verdict; imp-96318 viz page)
 *
 * Ticket: imp-96318 (ux, sonnet-4-6, medium). Presentation only, RH-free; changes no bound; NO QED.
 */

import {
  IMP96288_CROSS_CURVE,
  IMP96288_VERDICT,
  IMP96288_RAYLEIGH_SPAN,
} from './imp-96288-route-m-confident-span-lower-bound-test.js';

// The fifteen baked fine-grid rows, reshaped for plotting against log(rho).
export const IMP96318_CROSSING_SERIES = IMP96288_CROSS_CURVE.map((row) => ({
  rho: row.rho,
  logRho: Math.log(row.rho),
  crossSpan: row.crossSpan,
  isEqualAmplitude: row.rho === 1.0,
  isGlobalMin: row.rho === IMP96288_VERDICT.minSpanRho,
}));

// Plateau band matches the imp-96288 "near" window used in its own
// imp96288-conservative-plateau-holds assertion (0.84 <= rho <= 1.19), the
// verified sub-range where the crossing span stays inside 9.05..9.25 and
// below every imbalanced-tail ("far": rho <= 0.5 or rho >= 2.0) value.
export const IMP96318_PLATEAU = Object.freeze({
  rhoLow: 0.84,
  rhoHigh: 1.19,
  spanLow: 9.051,
  spanHigh: 9.250,
  label: IMP96288_VERDICT.plateauSpanBand,
});

export const IMP96318_ANCHORS = Object.freeze({
  rayleighSpan: IMP96288_RAYLEIGH_SPAN,
  eqSpanRho1: IMP96288_VERDICT.eqSpanRho1,
  minSpan: IMP96288_VERDICT.minSpan,
  minSpanRho: IMP96288_VERDICT.minSpanRho,
  marginVsEqual: IMP96288_VERDICT.marginVsEqual,
  strictSubgapHolds: IMP96288_VERDICT.strictSubgapHolds,
  conservativeConclusionHolds: IMP96288_VERDICT.conservativeConclusionHolds,
});

export const IMP96318_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every crossSpan and rho value is '
  + 'copied verbatim from the imp-96288 baked fine-grid curve; only the log(rho) axis reshaping is computed '
  + 'here (no re-derivation, no new Monte-Carlo run). Synthetic q4+q5 two-tone simulation only; no new zeros, '
  + 'no Gram build, no bound changes, no operator positivity established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const approx = (x, y, tol) => Math.abs(x - y) <= tol;

const IMP96318_ASSERTIONS = [
  {
    id: 'imp96318-series-matches-source-curve',
    holds: () => IMP96318_CROSSING_SERIES.every((p, i) => approx(p.rho, IMP96288_CROSS_CURVE[i].rho, 1e-12)
      && approx(p.crossSpan, IMP96288_CROSS_CURVE[i].crossSpan, 1e-12)),
    why: 'the reshaped crossing series must reproduce the imp-96288 baked fine-grid curve row-for-row.',
  },
  {
    id: 'imp96318-series-length-fifteen',
    holds: () => IMP96318_CROSSING_SERIES.length === 15,
    why: 'imp-96288: fifteen fine log-spaced rho points densely sampling |log rho| <= ln 2.',
  },
  {
    id: 'imp96318-plateau-below-rayleigh-and-eq-flagged',
    holds: () => {
      const eq = IMP96318_CROSSING_SERIES.find((p) => p.isEqualAmplitude);
      const globalMin = IMP96318_CROSSING_SERIES.find((p) => p.isGlobalMin);
      return eq && globalMin
        && eq.crossSpan < IMP96318_ANCHORS.rayleighSpan
        && globalMin.crossSpan < eq.crossSpan
        && approx(globalMin.crossSpan, IMP96318_ANCHORS.minSpan, 1e-9);
    },
    why: 'the equal-amplitude (rho=1) crossing must sit below the Rayleigh span, and the flagged global-minimum row must match the imp-96288 verdict minSpan.',
  },
  {
    id: 'imp96318-plateau-band-inside-far-tail',
    holds: () => {
      const inPlateau = IMP96318_CROSSING_SERIES.filter((p) => p.rho >= IMP96318_PLATEAU.rhoLow && p.rho <= IMP96318_PLATEAU.rhoHigh);
      const farTail = IMP96318_CROSSING_SERIES.filter((p) => p.rho <= 0.5 || p.rho >= 2.0);
      const plateauMax = Math.max(...inPlateau.map((p) => p.crossSpan));
      const farMin = Math.min(...farTail.map((p) => p.crossSpan));
      return inPlateau.length === 7 && farTail.length === 2 && plateauMax < farMin;
    },
    why: 'the near-equal plateau rows (rho in [0.84, 1.19]) must sit strictly below every far-imbalanced-tail (rho<=0.5 or rho>=2.0) crossing span, matching the imp-96288 imp96288-conservative-plateau-holds assertion.',
  },
  {
    id: 'imp96318-honest-banner-present',
    holds: () => /RH open/.test(IMP96318_HONEST_BANNER) && /NO QED/.test(IMP96318_HONEST_BANNER) && /refereed bound is changed/i.test(IMP96318_HONEST_BANNER),
    why: 'honesty gate: presentation only, no RH claim, no refereed bound is changed.',
  },
];

for (const a of IMP96318_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96318-confident-span-crossing-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}
