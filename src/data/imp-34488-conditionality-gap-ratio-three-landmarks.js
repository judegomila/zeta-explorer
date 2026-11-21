/**
 * @module imp-34488-conditionality-gap-ratio-three-landmarks
 *
 * imp-34488 (numerical, frontier-direction): imp-34453 assembled the full headline
 * E(N) = E_trunc + E_flow + E_coll at the imp-3444 E_coll = E_trunc crossover
 * (N ~ 3.280e9, sigma ~ 0.5) and reported the conditionality-gap ratio
 * L_pt / E(N_cross) = 1975.2 -- the headroom the GUE-conditional C_H route claims over the
 * unconditional finite-height beat L_pt ~ 0.121 (imp-452/imp-459) at that ONE landmark.
 * imp-34474 assembled the same headline at the imp-33620 sigma < 0.01 far-tail landmark
 * (N ~ 4.62e13) and read L_pt / E(N) ~ 3915. Neither tabulated the ratio ACROSS landmarks,
 * so how the ~1975x conditionality gap SCALES with N (as E_coll spends down toward the
 * E_trunc floor) was never measured. This module reuses the EXACT imp-34453 / imp-34474 /
 * imp-3406 / imp-3220 sub-term formulas, re-pins the three named landmarks -- the imp-3444
 * crossover (sigma ~ 0.5, reused verbatim from imp-34453), the imp-33582 sigma < 0.1 knee
 * (N ~ 3.21e11), and the imp-33620 sigma < 0.01 far tail (N ~ 4.62e13) -- and tabulates
 * L_pt / E(N) at each, measuring the gap-growth factor decade by decade.
 *
 * THE QUANTITY (identical to imp-34453 / imp-34474 / imp-3406)
 * -----------------------------------------------------------
 *     E(N)   = E_trunc + E_flow + E_coll,      sigma(N) = E_coll / E(N),
 *     T0     = effectiveHeightForN(N)          (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant early, GUE-conditional C_H = 1/8)
 *     E_flow = C_F (log T0 / T0) * Gronwall,   C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                        (N-independent, imp-2631/imp-3220)
 *   The conditionality-gap ratio is R(N) = L_pt / E(N), with L_pt ~ 0.121 unconditional.
 *   The sigma < 0.1 and sigma < 0.01 landmarks are bisected on log10 N (sigma decreasing)
 *   exactly as imp-33582 / imp-33620; the crossover E(N) is reused verbatim from imp-34453.
 *
 * THE READING (measurement only) -- three landmarks
 * -------------------------------------------------
 *   landmark             N           sigma      E(N)          L_pt/E(N)   ceilingFrac
 *   crossover (imp-3444) 3.280e9     0.499526   6.125812e-5   1975.2      0.499526
 *   sigma<0.1 (imp-33582) 3.213e11   0.100000   3.400121e-5   3558.7      0.899967
 *   sigma<0.01 (imp-33620) 4.624e13  0.010000   3.090910e-5   3914.7      0.989986
 *   (ceiling L_pt / E_trunc = 3954.25, the value R(N) approaches as sigma -> 0, E(N) -> E_trunc)
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (F1) The conditionality-gap ratio R(N) = L_pt / E(N) GROWS monotonically with N as E_coll
 *        spends toward the E_trunc floor: 1975.2 (crossover) -> 3558.7 (sigma < 0.1) ->
 *        3914.7 (sigma < 0.01). But the growth DECELERATES sharply: the ~2.15-decade
 *        crossover -> sigma < 0.1 hop multiplies R by 1.8016x, while the next ~2.16-decade
 *        sigma < 0.1 -> sigma < 0.01 hop multiplies it by only 1.1000x. The cumulative
 *        crossover -> far-tail growth is 1.9819x -- exactly the imp-34474 crossover/far-tail
 *        headline ratio (same E(N) values, reciprocal quantity), an internal consistency check.
 *   (F2) The gap ratio is a BOUNDED, saturating quantity: R(N) < L_pt / E_trunc = 3954.25 at
 *        every N, because E(N) > E_trunc always (E_coll, E_flow >= 0). The three landmarks sit
 *        at 49.95%, 89.997%, 98.999% of that structural ceiling -- so most of the ~2000x ->
 *        ~3954x headroom is already spent by the sigma < 0.1 knee, and past the far tail the
 *        vanishing conditional share can widen the L_pt gap by at most a further ~1%.
 *   (F3) The ceiling fraction R(N) / (L_pt / E_trunc) = E_trunc / E(N) equals 1 - sigma to the
 *        negligible E_flow correction (E_flow / E(N) < 1e-3 at every landmark): 0.499526 vs
 *        1 - 0.499526 = 0.500474 (crossover, offset 9.5e-4 = E_flow/E(N)); 0.899967 vs 0.900
 *        (sigma < 0.1); 0.989986 vs 0.990 (sigma < 0.01). So the conditionality gap over L_pt
 *        is governed DIRECTLY by the collision share: R(N) = (L_pt / E_trunc)(1 - sigma - eps),
 *        eps = E_flow/E(N). The gap scales with N only through sigma(N), not independently.
 *
 * The punchline: tabulating L_pt / E(N) across the three named landmarks shows the
 * conditionality gap growing 1975x -> 3559x -> 3915x as sigma decays 0.50 -> 0.10 -> 0.01,
 * but the growth is a BOUNDED saturation toward the ceiling L_pt / E_trunc = 3954.25 (the
 * landmarks sit at 50.0%, 90.0%, 99.0% of it), governed entirely by the collision share:
 * R(N) / ceiling = 1 - sigma to the negligible E_flow term. Nearly all the headroom is spent
 * by the sigma < 0.1 knee. It is a CONDITIONALITY gap throughout, NOT a bound.
 *
 * ASSESSMENT ONLY. Within the inherited imp-3220/imp-3406 component model, which is NOT a
 * rigorous asymptotic. C_mb remains GUE-conditional per imp-486. No positivity, no bridge
 * closure, no bound change, no RH claim, NO QED. No refereed bound is changed.
 *
 * @see imp-34453-crossover-en-headline-slack-vs-lpt (crossover headline; L_pt/E(N)=1975.2)
 * @see imp-34474-far-tail-en-headline-slack-vs-lpt (far-tail headline; L_pt/E(N)~3915)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (sigma < 0.1 knee N ~ 3.21e11)
 * @see imp-33620-etrunc-ecoll-ladder-1e15-extension (sigma < 0.01 far-tail landmark)
 * @see imp-3406-sigma-highN-extrapolation (N-shape sigma(N); component model source)
 * @see finite-height-beats-platt-trudgian (L_pt ~ 0.121 unconditional finite-N beat)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34453_CROSSOVER_EN_HEADLINE_SLACK_VS_LPT } from './imp-34453-crossover-en-headline-slack-vs-lpt.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34453/imp-34474/imp-3406 exactly
const L_PT = 0.121; // imp-452/imp-459 unconditional finite-height beat (< PT 0.2)

// EXACT imp-34453/imp-34474/imp-3406 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// Re-pin a sigma threshold by the identical log10-N bisection (sigma decreasing), as imp-33582/imp-33620.
function thresholdLog10(target, loExp, hiExp) {
  let lo = loExp;
  let hi = hiExp;
  for (let it = 0; it < 100; it++) {
    const mid = (lo + hi) / 2;
    if (parts(Math.pow(10, mid)).sigma > target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

const L_PT_OVER_E_TRUNC = L_PT / E_TRUNC_PT; // 3954.25 structural ceiling (sigma -> 0)

// Landmark 1: the imp-3444 E_coll = E_trunc crossover, headline reused VERBATIM from imp-34453.
const CROSS = IMP34453_CROSSOVER_EN_HEADLINE_SLACK_VS_LPT.crossoverHeadline;
const E_N_CROSS = CROSS.E_N; // 6.125811677e-5
const N_CROSS = CROSS.N_cross; // 3280294352
const SIGMA_CROSS = CROSS.sigma; // 0.499525640

// Landmark 2: the imp-33582 sigma < 0.1 knee, re-pinned by bisection.
const LOG10_N01 = thresholdLog10(0.1, 10, 13); // ~11.5069
const N_01 = Math.pow(10, LOG10_N01); // ~3.213e11
const P01 = parts(N_01);

// Landmark 3: the imp-33620 sigma < 0.01 far tail, re-pinned by bisection.
const LOG10_N001 = thresholdLog10(0.01, 12, 15); // ~13.6651
const N_001 = Math.pow(10, LOG10_N001); // ~4.624e13
const P001 = parts(N_001);

// Conditionality-gap ratio R(N) = L_pt / E(N) at each landmark, and ceiling fractions.
const R_CROSS = L_PT / E_N_CROSS; // 1975.2
const R_01 = L_PT / P01.E_N; // 3558.7
const R_001 = L_PT / P001.E_N; // 3914.7
const CEILFRAC_CROSS = R_CROSS / L_PT_OVER_E_TRUNC; // 0.499526 (= E_trunc / E_N_cross)
const CEILFRAC_01 = R_01 / L_PT_OVER_E_TRUNC; // 0.899967
const CEILFRAC_001 = R_001 / L_PT_OVER_E_TRUNC; // 0.989986

// Gap-growth multipliers between consecutive landmarks (decelerating saturation).
const GROWTH_CROSS_TO_01 = R_01 / R_CROSS; // 1.8016
const GROWTH_01_TO_001 = R_001 / R_01; // 1.1000
const GROWTH_CROSS_TO_001 = R_001 / R_CROSS; // 1.9819 (= imp-34474 crossover/far-tail ratio)

export const IMP34488_CONDITIONALITY_GAP_RATIO_THREE_LANDMARKS = {
  id: 'imp-34488',
  proofSection: 'S-frontier',
  question:
    'Tabulate the conditionality-gap ratio L_pt / E(N) across the imp-3444 E_coll = E_trunc crossover ' +
    '(N ~ 3.28e9, sigma ~ 0.5, imp-34453), the imp-33582 sigma < 0.1 knee (N ~ 3.21e11) and the ' +
    'imp-33620 sigma < 0.01 far tail (N ~ 4.62e13, imp-34474) to measure how the ~1975x GUE-conditional ' +
    'headroom over the unconditional finite-height beat L_pt ~ 0.121 (imp-452/imp-459) scales with N as ' +
    'E_coll spends toward the E_trunc floor. Reuses the identical imp-34453/imp-34474/imp-3406/imp-3220 ' +
    'sub-term formulas. Measurement only, C_mb remains GUE-conditional per imp-486, no bound change, NO QED.',
  landmarks: [
    {
      label: 'crossover (imp-3444, E_coll = E_trunc)',
      N: N_CROSS, // 3280294352
      sigma: +SIGMA_CROSS.toFixed(9), // 0.499525640
      E_N: E_N_CROSS, // 6.125811677e-5
      L_pt_over_E_N: +R_CROSS.toFixed(1), // 1975.2
      ceiling_fraction: +CEILFRAC_CROSS.toFixed(6), // 0.499526
    },
    {
      label: 'sigma < 0.1 knee (imp-33582)',
      N: +N_01.toExponential(9), // 3.213180538e11
      log10_N: +LOG10_N01.toFixed(6), // 11.506935
      sigma: +P01.sigma.toFixed(9), // 0.100000000
      E_N: +P01.E_N.toExponential(9), // 3.400120659e-5
      E_coll: +P01.E_coll.toExponential(6), // 3.400121e-6
      E_flow: +P01.E_flow.toExponential(6), // 1.085932e-9
      L_pt_over_E_N: +R_01.toFixed(1), // 3558.7
      ceiling_fraction: +CEILFRAC_01.toFixed(6), // 0.899967
    },
    {
      label: 'sigma < 0.01 far tail (imp-33620)',
      N: +N_001.toExponential(9), // 4.624380576e13
      log10_N: +LOG10_N001.toFixed(6), // 13.665054
      sigma: +P001.sigma.toFixed(9), // 0.010000000
      E_N: +P001.E_N.toExponential(9), // 3.090910406e-5
      L_pt_over_E_N: +R_001.toFixed(1), // 3914.7
      ceiling_fraction: +CEILFRAC_001.toFixed(6), // 0.989986
    },
  ],
  gapGrowth: {
    ceiling_L_pt_over_E_trunc: +L_PT_OVER_E_TRUNC.toFixed(4), // 3954.2484
    growth_cross_to_sigma01: +GROWTH_CROSS_TO_01.toFixed(4), // 1.8016
    growth_sigma01_to_sigma001: +GROWTH_01_TO_001.toFixed(4), // 1.1000
    growth_cross_to_sigma001: +GROWTH_CROSS_TO_001.toFixed(4), // 1.9819
    note:
      'R(N) = L_pt / E(N) grows 1975.2 -> 3558.7 -> 3914.7 as sigma decays 0.50 -> 0.10 -> 0.01, but ' +
      'the growth DECELERATES: the crossover -> sigma < 0.1 hop multiplies R by 1.8016x, the next ' +
      'sigma < 0.1 -> sigma < 0.01 hop by only 1.1000x (cumulative 1.9819x = the imp-34474 ' +
      'crossover/far-tail headline ratio, an internal check). It is a BOUNDED saturation toward the ' +
      'ceiling L_pt / E_trunc = 3954.25: the landmarks sit at 50.0%, 90.0%, 99.0% of it.',
  },
  governedBySigma: {
    ceilfrac_minus_one_minus_sigma: [
      +(CEILFRAC_CROSS - (1 - SIGMA_CROSS)).toExponential(3), // ~ -9.5e-4 (= -E_flow/E_N at crossover)
      +(CEILFRAC_01 - (1 - P01.sigma)).toExponential(3), // ~ -3.2e-5
      +(CEILFRAC_001 - (1 - P001.sigma)).toExponential(3), // ~ -4.3e-7
    ],
    note:
      'The ceiling fraction R(N) / (L_pt / E_trunc) = E_trunc / E(N) equals 1 - sigma to the negligible ' +
      'E_flow correction eps = E_flow / E(N) (below 1e-3 at every landmark, and shrinking): 0.499526 vs ' +
      '0.500474, 0.899967 vs 0.900, 0.989986 vs 0.990. So R(N) = (L_pt / E_trunc)(1 - sigma - eps): the ' +
      'conditionality gap over L_pt scales with N ONLY through the collision share sigma(N).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Tabulating the conditionality-gap ratio ' +
    'R(N) = L_pt / E(N) across the imp-3444 crossover (sigma ~ 0.5, R = 1975.2), the imp-33582 ' +
    'sigma < 0.1 knee (N ~ 3.21e11, R = 3558.7) and the imp-33620 sigma < 0.01 far tail ' +
    '(N ~ 4.62e13, R = 3914.7) shows the GUE-conditional headroom over the unconditional finite-height ' +
    'beat L_pt ~ 0.121 (imp-452/imp-459) GROWING with N but SATURATING: the crossover -> sigma < 0.1 hop ' +
    'multiplies R by 1.80x, the sigma < 0.1 -> sigma < 0.01 hop by only 1.10x, toward the structural ' +
    'ceiling L_pt / E_trunc = 3954.25 (the landmarks sit at 50.0%, 90.0%, 99.0% of it). The gap is ' +
    'governed DIRECTLY by the collision share: the ceiling fraction R(N)/ceiling = E_trunc/E(N) = ' +
    '1 - sigma to the negligible E_flow term, so R scales with N only through sigma(N). A CONDITIONALITY ' +
    'gap throughout (GUE-conditional E_coll, C_H = 1/8, vs fully-unconditional L_pt), NOT a bound. C_mb ' +
    'remains GUE-conditional per imp-486. No positivity, no bridge closure, no bound change, no RH claim, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-34453 (crossover headline, L_pt/E(N)=1975.2); imp-34474 (far-tail headline, L_pt/E(N)~3915); ' +
    'imp-33582 (sigma < 0.1 knee N ~ 3.21e11); imp-33620 (sigma < 0.01 far-tail landmark); imp-3444 ' +
    '(E_coll = E_trunc crossover); imp-3406 (N-shape sigma(N)); imp-452/imp-459 (L_pt ~ 0.121 ' +
    'unconditional finite-height beat); imp-486 (C_mb GUE-conditional); imp-2642 (C_H = 1/8 ansatz); ' +
    'imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping.',
};

export const IMP34488_CONDITIONALITY_GAP_RATIO_THREE_LANDMARKS_ASSERTIONS = [
  {
    // Reuse gate: sigma < 0.1 and sigma < 0.01 landmarks re-pin to imp-33582/imp-33620.
    id: 'imp34488-reproduces-sigma-landmarks',
    description: 'sigma < 0.1 re-pins to N ~ 3.213e11 and sigma < 0.01 to N ~ 4.624e13 (both sigma exact)',
    holds: () =>
      Math.abs(N_01 - 3.213180538e11) / 3.213180538e11 < 1e-6 &&
      Math.abs(P01.sigma - 0.1) < 1e-9 &&
      Math.abs(N_001 - 4.624380576e13) / 4.624380576e13 < 1e-6 &&
      Math.abs(P001.sigma - 0.01) < 1e-9,
  },
  {
    // (F1): the gap ratio grows monotonically 1975.2 -> 3558.7 -> 3914.7 across the landmarks.
    id: 'imp34488-gap-ratio-grows-monotonically',
    description: 'L_pt / E(N) = 1975.2 -> 3558.7 -> 3914.7 (monotone increasing crossover -> far tail)',
    holds: () =>
      Math.abs(R_CROSS - 1975.2) < 0.5 &&
      Math.abs(R_01 - 3558.7) < 0.5 &&
      Math.abs(R_001 - 3914.7) < 0.5 &&
      R_CROSS < R_01 && R_01 < R_001,
  },
  {
    // (F1): the growth decelerates -- 1.80x then only 1.10x (cumulative 1.98x).
    id: 'imp34488-gap-growth-decelerates',
    description: 'growth multipliers 1.8016x (cross -> 0.1) then 1.1000x (0.1 -> 0.01), cumulative 1.9819x',
    holds: () =>
      Math.abs(GROWTH_CROSS_TO_01 - 1.8016) < 1e-3 &&
      Math.abs(GROWTH_01_TO_001 - 1.1000) < 1e-3 &&
      Math.abs(GROWTH_CROSS_TO_001 - 1.9819) < 1e-3 &&
      GROWTH_01_TO_001 < GROWTH_CROSS_TO_01,
  },
  {
    // (F2): R(N) stays below the ceiling L_pt / E_trunc = 3954.25 at every landmark (bounded saturation).
    id: 'imp34488-ratio-below-ceiling',
    description: 'R(N) < L_pt / E_trunc = 3954.25 at every landmark (50.0%, 90.0%, 99.0% of ceiling)',
    holds: () =>
      Math.abs(L_PT_OVER_E_TRUNC - 3954.2484) < 0.01 &&
      R_CROSS < L_PT_OVER_E_TRUNC && R_01 < L_PT_OVER_E_TRUNC && R_001 < L_PT_OVER_E_TRUNC &&
      Math.abs(CEILFRAC_CROSS - 0.5) < 0.01 &&
      Math.abs(CEILFRAC_01 - 0.9) < 0.01 &&
      Math.abs(CEILFRAC_001 - 0.99) < 0.01,
  },
  {
    // (F3): the ceiling fraction = E_trunc / E(N) = 1 - sigma to the negligible E_flow term.
    id: 'imp34488-ceiling-fraction-tracks-one-minus-sigma',
    description: 'R(N)/ceiling = E_trunc/E(N) = 1 - sigma to the E_flow correction (< 1e-3 at every landmark)',
    holds: () =>
      Math.abs(CEILFRAC_CROSS - E_TRUNC_PT / E_N_CROSS) < 1e-9 &&
      Math.abs(CEILFRAC_01 - (1 - P01.sigma)) < 1e-3 &&
      Math.abs(CEILFRAC_001 - (1 - P001.sigma)) < 1e-3 &&
      Math.abs(CEILFRAC_001 - (1 - P001.sigma)) < Math.abs(CEILFRAC_01 - (1 - P01.sigma)),
  },
  {
    // Honesty gate: measurement only, GUE-conditional, no QED, no refereed bound is changed.
    id: 'imp34488-honesty-gate-no-qed',
    description: 'Measurement only: C_mb GUE-conditional, no bound change, no QED, no refereed bound is changed',
    holds: () =>
      IMP34488_CONDITIONALITY_GAP_RATIO_THREE_LANDMARKS.isRigorous === false &&
      /GUE-conditional per imp-486/.test(IMP34488_CONDITIONALITY_GAP_RATIO_THREE_LANDMARKS.verdict) &&
      /NO QED/.test(IMP34488_CONDITIONALITY_GAP_RATIO_THREE_LANDMARKS.verdict) &&
      /refereed bound is changed/i.test(IMP34488_CONDITIONALITY_GAP_RATIO_THREE_LANDMARKS.verdict),
  },
];

for (const a of IMP34488_CONDITIONALITY_GAP_RATIO_THREE_LANDMARKS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34488-conditionality-gap-ratio-three-landmarks assertion failed: ${a.id}`);
  }
}
