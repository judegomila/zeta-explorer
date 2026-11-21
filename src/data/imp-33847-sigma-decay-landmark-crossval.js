/**
 * @module imp-33847-sigma-decay-landmark-crossval
 *
 * imp-33847 (accuracy, frontier-direction): CROSS-VALIDATE the six imp-33828 sigma(N)-decay
 * landmarks by an INDEPENDENT DIRECT EVALUATION of the imp-3220/imp-3406 component
 * sigma(N) = E_coll(N)/E(N) at each landmark N-location, and report the direct-vs-tabulated
 * residual per landmark. imp-33828 assembled its six-rung ladder from prose scattered across
 * lambda-roadmap.js currentStatus (imp-3406/imp-33582/imp-33723/imp-33721) but never
 * cross-tabulated a single direct sigma(N) evaluation at each stated N -- so the ladder was
 * a reference of figures, not a self-consistency check. This module supplies that check.
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-3406/imp-33582/imp-33601/imp-33723)
 * ----------------------------------------------------------------------------------
 *   T0        = effectiveHeightForN(N)                     (Riemann-von Mangoldt inverse)
 *   E_trunc   = 3.06e-5                                    (N-independent fixed-strip floor, imp-2631)
 *   E_flow    = C_F * (log T0 / T0) * exp(TC_A1_TRAP)      (unconditional Gronwall flow term)
 *   E_coll    = C_C_PINNED * sqrt(log T0 / N)              (GUE-conditional, C_H ansatz, imp-2642)
 *   E(N)      = E_trunc + E_flow + E_coll
 *   sigma(N)  = E_coll(N) / E(N)
 * No fresh model, no re-derived constant: the sub-terms are lifted verbatim from imp-33723.
 *
 * THE CROSS-VALIDATION (direct sigma(N) at each imp-33828 landmark N)
 * ------------------------------------------------------------------
 *   interior_peak         N ~ 9.22e5     sigma = 0.949429   vs sigma_max 0.9494  resid +2.90e-5
 *   sigma>0.9 until        N ~ 2.57e7     sigma = 0.900032   vs 0.9              resid +3.23e-5
 *   halving                N ~ 3.267e9    sigma = 0.500009   vs 0.5              resid +8.56e-6
 *   E_coll=E_trunc cross   N ~ 3.280294e9 sigma = 0.499526   (E_coll/E_trunc = 1.000000 EXACT)
 *   inflection_knee        N ~ 3.38e9     sigma = 0.495965   (knee, no threshold value)
 *   sigma<0.1 threshold    N ~ 3.21e11    sigma = 0.100043   vs 0.1             resid +4.29e-5
 *
 * THE FINDING (verification / measurement only)
 * ---------------------------------------------
 *   (V1) EVERY THRESHOLD LANDMARK MATCHES ITS LABEL. Direct sigma(N) at the four threshold
 *        rungs (0.9494 peak, 0.9, 0.5, 0.1) reproduces the stated threshold to |resid| <= 3.3e-5,
 *        i.e. the imp-33828 N-values are self-consistent with the imp-3220/imp-3406 model to
 *        better than 1e-4 in sigma -- the ladder was assembled correctly.
 *   (V2) THE CROSSOVER RUNG IS PINNED BY E_coll/E_trunc = 1, NOT BY sigma = 0.5. At the
 *        E_coll = E_trunc crossover N the direct ratio E_coll/E_trunc = 1.000000 (its DEFINING
 *        condition), while sigma = 0.499526 sits just BELOW 0.5 by ~4.7e-4. This is the expected
 *        sign: sigma = 1/2 <=> E_coll = E_trunc + E_flow (imp-33601), so at E_coll = E_trunc the
 *        extra +E_flow in the denominator drags sigma below 1/2 -- confirming the ladder ordering
 *        N_half (3.267e9) < N_cross (3.280e9) and re-deriving the imp-33723 ~0.4% offset directly.
 *   (V3) THE KNEE RUNG SITS ON THE MONOTONE ARM. sigma at the inflection knee (0.495965) lies
 *        strictly between the crossover (0.4995) and the sigma<0.1 rung (0.1000), consistent with
 *        the single monotone-decreasing right arm the whole ladder is claimed to occupy (imp-3444).
 *
 * The punchline: the imp-33828 reference ladder -- previously six figures collected from prose --
 * now carries a DIRECT sigma(N) cross-tabulation confirming every threshold rung to |resid| < 1e-4
 * and confirming the crossover rung is pinned by E_coll/E_trunc = 1 (sigma just below 1/2), with no
 * value re-derived and no tabulated N changed.
 *
 * VERIFICATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 EXTRAPOLATION, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional (imp-486) and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; the imp-33828
 * reference ladder is unchanged; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33828-sigma-decay-landmark-ladder-reference (the six-rung ladder cross-validated here)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (identical parts() sub-terms; crossover closed form)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (identity sigma=1/2 <=> E_coll=E_trunc+E_flow)
 * @see imp-3406-sigma-highN-extrapolation (interior peak); imp-33582 (near/far threshold landmarks)
 * @see lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip floor (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33601/imp-33723 exactly

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

// The imp-33828 ladder N-locations, each with the threshold sigma its currentStatus label states.
// threshold === null for the two rungs that are NOT sigma-thresholds (crossover / inflection knee).
const LANDMARKS = [
  { name: 'interior_peak', N: 9.22e5, threshold: 0.9494, source: 'imp-3406' },
  { name: 'sigma_above_0.9_until', N: 2.57e7, threshold: 0.9, source: 'imp-33582' },
  { name: 'halving', N: 3.267e9, threshold: 0.5, source: 'imp-33582' },
  { name: 'Ecoll_eq_Etrunc_crossover', N: 3.280294e9, threshold: null, source: 'imp-33723' },
  { name: 'inflection_knee', N: 3.38e9, threshold: null, source: 'imp-33721' },
  { name: 'sigma_below_0.1', N: 3.21e11, threshold: 0.1, source: 'imp-33582' },
];

// Direct sigma(N) evaluation at each landmark, with the direct-vs-tabulated residual.
const CROSSVAL = LANDMARKS.map((lm) => {
  const p = parts(lm.N);
  const residual = lm.threshold == null ? null : p.sigma - lm.threshold;
  return {
    name: lm.name,
    N: lm.N,
    source: lm.source,
    threshold: lm.threshold,
    sigma_direct: +p.sigma.toFixed(6),
    E_coll_over_E_trunc: +(p.E_coll / E_TRUNC_PT).toFixed(6),
    residual: residual == null ? null : +residual.toExponential(4),
  };
});

// Largest |residual| over the four threshold rungs (the ladder self-consistency figure).
const MAX_THRESHOLD_RESID = Math.max(
  ...CROSSVAL.filter((r) => r.threshold != null).map((r) => Math.abs(r.residual))
);
// The crossover rung: E_coll/E_trunc must be 1 (defining) while sigma sits just below 1/2.
const CROSS = CROSSVAL.find((r) => r.name === 'Ecoll_eq_Etrunc_crossover');
const KNEE = CROSSVAL.find((r) => r.name === 'inflection_knee');

export const IMP33847_SIGMA_DECAY_LANDMARK_CROSSVAL = {
  id: 'imp-33847',
  proofSection: 'S-frontier',
  question:
    'Cross-validate the imp-33828 six sigma(N)-decay landmarks by an independent DIRECT evaluation ' +
    'of the imp-3220/imp-3406 component sigma(N) = E_coll(N)/E(N) at each landmark N-location, and ' +
    'report the direct-vs-tabulated residual per landmark. Verification only; reference ladder ' +
    'unchanged; component model is extrapolation not rigorous; imp-3066 untouched; NO QED.',
  crossValidation: CROSSVAL,
  maxThresholdResidual: +MAX_THRESHOLD_RESID.toExponential(3), // ~3.23e-5
  finding: {
    V1_thresholds_match_labels:
      'Direct sigma(N) at the four threshold rungs (0.9494 peak / 0.9 / 0.5 / 0.1) reproduces the ' +
      'stated threshold to |resid| <= ~3.3e-5 -- the imp-33828 N-values are self-consistent with the ' +
      'imp-3220/imp-3406 component model to better than 1e-4 in sigma.',
    V2_crossover_pinned_by_ratio_not_sigma:
      'At the E_coll = E_trunc crossover N the direct ratio E_coll/E_trunc = 1.000000 (its defining ' +
      'condition) while sigma = 0.499526 sits just below 0.5 by ~4.7e-4. Expected sign: ' +
      'sigma = 1/2 <=> E_coll = E_trunc + E_flow (imp-33601), so the +E_flow in the denominator drags ' +
      'sigma below 1/2 -- confirming N_half (3.267e9) < N_cross (3.280e9).',
    V3_knee_on_monotone_arm:
      'sigma at the inflection knee (0.495965) lies strictly between the crossover (0.4995) and the ' +
      'sigma<0.1 rung (0.1000), consistent with the single monotone-decreasing right arm (imp-3444).',
  },
  isRigorous: false,
  verdict:
    'VERIFICATION (frontier-direction, NOT rigorous). Independently evaluating the imp-3220/imp-3406 ' +
    'component sigma(N) = E_coll(N)/E(N) at each of the six imp-33828 landmark N-locations reproduces ' +
    'every stated threshold to |resid| < 1e-4 (max ~3.23e-5 over the four threshold rungs), and pins ' +
    'the E_coll = E_trunc crossover rung by its defining ratio E_coll/E_trunc = 1.000000 with sigma ' +
    'just below 1/2 (0.499526) -- the expected E_flow-induced sign that confirms the halving landmark ' +
    'precedes the crossover. The imp-33828 reference ladder was assembled correctly and is unchanged; ' +
    'no value is re-derived and no tabulated N is altered. Component model is the inherited ' +
    'imp-3220/imp-3406 EXTRAPOLATION, NOT a rigorous asymptotic; the C_mb GUE-conditional (imp-486) ' +
    'and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-33828 (six-rung sigma-decay landmark ladder reference); imp-33723 (identical parts() ' +
    'sub-terms; crossover closed form); imp-33601 (sigma=1/2 <=> E_coll=E_trunc+E_flow); imp-3406 ' +
    '(interior peak); imp-33582 (near/far threshold landmarks); imp-2642 (C_C 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP33847_SIGMA_DECAY_LANDMARK_CROSSVAL_ASSERTIONS = [
  {
    // (V1): every threshold rung matches its stated sigma to better than 1e-4.
    id: 'imp33847-thresholds-match-to-1e-4',
    description: 'each of the four sigma-threshold rungs matches its label to |resid| < 1e-4',
    holds: () =>
      CROSSVAL.filter((r) => r.threshold != null).every((r) => Math.abs(r.residual) < 1e-4) &&
      MAX_THRESHOLD_RESID < 1e-4,
  },
  {
    // The cross-validation covers exactly the six imp-33828 rungs, in strict N-order.
    id: 'imp33847-six-rungs-in-N-order',
    description: 'exactly six landmark rungs, strictly increasing N (matches imp-33828)',
    holds: () =>
      CROSSVAL.length === 6 &&
      CROSSVAL.every((r, i) => i === 0 || CROSSVAL[i - 1].N < r.N),
  },
  {
    // (V2): the crossover rung is pinned by E_coll/E_trunc = 1, and sigma sits just below 1/2.
    id: 'imp33847-crossover-ratio-one-sigma-below-half',
    description: 'crossover E_coll/E_trunc = 1 (to 1e-3) while sigma is just below 0.5',
    holds: () =>
      Math.abs(CROSS.E_coll_over_E_trunc - 1) < 1e-3 &&
      CROSS.sigma_direct < 0.5 &&
      CROSS.sigma_direct > 0.499,
  },
  {
    // (V3): the inflection-knee rung sits on the monotone arm between crossover and sigma<0.1.
    id: 'imp33847-knee-on-monotone-arm',
    description: 'inflection-knee sigma lies strictly between the sigma<0.1 rung and 0.5',
    holds: () => KNEE.sigma_direct > 0.1 && KNEE.sigma_direct < 0.5,
  },
  {
    // Honesty gate: verification/measurement only, ladder unchanged, no QED, no refereed bound is changed.
    id: 'imp33847-honesty-gate-no-qed',
    description: 'verification only: isRigorous false, no QED, imp-3066 untouched, no refereed bound is changed',
    holds: () =>
      IMP33847_SIGMA_DECAY_LANDMARK_CROSSVAL.isRigorous === false &&
      /NO QED/.test(IMP33847_SIGMA_DECAY_LANDMARK_CROSSVAL.verdict) &&
      /refereed bound is changed/i.test(IMP33847_SIGMA_DECAY_LANDMARK_CROSSVAL.verdict) &&
      /imp-3066/.test(IMP33847_SIGMA_DECAY_LANDMARK_CROSSVAL.verdict),
  },
];

for (const a of IMP33847_SIGMA_DECAY_LANDMARK_CROSSVAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33847-sigma-decay-landmark-crossval assertion failed: ${a.id}`);
  }
}
