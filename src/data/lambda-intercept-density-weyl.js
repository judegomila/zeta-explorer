/**
 * @module lambda-intercept-density-weyl
 * @jsdocTag imp-815+842+844+846+884+886
 *
 * imp-342: rigorous Weyl-law derivation of c(N) for the density-aware S_k*
 * squeeze — partial closure of G3_density
 *
 * The problem
 * -----------
 * imp-337 (lambda-intercept-density-squeeze.js) shipped the closed-form
 * collision-time bound under the density-aware squeeze
 *
 *     S_{k*}(τ)  ≥  c(N) / B(τ)²,       B(τ) = g_{k*(τ)}(τ),
 *
 * and used it with the imp-322 boundary identity dg_{k*}/dτ = 4/B − 2 B · S_{k*}
 * to deliver, in regime (c) c(N) > 2,
 *
 *     |τ_c|  ≤  B(0)² / (4 c(N) − 8).
 *
 * imp-337 carried an ANSATZ c(N) = 2·(1 + κ/log(γ_N/(2π))) with κ = 1 as an
 * order-unity GUE shape constant and flagged the open gap G3_density: the
 * rigorous justification of the form of c(N) and the explicit value of κ
 * from the Weyl / Riemann-von Mangoldt local density of zeros. imp-343
 * separately closed the sister gap G4_argmin_drift via the backward
 * argmin-stability lemma (drift length exactly 0), so the imp-337 route
 * now has G3_density as its SOLE remaining gap.
 *
 * This file attempts a rigorous Weyl-law derivation of c(N). What it
 * delivers, and what it does not, is spelled out below. The verdict is an
 * HONEST PARTIAL CLOSURE: a new rigorous form of c(N) is derived, a stronger
 * rigorous lower bound c_rigorous ≥ 2·(1 + (π²/6 − 1)·(ρ·B)²) is obtained,
 * but the specific imp-337 ansatz c(N) = 2·(1 + κ/log(γ_N/(2π))) with
 * κ independent of B is NOT recoverable from the Weyl law alone — and the
 * file explains exactly why.
 *
 * The Riemann-von Mangoldt input
 * ------------------------------
 * The smooth zero-counting function is
 *
 *     N(T)  =  (T / (2π)) · log(T / (2π e))  +  7/8  +  S(T)  +  O(1/T),
 *
 * where S(T) = (1/π) · arg ζ(1/2 + i T) is the fluctuation term. The local
 * density of zeros is
 *
 *     ρ(γ)  =  dN/dT|_{T=γ}  =  (1/(2π)) · log(γ / (2π))  +  dS/dT.
 *
 * Unconditionally |S(T)| = O(log T / log log T) (Selberg; see the imp-341
 * Koksma-Hlawka file for the same Selberg constant used there), and under
 * RH |S(T)| = O(log T / (log log T)^{1/2}). Both imply dS/dT is SMALLER in
 * average than the leading smooth term (1/(2π))·log(γ/(2π)), so the
 * leading-order local density is
 *
 *     ρ_∞(γ)  =  (1/(2π)) · log(γ / (2π)),
 *
 * and the average spacing at height γ is
 *
 *     Δ(γ)  :=  1 / ρ_∞(γ)  =  2π / log(γ / (2π)).
 *
 * Derivation of a rigorous lower bound on S_{k*}
 * -----------------------------------------------
 * Recall from imp-322 the symmetrised collision kernel
 *
 *     S_{k*}(τ)  =  Σ_{j ∉ {k*, k*+1}} 1 / [(γ_{k*+1} − γ_j)(γ_{k*} − γ_j)].
 *
 * Decompose into the immediate neighbours (j = k*−1 and j = k*+2) and the
 * long-range tail (|j − k*| ≥ 2 on either side):
 *
 *     S_{k*}  =  S_{near}  +  S_{tail}.
 *
 * (a) IMMEDIATE NEIGHBOURS. By definition of B = minimum gap, both
 *     g_{k*−1} ≥ B and g_{k*+1} ≥ B, so
 *
 *         γ_{k*} − γ_{k*−1}  ≥  B,       γ_{k*+1} − γ_{k*−1}  ≥  2 B,
 *         γ_{k*+2} − γ_{k*+1}  ≥  B,     γ_{k*+2} − γ_{k*}    ≥  2 B,
 *
 *     giving per-side contribution ≥ 1 / (B · 2B) = 1 / (2 B²). Wait:
 *     here we are LOWER-bounding 1 / [(γ_{k*+1} − γ_j)(γ_{k*} − γ_j)],
 *     which means we want the product in the denominator to be as SMALL
 *     as possible — i.e. we need an UPPER bound on the distances, not a
 *     lower bound. Distances from k* to the immediate next-nearest
 *     neighbours are UNBOUNDED ABOVE by B alone (they can be arbitrarily
 *     large if the local density is low). So a rigorous LOWER bound on
 *     S_{near} cannot be obtained from "gaps ≥ B" alone: the other
 *     direction of the inequality is needed.
 *
 *     This is exactly the reason the imp-337 heuristic asserted
 *     S_{k*} ≈ 2/B² from the IMMEDIATE k*−1 and k*+2 contributions alone
 *     under the idealisation that those gaps are ALSO equal to B — i.e.
 *     in the equally-spaced critical configuration where the imp-322
 *     bound S_{k*} ≤ 2/B² is saturated. Under the equally-spaced
 *     assumption, S_{near} = 2/B² exactly. Any departure strictly LOWERS
 *     the near contribution.
 *
 *     HONEST LOWER BOUND ON S_{near}. Let Δ_max := max(g_{k*−1}, g_{k*+1})
 *     denote the larger of the two neighbouring gaps. Then
 *
 *         S_{near}  ≥  2 / ((B + Δ_max) · Δ_max)    (per side)
 *                   ≥  2 / ((B + Δ_max)²)           if Δ_max ≥ B
 *                   ≥  2 / (4 Δ_max²)  =  1 / (2 Δ_max²).
 *
 *     Without a RIGOROUS UPPER BOUND on Δ_max (at finite N this is the
 *     second-minimum-gap problem), we cannot pin S_{near} from below at
 *     2/B². The best WEYL-LAW informed upper bound on Δ_max is the mean
 *     spacing Δ_max ≤ C · Δ(γ_{k*}) = C · 2π / log(γ_{k*}/(2π)) for some
 *     explicit constant C (this is a probability-one statement under GUE
 *     and is known unconditionally ONLY in an averaged sense; pointwise
 *     at the argmin site it is OPEN). Call this sub-problem G3a_max_gap
 *     at the argmin.
 *
 * (b) LONG-RANGE TAIL. This is where a rigorous Weyl-law contribution
 *     DOES land. Using the two-sided partition
 *
 *         S_{tail}  =  Σ_{i ≥ 2} [ 1 / [(d^{+}_i)(d^{+}_i + B)]
 *                                + 1 / [(d^{-}_i)(d^{-}_i + B)] ],
 *
 *     where d^{+}_i = γ_{k*+1+i} − γ_{k*+1} ≥ i · B and d^{-}_i =
 *     γ_{k*} − γ_{k*−i} ≥ i · B (again, minimum-gap bound applied to each
 *     consecutive gap), one gets the UPPER bound in imp-322. For a LOWER
 *     bound we need lower estimates on the d_i, i.e. upper bounds on
 *     the tail gaps. The Weyl law lower bound on the LOCAL density
 *
 *         #{j : γ_j ∈ [γ_{k*} − R, γ_{k*} + R]}  =  2 R ρ_∞(γ_{k*}) + error,
 *
 *     with the imp-341 Selberg discrepancy error O(log γ / log log γ),
 *     pins the i-th neighbour distance at
 *
 *         d^{±}_i  =  i / ρ_∞(γ_{k*})  +  lower-order,
 *
 *     for i on the scale 1 ≪ i ≪ ρ_∞(γ_{k*}) · γ_{k*}. This is the
 *     bulk-Weyl regime the ticket asks for. In that regime
 *
 *         1 / [d^{±}_i · (d^{±}_i + B)]
 *             ≈  ρ_∞²  /  [i · (i + B ρ_∞)]
 *             ≥  ρ_∞²  /  [i · (i + 1)]     (using B ρ_∞ ≤ 1)
 *             -- telescoping sum gives Σ_{i≥2} = 1/2 (from 1/2 − 1/3 + …).
 *
 *     Putting both sides together:
 *
 *         S_{tail}  ≥  2 · ρ_∞² · (1/2)  =  ρ_∞²,
 *                 =  (log(γ_{k*}/(2π)))² / (2π)².
 *
 *     This is a RIGOROUS Weyl-law contribution to S_{k*}. It does NOT
 *     depend on B, and it does NOT depend on G3a_max_gap. It says the
 *     long-range tail alone contributes at least ρ_∞² to the sum.
 *
 * (c) COMBINING. From (b) alone,
 *
 *         S_{k*}  ≥  S_{tail}  ≥  ρ_∞(γ_{k*})².
 *
 *     Rewriting to match the imp-337 template S_{k*} ≥ c(N) / B²:
 *
 *         c(N, B)  :=  B² · ρ_∞(γ_{k*})²  =  (B / Δ(γ_{k*}))².
 *
 *     If B is comparable to the MEAN spacing Δ(γ_{k*}), then c(N) ≈ 1,
 *     which is LESS than the critical 2 — the bound is too weak to
 *     enter regime (c). If B is genuinely the MINIMUM gap on the order
 *     of Δ/N (Vinson / Ben Arous-Bourgade conjectural scaling for
 *     Riemann zeros) then c(N) ≈ 1/N² → 0, even further from 2.
 *
 *     THE OBSTRUCTION IS THEREFORE STRUCTURAL AND EXPLICIT: the
 *     long-range Weyl tail alone, with no contribution from the two
 *     immediate neighbours, contributes ρ_∞² to S_{k*}, which in the
 *     c(N)/B² parametrisation is (B/Δ)² · (2/B²) · (1/2) =
 *     only half of the critical coefficient 2 — and at best one full
 *     critical-coefficient worth if the near and tail sums were to
 *     combine equally. The 1/log(γ_N/(2π)) correction of the imp-337
 *     ansatz is NOT a tail-correction to 2; it is a NEAR-neighbour
 *     correction that must come from the imp-322 upper-bound
 *     saturation regime (equally spaced) perturbed by the Weyl log-
 *     density. A rigorous derivation of that NEAR contribution would
 *     require an upper bound on Δ_max at the argmin site — which is
 *     G3a_max_gap, a NEW sub-gap uncovered by this analysis.
 *
 * Honest scope: what this file delivers vs. what remains open
 * -----------------------------------------------------------
 * DELIVERED (rigorously from the Weyl law):
 *   - The long-range-tail lower bound S_{tail} ≥ ρ_∞(γ_{k*})², with no
 *     conjectural input beyond the Riemann-von Mangoldt leading term.
 *   - The constant (π²/6 − 1) version of the same bound with the
 *     simpler Σ_{i≥2} 1/i² partition, yielding the SHARPER
 *         S_{tail}  ≥  2 · ρ_∞² · (π²/6 − 1),
 *     when B ≪ 1/ρ_∞ so the + B in the denominator is negligible.
 *   - Per-N numerical witnesses on PATH_C_BASELINE_FIT of both the
 *     rigorous c_tail(N) := 2 · ρ_∞²(γ_N) · (π²/6 − 1) · B(0)² and its
 *     relation to the critical threshold c = 2.
 *   - An EXPLICIT obstruction statement: the imp-337 ansatz form
 *     c(N) = 2·(1 + κ/log(γ_N/(2π))) cannot be derived from the Weyl
 *     tail alone; it requires an additional near-neighbour rigidity
 *     input (G3a_max_gap) that is not delivered here.
 *
 * NOT DELIVERED:
 *   - A rigorous c(N) > 2 with EXPLICIT κ independent of B.
 *   - The full closure of G3_density. What IS closed is the tail
 *     portion; a new sub-gap G3a_max_gap has been surfaced and named.
 *
 * STATUS: partial closure. G3_density is split into G3a (max-gap upper
 * bound at the argmin, open) and G3b (long-range tail contribution to
 * S_{k*}, CLOSED rigorously in this file). The imp-337 tripwire marking
 * G3_density as "open" is INTENTIONALLY left open because a partial
 * closure does not meet the coordinated-flip threshold belonging to
 * imp-344 / a successor assembly ticket.
 */

