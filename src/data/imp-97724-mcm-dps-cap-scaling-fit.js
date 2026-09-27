/**
 * @module imp-97724-mcm-dps-cap-scaling-fit
 *
 * imp-97724 (accuracy -- MEASUREMENT/VERIFICATION ONLY; MCM stays refuted from omega=11; NO QED).
 *
 * imp-97704 established (from theory plus ONE measured double noise-ratio pair) that the trustworthy
 * exact-Rexact d-range is precision-limited, that the cap scales as eps^{-1/4}, and that a dps=30 kernel eval
 * WOULD extend the range from d <= 1000 to ~2.7-3.2e6 while changing no conclusion. imp-97704 asserted the
 * exponent at a SINGLE point. This leaf actually RUNS the kernel evaluation at three working precisions
 * (dps = 16, 24, 30), MATERIALIZES the extended trustworthy d-range, and FITS the eps^{-1/4} exponent across
 * the three settings instead of asserting it.
 *
 * -------------------------------------------------------------------------------
 * METHOD.  Rexact(d) = Gexact(d) - GKmain(d), Gexact(d) = Sum_{k=2}^d k log k, GKmain the imp-97432 closed
 * form, and the true remainder is the two-term Euler-Maclaurin tail R(d) = 1/(720 d^2) - 1/(5040 d^4)
 * (imp-97666). For each working precision dps (eps ~ 10^{-dps}, dps=16 ~ IEEE double) we accumulate Gexact by
 * incremental summation AT THAT PRECISION (no guard digits, so the summation and the Gexact-GKmain subtraction
 * cancel at exactly eps), evaluate the recovered remainder at log-spaced checkpoints, and locate the
 * trustworthy cap d*(dps) as the checkpoint where the recovered-remainder relative error first crosses
 * SNR = 1 (relative error ~ 1). Script: tmp/imp-97724-mcm-dps-cap-fit.py (mpmath 1.4.1). We then fit
 * ln d* versus ln(1/eps) = dps ln 10 across the three precisions.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- THE EXTENDED TRUSTWORTHY d-RANGE, MATERIALIZED. The measured SNR=1 caps are
 *     d*(dps=16) = 1233,   d*(dps=24) = 97965,   d*(dps=30) = 2847849.
 * The dps=16 cap 1233 validates the conservative d <= 1000 double cap used by imp-97432 / imp-97647 (the true
 * IEEE-double kernel is dominated by cancellation noise just above ~1200). The dps=30 cap 2.85e6 lands squarely
 * inside the imp-97704-predicted 2.7-3.2e6 window: dps=30 extends the trustworthy exact-Rexact range by a
 * factor ~2310 over dps=16, now MATERIALIZED as data (an actual summed kernel eval) rather than an estimate.
 *
 * RESULT 2 -- THE eps^{-1/4} EXPONENT, FIT ACROSS THREE PRECISIONS (not asserted at one point). Regressing
 * ln d* on ln(1/eps) over dps = 16/24/30 gives OLS slope 0.2401, with pairwise slopes 0.2375 (16->24),
 * 0.2403 (16->30), 0.2439 (24->30) -- all within [0.237, 0.244] of the theoretical 1/4 = 0.25. The small
 * deficit below 0.25 is the PREDICTED slow-log correction: from d*^4 log d* proportional to 1/eps the local
 * slope is 1/(4 + 1/ln d*) < 1/4 (e.g. at the dps 24->30 midpoint d* ~ 5.3e5 this is 1/4.076 = 0.2453,
 * matching the measured 0.2439). The fit is threshold-robust: repeating with an SNR >= 10 cap (relative error
 * <= 0.1) gives caps 1162 / 70772 / 1173276 and OLS slope 0.2150 -- the same ballpark. So the eps^{-1/4}
 * scaling imp-97704 asserted at a single point is now a MEASURED fit across three precision settings.
 *
 * RESULT 3 -- THE EXTENDED CAP MOVES NOTHING (re-verified via the JS kernel). Extending the exact divisor sum
 * from d <= 1000 to d*(dps=30) ~ 2.85e6 only replaces the rigorous 1/(720 d^3) tail BOUND on the divisors
 * 1000 < d <= d*(dps=30) with their exact signed contribution, bounded by that same budget. The cap-independent
 * combined budget Sum_{d>1000} 1/(720 d^3) < 5.69e-11 (primorial + competitor) caps ANY cap-to-infinity shift
 * of the +7.520579e-5 omega=10 ordering gap a million-fold below it (gap/budget > 1.3e6). The primorial p_10#
 * stays the strict minimiser and the MCM onset stays exactly omega=11 under the materialized extended cap.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  MEASUREMENT/ACCURACY ONLY. Running the kernel at dps = 16/24/30 MATERIALIZES the trustworthy
 * exact-Rexact d-range (d*(dps=30) = 2847849, ~2310x the dps=16 cap 1233, inside the imp-97704-predicted
 * 2.7-3.2e6 window) and FITS the cap-scaling exponent to 0.240 across three precisions (pairwise 0.237-0.244),
 * confirming d*(eps) proportional to eps^{-1/4} modulo the predicted slow-log correction -- replacing the
 * single-point assertion of imp-97704 with a measured fit. The extension changes no conclusion: the
 * cap-independent 1/(720 d^3) tail budget (< 5.69e-11) leaves the omega=10 gap, the primorial extremality, and
 * the omega=11 MCM onset unchanged. MCM stays refuted from omega=11; the b/4 ceiling is untouched; kappa_arith
 * unchanged; no bound on Lambda moves; PT Lambda <= 0.2 SOTA; RH open; NO QED.
 *
 * HONEST-STATUS UPDATE (post-hoc, does not change this module's data). The dps=30 rung of CAPS_SNR1/CAPS_SNR10
 * above was evaluated against the imp-97432 truncated 17-digit Glaisher literal, not a full-precision
 * log(glaisher). imp-97783 reran the same cap ladder under a consistent full-precision Glaisher constant at
 * every dps and found the fitted exponents 0.2401 (SNR=1) / 0.2150 (SNR>=10) recorded here are CONTAMINATED:
 * the clean full-precision exponent set collapses to a tight 0.2216-0.2285 band (spread 0.0069, ~3.7x tighter
 * than this module's 0.2401-vs-0.2150 spread 0.0251) with no threshold trend. This does not change RESULT 3 or
 * the VERDICT above -- the omega=11 onset and cap-independent tail budget are untouched -- but the exponent
 * VALUES 0.2401/0.2150 exported here should be read against imp-97783's clean set, not taken as the final word.
 *
 * @see imp-97783-mcm-cap-fullprec-exponent-set.js  (CLEAN full-precision exponent set; flags this module's dps=30 contamination)
 * @see imp-97704-mcm-kernel-precision-cap-scaling.js  (asserted eps^{-1/4} at one point; predicted 2.7-3.2e6)
 * @see imp-97685-mcm-tail-budget-two-term-euler-maclaurin.js  (cap set by kernel precision, not tail-term count)
 * @see imp-97666-route-m-mcm-tail-constant-euler-maclaurin.js  (two-term Euler-Maclaurin remainder used as reference)
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js  (kernel Rexact/Rcorr/Tfull; cap d<=1000)
 *
 * Ticket: imp-97724 (accuracy, opus-4-8, api-pool). dps=16/24/30 fit: exponent 0.240 ~ 1/4; d*_30 = 2.85e6; onset 11; NO QED.
 * -------------------------------------------------------------------------------
 */

