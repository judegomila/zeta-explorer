/**
 * @module imp-35153-eflow-etrunc-crossover-closed-form
 *
 * imp-35153 (numerical, frontier-direction): imp-35105 tabulated the three surrogate error
 * components E(N) = E_coll + E_trunc + E_flow (imp-33601 component model) side by side and
 * exposed that the rank order flips TWICE as N sweeps [1e6, 1e13]. The FIRST flip is the
 * Gronwall flow term E_flow dropping below the fixed E_trunc = 3.06e-5 floor, which imp-35105
 * reported as a DOWNSLOPE-BISECTION MEASURED value N ~ 1.597752e6 with NO closed form -- unlike
 * its sibling E_coll = E_trunc crossover, already pinned in closed form by imp-33723 as a Banach
 * fixed point N_cross = (C_C/E_trunc)^2 * log T0(N) ~ 3.280294e9. This module supplies the
 * missing closed form for the E_flow = E_trunc crossover, the same way.
 *
 * THE KEY STRUCTURAL FACT (why this crossover is a HEIGHT solve, not an N solve)
 * -----------------------------------------------------------------------------
 * E_coll = C_C * sqrt(log T0 / N) contains N BOTH explicitly (the 1/sqrt(N)) and through the
 * slow height T0 = effectiveHeightForN(N); solving E_coll = E_trunc for N gives the imp-33723
 * fixed point in N directly. But the flow term
 *
 *     E_flow = C_F * (log T0 / T0) * GRONWALL,   C_F = (log(T0/2pi) + 1) / 2pi   (imp-398)
 *
 * depends on N ONLY through T0. So E_flow = E_trunc is fundamentally a solve for the HEIGHT
 * T0*, after which N* is recovered by the Riemann-von Mangoldt counting function
 * N* = zeroCountAtHeight(T0*) (the inverse of effectiveHeightForN). Writing A = GRONWALL/2pi
 * and collecting the two log factors, E_flow = E_trunc becomes
 *
 *     A * (log(T0/2pi) + 1) * log(T0) / T0 = E_trunc
 *   =>  T0 = (A/E_trunc) * (log(T0/2pi) + 1) * log(T0) =: h(T0).            (CLOSED FORM)
 *
 * This is a FIXED-POINT form T0 = h(T0) with the pinned amplitude B = A/E_trunc ~ 5.2024e3.
 * Because h grows only as (log T0)^2 while its argument grows linearly, the map is a contraction:
 *
 *     h_prime(T0) = B * (1/T0) * [ log T0 + log(T0/2pi) + 1 ],
 *
 * measured |h_prime(T0*)| ~ 0.1504 < 1, so the fixed point is UNIQUE and Banach iteration
 * converges geometrically. Because the contraction here (~0.15) is ~3.3x MILDER than the
 * imp-33723 E_coll crossover (~0.045), convergence takes ~13 iterations from a coarse seed
 * rather than ~5, and a single-shot leading value is only order-of-magnitude accurate -- an
 * honest structural difference between the two crossovers, not a defect.
 *
 * WHAT WE FIND (derivation / measurement only)
 * --------------------------------------------
 *   (D1) CLOSED FORM REPRODUCES THE BISECTION LANDMARK. The fixed point of T0 = h(T0) converges
 *        to T0* ~ 921366.91, and N* = zeroCountAtHeight(T0*) ~ 1.597752e6 reproduces the imp-35105
 *        downslope-bisection crossover to ~1.2e-15 relative -- so the near-peak E_flow crash is
 *        now available in closed form, not only as a bracketed root.
 *   (D2) THE CROSSOVER IS A HEIGHT SOLVE. Unlike the imp-33723 E_coll crossover (an N fixed
 *        point), the E_flow crossover is a T0 fixed point pushed back through the RvM count,
 *        because E_flow(N) = E_flow(T0(N)) has no explicit N-dependence. The contraction
 *        |h_prime(T0*)| ~ 0.150 is milder than imp-33723 (~0.045), so ~13 Banach iterations reach
 *        floating point and the single-shot leading value is NOT within a percent (it is
 *        order-of-magnitude only) -- reflecting the (log T0)^2 growth of h versus the pure
 *        log T0 of the E_coll map.
 *
 * The punchline: the imp-35105 near-peak E_flow = E_trunc crash, previously only a bisected
 * bracket, is PINNED IN CLOSED FORM as a Banach fixed point in the HEIGHT T0 (not N),
 * T0* = (GRONWALL/2pi/E_trunc) * (log(T0star/2pi) + 1) * log(T0star), N* = zeroCountAtHeight(T0star)
 * ~ 1.597752e6, matching the imp-35105 measurement to ~1e-15 -- completing the closed-form pair
 * with the imp-33723 E_coll crossover.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35105-e-component-decomposition-table (the E_flow=E_trunc crossover measured at N~1.597752e6)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (the sibling E_coll=E_trunc crossover in closed form)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (the sigma=1/2 <=> E_coll=E_trunc+E_flow identity)
 * @see imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed strip); imp-486 (C_mb GUE-conditional)
 * @see lambda-rh-height-mapping (effectiveHeightForN and its inverse zeroCountAtHeight)
 */

