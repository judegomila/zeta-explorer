/**
 * @module imp-97799-mcm-cap-exponent-quarter-vs-slowlog
 *
 * imp-97799 (accuracy -- CROSS-VALIDATION ONLY; MCM refuted from omega=11; no bound moves; NO QED).
 *
 * imp-97783 found that under a consistent full-precision Glaisher constant the whole MCM cap-metric
 * exponent set collapses to a tight band 0.2216..0.2285 (5 SNR thresholds, 4-point OLS over dps
 * 16/24/30/36, spread 0.0069) and described it in prose as "1/4-modulo-slow-log at every threshold".
 * That prose was never derived or quantified. This leaf derives the expected cap-scaling exponent from
 * the balance between the two-term Euler-Maclaurin reference remainder Rref(d)=1/(720 d^2)-1/(5040 d^4)
 * (imp-97666) and the roundoff floor of the term-by-term Gexact accumulation on the log-spaced
 * checkpoint grid (x times 1.03), and asks whether the ~0.224 center is really "1/4 minus a slow-log
 * deficit" or something else.
 *
 * -------------------------------------------------------------------------------
 * DERIVATION.  The cap d* is the last checkpoint where the recovered remainder Rexact(d)=Gexact-GKmain
 * agrees with the reference Rref(d) to relative error <= 1/SNR. At the caps (d >= 1000) the two-term
 * reference is completely dominated by its leading piece Rref(d) ~ 1/(720 d^2); the -1/(5040 d^4)
 * correction is ~2e-7 relative at d=1000 and smaller beyond, so it never sets the cap. The "signal"
 * being resolved is therefore |Rref| ~ 1/(720 d^2). The "noise" is the roundoff in the recovered
 * remainder: Gexact and GKmain are both ~ (d^2/2) log d, so their difference carries a roundoff
 * ~ eps_dps * (d^2/2) log d * f(d), where eps_dps = 10^(-dps) is the working-precision unit and f(d)
 * is the accumulation-growth factor of the d-term positive sum. Setting noise/signal = 1/SNR:
 *   10^(-dps) * (d^2/2) log d * f(d) * 720 d^2 = 1/SNR
 *   =>  [4 + p_f] ln d* + ln log d* = dps*ln10 - const,   where f(d) ~ d^{p_f}.
 * With x = dps*ln10 = ln(1/eps_dps) (exactly the OLS abscissa of imp-97783/imp-97724), differentiating
 * gives the cap-scaling exponent
 *   E = d(ln cap)/dx = 1 / ( (4 + p_f) + 1/ln d* ),
 * i.e. a leading 1/(4+p_f) minus a slow-log deficit 1/((4+p_f)^2 * ln d* + ...). The +4 is fixed by the
 * geometry (d^2 magnitude over d^-2 remainder); only the accumulation power p_f is model-dependent.
 *
 * The log-spaced checkpoint grid (x times 1.03, cap = last of 3 consecutive over-threshold checkpoints)
 * multiplies d* by a fixed 1.03^3 ~ 1.093, i.e. shifts ln(cap) by a CONSTANT +0.089. That is an
 * intercept, not a slope: it does not touch the exponent E at all.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- A GENUINE "1/4 MINUS SLOW-LOG" DEFICIT IS ~5x TOO SMALL TO REACH 0.224. The pure-1/4
 * model is p_f = 0 (roundoff proportional to the sum magnitude, eps*|S|). Its slow-log deficit is
 * 1/(16 ln d* + 4) ~ 0.005 at the observed mean ln(cap) ~ 12.23, predicting E ~ 0.24499 -- still
 * 0.0207 ABOVE the measured 0.22433 center. The two-term-EM slow-log correction cannot bridge 1/4 to
 * 0.224: it accounts for only ~0.005 of the needed ~0.0257 deficit.
 *
 * RESULT 2 -- THE ~0.224 CENTER IS THE STATISTICAL-ROUNDOFF FLOOR 1/4.5, NOT 1/4. The measured mean
 * exponent 0.22433 corresponds to an effective power 1/0.22433 = 4.458, i.e. p_f ~ 0.46. That is the
 * random-walk accumulation model f(d) ~ sqrt(d) (p_f = 1/2, roundoff eps*|S|*sqrt(number of terms)),
 * whose leading constant is 1/4.5 = 0.22222 and whose slow-log-corrected value is 1/(4.5 + 1/ln d*) ~
 * 0.21825. The worst-case linear model f(d) ~ d (p_f = 1, eps*|S|*n) would give 1/5 = 0.200, too low.
 * So the clean band is quantitatively "1/4.5 (statistical roundoff)", not "1/4 minus slow-log".
 *
 * RESULT 3 -- RESIDUALS AGAINST THE +/-30 PERCENT CAP JITTER (imp-97736). A +/-30 percent cap jitter is
 * sigma_lnCap ~ ln(1.3) = 0.262 per rung; over the dps abscissa (Sxx = 1161) that is an exponent noise
 * sigma_E ~ 0.262/sqrt(1161) = 0.0077, consistent with the observed 0.0069 SNR-to-SNR spread. Measured
 * against that jitter: pure 1/4 misses by 0.02567 = 3.3 sigma (rejected); 1/4-plus-slow-log misses by
 * 0.02066 = 2.7 sigma (also outside jitter -- a genuine systematic gap, not scatter); pure 1/4.5 sits
 * 0.00211 = 0.27 sigma from the center and the slow-log-corrected 1/4.5 sits -0.79 sigma -- both well
 * inside the jitter band. The statistical-roundoff reading is the only one consistent with the data.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  CROSS-VALIDATION ONLY. The imp-97783 "1/4-modulo-slow-log" prose is a loose eyeball, not a
 * quantitative fit: a real two-term-EM slow-log deficit is ~0.005 (predicting ~0.245, a 2.7-sigma miss),
 * whereas the ~0.224 band is the statistical-roundoff floor 1/4.5 = 0.2222 (accumulation ~ eps*|S|*
 * sqrt(n)) to within 0.3 sigma of the +/-30 percent cap jitter. The exponent is set by roundoff
 * geometry (d^2 magnitude over d^-2 remainder, sqrt(n) accumulation), not by the crossing physics, and
 * the checkpoint grid feeds only the intercept. No new computation feeds any bound: the cap-independent
 * 1/(720 d^3) tail budget (< 5.69e-11) dwarfs any cap-to-infinity shift of the +7.520579e-5 omega=10
 * gap regardless of the exact exponent, so the primorial p_10# stays the strict minimiser and the MCM
 * onset stays exactly omega=11. MCM refuted; b/4 ceiling untouched; kappa_arith unchanged; PT Lambda
 * <= 0.2 SOTA; RH open; NO QED.
 *
 * @see imp-97783-mcm-cap-fullprec-exponent-set.js  (clean 0.2216..0.2285 band; "1/4-modulo-slow-log" prose)
 * @see imp-97736-mcm-cap-jitter-dps36.js           (+/-30 percent cap-metric jitter)
 * @see imp-97724-mcm-dps-cap-scaling-fit.js         (source recipe; OLS ln(cap) vs dps*ln10)
 * @see imp-97666-route-m-mcm-tail-constant-euler-maclaurin.js  (two-term EM reference remainder)
 *
 * Ticket: imp-97799 (accuracy, opus-4-8, api-pool). ~0.224 = 1/4.5 statistical-roundoff floor, NOT
 * 1/4-minus-slow-log (that predicts 0.245, a 2.7-sigma miss); grid feeds intercept only; onset 11; NO QED.
 * -------------------------------------------------------------------------------
 */