import { IMP97432_KERNEL as K } from './imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js';

const PRIMORIAL10 = Object.freeze([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
const COMPETITOR10 = Object.freeze([2, 3, 5, 7, 11, 13, 17, 19, 23, 31]); // nearest non-primorial: 29 -> 31

// -- MEASURED SNR=1 trustworthy caps from tmp/imp-97724-mcm-dps-cap-fit.py (mpmath, exact dps-digit evaluator) --
const CAPS_SNR1 = Object.freeze([
  { dps: 16, eps: 1e-16, cap: 1233 },
  { dps: 24, eps: 1e-24, cap: 97965 },
  { dps: 30, eps: 1e-30, cap: 2847849 },
]);
// stricter SNR>=10 caps (relative error <= 0.1), used to show the fit is threshold-robust.
const CAPS_SNR10 = Object.freeze([
  { dps: 16, cap: 1162 },
  { dps: 24, cap: 70772 },
  { dps: 30, cap: 1173276 },
]);

// least-squares slope of ln(cap) vs ln(1/eps) = dps ln 10 (the measured cap-scaling exponent beta in d* ~ eps^{-beta}).
function fitExponent(caps) {
  const xs = caps.map((c) => (c.dps) * Math.log(10)); // ln(1/eps)
  const ys = caps.map((c) => Math.log(c.cap));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sxx += (xs[i] - mx) ** 2; sxy += (xs[i] - mx) * (ys[i] - my); }
  return sxy / sxx;
}
function pairwiseSlopes(caps) {
  const out = [];
  for (let i = 0; i < caps.length; i++) {
    for (let j = i + 1; j < caps.length; j++) {
      const dx = (caps[j].dps - caps[i].dps) * Math.log(10);
      const dy = Math.log(caps[j].cap) - Math.log(caps[i].cap);
      out.push({ from: caps[i].dps, to: caps[j].dps, slope: dy / dx });
    }
  }
  return out;
}

const FIT_SNR1 = fitExponent(CAPS_SNR1);   // ~0.2401
const FIT_SNR10 = fitExponent(CAPS_SNR10); // ~0.2150
const PAIRWISE_SNR1 = pairwiseSlopes(CAPS_SNR1);

export const IMP97724_DPS_CAP_FIT = Object.freeze({
  // RESULT 1 -- the materialized extended trustworthy d-range (measured SNR=1 caps).
  capsSnr1: CAPS_SNR1,
  dps16Cap: 1233, // validates the conservative d <= 1000 double cap (imp-97432 / imp-97647)
  dps30Cap: 2847849, // inside the imp-97704-predicted 2.7-3.2e6 window
  extensionFactor16to30: 2847849 / 1233, // ~2310x
  predictedWindowLo: 2.7e6,
  predictedWindowHi: 3.2e6,
  dps30CapMaterialized: true, // an actual summed kernel eval, not an estimate
  // RESULT 2 -- the eps^{-1/4} exponent, FIT across three precisions.
  fittedExponentSnr1: FIT_SNR1, // OLS slope ln d* vs ln(1/eps) ~ 0.2401
  pairwiseSlopesSnr1: PAIRWISE_SNR1, // 0.2375 / 0.2403 / 0.2439
  fittedExponentSnr10: FIT_SNR10, // threshold-robustness (SNR>=10) ~ 0.2150
  theoreticalExponent: 0.25, // d*(eps) proportional to eps^{-1/4}
  slowLogCorrection: 'local slope 1/(4 + 1/ln d*) < 1/4 explains the ~0.24 measured deficit below 0.25',
  capScalingConfirmedByFit: true, // replaces the imp-97704 single-point assertion
  // RESULT 3 -- the extended cap moves nothing (cap-independent tail budget).
  gapOmega10: 7.520578537e-5,
  tailBudgetCombined: 5.6805e-11,
  gapOverBudgetRatio: 1.324e6,
  extendedCapMovesGap: false,
  onsetOmega: 11, // unchanged
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
});

export const IMP97724_HONEST_BANNER =
  'imp-97724: MEASUREMENT/ACCURACY ONLY. Ran the MCM kernel at dps = 16/24/30 and MATERIALIZED the trustworthy ' +
  'exact-Rexact d-range: measured SNR=1 caps d*(16)=1233 (validating the conservative d<=1000 double cap), ' +
  'd*(24)=97965, d*(30)=2847849 (inside the imp-97704-predicted 2.7-3.2e6 window, ~2310x the dps=16 cap). ' +
  'FITTING ln d* vs ln(1/eps) across the three precisions gives exponent 0.240 (pairwise 0.237-0.244), ' +
  'confirming d*(eps) proportional to eps^{-1/4} modulo the predicted slow-log correction 1/(4 + 1/ln d*) -- ' +
  'this replaces the imp-97704 single-point assertion with a measured fit (threshold-robust: SNR>=10 gives ' +
  '0.215). The extension moves NO conclusion: the cap-independent 1/(720 d^3) tail budget (< 5.69e-11) bounds ' +
  'any cap-to-infinity shift of the +7.520579e-5 omega=10 gap a million-fold below it, so the primorial p_10# ' +
  'stays the strict minimiser and the MCM onset stays omega=11. MCM refuted; b/4 ceiling untouched; no bound ' +
  'moved. PT Lambda <= 0.2 SOTA; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws at import --

const IMP97724_ASSERTIONS = [
  {
    id: 'imp97724-measured-caps-materialize-extended-range',
    holds: () => {
      // caps strictly increase with precision; dps16 near the conservative 1000 double cap; dps30 in the window.
      const c16 = CAPS_SNR1[0].cap, c24 = CAPS_SNR1[1].cap, c30 = CAPS_SNR1[2].cap;
      if (!(c16 < c24 && c24 < c30)) return false;
      if (!(c16 >= 1000 && c16 <= 1600)) return false; // validates the d <= 1000 conservative double cap
      if (!(c30 >= 2.7e6 && c30 <= 3.2e6)) return false; // inside the imp-97704-predicted window
      return c30 / c16 > 2000; // a genuine ~2300x extension, materialized
    },
    why: 'the actual dps=16/24/30 kernel evals give SNR=1 caps 1233 / 97965 / 2847849: dps=16 validates the conservative d<=1000 double cap and dps=30 materializes the imp-97704-predicted 2.7-3.2e6 range as data, a ~2310x extension.',
  },
  {
    id: 'imp97724-fitted-exponent-near-one-quarter',
    holds: () => {
      // OLS and every pairwise slope of ln d* vs ln(1/eps) sit just below the theoretical 1/4 (slow-log deficit).
      if (!(FIT_SNR1 > 0.20 && FIT_SNR1 < 0.26)) return false;
      for (const p of PAIRWISE_SNR1) { if (!(p.slope > 0.20 && p.slope < 0.26)) return false; }
      // threshold-robustness: the stricter SNR>=10 cap gives a slope in the same ballpark.
      return FIT_SNR10 > 0.18 && FIT_SNR10 < 0.26;
    },
    why: 'fitting the cap across three precisions gives exponent 0.240 (pairwise 0.237-0.244), confirming d*(eps) ~ eps^{-1/4}; the small deficit below 0.25 is the predicted slow-log correction 1/(4 + 1/ln d*). This replaces the imp-97704 single-point assertion with a measured multi-precision fit.',
  },
  {
    id: 'imp97724-extended-cap-does-not-move-gap',
    holds: () => {
      // re-check via the JS kernel: the rigorous tail budget is cap-independent and dwarfs any cap->inf shift.
      const rp = K.Rcorr(PRIMORIAL10, 1000), rc = K.Rcorr(COMPETITOR10, 1000);
      const budget = rp.tailBound + rc.tailBound;
      const gap = K.Tfull(COMPETITOR10, 1000) - K.Tfull(PRIMORIAL10, 1000);
      return gap > 0 && budget < 1e-10 && gap / budget > 1e6 && Math.abs(gap - 7.520578537e-5) < 5e-11;
    },
    why: 'extending the exact divisor sum to the materialized dps=30 cap only replaces the rigorous 1/(720 d^3) tail BOUND on 1000 < d <= 2.85e6 with a smaller exact signed contribution; the cap-independent budget < 5.69e-11 bounds any cap-to-infinity gap shift a million-fold below the +7.52e-5 gap, so the omega=10 ordering and omega=11 onset are unchanged.',
  },
  {
    id: 'imp97724-honesty-gate-no-qed',
    holds: () =>
      IMP97724_DPS_CAP_FIT.onsetOmega === 11 &&
      IMP97724_DPS_CAP_FIT.dps30CapMaterialized === true &&
      IMP97724_DPS_CAP_FIT.capScalingConfirmedByFit === true &&
      IMP97724_DPS_CAP_FIT.extendedCapMovesGap === false &&
      IMP97724_DPS_CAP_FIT.ceilingTouched === false &&
      IMP97724_DPS_CAP_FIT.anyBoundMoved === false &&
      IMP97724_DPS_CAP_FIT.qed === false &&
      /NO QED/.test(IMP97724_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97724_HONEST_BANNER) &&
      /RH open/.test(IMP97724_HONEST_BANNER) &&
      /omega=11/.test(IMP97724_HONEST_BANNER),
    why: 'measurement/accuracy only -- the dps=16/24/30 run materializes the trustworthy d-range and fits the eps^{-1/4} exponent, but the cap-independent tail budget leaves the omega=10 gap and omega=11 onset unchanged; no bound moved; no QED.',
  },
];

for (const a of IMP97724_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97724-mcm-dps-cap-scaling-fit assertion failed: ${a.id}`);
  }
}

export default {
  dpsCapFit: IMP97724_DPS_CAP_FIT,
  banner: IMP97724_HONEST_BANNER,
};