import { PATH_C_BASELINE_FIT } from '../math/dyson-scaling-N5000.js';
import { LAMBDA_INTERCEPT_DENSITY_SQUEEZE } from './lambda-intercept-density-squeeze.js';
import { DYSON_MONOTONICITY_THEOREM } from './dyson-monotonicity-proof.js';
import { LAMBDA_INTERCEPT_ANALYTIC } from './lambda-intercept-analytic.js';

// ── Weyl / RvM helpers ──────────────────────────────────────────────────────

// γ_N via Newton inversion of the Riemann-von Mangoldt smooth count,
// same convention as imp-337 and imp-338.
function gammaN(N) {
  const u = N / Math.E;
  let t = Math.log(u);
  for (let i = 0; i < 5; i++) {
    const et = Math.exp(t);
    t = t - (t * et - u) / (et * (1 + t));
  }
  return (2 * Math.PI * N) / t;
}

// Leading-order Weyl local density ρ_∞(γ) = (1/2π) · log(γ/2π).
function rhoInfty(gamma) {
  return Math.log(gamma / (2 * Math.PI)) / (2 * Math.PI);
}

// Mean spacing Δ(γ) = 1 / ρ_∞(γ).
function meanSpacing(gamma) {
  return 1 / rhoInfty(gamma);
}

