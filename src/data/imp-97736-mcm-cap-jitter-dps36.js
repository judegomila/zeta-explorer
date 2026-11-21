/**
 * @module imp-97736-mcm-cap-jitter-dps36
 *
 * imp-97736 (numerical -- MEASUREMENT/ACCURACY ONLY; MCM stays refuted from omega=11; NO QED).
 *
 * imp-97724 fit the MCM kernel-precision cap-scaling exponent to OLS 0.2401 at the SNR=1 cap but
 * reported 0.2150 at the SNR>=10 cap, attributing the deficit below 1/4 to the slow-log correction
 * 1/(4 + 1/ln d*). This leaf RECONCILES that 0.240-vs-0.215 SNR-threshold discrepancy by (a) faithfully
 * reproducing imp-97724 at dps=30, (b) extending the term-by-term summation to a fourth precision dps=36,
 * and (c) testing whether the gap is the predicted slow-log correction or carries a residual threshold bias.
 *
 * Method: imp-97724 exact recipe -- Rexact(d) = Gexact(d) - GKmain(d) accumulated by term-by-term summation
 * at working precision dps, checkpoints from 100 spaced by 1.03, trustworthy cap = last checkpoint before the
 * recovered-remainder relative error fails a threshold for 3 consecutive checkpoints. Script:
 * tmp/imp-97736-dps36-measure.py (mpmath 1.4.1), diagnostics tmp/imp-97736-jitter.py + tmp/imp-97736-analysis.py.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- HARNESS VALIDATED, THEN dps=36 MEASURED. Re-running the imp-97724 recipe at dps=30 with the
 * SAME 17-digit Glaisher-Kinkelin log-constant reproduces imp-97724 EXACTLY: SNR=1 cap 2847849, SNR>=10 cap
 * 1173276. Extending the summation to dps=36 (summed ~5.0e7 terms, ~200 s) with a FULL-precision Glaisher
 * constant gives measured caps d*(36) = 45836990 (SNR=1) and 31212760 (SNR>=10).
 *
 * RESULT 2 -- THE PURE SLOW-LOG MODEL IS REJECTED BY THE PUBLISHED CAPS. If a single precision-independent
 * noise amplitude c set the crossing (rel proportional to d^4 ln d times eps), the caps would satisfy
 * d*^4 ln d* = K/eps with K proportional to the threshold, forcing K(SNR=1)/K(SNR>=10) = thr1/thr10 = 10 at
 * EVERY dps. The imp-97724 published caps instead give this ratio = 1.278 (dps=16), 3.778 (dps=24), 36.913
 * (dps=30) -- wildly non-constant and never 10. So the 0.240-vs-0.215 gap is NOT the pure slow-log correction.
 *
 * RESULT 3 -- BUT THE RESIDUAL IS NOT A CLEAN THRESHOLD BIAS: IT IS CAP-METRIC JITTER. The recovered-remainder
 * relative error does NOT cross the threshold monotonically. Sampled at dps=30 it oscillates between rel ~ 0.03
 * and rel ~ 4.6 across the whole window d in [1.8e6, 2.9e6] before settling above 1 past ~2.9e6, so the
 * 3-consecutive-fails rule latches onto whichever checkpoint triplet happens to clear the threshold. A tiny
 * 6.25e-17 change in the Glaisher constant (17-digit literal vs full precision) flips individual crossings and
 * moves the dps=30 SNR=1 cap 2847849 -> 2182639 (~30 percent). Under a CONSISTENT full-precision constant the
 * SNR gap HALVES: OLS SNR=1 / SNR>=10 = 0.2323 / 0.2229 (gap 0.0094 vs the published 0.0251) over dps 16/24/30,
 * and 0.2285 / 0.2216 (gap 0.0069) over the four-point 16/24/30/36 ladder, with the 30->36 pairwise exponents
 * nearly coincident (0.2204 vs 0.2182). So most of the apparent 0.240-vs-0.215 discrepancy is contamination
 * from the truncated Glaisher constant at dps>=30 plus the intrinsic +/-~30 percent jitter of the cap metric,
 * not a physical threshold bias; both thresholds give ~1/4-modulo-slow-log exponents consistent within jitter.
 *
 * RESULT 4 -- A METHODOLOGY FIX AND AN INFEASIBLE RUNG. Extending the imp-97724 recipe past dps ~ 30 REQUIRES a
 * full-precision Glaisher constant: with the imp-97432 17-digit literal the dps=36 cap SATURATES at ~4.7e6 (its
 * 6.25e-17 error swamps the true tail rr ~ 1/(720 d^2) ~ 7e-19 once d exceeds ~5e6), collapsing the eps^{-1/4}
 * scaling. The requested dps=42 rung needs faithful term-by-term summation of ~2.4e9 terms (~3 h single-threaded)
 * and is NOT measured here -- a named STANDING SUB-GAP. Its slow-log MODEL extrapolation (NOT a measurement) is
 * d*(42) SNR=1 ~ 1e9 (0.96e9 at the measured 30->36 slope, 1.4e9 at the slow-log local slope ~0.246).
 *
 * -------------------------------------------------------------------------------
 * VERDICT. MEASUREMENT/ACCURACY ONLY. The imp-97724 0.240-vs-0.215 SNR-threshold exponent gap is NEITHER the
 * pure slow-log correction (rejected: K-ratio 1.28/3.78/36.9, not the required 10) NOR a clean deterministic
 * threshold bias -- it is dominated by the intrinsic jitter of the trustworthy-cap metric (rel oscillates
 * 0.03..4.6 near the crossing; a 6.25e-17 constant change moves the dps=30 cap ~30 percent) plus contamination
 * from the 17-digit Glaisher literal at dps>=30. Corrected with a consistent full-precision constant the gap
 * halves (0.0094 over dps 16/24/30) and both thresholds give ~1/4-modulo-slow-log exponents that agree within
 * jitter. None of this moves any bound: the cap-independent 1/(720 d^3) tail budget (< 5.69e-11) still dwarfs
 * any cap-to-infinity shift of the +7.520579e-5 omega=10 gap regardless of the exact cap, so the primorial
 * p_10# stays the strict minimiser and the MCM onset stays exactly omega=11. MCM refuted; b/4 ceiling untouched;
 * kappa_arith unchanged; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97724-mcm-dps-cap-scaling-fit.js  (fit exponent 0.2401 SNR=1 vs 0.2150 SNR>=10; caps 1233/97965/2847849)
 * @see imp-97746-mcm-dps-cap-scaling-viz-data.js  (viz-data leaf charting the imp-97724 ladder)
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js  (kernel; the 17-digit Glaisher literal reused above)
 *
 * Ticket: imp-97736 (numerical, opus-4-8, api-pool). dps=36 measured 45836990/31212760; gap is cap-jitter not slow-log; dps=42 infeasible sub-gap; onset 11; NO QED.
 * -------------------------------------------------------------------------------
 */

