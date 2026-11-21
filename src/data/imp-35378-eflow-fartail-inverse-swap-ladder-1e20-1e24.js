/**
 * @module imp-35378-eflow-fartail-inverse-swap-ladder-1e20-1e24
 *
 * imp-35378 (numerical, frontier-direction): imp-35279 extended the imp-35236 inverse-swap
 * isolation to a FOUR-rung ladder N = 1e6/1e9/1e12/1e16 and found the swap FRACTION of the
 * E_flow far-tail residual MONOTONE DECREASING (0.786 -> 0.648 -> 0.600 -> 0.568) rather than
 * rising toward 1, but it stopped at N = 1e16 with the fraction still at 0.568 and did NOT
 * measure whether the decrease continues, stalls at a limit, or reverses past that endpoint.
 * This module reproduces the imp-35236 swappable-height-map finite difference VERBATIM at the
 * TWO new deep rungs N = 1e20 and N = 1e24 -- same prefactor, same GRONWALL, same central
 * difference h = 1.0002 -- and tabulates the full component decomposition (fd-true, fd-surrogate,
 * analytic leading, swap gap, residual, remnant, fraction) to test the swap-fraction limit.
 *
 * THE ISOLATION (identical to imp-35236/imp-35279, only the two deep rungs are new)
 * -------------------------------------------------------------------------------
 * Reproduce the exact imp-35135 far-tail quantity with a SWAPPABLE height map:
 *     E_flow(N) = C_F * (L / T0) * GRONWALL,   L = log T0,   C_F = (log(T0/2pi) + 1)/2pi,
 * and measure the local log-log exponent by the same central difference (h = 1.0002), once
 * with T0 = effectiveHeightForN(N) (the TRUE RvM inverse) and once with T0 = 2 pi N / log N
 * (the closed surrogate). The exponent difference is PURELY the inverse swap.
 *
 *   N        fd-true    fd-surrogate   analytic lead   swap gap   residual   remnant   fraction
 *   1e16     -0.9142     -0.9167        -0.9186         0.0025     0.0043     0.0019     0.568  (imp-35279 endpoint)
 *   1e20     -0.9317     -0.9334        -0.9349         0.0017     0.0031     0.0014     0.549  (NEW)
 *   1e24     -0.9434     -0.9446        -0.9457         0.0013     0.0024     0.0011     0.535  (NEW)
 *
 * THE FINDING (answers the imp-35378 limit question)
 * --------------------------------------------------
 * (1) The isolated inverse-swap gap KEEPS its monotone decrease at the two deep rungs:
 *     0.0025 (1e16) -> 0.0017 (1e20) -> 0.0013 (1e24), tracking the still-shrinking residual.
 * (2) The two-component reconstruction swap gap + closed-form/prefactor remnant continues to
 *     rebuild the analytic residual to < 5e-4 at both new rungs: 0.0017+0.0014, 0.0013+0.0011.
 * (3) The swap FRACTION continues its monotone decrease and does NOT reverse:
 *     0.568 (1e16) -> 0.549 (1e20) -> 0.535 (1e24). The per-decade decrement is SHRINKING
 *     (0.0195 over 1e16->1e20, then 0.0134 over 1e20->1e24), so the fall is decelerating, but
 *     it is still strictly downward -- the fraction does not stall or turn up at these rungs.
 * (4) Both new rungs remain ABOVE one-half (0.549 and 0.535 > 0.5), consistent with the
 *     imp-35370 half-crossover result that the swap fraction first equals 0.5 only near
 *     N ~ 5.7e44 (ln N ~ 103): the inverse swap is still the DOMINANT but not sole residual
 *     component twenty and twenty-four decades past the imp-35279 endpoint. No limit is reached
 *     by N = 1e24; the fraction is on a slow monotone glide toward (and eventually below) 0.5.
 *
 * MEASUREMENT ONLY. Reproduces the imp-35236 finite difference on the inherited imp-3220/
 * imp-3406 extrapolation, NOT a rigorous asymptotic; changes no bound; E_flow > 0 strictness
 * (imp-33848) untouched; C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent
 * 1/2 per imp-3463; imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35279-eflow-fartail-inverse-swap-ladder (four-rung ladder 0.786->0.568; extended here to 1e20/1e24)
 * @see imp-35370-eflow-fartail-swap-fraction-half-crossover (fraction first hits 0.5 near N ~ 5.7e44)
 * @see imp-35236-eflow-fartail-inverse-swap-isolation (isolated the swap at the two anchors 1e6/1e16)
 * @see imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation (measured on effectiveHeightForN)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the true RvM zero-ordinate inverse swapped in here)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;

// imp-35135 exact sub-term constants (no re-derivation): the A1-trap Gronwall factor.
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-35135/imp-35236/imp-35279 exactly

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

// Build a rung with the full imp-35279 component decomposition.
function rungForN(N) {
  const x = Math.log(N);
  const eTrue = (n) => eFlowWith(effectiveHeightForN, n); // true RvM inverse
  const eSurr = (n) => eFlowWith(surrogateHeightForN, n); // closed surrogate
  const fdTrue = localExponent(eTrue, N);
  const fdSurr = localExponent(eSurr, N);
  const analyticLead = leadingAnalyticExponent(x);
  const inverseSwapGap = Math.abs(fdSurr - fdTrue); // PURELY the inverse swap
  const analyticResidual = Math.abs(analyticLead - fdTrue); // imp-35217/imp-35237 residual
  const closedFormRemnant = Math.abs(analyticLead - fdSurr); // NOT the inverse gap
  return {
    N: +N.toExponential(0),
    logN: +x.toFixed(4),
    fdTrueExponent: +fdTrue.toFixed(4),
    fdSurrogateExponent: +fdSurr.toFixed(4),
    analyticLeadingExponent: +analyticLead.toFixed(4),
    inverseSwapGap: +inverseSwapGap.toFixed(4),
    analyticResidual: +analyticResidual.toFixed(4),
    closedFormRemnant: +closedFormRemnant.toFixed(4),
    swapFraction: +(inverseSwapGap / analyticResidual).toFixed(4),
  };
}

// The imp-35279 deep endpoint (recomputed, for the monotone-continuation check) plus the two new rungs.
const ENDPOINT_1E16 = rungForN(1e16); // imp-35279 endpoint, reproduced here
const RUNG_1E20 = rungForN(1e20); // NEW
const RUNG_1E24 = rungForN(1e24); // NEW
const NEW_RUNGS = [RUNG_1E20, RUNG_1E24];
const EXTENDED_LADDER = [ENDPOINT_1E16, RUNG_1E20, RUNG_1E24];

export const IMP35378_EFLOW_FARTAIL_INVERSE_SWAP_LADDER_1E20_1E24 = {
  id: 'imp-35378',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-35279 E_flow far-tail inverse-swap ladder (swap ONLY the height map in the ' +
    'exact imp-35135 finite-difference exponent) from its deep endpoint N = 1e16 to the two ' +
    'new rungs N = 1e20 and N = 1e24, and measure whether the swap FRACTION of the residual ' +
    'continues its monotone decrease toward a limit or reverses.',
  method:
    'Reproduce the imp-35236 swappable-height-map E_flow = C_F * (L/T0) * GRONWALL VERBATIM ' +
    '(same prefactor, same GRONWALL, same central difference h = 1.0002) at N = 1e20 and ' +
    'N = 1e24; the exponent difference under effectiveHeightForN vs T0 = 2 pi N / log N is ' +
    'PURELY the inverse swap. Decompose each residual as swap gap + closed-form/prefactor ' +
    'remnant and read off the swap fraction, extending the imp-35279 four-rung ladder to six.',
  endpoint1e16: ENDPOINT_1E16,
  newRungs: NEW_RUNGS,
  extendedLadder: EXTENDED_LADDER,
  finding: {
    F1_swap_gap_still_monotone:
      'The isolated inverse-swap gap keeps its monotone decrease at the two deep rungs: ' +
      '0.0025 (1e16) -> 0.0017 (1e20) -> 0.0013 (1e24), tracking the still-shrinking residual.',
    F2_two_component_reconstruction_holds:
      'The swap gap + closed-form/prefactor remnant continues to reconstruct the analytic ' +
      'residual to < 5e-4 at both new rungs: 0.0017+0.0014 (1e20) and 0.0013+0.0011 (1e24).',
    F3_swap_fraction_monotone_no_reversal:
      'The swap FRACTION continues its monotone decrease and does NOT reverse: 0.568 (1e16) -> ' +
      '0.549 (1e20) -> 0.535 (1e24). The per-decade decrement SHRINKS (0.0195 then 0.0134), so ' +
      'the fall decelerates, but it stays strictly downward -- no stall and no turn-up at these rungs.',
    F4_still_above_half_consistent_with_imp35370:
      'Both new rungs remain ABOVE one-half (0.549 and 0.535 > 0.5), consistent with the ' +
      'imp-35370 half-crossover near N ~ 5.7e44: the inverse swap is still the DOMINANT but not ' +
      'sole residual component twenty and twenty-four decades past the imp-35279 endpoint. No ' +
      'limit is reached by 1e24; the fraction is on a slow monotone glide toward (and below) 0.5.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Extending the imp-35279 inverse-swap ' +
    'ladder past N = 1e16 to N = 1e20 and N = 1e24: the isolated swap gap continues 0.0025 -> ' +
    '0.0017 -> 0.0013 (monotone) and swap gap + closed-form/prefactor remnant reconstructs the ' +
    'residual to < 5e-4 at both new rungs. The swap FRACTION continues its monotone decrease ' +
    '0.568 -> 0.549 -> 0.535 with a SHRINKING per-decade decrement (decelerating, not reversing) ' +
    'and stays above one-half at both rungs, consistent with the imp-35370 half-crossover near ' +
    'N ~ 5.7e44: the inverse swap remains the dominant but not sole residual component, and no ' +
    'limit is reached by 1e24. Measurement only on the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; E_flow > 0 strictness (imp-33848) untouched; C_mb GUE-conditional ' +
    'per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; imp-3066 K_a >= 0 ' +
    'untouched; changes no bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35279 (four-rung ladder 0.786->0.568, extended here to 1e20/1e24); imp-35370 (swap ' +
    'fraction first hits 0.5 near N ~ 5.7e44); imp-35236 (isolated the swap at 1e6/1e16); ' +
    'imp-35135 (measured on effectiveHeightForN); imp-486 (C_mb GUE-conditional, UNTOUCHED); ' +
    'lambda-rh-height-mapping.',
};

export const IMP35378_EFLOW_FARTAIL_INVERSE_SWAP_LADDER_1E20_1E24_ASSERTIONS = [
  {
    // The reproduced 1e16 endpoint matches the imp-35279 stored literals (isolation is faithful).
    id: 'imp35378-endpoint-1e16-reproduces-imp35279',
    description: 'reproduced 1e16 rung matches imp-35279 fd-true -0.9142, swap 0.0025, fraction 0.568',
    holds: () =>
      Math.abs(ENDPOINT_1E16.fdTrueExponent - -0.9142) < 5e-4 &&
      Math.abs(ENDPOINT_1E16.inverseSwapGap - 0.0025) < 5e-4 &&
      Math.abs(ENDPOINT_1E16.swapFraction - 0.568) < 2e-3,
  },
  {
    // The two new rungs land at the measured swap gaps ~0.0017 (1e20) and ~0.0013 (1e24).
    id: 'imp35378-swap-gap-new-rungs',
    description: 'isolated inverse-swap gap is ~0.0017 (1e20) and ~0.0013 (1e24)',
    holds: () =>
      Math.abs(RUNG_1E20.inverseSwapGap - 0.0017) < 5e-4 &&
      Math.abs(RUNG_1E24.inverseSwapGap - 0.0013) < 5e-4,
  },
  {
    // The swap gap keeps strictly decreasing across the extended 1e16 -> 1e20 -> 1e24 rungs.
    id: 'imp35378-swap-gap-monotone-extended',
    description: 'inverse-swap gap strictly decreases 0.0025 > 0.0017 > 0.0013 past the imp-35279 endpoint',
    holds: () =>
      ENDPOINT_1E16.inverseSwapGap > RUNG_1E20.inverseSwapGap &&
      RUNG_1E20.inverseSwapGap > RUNG_1E24.inverseSwapGap,
  },
  {
    // Two-component reconstruction (swap + remnant ~ residual) holds at both new rungs.
    id: 'imp35378-two-component-reconstruction-new-rungs',
    description: 'swap gap + closed-form remnant reconstructs the analytic residual to <5e-4 at 1e20 and 1e24',
    holds: () =>
      EXTENDED_LADDER.every(
        (r) => Math.abs(r.inverseSwapGap + r.closedFormRemnant - r.analyticResidual) < 5e-4,
      ),
  },
  {
    // The swap fraction continues its monotone decrease WITHOUT reversing, and stays above 0.5.
    id: 'imp35378-swap-fraction-monotone-no-reversal',
    description: 'swap fraction strictly decreases 0.568 > 0.549 > 0.535 and stays above 0.5 at both new rungs',
    holds: () =>
      ENDPOINT_1E16.swapFraction > RUNG_1E20.swapFraction &&
      RUNG_1E20.swapFraction > RUNG_1E24.swapFraction &&
      NEW_RUNGS.every((r) => r.swapFraction > 0.5 && r.swapFraction < ENDPOINT_1E16.swapFraction),
  },
  {
    // The per-decade decrement of the swap fraction is SHRINKING (the fall is decelerating).
    id: 'imp35378-swap-fraction-decelerating',
    description: 'per-decade fraction decrement shrinks: (0.568-0.549)/4 > (0.549-0.535)/4',
    holds: () =>
      (ENDPOINT_1E16.swapFraction - RUNG_1E20.swapFraction) / 4 >
      (RUNG_1E20.swapFraction - RUNG_1E24.swapFraction) / 4,
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35378-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35378_EFLOW_FARTAIL_INVERSE_SWAP_LADDER_1E20_1E24.isRigorous === false &&
      /NO QED/.test(IMP35378_EFLOW_FARTAIL_INVERSE_SWAP_LADDER_1E20_1E24.verdict) &&
      /refereed bound is changed/i.test(IMP35378_EFLOW_FARTAIL_INVERSE_SWAP_LADDER_1E20_1E24.verdict),
  },
];

for (const a of IMP35378_EFLOW_FARTAIL_INVERSE_SWAP_LADDER_1E20_1E24_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35378-eflow-fartail-inverse-swap-ladder-1e20-1e24 assertion failed: ${a.id}`,
    );
  }
}
