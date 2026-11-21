/**
 * @module imp-34453-crossover-en-headline-slack-vs-lpt
 *
 * imp-34453 (accuracy, frontier-direction): imp-3444 bisected the imp-3406 sigma(N)
 * N-shape right arm and pinned the E_coll = E_trunc crossover at N ~ 3.280294e9 -- the
 * currentStatus/imp-33582 sigma-halving landmark where the GUE-conditional collision
 * term drops through the constant truncation floor. imp-3444 tabulated the LANDMARK
 * (its N and sigma) but never assembled the full headline E(N) = E_trunc + E_flow +
 * E_coll THERE, nor compared that headline Lambda <= E(N) slack against the unconditional
 * finite-height beat L_pt ~ 0.121 (imp-452/imp-459, the SOTA-beating finite-N certificate).
 * This module reuses the EXACT imp-3444 / imp-3406 / imp-3220 sub-term formulas, re-pins
 * the crossover by the identical bisection, assembles E(N) at that N, and reports the
 * headline slack against L_pt in one place.
 *
 * THE QUANTITY (identical to imp-3444 / imp-3220 / imp-3406)
 * ---------------------------------------------------------
 *     E(N)   = E_trunc + E_flow + E_coll,      sigma(N) = E_coll / E(N),
 *     T0     = effectiveHeightForN(N)          (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H = 1/8)
 *     E_flow = C_F (log T0 / T0) * Gronwall,   C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                        (N-independent, imp-2631/imp-3220)
 *   The crossover N_cross is bisected on the monotone-decreasing right arm above the
 *   imp-3406 peak (N_max ~ 9.2186e5) as the root of E_coll(N) - E_trunc = 0.
 *
 * THE READING (measurement only)
 * ------------------------------
 *   N_cross    = 3.280294352e9          (imp-3444 E_coll = E_trunc crossover, reproduced ===)
 *   T0(N_cross)= 1.143785e9
 *   E_trunc    = 3.060000e-5            (constant floor)
 *   E_coll     = 3.060000e-5            (equals E_trunc BY DEFINITION at the crossover)
 *   E_flow     = 5.811677e-8            (negligible: E_flow / E_trunc ~ 1.899e-3)
 *   E(N_cross) = 6.125812e-5            headline GUE-conditional slack Lambda <= E(N)
 *   sigma      = 0.4995256             (imp-3444 landmark value, reproduced ===)
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (F1) At the crossover the assembled headline E(N) = 6.1258e-5 is, to 0.19%, exactly
 *        TWICE the truncation floor: E(N) / E_trunc = 2.0019, because E_coll = E_trunc
 *        there and E_flow has decayed to ~0.19% of E_trunc. The crossover is thus the
 *        structural point where the headline slack equals 2 * E_trunc + (tiny E_flow):
 *        the vanishing GUE-conditional collision term and the constant floor are equal
 *        and jointly set the headline to ~2 * E_trunc.
 *   (F2) This GUE-conditional headline slack Lambda <= E(N) ~ 6.13e-5 sits a FACTOR
 *        ~1975 BELOW the unconditional finite-height beat L_pt ~ 0.121 (imp-452/imp-459):
 *        L_pt / E(N_cross) = 1975.2. So the conditional frontier slack at the crossover
 *        is ~2000x tighter than the standing unconditional finite-N certificate -- a
 *        measure of how much headroom the GUE-conditional C_H route claims over the
 *        rigorous L_pt bound at this landmark.
 *   (F3) The gap is entirely a CONDITIONALITY gap, not a bound: E(N) here is dominated
 *        by E_coll (GUE-conditional C_H per imp-486) and E_trunc (rigorous), while L_pt
 *        is fully unconditional (L_cond + E_trunc_pt at N* = 1e4). The ~2000x separation
 *        is the price of the C_mb GUE assumption -- if C_H were made unconditional the
 *        headline would collapse to ~6e-5, but that closure is NOT available.
 *
 * The punchline: assembling the full headline E(N) at the imp-3444 E_coll = E_trunc
 * crossover N ~ 3.28e9 gives a GUE-conditional slack Lambda <= E(N) ~ 6.13e-5 ~ 2 * E_trunc
 * (E_flow negligible), which is ~1975x below the unconditional finite-height beat
 * L_pt ~ 0.121 -- quantifying the conditionality headroom at the sigma-halving landmark.
 *
 * ASSESSMENT ONLY. C_mb remains GUE-conditional per imp-486. No positivity, no bridge
 * closure, no bound change, no RH claim, NO QED. No refereed bound is changed.
 *
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover bisection)
 * @see imp-3406-sigma-highN-extrapolation (N-shape, sigma-halving right arm)
 * @see finite-height-beats-platt-trudgian (L_pt ~ 0.121 unconditional finite-N beat)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3323/imp-3406/imp-3444 exactly
const L_PT = 0.121; // imp-452/imp-459 unconditional finite-height beat (< PT 0.2)

// EXACT imp-3444 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// Machine-precision crossing on the monotone-decreasing right arm above the imp-3406 peak.
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

// Re-pin the imp-3444 E_coll = E_trunc crossover by the identical bisection (N_max ~ 9.2186e5).
const N_MAX = 9.218632851e5;
const N_CROSS = crossingAbovePeak(N_MAX, (N) => parts(N).E_coll - E_TRUNC_PT); // ~3.280294e9
const P = parts(N_CROSS);

// Headline slack and the L_pt comparison.
const E_N_OVER_E_TRUNC = P.E_N / E_TRUNC_PT; // ~2.0019
const E_FLOW_OVER_E_TRUNC = P.E_flow / E_TRUNC_PT; // ~1.899e-3
const L_PT_OVER_E_N = L_PT / P.E_N; // ~1975

export const IMP34453_CROSSOVER_EN_HEADLINE_SLACK_VS_LPT = {
  id: 'imp-34453',
  proofSection: 'S-frontier',
  question:
    'At the imp-3444 E_coll = E_trunc crossover N ~ 3.28e9 (the sigma-halving landmark), assemble ' +
    'the full headline E(N) = E_trunc + E_flow + E_coll and report the Lambda <= E(N) headline slack ' +
    'there, then compare it against the unconditional finite-height beat L_pt ~ 0.121 (imp-452/imp-459). ' +
    'Reuses the identical imp-3444/imp-3406/imp-3220 sub-term formulas. Measurement only, C_mb remains ' +
    'GUE-conditional per imp-486, no bound change, NO QED.',
  crossoverHeadline: {
    N_cross: +N_CROSS.toExponential(9), // 3.280294352e9
    T0: +P.T0.toExponential(6), // 1.143785e9
    E_trunc: +E_TRUNC_PT.toExponential(6), // 3.060000e-5
    E_coll: +P.E_coll.toExponential(6), // 3.060000e-5 (== E_trunc by definition)
    E_flow: +P.E_flow.toExponential(6), // 5.811677e-8
    E_N: +P.E_N.toExponential(9), // 6.125811677e-5
    sigma: +P.sigma.toFixed(9), // 0.499525640
    note:
      'Headline GUE-conditional slack Lambda <= E(N) = 6.1258e-5 assembled at the imp-3444 ' +
      'E_coll = E_trunc crossover N ~ 3.280294e9, reproducing the imp-3444 landmark sigma ~ 0.49953 ' +
      'exactly (same sub-term formulas).',
  },
  twiceTruncFloor: {
    E_N_over_E_trunc: +E_N_OVER_E_TRUNC.toFixed(6), // 2.001899
    E_flow_over_E_trunc: +E_FLOW_OVER_E_TRUNC.toExponential(4), // 1.8992e-3
    note:
      'At the crossover the headline E(N) is, to 0.19%, exactly TWICE the truncation floor ' +
      '(E(N) / E_trunc = 2.0019), because E_coll = E_trunc there and E_flow has decayed to ~0.19% ' +
      'of E_trunc. The crossover is the structural point where the headline slack equals ' +
      '2 * E_trunc + (negligible E_flow).',
  },
  vsFiniteHeightBeat: {
    L_pt: L_PT, // 0.121 (imp-452/imp-459 unconditional finite-height beat)
    E_N_cross: +P.E_N.toExponential(6), // 6.125812e-5
    L_pt_over_E_N: +L_PT_OVER_E_N.toFixed(1), // 1975.2
    note:
      'The GUE-conditional headline slack Lambda <= E(N) ~ 6.13e-5 at the crossover sits a factor ' +
      '~1975 BELOW the unconditional finite-height beat L_pt ~ 0.121 (imp-452/imp-459). The ~2000x ' +
      'separation is a CONDITIONALITY gap: E(N) here is dominated by the GUE-conditional E_coll ' +
      '(C_H = 1/8, C_mb per imp-486) plus the rigorous E_trunc, while L_pt is fully unconditional. ' +
      'This is the headroom the C_H route claims over the standing rigorous certificate, NOT a bound.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Assembling the full headline E(N) = E_trunc + ' +
    'E_flow + E_coll at the imp-3444 E_coll = E_trunc crossover N ~ 3.280294e9 (the sigma-halving ' +
    'landmark) gives a GUE-conditional headline slack Lambda <= E(N) ~ 6.1258e-5, reproducing the ' +
    'imp-3444 landmark sigma ~ 0.49953 exactly. The headline is, to 0.19%, exactly TWICE the ' +
    'truncation floor (E(N) / E_trunc = 2.0019) because E_coll = E_trunc there and E_flow is ' +
    'negligible (E_flow / E_trunc ~ 1.9e-3). This slack sits a factor ~1975 BELOW the unconditional ' +
    'finite-height beat L_pt ~ 0.121 (imp-452/imp-459) -- a CONDITIONALITY gap, since E(N) is ' +
    'dominated by GUE-conditional E_coll (C_H = 1/8) while L_pt is fully unconditional. C_mb remains ' +
    'GUE-conditional per imp-486. No positivity, no bridge closure, no bound change, no RH claim, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-3444 (E_coll = E_trunc crossover bisection, N ~ 3.280294e9); imp-3406 (N-shape sigma(N) ' +
    'right arm); imp-3220 (U-shaped sigma(N) decade ladder); imp-452/imp-459 (L_pt ~ 0.121 ' +
    'unconditional finite-height beat); imp-486 (C_mb GUE-conditional); imp-2642 (C_H = 1/8 ansatz); ' +
    'imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP34453_CROSSOVER_EN_HEADLINE_SLACK_VS_LPT_ASSERTIONS = [
  {
    // Reuse gate: the crossover re-pins to the imp-3444 landmark N ~ 3.280294e9.
    id: 'imp34453-reproduces-imp3444-crossover',
    description: 'E_coll = E_trunc crossover re-pins to the imp-3444 landmark N ~ 3.280294e9',
    holds: () =>
      Math.abs(N_CROSS - 3.280294352e9) / 3.280294352e9 < 1e-6 &&
      Math.abs(parts(N_CROSS).E_coll - E_TRUNC_PT) / E_TRUNC_PT < 1e-6,
  },
  {
    // Landmark sigma reproduced: at the crossover sigma ~ 0.49953 (imp-3444 value).
    id: 'imp34453-reproduces-imp3444-sigma',
    description: 'sigma at the crossover reproduces the imp-3444 landmark ~ 0.49953',
    holds: () => Math.abs(P.sigma - 0.499525640) < 1e-6,
  },
  {
    // (F1): the headline E(N) is, to sub-percent, exactly twice the truncation floor.
    id: 'imp34453-headline-is-twice-etrunc',
    description: 'headline E(N) / E_trunc = 2.0019 (E_coll = E_trunc, E_flow negligible)',
    holds: () =>
      Math.abs(E_N_OVER_E_TRUNC - 2.001899) < 1e-4 &&
      E_FLOW_OVER_E_TRUNC < 5e-3 &&
      Math.abs(P.E_N - 6.125811677e-5) / 6.125811677e-5 < 1e-6,
  },
  {
    // (F2): the headline slack sits a factor ~1975 below the L_pt ~ 0.121 finite-height beat.
    id: 'imp34453-slack-vs-lpt-factor',
    description: 'L_pt / E(N_cross) ~ 1975 (headline ~2000x below the unconditional L_pt beat)',
    holds: () =>
      Math.abs(L_PT_OVER_E_N - 1975.2) < 1.0 &&
      P.E_N < L_PT &&
      L_PT_OVER_E_N > 1000,
  },
  {
    // Honesty gate: measurement only, GUE-conditional, no QED, no refereed bound is changed.
    id: 'imp34453-honesty-gate-no-qed',
    description: 'Measurement only: C_mb GUE-conditional, no bound change, no QED, no refereed bound is changed',
    holds: () =>
      IMP34453_CROSSOVER_EN_HEADLINE_SLACK_VS_LPT.isRigorous === false &&
      /GUE-conditional per imp-486/.test(IMP34453_CROSSOVER_EN_HEADLINE_SLACK_VS_LPT.verdict) &&
      /NO QED/.test(IMP34453_CROSSOVER_EN_HEADLINE_SLACK_VS_LPT.verdict) &&
      /refereed bound is changed/i.test(IMP34453_CROSSOVER_EN_HEADLINE_SLACK_VS_LPT.verdict),
  },
];

for (const a of IMP34453_CROSSOVER_EN_HEADLINE_SLACK_VS_LPT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34453-crossover-en-headline-slack-vs-lpt assertion failed: ${a.id}`);
  }
}
