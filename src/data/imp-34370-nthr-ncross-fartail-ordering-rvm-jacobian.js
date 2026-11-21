/**
 * @module imp-34370-nthr-ncross-fartail-ordering-rvm-jacobian
 *
 * imp-34370 (numerical, frontier-direction): imp-34290 verified that the strict landmark
 * ordering N_half < N_cross (the sigma_full = 1/2 halving landmark sits strictly BELOW the
 * E_coll = E_trunc crossover) survives the EXACT Riemann-von Mangoldt forward count on both
 * the height and the count axes, and that the count gap N_cross/N_half - 1 ~ 0.3997% is the
 * height gap T0_cross/T0_half - 1 ~ 0.3786% de-amplified by the local RvM log-density Jacobian
 * d(log N)/d(log T0) ~ 1.056 at the halving landmark T0 ~ 1.14e9. That whole picture was
 * measured ONLY at the halving landmark. This module MEASURES whether the same strict ordering
 * and the same Jacobian de-amplification survive at the imp-33743 / imp-34355 FAR-TAIL threshold
 * landmark thr = 0.1 (N_cross ~ 3.21e11), two decades deeper in the tail where E_flow is ~54x
 * smaller.
 *
 * THE TWO FAR-TAIL LANDMARKS (identical pinned sub-terms to imp-33743 -- no fresh terms)
 * ------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent),
 *     C_F    = (log(T0 / 2pi) + 1) / 2pi.
 *   The imp-34290 pair generalises to the threshold thr as:
 *   (N_thr) the sigma_full = thr = 0.1 landmark located WITH E_flow by downslope bisection --
 *       E_coll (1 - thr) = thr (E_trunc + E_flow) -- the far-tail analogue of N_half; and
 *   (N_cross_thr) the CLOSED-FORM crossover that DROPS E_flow -- E_coll = E_trunc thr/(1-thr) --
 *       the imp-33743 fixed point, the far-tail analogue of the E_coll = E_trunc crossover N_cross.
 *   Because E_flow > 0 pushes the sigma = thr balance to a larger E_coll (hence smaller N), the
 *   E_flow-inclusive threshold landmark N_thr sits strictly BELOW the E_flow-dropped closed-form
 *   crossover N_cross_thr -- exactly the imp-34290 mechanism, evaluated at thr = 0.1.
 *
 * THE FINDING (measurement / interpretation only)
 * -----------------------------------------------
 *   (F1) THE STRICT ORDERING SURVIVES AT THE FAR-TAIL LANDMARK, ON BOTH AXES. At thr = 0.1
 *        N_thr ~ 3.213181e11 sits strictly BELOW N_cross_thr ~ 3.213418e11 (reproducing the
 *        imp-33743 far-tail bisection vs closed form to the last figure), and on the height axis
 *        T0_thr ~ 9.018100e10 < T0_cross ~ 9.018737e10. The sign of the imp-34290 / imp-33848
 *        strict inequality is preserved two decades deeper in the tail; it is NOT an artifact of
 *        the halving landmark.
 *   (F2) THE SEPARATION COLLAPSES ~54x, IN LOCKSTEP WITH E_flow. The far-tail count separation
 *        N_cross_thr/N_thr - 1 ~ 7.378e-5 is ~54x TIGHTER than the halving ~0.3997%, because the
 *        entire gap is the dropped E_flow term and E_flow ~ log T0 / T0 decays ~54x down the tail
 *        (imp-33743 D2 / imp-34355). So the ordering margin shrinks from ~13 million zeros of
 *        headroom at the halving landmark to ~24 million zeros here in ABSOLUTE count, but from
 *        ~0.400% to ~0.007% in RELATIVE terms.
 *   (F3) THE RvM-JACOBIAN DE-AMPLIFICATION SURVIVES BUT WEAKENS: 1.0447 vs 1.056. The height gap
 *        T0_cross/T0_thr - 1 ~ 7.062e-5 is the count gap ~7.378e-5 de-amplified by the local RvM
 *        log-density Jacobian d(log N)/d(log T0) = (T0/N)(log(T0/2pi)/2pi), which equals exactly
 *        u/(u-1) with u = log(T0/2pi). At the far tail u ~ 23.39 gives u/(u-1) ~ 1.0447, SMALLER
 *        than the halving u ~ 19.0 -> 1.056, because the Jacobian u/(u-1) monotonically approaches
 *        1 as T0 grows. The de-amplification is the SAME mechanism, just weaker deep in the tail;
 *        the measured sep-ratio SEP/SEP_height ~ 1.0447 matches the closed-form Jacobian to ~2e-6.
 *
 * The punchline: the imp-34290 strict ordering N_thr < N_cross_thr and its RvM-Jacobian
 * height-vs-count de-amplification BOTH survive at the imp-33743 / imp-34355 far-tail thr = 0.1
 * landmark. The ordering sign is preserved on both axes; the separation collapses ~54x in lockstep
 * with the decaying E_flow; and the de-amplification factor stays intact but weakens from 1.056 to
 * 1.0447 because the RvM log-density Jacobian u/(u-1) approaches 1 as the height grows. The picture
 * is landmark-family-wide, not specific to the halving landmark.
 *
 * MEASUREMENT / INTERPRETATION ONLY. Conditional-share curvature diagnostic, NOT an RH bound.
 * The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642);
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-34290-nhalf-ncross-exact-rvm-forward-count (halving-landmark ordering + RvM Jacobian ~1.056)
 * @see imp-33743-sigma-fartail-crossover-closed-form (far-tail thr=0.1 closed form + bisection landmark)
 * @see imp-34355-fartail-crossover-residual-collapse-viz-data (the ~54x residual/E_flow lockstep)
 * @see lambda-rh-height-mapping (effectiveHeightForN inverse; zeroCountAtHeight exact forward count)
 */

