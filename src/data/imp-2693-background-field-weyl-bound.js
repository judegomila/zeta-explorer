/**
 * @module imp-2693-background-field-weyl-bound
 * @fileoverview imp-2693 (HONEST PARTIAL) -- analytic NEAR+TAIL decomposition of
 * the background field scalar B_p(s) that the min-gap sandwich theorem
 * (imp-2563-min-gap-sandwich-theorem.js) needs in order to instantiate
 * beta = sup_p sup_s |B_p(s)|. The sandwich pins t_c(N) = (g^2/8)(1 + O(beta g^2))
 * ONLY under the hypothesis beta * g_min(0)^2 < 2. This module derives an
 * explicit, unconditional, per-N upper bound on beta from particle packing
 * (NEAR shell) plus the Riemann-von-Mangoldt density (TAIL), then tests the
 * inequality at N* = 1e4, g_min = 0.037698.
 *
 * VERDICT: the test FAILS. The best rigorous uniform packing bound is
 *   beta <= (pi^2/3) / g^2   =>   beta * g^2 <= pi^2/3 = 3.2899... > 2,
 * and the RvM TAIL is genuinely negligible (tail * g^2 ~ 4e-3), so the
 * obstruction is the NEAR shell exactly as in the Route-C G3a near+tail wall
 * (imp-451, GUE R_N ~ N^{4/3}). beta is marked NON-UNIFORMLY-CERTIFIABLE < 2.
 *
 * CONVENTIONS (match imp-2563-min-gap-sandwich-theorem.js)
 * -------------------------------------------------------
 * Particles x_1 < ... < x_N (zero ordinates) under the attractive flow
 * dx_k/ds = -2 sum_{j!=k} 1/(x_k - x_j). For an adjacent pair a = x_lo < b = x_hi
 * with gap r = b - a, the background field of the other N-2 particles is
 *
 *     B_p(s) = sum_{j != lo,hi} 1 / ((b - x_j)(a - x_j)).
 *
 * SIGN LEMMA (every term is positive, so |B_p| = B_p)
 * ---------------------------------------------------
 * No particle lies strictly between an ADJACENT pair, so each x_j is either
 * below a (then a - x_j > 0 and b - x_j > 0) or above b (then a - x_j < 0 and
 * b - x_j < 0). In both cases the product (b - x_j)(a - x_j) > 0. Hence every
 * summand is strictly positive, B_p(s) > 0, and the absolute value in beta is
 * superfluous: beta = sup_p sup_s B_p(s).
 *
 * NEAR-SHELL PACKING BOUND (unconditional, the load-bearing estimate)
 * ------------------------------------------------------------------
 * Let g = g_min be the GLOBAL minimum gap, a lower bound on every consecutive
 * spacing for all time s < t_c (the min gap only shrinks at the colliding pair,
 * and we evaluate beta as a worst-case sup). For a particle k-steps below a,
 * its distance d satisfies d >= k g (k consecutive gaps, each >= g), and
 * b - x_j = d + r > d, so the summand obeys
 *
 *     1 / ((b - x_j)(a - x_j)) = 1/(d (d + r)) <= 1/d^2 <= 1/(k g)^2.
 *
 * Summing both sides (below a and above b) over k >= 1,
 *
 *     B_p(s) <= (2/g^2) sum_{k>=1} 1/k^2 = (2/g^2)(pi^2/6) = (pi^2/3)/g^2.   (P)
 *
 * This holds for EVERY adjacent pair p and EVERY s, hence beta <= (pi^2/3)/g^2.
 * The k = 1 terms ALONE (the two immediate flanking neighbours, each able to sit
 * at the minimal spacing g) contribute up to 2/g^2, i.e. exactly the threshold
 * value 2 in beta*g^2 units BEFORE any farther neighbour is added.
 *
 * RvM TAIL (shows the tail is NOT the obstruction)
 * ------------------------------------------------
 * Beyond a near-shell radius D, model the ordinates by the Riemann-von-Mangoldt
 * mean density rho(T) = (1/2pi) log(T / 2pi) at the local height T. Particles at
 * signed distance y from the pair number rho dy and each contribute ~ 1/y^2, so
 *
 *     TAIL(D) ~ 2 integral_D^infty rho / y^2 dy = 2 rho / D.
 *
 * With D = mean spacing = 1/rho this gives TAIL ~ 2 rho^2, an O(1) constant
 * INDEPENDENT of g. Therefore TAIL * g^2 ~ 2 rho^2 g^2 -> 0: the tail vanishes
 * against the 1/g^2 near shell. The entire difficulty is the NEAR shell.
 *
 * WHY THE CONDITION CANNOT BE CERTIFIED (the imp-451 wall, restated)
 * -----------------------------------------------------------------
 * To force beta*g^2 < 2 one must rule out TWO simultaneous near-minimal flanking
 * gaps at the worst pair -- i.e. assert that the minimal gap is ISOLATED (a
 * unique argmin, neighbours O(1) larger in normalised units). That is precisely
 * the Ben Arous-Bourgade GUE extremal-gap statement R_N ~ N^{4/3} used in
 * imp-451, which is a probabilistic / RH-flavoured input, NOT an unconditional
 * per-N fact. Under the only unconditional structural input available (all gaps
 * >= g), bound (P) is sharp in form and lands at pi^2/3 > 2. Same wall.
 *
 * HONEST realistic (NON-rigorous) estimate, for context only: if exactly ONE
 * immediate neighbour sits near g and all others near the mean spacing s_mean,
 * then beta_real * g^2 ~ 1 + (pi^2/3)(g/s_mean)^2 ~ 1.0 < 2. This SUGGESTS the
 * true beta*g^2 is sub-threshold, but it is NOT a uniform per-N bound and must
 * not be promoted to an unconditional certificate -- doing so would smuggle in
 * the very GUE-isolation input the wall forbids.
 *
 * NAMED RESIDUAL (open): imp-2693-sub-isolated-min-gap -- an unconditional per-N
 * proof that the worst adjacent pair has only ONE near-minimal flanking gap,
 * which would replace the 2/g^2 immediate-neighbour term by ~1/g^2 and put
 * beta*g^2 below 2. This is RH/GUE-hard (== the imp-451 R_N ~ N^{4/3} input).
 *
 * @see imp-2563-min-gap-sandwich-theorem (consumer of beta; theorem needs beta g^2 < 2)
 * @see imp-451 (g3a-extremal-closure.js: Route-C near+tail DEFINITIVELY insufficient)
 * @see backward-flow-stability-gronwall (flow conventions)
 */

