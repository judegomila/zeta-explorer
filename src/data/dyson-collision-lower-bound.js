/**
 * @module dyson-collision-lower-bound
 * @fileoverview Analytic lower bound on the Dyson collision time |t_c| (imp-325, BLOCKER B3).
 *
 * The Path C chain bounds Λ ≤ -t_c, where t_c is the smallest backward time
 * at which B(t) = min_k g_k(t) vanishes under the Calogero-Moser flow on the
 * first N Riemann zeros (bridge-lambda-rh.js, dyson-monotonicity-proof.js).
 * Until now the only quantitative control on t_c was the numerical fit
 * |t_c(N)| ≈ 0.0066 + 4.91/N — a least-squares estimate over five Ns, not a
 * theorem. imp-319 / lambda-zero-attack.js B3 asked for an analytic lower
 * bound on |t_c| derived from the Dyson repulsion ODE itself, so that t_c
 * can be bounded from below without resorting to a fit and the resulting Λ
 * upper bound is rigorous.
 *
 * This file supplies that bound. It is short because once the imp-322
 * boundary identity is in hand, a one-line Grönwall argument finishes the
 * job; the work is in pinning the constants and asserting the bound holds
 * on the actual zero list.
 *
 * The theorem
 * -----------
 * Let γ_1 < … < γ_N evolve under the Calogero-Moser flow
 *
 *     dγ_k/dt = 2 Σ_{j ≠ k} 1/(γ_k − γ_j),
 *
 * write g_k(t) = γ_{k+1}(t) − γ_k(t), and B(t) = min_k g_k(t). imp-322
 * established the closed-form
 *
 *     dg_k/dt = 4/g_k − 2 g_k · S_k(t),
 *
 *     S_k(t) := Σ_{j ∉ {k,k+1}} 1 / [(γ_{k+1}−γ_j)(γ_k−γ_j)] ≥ 0.
 *
 * Pass to backward time τ = −t. Then dg_k/dτ = −dg_k/dt = −4/g_k + 2 g_k S_k.
 * Because S_k ≥ 0,
 *
 *     dg_k/dτ ≥ −4/g_k,
 *
 *     d(g_k²)/dτ = 2 g_k · dg_k/dτ ≥ −8 + 4 g_k² S_k ≥ −8.                 (*)
 *
 * The bound (*) holds POINTWISE for every gap, every τ. The minimum-gap
 * envelope B²(τ) = min_k g_k²(τ) is a min of finitely many Lipschitz
 * functions and is therefore itself Lipschitz; at any τ where the min is
 * attained at some index k*, the one-sided lower derivative satisfies
 *
 *     d⁻ B²(τ)/dτ ≥ d g_{k*}²(τ)/dτ ≥ −8.
 *
 * Integrating from τ = 0 (gives B²(τ) ≥ B²(0) − 8 τ in the viscosity /
 * Grönwall sense for Lipschitz functions with one-sided derivatives bounded
 * below — see e.g. Clarke, Optimization and Nonsmooth Analysis, Prop 2.2.5):
 *
 *     B²(τ) ≥ B²(0) − 8 τ.
 *
 * The collision time τ_c is, by definition, the smallest τ ≥ 0 with
 * B(τ) = 0, equivalently B²(τ) = 0. Setting B²(τ_c) ≥ 0 ≥ B²(0) − 8 τ_c
 * gives τ_c ≥ B(0)² / 8. In the original time variable t = −τ:
 *
 *     THEOREM (Calogero-Moser collision-time lower bound).
 *     |t_c(N)| ≥ B(0)² / 8,
 *     where B(0) = min_k (γ_{k+1}(0) − γ_k(0)) is the smallest spacing in
 *     the initial zero list. Equivalently, the Path C upper bound on Λ
 *     satisfies Λ ≤ −t_c ≤ −B(0)²/8 ≤ 0 only if B(0) = 0; in particular
 *     B(0) > 0 forces the Path C extrapolation to leave a non-zero
 *     |t_c|-budget at every finite N.
 *
 * Why this is the deliverable for B3 of imp-319
 * ---------------------------------------------
 * lambda-zero-attack.js B3 asked for "an analytic upper bound on
 * |dg/dt|⁻¹ near small gaps" so that t_c could be bounded analytically.
 * The bound (*) is exactly that: |dg_k/dτ| ≤ 4/g_k + 2 g_k S_k, and on the
 * S_k ≥ 0 side the bound dg_k/dτ ≥ −4/g_k inverts to |dg_k/dτ|⁻¹ ≥ g_k/4
 * — the requested rate. The integrated form |t_c| ≥ B(0)²/8 is the
 * collision-time consequence imp-319 listed as "feeds B2 by giving an
 * independent line for the same intercept".
 *
 * Sharpness and what this does NOT prove
 * --------------------------------------
 * The bound is sharp for the isolated TWO-particle problem: with N = 2 the
 * full ODE is dg/dt = 4/g, which integrates exactly to g(t)² = g(0)² + 8t,
 * collision at τ = g(0)²/8 with equality. For N > 2 the bound is a strict
 * lower bound — additional particles can only DELAY collision in backward
 * time, because S_k ≥ 0 always pushes dg_k/dτ above the −4/g_k floor. So
 * the inequality is tight in the worst case (N = 2) and conservative on
 * the actual zero list (N = 200+).
 *
 * What this lower bound does NOT settle: the value of B(0) for the first
 * N zeros decreases in N (more zeros packed in roughly the same density
 * region), so B(0)²/8 → 0 as N → ∞ on its own. The lower bound therefore
 * does not directly prevent the Path C intercept from being positive — it
 * forces a non-zero |t_c| at each finite N but says nothing about the
 * limit, which is exactly the open question of B2 (lambda-zero-attack.js).
 * This file is the B3 ingredient, not the B2 closure.
 *
 * **Exports**
 * - `COLLISION_RATE_BOUND` — constant 8; the coefficient in d(g_k^2)/dτ ≥ −8
 * - `COLLISION_TIME_DIVISOR` — alias for COLLISION_RATE_BOUND used in the floor formula
 * - `COLLISION_LOWER_BOUND_NUMERICAL` — {N, kStar, B, tCollisionLowerBound} on first 200 zeros
 * - `DYSON_COLLISION_LOWER_BOUND_THEOREM` — structured theorem record (id, statement, proofKey…)
 * - `COLLISION_LOWER_BOUND_ASSERTIONS` — 4 build-time assertion objects
 *
 * **Proof chain step**: B3 (Path C collision floor).
 * Consumes: dyson-monotonicity-proof.js (imp-322 boundary identity).
 * Feeds: lambda-zero-attack.js B3 — collision-time floor for the Λ upper bound.
 *
 * **Ticket history**
 * - imp-325: created this file; derived the Grönwall/Calogero-Moser collision-time bound
 * - imp-779: added @module/@fileoverview JSDoc (this comment)
 */

