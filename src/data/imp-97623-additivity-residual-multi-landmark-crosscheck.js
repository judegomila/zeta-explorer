/**
 * @module imp-97623-additivity-residual-multi-landmark-crosscheck
 *
 * imp-97623 (accuracy, frontier cross-check): imp-97603 reported that the diagonal (C_C/E_trunc = const)
 * elasticity of the imp-33582 sigma = 1/2 HALVING landmark equals the SUM of the two single-axis
 * elasticities (imp-97565 C_C, imp-97584 E_trunc) to 5 digits, with an additivity residual
 * DIAG - (E_CC + E_ET) ~ -2.9e-9 (rounded ~2e-8 in imp-97603). That residual was measured ONLY at
 * the halving crossover and at ONE perturbation step (eps = 1e-3), leaving open whether the additivity
 * is STRUCTURAL (holds at every sigma landmark) or a coincidence of the halving point. This module
 * re-runs the IDENTICAL central-difference procedure at a SECOND and THIRD landmark (imp-97520 L2
 * sigma = 0.9 below-0.9 crossing, and L4 sigma = 0.1 below-0.1 crossing) and at a SECOND perturbation
 * step (eps = 5e-4), and reports the residual per landmark per step. Measurement only; both ansatz
 * values (C_C 1/8, E_trunc 3.06e-5) perturbed only as probes; no bound moves; NO QED.
 *
 * THE MEASUREMENTS (the deliverable)
 * ----------------------------------
 * At each landmark sigma-level L the elasticities of the crossing N_L(C_C, E_trunc) are measured by
 * central differences in log-parameter space (identical procedure to imp-97603/imp-97565/imp-97584):
 *   E_CC = d ln N_L/d ln C_C, E_ET = d ln N_L/d ln E_trunc, DIAG = d ln N_L/d s along C_C/E_trunc = const.
 * The additivity residual is r = DIAG - (E_CC + E_ET).
 *
 *   LANDMARK          N_L            E_CC        E_ET        DIAG = E_CC+E_ET      r (eps=1e-3)   r (eps=5e-4)
 *   L2 below-0.9   2.572361e7     +2.555355   -2.303723   +2.516314e-1          -3.282e-7      -8.205e-8
 *   L3 halving     3.267235e9     +2.102347   -2.098348   +3.998880e-3          -2.856e-9      -7.105e-10
 *   L4 below-0.1   3.213181e11    +2.079025   -2.078951   +7.377778e-5          -5.684e-11     -1.421e-11
 *
 * THE DECISIVE STRUCTURE: r SCALES AS eps^2 AT EVERY LANDMARK
 * ----------------------------------------------------------
 * Halving the perturbation step from 1e-3 to 5e-4 QUARTERS the residual at all three landmarks
 * (ratios 4.00, 4.02, 4.00). That is the signature of the O(h^2) truncation error of the central-
 * difference scheme itself: the diagonal and the sum are each accurate to O(eps^2) and their leading
 * O(eps^2) tails differ, so DIAG - (E_CC + E_ET) = O(eps^2) -> 0 as eps -> 0. The TRUE (eps -> 0)
 * additivity residual is therefore ZERO at every landmark. The ~2e-8-scale number imp-97603 quoted at
 * the halving crossover is NOT a property of that crossover -- it is the finite-eps truncation of the
 * central difference, present identically (up to the eps^2 law) at sigma = 0.9 and sigma = 0.1 too.
 *
 * The residual magnitude also tracks the elasticity SUM: at fixed eps = 1e-3 the relative residual
 * r/DIAG is ~1.3e-6 (L2), ~7.1e-7 (L3), ~7.7e-7 (L4) -- i.e. ~ eps^2 in relative terms, uniformly
 * across a 4-order N span (2.6e7 -> 3.2e11). Additivity to first order is thus STRUCTURAL, holding
 * with the same relative truncation-limited precision at every landmark, not a halving-point artifact.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (A1) ADDITIVITY IS STRUCTURAL, NOT A HALVING COINCIDENCE. DIAG = E_CC + E_ET holds at all three
 *        landmarks (sigma = 0.9, 0.5, 0.1) with residual r bounded by the central-difference O(eps^2)
 *        truncation error, uniformly across the 2.6e7 -> 3.2e11 N span.
 *   (A2) THE RESIDUAL IS FINITE-DIFFERENCE TRUNCATION, NOT A REAL QUANTITY. Halving eps quarters r at
 *        every landmark (ratios ~4.0), so r = O(eps^2) -> 0; the true additivity residual is zero. The
 *        ~2e-8 quoted by imp-97603 is the eps = 1e-3 truncation tail, reproduced here at two other
 *        landmarks and one smaller step.
 *   (A3) THE ELASTICITIES STAY NEAR-CANCELLING BUT LESS SO OFF THE HALVING POINT. The single-axis
 *        magnitudes are largest and most UNequal at L2 (+2.5554 vs -2.3037, sum +0.2516) and tightest
 *        at L4 (+2.0790 vs -2.0790, sum +7.4e-5): the cancellation sharpens as sigma falls, but
 *        additivity of the two axes holds throughout.
 *
 * The punchline: the imp-97603 additivity of the two single-axis (C_C, E_trunc) elasticities is a
 * STRUCTURAL first-order identity holding at every sigma landmark; its measured residual is purely the
 * central-difference O(eps^2) truncation (it quarters when eps halves at all three landmarks), so the
 * ~2e-8 at the halving crossover is a step-size artifact, not a coincidence of that crossover.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) and the pinned E_trunc 3.06e-5 are
 * UNTOUCHED and are perturbed here only as sensitivity probes, not re-pinned; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97603-sigma-landmark-joint-cross-elasticity (the halving-crossover additivity residual ~2e-8)
 * @see imp-97565-crossover-cc-sensitivity-landmark-shift (C_C-axis elasticity of N_half ~ +2.10235)
 * @see imp-97584-sigma-landmark-etrunc-sensitivity (E_trunc-axis elasticity of N_half ~ -2.098)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (the four landmarks L1..L4 + crossing procedure)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33601/imp-33723 exactly

// EXACT imp-3406/imp-33582/imp-97603 sub-terms, with BOTH C_C and E_trunc carried as parameters
// (sensitivity probes only; the pinned values are untouched).
function parts(N, cc, et) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = cc * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const E_N = et + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N };
}

// General downslope crossing sigma = level, both parameters live (identical procedure to imp-97603).
function landmark(level, cc, et) {
  let a = Math.log(1e5);
  let b = Math.log(1e19);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), cc, et).sigma > level) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const lnN = (level, cc, et) => Math.log(landmark(level, cc, et));

// Full elasticity + additivity-residual measurement at a landmark sigma-level for a given step eps.
function measure(level, eps) {
  const at = (dCC, dEt) => lnN(level, C_C_PINNED * Math.exp(dCC), E_TRUNC_PT * Math.exp(dEt));
  const E_CC = (at(eps, 0) - at(-eps, 0)) / (2 * eps);
  const E_ET = (at(0, eps) - at(0, -eps)) / (2 * eps);
  const DIAG = (at(eps, eps) - at(-eps, -eps)) / (2 * eps); // diagonal move C_C/E_trunc = const
  const SUM = E_CC + E_ET;
  return { E_CC, E_ET, DIAG, SUM, resid: DIAG - SUM };
}

const LEVELS = [
  { key: 'L2_below_0p9', label: 'below-0.9', sigma: 0.9 },
  { key: 'L3_halving', label: 'halving', sigma: 0.5 },
  { key: 'L4_below_0p1', label: 'below-0.1', sigma: 0.1 },
];
const EPS1 = 1e-3; // reproduces imp-97603
const EPS2 = 5e-4; // second, halved perturbation step

const PER_LANDMARK = LEVELS.map(({ key, label, sigma }) => {
  const N_L = landmark(sigma, C_C_PINNED, E_TRUNC_PT);
  const m1 = measure(sigma, EPS1);
  const m2 = measure(sigma, EPS2);
  const ratio = m2.resid !== 0 ? m1.resid / m2.resid : NaN; // ~4 if resid ~ eps^2
  return {
    key,
    label,
    sigma,
    N_L: +N_L.toExponential(6),
    elasticity_CC: +m1.E_CC.toFixed(6),
    elasticity_Et: +m1.E_ET.toFixed(6),
    diagonal_elasticity: +m1.DIAG.toExponential(6),
    sum_single_axis: +m1.SUM.toExponential(6),
    additivity_residual_eps1e3: +m1.resid.toExponential(3),
    additivity_residual_eps5e4: +m2.resid.toExponential(3),
    residual_ratio_eps1e3_over_eps5e4: +ratio.toFixed(3), // ~4.0 => resid ~ eps^2
    rel_residual_eps1e3: +(m1.resid / m1.DIAG).toExponential(3),
  };
});

const RATIOS = PER_LANDMARK.map((r) => r.residual_ratio_eps1e3_over_eps5e4);

export const IMP97623_ADDITIVITY_RESIDUAL_MULTI_LANDMARK_CROSSCHECK = {
  id: 'imp-97623',
  proofSection: 'S-frontier',
  question:
    'Cross-check the imp-97603 additivity residual DIAG - (E_CC + E_ET) ~ 2e-8 (diagonal elasticity ' +
    'equals the sum of the two single-axis elasticities) -- measured only at the sigma = 1/2 halving ' +
    'crossover at one step eps = 1e-3 -- at a second and third sigma landmark (imp-97520 L2 sigma = 0.9, ' +
    'L4 sigma = 0.1) and at a second, halved perturbation step (eps = 5e-4), to confirm the additivity ' +
    'is STRUCTURAL rather than a halving-crossover coincidence. Measurement only; ansatz values perturbed ' +
    'only as probes; no bound moves; no QED.',
  method:
    'Identical central-difference elasticity procedure to imp-97603 (E_CC, E_ET single-axis; DIAG along ' +
    'C_C/E_trunc = const) applied at three landmarks (sigma = 0.9, 0.5, 0.1) and two steps (eps = 1e-3 ' +
    'reproducing imp-97603, eps = 5e-4 halved), reporting the additivity residual per landmark per step ' +
    'and its eps-scaling ratio.',
  steps_probed: { eps_primary: EPS1, eps_secondary: EPS2 },
  perLandmark: PER_LANDMARK,
  finding: {
    A1_additivity_structural_not_halving_coincidence:
      'DIAG = E_CC + E_ET holds at all three landmarks (sigma = 0.9, 0.5, 0.1), with residual bounded by ' +
      'the central-difference O(eps^2) truncation, uniformly across the 2.6e7 -> 3.2e11 N span: additivity ' +
      'is a structural first-order identity, not a coincidence of the halving crossover.',
    A2_residual_is_finite_difference_truncation:
      'Halving eps from 1e-3 to 5e-4 quarters the residual at every landmark (ratios ~4.0), so the residual ' +
      'is O(eps^2) -> 0: the true additivity residual is zero, and the ~2e-8 imp-97603 quoted at the halving ' +
      'point is the eps = 1e-3 central-difference truncation tail, reproduced at two other landmarks.',
    A3_cancellation_sharpens_as_sigma_falls:
      'The single-axis magnitudes are largest and most unequal at L2 (+2.5554 vs -2.3037, sum +0.2516) and ' +
      'tightest at L4 (+2.0790 vs -2.0790, sum +7.4e-5): the near-cancellation of the two axes sharpens as ' +
      'sigma falls, but their additive composition (DIAG = sum) holds throughout.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier cross-check, NOT rigorous). The imp-97603 additivity of the two single-axis ' +
    '(C_C, E_trunc) elasticities -- diagonal elasticity equals E_CC + E_ET -- is STRUCTURAL: it holds at ' +
    'the imp-97520 L2 (sigma = 0.9, N = 2.572361e7), L3 (halving, N = 3.267235e9) and L4 (sigma = 0.1, ' +
    'N = 3.213181e11) landmarks alike, uniformly across a 4-order N span. Its measured residual is purely ' +
    'the central-difference O(eps^2) truncation error: halving the step eps = 1e-3 -> 5e-4 quarters the ' +
    'residual at all three landmarks (ratios ~4.0), so the true (eps -> 0) additivity residual is ZERO and ' +
    'the ~2e-8 imp-97603 reported at the halving crossover is a step-size artifact, not a coincidence of ' +
    'that crossover. The single-axis near-cancellation sharpens as sigma falls (sum +0.2516 at L2 down to ' +
    '+7.4e-5 at L4), but additivity of the two axes holds throughout. Conditional-share diagnostic on the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643) and the pinned E_trunc 3.06e-5 are UNTOUCHED (perturbed ' +
    'only as probes, not re-pinned); changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-97603 (halving-crossover additivity residual ~2e-8); imp-97565 (C_C-axis elasticity); ' +
    'imp-97584 (E_trunc-axis elasticity); imp-97520 (four-landmark ladder L1..L4); ' +
    'imp-2642/imp-2643 (C_C 1/8 ansatz); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP97623_ADDITIVITY_RESIDUAL_MULTI_LANDMARK_CROSSCHECK_ASSERTIONS = [
  {
    // Landmarks reproduce the imp-97520 ladder positions (L2, L3, L4).
    id: 'imp97623-landmarks-reproduce-imp97520',
    description: 'L2 ~2.572361e7, L3 ~3.267235e9, L4 ~3.213181e11 reproduce imp-97520 to < 5e-3 relative',
    holds: () => {
      const [l2, l3, l4] = PER_LANDMARK;
      return (
        Math.abs(l2.N_L / 2.572361e7 - 1) < 5e-3 &&
        Math.abs(l3.N_L / 3.267235e9 - 1) < 5e-3 &&
        Math.abs(l4.N_L / 3.213181e11 - 1) < 5e-3
      );
    },
  },
  {
    // (A1): additivity DIAG = E_CC + E_ET holds at ALL three landmarks (residual small vs the sum).
    id: 'imp97623-additivity-holds-all-landmarks',
    description: 'DIAG equals E_CC + E_ET at all three landmarks: |resid|/|DIAG| < 1e-5 (eps=1e-3)',
    holds: () =>
      PER_LANDMARK.every(
        (r) => Math.abs(r.additivity_residual_eps1e3) < 1e-5 * Math.abs(r.diagonal_elasticity),
      ),
  },
  {
    // (A2): residual is O(eps^2) -- halving eps quarters it at every landmark (ratio ~4).
    id: 'imp97623-residual-scales-as-eps-squared',
    description: 'halving eps quarters the residual at every landmark (ratio in [3.5, 4.5]): O(eps^2) truncation',
    holds: () => RATIOS.every((q) => q > 3.5 && q < 4.5),
  },
  {
    // (A2): the halving-crossover residual reproduces the imp-97603 sign and scale at eps=1e-3.
    id: 'imp97623-reproduces-imp97603-halving-residual',
    description: 'L3 halving residual reproduces imp-97603 scale (< 1e-8 in magnitude) at eps=1e-3',
    holds: () => {
      const l3 = PER_LANDMARK.find((r) => r.key === 'L3_halving');
      return Math.abs(l3.additivity_residual_eps1e3) < 1e-8;
    },
  },
  {
    // (A3): single-axis cancellation sharpens as sigma falls (sum shrinks L2 -> L4), both signs preserved.
    id: 'imp97623-cancellation-sharpens-as-sigma-falls',
    description: 'sum |E_CC + E_ET| decreases L2 -> L3 -> L4; E_CC > 0 and E_ET < 0 at every landmark',
    holds: () => {
      const s = PER_LANDMARK.map((r) => Math.abs(r.sum_single_axis));
      return (
        s[0] > s[1] &&
        s[1] > s[2] &&
        PER_LANDMARK.every((r) => r.elasticity_CC > 0 && r.elasticity_Et < 0)
      );
    },
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp97623-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP97623_ADDITIVITY_RESIDUAL_MULTI_LANDMARK_CROSSCHECK.isRigorous === false &&
      /NO QED/.test(IMP97623_ADDITIVITY_RESIDUAL_MULTI_LANDMARK_CROSSCHECK.verdict) &&
      /refereed bound is changed/i.test(IMP97623_ADDITIVITY_RESIDUAL_MULTI_LANDMARK_CROSSCHECK.verdict),
  },
];

for (const a of IMP97623_ADDITIVITY_RESIDUAL_MULTI_LANDMARK_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97623-additivity-residual-multi-landmark-crosscheck assertion failed: ${a.id}`);
  }
}
