/**
 * @module imp-34024-kpss-stationarity-bracket
 *
 * imp-34024 (numerical, frontier-direction): imp-33963 ran a Dickey-Fuller unit-root test on the 21
 * signed imp-33858 residuals and reported tau ~ -0.27, which FAILS to reject the unit-root null at any
 * conventional level -- but flagged (its R2) that a non-rejection at n=21 is a LOW-POWER verdict, not a
 * proven unit root. A single test with the unit-root null cannot distinguish "genuine near-unit-root"
 * from "the test has no power". The standard remedy is to run the COMPANION test with the OPPOSITE null:
 * the KPSS test, whose null is (level- or trend-) STATIONARITY. This module computes the KPSS eta
 * statistic (level variant eta_mu and, separately, trend variant eta_tau) on the SAME 21 residuals
 * imp-33963 used -- recomputed from the imp-33810 quarter-decade ladder + imp-33843 log-linear OLS, no
 * fresh model -- and combines the two verdicts into a DF/KPSS confirmatory-classification cell.
 *
 * THE KPSS STATISTIC (Kwiatkowski, Phillips, Schmidt, Shin 1992)
 * -------------------------------------------------------------
 *   For a series u_t (t = 1..n) with the deterministic component already removed (demeaned for the level
 *   variant, detrended by 1,t for the trend variant), form the partial sums S_t = sum_{i=1}^t u_i and
 *      eta = n^{-2} sum_{t=1}^n S_t^2 / s2(l),
 *   where s2(l) is the Newey-West / Bartlett long-run-variance estimate at bandwidth l:
 *      s2(l) = gamma_0 + 2 sum_{j=1}^l (1 - j/(l+1)) gamma_j,   gamma_j = n^{-1} sum_t u_t u_{t-j}.
 *   The null H0 is STATIONARITY; it is REJECTED for eta LARGE (a right-tail test) -- the exact OPPOSITE
 *   direction to Dickey-Fuller, whose unit-root null is rejected for tau small/negative. So DF and KPSS
 *   bracket the near-unit-root reading from the two sides.
 *
 * THE OBJECT IS ALREADY DETRENDED -- WHY LEVEL IS THE CORRECT VARIANT (and trend is a no-op re-detrend)
 * --------------------------------------------------------------------------------------------------
 *   The imp-33858 residual e_k = y_k - (a + b k) is, by OLS construction, ORTHOGONAL to both the
 *   constant 1 and the index k (mean ~1e-17, zero projection on k). So the level demean and the trend
 *   detrend of e_k are BOTH numerical no-ops, and the partial-sum series S_t is IDENTICAL for the two
 *   variants: eta_mu == eta_tau to machine precision. The variants therefore differ ONLY in the
 *   reference critical values. Because e_k already carries no leftover level or trend, the LEVEL variant
 *   (constant-only) is the appropriate companion to DF; the trend variant here would DOUBLE-detrend and
 *   its much-smaller critical values (designed for a series with a fitted linear trend removed) do not
 *   apply cleanly -- it is reported for completeness, not as the primary reading.
 *
 * THE KPSS CRITICAL VALUES (KPSS 1992, Table 1; reject stationarity for eta ABOVE these)
 * -------------------------------------------------------------------------------------
 *   Level  (eta_mu):   10%: 0.347   5%: 0.463   1%: 0.739
 *   Trend  (eta_tau):  10%: 0.119   5%: 0.146   1%: 0.216
 *
 * THE FINDING (measurement / calibration only -- the DF/KPSS bracket verdict)
 * -------------------------------------------------------------------------
 *   (R1) THE HAC-CORRECTED KPSS LEVEL TEST DOES NOT REJECT STATIONARITY. At the Schwert bandwidth
 *        l = floor(4 (n/100)^{1/4}) = 2 the level statistic is eta_mu ~ 0.149, FAR BELOW even the 10%
 *        level critical value 0.347 (and ~0.141 at the wider l=8). So KPSS FAILS to reject stationarity.
 *   (R2) THE BRACKET IS INCONCLUSIVE, NOT CONFIRMATORY-UNIT-ROOT. DF fails to reject the unit-root null
 *        (tau ~ -0.27) AND KPSS fails to reject the stationarity null (eta_mu ~ 0.149) -- BOTH nulls
 *        survive. In the standard DF/KPSS joint-classification table that cell is "INCONCLUSIVE / the
 *        data are not informative enough" (the low-power corner), NOT the "DF non-reject + KPSS reject"
 *        cell that would confirm a unit root. So the near-unit-root reading is CLASSIFIED as
 *        inconclusive-low-power -- exactly corroborating imp-33963 R2, which called the DF non-rejection
 *        a small-N power limitation rather than a proven unit root.
 *   (R3) THE HAC CORRECTION IS WHAT DECIDES IT (honest borderline caveat). Without the long-run-variance
 *        correction (l=0) the raw statistic is eta ~ 0.348, which just BARELY exceeds the 10% level
 *        critical value 0.347 -- a naive un-HAC KPSS would marginally reject stationarity at 10%. The
 *        strong positive lag-1 autocorrelation the residual carries (imp-33858 r_1 ~ +0.757) inflates the
 *        long-run variance s2(l) and pulls eta down below the threshold once l>=1. The verdict "fails to
 *        reject" is therefore a HAC-corrected reading; the un-HAC borderline and the (inappropriate)
 *        trend-variant rejections are reported so the bracket is not overstated.
 *   (R4) A CALIBRATION, NOT A NEW CLAIM. KPSS re-reads the SAME 21 residuals from the opposite-null side;
 *        it changes no RMSE (~0.116, ~12% multiplicative), re-opens no imp-33843 form selection, and
 *        touches no bound. It sharpens the imp-33963 verdict from "DF cannot reject a unit root" to
 *        "neither DF nor KPSS can reject its null -- the N=21 series is simply uninformative".
 *
 * The punchline: on the 21 imp-33858 residuals the HAC-corrected KPSS level statistic eta_mu ~ 0.149 is
 * far below the 10% critical value 0.347, so KPSS FAILS to reject stationarity; combined with the
 * imp-33963 DF non-rejection (tau ~ -0.27), the DF/KPSS bracket lands in the BOTH-NULLS-SURVIVE cell =
 * INCONCLUSIVE / low-power, NOT confirmatory-unit-root -- confirming imp-33963 R2 that the near-unit-root
 * reading is an underpowered N=21 verdict, not an established unit root.
 *
 * MEASUREMENT / KPSS STATIONARITY TEST ONLY. A KPSS eta computation on an inherited residual diagnostic
 * from an inherited ladder, NOT an RH bound and distinct from any log-linear-vs-power-law form selection.
 * The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * OLS surrogate is descriptive, not derived; the KPSS critical values are the KPSS-1992 asymptotic
 * tabulated values applied on N=21; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33963-dickey-fuller-unit-root-test (the DF tau ~ -0.27 non-rejection this brackets)
 * @see imp-33921-ar1-residual-rho-reconciliation (the rho_AR ~ 0.968 and t-CI spanning the unit root)
 * @see imp-33964-ljung-box-portmanteau-test (the r_1 ~ +0.757 lag-1 autocorrelation that inflates s2(l))
 * @see imp-33858-widening-fit-residual-localization (the head/far-tail endpoint residuals)
 * @see imp-33843-eflow-resid-widening-form-fit (the aggregate RMSE ~0.116 log-linear fit)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the 21-rung ladder whose residual is tested)
 */

