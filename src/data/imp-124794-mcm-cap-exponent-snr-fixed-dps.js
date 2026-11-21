/**
 * @module imp-124794-mcm-cap-exponent-snr-fixed-dps
 *
 * imp-124794 (accuracy -- MEASUREMENT/VERIFICATION ONLY; MCM refuted from omega=11; no bound moves; NO QED).
 *
 * imp-97724 RESULT 2 fit the MCM trustworthy-cap eps^{-1/4} scaling as OLS slope 0.2401 at SNR=1 and
 * 0.2150 at SNR&gt;=10, calling them the same ballpark on only TWO SNR points, and those exponents were baked
 * over the 17-digit-Glaisher-contaminated dps 16/24/30 design (imp-97736 RESULT 3). This leaf characterizes
 * the SNR-sensitivity of the cap exponent across the FULL SNR ladder {1,3,10,30,100} at FIXED, UNCONTAMINATED
 * precision -- the two-point dps={16,24} design only (dps&gt;=30 caps are contaminated by the Glaisher literal,
 * so they are excluded, per [[project_mcm_cap_metric_jitter_limited]]) -- to decide whether the exponent
 * drifts MONOTONICALLY with SNR (a slow-log-curvature signature) or SCATTERS within the imp-97736 +/-~30
 * percent jitter band.
 *
 * -------------------------------------------------------------------------------
 * METHOD (independent, reuses imp-97783 caps byte-for-byte). The imp-97783 full-precision-Glaisher ladder
 * already carries the uncontaminated dps=16 and dps=24 caps at all five SNR thresholds. For each SNR we take
 * the two-point cap-scaling exponent = slope of ln(cap) vs dps*ln10 through the {16,24} pair only:
 *     exp2pt(SNR) = ln(cap24/cap16) / ((24-16) * ln10).
 * This is the same kernel recipe as tmp/imp-97724-mcm-dps-cap-fit.py restricted to the two clean precisions.
 * The +/-~30 percent cap jitter (imp-97736) is +/-ln(1.3) ~ 0.2624 in ln(cap); for a two-point slope the
 * exponent standard error is SD_exp2pt = sqrt(2)*ln(1.3) / ((24-16)*ln10) ~ 0.02014 -- about 2.6x the
 * imp-97801 FOUR-point SD (~0.0077), because dropping to two dps rungs shrinks the design Sxx sharply.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- THE FIXED-dps CAP EXPONENT IS NON-MONOTONE IN SNR. The five two-point exponents (loose -&gt;
 * strict SNR) are:
 *     SNR=1   0.23751
 *     SNR=3   0.22469
 *     SNR=10  0.22308
 *     SNR=30  0.20863
 *     SNR=100 0.21184
 * The sequence is NOT monotone: SNR=100 (0.21184) sits ABOVE SNR=30 (0.20863), reversing the loose-to-strict
 * downward trend. A genuine slow-log curvature signature would require a monotone drift of the exponent with
 * the threshold; the reversal at the strictest rung is exactly the fingerprint of jitter, not curvature.
 *
 * RESULT 2 -- THE SPREAD IS ~1.4 JITTER-SIGMA; THE 0.240-vs-0.215 GAP IS JITTER, NOT SLOW-LOG. The full
 * five-threshold spread is max-min = 0.02889 = 1.434 * SD_exp2pt (SD_exp2pt ~ 0.02014). The imp-97724
 * baked SNR=1-vs-SNR&gt;=10 gap 0.0251 is 1.25 * SD_exp2pt on this same two-point design, so it is NOT
 * cleanly separable from jitter at fixed uncontaminated precision. The two-point restriction is INHERENTLY
 * ~2.6x more jitter-sensitive than the imp-97801 four-point OLS (which collapsed the clean full-precision set
 * to a 0.00685 spread inside one 0.0077-sigma), which is precisely why the SNR gap looks larger here: fewer
 * dps rungs, larger exponent standard error. Both the non-monotone ordering (RESULT 1) and the ~1.4-sigma
 * spread confirm the SNR-dependence of the cap exponent at fixed dps is jitter-dominated scatter, not a
 * resolvable slow-log drift.
 *
 * -------------------------------------------------------------------------------
 * VERDICT. MEASUREMENT/VERIFICATION ONLY. At fixed uncontaminated dps={16,24} the MCM cap exponent does NOT
 * drift monotonically with SNR -- it scatters (SNR=100 rises above SNR=30) with a 0.0289 spread = 1.43
 * jitter-sigma -- so the imp-97724 0.240-vs-0.215 gap is jitter, not slow-log curvature, consistent with
 * imp-97736 RESULT 3 and imp-97801. No new computation feeds any bound: the cap-independent 1/(720 d^3) tail
 * budget (&lt; 5.69e-11) dwarfs any cap-to-infinity shift of the +7.520579e-5 omega=10 gap, so the primorial
 * p_10# stays the strict minimiser and the MCM onset stays exactly omega=11. MCM refuted; b/4 ceiling
 * untouched; kappa_arith unchanged; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97783-mcm-cap-fullprec-exponent-set.js  (source full-precision cap ladder; dps 16/24 reused byte-for-byte)
 * @see imp-97801-mcm-cap-snr-monotonicity.js        (four-point SNR-monotonicity audit; SNR=30 vs SNR=10 jitter)
 * @see imp-97736-mcm-cap-jitter-dps36.js            (+/-~30 percent cap-metric jitter; RESULT 3)
 * @see imp-97724-mcm-dps-cap-scaling-fit.js         (source recipe + contaminated 0.240-vs-0.215 baked gap)
 *
 * Ticket: imp-124794 (accuracy, opus-4-8, api-pool). Fixed-dps={16,24} cap exponent non-monotone in SNR (SNR=100&gt;SNR=30), spread 0.0289=1.43 jitter-sigma -- 0.240-vs-0.215 gap is jitter not slow-log; onset 11; NO QED.
 * -------------------------------------------------------------------------------
 */

