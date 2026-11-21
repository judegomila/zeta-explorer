/**
 * @module imp-34953-r-margin-dyadic-wall-across-N
 *
 * imp-34953 (numerical, frontier): imp-34930 INDEPENDENTLY verified the imp-34909 unified breach-step law
 * nStar(R) = floor(log2 R) + 1 by recomputing R_margin = N*FP_LO/K ~ 19.910 from the published FP_LO, K, N,
 * delta constituents, finding R_margin sits strictly inside the dyadic window (16, 32] so nStar is pinned at 5
 * (op-depth 40), with roughly 0.315/0.685-doubling margins to the 2^4 = 16 and 2^5 = 32 walls. But that margin
 * was read at a SINGLE point, N = N_cross ~ 3.2803e9. This module reuses the imp-34930 constituent recompute
 * R_margin(N) = N*FP_LO/K VERBATIM (published K ~ 1.5727e8 and FP_LO ~ 0.954568 held fixed at their published
 * values; delta cancels, so it never enters) and MEASURES R_margin(N) and its distance to the nearest 2^n wall
 * across a broad N-band 1e6..1e13, to assess whether the crossing step nStar(R_margin) stays pinned at 5 band-wide
 * or crosses a dyadic wall as N varies. VERIFICATION / MEASUREMENT ONLY; reuses the imp-34884/34889/34909
 * literals via imp-34930 VERBATIM; does NOT instantiate the imp-34687a directed-rounding layer; imp-34714a
 * REMAINS OPEN; NO QED.
 *
 * THE MEASUREMENT (R_margin sweep across 1e6..1e13)
 * -------------------------------------------------
 * With K and FP_LO held fixed at the published constants (K is the PT-anchor amplitude (C_C/E_trunc)^2, an
 * N-INDEPENDENT constant; FP_LO drifts only ~0.5% band-wide per imp-34861/imp-34889), R_margin(N) = N*FP_LO/K
 * is LINEAR in N. Sweeping N over 1e6..1e13 (a log-decade grid plus the N_cross probe):
 *   N          R_margin      log2(R)   nStar   nearest-2^n-wall (doublings)
 *   1e6        6.070e-3      -7.364     -7        0.364
 *   1e7        6.070e-2      -4.042     -4        0.042
 *   1e8        6.070e-1      -0.720      0        0.280
 *   1e9        6.070e+0       2.602      3        0.398
 *   3.2803e9   1.991e+1       4.315      5        0.315   <- N_cross, the imp-34930 pinned point
 *   1e10       6.070e+1       5.924      6        0.076
 *   1e11       6.070e+2       9.245     10        0.245
 *   1e12       6.070e+3      12.567     13        0.433
 *   1e13       6.070e+4      15.889     16        0.111
 * Over the full 1e6..1e13 sweep R_margin ranges over ~7 orders of magnitude and log2(R_margin) climbs by
 * log2(1e13/1e6) ~ 23.25, so nStar climbs from -7 (at 1e6) to 16 (at 1e13) -- it crosses ~23 dyadic 2^n walls.
 * So the crossing step is DEFINITELY NOT pinned at 5 across the full 1e6..1e13 band; because R_margin is linear
 * in N (FP_LO essentially constant), nStar(R_margin) ~ floor(log2 N) - 22.7 grows one step per doubling of N.
 *
 * THE nStar = 5 PINNING WINDOW CONTAINS THE IMP-34693 ADMISSIBLE SEED BAND
 * -----------------------------------------------------------------------
 * nStar = 5 requires R_margin in (16, 32], i.e. N in (16 K/FP_LO, 32 K/FP_LO] = (2.6361e9, 5.2722e9] -- a
 * window of absolute width ~2.636e9 straddling N_cross ~ 3.2803e9. Crucially that pinning window is FAR wider
 * than the imp-34693 admissible seed band, whose widest rung (k=10) half-width is only ~1.7e8 around N_cross,
 * i.e. the band [3.11e9, 3.45e9] sits ENTIRELY inside (2.6361e9, 5.2722e9]. So the imp-34889 "band-invariant"
 * claim is CORRECT for the band it was measured on (the imp-34693 admissible seed band, where N moves only
 * +-5% around N_cross): nStar stays pinned at 5 THERE, with ~0.315/0.685-doubling headroom to the 16 and 32
 * walls that the +-5% N-drift (and the ~0.5% FP_LO drift) cannot consume. The pin BREAKS only once N moves by
 * whole factors of 2 away from N_cross -- which the far-tail 1e6..1e13 sweep does but the imp-34693 seed band
 * never does. So: pinned at 5 WITHIN the imp-34693 seed band; crosses ~23 dyadic walls across 1e6..1e13.
 *
 * THE FP_LO DRIFT IS NEGLIGIBLE FOR THE WALL STRUCTURE
 * ----------------------------------------------------
 * Holding FP_LO fixed at the published 0.954568 is faithful for this measurement: the true FP_LO(N) = 1 -
 * |g_prime(N(1-delta))| drifts only ~0.5% over the widest imp-34889 band, which moves each pinning-window edge
 * by ~0.5% -- roughly +-1.3e7 in N, two orders below the factor-2 (2.636e9-wide) wall spacing. So the FP_LO
 * drift cannot move N across a dyadic wall anywhere the band is narrow relative to a doubling; the wall-crossing
 * structure across 1e6..1e13 is governed entirely by the linear-in-N growth of R_margin.
 *
 * WHAT STAYS OPEN
 * --------------
 * VERIFICATION / MEASUREMENT only on the inherited imp-3220/imp-3406 surrogate crossover map, reusing the
 * imp-34884/imp-34889/imp-34909 literals via imp-34930 VERBATIM. It measures how the crossing step nStar(R_margin)
 * moves with N, but does NOT instantiate the imp-34687a directed-rounding transcendental layer (the surrogate is
 * a first-order outward-rounding proxy) and does NOT discharge the conditional. imp-34714a REMAINS OPEN. C_C =
 * (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066
 * K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34930-breach-step-law-verification (recomputes R_margin = N*FP_LO/K from constituents; reused verbatim)
 * @see imp-34909-op-depth-newton-step-reconciliation (states the unified nStar crossing law)
 * @see imp-34889-forward-breach-band-uniformity (band-invariance over the +-5% imp-34693 seed band)
 * @see imp-34693-crossover-contraction-seed-band (the admissible seed band; k=10 half-width ~1.7e8 around N_cross)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact lemma; named sub-gap imp-34714a)
 */

