/**
 * @module imp-35549-height-map-divergence-viz-data
 * @fileoverview imp-35549 -- VIZ DATA ONLY measuring the divergence between the two far-tail
 *   height maps in use across this ticket cohort: effectiveHeightForN (the Newton-iterated
 *   Riemann-von Mangoldt inverse, imp-35476) vs the closed surrogate T0 = 2*pi*N/logN
 *   (imp-35473/imp-35280, the zeroth Newton iterate). Both maps solve for the same T0 given N,
 *   but the surrogate stops after one step of the inversion, so the two disagree by an amount
 *   that shrinks only slowly (as N grows, ln(T0/2pi) grows, and the surrogate's missing "-1"
 *   correction term becomes relatively smaller).
 *
 *   Ladder across N = 1e6 .. 1e200 (16 rungs spanning the full range used by the sigma-peak and
 *   E_flow far-tail cohorts): the relative divergence T0_effective/T0_surrogate - 1 falls
 *   monotonically from ~32.0% at N=1e6 to ~1.57% at N=1e200, but does NOT vanish anywhere in
 *   this range -- confirming the two maps are genuinely distinct height conventions, not
 *   numerically-identical proxies, across the entire cohort's operating range.
 *
 *   Both maps are computed LIVE here (cheap closed-form / bounded-iteration arithmetic, no
 *   fresh derivation) rather than baked, importing only the lightweight `effectiveHeightForN`
 *   helper (never the 16.7MB zeros bundle), per [[no_heavy_imports_in_pages]].
 *
 *   @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 *   @see imp-35476-sigma-peak-plateau-sqrt-tol-offgrid.js (effectiveHeightForN consumer)
 *   @see imp-35473-eflow-fartail-remnant-sub1e4-crossing.js (closed surrogate T0=2piN/logN consumer)
 *
 *   Ticket: imp-35549 (ux, medium). Measurement only, diagnostic re-plot of two already-existing
 *   height maps; adds no new Lambda bound. C_mb GUE-conditional per imp-486 UNTOUCHED. NO QED.
 *   No refereed bound is changed.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;

function surrogateHeightForN(N) {
  return (TWO_PI * N) / Math.log(N);
}

// -- N ladder: decades spanning the cohort's full operating range (1e6 .. 1e200). --
const LOG10_N_RUNGS = Object.freeze([6, 9, 12, 16, 20, 26, 30, 40, 50, 60, 80, 100, 120, 150, 170, 200]);

export const IMP35549_HEIGHT_DIVERGENCE_ROWS = Object.freeze(
  LOG10_N_RUNGS.map((log10N) => {
    const N = Math.pow(10, log10N);
    const T0_effective = effectiveHeightForN(N);
    const T0_surrogate = surrogateHeightForN(N);
    const relativeDivergence = T0_effective / T0_surrogate - 1;
    return Object.freeze({ log10N, N, T0_effective, T0_surrogate, relativeDivergence });
  })
);

export const IMP35549_SUMMARY = Object.freeze({
  rungCount: IMP35549_HEIGHT_DIVERGENCE_ROWS.length,
  firstRelativeDivergence: IMP35549_HEIGHT_DIVERGENCE_ROWS[0].relativeDivergence,
  lastRelativeDivergence:
    IMP35549_HEIGHT_DIVERGENCE_ROWS[IMP35549_HEIGHT_DIVERGENCE_ROWS.length - 1].relativeDivergence,
  monotonicallyDecreasing: IMP35549_HEIGHT_DIVERGENCE_ROWS.every(
    (row, i) => i === 0 || row.relativeDivergence < IMP35549_HEIGHT_DIVERGENCE_ROWS[i - 1].relativeDivergence
  ),
});

export default Object.freeze({
  id: 'imp-35549-height-map-divergence-viz-data',
  ticket: 'imp-35549',
  sources: ['lambda-rh-height-mapping.js', 'imp-35473-eflow-fartail-remnant-sub1e4-crossing.js'],
  rows: IMP35549_HEIGHT_DIVERGENCE_ROWS,
  summary: IMP35549_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35549_ASSERTIONS = [
  {
    id: 'imp35549-sixteen-rungs-present',
    holds: () => IMP35549_HEIGHT_DIVERGENCE_ROWS.length === 16,
    why: 'The ladder must cover all 16 decade rungs from N=1e6 to N=1e200.',
  },
  {
    id: 'imp35549-divergence-monotonically-decreasing',
    holds: () => IMP35549_SUMMARY.monotonicallyDecreasing === true,
    why:
      'The relative divergence between the Newton-iterated inverse and its zeroth-iterate ' +
      'surrogate must shrink monotonically as N grows (the missing correction term becomes ' +
      'relatively smaller), with no non-monotonic bump.',
  },
  {
    id: 'imp35549-divergence-never-vanishes',
    holds: () => IMP35549_HEIGHT_DIVERGENCE_ROWS.every((row) => row.relativeDivergence > 0.01),
    why:
      'Across the full N=1e6..1e200 cohort operating range the two height maps must stay ' +
      'genuinely distinct (divergence bounded well above zero), confirming they are not ' +
      'numerically-interchangeable proxies anywhere in this range.',
  },
  {
    id: 'imp35549-endpoints-match-live-recomputation',
    holds: () => {
      const first = IMP35549_HEIGHT_DIVERGENCE_ROWS[0];
      const last = IMP35549_HEIGHT_DIVERGENCE_ROWS[IMP35549_HEIGHT_DIVERGENCE_ROWS.length - 1];
      return (
        Math.abs(first.relativeDivergence - 0.319879) < 1e-4 &&
        Math.abs(last.relativeDivergence - 0.015696) < 1e-4
      );
    },
    why:
      'The N=1e6 and N=1e200 endpoint divergences must reproduce the measured values ' +
      '(~31.99% and ~1.57%) to a loose tolerance, guarding against a formula regression.',
  },
];

for (const assertion of IMP35549_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35549-height-map-divergence-viz-data assertion failed: ${assertion.id}`);
  }
}
