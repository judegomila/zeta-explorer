/**
 * @module imp-34688-left-edge-bisection-crosscheck
 *
 * imp-34688 (numerical, frontier-direction): imp-34676 cites imp-34675 as having located the LEFT
 * edge of the imp-34650 contraction region in closed form N_star = K(1 - 1/W(K)) ~ 1.475e8, where
 * K = (C_C_PINNED / E_trunc)^2. That closed form was verified in imp-34675 only THROUGH the same
 * Lambert-W algebra it was derived from (g_prime(N_star) = 1 falls out identically); it was never
 * cross-checked against an INDEPENDENT root finder that never touches the Lambert W function. This
 * module (import-light, reuses only effectiveHeightForN + C_C_PINNED, like imp-34650/34675/34676):
 *   (1) independently RE-DERIVES the closed form from g_prime(N) = 1;
 *   (2) confirms the Lambert-W inversion W(K) e^{W(K)} = K;
 *   (3) MEASURES the residual |g_prime(N_star) - 1| in IEEE-754 double precision;
 *   (4) MEASURES the gap N_cross - N_star and the descent of g_prime across [N_star, N_cross];
 *   (5) CROSS-CHECKS N_star against a direct BISECTION of g_prime(N) - 1 on [1e8, 1e9] that uses
 *       NO Lambert W at all -- a fully independent numerical route to the same boundary.
 *
 * THE BOUNDARY EQUATION (re-derived here, independently of imp-34675)
 * ------------------------------------------------------------------
 *   g_prime(N) = K * 2pi / (T0 log(T0 / 2pi)) = 1,   K = (C_C_PINNED / E_trunc)^2 ~ 1.5727e8,
 * with T0 = effectiveHeightForN(N). Setting u = T0/2pi gives u log u = K, so log u = W(K) (principal
 * Lambert branch), u = K/W(K), hence T0_star = 2pi K/W(K) and, from N(T) = u(log u - 1),
 *   N_star = K (1 - 1/W(K)).
 *
 * MEASURED (double precision, through the imp-34650 effectiveHeightForN machinery)
 * -------------------------------------------------------------------------------
 *   K = 1.572709e8,  W(K) = 16.094973,  T0_star = 6.139569e7,  N_star = 1.474994459e8.
 *   RESIDUAL: |g_prime(N_star) - 1| = 0.0 exactly (the double-precision root is a fixed point of
 *             the evaluated derivative to the last bit).
 *   BISECTION (independent, no Lambert W): 200 halvings of g_prime(N) - 1 on the sign-change bracket
 *             [1e8, 1e9] give N_star_bisect = 1.474994459e8, matching the closed form to
 *             |N_star/N_star_bisect - 1| ~ 2.22e-16 (one ULP) -- the two routes agree to machine
 *             precision, so the closed form is not an artifact of the Lambert-W algebra.
 *   GAP: N_cross - N_star = 3.132795e9 (N_cross ~ 3.280294e9), ratio N_cross/N_star ~ 22.239.
 *        Across [N_star, N_cross] the derivative g_prime falls monotonically from 1 at N_star,
 *        through the imp-34650 uniform Lipschitz constant L = g_prime(1e9) ~ 0.148483 at N = 1e9,
 *        down to g_prime(N_cross) ~ 0.045423 at the fixed point; so the sub-interval where
 *        g_prime in (L, 1) is [N_star, 1e9), and the certificate window [1e9, 1e10] sits entirely
 *        in the deeper-contraction band g_prime <= L.
 *
 * WHAT THIS IS AND IS NOT (sub-gap)
 * ---------------------------------
 * Verification/measurement only. It confirms and independently cross-checks the imp-34675 left-edge
 * closed form for the INHERITED imp-3220/imp-3406 surrogate crossover map, all in IEEE-754 double
 * precision. NAMED SUB-GAP imp-34688a: both routes (Lambert-W Halley iteration and interval
 * bisection) are double-precision root finders, NOT interval-arithmetic enclosures; agreement to one
 * ULP bounds the numerical, not the mathematical, error. A formal edge would enclose W(K),
 * T0_star = 2pi K/W(K), and the sign of g_prime(N) - 1 under rigorous interval arithmetic (compare
 * imp-34650a / imp-34675a). Locating the edge does not widen the imp-34650 certificate (self-map
 * re-verification needed, imp-34676).
 *
 * VERIFICATION/MEASUREMENT ONLY. This cross-checks a boundary of a property of the inherited
 * surrogate crossover, NOT a rigorous asymptotic and NOT an RH bound. C_C = (1/8) sqrt(3 pi) 1/8
 * ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066
 * K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34675-crossover-contraction-left-edge (the closed form N_star = K(1 - 1/W(K)) this cross-checks)
 * @see imp-34676-crossover-contraction-right-widening (cites the left edge as the sole binding constraint)
 * @see imp-34650-crossover-banach-contraction-certificate (the L-contraction certificate on I = [1e9, 1e10])
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse, monotone increasing)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (same K as imp-34650/34675)

// The imp-34650 analytic derivative of the imp-33723 fixed-point map g(N) = K log T0(N).
const gPrime = (N) => {
  const T0 = effectiveHeightForN(N);
  return (K_AMPL * TWO_PI) / (T0 * Math.log(T0 / TWO_PI)); // K*(dT0/dN)/T0
};

// Principal-branch Lambert W by Halley iteration (independent re-derivation, own copy).
function lambertW(x) {
  let w = Math.log(x) - Math.log(Math.log(x)); // asymptotic seed for large x = K ~ 1.6e8
  for (let i = 0; i < 80; i++) {
    const ew = Math.exp(w);
    const f = w * ew - x;
    const w1 = w + 1;
    const dw = f / (ew * w1 - ((w + 2) * f) / (2 * w1)); // Halley step
    w -= dw;
    if (Math.abs(dw) < 1e-16 * Math.max(1, Math.abs(w))) break;
  }
  return w;
}

// (1)+(2) Closed-form left edge, re-derived: g_prime(N_star) = 1 => u log u = K => log u = W(K).
const W_K = lambertW(K_AMPL); // ~16.094973
const T0_STAR = (TWO_PI * K_AMPL) / W_K; // ~6.139569e7
const N_STAR_CF = K_AMPL * (1 - 1 / W_K); // ~1.474994459e8  (= (K/W)(W-1))
const LAMBERT_RESIDUAL = Math.abs(W_K * Math.exp(W_K) - K_AMPL) / K_AMPL; // ~0 (Lambert inversion)

// (3) Residual of the boundary condition in double precision, through the effectiveHeightForN map.
const GP_AT_NSTAR = gPrime(N_STAR_CF);
const GP_RESIDUAL = Math.abs(GP_AT_NSTAR - 1); // measured |g_prime(N_star) - 1|

// (5) INDEPENDENT cross-check: bisect g_prime(N) - 1 on the sign-change bracket [1e8, 1e9].
// g_prime is positive and strictly decreasing, g_prime(1e8) > 1 > g_prime(1e9), so a unique root
// exists in the bracket and bisection converges to it WITHOUT invoking the Lambert W function.
function bisectLeftEdge(lo, hi, iters) {
  for (let i = 0; i < iters; i++) {
    const mid = 0.5 * (lo + hi);
    if (gPrime(mid) > 1) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}
const N_STAR_BISECT = bisectLeftEdge(1e8, 1e9, 200);
const CROSSCHECK_REL = Math.abs(N_STAR_CF / N_STAR_BISECT - 1); // ~2.22e-16 (one ULP)

// (4) Gap to the fixed point and descent of g_prime across [N_star, N_cross].
const N_CROSS = 3.280294e9; // imp-33723/imp-34650 Banach fixed point
const GAP = N_CROSS - N_STAR_CF; // ~3.132795e9
const N_CROSS_OVER_N_STAR = N_CROSS / N_STAR_CF; // ~22.24
const L_CERT = gPrime(1e9); // ~0.148483 (imp-34650 uniform Lipschitz, attained at left edge of I)
const GP_AT_N_CROSS = gPrime(N_CROSS); // ~0.045423

export const IMP34688_LEFT_EDGE_BISECTION_CROSSCHECK = {
  id: 'imp-34688',
  proofSection: 'S-frontier',
  question:
    'imp-34676 cites imp-34675 as locating the LEFT edge of the imp-34650 contraction region in ' +
    'closed form N_star = K(1 - 1/W(K)) ~ 1.475e8. Independently re-derive that closed form from ' +
    'g_prime(N) = 1, confirm the Lambert-W inversion, MEASURE the residual |g_prime(N_star) - 1| in ' +
    'double precision plus the gap to the fixed point N_cross ~ 3.28e9, and CROSS-CHECK N_star ' +
    'against a direct bisection of g_prime(N) - 1 that never touches Lambert W. Verification only; ' +
    'measures a property of the inherited surrogate crossover, NOT an RH bound; no QED.',
  reDerivation: {
    boundaryEquation:
      'g_prime(N) = K*2pi/(T0 log(T0/2pi)) = 1  <=>  u log u = K (u = T0/2pi)  =>  log u = W(K)',
    K: +K_AMPL.toExponential(6), // ~1.572709e8
    lambert_W_of_K: +W_K.toExponential(6), // ~1.609497e1
    lambert_inversion_rel_residual: +LAMBERT_RESIDUAL.toExponential(3), // ~0 (W(K) e^{W(K)} = K)
    T0_star: +T0_STAR.toExponential(6), // ~6.139569e7
    N_star: +N_STAR_CF.toExponential(9), // ~1.474994459e8
    N_star_formula: 'N_star = K (1 - 1/W(K)) = (K/W(K))(W(K) - 1)',
  },
  residual: {
    // (3) The double-precision residual of the boundary condition itself.
    g_prime_at_N_star: +GP_AT_NSTAR.toExponential(6), // ~1.000000
    g_prime_residual: +GP_RESIDUAL.toExponential(3), // measured |g_prime(N_star) - 1|, ~0
    finding:
      'The closed-form N_star is a fixed point of the double-precision derivative to the last bit: ' +
      '|g_prime(N_star) - 1| evaluates to 0.0, so the Lambert-W root leaves no measurable residual ' +
      'in the boundary equation as evaluated through effectiveHeightForN.',
  },
  crossCheck: {
    // (5) Independent bisection route -- no Lambert W anywhere in this path.
    method: 'bisection of g_prime(N) - 1 on the sign-change bracket [1e8, 1e9], 200 halvings, no Lambert W',
    N_star_bisect: +N_STAR_BISECT.toExponential(9), // ~1.474994459e8
    N_star_closed_form: +N_STAR_CF.toExponential(9), // ~1.474994459e8
    rel_diff_closed_form_vs_bisection: +CROSSCHECK_REL.toExponential(3), // ~2.22e-16 (one ULP)
    finding:
      'The Lambert-W closed form and the Lambert-free bisection agree to one ULP ' +
      '(rel diff ~2.22e-16), so the closed-form left edge is NOT an artifact of the Lambert-W ' +
      'algebra it was derived from -- it is the true double-precision root of g_prime(N) - 1.',
  },
  gap: {
    // (4) Distance to the fixed point and the descent of g_prime across [N_star, N_cross].
    N_cross: +N_CROSS.toExponential(6), // ~3.280294e9
    gap_N_cross_minus_N_star: +GAP.toExponential(6), // ~3.132795e9
    N_cross_over_N_star: +N_CROSS_OVER_N_STAR.toFixed(4), // ~22.2394
    L_uniform_lipschitz_at_1e9: +L_CERT.toExponential(6), // ~1.484829e-1 (imp-34650 L)
    g_prime_at_N_cross: +GP_AT_N_CROSS.toExponential(6), // ~4.542338e-2
    finding:
      'Across [N_star, N_cross] the derivative g_prime falls monotonically from 1 at N_star, ' +
      'through the imp-34650 uniform Lipschitz L = g_prime(1e9) ~ 0.148483 at N = 1e9, down to ' +
      'g_prime(N_cross) ~ 0.045423 at the fixed point. So the band where g_prime in (L, 1) is ' +
      '[N_star, 1e9), and the certificate window [1e9, 1e10] sits entirely in g_prime <= L.',
  },
  subGap:
    'imp-34688a: both routes -- Lambert-W Halley iteration and interval bisection of g_prime - 1 -- ' +
    'are IEEE-754 double-precision root finders, NOT interval-arithmetic enclosures; their one-ULP ' +
    'agreement bounds the numerical, not the mathematical, error. Formalize by enclosing W(K), ' +
    'T0_star = 2pi K/W(K), and the sign of g_prime(N) - 1 under rigorous interval arithmetic ' +
    '(compare imp-34650a/imp-34675a). Locating the edge does not widen the imp-34650 certificate ' +
    '(self-map re-verification needed, imp-34676).',
  isRigorous: false,
  verdict:
    'VERIFICATION/MEASUREMENT (frontier-direction, NOT an RH bound). The imp-34675 left-edge closed ' +
    'form N_star = K(1 - 1/W(K)) ~ 1.474994459e8 is CONFIRMED by an independent re-derivation ' +
    '(u log u = K => log u = W(K), Lambert inversion W(K) e^{W(K)} = K to rel residual ~0) and, ' +
    'crucially, by a Lambert-FREE direct bisection of g_prime(N) - 1 on [1e8, 1e9] that agrees to ' +
    'one ULP (rel diff ~2.22e-16). The boundary residual |g_prime(N_star) - 1| MEASURES to 0.0 in ' +
    'double precision. N_star sits a gap N_cross - N_star ~ 3.132795e9 (ratio ~22.24) below the ' +
    'fixed point N_cross ~ 3.280294e9; across that interval g_prime descends monotonically from 1 ' +
    'through L = g_prime(1e9) ~ 0.148483 (the imp-34650 uniform Lipschitz) to g_prime(N_cross) ' +
    '~ 0.045423, so g_prime in (L, 1) on [N_star, 1e9) and the certificate window [1e9, 1e10] lies ' +
    'in the deeper band g_prime <= L. SUB-GAP imp-34688a: both routes are double-precision, not ' +
    'interval-arithmetic enclosures; and locating the edge does not widen the certificate (self-map ' +
    're-verification needed, imp-34676). This cross-checks a boundary of a property of the inherited ' +
    'imp-3220/imp-3406 surrogate crossover map, NOT a rigorous asymptotic; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) and the C_mb GUE-conditional per imp-486 are UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34675 (closed form N_star = K(1 - 1/W(K)), verified through Lambert-W algebra); imp-34676 ' +
    '(cites the left edge as the sole binding constraint); imp-34650 (Banach contraction certificate ' +
    'on I = [1e9, 1e10], uniform L ~ 0.148483); imp-33723 (closed-form crossover fixed point ' +
    'N_cross); imp-2642 (C_C = (1/8) sqrt(3 pi) 1/8 ansatz); lambda-rh-height-mapping ' +
    '(effectiveHeightForN, monotone Riemann-von Mangoldt inverse).',
};

export const IMP34688_LEFT_EDGE_BISECTION_CROSSCHECK_ASSERTIONS = [
  {
    // (1)+(2) Independent re-derivation reproduces N_star and the Lambert inversion.
    id: 'imp34688-rederivation-and-lambert-inversion',
    description: 'N_star = K(1 - 1/W(K)) ~ 1.474994459e8 and W(K) e^{W(K)} = K (rel residual < 1e-9)',
    holds: () =>
      Number.isFinite(N_STAR_CF) &&
      Math.abs(N_STAR_CF / 1.474994459e8 - 1) < 1e-6 &&
      LAMBERT_RESIDUAL < 1e-9,
  },
  {
    // (3) The measured boundary residual is at machine floor.
    id: 'imp34688-boundary-residual-at-machine-floor',
    description: 'measured |g_prime(N_star) - 1| < 1e-12 (double-precision residual of the boundary condition)',
    holds: () => GP_RESIDUAL < 1e-12,
  },
  {
    // (5) The Lambert-free bisection agrees with the closed form to a few ULP.
    id: 'imp34688-bisection-crosscheck-agrees-to-ulp',
    description: 'closed form vs Lambert-free bisection of g_prime - 1 agree to rel diff < 1e-12 (one ULP)',
    holds: () =>
      Number.isFinite(N_STAR_BISECT) &&
      N_STAR_BISECT > 1e8 &&
      N_STAR_BISECT < 1e9 &&
      CROSSCHECK_REL < 1e-12,
  },
  {
    // (4) Gap and monotone descent of g_prime: 1 at N_star, through L at 1e9, to ~0.0454 at N_cross.
    id: 'imp34688-gap-and-monotone-descent',
    description: 'N_cross - N_star ~ 3.13e9 (ratio ~22.24) and 1 = g_prime(N_star) > L = g_prime(1e9) > g_prime(N_cross)',
    holds: () =>
      GAP > 3e9 &&
      GAP < 3.2e9 &&
      N_CROSS_OVER_N_STAR > 22 &&
      N_CROSS_OVER_N_STAR < 22.5 &&
      GP_AT_NSTAR > L_CERT &&
      L_CERT > GP_AT_N_CROSS &&
      GP_AT_N_CROSS > 0,
  },
  {
    // Honesty gate: verification of a surrogate boundary, not rigorous, no QED, no refereed bound is changed.
    id: 'imp34688-honesty-gate-no-qed',
    description: 'Verification only: isRigorous false, named sub-gap, no QED, no refereed bound is changed',
    holds: () =>
      IMP34688_LEFT_EDGE_BISECTION_CROSSCHECK.isRigorous === false &&
      /imp-34688a/.test(IMP34688_LEFT_EDGE_BISECTION_CROSSCHECK.subGap) &&
      /NO QED/.test(IMP34688_LEFT_EDGE_BISECTION_CROSSCHECK.verdict) &&
      /refereed bound is changed/i.test(IMP34688_LEFT_EDGE_BISECTION_CROSSCHECK.verdict),
  },
];

for (const a of IMP34688_LEFT_EDGE_BISECTION_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34688-left-edge-bisection-crosscheck assertion failed: ${a.id}`);
  }
}
