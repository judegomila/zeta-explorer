/**
 * @module data/dyson-monotonicity-proof
 * @fileoverview imp-322 analytic proof that the minimum-gap B(t) is
 * non-increasing as t decreases under backward Calogero-Moser/Dyson flow,
 * upgrading the imp-299 numerical N=100 check to a theorem.
 * Proof-chain role: load-bearing monotonicity lemma for the Path C
 * barrier-extrapolation -> t_c -> Lambda >= -t_c chain.
 */
/**
 * Analytic monotonicity of B(t) under backward Dyson flow (imp-322)
 *
 * The Path C collision argument (barrier-extrapolation.js, imp-299) tracks
 *
 *     B(t) = min_k g_k(t),     g_k(t) = γ_{k+1}(t) − γ_k(t)
 *
 * backward in t and extrapolates to the smallest t at which B vanishes.
 * That extrapolated time t_c gives a bound Λ ≥ -t_c. The whole chain is
 * load-bearing on the assumption that B(t) is monotone (non-increasing as
 * t decreases): otherwise the smallest backward zero of B could be a local
 * dip and the true collision could occur later, invalidating the bound.
 *
 * imp-299 checked this numerically for N = 100. imp-322 asks for the
 * analytic statement, because a property that is only checked on a plot
 * is not a theorem and cannot certify a Λ bound. This file supplies the
 * proof, the constants used in it, and build-time assertions on the
 * boundary calculation that the proof rests on.
 *
 * The Calogero-Moser flow
 * -----------------------
 * The de Bruijn-Newman / Polymath15 deterministic flow on N real points
 * γ_1 < γ_2 < … < γ_N is
 *
 *     dγ_k/dt = 2 Σ_{j≠k} 1/(γ_k − γ_j).            (FORWARD)
 *
 * (The codebase implements d/d(−t) = −2 Σ 1/(γ_k − γ_j) inside
 * `dysonStep` of barrier-extrapolation.js, which is equivalent.)
 *
 * Differentiating a single gap g_k = γ_{k+1} − γ_k along forward flow:
 *
 *     dg_k/dt = dγ_{k+1}/dt − dγ_k/dt
 *             = 2/(γ_{k+1}−γ_k) − 2/(γ_k−γ_{k+1})
 *               + 2 Σ_{j∉{k,k+1}} [ 1/(γ_{k+1}−γ_j) − 1/(γ_k−γ_j) ].
 *
 * The first two terms collapse to 4/g_k. The summand simplifies via
 * 1/(γ_{k+1}−γ_j) − 1/(γ_k−γ_j) = − g_k / [(γ_{k+1}−γ_j)(γ_k−γ_j)],
 * giving the closed form
 *
 *     dg_k/dt = 4/g_k − 2 g_k · S_k(t),                                (★)
 *
 *     S_k(t) := Σ_{j∉{k,k+1}} 1 / [(γ_{k+1}−γ_j)(γ_k−γ_j)].
 *
 * Note S_k > 0 always: each j either lies left of both γ_k, γ_{k+1}
 * (positive × positive) or right of both (negative × negative). So the
 * second term in (★) opposes the first — the question is which wins.
 *
 * The min-gap bound on S_k
 * ------------------------
 * Let k* be any index attaining the minimum gap, g_{k*} = B. Each
 * consecutive gap is ≥ B by definition of the minimum. So for j on the
 * LEFT (j < k*), at index distance i = k*−j ≥ 1,
 *
 *     γ_{k*} − γ_j ≥ i · B,           γ_{k*+1} − γ_j ≥ (i+1) · B,
 *
 *     1 / [(γ_{k*+1}−γ_j)(γ_{k*}−γ_j)] ≤ 1 / [ i (i+1) · B² ].
 *
 * Summing over the LEFT side (1 ≤ i ≤ k*−1, extended to ∞ as a free
 * over-count):
 *
 *     Σ_{i≥1} 1 / [i(i+1)] = 1     (telescoping: 1/i − 1/(i+1)).
 *
 * The RIGHT side (j > k*+1) is bounded identically by symmetry. So
 *
 *     S_k*(t) ≤ 2 / B(t)².                                            (†)
 *
 * Substituting (†) back into (★) at k = k*:
 *
 *     dg_{k*}/dt ≥ 4/B − 2 B · (2/B²) = 4/B − 4/B = 0.
 *
 * This is the boundary calculation. So along the forward flow the
 * minimum gap satisfies dB/dt ≥ 0 in the viscosity / one-sided sense
 * (B is Lipschitz; at any time it equals some g_{k*} whose forward
 * derivative is non-negative). Equivalently:
 *
 *     THEOREM (Calogero-Moser min-gap monotonicity).
 *     Under the FORWARD flow dγ_k/dt = 2 Σ 1/(γ_k − γ_j), the function
 *     B(t) = min_k g_k(t) is non-decreasing in t. Equivalently, under
 *     BACKWARD flow B(t) is non-increasing. So the first backward time
 *     at which B vanishes is the actual collision time t_c, not a
 *     local dip.
 *
 * Where the bound is tight
 * ------------------------
 * Equality in (†) requires every consecutive gap on both sides of k*
 * to equal B simultaneously — i.e. equally-spaced zeros. That is exactly
 * the symmetric configuration in which all gaps collapse together, so
 * the analytic boundary is achieved precisely in the configuration in
 * which B(t) genuinely DOES touch 0 first. The proof is sharp.
 *
 * What this does NOT prove
 * ------------------------
 * The theorem is for the deterministic Calogero-Moser / Polymath15 flow
 * applied to a finite truncation of the zero list. It says nothing
 * about (a) the truncation tail correction (handled separately by the
 * Guth-Maynard tail bound, guth-maynard-tail-bound.js), or (b) the
 * extrapolation from the linear B(t) fit to the actual t_c (handled by
 * the error budget, lambda-error-budget.js). It only certifies that
 * "first backward zero of B" is the correct definition of collision —
 * which is the load-bearing assumption imp-322 was raised to fix.
 */

