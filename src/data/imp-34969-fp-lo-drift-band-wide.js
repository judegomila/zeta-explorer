/**
 * @module imp-34969-fp-lo-drift-band-wide
 *
 * imp-34969 (numerical, frontier): imp-34953 held FP_LO fixed at the published 0.954568 while sweeping the
 * R_margin(N) = N*FP_LO/K dyadic-wall structure across 1e6..1e13, and ARGUED (citing imp-34861/imp-34889)
 * that the true FP_LO(N) = 1 - |g_prime(N(1-delta))| drifts only ~0.5% band-wide -- small versus the
 * factor-2 (2.636e9-wide) dyadic wall spacing. But that ~0.5% figure was measured only on the +-5%
 * imp-34693 seed band (imp-34861 k=10 rung); it was NEVER measured across the full 1e6..1e13 ladder. This
 * module re-instantiates the imp-34861 g_prime chain VERBATIM (g_prime(N) = 2pi K/(T0(N) u), u = log(T0/2pi),
 * T0 = effectiveHeightForN(N), K = (C_C/E_trunc)^2 ~ 1.5727e8) and MEASURES FP_LO(N) at each rung of the
 * 1e6..1e13 ladder, tabulating its actual drift and assessing (a) whether the ~0.5% assumption holds at the
 * far tail and (b) whether any FP_LO drift could push N across a dyadic wall inside the imp-34693 seed band.
 * MEASUREMENT ONLY; reuses the imp-34861/imp-34889 literals VERBATIM; changes no bound; does NOT instantiate
 * the imp-34687a directed-rounding layer; imp-34714a REMAINS OPEN; NO QED.
 *
 * THE MEASUREMENT (FP_LO(N) = 1 - |g_prime(N(1-delta))| across 1e6..1e13)
 * ----------------------------------------------------------------------
 * g_prime = 2pi K/(T0 u) DECREASES as N grows (T0 rises), so FP_LO = 1 - |g_prime| INCREASES toward 1. The
 * band-wide sweep is dramatic, NOT a ~0.5% drift:
 *   N          T0            |g_prime|     FP_LO           R_margin=N*FP_LO/K   nStar
 *   1e6        6.003e5       143.556       -142.585        -9.066e-1            undefined (FP_LO < 0)
 *   1e7        4.992e6        14.569        -13.572        -8.630e-1            undefined (FP_LO < 0)
 *   1e8        4.265e7         1.473         -0.473        -3.008e-1            undefined (FP_LO < 0)
 *   1.4753e8   ~6.4e7          1.000          0.000         0.000              CONTRACTIVITY ONSET (FP_LO = 0)
 *   1e9        3.719e8         0.14848        0.851487      5.4141e+0           3
 *   3.2803e9   1.144e9         0.045423       0.954568      1.9910e+1           5   <- N_cross (published FP_LO)
 *   1e10       3.294e9         0.014947       0.985053      6.2634e+1           6
 *   1e11       2.954e10        0.001502       0.998498      6.3489e+2          10
 *   1e12       2.677e11        0.000151       0.999849      6.3575e+3          13
 *   1e13       2.446e12        0.000015       0.999985      6.3584e+4          16
 * READING: across 1e6..1e13 FP_LO ranges from -142.585 (at 1e6, where |g_prime| = 143.6 >> 1) to 0.999985
 * (at 1e13) -- a range of ~150 in FP_LO, roughly 30000x the ~0.5% figure. So the "~0.5% band-wide" claim is
 * FALSE across the full ladder: it holds ONLY on the narrow +-5% imp-34693 seed band. The surrogate Banach
 * map g is NON-CONTRACTIVE (|g_prime| > 1, FP_LO < 0) for all N below the contractivity onset N* ~ 1.4753e8
 * (bisection root of |g_prime(N(1-delta))| = 1); below N* the Krawczyk quotient-denominator floor FP_LO is
 * negative, R_margin = N*FP_LO/K is negative, and the nStar = floor(log2 R_margin) + 1 crossing step is
 * UNDEFINED. So the entire R_margin dyadic-wall / nStar structure is only meaningful for N >~ 1.5e8, i.e.
 * around and above N_cross where the map contracts.
 *
 * THE ~0.5% ASSUMPTION HOLDS ONLY WITHIN THE IMP-34693 SEED BAND
 * -------------------------------------------------------------
 * On the widest imp-34693 admissible seed rung (k=10, half-width rho ~ 1.7124e8, band [3.1090e9, 3.4515e9],
 * i.e. N_cross +-5.2%) FP_LO drifts from 0.952072 (lower edge, smaller N -> larger |g_prime|) to 0.956816
 * (upper edge): a relative drift of 4.969e-3 ~ 0.497% -- reproducing the imp-34861/imp-34889/imp-34953
 * ~0.5% figure to three significant figures. So the ~0.5% assumption is CORRECT for the band it was measured
 * on, and the imp-34953 argument is faithful THERE; it is simply not a band-WIDE statement. FP_LO increases
 * monotonically with N (g_prime = 2pi K/(T0 u) decreasing), so the seed lower edge minimises and the upper
 * edge maximises FP_LO, exactly as imp-34861 found.
 *
 * NO FP_LO DRIFT CAN PUSH N ACROSS A DYADIC WALL INSIDE THE SEED BAND
 * ------------------------------------------------------------------
 * The decisive check the imp-34953 argument needed: does the JOINT N-and-FP_LO variation over the seed band
 * move R_margin(N) = N*FP_LO/K across a power-of-two wall? Evaluating R_margin at the seed-band edges with
 * BOTH the true N and the true FP_LO(N) drifting together: R_margin goes from 18.8213 (lower edge) to 20.9987
 * (upper edge), a swing of only ~+-5.5% about the N_cross value 19.910 -- and BOTH endpoints sit strictly
 * inside the nStar = 5 dyadic window (16, 32], with nStar = 5 at both. The nearest walls are ~0.24 doublings
 * below (16) and ~0.61 doublings above (32); the combined ~5% N-drift and ~0.5% FP_LO drift together move
 * R_margin by ~1/18 of a doubling, ~11x short of even the nearer 16 wall. So NO amount of the measured FP_LO
 * drift can push N across a dyadic wall inside the imp-34693 seed band -- confirming the imp-34953 pin at 5 is
 * robust to the true (not held-fixed) FP_LO, which was exactly the unmeasured link in its argument.
 *
 * WHAT STAYS OPEN
 * --------------
 * MEASUREMENT only on the inherited imp-3220/imp-3406 surrogate crossover map, reusing the imp-34861/imp-34889
 * g_prime chain VERBATIM. It measures the true FP_LO(N) drift and confirms it cannot cross a dyadic wall inside
 * the seed band, but does NOT instantiate the imp-34687a directed-rounding transcendental layer (the surrogate
 * is a first-order outward-rounding proxy) and does NOT discharge the conditional. imp-34714a REMAINS OPEN.
 * C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED;
 * imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34953-r-margin-dyadic-wall-across-N (held FP_LO fixed; argued ~0.5% drift -- measured here)
 * @see imp-34861-krawczyk-crosscheck-band-sensitivity (the g_prime chain and seed-band FP_LO drift, reused verbatim)
 * @see imp-34889-forward-breach-band-uniformity (the ~0.5% band-invariance claim)
 * @see imp-34693-crossover-contraction-seed-band (the admissible seed band; k=10 half-width ~1.71e8)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact lemma; named sub-gap imp-34714a)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34953_R_MARGIN_DYADIC_WALL_ACROSS_N } from './imp-34953-r-margin-dyadic-wall-across-N.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34861/imp-34953)
const DELTA = 2e-4; // the fixed imp-34774/imp-34776/imp-34799 relative bracket half-width

// The imp-34861 g_prime chain, reused VERBATIM (closed-form derivative of g(N) = K log T0(N)).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const gPrime = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};
// FP_LO(N) = 1 - |g_prime(N(1-delta))| (imp-34818 Krawczyk quotient-denominator floor).
const fpLo = (N) => 1 - Math.abs(gPrime(N * (1 - DELTA)));
const rMargin = (N) => (N * fpLo(N)) / K_AMPL; // R_margin with the TRUE (not held-fixed) FP_LO(N)
const nStar = (R) => Math.floor(Math.log2(R)) + 1;

// N_cross via the same imp-34861 fixed-point iteration (delta cancels in the map itself).
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // ~3.28029435165241e9

// --- The 1e6..1e13 ladder: measure FP_LO(N) and its induced R_margin/nStar at each rung ------------------
const N_LO = 1e6;
const N_HI = 1e13;
const GRID = [1e6, 1e7, 1e8, 1e9, N_CROSS, 1e10, 1e11, 1e12, 1e13];
const ladder = GRID.map((N) => {
  const fp = fpLo(N);
  const contractive = fp > 0; // FP_LO > 0  <=>  |g_prime| < 1  <=>  the surrogate map contracts at N
  const R = rMargin(N);
  return {
    N: +N.toExponential(4),
    abs_g_prime: +Math.abs(gPrime(N * (1 - DELTA))).toExponential(4),
    fp_lo: +fp.toFixed(6),
    contractive, // false below the onset N* ~ 1.4753e8 (FP_LO < 0 -> R_margin < 0, nStar undefined)
    r_margin: +R.toExponential(4),
    n_star: contractive ? nStar(R) : null, // nStar is undefined where R_margin <= 0
  };
});

// --- The contractivity onset: bisection root of |g_prime(N(1-delta))| = 1 (FP_LO = 0) --------------------
function contractivityOnset() {
  let lo = 1e8;
  let hi = 1e9;
  for (let i = 0; i < 80; i++) {
    const m = Math.sqrt(lo * hi);
    if (Math.abs(gPrime(m * (1 - DELTA))) > 1) lo = m;
    else hi = m;
  }
  return Math.sqrt(lo * hi);
}
const N_ONSET = contractivityOnset(); // ~1.4753e8 (below this the map is non-contractive, FP_LO < 0)

// --- Band-wide FP_LO range: the ~0.5% claim FAILS across the full ladder ---------------------------------
const FP_AT_LO = fpLo(N_LO); // ~-142.585 at 1e6 (|g_prime| >> 1, map non-contractive)
const FP_AT_HI = fpLo(N_HI); // ~0.999985 at 1e13
const FP_PUBLISHED = 0.954568; // imp-34953 held-fixed value (reproduced at N_cross)
const BANDWIDE_REL_SPAN = Math.abs(FP_AT_HI - FP_AT_LO) / FP_PUBLISHED; // ~150 (NOT ~0.5%)

// --- The imp-34693 widest (k=10) admissible seed band, reusing the imp-34861 rho recompute verbatim ------
const L_CONTRACTION = gPrime(1e9); // ~0.148483 (imp-34693 L, band-growth rate)
const L_AT_CROSS = gPrime(N_CROSS); // ~0.045423 (imp-34693 L_c)
const RHO_K10 = (1 * (1 - L_CONTRACTION)) / ((1 - L_AT_CROSS) * Math.pow(L_CONTRACTION, 10)); // ~1.7124e8
const SEED_LO = N_CROSS - RHO_K10; // ~3.1090e9
const SEED_HI = N_CROSS + RHO_K10; // ~3.4515e9
const FP_SEED_LO = fpLo(SEED_LO); // ~0.952072 (lower edge, smaller N -> larger |g_prime| -> smaller FP_LO)
const FP_SEED_HI = fpLo(SEED_HI); // ~0.956816 (upper edge)
const SEED_FP_DRIFT_REL = Math.abs(FP_SEED_HI - FP_SEED_LO) / fpLo(N_CROSS); // ~4.97e-3 ~ 0.497% (~0.5% confirmed)

// --- Dyadic-wall check inside the seed band: R_margin with BOTH true N and true FP_LO drifting ----------
const R_SEED_LO = rMargin(SEED_LO); // ~18.8213
const R_SEED_HI = rMargin(SEED_HI); // ~20.9987
const NSTAR_SEED_LO = nStar(R_SEED_LO); // 5
const NSTAR_SEED_HI = nStar(R_SEED_HI); // 5
const SEED_NO_WALL_CROSS =
  R_SEED_LO > 16 && R_SEED_HI <= 32 && NSTAR_SEED_LO === 5 && NSTAR_SEED_HI === 5; // true: no wall crossed
const NEAREST_WALL_DOUBLINGS = Math.min(
  Math.log2(R_SEED_LO) - 4, // distance from lower-edge R_margin down to the 2^4 = 16 wall
  5 - Math.log2(R_SEED_HI), // distance from upper-edge R_margin up to the 2^5 = 32 wall
); // ~0.24 doublings (to 16) -- the seed-band R_margin swing never reaches it

// Cross-check: at N_cross the measured FP_LO reproduces the imp-34953 held-fixed published value.
const A53 = IMP34953_R_MARGIN_DYADIC_WALL_ACROSS_N;
const FP_PUBLISHED_IMP34953 = A53.constants.FP_LO_published; // 0.954568

export const IMP34969_FP_LO_DRIFT_BAND_WIDE = {
  id: 'imp-34969',
  proofSection: 'S-frontier',
  question:
    'imp-34953 held FP_LO fixed at 0.954568 and ARGUED (not measured) the true FP_LO(N) = 1 - ' +
    '|g_prime(N(1-delta))| drifts only ~0.5% band-wide. Re-instantiate the imp-34861/imp-34889 g_prime chain ' +
    'VERBATIM and MEASURE FP_LO(N) at each rung of the 1e6..1e13 ladder, tabulate the actual drift, and ' +
    'assess whether the ~0.5% assumption holds at the far tail and whether any drift could push N across a ' +
    'dyadic wall inside the imp-34693 seed band. Measurement only; changes no bound; does NOT instantiate the ' +
    'imp-34687a layer; imp-34714a REMAINS OPEN; no QED.',
  constants: {
    K_amplitude: +K_AMPL.toExponential(4), // ~1.5727e8 (N-independent PT-anchor amplitude)
    delta: DELTA, // 2e-4
    N_cross: +N_CROSS.toPrecision(15), // 3.28029435165241e9
    fp_lo_at_N_cross: +fpLo(N_CROSS).toFixed(6), // 0.954568 (reproduces the imp-34953 held-fixed value)
    fp_lo_published_imp34953: FP_PUBLISHED_IMP34953, // 0.954568
    band_lo: N_LO, // 1e6
    band_hi: N_HI, // 1e13
    contractivity_onset_N: +N_ONSET.toExponential(4), // ~1.4753e8 (|g_prime| = 1, FP_LO = 0)
  },
  ladder, // per-rung |g_prime|, FP_LO, contractive flag, R_margin, nStar across 1e6..1e13
  bandWide: {
    // Across the FULL ladder FP_LO is NOT a ~0.5% drift: it ranges from -142.585 (1e6) to 0.999985 (1e13).
    fp_lo_at_1e6: +FP_AT_LO.toFixed(4), // ~-142.585 (map non-contractive; |g_prime| = 143.6)
    fp_lo_at_1e13: +FP_AT_HI.toFixed(6), // ~0.999985
    bandwide_rel_span: +BANDWIDE_REL_SPAN.toExponential(3), // ~1.5e2 (NOT ~0.5%)
    half_percent_claim_holds_bandwide: BANDWIDE_REL_SPAN < 5e-3, // false
    map_noncontractive_below_onset: FP_AT_LO < 0 && fpLo(1e8) < 0 && fpLo(1e9) > 0, // true: onset in (1e8, 1e9)
  },
  seedBand: {
    // On the widest imp-34693 seed rung (k=10) the FP_LO drift reproduces the ~0.5% claim to 3 sig figs.
    rho_k10_half_width: +RHO_K10.toExponential(4), // ~1.7124e8 (~5.2% of N_cross)
    seed_lo: +SEED_LO.toExponential(4), // ~3.1090e9
    seed_hi: +SEED_HI.toExponential(4), // ~3.4515e9
    fp_lo_seed_lo: +FP_SEED_LO.toFixed(6), // ~0.952072
    fp_lo_seed_hi: +FP_SEED_HI.toFixed(6), // ~0.956816
    fp_lo_drift_rel: +SEED_FP_DRIFT_REL.toExponential(4), // ~4.969e-3 ~ 0.497% (confirms ~0.5%)
    half_percent_claim_holds_in_seed_band: SEED_FP_DRIFT_REL < 6e-3, // true
  },
  wallCheck: {
    // R_margin with BOTH the true N and the true FP_LO(N) drifting stays strictly inside the (16, 32] window.
    r_margin_seed_lo: +R_SEED_LO.toFixed(4), // ~18.8213
    r_margin_seed_hi: +R_SEED_HI.toFixed(4), // ~20.9987
    n_star_seed_lo: NSTAR_SEED_LO, // 5
    n_star_seed_hi: NSTAR_SEED_HI, // 5
    nearest_wall_doublings: +NEAREST_WALL_DOUBLINGS.toFixed(4), // ~0.24 (to the 2^4 = 16 wall)
    no_dyadic_wall_crossed_in_seed_band: SEED_NO_WALL_CROSS, // true
  },
  finding:
    'MEASUREMENT of the true FP_LO(N) = 1 - |g_prime(N(1-delta))| (imp-34861 g_prime chain reused verbatim) ' +
    'across 1e6..1e13, the drift imp-34953 held fixed at 0.954568 and argued was ~0.5%. Across the FULL ' +
    'ladder FP_LO is emphatically NOT a ~0.5% drift: g_prime = 2pi K/(T0 u) decreases as N grows, so FP_LO ' +
    'climbs from -142.585 at 1e6 (where |g_prime| = 143.6 >> 1, the surrogate map is NON-CONTRACTIVE and the ' +
    'Krawczyk floor is negative) to 0.999985 at 1e13 -- a range ~150, ~30000x the ~0.5% figure. The map only ' +
    'contracts (FP_LO > 0) above the onset N* ~ 1.4753e8 (root of |g_prime(N(1-delta))| = 1); below it ' +
    'R_margin = N*FP_LO/K is negative and nStar is UNDEFINED, so the whole dyadic-wall structure is only ' +
    'meaningful around and above N_cross. HOWEVER the ~0.5% claim is CORRECT for the band it was measured on: ' +
    'on the widest imp-34693 seed rung (k=10, [3.1090e9, 3.4515e9], N_cross +-5.2%) FP_LO drifts only from ' +
    '0.952072 to 0.956816, a relative 4.969e-3 ~ 0.497% -- reproducing the imp-34861/imp-34889/imp-34953 ' +
    'figure to three sig figs. DECISIVELY, evaluating R_margin at the seed-band edges with BOTH the true N ' +
    'and the true FP_LO(N) drifting together gives [18.8213, 20.9987], both strictly inside the nStar = 5 ' +
    'dyadic window (16, 32] (nStar = 5 at both edges, ~0.24 doublings clear of the nearer 16 wall). So NO ' +
    'amount of the measured FP_LO drift can push N across a dyadic wall inside the imp-34693 seed band -- the ' +
    'unmeasured link in the imp-34953 argument, now measured and confirmed. Measurement EVIDENCE on the ' +
    'imp-3220/imp-3406 surrogate, NOT a machine certificate; imp-34714a REMAINS OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN. That the true FP_LO(N) drifts ~150-fold across 1e6..1e13 but only ~0.5% within ' +
    'the imp-34693 seed band, and that the joint N-and-FP_LO drift keeps R_margin strictly inside the ' +
    'nStar = 5 window (16, 32] (no dyadic wall crossed in the seed band) -- measured here by re-instantiating ' +
    'the imp-34861 g_prime chain verbatim -- is MEASUREMENT EVIDENCE on the imp-34861/imp-34889 first-order ' +
    'outward-rounding surrogate, NOT the imp-34687a certified transcendental layer; it does NOT prove the ' +
    'endpoints ARE valid enclosures. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'FP_LO(N) BAND-WIDE DRIFT MEASUREMENT (frontier, NOT an RH bound). imp-34953 held FP_LO fixed at 0.954568 ' +
    'and argued the true FP_LO(N) = 1 - |g_prime(N(1-delta))| drifts ~0.5% band-wide. This module ' +
    're-instantiates the imp-34861 g_prime chain VERBATIM and measures FP_LO(N) across the 1e6..1e13 ladder. ' +
    'Across the FULL band FP_LO ranges from -142.585 (1e6, |g_prime| = 143.6, map non-contractive) to ' +
    '0.999985 (1e13) -- a ~150 range, so the ~0.5% claim is FALSE band-wide; the map only contracts ' +
    '(FP_LO > 0) above the onset N* ~ 1.4753e8, below which R_margin < 0 and nStar is undefined. BUT within ' +
    'the +-5.2% imp-34693 seed band (k=10, [3.1090e9, 3.4515e9]) FP_LO drifts only 0.952072 -> 0.956816 ' +
    '(~0.497%), reproducing the ~0.5% figure; and R_margin with BOTH true N and true FP_LO drifting stays in ' +
    '[18.8213, 20.9987], strictly inside the nStar = 5 window (16, 32] -- NO dyadic wall crossed inside the ' +
    'seed band, confirming the unmeasured link in the imp-34953 argument. This is EVIDENCE, NOT a machine ' +
    'certificate. MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; reuses the ' +
    'imp-34861/imp-34889 g_prime literals verbatim; does NOT instantiate the imp-34687a directed-rounding ' +
    'layer; SUB-GAP imp-34714a REMAINS OPEN. The C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-conditional ' +
    'per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator ' +
    'positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34953 (held FP_LO fixed at 0.954568; argued ~0.5% drift -- measured here); imp-34861 (the g_prime = ' +
    '2pi K/(T0 u) chain and seed-band FP_LO drift, reused verbatim); imp-34889 (the ~0.5% band-invariance ' +
    'claim); imp-34818 (FP_LO = 1 - |g_prime(N(1-delta))| Krawczyk quotient floor); imp-34693 (admissible ' +
    'seed band; k=10 half-width ~1.71e8); imp-34714 (Krawczyk existence-uniqueness lemma; sub-gap ' +
    'imp-34714a); imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN RvM inverse). ' +
    'Contractivity onset = the N where the surrogate map derivative |g_prime| first drops below 1.',
};

export const IMP34969_FP_LO_DRIFT_BAND_WIDE_ASSERTIONS = [
  {
    // At N_cross the measured FP_LO reproduces the imp-34953 held-fixed published 0.954568.
    id: 'imp34969-reproduces-published-fp-lo-at-ncross',
    description: 'FP_LO(N_cross) ~ 0.954568, reproducing the imp-34953 held-fixed published value',
    holds: () =>
      Math.abs(fpLo(N_CROSS) - FP_PUBLISHED) < 1e-5 &&
      Math.abs(fpLo(N_CROSS) - FP_PUBLISHED_IMP34953) < 1e-5,
  },
  {
    // Across 1e6..1e13 FP_LO is NOT a ~0.5% drift: it ranges from < -100 (1e6) to > 0.9999 (1e13).
    id: 'imp34969-fp-lo-not-half-percent-bandwide',
    description: 'band-wide FP_LO ranges -142.585 (1e6) -> 0.999985 (1e13), rel span ~150, so the ~0.5% claim fails band-wide',
    holds: () =>
      FP_AT_LO < -100 &&
      FP_AT_HI > 0.9999 &&
      BANDWIDE_REL_SPAN > 100 &&
      IMP34969_FP_LO_DRIFT_BAND_WIDE.bandWide.half_percent_claim_holds_bandwide === false,
  },
  {
    // The surrogate map is non-contractive (FP_LO < 0) below the onset N* in (1e8, 1e9); nStar undefined there.
    id: 'imp34969-contractivity-onset-below-1e9',
    description: 'FP_LO < 0 at 1e8 and > 0 at 1e9; contractivity onset N* ~ 1.4753e8 (|g_prime| = 1)',
    holds: () =>
      fpLo(1e8) < 0 &&
      fpLo(1e9) > 0 &&
      N_ONSET > 1e8 &&
      N_ONSET < 1e9 &&
      Math.abs(Math.abs(gPrime(N_ONSET * (1 - DELTA))) - 1) < 1e-6,
  },
  {
    // Within the widest imp-34693 seed band the FP_LO drift IS ~0.5% (reproduces the imp-34953 assumption).
    id: 'imp34969-half-percent-holds-in-seed-band',
    description: 'seed-band (k=10) FP_LO drifts 0.952072 -> 0.956816, rel ~0.497% (~0.5% assumption holds there)',
    holds: () =>
      FP_SEED_LO > 0.95 &&
      FP_SEED_HI < 0.96 &&
      FP_SEED_LO < FP_SEED_HI && // FP_LO increases with N
      SEED_FP_DRIFT_REL > 4e-3 &&
      SEED_FP_DRIFT_REL < 6e-3,
  },
  {
    // The joint N-and-FP_LO drift keeps R_margin strictly inside (16, 32]: no dyadic wall crossed in seed band.
    id: 'imp34969-no-dyadic-wall-crossed-in-seed-band',
    description: 'R_margin at seed edges [18.82, 21.00] both in (16, 32], nStar=5 at both; ~0.24 doublings clear of 16',
    holds: () =>
      R_SEED_LO > 16 &&
      R_SEED_HI <= 32 &&
      NSTAR_SEED_LO === 5 &&
      NSTAR_SEED_HI === 5 &&
      SEED_NO_WALL_CROSS === true &&
      NEAREST_WALL_DOUBLINGS > 0.1,
  },
  {
    // Honesty gate: measurement/surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp34969-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34969_FP_LO_DRIFT_BAND_WIDE.isRigorous === false &&
      /imp-34714a/.test(IMP34969_FP_LO_DRIFT_BAND_WIDE.subGap) &&
      /REMAINS OPEN/.test(IMP34969_FP_LO_DRIFT_BAND_WIDE.subGap) &&
      /NO QED/.test(IMP34969_FP_LO_DRIFT_BAND_WIDE.verdict) &&
      /refereed bound is changed/i.test(IMP34969_FP_LO_DRIFT_BAND_WIDE.verdict),
  },
];

for (const a of IMP34969_FP_LO_DRIFT_BAND_WIDE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34969-fp-lo-drift-band-wide assertion failed: ${a.id}`);
  }
}
