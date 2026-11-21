/**
 * @module imp-34977-dyadic-wall-crossing-N-ladder
 *
 * imp-34977 (numerical, frontier): imp-34953 established that the crossing step nStar(R_margin) climbs ~23 dyadic
 * 2^n walls across the broad N-band 1e6..1e13 (because R_margin(N) = N*FP_LO/K is LINEAR in N), but it only
 * COUNTED the crossings -- it never tabulated WHERE each crossing lands in N-space. This module inverts the
 * imp-34930/imp-34953 recompute: nStar climbs from n to n+1 exactly when R_margin(N) crosses the dyadic wall
 * 2^n, i.e. at N_n solving N_n*FP_LO/K = 2^n, so N_n = 2^n * K / FP_LO. It tabulates the wall-crossing-N ladder
 * N_n for every integer n whose crossing lands inside 1e6..1e13, and then assesses whether ANY crossing lands
 * inside a physically meaningful landmark band -- the RvM-inverse crossover N_cross ~ 3.2803e9, the halving
 * landmark N_half ~ 3.2672e9, or the imp-34693 admissible seed band [3.11e9, 3.45e9]. MEASUREMENT ONLY; reuses
 * the imp-34930 published K/FP_LO VERBATIM; does NOT instantiate the imp-34687a directed-rounding layer;
 * imp-34714a REMAINS OPEN; NO QED.
 *
 * THE WALL-CROSSING-N LADDER (N_n = 2^n K / FP_LO)
 * ------------------------------------------------
 * With K/FP_LO ~ 1.6476e8 held fixed at the published constants, the crossing N_n is a pure geometric ladder in
 * n: each wall sits a factor of 2 in N above the previous. The crossings landing inside 1e6..1e13 span n = -7
 * (N_-7 ~ 1.288e6) up through n = 15 (N_15 ~ 5.401e12) -- 23 rungs, matching the imp-34953 wall count. The two
 * rungs bracketing the physical landmarks are:
 *   n = 4 : N_4 = 16 K / FP_LO ~ 2.6362e9   (nStar climbs 4 -> 5; lower edge of the nStar=5 pinning window)
 *   n = 5 : N_5 = 32 K / FP_LO ~ 5.2724e9   (nStar climbs 5 -> 6; upper edge of the nStar=5 pinning window)
 *
 * NO WALL CROSSING LANDS INSIDE A LANDMARK BAND
 * ---------------------------------------------
 * N_cross ~ 3.2803e9, N_half ~ 3.2672e9 and the ENTIRE imp-34693 seed band [3.11e9, 3.45e9] all sit strictly
 * BETWEEN the n=4 crossing (2.6362e9) and the n=5 crossing (5.2724e9) -- i.e. inside the open nStar=5 pinning
 * window (2.6362e9, 5.2724e9], never ON a crossing. The nearest crossing is the n=4 wall at 2.6362e9, which is
 * ~0.474e9 in N below the seed-band lower edge (3.11e9) and log2(3.2803e9 / 2.6362e9) ~ 0.315 doublings below
 * N_cross; the next crossing (n=5, 5.2724e9) is log2(5.2724e9 / 3.2803e9) ~ 0.685 doublings above N_cross. These
 * are exactly the ~0.315 / 0.685-doubling headrooms imp-34930 read at N_cross. So the ~23 dyadic wall crossings
 * of imp-34953 all fall OUTSIDE every physically meaningful landmark band: the crossings nearest the physics
 * bracket it symmetric-in-log2 but never intrude, which is why nStar stays cleanly pinned at 5 across the
 * landmarks. Measurement EVIDENCE, NOT a machine certificate.
 *
 * WHAT STAYS OPEN
 * --------------
 * MEASUREMENT only on the inherited imp-3220/imp-3406 surrogate crossover map, reusing the imp-34930 published
 * K/FP_LO VERBATIM (delta cancels, never enters). It tabulates the crossing-N ladder and locates it relative to
 * the physical landmarks, but does NOT instantiate the imp-34687a directed-rounding transcendental layer and
 * does NOT discharge the conditional. imp-34714a REMAINS OPEN. C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643)
 * UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound;
 * establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34953-r-margin-dyadic-wall-across-N (counts the ~23 crossings; this module tabulates their locations)
 * @see imp-34930-breach-step-law-verification (recomputes R_margin = N*FP_LO/K; K/FP_LO reused verbatim)
 * @see imp-34909-op-depth-newton-step-reconciliation (states the unified nStar crossing law)
 * @see imp-34693-crossover-contraction-seed-band (the admissible seed band [3.11e9, 3.45e9] around N_cross)
 * @see imp-34733-crossover-closedform-vs-picard-crosstab (the halving landmark N_half ~ 3.267235e9)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact lemma; named sub-gap imp-34714a)
 */

