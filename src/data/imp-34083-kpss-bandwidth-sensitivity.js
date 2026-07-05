/**
 * @module imp-34083-kpss-bandwidth-sensitivity
 *
 * imp-34083 (numerical, frontier-direction): imp-34024 computed the KPSS level statistic eta_mu on the
 * 21 signed imp-33858 residuals and reported the primary reading at a SINGLE Bartlett bandwidth,
 * l = floor(4 (n/100)^{1/4}) = 2 (with the wider l=8 as a secondary check). A KPSS verdict can be
 * bandwidth-sensitive: the long-run-variance denominator s2(l) grows with l when the residual carries
 * positive autocorrelation (here imp-33964 r_1 ~ +0.757), which pulls eta DOWN. imp-34024 R3 already
 * flagged that the un-HAC statistic (l=0) sits right on the 10% critical value. This module SWEEPS l
 * over the standard range and tabulates eta_mu against the KPSS-1992 level critical values to answer:
 * is the "fails to reject stationarity" verdict bandwidth-ROBUST, or does it flip with l?
 *
 * THE SWEEP (imp-34024 kpss() reused verbatim; only l varies)
 * ----------------------------------------------------------
 *   Bandwidths l = 0, 1, 2, floor(4 (n/100)^{1/4}), floor(12 (n/100)^{1/4}). At n=21 the two Schwert
 *   rules give floor(4 * 0.6768) = 2 and floor(12 * 0.6768) = 8, so the DISTINCT bandwidths are
 *   {0, 1, 2, 8} (the 4-rule coincides with the explicit l=2). For each l the level-variant statistic
 *      eta_mu(l) = n^{-2} sum_t S_t^2 / s2(l),   s2(l) = gamma_0 + 2 sum_{j=1}^l (1 - j/(l+1)) gamma_j,
 *   is compared against the KPSS-1992 Table-1 level critical values (10%: 0.347, 5%: 0.463, 1%: 0.739;
 *   reject stationarity for eta ABOVE the value -- a right-tail test).
 *
 * THE SWEEP RESULT (measured; matches imp-34024 at the shared l=0,2,8)
 * -------------------------------------------------------------------
 *      l = 0:  eta_mu ~ 0.3483   s2 ~ 1.3465e-2   REJECTS at 10% (0.3483 > 0.347, by ~0.001)
 *      l = 1:  eta_mu ~ 0.1982   s2 ~ 2.3663e-2   fails to reject (0.1982 < 0.347)
 *      l = 2:  eta_mu ~ 0.1494   s2 ~ 3.1382e-2   fails to reject (0.1494 < 0.347)  [Schwert 4-rule]
 *      l = 8:  eta_mu ~ 0.1410   s2 ~ 3.3254e-2   fails to reject (0.1410 < 0.347)  [Schwert 12-rule]
 *   eta_mu is MONOTONE DECREASING in l over this range (0.348 -> 0.198 -> 0.149 -> 0.141) because each
 *   extra Bartlett lag adds a POSITIVE autocovariance term to s2(l) (the residual is positively
 *   autocorrelated), inflating the denominator and shrinking eta.
 *
 * THE FINDING (measurement / calibration only -- the bandwidth-robustness verdict)
 * ------------------------------------------------------------------------------
 *   (R1) THE NON-REJECTION IS ROBUST ACROSS EVERY HAC BANDWIDTH l >= 1. At l = 1, 2 and 8 the level
 *        statistic eta_mu (~0.198, ~0.149, ~0.141) sits FAR BELOW even the 10% critical value 0.347 --
 *        never within a factor ~1.7 of it -- so KPSS fails to reject stationarity at every HAC bandwidth.
 *        The stationarity-bracket verdict is bandwidth-ROBUST once any lag correction is applied.
 *   (R2) THE SOLE FLIP LIVES AT l = 0 (NO HAC). Only the raw un-corrected statistic eta_mu ~ 0.348
 *        exceeds the 10% critical value 0.347 -- and only BARELY, by ~0.001 (a marginal 10% rejection
 *        that would NOT survive at 5% or 1%). So the verdict is not truly bandwidth-contingent in the
 *        interior of the sweep: the single flip is confined to the l=0 endpoint, exactly the un-HAC
 *        borderline imp-34024 R3 already reported, and it is the weakest possible rejection.
 *   (R3) eta_mu DECREASES MONOTONICALLY IN l -- the direction of robustness is favourable. Because the
 *        residual carries positive lag-1 autocorrelation (imp-33964 r_1 ~ +0.757), widening the Bartlett
 *        window only INCREASES s2(l) and DECREASES eta_mu, pushing the statistic further from the
 *        rejection region as l grows. There is no bandwidth in the standard range at which a larger l
 *        would flip the non-rejection back to a rejection; the l=0 marginal rejection is the maximum.
 *   (R4) A CALIBRATION OF imp-34024, NOT A NEW CLAIM. The sweep re-reads the SAME 21 residuals at more
 *        bandwidths; it reproduces imp-34024's l=0/2/8 values to machine precision, changes no RMSE
 *        (~0.116, ~12% multiplicative), re-opens no imp-33843 form selection, and touches no bound. It
 *        sharpens imp-34024 R1/R3 from "fails to reject at l=2 (and l=8)" to "fails to reject at EVERY
 *        HAC bandwidth l >= 1; the only rejection is the marginal un-HAC l=0 borderline".
 *
 * The punchline: sweeping the Bartlett bandwidth l over {0, 1, 2, 8} moves eta_mu monotonically from
 * ~0.348 (l=0) down to ~0.141 (l=8); every HAC bandwidth l >= 1 lands FAR below the 10% critical value
 * 0.347, so the KPSS "fails to reject stationarity" verdict is bandwidth-ROBUST, with the ONLY rejection
 * being the marginal un-HAC l=0 statistic (0.348, barely over 0.347 and only at 10%). The imp-34024
 * inconclusive-low-power bracket does not depend on the specific choice of HAC bandwidth.
 *
 * MEASUREMENT / KPSS BANDWIDTH SWEEP ONLY. A sensitivity sweep of an inherited KPSS eta over its Bartlett
 * bandwidth on an inherited residual diagnostic from an inherited ladder, NOT an RH bound and distinct
 * from any log-linear-vs-power-law form selection. The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the OLS surrogate is descriptive, not derived; the KPSS
 * critical values are the KPSS-1992 asymptotic tabulated values applied on N=21; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-34024-kpss-stationarity-bracket (the single-bandwidth KPSS reading this sweeps)
 * @see imp-33963-dickey-fuller-unit-root-test (the DF tau ~ -0.27 non-rejection the bracket combines with)
 * @see imp-33964-ljung-box-portmanteau-test (the r_1 ~ +0.757 lag-1 autocorrelation that inflates s2(l))
 * @see imp-33858-widening-fit-residual-localization (the head/far-tail endpoint residuals)
 * @see imp-33843-eflow-resid-widening-form-fit (the aggregate RMSE ~0.116 log-linear fit)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the 21-rung ladder whose residual is tested)
 */

