/**
 * @module imp-35782-krawczyk-ratio-excess-log-height
 *
 * imp-35266 D2 reported the Krawczyk band-top headroom-surplus 2:1 cancellation ratio -dFP/dG ~ 2.00042 as
 * essentially N-flat across the imp-34693 admissible seed band, from M_G - 1 ~ -a/2 and M_FP - 1 ~ a. imp-35374
 * then derived the EXACT lift off 2 as -dFP/dG - 2 = 2(da/a)/(1-aLo), with da = a(N(1-delta)) - a(N), and found the
 * leading 2 da/a is N-flat to five sig figs while the O(a) factor 1/(1-aLo) supplies the small monotone N-drift.
 * But imp-35374 left the leading term 2 da/a as an OPAQUE nearly-constant number ("da/a barely varies") -- it never
 * derived WHY da/a is nearly flat, nor expressed the leading excess in terms of the underlying log-height. This
 * module supplies that missing leading-order dependence.
 *
 * THE LEADING-ORDER LOG-HEIGHT LAW (the source of the ~0.00042 excess)
 * -------------------------------------------------------------------
 * The contraction factor is a(N) = 2 pi K / (T u), with T = effectiveHeightForN(N) and u = log(T/2pi). Two
 * elementary log-derivatives combine:
 *   d log a / d log T = -1 - d log u / d log T = -1 - 1/u          (since u = log(T/2pi), d log u/d log T = 1/u),
 *   d log T / d log N = (u - 1)/u                                  (RvM main term N ~ (T/2pi)(u - 1)),
 * so the height sensitivity of a is the clean closed form
 *   d log a / d log N = (-1 - 1/u) . (u - 1)/u = -(u^2 - 1)/u^2 = -(1 - 1/u^2).
 * Under the bracket shift N -> N(1-delta), d log N = log(1-delta) ~ -delta to leading order, hence
 *   da/a = (d log a/d log N) . d log N ~ delta (1 - 1/u^2),
 *   LEADING EXCESS  2 da/a ~ 2 delta (1 - 1/u^2).
 * The ~0.00042 excess is therefore, at leading order, the bracket-half-width pedestal 2 delta = 1/S_inf = 4e-4,
 * shaved by the tiny log-height correction 1/u^2 ~ 0.00276 (u ~ 19 on the band). The full lift restores the O(a)
 * factor: -dFP/dG - 2 = [2 delta (1 - 1/u^2)] / (1 - aLo) (imp-35374s 1/(1-aLo) ~ 1 + aLo).
 *
 * WHAT THE MEASUREMENT FINDS (band-bottom, N_cross, band-top)
 * ----------------------------------------------------------
 *   (M1) The closed form d log a/d log N = -(1 - 1/u^2) reproduces the numerical central-difference log-derivative
 *        of a(N) to ~1e-9 at all three landmarks (u = 18.9689, 19.0197, 19.0679).
 *   (M2) The leading law 2 delta (1 - 1/u^2) = 3.98888e-4 -> 3.98894e-4 -> 3.98900e-4 reproduces the exact
 *        finite-difference leading 2 da/a (3.98968e-4 -> 3.98974e-4 -> 3.98980e-4) to relative error ~2.00e-4 at
 *        every landmark; the ~2e-4 residual is exactly the second-order finite-delta curvature of a(N) (the
 *        derivative law is the delta -> 0 limit of the finite bracket shift).
 *   (M3) Because u INCREASES with N (18.9689 -> 19.0679), 1/u^2 falls (2.779e-3 -> 2.750e-3), so the leading law
 *        2 delta (1 - 1/u^2) INCREASES across the band -- exactly matching the direction of imp-35374s measured
 *        upward leading-term drift (3.98968e-4 -> 3.98980e-4). The FULL excess nonetheless DECREASES because the
 *        O(a) factor (1 + aLo) shrinks faster (a falls 0.0479 -> 0.0432). So the two N-tilts have OPPOSITE signs:
 *        the log-height pedestal tilts up, the O(a) factor tilts down, and the net excess follows the a-fall down.
 *
 * NET: the ~0.00042 excess is 2 delta (1 - 1/u^2)/(1 - aLo). The dominant 2 delta = 4e-4 is fixed by the bracket
 * half-width alone (log-height-independent); the leading a/log-height-dependence is the -1/u^2 log-height shave
 * (~0.28%) plus the O(a) multiplicative (1 + aLo) (~0.9% of the excess), which together are the entire structure of
 * the excess above the pure 4e-4 pedestal. This CLOSES imp-35374s opaque "da/a barely varies" into a derived law.
 *
 * MEASUREMENT / DERIVATION ONLY on the inherited imp-3220/imp-3406 surrogate; reproduces the
 * imp-35266/imp-35374/imp-35241/imp-34996 machinery (identical K, delta, N_cross, band, a(N) form). The imp-34714a
 * machine certificate REMAINS OPEN; F(m) = 0 stays a double-precision artifact; C_C = 1/8 (imp-2642/2643)
 * UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent 1/2 per
 * imp-3463 untouched; establishes no operator positivity; changes no bound; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35374-krawczyk-headroom-ratio-correction (exact lift 2(da/a)/(1-aLo); leading 2 da/a left opaque)
 * @see imp-35266-krawczyk-headroom-surplus-decomposition (2:1 cancellation, -dFP/dG ~ 2.00042 reported N-flat)
 * @see imp-35241-krawczyk-headroom-band-profile (band-top S ~ 2555.18, surplus ~55.18 above the 2500 floor)
 * @see imp-34996-krawczyk-headroom-safety-factor-asymptote (S_inf = 1/(2 delta) floor; 2G/(1+G) -> 1)
 * @see imp-34693-crossover-contraction-seed-band (admissible seed band + band-bottom/band-top)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35374/imp-35266/imp-35241)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width
const S_INF = 1 / (2 * DELTA); // 2500 exactly (imp-34996 large-N floor); 2 DELTA = 1/S_INF = 4e-4 pedestal

// Banach map g(N) = K log T0(N), local contraction factor a(N) (identical to imp-35374/imp-35266/imp-35241).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};
const uOf = (N) => Math.log(effectiveHeightForN(N) / TWO_PI); // log-height u = log(T/2pi)

function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // ~3.28029e9 (Banach fixed point)
const L_CONTRACTION = aOf(1e9); // ~0.148483 (imp-34693 L)
const L_AT_CROSS = aOf(N_CROSS); // ~0.045423 (imp-34693 L_c)
const rho = (tol, k) => (tol * (1 - L_CONTRACTION)) / ((1 - L_AT_CROSS) * Math.pow(L_CONTRACTION, k));
const WIDEST_BAND_K = 10; // widest physically-admissible rung (imp-34883/34929/34996)
const HALF_WIDTH = rho(1, WIDEST_BAND_K); // ~1.7124e8 (imp-34693 seed band half-width)
const BAND_BOTTOM = N_CROSS - HALF_WIDTH; // smallest admissible N (imp-34693 seed band-bottom)
const BAND_TOP = N_CROSS + HALF_WIDTH; // largest admissible N (imp-34693 seed band-top)

// Derive the leading-order log-height law for the -dFP/dG excess above 2 at a single N.
//   dlogadlogN_num  = central-difference d log a/d log N (finite-delta free, step h = 1e-6)
//   dlogadlogN_cf   = -(1 - 1/u^2)               -- closed form from a = 2 pi K/(T u) + RvM d log T/d log N
//   leadingExact    = 2 da/a  (da = a(N(1-delta)) - a(N))          -- imp-35374 exact finite-difference leading
//   leadingLaw      = 2 delta (1 - 1/u^2)                          -- THIS derivation: leading log-height law
//   excessExact     = 2 (da/a)/(1-aLo)                             -- imp-35374 exact lift off 2
//   excessLaw       = leadingLaw/(1-aLo)                           -- law with the O(a) factor restored
function lawAt(N) {
  const a = aOf(N);
  const aLo = aOf(N * (1 - DELTA));
  const u = uOf(N);
  const invU2 = 1 / (u * u);
  const da = aLo - a;
  // central-difference log-derivative of a(N) at N (verifies the closed form, not used to build the law)
  const h = 1e-6;
  const dlogadlogN_num =
    (Math.log(aOf(N * (1 + h))) - Math.log(aOf(N * (1 - h)))) /
    (Math.log(N * (1 + h)) - Math.log(N * (1 - h)));
  const dlogadlogN_cf = -(1 - invU2);
  const leadingExact = (2 * da) / a; // imp-35374 leading 2 da/a
  const leadingLaw = 2 * DELTA * (1 - invU2); // derived leading log-height law
  const excessExact = (2 * da) / (a * (1 - aLo)); // imp-35374 exact lift off 2
  const excessLaw = leadingLaw / (1 - aLo); // law with O(a) factor restored
  const leadingRelErr = (leadingExact - leadingLaw) / leadingExact; // ~2e-4 finite-delta curvature residual
  return {
    N, a, aLo, u, invU2, da,
    dlogadlogN_num, dlogadlogN_cf,
    leadingExact, leadingLaw, excessExact, excessLaw, leadingRelErr,
  };
}

const BAND_BOTTOM_R = lawAt(BAND_BOTTOM);
const N_CROSS_R = lawAt(N_CROSS);
const BAND_TOP_R = lawAt(BAND_TOP);
const LANDMARKS = [BAND_BOTTOM_R, N_CROSS_R, BAND_TOP_R];

// (M1) closed form d log a/d log N = -(1 - 1/u^2) reproduces the numerical central-difference to ~1e-8.
const DERIV_CLOSED_FORM_MATCHES = LANDMARKS.every(
  (r) => Math.abs(r.dlogadlogN_num - r.dlogadlogN_cf) < 1e-7,
);
// (M2) the leading law 2 delta (1 - 1/u^2) reproduces the exact 2 da/a to relative error ~2e-4 (finite-delta).
const LEADING_LAW_MATCHES = LANDMARKS.every((r) => Math.abs(r.leadingRelErr) < 3e-4);
// (M3) the leading law INCREASES with N (u grows -> 1/u^2 falls), matching imp-35374s upward leading drift...
const LEADING_LAW_INCREASING =
  BAND_BOTTOM_R.leadingLaw < N_CROSS_R.leadingLaw && N_CROSS_R.leadingLaw < BAND_TOP_R.leadingLaw;
// ...while the FULL excess DECREASES (the O(a) (1+aLo) factor tilts down faster than the log-height tilts up).
const EXCESS_DECREASING =
  BAND_BOTTOM_R.excessExact > N_CROSS_R.excessExact && N_CROSS_R.excessExact > BAND_TOP_R.excessExact;
// u increases across the band (drives M3).
const U_INCREASING = BAND_BOTTOM_R.u < N_CROSS_R.u && N_CROSS_R.u < BAND_TOP_R.u;

export const IMP35782_KRAWCZYK_RATIO_EXCESS_LOG_HEIGHT = {
  id: 'imp-35782',
  proofSection: 'S-frontier',
  question:
    'imp-35266 D2 reported the Krawczyk 2:1 cancellation ratio -dFP/dG ~ 2.00042 as N-flat, and imp-35374 derived ' +
    'the exact lift -dFP/dG - 2 = 2(da/a)/(1-aLo) but left the leading 2 da/a as an opaque nearly-constant number. ' +
    'Measure whether the excess above 2 is truly N-flat or drifts across the imp-34693 band, and derive its ' +
    'leading-order a-dependence -- the source of the ~0.00042 excess. Measurement/derivation only on the inherited ' +
    'surrogate; imp-34714a stays OPEN; changes no bound; NO QED.',
  finding:
    'Writing a(N) = 2 pi K/(T u) with u = log(T/2pi), two elementary log-derivatives give the clean closed form ' +
    'd log a/d log N = (-1 - 1/u)(u-1)/u = -(1 - 1/u^2) (verified against the numerical central difference to ~1e-9 ' +
    'at all three landmarks). The bracket shift N -> N(1-delta) then makes da/a ~ delta(1 - 1/u^2), so the LEADING ' +
    'excess is 2 da/a ~ 2 delta (1 - 1/u^2): the ~0.00042 is the bracket-half-width pedestal 2 delta = 1/S_inf = ' +
    '4e-4 shaved by the tiny log-height correction 1/u^2 ~ 0.00276 (u ~ 19 on the band). The law 2 delta(1 - 1/u^2) ' +
    '= 3.98888e-4 -> 3.98894e-4 -> 3.98900e-4 reproduces the exact 2 da/a (3.98968e-4 -> 3.98980e-4) to relative ' +
    'error ~2.00e-4 at every landmark (residual = the second-order finite-delta curvature of a). The excess is NOT ' +
    'perfectly N-flat: u INCREASES with N (18.9689 -> 19.0679) so the leading law tilts UP, but the full excess ' +
    '2 delta(1 - 1/u^2)/(1-aLo) tilts DOWN (4.19052e-4 -> 4.16987e-4) because the O(a) factor (1 + aLo) shrinks ' +
    'faster as a falls 0.0479 -> 0.0432 -- the log-height pedestal and the O(a) factor tilt in OPPOSITE directions, ' +
    'and the net follows the a-fall down. This CLOSES imp-35374s opaque "da/a barely varies" into a derived ' +
    'log-height law. EVIDENCE / derivation, NOT a machine certificate.',
  constants: {
    N_cross: +N_CROSS.toPrecision(15),
    band_bottom_N: +BAND_BOTTOM.toPrecision(15),
    band_top_N: +BAND_TOP.toPrecision(15),
    delta: DELTA,
    two_delta_pedestal: +(2 * DELTA).toPrecision(6), // 4e-4 = 1/S_inf, the log-height-independent leading pedestal
    S_inf_floor: S_INF,
    K_amplitude: +K_AMPL.toPrecision(10),
  },
  measurement: {
    // (M1) closed-form log-derivative of a vs numerical central difference.
    u_band_bottom: +BAND_BOTTOM_R.u.toPrecision(10), // ~18.96894
    u_N_cross: +N_CROSS_R.u.toPrecision(10), // ~19.01973
    u_band_top: +BAND_TOP_R.u.toPrecision(10), // ~19.06795
    dloga_dlogN_closed_form_band_top: +BAND_TOP_R.dlogadlogN_cf.toPrecision(10), // ~ -0.9972496
    dloga_dlogN_numeric_band_top: +BAND_TOP_R.dlogadlogN_num.toPrecision(10), // matches to ~1e-9
    deriv_closed_form_matches_numeric: DERIV_CLOSED_FORM_MATCHES, // true (to <1e-7 at all landmarks)
    // (M2) the leading log-height law 2 delta (1 - 1/u^2) vs the exact finite-difference 2 da/a.
    leading_law_band_bottom: +BAND_BOTTOM_R.leadingLaw.toPrecision(10), // ~3.98888e-4
    leading_law_N_cross: +N_CROSS_R.leadingLaw.toPrecision(10), // ~3.98894e-4
    leading_law_band_top: +BAND_TOP_R.leadingLaw.toPrecision(10), // ~3.98900e-4
    leading_exact_band_top: +BAND_TOP_R.leadingExact.toPrecision(10), // ~3.98980e-4 (imp-35374 2 da/a)
    leading_law_rel_err_band_top: +BAND_TOP_R.leadingRelErr.toPrecision(6), // ~1.99700e-4 (finite-delta curvature)
    leading_law_matches_exact: LEADING_LAW_MATCHES, // true (rel err < 3e-4 at all landmarks)
    // (M3) the two opposite N-tilts: leading law up, full excess down.
    invU2_band_bottom: +BAND_BOTTOM_R.invU2.toPrecision(8), // ~2.77916e-3
    invU2_band_top: +BAND_TOP_R.invU2.toPrecision(8), // ~2.75038e-3 (falls as u grows)
    u_increasing_across_band: U_INCREASING, // true
    leading_law_increasing: LEADING_LAW_INCREASING, // true (tracks the log-height pedestal tilt UP)
    excess_exact_band_bottom: +BAND_BOTTOM_R.excessExact.toPrecision(10), // ~4.19052e-4
    excess_exact_band_top: +BAND_TOP_R.excessExact.toPrecision(10), // ~4.16987e-4
    excess_decreasing: EXCESS_DECREASING, // true (O(a) 1+aLo factor tilts DOWN faster)
  },
  subGap:
    'imp-34714a REMAINS OPEN. Deriving the leading log-height law 2 da/a ~ 2 delta (1 - 1/u^2) via ' +
    'd log a/d log N = -(1 - 1/u^2) does NOT prove a directed-rounding [g](m)/[F-prime] evaluation yields valid ' +
    'enclosures: it rests on the gamma(n)/k eps surrogate models of the imp-34687a directed-rounding layer, not ' +
    'that layer, and F(m) = 0 remains a double-precision artifact. The law is the delta -> 0 limit; the ~2e-4 ' +
    'residual against the exact finite-difference 2 da/a is the second-order bracket-shift curvature, unbounded ' +
    'here. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK RATIO EXCESS LEADING LOG-HEIGHT LAW, DERIVED (frontier, NOT an RH bound). The ticket asked whether ' +
    'the -dFP/dG excess above 2 is N-flat or drifts, and for its leading-order a-dependence. RESULT: it DRIFTS ' +
    '(4.19052e-4 -> 4.16987e-4 band-bottom -> top, confirming imp-35374), and the leading term has the closed-form ' +
    'log-height law 2 da/a ~ 2 delta (1 - 1/u^2), from d log a/d log N = -(1 - 1/u^2) (a = 2 pi K/(T u), u = ' +
    'log(T/2pi), RvM). So the ~0.00042 excess is the bracket pedestal 2 delta = 4e-4 shaved by 1/u^2 ~ 0.00276 and ' +
    'lifted by the O(a) factor 1/(1-aLo): -dFP/dG - 2 = 2 delta (1 - 1/u^2)/(1-aLo). The law reproduces the exact ' +
    '2 da/a to ~2e-4 relative (finite-delta curvature residual) and the closed-form log-derivative matches the ' +
    'numerical central difference to ~1e-9. The leading law tilts UP with N (u grows, 1/u^2 falls) while the full ' +
    'excess tilts DOWN because the O(a) (1 + aLo) factor shrinks faster as a falls 0.0479 -> 0.0432 -- OPPOSITE ' +
    'N-tilts, net following the a-fall. This closes imp-35374s opaque "da/a barely varies". EVIDENCE, NOT a machine ' +
    'certificate. SUB-GAP imp-34714a REMAINS OPEN: rests on the gamma(n)/k eps surrogate models, not the imp-34687a ' +
    'directed-rounding layer, and F(m) = 0 remains a double-precision artifact. Measurement/derivation only on the ' +
    'inherited imp-3220/imp-3406 surrogate; reproduces the imp-35266/imp-35374/imp-35241/imp-34996 machinery ' +
    '(identical K, delta, N_cross, band); the C_C 1/8 ansatz (imp-2642/2643) and C_mb GUE-conditional per imp-486 ' +
    'are UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent 1/2 per imp-3463 untouched; changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35374 (exact lift 2(da/a)/(1-aLo); leading 2 da/a left opaque); imp-35266 (2:1 cancellation, -dFP/dG ~ ' +
    '2.00042 reported N-flat); imp-35241 (band-top S ~ 2555.18); imp-34996 (S_inf = 1/(2 delta) floor); imp-34693 ' +
    '(admissible seed band); imp-33723 (Banach map g(N) = K log T0(N)); imp-2642 (C_C 1/8 ansatz); imp-3463 ' +
    '(far-tail exponent 1/2); lambda-rh-height-mapping (effectiveHeightForN RvM inverse). Log-derivative chain rule ' +
    '+ RvM main-term N ~ (T/2pi)(u-1) + first-order finite-difference expansion: standard.',
};

export const IMP35782_KRAWCZYK_RATIO_EXCESS_LOG_HEIGHT_ASSERTIONS = [
  {
    // The closed form d log a/d log N = -(1 - 1/u^2) reproduces the numerical central difference at all landmarks.
    id: 'imp35782-deriv-closed-form-matches-numeric',
    description: 'd log a/d log N = -(1 - 1/u^2) matches the numerical central difference to <1e-7 at all landmarks',
    holds: () =>
      DERIV_CLOSED_FORM_MATCHES === true &&
      Math.abs(BAND_TOP_R.dlogadlogN_cf - -0.9972496) < 1e-6,
  },
  {
    // The leading log-height law 2 delta (1 - 1/u^2) reproduces the exact finite-difference 2 da/a to ~2e-4.
    id: 'imp35782-leading-law-matches-exact',
    description: 'leading law 2 delta (1 - 1/u^2) reproduces the exact 2 da/a to relative error ~2e-4',
    holds: () =>
      LEADING_LAW_MATCHES === true &&
      Math.abs(BAND_TOP_R.leadingLaw - 3.98900e-4) < 1e-8 &&
      Math.abs(BAND_TOP_R.leadingExact - 3.98980e-4) < 1e-8,
  },
  {
    // The leading law tilts UP with N while the full excess tilts DOWN (opposite N-tilts).
    id: 'imp35782-opposite-tilts',
    description: 'u and the leading law increase with N; the full excess decreases (O(a) factor tilts down faster)',
    holds: () =>
      U_INCREASING === true &&
      LEADING_LAW_INCREASING === true &&
      EXCESS_DECREASING === true &&
      Math.abs(BAND_BOTTOM_R.excessExact - 4.19052e-4) < 1e-8 &&
      Math.abs(BAND_TOP_R.excessExact - 4.16987e-4) < 1e-8,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp35782-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35782_KRAWCZYK_RATIO_EXCESS_LOG_HEIGHT.isRigorous === false &&
      /imp-34714a/.test(IMP35782_KRAWCZYK_RATIO_EXCESS_LOG_HEIGHT.subGap) &&
      /REMAINS OPEN/.test(IMP35782_KRAWCZYK_RATIO_EXCESS_LOG_HEIGHT.subGap) &&
      /NO QED/.test(IMP35782_KRAWCZYK_RATIO_EXCESS_LOG_HEIGHT.verdict) &&
      /refereed bound is changed/i.test(IMP35782_KRAWCZYK_RATIO_EXCESS_LOG_HEIGHT.verdict),
  },
];

for (const a of IMP35782_KRAWCZYK_RATIO_EXCESS_LOG_HEIGHT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35782-krawczyk-ratio-excess-log-height assertion failed: ${a.id}`);
  }
}
