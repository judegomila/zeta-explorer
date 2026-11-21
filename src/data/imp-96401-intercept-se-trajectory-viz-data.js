/**
 * @module imp-96401-intercept-se-trajectory-viz-data
 *
 * imp-96401 (ux, sonnet-4-6): import-light viz-data leaf for the imp-96367
 * reciprocal-log margin-floor intercept-vs-census-depth trajectory. Reshapes
 * the imp-96367 TRAJECTORY rows into a chart-ready series (depth, n, intercept,
 * seC, +/-2 SE band around zero) and appends the labeled gamma_8000 projection
 * as a sixth, visually distinguished point. No re-derivation: every plotted
 * value is copied verbatim from IMP_96367_INTERCEPT_SE_TRAJECTORY.
 *
 * PRESENTATION ONLY. No new zeros, no LP solve, no bound changes, no operator
 * positivity established; RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-96367-route-bd-intercept-se-trajectory.js (source measurement, method, verdict)
 */

import { IMP_96367_INTERCEPT_SE_TRAJECTORY } from './imp-96367-route-bd-intercept-se-trajectory.js';

const { trajectory, projection, confidence, intercept, standardError, finding } =
  IMP_96367_INTERCEPT_SE_TRAJECTORY;

export const IMP96401_MEASURED_SERIES = Object.freeze(
  trajectory.map((row, i) => Object.freeze({
    depth: row.depth,
    index: i,
    n: row.n,
    intercept: row.intercept,
    seC: row.seC,
    twoSE: 2 * row.seC,
    cOverSE: row.cOverSE,
    isProjection: false,
  })),
);

export const IMP96401_PROJECTED_POINT = Object.freeze({
  depth: 'gamma8000',
  index: IMP96401_MEASURED_SERIES.length,
  n: null,
  intercept: projection.interceptG8000,
  seC: projection.seG8000,
  twoSE: 2 * projection.seG8000,
  cOverSE: projection.cOverSEG8000,
  isProjection: true,
});

export const IMP96401_FULL_SERIES = Object.freeze(
  [...IMP96401_MEASURED_SERIES, IMP96401_PROJECTED_POINT],
);

export const IMP96401_SUMMARY = Object.freeze({
  g500Peak: intercept.g500Peak,
  g4000: intercept.g4000,
  ratios: { ...intercept.ratios },
  seFlat: !standardError.shrinking,
  numeratorDriven: confidence.numeratorDriven,
  projectedCOverSE: projection.cOverSEG8000,
  wouldBeIndistinguishableFromZero: projection.wouldBeIndistinguishableFromZero,
});

export const IMP96401_FINDING = finding;

export const IMP96401_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every depth, intercept, '
  + 'seC, and the labeled gamma_8000 projection is copied verbatim from the imp-96367 baked '
  + 'trajectory (no re-fit); only the +/-2 SE band and the sixth projected point are computed '
  + 'here for the chart. The projection is not a measurement -- the asymptotic sign past '
  + 'gamma_4000 stays measurement-undecided; the binding envelope (0.3791 at gamma_4000) stays '
  + 'strictly positive; no bound moves.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96401_ASSERTIONS = [
  {
    id: 'imp96401-measured-series-length-five',
    holds: () => IMP96401_MEASURED_SERIES.length === 5,
    why: 'imp-96367 baked five census depths from gamma_200 to gamma_4000.',
  },
  {
    id: 'imp96401-series-matches-source-trajectory',
    holds: () => IMP96401_MEASURED_SERIES.every((p, i) => p.n === trajectory[i].n
      && Math.abs(p.intercept - trajectory[i].intercept) < 1e-12
      && Math.abs(p.seC - trajectory[i].seC) < 1e-12),
    why: 'the reshaped series must reproduce the imp-96367 baked trajectory row-for-row.',
  },
  {
    id: 'imp96401-projected-point-appended-and-labeled',
    holds: () => IMP96401_FULL_SERIES.length === 6
      && IMP96401_FULL_SERIES[5].isProjection === true
      && IMP96401_FULL_SERIES.slice(0, 5).every((p) => p.isProjection === false),
    why: 'the gamma_8000 projection must be a sixth, distinctly labeled point -- never mixed into the five measured rows.',
  },
  {
    id: 'imp96401-projected-point-inside-two-se-band',
    holds: () => Math.abs(IMP96401_PROJECTED_POINT.intercept) < IMP96401_PROJECTED_POINT.twoSE
      && IMP96401_SUMMARY.wouldBeIndistinguishableFromZero === true,
    why: 'the projected gamma_8000 intercept must fall inside its own +/-2 SE band, matching the imp-96367 verdict.',
  },
  {
    id: 'imp96401-honest-banner-present',
    holds: () => /RH open/.test(IMP96401_HONEST_BANNER) && /NO QED/.test(IMP96401_HONEST_BANNER) && /refereed bound is changed/i.test(IMP96401_HONEST_BANNER),
    why: 'honesty gate: presentation only, no RH claim, no refereed bound is changed.',
  },
];

for (const a of IMP96401_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96401-intercept-se-trajectory-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}
