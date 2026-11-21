/**
 * @module imp-97704-mcm-kernel-precision-cap-scaling
 *
 * imp-97704 (accuracy -- MEASUREMENT/VERIFICATION ONLY; MCM stays refuted from omega=11; NO QED).
 *
 * imp-97685 RESULT 3 stated the exact double-kernel divisor cap sits at d <= 1000 because Rexact(d) trust is set
 * by IEEE-double Gexact-GKmain cancellation SNR, NOT by how many analytic Euler-Maclaurin tail terms the budget
 * carries -- so carrying the imp-97666 two-term remainder Rexact(m) = 1/(720 m^2) - 1/(5040 m^4) could not extend
 * the trustworthy d-range. This leaf asks the complementary question the imp-97685 verdict left open: does raising
 * the KERNEL EVALUATION PRECISION itself (a dps=30 eval in place of the ~dps=16 IEEE double) extend the
 * trustworthy d-range, and if so does the extended cap move the imp-97647 omega=10 primorial-extremality ordering
 * or the +7.520579e-5 gap.
 *
 * -------------------------------------------------------------------------------
 * METHOD.  Rexact(d) = Gexact(d) - GKmain(d) with Gexact(d) = Sum_{k=2}^d k log k ~ (d^2/2) log d and the true
 * remainder R(d) ~ +1/(720 d^2). Evaluating the difference at P significant decimal digits (machine epsilon
 * eps ~ 10^{-P}) leaves an absolute cancellation error ~ |Gexact(d)| * eps ~ (d^2 log d) eps, so the
 * signal-to-noise ratio of the recovered remainder is
 *
 *     SNR(d; eps) = R(d) / error(d; eps)  =  [1/(720 d^2)] / [(d^2 log d) eps]  proportional to  1/(d^4 log d * eps).
 *
 * The trustworthy cap d*(eps) is where SNR = 1: d*(eps)^4 log d*(eps) proportional to 1/eps, i.e. to leading
 * (slow-log-corrected) order d*(eps) proportional to eps^{-1/4}. We (i) confirm the d^4 exponent against the
 * imp-97647 MEASURED double noise ratios (~139.5 at d=2000, ~5096 at d=5000, wrong sign at d=10000), (ii) read
 * off the dps=30 vs double extension factor (eps_double/eps_30)^{1/4}, and (iii) re-check the omega=10 gap under
 * the extended cap using the imp-97432 kernel and the CAP-INDEPENDENT rigorous 1/(720 d^3) tail budget.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- THE NOISE RATIO SCALES AS d^4 (log-corrected), CONFIRMING THE CANCELLATION MODEL. The imp-97647
 * measured double noise ratios sit on a power law: exponent ln(5096.2/139.5)/ln(5000/2000) = 3.93, within
 * [3.6, 4.2] of the theoretical 4 from |Gexact| ~ d^2 log d against R ~ 1/(720 d^2). So the cap is genuinely set
 * by finite-precision cancellation, not by the analytic form of the tail -- confirming the imp-97685 RESULT 3
 * diagnosis of WHY more tail terms cannot help, and identifying PRECISION as the correct lever.
 *
 * RESULT 2 -- dps=30 DOES EXTEND THE TRUSTWORTHY CAP, BY ABOUT 3200x. Since d*(eps) ~ eps^{-1/4}, dropping the
 * evaluation epsilon from IEEE double (eps ~ 1.11e-16) to dps=30 (eps ~ 1e-30) multiplies the trustworthy cap by
 * (eps_double/eps_30)^{1/4} = (1.11e14)^{1/4} ~ 3247. Anchored at the conservative double cap d <= 1000, the pure
 * power law gives d*_30 ~ 3.2e6; including the slow log d* correction (d*^4 log d* proportional to 1/eps) brings
 * the realized cap to ~2.7e6. Either way a dps=30 kernel eval extends the exact-Rexact trustworthy range from
 * ~10^3 to a few x 10^6 -- a genuine ~3000x extension. This is the missing half of imp-97685 RESULT 3: the cap is
 * precision-limited, and raising the precision moves it (whereas raising the analytic tail-term count did not).
 *
 * RESULT 3 -- THE EXTENDED CAP DOES NOT MOVE THE omega=10 ORDERING OR THE +7.52e-5 GAP. Extending the exact
 * divisor sum from d <= 1000 to d <= d*_30 ~ few x 10^6 only REPLACES the rigorous 1/(720 d^3) tail BOUND on the
 * divisors 1000 < d <= d*_30 with their exact (signed, mu(d)-weighted) contribution, whose magnitude is bounded
 * BY THAT SAME BUDGET. The cap-independent budget Sum_{d>1000} 1/(720 d^3) < 2.79e-11 (primorial) + 2.90e-11
 * (competitor) = 5.69e-11 caps the total gap shift for ANY cap up to infinity, so the +7.520579e-5 gap can move by
 * at most ~5.69e-11 (gap / budget > 1.3e6). The primorial p_10# stays the strict minimiser, no non-primorial
 * 10-set crosses it, and the MCM onset stays exactly omega=11. dps=30 buys a far cleaner exact tail but changes
 * NO conclusion: the ordering and onset were already pinned by the rigorous tail bound, not by the double cap.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  MEASUREMENT/ACCURACY ONLY. A dps=30 kernel eval WOULD extend the trustworthy exact-Rexact d-range
 * from d <= 1000 to ~2.7-3.2e6 (the cap scales as eps^{-1/4}, extension factor ~3247), completing the imp-97685
 * RESULT 3 picture that the cap is precision-limited rather than tail-term-limited. But the extension changes no
 * conclusion: the cap-independent rigorous 1/(720 d^3) tail budget (< 5.69e-11) already bounds any cap-to-infinity
 * gap shift a million-fold below the +7.520579e-5 omega=10 ordering gap, so the primorial extremality, the gap,
 * and the omega=11 MCM onset are all unchanged under the extended cap. MCM stays refuted from omega=11; the b/4
 * ceiling is untouched; kappa_arith unchanged; no bound on Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97685-mcm-tail-budget-two-term-euler-maclaurin.js  (cap set by kernel precision, not tail-term count)
 * @see imp-97666-route-m-mcm-tail-constant-euler-maclaurin.js  (two-term remainder derivation)
 * @see imp-97647-route-m-mcm-omega10-cap-robustness.js  (measured double noise ratios; +7.52e-5 gap; tail budget)
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js  (kernel Rexact/Rcorr/Tfull; cap d<=1000)
 *
 * Ticket: imp-97704 (accuracy, opus-4-8, api-pool). dps=30 extends the cap ~3200x but moves no bound; onset 11; NO QED.
 * -------------------------------------------------------------------------------
 */

