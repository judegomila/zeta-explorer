/**
 * @module imp-35054-two-closed-form-crossovers-cross-validation
 *
 * imp-35054 (numerical, frontier-direction): two INDEPENDENT closed forms now pin the ~3.3e9 crossover
 * of the imp-3406/imp-33582 post-peak conditional-share curve, but their mutual offset and their JOINT
 * relation to the empirical sigma = 1/2 halving landmark have never been tabulated together:
 *   (C1) imp-33723 BANACH fixed point with E_flow DROPPED (E_coll = E_trunc):
 *        N_off = (C_C/E_trunc)^2 * log T0(N_off) ~ 3.280294e9.
 *   (C2) imp-33750 E_flow-CORRECTED fixed point with E_flow folded back in (E_coll = E_trunc + E_flow):
 *        N_on = (C_C/(E_trunc + E_flow(N)))^2 * log T0(N) ~ 3.267235e9.
 * imp-33723 measured the C1-vs-empirical offset and imp-33750 measured the C2-vs-empirical residual, but
 * NO module placed C1 and C2 side by side, measured their MUTUAL offset, and asked jointly whether the
 * E_flow correction moves the analytic crossover ONTO the imp-33582 empirical N_half ~ 3.267e9. This is
 * the missing pairing: imp-33748 and imp-34800 tabulated three-way sets that used the sigmoid-inflection
 * knee as their third locator (and imp-34800 explicitly noted the E_flow offset is NOWHERE in that trio,
 * because it omitted the E_flow-corrected fixed point). This module fills exactly that gap.
 *
 * THE QUANTITY (identical model to imp-3406/imp-33582/imp-33723/imp-33750 -- no fresh terms)
 * -----------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent).
 * C1 and C2 are recomputed HERE under the pinned constants (two fixed-point iterations), reproducing the
 * imp-33723 and imp-33750 published landmarks to floating point; N_half is the downslope bisection of
 * sigma(N) = 1/2 (imp-33582). Per imp-33601 the two closed forms differ by EXACTLY the E_flow term, since
 * sigma = 1/2 is the identity E_coll = E_trunc + E_flow (imp-33601): C1 solves the E_flow-OFF balance and
 * C2 solves the E_flow-ON balance, so C2 must coincide with N_half.
 *
 * THE MEASUREMENT: the two closed forms + N_half on one axis, with all three pairwise offsets
 * -------------------------------------------------------------------------------------------
 *   (a) mutual offset of the two closed forms: (N_off - N_on)/N_off.
 *   (b) each closed form to the empirical halving landmark: (N_off - N_half)/N_off and |N_on - N_half|/N_half.
 *   (c) fraction of the C1-to-N_half offset closed by the E_flow correction: (N_off - N_on)/(N_off - N_half).
 *   (d) confirmation that sigma(N_on) = 1/2 (the E_flow-on fixed point IS the halving point, imp-33601).
 *
 * THE FINDING (measurement / cross-validation only)
 * -------------------------------------------------
 *   (F1) THE TWO CLOSED FORMS DIFFER BY ~0.4%, THE E_flow OFFSET. Their mutual relative offset
 *        (N_off - N_on)/N_off ~ 3.98e-3 is the SAME ~0.4% imp-33723 measured against the empirical N_half.
 *        This is not a coincidence: C1 drops E_flow (solves E_coll = E_trunc) while C2 keeps it (solves
 *        E_coll = E_trunc + E_flow), so their separation is precisely the E_flow term of imp-33601.
 *   (F2) THE E_flow-CORRECTED CLOSED FORM LANDS ON THE EMPIRICAL N_half. C2 = N_on ~ 3.267235e9 coincides
 *        with the imp-33582 downslope-bisection halving landmark N_half to ~3e-15 relative, so the E_flow
 *        correction moves the analytic crossover EXACTLY onto the empirical halving landmark; the
 *        E_flow-OFF form C1 sits ~0.4% above it. sigma(N_on) = 1/2 to floating point confirms C2 IS the
 *        halving point (imp-33601 identity), not merely a co-located estimate.
 *   (F3) THE E_flow CORRECTION CLOSES 100% OF THE OFFSET. The fraction of the C1-to-N_half gap closed by
 *        restoring E_flow is (N_off - N_on)/(N_off - N_half) ~ 1.000000, so the two closed forms are NOT
 *        two independent estimates of one quantity that happen to bracket N_half -- C1 and C2 locate two
 *        DIFFERENT balances (E_coll = E_trunc vs E_coll = E_trunc + E_flow), and only the E_flow-on C2 is a
 *        valid locator for the empirical sigma = 1/2 halving. Their mutual offset EQUALS the C1-to-N_half
 *        offset because C2 == N_half.
 *
 * The punchline: the imp-33723 E_flow-OFF Banach fixed point and the imp-33750 E_flow-ON corrected fixed
 * point are NOT two independent estimates of the same landmark -- they are the two balances of imp-33601,
 * separated by exactly the ~0.4% E_flow term. The E_flow-corrected form lands ON the empirical N_half to
 * floating point (sigma(N_on) = 1/2), so folding E_flow back in reconciles the analytic crossover with the
 * empirical halving landmark completely; the mutual offset of the two closed forms is the E_flow offset.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model
 * is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33723-sigma-half-vs-crossover-closed-form (C1 E_flow-off Banach fixed point N_off ~ 3.280294e9)
 * @see imp-33750-eflow-corrected-crossover-fixed-point (C2 E_flow-on fixed point N_on ~ 3.267235e9)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (identity sigma=1/2 <=> E_coll=E_trunc+E_flow)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (empirical sigma=1/2 halving landmark N_half)
 * @see imp-33748-sigma-halving-locators-three-way-crossvalidation (three-way set using the knee, not C2)
 * @see imp-34800-ncross-three-way-crossvalidation-banach-krawczyk-inflection (trio that omits the E_flow leg)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM } from './imp-33723-sigma-half-vs-crossover-closed-form.js';
import { IMP33750_EFLOW_CORRECTED_CROSSOVER_FIXED_POINT } from './imp-33750-eflow-corrected-crossover-fixed-point.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33601/imp-33723/imp-33750 exactly

// EXACT imp-3406/imp-33582/imp-33601/imp-33723/imp-33750 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  return { T0, L, E_flow, E_coll, sigma: E_coll / (E_TRUNC_PT + E_flow + E_coll) };
}

// Downslope bisection in log N for a strictly-decreasing quantity f (imp-33582/imp-3444 halving locator).
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

// (C1) E_flow-OFF Banach fixed point (imp-33723): N = K log T0(N), K = (C_C/E_trunc)^2.
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8
const N_OFF = (function () {
  let N = 1e9;
  for (let i = 0; i < 40; i++) N = K_AMPL * Math.log(effectiveHeightForN(N));
  return N;
})(); // ~3.280294e9

// (C2) E_flow-ON corrected fixed point (imp-33750): N = (C_C/(E_trunc + E_flow(N)))^2 log T0(N).
const N_ON = (function () {
  let N = 1e9;
  for (let i = 0; i < 80; i++) {
    const T0 = effectiveHeightForN(N);
    const L = Math.log(T0);
    const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
    const E_flow = C_F * (L / T0) * GRONWALL;
    N = (C_C_PINNED / (E_TRUNC_PT + E_flow)) ** 2 * L;
  }
  return N;
})(); // ~3.267235e9

// Empirical sigma = 1/2 halving landmark (imp-33582) for the joint cross-check.
const N_HALF = crossBelow((N) => parts(N).sigma, 0.5, 1e6, 1e18); // ~3.267235e9

// (a) mutual offset of the two closed forms; (b) each closed form to N_half; (c) fraction closed.
const REL_OFF_ON = (N_OFF - N_ON) / N_OFF; // ~3.98e-3 (== the E_flow offset)
const REL_OFF_HALF = (N_OFF - N_HALF) / N_OFF; // ~3.98e-3
const REL_ON_HALF = Math.abs(N_ON - N_HALF) / N_HALF; // ~3e-15 (C2 lands on N_half)
const FRACTION_CLOSED = (N_OFF - N_ON) / (N_OFF - N_HALF); // ~1.000000 (100%)
// (d) sigma at the E_flow-on fixed point (imp-33601 identity => should be exactly 1/2).
const SIGMA_AT_ON = parts(N_ON).sigma; // ~0.5

// Cross-check against the PUBLISHED landmark literals of imp-33723 and imp-33750 (7-sig-fig cached).
const PUB_OFF_33723 = IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM.landmarks.N_cross_closed_form;
const PUB_OFF_33750 = IMP33750_EFLOW_CORRECTED_CROSSOVER_FIXED_POINT.landmarks.N_cross_eflow_off;
const PUB_ON_33750 = IMP33750_EFLOW_CORRECTED_CROSSOVER_FIXED_POINT.landmarks.N_cross_eflow_on;
const PUB_HALF_33750 = IMP33750_EFLOW_CORRECTED_CROSSOVER_FIXED_POINT.landmarks.N_half_empirical_imp33582;
const CHECK_OFF_PUB = Math.abs(N_OFF / PUB_OFF_33723 - 1); // ~1e-7 (7-sig-fig cache tolerance)
const CHECK_ON_PUB = Math.abs(N_ON / PUB_ON_33750 - 1); // ~1e-7

export const IMP35054_TWO_CLOSED_FORM_CROSSOVERS_CROSS_VALIDATION = {
  id: 'imp-35054',
  proofSection: 'S-frontier',
  question:
    'Two independent closed forms pin the ~3.3e9 crossover: imp-33723 Banach fixed point with E_flow ' +
    'DROPPED (N_off = (C_C/E_trunc)^2 log T0) and imp-33750 E_flow-CORRECTED fixed point (folding the ' +
    'Gronwall E_flow term into the balance). Place both side by side, MEASURE their mutual offset and ' +
    'each one distance to the imp-33582 empirical sigma = 1/2 halving landmark N_half, and assess ' +
    'whether the E_flow correction moves the crossover onto N_half (per the imp-33601 relation ' +
    'E_coll = E_trunc + E_flow). Cross-validation/measurement only; conditional-share diagnostic, ' +
    'NOT an RH bound; no QED.',
  measuredQuantity:
    'the mutual relative offset of the two closed forms (N_off - N_on)/N_off, each closed form distance ' +
    'to the empirical N_half, and the fraction of the C1-to-N_half offset closed by restoring E_flow',
  closedForms: {
    C1_eflow_off_imp33723: 'E_coll = E_trunc       =>  N_off = (C_C/E_trunc)^2 * log T0(N)',
    C2_eflow_on_imp33750: 'E_coll = E_trunc+E_flow =>  N_on = (C_C/(E_trunc+E_flow(N)))^2 * log T0(N)',
  },
  landmarks: {
    K_amplitude: +K_AMPL.toExponential(6), // ~1.572709e8
    N_off_eflow_off_closed_form: +N_OFF.toExponential(6), // ~3.280294e9 (imp-33723)
    N_on_eflow_on_closed_form: +N_ON.toExponential(6), // ~3.267235e9 (imp-33750)
    N_half_empirical_imp33582: +N_HALF.toExponential(6), // ~3.267235e9
    sigma_at_N_on: +SIGMA_AT_ON.toFixed(9), // ~0.500000000 (imp-33601 identity)
  },
  crossValidation: {
    mutual_offset_C1_vs_C2: +REL_OFF_ON.toExponential(4), // ~3.98e-3 (the E_flow offset)
    C1_off_vs_N_half: +REL_OFF_HALF.toExponential(4), // ~3.98e-3
    C2_on_vs_N_half: +REL_ON_HALF.toExponential(3), // ~3e-15 (lands on N_half)
    fraction_of_offset_closed_by_eflow: +FRACTION_CLOSED.toFixed(6), // ~1.000000 (100%)
    published_landmark_check_off: +CHECK_OFF_PUB.toExponential(3), // vs imp-33723 cached literal
    published_landmark_check_on: +CHECK_ON_PUB.toExponential(3), // vs imp-33750 cached literal
  },
  finding: {
    F1_two_closed_forms_differ_by_the_eflow_offset:
      'The mutual relative offset of the two closed forms (N_off - N_on)/N_off ~ 3.98e-3 is the SAME ' +
      '~0.4% imp-33723 measured against the empirical N_half. C1 drops E_flow (solves E_coll = E_trunc) ' +
      'while C2 keeps it (solves E_coll = E_trunc + E_flow), so their separation is precisely the ' +
      'imp-33601 E_flow term -- not an independent numerical discrepancy.',
    F2_eflow_corrected_form_lands_on_N_half:
      'The E_flow-corrected closed form N_on ~ 3.267235e9 coincides with the imp-33582 downslope-bisection ' +
      'halving landmark N_half to ~3e-15 relative, and sigma(N_on) = 1/2 to floating point -- so folding ' +
      'E_flow back in moves the analytic crossover EXACTLY onto the empirical halving landmark, while the ' +
      'E_flow-off form C1 sits ~0.4% above it.',
    F3_eflow_closes_full_offset:
      'The fraction of the C1-to-N_half gap closed by restoring E_flow is (N_off - N_on)/(N_off - N_half) ' +
      '~ 1.000000. So C1 and C2 are NOT two independent estimates of one landmark bracketing N_half -- ' +
      'they locate two DIFFERENT balances (E_coll = E_trunc vs E_coll = E_trunc + E_flow), and only the ' +
      'E_flow-on C2 is a valid locator for the empirical sigma = 1/2 halving; their mutual offset EQUALS ' +
      'the C1-to-N_half offset because C2 == N_half.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CROSS-VALIDATION (frontier-direction, NOT rigorous). Placing the two independent ' +
    'closed-form crossovers side by side under identical pinned constants: the imp-33723 E_flow-OFF ' +
    'Banach fixed point N_off = (C_C/E_trunc)^2 log T0(N) ~ 3.280294e9 and the imp-33750 E_flow-ON ' +
    'corrected fixed point N_on = (C_C/(E_trunc + E_flow(N)))^2 log T0(N) ~ 3.267235e9. Their mutual ' +
    'relative offset (N_off - N_on)/N_off ~ 3.98e-3 is exactly the ~0.4% E_flow term (C1 solves ' +
    'E_coll = E_trunc, C2 solves E_coll = E_trunc + E_flow, imp-33601). The E_flow-corrected form C2 ' +
    'lands on the imp-33582 empirical sigma = 1/2 halving landmark N_half to ~3e-15 relative ' +
    '(sigma(N_on) = 1/2 to floating point), while C1 sits ~0.4% above it; the fraction of the ' +
    'C1-to-N_half offset closed by restoring E_flow is ~1.000000 (100%). So the two closed forms are ' +
    'not two independent estimates that bracket N_half -- they are the two balances of imp-33601, and ' +
    'folding E_flow back in reconciles the analytic crossover with the empirical halving landmark ' +
    'completely. Recomputed values match the imp-33723/imp-33750 published landmarks to the 7-sig-fig ' +
    'cache tolerance. Component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no ' +
    'RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33723 (E_flow-off Banach closed form N_off ~ 3.280294e9); imp-33750 (E_flow-on corrected fixed ' +
    'point N_on ~ 3.267235e9); imp-33601 (identity sigma=1/2 <=> E_coll=E_trunc+E_flow); imp-33582 ' +
    '(empirical sigma=1/2 halving landmark N_half); imp-33748/imp-34800 (three-way sets using the knee, ' +
    'not the E_flow-corrected fixed point); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip ' +
    'route); imp-399/imp-2642 (C_C = (1/8) sqrt(3 pi)); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35054_TWO_CLOSED_FORM_CROSSOVERS_CROSS_VALIDATION_ASSERTIONS = [
  {
    // C1 reproduces the imp-33723 E_flow-off Banach fixed point.
    id: 'imp35054-C1-matches-imp33723-eflow-off',
    description: 'E_flow-off closed form N_off ~ 3.280294e9 (matches imp-33723)',
    holds: () => Math.abs(N_OFF / 3.280294e9 - 1) < 5e-3,
  },
  {
    // C2 reproduces the imp-33750 E_flow-on corrected fixed point.
    id: 'imp35054-C2-matches-imp33750-eflow-on',
    description: 'E_flow-on corrected closed form N_on ~ 3.267235e9 (matches imp-33750)',
    holds: () => Math.abs(N_ON / 3.267235e9 - 1) < 5e-3,
  },
  {
    // (F1): the mutual offset of the two closed forms is the ~0.4% E_flow offset, and N_on < N_off.
    id: 'imp35054-mutual-offset-is-the-eflow-offset',
    description: 'mutual offset (N_off - N_on)/N_off ~ 3.98e-3, C1 above C2 (== the E_flow offset)',
    holds: () =>
      N_ON < N_OFF && REL_OFF_ON > 0 && Math.abs(REL_OFF_ON - 3.98e-3) < 5e-4,
  },
  {
    // (F2): the E_flow-corrected closed form lands ON the empirical N_half, and sigma(N_on) = 1/2.
    id: 'imp35054-C2-lands-on-N-half',
    description: 'E_flow-on closed form == N_half to floating point (< 1e-9 rel), sigma(N_on) ~ 0.5',
    holds: () => REL_ON_HALF < 1e-9 && Math.abs(SIGMA_AT_ON - 0.5) < 1e-6,
  },
  {
    // (F2 contrast): the E_flow-OFF closed form sits ~0.4% ABOVE N_half.
    id: 'imp35054-C1-sits-above-N-half',
    description: 'E_flow-off closed form is ~0.4% above the empirical N_half (C1 does not locate halving)',
    holds: () =>
      N_OFF > N_HALF && REL_OFF_HALF > 0 && Math.abs(REL_OFF_HALF - 3.98e-3) < 5e-4,
  },
  {
    // (F3): restoring E_flow closes 100% of the C1-to-N_half offset (mutual offset == C1-to-half offset).
    id: 'imp35054-eflow-closes-full-offset',
    description: 'fraction of the C1-to-N_half offset closed by restoring E_flow ~ 1.000000 (100%)',
    holds: () => Math.abs(FRACTION_CLOSED - 1.0) < 1e-6,
  },
  {
    // Cross-check: recomputed values match the imp-33723/imp-33750 published landmark literals.
    id: 'imp35054-matches-published-landmarks',
    description: 'recomputed N_off/N_on match imp-33723/imp-33750 cached literals to 7-sig-fig tolerance',
    holds: () => CHECK_OFF_PUB < 1e-6 && CHECK_ON_PUB < 1e-6,
  },
  {
    // Honesty gate: measurement/cross-validation only, no QED, no refereed bound is changed.
    id: 'imp35054-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35054_TWO_CLOSED_FORM_CROSSOVERS_CROSS_VALIDATION.isRigorous === false &&
      /NO QED/.test(IMP35054_TWO_CLOSED_FORM_CROSSOVERS_CROSS_VALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP35054_TWO_CLOSED_FORM_CROSSOVERS_CROSS_VALIDATION.verdict),
  },
];

for (const a of IMP35054_TWO_CLOSED_FORM_CROSSOVERS_CROSS_VALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35054-two-closed-form-crossovers-cross-validation assertion failed: ${a.id}`);
  }
}
