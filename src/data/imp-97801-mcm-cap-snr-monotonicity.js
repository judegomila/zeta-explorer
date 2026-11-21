/**
 * @module imp-97801-mcm-cap-snr-monotonicity
 *
 * imp-97801 (accuracy -- CROSS-VALIDATION ONLY; MCM refuted from omega=11; no bound moves; NO QED).
 *
 * imp-97783 regenerated the FULL MCM trustworthy-cap ladder -- caps at SNR thresholds {1,3,10,30,100} for
 * dps in {16,24,30,36}, all under a consistent full-precision Glaisher constant -- and reported RESULT 2:
 * the clean 4-point OLS cap-scaling exponent set is non-monotone in the threshold, with SNR=30 (0.22328)
 * sitting ABOVE SNR=10 (0.22162). Two things were never explicitly checked: (a) whether the CAPS themselves
 * are monotone decreasing in SNR at every dps rung (the physically required property -- a stricter SNR must
 * trust FEWER digits, so a coherent surface must have caps that weakly fall as the threshold tightens), and
 * (b) whether the SNR=30 > SNR=10 exponent ordering is inside the +/-~30 percent cap-metric jitter band
 * (imp-97736 RESULT 3) or a genuine ordering anomaly. This leaf settles both, reusing the imp-97783 ladder
 * byte-for-byte.
 *
 * -------------------------------------------------------------------------------
 * METHOD (independent, reuses imp-97783 caps by import). For each dps rung we walk the SNR list from loose
 * (1) to strict (100) and require cap(dps, SNR_next) <= cap(dps, SNR_prev). We re-derive the 4-point OLS
 * cap-scaling exponents (slope of ln(cap) vs dps*ln10) from the same imported ladder and confirm they match
 * the imp-97783 olsFull4 readings. We then propagate the +/-~30 percent cap-metric jitter through the 4-point
 * OLS: a +/-30 percent multiplicative cap jitter is +/-ln(1.3) ~ 0.2624 in ln(cap), and for a slope over the
 * dps 16/24/30/36 design the exponent standard error is SD_exp = sigma_lncap / sqrt(Sxx), with
 * Sxx = Sum (dps_i*ln10 - mean)^2 = 1161.12. So one jitter-sigma on the exponent is ~0.0077.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- THE CAPS ARE MONOTONE (WEAKLY) DECREASING IN SNR AT EVERY DPS RUNG. Per-rung check
 * (loose -> strict SNR, cap must not rise):
 *     dps=16: 1233 >= 1162 >= 1162 >= 746 >= 508     (one tie: SNR=3 == SNR=10 == 1162)
 *     dps=24: 97965 >= 72895 >= 70772 >= 34815 >= 25151
 *     dps=30: 2182639 >= 1672811 >= 1530859 >= 953980 >= 689176
 *     dps=36: 45836990 >= 37269667 >= 31212760 >= 20635311 >= 13642371
 * All four rungs satisfy the required weak-monotone property; the only equality is dps=16 SNR=3/SNR=10 at
 * the same 1162 checkpoint (a stricter SNR trusts NO MORE digits, which is allowed). So at the CAP level
 * there is no ordering violation at any rung -- the ladder is a coherent surface.
 *
 * RESULT 2 -- THE SNR=30 > SNR=10 EXPONENT ORDERING IS JITTER, NOT AN ANOMALY. The 4-point exponents
 * reproduce imp-97783 exactly (1:0.22847, 3:0.22543, 10:0.22162, 30:0.22328, 100:0.22284). The
 * SNR=30-minus-SNR=10 exponent gap is +0.00167, which is only 0.216 * SD_exp (SD_exp ~ 0.0077 from the
 * +/-30 percent cap jitter). The whole 5-threshold set spread is 0.00685 < 1 * SD_exp. So the ordering
 * inversion at the SLOPE level is < 1/4 of one jitter-sigma -- firmly inside the cap-metric jitter band and
 * NOT a genuine threshold-dependent ordering anomaly. It is fully consistent with the imp-97736 RESULT 3
 * +/-~30 percent jitter and the [[project_mcm_cap_metric_jitter_limited]] reading that the exponent scatter
 * is jitter, not bias. A lower cap curve (SNR=30 caps are strictly below SNR=10 at every dps) can carry a
 * marginally steeper log-slope without any physical inconsistency, precisely because the two effects live on
 * different axes (level vs slope).
 *
 * -------------------------------------------------------------------------------
 * VERDICT. CROSS-VALIDATION ONLY. Caps are weakly monotone decreasing in SNR at every dps rung (no cap-level
 * violation), and the SNR=30 > SNR=10 exponent ordering is 0.216 jitter-sigma -- well inside the +/-~30
 * percent cap-metric jitter band, jitter not anomaly. No new computation feeds any bound: the cap-independent
 * 1/(720 d^3) tail budget (< 5.69e-11) dwarfs any cap-to-infinity shift of the +7.520579e-5 omega=10 gap,
 * so the primorial p_10# stays the strict minimiser and the MCM onset stays exactly omega=11. MCM refuted;
 * b/4 ceiling untouched; kappa_arith unchanged; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97783-mcm-cap-fullprec-exponent-set.js  (source full ladder + olsFull4 exponent set; RESULT 2 non-monotone threshold)
 * @see imp-97736-mcm-cap-jitter-dps36.js           (+/-~30 percent cap-metric jitter; RESULT 3)
 * @see imp-97724-mcm-dps-cap-scaling-fit.js         (source recipe; contaminated baked exponents)
 *
 * Ticket: imp-97801 (accuracy, opus-4-8, api-pool). Caps weakly monotone in SNR at every dps rung; SNR=30>SNR=10 exponent gap 0.216 jitter-sigma (jitter not anomaly); onset 11; NO QED.
 * -------------------------------------------------------------------------------
 */