import { IMP34930_BREACH_STEP_LAW_VERIFICATION } from './imp-34930-breach-step-law-verification.js';

// --- The published constituents, reused VERBATIM from the imp-34930 constants block -----------------------
const PUB = IMP34930_BREACH_STEP_LAW_VERIFICATION.constants;
const K_PUB = PUB.K_published; // 1.5727e8 (N-INDEPENDENT PT-anchor amplitude (C_C/E_trunc)^2)
const FP_LO_PUB = PUB.FP_LO_published; // 0.954568 (Krawczyk quotient denominator floor, ~0.5% band drift)
const N_CROSS_PUB = PUB.N_cross_published; // 3.28029435165241e9 (RvM-inverse crossover fixed point)
const OPS_PER_STEP = PUB.ops_per_newton_step; // 8 (elementary ops per Newton step)

// --- The imp-34930 constituent recompute, reused VERBATIM as a function of N (delta cancels, never enters) --
const rMargin = (N) => (N * FP_LO_PUB) / K_PUB; // R_margin(N) = N*FP_LO/K
const nStar = (R) => Math.floor(Math.log2(R)) + 1; // unified breach-step law: smallest n with 2^n > R

// --- The broad N-band sweep (imp-34693 band, 1e6..1e13) plus the N_cross probe ----------------------------
const N_LO = 1e6;
const N_HI = 1e13;
const GRID = [1e6, 1e7, 1e8, 1e9, N_CROSS_PUB, 1e10, 1e11, 1e12, 1e13];
const sweep = GRID.map((N) => {
  const R = rMargin(N);
  const l = Math.log2(R);
  const wallLo = Math.floor(l); // 2^wallLo is the dyadic wall below R
  const wallHi = Math.ceil(l); // 2^wallHi is the dyadic wall above R
  const nearestWallDoublings = Math.min(l - wallLo, wallHi - l); // distance to nearest 2^n wall, in doublings
  return {
    N: +N.toExponential(4),
    r_margin: +R.toExponential(4),
    log2_r: +l.toFixed(3),
    n_star: nStar(R),
    op_depth: nStar(R) * OPS_PER_STEP,
    nearest_wall_doublings: +nearestWallDoublings.toFixed(4),
  };
});