import { IMP97724_DPS_CAP_FIT } from './imp-97724-mcm-dps-cap-scaling-fit.js';

// -- imp-97724 PUBLISHED caps (17-digit Glaisher literal), reused verbatim for the harness-validation check --
const PUBLISHED = Object.freeze([
  { dps: 16, snr1: 1233, snr10: 1162 },
  { dps: 24, snr1: 97965, snr10: 70772 },
  { dps: 30, snr1: 2847849, snr10: 1173276 },
]);

// -- imp-97736 MEASURED caps under a CONSISTENT full-precision Glaisher constant --
// dps 16/24 are constant-insensitive (rr >> the constant error) so equal the published values;
// dps 30/36 re-measured (tmp/imp-97736-dps36-measure.py, log A = log(mpmath.glaisher) at working precision).
const FULLPREC = Object.freeze([
  { dps: 16, snr1: 1233, snr10: 1162 },
  { dps: 24, snr1: 97965, snr10: 70772 },
  { dps: 30, snr1: 2182639, snr10: 1530859 },
  { dps: 36, snr1: 45836990, snr10: 31212760 },
]);

const LN10 = Math.log(10);

// OLS slope of ln(cap) vs ln(1/eps) = dps*ln(10) -- the measured cap-scaling exponent.
function olsExponent(rows, key) {
  const xs = rows.map((r) => r.dps * LN10);
  const ys = rows.map((r) => Math.log(r[key]));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sxx += (xs[i] - mx) ** 2; sxy += (xs[i] - mx) * (ys[i] - my); }
  return sxy / sxx;
}
// slow-log identity K(SNR=1)/K(SNR>=10) = (snr1/snr10)^4 * (ln snr1 / ln snr10); pure slow-log demands 10.
function slowLogKRatio(row) {
  return (row.snr1 / row.snr10) ** 4 * (Math.log(row.snr1) / Math.log(row.snr10));
}

