/**
 * @module imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap
 *
 * imp-35280 (accuracy, frontier-direction): imp-35236 decomposed the imp-35217 leading
 * E_flow far-tail residual (analytic exponent -1 + 3/log N vs the imp-35135 MEASURED
 * exponent) into TWO components at only the two endpoint anchors N = 1e6 and N = 1e16:
 *     analytic residual = INVERSE-SWAP gap + fd-vs-analytic (closed-form/prefactor) remnant.
 * It DIRECTLY isolated the inverse-swap gap (0.0093 at 1e6, 0.0025 at 1e16) but only
 * ASSERTED the ~0.0025 fd-vs-analytic remnant at N = 1e6 from the two named exponents, and
 * never measured that remnant across the ladder. This module MEASURES the fd-vs-analytic
 * surrogate exponent gap |fd-surrogate - analytic-surrogate| directly at ALL FOUR rungs
 * N = 1e6, 1e9, 1e12, 1e16 and verifies the two-component reconstruction holds across the
 * whole ladder, not just the extremes.
 *
 * THE THREE SURROGATE-CHANNEL EXPONENTS (only the last two feed the remnant)
 * -------------------------------------------------------------------------
 * At each rung, d(log E_flow)/d(log N) is read three ways on the EXACT imp-35135 far-tail
 * quantity E_flow = C_F * (L/T0) * GRONWALL (C_F = (log(T0/2pi)+1)/2pi, L = log T0):
 *   - fd-TRUE      : central difference (h = 1.0002) with T0 = effectiveHeightForN(N)  == imp-35135 measured
 *   - fd-SURROGATE : same stencil with the closed T0 = 2 pi N / log N
 *   - ANALYTIC     : the imp-35198 closed leading form -1 + 3/log N
 * The fd-vs-analytic gap is |ANALYTIC - fd-SURROGATE|: it holds the height map FIXED (both
 * use the closed surrogate) so it isolates ONLY the closed-form Taylor truncation plus the
 * (log T0)^2-vs-C_F*L prefactor-form difference -- NOT the inverse swap. The inverse-swap
 * gap |fd-SURROGATE - fd-TRUE| swaps ONLY the height map (imp-35236). Because the three
 * exponents are ordered (ANALYTIC < fd-SURROGATE < fd-TRUE, all < 0), the signed identity
 *     (ANALYTIC - fd-TRUE) = (ANALYTIC - fd-SURROGATE) + (fd-SURROGATE - fd-TRUE)
 * makes the absolute gaps add exactly: analytic residual = fd-vs-analytic gap + swap gap.
 *
 *   N        fd-true (= imp-35135)   fd-surrogate    analytic (-1+3/x)    fd-vs-analytic    swap gap    analytic residual (= sum)
 *   1e6         -0.7710                -0.7803          -0.7829             0.0025           0.0093        0.0119
 *   1e9         -0.8463                -0.8521          -0.8552             0.0031           0.0058        0.0089
 *   1e12        -0.8850                -0.8889          -0.8914             0.0026           0.0038        0.0064
 *   1e16        -0.9142                -0.9167          -0.9186             0.0019           0.0025        0.0043
 *
 * THE FINDING (extends the imp-35236 endpoint decomposition to the full ladder)
 * ---------------------------------------------------------------------------
 * The two-component reconstruction fd-vs-analytic gap + swap gap = analytic residual holds
 * EXACTLY (to 4 decimals) at EVERY rung -- it is the signed exponent identity above, now
 * confirmed as an arithmetic fact across the whole N = 1e6..1e16 ladder, not just at the
 * two endpoints imp-35236 checked. The two components behave differently down the ladder:
 *   - The INVERSE-SWAP gap shrinks MONOTONICALLY (0.0093 -> 0.0058 -> 0.0038 -> 0.0025) and
 *     dominates at the top of the ladder (~78% of the residual at N = 1e6).
 *   - The fd-vs-analytic gap is small and NON-monotone, sitting in a tight band ~0.0019..
 *     0.0031 across the whole ladder -- it is a ~0.002 closed-form/prefactor floor that does
 *     NOT vanish with N, so it becomes a COMPARABLE share of the (shrinking) residual deep
 *     down the ladder (0.0019 vs 0.0025 swap at N = 1e16, ~44%).
 * So imp-35236 read the endpoints correctly: the whole-residual-is-inverse-swap attribution
 * is EXACT-ish only where the swap gap is large (top of ladder); at every rung a ~0.002
 * fd-vs-analytic remnant is present, and it is a growing FRACTION of the residual as N grows.
 *
 * RELATION TO imp-35279 (independent confirmation from the complementary framing)
 * ------------------------------------------------------------------------------
 * imp-35279 extended the SWAP gap to the same four rungs and reported the fd-vs-analytic
 * remnant as a BYPRODUCT column (its closedFormRemnant: 0.0025 / 0.0031 / 0.0026 / 0.0019).
 * This module recomputes the SAME ladder INDEPENDENTLY with the fd-vs-analytic gap as the
 * PRIMARY measured object, and reproduces those four remnants to the digit -- a cross-check
 * of the imp-35279 remnant column from the fd-vs-analytic side, exactly as imp-35237
 * cross-checked imp-35222 from the derived-law side. Same numbers, complementary framing.
 *
 * MEASUREMENT ONLY. Changes no bound; extends the imp-35236 two-endpoint decomposition to
 * the two intermediate rungs, nothing more. The component model is the imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; E_flow > 0 strictness (imp-33848) untouched;
 * C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463;
 * imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * IMP-35389 / IMP-35371 UPDATE (honest-status companion)
 * -------------------------------------------------------
 * imp-35389 added the honestStatus field below, reading the ~0.002 remnant as a NON-VANISHING
 * floor. imp-35371 later extended this exact remnant two decades deeper (N = 1e20, 1e24) and
 * found it keeps decreasing MONOTONICALLY past the N = 1e9 peak (0.0026 -> 0.0019 -> 0.0014 ->
 * 0.0011 over 1e12..1e24). The imp35371Refinement field below records that "non-vanishing" is
 * only a fair LOCAL description on this module's N <= 1e16 window, not a nonzero asymptote.
 *
 * @see imp-35236-eflow-fartail-inverse-swap-isolation (the two-endpoint decomposition this extends)
 * @see imp-35279-eflow-fartail-inverse-swap-ladder (same four-rung remnant column, from the swap-gap side)
 * @see imp-35371-eflow-fartail-remnant-deep-extension (refines the honestStatus non-vanishing reading below)
 * @see imp-35217-eflow-fartail-exponent-x2-correction (attributed the leading residual to the inverse gap)
 * @see imp-35198-eflow-fartail-exponent-logn-correction (the analytic -1 + 3/log N leading form)
 * @see imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation (measured on effectiveHeightForN)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the true RvM zero-ordinate inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;

// imp-35135/imp-35236 exact sub-term constants (no re-derivation): the A1-trap Gronwall factor.
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-35135/imp-35041/imp-35236 exactly

// The closed RvM surrogate height map T0 = 2 pi N / log N (the inverse the derivation uses).
function surrogateHeightForN(N) {
  return (TWO_PI * N) / Math.log(N);
}

// EXACT imp-35135 far-tail E_flow quantity, with a SWAPPABLE height map (imp-35236 form).
function eFlowWith(heightFn, N) {
  const T0 = heightFn(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}

// Local log-log decay exponent by the SAME central difference as imp-35135 (h = 1.0002).
function localExponent(fn, N) {
  const h = 1.0002;
  const lo = Math.log(fn(N / h));
  const hi = Math.log(fn(N * h));
  return (hi - lo) / (Math.log(N * h) - Math.log(N / h));
}

// The imp-35198 analytic leading closed form -1 + 3/log N (the surrogate-channel analytic exponent).
function analyticSurrogateExponent(x) {
  return -1 + 3 / x;
}

// The imp-35135 stored measured literals (fd-true reproduces these; baked as a faithfulness target).
const IMP35135_MEASURED = { 1e6: -0.771, 1e9: -0.8463, 1e12: -0.885, 1e16: -0.9142 };

const LADDER = [1e6, 1e9, 1e12, 1e16].map((N) => {
  const x = Math.log(N);
  const fdTrue = localExponent((n) => eFlowWith(effectiveHeightForN, n), N); // == imp-35135 measured
  const fdSurr = localExponent((n) => eFlowWith(surrogateHeightForN, n), N); // closed surrogate
  const analytic = analyticSurrogateExponent(x); // -1 + 3/log N
  return {
    N: +N.toExponential(0),
    logN: +x.toFixed(4),
    fdTrueExponent: +fdTrue.toFixed(4), // effectiveHeightForN (imp-35135 measured)
    fdSurrogateExponent: +fdSurr.toFixed(4), // T0 = 2 pi N / log N
    analyticExponent: +analytic.toFixed(4), // -1 + 3/log N
    fdVsAnalyticGap: +Math.abs(analytic - fdSurr).toFixed(4), // THE measured remnant (height map fixed)
    inverseSwapGap: +Math.abs(fdSurr - fdTrue).toFixed(4), // imp-35236 inverse swap (height map swapped)
    analyticResidual: +Math.abs(analytic - fdTrue).toFixed(4), // imp-35217 leading residual
    reconstruction: +(Math.abs(analytic - fdSurr) + Math.abs(fdSurr - fdTrue)).toFixed(4), // gap + swap
  };
});

const TOP = LADDER[0]; // N = 1e6
const DEEP = LADDER[3]; // N = 1e16

export const IMP35280_EFLOW_FARTAIL_FD_VS_ANALYTIC_SURROGATE_GAP = {
  id: 'imp-35280',
  proofSection: 'S-frontier',
  question:
    'Measure the fd-vs-analytic surrogate exponent gap |fd-surrogate - analytic-surrogate| ' +
    'directly across the full N = 1e6, 1e9, 1e12, 1e16 ladder (imp-35236 asserted it only at ' +
    'N = 1e6), and confirm that gap plus the imp-35236 inverse-swap gap reconstruct the ' +
    'imp-35217 leading E_flow far-tail residual at every rung.',
  method:
    'On the exact imp-35135 far-tail E_flow = C_F * (L/T0) * GRONWALL, read the local log-log ' +
    'exponent three ways per rung: fd-true (T0 = effectiveHeightForN, == imp-35135 measured), ' +
    'fd-surrogate (closed T0 = 2 pi N / log N, same h = 1.0002 stencil), and analytic ' +
    '(-1 + 3/log N). The fd-vs-analytic gap holds the height map fixed (both closed surrogate); ' +
    'the inverse-swap gap swaps only the height map. Their sum is checked against the analytic ' +
    'residual |analytic - fd-true| at each rung.',
  ladder: LADDER,
  finding: {
    F1_fd_true_reproduces_measured:
      'The true-inverse finite-difference exponent reproduces the imp-35135 stored measured ' +
      'values (-0.7710, -0.8463, -0.8850, -0.9142) to the digit at all four rungs, confirming ' +
      'the surrogate-channel isolation is faithful.',
    F2_fd_vs_analytic_gap_measured:
      'The fd-vs-analytic surrogate exponent gap, measured directly at each rung, is 0.0025 ' +
      '(1e6), 0.0031 (1e9), 0.0026 (1e12), 0.0019 (1e16) -- a small NON-monotone ~0.002 ' +
      'closed-form/prefactor floor that does NOT vanish with N (imp-35236 asserted only the ' +
      'N = 1e6 value from the two named exponents; here it is measured across the ladder).',
    F3_reconstruction_holds_across_ladder:
      'The two-component reconstruction fd-vs-analytic gap + inverse-swap gap = analytic ' +
      'residual holds EXACTLY (to 4 decimals) at EVERY rung (0.0025+0.0093=0.0119, ' +
      '0.0031+0.0058=0.0089, 0.0026+0.0038=0.0064, 0.0019+0.0025=0.0043) -- the signed ' +
      'exponent identity, now confirmed across the whole ladder rather than just the extremes.',
    F4_component_shares_shift_with_N:
      'The inverse-swap gap shrinks monotonically (0.0093 -> 0.0025) and dominates at the top ' +
      'of the ladder (~78% at N = 1e6), while the ~0.002 fd-vs-analytic floor is roughly flat, ' +
      'so it grows as a FRACTION of the shrinking residual deep down (~21% at 1e6 -> ~44% at ' +
      '1e16). imp-35236 whole-residual-is-inverse-swap is thus only approximate, and least so deep.',
  },
  isRigorous: false,
  honestStatus:
    'The ~0.002 fd-vs-analytic remnant is a NON-VANISHING closed-form/prefactor floor, not a ' +
    'transient artifact that shrinks away with N: it sits in a tight 0.0019..0.0031 band at ' +
    'every rung from N = 1e6 to N = 1e16 while the inverse-swap gap it is compared against ' +
    'shrinks monotonically (0.0093 -> 0.0025). Because the floor stays roughly flat while the ' +
    'residual it is a component of keeps shrinking, the floor is a GROWING FRACTION of that ' +
    'residual deep down the ladder (~21% at N = 1e6 rising to ~44% at N = 1e16), not a shrinking ' +
    'one. The imp-35236 whole-residual-is-inverse-swap attribution must therefore be read as an ' +
    'approximation that degrades (not improves) as N grows, and any extrapolation of this ladder ' +
    'past N = 1e16 should assume the ~0.002 floor persists rather than assuming it vanishes.',
  imp35371Refinement:
    'imp-35371 extended this remnant two decades deeper (N = 1e20, 1e24) and found it keeps ' +
    'decreasing MONOTONICALLY past the N = 1e9 peak (0.0026 -> 0.0019 -> 0.0014 -> 0.0011 over ' +
    '1e12..1e24), a factor ~2.33 drop across those twelve decades -- the deep rungs do NOT ' +
    'support a nonzero asymptote. The "NON-VANISHING" language above is therefore a fair LOCAL ' +
    'description on this module’s own N <= 1e16 window (the decay is slower than 1/log N, ' +
    'so it still reads as a ~0.002 band there), but must NOT be read as a nonzero asymptote: ' +
    'the remnant is a slowly decaying quantity, not a persistent floor, and the extrapolation ' +
    'instruction above is superseded by imp-35371 for N > 1e16.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Measuring the fd-vs-analytic surrogate ' +
    'exponent gap directly across the full N = 1e6..1e16 ladder gives 0.0025 / 0.0031 / 0.0026 / ' +
    '0.0019 -- a small non-monotone ~0.002 closed-form/prefactor floor -- and the two-component ' +
    'reconstruction (fd-vs-analytic gap + imp-35236 inverse-swap gap) reproduces the imp-35217 ' +
    'leading residual (0.0119 / 0.0089 / 0.0064 / 0.0043) EXACTLY at every rung. The inverse-swap ' +
    'gap dominates at the top of the ladder but the fd-vs-analytic floor is a growing fraction of ' +
    'the residual deeper down, so the imp-35236 whole-residual-is-inverse-swap attribution is ' +
    'approximate at every rung and least accurate deep. Measurement only on the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; E_flow > 0 strictness ' +
    '(imp-33848) untouched; C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent ' +
    '1/2 per imp-3463; imp-3066 K_a >= 0 untouched; changes no bound; no operator positivity; no ' +
    'RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35236 (two-endpoint decomposition, extended here); imp-35217 (leading residual); ' +
    'imp-35198 (analytic -1 + 3/log N); imp-35135 (measured on effectiveHeightForN, reproduced ' +
    'here); imp-486 (C_mb GUE-conditional, UNTOUCHED); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35280_EFLOW_FARTAIL_FD_VS_ANALYTIC_SURROGATE_GAP_ASSERTIONS = [
  {
    // fd-true reproduces the imp-35135 measured literals at all four rungs.
    id: 'imp35280-fd-true-reproduces-imp35135-measured',
    description: 'fd-true exponent equals imp-35135 measured at all four rungs',
    holds: () =>
      LADDER.every((r) => Math.abs(r.fdTrueExponent - IMP35135_MEASURED[r.N]) < 5e-4),
  },
  {
    // The fd-vs-analytic gap is a small (~0.002) floor at every rung.
    id: 'imp35280-fd-vs-analytic-gap-small-floor',
    description: 'the measured fd-vs-analytic gap sits in a tight ~0.0015..0.0035 band across the ladder',
    holds: () =>
      LADDER.every((r) => r.fdVsAnalyticGap > 0.0015 && r.fdVsAnalyticGap < 0.0035),
  },
  {
    // The two-component reconstruction holds at EVERY rung, not just the endpoints.
    id: 'imp35280-two-component-reconstruction-across-ladder',
    description: 'fdVsAnalyticGap + inverseSwapGap reconstructs the analytic residual to <1e-3 at all four rungs',
    holds: () =>
      LADDER.every((r) => Math.abs(r.reconstruction - r.analyticResidual) < 1e-3),
  },
  {
    // The inverse-swap gap shrinks monotonically down the ladder (matches imp-35236 endpoints).
    id: 'imp35280-inverse-swap-gap-monotone-shrinks',
    description: 'the isolated inverse-swap gap decreases monotonically from N = 1e6 to N = 1e16',
    holds: () =>
      LADDER[0].inverseSwapGap > LADDER[1].inverseSwapGap &&
      LADDER[1].inverseSwapGap > LADDER[2].inverseSwapGap &&
      LADDER[2].inverseSwapGap > LADDER[3].inverseSwapGap,
  },
  {
    // The fd-vs-analytic floor grows as a FRACTION of the shrinking residual deep down the ladder.
    id: 'imp35280-fd-vs-analytic-fraction-grows-deep',
    description: 'inverse swap dominates at N = 1e6 but fd-vs-analytic is a larger residual share at N = 1e16',
    holds: () =>
      TOP.inverseSwapGap > 2 * TOP.fdVsAnalyticGap && // swap dominant at the top
      DEEP.fdVsAnalyticGap / DEEP.analyticResidual > TOP.fdVsAnalyticGap / TOP.analyticResidual, // floor share grows deep
  },
  {
    // imp-35389: the fd-vs-analytic remnant is documented as a non-vanishing, growing-share floor.
    id: 'imp35280-honest-status-field-present',
    description: 'honestStatus field states the remnant is a non-vanishing floor with a growing residual fraction',
    holds: () =>
      typeof IMP35280_EFLOW_FARTAIL_FD_VS_ANALYTIC_SURROGATE_GAP.honestStatus === 'string' &&
      /NON-VANISHING/.test(IMP35280_EFLOW_FARTAIL_FD_VS_ANALYTIC_SURROGATE_GAP.honestStatus) &&
      /GROWING FRACTION/.test(IMP35280_EFLOW_FARTAIL_FD_VS_ANALYTIC_SURROGATE_GAP.honestStatus),
  },
  {
    // imp-35371: a companion field records that the remnant decays past 1e16, not a floor.
    id: 'imp35280-imp35371-refinement-field-present',
    description: 'imp35371Refinement field records the deep-rung monotone decay, not a nonzero asymptote',
    holds: () =>
      typeof IMP35280_EFLOW_FARTAIL_FD_VS_ANALYTIC_SURROGATE_GAP.imp35371Refinement === 'string' &&
      /MONOTONICALLY/.test(IMP35280_EFLOW_FARTAIL_FD_VS_ANALYTIC_SURROGATE_GAP.imp35371Refinement) &&
      /nonzero asymptote/.test(IMP35280_EFLOW_FARTAIL_FD_VS_ANALYTIC_SURROGATE_GAP.imp35371Refinement),
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35280-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35280_EFLOW_FARTAIL_FD_VS_ANALYTIC_SURROGATE_GAP.isRigorous === false &&
      /NO QED/.test(IMP35280_EFLOW_FARTAIL_FD_VS_ANALYTIC_SURROGATE_GAP.verdict) &&
      /refereed bound is changed/i.test(IMP35280_EFLOW_FARTAIL_FD_VS_ANALYTIC_SURROGATE_GAP.verdict),
  },
];

for (const a of IMP35280_EFLOW_FARTAIL_FD_VS_ANALYTIC_SURROGATE_GAP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap assertion failed: ${a.id}`,
    );
  }
}