// --- The nStar = 5 pinning window (R_margin in (16, 32]) in N-space, and the imp-34693 seed band it contains --
const N_PIN_LO = (16 * K_PUB) / FP_LO_PUB; // R_margin = 16 => N ~ 2.6361e9 (lower edge of nStar=5 window)
const N_PIN_HI = (32 * K_PUB) / FP_LO_PUB; // R_margin = 32 => N ~ 5.2722e9 (upper edge of nStar=5 window)
const SEED_BAND_HALF_WIDTH_K10 = 1.7e8; // imp-34693 widest (k=10) admissible-seed half-width around N_cross
const SEED_BAND_LO = N_CROSS_PUB - SEED_BAND_HALF_WIDTH_K10; // ~3.11e9
const SEED_BAND_HI = N_CROSS_PUB + SEED_BAND_HALF_WIDTH_K10; // ~3.45e9
const SEED_BAND_INSIDE_PIN = SEED_BAND_LO > N_PIN_LO && SEED_BAND_HI <= N_PIN_HI; // true: seed band subset window

// --- Band-wide behaviour: nStar climbs one step per doubling of N (R_margin linear in N) ------------------
const NSTAR_AT_LO = nStar(rMargin(N_LO)); // -7 at N = 1e6
const NSTAR_AT_HI = nStar(rMargin(N_HI)); // 16 at N = 1e13
const LOG2_SPAN = Math.log2(rMargin(N_HI) / rMargin(N_LO)); // ~23.25 (== log2(N_HI/N_LO), FP_LO/K cancel)
const WALLS_CROSSED = NSTAR_AT_HI - NSTAR_AT_LO; // 23 dyadic 2^n walls crossed across 1e6..1e13

// --- FP_LO drift bound: shifts each pinning-window edge by ~0.5%, far below the factor-2 wall spacing ------
const FP_LO_DRIFT_REL = 5e-3; // ~0.5% widest-band FP_LO drift (imp-34861/imp-34889)
const PIN_EDGE_SHIFT_ABS = N_PIN_LO * FP_LO_DRIFT_REL; // ~1.3e7 in N (edge moves this much under the drift)
const WALL_SPACING_ABS = N_PIN_HI - N_PIN_LO; // ~2.636e9 (N-width of one dyadic step at the pin)