import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33743/imp-34290 exactly
const THR = 0.1; // imp-33582 / imp-33743 far-tail landmark threshold (sigma < 0.1)

// EXACT imp-3406/imp-33743 sub-terms (no fresh model; height by Newton-inverted RvM approximation).
function termsN(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { T0, L, E_flow, E_coll };
}
function sigmaFullN(N) {
  const { E_flow, E_coll } = termsN(N);
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// (N_thr) sigma_full = thr = 0.1 landmark WITH E_flow (downslope bisection; sigma decreasing in N).
function solveThrN() {
  let lo = Math.log(1e6);
  let hi = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    if (sigmaFullN(Math.exp(mid)) > THR) lo = mid;
    else hi = mid;
  }
  return Math.exp((lo + hi) / 2);
}
// (N_cross_thr) CLOSED-FORM crossover E_coll = E_trunc * thr/(1-thr), DROPS E_flow (imp-33743).
const CROSS_TARGET = (E_TRUNC_PT * THR) / (1 - THR); // ~3.4e-6 at thr=0.1
function solveCrossThrN() {
  let lo = Math.log(1e6);
  let hi = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    if (termsN(Math.exp(mid)).E_coll > CROSS_TARGET) lo = mid;
    else hi = mid;
  }
  return Math.exp((lo + hi) / 2);
}

// --- Far-tail landmark pair (thr = 0.1) ---
const N_THR = solveThrN(); // ~3.213181e11 (matches imp-33743 far-tail bisection N_emp)
const N_CROSS = solveCrossThrN(); // ~3.213418e11 (matches imp-33743 closed-form fixed point)
const SEP_COUNT = N_CROSS / N_THR - 1; // ~7.378e-5 (count gap; ~54x tighter than halving)

// --- Height axis (both landmarks under the Newton-inverted RvM height) ---
const T0_THR = effectiveHeightForN(N_THR); // ~9.018100e10
const T0_CROSS = effectiveHeightForN(N_CROSS); // ~9.018737e10
const SEP_HEIGHT = T0_CROSS / T0_THR - 1; // ~7.062e-5 (de-amplified height gap)