import { ZETA_ZEROS } from '../math/zeta.js';

// ── Constants pinned by the proof ──────────────────────────────────────────

// d(g_k²)/dτ ≥ −COLLISION_RATE_BOUND under backward flow.
// The 8 comes from 2 · (4/g_k) · g_k = 8 in the boundary calculation.
export const COLLISION_RATE_BOUND = 8;

// |t_c| ≥ B(0)² / COLLISION_RATE_BOUND.
export const COLLISION_TIME_DIVISOR = COLLISION_RATE_BOUND;

// ── Apply the bound to the actual ZETA_ZEROS list ──────────────────────────
// Use the same N = min(200, ZETA_ZEROS.length) truncation as imp-322 so the
// two files agree on what "the data we run on" means.

function computeMinGapAndLowerBound() {
  const N = Math.min(200, ZETA_ZEROS.length);
  let B = Infinity;
  let kStar = 0;
  for (let k = 0; k < N - 1; k++) {
    const g = ZETA_ZEROS[k + 1] - ZETA_ZEROS[k];
    if (g < B) {
      B = g;
      kStar = k;
    }
  }
  const tCollisionLowerBound = (B * B) / COLLISION_TIME_DIVISOR;
  return { N, kStar, B, tCollisionLowerBound };
}

export const COLLISION_LOWER_BOUND_NUMERICAL = computeMinGapAndLowerBound();

// ── The theorem itself, as a structured record ─────────────────────────────

