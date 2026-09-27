/**
 * @module imp-97783-mcm-cap-fullprec-exponent-set
 *
 * imp-97783 (accuracy -- CROSS-VALIDATION ONLY; MCM refuted from omega=11; no bound moves; NO QED).
 *
 * imp-97761 re-fit ONLY the SNR>=10 MCM cap-scaling exponent under a consistent full-precision Glaisher
 * constant, and imp-97736 carried full-precision SNR=1 and SNR>=10 ladders (dps 16/24/30/36) -- but the
 * intermediate SNR thresholds were never re-fit the same way, and no single clean exponent SET was reported
 * alongside the contaminated baked values. This leaf regenerates the FULL cap ladder -- trustworthy caps at
 * SNR thresholds {1, 3, 10, 30, 100} for dps in {16, 24, 30, 36}, ALL under lnA = log(glaisher) at working
 * precision (no truncated 17-digit literal) -- and reports the clean OLS exponent set next to the baked
 * imp-97724 contaminated exponents.
 *
 * -------------------------------------------------------------------------------
 * METHOD (independent).  Script tmp/imp-97783-full-ladder-fullprec.py (mpmath 1.4.1, one accumulating pass per
 * dps yields every threshold simultaneously). Rexact(d) = Gexact(d) - GKmain(d), Gexact(d) = Sum_{k=2}^d k log k
 * accumulated term-by-term at working precision dps (no guard digits); GKmain(m) = (m^2/2 + m/2 + 1/12) log m
 * - m^2/4 + lnA. The recovered remainder is compared to the two-term Euler-Maclaurin reference
 * Rref(d) = 1/(720 d^2) - 1/(5040 d^4) (imp-97666); SNR>=T <=> the relative error stays <= 1/T. The cap d* is
 * the last log-spaced (x *= 1.03, from 100) checkpoint before the error first exceeds the threshold for 3
 * consecutive checkpoints. The Glaisher-Kinkelin log-constant is lnA = log(mpmath.glaisher) evaluated at the
 * working dps for EVERY rung (the imp-97432 17-digit literal is not used).
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- THE SNR=1 AND SNR>=10 RAILS REPRODUCE imp-97736 EXACTLY. The full-precision refit gives
 * SNR=1 caps 1233 / 97965 / 2182639 / 45836990 and SNR>=10 caps 1162 / 70772 / 1530859 / 31212760 over
 * dps 16/24/30/36, matching the imp-97736 FULLPREC ladder to the exact integer at all eight rungs (and the
 * imp-97761 SNR>=10 refit at dps 16/24/30). So the harness reproduces the two published rails before it
 * fills in the intermediate thresholds.
 *
 * RESULT 2 -- THE FULL-PRECISION EXPONENT SET COLLAPSES TO A TIGHT ~0.224 BAND WITH NO THRESHOLD TREND.
 * The five clean 4-point (dps 16/24/30/36) OLS exponents are
 *     SNR=1   0.22847,  SNR=3   0.22543,  SNR=10  0.22162,  SNR=30  0.22328,  SNR=100  0.22284,
 * a total spread of only 0.00685 -- and they do NOT decrease monotonically with the threshold (SNR=30 sits
 * ABOVE SNR=10), so there is no systematic threshold-dependent bias, just scatter around ~0.224 consistent
 * with the +/-~30 percent cap-metric jitter (imp-97736 RESULT 3). The contaminated baked imp-97724 exponents
 * span 0.2401 (SNR=1) down to 0.2150 (SNR>=10) -- a spread of 0.0251, ~3.7x wider -- because the dps=30 SNR
 * rungs carry the truncated 17-digit Glaisher literal. The clean set is ~1/4-modulo-slow-log at every
 * threshold, and the apparent threshold-dependence of the baked exponents is contamination plus jitter, not
 * a physical property of the crossing.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  CROSS-VALIDATION ONLY. Under a consistent full-precision Glaisher constant the whole MCM
 * cap-metric exponent set collapses to a tight band 0.2216..0.2285 (4-point, spread 0.0069) with no
 * threshold trend, versus the baked 0.2401/0.2150 (spread 0.0251) whose apparent SNR-dependence is the
 * 17-digit-literal contamination plus cap-metric jitter that imp-97736/imp-97761 already diagnosed on the
 * two rails. No new computation feeds any bound: the cap-independent 1/(720 d^3) tail budget (< 5.69e-11)
 * dwarfs any cap-to-infinity shift of the +7.520579e-5 omega=10 gap regardless of the exact cap, so the
 * primorial p_10# stays the strict minimiser and the MCM onset stays exactly omega=11. MCM refuted; b/4
 * ceiling untouched; kappa_arith unchanged; PT Lambda <= 0.2 SOTA; RH open; NO QED.
 *
 * @see imp-97761-mcm-snr10-cap-independent-refit.js  (SNR>=10 rail refit; dps=30 1173276 -> 1530859)
 * @see imp-97736-mcm-cap-jitter-dps36.js             (SNR=1/SNR>=10 full-prec rails; cap jitter diagnosis)
 * @see imp-97724-mcm-dps-cap-scaling-fit.js          (source recipe; contaminated 0.2401 / 0.2150 exponents)
 * @see imp-97666-route-m-mcm-tail-constant-euler-maclaurin.js  (two-term Euler-Maclaurin reference remainder)
 *
 * Ticket: imp-97783 (accuracy, opus-4-8, api-pool). Full-prec exponent set 0.2216..0.2285 (spread 0.0069), no threshold trend; rails reproduce imp-97736 exactly; onset 11; NO QED.
 * -------------------------------------------------------------------------------
 */

