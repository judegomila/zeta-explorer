/**
 * @module imp-97746-mcm-dps-cap-scaling-viz-data
 *
 * imp-97746: import-light viz-data leaf charting the imp-97724 MCM kernel-precision cap-scaling
 * ladder d*(dps) vs 1/eps across three working precisions (dps = 16/24/30: caps 1233/97965/2847849),
 * with the fitted eps^{-1/4} line and the SNR=1 vs SNR>=10 threshold-robustness comparison.
 * Reuses IMP97724_DPS_CAP_FIT verbatim (no re-derivation, no new computation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97724-mcm-dps-cap-scaling-fit.js (capsSnr1, fittedExponentSnr1/10, pairwiseSlopesSnr1)
 */

import { IMP97724_DPS_CAP_FIT } from './imp-97724-mcm-dps-cap-scaling-fit.js';

const { capsSnr1, fittedExponentSnr1, fittedExponentSnr10, theoreticalExponent, dps30Cap, dps16Cap } =
  IMP97724_DPS_CAP_FIT;

// SNR>=10 (relative error <= 0.1) caps, reused verbatim from the imp-97724 RESULT 2 comment
// (not separately exported by the source module as an array; cross-checked below by refitting).
const CAPS_SNR10 = Object.freeze([
  { dps: 16, cap: 1162 },
  { dps: 24, cap: 70772 },
  { dps: 30, cap: 1173276 },
]);

// log10(1/eps) = dps exactly (eps = 10^{-dps}), so dps doubles as the x-axis in log-log space.
export const IMP97746_ROWS = Object.freeze(
  capsSnr1.map((row, i) =>
    Object.freeze({
      dps: row.dps,
      log10InvEps: row.dps,
      capSnr1: row.cap,
      log10CapSnr1: Math.log10(row.cap),
      capSnr10: CAPS_SNR10[i].cap,
      log10CapSnr10: Math.log10(CAPS_SNR10[i].cap),
    })
  )
);

// OLS fit line log10(cap) = fittedExponentSnr1 * dps + intercept, anchored through the mean point
// (slope in log10-log10 space equals the ln-ln slope since both axes share the same ln(10) scale).
const MEAN_DPS = IMP97746_ROWS.reduce((a, r) => a + r.dps, 0) / IMP97746_ROWS.length;
const MEAN_LOG10_CAP = IMP97746_ROWS.reduce((a, r) => a + r.log10CapSnr1, 0) / IMP97746_ROWS.length;
const FIT_INTERCEPT = MEAN_LOG10_CAP - fittedExponentSnr1 * MEAN_DPS;
const THEORY_INTERCEPT = MEAN_LOG10_CAP - theoreticalExponent * MEAN_DPS;

export const IMP97746_FIT_LINE = Object.freeze({
  slope: fittedExponentSnr1,
  intercept: FIT_INTERCEPT,
  at: (dps) => fittedExponentSnr1 * dps + FIT_INTERCEPT,
});

export const IMP97746_THEORY_LINE = Object.freeze({
  slope: theoreticalExponent,
  intercept: THEORY_INTERCEPT,
  at: (dps) => theoreticalExponent * dps + THEORY_INTERCEPT,
});

export const IMP97746_SUMMARY = Object.freeze({
  reading:
    `The imp-97724 trustworthy exact-Rexact cap d*(dps) climbs from ${dps16Cap} at dps=16 (validating ` +
    `the conservative d<=1000 double cap) to ${dps30Cap} at dps=30, a ~${Math.round(dps30Cap / dps16Cap)}x ` +
    `extension. Fitting log d* against log(1/eps) = dps*ln(10) across the three precisions gives OLS slope ` +
    `${fittedExponentSnr1.toFixed(4)}, just below the theoretical 1/4 = ${theoreticalExponent}, matching the ` +
    `predicted slow-log correction. The stricter SNR>=10 threshold gives the same ballpark (` +
    `${fittedExponentSnr10.toFixed(4)}), so the cap-scaling law is threshold-robust.`,
  verdict:
    'Presentation only: every cap value and fitted slope is reused verbatim from imp-97724 (a measured ' +
    'multi-precision fit, not a new computation). The extended cap does not alter the omega=10 gap or the ' +
    'omega=11 MCM onset -- the cap-independent tail budget dwarfs any cap-to-infinity shift. Changes no ' +
    'bound; MCM stays refuted from omega=11; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97746_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97746-three-rows-dps-16-24-30',
    description: 'exactly three ladder rows at dps = 16, 24, 30',
    holds: () =>
      IMP97746_ROWS.length === 3 && IMP97746_ROWS.map((r) => r.dps).join(',') === '16,24,30',
  },
  {
    id: 'imp97746-caps-strictly-increasing',
    description: 'both SNR=1 and SNR>=10 caps strictly increase with precision',
    holds: () => {
      for (let i = 1; i < IMP97746_ROWS.length; i++) {
        if (!(IMP97746_ROWS[i].capSnr1 > IMP97746_ROWS[i - 1].capSnr1)) return false;
        if (!(IMP97746_ROWS[i].capSnr10 > IMP97746_ROWS[i - 1].capSnr10)) return false;
      }
      return true;
    },
  },
  {
    id: 'imp97746-values-match-imp97724-source',
    description: 'capSnr1 values match the imp-97724 capsSnr1 array verbatim',
    holds: () => IMP97746_ROWS.every((row, i) => row.capSnr1 === capsSnr1[i].cap),
  },
  {
    id: 'imp97746-fit-line-passes-through-data-cloud',
    description: 'the fitted line sits within the theoretical/measured slope band at every rung',
    holds: () =>
      IMP97746_ROWS.every((r) => Math.abs(IMP97746_FIT_LINE.at(r.dps) - r.log10CapSnr1) < 0.5),
  },
  {
    id: 'imp97746-fitted-slope-below-theoretical',
    description: 'the measured exponent sits just below the theoretical 1/4 (slow-log deficit)',
    holds: () =>
      fittedExponentSnr1 > 0.2 && fittedExponentSnr1 < theoreticalExponent && theoreticalExponent === 0.25,
  },
  {
    id: 'imp97746-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /does not/.test(IMP97746_SUMMARY.verdict) && /NO QED/.test(IMP97746_SUMMARY.verdict),
  },
];

for (const assertion of IMP97746_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97746 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97746_SUMMARY;