export const DYSON_COLLISION_LOWER_BOUND_THEOREM = {
  id: 'imp-325',
  closedBlocker: 'B3-dyson-repulsion-lower-bound (lambda-zero-attack.js)',
  name: 'Calogero-Moser collision-time lower bound',
  statement:
    '|t_c(N)| ≥ B(0)² / 8, where B(0) = min_k (γ_{k+1}(0) − γ_k(0)) is the ' +
    'smallest gap in the initial zero list and t_c is the smallest backward ' +
    'time at which B(t) vanishes under the forward Calogero-Moser flow ' +
    'dγ_k/dt = 2 Σ 1/(γ_k − γ_j).',
  proofKey:
    'imp-322 closed form dg_k/dt = 4/g_k − 2 g_k S_k(t) with S_k ≥ 0. In ' +
    'backward time τ = −t, dg_k/dτ ≥ −4/g_k, so d(g_k²)/dτ ≥ −8 pointwise. ' +
    'Taking the min over k preserves the lower bound on the one-sided ' +
    'derivative (Lipschitz-min Grönwall), so B²(τ) ≥ B²(0) − 8τ, and the ' +
    'first τ_c with B(τ_c) = 0 satisfies τ_c ≥ B(0)²/8.',
  whereTight:
    'Sharp for N = 2: the isolated two-particle equation dg/dt = 4/g ' +
    'integrates exactly to g²(t) = g²(0) + 8t, collision at τ = g²(0)/8 ' +
    'with equality. For N > 2 the bound is a strict lower bound because ' +
    'S_k > 0 strictly delays collision in backward time.',
  scope:
    'Deterministic Calogero-Moser flow on a finite truncation of the zero ' +
    'list. Says nothing about the N → ∞ limit of B(0) (which is the B2 ' +
    'intercept-positivity question, lambda-zero-attack.js) or about the ' +
    'truncation tail (handled by guth-maynard-tail-bound.js).',
  consumes: 'src/data/dyson-monotonicity-proof.js (imp-322) — boundary identity',
  feeds:
    'src/data/lambda-zero-attack.js B3 — converts |dg/dτ|⁻¹ ≥ g/4 into a ' +
    'collision-time floor that the numerical fit can be measured against.',
  status: 'theorem (this file)',
};

// ── Build-time assertions ──────────────────────────────────────────────────

export const COLLISION_LOWER_BOUND_ASSERTIONS = [
  {
    id: 'rate-bound-coefficient',
    holds: () => COLLISION_RATE_BOUND === 8,
    why:
      'd(g²)/dτ ≥ −8 = −2·(4/g)·g. Any future edit that changes this ' +
      'coefficient without re-deriving must trip this assertion.',
  },
  {
    id: 'min-gap-strictly-positive',
    holds: () => COLLISION_LOWER_BOUND_NUMERICAL.B > 0,
    why:
      'The lower bound |t_c| ≥ B(0)²/8 is only non-vacuous when B(0) > 0. ' +
      'On the real ZETA_ZEROS list the zeros are simple and distinct, so ' +
      'B(0) > 0; if this fires the data file has been corrupted.',
  },
  {
    id: 'collision-floor-non-vacuous',
    holds: () => {
      const { tCollisionLowerBound } = COLLISION_LOWER_BOUND_NUMERICAL;
      return tCollisionLowerBound > 0 && Number.isFinite(tCollisionLowerBound);
    },
    why:
      'The certified |t_c| floor must be a finite positive number. Catches ' +
      'overflow / NaN in the B² / 8 computation if the zero list is empty.',
  },
  {
    id: 'two-particle-equality-case',
    holds: () => {
      // For an isolated pair g_0 = 1, the closed-form CM solution gives
      // collision at τ = g_0² / 8 = 0.125 with EQUALITY. The floor formula
      // must reproduce this exactly.
      const g = 1;
      const floor = (g * g) / COLLISION_TIME_DIVISOR;
      return Math.abs(floor - 0.125) < 1e-12;
    },
    why:
      'The bound is sharp at N = 2: dg/dt = 4/g integrates to g² = g_0² + 8t, ' +
      'so the collision happens at exactly τ = g_0²/8. If COLLISION_TIME_DIVISOR ' +
      'is silently changed the equality case will no longer reproduce 0.125 ' +
      'and this assertion fires.',
  },
];
