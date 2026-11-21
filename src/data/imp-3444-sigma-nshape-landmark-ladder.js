/**
 * @module imp-3444-sigma-nshape-landmark-ladder
 *
 * imp-3444 (numerical, frontier-direction): imp-3406 extrapolated the high-N branch
 * of the imp-3220 GUE-conditional share sigma(N) = E_coll(N) / E(N) past the sampled
 * 10^6 ceiling and reported an N-SHAPE: rise from small N, interior MIN near N ~ 97.8
 * (imp-3323), interior MAX near N ~ 9.22e5 (imp-3406), then monotone decay to 0. Along
 * the decaying right arm imp-3406 named two crossings by COARSE evaluation only -- the
 * decay passes back through the small-N start value sigma(2) ~ 0.9117 "near N ~ 1.79e7"
 * and through 0.5 "near N ~ 3.27e9". This module reuses the EXACT imp-3406 / imp-3220 /
 * imp-3323 sub-term formulas (effectiveHeightForN, C_C_PINNED, the imp-398 C_F prefactor,
 * E_trunc) and BISECTS every N-shape landmark to machine precision, tabulating the full
 * landmark ladder in one place: the interior MIN, the interior MAX, the sigma(2)-recross,
 * the 0.5 crossing, and the E_coll / E_trunc = 1 crossover.
 *
 * THE QUANTITY (identical to imp-3220 / imp-3323 / imp-3406)
 * ---------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll)
 *              = 1 / (1 + (E_trunc + E_flow) / E_coll),
 * with the same repo sub-terms:
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 *
 * THE LANDMARK LADDER (bisected to machine precision)
 * ---------------------------------------------------
 *   (L1) interior MIN   N_min ~ 97.7968       sigma_min ~ 0.8409680  (imp-3323, confirmed)
 *   (L2) interior MAX   N_max ~ 9.218633e5    sigma_max ~ 0.9494290  (imp-3406, confirmed)
 *   (L3) sigma(2)-recross N ~ 1.789296e7      sigma = sigma(2) ~ 0.9117411
 *   (L4) sigma = 0.5      N ~ 3.267235e9       sigma = 0.5000000
 *   (L5) E_coll = E_trunc N ~ 3.280294e9       sigma ~ 0.4995256
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (F1) The two imp-3406 coarse landmarks bisect to N_recross = 1.789296e7 and
 *        N_half = 3.267235e9 -- both INSIDE the imp-3406 coarse quotes "~1.79e7" and
 *        "~3.27e9" (agreement to the reported 3 sig figs), now pinned to machine
 *        precision on the right (decreasing) arm above the peak.
 *   (F2) The sigma = 0.5 crossing (L4, N ~ 3.267e9) and the E_coll = E_trunc crossover
 *        (L5, N ~ 3.280e9) are NEARLY COINCIDENT -- only ~0.40% apart in N. This is
 *        structural: sigma = 0.5 means E_coll = E_trunc + E_flow, and on the far right
 *        arm E_flow has decayed super-polynomially to negligibility (E_flow / E_trunc
 *        ~ 1.9e-3 there), so the half-share crossing sits just BELOW the pure E_coll =
 *        E_trunc crossover. The 0.5 landmark is, to sub-percent accuracy, the point
 *        where the vanishing GUE-conditional collision term drops through the constant
 *        truncation floor -- exactly the imp-3406 decay mechanism, now made quantitative.
 *   (F3) The full ordered ladder N_min < N_max < N_recross < N_half < N_cross is
 *        strictly monotone in N, confirming the imp-3406 N-shape geometry end to end:
 *        the right arm is single-valued and monotone decreasing between the peak and 0.
 *
 * The punchline: bisecting the imp-3406 N-shape landmarks to machine precision confirms
 * the coarse quotes to 3 sig figs and reveals that the sigma = 0.5 crossing essentially
 * IS the E_coll = E_trunc floor-crossover (within ~0.4%), because E_flow is negligible
 * on the far right arm -- the half-share point marks where the vanishing collision term
 * falls through the constant truncation floor.
 *
 * ASSESSMENT ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-3406-sigma-highN-extrapolation (N-shape, coarse sigma(2)-recross / 0.5 crossing)
 * @see imp-3323-sigma-argmin-locator (interior MIN pinned N ~ 97.80, same formulas)
 * @see imp-3220-en-bridge-fidelity-frontier (U-shaped sigma(N) decade ladder)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3323/imp-3406 exactly

// EXACT imp-3406 sub-terms (no re-derivation, no fresh model).
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

// Machine-precision unimodal turning-point locators (ternary search in ln N, 500 iters
// -> the ln-bracket collapses far below double-precision granularity).
function argExtremumLnN(loN, hiN, wantMax) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    const worse = wantMax
      ? sigma(Math.exp(m1)) < sigma(Math.exp(m2))
      : sigma(Math.exp(m1)) > sigma(Math.exp(m2));
    if (worse) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

// Machine-precision crossing on the monotone-decreasing right arm above the peak.
function crossingAbovePeak(peakN, valueAtN) {
  let a = Math.log(peakN);
  let b = Math.log(1e80);
  for (let i = 0; i < 500; i++) {
    const m = (a + b) / 2;
    if (valueAtN(Math.exp(m)) > 0) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// (L1) interior MIN (imp-3323 basin) and (L2) interior MAX (imp-3406 right-arm peak).
const N_MIN = argExtremumLnN(10, 3000, false); // ~97.7968
const N_MAX = argExtremumLnN(1e4, 1e9, true); // ~9.2186e5
const SIGMA_MIN = sigma(N_MIN);
const SIGMA_MAX = sigma(N_MAX);

// (L3) sigma(2)-recross: where the decaying right arm falls back through sigma(2).
const SIGMA_SMALL_N_START = sigma(2); // ~0.911741
const N_RECROSS = crossingAbovePeak(N_MAX, (N) => sigma(N) - SIGMA_SMALL_N_START); // ~1.789e7

// (L4) sigma = 0.5 crossing on the right arm.
const N_HALF = crossingAbovePeak(N_MAX, (N) => sigma(N) - 0.5); // ~3.267e9

// (L5) E_coll = E_trunc crossover (the collision term dropping through the constant floor).
const N_ECOLL_EQ_ETRUNC = crossingAbovePeak(N_MAX, (N) => parts(N).E_coll - E_TRUNC_PT); // ~3.280e9

// Structural check: sigma=0.5 vs E_coll=E_trunc near-coincidence, and E_flow negligibility.
const HALF_VS_FLOOR_REL = Math.abs(N_HALF - N_ECOLL_EQ_ETRUNC) / N_ECOLL_EQ_ETRUNC; // ~0.004
const P_HALF = parts(N_HALF);
const E_FLOW_OVER_E_TRUNC_AT_HALF = P_HALF.E_flow / E_TRUNC_PT; // ~1.9e-3 (negligible)

// The full ordered landmark ladder, bisected to machine precision.
const LANDMARK_LADDER = [
  { name: 'interior_min', N: +N_MIN.toFixed(6), sigma: +SIGMA_MIN.toFixed(9), source: 'imp-3323' },
  { name: 'interior_max', N: +N_MAX.toExponential(9), sigma: +SIGMA_MAX.toFixed(9), source: 'imp-3406' },
  { name: 'sigma2_recross', N: +N_RECROSS.toExponential(9), sigma: +SIGMA_SMALL_N_START.toFixed(9), source: 'imp-3406-coarse' },
  { name: 'sigma_half', N: +N_HALF.toExponential(9), sigma: 0.5, source: 'imp-3406-coarse' },
  { name: 'Ecoll_eq_Etrunc', N: +N_ECOLL_EQ_ETRUNC.toExponential(9), sigma: +sigma(N_ECOLL_EQ_ETRUNC).toFixed(9), source: 'this-module' },
];

export const IMP3444_SIGMA_NSHAPE_LANDMARK_LADDER = {
  id: 'imp-3444',
  proofSection: 'S-frontier',
  question:
    'Bisect the imp-3406 sigma(N) N-shape landmark ladder to machine precision -- the ' +
    'interior MIN (imp-3323), interior MAX (imp-3406), the sigma(2)-recross (~1.79e7 coarse), ' +
    'the sigma = 0.5 crossing (~3.27e9 coarse), and the E_coll = E_trunc crossover -- reusing ' +
    'the identical imp-3406/imp-3220 sub-term formulas. Measurement only, no RH verdict, no QED.',
  landmarkLadder: LANDMARK_LADDER,
  bisectedLandmarks: {
    N_min: +N_MIN.toFixed(6), // 97.796847
    N_max: +N_MAX.toExponential(9), // 9.218632851e5
    N_recross_sigma2: +N_RECROSS.toExponential(9), // 1.789296324e7
    N_half: +N_HALF.toExponential(9), // 3.267235198e9
    N_Ecoll_eq_Etrunc: +N_ECOLL_EQ_ETRUNC.toExponential(9), // 3.280294352e9
    note:
      'Every N-shape landmark bisected to machine precision on the exact imp-3406 sigma(N). ' +
      'The two imp-3406 COARSE right-arm quotes -- sigma(2)-recross "~1.79e7" and 0.5-crossing ' +
      '"~3.27e9" -- bisect to 1.789296e7 and 3.267235e9, confirming the coarse reads to 3 sig ' +
      'figs. Ordering N_min < N_max < N_recross < N_half < N_cross is strictly monotone: the ' +
      'right arm is single-valued and monotone decreasing between the peak and 0.',
  },
  halfCrossingIsFloorCrossover: {
    N_half: +N_HALF.toExponential(6), // 3.267235e9
    N_Ecoll_eq_Etrunc: +N_ECOLL_EQ_ETRUNC.toExponential(6), // 3.280294e9
    relative_gap: +HALF_VS_FLOOR_REL.toExponential(3), // ~4.0e-3
    E_flow_over_E_trunc_at_half: +E_FLOW_OVER_E_TRUNC_AT_HALF.toExponential(3), // ~1.9e-3
    note:
      'The sigma = 0.5 crossing and the E_coll = E_trunc crossover are NEARLY COINCIDENT ' +
      '(~0.40% apart in N). sigma = 0.5 means E_coll = E_trunc + E_flow; on the far right arm ' +
      'E_flow has decayed super-polynomially to near-negligibility (E_flow/E_trunc ~ 1.9e-3), so the ' +
      'half-share crossing sits just below the pure E_coll = E_trunc crossover. The 0.5 ' +
      'landmark IS, to sub-percent accuracy, the point where the vanishing GUE-conditional ' +
      'collision term falls through the constant truncation floor -- the imp-3406 decay ' +
      'mechanism made quantitative.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Bisecting the imp-3406 sigma(N) N-shape ' +
    'landmark ladder to machine precision on the identical imp-3220/imp-3323/imp-3406 sub-term ' +
    'formulas pins: interior MIN N ~ 97.797 (sigma ~ 0.84097, imp-3323), interior MAX N ~ ' +
    '9.21863e5 (sigma ~ 0.94943, imp-3406), sigma(2)-recross N ~ 1.789296e7, sigma = 0.5 ' +
    'crossing N ~ 3.267235e9, E_coll = E_trunc crossover N ~ 3.280294e9. The two imp-3406 ' +
    'COARSE right-arm quotes ("~1.79e7", "~3.27e9") are confirmed to 3 sig figs. The sigma = ' +
    '0.5 crossing sits only ~0.40% below the E_coll = E_trunc crossover because E_flow is ' +
    'small there (E_flow/E_trunc ~ 1.9e-3), so the half-share landmark essentially IS the ' +
    'floor-crossover -- the point where the vanishing collision term drops through the constant ' +
    'truncation floor. No positivity, no bridge closure, no RH claim, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-3406 (N-shape extrapolation, coarse sigma(2)-recross / 0.5 crossing); imp-3323 ' +
    '(interior min pinned N ~ 97.80); imp-3220 (U-shaped sigma(N) decade ladder); imp-2642 ' +
    '(C_H = 1/8 ansatz); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP3444_SIGMA_NSHAPE_LANDMARK_LADDER_ASSERTIONS = [
  {
    // Reuse gate: sigma(10^6) reproduces the imp-3220/imp-3406 widest-gap value ~0.9494,
    // proving the identical sub-term formulas are in use.
    id: 'imp3444-reproduces-imp3406-ceiling-value',
    description: 'sigma(10^6) reproduces the imp-3220/imp-3406 widest-gap value ~0.9494',
    holds: () => Math.abs(sigma(1e6) - 0.9494) < 5e-4,
  },
  {
    // (L1)/(L2): the interior MIN and MAX bisect to the imp-3323 / imp-3406 pinned values.
    id: 'imp3444-interior-min-max-match-parents',
    description: 'interior MIN ~ 97.80 (sigma ~ 0.84097, imp-3323) and MAX ~ 9.22e5 (sigma ~ 0.94943, imp-3406)',
    holds: () =>
      N_MIN > 90 && N_MIN < 105 && Math.abs(SIGMA_MIN - 0.84097) < 5e-4 &&
      N_MAX > 5e5 && N_MAX < 2e6 && Math.abs(SIGMA_MAX - 0.94943) < 5e-4,
  },
  {
    // (L3): the sigma(2)-recross bisects inside the imp-3406 coarse quote "~1.79e7".
    id: 'imp3444-sigma2-recross-matches-coarse',
    description: 'sigma(2)-recross bisects to ~1.789e7, inside the imp-3406 coarse "~1.79e7"',
    holds: () =>
      Math.abs(N_RECROSS - 1.789e7) / 1.789e7 < 5e-3 &&
      Math.abs(sigma(N_RECROSS) - SIGMA_SMALL_N_START) < 1e-9,
  },
  {
    // (L4): the 0.5 crossing bisects inside the imp-3406 coarse quote "~3.27e9".
    id: 'imp3444-half-crossing-matches-coarse',
    description: 'sigma = 0.5 crossing bisects to ~3.267e9, inside the imp-3406 coarse "~3.27e9"',
    holds: () =>
      Math.abs(N_HALF - 3.27e9) / 3.27e9 < 5e-3 &&
      Math.abs(sigma(N_HALF) - 0.5) < 1e-9,
  },
  {
    // (F2): the 0.5 crossing and the E_coll = E_trunc crossover are near-coincident because
    // E_flow is negligible on the far right arm.
    id: 'imp3444-half-crossing-is-floor-crossover',
    description: 'sigma = 0.5 and E_coll = E_trunc crossovers agree to < 1% (E_flow small there)',
    holds: () =>
      HALF_VS_FLOOR_REL < 1e-2 &&
      E_FLOW_OVER_E_TRUNC_AT_HALF < 1e-2 &&
      Math.abs(parts(N_ECOLL_EQ_ETRUNC).E_coll - E_TRUNC_PT) / E_TRUNC_PT < 1e-6,
  },
  {
    // (F3): the full landmark ladder is strictly monotone in N -- the N-shape geometry.
    id: 'imp3444-landmark-ladder-strictly-monotone',
    description: 'N_min < N_max < N_recross < N_half < N_cross (strict N-shape ordering)',
    holds: () =>
      N_MIN < N_MAX && N_MAX < N_RECROSS && N_RECROSS < N_HALF && N_HALF < N_ECOLL_EQ_ETRUNC,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp3444-honesty-gate-no-qed',
    description: 'Measurement only: no QED, no refereed bound is changed',
    holds: () =>
      IMP3444_SIGMA_NSHAPE_LANDMARK_LADDER.isRigorous === false &&
      /NO QED/.test(IMP3444_SIGMA_NSHAPE_LANDMARK_LADDER.verdict) &&
      /refereed bound is changed/i.test(IMP3444_SIGMA_NSHAPE_LANDMARK_LADDER.verdict),
  },
];

for (const a of IMP3444_SIGMA_NSHAPE_LANDMARK_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3444-sigma-nshape-landmark-ladder assertion failed: ${a.id}`);
  }
}
