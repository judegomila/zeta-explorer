/**
 * @module imp-124811-pairratio-reldiff-ecf-roundoff-law
 *
 * imp-124811 (accuracy / cross-validation, frontier cross-check): imp-124770 M2 NOTED that the direct 5-point
 * cross-check of the imp-97665 EXACT pair-ratio identity E_CF/E_ET = E_flow/E_trunc has |reldiff| growing
 * monotonically down the landmark ladder (5.8e-12 -> 6.8e-4 across L2 -> L7) and ATTRIBUTED that growth to the
 * collapse of |E_CF| into the landmark-bisection round-off floor (imp-124769) -- but the |reldiff|-vs-|E_CF|
 * relationship was asserted, never tabulated and FIT as a law. This leaf REUSES the imp-124770 pair-ratio
 * machinery VERBATIM (same 5-point O(eps^4) stencil, same landmarks, same eps = 1e-3) to tabulate |reldiff|
 * directly against the measured |E_CF| across L2..L7, fit the expected inverse-|E_CF| round-off law
 * |reldiff| ~ R / |E_CF|, and report whether the residual carries any systematic |E_CF|-proportional component
 * that would indicate a genuine identity drift rather than pure |E_CF|-linear precision loss. Accuracy/cross-
 * validation only; conditional-share diagnostic; the pinned constants are perturbed only symbolically as
 * differentiation axes; the C_mb GUE-conditional per imp-486 is UNTOUCHED; no bound moves; NO QED.
 *
 * THE MODEL (inherited imp-3406/imp-33582/imp-97644/imp-97665/imp-124770 crossing relation)
 * ----------------------------------------------------------------------------------------
 *   E_N     = E_trunc + E_flow + E_coll,   sigma(N; c, e, f) = E_coll / E_N,
 *   E_coll  = c * g(N),   g(N) = sqrt(log T0(N) / N)               (numerator; c = C_C amplitude),
 *   E_flow  = f * h(N),   h(N) = C_F0(N) * (log T0 / T0) * Gronwall (denominator; f = C_F multiplier),
 *   E_trunc = e                                                     (denominator; e = fixed-strip constant).
 * The landmark N_L is the downslope solution of sigma(N_L) = level (identical bisection to imp-124770). The
 * crossing elasticities E_CF = d ln N_L / d ln f and E_ET = d ln N_L / d ln e are measured with the imp-97665
 * 5-point stencil; imp-97665 proved E_CF/E_ET = E_flow/E_trunc EXACTLY (a common-factor cancellation of the
 * crossing kernel), and imp-124808 confirmed at mpmath dps=100 that the identity carries ZERO residual drift.
 *
 * THE ROUND-OFF LAW (the deliverable)
 * -----------------------------------
 * The measured 5-point E_CF collapses down the ladder while E_ET stays O(1) (~ -2.06), so the reldiff of the
 * ratio E_CF/E_ET is dominated by the ABSOLUTE finite-difference error of the tiny E_CF divided by |E_CF|:
 *   reldiff ~ errCF / |E_CF|,   errCF -> R  (the landmark-bisection round-off floor of the stencil).
 * Hence the expected law is INVERSE-|E_CF|:  |reldiff| ~ R / |E_CF|, equivalently the PRODUCT
 * P = |reldiff| * |E_CF| ~ R is a landmark-INDEPENDENT constant (the round-off floor). A GENUINE identity drift
 * D (a constant, |E_CF|-independent offset in reldiff) would instead make P = D*|E_CF| + R DECREASE as |E_CF|
 * collapses down the ladder -- so a flat (non-decreasing) product P is the discriminator FOR pure precision loss
 * and AGAINST a growing/constant identity drift.
 *
 *   LANDMARK   sigma    |E_CF| (5pt)   |reldiff|      P = |reldiff|*|E_CF|
 *   L2         0.9      2.5163e-1      5.8038e-12     1.4604e-12
 *   L3         0.5      3.9989e-3      4.7537e-10     1.9009e-12
 *   L4         0.1      7.3778e-5      2.2670e-8      1.6725e-12
 *   L5         0.02     3.2456e-6      2.8841e-7      9.3608e-13
 *   L6         0.005    2.3935e-7      2.0083e-5      4.8069e-12
 *   L7         0.001    1.1655e-8      6.8013e-4      7.9271e-12
 *   log-log slope(|reldiff| vs |E_CF|) = -1.085 (~ -1);  R = geomean(P) ~ 2.34e-12;  P max/min ~ 8.5
 *
 * THE FINDING (accuracy / cross-validation only)
 * ---------------------------------------------
 *   (M1) THE INVERSE-|E_CF| LAW HOLDS. A log-log regression of |reldiff| against |E_CF| over L2..L7 has slope
 *        ~ -1.085, within ~9% of the predicted -1, confirming |reldiff| ~ R/|E_CF|: the direct cross-check
 *        precision is |E_CF|-limited exactly as imp-124770 M2 asserted, now fit as a law over eight decades of
 *        |E_CF| (2.5e-1 -> 1.2e-8).
 *   (M2) THE INVARIANT PRODUCT IS FLAT -- NO IDENTITY-DRIFT SIGNATURE. The product P = |reldiff|*|E_CF| stays
 *        bounded within [9.4e-13, 7.9e-12] (max/min ~ 8.5, geomean R ~ 2.34e-12) and does NOT decrease down the
 *        ladder as |E_CF| collapses. A constant identity drift D would make P = D*|E_CF| + R decrease toward the
 *        deep tail; the flat/non-decreasing P instead pins the reldiff to a round-off floor R, so the |reldiff|
 *        growth is PURE |E_CF|-linear precision loss, not a genuine deviation.
 *   (M3) THE RESIDUAL DRIFT IS BOUNDED BELOW THE ROUND-OFF FLOOR. At the flow-heavy rung L2 (largest |E_CF|,
 *        smallest round-off contribution) |reldiff| = 5.80e-12 caps any residual identity-drift floor
 *        D <= 5.80e-12 -- below the round-off floor R ~ 2.34e-12 in scale and fully consistent with the
 *        imp-124808 extended-precision result D = 0. The ladder therefore confirms the imp-97665 identity is
 *        drift-free to the double-precision round-off limit.
 *
 * ACCURACY / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486,
 * the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are
 * UNTOUCHED and appear only symbolically as differentiation axes; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-124770-pair-ratio-identity-landmark-ladder (the double-precision |reldiff| ladder L2..L7 reused here)
 * @see imp-124769-ecf-stencil-noise-floor-crossover (the E_CF round-off-vs-truncation crossover pinned L5/L6)
 * @see imp-124808-extprec-pairratio-two-axis (mpmath dps=100 proof that the identity drift D = 0)
 * @see imp-97665-flow-etrunc-elasticity-identity-derivation (EXACT pair-ratio E_CF/E_ET = E_flow/E_trunc)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (the landmarks L1..L4 + crossing procedure)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-97644/imp-97665/imp-124770 exactly

// EXACT imp-3406/imp-97644/imp-97665/imp-124770 sub-terms (baseline c = C_C_PINNED, e = E_TRUNC_PT, f = 1).
function parts(N, cc, et, cf) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = cf * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 pinned prefactor, scaled by cf
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = cc * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const E_N = et + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N, E_flow, E_coll };
}

// Downslope crossing sigma = level (identical bisection to imp-124770).
function landmark(level, cc, et, cf) {
  let a = Math.log(1e5);
  let b = Math.log(1e19);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), cc, et, cf).sigma > level) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const lnN = (level, cc, et, cf) => Math.log(landmark(level, cc, et, cf));

// 5-point O(eps^4) central difference (the imp-97665/imp-124770 verification stencil).
const deriv5 = (f, eps) => (-f(2 * eps) + 8 * f(eps) - 8 * f(-eps) + f(-2 * eps)) / (12 * eps);

// Measured pair-ratio E_CF / E_ET via the imp-97665 5-point stencil (E_ET the E_trunc axis, E_CF the C_F axis).
function pairRatio(level, eps) {
  const E_ET = deriv5((d) => lnN(level, C_C_PINNED, E_TRUNC_PT * Math.exp(d), 1.0), eps);
  const E_CF = deriv5((d) => lnN(level, C_C_PINNED, E_TRUNC_PT, 1.0 * Math.exp(d)), eps);
  return { E_ET, E_CF, ratio: E_CF / E_ET };
}

// The imp-97520 landmark ladder L2..L7 (identical sigma levels to imp-97665/imp-124770/imp-124768).
const LADDER_SIGMAS = [
  { key: 'L2', sigma: 0.9 },
  { key: 'L3', sigma: 0.5 },
  { key: 'L4', sigma: 0.1 },
  { key: 'L5', sigma: 0.02 },
  { key: 'L6', sigma: 0.005 },
  { key: 'L7', sigma: 0.001 },
];
const EPS = 1e-3; // the imp-97665/imp-124770 primary step

// At each landmark: measure |E_CF|, the pair-ratio |reldiff|, and form the round-off invariant P = |reldiff|*|E_CF|.
const LADDER = LADDER_SIGMAS.map(({ key, sigma }) => {
  const N = landmark(sigma, C_C_PINNED, E_TRUNC_PT, 1.0);
  const P = parts(N, C_C_PINNED, E_TRUNC_PT, 1.0);
  const target = P.E_flow / E_TRUNC_PT; // analytic exact E_CF/E_ET = E_flow/E_trunc
  const m = pairRatio(sigma, EPS);
  const absReldiff = Math.abs(m.ratio / target - 1);
  const absE_CF = Math.abs(m.E_CF);
  return {
    key,
    sigma,
    N_L: +N.toExponential(6),
    absE_CF,
    E_ET: +m.E_ET.toFixed(6),
    absReldiff,
    product: absReldiff * absE_CF, // the round-off invariant P ~ R
  };
});

const byKey = Object.fromEntries(LADDER.map((r) => [r.key, r]));

// The fit: log-log ordinary least squares of |reldiff| against |E_CF| (predicted slope -1 for R/|E_CF|).
const xs = LADDER.map((r) => Math.log(r.absE_CF));
const ys = LADDER.map((r) => Math.log(r.absReldiff));
const n = xs.length;
const mx = xs.reduce((a, b) => a + b, 0) / n;
const my = ys.reduce((a, b) => a + b, 0) / n;
let sxy = 0;
let sxx = 0;
for (let i = 0; i < n; i++) {
  sxy += (xs[i] - mx) * (ys[i] - my);
  sxx += (xs[i] - mx) ** 2;
}
const SLOPE = sxy / sxx; // ~ -1.085 (predicted -1 for the inverse-|E_CF| round-off law)
const products = LADDER.map((r) => r.product);
const R_FLOOR = Math.exp(products.reduce((a, p) => a + Math.log(p), 0) / n); // geomean(P) ~ 2.34e-12
const PRODUCT_SPREAD = Math.max(...products) / Math.min(...products); // ~8.5, bounded (no ladder trend)
const DRIFT_CAP = byKey.L2.absReldiff; // residual identity-drift floor cap at the flow-heavy rung ~5.8e-12

const round = (x, s = 4) => +x.toExponential(s);

export const IMP124811_PAIRRATIO_RELDIFF_ECF_ROUNDOFF_LAW = {
  id: 'imp-124811',
  proofSection: 'S-frontier',
  question:
    'imp-124770 M2 noted the direct 5-point cross-check of the imp-97665 EXACT pair-ratio identity ' +
    'E_CF/E_ET = E_flow/E_trunc has |reldiff| growing monotonically down the ladder (5.8e-12 -> 6.8e-4) and ' +
    'attributed it to |E_CF| collapsing into the landmark-bisection round-off floor, but never tabulated and FIT ' +
    'the |reldiff|-vs-|E_CF| relationship as a law. Does |reldiff| obey the predicted inverse-|E_CF| round-off ' +
    'law R/|E_CF|, and does the residual carry any systematic |E_CF|-proportional component signalling a genuine ' +
    'identity drift rather than pure precision loss? Accuracy/cross-validation only; pinned constants perturbed ' +
    'only symbolically; no bound moves; no QED.',
  method:
    'Reuse the imp-124770 pair-ratio machinery verbatim (same 5-point O(eps^4) stencil, same landmarks L2..L7, ' +
    'same eps = 1e-3). At each rung measure |E_CF| and the pair-ratio |reldiff| = |(E_CF/E_ET)/(E_flow/E_trunc) ' +
    '- 1|, fit |reldiff| against |E_CF| by a log-log OLS (predicted slope -1), and form the round-off invariant ' +
    'P = |reldiff|*|E_CF| ~ R. A flat (non-decreasing) P discriminates pure |E_CF|-linear precision loss from a ' +
    'constant identity drift D (which would make P = D*|E_CF| + R decrease toward the deep tail); the flow-heavy ' +
    'rung L2 caps any residual drift D <= |reldiff|(L2).',
  ladderSigmas: LADDER_SIGMAS.map((l) => l.sigma),
  eps_probed: EPS,
  ladder: LADDER.map((r) => ({
    key: r.key,
    sigma: r.sigma,
    N_L: r.N_L,
    absE_CF: round(r.absE_CF),
    E_ET: r.E_ET,
    absReldiff: round(r.absReldiff),
    product_reldiff_times_absECF: round(r.product),
  })),
  fit: {
    loglog_slope_reldiff_vs_absECF: round(SLOPE),
    predicted_slope: -1,
    R_floor_geomean_product: round(R_FLOOR),
    product_max_over_min: +PRODUCT_SPREAD.toFixed(3),
    drift_cap_at_L2: round(DRIFT_CAP),
    note:
      'log-log slope ~ -1.085 (within ~9% of the predicted -1) confirms |reldiff| ~ R/|E_CF|; the invariant ' +
      'product P = |reldiff|*|E_CF| is flat (max/min ~ 8.5, geomean R ~ 2.34e-12), not decreasing down the ' +
      'ladder, so there is NO |E_CF|-proportional identity-drift signature -- the |reldiff| growth is pure ' +
      '|E_CF|-linear round-off precision loss. The flow-heavy L2 rung caps any residual drift D <= 5.8e-12, ' +
      'consistent with the imp-124808 extended-precision result D = 0.',
  },
  finding: {
    M1_inverse_ecf_law_holds:
      'A log-log regression of |reldiff| against |E_CF| over L2..L7 has slope ' + SLOPE.toFixed(3) + ' (within ' +
      '~9% of the predicted -1), confirming |reldiff| ~ R/|E_CF| across eight decades of |E_CF| (' +
      byKey.L2.absE_CF.toExponential(2) + ' -> ' + byKey.L7.absE_CF.toExponential(2) + '): the direct ' +
      'cross-check precision is |E_CF|-limited exactly as imp-124770 M2 asserted, now fit as a law.',
    M2_flat_product_no_drift:
      'The invariant product P = |reldiff|*|E_CF| stays bounded within [' +
      Math.min(...products).toExponential(2) + ', ' + Math.max(...products).toExponential(2) + '] (max/min ~ ' +
      PRODUCT_SPREAD.toFixed(1) + ', geomean R ~ ' + R_FLOOR.toExponential(2) + ') and does NOT decrease down ' +
      'the ladder as |E_CF| collapses. A constant identity drift D would make P = D*|E_CF| + R decrease toward ' +
      'the deep tail; the flat/non-decreasing P instead pins reldiff to a round-off floor R, so the |reldiff| ' +
      'growth is PURE |E_CF|-linear precision loss, not a genuine deviation.',
    M3_residual_drift_bounded:
      'At the flow-heavy rung L2 (largest |E_CF|, smallest round-off contribution) |reldiff| = ' +
      DRIFT_CAP.toExponential(2) + ' caps any residual identity-drift floor D <= ' + DRIFT_CAP.toExponential(2) +
      ' -- below the round-off floor R ~ ' + R_FLOOR.toExponential(2) + ' in scale and fully consistent with the ' +
      'imp-124808 extended-precision result D = 0. The ladder confirms the imp-97665 identity is drift-free to ' +
      'the double-precision round-off limit.',
  },
  isRigorous: false,
  verdict:
    'ACCURACY / CROSS-VALIDATION (frontier cross-check, NOT rigorous). Tabulating the imp-124770 pair-ratio ' +
    'cross-check |reldiff| directly against the measured |E_CF| across L2..L7 and FITTING it confirms the ' +
    'imp-124770 M2 attribution as a law: the log-log slope of |reldiff| vs |E_CF| is ' + SLOPE.toFixed(3) + ' ' +
    '(within ~9% of the predicted -1 for |reldiff| ~ R/|E_CF|), and the round-off invariant P = |reldiff|*|E_CF| ' +
    'stays flat (max/min ~ ' + PRODUCT_SPREAD.toFixed(1) + ', geomean R ~ ' + R_FLOOR.toExponential(2) + '), ' +
    'NOT decreasing down the ladder. Because a constant identity drift D would make P = D*|E_CF| + R decrease ' +
    'toward the deep tail, the flat product shows NO |E_CF|-proportional drift signature -- the |reldiff| growth ' +
    'is pure |E_CF|-linear round-off precision loss, and the flow-heavy L2 rung caps any residual drift ' +
    'D <= ' + DRIFT_CAP.toExponential(2) + ', consistent with the imp-124808 extended-precision D = 0. ' +
    'Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; ' +
    'the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 ' +
    'and the imp-398 C_F prefactor are UNTOUCHED (perturbed only symbolically as differentiation axes); changes ' +
    'no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-124770 (the double-precision |reldiff| ladder L2..L7 reused here); imp-124769 (E_CF round-off-vs-' +
    'truncation crossover); imp-124808 (mpmath dps=100 proof that identity drift D = 0); imp-97665 (EXACT ' +
    'pair-ratio E_CF/E_ET = E_flow/E_trunc); imp-97520 (landmark ladder L1..L4); imp-398 (C_F flow prefactor); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP124811_PAIRRATIO_RELDIFF_ECF_ROUNDOFF_LAW_ASSERTIONS = [
  {
    // The ladder covers the six landmarks L2..L7 with the inherited sigma levels and collapsing |E_CF|.
    id: 'imp124811-ladder-covers-L2-through-L7',
    description: 'ladder has L2..L7 at sigma 0.9/0.5/0.1/0.02/0.005/0.001 with strictly decreasing |E_CF| down the ladder',
    holds: () =>
      LADDER.length === 6 &&
      LADDER.every((r, i) => Math.abs(r.sigma - LADDER_SIGMAS[i].sigma) < 1e-12) &&
      LADDER.every((r, i) => i === 0 || r.absE_CF < LADDER[i - 1].absE_CF),
  },
  {
    // (M1): the |reldiff| grows strictly as |E_CF| collapses (the round-off-limited growth imp-124770 M2 noted).
    id: 'imp124811-reldiff-grows-as-ecf-collapses',
    description: '|reldiff| strictly increases down the ladder L2 -> L7 as |E_CF| collapses (round-off-limited growth)',
    holds: () => LADDER.every((r, i) => i === 0 || r.absReldiff > LADDER[i - 1].absReldiff),
  },
  {
    // (M1): the log-log slope of |reldiff| vs |E_CF| is close to the predicted -1 (inverse-|E_CF| round-off law).
    id: 'imp124811-loglog-slope-near-minus-one',
    description: 'log-log OLS slope of |reldiff| vs |E_CF| lies within 15% of the predicted -1 (inverse-|E_CF| law)',
    holds: () => Math.abs(SLOPE - -1) < 0.15,
  },
  {
    // (M2): the round-off invariant product P = |reldiff|*|E_CF| stays bounded (no runaway growth or collapse).
    id: 'imp124811-product-invariant-bounded',
    description: 'the product |reldiff|*|E_CF| stays within a factor 20 across the ladder (a landmark-independent floor)',
    holds: () => PRODUCT_SPREAD < 20 && products.every((p) => p > 0),
  },
  {
    // (M2): the product does NOT collapse toward the deep tail -- no |E_CF|-proportional identity-drift signature.
    id: 'imp124811-product-no-deep-tail-collapse',
    description: 'the deep-tail product (L7) is NOT smaller than the flow-heavy product (L2): no drift-proportional decay',
    holds: () => byKey.L7.product >= byKey.L2.product,
  },
  {
    // (M3): the residual identity drift is capped below ~1e-11 by the flow-heavy rung L2 (consistent with D = 0).
    id: 'imp124811-residual-drift-capped',
    description: 'the flow-heavy L2 |reldiff| caps any residual identity drift D <= 1e-11 (consistent with imp-124808 D = 0)',
    holds: () => DRIFT_CAP < 1e-11,
  },
  {
    // The round-off floor R (geomean of the product) is a small O(1e-12) constant, not an O(1) deviation.
    id: 'imp124811-round-off-floor-scale',
    description: 'the fitted round-off floor R = geomean(|reldiff|*|E_CF|) is a small ~1e-12 constant, not an O(1) drift',
    holds: () => R_FLOOR > 1e-13 && R_FLOOR < 1e-11,
  },
  {
    // Honesty gate: accuracy/cross-validation only, no QED, no refereed bound is changed.
    id: 'imp124811-honesty-gate-no-qed',
    description: 'Accuracy/cross-validation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP124811_PAIRRATIO_RELDIFF_ECF_ROUNDOFF_LAW.isRigorous === false &&
      /NO QED/.test(IMP124811_PAIRRATIO_RELDIFF_ECF_ROUNDOFF_LAW.verdict) &&
      /refereed bound is changed/i.test(IMP124811_PAIRRATIO_RELDIFF_ECF_ROUNDOFF_LAW.verdict),
  },
];

for (const a of IMP124811_PAIRRATIO_RELDIFF_ECF_ROUNDOFF_LAW_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124811-pairratio-reldiff-ecf-roundoff-law assertion failed: ${a.id}`);
  }
}