export const IMP34953_R_MARGIN_DYADIC_WALL_ACROSS_N = {
  id: 'imp-34953',
  proofSection: 'S-frontier',
  question:
    'Reuse the imp-34930 constituent recompute R_margin(N) = N*FP_LO/K (published K, FP_LO held fixed; delta ' +
    'cancels) VERBATIM and MEASURE R_margin(N) and its distance to the nearest 2^n wall across the broad ' +
    'N-band 1e6..1e13, to assess whether the crossing step nStar(R_margin) = floor(log2 R_margin) + 1 stays ' +
    'pinned at 5 (op-depth 40) band-wide or crosses a dyadic wall as N varies. Verification / measurement ' +
    'only; reuses the imp-34884/34889/34909 literals via imp-34930; does NOT instantiate the imp-34687a ' +
    'layer; imp-34714a REMAINS OPEN; no QED.',
  constants: {
    K_published: K_PUB, // 1.5727e8 (N-independent PT-anchor amplitude)
    FP_LO_published: FP_LO_PUB, // 0.954568
    N_cross_published: +N_CROSS_PUB.toExponential(4), // 3.2803e9
    ops_per_newton_step: OPS_PER_STEP, // 8
    band_lo: N_LO, // 1e6
    band_hi: N_HI, // 1e13
  },
  sweep, // per-N R_margin, log2, nStar, op-depth, nearest-2^n-wall distance across 1e6..1e13
  pinWindow: {
    // nStar = 5 requires R_margin in (16, 32], i.e. N in (N_pin_lo, N_pin_hi] straddling N_cross.
    n_pin_lo: +N_PIN_LO.toExponential(4), // 2.6361e9 (R_margin = 16)
    n_pin_hi: +N_PIN_HI.toExponential(4), // 5.2722e9 (R_margin = 32)
    n_cross_inside: N_CROSS_PUB > N_PIN_LO && N_CROSS_PUB <= N_PIN_HI, // true
    window_width_abs: +WALL_SPACING_ABS.toExponential(4), // ~2.636e9
    imp34693_seed_band_lo: +SEED_BAND_LO.toExponential(4), // ~3.11e9 (k=10 half-width ~1.7e8 below N_cross)
    imp34693_seed_band_hi: +SEED_BAND_HI.toExponential(4), // ~3.45e9
    imp34693_seed_band_inside_pin_window: SEED_BAND_INSIDE_PIN, // true: seed band subset of the nStar=5 window
  },
  bandWide: {
    // Across the full 1e6..1e13 band nStar is NOT pinned: R_margin is linear in N, so nStar climbs ~1/doubling.
    nstar_at_1e6: NSTAR_AT_LO, // -7
    nstar_at_1e13: NSTAR_AT_HI, // 16
    log2_r_margin_span: +LOG2_SPAN.toFixed(3), // ~23.253 (== log2(N_HI/N_LO); FP_LO/K cancel in the ratio)
    dyadic_walls_crossed: WALLS_CROSSED, // 23
    nstar_pinned_at_5_bandwide: NSTAR_AT_LO === NSTAR_AT_HI, // false
  },
  fpLoDrift: {
    // FP_LO ~0.5% band drift shifts each pinning-window edge ~1.3e7 in N -- two orders below the wall spacing.
    fp_lo_drift_rel: FP_LO_DRIFT_REL, // 5e-3
    pin_edge_shift_abs: +PIN_EDGE_SHIFT_ABS.toExponential(3), // ~1.318e7
    wall_spacing_abs: +WALL_SPACING_ABS.toExponential(4), // ~2.636e9
    drift_below_wall_spacing: PIN_EDGE_SHIFT_ABS < WALL_SPACING_ABS, // true (by ~200x)
  },
  finding:
    'MEASUREMENT of R_margin(N) = N*FP_LO/K (imp-34930 recompute reused verbatim, published K/FP_LO fixed, ' +
    'delta cancels) across 1e6..1e13. Because K is the N-INDEPENDENT PT-anchor amplitude and FP_LO drifts only ' +
    '~0.5% band-wide, R_margin is LINEAR in N: over 1e6..1e13 it ranges ~7 orders of magnitude, log2(R_margin) ' +
    'climbs by ~23.25, and nStar = floor(log2 R_margin) + 1 climbs from -7 (at 1e6) to 16 (at 1e13), crossing ' +
    '~23 dyadic 2^n walls -- so the crossing step is DEFINITELY NOT pinned at 5 across the full 1e6..1e13 band; ' +
    'nStar(R_margin) ~ floor(log2 N) - 22.7 grows one step per doubling of N. HOWEVER, the nStar = 5 pinning ' +
    'window (R_margin in (16, 32], i.e. N in (2.6361e9, 5.2722e9]) is ~2.636e9 wide and straddles N_cross ~ ' +
    '3.2803e9, and it STRICTLY CONTAINS the imp-34693 admissible seed band (k=10 half-width ~1.7e8, i.e. ' +
    '[3.11e9, 3.45e9]). So the imp-34889 band-invariance claim is correct FOR ITS BAND: within the +-5% ' +
    'imp-34693 seed band nStar stays pinned at 5, with ~0.315/0.685-doubling headroom to the 16/32 walls that ' +
    'neither the +-5% N-drift nor the ~0.5% FP_LO drift (which moves each window edge only ~1.3e7 in N, ~200x ' +
    'below the factor-2 wall spacing) can consume. The pin breaks only once N moves by whole factors of 2 from ' +
    'N_cross -- which the far-tail sweep does but the seed band never does. Measurement EVIDENCE, NOT a machine ' +
    'certificate; imp-34714a REMAINS OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN. That the crossing step nStar(R_margin) stays pinned at 5 within the imp-34693 ' +
    'admissible seed band (which sits strictly inside the nStar=5 window (2.6361e9, 5.2722e9]) but crosses ~23 ' +
    'dyadic walls across the broad 1e6..1e13 band -- measured here by reusing the imp-34930 R_margin = ' +
    'N*FP_LO/K recompute verbatim -- is MEASUREMENT EVIDENCE on the imp-34884/imp-34889 first-order ' +
    'outward-rounding surrogate, NOT the imp-34687a certified transcendental layer; it does NOT prove the ' +
    'endpoints ARE valid enclosures. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'R_MARGIN DYADIC-WALL SWEEP ACROSS N (frontier, NOT an RH bound). imp-34930 read the R_margin ~ 19.910 ' +
    'dyadic-window margin only at N_cross. This module reuses its R_margin(N) = N*FP_LO/K recompute VERBATIM ' +
    '(published K/FP_LO fixed) and sweeps N over 1e6..1e13. R_margin is LINEAR in N (K N-independent, FP_LO ~ ' +
    'constant), so nStar climbs from -7 (1e6) to 16 (1e13), crossing ~23 dyadic walls -- NOT pinned at 5 ' +
    'band-wide. BUT the nStar=5 window (N in (2.6361e9, 5.2722e9]) strictly contains the imp-34693 admissible ' +
    'seed band [3.11e9, 3.45e9], so imp-34889 band-invariance holds THERE: pinned at 5 with ~0.315/0.685 ' +
    'doubling headroom the +-5% N-drift and ~0.5% FP_LO drift cannot consume. This is EVIDENCE, NOT a machine ' +
    'certificate. VERIFICATION / MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; ' +
    'reuses the imp-34884/imp-34889/imp-34909 literals via imp-34930 verbatim; does NOT instantiate the ' +
    'imp-34687a directed-rounding layer; SUB-GAP imp-34714a REMAINS OPEN. The C_C 1/8 ansatz (imp-2642/' +
    'imp-2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no ' +
    'bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34930 (recomputes R_margin = N*FP_LO/K from constituents; reused verbatim); imp-34909 (states the ' +
    'unified nStar(R) = floor(log2 R) + 1 crossing law); imp-34889 (band-invariance over the +-5% imp-34693 seed ' +
    'band); imp-34693 (admissible seed band; k=10 half-width ~1.7e8 around N_cross); imp-34901 (closed-form ' +
    'n_star = ceil(log2(N*FP_LO/K))); imp-34714 (Krawczyk existence-uniqueness lemma; sub-gap imp-34714a); ' +
    'imp-2642 (C_C 1/8 ansatz). Dyadic wall = power-of-two threshold: floor(log2 R) + 1 counts doublings.',
};

