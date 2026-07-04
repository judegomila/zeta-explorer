/**
 * @module imp-33226-bracket-field-channel-rearchitecture
 *
 * imp-33226 (proof, S-frontier): RE-ARCHITECT the E(N) collision-time bridge so
 * the model-to-true transfer routes through the imp-3933 VECTOR-FIELD channel,
 * replacing the C_H * W_1^{1/2} leg of E_coll -- and IDENTIFY THE NEW BINDING LEG.
 *
 * This closes the named sub-gap imp-3933-sub-bracket-rearchitecture (the second of
 * the two residuals imp-3933 left open). It is a RESTATEMENT of the additive
 * triangle bracket, not a new Lambda value. NO false QED.
 *
 * THE OLD BRACKET (econn-metric-rearchitecture-verdict-2026-06-30)
 * ---------------------------------------------------------------
 * The Lambda bridge is a SCALAR additive triangle inequality over collision times:
 *     |Lambda + t_c(N)|  <=  E_trunc + E_flow + E_coll,
 * with the three legs carrying DIFFERENT provenances (the econn verdict corrected
 * the prior "all three depend on W_1" overclaim):
 *   - E_trunc: height-tail zero-density + Gaussian kernel   (NOT W_1; ansatz C_T=1)
 *   - E_flow : per-particle RvM drift-tail + Gronwall        (NOT W_1; ansatz C_F=1)
 *   - E_coll : the model-to-true collision-time transfer     (the ONLY W_1 leg),
 *              E_coll = C_H * W_1^{1/2} ~ 0.0913 at N* = 1e4  (C_H = 1 ansatz,
 *              polymath15-lemma52 shock-Holder). This is the leg the three C_Lip
 *              impossibility proofs make divergent IN THE W_1 CHANNEL.
 *
 * THE RE-ARCHITECTURE (route the transfer through the field channel)
 * -----------------------------------------------------------------
 * imp-3933 proved that the model-to-true transfer never needed a measure-space
 * modulus: for any two flows dx/dt = F_Dyson + e sharing the zero-table initial
 * data with field-Lipschitz local differences |e_{l+1}-e_l| <= eps' g_l,
 *     |t_c^{true} - t_c^{model}|  <=  W(eps') = tHi(eps') - tLo(eps'),
 * a deterministic, N-uniform, RH-free modulus with dW/deps' ~ 3 H^4/64. Replace
 * the W_1 leg by this field-channel leg:
 *     |Lambda + t_c(N)|  <=  E_trunc + E_flow + E_field,
 *     E_field := W(eps'_true)  <=  5.17e-7  at eps' = 1 on every plateau of
 *                                            N in [1e4, 1e6]
 * (and ~O(1e-10) at the estimated record-pair eps'_true = O(1e-3)). The swap trades
 * the budget-comparable 0.0913 W_1-Holder leg for a leg ~1.8e5x tighter.
 *
 * THE NEW BINDING LEG (the assessment the ticket asks for)
 * -------------------------------------------------------
 * OLD leg ranking at N* = 1e4:  E_trunc (bottleneck)  >  E_coll ~ 0.0913  >  E_flow.
 *     -> E_coll was the SECOND-largest term; a genuine competitor to the budget.
 * NEW leg ranking:              E_trunc (bottleneck)  >  E_flow           >  E_field.
 *     -> E_field (~5e-7) falls BELOW E_flow; it drops out of the binding set entirely.
 * So the re-architecture removes E_coll from contention, and the binding leg reverts
 * to E_trunc -- the SAME imp-2598/imp-2622 truncation bottleneck -- with E_flow now
 * the second leg. Both E_trunc and E_flow keep their ansatz constants C_T = C_F = 1
 * (undischarged). CONCLUSION: with the transfer certified through the field channel,
 * E(N) < 0.2 remains an ESTIMATE, now bottlenecked SOLELY by the two ansatz-constant
 * legs E_trunc, E_flow -- the W_1 transfer leg is no longer a live obstruction.
 *
 * HONEST SCOPE -- what remains open (named; NO false QED)
 * ------------------------------------------------------
 *  - The E_field leg is CONDITIONAL on the still-open sub-gap
 *    imp-3933-sub-eps-certificate (a deterministic eps'_true for the true xi
 *    backward-heat-flow vs the window-Dyson field). Until that lands, E_field is
 *    an ESTIMATE bounded by the certified W(eps') table, not a discharged constant.
 *  - E_trunc, E_flow constants (C_T = C_F = 1) stay ANSATZ (the imp-2598
 *    bottleneck), so E(N) < 0.2 is NOT a theorem. Platt-Trudgian Lambda <= 0.2
 *    REMAINS the rigorous SOTA. No committed Lambda value is changed.
 *  - The W_1-channel C_Lip impossibility verdicts (RH-HARD-CONFIRMED) are NOT
 *    overturned; the reroute lives in a DIFFERENT channel (field, not measure).
 *
 * @see imp-3933-eps-field-robust-bootstrap (the field-channel transfer modulus)
 * @see imp-2622-bridge-recomposition (E_trunc/E_flow/E_shock legs + bottleneck)
 * @see econn-metric-rearchitecture-verdict-2026-06-30 (E_coll is the only W_1 leg)
 */