import { IMP34953_R_MARGIN_DYADIC_WALL_ACROSS_N } from './imp-34953-r-margin-dyadic-wall-across-N.js';

// --- The published constituents, reused VERBATIM from the imp-34953 constants block (themselves from imp-34930) --
const K_PUB = IMP34953_R_MARGIN_DYADIC_WALL_ACROSS_N.constants.K_published; // 1.5727e8 (N-INDEPENDENT PT-anchor amplitude)
const FP_LO_PUB = IMP34953_R_MARGIN_DYADIC_WALL_ACROSS_N.constants.FP_LO_published; // 0.954568
const N_CROSS_PUB = 3.28029435165241e9; // RvM-inverse crossover fixed point (imp-34930 published, full precision)
const N_HALF_PUB = 3.267235e9; // halving landmark N_half (imp-34733/imp-3444)
const N_LO = IMP34953_R_MARGIN_DYADIC_WALL_ACROSS_N.constants.band_lo; // 1e6
const N_HI = IMP34953_R_MARGIN_DYADIC_WALL_ACROSS_N.constants.band_hi; // 1e13

// --- imp-34693 admissible seed band (k=10 widest half-width ~1.7e8 around N_cross) ------------------------
const SEED_BAND_LO = 3.11e9;
const SEED_BAND_HI = 3.45e9;

// --- The wall-crossing-N ladder: nStar climbs n -> n+1 at N_n solving N_n*FP_LO/K = 2^n, so N_n = 2^n K/FP_LO --
const K_OVER_FP_LO = K_PUB / FP_LO_PUB; // ~1.6476e8 (the geometric-ladder step base; delta never enters)
const nCrossing = (n) => Math.pow(2, n) * K_OVER_FP_LO; // N at which the nStar staircase steps from n to n+1

// --- Integer n whose crossing lands inside 1e6..1e13: 2^n K/FP_LO in [N_LO, N_HI] -------------------------
const N_MIN = Math.ceil(Math.log2(N_LO / K_OVER_FP_LO)); // smallest n with N_n >= 1e6  (-> -7)
const N_MAX = Math.floor(Math.log2(N_HI / K_OVER_FP_LO)); // largest n with N_n <= 1e13 (-> 15)
const ladder = [];
for (let n = N_MIN; n <= N_MAX; n++) {
  const Nn = nCrossing(n);
  const insideSeedBand = Nn >= SEED_BAND_LO && Nn <= SEED_BAND_HI;
  const distToCrossDoublings = Math.log2(N_CROSS_PUB / Nn); // signed distance to N_cross in doublings
  ladder.push({
    n, // the wall index: R_margin crosses 2^n here
    n_cross_at: +Nn.toExponential(4), // N_n = 2^n K/FP_LO
    n_star_below: n, // nStar just below the crossing
    n_star_above: n + 1, // nStar just above the crossing
    inside_imp34693_seed_band: insideSeedBand, // does this crossing land inside [3.11e9, 3.45e9]?
    doublings_from_n_cross: +distToCrossDoublings.toFixed(4), // + => crossing below N_cross, - => above
  });
}