import { ZETA_ZEROS } from '../math/zeta.js';

// ── Constants used by the proof, exported so the build asserts on them ──────

// Σ_{i≥1} 1/[i(i+1)] = 1, the telescoping identity that drives bound (†).
export const TELESCOPING_HARMONIC_SUM = 1;

// Per-side bound on S_k: each side contributes ≤ 1/B², two sides ≤ 2/B².
export const S_K_BOUND_COEFFICIENT = 2;

// The boundary derivative: 4/B − 2 B · (2/B²) = (4 − 2·2)/B = 0/B = 0.
export const BOUNDARY_DERIVATIVE_NUMERATOR = 4 - 2 * S_K_BOUND_COEFFICIENT;

// ── Numerical sanity check on real zeros ────────────────────────────────────
// For the actual ZETA_ZEROS list, locate the index k* of the minimum gap and
// numerically evaluate S_{k*} from its definition. The bound (†) demands
// S_{k*} ≤ 2 / B². If this fails at t = 0 the proof — or the data file — is
// wrong, and the build assertion below catches it.

function evaluateMinGapAndSumAtT0() {
  const N = Math.min(200, ZETA_ZEROS.length);
  let kStar = 0;
  let B = Infinity;
  for (let k = 0; k < N - 1; k++) {
    const g = ZETA_ZEROS[k + 1] - ZETA_ZEROS[k];
    if (g < B) {
      B = g;
      kStar = k;
    }
  }
  let S = 0;
  for (let j = 0; j < N; j++) {
    if (j === kStar || j === kStar + 1) continue;
    const a = ZETA_ZEROS[kStar + 1] - ZETA_ZEROS[j];
    const b = ZETA_ZEROS[kStar] - ZETA_ZEROS[j];
    S += 1 / (a * b);
  }
  return { N, kStar, B, S, bound: 2 / (B * B) };
}

export const MIN_GAP_NUMERICAL_CHECK = evaluateMinGapAndSumAtT0();

// ── The theorem itself, as a structured record other modules can quote ─────

export const DYSON_MONOTONICITY_THEOREM = {
  id: 'imp-322',
  name: 'Calogero-Moser min-gap monotonicity',
  flow: 'dγ_k/dt = 2 Σ_{j≠k} 1/(γ_k − γ_j)   (forward, Polymath15 sign)',
  statement:
    'Under the forward flow above, B(t) = min_k (γ_{k+1}(t) − γ_k(t)) ' +
    'is non-decreasing in t. Equivalently, under backward flow B(t) is ' +
    'non-increasing, so the first backward time at which B vanishes is ' +
    'the genuine collision time t_c.',
  proofKey:
    'dg_k*/dt = 4/B − 2 B · S_k*, with S_k* ≤ 2/B² by Σ 1/[i(i+1)] = 1 ' +
    'on each side. So dg_k*/dt ≥ 0, and B is non-decreasing forward.',
  whereTight:
    'Equality holds iff every consecutive gap on both sides of k* equals B ' +
    '(equally-spaced configuration). That is exactly the symmetric ' +
    'configuration in which all gaps collapse together, so the boundary ' +
    'is achieved at the genuine collision and the proof is sharp.',
  scope:
    'Deterministic Calogero-Moser flow on a finite truncation of the zero ' +
    'list. Truncation tail handled by guth-maynard-tail-bound.js; linear ' +
    'extrapolation error handled by lambda-error-budget.js.',
  consumers: [
    'src/math/barrier-extrapolation.js (imp-299) — numerical B(t) tracking',
    'src/data/bridge-lambda-rh.js — Path C collision-time argument',
  ],
  status: 'theorem (this file)',
};

// ── Build-time assertions ──────────────────────────────────────────────────

export const MONOTONICITY_ASSERTIONS = [
  {
    id: 'telescoping-sum-equals-one',
    holds: () => {
      let s = 0;
      for (let i = 1; i <= 100000; i++) s += 1 / (i * (i + 1));
      return Math.abs(s - TELESCOPING_HARMONIC_SUM) < 1e-4;
    },
    why:
      'Σ_{i≥1} 1/[i(i+1)] telescopes to 1. This is the identity that ' +
      'collapses the per-side bound on S_k* into S_k* ≤ 2/B². If a future ' +
      'edit changes TELESCOPING_HARMONIC_SUM, this fires.',
  },
  {
    id: 'boundary-derivative-vanishes',
    holds: () => BOUNDARY_DERIVATIVE_NUMERATOR === 0,
    why:
      'The theorem rests on 4 − 2·S_K_BOUND_COEFFICIENT = 0. If anyone ' +
      'edits the coefficient without re-deriving the bound this trips.',
  },
  {
    id: 'numerical-S-bound-holds-on-real-zeros',
    holds: () => {
      const c = MIN_GAP_NUMERICAL_CHECK;
      return c.S > 0 && c.S <= c.bound + 1e-9;
    },
    why:
      'On the actual ZETA_ZEROS list, the bound S_k* ≤ 2/B² must hold at ' +
      't = 0. If it fails the analytic bound (†) is wrong or the zero list ' +
      'has been corrupted. This is a non-vacuous numerical witness for ' +
      'the theorem on the data we actually run on.',
  },
];