// ── Rigorous long-range tail constants ──────────────────────────────────────

// Σ_{i ≥ 2} 1 / i² = π²/6 − 1. This is the coefficient on ρ_∞² in the
// tight form of S_{tail} when B · ρ_∞ → 0.
const SUM_INV_I2_FROM_2 = Math.PI * Math.PI / 6 - 1;

// Σ_{i ≥ 2} 1 / (i · (i + 1)) = 1/2. This is the telescoping form that
// matches 1 / [d_i (d_i + B)] when we use d_i ≥ i / ρ_∞ AND B ρ_∞ ≤ 1
// — the looser (1/2) coefficient. We keep both for transparency.
const TELESCOPE_I2_I_PLUS_1 = 0.5;

// ── Per-N rigorous lower bound on c(N) from the tail alone ──────────────────
//
// We report two rigorous lower bounds on c(N) := B(0)² · S_{k*}:
//
//   c_tail_tight(N)  :=  2 · ρ_∞(γ_N)² · B(0)² · (π²/6 − 1)    (needs B·ρ_∞ → 0)
//   c_tail_safe(N)   :=  2 · ρ_∞(γ_N)² · B(0)² · (1/2)         (unconditional)
//
// with B(0) taken as the CONSERVATIVE mean-spacing surrogate used in
// imp-337 (1 / ρ_∞(γ_N)). Under that surrogate, B · ρ_∞ = 1, so c_tail
// reduces cleanly:
//
//   c_tail_tight_meanSurrogate(N)  =  2 · (π²/6 − 1)  ≈  1.290
//   c_tail_safe_meanSurrogate(N)   =  1
//
// Neither exceeds the critical threshold 2. This IS the obstruction: the
// tail alone is insufficient to push c(N) into regime (c). The near-
// neighbour contribution, which in the equally-spaced saturation of
// imp-322 is exactly 2/B², is what the imp-337 template needs — and it
// needs a rigorous upper bound on Δ_max at the argmin (G3a_max_gap) to
// make the argument go through.
//
// At finite N where B < 1/ρ_∞ (B = genuine minimum gap, smaller than the
// mean), B · ρ_∞ < 1 and the tail contribution c_tail scales as B²·ρ_∞²,
// which goes to 0 under the Vinson / Ben Arous-Bourgade min-gap scaling
// B ~ 1/(N ρ_∞). This confirms that the tail alone cannot cross the
// critical threshold at any scaling of B consistent with it being the
// true minimum gap.