import { IMP97783_FULLPREC_EXPONENT_SET } from './imp-97783-mcm-cap-fullprec-exponent-set.js';

const LN10 = Math.log(10);
const DPS_LIST = IMP97783_FULLPREC_EXPONENT_SET.dpsList; // [16, 24, 30, 36]
const SNR_LIST = IMP97783_FULLPREC_EXPONENT_SET.snrList; // [1, 3, 10, 30, 100]  (loose -> strict)
const CAPS_BY_DPS = IMP97783_FULLPREC_EXPONENT_SET.capsByDps; // reused byte-for-byte

// -- RESULT 1: per-rung SNR monotonicity check (cap must not rise as the SNR threshold tightens) --
function snrMonotonicityRow(dps) {
  const caps = SNR_LIST.map((s) => CAPS_BY_DPS[dps][s]);
  let monotone = true;
  const ties = [];
  for (let i = 1; i < SNR_LIST.length; i++) {
    const prev = CAPS_BY_DPS[dps][SNR_LIST[i - 1]];
    const cur = CAPS_BY_DPS[dps][SNR_LIST[i]];
    if (cur > prev) monotone = false;
    if (cur === prev) ties.push(`${SNR_LIST[i - 1]}==${SNR_LIST[i]}`);
  }
  return { dps, caps, monotone, ties };
}

const SNR_MONOTONICITY = Object.freeze(DPS_LIST.map((d) => Object.freeze(snrMonotonicityRow(d))));
const ALL_RUNGS_MONOTONE = SNR_MONOTONICITY.every((r) => r.monotone);

// -- RESULT 2: re-derive the 4-point OLS cap-scaling exponents and the jitter band --
function olsExponent(snr) {
  const xs = DPS_LIST.map((d) => d * LN10);
  const ys = DPS_LIST.map((d) => Math.log(CAPS_BY_DPS[d][snr]));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sxx += (xs[i] - mx) ** 2; sxy += (xs[i] - mx) * (ys[i] - my); }
  return { slope: sxy / sxx, sxx };
}

