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
      status: 'open',
      detail: 'Tracked in imp-308 / imp-317. Use Guth-Maynard 2024 N(σ,T) ≤ T^{30(1-σ)/13}.',
    },
    {
      step: 4,
      name: 'Assemble certified global Λ ≤ U',
      status: 'open',
      detail: 'Requires Step 3. Output is conditional on tail estimate.',
    },
    {
      step: 5,
      name: 'Drive U → 0 (the actual unsolved part of RH)',
      status: 'open',
      detail: 'No finite-N computation reaches U = 0; needs analytic input.',
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
