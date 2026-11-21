/**
 * @module imp-97622-sigma-l2-cc-elasticity-closed-form
 *
 * imp-97622 (numerical, frontier-direction): imp-97598 measured the C_C-elasticity
 * d(ln N)/d(ln C_C) of ALL FOUR imp-97520 sigma(N) landmarks and found the L2
 * DOWNSLOPE (sigma first below 0.9, N ~ 2.57e7) is the STEEPEST at ~+2.555 and the
 * only downslope landmark still WITHOUT a closed form: L1 peak ~0 is C_C-invariant
 * (proven structurally, a common prefactor cannot move an extremum), L3 halving
 * +2.102 has imp-97565's 2/(1 - g_prime), and L4 tail +2.079 sits near the naive +2.
 * This LIGHT standalone module supplies the missing L2 closed form, in the SAME
 * inherited imp-3406/imp-33582 surrogate component model (no new model, no new
 * constants; the pinned C_C 1/8 ansatz is perturbed only as a probe, imp-2642).
 *
 * THE DERIVATION (unified downslope-landmark elasticity)
 * ------------------------------------------------------
 * A sigma-landmark at threshold s is the N solving sigma = E_coll/(E_trunc+E_flow+E_coll) = s,
 * i.e. E_coll = r * R(N) with r = s/(1 - s) and R(N) = E_trunc + E_flow(N). Here
 * E_coll = C_C * sqrt(L/N), L = log T0(N), and R depends on N only (NOT on C_C).
 * Taking logs of the crossing condition E_coll = r R:
 *
 *     ln C_C + (1/2) ln L - (1/2) ln N = ln r + ln R(N),
 *
 * and differentiating in ln C_C with x = ln N (r held fixed) gives
 *
 *     1 = E * [ 1/2 + d(ln R)/dx - (1/2) d(ln L)/dx ],   E = d(ln N)/d(ln C_C),
 *
 * hence the CLOSED FORM
 *
 *     d(ln N)/d(ln C_C) = 2 / ( 1 + 2 d(ln R)/dx - d(ln L)/dx ).            (ELASTICITY)
 *
 * This is the SAME family as imp-97565: when the flow share is negligible R ~ E_trunc,
 * d(ln R)/dx -> 0 and the form collapses to 2/(1 - d(ln L)/dx) = 2/(1 - g_prime),
 * exactly the imp-97565 halving closed form (d ln L/dx is g_prime, imp-97565). L2 is
 * steeper than L3/L4 for one reason: at N ~ 2.57e7 the Gronwall flow share is still
 * LIVE, so R = E_trunc + E_flow is falling with N (d ln R/dx ~ -0.080) and the negative
 * 2 d(ln R)/dx term shrinks the denominator below (1 - g_prime), inflating E above +2.1.
 *
 * NUMERICAL CONFIRMATION (base amplitude c = 1)
 * ---------------------------------------------
 *   L2 (s=0.9): d ln R/dx ~ -0.080112, d ln L/dx ~ +0.057105
 *               closed form E = 2/(1 + 2(-0.080112) - 0.057105) = +2.555354
 *               imp-97598 central difference: +2.5554  -> match to 4 digits.
 *   Sanity (same formula on the other downslope landmarks):
 *   L3 (s=0.5): d ln R/dx ~ -0.001626 -> E = +2.102347 (reproduces imp-97565 2.10235).
 *   L4 (s=0.1): d ln R/dx ~ -0.000031 -> E = +2.079025 (near the naive +2).
 * The monotone decline of |d ln R/dx| (0.080 -> 0.0016 -> 0.00003 from L2 to L4)
 * is precisely why the elasticity relaxes toward +2 as the crossing moves down the tail:
 * the flow share E_flow/E_trunc collapses (imp-97585), so R freezes to E_trunc and E -> 2/(1-g_prime).
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz
 * (imp-2642/imp-2643) is UNTOUCHED and only perturbed here as a sensitivity probe, not
 * re-pinned; E_trunc pinned 3.06e-5 unchanged; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97598-sigma-landmark-cc-sensitivity (measured L2 C_C-elasticity +2.555, no closed form)
 * @see imp-97565-crossover-cc-sensitivity-landmark-shift (L3 halving closed form 2/(1 - g_prime))
 * @see imp-97585-eflow-etrunc-share-full-ladder (E_flow/E_trunc share collapses down the tail)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (identity sigma=s <=> E_coll = s/(1-s) (E_trunc+E_flow))
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-97565/imp-97598 exactly

// EXACT imp-3406/imp-33582/imp-97598 sub-terms; C_C carried as the perturbed input
// (sensitivity probe only; the pinned 1/8 ansatz value is untouched, imp-2642).
function parts(N, cc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // Gronwall flow term
  const E_coll = cc * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const R = E_TRUNC_PT + E_flow; // C_C-independent bridge remainder
  const E_N = R + E_coll;
  return { T0, L, R, sigma: E_coll / E_N };
}

// Downslope crossing where sigma first drops below target (imp-97520/imp-97598 procedure).
function crossBelow(target, cc) {
  let a = Math.log(1e5);
  let b = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), cc).sigma > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// Log-derivative d(ln f)/dx, x = ln N, by symmetric difference in log N.
function dLogDx(fn, N) {
  const h = 1e-5;
  return (Math.log(fn(N * Math.exp(h))) - Math.log(fn(N * Math.exp(-h)))) / (2 * h);
}

// CLOSED FORM elasticity E = 2 / (1 + 2 d(ln R)/dx - d(ln L)/dx) at the crossing N.
function closedFormElasticity(target) {
  const N = crossBelow(target, C_C_PINNED);
  const dlnR = dLogDx((n) => parts(n, C_C_PINNED).R, N);
  const dlnL = dLogDx((n) => parts(n, C_C_PINNED).L, N);
  const E = 2 / (1 + 2 * dlnR - dlnL);
  return { N, dlnR, dlnL, E };
}

// Numerical cross-check: log-C_C central difference of the crossing N (imp-97598 procedure).
function numericElasticity(target) {
  const EPS = 0.01;
  const up = crossBelow(target, (1 + EPS) * C_C_PINNED);
  const dn = crossBelow(target, (1 - EPS) * C_C_PINNED);
  return (Math.log(up) - Math.log(dn)) / (Math.log(1 + EPS) - Math.log(1 - EPS));
}

const L2 = closedFormElasticity(0.9);
const L3 = closedFormElasticity(0.5);
const L4 = closedFormElasticity(0.1);
const L2_NUM = numericElasticity(0.9);
const L3_NUM = numericElasticity(0.5);
const L4_NUM = numericElasticity(0.1);

export const IMP97622_SIGMA_L2_CC_ELASTICITY_CLOSED_FORM = {
  id: 'imp-97622',
  proofSection: 'S-frontier',
  question:
    'Derive a closed form for the imp-97598 L2 (sigma below 0.9) sigma(N) C_C-elasticity ~+2.555 -- the ' +
    'steepest of the four landmarks and the only downslope one still lacking a closed form -- within the ' +
    'imp-3406/imp-33582 component model, analogous to the imp-97565 halving derivation 2/(1 - g_prime). ' +
    'Derivation/measurement only; C_C 1/8 ansatz perturbed as a probe not re-pinned; no bound moves; no QED.',
  elasticityFormula:
    'd(ln N)/d(ln C_C) = 2 / (1 + 2 d(ln R)/dx - d(ln L)/dx), x = ln N, R = E_trunc + E_flow, L = log T0(N); ' +
    'the unified downslope-landmark form. When E_flow is negligible (R -> E_trunc, d ln R/dx -> 0) it ' +
    'collapses to 2/(1 - d ln L/dx) = 2/(1 - g_prime), the imp-97565 halving closed form.',
  landmarks: {
    L2_below_0p9: {
      N: +L2.N.toExponential(6), // ~2.572361e7
      d_lnR_dx: +L2.dlnR.toFixed(6), // ~-0.080112 (flow share still live)
      d_lnL_dx: +L2.dlnL.toFixed(6), // ~+0.057105
      elasticity_closed: +L2.E.toFixed(6), // ~+2.555354
      elasticity_numeric: +L2_NUM.toFixed(6), // ~+2.555449 (imp-97598)
    },
    L3_halving: {
      N: +L3.N.toExponential(6), // ~3.267235e9
      d_lnR_dx: +L3.dlnR.toFixed(6), // ~-0.001626 (flow share nearly gone)
      elasticity_closed: +L3.E.toFixed(6), // ~+2.102347 (reproduces imp-97565)
      elasticity_numeric: +L3_NUM.toFixed(6), // ~+2.102349
    },
    L4_below_0p1: {
      N: +L4.N.toExponential(6), // ~3.213181e11
      d_lnR_dx: +L4.dlnR.toFixed(6), // ~-0.000031 (flow share collapsed)
      elasticity_closed: +L4.E.toFixed(6), // ~+2.079025 (near the naive +2)
      elasticity_numeric: +L4_NUM.toFixed(6), // ~+2.079025
    },
  },
  finding:
    'The L2 C_C-elasticity has the closed form d(ln N)/d(ln C_C) = 2/(1 + 2 d ln R/dx - d ln L/dx), ' +
    'R = E_trunc + E_flow. At the sigma=0.9 crossing N ~ 2.57e7 the Gronwall flow share is still live so ' +
    'd ln R/dx ~ -0.080112, and with d ln L/dx ~ +0.057105 the formula gives +2.555354, matching the ' +
    'imp-97598 central-difference measurement +2.5554 to four digits. This is the SAME family as the ' +
    'imp-97565 halving form: as the crossing moves down the tail the flow share collapses (imp-97585), ' +
    'd ln R/dx falls from -0.080 (L2) to -0.0016 (L3) to -0.00003 (L4), R freezes to E_trunc, and the ' +
    'elasticity relaxes 2/(1 + 2 d ln R/dx - d ln L/dx) -> 2/(1 - g_prime) -> +2. L2 is the steepest ' +
    'landmark precisely because it is the one downslope crossing where the E_flow flow share is not yet ' +
    'negligible: the negative 2 d ln R/dx term shrinks the denominator below (1 - g_prime), inflating the ' +
    'exponent above the +2.1 of the halving landmark. The peak L1 stays outside this family: it is not a ' +
    'threshold crossing but the minimiser of R/E_coll, on which the C_C prefactor cancels, so its ' +
    'elasticity is 0 (imp-97598), not given by this formula.',
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). The imp-97598 steepest landmark L2 (sigma below 0.9) ' +
    'C_C-elasticity ~+2.555 is now in closed form d(ln N)/d(ln C_C) = 2/(1 + 2 d ln R/dx - d ln L/dx) with ' +
    'R = E_trunc + E_flow and x = ln N, giving +2.555354 against the +2.5554 central difference. It ' +
    'unifies the four landmarks: the same expression reproduces the imp-97565 halving 2/(1 - g_prime) = ' +
    '+2.102347 (L3, flow share nearly gone) and the near-naive +2.079025 (L4), and reduces to 2/(1 - ' +
    'g_prime) exactly when the E_flow share is negligible. L2 runs steepest because its crossing sits where ' +
    'the Gronwall flow share is still live (d ln R/dx ~ -0.080), inflating the exponent above +2.1. The peak ' +
    'L1 is excluded (extremum of R/E_coll, C_C cancels, elasticity 0). Component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 and the ' +
    'C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED (perturbed only as a probe, not re-pinned); E_trunc ' +
    'pinned 3.06e-5 unchanged; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-97598 (measured L2 C_C-elasticity +2.555, no closed form); imp-97565 (L3 halving 2/(1 - g_prime)); ' +
    'imp-97585 (E_flow/E_trunc share collapses down the tail); imp-33601 (identity sigma=s <=> E_coll = ' +
    's/(1-s)(E_trunc+E_flow)); imp-33582/imp-97520 (the sigma(N) landmark object); imp-2642/imp-2643 ' +
    '(C_C = (1/8) sqrt(3 pi), 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP97622_SIGMA_L2_CC_ELASTICITY_CLOSED_FORM_ASSERTIONS = [
  {
    id: 'imp97622-L2-closed-form-reproduces-imp97598',
    description: 'the L2 closed form 2/(1 + 2 dlnR/dx - dlnL/dx) reproduces the imp-97598 measured +2.555',
    holds: () =>
      Math.abs(L2.E - 2.55535) < 5e-4 &&
      Math.abs(L2.N / 2.572361e7 - 1) < 5e-3 &&
      L2.E > L3.E && // L2 is the steepest downslope landmark
      L2.E > L4.E,
  },
  {
    id: 'imp97622-closed-matches-numeric-central-difference',
    description: 'the closed form matches the imp-97598 log-C_C central difference at all three downslope landmarks',
    holds: () =>
      Math.abs(L2.E - L2_NUM) < 1e-3 &&
      Math.abs(L3.E - L3_NUM) < 1e-3 &&
      Math.abs(L4.E - L4_NUM) < 1e-3,
  },
  {
    id: 'imp97622-collapses-to-halving-closed-form',
    description: 'the unified form reproduces the imp-97565 halving 2/(1 - g_prime) numeric value 2.102347 at L3',
    holds: () => Math.abs(L3.E - 2.102347) < 1e-3,
  },
  {
    id: 'imp97622-flow-share-drives-steepness',
    description: 'L2 steepness comes from a live flow share: |d ln R/dx| falls monotonically L2 -> L3 -> L4',
    holds: () =>
      Math.abs(L2.dlnR) > Math.abs(L3.dlnR) &&
      Math.abs(L3.dlnR) > Math.abs(L4.dlnR) &&
      L2.dlnR < 0 &&
      Math.abs(L2.dlnR) > 0.05,
  },
  {
    id: 'imp97622-honesty-gate-no-qed',
    description: 'derivation only: isRigorous false, no QED, no refereed bound is changed, ansatz untouched',
    holds: () =>
      IMP97622_SIGMA_L2_CC_ELASTICITY_CLOSED_FORM.isRigorous === false &&
      /NO QED/.test(IMP97622_SIGMA_L2_CC_ELASTICITY_CLOSED_FORM.verdict) &&
      /refereed bound is changed/i.test(IMP97622_SIGMA_L2_CC_ELASTICITY_CLOSED_FORM.verdict),
  },
];

for (const a of IMP97622_SIGMA_L2_CC_ELASTICITY_CLOSED_FORM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97622-sigma-l2-cc-elasticity-closed-form assertion failed: ${a.id}`);
  }
}