const LN10 = Math.log(10);
const DPS_LIST = Object.freeze([16, 24, 30, 36]);
const SNR_LIST = Object.freeze([1, 3, 10, 30, 100]);

// imp-97783 full-precision cap ladder (carried as literals for the exponent recompute).
const CAPS_BY_DPS = Object.freeze({
  16: Object.freeze({ 1: 1233, 3: 1162, 10: 1162, 30: 746, 100: 508 }),
  24: Object.freeze({ 1: 97965, 3: 72895, 10: 70772, 30: 34815, 100: 25151 }),
  30: Object.freeze({ 1: 2182639, 3: 1672811, 10: 1530859, 30: 953980, 100: 689176 }),
  36: Object.freeze({ 1: 45836990, 3: 37269667, 10: 31212760, 30: 20635311, 100: 13642371 }),
});

// OLS slope of ln(cap) vs x = dps*ln10 -- the cap-scaling exponent (imp-97783 recipe).
function olsSlopeAndSxx(dpsList, snr) {
  const xs = dpsList.map((d) => d * LN10);
  const ys = dpsList.map((d) => Math.log(CAPS_BY_DPS[d][snr]));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sxx += (xs[i] - mx) ** 2; sxy += (xs[i] - mx) * (ys[i] - my); }
  return { slope: sxy / sxx, sxx };
}