// --- The two crossings bracketing the physical landmarks (n=4 lower edge, n=5 upper edge of nStar=5 window) --
const N4 = nCrossing(4); // ~2.6362e9  (nStar 4 -> 5)
const N5 = nCrossing(5); // ~5.2724e9  (nStar 5 -> 6)

// --- Landmark-proximity assessment: does ANY crossing land inside a landmark band? -----------------------
const anyCrossingInSeedBand = ladder.some((r) => r.inside_imp34693_seed_band); // false
const anyCrossingHitsNcross = ladder.some((r) => Math.abs(r.doublings_from_n_cross) < 1e-3); // false
const nCrossInsideBracket = N_CROSS_PUB > N4 && N_CROSS_PUB <= N5; // true (N_cross strictly between the walls)
const nHalfInsideBracket = N_HALF_PUB > N4 && N_HALF_PUB <= N5; // true (N_half strictly between the walls)
const seedBandInsideBracket = SEED_BAND_LO > N4 && SEED_BAND_HI <= N5; // true (whole band between the walls)

// --- Log2 headrooms from the bracketing crossings to N_cross (== imp-34930 0.315 / 0.685 doubling margins) --
const HEADROOM_BELOW_DOUBLINGS = Math.log2(N_CROSS_PUB / N4); // ~0.315 (N_cross above the n=4 wall)
const HEADROOM_ABOVE_DOUBLINGS = Math.log2(N5 / N_CROSS_PUB); // ~0.685 (n=5 wall above N_cross)

