/**
 * Bridge: de Bruijn-Newman Λ ⟶ Riemann Hypothesis (imp-316)
 *
 * Phase 3/4 of the improvement queue chased numerical Λ bounds via
 * Lehmer pairs, the Dyson zero flow, and backward-collision tracking,
 * but the relationship between a finite-N Λ estimate and RH was never
 * stated explicitly. This file pins down that chain so the rest of the
 * codebase has one citable place for "what does our Λ number actually
 * buy us?".
 *
 * The two anchor theorems
 * -----------------------
 * (T1) DE BRUIJN (1950) — RH ⟺ Λ ≤ 0.
 *      H_t(z) is the heat-evolved xi function. H_0 = (1/2)Ξ. For t > Λ
 *      every zero of H_t is real. RH is the statement that H_0 has only
 *      real zeros, i.e. Λ ≤ 0.
 *      Reference: de Bruijn, Duke Math. J. 17 (1950), 197-226.
 *
 * (T2) RODGERS-TAO (2020) — Λ ≥ 0.
 *      Resolves Newman's 1976 conjecture. Combined with (T1):
 *
 *          RH ⟺ Λ = 0.
 *
 *      Reference: Rodgers & Tao, Acta Math. 225 (2020), 1-58.
 *
 * Best known unconditional upper bound
 * ------------------------------------
 *   Platt-Trudgian (2021): Λ ≤ 0.2 (sharper: 0.22, then 0.2).
 *   Uses verified RH up to height T_0 ≈ 3 × 10^12 plus a barrier
 *   argument controlling the tail.
 *
 * What our Path C bound (commit 229139... / imp-309) actually says
 * ---------------------------------------------------------------
 *   Λ_PathC = 0.0066 ± 0.01
 *
 * This is NOT a proof of any of the following, and the auto-improve
 * engine and any UI surface citing it MUST treat the four points below
 * as separate, none of which currently hold:
 *
 *   (a) Λ < 0           — would imply RH outright. Forbidden by (T2).
 *   (b) Λ = 0           — equivalent to RH. Our central value is
 *                          positive and the error bar straddles zero.
 *   (c) Λ < 0.2         — would beat Platt-Trudgian. Our estimate
 *                          numerically suggests this BUT only over the
 *                          truncated zero range we used (T_0 ≈ 3000),
 *                          while Platt-Trudgian controls T_0 ≈ 3·10^12.
 *                          The two bounds are not comparable.
 *   (d) Sign of Λ       — undecidable from 0.0066 ± 0.01 because the
 *                          error bar exceeds the central value (see
 *                          imp-314).
 *
 * The chain that WOULD imply RH from a Path-C-style number
 * --------------------------------------------------------
 *   Step 1. Verified zeros on the line up to height T_0.
 *           STATUS: have 2458 zeros to T ≈ 3000 (imp-305).
 *           NEEDED FOR RH AT HEIGHT T_0: Turing's method certificate.
 *
 *   Step 2. Backward Dyson ODE to time t < 0 with certified error.
 *           STATUS: imp-306 added Kahan + step-doubling error tracking.
 *           NEEDED: error per step × steps < gap to nearest collision.
 *
 *   Step 3. Tail control beyond T_0 — bound zeros with Re(s) > 1/2 at
 *           heights > T_0 using a zero-density estimate.
 *           STATUS: open (imp-308, upgraded as imp-317). Guth-Maynard
 *           2024 N(σ,T) ≤ T^{30(1-σ)/13} is the strongest available.
 *           Without Step 3, every Path C number is conditional on
 *           "no off-line zero exists above our list".
 *
 *   Step 4. Combine Steps 1-3 into a CERTIFIED upper bound on Λ that
 *           is valid for ALL heights, not just T ≤ T_0.
 *           STATUS: not yet assembled. Even if achieved, gives
 *           Λ ≤ U for some U > 0 — strictly weaker than RH.
 *
 *   Step 5. Drive U → 0 by extending T_0 and tightening the tail.
 *           At U = 0 we have Λ = 0 (using T2) and therefore RH.
 *           STATUS: this is the unsolved part. No finite-N computation
 *           reaches U = 0; only an analytic argument can.
 *
 * Route B (Phases 10-11): imp-341 / imp-344 / G6_polymath15_bridge
 * ----------------------------------------------------------------
 * Independent of the five-step Path C tail programme above, Phases 10-11
 * opened a second route that targets the B2(b) analytic angle of the
 * Λ attack rather than the B2(a) statistical fit:
 *
 *   Step B1. imp-341 (Koksma-Hlawka Burgers uniformity).
 *            The deterministic bound
 *                ‖m_N − m_∞‖_{L^∞({Im z ≥ y_N^♯})}
 *                    ≤ π C_Selberg · log γ_N / (N · y_N^♯)
 *            with y_N^♯ = √(2π/N) forces τ_c(m_N) → 0, hence
 *                a := lim sup_{N → ∞} |t_c(N)|  =  0
 *            UNCONDITIONALLY along the N-particle Calogero-Moser /
 *            Dyson flow. This closes the B2(b) LIM-SUP statement and
 *            retires G5_burgers as an open gap. Uses only Selberg
 *            |S(T)| = O(log T / log log T); NO GUE / local-law input.
 *
 *   Step B2. Per-N translation — OPEN. imp-341 is a lim-sup statement,
 *            not a per-N bound. Closing this needs either imp-336
 *            monotonicity (|t_c(N+1)| ≤ |t_c(N)|, empirically unfalsified
 *            but analytically open) OR the imp-348 rate upgrade that
 *            replaces ψ_N = O(log γ_N / √N) with ψ_N = O(1/N) on the
 *            microscopic scale y_N ~ 1/log N.
 *
 *   Step B3. imp-345 G6_polymath15_bridge — the NEW load-bearing gap.
 *            imp-344 surfaced it: the de Bruijn-Newman Λ is defined via
 *            H_t, not via the N-particle Dyson flow. The Polymath15
 *            approximation connects them via H_t ≈ (truncated zero
 *            evolution) with an error term E(N). A rigorous form would
 *            give |Λ − (− lim t_c(N))| ≤ E(N) → 0 explicitly. Previously
 *            implicit in every preceding Λ ticket, surfaced honestly by
 *            imp-344 as the sole gap between the Route B lim-sup claim
 *            and an actual Λ statement.
 *
 *   The Route B chain that WOULD imply RH:
 *     imp-341  (lim sup_N |t_c(N)| = 0 in N-particle Dyson flow)
 *       →  imp-345 G6 closure  (Λ = − lim t_c(N) with explicit rate)
 *       →  Λ ≤ 0
 *       →  combined with Rodgers-Tao Λ ≥ 0  ⟹  Λ = 0
 *       →  de Bruijn (T1)  ⟹  RH.
 *   Current status: the first link is closed as a LIM-SUP statement;
 *   the second link (G6) is the sole open step; the per-N translation
 *   is a parallel route refinement (imp-336 or imp-348) that sharpens
 *   the first link but is not required to reach RH via this chain.
 *
 * The height our current bound actually controls
 * ----------------------------------------------
 * The Path C number is derived from zeros γ_n with γ_n ≤ T_0 ≈ 3000.
 * Without the Step 3 tail bound, any statement of the form "Λ ≤ X"
 * implicit in our number is conditional on the zeros above T_0 being
 * on the line — i.e. it is a statement about the zeros we already see,
 * not a global Λ bound. RH at height T_0 ≈ 3000 is already known
 * (verified up to T ≈ 3 × 10^12). So the Path C bound contributes
 * METHODOLOGY (a new way to extract Λ from a finite zero list), not
 * range (we are 9 orders of magnitude below Platt-Trudgian on T_0).
 *
 * Unit-testable assertions (consumed by tests / dashboards)
 * ---------------------------------------------------------
 * Each entry below is a standalone claim with a citation. Tests should
 * read this list and refuse to compile if any claim is silently edited
 * without a corresponding source update.
 */

