/**
 * @module imp-34551-bignum-resid-argmax-extended-precision
 *
 * imp-34551 (numerical): bignum (double-double / 106-bit) recompute of resid_exp(k) at refinement
 * rungs e=25 and e=26 to observe the SUB-GAP-imp-34533 continuum argmax jitter BELOW the double-
 * precision storage ULP floor (2^-56 near the ~0.0653 peak). imp-34533 F1 predicted GEOMETRICALLY that
 * the continuum argmax NEVER LOCKS (the continuum vertex is non-dyadic, so the nearest dyadic node keeps
 * changing each rung), but F3 showed a native-double scan CANNOT observe this past e=24 because the
 * top-two resid_exp margin (~1.16 storage ULP at e=25, ~0.29 ULP at e=26) sits at/below one ULP.
 * SUB-GAP-imp-34533-deep-rung-argmax-noise-dominated asked for a higher-than-double-precision recompute
 * tracking the geometric nearest node. This module DELIVERS it observationally.
 *
 * THE EXTENDED-PRECISION RECOMPUTE (offline, reproducible)
 * -------------------------------------------------------
 *   scripts/imp-34551-bignum-resid-argmax.mjs re-implements the inherited imp-33810/imp-33878/imp-34411
 *   resid_exp(k) surrogate in double-double (dd) arithmetic -- ~32 significant digits (~1e-32 relative),
 *   using the standard Dekker/Knuth error-free transforms plus dd exp/log/sqrt (Taylor + Newton), with
 *   NO package installs (no bignum library was vendored). The formulas are byte-for-byte the imp-34411/
 *   imp-34508/imp-34524 primitives (channels / sampleGrid / pSigmaStable / pEcollEndpoints / residExp);
 *   only the arithmetic is widened. Heavy to run at module load, so the outputs are BAKED here (per the
 *   bake-reference-literals convention) and cross-checked against imp-34524/imp-34533 (imported live).
 *   Re-run the script to reproduce. The dd hi-word reproduces the native residExp to a few ULP
 *   (rel. diff 8.50e-16), confirming the widened pipeline is the same function, just resolved deeper.
 *
 * WHAT dd RESOLVES THAT NATIVE DOUBLE CANNOT
 * ------------------------------------------
 *   (a) THE VERTEX. Removing the native cancellation floor lets the Newton vertex be computed with a
 *       MUCH smaller central-difference step H. The imp-34524 vertex k* = 8.821091375252 turns out to be
 *       exactly the H=2^-8 estimate (native double was FORCED to that large H, since a smaller H
 *       catastrophically cancels two ~0.0653 resid values). Shrinking H under dd (2^-10..2^-14) exposes
 *       an O(H^2) central-difference bias from the peak cubic tilt (f third-derivative != 0), and a
 *       Richardson extrapolation (O(H^2) eliminated) converges -- rock-solid to 13 digits across every
 *       pair -- to the TRUE continuum vertex k*_dd = 8.8210916010340, a +2.258e-7 correction to the
 *       imp-34524 value. The curvature |R2| = 3.61964e-2 is UNCHANGED (the bias is in the vertex, not the
 *       second derivative). This refines, and does not contradict, imp-34524: same smooth peak, same
 *       curvature, vertex located off the H=2^-8 lattice.
 *   (b) THE DEEP-RUNG ARGMAX. Centered on k*_dd, the dd argmax over dyadic nodes tracks the geometric
 *       nearest node to k*_dd at EVERY rung e=23..27, with the runner-up always the ADJACENT node -- the
 *       well-resolved smooth-concave-peak signature imp-34524 F3 said native double could not produce
 *       (its double-precision top-two were 3 grid steps apart, non-adjacent noise). At e=25 and e=26 the
 *       dd top-two margins are 0.480 and 0.049 storage ULP -- BELOW one 2^-56 ULP -- so native double
 *       genuinely cannot resolve them (confirming imp-34533 F3), while dd resolves them cleanly.
 *
 * THE FINDING (extended-precision recompute -- SUB-GAP-imp-34533 answered observationally)
 * --------------------------------------------------------------------------------------
 *   (F1) THE DEEP-RUNG ARGMAX IS OBSERVABLE IN dd AND TRACKS THE GEOMETRIC NEAREST NODE. At e=25 the dd
 *        argmax is 8.821091592312 (margin 0.480 ULP) and at e=26 it is 8.821091607213 (margin 0.049 ULP)
 *        -- each the geometric nearest dyadic node to k*_dd, with an adjacent runner-up. The native-double
 *        scan cannot see these (sub-ULP margins), so the deep-rung jitter is a genuine extended-precision
 *        observable, not floor noise -- SUB-GAP-imp-34533-deep-rung-argmax-noise-dominated is answered.
 *   (F2) THE ARGMAX NEVER LOCKS -- confirming imp-34533 F1 OBSERVATIONALLY. The winning node changes
 *        across rungs (e=23 8.821091651917, e=24/25 8.821091592312, e=26 8.821091607213, e=27
 *        8.821091599762) converging to the non-dyadic k*_dd = 8.8210916010340 but never settling on a
 *        fixed value -- exactly the continuum-never-locks prediction imp-34533 F1 could only assert
 *        geometrically, now measured. (Consecutive-rung repeats, e.g. e=24 and e=25, occur only when two
 *        levels round to the same node; the sequence keeps refining, it does not lock.)
 *   (F3) THE imp-34524 VERTEX CARRIED AN O(H^2) FINITE-DIFFERENCE BIAS. k* = 8.821091375252 is the H=2^-8
 *        central-difference vertex native double was locked to; the dd recompute at smaller H
 *        Richardson-converges to k*_dd = 8.8210916010340 (+2.258e-7). This is a vertex REFINEMENT (same
 *        curvature |R2| = 3.61964e-2), not a bound change: the descriptive surrogate peak sits ~2.3e-7
 *        higher than the native-locked estimate.
 *
 * EXTENDED-PRECISION MEASUREMENT / CROSS-CHECK ONLY. Answers an inherited-surrogate sub-gap and refines a
 * descriptive surrogate peak location, NOT an RH bound. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the surrogate resid_exp(k) is descriptive,
 * not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643)
 * is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34533-deep-rung-argmax-jitter-propagation (the sub-gap answered here; source of F1 prediction)
 * @see imp-34524-continuum-margin-below-ulp-floor (source of the H=2^-8 vertex refined here + curvature)
 * @see imp-34411-deep-ladder-kahan-ols-e21-e22-extension (source of the doubling-map operator)
 */

