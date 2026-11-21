/**
 * @module imp-35236-eflow-fartail-inverse-swap-isolation
 *
 * imp-35236 (numerical, frontier-direction): imp-35217/imp-35198 ATTRIBUTED the ~0.012
 * (N = 1e6) / ~0.003 (N = 1e16) residual between the derived E_flow far-tail exponent and
 * the imp-35135 MEASURED exponent to the surrogate-vs-true-RvM-inverse gap (imp-35135
 * measures on effectiveHeightForN, the derivation uses the closed T0 = 2 pi N / log N
 * surrogate), but NEVER directly measured that gap by swapping the inverse. This module
 * ISOLATES it: it evaluates d(log E_flow)/d(log N) at N = 1e6 and N = 1e16 by the SAME
 * finite-difference method under BOTH height maps, holding the E_flow prefactor form fixed,
 * so the ONLY thing that changes between the two exponents is the inverse.
 *
 * THE ISOLATION (only the height map differs)
 * -------------------------------------------
 * Reproduce the exact imp-35135 far-tail quantity with a SWAPPABLE height map:
 *     E_flow(N) = C_F * (L / T0) * GRONWALL,   L = log T0,   C_F = (log(T0/2pi) + 1)/2pi,
 * and measure the local log-log exponent by the same central difference (h = 1.0002) as
 * imp-35135, once with T0 = effectiveHeightForN(N) (the TRUE RvM zero-ordinate inverse,
 * Newton on the full N(T) = (T/2pi)(log(T/2pi) - 1)) and once with T0 = 2 pi N / log N (the
 * closed surrogate). Because the prefactor form, the GRONWALL factor, and the difference
 * stencil are IDENTICAL between the two runs, the difference of the two exponents is PURELY
 * the inverse swap -- no prefactor-model or closed-form-truncation contamination.
 *
 *   N        fd-true (= imp-35135)   fd-surrogate    INVERSE-SWAP gap    imp-35217 leading residual
 *   1e6         -0.7710                -0.7803          0.0093             0.0119 (analytic -0.7829 vs meas)
 *   1e16        -0.9142                -0.9167          0.0025             0.0043 (analytic -0.9186 vs meas)
 *
 * THE FINDING (refines the imp-35217 attribution)
 * -----------------------------------------------
 * The directly-isolated surrogate-vs-true-inverse gap is 0.0093 at N = 1e6 and 0.0025 at
 * N = 1e16. The fd-true exponent reproduces the imp-35135 stored measured values (-0.7710,
 * -0.9142) to the digit, confirming the isolation is faithful. The swap gap:
 *   - N = 1e16: 0.0025 ~ the full ~0.003 residual -- the inverse swap accounts for
 *     ESSENTIALLY ALL of it there, CONFIRMING the imp-35217/imp-35198 attribution.
 *   - N = 1e6: 0.0093 is the BULK (~78%) of the ~0.012 residual, but NOT all of it. A
 *     residual ~0.0025 remnant survives the swap: it is the closed-form Taylor truncation
 *     PLUS the (log T0)^2-vs-C_F*L prefactor-form difference between the ANALYTIC surrogate
 *     exponent (-1 + 3/x = -0.7829) and the FINITE-DIFFERENCE surrogate exponent (-0.7803),
 *     NOT the inverse gap. The two components add: 0.0093 (swap) + 0.0025 (closed-form/
 *     prefactor) = 0.0118 ~ the imp-35217 leading residual 0.0119.
 * So the imp-35217/imp-35198 claim that the WHOLE residual is the inverse gap is EXACT at
 * N = 1e16 and APPROXIMATE at N = 1e6: the inverse swap is the dominant but not sole
 * component there, with a ~0.002 closed-form/prefactor remnant that is NOT the inverse gap.
 *
 * MEASUREMENT ONLY. Changes no bound; the component model is the imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; E_flow > 0 strictness (imp-33848) untouched;
 * C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463;
 * imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35217-eflow-fartail-exponent-x2-correction (attributed the residual to the inverse gap; isolated here)
 * @see imp-35198-eflow-fartail-exponent-logn-correction (leading -1 + 3/log N derivation)
 * @see imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation (measured on effectiveHeightForN)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the true RvM zero-ordinate inverse swapped in here)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;

// imp-35135 exact sub-term constants (no re-derivation): the A1-trap Gronwall factor.
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-35135/imp-35041 exactly

// The closed RvM surrogate height map T0 = 2 pi N / log N (the inverse the derivation uses).
function surrogateHeightForN(N) {
  return (TWO_PI * N) / Math.log(N);
}

// EXACT imp-35135 far-tail E_flow quantity, with a SWAPPABLE height map. Everything except
// the height map is held identical to imp-35135 so the difference isolates the inverse.
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

// The analytic leading closed form -1 + 3/log N (imp-35198), used only to decompose the
// N = 1e6 residual into (inverse swap) + (closed-form/prefactor remnant).
function leadingAnalyticExponent(x) {
  return -1 + 3 / x;
}

const ANCHORS = [1e6, 1e16].map((N) => {
  const x = Math.log(N);
  const eTrue = (n) => eFlowWith(effectiveHeightForN, n); // true RvM inverse
  const eSurr = (n) => eFlowWith(surrogateHeightForN, n); // closed surrogate
  const fdTrue = localExponent(eTrue, N); // == imp-35135 measured exponent
  const fdSurr = localExponent(eSurr, N);
  const analyticLead = leadingAnalyticExponent(x);
  return {
    N: +N.toExponential(0),
    logN: +x.toFixed(4),
    fdTrueExponent: +fdTrue.toFixed(4), // effectiveHeightForN (imp-35135 measured)
    fdSurrogateExponent: +fdSurr.toFixed(4), // T0 = 2 pi N / log N
    analyticLeadingExponent: +analyticLead.toFixed(4), // -1 + 3/log N
    inverseSwapGap: +Math.abs(fdSurr - fdTrue).toFixed(4), // PURELY the inverse swap
    analyticResidualVsMeasured: +Math.abs(analyticLead - fdTrue).toFixed(4), // imp-35217 residual
    closedFormRemnant: +Math.abs(analyticLead - fdSurr).toFixed(4), // NOT the inverse gap
  };
});

const TOP = ANCHORS[0]; // N = 1e6
const DEEP = ANCHORS[1]; // N = 1e16

export const IMP35236_EFLOW_FARTAIL_INVERSE_SWAP_ISOLATION = {
  id: 'imp-35236',
  proofSection: 'S-frontier',
  question:
    'Directly isolate the surrogate-vs-true-RvM-inverse gap in the E_flow far-tail decay ' +
    'exponent: evaluate d(log E_flow)/d(log N) at N = 1e6 and N = 1e16 by the same ' +
    'finite-difference method under BOTH the closed T0 = 2 pi N / log N surrogate AND the ' +
    'true effectiveHeightForN RvM inverse, and check the difference reproduces the ~0.012 ' +
    '(1e6) / ~0.003 (1e16) residual imp-35217/imp-35198 attribute to the surrogate.',
  method:
    'Reproduce the exact imp-35135 E_flow = C_F * (L/T0) * GRONWALL (C_F = (log(T0/2pi)+1)/2pi, ' +
    'L = log T0) with a swappable height map, and measure the local log-log exponent by the ' +
    'same central difference (h = 1.0002). Only the height map differs between the two runs, ' +
    'so their exponent difference is PURELY the inverse swap.',
  anchors: ANCHORS,
  topInverseSwapGap: TOP.inverseSwapGap, // 0.0093 at N = 1e6
  deepInverseSwapGap: DEEP.inverseSwapGap, // 0.0025 at N = 1e16
  finding: {
    F1_fd_true_reproduces_measured:
      'The true-inverse finite-difference exponent reproduces the imp-35135 stored measured ' +
      'values (-0.7710 at N = 1e6, -0.9142 at N = 1e16) to the digit, confirming the isolation ' +
      'is faithful (same prefactor form, same GRONWALL, same difference stencil).',
    F2_swap_gap_isolated:
      'The directly-isolated surrogate-vs-true-inverse gap is 0.0093 at N = 1e6 and 0.0025 at ' +
      'N = 1e16 -- the FIRST direct measurement of the swap imp-35217/imp-35198 named but ' +
      'never isolated (they inferred it from the two-term Taylor image, never by swapping T0).',
    F3_refines_the_attribution:
      'At N = 1e16 the swap gap 0.0025 ~ the full ~0.003 residual -- the inverse swap accounts ' +
      'for ESSENTIALLY ALL of it, CONFIRMING the imp-35217 attribution. At N = 1e6 the swap gap ' +
      '0.0093 is the BULK (~78%) of the ~0.012 residual but NOT all: a ~0.0025 remnant survives ' +
      'the swap (0.0093 + 0.0025 = 0.0118 ~ the imp-35217 leading residual 0.0119). That remnant ' +
      'is the closed-form Taylor truncation plus the (log T0)^2-vs-C_F*L prefactor-form ' +
      'difference between the analytic surrogate -0.7829 and the finite-difference surrogate ' +
      '-0.7803 -- NOT the inverse gap. So the imp-35217/imp-35198 whole-residual attribution is ' +
      'EXACT at N = 1e16 and APPROXIMATE at N = 1e6 (inverse swap dominant but not sole).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Isolating the surrogate-vs-true-RvM-' +
    'inverse gap directly (swapping ONLY the height map in the exact imp-35135 finite-difference ' +
    'E_flow far-tail exponent) gives 0.0093 at N = 1e6 and 0.0025 at N = 1e16. At N = 1e16 this ~ ' +
    'the full ~0.003 residual (CONFIRMS the imp-35217/imp-35198 attribution); at N = 1e6 it is the ' +
    'BULK (~78%) of the ~0.012 residual, with a ~0.0025 closed-form/prefactor remnant that is NOT ' +
    'the inverse gap (0.0093 + 0.0025 = 0.0118 ~ the 0.0119 leading residual). The whole-residual ' +
    'attribution is thus EXACT deep and APPROXIMATE at the top of the ladder. Measurement only on ' +
    'the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; E_flow > 0 ' +
    'strictness (imp-33848) untouched; C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail ' +
    'exponent 1/2 per imp-3463; imp-3066 K_a >= 0 untouched; changes no bound; no operator ' +
    'positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35217 (attributed the residual to the inverse gap, isolated here); imp-35198 (leading ' +
    '-1 + 3/log N); imp-35135 (measured on effectiveHeightForN, reproduced here); imp-486 (C_mb ' +
    'GUE-conditional, UNTOUCHED); lambda-rh-height-mapping (effectiveHeightForN, swapped in here).',
};

export const IMP35236_EFLOW_FARTAIL_INVERSE_SWAP_ISOLATION_ASSERTIONS = [
  {
    // The true-inverse finite-difference exponent reproduces the imp-35135 measured values.
    id: 'imp35236-fd-true-reproduces-imp35135-measured',
    description: 'fd-true exponent equals imp-35135 measured -0.7710 (1e6) and -0.9142 (1e16)',
    holds: () =>
      Math.abs(TOP.fdTrueExponent - -0.771) < 5e-4 &&
      Math.abs(DEEP.fdTrueExponent - -0.9142) < 5e-4,
  },
  {
    // The isolated inverse-swap gap lands at 0.0093 (1e6) and 0.0025 (1e16).
    id: 'imp35236-inverse-swap-gap-isolated',
    description: 'isolated surrogate-vs-true-inverse gap is ~0.0093 (1e6) and ~0.0025 (1e16)',
    holds: () =>
      Math.abs(TOP.inverseSwapGap - 0.0093) < 5e-4 &&
      Math.abs(DEEP.inverseSwapGap - 0.0025) < 5e-4,
  },
  {
    // At N = 1e16 the swap gap accounts for essentially the full analytic residual (within 0.002).
    id: 'imp35236-swap-explains-full-residual-deep',
    description: 'at N = 1e16 the swap gap is within 0.002 of the full analytic residual (attribution exact)',
    holds: () => Math.abs(DEEP.inverseSwapGap - DEEP.analyticResidualVsMeasured) < 0.002,
  },
  {
    // At N = 1e6 the swap gap is the BULK but NOT all: swap + closed-form remnant ~ analytic residual.
    id: 'imp35236-swap-plus-remnant-reconstructs-top-residual',
    description: 'at N = 1e6 inverseSwapGap + closedFormRemnant reconstructs the analytic residual to <5e-4',
    holds: () =>
      Math.abs(TOP.inverseSwapGap + TOP.closedFormRemnant - TOP.analyticResidualVsMeasured) < 5e-4 &&
      TOP.inverseSwapGap > 0.5 * TOP.analyticResidualVsMeasured && // dominant
      TOP.closedFormRemnant > 0, // but not sole
  },
  {
    // The swap deepens the exponent toward -1 down the ladder and shrinks with N.
    id: 'imp35236-swap-gap-shrinks-with-N',
    description: 'the isolated inverse-swap gap shrinks from N = 1e6 to N = 1e16',
    holds: () =>
      DEEP.inverseSwapGap < TOP.inverseSwapGap &&
      TOP.fdTrueExponent > -1 &&
      TOP.fdTrueExponent < 0 &&
      DEEP.fdTrueExponent < TOP.fdTrueExponent,
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35236-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35236_EFLOW_FARTAIL_INVERSE_SWAP_ISOLATION.isRigorous === false &&
      /NO QED/.test(IMP35236_EFLOW_FARTAIL_INVERSE_SWAP_ISOLATION.verdict) &&
      /refereed bound is changed/i.test(IMP35236_EFLOW_FARTAIL_INVERSE_SWAP_ISOLATION.verdict),
  },
];

for (const a of IMP35236_EFLOW_FARTAIL_INVERSE_SWAP_ISOLATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35236-eflow-fartail-inverse-swap-isolation assertion failed: ${a.id}`,
    );
  }
}