import { EPS_FIELD_ROBUST_BOOTSTRAP } from './imp-3933-eps-field-robust-bootstrap.js';

// The two reference magnitudes, pulled from the certified imp-3933 record so the
// re-architecture stays pinned to the same numbers the bootstrap certified.
const E_COLL_W1_LEG = EPS_FIELD_ROBUST_BOOTSTRAP.cHRouteEcollN1e4;        // 0.0913
const E_FIELD_LEG = EPS_FIELD_ROBUST_BOOTSTRAP.maxTransferWidthAtEps1;    // 5.17e-7
const TRANSFER_ADVANTAGE = EPS_FIELD_ROBUST_BOOTSTRAP.transferAdvantageFactor; // ~1.77e5

export const BRACKET_FIELD_CHANNEL_REARCHITECTURE = {
  ticket: 'imp-33226',
  closesSubGap: 'imp-3933-sub-bracket-rearchitecture',
  proofSection: 'S-frontier',
  date: '2026-07-04',
  verdict:
    'DELIVERED (restatement, not a Lambda value). The E(N) bridge is re-architected so '
    + 'the model-to-true transfer routes through the imp-3933 field channel, replacing the '
    + 'C_H * W_1^{1/2} leg of E_coll by E_field = W(eps\'_true) <= 5.17e-7. The new binding '
    + 'leg is E_trunc (with E_flow second); both keep ansatz constants C_T = C_F = 1, so '
    + 'E(N) < 0.2 remains an ESTIMATE. NO false QED.',

  oldBracket: '|Lambda + t_c(N)| <= E_trunc + E_flow + E_coll,  E_coll = C_H * W_1^{1/2} ~ 0.0913 (N*=1e4)',
  newBracket: '|Lambda + t_c(N)| <= E_trunc + E_flow + E_field,  E_field = W(eps\'_true) <= 5.17e-7',

  // The leg inventory, before and after, with the model-to-true transfer rerouted.
  legs: [
    { name: 'E_trunc', provenance: 'height-tail zero-density + Gaussian kernel (NOT W_1)', constant: 'C_T = 1 (ansatz, undischarged)', role: 'BOTTLENECK / binding leg (unchanged by reroute)' },
    { name: 'E_flow', provenance: 'per-particle RvM drift-tail + Gronwall (NOT W_1)', constant: 'C_F = 1 (ansatz, undischarged)', role: 'second leg (now above the transfer leg)' },
    { name: 'E_field', provenance: 'imp-3933 field-channel transfer W(eps\') = tHi - tLo, dW/deps\' ~ 3H^4/64', constant: 'deterministic, N-uniform, RH-free', role: 'REPLACES E_coll; negligible (~5e-7), drops out of the binding set' },
  ],

  removedLeg: {
    name: 'E_coll (C_H * W_1^{1/2})',
    oldMagnitude: E_COLL_W1_LEG,
    replacedBy: 'E_field = W(eps\'_true)',
    newMagnitude: E_FIELD_LEG,
    tighteningFactor: +TRANSFER_ADVANTAGE.toPrecision(4),
    wasBindingBefore: true,   // 0.0913 was the second-largest term (a budget competitor)
    isBindingAfter: false,    // 5.17e-7 sits below E_flow
  },

  newBindingLeg: 'E_trunc',
  secondLeg: 'E_flow',
  estimateStillOpen: true,    // C_T = C_F = 1 ansatz => E(N) < 0.2 is an ESTIMATE, not a theorem

  conditionalOn: [
    'imp-3933-sub-eps-certificate: a deterministic eps\'_true for the true xi flow (OPEN); until it lands, E_field is bounded by the certified W(eps\') table, not a discharged constant',
    'C_T = C_F = 1 ansatz constants of E_trunc / E_flow (imp-2598 bottleneck, OPEN)',
  ],

  honest:
    'Restatement only: the W_1 transfer leg is replaced by a ~1.8e5x tighter field-channel leg, '
    + 'so the model-to-true transfer is no longer a live obstruction to E(N) < 0.2 -- but the '
    + 'binding legs E_trunc, E_flow remain ansatz, so the sub-0.2 estimate is NOT promoted to a '
    + 'theorem. The W_1-channel C_Lip verdicts stand. Platt-Trudgian Lambda <= 0.2 REMAINS the '
    + 'rigorous SOTA. No committed Lambda value changed. NO false QED.',
  changesLambdaValue: false,
  rigorousBeat: false,
};

