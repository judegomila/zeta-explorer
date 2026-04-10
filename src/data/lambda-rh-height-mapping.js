/**
 * Λ ≤ 0 ⟺ RH at finite height — exact theorem citation + N ↔ T* map (imp-327)
 *
 * bridge-lambda-rh.js states the Λ ↔ RH chain prose-first. imp-327 asks for
 * the same chain tightened to an EXACTLY-CITED theorem sequence with a
 * precise map from "our working N" to the effective height T*(N) that a
 * finite-N Path C computation actually controls. The point is that when
 * imp-321 eventually pushes N toward Platt-Trudgian scale, the downstream
 * file only has to look up T*(N) here instead of re-deriving the mapping.
 *
 * The theorem chain (exactly as used by Path C)
 * ---------------------------------------------
 *
 * (DB) de Bruijn (1950). Define
 *          Φ(u) = Σ_{n≥1} (2π² n⁴ e^{9u} − 3π n² e^{5u}) exp(−π n² e^{4u})
 *          H_t(z) = ∫_0^∞ Φ(u) e^{t u²} cos(z u) du.
 *      Then H_0(z) = (1/8) Ξ(z/2), and there is a constant Λ ∈ [−∞, ∞] such
 *      that: for every t ≥ Λ, H_t has only real zeros; for every t < Λ,
 *      H_t has a non-real zero. Consequently,
 *
 *          RH  ⟺  H_0 has only real zeros  ⟺  Λ ≤ 0.
 *
 *      Ref: N. G. de Bruijn, "The roots of trigonometric integrals",
 *      Duke Math. J. 17 (1950), 197–226, Theorems 13 & 14.
 *
 * (NL) Newman (1976). Λ > −∞ and Λ is a well-defined real number.
 *      Ref: C. M. Newman, "Fourier transforms with only real zeros",
 *      Proc. AMS 61 (1976), 245–251.
 *
 * (RT) Rodgers–Tao (2020). Λ ≥ 0, settling Newman's conjecture.
 *      Ref: B. Rodgers & T. Tao, "The de Bruijn–Newman constant is
 *      non-negative", Acta Math. 225 (2020), 1–58, Theorem 1.1.
 *
 * (PT) Platt–Trudgian (2021). Λ ≤ 0.2, unconditional.
 *      Ref: D. Platt & T. Trudgian, "The Riemann hypothesis is true up to
 *      3·10^12", Bull. Lond. Math. Soc. 53 (2021), 792–797.
 *
 * Combining (DB)+(RT):  RH ⟺ Λ = 0.
 *
 * Finite-height restriction of (DB) used by Path C
 * ------------------------------------------------
 * Path C does not manipulate H_t directly; it runs the Calogero–Moser /
 * Dyson flow on the first N Riemann zeros. The standard Polymath15 / Tao
 * identification says: if γ_1(0) < … < γ_N(0) are the first N ordinates of
 * zeros of Ξ and one solves
 *
 *     dγ_k/dt = −2 Σ_{j ≠ k} 1/(γ_k − γ_j),       k = 1, …, N,
 *
 * backward in t, then γ_k(t) track the zeros of a finite truncation of
 * H_t as long as no collision has happened. The collision time t_c < 0 is
 * a lower bound for the earliest time at which a pair of zeros of the
 * truncated H_t could fail to be real, so
 *
 *     Λ  ≤  −t_c  +  (tail correction above T_0).
 *
 * The "at height T*" version of (DB) we actually use is the direct
 * conjunction: if (i) Λ ≤ 0 holds for the flow on the first N zeros AND
 * (ii) the tail above T_0 is certified to have no off-line zeros, then
 * every γ < T_0 lies on the critical line — which is RH up to height T_0.
 * Without either (i) or (ii) the conclusion is conditional.
 *
 * N ↔ T* mapping
 * --------------
 * The mean density of zeros of ζ(1/2 + it) at height T is
 *
 *     ρ(T) = (1/(2π)) log(T / 2π)   (Riemann–von Mangoldt).
 *
 * Integrating ρ gives N(T) ≈ (T/(2π))(log(T/(2π)) − 1). Solving for T at
 * a given N yields T*(N): the height up to which a Dyson-backward-collision
 * statement on the first N zeros of Ξ would, at best, CONSTRAIN the zeros.
 *
 * This is exactly the height that enters bridge-lambda-rh.js as T_0 — we
 * simply make it a function here so imp-321 can evaluate T*(10^k) for
 * k = 3, 4, 5, 6 without re-deriving the formula each time.
 */

import { LAMBDA_RH_BRIDGE } from './bridge-lambda-rh.js';