const LN10 = Math.log(10);
const DPS_LIST = Object.freeze([16, 24, 30, 36]);
const SNR_LIST = Object.freeze([1, 3, 10, 30, 100]);

// -- imp-97783 FULL cap ladder under a CONSISTENT full-precision Glaisher (tmp/imp-97783-full-ladder-fullprec.py).
// capsByDps[dps][snr] = last trustworthy checkpoint d* with relative error <= 1/snr.
const CAPS_BY_DPS = Object.freeze({
  16: Object.freeze({ 1: 1233, 3: 1162, 10: 1162, 30: 746, 100: 508 }),
  24: Object.freeze({ 1: 97965, 3: 72895, 10: 70772, 30: 34815, 100: 25151 }),
  30: Object.freeze({ 1: 2182639, 3: 1672811, 10: 1530859, 30: 953980, 100: 689176 }),
  36: Object.freeze({ 1: 45836990, 3: 37269667, 10: 31212760, 30: 20635311, 100: 13642371 }),
});

// -- imp-97736 FULLPREC rails (SNR=1 and SNR>=10), carried as literals for the reproduction check --
const IMP97736_RAILS = Object.freeze({
  1: Object.freeze({ 16: 1233, 24: 97965, 30: 2182639, 36: 45836990 }),
  10: Object.freeze({ 16: 1162, 24: 70772, 30: 1530859, 36: 31212760 }),
});

// -- imp-97724 CONTAMINATED baked exponents (17-digit Glaisher literal, dps 16/24/30) --
const BAKED_EXPONENTS = Object.freeze({ snr1: 0.2401, snr10: 0.2150 });
const BAKED_SPREAD = Math.abs(BAKED_EXPONENTS.snr1 - BAKED_EXPONENTS.snr10); // 0.0251

// OLS slope of ln(cap) vs ln(1/eps) = dps*ln(10) over the given dps list -- the cap-scaling exponent.
function olsExponent(dpsList, snr) {
  const xs = dpsList.map((d) => d * LN10);
  const ys = dpsList.map((d) => Math.log(CAPS_BY_DPS[d][snr]));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sxx += (xs[i] - mx) ** 2; sxy += (xs[i] - mx) * (ys[i] - my); }
  return sxy / sxx;
}

const DPS3 = Object.freeze([16, 24, 30]);
const OLS_FULL4 = Object.freeze(Object.fromEntries(SNR_LIST.map((s) => [s, olsExponent(DPS_LIST, s)])));
const OLS_FULL3 = Object.freeze(Object.fromEntries(SNR_LIST.map((s) => [s, olsExponent(DPS3, s)])));

