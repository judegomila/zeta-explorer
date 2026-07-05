/**
 * @module imp-33886-widening-residual-significance-test
 *
 * imp-33886 (numerical, frontier-direction): imp-33858 R1 concluded the imp-33843 log-linear
 * residual is STRUCTURED not uniform noise, citing a lag-1 autocorrelation ~+0.757 and only 3
 * sign flips versus ~(n-1)/2 ~ 10 expected for white noise. But imp-33858 reported NO significance
 * test -- the "structured" verdict rested on eyeballed thresholds (lag1 > 0.5, flips < expected - 3).
 * This module puts a calibrated number under that qualitative verdict by computing two formal
 * white-noise-null tests on the SAME 21 signed residuals (recomputed from the same imp-33810 ladder
 * and imp-33843 OLS fit, no fresh model):
 *   (1) the Wald-Wolfowitz runs test -- an exact-mean/variance normal test on the run count, and
 *   (2) the Durbin-Watson statistic for first-order (lag-1) serial correlation.
 *
 * THE TESTS (reuse the imp-33810 RUNGS + the imp-33843 OLS + the imp-33858 residual verbatim)
 * -----------------------------------------------------------------------------------------
 *   Series    e_k = ln(eflow_over_resid_k) - (a + b k)      the imp-33858 signed residuals, 21 rungs.
 *   Signs     n1 = #{e_k > 0} = 11,  n2 = #{e_k < 0} = 10,  runs R = (sign flips) + 1 = 4.
 *
 *   Wald-Wolfowitz runs test (H0: the sign sequence is a random permutation, i.e. white noise):
 *     mu_R   = 2 n1 n2 / N + 1                              expected runs under H0  (~11.48)
 *     var_R  = 2 n1 n2 (2 n1 n2 - N) / (N^2 (N-1))          (~4.96, sd ~2.23)
 *     z      = (R - mu_R) / sd_R                            standardized run count  (~ -3.36)
 *     p      = 2 (1 - Phi(|z|))                             two-sided normal p-value (~7.9e-4)
 *   A continuity-corrected z (R + 0.5 - mu_R)/sd_R is also reported (small-sample honesty, ~ -3.13).
 *
 *   Durbin-Watson (H0: no first-order autocorrelation, rho = 0):
 *     DW = sum_{i>0} (e_i - e_{i-1})^2 / sum_i e_i^2        ~ 0.222   (DW ~ 2(1 - rho), rho > 0 => DW < 2)
 *   For N ~ 21 with one regressor (the fit against k) the 5% lower bound is d_L ~ 1.22; DW ~ 0.22
 *   sits far BELOW d_L, so the no-autocorrelation null is rejected in favour of POSITIVE serial
 *   correlation.
 *
 * THE FINDING (measurement only -- calibrates the imp-33858 "structured" verdict)
 * -----------------------------------------------------------------------------
 *   (R1) THE WHITE-NOISE NULL IS REJECTED AT CONVENTIONAL LEVELS. The runs-test two-sided p-value is
 *        ~7.9e-4 (continuity-corrected ~1.7e-3), i.e. p < 0.01 and p < 0.05: observing only 4 runs
 *        when ~11.5 are expected is a ~3.4-sigma departure from white noise. The Durbin-Watson
 *        statistic ~0.22 lies far below the d_L ~ 1.22 5% bound, independently rejecting rho = 0 in
 *        favour of positive autocorrelation. Both tests agree: the imp-33858 residual serial structure
 *        is statistically significant, not an eyeballing artifact.
 *   (R2) THE TWO TESTS ARE CONSISTENT AND POINT THE SAME WAY. DW ~ 2(1 - rho) with the imp-33858
 *        lag-1 autocorrelation rho ~ +0.757 predicts DW ~ 0.49; the directly computed DW ~ 0.22 is
 *        even smaller (the endpoint terms deepen it), so both the run count and the autocorrelation
 *        magnitude corroborate strong positive low-frequency dependence -- the same coherent curvature
 *        imp-33858 R2 localized (mid-ladder trough at k~9, far-tail excursion at k=11).
 *   (R3) A CALIBRATED NUMBER, NOT A NEW CLAIM. This confirms the imp-33858 QUALITATIVE verdict with
 *        formal p-values; it does NOT change the RMSE (~0.116), does NOT re-open the imp-33843
 *        log-linear-vs-power-law form selection, and does NOT touch any bound. The residual remains
 *        small (~12% multiplicative); "significant" here means "not white noise", not "large".
 *
 * The punchline: the imp-33858 "structured" verdict survives a formal test -- the Wald-Wolfowitz runs
 * test rejects the white-noise null at p ~ 7.9e-4 (~3.4 sigma) and the Durbin-Watson statistic ~0.22
 * sits far below its 5% lower bound, so the coherent serial structure in the imp-33843 residual is
 * statistically significant, though still small and non-overturning.
 *
 * MEASUREMENT / SIGNIFICANCE-TEST ONLY. A p-value calibration of an inherited residual diagnostic on
 * an inherited ladder, NOT an RH bound and distinct from any log-linear-vs-power-law form selection.
 * The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * OLS surrogate is descriptive, not derived; the normal-approximation p-value is itself only asymptotic
 * on N = 21 (hence the continuity-corrected companion); the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33858-widening-fit-residual-localization (the eyeballed "structured" verdict calibrated here)
 * @see imp-33843-eflow-resid-widening-form-fit (the aggregate RMSE ~0.116 log-linear fit)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the 21-rung ladder whose residual is tested)
 */