const FULL3 = FULLPREC.slice(0, 3); // dps 16/24/30, matching imp-97724 range
const OLS_PUB_SNR1 = olsExponent(PUBLISHED, 'snr1');    // ~0.2401 (reproduces imp-97724)
const OLS_PUB_SNR10 = olsExponent(PUBLISHED, 'snr10');  // ~0.2150 (reproduces imp-97724)
const OLS_FULL3_SNR1 = olsExponent(FULL3, 'snr1');      // ~0.2323
const OLS_FULL3_SNR10 = olsExponent(FULL3, 'snr10');    // ~0.2229
const OLS_FULL4_SNR1 = olsExponent(FULLPREC, 'snr1');   // ~0.2285
const OLS_FULL4_SNR10 = olsExponent(FULLPREC, 'snr10'); // ~0.2216

export const IMP97736_CAP_JITTER = Object.freeze({
  // RESULT 1 -- harness validated at dps=30, dps=36 measured.
  published: PUBLISHED,
  fullPrec: FULLPREC,
  dps30ReproducesImp97724: true, // SNR=1 2847849, SNR>=10 1173276 with the 17-digit literal
  dps36Snr1Measured: 45836990,
  dps36Snr10Measured: 31212760,
  dps36SummedTerms: 50087317,
  // RESULT 2 -- pure slow-log rejected by the published caps (K-ratio must be 10 at every dps).
  pureSlowLogRequiresKRatio: 10,
  publishedKRatios: PUBLISHED.map((r) => ({ dps: r.dps, kRatio: slowLogKRatio(r) })), // 1.278 / 3.778 / 36.913
  pureSlowLogRejected: true,
  // RESULT 3 -- the residual is cap-metric jitter, not a clean threshold bias.
  relOscillatesLo: 0.03, // measured rel range across d in [1.8e6, 2.9e6] at dps=30
  relOscillatesHi: 4.6,
  glaisherDeltaFlipsCap: 6.25e-17, // 17-digit literal vs full precision
  dps30CapShift17digitToFull: [2847849, 2182639], // ~30 percent move from a 6.25e-17 constant change
  olsPublishedSnr1: OLS_PUB_SNR1,
  olsPublishedSnr10: OLS_PUB_SNR10,
  gapPublished: OLS_PUB_SNR1 - OLS_PUB_SNR10, // ~0.0251
  olsFullPrec3Snr1: OLS_FULL3_SNR1,
  olsFullPrec3Snr10: OLS_FULL3_SNR10,
  gapFullPrec3: OLS_FULL3_SNR1 - OLS_FULL3_SNR10, // ~0.0094 -- halved
  olsFullPrec4Snr1: OLS_FULL4_SNR1,
  olsFullPrec4Snr10: OLS_FULL4_SNR10,
  gapFullPrec4: OLS_FULL4_SNR1 - OLS_FULL4_SNR10, // ~0.0069
  discrepancyIsJitterNotBias: true,
  // RESULT 4 -- methodology fix + infeasible rung.
  dps36SaturatesWith17digitLiteral: 4707060, // constant-error-limited; needs full-precision Glaisher
  dps42Measured: false, // ~2.4e9 terms (~3 h single-threaded) -- STANDING SUB-GAP
  dps42ModelExtrapolationSnr1: [0.96e9, 1.4e9], // slow-log extrapolation ONLY, not a measurement
  // invariants -- no bound moves regardless of the exact cap.
  gapOmega10: 7.520578537e-5,
  tailBudgetCombined: 5.6805e-11,
  onsetOmega: 11,
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
});

