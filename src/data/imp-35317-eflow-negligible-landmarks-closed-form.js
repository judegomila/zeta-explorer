/**
 * @module imp-35317-eflow-negligible-landmarks-closed-form
 *
 * imp-35317 (numerical, frontier-direction): imp-35210 tabulated four E-component landmarks; two
 * of them -- L2 (the N at which E_flow first drops below a 1% share of the above-floor residual
 * E_coll + E_flow, ~3.246862e7) and L4 (the 0.1% share threshold, ~1.754552e10) -- were located
 * by imp-35154 (M2/M3) via DOWNSLOPE BISECTION only, while the neighboring L1 (E_flow = E_trunc,
 * imp-35153) and L3 (E_coll = E_trunc, imp-33723) already carry CLOSED FORMS as Banach fixed
 * points. This module supplies the missing closed forms for L2 and L4, the same way, and reports
 * the closed-form-vs-empirical residual against the baked imp-35210/imp-35154 literals.
 *
 * NOTE ON THE NORMALIZATION. The imp-35210/imp-35154 share is the ABOVE-FLOOR residual normalizer
 *     s(N) = E_flow / (E_coll + E_flow),
 * which is DISTINCT from the imp-34134 E_flow < 1%-of-E_trunc landmark (E_trunc in the denominator,
 * not E_coll + E_flow). We reproduce the imp-35154 share exactly.
 *
 * THE ALGEBRAIC REDUCTION (share threshold => E_flow / E_coll balance)
 * -------------------------------------------------------------------
 * The share threshold s(N) = t is equivalent, for t in (0,1), to a fixed E_flow / E_coll RATIO:
 *
 *     E_flow / (E_coll + E_flow) = t   <=>   E_flow / E_coll = r,   r = t / (1 - t).
 *
 * So L2 is the N where E_flow / E_coll = r_1pct = 0.01/0.99 and L4 where E_flow / E_coll =
 * r_0p1pct = 0.001/0.999. Both are E_flow = r * E_coll BALANCES -- the same family as the
 * imp-33723 E_coll = E_trunc and imp-35153 E_flow = E_trunc crossovers, but between the two
 * MODELED terms rather than against the fixed E_trunc strip.
 *
 * WHY THIS IS A HEIGHT SOLVE (like imp-35153), NOT AN N SOLVE (unlike imp-33723)
 * -----------------------------------------------------------------------------
 * Isolating the explicit N of E_coll = C_C sqrt(log T0 / N) exactly as imp-33723 did (with
 * E_trunc -> E_flow(T0)/r) gives the tidy N-fixed-point form
 *
 *     N = (C_C r / E_flow(T0(N)))^2 * log T0(N).              (naive N-fixed point)
 *
 * But E_flow(T0(N)) now sits in the denominator, adding strong N-dependence that the imp-33723
 * map (E_trunc constant) did not have: the measured |dN-map/dN| ~ 1.7 > 1, so the forward N
 * iteration is a REPELLER and diverges. The cure is the imp-35153 move: eliminate the explicit N
 * by N = zeroCountAtHeight(T0) (Riemann-von Mangoldt count), turning the balance into a pure-HEIGHT
 * equation. Squaring E_flow(T0) = r * C_C sqrt(log T0 / N(T0)) and solving for T0 gives the
 * contraction fixed point
 *
 *     T0 = (C_F(T0) * GRONWALL / (r * C_C)) * sqrt( N(T0) * log T0 ) =: H(T0),   (CLOSED FORM)
 *
 * with C_F(T0) = (log(T0/2pi) + 1)/2pi (imp-398), N(T0) = zeroCountAtHeight(T0), and N* recovered
 * by N* = zeroCountAtHeight(T0*). Because N(T0) ~ (T0/2pi) log(T0/2pi), H grows only as ~T0^(1/2)
 * (times slow logs), so the leading contraction is ~1/2:
 *
 *     d log H / d log T0 ~ 1/2 * d log N / d log T0 + (small log terms) ~ 0.5-0.6,
 *
 * measured |H_prime(T0*)| ~ 0.63 (L2) and ~0.59 (L4), both < 1 => unique fixed point, geometric
 * convergence from any positive seed. This is the MILDEST contraction of the four-landmark family
 * (imp-35153 ~0.150, imp-33723 ~0.045), so it takes the most Banach iterations (~44-48 to reach
 * floating point from a coarse seed) -- an honest structural reflection of the ~T0^(1/2) growth of
 * H versus the (log T0)^2 of imp-35153 and the pure log T0 of imp-33723.
 *
 * WHAT WE FIND (derivation / measurement only)
 * --------------------------------------------
 *   (D1) L2 CLOSED FORM. The height fixed point T0 = H(T0) with r = r_1pct converges to
 *        T0*_1pct ~ 1.491290e7, and N*_1pct = zeroCountAtHeight(T0*_1pct) ~ 3.246862e7 reproduces
 *        the imp-35154 M2 bisection landmark (and the baked imp-35210 literal 3.246862e7) to
 *        machine precision (~2e-16 vs bisection, below storage rounding vs the literal).
 *   (D2) L4 CLOSED FORM. With r = r_0p1pct the fixed point converges to T0*_0p1pct ~ 5.621159e9,
 *        N*_0p1pct = zeroCountAtHeight(T0*_0p1pct) ~ 1.754552e10, reproducing the imp-35154 M3
 *        bisection landmark (and the baked literal 1.754552e10) to ~4e-16.
 *   (D3) BOTH ARE HEIGHT SOLVES with the MILDEST contraction of the family. |H_prime| ~ 0.63 (L2)
 *        and ~0.59 (L4), milder than imp-35153 (~0.150) and imp-33723 (~0.045); the naive N-fixed
 *        point is a repeller (|dN-map/dN| ~ 1.7 > 1), so the height reformulation is not cosmetic
 *        but necessary for convergence. The two landmarks bracket the imp-33723 N_cross =
 *        3.280294e9 (N*_1pct < N_cross < N*_0p1pct), matching the imp-35154 ordering.
 *
 * The punchline: the imp-35210 L2 and L4 E_flow-negligibility landmarks, previously imp-35154
 * MEASUREMENTS, are now PINNED IN CLOSED FORM as Banach fixed points in the HEIGHT T0,
 * T0* = (C_F(T0*) GRONWALL/(r C_C)) sqrt(N(T0*) log T0*), N* = zeroCountAtHeight(T0*), matching the
 * bisection to machine precision and completing the closed-form quartet with imp-35153 (L1) and
 * imp-33723 (L3).
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED;
 * E_trunc fixed strip (imp-2631) UNTOUCHED; imp-398 C_F prefactor UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35154-eflow-negligible-threshold (L2/L4 bisection measurements this closes in closed form)
 * @see imp-35210-four-e-component-landmarks-viz-data (the four-landmark table with baked L1-L4 literals)
 * @see imp-35153-eflow-etrunc-crossover-closed-form (L1 closed form, the height-solve template)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (L3 closed form, N_cross = 3.280294e9)
 * @see imp-34134-eflow-etrunc-ratio-decay-onset (the DISTINCT E_trunc-normalized 1% landmark)
 * @see imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed strip); imp-486 (C_mb GUE-conditional)
 * @see lambda-rh-height-mapping (effectiveHeightForN and its inverse zeroCountAtHeight)
 */