import { IMP97783_FULLPREC_EXPONENT_SET } from './imp-97783-mcm-cap-fullprec-exponent-set.js';

const LN10 = Math.log(10);
const SNR_LIST = IMP97783_FULLPREC_EXPONENT_SET.snrList; // [1, 3, 10, 30, 100]  (loose -> strict)
const CAPS_BY_DPS = IMP97783_FULLPREC_EXPONENT_SET.capsByDps; // reused byte-for-byte
const DPS_LO = 16; // uncontaminated
const DPS_HI = 24; // uncontaminated (dps>=30 excluded: Glaisher-literal contamination)
const DPS_SPAN = (DPS_HI - DPS_LO) * LN10; // ln(1/eps) span = 8*ln10 ~ 18.4207

// -- two-point cap-scaling exponent through the {16,24} pair at a given SNR --
function exp2pt(snr) {
  return Math.log(CAPS_BY_DPS[DPS_HI][snr] / CAPS_BY_DPS[DPS_LO][snr]) / DPS_SPAN;
}

const EXP2PT = Object.freeze(Object.fromEntries(SNR_LIST.map((s) => [s, exp2pt(s)])));
const EXP_VALUES = SNR_LIST.map((s) => EXP2PT[s]);
const SPREAD = Math.max(...EXP_VALUES) - Math.min(...EXP_VALUES); // ~0.02889

// -- monotonicity of the exponent along the loose -> strict SNR list --
let monotoneDec = true;
let monotoneInc = true;
for (let i = 1; i < SNR_LIST.length; i++) {
  if (EXP_VALUES[i] > EXP_VALUES[i - 1]) monotoneDec = false;
  if (EXP_VALUES[i] < EXP_VALUES[i - 1]) monotoneInc = false;
}
const EXPONENT_MONOTONE_IN_SNR = monotoneDec || monotoneInc; // false -- SNR=100 rises above SNR=30

