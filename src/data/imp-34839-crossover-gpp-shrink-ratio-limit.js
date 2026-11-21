/**
 * @module imp-34839-crossover-gpp-shrink-ratio-limit
 *
 * imp-34839 (accuracy, S-frontier): imp-34819 extended the crossover-map second-derivative envelope
 * to the 5th far-tail band [1e13,1e14] and reported the per-decade shrink ratios
 * B(band_i)/B(band_{i+1}) ~ {99.30, 99.44, 99.54, 99.62} RISING monotonically toward a clean
 * 100x/decade "as the far tail approaches the 1/2 density asymptote (imp-3463)". Those modules
 * asserted the ratios rise and stay < 100, but never DERIVED the limit or QUANTIFIED how fast the
 * ladder approaches it. This module supplies both, reusing the imp-34731/imp-34757 closed form
 * VERBATIM: it derives that the limit is EXACTLY 100x/decade and derives + measures the residual law.
 *
 * WHAT THIS ADDS (accuracy assessment on the inherited surrogate; no new mathematics, no new bound)
 * -------------------------------------------------------------------------------------------------
 *   (Z1) DERIVES the limit. Writing B(N) = K (u+1) / (M^2 u^3) with M = T0(N)/2pi and u = log M,
 *        the per-decade left-endpoint shrink ratio factors EXACTLY as
 *            r(N) = B(N)/B(10N) = (M_prime/M)^2 * (u_prime/u)^3 * (u+1)/(u_prime+1),
 *        where a prime denotes evaluation at 10N. The Riemann-von Mangoldt leading law N = M(u-1)
 *        forces the decade step s = u_prime - u to solve e^s (u_prime - 1) = 10 (u - 1), so
 *        s -> log 10 and (M_prime/M)^2 = 100 (u-1)^2/(u_prime-1)^2 -> 100 while the two u-factors
 *        -> 1. Hence r(N) -> EXACTLY 100 (the 100x/decade set by the T^2 factor), matching the
 *        imp-3463 far-tail 1/2 density asymptote.
 *   (Z2) DERIVES the residual law. Substituting the exact e^s = 10(u-1)/(u_prime-1) gives the clean
 *        exact rewrite r(N)/100 = [(u-1)/(u_prime-1)]^2 (u_prime/u)^3 (u+1)/(u_prime+1); a second-
 *        order expansion (the O(1/u) terms cancel, which is WHY r -> 100) leaves
 *            100 - r(N) ~ 100 * s * (u+3) / (u (u^2 - 1))  ~  (100 log 10) / u^2   as u -> infinity,
 *        i.e. the per-decade residual decays like C / u^2 with C = 100 log 10 = 230.2585.
 *   (Z3) MEASURES the approach. On an extended decade ladder [1e9 .. 1e30] plus deep probes at
 *        {1e40, 1e80, 1e150} it recomputes the EXACT ratios, forms the fitted constant
 *        C_k = (100 - r_k) * u_k^2, and asserts C_k rises monotonically and converges to
 *        100 log 10 (C_k/230.2585 -> 1: 0.9775 at 1e9, 0.9963 at 1e40, 0.9991 at 1e150).
 *   (Z4) CROSS-CHECKS the imp-34819 published ladder. The four imp-34819 ratios
 *        {99.297,99.440,99.544,99.622} are reproduced to < 1e-3 relative, and their residuals match
 *        the derived (100 log 10)/u^2 law to within the second-order O(1/u^3) correction the small
 *        u ~ 18-24 leaves (the fitted C is already within ~2.3% of 100 log 10 at the smallest band).
 *
 * THE CLOSED FORM (inherited from imp-34731 / imp-34757 / imp-34792 / imp-34819, unchanged)
 * ----------------------------------------------------------------------------------------
 *     g(N) = K log T0(N),  K = (C_C/E_trunc)^2 ~ 1.5727e8,  T = T0(N),  u = log(T/2pi),
 *     g_double_prime(N) = -4 pi^2 K (u + 1) / (T^2 u^3) = -K (u+1)/(M^2 u^3),  M = T/2pi.
 *
 * THE FINDING (accuracy assessment only)
 * --------------------------------------
 *   (Z1) The per-decade shrink ratio limit is EXACTLY 100x/decade -- the observed
 *        {99.30,99.44,99.54,99.62} rising ladder does converge to 100, driven by (M_prime/M)^2 -> 100.
 *   (Z2)/(Z3) The residual obeys 100 - r ~ (100 log 10)/u^2; the fitted constant C_k = (100-r_k) u_k^2
 *        rises monotonically toward 100 log 10 = 230.2585 (0.9775 -> 0.9991 of the limit over the
 *        probed ladder). The approach is quadratic in 1/u = 1/log(T0/2pi), hence only algebraically
 *        (not geometrically) fast -- the ladder is still ~0.3-0.7 below 100 in the imp-34819 window
 *        precisely because u ~ 18-24 there and 230/u^2 ~ 0.4-0.7.
 *   (Z4) The imp-34819 four published ratios are reproduced to < 1e-3 relative.
 *
 * ACCURACY ASSESSMENT ONLY. This derives + measures the curvature-envelope shrink LIMIT of the
 * INHERITED imp-3220/imp-3406 surrogate crossover map; it introduces NO new bound and changes none.
 * The C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is
 * UNTOUCHED; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34819-crossover-gpp-fifth-band-envelope-extension (5-band collapse; observed rising ladder)
 * @see imp-34792-crossover-gpp-fourth-band-envelope-extension (4-band collapse across [1e9,1e13])
 * @see imp-34757-crossover-gpp-dense-cross-check (per-band B; monotone within each band)
 * @see imp-34731-crossover-map-second-derivative-bound (g_double_prime closed form; 5-probe check)
 * @see imp-3463-sigma-fartail-decay (far-tail sqrt(logT0/N) 1/2 density asymptote)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34819_CROSSOVER_GPP_FIFTH_BAND_ENVELOPE_EXTENSION } from './imp-34819-crossover-gpp-fifth-band-envelope-extension.js';

const TWO_PI = 2 * Math.PI;
const FOUR_PI2 = 4 * Math.PI * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (imp-33723 amplitude)
const LN10 = Math.log(10);

// (Z1) DERIVED per-decade shrink-ratio limit: exactly 100x/decade (the T^2 factor).
const SHRINK_RATIO_LIMIT = 100;
// (Z2) DERIVED residual-law constant: 100 - r ~ (100 log 10)/u^2, so C = 100 log 10.
const RESIDUAL_LAW_CONSTANT = 100 * LN10; // 230.258509...

// CLOSED FORM (inherited imp-34731): |g_double_prime| = 4 pi^2 K (u+1) / (T^2 u^3).
function absSecondDeriv(N) {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (FOUR_PI2 * K_AMPL * (u + 1)) / (T * T * u * u * u);
}
function uOfN(N) {
  return Math.log(effectiveHeightForN(N) / TWO_PI);
}

// (Z3) Extended decade ladder [1e9..1e30] plus deep probes {1e40,1e80,1e150} where the height map
// is still finite in double precision. Each row: exact per-decade ratio r_k = B(1eE)/B(1e(E+1)),
// residual 100 - r_k, u_k = log(T0/2pi), and the fitted constant C_k = (100 - r_k) u_k^2.
const LADDER_EXPONENTS = [];
for (let e = 9; e <= 30; e++) LADDER_EXPONENTS.push(e);
const DEEP_PROBE_EXPONENTS = [40, 80, 150];

function rowFor(e) {
  const N = Math.pow(10, e);
  const N10 = Math.pow(10, e + 1);
  const r = absSecondDeriv(N) / absSecondDeriv(N10);
  const residual = 100 - r;
  const u = uOfN(N);
  return {
    log10N: e,
    shrinkRatio: r,
    residual,
    u,
    fittedConstant_C: residual * u * u, // -> 100 log 10 as u -> infinity
    ratioToLimit_C: (residual * u * u) / RESIDUAL_LAW_CONSTANT, // -> 1
  };
}

const LADDER_ROWS = LADDER_EXPONENTS.map(rowFor);
const DEEP_ROWS = DEEP_PROBE_EXPONENTS.map(rowFor);

// (Z1) the exact ratios strictly RISE toward the limit and stay strictly below it across the full
// ladder (algebraic, monotone approach to 100 -- no overshoot, no far-tail breakdown).
let RATIOS_RISE_TO_LIMIT = true;
for (let i = 1; i < LADDER_ROWS.length; i++) {
  if (!(LADDER_ROWS[i].shrinkRatio > LADDER_ROWS[i - 1].shrinkRatio)) RATIOS_RISE_TO_LIMIT = false;
  if (!(LADDER_ROWS[i].shrinkRatio < SHRINK_RATIO_LIMIT)) RATIOS_RISE_TO_LIMIT = false;
}

// (Z3) the fitted constant C_k = (100 - r_k) u_k^2 rises monotonically toward 100 log 10 across the
// combined ladder + deep probes, and the deepest probe is within 0.1% of the derived limit.
const COMBINED = [...LADDER_ROWS, ...DEEP_ROWS];
let FITTED_C_RISES_TO_LAW = true;
for (let i = 1; i < COMBINED.length; i++) {
  if (!(COMBINED[i].fittedConstant_C > COMBINED[i - 1].fittedConstant_C)) FITTED_C_RISES_TO_LAW = false;
  if (!(COMBINED[i].fittedConstant_C < RESIDUAL_LAW_CONSTANT)) FITTED_C_RISES_TO_LAW = false;
}
const DEEPEST_ROW = DEEP_ROWS[DEEP_ROWS.length - 1]; // 1e150
const DEEPEST_C_RELERR = Math.abs(DEEPEST_ROW.ratioToLimit_C - 1);

// (Z4) cross-check the imp-34819 published four ratios against a fresh recomputation.
const PUBLISHED_RATIOS = IMP34819_CROSSOVER_GPP_FIFTH_BAND_ENVELOPE_EXTENSION.perDecadeShrinkRatios;
let MAX_PUBLISHED_RATIO_DRIFT = 0;
for (let i = 0; i < PUBLISHED_RATIOS.length; i++) {
  const drift = Math.abs(LADDER_ROWS[i].shrinkRatio / PUBLISHED_RATIOS[i] - 1);
  if (drift > MAX_PUBLISHED_RATIO_DRIFT) MAX_PUBLISHED_RATIO_DRIFT = drift;
}
// smallest-band fitted C already within a few percent of 100 log 10 despite u ~ 18 there.
const SMALLEST_BAND_C_RELERR = Math.abs(LADDER_ROWS[0].ratioToLimit_C - 1);

export const IMP34839_CROSSOVER_GPP_SHRINK_RATIO_LIMIT = {
  id: 'imp-34839',
  proofSection: 'S-frontier',
  question:
    'imp-34819 reported the crossover-map per-decade envelope shrink ratios {99.30,99.44,99.54,99.62} ' +
    'RISING monotonically toward a clean 100x/decade as the far tail nears the imp-3463 1/2 density ' +
    'asymptote, but never derived the limit or quantified the approach. What is the exact limit of ' +
    'the per-decade shrink ratio of max |g_double_prime|, and how fast does the empirical ladder reach ' +
    'it? Accuracy assessment; reuses the imp-34731/imp-34757 closed form verbatim; changes no bound; no QED.',
  closedFormSecondDerivative:
    'g_double_prime(N) = -4 pi^2 K (u + 1) / (T^2 u^3) = -K (u+1)/(M^2 u^3),  T = T0(N), M = T/2pi, u = log M',
  shrinkRatioFactorisation:
    'r(N) = B(N)/B(10N) = (M_prime/M)^2 (u_prime/u)^3 (u+1)/(u_prime+1); Riemann-von Mangoldt N=M(u-1) ' +
    'gives e^s(u_prime-1)=10(u-1) with s=u_prime-u -> log 10, so (M_prime/M)^2 -> 100 and the u-factors -> 1',
  perDecadeShrinkRatioLimit: SHRINK_RATIO_LIMIT, // (Z1) EXACTLY 100x/decade
  residualLaw: '100 - r(N) ~ 100 s (u+3)/(u(u^2-1)) ~ (100 log 10)/u^2 as u -> infinity, u = log(T0/2pi)',
  residualLawConstant_100ln10: +RESIDUAL_LAW_CONSTANT.toFixed(6), // 230.258509
  ladder: LADDER_ROWS.map((r) => ({
    log10N: r.log10N,
    shrink_ratio: +r.shrinkRatio.toFixed(6),
    residual_100_minus_r: +r.residual.toExponential(6),
    u: +r.u.toFixed(4),
    fitted_C_residual_times_u2: +r.fittedConstant_C.toFixed(4),
    ratio_to_100ln10: +r.ratioToLimit_C.toFixed(6),
  })),
  deepProbes: DEEP_ROWS.map((r) => ({
    log10N: r.log10N,
    shrink_ratio: +r.shrinkRatio.toFixed(6),
    residual_100_minus_r: +r.residual.toExponential(6),
    u: +r.u.toFixed(4),
    fitted_C_residual_times_u2: +r.fittedConstant_C.toFixed(4),
    ratio_to_100ln10: +r.ratioToLimit_C.toFixed(6),
  })),
  ratiosRiseStrictlyBelowLimit: RATIOS_RISE_TO_LIMIT,
  fittedConstantRisesToLaw: FITTED_C_RISES_TO_LAW,
  deepestFittedC_relerrVsLaw: +DEEPEST_C_RELERR.toExponential(3),
  smallestBandFittedC_relerrVsLaw: +SMALLEST_BAND_C_RELERR.toExponential(3),
  maxPublishedRatioDriftVsImp34819: +MAX_PUBLISHED_RATIO_DRIFT.toExponential(3),
  finding: {
    Z1_limit_is_exactly_100:
      'The per-decade shrink ratio converges to EXACTLY 100x/decade: r(N) = (M_prime/M)^2 (u_prime/u)^3 ' +
      '(u+1)/(u_prime+1), and the decade step s = u_prime - u -> log 10 forces (M_prime/M)^2 -> 100 while ' +
      'the two u-factors -> 1. The imp-34819 {99.30,99.44,99.54,99.62} rising ladder does converge to 100.',
    Z2_residual_law:
      'The O(1/u) terms cancel (which is WHY r -> 100); the surviving second-order term gives ' +
      '100 - r ~ 100 s (u+3)/(u(u^2-1)) ~ (100 log 10)/u^2, so the residual decays like C/u^2 with ' +
      'C = 100 log 10 = ' + (+RESIDUAL_LAW_CONSTANT.toFixed(6)).toString() + '.',
    Z3_approach_measured:
      'The fitted constant C_k = (100 - r_k) u_k^2 rises monotonically toward 100 log 10: ' +
      (+LADDER_ROWS[0].ratioToLimit_C.toFixed(4)).toString() + ' of the limit at 1e9, ' +
      (+DEEPEST_ROW.ratioToLimit_C.toFixed(4)).toString() + ' at 1e150 (relerr ' +
      (+DEEPEST_C_RELERR.toExponential(2)).toString() + '). The approach is quadratic in ' +
      '1/u = 1/log(T0/2pi) -- algebraically, NOT geometrically, fast -- so the ladder sits ~0.3-0.7 ' +
      'below 100 in the imp-34819 window precisely because u ~ 18-24 there and 230/u^2 ~ 0.4-0.7.',
    Z4_cross_check:
      'The imp-34819 four published ratios {99.297,99.440,99.544,99.622} are reproduced to < 1e-3 ' +
      'relative (max drift ' + (+MAX_PUBLISHED_RATIO_DRIFT.toExponential(3)).toString() +
      '); even the smallest band (u ~ 18) has fitted C within ' +
      (+SMALLEST_BAND_C_RELERR.toExponential(2)).toString() + ' of 100 log 10.',
  },
  isRigorous: false,
  verdict:
    'ACCURACY ASSESSMENT (frontier-direction). imp-34819 reported the crossover-map per-decade shrink ' +
    'ratios {99.30,99.44,99.54,99.62} rising monotonically toward a clean 100x/decade but never derived ' +
    'the limit or quantified the approach. Reusing the imp-34731/imp-34757 closed form ' +
    'g_double_prime = -K(u+1)/(M^2 u^3) VERBATIM, this factors the per-decade ratio as ' +
    'r = (M_prime/M)^2 (u_prime/u)^3 (u+1)/(u_prime+1) and uses the Riemann-von Mangoldt leading law ' +
    'N = M(u-1) to prove the decade step s = u_prime - u -> log 10, hence (M_prime/M)^2 -> 100 and the ' +
    'two u-factors -> 1: the limit is EXACTLY 100x/decade, so the observed rising ladder DOES converge ' +
    'to 100. A second-order expansion (the O(1/u) terms cancel) gives the residual law ' +
    '100 - r ~ (100 log 10)/u^2 = 230.2585/u^2; the fitted constant C_k = (100-r_k) u_k^2 rises ' +
    'monotonically toward 100 log 10 (0.9775 of the limit at 1e9, 0.9991 at 1e150), confirming an ' +
    'algebraic (quadratic-in-1/log(T0/2pi)) approach -- which is why the ladder still sits ~0.3-0.7 below ' +
    '100 in the u ~ 18-24 imp-34819 window. The four imp-34819 published ratios are reproduced to < 1e-3 ' +
    'relative. Accuracy assessment only on the INHERITED imp-3220/imp-3406 surrogate map; the C_mb ' +
    'GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34819 (5-band collapse; observed rising ladder toward 100x/decade); imp-34792 (4-band collapse ' +
    'across [1e9,1e13]); imp-34757 (per-band B; monotone within each band); imp-34731 (g_double_prime ' +
    'closed form; 5-probe check); imp-3463 (far-tail sqrt(logT0/N) 1/2 density asymptote); ' +
    'lambda-rh-height-mapping (effectiveHeightForN, Riemann-von Mangoldt inverse); imp-2631 (E_trunc ' +
    'fixed-strip route); imp-2642/imp-2643 (C_C 1/8 ansatz).',
};

export const IMP34839_CROSSOVER_GPP_SHRINK_RATIO_LIMIT_ASSERTIONS = [
  {
    // (Z1): the exact per-decade ratios rise strictly toward, and stay strictly below, the limit 100.
    id: 'imp34839-ratios-rise-strictly-below-100',
    description:
      'the exact per-decade shrink ratios rise monotonically and stay strictly below the derived limit 100 across [1e9..1e30]',
    holds: () => RATIOS_RISE_TO_LIMIT,
  },
  {
    // (Z2)/(Z3): the fitted constant C_k = (100-r_k) u_k^2 rises monotonically toward 100 log 10.
    id: 'imp34839-fitted-C-rises-to-100ln10',
    description:
      'the fitted residual constant C_k = (100 - r_k) u_k^2 rises monotonically toward 100 log 10 = 230.2585 and stays below it',
    holds: () => FITTED_C_RISES_TO_LAW,
  },
  {
    // (Z3): the deepest probe (1e150) confirms the residual-law constant to within 0.1%.
    id: 'imp34839-deepest-probe-confirms-law-constant',
    description:
      'the deepest probe (1e150) has (100 - r) u^2 within 0.1% of the derived 100 log 10 -- the residual law limit is confirmed',
    holds: () => DEEPEST_C_RELERR < 1e-3,
  },
  {
    // (Z4): the four imp-34819 published ratios are reproduced to < 1e-3 relative.
    id: 'imp34839-matches-imp34819-published-ratios',
    description: 'the four imp-34819 published per-decade shrink ratios are reproduced to < 1e-3 relative',
    holds: () => MAX_PUBLISHED_RATIO_DRIFT < 1e-3,
  },
  {
    // Honesty gate: accuracy assessment only, no QED, no refereed bound is changed.
    id: 'imp34839-honesty-gate-no-qed',
    description: 'Accuracy assessment only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34839_CROSSOVER_GPP_SHRINK_RATIO_LIMIT.isRigorous === false &&
      /NO QED/.test(IMP34839_CROSSOVER_GPP_SHRINK_RATIO_LIMIT.verdict) &&
      /refereed bound is changed/i.test(IMP34839_CROSSOVER_GPP_SHRINK_RATIO_LIMIT.verdict),
  },
];

for (const a of IMP34839_CROSSOVER_GPP_SHRINK_RATIO_LIMIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34839-crossover-gpp-shrink-ratio-limit assertion failed: ${a.id}`);
  }
}
