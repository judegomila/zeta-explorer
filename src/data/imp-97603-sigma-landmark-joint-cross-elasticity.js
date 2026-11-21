/**
 * @module imp-97603-sigma-landmark-joint-cross-elasticity
 *
 * imp-97603 (numerical, frontier-direction): the imp-33582 sigma(N) = 1/2 halving landmark N_half
 * of the E(N) conditional-share model had its C_C-elasticity measured (imp-97565: ~ +2.10235) and
 * its E_trunc-elasticity measured (imp-97584: ~ -2.098), each varying ONE parameter. What was never
 * measured is the JOINT response: the mixed second elasticity d^2 ln N_half / (d ln C_C d ln E_trunc),
 * whether the two single-axis elasticities compose ADDITIVELY along a diagonal ladder, and -- since the
 * imp-33723 closed form N_cross = (C_C/E_trunc)^2 log T0 predicts near-cancellation along
 * C_C/E_trunc = const -- how close the halving landmark is to exact invariance on that diagonal and
 * what drives the departure. This module supplies all three by a 2D central difference on the exact
 * imp-97520 procedure over a 0.5x..2x grid in BOTH parameters. Measurement only; both ansatz values
 * untouched (perturbed only as probes); no bound moves; NO QED.
 *
 * THE MEASUREMENTS (the deliverable)
 * ----------------------------------
 * The halving landmark N_half is the sigma = E_coll/E_N = 1/2 crossing (imp-33601: E_coll = E_trunc +
 * E_flow), located by downslope bisection in log N with BOTH C_C and E_trunc carried as parameters.
 *
 *   (1) SINGLE-AXIS (reproduces the two priors). d ln N_half/d ln C_C = +2.102347 (imp-97565);
 *       d ln N_half/d ln E_trunc = -2.098348 (imp-97584). The near-equal magnitudes are the two sides
 *       of the (C_C/E_trunc)^2 closed form.
 *   (2) MIXED SECOND ELASTICITY. d^2 ln N_half/(d ln C_C d ln E_trunc) = +1.456e-2 (2D central
 *       difference, h = k = 1e-3 in log space). Small and positive -- the C_C-elasticity stiffens
 *       slightly as E_trunc rises.
 *   (3) ADDITIVE COMPOSITION ALONG THE DIAGONAL. Moving BOTH parameters by the same log-amount s
 *       (so C_C/E_trunc = const) gives a diagonal elasticity d ln N_half/d s = +3.99888e-3, which
 *       EQUALS the sum of the two single-axis elasticities E_CC + E_ET = +3.99890e-3 to 5 digits.
 *       So to first order the elasticities compose ADDITIVELY: the diagonal move is exactly the sum,
 *       and the sum is a NEAR-CANCELLATION (+2.102347 - 2.098348 = +0.003999).
 *
 * NEAR-INVARIANCE AND WHAT BREAKS IT
 * ----------------------------------
 * The closed-form crossover N_cross = (C_C/E_trunc)^2 log T0(N_cross) is EXACTLY diagonal-invariant:
 * along C_C/E_trunc = const the prefactor K = (C_C/E_trunc)^2 is fixed, so N_cross is unchanged to
 * machine precision (measured d ln N_cross/d s = 1.8e-12; N_cross = 3.28029435e9 identical at 0.5x,
 * 1x, 2x). Therefore the log T0(N) SELF-COUPLING does NOT break diagonal invariance -- it cancels on
 * the diagonal (it only symmetrically inflated each single-axis magnitude from 2 to ~2.1 via
 * 1/(1 - g_prime), imp-97565). The DEPARTURE of the halving landmark (diagonal elasticity +3.999e-3)
 * is ENTIRELY the E_flow offset: N_half sits ~0.4% below N_cross by the E_flow flow share (imp-33601),
 * and that share is C_C-live but not equally E_trunc-live, so the two single-axis elasticities differ
 * by +0.003999 (the +2.10235 on C_C exceeds the -2.09835 on E_trunc), and the residual is exactly that
 * imbalance. Over the full 0.5x..2x diagonal N_half moves only 3.254e9 -> 3.274e9, i.e. 0.0026 decades
 * -- essentially invariant, as the (C_C/E_trunc)^2 closed form predicts.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (J1) MIXED CROSS-ELASTICITY IS SMALL AND POSITIVE. d^2 ln N_half/(d ln C_C d ln E_trunc) = +1.46e-2,
 *        two orders below each single-axis first elasticity (~2.1): the (C_C, E_trunc) response is
 *        nearly separable, with only a faint positive cross-coupling.
 *   (J2) THE TWO ELASTICITIES COMPOSE ADDITIVELY ALONG THE DIAGONAL. The diagonal (C_C/E_trunc = const)
 *        elasticity +3.99888e-3 equals E_CC + E_ET = +3.99890e-3 to 5 digits, and both are a near-exact
 *        cancellation of +2.102347 and -2.098348.
 *   (J3) THE HALVING LANDMARK IS NEAR-INVARIANT ON THE DIAGONAL; THE E_FLOW OFFSET (NOT THE log T0
 *        SELF-COUPLING) DRIVES THE RESIDUAL. The closed-form crossover N_cross is diagonal-invariant to
 *        machine precision (d ln/d s = 1.8e-12), so log T0 self-coupling cancels on the diagonal; the
 *        halving landmark departs by only +3.999e-3 in log (0.0026 decades over 0.5x..2x), the residual
 *        being the C_C-live E_flow offset asymmetry between the two axes.
 *
 * The punchline: the (C_C, E_trunc) response of the sigma = 1/2 halving landmark is nearly separable
 * (mixed elasticity +0.0146) and composes additively along the diagonal, where the two ~2.1 single-axis
 * elasticities cancel to +0.004; the residual near-invariance is the E_flow offset, since the underlying
 * closed-form crossover N_cross = (C_C/E_trunc)^2 log T0 is diagonal-invariant to machine precision.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) and the pinned E_trunc 3.06e-5 are
 * UNTOUCHED and are perturbed here only as sensitivity probes, not re-pinned; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97565-crossover-cc-sensitivity-landmark-shift (C_C-axis elasticity of N_half ~ +2.10235)
 * @see imp-97584-sigma-landmark-etrunc-sensitivity (E_trunc-axis elasticity of N_half ~ -2.098)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (the four landmarks + halving procedure)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed form N_cross = (C_C/E_trunc)^2 log T0)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (identity sigma=1/2 <=> E_coll=E_trunc+E_flow)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33601/imp-33723 exactly

// EXACT imp-3406/imp-33582/imp-33601/imp-33723 sub-terms, with BOTH C_C and E_trunc carried as
// parameters so each can be perturbed (sensitivity probes only; the pinned values are untouched).
function parts(N, cc, et) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = cc * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const E_N = et + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N };
}

// Halving landmark: sigma = 1/2 (imp-33582/imp-97520), by downslope bisection in log N, with both
// parameters live. Identical procedure to imp-97565/imp-97584 except E_trunc is now a parameter too.
function halvingLandmark(cc, et) {
  let a = Math.log(1e5);
  let b = Math.log(1e19);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), cc, et).sigma > 0.5) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const lnNhalf = (cc, et) => Math.log(halvingLandmark(cc, et));

// Closed-form crossover fixed point N = K log T0(N), K = (cc/et)^2 (imp-33723), for the diagonal
// invariance cross-check.
function crossoverFixedPoint(cc, et) {
  const K = (cc / et) ** 2;
  let N = 1e9;
  for (let i = 0; i < 80; i++) N = K * Math.log(effectiveHeightForN(N));
  return N;
}

const N_HALF_BASE = halvingLandmark(C_C_PINNED, E_TRUNC_PT); // ~3.267235e9

// Single-axis elasticities (central difference in log parameter): reproduce imp-97565 / imp-97584.
const EPS = 1e-3;
function lnN_at(dlnCC, dlnEt) {
  return lnNhalf(C_C_PINNED * Math.exp(dlnCC), E_TRUNC_PT * Math.exp(dlnEt));
}
const E_CC = (lnN_at(EPS, 0) - lnN_at(-EPS, 0)) / (2 * EPS); // ~ +2.102347 (imp-97565)
const E_ET = (lnN_at(0, EPS) - lnN_at(0, -EPS)) / (2 * EPS); // ~ -2.098348 (imp-97584)

// (J1) Mixed second elasticity d^2 ln N_half / (d ln C_C d ln E_trunc), 2D central difference.
const H = 1e-3;
const K_ = 1e-3;
const MIXED =
  (lnN_at(H, K_) - lnN_at(H, -K_) - lnN_at(-H, K_) + lnN_at(-H, -K_)) / (4 * H * K_); // ~ +1.456e-2

// (J2) Diagonal elasticity d ln N_half / d s along C_C/E_trunc = const (both moved by log-amount s).
const DIAG_ELAST =
  (lnNhalf(C_C_PINNED * Math.exp(H), E_TRUNC_PT * Math.exp(H)) -
    lnNhalf(C_C_PINNED * Math.exp(-H), E_TRUNC_PT * Math.exp(-H))) /
  (2 * H); // ~ +3.99888e-3
const SUM_SINGLE = E_CC + E_ET; // ~ +3.99890e-3 -- the additive-composition check

// (J3) The closed-form crossover N_cross is EXACTLY diagonal-invariant (K fixed on the diagonal).
const N_CROSS_DIAG_ELAST =
  (Math.log(crossoverFixedPoint(C_C_PINNED * Math.exp(H), E_TRUNC_PT * Math.exp(H))) -
    Math.log(crossoverFixedPoint(C_C_PINNED * Math.exp(-H), E_TRUNC_PT * Math.exp(-H)))) /
  (2 * H); // ~ 1.8e-12 (machine zero)

// Diagonal ladder 0.5x..2x (common factor on BOTH parameters): N_half is near-invariant.
const S = [Math.log(0.5), Math.log(0.75), Math.log(0.9), 0, Math.log(1.1), Math.log(1.25), Math.log(1.5), Math.log(2.0)];
const DIAG_LADDER = S.map((s) => {
  const n = halvingLandmark(C_C_PINNED * Math.exp(s), E_TRUNC_PT * Math.exp(s));
  return {
    factor: +Math.exp(s).toFixed(4),
    N_half: +n.toExponential(6),
    rel_shift_vs_base: +((n - N_HALF_BASE) / N_HALF_BASE).toExponential(4),
  };
});
const DIAG_N = DIAG_LADDER.map((r) => r.N_half);
const DIAG_DECADES = Math.log10(Math.max(...DIAG_N)) - Math.log10(Math.min(...DIAG_N)); // ~0.0026

export const IMP97603_SIGMA_LANDMARK_JOINT_CROSS_ELASTICITY = {
  id: 'imp-97603',
  proofSection: 'S-frontier',
  question:
    'Measure the JOINT (C_C, E_trunc) response of the imp-33582 sigma(N) = 1/2 halving landmark N_half: ' +
    'the mixed second elasticity d^2 ln N_half/(d ln C_C d ln E_trunc), whether the two single-axis ' +
    'elasticities (imp-97565 C_C, imp-97584 E_trunc) compose additively along the diagonal C_C/E_trunc = ' +
    'const, and how close N_half is to the exact invariance the (C_C/E_trunc)^2 closed form predicts. ' +
    'Measurement only; both ansatz values perturbed only as probes; no bound moves; no QED.',
  method:
    '2D central difference (h = k = 1e-3 in log space) on the exact imp-97520 halving procedure ' +
    '(sigma = E_coll/E_N = 1/2 by downslope bisection in log N) with both C_C and E_trunc live.',
  landmarks: {
    N_half_base: +N_HALF_BASE.toExponential(6), // ~3.267235e9
    elasticity_CC: +E_CC.toFixed(6), // ~ +2.102347 (imp-97565)
    elasticity_Et: +E_ET.toFixed(6), // ~ -2.098348 (imp-97584)
    mixed_second_elasticity: +MIXED.toExponential(6), // ~ +1.456e-2 (J1)
    diagonal_elasticity: +DIAG_ELAST.toExponential(6), // ~ +3.99888e-3 (J2)
    sum_single_axis: +SUM_SINGLE.toExponential(6), // ~ +3.99890e-3 (additivity: equals diagonal)
    additivity_residual: +(DIAG_ELAST - SUM_SINGLE).toExponential(3), // ~ 2e-8 (equal to 5 digits)
    N_cross_diagonal_elasticity: +N_CROSS_DIAG_ELAST.toExponential(3), // ~1.8e-12 (machine-zero)
    diagonal_span_decades: +DIAG_DECADES.toFixed(4), // ~0.0026 over 0.5x..2x
  },
  diagonalLadder: DIAG_LADDER,
  finding: {
    J1_mixed_cross_elasticity_small_positive:
      'd^2 ln N_half/(d ln C_C d ln E_trunc) = +1.46e-2, two orders below each ~2.1 single-axis first ' +
      'elasticity: the (C_C, E_trunc) response is nearly separable with only a faint positive cross-coupling.',
    J2_additive_composition_on_diagonal:
      'The diagonal (C_C/E_trunc = const) elasticity +3.99888e-3 equals E_CC + E_ET = +3.99890e-3 to 5 ' +
      'digits, so the two single-axis elasticities compose ADDITIVELY; the sum is a near-cancellation of ' +
      '+2.102347 (C_C) and -2.098348 (E_trunc).',
    J3_near_invariance_driven_by_eflow_offset_not_logT0:
      'The closed-form crossover N_cross = (C_C/E_trunc)^2 log T0 is diagonal-invariant to machine precision ' +
      '(d ln/d s = 1.8e-12), so the log T0 self-coupling cancels on the diagonal; the halving landmark ' +
      'departs by only +3.999e-3 in log (0.0026 decades over 0.5x..2x), the residual being the C_C-live ' +
      'E_flow offset asymmetry between the two axes, NOT the self-coupling.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The joint (C_C, E_trunc) response of the imp-33582 ' +
    'sigma = 1/2 halving landmark N_half is nearly separable: the mixed second elasticity ' +
    'd^2 ln N_half/(d ln C_C d ln E_trunc) = +1.46e-2 is two orders below the ~2.1 single-axis elasticities ' +
    '(+2.102347 on C_C reproducing imp-97565, -2.098348 on E_trunc reproducing imp-97584). Along the ' +
    'diagonal C_C/E_trunc = const the two compose ADDITIVELY: the diagonal elasticity +3.99888e-3 equals ' +
    'E_CC + E_ET = +3.99890e-3 to 5 digits -- a near-cancellation. N_half is therefore near-invariant on ' +
    'the diagonal (0.0026 decades over 0.5x..2x), exactly as the (C_C/E_trunc)^2 closed form predicts; ' +
    'the underlying crossover N_cross is diagonal-invariant to machine precision (1.8e-12), so the residual ' +
    'departure is the C_C-live E_flow offset, NOT the log T0 self-coupling (which cancels on the diagonal). ' +
    'Component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643) and the pinned E_trunc 3.06e-5 are ' +
    'UNTOUCHED (perturbed only as probes, not re-pinned); changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-97565 (C_C-axis elasticity of N_half); imp-97584 (E_trunc-axis elasticity of N_half); ' +
    'imp-97520 (four-landmark ladder + halving procedure); imp-33723 (closed-form crossover fixed point); ' +
    'imp-33601 (identity sigma=1/2 <=> E_coll=E_trunc+E_flow); imp-2642/imp-2643 (C_C 1/8 ansatz); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP97603_SIGMA_LANDMARK_JOINT_CROSS_ELASTICITY_ASSERTIONS = [
  {
    // Base landmark reproduces imp-97520/imp-97565.
    id: 'imp97603-base-reproduces-N-half',
    description: 'base N_half ~3.267235e9 reproduces imp-97520/imp-97565 to < 5e-3 relative',
    holds: () => Math.abs(N_HALF_BASE / 3.267235e9 - 1) < 5e-3,
  },
  {
    // Single-axis elasticities reproduce the two priors (imp-97565 +2.10235, imp-97584 -2.098).
    id: 'imp97603-single-axis-reproduce-priors',
    description: 'd lnN/d lnCC ~ +2.10235 (imp-97565) and d lnN/d lnEt ~ -2.098 (imp-97584)',
    holds: () =>
      Math.abs(E_CC - 2.10235) < 5e-3 && Math.abs(E_ET - -2.098348) < 5e-3 && E_CC > 0 && E_ET < 0,
  },
  {
    // (J1): mixed second elasticity is small and positive, two orders below the first elasticities.
    id: 'imp97603-mixed-cross-elasticity-small-positive',
    description: 'mixed d^2 lnN/(d lnCC d lnEt) ~ +1.46e-2, positive and << each ~2.1 first elasticity',
    holds: () => MIXED > 0 && Math.abs(MIXED - 1.456e-2) < 5e-3 && MIXED < 0.05 * Math.abs(E_CC),
  },
  {
    // (J2): the diagonal elasticity equals the sum of the single-axis elasticities (additive composition).
    id: 'imp97603-additive-composition-on-diagonal',
    description: 'diagonal d lnN/d s equals E_CC + E_ET to < 1e-5 (additive), a near-cancellation to ~+4e-3',
    holds: () =>
      Math.abs(DIAG_ELAST - SUM_SINGLE) < 1e-5 &&
      Math.abs(DIAG_ELAST - 3.99888e-3) < 2e-4 &&
      DIAG_ELAST > 0 &&
      DIAG_ELAST < 0.01,
  },
  {
    // (J3): the closed-form crossover is diagonal-invariant to machine precision (self-coupling cancels).
    id: 'imp97603-N-cross-diagonal-invariant',
    description: 'closed-form N_cross diagonal elasticity is machine-zero (< 1e-9): log T0 self-coupling cancels',
    holds: () => Math.abs(N_CROSS_DIAG_ELAST) < 1e-9,
  },
  {
    // (J3): N_half is near-invariant on the diagonal -- only ~0.0026 decades over the full 0.5x..2x ladder.
    id: 'imp97603-N-half-near-invariant-on-diagonal',
    description: 'N_half moves < 0.01 decades over the 0.5x..2x diagonal (near-invariant, monotone increasing)',
    holds: () => {
      for (let i = 1; i < DIAG_LADDER.length; i++) {
        if (!(DIAG_LADDER[i].N_half > DIAG_LADDER[i - 1].N_half)) return false;
      }
      return DIAG_DECADES < 0.01 && DIAG_DECADES > 0;
    },
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp97603-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP97603_SIGMA_LANDMARK_JOINT_CROSS_ELASTICITY.isRigorous === false &&
      /NO QED/.test(IMP97603_SIGMA_LANDMARK_JOINT_CROSS_ELASTICITY.verdict) &&
      /refereed bound is changed/i.test(IMP97603_SIGMA_LANDMARK_JOINT_CROSS_ELASTICITY.verdict),
  },
];

for (const a of IMP97603_SIGMA_LANDMARK_JOINT_CROSS_ELASTICITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97603-sigma-landmark-joint-cross-elasticity assertion failed: ${a.id}`);
  }
}