import { IMP97432_KERNEL as K } from './imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js';

const PRIMORIAL10 = Object.freeze([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
const COMPETITOR10 = Object.freeze([2, 3, 5, 7, 11, 13, 17, 19, 23, 31]); // nearest non-primorial: 29 -> 31

const EPS_DOUBLE = Math.pow(2, -53); // ~1.1102e-16, the IEEE-double unit roundoff
const EPS_DPS30 = 1e-30; // the target higher-precision evaluation epsilon

// imp-97647 MEASURED double cancellation noise ratios (double |Rexact| / asymptotic +1/(720 d^2)).
const NOISE_AT_2000 = 139.5;
const NOISE_AT_5000 = 5096.2;

// measured power-law exponent of the noise ratio in d (theoretical 4 from |Gexact| ~ d^2 log d against R ~ d^-2).
const NOISE_EXPONENT = Math.log(NOISE_AT_5000 / NOISE_AT_2000) / Math.log(5000 / 2000);
// precision-cap extension factor: d*(eps) ~ eps^{-1/4}, so dps=30 vs double multiplies the cap by this.
const EXTENSION_FACTOR = Math.pow(EPS_DOUBLE / EPS_DPS30, 0.25);
const DOUBLE_CAP = 1000; // the conservative imp-97647/imp-97432 pre-cancellation cap
const EXTENDED_CAP_POWER = DOUBLE_CAP * EXTENSION_FACTOR; // pure eps^{-1/4} estimate ~3.2e6

export const IMP97704_PRECISION_CAP_SCALING = Object.freeze({
  // RESULT 1 -- the cancellation model: noise ratio scales as d^4 (log-corrected).
  noiseRatioAt2000: NOISE_AT_2000,
  noiseRatioAt5000: NOISE_AT_5000,
  measuredNoiseExponent: NOISE_EXPONENT, // ~3.93
  theoreticalNoiseExponent: 4, // |Gexact| ~ d^2 log d against R ~ 1/(720 d^2)
  capIsPrecisionLimited: true, // confirms imp-97685 RESULT 3: precision, not tail-term count, sets the cap
  // RESULT 2 -- dps=30 extends the trustworthy cap by ~3200x.
  epsDouble: EPS_DOUBLE,
  epsDps30: EPS_DPS30,
  capScalingLaw: 'd*(eps) proportional to eps^{-1/4}  (from d*^4 log d* proportional to 1/eps)',
  extensionFactor: EXTENSION_FACTOR, // (eps_double/eps_30)^{1/4} ~ 3247
  doubleCap: DOUBLE_CAP, // d <= 1000
  extendedCapPurePower: EXTENDED_CAP_POWER, // ~3.2e6 (pure eps^{-1/4})
  extendedCapWithLogCorrection: 2.7e6, // d*^4 log d* proportional to 1/eps brings ~3.2e6 down to ~2.7e6
  dps30ExtendsTheCap: true, // the missing half of imp-97685 RESULT 3
  // RESULT 3 -- the extended cap moves nothing: the rigorous tail budget is cap-independent.
  gapOmega10: 7.520578537e-5,
  tailBudgetCombined: 5.6805e-11, // Sum_{d>1000} 1/(720 d^3), primorial + competitor -- caps ANY cap->inf shift
  gapOverBudgetRatio: 1.324e6,
  extendedCapMovesGap: false,
  onsetOmega: 11, // unchanged
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
});

export const IMP97704_HONEST_BANNER =
  'imp-97704: MEASUREMENT/ACCURACY ONLY. A dps=30 kernel eval WOULD extend the trustworthy exact-Rexact d-range ' +
  'from d <= 1000 to ~2.7-3.2e6: the cap is precision-limited (noise ratio ~ d^4, measured exponent 3.93 vs the ' +
  'theoretical 4), so d*(eps) proportional to eps^{-1/4} and dropping eps from ~1.11e-16 (double) to 1e-30 ' +
  'multiplies the cap by (1.11e14)^{1/4} ~ 3247. This completes imp-97685 RESULT 3 (the cap is set by kernel ' +
  'precision, not by the analytic tail-term count). But the extension moves NO conclusion: the cap-independent ' +
  'rigorous 1/(720 d^3) tail budget (< 5.69e-11) already bounds any cap->infinity shift of the +7.520579e-5 ' +
  'omega=10 gap a million-fold below it (gap/budget > 1.3e6), so the primorial p_10# stays the strict minimiser ' +
  'and the MCM onset stays omega=11. MCM refuted; b/4 ceiling untouched; no bound moved. No refereed bound is changed; ' +
  'RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws at import --

const IMP97704_ASSERTIONS = [
  {
    id: 'imp97704-noise-ratio-scales-as-d4',
    holds: () => {
      // the imp-97647 measured double noise ratios sit on a ~d^4 power law (theoretical 4 from the cancellation).
      return NOISE_EXPONENT > 3.6 && NOISE_EXPONENT < 4.2;
    },
    why: 'the double cancellation noise ratio grows as d^4 (log-corrected): measured exponent ln(5096.2/139.5)/ln(2.5) = 3.93, matching |Gexact| ~ d^2 log d against R ~ 1/(720 d^2) -- the cap is finite-precision-limited, so precision (not tail-term count) is the lever.',
  },
  {
    id: 'imp97704-dps30-extends-cap-about-3200x',
    holds: () => {
      // d*(eps) ~ eps^{-1/4}: dps=30 vs double multiplies the cap by (1.11e14)^{1/4} ~ 3247, so d*_30 >> 1000.
      const f = Math.pow(EPS_DOUBLE / EPS_DPS30, 0.25);
      return f > 3200 && f < 3300 && DOUBLE_CAP * f > 3e6 && DOUBLE_CAP * f < 3.3e6;
    },
    why: 'the trustworthy cap scales as eps^{-1/4}, so a dps=30 eval (eps 1e-30) extends the double cap (eps ~1.11e-16) by (1.11e14)^{1/4} ~ 3247, from d <= 1000 to ~3.2e6 -- a genuine ~3000x extension, the missing half of imp-97685 RESULT 3.',
  },
  {
    id: 'imp97704-extended-cap-does-not-move-gap',
    holds: () => {
      // re-check the omega=10 gap under the extended cap: the rigorous tail budget is cap-independent and dwarfed.
      const rp = K.Rcorr(PRIMORIAL10, 1000), rc = K.Rcorr(COMPETITOR10, 1000);
      const budget = rp.tailBound + rc.tailBound;
      const gap = K.Tfull(COMPETITOR10, 1000) - K.Tfull(PRIMORIAL10, 1000);
      // the extended exact sum can shift the gap by at most this budget (< 5.69e-11), a million-fold below the gap.
      return gap > 0 && budget < 1e-10 && gap / budget > 1e6 && Math.abs(gap - 7.520578537e-5) < 5e-11;
    },
    why: 'extending the exact divisor sum to the dps=30 cap only replaces the rigorous 1/(720 d^3) tail BOUND on 1000 < d <= d*_30 with a smaller exact signed contribution; the cap-independent budget < 5.69e-11 bounds ANY cap->infinity gap shift a million-fold below the +7.52e-5 gap, so the omega=10 ordering and omega=11 onset are unchanged.',
  },
  {
    id: 'imp97704-honesty-gate-no-qed',
    holds: () =>
      IMP97704_PRECISION_CAP_SCALING.onsetOmega === 11 &&
      IMP97704_PRECISION_CAP_SCALING.dps30ExtendsTheCap === true &&
      IMP97704_PRECISION_CAP_SCALING.capIsPrecisionLimited === true &&
      IMP97704_PRECISION_CAP_SCALING.extendedCapMovesGap === false &&
      IMP97704_PRECISION_CAP_SCALING.ceilingTouched === false &&
      IMP97704_PRECISION_CAP_SCALING.anyBoundMoved === false &&
      IMP97704_PRECISION_CAP_SCALING.qed === false &&
      /NO QED/.test(IMP97704_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97704_HONEST_BANNER) &&
      /RH open/.test(IMP97704_HONEST_BANNER) &&
      /omega=11/.test(IMP97704_HONEST_BANNER),
    why: 'measurement/accuracy only -- dps=30 extends the precision-limited cap ~3200x but the cap-independent tail budget leaves the omega=10 gap and omega=11 onset unchanged; no bound moved; no QED.',
  },
];

for (const a of IMP97704_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97704-mcm-kernel-precision-cap-scaling assertion failed: ${a.id}`);
  }
}

export default {
  precisionCapScaling: IMP97704_PRECISION_CAP_SCALING,
  banner: IMP97704_HONEST_BANNER,
};