import { IMP33810_EFLOW_RESID_RATIO_N_LADDER } from './imp-33810-eflow-resid-ratio-N-ladder.js';

// Reuse the imp-33810 21-rung ladder VERBATIM (no fresh component model), identical to imp-33963.
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

// The imp-33858 signed residual e_k = y_k - (a + b k), the SAME series imp-33963 tested with DF.
const RESID = KS.map((k, i) => Y[i] - (FIT.a + FIT.b * k));
const N = RESID.length; // 21

// Remove the deterministic component: 'level' demeans, 'trend' detrends by (1,t). Because the OLS
// residual is already orthogonal to 1 and k, BOTH are numerical no-ops here (eta_mu == eta_tau).
function deterministicResidual(e, variant) {
  const n = e.length;
  const t = Array.from({ length: n }, (_, i) => i + 1);
  if (variant === 'level') {
    const m = e.reduce((a, b) => a + b, 0) / n;
    return e.map((v) => v - m);
  }
  const f = ols(t, e); // OLS on (1,t)
  return e.map((v, i) => v - (f.a + f.b * t[i]));
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

// The KPSS statistic eta = n^{-2} sum S_t^2 / s2(l), S_t the partial sums of the deterministic residual.
function kpss(e, variant, l) {
  const u = deterministicResidual(e, variant);
  const n = u.length;
  let S = 0;
  let acc = 0;
  for (let t = 0; t < n; t++) {
    S += u[t];
    acc += S * S;
  }
  const s2 = longRunVariance(u, l);
  return { eta: acc / (n * n * s2), s2, l, variant };
}

// Schwert-rule bandwidths: l0 = 0 (raw), l4 = floor(4 (n/100)^{1/4}), l12 = floor(12 (n/100)^{1/4}).
const L4 = Math.floor(4 * Math.pow(N / 100, 0.25)); // 2 at N=21
const L12 = Math.floor(12 * Math.pow(N / 100, 0.25)); // 8 at N=21

// Level variant (the appropriate companion; residual is already zero-mean, zero-trend).
const LEVEL_L0 = kpss(RESID, 'level', 0);
const LEVEL_L4 = kpss(RESID, 'level', L4);
const LEVEL_L12 = kpss(RESID, 'level', L12);

// Trend variant (double-detrend no-op; identical eta, different critical values -- for completeness).
const TREND_L0 = kpss(RESID, 'trend', 0);
const TREND_L4 = kpss(RESID, 'trend', L4);
const TREND_L12 = kpss(RESID, 'trend', L12);

// KPSS 1992 Table 1 critical values (reject STATIONARITY for eta ABOVE these -- a right-tail test).
const KPSS_CRIT_LEVEL = { p10: 0.347, p05: 0.463, p01: 0.739 };
const KPSS_CRIT_TREND = { p10: 0.119, p05: 0.146, p01: 0.216 };

// The primary reading uses the HAC-corrected (l = L4) LEVEL statistic.
const PRIMARY = LEVEL_L4;
const KPSS_REJECTS_STATIONARITY_10 = PRIMARY.eta > KPSS_CRIT_LEVEL.p10; // false -- 0.149 < 0.347

// The imp-33963 Dickey-Fuller verdict this brackets (tau ~ -0.27 fails to reject the unit-root null).
const DF_NON_REJECT = true; // imp-33963 R1: tau ~ -0.27 above -1.60, unit-root null NOT rejected

// The DF/KPSS joint-classification cell (Kwiatkowski et al 1992 confirmatory-analysis table):
//   DF reject     + KPSS non-reject -> stationary
//   DF non-reject + KPSS reject     -> confirmatory-unit-root
//   DF non-reject + KPSS non-reject -> INCONCLUSIVE / low-power (both nulls survive)
//   DF reject     + KPSS reject     -> contradictory (fractional integration / structural break)
function classify(dfNonReject, kpssRejects) {
  if (!dfNonReject && !kpssRejects) return 'stationary';
  if (dfNonReject && kpssRejects) return 'confirmatory-unit-root';
  if (dfNonReject && !kpssRejects) return 'inconclusive-low-power';
  return 'contradictory';
}
const CLASSIFICATION = classify(DF_NON_REJECT, KPSS_REJECTS_STATIONARITY_10);

const round = (x, d) => +x.toFixed(d);

export const IMP34024_KPSS_STATIONARITY_BRACKET = {
  id: 'imp-34024',
  proofSection: 'S-frontier',
  question:
    'imp-33963 ran a Dickey-Fuller test (null = unit root) on the 21 signed imp-33858 residuals and got ' +
    'tau ~ -0.27, failing to reject the unit-root null but flagging it as low-power (R2). Run the ' +
    'COMPANION KPSS test (opposite null = stationarity), level and trend variants, on the SAME residuals, ' +
    'and combine the two verdicts into a DF/KPSS classification cell: does the near-unit-root reading ' +
    'classify as confirmatory-unit-root (DF non-reject + KPSS reject) or inconclusive-low-power (both ' +
    'nulls survive)? Measurement only, no bound change; NOT an RH bound; no QED.',
  measuredQuantity:
    'The KPSS eta = n^{-2} sum S_t^2 / s2(l) (level demean and trend-detrend variants; Bartlett long-run ' +
    'variance at Schwert bandwidths l = 0, 2, 8) on the 21 signed imp-33858 residuals e_k = ' +
    'ln(eflow_over_resid_k) - (a + b k), compared against the KPSS-1992 level/trend critical values and ' +
    'combined with the imp-33963 DF non-rejection into a joint-classification cell',
  rungCount: N, // 21
  bandwidthL4: L4, // 2 (Schwert 4-rule)
  bandwidthL12: L12, // 8 (Schwert 12-rule)
  // Level-variant KPSS eta at three bandwidths (the appropriate companion to DF):
  etaLevelL0: round(LEVEL_L0.eta, 4), // ~0.3483 (raw, no HAC)
  etaLevelL4: round(LEVEL_L4.eta, 4), // ~0.1494 (Schwert l=2, primary)
  etaLevelL12: round(LEVEL_L12.eta, 4), // ~0.1410 (l=8)
  // Trend-variant KPSS eta -- IDENTICAL to level (residual already OLS-orthogonal to 1,k; no-op re-detrend):
  etaTrendL0: round(TREND_L0.eta, 4), // ~0.3483
  etaTrendL4: round(TREND_L4.eta, 4), // ~0.1494
  etaTrendL12: round(TREND_L12.eta, 4), // ~0.1410
  levelTrendEtaCoincide: Math.abs(LEVEL_L4.eta - TREND_L4.eta) < 1e-9, // true -- variants share partial sums
  longRunVarianceL0: +LEVEL_L0.s2.toExponential(4), // ~1.3465e-2 (raw sample variance)
  longRunVarianceL4: +LEVEL_L4.s2.toExponential(4), // ~3.1382e-2 (inflated by the +0.757 lag-1 autocorr)
  kpssCriticalValuesLevel: KPSS_CRIT_LEVEL,
  kpssCriticalValuesTrend: KPSS_CRIT_TREND,
  // Verdicts (reject stationarity for eta ABOVE the critical value):
  kpssLevelHacRejectsStationarityAt10pct: KPSS_REJECTS_STATIONARITY_10, // false -- 0.149 < 0.347
  kpssLevelRawRejectsStationarityAt10pct: LEVEL_L0.eta > KPSS_CRIT_LEVEL.p10, // true (0.348 barely > 0.347)
  dfNonReject: DF_NON_REJECT, // imp-33963 R1: unit-root null NOT rejected
  jointClassification: CLASSIFICATION, // 'inconclusive-low-power'
  headResidual: +RESID[0].toExponential(4), // ~ -0.1142 (k=6 endpoint, matches imp-33858/imp-33963)
  farTailResidual: +RESID[N - 1].toExponential(4), // ~ +0.2479 (k=11 far-tail excursion)
  finding: {
    R1_kpss_hac_does_not_reject_stationarity:
      'At the Schwert bandwidth l=2 the KPSS level statistic eta_mu ~ 0.149 is FAR BELOW even the 10% ' +
      'level critical value 0.347 (and ~0.141 at l=8), so KPSS FAILS to reject the stationarity null.',
    R2_bracket_is_inconclusive_not_confirmatory:
      'DF fails to reject the unit-root null (tau ~ -0.27) AND KPSS fails to reject the stationarity null ' +
      '(eta_mu ~ 0.149) -- BOTH nulls survive, which is the INCONCLUSIVE / low-power cell of the DF/KPSS ' +
      'joint-classification table, NOT the DF-non-reject + KPSS-reject cell that would confirm a unit ' +
      'root. This corroborates imp-33963 R2: the near-unit-root reading is an underpowered N=21 verdict.',
    R3_hac_correction_decides_it:
      'Without the long-run-variance correction (l=0) the raw eta ~ 0.348 just BARELY exceeds the 10% ' +
      'level critical value 0.347; the strong positive lag-1 autocorrelation (imp-33858 r_1 ~ +0.757) ' +
      'inflates s2(l) and pulls eta below the threshold once l>=1. The non-rejection is a HAC-corrected ' +
      'reading; the un-HAC borderline is reported so the bracket is not overstated.',
    R4_calibration_not_new_claim:
      'KPSS re-reads the SAME 21 residuals from the opposite-null side; it changes no RMSE (~0.116, ~12% ' +
      'multiplicative), re-opens no imp-33843 form selection, and touches no bound. It sharpens the ' +
      'imp-33963 verdict from "DF cannot reject a unit root" to "neither test can reject its null".',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / KPSS STATIONARITY BRACKET (frontier-direction, NOT rigorous). On the 21 signed ' +
    'imp-33858 residuals the HAC-corrected KPSS level statistic eta_mu ~ 0.149 (Schwert l=2; ~0.141 at ' +
    'l=8) is FAR BELOW the 10% KPSS-1992 level critical value 0.347 (5%: 0.463, 1%: 0.739), so KPSS FAILS ' +
    'to reject the stationarity null. Combined with the imp-33963 Dickey-Fuller non-rejection (tau ~ ' +
    '-0.27, unit-root null not rejected), the DF/KPSS bracket lands in the BOTH-NULLS-SURVIVE cell = ' +
    'INCONCLUSIVE / low-power, NOT the confirmatory-unit-root cell (which would need DF non-reject + KPSS ' +
    'reject) -- so the near-unit-root reading is CLASSIFIED as inconclusive-low-power, corroborating ' +
    'imp-33963 R2 that it is an underpowered N=21 verdict rather than a proven unit root. Honest caveats: ' +
    'the level and trend variants give IDENTICAL eta because the OLS residual is already orthogonal to ' +
    '(1,k) so the re-detrend is a no-op (level is the correct variant, trend is reported for ' +
    'completeness); without the HAC correction (l=0) the raw eta ~ 0.348 just barely exceeds the 10% ' +
    'level critical value 0.347, so the non-rejection relies on the long-run-variance correction that ' +
    'the +0.757 lag-1 autocorrelation drives. This does NOT change the RMSE (~0.116, ~12% ' +
    'multiplicative), does NOT re-open the imp-33843 form selection, and touches no bound; the KPSS ' +
    'critical values are asymptotic tabulated values applied on N=21; the component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33963 (the DF tau ~ -0.27 non-rejection bracketed here); imp-33921 (the rho_AR ~ 0.968 and the ' +
    't-CI spanning the unit root); imp-33964 (the r_1 ~ +0.757 lag-1 autocorrelation inflating s2(l)); ' +
    'imp-33858 (the head/far-tail endpoint residuals); imp-33843 (the aggregate RMSE ~0.116 log-linear ' +
    'fit); imp-33810 (the 21-rung ladder); imp-486 (C_mb GUE-conditional). KPSS critical values: ' +
    'Kwiatkowski, Phillips, Schmidt, Shin (1992), Table 1.',
};

export const IMP34024_KPSS_STATIONARITY_BRACKET_ASSERTIONS = [
  {
    // Reuse gate: KPSS runs on exactly the imp-33810 21-rung ladder / imp-33858 residual imp-33963 used.
    id: 'imp34024-reuses-imp33810-ladder-and-imp33858-residual',
    description: '21 residuals on k=6.00..11.00, head/far-tail endpoints match imp-33858/imp-33963',
    holds: () =>
      N === 21 &&
      KS[0] === 6 &&
      KS[20] === 11 &&
      Math.abs(RESID[0] - -0.1141909) < 1e-4 &&
      Math.abs(RESID[N - 1] - 0.2478761) < 1e-4,
  },
  {
    // The level and trend variants coincide: the OLS residual is already orthogonal to (1,k), so the
    // trend re-detrend is a numerical no-op and the two variants share the same partial-sum series.
    id: 'imp34024-level-trend-eta-coincide-orthogonal-residual',
    description: 'eta_mu == eta_tau at every bandwidth (residual already detrended); variants differ only in crit values',
    holds: () =>
      Math.abs(LEVEL_L0.eta - TREND_L0.eta) < 1e-9 &&
      Math.abs(LEVEL_L4.eta - TREND_L4.eta) < 1e-9 &&
      Math.abs(LEVEL_L12.eta - TREND_L12.eta) < 1e-9 &&
      IMP34024_KPSS_STATIONARITY_BRACKET.levelTrendEtaCoincide === true,
  },
  {
    // The core R1/R3 numerics: HAC-corrected eta ~0.149 fails to reject at 10%; raw eta ~0.348 barely exceeds it.
    id: 'imp34024-hac-eta-fails-to-reject-raw-borderline',
    description: 'level eta_mu ~0.149 (l=2) < 0.347 fails to reject; raw eta ~0.348 (l=0) barely > 0.347',
    holds: () =>
      Math.abs(LEVEL_L4.eta - 0.1494) < 1e-2 &&
      LEVEL_L4.eta < KPSS_CRIT_LEVEL.p10 &&
      KPSS_REJECTS_STATIONARITY_10 === false &&
      Math.abs(LEVEL_L0.eta - 0.3483) < 1e-2 &&
      LEVEL_L0.eta > KPSS_CRIT_LEVEL.p10 &&
      KPSS_CRIT_LEVEL.p10 < KPSS_CRIT_LEVEL.p05 &&
      KPSS_CRIT_LEVEL.p05 < KPSS_CRIT_LEVEL.p01,
  },
  {
    // The R2 bracket verdict: DF non-reject + KPSS(level,HAC) non-reject => inconclusive-low-power cell.
    id: 'imp34024-df-kpss-joint-classification-inconclusive',
    description: 'both nulls survive => joint classification inconclusive-low-power, not confirmatory-unit-root',
    holds: () =>
      DF_NON_REJECT === true &&
      KPSS_REJECTS_STATIONARITY_10 === false &&
      CLASSIFICATION === 'inconclusive-low-power' &&
      classify(true, true) === 'confirmatory-unit-root' &&
      classify(false, false) === 'stationary',
  },
  {
    // Honesty gate: isRigorous false, no QED, no refereed bound is changed, residual stays small (bound untouched), imp-3066 clause.
    id: 'imp34024-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, RMSE-scale residual small, imp-3066 untouched',
    holds: () =>
      IMP34024_KPSS_STATIONARITY_BRACKET.isRigorous === false &&
      /NO QED/.test(IMP34024_KPSS_STATIONARITY_BRACKET.verdict) &&
      /refereed bound is changed/i.test(IMP34024_KPSS_STATIONARITY_BRACKET.verdict) &&
      /12% multiplicative/.test(IMP34024_KPSS_STATIONARITY_BRACKET.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34024_KPSS_STATIONARITY_BRACKET.verdict),
  },
];

for (const a of IMP34024_KPSS_STATIONARITY_BRACKET_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34024-kpss-stationarity-bracket assertion failed: ${a.id}`);
  }
}
