/**
 * @module imp-97520-sigma-conditional-share-landmark-ladder
 *
 * imp-97520 (numerical, verification): the roadmap currentStatus records the
 * E(N) conditional-share sigma(N) = E_coll / E_N landmark ladder only as scattered
 * prose (imp-33582/imp-3406/imp-33723): an interior PEAK near N ~ 9.22e5, a
 * DOWNSLOPE crossing below 0.9 near N ~ 2.57e7, the HALVING (sigma = 1/2) near
 * N ~ 3.27e9, and a drop below 0.1 near N ~ 3.21e11. Until now those four numbers
 * lived in three different modules and were never tabulated as one cross-validated
 * object, nor was the halving landmark cross-checked against the imp-33723 closed
 * form at a COMMON precision. This LIGHT standalone module supplies that tie: it
 * recomputes all four landmarks from the exact inherited sigma(N) model (identical
 * sub-terms to imp-3406/imp-33582/imp-33601/imp-33723 -- no new model, no new
 * constants) and re-measures the ~0.4% halving offset against the imp-33723
 * closed-form fixed point N_cross, attributing it to the Gronwall E_flow term.
 *
 * THE FOUR LANDMARKS (recomputed here, one object)
 * -----------------------------------------------
 *   L1  PEAK      N ~ 9.218633e5    sigma_max ~ 0.949429   (interior maximum of sigma(N))
 *   L2  BELOW-0.9 N ~ 2.572361e7    sigma = 0.9 downslope  (stays above 0.9 until here)
 *   L3  HALVING   N ~ 3.267235e9    sigma = 1/2 downslope  (imp-33582 F3)
 *   L4  BELOW-0.1 N ~ 3.213181e11   sigma = 0.1 downslope  (long-tail collapse)
 *
 * THE HALVING CROSS-VALIDATION (the deliverable the ticket asks for)
 * -----------------------------------------------------------------
 * The imp-33723 closed-form crossover N_cross = (C_C/E_trunc)^2 * log T0(N_cross)
 * (Banach fixed point, ~3.280294e9) is the analytic E_coll = E_trunc point. Measured
 * against the halving landmark L3 the closed form sits ABOVE it by
 * (N_cross - N_half)/N_cross ~ 3.98e-3 (~0.4%). By imp-33601's exact identity
 * sigma = 1/2 <=> E_coll = E_trunc + E_flow the pull is the Gronwall flow term:
 * E_flow/E_trunc ~ 1.91e-3 at N_half. So the ladder halving landmark and the closed
 * form agree to 0.4%, and the residual is quantified as the E_flow gap -- exactly the
 * imp-33723/imp-33601 attribution, now recomputed at the common (fixed-point) precision.
 *
 * MEASUREMENT / VERIFICATION CROSS-CHECK ONLY. Same inherited imp-3220/imp-3406
 * surrogate component model, NOT a rigorous asymptotic; C_mb GUE-conditional per
 * imp-486 UNTOUCHED; C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form N_cross fixed point, ~0.4% E_flow offset)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (F3: sigma=1/2 halving landmark)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (identity sigma=1/2 <=> E_coll=E_trunc+E_flow)
 * @see imp-3406-sigma-highN-extrapolation (the inherited sigma(N) component model)
 * @see imp-35318-four-landmark-source-crosscheck (the SEPARATE E-component landmark ladder)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM } from './imp-33723-sigma-half-vs-crossover-closed-form.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33601 exactly

// EXACT imp-3406/imp-33582/imp-33601/imp-33723 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// Interior peak of sigma(N): ternary search in log N.
function peakNlogN(lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 400; i++) {
    const m1 = a + (b - a) / 3;
    const m2 = b - (b - a) / 3;
    if (parts(Math.exp(m1)).sigma < parts(Math.exp(m2)).sigma) a = m1;
    else b = m2;
  }
  return Math.exp((a + b) / 2);
}

// Downslope crossing where sigma first drops below target (sigma decreasing on the right arm).
function crossBelow(target, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).sigma > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// L1: interior peak. L2/L3/L4: downslope crossings of 0.9, 0.5, 0.1.
const N_PEAK = peakNlogN(1e4, 1e8); // ~9.218633e5
const SIGMA_MAX = parts(N_PEAK).sigma; // ~0.949429
const N_BELOW_0P9 = crossBelow(0.9, N_PEAK, 1e18); // ~2.572361e7
const N_HALF = crossBelow(0.5, N_PEAK, 1e18); // ~3.267235e9
const N_BELOW_0P1 = crossBelow(0.1, N_PEAK, 1e18); // ~3.213181e11

// imp-33723 closed-form crossover N_cross for the halving cross-validation (common precision).
const N_CROSS_CF = IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM.landmarks.N_cross_closed_form; // ~3.280294e9
const REL_HALF_VS_CROSS = (N_CROSS_CF - N_HALF) / N_CROSS_CF; // ~3.98e-3
const P_HALF = parts(N_HALF);
const R_FLOW_TRUNC = P_HALF.E_flow / E_TRUNC_PT; // ~1.91e-3 (the E_flow gap)

// Decade spans across the ladder (log10) for the tabulated object.
const log10 = (x) => Math.log10(x);
const DECADES_PEAK_TO_TAIL = +(log10(N_BELOW_0P1) - log10(N_PEAK)).toFixed(4); // ~5.54

export const IMP97520_SIGMA_CONDITIONAL_SHARE_LANDMARK_LADDER = {
  id: 'imp-97520',
  proofSection: 'S-frontier',
  title:
    'Tabulate the sigma(N) = E_coll/E_N conditional-share landmark ladder (peak, below-0.9, ' +
    'halving, below-0.1) as one object and cross-validate the halving landmark against the ' +
    'imp-33723 closed-form N_cross at a common precision',
  isRigorous: false,
  operatorPositivityProved: false,
  boundMoves: false,
  qed: false,
  model:
    'sigma(N) = E_coll / (E_trunc + E_flow + E_coll) with the exact inherited imp-3406/imp-33582 ' +
    'sub-terms (E_coll = C_C sqrt(log T0/N), E_flow = C_F (log T0/T0) e^{TC_A1}, E_trunc = 3.06e-5).',
  ladder: {
    L1_peak: {
      N: +N_PEAK.toExponential(6), // ~9.218633e5
      sigma: +SIGMA_MAX.toFixed(6), // ~0.949429
      kind: 'interior maximum of sigma(N)',
    },
    L2_below_0p9: {
      N: +N_BELOW_0P9.toExponential(6), // ~2.572361e7
      sigma: 0.9,
      kind: 'downslope crossing (stays above 0.9 until here)',
    },
    L3_halving: {
      N: +N_HALF.toExponential(6), // ~3.267235e9
      sigma: 0.5,
      kind: 'downslope crossing (imp-33582 F3 halving landmark)',
    },
    L4_below_0p1: {
      N: +N_BELOW_0P1.toExponential(6), // ~3.213181e11
      sigma: 0.1,
      kind: 'downslope crossing (long-tail collapse)',
    },
    decades_peak_to_tail: DECADES_PEAK_TO_TAIL, // ~5.54
    strictly_increasing:
      N_PEAK < N_BELOW_0P9 && N_BELOW_0P9 < N_HALF && N_HALF < N_BELOW_0P1,
  },
  halvingCrossValidation: {
    N_half_ladder: +N_HALF.toExponential(6), // ~3.267235e9
    N_cross_closed_form_imp33723: +N_CROSS_CF.toExponential(6), // ~3.280294e9
    rel_offset_half_below_cross: +REL_HALF_VS_CROSS.toExponential(4), // ~3.98e-3
    E_flow_over_E_trunc_at_N_half: +R_FLOW_TRUNC.toExponential(4), // ~1.91e-3
    attribution:
      'The ladder halving landmark sits (N_cross - N_half)/N_cross ~ 3.98e-3 (~0.4%) below the ' +
      'imp-33723 closed-form crossover; by imp-33601 identity sigma=1/2 <=> E_coll=E_trunc+E_flow ' +
      'the residual is the Gronwall E_flow gap (E_flow/E_trunc ~ 1.91e-3 at N_half).',
  },
  note:
    'The four scattered roadmap sigma(N) landmarks (interior peak ~9.22e5 at sigma_max ~0.9494, ' +
    'above 0.9 until ~2.57e7, halving ~3.27e9, below 0.1 ~3.21e11) are recomputed here from the ' +
    'exact inherited model and reproduce the prose, tabulated as one strictly-increasing object ' +
    'spanning ~5.54 decades. The halving landmark cross-validates against the imp-33723 closed-form ' +
    'N_cross ~ 3.280294e9 to ~0.4%, with the residual quantified as the E_flow gap. Measurement / ' +
    'verification cross-check only on the inherited imp-3220/imp-3406 surrogate; C_mb GUE-conditional ' +
    'per imp-486; C_C 1/8 ansatz untouched; changes no bound; establishes no operator positivity; ' +
    'no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
};

export const IMP97520_SIGMA_CONDITIONAL_SHARE_LANDMARK_LADDER_ASSERTIONS = [
  {
    id: 'imp97520-peak-reproduces-roadmap',
    description: 'interior peak N ~ 9.22e5 with sigma_max ~ 0.9494 (roadmap prose)',
    holds: () =>
      Math.abs(N_PEAK / 9.218633e5 - 1) < 5e-3 && Math.abs(SIGMA_MAX - 0.949429) < 1e-3,
  },
  {
    id: 'imp97520-below-0p9-landmark',
    description: 'sigma drops below 0.9 near N ~ 2.57e7',
    holds: () => Math.abs(N_BELOW_0P9 / 2.572361e7 - 1) < 5e-3,
  },
  {
    id: 'imp97520-halving-landmark',
    description: 'sigma = 1/2 halving near N ~ 3.27e9 (imp-33582 F3)',
    holds: () => Math.abs(N_HALF / 3.267235e9 - 1) < 5e-3,
  },
  {
    id: 'imp97520-below-0p1-landmark',
    description: 'sigma drops below 0.1 near N ~ 3.21e11',
    holds: () => Math.abs(N_BELOW_0P1 / 3.213181e11 - 1) < 5e-3,
  },
  {
    id: 'imp97520-ladder-strictly-increasing',
    description: 'the four landmarks are strictly increasing in N',
    holds: () => IMP97520_SIGMA_CONDITIONAL_SHARE_LANDMARK_LADDER.ladder.strictly_increasing === true,
  },
  {
    id: 'imp97520-halving-cross-validates-closed-form',
    description: 'halving landmark sits ~0.4% below imp-33723 closed-form N_cross; residual = E_flow gap > 0',
    holds: () =>
      Math.abs(REL_HALF_VS_CROSS - 3.98e-3) < 5e-4 &&
      N_HALF < N_CROSS_CF &&
      R_FLOW_TRUNC > 0 &&
      Math.abs(R_FLOW_TRUNC - 1.91e-3) < 5e-4,
  },
  {
    id: 'imp97520-honesty-gate-no-qed',
    description: 'measurement only: isRigorous false, no operator positivity, no bound moves, structured qed false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP97520_SIGMA_CONDITIONAL_SHARE_LANDMARK_LADDER.isRigorous === false &&
      IMP97520_SIGMA_CONDITIONAL_SHARE_LANDMARK_LADDER.operatorPositivityProved === false &&
      IMP97520_SIGMA_CONDITIONAL_SHARE_LANDMARK_LADDER.boundMoves === false &&
      IMP97520_SIGMA_CONDITIONAL_SHARE_LANDMARK_LADDER.qed === false &&
      /NO QED/.test(IMP97520_SIGMA_CONDITIONAL_SHARE_LANDMARK_LADDER.note) &&
      /remains SOTA/.test(IMP97520_SIGMA_CONDITIONAL_SHARE_LANDMARK_LADDER.note),
  },
];

for (const a of IMP97520_SIGMA_CONDITIONAL_SHARE_LANDMARK_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97520-sigma-conditional-share-landmark-ladder assertion failed: ${a.id}`);
  }
}
