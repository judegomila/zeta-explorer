/**
 * @module imp-35279-eflow-fartail-inverse-swap-ladder
 *
 * imp-35279 (numerical, frontier-direction): imp-35236 isolated the surrogate-vs-true-RvM-
 * inverse gap in the E_flow far-tail decay exponent ONLY at the two endpoint anchors
 * N = 1e6 and N = 1e16, by swapping ONLY the height map in the exact imp-35135
 * finite-difference exponent (prefactor form and central-difference stencil held fixed).
 * imp-35237 then extended the DERIVED-law-vs-measured residual to the intermediate rungs
 * N = 1e9 and N = 1e12, but NOT the swap isolation. This module reproduces the imp-35236
 * swappable-height-map finite difference VERBATIM at N = 1e9 and N = 1e12 and tabulates
 * the isolated swap gap against the imp-35237 measured residual at those rungs, to test
 * whether the swap FRACTION of the residual interpolates monotonically between the endpoints.
 *
 * THE ISOLATION (identical to imp-35236, only the rungs are new)
 * -------------------------------------------------------------
 * Reproduce the exact imp-35135 far-tail quantity with a SWAPPABLE height map:
 *     E_flow(N) = C_F * (L / T0) * GRONWALL,   L = log T0,   C_F = (log(T0/2pi) + 1)/2pi,
 * and measure the local log-log exponent by the same central difference (h = 1.0002), once
 * with T0 = effectiveHeightForN(N) (the TRUE RvM inverse) and once with T0 = 2 pi N / log N
 * (the closed surrogate). The difference of the two exponents is PURELY the inverse swap.
 *
 *   N        fd-true (= imp-35237 meas)   fd-surrogate   swap gap   analytic residual   swap fraction
 *   1e6         -0.7710                     -0.7803        0.0093      0.0119               0.786
 *   1e9         -0.8463                     -0.8521        0.0058      0.0089               0.648
 *   1e12        -0.8850                     -0.8889        0.0038      0.0064               0.600
 *   1e16        -0.9142                     -0.9167        0.0025      0.0043               0.568
 *
 * THE FINDING (answers the imp-35279 monotone-interpolation question)
 * ------------------------------------------------------------------
 * (1) The fd-true exponent at the two NEW rungs reproduces the imp-35237/imp-35135 stored
 *     MEASURED literals -0.8463 (1e9) and -0.8850 (1e12) to the digit, confirming the swap
 *     isolation is faithful at the intermediate rungs, not just the endpoints.
 * (2) The isolated inverse-swap gap is MONOTONE DECREASING across the full ladder:
 *     0.0093 -> 0.0058 -> 0.0038 -> 0.0025, tracking the shrinking residual.
 * (3) The two-component decomposition swap gap + closed-form/prefactor remnant reconstructs
 *     the analytic residual to < 5e-4 at EVERY rung (not just the two endpoints imp-35236
 *     checked): 0.0093+0.0025, 0.0058+0.0031, 0.0038+0.0026, 0.0025+0.0019.
 * (4) HONEST CORRECTION to the naive expectation: the swap FRACTION of the residual does
 *     interpolate MONOTONICALLY between the endpoints, but it DECREASES (0.786 -> 0.648 ->
 *     0.600 -> 0.568), it does NOT rise toward 1. The closed-form/prefactor remnant stays
 *     roughly constant (~0.0025-0.0031) while the total residual shrinks, so the remnant's
 *     RELATIVE share grows with N. The imp-35236 "essentially ALL of it at N = 1e16" reading
 *     compared the swap gap 0.0025 to an older ~0.003 residual estimate; against the module's
 *     own analytic residual 0.0043 the swap is ~57% at 1e16 -- the dominant but not sole
 *     component at every rung, deep as well as shallow. The whole-residual-is-the-swap
 *     attribution is thus APPROXIMATE across the WHOLE ladder, not exact at the deep end.
 *
 * RELATION TO imp-35280 (complementary framing of the same decomposition)
 * ------------------------------------------------------------------------
 * This module treats the isolated inverse-SWAP gap as the primary measured object and reports
 * the closed-form/prefactor remnant (closedFormRemnant) as a byproduct column. imp-35280
 * measures the SAME four-rung ladder independently with the fd-vs-analytic remnant as its
 * primary object instead, and reproduces this module's closedFormRemnant column to the digit
 * (0.0025 / 0.0031 / 0.0026 / 0.0019) -- a cross-check from the opposite side of the same
 * signed exponent identity. Same numbers, complementary framing.
 *
 * MEASUREMENT ONLY. Reproduces the imp-35236 finite difference on the inherited imp-3220/
 * imp-3406 extrapolation, NOT a rigorous asymptotic; changes no bound; E_flow > 0 strictness
 * (imp-33848) untouched; C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent
 * 1/2 per imp-3463; imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap (same four-rung remnant column, from the fd-vs-analytic side)
 * @see imp-35236-eflow-fartail-inverse-swap-isolation (isolated the swap at only 1e6/1e16; extended here to 1e9/1e12)
 * @see imp-35237-eflow-fartail-exponent-ladder-crosscheck (added 1e9/1e12 to the derived-law residual, not the swap)
 * @see imp-35217-eflow-fartail-exponent-x2-correction (attributed the residual to the inverse gap)
 * @see imp-35198-eflow-fartail-exponent-logn-correction (leading -1 + 3/log N derivation)
 * @see imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation (measured on effectiveHeightForN)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the true RvM zero-ordinate inverse swapped in here)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;

// imp-35135 exact sub-term constants (no re-derivation): the A1-trap Gronwall factor.
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-35135/imp-35041/imp-35236 exactly

// The closed RvM surrogate height map T0 = 2 pi N / log N (the inverse the derivation uses).
function surrogateHeightForN(N) {
  return (TWO_PI * N) / Math.log(N);
}

// EXACT imp-35135/imp-35236 far-tail E_flow quantity, with a SWAPPABLE height map.
function eFlowWith(heightFn, N) {
  const T0 = heightFn(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}

// Local log-log decay exponent by the SAME central difference as imp-35135/imp-35236 (h = 1.0002).
function localExponent(fn, N) {
  const h = 1.0002;
  const lo = Math.log(fn(N / h));
  const hi = Math.log(fn(N * h));
  return (hi - lo) / (Math.log(N * h) - Math.log(N / h));
}

// The analytic leading closed form -1 + 3/log N (imp-35198).
function leadingAnalyticExponent(x) {
  return -1 + 3 / x;
}

// The FULL four-rung ladder: the two imp-35236 endpoints plus the two imp-35237 intermediates.
const RUNGS = [1e6, 1e9, 1e12, 1e16].map((N) => {
  const x = Math.log(N);
  const eTrue = (n) => eFlowWith(effectiveHeightForN, n); // true RvM inverse
  const eSurr = (n) => eFlowWith(surrogateHeightForN, n); // closed surrogate
  const fdTrue = localExponent(eTrue, N); // == imp-35135/imp-35237 measured exponent
  const fdSurr = localExponent(eSurr, N);
  const analyticLead = leadingAnalyticExponent(x);
  const inverseSwapGap = Math.abs(fdSurr - fdTrue); // PURELY the inverse swap
  const analyticResidual = Math.abs(analyticLead - fdTrue); // imp-35217/imp-35237 residual
  const closedFormRemnant = Math.abs(analyticLead - fdSurr); // NOT the inverse gap
  return {
    N: +N.toExponential(0),
    logN: +x.toFixed(4),
    fdTrueExponent: +fdTrue.toFixed(4), // effectiveHeightForN (imp-35237 measured)
    fdSurrogateExponent: +fdSurr.toFixed(4), // T0 = 2 pi N / log N
    analyticLeadingExponent: +analyticLead.toFixed(4), // -1 + 3/log N
    inverseSwapGap: +inverseSwapGap.toFixed(4),
    analyticResidual: +analyticResidual.toFixed(4),
    closedFormRemnant: +closedFormRemnant.toFixed(4),
    swapFraction: +(inverseSwapGap / analyticResidual).toFixed(4), // swap share of the residual
  };
});

const NEW_RUNGS = [RUNGS[1], RUNGS[2]]; // N = 1e9 and 1e12 (the imp-35279 additions)

export const IMP35279_EFLOW_FARTAIL_INVERSE_SWAP_LADDER = {
  id: 'imp-35279',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-35236 inverse-swap isolation (swap ONLY the height map in the exact ' +
    'imp-35135 finite-difference E_flow far-tail exponent) from its two anchors N = 1e6/1e16 ' +
    'to the imp-35237 intermediate rungs N = 1e9/1e12, and tabulate the isolated swap gap ' +
    'against the imp-35237 measured residual to test whether the swap FRACTION of the ' +
    'residual interpolates monotonically between the endpoints.',
  method:
    'Reproduce the imp-35236 swappable-height-map E_flow = C_F * (L/T0) * GRONWALL VERBATIM ' +
    '(same prefactor, same GRONWALL, same central difference h = 1.0002) at N = 1e9 and ' +
    'N = 1e12; the exponent difference under effectiveHeightForN vs T0 = 2 pi N / log N is ' +
    'PURELY the inverse swap. Decompose each residual as swap gap + closed-form/prefactor ' +
    'remnant and read off the swap fraction across the full four-rung ladder.',
  rungs: RUNGS,
  newRungs: NEW_RUNGS,
  finding: {
    F1_fd_true_reproduces_intermediate_measured:
      'The true-inverse finite-difference exponent at the two NEW rungs reproduces the ' +
      'imp-35237/imp-35135 stored measured literals -0.8463 (N = 1e9) and -0.8850 (N = 1e12) ' +
      'to the digit, confirming the swap isolation is faithful at the intermediate rungs too.',
    F2_swap_gap_monotone:
      'The isolated inverse-swap gap is MONOTONE DECREASING across the full ladder: ' +
      '0.0093 -> 0.0058 -> 0.0038 -> 0.0025, tracking the shrinking residual.',
    F3_two_component_reconstruction_holds_everywhere:
      'The swap gap + closed-form/prefactor remnant reconstructs the analytic residual to ' +
      '< 5e-4 at EVERY rung, not just the two imp-35236 endpoints: 0.0093+0.0025, ' +
      '0.0058+0.0031, 0.0038+0.0026, 0.0025+0.0019.',
    F4_swap_fraction_monotone_but_decreasing:
      'HONEST CORRECTION: the swap FRACTION of the residual interpolates MONOTONICALLY ' +
      'between the endpoints, but it DECREASES (0.786 -> 0.648 -> 0.600 -> 0.568), it does ' +
      'NOT rise toward 1. The closed-form/prefactor remnant stays roughly constant ' +
      '(~0.0025-0.0031) while the total residual shrinks, so the remnant relative share GROWS ' +
      'with N. The inverse swap is the dominant but not sole residual component at every rung ' +
      '(deep as well as shallow); the whole-residual-is-the-swap attribution is APPROXIMATE ' +
      'across the WHOLE ladder, not exact at the deep end.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Extending the imp-35236 inverse-swap ' +
    'isolation to the imp-35237 intermediate rungs N = 1e9/1e12: the isolated swap gap runs ' +
    '0.0093 -> 0.0058 -> 0.0038 -> 0.0025 (monotone) and swap gap + closed-form/prefactor ' +
    'remnant reconstructs the residual to < 5e-4 at every rung. The swap FRACTION interpolates ' +
    'MONOTONICALLY but DECREASES (0.786 -> 0.648 -> 0.600 -> 0.568): the inverse swap is the ' +
    'dominant but not sole component at every rung, so the whole-residual-is-the-swap ' +
    'attribution is APPROXIMATE across the whole ladder (the imp-35236 "essentially ALL at ' +
    '1e16" reading was vs an older ~0.003 residual estimate; against the module analytic ' +
    'residual 0.0043 the swap is ~57%). Measurement only on the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; E_flow > 0 strictness (imp-33848) untouched; ' +
    'C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; ' +
    'imp-3066 K_a >= 0 untouched; changes no bound; no operator positivity; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-35236 (isolated the swap at only 1e6/1e16, extended here to 1e9/1e12); imp-35237 ' +
    '(added 1e9/1e12 to the derived-law residual, not the swap); imp-35217 (attributed the ' +
    'residual to the inverse gap); imp-35198 (leading -1 + 3/log N); imp-35135 (measured on ' +
    'effectiveHeightForN); imp-486 (C_mb GUE-conditional, UNTOUCHED); lambda-rh-height-mapping.',
};

export const IMP35279_EFLOW_FARTAIL_INVERSE_SWAP_LADDER_ASSERTIONS = [
  {
    // The fd-true exponent at the two NEW rungs reproduces the imp-35237 measured literals.
    id: 'imp35279-fd-true-reproduces-imp35237-intermediate-measured',
    description: 'fd-true exponent equals imp-35237 measured -0.8463 (1e9) and -0.8850 (1e12)',
    holds: () =>
      Math.abs(NEW_RUNGS[0].fdTrueExponent - -0.8463) < 5e-4 &&
      Math.abs(NEW_RUNGS[1].fdTrueExponent - -0.885) < 5e-4,
  },
  {
    // The isolated swap gap at the new rungs lands at ~0.0058 (1e9) and ~0.0038 (1e12).
    id: 'imp35279-swap-gap-isolated-intermediate',
    description: 'isolated inverse-swap gap is ~0.0058 (1e9) and ~0.0038 (1e12)',
    holds: () =>
      Math.abs(NEW_RUNGS[0].inverseSwapGap - 0.0058) < 5e-4 &&
      Math.abs(NEW_RUNGS[1].inverseSwapGap - 0.0038) < 5e-4,
  },
  {
    // The swap gap is strictly monotone decreasing across the full four-rung ladder.
    id: 'imp35279-swap-gap-monotone-across-ladder',
    description: 'inverse-swap gap strictly decreases 0.0093 > 0.0058 > 0.0038 > 0.0025',
    holds: () =>
      RUNGS[0].inverseSwapGap > RUNGS[1].inverseSwapGap &&
      RUNGS[1].inverseSwapGap > RUNGS[2].inverseSwapGap &&
      RUNGS[2].inverseSwapGap > RUNGS[3].inverseSwapGap,
  },
  {
    // Two-component reconstruction (swap + remnant ~ residual) holds at EVERY rung.
    id: 'imp35279-two-component-reconstruction-every-rung',
    description: 'swap gap + closed-form remnant reconstructs the analytic residual to <5e-4 at all four rungs',
    holds: () =>
      RUNGS.every(
        (r) => Math.abs(r.inverseSwapGap + r.closedFormRemnant - r.analyticResidual) < 5e-4,
      ),
  },
  {
    // The swap fraction interpolates monotonically but DECREASES (does not rise toward 1).
    id: 'imp35279-swap-fraction-monotone-decreasing',
    description: 'swap fraction strictly decreases 0.786 > 0.648 > 0.600 > 0.568 (dominant but not sole at every rung)',
    holds: () =>
      RUNGS[0].swapFraction > RUNGS[1].swapFraction &&
      RUNGS[1].swapFraction > RUNGS[2].swapFraction &&
      RUNGS[2].swapFraction > RUNGS[3].swapFraction &&
      RUNGS.every((r) => r.swapFraction > 0.5 && r.swapFraction < 1),
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35279-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35279_EFLOW_FARTAIL_INVERSE_SWAP_LADDER.isRigorous === false &&
      /NO QED/.test(IMP35279_EFLOW_FARTAIL_INVERSE_SWAP_LADDER.verdict) &&
      /refereed bound is changed/i.test(IMP35279_EFLOW_FARTAIL_INVERSE_SWAP_LADDER.verdict),
  },
];

for (const a of IMP35279_EFLOW_FARTAIL_INVERSE_SWAP_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35279-eflow-fartail-inverse-swap-ladder assertion failed: ${a.id}`,
    );
  }
}