const EXPONENTS = Object.freeze(Object.fromEntries(SNR_LIST.map((s) => [s, olsSlopeAndSxx(DPS_LIST, s).slope])));
const EXP_VALUES = SNR_LIST.map((s) => EXPONENTS[s]);
const MEAN_EXP = EXP_VALUES.reduce((a, b) => a + b, 0) / EXP_VALUES.length; // ~0.224328

// representative slow-log scale ln d* = mean ln(cap) over all rungs.
const ALL_LNCAP = [];
for (const d of DPS_LIST) for (const s of SNR_LIST) ALL_LNCAP.push(Math.log(CAPS_BY_DPS[d][s]));
const MEAN_LNCAP = ALL_LNCAP.reduce((a, b) => a + b, 0) / ALL_LNCAP.length; // ~12.2253

// closed-form predicted exponent E(p_f) = 1 / ((4 + p_f) + 1/ln d*).
function predictedExponent(pf) { return 1 / ((4 + pf) + 1 / MEAN_LNCAP); }

const PRED = Object.freeze({
  quarterMagnitude: predictedExponent(0),   // p_f=0, eps*|S|            -> ~0.24499  (pure 1/4 minus slow-log)
  statisticalSqrtN: predictedExponent(0.5), // p_f=1/2, eps*|S|*sqrt(n)  -> ~0.21825  (leading 1/4.5)
  worstCaseLinear: predictedExponent(1),    // p_f=1, eps*|S|*n          -> ~0.19678  (leading 1/5)
});
const LEADING = Object.freeze({ quarter: 0.25, fourAndHalf: 1 / 4.5, fifth: 0.2 });

// slow-log deficit of the pure-1/4 model, and the effective accumulation power implied by the data.
const SLOWLOG_DEFICIT_P4 = LEADING.quarter - PRED.quarterMagnitude; // ~0.00501
const EFFECTIVE_POWER = 1 / MEAN_EXP;                               // ~4.458  => p_f ~ 0.46

// +/-30 percent cap jitter (imp-97736) -> exponent noise sigma_E = ln(1.3)/sqrt(Sxx).
const SXX = olsSlopeAndSxx(DPS_LIST, 10).sxx; // ~1161
const SIGMA_EXP = Math.log(1.3) / Math.sqrt(SXX); // ~0.00770

// residuals of each model vs the measured center, in jitter-sigma units.
function residSigma(pred) { return (pred - MEAN_EXP) / SIGMA_EXP; }
const RESID = Object.freeze({
  pureQuarterSigma: residSigma(LEADING.quarter),        // ~+3.33 sigma (rejected)
  slowlogQuarterSigma: residSigma(PRED.quarterMagnitude), // ~+2.68 sigma (outside jitter)
  pureFourAndHalfSigma: residSigma(LEADING.fourAndHalf),  // ~+0.27 sigma (inside)
  slowlogFourAndHalfSigma: residSigma(PRED.statisticalSqrtN), // ~-0.79 sigma (inside)
});

