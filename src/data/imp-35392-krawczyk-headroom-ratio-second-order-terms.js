/**
 * @module imp-35392-krawczyk-headroom-ratio-second-order-terms
 *
 * imp-35266 found the Krawczyk band-top headroom surplus above the closed-form floor S_inf = 1/(2 delta) = 2500 is
 * the residue of a near-exact 2:1 cancellation: the FP_LO finite-N push dFP ~ +110.34 against the asymptotic-floor
 * G-factor pull dG ~ -55.16, magnitude ratio -dFP/dG ~ 2.00042 essentially N-flat across the imp-34693 seed band. It
 * explained the leading 2 from M_G - 1 ~ -a/2 and M_FP - 1 ~ a(N(1-delta)) ~ a but reported the +0.00042 lift as a
 * lumped number and HYPOTHESISED it as "the a(N(1-delta)) vs a(N) offset plus the next-order a^2 terms of M_G - 1
 * and M_FP - 1." This ticket (imp-35392) carries that hypothesised a^2 route out to second order and MEASURES the
 * departure it predicts. imp-35374 gave the EXACT closed form -dFP/dG = 2(aLo/a)(1-a)/(1-aLo); this module is the
 * COMPLEMENTARY order-by-order test of the ticket's own a^2 proposal, and it finds the proposal DOES NOT WORK as
 * stated -- the a^2 factor-curvatures cancel and the naive a^2-truncated ratio mispredicts the departure.
 *
 * THE TWO SECOND-ORDER FACTOR EXPANSIONS (the a^2 terms the ticket names)
 * ----------------------------------------------------------------------
 * With a = a(N), aLo = a(N(1-delta)), G = 1 - a, FP_LO = 1 - aLo, the two factors have exact rational forms whose
 * a-power (Taylor) expansions carry genuine a^2 curvature terms:
 *   M_G - 1  = (G - 1)/(1 + G) = -a/(2 - a) = -a/2 - a^2/4 - a^3/8 - ...   (a^2 coefficient -1/4)
 *   M_FP - 1 = (1 - FP_LO)/FP_LO = aLo/(1 - aLo) = aLo + aLo^2 + aLo^3 + ... (a^2 coefficient +1)
 * MEASUREMENT (M1): the a^2 truncations -a/2 - a^2/4 and aLo + aLo^2 reproduce the exact M_G - 1 and M_FP - 1 to an
 * O(a^3) residual (~1.0-1.4e-5 for M_G - 1, ~0.8-1.2e-4 for M_FP - 1 across the band), confirming the a^2 terms are
 * the correct next order -- so the ticket has correctly identified the two second-order coefficients.
 *
 * THE a^2 CURVATURES CANCEL EXACTLY IN THE RATIO (the offset, not the curvature, carries the lift)
 * -----------------------------------------------------------------------------------------------
 * Removing ONLY the finite-difference offset (setting aLo = a, so M_FP - 1 -> a/(1-a)) while KEEPING both a^2
 * curvature terms in full, the ratio collapses to EXACTLY 2 at every band landmark:
 *   -dFP/dG |_{aLo = a} = M_G . [a/(1-a)] / (1 - M_G) = 2   exactly, to machine precision.
 * MEASUREMENT (M2): |ratio|_{aLo=a} - 2| < 1e-12 at band-bottom / N_cross / band-top. So the -a^2/4 curvature of
 * M_G - 1 and the +aLo^2 curvature of M_FP - 1 contribute NOTHING to the departure from 2 -- they cancel in the
 * ratio (the (2-a) M_G denominators cancel, per imp-35374's exact form). The +0.00042 is therefore NOT a residue of
 * the a^2 factor-terms; it is entirely the a(N(1-delta)) > a(N) offset da = aLo - a.
 *
 * THE NAIVE a^2-TRUNCATED RATIO MISPREDICTS THE DEPARTURE (why the ticket's route fails)
 * -------------------------------------------------------------------------------------
 * Building the ratio from the a^2-TRUNCATED factors (M_G - 1 -> -a/2 - a^2/4, M_G -> 1 - a/2 - a^2/4,
 * M_FP - 1 -> aLo + aLo^2) does NOT give +0.00042: it gives ratio_t ~ 1.997, i.e. a departure ~ -0.0030 -- WRONG
 * SIGN and ~7x the magnitude of the true +0.00042. MEASUREMENT (M3): devT = ratio_t - 2 is -3.001e-3 / -2.656e-3 /
 * -2.362e-3 (band-bottom / N_cross / band-top), because the DROPPED O(a^3) residuals of the two factors do NOT
 * cancel (unlike the a^2 curvatures) and dwarf the tiny offset lift. Conclusion: the departure cannot be captured by
 * truncating the factors at any finite a-order and forming the ratio; the EXACT (untruncated) factors are required,
 * exactly as imp-35374's closed form uses them.
 *
 * WHAT ACTUALLY CARRIES THE +0.00042 (confirming imp-35374)
 * ---------------------------------------------------------
 * The whole lift is the offset da = aLo - a, with leading form -dFP/dG - 2 ~ 2 da/(a(1-a)) = 2(da/a)/(1-a) -- a
 * 1/a (FP-side, relative shift da/a) times a 1/(1-a) (G-side amplification). MEASUREMENT (M4): 2 da/(a(1-a))
 * reproduces the exact departure +4.19052e-4 / +4.17963e-4 / +4.16987e-4 to < 1e-7 at all three landmarks, and the
 * departure is POSITIVE and monotone decreasing (the imp-35374 O(a) 1/(1-aLo) tilt). So imp-35392's verdict REFINES
 * imp-35266's hypothesis and CONFIRMS imp-35374: the +0.00042 is the offset da alone; the a^2 factor-curvatures the
 * ticket named are real in each factor but cancel in the ratio and are NOT the mechanism.
 *
 * MEASUREMENT / DERIVATION ONLY on the inherited imp-3220/imp-3406 surrogate; reproduces the imp-35266/imp-35374/
 * imp-35241/imp-34996 machinery (identical K, delta, N_cross, band, headroom form). The imp-34714a machine
 * certificate REMAINS OPEN; F(m) = 0 stays a double-precision artifact; C_C = 1/8 (imp-2642/2643) UNTOUCHED; C_mb
 * GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent 1/2 per imp-3463 untouched;
 * establishes no operator positivity; changes no bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35374-krawczyk-headroom-ratio-correction (exact closed form -dFP/dG = 2(aLo/a)(1-a)/(1-aLo))
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
const S_INF = 1 / (2 * DELTA); // 2500 exactly (imp-34996 large-N floor)

// Banach map g(N) = K log T0(N), local contraction factor a(N) (identical to imp-35374/imp-35266/imp-35241).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};

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

// Carry the two factors to second order in a and probe the ratio three ways at a single N:
//   mg1 / mfp1     = EXACT M_G - 1 = -a/(2-a),  M_FP - 1 = aLo/(1-aLo)
//   mg1T / mfp1T   = a^2 TRUNCATIONS -a/2 - a^2/4  and  aLo + aLo^2  (the ticket's second-order terms)
//   ratioExact     = -dFP/dG from the exact factors                    (~2.00042)
//   ratioNoOffset  = -dFP/dG with aLo -> a (offset removed, curvatures KEPT) -> exactly 2
//   ratioTrunc     = -dFP/dG from the a^2-truncated factors             (~1.997, wrong sign departure)
//   devLeading     = 2 da/(a(1-a)) = 2(da/a)/(1-a)                      (the offset that actually carries the lift)
function analyzeAt(N) {
  const a = aOf(N);
  const aLo = aOf(N * (1 - DELTA));
  const G = 1 - a;
  const FP_LO = 1 - aLo;
  const M_G = (2 * G) / (1 + G);
  const mg1 = M_G - 1; // exact = -a/(2-a)
  const mfp1 = 1 / FP_LO - 1; // exact = aLo/(1-aLo)
  const mg1T = -a / 2 - (a * a) / 4; // a^2 truncation of M_G - 1
  const mfp1T = aLo + aLo * aLo; // a^2 truncation of M_FP - 1
  const mg1Err = Math.abs(mg1T - mg1); // O(a^3) residual
  const mfp1Err = Math.abs(mfp1T - mfp1); // O(a^3) residual

  const dG = S_INF * mg1;
  const dFP = S_INF * M_G * mfp1;
  const ratioExact = -dFP / dG;

  // Offset removed (aLo -> a) but a^2 curvatures KEPT in full: ratio collapses to exactly 2.
  const M_FP_same = 1 / (1 - a);
  const dFP_same = S_INF * M_G * (M_FP_same - 1);
  const ratioNoOffset = -dFP_same / dG;

  // Ratio from the a^2-TRUNCATED factors (M_G -> 1 + mg1T): mispredicts the departure.
  const M_G_T = 1 + mg1T;
  const dG_T = S_INF * mg1T;
  const dFP_T = S_INF * M_G_T * mfp1T;
  const ratioTrunc = -dFP_T / dG_T;

  const da = aLo - a;
  const devExact = ratioExact - 2;
  const devLeading = (2 * da) / (a * (1 - a)); // 2 da/(a(1-a)) = 2(da/a)/(1-a)
  return {
    N, a, aLo, da, mg1, mfp1, mg1T, mfp1T, mg1Err, mfp1Err,
    ratioExact, ratioNoOffset, ratioTrunc,
    devExact, devTrunc: ratioTrunc - 2, devLeading,
  };
}

const BAND_BOTTOM_R = analyzeAt(BAND_BOTTOM);
const N_CROSS_R = analyzeAt(N_CROSS);
const BAND_TOP_R = analyzeAt(BAND_TOP);
const LANDMARKS = [BAND_BOTTOM_R, N_CROSS_R, BAND_TOP_R];

// (M1) the a^2 truncations reproduce the exact factors to an O(a^3) residual (small, but non-zero and ~a^3).
const A2_IS_NEXT_ORDER = LANDMARKS.every(
  (r) => r.mg1Err > 1e-6 && r.mg1Err < 5e-5 && r.mfp1Err > 1e-5 && r.mfp1Err < 5e-4,
);
// (M2) the a^2 curvatures CANCEL in the ratio: with the offset removed (aLo -> a) the ratio is EXACTLY 2.
const CURVATURE_CANCELS = LANDMARKS.every((r) => Math.abs(r.ratioNoOffset - 2) < 1e-12);
// (M3) the naive a^2-truncated ratio MISPREDICTS: departure ~ -0.003 (wrong sign, ~7x magnitude) not +0.00042.
const TRUNC_MISPREDICTS = LANDMARKS.every((r) => r.devTrunc < -1e-3 && r.devExact > 0);
// (M4) the true +0.00042 is the offset: 2 da/(a(1-a)) reproduces the exact positive departure to < 1e-7.
const OFFSET_CARRIES_LIFT = LANDMARKS.every(
  (r) => r.devExact > 0 && Math.abs(r.devLeading - r.devExact) < 1e-7,
);

export const IMP35392_KRAWCZYK_HEADROOM_RATIO_SECOND_ORDER_TERMS = {
  id: 'imp-35392',
  proofSection: 'S-frontier',
  question:
    'imp-35266 reported the Krawczyk band-top headroom-surplus 2:1 cancellation ratio -dFP/dG ~ 2.00042 as N-flat ' +
    'and hypothesised the +0.00042 lift off exactly 2 as the a(N(1-delta)) vs a(N) offset PLUS the next-order a^2 ' +
    'terms of M_G - 1 = -a/2 + O(a^2) and M_FP - 1 = a(N(1-delta)) + O(a^2). Carry that a^2 route to second order ' +
    'and measure the departure it predicts against the imp-35266 machinery across the imp-34693 band. ' +
    'Measurement/derivation only on the inherited surrogate; imp-34714a stays OPEN; changes no bound; NO QED.',
  finding:
    'The a^2 route does NOT carry the +0.00042 as the ticket hypothesised. (1) The two second-order coefficients ' +
    'are correctly identified: M_G - 1 = -a/2 - a^2/4 - ... and M_FP - 1 = aLo + aLo^2 + ..., and the a^2 ' +
    'truncations reproduce the exact factors to an O(a^3) residual (~1.0-1.4e-5 and ~0.8-1.2e-4 across the band). ' +
    '(2) But those a^2 CURVATURES CANCEL EXACTLY in the ratio: keeping both curvature terms in full while removing ' +
    'ONLY the offset (aLo -> a) collapses -dFP/dG to EXACTLY 2 (to <1e-12) at all three landmarks. So the ' +
    '-a^2/4 (M_G) and +aLo^2 (M_FP) curvatures contribute NOTHING to the departure. (3) Worse, forming the ratio ' +
    'from the a^2-TRUNCATED factors MISPREDICTS: ratio_t ~ 1.997, a departure -3.001e-3/-2.656e-3/-2.362e-3 -- ' +
    'WRONG SIGN and ~7x the magnitude of the true +0.00042 -- because the dropped O(a^3) factor residuals do NOT ' +
    'cancel (unlike the a^2 curvatures) and dwarf the offset. (4) The whole +0.00042 is the offset da = aLo - a ' +
    'alone: 2 da/(a(1-a)) = 2(da/a)/(1-a) reproduces the exact positive departure +4.19052e-4 -> +4.17963e-4 -> ' +
    '+4.16987e-4 to <1e-7, confirming imp-35374 and REFINING imp-35266: the a^2 factor-terms are real but cancel ' +
    'in the ratio; the EXACT (untruncated) factors are required. EVIDENCE / derivation, NOT a machine certificate.',
  constants: {
    N_cross: +N_CROSS.toPrecision(15),
    band_bottom_N: +BAND_BOTTOM.toPrecision(15),
    band_top_N: +BAND_TOP.toPrecision(15),
    delta: DELTA,
    S_inf_floor: S_INF,
    K_amplitude: +K_AMPL.toPrecision(10),
  },
  measurement: {
    // (M1) a^2 truncations of the two factors, and their O(a^3) residuals, at the band-top.
    mg1_a2_coeff: -0.25, // M_G - 1 = -a/2 - a^2/4 - ...
    mfp1_a2_coeff: 1, // M_FP - 1 = aLo + aLo^2 + ...
    mg1_a2_residual_band_top: +BAND_TOP_R.mg1Err.toPrecision(6), // ~1.02827e-5 (O(a^3))
    mfp1_a2_residual_band_top: +BAND_TOP_R.mfp1Err.toPrecision(6), // ~8.41691e-5 (O(a^3))
    a2_truncation_is_next_order: A2_IS_NEXT_ORDER, // true
    // (M2) the a^2 curvatures cancel in the ratio: offset removed -> exactly 2.
    ratio_no_offset_band_bottom: +BAND_BOTTOM_R.ratioNoOffset.toPrecision(15), // 2 exactly
    ratio_no_offset_band_top: +BAND_TOP_R.ratioNoOffset.toPrecision(15), // 2 exactly
    a2_curvature_cancels_in_ratio: CURVATURE_CANCELS, // true (|ratio_noOffset - 2| < 1e-12)
    // (M3) the naive a^2-truncated ratio mispredicts the departure (wrong sign, ~7x too big).
    ratio_trunc_band_bottom: +BAND_BOTTOM_R.ratioTrunc.toPrecision(10), // ~1.996999
    ratio_trunc_band_top: +BAND_TOP_R.ratioTrunc.toPrecision(10), // ~1.997638
    dev_trunc_band_bottom: +BAND_BOTTOM_R.devTrunc.toPrecision(6), // ~-3.00086e-3
    dev_trunc_band_top: +BAND_TOP_R.devTrunc.toPrecision(6), // ~-2.36161e-3
    a2_truncated_ratio_mispredicts: TRUNC_MISPREDICTS, // true (departure wrong sign)
    // (M4) the true departure is the offset da: 2 da/(a(1-a)) reproduces it.
    ratio_exact_band_bottom: +BAND_BOTTOM_R.ratioExact.toPrecision(12), // ~2.00041905
    ratio_exact_band_top: +BAND_TOP_R.ratioExact.toPrecision(12), // ~2.00041699
    dev_exact_band_bottom: +BAND_BOTTOM_R.devExact.toPrecision(10), // ~+4.19052e-4
    dev_exact_band_top: +BAND_TOP_R.devExact.toPrecision(10), // ~+4.16987e-4
    dev_leading_offset_band_top: +BAND_TOP_R.devLeading.toPrecision(10), // ~+4.16983e-4 (2 da/(a(1-a)))
    da_shift_band_top: +BAND_TOP_R.da.toPrecision(10), // ~8.61313e-6 (= a(N(1-delta)) - a(N))
    offset_carries_full_lift: OFFSET_CARRIES_LIFT, // true (matches exact departure to <1e-7)
  },
  subGap:
    'imp-34714a REMAINS OPEN. Showing the a^2 factor-curvatures cancel in the ratio and the +0.00042 is the offset ' +
    'da does NOT prove a directed-rounding [g](m)/[F-prime] evaluation yields valid enclosures: it rests on the ' +
    'gamma(n)/k eps surrogate models of the imp-34687a directed-rounding layer, not that layer, and F(m) = 0 ' +
    'remains a double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK HEADROOM RATIO SECOND-ORDER TERMS, DERIVED (frontier, NOT an RH bound). The ticket asked whether the ' +
    'imp-35266 +0.00042 lift off exactly 2 comes from the next-order a^2 terms of M_G - 1 and M_FP - 1. RESULT: it ' +
    'does NOT. The a^2 coefficients are correctly -1/4 (M_G - 1) and +1 (M_FP - 1) and the truncations are O(a^3)- ' +
    'accurate, but (i) those a^2 curvatures CANCEL EXACTLY in the ratio -- removing only the offset (aLo -> a) while ' +
    'keeping both curvatures gives -dFP/dG = 2 to <1e-12 -- and (ii) the naive a^2-truncated ratio MISPREDICTS the ' +
    'departure as ~-0.003 (wrong sign, ~7x magnitude) because the dropped O(a^3) factor residuals do not cancel. ' +
    'The whole +0.00042 is the a(N(1-delta)) > a(N) offset da alone, with leading form 2 da/(a(1-a)) reproducing ' +
    'the exact positive departure +4.19052e-4 -> +4.16987e-4 to <1e-7 across the band. This REFINES imp-35266 and ' +
    'CONFIRMS imp-35374 (exact closed form -dFP/dG = 2(aLo/a)(1-a)/(1-aLo)): the exact untruncated factors are ' +
    'required; the a^2 factor-terms are real but cancel. EVIDENCE, NOT a machine certificate. SUB-GAP imp-34714a ' +
    'REMAINS OPEN: rests on the gamma(n)/k eps surrogate models, not the imp-34687a directed-rounding layer, and ' +
    'F(m) = 0 remains a double-precision artifact. Measurement/derivation only on the inherited imp-3220/imp-3406 ' +
    'surrogate; reproduces the imp-35266/imp-35374/imp-35241/imp-34996 machinery (identical K, delta, N_cross, ' +
    'band); the C_C 1/8 ansatz (imp-2642/2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 ' +
    'K_a >= 0 untouched; far-tail exponent 1/2 per imp-3463 untouched; changes no bound; establishes no operator ' +
    'positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35374 (exact closed form -dFP/dG = 2(aLo/a)(1-a)/(1-aLo); lift off 2 = 2(da/a)/(1-aLo)); imp-35266 (2:1 ' +
    'cancellation, -dFP/dG ~ 2.00042; a^2-terms hypothesis); imp-35241 (band-top S ~ 2555.18); imp-34996 ' +
    '(S_inf = 1/(2 delta) floor; 2G/(1+G) -> 1); imp-34693 (admissible seed band + band-bottom/band-top); imp-33723 ' +
    '(Banach map g(N) = K log T0(N)); imp-2642 (C_C 1/8 ansatz); imp-3463 (far-tail exponent 1/2); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse). Order-by-order a-expansion of a rational ratio: standard.',
};

export const IMP35392_KRAWCZYK_HEADROOM_RATIO_SECOND_ORDER_TERMS_ASSERTIONS = [
  {
    // The a^2 truncations -a/2 - a^2/4 and aLo + aLo^2 reproduce the exact factors to an O(a^3) residual.
    id: 'imp35392-a2-truncation-is-next-order',
    description: 'the a^2 truncations of M_G - 1 and M_FP - 1 reproduce the exact factors to an O(a^3) residual',
    holds: () => A2_IS_NEXT_ORDER === true,
  },
  {
    // Removing only the offset (aLo -> a) while keeping both a^2 curvatures gives the ratio EXACTLY 2.
    id: 'imp35392-a2-curvature-cancels-in-ratio',
    description: 'with the offset removed (aLo -> a) the ratio is exactly 2 -- the a^2 curvatures cancel',
    holds: () =>
      CURVATURE_CANCELS === true &&
      Math.abs(BAND_TOP_R.ratioNoOffset - 2) < 1e-12 &&
      Math.abs(BAND_BOTTOM_R.ratioNoOffset - 2) < 1e-12,
  },
  {
    // The naive a^2-truncated ratio mispredicts: departure ~ -0.003 (wrong sign) not the true +0.00042.
    id: 'imp35392-a2-truncated-ratio-mispredicts',
    description: 'the a^2-truncated ratio gives a departure ~ -0.003 (wrong sign, ~7x) not the true +0.00042',
    holds: () =>
      TRUNC_MISPREDICTS === true &&
      BAND_TOP_R.devTrunc < -1e-3 &&
      BAND_TOP_R.devExact > 0 &&
      Math.abs(BAND_TOP_R.devTrunc) > 3 * Math.abs(BAND_TOP_R.devExact),
  },
  {
    // The true +0.00042 is the offset da: 2 da/(a(1-a)) reproduces the exact positive departure to <1e-7.
    id: 'imp35392-offset-carries-the-lift',
    description: 'the offset 2 da/(a(1-a)) reproduces the exact positive departure (~+4.17e-4 band-top) to <1e-7',
    holds: () =>
      OFFSET_CARRIES_LIFT === true &&
      Math.abs(BAND_TOP_R.devExact - 4.16987e-4) < 1e-8 &&
      Math.abs(BAND_TOP_R.devLeading - BAND_TOP_R.devExact) < 1e-7,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp35392-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35392_KRAWCZYK_HEADROOM_RATIO_SECOND_ORDER_TERMS.isRigorous === false &&
      /imp-34714a/.test(IMP35392_KRAWCZYK_HEADROOM_RATIO_SECOND_ORDER_TERMS.subGap) &&
      /REMAINS OPEN/.test(IMP35392_KRAWCZYK_HEADROOM_RATIO_SECOND_ORDER_TERMS.subGap) &&
      /NO QED/.test(IMP35392_KRAWCZYK_HEADROOM_RATIO_SECOND_ORDER_TERMS.verdict) &&
      /refereed bound is changed/i.test(IMP35392_KRAWCZYK_HEADROOM_RATIO_SECOND_ORDER_TERMS.verdict),
  },
];

for (const a of IMP35392_KRAWCZYK_HEADROOM_RATIO_SECOND_ORDER_TERMS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35392-krawczyk-headroom-ratio-second-order-terms assertion failed: ${a.id}`);
  }
}
