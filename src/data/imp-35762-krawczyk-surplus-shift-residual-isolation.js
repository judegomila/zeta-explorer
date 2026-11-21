/**
 * @module imp-35762-krawczyk-surplus-shift-residual-isolation
 *
 * imp-35266 (D3) reported that the exact +55.18 band-top Krawczyk contraction-validity headroom surplus
 * (S ~ 2555.18 above the closed-form floor S_inf = 1/(2 delta) = 2500) is tracked to within ~2% by the
 * leading-order estimate S_inf . a(N)/2 ~ 53.97, and asserted that "the a(N(1-delta)) > a(N) shift lifts it
 * the last ~1.2". But imp-35266 never isolated that ~1.2 residual as a separate number, nor checked WHETHER
 * the a(N(1-delta)) > a(N) shift actually accounts for it. This module measures the shift contribution
 * directly and finds the D3 attribution is IMPRECISE: the ~1.2 residual is overwhelmingly the O(a^2)
 * CURVATURE term S_inf . a^2/4, NOT the a-shift.
 *
 * THE ISOLATION (splitting the D3 "~1.2" total residual)
 * ------------------------------------------------------
 * The exact band-top surplus uses FP_LO = 1 - a(N(1-delta)) (the seed-shifted lower fixed-point factor).
 * Define three quantities at the band-top N ~ 3.4515e9:
 *   surplus_exact    = S(FP_LO = 1 - a(N(1-delta))) - S_inf         (the module's exact +55.18)
 *   surplus_no_shift = S(FP_LO = 1 - a(N))          - S_inf         (a-shift SWITCHED OFF: a_lo -> a(N))
 *   surplus_leading  = S_inf . a(N)/2                               (the D3 leading estimate ~53.97)
 * Then the D3 total residual splits cleanly and additively as
 *   total_residual      = surplus_exact - surplus_leading                        (~1.214, the D3 "~1.2")
 *     = shift_residual  = surplus_exact - surplus_no_shift                        (the PURE a-shift piece)
 *     + curvature_resid = surplus_no_shift - surplus_leading                      (the O(a^2)+ non-shift piece)
 *
 * WHAT THE MEASUREMENT FINDS AT THE BAND-TOP
 * ------------------------------------------
 *   (S1) THE a-SHIFT CONTRIBUTES ONLY ~0.023, NOT ~1.2. shift_residual ~ +0.0230 -- about 1.9% of the total
 *        ~1.214 residual. The seed shift a(N(1-delta)) ~ 0.0431844 vs a(N) ~ 0.0431758 is a relative bump of
 *        ~2e-4 (= delta), so its effect on the surplus is ~S_inf . (a_lo - a) ~ 2500 . 8.6e-6 ~ 0.021 -- an
 *        order of magnitude too small to be "the last ~1.2".
 *   (S2) THE ~1.2 IS THE O(a^2) CURVATURE TERM. curvature_resid ~ +1.1908 (~98.1% of the total residual) is
 *        well-approximated by the second-order Taylor term S_inf . a^2/4 ~ 1.1651. Expanding the no-shift form
 *        M_G . M_FP = (1 - a/2 - a^2/4 + ...)(1 + a + a^2 + ...) = 1 + a/2 + a^2/4 + O(a^3) gives
 *        surplus_no_shift ~ S_inf(a/2 + a^2/4), so the residual above S_inf . a/2 is S_inf . a^2/4, the
 *        quadratic curvature of the rational headroom form -- not the seed shift. The small ~0.026 gap between
 *        1.1908 and 1.1651 is the O(a^3) and cross terms.
 *   (S3) THE SPLIT IS N-STABLE AND SHIFT STAYS <~2% ACROSS THE BAND. At band-bottom / N_cross / band-top the
 *        shift fraction shift_residual/total_residual is ~1.7% / ~1.8% / ~1.9%; the shift never rises above
 *        ~2% of the residual anywhere in the imp-34693 admissible seed band.
 *
 * CONSEQUENCE: the imp-35266 D3 phrasing "the a(N(1-delta)) > a(N) shift lifts it the last ~1.2" mis-assigns
 * the residual. The correct reading: the leading estimate S_inf . a/2 misses the exact surplus by the O(a^2)
 * curvature of the headroom rational form (~1.17, = S_inf . a^2/4), and the a-shift is a distant secondary
 * effect (~0.023). Both the shift AND the curvature are governed by the band-top local contraction factor a,
 * consistent with D3's overall conclusion that the surplus is set by a -- only the internal attribution of
 * the ~1.2 to the shift was wrong.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; reproduces the imp-35266/imp-35241 machinery
 * (identical K, delta, N_cross, band, headroom form). The imp-34714a machine certificate REMAINS OPEN; F(m) = 0
 * stays a double-precision artifact; C_C = 1/8 (imp-2642/2643) UNTOUCHED; C_mb GUE-conditional per imp-486
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent 1/2 per imp-3463 untouched; establishes no operator
 * positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35266-krawczyk-headroom-surplus-decomposition (D3 attributed the ~1.2 residual to the a-shift; this isolates it)
 * @see imp-35241-krawczyk-headroom-band-profile (reported the ~55.18 band-top surplus)
 * @see imp-34996-krawczyk-headroom-safety-factor-asymptote (S_inf = 1/(2 delta) large-N floor; 2G/(1+G) -> 1)
 * @see imp-34693-crossover-contraction-seed-band (admissible seed band + band-bottom/band-top)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35266/imp-35241)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width
const S_INF = 1 / (2 * DELTA); // 2500 exactly (imp-34996 large-N floor)

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
const L_CONTRACTION = aOf(1e9);
const L_AT_CROSS = aOf(N_CROSS);
const rho = (tol, k) => (tol * (1 - L_CONTRACTION)) / ((1 - L_AT_CROSS) * Math.pow(L_CONTRACTION, k));
const HALF_WIDTH = rho(1, 10); // ~1.7124e8 (imp-34693 seed band half-width)
const BAND_TOP = N_CROSS + HALF_WIDTH;
const BAND_BOTTOM = N_CROSS - HALF_WIDTH;

// Exact headroom surplus (seed-shifted FP_LO = 1 - a(N(1-delta))) vs the no-shift variant (a_lo -> a(N)).
function shiftSplitAt(N) {
  const a = aOf(N);
  const aLo = aOf(N * (1 - DELTA)); // seed-shifted lower fixed-point contraction factor
  const G = 1 - a;
  const S_exact = G / ((1 + G) * DELTA * (1 - aLo)); // exact (a-shift ON)
  const S_no_shift = G / ((1 + G) * DELTA * (1 - a)); // a-shift SWITCHED OFF (a_lo -> a(N))
  const surplus_exact = S_exact - S_INF;
  const surplus_no_shift = S_no_shift - S_INF;
  const surplus_leading = (S_INF * a) / 2; // D3 leading estimate S_inf . a/2
  const total_residual = surplus_exact - surplus_leading; // the D3 "~1.2"
  const shift_residual = surplus_exact - surplus_no_shift; // PURE a-shift contribution
  const curvature_residual = surplus_no_shift - surplus_leading; // O(a^2)+ non-shift piece
  const curvature_term = (S_INF * a * a) / 4; // second-order Taylor term S_inf . a^2/4
  return {
    N, a, aLo,
    surplus_exact, surplus_no_shift, surplus_leading,
    total_residual, shift_residual, curvature_residual, curvature_term,
    shift_fraction: shift_residual / total_residual,
  };
}

const TOP = shiftSplitAt(BAND_TOP);
const CROSS = shiftSplitAt(N_CROSS);
const BOTTOM = shiftSplitAt(BAND_BOTTOM);

// The additive split closes exactly: shift_residual + curvature_residual === total_residual.
const SPLIT_CLOSES =
  Math.abs(TOP.shift_residual + TOP.curvature_residual - TOP.total_residual) < 1e-9;

export const IMP35762_KRAWCZYK_SURPLUS_SHIFT_RESIDUAL_ISOLATION = {
  id: 'imp-35762',
  proofSection: 'S-frontier',
  question:
    'imp-35266 (D3) reported the exact +55.18 band-top Krawczyk headroom surplus is tracked to within ~2% by ' +
    'the leading estimate S_inf . a/2 ~ 53.97 and asserted "the a(N(1-delta)) > a(N) shift lifts it the last ' +
    '~1.2", but never isolated that ~1.2 residual as a number nor checked whether the seed shift accounts for ' +
    'it. Isolate the a-shift contribution directly and report it. Measurement only; surrogate; imp-34714a stays ' +
    'OPEN; changes no bound; NO QED.',
  finding:
    'Splitting the D3 ~1.214 total residual (surplus_exact - S_inf . a/2) into its PURE a-shift piece ' +
    '(surplus_exact - surplus_no_shift, switching FP_LO from 1 - a(N(1-delta)) to 1 - a(N)) and its non-shift ' +
    'remainder shows the D3 attribution is IMPRECISE. At the band-top the a-shift contributes only ~+0.0230 ' +
    '(~1.9% of the residual), because the seed shift a(N(1-delta)) ~ 0.0431844 vs a(N) ~ 0.0431758 is a ' +
    'relative bump of ~delta = 2e-4, so its surplus effect is ~S_inf . (a_lo - a) ~ 0.021 -- an order of ' +
    'magnitude too small to be "the last ~1.2". The ~1.2 is instead the O(a^2) CURVATURE term: the non-shift ' +
    'remainder ~+1.1908 (~98.1% of the residual) is well-approximated by S_inf . a^2/4 ~ 1.1651, the quadratic ' +
    'curvature of the headroom rational form (M_G . M_FP = 1 + a/2 + a^2/4 + O(a^3) with a_lo = a). The shift ' +
    'fraction is N-stable across the imp-34693 band (~1.7% / ~1.8% / ~1.9% at band-bottom / N_cross / ' +
    'band-top), never above ~2%. So the correct reading is: S_inf . a/2 misses the exact surplus by the ' +
    'O(a^2) curvature (~1.17), and the a-shift is a distant secondary effect (~0.023) -- consistent with D3 ' +
    'that both are governed by a, but CORRECTING the assignment of the ~1.2 to the shift. EVIDENCE / ' +
    'measurement, NOT a machine certificate.',
  constants: {
    N_cross: +N_CROSS.toPrecision(15),
    band_top_N: +BAND_TOP.toPrecision(15),
    delta: DELTA,
    S_inf_floor: S_INF,
    a_at_band_top: +TOP.a.toPrecision(10),
    a_lo_at_band_top: +TOP.aLo.toPrecision(10),
    a_shift_at_band_top: +(TOP.aLo - TOP.a).toPrecision(6),
    K_amplitude: +K_AMPL.toPrecision(10),
  },
  measurement: {
    surplus_exact_band_top: +TOP.surplus_exact.toFixed(6), // ~55.183546
    surplus_no_shift_band_top: +TOP.surplus_no_shift.toFixed(6), // ~55.160545
    surplus_leading_band_top: +TOP.surplus_leading.toFixed(6), // ~53.969745 (= S_inf . a/2)
    total_residual_band_top: +TOP.total_residual.toFixed(6), // ~1.213801 (the D3 "~1.2")
    shift_residual_band_top: +TOP.shift_residual.toFixed(6), // ~0.023001 (PURE a-shift, SMALL)
    curvature_residual_band_top: +TOP.curvature_residual.toFixed(6), // ~1.190800 (O(a^2)+ non-shift)
    curvature_term_S_inf_a2_over_4: +TOP.curvature_term.toFixed(6), // ~1.165093 (second-order Taylor)
    shift_fraction_band_top: +TOP.shift_fraction.toFixed(4), // ~0.0189 (~1.9% of the residual)
    split_closes_exactly: SPLIT_CLOSES, // true (shift + curvature === total to machine precision)
    // Same split at N_cross and band-bottom -- shift fraction stays under ~2% across the band.
    shift_fraction_N_cross: +CROSS.shift_fraction.toFixed(4), // ~0.0181
    shift_fraction_band_bottom: +BOTTOM.shift_fraction.toFixed(4), // ~0.0172
    shift_residual_N_cross: +CROSS.shift_residual.toFixed(6), // ~0.024283
    curvature_residual_N_cross: +CROSS.curvature_residual.toFixed(6), // ~1.319521
  },
  subGap:
    'imp-34714a REMAINS OPEN. Isolating the ~0.023 band-top a-shift residual from the ~1.17 O(a^2) curvature ' +
    'residual does NOT prove a directed-rounding [g](m)/[F-prime] evaluation yields valid enclosures: it rests ' +
    'on the gamma(n)/k eps surrogate models of the imp-34687a directed-rounding layer, not that layer, and ' +
    'F(m) = 0 remains a double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK BAND-TOP SURPLUS ~1.2 RESIDUAL, ISOLATED (frontier, NOT an RH bound). imp-35266 D3 attributed ' +
    'the ~1.2 residual between the exact +55.18 band-top surplus and the leading estimate S_inf . a/2 ~ 53.97 ' +
    'to "the a(N(1-delta)) > a(N) shift". MEASURING the shift directly (surplus_exact - surplus_no_shift, ' +
    'switching FP_LO from 1 - a(N(1-delta)) to 1 - a(N)) shows the a-shift contributes only ~+0.0230 -- ~1.9% ' +
    'of the ~1.214 total residual -- while the O(a^2) curvature term S_inf . a^2/4 ~ 1.1651 accounts for the ' +
    'rest (~+1.1908, ~98.1%). So the D3 attribution is IMPRECISE: the ~1.2 is the quadratic curvature of the ' +
    'headroom rational form, not the seed shift; the shift is a distant secondary effect. The shift fraction ' +
    'is N-stable across the imp-34693 band (~1.7-1.9%). This CORRECTS the internal assignment while confirming ' +
    'D3s overall point that the surplus is governed by a. EVIDENCE, NOT a machine certificate. SUB-GAP ' +
    'imp-34714a REMAINS OPEN: rests on the gamma(n)/k eps surrogate models, not the imp-34687a directed-rounding ' +
    'layer, and F(m) = 0 remains a double-precision artifact. Measurement only on the inherited ' +
    'imp-3220/imp-3406 surrogate; reproduces the imp-35266/imp-35241 machinery (identical K, delta, N_cross, ' +
    'band); C_C 1/8 (imp-2642/2643) and C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 ' +
    'untouched; far-tail exponent 1/2 per imp-3463 untouched; changes no bound; establishes no operator ' +
    'positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35266 (D3 attributed the ~1.2 residual to the a-shift; this isolates it); imp-35241 (band-top S ~ ' +
    '2555.18, surplus ~55.18); imp-34996 (S_inf = 1/(2 delta) floor); imp-34693 (admissible seed band + ' +
    'band-bottom/band-top); imp-33723 (Banach map g(N) = K log T0(N)); imp-2642 (C_C 1/8 ansatz); imp-3463 ' +
    '(far-tail exponent 1/2); lambda-rh-height-mapping (effectiveHeightForN RvM inverse). Additive residual ' +
    'split of a rational form via a switched-off finite-N correction + Taylor curvature comparison: standard.',
};

export const IMP35762_KRAWCZYK_SURPLUS_SHIFT_RESIDUAL_ISOLATION_ASSERTIONS = [
  {
    // The additive split closes exactly and reproduces the D3 ~1.2 total residual and ~55.18 exact surplus.
    id: 'imp35762-split-closes-reproduces-total-residual',
    description:
      'shift_residual + curvature_residual === total_residual (machine precision) and reproduces the D3 ~1.2 residual',
    holds: () =>
      SPLIT_CLOSES === true &&
      Math.abs(TOP.surplus_exact - 55.18) < 0.05 &&
      Math.abs(TOP.total_residual - 1.214) < 0.02,
  },
  {
    // The a-shift contributes only ~0.023 -- an order of magnitude below the ~1.2 residual, NOT its driver.
    id: 'imp35762-shift-residual-is-small',
    description: 'the a-shift residual ~+0.023 is ~1.9% of the ~1.2 total residual (shift is NOT the driver)',
    holds: () =>
      TOP.shift_residual > 0 &&
      Math.abs(TOP.shift_residual - 0.0230) < 0.003 &&
      TOP.shift_fraction < 0.02,
  },
  {
    // The ~1.2 is the O(a^2) curvature term: non-shift remainder ~1.19 ~ S_inf . a^2/4 ~ 1.165.
    id: 'imp35762-residual-is-curvature-not-shift',
    description: 'the ~1.19 non-shift remainder (~98% of the residual) is the O(a^2) curvature term S_inf . a^2/4 ~ 1.165',
    holds: () =>
      Math.abs(TOP.curvature_residual - 1.1908) < 0.01 &&
      Math.abs(TOP.curvature_term - 1.1651) < 0.01 &&
      TOP.curvature_residual > 40 * TOP.shift_residual,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp35762-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35762_KRAWCZYK_SURPLUS_SHIFT_RESIDUAL_ISOLATION.isRigorous === false &&
      /imp-34714a/.test(IMP35762_KRAWCZYK_SURPLUS_SHIFT_RESIDUAL_ISOLATION.subGap) &&
      /REMAINS OPEN/.test(IMP35762_KRAWCZYK_SURPLUS_SHIFT_RESIDUAL_ISOLATION.subGap) &&
      /NO QED/.test(IMP35762_KRAWCZYK_SURPLUS_SHIFT_RESIDUAL_ISOLATION.verdict) &&
      /refereed bound is changed/i.test(IMP35762_KRAWCZYK_SURPLUS_SHIFT_RESIDUAL_ISOLATION.verdict),
  },
];

for (const a of IMP35762_KRAWCZYK_SURPLUS_SHIFT_RESIDUAL_ISOLATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35762-krawczyk-surplus-shift-residual-isolation assertion failed: ${a.id}`);
  }
}