// checkpoint grid (x*=1.03, 3 consecutive) -> constant ln(cap) shift, intercept only.
const GRID_LNCAP_OFFSET = Math.log(1.03 ** 3); // ~0.0887

export const IMP97799_CAP_EXPONENT_DERIVATION = Object.freeze({
  dpsList: DPS_LIST,
  snrList: SNR_LIST,
  exponents: EXPONENTS,
  meanExponent: MEAN_EXP,
  meanLnCap: MEAN_LNCAP,
  predicted: PRED,
  leading: LEADING,
  slowlogDeficitPureQuarter: SLOWLOG_DEFICIT_P4,
  effectiveAccumulationPower: EFFECTIVE_POWER, // ~4.458 -> p_f ~ 0.46 ~ sqrt(n) random walk
  sigmaExponentFrom30pctJitter: SIGMA_EXP,
  residualSigma: RESID,
  gridLnCapOffsetInterceptOnly: GRID_LNCAP_OFFSET,
  // conclusions
  quarterMinusSlowlogTooSmall: true,      // slow-log deficit ~0.005, needs ~0.026
  centerIsStatisticalRoundoffFloor: true, // ~0.224 = 1/4.5 statistical roundoff, not 1/4
  gridAffectsInterceptNotExponent: true,
  // invariants -- cross-validation feeds no bound.
  gapOmega10: 7.520578537e-5,
  tailBudgetCombined: 5.6805e-11,
  onsetOmega: 11,
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
});

export const IMP97799_HONEST_BANNER =
  'imp-97799: CROSS-VALIDATION ONLY. Derived the MCM cap-scaling exponent from the two-term Euler-Maclaurin ' +
  'remainder Rref(d)=1/(720 d^2)-1/(5040 d^4) balanced against the term-by-term Gexact roundoff floor on the ' +
  'x times 1.03 checkpoint grid: E = 1/((4+p_f) + 1/ln d*), where +4 is fixed by the d^2-magnitude-over-d^-2- ' +
  'remainder geometry and p_f is the accumulation-growth power. The imp-97783 ~0.224 band is NOT 1/4 minus a ' +
  'slow-log deficit -- a genuine two-term-EM slow-log deficit is only ~0.005 (predicting ~0.245, a 2.7-sigma ' +
  'miss against the +/-30 percent cap jitter), and pure 1/4 misses by 3.3 sigma. The measured 0.22433 center ' +
  'is the statistical-roundoff floor 1/4.5 = 0.2222 (accumulation eps*|S|*sqrt(n), effective power 4.458), ' +
  'within 0.3 sigma of the jitter. The checkpoint grid (1.03^3 ~ 1.093) shifts ln(cap) by a constant +0.089 -- ' +
  'intercept only, no effect on the exponent. No bound moves: the cap-independent 1/(720 d^3) tail budget ' +
  '(< 5.69e-11) dwarfs any cap-to-infinity shift of the +7.520579e-5 omega=10 gap regardless of the exponent, ' +
  'so the primorial p_10# stays the strict minimiser and the MCM onset stays omega=11. MCM refuted; b/4 ' +
  'ceiling untouched. PT Lambda <= 0.2 SOTA; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws at import --