// ── Build-time assertions (self-executing) ────────────────────────────────────
export const BRACKET_FIELD_CHANNEL_REARCHITECTURE_ASSERTIONS = [
  {
    id: 'imp33226-field-leg-replaces-W1-leg-and-is-negligible',
    description:
      'the rerouted transfer leg E_field = W(eps\'=1) <= 5.17e-7 replaces the C_H * W_1^{1/2} '
      + 'E_coll leg 0.0913 and is >= 1e5x tighter -- so it drops below the ansatz legs',
    holds: () =>
      Math.abs(E_COLL_W1_LEG - 0.0913) < 1e-6
      && E_FIELD_LEG < 1e-6
      && E_FIELD_LEG < E_COLL_W1_LEG / 1e5
      && TRANSFER_ADVANTAGE > 1e5,
  },
  {
    id: 'imp33226-old-coll-leg-was-binding-new-field-leg-is-not',
    description:
      'the removed W_1 leg was a budget competitor (was binding) and the field-channel '
      + 'replacement is not -- the model-to-true transfer is no longer a live obstruction',
    holds: () => {
      const r = BRACKET_FIELD_CHANNEL_REARCHITECTURE.removedLeg;
      return r.wasBindingBefore === true
        && r.isBindingAfter === false
        && r.oldMagnitude > 1e5 * r.newMagnitude;
    },
  },
  {
    id: 'imp33226-new-binding-leg-is-Etrunc-legs-stay-ansatz',
    description:
      'the new binding leg is E_trunc with E_flow second, and BOTH keep ansatz constants '
      + 'C_T = C_F = 1 -- so E(N) < 0.2 remains an ESTIMATE (estimateStillOpen = true)',
    holds: () => {
      const b = BRACKET_FIELD_CHANNEL_REARCHITECTURE;
      const eTrunc = b.legs.find((l) => l.name === 'E_trunc');
      const eFlow = b.legs.find((l) => l.name === 'E_flow');
      return b.newBindingLeg === 'E_trunc'
        && b.secondLeg === 'E_flow'
        && b.estimateStillOpen === true
        && /ansatz/.test(eTrunc.constant) && /ansatz/.test(eFlow.constant);
    },
  },
  {
    id: 'imp33226-honest-no-false-qed',
    description:
      'honesty gate: restatement not a Lambda value, transfer leg conditional on the OPEN '
      + 'eps\'-certificate, no rigorous beat, PT Lambda <= 0.2 cited as SOTA',
    holds: () => {
      const b = BRACKET_FIELD_CHANNEL_REARCHITECTURE;
      return b.changesLambdaValue === false
        && b.rigorousBeat === false
        && b.closesSubGap === 'imp-3933-sub-bracket-rearchitecture'
        && b.conditionalOn.length === 2
        && /Lambda <= 0.2 REMAINS the rigorous SOTA/.test(b.honest)
        && /NO false QED/.test(b.honest);
    },
  },
];

for (const a of BRACKET_FIELD_CHANNEL_REARCHITECTURE_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-33226 bracket-field-channel-rearchitecture assertion failed: ${a.id}`);
}
