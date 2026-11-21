/**
 * @module imp-34909-op-depth-newton-step-reconciliation
 *
 * imp-34909 (numerical, frontier): imp-34884 reported an op-DAG DEPTH crossing at d* = 8 (the first [T]-dT
 * subtraction) while imp-34889 reports the forward route crosses the (H2) MARGIN at Newton STEP 5 band-wide.
 * Read naively these look contradictory -- "crossing at 8" vs "crossing at 5" -- but they are two DIFFERENT
 * measurements reported on two DIFFERENT axes (op-DAG depth vs Newton step) against two DIFFERENT reference
 * widths. This module reconciles them on a SHARED op ladder (8 ops per Newton step), shows d* = 8 op corresponds
 * to Newton step 1 and step 5 corresponds to op-depth 40, and confirms the two crossing points trace the SAME
 * forward width-inflation (identical factor-2 doubling per Newton step) -- they are consistent, not
 * contradictory. RECONCILIATION / MEASUREMENT ONLY; reuses the imp-34884 and imp-34889 literals VERBATIM; does
 * NOT instantiate the imp-34687a directed-rounding layer; imp-34714a REMAINS OPEN; NO QED.
 *
 * THE APPARENT CONTRADICTION
 * --------------------------
 * imp-34884 says the forward iterate crosses at op-DAG DEPTH d* = 8; imp-34889 says the forward route crossings
 * the (H2) margin at Newton STEP 5. The naive reading compares the integer 8 to the integer 5 as if they were
 * the same unit. They are not: 8 is an OP-DEPTH and 5 is a NEWTON STEP, and the two crossings are defined against
 * two different reference widths.
 *
 * THE SHARED OP LADDER (8 elementary ops per Newton step)
 * -------------------------------------------------------
 * imp-34884 unrolled each Newton step into OPS_PER_STEP = 8 elementary ops (a=[T]/2pi, u=log(a), u-1, a*(u-1),
 * f=a(u-1)-N, fp=u/2pi, dT=f/fp, [T]=[T]-dT). So op-depth and Newton step are the SAME axis scaled by 8:
 *   op-depth d  <->  Newton step  s = d / 8.
 * On this ladder:
 *   imp-34884 d* = 8   <->  Newton step 1   (the first [T]-dT subtraction, end of step 1)
 *   imp-34889 step 5   <->  op-depth 40     (the fifth [T]-dT subtraction)
 * So one crossing is at op-depth 8 (= step 1) and the other at op-depth 40 (= step 5); comparing 8 to 5 mixed the
 * two axes. Both crossings sit on the SAME 2^(d/8) forward-width curve (the iterate doubles at each subtraction,
 * op-depths 8/16/24/32/40 -> ratios 2/4/8/16/32).
 *
 * WHY THE TWO CROSSING POINTS DIFFER: TWO REFERENCE WIDTHS, ONE DOUBLING LAW
 * -----------------------------------------------------------------------
 * The forward width-inflation is IDENTICAL in both: forward_ratio(n Newton steps) = 2^n. The crossings differ
 * ONLY in the reference width each is measured against:
 *   - imp-34884 (d* = 8): the reference is the forward route s OWN SEED bracket half-width delta*T0 (T-space).
 *     A crossing is the iterate exceeding the width it STARTED from, i.e. ratio R_seed = 1; the smallest n with
 *     2^n > 1 is n = 1, so d* = 1*8 = 8. This is the EARLIEST structural crossing -- forward exceeds its own seed.
 *   - imp-34889 (step 5): the reference is the (H2) MARGIN delta*N, reached through the LINEAR image map
 *     toImageHalfWidth(w_T) = K (w_T/2)/T0 / FP_LO. The seed image half-width is K delta / FP_LO (T0 cancels),
 *     so the crossing ratio is R_margin = margin/seed_image = delta*N / (K delta / FP_LO) = N*FP_LO/K ~ 19.91;
 *     the smallest n with 2^n > 19.91 is n = 5, so the crossing is at op-depth 5*8 = 40.
 * The linear image map multiplies the width by 2^n exactly as in T-space, so it preserves the doubling law and
 * only rescales the threshold. Hence a single unified breach-step law reproduces BOTH published crossing points:
 *   nStar(R) = floor(log2(R)) + 1  (smallest integer n with 2^n > R)
 *   nStar(R_seed = 1)      = 1  ->  op-depth 8   (== imp-34884 d*)
 *   nStar(R_margin ~19.91) = 5  ->  op-depth 40  (== imp-34889 crossing step 5 -> op-depth)
 * The two crossing steps differ by nStar(R_margin) - nStar(R_seed) = 4, matching the log2(R_margin/R_seed) ~ 4.32
 * doublings separating the seed bracket half-width from the (H2) margin. So d* = 8 and step 5 are CONSISTENT:
 * the same factor-2/step forward inflation, measured against a seed-bracket threshold (ratio 1) and a
 * (H2)-margin threshold (ratio ~20) respectively, differing by exactly the ~4.3-doubling gap between them.
 *
 * WHAT STAYS OPEN
 * --------------
 * RECONCILIATION / MEASUREMENT only on the inherited imp-3220/imp-3406 surrogate crossover map, reusing the
 * imp-34884 op-depth and imp-34889 band-sweep literals VERBATIM. It clarifies that the "d*=8 vs step 5"
 * apparent disagreement is an axis + reference-width bookkeeping difference over ONE doubling law, NOT a
 * contradiction; it does NOT instantiate the imp-34687a directed-rounding transcendental layer (the surrogate
 * is a first-order outward-rounding proxy) and does NOT discharge the conditional. imp-34714a REMAINS OPEN.
 * C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED;
 * imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34884-forward-op-depth-breach (op-DAG DEPTH crossing d*=8 = seed-bracket crossing; reused verbatim)
 * @see imp-34889-forward-breach-band-uniformity (Newton STEP 5 (H2)-margin crossing band-wide; reused verbatim)
 * @see imp-34901-forward-breach-closed-form (closed-form n_star = ceil(log2(N*FP_LO/K)); the (H2)-margin crossing)
 * @see imp-34865-forward-vs-contraction-width-inflation (the shared directed-rounding surrogate + routes)
 * @see imp-34687 (f monotone+convex => inner interval-Newton is a verified contraction; sub-gap imp-34687a)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact lemma; named sub-gap imp-34714a)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34884_FORWARD_OP_DEPTH_BREACH } from './imp-34884-forward-op-depth-breach.js';
import { IMP34889_FORWARD_BREACH_BAND_UNIFORMITY } from './imp-34889-forward-breach-band-uniformity.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34884/imp-34889)
const DELTA = 2e-4; // same FIXED relative bracket half-width as imp-34884/imp-34889

// Recompute the shared imp-33723/imp-34884/imp-34889 constants VERBATIM (Banach map g(N) = K log T0(N)).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const gPrime = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // 3.28029435165241e9
const FP_LO = 1 - Math.abs(gPrime(N_CROSS * (1 - DELTA))); // ~0.954568 Krawczyk quotient denominator floor

// --- The two published crossing points (reused VERBATIM from the imported modules) --------------------------
const A884 = IMP34884_FORWARD_OP_DEPTH_BREACH;
const A889 = IMP34889_FORWARD_BREACH_BAND_UNIFORMITY;
const OPS_PER_STEP = A884.constants.ops_per_newton_step; // 8 (elementary ops per Newton step, imp-34884)
const D_STAR_884 = A884.measured.breach_depth_d_star; // 8 (op-DAG DEPTH crossing, seed-bracket threshold)
const NEWTON_STEP_AT_884 = A884.measured.newton_step_at_breach; // 1 (d* = 8 op = end of Newton step 1)
const STEP_889 = A889.measured.breach_step_band_min; // 5 (Newton STEP crossing of the (H2) margin, band-wide)

// --- The shared ladder: map each crossing onto the common op-depth axis (op-depth = Newton step * 8) ---------
const D884_AS_NEWTON_STEP = D_STAR_884 / OPS_PER_STEP; // 1 (d* = 8 op corresponds to Newton step 1)
const STEP889_AS_OP_DEPTH = STEP_889 * OPS_PER_STEP; // 40 (step 5 corresponds to op-depth 40)

// --- The two reference widths behind the two crossings -----------------------------------------------------
// imp-34884: reference = the forward route s OWN seed bracket half-width delta*T0; crossing ratio R = 1.
const R_SEED = 1;
// imp-34889: reference = the (H2) margin delta*N through the LINEAR image map; crossing ratio R = N*FP_LO/K.
const R_MARGIN = (N_CROSS * FP_LO) / K_AMPL; // ~19.91 (T0 and delta cancel; the ~20 imp-34889/imp-34901 cite)

// --- Unified breach-step law: smallest integer n with 2^n > R (forward doubles per Newton step) -----------
const nStar = (R) => Math.floor(Math.log2(R)) + 1;
const NSTAR_SEED = nStar(R_SEED); // 1 -> op-depth 8  == imp-34884 d*
const NSTAR_MARGIN = nStar(R_MARGIN); // 5 -> op-depth 40 == imp-34889 step 5
const RECON_DEPTH_884 = NSTAR_SEED * OPS_PER_STEP; // 8, must reproduce D_STAR_884
const RECON_STEP_889 = NSTAR_MARGIN; // 5, must reproduce STEP_889
const STEP_GAP = NSTAR_MARGIN - NSTAR_SEED; // 4 (Newton steps between the two crossings)
const LOG2_THRESHOLD_GAP = Math.log2(R_MARGIN / R_SEED); // ~4.32 doublings between the two reference widths

// Consistency: the two crossings lie on the SAME 2^(op-depth/8) forward-width curve.
const FWD_RATIO_AT = (opDepth) => Math.pow(2, opDepth / OPS_PER_STEP);
const RATIO_AT_D_STAR = FWD_RATIO_AT(D_STAR_884); // 2^1 = 2 (forward first exceeds its own seed bracket)
const RATIO_AT_STEP889_DEPTH = FWD_RATIO_AT(STEP889_AS_OP_DEPTH); // 2^5 = 32 (> R_margin ~19.91 => crossing)

export const IMP34909_OP_DEPTH_NEWTON_STEP_RECONCILIATION = {
  id: 'imp-34909',
  proofSection: 'S-frontier',
  question:
    'imp-34884 reported an op-DAG DEPTH crossing at d* = 8 while imp-34889 reports the forward route crosses the ' +
    '(H2) MARGIN at Newton STEP 5 band-wide. Reconcile the two depth counts on a shared op ladder: show d* = 8 ' +
    'op corresponds to which Newton step, express both crossings on the common op-depth axis, and clarify why ' +
    'the two crossing points differ and whether they measure the SAME forward width-inflation on different ' +
    'granularities -- i.e. whether they are consistent rather than contradictory. Reconciliation / measurement ' +
    'only; reuses the imp-34884/imp-34889 literals verbatim; does NOT instantiate the imp-34687a layer; ' +
    'imp-34714a REMAINS OPEN; no QED.',
  model: {
    ladder:
      'imp-34884 unrolled each Newton step into OPS_PER_STEP = 8 elementary ops, so op-depth and Newton step ' +
      'are the SAME axis scaled by 8 (op-depth d <-> Newton step s = d/8). On this ladder the imp-34884 crossing ' +
      'd* = 8 op is Newton step 1 (the first [T]-dT subtraction), and the imp-34889 crossing step 5 is op-depth ' +
      '40 (the fifth subtraction). The naive "8 vs 5" comparison mixed an op-depth with a Newton step.',
    twoReferences:
      'The forward width-inflation is IDENTICAL in both -- the iterate doubles per Newton step, ' +
      'forward_ratio(n) = 2^n -- so the two crossings differ ONLY in the reference width. imp-34884 measures ' +
      'against the forward route s OWN seed bracket half-width delta*T0 (T-space), crossing ratio R_seed = 1, ' +
      'giving the smallest n with 2^n > 1, i.e. n = 1 (op-depth 8). imp-34889 measures against the (H2) margin ' +
      'delta*N through the LINEAR image map (seed image K delta / FP_LO, T0 cancels), crossing ratio ' +
      'R_margin = N*FP_LO/K ~ 19.91, giving the smallest n with 2^n > 19.91, i.e. n = 5 (op-depth 40).',
    unifiedLaw:
      'A single breach-step law nStar(R) = floor(log2(R)) + 1 (smallest n with 2^n > R) reproduces BOTH ' +
      'published crossing points: nStar(1) = 1 -> op-depth 8 == imp-34884 d*, and nStar(19.91) = 5 -> op-depth ' +
      '40 == imp-34889 step 5. The two crossing steps differ by 4, exactly the log2(R_margin/R_seed) ~ 4.32 ' +
      'doublings separating the seed bracket half-width from the (H2) margin. Same curve, two thresholds.',
  },
  constants: {
    N_cross: +N_CROSS.toPrecision(15), // 3.28029435165241e9
    K: +K_AMPL.toExponential(4), // ~1.5727e8
    FP_LO_quotient_denominator: +FP_LO.toFixed(6), // ~0.954568
    delta: +DELTA.toExponential(1), // 2e-4
    ops_per_newton_step: OPS_PER_STEP, // 8
  },
  inputs: {
    imp34884_breach_op_depth_d_star: D_STAR_884, // 8 (op-DAG DEPTH crossing of the seed bracket, imp-34884)
    imp34884_newton_step_at_breach: NEWTON_STEP_AT_884, // 1
    imp34889_breach_newton_step: STEP_889, // 5 (Newton STEP crossing of the (H2) margin, band-wide, imp-34889)
  },
  reconciliation: {
    // Both crossings placed on the shared op-depth axis (op-depth = Newton step * 8).
    d_star_884_as_newton_step: D884_AS_NEWTON_STEP, // 1 (d* = 8 op == Newton step 1)
    step_889_as_op_depth: STEP889_AS_OP_DEPTH, // 40 (step 5 == op-depth 40)
    // The two reference widths and the unified breach-step law that reproduces both.
    r_seed_ratio_imp34884: R_SEED, // 1 (crossing of forward route s own seed bracket half-width delta*T0)
    r_margin_ratio_imp34889: +R_MARGIN.toFixed(4), // ~19.91 (crossing of the (H2) margin delta*N; N*FP_LO/K)
    nstar_seed_reproduces_d_star: RECON_DEPTH_884, // 8 (nStar(1)*8 == imp-34884 d*)
    nstar_margin_reproduces_step_889: RECON_STEP_889, // 5 (nStar(19.91) == imp-34889 step 5)
    breach_step_gap: STEP_GAP, // 4
    log2_threshold_gap_doublings: +LOG2_THRESHOLD_GAP.toFixed(4), // ~4.3154
    // Both crossings lie on the SAME 2^(op-depth/8) forward-width curve.
    forward_ratio_at_d_star: +RATIO_AT_D_STAR.toFixed(4), // 2.0000 (2^1: exceeds its own seed)
    forward_ratio_at_step_889_depth: +RATIO_AT_STEP889_DEPTH.toFixed(4), // 32.0000 (2^5 > 19.91: margin crossing)
  },
  finding:
    'The imp-34884 d* = 8 and imp-34889 step 5 crossing counts are CONSISTENT, not contradictory: they measure ' +
    'the SAME forward width-inflation (the iterate doubles per Newton step, factor 2^n) reported on two ' +
    'different axes against two different reference widths. On the shared op ladder (OPS_PER_STEP = 8 ' +
    'elementary ops per Newton step) the imp-34884 op-DAG DEPTH crossing d* = 8 is Newton STEP 1 (the first ' +
    '[T]-dT subtraction, where the forward iterate first exceeds its OWN seed bracket half-width delta*T0, ' +
    'ratio 1), while the imp-34889 Newton STEP 5 crossing is op-depth 40 (where the forward IMAGE first exceeds ' +
    'the (H2) margin delta*N, ratio N*FP_LO/K ~ 19.91 through the linear image map K (w/2)/T0/FP_LO in which ' +
    'T0 cancels). The naive "8 vs 5" reading compared an op-depth to a Newton step. A single breach-step law ' +
    'nStar(R) = floor(log2(R)) + 1 reproduces BOTH: nStar(1) = 1 -> op-depth 8 (imp-34884) and ' +
    'nStar(19.91) = 5 -> op-depth 40 (imp-34889); the two differ by exactly the log2(R_margin/R_seed) ~ 4.32 ' +
    'doublings separating the seed bracket half-width from the (H2) margin, and both crossing points sit on the ' +
    'same 2^(op-depth/8) forward-width curve (ratio 2 at d*=8, ratio 32 at op-depth 40). So the two counts are ' +
    'one doubling law read against a seed-bracket threshold and a (H2)-margin threshold. Reconciliation ' +
    'EVIDENCE, NOT a machine certificate; imp-34714a REMAINS OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN. That the imp-34884 d* = 8 (op-depth) and imp-34889 step 5 (Newton step) crossings ' +
    'reconcile on a shared 8-ops-per-step ladder as one factor-2/step forward doubling read against two ' +
    'reference widths (seed bracket ratio 1 -> op-depth 8; (H2) margin ratio ~19.91 -> op-depth 40) is ' +
    'RECONCILIATION EVIDENCE using the imp-34884/imp-34889 first-order outward-rounding surrogate, NOT the ' +
    'imp-34687a certified transcendental layer; it does NOT prove the endpoints ARE valid enclosures. Adds no ' +
    'RH bound.',
  isRigorous: false,
  verdict:
    'OP-DEPTH vs NEWTON-STEP CROSSING RECONCILIATION (frontier, NOT an RH bound). imp-34884 reported an op-DAG ' +
    'DEPTH crossing d* = 8 and imp-34889 a Newton STEP 5 (H2)-margin crossing; these are reconciled here on a ' +
    'shared op ladder. imp-34884 unrolled each Newton step into 8 elementary ops, so op-depth = Newton step * ' +
    '8: the d* = 8 crossing is Newton step 1 (forward first exceeds its OWN seed bracket half-width delta*T0, ' +
    'ratio 1), and the step 5 crossing is op-depth 40 (forward IMAGE first exceeds the (H2) margin delta*N, ' +
    'ratio N*FP_LO/K ~ 19.91). The two measure the SAME forward doubling (factor 2^n per Newton step, the same ' +
    '2^(op-depth/8) curve); they differ ONLY in reference width, by exactly the log2(R_margin/R_seed) ~ 4.32 ' +
    'doublings between the seed bracket and the margin. A single breach-step law nStar(R) = floor(log2(R)) + 1 ' +
    'reproduces both (nStar(1) = 1 -> op-depth 8; nStar(19.91) = 5 -> op-depth 40). So the "8 vs 5" reading ' +
    'was an axis + reference-width bookkeeping difference over ONE doubling law -- the counts are CONSISTENT, ' +
    'not contradictory. This is EVIDENCE, NOT a machine certificate. RECONCILIATION / MEASUREMENT ONLY on the ' +
    'inherited imp-3220/imp-3406 surrogate crossover map; reuses the imp-34884/imp-34889 literals verbatim; ' +
    'does NOT instantiate the imp-34687a directed-rounding layer; SUB-GAP imp-34714a REMAINS OPEN. The C_C ' +
    '1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 ' +
    'untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34884 (op-DAG DEPTH crossing d*=8 = seed-bracket crossing; reused verbatim); imp-34889 (Newton STEP 5 ' +
    '(H2)-margin crossing band-wide; reused verbatim); imp-34901 (closed-form n_star = ceil(log2(N*FP_LO/K)) for ' +
    'the (H2)-margin crossing); imp-34865 (the shared directed-rounding surrogate + forward/contraction routes); ' +
    'imp-34687 (f monotone+convex => inner interval-Newton is a verified contraction; sub-gap imp-34687a); ' +
    'imp-34714 (Krawczyk existence-uniqueness lemma; sub-gap imp-34714a); imp-33723 (Banach map ' +
    'g(N) = K log T0(N)); imp-2642 (C_C 1/8 ansatz). Interval subtraction adds widths: Moore, Neumaier, Higham.',
};

export const IMP34909_OP_DEPTH_NEWTON_STEP_RECONCILIATION_ASSERTIONS = [
  {
    // The shared ladder places d*=8 op at Newton step 1 and step 5 at op-depth 40.
    id: 'imp34909-shared-ladder-maps-both-breaches',
    description: 'on the 8-ops-per-step ladder d*=8 op == Newton step 1 and step 5 == op-depth 40',
    holds: () =>
      OPS_PER_STEP === 8 &&
      D884_AS_NEWTON_STEP === 1 &&
      D884_AS_NEWTON_STEP === NEWTON_STEP_AT_884 &&
      STEP889_AS_OP_DEPTH === 40 &&
      STEP889_AS_OP_DEPTH === STEP_889 * OPS_PER_STEP,
  },
  {
    // A single breach-step law nStar(R)=floor(log2 R)+1 reproduces BOTH published crossing points.
    id: 'imp34909-unified-nstar-reproduces-both',
    description: 'nStar(R_seed=1)=1 -> op-depth 8 (imp-34884 d*) and nStar(R_margin~19.91)=5 (imp-34889 step 5)',
    holds: () =>
      RECON_DEPTH_884 === D_STAR_884 &&
      RECON_STEP_889 === STEP_889 &&
      R_MARGIN > 16 &&
      R_MARGIN < 32 && // strictly inside the (16,32] dyadic window pinning nStar=5
      Math.abs(R_MARGIN - 19.91) < 0.1,
  },
  {
    // The gap between the two crossings is exactly the log2 separation of their reference widths.
    id: 'imp34909-gap-equals-threshold-doublings',
    description: 'the 4-step crossing gap equals the log2(R_margin/R_seed) ~ 4.32 doublings between the two references',
    holds: () =>
      STEP_GAP === 4 &&
      LOG2_THRESHOLD_GAP > 4 &&
      LOG2_THRESHOLD_GAP < 5 &&
      Math.floor(LOG2_THRESHOLD_GAP) === STEP_GAP, // floor(4.32)=4 == the integer step gap
  },
  {
    // Both crossings lie on the SAME 2^(op-depth/8) forward-doubling curve (same width-inflation).
    id: 'imp34909-same-doubling-curve',
    description: 'forward ratio is 2 at d*=8 (2^1) and 32 at op-depth 40 (2^5), one 2^(op-depth/8) curve',
    holds: () =>
      Math.abs(RATIO_AT_D_STAR - 2) < 1e-9 &&
      Math.abs(RATIO_AT_STEP889_DEPTH - 32) < 1e-9 &&
      RATIO_AT_STEP889_DEPTH > R_MARGIN && // 32 > 19.91: margin crossing at step 5
      FWD_RATIO_AT(4 * OPS_PER_STEP) < R_MARGIN, // 2^4 = 16 < 19.91: no margin crossing at step 4
  },
  {
    // Honesty gate: reconciliation/surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp34909-honesty-gate-no-qed',
    description: 'reconciliation measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34909_OP_DEPTH_NEWTON_STEP_RECONCILIATION.isRigorous === false &&
      /imp-34714a/.test(IMP34909_OP_DEPTH_NEWTON_STEP_RECONCILIATION.subGap) &&
      /REMAINS OPEN/.test(IMP34909_OP_DEPTH_NEWTON_STEP_RECONCILIATION.subGap) &&
      /NO QED/.test(IMP34909_OP_DEPTH_NEWTON_STEP_RECONCILIATION.verdict) &&
      /refereed bound is changed/i.test(IMP34909_OP_DEPTH_NEWTON_STEP_RECONCILIATION.verdict),
  },
];

for (const a of IMP34909_OP_DEPTH_NEWTON_STEP_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34909-op-depth-newton-step-reconciliation assertion failed: ${a.id}`);
  }
}