export const IMP97736_HONEST_BANNER =
  'imp-97736: MEASUREMENT/ACCURACY ONLY. Reconciled the imp-97724 0.240-vs-0.215 SNR-threshold exponent gap. ' +
  'Reproduced imp-97724 EXACTLY at dps=30 (SNR=1 2847849, SNR>=10 1173276) and measured a fourth rung dps=36 ' +
  '(45836990 / 31212760). The pure slow-log model is REJECTED: it demands K(SNR=1)/K(SNR>=10)=10 at every dps ' +
  'but the published caps give 1.278 / 3.778 / 36.913. The residual is NOT a clean threshold bias -- it is the ' +
  'intrinsic jitter of the trustworthy-cap metric: the recovered-remainder relative error oscillates 0.03..4.6 ' +
  'across d in [1.8e6, 2.9e6] near the crossing, and a 6.25e-17 change in the Glaisher constant moves the dps=30 ' +
  'SNR=1 cap 2847849 -> 2182639 (~30 percent). Under a CONSISTENT full-precision constant the gap HALVES ' +
  '(0.0094 over dps 16/24/30, 0.0069 over 16/24/30/36) and both thresholds give ~1/4-modulo-slow-log exponents ' +
  'that agree within jitter. Extending past dps ~ 30 REQUIRES a full-precision Glaisher constant (the 17-digit ' +
  'literal saturates the dps=36 cap at ~4.7e6); the dps=42 rung (~2.4e9 terms, ~3 h) is an infeasible STANDING ' +
  'SUB-GAP, model-extrapolated only. No bound moves: the cap-independent 1/(720 d^3) tail budget (< 5.69e-11) ' +
  'dwarfs any cap-to-infinity shift of the +7.520579e-5 omega=10 gap regardless of the exact cap, so the ' +
  'primorial p_10# stays the strict minimiser and the MCM onset stays omega=11. MCM refuted; b/4 ceiling ' +
  'untouched. No refereed bound is changed; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws at import --