import { IMP34524_CONTINUUM_MARGIN_BELOW_ULP_FLOOR } from './imp-34524-continuum-margin-below-ulp-floor.js';
import { IMP34533_DEEP_RUNG_ARGMAX_JITTER_PROPAGATION } from './imp-34533-deep-rung-argmax-jitter-propagation.js';

// imp-34524 H=2^-8-biased vertex + curvature (imported live for the cross-check).
const IMP34524_KSTAR = IMP34524_CONTINUUM_MARGIN_BELOW_ULP_FLOOR.vertexKStar; // 8.821091375252
const CURVATURE_ABS = IMP34524_CONTINUUM_MARGIN_BELOW_ULP_FLOOR.curvatureAbs; // |R2| = 3.61964221e-2

// resid_exp storage ULP near the ~0.0653 peak (0.0625 <= 0.0653 < 0.125 => exponent -4 => ULP 2^-56).
const RESID_ULP = Math.pow(2, -56); // 1.3877787807814457e-17
const ORIGIN = 6;

// DIRECTLY-MEASURED double-double recompute (offline scripts/imp-34551-bignum-resid-argmax.mjs, baked).
const KSTAR_DD = 8.8210916010340;       // Richardson-converged TRUE continuum vertex (O(H^2) eliminated)
const KSTAR_CORRECTION = 2.2578e-7;     // k*_dd - imp-34524 k* (the finite-difference bias)
const DD_VS_NATIVE_RELDIFF = 8.496e-16; // dd hi-word vs native residExp (few-ULP native rounding)
// dd Newton vertex vs finite-difference step H (native was locked to H=2^-8; dd unlocks small H).
const VERTEX_BY_H = { e8: 8.8210913752557, e10: 8.8210915869229, e11: 8.8210915975062, e12: 8.8210916001520, e13: 8.8210916008135, e14: 8.8210916009788 };
// dd argmax scan centered on k*_dd: argmax == geometric nearest node at every rung; runner-up adjacent.
const RUNGS = [
  { exponent: 23, ddArgmax: 8.821091651917, marginUlps: 2.712, runnerUpNodes: 1 },
  { exponent: 24, ddArgmax: 8.821091592312, marginUlps: 3.277, runnerUpNodes: 1 },
  { exponent: 25, ddArgmax: 8.821091592312, marginUlps: 0.480, runnerUpNodes: 1 },
  { exponent: 26, ddArgmax: 8.821091607213, marginUlps: 0.049, runnerUpNodes: 1 },
  { exponent: 27, ddArgmax: 8.821091599762, marginUlps: 0.048, runnerUpNodes: 1 },
];

