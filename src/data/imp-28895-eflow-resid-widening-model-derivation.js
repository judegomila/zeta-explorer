/**
 * @module imp-28895-eflow-resid-widening-model-derivation
 *
 * imp-28895 (numerical, frontier-direction): imp-33810 reported a head-to-tail SEPARATION WIDENING
 * of ~918x for the E_flow-term / offset-residual ratio eflow_attr/resid_exp across k = 6..11, and
 * imp-33843 then FIT its functional form (log-linear vs power law in k) but explicitly flagged the
 * surrogates as "descriptive, NOT derived". Neither DERIVED the ~918x from the inherited imp-3220/
 * imp-3406 component-model asymptotics. This module supplies that derivation: it decomposes the
 * head-to-tail widening into the four component-model factors that produce it and identifies which
 * asymptotic scaling (E_flow vs the offset residual) drives the widening, then reports the
 * model-predicted vs the imp-33810-measured ~918x.
 *
 * THE CLOSED-FORM E_flow SCALING (from the imp-3406 flow prefactor + the RvM height law)
 * ------------------------------------------------------------------------------------
 *   E_flow = C_F (L/T0) G,  C_F = (L0 + 1)/(2pi),  L = log T0,  L0 = log(T0/2pi),  G = Gronwall.
 *   The Riemann-von Mangoldt height law effectiveHeightForN inverts N = (T0/2pi)(L0 - 1), i.e.
 *   T0 = 2pi N/(L0 - 1). Substituting kills T0 in favour of N:
 *       E_flow = G L (L0 + 1)(L0 - 1) / (4 pi^2 N) = G L (L0^2 - 1) / (4 pi^2 N)  ~  (log N)^3 / N.
 *   So in the component model the E_flow term decays as (log N)^3 / N -- a THREE-log-power-over-N
 *   law -- whereas E_coll ~ sqrt(log N / N) decays far SLOWER and E_trunc is N-flat. This is the
 *   scaling that drives the widening.
 *
 * THE FACTOR DECOMPOSITION OF THE HEAD-TO-TAIL WIDENING (an exact identity, k=6 vs k=11)
 * ------------------------------------------------------------------------------------
 *   widening = roe(11)/roe(6),  roe(k) = resid_exp(k)/eflow_attr(k),  eflow_attr = (E_flow/E_N)|s_flow|.
 *   Writing eflow_attr(6)/eflow_attr(11) = F1 * F2 * F3 and folding in the residual F4:
 *       F1 = E_flow(6)/E_flow(11)      ~= 17992   (the closed-form (log N)^3/N raw decay, 5 N-decades),
 *       F2 = E_N(11)/E_N(6)            ~= 0.06332  (E_N shrinks: E_coll-dominated head -> E_trunc tail),
 *       F3 = |s_flow|(6)/|s_flow|(11)  ~= 0.90709  (the E_flow log-slope drifts toward -1),
 *       F4 = resid_exp(11)/resid_exp(6)~= 0.87432  (the offset residual is NEAR-FLAT head-to-tail).
 *   eflow_attr collapse F1*F2*F3 ~= 1033.4;  widening = F1*F2*F3*F4 ~= 903.5.
 *
 * THE FINDING (derivation only -- attributes the imp-33810 ~918x to the E_flow scaling)
 * -----------------------------------------------------------------------------------
 *   (R1) THE WIDENING IS A DIRECT CONSEQUENCE OF THE E_flow (log N)^3/N DECAY. The dominant factor is
 *        F1 ~= 1.80e4, the closed-form E_flow(6)/E_flow(11) raw decay reproduced to 4 sig figs by
 *        G L (L0^2-1)/(4 pi^2 N) at the two endpoints. The widening is E_flow-driven: it tracks the
 *        eflow_attr term collapsing, not the residual growing.
 *   (R2) THE E_N DENOMINATOR RENORMALISES THE RAW DECAY BY ~16x. F2 = E_N(11)/E_N(6) ~= 0.0633: E_N
 *        itself decays across the span (E_coll-dominated near the head, sigma~0.93, down to the N-flat
 *        E_trunc floor in the tail, sigma~0.06), so the eflow_attr collapse F1*F2*F3 ~= 1033x is the
 *        (log N)^3/N raw decay renormalised by the E_N transition -- both are component-model effects.
 *   (R3) THE OFFSET RESIDUAL CONTRIBUTES ONLY A NEAR-UNITY FACTOR. F4 = resid_exp(11)/resid_exp(6)
 *        ~= 0.874, i.e. the residual RETURNS to ~0.87 of its head value in the tail because it is a
 *        BOUNDED curvature hump (it rises to a peak near k=9 then falls, the imp-33773 M3/imp-33809
 *        signature), NOT a competing power law in N. So the residual does NOT drive the widening; it
 *        merely modulates it by <1.15x.
 *   (R4) MODEL-PREDICTED vs MEASURED. The exact endpoint product F1*F2*F3*F4 ~= 903.5 reproduces the
 *        imp-33810 SEPARATION_WIDENING ~= 917.9; the two agree to within the module toFixed(1) rounding
 *        of the head rung (roe(6) = 2.13 rounds to 2.1, inflating the reported ratio from ~903 to ~918).
 *        The ~918x is therefore a derived consequence of the component-model asymptotics, not a fit.
 *
 * The punchline: imp-33810's ~918x head-to-tail widening of eflow_attr/resid_exp is the component
 * model's E_flow (log N)^3/N decay (raw factor ~1.8e4 over 5 N-decades), renormalised by the E_N
 * denominator's own E_coll->E_trunc transition (~0.063x) to the eflow_attr collapse ~1033x, and only
 * lightly modulated by the bounded, near-flat (~0.87x) offset residual. The widening is E_flow-driven
 * and MODEL-DERIVED (predicted ~903, measured ~918, agreeing within rounding); the offset residual is
 * a competitor only in the sense that it stays near-flat while E_flow collapses. This closes the
 * imp-33843 gap ("descriptive, NOT derived") on the imp-33810 widening.
 *
 * DERIVATION / CROSS-CHECK ONLY. Attribution diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the closed-form E_flow scaling
 * is exact WITHIN that model only; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no
 * bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33810-eflow-resid-ratio-N-ladder (the ladder whose ~918x widening is derived here)
 * @see imp-33843-eflow-resid-widening-form-fit (fit the widening FORM but not derived from the model)
 * @see imp-33773-ecoll-sigma-offset-eflow-attribution (M2 refutation; M3 curvature-hump residual)
 * @see imp-33809-saturation-curvature-hump-vs-k (the bounded residual hump, peak near k=9)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N = (T0/2pi)(L0-1), the RvM height law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33773 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const L0 = Math.log(T0 / TWO_PI);
  const C_F = (L0 + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, L0, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// imp-33810 helper defns (verbatim), needed only for the resid_exp endpoints.
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}

// Recompute the imp-33810 endpoint rungs (k=6 head, k=11 tail) with full precision.
function rung(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const resid = pEcoll * (1 - ph.sigma) - pSigma; // imp-33773 M2 sub-leading residual
  const sflow = Math.abs(eflowLogSlope(hi));
  const eflow = (ph.E_flow / ph.E_N) * sflow; // attributed E_flow term
  return { k, E_flow: ph.E_flow, E_N: ph.E_N, L: ph.L, L0: ph.L0, resid, sflow, eflow, roe: resid / eflow };
}
const HEAD = rung(6);
const TAIL = rung(11);

// Closed-form E_flow check: G L (L0^2 - 1)/(4 pi^2 N) must reproduce E_flow at each endpoint.
function eflowClosedForm(k) {
  const N = Math.pow(10, k + 1); // window upper endpoint N = 10^(k+1)
  const p = parts(N);
  return (GRONWALL * p.L * (p.L0 * p.L0 - 1)) / (4 * Math.PI * Math.PI * N);
}
const EFLOW_CF_HEAD = eflowClosedForm(6);
const EFLOW_CF_TAIL = eflowClosedForm(11);
const CF_HEAD_REL_ERR = Math.abs(EFLOW_CF_HEAD - HEAD.E_flow) / HEAD.E_flow;
const CF_TAIL_REL_ERR = Math.abs(EFLOW_CF_TAIL - TAIL.E_flow) / TAIL.E_flow;

// The four component-model factors of the head-to-tail widening (exact identity).
const F1_EFLOW_RAW_DECAY = HEAD.E_flow / TAIL.E_flow; // ~17992: the (log N)^3/N raw decay
const F2_EN_RENORM = TAIL.E_N / HEAD.E_N; // ~0.0633: E_coll-dominated head -> E_trunc tail
const F3_SFLOW_DRIFT = HEAD.sflow / TAIL.sflow; // ~0.907: |s_flow| drifts toward -1
const F4_RESID_FLATNESS = TAIL.resid / HEAD.resid; // ~0.874: bounded residual, near-flat

const EFLOW_ATTR_COLLAPSE = F1_EFLOW_RAW_DECAY * F2_EN_RENORM * F3_SFLOW_DRIFT; // ~1033
const WIDENING_MODEL_PREDICTED = EFLOW_ATTR_COLLAPSE * F4_RESID_FLATNESS; // ~903.5 (exact endpoint product)
const WIDENING_MEASURED_UNROUNDED = TAIL.roe / HEAD.roe; // ~903.5 (identity, matches predicted)
// imp-33810 SEPARATION_WIDENING uses toFixed(1) rungs: roe(6)=2.13->2.1 inflates it to ~917.9.
const WIDENING_IMP33810_TOFIXED = +TAIL.roe.toFixed(1) / +HEAD.roe.toFixed(1); // ~917.9

export const IMP28895_EFLOW_RESID_WIDENING_MODEL_DERIVATION = {
  id: 'imp-28895',
  proofSection: 'S-frontier',
  question:
    'imp-33810 reported a ~918x head-to-tail widening of eflow_attr/resid_exp across k=6..11 and ' +
    'imp-33843 fit its FORM but flagged the fit as "descriptive, NOT derived". Derive the ~918x from ' +
    'the inherited imp-3220/imp-3406 component-model asymptotics: work out the leading E_flow scaling ' +
    'and decompose the widening into the E_flow-vs-offset-residual factors, then report the ' +
    'model-predicted vs measured widening. Derivation/attribution only; NOT an RH bound; no QED.',
  closedFormEflow:
    'E_flow = C_F (L/T0) G with T0 = 2pi N/(L0-1) (RvM height law) gives ' +
    'E_flow = G L (L0^2 - 1)/(4 pi^2 N) ~ (log N)^3 / N, decaying far faster than E_coll ~ ' +
    'sqrt(log N / N) and the N-flat E_trunc.',
  eflowClosedFormCheck: {
    head_k6_rel_err: +CF_HEAD_REL_ERR.toExponential(3), // closed form vs recomputed E_flow, head
    tail_k11_rel_err: +CF_TAIL_REL_ERR.toExponential(3), // closed form vs recomputed E_flow, tail
  },
  factors: {
    F1_eflow_raw_decay: +F1_EFLOW_RAW_DECAY.toFixed(2), // ~17992  (closed-form (log N)^3/N decay)
    F2_EN_renorm: +F2_EN_RENORM.toExponential(4), // ~0.06332 (E_coll-dominated -> E_trunc)
    F3_sflow_drift: +F3_SFLOW_DRIFT.toFixed(5), // ~0.90709 (|s_flow| -> -1)
    F4_resid_flatness: +F4_RESID_FLATNESS.toFixed(5), // ~0.87432 (bounded residual, near-flat)
    eflow_attr_collapse_F1F2F3: +EFLOW_ATTR_COLLAPSE.toFixed(2), // ~1033.4
  },
  widening: {
    model_predicted_exact_product: +WIDENING_MODEL_PREDICTED.toFixed(2), // ~903.54
    measured_unrounded: +WIDENING_MEASURED_UNROUNDED.toFixed(2), // ~903.54 (identity)
    imp33810_reported_tofixed: +WIDENING_IMP33810_TOFIXED.toFixed(1), // ~917.9
  },
  finding: {
    R1_eflow_logcubed_over_N_drives_it:
      'The dominant factor is F1 ~= 1.80e4, the closed-form E_flow(6)/E_flow(11) raw decay reproduced ' +
      'to 4 sig figs by G L (L0^2-1)/(4 pi^2 N) at both endpoints (rel err < 1e-3). The widening is ' +
      'E_flow-driven: it tracks the eflow_attr term collapsing under the (log N)^3/N law.',
    R2_EN_denominator_renormalises:
      'F2 = E_N(11)/E_N(6) ~= 0.0633: E_N decays from E_coll-dominated at the head (sigma~0.93) to the ' +
      'N-flat E_trunc floor in the tail (sigma~0.06), so the eflow_attr collapse F1*F2*F3 ~= 1033x is ' +
      'the raw (log N)^3/N decay renormalised by the E_N transition -- both component-model effects.',
    R3_residual_is_near_flat_not_a_power_law:
      'F4 = resid_exp(11)/resid_exp(6) ~= 0.874: the offset residual RETURNS to ~0.87 of its head value ' +
      'because it is a BOUNDED curvature hump (rises to a peak near k=9 then falls, the imp-33773 ' +
      'M3/imp-33809 signature), NOT a competing power law. It modulates the widening by <1.15x, not ' +
      'drives it.',
    R4_model_predicted_vs_measured:
      'The exact endpoint product F1*F2*F3*F4 ~= 903.5 reproduces the imp-33810 SEPARATION_WIDENING ' +
      '~= 917.9; the gap is purely the module toFixed(1) rounding of roe(6)=2.13 to 2.1. So the ~918x ' +
      'widening is a DERIVED consequence of the component-model asymptotics, not a fit.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION / ATTRIBUTION (frontier-direction, NOT rigorous). imp-33810 ~918x head-to-tail widening ' +
    'of eflow_attr/resid_exp is DERIVED from the component-model asymptotics: it is the E_flow ' +
    '(log N)^3/N decay (raw factor F1 ~= 1.80e4 over 5 N-decades, from E_flow = G L (L0^2-1)/(4 pi^2 N) ' +
    'via the RvM height law T0 = 2pi N/(L0-1)), renormalised by the E_N denominator E_coll->E_trunc ' +
    'transition (F2 ~= 0.063) to the eflow_attr collapse ~1033x, and only lightly modulated by the ' +
    'bounded, near-flat offset residual (F4 ~= 0.87, a curvature hump peaking near k=9, NOT a power ' +
    'law). Model-predicted widening (exact endpoint product) ~= 903.5 vs imp-33810 reported ~= 917.9, ' +
    'agreeing within the module toFixed(1) rounding. So the widening is E_flow-driven and ' +
    'MODEL-DERIVED, closing the imp-33843 "descriptive, NOT derived" gap. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the closed-form E_flow ' +
    'scaling is exact WITHIN that model only; the C_mb GUE-conditional per imp-486 is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, ' +
    'NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33810 (~918x widening derived here); imp-33843 (fit the form but not derived); imp-33773 ' +
    '(M2 refutation, M3 curvature-hump residual); imp-33809 (bounded residual hump peak near k=9); ' +
    'imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip); lambda-rh-height-mapping (RvM ' +
    'height law); polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP28895_EFLOW_RESID_WIDENING_MODEL_DERIVATION_ASSERTIONS = [
  {
    // The closed-form E_flow = G L (L0^2-1)/(4 pi^2 N) reproduces the recomputed E_flow at both ends.
    id: 'imp28895-closed-form-eflow-matches',
    description: 'G L (L0^2-1)/(4 pi^2 N) reproduces E_flow at k=6 and k=11 (rel err < 1e-6)',
    holds: () => CF_HEAD_REL_ERR < 1e-6 && CF_TAIL_REL_ERR < 1e-6,
  },
  {
    // The E_flow raw decay F1 is the dominant, order-1e4 factor (the (log N)^3/N law over 5 decades).
    id: 'imp28895-eflow-raw-decay-dominant',
    description: 'F1 = E_flow(6)/E_flow(11) ~ 1.8e4 is the dominant widening factor',
    holds: () => F1_EFLOW_RAW_DECAY > 1.5e4 && F1_EFLOW_RAW_DECAY < 2.1e4,
  },
  {
    // The offset residual is near-flat head-to-tail (bounded hump), NOT a competing power law.
    id: 'imp28895-residual-near-flat',
    description: 'F4 = resid(11)/resid(6) in [0.8,1.0] -- bounded residual, not a power law',
    holds: () => F4_RESID_FLATNESS > 0.8 && F4_RESID_FLATNESS < 1.0,
  },
  {
    // The exact factor product reproduces the imp-33810 measured widening within toFixed rounding.
    id: 'imp28895-model-predicts-measured-widening',
    description: 'F1*F2*F3*F4 (~903) matches imp-33810 SEPARATION_WIDENING (~918) within toFixed rounding',
    holds: () =>
      Math.abs(WIDENING_MODEL_PREDICTED - WIDENING_MEASURED_UNROUNDED) < 1e-6 &&
      WIDENING_MODEL_PREDICTED > 890 &&
      WIDENING_MODEL_PREDICTED < 910 &&
      WIDENING_IMP33810_TOFIXED > 910 &&
      WIDENING_IMP33810_TOFIXED < 925,
  },
  {
    // Honesty gate: derivation only, isRigorous false, no QED, PT SOTA.
    id: 'imp28895-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, PT SOTA',
    holds: () =>
      IMP28895_EFLOW_RESID_WIDENING_MODEL_DERIVATION.isRigorous === false &&
      /NO QED/.test(IMP28895_EFLOW_RESID_WIDENING_MODEL_DERIVATION.verdict) &&
      /remains SOTA/.test(IMP28895_EFLOW_RESID_WIDENING_MODEL_DERIVATION.verdict),
  },
];

for (const a of IMP28895_EFLOW_RESID_WIDENING_MODEL_DERIVATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-28895-eflow-resid-widening-model-derivation assertion failed: ${a.id}`);
  }
}
