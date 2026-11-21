/**
 * @module imp-33851-hump-envelope-symmetry-vs-k
 *
 * imp-33851 (numerical, frontier-direction): imp-33809 confirmed the M3 saturation-curvature
 * hump peaks GLOBALLY at the k = 9 crossover decade (hump(9) = 6.4758e-2) and reported the
 * one-sided step ratios hump(k)/hump(k-1) rising into the peak and hump(k)/hump(k+1) falling
 * away from it. But those step ratios compare ADJACENT decades on each side separately; they
 * never place the two sides at the SAME symmetric offset j from the peak and ask whether the
 * hump envelope is symmetric or skewed about the E_coll = E_trunc crossover. This module reuses
 * the imp-33809 per-k amplitudes verbatim and measures, at each symmetric offset j = 1,2,3,
 * the head-side fraction hump(9-j)/hump(9), the tail-side fraction hump(9+j)/hump(9), the
 * skew ratio hump(9-j)/hump(9+j), and the asymmetry index (head-tail)/(head+tail), so the
 * skew about the crossover is quantified directly rather than inferred from one-sided steps.
 *
 * THE INHERITED HUMP LADDER (imp-33809 per-k amplitudes, reused verbatim -- no fresh model)
 * ----------------------------------------------------------------------------------------
 *   hump(k) = p_ecoll*(1 - sigma_hi) - p_sigma, k = 6..13, from imp-33809:
 *     {2.3886e-2, 3.2910e-2, 5.4863e-2, 6.4758e-2, 4.5058e-2, 2.0884e-2, 7.8506e-3, 2.7085e-3}
 *   Peak at k = 9 (index 3): hump(9) = 6.4758e-2, the E_coll = E_trunc crossover decade.
 *   Head side = low-N, E_coll-dominated (k < 9); tail side = high-N, E_trunc-dominated (k > 9).
 *
 * THE MEASUREMENT (measurement only -- quantifies the imp-33809 hump-envelope skew)
 * --------------------------------------------------------------------------------
 *   For each symmetric offset j from the k = 9 peak, define:
 *     headFrac(j) = hump(9-j)/hump(9)      (fraction of peak retained on the head side),
 *     tailFrac(j) = hump(9+j)/hump(9)      (fraction of peak retained on the tail side),
 *     skew(j)     = hump(9-j)/hump(9+j)    (head-over-tail at equal offset; >1 = head-heavy),
 *     asym(j)     = (hump(9-j) - hump(9+j)) / (hump(9-j) + hump(9+j))  (signed asymmetry index).
 *
 *   (S1) THE ENVELOPE IS SKEWED HEAD-HEAVY, AND THE SKEW GROWS WITH OFFSET. skew(j) =
 *        {1.2176, 1.5758, 3.0426} for j = 1,2,3 -- monotonically INCREASING and all > 1, so at
 *        every symmetric offset the E_coll-dominated head side retains MORE hump amplitude than
 *        the E_trunc-dominated tail side, and the gap widens away from the peak.
 *   (S2) THE ASYMMETRY INDEX RISES 0.098 -> 0.505 (HEAD-HEAVY AT EVERY OFFSET). asym(j) =
 *        {0.0981, 0.2236, 0.5053} for j = 1,2,3 -- all POSITIVE and monotonically increasing, so
 *        by three decades out the head side carries ~3x the tail side ((1+0.5053)/(1-0.5053)).
 *        The envelope is NOT symmetric about the crossover; it is skewed toward the head (low-N)
 *        side, i.e. AWAY from the E_trunc-dominated (k > 9) tail, which decays the faster.
 *   (S3) OVER THE SYMMETRIC +-3 WINDOW THE HEAD CARRIES ~1.51x THE TAIL MASS. Summing the three
 *        head decades (k = 6,7,8) gives 1.11659e-1 and the three tail decades (k = 10,11,12) give
 *        7.37926e-2, a head/tail mass ratio 1.5131 and a windowed asymmetry index 0.2042 -- a
 *        single-number confirmation that the hump is head-heavy about the k = 9 crossover.
 *
 * The punchline: imp-33809 reported one-sided step ratios; placed at equal offsets from the
 * peak, the M3 curvature-hump envelope is DEFINITIVELY SKEWED, not symmetric -- head-heavy
 * (E_coll-dominated, low-N) at every offset, with skew ratio 1.22 -> 3.04 and asymmetry index
 * 0.098 -> 0.505 out to j = 3, and ~1.51x more mass on the head side across the +-3 window. The
 * E_trunc-dominated (k > 9) tail is the LIGHTER, faster-decaying side, consistent with the
 * imp-33809 H2/H3 finding that the tail falls off like sigma ~ N^(-1/2).
 *
 * MEASUREMENT / CROSS-CHECK ONLY. Reuses the imp-33809 per-k amplitudes verbatim; the component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33809-saturation-curvature-hump-vs-k (per-k hump amplitudes + one-sided step ratios)
 * @see imp-33773-ecoll-sigma-offset-eflow-attribution (M3 curvature-hump asserted)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see imp-3463-sigma-fartail-decay (far-tail sqrt(1/N) leading form the tail side tracks)
 */