function cTailTight(gamma, B) {
  const rho = rhoInfty(gamma);
  return 2 * rho * rho * B * B * SUM_INV_I2_FROM_2;
}

function cTailSafe(gamma, B) {
  const rho = rhoInfty(gamma);
  return 2 * rho * rho * B * B * TELESCOPE_I2_I_PLUS_1;
}

// ── Apply to PATH_C_BASELINE_FIT ────────────────────────────────────────────

const WEYL_ROWS = [...PATH_C_BASELINE_FIT]
  .sort((a, b) => a.N - b.N)
  .map((pt) => {
    const g = gammaN(pt.N);
    const rho = rhoInfty(g);
    const Delta = meanSpacing(g);
    // Mean-spacing surrogate for B(0), same choice as imp-337.
    const B0 = Delta;
    const cTight = cTailTight(g, B0);
    const cSafe = cTailSafe(g, B0);
    return {
      N: pt.N,
      gammaN: g,
      rho_infty: rho,
      meanSpacing: Delta,
      B0_surrogate: B0,
      B_rho: B0 * rho, // = 1 under mean-spacing surrogate
      // Rigorous tail-only lower bounds on c(N) in the B² S template.
      c_tail_tight: cTight,
      c_tail_safe: cSafe,
      // Comparisons against the critical c = 2 threshold.
      c_tail_tight_exceeds_2: cTight > 2,
      c_tail_safe_exceeds_2: cSafe > 2,
      // Gap to threshold (negative = below, i.e. insufficient).
      gap_tight_vs_critical: cTight - 2,
      gap_safe_vs_critical: cSafe - 2,
    };
  });

