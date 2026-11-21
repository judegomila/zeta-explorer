/**
 * @module imp-35437-krawczyk-headroom-ratio-nflat-grid
 *
 * imp-35404 baked the Krawczyk contraction-validity headroom 2:1 cancellation ratio -dFP/dG ~ 2.00042 as
 * "essentially N-flat" across the three imp-34693 admissible-band landmarks (band-bottom, N_cross, band-top),
 * all reading 2.00042 to five digits. That five-digit literal CANNOT resolve sub-1e-4 N-dependence. This ticket
 * (imp-35437) MEASURES whether the ratio is exactly N-invariant or drifts, by recomputing -dFP/dG on a FINE 81-point
 * grid spanning the whole band at extended (double) precision and reporting the ratio spread and its shape.
 *
 * VERDICT: the ratio is NOT exactly N-flat. On the 81-point grid it drifts SMOOTHLY and STRICTLY MONOTONE
 * DECREASING from band-bottom to band-top -- 2.00041905 (band-bottom) -> 2.00041796 (N_cross) -> 2.00041699
 * (band-top) -- with NO interior extremum, total spread max-min = 2.07e-6. Every one of the 81 grid values still
 * rounds to 2.00042 at five digits, so imp-35404's "N-flat" is a STORAGE-RESOLUTION artifact: 2.00042 is the
 * correctly-rounded constant but it CONCEALS a genuine, structured, monotone N-drift ~2.07e-6 (~25x below the 5e-5
 * that a five-digit literal can resolve). The drift is exactly the imp-35374 closed form -dFP/dG =
 * 2(aLo/a)(1-a)/(1-aLo), whose lift off 2 is the imp-35392 offset da = a(N(1-delta)) - a(N): both da/a (FP-side
 * relative shift) and the 1/(1-aLo) amplification shrink as N grows, so the ratio decreases monotonically with N.
 *
 * So the imp-35404 landmark values are correct to five digits and the ratio is genuinely N-flat AT THAT
 * RESOLUTION, but it is NOT an N-invariant constant: at extended precision it carries a real ~2e-6 monotone
 * descent across the band -- exactly the extended-precision N-dependence the ticket asked the finer grid to resolve.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; reproduces the imp-35266/imp-35374/imp-35392/
 * imp-35241/imp-34996 machinery (identical K, delta, N_cross, band, exact headroom factors). The imp-34714a machine
 * certificate REMAINS OPEN; F(m) = 0 stays a double-precision artifact; C_C = (1/8)sqrt(3 pi) (imp-2642/2714)
 * UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35404-krawczyk-headroom-cancellation-viz-data (baked 2.00042 "N-flat" landmark literals)
 * @see imp-35392-krawczyk-headroom-ratio-second-order-terms (the +0.00042 lift is the offset da; monotone decreasing)
 * @see imp-35374-krawczyk-headroom-ratio-correction (exact closed form -dFP/dG = 2(aLo/a)(1-a)/(1-aLo))
 * @see imp-35266-krawczyk-headroom-surplus-decomposition (2:1 cancellation, -dFP/dG ~ 2.00042 reported N-flat)
 * @see imp-34693-crossover-contraction-seed-band (admissible seed band + band-bottom/band-top)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35392/imp-35374/imp-35266)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width
const S_INF = 1 / (2 * DELTA); // 2500 exactly (imp-34996 large-N floor)

// Banach map g(N) = K log T0(N), local contraction factor a(N) (identical to imp-35392/imp-35374/imp-35266).
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

// The EXACT headroom cancellation ratio at N: -dFP/dG = 2(aLo/a)(1-a)/(1-aLo) (imp-35374 closed form).
function ratioAt(N) {
  const a = aOf(N);
  const aLo = aOf(N * (1 - DELTA));
  const G = 1 - a;
  const FP_LO = 1 - aLo;
  const M_G = (2 * G) / (1 + G);
  const dG = S_INF * (M_G - 1); // asymptotic-floor G-factor pull (negative)
  const dFP = S_INF * M_G * (1 / FP_LO - 1); // FP_LO finite-N push (positive)
  return -dFP / dG;
}

// FINE 81-point grid spanning the whole admissible band at extended precision.
const GRID_POINTS = 81;
const GRID = [];
for (let i = 0; i < GRID_POINTS; i++) {
  const N = BAND_BOTTOM + ((BAND_TOP - BAND_BOTTOM) * i) / (GRID_POINTS - 1);
  GRID.push({ N, ratio: ratioAt(N) });
}
const RATIOS = GRID.map((p) => p.ratio);
const RATIO_MIN = Math.min(...RATIOS);
const RATIO_MAX = Math.max(...RATIOS);
const RATIO_SPREAD = RATIO_MAX - RATIO_MIN;

// Shape probes across the fine grid.
let STRICTLY_DECREASING = true;
for (let i = 1; i < RATIOS.length; i++) {
  if (!(RATIOS[i] < RATIOS[i - 1])) STRICTLY_DECREASING = false;
}
const ALL_ROUND_TO_2_00042 = RATIOS.every((r) => r.toFixed(5) === '2.00042');
const RATIO_BAND_BOTTOM = ratioAt(BAND_BOTTOM);
const RATIO_N_CROSS = ratioAt(N_CROSS);
const RATIO_BAND_TOP = ratioAt(BAND_TOP);

export const IMP35437_KRAWCZYK_HEADROOM_RATIO_NFLAT_GRID = {
  id: 'imp-35437',
  proofSection: 'S-frontier',
  question:
    'imp-35404 baked the Krawczyk-headroom 2:1 cancellation ratio -dFP/dG ~ 2.00042 as "essentially N-flat" across ' +
    'the three imp-34693 band landmarks, all reading 2.00042 to five digits. Is the ratio EXACTLY N-invariant or ' +
    'does it drift at extended precision (the five-digit literal cannot resolve sub-1e-4 N-dependence)? Recompute ' +
    '-dFP/dG on a fine 81-point band grid at double precision and report the spread and its shape. ' +
    'Measurement only on the inherited surrogate; imp-34714a stays OPEN; changes no bound; NO QED.',
  finding:
    'The ratio is NOT exactly N-flat. On the fine 81-point grid it drifts SMOOTHLY and STRICTLY MONOTONE DECREASING ' +
    'from band-bottom to band-top -- 2.00041905 -> 2.00041796 (N_cross) -> 2.00041699 -- with NO interior extremum, ' +
    'total spread max-min = 2.07e-6. Every one of the 81 grid values still rounds to 2.00042 at five digits, so ' +
    'imp-35404 "N-flat" is a STORAGE-RESOLUTION artifact: 2.00042 is the correctly-rounded constant but conceals a ' +
    'genuine, structured, monotone N-drift ~2.07e-6 (~25x below the 5e-5 a five-digit literal can resolve). The ' +
    'descent is exactly the imp-35374 closed form -dFP/dG = 2(aLo/a)(1-a)/(1-aLo), whose lift off 2 is the imp-35392 ' +
    'offset da = a(N(1-delta)) - a(N): both da/a and the 1/(1-aLo) amplification shrink as N grows, so the ratio ' +
    'falls monotonically with N. EVIDENCE, NOT a machine certificate.',
  constants: {
    N_cross: +N_CROSS.toPrecision(15),
    band_bottom_N: +BAND_BOTTOM.toPrecision(15),
    band_top_N: +BAND_TOP.toPrecision(15),
    delta: DELTA,
    S_inf_floor: S_INF,
    K_amplitude: +K_AMPL.toPrecision(10),
    grid_points: GRID_POINTS,
  },
  measurement: {
    ratio_band_bottom: +RATIO_BAND_BOTTOM.toPrecision(12), // ~2.00041905222
    ratio_N_cross: +RATIO_N_CROSS.toPrecision(12), // ~2.00041796302
    ratio_band_top: +RATIO_BAND_TOP.toPrecision(12), // ~2.00041698686
    grid_ratio_min: +RATIO_MIN.toPrecision(12), // ~2.00041698686 (band-top end)
    grid_ratio_max: +RATIO_MAX.toPrecision(12), // ~2.00041905222 (band-bottom end)
    grid_ratio_spread: +RATIO_SPREAD.toPrecision(6), // ~2.0654e-6
    strictly_monotone_decreasing: STRICTLY_DECREASING, // true (no interior extremum on the 81-point grid)
    all_grid_values_round_to_2_00042: ALL_ROUND_TO_2_00042, // true (the drift hides under 5-digit storage)
    is_exactly_N_flat: false, // the ratio genuinely drifts; N-flat is a 5-digit-resolution artifact
  },
  subGap:
    'imp-34714a REMAINS OPEN. Resolving the ratio-drift shape on the surrogate says nothing about whether a ' +
    'directed-rounding [g](m)/[F-prime] evaluation yields valid enclosures: it rests on the gamma(n)/k eps ' +
    'surrogate models of the imp-34687a directed-rounding layer, not that layer, and F(m) = 0 remains a ' +
    'double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK HEADROOM RATIO N-FLATNESS, MEASURED (frontier, NOT an RH bound). The ticket asked whether the ' +
    'imp-35404 2.00042 cancellation ratio -dFP/dG is exactly N-invariant or drifts at extended precision. RESULT: ' +
    'it is NOT exactly N-flat. On a fine 81-point band grid at double precision the ratio drifts STRICTLY MONOTONE ' +
    'DECREASING from 2.00041905 (band-bottom) to 2.00041699 (band-top), spread 2.07e-6, with no interior extremum. ' +
    'All 81 grid values round to 2.00042 at five digits, so imp-35404 "N-flat" is correct only at storage ' +
    'resolution -- it conceals a real ~2e-6 monotone N-descent, exactly the imp-35374 closed form and the imp-35392 ' +
    'offset-da mechanism. EVIDENCE, NOT a machine certificate. SUB-GAP imp-34714a REMAINS OPEN: rests on the ' +
    'gamma(n)/k eps surrogate models, not the imp-34687a directed-rounding layer, and F(m) = 0 remains a ' +
    'double-precision artifact. Measurement only on the inherited imp-3220/imp-3406 surrogate; reproduces the ' +
    'imp-35266/imp-35374/imp-35392/imp-35241/imp-34996 machinery (identical K, delta, N_cross, band); the C_C ' +
    'ansatz (imp-2642/2714) and C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; ' +
    'far-tail exponent 1/2 per imp-3463 untouched; changes no bound; establishes no operator positivity; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35404 (baked 2.00042 N-flat landmark literals); imp-35392 (the +0.00042 lift is the offset da; monotone ' +
    'decreasing); imp-35374 (exact closed form -dFP/dG = 2(aLo/a)(1-a)/(1-aLo)); imp-35266 (2:1 cancellation); ' +
    'imp-35241 (band-top S ~ 2555.18); imp-34996 (S_inf = 1/(2 delta) floor); imp-34693 (admissible seed band); ' +
    'imp-33723 (Banach map g(N) = K log T0(N)); imp-2714 (C_C = (1/8)sqrt(3 pi) ansatz); lambda-rh-height-mapping ' +
    '(effectiveHeightForN RvM inverse). Fine-grid evaluation of an exact rational ratio: standard.',
};

export const IMP35437_KRAWCZYK_HEADROOM_RATIO_NFLAT_GRID_ASSERTIONS = [
  {
    // The ratio is NOT exactly N-flat: the fine grid resolves a non-trivial spread ~2e-6.
    id: 'imp35437-ratio-not-exactly-N-flat',
    description: 'the 81-point grid resolves a genuine ratio spread ~2.07e-6 (the ratio is not exactly N-invariant)',
    holds: () => RATIO_SPREAD > 1e-6 && RATIO_SPREAD < 5e-6 && IMP35437_KRAWCZYK_HEADROOM_RATIO_NFLAT_GRID.measurement.is_exactly_N_flat === false,
  },
  {
    // The drift is strictly monotone decreasing across the whole band (no interior extremum).
    id: 'imp35437-strictly-monotone-decreasing',
    description: 'the ratio decreases strictly and monotonically from band-bottom to band-top on the 81-point grid',
    holds: () => STRICTLY_DECREASING === true && RATIO_BAND_BOTTOM > RATIO_BAND_TOP,
  },
  {
    // The drift hides under 5-digit storage: every grid value rounds to 2.00042 (imp-35404 correct at resolution).
    id: 'imp35437-drift-hidden-under-5-digit-storage',
    description: 'every grid value rounds to 2.00042 at five digits, so imp-35404 N-flat is a storage-resolution artifact',
    holds: () => ALL_ROUND_TO_2_00042 === true && RATIO_SPREAD < 5e-5,
  },
  {
    // Landmark reproduction: band-bottom/band-top reproduce the imp-35392 devExact values (+4.19052e-4/+4.16987e-4).
    id: 'imp35437-landmarks-reproduce-imp35392',
    description: 'band-bottom/band-top ratios reproduce the imp-35392 exact departures 2.00041905/2.00041699',
    holds: () =>
      Math.abs(RATIO_BAND_BOTTOM - 2.00041905) < 1e-7 && Math.abs(RATIO_BAND_TOP - 2.00041699) < 1e-7,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp35437-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35437_KRAWCZYK_HEADROOM_RATIO_NFLAT_GRID.isRigorous === false &&
      /imp-34714a/.test(IMP35437_KRAWCZYK_HEADROOM_RATIO_NFLAT_GRID.subGap) &&
      /REMAINS OPEN/.test(IMP35437_KRAWCZYK_HEADROOM_RATIO_NFLAT_GRID.subGap) &&
      /NO QED/.test(IMP35437_KRAWCZYK_HEADROOM_RATIO_NFLAT_GRID.verdict) &&
      /refereed bound is changed/i.test(IMP35437_KRAWCZYK_HEADROOM_RATIO_NFLAT_GRID.verdict),
  },
];

for (const a of IMP35437_KRAWCZYK_HEADROOM_RATIO_NFLAT_GRID_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35437-krawczyk-headroom-ratio-nflat-grid assertion failed: ${a.id}`);
  }
}