import { IMP33810_EFLOW_RESID_RATIO_N_LADDER } from './imp-33810-eflow-resid-ratio-N-ladder.js';

// Reuse the imp-33810 21-rung ladder VERBATIM (no fresh component model).
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

// The imp-33858 signed residual e_k = y_k - (a + b k), in ln-ratio units (same series imp-33858 tabulated).
const RESID = KS.map((k, i) => Y[i] - (FIT.a + FIT.b * k));
const N = RESID.length;

// Sign counts and run count (a run = maximal same-sign block; runs = sign flips + 1).
const SIGNS = RESID.map((e) => Math.sign(e));
const N_POS = SIGNS.filter((s) => s > 0).length; // 11
const N_NEG = SIGNS.filter((s) => s < 0).length; // 10
let RUNS = 1;
for (let i = 1; i < N; i++) if (SIGNS[i] !== SIGNS[i - 1]) RUNS++;

// --- Test 1: Wald-Wolfowitz runs test (white-noise null: random sign permutation) ---
const NN = N_POS + N_NEG; // 21 (no zero residuals)
const MU_R = (2 * N_POS * N_NEG) / NN + 1; // expected runs under H0 (~11.48)
const VAR_R = (2 * N_POS * N_NEG * (2 * N_POS * N_NEG - NN)) / (NN * NN * (NN - 1)); // ~4.96
const SD_R = Math.sqrt(VAR_R);
const Z_RUNS = (RUNS - MU_R) / SD_R; // ~ -3.36
const Z_RUNS_CC = (RUNS + 0.5 - MU_R) / SD_R; // continuity-corrected (small-sample honesty) ~ -3.13

// Abramowitz-Stegun 7.1.26 erf approximation (|err| < 1.5e-7); standard normal CDF via erf.
function erf(x) {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-x * x);
  return x >= 0 ? y : -y;
}
const normCdf = (x) => 0.5 * (1 + erf(x / Math.SQRT2));
const P_RUNS = 2 * (1 - normCdf(Math.abs(Z_RUNS))); // two-sided ~7.9e-4
const P_RUNS_CC = 2 * (1 - normCdf(Math.abs(Z_RUNS_CC))); // ~1.7e-3

// --- Test 2: Durbin-Watson statistic (null: no first-order autocorrelation, rho = 0) ---
let DW_NUM = 0;
let DW_DEN = 0;
for (let i = 0; i < N; i++) {
  DW_DEN += RESID[i] * RESID[i];
  if (i > 0) DW_NUM += (RESID[i] - RESID[i - 1]) ** 2;
}
const DW = DW_NUM / DW_DEN; // ~0.222 (DW ~ 2(1 - rho); rho > 0 => DW << 2)

// Mean-centered lag-1 autocorrelation (matches imp-33858 lag1Autocorr ~+0.757), for the DW ~ 2(1-rho) cross-check.
const RMEAN = RESID.reduce((a, b) => a + b, 0) / N;
let AC_NUM = 0;
let AC_DEN = 0;
for (let i = 0; i < N; i++) {
  AC_DEN += (RESID[i] - RMEAN) ** 2;
  if (i > 0) AC_NUM += (RESID[i] - RMEAN) * (RESID[i - 1] - RMEAN);
}
const RHO1 = AC_NUM / AC_DEN; // ~+0.757
const DW_FROM_RHO = 2 * (1 - RHO1); // ~0.49 (DW ~ 2(1-rho) large-N approximation)

