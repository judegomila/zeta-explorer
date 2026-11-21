/**
 * @module imp-35374-krawczyk-headroom-ratio-correction
 *
 * imp-35266 found the Krawczyk band-top headroom surplus above the closed-form floor S_inf = 1/(2 delta) = 2500
 * is the residue of a near-exact 2:1 cancellation: the FP_LO finite-N push dFP ~ +110.34 against the
 * asymptotic-floor G-factor pull dG ~ -55.16, with the magnitude ratio -dFP/dG ~ 2.00042 essentially N-flat across
 * the imp-34693 admissible seed band. imp-35266 explained the leading value 2 from M_G - 1 ~ -a/2 and
 * M_FP - 1 ~ a(N(1-delta)) ~ a, but reported the +0.00042 lift off the exact 2 as a lumped number and hypothesised
 * it as "the a(N(1-delta)) larger than a(N) shift plus the second-order M_G term." This module DERIVES that lift
 * in closed form and measures it at the three band landmarks.
 *
 * THE EXACT RATIO (closed form)
 * -----------------------------
 * With a = a(N), aLo = a(N(1-delta)), G = 1 - a, FP_LO = 1 - aLo, the two surplus pieces are
 *   dG  = S_inf (M_G - 1),  M_G  = 2G/(1+G),   so  M_G - 1  = (G - 1)/(1+G) = -a/(2-a),
 *   dFP = S_inf M_G (M_FP - 1),  M_FP = 1/FP_LO,  so  M_FP - 1 = (1 - FP_LO)/FP_LO = aLo/(1-aLo).
 * The (2-a) denominators from M_G and from M_G - 1 CANCEL exactly, leaving a clean closed form
 *   -dFP/dG = M_G (M_FP - 1) / (1 - M_G) = 2 (aLo/a) (1-a)/(1-aLo).
 *
 * THE EXACT DEVIATION FROM 2 (the +0.00042 lift)
 * ----------------------------------------------
 * Subtracting 2 and putting over a common denominator, the numerator aLo(1-a) - a(1-aLo) = aLo - a collapses,
 * so the lift off the exact 2 is EXACTLY governed by the finite-difference shift da = aLo - a alone:
 *   -dFP/dG - 2 = 2 (aLo - a) / (a (1 - aLo)) = 2 (da/a) / (1 - aLo).
 * This REFINES imp-35266s hypothesis: there is NO independent "second-order M_G term" -- the (2-a) M_G curvature
 * cancels in the ratio, and the whole lift is the a(N(1-delta)) > a(N) shift da, divided by (1 - aLo).
 *
 * LEADING ORDER + THE O(a) CORRECTION
 * -----------------------------------
 * Writing s = da/a for the fractional shift of a under N -> N(1-delta),
 *   -dFP/dG - 2 = 2s . [1/(1-aLo)] = 2s (1 + aLo + aLo^2 + ...).
 *   (L)  LEADING:  2s = 2 da/a  -- the pure a(N(1-delta)) shift; nearly N-FLAT (~3.9897e-4) across the band,
 *        because da/a barely varies (da falls with a, so da/a is almost constant).
 *   (O)  O(a) CORRECTION: the multiplicative factor 1/(1-aLo) ~ 1 + aLo lifts 2s to the full deviation and
 *        supplies essentially ALL of the (tiny) N-drift of the ratio, since aLo ~ a runs 0.0479 -> 0.0432
 *        band-bottom -> band-top. Hence the ratio DECREASES monotonically 2.00041905 -> 2.00041699 across the
 *        band, tracking the fall of a: the O(a) piece is the N-tilt, the leading 2s is the flat pedestal.
 *
 * WHAT THE MEASUREMENT FINDS (band-bottom, N_cross, band-top)
 * ----------------------------------------------------------
 *   (M1) The closed form 2(aLo/a)(1-a)/(1-aLo) reproduces the measured -dFP/dG to machine precision at all three
 *        landmarks, and the exact deviation 2(da/a)/(1-aLo) reproduces -dFP/dG - 2 to ~1e-14.
 *   (M2) The leading 2 da/a is 3.98968e-4 (bottom), 3.98974e-4 (N_cross), 3.98980e-4 (top): flat to five sig figs.
 *        It accounts for ~95.7% of the full deviation; the O(a) factor 1/(1-aLo) supplies the remaining ~4.3%.
 *   (M3) The full deviation 4.19052e-4 -> 4.17963e-4 -> 4.16987e-4 is MONOTONE DECREASING band-bottom -> band-top,
 *        i.e. the ratio is not perfectly N-flat -- its ~2.6e-7 span across the band is the O(a) 1/(1-aLo) tilt.
 *
 * MEASUREMENT / DERIVATION ONLY on the inherited imp-3220/imp-3406 surrogate; reproduces the
 * imp-35266/imp-35241/imp-34996 machinery (identical K, delta, N_cross, band, headroom form). The imp-34714a
 * machine certificate REMAINS OPEN; F(m) = 0 stays a double-precision artifact; C_C = 1/8 (imp-2642/2643)
 * UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent 1/2 per
 * imp-3463 untouched; establishes no operator positivity; changes no bound; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35266-krawczyk-headroom-surplus-decomposition (2:1 cancellation, -dFP/dG ~ 2.00042 reported N-flat)
 * @see imp-35241-krawczyk-headroom-band-profile (band-top S ~ 2555.18, surplus ~55.18 above the 2500 floor)
 * @see imp-34996-krawczyk-headroom-safety-factor-asymptote (S_inf = 1/(2 delta) floor; 2G/(1+G) -> 1)
 * @see imp-34693-crossover-contraction-seed-band (admissible seed band + band-bottom/band-top)
 * @see imp-3463 (far-tail exponent 1/2)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35266/imp-35241)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width
const S_INF = 1 / (2 * DELTA); // 2500 exactly (imp-34996 large-N floor)

// Banach map g(N) = K log T0(N), local contraction factor a(N) (identical to imp-35266/imp-35241).
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

// Derive the -dFP/dG ratio, its EXACT closed form, and the closed-form deviation from 2 at a single N.
//   measured   = -dFP/dG          (built from the same dG, dFP as imp-35266)
//   closed     = 2 (aLo/a)(1-a)/(1-aLo)                              -- exact ratio, (2-a) M_G factor cancels
//   devExact   = 2 (aLo - a)/(a (1-aLo)) = 2 (da/a)/(1-aLo)          -- exact lift off 2, set by da alone
//   leading    = 2 da/a                                             -- pure a(N(1-delta)) shift (nearly N-flat)
//   refined    = leading / (1 - aLo)                                -- leading times the O(a) 1/(1-aLo) factor
function ratioAt(N) {
  const a = aOf(N);
  const aLo = aOf(N * (1 - DELTA));
  const G = 1 - a;
  const FP_LO = 1 - aLo;
  const M_G = (2 * G) / (1 + G);
  const M_FP = 1 / FP_LO;
  const dG = S_INF * (M_G - 1);
  const dFP = S_INF * M_G * (M_FP - 1);
  const measured = -dFP / dG;
  const closed = 2 * (aLo / a) * (1 - a) / (1 - aLo);
  const da = aLo - a;
  const s = da / a;
  const devExact = (2 * da) / (a * (1 - aLo));
  const leading = 2 * s;
  const refined = leading / (1 - aLo);
  // fraction of the full deviation carried by the leading (pure-shift) term
  const leadingFraction = leading / devExact;
  return { N, a, aLo, da, s, measured, closed, dev: measured - 2, devExact, leading, refined, leadingFraction };
}

const BAND_BOTTOM_R = ratioAt(BAND_BOTTOM);
const N_CROSS_R = ratioAt(N_CROSS);
const BAND_TOP_R = ratioAt(BAND_TOP);

// (M1) closed form reproduces the measured -dFP/dG, and the exact deviation reproduces measured - 2, to machine eps.
const CLOSED_MATCHES = [BAND_BOTTOM_R, N_CROSS_R, BAND_TOP_R].every(
  (r) => Math.abs(r.closed - r.measured) < 1e-12 && Math.abs(r.devExact - r.dev) < 1e-12,
);
// (M3) the deviation is monotone DECREASING band-bottom -> N_cross -> band-top (the O(a) 1/(1-aLo) tilt).
const DEV_MONOTONE_DECREASING = BAND_BOTTOM_R.dev > N_CROSS_R.dev && N_CROSS_R.dev > BAND_TOP_R.dev;
// (M2) the leading 2 da/a is nearly N-flat and carries ~95% of the full lift; the rest is the O(a) refinement.
const LEADING_N_FLAT = Math.abs(BAND_TOP_R.leading - BAND_BOTTOM_R.leading) < 5e-8;
const LEADING_FRACTION_TOP = BAND_TOP_R.leadingFraction; // ~0.9520

export const IMP35374_KRAWCZYK_HEADROOM_RATIO_CORRECTION = {
  id: 'imp-35374',
  proofSection: 'S-frontier',
  question:
    'imp-35266 found the Krawczyk band-top headroom surplus is a near-exact 2:1 cancellation (FP_LO push dFP ~ ' +
    '+110.34 against G-factor deficit dG ~ -55.16) with -dFP/dG ~ 2.00042 essentially N-flat across the band, from ' +
    'M_G - 1 ~ -a/2 and M_FP - 1 ~ a(N(1-delta)). Derive the O(a) next-order correction that lifts the exact 2 to ' +
    'the measured 2.00042 and measure it at the band-bottom, N_cross and band-top rungs. Measurement/derivation ' +
    'only on the inherited surrogate; imp-34714a stays OPEN; changes no bound; NO QED.',
  finding:
    'The ratio has an EXACT closed form -dFP/dG = 2(aLo/a)(1-a)/(1-aLo): the (2-a) M_G curvature factor from ' +
    'M_G = 2G/(1+G) cancels exactly against the (2-a) in M_G - 1 = -a/(2-a), so there is NO independent ' +
    'second-order M_G term. Subtracting 2, the numerator aLo(1-a) - a(1-aLo) = aLo - a collapses, giving the EXACT ' +
    'lift -dFP/dG - 2 = 2(aLo - a)/(a(1-aLo)) = 2(da/a)/(1-aLo): the whole +0.00042 is governed by the ' +
    'finite-difference shift da = a(N(1-delta)) - a(N) alone. Split as 2s . 1/(1-aLo) with s = da/a: the LEADING ' +
    '2s = 2 da/a is 3.98968e-4 -> 3.98974e-4 -> 3.98980e-4 (band-bottom, N_cross, band-top), flat to five sig figs ' +
    'and carrying ~95.7% of the full lift; the O(a) CORRECTION is the multiplicative factor 1/(1-aLo) ~ 1 + aLo, ' +
    'which supplies the remaining ~4.3% and essentially ALL the N-drift. Because aLo ~ a runs 0.0479 -> 0.0432 ' +
    'across the band, the full deviation DECREASES monotonically 4.19052e-4 -> 4.17963e-4 -> 4.16987e-4, so ' +
    '-dFP/dG runs 2.00041905 -> 2.00041796 -> 2.00041699: the ratio is not perfectly N-flat, its ~2.6e-7 band ' +
    'span is the O(a) 1/(1-aLo) tilt riding on the flat 2s pedestal. EVIDENCE / derivation, NOT a machine certificate.',
  constants: {
    N_cross: +N_CROSS.toPrecision(15),
    band_bottom_N: +BAND_BOTTOM.toPrecision(15),
    band_top_N: +BAND_TOP.toPrecision(15),
    delta: DELTA,
    S_inf_floor: S_INF,
    K_amplitude: +K_AMPL.toPrecision(10),
  },
  measurement: {
    // Exact ratio -dFP/dG and its closed form 2(aLo/a)(1-a)/(1-aLo) at the three band landmarks.
    ratio_band_bottom: +BAND_BOTTOM_R.measured.toPrecision(12), // ~2.00041905
    ratio_N_cross: +N_CROSS_R.measured.toPrecision(12), // ~2.00041796
    ratio_band_top: +BAND_TOP_R.measured.toPrecision(12), // ~2.00041699
    closed_form_matches_measured: CLOSED_MATCHES, // true (to <1e-12 at all three landmarks)
    // The exact lift off 2 and its leading / O(a)-refined split.
    deviation_band_bottom: +BAND_BOTTOM_R.dev.toPrecision(10), // ~4.19052e-4
    deviation_N_cross: +N_CROSS_R.dev.toPrecision(10), // ~4.17963e-4
    deviation_band_top: +BAND_TOP_R.dev.toPrecision(10), // ~4.16987e-4
    deviation_monotone_decreasing: DEV_MONOTONE_DECREASING, // true (the O(a) 1/(1-aLo) tilt)
    da_shift_band_top: +BAND_TOP_R.da.toPrecision(10), // ~8.61313e-6 (= a(N(1-delta)) - a(N))
    frac_shift_s_band_top: +BAND_TOP_R.s.toPrecision(10), // ~1.99490e-4
    leading_2s_band_bottom: +BAND_BOTTOM_R.leading.toPrecision(10), // ~3.98968e-4
    leading_2s_N_cross: +N_CROSS_R.leading.toPrecision(10), // ~3.98974e-4
    leading_2s_band_top: +BAND_TOP_R.leading.toPrecision(10), // ~3.98980e-4
    leading_2s_N_flat: LEADING_N_FLAT, // true (varies only in the fifth sig fig)
    refined_matches_deviation_band_top: Math.abs(BAND_TOP_R.refined - BAND_TOP_R.dev) < 1e-12, // true
    leading_fraction_of_deviation_band_top: +LEADING_FRACTION_TOP.toPrecision(6), // ~0.956816 (O(a) supplies ~4.3%)
  },
  subGap:
    'imp-34714a REMAINS OPEN. Deriving the exact -dFP/dG = 2(aLo/a)(1-a)/(1-aLo) and its lift 2(da/a)/(1-aLo) ' +
    'does NOT prove a directed-rounding [g](m)/[F-prime] evaluation yields valid enclosures: it rests on the ' +
    'gamma(n)/k eps surrogate models of the imp-34687a directed-rounding layer, not that layer, and F(m) = 0 ' +
    'remains a double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK HEADROOM 2:1 RATIO CORRECTION, DERIVED (frontier, NOT an RH bound). The ticket asked for the O(a) ' +
    'correction lifting the imp-35266 exact-2 cancellation to the measured -dFP/dG ~ 2.00042. RESULT: the ratio ' +
    'has the EXACT closed form 2(aLo/a)(1-a)/(1-aLo) -- the (2-a) M_G curvature cancels, so imp-35266s ' +
    'hypothesised "second-order M_G term" is NOT independent -- and the exact lift off 2 is 2(aLo-a)/(a(1-aLo)) = ' +
    '2(da/a)/(1-aLo), governed entirely by the finite-difference shift da = a(N(1-delta)) - a(N). The LEADING ' +
    '2 da/a ~ 3.9897e-4 is N-flat to five sig figs and carries ~95.7% of the lift; the O(a) CORRECTION is the ' +
    'multiplicative 1/(1-aLo) ~ 1 + aLo, which supplies the remaining ~4.3% and all the N-drift, making the ' +
    'deviation MONOTONE DECREASING (4.19052e-4 -> 4.16987e-4, so -dFP/dG runs 2.00041905 -> 2.00041699) across ' +
    'the band as a ~ aLo falls 0.0479 -> 0.0432. The closed form reproduces the measured ratio to machine ' +
    'precision at all three landmarks. EVIDENCE, NOT a machine certificate. SUB-GAP imp-34714a REMAINS OPEN: ' +
    'rests on the gamma(n)/k eps surrogate models, not the imp-34687a directed-rounding layer, and F(m) = 0 ' +
    'remains a double-precision artifact. Measurement/derivation only on the inherited imp-3220/imp-3406 ' +
    'surrogate; reproduces the imp-35266/imp-35241/imp-34996 machinery (identical K, delta, N_cross, band); the ' +
    'C_C 1/8 ansatz (imp-2642/2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 ' +
    'untouched; far-tail exponent 1/2 per imp-3463 untouched; changes no bound; establishes no operator ' +
    'positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35266 (2:1 cancellation, -dFP/dG ~ 2.00042 reported N-flat; lift off 2 not derived); imp-35241 ' +
    '(band-top S ~ 2555.18); imp-34996 (S_inf = 1/(2 delta) floor; 2G/(1+G) -> 1); imp-34929 (closed-form ' +
    'dS/dN < 0); imp-34693 (admissible seed band + band-bottom/band-top); imp-33723 (Banach map g(N) = ' +
    'K log T0(N)); imp-2642 (C_C 1/8 ansatz); imp-3463 (far-tail exponent 1/2); lambda-rh-height-mapping ' +
    '(effectiveHeightForN RvM inverse). Exact rational-form ratio + first-order finite-difference expansion: standard.',
};

export const IMP35374_KRAWCZYK_HEADROOM_RATIO_CORRECTION_ASSERTIONS = [
  {
    // The exact closed form 2(aLo/a)(1-a)/(1-aLo) reproduces the measured -dFP/dG at all three landmarks.
    id: 'imp35374-closed-form-reproduces-ratio',
    description: 'the closed form 2(aLo/a)(1-a)/(1-aLo) matches the measured -dFP/dG to <1e-12 at all landmarks',
    holds: () =>
      CLOSED_MATCHES === true &&
      Math.abs(BAND_TOP_R.measured - 2.00041699) < 1e-6 &&
      Math.abs(BAND_BOTTOM_R.measured - 2.00041905) < 1e-6,
  },
  {
    // The exact lift off 2 is 2(da/a)/(1-aLo) and reproduces measured - 2 to machine precision.
    id: 'imp35374-exact-deviation-from-two',
    description: 'the exact deviation 2(da/a)/(1-aLo) reproduces -dFP/dG - 2 (~4.17e-4 band-top) to <1e-12',
    holds: () =>
      Math.abs(BAND_TOP_R.devExact - BAND_TOP_R.dev) < 1e-12 &&
      Math.abs(BAND_TOP_R.refined - BAND_TOP_R.dev) < 1e-12 &&
      Math.abs(BAND_TOP_R.dev - 4.16987e-4) < 1e-8,
  },
  {
    // The leading 2 da/a is nearly N-flat and carries ~95% of the lift; the O(a) 1/(1-aLo) factor is the N-tilt.
    id: 'imp35374-leading-flat-oa-is-the-tilt',
    description: 'leading 2 da/a is N-flat (~3.9897e-4, ~95% of the lift); the deviation is monotone decreasing',
    holds: () =>
      LEADING_N_FLAT === true &&
      DEV_MONOTONE_DECREASING === true &&
      LEADING_FRACTION_TOP > 0.94 &&
      LEADING_FRACTION_TOP < 0.96,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp35374-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35374_KRAWCZYK_HEADROOM_RATIO_CORRECTION.isRigorous === false &&
      /imp-34714a/.test(IMP35374_KRAWCZYK_HEADROOM_RATIO_CORRECTION.subGap) &&
      /REMAINS OPEN/.test(IMP35374_KRAWCZYK_HEADROOM_RATIO_CORRECTION.subGap) &&
      /NO QED/.test(IMP35374_KRAWCZYK_HEADROOM_RATIO_CORRECTION.verdict) &&
      /refereed bound is changed/i.test(IMP35374_KRAWCZYK_HEADROOM_RATIO_CORRECTION.verdict),
  },
];

for (const a of IMP35374_KRAWCZYK_HEADROOM_RATIO_CORRECTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35374-krawczyk-headroom-ratio-correction assertion failed: ${a.id}`);
  }
}