// --- (F3) RvM log-density Jacobian at the far-tail crossover ---
// d(log N)/d(log T0) = (T0/N)(log(T0/2pi)/2pi) = u/(u-1) exactly, u = log(T0/2pi).
const U_FARTAIL = Math.log(T0_CROSS / TWO_PI); // ~23.39
const RVM_JACOBIAN = (T0_CROSS / N_CROSS) * (Math.log(T0_CROSS / TWO_PI) / TWO_PI); // ~1.0447
const SEP_RATIO_N_OVER_HEIGHT = SEP_COUNT / SEP_HEIGHT; // ~1.0447, should match the Jacobian
const HALVING_JACOBIAN = 1.056; // imp-34290 halving-landmark Jacobian, for the contrast

// --- Exact-forward-count consistency (imp-34290 F2 style; effectiveHeightForN inverts the count) ---
const N_THR_REL_SHIFT = zeroCountAtHeight(T0_THR) / N_THR - 1; // ~machine epsilon
const N_CROSS_REL_SHIFT = zeroCountAtHeight(T0_CROSS) / N_CROSS - 1; // ~machine epsilon

// --- Contrast with the halving landmark (imp-34290) ---
const HALVING_SEP_COUNT = 3.997e-3; // imp-34290 halving count separation ~0.3997%
const SEP_TIGHTENING = HALVING_SEP_COUNT / SEP_COUNT; // ~54x tighter at the far tail