export const IMP34977_DYADIC_WALL_CROSSING_N_LADDER = {
  id: 'imp-34977',
  proofSection: 'S-frontier',
  question:
    'Tabulate the dyadic wall-crossing-N ladder N_n = 2^n K/FP_LO (the N at which the crossing step nStar climbs ' +
    'from n to n+1) across the imp-34953 1e6..1e13 sweep, and assess whether any of the ~23 wall crossings ' +
    'lands inside a physically meaningful landmark band (N_cross ~ 3.2803e9, N_half ~ 3.2672e9, or the ' +
    'imp-34693 admissible seed band [3.11e9, 3.45e9]). Measurement only; reuses the imp-34930 published ' +
    'K/FP_LO verbatim; does NOT instantiate the imp-34687a layer; imp-34714a REMAINS OPEN; no QED.',
  constants: {
    K_published: K_PUB, // 1.5727e8
    FP_LO_published: FP_LO_PUB, // 0.954568
    k_over_fp_lo: +K_OVER_FP_LO.toExponential(4), // ~1.6476e8 (geometric-ladder step base)
    N_cross_published: +N_CROSS_PUB.toExponential(4), // 3.2803e9
    N_half_published: +N_HALF_PUB.toExponential(4), // 3.2672e9
    seed_band_lo: SEED_BAND_LO, // 3.11e9
    seed_band_hi: SEED_BAND_HI, // 3.45e9
    band_lo: N_LO, // 1e6
    band_hi: N_HI, // 1e13
    n_min: N_MIN, // -7 (smallest crossing index inside the band)
    n_max: N_MAX, // 15 (largest crossing index inside the band)
    rung_count: ladder.length, // 23 crossings inside 1e6..1e13
  },
  ladder, // per-n crossing-N N_n = 2^n K/FP_LO, the nStar step, seed-band membership, doublings-from-N_cross
  landmarkProximity: {
    // NO crossing lands inside a landmark band; the physics sits strictly between the n=4 and n=5 walls.
    n4_crossing: +N4.toExponential(4), // 2.6362e9 (nStar 4 -> 5)
    n5_crossing: +N5.toExponential(4), // 5.2724e9 (nStar 5 -> 6)
    any_crossing_inside_seed_band: anyCrossingInSeedBand, // false
    any_crossing_hits_n_cross: anyCrossingHitsNcross, // false
    n_cross_strictly_between_walls: nCrossInsideBracket, // true
    n_half_strictly_between_walls: nHalfInsideBracket, // true
    seed_band_strictly_between_walls: seedBandInsideBracket, // true
    headroom_below_doublings: +HEADROOM_BELOW_DOUBLINGS.toFixed(4), // ~0.315 (== imp-34930 lower margin)
    headroom_above_doublings: +HEADROOM_ABOVE_DOUBLINGS.toFixed(4), // ~0.685 (== imp-34930 upper margin)
  },
  finding:
    'TABULATION of the dyadic wall-crossing-N ladder N_n = 2^n K/FP_LO (nStar climbs n -> n+1 at the N where ' +
    'R_margin crosses 2^n), reusing the imp-34930 published K/FP_LO ~ 1.6476e8 verbatim. The 23 crossings ' +
    'landing inside 1e6..1e13 span n = -7 (N_-7 ~ 1.288e6) to n = 15 (N_15 ~ 5.401e12), matching the imp-34953 ' +
    'wall count. Assessing landmark proximity: N_cross ~ 3.2803e9, N_half ~ 3.2672e9 and the WHOLE imp-34693 ' +
    'seed band [3.11e9, 3.45e9] sit strictly BETWEEN the n=4 crossing (2.6362e9) and the n=5 crossing ' +
    '(5.2724e9) -- inside the open nStar=5 pinning window, never ON a crossing. So NO wall crossing lands ' +
    'inside any physically meaningful landmark band. The nearest crossing (n=4, 2.6362e9) is log2(N_cross/N_4) ' +
    '~ 0.315 doublings below N_cross and the next (n=5, 5.2724e9) is ~0.685 doublings above -- exactly the ' +
    'imp-34930 headrooms -- so the crossings nearest the physics bracket it symmetric-in-log2 but never ' +
    'intrude, which is why nStar stays cleanly pinned at 5 across the landmarks. Measurement EVIDENCE, NOT a ' +
    'machine certificate; imp-34714a REMAINS OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN. That none of the ~23 dyadic wall crossings N_n = 2^n K/FP_LO lands inside a ' +
    'physical landmark band (N_cross, N_half, or the imp-34693 seed band all fall strictly between the n=4 and ' +
    'n=5 walls) -- tabulated here by inverting the imp-34930 R_margin = N*FP_LO/K recompute verbatim -- is ' +
    'MEASUREMENT EVIDENCE on the imp-34884/imp-34889 first-order outward-rounding surrogate, NOT the imp-34687a ' +
    'certified transcendental layer; it does NOT prove the endpoints ARE valid enclosures. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'DYADIC WALL-CROSSING-N LADDER (frontier, NOT an RH bound). imp-34953 counted ~23 dyadic wall crossings over ' +
    '1e6..1e13 but never tabulated WHERE they land. This module inverts the imp-34930 recompute: nStar climbs ' +
    'n -> n+1 at N_n = 2^n K/FP_LO. It tabulates the 23-rung ladder (n = -7 to 15) and finds NO crossing lands ' +
    'inside any landmark band: N_cross ~ 3.2803e9, N_half ~ 3.2672e9 and the entire imp-34693 seed band ' +
    '[3.11e9, 3.45e9] sit strictly between the n=4 wall (2.6362e9) and the n=5 wall (5.2724e9), with the ' +
    'imp-34930 ~0.315 / 0.685 doubling headrooms. This is EVIDENCE, NOT a machine certificate. MEASUREMENT ONLY ' +
    'on the inherited imp-3220/imp-3406 surrogate crossover map; reuses the imp-34930 published K/FP_LO ' +
    'verbatim; does NOT instantiate the imp-34687a directed-rounding layer; SUB-GAP imp-34714a REMAINS OPEN. ' +
    'The C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 ' +
    'K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34953 (counts the ~23 crossings; this module tabulates their N-locations); imp-34930 (recomputes ' +
    'R_margin = N*FP_LO/K; K/FP_LO reused verbatim); imp-34909 (states the unified nStar crossing law); imp-34693 ' +
    '(admissible seed band [3.11e9, 3.45e9] around N_cross); imp-34733/imp-3444 (halving landmark N_half ~ ' +
    '3.267235e9); imp-34714 (Krawczyk existence-uniqueness lemma; sub-gap imp-34714a); imp-2642 (C_C 1/8 ' +
    'ansatz). Dyadic wall = power-of-two threshold; N_n = 2^n K/FP_LO is a geometric ladder, one factor-2 rung ' +
    'per nStar step.',
};

