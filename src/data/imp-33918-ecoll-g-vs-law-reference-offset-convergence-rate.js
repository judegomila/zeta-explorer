/**
 * @module imp-33918-ecoll-g-vs-law-reference-offset-convergence-rate
 *
 * imp-33918 (numerical, frontier-direction): imp-33887 decomposed the imp-33856 endpoint
 * residual into DISCRETIZATION + I1 identity + a g-vs-law I3 REFERENCE offset, and reported
 * the reference offset gap_ecoll - 1/(2 log T0) at ~-6.3e-4 (ratio g/law ~0.96) on the
 * 1e12..1e15 ladder -- flagging that g(N) is NOT YET at the far-tail law 1/(2 log T0) on that
 * range, but never measuring WHETHER or HOW FAST the pointwise offset converges past it.
 * This module recomputes the SAME sub-terms on an EXTENDED ladder (1e12..1e280) and MEASURES
 * the decade-scaling convergence rate of the pointwise g-vs-law reference offset.
 *
 * THE COMPONENT MODEL (identical sub-term to imp-33887 / imp-33856 / imp-33854)
 * ---------------------------------------------------------------------------
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)     (dominant, GUE-conditional C_H)
 *     T0      = effectiveHeightForN(N)            (Riemann-von Mangoldt inverse)
 *     L       = log T0     (natural log throughout the cohort)
 * The pointwise gap_ecoll = q_point + 1/2 IS the fundamental object g(N) = (1/2) d ln L/d ln N
 * to machine precision (imp-33854 I1). This module measures the I3 reference offset
 *     off(N) = g(N) - 1/(2 L)          (the imp-33887 term_reference_g_minus_law)
 * as N grows, using the identical inherited imp-3220/imp-3406 sub-terms. No fresh model.
 *
 * THE CLOSED-FORM THE MEASUREMENT MATCHES (measurement, not a derivation of a bound)
 * ---------------------------------------------------------------------------------
 * Writing g/law = (dL/d ln N) and law = 1/(2L), the Riemann-von Mangoldt inverse gives
 * ln N = ln T0 + ln ln T0 - 1 + o(1), so d ln N/d ln T0 = 1 + 1/L and hence
 *     g/law = dL/d ln N = L/(L+1) = 1 - 1/(L+1),
 *     off   = g - law   = (1/(2L))*(g/law - 1) = -1/(2 L (L+1)) ~ -1/(2 L^2).
 * So the RATIO g/law approaches 1 at ORDER 1 in 1/L (1 - g/law ~ 1/L = 1/log T0), while the
 * pointwise OFFSET g - law vanishes at ORDER 2 (off ~ -1/(2 (log T0)^2)). This module measures
 * both rates on the numerical ladder and confirms they match the closed form.
 *
 * WHAT THE EXTENDED LADDER SHOWS (measurement only)
 * -------------------------------------------------
 *   d     logT0     g            law          off=g-law    ratio g/law   (1-ratio)*L
 *   12    26.31     1.823e-2     1.900e-2     -7.76e-4     0.95914       1.075
 *   15    32.97     1.468e-2     1.517e-2     -4.87e-4     0.96788       1.059
 *   20    44.17     1.105e-2     1.132e-2     -2.67e-4     0.97638       1.043
 *   30    66.76     7.374e-3     7.490e-3     -1.15e-4     0.98460       1.028
 *   50   112.27     4.413e-3     4.454e-3     -4.03e-5     0.99095       1.017
 *   80   180.86     2.749e-3     2.765e-3     -1.54e-5     0.99441       1.010
 *  120   272.55     1.828e-3     1.835e-3     -6.78e-6     0.99631       1.007
 *  200   456.24     1.094e-3     1.096e-3     -2.41e-6     0.99780       1.004
 *  280   640.11     7.799e-4     7.811e-4     -1.22e-6     0.99843       1.003
 * The offset is MONOTONE toward 0, the ratio MONOTONE toward 1, and (1-ratio)*L -> 1 (the
 * order-1 ratio rate). A log|off| vs log L regression over the tail gives slope ~ -2.00 (the
 * order-2 offset rate), and off / (-1/(2 L (L+1))) -> 1 (the closed form is the exact leading term).
 *
 * THE FINDINGS (numerical / measurement only)
 * -------------------------------------------
 *   (F1) YES, g CONVERGES to the law. The pointwise reference offset off(N) = g - 1/(2 log T0)
 *        decreases monotonically in magnitude from ~7.76e-4 at 1e12 to ~1.22e-6 at 1e280, and the
 *        ratio g/law rises monotonically from ~0.959 to ~0.998. g -> 1/(2 log T0) as N grows.
 *   (F2) OFFSET RATE IS ORDER 2 IN 1/log T0. The log|off| vs log(log T0) regression slope over the
 *        extended tail is ~-2.00: |off| ~ (log T0)^-2, matching the closed form -1/(2 L (L+1)).
 *        The ratio off / (-1/(2 L(L+1))) -> 1 (leading-order exact).
 *   (F3) RATIO RATE IS ORDER 1 IN 1/log T0. The deviation 1 - g/law ~ 1/log T0 exactly to leading
 *        order: (1 - g/law)*log T0 -> 1 from above (1.075 at 1e12 down to 1.003 at 1e280).
 *
 * NUMERICAL / MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the closed form off ~ -1/(2 (log T0)^2) is a MATCH to
 * the measured decay, not a proven bound; the C_mb GUE-conditional share per imp-486 is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33887-ecoll-gap-anchoring-convention-reconciliation (three-way split; I3 reference offset ~-6.3e-4 on 1e12..1e15)
 * @see imp-33854-log-saturation-exponent-reconciliation (identity I1 gap_ecoll=g; I3 g -> 1/(2 log T0))
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (pointwise gap_sigma ~ 1/(2 log T0))
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote (-1/2 for E_coll)
const DL = 1e-4; // central-difference step in ln N (identical to imp-33854 / imp-33887)

// EXACT imp-33887/imp-33856/imp-33854 E_coll sub-term (no re-derivation, no fresh model).
function ecollParts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0); // "log T0" = natural log throughout the cohort
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return { T0, L, E_coll };
}

const lnEcollAt = (lnN) => Math.log(ecollParts(Math.exp(lnN)).E_coll);
const lnLogT0At = (lnN) => Math.log(ecollParts(Math.exp(lnN)).L);

// imp-33854 pointwise estimator: gap_ecoll = q_point + 1/2 (equals g to machine precision, I1).
function gapEcollPointwise(e) {
  const lnN = e * Math.LN10;
  const q = (lnEcollAt(lnN + DL) - lnEcollAt(lnN - DL)) / (2 * DL);
  return q + HALF;
}
// imp-33854 reference object g(N) = (1/2) d ln(log T0)/d ln N.
function gFundamental(e) {
  const lnN = e * Math.LN10;
  return 0.5 * (lnLogT0At(lnN + DL) - lnLogT0At(lnN - DL)) / (2 * DL);
}

// EXTENDED decade ladder well past the imp-33887 1e12..1e15 anchor.
const LADDER = [12, 13, 14, 15, 20, 30, 50, 80, 120, 200, 280];

const RATE = LADDER.map((e) => {
  const N = Math.pow(10, e);
  const L = ecollParts(N).L;
  const law = HALF / L; // 1/(2 log T0) far-tail law (imp-33816)
  const gapPoint = gapEcollPointwise(e); // pointwise gap_ecoll (imp-33854 estimator)
  const g = gFundamental(e); // reference object g(N)
  const off = g - law; // I3 reference offset (imp-33887 term_reference_g_minus_law)
  const closedForm = -1 / (2 * L * (L + 1)); // measured-match leading term -1/(2 L (L+1))
  return {
    N_log10: e,
    logT0: +L.toFixed(4),
    gapPointwise: +gapPoint.toExponential(4), // = g to machine precision (I1)
    gFundamental: +g.toExponential(4),
    law: +law.toExponential(4),
    offset_g_minus_law: +off.toExponential(4), // I3 reference offset (~-6.3e-4 at 1e12..1e15)
    ratio_g_over_law: +(g / law).toFixed(6), // -> 1 as N grows
    ratio_dev_times_L: +((1 - g / law) * L).toFixed(4), // (1 - g/law)*log T0 -> 1 (order-1 rate)
    closedForm_neg_half_over_LLp1: +closedForm.toExponential(4), // -1/(2 L (L+1))
    offset_over_closedForm: +(off / closedForm).toFixed(4), // -> 1 (closed form is exact leading term)
    point_minus_g_I1: +(gapPoint - g).toExponential(2), // imp-33854 I1 sanity: ~1e-11 (machine precision)
  };
});

// Log-log decay-exponent regression of |off| vs log T0 over the extended tail (e >= 20).
function fitExponent(rows) {
  const tail = rows.filter((r) => r.N_log10 >= 20);
  const xs = tail.map((r) => Math.log(r.logT0));
  const ys = tail.map((r) => Math.log(Math.abs(r.offset_g_minus_law)));
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
  return { slope: +slope.toFixed(4), r2: +r2.toFixed(6), tailWindow: `1e${tail[0].N_log10}..1e${tail[tail.length - 1].N_log10}` };
}

const OFFSET_EXPONENT_FIT = fitExponent(RATE); // slope ~ -2.00 (order-2 in 1/log T0)
const MAX_I1_DEV = +Math.max(...RATE.map((r) => Math.abs(r.point_minus_g_I1))).toExponential(2); // ~1e-11
const RATIO_ENDPOINT = RATE[RATE.length - 1].ratio_g_over_law; // ~0.998 at 1e280
const OFFSET_ENDPOINT = RATE[RATE.length - 1].offset_g_minus_law; // ~-1.2e-6 at 1e280
const OFFSET_OVER_CF_ENDPOINT = RATE[RATE.length - 1].offset_over_closedForm; // ~1.00 (closed form exact)
const RATIODEV_L_ENDPOINT = RATE[RATE.length - 1].ratio_dev_times_L; // ~1.00 (order-1 ratio rate)

// Monotonicity checks: |off| strictly decreasing, ratio strictly increasing across the ladder.
const OFFSET_MONOTONE = RATE.every((r, i) => i === 0 || Math.abs(r.offset_g_minus_law) < Math.abs(RATE[i - 1].offset_g_minus_law));
const RATIO_MONOTONE = RATE.every((r, i) => i === 0 || r.ratio_g_over_law > RATE[i - 1].ratio_g_over_law);

export const IMP33918_ECOLL_G_VS_LAW_REFERENCE_OFFSET_CONVERGENCE_RATE = {
  id: 'imp-33918',
  proofSection: 'S-frontier',
  question:
    'Measure the decade-scaling convergence RATE of the imp-33887 I3 g-vs-law reference offset ' +
    'gap_ecoll - 1/(2 log T0) (~-6.3e-4, ratio g/law ~0.96 on 1e12..1e15): does g(N) approach the ' +
    'far-tail law as N grows, and at what rate? Measurement only; C_mb GUE-conditional per imp-486; ' +
    'changes no bound; no QED.',
  componentModel:
    'E_coll = C_C sqrt(log T0 / N) (GUE-conditional C_H); T0 = effectiveHeightForN(N). Identical ' +
    'inherited imp-3220/imp-3406 sub-term to imp-33887/imp-33856/imp-33854; pointwise via DL=1e-4. ' +
    'gap_ecoll (pointwise) = g(N) = (1/2) d ln(log T0)/d ln N to machine precision (imp-33854 I1).',
  closedFormMatched:
    'Riemann-von Mangoldt inverse ln N = ln T0 + ln ln T0 - 1 + o(1) gives g/law = L/(L+1) and ' +
    'off = g - 1/(2L) = -1/(2 L (L+1)) ~ -1/(2 (log T0)^2). Ratio rate order 1, offset rate order 2.',
  ladder: RATE,
  offsetExponentFit: OFFSET_EXPONENT_FIT, // slope ~ -2.00, r2 ~ 1
  convergenceSummary: {
    offset_endpoint_1e280: OFFSET_ENDPOINT, // ~-1.2e-6 (down from ~-7.76e-4 at 1e12)
    ratio_endpoint_1e280: RATIO_ENDPOINT, // ~0.998 (up from ~0.959 at 1e12)
    offset_over_closedForm_endpoint: OFFSET_OVER_CF_ENDPOINT, // ~1.00: -1/(2 L (L+1)) is the exact leading term
    ratio_dev_times_L_endpoint: RATIODEV_L_ENDPOINT, // ~1.00: (1 - g/law)*log T0 -> 1 (order-1 ratio rate)
    offset_magnitude_monotone_decreasing: OFFSET_MONOTONE,
    ratio_monotone_increasing: RATIO_MONOTONE,
    I1_max_deviation: MAX_I1_DEV, // ~1e-11 sanity: pointwise gap_ecoll = g throughout
  },
  findings: {
    F1_g_converges_to_law:
      'YES: the pointwise reference offset off = g - 1/(2 log T0) decreases monotonically in ' +
      'magnitude from ~7.76e-4 at 1e12 to ~1.2e-6 at 1e280, and the ratio g/law rises monotonically ' +
      'from ~0.959 to ~0.998. g -> 1/(2 log T0) as N grows.',
    F2_offset_rate_order_2:
      'The log|off| vs log(log T0) regression slope over the extended tail is ~-2.00 (r2 ~ 1): ' +
      '|off| ~ (log T0)^-2, matching the closed form -1/(2 L (L+1)); off/closedForm -> 1.',
    F3_ratio_rate_order_1:
      'The ratio deviation 1 - g/law ~ 1/log T0 to leading order: (1 - g/law)*log T0 -> 1 from ' +
      'above (1.075 at 1e12 down to ~1.003 at 1e280) -- the ratio converges one order slower than ' +
      'the offset.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (numerical, NOT rigorous). Extending the imp-33887 sub-terms from 1e12..1e15 to ' +
    '1e12..1e280 shows the I3 g-vs-law reference offset off = g - 1/(2 log T0) DOES converge to zero: ' +
    'monotonically in magnitude (~-7.76e-4 at 1e12 -> ~-1.2e-6 at 1e280) with a log-log decay slope ' +
    '~-2.00, i.e. |off| ~ (log T0)^-2 (ORDER 2 in 1/log T0), matching the closed form ' +
    '-1/(2 L (L+1)) (off/closedForm -> 1). The RATIO g/law -> 1 one order slower: 1 - g/law ~ ' +
    '1/log T0 (ORDER 1), with (1 - g/law)*log T0 -> 1 from above. The imp-33854 I1 identity ' +
    '(pointwise gap_ecoll = g) holds to ~1e-11 throughout. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the closed form is a MATCH to the ' +
    'measured decay, not a proven bound; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33887 (three-way split; I3 reference offset ~-6.3e-4, ratio g/law ~0.96 on 1e12..1e15); ' +
    'imp-33854 (identity I1 gap_ecoll=g to machine precision; I3 g -> 1/(2 log T0)); imp-33816 ' +
    '(pointwise gap_sigma ~ 1/(2 log T0)); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP33918_ECOLL_G_VS_LAW_REFERENCE_OFFSET_CONVERGENCE_RATE_ASSERTIONS = [
  {
    // (F1) The reference offset magnitude decreases monotonically toward 0 across the ladder.
    id: 'imp33918-offset-magnitude-monotone-decreasing',
    description: 'the g-vs-law reference offset |g - 1/(2 log T0)| strictly decreases across 1e12..1e280',
    holds: () => OFFSET_MONOTONE === true && Math.abs(OFFSET_ENDPOINT) < 1e-5,
  },
  {
    // (F1) The ratio g/law rises monotonically toward 1.
    id: 'imp33918-ratio-monotone-toward-one',
    description: 'ratio g/(1/(2 log T0)) rises monotonically from ~0.96 to ~0.998 (approaching 1)',
    holds: () => RATIO_MONOTONE === true && RATIO_ENDPOINT > 0.99 && RATIO_ENDPOINT < 1,
  },
  {
    // (F2) The offset decay is order 2 in 1/log T0: log-log slope ~ -2.
    id: 'imp33918-offset-decay-exponent-near-minus-two',
    description: 'log|off| vs log(log T0) regression slope is ~-2.00 (offset ~ (log T0)^-2, order 2)',
    holds: () => OFFSET_EXPONENT_FIT.slope < -1.9 && OFFSET_EXPONENT_FIT.slope > -2.1 && OFFSET_EXPONENT_FIT.r2 > 0.999,
  },
  {
    // (F2) The closed form -1/(2 L (L+1)) is the exact leading term of the offset.
    id: 'imp33918-offset-matches-closed-form-leading-term',
    description: 'off / (-1/(2 L (L+1))) -> 1: the closed form is the exact leading term of the offset',
    holds: () => Math.abs(OFFSET_OVER_CF_ENDPOINT - 1) < 0.02,
  },
  {
    // (F3) The ratio converges at order 1: (1 - g/law)*log T0 -> 1.
    id: 'imp33918-ratio-rate-order-one',
    description: '(1 - g/law)*log T0 -> 1 from above: the ratio deviation is order 1 in 1/log T0',
    holds: () => RATIODEV_L_ENDPOINT > 1 && RATIODEV_L_ENDPOINT < 1.05,
  },
  {
    // Sanity: imp-33854 I1 identity (pointwise gap_ecoll = g) holds to machine precision throughout.
    id: 'imp33918-i1-pointwise-equals-g-machine-precision',
    description: 'pointwise gap_ecoll = g to machine precision (imp-33854 I1) at every extended rung',
    holds: () => MAX_I1_DEV < 1e-8,
  },
  {
    // Honesty gate: measurement only, no QED, Platt-Trudgian stays SOTA.
    id: 'imp33918-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP33918_ECOLL_G_VS_LAW_REFERENCE_OFFSET_CONVERGENCE_RATE.isRigorous === false &&
      /NO QED/.test(IMP33918_ECOLL_G_VS_LAW_REFERENCE_OFFSET_CONVERGENCE_RATE.verdict) &&
      /remains SOTA/.test(IMP33918_ECOLL_G_VS_LAW_REFERENCE_OFFSET_CONVERGENCE_RATE.verdict),
  },
];

for (const a of IMP33918_ECOLL_G_VS_LAW_REFERENCE_OFFSET_CONVERGENCE_RATE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33918-ecoll-g-vs-law-reference-offset-convergence-rate assertion failed: ${a.id}`);
  }
}
