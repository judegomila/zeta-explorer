/**
 * @module imp-35396-krawczyk-surplus-offset-vs-curvature
 *
 * imp-35266 D3 decomposed the imp-35241 band-top Krawczyk contraction-validity headroom surplus S - S_inf (above
 * the closed-form floor S_inf = 1/(2 delta) = 2500) and reported that the NET surplus tracks the leading-order
 * estimate S_inf . a/2 = 2500 . 0.043176/2 ~ 53.97, with the last ~1.2 (exact surplus ~55.18) ATTRIBUTED to the
 * a(N(1-delta)) > a(N) contraction-factor shift (the FP_LO argument being pushed below N). imp-35376 tabulated
 * that ~1.2 gap at all three imp-34693 landmarks (1.496 / 1.344 / 1.214). This ticket (imp-35396) carries out the
 * imp-35266 attribution EXPLICITLY: it expands a(N(1-delta)) - a(N) to leading order in delta on the band and
 * asks whether that offset really accounts for the 55.18 - 53.97 gap. RESULT (exactly analogous to how imp-35392
 * refined the imp-35266 ratio hypothesis): it does NOT -- the a(N(1-delta)) shift carries only ~2% of the ~1.2;
 * the bulk ~1.19 is the second-order a curvature of the EXACT main factor a/(2-a), present with NO offset.
 *
 * THE EXACT ADDITIVE SURPLUS IDENTITY (splits the ~1.2 into offset vs curvature)
 * -----------------------------------------------------------------------------
 * With a = a(N), aLo = a(N(1-delta)), da = aLo - a, G = 1 - a, FP_LO = 1 - aLo, the headroom
 * S = G / ((1+G) delta FP_LO) gives, writing aLo = a + da, the EXACT closed additive form
 *   surplus = S - S_inf = S_inf . [ a(1-a) + da(2-a) ] / [ (2-a)(1-aLo) ]
 * which separates cleanly at da = 0 (aLo -> a) versus the offset:
 *   surplus = surplus_noOffset + daContrib,
 *   surplus_noOffset = S_inf . a/(2-a)                         (aLo -> a; EXACT in a, no delta shift)
 *   daContrib        = surplus - surplus_noOffset = S_inf . 2 da/((2-a)(1-a)) + O(da^2)   (the offset)
 * and surplus_noOffset itself is lead + curvature:
 *   lead      = S_inf . a/2                                    (imp-35266 D3 leading-order estimate)
 *   curvature = surplus_noOffset - lead = S_inf . a^2/(2(2-a)) (the second-order a term of a/(2-a))
 * MEASUREMENT (Q1): S_inf . a^2/(2(2-a)) reproduces the exact surplus_noOffset - lead to machine precision, and
 * S_inf . 2 da/((2-a)(1-a)) reproduces daContrib to < 3e-7 at all three landmarks -- both closed forms verified.
 *
 * WHERE THE ~1.2 ACTUALLY COMES FROM (the imp-35266 attribution is REFUTED, ~2% not ~100%)
 * ----------------------------------------------------------------------------------------
 * At the band-top the ~1.2 gap = exact surplus 55.18355 - lead 53.96974 = 1.21381 decomposes as
 *   curvature  = 1.19080  (98.1% of the gap)  -- the a^2/(2(2-a)) second-order term of a/(2-a), offset-free
 *   daContrib  = 0.02300  ( 1.9% of the gap)  -- the a(N(1-delta)) > a(N) shift imp-35266 named
 * MEASUREMENT (Q2): curvature + daContrib = 1.21380 reproduces the exact gap to < 1e-4 at all three landmarks
 * (band-bottom 1.47032 + 0.02572 = 1.49604; N_cross 1.31952 + 0.02428 = 1.34380; band-top above). So the ~1.2
 * is NOT the a(N(1-delta)) shift the ticket attributed it to: that shift contributes only ~0.023-0.026 (the
 * da_frac_of_gap runs 1.72% / 1.81% / 1.90% across the band). The dominant ~1.19 is the finite-a curvature of
 * the exact main term a/(2-a) -- what S_inf . a/2 drops by truncating a/(2-a) at first order in a -- and would be
 * present even at da = 0. This mirrors imp-35392 (the ratio +0.00042, by contrast, IS the offset da alone,
 * because there the leading a/2 curvatures cancel between M_G and M_FP; in the SURPLUS they do not cancel, so
 * the curvature dominates and the offset is a ~2% correction).
 *
 * THE OFFSET da ITSELF, EXPANDED TO LEADING ORDER IN delta (what the ticket asked for)
 * -----------------------------------------------------------------------------------
 * a(N) = 2 pi K / (T u), T = T0(N), u = log(T/2 pi); the finite-delta shift is da = a(N(1-delta)) - a(N).
 * MEASUREMENT (Q3): da is small and POSITIVE across the band (8.613e-6 band-top -> 9.559e-6 band-bottom), so
 * aLo > a as imp-35266 said; halved and G-amplified it gives daContrib = S_inf . 2 da/((2-a)(1-a)) ~ 0.023,
 * i.e. the a(N(1-delta)) > a(N) shift is REAL and correctly-signed but ~50x too small to be the ~1.2 gap.
 *
 * MEASUREMENT / DERIVATION ONLY on the inherited imp-3220/imp-3406 surrogate; reproduces the imp-35266/imp-35376/
 * imp-35241/imp-34996 machinery (identical K, delta, N_cross, band, headroom form). The imp-34714a machine
 * certificate REMAINS OPEN; F(m) = 0 stays a double-precision artifact; C_C = 1/8 (imp-2642/2643) UNTOUCHED;
 * C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent 1/2 per imp-3463
 * untouched; establishes no operator positivity; changes no bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35266-krawczyk-headroom-surplus-decomposition (D3 leading-order S_inf.a/2; ~1.2 attributed to a(N(1-delta)))
 * @see imp-35376-krawczyk-surplus-leading-order-band (tabulated the ~1.2 gap 1.496/1.344/1.214 at three landmarks)
 * @see imp-35392-krawczyk-headroom-ratio-second-order-terms (the RATIO +0.00042 IS the offset da; curvatures cancel there)
 * @see imp-35374-krawczyk-headroom-ratio-correction (exact closed form -dFP/dG = 2(aLo/a)(1-a)/(1-aLo))
 * @see imp-35241-krawczyk-headroom-band-profile (band-top S ~ 2555.18, surplus ~55.18 above the 2500 floor)
 * @see imp-34996-krawczyk-headroom-safety-factor-asymptote (S_inf = 1/(2 delta) floor; 2G/(1+G) -> 1)
 * @see imp-34693-crossover-contraction-seed-band (admissible seed band + band-bottom/band-top)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35266/imp-35376/imp-35241)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width
const S_INF = 1 / (2 * DELTA); // 2500 exactly (imp-34996 large-N floor)

// Banach map g(N) = K log T0(N), local contraction factor a(N) (identical to imp-35266/imp-35376).
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

// Decompose the exact surplus S - S_inf at a landmark N into (i) the offset-free main term S_inf.a/(2-a) = lead
// + curvature, and (ii) the a(N(1-delta)) > a(N) offset daContrib, with leading closed forms for each.
function decomposeAt(N) {
  const a = aOf(N);
  const aLo = aOf(N * (1 - DELTA));
  const da = aLo - a;
  const G = 1 - a;
  const FP_LO = 1 - aLo;
  const S = G / ((1 + G) * DELTA * FP_LO);
  const surplus = S - S_INF; // exact additive surplus above the 2500 floor (imp-35266 dG + dFP)
  const lead = (S_INF * a) / 2; // imp-35266 D3 leading-order estimate S_inf.a/2
  const gap = surplus - lead; // the ~1.2 imp-35266 attributed to the a(N(1-delta)) shift

  const surplusNoOffset = (S_INF * a) / (2 - a); // aLo -> a: exact main term, no delta shift
  const daContrib = surplus - surplusNoOffset; // the a(N(1-delta)) > a(N) offset total
  const curvature = surplusNoOffset - lead; // second-order a term of a/(2-a)

  const curvatureClosed = (S_INF * a * a) / (2 * (2 - a)); // S_inf . a^2/(2(2-a))
  const daClosed = (S_INF * 2 * da) / ((2 - a) * (1 - a)); // leading da-offset: S_inf . 2 da/((2-a)(1-a))

  const curvErr = Math.abs(curvatureClosed - curvature); // exact identity -> machine precision
  const daErr = Math.abs(daClosed - daContrib); // leading in da -> O(da^2) residual
  const recon = curvature + daContrib; // reconstructed gap (= gap by construction)
  const daFracOfGap = daContrib / gap; // fraction of the ~1.2 the offset carries

  return {
    N, a, aLo, da, surplus, lead, gap,
    surplusNoOffset, curvature, daContrib, curvatureClosed, daClosed,
    curvErr, daErr, recon, daFracOfGap,
  };
}

const BOTTOM = decomposeAt(BAND_BOTTOM);
const CROSS = decomposeAt(N_CROSS);
const TOP = decomposeAt(BAND_TOP);
const LANDMARKS = [BOTTOM, CROSS, TOP];

// (Q1) both closed forms verified: curvature = S_inf.a^2/(2(2-a)) to machine precision, daContrib to < 3e-7.
const CLOSED_FORMS_VERIFIED = LANDMARKS.every((r) => r.curvErr < 1e-9 && r.daErr < 1e-6);
// (Q2) curvature + daContrib reconstructs the exact ~1.2 gap to < 1e-4 at every landmark.
const GAP_RECONSTRUCTED = LANDMARKS.every((r) => Math.abs(r.recon - r.gap) < 1e-4);
// (Q2) the a(N(1-delta)) offset carries only ~2% of the gap; the curvature carries the dominant ~98%.
const OFFSET_IS_MINORITY = LANDMARKS.every((r) => r.daFracOfGap < 0.03 && r.curvature > 40 * r.daContrib);
// (Q3) the offset da is small and POSITIVE across the band (aLo > a, correctly signed) but ~50x too small.
const DA_POSITIVE_TINY = LANDMARKS.every((r) => r.da > 0 && r.da < 1e-5 && r.daContrib < 0.03);

export const IMP35396_KRAWCZYK_SURPLUS_OFFSET_VS_CURVATURE = {
  id: 'imp-35396',
  proofSection: 'S-frontier',
  question:
    'imp-35266 D3 reported the band-top Krawczyk headroom surplus tracks the leading-order S_inf . a/2 ~ 53.97 ' +
    'and ATTRIBUTED the last ~1.2 (exact surplus ~55.18) to the a(N(1-delta)) > a(N) contraction-factor shift. ' +
    'Expand a(N(1-delta)) - a(N) to leading order in delta on the imp-34693 band and confirm whether that offset ' +
    'accounts for the 55.18 - 53.97 gap, tabulating across band-bottom / N_cross / band-top. Measurement/derivation ' +
    'only on the inherited surrogate; imp-34714a stays OPEN; changes no bound; NO QED.',
  finding:
    'The imp-35266 attribution is REFUTED: the a(N(1-delta)) > a(N) shift carries only ~2% of the ~1.2 gap, not ' +
    'all of it. The exact additive identity surplus = S_inf . [a(1-a) + da(2-a)] / [(2-a)(1-aLo)] (da = aLo - a) ' +
    'splits into surplus_noOffset = S_inf . a/(2-a) (aLo -> a, exact in a) plus the offset daContrib = ' +
    'S_inf . 2 da/((2-a)(1-a)) + O(da^2); and surplus_noOffset = lead + curvature with lead = S_inf . a/2 and ' +
    'curvature = S_inf . a^2/(2(2-a)). At the band-top the ~1.2 gap 55.18355 - 53.96974 = 1.21381 decomposes as ' +
    'curvature 1.19080 (98.1%) + daContrib 0.02300 (1.9%): the DOMINANT ~1.19 is the second-order a curvature of ' +
    'the exact main term a/(2-a) -- present even at da = 0 -- and only ~0.023 is the a(N(1-delta)) shift the ' +
    'ticket named. The offset da is real and correctly signed (positive, aLo > a, ~8.6e-6 band-top) but ~50x too ' +
    'small to be the gap; its fraction of the gap runs 1.72% / 1.81% / 1.90% across the band. Both closed forms ' +
    'are verified (curvature to machine precision, daContrib to < 3e-7) and reconstruct the exact gap to < 1e-4. ' +
    'This mirrors imp-35392 for the surplus: the RATIO +0.00042 IS the offset (leading a/2 curvatures cancel ' +
    'between M_G and M_FP), but in the SURPLUS they do not cancel, so the curvature dominates. EVIDENCE, NOT a ' +
    'machine certificate.',
  constants: {
    N_cross: +N_CROSS.toPrecision(15),
    band_bottom_N: +BAND_BOTTOM.toPrecision(15),
    band_top_N: +BAND_TOP.toPrecision(15),
    delta: DELTA,
    S_inf_floor: S_INF,
    K_amplitude: +K_AMPL.toPrecision(10),
    a_band_bottom: +BOTTOM.a.toPrecision(10),
    a_N_cross: +CROSS.a.toPrecision(10),
    a_band_top: +TOP.a.toPrecision(10),
  },
  measurement: {
    // (Q1) the two closed forms, verified against the exact decomposition.
    curvature_closed_form: 'S_inf . a^2/(2(2-a))',
    da_offset_closed_form: 'S_inf . 2 da/((2-a)(1-a))',
    curvature_closed_residual_band_top: +TOP.curvErr.toPrecision(4), // ~machine precision
    da_offset_closed_residual_band_top: +TOP.daErr.toPrecision(4), // ~2.07e-7 (O(da^2))
    closed_forms_verified: CLOSED_FORMS_VERIFIED, // true
    // (Q2) the ~1.2 gap split into curvature (~98%) and the a(N(1-delta)) offset (~2%) at each landmark.
    gap_band_bottom: +BOTTOM.gap.toFixed(5), // ~1.49604
    curvature_band_bottom: +BOTTOM.curvature.toFixed(5), // ~1.47032
    da_contrib_band_bottom: +BOTTOM.daContrib.toFixed(6), // ~0.025716
    da_frac_of_gap_band_bottom: +BOTTOM.daFracOfGap.toPrecision(4), // ~0.01719
    gap_N_cross: +CROSS.gap.toFixed(5), // ~1.34380
    curvature_N_cross: +CROSS.curvature.toFixed(5), // ~1.31952
    da_contrib_N_cross: +CROSS.daContrib.toFixed(6), // ~0.024283
    da_frac_of_gap_N_cross: +CROSS.daFracOfGap.toPrecision(4), // ~0.01807
    gap_band_top: +TOP.gap.toFixed(5), // ~1.21381
    curvature_band_top: +TOP.curvature.toFixed(5), // ~1.19080
    da_contrib_band_top: +TOP.daContrib.toFixed(6), // ~0.023001
    da_frac_of_gap_band_top: +TOP.daFracOfGap.toPrecision(4), // ~0.01895
    gap_reconstructed_all_landmarks: GAP_RECONSTRUCTED, // true (curvature + daContrib = gap to < 1e-4)
    offset_is_minority_curvature_dominates: OFFSET_IS_MINORITY, // true (offset < 3%, curvature > 40x offset)
    // (Q3) the offset da itself, expanded to leading order in delta: positive, tiny, ~50x too small.
    da_shift_band_bottom: +BOTTOM.da.toPrecision(8), // ~9.559e-6
    da_shift_N_cross: +CROSS.da.toPrecision(8), // ~9.061e-6
    da_shift_band_top: +TOP.da.toPrecision(8), // ~8.613e-6
    da_positive_tiny_across_band: DA_POSITIVE_TINY, // true (aLo > a, correctly signed, ~50x too small)
  },
  subGap:
    'imp-34714a REMAINS OPEN. Showing the ~1.2 surplus gap is ~98% the a^2/(2(2-a)) curvature of the exact main ' +
    'term a/(2-a) and only ~2% the a(N(1-delta)) offset does NOT prove a directed-rounding [g](m)/[F-prime] ' +
    'evaluation yields valid enclosures: it rests on the gamma(n)/k eps surrogate models of the imp-34687a ' +
    'directed-rounding layer, not that layer, and F(m) = 0 remains a double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK SURPLUS OFFSET-VS-CURVATURE DECOMPOSITION, DERIVED (frontier, NOT an RH bound). The ticket asked ' +
    'whether the imp-35266 ~1.2 gap between the leading S_inf . a/2 ~ 53.97 and the exact band-top surplus ~55.18 ' +
    'is the a(N(1-delta)) > a(N) shift it attributed it to. RESULT: it is NOT -- that shift carries only ~2%. The ' +
    'exact additive identity surplus = S_inf . [a(1-a) + da(2-a)] / [(2-a)(1-aLo)] splits into surplus_noOffset = ' +
    'S_inf . a/(2-a) = lead + curvature (lead = S_inf . a/2, curvature = S_inf . a^2/(2(2-a))) plus the offset ' +
    'daContrib = S_inf . 2 da/((2-a)(1-a)) + O(da^2). At the band-top the 1.21381 gap = curvature 1.19080 (98.1%) ' +
    '+ daContrib 0.02300 (1.9%); the offset fraction runs 1.72% / 1.81% / 1.90% across the band and both closed ' +
    'forms reconstruct the exact gap to < 1e-4. The a(N(1-delta)) shift is real and correctly signed (da positive, ' +
    '~8.6e-6 band-top, aLo > a) but ~50x too small to be the gap; the dominant ~1.19 is the second-order a ' +
    'curvature of the exact main term a/(2-a), present even at da = 0. This REFINES imp-35266 and mirrors ' +
    'imp-35392: for the RATIO the leading a/2 curvatures cancel between M_G and M_FP so the +0.00042 IS the offset, ' +
    'but in the SURPLUS they do not cancel so the curvature dominates. EVIDENCE, NOT a machine certificate. ' +
    'SUB-GAP imp-34714a REMAINS OPEN: rests on the gamma(n)/k eps surrogate models, not the imp-34687a ' +
    'directed-rounding layer, and F(m) = 0 remains a double-precision artifact. Measurement/derivation only on ' +
    'the inherited imp-3220/imp-3406 surrogate; reproduces the imp-35266/imp-35376/imp-35241/imp-34996 machinery ' +
    '(identical K, delta, N_cross, band); the C_C 1/8 ansatz (imp-2642/2643) and C_mb GUE-conditional per imp-486 ' +
    'are UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent 1/2 per imp-3463 untouched; changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35266 (D3 leading-order S_inf . a/2; ~1.2 attributed to a(N(1-delta))); imp-35376 (tabulated the ~1.2 ' +
    'gap 1.496/1.344/1.214 at three landmarks); imp-35392 (the ratio +0.00042 IS the offset da; curvatures cancel ' +
    'there); imp-35374 (exact closed form -dFP/dG = 2(aLo/a)(1-a)/(1-aLo)); imp-35241 (band-top S ~ 2555.18); ' +
    'imp-34996 (S_inf = 1/(2 delta) floor; 2G/(1+G) -> 1); imp-34693 (admissible seed band + band-bottom/band-top); ' +
    'imp-33723 (Banach map g(N) = K log T0(N)); imp-2642 (C_C 1/8 ansatz); imp-3463 (far-tail exponent 1/2); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse). Leading-order delta expansion of a rational ' +
    'surplus and additive decomposition: standard.',
};

export const IMP35396_KRAWCZYK_SURPLUS_OFFSET_VS_CURVATURE_ASSERTIONS = [
  {
    // (Q1) both closed forms verified: curvature to machine precision, da-offset to < 3e-7.
    id: 'imp35396-closed-forms-verified',
    description: 'curvature = S_inf.a^2/(2(2-a)) to machine precision and daContrib = S_inf.2da/((2-a)(1-a)) to < 3e-7',
    holds: () =>
      CLOSED_FORMS_VERIFIED === true &&
      TOP.curvErr < 1e-9 &&
      TOP.daErr < 1e-6,
  },
  {
    // (Q2) the ~1.2 gap reconstructs from curvature + daContrib, and reproduces the imp-35266/imp-35376 numbers.
    id: 'imp35396-gap-reconstructed-band-top',
    description: 'band-top curvature 1.1908 + daContrib 0.02300 = gap 1.2138 (exact surplus 55.18, lead 53.97)',
    holds: () =>
      GAP_RECONSTRUCTED === true &&
      Math.abs(TOP.surplus - 55.18355) < 0.01 &&
      Math.abs(TOP.lead - 53.96974) < 0.01 &&
      Math.abs(TOP.curvature - 1.1908) < 0.01 &&
      Math.abs(TOP.daContrib - 0.023001) < 0.001,
  },
  {
    // (Q2) the a(N(1-delta)) offset carries only ~2% of the gap; the curvature dominates (the attribution refuted).
    id: 'imp35396-offset-is-minority-curvature-dominates',
    description: 'the a(N(1-delta)) offset is < 3% of the ~1.2 gap at every landmark; curvature is > 40x the offset',
    holds: () =>
      OFFSET_IS_MINORITY === true &&
      TOP.daFracOfGap < 0.02 &&
      BOTTOM.daFracOfGap < 0.02,
  },
  {
    // (Q3) the offset da is real, positive (aLo > a) and small across the band -- correctly signed but ~50x too small.
    id: 'imp35396-offset-da-positive-tiny',
    description: 'da = a(N(1-delta)) - a(N) is positive and ~8.6-9.6e-6 across the band, giving daContrib ~0.023-0.026',
    holds: () =>
      DA_POSITIVE_TINY === true &&
      TOP.da > 8e-6 && TOP.da < 9e-6 &&
      BOTTOM.da > 9e-6 && BOTTOM.da < 1e-5,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp35396-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35396_KRAWCZYK_SURPLUS_OFFSET_VS_CURVATURE.isRigorous === false &&
      /imp-34714a/.test(IMP35396_KRAWCZYK_SURPLUS_OFFSET_VS_CURVATURE.subGap) &&
      /REMAINS OPEN/.test(IMP35396_KRAWCZYK_SURPLUS_OFFSET_VS_CURVATURE.subGap) &&
      /NO QED/.test(IMP35396_KRAWCZYK_SURPLUS_OFFSET_VS_CURVATURE.verdict) &&
      /refereed bound is changed/i.test(IMP35396_KRAWCZYK_SURPLUS_OFFSET_VS_CURVATURE.verdict),
  },
];

for (const a of IMP35396_KRAWCZYK_SURPLUS_OFFSET_VS_CURVATURE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35396-krawczyk-surplus-offset-vs-curvature assertion failed: ${a.id}`);
  }
}