// Geometric nearest dyadic node to k*_dd at level e (pure truncation, no operator scan) -- recomputed
// here to self-verify the baked dd argmax tracks the nearest node.
function nearestNode(e) {
  const h = Math.pow(2, -e);
  return ORIGIN + Math.round((KSTAR_DD - ORIGIN) / h) * h;
}
const RUNG = (e) => RUNGS.find((r) => r.exponent === e);

// (F1) dd argmax tracks the geometric nearest node at every rung, and the deep rungs e=25/e=26 sit below
// one storage ULP (native cannot resolve; dd can).
const ARGMAX_TRACKS_NEAREST = RUNGS.every((r) => Math.abs(r.ddArgmax - nearestNode(r.exponent)) < Math.pow(2, -r.exponent) / 4);
const RUNNERUP_ALWAYS_ADJACENT = RUNGS.every((r) => r.runnerUpNodes === 1);
const DEEP_RUNGS_BELOW_ULP = RUNG(25).marginUlps < 1 && RUNG(26).marginUlps < 1;
// (F2) the winning node changes across rungs -> converges to the non-dyadic k*_dd, never locks.
const DISTINCT_WINNERS = new Set(RUNGS.map((r) => r.ddArgmax.toFixed(12))).size > 1;
const ARGMAX_NEVER_LOCKS = DISTINCT_WINNERS && ARGMAX_TRACKS_NEAREST;
// (F3) the imp-34524 vertex is the H=2^-8 estimate; k*_dd is the Richardson limit; curvature unchanged.
const H8_REPRODUCES_IMP34524 = Math.abs(VERTEX_BY_H.e8 - IMP34524_KSTAR) < 1e-9;
const CORRECTION_SELF_CONSISTENT = Math.abs((KSTAR_DD - IMP34524_KSTAR) - KSTAR_CORRECTION) < 1e-10;
const VERTEX_CONVERGES_UP = VERTEX_BY_H.e10 < VERTEX_BY_H.e12 && VERTEX_BY_H.e12 < VERTEX_BY_H.e14 && VERTEX_BY_H.e14 < KSTAR_DD;
// internal cross-check with imp-34533: its (biased) nearest-node claim was built on the H=2^-8 vertex.
const IMP34533_USED_BIASED_VERTEX = Math.abs(IMP34533_DEEP_RUNG_ARGMAX_JITTER_PROPAGATION.kStar - IMP34524_KSTAR) < 1e-9;