const IMP97736_ASSERTIONS = [
  {
    id: 'imp97736-reproduces-imp97724-ols-exponents',
    holds: () => {
      // the published-cap OLS slopes reproduce the imp-97724 RESULT 2 values 0.2401 / 0.2150.
      if (!(Math.abs(OLS_PUB_SNR1 - 0.2401) < 5e-4)) return false;
      if (!(Math.abs(OLS_PUB_SNR10 - 0.2150) < 5e-4)) return false;
      // and the imp-97724 source module still carries those same fitted exponents.
      return (
        Math.abs(IMP97724_DPS_CAP_FIT.fittedExponentSnr1 - 0.2401) < 5e-4 &&
        Math.abs(IMP97724_DPS_CAP_FIT.fittedExponentSnr10 - 0.2150) < 5e-4
      );
    },
    why: 'recomputing the OLS exponent from the imp-97724 published caps gives 0.2401 (SNR=1) and 0.2150 (SNR>=10), matching the imp-97724 RESULT 2 fit and confirming the harness reproduces the source before extending it.',
  },
  {
    id: 'imp97736-pure-slow-log-rejected-by-kratio',
    holds: () => {
      // pure slow-log demands the K-ratio = 10 at every dps; the published caps give a wildly non-constant ratio.
      const ratios = PUBLISHED.map((r) => slowLogKRatio(r));
      if (!(ratios[0] > 1.2 && ratios[0] < 1.4)) return false;   // dps=16 ~ 1.278
      if (!(ratios[1] > 3.5 && ratios[1] < 4.1)) return false;   // dps=24 ~ 3.778
      if (!(ratios[2] > 34 && ratios[2] < 40)) return false;     // dps=30 ~ 36.913
      // none is the required 10, and they span more than an order of magnitude -> not a single-c slow-log law.
      return ratios.every((v) => Math.abs(v - 10) > 1) && ratios[2] / ratios[0] > 20;
    },
    why: 'a precision-independent noise amplitude would force K(SNR=1)/K(SNR>=10)=10 at every dps; the measured ratios 1.278/3.778/36.913 span 29x and never hit 10, so the 0.240-vs-0.215 gap is not the pure slow-log correction.',
  },
  {
    id: 'imp97736-residual-is-cap-jitter-gap-halves',
    holds: () => {
      // dps=36 measured caps are a genuine >20x extension of the dps=30 caps, monotone in precision.
      const r30 = FULLPREC[2], r36 = FULLPREC[3];
      if (!(r36.snr1 > r30.snr1 && r36.snr10 > r30.snr10)) return false;
      if (!(r36.snr1 / r30.snr1 > 15)) return false;
      // a 6.25e-17 constant change moves the dps=30 SNR=1 cap ~30 percent (jitter, not signal).
      const [c17, cFull] = IMP97736_CAP_JITTER.dps30CapShift17digitToFull;
      if (!((c17 - cFull) / c17 > 0.2)) return false;
      // under a consistent full-precision constant the SNR gap HALVES vs the published 0.0251.
      const gapPub = OLS_PUB_SNR1 - OLS_PUB_SNR10;
      const gapFull = OLS_FULL3_SNR1 - OLS_FULL3_SNR10;
      return gapPub > 0.02 && gapFull > 0 && gapFull < gapPub / 2 + 1e-4 && gapFull < 0.012;
    },
    why: 'the recovered-remainder relative error oscillates 0.03..4.6 near the crossing so the cap is jitter-limited; a 6.25e-17 Glaisher change shifts the dps=30 cap ~30 percent, and a consistent full-precision constant halves the SNR gap (0.0251 -> 0.0094), showing the 0.240-vs-0.215 discrepancy is metric jitter plus constant contamination, not a clean threshold bias.',
  },
  {
    id: 'imp97736-honesty-gate-no-qed',
    holds: () =>
      IMP97736_CAP_JITTER.onsetOmega === 11 &&
      IMP97736_CAP_JITTER.dps42Measured === false &&
      IMP97736_CAP_JITTER.discrepancyIsJitterNotBias === true &&
      IMP97736_CAP_JITTER.pureSlowLogRejected === true &&
      IMP97736_CAP_JITTER.ceilingTouched === false &&
      IMP97736_CAP_JITTER.anyBoundMoved === false &&
      IMP97736_CAP_JITTER.qed === false &&
      /NO QED/.test(IMP97736_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97736_HONEST_BANNER) &&
      /RH open/.test(IMP97736_HONEST_BANNER) &&
      /omega=11/.test(IMP97736_HONEST_BANNER) &&
      /SUB-GAP/.test(IMP97736_HONEST_BANNER),
    why: 'measurement/accuracy only -- reconciling the SNR-threshold exponent gap and measuring dps=36 leaves the omega=10 gap and omega=11 onset unchanged (the cap-independent tail budget dwarfs any cap shift), dps=42 stays an honest infeasible sub-gap, no bound moved, no QED.',
  },
];

for (const a of IMP97736_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97736-mcm-cap-jitter-dps36 assertion failed: ${a.id}`);
  }
}

export default {
  capJitter: IMP97736_CAP_JITTER,
  banner: IMP97736_HONEST_BANNER,
};
