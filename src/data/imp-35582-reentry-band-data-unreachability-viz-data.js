/**
 * @module imp-35582-reentry-band-data-unreachability-viz-data
 * @fileoverview imp-35582 -- VIZ DATA ONLY for the imp-35537 Part D / imp-35243 D2
 *   reentry-band data-unreachability finding: the R1t reentry band N-range
 *   [10^27.084691, 10^37.167107] sits ~14.6-24.7 decades ABOVE the ~3e12 Platt-Trudgian
 *   verified frontier, so route-(ii) direct measurement (which rescued the imp-35475
 *   sigma landmarks) is INFEASIBLE here.
 *
 *   Re-exports the imp-35537 operativeSwap literals verbatim (that module bakes its own
 *   numeric constants and imports nothing heavy), per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35537-r1t-reentry-band-closure-scope.js (Part D, the source of every figure here)
 *   @see imp-35559-r1t-reentry-band-decade-gap-quantification.js (the tabulated per-endpoint gaps)
 *   @see imp-35475-sigma-fidelity-closure-scope (the sigma-side comparison case)
 *   @see imp-35580-req4-height-gap-viz-data.js (the log-height bar-chart pattern this mirrors)
 *
 *   Ticket: imp-35582 (ux, medium). Presentation only of an already-established
 *   data-unreachability scoping; adds no new Lambda bound, derives no remainder.
 *   No refereed bound is changed. NO QED.
 */

import { IMP35537_R1T_REENTRY_BAND_CLOSURE_SCOPE } from './imp-35537-r1t-reentry-band-closure-scope.js';

const OS = IMP35537_R1T_REENTRY_BAND_CLOSURE_SCOPE.operativeSwap;

// -- the log10(N) axis markers: the verified frontier and the two reentry-band edges.
export const IMP35582_LOG10_N_MARKERS = Object.freeze([
  Object.freeze({ key: 'pt', label: 'Platt-Trudgian verified frontier (T=3e12)', log10N: Math.log10(3e12) }),
  Object.freeze({ key: 'reentry', label: 'reentry edge (N~10^27.08)', log10N: OS.reentry_log10_N }),
  Object.freeze({ key: 'exit', label: 'exit edge (N~10^37.17)', log10N: OS.exit_log10_N }),
]);

export const IMP35582_SUMMARY = Object.freeze({
  reentry_log10_N: OS.reentry_log10_N,
  exit_log10_N: OS.exit_log10_N,
  reentryDecadesAboveT_PT: OS.reentryDecadesAboveT_PT,
  exitDecadesAboveT_PT: OS.exitDecadesAboveT_PT,
  bandHeightsAboveT_PT: OS.bandHeightsAboveT_PT,
});

export default Object.freeze({
  id: 'imp-35582-reentry-band-data-unreachability-viz-data',
  ticket: 'imp-35582',
  sources: ['imp-35537-r1t-reentry-band-closure-scope.js'],
  markers: IMP35582_LOG10_N_MARKERS,
  summary: IMP35582_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35582_ASSERTIONS = [
  {
    id: 'imp35582-three-markers-present-in-ascending-order',
    holds: () =>
      IMP35582_LOG10_N_MARKERS.length === 3 &&
      IMP35582_LOG10_N_MARKERS.every(
        (m, i) => i === 0 || m.log10N > IMP35582_LOG10_N_MARKERS[i - 1].log10N
      ),
    why:
      'The three log10(N) markers (PT frontier, reentry edge, exit edge) must be present ' +
      'and strictly ascending, matching the imp-35537 D2 finding that the whole band sits ' +
      'above the verified frontier.',
  },
  {
    id: 'imp35582-band-sits-14-to-25-decades-above-frontier',
    holds: () =>
      IMP35582_SUMMARY.bandHeightsAboveT_PT === true &&
      IMP35582_SUMMARY.reentryDecadesAboveT_PT > 14 && IMP35582_SUMMARY.reentryDecadesAboveT_PT < 15 &&
      IMP35582_SUMMARY.exitDecadesAboveT_PT > 24 && IMP35582_SUMMARY.exitDecadesAboveT_PT < 25,
    why:
      'The reentry and exit edges must sit ~14.6 and ~24.7 decades above the PT frontier ' +
      'respectively, reproducing the imp-35537/imp-35243 D2 figures.',
  },
];

for (const assertion of IMP35582_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35582-reentry-band-data-unreachability-viz-data assertion failed: ${assertion.id}`);
  }
}
