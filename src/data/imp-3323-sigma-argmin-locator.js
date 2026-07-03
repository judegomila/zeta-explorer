/**
 * @module imp-3323-sigma-argmin-locator
 *
 * imp-3323 (numerical, frontier-direction): imp-3220 tabulates the GUE-conditional
 * share sigma(N) = E_coll(N) / E(N) across the assembly range on a 7-point DECADE
 * ladder {2, 10, 100, 1000, 1e4, 1e5, 1e6} and reports it is U-SHAPED: ~0.912 at
 * N = 2, dipping to a minimum ~0.841 "near N approx 100", then rising to ~0.949 at
 * the N* = 10^6 ceiling. Because the decade ladder only SAMPLES the basin at N = 100,
 * the argmin location was never LOCATED -- "near N approx 100" could sit anywhere in
 * the interior. This module reuses the EXACT imp-3220 sub-term formulas
 * (effectiveHeightForN, C_C_PINNED, the imp-398 C_F prefactor) and pins the argmin
 * by a high-iteration ternary search, then assesses whether the minimum coincides
 * with the imp-963 measured-C_mb window LOWER EDGE N = 100 or is a distinct
 * E_coll/E_flow crossover.
 *
 * THE QUANTITY (identical to imp-3220)
 * ------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll)
 *              = 1 / (1 + (E_trunc + E_flow) / E_coll),
 * with the same repo sub-terms:
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 * sigma is MINIMIZED exactly where (E_trunc + E_flow)/E_coll is MAXIMIZED. Both
 * E_coll ~ sqrt(log T0 / N) and E_flow ~ (log T0)^2 / T0 fall with N, but E_flow
 * falls far faster (T0 grows super-polynomially), so their ratio has an interior
 * turning point -- the E_coll/E_flow crossover-type balance that fixes the argmin.
 *
 * THE FINDING (assessment only)
 * -----------------------------
 *   (F1) LOCATION. The continuous argmin is N* = 97.7969 (integer argmin N = 98),
 *        with sigma_min = 0.8409680 -- confirming the imp-3220 "~0.841 near N~100"
 *        read to 4 sig figs, and pinning the location ~2.2 units BELOW the
 *        imp-963 window lower edge N = 100.
 *   (F2) NOT a meaningful coincidence with N = 100. The argmin is set purely by the
 *        ANALYTIC E(N) sub-term forms; the imp-963 measured-C_mb window [100, 1e4]
 *        is an empirical MEASUREMENT range and is never an input to any sub-term.
 *        The near-coincidence is numerical proximity inside an extremely flat basin,
 *        NOT structure: sigma(100) - sigma_min = 2.4e-6, and sigma stays within
 *        1e-3 of the minimum over the broad band N in [61.8, 156.3]. That flatness
 *        is exactly what makes "near 100" LOOK coincident.
 *   (F3) It IS a distinct E_coll/E_flow crossover balance. At N* the ratio
 *        E_coll/E_flow ~ 5.30 (down from the small-N regime, up toward the ceiling),
 *        while E_trunc is negligible there (E_flow/E_trunc ~ 559). Dropping E_trunc
 *        entirely moves the argmin only 97.80 -> 96.74, so the constant floor barely
 *        shifts it: the location is governed by the E_coll-vs-E_flow balance, not by
 *        the truncation floor and not by any empirical window edge.
 *
 * The punchline: the U-shape minimum is a genuine analytic feature of the bridge
 * budget (an E_coll/E_flow balance point at N* ~ 97.8), and its apparent landing
 * "at N = 100" is a flat-basin coincidence with the imp-963 window edge, not a
 * shared structural cause.
 *
 * ASSESSMENT ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-3220-en-bridge-fidelity-frontier (the U-shaped sigma(N) decade ladder)
 * @see imp-963 (measured C_mb on the window [100, 1e4])
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220 exactly
const IMP963_WINDOW_LOWER_EDGE = 100; // imp-963 measured-C_mb window [100, 1e4]

// EXACT imp-3220 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// High-iteration ternary search over the unimodal basin (bracket well inside {2..10^6}).
function argminSigma(lo, hi, includeTrunc) {
  const f = includeTrunc
    ? sigma
    : (N) => {
        const q = parts(N);
        return q.E_coll / (q.E_flow + q.E_coll);
      };
  for (let i = 0; i < 300; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (f(m1) < f(m2)) hi = m2;
    else lo = m1;
  }
  return (lo + hi) / 2;
}

const N_STAR = argminSigma(10, 3000, true); // ~97.7969
const SIGMA_MIN = sigma(N_STAR);
const P_STAR = parts(N_STAR);

// Integer argmin (the physically-meaningful N is an integer count of zeros).
let N_STAR_INT = 98;
{
  let best = { s: Infinity, N: 0 };
  for (let N = 10; N <= 2000; N++) {
    const s = sigma(N);
    if (s < best.s) best = { s, N };
  }
  N_STAR_INT = best.N;
}

// Flatness of the basin: half-band where sigma stays within 1e-3 of the minimum.
function bandEdge(dir) {
  let N = N_STAR;
  while (Math.abs(sigma(N) - SIGMA_MIN) < 1e-3) {
    N += dir * 0.25;
    if (N <= 2 || N >= 1e6) break;
  }
  return N;
}
const BAND_LO = bandEdge(-1);
const BAND_HI = bandEdge(1);

// The imp-963 window edge lands in the flat basin but sigma there is 2.4e-6 above min.
const SIGMA_AT_100 = sigma(IMP963_WINDOW_LOWER_EDGE);
const GAP_AT_100 = Math.abs(SIGMA_AT_100 - SIGMA_MIN);

// Is the location driven by the truncation floor? Compare argmin with E_trunc dropped.
const N_STAR_NO_TRUNC = argminSigma(10, 3000, false); // ~96.74 -> floor barely shifts it

export const IMP3323_SIGMA_ARGMIN_LOCATOR = {
  id: 'imp-3323',
  proofSection: 'S-frontier',
  question:
    'Locate the exact argmin N* of the imp-3220 U-shaped conditional share ' +
    'sigma(N) = E_coll(N)/E(N) (only bracketed "near N approx 100" on a decade ladder) ' +
    'and assess whether the minimum coincides with the imp-963 measured-C_mb window ' +
    'lower edge N = 100 or is a distinct E_coll/E_flow crossover. Assessment only, no QED.',
  argmin: {
    N_star_continuous: +N_STAR.toFixed(4), // 97.7969
    N_star_integer: N_STAR_INT, // 98
    sigma_min: +SIGMA_MIN.toFixed(7), // 0.8409680
    note:
      'Ternary search on the exact imp-3220 sigma(N) pins the continuous argmin at ' +
      'N* ~ 97.80 (integer 98), sigma_min ~ 0.84097 -- confirming the imp-3220 ' +
      '"~0.841 near N approx 100" read and placing the minimum ~2.2 units BELOW N = 100.',
  },
  coincidenceAssessment: {
    imp963WindowLowerEdge: IMP963_WINDOW_LOWER_EDGE,
    sigma_at_100: +SIGMA_AT_100.toFixed(7),
    gap_sigma_at_100_vs_min: +GAP_AT_100.toExponential(3), // ~2.4e-6
    flatBandWithin1e3: [+BAND_LO.toFixed(1), +BAND_HI.toFixed(1)], // ~[61.8, 156.3]
    verdict:
      'NOT a meaningful structural coincidence. The argmin is fixed entirely by the ' +
      'ANALYTIC E(N) sub-term forms; the imp-963 window [100,1e4] is an empirical ' +
      'measurement range and is never an input to any sub-term. sigma(100) exceeds ' +
      'sigma_min by only 2.4e-6, and sigma stays within 1e-3 of the minimum over the ' +
      'broad band N in ~[61.8, 156.3] -- that flatness is exactly what makes "near 100" ' +
      'LOOK coincident. The landing at N = 100 is flat-basin numerical proximity.',
  },
  crossoverMechanism: {
    E_coll_over_E_flow_at_Nstar: +(P_STAR.E_coll / P_STAR.E_flow).toFixed(3), // ~5.30
    E_flow_over_E_trunc_at_Nstar: +(P_STAR.E_flow / E_TRUNC_PT).toFixed(1), // ~559
    N_star_without_E_trunc: +N_STAR_NO_TRUNC.toFixed(2), // ~96.74
    note:
      'The minimum is a distinct E_coll/E_flow crossover-type balance: E_coll ~ ' +
      'sqrt(log T0/N) and E_flow ~ (log T0)^2/T0 both fall with N but E_flow far ' +
      'faster, so (E_trunc+E_flow)/E_coll peaks in the interior. At N* the balance is ' +
      'E_coll/E_flow ~ 5.30; the truncation floor is negligible (E_flow/E_trunc ~ 559) ' +
      'and dropping E_trunc shifts the argmin only 97.80 -> 96.74. The location is ' +
      'governed by the E_coll-vs-E_flow balance, not by the constant floor nor any ' +
      'empirical window edge.',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier-direction, NOT rigorous). The imp-3220 U-shaped conditional ' +
    'share sigma(N) attains its interior minimum at N* = 97.80 (integer 98), ' +
    'sigma_min ~ 0.84097 -- ~2.2 units below the imp-963 measured-C_mb window lower edge ' +
    'N = 100. This is a genuine E_coll/E_flow crossover balance (E_coll/E_flow ~ 5.30 ' +
    'at N*, the truncation floor negligible), fixed purely by the analytic E(N) ' +
    'sub-term forms; it does NOT coincide meaningfully with N = 100. sigma(100) sits ' +
    'only 2.4e-6 above the minimum inside a broad flat basin N in ~[61.8,156.3], so the ' +
    'apparent landing "at N = 100" is flat-basin numerical proximity, not a shared ' +
    'structural cause. No positivity, no bridge closure, no RH claim, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-3220 (U-shaped sigma(N) decade ladder, min "near N~100"); imp-963 (measured ' +
    'C_mb on [100,1e4]); imp-2642 (C_H = 1/8 ansatz); imp-398 (E_flow C_F prefactor); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP3323_SIGMA_ARGMIN_LOCATOR_ASSERTIONS = [
  {
    // Reuse gate: the sigma(N) here reproduces the imp-3220 decade-ladder minimum
    // value ~0.841 at N=100, proving the identical sub-term formulas are in use.
    id: 'imp3323-reproduces-imp3220-ladder-value',
    description: 'sigma(100) reproduces the imp-3220 decade-ladder "~0.841 near N~100" value',
    holds: () => Math.abs(SIGMA_AT_100 - 0.84097) < 5e-4,
  },
  {
    // The located argmin is interior, near the imp-3220 "~N approx 100" bracket, and
    // matches the reported minimum share ~0.841.
    id: 'imp3323-argmin-located-near-100',
    description: 'Continuous argmin N* is interior in [90,105] with sigma_min ~ 0.841',
    holds: () =>
      N_STAR > 90 && N_STAR < 105 && Math.abs(SIGMA_MIN - 0.8410) < 5e-4,
  },
  {
    // The integer argmin is 98, strictly BELOW the imp-963 window lower edge N=100.
    id: 'imp3323-integer-argmin-below-100',
    description: 'Integer argmin N=98 sits strictly below the imp-963 window edge N=100',
    holds: () => N_STAR_INT === 98 && N_STAR < IMP963_WINDOW_LOWER_EDGE,
  },
  {
    // Coincidence test: sigma(100) is within a few 1e-6 of the true minimum -- a flat
    // basin, so N=100 is numerically-coincident, not the structural argmin.
    id: 'imp3323-N100-is-flat-basin-coincidence',
    description: 'sigma(100) exceeds sigma_min by < 1e-5 (flat basin: N=100 is numerical proximity)',
    holds: () => GAP_AT_100 > 0 && GAP_AT_100 < 1e-5,
  },
  {
    // The basin is genuinely broad: sigma within 1e-3 of the minimum over a band that
    // straddles both 98 and 100 -- what makes "near 100" look coincident.
    id: 'imp3323-basin-is-broad-and-straddles-100',
    description: 'sigma stays within 1e-3 of the minimum over a broad band straddling both 98 and 100',
    holds: () => BAND_LO < 90 && BAND_HI > 120 && BAND_LO < 98 && BAND_HI > 100,
  },
  {
    // Mechanism: it is an E_coll/E_flow crossover, and the constant E_trunc floor
    // barely shifts the location (97.80 -> 96.74), so the argmin is a genuine balance.
    id: 'imp3323-is-ecoll-eflow-crossover-not-trunc-driven',
    description: 'Argmin is an E_coll/E_flow balance; dropping E_trunc shifts it < 2 units',
    holds: () =>
      Math.abs(N_STAR_NO_TRUNC - N_STAR) < 2 &&
      P_STAR.E_coll / P_STAR.E_flow > 4 &&
      P_STAR.E_coll / P_STAR.E_flow < 7,
  },
  {
    // Honesty gate: assessment only, no QED, PT stays SOTA, minimum NOT claimed to
    // meaningfully coincide with the imp-963 window edge.
    id: 'imp3323-honesty-gate-no-qed',
    description: 'Assessment only: distinct-crossover verdict, no QED, PT stays SOTA',
    holds: () =>
      IMP3323_SIGMA_ARGMIN_LOCATOR.isRigorous === false &&
      /NOT a meaningful/.test(IMP3323_SIGMA_ARGMIN_LOCATOR.coincidenceAssessment.verdict) &&
      /NO QED/.test(IMP3323_SIGMA_ARGMIN_LOCATOR.verdict) &&
      /remains SOTA/.test(IMP3323_SIGMA_ARGMIN_LOCATOR.verdict),
  },
];

for (const a of IMP3323_SIGMA_ARGMIN_LOCATOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3323-sigma-argmin-locator assertion failed: ${a.id}`);
  }
}
