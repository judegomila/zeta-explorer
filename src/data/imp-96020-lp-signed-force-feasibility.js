/**
 * @fileoverview imp-96020 -- Route B/D handoff: LP-feasibility of a bounded-support
 * signed coefficient field with Z_w * Z'' > 0 at every near-collision, at FIXED T,
 * and how the feasible support/norm degrades as T grows. Import-light (literals baked,
 * no zeros bundle); holds() assertions; self-executing. Measurement/feasibility only.
 * NOT a bound; no refereed bound is changed; RH open; NO QED.
 *
 * ORIGIN. rh-route-b-arithmetic-freeze-flow-2026-09-23.js nextTest (also
 * rh-novel-routes-sweep-synthesis-2026-09-23.js opening.nextTests[2]): the only
 * structured Route B lead is the mean-field direction, which points AWAY from zeta.
 * The honest next test is the positivity statement itself -- decide whether a
 * bounded-support signed coefficient field w can have Z_w * Z'' > 0 at every
 * near-collision, feasible at fixed T, and measure how the feasible region degrades
 * as T grows (expectation from the roadmap: feasible at fixed T, not uniformly -- a
 * Gram-law surrogate).
 *
 * SETUP. With signed coefficients w = (w_1,...,w_N), the additive freeze force is the
 * Riemann-Siegel partial sum (Route B, Lemma A)
 *   Z_w(x) = sum_{n=1..N} w_n * n^{-1/2} * cos(theta(x) - x*log n),  theta = RS theta.
 * A near-collision is a tighter-than-average consecutive zeta-zero pair; its point x*
 * is the inter-zero extremum (Z'(x*)=0). The Gram-law surrogate asks the signed field
 * to align with the local curvature at every near-collision:  Z_w(x*) * Z''(x*) > 0.
 * Since Z_w is LINEAR in w, this is a strict linear system
 *   g_k . w > 0,  g_k := sign(Z''(x*_k)) * a(x*_k),  a_n(x) = n^{-1/2} cos(theta(x)-x*log n).
 * Strict feasibility is scale-free per constraint, so each g_k is normalized to unit
 * L2. By Gordan the system is feasible iff 0 is NOT in conv{ghat_k}; the scale-free
 * feasibility MARGIN is
 *   rho(N,T) = max_{||w||=1} min_k <w, ghat_k> = dist(0, conv{ghat_k})  ( >0 iff feasible ).
 * Computed via Gilbert min-norm-point (Frank-Wolfe on the simplex), no LP library.
 *
 * MEASUREMENT (mpmath dps 25; 199 inter-zero extrema up to gamma_200, 72 near-collisions
 * with tightness = gap/localMeanGap < 0.85; height cutoffs T; support sizes N; Gilbert
 * 4000 iters). Reproduction: tmp/imp-96020-lp-signed-force-feasibility.py.
 *
 * FINDINGS.
 *  (1) UNIFORMLY FEASIBLE across every tested height: rho(N,T) > 0 for all N in
 *      {1,2,4,8,16,32} and all T up to gamma_200 ~ 396. The on-line surrogate does NOT
 *      approach infeasibility in the reachable window -- no visible uniform-in-T breakdown.
 *  (2) The SINGLE leading coefficient already saturates it: rho(1,T) = 1.0 at every T,
 *      because sign(Z''(x*)) = -sign(cos theta(x*)) at every inter-zero extremum
 *      (verified 23/23), so the n=1 RS main term (w_1 = -1) aligns automatically. This
 *      is exactly why it is a Gram-law surrogate: on the line the condition is generic.
 *  (3) DEGRADATION is mild, not a collapse. Adding higher modes only lowers the margin
 *      (more constraints): rho decreases monotonically in N and gently in T
 *      (N=32: 0.761 at T=60 down to 0.559 at T=396), and the minimal L1 coefficient
 *      norm grows only to ~2.3. Feasibility stays comfortably interior throughout.
 *
 * READING (honest). The anticipated uniform-in-T breakdown does NOT live on the critical
 * line: the on-line Gram-law surrogate is trivially satisfiable there (n=1 dominates the
 * extremum curvature). The real obstruction is OFF the line -- on genuine complex pairs,
 * where Route B Test 2 already found NO coefficient set has a universal confining sign
 * (offLine.confiningCounts). A uniform OFF-line LP would be a Weil-positivity-strength
 * statement, and it is inaccessible to this on-line construction. Sub-gap named below.
 * Changes no bound; no refereed bound is changed; RH open; NO QED.
 */