// ── Theorem ledger ──────────────────────────────────────────────────────────

export const LAMBDA_RH_THEOREMS = [
  {
    id: 'de-bruijn-1950',
    statement:
      'There exists Λ ∈ [−∞, ∞] such that H_t has only real zeros for every ' +
      't ≥ Λ and a non-real zero for every t < Λ. In particular RH ⟺ Λ ≤ 0.',
    citation: 'de Bruijn, Duke Math. J. 17 (1950), 197–226, Thm 13–14.',
    proved: true,
    usedBy: 'Every Λ-based RH argument, including Path C.',
  },
  {
    id: 'newman-1976',
    statement: 'Λ > −∞, i.e. Λ is a real number.',
    citation: 'Newman, Proc. AMS 61 (1976), 245–251.',
    proved: true,
    usedBy: 'Well-posedness: without (NL) "Λ ≤ 0" is not a well-typed claim.',
  },
  {
    id: 'rodgers-tao-2020',
    statement: 'Λ ≥ 0 (Newman\'s conjecture).',
    citation: 'Rodgers & Tao, Acta Math. 225 (2020), 1–58, Thm 1.1.',
    proved: true,
    usedBy:
      'Combined with (DB): RH ⟺ Λ = 0. Forbids any "Λ < 0" claim and ' +
      'makes the sole remaining target Λ ≤ 0, i.e. Λ = 0.',
  },
  {
    id: 'platt-trudgian-2021',
    statement: 'Λ ≤ 0.2 unconditionally, with RH verified to T ≈ 3·10^12.',
    citation: 'Platt & Trudgian, Bull. Lond. Math. Soc. 53 (2021), 792–797.',
    proved: true,
    usedBy: 'Current unconditional ceiling on Λ — the SOTA we compare Path C against.',
  },
  {
    id: 'equivalence-corollary',
    statement: 'RH ⟺ Λ = 0.',
    citation: 'Corollary of de-bruijn-1950 and rodgers-tao-2020.',
    proved: true,
    usedBy: 'The equivalence used by every line of Path C and bridge-lambda-rh.js.',
  },
];

// ── N ↔ T* map using Riemann–von Mangoldt ──────────────────────────────────

// Inverse of the N(T) ≈ (T/(2π))(log(T/(2π)) − 1) asymptotic.
// Newton iteration against f(T) = (T/(2π))(log(T/(2π)) − 1) − N.
export function effectiveHeightForN(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  const twoPi = 2 * Math.PI;
  // Seed: invert log(T) ≈ log(N) for large N, then Newton-refine.
  let T = Math.max(twoPi * Math.E, twoPi * N / Math.max(1, Math.log(N + twoPi)));
  for (let i = 0; i < 40; i++) {
    const u = Math.log(T / twoPi);
    const f = (T / twoPi) * (u - 1) - N;
    const fp = u / twoPi; // d/dT[(T/2π)(log(T/2π) − 1)] = log(T/2π)/(2π)
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > twoPi)) T = twoPi * 1.0001;
    if (Math.abs(dT) < 1e-9 * Math.max(1, T)) break;
  }
  return T;
}

// Direct count N(T) for cross-checking the inverse above.
export function zeroCountAtHeight(T) {
  if (!(T > 0) || !Number.isFinite(T)) return 0;
  const twoPi = 2 * Math.PI;
  const u = Math.log(T / twoPi);
  if (!(u > 0)) return 0;
  return (T / twoPi) * (u - 1);
}

// Precomputed table: N → T*(N). These are the heights a Path C statement
// at the given N "sees" under the Riemann–von Mangoldt asymptotic.
const N_LADDER = [
  2458,    // current (imp-305)
  5000,    // imp-315 target
  10000,
  100000,
  1_000_000,
  10_000_000,
  1e8,
];

export const N_TO_T_STAR_TABLE = N_LADDER.map((N) => {
  const T = effectiveHeightForN(N);
  return {
    N,
    T_star: T,
    NBack: zeroCountAtHeight(T),
    density: Math.log(T / (2 * Math.PI)) / (2 * Math.PI),
    log10_T: Math.log10(T),
  };
});

// ── The load-bearing finite-height statement ───────────────────────────────