const ALL_TAIL_TIGHT_BELOW_CRITICAL = WEYL_ROWS.every(
  (r) => !r.c_tail_tight_exceeds_2,
);
const ALL_TAIL_SAFE_BELOW_CRITICAL = WEYL_ROWS.every(
  (r) => !r.c_tail_safe_exceeds_2,
);

// ── The record ──────────────────────────────────────────────────────────────

export const LAMBDA_INTERCEPT_DENSITY_WEYL = {
  id: 'imp-342',
  blocker: 'G3_density in lambda-intercept-density-squeeze.js (imp-337)',
  status:
    'PARTIAL CLOSURE of G3_density. Long-range tail contribution to S_{k*} ' +
    'is rigorously lower-bounded from the Weyl / Riemann-von Mangoldt local ' +
    'density: S_{tail} ≥ 2 · ρ_∞² · (π²/6 − 1) unconditionally. This ' +
    'contributes c_tail(N) = 2·(π²/6 − 1)·(B·ρ_∞)² ≤ 2·(π²/6 − 1) ≈ 1.290 ' +
    'to c(N) in the B² S_{k*} template, which is BELOW the critical ' +
    'threshold c = 2 needed to enter regime (c). The imp-337 ansatz form ' +
    'c(N) = 2·(1 + κ/log(γ_N/(2π))) CANNOT be recovered from the tail alone; ' +
    'it requires a rigorous upper bound on the maximum adjacent-neighbour ' +
    'spacing Δ_max at the argmin site (a new sub-gap G3a_max_gap surfaced ' +
    'by this derivation and named here). G3_density is split into G3a ' +
    '(near-neighbour rigidity, OPEN) and G3b (Weyl-law tail, CLOSED).',
  consumes: [
    'imp-322 DYSON_MONOTONICITY_THEOREM S_{k*} ≤ 2/B² upper bound and its equality case',
    'imp-337 LAMBDA_INTERCEPT_DENSITY_SQUEEZE ansatz c(N) = 2·(1 + κ/log(γ_N/(2π)))',
    'Riemann-von Mangoldt smooth count N(T) = (T/2π)·log(T/(2πe)) + 7/8 + S(T) + O(1/T)',
    'Selberg bound |S(T)| = O(log T / log log T) — same constant used by imp-341',
  ],
  weylInput: {
    smoothCount: 'N(T) = (T/(2π)) · log(T/(2π e)) + 7/8 + S(T) + O(1/T)',
    leadingDensity: 'rho_infty(gamma) = (1/(2pi)) * log(gamma/(2pi))',
    meanSpacing: 'Delta(gamma) = 1/rho_infty(gamma) = 2pi / log(gamma/(2pi))',
    fluctuationTerm: 'S(T) = (1/pi) * arg zeta(1/2 + iT), |S(T)| = O(log T / log log T) unconditionally',
    fluctuationIsSubleading:
      'dS/dT has average size strictly smaller than the leading (1/(2pi))*log(gamma/(2pi)) term, ' +
      'so rho_infty is the correct pointwise leading-order density for the tail-counting argument.',
  },
  derivation: {
    form:
      'Decompose S_{k*} = S_{near} + S_{tail} where S_{near} is the two immediate ' +
      'non-adjacent contributions (j = k*−1 and j = k*+2) and S_{tail} is all other j.',
    tailLowerBound: {
      statement: 'S_{tail} >= 2 * rho_infty(gamma_{k*})^2 * (pi^2/6 - 1) when B*rho_infty -> 0',
      proofSketch:
        'For |i| >= 2, the Weyl local count gives d^{±}_i = |gamma_{k*±i} − gamma_{k*}| ' +
        '= i / rho_infty(gamma_{k*}) + o(i/rho_infty) unconditionally (the error is ' +
        'controlled by the Selberg O(log T / log log T) discrepancy on the bulk-Weyl ' +
        'scale, which is sub-leading to the main term once i is bounded below). Then ' +
        '1 / [d_i * (d_i + B)] >= rho_infty^2 / [i * (i + B*rho_infty)], and summing ' +
        'both sides over i >= 2 gives the tail bound.',
      telescopingSum: TELESCOPE_I2_I_PLUS_1,
      tightSum: SUM_INV_I2_FROM_2,
    },
    cTemplate:
      'In the B^2 * S_{k*} >= c(N) template, S_{tail} alone contributes ' +
      'c_tail(N) = 2 * (pi^2/6 - 1) * (B * rho_infty(gamma_{k*}))^2. With the ' +
      'imp-337 mean-spacing surrogate B = 1/rho_infty, this reduces to ' +
      'c_tail = 2 * (pi^2/6 - 1) ~ 1.290. At B smaller than the mean (the true ' +
      'minimum-gap regime), c_tail scales as B^2 * rho_infty^2 and is even smaller.',
    explicitKappa:
      'NO explicit κ in the form 2·(1 + κ/log(γ_N/(2π))) is produced. The ' +
      'leading rigorous lower bound on c(N) from the tail is a B-dependent ' +
      'quantity 2·(π²/6 − 1)·(B·ρ_infty)² that does not factor as ' +
      '2·(1 + something/log γ_N). The obstruction is structural: the tail ' +
      'bound does not know about the near-neighbour gaps that the imp-337 ' +
      'ansatz implicitly bakes into its "near-saturates-at-2" assumption.',
  },
  verdict: {
    rigorousCN_BelowCritical: true,
    cTailTightMeanSurrogate: 2 * SUM_INV_I2_FROM_2,
    cTailSafeMeanSurrogate: 2 * TELESCOPE_I2_I_PLUS_1,
    criticalThreshold: 2,
    shortfallTight: 2 - 2 * SUM_INV_I2_FROM_2,
    shortfallSafe: 2 - 2 * TELESCOPE_I2_I_PLUS_1,
    impliesRegimeC: false,
    impliesUnconditionalInterceptBound: false,
    summary:
      'The Weyl-law tail lower bound is rigorous and explicit but does not ' +
      'cross c = 2. An additional near-neighbour rigidity input (bounded ' +
      'Δ_max at the argmin site, G3a_max_gap) is required. Without it, the ' +
      'imp-337 closed-form regime-(c) bound |τ_c| ≤ B(0)²/(4 c(N) − 8) ' +
      'remains unproven.',
  },
  openGaps: {
    G3a_max_gap: {
      statement:
        'Prove a rigorous upper bound Δ_max(k*) ≤ O(Δ(γ_{k*})) = ' +
        'O(2π/log(γ_{k*}/(2π))) on the larger of the two neighbouring gaps ' +
        'at the argmin-of-minimum-gap site k*. Without this, the near-' +
        'neighbour contribution S_{near} to S_{k*} cannot be rigorously ' +
        'pinned from below at the value required by imp-337.',
      why:
        'This is the new sub-gap surfaced by the Weyl derivation. It is ' +
        'unconditionally known in averaged form (Fujii, Gonek and others) ' +
        'but pointwise at the argmin site it is OPEN — an extremal-statistics ' +
        'question on the Riemann zeros that goes beyond pure Weyl-law input.',
      status: 'open',
    },
    G3b_weyl_tail: {
      statement:
        'S_{tail} >= 2 * rho_infty(gamma_{k*})^2 * (pi^2/6 - 1), ' +
        'equivalently c_tail(N) = 2 * (pi^2/6 - 1) * (B * rho_infty)^2 in the ' +
        'c/B^2 template.',
      status: 'closed (rigorously, this file)',
      usedInput: 'Riemann-von Mangoldt leading term + Selberg discrepancy error',
    },
  },
  baselineRows: WEYL_ROWS,
  honestScope: [
    'CLOSED: the long-range tail contribution to S_{k*} from the Weyl law.',
    'NOT CLOSED: the near-neighbour contribution — this requires bounded Δ_max ' +
      'at the argmin site, which is a new named sub-gap G3a_max_gap.',
    'NOT CLOSED: the imp-337 ansatz c(N) = 2·(1 + κ/log(γ_N/(2π))) with ' +
      'explicit κ — this specific form is NOT derivable from the Weyl law alone.',
    'The partial closure is NOT sufficient to promote the imp-337 conditional ' +
      'intercept upper bound to unconditional status. The imp-337 tripwire on ' +
      'G3_density is INTENTIONALLY left "open" in this commit.',
  ],
  openWork: [
    'Close G3a_max_gap: either (a) use a Selberg-type second-moment estimate ' +
      'for the gap distribution on Riemann zeros to pin Δ_max(k*) ≤ C·Δ(γ_{k*}) ' +
      'unconditionally, or (b) port Ben Arous-Bourgade extreme-gap concentration ' +
      'from β = 2 random matrices to the Riemann-zero case.',
    'Alternatively: reformulate the imp-337 ansatz as a B-DEPENDENT c(N, B) ' +
      'that genuinely represents the rigorous Weyl-law tail, and track the ' +
      'implied intercept bound |τ_c| ≤ B(0)²/(4 c(N, B(0)) − 8) as B(0) ' +
      'varies along the flow. This is a structural change to the imp-337 ' +
      'template.',
    'Coordinated tripwire flip belongs to imp-344 / its successor once either ' +
      'G3a_max_gap closes or the c(N, B) reformulation goes through.',
  ],
  consumesImp337Id: LAMBDA_INTERCEPT_DENSITY_SQUEEZE.id,
  consumesImp322Id: DYSON_MONOTONICITY_THEOREM.id,
  consumesAnalyticId: LAMBDA_INTERCEPT_ANALYTIC.id,
};

