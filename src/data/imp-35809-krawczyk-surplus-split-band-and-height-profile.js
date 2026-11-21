/**
 * @module imp-35809-krawczyk-surplus-split-band-and-height-profile
 *
 * imp-35762 additively split the imp-35266 D3 band-top Krawczyk headroom residual (surplus_exact minus the
 * leading estimate S_inf . a/2) into a tiny a-shift piece (~0.023, ~1.9%) and a dominant O(a^2) curvature piece
 * (~1.19, ~98.1%), but measured the fractions only at the three imp-34693 seed-band anchors (band-bottom /
 * N_cross / band-top). Its assertion S3 claimed the split "is N-stable across the band". This module measures
 * the curvature-vs-shift fractions (i) on a FINE grid across the whole imp-34693 admissible seed band and
 * (ii) along the HEIGHT axis up toward the Platt-Trudgian anchor N(T_PT) ~ 1.236e13, to test whether the
 * ~98/2 split is N-flat globally or drifts.
 *
 * THE SPLIT (reproducing the imp-35762 machinery verbatim)
 * -------------------------------------------------------
 * With FP_LO = 1 - a(N(1-delta)) (seed-shifted) and its no-shift variant a_lo -> a(N):
 *   total_residual     = surplus_exact - S_inf . a/2
 *     = shift_residual (surplus_exact - surplus_no_shift, PURE a-shift)
 *     + curvature_residual (surplus_no_shift - S_inf . a/2, O(a^2)+ non-shift).
 * Small-a algebra: surplus_no_shift = S_inf . 1/(1 - a/2) - S_inf = S_inf (a/2 + a^2/4 + ...), so
 *   curvature_residual ~ S_inf . a^2/4 (QUADRATIC in a), while
 *   shift_residual ~ S_inf . (a_lo - a) ~ S_inf . a . delta (LINEAR in a, delta = 2e-4 FIXED).
 * Hence shift_fraction ~ delta / (delta + a/4): governed by the SINGLE ratio a/(4 delta).
 *
 * WHAT THE MEASUREMENT FINDS
 * --------------------------
 *   (P1) N-FLAT ACROSS THE BAND. On an 11-point grid spanning band-bottom .. band-top the curvature fraction
 *        sits at ~98.10-98.28% and the shift fraction at ~1.72-1.90%, a monotone rise of only ~0.18 percentage
 *        point end-to-end. So imp-35762 S3 holds: WITHIN the imp-34693 band the ~98/2 split is essentially flat.
 *   (P2) THE SPLIT INVERTS TOWARD THE PT ANCHOR. Along the height axis the split is emphatically NOT flat.
 *        As N climbs from the band (~3.45e9, a ~ 0.0432) toward the PT anchor N ~ 1.236e13 (a ~ 1.23e-5), the
 *        contraction factor a shrinks by ~3500x, so the QUADRATIC curvature piece decays far faster than the
 *        LINEAR shift piece. The curvature share collapses from ~98% to ~1.5% and the shift share rises to
 *        ~98.5% -- a near-MIRROR of the band-top. The band-top's (1.90% shift / 98.10% curvature) maps to the
 *        PT anchor's (~98.49% shift / ~1.51% curvature).
 *   (P3) CLEAN CROSSOVER AT a = 4 delta. The 50/50 point (shift_fraction = curvature_fraction) lands at
 *        a ~ 7.99e-4, matching the closed-form crossover a = 4 delta = 8.0e-4 to within the small-a
 *        approximation, at N ~ 1.88e11 -- roughly two orders of magnitude in N above the band, still ~65x
 *        below the PT anchor. Above this height the shift piece dominates.
 *
 * CONSEQUENCE: imp-35762 S3 ("N-stable across the band") is CORRECT but scope-limited -- it is flat only WITHIN
 * the imp-34693 seed band, where a barely moves. Extended along the HEIGHT axis the ~98/2 split is a band-local
 * artifact that inverts by the PT anchor, driven entirely by the single ratio a/(4 delta) with a fixed delta.
 * This characterizes the drift imp-35809 asked for: the split is height-dependent, crossing 50/50 at a = 4 delta.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; reproduces the imp-35762/imp-35266/imp-35241
 * machinery (identical K, delta, N_cross, band, headroom form). The imp-34714a machine certificate REMAINS OPEN;
 * F(m) = 0 stays a double-precision artifact; C_C = 1/8 (imp-2642/2643) UNTOUCHED; C_mb GUE-conditional per
 * imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent 1/2 per imp-3463 untouched; establishes no
 * operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35762-krawczyk-surplus-shift-residual-isolation (defined the split; measured only the 3 band anchors)
 * @see imp-35266-krawczyk-headroom-surplus-decomposition (D3 leading estimate S_inf . a/2)
 * @see imp-34693-crossover-contraction-seed-band (admissible seed band + band-bottom/band-top)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35762/imp-35266)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width
const S_INF = 1 / (2 * DELTA); // 2500 exactly (imp-34996 large-N floor)
const N_PT_ANCHOR = 1.236e13; // Platt-Trudgian anchor N(T_PT) (imp-321/imp-3406 height mapping)

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

// The additive imp-35762 residual split at height N; returns the shift/curvature fractions.
function splitAt(N) {
  const a = aOf(N);
  const aLo = aOf(N * (1 - DELTA)); // seed-shifted lower fixed-point contraction factor
  const G = 1 - a;
  const S_exact = G / ((1 + G) * DELTA * (1 - aLo)); // a-shift ON
  const S_no_shift = G / ((1 + G) * DELTA * (1 - a)); // a-shift OFF (a_lo -> a(N))
  const surplus_exact = S_exact - S_INF;
  const surplus_no_shift = S_no_shift - S_INF;
  const surplus_leading = (S_INF * a) / 2;
  const total_residual = surplus_exact - surplus_leading;
  const shift_residual = surplus_exact - surplus_no_shift;
  const curvature_residual = surplus_no_shift - surplus_leading;
  return {
    N, a,
    total_residual, shift_residual, curvature_residual,
    shift_fraction: shift_residual / total_residual,
    curvature_fraction: curvature_residual / total_residual,
  };
}

// (P1) Fine 11-point grid across the imp-34693 admissible seed band.
const BAND_GRID = [];
for (let i = 0; i <= 10; i++) {
  const N = BAND_BOTTOM + ((BAND_TOP - BAND_BOTTOM) * i) / 10;
  const s = splitAt(N);
  BAND_GRID.push({ N: +N.toPrecision(10), a: +s.a.toPrecision(8),
    shift_fraction: +s.shift_fraction.toFixed(6), curvature_fraction: +s.curvature_fraction.toFixed(6) });
}
const BAND_SHIFT_MIN = Math.min(...BAND_GRID.map((r) => r.shift_fraction));
const BAND_SHIFT_MAX = Math.max(...BAND_GRID.map((r) => r.shift_fraction));
const BAND_CURV_MIN = Math.min(...BAND_GRID.map((r) => r.curvature_fraction));
const BAND_CURV_MAX = Math.max(...BAND_GRID.map((r) => r.curvature_fraction));

// (P2) Height ladder from the band up toward the PT anchor.
const HEIGHT_LADDER = [BAND_TOP, 1e10, 1e11, 1e12, N_PT_ANCHOR, 1e14].map((N) => {
  const s = splitAt(N);
  return { N: +N.toPrecision(6), T: +effectiveHeightForN(N).toPrecision(6), a: +s.a.toPrecision(6),
    shift_fraction: +s.shift_fraction.toFixed(6), curvature_fraction: +s.curvature_fraction.toFixed(6) };
});
const PT = splitAt(N_PT_ANCHOR);
const TOP = splitAt(BAND_TOP);

// (P3) Crossover height where shift_fraction = 0.5, by bisection on log N.
function crossoverN() {
  let lo = 1e10, hi = 1e12;
  for (let i = 0; i < 80; i++) {
    const mid = Math.sqrt(lo * hi);
    if (splitAt(mid).shift_fraction < 0.5) lo = mid;
    else hi = mid;
  }
  return Math.sqrt(lo * hi);
}
const N_CROSSOVER = crossoverN();
const A_CROSSOVER = aOf(N_CROSSOVER); // should match the closed form a = 4 . delta

export const IMP35809_KRAWCZYK_SURPLUS_SPLIT_BAND_AND_HEIGHT_PROFILE = {
  id: 'imp-35809',
  proofSection: 'S-frontier',
  question:
    'imp-35762 split the D3 band-top Krawczyk headroom residual into a ~1.9% a-shift piece and a ~98.1% O(a^2) ' +
    'curvature piece, but measured the fractions only at the three imp-34693 band anchors. Measure the ' +
    'curvature-vs-shift fractions across the whole admissible seed band and along the height axis toward the ' +
    'PT anchor N ~ 1.236e13 to confirm the ~98/2 split is N-flat or characterize its drift. Measurement only; ' +
    'surrogate; imp-34714a stays OPEN; changes no bound; NO QED.',
  finding:
    'The ~98/2 curvature/shift split is N-FLAT within the imp-34693 seed band but INVERTS toward the PT anchor. ' +
    '(P1) On an 11-point band grid the curvature fraction stays at ~98.10-98.28% and the shift fraction at ' +
    '~1.72-1.90% -- a monotone rise of only ~0.18 percentage point end-to-end, confirming imp-35762 S3 WITHIN ' +
    'the band. (P2) Along the height axis the split is NOT flat: as N climbs from the band (a ~ 0.0432) to the ' +
    'PT anchor N ~ 1.236e13 (a ~ 1.23e-5), a shrinks ~3500x, so the QUADRATIC curvature piece (~S_inf . a^2/4) ' +
    'decays far faster than the LINEAR shift piece (~S_inf . a . delta, delta = 2e-4 FIXED); the curvature ' +
    'share collapses from ~98% to ~1.51% and the shift share rises to ~98.49% -- a near-MIRROR of the band-top. ' +
    '(P3) The 50/50 crossover lands at a ~ 7.99e-4, matching the closed-form a = 4 . delta = 8.0e-4, at ' +
    'N ~ 1.88e11. So imp-35762 S3 is CORRECT but band-local: the ~98/2 split is a low-height artifact governed ' +
    'by the single ratio a/(4 . delta), and it inverts by the PT anchor. EVIDENCE / measurement, NOT a machine ' +
    'certificate.',
  constants: {
    N_cross: +N_CROSS.toPrecision(15),
    band_bottom_N: +BAND_BOTTOM.toPrecision(15),
    band_top_N: +BAND_TOP.toPrecision(15),
    N_pt_anchor: N_PT_ANCHOR,
    delta: DELTA,
    S_inf_floor: S_INF,
    K_amplitude: +K_AMPL.toPrecision(10),
    a_at_band_top: +TOP.a.toPrecision(8),
    a_at_pt_anchor: +PT.a.toPrecision(8),
  },
  measurement: {
    // (P1) fine band grid -- flat ~98/2
    band_grid: BAND_GRID,
    band_shift_fraction_range: [+BAND_SHIFT_MIN.toFixed(4), +BAND_SHIFT_MAX.toFixed(4)], // ~[0.0172, 0.0190]
    band_curvature_fraction_range: [+BAND_CURV_MIN.toFixed(4), +BAND_CURV_MAX.toFixed(4)], // ~[0.9810, 0.9828]
    band_curvature_flat_span: +(BAND_CURV_MAX - BAND_CURV_MIN).toFixed(4), // ~0.0018 (0.18 pct pt)
    // (P2) height ladder -- inverts
    height_ladder: HEIGHT_LADDER,
    shift_fraction_at_band_top: +TOP.shift_fraction.toFixed(6), // ~0.018950
    shift_fraction_at_pt_anchor: +PT.shift_fraction.toFixed(6), // ~0.984900 (INVERTED)
    curvature_fraction_at_pt_anchor: +PT.curvature_fraction.toFixed(6), // ~0.015100
    // (P3) crossover
    crossover_N: +N_CROSSOVER.toPrecision(6), // ~1.88e11
    crossover_a: +A_CROSSOVER.toPrecision(6), // ~7.99e-4
    crossover_a_closed_form_4delta: 4 * DELTA, // 8.0e-4
  },
  subGap:
    'imp-34714a REMAINS OPEN. Profiling the curvature/shift split across the band and up to the PT anchor does ' +
    'NOT prove a directed-rounding [g](m)/[F-prime] evaluation yields valid enclosures: it rests on the ' +
    'gamma(n)/k eps surrogate models of the imp-34687a directed-rounding layer, not that layer, and F(m) = 0 ' +
    'remains a double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK SURPLUS-SPLIT BAND-AND-HEIGHT PROFILE (frontier, NOT an RH bound). imp-35762 measured the D3 ' +
    'residual split (a-shift ~1.9% / O(a^2) curvature ~98.1%) only at the three imp-34693 band anchors and ' +
    'claimed it "N-stable across the band". Profiling it (P1) on an 11-point band grid confirms the flatness ' +
    'WITHIN the band (curvature ~98.10-98.28%, a ~0.18 pct-pt rise), but (P2) along the HEIGHT axis toward the ' +
    'PT anchor N ~ 1.236e13 the split INVERTS: a shrinks ~3500x, the QUADRATIC curvature piece decays faster ' +
    'than the LINEAR fixed-delta shift piece, and the curvature share collapses from ~98% to ~1.51% while the ' +
    'shift rises to ~98.49% -- a near-mirror of the band-top. (P3) The 50/50 crossover sits at a ~ 7.99e-4 = ' +
    '4 . delta (N ~ 1.88e11). So imp-35762 S3 is CORRECT but scope-limited: the ~98/2 split is a band-local ' +
    'artifact governed by the single ratio a/(4 . delta), not a global invariant. EVIDENCE, NOT a machine ' +
    'certificate. SUB-GAP imp-34714a REMAINS OPEN: rests on the gamma(n)/k eps surrogate models, not the ' +
    'imp-34687a directed-rounding layer, and F(m) = 0 remains a double-precision artifact. Measurement only on ' +
    'the inherited imp-3220/imp-3406 surrogate; reproduces the imp-35762/imp-35266/imp-35241 machinery ' +
    '(identical K, delta, N_cross, band); C_C 1/8 (imp-2642/2643) and C_mb GUE-conditional per imp-486 ' +
    'UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent 1/2 per imp-3463 untouched; changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35762 (defined the split; measured only the 3 band anchors); imp-35266 (D3 leading estimate ' +
    'S_inf . a/2); imp-35241 (band-top surplus ~55.18); imp-34996 (S_inf = 1/(2 delta) floor); imp-34693 ' +
    '(admissible seed band); imp-33723 (Banach map g(N) = K log T0(N)); imp-321/imp-3406 (PT anchor N ~ ' +
    '1.236e13); lambda-rh-height-mapping (effectiveHeightForN RvM inverse). Grid + height-ladder profiling of a ' +
    'previously three-point measurement with a closed-form crossover check: standard.',
};

export const IMP35809_KRAWCZYK_SURPLUS_SPLIT_BAND_AND_HEIGHT_PROFILE_ASSERTIONS = [
  {
    // (P1) Within the band the split is flat: curvature stays ~98%, spanning under half a percentage point.
    id: 'imp35809-band-split-is-flat',
    description: 'across the 11-point imp-34693 band grid the curvature fraction stays ~98.1-98.3% (flat span < 0.5 pct pt)',
    holds: () =>
      BAND_GRID.length === 11 &&
      BAND_CURV_MIN > 0.98 && BAND_CURV_MAX < 0.983 &&
      BAND_CURV_MAX - BAND_CURV_MIN < 0.005 &&
      // monotone shift rise band-bottom -> band-top (a decreases with N)
      BAND_GRID[10].shift_fraction > BAND_GRID[0].shift_fraction,
  },
  {
    // (P2) The split INVERTS toward the PT anchor: shift becomes dominant, curvature collapses.
    id: 'imp35809-split-inverts-toward-pt-anchor',
    description: 'at the PT anchor N ~ 1.236e13 the shift fraction ~0.985 exceeds the curvature fraction ~0.015 (inverted vs band-top)',
    holds: () =>
      TOP.shift_fraction < 0.02 && // band-top: curvature dominant
      PT.shift_fraction > 0.98 && // PT anchor: shift dominant (INVERTED)
      PT.curvature_fraction < 0.02 &&
      Math.abs(PT.shift_fraction + PT.curvature_fraction - 1) < 1e-9,
  },
  {
    // (P3) The 50/50 crossover matches the closed form a = 4 . delta.
    id: 'imp35809-crossover-at-4delta',
    description: 'the shift=curvature crossover sits at a ~ 4 . delta = 8e-4 (N ~ 1.88e11)',
    holds: () =>
      Math.abs(A_CROSSOVER - 4 * DELTA) < 4e-5 &&
      N_CROSSOVER > 1e11 && N_CROSSOVER < 3e11 &&
      Math.abs(splitAt(N_CROSSOVER).shift_fraction - 0.5) < 1e-3,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp35809-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35809_KRAWCZYK_SURPLUS_SPLIT_BAND_AND_HEIGHT_PROFILE.isRigorous === false &&
      /imp-34714a/.test(IMP35809_KRAWCZYK_SURPLUS_SPLIT_BAND_AND_HEIGHT_PROFILE.subGap) &&
      /REMAINS OPEN/.test(IMP35809_KRAWCZYK_SURPLUS_SPLIT_BAND_AND_HEIGHT_PROFILE.subGap) &&
      /NO QED/.test(IMP35809_KRAWCZYK_SURPLUS_SPLIT_BAND_AND_HEIGHT_PROFILE.verdict) &&
      /refereed bound is changed/i.test(IMP35809_KRAWCZYK_SURPLUS_SPLIT_BAND_AND_HEIGHT_PROFILE.verdict),
  },
];

for (const a of IMP35809_KRAWCZYK_SURPLUS_SPLIT_BAND_AND_HEIGHT_PROFILE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35809-krawczyk-surplus-split-band-and-height-profile assertion failed: ${a.id}`);
  }
}