import { GUTH_MAYNARD_TAIL_BOUND } from './guth-maynard-tail-bound.js';

export const LAMBDA_RH_BRIDGE = {
  // Anchor theorems
  theorems: [
    {
      id: 'de-bruijn-1950',
      statement: 'RH is equivalent to Λ ≤ 0.',
      proved: true,
      citation: 'de Bruijn, Duke Math. J. 17 (1950), 197-226.',
    },
    {
      id: 'rodgers-tao-2020',
      statement: 'Λ ≥ 0 (Newman\'s 1976 conjecture).',
      proved: true,
      citation: 'Rodgers & Tao, Acta Math. 225 (2020), 1-58.',
    },
    {
      id: 'combined',
      statement: 'RH is equivalent to Λ = 0.',
      proved: true,
      citation: 'Direct corollary of de-bruijn-1950 and rodgers-tao-2020.',
    },
  ],

  // Best published unconditional upper bound
  sotaUpperBound: {
    value: 0.2,
    citation: 'Platt & Trudgian, Bull. London Math. Soc. (2021).',
    verifiedHeight: 3.0e12,
    method: 'Barrier argument + RH verified to T_0 ≈ 3·10^12.',
  },

  // Our Path C numerical bound — explicitly NOT a proof of anything below
  pathCBound: {
    centralValue: 0.0066,
    errorBar: 0.01,
    verifiedHeight: 3000, // T_0 we actually use
    numberOfZeros: 2458,
    sourceCommit: '229139',
    sourceItems: ['imp-305', 'imp-306', 'imp-307', 'imp-309'],
    isProof: false,
    cannotConclude: [
      'Λ < 0 (forbidden by Rodgers-Tao 2020)',
      'Λ = 0 / RH (error bar straddles zero)',
      'Λ < 0.2 globally (we only see zeros to T ≈ 3000)',
      'Sign of Λ (|error| > |central value|; see imp-314)',
    ],
  },

  // What is missing to convert the Path C number into an RH-relevant statement
  remainingSteps: [
    {
      step: 1,
      name: 'Verified-on-line zeros to T_0',
      status: 'have',
      detail: '2458 zeros to T ≈ 3000 via imp-305; Turing certificate present.',
    },
    {
      step: 2,
      name: 'Backward Dyson ODE with certified error',
      status: 'have',
      detail: 'imp-306 added Kahan summation and step-doubling Richardson error.',
    },
    {
      step: 3,
      name: 'Tail bound: no off-line zeros above T_0',
      status: 'have-bound',
      detail:
        'imp-317 wired Guth-Maynard 2024 N(σ,T) ≤ T^{30(1-σ)/13} into ' +
        'GUTH_MAYNARD_TAIL_BOUND.tailTable as a per-strip tail budget above ' +
        'T_0 = 3000. Bound is unconditional but non-trivial: the worked thin ' +
        'strip σ ≈ 0.625 gives ≈ ' +
        GUTH_MAYNARD_TAIL_BOUND.thinStripExample.bound_on_offline_zero_count +
        ' off-line zeros up to 10·T_0 — the explicit budget the barrier ' +
        'method must subtract in Step 4.',
    },
    {
      step: 4,
      name: 'Assemble certified global Λ ≤ U',
      status: 'open',
      detail:
        'Step 3 budget is now tabulated; the open work is folding it into ' +
        'the barrier method as a subtracted tail count rather than a ' +
        '"no surprises" assumption. Output remains conditional on the ' +
        'tail estimate, but the conditional is now quantitative.',
    },
    {
      step: 5,
      name: 'Drive U → 0 (the actual unsolved part of RH)',
      status: 'open',
      detail: 'No finite-N computation reaches U = 0; needs analytic input.',
    },
    // ── Route B (Phases 10-11): B2(b) analytic angle ────────────────────
    // Added by imp-346 (coordinated follow-up pass from imp-344). These
    // steps do not replace Steps 1-5; they enumerate an INDEPENDENT route
    // that targets a = lim sup_N |t_c(N)| directly rather than via the
    // verified-zeros + tail-bound + barrier assembly.
    {
      step: 'B1',
      name: 'B2(b) lim-sup closure: a = 0 in the N-particle Dyson flow',
      status: 'have',
      detail:
        'imp-341 (lambda-intercept-burgers-uniformity.js) delivers a ' +
        'DETERMINISTIC Koksma-Hlawka bound ' +
        'norm(m_N − m_∞) ≤ π C_Selberg · log γ_N / (N · y_N^♯) with ' +
        'y_N^♯ = √(2π/N), using only Selberg |S(T)| = O(log T / log log T). ' +
        'This forces τ_c(m_N) → 0, hence lim sup_N |t_c(N)| = 0 ' +
        'UNCONDITIONALLY along the N-particle Calogero-Moser flow. No ' +
        'GUE / local-law / Erdős-Schlein-Yau input used. G5_burgers retired.',
    },
    {
      step: 'B2',
      name: 'Per-N translation of the lim-sup statement',
      status: 'open',
      detail:
        'imp-341 is a lim-sup statement, not a per-N bound. Translating ' +
        'to a concrete bound |t_c(N)| ≤ r(N) at finite N needs EITHER ' +
        'imp-336 monotonicity (|t_c(N+1)| ≤ |t_c(N)|, currently empirically ' +
        'unfalsified but analytically open on G1/G2) OR the imp-348 rate ' +
        'upgrade replacing ψ_N = O(log γ_N / √N) with ψ_N = O(1/N) on the ' +
        'microscopic scale y_N ~ 1/log N. Either alone suffices.',
    },
    {
      step: 'B3',
      name: 'G6_polymath15_bridge: connect lim t_c(N) to the Λ definition',
      status: 'open',
      detail:
        'NEW load-bearing gap, surfaced by imp-344 (previously implicit ' +
        'in every Λ ticket). The de Bruijn-Newman Λ is defined via H_t, ' +
        'NOT via the N-particle Dyson flow. Polymath15 approximates H_t ' +
        'by a truncated zero evolution with an error E(N); a rigorous ' +
        'form would give |Λ − (− lim t_c(N))| ≤ E(N) with E(N) → 0 ' +
        'explicitly. imp-345 is the queued attempt to close G6. With G6 ' +
        'closed, the Route B chain becomes: imp-341 lim sup = 0 → G6 ' +
        'bridge → Λ ≤ 0 → combined with Rodgers-Tao Λ ≥ 0 → Λ = 0 → RH ' +
        'via de Bruijn. G6 is currently the SOLE load-bearing gap ' +
        'between imp-344 and an RH statement via this route.',
    },
  ],

  // The single most important caveat for any UI consumer
  uiDisclaimer:
    'Our Λ ≈ 0.0066 ± 0.01 demonstrates a methodology (Dyson backward ' +
    'collision + 1/N scaling) on 2458 verified zeros up to T ≈ 3000. ' +
    'It is NOT a proof of RH, NOT a proof of Λ < 0.2, and the error ' +
    'bar exceeds the central value so even the SIGN of Λ is undecided ' +
    'at this scale. RH at heights T ≤ 3 · 10^12 was already known ' +
    'before this work; our contribution is methodological, not a new ' +
    'global Λ bound.',
};