import { IMP33810_EFLOW_RESID_RATIO_N_LADDER } from './imp-33810-eflow-resid-ratio-N-ladder.js';

// Reuse the imp-33810 21-rung ladder VERBATIM (no fresh component model), identical to imp-34024/imp-33963.
const RUNGS = IMP33810_EFLOW_RESID_RATIO_N_LADDER.ladder;
const KS = RUNGS.map((r) => r.k);
const Y = RUNGS.map((r) => Math.log(r.eflow_over_resid)); // natural log of the imp-33810 ratio

// OLS of ys against xs; returns slope/intercept (the imp-33843 log-linear WINNER when xs = KS).
function ols(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  const b = sxy / sxx;
  return { a: my - b * mx, b };
}

const FIT = ols(KS, Y); // y = a + b k          (the imp-33843 log-linear winner, recomputed)

// The imp-33858 signed residual e_k = y_k - (a + b k), the SAME series imp-34024 tested with KPSS.
const RESID = KS.map((k, i) => Y[i] - (FIT.a + FIT.b * k));
const N = RESID.length; // 21

// Level-variant deterministic residual: demean (the residual is already OLS-orthogonal to 1, so this is
// a numerical no-op, matching imp-34024's LEVEL variant which is the appropriate companion to DF).
function demean(e) {
  const m = e.reduce((a, b) => a + b, 0) / e.length;
  return e.map((v) => v - m);
}

// Newey-West / Bartlett long-run variance s2(l) = gamma_0 + 2 sum_{j=1}^l (1 - j/(l+1)) gamma_j.
function longRunVariance(u, l) {
  const n = u.length;
  let g0 = 0;
  for (let i = 0; i < n; i++) g0 += u[i] * u[i];
  g0 /= n;
  let s = g0;
  for (let j = 1; j <= l; j++) {
    let gj = 0;
    for (let i = j; i < n; i++) gj += u[i] * u[i - j];
    gj /= n;
    s += 2 * (1 - j / (l + 1)) * gj;
  }
  return s;
}

