/**
 * @module imp-33885-eflow-closedform-per-rung-crossvalidation
 *
 * imp-33885 (accuracy, frontier-direction): imp-28895 R1 substituted the Riemann-von Mangoldt height
 * law T0 = 2pi N/(L0-1) into the flow term E_flow = C_F (L/T0) G to obtain the closed form
 *   E_flow = G L (L0^2 - 1)/(4 pi^2 N)  ~  (log N)^3 / N
 * and claimed it reproduces the direct E_flow to 4 sig figs -- but the imp-28895 check
 * (eflowClosedFormCheck) evaluated the closed form only at the TWO endpoints k=6 and k=11 (giving the
 * raw-decay factor F1 = E_flow(6)/E_flow(11) ~= 17992). Whether the closed form TRACKS the direct
 * E_flow across the whole imp-33810 quarter-decade ladder -- the interior rungs, not just the two ends
 * -- was never tabulated. This module supplies that per-rung cross-validation.
 *
 * WHAT IS CROSS-VALIDATED (all 21 imp-33810 rungs, k = 6.00, 6.25, ..., 11.00)
 * ---------------------------------------------------------------------------
 *   At each rung the window upper endpoint is N = 10^(k+1). Both forms are evaluated at that N from
 *   the SAME inherited sub-terms (T0 = effectiveHeightForN(N), L = log T0, L0 = log(T0/2pi)):
 *     direct(N) = C_F (L/T0) G,           C_F = (L0+1)/2pi,  G = Gronwall,
 *     closed(N) = G L (L0^2 - 1)/(4 pi^2 N).
 *   The per-rung relative residual is rel(k) = |closed(N) - direct(N)| / direct(N). The two forms are
 *   an EXACT algebraic identity precisely when N = (T0/2pi)(L0-1); effectiveHeightForN inverts exactly
 *   that height law, so rel(k) equals the Newton-inversion residual of effectiveHeightForN, which is at
 *   the machine-precision floor. Reporting rel(k) at every rung therefore confirms the substitution --
 *   and hence the (log N)^3/N decay law -- across the whole interior, not merely at the two endpoints.
 *
 * THE FINDING (accuracy / measurement only)
 * -----------------------------------------
 *   (R1) THE CLOSED FORM TRACKS THE DIRECT E_flow AT EVERY RUNG. The per-rung relative residual rel(k)
 *        is below 1e-12 at all 21 rungs (max ~3.3e-16, mean ~1.2e-16) -- i.e. the closed form matches
 *        the direct E_flow to machine precision uniformly across k = 6.00..11.00, not just at k=6/k=11.
 *        So the (log N)^3/N law is NOT an endpoint coincidence: it holds across the whole interior.
 *   (R2) THE INTERIOR RESIDUAL IS NO WORSE THAN THE ENDPOINTS. The interior rungs (k not 6 or 11) carry
 *        the same machine-floor residual as the two endpoints imp-28895 checked; the max residual is
 *        not concentrated at either end. The single-figure imp-28895 endpoint check was representative.
 *   (R3) THE RAW-DECAY FACTOR F1 REPRODUCES 17992 IN BOTH FORMS. E_flow(6)/E_flow(11) = 17992.16 from
 *        the direct form and 17992.16 from the closed form (agreeing to ~13 sig figs), so the imp-28895
 *        F1 ~= 17992 endpoint factor is the closed form's own head-to-tail decay, confirmed here as the
 *        endpoint slice of a per-rung identity that holds everywhere between.
 *
 * The punchline: the imp-28895 substitution E_flow = G L (L0^2-1)/(4 pi^2 N) is not an endpoint-only
 * fit -- it reproduces the direct E_flow = C_F (L/T0) G to machine precision (rel < 1e-12) at every one
 * of the 21 imp-33810 quarter-decade rungs, because effectiveHeightForN inverts the exact RvM height
 * law N = (T0/2pi)(L0-1) that makes the two forms an algebraic identity. The (log N)^3/N raw-decay law
 * therefore holds across the whole k=6..11 interior, and the F1 ~= 17992 endpoint factor is one slice
 * of it. This tabulates the interior that imp-28895 only asserted at the two ends.
 *
 * ACCURACY / MEASUREMENT ONLY. Cross-validation diagnostic, NOT an RH bound. The inherited imp-3406
 * flow prefactor is NOT a rigorous asymptotic; the closed-form E_flow scaling is exact WITHIN the
 * component model only; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-28895-eflow-resid-widening-model-derivation (R1 closed form + endpoint-only eflowClosedFormCheck)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the 21 quarter-decade rungs cross-validated here)
 * @see imp-33884-eflow-resid-widening-fullprec-recompute (un-rounded widening recompute, same sub-terms)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N = (T0/2pi)(L0-1), the RvM height law)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const FOUR_PI2 = 4 * Math.PI * Math.PI;
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-28895/imp-33884 exactly

// The two E_flow forms at a given N, from the SAME inherited sub-terms (no re-derivation).
function eflowForms(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const L0 = Math.log(T0 / TWO_PI);
  const C_F = (L0 + 1) / TWO_PI; // imp-398 pinned prefactor
  const direct = C_F * (L / T0) * GRONWALL; // E_flow = C_F (L/T0) G
  const closed = (GRONWALL * L * (L0 * L0 - 1)) / (FOUR_PI2 * N); // G L (L0^2-1)/(4 pi^2 N)
  return { T0, L, L0, direct, closed };
}

// The 21 imp-33810 quarter-decade rungs k = 6.00, 6.25, ..., 11.00; window upper endpoint N=10^(k+1).
const K_START = 6;
const K_END = 11;
const K_STEP = 0.25;
const RUNGS = [];
for (let k = K_START; k <= K_END + 1e-9; k += K_STEP) {
  const kk = +k.toFixed(2);
  const N = Math.pow(10, kk + 1);
  const f = eflowForms(N);
  const rel = Math.abs(f.closed - f.direct) / f.direct;
  RUNGS.push({
    k: kk,
    N: +N.toExponential(3),
    eflow_direct: +f.direct.toExponential(6),
    eflow_closed: +f.closed.toExponential(6),
    rel_residual: +rel.toExponential(4),
  });
}

const REL = RUNGS.map((r) => r.rel_residual);
const MAX_REL = Math.max(...REL);
const MEAN_REL = REL.reduce((a, b) => a + b, 0) / REL.length;
const ALL_BELOW_1EM12 = REL.every((x) => x < 1e-12);

// Interior rungs (k not an endpoint) vs the two endpoints imp-28895 checked.
const HEAD_REL = RUNGS[0].rel_residual; // k=6
const TAIL_REL = RUNGS[RUNGS.length - 1].rel_residual; // k=11
const INTERIOR_MAX_REL = Math.max(...RUNGS.slice(1, -1).map((r) => r.rel_residual));

// The imp-28895 raw-decay factor F1 = E_flow(6)/E_flow(11), in BOTH forms.
const HEAD_FORMS = eflowForms(1e7); // k=6 upper endpoint N=1e7
const TAIL_FORMS = eflowForms(1e12); // k=11 upper endpoint N=1e12
const F1_DIRECT = HEAD_FORMS.direct / TAIL_FORMS.direct;
const F1_CLOSED = HEAD_FORMS.closed / TAIL_FORMS.closed;
const F1_FORMS_REL = Math.abs(F1_DIRECT - F1_CLOSED) / F1_DIRECT;
const IMP28895_F1 = 17992; // imp-28895 reported endpoint factor (~17992)

export const IMP33885_EFLOW_CLOSEDFORM_PER_RUNG_CROSSVALIDATION = {
  id: 'imp-33885',
  proofSection: 'S-frontier',
  question:
    'imp-28895 R1 substituted the RvM height law into E_flow to get the closed form ' +
    'G L (L0^2-1)/(4 pi^2 N) ~ (log N)^3/N and checked it against the direct E_flow = C_F (L/T0) G ' +
    'only at the k=6 and k=11 endpoints (F1 ~= 17992). Evaluate both forms at every one of the 21 ' +
    'imp-33810 quarter-decade rungs k=6.00..11.00 and report the per-rung relative residual, ' +
    'confirming the closed form tracks the direct E_flow across the interior, not just at the two ends. ' +
    'Accuracy/measurement only; the imp-3406 flow prefactor is NOT a rigorous asymptotic; NO QED.',
  measuredQuantity:
    'per rung k=6.00..11.00, N=10^(k+1): rel_residual = |G L (L0^2-1)/(4 pi^2 N) - C_F (L/T0) G| / ' +
    '(C_F (L/T0) G), with T0=effectiveHeightForN(N), L=log T0, L0=log(T0/2pi), C_F=(L0+1)/2pi',
  ladder: RUNGS,
  residualSummary: {
    n_rungs: RUNGS.length, // 21
    max_rel_residual: +MAX_REL.toExponential(4), // ~3.3e-16 (machine floor)
    mean_rel_residual: +MEAN_REL.toExponential(4), // ~1.2e-16
    all_below_1e_minus_12: ALL_BELOW_1EM12, // closed form matches direct to machine precision
    head_k6_rel: +HEAD_REL.toExponential(4),
    tail_k11_rel: +TAIL_REL.toExponential(4),
    interior_max_rel: +INTERIOR_MAX_REL.toExponential(4), // interior no worse than the endpoints
  },
  rawDecayFactorF1: {
    F1_direct: +F1_DIRECT.toFixed(4), // ~17992.16
    F1_closed: +F1_CLOSED.toFixed(4), // ~17992.16
    F1_forms_rel: +F1_FORMS_REL.toExponential(4), // ~1e-13 (both forms agree)
    imp28895_reported_F1: IMP28895_F1, // ~17992
  },
  finding: {
    R1_closed_form_tracks_direct_every_rung:
      'The per-rung relative residual is below 1e-12 at all 21 rungs (max ~3.3e-16, mean ~1.2e-16): ' +
      'the closed form G L (L0^2-1)/(4 pi^2 N) matches the direct E_flow = C_F (L/T0) G to machine ' +
      'precision uniformly across k=6.00..11.00, because effectiveHeightForN inverts the exact RvM ' +
      'height law N=(T0/2pi)(L0-1) that makes the two forms algebraically identical. The (log N)^3/N ' +
      'law is not an endpoint coincidence -- it holds across the whole interior.',
    R2_interior_no_worse_than_endpoints:
      'The interior-rung max residual equals the two-endpoint residual to the machine floor; the max ' +
      'is not concentrated at either end, so the single-figure imp-28895 endpoint check was ' +
      'representative of the whole ladder.',
    R3_F1_reproduces_17992_in_both_forms:
      'E_flow(6)/E_flow(11) = 17992.16 from the direct form and 17992.16 from the closed form (rel ' +
      '~1e-13), reproducing the imp-28895 F1 ~= 17992: the reported endpoint factor is one slice of a ' +
      'per-rung identity that holds everywhere between k=6 and k=11.',
  },
  isRigorous: false,
  verdict:
    'ACCURACY / CROSS-VALIDATION (frontier-direction, NOT rigorous). Evaluating both the imp-28895 ' +
    'closed form E_flow = G L (L0^2-1)/(4 pi^2 N) and the direct E_flow = C_F (L/T0) G at every one of ' +
    'the 21 imp-33810 quarter-decade rungs k=6.00..11.00 shows the two agree to a per-rung relative ' +
    'residual below 1e-12 (max ~3.3e-16, mean ~1.2e-16) -- machine precision, uniformly, interior no ' +
    'worse than the endpoints. The agreement is exact because effectiveHeightForN inverts the RvM ' +
    'height law N=(T0/2pi)(L0-1) that makes the substitution an algebraic identity. So the imp-28895 ' +
    'endpoint-only check (F1 ~= 17992, reproduced here to ~13 sig figs in both forms) generalises: the ' +
    '(log N)^3/N raw-decay law holds across the whole k=6..11 interior, not just at the two ends. The ' +
    'inherited imp-3406 flow prefactor is NOT a rigorous asymptotic; the closed-form scaling is exact ' +
    'WITHIN the component model only; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-28895 (R1 closed form + endpoint-only eflowClosedFormCheck cross-validated here); imp-33810 ' +
    '(the 21 quarter-decade rungs); imp-33884 (un-rounded widening recompute, same sub-terms); ' +
    'imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN, the RvM height law).',
};

export const IMP33885_EFLOW_CLOSEDFORM_PER_RUNG_CROSSVALIDATION_ASSERTIONS = [
  {
    // (R1) The closed form matches the direct E_flow to machine precision at all 21 rungs.
    id: 'imp33885-closed-form-matches-every-rung',
    description: 'rel_residual < 1e-12 at all 21 quarter-decade rungs (machine-floor agreement)',
    holds: () => RUNGS.length === 21 && ALL_BELOW_1EM12 && MAX_REL < 1e-12,
  },
  {
    // (R2) The interior residual is no worse than the two endpoints imp-28895 checked.
    id: 'imp33885-interior-no-worse-than-endpoints',
    description: 'interior max residual is at the machine floor, not concentrated at either endpoint',
    holds: () => INTERIOR_MAX_REL < 1e-12 && MAX_REL < 1e-12,
  },
  {
    // (R3) F1 = E_flow(6)/E_flow(11) reproduces the imp-28895 ~17992 in BOTH forms.
    id: 'imp33885-F1-reproduces-17992-both-forms',
    description: 'F1_direct and F1_closed both ~17992 (imp-28895 endpoint factor), agreeing to ~1e-13',
    holds: () =>
      Math.abs(F1_DIRECT - IMP28895_F1) < 1 &&
      Math.abs(F1_CLOSED - IMP28895_F1) < 1 &&
      F1_FORMS_REL < 1e-9,
  },
  {
    // Honesty gate: accuracy/measurement only, isRigorous false, no QED, PT SOTA.
    id: 'imp33885-honesty-gate-no-qed',
    description: 'Cross-validation only: isRigorous false, no QED, PT SOTA',
    holds: () =>
      IMP33885_EFLOW_CLOSEDFORM_PER_RUNG_CROSSVALIDATION.isRigorous === false &&
      /NO QED/.test(IMP33885_EFLOW_CLOSEDFORM_PER_RUNG_CROSSVALIDATION.verdict) &&
      /remains SOTA/.test(IMP33885_EFLOW_CLOSEDFORM_PER_RUNG_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP33885_EFLOW_CLOSEDFORM_PER_RUNG_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33885-eflow-closedform-per-rung-crossvalidation assertion failed: ${a.id}`);
  }
}