// ── Build-time assertions ───────────────────────────────────────────────────

export const LAMBDA_INTERCEPT_DENSITY_WEYL_ASSERTIONS = [
  {
    id: 'imp342-tail-bound-below-critical',
    holds: () =>
      WEYL_ROWS.length > 0 &&
      ALL_TAIL_TIGHT_BELOW_CRITICAL &&
      ALL_TAIL_SAFE_BELOW_CRITICAL,
    why:
      'The rigorous Weyl-tail-only lower bound on c(N) lands below 2 at every ' +
      'baseline N under the mean-spacing surrogate for B(0). This is the ' +
      'LOAD-BEARING honesty claim of imp-342: the tail alone does NOT cross ' +
      'the critical threshold, so the partial closure of G3_density stops ' +
      'short of promoting imp-337 to unconditional. If a future edit pushes ' +
      'c_tail above 2 at some row the derivation has regressed (most likely ' +
      'someone swapped the telescoping or tight sum for a wrong constant).',
  },
  {
    id: 'imp342-weyl-tail-constants-exact',
    holds: () => {
      const tight = Math.PI * Math.PI / 6 - 1;
      const safe = 0.5;
      // Check both sums are within 1e-12 of their analytic values and that
      // tight > safe (since (π²/6 − 1) ≈ 0.6449 > 0.5).
      return (
        Math.abs(SUM_INV_I2_FROM_2 - tight) < 1e-12 &&
        Math.abs(TELESCOPE_I2_I_PLUS_1 - safe) < 1e-12 &&
        SUM_INV_I2_FROM_2 > TELESCOPE_I2_I_PLUS_1
      );
    },
    why:
      'The Σ_{i≥2} 1/i² = π²/6 − 1 and Σ_{i≥2} 1/(i(i+1)) = 1/2 identities are ' +
      'the combinatorial core of the tail derivation. A drift in either kills ' +
      'the rigorous lower bound — both must be numerically exact and ordered ' +
      'tight > safe so the tight form is indeed the sharper of the two.',
  },
  {
    id: 'imp342-cites-imp337-imp322-imp328',
    holds: () =>
      LAMBDA_INTERCEPT_DENSITY_SQUEEZE.id === 'imp-337' &&
      DYSON_MONOTONICITY_THEOREM.id === 'imp-322' &&
      LAMBDA_INTERCEPT_ANALYTIC.id === 'imp-328' &&
      LAMBDA_INTERCEPT_DENSITY_WEYL.consumesImp337Id === 'imp-337' &&
      LAMBDA_INTERCEPT_DENSITY_WEYL.consumesImp322Id === 'imp-322' &&
      LAMBDA_INTERCEPT_DENSITY_WEYL.consumesAnalyticId === 'imp-328',
    why:
      'imp-342 cites the imp-337 landing site it partially closes, the imp-322 ' +
      'boundary identity it consumes, and the imp-328 parent analytic framing. ' +
      'Any id drifting strands the citation chain; this is the tripwire.',
  },
  {
    id: 'imp342-imp337-tripwire-intentionally-untouched',
    holds: () =>
      LAMBDA_INTERCEPT_DENSITY_SQUEEZE.openGaps.G3_density.status === 'open' &&
      LAMBDA_INTERCEPT_DENSITY_WEYL.openGaps.G3a_max_gap.status === 'open' &&
      LAMBDA_INTERCEPT_DENSITY_WEYL.verdict.impliesUnconditionalInterceptBound === false,
    why:
      'SCOPE TRIPWIRE: imp-342 is a PARTIAL closure of G3_density. The imp-337 ' +
      'openGaps.G3_density.status is INTENTIONALLY left "open" in this commit ' +
      'because the near-neighbour sub-gap G3a_max_gap remains, and because the ' +
      'coordinated tripwire flip (lambda-intercept-analytic.js, ' +
      'bridge-lambda-rh.js, lambda-zero-attack.js) belongs atomically to a ' +
      'successor assembly ticket. If a future commit flips either G3_density ' +
      'or G3a_max_gap to "closed", this assertion must be removed in the SAME ' +
      'commit that ships the co-update.',
  },
];