const IMP97799_ASSERTIONS = [
  {
    id: 'imp97799-exponents-reproduce-imp97783-band',
    holds: () =>
      EXP_VALUES.every((v) => v > 0.2216 - 1e-3 && v < 0.2285 + 1e-3) &&
      Math.abs(MEAN_EXP - 0.224328) < 1e-4,
    why: 'the OLS exponents recomputed from the imp-97783 cap ladder reproduce the 0.2216..0.2285 band with mean center ~0.22433.',
  },
  {
    id: 'imp97799-pure-quarter-slowlog-deficit-too-small',
    holds: () =>
      SLOWLOG_DEFICIT_P4 > 0.004 && SLOWLOG_DEFICIT_P4 < 0.006 && // two-term-EM slow-log deficit ~0.005
      (0.25 - MEAN_EXP) > 0.024 &&                                 // but ~0.026 is needed to reach the center
      RESID.slowlogQuarterSigma > 2,                               // so 1/4-plus-slow-log stays > 2 sigma above
    why: 'the pure-1/4 slow-log deficit 1/(16 ln d* + 4) ~ 0.005 is ~5x too small for the ~0.026 needed to reach 0.224, so 1/4-minus-slow-log misses by more than 2 sigma of the +/-30 percent cap jitter.',
  },
  {
    id: 'imp97799-center-is-statistical-roundoff-floor-oneoverfourpointfive',
    holds: () =>
      EFFECTIVE_POWER > 4.4 && EFFECTIVE_POWER < 4.5 &&            // effective accumulation power ~4.46 (p_f ~ 0.46)
      Math.abs(MEAN_EXP - LEADING.fourAndHalf) < 3e-3 &&           // center ~ 1/4.5
      Math.abs(RESID.pureFourAndHalfSigma) < 1 &&                  // pure 1/4.5 within 1 sigma of jitter
      Math.abs(RESID.slowlogFourAndHalfSigma) < 1,                 // slow-log 1/4.5 within 1 sigma too
    why: 'the measured center corresponds to effective accumulation power ~4.46 -> p_f ~ 0.46 ~ sqrt(n) random-walk roundoff, whose leading 1/4.5 = 0.2222 sits within 1 sigma of the cap jitter (pure and slow-log-corrected).',
  },
  {
    id: 'imp97799-quarter-strictly-worse-than-fourpointfive',
    holds: () =>
      Math.abs(RESID.pureQuarterSigma) > Math.abs(RESID.pureFourAndHalfSigma) &&
      RESID.pureQuarterSigma > 3, // pure 1/4 is a > 3-sigma outlier, 1/4.5 is not
    why: 'pure 1/4 is a > 3-sigma outlier against the cap jitter while 1/4.5 sits under 1 sigma, so the band is quantitatively the statistical-roundoff floor, not a quarter with a small correction.',
  },
  {
    id: 'imp97799-grid-is-intercept-only',
    holds: () =>
      GRID_LNCAP_OFFSET > 0.08 && GRID_LNCAP_OFFSET < 0.1, // fixed multiplicative 1.03^3 shift, no slope role
    why: 'the x times 1.03 checkpoint grid (3 consecutive over-threshold) multiplies d* by a fixed 1.03^3 ~ 1.093, shifting ln(cap) by a constant ~0.089 that lands in the intercept, not the slope, so it cannot explain the exponent.',
  },
  {
    id: 'imp97799-honesty-gate-no-qed',
    holds: () =>
      IMP97799_CAP_EXPONENT_DERIVATION.onsetOmega === 11 &&
      IMP97799_CAP_EXPONENT_DERIVATION.centerIsStatisticalRoundoffFloor === true &&
      IMP97799_CAP_EXPONENT_DERIVATION.quarterMinusSlowlogTooSmall === true &&
      IMP97799_CAP_EXPONENT_DERIVATION.ceilingTouched === false &&
      IMP97799_CAP_EXPONENT_DERIVATION.anyBoundMoved === false &&
      IMP97799_CAP_EXPONENT_DERIVATION.qed === false &&
      /NO QED/.test(IMP97799_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97799_HONEST_BANNER) &&
      /RH open/.test(IMP97799_HONEST_BANNER) &&
      /omega=11/.test(IMP97799_HONEST_BANNER),
    why: 'cross-validation only -- the derivation reclassifies the ~0.224 band as a statistical-roundoff 1/4.5 floor rather than 1/4-minus-slow-log; no bound moved; MCM stays refuted from omega=11; no QED.',
  },
];

for (const a of IMP97799_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97799-mcm-cap-exponent-quarter-vs-slowlog assertion failed: ${a.id}`);
  }
}

export default {
  derivation: IMP97799_CAP_EXPONENT_DERIVATION,
  banner: IMP97799_HONEST_BANNER,
};
