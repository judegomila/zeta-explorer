/**
 * @module imp-96257-ushape-slope-drift-viz-data
 *
 * imp-96257 (ux): import-light viz-data leaf for the imp-96228 U-shape slope drift
 * measurement. imp-96228 extended the imp-96210 local log-slopes a(N) = d ln g_t/d ln N
 * and b(N) = -d ln g_f/d ln N a few decades past N_flow and found the b-dominated
 * upward drift stays monotone with no reversal, decelerates (saturates), and
 * approaches the (1/2, 1/2, 1) asymptote -- but shipped no chart.
 *
 * Reshapes the imp-96228 baked grid (landmarks.grid, seven rows from N_flow to
 * N_flow*1e6) plus the deep asymptotic probe (log10 N = 250) into three chart-ready
 * series (a, b, a+b vs log10 N) and the (1/2, 1/2, 1) reference lines. No re-derivation:
 * every plotted value is copied verbatim from IMP96228_USHAPE_SLOPE_DRIFT_BEYOND_NFLOW.
 *
 * MEASUREMENT / PRESENTATION ONLY. The component model is the inherited
 * imp-3220/imp-3406/imp-33723 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 stays untouched; changes no bound; establishes no
 * operator positivity; RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-96228-ushape-slope-drift-beyond-nflow.js (grid, deep probe, findings)
 *
 * Ticket: imp-96257 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

import { IMP96228_USHAPE_SLOPE_DRIFT_BEYOND_NFLOW } from './imp-96228-ushape-slope-drift-beyond-nflow.js';

const LANDMARKS = IMP96228_USHAPE_SLOPE_DRIFT_BEYOND_NFLOW.landmarks;
const GRID = LANDMARKS.grid;

// The seven baked grid rows (N_flow * 10^k, k=0..6), reshaped for direct plotting.
export const IMP96257_A_SERIES = GRID.map((row) => ({ log10N: row.log10N, a: row.a }));
export const IMP96257_B_SERIES = GRID.map((row) => ({ log10N: row.log10N, b: row.b }));
export const IMP96257_SUM_SERIES = GRID.map((row) => ({ log10N: row.log10N, sum: row.sum }));

// Deep asymptotic probe (log10 N = 250), appended as the far-N anchor point.
export const IMP96257_DEEP_PROBE = Object.freeze({
  log10N: 250,
  a: LANDMARKS.a_deep_probe,
  b: LANDMARKS.b_deep_probe,
  sum: LANDMARKS.sum_deep_probe,
});

export const IMP96257_ANCHORS = Object.freeze({
  log10NFlow: GRID[0].log10N,
  aAtNFlow: LANDMARKS.a_at_N_flow,
  bAtNFlow: LANDMARKS.b_at_N_flow,
  aAsymptote: 0.5,
  bAsymptote: 0.5,
  sumAsymptote: 1,
});

export const IMP96257_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every a(N), b(N), a+b grid value '
  + 'and the deep-probe reading are copied verbatim from the imp-96228 baked landmarks; only the '
  + 'chart-axis reshaping is computed here (no re-derivation, no new slope measurement). The '
  + 'component model is the inherited imp-3220/imp-3406/imp-33723 extrapolation, not a rigorous '
  + 'asymptotic; the C_mb GUE-conditional per imp-486 stays untouched; no bound changes, no operator '
  + 'positivity established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const approx = (x, y, tol) => Math.abs(x - y) <= tol;

const IMP96257_ASSERTIONS = [
  {
    id: 'imp96257-a-series-matches-source-grid',
    holds: () => IMP96257_A_SERIES.every((p, i) => approx(p.a, GRID[i].a, 1e-12) && approx(p.log10N, GRID[i].log10N, 1e-12)),
    why: 'the reshaped a(N) series must reproduce the imp-96228 baked grid row-for-row.',
  },
  {
    id: 'imp96257-b-series-strictly-increasing',
    holds: () => IMP96257_B_SERIES.every((p, i) => i === 0 || p.b > IMP96257_B_SERIES[i - 1].b),
    why: 'imp-96228 G1: b(N) rises monotonically across the seven-row grid, no reversal.',
  },
  {
    id: 'imp96257-sum-series-strictly-increasing-and-below-one',
    holds: () => IMP96257_SUM_SERIES.every((p, i) => (i === 0 || p.sum > IMP96257_SUM_SERIES[i - 1].sum) && p.sum < 1),
    why: 'imp-96228 G2/G3: a+b rises monotonically toward 1 from below across the grid.',
  },
  {
    id: 'imp96257-deep-probe-near-half-half-one',
    holds: () => approx(IMP96257_DEEP_PROBE.a, 0.5, 0.005)
      && approx(IMP96257_DEEP_PROBE.b, 0.5, 0.01)
      && approx(IMP96257_DEEP_PROBE.sum, 1, 0.01)
      && IMP96257_DEEP_PROBE.sum < 1,
    why: 'imp-96228 G3: the deep probe at log10 N = 250 lands near the (1/2,1/2,1) asymptote, approached from below.',
  },
  {
    id: 'imp96257-anchors-match-nflow-endpoint',
    holds: () => approx(IMP96257_ANCHORS.aAtNFlow, GRID[0].a, 1e-12) && approx(IMP96257_ANCHORS.bAtNFlow, GRID[0].b, 1e-12),
    why: 'the N_flow anchor values must match the first grid row (the imp-96210 endpoint).',
  },
  {
    id: 'imp96257-honest-banner-carries-status',
    holds: () => /RH open/.test(IMP96257_HONEST_BANNER) && /NO QED/.test(IMP96257_HONEST_BANNER) && /refereed bound is changed/i.test(IMP96257_HONEST_BANNER),
    why: 'honesty gate: measurement/presentation only, no RH claim, no refereed bound is changed.',
  },
];

for (const a of IMP96257_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96257-ushape-slope-drift-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}
