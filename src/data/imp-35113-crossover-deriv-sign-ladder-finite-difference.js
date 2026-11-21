/**
 * @module imp-35113-crossover-deriv-sign-ladder-finite-difference
 *
 * imp-35113 (numerical, S-frontier): DIRECT from-source numerical cross-check of the imp-35012
 * alternating derivative-sign ladder sign(g^(n)) = (-1)^(n+1) on the post-peak ramp, by
 * Richardson-extrapolated central finite differences of the INHERITED surrogate crossover map
 * g(N) = K log T0(N) (imp-3220 / imp-3406 / imp-33723; K = (C_C/E_trunc)^2, T0 = effectiveHeightForN).
 * imp-35012 / imp-34957 / imp-34880 derived the sign ladder ANALYTICALLY from the all-positive
 * numerator polynomials P_n; it had never been cross-checked by direct numerical differentiation.
 * This module supplies that empirical check and, crucially, QUANTIFIES the largest derivative order
 * at which double-precision differencing still resolves the sign before round-off swamps it.
 * MEASUREMENT ONLY on the surrogate map; establishes no operator positivity; changes no bound; NO QED.
 *
 * THE ANALYTIC TARGET (what we are cross-checking)
 * -----------------------------------------------------------------------------------------
 * On the ramp u = log(T0/2pi) > 0 the inherited surrogate has (imp-34957)
 *     g^(n)(N) = (-1)^(n+1) 2^n pi^n K P_n(u) / (T0^n u^(2n-1)),  K>0, u>0, P_n(u)>0,
 * so the SIGN of g^(n) is exactly (-1)^(n+1): g_prime>0, g_pp<0, g_ppp>0, g_pppp<0, ...
 * (the Bernstein-function signature -- g_prime completely monotone). Because each successive
 * derivative carries an extra factor ~ (dT0/dN)/T0 = 2pi/(T0 u) ~ 5e-10 at the crossover, the
 * derivative MAGNITUDES collapse geometrically: at N_cross ~ 3.28e9, |g^(1)| ~ 4.5e-2,
 * |g^(2)| ~ 1.4e-11, |g^(3)| ~ 8.4e-21, |g^(4)| ~ 7.7e-30, ... . This geometric collapse is what
 * limits the numerical differentiation: an n-th central difference has a round-off noise floor
 * ~ eps |g| (Sum|c_j|) / h^n, and once |g^(n)| sinks below it the recovered sign is pure noise.
 *
 * THE METHOD (from source, no baked derivative literals)
 * -----------------------------------------------------------------------------------------
 * g is recomputed from source at every evaluation (K log effectiveHeightForN(N)). For each order
 * n = 1..8 the n-th derivative is a 2nd-order central-difference stencil combined at steps h and
 * h/2 by Richardson extrapolation (4th-order accurate). At each of five ramp points and across a
 * geometric bracket of relative step sizes relh in {3e-4 .. 3e-2} the recovered sign is compared to
 * the analytic (-1)^(n+1). A sign is called ROBUSTLY RESOLVED at an order iff it matches the analytic
 * sign at EVERY ramp point and EVERY step in the bracket (no step-dependent flips).
 *
 * THE FINDING (measurement only)
 * -----------------------------------------------------------------------------------------
 *   (M1) SIGN LADDER CONFIRMED THROUGH n=4. For n = 1,2,3,4 the Richardson-extrapolated finite
 *        difference reproduces the analytic sign (+,-,+,-) at all five ramp points and across the
 *        whole step bracket, with derivative magnitudes matching the analytic geometric collapse
 *        (each order ~5e-10x the previous). The empirical (+,-,+,-) directly corroborates the
 *        imp-35012 Bernstein-signature claim g_prime>0, g_pp<0, g_ppp>0, g_pppp<0.
 *   (M2) ROUND-OFF SWAMPS THE SIGN FROM n=5. At n>=5 the true |g^(n)| (<~4e-39 at N_cross) falls
 *        at or below the double-precision noise floor eps|g|/h^n, and the recovered sign becomes
 *        STEP-DEPENDENT: it flips across the step bracket (e.g. at N_cross, n=5 reads + at relh~1e-2
 *        but - at relh~1e-3). So double precision does NOT robustly resolve the sign for n>=5; the
 *        largest robustly-resolved order is n* = 4. (n=5 is marginally recoverable only in a narrow
 *        large-step window; n>=6 is round-off dominated everywhere.)
 *   (M3) THE CEILING IS A ROUND-OFF, NOT A SIGN-LADDER, LIMIT. The analytic ladder (imp-35012 /
 *        imp-34880) holds for ALL n by the elementary coefficient-positivity induction; the n*=4
 *        ceiling is purely an artifact of double-precision differencing of a map whose derivatives
 *        collapse ~5e-10 per order, not evidence of any sign change. The exact all-orders result
 *        stands; this is only the reach of direct numerical differentiation.
 *
 * PROOF SCOPE / HONESTY. MEASUREMENT ONLY on the INHERITED imp-3220 / imp-3406 / imp-33723 SURROGATE
 * crossover map g. Establishes NO operator positivity and NO spectral consequence; the sign ladder is
 * a structural property of the SURROGATE map, NOT of the RH operator. The C_mb GUE-conditional per
 * imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), and imp-3066 K_a >= 0 are UNTOUCHED. Changes NO
 * bound; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35012-crossover-complete-monotonicity-bernstein-assessment (analytic Bernstein sign ladder)
 * @see imp-34957-crossover-deriv-p11-p12-extension (all-positive P_n, sign (-1)^(n+1))
 * @see imp-34880-crossover-deriv-all-orders-sign-induction (all-orders coefficient positivity)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (surrogate g = K log T0, K = (C_C/E_trunc)^2)
 * @see imp-3463 (far-tail E_flow decay exponent 1/2)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33723)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8, the pinned surrogate amplitude

// The inherited surrogate crossover map g(N) = K log T0(N), recomputed FROM SOURCE each call.
function g(N) {
  return K_AMPL * Math.log(effectiveHeightForN(N));
}

// Analytic sign of g^(n): (-1)^(n+1)  (+ for odd n, - for even n).
function analyticSign(n) {
  return n % 2 === 1 ? 1 : -1;
}

// 2nd-order central-difference stencils for derivatives 1..8: f^(n) ~ (1/h^n) Sum c_j f(x + off_j h).
const STENCILS = {
  1: { off: [-1, 0, 1], c: [-1 / 2, 0, 1 / 2] },
  2: { off: [-1, 0, 1], c: [1, -2, 1] },
  3: { off: [-2, -1, 0, 1, 2], c: [-1 / 2, 1, 0, -1, 1 / 2] },
  4: { off: [-2, -1, 0, 1, 2], c: [1, -4, 6, -4, 1] },
  5: { off: [-3, -2, -1, 0, 1, 2, 3], c: [-1 / 2, 2, -5 / 2, 0, 5 / 2, -2, 1 / 2] },
  6: { off: [-3, -2, -1, 0, 1, 2, 3], c: [1, -6, 15, -20, 15, -6, 1] },
  7: { off: [-4, -3, -2, -1, 0, 1, 2, 3, 4], c: [-1 / 2, 3, -7, 7, 0, -7, 7, -3, 1 / 2] },
  8: { off: [-4, -3, -2, -1, 0, 1, 2, 3, 4], c: [1, -8, 28, -56, 70, -56, 28, -8, 1] },
};

function fdDeriv(N, n, h) {
  const s = STENCILS[n];
  let acc = 0;
  for (let j = 0; j < s.off.length; j++) acc += s.c[j] * g(N + s.off[j] * h);
  return acc / h ** n;
}

// Richardson extrapolation of two 2nd-order stencils (steps h, h/2) -> 4th-order estimate.
function richardsonDeriv(N, n, h) {
  const d1 = fdDeriv(N, n, h);
  const d2 = fdDeriv(N, n, h / 2);
  return (4 * d2 - d1) / 3;
}

// Five ramp points spanning the post-peak ramp (around and above the imp-33723 crossover N_cross).
const RAMP_NS = [1e9, 3.280294e9, 1e10, 1e11, 1e12];
// Geometric bracket of relative step sizes h = relh * N.
const REL_STEPS = [3e-4, 1e-3, 3e-3, 1e-2, 3e-2];

// For each order, is the recovered sign robustly resolved (matches analytic at EVERY ramp point and
// EVERY step in the bracket)? Record per-order the robust flag and a representative magnitude.
function orderRobustlyResolved(n) {
  for (const N of RAMP_NS) {
    for (const relh of REL_STEPS) {
      const d = richardsonDeriv(N, n, N * relh);
      if (!(Number.isFinite(d) && Math.sign(d) === analyticSign(n))) return false;
    }
  }
  return true;
}

// Representative derivative magnitudes at N_cross (largest step in bracket -> lowest round-off).
const N_CROSS = 3.280294e9;
const REL_STEP_REP = 3e-2;
const MAG_AT_CROSS = {};
for (let n = 1; n <= 8; n++) {
  MAG_AT_CROSS[n] = richardsonDeriv(N_CROSS, n, N_CROSS * REL_STEP_REP);
}

// Largest robustly-resolved order n* (contiguous from n=1).
let LARGEST_RESOLVED_N = 0;
for (let n = 1; n <= 8; n++) {
  if (orderRobustlyResolved(n)) LARGEST_RESOLVED_N = n;
  else break;
}

// Sign-flip witness at the first unresolved order (step-dependence => round-off, not a real flip).
const FIRST_UNRESOLVED_N = LARGEST_RESOLVED_N + 1;
let FIRST_UNRESOLVED_FLIPS = false;
if (FIRST_UNRESOLVED_N <= 8) {
  const signs = new Set();
  for (const relh of REL_STEPS) {
    signs.add(Math.sign(richardsonDeriv(N_CROSS, FIRST_UNRESOLVED_N, N_CROSS * relh)));
  }
  FIRST_UNRESOLVED_FLIPS = signs.size > 1; // sign changes across the step bracket => not resolved
}

// Per-order table across the ramp grid for the resolved orders (all match analytic).
const RESOLVED_TABLE = [];
for (let n = 1; n <= LARGEST_RESOLVED_N; n++) {
  const perPoint = RAMP_NS.map((N) => {
    const d = richardsonDeriv(N, n, N * REL_STEP_REP);
    return { N: +N.toExponential(3), deriv: +d.toExponential(4), signOk: Math.sign(d) === analyticSign(n) };
  });
  RESOLVED_TABLE.push({ n, analyticSign: analyticSign(n), points: perPoint });
}

export const IMP35113_CROSSOVER_DERIV_SIGN_LADDER_FINITE_DIFFERENCE = {
  id: 'imp-35113',
  proofSection: 'S-frontier',
  question:
    'Directly cross-check the imp-35012 alternating derivative-sign ladder sign(g^(n)) = (-1)^(n+1) ' +
    'on the post-peak ramp by from-source Richardson-extrapolated finite differences of the surrogate ' +
    'g = K log T0(N) for n = 1..8, and quantify the largest n at which double-precision differencing ' +
    'still resolves the sign. Measurement only; changes no bound; NO QED.',
  surrogate: 'g(N) = K log T0(N), K = (C_C/E_trunc)^2 ~ 1.5727e8, T0 = effectiveHeightForN(N)',
  method:
    '2nd-order central-difference stencils for d^n/dN^n (n=1..8) combined at steps h and h/2 by ' +
    'Richardson extrapolation (4th-order), at five ramp points N in {1e9 .. 1e12} and a geometric ' +
    'bracket of relative steps relh in {3e-4 .. 3e-2}. A sign is ROBUSTLY RESOLVED iff it matches the ' +
    'analytic (-1)^(n+1) at every ramp point AND every step (no step-dependent flip).',
  largestResolvedN: LARGEST_RESOLVED_N,
  firstUnresolvedN: FIRST_UNRESOLVED_N <= 8 ? FIRST_UNRESOLVED_N : null,
  firstUnresolvedSignFlips: FIRST_UNRESOLVED_FLIPS,
  representativeMagnitudesAtCross: {
    N: +N_CROSS.toExponential(3),
    relStep: REL_STEP_REP,
    g1: +MAG_AT_CROSS[1].toExponential(3),
    g2: +MAG_AT_CROSS[2].toExponential(3),
    g3: +MAG_AT_CROSS[3].toExponential(3),
    g4: +MAG_AT_CROSS[4].toExponential(3),
    g5: +MAG_AT_CROSS[5].toExponential(3),
    note:
      'magnitudes collapse ~5e-10 per order (extra factor 2pi/(T0 u) per derivative); by n=5 the true ' +
      'magnitude is at/below the double-precision noise floor eps|g|/h^n so the sign is round-off noise.',
  },
  resolvedTable: RESOLVED_TABLE,
  finding: {
    M1_sign_ladder_confirmed_through_n4:
      'Richardson-extrapolated finite differences reproduce the analytic sign (+,-,+,-) for n=1..' +
      LARGEST_RESOLVED_N +
      ' at all five ramp points and across the whole step bracket, with magnitudes matching the ' +
      'analytic geometric collapse -- a direct empirical corroboration of the imp-35012 Bernstein ' +
      'signature g_prime>0, g_pp<0, g_ppp>0, g_pppp<0.',
    M2_roundoff_swamps_sign_from_n5:
      'From n=' +
      FIRST_UNRESOLVED_N +
      ' the true |g^(n)| falls at/below the double-precision noise floor eps|g|/h^n and the recovered ' +
      'sign becomes STEP-DEPENDENT (flips across the step bracket at N_cross), so double precision does ' +
      'NOT robustly resolve the sign for n>=' +
      FIRST_UNRESOLVED_N +
      '. The largest robustly-resolved order is n* = ' +
      LARGEST_RESOLVED_N +
      ' (sign-flip witness at the first unresolved order = ' +
      FIRST_UNRESOLVED_FLIPS +
      ').',
    M3_ceiling_is_roundoff_not_ladder:
      'The n* = ' +
      LARGEST_RESOLVED_N +
      ' ceiling is a double-precision differencing artifact (derivatives collapse ~5e-10 per order), ' +
      'NOT a sign change: the analytic ladder holds for ALL n by the elementary imp-34880 coefficient- ' +
      'positivity induction. The exact all-orders result stands; only the reach of direct numerical ' +
      'differentiation is limited.',
  },
  isRigorous: false, // numerical cross-check of the surrogate map derivative signs; no QED
  rigorousScope:
    'MEASUREMENT ONLY on the INHERITED imp-3220 / imp-3406 / imp-33723 SURROGATE crossover map g. The ' +
    'finite-difference sign check corroborates the analytic imp-35012 sign ladder up to the round-off ' +
    'ceiling n* = ' +
    LARGEST_RESOLVED_N +
    '; it is a structural property of the SURROGATE map g, NOT of the RH operator. Establishes NO ' +
    'operator positivity, NO spectral consequence, changes NO bound.',
  changesBound: false,
  verdict:
    'MEASUREMENT (frontier-direction, surrogate-map numerical cross-check). From-source ' +
    'Richardson-extrapolated central finite differences of the inherited surrogate g = K log T0(N) ' +
    'directly reproduce the analytic imp-35012 derivative-sign ladder sign(g^(n)) = (-1)^(n+1) ' +
    '(g_prime>0, g_pp<0, g_ppp>0, g_pppp<0) at all five ramp points and across the whole step bracket ' +
    'through n* = ' +
    LARGEST_RESOLVED_N +
    '. From n=' +
    FIRST_UNRESOLVED_N +
    ' the derivative magnitudes -- which collapse ~5e-10 per order -- sink at/below the ' +
    'double-precision round-off floor eps|g|/h^n, and the recovered sign becomes step-dependent ' +
    '(flips across the step bracket), so double precision cannot robustly resolve the sign for n>=' +
    FIRST_UNRESOLVED_N +
    '. This is a round-off ceiling of direct differencing, NOT a sign change: the analytic ladder holds ' +
    'for ALL n by the elementary imp-34880 coefficient-positivity induction (imp-35107 re-verified it ' +
    'exactly to n=22). MEASUREMENT ONLY on the surrogate map: the C_mb GUE-conditional per imp-486, the ' +
    'C_C 1/8 ansatz (imp-2642/imp-2643), and imp-3066 K_a >= 0 are UNTOUCHED; establishes no operator ' +
    'positivity; changes no bound; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35012 (analytic Bernstein sign ladder); imp-34957 (all-positive P_n, sign (-1)^(n+1)); ' +
    'imp-34880 / imp-35107 (all-orders coefficient positivity, exact to n=22); imp-33723 (surrogate ' +
    'g = K log T0, K = (C_C/E_trunc)^2); imp-2642/imp-2643 (C_C 1/8 ansatz); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN Riemann-von Mangoldt inverse).',
};

export const IMP35113_CROSSOVER_DERIV_SIGN_LADDER_FINITE_DIFFERENCE_ASSERTIONS = [
  {
    // (M1): the analytic sign ladder is directly reproduced by finite differences through n*.
    id: 'imp35113-sign-ladder-confirmed-through-nstar',
    description:
      'Richardson finite differences reproduce sign(g^(n)) = (-1)^(n+1) at all ramp points and all ' +
      'bracket steps for n = 1..n* (n* >= 4), directly corroborating the imp-35012 Bernstein signature',
    holds: () =>
      LARGEST_RESOLVED_N >= 4 &&
      RESOLVED_TABLE.length === LARGEST_RESOLVED_N &&
      RESOLVED_TABLE.every((row) => row.points.every((p) => p.signOk)),
  },
  {
    // First four signs are exactly +, -, +, - (increasing, concave, then the Bernstein continuation).
    id: 'imp35113-first-four-signs-plus-minus-plus-minus',
    description:
      'g_prime>0, g_pp<0, g_ppp>0, g_pppp<0 at N_cross (the Bernstein-signature first four signs)',
    holds: () =>
      Math.sign(MAG_AT_CROSS[1]) === 1 &&
      Math.sign(MAG_AT_CROSS[2]) === -1 &&
      Math.sign(MAG_AT_CROSS[3]) === 1 &&
      Math.sign(MAG_AT_CROSS[4]) === -1,
  },
  {
    // Magnitudes collapse geometrically (~5e-10 per order) -- the cause of the round-off ceiling.
    id: 'imp35113-magnitudes-collapse-geometrically',
    description:
      'derivative magnitudes shrink by ~1e-8..1e-11 per order at N_cross (|g^(n+1)|/|g^(n)| << 1), ' +
      'driving successive orders below the double-precision noise floor',
    holds: () => {
      for (let n = 1; n <= 3; n++) {
        const ratio = Math.abs(MAG_AT_CROSS[n + 1]) / Math.abs(MAG_AT_CROSS[n]);
        if (!(ratio > 0 && ratio < 1e-6)) return false;
      }
      return true;
    },
  },
  {
    // (M2): double precision cannot robustly resolve the sign beyond n*; the first failure flips sign.
    id: 'imp35113-roundoff-ceiling-at-nstar',
    description:
      'the largest robustly-resolved order n* is finite (<= 6) and the first unresolved order has a ' +
      'step-dependent sign flip -- a round-off ceiling of double-precision differencing, not a real flip',
    holds: () =>
      LARGEST_RESOLVED_N >= 4 &&
      LARGEST_RESOLVED_N <= 6 &&
      FIRST_UNRESOLVED_N <= 8 &&
      FIRST_UNRESOLVED_FLIPS === true,
  },
  {
    // Honesty gate: measurement only on the surrogate map, no operator positivity, no bound change, no QED.
    id: 'imp35113-honesty-gate-no-qed',
    description:
      'measurement scope is the surrogate-map derivative signs only: establishes no operator ' +
      'positivity, changes no bound, no QED, no refereed bound is changed',
    holds: () =>
      IMP35113_CROSSOVER_DERIV_SIGN_LADDER_FINITE_DIFFERENCE.changesBound === false &&
      IMP35113_CROSSOVER_DERIV_SIGN_LADDER_FINITE_DIFFERENCE.isRigorous === false &&
      /NO QED/.test(IMP35113_CROSSOVER_DERIV_SIGN_LADDER_FINITE_DIFFERENCE.verdict) &&
      /no operator positivity/.test(IMP35113_CROSSOVER_DERIV_SIGN_LADDER_FINITE_DIFFERENCE.verdict) &&
      /refereed bound is changed/i.test(IMP35113_CROSSOVER_DERIV_SIGN_LADDER_FINITE_DIFFERENCE.verdict) &&
      /surrogate/i.test(IMP35113_CROSSOVER_DERIV_SIGN_LADDER_FINITE_DIFFERENCE.rigorousScope),
  },
];

for (const a of IMP35113_CROSSOVER_DERIV_SIGN_LADDER_FINITE_DIFFERENCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35113-crossover-deriv-sign-ladder-finite-difference assertion failed: ${a.id}`,
    );
  }
}