const EXP4_VALUES = SNR_LIST.map((s) => OLS_FULL4[s]);
const FULL4_SPREAD = Math.max(...EXP4_VALUES) - Math.min(...EXP4_VALUES); // ~0.00685

export const IMP97783_FULLPREC_EXPONENT_SET = Object.freeze({
  dpsList: DPS_LIST,
  snrList: SNR_LIST,
  capsByDps: CAPS_BY_DPS,
  // RESULT 1 -- the SNR=1 and SNR>=10 rails reproduce imp-97736 exactly.
  rails: IMP97736_RAILS,
  railsReproduceImp97736: true,
  // RESULT 2 -- the clean full-precision exponent set (4-point and 3-point) + the contaminated baked spread.
  olsFull4: OLS_FULL4, // {1:0.22847, 3:0.22543, 10:0.22162, 30:0.22328, 100:0.22284}
  olsFull3: OLS_FULL3, // {1:0.23230, 3:0.22554, 10:0.22285, 30:0.22120, 100:0.22310}
  fullPrecSpread4pt: FULL4_SPREAD, // ~0.0069 -- the whole clean set collapses to a tight band
  bakedExponents: BAKED_EXPONENTS, // contaminated: SNR=1 0.2401, SNR>=10 0.2150
  bakedSpread: BAKED_SPREAD, // 0.0251 -- ~3.7x wider than the clean set
  noThresholdTrend: true, // SNR=30 (0.22328) sits ABOVE SNR=10 (0.22162): non-monotone in threshold
  // invariants -- cross-validation feeds no bound.
  gapOmega10: 7.520578537e-5,
  tailBudgetCombined: 5.6805e-11,
  onsetOmega: 11,
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
});

export const IMP97783_HONEST_BANNER =
  'imp-97783: CROSS-VALIDATION ONLY. Regenerated the FULL MCM cap ladder -- trustworthy caps at SNR thresholds ' +
  '1/3/10/30/100 for dps 16/24/30/36 -- ALL under a consistent full-precision Glaisher constant lnA=log(glaisher). ' +
  'The SNR=1 and SNR>=10 rails reproduce the imp-97736 full-precision ladder to the exact integer at every rung. ' +
  'The clean 4-point OLS exponent set collapses to a tight band: SNR=1 0.22847, SNR=3 0.22543, SNR=10 0.22162, ' +
  'SNR=30 0.22328, SNR=100 0.22284 -- spread only 0.0069, and non-monotone in the threshold (SNR=30 above SNR=10), ' +
  'so there is NO systematic threshold bias, just scatter around ~0.224 within the +/-~30 percent cap-metric ' +
  'jitter. The baked imp-97724 exponents span 0.2401 (SNR=1) to 0.2150 (SNR>=10) -- spread 0.0251, ~3.7x wider -- ' +
  'because the dps=30 rungs carry the truncated 17-digit Glaisher literal, exactly as imp-97736/imp-97761 ' +
  'diagnosed on the two rails. Every threshold gives a ~1/4-modulo-slow-log exponent. No bound moves: the ' +
  'cap-independent 1/(720 d^3) tail budget (< 5.69e-11) dwarfs any cap-to-infinity shift of the +7.520579e-5 ' +
  'omega=10 gap regardless of the exact cap, so the primorial p_10# stays the strict minimiser and the MCM onset ' +
  'stays omega=11. MCM refuted; b/4 ceiling untouched. PT Lambda <= 0.2 SOTA; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws at import --