export const IMP34551_BIGNUM_RESID_ARGMAX_EXTENDED_PRECISION = {
  id: 'imp-34551',
  proofSection: 'S-frontier',
  question:
    'imp-34533 F3 concluded a native-double resid_exp argmax scan at e>=25 cannot resolve which dyadic ' +
    'node straddling the non-dyadic continuum vertex wins (top-two margin below one 2^-56 storage ULP), ' +
    'and named SUB-GAP-imp-34533-deep-rung-argmax-noise-dominated: it needs a higher-than-double-precision ' +
    'recompute. Re-implement resid_exp(k) in double-double (106-bit) precision and MEASURE at e=25 and ' +
    'e=26 whether the argmax tracks the geometric nearest node or still jitters. Extended-precision ' +
    'measurement to answer an inherited-surrogate sub-gap; NOT an RH bound; no QED.',
  measuredQuantity:
    'the double-double resid_exp(k) argmax over dyadic nodes at rungs e=23..27, its top-two margin in ' +
    'storage ULPs (2^-56), and the Richardson-converged continuum vertex k*_dd (vs the imp-34524 ' +
    'H=2^-8-biased vertex), all recomputed in ~32-significant-digit arithmetic',
  offlineScript: 'scripts/imp-34551-bignum-resid-argmax.mjs',
  residUlp: RESID_ULP,
  imp34524KStar: IMP34524_KSTAR,       // 8.821091375252 (H=2^-8-biased)
  curvatureAbs: CURVATURE_ABS,         // |R2| = 3.61964221e-2 (unchanged)
  kStarDd: KSTAR_DD,                   // 8.8210916010340 (Richardson-converged true vertex)
  kStarCorrection: KSTAR_CORRECTION,   // +2.258e-7
  ddVsNativeRelDiff: DD_VS_NATIVE_RELDIFF, // 8.496e-16 -- dd reproduces native to a few ULP
  vertexByH: VERTEX_BY_H,              // dd vertex vs finite-difference step H
  rungs: RUNGS,                        // e=23..27 dd argmax + margin-in-ULP
  argmaxTracksNearest: ARGMAX_TRACKS_NEAREST, // (F1)
  runnerUpAlwaysAdjacent: RUNNERUP_ALWAYS_ADJACENT, // (F1)
  deepRungsBelowUlp: DEEP_RUNGS_BELOW_ULP, // (F1)
  argmaxNeverLocks: ARGMAX_NEVER_LOCKS, // (F2)
  h8ReproducesImp34524: H8_REPRODUCES_IMP34524, // (F3)
  vertexConvergesUp: VERTEX_CONVERGES_UP, // (F3)
  imp34533UsedBiasedVertex: IMP34533_USED_BIASED_VERTEX, // internal cross-check
  subGapResolution:
    'SUB-GAP-imp-34533-deep-rung-argmax-noise-dominated ANSWERED: the double-double (106-bit) recompute ' +
    'resolves the deep-rung argmax that native double could not. At e=25 the dd argmax is 8.821091592312 ' +
    '(top-two margin 0.480 storage ULP) and at e=26 it is 8.821091607213 (0.049 ULP) -- each the ' +
    'geometric nearest dyadic node to the Richardson-converged continuum vertex k*_dd = 8.8210916010340, ' +
    'with an adjacent runner-up. The argmax tracks the nearest node at every rung and never locks ' +
    '(converging to the non-dyadic k*_dd), confirming imp-34533 F1 observationally. By-product: the ' +
    'imp-34524 vertex k* = 8.821091375252 was the H=2^-8 finite-difference estimate carrying an O(H^2) ' +
    'cubic-tilt bias; the dd recompute refines it by +2.258e-7 (curvature |R2| = 3.61964e-2 unchanged).',
  finding: {
    F1_deep_rung_argmax_observable_and_tracks_nearest:
      'The double-double argmax at e=25 (8.821091592312, margin 0.480 storage ULP) and e=26 ' +
      '(8.821091607213, margin 0.049 ULP) each equals the geometric nearest dyadic node to k*_dd, with ' +
      'the runner-up the ADJACENT node -- the well-resolved smooth-concave-peak signature. Native double ' +
      'cannot see these sub-2^-56-ULP margins (confirming imp-34533 F3), so the deep-rung jitter is a ' +
      'genuine extended-precision observable, answering SUB-GAP-imp-34533-deep-rung-argmax-noise-dominated.',
    F2_argmax_never_locks_confirming_F1:
      'The winning node changes across rungs (e=23 8.821091651917, e=24/25 8.821091592312, e=26 ' +
      '8.821091607213, e=27 8.821091599762), converging to the non-dyadic k*_dd = 8.8210916010340 but ' +
      'never settling on a fixed value -- confirming imp-34533 F1 (continuum never locks) OBSERVATIONALLY, ' +
      'where F1 could previously only assert it geometrically.',
    F3_imp34524_vertex_had_finite_difference_bias:
      'The imp-34524 vertex k* = 8.821091375252 is exactly the H=2^-8 central-difference estimate native ' +
      'double was locked to; the dd recompute at smaller H exposes an O(H^2) cubic-tilt bias and ' +
      'Richardson-converges (stable to 13 digits) to the TRUE continuum vertex k*_dd = 8.8210916010340, a ' +
      '+2.258e-7 refinement -- a descriptive-surrogate peak-location update with curvature |R2| = ' +
      '3.61964e-2 UNCHANGED, changing no bound.',
  },
  isRigorous: false,
  verdict:
    'EXTENDED-PRECISION MEASUREMENT / CROSS-CHECK (NOT rigorous). ANSWERS ' +
    'SUB-GAP-imp-34533-deep-rung-argmax-noise-dominated by re-implementing the inherited ' +
    'imp-33810/imp-33878/imp-34411 resid_exp(k) surrogate in double-double (106-bit, ~32-digit) ' +
    'arithmetic -- no bignum library was vendored, so a Dekker/Knuth double-double split was used with NO ' +
    'package installs. FINDINGS: (F1) the deep-rung argmax IS observable in dd -- at e=25 8.821091592312 ' +
    '(top-two margin 0.480 storage ULP) and at e=26 8.821091607213 (0.049 ULP), each the geometric ' +
    'nearest dyadic node to the continuum vertex with an adjacent runner-up; native double cannot resolve ' +
    'these sub-2^-56-ULP margins (confirming imp-34533 F3). (F2) the argmax NEVER LOCKS -- the winner ' +
    'changes across rungs (e=23 8.821091651917, e=24/25 8.821091592312, e=26 8.821091607213, e=27 ' +
    '8.821091599762) converging to the non-dyadic k*_dd = 8.8210916010340, confirming imp-34533 F1 ' +
    'OBSERVATIONALLY. (F3) by-product: the imp-34524 vertex k* = 8.821091375252 was the H=2^-8 ' +
    'central-difference estimate (native double was cancellation-locked to that large H); the dd ' +
    'recompute at smaller H Richardson-converges to k*_dd = 8.8210916010340 (+2.258e-7), a descriptive ' +
    'surrogate peak REFINEMENT with curvature |R2| = 3.61964e-2 UNCHANGED. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the surrogate resid_exp(k) is ' +
    'descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34533 (the sub-gap answered here; source of the F1 continuum-never-locks prediction); imp-34524 ' +
    '(source of the H=2^-8 vertex refined here and the curvature); imp-34411 (source of the doubling-map ' +
    'operator); imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ansatz).',
};