export const IMP34953_R_MARGIN_DYADIC_WALL_ACROSS_N_ASSERTIONS = [
  {
    // At N_cross the recompute reproduces the imp-34930 pin: R_margin ~ 19.91, nStar = 5, inside (16, 32].
    id: 'imp34953-recovers-imp34930-pin-at-ncross',
    description: 'R_margin(N_cross) ~ 19.91, nStar = 5, strictly inside the (16, 32] dyadic window (imp-34930 pin)',
    holds: () => {
      const R = rMargin(N_CROSS_PUB);
      return Math.abs(R - 19.9101) < 1e-3 && nStar(R) === 5 && R > 16 && R <= 32;
    },
  },
  {
    // R_margin is linear in N, so nStar is NOT pinned band-wide: it crosses ~23 dyadic walls over 1e6..1e13.
    id: 'imp34953-not-pinned-bandwide-crosses-walls',
    description: 'across 1e6..1e13 nStar climbs -7 -> 16 (23 dyadic walls); log2(R_margin) span ~23.25 == log2(N_HI/N_LO)',
    holds: () =>
      NSTAR_AT_LO === -7 &&
      NSTAR_AT_HI === 16 &&
      WALLS_CROSSED === 23 &&
      Math.abs(LOG2_SPAN - Math.log2(N_HI / N_LO)) < 1e-9 && // FP_LO/K cancel in the ratio -> linear in N
      IMP34953_R_MARGIN_DYADIC_WALL_ACROSS_N.bandWide.nstar_pinned_at_5_bandwide === false,
  },
  {
    // The nStar = 5 window (R_margin in (16, 32]) strictly contains N_cross AND the imp-34693 admissible seed band.
    id: 'imp34953-pin-window-contains-seed-band',
    description: 'nStar=5 window (2.6361e9, 5.2722e9] contains N_cross and the imp-34693 k=10 seed band [3.11e9, 3.45e9]',
    holds: () =>
      N_CROSS_PUB > N_PIN_LO &&
      N_CROSS_PUB <= N_PIN_HI &&
      SEED_BAND_INSIDE_PIN === true &&
      Math.abs(N_PIN_LO - 2.6361e9) < 1e6 &&
      Math.abs(N_PIN_HI - 5.2722e9) < 1e6,
  },
  {
    // The ~0.5% FP_LO drift moves each pinning-window edge far below the factor-2 wall spacing (cannot cross a wall).
    id: 'imp34953-fp-lo-drift-below-wall-spacing',
    description: 'FP_LO ~0.5% drift shifts a pin-window edge ~1.3e7 in N, ~200x below the ~2.636e9 wall spacing',
    holds: () =>
      PIN_EDGE_SHIFT_ABS < WALL_SPACING_ABS &&
      WALL_SPACING_ABS / PIN_EDGE_SHIFT_ABS > 100 &&
      PIN_EDGE_SHIFT_ABS > 0,
  },
  {
    // Honesty gate: verification/surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp34953-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34953_R_MARGIN_DYADIC_WALL_ACROSS_N.isRigorous === false &&
      /imp-34714a/.test(IMP34953_R_MARGIN_DYADIC_WALL_ACROSS_N.subGap) &&
      /REMAINS OPEN/.test(IMP34953_R_MARGIN_DYADIC_WALL_ACROSS_N.subGap) &&
      /NO QED/.test(IMP34953_R_MARGIN_DYADIC_WALL_ACROSS_N.verdict) &&
      /refereed bound is changed/i.test(IMP34953_R_MARGIN_DYADIC_WALL_ACROSS_N.verdict),
  },
];

for (const a of IMP34953_R_MARGIN_DYADIC_WALL_ACROSS_N_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34953-r-margin-dyadic-wall-across-N assertion failed: ${a.id}`);
  }
}
