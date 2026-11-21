/**
 * @module imp-35783-krawczyk-surplus-raw-da-times-sinf
 *
 * imp-35266 D3 reported that the imp-35241 band-top Krawczyk contraction-validity headroom surplus S - S_inf (above
 * the closed-form floor S_inf = 1/(2 delta) = 2500) tracks the leading-order estimate S_inf . a/2 = 53.97, and named
 * the a(N(1-delta)) > a(N) contraction-factor shift as the source of the last ~1.2 (exact surplus ~55.18). THIS
 * TICKET (imp-35783) tests the D3 attribution in its most LITERAL form: it quantifies the ticket-named correction
 * as the raw product (a(N(1-delta)) - a(N)) . S_inf = da . S_inf, and asks whether that closes the 55.18 - 53.97 gap.
 *
 * WHAT THE TICKETs OWN da . S_inf FORMULA GIVES (it does NOT close the gap)
 * -----------------------------------------------------------------------
 * With a = a(N), aLo = a(N(1-delta)), da = aLo - a, the raw ticket term at the three imp-34693 landmarks is
 *   daRaw = da . S_inf   =   0.023897 (band-bottom) / 0.022653 (N_cross) / 0.021533 (band-top)
 * against the exact ~1.2 gap 1.49604 / 1.34380 / 1.21380. So daRaw is only 1.60% / 1.69% / 1.77% of the gap: the
 * literal da . S_inf term MISSES the gap by ~50x. This REPRODUCES the imp-35396 refutation of the D3 attribution
 * (the a(N(1-delta)) offset carries only ~2% of the ~1.2), now with the ticket-named product itself as the probe.
 *
 * WHY EVEN THE OFFSET PIECE IS NOT da . S_inf: THE KRAWCZYK G-AMPLIFICATION 2/((2-a)(1-a))
 * --------------------------------------------------------------------------------------
 * imp-35396 measured the exact additive offset daContrib = surplus - S_inf . a/(2-a) and gave its leading closed
 * form daContrib = S_inf . 2 da/((2-a)(1-a)) + O(da^2). Comparing that to the ticket raw term isolates a factor
 *   daContrib / daRaw  ->  amp = 2/((2-a)(1-a))   =   1.076113 / 1.071930 / 1.068184  across the band,
 * i.e. the raw da . S_inf UNDER-counts even the true offset piece by the Krawczyk G-amplification 2/((2-a)(1-a)),
 * which is 1 + O(a) (a ~ 0.043-0.048 on the band). MEASURED: daRaw / daContrib = 0.929 / 0.933 / 0.936, so the
 * literal term recovers ~93% of the offset and the missing ~7% is exactly the (2-a)(1-a) denominator of the surplus.
 * The offset itself is a ~2% correction (imp-35396); the dominant ~98% is the S_inf . a^2/(2(2-a)) second-order
 * curvature of the exact main factor a/(2-a), present even at da = 0 and NOT captured by any da-linear term.
 *
 * CONCLUSION: the ticket-literal da . S_inf term is real, positive (aLo > a) and correctly signed, but (i) it is
 * ~50x too small to close the ~1.2 gap, and (ii) it under-counts even the true da-offset by the ~1.07 Krawczyk
 * G-amplification 2/((2-a)(1-a)). The D3 attribution of the ~1.2 to the band-shift is REFUTED (per imp-35396); the
 * gap is dominated by curvature, not the offset.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; reproduces the imp-35266/imp-35396/imp-35376/
 * imp-35241/imp-34996 machinery (identical K, delta, N_cross, band, headroom form). The imp-34714a machine
 * certificate REMAINS OPEN; F(m) = 0 stays a double-precision artifact; C_C = 1/8 (imp-2642/2643) UNTOUCHED;
 * C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent 1/2 per imp-3463
 * untouched; establishes no operator positivity; changes no bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35396-krawczyk-surplus-offset-vs-curvature (exact split: offset ~2%, curvature ~98%; the D3 refutation)
 * @see imp-35266-krawczyk-headroom-surplus-decomposition (D3 leading-order S_inf.a/2; ~1.2 attributed to a(N(1-delta)))
 * @see imp-35376-krawczyk-surplus-leading-order-band (tabulated the ~1.2 gap 1.496/1.344/1.214 at three landmarks)
 * @see imp-35241-krawczyk-headroom-band-profile (band-top S ~ 2555.18, surplus ~55.18 above the 2500 floor)
 * @see imp-34996-krawczyk-headroom-safety-factor-asymptote (S_inf = 1/(2 delta) floor; 2G/(1+G) -> 1)
 * @see imp-34693-crossover-contraction-seed-band (admissible seed band + band-bottom/band-top)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35396/imp-35266/imp-35241)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width
const S_INF = 1 / (2 * DELTA); // 2500 exactly (imp-34996 large-N floor)

// Banach map g(N) = K log T0(N), local contraction factor a(N) (identical to imp-35396/imp-35266).
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

// Evaluate the ticket-literal correction daRaw = da . S_inf at a landmark N and compare it to (i) the exact ~1.2
// gap surplus - S_inf.a/2, and (ii) the imp-35396 true additive offset daContrib = surplus - S_inf.a/(2-a).
function measureAt(N) {
  const a = aOf(N);
  const aLo = aOf(N * (1 - DELTA));
  const da = aLo - a;
  const G = 1 - a;
  const FP_LO = 1 - aLo;
  const S = G / ((1 + G) * DELTA * FP_LO);
  const surplus = S - S_INF; // exact additive surplus above the 2500 floor
  const lead = (S_INF * a) / 2; // imp-35266 D3 leading-order estimate S_inf.a/2
  const gap = surplus - lead; // the ~1.2 imp-35266 attributed to the a(N(1-delta)) shift

  const daRaw = da * S_INF; // the TICKET-literal correction term: (a(N(1-delta)) - a(N)) . S_inf
  const daContrib = surplus - (S_INF * a) / (2 - a); // imp-35396 exact additive offset (aLo -> a residual)
  const amp = 2 / ((2 - a) * (1 - a)); // Krawczyk G-amplification factor: daContrib/daRaw at leading order

  const rawFracOfGap = daRaw / gap; // fraction of the ~1.2 the raw term carries (~2%)
  const rawFracOfOffset = daRaw / daContrib; // how much of even the offset the raw term recovers (~93%)
  const ampErr = Math.abs((daRaw * amp) - daContrib); // daRaw . amp reproduces daContrib to O(da^2)

  return { N, a, aLo, da, surplus, lead, gap, daRaw, daContrib, amp, rawFracOfGap, rawFracOfOffset, ampErr };
}

const BOTTOM = measureAt(BAND_BOTTOM);
const CROSS = measureAt(N_CROSS);
const TOP = measureAt(BAND_TOP);
const LANDMARKS = [BOTTOM, CROSS, TOP];

// (A) the ticket-literal da . S_inf term is ~50x too small to close the ~1.2 gap (< 2% at every landmark).
const RAW_MISSES_GAP = LANDMARKS.every((r) => r.rawFracOfGap < 0.02 && r.gap > 40 * r.daRaw);
// (B) da . S_inf under-counts even the true offset by the Krawczyk G-amplification 2/((2-a)(1-a)) ~ 1.07.
const AMP_RECOVERS_OFFSET = LANDMARKS.every((r) => r.amp > 1.06 && r.amp < 1.09 && r.ampErr < 1e-6);
// (B) the raw term recovers ~93% of the true offset; the missing ~7% is the (2-a)(1-a) denominator.
const RAW_IS_93PCT_OF_OFFSET = LANDMARKS.every((r) => r.rawFracOfOffset > 0.92 && r.rawFracOfOffset < 0.94);
// (C) da is real, positive (aLo > a) and tiny across the band -- correctly signed but far too small.
const DA_POSITIVE_TINY = LANDMARKS.every((r) => r.da > 0 && r.da < 1e-5 && r.daRaw < 0.03);

export const IMP35783_KRAWCZYK_SURPLUS_RAW_DA_TIMES_SINF = {
  id: 'imp-35783',
  proofSection: 'S-frontier',
  question:
    'imp-35266 D3 noted the leading-order band-top surplus S_inf . a/2 ~ 53.97 sits ~2% below the exact ~55.18 and ' +
    'said the a(N(1-delta)) > a(N) shift lifts it the last ~1.2. Quantify that ~1.2 correction in its most literal ' +
    'form as the FP_LO argument shift (a(N(1-delta)) - a(N)) . S_inf = da . S_inf, and verify whether it closes the ' +
    'gap to the exact band-top surplus, tabulating across band-bottom / N_cross / band-top. Measurement only on the ' +
    'inherited surrogate; imp-34714a stays OPEN; changes no bound; NO QED.',
  finding:
    'The ticket-literal da . S_inf term does NOT close the ~1.2 gap: it is ~50x too small. At the band-top ' +
    'daRaw = da . S_inf = 8.61313e-6 . 2500 = 0.021533 against the exact gap 55.18355 - 53.96974 = 1.21380, i.e. ' +
    'only 1.77% of the gap (1.60% band-bottom, 1.69% N_cross). This REPRODUCES the imp-35396 refutation of the D3 ' +
    'attribution now with the ticket-named product itself as the probe. Moreover the raw term under-counts even the ' +
    'true additive offset daContrib = surplus - S_inf . a/(2-a): daContrib / daRaw = 2/((2-a)(1-a)) = 1.068184 at ' +
    'the band-top (1.076113 / 1.071930 across the band), the Krawczyk G-amplification, so daRaw recovers ~93.6% of ' +
    'the offset and the missing ~6.4% is the (2-a)(1-a) denominator of the surplus; daRaw . amp reproduces ' +
    'daContrib to O(da^2) (< 1e-6). The offset piece itself is only ~2% of the ~1.2 (imp-35396); the dominant ~98% ' +
    'is the S_inf . a^2/(2(2-a)) second-order curvature of the exact main factor a/(2-a), present even at da = 0 ' +
    'and NOT captured by any da-linear term. da is real, positive (aLo > a) and ~8.6-9.6e-6 across the band -- ' +
    'correctly signed but far too small to be the gap. EVIDENCE, NOT a machine certificate.',
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
    // (A) the ticket-literal da . S_inf term vs the exact ~1.2 gap at each landmark.
    da_raw_formula: '(a(N(1-delta)) - a(N)) . S_inf = da . S_inf',
    gap_band_bottom: +BOTTOM.gap.toFixed(5), // ~1.49604
    da_raw_band_bottom: +BOTTOM.daRaw.toFixed(6), // ~0.023897
    raw_frac_of_gap_band_bottom: +BOTTOM.rawFracOfGap.toPrecision(4), // ~0.01597
    gap_N_cross: +CROSS.gap.toFixed(5), // ~1.34380
    da_raw_N_cross: +CROSS.daRaw.toFixed(6), // ~0.022653
    raw_frac_of_gap_N_cross: +CROSS.rawFracOfGap.toPrecision(4), // ~0.01686
    gap_band_top: +TOP.gap.toFixed(5), // ~1.21380
    da_raw_band_top: +TOP.daRaw.toFixed(6), // ~0.021533
    raw_frac_of_gap_band_top: +TOP.rawFracOfGap.toPrecision(4), // ~0.01774
    raw_misses_gap_all_landmarks: RAW_MISSES_GAP, // true (raw < 2% of gap; gap > 40x raw)
    // (B) the Krawczyk G-amplification that separates the raw term from the true offset.
    amplification_closed_form: '2/((2-a)(1-a))',
    amp_band_bottom: +BOTTOM.amp.toFixed(6), // ~1.076113
    amp_N_cross: +CROSS.amp.toFixed(6), // ~1.071930
    amp_band_top: +TOP.amp.toFixed(6), // ~1.068184
    da_contrib_band_top: +TOP.daContrib.toFixed(6), // ~0.023001 (imp-35396 offset)
    raw_frac_of_offset_band_top: +TOP.rawFracOfOffset.toFixed(5), // ~0.93616
    amp_reproduces_offset: AMP_RECOVERS_OFFSET, // true (daRaw . amp = daContrib to < 1e-6)
    raw_is_93pct_of_offset: RAW_IS_93PCT_OF_OFFSET, // true (raw recovers ~93% of the offset)
    // (C) the shift da itself: positive, tiny, ~50x too small to be the gap.
    da_shift_band_bottom: +BOTTOM.da.toPrecision(8), // ~9.5589e-6
    da_shift_N_cross: +CROSS.da.toPrecision(8), // ~9.0614e-6
    da_shift_band_top: +TOP.da.toPrecision(8), // ~8.6131e-6
    da_positive_tiny_across_band: DA_POSITIVE_TINY, // true (aLo > a, correctly signed, ~50x too small)
  },
  subGap:
    'imp-34714a REMAINS OPEN. Showing the ticket-literal da . S_inf term is ~50x too small to close the ~1.2 gap ' +
    'and under-counts even the true da-offset by the Krawczyk G-amplification 2/((2-a)(1-a)) does NOT prove a ' +
    'directed-rounding [g](m)/[F-prime] evaluation yields valid enclosures: it rests on the gamma(n)/k eps ' +
    'surrogate models of the imp-34687a directed-rounding layer, not that layer, and F(m) = 0 remains a ' +
    'double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK SURPLUS RAW da . S_inf CORRECTION, MEASURED (frontier, NOT an RH bound). The ticket asked whether the ' +
    'imp-35266 D3 ~1.2 gap between the leading S_inf . a/2 ~ 53.97 and the exact band-top surplus ~55.18 is closed ' +
    'by the literal FP_LO argument-shift product da . S_inf. RESULT: it is NOT -- daRaw = da . S_inf = 0.021533 at ' +
    'the band-top is only 1.77% of the 1.21380 gap (1.60% / 1.69% band-bottom / N_cross), ~50x too small, ' +
    'reproducing the imp-35396 refutation. The raw term under-counts even the exact additive offset daContrib = ' +
    'surplus - S_inf . a/(2-a) by the Krawczyk G-amplification daContrib/daRaw = 2/((2-a)(1-a)) = 1.068184 ' +
    '(band-top); daRaw recovers ~93.6% of the offset (daRaw . amp = daContrib to < 1e-6). The offset itself is a ' +
    '~2% correction; the dominant ~98% is the S_inf . a^2/(2(2-a)) curvature of the exact main factor a/(2-a), ' +
    'present even at da = 0. The shift da is real, positive (aLo > a) and ~8.6-9.6e-6 across the band -- correctly ' +
    'signed but far too small. EVIDENCE, NOT a machine certificate. SUB-GAP imp-34714a REMAINS OPEN: rests on the ' +
    'gamma(n)/k eps surrogate models, not the imp-34687a directed-rounding layer, and F(m) = 0 remains a ' +
    'double-precision artifact. Measurement only on the inherited imp-3220/imp-3406 surrogate; reproduces the ' +
    'imp-35266/imp-35396/imp-35376/imp-35241/imp-34996 machinery (identical K, delta, N_cross, band); the C_C 1/8 ' +
    'ansatz (imp-2642/2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; ' +
    'far-tail exponent 1/2 per imp-3463 untouched; changes no bound; establishes no operator positivity; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35266 (D3 leading-order S_inf . a/2; ~1.2 attributed to a(N(1-delta))); imp-35396 (exact split: offset ~2%, ' +
    'curvature ~98%; the D3 refutation and the daContrib = S_inf . 2 da/((2-a)(1-a)) closed form); imp-35376 ' +
    '(tabulated the ~1.2 gap 1.496/1.344/1.214 at three landmarks); imp-35241 (band-top S ~ 2555.18); imp-34996 ' +
    '(S_inf = 1/(2 delta) floor; 2G/(1+G) -> 1); imp-34693 (admissible seed band + band-bottom/band-top); imp-33723 ' +
    '(Banach map g(N) = K log T0(N)); imp-2642 (C_C 1/8 ansatz); imp-3463 (far-tail exponent 1/2); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse). Raw da . S_inf product and its ratio to the exact ' +
    'rational offset: standard.',
};

export const IMP35783_KRAWCZYK_SURPLUS_RAW_DA_TIMES_SINF_ASSERTIONS = [
  {
    // (A) the ticket-literal da . S_inf term is ~50x too small to close the ~1.2 gap (< 2% at every landmark).
    id: 'imp35783-raw-da-times-sinf-misses-gap',
    description: 'da . S_inf is < 2% of the ~1.2 gap at every landmark (band-top 0.021533 vs gap 1.2138); ~50x too small',
    holds: () =>
      RAW_MISSES_GAP === true &&
      Math.abs(TOP.daRaw - 0.021533) < 0.0005 &&
      Math.abs(TOP.gap - 1.21380) < 0.01 &&
      TOP.rawFracOfGap < 0.02,
  },
  {
    // (B) da . S_inf under-counts the true offset by the Krawczyk G-amplification 2/((2-a)(1-a)) ~ 1.07.
    id: 'imp35783-raw-under-counts-offset-by-g-amplification',
    description: 'daContrib/daRaw = 2/((2-a)(1-a)) ~ 1.068 at band-top; daRaw . amp reproduces daContrib to < 1e-6',
    holds: () =>
      AMP_RECOVERS_OFFSET === true &&
      RAW_IS_93PCT_OF_OFFSET === true &&
      Math.abs(TOP.amp - 1.068184) < 0.001 &&
      Math.abs(TOP.daContrib - 0.023001) < 0.001,
  },
  {
    // (C) the shift da is real, positive (aLo > a) and small across the band -- correctly signed but far too small.
    id: 'imp35783-da-positive-tiny',
    description: 'da = a(N(1-delta)) - a(N) is positive and ~8.6-9.6e-6 across the band, giving daRaw ~0.0215-0.0239',
    holds: () =>
      DA_POSITIVE_TINY === true &&
      TOP.da > 8e-6 && TOP.da < 9e-6 &&
      BOTTOM.da > 9e-6 && BOTTOM.da < 1e-5,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp35783-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35783_KRAWCZYK_SURPLUS_RAW_DA_TIMES_SINF.isRigorous === false &&
      /imp-34714a/.test(IMP35783_KRAWCZYK_SURPLUS_RAW_DA_TIMES_SINF.subGap) &&
      /REMAINS OPEN/.test(IMP35783_KRAWCZYK_SURPLUS_RAW_DA_TIMES_SINF.subGap) &&
      /NO QED/.test(IMP35783_KRAWCZYK_SURPLUS_RAW_DA_TIMES_SINF.verdict) &&
      /refereed bound is changed/i.test(IMP35783_KRAWCZYK_SURPLUS_RAW_DA_TIMES_SINF.verdict),
  },
];

for (const a of IMP35783_KRAWCZYK_SURPLUS_RAW_DA_TIMES_SINF_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35783-krawczyk-surplus-raw-da-times-sinf assertion failed: ${a.id}`);
  }
}
