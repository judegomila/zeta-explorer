/**
 * @module imp-96831-sigma-peak-share-cc-sensitivity
 *
 * imp-96831 (numerical, frontier-direction): MEASURE THE COMPLEMENTARY SENSITIVITY
 * d(sigma_max)/d(log C_C) -- how the binding GUE-conditional peak share sigma_max
 * responds to the GUE-conditional constant C_C itself (imp-486 / C_C_PINNED),
 * NOT to the non-conditional E_trunc floor that imp-96794 already swept.
 *
 * WHY THIS IS A DISTINCT MEASUREMENT
 * ----------------------------------
 * imp-96794 F1/F2 measured d(sigma_max)/d(log E_trunc) ~ -0.019 (ADVERSE sign,
 * tiny leverage) and concluded in F3 that the ~0.95 peak share is INTRINSIC to the
 * dominant GUE-conditional E_coll = C_C_PINNED*sqrt(log T0/N) term (imp-486), not to
 * the truncation floor. But imp-96794 only perturbed the FLOOR; it never perturbed
 * C_C itself. The complementary question -- how sigma_max responds to the constant
 * that scales E_coll -- was never measured. If F3 is right, the peak-share leverage
 * should live HERE: d(sigma_max)/d(log C_C) should be the LARGER, and OPPOSITE-signed,
 * derivative. This module isolates it. Measurement/sensitivity only.
 *
 * THE QUANTITY (identical imp-3406/imp-96794 component model; only C_C varies)
 * --------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C * sqrt(log T0 / N)              (GUE-conditional, dominant; C_C swept)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi (imp-398)
 *     E_trunc = 3.06e-5                            (imp-2631 fixed floor; held fixed here)
 * ccFactor = 1 sets C_C = C_C_PINNED and reproduces imp-3406/imp-96794 byte-for-byte
 * (N_max ~ 9.22e5, sigma_max ~ 0.94943); the swept ccFactors span a realistic band.
 *
 * THE MECHANISM (why C_C is the RIGHT lever, opposite-signed to E_trunc)
 * ---------------------------------------------------------------------
 * sigma = 1/(1 + (E_trunc + E_flow)/E_coll) and E_coll scales LINEARLY with C_C, so
 * the whole ratio r = (E_trunc + E_flow)/E_coll scales as 1/C_C. Hence at fixed N
 *     d(sigma)/d(log C_C) = sigma^2 * r = sigma*(1 - sigma) > 0,
 * the standard logistic-slope form -- STRICTLY POSITIVE. At the interior peak the
 * envelope theorem removes the moving-argmax term (d(sigma)/dN = 0 there), so the
 * peak-share sensitivity equals this partial: d(sigma_max)/d(log C_C) ~ sigma_max*(1
 * - sigma_max) ~ 0.9494*0.0506 ~ +0.048. That is the OPPOSITE sign of the imp-96794
 * E_trunc derivative (-0.019) and ~2.5x LARGER in magnitude -- exactly what F3
 * predicts: the peak-share leverage lives in the GUE-conditional constant, not the
 * floor. Raising C_C makes the conditional term MORE dominant (sigma_max -> 1);
 * lowering C_C is the only in-model direction that SHRINKS the binding conditional
 * share, and it is pinned by imp-486 (not a free lever).
 *
 * THE FINDING (measurement / sensitivity only)
 * --------------------------------------------
 *   (F1) THE SIGN IS POSITIVE and OPPOSITE to E_trunc. d(sigma_max)/d(log C_C) > 0:
 *        raising the GUE-conditional constant RAISES the binding peak share toward 1,
 *        while imp-96794 found raising E_trunc LOWERS it. The two levers push the
 *        share in opposite directions, and C_C is where the conditioning burden lives.
 *   (F2) THE C_C LEVERAGE DOMINATES THE FLOOR LEVERAGE. |d(sigma_max)/d(log C_C)|
 *        (~0.048) is several times |d(sigma_max)/d(log E_trunc)| (~0.019 from
 *        imp-96794) -- the peak share is FAR more sensitive to the conditional
 *        constant than to the truncation floor, confirming imp-96794 F3 quantitatively.
 *   (F3) STILL A BOUNDED [0,1] SHARE. Even so, because sigma is bounded, a realistic
 *        +/-2x C_C band (0.5x..2x) moves sigma_max only ~0.07 (0.9037 -> 0.9741) --
 *        no in-model constant change makes the ~0.95 conditioning burden disappear; it
 *        merely confirms where the leverage sits. C_C stays GUE-conditional (imp-486);
 *        this is not a lever to pull.
 *
 * VERDICT: THE PEAK-SHARE LEVERAGE LIVES IN THE GUE-CONDITIONAL CONSTANT C_C, NOT
 * THE E_trunc FLOOR. d(sigma_max)/d(log C_C) ~ +0.048 is POSITIVE (opposite the
 * imp-96794 floor derivative -0.019) and several times larger in magnitude, so the
 * imp-96794 F3 claim -- that the ~0.95 binding peak share is intrinsic to E_coll and
 * not to the floor -- is CONFIRMED and quantified. The only in-model direction that
 * shrinks the binding conditional share is LOWERING C_C, which is pinned by imp-486
 * and is not a free lever. Measurement/sensitivity only; C_mb/C_C stay
 * GUE-conditional (imp-486); no bound changes, no positivity, no bridge closure, no
 * RH claim, NO QED. No refereed bound is changed.
 *
 * @see imp-96794-etrunc-reduction-peak-share-leverage (the E_trunc-side sweep; F3 is what this module tests)
 * @see imp-3406-sigma-highN-extrapolation (interior max N_max ~ 9.22e5, sigma_max ~ 0.9494)
 * @see imp-486 (C_mb / C_C GUE-conditional; the constant this module perturbs)
 * @see imp-2631 (E_trunc = 3.06e-5 fixed-strip floor, held fixed here)
 * @see imp-398 (E_flow C_F prefactor)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC = 3.06e-5; // imp-2631 fixed-strip floor (held fixed; imp-96794 swept it)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406 / imp-96794 exactly

// EXACT imp-3406/imp-96794 sub-terms; ONLY the GUE-conditional constant C_C is a parameter here.
function sigmaWith(N, C_C) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C * Math.sqrt(L / N);
  return E_coll / (E_TRUNC + E_flow + E_coll);
}

// Ternary search for the interior maximum in ln N (same spirit as imp-3406/imp-96794).
function argmaxNforCC(C_C, hiExp = 10) {
  let lo = Math.log(1e3);
  let hi = Math.log(10 ** hiExp);
  for (let i = 0; i < 700; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (sigmaWith(Math.exp(m1), C_C) < sigmaWith(Math.exp(m2), C_C)) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

// Realistic C_C band about the pinned value (multiplicative factors of C_C_PINNED).
const CC_FACTORS = [0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0];

const CC_TABLE = CC_FACTORS.map((f) => {
  const C_C = C_C_PINNED * f;
  const N_max = argmaxNforCC(C_C);
  const sigma_max = sigmaWith(N_max, C_C);
  return {
    ccFactor: f,
    C_C: +C_C.toFixed(6),
    N_max: +N_max.toExponential(4),
    sigma_max: +sigma_max.toFixed(7),
    // Non-conditional headroom 1 - sigma_max (the "good" share not carried by E_coll).
    headroom_1_minus_sigma: +(1 - sigma_max).toExponential(4),
  };
});

const BASE_ROW = CC_TABLE.find((r) => r.ccFactor === 1.0);

// Signed leverage of the peak share on the conditional constant:
// d(sigma_max)/d(log C_C), log-centred between the 1/sqrt2 and sqrt2 flanks about C_C_PINNED.
const F_LO = 1 / Math.SQRT2;
const F_HI = Math.SQRT2;
const S_LO = sigmaWith(argmaxNforCC(C_C_PINNED * F_LO), C_C_PINNED * F_LO);
const S_HI = sigmaWith(argmaxNforCC(C_C_PINNED * F_HI), C_C_PINNED * F_HI);
const D_SIGMA_D_LOG_CC =
  (S_HI - S_LO) / (Math.log(C_C_PINNED * F_HI) - Math.log(C_C_PINNED * F_LO));
// Logistic-slope prediction sigma_max*(1 - sigma_max) at the base peak (envelope-theorem partial).
const LOGISTIC_SLOPE_PREDICTION = BASE_ROW.sigma_max * (1 - BASE_ROW.sigma_max);
// Dimensionless elasticity of the non-conditional headroom 1 - sigma_max (opposite sign to E_trunc).
const HEADROOM_ELASTICITY =
  (Math.log(1 - S_HI) - Math.log(1 - S_LO)) / (Math.log(F_HI) - Math.log(F_LO));

// imp-96794 comparison: the floor-side derivative it measured (for the F3 magnitude test).
const IMP96794_D_SIGMA_D_LOG_ETRUNC = -0.019; // reported ~ -0.019 (ADVERSE sign, imp-96794 F1)

export const IMP96831_SIGMA_PEAK_SHARE_CC_SENSITIVITY = {
  id: 'imp-96831',
  proofSection: 'S-frontier',
  question:
    'How does the binding GUE-conditional peak share sigma_max ~ 0.9494 (at N_max ~ 9.22e5) ' +
    'respond to the GUE-conditional constant C_C itself? Measure d(sigma_max)/d(log C_C) at ' +
    'the interior peak and test the imp-96794 F3 claim that the peak-share leverage lives in ' +
    'the E_coll conditional term, not the E_trunc floor. Measurement/sensitivity only; C_C ' +
    'stays GUE-conditional (imp-486); no bound changes, no RH verdict.',
  baseRow: BASE_ROW,
  ccTable: CC_TABLE,
  signedLeverage: {
    d_sigma_max_d_log_cc: +D_SIGMA_D_LOG_CC.toFixed(6), // ~ +0.048 (POSITIVE; opposite E_trunc)
    logistic_slope_prediction_sigma_1minus_sigma: +LOGISTIC_SLOPE_PREDICTION.toFixed(6), // ~ +0.0480
    imp96794_d_sigma_max_d_log_etrunc: IMP96794_D_SIGMA_D_LOG_ETRUNC, // -0.019 (floor side, for magnitude compare)
    cc_over_etrunc_leverage_ratio: +Math.abs(D_SIGMA_D_LOG_CC / IMP96794_D_SIGMA_D_LOG_ETRUNC).toFixed(3),
    headroom_elasticity_d_log_1minus_sigma_d_log_cc: +HEADROOM_ELASTICITY.toFixed(6), // negative (opposite E_trunc +0.375)
    note:
      'd(sigma_max)/d(log C_C) is POSITIVE (~+0.048) -- raising the GUE-conditional constant ' +
      'RAISES the binding peak share -- OPPOSITE the imp-96794 floor derivative (~-0.019) and ' +
      'several times larger in magnitude. It matches the envelope-theorem logistic slope ' +
      'sigma_max*(1 - sigma_max) at the base peak, confirming the peak-share leverage lives in ' +
      'the E_coll conditional term (imp-486), not the E_trunc floor.',
  },
  verdict:
    'THE PEAK-SHARE LEVERAGE LIVES IN THE GUE-CONDITIONAL CONSTANT C_C, NOT THE E_trunc FLOOR. ' +
    'd(sigma_max)/d(log C_C) ~ +0.048 is POSITIVE (opposite the imp-96794 floor derivative ' +
    '-0.019) and several times larger in magnitude, matching the envelope logistic slope ' +
    'sigma_max*(1 - sigma_max). This CONFIRMS and quantifies imp-96794 F3: the ~0.95 binding ' +
    'peak share is intrinsic to the dominant GUE-conditional E_coll term (imp-486), not the ' +
    'truncation floor. The only in-model direction that shrinks the binding conditional share ' +
    'is LOWERING C_C, which is pinned by imp-486 and is not a free lever. Measurement/' +
    'sensitivity only; C_mb/C_C stay GUE-conditional (imp-486); no bound changes, no ' +
    'positivity, no bridge closure, no RH claim, NO QED. No refereed bound is changed.',
  isRigorous: false,
  citation:
    'imp-96794 (E_trunc-side sweep, F3 claim tested here); imp-3406 (interior max N_max ~ ' +
    '9.22e5, sigma_max ~ 0.9494); imp-486 (C_mb / C_C GUE-conditional); imp-2631 (E_trunc = ' +
    '3.06e-5 fixed floor); imp-398 (E_flow C_F prefactor); lambda-rh-height-mapping.',
};

export const IMP96831_SIGMA_PEAK_SHARE_CC_SENSITIVITY_ASSERTIONS = [
  {
    // Reuse gate: ccFactor 1.0 reproduces the imp-3406 / imp-96794 pin.
    id: 'imp96831-reproduces-imp3406-base-peak',
    description: 'ccFactor 1.0 reproduces imp-3406 N_max ~ 9.22e5 and sigma_max ~ 0.94943 (identical formulas)',
    holds: () =>
      Math.abs(BASE_ROW.N_max - 9.2186e5) / 9.2186e5 < 1e-3 &&
      Math.abs(BASE_ROW.sigma_max - 0.9494290) < 5e-5,
  },
  {
    // F1: the sign is POSITIVE -- raising C_C RAISES the peak share (opposite E_trunc).
    id: 'imp96831-cc-increase-raises-peak-share',
    description: 'd(sigma_max)/d(log C_C) > 0: a larger GUE-conditional constant increases the binding peak share (opposite the E_trunc sign)',
    holds: () => D_SIGMA_D_LOG_CC > 0,
  },
  {
    // F1 (monotone): sigma_max rises monotonically as C_C is raised.
    id: 'imp96831-sigma-max-monotone-in-cc',
    description: 'sigma_max is monotone-increasing as the C_C factor increases (every increase raises the share)',
    holds: () => {
      for (let i = 1; i < CC_TABLE.length; i++) {
        // CC_TABLE is ordered by INCREASING factor, so sigma_max must increase along it.
        if (CC_TABLE[i].sigma_max <= CC_TABLE[i - 1].sigma_max) return false;
      }
      return true;
    },
  },
  {
    // F1 (envelope): the peak-share derivative matches the logistic slope sigma*(1-sigma).
    id: 'imp96831-matches-logistic-slope',
    description: 'd(sigma_max)/d(log C_C) matches the envelope-theorem logistic slope sigma_max*(1 - sigma_max) within 5 percent',
    holds: () =>
      Math.abs(D_SIGMA_D_LOG_CC - LOGISTIC_SLOPE_PREDICTION) / LOGISTIC_SLOPE_PREDICTION < 0.05,
  },
  {
    // F2: the C_C leverage dominates the imp-96794 E_trunc floor leverage in magnitude.
    id: 'imp96831-cc-leverage-dominates-floor',
    description: 'the C_C peak-share leverage exceeds the imp-96794 E_trunc floor leverage in magnitude (confirms F3)',
    holds: () => Math.abs(D_SIGMA_D_LOG_CC) > Math.abs(IMP96794_D_SIGMA_D_LOG_ETRUNC),
  },
  {
    // F3: still a bounded [0,1] share -- a realistic +/-2x C_C band moves sigma_max modestly.
    id: 'imp96831-bounded-share-realistic-band',
    description: 'sigma_max moves < 0.08 across a realistic +/-2x C_C band 0.5x..2x (bounded [0,1] share; confirms leverage location, not a lever)',
    holds: () => {
      const smax = CC_TABLE.map((r) => r.sigma_max);
      return Math.max(...smax) - Math.min(...smax) < 0.08;
    },
  },
  {
    // Honesty gate: measurement/assessment only, F3-confirming verdict, no QED, no refereed bound is changed.
    id: 'imp96831-honesty-gate-no-qed',
    description: 'Assessment only: leverage-lives-in-C_C verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP96831_SIGMA_PEAK_SHARE_CC_SENSITIVITY.isRigorous === false &&
      /LEVERAGE LIVES IN THE GUE-CONDITIONAL CONSTANT/.test(IMP96831_SIGMA_PEAK_SHARE_CC_SENSITIVITY.verdict) &&
      /NO QED/.test(IMP96831_SIGMA_PEAK_SHARE_CC_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP96831_SIGMA_PEAK_SHARE_CC_SENSITIVITY.verdict),
  },
];

for (const a of IMP96831_SIGMA_PEAK_SHARE_CC_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96831-sigma-peak-share-cc-sensitivity assertion failed: ${a.id}`,
    );
  }
}