import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-35105)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-35105/imp-34970/imp-33723 exactly

// EXACT imp-35105/imp-34970/imp-33723 E_flow sub-term (no re-derivation, no fresh model).
function eflowOfT0(T0) {
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
}
function eflowOfN(N) {
  return eflowOfT0(effectiveHeightForN(N));
}

// Downslope bisection in log N for a strictly-decreasing quantity f (reference / cross-check).
function crossBelow(f, target, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (f(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// (CLOSED FORM) E_flow = E_trunc is a HEIGHT solve: T0 = h(T0), N* = zeroCountAtHeight(T0*).
const B_AMPL = GRONWALL / TWO_PI / E_TRUNC_PT; // = (GRONWALL/2pi)/E_trunc ~ 5.2024e3
function heightFixedPoint(seed, iters) {
  let T0 = seed;
  for (let i = 0; i < iters; i++) T0 = B_AMPL * (Math.log(T0 / TWO_PI) + 1) * Math.log(T0);
  return T0;
}
const T0_STAR = heightFixedPoint(1e5, 60);
const N_FLOW_EQ_TRUNC_CF = zeroCountAtHeight(T0_STAR); // ~1.597752e6

// Reference bisection landmark (imp-35105 near-peak E_flow crash) for cross-check.
const N_FLOW_EQ_TRUNC_BIS = crossBelow(eflowOfN, E_TRUNC_PT, 1e5, 1e8); // ~1.597752e6

// Contraction factor of the height map at the root (analytic + central-difference cross-check).
const H_MAP = (T0) => B_AMPL * (Math.log(T0 / TWO_PI) + 1) * Math.log(T0);
const H_STEP = T0_STAR * 1e-6;
const CONTRACTION = Math.abs((H_MAP(T0_STAR + H_STEP) - H_MAP(T0_STAR - H_STEP)) / (2 * H_STEP));
const CONTRACTION_ANALYTIC =
  B_AMPL * (1 / T0_STAR) * (Math.log(T0_STAR) + Math.log(T0_STAR / TWO_PI) + 1);

// Iterations to floating-point convergence from a coarse seed (milder contraction => ~13, not ~5).
let ITERS_TO_CONVERGE = 0;
{
  let T0 = 1e5;
  for (let i = 0; i < 200; i++) {
    const prev = T0;
    T0 = H_MAP(T0);
    ITERS_TO_CONVERGE++;
    if (Math.abs(T0 - prev) < 1e-9 * T0) break;
  }
}

// Closed-form vs bisection agreement, and the imp-33723 contraction for the comparative claim.
const CF_VS_BIS = Math.abs(N_FLOW_EQ_TRUNC_CF - N_FLOW_EQ_TRUNC_BIS) / N_FLOW_EQ_TRUNC_BIS; // ~1.2e-15
const IMP33723_CONTRACTION = 4.54e-2; // pinned E_coll-crossover contraction (imp-33723/imp-33749)

export const IMP35153_EFLOW_ETRUNC_CROSSOVER_CLOSED_FORM = {
  id: 'imp-35153',
  proofSection: 'S-frontier',
  question:
    'Derive the imp-35105 E_flow = E_trunc crossover (measured N ~ 1.597752e6 by downslope ' +
    'bisection) in CLOSED FORM as a Banach fixed point, mirroring the imp-33723 closed-form ' +
    'E_coll = E_trunc crossover. Derivation/measurement only on the imp-33601 component model; ' +
    'C_mb GUE-conditional per imp-486; changes no bound; no QED.',
  closedForm:
    'E_flow depends on N ONLY through T0, so E_flow = E_trunc is a HEIGHT solve: ' +
    'T0* = (GRONWALL/2pi/E_trunc) * (log(T0*/2pi) + 1) * log(T0*)  (fixed point, B ~ 5.2024e3); ' +
    'N* = zeroCountAtHeight(T0*)  (Riemann-von Mangoldt count, inverse of effectiveHeightForN).',
  contractionArgument:
    'h(T0) = B (log(T0/2pi)+1) log T0, h_prime = B/T0 * [log T0 + log(T0/2pi) + 1]; measured ' +
    '|h_prime(T0*)| ~ 0.150 < 1 => unique fixed point, Banach iteration converges geometrically. ' +
    'The contraction is ~3.3x MILDER than the imp-33723 E_coll crossover (~0.045), so ~13 ' +
    'iterations reach floating point (vs ~5) and the single-shot leading value is order-of-' +
    'magnitude only, reflecting the (log T0)^2 growth of h versus the pure log T0 of the E_coll map.',
  landmarks: {
    B_amplitude: +B_AMPL.toExponential(6), // (GRONWALL/2pi)/E_trunc ~ 5.202375e3
    T0_star_closed_form: +T0_STAR.toExponential(6), // ~9.213669e5
    N_flow_eq_trunc_closed_form: +N_FLOW_EQ_TRUNC_CF.toExponential(6), // ~1.597752e6
    N_flow_eq_trunc_bisection_imp35105: +N_FLOW_EQ_TRUNC_BIS.toExponential(6), // ~1.597752e6
    contraction_factor_at_root: +CONTRACTION.toExponential(4), // ~1.504e-1
    contraction_analytic: +CONTRACTION_ANALYTIC.toExponential(4), // ~1.504e-1
    imp33723_ecoll_contraction: IMP33723_CONTRACTION, // ~4.54e-2 (the milder-crossover comparison)
    iters_to_floating_point: ITERS_TO_CONVERGE, // ~13 (vs ~5 for the E_coll crossover)
  },
  crossoverCheck: {
    closed_form_vs_bisection_rel: +CF_VS_BIS.toExponential(3), // ~1.2e-15
    eflow_at_T0_star_over_E_trunc: +(eflowOfT0(T0_STAR) / E_TRUNC_PT).toFixed(9), // ~1.0 (balance)
    contraction_ratio_vs_imp33723: +(CONTRACTION / IMP33723_CONTRACTION).toFixed(4), // ~3.3
  },
  finding: {
    D1_closed_form_reproduces_bisection:
      'The height fixed point T0* = (GRONWALL/2pi/E_trunc)(log(T0*/2pi)+1) log T0* converges to ' +
      'T0* ~ 9.2137e5, and N* = zeroCountAtHeight(T0*) ~ 1.597752e6 matches the imp-35105 ' +
      'downslope-bisection crossover to ~1.2e-15 relative. The near-peak E_flow crash is now ' +
      'pinned in closed form (a contraction |h_prime| ~ 0.150), completing the closed-form pair ' +
      'with the imp-33723 E_coll crossover.',
    D2_crossover_is_a_height_solve:
      'Because E_flow(N) = E_flow(T0(N)) has NO explicit N-dependence, the crossover is a fixed ' +
      'point in the HEIGHT T0 pushed back through the RvM count, not an N fixed point like ' +
      'imp-33723. The contraction |h_prime(T0*)| ~ 0.150 is ~3.3x milder than the imp-33723 ' +
      'E_coll crossover (~0.045), so ~13 Banach iterations reach floating point and the single-' +
      'shot leading value is order-of-magnitude only, reflecting h ~ (log T0)^2 versus the pure ' +
      'log T0 growth of the E_coll map.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). The imp-35105 near-peak E_flow = E_trunc ' +
    'crossover, previously located only by downslope bisection at N ~ 1.597752e6, is pinned in ' +
    'CLOSED FORM as a Banach fixed point in the HEIGHT T0: ' +
    'T0* = (GRONWALL/2pi/E_trunc)(log(T0*/2pi)+1) log T0*, with N* = zeroCountAtHeight(T0*) ' +
    '~ 1.597752e6, matching the measurement to ~1.2e-15. The map is a contraction ' +
    '(|h_prime(T0*)| ~ 0.150), unique fixed point, geometric convergence in ~13 iterations -- ' +
    '~3.3x milder than the imp-33723 E_coll crossover (~0.045) because E_flow depends on N only ' +
    'through T0, making this a height solve rather than an N solve. Component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-' +
    'conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; changes ' +
    'no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-35105 (E_flow=E_trunc crossover measured N~1.597752e6); imp-33723 (sibling E_coll=E_trunc ' +
    'closed form); imp-33601 (sigma=1/2 <=> E_coll=E_trunc+E_flow); imp-398 (E_flow C_F prefactor); ' +
    'imp-2631 (E_trunc fixed-strip route); imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 (C_C ' +
    '1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN, zeroCountAtHeight).',
};

export const IMP35153_EFLOW_ETRUNC_CROSSOVER_CLOSED_FORM_ASSERTIONS = [
  {
    // (D1): the closed-form height fixed point reproduces the imp-35105 bisection landmark.
    id: 'imp35153-closed-form-matches-bisection',
    description: 'N* closed-form height fixed point matches imp-35105 downslope bisection to < 1e-9 relative',
    holds: () => CF_VS_BIS < 1e-9 && Math.abs(N_FLOW_EQ_TRUNC_CF / 1.597752e6 - 1) < 5e-3,
  },
  {
    // The balance is genuinely E_flow(T0*) == E_trunc at the closed-form height.
    id: 'imp35153-eflow-equals-etrunc-at-root',
    description: 'E_flow(T0*) == E_trunc to < 1e-6 relative (the crossover balance is met)',
    holds: () => Math.abs(eflowOfT0(T0_STAR) / E_TRUNC_PT - 1) < 1e-6,
  },
  {
    // The fixed-point map is a contraction, so the root is unique and iteration converges.
    id: 'imp35153-fixed-point-is-a-contraction',
    description: 'contraction |h_prime(T0*)| in (0,1); analytic matches central difference to < 1e-6',
    holds: () =>
      CONTRACTION > 0 &&
      CONTRACTION < 1 &&
      Math.abs(CONTRACTION - CONTRACTION_ANALYTIC) < 1e-6,
  },
  {
    // (D2): this crossover is a MILDER contraction than the imp-33723 E_coll crossover.
    id: 'imp35153-milder-than-imp33723-ecoll-crossover',
    description: 'contraction ~0.150 is ~3.3x milder than the imp-33723 E_coll crossover (~0.045); ~13 iters',
    holds: () =>
      CONTRACTION > IMP33723_CONTRACTION &&
      Math.abs(CONTRACTION / IMP33723_CONTRACTION - 3.3) < 0.5 &&
      ITERS_TO_CONVERGE > 5 &&
      ITERS_TO_CONVERGE < 30,
  },
  {
    // Round-trip: the height solve inverts the counting function consistently.
    id: 'imp35153-height-count-roundtrip',
    description: 'effectiveHeightForN(N*) reproduces T0* to < 1e-9 relative (RvM inverse consistency)',
    holds: () => Math.abs(effectiveHeightForN(N_FLOW_EQ_TRUNC_CF) / T0_STAR - 1) < 1e-9,
  },
  {
    // Honesty gate: derivation/measurement only, no QED, no refereed bound is changed.
    id: 'imp35153-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35153_EFLOW_ETRUNC_CROSSOVER_CLOSED_FORM.isRigorous === false &&
      /NO QED/.test(IMP35153_EFLOW_ETRUNC_CROSSOVER_CLOSED_FORM.verdict) &&
      /refereed bound is changed/i.test(IMP35153_EFLOW_ETRUNC_CROSSOVER_CLOSED_FORM.verdict),
  },
];

for (const a of IMP35153_EFLOW_ETRUNC_CROSSOVER_CLOSED_FORM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35153-eflow-etrunc-crossover-closed-form assertion failed: ${a.id}`);
  }
}