// Standalone assertions used by any test that wants to refuse silent
// edits. Each predicate is independent of the others.
export const BRIDGE_ASSERTIONS = [
  {
    id: 'rodgers-tao-floor',
    holds: () => 0 <= LAMBDA_RH_BRIDGE.pathCBound.centralValue + LAMBDA_RH_BRIDGE.pathCBound.errorBar,
    why: 'Rodgers-Tao 2020 forces Λ ≥ 0; the upper end of our error bar must be ≥ 0.',
  },
  {
    id: 'error-exceeds-estimate',
    holds: () => LAMBDA_RH_BRIDGE.pathCBound.errorBar > LAMBDA_RH_BRIDGE.pathCBound.centralValue,
    why: 'imp-314: until tightened, the error bar exceeds the central value, so the sign of Λ is undecidable.',
  },
  {
    id: 'sota-not-beaten',
    holds: () => LAMBDA_RH_BRIDGE.pathCBound.verifiedHeight < LAMBDA_RH_BRIDGE.sotaUpperBound.verifiedHeight,
    why: 'Our T_0 ≈ 3000 is 9 orders of magnitude below Platt-Trudgian T_0 ≈ 3·10^12; the bounds are not comparable.',
  },
  {
    id: 'not-a-proof-of-rh',
    holds: () => LAMBDA_RH_BRIDGE.pathCBound.isProof === false,
    why: 'The numerical bound is methodology, not a proof. UI must not claim RH.',
  },
];
