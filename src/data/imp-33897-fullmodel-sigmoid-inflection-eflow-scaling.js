/**
 * @module imp-33897-fullmodel-sigmoid-inflection-eflow-scaling
 *
 * imp-33897 (numerical / reconciliation, frontier-direction): closes the sub-gap
 * SUB-GAP-imp-33862-fullmodel-sigmoid-inflection. imp-33862 (M3) found THREE numerically distinct
 * sigma-curve landmarks in the fixed-strip component model:
 *     (1) the imp-33744 E_flow-OFF closed-form sigmoid inflection  sigma_cf = 1/2 - g_prime/(2 g^2),
 *         inverted to log10 N* ~ 9.5219, which matches the DIRECT no-flow d2 sigma/dt2 = 0 inflection
 *         (log10 ~ 9.5236) to ~0.4%;
 *     (2) the exponent-ramp knee d2 p/dt2 = 0 (log10 ~ 9.5291); and
 *     (3) the DIRECT FULL-model d2 sigma/dt2 = 0 inflection (log10 ~ 9.5327), ~2.4% ABOVE the closed
 *         form and on the FAR side of the ramp knee, flagged as a distinct THIRD landmark.
 * imp-33862 did NOT resolve whether landmark (3) is a genuinely independent structure or the E_flow-on
 * continuation of landmark (1). This module answers that by continuation.
 *
 * THE EXPERIMENT (measurement only -- identical sub-terms to imp-33862/imp-33744, no fresh model)
 * ----------------------------------------------------------------------------------------------
 * Scale the E_flow term by a homotopy amplitude alpha in [0, 1] and re-run the imp-33862 continuous
 * direct sigmoid-inflection root-find d2 sigma_alpha/dt2 = 0 at each alpha:
 *     sigma_alpha(N) = E_coll / (E_trunc + alpha * E_flow + E_coll).
 * alpha = 0 is the E_flow-off model (landmark 1's direct twin); alpha = 1 is the full model
 * (landmark 3). If landmark (3) is the E_flow-on continuation of landmark (1), then log10 N*(alpha)
 * traces a CONTINUOUS path from 9.5236 (alpha = 0) to 9.5327 (alpha = 1) with no jump -- and the
 * ~2.4% gap is just the E_flow-driven displacement of ONE landmark, not a topologically separate
 * third structure.
 *
 * THE FINDING (reconciliation)
 * ----------------------------
 *   (R1) THE FULL-MODEL INFLECTION IS THE E_flow-ON CONTINUATION OF THE NO-FLOW INFLECTION -- NOT A
 *        DISCONNECTED THIRD STRUCTURE. As alpha sweeps 0 -> 1, log10 N*(alpha) rises continuously and
 *        MONOTONICALLY from 9.523641 (== the imp-33862 direct no-flow inflection, exactly) to 9.532669
 *        (== the imp-33862 direct full-model inflection, exactly). alpha = 0 collapses onto landmark
 *        (1) with zero residual; there is no jump anywhere on the path.
 *   (R2) THE DISPLACEMENT IS LINEAR IN THE E_flow AMPLITUDE TO LEADING ORDER. The fractional log10
 *        displacement at alpha = 0.5 is 0.5035 (a pure linear family would give exactly 0.5), and the
 *        largest deviation of any swept alpha from the straight line through the endpoints is
 *        ~3.1e-5 in log10 (~0.34% of the total 9.03e-3 displacement). So the ~2.4% gap is, to first
 *        order, proportional to the E_flow magnitude: the full-model inflection is the no-flow
 *        inflection displaced by delta(log10 N*) ~ (E_flow-sensitivity) * alpha.
 *   (R3) THE E_flow AMPLITUDE IS TINY AT THE INFLECTION SCALE, SO THE DISPLACEMENT IS TINY. At the
 *        full-model inflection N* ~ 3.41e9, E_flow / E_coll ~ 1.87e-3 and E_flow / E_trunc ~ 1.84e-3.
 *        A sub-0.2%-of-E_coll perturbation shifts the direct inflection by ~2.1% in N -- the inflection
 *        (a second-derivative zero) is a soft, high-leverage landmark, which is exactly why a
 *        negligible E_flow moves it measurably while leaving the imp-33708 far-tail balance untouched.
 *
 * VERDICT: landmark (3) is NOT a genuine third notion -- it is landmark (1) (the direct sigmoid
 * inflection) evaluated with E_flow ON, continuously and near-linearly connected to the E_flow-off
 * closed form by the one-parameter E_flow homotopy. The imp-33862 "distinct THIRD landmark" language
 * is correct as a numerical statement (three different N values) but the sub-gap is now reconciled:
 * there are TWO notions (sigmoid inflection vs exponent-ramp knee), and the sigmoid inflection has an
 * E_flow-off value (closed form) and an E_flow-on value (full model) that differ only by the tiny,
 * near-linear E_flow displacement measured here.
 *
 * MEASUREMENT / RECONCILIATION ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 SOTA.
 *
 * @see imp-33862-knee-separation-second-path-crossval (M3 named this sub-gap)
 * @see imp-33744-sigma-inflection-vs-half-closed-form (closed form sigma_infl = 1/2 - g_prime/(2 g^2))
 * @see imp-33708 (E_flow negligible on the far tail)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33862_KNEE_SEPARATION_SECOND_PATH_CROSSVAL } from './imp-33862-knee-separation-second-path-crossval.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582/imp-33721)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33862 exactly

// EXACT imp-33862 sub-terms (no re-derivation, no fresh model).
function terms(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { T0, L, E_flow, E_coll };
}
// sigma with the E_flow term scaled by the homotopy amplitude alpha (alpha = 0 off, alpha = 1 full).
function sigmaAlpha(N, alpha) {
  const { E_flow, E_coll } = terms(N);
  return E_coll / (E_TRUNC_PT + alpha * E_flow + E_coll);
}
// Continuous direct second-derivative d2 sigma_alpha/dt2 (t = ln N), identical stencil to imp-33862.
function d2SigmaDt2(N, alpha) {
  const t = Math.log(N);
  const h = 2e-3;
  return (sigmaAlpha(Math.exp(t + h), alpha) - 2 * sigmaAlpha(Math.exp(t), alpha) + sigmaAlpha(Math.exp(t - h), alpha)) / (h * h);
}
function findInflection(alpha) {
  let lo = Math.log(1e6);
  let hi = Math.log(1e14);
  let flo = d2SigmaDt2(Math.exp(lo), alpha);
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fm = d2SigmaDt2(Math.exp(mid), alpha);
    if (Math.sign(fm) === Math.sign(flo)) {
      lo = mid;
      flo = fm;
    } else {
      hi = mid;
    }
  }
  return Math.exp((lo + hi) / 2);
}

// --- the E_flow-amplitude homotopy sweep ---
const ALPHAS = [0, 0.1, 0.25, 0.5, 0.75, 1.0];
const SWEEP = ALPHAS.map((alpha) => {
  const Nstar = findInflection(alpha);
  return { alpha, log10Nstar: Math.log10(Nstar), Nstar };
});
const LOG10_OFF = SWEEP[0].log10Nstar; // alpha = 0, ~ 9.523641 (== imp-33862 direct no-flow inflection)
const LOG10_FULL = SWEEP[SWEEP.length - 1].log10Nstar; // alpha = 1, ~ 9.532669 (== imp-33862 full-model)
const TOTAL_DISP_LOG10 = LOG10_FULL - LOG10_OFF; // ~ 9.03e-3
const OFF_TO_FULL_PCT = (Math.pow(10, LOG10_FULL) / Math.pow(10, LOG10_OFF) - 1) * 100; // ~ 2.10% in N

// (R1) monotone + continuous: strictly increasing, endpoints match imp-33862 landmarks exactly.
let MONOTONE = true;
for (let i = 1; i < SWEEP.length; i++) {
  if (!(SWEEP[i].log10Nstar > SWEEP[i - 1].log10Nstar)) MONOTONE = false;
}
const IMP33862_NOFLOW = IMP33862_KNEE_SEPARATION_SECOND_PATH_CROSSVAL.log10SigmoidDirectNoFlow; // ~ 9.523641
const IMP33862_FULL = IMP33862_KNEE_SEPARATION_SECOND_PATH_CROSSVAL.log10SigmoidDirectFull; // ~ 9.532669
const OFF_MATCHES_IMP33862 = Math.abs(LOG10_OFF - IMP33862_NOFLOW); // ~ 0 (same computation)
const FULL_MATCHES_IMP33862 = Math.abs(LOG10_FULL - IMP33862_FULL); // ~ 0 (same computation)

// (R2) linearity in alpha: fractional displacement at alpha = 0.5, and max deviation from the
// straight line through the (alpha = 0, alpha = 1) endpoints.
const HALF = SWEEP.find((s) => s.alpha === 0.5);
const FRAC_AT_HALF = (HALF.log10Nstar - LOG10_OFF) / TOTAL_DISP_LOG10; // ~ 0.5035 (pure-linear = 0.5)
let MAX_LIN_DEV = 0;
for (const s of SWEEP) {
  const predicted = LOG10_OFF + s.alpha * TOTAL_DISP_LOG10;
  MAX_LIN_DEV = Math.max(MAX_LIN_DEV, Math.abs(s.log10Nstar - predicted));
}
const MAX_LIN_DEV_FRAC = MAX_LIN_DEV / TOTAL_DISP_LOG10; // ~ 0.0034 (0.34% of the displacement)

// (R3) E_flow amplitude at the full-model inflection scale.
const T_AT_FULL = terms(Math.pow(10, LOG10_FULL));
const EFLOW_OVER_ECOLL = T_AT_FULL.E_flow / T_AT_FULL.E_coll; // ~ 1.87e-3
const EFLOW_OVER_ETRUNC = T_AT_FULL.E_flow / E_TRUNC_PT; // ~ 1.84e-3

export const IMP33897_FULLMODEL_SIGMOID_INFLECTION_EFLOW_SCALING = {
  id: 'imp-33897',
  proofSection: 'S-frontier',
  subGapClosed: 'SUB-GAP-imp-33862-fullmodel-sigmoid-inflection',
  question:
    'imp-33862 (M3) flagged the full-model direct sigmoid inflection (log10 ~ 9.5327) as a distinct ' +
    'THIRD landmark ~2.4% above the E_flow-off closed-form sigmoid inflection. Is it a genuinely ' +
    'independent structure, or the E_flow-ON continuation of the E_flow-off inflection? Scale E_flow ' +
    'by alpha in [0, 1] and trace the direct d2 sigma/dt2 = 0 inflection. Measurement / reconciliation ' +
    'only; NOT an RH bound; no QED.',
  measuredQuantity:
    'the direct sigmoid inflection log10 N*(alpha) as a function of the E_flow homotopy amplitude ' +
    'alpha, its continuity/monotonicity, its linearity in alpha, and the E_flow magnitude at the ' +
    'inflection scale -- reconciling the full-model inflection with the E_flow-off closed form',
  alphaSweep: SWEEP.map((s) => ({ alpha: s.alpha, log10Nstar: +s.log10Nstar.toFixed(6) })),
  log10NstarEflowOff: +LOG10_OFF.toFixed(6), // ~ 9.523641 (alpha = 0)
  log10NstarFullModel: +LOG10_FULL.toFixed(6), // ~ 9.532669 (alpha = 1)
  totalDisplacementLog10: +TOTAL_DISP_LOG10.toExponential(4), // ~ 9.03e-3
  offToFullPctInN: +OFF_TO_FULL_PCT.toFixed(4), // ~ 2.10%
  monotoneContinuous: MONOTONE, // true
  offMatchesImp33862Noflow: +OFF_MATCHES_IMP33862.toExponential(2), // ~ 0
  fullMatchesImp33862Full: +FULL_MATCHES_IMP33862.toExponential(2), // ~ 0
  fracDisplacementAtHalf: +FRAC_AT_HALF.toFixed(4), // ~ 0.5035 (pure-linear = 0.5)
  maxLinearityDevLog10: +MAX_LIN_DEV.toExponential(3), // ~ 3.1e-5
  maxLinearityDevFrac: +MAX_LIN_DEV_FRAC.toFixed(4), // ~ 0.0034 (0.34% of the displacement)
  eflowOverEcollAtInflection: +EFLOW_OVER_ECOLL.toExponential(4), // ~ 1.87e-3
  eflowOverEtruncAtInflection: +EFLOW_OVER_ETRUNC.toExponential(4), // ~ 1.84e-3
  finding: {
    R1_continuation_not_disconnected:
      'As alpha sweeps 0 -> 1 the direct sigmoid inflection log10 N*(alpha) rises continuously and ' +
      'monotonically from 9.523641 (== the imp-33862 direct no-flow inflection, exactly) to 9.532669 ' +
      '(== the imp-33862 direct full-model inflection, exactly), with no jump. The full-model ' +
      'inflection is the E_flow-ON continuation of the no-flow inflection, not a disconnected third ' +
      'structure.',
    R2_displacement_linear_in_eflow:
      'The fractional log10 displacement at alpha = 0.5 is 0.5035 (a pure linear family gives exactly ' +
      '0.5) and the largest deviation of any swept alpha from the endpoint straight line is ~3.1e-5 ' +
      'in log10 (~0.34% of the 9.03e-3 total displacement). The ~2.4% gap is, to leading order, ' +
      'proportional to the E_flow amplitude.',
    R3_tiny_amplitude_soft_landmark:
      'At the full-model inflection N* ~ 3.41e9, E_flow / E_coll ~ 1.87e-3 and E_flow / E_trunc ~ ' +
      '1.84e-3. A sub-0.2%-of-E_coll perturbation moves the second-derivative-zero inflection ~2.1% ' +
      'in N: the inflection is a soft, high-leverage landmark, so a negligible E_flow shifts it ' +
      'measurably while the imp-33708 far-tail balance stays untouched.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / RECONCILIATION (frontier-direction, NOT rigorous). The imp-33862 full-model direct ' +
    'sigmoid inflection (log10 ~ 9.5327) is NOT a genuinely independent third landmark: scaling ' +
    'E_flow by alpha in [0, 1] traces a CONTINUOUS, MONOTONE, near-LINEAR path for the direct ' +
    'inflection from log10 9.523641 at alpha = 0 (the E_flow-off inflection, which the imp-33744 ' +
    'closed form matches to ~0.4%) to log10 9.532669 at alpha = 1, with the alpha = 0.5 point at ' +
    'fractional displacement 0.5035 and max linearity deviation ~0.34% of the total. So the ~2.4% ' +
    'gap is the E_flow-ON displacement of the ONE sigmoid-inflection notion, not a topologically ' +
    'separate structure; E_flow / E_coll ~ 1.87e-3 at the inflection scale makes it a tiny, ' +
    'high-leverage shift. There remain TWO notions (sigmoid inflection vs exponent-ramp knee); the ' +
    'sub-gap SUB-GAP-imp-33862-fullmodel-sigmoid-inflection is reconciled. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33862 (M3 named this sub-gap; three landmark values); imp-33744 (closed form sigma_infl); ' +
    'imp-33708 (E_flow negligible on the far tail); imp-486 (C_mb GUE-conditional); imp-2631 ' +
    '(E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33897_FULLMODEL_SIGMOID_INFLECTION_EFLOW_SCALING_ASSERTIONS = [
  {
    // Reuse gate: the alpha-endpoints reproduce the imp-33862 direct no-flow / full-model inflections
    // EXACTLY (same model, same stencil) -- the identical computation is in use.
    id: 'imp33897-reuses-imp33862-endpoints',
    description: 'alpha=0 and alpha=1 reproduce the imp-33862 direct no-flow / full-model inflections to < 1e-4 log10',
    holds: () => OFF_MATCHES_IMP33862 < 1e-4 && FULL_MATCHES_IMP33862 < 1e-4,
  },
  {
    // (R1): the inflection path is continuous and strictly monotone from the no-flow to the full value.
    id: 'imp33897-continuation-monotone',
    description: 'log10 N*(alpha) rises monotonically from ~9.5236 (alpha=0) to ~9.5327 (alpha=1) with no jump',
    holds: () =>
      MONOTONE === true &&
      Math.abs(LOG10_OFF - 9.523641) < 1e-3 &&
      Math.abs(LOG10_FULL - 9.532669) < 1e-3 &&
      TOTAL_DISP_LOG10 > 0,
  },
  {
    // (R2): the displacement is linear in the E_flow amplitude to leading order.
    id: 'imp33897-displacement-linear-in-eflow',
    description: 'fractional displacement at alpha=0.5 is ~0.5 and max deviation from the endpoint line is < 1% of the displacement',
    holds: () => Math.abs(FRAC_AT_HALF - 0.5) < 0.02 && MAX_LIN_DEV_FRAC < 0.01,
  },
  {
    // (R3): E_flow is a tiny (< 1%) share at the inflection scale -- a soft, high-leverage landmark.
    id: 'imp33897-tiny-eflow-amplitude',
    description: 'E_flow / E_coll and E_flow / E_trunc are both < 1% at the full-model inflection scale',
    holds: () => EFLOW_OVER_ECOLL < 0.01 && EFLOW_OVER_ETRUNC < 0.01 && OFF_TO_FULL_PCT > 1 && OFF_TO_FULL_PCT < 5,
  },
  {
    // Honesty gate: measurement / reconciliation only, no bound change, no QED, PT stays SOTA.
    id: 'imp33897-honesty-gate-no-qed',
    description: 'Reconciliation only: isRigorous false, no QED, PT stays SOTA',
    holds: () =>
      IMP33897_FULLMODEL_SIGMOID_INFLECTION_EFLOW_SCALING.isRigorous === false &&
      /NO QED/.test(IMP33897_FULLMODEL_SIGMOID_INFLECTION_EFLOW_SCALING.verdict) &&
      /Lambda <= 0\.2 remains SOTA/.test(IMP33897_FULLMODEL_SIGMOID_INFLECTION_EFLOW_SCALING.verdict),
  },
];

for (const a of IMP33897_FULLMODEL_SIGMOID_INFLECTION_EFLOW_SCALING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33897-fullmodel-sigmoid-inflection-eflow-scaling assertion failed: ${a.id}`);
  }
}
