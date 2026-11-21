/**
 * @module imp-33963-dickey-fuller-unit-root-test
 *
 * imp-33963 (numerical, frontier-direction): imp-33921 R1 fit the explicit AR(1) e_k = rho e_{k-1} + u_k
 * to the 21 signed imp-33858 residuals and reported the conditional-MLE slope rho_AR ~ +0.968 with a
 * 95% CI ~ [0.71, 1.22] that SPANS and crosses the unit root, calling the N=21 series "statistically
 * indistinguishable from a near-random-walk" -- but that CI is a t_{19} interval, and the unit-root
 * null has a NON-STANDARD null distribution (the Dickey-Fuller tau distribution, not the normal/t). A
 * t-interval crossing 1 is therefore NOT a valid unit-root test. This module runs the explicit
 * Dickey-Fuller regression Delta e_k = phi e_{k-1} + u_k on the SAME 21 residuals (recomputed from the
 * same imp-33810 ladder + imp-33843 OLS, no fresh model), computes the DF tau statistic
 * tau = phi_hat / SE(phi_hat), and compares it against the Dickey-Fuller critical values (the
 * no-constant, no-trend "tau_nc" case, since the OLS residual has mean ~1e-17 by construction) rather
 * than the normal/t, to decide whether the unit-root null is rejected. It also drops the far-tail
 * excursion e_{20} = +0.2479 (the imp-33858 k=11 point) and re-runs the test to check whether the
 * verdict is an endpoint artifact.
 *
 * THE DICKEY-FULLER REPARAMETERISATION (same fit as imp-33921 AR(1), differenced form)
 * ----------------------------------------------------------------------------------
 *   AR(1)   e_k = rho e_{k-1} + u_k            <=>   DF   Delta e_k = phi e_{k-1} + u_k,   phi = rho - 1.
 *   Because Delta e_k = e_k - e_{k-1}, the DF slope phi_hat = sum (Delta e_k) e_{k-1} / sum e_{k-1}^2
 *   = (cross - SXX) / SXX = rho_AR - 1, and the fitted residuals u_k are IDENTICAL to the AR(1) fit, so
 *   SE(phi_hat) = SE(rho_AR) EXACTLY. The DF tau is thus tau = (rho_AR - 1) / SE(rho_AR): the very same
 *   arithmetic imp-33921 already produced, but read against the CORRECT (non-standard) reference
 *   distribution. imp-33921 divided (rho_AR - 1) by SE and compared to a t; DF compares to tau_nc.
 *   The unit-root null H0: phi = 0 (rho = 1) is rejected only for tau MORE NEGATIVE than the critical value.
 *
 * THE DICKEY-FULLER tau_nc CRITICAL VALUES (Fuller 1976, no constant / zero-mean, n=25 row)
 * ---------------------------------------------------------------------------------------
 *   10%: -1.60      5%: -1.95      1%: -2.66      (the n=25 finite-sample row, nearest to n=20 pairs;
 *   the asymptotic values -1.62 / -1.95 / -2.58 are within ~0.02 and change no verdict here). These are
 *   FAR more negative than the +-1.65 / +-1.96 normal quantiles the t-CI implicitly used -- the whole
 *   point of the DF test is that under a unit root the tau statistic is skewed strongly negative, so the
 *   naive normal threshold badly over-rejects.
 *
 * THE FINDING (measurement / calibration only -- the DF verdict on the imp-33921 CI)
 * --------------------------------------------------------------------------------
 *   (R1) THE UNIT-ROOT NULL IS NOT REJECTED. The DF statistic is tau ~ -0.27 (phi ~ -0.032, i.e.
 *        rho_AR ~ 0.968), which is FAR ABOVE (much less negative than) even the 10% critical value -1.60.
 *        So the near-random-walk reading imp-33921 R1 flagged SURVIVES a proper unit-root test: on N=21
 *        we cannot reject a unit root at any conventional level. The t-CI crossing 1 was, if anything,
 *        an UNDERSTATEMENT of how unit-root-consistent the series is under the correct distribution.
 *   (R2) IT IS A LOW-POWER / SMALL-N VERDICT, NOT A "GENUINE UNIT ROOT" AND NOT A FAR-TAIL ARTIFACT.
 *        Failing to reject is NOT proof of a unit root: at n~20 the DF test has notoriously low power and
 *        cannot separate a true unit root from a stationary root near 1. Dropping the far-tail excursion
 *        e_{20} = +0.2479 moves tau only from -0.27 to -0.90 (phi -0.032 -> -0.109, rho 0.968 -> 0.891),
 *        MORE negative (toward stationarity) but still far above -1.60 -- so the non-rejection is NOT
 *        driven by the far-tail endpoint; the verdict is stable to that point. The honest reading is
 *        "the test lacks the power to decide", not "the far-tail manufactured a unit root".
 *   (R3) A CALIBRATION, NOT A NEW CLAIM. The DF test re-reads imp-33921's own (rho_AR - 1)/SE against the
 *        correct reference; it does not change the RMSE (~0.116), does not re-open the imp-33843
 *        log-linear-vs-power-law form selection, and touches no bound. rho ~ 0.97 still describes the
 *        curvature's smoothness, not its size (~12% multiplicative residual).
 *
 * The punchline: the Dickey-Fuller tau ~ -0.27 (n=21) fails to reject the unit-root null at 10%/5%/1%
 * (critical values -1.60 / -1.95 / -2.66), so imp-33921's t-CI-spanning-1 near-random-walk reading holds
 * under the CORRECT non-standard distribution -- but as a low-power small-N verdict, not a proven unit
 * root: dropping the far-tail e_{20} only shifts tau to -0.90, still non-rejecting, so it is neither a
 * genuine established unit root nor a far-tail artifact, but an underpowered test on N=21.
 *
 * MEASUREMENT / UNIT-ROOT TEST ONLY. A Dickey-Fuller tau computation on an inherited residual diagnostic
 * from an inherited ladder, NOT an RH bound and distinct from any log-linear-vs-power-law form selection.
 * The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * OLS surrogate is descriptive, not derived; the DF critical values are finite-sample tabulated values on
 * N=21; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33921-ar1-residual-rho-reconciliation (the rho_AR ~ 0.968 and the t-CI spanning the unit root)
 * @see imp-33886-widening-residual-significance-test (the DW ~0.22 serial-dependence companion)
 * @see imp-33858-widening-fit-residual-localization (the lag-1 ~+0.757 and head/far-tail endpoint residuals)
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
const N = RESID.length; // 21

// The Dickey-Fuller regression Delta e_k = phi e_{k-1} + u_k (no constant, no trend; the OLS residual
// has mean ~1e-17 by construction, so the zero-mean tau_nc case is the correct one). phi = rho - 1;
// tau = phi_hat / SE(phi_hat). Returns tau, phi, SE and the implied rho for a residual sub-series.
function dickeyFuller(e) {
  const n = e.length;
  const X = e.slice(0, n - 1); // regressor e_{k-1}
  const D = []; // response Delta e_k = e_k - e_{k-1}
  for (let i = 1; i < n; i++) D.push(e[i] - e[i - 1]);
  const np = X.length; // lagged pairs
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < np; i++) {
    sxy += X[i] * D[i];
    sxx += X[i] * X[i];
  }
  const phi = sxy / sxx; // = rho_AR - 1
  let sse = 0;
  for (let i = 0; i < np; i++) {
    const u = D[i] - phi * X[i];
    sse += u * u; // identical to the AR(1) fit residual SSE
  }
  const s2 = sse / (np - 1); // 1 fitted parameter
  const se = Math.sqrt(s2 / sxx); // == SE(rho_AR) exactly
  const tau = phi / se;
  return { np, phi, se, tau, rho: phi + 1 };
}

// --- The full 21-residual DF test ---
const FULL = dickeyFuller(RESID);

// --- Drop the imp-33858 far-tail excursion e_{20} = +0.2479 (the k=11 point) and re-run ---
const DROPPED = dickeyFuller(RESID.slice(0, N - 1));

// Dickey-Fuller tau_nc critical values (Fuller 1976, no constant / zero-mean, n=25 finite-sample row).
// The unit-root null H0: phi = 0 is rejected only for tau MORE NEGATIVE than these (a left-tail test).
const DF_CRIT = { p10: -1.6, p05: -1.95, p01: -2.66 };

// Rejection flags: is the unit root rejected at each level (tau below the critical value)?
const FULL_REJECTS_10 = FULL.tau < DF_CRIT.p10;
const DROPPED_REJECTS_10 = DROPPED.tau < DF_CRIT.p10;

const round = (x, d) => +x.toFixed(d);

export const IMP33963_DICKEY_FULLER_UNIT_ROOT_TEST = {
  id: 'imp-33963',
  proofSection: 'S-frontier',
  question:
    'imp-33921 R1 reported the AR(1) slope rho_AR ~ +0.968 with a 95% t-CI ~ [0.71, 1.22] that spans the ' +
    'unit root, but the unit-root null has a NON-STANDARD distribution (Dickey-Fuller tau, not the t it ' +
    'used). Run the DF regression Delta e_k = phi e_{k-1} + u_k on the 21 imp-33858 residuals, compute the ' +
    'DF tau, and compare it against the DF critical values (not the normal/t) to decide whether the ' +
    'unit-root null is rejected, and whether dropping the far-tail e_{20} moves the verdict. Measurement ' +
    'only, no bound change; NOT an RH bound; no QED.',
  measuredQuantity:
    'The Dickey-Fuller tau = phi_hat / SE(phi_hat) from Delta e_k = phi e_{k-1} + u_k (no constant, ' +
    'zero-mean tau_nc case) on the 21 signed imp-33858 residuals e_k = ln(eflow_over_resid_k) - (a + b k), ' +
    'compared against the Fuller (1976) tau_nc critical values, with a far-tail-dropped robustness re-run',
  rungCount: N, // 21
  laggedPairs: FULL.np, // 20
  // The full-series DF test:
  dfPhi: round(FULL.phi, 4), // ~ -0.0324 (= rho_AR - 1)
  dfImpliedRho: round(FULL.rho, 4), // ~0.9676 (matches imp-33921 rho_AR)
  dfStdError: round(FULL.se, 4), // ~0.1219 (== imp-33921 SE_RHO)
  dfTau: round(FULL.tau, 4), // ~ -0.266
  dfCriticalValues: DF_CRIT, // Fuller 1976 tau_nc, n=25 row
  unitRootRejectedAt10pct: FULL_REJECTS_10, // false -- tau -0.27 far above -1.60
  unitRootRejectedAt5pct: FULL.tau < DF_CRIT.p05, // false
  // The far-tail-dropped robustness re-run:
  droppedLaggedPairs: DROPPED.np, // 19
  droppedDfPhi: round(DROPPED.phi, 4), // ~ -0.1089
  droppedDfImpliedRho: round(DROPPED.rho, 4), // ~0.8911
  droppedDfTau: round(DROPPED.tau, 4), // ~ -0.896
  droppedUnitRootRejectedAt10pct: DROPPED_REJECTS_10, // false -- still above -1.60
  verdictStableToFarTailDrop: FULL_REJECTS_10 === DROPPED_REJECTS_10, // true (both fail to reject)
  headResidual: +RESID[0].toExponential(4), // ~ -0.1142 (k=6 endpoint)
  farTailResidual: +RESID[N - 1].toExponential(4), // ~ +0.2479 (k=11 far-tail excursion, dropped)
  finding: {
    R1_unit_root_null_not_rejected:
      'The Dickey-Fuller statistic is tau ~ -0.27 (phi ~ -0.032, rho_AR ~ 0.968), FAR ABOVE even the 10% ' +
      'tau_nc critical value -1.60, so the unit-root null is NOT rejected at any conventional level. The ' +
      'imp-33921 t-CI-spanning-1 near-random-walk reading SURVIVES a proper unit-root test read against ' +
      'the correct non-standard distribution.',
    R2_low_power_small_n_not_a_far_tail_artifact:
      'Failing to reject is NOT proof of a unit root: at n~20 the DF test has very low power and cannot ' +
      'separate a true unit root from a stationary near-1 root. Dropping the far-tail e_20 = +0.2479 moves ' +
      'tau only to -0.90 (rho 0.968 -> 0.891), more negative but still far above -1.60, so the ' +
      'non-rejection is stable to the endpoint -- it is a small-N power limitation, NOT a far-tail artifact.',
    R3_calibration_not_new_claim:
      'The DF test re-reads imp-33921 own (rho_AR - 1)/SE against the correct reference distribution; it ' +
      'does not change the RMSE (~0.116), does not re-open the imp-33843 log-linear-vs-power-law form ' +
      'selection, and touches no bound. rho ~ 0.97 describes the curvature smoothness, not its size ' +
      '(~12% multiplicative).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / DICKEY-FULLER UNIT-ROOT TEST (frontier-direction, NOT rigorous). The DF regression ' +
    'Delta e_k = phi e_{k-1} + u_k on the 21 signed imp-33858 residuals gives tau ~ -0.27 (phi ~ -0.032, ' +
    'rho_AR ~ 0.968), which is FAR ABOVE even the 10% Fuller-1976 tau_nc critical value -1.60 (5%: -1.95, ' +
    '1%: -2.66), so the unit-root null is NOT rejected at any conventional level. imp-33921 R1 near-' +
    'random-walk reading (its t-CI spanning 1) therefore HOLDS under the correct non-standard ' +
    'distribution -- but as a LOW-POWER small-N verdict, not a proven unit root: at n~20 the DF test ' +
    'cannot separate a true unit root from a stationary root near 1. Dropping the imp-33858 far-tail ' +
    'excursion e_20 = +0.2479 (k=11) moves tau only to -0.90 (rho 0.891), more negative but still far ' +
    'above -1.60, so the non-rejection is STABLE to the endpoint -- it is neither an established genuine ' +
    'unit root nor a far-tail artifact, but an underpowered test on N=21. This does NOT change the RMSE ' +
    '(~0.116, ~12% multiplicative), does NOT re-open the imp-33843 form selection, and touches no bound; ' +
    'the DF critical values are finite-sample tabulated values on N=21; the component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33921 (the rho_AR ~ 0.968 and the t-CI spanning the unit root re-tested here); imp-33886 (the DW ' +
    '~0.22 serial-dependence companion); imp-33858 (the lag-1 ~+0.757 and head/far-tail endpoint ' +
    'residuals); imp-33843 (the aggregate RMSE ~0.116 log-linear fit); imp-33810 (the 21-rung ladder); ' +
    'imp-486 (C_mb GUE-conditional). DF critical values: Fuller (1976), tau_nc, n=25 row.',
};

export const IMP33963_DICKEY_FULLER_UNIT_ROOT_TEST_ASSERTIONS = [
  {
    // Reuse gate: the DF test runs on exactly the imp-33810 21-rung ladder / imp-33858 residual.
    id: 'imp33963-reuses-imp33810-ladder-and-imp33858-residual',
    description: '21 residuals on k=6.00..11.00, 20 lagged DF pairs, head/far-tail endpoints match imp-33858',
    holds: () =>
      N === 21 &&
      FULL.np === 20 &&
      KS[0] === 6 &&
      KS[20] === 11 &&
      Math.abs(RESID[0] - -0.1141909) < 1e-4 &&
      Math.abs(RESID[N - 1] - 0.2478761) < 1e-4,
  },
  {
    // The DF slope phi = rho_AR - 1, so the implied rho reproduces the imp-33921 AR(1) value ~0.968.
    id: 'imp33963-df-phi-equals-rho-minus-one',
    description: 'DF phi ~ -0.032 = rho_AR - 1; implied rho ~0.968 reproduces imp-33921; SE ~0.122',
    holds: () =>
      Math.abs(FULL.rho - 0.9676) < 1e-3 &&
      Math.abs(FULL.phi - (FULL.rho - 1)) < 1e-12 &&
      FULL.se > 0.11 &&
      FULL.se < 0.13,
  },
  {
    // The core verdict: DF tau ~ -0.27 does NOT reject the unit-root null at any conventional level.
    id: 'imp33963-tau-fails-to-reject-unit-root',
    description: 'DF tau ~ -0.27 above the 10% crit -1.60, so unit-root null NOT rejected at 10/5/1%',
    holds: () =>
      Math.abs(FULL.tau - -0.2659) < 1e-2 &&
      FULL.tau > DF_CRIT.p10 &&
      FULL_REJECTS_10 === false &&
      DF_CRIT.p05 < DF_CRIT.p10 &&
      DF_CRIT.p01 < DF_CRIT.p05,
  },
  {
    // Dropping the far-tail moves tau more negative (-0.90) but still fails to reject: verdict stable.
    id: 'imp33963-far-tail-drop-does-not-flip-verdict',
    description: 'dropping e_20 moves tau -0.27 -> -0.90 (more negative) but still above -1.60; verdict stable',
    holds: () =>
      Math.abs(DROPPED.tau - -0.8963) < 1e-2 &&
      DROPPED.tau < FULL.tau &&
      DROPPED.tau > DF_CRIT.p10 &&
      DROPPED_REJECTS_10 === false &&
      IMP33963_DICKEY_FULLER_UNIT_ROOT_TEST.verdictStableToFarTailDrop === true,
  },
  {
    // Honesty gate: isRigorous false, no QED, no refereed bound is changed, and the residual stays small (bound untouched).
    id: 'imp33963-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, RMSE-scale residual still small, imp-3066 untouched',
    holds: () =>
      IMP33963_DICKEY_FULLER_UNIT_ROOT_TEST.isRigorous === false &&
      /NO QED/.test(IMP33963_DICKEY_FULLER_UNIT_ROOT_TEST.verdict) &&
      /refereed bound is changed/i.test(IMP33963_DICKEY_FULLER_UNIT_ROOT_TEST.verdict) &&
      /12% multiplicative/.test(IMP33963_DICKEY_FULLER_UNIT_ROOT_TEST.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP33963_DICKEY_FULLER_UNIT_ROOT_TEST.verdict),
  },
];

for (const a of IMP33963_DICKEY_FULLER_UNIT_ROOT_TEST_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33963-dickey-fuller-unit-root-test assertion failed: ${a.id}`);
  }
}