import { IMP33809_SATURATION_CURVATURE_HUMP_VS_K } from './imp-33809-saturation-curvature-hump-vs-k.js';

// Reuse the imp-33809 per-k amplitudes verbatim (no fresh model, no re-derivation).
const HUMPS = IMP33809_SATURATION_CURVATURE_HUMP_VS_K.humpAmplitudes; // k = 6..13
const LADDER_DECADES = IMP33809_SATURATION_CURVATURE_HUMP_VS_K.humpLadder.map((r) => r.k);
const CROSSOVER_K = IMP33809_SATURATION_CURVATURE_HUMP_VS_K.crossoverDecadeK; // 9
const PEAK_I = LADDER_DECADES.indexOf(CROSSOVER_K); // index of k = 9
const PEAK = HUMPS[PEAK_I]; // hump(9) = 6.4758e-2

// Symmetric offsets j from the k = 9 peak with both sides in range (k = 6..13): j = 1,2,3.
const MAX_OFFSET = Math.min(PEAK_I, HUMPS.length - 1 - PEAK_I); // 3
const OFFSETS = [];
for (let j = 1; j <= MAX_OFFSET; j++) OFFSETS.push(j);

const SYMMETRY_LADDER = OFFSETS.map((j) => {
  const head = HUMPS[PEAK_I - j]; // hump(9-j), low-N E_coll-dominated head side
  const tail = HUMPS[PEAK_I + j]; // hump(9+j), high-N E_trunc-dominated tail side
  return {
    offset: j,
    headK: LADDER_DECADES[PEAK_I - j],
    tailK: LADDER_DECADES[PEAK_I + j],
    headFrac: +(head / PEAK).toFixed(4), // fraction of peak retained on head side
    tailFrac: +(tail / PEAK).toFixed(4), // fraction of peak retained on tail side
    skew: +(head / tail).toFixed(4), // head-over-tail at equal offset (>1 = head-heavy)
    asym: +((head - tail) / (head + tail)).toFixed(4), // signed asymmetry index
  };
});

const SKEWS = SYMMETRY_LADDER.map((r) => r.skew); // {1.2176, 1.5758, 3.0426}
const ASYMS = SYMMETRY_LADDER.map((r) => r.asym); // {0.0981, 0.2236, 0.5053}

// (S3) Symmetric +-3 window head/tail mass (k = 6,7,8 vs k = 10,11,12).
const HEAD_MASS = [1, 2, 3].reduce((s, j) => s + HUMPS[PEAK_I - j], 0); // 1.11659e-1
const TAIL_MASS = [1, 2, 3].reduce((s, j) => s + HUMPS[PEAK_I + j], 0); // 7.37926e-2
const MASS_RATIO = +(HEAD_MASS / TAIL_MASS).toFixed(4); // 1.5131
const WINDOW_ASYM = +((HEAD_MASS - TAIL_MASS) / (HEAD_MASS + TAIL_MASS)).toFixed(4); // 0.2042