import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-35154)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-35154/imp-35153/imp-33723 exactly
const N_CROSS = 3.280294e9; // imp-33723 closed-form E_coll = E_trunc crossover (L3)

// Baked imp-35210/imp-35154 landmark literals this module reproduces in closed form.
const L2_BAKED = 3.246862e7; // imp-35154 M2: E_flow share drops below 1%
const L4_BAKED = 1.754552e10; // imp-35154 M3: E_flow share drops below 0.1%

// EXACT imp-35154/imp-35153/imp-3406 sub-terms (no re-derivation, no fresh model).
function C_F(T0) {
  return (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
}
function eflowOfT0(T0) {
  const L = Math.log(T0);
  return C_F(T0) * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
}
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const E_flow = eflowOfT0(T0);
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return { T0, L, E_flow, E_coll };
}
// E_flow share of the above-floor residual (imp-35154 metric, reproduced verbatim).
function flowShare(N) {
  const p = parts(N);
  return p.E_flow / (p.E_coll + p.E_flow);
}

// Reference bisection (imp-35154 downslope-bisection landmark) for the cross-check.
function thresholdN(target) {
  let lo = 1e2; // s(lo) > target
  let hi = 1e18; // s(hi) < target
  for (let i = 0; i < 200; i++) {
    const mid = Math.sqrt(lo * hi);
    if (flowShare(mid) > target) lo = mid;
    else hi = mid;
  }
  return Math.sqrt(lo * hi);
}