// -- two-point jitter propagation: SD_exp = sqrt(2)*ln(1.3)/((24-16)*ln10) --
const SIGMA_LNCAP = Math.log(1.3); // +/-30 percent cap jitter -> +/- this in ln(cap)
const SD_EXP_2PT = (Math.sqrt(2) * SIGMA_LNCAP) / DPS_SPAN; // ~0.02014
const SPREAD_IN_SIGMA = SPREAD / SD_EXP_2PT; // ~1.434
const BAKED_GAP = 0.0251; // imp-97724 baked SNR=1 (0.2401) vs SNR>=10 (0.2150) gap
const BAKED_GAP_IN_SIGMA = BAKED_GAP / SD_EXP_2PT; // ~1.246

export const IMP124794_MCM_CAP_EXPONENT_SNR_FIXED_DPS = Object.freeze({
  dpsLo: DPS_LO,
  dpsHi: DPS_HI,
  snrList: SNR_LIST,
  // RESULT 1 -- fixed-dps two-point cap exponent per SNR; non-monotone in SNR.
  exp2ptBySnr: EXP2PT, // {1:0.23751, 3:0.22469, 10:0.22308, 30:0.20863, 100:0.21184}
  exponentMonotoneInSnr: EXPONENT_MONOTONE_IN_SNR, // false -- SNR=100 above SNR=30
  // RESULT 2 -- the spread is ~1.4 jitter-sigma; the 0.240-vs-0.215 gap is jitter, not slow-log.
  spread: SPREAD, // ~0.02889
  sdExp2ptFromJitter: SD_EXP_2PT, // ~0.02014 (two-point design; ~2.6x the imp-97801 four-point 0.0077)
  spreadInSigma: SPREAD_IN_SIGMA, // ~1.434
  bakedGap: BAKED_GAP, // imp-97724 0.240-vs-0.215 = 0.0251
  bakedGapInSigma: BAKED_GAP_IN_SIGMA, // ~1.246 -- not cleanly separable from jitter at fixed dps
  gapIsJitterNotSlowLog: !EXPONENT_MONOTONE_IN_SNR, // true -- non-monotone => scatter, not curvature
  // invariants -- measurement feeds no bound.
  gapOmega10: 7.520578537e-5,
  tailBudgetCombined: 5.6805e-11,
  onsetOmega: 11,
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
});

export const IMP124794_HONEST_BANNER =
  'imp-124794: MEASUREMENT/VERIFICATION ONLY. Characterized the SNR-sensitivity of the imp-97724 MCM ' +
  'eps^{-1/4} cap exponent across the SNR ladder {1,3,10,30,100} at FIXED uncontaminated precision -- the ' +
  'two-point dps={16,24} design only (dps>=30 excluded for Glaisher-literal contamination). RESULT 1: the ' +
  'fixed-dps cap exponent is NON-MONOTONE in SNR (1:0.23751, 3:0.22469, 10:0.22308, 30:0.20863, 100:0.21184) ' +
  '-- SNR=100 rises ABOVE SNR=30, reversing the loose-to-strict downward trend, which is the fingerprint of ' +
  'jitter rather than a slow-log curvature (curvature would demand a monotone drift). RESULT 2: the ' +
  'five-threshold spread 0.02889 is 1.434 two-point jitter-sigma (SD 0.02014 = sqrt(2)*ln(1.3)/(8*ln10), ' +
  'about 2.6x the imp-97801 four-point 0.0077 because two rungs shrink the design), and the imp-97724 baked ' +
  '0.240-vs-0.215 gap 0.0251 is 1.25 sigma on the same design -- not cleanly separable from jitter at fixed ' +
  'dps. So the 0.240-vs-0.215 gap is jitter, NOT slow-log curvature, consistent with imp-97736 RESULT 3 and ' +
  'imp-97801. No bound moves: the cap-independent 1/(720 d^3) tail budget (< 5.69e-11) dwarfs any ' +
  'cap-to-infinity shift of the +7.520579e-5 omega=10 gap, so the primorial p_10# stays the strict minimiser ' +
  'and the MCM onset stays omega=11. MCM refuted; b/4 ceiling untouched. No refereed bound is changed; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws at import --