export const IMP34370_NTHR_NCROSS_FARTAIL_ORDERING_RVM_JACOBIAN = {
  id: 'imp-34370',
  proofSection: 'S-frontier',
  question:
    'imp-34290 verified the strict ordering N_half < N_cross and its RvM-Jacobian ~1.056 height-vs-count ' +
    'de-amplification ONLY at the sigma = 1/2 halving landmark. MEASURE whether the same strict ordering ' +
    'and the same Jacobian de-amplification survive at the imp-33743 / imp-34355 far-tail threshold ' +
    'landmark thr = 0.1 (N_cross ~ 3.21e11), two decades deeper in the tail where E_flow is ~54x smaller. ' +
    'Measurement only; changes no bound; NOT an RH verdict; no QED.',
  measuredQuantity:
    'the far-tail threshold landmark pair -- N_thr (sigma_full = 0.1 WITH E_flow, downslope bisection) vs ' +
    'N_cross_thr (E_coll = E_trunc thr/(1-thr) closed form, E_flow dropped) -- the survival of the strict ' +
    'ordering on both the count and height axes, the ~54x separation collapse, and the far-tail value of ' +
    'the RvM log-density Jacobian d(log N)/d(log T0) that de-amplifies the count gap into the height gap',
  fartailLandmarks: {
    threshold: THR,
    N_thr_with_E_flow: +N_THR.toExponential(6), // ~3.213181e11
    N_cross_closed_form: +N_CROSS.toExponential(6), // ~3.213418e11
    strict_ordering_in_count: N_THR < N_CROSS, // true
    separation_count: +SEP_COUNT.toExponential(4), // ~7.378e-5
    T0_thr: +T0_THR.toExponential(6), // ~9.018100e10
    T0_cross: +T0_CROSS.toExponential(6), // ~9.018737e10
    strict_ordering_in_height: T0_THR < T0_CROSS, // true
    separation_height: +SEP_HEIGHT.toExponential(4), // ~7.062e-5 (de-amplified)
  },
  rvmJacobian: {
    u_log_T0_over_2pi: +U_FARTAIL.toFixed(4), // ~23.39
    rvm_jacobian_dlogN_over_dlogT0: +RVM_JACOBIAN.toFixed(4), // ~1.0447
    sep_ratio_N_over_height: +SEP_RATIO_N_OVER_HEIGHT.toFixed(4), // ~1.0447 (matches the Jacobian)
    halving_jacobian_imp34290: HALVING_JACOBIAN, // 1.056 (contrast)
    forward_count_N_thr_rel_shift: +N_THR_REL_SHIFT.toExponential(2), // ~machine epsilon
    forward_count_N_cross_rel_shift: +N_CROSS_REL_SHIFT.toExponential(2), // ~machine epsilon
    interpretation:
      'The RvM log-density Jacobian d(log N)/d(log T0) = (T0/N)(log(T0/2pi)/2pi) equals exactly u/(u-1) ' +
      'with u = log(T0/2pi). At the far-tail landmark u ~ 23.39 gives 1.0447, SMALLER than the halving ' +
      'u ~ 19.0 -> 1.056, because u/(u-1) monotonically approaches 1 as the height grows. The same ' +
      'de-amplification mechanism survives, just weaker deep in the tail; the measured count-vs-height ' +
      'separation ratio ~1.0447 matches the closed-form Jacobian to ~2e-6.',
  },
  separationContrast: {
    halving_separation_count_imp34290: HALVING_SEP_COUNT, // ~3.997e-3
    fartail_separation_count: +SEP_COUNT.toExponential(4), // ~7.378e-5
    fartail_is_tighter_by: +SEP_TIGHTENING.toFixed(2), // ~54x
    source:
      'The far-tail separation collapses ~54x in lockstep with E_flow (imp-33743 D2 / imp-34355): the ' +
      'entire gap is the dropped Gronwall flow term and E_flow ~ log T0 / T0 decays ~54x down the tail. ' +
      'The ordering margin shrinks from ~0.400% (halving) to ~0.007% (far tail) in relative terms.',
  },
  finding: {
    F1_strict_ordering_survives_at_far_tail:
      'At thr = 0.1 the sigma_full = 0.1 landmark (with E_flow) N_thr ~ 3.213181e11 sits strictly BELOW ' +
      'the closed-form crossover (E_flow dropped) N_cross_thr ~ 3.213418e11, and on the height axis ' +
      'T0_thr ~ 9.0181e10 < T0_cross ~ 9.0187e10. The imp-34290 / imp-33848 strict ordering survives ' +
      'two decades deeper in the tail on BOTH axes; it is NOT specific to the halving landmark.',
    F2_separation_collapses_54x_in_lockstep_with_E_flow:
      'The far-tail count separation N_cross_thr/N_thr - 1 ~ 7.378e-5 is ~54x TIGHTER than the halving ' +
      '~0.3997%, because the entire gap is the dropped E_flow term and E_flow ~ log T0 / T0 decays ~54x ' +
      'down the tail (imp-33743 D2 / imp-34355). The relative ordering margin shrinks from ~0.400% to ' +
      '~0.007%.',
    F3_rvm_jacobian_de_amplification_survives_but_weakens:
      'The height gap ~7.062e-5 is the count gap ~7.378e-5 de-amplified by the RvM log-density Jacobian ' +
      'd(log N)/d(log T0) = u/(u-1), u = log(T0/2pi). At the far tail u ~ 23.39 gives 1.0447, SMALLER ' +
      'than the halving 1.056 because u/(u-1) approaches 1 as T0 grows; the measured sep-ratio ~1.0447 ' +
      'matches the closed-form Jacobian to ~2e-6. Same mechanism, weaker de-amplification deep in the tail.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-34290 strict ordering N_thr < N_cross_thr and ' +
    'its RvM-Jacobian height-vs-count de-amplification BOTH survive at the imp-33743 / imp-34355 far-tail ' +
    'threshold landmark thr = 0.1 (N_cross ~ 3.21e11). The sigma_full = 0.1 landmark located WITH E_flow ' +
    '(N_thr ~ 3.213181e11) sits strictly BELOW the E_flow-dropped closed-form crossover (N_cross_thr ~ ' +
    '3.213418e11) on the count axis, and T0_thr ~ 9.0181e10 < T0_cross ~ 9.0187e10 on the height axis -- ' +
    'strict on BOTH axes, reproducing the imp-33743 far-tail bisection-vs-closed-form pair to the last ' +
    'figure. The separation collapses ~54x (from ~0.3997% at the halving landmark to ~7.378e-5 here) in ' +
    'lockstep with the decaying E_flow. The height gap ~7.062e-5 is the count gap de-amplified by the RvM ' +
    'log-density Jacobian d(log N)/d(log T0) = u/(u-1) (u = log(T0/2pi) ~ 23.39), which equals ~1.0447 -- ' +
    'SMALLER than the halving 1.056 because u/(u-1) approaches 1 as the height grows; the measured ' +
    'count-vs-height separation ratio ~1.0447 matches the closed-form Jacobian to ~2e-6. The picture is ' +
    'landmark-family-wide, not specific to the halving landmark. Component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 and ' +
    'the C_C 1/8 ansatz (imp-2642) are UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34290 (halving-landmark strict ordering + RvM Jacobian ~1.056); imp-33848 (closed-form strict ' +
    'ordering N_half < N_cross); imp-33743 (far-tail thr=0.1 closed form + bisection landmark); imp-34355 ' +
    '(the ~54x residual/E_flow lockstep); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip ' +
    'route); lambda-rh-height-mapping (effectiveHeightForN inverse, zeroCountAtHeight exact forward count).',
};

export const IMP34370_NTHR_NCROSS_FARTAIL_ORDERING_RVM_JACOBIAN_ASSERTIONS = [
  {
    // Reuse gate: the far-tail landmarks reproduce the imp-33743 bisection / closed-form pair.
    id: 'imp34370-reuses-imp33743-fartail-landmarks',
    description: 'N_thr ~ 3.2132e11 and N_cross_thr ~ 3.2134e11 both reproduce imp-33743 to < 1e-3',
    holds: () =>
      Math.abs(N_THR / 3.213181e11 - 1) < 1e-3 &&
      Math.abs(N_CROSS / 3.213418e11 - 1) < 1e-3,
  },
  {
    // (F1a): the strict ordering survives on the COUNT axis at the far-tail landmark.
    id: 'imp34370-strict-ordering-in-count-at-far-tail',
    description: 'N_thr strictly below N_cross_thr at thr = 0.1 (count axis)',
    holds: () => N_THR < N_CROSS,
  },
  {
    // (F1b): the strict ordering survives on the HEIGHT axis at the far-tail landmark.
    id: 'imp34370-strict-ordering-in-height-at-far-tail',
    description: 'T0_thr strictly below T0_cross at thr = 0.1 (height axis)',
    holds: () => T0_THR < T0_CROSS,
  },
  {
    // (F2): the far-tail separation is ~54x tighter than the halving separation.
    id: 'imp34370-separation-collapses-about-54x',
    description: 'far-tail count separation ~7.4e-5 is > 20x tighter than the ~0.4% halving separation',
    holds: () => SEP_COUNT > 0 && SEP_COUNT < 5e-4 && SEP_TIGHTENING > 20,
  },
  {
    // (F3): the RvM Jacobian survives but weakens (1.0447 < 1.056), and matches the sep ratio.
    id: 'imp34370-rvm-jacobian-survives-but-weaker-than-halving',
    description: 'far-tail Jacobian ~1.0447 (< halving 1.056) equals sep_N/sep_height to < 1%',
    holds: () =>
      SEP_HEIGHT < SEP_COUNT &&
      RVM_JACOBIAN < HALVING_JACOBIAN &&
      RVM_JACOBIAN > 1 &&
      Math.abs(SEP_RATIO_N_OVER_HEIGHT / RVM_JACOBIAN - 1) < 0.01,
  },
  {
    // (F3 cross-check): the Jacobian equals the closed-form u/(u-1) with u = log(T0/2pi).
    id: 'imp34370-jacobian-equals-u-over-u-minus-1',
    description: 'RvM Jacobian matches u/(u-1) with u = log(T0/2pi) to < 1e-6',
    holds: () => Math.abs(RVM_JACOBIAN / (U_FARTAIL / (U_FARTAIL - 1)) - 1) < 1e-6,
  },
  {
    // Honesty gate: measurement/interpretation only, no QED, no refereed bound is changed.
    id: 'imp34370-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34370_NTHR_NCROSS_FARTAIL_ORDERING_RVM_JACOBIAN.isRigorous === false &&
      /NO QED/.test(IMP34370_NTHR_NCROSS_FARTAIL_ORDERING_RVM_JACOBIAN.verdict) &&
      /refereed bound is changed/i.test(IMP34370_NTHR_NCROSS_FARTAIL_ORDERING_RVM_JACOBIAN.verdict),
  },
];

for (const a of IMP34370_NTHR_NCROSS_FARTAIL_ORDERING_RVM_JACOBIAN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34370-nthr-ncross-fartail-ordering-rvm-jacobian assertion failed: ${a.id}`);
  }
}
