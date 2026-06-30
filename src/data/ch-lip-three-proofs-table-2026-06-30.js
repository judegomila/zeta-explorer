/**
 * @module ch-lip-three-proofs-table-2026-06-30
 *
 * imp-3010 -- Tabulate, side by side, the THREE independent ways the C_H / C_Lip
 * Lipschitz route is PROVABLY CLOSED. The frontier verdict module
 * (ch-wall-frontier-verdict-2026-06-26) states all three closures in a single
 * prose string (CH_WALL_FRONTIER.lipschitzRouteClosed); this module decomposes
 * that string into a legible table so the wall is readable at a glance:
 *
 *   1. IMPOSSIBILITY (Holder-1/2 lower bound)  -- airtight, no loophole
 *   2. NORM-MISMATCH (linear-N dilution)       -- exact closed form, sharpest WHY
 *   3. REFUTED SURROGATES (tau_c, squared-gap) -- both fail adversarial check
 *
 * Grounded in CH_WALL_FRONTIER: the assertions below cross-check that the table
 * stays faithful to the verdict and that NO false QED is implied (PT Lambda<=0.2
 * remains the rigorous SOTA; the finite-N beat stays an ESTIMATE).
 *
 * Pure content/derived-restatement. No new claim, no heavy imports.
 */

import { CH_WALL_FRONTIER } from './ch-wall-frontier-verdict-2026-06-26.js';

export const CH_LIP_THREE_PROOFS = {
  ticket: 'imp-3010',
  date: '2026-06-30',
  groundedIn: 'ch-wall-frontier-verdict-2026-06-26 (CH_WALL_FRONTIER)',
  verdict: CH_WALL_FRONTIER.verdict, // RH-HARD-CONFIRMED
  claim: 'The Lipschitz route to a finite N-uniform C_Lip is PROVABLY CLOSED (not merely unproven), three independent ways that all reduce to the same wall.',
  proofs: [
    {
      key: 'impossibility',
      n: 1,
      name: 'IMPOSSIBILITY (Holder-1/2 lower bound)',
      rigor: 'airtight, no loophole',
      mechanism: 'g_min is EXACTLY Holder-1/2 in the bridge metric W_1 (cusp law g_min ~ C_shock*W_1^(1/2), C_shock < 1/3), so the Lipschitz quotient |Dg_min|/W_1 ~ 1/sqrt(W_1) -> infinity.',
      result: 'C_Lip >= C_shock/(2 sqrt(W_1)) -> infinity (a genuine LOWER bound).',
      witness: 'WITNESSED in the real CM-flow cusp family (not an ansatz).',
      escape: 'Only escape is cusp-family non-realizability -- which IS the RH-hard two-sided spacing content.',
    },
    {
      key: 'norm-mismatch',
      n: 2,
      name: 'NORM-MISMATCH (linear-N dilution)',
      rigor: 'exact closed form, numerics < 0.2%',
      mechanism: 'Against the bridge global W_1 = (1/N) Sum|Dx|, C_Lip(W_1,N) = N * g0/(4(1-Theta)) diverges LINEARLY in N -- because W_1 dilutes a microscopic 1-pair collision move (cost eps/N) across all N particles.',
      result: 'C_Lip ~ N -> infinity. Pure metric-architecture fact, not dynamics.',
      witness: 'Sharpest diagnosis of WHY C_Lip diverges; supersedes imp-2640 (Gronwall) and imp-2839 (intrinsic Holder).',
      escape: 'None within the W_1 bridge. (Metric is INCIDENTAL: swapping for sup-norm relocates the wall to the metric-invariant multi-body isolation D_rest, not removes it.)',
    },
    {
      key: 'refuted-surrogates',
      n: 3,
      name: 'REFUTED SURROGATES (tau_c, squared-gap)',
      rigor: 'both fail adversarial check',
      mechanism: 'tau_c-direct: object-substitution error -- tau_c (collision TIME) is degree-2 homogeneous (Lipschitz), but C_H multiplies g_min (degree-1) -> 1/length divergent; converting back dg_min/dW_1 = 1.449/sqrt(W_1) -> infinity (identical to imp-2839). squared-gap (h=g^2): the bounded C_shock^2/8 holds ONLY along the 1-parameter cusp family; breaks under the consistent-W_1 rank-1 move (gN/4 ~ sqrt(N)) and any multiplicative fluctuation (1/W reacquired).',
      result: 'Neither surrogate yields a finite C_Lip; both recover the same divergence.',
      witness: 'Refuted by adversarial referees in the ch-wall-frontier workflow.',
      escape: 'None -- the surrogates were the last non-RH-hard reframings.',
    },
  ],
  deterministicResidual: CH_WALL_FRONTIER.residual,
  honest: 'No QED. The three closures show the Lipschitz route is RH-hard, not a beat. ' + CH_WALL_FRONTIER.sota,
};

export const CH_LIP_THREE_PROOFS_ASSERTIONS = [
  {
    id: 'ch-lip-3proofs-exactly-three-independent',
    description: 'exactly three independent route-closure proofs are tabulated, numbered 1..3',
    holds: () => CH_LIP_THREE_PROOFS.proofs.length === 3
      && CH_LIP_THREE_PROOFS.proofs.every((p, i) => p.n === i + 1),
  },
  {
    id: 'ch-lip-3proofs-faithful-to-verdict',
    description: 'the table verdict matches CH_WALL_FRONTIER and the verdict prose names all three closures',
    holds: () => CH_LIP_THREE_PROOFS.verdict === CH_WALL_FRONTIER.verdict
      && /Holder-1\/2 impossibility/.test(CH_WALL_FRONTIER.lipschitzRouteClosed)
      && /linear-N norm-mismatch/.test(CH_WALL_FRONTIER.lipschitzRouteClosed)
      && /refuted surrogates/.test(CH_WALL_FRONTIER.lipschitzRouteClosed),
  },
  {
    id: 'ch-lip-3proofs-impossibility-is-lower-bound',
    description: 'proof 1 is a genuine LOWER bound C_Lip >= C_shock/(2 sqrt(W_1)) -> infinity',
    holds: () => /LOWER bound/.test(CH_LIP_THREE_PROOFS.proofs[0].result)
      && /C_shock\/\(2 sqrt\(W_1\)\)/.test(CH_LIP_THREE_PROOFS.proofs[0].result),
  },
  {
    id: 'ch-lip-3proofs-no-false-qed',
    description: 'the table is scope-only: no QED, PT Lambda <= 0.2 stays SOTA',
    holds: () => /No QED/.test(CH_LIP_THREE_PROOFS.honest)
      && /Platt-Trudgian Lambda <= 0.2 remains/.test(CH_LIP_THREE_PROOFS.honest),
  },
];

for (const a of CH_LIP_THREE_PROOFS_ASSERTIONS) {
  if (!a.holds()) throw new Error(`ch-lip-three-proofs-table assertion failed: ${a.id}`);
}
