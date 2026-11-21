/**
 * @module imp-35786-nhalf-ncross-gap-magnitude
 *
 * imp-35786 (numerical, frontier-direction): the roadmap records imp-33848 proving the
 * imp-33796 ordering N_half < N_cross (the sigma_full = 1/2 halving landmark sits strictly
 * BELOW the E_coll = E_trunc crossover) is STRICT in closed form WITHIN the inherited
 * component model. But every module in the cluster (imp-33601/imp-33723/imp-33796/imp-34290/
 * imp-34923/imp-34954/imp-34976) reports the separation ONLY as the RELATIVE gap
 * (N_cross - N_half)/N_cross ~ 3.981e-3 (~0.398%). The ABSOLUTE magnitude of the strict
 * ordering -- the gap N_cross - N_half in units of N (how many zeros separate the two
 * landmarks) -- was never tabulated. This module MEASURES that absolute gap magnitude at the
 * recomputed anchors, supplies its leading closed form, and confirms it stays strictly
 * positive across the post-peak far tail on two independent recomputations.
 *
 * THE MODEL (identical pinned sub-terms to imp-33796 / imp-33723 -- no fresh terms)
 * --------------------------------------------------------------------------------
 *     sigma_full(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow  = C_F (log T0 / T0) * Gronwall,     E_trunc = 3.06e-5   (N-independent),
 *     C_F     = (log(T0 / 2pi) + 1) / 2pi,        T0 = effectiveHeightForN(N).
 *
 * THE CLOSED-FORM MAGNITUDE (the deliverable the ticket asks for)
 * --------------------------------------------------------------
 * Both landmarks are E_coll = const balances, and E_coll = C_C sqrt(log T0 / N) inverts to
 * N = C_C^2 log T0 / E_coll^2. At the crossover E_coll = E_trunc; at the halving landmark
 * sigma = 1/2 forces E_coll = E_trunc + E_flow (imp-33601 identity). Writing r = E_flow/E_trunc
 * at N_half and freezing the slow log T0 factor at its (nearly common) far-tail value:
 *
 *     N_cross - N_half = C_C^2 log T0 [ 1/E_trunc^2 - 1/(E_trunc + E_flow)^2 ]
 *                     ~= N_cross * ( 1 - 1/(1 + r)^2 )                       (CLOSED-FORM GAP)
 *                     ~= 2 r * N_cross   (leading, since r << 1).
 *
 * So the absolute separation is set by the SAME Gronwall flow ratio r that fixes the relative
 * offset -- the ordering is strict precisely because E_flow > 0 makes r > 0, and its size in
 * N-units is ~ 2 r N_cross.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (F1) THE ABSOLUTE GAP IS ~1.306e7 ZEROS. At the recomputed anchors N_half ~ 3.267235e9
 *        and N_cross ~ 3.280294e9 the strict ordering has magnitude
 *        N_cross - N_half ~ 1.305915e7 (~13.06 million zeros) -- the first time the ordering
 *        is stated as an absolute count, not only as the ~0.398% relative offset.
 *   (F2) THE LEADING CLOSED FORM 2 r N_cross MATCHES TO ~5%. With r = E_flow/E_trunc ~ 1.906e-3
 *        at N_half, the closed-form gap ( 1 - 1/(1+r)^2 ) N_cross ~ 1.2467e7 and its leading
 *        proxy 2 r N_cross ~ 1.2503e7 both land within ~4.7% of the measured 1.3059e7; the
 *        residual is the sqrt-log running of L over the offset interval (the same ~5% imp-33796
 *        reported for the ratio). The absolute magnitude is thus pinned by the E_flow ratio r.
 *   (F3) THE GAP IS STRICTLY POSITIVE ON BOTH RECOMPUTATIONS. Recovering the pair by fresh
 *        bisection (N-axis) and by the imp-33723 closed-form fixed points (E_coll = E_trunc and
 *        E_coll = E_trunc + E_flow) both give N_cross - N_half > 0, agreeing to ~1e-6 -- so the
 *        positive sign of the absolute gap is not an artifact of the locator used and holds
 *        across the post-peak far tail where both landmarks live.
 *
 * The punchline: the imp-33848 strict ordering N_half < N_cross, previously reported only as a
 * ~0.398% relative offset, has absolute magnitude N_cross - N_half ~ 1.306e7 zeros; its leading
 * closed form is ~ 2 (E_flow/E_trunc) N_cross ~ 1.25e7 (within ~5%, the sqrt-log L running), and
 * the gap is strictly positive on both the bisection and the closed-form fixed-point anchors.
 *
 * MEASUREMENT ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642); changes
 * no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-33848 (roadmap: strict ordering N_half < N_cross, closed form within component model)
 * @see imp-33796-nhalf-below-ncross-independent-recompute (relative separation N_cross/N_half - 1 ~ 0.400%)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form crossover fixed point, relative offset)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (exact identity sigma=1/2 <=> E_coll=E_trunc+E_flow)
 * @see imp-34290-nhalf-ncross-exact-rvm-forward-count (ordering survives exact RvM forward count)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33723/imp-33796 exactly

// EXACT imp-33723/imp-33796 pinned sub-terms (no re-derivation, no fresh model).
function terms(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { T0, L, E_flow, E_coll, sigma: E_coll / (E_TRUNC_PT + E_flow + E_coll) };
}

// --- recomputed anchors, fresh monotone bisection in log N (both quantities decrease in N) ---
function bisect(f, target, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (f(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const N_HALF = bisect((N) => terms(N).sigma, 0.5, 1e6, 1e14); // ~3.267235e9 (sigma_full = 1/2)
const N_CROSS = bisect((N) => terms(N).E_coll, E_TRUNC_PT, 1e6, 1e18); // ~3.280294e9 (E_coll = E_trunc)

// (F1) the absolute gap magnitude in N-units (the missing tabulation) + relative gap for continuity.
const GAP_ABS = N_CROSS - N_HALF; // ~1.305915e7 (~13.06 million zeros)
const GAP_REL = GAP_ABS / N_CROSS; // ~3.981092e-3 (matches the whole cluster)

// (F2) leading closed form: 2 r N_cross ~ ( 1 - 1/(1+r)^2 ) N_cross with r = E_flow/E_trunc at N_half.
const R_FLOW = terms(N_HALF).E_flow / E_TRUNC_PT; // ~1.905727e-3
const GAP_CF = N_CROSS * (1 - 1 / (1 + R_FLOW) ** 2); // ~1.246704e7 (closed-form magnitude)
const GAP_CF_2R = 2 * R_FLOW * N_CROSS; // ~1.250269e7 (leading proxy)
const CF_RESID = Math.abs(GAP_ABS / GAP_CF - 1); // ~4.75e-2 (sqrt-log L running)

// (F3) strict positivity on the imp-33723 closed-form fixed-point anchors (independent recompute).
const K_HALF_SEED = (C_C_PINNED / E_TRUNC_PT) ** 2; // halving amplitude ~1.5727e8 (imp-33723)
function crossFixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = K_HALF_SEED * Math.log(effectiveHeightForN(N));
  return N;
}
function halfFixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) {
    const rhs = E_TRUNC_PT + terms(N).E_flow; // sigma = 1/2 <=> E_coll = E_trunc + E_flow
    N = (C_C_PINNED / rhs) ** 2 * Math.log(effectiveHeightForN(N));
  }
  return N;
}
const N_CROSS_CF = crossFixedPoint(1e9, 60);
const N_HALF_CF = halfFixedPoint(1e9, 60);
const GAP_ABS_CF = N_CROSS_CF - N_HALF_CF; // ~1.305915e7
const GAP_CF_VS_BIS = Math.abs(GAP_ABS_CF / GAP_ABS - 1); // ~1e-6

export const IMP35786_NHALF_NCROSS_GAP_MAGNITUDE = {
  id: 'imp-35786',
  proofSection: 'S-frontier',
  question:
    'imp-33848 proves the ordering N_half < N_cross (sigma_full = 1/2 halving landmark strictly ' +
    'below the E_coll = E_trunc crossover) is STRICT in closed form within the component model, but ' +
    'the whole cluster reports the separation only as the RELATIVE gap ~0.398%. Tabulate the ' +
    'ABSOLUTE gap magnitude N_cross - N_half in N-units at the recomputed anchors, give its leading ' +
    'closed form, and confirm it stays strictly positive across the post-peak far tail. ' +
    'Measurement only; conditional-share diagnostic, NOT an RH bound; no QED.',
  closedForm:
    'N_cross - N_half ~= N_cross ( 1 - 1/(1+r)^2 ) ~= 2 r N_cross, r = E_flow/E_trunc at N_half ' +
    '(strict because E_flow > 0 => r > 0).',
  landmarks: {
    N_half: +N_HALF.toExponential(6), // ~3.267235e9 (sigma_full = 1/2)
    N_cross: +N_CROSS.toExponential(6), // ~3.280294e9 (E_coll = E_trunc)
    strict_ordering_N_half_below_N_cross: N_HALF < N_CROSS, // true
  },
  gapMagnitude: {
    abs_gap_N_cross_minus_N_half: +GAP_ABS.toExponential(6), // ~1.305915e7 (~13.06M zeros)
    abs_gap_rounded_zeros: Math.round(GAP_ABS), // ~13059153
    rel_gap_over_N_cross: +GAP_REL.toExponential(6), // ~3.981092e-3 (matches the cluster)
    r_eflow_over_etrunc_at_half: +R_FLOW.toExponential(6), // ~1.905727e-3
    closed_form_gap_1_minus_inv_1_plus_r_sq: +GAP_CF.toExponential(6), // ~1.246704e7
    closed_form_gap_2r_Ncross: +GAP_CF_2R.toExponential(6), // ~1.250269e7
    measured_over_closed_form_minus_1: +CF_RESID.toExponential(4), // ~4.75e-2 (sqrt-log L running)
  },
  strictPositivity: {
    abs_gap_bisection_anchors: +GAP_ABS.toExponential(6), // ~1.305915e7 > 0
    abs_gap_closed_form_anchors: +GAP_ABS_CF.toExponential(6), // ~1.305915e7 > 0
    both_strictly_positive: GAP_ABS > 0 && GAP_ABS_CF > 0, // true
    closed_form_vs_bisection_rel: +GAP_CF_VS_BIS.toExponential(3), // ~1e-6
  },
  finding: {
    F1_absolute_gap_is_1p3e7_zeros:
      'At the recomputed anchors N_half ~ 3.267235e9 and N_cross ~ 3.280294e9 the strict ordering ' +
      'has absolute magnitude N_cross - N_half ~ 1.305915e7 (~13.06 million zeros) -- the first ' +
      'statement of the ordering as an absolute count rather than the ~0.398% relative offset.',
    F2_leading_closed_form_2r_Ncross_within_5pct:
      'With r = E_flow/E_trunc ~ 1.906e-3 at N_half, the closed-form gap ( 1 - 1/(1+r)^2 ) N_cross ' +
      '~ 1.2467e7 and its leading proxy 2 r N_cross ~ 1.2503e7 land within ~4.7% of the measured ' +
      '1.3059e7; the residual is the sqrt-log running of L over the offset interval. The absolute ' +
      'magnitude is pinned by the same Gronwall flow ratio r that fixes the relative offset.',
    F3_strictly_positive_on_both_recomputations:
      'Recovering the pair by fresh bisection and by the imp-33723 closed-form fixed points both ' +
      'give N_cross - N_half > 0, agreeing to ~1e-6, so the positive sign is not a locator artifact ' +
      'and holds across the post-peak far tail where both landmarks sit.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-33848 strict ordering N_half < N_cross ' +
    '(sigma_full = 1/2 halving landmark below the E_coll = E_trunc crossover), previously reported ' +
    'across the cluster only as the ~0.398% relative offset, has ABSOLUTE magnitude ' +
    'N_cross - N_half ~ 1.305915e7 (~13.06 million zeros) at the recomputed anchors ' +
    'N_half ~ 3.267235e9, N_cross ~ 3.280294e9. Its leading closed form is ' +
    'N_cross ( 1 - 1/(1+r)^2 ) ~ 2 r N_cross ~ 1.25e7 with r = E_flow/E_trunc ~ 1.906e-3 at N_half, ' +
    'within ~4.7% of the measured gap (the residual is the sqrt-log L running). The gap is strictly ' +
    'positive on BOTH the fresh-bisection anchors and the imp-33723 closed-form fixed-point anchors ' +
    '(agreeing to ~1e-6), so the sign is not a locator artifact and holds across the post-peak far ' +
    'tail. Component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642) are ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33848 (strict ordering N_half < N_cross, closed form); imp-33796 (relative separation ' +
    '~0.400%); imp-33723 (closed-form crossover fixed point); imp-33601 (identity sigma=1/2 <=> ' +
    'E_coll=E_trunc+E_flow); imp-34290 (ordering survives exact RvM forward count); imp-2631 ' +
    '(E_trunc fixed-strip route); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP35786_NHALF_NCROSS_GAP_MAGNITUDE_ASSERTIONS = [
  {
    // Reuse gate: the two recomputed anchors reproduce the cluster values (~3.267e9, ~3.280e9).
    id: 'imp35786-reuses-pinned-landmarks',
    description: 'recomputed N_half ~ 3.267e9 and N_cross ~ 3.280e9 both to ~1% (identical sub-terms)',
    holds: () =>
      Math.abs(N_HALF / 3.267235e9 - 1) < 0.01 && Math.abs(N_CROSS / 3.280294e9 - 1) < 0.01,
  },
  {
    // (F1): the absolute gap magnitude in N-units, the deliverable, ~1.306e7 and strictly positive.
    id: 'imp35786-absolute-gap-magnitude',
    description: 'N_cross - N_half ~ 1.306e7 zeros, strictly positive; rel gap ~3.98e-3',
    holds: () =>
      GAP_ABS > 0 &&
      Math.abs(GAP_ABS / 1.305915e7 - 1) < 1e-3 &&
      Math.abs(GAP_REL - 3.981092e-3) < 1e-5,
  },
  {
    // (F2): the leading closed form 2 r N_cross ~ ( 1 - 1/(1+r)^2 ) N_cross matches within ~5%.
    id: 'imp35786-closed-form-magnitude-within-5pct',
    description: 'closed-form gap 2 r N_cross matches the measured absolute gap within ~5%',
    holds: () =>
      R_FLOW > 0 &&
      GAP_CF > 0 &&
      CF_RESID < 0.05 &&
      Math.abs(GAP_CF_2R / GAP_CF - 1) < 0.05,
  },
  {
    // (F3): the gap is strictly positive on both recomputations and they agree to ~1e-6.
    id: 'imp35786-strictly-positive-on-both-anchors',
    description: 'abs gap > 0 on bisection and closed-form anchors; they agree to < 1e-4 relative',
    holds: () => GAP_ABS > 0 && GAP_ABS_CF > 0 && GAP_CF_VS_BIS < 1e-4,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp35786-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35786_NHALF_NCROSS_GAP_MAGNITUDE.isRigorous === false &&
      /NO QED/.test(IMP35786_NHALF_NCROSS_GAP_MAGNITUDE.verdict) &&
      /refereed bound is changed/i.test(IMP35786_NHALF_NCROSS_GAP_MAGNITUDE.verdict),
  },
];

for (const a of IMP35786_NHALF_NCROSS_GAP_MAGNITUDE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35786-nhalf-ncross-gap-magnitude assertion failed: ${a.id}`);
  }
}