export const FINITE_HEIGHT_RH_STATEMENT = {
  id: 'imp-327',
  form:
    'If (i) the Calogero–Moser flow on the first N zeros yields a certified ' +
    'collision time t_c with −t_c ≥ 0 (hence Λ ≤ 0 on the truncated system) ' +
    'AND (ii) the tail above T_0 is certified by a zero-density bound to ' +
    'contain no off-line zeros, then every non-trivial zero γ of ζ with ' +
    '|γ| ≤ T*(N) lies on the critical line. I.e. RH holds at height T*(N).',
  whichTheoremsUsed: [
    'de-bruijn-1950',      // the RH ⟺ Λ ≤ 0 equivalence
    'rodgers-tao-2020',    // forces Λ = 0 (no "Λ < 0" shortcut)
    'newman-1976',         // makes "Λ ≤ 0" a well-typed claim
  ],
  currentN: LAMBDA_RH_BRIDGE.pathCBound.numberOfZeros,
  currentTStar: effectiveHeightForN(LAMBDA_RH_BRIDGE.pathCBound.numberOfZeros),
  declaredT0: LAMBDA_RH_BRIDGE.pathCBound.verifiedHeight,
  whatIsStillMissing: [
    '(i) is NOT established: the Path C central value is 0.0066 > 0 with error ' +
      '0.01, so t_c is not certified ≤ 0. B2 in lambda-zero-attack.js.',
    '(ii) is conditional: Guth–Maynard tail is tabulated (imp-317) but not yet ' +
      'folded as a subtracted count in the barrier step. B4 in lambda-zero-attack.js.',
    'Even under (i)+(ii), the conclusion is RH only up to T*(N) — Platt–Trudgian ' +
      'already covers T ≤ 3·10^12, so imp-321 must scale N before the result is new.',
  ],
  pluggedInBy: 'imp-321 (push N toward PT scale) will read T_star from effectiveHeightForN.',
};

// ── Build-time assertions ──────────────────────────────────────────────────

export const LAMBDA_RH_HEIGHT_ASSERTIONS = [
  {
    id: 'rvm-self-consistency',
    holds: () => {
      // T*(N) pushed through N(T) should return ≈ N.
      for (const row of N_TO_T_STAR_TABLE) {
        if (Math.abs(row.NBack - row.N) > 1e-4 * Math.max(1, row.N)) return false;
      }
      return true;
    },
    why:
      'effectiveHeightForN is the numerical inverse of zeroCountAtHeight; ' +
      'round-trip error must be under one part in 10^4 or the Newton iteration ' +
      'has silently diverged.',
  },
  {
    id: 't-star-monotone-in-N',
    holds: () => {
      for (let i = 1; i < N_TO_T_STAR_TABLE.length; i++) {
        if (!(N_TO_T_STAR_TABLE[i].T_star > N_TO_T_STAR_TABLE[i - 1].T_star)) {
          return false;
        }
      }
      return true;
    },
    why: 'More zeros ⇒ strictly greater effective height. Any inversion is a table-build bug.',
  },
  {
    id: 'current-N-row-matches-bridge',
    holds: () => {
      const declaredT0 = LAMBDA_RH_BRIDGE.pathCBound.verifiedHeight;
      const computedT = effectiveHeightForN(LAMBDA_RH_BRIDGE.pathCBound.numberOfZeros);
      // Path C declares T_0 ≈ 3000 for N = 2458. The RvM asymptotic gives
      // T*(2458) in the same ballpark — require agreement within a factor of 2.
      return computedT > declaredT0 / 2 && computedT < declaredT0 * 2;
    },
    why:
      'The declared T_0 = 3000 in bridge-lambda-rh.js must be consistent ' +
      'with the Riemann–von Mangoldt effective height for N = 2458. If a ' +
      'future edit changes one without the other the finite-height statement ' +
      'above is referencing an inconsistent height.',
  },
  {
    id: 't-star-below-PT-at-current-N',
    holds: () => {
      const computedT = effectiveHeightForN(LAMBDA_RH_BRIDGE.pathCBound.numberOfZeros);
      return computedT < LAMBDA_RH_BRIDGE.sotaUpperBound.verifiedHeight;
    },
    why:
      'At N = 2458 the effective height must be far below Platt–Trudgian 3·10^12. ' +
      'Otherwise the claim "imp-321 scales N to reach PT" would already be satisfied ' +
      'and the roadmap in FINITE_HEIGHT_RH_STATEMENT.whatIsStillMissing is wrong.',
  },
  {
    id: 'rh-equivalence-cites-both-anchors',
    holds: () => {
      const used = FINITE_HEIGHT_RH_STATEMENT.whichTheoremsUsed;
      return used.includes('de-bruijn-1950') && used.includes('rodgers-tao-2020');
    },
    why:
      'The RH ⟺ Λ = 0 equivalence needs BOTH de Bruijn 1950 (for RH ⟺ Λ ≤ 0) ' +
      'and Rodgers–Tao 2020 (for Λ ≥ 0). Dropping either would leave an ' +
      'implicit shortcut via "Λ < 0" that is forbidden.',
  },
];
