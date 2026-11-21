/**
 * @module imp-33967-ecoll-g-vs-law-offset-subleading-L3-correction
 *
 * imp-33967 (numerical, frontier-direction): imp-33918 F2 measured the imp-33887 I3 reference
 * offset off(N) = g(N) - 1/(2 log T0) and confirmed it vanishes at ORDER 2 (log|off| vs log L
 * slope ~-2.00, off/(-1/(2 L (L+1))) -> 1). But imp-33918 verified only the LEADING -1/(2 L^2)
 * term. The purely-algebraic expansion of the closed form the parent matched,
 *     -1/(2 L (L+1)) = -1/(2 L^2) + 1/(2 L^3) - 1/(2 L^4) + ...,
 * predicts a specific POSITIVE L^-3 residual with coefficient +1/2 that was never isolated. This
 * module recomputes the SAME sub-terms on the SAME extended ladder (1e12..1e280, identical
 * inherited imp-3220/imp-3406 estimator) and isolates the residual
 *     r(N) = off(N) + 1/(2 L^2)      (L = log T0)
 * by regressing it against 1/L^3 -- to test the +1/2 coefficient and the predicted sign flip.
 *
 * THE MEASUREMENT OVERTURNS THE TRUNCATED-CLOSED-FORM PREDICTION (honest partial)
 * ------------------------------------------------------------------------------
 * The measured residual is NEGATIVE at every rung and r * L^3 converges NOT to +1/2 but to a
 * negative constant ~-0.919. A two-parameter tail extrapolation r * L^3 = a + b/L (e >= 20) gives
 *     intercept a = -0.91865   vs   -log(2 pi)/2 = -0.918939   (agree to ~3e-4),
 * and the log|r| vs log L slope is ~-3.01 (r ~ L^-3, ORDER 3, as expected). So:
 *   - The L^-3 SCALING is confirmed (slope ~-3), but
 *   - the COEFFICIENT is -log(2 pi)/2 ~ -0.919, NOT the +1/2 the truncated form predicts, and
 *   - r does NOT change sign relative to off: BOTH are negative (the premise sign flip is absent).
 *
 * WHY THE +1/2 PREDICTION IS AN ARTIFACT OF TRUNCATING THE Riemann-von Mangoldt INVERSE
 * ------------------------------------------------------------------------------------
 * g/law = dL/d ln N exactly (g = (1/2) d ln L/d ln N, law = 1/(2L)). imp-33918 used the TRUNCATED
 * inverse ln N = log T0 + log log T0 - 1 + o(1), giving dL/d ln N = L/(L+1) and hence the closed
 * form off = -1/(2 L (L+1)). But the measured g uses the TRUE inverse via effectiveHeightForN,
 * whose leading Riemann-von Mangoldt density carries the 2 pi: with v = log(T0/2 pi) = L - log 2 pi,
 *     ln N = v - log 2 pi + log(v - 1)   =>   dL/d ln N = (L - a)/(L - a + 1),  a = 1 + log 2 pi,
 * so L - a + 1 = L - log 2 pi and the TRUE offset is
 *     off_true = (1/(2L))(dL/d ln N - 1) = -1/(2 L (L - log 2 pi)).
 * This agrees with -1/(2 L (L+1)) only at O(L^-2); its L^-3 residual is
 *     r = off + 1/(2 L^2) = -log(2 pi)/(2 L^2 (L - log 2 pi)) ~ -log(2 pi)/2 * L^-3.
 * The truncated form drops the log 2 pi shift, so its algebraic +1/2 L^-3 term is overridden by
 * the true -log(2 pi)/2 term (opposite sign, ~1.84x larger in magnitude). Sanity: off_true at
 * 1e280 = -1/(2 * 640.105 * (640.105 - 1.838)) = -1.2237e-6, matching the measured -1.2238e-6.
 *
 * THE EXTENDED LADDER (measurement only)
 * --------------------------------------
 *   d     logT0     off = g - law    r = off + 1/(2 L^2)   r * L^3
 *   12    26.31     -7.764e-4        -5.423e-5             -0.98794
 *   20    44.17     -2.674e-4        -1.113e-5             -0.95884
 *   50   112.27     -4.033e-5        -6.602e-7             -0.93423
 *  120   272.55     -6.777e-6        -4.570e-8             -0.92517
 *  200   456.24     -2.412e-6        -9.716e-9             -0.92266
 *  280   640.11     -1.224e-6        -3.513e-9             -0.92145   (-> -log(2 pi)/2 = -0.91894)
 *
 * THE FINDINGS (numerical / measurement only)
 * -------------------------------------------
 *   (F1) L^-3 SCALING CONFIRMED. log|r| vs log L slope ~-3.01: the residual after removing the
 *        leading -1/(2 L^2) term decays one order faster, r ~ L^-3.
 *   (F2) COEFFICIENT IS -log(2 pi)/2, NOT +1/2. The tail extrapolation r * L^3 -> -0.91865,
 *        matching -log(2 pi)/2 = -0.918939 (~3e-4), NOT the +1/2 the truncated -1/(2 L(L+1))
 *        expansion predicts. The through-origin r-vs-1/L^3 fit gives ~-0.958 (curvature-biased),
 *        still far from +0.5.
 *   (F3) NO SIGN FLIP. r(N) is NEGATIVE at every rung -- SAME sign as off, not opposite. The
 *        premise sign flip (from the algebraic +1/2 term) does not occur: the true RvM log 2 pi
 *        shift keeps the L^-3 residual on the same side as the leading offset.
 *
 * NUMERICAL / MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the analytic -log(2 pi)/2 coefficient uses the leading
 * Riemann-von Mangoldt inverse and is a MATCH to the measured decay, not a proven bound; the C_mb
 * GUE-conditional share per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed
 * . SUB-GAP: the ladder tops out at 1e280 (Math.pow(10, e) overflows IEEE double
 * past e~308), so r * L^3 is still ~0.3% above its -log(2 pi)/2 asymptote at the endpoint; the
 * coefficient is pinned by the two-parameter 1/L extrapolation, not a direct large-L readout.
 *
 * @see imp-33918-ecoll-g-vs-law-reference-offset-convergence-rate (leading -1/(2 L^2) term; off/(-1/(2 L (L+1))) -> 1)
 * @see imp-33887-ecoll-gap-anchoring-convention-reconciliation (three-way split; I3 reference offset)
 * @see imp-33944-gap-law-subleading-correction (companion: gap-law ratio sub-leading -1/log T0 correction)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0, the true Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const HALF = 0.5;
const DL = 1e-4; // central-difference step in ln N (identical to imp-33918 / imp-33854)
const LOG_2PI = Math.log(2 * Math.PI); // ~1.837877
const PREDICTED_TRUE_COEFF = -LOG_2PI / 2; // ~-0.918939 (true RvM L^-3 coefficient)
const TRUNCATED_ALGEBRAIC_COEFF = 0.5; // +1/2 (the truncated -1/(2 L(L+1)) expansion predicts this)

// EXTENDED decade ladder, identical to imp-33918 (tops at 1e280 to stay within IEEE-double range).
const LADDER = [12, 13, 14, 15, 20, 30, 50, 80, 120, 200, 280];

const logLofE = (e) => Math.log(effectiveHeightForN(Math.pow(10, e)));
const lnLogT0At = (lnN) => Math.log(Math.log(effectiveHeightForN(Math.exp(lnN))));

// imp-33854/imp-33918 reference object g(N) = (1/2) d ln(log T0)/d ln N (identical estimator).
function gFundamental(e) {
  const lnN = e * Math.LN10;
  return HALF * (lnLogT0At(lnN + DL) - lnLogT0At(lnN - DL)) / (2 * DL);
}

const RATE = LADDER.map((e) => {
  const L = logLofE(e);
  const law = HALF / L; // 1/(2 log T0) far-tail law
  const g = gFundamental(e);
  const off = g - law; // I3 reference offset (imp-33918)
  const leading = -1 / (2 * L * L); // -1/(2 L^2) leading term (imp-33918 verified)
  const r = off - leading; // residual r = off + 1/(2 L^2) (this module isolates it)
  const offTrue = -1 / (2 * L * (L - LOG_2PI)); // true-RvM model off = -1/(2 L (L - log 2pi))
  return {
    N_log10: e,
    logT0: +L.toFixed(4),
    offset_g_minus_law: +off.toExponential(4),
    residual_r: +r.toExponential(4), // NEGATIVE (same sign as off), not the +1/2-implied positive
    r_times_L3: +(r * L * L * L).toFixed(5), // -> -log(2 pi)/2 ~ -0.91894
    offset_true_rvm_model: +offTrue.toExponential(4), // -1/(2 L (L - log 2pi)) matches off
    off_minus_trueModel: +(off - offTrue).toExponential(2), // ~machine/diff noise: true model fits off
  };
});

// Two-parameter tail extrapolation r*L^3 = a + b/L over e >= 20 (intercept a -> -log(2 pi)/2).
function fitIntercept(rows) {
  const tail = rows.filter((row) => row.N_log10 >= 20);
  const xs = tail.map((row) => 1 / row.logT0);
  const ys = tail.map((row) => row.r_times_L3);
  const n = xs.length;
  const mx = xs.reduce((s, x) => s + x, 0) / n;
  const my = ys.reduce((s, y) => s + y, 0) / n;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  return { intercept: +intercept.toFixed(6), slope_in_invL: +slope.toFixed(6), tailWindow: `1e${tail[0].N_log10}..1e${tail[tail.length - 1].N_log10}` };
}

// Log-log decay exponent of |r| vs log(log T0) over the tail (expect ~-3, ORDER 3).
function fitExponent(rows) {
  const tail = rows.filter((row) => row.N_log10 >= 20);
  const xs = tail.map((row) => Math.log(row.logT0));
  const ys = tail.map((row) => Math.log(Math.abs(row.residual_r)));
  const n = xs.length;
  const mx = xs.reduce((s, x) => s + x, 0) / n;
  const my = ys.reduce((s, y) => s + y, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
    syy += (ys[i] - my) ** 2;
  }
  const slope = sxy / sxx;
  const r2 = (sxy * sxy) / (sxx * syy);
  return { slope: +slope.toFixed(4), r2: +r2.toFixed(6) };
}

const INTERCEPT_FIT = fitIntercept(RATE); // intercept ~ -0.91865
const EXPONENT_FIT = fitExponent(RATE); // slope ~ -3.01
const RESIDUAL_ALL_NEGATIVE = RATE.every((row) => row.residual_r < 0);
const OFFSET_ALL_NEGATIVE = RATE.every((row) => row.offset_g_minus_law < 0);
const MAX_TRUEMODEL_DEV = +Math.max(...RATE.map((row) => Math.abs(row.off_minus_trueModel))).toExponential(2);

export const IMP33967_ECOLL_G_VS_LAW_OFFSET_SUBLEADING_L3_CORRECTION = {
  id: 'imp-33967',
  proofSection: 'S-frontier',
  question:
    'Isolate the NEXT-order (L^-3) correction of the imp-33918 g-vs-law offset off = g - 1/(2 log T0). ' +
    'The truncated closed form -1/(2 L (L+1)) = -1/(2 L^2) + 1/(2 L^3) - ... predicts a POSITIVE L^-3 ' +
    'residual with coefficient +1/2; does the residual r = off + 1/(2 L^2) confirm that coefficient and ' +
    'sign? Measurement only; C_mb GUE-conditional per imp-486; changes no bound; no QED.',
  componentModel:
    'g(N) = (1/2) d ln(log T0)/d ln N via central difference DL=1e-4; T0 = effectiveHeightForN(N) ' +
    '(the TRUE Riemann-von Mangoldt inverse). Identical inherited imp-3220/imp-3406 sub-term to ' +
    'imp-33918/imp-33887/imp-33854. off = g - 1/(2 log T0); residual r = off + 1/(2 (log T0)^2).',
  predictionTested:
    'Truncated -1/(2 L (L+1)) expansion => r ~ +1/2 * L^-3 (positive, opposite sign to off). ' +
    'TRUE RvM inverse (v = log(T0/2 pi)) => off_true = -1/(2 L (L - log 2 pi)) => r ~ -log(2 pi)/2 * ' +
    'L^-3 (negative, SAME sign as off). This module measures which holds.',
  ladder: RATE,
  interceptFit: INTERCEPT_FIT, // r*L^3 = a + b/L, a ~ -0.91865
  residualExponentFit: EXPONENT_FIT, // log|r| vs log(log T0), slope ~ -3.01
  predictedTrueCoefficient: +PREDICTED_TRUE_COEFF.toFixed(6), // -0.918939 = -log(2 pi)/2
  truncatedAlgebraicCoefficient: TRUNCATED_ALGEBRAIC_COEFF, // +0.5 (rejected by measurement)
  summary: {
    residual_endpoint_1e280: RATE[RATE.length - 1].residual_r, // ~-3.51e-9
    r_times_L3_endpoint_1e280: RATE[RATE.length - 1].r_times_L3, // ~-0.92145 (-> -0.91894)
    fitted_L3_coefficient: INTERCEPT_FIT.intercept, // ~-0.91865
    residual_all_negative_same_sign_as_offset: RESIDUAL_ALL_NEGATIVE && OFFSET_ALL_NEGATIVE,
    true_rvm_model_max_deviation_from_off: MAX_TRUEMODEL_DEV, // ~1e-11: off_true = -1/(2 L (L - log 2pi)) fits off
  },
  findings: {
    F1_L3_scaling_confirmed:
      'log|r| vs log(log T0) regression slope is ~-3.01 (r2 ~ 1): the residual after removing the ' +
      'leading -1/(2 L^2) term decays one order faster, r ~ (log T0)^-3.',
    F2_coefficient_is_neg_half_log2pi_not_plus_half:
      'The tail extrapolation r * L^3 = a + b/L gives a ~ -0.91865, matching -log(2 pi)/2 = ' +
      '-0.918939 (~3e-4), NOT the +1/2 the truncated -1/(2 L(L+1)) expansion predicts. The truncated ' +
      'form drops the log 2 pi shift in the Riemann-von Mangoldt inverse.',
    F3_no_sign_flip:
      'r(N) is NEGATIVE at every rung -- SAME sign as off, not opposite. The premise sign flip (from ' +
      'the algebraic +1/2 term) is absent: the true RvM off = -1/(2 L (L - log 2 pi)) keeps the L^-3 ' +
      'residual on the leading offset side (off_true matches off to ~1e-11).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (numerical, NOT rigorous). Isolating the L^-3 residual r = off + 1/(2 (log T0)^2) of ' +
    'the imp-33918 g-vs-law offset on the SAME 1e12..1e280 ladder OVERTURNS the truncated-closed-form ' +
    'prediction: r is NEGATIVE at every rung and r * L^3 -> -0.91865 (two-parameter 1/L extrapolation), ' +
    'matching -log(2 pi)/2 = -0.918939 to ~3e-4, NOT the +1/2 the algebraic -1/(2 L(L+1)) = -1/(2 L^2) ' +
    '+ 1/(2 L^3) - ... expansion predicts. The log|r| vs log(log T0) slope is ~-3.01, confirming the ' +
    'L^-3 SCALING. The +1/2 prediction is an ARTIFACT of truncating the Riemann-von Mangoldt inverse: ' +
    'the measured g uses the true inverse whose leading density carries the 2 pi, giving off_true = ' +
    '-1/(2 L (L - log 2 pi)) (matches off to ~1e-11) whose L^-3 residual is -log(2 pi)/2 * L^-3 -- ' +
    'opposite sign and ~1.84x the magnitude of the truncated +1/2 term. Consequently r does NOT change ' +
    'sign relative to off; both are negative. SUB-GAP: the ladder tops at 1e280 (Math.pow overflow past ' +
    'e~308), so r * L^3 is still ~0.3% above its -log(2 pi)/2 asymptote at the endpoint and the ' +
    'coefficient is pinned by extrapolation, not a direct large-L readout; the analytic -log(2 pi)/2 ' +
    'uses the leading RvM inverse and is a MATCH, not a proven bound. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional ' +
    'share per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33918 (leading -1/(2 L^2) term; off/(-1/(2 L (L+1))) -> 1 on 1e12..1e280); imp-33887 ' +
    '(three-way split; I3 reference offset); imp-33944 (companion gap-law -1/log T0 sub-leading ' +
    'correction, from-below); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping ' +
    '(effectiveHeightForN, the true Riemann-von Mangoldt inverse).',
};

export const IMP33967_ECOLL_G_VS_LAW_OFFSET_SUBLEADING_L3_CORRECTION_ASSERTIONS = [
  {
    // (F1) The residual decays at order 3 in 1/log T0: log-log slope ~ -3.
    id: 'imp33967-residual-decay-exponent-near-minus-three',
    description: 'log|r| vs log(log T0) regression slope is ~-3.0 (residual ~ (log T0)^-3, order 3)',
    holds: () => EXPONENT_FIT.slope < -2.9 && EXPONENT_FIT.slope > -3.1 && EXPONENT_FIT.r2 > 0.999,
  },
  {
    // (F2) The fitted L^-3 coefficient matches -log(2 pi)/2, NOT the truncated-form +1/2.
    id: 'imp33967-L3-coefficient-matches-neg-half-log2pi',
    description: 'r * L^3 tail intercept ~ -log(2 pi)/2 = -0.918939 (fit within 1e-2)',
    holds: () => Math.abs(INTERCEPT_FIT.intercept - PREDICTED_TRUE_COEFF) < 1e-2,
  },
  {
    // (F2) The truncated-form +1/2 prediction is decisively rejected.
    id: 'imp33967-truncated-plus-half-prediction-rejected',
    description: 'the fitted L^-3 coefficient is NOT +1/2: it is negative, ~-0.92 (opposite the truncated-form guess)',
    holds: () => INTERCEPT_FIT.intercept < -0.5 && Math.abs(INTERCEPT_FIT.intercept - TRUNCATED_ALGEBRAIC_COEFF) > 1,
  },
  {
    // (F3) No sign flip: r is negative at every rung, same sign as off.
    id: 'imp33967-no-sign-flip-residual-same-sign-as-offset',
    description: 'r(N) is negative at every rung -- SAME sign as off (the premise sign flip is absent)',
    holds: () => RESIDUAL_ALL_NEGATIVE === true && OFFSET_ALL_NEGATIVE === true,
  },
  {
    // The true-RvM model off = -1/(2 L (L - log 2 pi)) fits the measured off to machine/diff noise.
    id: 'imp33967-true-rvm-model-fits-measured-offset',
    description: 'off_true = -1/(2 L (L - log 2 pi)) matches the measured off to <1e-8 at every rung',
    holds: () => MAX_TRUEMODEL_DEV < 1e-8,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp33967-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33967_ECOLL_G_VS_LAW_OFFSET_SUBLEADING_L3_CORRECTION.isRigorous === false &&
      /NO QED/.test(IMP33967_ECOLL_G_VS_LAW_OFFSET_SUBLEADING_L3_CORRECTION.verdict) &&
      /refereed bound is changed/i.test(IMP33967_ECOLL_G_VS_LAW_OFFSET_SUBLEADING_L3_CORRECTION.verdict),
  },
];

for (const a of IMP33967_ECOLL_G_VS_LAW_OFFSET_SUBLEADING_L3_CORRECTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33967-ecoll-g-vs-law-offset-subleading-L3-correction assertion failed: ${a.id}`);
  }
}