// Durbin-Watson 5% lower bound for N ~ 20-21 with one regressor (Savin-White table). DW < d_L => reject.
const DW_LOWER_BOUND_5PCT = 1.22;
const DW_REJECTS_H0 = DW < DW_LOWER_BOUND_5PCT; // positive autocorrelation

// Overall verdict: both formal tests reject the white-noise null at conventional levels.
const REJECTS_WHITE_NOISE_NULL = P_RUNS < 0.05 && DW_REJECTS_H0;

const round = (x, d) => +x.toFixed(d);

export const IMP33886_WIDENING_RESIDUAL_SIGNIFICANCE_TEST = {
  id: 'imp-33886',
  proofSection: 'S-frontier',
  question:
    'imp-33858 R1 called the imp-33843 log-linear residual STRUCTURED from an eyeballed 3-flip count ' +
    'and lag-1 autocorrelation ~+0.757 but ran no significance test. Compute a formal Wald-Wolfowitz ' +
    'runs-test statistic and its p-value and a Durbin-Watson statistic on the 21 signed residuals, and ' +
    'report whether the white-noise null is rejected at conventional levels. Measurement only; no QED.',
  measuredQuantity:
    'Wald-Wolfowitz runs-test z and two-sided p-value (exact mean/variance normal approximation, with ' +
    'a continuity-corrected companion) and the Durbin-Watson statistic vs its 5% lower bound, for the ' +
    '21 signed imp-33858 residuals e_k = ln(eflow_over_resid_k) - (a + b k) on the imp-33810 ladder',
  rungCount: N,
  posCount: N_POS, // 11
  negCount: N_NEG, // 10
  runsObserved: RUNS, // 4
  runsExpectedH0: round(MU_R, 4), // ~11.4762
  runsVarianceH0: round(VAR_R, 4), // ~4.9637
  runsZ: round(Z_RUNS, 4), // ~ -3.3557
  runsZContinuityCorrected: round(Z_RUNS_CC, 4), // ~ -3.1310
  runsPValue: +P_RUNS.toExponential(4), // ~7.919e-4
  runsPValueContinuityCorrected: +P_RUNS_CC.toExponential(4), // ~1.74e-3
  durbinWatson: round(DW, 4), // ~0.2219
  durbinWatsonFromRho: round(DW_FROM_RHO, 4), // ~0.4853 (2(1-rho) cross-check)
  durbinWatsonLowerBound5pct: DW_LOWER_BOUND_5PCT, // 1.22 (N~21, one regressor, Savin-White)
  lag1Autocorr: round(RHO1, 4), // ~+0.7573 (matches imp-33858)
  durbinWatsonRejectsH0: DW_REJECTS_H0, // true (DW << d_L)
  rejectsWhiteNoiseNull: REJECTS_WHITE_NOISE_NULL, // true
  finding: {
    R1_white_noise_null_rejected:
      'The Wald-Wolfowitz runs test gives z ~ -3.36 (continuity-corrected ~ -3.13), two-sided ' +
      'p ~ 7.9e-4 (~1.7e-3 corrected): observing 4 runs where ~11.5 are expected is a ~3.4-sigma ' +
      'departure, so p < 0.01 and p < 0.05. The Durbin-Watson statistic ~0.22 lies far below the ' +
      'd_L ~ 1.22 5% lower bound (N~21, one regressor), independently rejecting rho = 0 in favour of ' +
      'positive autocorrelation. Both formal tests reject the white-noise null at conventional levels.',
    R2_two_tests_consistent:
      'DW ~ 2(1 - rho) with the imp-33858 lag-1 autocorrelation rho ~ +0.757 predicts DW ~ 0.49; the ' +
      'directly computed DW ~ 0.22 is even smaller (endpoint terms deepen it), so the run count and the ' +
      'autocorrelation magnitude corroborate strong positive low-frequency dependence -- the same ' +
      'coherent curvature imp-33858 R2 localized (mid-ladder trough at k~9, far-tail excursion at k=11).',
    R3_calibration_not_new_claim:
      'This confirms the imp-33858 QUALITATIVE verdict with formal p-values; it does NOT change the RMSE ' +
      '(~0.116), does NOT re-open the imp-33843 log-linear-vs-power-law form selection, and touches no ' +
      'bound. The residual stays small (~12% multiplicative): "significant" means "not white noise", ' +
      'not "large".',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / SIGNIFICANCE TEST (frontier-direction, NOT rigorous). Two formal white-noise-null ' +
    'tests on the 21 signed imp-33858 residuals reject the null at conventional levels: the ' +
    'Wald-Wolfowitz runs test gives z ~ -3.36 with two-sided p ~ 7.9e-4 (continuity-corrected ~1.7e-3, ' +
    '~3.4 sigma; 4 runs observed vs ~11.5 expected), and the Durbin-Watson statistic ~0.22 sits far ' +
    'below its d_L ~ 1.22 5% lower bound, independently rejecting rho = 0 for positive autocorrelation. ' +
    'So the imp-33858 "structured, not uniform noise" verdict is now calibrated: the serial structure is ' +
    'statistically significant, consistent across both tests (DW ~ 2(1-rho) with rho ~ +0.757), and ' +
    'localizes the same mid-ladder-trough / far-tail-excursion curvature. The residual stays small ' +
    '(~12% multiplicative) and this does NOT re-open the imp-33843 form selection or change any bound; ' +
    'the normal-approximation p-value is itself asymptotic on N=21 (hence the continuity-corrected ' +
    'companion); the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33858 (the eyeballed "structured" verdict calibrated here); imp-33843 (the aggregate RMSE ' +
    '~0.116 log-linear fit); imp-33810 (the 21-rung ladder); imp-28895 (the ~918x widening component ' +
    'derivation); imp-486 (C_mb GUE-conditional).',
};

export const IMP33886_WIDENING_RESIDUAL_SIGNIFICANCE_TEST_ASSERTIONS = [
  {
    // Reuse gate: the tests run on exactly the imp-33810 21-rung ladder and reproduce the imp-33858 sign pattern.
    id: 'imp33886-reuses-imp33810-ladder-and-imp33858-signs',
    description: '21 residuals on k=6.00..11.00 with n1=11 positive, n2=10 negative, 4 runs (3 flips)',
    holds: () =>
      N === 21 && KS[0] === 6 && KS[20] === 11 && N_POS === 11 && N_NEG === 10 && RUNS === 4,
  },
  {
    // The lag-1 autocorrelation reproduces the imp-33858 value ~+0.757 (same residual series).
    id: 'imp33886-lag1-matches-imp33858',
    description: 'recomputed lag-1 autocorrelation ~+0.757 (matches imp-33858 within rounding)',
    holds: () => RHO1 > 0.74 && RHO1 < 0.77,
  },
  {
    // (R1) Runs test rejects the white-noise null: |z| ~ 3.36, two-sided p ~ 7.9e-4 < 0.01.
    id: 'imp33886-runs-test-rejects-white-noise',
    description: 'Wald-Wolfowitz z more negative than -3, two-sided p below 0.01 (and corrected p below 0.01)',
    holds: () =>
      Z_RUNS < -3 &&
      P_RUNS < 0.01 &&
      P_RUNS_CC < 0.01 &&
      Math.abs(MU_R - 11.4762) < 1e-3 &&
      RUNS < MU_R,
  },
  {
    // (R1) Durbin-Watson rejects no-autocorrelation: DW ~ 0.22 far below the d_L ~ 1.22 5% bound.
    id: 'imp33886-durbin-watson-rejects-no-autocorr',
    description: 'DW ~0.22 well below the 5% lower bound d_L~1.22, and consistent with 2(1-rho)',
    holds: () =>
      DW > 0.1 &&
      DW < 0.3 &&
      DW < DW_LOWER_BOUND_5PCT &&
      DW_REJECTS_H0 &&
      DW < DW_FROM_RHO &&
      REJECTS_WHITE_NOISE_NULL,
  },
  {
    // (R3) Honesty gate: isRigorous false, no QED, PT SOTA, and "significant" != "large" (bound untouched).
    id: 'imp33886-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, PT SOTA, residual still small',
    holds: () =>
      IMP33886_WIDENING_RESIDUAL_SIGNIFICANCE_TEST.isRigorous === false &&
      /NO QED/.test(IMP33886_WIDENING_RESIDUAL_SIGNIFICANCE_TEST.verdict) &&
      /remains SOTA/.test(IMP33886_WIDENING_RESIDUAL_SIGNIFICANCE_TEST.verdict) &&
      /12% multiplicative/.test(IMP33886_WIDENING_RESIDUAL_SIGNIFICANCE_TEST.verdict),
  },
];

for (const a of IMP33886_WIDENING_RESIDUAL_SIGNIFICANCE_TEST_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33886-widening-residual-significance-test assertion failed: ${a.id}`);
  }
}