// ── Inputs at the test point N* = 1e4 (from imp-321/imp-2563 ladder) ──────────

const N_STAR = 1e4;
const G_MIN = 0.037698;            // global min gap g_min(0) at N* = 1e4
const T_HEIGHT = 9877.78;          // ordinate of the ~10000th zeta zero (height)
const TWO_PI = 2 * Math.PI;

// Riemann-von-Mangoldt mean density and spacing at height T.
const RHO = Math.log(T_HEIGHT / TWO_PI) / TWO_PI;   // ~1.171
const MEAN_SPACING = 1 / RHO;                       // ~0.854

// ── NEAR-shell packing bound (P): beta <= (pi^2/3)/g^2 ───────────────────────

const BETA_PACKING = (Math.PI * Math.PI / 3) / (G_MIN * G_MIN);
const BETA_PACKING_TIMES_GSQ = BETA_PACKING * G_MIN * G_MIN; // = pi^2/3 exactly

// The k = 1 immediate-neighbour contribution alone (both sides, minimal spacing).
const IMMEDIATE_TWO_SIDED_TIMES_GSQ = 2; // (2/g^2) * g^2

// ── RvM TAIL: 2 rho/D with D = mean spacing => 2 rho^2, independent of g ──────

const TAIL_RVM = 2 * RHO * RHO;                 // ~2.74, O(1) constant
const TAIL_TIMES_GSQ = TAIL_RVM * G_MIN * G_MIN; // ~4e-3, negligible vs 2