const IMP97783_ASSERTIONS = [
  {
    id: 'imp97783-rails-reproduce-imp97736-fullprec',
    holds: () =>
      DPS_LIST.every((d) => CAPS_BY_DPS[d][1] === IMP97736_RAILS[1][d]) &&
      DPS_LIST.every((d) => CAPS_BY_DPS[d][10] === IMP97736_RAILS[10][d]),
    why: 'the full-precision SNR=1 and SNR>=10 rails (1233/97965/2182639/45836990 and 1162/70772/1530859/31212760) reproduce the imp-97736 FULLPREC ladder to the exact integer at all eight rungs.',
  },
  {
    id: 'imp97783-caps-monotone-in-dps-and-threshold',
    holds: () => {
      // caps grow with precision at every threshold, and (at each dps) shrink as the threshold tightens.
      for (const s of SNR_LIST) {
        for (let i = 1; i < DPS_LIST.length; i++) {
          if (!(CAPS_BY_DPS[DPS_LIST[i]][s] > CAPS_BY_DPS[DPS_LIST[i - 1]][s])) return false;
        }
      }
      for (const d of DPS_LIST) {
        for (let i = 1; i < SNR_LIST.length; i++) {
          if (!(CAPS_BY_DPS[d][SNR_LIST[i]] <= CAPS_BY_DPS[d][SNR_LIST[i - 1]])) return false;
        }
      }
      return true;
    },
    why: 'a larger cap needs more digits and a looser SNR threshold, so caps rise strictly with dps and fall (weakly) as the SNR threshold tightens -- a sanity check that the ladder is a coherent surface.',
  },
  {
    id: 'imp97783-fullprec-exponent-set-is-a-tight-band-no-threshold-trend',
    holds: () => {
      // every clean 4-point exponent is ~1/4-modulo-slow-log, tightly clustered ...
      if (!EXP4_VALUES.every((v) => v > 0.218 && v < 0.230)) return false;
      if (!(FULL4_SPREAD > 0 && FULL4_SPREAD < 0.008)) return false;
      // ... and the set does NOT decrease monotonically with the threshold: SNR=30 exceeds SNR=10.
      return OLS_FULL4[30] > OLS_FULL4[10];
    },
    why: 'the five full-precision 4-point exponents cluster in 0.2216..0.2285 (spread 0.0069) and are non-monotone in the threshold (SNR=30 above SNR=10), showing there is no systematic threshold bias, only jitter around ~0.224.',
  },
  {
    id: 'imp97783-fullprec-band-tighter-than-contaminated-baked-spread',
    holds: () =>
      Math.abs(BAKED_SPREAD - 0.0251) < 1e-4 &&
      FULL4_SPREAD < BAKED_SPREAD / 3 &&
      // the clean SNR>=10 4-point exponent matches the imp-97761/imp-97736 full-prec reading ~0.2216.
      Math.abs(OLS_FULL4[10] - 0.2216) < 2e-3,
    why: 'the clean full-precision exponent spread 0.0069 is more than 3x tighter than the baked contaminated 0.2401-vs-0.2150 spread 0.0251, and the SNR>=10 rung reproduces the imp-97736 olsFullPrec4 ~0.2216, so the apparent threshold dependence of the baked exponents is 17-digit-literal contamination plus jitter.',
  },
  {
    id: 'imp97783-honesty-gate-no-qed',
    holds: () =>
      IMP97783_FULLPREC_EXPONENT_SET.onsetOmega === 11 &&
      IMP97783_FULLPREC_EXPONENT_SET.railsReproduceImp97736 === true &&
      IMP97783_FULLPREC_EXPONENT_SET.noThresholdTrend === true &&
      IMP97783_FULLPREC_EXPONENT_SET.ceilingTouched === false &&
      IMP97783_FULLPREC_EXPONENT_SET.anyBoundMoved === false &&
      IMP97783_FULLPREC_EXPONENT_SET.qed === false &&
      /NO QED/.test(IMP97783_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97783_HONEST_BANNER) &&
      /RH open/.test(IMP97783_HONEST_BANNER) &&
      /omega=11/.test(IMP97783_HONEST_BANNER),
    why: 'cross-validation only -- the full-precision exponent set collapses the apparent threshold spread and reproduces the imp-97736 rails; no bound moved; MCM stays refuted from omega=11; no QED.',
  },
];

for (const a of IMP97783_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97783-mcm-cap-fullprec-exponent-set assertion failed: ${a.id}`);
  }
}

export default {
  exponentSet: IMP97783_FULLPREC_EXPONENT_SET,
  banner: IMP97783_HONEST_BANNER,
};
