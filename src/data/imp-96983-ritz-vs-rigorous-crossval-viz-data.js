/**
 * @module imp-96983-ritz-vs-rigorous-crossval-viz-data
 * @fileoverview imp-96983 -- import-light viz-data leaf for the imp-96958 Ritz-vs-rigorous
 *   cross-validation at 2a=0.96 (a=0.48): the imp-96938 Ritz UPPER-estimate band
 *   [12.0089, 21.0155] lies entirely inside the interval-rigorous certificate flanking
 *   bracket (7.743, 56.05), both placing lambda_1(T_0.48[sigma_2]) in the order-10 positive
 *   band, ~22x the binding 2a=(ln3)/2 margin (~0.5521). Bakes the two estimator bands and
 *   the flanking rungs as plain range points (with log10 coordinates for a log-scale range
 *   chart), so a consuming page skips re-importing the imp-96958 chain. Presentation only;
 *   the Ritz values are UPPER estimates, not certified lower bounds; changes no bound; RH
 *   open; NO QED.
 *
 * @see imp-96958-krein-096-ritz-vs-rigorous-crossval.js (source cross-validation; all values read off it verbatim)
 * @see imp-96938-krein-drift-calibration-096.js (Ritz floor band origin)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (rigorous lambda_min rungs)
 */

import {
  IMP96958_RITZ_FLOOR_MIN,
  IMP96958_RITZ_FLOOR_MAX,
  IMP96958_RITZ_FLOOR_TCONV,
  IMP96958_RIGOROUS_FLANK_LO,
  IMP96958_RIGOROUS_FLANK_HI,
  IMP96958_RIGOROUS_LAMMIN_INTERP_A048,
  IMP96958_RIGOROUS_LN3_MARGIN,
  IMP96958_MARGIN_RATIO_096_OVER_LN3,
  IMP96958_VERDICT,
} from './imp-96958-krein-096-ritz-vs-rigorous-crossval.js';

// Two range bands, chart-ready (log10 coordinates included for a log-scale range chart --
// the values span nearly a decade, 0.55 to 56).
export const IMP96983_BANDS = Object.freeze([
  Object.freeze({
    label: 'Ritz UPPER estimate (imp-96938)',
    lo: IMP96958_RITZ_FLOOR_MIN, // 12.0088505 (Nbig=240, T=800, most adverse cell)
    hi: IMP96958_RITZ_FLOOR_MAX, // 21.0154900 (Nbig=24, T=800, coarsest)
    mid: IMP96958_RITZ_FLOOR_TCONV, // ~19.1126 (T-converged, Nbig=240, T=3200)
    logLo: Math.log10(IMP96958_RITZ_FLOOR_MIN),
    logHi: Math.log10(IMP96958_RITZ_FLOOR_MAX),
    logMid: Math.log10(IMP96958_RITZ_FLOOR_TCONV),
    isCertified: false,
  }),
  Object.freeze({
    label: 'Rigorous flanking bracket (certificate)',
    lo: IMP96958_RIGOROUS_FLANK_LO, // 7.743 (a=0.50, converged N=36)
    hi: IMP96958_RIGOROUS_FLANK_HI, // 56.05 (a=0.45, converged N=36)
    mid: IMP96958_RIGOROUS_LAMMIN_INTERP_A048, // ~17.09 (log-linear interp at a=0.48)
    logLo: Math.log10(IMP96958_RIGOROUS_FLANK_LO),
    logHi: Math.log10(IMP96958_RIGOROUS_FLANK_HI),
    logMid: Math.log10(IMP96958_RIGOROUS_LAMMIN_INTERP_A048),
    isCertified: true,
  }),
]);

// Binding-endpoint contrast marker (rigorous 2a=(ln3)/2 margin, for scale reference).
export const IMP96983_LN3_MARKER = Object.freeze({
  label: 'Rigorous lambda_min at 2a=(ln3)/2 (binding endpoint)',
  value: IMP96958_RIGOROUS_LN3_MARGIN, // 0.5521
  logValue: Math.log10(IMP96958_RIGOROUS_LN3_MARGIN),
  marginRatioTo096RitzMin: IMP96958_MARGIN_RATIO_096_OVER_LN3, // ~21.8
});

export const IMP96983_VERDICT = Object.freeze({
  ticket: 'imp-96983',
  twoA: 0.96,
  a: 0.48,
  ritzBandInsideRigorousFlank: IMP96958_VERDICT.ritzBandInsideRigorousFlank,
  strictDirectionalBracketConfoundedByNormalisation: IMP96958_VERDICT.strictDirectionalBracketConfoundedByNormalisation,
  ritzIsUpperEstimateNotCertifiedBound: true,
  anyBoundMoved: false,
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: IMP96958_VERDICT.intervalRigorousReachUnchanged, // 0.96
  qed: false,
});
export default IMP96983_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96983_ASSERTIONS = [
  {
    id: 'imp96983-two-bands-read-verbatim-from-imp96958',
    holds: () => IMP96983_BANDS.length === 2
      && Math.abs(IMP96983_BANDS[0].lo - 12.0088505) < 1e-6
      && Math.abs(IMP96983_BANDS[0].hi - 21.0154900) < 1e-6
      && Math.abs(IMP96983_BANDS[1].lo - 7.743) < 1e-6
      && Math.abs(IMP96983_BANDS[1].hi - 56.05) < 1e-6,
    why: 'the Ritz band [12.0089, 21.0155] and the rigorous flanking bracket (7.743, 56.05) are read verbatim from the imported imp-96958 literals.',
  },
  {
    id: 'imp96983-ritz-band-nested-inside-rigorous-flank',
    holds: () => IMP96983_BANDS[0].lo > IMP96983_BANDS[1].lo
      && IMP96983_BANDS[0].hi < IMP96983_BANDS[1].hi,
    why: 'the Ritz band must lie strictly inside the rigorous flanking bracket, reproducing the imp-96958 Finding 2 containment.',
  },
  {
    id: 'imp96983-log-coordinates-monotone-with-linear',
    holds: () => IMP96983_BANDS.every((b) => b.logLo < b.logMid && b.logMid < b.logHi
      && Math.abs(Math.pow(10, b.logLo) - b.lo) < 1e-6
      && Math.abs(Math.pow(10, b.logHi) - b.hi) < 1e-6),
    why: 'each band log10 coordinate must invert back to the linear value and preserve lo < mid < hi ordering for a log-scale range chart.',
  },
  {
    id: 'imp96983-ln3-marker-and-margin-ratio',
    holds: () => Math.abs(IMP96983_LN3_MARKER.value - 0.5521) < 1e-4
      && Math.abs(IMP96983_LN3_MARKER.marginRatioTo096RitzMin - 21.8) < 0.1,
    why: 'the binding 2a=(ln3)/2 margin (0.5521) and its ratio to the 2a=0.96 Ritz floor min (~21.8x) are read verbatim from imp-96958.',
  },
  {
    id: 'imp96983-verdict-no-qed',
    holds: () => IMP96983_VERDICT.ritzBandInsideRigorousFlank === true
      && IMP96983_VERDICT.ritzIsUpperEstimateNotCertifiedBound === true
      && IMP96983_VERDICT.anyBoundMoved === false
      && IMP96983_VERDICT.operatorPositivityProved === false
      && IMP96983_VERDICT.intervalRigorousReachUnchanged === 0.96
      && IMP96983_VERDICT.qed === false,
    why: 'presentation only: no bound moves, no operator positivity is established, the certified reach stays 2a<=0.96, and NO QED.',
  },
];

for (const a of IMP96983_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96983-ritz-vs-rigorous-crossval-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}