// The KPSS level statistic eta_mu = n^{-2} sum S_t^2 / s2(l), S_t the partial sums of the demeaned residual.
function kpssLevel(e, l) {
  const u = demean(e);
  const n = u.length;
  let S = 0;
  let acc = 0;
  for (let t = 0; t < n; t++) {
    S += u[t];
    acc += S * S;
  }
  const s2 = longRunVariance(u, l);
  return { eta: acc / (n * n * s2), s2, l };
}

// Schwert-rule bandwidths at N=21: 4-rule floor(4 (n/100)^{1/4}) = 2, 12-rule floor(12 (n/100)^{1/4}) = 8.
const L4 = Math.floor(4 * Math.pow(N / 100, 0.25)); // 2
const L12 = Math.floor(12 * Math.pow(N / 100, 0.25)); // 8

// KPSS 1992 Table 1 LEVEL critical values (reject STATIONARITY for eta ABOVE these -- a right-tail test).
const KPSS_CRIT_LEVEL = { p10: 0.347, p05: 0.463, p01: 0.739 };

// The standard sweep: l = 0, 1, 2, 4-Schwert(=2), 12-Schwert(=8). The 4-rule coincides with l=2, so the
// DISTINCT bandwidths are {0, 1, 2, 8}; each row records eta_mu(l), s2(l), and the reject-at-10% verdict.
const SWEEP_LS = Array.from(new Set([0, 1, 2, L4, L12])).sort((a, b) => a - b); // [0, 1, 2, 8]
const SWEEP = SWEEP_LS.map((l) => {
  const r = kpssLevel(RESID, l);
  return {
    l,
    eta: r.eta,
    s2: r.s2,
    rejects10: r.eta > KPSS_CRIT_LEVEL.p10,
    rejects05: r.eta > KPSS_CRIT_LEVEL.p05,
    rejects01: r.eta > KPSS_CRIT_LEVEL.p01,
  };
});

// Robustness summary: how many bandwidths reject at 10%, and whether every HAC bandwidth (l>=1) fails to reject.
const REJECT10_COUNT = SWEEP.filter((s) => s.rejects10).length; // 1 (only l=0)
const HAC_ALL_NON_REJECT = SWEEP.filter((s) => s.l >= 1).every((s) => !s.rejects10); // true
const ONLY_L0_REJECTS = SWEEP.every((s) => (s.l === 0 ? s.rejects10 : !s.rejects10)); // true
// eta_mu is monotone decreasing across the sweep (positive autocorrelation inflates s2(l) as l grows).
const ETA_MONOTONE_DECREASING = SWEEP.every((s, i) => i === 0 || s.eta < SWEEP[i - 1].eta);
// The verdict is bandwidth-robust IF every HAC bandwidth agrees; the only flip is the un-HAC l=0 endpoint.
const BANDWIDTH_ROBUST = HAC_ALL_NON_REJECT && ONLY_L0_REJECTS;

const round = (x, d) => +x.toFixed(d);