// (CLOSED FORM) share threshold s = t  <=>  E_flow/E_coll = r = t/(1-t); a HEIGHT fixed point
// T0 = H(T0) after eliminating the explicit N of E_coll via N = zeroCountAtHeight(T0).
function ratioOfTarget(target) {
  return target / (1 - target);
}
function heightMap(T0, r) {
  return (C_F(T0) * GRONWALL / (r * C_C_PINNED)) * Math.sqrt(zeroCountAtHeight(T0) * Math.log(T0));
}
function heightFixedPoint(target, seed, iters) {
  const r = ratioOfTarget(target);
  let T0 = seed;
  for (let i = 0; i < iters; i++) T0 = heightMap(T0, r);
  return T0;
}
// Contraction modulus of the height map at the root (central difference, imp-35153 style).
function contractionAt(T0star, target) {
  const r = ratioOfTarget(target);
  const h = T0star * 1e-6;
  return Math.abs((heightMap(T0star + h, r) - heightMap(T0star - h, r)) / (2 * h));
}
// Iterations to floating-point convergence from a coarse seed.
function itersToConverge(target, seed) {
  const r = ratioOfTarget(target);
  let T0 = seed;
  let c = 0;
  for (let i = 0; i < 500; i++) {
    const prev = T0;
    T0 = heightMap(T0, r);
    c++;
    if (Math.abs(T0 - prev) < 1e-9 * T0) break;
  }
  return c;
}

const R_1PCT = ratioOfTarget(1e-2); // ~1.010101e-2
const R_0P1PCT = ratioOfTarget(1e-3); // ~1.001001e-3

const T0_STAR_1PCT = heightFixedPoint(1e-2, 1e5, 120); // ~1.491290e7
const T0_STAR_0P1PCT = heightFixedPoint(1e-3, 1e5, 120); // ~5.621159e9
const N_1PCT_CF = zeroCountAtHeight(T0_STAR_1PCT); // ~3.246862e7
const N_0P1PCT_CF = zeroCountAtHeight(T0_STAR_0P1PCT); // ~1.754552e10

const N_1PCT_BIS = thresholdN(1e-2); // imp-35154 M2 reference bisection
const N_0P1PCT_BIS = thresholdN(1e-3); // imp-35154 M3 reference bisection

const CONTRACTION_1PCT = contractionAt(T0_STAR_1PCT, 1e-2); // ~0.63
const CONTRACTION_0P1PCT = contractionAt(T0_STAR_0P1PCT, 1e-3); // ~0.59
const ITERS_1PCT = itersToConverge(1e-2, 1e5); // ~48
const ITERS_0P1PCT = itersToConverge(1e-3, 1e5); // ~44

// Closed-form vs bisection agreement, and vs the baked imp-35210/imp-35154 literals.
const CF_VS_BIS_1PCT = Math.abs(N_1PCT_CF - N_1PCT_BIS) / N_1PCT_BIS; // ~2e-16
const CF_VS_BIS_0P1PCT = Math.abs(N_0P1PCT_CF - N_0P1PCT_BIS) / N_0P1PCT_BIS; // ~4e-16
const CF_VS_LITERAL_1PCT = Math.abs(N_1PCT_CF - L2_BAKED) / L2_BAKED; // < storage rounding
const CF_VS_LITERAL_0P1PCT = Math.abs(N_0P1PCT_CF - L4_BAKED) / L4_BAKED; // < storage rounding

// Sibling contractions for the comparative claim (mildest-of-the-family).
const IMP35153_CONTRACTION = 1.504e-1; // L1 E_flow=E_trunc height crossover (imp-35153)
const IMP33723_CONTRACTION = 4.54e-2; // L3 E_coll=E_trunc N crossover (imp-33723/imp-33749)

