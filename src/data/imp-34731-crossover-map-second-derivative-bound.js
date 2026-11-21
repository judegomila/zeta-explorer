/**
 * @module imp-34731-crossover-map-second-derivative-bound
 *
 * imp-34731 (proof, S-frontier): the imp-34693a seed-band sub-gap says a formal statement of
 * the crossover fixed point must bound the second derivative g'' on the band. This module states
 * that ceiling as a STANDALONE closed-form bound on |g''(N)| over I = [1e9, 1e10] for the
 * inherited imp-3220/imp-3406 surrogate crossover map, derived by the chain rule through the
 * Riemann-von Mangoldt height T0(N), and dedicates a focused numerical MEASUREMENT to it (a
 * 5-probe closed-form-vs-central-difference table plus a monotonicity/tightness sweep).
 *
 * RELATION TO imp-34727 (honest overlap, independent reproduction)
 * ---------------------------------------------------------------
 * imp-34727 ALREADY derived the identical closed-form second derivative
 * g''(N) = -K(2pi)^2(1 + 1/L_T)/(T0^2 L_T^2) EN ROUTE to its second-order seed-defect ENCLOSURE,
 * proved the same monotonicity, and reported the same left-endpoint supremum M ~ 1.480193e-10.
 * This module adds NO new mathematics; it isolates that g'' ceiling as a self-standing bound and
 * independently re-derives it from scratch, reproducing B ~ 1.480193e-10 and confirming the
 * derivation with a dedicated measurement (the tightness ratio B / max_I |g''| = 1.000 and a
 * per-probe relative-error table were not tabulated as a standalone artifact before). Value here
 * is a clean, citable g'' bound + independent cross-check, not a fresh result.
 *
 * THE MAP (inherited, unchanged)
 * ------------------------------
 * From imp-33723 the crossover N_cross is the fixed point of N = g(N) with
 *     g(N) = K * log T0(N),   K = (C_C_PINNED / E_trunc)^2 ~ 1.5727e8,
 * where T0(N) = effectiveHeightForN(N) inverts the Riemann-von Mangoldt count
 * N(T) = (T/2pi)(log(T/2pi) - 1). Write T = T0(N) and u = log(T/2pi) >= 0.
 *
 * THE CHAIN-RULE DERIVATION (the deliverable)
 * -------------------------------------------
 * The count has dN/dT = u/(2pi), so the inverse has
 *     dT/dN = 2pi / u.
 * With L = log T, dL/dT = 1/T and du/dN = (du/dT)(dT/dN) = (1/T)(2pi/u) = 2pi/(T u). Hence
 *     g_prime(N)  = K * (1/T) * dT/dN = 2pi K / (T u).                        (first derivative)
 * Differentiating once more, d/dN (T u) = u (dT/dN) + T (du/dN) = 2pi + 2pi/u = 2pi (1 + 1/u), so
 *     g_double_prime(N) = 2pi K * d/dN[1/(T u)]
 *                       = 2pi K * ( -1/(T u)^2 ) * 2pi (1 + 1/u)
 *                       = - 4 pi^2 K (u + 1) / (T^2 u^3).                      (CLOSED FORM)
 * Therefore |g_double_prime(N)| = 4 pi^2 K (u + 1) / (T^2 u^3), with T = T0(N), u = log(T/2pi).
 *
 * THE BOUND (monotone => endpoint is the supremum)
 * ------------------------------------------------
 * On I = [1e9, 1e10] both T0(N) and u = log(T0/2pi) are STRICTLY INCREASING in N. The numerator
 * grows like (u + 1) ~ u while the denominator T^2 u^3 grows quadratically in T and cubically in
 * u, so |g''(N)| is strictly DECREASING on I. Its supremum is therefore attained at the LEFT
 * endpoint N = 1e9:
 *     |g_double_prime(N)| <= B := 4 pi^2 K (u_L + 1) / (T_L^2 u_L^3),   T_L = T0(1e9),
 *                                                                       u_L = log(T_L/2pi).
 * Numerically B ~ 1.4802e-10 (T_L ~ 3.7187e8, u_L ~ 17.896). This is the g'' ceiling the
 * imp-34693a interval enclosure and the imp-34727 second-order remainder term require.
 *
 * THE FINDING (derivation / measurement only)
 * -------------------------------------------
 *   (D1) CLOSED-FORM g'' MATCHES THE NUMERICAL SAMPLE. At five probes across I
 *        (N in {1e9, 2e9, 3.28e9, 5e9, 1e10}) the closed form -4 pi^2 K (u+1)/(T^2 u^3) agrees
 *        with a second-order central difference of g to < 1e-6 relative -- the chain-rule
 *        derivation is correct, not a mis-assembled composite.
 *   (D2) THE BOUND IS VALID AND TIGHT (NOT LOOSE BY ORDERS OF MAGNITUDE). Sampling |g''| on a
 *        101-point log grid over I confirms it is monotone decreasing, so max_I |g''| is exactly
 *        the endpoint value; B / max_I |g''| = 1.000 -- the closed-form bound is the sharp
 *        supremum, not an over-estimate. (A conservative rounded ceiling 1.49e-10 is also given.)
 *
 * The punchline: |g''(N)| <= 4 pi^2 K (u_L + 1)/(T_L^2 u_L^3) ~ 1.4802e-10 on I = [1e9, 1e10],
 * derived in closed form by the chain rule through T0(N) and confirmed sharp against a numerical
 * g'' sample -- the exact analytic ingredient the imp-34693a seed-band enclosure was missing.
 *
 * DERIVATION / MEASUREMENT ONLY. This bounds the curvature of the INHERITED imp-3220/imp-3406
 * surrogate crossover map; it adds NO RH bound and asserts no operator positivity. The C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED;
 * changes no bound; NO QED. No refereed bound is changed.
 *
 * @see imp-33723-sigma-half-vs-crossover-closed-form (fixed point N = K log T0(N), g_prime form)
 * @see imp-34693-crossover-contraction-seed-band (sub-gap imp-34693a: bound g'' on the band)
 * @see imp-34727-crossover-seed-band-second-order-enclosure (ALREADY derived the identical closed
 *      form + M ~ 1.480193e-10 inside its enclosure; this module isolates it and re-derives it)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const FOUR_PI2 = 4 * Math.PI * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (imp-33723 amplitude)

const I_LO = 1e9;
const I_HI = 1e10;

// The inherited crossover map g(N) = K log T0(N) (imp-33723).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));

// CLOSED FORM: g_double_prime(N) = -4 pi^2 K (u+1) / (T^2 u^3), T = T0(N), u = log(T/2pi).
function gDoublePrimeClosed(N) {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return -(FOUR_PI2 * K_AMPL * (u + 1)) / (T * T * u * u * u);
}

// Numerical g'' via second-order central difference (independent cross-check of the closed form).
function gDoublePrimeFD(N) {
  const h = N * 1e-4;
  return (g(N + h) - 2 * g(N) + g(N - h)) / (h * h);
}

// (D1) closed-form vs central-difference agreement at five probes across I.
const PROBES = [1e9, 2e9, 3.28e9, 5e9, 1e10];
const PROBE_ROWS = PROBES.map((N) => {
  const c = gDoublePrimeClosed(N);
  const f = gDoublePrimeFD(N);
  return { N, closed: c, fd: f, relErr: Math.abs(c - f) / Math.abs(c) };
});
const MAX_PROBE_REL_ERR = Math.max(...PROBE_ROWS.map((r) => r.relErr));

// The closed-form endpoint bound (monotone => supremum at N = I_LO).
const T_L = effectiveHeightForN(I_LO);
const U_L = Math.log(T_L / TWO_PI);
const B_BOUND = (FOUR_PI2 * K_AMPL * (U_L + 1)) / (T_L * T_L * U_L * U_L * U_L); // ~1.4802e-10

// (D2) sample |g''| on a 101-point log grid to confirm monotonicity and measure tightness.
let MAX_ABS_ON_GRID = 0;
let WORST_N = I_LO;
let MONOTONE_DECREASING = true;
let prev = Infinity;
for (let k = 0; k <= 100; k++) {
  const N = I_LO * Math.pow(I_HI / I_LO, k / 100);
  const a = Math.abs(gDoublePrimeClosed(N));
  if (a > MAX_ABS_ON_GRID) {
    MAX_ABS_ON_GRID = a;
    WORST_N = N;
  }
  if (a > prev * (1 + 1e-12)) MONOTONE_DECREASING = false;
  prev = a;
}
const BOUND_TIGHTNESS = B_BOUND / MAX_ABS_ON_GRID; // ~1.000 (endpoint IS the max)
// A conservative hand-roundable ceiling (>= B, same order of magnitude).
const B_CONSERVATIVE = 1.49e-10;

export const IMP34731_CROSSOVER_MAP_SECOND_DERIVATIVE_BOUND = {
  id: 'imp-34731',
  proofSection: 'S-frontier',
  question:
    'Derive a closed-form upper bound on |g_double_prime(N)| over I = [1e9, 1e10] for the ' +
    'inherited imp-3220/imp-3406 surrogate crossover map g(N) = (C_C/E_trunc)^2 log T0(N) ' +
    '(via the chain rule through T0(N)), and measure it against a numerical g_double_prime ' +
    'sample. Provides the g_double_prime ceiling the imp-34693a/imp-34727 seed-band enclosure ' +
    'requires. Derivation/measurement only; adds no RH bound; no QED.',
  closedFormFirstDerivative: 'g_prime(N) = 2 pi K / (T u),  T = T0(N), u = log(T/2pi)',
  closedFormSecondDerivative:
    'g_double_prime(N) = -4 pi^2 K (u + 1) / (T^2 u^3),  T = T0(N), u = log(T/2pi), K = (C_C/E_trunc)^2',
  monotonicityArgument:
    'On I both T0(N) and u = log(T0/2pi) increase in N; the denominator T^2 u^3 outgrows the ' +
    '(u+1) numerator, so |g_double_prime| is strictly decreasing and its supremum on I is the ' +
    'value at the left endpoint N = 1e9.',
  bound: {
    K_amplitude: +K_AMPL.toExponential(6), // (C_C/E_trunc)^2 ~ 1.572709e8
    T0_at_1e9: +T_L.toExponential(6), // ~3.718700e8
    u_at_1e9: +U_L.toExponential(6), // ~1.789620e1
    sup_bound_B: +B_BOUND.toExponential(6), // ~1.480193e-10 (sharp endpoint supremum)
    conservative_ceiling: B_CONSERVATIVE, // 1.49e-10 (hand-roundable over-estimate)
    max_abs_on_grid: +MAX_ABS_ON_GRID.toExponential(6),
    argmax_N: +WORST_N.toExponential(3), // 1.000e9 (left endpoint)
    bound_tightness_B_over_max: +BOUND_TIGHTNESS.toFixed(6), // ~1.000000
    monotone_decreasing: MONOTONE_DECREASING,
  },
  probes: PROBE_ROWS.map((r) => ({
    N: +r.N.toExponential(3),
    closed: +r.closed.toExponential(6),
    fd: +r.fd.toExponential(6),
    rel_err: +r.relErr.toExponential(3),
  })),
  maxProbeRelErr: +MAX_PROBE_REL_ERR.toExponential(3), // ~4e-7
  finding: {
    D1_closed_form_matches_sample:
      'At N in {1e9, 2e9, 3.28e9, 5e9, 1e10} the closed form -4 pi^2 K (u+1)/(T^2 u^3) agrees ' +
      'with a second-order central difference of g to < 1e-6 relative (max ~4e-7), confirming ' +
      'the chain-rule derivation through T0(N).',
    D2_bound_valid_and_tight:
      '|g_double_prime| is monotone decreasing on I (101-point log grid), so max_I |g_double_prime| ' +
      'is the endpoint value; B / max_I |g_double_prime| = 1.000 -- the closed-form bound ' +
      'B ~ 1.4802e-10 is the sharp supremum, not loose by orders of magnitude. A conservative ' +
      'ceiling 1.49e-10 covers it with a margin under 1%.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction). The inherited imp-33723 crossover map g(N) = K log T0(N), ' +
    'K = (C_C/E_trunc)^2, has closed-form second derivative g_double_prime(N) = ' +
    '-4 pi^2 K (u+1)/(T^2 u^3) with T = T0(N), u = log(T/2pi), obtained by the chain rule through ' +
    'the Riemann-von Mangoldt inverse. Both T0 and u increase on I = [1e9, 1e10], so |g_double_prime| ' +
    'is monotone decreasing and bounded above by its left-endpoint value B = ' +
    '4 pi^2 K (u_L+1)/(T_L^2 u_L^3) ~ 1.4802e-10. The closed form matches a central-difference sample ' +
    'to < 1e-6 relative at five probes, and B / max_I |g_double_prime| = 1.000, so the bound is the ' +
    'sharp supremum -- a clean standalone statement of the g_double_prime ceiling imp-34727 already ' +
    'derived inside its enclosure, here isolated and independently reproduced. Derivation/measurement ' +
    'only on the INHERITED surrogate map; the C_mb ' +
    'GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-33723 (fixed point N = K log T0(N), g_prime = 2 pi K/(T u)); imp-34693a (sub-gap: bound ' +
    'g_double_prime on the band); imp-34727 (ALREADY derived the identical closed form + ' +
    'M ~ 1.480193e-10 inside its second-order enclosure; this module isolates and reproduces it); ' +
    'lambda-rh-height-mapping (effectiveHeightForN, Riemann-von Mangoldt inverse); imp-2631 (E_trunc ' +
    'fixed-strip route); imp-2642/imp-2643 (C_C 1/8 ansatz).',
};

export const IMP34731_CROSSOVER_MAP_SECOND_DERIVATIVE_BOUND_ASSERTIONS = [
  {
    // (D1): the closed-form g'' matches a second-order central difference at all probes.
    id: 'imp34731-closed-form-matches-central-difference',
    description: 'closed-form g_double_prime agrees with central-difference sample to < 1e-5 relative',
    holds: () => MAX_PROBE_REL_ERR < 1e-5,
  },
  {
    // The closed-form magnitude is the sharp endpoint supremum (monotone decreasing on I).
    id: 'imp34731-bound-is-sharp-endpoint-supremum',
    description: '|g_double_prime| monotone decreasing on I; B/max = 1.000; argmax at left endpoint',
    holds: () =>
      MONOTONE_DECREASING &&
      Math.abs(BOUND_TIGHTNESS - 1) < 1e-9 &&
      Math.abs(WORST_N - I_LO) / I_LO < 1e-6,
  },
  {
    // The bound sits at the expected magnitude and the conservative ceiling dominates it.
    id: 'imp34731-bound-magnitude-and-conservative-ceiling',
    description: 'B ~ 1.4802e-10 and the conservative ceiling 1.49e-10 covers it (B < ceiling)',
    holds: () =>
      Math.abs(B_BOUND / 1.480193e-10 - 1) < 1e-3 &&
      B_BOUND < B_CONSERVATIVE &&
      B_CONSERVATIVE < 1.1 * B_BOUND,
  },
  {
    // Honesty gate: derivation/measurement only, no QED, no refereed bound is changed.
    id: 'imp34731-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34731_CROSSOVER_MAP_SECOND_DERIVATIVE_BOUND.isRigorous === false &&
      /NO QED/.test(IMP34731_CROSSOVER_MAP_SECOND_DERIVATIVE_BOUND.verdict) &&
      /refereed bound is changed/i.test(IMP34731_CROSSOVER_MAP_SECOND_DERIVATIVE_BOUND.verdict),
  },
];

for (const a of IMP34731_CROSSOVER_MAP_SECOND_DERIVATIVE_BOUND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34731-crossover-map-second-derivative-bound assertion failed: ${a.id}`);
  }
}