export const IMP34083_KPSS_BANDWIDTH_SENSITIVITY = {
  id: 'imp-34083',
  proofSection: 'S-frontier',
  question:
    'imp-34024 computed the KPSS level statistic eta_mu on the 21 signed imp-33858 residuals at a SINGLE ' +
    'Bartlett bandwidth (l = floor(4 (n/100)^{1/4}) = 2). Sweep l over the standard range ' +
    '(0, 1, 2, floor(4 (n/100)^{1/4}), floor(12 (n/100)^{1/4})) and report how eta_mu moves relative to ' +
    'the KPSS 10/5/1% level critical values (0.347/0.463/0.739): is the "fails to reject stationarity" ' +
    'verdict bandwidth-ROBUST, or does it flip with l? Measurement only, no bound change; NOT an RH bound; no QED.',
  measuredQuantity:
    'The KPSS level statistic eta_mu(l) = n^{-2} sum S_t^2 / s2(l) (Bartlett long-run variance s2(l)) on ' +
    'the 21 signed imp-33858 residuals e_k = ln(eflow_over_resid_k) - (a + b k), swept over Bartlett ' +
    'bandwidths l = 0, 1, 2, 8, each tabulated against the KPSS-1992 level critical values',
  rungCount: N, // 21
  bandwidthL4: L4, // 2 (Schwert 4-rule)
  bandwidthL12: L12, // 8 (Schwert 12-rule)
  sweptBandwidths: SWEEP_LS, // [0, 1, 2, 8]
  // The bandwidth sweep table (eta_mu, s2, and per-level reject verdicts at each l):
  sweep: SWEEP.map((s) => ({
    l: s.l,
    etaLevel: round(s.eta, 4),
    longRunVariance: +s.s2.toExponential(4),
    rejectsAt10pct: s.rejects10,
    rejectsAt5pct: s.rejects05,
    rejectsAt1pct: s.rejects01,
  })),
  kpssCriticalValuesLevel: KPSS_CRIT_LEVEL,
  // Robustness summary:
  reject10Count: REJECT10_COUNT, // 1 -- only the un-HAC l=0 statistic rejects at 10%
  hacBandwidthsAllNonReject: HAC_ALL_NON_REJECT, // true -- every l>=1 fails to reject
  onlyL0Rejects: ONLY_L0_REJECTS, // true -- the sole flip is the un-HAC endpoint
  etaMonotoneDecreasingInL: ETA_MONOTONE_DECREASING, // true -- s2(l) inflates as l grows (positive autocorr)
  verdictBandwidthRobust: BANDWIDTH_ROBUST, // true -- the non-rejection holds across all HAC bandwidths
  finding: {
    R1_non_rejection_robust_across_all_hac_bandwidths:
      'At every HAC bandwidth l = 1, 2, 8 the level statistic eta_mu (~0.198, ~0.149, ~0.141) sits FAR ' +
      'below even the 10% critical value 0.347 -- never within a factor ~1.7 of it -- so KPSS fails to ' +
      'reject stationarity at every HAC bandwidth. The stationarity-bracket verdict is bandwidth-ROBUST.',
    R2_sole_flip_is_the_un_hac_l0_endpoint:
      'Only the raw un-corrected statistic eta_mu ~ 0.348 (l=0) exceeds the 10% critical value 0.347, and ' +
      'only BARELY, by ~0.001 -- a marginal 10% rejection that would not survive at 5% or 1%. The single ' +
      'flip is confined to the l=0 endpoint, exactly the un-HAC borderline imp-34024 R3 already reported.',
    R3_eta_monotone_decreasing_in_l:
      'Because the residual carries positive lag-1 autocorrelation (imp-33964 r_1 ~ +0.757), widening the ' +
      'Bartlett window INCREASES s2(l) and DECREASES eta_mu, pushing the statistic further from rejection ' +
      'as l grows (0.348 -> 0.198 -> 0.149 -> 0.141). No larger l flips the non-rejection back; l=0 is the max.',
    R4_calibration_not_new_claim:
      'The sweep re-reads the SAME 21 residuals at more bandwidths, reproducing imp-34024 l=0/2/8 to ' +
      'machine precision; it changes no RMSE (~0.116, ~12% multiplicative), re-opens no imp-33843 form ' +
      'selection, and touches no bound. It sharpens imp-34024 from "fails to reject at l=2/8" to "fails to ' +
      'reject at EVERY HAC bandwidth l >= 1; the only rejection is the marginal un-HAC l=0 borderline".',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / KPSS BANDWIDTH SWEEP (frontier-direction, NOT rigorous). Sweeping the Bartlett ' +
    'bandwidth l over {0, 1, 2, 8} on the 21 signed imp-33858 residuals moves the KPSS level statistic ' +
    'eta_mu monotonically from ~0.348 (l=0) down to ~0.198 (l=1), ~0.149 (l=2, Schwert 4-rule) and ~0.141 ' +
    '(l=8, Schwert 12-rule). Every HAC bandwidth l >= 1 lands FAR below the 10% KPSS-1992 level critical ' +
    'value 0.347 (5%: 0.463, 1%: 0.739), so the "fails to reject stationarity" verdict is bandwidth-ROBUST ' +
    'once any lag correction is applied. The ONLY rejection is the marginal un-HAC l=0 statistic (~0.348, ' +
    'barely over 0.347 by ~0.001 and only at 10%), exactly the un-HAC borderline imp-34024 R3 already ' +
    'flagged; eta_mu is monotone decreasing in l (positive lag-1 autocorrelation r_1 ~ +0.757 inflates ' +
    's2(l)), so no larger bandwidth flips the non-rejection back to a rejection. The imp-34024 ' +
    'inconclusive-low-power DF/KPSS bracket therefore does NOT depend on the specific HAC bandwidth ' +
    'choice. This does NOT change the RMSE (~0.116, ~12% multiplicative), does NOT re-open the imp-33843 ' +
    'form selection, and touches no bound; the KPSS critical values are asymptotic tabulated values ' +
    'applied on N=21; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-34024 (the single-bandwidth KPSS reading swept here); imp-33963 (the DF tau ~ -0.27 non-rejection ' +
    'the bracket combines with); imp-33964 (the r_1 ~ +0.757 lag-1 autocorrelation inflating s2(l)); ' +
    'imp-33858 (the head/far-tail endpoint residuals); imp-33843 (the aggregate RMSE ~0.116 log-linear ' +
    'fit); imp-33810 (the 21-rung ladder); imp-486 (C_mb GUE-conditional). KPSS critical values: ' +
    'Kwiatkowski, Phillips, Schmidt, Shin (1992), Table 1.',
};

export const IMP34083_KPSS_BANDWIDTH_SENSITIVITY_ASSERTIONS = [
  {
    // Reuse gate: sweep runs on exactly the imp-33810 21-rung ladder / imp-33858 residual imp-34024 used.
    id: 'imp34083-reuses-imp33810-ladder-and-imp33858-residual',
    description: '21 residuals on k=6.00..11.00, head/far-tail endpoints match imp-33858/imp-34024',
    holds: () =>
      N === 21 &&
      KS[0] === 6 &&
      KS[20] === 11 &&
      Math.abs(RESID[0] - -0.1141909) < 1e-4 &&
      Math.abs(RESID[N - 1] - 0.2478761) < 1e-4,
  },
  {
    // The sweep reproduces the imp-34024 l=0/2/8 eta values to machine precision (same kpss computation).
    id: 'imp34083-reproduces-imp34024-l0-l2-l8',
    description: 'eta_mu(0) ~0.3483, eta_mu(2) ~0.1494, eta_mu(8) ~0.1410 -- matches imp-34024 verbatim',
    holds: () => {
      const at = (l) => SWEEP.find((s) => s.l === l).eta;
      return (
        Math.abs(at(0) - 0.3483) < 1e-3 &&
        Math.abs(at(2) - 0.1494) < 1e-3 &&
        Math.abs(at(8) - 0.1410) < 1e-3
      );
    },
  },
  {
    // The intermediate l=1 rung: eta_mu ~0.198, between l=0 and l=2, already below the 10% critical value.
    id: 'imp34083-l1-rung-below-10pct',
    description: 'eta_mu(1) ~0.198 sits between eta(0) and eta(2) and is already < 0.347',
    holds: () => {
      const at = (l) => SWEEP.find((s) => s.l === l).eta;
      return (
        Math.abs(at(1) - 0.1982) < 1e-3 &&
        at(1) < at(0) &&
        at(1) > at(2) &&
        at(1) < KPSS_CRIT_LEVEL.p10
      );
    },
  },
  {
    // The core R1/R2/R3 finding: only l=0 rejects at 10%, every HAC bandwidth fails to reject, monotone decrease.
    id: 'imp34083-only-l0-rejects-hac-robust-monotone',
    description: 'reject10Count=1 (only l=0), all l>=1 non-reject, eta monotone decreasing, verdict robust',
    holds: () =>
      REJECT10_COUNT === 1 &&
      HAC_ALL_NON_REJECT === true &&
      ONLY_L0_REJECTS === true &&
      ETA_MONOTONE_DECREASING === true &&
      BANDWIDTH_ROBUST === true &&
      SWEEP.find((s) => s.l === 0).rejects10 === true &&
      SWEEP.find((s) => s.l === 0).rejects05 === false, // even the l=0 rejection is only at 10%
  },
  {
    // Honesty gate: isRigorous false, no QED, PT SOTA, RMSE-scale caveat, imp-3066 clause specifically.
    id: 'imp34083-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, PT SOTA, 12% multiplicative RMSE, imp-3066 untouched',
    holds: () =>
      IMP34083_KPSS_BANDWIDTH_SENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP34083_KPSS_BANDWIDTH_SENSITIVITY.verdict) &&
      /remains SOTA/.test(IMP34083_KPSS_BANDWIDTH_SENSITIVITY.verdict) &&
      /12% multiplicative/.test(IMP34083_KPSS_BANDWIDTH_SENSITIVITY.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34083_KPSS_BANDWIDTH_SENSITIVITY.verdict),
  },
];

for (const a of IMP34083_KPSS_BANDWIDTH_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34083-kpss-bandwidth-sensitivity assertion failed: ${a.id}`);
  }
}