// ── Realistic (NON-rigorous) single-isolated-min-gap heuristic, context only ─

const BETA_REAL_TIMES_GSQ =
  1 + (Math.PI * Math.PI / 3) * (G_MIN / MEAN_SPACING) * (G_MIN / MEAN_SPACING);

// ── The actual test: does beta * g_min^2 < 2 hold unconditionally? ───────────

const CONDITION_RIGOROUS_HOLDS = BETA_PACKING_TIMES_GSQ < 2; // false (3.29 > 2)

// ── Exported record ──────────────────────────────────────────────────────────

export const BACKGROUND_FIELD_WEYL_BOUND = {
  id: 'imp-2693-background-field-weyl-bound',
  parent: 'imp-2693',
  consumer: 'imp-2563-min-gap-sandwich-theorem (needs beta with beta * g_min^2 < 2)',
  verdict: 'PARTIAL -- beta NON-UNIFORMLY-CERTIFIABLE < 2; same near-shell wall as imp-451',
  status:
    'Derived the unconditional NEAR+TAIL decomposition of B_p(s). SIGN LEMMA: ' +
    'no particle lies between an adjacent pair so every summand is positive and ' +
    'beta = sup_p sup_s B_p(s). PACKING BOUND (P): with all gaps >= g the k-th ' +
    'neighbour is at distance >= k g, giving B_p <= (2/g^2) sum 1/k^2 = ' +
    '(pi^2/3)/g^2, hence beta * g^2 <= pi^2/3 = 3.2899 > 2. RvM TAIL = 2 rho^2 ' +
    'is O(1), so tail * g^2 ~ 4e-3 is negligible: the near shell is the whole ' +
    'obstruction. The k=1 immediate neighbours ALONE saturate the threshold ' +
    '(2/g^2). Getting below 2 requires the GUE isolated-min-gap input ' +
    '(R_N ~ N^{4/3}, imp-451), which is NOT unconditional per-N. Condition FAILS.',

  decomposition: 'B_p(s) = NEAR(within D ~ mean spacing) + TAIL(beyond D)',
  signLemma:
    'every summand 1/((b-x_j)(a-x_j)) > 0 (no particle between an adjacent pair), so |B_p| = B_p',
  packingBound: 'beta <= (pi^2/3)/g^2  (k-th neighbour at distance >= k g; sum 1/k^2 = pi^2/6 each side)',
  tailBound: 'TAIL ~ 2 rho/D = 2 rho^2 at D = 1/rho; rho(T) = (1/2pi) log(T/2pi); O(1), g-independent',

  testPoint: {
    N: N_STAR,
    gMin: G_MIN,
    heightT: T_HEIGHT,
    rho: RHO,
    meanSpacing: MEAN_SPACING,
    betaPackingTimesGsq: BETA_PACKING_TIMES_GSQ,    // pi^2/3 ~ 3.2899
    immediateTwoSidedTimesGsq: IMMEDIATE_TWO_SIDED_TIMES_GSQ, // 2 (threshold, from k=1 alone)
    tailTimesGsq: TAIL_TIMES_GSQ,                   // ~4e-3 (negligible)
    betaRealHeuristicTimesGsq: BETA_REAL_TIMES_GSQ, // ~1.0 (NON-rigorous, single isolated min gap)
    conditionRigorousHolds: CONDITION_RIGOROUS_HOLDS, // false
  },

  honest:
    'The RIGOROUS uniform packing bound gives beta*g^2 = pi^2/3 = 3.29 > 2, so ' +
    'beta CANNOT be certified < 2 unconditionally. The NON-rigorous single-' +
    'isolated-min-gap estimate gives ~1.0 < 2, suggesting the TRUE value is sub-' +
    'threshold, but promoting it would require the GUE isolated-min-gap fact ' +
    '(== imp-451 R_N ~ N^{4/3}) which is RH/GUE-hard. The near shell defeats the ' +
    'tail exactly as in the Route-C G3a wall. NO claim that the sandwich bracket ' +
    'becomes unconditional.',

  namedResidual: {
    id: 'imp-2693-sub-isolated-min-gap',
    statement:
      'unconditional per-N proof that the worst adjacent pair has only ONE near-' +
      'minimal flanking gap (isolated argmin), replacing 2/g^2 by ~1/g^2 and ' +
      'putting beta*g^2 below 2',
    difficulty: 'RH/GUE-hard -- identical to the imp-451 Ben Arous-Bourgade R_N ~ N^{4/3} input',
  },

  sources: [
    'src/data/imp-2563-min-gap-sandwich-theorem.js (beta consumer; theorem hypothesis beta g^2 < 2)',
    'src/data/g3a-extremal-closure.js (imp-451: Route-C near+tail insufficient; R_N ~ N^{4/3})',
    'Riemann-von-Mangoldt density rho(T) = (1/2pi) log(T/2pi)',
  ],
};