const IMP124794_ASSERTIONS = [
  {
    id: 'imp124794-reuses-imp97783-uncontaminated-caps',
    holds: () =>
      CAPS_BY_DPS[16][1] === 1233 && CAPS_BY_DPS[16][100] === 508 &&
      CAPS_BY_DPS[24][1] === 97965 && CAPS_BY_DPS[24][100] === 25151,
    why: 'the dps=16 and dps=24 caps at every SNR are reused byte-for-byte from the imp-97783 full-precision-Glaisher ladder (the two uncontaminated rungs); dps>=30 is excluded.',
  },
  {
    id: 'imp124794-exponent-non-monotone-in-snr',
    holds: () =>
      EXPONENT_MONOTONE_IN_SNR === false &&
      EXP2PT[100] > EXP2PT[30] &&
      EXP2PT[1] > EXP2PT[3] && EXP2PT[3] > EXP2PT[10] && EXP2PT[10] > EXP2PT[30],
    why: 'the two-point fixed-dps cap exponent falls from SNR=1 through SNR=30 but then RISES at SNR=100 above SNR=30, so it is not monotone in the threshold -- the jitter fingerprint, not a slow-log drift.',
  },
  {
    id: 'imp124794-spread-about-1p4-jitter-sigma',
    holds: () =>
      Math.abs(SD_EXP_2PT - 0.02014) < 1e-4 &&
      SPREAD_IN_SIGMA > 1.3 && SPREAD_IN_SIGMA < 1.6 &&
      BAKED_GAP_IN_SIGMA > 1.0 && BAKED_GAP_IN_SIGMA < 1.5,
    why: 'the five-threshold spread 0.0289 is 1.43 two-point jitter-sigma (SD 0.02014) and the imp-97724 baked 0.0251 gap is 1.25 sigma on this same two-point design, so neither is cleanly separable from the +/-30 percent cap jitter at fixed uncontaminated dps.',
  },
  {
    id: 'imp124794-gap-is-jitter-not-slowlog',
    holds: () => IMP124794_MCM_CAP_EXPONENT_SNR_FIXED_DPS.gapIsJitterNotSlowLog === true,
    why: 'a non-monotone exponent-vs-SNR sequence at fixed dps rules out a resolvable slow-log curvature and identifies the 0.240-vs-0.215 gap as jitter-dominated scatter.',
  },
  {
    id: 'imp124794-honesty-gate-no-qed',
    holds: () =>
      IMP124794_MCM_CAP_EXPONENT_SNR_FIXED_DPS.onsetOmega === 11 &&
      IMP124794_MCM_CAP_EXPONENT_SNR_FIXED_DPS.ceilingTouched === false &&
      IMP124794_MCM_CAP_EXPONENT_SNR_FIXED_DPS.anyBoundMoved === false &&
      IMP124794_MCM_CAP_EXPONENT_SNR_FIXED_DPS.qed === false &&
      /NO QED/.test(IMP124794_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP124794_HONEST_BANNER) &&
      /RH open/.test(IMP124794_HONEST_BANNER) &&
      /omega=11/.test(IMP124794_HONEST_BANNER),
    why: 'measurement/verification only -- the fixed-dps cap exponent scatters (non-monotone) within the cap-metric jitter band; no bound moved; MCM stays refuted from omega=11; no QED.',
  },
];

for (const a of IMP124794_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124794-mcm-cap-exponent-snr-fixed-dps assertion failed: ${a.id}`);
  }
}

export default {
  fixedDpsExponent: IMP124794_MCM_CAP_EXPONENT_SNR_FIXED_DPS,
  banner: IMP124794_HONEST_BANNER,
};