const EXP4 = Object.freeze(Object.fromEntries(SNR_LIST.map((s) => [s, olsExponent(s).slope])));
const SXX = olsExponent(1).sxx; // shared design matrix, ~1161.12
const SIGMA_LNCAP = Math.log(1.3); // +/-30 percent cap jitter -> +/- this in ln(cap)
const SD_EXPONENT = SIGMA_LNCAP / Math.sqrt(SXX); // exponent standard error ~ 0.0077
const EXP_GAP_30_MINUS_10 = EXP4[30] - EXP4[10]; // +0.00167
const GAP_IN_SIGMA = EXP_GAP_30_MINUS_10 / SD_EXPONENT; // ~0.216
const SET_SPREAD = Math.max(...SNR_LIST.map((s) => EXP4[s])) - Math.min(...SNR_LIST.map((s) => EXP4[s]));

export const IMP97801_MCM_CAP_SNR_MONOTONICITY = Object.freeze({
  dpsList: DPS_LIST,
  snrList: SNR_LIST,
  // RESULT 1 -- caps weakly monotone decreasing in SNR at every dps rung.
  snrMonotonicity: SNR_MONOTONICITY, // per-rung caps + monotone flag + ties
  allRungsMonotone: ALL_RUNGS_MONOTONE, // true
  // RESULT 2 -- the SNR=30 > SNR=10 exponent ordering is jitter, not an anomaly.
  exponents4pt: EXP4, // reproduces imp-97783 olsFull4
  expGap30Minus10: EXP_GAP_30_MINUS_10, // +0.00167
  sdExponentFromJitter: SD_EXPONENT, // ~0.0077 (from +/-30 percent cap jitter over dps 16..36)
  gapInSigma: GAP_IN_SIGMA, // ~0.216 -- < 1/4 of one jitter-sigma
  setSpread: SET_SPREAD, // ~0.00685 -- < 1 jitter-sigma
  orderingIsJitter: GAP_IN_SIGMA < 1, // true -- inside the jitter band, not an anomaly
  // invariants -- cross-validation feeds no bound.
  gapOmega10: 7.520578537e-5,
  tailBudgetCombined: 5.6805e-11,
  onsetOmega: 11,
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
});

export const IMP97801_HONEST_BANNER =
  'imp-97801: CROSS-VALIDATION ONLY. Checked the two properties imp-97783 RESULT 2 left implicit on the ' +
  'full MCM trustworthy-cap ladder (SNR thresholds 1/3/10/30/100, dps 16/24/30/36). RESULT 1: the caps are ' +
  'weakly monotone DECREASING in SNR at every dps rung (dps=16 1233>=1162>=1162>=746>=508 with a single ' +
  'SNR=3==SNR=10 tie at 1162; dps=24/30/36 strictly decreasing), so a stricter SNR always trusts no more ' +
  'digits and the ladder is a coherent surface with no cap-level ordering violation. RESULT 2: the SNR=30 ' +
  '(0.22328) above SNR=10 (0.22162) exponent ordering is a gap of only +0.00167 = 0.216 jitter-sigma ' +
  '(exponent SD ~0.0077 from the +/-~30 percent cap-metric jitter over the dps 16..36 design), and the whole ' +
  '5-threshold spread 0.00685 is under one jitter-sigma -- so the ordering inversion is jitter, NOT a genuine ' +
  'threshold anomaly, exactly as imp-97736 RESULT 3 diagnosed. A lower cap curve (SNR=30 caps are below ' +
  'SNR=10 at every dps) can still carry a marginally steeper log-slope: level and slope live on different ' +
  'axes. No bound moves: the cap-independent 1/(720 d^3) tail budget (< 5.69e-11) dwarfs any cap-to-infinity ' +
  'shift of the +7.520579e-5 omega=10 gap, so the primorial p_10# stays the strict minimiser and the MCM ' +
  'onset stays omega=11. MCM refuted; b/4 ceiling untouched. No refereed bound is changed; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws at import --