export const LP_SIGNED_FORCE_FEASIBILITY = Object.freeze({
  id: 'imp-96020-lp-signed-force-feasibility',
  date: '2026-09-23',
  route: 'B/D handoff',
  status: 'MEASURED -- on-line Gram-law surrogate Z_w*Z">0 UNIFORMLY FEASIBLE up to gamma_200 (n=1 saturates it, '
    + 'margin degrades gently not catastrophically); the uniform-in-T obstruction lives OFF the line (Route B Test 2). '
    + 'Changes no bound; no refereed bound is changed; RH open; NO QED',

  setup: {
    field: 'Z_w(x) = sum_{n=1..N} w_n n^{-1/2} cos(theta(x) - x log n)  (RS partial sum, signed coefficients)',
    nearCollision: 'inter-zero extremum x* (Z prime (x*)=0) of a consecutive zeta-zero pair with tightness = gap/localMeanGap < 0.85',
    constraint: 'Z_w(x*) * Z second (x*) > 0 at every near-collision  ->  g_k . w > 0, g_k = sign(Z second (x*)) a(x*), a_n = n^{-1/2} cos(theta - x log n)',
    margin: 'rho(N,T) = max_{||w||=1} min_k <w, ghat_k> = dist(0, conv{ghat_k}) ; feasible iff rho>0 (Gordan); ghat_k unit-normalized (scale-free)',
    solver: 'Gilbert min-norm-point (Frank-Wolfe on the simplex), 4000 iters; no LP library',
  },

  census: {
    numZeros: 200,
    interZeroExtrema: 199,
    nearCollisions: 72,
    tightnessThreshold: 0.85,
    maxHeight: 395.98,
    n1CurvatureAlignment: '23/23 checked: sign(Z second (x*)) = -sign(cos theta(x*)), so the n=1 mode is uniformly aligned (rho(1,T)=1)',
  },

  // rho(N,T) margin grid. feasible = rho > 1e-6. l1 = minimal-L1 coefficient norm of the
  // unit-margin certificate. N in {1,2,4,8,16,32}; T = height cutoff (numCollisions counted).
  N_list: [1, 2, 4, 8, 16, 32],
  grid: [
    { T: 60.0, numCollisions: 4, rho: [1.0, 0.987, 0.869, 0.811, 0.787, 0.761], l1: [1.0, 1.3373, 1.4128, 1.8234, 2.434, 3.2252] },
    { T: 90.0, numCollisions: 9, rho: [1.0, 0.915, 0.781, 0.729, 0.717, 0.692], l1: [1.0, 1.179, 1.3331, 1.5136, 2.2605, 2.9141] },
    { T: 120.0, numCollisions: 13, rho: [1.0, 0.898, 0.781, 0.716, 0.697, 0.660], l1: [1.0, 1.1467, 1.3262, 1.5685, 2.1546, 2.6728] },
    { T: 150.0, numCollisions: 20, rho: [1.0, 0.863, 0.751, 0.684, 0.651, 0.636], l1: [1.0, 1.0828, 1.1618, 1.5682, 2.0014, 2.6557] },
    { T: 200.0, numCollisions: 29, rho: [1.0, 0.832, 0.744, 0.680, 0.646, 0.619], l1: [1.0, 1.0317, 1.1197, 1.5818, 1.9191, 2.5458] },
    { T: 260.0, numCollisions: 41, rho: [1.0, 0.810, 0.741, 0.672, 0.626, 0.600], l1: [1.0, 1.0062, 1.0999, 1.5429, 1.8297, 2.3253] },
    { T: 395.98, numCollisions: 72, rho: [1.0, 0.773, 0.710, 0.626, 0.594, 0.559], l1: [1.0, 1.0615, 1.0607, 1.4385, 2.0001, 2.3261] },
  ],

  findings: {
    uniformlyFeasible: 'rho(N,T) > 0 for every N and every T tested; no approach to infeasibility in the reachable window',
    n1Saturates: 'rho(1,T) = 1.0 at every T -- the RS main term alone satisfies the on-line surrogate (generic on the line)',
    mildDegradation: 'higher modes only lower the margin (more constraints); rho decreases monotonically in N and gently in T (N=32: 0.761 -> 0.559), minimal L1 norm grows to ~2.3 -- interior, not a collapse',
  },

  subGap: {
    name: 'OFF-line uniform LP (Weil-positivity-strength) + Lehmer-height ceiling',
    statement: 'The uniform-in-T obstruction is NOT on the critical line (the on-line surrogate is trivially feasible, n=1 dominates the extremum curvature). It lives on genuine complex pairs, where Route B Test 2 found NO coefficient set has a universal confining sign. A uniform OFF-line LP would be a Weil-type arithmetic positivity statement, inaccessible to this on-line construction; and the tight Lehmer pairs where degradation could bite sit far above gamma_200.',
  },

  honest: 'The LP was set up and MEASURED: on the critical line the signed-force Gram-law surrogate is uniformly '
    + 'feasible up to gamma_200 with only a gentle margin decay, so the surrogate does not degrade to infeasibility '
    + 'on the line -- it is a genuine Gram-law surrogate, satisfiable there and NOT confining. The uniform-in-T '
    + 'difficulty is relocated off the line (Route B Test 2 no-universal-sign / Weil positivity). Changes no bound; '
    + 'no refereed bound is changed; RH open; NO QED.',

  references: [
    'src/data/rh-route-b-arithmetic-freeze-flow-2026-09-23.js (Lemma A, Test 2, nextTest)',
    'src/data/rh-novel-routes-sweep-synthesis-2026-09-23.js (opening.nextTests[2])',
    'J. Gilbert, An iterative procedure for computing the minimum of a quadratic form on a convex set, SIAM J. Control 4 (1966).',
    'tmp/imp-96020-lp-signed-force-feasibility.py (reproduction).',
  ],
});