export const IMP33851_HUMP_ENVELOPE_SYMMETRY_VS_K = {
  id: 'imp-33851',
  proofSection: 'S-frontier',
  question:
    'imp-33809 confirmed the M3 saturation-curvature hump peaks globally at the k = 9 crossover ' +
    'but reported only one-sided step ratios hump(k)/hump(k-1) and hump(k)/hump(k+1). Placing the ' +
    'two sides at the SAME symmetric offset j from the peak, is the hump envelope symmetric or ' +
    'skewed about the E_coll = E_trunc crossover, and toward which side? Measurement only; reuses ' +
    'the imp-33809 amplitudes; component model is extrapolation; no bound; no QED.',
  measuredQuantity:
    'at each symmetric offset j from the k = 9 peak: headFrac = hump(9-j)/hump(9), tailFrac = ' +
    'hump(9+j)/hump(9), skew = hump(9-j)/hump(9+j), asymmetry index (hump(9-j)-hump(9+j))/' +
    '(hump(9-j)+hump(9+j)); plus the symmetric +-3 window head/tail mass ratio',
  crossoverDecadeK: CROSSOVER_K,
  humpPeak: PEAK, // 6.4758e-2 at k = 9 (reused from imp-33809)
  symmetryLadder: SYMMETRY_LADDER,
  skewRatios: SKEWS, // {1.2176, 1.5758, 3.0426}: head-over-tail at offsets j = 1,2,3
  asymmetryIndices: ASYMS, // {0.0981, 0.2236, 0.5053}: signed, all positive => head-heavy
  windowMass: {
    headMassK678: +HEAD_MASS.toExponential(4), // 1.1166e-1
    tailMassK101112: +TAIL_MASS.toExponential(4), // 7.3793e-2
    massRatioHeadOverTail: MASS_RATIO, // 1.5131
    windowedAsymmetryIndex: WINDOW_ASYM, // 0.2042
  },
  finding: {
    S1_skew_grows_head_heavy:
      'skew(j) = hump(9-j)/hump(9+j) = {1.2176, 1.5758, 3.0426} for j = 1,2,3 -- monotonically ' +
      'increasing and all > 1, so at every symmetric offset the E_coll-dominated head side (k < 9) ' +
      'retains more hump amplitude than the E_trunc-dominated tail side (k > 9), and the gap widens ' +
      'with offset. The envelope is skewed, not symmetric.',
    S2_asymmetry_index_rises:
      'asym(j) = (hump(9-j)-hump(9+j))/(hump(9-j)+hump(9+j)) = {0.0981, 0.2236, 0.5053} for j = 1,2,3 ' +
      '-- all positive and monotonically increasing; by j = 3 the head carries ~3x the tail. The ' +
      'skew is toward the head (low-N) side, i.e. AWAY from the E_trunc-dominated tail, which is the ' +
      'faster-decaying side.',
    S3_window_mass_head_heavy:
      'Over the symmetric +-3 window the head decades k = 6,7,8 sum to 1.1166e-1 and the tail decades ' +
      'k = 10,11,12 to 7.3793e-2, a head/tail mass ratio 1.5131 and windowed asymmetry index 0.2042 ' +
      '-- a single-number confirmation that the M3 curvature hump is head-heavy about the k = 9 ' +
      'crossover.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Placed at equal symmetric offsets from the k = 9 ' +
    'crossover peak, the imp-33809 M3 saturation-curvature hump envelope is DEFINITIVELY SKEWED, not ' +
    'symmetric: the head-over-tail skew ratio hump(9-j)/hump(9+j) climbs 1.2176 -> 1.5758 -> 3.0426 ' +
    'over j = 1,2,3 and the signed asymmetry index climbs 0.0981 -> 0.2236 -> 0.5053, both ' +
    'monotonically and both head-heavy (positive) at every offset, so the E_coll-dominated low-N head ' +
    'side always retains more hump amplitude than the E_trunc-dominated high-N tail side. Over the ' +
    'symmetric +-3 window the head decades (k = 6,7,8) carry 1.5131x the mass of the tail decades ' +
    '(k = 10,11,12), windowed asymmetry index 0.2042. So the hump is skewed toward the head (low-N) ' +
    'side and away from the E_trunc-dominated (k > 9) tail -- the tail is the lighter, faster-decaying ' +
    'flank, consistent with the imp-33809 H2/H3 finding that it falls off like sigma ~ N^(-1/2). The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-33809 (per-k hump amplitudes + one-sided step ratios, reused here); imp-33773 (M3 ' +
    'curvature-hump asserted); imp-3444 (E_coll = E_trunc crossover N ~ 3.280e9); imp-3463 (far-tail ' +
    'sqrt(1/N) leading form the tail side tracks); imp-486 (C_mb GUE-conditional); imp-3066 ' +
    '(K_a >= 0 untouched).',
};

export const IMP33851_HUMP_ENVELOPE_SYMMETRY_VS_K_ASSERTIONS = [
  {
    // (Reuse gate) The peak reused from imp-33809 is the k = 9 crossover amplitude 6.4758e-2.
    id: 'imp33851-peak-reuses-imp33809-k9',
    description: 'peak is imp-33809 hump(9) = 6.4758e-2 at the k = 9 crossover decade',
    holds: () =>
      CROSSOVER_K === 9 && LADDER_DECADES[PEAK_I] === 9 && Math.abs(PEAK - 6.4758e-2) < 5e-4,
  },
  {
    // (S1) The head-over-tail skew ratio is > 1 at every symmetric offset and increases with j.
    id: 'imp33851-skew-head-heavy-and-growing',
    description: 'skew(j) = hump(9-j)/hump(9+j) all > 1 and monotonically increasing over j = 1,2,3',
    holds: () =>
      SKEWS.every((r) => r > 1) && SKEWS.every((r, i) => i === 0 || r > SKEWS[i - 1]),
  },
  {
    // (S1) The measured skew ladder matches the printed {1.2176, 1.5758, 3.0426}.
    id: 'imp33851-skew-ladder-values',
    description: 'skew(j) = {1.2176, 1.5758, 3.0426} for j = 1,2,3 to <5e-4',
    holds: () =>
      [1.2176, 1.5758, 3.0426].every((v, i) => Math.abs(SKEWS[i] - v) < 5e-4),
  },
  {
    // (S2) The signed asymmetry index is positive (head-heavy) at every offset and increasing,
    // and reaches ~0.505 by j = 3 (envelope skewed, not symmetric, about the crossover).
    id: 'imp33851-asymmetry-index-positive-and-rising',
    description: 'asym(j) = {0.0981, 0.2236, 0.5053} all positive, increasing, reaching ~0.505 by j = 3',
    holds: () =>
      ASYMS.every((a) => a > 0) &&
      ASYMS.every((a, i) => i === 0 || a > ASYMS[i - 1]) &&
      [0.0981, 0.2236, 0.5053].every((v, i) => Math.abs(ASYMS[i] - v) < 5e-4),
  },
  {
    // (S3) Over the symmetric +-3 window the head mass exceeds the tail mass (ratio ~1.5131 > 1),
    // confirming a head-heavy skew about the k = 9 crossover.
    id: 'imp33851-window-mass-head-heavy',
    description: 'symmetric +-3 window head/tail mass ratio ~1.5131 > 1, windowed asymmetry ~0.2042 > 0',
    holds: () =>
      HEAD_MASS > TAIL_MASS &&
      Math.abs(MASS_RATIO - 1.5131) < 5e-4 &&
      Math.abs(WINDOW_ASYM - 0.2042) < 5e-4,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp33851-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, crossover k = 9, no QED, no refereed bound is changed',
    holds: () =>
      IMP33851_HUMP_ENVELOPE_SYMMETRY_VS_K.isRigorous === false &&
      IMP33851_HUMP_ENVELOPE_SYMMETRY_VS_K.crossoverDecadeK === 9 &&
      /NO QED/.test(IMP33851_HUMP_ENVELOPE_SYMMETRY_VS_K.verdict) &&
      /refereed bound is changed/i.test(IMP33851_HUMP_ENVELOPE_SYMMETRY_VS_K.verdict),
  },
];

for (const a of IMP33851_HUMP_ENVELOPE_SYMMETRY_VS_K_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33851-hump-envelope-symmetry-vs-k assertion failed: ${a.id}`);
  }
}