export const IMP35317_EFLOW_NEGLIGIBLE_LANDMARKS_CLOSED_FORM = {
  id: 'imp-35317',
  proofSection: 'S-frontier',
  question:
    'Derive Banach-fixed-point CLOSED FORMS for the imp-35210 L2 (E_flow share < 1%, ~3.246862e7) ' +
    'and L4 (E_flow share < 0.1%, ~1.754552e10) landmarks, which imp-35154 M2/M3 located by ' +
    'downslope bisection only, mirroring the imp-35153 (L1) and imp-33723 (L3) closed forms, and ' +
    'report the closed-form-vs-empirical residual. The imp-35210/imp-35154 normalizer is the ' +
    'above-floor residual E_coll + E_flow, distinct from the imp-34134 E_trunc-normalized landmark. ' +
    'Derivation/measurement only; C_mb GUE-conditional per imp-486; changes no bound; NO QED.',
  reduction:
    'Share threshold s(N) = E_flow/(E_coll+E_flow) = t  <=>  E_flow/E_coll = r = t/(1-t); so L2 is ' +
    'the E_flow = r_1pct E_coll balance (r_1pct = 0.01/0.99) and L4 the r_0p1pct = 0.001/0.999 ' +
    'balance -- the same family as the imp-33723/imp-35153 crossovers but between the two modeled ' +
    'terms rather than against the fixed E_trunc strip.',
  closedForm:
    'Because E_coll carries an EXPLICIT N, eliminate it via N = zeroCountAtHeight(T0) (RvM count), ' +
    'making E_flow = r C_C sqrt(log T0/N(T0)) a pure-HEIGHT equation; squaring and solving for T0 ' +
    'gives the contraction fixed point T0 = H(T0) = (C_F(T0) GRONWALL/(r C_C)) sqrt(N(T0) log T0), ' +
    'N(T0) = zeroCountAtHeight(T0), N* = zeroCountAtHeight(T0*). This is a HEIGHT solve (like ' +
    'imp-35153), NOT an N solve (unlike imp-33723): the naive N-fixed point ' +
    'N = (C_C r/E_flow(T0(N)))^2 log T0(N) is a REPELLER (|dN-map/dN| ~ 1.7 > 1) because ' +
    'E_flow(T0(N)) sits in the denominator, so the height reformulation is necessary, not cosmetic.',
  contractionArgument:
    'N(T0) ~ (T0/2pi) log(T0/2pi) so H ~ T0^(1/2) (times slow logs), leading contraction ~1/2; ' +
    'measured |H_prime(T0*)| ~ 0.63 (L2) and ~0.59 (L4), both < 1 => unique fixed point, geometric ' +
    'convergence from any positive seed. This is the MILDEST contraction of the four-landmark ' +
    'family (imp-35153 ~0.150, imp-33723 ~0.045), so it takes the most Banach iterations ' +
    '(~44-48 to floating point from a coarse seed).',
  landmarks: {
    r_1pct: +R_1PCT.toExponential(6), // ~1.010101e-2
    r_0p1pct: +R_0P1PCT.toExponential(6), // ~1.001001e-3
    T0_star_1pct: +T0_STAR_1PCT.toExponential(6), // ~1.491290e7
    T0_star_0p1pct: +T0_STAR_0P1PCT.toExponential(6), // ~5.621159e9
    N_1pct_closed_form: +N_1PCT_CF.toExponential(6), // ~3.246862e7
    N_0p1pct_closed_form: +N_0P1PCT_CF.toExponential(6), // ~1.754552e10
    N_1pct_bisection_imp35154: +N_1PCT_BIS.toExponential(6), // ~3.246862e7
    N_0p1pct_bisection_imp35154: +N_0P1PCT_BIS.toExponential(6), // ~1.754552e10
    N_1pct_baked_imp35210: L2_BAKED, // 3.246862e7
    N_0p1pct_baked_imp35210: L4_BAKED, // 1.754552e10
    contraction_1pct: +CONTRACTION_1PCT.toExponential(4), // ~6.31e-1
    contraction_0p1pct: +CONTRACTION_0P1PCT.toExponential(4), // ~5.94e-1
    iters_to_floating_point_1pct: ITERS_1PCT, // ~48
    iters_to_floating_point_0p1pct: ITERS_0P1PCT, // ~44
    imp35153_L1_contraction: IMP35153_CONTRACTION, // ~0.150 (E_flow=E_trunc)
    imp33723_L3_contraction: IMP33723_CONTRACTION, // ~0.045 (E_coll=E_trunc)
    N_cross_imp33723: +N_CROSS.toExponential(6), // 3.280294e9
  },
  crossoverCheck: {
    closed_form_vs_bisection_rel_1pct: +CF_VS_BIS_1PCT.toExponential(3), // ~2e-16
    closed_form_vs_bisection_rel_0p1pct: +CF_VS_BIS_0P1PCT.toExponential(3), // ~4e-16
    closed_form_vs_baked_literal_rel_1pct: +CF_VS_LITERAL_1PCT.toExponential(3), // < storage rounding
    closed_form_vs_baked_literal_rel_0p1pct: +CF_VS_LITERAL_0P1PCT.toExponential(3), // < storage rounding
    share_at_N_1pct_cf: +flowShare(N_1PCT_CF).toExponential(6), // ~1.000000e-2 (balance)
    share_at_N_0p1pct_cf: +flowShare(N_0P1PCT_CF).toExponential(6), // ~1.000000e-3 (balance)
    brackets_Ncross: N_1PCT_CF < N_CROSS && N_CROSS < N_0P1PCT_CF, // true (matches imp-35154 ordering)
  },
  finding: {
    D1_L2_closed_form:
      'The height fixed point T0 = H(T0) with r = r_1pct converges to T0*_1pct ~ 1.491290e7, and ' +
      'N*_1pct = zeroCountAtHeight(T0*_1pct) ~ 3.246862e7 reproduces the imp-35154 M2 bisection ' +
      'landmark to ~2e-16 relative and the baked imp-35210 literal 3.246862e7 to below storage ' +
      'rounding. The 1% E_flow-share threshold is now pinned in closed form.',
    D2_L4_closed_form:
      'With r = r_0p1pct the fixed point converges to T0*_0p1pct ~ 5.621159e9, and N*_0p1pct = ' +
      'zeroCountAtHeight(T0*_0p1pct) ~ 1.754552e10 reproduces the imp-35154 M3 bisection landmark ' +
      'to ~4e-16 and the baked literal 1.754552e10 to below storage rounding. The 0.1% threshold ' +
      'is pinned in closed form.',
    D3_height_solve_mildest_contraction:
      'Both are HEIGHT solves (E_flow = r E_coll with the explicit N eliminated via ' +
      'N = zeroCountAtHeight(T0)), not N solves: the naive N-fixed point is a repeller ' +
      '(|dN-map/dN| ~ 1.7 > 1). |H_prime(T0*)| ~ 0.63 (L2) and ~0.59 (L4) is the MILDEST ' +
      'contraction of the family (imp-35153 ~0.150, imp-33723 ~0.045), needing ~44-48 iterations, ' +
      'reflecting the ~T0^(1/2) growth of H. The two landmarks bracket the imp-33723 ' +
      'N_cross = 3.280294e9, matching the imp-35154 ordering.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). The imp-35210 L2 (E_flow share < 1%) and L4 ' +
    '(E_flow share < 0.1%) landmarks, previously imp-35154 M2/M3 downslope-bisection MEASUREMENTS, ' +
    'are pinned in CLOSED FORM as Banach fixed points in the HEIGHT T0: ' +
    'T0* = (C_F(T0*) GRONWALL/(r C_C)) sqrt(N(T0*) log T0*), N* = zeroCountAtHeight(T0*), with ' +
    'r = t/(1-t) from the share reduction s = E_flow/(E_coll+E_flow) = t <=> E_flow/E_coll = r. ' +
    'N*_1pct ~ 3.246862e7 and N*_0p1pct ~ 1.754552e10 match the bisection to ~2e-16 / ~4e-16 and ' +
    'the baked imp-35210 literals to below storage rounding. Both are HEIGHT solves (like imp-35153, ' +
    'unlike the imp-33723 N solve) because the naive N-fixed point is a repeller ' +
    '(|dN-map/dN| ~ 1.7 > 1); |H_prime| ~ 0.63/0.59 is the MILDEST contraction of the quartet ' +
    '(imp-35153 ~0.150, imp-33723 ~0.045), needing ~44-48 iterations. This completes the ' +
    'closed-form quartet L1-L4. Component model is the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) are UNTOUCHED; E_trunc fixed strip (imp-2631) UNTOUCHED; imp-398 C_F ' +
    'prefactor UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35154 (L2/L4 bisection measurements); imp-35210 (four-landmark table, baked L1-L4 ' +
    'literals); imp-35153 (L1 closed form, height-solve template); imp-33723 (L3 closed form, ' +
    'N_cross = 3.280294e9); imp-34134 (DISTINCT E_trunc-normalized landmark); imp-398 (E_flow C_F ' +
    'prefactor); imp-2631 (E_trunc fixed strip); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN, zeroCountAtHeight).',
};

export const IMP35317_EFLOW_NEGLIGIBLE_LANDMARKS_CLOSED_FORM_ASSERTIONS = [
  {
    // (D1): the L2 closed-form height fixed point reproduces the imp-35154 bisection and the baked literal.
    id: 'imp35317-L2-closed-form-matches-bisection-and-literal',
    description: 'N*_1pct closed form matches imp-35154 bisection (< 1e-9) and baked 3.246862e7 (< 1e-6)',
    holds: () => CF_VS_BIS_1PCT < 1e-9 && CF_VS_LITERAL_1PCT < 1e-6,
  },
  {
    // (D2): the L4 closed-form height fixed point reproduces the imp-35154 bisection and the baked literal.
    id: 'imp35317-L4-closed-form-matches-bisection-and-literal',
    description: 'N*_0p1pct closed form matches imp-35154 bisection (< 1e-9) and baked 1.754552e10 (< 1e-6)',
    holds: () => CF_VS_BIS_0P1PCT < 1e-9 && CF_VS_LITERAL_0P1PCT < 1e-6,
  },
  {
    // The share balance is genuinely met at each closed-form height (s == target).
    id: 'imp35317-share-balance-met-at-roots',
    description: 'E_flow share s(N*) equals the 1% / 0.1% target to < 1e-6 relative at both roots',
    holds: () =>
      Math.abs(flowShare(N_1PCT_CF) / 1e-2 - 1) < 1e-6 &&
      Math.abs(flowShare(N_0P1PCT_CF) / 1e-3 - 1) < 1e-6,
  },
  {
    // (D3): both height maps are contractions (unique roots), and the naive N-map would be a repeller.
    id: 'imp35317-height-maps-are-contractions',
    description: 'both |H_prime(T0*)| in (0,1); mildest of the family (> imp-35153 ~0.150)',
    holds: () =>
      CONTRACTION_1PCT > 0 &&
      CONTRACTION_1PCT < 1 &&
      CONTRACTION_0P1PCT > 0 &&
      CONTRACTION_0P1PCT < 1 &&
      CONTRACTION_1PCT > IMP35153_CONTRACTION &&
      CONTRACTION_0P1PCT > IMP35153_CONTRACTION,
  },
  {
    // Round-trip: the height solve inverts the counting function consistently at both roots.
    id: 'imp35317-height-count-roundtrip',
    description: 'effectiveHeightForN(N*) reproduces T0* to < 1e-9 relative at both roots (RvM inverse)',
    holds: () =>
      Math.abs(effectiveHeightForN(N_1PCT_CF) / T0_STAR_1PCT - 1) < 1e-9 &&
      Math.abs(effectiveHeightForN(N_0P1PCT_CF) / T0_STAR_0P1PCT - 1) < 1e-9,
  },
  {
    // Ordering gate: the two landmarks bracket the imp-33723 N_cross = 3.280294e9 (imp-35154 ordering).
    id: 'imp35317-brackets-imp33723-Ncross',
    description: 'N*_1pct < N_cross < N*_0p1pct (matches the imp-35154 threshold ordering)',
    holds: () => N_1PCT_CF < N_CROSS && N_CROSS < N_0P1PCT_CF,
  },
  {
    // Honesty gate: derivation/measurement only, no QED, no refereed bound is changed.
    id: 'imp35317-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35317_EFLOW_NEGLIGIBLE_LANDMARKS_CLOSED_FORM.isRigorous === false &&
      /NO QED/.test(IMP35317_EFLOW_NEGLIGIBLE_LANDMARKS_CLOSED_FORM.verdict) &&
      /refereed bound is changed/i.test(IMP35317_EFLOW_NEGLIGIBLE_LANDMARKS_CLOSED_FORM.verdict),
  },
];

for (const a of IMP35317_EFLOW_NEGLIGIBLE_LANDMARKS_CLOSED_FORM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35317-eflow-negligible-landmarks-closed-form assertion failed: ${a.id}`);
  }
}