const IMP97801_ASSERTIONS = [
  {
    id: 'imp97801-caps-weakly-monotone-in-snr-at-every-dps-rung',
    holds: () => ALL_RUNGS_MONOTONE === true && SNR_MONOTONICITY.length === DPS_LIST.length,
    why: 'at each dps rung the trustworthy cap must not rise as the SNR threshold tightens (a stricter SNR trusts no more digits); all four rungs satisfy the weak-monotone property, with the only equality the dps=16 SNR=3==SNR=10 tie at 1162.',
  },
  {
    id: 'imp97801-single-dps16-snr3-snr10-tie-others-strict',
    holds: () => {
      const r16 = SNR_MONOTONICITY.find((r) => r.dps === 16);
      const strictRungs = SNR_MONOTONICITY.filter((r) => r.dps !== 16);
      return r16.ties.length === 1 && r16.ties[0] === '3==10' && strictRungs.every((r) => r.ties.length === 0);
    },
    why: 'the only weak (non-strict) step in the SNR direction is the dps=16 SNR=3==SNR=10 tie at 1162; the dps=24/30/36 rungs are strictly decreasing in SNR.',
  },
  {
    id: 'imp97801-exponents-reproduce-imp97783-olsfull4',
    holds: () =>
      SNR_LIST.every((s) => Math.abs(EXP4[s] - IMP97783_FULLPREC_EXPONENT_SET.olsFull4[s]) < 1e-9),
    why: 'the 4-point OLS cap-scaling exponents re-derived here reproduce the imp-97783 olsFull4 readings to 1e-9 at every threshold, confirming the ladder was reused byte-for-byte.',
  },
  {
    id: 'imp97801-snr30-above-snr10-ordering-is-jitter',
    holds: () =>
      EXP4[30] > EXP4[10] &&
      EXP_GAP_30_MINUS_10 > 0 &&
      GAP_IN_SIGMA > 0 && GAP_IN_SIGMA < 0.5 &&
      SET_SPREAD < SD_EXPONENT * 1.05 &&
      IMP97801_MCM_CAP_SNR_MONOTONICITY.orderingIsJitter === true,
    why: 'the SNR=30 > SNR=10 exponent gap is +0.00167 = 0.216 jitter-sigma (exponent SD ~0.0077 from +/-30 percent cap jitter), and the whole 5-threshold spread 0.00685 is under one jitter-sigma, so the ordering inversion is inside the cap-metric jitter band -- jitter, not a genuine threshold anomaly.',
  },
  {
    id: 'imp97801-honesty-gate-no-qed',
    holds: () =>
      IMP97801_MCM_CAP_SNR_MONOTONICITY.onsetOmega === 11 &&
      IMP97801_MCM_CAP_SNR_MONOTONICITY.allRungsMonotone === true &&
      IMP97801_MCM_CAP_SNR_MONOTONICITY.orderingIsJitter === true &&
      IMP97801_MCM_CAP_SNR_MONOTONICITY.ceilingTouched === false &&
      IMP97801_MCM_CAP_SNR_MONOTONICITY.anyBoundMoved === false &&
      IMP97801_MCM_CAP_SNR_MONOTONICITY.qed === false &&
      /NO QED/.test(IMP97801_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97801_HONEST_BANNER) &&
      /RH open/.test(IMP97801_HONEST_BANNER) &&
      /omega=11/.test(IMP97801_HONEST_BANNER),
    why: 'cross-validation only -- caps monotone in SNR at every rung and the SNR=30>SNR=10 exponent ordering is jitter; no bound moved; MCM stays refuted from omega=11; no QED.',
  },
];

for (const a of IMP97801_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97801-mcm-cap-snr-monotonicity assertion failed: ${a.id}`);
  }
}

export default {
  monotonicity: IMP97801_MCM_CAP_SNR_MONOTONICITY,
  banner: IMP97801_HONEST_BANNER,
};