export const IMP34551_BIGNUM_RESID_ARGMAX_EXTENDED_PRECISION_ASSERTIONS = [
  {
    // (F1) dd argmax tracks the geometric nearest node at every rung; deep rungs below one storage ULP.
    id: 'imp34551-deep-rung-argmax-tracks-nearest-node',
    description: 'the double-double argmax equals the geometric nearest dyadic node to k*_dd at every rung e=23..27 with an adjacent runner-up, and the e=25/e=26 top-two margins are below one 2^-56 storage ULP (native double cannot resolve them; dd can)',
    holds: () => ARGMAX_TRACKS_NEAREST && RUNNERUP_ALWAYS_ADJACENT && DEEP_RUNGS_BELOW_ULP && RUNGS.length === 5,
  },
  {
    // (F2) the argmax never locks: distinct winners across rungs, converging to the non-dyadic k*_dd.
    id: 'imp34551-argmax-never-locks-observationally',
    description: 'the winning node changes across rungs (converging to the non-dyadic k*_dd, never settling), confirming imp-34533 F1 continuum-never-locks OBSERVATIONALLY rather than only geometrically',
    holds: () => ARGMAX_NEVER_LOCKS && DISTINCT_WINNERS,
  },
  {
    // (F3) the imp-34524 vertex was the H=2^-8 estimate; k*_dd is the Richardson limit; curvature unchanged.
    id: 'imp34551-vertex-finite-difference-bias-refined',
    description: 'the imp-34524 vertex reproduces as the H=2^-8 dd estimate, the dd vertex converges upward with shrinking H to k*_dd = 8.8210916010340 (+2.258e-7 correction, self-consistent), and the curvature |R2| is unchanged',
    holds: () => H8_REPRODUCES_IMP34524 && VERTEX_CONVERGES_UP && CORRECTION_SELF_CONSISTENT && IMP34533_USED_BIASED_VERTEX && CURVATURE_ABS > 3.6e-2 && CURVATURE_ABS < 3.7e-2,
  },
  {
    // Honesty gate: extended-precision measurement only, isRigorous false, answers the sub-gap, no QED, no refereed bound is changed.
    id: 'imp34551-honesty-gate-no-qed',
    description: 'Extended-precision measurement only: isRigorous false, ANSWERS SUB-GAP-imp-34533-deep-rung-argmax-noise-dominated, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched, C_mb GUE-conditional per imp-486 untouched, C_C 1/8 ansatz untouched',
    holds: () =>
      IMP34551_BIGNUM_RESID_ARGMAX_EXTENDED_PRECISION.isRigorous === false &&
      /SUB-GAP-imp-34533-deep-rung-argmax-noise-dominated/.test(IMP34551_BIGNUM_RESID_ARGMAX_EXTENDED_PRECISION.verdict) &&
      /NO QED/.test(IMP34551_BIGNUM_RESID_ARGMAX_EXTENDED_PRECISION.verdict) &&
      /refereed bound is changed/i.test(IMP34551_BIGNUM_RESID_ARGMAX_EXTENDED_PRECISION.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34551_BIGNUM_RESID_ARGMAX_EXTENDED_PRECISION.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34551_BIGNUM_RESID_ARGMAX_EXTENDED_PRECISION.verdict) &&
      /C_C 1\/8 ansatz \(imp-2642\/imp-2643\) is UNTOUCHED/i.test(IMP34551_BIGNUM_RESID_ARGMAX_EXTENDED_PRECISION.verdict),
  },
];

for (const a of IMP34551_BIGNUM_RESID_ARGMAX_EXTENDED_PRECISION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34551-bignum-resid-argmax-extended-precision assertion failed: ${a.id}`);
  }
}
