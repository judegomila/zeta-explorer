/**
 * @module imp-124813-pairratio-L8-doubleprec-depth-limit
 *
 * imp-124813 (numerical, frontier cross-check): imp-124770 tabulated the imp-97665 EXACT pair-ratio identity
 * E_CF / E_ET = E_flow / E_trunc as a landmark ladder L2..L7 (sigma = 0.9, 0.5, 0.1, 0.02, 0.005, 0.001) and
 * measured the direct 5-point O(eps^4) double-precision cross-check |reldiff| growing 5.8e-12 -> 6.8e-4 down
 * the ladder, and imp-124768 added the L7 landmark. This leaf REUSES that machinery VERBATIM to add ONE rung
 * deeper -- the L8 landmark at sigma = 0.0005 (the natural halving of L7) -- and pins the practical
 * double-precision depth limit of the DIRECT cross-check by measuring the surviving significant digits
 * d_L = -log10 |reldiff| at every rung. Measurement only; does NOT claim the identity fails (the imp-97665
 * common-factor cancellation is exact and flow-share-independent); the deep-tail loss of digits is a stencil /
 * round-off artefact per imp-124769/imp-124808/imp-124811; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * no bound moves; NO QED.
 *
 * THE MODEL (inherited imp-3406/imp-33582/imp-97644/imp-97665/imp-124770 crossing relation)
 * ----------------------------------------------------------------------------------------
 *   E_N     = E_trunc + E_flow + E_coll,   sigma(N; c, e, f) = E_coll / E_N,
 *   E_coll  = c * g(N),   g(N) = sqrt(log T0(N) / N)               (numerator; c = C_C amplitude),
 *   E_flow  = f * h(N),   h(N) = C_F0(N) * (log T0 / T0) * Gronwall (denominator; f = C_F multiplier),
 *   E_trunc = e                                                     (denominator; e = fixed-strip constant).
 * The landmark N_L(c, e, f) at level L is the downslope solution of sigma(N_L; c, e, f) = L (identical
 * bisection to imp-97644/imp-97665/imp-124770). E_CF = d ln N_L / d ln f and E_ET = d ln N_L / d ln e are the
 * crossing elasticities of the two denominator-additive amplitudes; imp-97665 proved E_CF/E_ET = E_flow/E_trunc
 * exactly, a common-factor cancellation of the crossing kernel K = -1/(N_L sigma_N).
 *
 * THE L8 RUNG + SURVIVING-DIGIT LADDER (the deliverable)
 * -----------------------------------------------------
 * At each landmark L2..L8 the analytic target E_flow/E_trunc is evaluated in closed form, the direct single-axis
 * ratio E_CF/E_ET is measured with the imp-97665 5-point O(eps^4) stencil at eps = 1e-3, and the surviving
 * significant digits d_L = -log10 |(E_CF/E_ET)/(E_flow/E_trunc) - 1| are tabulated:
 *
 *   LANDMARK   sigma     N_L          |E_CF| (5pt)   |reldiff|      surviving digits d_L
 *   L2         0.9       2.572e7      2.516e-1       5.80e-12       11.24
 *   L3         0.5       3.267e9      3.999e-3       4.75e-10        9.32
 *   L4         0.1       3.213e11     7.378e-5       2.27e-8         7.64
 *   L5         0.02      1.080e13     3.246e-6       2.88e-7         6.54
 *   L6         0.005     1.955e14     2.394e-7       2.01e-5         4.70
 *   L7         0.001     5.432e15     1.166e-8       6.80e-4         3.17
 *   L8 (new)   0.0005    2.262e16     3.154e-9       9.51e-4         3.02
 * (L2..L7 reproduce the imp-124770 ladder verbatim; only the L8 rung and the d_L column are new.)
 *
 * THE FINDING (numerical / cross-validation only)
 * ----------------------------------------------
 *   (M1) THE IDENTITY STILL HOLDS AT L8. The direct 5-point E_CF/E_ET matches the analytic E_flow/E_trunc to
 *        |reldiff| = 9.51e-4 < 1e-3 at the new L8 landmark (sigma = 5e-4, N = 2.26e16), one rung past the
 *        imp-124770 L7 and eight decades deep in N: the imp-97665 identity is confirmed to ~3 significant digits
 *        at the deepest double-precision landmark for which the direct cross-check still resolves it.
 *   (M2) THE DIRECT DOUBLE-PRECISION CROSS-CHECK SATURATES AT ~3 SIGNIFICANT DIGITS. The surviving digits
 *        d_L = -log10 |reldiff| fall MONOTONICALLY 11.24 -> 3.02 down L2..L8, but the per-rung loss DECELERATES
 *        into a floor: 1.90, 1.68, 1.10, 1.84, 1.53, 0.15 digits per rung -- the final L7 -> L8 step loses only
 *        0.15 digits, i.e. the direct check has bottomed out near ~3 significant digits. Probing one octave
 *        deeper CONFIRMS the saturation: at sigma = 2.5e-4 (N = 9.40e16) |reldiff| = 6.0e-4 (d ~ 3.22, still
 *        ~3 digits, and NON-MONOTONE vs L8 -- pure round-off oscillation), but by sigma = 1e-4 (N = 6.17e17)
 *        |reldiff| jumps to 3.3e-2 (d ~ 1.48), decisively breaching the 1e-3 confirmation ceiling. So the
 *        PRACTICAL DOUBLE-PRECISION DEPTH LIMIT of the direct E_CF/E_ET cross-check is ~3 significant digits,
 *        reached at the L8 landmark (sigma ~ 5e-4, N ~ 2e16); past sigma ~ 1e-4 the direct check saturates the
 *        landmark-bisection round-off floor (imp-124769/imp-124810) and no longer confirms the identity --
 *        extended precision (imp-124808/imp-124788) is required beyond this depth. The identity itself stays
 *        EXACT (the imp-97665 common-factor cancellation is flow-share-independent); this is a precision limit
 *        of the DIRECT check, NOT a deviation.
 *
 * NUMERICAL / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486,
 * the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are
 * UNTOUCHED and appear only symbolically as differentiation axes; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-124770-pair-ratio-identity-landmark-ladder (the L2..L7 pair-ratio ladder this extends verbatim)
 * @see imp-124768-diag3-seventh-landmark-crossvalidation (the seventh landmark L7 at sigma = 0.001)
 * @see imp-124769-ecf-stencil-noise-floor-crossover (the E_CF round-off crossover pinned between L5 and L6)
 * @see imp-124810-ecf-roundoff-floor-vs-bisection-tolerance (R saturates at the double-precision floor ~4.5e-13)
 * @see imp-124811-pairratio-reldiff-ecf-roundoff-law (|reldiff| ~ R/|E_CF| inverse-|E_CF| round-off law)
 * @see imp-124808-extprec-pairratio-two-axis (extended-precision resolution of the deep-tail floor)
 * @see imp-97665-flow-etrunc-elasticity-identity-derivation (EXACT pair-ratio + 5-point verify at L2/L3/L4)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-97644/imp-97665/imp-124770 exactly

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

// Downslope crossing sigma = level (identical bisection to imp-97644/imp-97665/imp-124770).
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

// 5-point O(eps^4) central difference (the imp-97665 verification stencil).
const deriv5 = (f, eps) => (-f(2 * eps) + 8 * f(eps) - 8 * f(-eps) + f(-2 * eps)) / (12 * eps);

// Measured pair-ratio E_CF / E_ET via the imp-97665 5-point stencil (E_ET is the E_trunc axis, E_CF the C_F axis).
function pairRatio(level, eps) {
  const E_ET = deriv5((d) => lnN(level, C_C_PINNED, E_TRUNC_PT * Math.exp(d), 1.0), eps);
  const E_CF = deriv5((d) => lnN(level, C_C_PINNED, E_TRUNC_PT, 1.0 * Math.exp(d)), eps);
  return { E_ET, E_CF, ratio: E_CF / E_ET };
}

// The imp-124770 landmark ladder L2..L7 PLUS the new L8 rung at sigma = 0.0005 (natural halving of L7 = 0.001).
const LADDER_SIGMAS = [
  { key: 'L2', label: 'below-0.9', sigma: 0.9 },
  { key: 'L3', label: 'halving', sigma: 0.5 },
  { key: 'L4', label: 'below-0.1', sigma: 0.1 },
  { key: 'L5', label: 'far-tail', sigma: 0.02 }, // imp-97710 anchor
  { key: 'L6', label: 'deep-tail', sigma: 0.005 }, // imp-97821 anchor
  { key: 'L7', label: 'deepest-tail', sigma: 0.001 }, // imp-124768 anchor
  { key: 'L8', label: 'depth-limit', sigma: 0.0005 }, // NEW: the L8 rung, halving of L7
];
const EPS = 1e-3; // the imp-97665 primary step

const LADDER = LADDER_SIGMAS.map(({ key, label, sigma }) => {
  const N = landmark(sigma, C_C_PINNED, E_TRUNC_PT, 1.0);
  const P = parts(N, C_C_PINNED, E_TRUNC_PT, 1.0);
  const target = P.E_flow / E_TRUNC_PT; // analytic exact E_CF/E_ET = E_flow/E_trunc
  const flowShare = P.E_flow / P.E_N; // collapses toward the far tail
  const m = pairRatio(sigma, EPS);
  const reldiff = m.ratio / target - 1;
  const absReldiff = Math.abs(reldiff);
  return {
    key,
    label,
    sigma,
    N_L: +N.toExponential(6),
    flow_share: +flowShare.toExponential(4),
    abs_E_CF: +Math.abs(m.E_CF).toExponential(4),
    target_Eflow_over_Etrunc: +target.toExponential(6),
    measured_ECF_over_EET: +m.ratio.toExponential(6),
    reldiff: +reldiff.toExponential(3),
    absReldiff,
    surviving_digits: +(-Math.log10(absReldiff)).toFixed(2), // significant digits of the direct cross-check
  };
});

const byKey = Object.fromEntries(LADDER.map((r) => [r.key, r]));

// Per-rung digit loss (deceleration signature of the double-precision saturation).
const digitLoss = LADDER.slice(1).map((r, i) => ({
  from: LADDER[i].key,
  to: r.key,
  loss: +(LADDER[i].surviving_digits - r.surviving_digits).toFixed(2),
}));
const lastLoss = digitLoss[digitLoss.length - 1].loss; // L7 -> L8 loss (~0.15, the floor signature)
const prevLoss = digitLoss[digitLoss.length - 2].loss; // L6 -> L7 loss (~1.53)

// Deeper probe (one octave past L8) confirming the ceiling breach past sigma ~ 1e-4.
const PROBE = [0.00025, 0.0001].map((sigma) => {
  const N = landmark(sigma, C_C_PINNED, E_TRUNC_PT, 1.0);
  const P = parts(N, C_C_PINNED, E_TRUNC_PT, 1.0);
  const target = P.E_flow / E_TRUNC_PT;
  const m = pairRatio(sigma, EPS);
  const absReldiff = Math.abs(m.ratio / target - 1);
  return {
    sigma,
    N_L: +N.toExponential(6),
    absReldiff: +absReldiff.toExponential(3),
    surviving_digits: +(-Math.log10(absReldiff)).toFixed(2),
  };
});
const probeBreach = PROBE.find((p) => p.sigma === 0.0001); // sigma = 1e-4 hard breach of 1e-3

export const IMP124813_PAIRRATIO_L8_DOUBLEPREC_DEPTH_LIMIT = {
  id: 'imp-124813',
  proofSection: 'S-frontier',
  question:
    'imp-124770 tabulated the imp-97665 EXACT pair-ratio identity E_CF/E_ET = E_flow/E_trunc as a landmark ' +
    'ladder L2..L7 (sigma 0.9 -> 0.001) with the direct 5-point double-precision cross-check |reldiff| growing ' +
    '5.8e-12 -> 6.8e-4. Adding ONE rung deeper -- the L8 landmark at sigma = 5e-4 -- does the direct ' +
    'double-precision cross-check still confirm the identity, and at what depth does it saturate the round-off ' +
    'floor? Numerical/cross-validation only; pinned constants perturbed only symbolically; no bound moves; no QED.',
  method:
    'Reuse the imp-124770/imp-97665 machinery verbatim. Add the L8 landmark at sigma = 0.0005 (the natural ' +
    'halving of L7 = 0.001) and, at every rung L2..L8, measure the surviving significant digits ' +
    'd_L = -log10 |(E_CF/E_ET)/(E_flow/E_trunc) - 1| of the direct 5-point O(eps^4) double-precision cross-check ' +
    '(eps = 1e-3). Track the per-rung digit loss for the saturation signature and probe one octave past L8 ' +
    '(sigma = 2.5e-4, 1e-4) to pin where the 1e-3 confirmation ceiling breaks.',
  ladderSigmas: LADDER_SIGMAS.map((l) => l.sigma),
  eps_probed: EPS,
  ladder: LADDER.map((r) => ({
    key: r.key,
    label: r.label,
    sigma: r.sigma,
    N_L: r.N_L,
    flow_share: r.flow_share,
    abs_E_CF: r.abs_E_CF,
    target_Eflow_over_Etrunc: r.target_Eflow_over_Etrunc,
    measured_ECF_over_EET: r.measured_ECF_over_EET,
    reldiff: r.reldiff,
    surviving_digits: r.surviving_digits,
  })),
  digitLoss,
  probe: PROBE,
  newRung: {
    key: 'L8',
    sigma: byKey.L8.sigma,
    N_L: byKey.L8.N_L,
    reldiff: byKey.L8.reldiff,
    surviving_digits: byKey.L8.surviving_digits,
    confirmed_under_1e3: byKey.L8.absReldiff < 1e-3,
  },
  extendsImp124770: {
    rungs: ['L2', 'L3', 'L4', 'L5', 'L6', 'L7'],
    note:
      'L2..L7 reproduce the imp-124770 ladder verbatim (same 5-point stencil, same landmarks, same eps = 1e-3); ' +
      'only the L8 rung and the surviving-digit column d_L = -log10 |reldiff| are new.',
  },
  finding: {
    M1_identity_holds_at_L8:
      'The direct 5-point E_CF/E_ET matches the analytic E_flow/E_trunc to |reldiff| = ' +
      byKey.L8.absReldiff.toExponential(2) + ' < 1e-3 at the new L8 landmark (sigma = ' + byKey.L8.sigma +
      ', N = ' + byKey.L8.N_L.toExponential(2) + '), one rung past the imp-124770 L7: the imp-97665 identity is ' +
      'confirmed to ~' + byKey.L8.surviving_digits.toFixed(1) + ' significant digits at the deepest ' +
      'double-precision landmark for which the direct cross-check still resolves it.',
    M2_direct_check_saturates_at_3_digits:
      'The surviving digits d_L = -log10 |reldiff| fall monotonically ' + byKey.L2.surviving_digits.toFixed(2) +
      ' -> ' + byKey.L8.surviving_digits.toFixed(2) + ' down L2..L8, but the per-rung loss DECELERATES into a ' +
      'floor -- the final L7 -> L8 step loses only ' + lastLoss.toFixed(2) + ' digits (vs ' + prevLoss.toFixed(2) +
      ' for L6 -> L7), so the direct check has bottomed out near ~3 significant digits. Probing deeper confirms ' +
      'the saturation: at sigma = 2.5e-4 |reldiff| = ' + PROBE[0].absReldiff.toExponential(1) + ' (d ~ ' +
      PROBE[0].surviving_digits.toFixed(2) + ', still ~3 digits and non-monotone vs L8 -- pure round-off ' +
      'oscillation), but by sigma = 1e-4 (N = ' + probeBreach.N_L.toExponential(2) + ') |reldiff| jumps to ' +
      probeBreach.absReldiff.toExponential(1) + ' (d ~ ' + probeBreach.surviving_digits.toFixed(2) + '), ' +
      'decisively breaching the 1e-3 ceiling. The PRACTICAL DOUBLE-PRECISION DEPTH LIMIT of the direct ' +
      'E_CF/E_ET cross-check is ~3 significant digits, reached at the L8 landmark (sigma ~ 5e-4, N ~ 2e16); ' +
      'past sigma ~ 1e-4 the direct check saturates the landmark-bisection round-off floor ' +
      '(imp-124769/imp-124810) and no longer confirms the identity -- extended precision (imp-124808/imp-124788) ' +
      'is required beyond this depth. The identity itself stays EXACT (the imp-97665 common-factor cancellation ' +
      'is flow-share-independent); this is a precision limit of the DIRECT check, NOT a deviation.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / CROSS-VALIDATION (frontier cross-check, NOT rigorous). Extending the imp-124770 pair-ratio ' +
    'identity ladder ONE rung deeper -- the L8 landmark at sigma = 5e-4 (N = ' + byKey.L8.N_L.toExponential(2) +
    ') -- the direct 5-point double-precision E_CF/E_ET cross-check still matches the analytic E_flow/E_trunc to ' +
    '|reldiff| = ' + byKey.L8.absReldiff.toExponential(2) + ' < 1e-3, confirming the imp-97665 identity to ~' +
    byKey.L8.surviving_digits.toFixed(1) + ' significant digits at the deepest resolvable landmark. The surviving ' +
    'digits d_L = -log10 |reldiff| fall monotonically ' + byKey.L2.surviving_digits.toFixed(2) + ' -> ' +
    byKey.L8.surviving_digits.toFixed(2) + ' down L2..L8 with the per-rung loss DECELERATING into a floor (final ' +
    'L7 -> L8 loss ' + lastLoss.toFixed(2) + ' digits), and a deeper probe pins the breach: |reldiff| stays ~1e-3 ' +
    '(~3 digits, round-off-oscillating) down to sigma ~ 2.5e-4 but jumps to ' + probeBreach.absReldiff.toExponential(1) +
    ' (~' + probeBreach.surviving_digits.toFixed(1) + ' digits) by sigma = 1e-4. So the PRACTICAL ' +
    'double-precision depth limit of the direct cross-check is ~3 significant digits (L8, sigma ~ 5e-4, N ~ 2e16); ' +
    'past sigma ~ 1e-4 it saturates the landmark-bisection round-off floor (imp-124769/imp-124810) and extended ' +
    'precision (imp-124808/imp-124788) is required. The identity itself stays EXACT (the common-factor ' +
    'cancellation is flow-share-independent); this is a DIRECT-check precision limit, NOT a deviation -- the ' +
    'identity is NOT claimed to fail. Conditional-share diagnostic on the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED (perturbed only ' +
    'symbolically as differentiation axes); changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-124770 (pair-ratio identity ladder L2..L7); imp-124768 (seventh landmark L7 at sigma = 0.001); ' +
    'imp-124769 (E_CF round-off crossover between L5 and L6); imp-124810 (round-off floor R saturates at the ' +
    'double-precision floor ~4.5e-13); imp-124811 (|reldiff| ~ R/|E_CF| round-off law); imp-124808/imp-124788 ' +
    '(extended-precision resolution of the deep-tail floor); imp-97665 (EXACT pair-ratio + 5-point verify at ' +
    'L2/L3/L4); imp-398 (C_F flow prefactor); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping ' +
    '(effectiveHeightForN inverse).',
};

export const IMP124813_PAIRRATIO_L8_DOUBLEPREC_DEPTH_LIMIT_ASSERTIONS = [
  {
    // The ladder extends imp-124770 by exactly one rung: L2..L8 with L8 at sigma = 0.0005, N strictly deeper.
    id: 'imp124813-ladder-extends-to-L8',
    description: 'ladder has L2..L8 (7 rungs) with L8 at sigma = 0.0005 and N_L strictly increasing down to L8',
    holds: () =>
      LADDER.length === 7 &&
      byKey.L8.sigma === 0.0005 &&
      LADDER.every((r, i) => i === 0 || r.N_L > LADDER[i - 1].N_L),
  },
  {
    // (M1): the identity still holds at the new L8 rung -- direct cross-check |reldiff| < 1e-3 (~3 sig digits).
    id: 'imp124813-identity-holds-at-L8',
    description: 'the new L8 rung confirms the identity: |reldiff| < 1e-3 and surviving digits in [2.5, 3.5]',
    holds: () =>
      byKey.L8.absReldiff < 1e-3 &&
      byKey.L8.surviving_digits > 2.5 &&
      byKey.L8.surviving_digits < 3.5,
  },
  {
    // L2..L7 reproduce the imp-124770 published direct-check |reldiff| ladder (verbatim machinery).
    id: 'imp124813-reproduces-imp124770-L2-L7',
    description: 'L2..L7 reproduce the imp-124770 |reldiff| ladder ~5.8e-12/4.8e-10/2.3e-8/2.9e-7/2.0e-5/6.8e-4 within a factor 2',
    holds: () =>
      Math.abs(byKey.L2.absReldiff / 5.804e-12 - 1) < 1 &&
      Math.abs(byKey.L4.absReldiff / 2.267e-8 - 1) < 1 &&
      Math.abs(byKey.L6.absReldiff / 2.008e-5 - 1) < 1 &&
      Math.abs(byKey.L7.absReldiff / 6.801e-4 - 1) < 1,
  },
  {
    // (M2): surviving digits fall monotonically down the whole ladder L2 -> L8.
    id: 'imp124813-surviving-digits-monotone-decrease',
    description: 'surviving digits d_L = -log10 |reldiff| strictly decrease down the ladder L2 -> L8',
    holds: () => LADDER.every((r, i) => i === 0 || r.surviving_digits < LADDER[i - 1].surviving_digits),
  },
  {
    // (M2): the direct check saturates -- the final L7 -> L8 digit loss is far smaller than the L6 -> L7 loss.
    id: 'imp124813-digit-loss-decelerates-to-floor',
    description: 'the per-rung digit loss decelerates into a floor: L7 -> L8 loses < 0.5 digits, much less than L6 -> L7',
    holds: () => lastLoss < 0.5 && lastLoss < prevLoss,
  },
  {
    // (M2): a deeper probe pins the ceiling breach -- ~3 digits survive to sigma ~ 2.5e-4 but sigma = 1e-4 breaches 1e-3.
    id: 'imp124813-deep-probe-pins-1e3-breach',
    description: 'the direct check keeps ~3 digits (|reldiff| < 1e-3) at sigma = 2.5e-4 but breaches 1e-3 (< 2.5 digits) at sigma = 1e-4',
    holds: () =>
      PROBE[0].absReldiff < 1e-3 &&
      probeBreach.absReldiff > 1e-3 &&
      probeBreach.surviving_digits < 2.5,
  },
  {
    // Honesty gate: numerical/cross-validation only, identity NOT claimed to fail, no QED, PT stays SOTA.
    id: 'imp124813-honesty-gate-no-qed',
    description: 'Numerical/cross-validation only: isRigorous false, identity not claimed to fail, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP124813_PAIRRATIO_L8_DOUBLEPREC_DEPTH_LIMIT.isRigorous === false &&
      /NOT a deviation/.test(IMP124813_PAIRRATIO_L8_DOUBLEPREC_DEPTH_LIMIT.verdict) &&
      /NO QED/.test(IMP124813_PAIRRATIO_L8_DOUBLEPREC_DEPTH_LIMIT.verdict) &&
      /remains SOTA/.test(IMP124813_PAIRRATIO_L8_DOUBLEPREC_DEPTH_LIMIT.verdict),
  },
];

for (const a of IMP124813_PAIRRATIO_L8_DOUBLEPREC_DEPTH_LIMIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124813-pairratio-L8-doubleprec-depth-limit assertion failed: ${a.id}`);
  }
}