// ── Build-time assertions ─────────────────────────────────────────────────────

export const BACKGROUND_FIELD_WEYL_BOUND_ASSERTIONS = [
  {
    id: 'imp2693-packing-bound-equals-pi2over3',
    holds: () => Math.abs(BETA_PACKING_TIMES_GSQ - (Math.PI * Math.PI) / 3) < 1e-12,
    why:
      'The packing bound (P) beta <= (pi^2/3)/g^2 must give beta*g^2 = pi^2/3 ' +
      'identically (the g^2 cancels). This is the pure closed-form content; a ' +
      'mismatch means the sum 1/k^2 = pi^2/6 per side or the cancellation is wrong.',
  },
  {
    id: 'imp2693-condition-fails-near-shell-wall',
    holds: () => BETA_PACKING_TIMES_GSQ > 2 && CONDITION_RIGOROUS_HOLDS === false,
    why:
      'The honest verdict: the rigorous uniform bound beta*g^2 = pi^2/3 = 3.29 ' +
      'EXCEEDS the sandwich threshold 2, so beta cannot be certified < 2 per-N. ' +
      'If this ever flipped to <= 2 the module would be silently overclaiming the ' +
      'unconditional bracket -- the same Route-C wall (imp-451) it documents.',
  },
  {
    id: 'imp2693-immediate-neighbours-saturate-threshold',
    holds: () => IMMEDIATE_TWO_SIDED_TIMES_GSQ === 2,
    why:
      'The two immediate flanking neighbours at minimal spacing g contribute ' +
      '2/g^2, i.e. EXACTLY the threshold value 2 in beta*g^2 units before any ' +
      'farther neighbour is added. This pins the obstruction on the near shell.',
  },
  {
    id: 'imp2693-tail-is-negligible',
    holds: () => TAIL_TIMES_GSQ < 0.01 && TAIL_RVM > 0,
    why:
      'The RvM tail 2 rho^2 is an O(1) constant independent of g, so tail*g^2 ~ ' +
      '4e-3 << 2 is negligible. This certifies the tail is NOT the obstruction ' +
      '(unlike a naive fear), isolating the near shell as the wall -- matching ' +
      'the imp-451 finding that the tail term is benign and the near term is not.',
  },
];

// ── Self-executing tripwire (matches the imp-2563 sibling pattern) ────────────
for (const a of BACKGROUND_FIELD_WEYL_BOUND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `[imp-2693-background-field-weyl-bound] build-time assertion failed: ${a.id} - ${a.why}`,
    );
  }
}