export const IMP34977_DYADIC_WALL_CROSSING_N_LADDER_ASSERTIONS = [
  {
    // The crossing ladder spans exactly the imp-34953 wall count: 23 rungs, n = -7 to 15.
    id: 'imp34977-ladder-spans-23-rungs',
    description: 'wall-crossing ladder inside 1e6..1e13 has 23 rungs, n = -7 to 15 (matches imp-34953 wall count)',
    holds: () => N_MIN === -7 && N_MAX === 15 && ladder.length === 23,
  },
  {
    // The n=4 and n=5 crossings reproduce the imp-34953 nStar=5 pinning-window edges (16 and 32 K/FP_LO).
    id: 'imp34977-n4-n5-reproduce-pin-window-edges',
    description: 'n=4 crossing ~2.6362e9 and n=5 crossing ~5.2724e9 (the nStar=5 window edges 16/32 K/FP_LO)',
    holds: () =>
      Math.abs(N4 - 2.6362e9) < 1e6 &&
      Math.abs(N5 - 5.2724e9) < 1e6 &&
      Math.abs(N4 * 2 - N5) < 1e-3, // pure factor-2 geometric ladder
  },
  {
    // NO wall crossing lands inside a landmark band: N_cross, N_half and the whole seed band sit between n=4 and n=5.
    id: 'imp34977-no-crossing-inside-landmark-band',
    description: 'no crossing lands inside a landmark band; N_cross, N_half and the seed band are all strictly between n=4 and n=5',
    holds: () =>
      anyCrossingInSeedBand === false &&
      anyCrossingHitsNcross === false &&
      nCrossInsideBracket === true &&
      nHalfInsideBracket === true &&
      seedBandInsideBracket === true,
  },
  {
    // The bracketing crossings reproduce the imp-34930 0.315 / 0.685 doubling headrooms around N_cross.
    id: 'imp34977-headrooms-match-imp34930',
    description: 'headroom below (n=4) ~0.315 doublings and above (n=5) ~0.685 doublings to N_cross (imp-34930)',
    holds: () =>
      Math.abs(HEADROOM_BELOW_DOUBLINGS - 0.315) < 1e-2 &&
      Math.abs(HEADROOM_ABOVE_DOUBLINGS - 0.685) < 1e-2 &&
      Math.abs(HEADROOM_BELOW_DOUBLINGS + HEADROOM_ABOVE_DOUBLINGS - 1) < 1e-9, // adjacent walls => sum to one doubling
  },
  {
    // Honesty gate: measurement/surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp34977-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34977_DYADIC_WALL_CROSSING_N_LADDER.isRigorous === false &&
      /imp-34714a/.test(IMP34977_DYADIC_WALL_CROSSING_N_LADDER.subGap) &&
      /REMAINS OPEN/.test(IMP34977_DYADIC_WALL_CROSSING_N_LADDER.subGap) &&
      /NO QED/.test(IMP34977_DYADIC_WALL_CROSSING_N_LADDER.verdict) &&
      /refereed bound is changed/i.test(IMP34977_DYADIC_WALL_CROSSING_N_LADDER.verdict),
  },
];

for (const a of IMP34977_DYADIC_WALL_CROSSING_N_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34977-dyadic-wall-crossing-N-ladder assertion failed: ${a.id}`);
  }
}