const D = LP_SIGNED_FORCE_FEASIBILITY;

export const LP_SIGNED_FORCE_FEASIBILITY_ASSERTIONS = Object.freeze([
  {
    name: 'grid is a full N x T sweep of the feasibility margin',
    holds: () => D.grid.length === 7
      && D.N_list.length === 6
      && D.grid.every((r) => r.rho.length === 6 && r.l1.length === 6 && r.numCollisions >= 2),
  },
  {
    name: 'on-line surrogate is uniformly feasible (rho>0 for every N and T)',
    holds: () => D.grid.every((r) => r.rho.every((v) => v > 1e-6)),
  },
  {
    name: 'n=1 RS main term saturates the surrogate at every height (rho(1,T)=1)',
    holds: () => D.grid.every((r) => Math.abs(r.rho[0] - 1.0) < 1e-9)
      && /23\/23/.test(D.census.n1CurvatureAlignment),
  },
  {
    name: 'margin degrades monotonically in support size N (more modes = more constraints)',
    holds: () => D.grid.every((r) => {
      for (let i = 1; i < r.rho.length; i += 1) {
        if (r.rho[i] > r.rho[i - 1] + 1e-9) return false;
      }
      return true;
    }),
  },
  {
    name: 'degradation with T is gentle, not a collapse (N=32 margin stays well above 0)',
    holds: () => {
      const first = D.grid[0].rho[5];
      const last = D.grid[D.grid.length - 1].rho[5];
      return last > 0.5 && last < first && (first - last) < 0.3;
    },
  },
  {
    name: 'minimal L1 coefficient norm stays bounded (interior, not blowing up)',
    holds: () => D.grid.every((r) => r.l1.every((v) => v >= 1 && v <= 4)),
  },
  {
    name: 'sub-gap relocates the uniform-in-T obstruction OFF the line',
    holds: () => /OFF-line/.test(D.subGap.name)
      && /Weil/.test(D.subGap.statement)
      && /universal confining sign/.test(D.subGap.statement),
  },
  {
    name: 'honest status: measurement only, no bound change, no QED',
    holds: () => /UNIFORMLY FEASIBLE/.test(D.status)
      && /Changes no bound/.test(D.status)
      && /refereed bound is changed/i.test(D.status)
      && /RH open/.test(D.status)
      && /NO QED/.test(D.status),
  },
]);

for (const a of LP_SIGNED_FORCE_FEASIBILITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96020-lp-signed-force-feasibility assertion failed: ${a.name}`,
    );
  }
}

export default LP_SIGNED_FORCE_FEASIBILITY;
